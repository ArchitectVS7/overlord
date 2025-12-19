/**
 * ScenarioPackManager
 * Story 9-1: Scenario Pack Browsing and Selection
 *
 * Manages scenario packs including registration, selection,
 * validation, and persistence of active pack selection.
 */

import {
  ScenarioPack,
  PackDisplayData,
  UnlockRequirement,
  createPackDisplayData,
} from './models/ScenarioPackModels';

const STORAGE_KEY = 'overlord_active_pack';
const UNLOCKED_REQUIREMENTS_KEY = 'overlord_unlocked_requirements';

/**
 * Manages scenario pack registration, selection, and validation
 */
export class ScenarioPackManager {
  private packs: Map<string, ScenarioPack> = new Map();
  private activePackId: string | null = null;
  private unlockedRequirements: Set<string> = new Set();

  constructor() {
    this.loadUnlockedRequirements();
  }

  /**
   * Register a scenario pack
   */
  registerPack(pack: ScenarioPack): void {
    if (this.packs.has(pack.id)) {
      return; // Don't register duplicates
    }
    this.packs.set(pack.id, pack);
  }

  /**
   * Get all registered packs
   */
  getAllPacks(): ScenarioPack[] {
    return Array.from(this.packs.values());
  }

  /**
   * Get pack by ID
   */
  getPackById(id: string): ScenarioPack | undefined {
    return this.packs.get(id);
  }

  /**
   * Get the default pack
   */
  getDefaultPack(): ScenarioPack | undefined {
    return this.getAllPacks().find(p => p.isDefault);
  }

  /**
   * Set the active pack
   * @returns true if pack was set, false if pack doesn't exist or is locked
   */
  setActivePack(packId: string): boolean {
    const pack = this.packs.get(packId);
    if (!pack) {
      return false;
    }

    // Check if pack is locked
    if (this.isPackLocked(packId)) {
      return false;
    }

    this.activePackId = packId;
    this.saveActivePackToStorage();
    return true;
  }

  /**
   * Get the currently active pack
   */
  getActivePack(): ScenarioPack | undefined {
    if (this.activePackId) {
      return this.packs.get(this.activePackId);
    }
    return this.getDefaultPack();
  }

  /**
   * Reset to the default pack
   */
  resetToDefault(): void {
    const defaultPack = this.getDefaultPack();
    if (defaultPack) {
      this.activePackId = defaultPack.id;
      this.saveActivePackToStorage();
    }
  }

  /**
   * Load active pack selection from storage
   */
  loadActivePackFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && this.packs.has(stored) && !this.isPackLocked(stored)) {
        this.activePackId = stored;
      } else {
        // Fall back to default
        this.resetToDefault();
      }
    } catch {
      this.resetToDefault();
    }
  }

  /**
   * Save active pack to storage
   */
  private saveActivePackToStorage(): void {
    try {
      if (this.activePackId) {
        localStorage.setItem(STORAGE_KEY, this.activePackId);
      }
    } catch {
      // Silently fail if localStorage unavailable
    }
  }

  /**
   * Check if a pack is locked
   */
  isPackLocked(packId: string): boolean {
    const pack = this.packs.get(packId);
    if (!pack || !pack.unlockRequirements || pack.unlockRequirements.length === 0) {
      return false;
    }

    // Check if all requirements are met
    return !pack.unlockRequirements.every(req =>
      this.isRequirementMet(req),
    );
  }

  /**
   * Check if a specific requirement is met
   */
  private isRequirementMet(req: UnlockRequirement): boolean {
    const key = `${req.type}:${req.targetId}`;
    return this.unlockedRequirements.has(key);
  }

  /**
   * Get unlock requirements for a pack
   */
  getUnlockRequirements(packId: string): UnlockRequirement[] {
    const pack = this.packs.get(packId);
    return pack?.unlockRequirements || [];
  }

  /**
   * Mark a requirement as complete (unlocked)
   */
  markRequirementComplete(type: UnlockRequirement['type'], targetId: string): void {
    const key = `${type}:${targetId}`;
    this.unlockedRequirements.add(key);
    this.saveUnlockedRequirements();
  }

  /**
   * Load unlocked requirements from storage
   */
  private loadUnlockedRequirements(): void {
    try {
      const stored = localStorage.getItem(UNLOCKED_REQUIREMENTS_KEY);
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          this.unlockedRequirements = new Set(arr);
        }
      }
    } catch {
      // Start with empty set
    }
  }

  /**
   * Save unlocked requirements to storage
   */
  private saveUnlockedRequirements(): void {
    try {
      const arr = Array.from(this.unlockedRequirements);
      localStorage.setItem(UNLOCKED_REQUIREMENTS_KEY, JSON.stringify(arr));
    } catch {
      // Silently fail
    }
  }

  /**
   * Get display data for all packs
   */
  getPackDisplayData(): PackDisplayData[] {
    const activePack = this.getActivePack();

    return this.getAllPacks().map(pack =>
      createPackDisplayData(
        pack,
        this.isPackLocked(pack.id),
        activePack?.id === pack.id,
      ),
    );
  }

  /**
   * Validate a pack against the schema
   */
  validatePack(pack: ScenarioPack): boolean {
    // Required fields check
    if (!pack.id || !pack.name || !pack.version || !pack.description) {
      return false;
    }

    if (!pack.faction || !pack.faction.name || !pack.faction.leader || !pack.faction.lore) {
      return false;
    }

    if (!pack.aiConfig || pack.aiConfig.personality === undefined || pack.aiConfig.difficulty === undefined) {
      return false;
    }

    if (!pack.galaxyTemplate || !pack.galaxyTemplate.planetCount || !pack.galaxyTemplate.resourceAbundance) {
      return false;
    }

    // Planet count validation
    const { min, max } = pack.galaxyTemplate.planetCount;
    if (typeof min !== 'number' || typeof max !== 'number' || min > max || min < 1) {
      return false;
    }

    return true;
  }
}

// Singleton instance
let managerInstance: ScenarioPackManager | null = null;

/**
 * Get the singleton ScenarioPackManager instance
 */
export function getPackManager(): ScenarioPackManager {
  if (!managerInstance) {
    managerInstance = new ScenarioPackManager();
  }
  return managerInstance;
}

/**
 * Reset the singleton instance (for testing)
 */
export function resetPackManager(): void {
  managerInstance = null;
}
