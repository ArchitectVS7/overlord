/**
 * ScenarioListPanel Tests
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
        alpha = 1;
        scrollFactorX = 1;
        scrollFactorY = 1;
        list: unknown[] = [];
        dataStore: Map<string, unknown> = new Map();
        mask: unknown = null;

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        getAll(): unknown[] { return this.list; }
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
        setY(y: number): this { this.y = y; return this; }
        setMask(mask: unknown): this { this.mask = mask; return this; }
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
        lineBetween(): this { return this; }
        clear(): this { return this; }
        createGeometryMask(): unknown { return {}; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        style: Record<string, unknown> = {};
        originX = 0;
        originY = 0;
        visible = true;
        dataStore: Map<string, unknown> = new Map();

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }

        setText(t: string): this { this.text = t; return this; }
        setOrigin(x: number, y?: number): this { this.originX = x; this.originY = y ?? x; return this; }
        setColor(c: string): this { this.style.color = c; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setInteractive(): this { return this; }
        on(): this { return this; }
        setData(key: string, value: unknown): this { this.dataStore.set(key, value); return this; }
        getData(key: string): unknown { return this.dataStore.get(key); }
        destroy(): void { this.dataStore.clear(); }
      },
      Rectangle: class MockRectangle {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        originX = 0;
        originY = 0;
        visible = true;

        constructor(_scene: unknown, x: number, y: number, width: number, height: number) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
        }

        setOrigin(x: number, y?: number): this { this.originX = x; this.originY = y ?? x; return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    },
    Math: {
      Clamp: (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
    }
  }
}));

import { ScenarioListPanel } from '../../src/scenes/ui/ScenarioListPanel';
import { Scenario } from '../../src/core/models/ScenarioModels';

// Mock scene
const createMockScene = () => ({
  add: {
    existing: jest.fn(),
    graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
    text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
      new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)),
    rectangle: jest.fn((x: number, y: number, w: number, h: number, color?: number, alpha?: number) =>
      new (jest.requireMock('phaser').default.GameObjects.Rectangle)(null, x, y, w, h)),
    container: jest.fn((x: number, y: number) =>
      new (jest.requireMock('phaser').default.GameObjects.Container)(null, x, y))
  },
  cameras: {
    main: {
      width: 800,
      height: 600
    }
  },
  input: {
    on: jest.fn(),
    off: jest.fn()
  }
});

describe('ScenarioListPanel', () => {
  let scene: any;
  let panel: ScenarioListPanel;
  let mockScenarios: Scenario[];

  beforeEach(() => {
    scene = createMockScene();

    mockScenarios = [
      {
        id: 'tutorial-001',
        name: 'First Steps',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5-10 min',
        description: 'Learn the basics',
        prerequisites: [],
        victoryConditions: [{ type: 'build_structure', target: 'Mine', count: 1 }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 5000 },
          aiPlanets: [],
          aiEnabled: false
        }
      },
      {
        id: 'tactical-001',
        name: 'Quick Battle',
        type: 'tactical',
        difficulty: 'medium',
        duration: '10-15 min',
        description: 'Test your skills',
        prerequisites: [],
        victoryConditions: [{ type: 'defeat_enemy' }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 10000 },
          aiPlanets: ['planet-2'],
          aiEnabled: true
        }
      }
    ];

    panel = new ScenarioListPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  test('should render scenario list', () => {
    panel.setScenarios(mockScenarios);
    panel.show();

    expect(panel.visible).toBe(true);
    // Panel should contain scenario cards
    expect(panel.list.length).toBeGreaterThan(0);
  });

  test('should emit selection event when scenario clicked', () => {
    const mockCallback = jest.fn();
    panel.setScenarios(mockScenarios);
    panel.onScenarioSelected = mockCallback;

    panel.show();
    // Simulate clicking the first scenario
    panel.selectScenario('tutorial-001');

    expect(mockCallback).toHaveBeenCalledWith(mockScenarios[0]);
  });

  test('should display scenario badges correctly', () => {
    panel.setScenarios(mockScenarios);
    panel.show();

    // Should have type badges (tutorial, tactical)
    const cards = panel.getScenarioCards();
    expect(cards.length).toBe(2);
    expect(cards[0].type).toBe('tutorial');
    expect(cards[1].type).toBe('tactical');
  });

  test('should support scrolling for many scenarios', () => {
    // Create many scenarios
    const manyScenarios: Scenario[] = Array.from({ length: 20 }, (_, i) => ({
      id: `scenario-${i}`,
      name: `Scenario ${i}`,
      type: (i % 2 === 0 ? 'tutorial' : 'tactical') as 'tutorial' | 'tactical',
      difficulty: 'easy' as const,
      duration: '5 min',
      description: `Test scenario ${i}`,
      prerequisites: [],
      victoryConditions: [{ type: 'survive_turns' as const, turns: 5 }],
      initialState: {
        playerPlanets: ['planet-1'],
        playerResources: { credits: 1000 },
        aiPlanets: [],
        aiEnabled: false
      }
    }));

    panel.setScenarios(manyScenarios);
    panel.show();

    // Panel should have scrolling enabled
    expect(panel.isScrollable()).toBe(true);
  });

  describe('completion badges (Story 1-5)', () => {
    test('should have setCompletionData method', () => {
      expect(typeof panel.setCompletionData).toBe('function');
    });

    test('should accept completion data', () => {
      const completions = new Map<string, { completed: boolean; starRating: number }>();
      completions.set('tutorial-001', { completed: true, starRating: 3 });

      expect(() => panel.setCompletionData(completions)).not.toThrow();
    });

    test('should re-render cards when completion data is set', () => {
      panel.setScenarios(mockScenarios);

      const completions = new Map<string, { completed: boolean; starRating: number }>();
      completions.set('tutorial-001', { completed: true, starRating: 3 });
      panel.setCompletionData(completions);

      // Cards should be re-rendered
      const cards = panel.getScenarioCards();
      expect(cards.length).toBe(2);
    });

    test('should mark completed scenario in card data', () => {
      panel.setScenarios(mockScenarios);

      const completions = new Map<string, { completed: boolean; starRating: number }>();
      completions.set('tutorial-001', { completed: true, starRating: 3 });
      panel.setCompletionData(completions);

      const cards = panel.getScenarioCards();
      // Check that completion data is available
      const tutorialCard = cards.find(c => c.scenario.id === 'tutorial-001');
      expect(tutorialCard).toBeDefined();
    });
  });

  describe('difficulty filtering (Story 8-1)', () => {
    let scenariosWithDifficulties: Scenario[];

    beforeEach(() => {
      scenariosWithDifficulties = [
        {
          id: 'easy-1',
          name: 'Easy Mission',
          type: 'tactical',
          difficulty: 'easy',
          duration: '5 min',
          description: 'Easy',
          prerequisites: [],
          victoryConditions: [{ type: 'defeat_enemy' }],
          initialState: { playerPlanets: ['planet-1'], playerResources: { credits: 1000 }, aiPlanets: [], aiEnabled: false }
        },
        {
          id: 'medium-1',
          name: 'Medium Mission',
          type: 'tactical',
          difficulty: 'medium',
          duration: '10 min',
          description: 'Medium',
          prerequisites: [],
          victoryConditions: [{ type: 'defeat_enemy' }],
          initialState: { playerPlanets: ['planet-1'], playerResources: { credits: 1000 }, aiPlanets: [], aiEnabled: false }
        },
        {
          id: 'hard-1',
          name: 'Hard Mission',
          type: 'tactical',
          difficulty: 'hard',
          duration: '15 min',
          description: 'Hard',
          prerequisites: [],
          victoryConditions: [{ type: 'defeat_enemy' }],
          initialState: { playerPlanets: ['planet-1'], playerResources: { credits: 1000 }, aiPlanets: [], aiEnabled: false }
        },
        {
          id: 'expert-1',
          name: 'Expert Mission',
          type: 'tactical',
          difficulty: 'expert',
          duration: '20 min',
          description: 'Expert',
          prerequisites: [],
          victoryConditions: [{ type: 'defeat_enemy' }],
          initialState: { playerPlanets: ['planet-1'], playerResources: { credits: 1000 }, aiPlanets: [], aiEnabled: false }
        }
      ];
    });

    test('should have setDifficultyFilter method', () => {
      expect(typeof panel.setDifficultyFilter).toBe('function');
    });

    test('should filter scenarios by difficulty', () => {
      panel.setScenarios(scenariosWithDifficulties);
      panel.setDifficultyFilter('hard');

      const cards = panel.getScenarioCards();
      expect(cards.length).toBe(1);
      expect(cards[0].scenario.difficulty).toBe('hard');
    });

    test('should show all scenarios with "all" filter', () => {
      panel.setScenarios(scenariosWithDifficulties);
      panel.setDifficultyFilter('all');

      const cards = panel.getScenarioCards();
      expect(cards.length).toBe(4);
    });

    test('should sort scenarios by difficulty (easy → expert)', () => {
      // Set scenarios in non-sorted order
      const unsortedScenarios = [
        scenariosWithDifficulties[3], // expert
        scenariosWithDifficulties[0], // easy
        scenariosWithDifficulties[2], // hard
        scenariosWithDifficulties[1]  // medium
      ];
      panel.setScenarios(unsortedScenarios);

      const cards = panel.getScenarioCards();
      expect(cards[0].scenario.difficulty).toBe('easy');
      expect(cards[1].scenario.difficulty).toBe('medium');
      expect(cards[2].scenario.difficulty).toBe('hard');
      expect(cards[3].scenario.difficulty).toBe('expert');
    });

    test('should have getDifficultyColor helper', () => {
      expect(typeof panel.getDifficultyColor).toBe('function');
    });

    test('should return different colors for each difficulty', () => {
      const easyColor = panel.getDifficultyColor('easy');
      const mediumColor = panel.getDifficultyColor('medium');
      const hardColor = panel.getDifficultyColor('hard');
      const expertColor = panel.getDifficultyColor('expert');

      // All colors should be different
      const colors = [easyColor, mediumColor, hardColor, expertColor];
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(4);
    });
  });

  describe('prerequisites check (Story 8-1)', () => {
    let scenariosWithPrereqs: Scenario[];

    beforeEach(() => {
      scenariosWithPrereqs = [
        {
          id: 'tutorial-001',
          name: 'Tutorial',
          type: 'tutorial',
          difficulty: 'easy',
          duration: '5 min',
          description: 'Tutorial',
          prerequisites: [],
          victoryConditions: [{ type: 'defeat_enemy' }],
          initialState: { playerPlanets: ['planet-1'], playerResources: { credits: 1000 }, aiPlanets: [], aiEnabled: false }
        },
        {
          id: 'tactical-001',
          name: 'Tactical Mission',
          type: 'tactical',
          difficulty: 'medium',
          duration: '10 min',
          description: 'Tactical',
          prerequisites: ['tutorial-001'],
          victoryConditions: [{ type: 'defeat_enemy' }],
          initialState: { playerPlanets: ['planet-1'], playerResources: { credits: 1000 }, aiPlanets: [], aiEnabled: false }
        }
      ];
    });

    test('should have isScenarioUnlocked method', () => {
      expect(typeof panel.isScenarioUnlocked).toBe('function');
    });

    test('should return true for scenario with no prerequisites', () => {
      panel.setScenarios(scenariosWithPrereqs);
      const completions = new Map<string, { completed: boolean; starRating: number }>();
      panel.setCompletionData(completions);

      expect(panel.isScenarioUnlocked('tutorial-001')).toBe(true);
    });

    test('should return false for scenario with unmet prerequisites', () => {
      panel.setScenarios(scenariosWithPrereqs);
      const completions = new Map<string, { completed: boolean; starRating: number }>();
      panel.setCompletionData(completions);

      expect(panel.isScenarioUnlocked('tactical-001')).toBe(false);
    });

    test('should return true for scenario with met prerequisites', () => {
      panel.setScenarios(scenariosWithPrereqs);
      const completions = new Map<string, { completed: boolean; starRating: number }>();
      completions.set('tutorial-001', { completed: true, starRating: 3 });
      panel.setCompletionData(completions);

      expect(panel.isScenarioUnlocked('tactical-001')).toBe(true);
    });

    test('should have getLockedScenarios method', () => {
      expect(typeof panel.getLockedScenarios).toBe('function');
    });

    test('should return list of locked scenarios', () => {
      panel.setScenarios(scenariosWithPrereqs);
      const completions = new Map<string, { completed: boolean; starRating: number }>();
      panel.setCompletionData(completions);

      const locked = panel.getLockedScenarios();
      expect(locked.length).toBe(1);
      expect(locked[0]).toBe('tactical-001');
    });
  });
});
