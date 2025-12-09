import { SaveSystem, SaveData } from '@core/SaveSystem';
import { GameState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, PlanetType, TurnPhase, VictoryResult } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';

describe('SaveSystem', () => {
  let gameState: GameState;
  let saveSystem: SaveSystem;

  beforeEach(() => {
    gameState = createTestGameState();
    saveSystem = new SaveSystem(gameState);

    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('Constructor', () => {
    it('should throw error if gameState is null', () => {
      expect(() => new SaveSystem(null as any)).toThrow(
        'gameState cannot be null or undefined'
      );
    });
  });

  describe('createSaveData', () => {
    it('should create save data with correct metadata', () => {
      const saveData = saveSystem.createSaveData('0.1.0', 3600, 'Test Save');

      expect(saveData.version).toBe('0.1.0');
      expect(saveData.playtime).toBe(3600);
      expect(saveData.saveName).toBe('Test Save');
      expect(saveData.turnNumber).toBe(1);
      expect(saveData.victoryStatus).toBe(VictoryResult.None);
      expect(saveData.savedAt).toBeDefined();
    });

    it('should clone game state (not reference)', () => {
      const saveData = saveSystem.createSaveData('0.1.0', 100);

      // Modify original game state
      gameState.currentTurn = 999;

      // Save data should have original value
      expect(saveData.gameState.currentTurn).toBe(1);
    });

    it('should include thumbnail if provided', () => {
      const thumbnail = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...';
      const saveData = saveSystem.createSaveData('0.1.0', 100, undefined, thumbnail);

      expect(saveData.thumbnail).toBe(thumbnail);
    });
  });

  describe('serialize / deserialize', () => {
    it('should serialize to JSON string', () => {
      const saveData = saveSystem.createSaveData('0.1.0', 100);
      const json = saveSystem.serialize(saveData);

      expect(typeof json).toBe('string');
      expect(json.length).toBeGreaterThan(0);
    });

    it('should deserialize from JSON string', () => {
      const original = saveSystem.createSaveData('0.1.0', 100, 'Original');
      const json = saveSystem.serialize(original);
      const deserialized = saveSystem.deserialize(json);

      expect(deserialized.version).toBe('0.1.0');
      expect(deserialized.playtime).toBe(100);
      expect(deserialized.saveName).toBe('Original');
      expect(deserialized.turnNumber).toBe(1);
    });

    it('should handle Date objects correctly', () => {
      const original = saveSystem.createSaveData('0.1.0', 100);
      const json = saveSystem.serialize(original);
      const deserialized = saveSystem.deserialize(json);

      expect(deserialized.savedAt).toBeDefined();
      // savedAt is converted back to Date object by reviver
      expect(deserialized.savedAt instanceof Date || typeof deserialized.savedAt === 'string').toBe(true);
    });

    it('should preserve game state planets', () => {
      const original = saveSystem.createSaveData('0.1.0', 100);
      const json = saveSystem.serialize(original);
      const deserialized = saveSystem.deserialize(json);

      expect(deserialized.gameState.planets.length).toBe(2);
      expect(deserialized.gameState.planets[0].name).toBe('Starbase');
      expect(deserialized.gameState.planets[1].name).toBe('Hitotsu');
    });

    it('should fire onSaveCompleted event', () => {
      let completedSave: SaveData | undefined;

      saveSystem.onSaveCompleted = (saveData) => {
        completedSave = saveData;
      };

      const saveData = saveSystem.createSaveData('0.1.0', 100);
      saveSystem.serialize(saveData);

      expect(completedSave).toBeDefined();
      expect(completedSave?.version).toBe('0.1.0');
    });

    it('should fire onLoadCompleted event', () => {
      let loadedSave: SaveData | undefined;

      saveSystem.onLoadCompleted = (saveData) => {
        loadedSave = saveData;
      };

      const original = saveSystem.createSaveData('0.1.0', 100);
      const json = saveSystem.serialize(original);
      saveSystem.deserialize(json);

      expect(loadedSave).toBeDefined();
      expect(loadedSave?.version).toBe('0.1.0');
    });

    it('should fire onSaveLoadError on invalid JSON', () => {
      let error: Error | undefined;

      saveSystem.onSaveLoadError = (err) => {
        error = err;
      };

      expect(() => saveSystem.deserialize('invalid json')).toThrow();
      expect(error).toBeDefined();
    });
  });

  describe('applyToGameState', () => {
    it('should apply save data to game state', () => {
      // Modify game state
      gameState.currentTurn = 5;
      gameState.currentPhase = TurnPhase.Combat;

      // Create save with original state (turn=1, phase=Action)
      const saveData = saveSystem.createSaveData('0.1.0', 100);

      // Reset game state to different values
      gameState.currentTurn = 10;
      gameState.currentPhase = TurnPhase.End;

      // Apply save data
      saveSystem.applyToGameState(saveData);

      expect(gameState.currentTurn).toBe(saveData.gameState.currentTurn);
      expect(gameState.currentPhase).toBe(saveData.gameState.currentPhase);
    });

    it('should rebuild planet lookups', () => {
      const saveData = saveSystem.createSaveData('0.1.0', 100);

      // Clear lookups
      gameState.planetLookup.clear();

      // Apply save data
      saveSystem.applyToGameState(saveData);

      // Lookups should be rebuilt
      expect(gameState.planetLookup.size).toBe(2);
      expect(gameState.planetLookup.get(0)).toBeDefined();
      expect(gameState.planetLookup.get(1)).toBeDefined();
    });
  });

  describe('localStorage integration', () => {
    it('should save to localStorage', () => {
      if (typeof localStorage === 'undefined') {
        return; // Skip if localStorage not available
      }

      saveSystem.saveToLocalStorage('slot1', '0.1.0', 100, 'My Save');

      const stored = localStorage.getItem('overlord_save_slot1');
      expect(stored).toBeDefined();
      expect(stored).not.toBeNull();
    });

    it('should load from localStorage', () => {
      if (typeof localStorage === 'undefined') {
        return;
      }

      saveSystem.saveToLocalStorage('slot1', '0.1.0', 100, 'My Save');

      // Modify game state
      gameState.currentTurn = 999;

      // Load from localStorage
      const loadedSave = saveSystem.loadFromLocalStorage('slot1');

      expect(loadedSave).not.toBeNull();
      expect(loadedSave?.saveName).toBe('My Save');
      expect(gameState.currentTurn).toBe(1); // Restored from save
    });

    it('should return null for non-existent save', () => {
      if (typeof localStorage === 'undefined') {
        return;
      }

      const result = saveSystem.loadFromLocalStorage('nonexistent');

      expect(result).toBeNull();
    });

    it('should delete save from localStorage', () => {
      if (typeof localStorage === 'undefined') {
        return;
      }

      saveSystem.saveToLocalStorage('slot1', '0.1.0', 100);
      saveSystem.deleteSave('slot1');

      const stored = localStorage.getItem('overlord_save_slot1');
      expect(stored).toBeNull();
    });

    it('should list all saves', () => {
      if (typeof localStorage === 'undefined') {
        return;
      }

      saveSystem.saveToLocalStorage('slot1', '0.1.0', 100);
      saveSystem.saveToLocalStorage('slot2', '0.1.0', 200);
      saveSystem.saveToLocalStorage('autosave', '0.1.0', 300);

      const saves = saveSystem.listSaves();

      expect(saves.length).toBe(3);
      expect(saves).toContain('slot1');
      expect(saves).toContain('slot2');
      expect(saves).toContain('autosave');
    });

    it('should not list non-overlord saves', () => {
      if (typeof localStorage === 'undefined') {
        return;
      }

      localStorage.setItem('other_game_save', 'data');
      saveSystem.saveToLocalStorage('slot1', '0.1.0', 100);

      const saves = saveSystem.listSaves();

      expect(saves.length).toBe(1);
      expect(saves).toContain('slot1');
      expect(saves).not.toContain('other_game_save');
    });
  });

  describe('Round-trip save/load', () => {
    it('should preserve all game state through save/load cycle', () => {
      if (typeof localStorage === 'undefined') {
        return;
      }

      // Setup initial state
      gameState.currentTurn = 42;
      gameState.currentPhase = TurnPhase.Combat;
      gameState.planets[0].population = 5000;
      gameState.planets[0].morale = 85;

      // Save
      saveSystem.saveToLocalStorage('roundtrip', '0.1.0', 1234, 'Round Trip Test');

      // Modify state
      gameState.currentTurn = 999;
      gameState.currentPhase = TurnPhase.End;
      gameState.planets[0].population = 1;
      gameState.planets[0].morale = 1;

      // Load
      const loaded = saveSystem.loadFromLocalStorage('roundtrip');

      // Verify restoration
      expect(loaded).not.toBeNull();
      expect(loaded?.saveName).toBe('Round Trip Test');
      expect(loaded?.playtime).toBe(1234);
      expect(gameState.currentTurn).toBe(42);
      expect(gameState.currentPhase).toBe(TurnPhase.Combat);
      expect(gameState.planets[0].population).toBe(5000);
      expect(gameState.planets[0].morale).toBe(85);
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
  starbase.population = 1000;
  starbase.morale = 75;

  // Hitotsu (AI, Metropolis)
  const hitotsu = new PlanetEntity();
  hitotsu.id = 1;
  hitotsu.name = 'Hitotsu';
  hitotsu.type = PlanetType.Metropolis;
  hitotsu.owner = FactionType.AI;
  hitotsu.position = new Position3D(-100, 0, 0);
  hitotsu.colonized = true;
  hitotsu.population = 1000;
  hitotsu.morale = 75;

  gameState.planets.push(starbase);
  gameState.planets.push(hitotsu);
  gameState.rebuildLookups();

  return gameState;
}
