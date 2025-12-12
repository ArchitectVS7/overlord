/**
 * Tests for ScenarioInitializer
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Tests verify that scenarios are properly initialized from JSON config.
 */

import { ScenarioInitializer, InitializationResult, ScenarioGameState } from '@core/ScenarioInitializer';
import { Scenario, VictoryCondition } from '@core/models/ScenarioModels';
import { AIPersonality, AIDifficulty, FactionType } from '@core/models/Enums';

describe('ScenarioInitializer', () => {
  let initializer: ScenarioInitializer;

  beforeEach(() => {
    initializer = new ScenarioInitializer();
  });

  // Helper to create a basic valid scenario
  function createValidScenario(): Scenario {
    return {
      id: 'test-scenario',
      name: 'Test Scenario',
      type: 'tactical',
      difficulty: 'easy',
      duration: '10-15 min',
      description: 'A test scenario',
      prerequisites: [],
      victoryConditions: [
        { type: 'defeat_enemy' }
      ],
      initialState: {
        playerPlanets: ['planet-1', 'planet-2'],
        playerResources: {
          credits: 5000,
          minerals: 1000,
          fuel: 500,
          food: 300,
          energy: 200
        },
        aiPlanets: ['planet-3'],
        aiEnabled: true,
        aiPersonality: AIPersonality.Balanced,
        aiDifficulty: AIDifficulty.Normal
      }
    };
  }

  describe('initialization', () => {
    test('should create ScenarioInitializer', () => {
      expect(initializer).toBeDefined();
    });
  });

  describe('initialize', () => {
    test('should return success with initialized GameState', () => {
      const scenario = createValidScenario();
      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      expect(result.gameState).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    test('should initialize player planets', () => {
      const scenario = createValidScenario();
      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      expect(result.gameState!.planets.length).toBe(3); // 2 player + 1 AI

      const playerPlanets = result.gameState!.planets.filter(
        p => p.owner === FactionType.Player
      );
      expect(playerPlanets.length).toBe(2);
    });

    test('should initialize player resources', () => {
      const scenario = createValidScenario();
      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      const faction = result.gameState!.playerFaction;
      expect(faction.resources.credits).toBe(5000);
      expect(faction.resources.minerals).toBe(1000);
      expect(faction.resources.fuel).toBe(500);
      expect(faction.resources.food).toBe(300);
      expect(faction.resources.energy).toBe(200);
    });

    test('should initialize AI planets when enabled', () => {
      const scenario = createValidScenario();
      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      const aiPlanets = result.gameState!.planets.filter(
        p => p.owner === FactionType.AI
      );
      expect(aiPlanets.length).toBe(1);
    });

    test('should skip AI when disabled', () => {
      const scenario = createValidScenario();
      scenario.initialState.aiEnabled = false;
      scenario.initialState.aiPlanets = [];

      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      const aiPlanets = result.gameState!.planets.filter(
        p => p.owner === FactionType.AI
      );
      expect(aiPlanets.length).toBe(0);
    });

    test('should set victory conditions on GameState', () => {
      const scenario = createValidScenario();
      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      expect(result.gameState!.scenarioVictoryConditions).toBeDefined();
      expect(result.gameState!.scenarioVictoryConditions!.length).toBe(1);
      expect(result.gameState!.scenarioVictoryConditions![0].type).toBe('defeat_enemy');
    });

    test('should handle missing optional fields with defaults', () => {
      const scenario = createValidScenario();
      // Remove optional resource fields
      scenario.initialState.playerResources = {
        credits: 1000
        // minerals, fuel, food, energy will use defaults
      };

      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      expect(result.gameState!.playerFaction.resources.credits).toBe(1000);
      expect(result.gameState!.playerFaction.resources.minerals).toBe(0);
    });
  });

  describe('error handling', () => {
    test('should return error for null scenario', () => {
      const result = initializer.initialize(null as unknown as Scenario);

      expect(result.success).toBe(false);
      expect(result.gameState).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error).toContain('null');
    });

    test('should return error for scenario without initialState', () => {
      const scenario = createValidScenario();
      delete (scenario as any).initialState;

      const result = initializer.initialize(scenario);

      expect(result.success).toBe(false);
      expect(result.error).toContain('initialState');
    });

    test('should return error for empty playerPlanets', () => {
      const scenario = createValidScenario();
      scenario.initialState.playerPlanets = [];

      const result = initializer.initialize(scenario);

      expect(result.success).toBe(false);
      expect(result.error).toContain('playerPlanets');
    });
  });

  describe('rebuildLookups', () => {
    test('should rebuild lookup maps after initialization', () => {
      const scenario = createValidScenario();
      const result = initializer.initialize(scenario);

      expect(result.success).toBe(true);
      // Verify lookups are populated
      expect(result.gameState!.planetLookup.size).toBe(3);
    });
  });
});
