import { ResourceSystem } from '@core/ResourceSystem';
import { GameState } from '@core/GameState';
import { ResourceDelta, ResourceCost, ResourceType, ResourceLevel, ResourceCollection } from '@core/models/ResourceModels';
import { FactionType, PlanetType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { PlanetEntity } from '@core/models/PlanetEntity';

describe('ResourceSystem', () => {
  let gameState: GameState;
  let resourceSystem: ResourceSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    resourceSystem = new ResourceSystem(gameState);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new ResourceSystem(null as any)).toThrow('gameState cannot be null or undefined');
    });

    it('should throw error if gameState is undefined', () => {
      expect(() => new ResourceSystem(undefined as any)).toThrow('gameState cannot be null or undefined');
    });
  });

  describe('addResources', () => {
    it('should increase resources when adding positive delta', () => {
      const delta = new ResourceDelta();
      delta.food = 100;
      delta.minerals = 50;

      resourceSystem.addResources(0, delta);

      expect(gameState.planets[0].resources.food).toBe(10100);
      expect(gameState.planets[0].resources.minerals).toBe(10050);
    });

    it('should clamp resources to non-negative values', () => {
      const delta = new ResourceDelta();
      delta.food = -20000; // Planet has 10,000

      resourceSystem.addResources(0, delta);

      expect(gameState.planets[0].resources.food).toBe(0); // Clamped to 0
    });

    it('should return false if planet not found', () => {
      const delta = new ResourceDelta();
      delta.food = 100;

      const result = resourceSystem.addResources(999, delta);

      expect(result).toBe(false);
    });

    it('should fire onResourcesChanged event', () => {
      let eventPlanetID = -1;
      let eventDelta: ResourceDelta | null = null;

      resourceSystem.onResourcesChanged = (planetID, delta) => {
        eventPlanetID = planetID;
        eventDelta = delta;
      };

      const delta = new ResourceDelta();
      delta.food = 100;
      resourceSystem.addResources(0, delta);

      expect(eventPlanetID).toBe(0);
      expect(eventDelta).not.toBeNull();
      expect(eventDelta!.food).toBe(100);
    });
  });

  describe('removeResources', () => {
    it('should return false if insufficient resources', () => {
      const cost = new ResourceCost();
      cost.food = 20000; // Planet has 10,000

      const success = resourceSystem.removeResources(0, cost);

      expect(success).toBe(false);
      expect(gameState.planets[0].resources.food).toBe(10000); // Unchanged
    });

    it('should succeed if sufficient resources', () => {
      const cost = new ResourceCost();
      cost.food = 500;
      cost.minerals = 200;

      const success = resourceSystem.removeResources(0, cost);

      expect(success).toBe(true);
      expect(gameState.planets[0].resources.food).toBe(9500);
      expect(gameState.planets[0].resources.minerals).toBe(9800);
    });

    it('should return false if planet not found', () => {
      const cost = new ResourceCost();
      cost.food = 100;

      const result = resourceSystem.removeResources(999, cost);

      expect(result).toBe(false);
    });
  });

  describe('canAfford', () => {
    it('should return true if sufficient resources', () => {
      const cost = new ResourceCost();
      cost.food = 500;
      cost.minerals = 200;

      const canAfford = resourceSystem.canAfford(0, cost);

      expect(canAfford).toBe(true);
    });

    it('should return false if insufficient resources', () => {
      const cost = new ResourceCost();
      cost.food = 20000; // Planet has 10,000

      const canAfford = resourceSystem.canAfford(0, cost);

      expect(canAfford).toBe(false);
    });

    it('should return false if planet not found', () => {
      const cost = new ResourceCost();
      cost.food = 100;

      const result = resourceSystem.canAfford(999, cost);

      expect(result).toBe(false);
    });
  });

  describe('getTotalResources', () => {
    it('should sum resources across faction planets', () => {
      const total = resourceSystem.getTotalResources(FactionType.Player);

      expect(total.food).toBe(11000);    // 10,000 + 1,000
      expect(total.minerals).toBe(15000); // 10,000 + 5,000
      expect(total.fuel).toBe(13000);    // 10,000 + 3,000
      expect(total.energy).toBe(11000);  // 10,000 + 1,000
      expect(total.credits).toBe(60000); // 50,000 + 10,000
    });

    it('should return zero for faction with no planets', () => {
      const total = resourceSystem.getTotalResources(FactionType.AI);

      expect(total.food).toBe(0);
      expect(total.minerals).toBe(0);
      expect(total.fuel).toBe(0);
      expect(total.energy).toBe(0);
      expect(total.credits).toBe(0);
    });
  });

  describe('getResourceLevel', () => {
    it('should return Critical below 100', () => {
      resourceSystem.setResourceAmount(0, ResourceType.Food, 50);

      const level = resourceSystem.getResourceLevel(0, ResourceType.Food);

      expect(level).toBe(ResourceLevel.Critical);
    });

    it('should return Warning below 500', () => {
      resourceSystem.setResourceAmount(0, ResourceType.Food, 300);

      const level = resourceSystem.getResourceLevel(0, ResourceType.Food);

      expect(level).toBe(ResourceLevel.Warning);
    });

    it('should return Normal above 500', () => {
      const level = resourceSystem.getResourceLevel(0, ResourceType.Food);

      expect(level).toBe(ResourceLevel.Normal);
    });

    it('should return Unknown if planet not found', () => {
      const level = resourceSystem.getResourceLevel(999, ResourceType.Food);

      expect(level).toBe(ResourceLevel.Unknown);
    });
  });

  describe('getResourceAmount', () => {
    it('should return correct amount for each resource type', () => {
      expect(resourceSystem.getResourceAmount(0, ResourceType.Food)).toBe(10000);
      expect(resourceSystem.getResourceAmount(0, ResourceType.Minerals)).toBe(10000);
      expect(resourceSystem.getResourceAmount(0, ResourceType.Fuel)).toBe(10000);
      expect(resourceSystem.getResourceAmount(0, ResourceType.Energy)).toBe(10000);
      expect(resourceSystem.getResourceAmount(0, ResourceType.Credits)).toBe(50000);
    });

    it('should return 0 if planet not found', () => {
      const amount = resourceSystem.getResourceAmount(999, ResourceType.Food);

      expect(amount).toBe(0);
    });
  });

  describe('setResourceAmount', () => {
    it('should set resource amount correctly', () => {
      const success = resourceSystem.setResourceAmount(0, ResourceType.Food, 5000);

      expect(success).toBe(true);
      expect(gameState.planets[0].resources.food).toBe(5000);
    });

    it('should clamp negative amounts to zero', () => {
      resourceSystem.setResourceAmount(0, ResourceType.Food, -100);

      expect(gameState.planets[0].resources.food).toBe(0);
    });

    it('should return false if planet not found', () => {
      const result = resourceSystem.setResourceAmount(999, ResourceType.Food, 1000);

      expect(result).toBe(false);
    });
  });

  describe('Critical resource events', () => {
    it('should fire onResourceCritical when resource falls below threshold', () => {
      let criticalPlanetID = -1;
      let criticalResourceType: ResourceType | null = null;

      resourceSystem.onResourceCritical = (planetID, resourceType) => {
        criticalPlanetID = planetID;
        criticalResourceType = resourceType;
      };

      resourceSystem.setResourceAmount(0, ResourceType.Food, 50); // Below 100

      expect(criticalPlanetID).toBe(0);
      expect(criticalResourceType).toBe(ResourceType.Food);
    });

    it('should not fire events for neutral planets', () => {
      // Add a neutral planet
      const neutralPlanet: PlanetEntity = {
        id: 2,
        name: 'Neutral Planet',
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
        taxRate: 0
      };
      gameState.planets.push(neutralPlanet);
      gameState.rebuildLookups();

      let eventFired = false;
      resourceSystem.onResourceCritical = () => {
        eventFired = true;
      };

      resourceSystem.setResourceAmount(2, ResourceType.Food, 50);

      expect(eventFired).toBe(false); // Should not fire for neutral planets
    });
  });

  describe('Constants', () => {
    it('should have correct threshold values', () => {
      expect(ResourceSystem.CRITICAL_THRESHOLD).toBe(100);
      expect(ResourceSystem.WARNING_THRESHOLD).toBe(500);
      expect(ResourceSystem.CARGO_CAPACITY).toBe(1000);
    });
  });

  describe('Edge cases and branch coverage', () => {
    it('should check all resource types in getResourceLevel', () => {
      expect(resourceSystem.getResourceLevel(0, ResourceType.Food)).toBe(ResourceLevel.Normal);
      expect(resourceSystem.getResourceLevel(0, ResourceType.Minerals)).toBe(ResourceLevel.Normal);
      expect(resourceSystem.getResourceLevel(0, ResourceType.Fuel)).toBe(ResourceLevel.Normal);
      expect(resourceSystem.getResourceLevel(0, ResourceType.Energy)).toBe(ResourceLevel.Normal);
      expect(resourceSystem.getResourceLevel(0, ResourceType.Credits)).toBe(ResourceLevel.Normal);
    });

    it('should set all resource types in setResourceAmount', () => {
      expect(resourceSystem.setResourceAmount(0, ResourceType.Food, 2000)).toBe(true);
      expect(gameState.planets[0].resources.food).toBe(2000);

      expect(resourceSystem.setResourceAmount(0, ResourceType.Minerals, 3000)).toBe(true);
      expect(gameState.planets[0].resources.minerals).toBe(3000);

      expect(resourceSystem.setResourceAmount(0, ResourceType.Fuel, 4000)).toBe(true);
      expect(gameState.planets[0].resources.fuel).toBe(4000);

      expect(resourceSystem.setResourceAmount(0, ResourceType.Energy, 5000)).toBe(true);
      expect(gameState.planets[0].resources.energy).toBe(5000);

      expect(resourceSystem.setResourceAmount(0, ResourceType.Credits, 6000)).toBe(true);
      expect(gameState.planets[0].resources.credits).toBe(6000);
    });

    it('should fire critical events for all resource types', () => {
      const criticalResources: ResourceType[] = [];

      resourceSystem.onResourceCritical = (_planetID, resourceType) => {
        criticalResources.push(resourceType);
      };

      // Set all resources to critical levels
      resourceSystem.setResourceAmount(0, ResourceType.Food, 50);
      resourceSystem.setResourceAmount(0, ResourceType.Minerals, 50);
      resourceSystem.setResourceAmount(0, ResourceType.Fuel, 50);
      resourceSystem.setResourceAmount(0, ResourceType.Energy, 50);
      resourceSystem.setResourceAmount(0, ResourceType.Credits, 50);

      expect(criticalResources).toContain(ResourceType.Food);
      expect(criticalResources).toContain(ResourceType.Minerals);
      expect(criticalResources).toContain(ResourceType.Fuel);
      expect(criticalResources).toContain(ResourceType.Energy);
      expect(criticalResources).toContain(ResourceType.Credits);
    });

    it('should handle ResourceCost.toDelta', () => {
      const cost = new ResourceCost();
      cost.credits = 100;
      cost.minerals = 50;
      cost.fuel = 25;
      cost.food = 10;
      cost.energy = 5;

      const delta = cost.toDelta();

      expect(delta.credits).toBe(-100);
      expect(delta.minerals).toBe(-50);
      expect(delta.fuel).toBe(-25);
      expect(delta.food).toBe(-10);
      expect(delta.energy).toBe(-5);
    });

    it('should handle ResourceDelta.isZero', () => {
      const delta1 = new ResourceDelta();
      expect(delta1.isZero).toBe(true);

      const delta2 = new ResourceDelta();
      delta2.food = 10;
      expect(delta2.isZero).toBe(false);
    });

    it('should handle ResourceDelta.isPositive', () => {
      const delta1 = new ResourceDelta();
      delta1.food = 10;
      delta1.minerals = 5;
      expect(delta1.isPositive).toBe(true);

      const delta2 = new ResourceDelta();
      delta2.food = 10;
      delta2.minerals = -5;
      expect(delta2.isPositive).toBe(false);
    });

    it('should handle ResourceCost.isZero', () => {
      const cost1 = new ResourceCost();
      expect(cost1.isZero).toBe(true);

      const cost2 = new ResourceCost();
      cost2.food = 10;
      expect(cost2.isZero).toBe(false);
    });

    it('should handle ResourceCost.zero static property', () => {
      const cost = ResourceCost.zero;
      expect(cost.credits).toBe(0);
      expect(cost.minerals).toBe(0);
      expect(cost.fuel).toBe(0);
      expect(cost.food).toBe(0);
      expect(cost.energy).toBe(0);
    });

    it('should handle ResourceCollection.canAffordDelta', () => {
      const collection = new ResourceCollection();
      collection.credits = 100;
      collection.minerals = 50;

      const delta1 = new ResourceDelta();
      delta1.credits = -50;
      delta1.minerals = -25;
      expect(collection.canAffordDelta(delta1)).toBe(true);

      const delta2 = new ResourceDelta();
      delta2.credits = -200; // More than available
      expect(collection.canAffordDelta(delta2)).toBe(false);
    });
  });
});

/**
 * Helper function to create a test game state with 2 player planets.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Starbase (Player, Metropolis)
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
    population: 1000,
    morale: 75,
    taxRate: 50
  };
  starbase.resources.food = 10000;
  starbase.resources.minerals = 10000;
  starbase.resources.fuel = 10000;
  starbase.resources.energy = 10000;
  starbase.resources.credits = 50000;

  // Vulcan (Player, Volcanic)
  const vulcan: PlanetEntity = {
    id: 1,
    name: 'Vulcan',
    type: PlanetType.Volcanic,
    owner: FactionType.Player,
    position: new Position3D(100, 0, 0),
    visualSeed: 456,
    rotationSpeed: 1.5,
    scaleMultiplier: 0.8,
    colonized: true,
    resources: new ResourceCollection(),
    population: 500,
    morale: 60,
    taxRate: 50
  };
  vulcan.resources.food = 1000;
  vulcan.resources.minerals = 5000;
  vulcan.resources.fuel = 3000;
  vulcan.resources.energy = 1000;
  vulcan.resources.credits = 10000;

  gameState.planets.push(starbase);
  gameState.planets.push(vulcan);
  gameState.rebuildLookups();

  return gameState;
}
