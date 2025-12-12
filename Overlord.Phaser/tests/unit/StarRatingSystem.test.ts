/**
 * Tests for StarRatingSystem
 * Story 1-5: Scenario Completion and Results Display
 *
 * Tests verify star rating calculation for scenario completion.
 */

import { StarRatingSystem, StarTargets, ScenarioResults } from '@core/StarRatingSystem';

describe('StarRatingSystem', () => {
  let ratingSystem: StarRatingSystem;

  beforeEach(() => {
    ratingSystem = new StarRatingSystem();
  });

  describe('calculateStars', () => {
    test('should award 3 stars for fast completion (under 75% of target)', () => {
      const targets: StarTargets = {
        threeStarTime: 60,  // 60 seconds
        twoStarTime: 120    // 120 seconds
      };
      const completionTime = 45; // 45 seconds (under 75% of 60 = 45)

      const stars = ratingSystem.calculateStars(completionTime, targets);

      expect(stars).toBe(3);
    });

    test('should award 2 stars for average completion (under target time)', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };
      const completionTime = 90; // Between 60 and 120

      const stars = ratingSystem.calculateStars(completionTime, targets);

      expect(stars).toBe(2);
    });

    test('should award 1 star for slow completion (any completion)', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };
      const completionTime = 180; // Over 120 seconds

      const stars = ratingSystem.calculateStars(completionTime, targets);

      expect(stars).toBe(1);
    });

    test('should award 2 stars at exactly twoStarTime threshold', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };
      const completionTime = 120; // Exactly at threshold

      const stars = ratingSystem.calculateStars(completionTime, targets);

      expect(stars).toBe(2);
    });

    test('should award 3 stars at exactly threeStarTime threshold', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };
      const completionTime = 60; // Exactly at threshold

      const stars = ratingSystem.calculateStars(completionTime, targets);

      expect(stars).toBe(3);
    });
  });

  describe('bonus stars', () => {
    test('should not exceed 3 stars with bonus', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };
      const completionTime = 40; // Very fast
      const bonusObjectivesCompleted = 2;

      const stars = ratingSystem.calculateStarsWithBonus(
        completionTime,
        targets,
        bonusObjectivesCompleted
      );

      expect(stars).toBe(3); // Capped at 3
    });
  });

  describe('createResults', () => {
    test('should create complete results object for victory', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };

      const results = ratingSystem.createResults(
        'test-scenario',
        true,
        45,
        targets,
        'defeat_enemy',
        undefined,
        1
      );

      expect(results.scenarioId).toBe('test-scenario');
      expect(results.completed).toBe(true);
      expect(results.completionTime).toBe(45);
      expect(results.conditionMet).toBe('defeat_enemy');
      expect(results.starRating).toBe(3);
      expect(results.attempts).toBe(1);
    });

    test('should create results object for defeat', () => {
      const targets: StarTargets = {
        threeStarTime: 60,
        twoStarTime: 120
      };

      const results = ratingSystem.createResults(
        'test-scenario',
        false,
        100,
        targets,
        undefined,
        'All planets lost',
        3
      );

      expect(results.completed).toBe(false);
      expect(results.defeatReason).toBe('All planets lost');
      expect(results.starRating).toBe(0);
      expect(results.attempts).toBe(3);
    });
  });

  describe('formatTime', () => {
    test('should format seconds as MM:SS', () => {
      expect(ratingSystem.formatTime(65)).toBe('01:05');
      expect(ratingSystem.formatTime(120)).toBe('02:00');
      expect(ratingSystem.formatTime(0)).toBe('00:00');
      expect(ratingSystem.formatTime(599)).toBe('09:59');
      expect(ratingSystem.formatTime(3600)).toBe('60:00');
    });
  });

  describe('getStarDescription', () => {
    test('should return description for star rating', () => {
      expect(ratingSystem.getStarDescription(3)).toBe('Perfect!');
      expect(ratingSystem.getStarDescription(2)).toBe('Great!');
      expect(ratingSystem.getStarDescription(1)).toBe('Completed');
      expect(ratingSystem.getStarDescription(0)).toBe('Try Again');
    });
  });
});
