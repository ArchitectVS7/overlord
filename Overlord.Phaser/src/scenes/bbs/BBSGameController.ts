import { GameState } from '@core/GameState';
import { TurnSystem } from '@core/TurnSystem';
import { PhaseProcessor } from '@core/PhaseProcessor';
import { GalaxyGenerator } from '@core/GalaxyGenerator';
import { AIDecisionSystem } from '@core/AIDecisionSystem';
import { EntitySystem } from '@core/EntitySystem';
import { CraftSystem } from '@core/CraftSystem';
import { PlatoonSystem } from '@core/PlatoonSystem';
import { NavigationSystem } from '@core/NavigationSystem';
import { CombatSystem } from '@core/CombatSystem';
import { InvasionSystem } from '@core/InvasionSystem';
import { BombardmentSystem } from '@core/BombardmentSystem';
import {
  TurnPhase,
  VictoryResult,
  FactionType,
  AIDifficulty,
  AIPersonality,
  BuildingType,
  CraftType,
  EquipmentLevel,
  WeaponLevel,
} from '@core/models/Enums';
import { UATMode } from './BBSMenuState';

/**
 * BBSGameController - Orchestrates all core game systems for BBS interface
 * Handles game initialization, turn processing, and player actions
 */
export class BBSGameController {
  // Core state
  public gameState!: GameState;

  // Systems
  private turnSystem!: TurnSystem;
  private phaseProcessor!: PhaseProcessor;
  private aiSystem!: AIDecisionSystem;
  private entitySystem!: EntitySystem;
  private craftSystem!: CraftSystem;
  private platoonSystem!: PlatoonSystem;
  private navigationSystem!: NavigationSystem;
  private combatSystem!: CombatSystem;
  private invasionSystem!: InvasionSystem;
  private bombardmentSystem!: BombardmentSystem;

  // Game state flags
  private gameStarted = false;
  private gameOver = false;
  private victoryResult = VictoryResult.None;
  private currentUATMode: UATMode = UATMode.None;

  // Events
  public onTurnChanged?: (turn: number) => void;
  public onPhaseChanged?: (phase: TurnPhase) => void;
  public onGameOver?: (result: VictoryResult) => void;
  public onMessage?: (message: string) => void;
  public onAIAction?: (action: string, details: string) => void;

  constructor() {
    // Will be initialized when starting a new game
  }

  /**
   * Initialize all game systems with fresh state
   */
  private initializeSystems(): void {
    // Core systems
    this.turnSystem = new TurnSystem(this.gameState);
    this.phaseProcessor = new PhaseProcessor(this.gameState);
    this.entitySystem = new EntitySystem(this.gameState);

    // Entity management systems
    this.craftSystem = new CraftSystem(
      this.gameState,
      this.entitySystem
    );
    this.platoonSystem = new PlatoonSystem(
      this.gameState,
      this.entitySystem
    );

    // Combat systems
    this.combatSystem = new CombatSystem(this.gameState, this.platoonSystem);
    this.navigationSystem = new NavigationSystem(
      this.gameState,
      this.phaseProcessor.getResourceSystem(),
      this.combatSystem
    );
    this.invasionSystem = new InvasionSystem(this.gameState, this.combatSystem);
    this.bombardmentSystem = new BombardmentSystem(this.gameState, Math.random);

    // AI system with all dependencies
    this.aiSystem = new AIDecisionSystem(
      this.gameState,
      this.phaseProcessor.getIncomeSystem(),
      this.phaseProcessor.getResourceSystem(),
      this.phaseProcessor.getBuildingSystem(),
      this.craftSystem,
      this.platoonSystem,
      AIPersonality.Balanced,
      AIDifficulty.Normal,
      Math.random
    );
    this.phaseProcessor.configureEndPhase({
      aiDecisionSystem: this.aiSystem,
      victoryChecker: () => this.turnSystem.checkVictoryConditions(),
      onVictoryAchieved: (result) => {
        this.turnSystem.onVictoryAchieved?.(result);
      },
    });

    // Wire events
    this.wireEvents();
  }

  /**
   * Wire up system events for UI notifications
   */
  private wireEvents(): void {
    this.turnSystem.onTurnStarted = (turn: number) => {
      this.onTurnChanged?.(turn);
    };

    this.turnSystem.onPhaseChanged = (phase: TurnPhase) => {
      this.onPhaseChanged?.(phase);
    };

    this.turnSystem.onVictoryAchieved = (result: VictoryResult) => {
      this.gameOver = true;
      this.victoryResult = result;
      this.onGameOver?.(result);
    };

    this.aiSystem.onAIBuilding = (planetId: number, buildingType: BuildingType) => {
      const planet = this.gameState.planetLookup.get(planetId);
      const msg = `AI builds ${BuildingType[buildingType]} on ${planet?.name || 'unknown'}`;
      this.onMessage?.(msg);
      this.onAIAction?.('BUILD', msg);
    };

    this.aiSystem.onAIAttacking = (targetPlanetId: number) => {
      const planet = this.gameState.planetLookup.get(targetPlanetId);
      const msg = `AI attacking ${planet?.name || 'unknown'}!`;
      this.onMessage?.(msg);
      this.onAIAction?.('ATTACK', msg);
    };

    this.aiSystem.onAICommissioning = (planetId: number, troops: number, equipment: EquipmentLevel, weapon: WeaponLevel) => {
      const planet = this.gameState.planetLookup.get(planetId);
      const msg = `AI commissioned ${troops} troops (${EquipmentLevel[equipment]}/${WeaponLevel[weapon]}) on ${planet?.name || 'unknown'}`;
      this.onMessage?.(msg);
      this.onAIAction?.('COMMISSION', msg);
    };

    this.aiSystem.onAIPurchasing = (craftType: CraftType, planetId: number) => {
      const planet = this.gameState.planetLookup.get(planetId);
      const msg = `AI purchased ${CraftType[craftType]} at ${planet?.name || 'unknown'}`;
      this.onMessage?.(msg);
      this.onAIAction?.('PURCHASE', msg);
    };
  }

  /**
   * Start a new campaign game
   */
  public startNewCampaign(difficulty: AIDifficulty = AIDifficulty.Normal, uatMode: UATMode = UATMode.None): void {
    // Create fresh game state - clears any tutorial/scenario leftovers
    this.gameState = new GameState();

    // Initialize all systems with fresh state
    this.initializeSystems();

    // Generate galaxy
    const generator = new GalaxyGenerator();
    const galaxy = generator.generateGalaxy();

    // Apply galaxy to game state
    this.gameState.planets = galaxy.planets;
    this.gameState.rebuildLookups();

    // Set starting resources for both factions
    // Player: 50,000 credits, 10,000 each resource
    this.gameState.playerFaction.resources.credits = 50000;
    this.gameState.playerFaction.resources.minerals = 10000;
    this.gameState.playerFaction.resources.fuel = 10000;
    this.gameState.playerFaction.resources.food = 10000;
    this.gameState.playerFaction.resources.energy = 10000;

    // AI: 40,000 credits, 8,000 each resource (slight disadvantage)
    this.gameState.aiFaction.resources.credits = 40000;
    this.gameState.aiFaction.resources.minerals = 8000;
    this.gameState.aiFaction.resources.fuel = 8000;
    this.gameState.aiFaction.resources.food = 8000;
    this.gameState.aiFaction.resources.energy = 8000;

    // Set difficulty
    this.aiSystem.setDifficulty(difficulty);

    // Set UAT mode
    this.currentUATMode = uatMode;

    // Reset flags
    this.gameOver = false;
    this.victoryResult = VictoryResult.None;
    this.gameStarted = true;

    // Start turn 1
    this.turnSystem.startNewGame();
    this.runAutomaticPhases();

    this.onMessage?.('New campaign started!');
  }

  /**
   * End the player's turn and process AI
   */
  public endTurn(): void {
    if (!this.gameStarted || this.gameOver) return;

    if (this.turnSystem.getCurrentPhase() === TurnPhase.Action) {
      this.turnSystem.advancePhase();
    }

    this.runAutomaticPhases();
  }

  private runAutomaticPhases(): void {
    let phase = this.turnSystem.getCurrentPhase();

    while (phase !== TurnPhase.Action) {
      if (phase === TurnPhase.End) {
        this.onMessage?.('AI is thinking...');
      }

      const result = this.phaseProcessor.processPhase(phase);
      if (!result.success) {
        this.onMessage?.(`Phase processing failed: ${result.error}`);
        break;
      }

      if (phase === TurnPhase.End) {
        const endResult = result as ReturnType<PhaseProcessor['processEndPhase']>;
        if (endResult.victoryResult !== VictoryResult.None) {
          this.gameOver = true;
          this.victoryResult = endResult.victoryResult;
          this.onGameOver?.(endResult.victoryResult);
          return;
        }
      }

      phase = this.turnSystem.advancePhase();
    }
  }

  /**
   * Check if a UAT mode is active
   */
  public isUATModeActive(mode: UATMode): boolean {
    return this.currentUATMode >= mode;
  }

  /**
   * Get current UAT mode
   */
  public getUATMode(): UATMode {
    return this.currentUATMode;
  }

  // ============ Getters ============

  public isGameStarted(): boolean {
    return this.gameStarted;
  }

  public isGameOver(): boolean {
    return this.gameOver;
  }

  public getVictoryResult(): VictoryResult {
    return this.victoryResult;
  }

  public getCurrentTurn(): number {
    return this.gameState?.currentTurn || 0;
  }

  public getCurrentPhase(): TurnPhase {
    return this.gameState?.currentPhase || TurnPhase.Action;
  }

  // ============ Player Actions ============

  /**
   * Build a structure on a planet
   */
  public buildStructure(planetId: number, buildingType: BuildingType): boolean {
    const result = this.phaseProcessor.getBuildingSystem().startConstruction(planetId, buildingType);
    if (result) {
      const planet = this.gameState.planetLookup.get(planetId);
      this.onMessage?.(`Started construction of ${BuildingType[buildingType]} on ${planet?.name}`);
    }
    return result;
  }

  /**
   * Purchase a craft
   */
  public purchaseCraft(craftType: CraftType, planetId: number): number {
    const craftId = this.craftSystem.purchaseCraft(craftType, planetId, FactionType.Player);
    if (craftId >= 0) {
      this.onMessage?.(`Purchased ${CraftType[craftType]} (ID: ${craftId})`);
    }
    return craftId;
  }

  /**
   * Commission a platoon
   */
  public commissionPlatoon(
    planetId: number,
    troops: number,
    equipment: EquipmentLevel,
    weapon: WeaponLevel
  ): number {
    const platoonId = this.platoonSystem.commissionPlatoon(
      planetId,
      FactionType.Player,
      troops,
      equipment,
      weapon
    );
    if (platoonId >= 0) {
      this.onMessage?.(`Commissioned platoon (ID: ${platoonId})`);
    }
    return platoonId;
  }

  /**
   * Move a craft to another planet
   */
  public moveCraft(craftId: number, destinationPlanetId: number): boolean {
    const result = this.navigationSystem.moveShip(craftId, destinationPlanetId);
    if (result) {
      const dest = this.gameState.planetLookup.get(destinationPlanetId);
      this.onMessage?.(`Craft ${craftId} moved to ${dest?.name}`);
    }
    return result;
  }

  /**
   * Load a platoon onto a craft
   */
  public loadPlatoon(platoonId: number, craftId: number): boolean {
    const result = this.craftSystem.embarkPlatoons(craftId, [platoonId]);
    if (result) {
      this.onMessage?.(`Platoon ${platoonId} loaded onto craft ${craftId}`);
    }
    return result;
  }

  /**
   * Invade a planet
   */
  public invadePlanet(planetId: number): any {
    const result = this.invasionSystem.invadePlanet(planetId, FactionType.Player);
    if (result) {
      const planet = this.gameState.planetLookup.get(planetId);
      if (result.planetCaptured) {
        this.onMessage?.(`${planet?.name} captured!`);
      } else {
        this.onMessage?.(`Invasion of ${planet?.name} ${result.attackerWins ? 'successful' : 'failed'}`);
      }
    }
    return result;
  }

  /**
   * Bombard a planet
   */
  public bombardPlanet(planetId: number): any {
    const result = this.bombardmentSystem.bombardPlanet(planetId, FactionType.Player);
    if (result) {
      const planet = this.gameState.planetLookup.get(planetId);
      this.onMessage?.(`Bombardment of ${planet?.name}: ${result.structuresDestroyed} structures destroyed`);
    }
    return result;
  }

  /**
   * Set tax rate on a planet
   */
  public setTaxRate(planetId: number, rate: number): void {
    this.phaseProcessor.getTaxationSystem().setTaxRate(planetId, rate);
    const planet = this.gameState.planetLookup.get(planetId);
    this.onMessage?.(`Tax rate on ${planet?.name} set to ${rate}%`);
  }

  /**
   * Start weapon research
   */
  public startResearch(): boolean {
    const result = this.phaseProcessor.getUpgradeSystem().startResearch(FactionType.Player);
    if (result) {
      this.onMessage?.('Research started!');
    }
    return result;
  }

  /**
   * Get building system for querying building info
   */
  public getBuildingSystem() {
    return this.phaseProcessor.getBuildingSystem();
  }

  /**
   * Get craft costs for shipyard
   */
  public getCraftCosts() {
    return this.craftSystem;
  }

  /**
   * Get player's faction resources
   */
  public getPlayerResources() {
    return this.gameState.playerFaction.resources;
  }

  /**
   * Get upgrade system for research info
   */
  public getUpgradeSystem() {
    return this.phaseProcessor.getUpgradeSystem();
  }
}
