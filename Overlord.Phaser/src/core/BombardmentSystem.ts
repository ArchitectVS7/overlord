import { GameState } from './GameState';
import { FactionType, BuildingType, BuildingStatus, CraftType } from './models/Enums';
import { BombardmentResult } from './models/CombatModels';
import { PlanetEntity } from './models/PlanetEntity';
import { CraftEntity } from './models/CraftEntity';
// Note: Structure type is inferred from planet.structures array

/**
 * Platform-agnostic bombardment system.
 * Handles orbital bombardment, structure destruction, and civilian casualties.
 */
export class BombardmentSystem {
  private readonly gameState: GameState;
  private readonly random: () => number;

  /**
   * Event fired when bombardment starts.
   * Parameters: (planetID, strength)
   */
  public onBombardmentStarted?: (planetID: number, strength: number) => void;

  /**
   * Event fired when structure is destroyed.
   * Parameters: (structureID, planetID)
   */
  public onStructureDestroyed?: (structureID: number, planetID: number) => void;

  /**
   * Event fired when civilian casualties occur.
   * Parameters: (planetID, casualties)
   */
  public onCivilianCasualties?: (planetID: number, casualties: number) => void;

  constructor(gameState: GameState, randomFunc?: () => number) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }

    this.gameState = gameState;
    this.random = randomFunc || Math.random;
  }

  /**
   * Executes orbital bombardment of a planet.
   * @param planetID Target planet ID
   * @param attackerFaction Attacking faction
   * @returns Bombardment result if successful, null if failed
   */
  public bombardPlanet(planetID: number, attackerFaction: FactionType): BombardmentResult | null {
    // Get planet
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return null;
    }

    // Cannot bombard own planets
    if (planet.owner === attackerFaction) {
      return null;
    }

    // Must control orbit (no enemy craft)
    if (!this.hasOrbitalControl(planetID, attackerFaction)) {
      return null;
    }

    // Calculate bombardment strength (Battle Cruisers × 50)
    const battleCruisers = this.getBattleCruisersInOrbit(planetID, attackerFaction);
    if (battleCruisers.length === 0) {
      return null; // No bombardment craft
    }

    const bombardmentStrength = battleCruisers.length * 50;

    this.onBombardmentStarted?.(planetID, bombardmentStrength);

    // Destroy structures
    const destroyedStructures = this.destroyStructures(planet, bombardmentStrength);

    // Cause civilian casualties
    const casualties = this.causeCasualties(planet, bombardmentStrength);

    // Reduce morale by 20%
    planet.morale = Math.max(0, planet.morale - 20);

    // Create result
    const result = new BombardmentResult();
    result.planetID = planetID;
    result.bombardmentStrength = bombardmentStrength;
    result.structuresDestroyed = destroyedStructures.length;
    result.destroyedStructureIDs = destroyedStructures;
    result.civilianCasualties = casualties;
    result.newMorale = planet.morale;

    return result;
  }

  /**
   * Destroys structures based on bombardment strength.
   * @param planet Target planet
   * @param bombardmentStrength Bombardment strength
   * @returns List of destroyed structure IDs
   */
  private destroyStructures(planet: PlanetEntity, bombardmentStrength: number): number[] {
    const destroyedStructureIDs: number[] = [];

    // Calculate number of structures to destroy (max 3)
    const structuresToDestroy = Math.min(Math.floor(bombardmentStrength / 100), 3);

    // Get vulnerable structures (exclude Docking Bays and Orbital Defense)
    const vulnerableStructures = planet.structures.filter(
      s =>
        s.type !== BuildingType.DockingBay &&
        s.type !== BuildingType.OrbitalDefense &&
        s.status === BuildingStatus.Active,
    );

    if (vulnerableStructures.length === 0) {
      return destroyedStructureIDs;
    }

    // Randomly select structures to destroy
    for (let i = 0; i < structuresToDestroy && vulnerableStructures.length > 0; i++) {
      const randomIndex = Math.floor(this.random() * vulnerableStructures.length);
      const structure = vulnerableStructures[randomIndex];

      // Destroy structure
      const structureIndex = planet.structures.indexOf(structure);
      if (structureIndex !== -1) {
        planet.structures.splice(structureIndex, 1);
      }
      destroyedStructureIDs.push(structure.id);
      vulnerableStructures.splice(randomIndex, 1);

      this.onStructureDestroyed?.(structure.id, planet.id);
    }

    this.gameState.rebuildLookups();
    return destroyedStructureIDs;
  }

  /**
   * Causes civilian casualties (10% of bombardment strength).
   * @param planet Target planet
   * @param bombardmentStrength Bombardment strength
   * @returns Number of casualties
   */
  private causeCasualties(planet: PlanetEntity, bombardmentStrength: number): number {
    let casualties = Math.floor(bombardmentStrength * 0.1); // 10% of strength
    casualties = Math.min(casualties, planet.population); // Cannot kill more than population

    planet.population -= casualties;

    this.onCivilianCasualties?.(planet.id, casualties);
    return casualties;
  }

  /**
   * Checks if faction controls orbit (no enemy craft).
   * @param planetID Planet ID
   * @param faction Faction checking control
   * @returns True if faction controls orbit
   */
  public hasOrbitalControl(planetID: number, faction: FactionType): boolean {
    const craftInOrbit = this.gameState.craft.filter(c => c.planetID === planetID && !c.isDeployed);

    // No enemy craft = orbital control
    const enemyCraft = craftInOrbit.filter(c => c.owner !== faction);
    return enemyCraft.length === 0;
  }

  /**
   * Gets Battle Cruisers in orbit for a faction.
   * @param planetID Planet ID
   * @param faction Faction
   * @returns List of Battle Cruisers
   */
  private getBattleCruisersInOrbit(planetID: number, faction: FactionType): CraftEntity[] {
    return this.gameState.craft.filter(
      c =>
        c.planetID === planetID &&
        c.owner === faction &&
        c.type === CraftType.BattleCruiser &&
        !c.isDeployed,
    );
  }
}
