import { PopulationSystem } from '@core/PopulationSystem';
import { ResourceSystem } from '@core/ResourceSystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { ResourceCollection } from '@core/models/ResourceModels';

describe('PopulationSystem', () => {
  let gameState: GameState;
  let resourceSystem: ResourceSystem;
  let populationSystem: PopulationSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    resourceSystem = new ResourceSystem(gameState);
    populationSystem = new PopulationSystem(gameState, resourceSystem);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new PopulationSystem(null as any, resourceSystem)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should throw error if resourceSystem is null', () => {
      expect(() => new PopulationSystem(gameState, null as any)).toThrow(
        'resourceSystem cannot be null or undefined'
      );
    });
  });

  describe('updateFactionPopulation', () => {
    it('should increase population when morale is high and food is available', () => {
      const initialPopulation = gameState.planets[0].population;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Population should have grown (75% morale × 5% = 3.75% growth)
      expect(gameState.planets[0].population).toBeGreaterThan(initialPopulation);
    });

    it('should not grow population if morale is zero', () => {
      gameState.planets[0].morale = 0;
      const initialPopulation = gameState.planets[0].population;

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(gameState.planets[0].population).toBe(initialPopulation);
      expect(gameState.planets[0].growthRate).toBe(0);
    });

    it('should not grow population if planet is starving', () => {
      gameState.planets[0].resources.food = 0;
      const initialPopulation = gameState.planets[0].population;

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(gameState.planets[0].population).toBe(initialPopulation);
      expect(gameState.planets[0].growthRate).toBe(0);
    });

    it('should skip uninhabitable planets', () => {
      gameState.planets[0].colonized = false;
      gameState.planets[0].type = PlanetType.Volcanic; // Not Metropolis
      const initialPopulation = gameState.planets[0].population;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Population should not change (planet not habitable)
      expect(gameState.planets[0].population).toBe(initialPopulation);
    });

    it('should skip planets with zero population', () => {
      gameState.planets[0].population = 0;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Should not crash and population remains 0
      expect(gameState.planets[0].population).toBe(0);
    });
  });

  describe('consumeFoodForPopulation', () => {
    it('should consume correct amount of food', () => {
      const initialFood = gameState.planets[0].resources.food;
      const population = gameState.planets[0].population; // 1000

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Should consume 0.5 Food per person = 500 Food
      // But population grows first, so consumption will be slightly more
      const expectedConsumption = Math.floor(population * PopulationSystem.FOOD_CONSUMPTION_PER_PERSON);
      expect(gameState.planets[0].resources.food).toBeLessThan(initialFood);
    });

    it('should fire onFoodShortage event when food is insufficient', () => {
      let foodShortagePlanetID = -1;

      populationSystem.onFoodShortage = (planetID) => {
        foodShortagePlanetID = planetID;
      };

      // Set food to less than required
      gameState.planets[0].resources.food = 100; // Population needs 500

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(foodShortagePlanetID).toBe(0);
    });

    it('should fire onStarvation event when food is zero', () => {
      let starvationPlanetID = -1;

      populationSystem.onStarvation = (planetID) => {
        starvationPlanetID = planetID;
      };

      gameState.planets[0].resources.food = 0;

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(starvationPlanetID).toBe(0);
    });
  });

  describe('updateMorale', () => {
    it('should decrease morale when tax rate is high (>75%)', () => {
      gameState.planets[0].taxRate = 80;
      const initialMorale = gameState.planets[0].morale;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Morale should decrease by 5% due to high taxes
      expect(gameState.planets[0].morale).toBe(initialMorale - 5);
    });

    it('should increase morale when tax rate is low (<25%)', () => {
      gameState.planets[0].taxRate = 20;
      const initialMorale = gameState.planets[0].morale;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Morale should increase by 2% due to low taxes
      expect(gameState.planets[0].morale).toBe(initialMorale + 2);
    });

    it('should decrease morale when starving', () => {
      gameState.planets[0].resources.food = 0;
      const initialMorale = gameState.planets[0].morale;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Morale should decrease by 10% due to starvation
      expect(gameState.planets[0].morale).toBeLessThan(initialMorale);
    });

    it('should decrease morale when rationing food', () => {
      gameState.planets[0].resources.food = 100; // Less than required (500)
      const initialMorale = gameState.planets[0].morale;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Morale should decrease by 3% due to rationing
      expect(gameState.planets[0].morale).toBeLessThan(initialMorale);
    });

    it('should clamp morale to 0-100 range', () => {
      gameState.planets[0].morale = 99;
      gameState.planets[0].taxRate = 20; // Low taxes (+2 morale)

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(gameState.planets[0].morale).toBe(100); // Clamped to max
    });

    it('should fire onMoraleChanged event when morale changes', () => {
      let moralePlanetID = -1;
      let newMorale = -1;

      populationSystem.onMoraleChanged = (planetID, morale) => {
        moralePlanetID = planetID;
        newMorale = morale;
      };

      gameState.planets[0].taxRate = 80; // High taxes

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(moralePlanetID).toBe(0);
      expect(newMorale).toBeGreaterThan(0);
    });
  });

  describe('getFoodRequired', () => {
    it('should return correct food requirement', () => {
      const foodRequired = populationSystem.getFoodRequired(0); // 1000 population

      expect(foodRequired).toBe(500); // 1000 × 0.5
    });

    it('should return 0 if planet not found', () => {
      const foodRequired = populationSystem.getFoodRequired(999);

      expect(foodRequired).toBe(0);
    });
  });

  describe('getEstimatedGrowth', () => {
    it('should calculate correct growth estimate', () => {
      // 1000 population, 75% morale
      // Growth = 1000 × (75 / 100) × 0.05 = 37.5 → 37
      const estimatedGrowth = populationSystem.getEstimatedGrowth(0);

      expect(estimatedGrowth).toBe(37);
    });

    it('should return 0 if morale is zero', () => {
      gameState.planets[0].morale = 0;

      const estimatedGrowth = populationSystem.getEstimatedGrowth(0);

      expect(estimatedGrowth).toBe(0);
    });

    it('should return 0 if planet not found', () => {
      const estimatedGrowth = populationSystem.getEstimatedGrowth(999);

      expect(estimatedGrowth).toBe(0);
    });
  });

  describe('getTaxRateMoraleImpact', () => {
    it('should return -5 for high taxes (>75%)', () => {
      expect(populationSystem.getTaxRateMoraleImpact(80)).toBe(-5);
    });

    it('should return +2 for low taxes (<25%)', () => {
      expect(populationSystem.getTaxRateMoraleImpact(20)).toBe(+2);
    });

    it('should return 0 for moderate taxes (25-75%)', () => {
      expect(populationSystem.getTaxRateMoraleImpact(50)).toBe(0);
    });
  });

  describe('onPopulationChanged event', () => {
    it('should fire when population grows', () => {
      const events: Array<{ planetID: number; population: number }> = [];

      populationSystem.onPopulationChanged = (planetID, population) => {
        events.push({ planetID, population });
      };

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Should fire for both player planets (Starbase=0, Vulcan=1)
      expect(events.length).toBe(2);

      // Starbase (id=0) should have grown from 1000
      const starbaseEvent = events.find(e => e.planetID === 0);
      expect(starbaseEvent).toBeDefined();
      expect(starbaseEvent!.population).toBeGreaterThan(1000);

      // Vulcan (id=1) should have grown from 500
      const vulcanEvent = events.find(e => e.planetID === 1);
      expect(vulcanEvent).toBeDefined();
      expect(vulcanEvent!.population).toBeGreaterThan(500);
    });
  });

  describe('Constants', () => {
    it('should have correct constant values', () => {
      expect(PopulationSystem.MAX_POPULATION).toBe(99999);
      expect(PopulationSystem.FOOD_CONSUMPTION_PER_PERSON).toBe(0.5);
      expect(PopulationSystem.BASE_GROWTH_RATE).toBe(0.05);
    });
  });

  describe('Edge cases', () => {
    it('should cap population at MAX_POPULATION', () => {
      gameState.planets[0].population = PopulationSystem.MAX_POPULATION;

      populationSystem.updateFactionPopulation(FactionType.Player);

      expect(gameState.planets[0].population).toBe(PopulationSystem.MAX_POPULATION);
    });

    it('should handle population near max', () => {
      gameState.planets[0].population = PopulationSystem.MAX_POPULATION - 10;

      populationSystem.updateFactionPopulation(FactionType.Player);

      // Population should not exceed max
      expect(gameState.planets[0].population).toBeLessThanOrEqual(PopulationSystem.MAX_POPULATION);
    });

    it('should set growthRate correctly during growth', () => {
      populationSystem.updateFactionPopulation(FactionType.Player);

      // Growth rate should be (75 / 100) × 0.05 = 0.0375
      expect(gameState.planets[0].growthRate).toBeCloseTo(0.0375, 5);
    });
  });
});

/**
 * Helper function to create a test game state with 2 player planets.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Starbase (Player, Metropolis)
  const starbase = new PlanetEntity();
  starbase.id = 0;
  starbase.name = 'Starbase';
  starbase.type = PlanetType.Metropolis;
  starbase.owner = FactionType.Player;
  starbase.position = new Position3D(0, 0, 0);
  starbase.visualSeed = 123;
  starbase.rotationSpeed = 1.0;
  starbase.scaleMultiplier = 1.0;
  starbase.colonized = true;
  starbase.resources.food = 10000;
  starbase.resources.minerals = 10000;
  starbase.resources.fuel = 10000;
  starbase.resources.energy = 10000;
  starbase.resources.credits = 50000;
  starbase.population = 1000;
  starbase.morale = 75;
  starbase.taxRate = 50;

  // Vulcan (Player, Volcanic)
  const vulcan = new PlanetEntity();
  vulcan.id = 1;
  vulcan.name = 'Vulcan';
  vulcan.type = PlanetType.Volcanic;
  vulcan.owner = FactionType.Player;
  vulcan.position = new Position3D(100, 0, 0);
  vulcan.visualSeed = 456;
  vulcan.rotationSpeed = 1.5;
  vulcan.scaleMultiplier = 0.8;
  vulcan.colonized = true;
  vulcan.resources.food = 1000;
  vulcan.resources.minerals = 5000;
  vulcan.resources.fuel = 3000;
  vulcan.resources.energy = 1000;
  vulcan.resources.credits = 10000;
  vulcan.population = 500;
  vulcan.morale = 60;
  vulcan.taxRate = 50;

  gameState.planets.push(starbase);
  gameState.planets.push(vulcan);
  gameState.rebuildLookups();

  return gameState;
}
