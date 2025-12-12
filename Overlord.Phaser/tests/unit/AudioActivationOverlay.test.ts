/**
 * AudioActivationOverlay Tests
 * Story 12-5: User Activation for Browser Audio Compliance
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
        list: unknown[] = [];

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        removeAll(destroyChildren?: boolean): this { this.list = []; return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setScrollFactor(): this { return this; }
        destroy(): void { this.list = []; }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
        fillRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRoundedRect(): this { return this; }
        clear(): this { return this; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        style: Record<string, unknown> = {};
        visible = true;

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }

        setText(t: string): this { this.text = t; return this; }
        setOrigin(): this { return this; }
        setWordWrapWidth(): this { return this; }
        setColor(c: string): this { this.style.color = c; return this; }
        setInteractive(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        visible = true;
        fillColor = 0;

        constructor(_scene: unknown, x: number, y: number, w: number, h: number) {
          this.x = x;
          this.y = y;
          this.width = w;
          this.height = h;
        }

        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        disableInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setFillStyle(color: number): this { this.fillColor = color; return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { AudioActivationOverlay } from '../../src/scenes/ui/AudioActivationOverlay';
import { AudioManager, resetAudioManager } from '../../src/core/AudioManager';

// Mock localStorage
const mockStorage: Record<string, string> = {};
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => mockStorage[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
    clear: jest.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); })
  }
});

// Mock scene
const createMockScene = () => ({
  add: {
    existing: jest.fn(),
    graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
    text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
      new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)),
    rectangle: jest.fn((x: number, y: number, w: number, h: number) =>
      new (jest.requireMock('phaser').default.GameObjects.Rectangle)(null, x, y, w, h)),
    container: jest.fn((x: number, y: number) =>
      new (jest.requireMock('phaser').default.GameObjects.Container)(null, x, y))
  },
  cameras: {
    main: {
      width: 1024,
      height: 768
    }
  },
  input: {
    keyboard: {
      on: jest.fn()
    },
    on: jest.fn()
  }
});

describe('AudioActivationOverlay', () => {
  let scene: ReturnType<typeof createMockScene>;
  let overlay: AudioActivationOverlay;
  let audioManager: AudioManager;

  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    jest.clearAllMocks();
    resetAudioManager();

    scene = createMockScene();
    audioManager = AudioManager.getInstance();
    overlay = new AudioActivationOverlay(scene as unknown as Phaser.Scene);
  });

  afterEach(() => {
    overlay.destroy();
    resetAudioManager();
  });

  describe('creation', () => {
    test('should create overlay', () => {
      expect(overlay).toBeDefined();
    });

    test('should be visible by default', () => {
      expect(overlay.visible).toBe(true);
    });

    test('should display activation message', () => {
      expect(overlay.getMessage()).toContain('Click anywhere');
    });

    test('should have high depth to appear on top', () => {
      expect(overlay.getDepthValue()).toBeGreaterThan(1000);
    });
  });

  describe('activation', () => {
    test('should activate AudioManager on activation', () => {
      expect(audioManager.isActivated()).toBe(false);
      overlay.activate();
      expect(audioManager.isActivated()).toBe(true);
    });

    test('should hide overlay after activation', () => {
      overlay.activate();
      expect(overlay.visible).toBe(false);
    });

    test('should trigger callback on activation', () => {
      const callback = jest.fn();
      overlay.onActivated = callback;
      overlay.activate();
      expect(callback).toHaveBeenCalled();
    });

    test('should not activate twice', () => {
      const callback = jest.fn();
      overlay.onActivated = callback;
      overlay.activate();
      overlay.activate();
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('visibility control', () => {
    test('should show overlay', () => {
      overlay.hide();
      overlay.show();
      expect(overlay.visible).toBe(true);
    });

    test('should hide overlay', () => {
      overlay.hide();
      expect(overlay.visible).toBe(false);
    });

    test('should not show if already activated', () => {
      overlay.activate();
      overlay.show();
      expect(overlay.visible).toBe(false);
    });
  });

  describe('dismiss without activating', () => {
    test('should dismiss overlay without activating', () => {
      overlay.dismiss();
      expect(overlay.visible).toBe(false);
      expect(audioManager.isActivated()).toBe(false);
    });

    test('should allow manual activation later via settings', () => {
      overlay.dismiss();
      expect(overlay.canActivateLater()).toBe(true);
    });
  });

  describe('check if needs activation', () => {
    test('should need activation when audio not activated', () => {
      expect(AudioActivationOverlay.needsActivation()).toBe(true);
    });

    test('should not need activation after activation', () => {
      overlay.activate();
      expect(AudioActivationOverlay.needsActivation()).toBe(false);
    });
  });

  describe('UI elements', () => {
    test('should have background overlay', () => {
      expect(overlay.hasBackgroundOverlay()).toBe(true);
    });

    test('should have message text', () => {
      expect(overlay.hasMessageText()).toBe(true);
    });

    test('should have interactive region', () => {
      expect(overlay.hasInteractiveRegion()).toBe(true);
    });
  });
});
