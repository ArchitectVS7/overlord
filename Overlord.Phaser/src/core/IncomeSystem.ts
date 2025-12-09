import { GameState } from './GameState';
import { ResourceSystem } from './ResourceSystem';
import { FactionType, BuildingType, BuildingStatus, CraftType } from './models/Enums';
import { ResourceDelta } from './models/ResourceModels';
import { PlanetEntity } from './models/PlanetEntity';

/**
 * Platform-agnostic income/production system.
 * Calculates resource production from buildings and applies planet multipliers.
 */
export class IncomeSystem {
  private readonly gameState: GameState;
  private readonly resourceSystem: ResourceSystem;

  /**
   * Event fired when income is calculated for a planet.
   * Parameters: (planetID, income)
   */
  public onIncomeCalculated?: (planetID: number, income: ResourceDelta) => void;

  /**
   * Event fired when buildings are inactive due to insufficient crew.
   * Parameters: (planetID, inactiveCount)
   */
  public onInsufficientCrew?: (planetID: number, inactiveCount: number) => void;

  // Base production rates (per turn, per building)
  public static readonly BaseFoodProduction: number = 100; // Horticultural Station
  public static readonly BaseMineralProduction: number = 50; // Mining Station
  public static readonly BaseFuelProduction: number = 30; // Mining Station
  public static readonly BaseEnergyProduction: number = 80; // Solar Satellite

  // Crew requirements
  public static readonly HorticulturalCrewRequired: number = 10;
  public static readonly MiningCrewRequired: number = 15;
  public static readonly SolarSatelliteCrewRequired: number = 5;

  constructor(gameState: GameState, resourceSystem: ResourceSystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!resourceSystem) {
      throw new Error('resourceSystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.resourceSystem = resourceSystem;
  }

  /**
   * Calculates income for all planets owned by a faction.
   * @param faction Faction to calculate income for
   * @returns Total income delta across all faction planets
   */
  public calculateFactionIncome(faction: FactionType): ResourceDelta {
    const totalIncome = new ResourceDelta();

    const factionPlanets = this.gameState.planets.filter(p => p.owner === faction);

    for (const planet of factionPlanets) {
      const planetIncome = this.calculatePlanetIncome(planet.id);

      totalIncome.food += planetIncome.food;
      totalIncome.minerals += planetIncome.minerals;
      totalIncome.fuel += planetIncome.fuel;
      totalIncome.energy += planetIncome.energy;
      totalIncome.credits += planetIncome.credits;

      // Add income to planet resources
      this.resourceSystem.addResources(planet.id, planetIncome);

      // Fire event
      this.onIncomeCalculated?.(planet.id, planetIncome);
    }

    return totalIncome;
  }

  /**
   * Calculates income for a single planet.
   * @param planetID Planet ID
   * @returns Resource delta for the planet
   */
  public calculatePlanetIncome(planetID: number): ResourceDelta {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return new ResourceDelta();
    }

    // Uninhabited planets produce nothing
    if (!planet.isHabitable) {
      return new ResourceDelta();
    }

    // Allocate crew to buildings (sets Active/Inactive status)
    this.allocateCrew(planet);

    // Get planet multipliers
    const multipliers = planet.resourceMultipliers;

    // Calculate production from each building type
    const income = new ResourceDelta();
    income.food = this.calculateFoodProduction(planet, multipliers.food);
    income.minerals = this.calculateMineralProduction(planet, multipliers.minerals);
    income.fuel = this.calculateFuelProduction(planet, multipliers.fuel);
    income.energy = this.calculateEnergyProduction(planet, multipliers.energy);

    return income;
  }

  /**
   * Allocates crew to buildings based on priority.
   * Priority: Food → Minerals/Fuel → Energy
   * @param planet Planet to allocate crew on
   */
  private allocateCrew(planet: PlanetEntity): void {
    let availableCrew = planet.population;
    let inactiveCount = 0;

    // Priority 1: Horticultural Stations (Food production)
    const horticulturalStations = planet.structures.filter(
      s => s.type === BuildingType.HorticulturalStation
    );

    for (const station of horticulturalStations) {
      if (availableCrew >= IncomeSystem.HorticulturalCrewRequired) {
        station.status = BuildingStatus.Active;
        availableCrew -= IncomeSystem.HorticulturalCrewRequired;
      } else {
        station.status = BuildingStatus.Damaged; // Using Damaged to indicate inactive due to crew shortage
        inactiveCount++;
      }
    }

    // Priority 2: Mining Stations (Minerals + Fuel production)
    const miningStations = planet.structures.filter(s => s.type === BuildingType.MiningStation);

    for (const station of miningStations) {
      if (availableCrew >= IncomeSystem.MiningCrewRequired) {
        station.status = BuildingStatus.Active;
        availableCrew -= IncomeSystem.MiningCrewRequired;
      } else {
        station.status = BuildingStatus.Damaged;
        inactiveCount++;
      }
    }

    // Priority 3: Solar Satellites (Energy production)
    // Note: Solar Satellites are deployed craft, not structures
    const solarSatellites = this.gameState.craft.filter(
      c => c.planetID === planet.id && c.type === CraftType.SolarSatellite
    );

    for (const satellite of solarSatellites) {
      if (availableCrew >= IncomeSystem.SolarSatelliteCrewRequired) {
        satellite.active = true;
        availableCrew -= IncomeSystem.SolarSatelliteCrewRequired;
      } else {
        satellite.active = false;
        inactiveCount++;
      }
    }

    // Fire event if buildings are inactive due to crew shortage
    if (inactiveCount > 0) {
      this.onInsufficientCrew?.(planet.id, inactiveCount);
    }
  }

  /**
   * Calculates Food production from Horticultural Stations.
   */
  private calculateFoodProduction(planet: PlanetEntity, multiplier: number): number {
    const activeStations = planet.structures.filter(
      s => s.type === BuildingType.HorticulturalStation && s.status === BuildingStatus.Active
    ).length;

    return Math.floor(activeStations * IncomeSystem.BaseFoodProduction * multiplier);
  }

  /**
   * Calculates Mineral production from Mining Stations.
   */
  private calculateMineralProduction(planet: PlanetEntity, multiplier: number): number {
    const activeStations = planet.structures.filter(
      s => s.type === BuildingType.MiningStation && s.status === BuildingStatus.Active
    ).length;

    return Math.floor(activeStations * IncomeSystem.BaseMineralProduction * multiplier);
  }

  /**
   * Calculates Fuel production from Mining Stations.
   */
  private calculateFuelProduction(planet: PlanetEntity, multiplier: number): number {
    const activeStations = planet.structures.filter(
      s => s.type === BuildingType.MiningStation && s.status === BuildingStatus.Active
    ).length;

    return Math.floor(activeStations * IncomeSystem.BaseFuelProduction * multiplier);
  }

  /**
   * Calculates Energy production from Solar Satellites.
   * Note: Solar Satellites are deployed craft, not structures.
   */
  private calculateEnergyProduction(planet: PlanetEntity, multiplier: number): number {
    const activeSatellites = this.gameState.craft.filter(
      c => c.planetID === planet.id && c.type === CraftType.SolarSatellite && c.active
    ).length;

    return Math.floor(activeSatellites * IncomeSystem.BaseEnergyProduction * multiplier);
  }

  /**
   * Gets the crew allocation for a planet (for UI display).
   * @param planetID Planet ID
   * @returns Tuple of (used crew, total population)
   */
  public getCrewAllocation(planetID: number): { usedCrew: number; totalPopulation: number } {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return { usedCrew: 0, totalPopulation: 0 };
    }

    let usedCrew = 0;

    // Count active Horticultural Stations
    usedCrew +=
      planet.structures.filter(
        s => s.type === BuildingType.HorticulturalStation && s.status === BuildingStatus.Active
      ).length * IncomeSystem.HorticulturalCrewRequired;

    // Count active Mining Stations
    usedCrew +=
      planet.structures.filter(
        s => s.type === BuildingType.MiningStation && s.status === BuildingStatus.Active
      ).length * IncomeSystem.MiningCrewRequired;

    // Count active Solar Satellites
    usedCrew +=
      this.gameState.craft.filter(
        c => c.planetID === planet.id && c.type === CraftType.SolarSatellite && c.active
      ).length * IncomeSystem.SolarSatelliteCrewRequired;

    return { usedCrew, totalPopulation: planet.population };
  }

  /**
   * Generates an income report for a planet (for UI display).
   * @param planetID Planet ID
   * @returns Income report string
   */
  public generateIncomeReport(planetID: number): string {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 'Planet not found';
    }

    const income = this.calculatePlanetIncome(planetID);
    const multipliers = planet.resourceMultipliers;

    let report = `${planet.name} Income:\n`;

    // Food
    const horticulturalActive = planet.structures.filter(
      s => s.type === BuildingType.HorticulturalStation && s.status === BuildingStatus.Active
    ).length;
    if (horticulturalActive > 0) {
      report += `  +${income.food} Food (${horticulturalActive} Horticultural × ${multipliers.food.toFixed(1)})\n`;
    }

    // Minerals
    const miningActive = planet.structures.filter(
      s => s.type === BuildingType.MiningStation && s.status === BuildingStatus.Active
    ).length;
    if (miningActive > 0) {
      report += `  +${income.minerals} Minerals (${miningActive} Mining × ${multipliers.minerals.toFixed(1)})\n`;
    }

    // Fuel
    if (miningActive > 0) {
      report += `  +${income.fuel} Fuel (${miningActive} Mining × ${multipliers.fuel.toFixed(1)})\n`;
    }

    // Energy (when Solar Satellites implemented)
    if (income.energy > 0) {
      report += `  +${income.energy} Energy\n`;
    }

    return report;
  }
}
