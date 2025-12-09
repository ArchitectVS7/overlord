/**
 * Resource types in the game economy.
 */
export enum ResourceType {
  Food = 'Food',         // Feeds population, required for growth
  Minerals = 'Minerals', // Building material for structures and craft
  Fuel = 'Fuel',         // Powers craft movement and construction
  Energy = 'Energy',     // Powers structures and systems
  Credits = 'Credits'    // Currency for purchases
}

/**
 * Resource level status (for warnings and alerts).
 */
export enum ResourceLevel {
  Unknown = 'Unknown',   // Planet not found
  Normal = 'Normal',     // >= 500
  Warning = 'Warning',   // 100-499 (yellow warning)
  Critical = 'Critical'  // < 100 (red alert)
}

/**
 * Collection of resources on a planet.
 */
export class ResourceCollection {
  public credits: number = 0;
  public minerals: number = 0;
  public fuel: number = 0;
  public food: number = 0;
  public energy: number = 0;

  /**
   * Adds resources from a delta.
   */
  public add(delta: ResourceDelta): void {
    this.credits += delta.credits;
    this.minerals += delta.minerals;
    this.fuel += delta.fuel;
    this.food += delta.food;
    this.energy += delta.energy;
  }

  /**
   * Subtracts resources (spending). Clamps to non-negative values.
   */
  public subtract(cost: ResourceCost): void {
    this.credits = Math.max(0, this.credits - cost.credits);
    this.minerals = Math.max(0, this.minerals - cost.minerals);
    this.fuel = Math.max(0, this.fuel - cost.fuel);
    this.food = Math.max(0, this.food - cost.food);
    this.energy = Math.max(0, this.energy - cost.energy);
  }

  /**
   * Checks if this collection can afford a delta (all values would remain non-negative).
   */
  public canAffordDelta(delta: ResourceDelta): boolean {
    return this.credits + delta.credits >= 0 &&
           this.minerals + delta.minerals >= 0 &&
           this.fuel + delta.fuel >= 0 &&
           this.food + delta.food >= 0 &&
           this.energy + delta.energy >= 0;
  }

  /**
   * Checks if this collection can afford a cost.
   */
  public canAfford(cost: ResourceCost): boolean {
    return this.credits >= cost.credits &&
           this.minerals >= cost.minerals &&
           this.fuel >= cost.fuel &&
           this.food >= cost.food &&
           this.energy >= cost.energy;
  }
}

/**
 * Represents a change in resources (can be positive or negative).
 */
export class ResourceDelta {
  public credits: number = 0;
  public minerals: number = 0;
  public fuel: number = 0;
  public food: number = 0;
  public energy: number = 0;

  /**
   * Returns true if all resource deltas are zero.
   */
  public get isZero(): boolean {
    return this.credits === 0 && this.minerals === 0 &&
           this.fuel === 0 && this.food === 0 && this.energy === 0;
  }

  /**
   * Returns true if all resource deltas are non-negative.
   */
  public get isPositive(): boolean {
    return this.credits >= 0 && this.minerals >= 0 &&
           this.fuel >= 0 && this.food >= 0 && this.energy >= 0;
  }
}

/**
 * Represents the cost of a purchase or construction action.
 * All values must be non-negative.
 */
export class ResourceCost {
  public credits: number = 0;
  public minerals: number = 0;
  public fuel: number = 0;
  public food: number = 0;
  public energy: number = 0;

  /**
   * Returns a zero-cost (free) resource cost.
   */
  public static get zero(): ResourceCost {
    return new ResourceCost();
  }

  /**
   * Returns true if this cost is zero (free).
   */
  public get isZero(): boolean {
    return this.credits === 0 && this.minerals === 0 &&
           this.fuel === 0 && this.food === 0 && this.energy === 0;
  }

  /**
   * Creates a ResourceDelta with negative values (for spending).
   */
  public toDelta(): ResourceDelta {
    const delta = new ResourceDelta();
    delta.credits = -this.credits;
    delta.minerals = -this.minerals;
    delta.fuel = -this.fuel;
    delta.food = -this.food;
    delta.energy = -this.energy;
    return delta;
  }
}

/**
 * Resource production multipliers based on planet type.
 */
export class ResourceMultipliers {
  public food: number = 1.0;
  public minerals: number = 1.0;
  public fuel: number = 1.0;
  public energy: number = 1.0;
  public credits: number = 1.0;
}
