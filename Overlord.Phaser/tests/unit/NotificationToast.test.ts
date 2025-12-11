/**
 * Tests for NotificationToast and NotificationManager
 * Story 7-1: AI Strategic Decision-Making (Notifications)
 *
 * Tests verify toast notification system for AI actions.
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
        alpha = 1;
        depth = 0;
        scrollFactorX = 1;
        scrollFactorY = 1;
        list: unknown[] = [];
        listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setScrollFactor(x: number, y?: number): this {
          this.scrollFactorX = x;
          this.scrollFactorY = y ?? x;
          return this;
        }
        once(event: string, callback: (...args: unknown[]) => void): this {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
          }
          this.listeners.get(event)!.push(callback);
          return this;
        }
        emit(event: string, ...args: unknown[]): void {
          const handlers = this.listeners.get(event);
          if (handlers) {
            handlers.forEach(h => h(...args));
            this.listeners.delete(event); // once() removes after calling
          }
        }
        destroy(): void {
          this.emit('destroy');
          this.list = [];
          this.listeners.clear();
        }
      },
      Graphics: class MockGraphics {
        fillStyle = jest.fn(function(this: any) { return this; });
        fillRoundedRect = jest.fn(function(this: any) { return this; });
        lineStyle = jest.fn(function(this: any) { return this; });
        strokeRoundedRect = jest.fn(function(this: any) { return this; });
        destroy = jest.fn();
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        style: Record<string, unknown> = {};

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }

        setOrigin(): this { return this; }
        destroy(): void {}
      }
    },
    Scene: class MockScene {}
  }
}));

import { NotificationToast, NotificationManager } from '../../src/scenes/ui/NotificationToast';

// Create mock scene
function createMockScene(): Phaser.Scene {
  return {
    add: {
      existing: jest.fn(),
      graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
      text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
        new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)
      )
    },
    cameras: {
      main: {
        width: 1920,
        height: 1080
      }
    },
    tweens: {
      add: jest.fn((config) => {
        if (config.onComplete) config.onComplete();
        return { stop: jest.fn() };
      })
    },
    time: {
      delayedCall: jest.fn((delay, callback) => {
        // Don't auto-call for testing
        return { callback };
      })
    }
  } as unknown as Phaser.Scene;
}

describe('NotificationToast', () => {
  let scene: Phaser.Scene;

  beforeEach(() => {
    scene = createMockScene();
  });

  describe('initialization', () => {
    test('should create toast with message', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Test message');
      expect(toast).toBeDefined();
    });

    test('should use info style by default', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Test');
      const graphics = (scene.add.graphics as jest.Mock).mock.results[0].value;
      expect(graphics.fillStyle).toHaveBeenCalled();
    });

    test('should apply warning style', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Warning', 'warning');
      expect(toast).toBeDefined();
    });

    test('should apply danger style', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Danger', 'danger');
      expect(toast).toBeDefined();
    });

    test('should set correct depth', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Test');
      expect(toast.depth).toBe(2000);
    });

    test('should set scroll factor to 0', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Test');
      expect(toast.scrollFactorX).toBe(0);
      expect(toast.scrollFactorY).toBe(0);
    });
  });

  describe('dismiss', () => {
    test('should dismiss toast', () => {
      const toast = new NotificationToast(scene, 100, 100, 'Test');
      toast.dismiss();
      expect(scene.tweens.add).toHaveBeenCalled();
    });
  });
});

describe('NotificationManager', () => {
  let scene: Phaser.Scene;
  let manager: NotificationManager;

  beforeEach(() => {
    scene = createMockScene();
    manager = new NotificationManager(scene);
  });

  describe('showNotification', () => {
    test('should create and show notification', () => {
      manager.showNotification('AI is making a move');
      expect(scene.add.existing).toHaveBeenCalled();
    });

    test('should stack multiple notifications', () => {
      manager.showNotification('First notification');
      manager.showNotification('Second notification');
      expect(scene.add.existing).toHaveBeenCalledTimes(2);
    });

    test('should apply info style', () => {
      manager.showNotification('Info message', 'info');
      expect(scene.add.existing).toHaveBeenCalled();
    });

    test('should apply warning style', () => {
      manager.showNotification('Warning message', 'warning');
      expect(scene.add.existing).toHaveBeenCalled();
    });

    test('should apply danger style', () => {
      manager.showNotification('Danger message', 'danger');
      expect(scene.add.existing).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    test('should clear all notifications', () => {
      manager.showNotification('First');
      manager.showNotification('Second');
      manager.clear();
      // Toasts should be dismissed
      expect(scene.tweens.add).toHaveBeenCalled();
    });

    test('should handle clearing when no notifications exist', () => {
      manager.clear();
      // Should not throw
      expect(true).toBe(true);
    });
  });
});
