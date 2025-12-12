/**
 * Integration Tests for Tutorial Flow
 * Story 1-4: Tutorial Step Guidance System
 *
 * Tests verify end-to-end tutorial functionality.
 */

import { TutorialManager } from '@core/TutorialManager';
import { TutorialActionDetector } from '@core/TutorialActionDetector';
import { TutorialStep } from '@core/models/TutorialModels';
import { Scenario } from '@core/models/ScenarioModels';
import { AIPersonality, AIDifficulty } from '@core/models/Enums';

// Helper to create a tutorial scenario
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

describe('Tutorial Flow Integration', () => {
  let tutorialManager: TutorialManager;
  let actionDetector: TutorialActionDetector;

  beforeEach(() => {
    jest.useFakeTimers();
    tutorialManager = new TutorialManager();
    actionDetector = new TutorialActionDetector();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('manager and detector integration', () => {
    test('should complete full tutorial flow', () => {
      const steps: TutorialStep[] = [
        { step: 1, text: 'Select planet', action: { type: 'select_planet', target: 'alpha' } },
        { step: 2, text: 'End turn', action: { type: 'end_turn' } }
      ];
      const scenario = createTutorialScenario(steps);

      const stepStarted = jest.fn();
      const stepCompleted = jest.fn();
      const tutorialComplete = jest.fn();

      tutorialManager.onStepStarted = stepStarted;
      tutorialManager.onStepCompleted = stepCompleted;
      tutorialManager.onTutorialComplete = tutorialComplete;

      // Initialize tutorial
      tutorialManager.initialize(scenario);

      expect(stepStarted).toHaveBeenCalledTimes(1);
      expect(stepStarted).toHaveBeenCalledWith(steps[0]);

      // Wire up action detector to manager
      const currentStep = tutorialManager.getCurrentStep()!;
      actionDetector.watchFor(currentStep.action);
      actionDetector.onActionCompleted = () => {
        tutorialManager.completeCurrentStep();
      };

      // Perform step 1 action
      actionDetector.reportPlanetSelection('alpha');

      expect(stepCompleted).toHaveBeenCalledTimes(1);

      // Advance timer for delay between steps
      jest.advanceTimersByTime(1100);

      expect(stepStarted).toHaveBeenCalledTimes(2);
      expect(stepStarted).toHaveBeenLastCalledWith(steps[1]);

      // Set up for step 2
      const step2 = tutorialManager.getCurrentStep()!;
      actionDetector.watchFor(step2.action);

      // Perform step 2 action
      actionDetector.reportTurnEnd();

      expect(stepCompleted).toHaveBeenCalledTimes(2);

      // Advance timer to complete tutorial
      jest.advanceTimersByTime(1100);

      expect(tutorialComplete).toHaveBeenCalledTimes(1);
      expect(tutorialManager.isComplete()).toBe(true);
    });

    test('should not advance on wrong action', () => {
      const steps: TutorialStep[] = [
        { step: 1, text: 'Click build', action: { type: 'click_button', target: 'build-btn' } }
      ];
      const scenario = createTutorialScenario(steps);

      const stepCompleted = jest.fn();
      tutorialManager.onStepCompleted = stepCompleted;

      tutorialManager.initialize(scenario);

      const currentStep = tutorialManager.getCurrentStep()!;
      actionDetector.watchFor(currentStep.action);
      actionDetector.onActionCompleted = () => {
        tutorialManager.completeCurrentStep();
      };

      // Wrong button click
      actionDetector.reportButtonClick('wrong-btn');

      expect(stepCompleted).not.toHaveBeenCalled();

      // Correct button click
      actionDetector.reportButtonClick('build-btn');

      expect(stepCompleted).toHaveBeenCalledTimes(1);
    });
  });

  describe('tutorial with multiple step types', () => {
    test('should handle various action types in sequence', () => {
      const steps: TutorialStep[] = [
        { step: 1, text: 'Select planet', action: { type: 'select_planet', target: 'alpha' } },
        { step: 2, text: 'Open menu', action: { type: 'open_menu', menu: 'build' } },
        { step: 3, text: 'Build mine', action: { type: 'start_construction', building: 'MiningStation' } },
        { step: 4, text: 'End turn', action: { type: 'end_turn' } }
      ];
      const scenario = createTutorialScenario(steps);

      const tutorialComplete = jest.fn();
      tutorialManager.onTutorialComplete = tutorialComplete;
      tutorialManager.initialize(scenario);

      // Complete each step
      for (let i = 0; i < steps.length; i++) {
        const currentStep = tutorialManager.getCurrentStep()!;
        actionDetector.watchFor(currentStep.action);
        actionDetector.onActionCompleted = () => {
          tutorialManager.completeCurrentStep();
        };

        switch (currentStep.action.type) {
          case 'select_planet':
            actionDetector.reportPlanetSelection(currentStep.action.target!);
            break;
          case 'open_menu':
            actionDetector.reportMenuOpen(currentStep.action.menu);
            break;
          case 'start_construction':
            actionDetector.reportConstructionStart(currentStep.action.building);
            break;
          case 'end_turn':
            actionDetector.reportTurnEnd();
            break;
        }

        jest.advanceTimersByTime(1100);
      }

      expect(tutorialComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('skip functionality', () => {
    test('should skip tutorial at any point', () => {
      const steps: TutorialStep[] = [
        { step: 1, text: 'Step 1', action: { type: 'end_turn' } },
        { step: 2, text: 'Step 2', action: { type: 'end_turn' } },
        { step: 3, text: 'Step 3', action: { type: 'end_turn' } }
      ];
      const scenario = createTutorialScenario(steps);

      const tutorialComplete = jest.fn();
      tutorialManager.onTutorialComplete = tutorialComplete;
      tutorialManager.initialize(scenario);

      // Skip after first step
      expect(tutorialManager.getCurrentStepIndex()).toBe(0);

      tutorialManager.skip();

      expect(tutorialComplete).toHaveBeenCalledTimes(1);
      expect(tutorialManager.isComplete()).toBe(true);
    });
  });

  describe('non-tutorial scenarios', () => {
    test('should not activate for tactical scenarios', () => {
      const scenario = createTutorialScenario([]);
      scenario.type = 'tactical';
      scenario.tutorialSteps = undefined;

      const result = tutorialManager.initialize(scenario);

      expect(result).toBe(false);
      expect(tutorialManager.isActive()).toBe(false);
    });

    test('should not activate for empty tutorial steps', () => {
      const scenario = createTutorialScenario([]);

      const result = tutorialManager.initialize(scenario);

      expect(result).toBe(false);
      expect(tutorialManager.isActive()).toBe(false);
    });
  });
});
