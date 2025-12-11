/**
 * Tests for TutorialActionDetector
 * Story 1-4: Tutorial Step Guidance System
 *
 * Tests verify action detection for tutorial steps.
 */

import { TutorialActionDetector } from '@core/TutorialActionDetector';
import { TutorialAction } from '@core/models/TutorialModels';

describe('TutorialActionDetector', () => {
  let detector: TutorialActionDetector;

  beforeEach(() => {
    detector = new TutorialActionDetector();
  });

  describe('watching for actions', () => {
    test('should accept action to watch for', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'build-button'
      };

      expect(() => detector.watchFor(action)).not.toThrow();
      expect(detector.isWatching()).toBe(true);
    });

    test('should not be watching initially', () => {
      expect(detector.isWatching()).toBe(false);
    });

    test('should clear watched action', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'build-button'
      };
      detector.watchFor(action);

      detector.clear();

      expect(detector.isWatching()).toBe(false);
    });

    test('should get current watched action', () => {
      const action: TutorialAction = {
        type: 'open_menu',
        menu: 'construction'
      };
      detector.watchFor(action);

      expect(detector.getCurrentAction()).toEqual(action);
    });
  });

  describe('click_button detection', () => {
    test('should detect matching button click', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'build-button'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportButtonClick('build-button');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should ignore non-matching button click', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'build-button'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportButtonClick('other-button');

      expect(callback).not.toHaveBeenCalled();
    });

    test('should not fire if not watching', () => {
      const callback = jest.fn();
      detector.onActionCompleted = callback;

      detector.reportButtonClick('build-button');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('select_planet detection', () => {
    test('should detect matching planet selection', () => {
      const action: TutorialAction = {
        type: 'select_planet',
        target: 'alpha'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportPlanetSelection('alpha');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should detect any planet selection when no target specified', () => {
      const action: TutorialAction = {
        type: 'select_planet'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportPlanetSelection('any-planet');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should ignore non-matching planet selection', () => {
      const action: TutorialAction = {
        type: 'select_planet',
        target: 'alpha'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportPlanetSelection('beta');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('open_menu detection', () => {
    test('should detect matching menu open', () => {
      const action: TutorialAction = {
        type: 'open_menu',
        menu: 'construction'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportMenuOpen('construction');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should ignore non-matching menu open', () => {
      const action: TutorialAction = {
        type: 'open_menu',
        menu: 'construction'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportMenuOpen('military');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('start_construction detection', () => {
    test('should detect matching building construction', () => {
      const action: TutorialAction = {
        type: 'start_construction',
        building: 'MiningStation'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportConstructionStart('MiningStation');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should ignore non-matching building construction', () => {
      const action: TutorialAction = {
        type: 'start_construction',
        building: 'MiningStation'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportConstructionStart('Factory');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('end_turn detection', () => {
    test('should detect turn end', () => {
      const action: TutorialAction = {
        type: 'end_turn'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportTurnEnd();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not fire end_turn when watching for other action', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'some-button'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportTurnEnd();

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('purchase_craft detection', () => {
    test('should detect matching craft purchase', () => {
      const action: TutorialAction = {
        type: 'purchase_craft',
        craftType: 'Scout'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportCraftPurchase('Scout');

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should ignore non-matching craft purchase', () => {
      const action: TutorialAction = {
        type: 'purchase_craft',
        craftType: 'Scout'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportCraftPurchase('BattleCruiser');

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('commission_platoon detection', () => {
    test('should detect platoon commission', () => {
      const action: TutorialAction = {
        type: 'commission_platoon'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportPlatoonCommission();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('action completion behavior', () => {
    test('should clear watched action after completion', () => {
      const action: TutorialAction = {
        type: 'end_turn'
      };
      detector.watchFor(action);

      detector.reportTurnEnd();

      expect(detector.isWatching()).toBe(false);
    });

    test('should not complete action twice', () => {
      const action: TutorialAction = {
        type: 'end_turn'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportTurnEnd();
      detector.reportTurnEnd(); // Second report

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('action type mismatch', () => {
    test('should ignore click_button when watching for open_menu', () => {
      const action: TutorialAction = {
        type: 'open_menu',
        menu: 'build'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportButtonClick('build');

      expect(callback).not.toHaveBeenCalled();
    });

    test('should ignore planet selection when watching for click_button', () => {
      const action: TutorialAction = {
        type: 'click_button',
        target: 'planet-1'
      };
      const callback = jest.fn();
      detector.onActionCompleted = callback;
      detector.watchFor(action);

      detector.reportPlanetSelection('planet-1');

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
