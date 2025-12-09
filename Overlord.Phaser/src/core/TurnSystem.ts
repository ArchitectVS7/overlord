import { GameState } from './GameState';
import { TurnPhase, VictoryResult, FactionType } from './models/Enums';
import { ResourceDelta } from './models/ResourceModels';

/**
 * Manages turn-based game loop with Income, Action, Combat, and End phases.
 * Platform-agnostic implementation.
 * Simplified version without Platoon/Faction dependencies.
 */
export class TurnSystem {
  private readonly gameState: GameState;

  /**
   * Fired when a turn phase changes.
   */
  public onPhaseChanged?: (phase: TurnPhase) => void;

  /**
   * Fired when a new turn begins (after turn counter increments).
   */
  public onTurnStarted?: (turn: number) => void;

  /**
   * Fired when a turn ends (before turn counter increments).
   */
  public onTurnEnded?: (turn: number) => void;

  /**
   * Fired when victory or defeat condition is met.
   */
  public onVictoryAchieved?: (result: VictoryResult) => void;

  /**
   * Fired when income is calculated for a phase.
   */
  public onIncomeCalculated?: (income: ResourceDelta) => void;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }
    this.gameState = gameState;
  }

  /**
   * Advances to the next turn phase.
   * Call this when the player presses "End Turn" during Action phase.
   */
  public advancePhase(): void {
    const currentPhase = this.gameState.currentPhase;

    switch (currentPhase) {
      case TurnPhase.Income:
        // Auto-transition to Action phase after income calculation
        this.transitionToPhase(TurnPhase.Action);
        break;

      case TurnPhase.Action:
        // Player ended their turn, move to Combat phase
        this.transitionToPhase(TurnPhase.Combat);
        break;

      case TurnPhase.Combat:
        // Combat resolved, move to End phase
        this.transitionToPhase(TurnPhase.End);
        break;

      case TurnPhase.End:
        // End phase complete, start new turn at Income phase
        this.completeTurn();
        break;
    }
  }

  /**
   * Processes the Income phase (resource generation, population growth).
   * Returns the total income delta for the active faction.
   * Simplified version - actual income calculated by IncomeSystem/TaxationSystem.
   */
  public processIncomePhase(): ResourceDelta {
    if (this.gameState.currentPhase !== TurnPhase.Income) {
      throw new Error(`Cannot process income during ${this.gameState.currentPhase} phase`);
    }

    // Placeholder income (will be calculated by IncomeSystem/TaxationSystem in full implementation)
    const income = new ResourceDelta();
    income.credits = 1000;
    income.minerals = 500;
    income.fuel = 300;
    income.food = 200;
    income.energy = 400;

    this.onIncomeCalculated?.(income);

    return income;
  }

  /**
   * Checks victory/defeat conditions.
   * Simplified version without Platoon dependencies.
   * Returns None if game should continue.
   */
  public checkVictoryConditions(): VictoryResult {
    // Player Victory: AI has zero owned planets
    const aiPlanets = this.gameState.planets.filter(p => p.owner === FactionType.AI).length;

    if (aiPlanets === 0) {
      return VictoryResult.PlayerVictory;
    }

    // Player Defeat: Player has zero owned planets
    const playerPlanets = this.gameState.planets.filter(p => p.owner === FactionType.Player).length;

    if (playerPlanets === 0) {
      return VictoryResult.AIVictory;
    }

    return VictoryResult.None;
  }

  /**
   * Starts a new game, initializing to turn 1 at Income phase.
   * Income phase auto-advances to Action phase after processing.
   */
  public startNewGame(): void {
    this.gameState.currentTurn = 1;
    this.gameState.lastActionTime = new Date();

    this.onTurnStarted?.(this.gameState.currentTurn);

    // Transition to Income phase (which will auto-advance to Action)
    this.transitionToPhase(TurnPhase.Income);
  }

  /**
   * Gets the current turn number.
   */
  public get currentTurn(): number {
    return this.gameState.currentTurn;
  }

  /**
   * Gets the current turn phase.
   */
  public get currentPhase(): TurnPhase {
    return this.gameState.currentPhase;
  }

  private transitionToPhase(newPhase: TurnPhase): void {
    this.gameState.currentPhase = newPhase;
    this.gameState.lastActionTime = new Date();

    this.onPhaseChanged?.(newPhase);

    // Auto-advance Income phase
    if (newPhase === TurnPhase.Income) {
      this.processIncomePhase();
      this.advancePhase(); // Auto-transition to Action
    }
  }

  private completeTurn(): void {
    // Check victory conditions before ending turn
    const victoryResult = this.checkVictoryConditions();
    if (victoryResult !== VictoryResult.None) {
      this.onVictoryAchieved?.(victoryResult);
      return; // Game ends, don't increment turn
    }

    // Fire turn ended event
    this.onTurnEnded?.(this.gameState.currentTurn);

    // Increment turn counter
    this.gameState.currentTurn++;
    this.gameState.lastActionTime = new Date();

    // Fire turn started event
    this.onTurnStarted?.(this.gameState.currentTurn);

    // Transition to Income phase (which auto-advances to Action)
    this.transitionToPhase(TurnPhase.Income);
  }
}
