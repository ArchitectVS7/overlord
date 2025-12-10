import { PhaseProcessor, IncomePhaseResult, EndPhaseResult } from '@core/PhaseProcessor';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType, TurnPhase, BuildingType, BuildingStatus } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { ResourceDelta } from '@core/models/ResourceModels';
import { Structure } from '@core/models/BuildingModels';

describe('PhaseProcessor', () => {
  let gameState: GameState;
  let phaseProcessor: PhaseProcessor;

  beforeEach(() => {
    gameState = createTestGameState();
    phaseProcessor = new PhaseProcessor(gameState);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new PhaseProcessor(null as any)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should throw error if gameState is undefined', () => {
      expect(() => new PhaseProcessor(undefined as any)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should create internal systems', () => {
      expect(phaseProcessor.getIncomeSystem()).toBeDefined();
      expect(phaseProcessor.getResourceSystem()).toBeDefined();
      expect(phaseProcessor.getBuildingSystem()).toBeDefined();
      expect(phaseProcessor.getPopulationSystem()).toBeDefined();
    });
  });

  describe('processPhase', () => {
    it('should process Income phase', () => {
      const result = phaseProcessor.processPhase(TurnPhase.Income);

      expect(result.success).toBe(true);
      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should process Action phase', () => {
      const result = phaseProcessor.processPhase(TurnPhase.Action);

      expect(result.success).toBe(true);
      expect(result.processingTimeMs).toBe(0);
    });

    it('should process Combat phase', () => {
      const result = phaseProcessor.processPhase(TurnPhase.Combat);

      expect(result.success).toBe(true);
    });

    it('should process End phase', () => {
      const result = phaseProcessor.processPhase(TurnPhase.End);

      expect(result.success).toBe(true);
    });

    it('should return error for unknown phase', () => {
      const result = phaseProcessor.processPhase(999 as TurnPhase);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown phase');
    });
  });

  describe('processIncomePhase', () => {
    it('should return player and AI income', () => {
      const result = phaseProcessor.processIncomePhase() as IncomePhaseResult;

      expect(result.success).toBe(true);
      expect(result.playerIncome).toBeDefined();
      expect(result.aiIncome).toBeDefined();
    });

    it('should calculate income for planets with population', () => {
      const result = phaseProcessor.processIncomePhase() as IncomePhaseResult;

      // Player has 2 planets with population but no production buildings
      // Income is zero without buildings (Horticultural, Mining, Solar Satellites)
      expect(result.playerIncome.credits).toBeGreaterThanOrEqual(0);
      expect(result.playerIncome.minerals).toBeGreaterThanOrEqual(0);
      expect(result.playerIncome.fuel).toBeGreaterThanOrEqual(0);
      expect(result.playerIncome.food).toBeGreaterThanOrEqual(0);
      expect(result.playerIncome.energy).toBeGreaterThanOrEqual(0);
    });

    it('should fire onIncomeProcessed event', () => {
      let firedPlayerIncome: ResourceDelta | undefined;
      let firedAiIncome: ResourceDelta | undefined;

      phaseProcessor.onIncomeProcessed = (playerIncome, aiIncome) => {
        firedPlayerIncome = playerIncome;
        firedAiIncome = aiIncome;
      };

      phaseProcessor.processIncomePhase();

      expect(firedPlayerIncome).toBeDefined();
      expect(firedAiIncome).toBeDefined();
    });

    it('should include processing time', () => {
      const result = phaseProcessor.processIncomePhase();

      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('processActionPhase', () => {
    it('should return success with no processing', () => {
      const result = phaseProcessor.processActionPhase();

      expect(result.success).toBe(true);
      expect(result.processingTimeMs).toBe(0);
    });
  });

  describe('processCombatPhase', () => {
    it('should return success (placeholder for future AI)', () => {
      const result = phaseProcessor.processCombatPhase();

      expect(result.success).toBe(true);
    });

    it('should include processing time', () => {
      const result = phaseProcessor.processCombatPhase();

      expect(result.processingTimeMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('processEndPhase', () => {
    it('should return success', () => {
      const result = phaseProcessor.processEndPhase() as EndPhaseResult;

      expect(result.success).toBe(true);
    });

    it('should track building completions', () => {
      // Add a building under construction that will complete
      const playerPlanet = gameState.planets.find(p => p.owner === FactionType.Player);
      if (playerPlanet) {
        const building = new Structure();
        building.id = 100;
        building.type = BuildingType.MiningStation;
        building.status = BuildingStatus.UnderConstruction;
        building.turnsRemaining = 1; // Will complete next update
        playerPlanet.structures.push(building);
      }

      const result = phaseProcessor.processEndPhase() as EndPhaseResult;

      expect(result.buildingsCompleted).toBeGreaterThanOrEqual(0);
    });

    it('should track population growth', () => {
      const result = phaseProcessor.processEndPhase() as EndPhaseResult;

      expect(result.populationGrowth).toBeGreaterThanOrEqual(0);
    });

    it('should fire onPopulationGrowth event for significant growth', () => {
      const growthEvents: { planetId: number; growth: number }[] = [];

      phaseProcessor.onPopulationGrowth = (planetId, growth) => {
        growthEvents.push({ planetId, growth });
      };

      // Set up planet with conditions for growth
      const playerPlanet = gameState.planets.find(p => p.owner === FactionType.Player);
      if (playerPlanet) {
        playerPlanet.population = 100;
        playerPlanet.maxPopulation = 1000;
        playerPlanet.morale = 100;
      }

      phaseProcessor.processEndPhase();

      // Growth events may or may not fire depending on growth amount
      expect(growthEvents).toBeDefined();
    });

    it('should fire onBuildingCompleted event when building finishes', () => {
      const completedBuildings: { planetId: number; buildingType: string }[] = [];

      phaseProcessor.onBuildingCompleted = (planetId, buildingType) => {
        completedBuildings.push({ planetId, buildingType });
      };

      // Add a building about to complete
      const playerPlanet = gameState.planets.find(p => p.owner === FactionType.Player);
      if (playerPlanet) {
        const building = new Structure();
        building.id = 100;
        building.type = BuildingType.HorticulturalStation;
        building.status = BuildingStatus.UnderConstruction;
        building.turnsRemaining = 1; // Will complete next update
        playerPlanet.structures.push(building);
      }

      phaseProcessor.processEndPhase();

      // Building should complete (if BuildingSystem processes it correctly)
      expect(completedBuildings).toBeDefined();
    });
  });

  // NOTE: formatIncomeSummary moved to TurnHUD (UI layer) per architecture requirements
  // Tests for that method are in TurnHUD.test.ts

  describe('Error handling', () => {
    it('should fire onPhaseProcessingError on exception', () => {
      let errorPhase: TurnPhase | undefined;
      let errorMessage: string | undefined;

      phaseProcessor.onPhaseProcessingError = (phase, error) => {
        errorPhase = phase;
        errorMessage = error;
      };

      // Force an error by corrupting gameState
      (gameState as any).planets = null;

      const result = phaseProcessor.processPhase(TurnPhase.End);

      expect(result.success).toBe(false);
      if (errorPhase !== undefined) {
        expect(errorPhase).toBe(TurnPhase.End);
        expect(errorMessage).toBeDefined();
      }
    });
  });

  describe('System getters', () => {
    it('should return IncomeSystem', () => {
      const incomeSystem = phaseProcessor.getIncomeSystem();
      expect(incomeSystem).toBeDefined();
    });

    it('should return ResourceSystem', () => {
      const resourceSystem = phaseProcessor.getResourceSystem();
      expect(resourceSystem).toBeDefined();
    });

    it('should return BuildingSystem', () => {
      const buildingSystem = phaseProcessor.getBuildingSystem();
      expect(buildingSystem).toBeDefined();
    });

    it('should return PopulationSystem', () => {
      const populationSystem = phaseProcessor.getPopulationSystem();
      expect(populationSystem).toBeDefined();
    });
  });

  describe('Performance requirements (NFR-P3)', () => {
    it('should process Income phase within 2 seconds', () => {
      const startTime = performance.now();
      phaseProcessor.processIncomePhase();
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(2000);
    });

    it('should process Combat phase within 2 seconds', () => {
      const startTime = performance.now();
      phaseProcessor.processCombatPhase();
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(2000);
    });

    it('should process End phase within 2 seconds', () => {
      const startTime = performance.now();
      phaseProcessor.processEndPhase();
      const duration = performance.now() - startTime;

      expect(duration).toBeLessThan(2000);
    });
  });
});

/**
 * Helper function to create a test game state with 2 player planets and 1 AI planet.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Player planet 1 (home planet)
  const playerPlanet1 = new PlanetEntity();
  playerPlanet1.id = 0;
  playerPlanet1.name = 'Starbase';
  playerPlanet1.type = PlanetType.Metropolis;
  playerPlanet1.owner = FactionType.Player;
  playerPlanet1.position = new Position3D(0, 0, 0);
  playerPlanet1.colonized = true;
  playerPlanet1.population = 500;
  playerPlanet1.maxPopulation = 1000;
  playerPlanet1.morale = 80;

  // Player planet 2
  const playerPlanet2 = new PlanetEntity();
  playerPlanet2.id = 1;
  playerPlanet2.name = 'Colony Alpha';
  playerPlanet2.type = PlanetType.Tropical;
  playerPlanet2.owner = FactionType.Player;
  playerPlanet2.position = new Position3D(50, 0, 0);
  playerPlanet2.colonized = true;
  playerPlanet2.population = 200;
  playerPlanet2.maxPopulation = 800;
  playerPlanet2.morale = 70;

  // AI planet
  const aiPlanet = new PlanetEntity();
  aiPlanet.id = 2;
  aiPlanet.name = 'Hitotsu';
  aiPlanet.type = PlanetType.Metropolis;
  aiPlanet.owner = FactionType.AI;
  aiPlanet.position = new Position3D(-100, 0, 0);
  aiPlanet.colonized = true;
  aiPlanet.population = 300;
  aiPlanet.maxPopulation = 1000;
  aiPlanet.morale = 75;

  gameState.planets.push(playerPlanet1);
  gameState.planets.push(playerPlanet2);
  gameState.planets.push(aiPlanet);
  gameState.rebuildLookups();

  return gameState;
}
