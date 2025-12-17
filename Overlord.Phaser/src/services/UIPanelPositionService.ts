/**
 * UIPanelPositionService - UI Panel Position Management
 *
 * Fetches, caches, and saves panel positions to Supabase.
 * Positions are global defaults that apply to all users.
 */

import { getSupabaseClient } from './SupabaseClient';
import { getAuthService } from './AuthService';

/**
 * Panel position data structure
 */
export interface PanelPosition {
  sceneName: string;
  panelId: string;
  x: number;
  y: number;
  defaultX?: number;
  defaultY?: number;
}

/**
 * Result of position operations
 */
export interface PositionResult {
  success: boolean;
  error?: string;
}

/**
 * UIPanelPositionService singleton class
 * Manages panel position storage and retrieval
 */
class UIPanelPositionService {
  private static instance: UIPanelPositionService | null = null;
  private positionCache: Map<string, Map<string, PanelPosition>> = new Map();
  private cacheLoaded: boolean = false;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): UIPanelPositionService {
    if (!UIPanelPositionService.instance) {
      UIPanelPositionService.instance = new UIPanelPositionService();
    }
    return UIPanelPositionService.instance;
  }

  /**
   * Refresh the entire position cache from database
   */
  public async refreshCache(): Promise<void> {
    const supabase = getSupabaseClient();

    try {
      // Use type assertion since table may not be in Database interface yet
      const { data, error } = await (supabase
        .from('ui_panel_positions') as any)
        .select('*');

      if (error) {
        console.error('Failed to fetch panel positions:', error);
        return;
      }

      // Clear and rebuild cache
      this.positionCache.clear();

      // Type for position row from database
      type PositionRow = {
        scene_name: string;
        panel_id: string;
        x: number;
        y: number;
        default_x: number | null;
        default_y: number | null;
      };

      if (data) {
        for (const row of data as PositionRow[]) {
          const position: PanelPosition = {
            sceneName: row.scene_name,
            panelId: row.panel_id,
            x: row.x,
            y: row.y,
            defaultX: row.default_x ?? undefined,
            defaultY: row.default_y ?? undefined,
          };

          // Get or create scene map
          let sceneMap = this.positionCache.get(position.sceneName);
          if (!sceneMap) {
            sceneMap = new Map();
            this.positionCache.set(position.sceneName, sceneMap);
          }

          sceneMap.set(position.panelId, position);
        }
      }

      this.cacheLoaded = true;
      console.log(`Loaded ${data?.length ?? 0} panel positions from database`);
    } catch (error) {
      console.error('Error refreshing position cache:', error);
    }
  }

  /**
   * Get all positions for a scene
   * Uses cache if available, otherwise fetches from database
   */
  public async getPositionsForScene(sceneName: string): Promise<Map<string, PanelPosition>> {
    // Ensure cache is loaded
    if (!this.cacheLoaded) {
      await this.refreshCache();
    }

    const sceneMap = this.positionCache.get(sceneName);
    return sceneMap ?? new Map();
  }

  /**
   * Get a specific panel's position
   * Returns null if no stored position exists
   */
  public async getPosition(sceneName: string, panelId: string): Promise<PanelPosition | null> {
    // Ensure cache is loaded
    if (!this.cacheLoaded) {
      await this.refreshCache();
    }

    const sceneMap = this.positionCache.get(sceneName);
    if (!sceneMap) {
      return null;
    }

    return sceneMap.get(panelId) ?? null;
  }

  /**
   * Save a single panel position (admin only)
   */
  public async savePosition(position: PanelPosition): Promise<PositionResult> {
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = getSupabaseClient();

    try {
      // Upsert the position (insert or update)
      // Use type assertion since table may not be in Database interface yet
      const { error } = await (supabase
        .from('ui_panel_positions') as any)
        .upsert(
          {
            scene_name: position.sceneName,
            panel_id: position.panelId,
            x: position.x,
            y: position.y,
            default_x: position.defaultX ?? null,
            default_y: position.defaultY ?? null,
            modified_by: userId,
          },
          {
            onConflict: 'scene_name,panel_id',
          }
        );

      if (error) {
        console.error('Failed to save panel position:', error);
        return { success: false, error: error.message };
      }

      // Update cache
      let sceneMap = this.positionCache.get(position.sceneName);
      if (!sceneMap) {
        sceneMap = new Map();
        this.positionCache.set(position.sceneName, sceneMap);
      }
      sceneMap.set(position.panelId, position);

      return { success: true };
    } catch (error) {
      console.error('Error saving panel position:', error);
      return { success: false, error: 'Failed to save position' };
    }
  }

  /**
   * Save multiple panel positions at once (admin only)
   */
  public async saveAllPositions(positions: PanelPosition[]): Promise<PositionResult> {
    if (positions.length === 0) {
      return { success: true };
    }

    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = getSupabaseClient();

    try {
      // Prepare data for upsert
      const upsertData = positions.map((pos) => ({
        scene_name: pos.sceneName,
        panel_id: pos.panelId,
        x: pos.x,
        y: pos.y,
        default_x: pos.defaultX ?? null,
        default_y: pos.defaultY ?? null,
        modified_by: userId,
      }));

      // Use type assertion since table may not be in Database interface yet
      const { error } = await (supabase
        .from('ui_panel_positions') as any)
        .upsert(upsertData, {
          onConflict: 'scene_name,panel_id',
        });

      if (error) {
        console.error('Failed to save panel positions:', error);
        return { success: false, error: error.message };
      }

      // Update cache
      for (const position of positions) {
        let sceneMap = this.positionCache.get(position.sceneName);
        if (!sceneMap) {
          sceneMap = new Map();
          this.positionCache.set(position.sceneName, sceneMap);
        }
        sceneMap.set(position.panelId, position);
      }

      console.log(`Saved ${positions.length} panel positions`);
      return { success: true };
    } catch (error) {
      console.error('Error saving panel positions:', error);
      return { success: false, error: 'Failed to save positions' };
    }
  }

  /**
   * Reset a panel to its default position (delete from database)
   */
  public async resetPosition(sceneName: string, panelId: string): Promise<PositionResult> {
    const supabase = getSupabaseClient();

    try {
      // Use type assertion since table may not be in Database interface yet
      const { error } = await (supabase
        .from('ui_panel_positions') as any)
        .delete()
        .eq('scene_name', sceneName)
        .eq('panel_id', panelId);

      if (error) {
        console.error('Failed to reset panel position:', error);
        return { success: false, error: error.message };
      }

      // Remove from cache
      const sceneMap = this.positionCache.get(sceneName);
      if (sceneMap) {
        sceneMap.delete(panelId);
      }

      return { success: true };
    } catch (error) {
      console.error('Error resetting panel position:', error);
      return { success: false, error: 'Failed to reset position' };
    }
  }

  /**
   * Reset all positions for a scene (delete from database)
   */
  public async resetScenePositions(sceneName: string): Promise<PositionResult> {
    const supabase = getSupabaseClient();

    try {
      // Use type assertion since table may not be in Database interface yet
      const { error } = await (supabase
        .from('ui_panel_positions') as any)
        .delete()
        .eq('scene_name', sceneName);

      if (error) {
        console.error('Failed to reset scene positions:', error);
        return { success: false, error: error.message };
      }

      // Remove scene from cache
      this.positionCache.delete(sceneName);

      return { success: true };
    } catch (error) {
      console.error('Error resetting scene positions:', error);
      return { success: false, error: 'Failed to reset positions' };
    }
  }

  /**
   * Reset all positions across all scenes
   */
  public async resetAllPositions(): Promise<PositionResult> {
    const supabase = getSupabaseClient();

    try {
      // Delete all positions (RLS will ensure only admins can do this)
      // Use type assertion since table may not be in Database interface yet
      const { error } = await (supabase
        .from('ui_panel_positions') as any)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) {
        console.error('Failed to reset all positions:', error);
        return { success: false, error: error.message };
      }

      // Clear entire cache
      this.positionCache.clear();

      return { success: true };
    } catch (error) {
      console.error('Error resetting all positions:', error);
      return { success: false, error: 'Failed to reset positions' };
    }
  }

  /**
   * Clear the position cache
   */
  public clearCache(): void {
    this.positionCache.clear();
    this.cacheLoaded = false;
  }

  /**
   * Check if cache has been loaded
   */
  public isCacheLoaded(): boolean {
    return this.cacheLoaded;
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (UIPanelPositionService.instance) {
      UIPanelPositionService.instance.positionCache.clear();
      UIPanelPositionService.instance.cacheLoaded = false;
    }
    UIPanelPositionService.instance = null;
  }
}

/**
 * Get the UIPanelPositionService singleton instance
 */
export function getUIPanelPositionService(): UIPanelPositionService {
  return UIPanelPositionService.getInstance();
}

export { UIPanelPositionService };
