/**
 * Tests for VictoryConditionSystem
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Tests verify evaluation of scenario-specific victory conditions.
 */

import { VictoryConditionSystem, ConditionResult } from '@core/VictoryConditionSystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { VictoryCondition } from '@core/models/ScenarioModels';
import { FactionType, BuildingType, BuildingStatus } from '@core/models/Enums';
import { Structure } from '@core/models/BuildingModels';

describe('VictoryConditionSystem', () => {
  let system: VictoryConditionSystem;
  let gameState: GameState;

  beforeEach(() => {
    system = new VictoryConditionSystem();
    gameState = new GameState();

    // Set up basic game state
    const playerPlanet = new PlanetEntity();
    playerPlanet.id = 1;
    playerPlanet.name = 'Player Home';
    playerPlanet.owner = FactionType.Player;

    const aiPlanet = new PlanetEntity();
    aiPlanet.id = 2;
    aiPlanet.name = 'AI Home';
    aiPlanet.owner = FactionType.AI;

    gameState.planets = [playerPlanet, aiPlanet];
    gameState.playerFaction.ownedPlanetIDs = [1];
    gameState.aiFaction.ownedPlanetIDs = [2];
    gameState.currentTurn = 1;
    gameState.rebuildLookups();
  });

  describe('initialization', () => {
    test('should create VictoryConditionSystem', () => {
      expect(system).toBeDefined();
    });
  });

  describe('evaluate defeat_enemy condition', () => {
    test('should return incomplete when AI has planets', () => {
      const condition: VictoryCondition = { type: 'defeat_enemy' };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(false);
      expect(result.progress).toBeLessThan(1);
    });

    test('should return complete when AI has no planets', () => {
      // Remove AI planet
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.AI);
      gameState.aiFaction.ownedPlanetIDs = [];
      gameState.rebuildLookups();

      const condition: VictoryCondition = { type: 'defeat_enemy' };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(true);
      expect(result.progress).toBe(1);
    });
  });

  describe('evaluate build_structure condition', () => {
    test('should return incomplete when structure not built', () => {
      const condition: VictoryCondition = {
        type: 'build_structure',
        target: 'MiningStation'
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(false);
      expect(result.progress).toBe(0);
    });

    test('should return complete when structure is active', () => {
      // Add the required structure to player planet
      const playerPlanet = gameState.planetLookup.get(1)!;
      const structure: Structure = {
        type: BuildingType.MiningStation,
        status: BuildingStatus.Active,
        turnsRemaining: 0
      };
      playerPlanet.structures.push(structure);

      const condition: VictoryCondition = {
        type: 'build_structure',
        target: 'MiningStation'
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(true);
      expect(result.progress).toBe(1);
    });

    test('should return incomplete when structure is under construction', () => {
      const playerPlanet = gameState.planetLookup.get(1)!;
      const structure: Structure = {
        type: BuildingType.MiningStation,
        status: BuildingStatus.UnderConstruction,
        turnsRemaining: 3
      };
      playerPlanet.structures.push(structure);

      const condition: VictoryCondition = {
        type: 'build_structure',
        target: 'MiningStation'
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(false);
      expect(result.progress).toBeGreaterThan(0);
      expect(result.progress).toBeLessThan(1);
    });

    test('should handle count requirement', () => {
      const playerPlanet = gameState.planetLookup.get(1)!;
      const structure1: Structure = {
        type: BuildingType.MiningStation,
        status: BuildingStatus.Active,
        turnsRemaining: 0
      };
      playerPlanet.structures.push(structure1);

      const condition: VictoryCondition = {
        type: 'build_structure',
        target: 'MiningStation',
        count: 2
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(false);
      expect(result.progress).toBe(0.5); // 1 of 2 built
    });
  });

  describe('evaluate capture_planet condition', () => {
    test('should return incomplete when target planet not captured', () => {
      const condition: VictoryCondition = {
        type: 'capture_planet',
        target: 'AI Home'
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(false);
      expect(result.progress).toBe(0);
    });

    test('should return complete when target planet captured', () => {
      // Capture AI planet
      const aiPlanet = gameState.planetLookup.get(2)!;
      aiPlanet.owner = FactionType.Player;
      gameState.playerFaction.ownedPlanetIDs.push(2);
      gameState.aiFaction.ownedPlanetIDs = [];

      const condition: VictoryCondition = {
        type: 'capture_planet',
        target: 'AI Home'
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(true);
      expect(result.progress).toBe(1);
    });

    test('should handle count requirement without target', () => {
      const condition: VictoryCondition = {
        type: 'capture_planet',
        count: 2
      };
      const result = system.evaluateCondition(condition, gameState);

      expect(result.met).toBe(false);
      expect(result.progress).toBe(0.5); // 1 of 2 planets owned
    });
  });

  describe('evaluate survive_turns condition', () => {
    test('should return incomplete when not enough turns passed', () => {
      gameState.currentTurn = 5;
      const startTurn = 1;

      const condition: VictoryCondition = {
        type: 'survive_turns',
        turns: 10
      };
      const result = system.evaluateCondition(condition, gameState, startTurn);

      expect(result.met).toBe(false);
      expect(result.progress).toBe(0.4); // 4 turns survived out of 10
    });

    test('should return complete when enough turns passed', () => {
      gameState.currentTurn = 11;
      const startTurn = 1;

      const condition: VictoryCondition = {
        type: 'survive_turns',
        turns: 10
      };
      const result = system.evaluateCondition(condition, gameState, startTurn);

      expect(result.met).toBe(true);
      expect(result.progress).toBe(1);
    });
  });

  describe('evaluateAll', () => {
    test('should return all false when no conditions met', () => {
      const conditions: VictoryCondition[] = [
        { type: 'defeat_enemy' },
        { type: 'build_structure', target: 'MiningStation' }
      ];

      const results = system.evaluateAll(conditions, gameState);

      expect(results.allMet).toBe(false);
      expect(results.conditions.length).toBe(2);
    });

    test('should return all true when all conditions met', () => {
      // Set up for victory
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.AI);
      gameState.aiFaction.ownedPlanetIDs = [];

      const playerPlanet = gameState.planetLookup.get(1)!;
      playerPlanet.structures.push({
        type: BuildingType.MiningStation,
        status: BuildingStatus.Active,
        turnsRemaining: 0
      });
      gameState.rebuildLookups();

      const conditions: VictoryCondition[] = [
        { type: 'defeat_enemy' },
        { type: 'build_structure', target: 'MiningStation' }
      ];

      const results = system.evaluateAll(conditions, gameState);

      expect(results.allMet).toBe(true);
      expect(results.conditions.every(c => c.met)).toBe(true);
    });
  });
});
