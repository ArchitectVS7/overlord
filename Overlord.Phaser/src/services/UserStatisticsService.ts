/**
 * UserStatisticsService - Lifetime Gameplay Statistics
 * Story 10-7: User Statistics Tracking
 *
 * Tracks and persists user gameplay statistics including:
 * - Campaign starts, wins, losses
 * - Total playtime
 * - Combat statistics (battles, planets)
 * - Flash Conflict completion stats
 *
 * Features:
 * - Cloud sync for authenticated users
 * - LocalStorage fallback for guest mode
 * - Automatic increment methods for game events
 */

import { getSupabaseClient } from './SupabaseClient';
import { getAuthService } from './AuthService';
import { getGuestModeService } from './GuestModeService';

// LocalStorage key for guest/offline statistics
const LOCAL_STATS_KEY = 'overlord_user_statistics';

/**
 * User statistics data structure
 */
export interface UserStatistics {
  userId: string;

  // Campaign Statistics
  campaignsStarted: number;
  campaignsWon: number;
  campaignsLost: number;

  // Time Statistics
  totalPlaytimeSeconds: number;

  // Combat Statistics
  planetsConquered: number;
  planetsLost: number;
  battlesWon: number;
  battlesLost: number;

  // Flash Conflict Statistics
  flashConflictsCompleted: number;
  flashConflictsThreeStar: number;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Result of statistics operations
 */
export interface StatisticsResult {
  success: boolean;
  error?: string;
  statistics?: UserStatistics;
}

/**
 * Default statistics for new users
 */
const DEFAULT_STATISTICS: Omit<UserStatistics, 'userId'> = {
  campaignsStarted: 0,
  campaignsWon: 0,
  campaignsLost: 0,
  totalPlaytimeSeconds: 0,
  planetsConquered: 0,
  planetsLost: 0,
  battlesWon: 0,
  battlesLost: 0,
  flashConflictsCompleted: 0,
  flashConflictsThreeStar: 0,
};

/**
 * Database row structure (snake_case)
 */
interface StatsRow {
  user_id: string;
  campaigns_started: number;
  campaigns_won: number;
  campaigns_lost: number;
  total_playtime_seconds: number;
  planets_conquered: number;
  planets_lost: number;
  battles_won: number;
  battles_lost: number;
  flash_conflicts_completed: number;
  flash_conflicts_three_star: number;
  created_at: string;
  updated_at: string;
}

/**
 * UserStatisticsService singleton class
 * Manages user gameplay statistics tracking and synchronization
 */
class UserStatisticsService {
  private static instance: UserStatisticsService | null = null;
  private cachedStats: UserStatistics | null = null;
  private playtimeStartTime: number | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): UserStatisticsService {
    if (!UserStatisticsService.instance) {
      UserStatisticsService.instance = new UserStatisticsService();
    }
    return UserStatisticsService.instance;
  }

  // ============================================
  // Statistics Retrieval
  // ============================================

  /**
   * Get the current user's statistics
   * Fetches from cloud for authenticated users, localStorage for guests
   */
  public async getStatistics(forceRefresh = false): Promise<StatisticsResult> {
    const authService = getAuthService();
    const guestService = getGuestModeService();

    // Return cached stats if available
    if (this.cachedStats && !forceRefresh) {
      return { success: true, statistics: this.cachedStats };
    }

    // Guest mode - use local storage
    if (guestService.isGuestMode()) {
      const localStats = this.getLocalStatistics();
      this.cachedStats = localStats;
      return { success: true, statistics: localStats };
    }

    // Not authenticated
    const userId = authService.getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    // Fetch from Supabase
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Row might not exist yet - return defaults
        if (error.code === 'PGRST116') {
          const defaultStats = this.createDefaultStats(userId);
          this.cachedStats = defaultStats;
          return { success: true, statistics: defaultStats };
        }
        console.error('Statistics fetch error:', error);
        return { success: false, error: error.message };
      }

      if (!data) {
        const defaultStats = this.createDefaultStats(userId);
        this.cachedStats = defaultStats;
        return { success: true, statistics: defaultStats };
      }

      const row = data as unknown as StatsRow;
      const statistics = this.rowToStatistics(row);
      this.cachedStats = statistics;
      return { success: true, statistics };
    } catch (error) {
      console.error('Statistics fetch failed:', error);
      return { success: false, error: 'Failed to fetch statistics' };
    }
  }

  /**
   * Convert database row to UserStatistics
   */
  private rowToStatistics(row: StatsRow): UserStatistics {
    return {
      userId: row.user_id,
      campaignsStarted: row.campaigns_started,
      campaignsWon: row.campaigns_won,
      campaignsLost: row.campaigns_lost,
      totalPlaytimeSeconds: row.total_playtime_seconds,
      planetsConquered: row.planets_conquered,
      planetsLost: row.planets_lost,
      battlesWon: row.battles_won,
      battlesLost: row.battles_lost,
      flashConflictsCompleted: row.flash_conflicts_completed,
      flashConflictsThreeStar: row.flash_conflicts_three_star,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Create default statistics for a user
   */
  private createDefaultStats(userId: string): UserStatistics {
    return {
      userId,
      ...DEFAULT_STATISTICS,
    };
  }

  // ============================================
  // Statistics Updates
  // ============================================

  /**
   * Update statistics in the database
   * @param updates - Partial statistics to update
   */
  private async updateStatistics(
    updates: Partial<Omit<UserStatistics, 'userId'>>
  ): Promise<StatisticsResult> {
    const authService = getAuthService();
    const guestService = getGuestModeService();

    // Guest mode - update local storage only
    if (guestService.isGuestMode()) {
      this.updateLocalStatistics(updates);
      const localStats = this.getLocalStatistics();
      this.cachedStats = localStats;
      return { success: true, statistics: localStats };
    }

    const userId = authService.getUserId();
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = getSupabaseClient();

    try {
      // Map to database column names
      const dbUpdates: Record<string, unknown> = {};

      if (updates.campaignsStarted !== undefined) {
        dbUpdates.campaigns_started = updates.campaignsStarted;
      }
      if (updates.campaignsWon !== undefined) {
        dbUpdates.campaigns_won = updates.campaignsWon;
      }
      if (updates.campaignsLost !== undefined) {
        dbUpdates.campaigns_lost = updates.campaignsLost;
      }
      if (updates.totalPlaytimeSeconds !== undefined) {
        dbUpdates.total_playtime_seconds = updates.totalPlaytimeSeconds;
      }
      if (updates.planetsConquered !== undefined) {
        dbUpdates.planets_conquered = updates.planetsConquered;
      }
      if (updates.planetsLost !== undefined) {
        dbUpdates.planets_lost = updates.planetsLost;
      }
      if (updates.battlesWon !== undefined) {
        dbUpdates.battles_won = updates.battlesWon;
      }
      if (updates.battlesLost !== undefined) {
        dbUpdates.battles_lost = updates.battlesLost;
      }
      if (updates.flashConflictsCompleted !== undefined) {
        dbUpdates.flash_conflicts_completed = updates.flashConflictsCompleted;
      }
      if (updates.flashConflictsThreeStar !== undefined) {
        dbUpdates.flash_conflicts_three_star = updates.flashConflictsThreeStar;
      }

      // Upsert - insert if not exists, update if exists
      const { error } = await (
        supabase.from('user_statistics') as any
      ).upsert(
        { user_id: userId, ...dbUpdates },
        { onConflict: 'user_id' }
      );

      if (error) {
        console.error('Statistics update error:', error);
        return { success: false, error: error.message };
      }

      // Refresh cache
      return this.getStatistics(true);
    } catch (error) {
      console.error('Statistics update failed:', error);
      return { success: false, error: 'Failed to update statistics' };
    }
  }

  // ============================================
  // Increment Methods (Game Events)
  // ============================================

  /**
   * Record a new campaign started
   */
  public async recordCampaignStarted(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        campaignsStarted: current.statistics.campaignsStarted + 1,
      });
    }
  }

  /**
   * Record a campaign won
   */
  public async recordCampaignWon(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        campaignsWon: current.statistics.campaignsWon + 1,
      });
    }
  }

  /**
   * Record a campaign lost
   */
  public async recordCampaignLost(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        campaignsLost: current.statistics.campaignsLost + 1,
      });
    }
  }

  /**
   * Record a planet conquered
   */
  public async recordPlanetConquered(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        planetsConquered: current.statistics.planetsConquered + 1,
      });
    }
  }

  /**
   * Record a planet lost
   */
  public async recordPlanetLost(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        planetsLost: current.statistics.planetsLost + 1,
      });
    }
  }

  /**
   * Record a battle won
   */
  public async recordBattleWon(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        battlesWon: current.statistics.battlesWon + 1,
      });
    }
  }

  /**
   * Record a battle lost
   */
  public async recordBattleLost(): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      await this.updateStatistics({
        battlesLost: current.statistics.battlesLost + 1,
      });
    }
  }

  /**
   * Record a Flash Conflict completed
   * @param stars - Number of stars earned (1-3)
   */
  public async recordFlashConflictCompleted(stars: number): Promise<void> {
    const current = await this.getStatistics();
    if (current.success && current.statistics) {
      const updates: Partial<UserStatistics> = {
        flashConflictsCompleted: current.statistics.flashConflictsCompleted + 1,
      };
      if (stars >= 3) {
        updates.flashConflictsThreeStar =
          current.statistics.flashConflictsThreeStar + 1;
      }
      await this.updateStatistics(updates);
    }
  }

  // ============================================
  // Playtime Tracking
  // ============================================

  /**
   * Start tracking playtime (call when game session starts)
   */
  public startPlaytimeTracking(): void {
    this.playtimeStartTime = Date.now();
  }

  /**
   * Stop tracking and save accumulated playtime
   */
  public async stopPlaytimeTracking(): Promise<void> {
    if (this.playtimeStartTime === null) {
      return;
    }

    const elapsed = Math.floor((Date.now() - this.playtimeStartTime) / 1000);
    this.playtimeStartTime = null;

    if (elapsed > 0) {
      const current = await this.getStatistics();
      if (current.success && current.statistics) {
        await this.updateStatistics({
          totalPlaytimeSeconds: current.statistics.totalPlaytimeSeconds + elapsed,
        });
      }
    }
  }

  /**
   * Get current session playtime in seconds
   */
  public getCurrentSessionPlaytime(): number {
    if (this.playtimeStartTime === null) {
      return 0;
    }
    return Math.floor((Date.now() - this.playtimeStartTime) / 1000);
  }

  // ============================================
  // Local Storage (Guest Mode Fallback)
  // ============================================

  /**
   * Get statistics from local storage
   */
  private getLocalStatistics(): UserStatistics {
    const guestService = getGuestModeService();
    const guestId = guestService.getGuestId() || 'guest';

    try {
      const stored = localStorage.getItem(LOCAL_STATS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserStatistics>;
        return {
          userId: guestId,
          ...DEFAULT_STATISTICS,
          ...parsed,
        };
      }
    } catch (error) {
      console.warn('Failed to load local statistics:', error);
    }

    return {
      userId: guestId,
      ...DEFAULT_STATISTICS,
    };
  }

  /**
   * Update statistics in local storage
   */
  private updateLocalStatistics(updates: Partial<UserStatistics>): void {
    try {
      const current = this.getLocalStatistics();
      const updated = { ...current, ...updates };
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save local statistics:', error);
    }
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Format playtime for display
   * @param seconds - Total seconds
   * @returns Formatted string like "12h 34m"
   */
  public formatPlaytime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  /**
   * Calculate win rate percentage
   */
  public calculateWinRate(stats: UserStatistics): number {
    const total = stats.campaignsWon + stats.campaignsLost;
    if (total === 0) return 0;
    return Math.round((stats.campaignsWon / total) * 100);
  }

  /**
   * Clear cached statistics
   * Call on logout
   */
  public clearCache(): void {
    this.cachedStats = null;
    if (this.playtimeStartTime !== null) {
      this.playtimeStartTime = null;
    }
  }

  /**
   * Reset singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (UserStatisticsService.instance) {
      UserStatisticsService.instance.clearCache();
    }
    UserStatisticsService.instance = null;
  }
}

/**
 * Get the UserStatisticsService singleton instance
 */
export function getUserStatisticsService(): UserStatisticsService {
  return UserStatisticsService.getInstance();
}

export { UserStatisticsService };
