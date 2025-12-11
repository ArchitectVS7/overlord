/**
 * ObjectivesPanel - Display victory conditions for scenarios
 * Story 1-3: Scenario Initialization and Victory Conditions
 *
 * Features:
 * - Displays list of victory conditions
 * - Shows progress for each condition
 * - Checkmarks for completed conditions
 * - Continue button to dismiss
 * - Can be toggled with keyboard shortcut
 */

import Phaser from 'phaser';
import { VictoryCondition } from '@core/models/ScenarioModels';
import { ConditionResult } from '@core/VictoryConditionSystem';

// Panel dimensions and styling
const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 400;
const PADDING = 20;
const ROW_HEIGHT = 50;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const COMPLETE_COLOR = '#44ff44';
const INCOMPLETE_COLOR = '#ffaa44';
const PROGRESS_BG_COLOR = 0x2a2a3e;
const PROGRESS_FILL_COLOR = 0x4488ff;

/**
 * UI panel for displaying scenario objectives
 */
export class ObjectivesPanel {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;
  private objectiveRows: ObjectiveRow[] = [];

  private objectives: VictoryCondition[] = [];
  private visible: boolean = false;

  // Callbacks
  public onContinue?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createPanel();
    this.hide();
  }

  /**
   * Create the panel UI elements
   */
  private createPanel(): void {
    const camera = this.scene.cameras.main;
    const x = (camera.width - PANEL_WIDTH) / 2;
    const y = (camera.height - PANEL_HEIGHT) / 2;

    // Semi-transparent backdrop
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.6);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(1300);
    this.backdrop.setVisible(false);
    this.backdrop.setInteractive({ useHandCursor: false });

    // Container for panel contents
    this.container = this.scene.add.container(x, y);
    this.container.setDepth(1301);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.background.lineStyle(2, BORDER_COLOR, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.container.add(this.background);

    // Title
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, PADDING, 'OBJECTIVES', {
      fontSize: '28px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.titleText.setOrigin(0.5, 0);
    this.container.add(this.titleText);

    // Continue button
    this.continueButton = this.scene.add.text(
      PANEL_WIDTH / 2,
      PANEL_HEIGHT - PADDING - 20,
      'CONTINUE',
      {
        fontSize: '20px',
        color: '#44ff44',
        fontStyle: 'bold'
      }
    );
    this.continueButton.setOrigin(0.5, 0);
    this.continueButton.setInteractive({ useHandCursor: true });
    this.continueButton.on('pointerover', () => {
      this.continueButton.setColor('#88ff88');
    });
    this.continueButton.on('pointerout', () => {
      this.continueButton.setColor('#44ff44');
    });
    this.continueButton.on('pointerdown', () => {
      this.handleContinue();
    });
    this.container.add(this.continueButton);
  }

  /**
   * Set the objectives to display
   */
  public setObjectives(conditions: VictoryCondition[]): void {
    this.objectives = [...conditions];
    this.renderObjectives();
  }

  /**
   * Render objective rows
   */
  private renderObjectives(): void {
    // Clear existing rows
    for (const row of this.objectiveRows) {
      row.destroy();
    }
    this.objectiveRows = [];

    // Create new rows
    const startY = 70;
    for (let i = 0; i < this.objectives.length; i++) {
      const condition = this.objectives[i];
      const row = new ObjectiveRow(
        this.scene,
        this.container,
        PADDING,
        startY + i * ROW_HEIGHT,
        PANEL_WIDTH - PADDING * 2,
        condition
      );
      this.objectiveRows.push(row);
    }
  }

  /**
   * Update progress display for all conditions
   */
  public updateProgress(results: ConditionResult[]): void {
    for (let i = 0; i < results.length && i < this.objectiveRows.length; i++) {
      this.objectiveRows[i].updateProgress(results[i]);
    }
  }

  /**
   * Get the number of objectives
   */
  public getObjectivesCount(): number {
    return this.objectives.length;
  }

  /**
   * Show the panel
   */
  public show(): void {
    this.visible = true;
    this.backdrop.setVisible(true);
    this.container.setVisible(true);
  }

  /**
   * Hide the panel
   */
  public hide(): void {
    this.visible = false;
    this.backdrop.setVisible(false);
    this.container.setVisible(false);
  }

  /**
   * Toggle visibility
   */
  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Check if panel is visible
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Handle continue button click
   */
  public handleContinue(): void {
    this.hide();
    this.onContinue?.();
  }

  /**
   * Destroy the panel
   */
  public destroy(): void {
    for (const row of this.objectiveRows) {
      row.destroy();
    }
    this.backdrop.destroy();
    this.container.destroy();
  }
}

/**
 * Individual objective row display
 */
class ObjectiveRow {
  private container: Phaser.GameObjects.Container;
  private statusIcon: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;
  private progressBar: Phaser.GameObjects.Graphics;
  private progressWidth: number;

  constructor(
    scene: Phaser.Scene,
    parent: Phaser.GameObjects.Container,
    x: number,
    y: number,
    width: number,
    condition: VictoryCondition
  ) {
    this.progressWidth = width - 60;

    // Create container for this row
    this.container = scene.add.container(x, y);
    parent.add(this.container);

    // Status icon (checkmark or circle)
    this.statusIcon = scene.add.text(0, 0, '○', {
      fontSize: '24px',
      color: INCOMPLETE_COLOR
    });
    this.container.add(this.statusIcon);

    // Description text
    const description = this.getConditionDescription(condition);
    this.descriptionText = scene.add.text(35, 0, description, {
      fontSize: '18px',
      color: TEXT_COLOR
    });
    this.container.add(this.descriptionText);

    // Progress bar background
    this.progressBar = scene.add.graphics();
    this.progressBar.fillStyle(PROGRESS_BG_COLOR, 1);
    this.progressBar.fillRoundedRect(35, 28, this.progressWidth, 8, 4);
    this.container.add(this.progressBar);
  }

  /**
   * Get human-readable description for condition
   */
  private getConditionDescription(condition: VictoryCondition): string {
    switch (condition.type) {
      case 'defeat_enemy':
        return 'Defeat all enemies';
      case 'build_structure':
        const count = condition.count ?? 1;
        return `Build ${count} ${condition.target}`;
      case 'capture_planet':
        if (condition.target) {
          return `Capture ${condition.target}`;
        }
        return `Capture ${condition.count ?? 1} planets`;
      case 'survive_turns':
        return `Survive ${condition.turns ?? 10} turns`;
      default:
        return 'Unknown objective';
    }
  }

  /**
   * Update the row with new progress
   */
  public updateProgress(result: ConditionResult): void {
    // Update status icon
    if (result.met) {
      this.statusIcon.setText('✓');
      this.statusIcon.setColor(COMPLETE_COLOR);
      this.descriptionText.setColor(COMPLETE_COLOR);
    } else {
      this.statusIcon.setText('○');
      this.statusIcon.setColor(INCOMPLETE_COLOR);
      this.descriptionText.setColor(TEXT_COLOR);
    }

    // Update progress bar
    this.progressBar.clear();
    this.progressBar.fillStyle(PROGRESS_BG_COLOR, 1);
    this.progressBar.fillRoundedRect(35, 28, this.progressWidth, 8, 4);

    const fillWidth = this.progressWidth * result.progress;
    if (fillWidth > 0) {
      this.progressBar.fillStyle(result.met ? 0x44ff44 : PROGRESS_FILL_COLOR, 1);
      this.progressBar.fillRoundedRect(35, 28, fillWidth, 8, 4);
    }

    // Update description with current progress text
    this.descriptionText.setText(result.description);
  }

  /**
   * Destroy the row
   */
  public destroy(): void {
    this.container.destroy();
  }
}
