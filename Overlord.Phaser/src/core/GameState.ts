import { PlanetEntity } from './models/PlanetEntity';
import { CraftEntity } from './models/CraftEntity';
import { PlatoonEntity } from './models/PlatoonEntity';
import { TurnPhase } from './models/Enums';
import { ResourceCollection } from './models/ResourceModels';
import { CampaignConfig } from './models/CampaignConfig';

/**
 * Faction state for player and AI.
 */
export class FactionState {
  public ownedPlanetIDs: number[] = [];
  public militaryStrength: number = 0;
  public resources: ResourceCollection = new ResourceCollection();
}

/**
 * Central game state container.
 * Phase 2: Added planetLookup for O(1) access to planets by ID
 * Phase 3: Added turn tracking (currentPhase, lastActionTime)
 * Phase 4: Added craft and platoons with lookup maps
 */
export class GameState {
  public currentTurn: number = 1;
  public currentPhase: TurnPhase = TurnPhase.Action;
  public lastActionTime: Date = new Date();
  public campaignConfig?: CampaignConfig;
  public planets: PlanetEntity[] = [];
  public craft: CraftEntity[] = [];
  public platoons: PlatoonEntity[] = [];

  // Faction states
  public playerFaction: FactionState = new FactionState();
  public aiFaction: FactionState = new FactionState();

  // O(1) lookup maps (rebuilt after deserialization)
  public planetLookup: Map<number, PlanetEntity> = new Map();
  public craftLookup: Map<number, CraftEntity> = new Map();
  public platoonLookup: Map<number, PlatoonEntity> = new Map();

  /**
   * Rebuild all lookup maps from the entity arrays.
   * Call this after loading a save or modifying the entity arrays.
   */
  public rebuildLookups(): void {
    this.planetLookup.clear();
    for (const planet of this.planets) {
      this.planetLookup.set(planet.id, planet);
    }

    this.craftLookup.clear();
    for (const craftEntity of this.craft) {
      this.craftLookup.set(craftEntity.id, craftEntity);
    }

    this.platoonLookup.clear();
    for (const platoon of this.platoons) {
      this.platoonLookup.set(platoon.id, platoon);
    }
  }

  /**
   * Validate game state for consistency.
   * Returns true if state is valid, false otherwise.
   */
  public validate(): boolean {
    // Max 6 planets
    if (this.planets.length > 6) {
      return false;
    }

    // Turn must be positive
    if (this.currentTurn < 1) {
      return false;
    }

    // Check for duplicate planet IDs
    const ids = this.planets.map(p => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      return false;
    }

    return true;
  }
}
