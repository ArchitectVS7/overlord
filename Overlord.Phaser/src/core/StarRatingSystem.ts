/**
 * StarRatingSystem - Calculate star ratings for scenario completion
 * Story 1-5: Scenario Completion and Results Display
 *
 * Features:
 * - Calculate stars based on completion time
 * - Compare to scenario target times
 * - Support bonus stars for secondary objectives
 * - Format time for display
 */

/**
 * Star rating targets from scenario configuration
 */
export interface StarTargets {
  threeStarTime: number; // seconds - fast completion threshold
  twoStarTime: number;   // seconds - average completion threshold
}

/**
 * Scenario completion results
 */
export interface ScenarioResults {
  scenarioId: string;
  completed: boolean;
  completionTime: number;  // seconds
  conditionMet?: string;   // For victory
  defeatReason?: string;   // For defeat
  starRating: 0 | 1 | 2 | 3;
  attempts: number;
}

/**
 * Calculates star ratings for scenario completion
 */
export class StarRatingSystem {
  /**
   * Calculate star rating based on completion time
   * @param completionTime Time in seconds
   * @param targets Star rating thresholds
   * @returns Star rating (1-3)
   */
  public calculateStars(completionTime: number, targets: StarTargets): 1 | 2 | 3 {
    if (completionTime <= targets.threeStarTime) {
      return 3;
    }
    if (completionTime <= targets.twoStarTime) {
      return 2;
    }
    return 1;
  }

  /**
   * Calculate star rating with bonus for secondary objectives
   * @param completionTime Time in seconds
   * @param targets Star rating thresholds
   * @param bonusObjectivesCompleted Number of bonus objectives completed
   * @returns Star rating (1-3, capped)
   */
  public calculateStarsWithBonus(
    completionTime: number,
    targets: StarTargets,
    _bonusObjectivesCompleted: number,
  ): 1 | 2 | 3 {
    // Base calculation
    const baseStars = this.calculateStars(completionTime, targets);

    // Bonus could add stars, but cap at 3
    // For now, bonus doesn't add stars - just use base calculation
    // In future: const bonusStars = Math.min(bonusObjectivesCompleted, 1);
    // return Math.min(3, baseStars + bonusStars) as 1 | 2 | 3;

    return baseStars;
  }

  /**
   * Create a complete results object
   */
  public createResults(
    scenarioId: string,
    completed: boolean,
    completionTime: number,
    targets: StarTargets,
    conditionMet?: string,
    defeatReason?: string,
    attempts: number = 1,
  ): ScenarioResults {
    let starRating: 0 | 1 | 2 | 3 = 0;

    if (completed) {
      starRating = this.calculateStars(completionTime, targets);
    }

    return {
      scenarioId,
      completed,
      completionTime,
      conditionMet,
      defeatReason,
      starRating,
      attempts,
    };
  }

  /**
   * Format time in seconds to MM:SS format
   * @param seconds Time in seconds
   * @returns Formatted time string
   */
  public formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get description text for star rating
   * @param stars Star rating (0-3)
   * @returns Description text
   */
  public getStarDescription(stars: number): string {
    switch (stars) {
      case 3:
        return 'Perfect!';
      case 2:
        return 'Great!';
      case 1:
        return 'Completed';
      default:
        return 'Try Again';
    }
  }
}
