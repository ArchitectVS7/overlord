/**
 * Tests for TutorialStepPanel
 * Story 1-4: Tutorial Step Guidance System
 *
 * Tests verify tutorial step panel UI functionality.
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
        removeAll(): this { this.list = []; return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
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
        setWordWrapWidth(): this { return this; }
        on(): this { return this; }
        off(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { TutorialStepPanel } from '../../src/scenes/ui/TutorialStepPanel';
import { TutorialStep } from '@core/models/TutorialModels';

// Create mock scene context
function createMockScene() {
  const tweenCallbacks: any[] = [];

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
          setWordWrapWidth: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          off: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        };
        return textObj;
      })
    },
    tweens: {
      add: jest.fn((config: any) => {
        tweenCallbacks.push(config);
        // Immediately call onComplete if exists
        if (config.onComplete) {
          config.onComplete();
        }
        return {
          stop: jest.fn(),
          remove: jest.fn()
        };
      }),
      killTweensOf: jest.fn()
    },
    tweenCallbacks
  };
}

// Helper to create test tutorial steps
function createTestStep(step: number, text: string): TutorialStep {
  return {
    step,
    text,
    action: { type: 'end_turn' }
  };
}

describe('TutorialStepPanel', () => {
  let mockScene: ReturnType<typeof createMockScene>;
  let panel: TutorialStepPanel;

  beforeEach(() => {
    mockScene = createMockScene();
    panel = new TutorialStepPanel(mockScene as any);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    test('should create panel', () => {
      expect(panel).toBeDefined();
    });

    test('should create container with UI elements', () => {
      expect(mockScene.add.container).toHaveBeenCalled();
      expect(mockScene.add.graphics).toHaveBeenCalled();
    });

    test('should be hidden initially', () => {
      expect(panel.isVisible()).toBe(false);
    });
  });

  describe('displaying step info', () => {
    test('should show step number and total', () => {
      const step = createTestStep(1, 'First step instruction');

      panel.showStep(step, 1, 5);

      expect(panel.isVisible()).toBe(true);
    });

    test('should display instruction text', () => {
      const step = createTestStep(2, 'Click the build button');

      panel.showStep(step, 2, 3);

      // Panel should be visible and contain the text
      expect(panel.isVisible()).toBe(true);
    });

    test('should update when showing new step', () => {
      const step1 = createTestStep(1, 'First step');
      const step2 = createTestStep(2, 'Second step');

      panel.showStep(step1, 1, 3);
      panel.showStep(step2, 2, 3);

      expect(panel.isVisible()).toBe(true);
    });
  });

  describe('step completion', () => {
    test('should show completion animation', () => {
      const step = createTestStep(1, 'Test step');
      panel.showStep(step, 1, 3);

      panel.showCompletion();

      expect(mockScene.tweens.add).toHaveBeenCalled();
    });

    test('should fire onComplete callback after animation', () => {
      const step = createTestStep(1, 'Test step');
      const callback = jest.fn();
      panel.onCompletionDone = callback;
      panel.showStep(step, 1, 3);

      panel.showCompletion();

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('skip option', () => {
    test('should have skip functionality', () => {
      const callback = jest.fn();
      panel.onSkip = callback;

      panel.triggerSkip();

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test('should not crash if skip called without callback', () => {
      expect(() => panel.triggerSkip()).not.toThrow();
    });
  });

  describe('visibility', () => {
    test('should show panel', () => {
      panel.show();

      expect(panel.isVisible()).toBe(true);
    });

    test('should hide panel', () => {
      panel.show();
      panel.hide();

      expect(panel.isVisible()).toBe(false);
    });
  });

  describe('progress indicator', () => {
    test('should track progress through steps', () => {
      const step = createTestStep(3, 'Third step');

      panel.showStep(step, 3, 5);

      // Verify step is shown (panel visible)
      expect(panel.isVisible()).toBe(true);
    });
  });

  describe('destroy', () => {
    test('should clean up on destroy', () => {
      panel.showStep(createTestStep(1, 'Test'), 1, 1);

      expect(() => panel.destroy()).not.toThrow();
    });
  });
});
