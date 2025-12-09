import { GameState } from './GameState';
import { EntitySystem } from './EntitySystem';
import { CraftEntity } from './models/CraftEntity';
import { CraftType, FactionType } from './models/Enums';
import { ResourceDelta, ResourceCost } from './models/ResourceModels';
import { CraftCosts, CraftCrewRequirements } from './models/CraftModels';

/**
 * Platform-agnostic craft management system.
 * Handles craft purchasing, scrapping, cargo loading, platoon transport, and deployment.
 */
export class CraftSystem {
  private readonly gameState: GameState;
  private readonly entitySystem: EntitySystem;

  /**
   * Event fired when a craft is purchased.
   * Parameters: (craftID)
   */
  public onCraftPurchased?: (craftID: number) => void;

  /**
   * Event fired when a craft is scrapped (destroyed by player).
   * Parameters: (craftID)
   */
  public onCraftScrapped?: (craftID: number) => void;

  /**
   * Event fired when platoons are embarked onto a Battle Cruiser.
   * Parameters: (craftID, platoonIDs)
   */
  public onPlatoonsEmbarked?: (craftID: number, platoonIDs: number[]) => void;

  /**
   * Event fired when platoons are disembarked from a Battle Cruiser.
   * Parameters: (craftID, platoonIDs)
   */
  public onPlatoonsDisembarked?: (craftID: number, platoonIDs: number[]) => void;

  /**
   * Event fired when cargo is loaded onto a Cargo Cruiser.
   * Parameters: (craftID, cargoLoaded)
   */
  public onCargoLoaded?: (craftID: number, cargoLoaded: ResourceDelta) => void;

  /**
   * Event fired when cargo is unloaded from a Cargo Cruiser.
   * Parameters: (craftID, cargoUnloaded)
   */
  public onCargoUnloaded?: (craftID: number, cargoUnloaded: ResourceDelta) => void;

  /**
   * Event fired when an Atmosphere Processor is deployed.
   * Parameters: (planetID, craftID)
   */
  public onAtmosphereProcessorDeployed?: (planetID: number, craftID: number) => void;

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
   * Purchases a new craft at a planet.
   * @param type Craft type
   * @param planetID Planet ID where craft is purchased
   * @param owner Faction owner
   * @returns Craft ID if successful, -1 if failed
   */
  public purchaseCraft(type: CraftType, planetID: number, owner: FactionType): number {
    // Validate planet exists
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return -1;
    }

    // Validate fleet limit
    if (!this.entitySystem.canCreateCraft()) {
      return -1; // Fleet limit reached (32/32)
    }

    // Get cost and crew requirements
    const cost = CraftCosts.getCost(type);
    const crewRequired = CraftCrewRequirements.getCrewRequired(type);

    // Validate resources (check planet resources)
    if (!planet.resources.canAfford(cost)) {
      return -1; // Insufficient resources
    }

    // Validate crew (check planet population)
    if (planet.population < crewRequired) {
      return -1; // Insufficient crew
    }

    // Deduct cost from planet resources
    planet.resources.subtract(cost);

    // Deduct crew from population
    planet.population -= crewRequired;

    // Create craft entity
    const craftID = this.entitySystem.createCraft(type, planetID, owner);

    this.onCraftPurchased?.(craftID);
    return craftID;
  }

  /**
   * Scraps a craft (destroys it, refunds 50% cost, returns crew to planet).
   * @param craftID Craft ID to scrap
   * @returns True if scrapped, false if failed
   */
  public scrapCraft(craftID: number): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Cannot scrap craft in transit
    if (craft.inTransit) {
      return false;
    }

    // Get planet
    const planet = this.gameState.planetLookup.get(craft.planetID);
    if (!planet) {
      return false;
    }

    // Refund 50% of cost
    const cost = CraftCosts.getCost(craft.type);
    const refund = new ResourceDelta();
    refund.credits = Math.floor(cost.credits / 2);
    refund.minerals = Math.floor(cost.minerals / 2);
    refund.fuel = Math.floor(cost.fuel / 2);
    refund.food = 0;
    refund.energy = 0;

    planet.resources.add(refund);

    // Return crew to population
    const crew = CraftCrewRequirements.getCrewRequired(craft.type);
    planet.population += crew;

    // Destroy craft
    this.entitySystem.destroyCraft(craftID);

    this.onCraftScrapped?.(craftID);
    return true;
  }

  /**
   * Embarks platoons onto a Battle Cruiser.
   * @param craftID Battle Cruiser ID
   * @param platoonIDs Platoon IDs to embark
   * @returns True if successful, false if failed
   */
  public embarkPlatoons(craftID: number, platoonIDs: number[]): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Must be a Battle Cruiser
    if (craft.type !== CraftType.BattleCruiser) {
      return false;
    }

    // Check capacity (max 4 platoons)
    if (craft.carriedPlatoonIDs.length + platoonIDs.length > craft.specs.platoonCapacity) {
      return false;
    }

    // Validate all platoons
    for (const platoonID of platoonIDs) {
      const platoon = this.gameState.platoonLookup.get(platoonID);
      if (!platoon) {
        return false;
      }

      // Platoon must be at same planet as craft
      if (platoon.planetID !== craft.planetID) {
        return false;
      }
    }

    // Embark platoons
    for (const platoonID of platoonIDs) {
      const platoon = this.gameState.platoonLookup.get(platoonID)!;
      craft.carriedPlatoonIDs.push(platoonID);
      platoon.planetID = -1; // No longer at planet (carried by craft)
    }

    this.onPlatoonsEmbarked?.(craftID, platoonIDs);
    return true;
  }

  /**
   * Disembarks platoons from a Battle Cruiser.
   * @param craftID Battle Cruiser ID
   * @param platoonIDs Platoon IDs to disembark
   * @returns True if successful, false if failed
   */
  public disembarkPlatoons(craftID: number, platoonIDs: number[]): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Must be a Battle Cruiser
    if (craft.type !== CraftType.BattleCruiser) {
      return false;
    }

    // Cannot disembark in space (must be docked at planet)
    if (craft.inTransit || craft.planetID < 0) {
      return false;
    }

    // Get planet
    const planet = this.gameState.planetLookup.get(craft.planetID);
    if (!planet) {
      return false;
    }

    // Validate all platoons are carried by this craft
    for (const platoonID of platoonIDs) {
      const platoon = this.gameState.platoonLookup.get(platoonID);
      if (!platoon) {
        return false;
      }

      if (!craft.carriedPlatoonIDs.includes(platoonID)) {
        return false;
      }
    }

    // Disembark platoons
    for (const platoonID of platoonIDs) {
      const platoon = this.gameState.platoonLookup.get(platoonID)!;
      const index = craft.carriedPlatoonIDs.indexOf(platoonID);
      craft.carriedPlatoonIDs.splice(index, 1);
      platoon.planetID = craft.planetID; // Now at planet
    }

    this.onPlatoonsDisembarked?.(craftID, platoonIDs);
    return true;
  }

  /**
   * Loads cargo onto a Cargo Cruiser from a planet.
   * @param craftID Cargo Cruiser ID
   * @param cargo Resources to load
   * @returns True if successful, false if failed
   */
  public loadCargo(craftID: number, cargo: ResourceDelta): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Must be a Cargo Cruiser
    if (craft.type !== CraftType.CargoCruiser) {
      return false;
    }

    // Cannot load in transit
    if (craft.inTransit || craft.planetID < 0) {
      return false;
    }

    // Get planet
    const planet = this.gameState.planetLookup.get(craft.planetID);
    if (!planet) {
      return false;
    }

    // Initialize cargo hold if null
    if (!craft.cargoHold) {
      craft.cargoHold = new ResourceDelta();
    }

    // Check cargo capacity (1000 per resource type)
    const maxCapacity = craft.specs.cargoCapacity;
    if (
      craft.cargoHold.credits + cargo.credits > maxCapacity ||
      craft.cargoHold.minerals + cargo.minerals > maxCapacity ||
      craft.cargoHold.fuel + cargo.fuel > maxCapacity ||
      craft.cargoHold.food + cargo.food > maxCapacity ||
      craft.cargoHold.energy + cargo.energy > maxCapacity
    ) {
      return false; // Cargo capacity exceeded
    }

    // Validate planet has resources (convert ResourceDelta to ResourceCost for checking)
    const cost = new ResourceCost();
    cost.credits = cargo.credits;
    cost.minerals = cargo.minerals;
    cost.fuel = cargo.fuel;
    cost.food = cargo.food;
    cost.energy = cargo.energy;

    if (!planet.resources.canAfford(cost)) {
      return false; // Insufficient resources on planet
    }

    // Remove resources from planet
    planet.resources.subtract(cost);

    // Add to cargo hold
    craft.cargoHold.credits += cargo.credits;
    craft.cargoHold.minerals += cargo.minerals;
    craft.cargoHold.fuel += cargo.fuel;
    craft.cargoHold.food += cargo.food;
    craft.cargoHold.energy += cargo.energy;

    this.onCargoLoaded?.(craftID, cargo);
    return true;
  }

  /**
   * Unloads cargo from a Cargo Cruiser to a planet.
   * @param craftID Cargo Cruiser ID
   * @param cargo Resources to unload
   * @returns True if successful, false if failed
   */
  public unloadCargo(craftID: number, cargo: ResourceDelta): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Must be a Cargo Cruiser
    if (craft.type !== CraftType.CargoCruiser) {
      return false;
    }

    // Cannot unload in transit
    if (craft.inTransit || craft.planetID < 0) {
      return false;
    }

    // Get planet
    const planet = this.gameState.planetLookup.get(craft.planetID);
    if (!planet) {
      return false;
    }

    // Check cargo hold has resources
    if (!craft.cargoHold) {
      return false;
    }

    if (
      craft.cargoHold.credits < cargo.credits ||
      craft.cargoHold.minerals < cargo.minerals ||
      craft.cargoHold.fuel < cargo.fuel ||
      craft.cargoHold.food < cargo.food ||
      craft.cargoHold.energy < cargo.energy
    ) {
      return false; // Insufficient cargo
    }

    // Remove from cargo hold
    craft.cargoHold.credits -= cargo.credits;
    craft.cargoHold.minerals -= cargo.minerals;
    craft.cargoHold.fuel -= cargo.fuel;
    craft.cargoHold.food -= cargo.food;
    craft.cargoHold.energy -= cargo.energy;

    // Add to planet
    planet.resources.add(cargo);

    this.onCargoUnloaded?.(craftID, cargo);
    return true;
  }

  /**
   * Deploys a Solar Satellite at a planet.
   * Solar Satellites generate 80 Energy/turn when active.
   * @param craftID Solar Satellite ID
   * @returns True if deployed, false if failed
   */
  public deploySolarSatellite(craftID: number): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Must be a Solar Satellite
    if (craft.type !== CraftType.SolarSatellite) {
      return false;
    }

    // Get planet
    const planet = this.gameState.planetLookup.get(craft.planetID);
    if (!planet) {
      return false;
    }

    // Mark as deployed
    craft.deployedAtPlanetID = craft.planetID;

    // Activate if planet has 5+ crew
    // Note: Solar Satellite crew (5) was already deducted on purchase
    // This just checks if satellite should be active based on planet crew availability
    craft.active = planet.population >= 5;

    return true;
  }

  /**
   * Deploys an Atmosphere Processor to start terraforming.
   * This is a one-time use - the craft is destroyed after deployment.
   * @param craftID Atmosphere Processor ID
   * @returns True if deployed, false if failed
   */
  public deployAtmosphereProcessor(craftID: number): boolean {
    // Get craft
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    // Must be an Atmosphere Processor
    if (craft.type !== CraftType.AtmosphereProcessor) {
      return false;
    }

    // Get planet
    const planet = this.gameState.planetLookup.get(craft.planetID);
    if (!planet) {
      return false;
    }

    // Planet must not already be colonized
    if (planet.colonized) {
      return false;
    }

    // Start terraforming (10 turns)
    planet.terraformingProgress = 10;

    // Mark craft as deployed before destroying
    craft.deployedAtPlanetID = craft.planetID;
    craft.terraformingTurnsRemaining = 10;

    // Destroy Atmosphere Processor (one-time use)
    this.entitySystem.destroyCraft(craftID);

    this.onAtmosphereProcessorDeployed?.(craft.planetID, craftID);
    return true;
  }

  /**
   * Gets all craft owned by a faction.
   */
  public getCraft(owner: FactionType): CraftEntity[] {
    return this.entitySystem.getCraft(owner);
  }

  /**
   * Gets all craft at a specific planet.
   */
  public getCraftAtPlanet(planetID: number): CraftEntity[] {
    return this.entitySystem.getCraftAtPlanet(planetID);
  }

  /**
   * Gets all craft currently in transit.
   */
  public getCraftInTransit(): CraftEntity[] {
    return this.entitySystem.getCraftInTransit();
  }

  /**
   * Checks if a craft can be purchased (validates limit only).
   */
  public canPurchaseCraft(): boolean {
    return this.entitySystem.canCreateCraft();
  }

  /**
   * Gets the current fleet count.
   */
  public getFleetCount(): number {
    return this.entitySystem.getCraftCount();
  }

  /**
   * Gets the fleet count for a specific faction.
   */
  public getFleetCountByOwner(owner: FactionType): number {
    return this.entitySystem.getCraftCountByOwner(owner);
  }
}
