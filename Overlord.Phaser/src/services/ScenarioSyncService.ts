/**
 * ScenarioSyncService - Cloud Sync for Scenario Completions
 *
 * Extends the local ScenarioCompletionService with cloud synchronization
 * and leaderboard functionality.
 */

import { getSupabaseClient } from './SupabaseClient';
import { getAuthService } from './AuthService';
import {
  ScenarioCompletionService,
  ScenarioCompletion,
  getCompletionService,
} from '@core/ScenarioCompletionService';

/**
 * Leaderboard entry for scenario rankings
 */
export interface LeaderboardEntry {
  username: string;
  bestTimeSeconds: number;
  starsEarned: number;
  completedAt: string;
}

/**
 * Result of sync operations
 */
export interface ScenarioSyncResult {
  success: boolean;
  synced: number;
  errors: string[];
}

/**
 * ScenarioSyncService singleton class
 * Manages scenario completion sync between local and cloud
 */
class ScenarioSyncService {
  private static instance: ScenarioSyncService | null = null;
  private localService: ScenarioCompletionService;

  private constructor() {
    this.localService = getCompletionService();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ScenarioSyncService {
    if (!ScenarioSyncService.instance) {
      ScenarioSyncService.instance = new ScenarioSyncService();
    }
    return ScenarioSyncService.instance;
  }

  /**
   * Record a scenario completion to both local and cloud storage
   *
   * @param scenarioId - Scenario identifier
   * @param timeSeconds - Completion time in seconds
   * @param stars - Star rating (0-3)
   * @param scenarioPackId - Optional pack identifier
   */
  public async recordCompletion(
    scenarioId: string,
    timeSeconds: number,
    stars: number,
    scenarioPackId?: string
  ): Promise<{ success: boolean; error?: string }> {
    // Always save locally first
    this.localService.markCompleted(scenarioId, timeSeconds, stars);

    // Try to save to cloud if authenticated
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return { success: true }; // Local save succeeded
    }

    try {
      await this.saveCompletionToCloud(scenarioId, timeSeconds, stars, scenarioPackId);
      return { success: true };
    } catch (error) {
      console.warn('Cloud completion save failed:', error);
      return {
        success: true, // Local succeeded
        error: error instanceof Error ? error.message : 'Cloud sync failed',
      };
    }
  }

  /**
   * Sync all local completions to cloud
   * Call after login to migrate existing completions
   */
  public async syncCompletionsToCloud(): Promise<ScenarioSyncResult> {
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return { success: false, synced: 0, errors: ['Not authenticated or offline'] };
    }

    const localCompletions = this.localService.getAllCompletions();
    let synced = 0;
    const errors: string[] = [];

    for (const completion of localCompletions) {
      try {
        await this.saveCompletionToCloud(
          completion.scenarioId,
          completion.bestTimeSeconds,
          completion.starRating
        );
        synced++;
      } catch (error) {
        const errorMsg = `Failed to sync ${completion.scenarioId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { success: errors.length === 0, synced, errors };
  }

  /**
   * Fetch completions from cloud and merge with local
   */
  public async fetchAndMergeFromCloud(): Promise<ScenarioCompletion[]> {
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return this.localService.getAllCompletions();
    }

    try {
      const cloudCompletions = await this.fetchCompletionsFromCloud();

      // Merge cloud data into local (cloud wins for better scores)
      for (const cloud of cloudCompletions) {
        const local = this.localService.getCompletion(cloud.scenarioId);

        if (!local) {
          // No local record - use cloud data
          this.localService.markCompleted(
            cloud.scenarioId,
            cloud.bestTimeSeconds,
            cloud.starRating
          );
        } else {
          // Both exist - keep best scores
          const bestTime = Math.min(local.bestTimeSeconds, cloud.bestTimeSeconds);
          const bestStars = Math.max(local.starRating, cloud.starRating);

          if (bestTime < local.bestTimeSeconds || bestStars > local.starRating) {
            this.localService.markCompleted(cloud.scenarioId, bestTime, bestStars);
          }
        }
      }

      return this.localService.getAllCompletions();
    } catch (error) {
      console.warn('Failed to fetch cloud completions:', error);
      return this.localService.getAllCompletions();
    }
  }

  /**
   * Get leaderboard for a specific scenario
   *
   * @param scenarioId - Scenario identifier
   * @param limit - Maximum entries to return (default 100)
   */
  public async getLeaderboard(scenarioId: string, limit = 100): Promise<LeaderboardEntry[]> {
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return [];
    }

    const supabase = getSupabaseClient();

    try {
      // Use the database function for optimized leaderboard query
      // Cast to any to bypass Supabase's strict typing for RPC calls
      const { data, error } = await (supabase as any).rpc('get_scenario_leaderboard', {
        p_scenario_id: scenarioId,
        p_limit: limit,
      });

      if (error) {
        throw error;
      }

      // Cast to expected shape
      type LeaderboardRow = {
        username: string;
        best_time_seconds: number;
        stars_earned: number;
        completed_at: string;
      };
      const rows = (data || []) as unknown as LeaderboardRow[];

      return rows.map((row) => ({
        username: row.username,
        bestTimeSeconds: row.best_time_seconds,
        starsEarned: row.stars_earned,
        completedAt: row.completed_at,
      }));
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  }

  /**
   * Get the user's rank on a scenario leaderboard
   *
   * @param scenarioId - Scenario identifier
   */
  public async getUserRank(scenarioId: string): Promise<number | null> {
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return null;
    }

    const supabase = getSupabaseClient();
    const userId = authService.getUserId();

    if (!userId) {
      return null;
    }

    try {
      // Get user's best time
      const { data: userData, error: userError } = await supabase
        .from('scenario_completions')
        .select('best_time_seconds')
        .eq('user_id', userId)
        .eq('scenario_id', scenarioId)
        .eq('completed', true)
        .single();

      if (userError || !userData) {
        return null;
      }

      // Cast to expected shape
      const userRow = userData as unknown as { best_time_seconds: number };

      // Count how many users have better times
      const { count, error: countError } = await supabase
        .from('scenario_completions')
        .select('*', { count: 'exact', head: true })
        .eq('scenario_id', scenarioId)
        .eq('completed', true)
        .lt('best_time_seconds', userRow.best_time_seconds);

      if (countError) {
        return null;
      }

      return (count ?? 0) + 1;
    } catch (error) {
      console.error('Failed to get user rank:', error);
      return null;
    }
  }

  /**
   * Check if a scenario is completed (using local service)
   */
  public isCompleted(scenarioId: string): boolean {
    return this.localService.isCompleted(scenarioId);
  }

  /**
   * Get completion data for a scenario (using local service)
   */
  public getCompletion(scenarioId: string): ScenarioCompletion | undefined {
    return this.localService.getCompletion(scenarioId);
  }

  /**
   * Get best star rating for a scenario (using local service)
   */
  public getBestStarRating(scenarioId: string): number {
    return this.localService.getBestStarRating(scenarioId);
  }

  // ============================================
  // Private Cloud Operations
  // ============================================

  /**
   * Save a single completion to cloud
   */
  private async saveCompletionToCloud(
    scenarioId: string,
    timeSeconds: number,
    stars: number,
    scenarioPackId?: string
  ): Promise<void> {
    const supabase = getSupabaseClient();
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Get existing record to merge data properly
    const { data: existingData } = await supabase
      .from('scenario_completions')
      .select('attempts, best_time_seconds, stars_earned')
      .eq('user_id', userId)
      .eq('scenario_id', scenarioId)
      .maybeSingle();

    // Cast to expected shape
    const existing = existingData as unknown as {
      attempts: number;
      best_time_seconds: number | null;
      stars_earned: number;
    } | null;

    const now = new Date().toISOString();
    const attempts = (existing?.attempts ?? 0) + 1;
    const bestTime = existing
      ? Math.min(existing.best_time_seconds ?? timeSeconds, timeSeconds)
      : timeSeconds;
    const bestStars = existing ? Math.max(existing.stars_earned ?? 0, stars) : stars;

    const completionRecord = {
      user_id: userId,
      scenario_id: scenarioId,
      scenario_pack_id: scenarioPackId ?? null,
      completed: true,
      attempts,
      best_time_seconds: bestTime,
      last_completion_time_seconds: timeSeconds,
      stars_earned: bestStars,
      last_attempted_at: now,
      completed_at: now,
    };

    const { error } = await supabase
      .from('scenario_completions')
      .upsert(completionRecord as any, { onConflict: 'user_id,scenario_id' });

    if (error) {
      throw new Error(`Cloud completion save failed: ${error.message}`);
    }
  }

  /**
   * Fetch all completions from cloud for current user
   */
  private async fetchCompletionsFromCloud(): Promise<ScenarioCompletion[]> {
    const supabase = getSupabaseClient();
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('scenario_completions')
      .select('scenario_id, completed, best_time_seconds, stars_earned, attempts, completed_at')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    // Cast to expected shape
    type CompletionRow = {
      scenario_id: string;
      completed: boolean;
      best_time_seconds: number | null;
      stars_earned: number;
      attempts: number;
      completed_at: string | null;
    };
    const rows = (data || []) as unknown as CompletionRow[];

    return rows.map((row) => ({
      scenarioId: row.scenario_id,
      completed: row.completed,
      bestTimeSeconds: row.best_time_seconds ?? 0,
      starRating: row.stars_earned,
      attempts: row.attempts,
      completedAt: row.completed_at ? new Date(row.completed_at).getTime() : Date.now(),
    }));
  }

  /**
   * Check if browser is online
   */
  private isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    ScenarioSyncService.instance = null;
  }
}

/**
 * Get the ScenarioSyncService singleton instance
 */
export function getScenarioSyncService(): ScenarioSyncService {
  return ScenarioSyncService.getInstance();
}

export { ScenarioSyncService };
