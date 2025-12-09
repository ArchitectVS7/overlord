import { BuildingType, BuildingStatus } from './Enums';
import { ResourceCost } from './ResourceModels';

/**
 * Represents a structure on a planet.
 */
export class Structure {
  public id: number = 0;
  public type: BuildingType = BuildingType.SurfacePlatform;
  public status: BuildingStatus = BuildingStatus.UnderConstruction;
  public turnsRemaining: number = 0; // For construction/repair
}

/**
 * Building costs for construction.
 */
export class BuildingCosts {
  /**
   * Gets the construction cost for a building type.
   */
  public static getCost(type: BuildingType): ResourceCost {
    const cost = new ResourceCost();

    switch (type) {
      case BuildingType.DockingBay:
        cost.credits = 5000;
        cost.minerals = 1000;
        cost.fuel = 500;
        break;

      case BuildingType.SurfacePlatform:
        cost.credits = 2000;
        cost.minerals = 500;
        cost.fuel = 0;
        break;

      case BuildingType.MiningStation:
        cost.credits = 8000;
        cost.minerals = 2000;
        cost.fuel = 1000;
        break;

      case BuildingType.HorticulturalStation:
        cost.credits = 6000;
        cost.minerals = 1500;
        cost.fuel = 800;
        break;

      case BuildingType.OrbitalDefense:
        cost.credits = 12000;
        cost.minerals = 3000;
        cost.fuel = 2000;
        break;

      default:
        return ResourceCost.zero;
    }

    return cost;
  }

  /**
   * Gets the construction time in turns.
   */
  public static getConstructionTime(type: BuildingType): number {
    switch (type) {
      case BuildingType.DockingBay:
        return 2;
      case BuildingType.SurfacePlatform:
        return 1;
      case BuildingType.MiningStation:
        return 3;
      case BuildingType.HorticulturalStation:
        return 2;
      case BuildingType.OrbitalDefense:
        return 3;
      default:
        return 1;
    }
  }

  /**
   * Gets the crew requirement for a building type.
   */
  public static getCrewRequirement(type: BuildingType): number {
    switch (type) {
      case BuildingType.MiningStation:
        return 15;
      case BuildingType.HorticulturalStation:
        return 10;
      default:
        return 0;
    }
  }
}
