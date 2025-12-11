/**
 * Tests for OpponentInfoPanel
 * Story 7-2: AI Personality and Difficulty Adaptation (Display)
 *
 * Tests verify the opponent information display panel.
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
        scrollFactorX = 1;
        scrollFactorY = 1;
        list: unknown[] = [];

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        setDepth(d: number): this { this.depth = d; return this; }
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
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        style: Record<string, unknown> = {};
        setText = jest.fn(function(this: any, t: string) { this.text = t; return this; });
        setOrigin = jest.fn(function(this: any) { return this; });
        setColor = jest.fn(function(this: any, c: string) { this.style.color = c; return this; });
        destroy = jest.fn();

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }
      }
    },
    Scene: class MockScene {}
  }
}));

import { OpponentInfoPanel } from '../../src/scenes/ui/OpponentInfoPanel';

// Create mock scene
function createMockScene(): Phaser.Scene {
  return {
    add: {
      existing: jest.fn(),
      graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
      text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
        new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)
      )
    }
  } as unknown as Phaser.Scene;
}

describe('OpponentInfoPanel', () => {
  let scene: Phaser.Scene;
  let panel: OpponentInfoPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new OpponentInfoPanel(scene, 100, 100);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    test('should create panel', () => {
      expect(panel).toBeDefined();
    });

    test('should set correct depth', () => {
      expect(panel.depth).toBe(1000);
    });

    test('should set scroll factor to 0', () => {
      expect(panel.scrollFactorX).toBe(0);
      expect(panel.scrollFactorY).toBe(0);
    });

    test('should show default AI Commander name', () => {
      expect(panel.getCommanderName()).toBe('AI Commander');
    });

    test('should show default Balanced personality', () => {
      expect(panel.getPersonality()).toBe('Balanced');
    });

    test('should show default Normal difficulty', () => {
      expect(panel.getDifficulty()).toBe('Normal');
    });
  });

  describe('setOpponentInfo', () => {
    test('should update commander name', () => {
      panel.setOpponentInfo('Commander Vex', 'Aggressive', 'Hard');
      expect(panel.getCommanderName()).toBe('Commander Vex');
    });

    test('should update personality', () => {
      panel.setOpponentInfo('Test', 'Defensive', 'Easy');
      expect(panel.getPersonality()).toBe('Defensive');
    });

    test('should update difficulty', () => {
      panel.setOpponentInfo('Test', 'Balanced', 'Hard');
      expect(panel.getDifficulty()).toBe('Hard');
    });

    test('should color Easy difficulty as green', () => {
      panel.setOpponentInfo('Test', 'Balanced', 'Easy');
      const texts = (scene.add.text as jest.Mock).mock.results;
      const difficultyText = texts[texts.length - 1].value;
      expect(difficultyText.setColor).toHaveBeenCalledWith('#66cc66');
    });

    test('should color Hard difficulty as red', () => {
      panel.setOpponentInfo('Test', 'Balanced', 'Hard');
      const texts = (scene.add.text as jest.Mock).mock.results;
      const difficultyText = texts[texts.length - 1].value;
      expect(difficultyText.setColor).toHaveBeenCalledWith('#cc6666');
    });

    test('should color Normal difficulty as yellow', () => {
      panel.setOpponentInfo('Test', 'Balanced', 'Normal');
      const texts = (scene.add.text as jest.Mock).mock.results;
      const difficultyText = texts[texts.length - 1].value;
      expect(difficultyText.setColor).toHaveBeenCalledWith('#cccc66');
    });
  });

  describe('getters', () => {
    test('should get commander name', () => {
      panel.setOpponentInfo('Test Commander', 'Aggressive', 'Easy');
      expect(panel.getCommanderName()).toBe('Test Commander');
    });

    test('should get personality', () => {
      panel.setOpponentInfo('Test', 'Economic', 'Normal');
      expect(panel.getPersonality()).toBe('Economic');
    });

    test('should get difficulty', () => {
      panel.setOpponentInfo('Test', 'Balanced', 'Hard');
      expect(panel.getDifficulty()).toBe('Hard');
    });
  });
});
