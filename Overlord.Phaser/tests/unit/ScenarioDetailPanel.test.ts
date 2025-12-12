/**
 * ScenarioDetailPanel Tests
 * Story 1-2: Scenario Selection Interface
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
        dataStore: Map<string, unknown> = new Map();

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
        setData(key: string, value: unknown): this { this.dataStore.set(key, value); return this; }
        getData(key: string): unknown { return this.dataStore.get(key); }
        destroy(): void { this.list = []; this.dataStore.clear(); }
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
        visible = true;

        constructor(_scene: unknown, x: number, y: number, w: number, h: number) {
          this.x = x;
          this.y = y;
        }

        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        disableInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { ScenarioDetailPanel } from '../../src/scenes/ui/ScenarioDetailPanel';
import { Scenario } from '../../src/core/models/ScenarioModels';
import { ScenarioManager } from '../../src/core/ScenarioManager';

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
      width: 800,
      height: 600
    }
  }
});

describe('ScenarioDetailPanel', () => {
  let scene: any;
  let panel: ScenarioDetailPanel;
  let manager: ScenarioManager;
  let mockScenario: Scenario;

  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    scene = createMockScene();
    manager = new ScenarioManager();

    mockScenario = {
      id: 'tutorial-001',
      name: 'First Steps',
      type: 'tutorial',
      difficulty: 'easy',
      duration: '5-10 min',
      description: 'Learn the basics of planet management and resource gathering.',
      prerequisites: [],
      victoryConditions: [
        { type: 'build_structure', target: 'Mine', count: 1 }
      ],
      initialState: {
        playerPlanets: ['planet-1'],
        playerResources: { credits: 5000 },
        aiPlanets: [],
        aiEnabled: false
      },
      tutorialSteps: [
        { step: 1, text: 'Select your planet', highlight: 'planet' }
      ]
    };

    panel = new ScenarioDetailPanel(scene, manager);
  });

  afterEach(() => {
    panel.destroy();
  });

  test('should show correct scenario data', async () => {
    await manager.loadScenario(mockScenario);
    panel.setScenario(mockScenario);
    panel.show();

    expect(panel.visible).toBe(true);
    expect(panel.getDisplayedScenarioId()).toBe('tutorial-001');
  });

  test('should trigger start button callback', async () => {
    const mockStartCallback = jest.fn();
    await manager.loadScenario(mockScenario);

    panel.setScenario(mockScenario);
    panel.onStartScenario = mockStartCallback;
    panel.show();

    // Simulate clicking start button
    panel.startScenario();

    expect(mockStartCallback).toHaveBeenCalledWith(mockScenario);
  });

  test('should check prerequisites correctly', async () => {
    const prereqScenario: Scenario = {
      ...mockScenario,
      id: 'tutorial-002',
      name: 'Advanced Tutorial',
      prerequisites: ['tutorial-001']
    };

    await manager.loadScenario(mockScenario);
    await manager.loadScenario(prereqScenario);

    panel.setScenario(prereqScenario);
    panel.show();

    // Prerequisites should not be met initially
    expect(panel.arePrerequisitesMet()).toBe(false);

    // Complete prerequisite
    manager.markScenarioComplete('tutorial-001');
    panel.setScenario(prereqScenario);

    // Prerequisites should now be met
    expect(panel.arePrerequisitesMet()).toBe(true);
  });

  test('should display completion status', async () => {
    await manager.loadScenario(mockScenario);

    // Initially not completed
    panel.setScenario(mockScenario);
    expect(panel.isCompleted()).toBe(false);

    // Mark as completed
    manager.markScenarioComplete('tutorial-001');
    panel.setScenario(mockScenario);

    // Should show as completed
    expect(panel.isCompleted()).toBe(true);
  });

  describe('completion details (Story 1-6)', () => {
    test('should have setCompletionDetails method', () => {
      expect(typeof panel.setCompletionDetails).toBe('function');
    });

    test('should accept best time and star rating', async () => {
      await manager.loadScenario(mockScenario);
      panel.setScenario(mockScenario);

      expect(() => panel.setCompletionDetails({
        bestTimeSeconds: 120,
        starRating: 3
      })).not.toThrow();
    });

    test('should return empty details when no completion data set', () => {
      const details = panel.getCompletionDetails();
      expect(details).toBeUndefined();
    });

    test('should store completion details', async () => {
      await manager.loadScenario(mockScenario);
      panel.setScenario(mockScenario);
      panel.setCompletionDetails({
        bestTimeSeconds: 90,
        starRating: 2
      });

      const details = panel.getCompletionDetails();
      expect(details?.bestTimeSeconds).toBe(90);
      expect(details?.starRating).toBe(2);
    });
  });
});
