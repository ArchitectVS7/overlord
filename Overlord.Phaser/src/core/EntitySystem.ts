import { GameState } from './GameState';
import { CraftEntity } from './models/CraftEntity';
import { PlatoonEntity } from './models/PlatoonEntity';
import { CraftType, FactionType } from './models/Enums';

/**
 * Platform-agnostic entity management system.
 * Manages entity lifecycle, ID generation, and entity limits.
 */
export class EntitySystem {
  private readonly gameState: GameState;

  /**
   * Event fired when a craft is created.
   * Parameters: (craftID)
   */
  public onCraftCreated?: (craftID: number) => void;

  /**
   * Event fired when a craft is destroyed.
   * Parameters: (craftID)
   */
  public onCraftDestroyed?: (craftID: number) => void;

  /**
   * Event fired when a platoon is created.
   * Parameters: (platoonID)
   */
  public onPlatoonCreated?: (platoonID: number) => void;

  /**
   * Event fired when a platoon is destroyed.
   * Parameters: (platoonID)
   */
  public onPlatoonDestroyed?: (platoonID: number) => void;

  // Entity limits
  public static readonly MaxCraft: number = 32;
  public static readonly MaxPlatoons: number = 24;

  // Next IDs for entity creation
  private nextCraftID: number = 0;
  private nextPlatoonID: number = 0;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    this.gameState = gameState;

    // Initialize next IDs based on existing entities
    if (this.gameState.craft.length > 0) {
      this.nextCraftID = Math.max(...this.gameState.craft.map(c => c.id)) + 1;
    }

    if (this.gameState.platoons.length > 0) {
      this.nextPlatoonID = Math.max(...this.gameState.platoons.map(p => p.id)) + 1;
    }
  }

  // #region Craft Management

  /**
   * Checks if a new craft can be created (under limit).
   */
  public canCreateCraft(): boolean {
    return this.gameState.craft.length < EntitySystem.MaxCraft;
  }

  /**
   * Creates a new craft entity.
   * @param type Craft type
   * @param planetID Starting planet ID
   * @param owner Faction owner
   * @param name Custom name (optional)
   * @returns Craft ID, or -1 if limit reached
   */
  public createCraft(type: CraftType, planetID: number, owner: FactionType, name?: string): number {
    if (!this.canCreateCraft()) {
      return -1;
    }

    const id = this.nextCraftID++;
    const craft = new CraftEntity();
    craft.id = id;
    craft.name = name ?? this.generateCraftName(type, id);
    craft.type = type;
    craft.owner = owner;
    craft.planetID = planetID;
    craft.inTransit = false;
    craft.health = 100;
    craft.active = false;
    craft.deployedAtPlanetID = -1;
    craft.terraformingTurnsRemaining = 0;

    // Set position to planet position
    const planet = this.gameState.planetLookup.get(planetID);
    if (planet) {
      craft.position = planet.position.clone();
    }

    this.gameState.craft.push(craft);
    this.gameState.rebuildLookups();

    this.onCraftCreated?.(id);
    return id;
  }

  /**
   * Destroys a craft entity.
   * @param craftID Craft ID
   * @returns True if destroyed, false if not found
   */
  public destroyCraft(craftID: number): boolean {
    const index = this.gameState.craft.findIndex(c => c.id === craftID);
    if (index === -1) {
      return false;
    }

    this.gameState.craft.splice(index, 1);
    this.gameState.rebuildLookups();

    this.onCraftDestroyed?.(craftID);
    return true;
  }

  /**
   * Gets craft entities by owner.
   */
  public getCraft(owner: FactionType): CraftEntity[] {
    return this.gameState.craft.filter(c => c.owner === owner);
  }

  /**
   * Gets craft entities at a specific planet.
   */
  public getCraftAtPlanet(planetID: number): CraftEntity[] {
    return this.gameState.craft.filter(c => c.planetID === planetID && !c.inTransit);
  }

  /**
   * Gets craft entities currently in transit.
   */
  public getCraftInTransit(): CraftEntity[] {
    return this.gameState.craft.filter(c => c.inTransit);
  }

  // #endregion

  // #region Platoon Management

  /**
   * Checks if a new platoon can be created (under limit).
   */
  public canCreatePlatoon(): boolean {
    return this.gameState.platoons.length < EntitySystem.MaxPlatoons;
  }

  /**
   * Creates a new platoon entity.
   * @param planetID Starting planet ID
   * @param owner Faction owner
   * @param strength Initial strength
   * @param name Custom name (optional)
   * @returns Platoon ID, or -1 if limit reached
   */
  public createPlatoon(planetID: number, owner: FactionType, strength: number = 100, name?: string): number {
    if (!this.canCreatePlatoon()) {
      return -1;
    }

    const id = this.nextPlatoonID++;
    const platoon = new PlatoonEntity();
    platoon.id = id;
    platoon.name = name ?? this.generatePlatoonName(id);
    platoon.owner = owner;
    platoon.planetID = planetID;
    platoon.strength = strength;

    this.gameState.platoons.push(platoon);
    this.gameState.rebuildLookups();

    this.onPlatoonCreated?.(id);
    return id;
  }

  /**
   * Destroys a platoon entity.
   * @param platoonID Platoon ID
   * @returns True if destroyed, false if not found
   */
  public destroyPlatoon(platoonID: number): boolean {
    const index = this.gameState.platoons.findIndex(p => p.id === platoonID);
    if (index === -1) {
      return false;
    }

    this.gameState.platoons.splice(index, 1);
    this.gameState.rebuildLookups();

    this.onPlatoonDestroyed?.(platoonID);
    return true;
  }

  /**
   * Gets platoon entities by owner.
   */
  public getPlatoons(owner: FactionType): PlatoonEntity[] {
    return this.gameState.platoons.filter(p => p.owner === owner);
  }

  /**
   * Gets platoon entities at a specific planet.
   */
  public getPlatoonsAtPlanet(planetID: number): PlatoonEntity[] {
    return this.gameState.platoons.filter(p => p.planetID === planetID);
  }

  // #endregion

  // #region Name Generation

  private generateCraftName(type: CraftType, id: number): string {
    let prefix: string;

    switch (type) {
      case CraftType.BattleCruiser:
        prefix = 'BC';
        break;
      case CraftType.CargoCruiser:
        prefix = 'CC';
        break;
      case CraftType.SolarSatellite:
        prefix = 'SS';
        break;
      case CraftType.AtmosphereProcessor:
        prefix = 'AP';
        break;
      default:
        prefix = 'UNK';
    }

    return `${prefix}-${id.toString().padStart(3, '0')}`;
  }

  private generatePlatoonName(id: number): string {
    return `Platoon-${id.toString().padStart(3, '0')}`;
  }

  // #endregion

  // #region Statistics

  /**
   * Gets the current craft count.
   */
  public getCraftCount(): number {
    return this.gameState.craft.length;
  }

  /**
   * Gets the current platoon count.
   */
  public getPlatoonCount(): number {
    return this.gameState.platoons.length;
  }

  /**
   * Gets the craft count for a specific owner.
   */
  public getCraftCountByOwner(owner: FactionType): number {
    return this.gameState.craft.filter(c => c.owner === owner).length;
  }

  /**
   * Gets the platoon count for a specific owner.
   */
  public getPlatoonCountByOwner(owner: FactionType): number {
    return this.gameState.platoons.filter(p => p.owner === owner).length;
  }

  // #endregion
}
