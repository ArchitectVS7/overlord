import { EntitySystem } from '@core/EntitySystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType, CraftType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';

describe('EntitySystem', () => {
  let gameState: GameState;
  let entitySystem: EntitySystem;

  beforeEach(() => {
    gameState = createTestGameState();
    entitySystem = new EntitySystem(gameState);
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new EntitySystem(null as any)).toThrow(
        'gameState cannot be null or undefined'
      );
    });

    it('should initialize next IDs based on existing craft', () => {
      // Add existing craft
      entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.Player);

      // Create new system (should resume from ID=2)
      const newSystem = new EntitySystem(gameState);
      const id = newSystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      expect(id).toBe(2);
    });

    it('should initialize next IDs based on existing platoons', () => {
      // Add existing platoons
      entitySystem.createPlatoon(0, FactionType.Player);
      entitySystem.createPlatoon(0, FactionType.Player);

      // Create new system (should resume from ID=2)
      const newSystem = new EntitySystem(gameState);
      const id = newSystem.createPlatoon(0, FactionType.Player);

      expect(id).toBe(2);
    });
  });

  describe('Craft Management', () => {
    describe('canCreateCraft', () => {
      it('should return true when under limit', () => {
        expect(entitySystem.canCreateCraft()).toBe(true);
      });

      it('should return false when at limit (32)', () => {
        // Create 32 craft (max)
        for (let i = 0; i < EntitySystem.MaxCraft; i++) {
          entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        }

        expect(entitySystem.canCreateCraft()).toBe(false);
      });
    });

    describe('createCraft', () => {
      it('should create craft and return ID', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        expect(id).toBe(0);
        expect(gameState.craft.length).toBe(1);
        expect(gameState.craft[0].id).toBe(0);
        expect(gameState.craft[0].type).toBe(CraftType.BattleCruiser);
        expect(gameState.craft[0].owner).toBe(FactionType.Player);
        expect(gameState.craft[0].planetID).toBe(0);
      });

      it('should use custom name if provided', () => {
        const id = entitySystem.createCraft(
          CraftType.BattleCruiser,
          0,
          FactionType.Player,
          'Overlord One'
        );

        expect(gameState.craft[0].name).toBe('Overlord One');
      });

      it('should generate default name if not provided', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        expect(gameState.craft[0].name).toBe('BC-000');
      });

      it('should set position to planet position', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        const planet = gameState.planetLookup.get(0)!;
        const craft = gameState.craft[0];

        expect(craft.position.x).toBe(planet.position.x);
        expect(craft.position.y).toBe(planet.position.y);
        expect(craft.position.z).toBe(planet.position.z);
      });

      it('should initialize craft with default values', () => {
        const id = entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.Player);

        const craft = gameState.craft[0];
        expect(craft.inTransit).toBe(false);
        expect(craft.health).toBe(100);
        expect(craft.active).toBe(false);
        expect(craft.deployedAtPlanetID).toBe(-1);
        expect(craft.terraformingTurnsRemaining).toBe(0);
      });

      it('should rebuild lookups after creation', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        expect(gameState.craftLookup.has(id)).toBe(true);
        expect(gameState.craftLookup.get(id)?.id).toBe(id);
      });

      it('should fire onCraftCreated event', () => {
        let createdID = -1;

        entitySystem.onCraftCreated = (id) => {
          createdID = id;
        };

        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        expect(createdID).toBe(id);
      });

      it('should return -1 if at limit', () => {
        // Create 32 craft (max)
        for (let i = 0; i < EntitySystem.MaxCraft; i++) {
          entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        }

        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        expect(id).toBe(-1);
        expect(gameState.craft.length).toBe(EntitySystem.MaxCraft);
      });

      it('should generate unique names for different craft types', () => {
        entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        entitySystem.createCraft(CraftType.SolarSatellite, 0, FactionType.Player);
        entitySystem.createCraft(CraftType.AtmosphereProcessor, 0, FactionType.Player);

        expect(gameState.craft[0].name).toBe('BC-000');
        expect(gameState.craft[1].name).toBe('CC-001');
        expect(gameState.craft[2].name).toBe('SS-002');
        expect(gameState.craft[3].name).toBe('AP-003');
      });
    });

    describe('destroyCraft', () => {
      it('should destroy craft and return true', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        const destroyed = entitySystem.destroyCraft(id);

        expect(destroyed).toBe(true);
        expect(gameState.craft.length).toBe(0);
      });

      it('should rebuild lookups after destruction', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        entitySystem.destroyCraft(id);

        expect(gameState.craftLookup.has(id)).toBe(false);
      });

      it('should fire onCraftDestroyed event', () => {
        let destroyedID = -1;

        entitySystem.onCraftDestroyed = (id) => {
          destroyedID = id;
        };

        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        entitySystem.destroyCraft(id);

        expect(destroyedID).toBe(id);
      });

      it('should return false if craft not found', () => {
        const destroyed = entitySystem.destroyCraft(999);

        expect(destroyed).toBe(false);
      });
    });

    describe('getCraft', () => {
      it('should return craft by owner', () => {
        entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        entitySystem.createCraft(CraftType.BattleCruiser, 1, FactionType.AI);

        const playerCraft = entitySystem.getCraft(FactionType.Player);
        const aiCraft = entitySystem.getCraft(FactionType.AI);

        expect(playerCraft.length).toBe(2);
        expect(aiCraft.length).toBe(1);
      });
    });

    describe('getCraftAtPlanet', () => {
      it('should return craft at specific planet', () => {
        const id1 = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        const id2 = entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        const id3 = entitySystem.createCraft(CraftType.BattleCruiser, 1, FactionType.Player);

        const craftAtPlanet0 = entitySystem.getCraftAtPlanet(0);
        const craftAtPlanet1 = entitySystem.getCraftAtPlanet(1);

        expect(craftAtPlanet0.length).toBe(2);
        expect(craftAtPlanet1.length).toBe(1);
      });

      it('should exclude craft in transit', () => {
        const id = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        gameState.craft[0].inTransit = true;

        const craftAtPlanet = entitySystem.getCraftAtPlanet(0);

        expect(craftAtPlanet.length).toBe(0);
      });
    });

    describe('getCraftInTransit', () => {
      it('should return craft in transit', () => {
        const id1 = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        const id2 = entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.Player);

        gameState.craft[0].inTransit = true;

        const craftInTransit = entitySystem.getCraftInTransit();

        expect(craftInTransit.length).toBe(1);
        expect(craftInTransit[0].id).toBe(id1);
      });
    });
  });

  describe('Platoon Management', () => {
    describe('canCreatePlatoon', () => {
      it('should return true when under limit', () => {
        expect(entitySystem.canCreatePlatoon()).toBe(true);
      });

      it('should return false when at limit (24)', () => {
        // Create 24 platoons (max)
        for (let i = 0; i < EntitySystem.MaxPlatoons; i++) {
          entitySystem.createPlatoon(0, FactionType.Player);
        }

        expect(entitySystem.canCreatePlatoon()).toBe(false);
      });
    });

    describe('createPlatoon', () => {
      it('should create platoon and return ID', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player);

        expect(id).toBe(0);
        expect(gameState.platoons.length).toBe(1);
        expect(gameState.platoons[0].id).toBe(0);
        expect(gameState.platoons[0].owner).toBe(FactionType.Player);
        expect(gameState.platoons[0].planetID).toBe(0);
      });

      it('should use custom name if provided', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player, 100, 'Alpha Squad');

        expect(gameState.platoons[0].name).toBe('Alpha Squad');
      });

      it('should generate default name if not provided', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player);

        expect(gameState.platoons[0].name).toBe('Platoon-000');
      });

      it('should initialize with custom strength', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player, 250);

        expect(gameState.platoons[0].strength).toBe(250);
      });

      it('should rebuild lookups after creation', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player);

        expect(gameState.platoonLookup.has(id)).toBe(true);
        expect(gameState.platoonLookup.get(id)?.id).toBe(id);
      });

      it('should fire onPlatoonCreated event', () => {
        let createdID = -1;

        entitySystem.onPlatoonCreated = (id) => {
          createdID = id;
        };

        const id = entitySystem.createPlatoon(0, FactionType.Player);

        expect(createdID).toBe(id);
      });

      it('should return -1 if at limit', () => {
        // Create 24 platoons (max)
        for (let i = 0; i < EntitySystem.MaxPlatoons; i++) {
          entitySystem.createPlatoon(0, FactionType.Player);
        }

        const id = entitySystem.createPlatoon(0, FactionType.Player);

        expect(id).toBe(-1);
        expect(gameState.platoons.length).toBe(EntitySystem.MaxPlatoons);
      });
    });

    describe('destroyPlatoon', () => {
      it('should destroy platoon and return true', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player);

        const destroyed = entitySystem.destroyPlatoon(id);

        expect(destroyed).toBe(true);
        expect(gameState.platoons.length).toBe(0);
      });

      it('should rebuild lookups after destruction', () => {
        const id = entitySystem.createPlatoon(0, FactionType.Player);

        entitySystem.destroyPlatoon(id);

        expect(gameState.platoonLookup.has(id)).toBe(false);
      });

      it('should fire onPlatoonDestroyed event', () => {
        let destroyedID = -1;

        entitySystem.onPlatoonDestroyed = (id) => {
          destroyedID = id;
        };

        const id = entitySystem.createPlatoon(0, FactionType.Player);
        entitySystem.destroyPlatoon(id);

        expect(destroyedID).toBe(id);
      });

      it('should return false if platoon not found', () => {
        const destroyed = entitySystem.destroyPlatoon(999);

        expect(destroyed).toBe(false);
      });
    });

    describe('getPlatoons', () => {
      it('should return platoons by owner', () => {
        entitySystem.createPlatoon(0, FactionType.Player);
        entitySystem.createPlatoon(0, FactionType.Player);
        entitySystem.createPlatoon(1, FactionType.AI);

        const playerPlatoons = entitySystem.getPlatoons(FactionType.Player);
        const aiPlatoons = entitySystem.getPlatoons(FactionType.AI);

        expect(playerPlatoons.length).toBe(2);
        expect(aiPlatoons.length).toBe(1);
      });
    });

    describe('getPlatoonsAtPlanet', () => {
      it('should return platoons at specific planet', () => {
        entitySystem.createPlatoon(0, FactionType.Player);
        entitySystem.createPlatoon(0, FactionType.Player);
        entitySystem.createPlatoon(1, FactionType.AI);

        const platoonsAtPlanet0 = entitySystem.getPlatoonsAtPlanet(0);
        const platoonsAtPlanet1 = entitySystem.getPlatoonsAtPlanet(1);

        expect(platoonsAtPlanet0.length).toBe(2);
        expect(platoonsAtPlanet1.length).toBe(1);
      });
    });
  });

  describe('Statistics', () => {
    it('should return total craft count', () => {
      entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.AI);

      expect(entitySystem.getCraftCount()).toBe(2);
    });

    it('should return total platoon count', () => {
      entitySystem.createPlatoon(0, FactionType.Player);
      entitySystem.createPlatoon(0, FactionType.AI);

      expect(entitySystem.getPlatoonCount()).toBe(2);
    });

    it('should return craft count by owner', () => {
      entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      entitySystem.createCraft(CraftType.CargoCruiser, 0, FactionType.AI);

      expect(entitySystem.getCraftCountByOwner(FactionType.Player)).toBe(2);
      expect(entitySystem.getCraftCountByOwner(FactionType.AI)).toBe(1);
    });

    it('should return platoon count by owner', () => {
      entitySystem.createPlatoon(0, FactionType.Player);
      entitySystem.createPlatoon(0, FactionType.Player);
      entitySystem.createPlatoon(0, FactionType.AI);

      expect(entitySystem.getPlatoonCountByOwner(FactionType.Player)).toBe(2);
      expect(entitySystem.getPlatoonCountByOwner(FactionType.AI)).toBe(1);
    });
  });

  describe('Name Generation', () => {
    it('should pad craft IDs with zeros', () => {
      const id1 = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      const id10 = entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);

      // Add 8 more to reach ID=10
      for (let i = 0; i < 8; i++) {
        entitySystem.createCraft(CraftType.BattleCruiser, 0, FactionType.Player);
      }

      expect(gameState.craft[0].name).toBe('BC-000');
      expect(gameState.craft[9].name).toBe('BC-009');
    });

    it('should pad platoon IDs with zeros', () => {
      const id1 = entitySystem.createPlatoon(0, FactionType.Player);

      // Add 9 more to reach ID=10
      for (let i = 0; i < 9; i++) {
        entitySystem.createPlatoon(0, FactionType.Player);
      }

      expect(gameState.platoons[0].name).toBe('Platoon-000');
      expect(gameState.platoons[9].name).toBe('Platoon-009');
    });
  });
});

/**
 * Helper function to create a test game state with 2 planets.
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
  starbase.colonized = true;

  // Enemy planet (AI, Metropolis)
  const enemy = new PlanetEntity();
  enemy.id = 1;
  enemy.name = 'Hitotsu';
  enemy.type = PlanetType.Metropolis;
  enemy.owner = FactionType.AI;
  enemy.position = new Position3D(-100, 0, 0);
  enemy.colonized = true;

  gameState.planets.push(starbase);
  gameState.planets.push(enemy);
  gameState.rebuildLookups();

  return gameState;
}
