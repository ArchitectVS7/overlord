import { PlatoonSystem } from '@core/PlatoonSystem';
import { EntitySystem } from '@core/EntitySystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType, EquipmentLevel, WeaponLevel } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';

describe('PlatoonSystem', () => {
  let gameState: GameState;
  let entitySystem: EntitySystem;
  let platoonSystem: PlatoonSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    entitySystem = new EntitySystem(gameState);
    platoonSystem = new PlatoonSystem(gameState, entitySystem);

    // Give Starbase sufficient resources for testing
    const starbase = gameState.planets[0];
    starbase.resources.credits = 500000;
    starbase.population = 10000;
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new PlatoonSystem(null as any, entitySystem)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should throw error if entitySystem is null', () => {
      expect(() => new PlatoonSystem(gameState, null as any)).toThrow(
        'entitySystem cannot be null or undefined'
      );
    });
  });

  describe('commissionPlatoon', () => {
    it('should commission platoon successfully', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBeGreaterThanOrEqual(0);
      expect(gameState.platoons.length).toBe(1);
      expect(gameState.platoons[0].troopCount).toBe(100);
      expect(gameState.platoons[0].equipment).toBe(EquipmentLevel.Basic);
      expect(gameState.platoons[0].weapon).toBe(WeaponLevel.Rifle);
    });

    it('should deduct cost from planet resources', () => {
      const starbase = gameState.planets[0];
      const initialCredits = starbase.resources.credits;

      platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Basic equipment (35000) + Rifle (10000) = 45000
      expect(starbase.resources.credits).toBe(initialCredits - 45000);
    });

    it('should draft troops from population', () => {
      const starbase = gameState.planets[0];
      const initialPopulation = starbase.population;

      platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(starbase.population).toBe(initialPopulation - 100);
    });

    it('should initialize training at Starbase', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      const platoon = gameState.platoons[0];
      expect(platoon.trainingLevel).toBe(0);
      expect(platoon.trainingTurnsRemaining).toBe(10); // Starbase = planet 0
    });

    it('should not train at non-Starbase planets', () => {
      // Give colony planet resources
      const colony = gameState.planets[1];
      colony.resources.credits = 100000;
      colony.population = 1000;

      const platoonID = platoonSystem.commissionPlatoon(
        1,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      const platoon = gameState.platoons[0];
      expect(platoon.trainingTurnsRemaining).toBe(0); // No training at planet 1
    });

    it('should calculate initial military strength', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      const platoon = gameState.platoons[0];
      // 100 troops × 1.0 (Basic) × 1.0 (Rifle) × 0.0 (0% trained) = 0
      expect(platoon.strength).toBe(0);
    });

    it('should fire onPlatoonCommissioned event', () => {
      let commissionedID = -1;

      platoonSystem.onPlatoonCommissioned = (id) => {
        commissionedID = id;
      };

      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(commissionedID).toBe(platoonID);
    });

    it('should return -1 if planet does not exist', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        999,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBe(-1);
    });

    it('should return -1 if troop count too low', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        0, // Below minimum (1)
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBe(-1);
    });

    it('should return -1 if troop count too high', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        201, // Above maximum (200)
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBe(-1);
    });

    it('should return -1 if platoon limit reached', () => {
      // Create 24 platoons (max)
      for (let i = 0; i < EntitySystem.MaxPlatoons; i++) {
        entitySystem.createPlatoon(0, FactionType.Player);
      }

      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBe(-1);
    });

    it('should return -1 if insufficient credits', () => {
      const starbase = gameState.planets[0];
      starbase.resources.credits = 1000; // Not enough

      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBe(-1);
    });

    it('should return -1 if insufficient population', () => {
      const starbase = gameState.planets[0];
      starbase.population = 10; // Not enough troops

      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(platoonID).toBe(-1);
    });
  });

  describe('decommissionPlatoon', () => {
    it('should decommission platoon and return troops to population', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      const starbase = gameState.planets[0];
      const populationBeforeDecommission = starbase.population;

      const decommissioned = platoonSystem.decommissionPlatoon(platoonID);

      expect(decommissioned).toBe(true);
      expect(gameState.platoons.length).toBe(0);
      expect(starbase.population).toBe(populationBeforeDecommission + 100);
    });

    it('should fire onPlatoonDecommissioned event', () => {
      let decommissionedID = -1;

      platoonSystem.onPlatoonDecommissioned = (id) => {
        decommissionedID = id;
      };

      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      platoonSystem.decommissionPlatoon(platoonID);

      expect(decommissionedID).toBe(platoonID);
    });

    it('should return false if platoon not found', () => {
      const decommissioned = platoonSystem.decommissionPlatoon(999);

      expect(decommissioned).toBe(false);
    });

    it('should return false if platoon carried by craft', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Simulate platoon being carried by craft
      gameState.platoons[0].planetID = -1;

      const decommissioned = platoonSystem.decommissionPlatoon(platoonID);

      expect(decommissioned).toBe(false);
    });
  });

  describe('updateTraining', () => {
    it('should train platoons at Starbase', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      platoonSystem.updateTraining();

      const platoon = gameState.platoons[0];
      expect(platoon.trainingLevel).toBe(10); // 0 + 10% per turn
      expect(platoon.trainingTurnsRemaining).toBe(9); // 10 - 1
    });

    it('should update strength as training progresses', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      platoonSystem.updateTraining();

      const platoon = gameState.platoons[0];
      // 100 troops × 1.0 (Basic) × 1.0 (Rifle) × 0.1 (10% trained) = 10
      expect(platoon.strength).toBe(10);
    });

    it('should fire onPlatoonTrainingComplete when fully trained', () => {
      let completedID = -1;

      platoonSystem.onPlatoonTrainingComplete = (id) => {
        completedID = id;
      };

      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Train for 10 turns (to 100%)
      for (let i = 0; i < 10; i++) {
        platoonSystem.updateTraining();
      }

      expect(completedID).toBe(platoonID);
    });

    it('should cap training at 100%', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Train for 15 turns (exceeds 100%)
      for (let i = 0; i < 15; i++) {
        platoonSystem.updateTraining();
      }

      const platoon = gameState.platoons[0];
      expect(platoon.trainingLevel).toBe(100);
      expect(platoon.trainingTurnsRemaining).toBe(0);
    });

    it('should not train platoons at non-Starbase planets', () => {
      // Give colony planet resources
      const colony = gameState.planets[1];
      colony.resources.credits = 100000;
      colony.population = 1000;

      const platoonID = platoonSystem.commissionPlatoon(
        1,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      platoonSystem.updateTraining();

      const platoon = gameState.platoons[0];
      expect(platoon.trainingLevel).toBe(0); // No change
    });

    it('should not train fully trained platoons', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Train to 100%
      for (let i = 0; i < 10; i++) {
        platoonSystem.updateTraining();
      }

      const platoon = gameState.platoons[0];
      const strengthAfterTraining = platoon.strength;

      // Train again (should not change)
      platoonSystem.updateTraining();

      expect(platoon.strength).toBe(strengthAfterTraining);
    });
  });

  describe('calculateMilitaryStrength', () => {
    it('should calculate strength for Elite equipment and Plasma weapons', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Elite,
        WeaponLevel.Plasma
      );

      const platoon = gameState.platoons[0];

      // Train to 100%
      for (let i = 0; i < 10; i++) {
        platoonSystem.updateTraining();
      }

      // 100 troops × 2.5 (Elite) × 1.6 (Plasma) × 1.0 (100% trained) = 400
      expect(platoon.strength).toBe(400);
    });

    it('should calculate strength for Civilian equipment and Pistol weapons', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Civilian,
        WeaponLevel.Pistol
      );

      const platoon = gameState.platoons[0];

      // Train to 100%
      for (let i = 0; i < 10; i++) {
        platoonSystem.updateTraining();
      }

      // 100 troops × 0.5 (Civilian) × 0.8 (Pistol) × 1.0 (100% trained) = 40
      expect(platoon.strength).toBe(40);
    });
  });

  describe('getEstimatedStrength', () => {
    it('should estimate strength for preview', () => {
      const estimated = platoonSystem.getEstimatedStrength(
        200,
        EquipmentLevel.Advanced,
        WeaponLevel.AssaultRifle,
        100
      );

      // 200 troops × 2.0 (Advanced) × 1.3 (AssaultRifle) × 1.0 (100% trained) = 520
      expect(estimated).toBe(520);
    });

    it('should default to 100% training if not specified', () => {
      const estimated = platoonSystem.getEstimatedStrength(
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // 100 troops × 1.0 (Basic) × 1.0 (Rifle) × 1.0 (100% trained) = 100
      expect(estimated).toBe(100);
    });
  });

  describe('Statistics', () => {
    it('should return total military strength for faction', () => {
      platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );
      platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Train both to 100%
      for (let i = 0; i < 10; i++) {
        platoonSystem.updateTraining();
      }

      const totalStrength = platoonSystem.getTotalMilitaryStrength(FactionType.Player);

      // 2 platoons × 100 strength each = 200
      expect(totalStrength).toBe(200);
    });

    it('should return platoon count for faction', () => {
      platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );
      entitySystem.createPlatoon(1, FactionType.AI);

      expect(platoonSystem.getPlatoonCount(FactionType.Player)).toBe(1);
      expect(platoonSystem.getPlatoonCount(FactionType.AI)).toBe(1);
    });

    it('should return training platoons', () => {
      platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      const trainingPlatoons = platoonSystem.getTrainingPlatoons();

      expect(trainingPlatoons.length).toBe(1);
    });

    it('should return fully trained platoons', () => {
      const platoonID = platoonSystem.commissionPlatoon(
        0,
        FactionType.Player,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      // Train to 100%
      for (let i = 0; i < 10; i++) {
        platoonSystem.updateTraining();
      }

      const fullyTrained = platoonSystem.getFullyTrainedPlatoons();

      expect(fullyTrained.length).toBe(1);
      expect(fullyTrained[0].id).toBe(platoonID);
    });
  });

  describe('canAffordPlatoon', () => {
    it('should return true if affordable', () => {
      const affordable = platoonSystem.canAffordPlatoon(
        0,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(affordable).toBe(true);
    });

    it('should return false if insufficient credits', () => {
      const starbase = gameState.planets[0];
      starbase.resources.credits = 1000;

      const affordable = platoonSystem.canAffordPlatoon(
        0,
        100,
        EquipmentLevel.Elite,
        WeaponLevel.Plasma
      );

      expect(affordable).toBe(false);
    });

    it('should return false if insufficient population', () => {
      const starbase = gameState.planets[0];
      starbase.population = 10;

      const affordable = platoonSystem.canAffordPlatoon(
        0,
        100,
        EquipmentLevel.Basic,
        WeaponLevel.Rifle
      );

      expect(affordable).toBe(false);
    });
  });
});

/**
 * Helper function to create a test game state with 2 planets.
 */
function createTestGameState(): GameState {
  const gameState = new GameState();

  // Starbase (Player, Metropolis, planet ID 0)
  const starbase = new PlanetEntity();
  starbase.id = 0;
  starbase.name = 'Starbase';
  starbase.type = PlanetType.Metropolis;
  starbase.owner = FactionType.Player;
  starbase.position = new Position3D(0, 0, 0);
  starbase.colonized = true;
  starbase.population = 5000;

  // Colony (Player, Tropical, planet ID 1)
  const colony = new PlanetEntity();
  colony.id = 1;
  colony.name = 'Colony Alpha';
  colony.type = PlanetType.Tropical;
  colony.owner = FactionType.Player;
  colony.position = new Position3D(100, 0, 0);
  colony.colonized = true;
  colony.population = 2000;

  gameState.planets.push(starbase);
  gameState.planets.push(colony);
  gameState.rebuildLookups();

  return gameState;
}
