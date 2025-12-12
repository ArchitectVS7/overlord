/**
 * Tests for ScenarioGameScene
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Tests verify the scenario gameplay scene functionality.
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
    },
    Input: {
      Keyboard: {
        KeyCodes: { O: 79 }
      }
    }
  }
}));

import { ScenarioGameScene } from '../../src/scenes/ScenarioGameScene';
import { Scenario } from '@core/models/ScenarioModels';
import { AIPersonality, AIDifficulty } from '@core/models/Enums';

// Create mock scene context
function createMockSceneContext() {
  const addedObjects: unknown[] = [];
  const keyboardHandlers: Map<string, Function> = new Map();

  return {
    scene: {
      isActive: jest.fn().mockReturnValue(true),
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
      },
      start: jest.fn()
    },
    cameras: {
      main: {
        width: 1024,
        height: 768,
        centerX: 512,
        centerY: 384,
        setBackgroundColor: jest.fn()
      }
    },
    input: {
      keyboard: {
        on: jest.fn((event: string, handler: Function) => {
          keyboardHandlers.set(event, handler);
          return { removeListener: jest.fn() };
        }),
        off: jest.fn().mockReturnThis()
      }
    },
    time: {
      delayedCall: jest.fn((delay: number, callback: Function) => {
        // Immediately invoke callback for testing
        callback();
        return { remove: jest.fn() };
      })
    },
    addedObjects,
    keyboardHandlers
  };
}

// Helper to create a valid test scenario
function createValidScenario(): Scenario {
  return {
    id: 'test-scenario',
    name: 'Test Scenario',
    type: 'tutorial',
    difficulty: 'easy',
    duration: '10-15 min',
    description: 'A test scenario for unit tests',
    prerequisites: [],
    victoryConditions: [
      { type: 'defeat_enemy' }
    ],
    initialState: {
      playerPlanets: ['Alpha Prime'],
      playerResources: {
        credits: 5000,
        minerals: 1000,
        fuel: 500,
        food: 300,
        energy: 200
      },
      aiPlanets: ['Beta Station'],
      aiEnabled: true,
      aiPersonality: AIPersonality.Balanced,
      aiDifficulty: AIDifficulty.Normal
    }
  };
}

describe('ScenarioGameScene', () => {
  let sceneInstance: ScenarioGameScene;
  let mockContext: ReturnType<typeof createMockSceneContext>;

  beforeEach(() => {
    sceneInstance = new ScenarioGameScene();
    mockContext = createMockSceneContext();
    // Assign mock properties to scene instance
    (sceneInstance as any).add = mockContext.scene.add;
    (sceneInstance as any).scene = mockContext.scene;
    (sceneInstance as any).cameras = mockContext.cameras;
    (sceneInstance as any).input = mockContext.input;
    (sceneInstance as any).time = mockContext.time;
  });

  describe('initialization', () => {
    test('should create scene with correct key', () => {
      expect(sceneInstance).toBeDefined();
      expect((sceneInstance as any).key).toBe('ScenarioGameScene');
    });
  });

  describe('init', () => {
    test('should accept scenario data', () => {
      const scenario = createValidScenario();
      expect(() => sceneInstance.init({ scenario })).not.toThrow();
    });

    test('should store scenario reference', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      expect((sceneInstance as any).scenario).toBe(scenario);
    });
  });

  describe('create', () => {
    test('should initialize GameState from scenario', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect((sceneInstance as any).gameState).toBeDefined();
    });

    test('should create ObjectivesPanel', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect((sceneInstance as any).objectivesPanel).toBeDefined();
    });

    test('should show ObjectivesPanel at start', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      const panel = (sceneInstance as any).objectivesPanel;
      expect(panel.isVisible()).toBe(true);
    });

    test('should register keyboard shortcut for O key', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect(mockContext.input.keyboard.on).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    test('should handle missing scenario gracefully', () => {
      sceneInstance.init({ scenario: null });
      sceneInstance.create();

      // Should return to FlashConflictsScene on error
      expect(mockContext.scene.start).toHaveBeenCalledWith('FlashConflictsScene');
    });
  });

  describe('victory condition checking', () => {
    test('should have victory condition system', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect((sceneInstance as any).victorySystem).toBeDefined();
    });
  });
});
