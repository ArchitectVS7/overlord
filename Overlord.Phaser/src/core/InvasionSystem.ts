import { GameState } from './GameState';
import { CombatSystem } from './CombatSystem';
import { FactionType, CraftType, BuildingStatus } from './models/Enums';
import { InvasionResult } from './models/CombatModels';
import { ResourceDelta } from './models/ResourceModels';
import { PlanetEntity } from './models/PlanetEntity';

/**
 * Platform-agnostic invasion system.
 * Handles planetary invasions, ground combat, and planet capture.
 */
export class InvasionSystem {
  private readonly gameState: GameState;
  private readonly combatSystem: CombatSystem;

  /**
   * Event fired when invasion starts.
   * Parameters: (planetID, attackerFaction)
   */
  public onInvasionStarted?: (planetID: number, attackerFaction: FactionType) => void;

  /**
   * Event fired when planet is captured.
   * Parameters: (planetID, newOwner, capturedResources)
   */
  public onPlanetCaptured?: (planetID: number, newOwner: FactionType, capturedResources: ResourceDelta) => void;

  /**
   * Event fired when platoons land.
   * Parameters: (planetID, platoonCount, totalTroops)
   */
  public onPlatoonsLanded?: (planetID: number, platoonCount: number, totalTroops: number) => void;

  constructor(gameState: GameState, combatSystem: CombatSystem) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    if (!combatSystem) {
      throw new Error('combatSystem cannot be null or undefined');
    }

    this.gameState = gameState;
    this.combatSystem = combatSystem;
  }

  /**
   * Executes planetary invasion.
   * @param planetID Target planet ID
   * @param attackerFaction Attacking faction
   * @param aggressionPercent Attacker aggression (0-100)
   * @returns Invasion result if successful, null if failed
   */
  public invadePlanet(
    planetID: number,
    attackerFaction: FactionType,
    aggressionPercent: number = 100
  ): InvasionResult | null {
    // Get planet
    const planet = this.gameState.planetLookup.get(planetID);
    if (!planet) {
      return null;
    }

    // Cannot invade own planet
    if (planet.owner === attackerFaction) {
      return null;
    }

    // Must control orbit (no enemy craft)
    if (!this.hasOrbitalControl(planetID, attackerFaction)) {
      return null;
    }

    // Get invasion force (platoons aboard Battle Cruisers)
    const attackingPlatoonIDs = this.getInvasionForce(planetID, attackerFaction);
    if (attackingPlatoonIDs.length === 0) {
      return null; // No platoons to invade
    }

    // Get defender garrison
    const defendingPlatoonIDs = this.combatSystem.getDefendingPlatoons(planetID);

    this.onInvasionStarted?.(planetID, attackerFaction);

    // Fire platoons landed event
    const totalTroops = attackingPlatoonIDs
      .map(id => {
        const platoon = this.gameState.platoonLookup.get(id);
        return platoon ? platoon.troopCount : 0;
      })
      .reduce((sum, count) => sum + count, 0);
    this.onPlatoonsLanded?.(planetID, attackingPlatoonIDs.length, totalTroops);

    // Check for undefended planet (instant surrender)
    if (defendingPlatoonIDs.length === 0) {
      const capturedResources = this.capturePlanet(planet, attackerFaction, attackingPlatoonIDs);

      const result = new InvasionResult();
      result.attackerWins = true;
      result.planetCaptured = true;
      result.instantSurrender = true;
      result.attackerCasualties = 0;
      result.defenderCasualties = 0;
      result.newPopulation = planet.population;
      result.newMorale = planet.morale;
      result.capturedResources = capturedResources;

      return result;
    }

    // Execute ground combat (uses CombatSystem)
    const battle = this.combatSystem.initiateBattle(planetID, attackerFaction, attackingPlatoonIDs);
    if (!battle) {
      return null; // Battle failed to initiate
    }

    const combatResult = this.combatSystem.executeCombat(battle, aggressionPercent);

    // Resolve invasion outcome
    let resources: ResourceDelta | null = null;
    if (combatResult.attackerWins) {
      // Attacker victory: Capture planet
      resources = this.capturePlanet(planet, attackerFaction, attackingPlatoonIDs);
    }

    // Create result
    const result = new InvasionResult();
    result.attackerWins = combatResult.attackerWins;
    result.planetCaptured = combatResult.planetCaptured;
    result.instantSurrender = false;
    result.attackerCasualties = combatResult.attackerCasualties;
    result.defenderCasualties = combatResult.defenderCasualties;
    result.newPopulation = planet.population;
    result.newMorale = planet.morale;
    result.capturedResources = resources;

    return result;
  }

  /**
   * Captures planet (transfers ownership and resources).
   * @param planet Planet to capture
   * @param newOwner New owner faction
   * @param survivingPlatoonIDs IDs of surviving attacker platoons
   * @returns Captured resources
   */
  private capturePlanet(planet: PlanetEntity, newOwner: FactionType, survivingPlatoonIDs: number[]): ResourceDelta {
    // Transfer ownership
    planet.owner = newOwner;

    // Reduce morale (occupation penalty: -30%)
    planet.morale = Math.max(0, planet.morale - 30);

    // Capture resources
    const capturedResources = new ResourceDelta();
    capturedResources.credits = planet.resources.credits;
    capturedResources.minerals = planet.resources.minerals;
    capturedResources.fuel = planet.resources.fuel;
    capturedResources.food = planet.resources.food;

    // Clear planet stockpiles (resources transferred to attacker faction)
    planet.resources.credits = 0;
    planet.resources.minerals = 0;
    planet.resources.fuel = 0;
    planet.resources.food = 0;

    // Add resources to attacker faction
    const factionState = newOwner === FactionType.Player ? this.gameState.playerFaction : this.gameState.aiFaction;
    factionState.resources.add(capturedResources);

    // Deactivate all buildings (need new crew assignment)
    for (const structure of planet.structures) {
      if (structure.status === BuildingStatus.Active) {
        structure.status = BuildingStatus.Damaged;
      }
    }

    // Garrison surviving platoons
    for (const platoonID of survivingPlatoonIDs) {
      const platoon = this.gameState.platoonLookup.get(platoonID);
      if (platoon) {
        platoon.planetID = planet.id;

        // Remove from any craft (disembark)
        const craft = this.gameState.craft.find(c => c.carriedPlatoonIDs.includes(platoonID));
        if (craft) {
          const index = craft.carriedPlatoonIDs.indexOf(platoonID);
          if (index !== -1) {
            craft.carriedPlatoonIDs.splice(index, 1);
          }
        }
      }
    }

    this.gameState.rebuildLookups();

    this.onPlanetCaptured?.(planet.id, newOwner, capturedResources);
    return capturedResources;
  }

  /**
   * Gets invasion force (platoons aboard Battle Cruisers in orbit).
   * @param planetID Planet ID
   * @param faction Faction
   * @returns List of platoon IDs
   */
  private getInvasionForce(planetID: number, faction: FactionType): number[] {
    const platoonIDs: number[] = [];

    // Get Battle Cruisers in orbit
    const battleCruisers = this.gameState.craft.filter(
      c => c.planetID === planetID && c.owner === faction && c.type === CraftType.BattleCruiser && !c.isDeployed
    );

    // Get all platoons aboard these ships
    for (const cruiser of battleCruisers) {
      platoonIDs.push(...cruiser.carriedPlatoonIDs);
    }

    return platoonIDs;
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
}
