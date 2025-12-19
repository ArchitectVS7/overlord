import { GameState } from './GameState';
import { EntitySystem } from './EntitySystem';
import { PlatoonEntity } from './models/PlatoonEntity';
import { FactionType, EquipmentLevel, WeaponLevel } from './models/Enums';
import { PlatoonCosts, PlatoonModifiers } from './models/PlatoonModels';

/**
 * Platform-agnostic platoon management system.
 * Handles platoon commissioning, training, decommissioning, and military strength calculations.
 */
export class PlatoonSystem {
  private readonly gameState: GameState;
  private readonly entitySystem: EntitySystem;

  /**
   * Event fired when a platoon is commissioned.
   * Parameters: (platoonID)
   */
  public onPlatoonCommissioned?: (platoonID: number) => void;

  /**
   * Event fired when a platoon is decommissioned.
   * Parameters: (platoonID)
   */
  public onPlatoonDecommissioned?: (platoonID: number) => void;

  /**
   * Event fired when a platoon completes training.
   * Parameters: (platoonID)
   */
  public onPlatoonTrainingComplete?: (platoonID: number) => void;

  // Training constants
  public static readonly TrainingTurns: number = 10;
  public static readonly TrainingPerTurn: number = 10; // 10% per turn
  public static readonly StarbasePlanetID: number = 0; // Assumed Starbase is planet 0

  // Troop limits
  public static readonly MinTroops: number = 1;
  public static readonly MaxTroops: number = 200;

  constructor(gameState: GameState, entitySystem: EntitySystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!entitySystem) {
      throw new Error('entitySystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.entitySystem = entitySystem;
  }

  /**
   * Commissions a new platoon (draft troops, purchase equipment/weapons, begin training).
   * @param planetID Planet ID where platoon is commissioned
   * @param owner Faction owner
   * @param troopCount Number of troops (1-200)
   * @param equipment Equipment level
   * @param weapon Weapon level
   * @param name Optional custom name
   * @returns Platoon ID if successful, -1 if failed
   */
  public commissionPlatoon(
    planetID: number,
    owner: FactionType,
    troopCount: number,
    equipment: EquipmentLevel,
    weapon: WeaponLevel,
    name?: string,
  ): number {
    // Validate planet exists
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return -1;
    }

    // Validate troop count
    if (troopCount < PlatoonSystem.MinTroops || troopCount > PlatoonSystem.MaxTroops) {
      return -1;
    }

    // Validate platoon limit
    if (!this.entitySystem.canCreatePlatoon()) {
      return -1; // Limit reached (24/24)
    }

    // Get total cost
    const totalCost = PlatoonCosts.getTotalCost(equipment, weapon);

    // Validate resources
    if (planet.resources.credits < totalCost) {
      return -1; // Insufficient credits
    }

    // Validate population (need troops)
    if (planet.population < troopCount) {
      return -1; // Insufficient population
    }

    // Deduct cost
    planet.resources.credits -= totalCost;

    // Draft troops from population
    planet.population -= troopCount;

    // Create platoon entity
    const platoonID = this.entitySystem.createPlatoon(planetID, owner, 0, name);

    // Get platoon and configure it
    const platoon = this.gameState.platoonLookup.get(platoonID);
    if (platoon) {
      platoon.troopCount = troopCount;
      platoon.equipment = equipment;
      platoon.weapon = weapon;
      platoon.trainingLevel = 0;
      platoon.trainingTurnsRemaining =
        planetID === PlatoonSystem.StarbasePlanetID ? PlatoonSystem.TrainingTurns : 0; // Only train at Starbase
      platoon.strength = this.calculateMilitaryStrength(platoon);
    }

    this.onPlatoonCommissioned?.(platoonID);
    return platoonID;
  }

  /**
   * Decommissions a platoon (disband, return troops to population).
   * Equipment cannot be sold back (design decision).
   * @param platoonID Platoon ID to decommission
   * @returns True if decommissioned, false if failed
   */
  public decommissionPlatoon(platoonID: number): boolean {
    // Get platoon
    const platoon = this.gameState.platoonLookup.get(platoonID);
    if (!platoon) {
      return false;
    }

    // Get planet (troops return to planet where platoon is located)
    const planet = this.gameState.planetLookup.get(platoon.planetID);
    if (!planet) {
      return false; // Cannot decommission if carried by craft or invalid location
    }

    // Return troops to population
    planet.population += platoon.troopCount;

    // Destroy platoon entity
    this.entitySystem.destroyPlatoon(platoonID);

    this.onPlatoonDecommissioned?.(platoonID);
    return true;
  }

  /**
   * Updates training for all platoons (called each turn during Income Phase).
   * Only platoons at Starbase can train.
   */
  public updateTraining(): void {
    const trainingPlatoons = this.gameState.platoons.filter(
      p => p.isTraining && p.planetID === PlatoonSystem.StarbasePlanetID,
    );

    for (const platoon of trainingPlatoons) {
      // Increment training
      platoon.trainingLevel = Math.min(100, platoon.trainingLevel + PlatoonSystem.TrainingPerTurn);
      platoon.trainingTurnsRemaining = Math.max(0, platoon.trainingTurnsRemaining - 1);

      // Recalculate strength
      platoon.strength = this.calculateMilitaryStrength(platoon);

      // Fire event if training complete
      if (platoon.isFullyTrained) {
        this.onPlatoonTrainingComplete?.(platoon.id);
      }
    }
  }

  /**
   * Calculates military strength for a platoon.
   * Formula: Troops × Equipment × Weapon × Training
   */
  public calculateMilitaryStrength(platoon: PlatoonEntity): number {
    return PlatoonModifiers.calculateMilitaryStrength(
      platoon.troopCount,
      platoon.equipment,
      platoon.weapon,
      platoon.trainingLevel,
    );
  }

  /**
   * Gets the estimated strength for a platoon configuration (used for UI preview).
   */
  public getEstimatedStrength(
    troopCount: number,
    equipment: EquipmentLevel,
    weapon: WeaponLevel,
    trainingLevel: number = 100,
  ): number {
    return PlatoonModifiers.calculateMilitaryStrength(troopCount, equipment, weapon, trainingLevel);
  }

  /**
   * Gets all platoons owned by a faction.
   */
  public getPlatoons(owner: FactionType): PlatoonEntity[] {
    return this.entitySystem.getPlatoons(owner);
  }

  /**
   * Gets all platoons at a specific planet.
   */
  public getPlatoonsAtPlanet(planetID: number): PlatoonEntity[] {
    return this.entitySystem.getPlatoonsAtPlanet(planetID);
  }

  /**
   * Gets all platoons currently under training.
   */
  public getTrainingPlatoons(): PlatoonEntity[] {
    return this.gameState.platoons.filter(p => p.isTraining);
  }

  /**
   * Gets all fully trained platoons.
   */
  public getFullyTrainedPlatoons(): PlatoonEntity[] {
    return this.gameState.platoons.filter(p => p.isFullyTrained);
  }

  /**
   * Checks if a platoon can be commissioned (validates limit only).
   */
  public canCommissionPlatoon(): boolean {
    return this.entitySystem.canCreatePlatoon();
  }

  /**
   * Gets the total military strength for a faction (sum of all platoon strengths).
   */
  public getTotalMilitaryStrength(owner: FactionType): number {
    return this.gameState.platoons
      .filter(p => p.owner === owner)
      .reduce((sum, p) => sum + p.strength, 0);
  }

  /**
   * Gets the platoon count for a faction.
   */
  public getPlatoonCount(owner: FactionType): number {
    return this.entitySystem.getPlatoonCountByOwner(owner);
  }

  /**
   * Validates if a platoon commission is affordable (resources and population).
   */
  public canAffordPlatoon(
    planetID: number,
    troopCount: number,
    equipment: EquipmentLevel,
    weapon: WeaponLevel,
  ): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    const totalCost = PlatoonCosts.getTotalCost(equipment, weapon);

    return planet.resources.credits >= totalCost && planet.population >= troopCount;
  }
}
