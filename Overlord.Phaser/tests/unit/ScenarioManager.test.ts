import { ScenarioManager } from '../../src/core/ScenarioManager';
import { Scenario } from '../../src/core/models/ScenarioModels';

describe('ScenarioManager', () => {
  let manager: ScenarioManager;

  beforeEach(() => {
    manager = new ScenarioManager();
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('loadScenarios', () => {
    test('should load valid scenario JSON', async () => {
      const validScenario: Scenario = {
        id: 'test-001',
        name: 'Test Scenario',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5 min',
        description: 'A test scenario',
        prerequisites: [],
        victoryConditions: [{ type: 'build_structure', target: 'Mine', count: 1 }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 1000 },
          aiPlanets: [],
          aiEnabled: false
        }
      };

      await manager.loadScenario(validScenario);

      const scenarios = manager.getScenarios();
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0].id).toBe('test-001');
    });

    test('should validate required fields and reject invalid scenarios', () => {
      const invalidScenario = {
        id: 'invalid',
        name: 'Missing Type'
        // Missing required fields: type, difficulty, etc.
      } as any;

      expect(() => manager.validateScenario(invalidScenario)).toThrow();
    });
  });

  describe('getScenarios', () => {
    test('should return sorted scenario list with tutorials first', async () => {
      const tutorial: Scenario = {
        id: 'tutorial-001',
        name: 'Tutorial',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5 min',
        description: 'Learn the basics',
        prerequisites: [],
        victoryConditions: [{ type: 'build_structure', target: 'Mine', count: 1 }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 1000 },
          aiPlanets: [],
          aiEnabled: false
        }
      };

      const tactical: Scenario = {
        id: 'tactical-001',
        name: 'Tactical',
        type: 'tactical',
        difficulty: 'medium',
        duration: '10 min',
        description: 'Test your skills',
        prerequisites: [],
        victoryConditions: [{ type: 'defeat_enemy' }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 5000 },
          aiPlanets: ['planet-2'],
          aiEnabled: true
        }
      };

      // Load in reverse order to test sorting
      await manager.loadScenario(tactical);
      await manager.loadScenario(tutorial);

      const scenarios = manager.getScenarios();
      expect(scenarios).toHaveLength(2);
      expect(scenarios[0].type).toBe('tutorial'); // Tutorials should be first
      expect(scenarios[1].type).toBe('tactical');
    });
  });

  describe('getScenarioById', () => {
    test('should return scenario by ID', async () => {
      const scenario: Scenario = {
        id: 'find-me',
        name: 'Find Me',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5 min',
        description: 'Test finding',
        prerequisites: [],
        victoryConditions: [{ type: 'survive_turns', turns: 5 }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 1000 },
          aiPlanets: [],
          aiEnabled: false
        }
      };

      await manager.loadScenario(scenario);

      const found = manager.getScenarioById('find-me');
      expect(found).toBeDefined();
      expect(found?.name).toBe('Find Me');
    });

    test('should return undefined for non-existent scenario', () => {
      const found = manager.getScenarioById('does-not-exist');
      expect(found).toBeUndefined();
    });
  });

  describe('checkPrerequisites', () => {
    test('should check prerequisites correctly', async () => {
      const prereqScenario: Scenario = {
        id: 'tutorial-001',
        name: 'Basic Tutorial',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5 min',
        description: 'Learn basics',
        prerequisites: [],
        victoryConditions: [{ type: 'build_structure', target: 'Mine', count: 1 }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 1000 },
          aiPlanets: [],
          aiEnabled: false
        }
      };

      const advancedScenario: Scenario = {
        id: 'tutorial-002',
        name: 'Advanced Tutorial',
        type: 'tutorial',
        difficulty: 'medium',
        duration: '10 min',
        description: 'Advanced concepts',
        prerequisites: ['tutorial-001'],
        victoryConditions: [{ type: 'build_structure', target: 'Factory', count: 1 }],
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 2000 },
          aiPlanets: [],
          aiEnabled: false
        }
      };

      await manager.loadScenario(prereqScenario);
      await manager.loadScenario(advancedScenario);

      // Prerequisites not met initially
      expect(manager.checkPrerequisites('tutorial-002')).toBe(false);

      // Complete the prerequisite
      manager.markScenarioComplete('tutorial-001');

      // Prerequisites should now be met
      expect(manager.checkPrerequisites('tutorial-002')).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should handle invalid JSON gracefully', () => {
      const malformedScenario = null as any;

      expect(() => manager.validateScenario(malformedScenario)).toThrow();
    });

    test('should handle missing victory conditions', () => {
      const scenarioWithoutVictory = {
        id: 'no-victory',
        name: 'No Victory',
        type: 'tutorial',
        difficulty: 'easy',
        duration: '5 min',
        description: 'Missing victory',
        prerequisites: [],
        victoryConditions: [], // Empty victory conditions
        initialState: {
          playerPlanets: ['planet-1'],
          playerResources: { credits: 1000 },
          aiPlanets: [],
          aiEnabled: false
        }
      } as Scenario;

      expect(() => manager.validateScenario(scenarioWithoutVictory)).toThrow();
    });
  });
});
