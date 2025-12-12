/**
 * ScenarioGameScene - Main gameplay scene for scenario execution
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Features:
 * - Initializes GameState from scenario configuration
 * - Shows ObjectivesPanel at start
 * - Handles "O" key to toggle objectives
 * - Checks victory conditions
 * - Returns to FlashConflictsScene on error
 */

import Phaser from 'phaser';
import { Scenario } from '@core/models/ScenarioModels';
import { ScenarioInitializer, ScenarioGameState } from '@core/ScenarioInitializer';
import { VictoryConditionSystem } from '@core/VictoryConditionSystem';
import { ObjectivesPanel } from './ui/ObjectivesPanel';

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

    // Register keyboard shortcuts
    this.registerKeyboardShortcuts();

    // Create basic HUD
    this.createHUD();
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
