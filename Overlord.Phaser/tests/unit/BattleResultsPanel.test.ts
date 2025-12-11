/**
 * Tests for BattleResultsPanel
 * Story 6-3: Combat Resolution and Battle Results
 *
 * Tests verify the battle results display with victory/defeat layouts.
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
        scrollFactorX = 1;
        scrollFactorY = 1;
        list: unknown[] = [];

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        removeAll(_destroyChild?: boolean): this { this.list = []; return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setScrollFactor(x: number, y?: number): this {
          this.scrollFactorX = x;
          this.scrollFactorY = y ?? x;
          return this;
        }
        destroy(): void { this.list = []; }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
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

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }

        setText(t: string): this { this.text = t; return this; }
        setOrigin(): this { return this; }
        setColor(c: string): this { this.style.color = c; return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        visible = true;
        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        destroy(): void {}
      },
      Zone: class MockZone {
        listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();
        setInteractive(): this { return this; }
        on(event: string, callback: (...args: unknown[]) => void): this {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
          }
          this.listeners.get(event)!.push(callback);
          return this;
        }
        emit(event: string, ...args: unknown[]): void {
          const handlers = this.listeners.get(event);
          if (handlers) handlers.forEach(h => h(...args));
        }
        destroy(): void {}
      }
    },
    Scene: class MockScene {}
  }
}));

import { BattleResultsPanel, BattleResultData } from '../../src/scenes/ui/BattleResultsPanel';

// Create mock scene
function createMockScene(): Phaser.Scene {
  return {
    add: {
      existing: jest.fn(),
      graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
      text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
        new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)
      ),
      rectangle: jest.fn((x: number, y: number, w: number, h: number, color?: number, alpha?: number) =>
        new (jest.requireMock('phaser').default.GameObjects.Rectangle)(null, x, y, w, h, color, alpha)
      ),
      zone: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Zone)(null, 0, 0, 100, 100)),
      container: jest.fn((x: number, y: number) =>
        new (jest.requireMock('phaser').default.GameObjects.Container)(null, x, y)
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
    }
  } as unknown as Phaser.Scene;
}

describe('BattleResultsPanel', () => {
  let scene: Phaser.Scene;
  let panel: BattleResultsPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new BattleResultsPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    test('should create panel', () => {
      expect(panel).toBeDefined();
      expect(panel.getIsVisible()).toBe(false);
    });

    test('should start hidden', () => {
      expect(panel.getIsVisible()).toBe(false);
    });
  });

  describe('victory display', () => {
    const victoryData: BattleResultData = {
      victory: true,
      planetName: 'Test Planet',
      attackerCasualties: 50,
      defenderCasualties: 100,
      resourcesCaptured: {
        credits: 1000,
        minerals: 500,
        fuel: 250
      }
    };

    test('should show victory screen', () => {
      panel.show(victoryData);
      expect(panel.getIsVisible()).toBe(true);
    });

    test('should display victory message', () => {
      panel.show(victoryData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const victoryText = texts.find(call => call[2]?.includes('VICTORY'));
      expect(victoryText).toBeDefined();
    });

    test('should display planet name', () => {
      panel.show(victoryData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const planetText = texts.find(call => call[2]?.includes('Test Planet'));
      expect(planetText).toBeDefined();
    });

    test('should display casualty counts', () => {
      panel.show(victoryData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const yourLossesText = texts.find(call => call[2]?.includes('Your losses: 50'));
      const enemyLossesText = texts.find(call => call[2]?.includes('Enemy losses: 100'));
      expect(yourLossesText).toBeDefined();
      expect(enemyLossesText).toBeDefined();
    });

    test('should display captured resources', () => {
      panel.show(victoryData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const resourceText = texts.find(call =>
        call[2]?.includes('Credits: 1,000') ||
        call[2]?.includes('Credits: 1000')
      );
      expect(resourceText).toBeDefined();
    });

    test('should call onClose callback when continue clicked', () => {
      const onClose = jest.fn();
      panel.show(victoryData, onClose);
      panel.hide();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('defeat display', () => {
    const defeatData: BattleResultData = {
      victory: false,
      planetName: 'Enemy World',
      attackerCasualties: 150,
      defenderCasualties: 50,
      defeatReason: 'Insufficient forces'
    };

    test('should show defeat screen', () => {
      panel.show(defeatData);
      expect(panel.getIsVisible()).toBe(true);
    });

    test('should display defeat message', () => {
      panel.show(defeatData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const defeatText = texts.find(call => call[2]?.includes('DEFEAT'));
      expect(defeatText).toBeDefined();
    });

    test('should display defeat reason', () => {
      panel.show(defeatData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const reasonText = texts.find(call => call[2]?.includes('Insufficient forces'));
      expect(reasonText).toBeDefined();
    });

    test('should not show resource capture on defeat', () => {
      panel.show(defeatData);
      const texts = (scene.add.text as jest.Mock).mock.calls;
      const resourceText = texts.find(call => call[2]?.includes('Resources Captured'));
      expect(resourceText).toBeUndefined();
    });
  });

  describe('hide functionality', () => {
    test('should hide panel', () => {
      const data: BattleResultData = {
        victory: true,
        planetName: 'Test',
        attackerCasualties: 0,
        defenderCasualties: 0
      };
      panel.show(data);
      panel.hide();
      expect(panel.getIsVisible()).toBe(false);
    });

    test('should not hide if not visible', () => {
      expect(panel.getIsVisible()).toBe(false);
      panel.hide();
      expect(panel.getIsVisible()).toBe(false);
    });
  });
});
