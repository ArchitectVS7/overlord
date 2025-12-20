/**
 * ScenarioGameScene - Main gameplay scene for scenario execution
 * Story 1-3: Scenario Initialization and Victory Conditions
 * Story 1-4: Tutorial Step Guidance System
 *
 * Features:
 * - Initializes GameState from scenario configuration
 * - Shows ObjectivesPanel at start
 * - Handles "O" key to toggle objectives
 * - Checks victory conditions
 * - Tutorial step guidance for tutorial scenarios
 * - Returns to FlashConflictsScene on error
 */

import Phaser from 'phaser';
import { Scenario } from '@core/models/ScenarioModels';
import { ScenarioInitializer, ScenarioGameState } from '@core/ScenarioInitializer';
import { VictoryConditionSystem } from '@core/VictoryConditionSystem';
import { TutorialManager } from '@core/TutorialManager';
import { TutorialActionDetector } from '@core/TutorialActionDetector';
import { StarRatingSystem, ScenarioResults, StarTargets } from '@core/StarRatingSystem';
import { getCompletionService } from '@core/ScenarioCompletionService';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { ObjectivesPanel } from './ui/ObjectivesPanel';
import { TutorialHighlight } from './ui/TutorialHighlight';
import { TutorialStepPanel } from './ui/TutorialStepPanel';
import { ScenarioResultsPanel } from './ui/ScenarioResultsPanel';
import { PlanetInfoPanel } from './ui/PlanetInfoPanel';
import { PlanetRenderer } from './renderers/PlanetRenderer';

/**
 * Data passed to this scene
 */
interface ScenarioGameSceneData {
  scenario: Scenario | null;
}

/**
 * Main scene for playing scenarios
 */
export class ScenarioGameScene extends Phaser.Scene {
  private scenario?: Scenario;
  private gameState?: ScenarioGameState;
  private objectivesPanel!: ObjectivesPanel;
  private victorySystem!: VictoryConditionSystem;

  // Tutorial system (Story 1-4)
  private tutorialManager!: TutorialManager;
  private tutorialActionDetector!: TutorialActionDetector;
  private tutorialHighlight!: TutorialHighlight;
  private tutorialStepPanel!: TutorialStepPanel;

  // Completion tracking (Story 1-5)
  private scenarioStartTime: number = 0;
  private resultsPanel!: ScenarioResultsPanel;
  private ratingSystem!: StarRatingSystem;
  private scenarioPaused: boolean = false;
  private conditionCheckTimer?: Phaser.Time.TimerEvent;
  private lastResults?: ScenarioResults;

  // Error display
  private errorText?: Phaser.GameObjects.Text;

  // Planet rendering
  private planetRenderer!: PlanetRenderer;
  private planetInfoPanel!: PlanetInfoPanel;
  private planetContainers: Map<string, Phaser.GameObjects.Container> = new Map();
  private selectedPlanetId: string | null = null;
  private selectionGraphics!: Phaser.GameObjects.Graphics;

  // HUD elements for turn management
  private turnText!: Phaser.GameObjects.Text;
  private phaseText!: Phaser.GameObjects.Text;
  private endTurnButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'ScenarioGameScene' });
  }

  /**
   * Initialize with scenario data
   */
  public init(data: ScenarioGameSceneData): void {
    this.scenario = data.scenario ?? undefined;
  }

  /**
   * Create the scene
   */
  public create(): void {
    // Check for valid scenario
    if (!this.scenario) {
      this.handleError('No scenario provided');
      return;
    }

    // Initialize game state from scenario
    const initializer = new ScenarioInitializer();
    const result = initializer.initialize(this.scenario);

    if (!result.success) {
      this.handleError(result.error ?? 'Failed to initialize scenario');
      return;
    }

    this.gameState = result.gameState;

    // Initialize victory system
    this.victorySystem = new VictoryConditionSystem();

    // Initialize completion tracking (Story 1-5)
    this.scenarioStartTime = Date.now();
    this.ratingSystem = new StarRatingSystem();
    this.resultsPanel = new ScenarioResultsPanel(this);
    this.resultsPanel.onContinue = () => this.handleContinue();
    this.resultsPanel.onRetry = () => this.handleRetry();
    this.resultsPanel.onExit = () => this.handleExit();

    // Set up background
    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Create scene title
    const titleText = this.add.text(
      this.cameras.main.centerX,
      30,
      this.scenario.name,
      {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold',
      },
    );
    titleText.setOrigin(0.5, 0);
    titleText.setScrollFactor(0);

    // Create objectives panel
    this.objectivesPanel = new ObjectivesPanel(this);
    this.objectivesPanel.setObjectives(this.scenario.victoryConditions);
    this.objectivesPanel.onContinue = () => {
      this.onObjectivesContinue();
    };

    // Update progress display
    this.updateObjectivesProgress();

    // Show objectives at start
    this.objectivesPanel.show();

    // Initialize tutorial system (Story 1-4)
    this.initializeTutorialSystem();

    // Register keyboard shortcuts
    this.registerKeyboardShortcuts();

    // Create basic HUD
    this.createHUD();

    // Render planets from game state
    this.renderPlanets();

    // Create Planet Info Panel
    this.createPlanetInfoPanel();

    // Set up periodic victory/defeat condition checking (every 500ms to ensure <1s detection)
    this.conditionCheckTimer = this.time.addEvent({
      delay: 500,
      callback: this.onConditionCheck,
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Initialize tutorial system if scenario has tutorial steps
   * Story 1-4: Tutorial Step Guidance System
   * Note: Only creates components here. Actual tutorial start is deferred until
   * objectives panel is dismissed (see startTutorial())
   */
  private initializeTutorialSystem(): void {
    // Create tutorial components (but don't start yet)
    this.tutorialManager = new TutorialManager();
    this.tutorialActionDetector = new TutorialActionDetector();
    this.tutorialHighlight = new TutorialHighlight(this);
    this.tutorialStepPanel = new TutorialStepPanel(this);

    // Wire up tutorial events (will be used when tutorial starts)
    this.tutorialManager.onStepStarted = (step) => {
      this.onTutorialStepStarted(step);
    };

    this.tutorialManager.onStepCompleted = () => {
      this.onTutorialStepCompleted();
    };

    this.tutorialManager.onTutorialComplete = () => {
      this.onTutorialComplete();
    };

    // Wire up action detector
    this.tutorialActionDetector.onActionCompleted = () => {
      this.tutorialManager.completeCurrentStep();
    };

    // Wire up skip button
    this.tutorialStepPanel.onSkip = () => {
      this.tutorialManager.skip();
    };
  }

  /**
   * Start the tutorial after objectives panel is dismissed
   */
  private startTutorial(): void {
    if (!this.scenario) return;

    // Initialize and start the tutorial
    const hasTutorial = this.tutorialManager.initialize(this.scenario);

    if (hasTutorial) {
      console.log('Tutorial started with', this.tutorialManager.getStepCount(), 'steps');
    }
  }

  /**
   * Called when a tutorial step starts
   */
  private onTutorialStepStarted(step: import('@core/models/TutorialModels').TutorialStep): void {
    // Update step panel
    this.tutorialStepPanel.showStep(
      step,
      this.tutorialManager.getCurrentStepIndex() + 1,
      this.tutorialManager.getStepCount(),
    );

    // Clear any previous highlight - don't show placeholder rectangles
    // Full element lookup would require a registry of UI elements by ID
    this.tutorialHighlight.clear();

    // Watch for the required action
    this.tutorialActionDetector.watchFor(step.action);
  }

  /**
   * Called when a tutorial step is completed
   */
  private onTutorialStepCompleted(): void {
    this.tutorialHighlight.clear();
    this.tutorialStepPanel.showCompletion();
  }

  /**
   * Called when tutorial is complete
   */
  private onTutorialComplete(): void {
    this.tutorialHighlight.clear();
    this.tutorialStepPanel.hide();
    console.log('Tutorial complete!');
  }

  /**
   * Check if tutorial is active
   */
  public isTutorialActive(): boolean {
    return this.tutorialManager?.isActive() ?? false;
  }

  /**
   * Get tutorial action detector for external event reporting
   */
  public getTutorialActionDetector(): TutorialActionDetector | undefined {
    return this.tutorialActionDetector;
  }

  // ==================== Completion Time Tracking (Story 1-5) ====================

  /**
   * Get elapsed time since scenario started in seconds
   */
  public getElapsedTimeSeconds(): number {
    if (!this.scenarioStartTime) {
      return 0;
    }
    return Math.floor((Date.now() - this.scenarioStartTime) / 1000);
  }

  /**
   * Show results panel for victory or defeat
   * @param isVictory Whether the player won
   * @param conditionMet Victory condition description (for victory)
   * @param defeatReason Defeat reason (for defeat)
   */
  public showResults(isVictory: boolean, conditionMet?: string, defeatReason?: string): void {
    if (!this.scenario) {return;}

    // Pause gameplay
    this.scenarioPaused = true;

    // Calculate completion time
    const completionTime = this.getElapsedTimeSeconds();

    // Get star targets from scenario or use defaults
    const targets: StarTargets = {
      threeStarTime: (this.scenario as any).starTargets?.threeStarTime ?? 120,
      twoStarTime: (this.scenario as any).starTargets?.twoStarTime ?? 240,
    };

    // Create results object
    const results: ScenarioResults = this.ratingSystem.createResults(
      this.scenario.id,
      isVictory,
      completionTime,
      targets,
      conditionMet,
      defeatReason,
      1, // attempts (to be tracked in Story 1-6)
    );

    // Store results for later use
    this.lastResults = results;

    // Stop condition checking timer
    if (this.conditionCheckTimer) {
      this.conditionCheckTimer.remove();
    }

    // Show appropriate panel
    if (isVictory) {
      this.resultsPanel.showVictory(results);
    } else {
      this.resultsPanel.showDefeat(results);
    }
  }

  /**
   * Handle Continue button click from results panel
   */
  private handleContinue(): void {
    // Record completion (Story 1-5)
    if (this.lastResults && this.lastResults.completed) {
      const completionService = getCompletionService();
      completionService.markCompleted(
        this.lastResults.scenarioId,
        this.lastResults.completionTime,
        this.lastResults.starRating,
      );
    }

    // Return to appropriate menu based on scenario type
    this.returnToMenu();
  }

  /**
   * Return to the appropriate menu scene based on scenario type
   */
  private returnToMenu(): void {
    if (this.scenario?.type === 'tutorial') {
      this.scene.start('TutorialsScene');
    } else {
      this.scene.start('FlashConflictsScene');
    }
  }

  /**
   * Handle Retry button click from results panel
   */
  private handleRetry(): void {
    // Restart the same scenario
    this.scene.start('ScenarioGameScene', { scenario: this.scenario });
  }

  /**
   * Handle Exit button click from results panel
   */
  private handleExit(): void {
    // Return to menu without recording completion
    this.returnToMenu();
  }

  /**
   * Check if gameplay is paused (results showing)
   */
  public isGameplayPaused(): boolean {
    return this.scenarioPaused;
  }

  /**
   * Periodic callback to check victory/defeat conditions
   */
  private onConditionCheck(): void {
    // Check defeat first (player lost)
    if (this.checkDefeatConditions()) {
      return;
    }

    // Then check victory
    this.checkVictoryConditions();
  }

  /**
   * Check if victory conditions are met
   * @returns true if victory triggered, false otherwise
   */
  private checkVictoryConditions(): boolean {
    if (this.scenarioPaused || !this.gameState || !this.scenario) {
      return false;
    }

    const startTurn = this.gameState.scenarioStartTurn ?? 1;
    const results = this.victorySystem.evaluateAll(
      this.scenario.victoryConditions,
      this.gameState,
      startTurn,
    );

    if (results.allMet) {
      // Find the first met condition for the description
      const metCondition = results.conditions.find(c => c.met);
      const conditionDescription = metCondition?.description ?? 'Victory!';

      // Trigger victory
      this.showResults(true, conditionDescription);
      return true;
    }

    return false;
  }

  /**
   * Check if defeat conditions are met
   * @returns true if defeat triggered, false otherwise
   */
  private checkDefeatConditions(): boolean {
    if (this.scenarioPaused || !this.gameState) {
      return false;
    }

    // Primary defeat condition: player has no planets
    if (this.gameState.playerFaction.ownedPlanetIDs.length === 0) {
      this.showResults(false, undefined, 'All planets lost');
      return true;
    }

    // Additional defeat conditions can be added here (e.g., scenario-specific)

    return false;
  }

  /**
   * Register keyboard shortcuts
   */
  private registerKeyboardShortcuts(): void {
    // "O" key toggles objectives panel
    this.input.keyboard?.on('keydown-O', () => {
      this.objectivesPanel.toggle();
    });

    // SPACE key ends turn (during Action phase)
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.advanceTurn();
    });
  }

  /**
   * Advance the turn (called when SPACE pressed or END TURN clicked)
   */
  private advanceTurn(): void {
    if (this.scenarioPaused || !this.gameState) return;

    // Advance the turn
    this.gameState.currentTurn++;
    this.updateTurnDisplay();

    // Check victory conditions
    this.checkVictoryConditions();

    // Report action to tutorial system for end_turn actions
    if (this.tutorialActionDetector) {
      this.tutorialActionDetector.reportTurnEnd();
    }

    console.log(`Advanced to Turn ${this.gameState.currentTurn}`);
  }

  /**
   * Update the turn display in HUD
   */
  private updateTurnDisplay(): void {
    if (!this.gameState) return;
    this.turnText?.setText(`Turn: ${this.gameState.currentTurn}`);
  }

  /**
   * Create basic HUD elements
   */
  private createHUD(): void {
    if (!this.gameState) {return;}

    // Turn counter
    this.turnText = this.add.text(
      20,
      20,
      `Turn: ${this.gameState.currentTurn}`,
      {
        fontSize: '18px',
        color: '#ffffff',
      },
    );
    this.turnText.setScrollFactor(0);

    // Phase indicator
    this.phaseText = this.add.text(
      20,
      45,
      'Action Phase',
      {
        fontSize: '14px',
        color: '#88ff88',
      },
    );
    this.phaseText.setScrollFactor(0);

    // Resources display
    const resources = this.gameState.playerFaction.resources;
    const resourceText = this.add.text(
      20,
      70,
      `Credits: ${resources.credits} | Minerals: ${resources.minerals}`,
      {
        fontSize: '14px',
        color: '#aaaaaa',
      },
    );
    resourceText.setScrollFactor(0);

    // END TURN button
    this.createEndTurnButton();

    // Help text
    const helpText = this.add.text(
      this.cameras.main.width - 20,
      20,
      'Press O for Objectives | SPACE to End Turn',
      {
        fontSize: '14px',
        color: '#666666',
      },
    );
    helpText.setOrigin(1, 0);
    helpText.setScrollFactor(0);
  }

  /**
   * Create the END TURN button
   */
  private createEndTurnButton(): void {
    const buttonWidth = 150;
    const buttonHeight = 40;
    const x = this.cameras.main.width - buttonWidth - 20;
    const y = this.cameras.main.height - buttonHeight - 20;

    this.endTurnButton = this.add.container(x, y);
    this.endTurnButton.setScrollFactor(0);
    this.endTurnButton.setDepth(100);

    // Button background
    const bg = this.add.graphics();
    bg.fillStyle(0x2255aa, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    bg.lineStyle(2, 0x4488ff, 1);
    bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    this.endTurnButton.add(bg);

    // Button text
    const text = this.add.text(buttonWidth / 2, buttonHeight / 2, 'END TURN [Space]', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.endTurnButton.add(text);

    // Interactive zone
    const zone = this.add.zone(x + buttonWidth / 2, y + buttonHeight / 2, buttonWidth, buttonHeight);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x3366cc, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
      bg.lineStyle(2, 0x66aaff, 1);
      bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x2255aa, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
      bg.lineStyle(2, 0x4488ff, 1);
      bg.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    });
    zone.on('pointerdown', () => {
      this.advanceTurn();
    });
  }

  /**
   * Update objectives progress display
   */
  private updateObjectivesProgress(): void {
    if (!this.gameState || !this.scenario) {return;}

    const startTurn = this.gameState.scenarioStartTurn ?? 1;
    const results = this.victorySystem.evaluateAll(
      this.scenario.victoryConditions,
      this.gameState,
      startTurn,
    );

    this.objectivesPanel.updateProgress(results.conditions);
  }

  /**
   * Called when player clicks Continue on objectives panel
   */
  private onObjectivesContinue(): void {
    // Objectives dismissed, gameplay begins
    console.log('Gameplay starting...');

    // Start the tutorial now that objectives are dismissed
    this.startTutorial();
  }

  /**
   * Handle initialization errors
   */
  private handleError(message: string): void {
    console.error('ScenarioGameScene error:', message);

    // Display error message
    this.cameras.main.setBackgroundColor('#1a0a0a');
    this.errorText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 50,
      'Error',
      {
        fontSize: '32px',
        color: '#ff4444',
        fontStyle: 'bold',
      },
    );
    this.errorText.setOrigin(0.5);

    const detailText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      message,
      {
        fontSize: '18px',
        color: '#ffffff',
      },
    );
    detailText.setOrigin(0.5);

    // Return button
    const returnButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 80,
      'Return to Menu',
      {
        fontSize: '20px',
        color: '#4488ff',
      },
    );
    returnButton.setOrigin(0.5);
    returnButton.setInteractive({ useHandCursor: true });
    returnButton.on('pointerdown', () => {
      this.returnToMenu();
    });

    // Auto-return after delay
    this.time.delayedCall(3000, () => {
      if (this.scene.isActive()) {
        this.returnToMenu();
      }
    });
  }

  // ==================== Planet Rendering ====================

  /**
   * Render all planets from game state
   */
  private renderPlanets(): void {
    if (!this.gameState) return;

    // Create planet renderer
    this.planetRenderer = new PlanetRenderer(this);

    // Create selection graphics
    this.selectionGraphics = this.add.graphics();
    this.selectionGraphics.setDepth(50);

    // Render each planet
    for (const planet of this.gameState.planets) {
      this.renderPlanet(planet);
    }
  }

  /**
   * Render a single planet
   */
  private renderPlanet(planet: PlanetEntity): void {
    // Use PlanetRenderer to create the visual
    const container = this.planetRenderer.renderPlanet(planet);
    container.setDepth(10);

    // Store reference
    const planetIdStr = String(planet.id);
    this.planetContainers.set(planetIdStr, container);

    // Get hit area size
    const hitSize = this.planetRenderer.getHitAreaSize(planet.type);

    // Create interactive zone
    const zone = this.add.zone(planet.position.x, planet.position.z, hitSize, hitSize);
    zone.setInteractive({ useHandCursor: true });
    zone.setData('planetId', planet.id);

    // Handle click
    zone.on('pointerdown', () => {
      this.selectPlanet(planetIdStr);
    });
  }

  /**
   * Select a planet and show its info panel
   */
  private selectPlanet(planetId: string): void {
    this.selectedPlanetId = planetId;
    this.updateSelectionVisuals();

    const planetIdNum = parseInt(planetId, 10);
    const planet = this.gameState?.planets.find(p => p.id === planetIdNum);

    if (planet) {
      console.log(`Selected planet: ${planet.name}`);

      // Show planet info panel with close callback
      this.planetInfoPanel.setPlanet(planet);
      this.planetInfoPanel.show(() => this.onPlanetInfoPanelClose());

      // Track UI interaction for victory conditions
      this.victorySystem.markUIInteractionComplete('planet_info_panel_opened');

      // Report action to tutorial system
      if (this.tutorialActionDetector) {
        this.tutorialActionDetector.reportPlanetSelection(planet.name);
      }
    }
  }

  /**
   * Update selection visuals
   */
  private updateSelectionVisuals(): void {
    this.selectionGraphics.clear();

    if (this.selectedPlanetId) {
      const container = this.planetContainers.get(this.selectedPlanetId);
      if (container) {
        // Draw cyan selection ring
        this.selectionGraphics.lineStyle(3, 0x00ffff, 1);
        this.selectionGraphics.strokeCircle(container.x, container.y, 35);
      }
    }
  }

  /**
   * Create and configure PlanetInfoPanel
   */
  private createPlanetInfoPanel(): void {
    // PlanetInfoPanel with optional BuildingSystem (undefined for tutorials)
    this.planetInfoPanel = new PlanetInfoPanel(this, undefined);
  }

  /**
   * Called when planet info panel closes
   */
  private onPlanetInfoPanelClose(): void {
    this.selectedPlanetId = null;
    this.updateSelectionVisuals();
  }

  /**
   * Update loop
   */
  public update(_time: number, _delta: number): void {
    // Update victory conditions periodically
    // (in full implementation, check after each player action)
  }
}
