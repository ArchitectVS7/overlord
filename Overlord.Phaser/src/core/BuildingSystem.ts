import { GameState } from './GameState';
import { BuildingType, BuildingStatus, FactionType } from './models/Enums';
import { Structure, BuildingCosts } from './models/BuildingModels';
import { ResourceDelta } from './models/ResourceModels';

/**
 * Platform-agnostic building construction system.
 * Manages building construction, completion, scrapping, and planet capacity limits.
 */
export class BuildingSystem {
  private readonly gameState: GameState;
  private nextStructureID: number = 0;

  /**
   * Event fired when building construction starts.
   * Parameters: (planetID, buildingType)
   */
  public onBuildingStarted?: (planetID: number, buildingType: BuildingType) => void;

  /**
   * Event fired when building construction completes.
   * Parameters: (planetID, buildingType)
   */
  public onBuildingCompleted?: (planetID: number, buildingType: BuildingType) => void;

  /**
   * Event fired when a building is scrapped.
   * Parameters: (planetID, buildingType)
   */
  public onBuildingScrapped?: (planetID: number, buildingType: BuildingType) => void;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }

    this.gameState = gameState;

    // Initialize next structure ID based on existing structures
    for (const planet of this.gameState.planets) {
      if (planet.structures.length > 0) {
        const maxID = Math.max(...planet.structures.map(s => s.id));
        if (maxID >= this.nextStructureID) {
          this.nextStructureID = maxID + 1;
        }
      }
    }
  }

  /**
   * Starts construction of a building on a planet.
   * @param planetID Planet ID
   * @param buildingType Building type to construct
   * @returns True if construction started, false if failed
   */
  public startConstruction(planetID: number, buildingType: BuildingType): boolean {
    // Get planet
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    // Validate capacity
    if (!this.canBuild(planetID, buildingType)) {
      return false; // Planet at maximum capacity
    }

    // Get cost and construction time
    const cost = BuildingCosts.getCost(buildingType);
    const constructionTime = BuildingCosts.getConstructionTime(buildingType);

    // Determine faction resource pool
    let factionResources;
    if (planet.owner === FactionType.Player) {
      factionResources = this.gameState.playerFaction.resources;
    } else if (planet.owner === FactionType.AI) {
      factionResources = this.gameState.aiFaction.resources;
    } else {
      return false; // Cannot build on neutral/other planets
    }

    // Validate resources
    if (!factionResources.canAfford(cost)) {
      return false; // Insufficient resources
    }

    // Deduct cost
    factionResources.subtract(cost);

    // Create building entity
    const building = new Structure();
    building.id = this.nextStructureID++;
    building.type = buildingType;
    building.status = BuildingStatus.UnderConstruction;
    building.turnsRemaining = constructionTime;

    planet.structures.push(building);

    this.onBuildingStarted?.(planetID, buildingType);
    return true;
  }

  /**
   * Updates construction progress for all buildings (called each turn during Income Phase).
   */
  public updateConstruction(): void {
    for (const planet of this.gameState.planets) {
      const underConstructionBuildings = planet.structures.filter(
        s => s.status === BuildingStatus.UnderConstruction && s.turnsRemaining > 0,
      );

      for (const building of underConstructionBuildings) {
        // Decrement turns
        building.turnsRemaining--;

        // Complete construction
        if (building.turnsRemaining <= 0) {
          building.status = BuildingStatus.Active;
          this.onBuildingCompleted?.(planet.id, building.type);
        }
      }
    }
  }

  /**
   * Scraps a building (destroys it, refunds 50% cost).
   * @param planetID Planet ID
   * @param buildingID Building ID
   * @returns True if scrapped, false if failed
   */
  public scrapBuilding(planetID: number, buildingID: number): boolean {
    // Get planet
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    // Find building
    const buildingIndex = planet.structures.findIndex(s => s.id === buildingID);
    if (buildingIndex === -1) {
      return false;
    }

    const building = planet.structures[buildingIndex];

    // Refund 50% of cost
    const cost = BuildingCosts.getCost(building.type);
    const refund = new ResourceDelta();
    refund.credits = Math.floor(cost.credits / 2);
    refund.minerals = Math.floor(cost.minerals / 2);
    refund.fuel = Math.floor(cost.fuel / 2);
    refund.food = 0;
    refund.energy = 0;

    planet.resources.add(refund);

    // Remove building
    planet.structures.splice(buildingIndex, 1);

    this.onBuildingScrapped?.(planetID, building.type);
    return true;
  }

  /**
   * Checks if a building can be built on a planet (validates capacity only).
   * @param planetID Planet ID
   * @param buildingType Building type
   * @returns True if can build, false if capacity limit reached
   */
  public canBuild(planetID: number, buildingType: BuildingType): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    switch (buildingType) {
      case BuildingType.DockingBay:
        return planet.canBuildDockingBay();
      case BuildingType.SurfacePlatform:
        return planet.canBuildSurfaceStructure();
      case BuildingType.MiningStation:
        return planet.canBuildSurfaceStructure();
      case BuildingType.HorticulturalStation:
        return planet.canBuildSurfaceStructure();
      case BuildingType.OrbitalDefense:
        return planet.canBuildDockingBay(); // Orbital defense uses orbital slot
      default:
        return false;
    }
  }

  /**
   * Gets all buildings on a planet.
   * @param planetID Planet ID
   * @returns List of structures
   */
  public getBuildings(planetID: number): Structure[] {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return [];
    }

    return [...planet.structures];
  }

  /**
   * Gets all buildings under construction on a planet.
   * @param planetID Planet ID
   * @returns List of structures under construction
   */
  public getBuildingsUnderConstruction(planetID: number): Structure[] {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return [];
    }

    return planet.structures.filter(s => s.status === BuildingStatus.UnderConstruction);
  }

  /**
   * Gets all active buildings on a planet.
   * @param planetID Planet ID
   * @returns List of active structures
   */
  public getActiveBuildings(planetID: number): Structure[] {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return [];
    }

    return planet.structures.filter(s => s.status === BuildingStatus.Active);
  }

  /**
   * Gets building count by type on a planet.
   * @param planetID Planet ID
   * @param buildingType Building type
   * @returns Count of buildings of this type
   */
  public getBuildingCount(planetID: number, buildingType: BuildingType): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    return planet.structures.filter(s => s.type === buildingType && s.status === BuildingStatus.Active).length;
  }

  /**
   * Checks if a planet can afford a building (resources check).
   * @param planetID Planet ID
   * @param buildingType Building type
   * @returns True if affordable, false otherwise
   */
  public canAffordBuilding(planetID: number, buildingType: BuildingType): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    const cost = BuildingCosts.getCost(buildingType);
    return planet.resources.canAfford(cost);
  }
}
