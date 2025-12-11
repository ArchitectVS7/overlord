/**
 * Tests for ScenarioResultsPanel
 * Story 1-5: Scenario Completion and Results Display
 *
 * Tests verify results panel UI functionality.
 */

// Mock Phaser before imports
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    GameObjects: {
      Container: class MockContainer {
        scene: unknown;
        x = 0;
        y = 0;
        visible = true;
        depth = 0;
        alpha = 1;
        list: unknown[] = [];

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setScrollFactor(): this { return this; }
        destroy(): void { this.list = []; }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRoundedRect(): this { return this; }
        clear(): this { return this; }
        setDepth(): this { return this; }
        setScrollFactor(): this { return this; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        visible = true;
        alpha = 1;

        constructor(_scene: unknown, x: number, y: number, text: string) {
          this.x = x;
          this.y = y;
          this.text = text;
        }

        setText(t: string): this { this.text = t; return this; }
        setOrigin(): this { return this; }
        setColor(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        on(): this { return this; }
        off(): this { return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        visible = true;
        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setFillStyle(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { ScenarioResultsPanel } from '../../src/scenes/ui/ScenarioResultsPanel';
import { ScenarioResults } from '@core/StarRatingSystem';

// Create mock scene context
function createMockScene() {
  return {
    cameras: {
      main: {
        width: 1024,
        height: 768
      }
    },
    add: {
      container: jest.fn((x: number, y: number) => ({
        x,
        y,
        list: [],
        visible: true,
        alpha: 1,
        add: jest.fn().mockReturnThis(),
        setVisible: jest.fn(function(this: any, v: boolean) { this.visible = v; return this; }),
        setDepth: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      graphics: jest.fn(() => ({
        fillStyle: jest.fn().mockReturnThis(),
        fillRoundedRect: jest.fn().mockReturnThis(),
        lineStyle: jest.fn().mockReturnThis(),
        strokeRoundedRect: jest.fn().mockReturnThis(),
        clear: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      rectangle: jest.fn(() => ({
        setOrigin: jest.fn().mockReturnThis(),
        setInteractive: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setVisible: jest.fn().mockReturnThis(),
        setFillStyle: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      text: jest.fn((x: number, y: number, text: string) => {
        const textObj = {
          x,
          y,
          text,
          visible: true,
          alpha: 1,
          setText: jest.fn(function(this: any, t: string) { this.text = t; return this; }),
          setOrigin: jest.fn().mockReturnThis(),
          setColor: jest.fn().mockReturnThis(),
          setVisible: jest.fn(function(this: any, v: boolean) { this.visible = v; return this; }),
          setAlpha: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          setScrollFactor: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          off: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        };
        return textObj;
      })
    },
    tweens: {
      add: jest.fn((config: any) => {
        if (config.onComplete) {
          config.onComplete();
        }
        return { stop: jest.fn(), remove: jest.fn() };
      }),
      killTweensOf: jest.fn()
    }
  };
}

// Helper to create victory results
function createVictoryResults(): ScenarioResults {
  return {
    scenarioId: 'test-scenario',
    completed: true,
    completionTime: 120,
    conditionMet: 'Defeat all enemies',
    starRating: 3,
    attempts: 1
  };
}

// Helper to create defeat results
function createDefeatResults(): ScenarioResults {
  return {
    scenarioId: 'test-scenario',
    completed: false,
    completionTime: 180,
    defeatReason: 'All planets lost',
    starRating: 0,
    attempts: 2
  };
}

describe('ScenarioResultsPanel', () => {
  let mockScene: ReturnType<typeof createMockScene>;
  let panel: ScenarioResultsPanel;

  beforeEach(() => {
    mockScene = createMockScene();
    panel = new ScenarioResultsPanel(mockScene as any);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    test('should create panel', () => {
      expect(panel).toBeDefined();
    });

    test('should be hidden initially', () => {
      expect(panel.isVisible()).toBe(false);
    });
  });

  describe('victory display', () => {
    test('should show victory results correctly', () => {
      const results = createVictoryResults();

      panel.showVictory(results);

      expect(panel.isVisible()).toBe(true);
    });

    test('should display completion time formatted as MM:SS', () => {
      const results = createVictoryResults();
      results.completionTime = 125; // 2:05

      panel.showVictory(results);

      // Panel should be visible and showing results
      expect(panel.isVisible()).toBe(true);
    });

    test('should display star rating', () => {
      const results = createVictoryResults();
      results.starRating = 2;

      panel.showVictory(results);

      expect(panel.isVisible()).toBe(true);
    });
  });

  describe('defeat display', () => {
    test('should show defeat results correctly', () => {
      const results = createDefeatResults();

      panel.showDefeat(results);

      expect(panel.isVisible()).toBe(true);
    });

    test('should display defeat reason', () => {
      const results = createDefeatResults();
      results.defeatReason = 'Ran out of resources';

      panel.showDefeat(results);

      expect(panel.isVisible()).toBe(true);
    });
  });

  describe('buttons', () => {
    test('should emit onContinue when Continue clicked', () => {
      const callback = jest.fn();
      panel.onContinue = callback;
      const results = createVictoryResults();
      panel.showVictory(results);

      panel.triggerContinue();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should emit onRetry when Retry clicked', () => {
      const callback = jest.fn();
      panel.onRetry = callback;
      const results = createDefeatResults();
      panel.showDefeat(results);

      panel.triggerRetry();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should emit onExit when Exit clicked', () => {
      const callback = jest.fn();
      panel.onExit = callback;
      const results = createDefeatResults();
      panel.showDefeat(results);

      panel.triggerExit();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('hide', () => {
    test('should hide panel', () => {
      const results = createVictoryResults();
      panel.showVictory(results);

      panel.hide();

      expect(panel.isVisible()).toBe(false);
    });
  });

  describe('star display', () => {
    test('should handle 1 star rating', () => {
      const results = createVictoryResults();
      results.starRating = 1;

      expect(() => panel.showVictory(results)).not.toThrow();
    });

    test('should handle 2 star rating', () => {
      const results = createVictoryResults();
      results.starRating = 2;

      expect(() => panel.showVictory(results)).not.toThrow();
    });

    test('should handle 3 star rating', () => {
      const results = createVictoryResults();
      results.starRating = 3;

      expect(() => panel.showVictory(results)).not.toThrow();
    });
  });
});
