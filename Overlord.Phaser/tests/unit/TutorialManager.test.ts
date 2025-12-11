/**
 * Tests for TutorialManager
 * Story 1-4: Tutorial Step Guidance System
 *
 * Tests verify tutorial orchestration functionality.
 */

import { TutorialManager } from '@core/TutorialManager';
import { TutorialStep, TutorialAction } from '@core/models/TutorialModels';
import { Scenario } from '@core/models/ScenarioModels';
import { AIPersonality, AIDifficulty } from '@core/models/Enums';

// Helper to create a valid test scenario with tutorial steps
function createTutorialScenario(steps: TutorialStep[]): Scenario {
  return {
    id: 'test-tutorial',
    name: 'Test Tutorial',
    type: 'tutorial',
    difficulty: 'easy',
    duration: '5-10 min',
    description: 'Test tutorial scenario',
    prerequisites: [],
    victoryConditions: [{ type: 'defeat_enemy' }],
    initialState: {
      playerPlanets: ['Alpha'],
      playerResources: { credits: 1000, minerals: 500 },
      aiPlanets: ['Beta'],
      aiEnabled: true,
      aiPersonality: AIPersonality.Balanced,
      aiDifficulty: AIDifficulty.Easy
    },
    tutorialSteps: steps
  };
}

// Helper to create test tutorial steps
function createTestSteps(): TutorialStep[] {
  return [
    {
      step: 1,
      text: 'Welcome! Click on your home planet.',
      highlight: 'planet-alpha',
      action: { type: 'select_planet', target: 'alpha' }
    },
    {
      step: 2,
      text: 'Now open the Build menu.',
      highlight: 'build-button',
      action: { type: 'open_menu', menu: 'construction' }
    },
    {
      step: 3,
      text: 'Build a Mining Station.',
      highlight: 'building-mining',
      action: { type: 'start_construction', building: 'MiningStation' }
    }
  ];
}

describe('TutorialManager', () => {
  let manager: TutorialManager;

  beforeEach(() => {
    manager = new TutorialManager();
  });

  describe('initialization', () => {
    test('should load tutorial steps correctly from scenario', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);

      const result = manager.initialize(scenario);

      expect(result).toBe(true);
      expect(manager.getStepCount()).toBe(3);
    });

    test('should return false for scenario without tutorial steps', () => {
      const scenario = createTutorialScenario([]);
      scenario.tutorialSteps = undefined;

      const result = manager.initialize(scenario);

      expect(result).toBe(false);
      expect(manager.isActive()).toBe(false);
    });

    test('should return false for empty tutorial steps array', () => {
      const scenario = createTutorialScenario([]);

      const result = manager.initialize(scenario);

      expect(result).toBe(false);
    });

    test('should set current step to 0 on successful init', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);

      manager.initialize(scenario);

      expect(manager.getCurrentStepIndex()).toBe(0);
    });
  });

  describe('step tracking', () => {
    test('should return current step correctly', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      const currentStep = manager.getCurrentStep();

      expect(currentStep).toBeDefined();
      expect(currentStep?.step).toBe(1);
      expect(currentStep?.text).toBe('Welcome! Click on your home planet.');
    });

    test('should return undefined for current step when not initialized', () => {
      const currentStep = manager.getCurrentStep();

      expect(currentStep).toBeUndefined();
    });

    test('should track step index correctly', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      expect(manager.getCurrentStepIndex()).toBe(0);

      manager.completeCurrentStep();
      // After timeout would advance, but in tests we check immediate state
      expect(manager.getCurrentStepIndex()).toBe(0); // Still 0 until next step starts
    });
  });

  describe('step completion and advancement', () => {
    test('should advance to next step on completion', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100); // 1 second delay + buffer

      expect(manager.getCurrentStepIndex()).toBe(1);
      jest.useRealTimers();
    });

    test('should mark tutorial as complete after last step', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      // Complete all 3 steps
      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100);
      expect(manager.getCurrentStepIndex()).toBe(1);

      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100);
      expect(manager.getCurrentStepIndex()).toBe(2);

      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100);

      expect(manager.isComplete()).toBe(true);
      jest.useRealTimers();
    });

    test('should not advance if already complete', () => {
      jest.useFakeTimers();
      const steps: TutorialStep[] = [
        { step: 1, text: 'Only step', action: { type: 'end_turn' } }
      ];
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100);

      expect(manager.isComplete()).toBe(true);
      expect(manager.getCurrentStepIndex()).toBe(0); // Last step index stays

      manager.completeCurrentStep(); // Try completing again
      jest.advanceTimersByTime(1100);

      expect(manager.getCurrentStepIndex()).toBe(0); // Should not change
      jest.useRealTimers();
    });
  });

  describe('events', () => {
    test('should fire onStepStarted when tutorial begins', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      const callback = jest.fn();
      manager.onStepStarted = callback;

      manager.initialize(scenario);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(steps[0]);
    });

    test('should fire onStepCompleted when step completes', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      const callback = jest.fn();
      manager.onStepCompleted = callback;

      manager.initialize(scenario);
      manager.completeCurrentStep();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(steps[0]);
      jest.useRealTimers();
    });

    test('should fire onStepStarted for next step after delay', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      const callback = jest.fn();
      manager.initialize(scenario);
      manager.onStepStarted = callback;

      manager.completeCurrentStep();
      expect(callback).not.toHaveBeenCalled(); // Not yet, waiting for delay

      jest.advanceTimersByTime(1100);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(steps[1]);
      jest.useRealTimers();
    });

    test('should fire onTutorialComplete after last step', () => {
      jest.useFakeTimers();
      const steps: TutorialStep[] = [
        { step: 1, text: 'Only step', action: { type: 'end_turn' } }
      ];
      const scenario = createTutorialScenario(steps);
      const callback = jest.fn();
      manager.onTutorialComplete = callback;

      manager.initialize(scenario);
      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100);

      expect(callback).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    test('should not fire events if no callbacks registered', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);

      // Should not throw
      expect(() => {
        manager.initialize(scenario);
        manager.completeCurrentStep();
      }).not.toThrow();
    });
  });

  describe('utility methods', () => {
    test('should report active state correctly', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);

      expect(manager.isActive()).toBe(false);

      manager.initialize(scenario);

      expect(manager.isActive()).toBe(true);
    });

    test('should report complete state correctly', () => {
      jest.useFakeTimers();
      const steps: TutorialStep[] = [
        { step: 1, text: 'Step 1', action: { type: 'end_turn' } }
      ];
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      expect(manager.isComplete()).toBe(false);

      manager.completeCurrentStep();
      jest.advanceTimersByTime(1100);

      expect(manager.isComplete()).toBe(true);
      jest.useRealTimers();
    });

    test('should return step count correctly', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      expect(manager.getStepCount()).toBe(3);
    });

    test('should return 0 step count when not initialized', () => {
      expect(manager.getStepCount()).toBe(0);
    });

    test('should skip tutorial system with skip()', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      const completeCallback = jest.fn();
      manager.onTutorialComplete = completeCallback;
      manager.initialize(scenario);

      manager.skip();

      expect(manager.isComplete()).toBe(true);
      expect(completeCallback).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    test('should reset state on reset()', () => {
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      manager.initialize(scenario);

      manager.reset();

      expect(manager.isActive()).toBe(false);
      expect(manager.getStepCount()).toBe(0);
    });
  });

  describe('step delay configuration', () => {
    test('should use default 1 second delay between steps', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      const callback = jest.fn();
      manager.initialize(scenario);
      manager.onStepStarted = callback;

      manager.completeCurrentStep();

      // After 500ms, should not have advanced
      jest.advanceTimersByTime(500);
      expect(callback).not.toHaveBeenCalled();

      // After full 1000ms, should advance
      jest.advanceTimersByTime(600);
      expect(callback).toHaveBeenCalled();

      jest.useRealTimers();
    });

    test('should allow custom step delay', () => {
      jest.useFakeTimers();
      const steps = createTestSteps();
      const scenario = createTutorialScenario(steps);
      const callback = jest.fn();

      manager.setStepDelay(2000);
      manager.initialize(scenario);
      manager.onStepStarted = callback;

      manager.completeCurrentStep();

      jest.advanceTimersByTime(1500);
      expect(callback).not.toHaveBeenCalled();

      jest.advanceTimersByTime(600);
      expect(callback).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });
});
