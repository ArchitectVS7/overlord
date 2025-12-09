import { CraftType } from './Enums';
import { ResourceCost } from './ResourceModels';

/**
 * Craft costs for each craft type.
 */
export class CraftCosts {
  /**
   * Battle Cruiser cost.
   */
  public static get BattleCruiser(): ResourceCost {
    const cost = new ResourceCost();
    cost.credits = 50000;
    cost.minerals = 10000;
    cost.fuel = 5000;
    cost.food = 0;
    cost.energy = 0;
    return cost;
  }

  /**
   * Cargo Cruiser cost.
   */
  public static get CargoCruiser(): ResourceCost {
    const cost = new ResourceCost();
    cost.credits = 30000;
    cost.minerals = 5000;
    cost.fuel = 3000;
    cost.food = 0;
    cost.energy = 0;
    return cost;
  }

  /**
   * Solar Satellite cost.
   */
  public static get SolarSatellite(): ResourceCost {
    const cost = new ResourceCost();
    cost.credits = 15000;
    cost.minerals = 3000;
    cost.fuel = 1000;
    cost.food = 0;
    cost.energy = 0;
    return cost;
  }

  /**
   * Atmosphere Processor cost.
   */
  public static get AtmosphereProcessor(): ResourceCost {
    const cost = new ResourceCost();
    cost.credits = 10000;
    cost.minerals = 5000;
    cost.fuel = 2000;
    cost.food = 0;
    cost.energy = 0;
    return cost;
  }

  /**
   * Gets the cost for a specific craft type.
   */
  public static getCost(type: CraftType): ResourceCost {
    switch (type) {
      case CraftType.BattleCruiser:
        return CraftCosts.BattleCruiser;
      case CraftType.CargoCruiser:
        return CraftCosts.CargoCruiser;
      case CraftType.SolarSatellite:
        return CraftCosts.SolarSatellite;
      case CraftType.AtmosphereProcessor:
        return CraftCosts.AtmosphereProcessor;
      default:
        return ResourceCost.zero;
    }
  }
}

/**
 * Craft crew requirements.
 */
export class CraftCrewRequirements {
  public static readonly BattleCruiser: number = 50;
  public static readonly CargoCruiser: number = 30;
  public static readonly SolarSatellite: number = 5;
  public static readonly AtmosphereProcessor: number = 20;

  /**
   * Gets the crew requirement for a specific craft type.
   */
  public static getCrewRequired(type: CraftType): number {
    switch (type) {
      case CraftType.BattleCruiser:
        return CraftCrewRequirements.BattleCruiser;
      case CraftType.CargoCruiser:
        return CraftCrewRequirements.CargoCruiser;
      case CraftType.SolarSatellite:
        return CraftCrewRequirements.SolarSatellite;
      case CraftType.AtmosphereProcessor:
        return CraftCrewRequirements.AtmosphereProcessor;
      default:
        return 0;
    }
  }
}

/**
 * Craft specifications (speed, capacity, etc.).
 */
export class CraftSpecs {
  public speed: number = 0;                // Units per turn
  public fuelConsumptionRate: number = 0;  // Fuel per distance unit
  public platoonCapacity: number = 0;      // Max platoons (Battle Cruiser only)
  public cargoCapacity: number = 0;        // Max cargo per resource (Cargo Cruiser only)
  public energyProduction: number = 0;     // Energy per turn (Solar Satellite only)
  public terraformingDuration: number = 0; // Turns to terraform (Atmosphere Processor only)

  /**
   * Gets the specifications for a specific craft type.
   */
  public static getSpecs(type: CraftType): CraftSpecs {
    const specs = new CraftSpecs();

    switch (type) {
      case CraftType.BattleCruiser:
        specs.speed = 50;
        specs.fuelConsumptionRate = 10; // 1 Fuel per 10 units
        specs.platoonCapacity = 4;
        break;

      case CraftType.CargoCruiser:
        specs.speed = 30;
        specs.fuelConsumptionRate = 5; // 1 Fuel per 5 units (less efficient)
        specs.cargoCapacity = 1000;
        break;

      case CraftType.SolarSatellite:
        specs.speed = 0; // Stationary once deployed
        specs.fuelConsumptionRate = 0;
        specs.energyProduction = 80;
        break;

      case CraftType.AtmosphereProcessor:
        specs.speed = 30;
        specs.fuelConsumptionRate = 5; // 1 Fuel per 5 units
        specs.terraformingDuration = 10; // 10 turns to complete
        break;
    }

    return specs;
  }
}
