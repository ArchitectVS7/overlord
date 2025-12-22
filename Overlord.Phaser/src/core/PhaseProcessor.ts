import { GameState } from './GameState';
import { ResourceSystem } from './ResourceSystem';
import { IncomeSystem } from './IncomeSystem';
import { PopulationSystem } from './PopulationSystem';
import { BuildingSystem } from './BuildingSystem';
import { DefenseSystem } from './DefenseSystem';
import { UpgradeSystem } from './UpgradeSystem';
import { SpaceCombatSystem } from './SpaceCombatSystem';
import { InvasionSystem } from './InvasionSystem';
import { CombatSystem } from './CombatSystem';
import { PlatoonSystem } from './PlatoonSystem';
import { AIDecisionSystem } from './AIDecisionSystem';
import { TaxationSystem } from './TaxationSystem';
import { TurnPhase, FactionType, VictoryResult, CraftType } from './models/Enums';
import { ResourceDelta } from './models/ResourceModels';
import { SpaceBattle, SpaceBattleResult, InvasionResult } from './models/CombatModels';

// Note: CombatSystem and PlatoonSystem imported for configureInvasionSystem() API compatibility
// The InvasionSystem already has internal references to these systems

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
  victoryResult: VictoryResult;
  aiTurnProcessed: boolean;
}

/**
 * Result of Combat phase processing
 */
export interface CombatPhaseResult extends PhaseProcessingResult {
  battlesResolved: number;
  craftsDestroyed: number;
  invasionsProcessed: number;
  planetsCaptured: number;
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
 * - End Phase: AI turn and victory checks
 */
export class PhaseProcessor {
  private readonly gameState: GameState;
  private readonly resourceSystem: ResourceSystem;
  private readonly incomeSystem: IncomeSystem;
  private readonly populationSystem: PopulationSystem;
  private readonly buildingSystem: BuildingSystem;
  private readonly defenseSystem: DefenseSystem;
  private readonly upgradeSystem: UpgradeSystem;
  private readonly spaceCombatSystem: SpaceCombatSystem;
  private readonly taxationSystem: TaxationSystem;
  private aiDecisionSystem?: AIDecisionSystem;
  private invasionSystem?: InvasionSystem;
  private victoryChecker?: () => VictoryResult;
  private onVictoryAchieved?: (result: VictoryResult) => void;

  // Events for UI notifications
  public onIncomeProcessed?: (playerIncome: ResourceDelta, aiIncome: ResourceDelta) => void;
  public onBuildingCompleted?: (planetId: number, buildingType: string) => void;
  public onPopulationGrowth?: (planetId: number, growth: number) => void;
  public onPhaseProcessingError?: (phase: TurnPhase, error: string) => void;

  // Combat events
  public onSpaceBattleStarted?: (battle: SpaceBattle) => void;
  public onSpaceBattleCompleted?: (battle: SpaceBattle, result: SpaceBattleResult) => void;
  public onCraftDestroyed?: (craftID: number, owner: FactionType) => void;

  // Invasion events
  public onInvasionStarted?: (planetID: number, attackerFaction: FactionType) => void;
  public onInvasionCompleted?: (planetID: number, result: InvasionResult) => void;
  public onPlanetCaptured?: (planetID: number, newOwner: FactionType, capturedResources: ResourceDelta) => void;

  // Tax events
  public onTaxRevenueCalculated?: (planetID: number, revenue: number) => void;

  constructor(gameState: GameState) {
    if (!gameState) {
      throw new Error('gameState cannot be null or undefined');
    }

    this.gameState = gameState;
    this.resourceSystem = new ResourceSystem(gameState);
    this.incomeSystem = new IncomeSystem(gameState, this.resourceSystem);
    this.populationSystem = new PopulationSystem(gameState, this.resourceSystem);
    this.buildingSystem = new BuildingSystem(gameState);
    this.defenseSystem = new DefenseSystem(gameState);
    this.upgradeSystem = new UpgradeSystem(gameState);
    this.spaceCombatSystem = new SpaceCombatSystem(gameState, this.upgradeSystem, this.defenseSystem);
    this.taxationSystem = new TaxationSystem(gameState, this.resourceSystem);

    // Wire up building completion events
    this.buildingSystem.onBuildingCompleted = (planetId, buildingType) => {
      this.onBuildingCompleted?.(planetId, String(buildingType));
    };

    // Wire up combat events
    this.spaceCombatSystem.onSpaceBattleStarted = battle => {
      this.onSpaceBattleStarted?.(battle);
    };
    this.spaceCombatSystem.onSpaceBattleCompleted = (battle, result) => {
      this.onSpaceBattleCompleted?.(battle, result);
    };
    this.spaceCombatSystem.onCraftDestroyed = (craftID, owner) => {
      this.onCraftDestroyed?.(craftID, owner);
    };

    // Wire up taxation events
    this.taxationSystem.onTaxRevenueCalculated = (planetID, revenue) => {
      this.onTaxRevenueCalculated?.(planetID, revenue);
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
            error: `Unknown phase: ${phase}`,
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during phase processing';
      this.onPhaseProcessingError?.(phase, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage,
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
      // Calculate and apply income for player (production resources)
      const playerIncome = this.incomeSystem.calculateFactionIncome(FactionType.Player);

      // Calculate and apply tax revenue for player (credits)
      const playerTaxRevenue = this.taxationSystem.calculateFactionTaxRevenue(FactionType.Player);
      playerIncome.credits += playerTaxRevenue;

      // Apply total income to Player Faction (Global Economy)
      this.gameState.playerFaction.resources.add(playerIncome);

      // Calculate and apply income for AI (production resources)
      const aiIncome = this.incomeSystem.calculateFactionIncome(FactionType.AI);

      // Calculate and apply tax revenue for AI (credits)
      const aiTaxRevenue = this.taxationSystem.calculateFactionTaxRevenue(FactionType.AI);
      aiIncome.credits += aiTaxRevenue;

      // Apply total income to AI Faction (Global Economy)
      this.gameState.aiFaction.resources.add(aiIncome);

      // Track population before/after to calculate growth notifications
      const populationBefore = new Map<number, number>();
      for (const planet of this.gameState.planets) {
        populationBefore.set(planet.id, planet.population);
      }

      // Process building construction progress during Income phase
      this.buildingSystem.updateConstruction();

      // Process population growth for each faction during Income phase
      this.populationSystem.updateFactionPopulation(FactionType.Player);
      this.populationSystem.updateFactionPopulation(FactionType.AI);

      // Fire population growth notifications
      for (const planet of this.gameState.planets) {
        const previousPop = populationBefore.get(planet.id) || 0;
        const growth = planet.population - previousPop;
        if (growth > 0) {
          this.onPopulationGrowth?.(planet.id, growth);
        }
      }

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
        aiIncome,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during income processing';
      this.onPhaseProcessingError?.(TurnPhase.Income, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage,
        playerIncome: new ResourceDelta(),
        aiIncome: new ResourceDelta(),
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
      processingTimeMs: 0,
    };
  }

  /**
   * Processes Combat phase: resolves space battles and ground invasions at all planets.
   * NFR-P3: Must complete within 2 seconds.
   */
  public processCombatPhase(): CombatPhaseResult {
    const startTime = performance.now();
    let battlesResolved = 0;
    let craftsDestroyed = 0;
    let invasionsProcessed = 0;
    let planetsCaptured = 0;

    try {
      // Phase 1: Process all space battles first
      for (const planet of this.gameState.planets) {
        // Check if opposing fleets are present at this planet
        if (this.spaceCombatSystem.shouldSpaceBattleOccur(planet.id)) {
          // Determine attacker (non-owner faction with ships present)
          const craft = this.gameState.craft.filter(c => c.planetID === planet.id && !c.isDeployed);
          const attackerCraft = craft.find(c => c.owner !== planet.owner);

          if (attackerCraft) {
            const attackerFaction = attackerCraft.owner;

            // Initiate and execute space battle
            const battle = this.spaceCombatSystem.initiateSpaceBattle(planet.id, attackerFaction);
            if (battle) {
              const result = this.spaceCombatSystem.executeSpaceCombat(battle);
              battlesResolved++;
              craftsDestroyed += result.destroyedCraftIDs.length;
            }
          }
        }
      }

      // Phase 2: Process ground invasions (if InvasionSystem is configured)
      if (this.invasionSystem) {
        for (const planet of this.gameState.planets) {
          // Skip if planet is neutral
          if (planet.owner === FactionType.Neutral) {
            continue;
          }

          // Find Battle Cruisers in orbit belonging to non-owner with platoons
          const enemyCruisersWithPlatoons = this.gameState.craft.filter(
            c =>
              c.planetID === planet.id &&
              c.owner !== planet.owner &&
              c.type === CraftType.BattleCruiser &&
              c.carriedPlatoonIDs.length > 0 &&
              !c.isDeployed,
          );

          if (enemyCruisersWithPlatoons.length > 0) {
            const attackerFaction = enemyCruisersWithPlatoons[0].owner;

            // Check if attacker has orbital control (no enemy craft remaining)
            if (this.invasionSystem.hasOrbitalControl(planet.id, attackerFaction)) {
              // Execute ground invasion
              const invasionResult = this.invasionSystem.invadePlanet(
                planet.id,
                attackerFaction,
                100, // Full aggression for automated combat
              );

              if (invasionResult) {
                invasionsProcessed++;
                this.onInvasionCompleted?.(planet.id, invasionResult);

                if (invasionResult.planetCaptured) {
                  planetsCaptured++;
                }
              }
            }
          }
        }
      }

      const processingTime = performance.now() - startTime;

      // Warn if processing exceeded 2 seconds (NFR-P3)
      if (processingTime > 2000) {
        console.warn(`Combat phase processing took ${processingTime}ms (target: <2000ms)`);
      }

      return {
        success: true,
        processingTimeMs: processingTime,
        battlesResolved,
        craftsDestroyed,
        invasionsProcessed,
        planetsCaptured,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during combat processing';
      this.onPhaseProcessingError?.(TurnPhase.Combat, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage,
        battlesResolved,
        craftsDestroyed,
        invasionsProcessed,
        planetsCaptured,
      };
    }
  }

  /**
   * Processes End phase: AI turn and victory checks.
   * NFR-P3: Must complete within 2 seconds.
   */
  public processEndPhase(): EndPhaseResult {
    const startTime = performance.now();
    let buildingsCompleted = 0;
    let totalPopulationGrowth = 0;
    let aiTurnProcessed = false;
    let victoryResult = VictoryResult.None;

    try {
      if (this.aiDecisionSystem) {
        this.aiDecisionSystem.executeAITurn();
        aiTurnProcessed = true;
      } else {
        console.warn('[End Phase] AIDecisionSystem not configured - AI will not take turns. Call configureEndPhase() to enable AI.');
      }

      if (this.victoryChecker) {
        victoryResult = this.victoryChecker();
        if (victoryResult !== VictoryResult.None) {
          this.onVictoryAchieved?.(victoryResult);
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
        populationGrowth: totalPopulationGrowth,
        victoryResult,
        aiTurnProcessed,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during end phase processing';
      this.onPhaseProcessingError?.(TurnPhase.End, errorMessage);
      return {
        success: false,
        processingTimeMs: performance.now() - startTime,
        error: errorMessage,
        buildingsCompleted: 0,
        populationGrowth: 0,
        victoryResult,
        aiTurnProcessed,
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

  /**
   * Gets the DefenseSystem for external use.
   */
  public getDefenseSystem(): DefenseSystem {
    return this.defenseSystem;
  }

  /**
   * Gets the UpgradeSystem for external use.
   */
  public getUpgradeSystem(): UpgradeSystem {
    return this.upgradeSystem;
  }

  /**
   * Gets the SpaceCombatSystem for external use.
   */
  public getSpaceCombatSystem(): SpaceCombatSystem {
    return this.spaceCombatSystem;
  }

  /**
   * Gets the TaxationSystem for external use.
   */
  public getTaxationSystem(): TaxationSystem {
    return this.taxationSystem;
  }

  /**
   * Configures End phase processing for AI and victory checks.
   */
  public configureEndPhase(options: {
    aiDecisionSystem?: AIDecisionSystem;
    victoryChecker?: () => VictoryResult;
    onVictoryAchieved?: (result: VictoryResult) => void;
  }): void {
    this.aiDecisionSystem = options.aiDecisionSystem;
    this.victoryChecker = options.victoryChecker;
    this.onVictoryAchieved = options.onVictoryAchieved;
  }

  /**
   * Configures Combat phase processing for ground invasions.
   * Required for automatic ground combat resolution after space battles.
   */
  public configureInvasionSystem(options: {
    invasionSystem: InvasionSystem;
    combatSystem: CombatSystem;
    platoonSystem: PlatoonSystem;
  }): void {
    this.invasionSystem = options.invasionSystem;

    // Wire up invasion events
    if (this.invasionSystem) {
      this.invasionSystem.onInvasionStarted = (planetID, attackerFaction) => {
        this.onInvasionStarted?.(planetID, attackerFaction);
      };
      this.invasionSystem.onPlanetCaptured = (planetID, newOwner, capturedResources) => {
        this.onPlanetCaptured?.(planetID, newOwner, capturedResources);
      };
    }
  }
}
