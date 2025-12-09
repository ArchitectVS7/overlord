import { CraftSystem } from '@core/CraftSystem';
import { EntitySystem } from '@core/EntitySystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType, CraftType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';

describe('CraftSystem', () => {
  let gameState: GameState;
  let entitySystem: EntitySystem;
  let craftSystem: CraftSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    entitySystem = new EntitySystem(gameState);
    craftSystem = new CraftSystem(gameState, entitySystem);

    // Give planet sufficient resources for testing
    const starbase = gameState.planets[0];
    starbase.resources.credits = 500000;
    starbase.resources.minerals = 100000;
    starbase.resources.fuel = 50000;
    starbase.population = 10000;
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new CraftSystem(null as any, entitySystem)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should throw error if entitySystem is null', () => {
      expect(() => new CraftSystem(gameState, null as any)).toThrow(
        'entitySystem cannot be null or undefined'
      );
    });
  });

  describe('purchaseCraft', () => {
    it('should purchase Battle Cruiser successfully', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(craftID).toBeGreaterThanOrEqual(0);
      expect(gameState.craft.length).toBe(1);
      expect(gameState.craft[0].type).toBe(CraftType.BattleCruiser);
    });

    it('should deduct cost from planet resources', () => {
      const starbase = gameState.planets[0];
      const initialCredits = starbase.resources.credits;
      const initialMinerals = starbase.resources.minerals;
      const initialFuel = starbase.resources.fuel;

      craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(starbase.resources.credits).toBe(initialCredits - 50000);
      expect(starbase.resources.minerals).toBe(initialMinerals - 10000);
      expect(starbase.resources.fuel).toBe(initialFuel - 5000);
    });

    it('should deduct crew from population', () => {
      const starbase = gameState.planets[0];
      const initialPopulation = starbase.population;

      craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(starbase.population).toBe(initialPopulation - 50); // BC requires 50 crew
    });

    it('should fire onCraftPurchased event', () => {
      let purchasedID = -1;

      craftSystem.onCraftPurchased = (id) => {
        purchasedID = id;
      };

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(purchasedID).toBe(craftID);
    });

    it('should return -1 if planet does not exist', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 999, FactionType.Player);

      expect(craftID).toBe(-1);
    });

    it('should return -1 if fleet limit reached', () => {
      // Create 32 craft (max)
      for (let i = 0; i < EntitySystem.MaxCraft; i++) {
        entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      }

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(craftID).toBe(-1);
    });

    it('should return -1 if insufficient resources', () => {
      const starbase = gameState.planets[0];
      starbase.resources.credits = 1000; // Not enough for BC (50000)

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(craftID).toBe(-1);
    });

    it('should return -1 if insufficient crew', () => {
      const starbase = gameState.planets[0];
      starbase.population = 10; // Not enough for BC (50 crew)

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(craftID).toBe(-1);
    });
  });

  describe('scrapCraft', () => {
    it('should scrap craft and refund 50% cost', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const starbase = gameState.planets[0];

      const creditsBeforeScrap = starbase.resources.credits;
      const mineralsBeforeScrap = starbase.resources.minerals;
      const fuelBeforeScrap = starbase.resources.fuel;

      const scrapped = craftSystem.scrapCraft(craftID);

      expect(scrapped).toBe(true);
      expect(gameState.craft.length).toBe(0);

      // Refund is 50% of cost
      expect(starbase.resources.credits).toBe(creditsBeforeScrap + 25000);
      expect(starbase.resources.minerals).toBe(mineralsBeforeScrap + 5000);
      expect(starbase.resources.fuel).toBe(fuelBeforeScrap + 2500);
    });

    it('should return crew to population', () => {
      const starbase = gameState.planets[0];
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      const populationBeforeScrap = starbase.population;
      craftSystem.scrapCraft(craftID);

      expect(starbase.population).toBe(populationBeforeScrap + 50); // BC crew returned
    });

    it('should fire onCraftScrapped event', () => {
      let scrappedID = -1;

      craftSystem.onCraftScrapped = (id) => {
        scrappedID = id;
      };

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      craftSystem.scrapCraft(craftID);

      expect(scrappedID).toBe(craftID);
    });

    it('should return false if craft not found', () => {
      const scrapped = craftSystem.scrapCraft(999);

      expect(scrapped).toBe(false);
    });

    it('should return false if craft in transit', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      gameState.craft[0].inTransit = true;

      const scrapped = craftSystem.scrapCraft(craftID);

      expect(scrapped).toBe(false);
    });
  });

  describe('embarkPlatoons', () => {
    it('should embark platoons onto Battle Cruiser', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID1 = entitySystem.createPlatoon(0, FactionType.Player);
      const platoonID2 = entitySystem.createPlatoon(0, FactionType.Player);

      const embarked = craftSystem.embarkPlatoons(craftID, [platoonID1, platoonID2]);

      expect(embarked).toBe(true);
      expect(gameState.craft[0].carriedPlatoonIDs).toEqual([platoonID1, platoonID2]);
      expect(gameState.platoons[0].planetID).toBe(-1); // Carried by craft
      expect(gameState.platoons[1].planetID).toBe(-1);
    });

    it('should fire onPlatoonsEmbarked event', () => {
      let embarkedCraftID = -1;
      let embarkedPlatoonIDs: number[] = [];

      craftSystem.onPlatoonsEmbarked = (craftID, platoonIDs) => {
        embarkedCraftID = craftID;
        embarkedPlatoonIDs = platoonIDs;
      };

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(0, FactionType.Player);

      craftSystem.embarkPlatoons(craftID, [platoonID]);

      expect(embarkedCraftID).toBe(craftID);
      expect(embarkedPlatoonIDs).toEqual([platoonID]);
    });

    it('should return false if craft is not Battle Cruiser', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(0, FactionType.Player);

      const embarked = craftSystem.embarkPlatoons(craftID, [platoonID]);

      expect(embarked).toBe(false);
    });

    it('should return false if exceeds capacity (4 platoons)', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      // Create 5 platoons (exceeds capacity)
      const platoonIDs: number[] = [];
      for (let i = 0; i < 5; i++) {
        platoonIDs.push(entitySystem.createPlatoon(0, FactionType.Player));
      }

      const embarked = craftSystem.embarkPlatoons(craftID, platoonIDs);

      expect(embarked).toBe(false);
    });

    it('should return false if platoon not at same planet', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(1, FactionType.Player); // Different planet

      const embarked = craftSystem.embarkPlatoons(craftID, [platoonID]);

      expect(embarked).toBe(false);
    });
  });

  describe('disembarkPlatoons', () => {
    it('should disembark platoons from Battle Cruiser', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(0, FactionType.Player);

      craftSystem.embarkPlatoons(craftID, [platoonID]);
      const disembarked = craftSystem.disembarkPlatoons(craftID, [platoonID]);

      expect(disembarked).toBe(true);
      expect(gameState.craft[0].carriedPlatoonIDs.length).toBe(0);
      expect(gameState.platoons[0].planetID).toBe(0); // Back at planet
    });

    it('should fire onPlatoonsDisembarked event', () => {
      let disembarkedCraftID = -1;
      let disembarkedPlatoonIDs: number[] = [];

      craftSystem.onPlatoonsDisembarked = (craftID, platoonIDs) => {
        disembarkedCraftID = craftID;
        disembarkedPlatoonIDs = platoonIDs;
      };

      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(0, FactionType.Player);

      craftSystem.embarkPlatoons(craftID, [platoonID]);
      craftSystem.disembarkPlatoons(craftID, [platoonID]);

      expect(disembarkedCraftID).toBe(craftID);
      expect(disembarkedPlatoonIDs).toEqual([platoonID]);
    });

    it('should return false if craft in transit', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(0, FactionType.Player);

      craftSystem.embarkPlatoons(craftID, [platoonID]);
      gameState.craft[0].inTransit = true;

      const disembarked = craftSystem.disembarkPlatoons(craftID, [platoonID]);

      expect(disembarked).toBe(false);
    });

    it('should return false if platoon not carried by craft', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const platoonID = entitySystem.createPlatoon(0, FactionType.Player);

      const disembarked = craftSystem.disembarkPlatoons(craftID, [platoonID]);

      expect(disembarked).toBe(false);
    });
  });

  describe('loadCargo', () => {
    it('should load cargo onto Cargo Cruiser', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
      const starbase = gameState.planets[0];

      const creditsBeforeLoad = starbase.resources.credits;

      const loaded = craftSystem.loadCargo(craftID, {
        credits: 1000,
        minerals: 500,
        fuel: 0,
        food: 0,
        energy: 0
      });

      expect(loaded).toBe(true);
      expect(gameState.craft[0].cargoHold?.credits).toBe(1000);
      expect(gameState.craft[0].cargoHold?.minerals).toBe(500);
      expect(starbase.resources.credits).toBe(creditsBeforeLoad - 1000);
    });

    it('should fire onCargoLoaded event', () => {
      let loadedCraftID = -1;
      let loadedCargo: any = null;

      craftSystem.onCargoLoaded = (craftID, cargo) => {
        loadedCraftID = craftID;
        loadedCargo = cargo;
      };

      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
      const cargo = { credits: 1000, minerals: 0, fuel: 0, food: 0, energy: 0 };

      craftSystem.loadCargo(craftID, cargo);

      expect(loadedCraftID).toBe(craftID);
      expect(loadedCargo).toEqual(cargo);
    });

    it('should return false if not Cargo Cruiser', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      const loaded = craftSystem.loadCargo(craftID, {
        credits: 1000,
        minerals: 0,
        fuel: 0,
        food: 0,
        energy: 0
      });

      expect(loaded).toBe(false);
    });

    it('should return false if exceeds cargo capacity', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);

      const loaded = craftSystem.loadCargo(craftID, {
        credits: 2000, // Exceeds capacity (1000)
        minerals: 0,
        fuel: 0,
        food: 0,
        energy: 0
      });

      expect(loaded).toBe(false);
    });

    it('should return false if planet has insufficient resources', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
      const starbase = gameState.planets[0];
      starbase.resources.credits = 100; // Not enough

      const loaded = craftSystem.loadCargo(craftID, {
        credits: 1000,
        minerals: 0,
        fuel: 0,
        food: 0,
        energy: 0
      });

      expect(loaded).toBe(false);
    });
  });

  describe('unloadCargo', () => {
    it('should unload cargo from Cargo Cruiser', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
      const starbase = gameState.planets[0];

      // Load cargo first
      craftSystem.loadCargo(craftID, {
        credits: 1000,
        minerals: 500,
        fuel: 0,
        food: 0,
        energy: 0
      });

      const creditsBeforeUnload = starbase.resources.credits;

      // Unload cargo
      const unloaded = craftSystem.unloadCargo(craftID, {
        credits: 500,
        minerals: 250,
        fuel: 0,
        food: 0,
        energy: 0
      });

      expect(unloaded).toBe(true);
      expect(gameState.craft[0].cargoHold?.credits).toBe(500);
      expect(gameState.craft[0].cargoHold?.minerals).toBe(250);
      expect(starbase.resources.credits).toBe(creditsBeforeUnload + 500);
    });

    it('should fire onCargoUnloaded event', () => {
      let unloadedCraftID = -1;
      let unloadedCargo: any = null;

      craftSystem.onCargoUnloaded = (craftID, cargo) => {
        unloadedCraftID = craftID;
        unloadedCargo = cargo;
      };

      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
      const cargo = { credits: 500, minerals: 0, fuel: 0, food: 0, energy: 0 };

      craftSystem.loadCargo(craftID, { credits: 1000, minerals: 0, fuel: 0, food: 0, energy: 0 });
      craftSystem.unloadCargo(craftID, cargo);

      expect(unloadedCraftID).toBe(craftID);
      expect(unloadedCargo).toEqual(cargo);
    });

    it('should return false if insufficient cargo in hold', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);

      craftSystem.loadCargo(craftID, { credits: 500, minerals: 0, fuel: 0, food: 0, energy: 0 });

      const unloaded = craftSystem.unloadCargo(craftID, {
        credits: 1000, // More than in hold
        minerals: 0,
        fuel: 0,
        food: 0,
        energy: 0
      });

      expect(unloaded).toBe(false);
    });
  });

  describe('deploySolarSatellite', () => {
    it('should deploy Solar Satellite', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.SolarSatellite, 0, FactionType.Player);

      const deployed = craftSystem.deploySolarSatellite(craftID);

      expect(deployed).toBe(true);
      expect(gameState.craft[0].deployedAtPlanetID).toBe(0);
      expect(gameState.craft[0].active).toBe(true); // Planet has 10000 pop, needs 5+
    });

    it('should return false if not Solar Satellite', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      const deployed = craftSystem.deploySolarSatellite(craftID);

      expect(deployed).toBe(false);
    });

    it('should not activate if planet has insufficient crew', () => {
      const starbase = gameState.planets[0];

      // Purchase the craft first (needs 5 crew)
      const craftID = craftSystem.purchaseCraft(CraftType.SolarSatellite, 0, FactionType.Player);

      // Now reduce population below 5
      starbase.population = 3;

      craftSystem.deploySolarSatellite(craftID);

      expect(gameState.craft[0].active).toBe(false);
    });
  });

  describe('deployAtmosphereProcessor', () => {
    it('should deploy Atmosphere Processor and start terraforming', () => {
      // Setup neutral planet with resources for purchasing craft
      const neutralPlanet = gameState.planets[2];
      neutralPlanet.resources.credits = 50000;
      neutralPlanet.resources.minerals = 10000;
      neutralPlanet.resources.fuel = 5000;
      neutralPlanet.population = 100; // Enough for crew (20)

      const craftID = craftSystem.purchaseCraft(
        CraftType.AtmosphereProcessor,
        2,
        FactionType.Player
      );

      const deployed = craftSystem.deployAtmosphereProcessor(craftID);

      expect(deployed).toBe(true);
      expect(neutralPlanet.terraformingProgress).toBe(10);
      expect(gameState.craft.length).toBe(0); // Craft destroyed (one-time use)
    });

    it('should fire onAtmosphereProcessorDeployed event', () => {
      let deployedPlanetID = -1;
      let deployedCraftID = -1;

      craftSystem.onAtmosphereProcessorDeployed = (planetID, craftID) => {
        deployedPlanetID = planetID;
        deployedCraftID = craftID;
      };

      // Setup neutral planet with resources for purchasing craft
      const neutralPlanet = gameState.planets[2];
      neutralPlanet.resources.credits = 50000;
      neutralPlanet.resources.minerals = 10000;
      neutralPlanet.resources.fuel = 5000;
      neutralPlanet.population = 100;

      const craftID = craftSystem.purchaseCraft(
        CraftType.AtmosphereProcessor,
        2,
        FactionType.Player
      );

      craftSystem.deployAtmosphereProcessor(craftID);

      expect(deployedPlanetID).toBe(2);
      expect(deployedCraftID).toBe(craftID);
    });

    it('should return false if planet already colonized', () => {
      const craftID = craftSystem.purchaseCraft(CraftType.AtmosphereProcessor, 0, FactionType.Player);

      const deployed = craftSystem.deployAtmosphereProcessor(craftID);

      expect(deployed).toBe(false);
    });
  });

  describe('Statistics', () => {
    it('should return fleet count', () => {
      craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      craftSystem.purchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);

      expect(craftSystem.getFleetCount()).toBe(2);
    });

    it('should return fleet count by owner', () => {
      craftSystem.purchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      entitySystem.createCraft(CraftType.BattleCruiser, 1, FactionType.AI);

      expect(craftSystem.getFleetCountByOwner(FactionType.Player)).toBe(1);
      expect(craftSystem.getFleetCountByOwner(FactionType.AI)).toBe(1);
    });
  });
});

/**
 * Helper function to create a test game state with 3 planets.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Starbase (Player, Metropolis, colonized)
  const starbase = new PlanetEntity();
  starbase.id = 0;
  starbase.name = 'Starbase';
  starbase.type = PlanetType.Metropolis;
  starbase.owner = FactionType.Player;
  starbase.position = new Position3D(0, 0, 0);
  starbase.colonized = true;
  starbase.population = 5000;

  // Enemy planet (AI, Metropolis, colonized)
  const enemy = new PlanetEntity();
  enemy.id = 1;
  enemy.name = 'Hitotsu';
  enemy.type = PlanetType.Metropolis;
  enemy.owner = FactionType.AI;
  enemy.position = new Position3D(-100, 0, 0);
  enemy.colonized = true;
  enemy.population = 5000;

  // Neutral planet (uncolonized)
  const neutral = new PlanetEntity();
  neutral.id = 2;
  neutral.name = 'Terra Nova';
  neutral.type = PlanetType.Tropical;
  neutral.owner = FactionType.Neutral;
  neutral.position = new Position3D(100, 0, 100);
  neutral.colonized = false;
  neutral.population = 0;

  gameState.planets.push(starbase);
  gameState.planets.push(enemy);
  gameState.planets.push(neutral);
  gameState.rebuildLookups();

  return gameState;
}
