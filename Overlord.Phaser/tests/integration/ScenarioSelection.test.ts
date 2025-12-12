/**
 * Integration Tests for Scenario Selection Flow
 * Story 1-2: Scenario Selection Interface - Task 5
 */

// Mock Phaser
jest.mock('phaser', () => {
  const mockScene = {
    add: {
      existing: jest.fn(),
      graphics: jest.fn(() => {
        const mockGraphics = {
          fillStyle: jest.fn().mockReturnThis(),
          fillRoundedRect: jest.fn().mockReturnThis(),
          fillRect: jest.fn().mockReturnThis(),
          lineStyle: jest.fn().mockReturnThis(),
          strokeRoundedRect: jest.fn().mockReturnThis(),
          clear: jest.fn().mockReturnThis(),
          createGeometryMask: jest.fn(() => ({})),
          destroy: jest.fn()
        };
        return mockGraphics;
      }),
      text: jest.fn((x: number, y: number, text: string) => ({
        x, y, text, setText: jest.fn(), setOrigin: jest.fn(), setScrollFactor: jest.fn(), setColor: jest.fn(), setWordWrapWidth: jest.fn(), setInteractive: jest.fn(), on: jest.fn(), destroy: jest.fn()
      })),
      rectangle: jest.fn((x: number, y: number, w: number, h: number) => ({
        x, y, setOrigin: jest.fn(), setInteractive: jest.fn(), disableInteractive: jest.fn(), setScrollFactor: jest.fn(), setDepth: jest.fn(), setVisible: jest.fn(), on: jest.fn(), destroy: jest.fn()
      })),
      container: jest.fn((x: number, y: number) => {
        const list: any[] = [];
        const dataStore = new Map();
        return {
          x, y, list, dataStore,
          add: jest.fn((child: any) => { list.push(child); }),
          setPosition: jest.fn(),
          setVisible: jest.fn(),
          setDepth: jest.fn(),
          setScrollFactor: jest.fn(),
          setY: jest.fn(),
          setMask: jest.fn(),
          setData: jest.fn((key: string, value: any) => { dataStore.set(key, value); }),
          getData: jest.fn((key: string) => dataStore.get(key)),
          destroy: jest.fn()
        };
      })
    },
    cameras: {
      main: {
        width: 800,
        height: 600,
        centerX: 400,
        centerY: 300,
        setBackgroundColor: jest.fn()
      }
    },
    input: {
      on: jest.fn(),
      off: jest.fn()
    }
  };

  return {
    __esModule: true,
    default: {
      Scene: class MockScene {
        key: string;
        add = mockScene.add;
        cameras = mockScene.cameras;
        input = mockScene.input;

        constructor(config?: any) {
          this.key = config?.key || 'MockScene';
        }

        create(): void {}
      },
      GameObjects: {
        Container: class MockContainer {
          scene: any;
          x = 0;
          y = 0;
          visible = true;
          list: any[] = [];
          dataStore = new Map();

          constructor(scene: any, x = 0, y = 0) {
            this.scene = scene;
            this.x = x;
            this.y = y;
          }

          add(child: any): this { this.list.push(child); return this; }
          setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
          setVisible(v: boolean): this { this.visible = v; return this; }
          setDepth(): this { return this; }
          setScrollFactor(): this { return this; }
          setY(y: number): this { this.y = y; return this; }
          setMask(): this { return this; }
          setData(key: string, value: any): this { this.dataStore.set(key, value); return this; }
          getData(key: string): any { return this.dataStore.get(key); }
          destroy(): void { this.list = []; this.dataStore.clear(); }
        }
      },
      Math: {
        Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
      }
    }
  };
});

import { FlashConflictsScene } from '../../src/scenes/FlashConflictsScene';
import { Scenario } from '../../src/core/models/ScenarioModels';
import { ScenarioManager } from '../../src/core/ScenarioManager';

describe('Scenario Selection Integration', () => {
  let scene: FlashConflictsScene;
  let manager: ScenarioManager;

  beforeEach(() => {
    localStorage.clear();
    manager = new ScenarioManager();
    scene = new FlashConflictsScene();
    scene.create();
  });

  test('should display panels correctly', () => {
    // Scene should create both panels
    expect(scene).toBeDefined();
    // Check that panels were created (they're private, but we can verify scene created successfully)
    expect(scene['listPanel']).toBeDefined();
    expect(scene['detailPanel']).toBeDefined();
  });

  test('should handle selection flow from list to detail', async () => {
    const mockScenario: Scenario = {
      id: 'test-001',
      name: 'Test Scenario',
      type: 'tutorial',
      difficulty: 'easy',
      duration: '5 min',
      description: 'Test',
      prerequisites: [],
      victoryConditions: [{ type: 'survive_turns', turns: 5 }],
      initialState: {
        playerPlanets: ['planet-1'],
        playerResources: { credits: 1000 },
        aiPlanets: [],
        aiEnabled: false
      }
    };

    await manager.loadScenario(mockScenario);

    // Simulate selecting a scenario
    const listPanel = scene['listPanel'];
    const detailPanel = scene['detailPanel'];

    listPanel.setScenarios([mockScenario]);
    listPanel.show();

    // Trigger selection callback
    if (listPanel.onScenarioSelected) {
      listPanel.onScenarioSelected(mockScenario);
    }

    // Detail panel should now show the scenario
    expect(detailPanel.getDisplayedScenarioId()).toBe('test-001');
  });

  test('should start scenario successfully', async () => {
    const mockScenario: Scenario = {
      id: 'start-test',
      name: 'Start Test',
      type: 'tutorial',
      difficulty: 'easy',
      duration: '5 min',
      description: 'Test starting',
      prerequisites: [],
      victoryConditions: [{ type: 'survive_turns', turns: 5 }],
      initialState: {
        playerPlanets: ['planet-1'],
        playerResources: { credits: 1000 },
        aiPlanets: [],
        aiEnabled: false
      }
    };

    await manager.loadScenario(mockScenario);

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const detailPanel = scene['detailPanel'];
    detailPanel.setScenario(mockScenario);

    // Trigger start scenario
    if (detailPanel.onStartScenario) {
      detailPanel.onStartScenario(mockScenario);
    }

    // Should log that scenario is starting
    expect(consoleLogSpy).toHaveBeenCalledWith('Starting scenario: start-test');

    consoleLogSpy.mockRestore();
  });
});
