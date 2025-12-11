/**
 * Tests for TutorialHighlight
 * Story 1-4: Tutorial Step Guidance System
 *
 * Tests verify highlight effects for tutorial steps.
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
        alpha = 1;
        visible = true;
        fillStyle(): this { return this; }
        fillRect(): this { return this; }
        fillRoundedRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRect(): this { return this; }
        strokeRoundedRect(): this { return this; }
        clear(): this { return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(): this { return this; }
        setScrollFactor(): this { return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        alpha = 1;
        visible = true;

        constructor(_scene: unknown, x: number, y: number, width: number, height: number) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
        }

        setOrigin(): this { return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(): this { return this; }
        setScrollFactor(): this { return this; }
        setFillStyle(): this { return this; }
        destroy(): void {}
      },
      Image: class MockImage {
        x = 0;
        y = 0;
        angle = 0;
        visible = true;

        constructor(_scene: unknown, x: number, y: number) {
          this.x = x;
          this.y = y;
        }

        setOrigin(): this { return this; }
        setAngle(a: number): this { this.angle = a; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(): this { return this; }
        setScrollFactor(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { TutorialHighlight } from '../../src/scenes/ui/TutorialHighlight';
import { HighlightConfig } from '@core/models/TutorialModels';

// Create mock scene context
function createMockScene() {
  const tweenTargets: any[] = [];

  return {
    cameras: {
      main: {
        width: 1024,
        height: 768,
        scrollX: 0,
        scrollY: 0
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
        setVisible: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      graphics: jest.fn(() => ({
        alpha: 1,
        visible: true,
        y: 0,
        fillStyle: jest.fn().mockReturnThis(),
        fillRect: jest.fn().mockReturnThis(),
        fillRoundedRect: jest.fn().mockReturnThis(),
        lineStyle: jest.fn().mockReturnThis(),
        strokeRect: jest.fn().mockReturnThis(),
        strokeRoundedRect: jest.fn().mockReturnThis(),
        beginPath: jest.fn().mockReturnThis(),
        moveTo: jest.fn().mockReturnThis(),
        lineTo: jest.fn().mockReturnThis(),
        closePath: jest.fn().mockReturnThis(),
        fillPath: jest.fn().mockReturnThis(),
        clear: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        setVisible: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      rectangle: jest.fn((x: number, y: number, width: number, height: number) => ({
        x,
        y,
        width,
        height,
        alpha: 1,
        visible: true,
        setOrigin: jest.fn().mockReturnThis(),
        setAlpha: jest.fn().mockReturnThis(),
        setVisible: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        setFillStyle: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      image: jest.fn((x: number, y: number) => ({
        x,
        y,
        angle: 0,
        visible: true,
        setOrigin: jest.fn().mockReturnThis(),
        setAngle: jest.fn().mockReturnThis(),
        setVisible: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      })),
      text: jest.fn((x: number, y: number, text: string) => ({
        x,
        y,
        text,
        setOrigin: jest.fn().mockReturnThis(),
        setVisible: jest.fn().mockReturnThis(),
        setDepth: jest.fn().mockReturnThis(),
        setScrollFactor: jest.fn().mockReturnThis(),
        destroy: jest.fn()
      }))
    },
    tweens: {
      add: jest.fn((config: any) => {
        tweenTargets.push(config.targets);
        // Simulate tween completion
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
    tweenTargets
  };
}

// Mock highlight target element
function createMockElement(x: number, y: number, width: number, height: number) {
  return {
    x,
    y,
    width,
    height,
    displayWidth: width,
    displayHeight: height,
    getBounds: jest.fn(() => ({
      x,
      y,
      width,
      height,
      centerX: x + width / 2,
      centerY: y + height / 2
    }))
  };
}

describe('TutorialHighlight', () => {
  let mockScene: ReturnType<typeof createMockScene>;
  let highlight: TutorialHighlight;

  beforeEach(() => {
    mockScene = createMockScene();
    highlight = new TutorialHighlight(mockScene as any);
  });

  afterEach(() => {
    highlight.destroy();
  });

  describe('initialization', () => {
    test('should create highlight manager', () => {
      expect(highlight).toBeDefined();
    });

    test('should not be showing highlight initially', () => {
      expect(highlight.isActive()).toBe(false);
    });
  });

  describe('glow highlight', () => {
    test('should apply glow highlight to element', () => {
      const element = createMockElement(100, 100, 200, 50);

      highlight.showGlow(element as any);

      expect(highlight.isActive()).toBe(true);
      expect(mockScene.add.graphics).toHaveBeenCalled();
    });

    test('should position glow around element', () => {
      const element = createMockElement(100, 100, 200, 50);

      highlight.showGlow(element as any);

      // Graphics should be created for the glow effect
      expect(mockScene.add.graphics).toHaveBeenCalled();
    });
  });

  describe('spotlight highlight', () => {
    test('should apply spotlight effect with backdrop', () => {
      const element = createMockElement(200, 150, 100, 100);

      highlight.showSpotlight(element as any);

      expect(highlight.isActive()).toBe(true);
      // Should create backdrop rectangle
      expect(mockScene.add.rectangle).toHaveBeenCalled();
    });

    test('should dim background with spotlight', () => {
      const element = createMockElement(200, 150, 100, 100);

      highlight.showSpotlight(element as any);

      // Backdrop should be created at 0,0 covering full screen
      expect(mockScene.add.rectangle).toHaveBeenCalledWith(
        0, 0,
        mockScene.cameras.main.width,
        mockScene.cameras.main.height,
        expect.any(Number),
        expect.any(Number)
      );
    });
  });

  describe('arrow highlight', () => {
    test('should show arrow pointing to element', () => {
      const element = createMockElement(300, 200, 80, 40);

      highlight.showArrow(element as any);

      expect(highlight.isActive()).toBe(true);
    });

    test('should position arrow near element', () => {
      const element = createMockElement(300, 200, 80, 40);

      highlight.showArrow(element as any);

      // Arrow graphic should be created
      expect(mockScene.add.graphics).toHaveBeenCalled();
    });
  });

  describe('animation', () => {
    test('should animate glow pulsation', () => {
      const element = createMockElement(100, 100, 200, 50);

      highlight.showGlow(element as any, true); // with pulsate

      expect(mockScene.tweens.add).toHaveBeenCalled();
    });

    test('should animate arrow bounce', () => {
      const element = createMockElement(300, 200, 80, 40);

      highlight.showArrow(element as any, true); // with animation

      expect(mockScene.tweens.add).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    test('should clear highlight', () => {
      const element = createMockElement(100, 100, 200, 50);
      highlight.showGlow(element as any);

      highlight.clear();

      expect(highlight.isActive()).toBe(false);
    });

    test('should stop running animations on clear', () => {
      const element = createMockElement(100, 100, 200, 50);
      highlight.showGlow(element as any, true);

      highlight.clear();

      expect(mockScene.tweens.killTweensOf).toHaveBeenCalled();
    });
  });

  describe('highlight by config', () => {
    test('should apply glow type from config', () => {
      const element = createMockElement(100, 100, 200, 50);
      const config: HighlightConfig = {
        elementId: 'test-element',
        type: 'glow'
      };

      highlight.applyConfig(config, element as any);

      expect(highlight.isActive()).toBe(true);
    });

    test('should apply spotlight type from config', () => {
      const element = createMockElement(100, 100, 200, 50);
      const config: HighlightConfig = {
        elementId: 'test-element',
        type: 'spotlight'
      };

      highlight.applyConfig(config, element as any);

      expect(highlight.isActive()).toBe(true);
      expect(mockScene.add.rectangle).toHaveBeenCalled();
    });

    test('should apply arrow type from config', () => {
      const element = createMockElement(100, 100, 200, 50);
      const config: HighlightConfig = {
        elementId: 'test-element',
        type: 'arrow'
      };

      highlight.applyConfig(config, element as any);

      expect(highlight.isActive()).toBe(true);
    });

    test('should apply pulsate from config', () => {
      const element = createMockElement(100, 100, 200, 50);
      const config: HighlightConfig = {
        elementId: 'test-element',
        type: 'glow',
        pulsate: true
      };

      highlight.applyConfig(config, element as any);

      expect(mockScene.tweens.add).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    test('should clean up on destroy', () => {
      const element = createMockElement(100, 100, 200, 50);
      highlight.showGlow(element as any);

      highlight.destroy();

      expect(highlight.isActive()).toBe(false);
    });
  });
});
