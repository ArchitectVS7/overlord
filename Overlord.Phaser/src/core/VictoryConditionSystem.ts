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
    startTurn: number = 1
  ): ConditionResult {
    switch (condition.type) {
      case 'defeat_enemy':
        return this.evaluateDefeatEnemy(condition, gameState);
      case 'build_structure':
        return this.evaluateBuildStructure(condition, gameState);
      case 'capture_planet':
        return this.evaluateCapturePlanet(condition, gameState);
      case 'survive_turns':
        return this.evaluateSurviveTurns(condition, gameState, startTurn);
      default:
        return {
          condition,
          met: false,
          progress: 0,
          description: `Unknown condition type: ${(condition as any).type}`
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
    startTurn: number = 1
  ): AllConditionsResult {
    const results = conditions.map(c => this.evaluateCondition(c, gameState, startTurn));
    return {
      allMet: results.every(r => r.met),
      conditions: results
    };
  }

  /**
   * Evaluate defeat_enemy condition
   * Victory when AI has no planets
   */
  private evaluateDefeatEnemy(
    condition: VictoryCondition,
    gameState: GameState
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
        : `Defeat all enemies (${aiPlanetsInState} remaining)`
    };
  }

  /**
   * Evaluate build_structure condition
   * Victory when player has built the required structure(s)
   */
  private evaluateBuildStructure(
    condition: VictoryCondition,
    gameState: GameState
  ): ConditionResult {
    const targetType = condition.target as BuildingType;
    const requiredCount = condition.count ?? 1;

    // Count active structures of the required type on player planets
    let activeCount = 0;
    let underConstructionCount = 0;

    for (const planetId of gameState.playerFaction.ownedPlanetIDs) {
      const planet = gameState.planetLookup.get(planetId);
      if (!planet) continue;

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
        : `Build ${targetType} (${activeCount}/${requiredCount})`
    };
  }

  /**
   * Evaluate capture_planet condition
   * Victory when player captures specific planet(s) or N total planets
   */
  private evaluateCapturePlanet(
    condition: VictoryCondition,
    gameState: GameState
  ): ConditionResult {
    // If target specified, check for specific planet
    if (condition.target) {
      const targetPlanet = gameState.planets.find(p => p.name === condition.target);
      if (!targetPlanet) {
        return {
          condition,
          met: false,
          progress: 0,
          description: `Target planet "${condition.target}" not found`
        };
      }

      const met = targetPlanet.owner === FactionType.Player;
      return {
        condition,
        met,
        progress: met ? 1 : 0,
        description: met
          ? `Captured ${condition.target}!`
          : `Capture ${condition.target}`
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
        : `Capture ${requiredCount} planets (${playerPlanetCount}/${requiredCount})`
    };
  }

  /**
   * Evaluate survive_turns condition
   * Victory when player survives for N turns
   */
  private evaluateSurviveTurns(
    condition: VictoryCondition,
    gameState: GameState,
    startTurn: number
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
        : `Survive ${requiredTurns} turns (${turnsSurvived}/${requiredTurns})`
    };
  }
}
