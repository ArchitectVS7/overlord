/**
 * ScenarioCompletionService - Track scenario completion status
 * Story 1-5: Scenario Completion and Results Display
 *
 * Features:
 * - Track completed scenarios in localStorage
 * - Store best time and star rating
 * - Load persisted completions on init
 * - To be upgraded to Supabase in Story 1-6
 */

const STORAGE_KEY = 'overlord_scenario_completions';

/**
 * Scenario completion record
 */
export interface ScenarioCompletion {
  scenarioId: string;
  completed: boolean;
  bestTimeSeconds: number;
  starRating: number;
  attempts: number;
  completedAt: number;
}

/**
 * Service for tracking scenario completion status
 */
export class ScenarioCompletionService {
  private completions: Map<string, ScenarioCompletion> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Check if a scenario has been completed
   * @param scenarioId Scenario identifier
   * @returns true if scenario was completed at least once
   */
  public isCompleted(scenarioId: string): boolean {
    return this.completions.has(scenarioId) && this.completions.get(scenarioId)!.completed;
  }

  /**
   * Mark a scenario as completed
   * @param scenarioId Scenario identifier
   * @param timeSeconds Completion time in seconds
   * @param starRating Star rating (1-3)
   */
  public markCompleted(scenarioId: string, timeSeconds: number, starRating: number): void {
    const existing = this.completions.get(scenarioId);

    if (existing) {
      // Update existing record
      existing.completed = true;
      existing.attempts++;
      existing.completedAt = Date.now();

      // Update best time if faster
      if (timeSeconds < existing.bestTimeSeconds) {
        existing.bestTimeSeconds = timeSeconds;
      }

      // Update best star rating if better
      if (starRating > existing.starRating) {
        existing.starRating = starRating;
      }
    } else {
      // Create new record
      this.completions.set(scenarioId, {
        scenarioId,
        completed: true,
        bestTimeSeconds: timeSeconds,
        starRating,
        attempts: 1,
        completedAt: Date.now()
      });
    }

    this.saveToStorage();
  }

  /**
   * Get completion data for a scenario
   * @param scenarioId Scenario identifier
   * @returns Completion data or undefined if not completed
   */
  public getCompletion(scenarioId: string): ScenarioCompletion | undefined {
    return this.completions.get(scenarioId);
  }

  /**
   * Get all completion records
   * @returns Array of all completion records
   */
  public getAllCompletions(): ScenarioCompletion[] {
    return Array.from(this.completions.values());
  }

  /**
   * Get best star rating for a scenario
   * @param scenarioId Scenario identifier
   * @returns Best star rating (0 if not completed)
   */
  public getBestStarRating(scenarioId: string): number {
    const completion = this.completions.get(scenarioId);
    return completion?.starRating ?? 0;
  }

  /**
   * Load completions from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const completions: ScenarioCompletion[] = JSON.parse(data);
        completions.forEach(c => this.completions.set(c.scenarioId, c));
      }
    } catch (e) {
      // Storage unavailable or corrupted, start fresh
      console.warn('Failed to load scenario completions from localStorage:', e);
    }
  }

  /**
   * Save completions to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = JSON.stringify(this.getAllCompletions());
      localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
      // Storage unavailable or full
      console.warn('Failed to save scenario completions to localStorage:', e);
    }
  }

  /**
   * Clear all completion data (for testing)
   */
  public clearAll(): void {
    this.completions.clear();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore storage errors
    }
  }
}

// Singleton instance for global access
let _instance: ScenarioCompletionService | null = null;

/**
 * Get the singleton completion service instance
 */
export function getCompletionService(): ScenarioCompletionService {
  if (!_instance) {
    _instance = new ScenarioCompletionService();
  }
  return _instance;
}
