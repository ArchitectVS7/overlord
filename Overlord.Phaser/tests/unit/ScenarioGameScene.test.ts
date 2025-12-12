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

// Create mock scene context with comprehensive Phaser mocks
function createMockSceneContext() {
  const addedObjects: unknown[] = [];
  const keyboardHandlers: Map<string, Function> = new Map();

  return {
    scene: {
      isActive: jest.fn().mockReturnValue(true),
      add: {
        text: jest.fn((x: number, y: number, text: string, _style?: unknown) => {
          const textObj = {
            x, y, text,
            visible: true,
            alpha: 1,
            setOrigin: jest.fn().mockReturnThis(),
            setInteractive: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setText: jest.fn((t: string) => { textObj.text = t; return textObj; }),
            setVisible: jest.fn((v: boolean) => { textObj.visible = v; return textObj; }),
            setAlpha: jest.fn((a: number) => { textObj.alpha = a; return textObj; }),
            setWordWrapWidth: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            off: jest.fn().mockReturnThis(),
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
            setFillStyle: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            destroy: jest.fn()
          };
          return rect;
        }),
        graphics: jest.fn(() => {
          const gfx = {
            y: 0,
            alpha: 1,
            fillStyle: jest.fn().mockReturnThis(),
            fillRoundedRect: jest.fn().mockReturnThis(),
            fillRect: jest.fn().mockReturnThis(),
            lineStyle: jest.fn().mockReturnThis(),
            strokeRoundedRect: jest.fn().mockReturnThis(),
            strokeRect: jest.fn().mockReturnThis(),
            beginPath: jest.fn().mockReturnThis(),
            moveTo: jest.fn().mockReturnThis(),
            lineTo: jest.fn().mockReturnThis(),
            closePath: jest.fn().mockReturnThis(),
            fillPath: jest.fn().mockReturnThis(),
            clear: jest.fn().mockReturnThis(),
            setDepth: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setAlpha: jest.fn().mockReturnThis(),
            destroy: jest.fn()
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
      delayedCall: jest.fn((_delay: number, callback: Function) => {
        // Immediately invoke callback for testing
        callback();
        return { remove: jest.fn() };
      }),
      addEvent: jest.fn((config: any) => {
        return { remove: jest.fn(), paused: false, ...config };
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
    (sceneInstance as any).tweens = mockContext.tweens;
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

  describe('completion time tracking (Story 1-5)', () => {
    test('should record scenario start time on create', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });

      const beforeCreate = Date.now();
      sceneInstance.create();
      const afterCreate = Date.now();

      const startTime = (sceneInstance as any).scenarioStartTime;
      expect(startTime).toBeDefined();
      expect(startTime).toBeGreaterThanOrEqual(beforeCreate);
      expect(startTime).toBeLessThanOrEqual(afterCreate);
    });

    test('should calculate elapsed time in seconds', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      // Manually set start time to 60 seconds ago
      (sceneInstance as any).scenarioStartTime = Date.now() - 60000;

      const elapsed = sceneInstance.getElapsedTimeSeconds();
      expect(elapsed).toBeGreaterThanOrEqual(59); // Allow for timing variance
      expect(elapsed).toBeLessThanOrEqual(61);
    });

    test('should have getElapsedTimeSeconds method', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect(typeof sceneInstance.getElapsedTimeSeconds).toBe('function');
    });

    test('should return 0 for elapsed time if scenario not started', () => {
      // Don't call create
      expect(sceneInstance.getElapsedTimeSeconds()).toBe(0);
    });

    test('should have ScenarioResultsPanel after create', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect((sceneInstance as any).resultsPanel).toBeDefined();
    });

    test('should have showResults method', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect(typeof sceneInstance.showResults).toBe('function');
    });
  });

  describe('victory/defeat detection integration (Story 1-5)', () => {
    test('should have checkVictoryConditions method', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect(typeof (sceneInstance as any).checkVictoryConditions).toBe('function');
    });

    test('should have checkDefeatConditions method', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      expect(typeof (sceneInstance as any).checkDefeatConditions).toBe('function');
    });

    test('should set up periodic condition checking', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      // Verify time.addEvent was called for condition checking
      expect((sceneInstance as any).conditionCheckTimer).toBeDefined();
    });

    test('should not check conditions when gameplay is paused', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      // Manually pause gameplay
      (sceneInstance as any).scenarioPaused = true;

      // Manually call check - should return early
      const result = (sceneInstance as any).checkVictoryConditions();
      expect(result).toBe(false);
    });

    test('should trigger victory when all conditions met', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      // Mock victory system to return all conditions met
      (sceneInstance as any).victorySystem.evaluateAll = jest.fn().mockReturnValue({
        allMet: true,
        conditions: [{ condition: { type: 'defeat_enemy' }, met: true, progress: 1, description: 'Victory!' }]
      });

      // Check conditions
      const result = (sceneInstance as any).checkVictoryConditions();
      expect(result).toBe(true);
      expect((sceneInstance as any).scenarioPaused).toBe(true);
    });

    test('should detect defeat when player has no planets', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      // Remove all player planets from game state
      (sceneInstance as any).gameState.playerFaction.ownedPlanetIDs = [];

      // Check defeat conditions
      const result = (sceneInstance as any).checkDefeatConditions();
      expect(result).toBe(true);
    });

    test('should not detect defeat when player has planets', () => {
      const scenario = createValidScenario();
      sceneInstance.init({ scenario });
      sceneInstance.create();

      // Ensure player has planets
      expect((sceneInstance as any).gameState.playerFaction.ownedPlanetIDs.length).toBeGreaterThan(0);

      // Check defeat conditions
      const result = (sceneInstance as any).checkDefeatConditions();
      expect(result).toBe(false);
    });
  });
});
