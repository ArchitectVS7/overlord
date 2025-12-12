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
import { ObjectivesPanel } from './ui/ObjectivesPanel';
import { TutorialHighlight } from './ui/TutorialHighlight';
import { TutorialStepPanel } from './ui/TutorialStepPanel';

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
