import { GameState } from './GameState';
import { ResourceDelta, ResourceCost, ResourceType, ResourceLevel, ResourceCollection } from './models/ResourceModels';
import { FactionType } from './models/Enums';

/**
 * Platform-agnostic resource management system.
 * Handles resource operations, validation, and critical resource monitoring.
 */
export class ResourceSystem {
  private readonly gameState: GameState;

  /**
   * Event fired when resources change on a planet.
   * Parameters: (planetID, delta)
   */
  public onResourcesChanged?: (planetID: number, delta: ResourceDelta) => void;

  /**
   * Event fired when a resource falls below critical threshold.
   * Parameters: (planetID, resourceType)
   */
  public onResourceCritical?: (planetID: number, resourceType: ResourceType) => void;

  /**
   * Critical resource threshold (red alert).
   */
  public static readonly CRITICAL_THRESHOLD = 100;

  /**
   * Warning resource threshold (yellow warning).
   */
  public static readonly WARNING_THRESHOLD = 500;

  /**
   * Cargo capacity per resource type per cargo cruiser.
   */
  public static readonly CARGO_CAPACITY = 1000;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    this.gameState = gameState;
  }

  /**
   * Adds resources to a planet. Clamps to non-negative values.
   * @param planetID Planet ID to add resources to
   * @param delta Resource delta (can be positive or negative)
   * @returns True if successful, false if planet not found
   */
  public addResources(planetID: number, delta: ResourceDelta): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    planet.resources.add(delta);

    // Clamp to non-negative
    planet.resources.credits = Math.max(0, planet.resources.credits);
    planet.resources.minerals = Math.max(0, planet.resources.minerals);
    planet.resources.fuel = Math.max(0, planet.resources.fuel);
    planet.resources.food = Math.max(0, planet.resources.food);
    planet.resources.energy = Math.max(0, planet.resources.energy);

    this.onResourcesChanged?.(planetID, delta);
    this.checkCriticalResources(planetID);

    return true;
  }

  /**
   * Removes resources from a planet (for purchases/construction).
   * @param planetID Planet ID to remove resources from
   * @param cost Resource cost
   * @returns True if successful, false if insufficient resources or planet not found
   */
  public removeResources(planetID: number, cost: ResourceCost): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    if (!planet.resources.canAfford(cost)) {
      return false; // Cannot afford
    }

    planet.resources.subtract(cost);

    const delta = cost.toDelta(); // Converts to negative delta
    this.onResourcesChanged?.(planetID, delta);
    this.checkCriticalResources(planetID);

    return true;
  }

  /**
   * Checks if a planet can afford a cost.
   * @param planetID Planet ID
   * @param cost Resource cost
   * @returns True if planet can afford the cost
   */
  public canAfford(planetID: number, cost: ResourceCost): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    return planet.resources.canAfford(cost);
  }

  /**
   * Gets the total resources across all planets owned by a faction.
   * @param faction Faction to calculate total for
   * @returns Total resources across all faction planets
   */
  public getTotalResources(faction: FactionType): ResourceCollection {
    const total = new ResourceCollection();

    for (const planet of this.gameState.planets.filter(p => p.owner === faction)) {
      total.credits += planet.resources.credits;
      total.minerals += planet.resources.minerals;
      total.fuel += planet.resources.fuel;
      total.food += planet.resources.food;
      total.energy += planet.resources.energy;
    }

    return total;
  }

  /**
   * Checks if a resource is at warning or critical levels.
   * @param planetID Planet ID
   * @param resourceType Resource type to check
   * @returns ResourceLevel indicating the status
   */
  public getResourceLevel(planetID: number, resourceType: ResourceType): ResourceLevel {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return ResourceLevel.Unknown;
    }

    let amount: number;
    switch (resourceType) {
      case ResourceType.Food:
        amount = planet.resources.food;
        break;
      case ResourceType.Minerals:
        amount = planet.resources.minerals;
        break;
      case ResourceType.Fuel:
        amount = planet.resources.fuel;
        break;
      case ResourceType.Energy:
        amount = planet.resources.energy;
        break;
      case ResourceType.Credits:
        amount = planet.resources.credits;
        break;
      default:
        amount = 0;
    }

    if (amount < ResourceSystem.CRITICAL_THRESHOLD) {
      return ResourceLevel.Critical;
    }
    if (amount < ResourceSystem.WARNING_THRESHOLD) {
      return ResourceLevel.Warning;
    }

    return ResourceLevel.Normal;
  }

  /**
   * Gets the current amount of a specific resource on a planet.
   * @param planetID Planet ID
   * @param resourceType Resource type
   * @returns Amount of the resource, or 0 if planet not found
   */
  public getResourceAmount(planetID: number, resourceType: ResourceType): number {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return 0;
    }

    switch (resourceType) {
      case ResourceType.Food:
        return planet.resources.food;
      case ResourceType.Minerals:
        return planet.resources.minerals;
      case ResourceType.Fuel:
        return planet.resources.fuel;
      case ResourceType.Energy:
        return planet.resources.energy;
      case ResourceType.Credits:
        return planet.resources.credits;
      default:
        return 0;
    }
  }

  /**
   * Sets the amount of a specific resource on a planet (for testing/cheats).
   * @param planetID Planet ID
   * @param resourceType Resource type
   * @param amount New amount (clamped to non-negative)
   * @returns True if successful, false if planet not found
   */
  public setResourceAmount(planetID: number, resourceType: ResourceType, amount: number): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    amount = Math.max(0, amount);

    switch (resourceType) {
      case ResourceType.Food:
        planet.resources.food = amount;
        break;
      case ResourceType.Minerals:
        planet.resources.minerals = amount;
        break;
      case ResourceType.Fuel:
        planet.resources.fuel = amount;
        break;
      case ResourceType.Energy:
        planet.resources.energy = amount;
        break;
      case ResourceType.Credits:
        planet.resources.credits = amount;
        break;
    }

    this.checkCriticalResources(planetID);
    return true;
  }

  /**
   * Checks for critical resource levels and fires events.
   * @param planetID Planet ID to check
   */
  private checkCriticalResources(planetID: number): void {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return;
    }

    // Only check for owned planets (not neutral)
    if (planet.owner === FactionType.Neutral) {
      return;
    }

    // Check each resource type
    if (planet.resources.food < ResourceSystem.CRITICAL_THRESHOLD) {
      this.onResourceCritical?.(planetID, ResourceType.Food);
    }

    if (planet.resources.fuel < ResourceSystem.CRITICAL_THRESHOLD) {
      this.onResourceCritical?.(planetID, ResourceType.Fuel);
    }

    if (planet.resources.minerals < ResourceSystem.CRITICAL_THRESHOLD) {
      this.onResourceCritical?.(planetID, ResourceType.Minerals);
    }

    if (planet.resources.energy < ResourceSystem.CRITICAL_THRESHOLD) {
      this.onResourceCritical?.(planetID, ResourceType.Energy);
    }

    if (planet.resources.credits < ResourceSystem.CRITICAL_THRESHOLD) {
      this.onResourceCritical?.(planetID, ResourceType.Credits);
    }
  }
}
