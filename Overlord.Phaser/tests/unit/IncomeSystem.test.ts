/**
 * Unit tests for IncomeSystem
 * Story 4-4: Automated Income Processing
 */

import { IncomeSystem } from '@core/IncomeSystem';
import { ResourceSystem } from '@core/ResourceSystem';
import { GameState } from '@core/GameState';
import { ResourceDelta, ResourceCollection } from '@core/models/ResourceModels';
import { FactionType, PlanetType, BuildingType, BuildingStatus, CraftType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { Structure } from '@core/models/BuildingModels';
import { Craft } from '@core/models/CraftModels';

describe('IncomeSystem', () => {
  let gameState: GameState;
  let resourceSystem: ResourceSystem;
  let incomeSystem: IncomeSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    resourceSystem = new ResourceSystem(gameState);
    incomeSystem = new IncomeSystem(gameState, resourceSystem);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new IncomeSystem(null as any, resourceSystem)).toThrow('gameState cannot be null or undefined');
    });

    it('should throw error if resourceSystem is null', () => {
      expect(() => new IncomeSystem(gameState, null as any)).toThrow('resourceSystem cannot be null or undefined');
    });

    it('should have correct morale penalty threshold', () => {
      expect(IncomeSystem.MoralePenaltyThreshold).toBe(50);
    });
  });

  describe('calculatePlanetIncome', () => {
    it('should return zero income for uninhabited planets', () => {
      const planet = gameState.planets.find(p => p.id === 2)!;
      planet.isHabitable = false;

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      expect(income.food).toBe(0);
      expect(income.minerals).toBe(0);
      expect(income.fuel).toBe(0);
      expect(income.energy).toBe(0);
    });

    it('should return zero income for non-existent planet', () => {
      const income = incomeSystem.calculatePlanetIncome(999);

      expect(income.food).toBe(0);
      expect(income.minerals).toBe(0);
      expect(income.fuel).toBe(0);
      expect(income.energy).toBe(0);
    });

    it('should calculate income from Horticultural Stations', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100; // Enough crew

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      // 100 base * 1.0 multiplier = 100 food
      expect(income.food).toBeGreaterThan(0);
    });

    it('should calculate income from Mining Stations', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [createActiveStation(BuildingType.MiningStation)];
      planet.population = 100;

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      // Mining stations produce minerals and fuel
      expect(income.minerals).toBeGreaterThan(0);
      expect(income.fuel).toBeGreaterThan(0);
    });
  });

  describe('Morale Penalty (Story 4-4: AC3)', () => {
    it('should NOT apply morale penalty when morale >= 50', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.morale = 50; // Exactly at threshold
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      // No penalty at threshold
      expect(income.food).toBe(Math.floor(IncomeSystem.BaseFoodProduction * planet.resourceMultipliers.food));
    });

    it('should apply morale penalty when morale < 50', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.morale = 40; // Below threshold
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;

      const baseIncome = Math.floor(IncomeSystem.BaseFoodProduction * planet.resourceMultipliers.food);
      const expectedIncome = Math.floor(baseIncome * 0.4); // 40% morale = 40% income

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      expect(income.food).toBe(expectedIncome);
    });

    it('should apply 50% penalty at 50% morale (edge case below threshold)', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.morale = 49; // Just below threshold
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;

      const baseIncome = Math.floor(IncomeSystem.BaseFoodProduction * planet.resourceMultipliers.food);
      const expectedIncome = Math.floor(baseIncome * 0.49); // 49% morale

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      expect(income.food).toBe(expectedIncome);
    });

    it('should apply 75% penalty at 25% morale', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.morale = 25;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;

      const baseIncome = Math.floor(IncomeSystem.BaseFoodProduction * planet.resourceMultipliers.food);
      const expectedIncome = Math.floor(baseIncome * 0.25);

      const income = incomeSystem.calculatePlanetIncome(planet.id);

      expect(income.food).toBe(expectedIncome);
    });

    it('should fire onLowMoraleIncomePenalty callback when morale is low', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.morale = 30;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;

      let callbackPlanetID = -1;
      let callbackPlanetName = '';
      let callbackPenalty = 0;

      incomeSystem.onLowMoraleIncomePenalty = (planetID, planetName, penaltyPercent) => {
        callbackPlanetID = planetID;
        callbackPlanetName = planetName;
        callbackPenalty = penaltyPercent;
      };

      incomeSystem.calculatePlanetIncome(planet.id);

      expect(callbackPlanetID).toBe(planet.id);
      expect(callbackPlanetName).toBe(planet.name);
      expect(callbackPenalty).toBe(70); // 100 - 30 = 70% penalty
    });

    it('should NOT fire onLowMoraleIncomePenalty when morale is high', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.morale = 75;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;

      let callbackFired = false;
      incomeSystem.onLowMoraleIncomePenalty = () => {
        callbackFired = true;
      };

      incomeSystem.calculatePlanetIncome(planet.id);

      expect(callbackFired).toBe(false);
    });
  });

  describe('No Planets Owned (Story 4-4: AC4)', () => {
    it('should fire onNoPlanetsOwned when faction has no planets', () => {
      // Remove all player planets
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.Player);
      gameState.rebuildLookups();

      let callbackFaction: FactionType | null = null;
      incomeSystem.onNoPlanetsOwned = (faction) => {
        callbackFaction = faction;
      };

      const income = incomeSystem.calculateFactionIncome(FactionType.Player);

      expect(callbackFaction).toBe(FactionType.Player);
      expect(income.food).toBe(0);
      expect(income.minerals).toBe(0);
      expect(income.fuel).toBe(0);
      expect(income.energy).toBe(0);
    });

    it('should NOT fire onNoPlanetsOwned when faction has planets', () => {
      let callbackFired = false;
      incomeSystem.onNoPlanetsOwned = () => {
        callbackFired = true;
      };

      incomeSystem.calculateFactionIncome(FactionType.Player);

      expect(callbackFired).toBe(false);
    });
  });

  describe('getIncomeBreakdown (Story 4-4: AC2)', () => {
    it('should return breakdown with building income', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;
      planet.morale = 75; // No penalty

      const breakdown = incomeSystem.getIncomeBreakdown(planet.id);

      expect(breakdown.buildings.food).toBeGreaterThan(0);
      expect(breakdown.total.food).toBe(breakdown.buildings.food);
      expect(breakdown.moralePenalty).toBe(0);
    });

    it('should return breakdown with morale penalty applied', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;
      planet.morale = 40; // 60% penalty

      const breakdown = incomeSystem.getIncomeBreakdown(planet.id);

      expect(breakdown.buildings.food).toBeGreaterThan(0);
      expect(breakdown.total.food).toBeLessThan(breakdown.buildings.food);
      expect(breakdown.moralePenalty).toBe(60);
    });

    it('should return empty breakdown for non-existent planet', () => {
      const breakdown = incomeSystem.getIncomeBreakdown(999);

      expect(breakdown.buildings.food).toBe(0);
      expect(breakdown.total.food).toBe(0);
      expect(breakdown.moralePenalty).toBe(0);
    });

    it('should return empty breakdown for uninhabited planet', () => {
      const planet = gameState.planets.find(p => p.id === 2)!;
      planet.isHabitable = false;

      const breakdown = incomeSystem.getIncomeBreakdown(planet.id);

      expect(breakdown.buildings.food).toBe(0);
      expect(breakdown.total.food).toBe(0);
      expect(breakdown.moralePenalty).toBe(0);
    });
  });

  describe('generateIncomeReport', () => {
    it('should include morale penalty in report when morale is low', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;
      planet.morale = 30;

      const report = incomeSystem.generateIncomeReport(planet.id);

      expect(report).toContain('Low morale');
      expect(report).toContain('30%');
      expect(report).toContain('70%'); // Penalty percentage
    });

    it('should NOT include morale penalty when morale is high', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet.population = 100;
      planet.morale = 75;

      const report = incomeSystem.generateIncomeReport(planet.id);

      expect(report).not.toContain('Low morale');
    });
  });

  describe('calculateFactionIncome', () => {
    it('should sum income from all faction planets', () => {
      // Set up two planets with buildings
      const planet0 = gameState.planets.find(p => p.id === 0)!;
      planet0.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet0.population = 100;
      planet0.morale = 100;

      const planet1 = gameState.planets.find(p => p.id === 1)!;
      planet1.structures = [createActiveStation(BuildingType.MiningStation)];
      planet1.population = 100;
      planet1.morale = 100;

      const totalIncome = incomeSystem.calculateFactionIncome(FactionType.Player);

      // Should have combined income from both planets
      expect(totalIncome.food).toBeGreaterThan(0);
      expect(totalIncome.minerals).toBeGreaterThan(0);
    });

    it('should fire onIncomeCalculated for each planet', () => {
      const planet0 = gameState.planets.find(p => p.id === 0)!;
      planet0.structures = [createActiveStation(BuildingType.HorticulturalStation)];
      planet0.population = 100;

      const calculatedPlanets: number[] = [];
      incomeSystem.onIncomeCalculated = (planetID) => {
        calculatedPlanets.push(planetID);
      };

      incomeSystem.calculateFactionIncome(FactionType.Player);

      // Should have fired for player planets
      expect(calculatedPlanets.length).toBeGreaterThan(0);
    });
  });

  describe('Crew Allocation', () => {
    it('should mark buildings as inactive when insufficient crew', () => {
      const planet = gameState.planets.find(p => p.id === 0)!;
      planet.structures = [
        createActiveStation(BuildingType.HorticulturalStation), // Needs 10 crew
        createActiveStation(BuildingType.HorticulturalStation), // Needs 10 crew
      ];
      planet.population = 15; // Only enough for 1 building

      let insufficientCrewPlanetID = -1;
      let inactiveCount = 0;
      incomeSystem.onInsufficientCrew = (planetID, count) => {
        insufficientCrewPlanetID = planetID;
        inactiveCount = count;
      };

      incomeSystem.calculatePlanetIncome(planet.id);

      expect(insufficientCrewPlanetID).toBe(planet.id);
      expect(inactiveCount).toBe(1); // One building couldn't be staffed
    });
  });

  describe('Base Production Rates', () => {
    it('should have correct base food production', () => {
      expect(IncomeSystem.BaseFoodProduction).toBe(100);
    });

    it('should have correct base mineral production', () => {
      expect(IncomeSystem.BaseMineralProduction).toBe(50);
    });

    it('should have correct base fuel production', () => {
      expect(IncomeSystem.BaseFuelProduction).toBe(30);
    });

    it('should have correct base energy production', () => {
      expect(IncomeSystem.BaseEnergyProduction).toBe(80);
    });
  });

  describe('Crew Requirements', () => {
    it('should have correct crew requirements', () => {
      expect(IncomeSystem.HorticulturalCrewRequired).toBe(10);
      expect(IncomeSystem.MiningCrewRequired).toBe(15);
      expect(IncomeSystem.SolarSatelliteCrewRequired).toBe(5);
    });
  });
});

// Helper function to create test game state
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Starbase (Player)
  const starbase: PlanetEntity = {
    id: 0,
    name: 'Starbase',
    type: PlanetType.Metropolis,
    owner: FactionType.Player,
    position: new Position3D(0, 0, 0),
    visualSeed: 123,
    rotationSpeed: 1.0,
    scaleMultiplier: 1.0,
    colonized: true,
    resources: new ResourceCollection(),
    population: 500,
    morale: 75,
    taxRate: 50,
    isHabitable: true,
    structures: [],
    resourceMultipliers: { food: 1.0, minerals: 1.0, fuel: 1.0, energy: 1.0 }
  };
  starbase.resources.food = 10000;
  starbase.resources.minerals = 10000;
  starbase.resources.fuel = 10000;
  starbase.resources.energy = 10000;
  starbase.resources.credits = 50000;

  // Vulcan (Player)
  const vulcan: PlanetEntity = {
    id: 1,
    name: 'Vulcan',
    type: PlanetType.Volcanic,
    owner: FactionType.Player,
    position: new Position3D(100, 0, 0),
    visualSeed: 456,
    rotationSpeed: 1.0,
    scaleMultiplier: 1.0,
    colonized: true,
    resources: new ResourceCollection(),
    population: 300,
    morale: 60,
    taxRate: 50,
    isHabitable: true,
    structures: [],
    resourceMultipliers: { food: 0.5, minerals: 2.0, fuel: 1.5, energy: 1.0 }
  };
  vulcan.resources.food = 5000;
  vulcan.resources.minerals = 15000;
  vulcan.resources.fuel = 12000;
  vulcan.resources.energy = 8000;
  vulcan.resources.credits = 30000;

  // Desert (Neutral)
  const desert: PlanetEntity = {
    id: 2,
    name: 'Desert World',
    type: PlanetType.Desert,
    owner: FactionType.Neutral,
    position: new Position3D(200, 0, 0),
    visualSeed: 789,
    rotationSpeed: 1.0,
    scaleMultiplier: 1.0,
    colonized: false,
    resources: new ResourceCollection(),
    population: 0,
    morale: 50,
    taxRate: 50,
    isHabitable: true,
    structures: [],
    resourceMultipliers: { food: 0.3, minerals: 1.5, fuel: 0.8, energy: 1.5 }
  };

  gameState.planets.push(starbase, vulcan, desert);
  gameState.rebuildLookups();
  gameState.craft = [];

  return gameState;
}

// Helper function to create active building
function createActiveStation(type: BuildingType): Structure {
  const structure = new Structure();
  structure.type = type;
  structure.status = BuildingStatus.Active;
  structure.turnsRemaining = 0;
  return structure;
}
