/**
 * Tests for TutorialModels
 * Story 1-4: Tutorial Step Guidance System
 *
 * Tests verify tutorial model types and validation.
 */

import {
  TutorialAction,
  TutorialStep,
  HighlightConfig,
  TutorialActionType,
  isValidTutorialAction,
  createTutorialStep
} from '@core/models/TutorialModels';

describe('TutorialModels', () => {
  describe('TutorialAction', () => {
    test('should support click_button action type', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'build-button'
      };

      expect(action.type).toBe('click_button');
      expect(action.target).toBe('build-button');
    });

    test('should support select_planet action type', () => {
      const action: TutorialAction = {
        type: 'select_planet',
        target: 'starbase'
      };

      expect(action.type).toBe('select_planet');
      expect(action.target).toBe('starbase');
    });

    test('should support open_menu action type', () => {
      const action: TutorialAction = {
        type: 'open_menu',
        menu: 'construction'
      };

      expect(action.type).toBe('open_menu');
      expect(action.menu).toBe('construction');
    });

    test('should support start_construction action type', () => {
      const action: TutorialAction = {
        type: 'start_construction',
        building: 'MiningStation'
      };

      expect(action.type).toBe('start_construction');
      expect(action.building).toBe('MiningStation');
    });

    test('should support end_turn action type', () => {
      const action: TutorialAction = {
        type: 'end_turn'
      };

      expect(action.type).toBe('end_turn');
    });

    test('should support purchase_craft action type', () => {
      const action: TutorialAction = {
        type: 'purchase_craft',
        craftType: 'Scout'
      };

      expect(action.type).toBe('purchase_craft');
      expect(action.craftType).toBe('Scout');
    });

    test('should support commission_platoon action type', () => {
      const action: TutorialAction = {
        type: 'commission_platoon'
      };

      expect(action.type).toBe('commission_platoon');
    });
  });

  describe('isValidTutorialAction', () => {
    test('should validate click_button action with target', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'build-button'
      };

      expect(isValidTutorialAction(action)).toBe(true);
    });

    test('should reject click_button action without target', () => {
      const action = {
        type: 'click_button'
      } as TutorialAction;

      expect(isValidTutorialAction(action)).toBe(false);
    });

    test('should validate open_menu action with menu', () => {
      const action: TutorialAction = {
        type: 'open_menu',
        menu: 'build'
      };

      expect(isValidTutorialAction(action)).toBe(true);
    });

    test('should reject open_menu action without menu', () => {
      const action = {
        type: 'open_menu'
      } as TutorialAction;

      expect(isValidTutorialAction(action)).toBe(false);
    });

    test('should validate start_construction with building', () => {
      const action: TutorialAction = {
        type: 'start_construction',
        building: 'Factory'
      };

      expect(isValidTutorialAction(action)).toBe(true);
    });

    test('should validate end_turn with no extra params', () => {
      const action: TutorialAction = {
        type: 'end_turn'
      };

      expect(isValidTutorialAction(action)).toBe(true);
    });

    test('should validate commission_platoon with no extra params', () => {
      const action: TutorialAction = {
        type: 'commission_platoon'
      };

      expect(isValidTutorialAction(action)).toBe(true);
    });

    test('should reject unknown action type', () => {
      const action = {
        type: 'unknown_action'
      } as any;

      expect(isValidTutorialAction(action)).toBe(false);
    });
  });

  describe('TutorialStep', () => {
    test('should create valid tutorial step with action', () => {
      const step: TutorialStep = {
        step: 1,
        text: 'Welcome! Click on your home planet.',
        highlight: 'planet-starbase',
        action: {
          type: 'select_planet',
          target: 'starbase'
        }
      };

      expect(step.step).toBe(1);
      expect(step.text).toBe('Welcome! Click on your home planet.');
      expect(step.highlight).toBe('planet-starbase');
      expect(step.action?.type).toBe('select_planet');
    });

    test('should allow step without highlight', () => {
      const step: TutorialStep = {
        step: 1,
        text: 'End your turn when ready.',
        action: {
          type: 'end_turn'
        }
      };

      expect(step.highlight).toBeUndefined();
    });
  });

  describe('createTutorialStep helper', () => {
    test('should create step with defaults', () => {
      const step = createTutorialStep(1, 'Click the button', {
        type: 'click_button',
        target: 'test-button'
      });

      expect(step.step).toBe(1);
      expect(step.text).toBe('Click the button');
      expect(step.action.type).toBe('click_button');
      expect(step.highlight).toBeUndefined();
    });

    test('should create step with highlight', () => {
      const step = createTutorialStep(
        2,
        'Select this planet',
        { type: 'select_planet', target: 'earth' },
        'planet-earth'
      );

      expect(step.highlight).toBe('planet-earth');
    });
  });

  describe('HighlightConfig', () => {
    test('should support glow highlight type', () => {
      const config: HighlightConfig = {
        elementId: 'build-button',
        type: 'glow'
      };

      expect(config.type).toBe('glow');
      expect(config.pulsate).toBeUndefined();
    });

    test('should support spotlight with pulsate', () => {
      const config: HighlightConfig = {
        elementId: 'planet-1',
        type: 'spotlight',
        pulsate: true
      };

      expect(config.type).toBe('spotlight');
      expect(config.pulsate).toBe(true);
    });

    test('should support arrow highlight type', () => {
      const config: HighlightConfig = {
        elementId: 'end-turn-btn',
        type: 'arrow'
      };

      expect(config.type).toBe('arrow');
    });
  });

  describe('TutorialActionType', () => {
    test('should enumerate all action types', () => {
      const types: TutorialActionType[] = [
        'click_button',
        'select_planet',
        'open_menu',
        'start_construction',
        'end_turn',
        'purchase_craft',
        'commission_platoon'
      ];

      expect(types.length).toBe(7);
    });
  });
});
