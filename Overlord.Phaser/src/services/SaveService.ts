/**
 * SaveService - Hybrid Cloud/Local Save System
 *
 * Provides cloud-first saves with localStorage fallback.
 * Uses gzip compression for efficient cloud storage.
 */

import pako from 'pako';
import { getSupabaseClient } from './SupabaseClient';
import { getAuthService } from './AuthService';
import { SaveData } from '@core/SaveSystem';

const LOCAL_STORAGE_PREFIX = 'overlord_save_';

/**
 * Metadata for a cloud save (without the full game state data)
 */
export interface CloudSaveMetadata {
  id: string;
  slotName: string;
  saveName: string | null;
  campaignName: string | null;
  turnNumber: number;
  playtime: number;
  version: string;
  victoryStatus: string;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  source: 'cloud' | 'local' | 'both';
}

/**
 * Result of save operations
 */
export interface SaveResult {
  success: boolean;
  error?: string;
  savedTo: 'cloud' | 'local';
}

/**
 * Result of load operations
 */
export interface LoadResult {
  success: boolean;
  error?: string;
  saveData: SaveData | null;
  loadedFrom: 'cloud' | 'local';
}

/**
 * Result of sync operations
 */
export interface SyncResult {
  synced: number;
  errors: string[];
}

/**
 * SaveService singleton class
 * Manages game saves with cloud and local storage
 */
class SaveService {
  private static instance: SaveService | null = null;

  /**
   * Callbacks for save/load events
   */
  public onSaveStarted?: (slotName: string) => void;
  public onSaveCompleted?: (result: SaveResult) => void;
  public onLoadCompleted?: (result: LoadResult) => void;
  public onSyncProgress?: (current: number, total: number) => void;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): SaveService {
    if (!SaveService.instance) {
      SaveService.instance = new SaveService();
    }
    return SaveService.instance;
  }

  /**
   * Save game data to cloud or local storage
   * Cloud-first with localStorage fallback
   *
   * @param saveData - The save data to store
   * @param slotName - Slot identifier (e.g., 'autosave', 'quicksave', 'slot1')
   * @param campaignName - Optional campaign name
   */
  public async saveGame(
    saveData: SaveData,
    slotName: string,
    campaignName?: string,
  ): Promise<SaveResult> {
    this.onSaveStarted?.(slotName);

    const authService = getAuthService();
    const isAuthenticated = authService.isAuthenticated();
    const isOnline = this.isOnline();

    // Try cloud save if authenticated and online
    if (isAuthenticated && isOnline) {
      try {
        await this.saveToCloud(saveData, slotName, campaignName);
        const result: SaveResult = { success: true, savedTo: 'cloud' };
        this.onSaveCompleted?.(result);
        return result;
      } catch (error) {
        console.warn('Cloud save failed, falling back to local:', error);
        // Fall through to local save
      }
    }

    // Fallback to localStorage
    try {
      this.saveToLocal(saveData, slotName);
      const result: SaveResult = { success: true, savedTo: 'local' };
      this.onSaveCompleted?.(result);
      return result;
    } catch (error) {
      const result: SaveResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Save failed',
        savedTo: 'local',
      };
      this.onSaveCompleted?.(result);
      return result;
    }
  }

  /**
   * Load game data from cloud or local storage
   * Cloud-first with localStorage fallback
   *
   * @param slotName - Slot identifier to load
   */
  public async loadGame(slotName: string): Promise<LoadResult> {
    const authService = getAuthService();
    const isAuthenticated = authService.isAuthenticated();
    const isOnline = this.isOnline();

    // Try cloud load if authenticated and online
    if (isAuthenticated && isOnline) {
      try {
        const saveData = await this.loadFromCloud(slotName);
        if (saveData) {
          const result: LoadResult = { success: true, saveData, loadedFrom: 'cloud' };
          this.onLoadCompleted?.(result);
          return result;
        }
      } catch (error) {
        console.warn('Cloud load failed, falling back to local:', error);
        // Fall through to local load
      }
    }

    // Fallback to localStorage
    try {
      const saveData = this.loadFromLocal(slotName);
      if (saveData) {
        const result: LoadResult = { success: true, saveData, loadedFrom: 'local' };
        this.onLoadCompleted?.(result);
        return result;
      }
      return { success: false, error: 'Save not found', saveData: null, loadedFrom: 'local' };
    } catch (error) {
      const result: LoadResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Load failed',
        saveData: null,
        loadedFrom: 'local',
      };
      this.onLoadCompleted?.(result);
      return result;
    }
  }

  /**
   * List all available saves (merged from cloud and local)
   */
  public async listSaves(): Promise<CloudSaveMetadata[]> {
    const cloudSaves = await this.listCloudSaves();
    const localSaves = this.listLocalSaves();

    // Merge saves by slotName
    const saveMap = new Map<string, CloudSaveMetadata>();

    // Add cloud saves first
    for (const save of cloudSaves) {
      saveMap.set(save.slotName, save);
    }

    // Merge local saves
    for (const save of localSaves) {
      const existing = saveMap.get(save.slotName);
      if (existing) {
        // Both cloud and local exist - mark as 'both'
        existing.source = 'both';
        // Use more recent one for display metadata
        if (new Date(save.updatedAt) > new Date(existing.updatedAt)) {
          existing.updatedAt = save.updatedAt;
          existing.turnNumber = save.turnNumber;
          existing.playtime = save.playtime;
        }
      } else {
        // Only local exists
        saveMap.set(save.slotName, save);
      }
    }

    // Sort by updated date (newest first)
    const saves = Array.from(saveMap.values());
    saves.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return saves;
  }

  /**
   * Delete a save from cloud and/or local storage
   *
   * @param slotName - Slot identifier to delete
   */
  public async deleteSave(slotName: string): Promise<{ success: boolean; error?: string }> {
    let cloudDeleted = false;
    let localDeleted = false;
    let error: string | undefined;

    // Try to delete from cloud
    const authService = getAuthService();
    if (authService.isAuthenticated() && this.isOnline()) {
      try {
        await this.deleteFromCloud(slotName);
        cloudDeleted = true;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Cloud delete failed';
      }
    }

    // Delete from local storage
    try {
      this.deleteFromLocal(slotName);
      localDeleted = true;
    } catch (err) {
      if (!error) {
        error = err instanceof Error ? err.message : 'Local delete failed';
      }
    }

    return {
      success: cloudDeleted || localDeleted,
      error: !cloudDeleted && !localDeleted ? error : undefined,
    };
  }

  /**
   * Sync all local saves to cloud
   * Call after login to migrate existing saves
   */
  public async syncLocalSavesToCloud(): Promise<SyncResult> {
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return { synced: 0, errors: ['Not authenticated or offline'] };
    }

    const localSaves = this.listLocalSaves();
    let synced = 0;
    const errors: string[] = [];

    for (let i = 0; i < localSaves.length; i++) {
      this.onSyncProgress?.(i + 1, localSaves.length);

      const metadata = localSaves[i];
      try {
        const saveData = this.loadFromLocal(metadata.slotName);
        if (saveData) {
          await this.saveToCloud(saveData, metadata.slotName, metadata.campaignName ?? undefined);
          synced++;
        }
      } catch (error) {
        const errorMsg = `Failed to sync ${metadata.slotName}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    return { synced, errors };
  }

  // ============================================
  // Cloud Storage Operations
  // ============================================

  /**
   * Save to Supabase cloud storage
   */
  private async saveToCloud(
    saveData: SaveData,
    slotName: string,
    campaignName?: string,
  ): Promise<void> {
    const supabase = getSupabaseClient();
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Compress save data
    const compressedData = this.compressData(saveData);
    const checksum = await this.generateChecksum(JSON.stringify(saveData));

    // Upsert (insert or update based on user_id + slot_name)
    const saveRecord = {
      user_id: userId,
      slot_name: slotName,
      save_name: saveData.saveName ?? null,
      campaign_name: campaignName ?? null,
      data: compressedData,
      checksum,
      turn_number: saveData.turnNumber,
      playtime: saveData.playtime,
      version: saveData.version,
      victory_status: saveData.victoryStatus,
      thumbnail: saveData.thumbnail ?? null,
    };

    const { error } = await supabase
      .from('saves')
      .upsert(saveRecord as any, { onConflict: 'user_id,slot_name' });

    if (error) {
      throw new Error(`Cloud save failed: ${error.message}`);
    }
  }

  /**
   * Load from Supabase cloud storage
   */
  private async loadFromCloud(slotName: string): Promise<SaveData | null> {
    const supabase = getSupabaseClient();
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('saves')
      .select('data, checksum')
      .eq('user_id', userId)
      .eq('slot_name', slotName)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - save doesn't exist
        return null;
      }
      throw new Error(`Cloud load failed: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Cast data to expected shape
    const saveRow = data as unknown as { data: Uint8Array; checksum: string | null };

    // Decompress save data
    const saveData = this.decompressData(saveRow.data);

    // Verify checksum if available
    if (saveRow.checksum) {
      const computedChecksum = await this.generateChecksum(JSON.stringify(saveData));
      if (computedChecksum !== saveRow.checksum) {
        console.warn('Save checksum mismatch - data may be corrupted');
      }
    }

    return saveData;
  }

  /**
   * List all cloud saves for current user
   */
  private async listCloudSaves(): Promise<CloudSaveMetadata[]> {
    const authService = getAuthService();
    if (!authService.isAuthenticated() || !this.isOnline()) {
      return [];
    }

    const supabase = getSupabaseClient();
    const userId = authService.getUserId();

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('saves')
      .select(
        'id, slot_name, save_name, campaign_name, turn_number, playtime, version, victory_status, thumbnail, created_at, updated_at',
      )
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to list cloud saves:', error);
      return [];
    }

    // Cast data to expected shape
    type SaveRow = {
      id: string;
      slot_name: string;
      save_name: string | null;
      campaign_name: string | null;
      turn_number: number;
      playtime: number;
      version: string;
      victory_status: string;
      thumbnail: string | null;
      created_at: string;
      updated_at: string;
    };
    const rows = (data || []) as unknown as SaveRow[];

    return rows.map((row) => ({
      id: row.id,
      slotName: row.slot_name,
      saveName: row.save_name,
      campaignName: row.campaign_name,
      turnNumber: row.turn_number,
      playtime: row.playtime,
      version: row.version,
      victoryStatus: row.victory_status,
      thumbnail: row.thumbnail,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      source: 'cloud' as const,
    }));
  }

  /**
   * Delete from cloud storage
   */
  private async deleteFromCloud(slotName: string): Promise<void> {
    const supabase = getSupabaseClient();
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      throw new Error('Not authenticated');
    }

    const { error } = await supabase
      .from('saves')
      .delete()
      .eq('user_id', userId)
      .eq('slot_name', slotName);

    if (error) {
      throw new Error(`Cloud delete failed: ${error.message}`);
    }
  }

  // ============================================
  // Local Storage Operations
  // ============================================

  /**
   * Save to localStorage
   */
  private saveToLocal(saveData: SaveData, slotName: string): void {
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage not available');
    }

    const json = JSON.stringify(saveData, this.jsonReplacer);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${slotName}`, json);
  }

  /**
   * Load from localStorage
   */
  private loadFromLocal(slotName: string): SaveData | null {
    if (typeof localStorage === 'undefined') {
      throw new Error('localStorage not available');
    }

    const json = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${slotName}`);
    if (!json) {
      return null;
    }

    return JSON.parse(json, this.jsonReviver) as SaveData;
  }

  /**
   * List all local saves
   */
  private listLocalSaves(): CloudSaveMetadata[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    const saves: CloudSaveMetadata[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LOCAL_STORAGE_PREFIX)) {
        try {
          const json = localStorage.getItem(key);
          if (json) {
            const saveData = JSON.parse(json, this.jsonReviver) as SaveData;
            const slotName = key.substring(LOCAL_STORAGE_PREFIX.length);

            saves.push({
              id: `local-${slotName}`,
              slotName,
              saveName: saveData.saveName ?? null,
              campaignName: null, // Local saves don't track campaign name separately
              turnNumber: saveData.turnNumber,
              playtime: saveData.playtime,
              version: saveData.version,
              victoryStatus: saveData.victoryStatus,
              thumbnail: saveData.thumbnail ?? null,
              createdAt: saveData.savedAt,
              updatedAt: saveData.savedAt,
              source: 'local',
            });
          }
        } catch (error) {
          console.warn(`Failed to parse local save ${key}:`, error);
        }
      }
    }

    return saves;
  }

  /**
   * Delete from localStorage
   */
  private deleteFromLocal(slotName: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${slotName}`);
    }
  }

  // ============================================
  // Compression & Checksum
  // ============================================

  /**
   * Compress save data using gzip
   */
  private compressData(saveData: SaveData): Uint8Array {
    const json = JSON.stringify(saveData, this.jsonReplacer);
    return pako.gzip(json);
  }

  /**
   * Decompress save data from gzip
   */
  private decompressData(compressed: Uint8Array): SaveData {
    // Handle if data is a regular array (from Supabase BYTEA)
    const uint8 =
      compressed instanceof Uint8Array ? compressed : new Uint8Array(compressed as number[]);

    const json = pako.ungzip(uint8, { to: 'string' });
    return JSON.parse(json, this.jsonReviver) as SaveData;
  }

  /**
   * Generate SHA-256 checksum
   */
  private async generateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Check if browser is online
   */
  private isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /**
   * JSON replacer for handling Date objects and Maps
   */
  private jsonReplacer(_key: string, value: unknown): unknown {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (value instanceof Map) {
      return undefined; // Maps will be rebuilt
    }
    return value;
  }

  /**
   * JSON reviver for handling Date objects
   */
  private jsonReviver(key: string, value: unknown): unknown {
    if (key === 'lastActionTime' || key === 'savedAt') {
      return new Date(value as string);
    }
    return value;
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    SaveService.instance = null;
  }
}

/**
 * Get the SaveService singleton instance
 */
export function getSaveService(): SaveService {
  return SaveService.getInstance();
}

export { SaveService };
