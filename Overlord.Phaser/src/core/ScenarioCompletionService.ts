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
        completedAt: Date.now(),
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
   * Handles both array format (legacy) and object format (current)
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);

        // Handle both array format (legacy) and object format (current)
        if (Array.isArray(parsed)) {
          // Legacy array format
          const completions: ScenarioCompletion[] = parsed;
          completions.forEach(c => this.completions.set(c.scenarioId, c));
        } else {
          // Object format with scenarioId as keys
          Object.entries(parsed).forEach(([id, completion]) => {
            this.completions.set(id, completion as ScenarioCompletion);
          });
        }
      }
    } catch (e) {
      // Storage unavailable or corrupted, start fresh
      console.warn('Failed to load scenario completions from localStorage:', e);
    }
  }

  /**
   * Save completions to localStorage
   * Saves as an object with scenarioId as keys (compatible with ScenarioManager)
   */
  private saveToStorage(): void {
    try {
      // Convert Map to object with scenarioId as keys (for ScenarioManager compatibility)
      const data: Record<string, ScenarioCompletion> = {};
      this.completions.forEach((completion, id) => {
        data[id] = completion;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
