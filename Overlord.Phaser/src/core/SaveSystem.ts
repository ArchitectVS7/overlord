import { GameState } from './GameState';
import { VictoryResult } from './models/Enums';

/**
 * Save data metadata and game state snapshot.
 */
export interface SaveData {
  version: string;           // Game version (e.g., "0.1.0")
  savedAt: string;           // ISO timestamp
  turnNumber: number;        // Current turn
  playtime: number;          // Total playtime in seconds
  gameState: GameState;      // Full game state
  thumbnail?: string;        // Optional base64 PNG
  saveName?: string;         // Optional player-defined name
  victoryStatus: VictoryResult; // Victory/defeat status
  checksum?: string;         // Optional checksum for validation
}

/**
 * Platform-agnostic save/load system using JSON.
 * Simplified version without compression (can be added later with pako).
 */
export class SaveSystem {
  private readonly gameState: GameState;

  /**
   * Event fired when a save operation completes successfully.
   */
  public onSaveCompleted?: (saveData: SaveData) => void;

  /**
   * Event fired when a load operation completes successfully.
   */
  public onLoadCompleted?: (saveData: SaveData) => void;

  /**
   * Event fired when a save or load operation fails.
   */
  public onSaveLoadError?: (error: Error) => void;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    this.gameState = gameState;
  }

  /**
   * Creates a save data snapshot of the current game state.
   * @param version Game version string (e.g., "0.1.0")
   * @param playtime Total playtime in seconds
   * @param saveName Optional player-defined save name
   * @param thumbnail Optional base64-encoded PNG thumbnail
   * @returns SaveData with metadata
   */
  public createSaveData(
    version: string,
    playtime: number,
    saveName?: string,
    thumbnail?: string,
  ): SaveData {
    const saveData: SaveData = {
      version,
      savedAt: new Date().toISOString(),
      turnNumber: this.gameState.currentTurn,
      playtime,
      gameState: this.cloneGameState(this.gameState),
      thumbnail,
      saveName,
      victoryStatus: VictoryResult.None,
    };

    return saveData;
  }

  /**
   * Serializes save data to JSON string.
   * @param saveData Save data to serialize
   * @returns JSON string
   */
  public serialize(saveData: SaveData): string {
    try {
      const json = JSON.stringify(saveData, this.jsonReplacer);

      this.onSaveCompleted?.(saveData);

      return json;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.onSaveLoadError?.(err);
      throw err;
    }
  }

  /**
   * Deserializes save data from JSON string.
   * @param json JSON string
   * @returns Deserialized save data
   */
  public deserialize(json: string): SaveData {
    try {
      const saveData = JSON.parse(json, this.jsonReviver) as SaveData;

      if (!saveData) {
        throw new Error('Deserialization returned null');
      }

      this.onLoadCompleted?.(saveData);

      return saveData;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.onSaveLoadError?.(err);
      throw err;
    }
  }

  /**
   * Applies loaded save data to the game state.
   * Rebuilds lookup dictionaries after loading.
   * @param saveData Save data to apply
   */
  public applyToGameState(saveData: SaveData): void {
    // Copy properties from save data to game state
    this.gameState.currentTurn = saveData.gameState.currentTurn;
    this.gameState.currentPhase = saveData.gameState.currentPhase;
    this.gameState.lastActionTime = new Date(saveData.gameState.lastActionTime);
    this.gameState.planets = saveData.gameState.planets;

    // Rebuild lookups after loading
    this.gameState.rebuildLookups();
  }

  /**
   * Saves to browser localStorage.
   * @param slotName Save slot name (e.g., "autosave", "quicksave", "slot1")
   * @param version Game version
   * @param playtime Playtime in seconds
   * @param saveName Optional player-defined name
   */
  public saveToLocalStorage(
    slotName: string,
    version: string,
    playtime: number,
    saveName?: string,
  ): void {
    const saveData = this.createSaveData(version, playtime, saveName);
    const json = this.serialize(saveData);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`overlord_save_${slotName}`, json);
    } else {
      throw new Error('localStorage not available');
    }
  }

  /**
   * Loads from browser localStorage.
   * @param slotName Save slot name
   * @returns SaveData if found, null otherwise
   */
  public loadFromLocalStorage(slotName: string): SaveData | null {
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage not available');
    }

    const json = localStorage.getItem(`overlord_save_${slotName}`);

    if (!json) {
      return null;
    }

    const saveData = this.deserialize(json);
    this.applyToGameState(saveData);

    return saveData;
  }

  /**
   * Deletes a save from localStorage.
   * @param slotName Save slot name
   */
  public deleteSave(slotName: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`overlord_save_${slotName}`);
    }
  }

  /**
   * Lists all available saves in localStorage.
   * @returns Array of save slot names
   */
  public listSaves(): string[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const saves: string[] = [];
    const prefix = 'overlord_save_';

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        saves.push(key.substring(prefix.length));
      }
    }

    return saves;
  }

  /**
   * Deep clones game state for saving.
   */
  private cloneGameState(state: GameState): GameState {
    const cloned = new GameState();
    cloned.currentTurn = state.currentTurn;
    cloned.currentPhase = state.currentPhase;
    cloned.lastActionTime = new Date(state.lastActionTime);
    cloned.planets = JSON.parse(JSON.stringify(state.planets));
    return cloned;
  }

  /**
   * JSON replacer for handling Date objects.
   */
  private jsonReplacer(_key: string, value: any): any {
    if (value instanceof Date) {
      return value.toISOString();
    }
    // Skip Map objects (will be rebuilt from arrays)
    if (value instanceof Map) {
      return undefined;
    }
    return value;
  }

  /**
   * JSON reviver for handling Date objects.
   */
  private jsonReviver(_key: string, value: any): any {
    // Restore Date objects
    if (_key === 'lastActionTime' || _key === 'savedAt') {
      return new Date(value);
    }
    return value;
  }
}
