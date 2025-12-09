import { GameState } from './GameState';
import { ResourceSystem } from './ResourceSystem';
import { CombatSystem } from './CombatSystem';
import { FactionType } from './models/Enums';
import { ResourceDelta } from './models/ResourceModels';
import { CraftEntity } from './models/CraftEntity';

/**
 * Platform-agnostic navigation system for ship movement.
 * Handles ship movement between planets with fuel cost validation.
 */
export class NavigationSystem {
  private readonly gameState: GameState;
  private readonly resourceSystem: ResourceSystem;
  private readonly combatSystem: CombatSystem;

  /**
   * Event fired when a ship moves between planets.
   * Parameters: (craftID, sourcePlanetID, destinationPlanetID)
   */
  public onShipMoved?: (craftID: number, sourcePlanetID: number, destinationPlanetID: number) => void;

  /**
   * Event fired when ship movement fails due to insufficient fuel or invalid destination.
   * Parameters: (craftID, reason)
   */
  public onMovementFailed?: (craftID: number, reason: string) => void;

  /**
   * Fixed fuel cost per jump for prototype (simplified).
   */
  public static readonly FuelCostPerJump: number = 10;

  constructor(gameState: GameState, resourceSystem: ResourceSystem, combatSystem: CombatSystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!resourceSystem) {
      throw new Error('resourceSystem cannot be null or undefined');
    }
    if (!combatSystem) {
      throw new Error('combatSystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.resourceSystem = resourceSystem;
    this.combatSystem = combatSystem;
  }

  /**
   * Moves a ship from its current planet to a destination planet.
   * Instant teleport for prototype (no travel time).
   * @param craftID ID of the craft to move
   * @param destinationPlanetID Destination planet ID
   * @returns True if movement successful, false otherwise
   */
  public moveShip(craftID: number, destinationPlanetID: number): boolean {
    // Validate craft exists
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      this.onMovementFailed?.(craftID, 'Ship not found');
      return false;
    }

    // Get source planet
    const sourcePlanetID = craft.planetID;
    const sourcePlanet = this.gameState.planetLookup.get(sourcePlanetID);
    if (!sourcePlanet) {
      this.onMovementFailed?.(craftID, 'Source planet not found');
      return false;
    }

    // Validate destination planet exists
    const destinationPlanet = this.gameState.planetLookup.get(destinationPlanetID);
    if (!destinationPlanet) {
      this.onMovementFailed?.(craftID, 'Destination planet not found');
      return false;
    }

    // Can't move to same planet
    if (sourcePlanetID === destinationPlanetID) {
      this.onMovementFailed?.(craftID, 'Already at destination');
      return false;
    }

    // Check fuel availability at source planet
    if (sourcePlanet.resources.fuel < NavigationSystem.FuelCostPerJump) {
      this.onMovementFailed?.(
        craftID,
        `Insufficient fuel (need ${NavigationSystem.FuelCostPerJump}, have ${sourcePlanet.resources.fuel})`
      );
      return false;
    }

    // Deduct fuel from source planet
    const fuelCost = new ResourceDelta();
    fuelCost.fuel = -NavigationSystem.FuelCostPerJump;
    this.resourceSystem.addResources(sourcePlanetID, fuelCost);

    // Remove craft from source planet's docked list
    const sourceIndex = sourcePlanet.dockedCraftIDs.indexOf(craftID);
    if (sourceIndex !== -1) {
      sourcePlanet.dockedCraftIDs.splice(sourceIndex, 1);
    }

    // Update craft location (instant teleport for prototype)
    craft.planetID = destinationPlanetID;
    craft.inTransit = false;

    // Add craft to destination planet's docked list
    destinationPlanet.dockedCraftIDs.push(craftID);

    // Check for combat if arriving at enemy planet
    if (
      destinationPlanet.owner !== FactionType.Neutral &&
      destinationPlanet.owner !== craft.owner
    ) {
      // Enemy planet - check if we have platoons to attack with
      if (craft.carriedPlatoonIDs.length > 0) {
        // Initiate combat
        const battle = this.combatSystem.initiateBattle(
          destinationPlanetID,
          craft.owner,
          craft.carriedPlatoonIDs
        );

        if (battle) {
          // Execute auto-resolve combat
          this.combatSystem.executeCombat(battle, 50);
          // Combat result handled by CombatSystem events
        }
      }
    }

    // Fire event
    this.onShipMoved?.(craftID, sourcePlanetID, destinationPlanetID);

    return true;
  }

  /**
   * Gets all ships docked at a specific planet.
   * @param planetID Planet ID
   * @returns List of CraftEntity at the planet
   */
  public getShipsAtPlanet(planetID: number): CraftEntity[] {
    return this.gameState.craft.filter(c => c.planetID === planetID);
  }

  /**
   * Gets all player-owned ships at a specific planet.
   * @param planetID Planet ID
   * @returns List of player CraftEntity at the planet
   */
  public getPlayerShipsAtPlanet(planetID: number): CraftEntity[] {
    return this.gameState.craft.filter(
      c => c.planetID === planetID && c.owner === FactionType.Player
    );
  }

  /**
   * Validates if a ship can move to a destination (checks fuel only, for UI validation).
   * @param craftID Craft ID
   * @param destinationPlanetID Destination planet ID
   * @returns True if move is valid, false otherwise
   */
  public canMoveShip(craftID: number, destinationPlanetID: number): boolean {
    const craft = this.gameState.craftLookup.get(craftID);
    if (!craft) {
      return false;
    }

    const sourcePlanet = this.gameState.planetLookup.get(craft.planetID);
    if (!sourcePlanet) {
      return false;
    }

    const destinationPlanet = this.gameState.planetLookup.get(destinationPlanetID);
    if (!destinationPlanet) {
      return false;
    }

    if (craft.planetID === destinationPlanetID) {
      return false;
    }

    if (sourcePlanet.resources.fuel < NavigationSystem.FuelCostPerJump) {
      return false;
    }

    return true;
  }
}
