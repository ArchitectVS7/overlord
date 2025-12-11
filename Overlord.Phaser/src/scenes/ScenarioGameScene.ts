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
import { ObjectivesPanel } from './ui/ObjectivesPanel';
import { TutorialHighlight } from './ui/TutorialHighlight';
import { TutorialStepPanel } from './ui/TutorialStepPanel';
import { ScenarioResultsPanel } from './ui/ScenarioResultsPanel';

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
        fontStyle: 'bold'
      }
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

    // Set up periodic victory/defeat condition checking (every 500ms to ensure <1s detection)
    this.conditionCheckTimer = this.time.addEvent({
      delay: 500,
      callback: this.onConditionCheck,
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Initialize tutorial system if scenario has tutorial steps
   * Story 1-4: Tutorial Step Guidance System
   */
  private initializeTutorialSystem(): void {
    // Create tutorial components
    this.tutorialManager = new TutorialManager();
    this.tutorialActionDetector = new TutorialActionDetector();
    this.tutorialHighlight = new TutorialHighlight(this);
    this.tutorialStepPanel = new TutorialStepPanel(this);

    // Initialize tutorial if scenario has steps
    if (!this.scenario) return;

    const hasTutorial = this.tutorialManager.initialize(this.scenario);

    if (hasTutorial) {
      // Wire up tutorial events
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
  }

  /**
   * Called when a tutorial step starts
   */
  private onTutorialStepStarted(step: import('@core/models/TutorialModels').TutorialStep): void {
    // Update step panel
    this.tutorialStepPanel.showStep(
      step,
      this.tutorialManager.getCurrentStepIndex() + 1,
      this.tutorialManager.getStepCount()
    );

    // Apply highlight if specified
    if (step.highlight) {
      // In full implementation, look up element by ID
      // For now, show a default highlight
      this.tutorialHighlight.showGlow({ x: 400, y: 300, width: 100, height: 50 }, true);
    }

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
    if (!this.scenario) return;

    // Pause gameplay
    this.scenarioPaused = true;

    // Calculate completion time
    const completionTime = this.getElapsedTimeSeconds();

    // Get star targets from scenario or use defaults
    const targets: StarTargets = {
      threeStarTime: (this.scenario as any).starTargets?.threeStarTime ?? 120,
      twoStarTime: (this.scenario as any).starTargets?.twoStarTime ?? 240
    };

    // Create results object
    const results: ScenarioResults = this.ratingSystem.createResults(
      this.scenario.id,
      isVictory,
      completionTime,
      targets,
      conditionMet,
      defeatReason,
      1 // attempts (to be tracked in Story 1-6)
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
        this.lastResults.starRating
      );
    }

    // Return to Flash Conflicts menu
    this.scene.start('FlashConflictsScene');
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
    this.scene.start('FlashConflictsScene');
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
      startTurn
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
  }

  /**
   * Create basic HUD elements
   */
  private createHUD(): void {
    if (!this.gameState) return;

    // Turn counter
    const turnText = this.add.text(
      20,
      20,
      `Turn: ${this.gameState.currentTurn}`,
      {
        fontSize: '18px',
        color: '#ffffff'
      }
    );
    turnText.setScrollFactor(0);

    // Resources display
    const resources = this.gameState.playerFaction.resources;
    const resourceText = this.add.text(
      20,
      50,
      `Credits: ${resources.credits} | Minerals: ${resources.minerals}`,
      {
        fontSize: '14px',
        color: '#aaaaaa'
      }
    );
    resourceText.setScrollFactor(0);

    // Help text
    const helpText = this.add.text(
      this.cameras.main.width - 20,
      20,
      'Press O for Objectives',
      {
        fontSize: '14px',
        color: '#666666'
      }
    );
    helpText.setOrigin(1, 0);
    helpText.setScrollFactor(0);
  }

  /**
   * Update objectives progress display
   */
  private updateObjectivesProgress(): void {
    if (!this.gameState || !this.scenario) return;

    const startTurn = this.gameState.scenarioStartTurn ?? 1;
    const results = this.victorySystem.evaluateAll(
      this.scenario.victoryConditions,
      this.gameState,
      startTurn
    );

    this.objectivesPanel.updateProgress(results.conditions);
  }

  /**
   * Called when player clicks Continue on objectives panel
   */
  private onObjectivesContinue(): void {
    // Objectives dismissed, gameplay begins
    console.log('Gameplay starting...');
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
        fontStyle: 'bold'
      }
    );
    this.errorText.setOrigin(0.5);

    const detailText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      message,
      {
        fontSize: '18px',
        color: '#ffffff'
      }
    );
    detailText.setOrigin(0.5);

    // Return button
    const returnButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 80,
      'Return to Menu',
      {
        fontSize: '20px',
        color: '#4488ff'
      }
    );
    returnButton.setOrigin(0.5);
    returnButton.setInteractive({ useHandCursor: true });
    returnButton.on('pointerdown', () => {
      this.scene.start('FlashConflictsScene');
    });

    // Auto-return after delay
    this.time.delayedCall(3000, () => {
      if (this.scene.isActive()) {
        this.scene.start('FlashConflictsScene');
      }
    });
  }

  /**
   * Update loop
   */
  public update(_time: number, _delta: number): void {
    // Update victory conditions periodically
    // (in full implementation, check after each player action)
  }
}
