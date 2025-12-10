import { GameState } from './GameState';
import { ResourceSystem } from './ResourceSystem';
import { IncomeSystem } from './IncomeSystem';
import { PopulationSystem } from './PopulationSystem';
import { BuildingSystem } from './BuildingSystem';
import { TurnPhase, FactionType } from './models/Enums';
import { ResourceDelta } from './models/ResourceModels';

/**
 * Result of phase processing
 */
export interface PhaseProcessingResult {
  success: boolean;
  processingTimeMs: number;
  error?: string;
}

/**
 * Result of Income phase processing
 */
export interface IncomePhaseResult extends PhaseProcessingResult {
  playerIncome: ResourceDelta;
  aiIncome: ResourceDelta;
}

/**
 * Result of End phase processing
 */
export interface EndPhaseResult extends PhaseProcessingResult {
  buildingsCompleted: number;
  populationGrowth: number;
}

/**
 * Phase Processor
 * Coordinates processing for each turn phase.
 * Story 2-3: Turn Phase Processing
 *
 * Processes:
 * - Income Phase: Resource generation for all factions
 * - Action Phase: No automated processing (player actions)
 * - Combat Phase: AI decisions and combat resolution (future)
 * - End Phase: Building progress, population growth
 */
export class PhaseProcessor {
  private readonly gameState: GameState;
  private readonly resourceSystem: ResourceSystem;
  private readonly incomeSystem: IncomeSystem;
  private readonly populationSystem: PopulationSystem;
  private readonly buildingSystem: BuildingSystem;

  // Events for UI notifications
  public onIncomeProcessed?: (playerIncome: ResourceDelta, aiIncome: ResourceDelta) => void;
  public onBuildingCompleted?: (planetId: number, buildingType: string) => void;
  public onPopulationGrowth?: (planetId: number, growth: number) => void;
  public onPhaseProcessingError?: (phase: TurnPhase, error: string) => void;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }

    this.gameState = gameState;
    this.resourceSystem = new ResourceSystem(gameState);
    this.incomeSystem = new IncomeSystem(gameState, this.resourceSystem);
    this.populationSystem = new PopulationSystem(gameState, this.resourceSystem);
    this.buildingSystem = new BuildingSystem(gameState);

    // Wire up building completion events
    this.buildingSystem.onBuildingCompleted = (planetId, buildingType) => {
      this.onBuildingCompleted?.(planetId, String(buildingType));
    };
  }

  /**
   * Processes a turn phase.
   * @param phase Phase to process
   * @returns Processing result
   */
  public processPhase(phase: TurnPhase): PhaseProcessingResult {
    const startTime = performance.now();

    try {
      switch (phase) {
        case TurnPhase.Income:
          return this.processIncomePhase();
        case TurnPhase.Action:
          return this.processActionPhase();
        case TurnPhase.Combat:
          return this.processCombatPhase();
        case TurnPhase.End:
          return this.processEndPhase();
        default:
          return {
            success: false,
            processingTimeMs: performance.now() - startTime,
            error: `Unknown phase: ${phase}`
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during phase processing';
      this.onPhaseProcessingError?.(phase, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Processes Income phase: generates resources for all factions.
   * NFR-P3: Must complete within 2 seconds.
   */
  public processIncomePhase(): IncomePhaseResult {
    const startTime = performance.now();

    try {
      // Calculate and apply income for player
      const playerIncome = this.incomeSystem.calculateFactionIncome(FactionType.Player);

      // Calculate and apply income for AI
      const aiIncome = this.incomeSystem.calculateFactionIncome(FactionType.AI);

      // Fire notification event
      this.onIncomeProcessed?.(playerIncome, aiIncome);

      const processingTime = performance.now() - startTime;

      // Warn if processing exceeded 2 seconds (NFR-P3)
      if (processingTime > 2000) {
        console.warn(`Income phase processing took ${processingTime}ms (target: <2000ms)`);
      }

      return {
        success: true,
        processingTimeMs: processingTime,
        playerIncome,
        aiIncome
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during income processing';
      this.onPhaseProcessingError?.(TurnPhase.Income, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage,
        playerIncome: new ResourceDelta(),
        aiIncome: new ResourceDelta()
      };
    }
  }

  /**
   * Processes Action phase: no automated processing.
   * Player takes manual actions during this phase.
   */
  public processActionPhase(): PhaseProcessingResult {
    // Action phase has no automated processing
    // Player manually performs actions (build, purchase, navigate)
    return {
      success: true,
      processingTimeMs: 0
    };
  }

  /**
   * Processes Combat phase: AI decisions and combat resolution.
   * NFR-P3: Must complete within 2 seconds.
   * Note: AI system integration is in Epic 7.
   */
  public processCombatPhase(): PhaseProcessingResult {
    const startTime = performance.now();

    try {
      // AI decision making will be integrated in Story 7-1
      // For now, just log and return success

      const processingTime = performance.now() - startTime;

      // Warn if processing exceeded 2 seconds (NFR-P3)
      if (processingTime > 2000) {
        console.warn(`Combat phase processing took ${processingTime}ms (target: <2000ms)`);
      }

      return {
        success: true,
        processingTimeMs: processingTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during combat processing';
      this.onPhaseProcessingError?.(TurnPhase.Combat, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Processes End phase: building progress, population growth.
   * NFR-P3: Must complete within 2 seconds.
   */
  public processEndPhase(): EndPhaseResult {
    const startTime = performance.now();
    let buildingsCompleted = 0;
    let totalPopulationGrowth = 0;

    try {
      // Track building completions via callback (MAJOR-7 fix: use try-finally for safe restoration)
      const originalCallback = this.buildingSystem.onBuildingCompleted;
      try {
        this.buildingSystem.onBuildingCompleted = (planetId, buildingType) => {
          buildingsCompleted++;
          originalCallback?.(planetId, buildingType);
        };

        // Process building construction progress (global method)
        this.buildingSystem.updateConstruction();
      } finally {
        // Always restore original callback, even if updateConstruction throws
        this.buildingSystem.onBuildingCompleted = originalCallback;
      }

      // Process population growth for each faction
      // Track population before/after to calculate growth
      const populationBefore = new Map<number, number>();
      for (const planet of this.gameState.planets) {
        populationBefore.set(planet.id, planet.population);
      }

      // Update population for Player faction
      this.populationSystem.updateFactionPopulation(FactionType.Player);
      // Update population for AI faction
      this.populationSystem.updateFactionPopulation(FactionType.AI);

      // Calculate growth and fire events
      for (const planet of this.gameState.planets) {
        const previousPop = populationBefore.get(planet.id) || 0;
        const growth = planet.population - previousPop;
        if (growth > 0) {
          totalPopulationGrowth += growth;
          this.onPopulationGrowth?.(planet.id, growth);
        }
      }

      const processingTime = performance.now() - startTime;

      // Warn if processing exceeded 2 seconds (NFR-P3)
      if (processingTime > 2000) {
        console.warn(`End phase processing took ${processingTime}ms (target: <2000ms)`);
      }

      return {
        success: true,
        processingTimeMs: processingTime,
        buildingsCompleted,
        populationGrowth: totalPopulationGrowth
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during end phase processing';
      this.onPhaseProcessingError?.(TurnPhase.End, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage,
        buildingsCompleted: 0,
        populationGrowth: 0
      };
    }
  }

  /**
   * Gets the IncomeSystem for external use.
   */
  public getIncomeSystem(): IncomeSystem {
    return this.incomeSystem;
  }

  /**
   * Gets the ResourceSystem for external use.
   */
  public getResourceSystem(): ResourceSystem {
    return this.resourceSystem;
  }

  /**
   * Gets the BuildingSystem for external use.
   */
  public getBuildingSystem(): BuildingSystem {
    return this.buildingSystem;
  }

  /**
   * Gets the PopulationSystem for external use.
   */
  public getPopulationSystem(): PopulationSystem {
    return this.populationSystem;
  }
}
