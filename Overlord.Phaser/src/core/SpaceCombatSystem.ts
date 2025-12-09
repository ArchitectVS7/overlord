import { GameState } from './GameState';
import { UpgradeSystem } from './UpgradeSystem';
import { DefenseSystem } from './DefenseSystem';
import { FactionType, CraftType } from './models/Enums';
import { SpaceBattle, SpaceBattleResult } from './models/CombatModels';
import { CraftEntity } from './models/CraftEntity';

/**
 * Platform-agnostic space combat system.
 * Handles fleet-vs-fleet orbital battles, damage calculations, and craft destruction.
 */
export class SpaceCombatSystem {
  private readonly gameState: GameState;
  private readonly upgradeSystem: UpgradeSystem;
  private readonly defenseSystem: DefenseSystem;

  /**
   * Event fired when space battle starts.
   * Parameters: (battle)
   */
  public onSpaceBattleStarted?: (battle: SpaceBattle) => void;

  /**
   * Event fired when space battle completes.
   * Parameters: (battle, result)
   */
  public onSpaceBattleCompleted?: (battle: SpaceBattle, result: SpaceBattleResult) => void;

  /**
   * Event fired when craft is destroyed.
   * Parameters: (craftID, owner)
   */
  public onCraftDestroyed?: (craftID: number, owner: FactionType) => void;

  constructor(gameState: GameState, upgradeSystem: UpgradeSystem, defenseSystem: DefenseSystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!upgradeSystem) {
      throw new Error('upgradeSystem cannot be null or undefined');
    }
    if (!defenseSystem) {
      throw new Error('defenseSystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.upgradeSystem = upgradeSystem;
    this.defenseSystem = defenseSystem;
  }

  /**
   * Initiates a space battle at a planet.
   * @param planetID Planet where battle occurs
   * @param attackerFaction Attacking faction
   * @returns Space battle instance if combat initiated, null if no combat possible
   */
  public initiateSpaceBattle(planetID: number, attackerFaction: FactionType): SpaceBattle | null {
    // Get planet
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return null;
    }

    // Get craft at planet (excluding deployed craft like Solar Satellites)
    const allCraft = this.gameState.craft.filter(c => c.planetID === planetID && !c.isDeployed);

    // Get attacker and defender craft
    const attackerCraft = allCraft.filter(c => c.owner === attackerFaction).map(c => c.id);
    const defenderCraft = allCraft.filter(c => c.owner === planet.owner).map(c => c.id);

    // Need both sides to have craft
    if (attackerCraft.length === 0 || defenderCraft.length === 0) {
      return null;
    }

    // Check if defender has orbital defenses
    const hasOrbitalDefense = this.defenseSystem.getActiveDefensePlatformCount(planetID) > 0;

    // Create battle
    const battle = new SpaceBattle();
    battle.planetID = planetID;
    battle.planetName = planet.name;
    battle.attackerFaction = attackerFaction;
    battle.defenderFaction = planet.owner;
    battle.attackerCraftIDs = attackerCraft;
    battle.defenderCraftIDs = defenderCraft;
    battle.defenderHasOrbitalDefense = hasOrbitalDefense;

    this.onSpaceBattleStarted?.(battle);
    return battle;
  }

  /**
   * Executes space combat between two fleets.
   * @param battle Battle to execute
   * @returns Battle result
   */
  public executeSpaceCombat(battle: SpaceBattle): SpaceBattleResult {
    // Get craft entities
    const attackerFleet = battle.attackerCraftIDs
      .map(id => this.gameState.craftLookup.get(id))
      .filter(c => c !== undefined) as CraftEntity[];

    const defenderFleet = battle.defenderCraftIDs
      .map(id => this.gameState.craftLookup.get(id))
      .filter(c => c !== undefined) as CraftEntity[];

    // Calculate fleet strengths
    let attackerStrength = this.calculateFleetStrength(attackerFleet, battle.attackerFaction);
    let defenderStrength = this.calculateFleetStrength(defenderFleet, battle.defenderFaction);

    // Apply orbital defense bonus
    if (battle.defenderHasOrbitalDefense) {
      const defenseMultiplier = this.defenseSystem.getDefenseMultiplier(battle.planetID);
      defenderStrength = Math.floor(defenderStrength * defenseMultiplier);
    }

    // Determine winner (tie goes to attacker)
    const attackerWins = attackerStrength >= defenderStrength;

    // Calculate damage
    const winnerStrength = attackerWins ? attackerStrength : defenderStrength;
    const loserStrength = attackerWins ? defenderStrength : attackerStrength;
    const strengthRatio = winnerStrength / Math.max(1, loserStrength);
    const damagePerCraft = Math.floor((strengthRatio - 1.0) * 50);

    // Apply damage to losing fleet
    const losingFleet = attackerWins ? defenderFleet : attackerFleet;
    const craftDamage = new Map<number, number>();
    const destroyedCraftIDs: number[] = [];

    this.applyDamage(losingFleet, damagePerCraft, craftDamage, destroyedCraftIDs);

    // Remove destroyed craft from game state
    for (const craftID of destroyedCraftIDs) {
      const craft = this.gameState.craftLookup.get(craftID);
      if (craft) {
        const index = this.gameState.craft.indexOf(craft);
        if (index !== -1) {
          this.gameState.craft.splice(index, 1);
        }
        this.onCraftDestroyed?.(craftID, craft.owner);
      }
    }

    this.gameState.rebuildLookups();

    // Create result
    const result = new SpaceBattleResult();
    result.attackerWins = attackerWins;
    result.attackerStrength = attackerStrength;
    result.defenderStrength = defenderStrength;
    result.damagePerCraft = damagePerCraft;
    result.destroyedCraftIDs = destroyedCraftIDs;
    result.craftDamage = craftDamage;

    this.onSpaceBattleCompleted?.(battle, result);
    return result;
  }

  /**
   * Calculates total fleet strength.
   * @param fleet List of craft in fleet
   * @param faction Faction owning the fleet
   * @returns Total strength
   */
  private calculateFleetStrength(fleet: CraftEntity[], faction: FactionType): number {
    let totalStrength = 0;

    // Get weapon damage modifier for faction
    const weaponMod = this.upgradeSystem.getDamageModifier(faction);

    for (const craft of fleet) {
      const craftStrength = this.calculateCraftStrength(craft, weaponMod);
      totalStrength += craftStrength;
    }

    return totalStrength;
  }

  /**
   * Calculates strength for a single craft.
   * @param craft Craft to calculate
   * @param weaponMod Weapon damage modifier (from UpgradeSystem)
   * @returns Craft strength
   */
  private calculateCraftStrength(craft: CraftEntity, weaponMod: number): number {
    let baseStrength: number;

    switch (craft.type) {
      case CraftType.BattleCruiser:
        baseStrength = 100;
        break;
      case CraftType.CargoCruiser:
        baseStrength = 30;
        break;
      default:
        baseStrength = 0; // Solar Satellite and Atmosphere Processor don't participate in space combat
    }

    // Apply weapon modifier (Battle Cruiser only)
    if (craft.type === CraftType.BattleCruiser) {
      baseStrength = Math.floor(baseStrength * weaponMod);
    }

    // Apply damage modifier (current HP / max HP)
    const hpPercent = craft.health / 100; // Assume max HP is 100
    const strength = Math.floor(baseStrength * hpPercent);

    return strength;
  }

  /**
   * Applies damage to a fleet, distributing evenly across all craft.
   * Destroys craft when HP ≤ 0.
   * @param fleet Fleet to damage
   * @param damagePerCraft Damage per craft
   * @param craftDamage Output: Map of craft ID to damage taken
   * @param destroyedCraftIDs Output: List of destroyed craft IDs
   */
  private applyDamage(
    fleet: CraftEntity[],
    damagePerCraft: number,
    craftDamage: Map<number, number>,
    destroyedCraftIDs: number[]
  ): void {
    for (const craft of fleet) {
      // Apply damage
      craft.health -= damagePerCraft;
      craftDamage.set(craft.id, damagePerCraft);

      // Check if destroyed
      if (craft.health <= 0) {
        destroyedCraftIDs.push(craft.id);
      }
    }
  }

  /**
   * Gets all hostile craft at a planet (for detecting space battles).
   * @param planetID Planet ID
   * @param faction Faction to check against
   * @returns List of hostile craft IDs
   */
  public getHostileCraftAtPlanet(planetID: number, faction: FactionType): number[] {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return [];
    }

    return this.gameState.craft
      .filter(c => c.planetID === planetID && c.owner !== faction && !c.isDeployed)
      .map(c => c.id);
  }

  /**
   * Checks if a space battle should occur at a planet.
   * @param planetID Planet ID
   * @returns True if hostile fleets are present
   */
  public shouldSpaceBattleOccur(planetID: number): boolean {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return false;
    }

    const craft = this.gameState.craft.filter(c => c.planetID === planetID && !c.isDeployed);

    // Check if multiple factions have craft at this planet
    const factions = new Set(craft.map(c => c.owner));
    return factions.size > 1; // Battle if multiple factions present
  }
}
