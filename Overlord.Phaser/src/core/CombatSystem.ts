import { GameState } from './GameState';
import { PlatoonSystem } from './PlatoonSystem';
import { FactionType, CraftType } from './models/Enums';
import { Battle, BattleResult } from './models/CombatModels';
import { PlatoonEntity } from './models/PlatoonEntity';

/**
 * Platform-agnostic ground combat system.
 * Handles platoon vs platoon combat, casualty calculations, and planet ownership transfer.
 */
export class CombatSystem {
  private readonly gameState: GameState;
  private readonly platoonSystem: PlatoonSystem;

  /**
   * Event fired when battle starts.
   * Parameters: (battle)
   */
  public onBattleStarted?: (battle: Battle) => void;

  /**
   * Event fired when battle completes.
   * Parameters: (battle, result)
   */
  public onBattleCompleted?: (battle: Battle, result: BattleResult) => void;

  /**
   * Event fired when planet is captured.
   * Parameters: (planetID, newOwner)
   */
  public onPlanetCaptured?: (planetID: number, newOwner: FactionType) => void;

  constructor(gameState: GameState, platoonSystem: PlatoonSystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!platoonSystem) {
      throw new Error('platoonSystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.platoonSystem = platoonSystem;
  }

  /**
   * Initiates a ground battle at a planet.
   * @param planetID Planet where battle occurs
   * @param attackerFaction Attacking faction
   * @param attackingPlatoonIDs Platoon IDs of attackers
   * @returns Battle instance if combat initiated, null if no combat possible
   */
  public initiateBattle(
    planetID: number,
    attackerFaction: FactionType,
    attackingPlatoonIDs: number[],
  ): Battle | null {
    // Get planet
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return null;
    }

    // Get defending platoons (garrisoned on planet, owned by defender)
    const defendingPlatoonIDs = this.gameState.platoons
      .filter(p => p.planetID === planetID && p.owner === planet.owner)
      .map(p => p.id);

    // Need both sides to have forces
    if (attackingPlatoonIDs.length === 0 || defendingPlatoonIDs.length === 0) {
      return null;
    }

    // Create battle
    const battle = new Battle();
    battle.planetID = planetID;
    battle.planetName = planet.name;
    battle.attackerFaction = attackerFaction;
    battle.defenderFaction = planet.owner;
    battle.attackingPlatoonIDs = attackingPlatoonIDs;
    battle.defendingPlatoonIDs = defendingPlatoonIDs;

    this.onBattleStarted?.(battle);
    return battle;
  }

  /**
   * Executes ground combat.
   * @param battle Battle to execute
   * @param aggressionPercent Attacker aggression (0-100)
   * @returns Battle result
   */
  public executeCombat(battle: Battle, aggressionPercent: number = 50): BattleResult {
    // Clamp aggression
    aggressionPercent = Math.max(0, Math.min(100, aggressionPercent));

    // Get platoons
    const attackers = battle.attackingPlatoonIDs
      .map(id => this.gameState.platoonLookup.get(id))
      .filter(p => p !== undefined) as PlatoonEntity[];

    const defenders = battle.defendingPlatoonIDs
      .map(id => this.gameState.platoonLookup.get(id))
      .filter(p => p !== undefined) as PlatoonEntity[];

    // Calculate military strengths
    let attackerStrength = this.calculateStrength(attackers);
    const defenderStrength = this.calculateStrength(defenders);

    // Apply aggression modifier (0.8 to 1.2)
    const aggressionMod = 0.8 + (aggressionPercent / 100) * 0.4;
    attackerStrength = Math.floor(attackerStrength * aggressionMod);

    // Determine winner
    const attackerWins = attackerStrength > defenderStrength;

    // Calculate casualties
    const attackerCasualties = this.calculateCasualties(
      attackers,
      attackerStrength,
      defenderStrength,
      attackerWins,
      aggressionPercent,
    );
    const defenderCasualties = this.calculateCasualties(
      defenders,
      defenderStrength,
      attackerStrength,
      !attackerWins,
      50,
    ); // AI uses 50%

    // Apply casualties
    this.applyCasualties(attackers, attackerCasualties);
    this.applyCasualties(defenders, defenderCasualties);

    // Combine casualty maps
    const allCasualties = new Map<number, number>(attackerCasualties);
    defenderCasualties.forEach((value, key) => {
      allCasualties.set(key, value);
    });

    // Create result
    const result = new BattleResult();
    result.attackerWins = attackerWins;
    result.attackerStrength = attackerStrength;
    result.defenderStrength = defenderStrength;
    result.attackerCasualties = Array.from(attackerCasualties.values()).reduce((sum, val) => sum + val, 0);
    result.defenderCasualties = Array.from(defenderCasualties.values()).reduce((sum, val) => sum + val, 0);
    result.planetCaptured = attackerWins;
    result.platoonCasualties = allCasualties;

    // Transfer planet ownership if attacker wins
    if (attackerWins) {
      const planet = this.gameState.planetLookup.get(battle.planetID);
      if (planet) {
        planet.owner = battle.attackerFaction;
      }

      // Destroy defender platoons
      for (const platoon of defenders) {
        const index = this.gameState.platoons.indexOf(platoon);
        if (index !== -1) {
          this.gameState.platoons.splice(index, 1);
        }
      }

      this.gameState.rebuildLookups();

      this.onPlanetCaptured?.(battle.planetID, battle.attackerFaction);
    } else {
      // Destroy attacker platoons
      for (const platoon of attackers) {
        const index = this.gameState.platoons.indexOf(platoon);
        if (index !== -1) {
          this.gameState.platoons.splice(index, 1);
        }
      }

      this.gameState.rebuildLookups();
    }

    this.onBattleCompleted?.(battle, result);
    return result;
  }

  /**
   * Calculates total military strength for a list of platoons.
   */
  private calculateStrength(platoons: PlatoonEntity[]): number {
    let totalStrength = 0;

    for (const platoon of platoons) {
      totalStrength += this.platoonSystem.calculateMilitaryStrength(platoon);
    }

    return totalStrength;
  }

  /**
   * Calculates casualties for each platoon.
   * @param platoons Platoons in combat
   * @param ownStrength Own total strength
   * @param enemyStrength Enemy total strength
   * @param isWinner Is this side the winner
   * @param aggressionPercent Aggression percentage
   * @returns Map of platoon ID to troop losses
   */
  private calculateCasualties(
    platoons: PlatoonEntity[],
    ownStrength: number,
    enemyStrength: number,
    isWinner: boolean,
    aggressionPercent: number,
  ): Map<number, number> {
    const casualties = new Map<number, number>();

    const baseCasualtyRate = 0.2; // 20%
    const strengthRatio = enemyStrength / Math.max(1, ownStrength);

    // Aggression increases casualties
    const aggressionMod = 1.0 + ((aggressionPercent - 50) / 100) * 0.5; // 0.75 to 1.25

    // Winner vs loser casualty rates
    let casualtyRate: number;
    if (isWinner) {
      casualtyRate = Math.max(0.1, Math.min(0.3, baseCasualtyRate * strengthRatio * aggressionMod)); // 10-30%
    } else {
      casualtyRate = Math.max(0.5, Math.min(0.9, baseCasualtyRate * strengthRatio * aggressionMod * 2)); // 50-90%
    }

    // Apply casualties to each platoon
    for (const platoon of platoons) {
      const troopLoss = Math.floor(platoon.troopCount * casualtyRate);
      casualties.set(platoon.id, troopLoss);
    }

    return casualties;
  }

  /**
   * Applies casualties to platoons (reduces troop counts).
   */
  private applyCasualties(platoons: PlatoonEntity[], casualties: Map<number, number>): void {
    for (const platoon of platoons) {
      const loss = casualties.get(platoon.id);
      if (loss !== undefined) {
        platoon.troopCount = Math.max(0, platoon.troopCount - loss);

        // Recalculate strength
        platoon.strength = this.platoonSystem.calculateMilitaryStrength(platoon);
      }
    }
  }

  /**
   * Gets attacking platoons at a planet (on Battle Cruisers).
   * @param planetID Planet ID
   * @param attackerFaction Attacking faction
   * @returns List of attacking platoon IDs
   */
  public getAttackingPlatoons(planetID: number, attackerFaction: FactionType): number[] {
    const attackingPlatoonIDs: number[] = [];

    // Get craft at planet
    const craft = this.gameState.craft.filter(c => c.planetID === planetID);

    for (const c of craft) {
      // Only Battle Cruisers from attacker faction
      if (c.type === CraftType.BattleCruiser && c.owner === attackerFaction) {
        // Get platoons on board
        attackingPlatoonIDs.push(...c.carriedPlatoonIDs);
      }
    }

    return attackingPlatoonIDs;
  }

  /**
   * Gets defending platoons at a planet (garrisoned on surface).
   * @param planetID Planet ID
   * @returns List of defending platoon IDs
   */
  public getDefendingPlatoons(planetID: number): number[] {
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return [];
    }

    return this.gameState.platoons
      .filter(p => p.planetID === planetID && p.owner === planet.owner)
      .map(p => p.id);
  }
}
