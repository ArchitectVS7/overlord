/**
 * Tests for ScenarioCompletionService
 * Story 1-5: Scenario Completion and Results Display
 *
 * Tests verify completion tracking and localStorage persistence.
 */

import {
  ScenarioCompletionService,
  ScenarioCompletion
} from '@core/ScenarioCompletionService';

describe('ScenarioCompletionService', () => {
  let service: ScenarioCompletionService;

  // Mock localStorage
  let mockStorage: Map<string, string>;

  beforeEach(() => {
    mockStorage = new Map();

    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => mockStorage.get(key) ?? null),
        setItem: jest.fn((key: string, value: string) => mockStorage.set(key, value)),
        removeItem: jest.fn((key: string) => mockStorage.delete(key)),
        clear: jest.fn(() => mockStorage.clear()),
        length: 0,
        key: jest.fn()
      },
      writable: true
    });

    service = new ScenarioCompletionService();
  });

  describe('isCompleted', () => {
    test('should return false for uncompleted scenario', () => {
      expect(service.isCompleted('scenario-1')).toBe(false);
    });

    test('should return true for completed scenario', () => {
      service.markCompleted('scenario-1', 120, 3);
      expect(service.isCompleted('scenario-1')).toBe(true);
    });
  });

  describe('markCompleted', () => {
    test('should mark scenario as completed', () => {
      service.markCompleted('scenario-1', 120, 3);
      expect(service.isCompleted('scenario-1')).toBe(true);
    });

    test('should store completion time', () => {
      service.markCompleted('scenario-1', 120, 3);
      const completion = service.getCompletion('scenario-1');
      expect(completion?.bestTimeSeconds).toBe(120);
    });

    test('should store star rating', () => {
      service.markCompleted('scenario-1', 120, 3);
      const completion = service.getCompletion('scenario-1');
      expect(completion?.starRating).toBe(3);
    });

    test('should update best time if faster', () => {
      service.markCompleted('scenario-1', 120, 2);
      service.markCompleted('scenario-1', 90, 3);
      const completion = service.getCompletion('scenario-1');
      expect(completion?.bestTimeSeconds).toBe(90);
    });

    test('should keep best time if slower', () => {
      service.markCompleted('scenario-1', 90, 3);
      service.markCompleted('scenario-1', 120, 2);
      const completion = service.getCompletion('scenario-1');
      expect(completion?.bestTimeSeconds).toBe(90);
    });

    test('should increment attempts count', () => {
      service.markCompleted('scenario-1', 120, 2);
      service.markCompleted('scenario-1', 110, 3);
      const completion = service.getCompletion('scenario-1');
      expect(completion?.attempts).toBe(2);
    });

    test('should persist to localStorage', () => {
      service.markCompleted('scenario-1', 120, 3);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getCompletion', () => {
    test('should return undefined for uncompleted scenario', () => {
      expect(service.getCompletion('scenario-1')).toBeUndefined();
    });

    test('should return completion data', () => {
      service.markCompleted('scenario-1', 120, 3);
      const completion = service.getCompletion('scenario-1');
      expect(completion).toBeDefined();
      expect(completion?.scenarioId).toBe('scenario-1');
      expect(completion?.completed).toBe(true);
    });
  });

  describe('getAllCompletions', () => {
    test('should return empty array initially', () => {
      expect(service.getAllCompletions()).toEqual([]);
    });

    test('should return all completions', () => {
      service.markCompleted('scenario-1', 120, 3);
      service.markCompleted('scenario-2', 180, 2);
      const completions = service.getAllCompletions();
      expect(completions.length).toBe(2);
    });
  });

  describe('getBestStarRating', () => {
    test('should return 0 for uncompleted scenario', () => {
      expect(service.getBestStarRating('scenario-1')).toBe(0);
    });

    test('should return best star rating', () => {
      service.markCompleted('scenario-1', 120, 2);
      expect(service.getBestStarRating('scenario-1')).toBe(2);
    });

    test('should update best star rating when improved', () => {
      service.markCompleted('scenario-1', 120, 2);
      service.markCompleted('scenario-1', 90, 3);
      expect(service.getBestStarRating('scenario-1')).toBe(3);
    });

    test('should keep best star rating if new is worse', () => {
      service.markCompleted('scenario-1', 90, 3);
      service.markCompleted('scenario-1', 120, 2);
      expect(service.getBestStarRating('scenario-1')).toBe(3);
    });
  });

  describe('persistence', () => {
    test('should load completions from localStorage on init', () => {
      // Pre-populate localStorage
      const completions: ScenarioCompletion[] = [{
        scenarioId: 'scenario-1',
        completed: true,
        bestTimeSeconds: 120,
        starRating: 3,
        attempts: 1,
        completedAt: Date.now()
      }];
      mockStorage.set('overlord_scenario_completions', JSON.stringify(completions));

      // Create new service instance
      const newService = new ScenarioCompletionService();
      expect(newService.isCompleted('scenario-1')).toBe(true);
    });
  });
});
