import { GameState } from './GameState';
import { ResourceSystem } from './ResourceSystem';
import { ResourceCost } from './models/ResourceModels';
import { FactionType } from './models/Enums';
import { PlanetEntity } from './models/PlanetEntity';

/**
 * Platform-agnostic population management system.
 * Handles population growth, food consumption, and morale.
 */
export class PopulationSystem {
  private readonly gameState: GameState;
  private readonly resourceSystem: ResourceSystem;

  /**
   * Event fired when population changes on a planet.
   * Parameters: (planetID, newPopulation)
   */
  public onPopulationChanged?: (planetID: number, newPopulation: number) => void;

  /**
   * Event fired when morale changes on a planet.
   * Parameters: (planetID, newMorale)
   */
  public onMoraleChanged?: (planetID: number, newMorale: number) => void;

  /**
   * Event fired when a planet is starving (Food = 0).
   * Parameters: (planetID)
   */
  public onStarvation?: (planetID: number) => void;

  /**
   * Event fired when a planet has insufficient food (rationing).
   * Parameters: (planetID)
   */
  public onFoodShortage?: (planetID: number) => void;

  // Constants
  public static readonly MAX_POPULATION = 99999;
  public static readonly FOOD_CONSUMPTION_PER_PERSON = 0.5;
  public static readonly BASE_GROWTH_RATE = 0.05; // 5% at 100% morale

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
   * Updates population for all planets owned by a faction.
   * Executes: Growth → Food Consumption → Morale Update
   * @param faction Faction to update
   */
  public updateFactionPopulation(faction: FactionType): void {
    for (const planet of this.gameState.planets.filter(p => p.owner === faction)) {
      if (!planet.isHabitable || planet.population === 0) {
        continue;
      }

      // 1. Calculate and apply population growth
      this.updatePopulationGrowth(planet);

      // 2. Consume food for population
      this.consumeFoodForPopulation(planet);

      // 3. Update morale based on tax rate and food availability
      this.updateMorale(planet);
    }
  }

  /**
   * Calculates and applies population growth for a planet.
   * @param planet Planet to update
   */
  private updatePopulationGrowth(planet: PlanetEntity): void {
    // No growth if morale is 0 or planet is starving
    if (planet.morale <= 0 || planet.resources.food === 0) {
      planet.growthRate = 0;
      return;
    }

    // Growth formula: Population × (Morale ÷ 100) × 0.05
    const growthRate = (planet.morale / 100.0) * PopulationSystem.BASE_GROWTH_RATE;
    const growthAmount = Math.floor(planet.population * growthRate);

    const oldPopulation = planet.population;
    planet.population = Math.min(
      planet.population + growthAmount,
      PopulationSystem.MAX_POPULATION
    );
    planet.growthRate = growthRate;

    if (planet.population !== oldPopulation) {
      this.onPopulationChanged?.(planet.id, planet.population);
    }
  }

  /**
   * Consumes food for population.
   * @param planet Planet to consume food on
   */
  private consumeFoodForPopulation(planet: PlanetEntity): void {
    const foodRequired = Math.floor(
      planet.population * PopulationSystem.FOOD_CONSUMPTION_PER_PERSON
    );

    if (planet.resources.food >= foodRequired) {
      // Sufficient food - consume normally
      const foodCost = new ResourceCost();
      foodCost.food = foodRequired;
      this.resourceSystem.removeResources(planet.id, foodCost);
    } else {
      // Food shortage or starvation
      const availableFood = planet.resources.food;

      // Consume all available food
      if (availableFood > 0) {
        const foodCost = new ResourceCost();
        foodCost.food = availableFood;
        this.resourceSystem.removeResources(planet.id, foodCost);

        // Rationing (partial food)
        this.onFoodShortage?.(planet.id);
      } else {
        // Starvation (no food at all)
        this.onStarvation?.(planet.id);
      }
    }
  }

  /**
   * Updates morale based on tax rate and food availability.
   * @param planet Planet to update morale on
   */
  private updateMorale(planet: PlanetEntity): void {
    const oldMorale = planet.morale;

    // Tax rate impact
    if (planet.taxRate > 75) {
      planet.morale = Math.max(0, planet.morale - 5); // High taxes penalty
    } else if (planet.taxRate < 25) {
      planet.morale = Math.min(100, planet.morale + 2); // Low taxes bonus
    }

    // Food availability impact
    const foodRequired = Math.floor(
      planet.population * PopulationSystem.FOOD_CONSUMPTION_PER_PERSON
    );

    if (planet.resources.food === 0 && planet.population > 0) {
      // Starvation penalty
      planet.morale = Math.max(0, planet.morale - 10);
    } else if (planet.resources.food < foodRequired) {
      // Rationing penalty
      planet.morale = Math.max(0, planet.morale - 3);
    }

    // Clamp morale to 0-100
    planet.morale = Math.max(0, Math.min(100, planet.morale));

    if (planet.morale !== oldMorale) {
      this.onMoraleChanged?.(planet.id, planet.morale);
    }
  }

  /**
   * Gets the food required for a planet's population.
   * @param planetID Planet ID
   * @returns Food required per turn
   */
  public getFoodRequired(planetID: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    return Math.floor(
      planet.population * PopulationSystem.FOOD_CONSUMPTION_PER_PERSON
    );
  }

  /**
   * Gets the estimated population growth for a planet.
   * @param planetID Planet ID
   * @returns Estimated growth amount per turn
   */
  public getEstimatedGrowth(planetID: number): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    if (planet.morale <= 0) {
      return 0;
    }

    const growthRate = (planet.morale / 100.0) * PopulationSystem.BASE_GROWTH_RATE;
    return Math.floor(planet.population * growthRate);
  }

  /**
   * Gets the morale impact of a tax rate change.
   * @param taxRate Tax rate (0-100)
   * @returns Morale change per turn
   */
  public getTaxRateMoraleImpact(taxRate: number): number {
    if (taxRate > 75) {
      return -5;  // High taxes penalty
    } else if (taxRate < 25) {
      return +2;  // Low taxes bonus
    } else {
      return 0;   // Moderate taxes (no change)
    }
  }
}
