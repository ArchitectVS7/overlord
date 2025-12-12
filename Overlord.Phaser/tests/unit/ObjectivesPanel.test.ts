/**
 * Tests for ObjectivesPanel
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Tests verify the objectives display panel functionality.
 */

// Mock Phaser before imports
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Scene: class MockScene {
      key: string;
      constructor(config: { key: string }) {
        this.key = config.key;
      }
    },
    GameObjects: {
      Container: class MockContainer {
        scene: unknown;
        x = 0;
        y = 0;
        visible = true;
        depth = 0;
        list: unknown[] = [];
        data: Map<string, unknown> = new Map();

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
        setScrollFactor(): this { return this; }
        setData(key: string, value: unknown): this { this.data.set(key, value); return this; }
        getData(key: string): unknown { return this.data.get(key); }
        destroy(): void { this.list = []; this.data.clear(); }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
        fillRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRoundedRect(): this { return this; }
        strokeRect(): this { return this; }
        clear(): this { return this; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        constructor(_scene: unknown, x: number, y: number, text: string) {
          this.x = x;
          this.y = y;
          this.text = text;
        }
        setText(t: string): this { this.text = t; return this; }
        setOrigin(): this { return this; }
        setColor(): this { return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { ObjectivesPanel } from '../../src/scenes/ui/ObjectivesPanel';
import { VictoryCondition } from '@core/models/ScenarioModels';
import { ConditionResult } from '@core/VictoryConditionSystem';

// Create mock scene context
function createMockSceneContext() {
  const addedObjects: unknown[] = [];

  return {
    scene: {
      add: {
        text: jest.fn((x: number, y: number, text: string, style?: unknown) => {
          const textObj = {
            x, y, text, style,
            setOrigin: jest.fn().mockReturnThis(),
            setInteractive: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setText: jest.fn((t: string) => { textObj.text = t; return textObj; }),
            on: jest.fn().mockReturnThis(),
            destroy: jest.fn()
          };
          addedObjects.push(textObj);
          return textObj;
        }),
        container: jest.fn((x: number, y: number) => {
          const containerData = new Map<string, unknown>();
          const container = {
            x, y,
            visible: true,
            add: jest.fn().mockReturnThis(),
            setVisible: jest.fn((v: boolean) => { container.visible = v; return container; }),
            setDepth: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setPosition: jest.fn().mockReturnThis(),
            setData: jest.fn((key: string, value: unknown) => { containerData.set(key, value); return container; }),
            getData: jest.fn((key: string) => containerData.get(key)),
            on: jest.fn().mockReturnThis(),
            destroy: jest.fn()
          };
          addedObjects.push(container);
          return container;
        }),
        existing: jest.fn().mockReturnValue(undefined),
        rectangle: jest.fn(() => {
          const rect = {
            setOrigin: jest.fn().mockReturnThis(),
            setInteractive: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setDepth: jest.fn().mockReturnThis(),
            setVisible: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis()
          };
          return rect;
        }),
        graphics: jest.fn(() => {
          const gfx = {
            fillStyle: jest.fn().mockReturnThis(),
            fillRoundedRect: jest.fn().mockReturnThis(),
            fillRect: jest.fn().mockReturnThis(),
            lineStyle: jest.fn().mockReturnThis(),
            strokeRoundedRect: jest.fn().mockReturnThis(),
            strokeRect: jest.fn().mockReturnThis(),
            clear: jest.fn().mockReturnThis()
          };
          addedObjects.push(gfx);
          return gfx;
        })
      }
    },
    cameras: {
      main: {
        width: 1024,
        height: 768,
        centerX: 512,
        centerY: 384
      }
    },
    input: {
      keyboard: {
        on: jest.fn().mockReturnThis(),
        off: jest.fn().mockReturnThis()
      }
    },
    addedObjects
  };
}

describe('ObjectivesPanel', () => {
  let panel: ObjectivesPanel;
  let mockContext: ReturnType<typeof createMockSceneContext>;
  let mockScene: any;

  beforeEach(() => {
    mockContext = createMockSceneContext();
    mockScene = {
      add: mockContext.scene.add,
      cameras: mockContext.cameras,
      input: mockContext.input
    };
    panel = new ObjectivesPanel(mockScene);
  });

  describe('initialization', () => {
    test('should create ObjectivesPanel', () => {
      expect(panel).toBeDefined();
    });

    test('should be hidden by default', () => {
      expect(panel.isVisible()).toBe(false);
    });
  });

  describe('show/hide', () => {
    test('should show panel', () => {
      panel.show();
      expect(panel.isVisible()).toBe(true);
    });

    test('should hide panel', () => {
      panel.show();
      panel.hide();
      expect(panel.isVisible()).toBe(false);
    });

    test('should toggle visibility', () => {
      expect(panel.isVisible()).toBe(false);
      panel.toggle();
      expect(panel.isVisible()).toBe(true);
      panel.toggle();
      expect(panel.isVisible()).toBe(false);
    });
  });

  describe('setObjectives', () => {
    test('should accept victory conditions', () => {
      const conditions: VictoryCondition[] = [
        { type: 'defeat_enemy' },
        { type: 'build_structure', target: 'MiningStation' }
      ];

      // Should not throw
      expect(() => panel.setObjectives(conditions)).not.toThrow();
    });

    test('should store objectives', () => {
      const conditions: VictoryCondition[] = [
        { type: 'defeat_enemy' }
      ];

      panel.setObjectives(conditions);
      expect(panel.getObjectivesCount()).toBe(1);
    });
  });

  describe('updateProgress', () => {
    test('should accept condition results', () => {
      const conditions: VictoryCondition[] = [
        { type: 'defeat_enemy' }
      ];
      panel.setObjectives(conditions);

      const results: ConditionResult[] = [
        {
          condition: { type: 'defeat_enemy' },
          met: false,
          progress: 0.5,
          description: 'Defeat all enemies (1 remaining)'
        }
      ];

      // Should not throw
      expect(() => panel.updateProgress(results)).not.toThrow();
    });
  });

  describe('callbacks', () => {
    test('should call onContinue when continue clicked', () => {
      const callback = jest.fn();
      panel.onContinue = callback;

      panel.show();
      // Simulate continue button click
      panel.handleContinue();

      expect(callback).toHaveBeenCalled();
    });
  });
});
