/**
 * VictoryConditionSystem - Evaluate scenario victory/defeat conditions
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Handles evaluation of various victory condition types including:
 * - defeat_enemy: All enemy planets captured
 * - build_structure: Build specific structures
 * - capture_planet: Capture specific or N planets
 * - survive_turns: Survive for N turns
 */

import { GameState } from './GameState';
import { VictoryCondition } from './models/ScenarioModels';
import { FactionType, BuildingType, BuildingStatus } from './models/Enums';

/**
 * Result of evaluating a single condition
 */
export interface ConditionResult {
  condition: VictoryCondition;
  met: boolean;
  progress: number; // 0-1 progress toward completion
  description: string;
}

/**
 * Result of evaluating all conditions
 */
export interface AllConditionsResult {
  allMet: boolean;
  conditions: ConditionResult[];
}

/**
 * Evaluates scenario victory conditions against current game state
 */
export class VictoryConditionSystem {
  /**
   * Evaluate a single victory condition
   * @param condition The condition to evaluate
   * @param gameState Current game state
   * @param startTurn Starting turn for survive_turns calculation (optional)
   * @returns ConditionResult with met status and progress
   */
  public evaluateCondition(
    condition: VictoryCondition,
    gameState: GameState,
    startTurn: number = 1,
  ): ConditionResult {
    switch (condition.type) {
      case 'defeat_enemy':
        return this.evaluateDefeatEnemy(condition, gameState);
      case 'build_structure':
        return this.evaluateBuildStructure(condition, gameState);
      case 'capture_planet':
        return this.evaluateCapturePlanet(condition, gameState);
      case 'capture_all_planets':
        return this.evaluateCaptureAllPlanets(condition, gameState);
      case 'survive_turns':
        return this.evaluateSurviveTurns(condition, gameState, startTurn);
      case 'resource_target':
        return this.evaluateResourceTarget(condition, gameState);
      case 'destroy_all_ships':
        return this.evaluateDestroyAllShips(condition, gameState);
      case 'ui_interaction':
        return this.evaluateUIInteraction(condition, gameState);
      case 'turn_reached':
        return this.evaluateTurnReached(condition, gameState);
      case 'commission_platoon':
        return this.evaluateCommissionPlatoon(condition, gameState);
      case 'move_ship':
        return this.evaluateMoveShip(condition, gameState);
      case 'deploy_atmosphere_processor':
        return this.evaluateDeployAtmosphereProcessor(condition, gameState);
      default:
        return {
          condition,
          met: false,
          progress: 0,
          description: `Unknown condition type: ${(condition as any).type}`,
        };
    }
  }

  /**
   * Evaluate all victory conditions
   * @param conditions Array of conditions to evaluate
   * @param gameState Current game state
   * @param startTurn Starting turn for survive_turns calculation
   * @returns AllConditionsResult with aggregated status
   */
  public evaluateAll(
    conditions: VictoryCondition[],
    gameState: GameState,
    startTurn: number = 1,
  ): AllConditionsResult {
    const results = conditions.map(c => this.evaluateCondition(c, gameState, startTurn));
    return {
      allMet: results.every(r => r.met),
      conditions: results,
    };
  }

  /**
   * Evaluate defeat_enemy condition
   * Victory when AI has no planets
   */
  private evaluateDefeatEnemy(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const totalPlanets = gameState.planets.length;

    // Progress = percentage of AI planets captured
    const aiPlanetsInState = gameState.planets.filter(p => p.owner === FactionType.AI).length;
    const capturedFromAI = totalPlanets > 0
      ? (totalPlanets - aiPlanetsInState) / totalPlanets
      : 1;

    return {
      condition,
      met: aiPlanetsInState === 0,
      progress: aiPlanetsInState === 0 ? 1 : capturedFromAI,
      description: aiPlanetsInState === 0
        ? 'All enemies defeated!'
        : `Defeat all enemies (${aiPlanetsInState} remaining)`,
    };
  }

  /**
   * Evaluate build_structure condition
   * Victory when player has built the required structure(s)
   */
  private evaluateBuildStructure(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const targetType = condition.target as BuildingType;
    const requiredCount = condition.count ?? 1;

    // Count active structures of the required type on player planets
    let activeCount = 0;
    let underConstructionCount = 0;

    for (const planetId of gameState.playerFaction.ownedPlanetIDs) {
      const planet = gameState.planetLookup.get(planetId);
      if (!planet) {continue;}

      for (const structure of planet.structures) {
        if (structure.type === targetType) {
          if (structure.status === BuildingStatus.Active) {
            activeCount++;
          } else if (structure.status === BuildingStatus.UnderConstruction) {
            underConstructionCount++;
          }
        }
      }
    }

    const met = activeCount >= requiredCount;
    // Progress includes partial credit for under construction
    const progress = Math.min(1, (activeCount + underConstructionCount * 0.5) / requiredCount);

    return {
      condition,
      met,
      progress: met ? 1 : progress,
      description: met
        ? `Built ${requiredCount} ${targetType}!`
        : `Build ${targetType} (${activeCount}/${requiredCount})`,
    };
  }

  /**
   * Evaluate capture_planet condition
   * Victory when player captures specific planet(s) or N total planets
   */
  private evaluateCapturePlanet(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    // If target specified, check for specific planet
    if (condition.target) {
      const targetPlanet = gameState.planets.find(p => p.name === condition.target);
      if (!targetPlanet) {
        return {
          condition,
          met: false,
          progress: 0,
          description: `Target planet "${condition.target}" not found`,
        };
      }

      const met = targetPlanet.owner === FactionType.Player;
      return {
        condition,
        met,
        progress: met ? 1 : 0,
        description: met
          ? `Captured ${condition.target}!`
          : `Capture ${condition.target}`,
      };
    }

    // If count specified, check for N total planets
    const requiredCount = condition.count ?? 1;
    const playerPlanetCount = gameState.playerFaction.ownedPlanetIDs.length;
    const met = playerPlanetCount >= requiredCount;
    const progress = Math.min(1, playerPlanetCount / requiredCount);

    return {
      condition,
      met,
      progress,
      description: met
        ? `Captured ${requiredCount} planets!`
        : `Capture ${requiredCount} planets (${playerPlanetCount}/${requiredCount})`,
    };
  }

  /**
   * Evaluate survive_turns condition
   * Victory when player survives for N turns
   */
  private evaluateSurviveTurns(
    condition: VictoryCondition,
    gameState: GameState,
    startTurn: number,
  ): ConditionResult {
    const requiredTurns = condition.turns ?? 10;
    const turnsSurvived = gameState.currentTurn - startTurn;
    const met = turnsSurvived >= requiredTurns;
    const progress = Math.min(1, turnsSurvived / requiredTurns);

    return {
      condition,
      met,
      progress,
      description: met
        ? `Survived ${requiredTurns} turns!`
        : `Survive ${requiredTurns} turns (${turnsSurvived}/${requiredTurns})`,
    };
  }

  /**
   * Evaluate resource_target condition (Story 8-1)
   * Victory when player reaches the specified resource amount
   */
  private evaluateResourceTarget(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const resourceType = condition.resource ?? 'credits';
    // Target can be string or number, parse it
    const targetAmount = typeof condition.target === 'string'
      ? parseInt(condition.target, 10)
      : (condition.target ?? 0);

    const resources = gameState.playerFaction.resources;
    // Get numeric resource value only (not methods)
    let currentAmount = 0;
    switch (resourceType) {
      case 'credits': currentAmount = resources.credits; break;
      case 'minerals': currentAmount = resources.minerals; break;
      case 'fuel': currentAmount = resources.fuel; break;
      case 'food': currentAmount = resources.food; break;
      case 'energy': currentAmount = resources.energy; break;
    }
    const met = currentAmount >= targetAmount;
    const progress = targetAmount > 0 ? Math.min(1, currentAmount / targetAmount) : 1;

    return {
      condition,
      met,
      progress: met ? 1 : progress,
      description: met
        ? `Reached ${targetAmount.toLocaleString()} ${resourceType}!`
        : `Reach ${targetAmount.toLocaleString()} ${resourceType} (${currentAmount.toLocaleString()}/${targetAmount.toLocaleString()})`,
    };
  }

  /**
   * Evaluate destroy_all_ships condition (Story 8-1)
   * Victory when all enemy spacecraft are destroyed
   */
  private evaluateDestroyAllShips(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const aiShips = gameState.craft.filter(c => c.owner === FactionType.AI);
    const met = aiShips.length === 0;

    // Progress is based on remaining ships (0 when all remain, 1 when none)
    // Since we don't track original ship count, progress is 0 until all destroyed
    const progress = met ? 1 : 0;

    return {
      condition,
      met,
      progress,
      description: met
        ? 'All enemy ships destroyed!'
        : `Destroy all enemy ships (${aiShips.length} remaining)`,
    };
  }

  /**
   * Evaluate capture_all_planets condition (Story 8-1)
   * Victory when player captures all planets (optionally within turn limit)
   */
  private evaluateCaptureAllPlanets(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const totalPlanets = gameState.planets.length;
    const playerPlanets = gameState.playerFaction.ownedPlanetIDs.length;
    const allCaptured = playerPlanets === totalPlanets;
    const progress = totalPlanets > 0 ? playerPlanets / totalPlanets : 1;

    // Check turn limit if specified
    if (condition.turnsLimit && gameState.currentTurn > condition.turnsLimit) {
      return {
        condition,
        met: false,
        progress,
        description: `Turn limit exceeded! Capture all planets within ${condition.turnsLimit} turns`,
      };
    }

    return {
      condition,
      met: allCaptured,
      progress: allCaptured ? 1 : progress,
      description: allCaptured
        ? 'All planets captured!'
        : `Capture all planets (${playerPlanets}/${totalPlanets})`,
    };
  }

  // ==================== Tutorial-specific conditions ====================

  /**
   * UI interaction tracking state
   * Tracks which UI interactions have been completed during the scenario
   */
  private completedUIInteractions: Set<string> = new Set();

  /**
   * Mark a UI interaction as completed
   * Called by UI components when the player performs the required action
   */
  public markUIInteractionComplete(target: string): void {
    this.completedUIInteractions.add(target);
  }

  /**
   * Check if a UI interaction has been completed
   */
  public isUIInteractionComplete(target: string): boolean {
    return this.completedUIInteractions.has(target);
  }

  /**
   * Reset UI interaction tracking (for new scenario)
   */
  public resetUIInteractions(): void {
    this.completedUIInteractions.clear();
  }

  /**
   * Evaluate ui_interaction condition
   * Victory when specific UI action is performed (e.g., opening a panel)
   */
  private evaluateUIInteraction(
    condition: VictoryCondition,
    _gameState: GameState,
  ): ConditionResult {
    const target = condition.target as string ?? 'unknown';
    const met = this.completedUIInteractions.has(target);

    // Format target for display (convert snake_case to readable)
    const displayTarget = target.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return {
      condition,
      met,
      progress: met ? 1 : 0,
      description: met
        ? `${displayTarget} ✓`
        : displayTarget,
    };
  }

  /**
   * Evaluate turn_reached condition
   * Victory when player reaches a specific turn
   */
  private evaluateTurnReached(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const targetTurn = typeof condition.target === 'number' ? condition.target : 3;
    const currentTurn = gameState.currentTurn;
    const met = currentTurn >= targetTurn;
    const progress = Math.min(1, currentTurn / targetTurn);

    return {
      condition,
      met,
      progress,
      description: met
        ? `Reached turn ${targetTurn}!`
        : `Reach turn ${targetTurn} (currently turn ${currentTurn})`,
    };
  }

  /**
   * Evaluate commission_platoon condition
   * Victory when player commissions N platoons
   */
  private evaluateCommissionPlatoon(
    condition: VictoryCondition,
    gameState: GameState,
  ): ConditionResult {
    const requiredCount = condition.count ?? 1;

    // Count player platoons on player-owned planets or in player craft
    const playerPlanetIds = new Set(gameState.playerFaction.ownedPlanetIDs);
    const platoonCount = gameState.platoons.filter(p =>
      playerPlanetIds.has(p.planetID) || p.planetID === -1, // on player planet or embarked
    ).length;

    const met = platoonCount >= requiredCount;
    const progress = Math.min(1, platoonCount / requiredCount);

    return {
      condition,
      met,
      progress,
      description: met
        ? `Commissioned ${requiredCount} platoon(s)!`
        : `Commission ${requiredCount} platoon(s) (${platoonCount}/${requiredCount})`,
    };
  }

  /**
   * Evaluate move_ship condition
   * Victory when player moves a ship to another planet
   */
  private evaluateMoveShip(
    condition: VictoryCondition,
    _gameState: GameState,
  ): ConditionResult {
    const requiredCount = condition.count ?? 1;
    // Track ship movements via UI interaction system
    const movesMade = this.completedUIInteractions.has('ship_moved') ? 1 : 0;
    const met = movesMade >= requiredCount;

    return {
      condition,
      met,
      progress: met ? 1 : 0,
      description: met
        ? `Moved ${requiredCount} ship(s)!`
        : `Move ${requiredCount} ship(s) to another planet`,
    };
  }

  /**
   * Evaluate deploy_atmosphere_processor condition
   * Victory when player deploys an atmosphere processor
   */
  private evaluateDeployAtmosphereProcessor(
    condition: VictoryCondition,
    _gameState: GameState,
  ): ConditionResult {
    // Track via UI interaction system
    const deployed = this.completedUIInteractions.has('atmosphere_processor_deployed');

    return {
      condition,
      met: deployed,
      progress: deployed ? 1 : 0,
      description: deployed
        ? 'Atmosphere Processor deployed!'
        : 'Deploy an Atmosphere Processor on a neutral planet',
    };
  }
}
