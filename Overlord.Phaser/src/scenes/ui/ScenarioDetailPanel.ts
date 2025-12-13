/**
 * ScenarioDetailPanel - UI panel showing detailed scenario information
 *
 * Story 1-2: Scenario Selection Interface
 *
 * Features:
 * - Shows expanded scenario information
 * - Displays description, victory conditions, prerequisites
 * - Shows completion status
 * - "Start Scenario" and "Back to List" buttons
 * - Prerequisites check and blocking
 */

import Phaser from 'phaser';
import { Scenario } from '@core/models/ScenarioModels';
import { ScenarioManager } from '@core/ScenarioManager';

// Panel dimensions and styling
const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 600;
const PADDING = 20;
const BUTTON_HEIGHT = 40;
const BUTTON_WIDTH = 180;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const SUCCESS_COLOR = '#44aa44';
const BUTTON_BG_COLOR = 0x4488ff;
const BUTTON_HOVER_COLOR = 0x5599ff;
const BUTTON_DISABLED_COLOR = 0x333344;
const STAR_COLOR_FILLED = '#ffcc00';
const STAR_COLOR_EMPTY = '#444444';

interface CompletionDetails {
  bestTimeSeconds: number;
  starRating: number;
}

export class ScenarioDetailPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private scenario: Scenario | null = null;
  private manager: ScenarioManager;
  private completionDetails?: CompletionDetails;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private descriptionText!: Phaser.GameObjects.Text;
  private victoryText!: Phaser.GameObjects.Text;
  private prerequisitesText!: Phaser.GameObjects.Text;
  private completionText!: Phaser.GameObjects.Text;
  private bestTimeText!: Phaser.GameObjects.Text;
  private starRatingContainer!: Phaser.GameObjects.Container;
  private startButton!: Phaser.GameObjects.Container;
  private backButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onStartScenario?: (scenario: Scenario) => void;
  public onBack?: () => void;

  constructor(scene: Phaser.Scene, manager: ScenarioManager) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.manager = manager;

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1300);
    this.setScrollFactor(0);
  }

  private createBackdrop(): void {
    const camera = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.6);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setInteractive({ useHandCursor: false });
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(1299);
    this.backdrop.setVisible(false);
    this.backdrop.on('pointerdown', () => this.hide());
  }

  private createPanel(): void {
    const camera = this.scene.cameras.main;
    const x = (camera.width - PANEL_WIDTH) / 2;
    const y = (camera.height - PANEL_HEIGHT) / 2;
    this.setPosition(x, y);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);

    // Border
    this.borderGraphics = this.scene.add.graphics();
    this.borderGraphics.lineStyle(2, BORDER_COLOR, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.borderGraphics);

    // Content container
    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Title
    this.titleText = this.scene.add.text(0, 0, '', {
      fontSize: '24px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.titleText);

    // Close button
    const closeButton = this.scene.add.text(
      PANEL_WIDTH - PADDING * 2,
      0,
      'X',
      {
        fontSize: '24px',
        color: TEXT_COLOR
      }
    );
    closeButton.setInteractive({ useHandCursor: true });
    closeButton.on('pointerdown', () => this.hide());
    this.contentContainer.add(closeButton);

    // Description
    this.descriptionText = this.scene.add.text(0, 60, '', {
      fontSize: '16px',
      color: TEXT_COLOR,
      wordWrap: { width: PANEL_WIDTH - PADDING * 2 }
    });
    this.contentContainer.add(this.descriptionText);

    // Victory conditions
    this.victoryText = this.scene.add.text(0, 160, '', {
      fontSize: '14px',
      color: LABEL_COLOR,
      wordWrap: { width: PANEL_WIDTH - PADDING * 2 }
    });
    this.contentContainer.add(this.victoryText);

    // Prerequisites
    this.prerequisitesText = this.scene.add.text(0, 260, '', {
      fontSize: '14px',
      color: LABEL_COLOR,
      wordWrap: { width: PANEL_WIDTH - PADDING * 2 }
    });
    this.contentContainer.add(this.prerequisitesText);

    // Completion status
    this.completionText = this.scene.add.text(0, 320, '', {
      fontSize: '14px',
      color: SUCCESS_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.completionText);

    // Best time (Story 1-6)
    this.bestTimeText = this.scene.add.text(0, 350, '', {
      fontSize: '14px',
      color: LABEL_COLOR
    });
    this.contentContainer.add(this.bestTimeText);

    // Star rating container (Story 1-6)
    this.starRatingContainer = this.scene.add.container(0, 380);
    this.contentContainer.add(this.starRatingContainer);

    // Start button
    this.startButton = this.createButton(
      PANEL_WIDTH / 2 - BUTTON_WIDTH - 10,
      PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 20,
      'Start Scenario',
      () => this.startScenario()
    );
    this.add(this.startButton);

    // Back button
    this.backButton = this.createButton(
      PANEL_WIDTH / 2 + 10,
      PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 20,
      'Back to List',
      () => this.handleBack()
    );
    this.add(this.backButton);
  }

  private createButton(x: number, y: number, label: string, callback: () => void): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    bg.fillStyle(BUTTON_BG_COLOR, 1);
    bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    container.add(bg);

    const text = this.scene.add.text(BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, label, {
      fontSize: '16px',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    text.setOrigin(0.5, 0.5);
    container.add(text);

    const hitArea = this.scene.add.rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 0x000000, 0);
    hitArea.setOrigin(0, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(BUTTON_HOVER_COLOR, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    });
    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(BUTTON_BG_COLOR, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    });
    hitArea.on('pointerdown', callback);
    container.add(hitArea);

    container.setData('bg', bg);
    container.setData('hitArea', hitArea);

    return container;
  }

  /**
   * Set the scenario to display
   */
  setScenario(scenario: Scenario): void {
    this.scenario = scenario;
    this.updateDisplay();
  }

  /**
   * Update the panel display with scenario data
   */
  private updateDisplay(): void {
    if (!this.scenario) return;

    // Title
    this.titleText.setText(this.scenario.name);

    // Description
    this.descriptionText.setText(this.scenario.description);

    // Victory conditions
    const victoryText = this.formatVictoryConditions();
    this.victoryText.setText(`Victory Conditions:\n${victoryText}`);

    // Prerequisites
    const prereqText = this.formatPrerequisites();
    this.prerequisitesText.setText(prereqText);

    // Completion status
    const completion = this.manager.getCompletion(this.scenario.id);
    if (completion?.completed) {
      this.completionText.setText('✓ Completed');
      this.completionText.setColor(SUCCESS_COLOR);
    } else {
      this.completionText.setText('Not completed');
      this.completionText.setColor(LABEL_COLOR);
    }

    // Update start button state
    this.updateStartButton();
  }

  /**
   * Format victory conditions for display
   */
  private formatVictoryConditions(): string {
    if (!this.scenario) return '';

    return this.scenario.victoryConditions.map(vc => {
      switch (vc.type) {
        case 'build_structure':
          return `• Build ${vc.count} ${vc.target}`;
        case 'capture_planet':
          return `• Capture ${vc.count} planet(s)`;
        case 'defeat_enemy':
          return `• Defeat all enemy forces`;
        case 'survive_turns':
          return `• Survive ${vc.turns} turns`;
        default:
          return `• ${vc.type}`;
      }
    }).join('\n');
  }

  /**
   * Format prerequisites for display
   */
  private formatPrerequisites(): string {
    if (!this.scenario) return '';

    if (this.scenario.prerequisites.length === 0) {
      return 'Prerequisites: None';
    }

    const prereqsMet = this.manager.checkPrerequisites(this.scenario.id);
    const status = prereqsMet ? '✓ Met' : '✗ Not Met';

    const prereqList = this.scenario.prerequisites.map(id => {
      const prereqScenario = this.manager.getScenarioById(id);
      const completed = this.manager.getCompletion(id)?.completed;
      return `  ${completed ? '✓' : '✗'} ${prereqScenario?.name || id}`;
    }).join('\n');

    return `Prerequisites: ${status}\n${prereqList}`;
  }

  /**
   * Update start button enabled/disabled state
   */
  private updateStartButton(): void {
    if (!this.scenario) return;

    const canStart = this.manager.checkPrerequisites(this.scenario.id);
    const bg = this.startButton.getData('bg') as Phaser.GameObjects.Graphics;
    const hitArea = this.startButton.getData('hitArea') as Phaser.GameObjects.Rectangle;

    if (canStart) {
      bg.clear();
      bg.fillStyle(BUTTON_BG_COLOR, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
      hitArea.setInteractive({ useHandCursor: true });
    } else {
      bg.clear();
      bg.fillStyle(BUTTON_DISABLED_COLOR, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
      hitArea.disableInteractive();
    }
  }

  /**
   * Start the scenario
   */
  startScenario(): void {
    if (!this.scenario) return;

    const canStart = this.manager.checkPrerequisites(this.scenario.id);
    if (!canStart) return;

    if (this.onStartScenario) {
      this.onStartScenario(this.scenario);
    }
  }

  /**
   * Handle back button
   */
  private handleBack(): void {
    this.hide();
    if (this.onBack) {
      this.onBack();
    }
  }

  /**
   * Show the panel
   */
  show(): void {
    this.setVisible(true);
    this.backdrop.setVisible(true);
  }

  /**
   * Hide the panel
   */
  hide(): void {
    this.setVisible(false);
    this.backdrop.setVisible(false);
  }

  /**
   * Get displayed scenario ID for testing
   */
  getDisplayedScenarioId(): string | null {
    return this.scenario?.id || null;
  }

  /**
   * Check if prerequisites are met for testing
   */
  arePrerequisitesMet(): boolean {
    if (!this.scenario) return false;
    return this.manager.checkPrerequisites(this.scenario.id);
  }

  /**
   * Check if scenario is completed for testing
   */
  isCompleted(): boolean {
    if (!this.scenario) return false;
    return this.manager.getCompletion(this.scenario.id)?.completed === true;
  }

  /**
   * Set completion details (best time, star rating)
   * Story 1-6: Scenario Completion History Tracking
   */
  setCompletionDetails(details: CompletionDetails): void {
    this.completionDetails = details;
    this.updateCompletionDetailsDisplay();
  }

  /**
   * Get completion details
   */
  getCompletionDetails(): CompletionDetails | undefined {
    return this.completionDetails;
  }

  /**
   * Format special rules for display (Story 8-1)
   * @returns Formatted string of special rules
   */
  formatSpecialRules(): string {
    if (!this.scenario || !this.scenario.specialRules || this.scenario.specialRules.length === 0) {
      return '';
    }

    return this.scenario.specialRules.map(rule => {
      return `⚠ ${rule.description}`;
    }).join('\n');
  }

  /**
   * Get count of special rules (Story 8-1)
   * @returns Number of special rules
   */
  getSpecialRulesCount(): number {
    return this.scenario?.specialRules?.length ?? 0;
  }

  /**
   * Update the best time and star rating display
   */
  private updateCompletionDetailsDisplay(): void {
    if (!this.completionDetails) {
      this.bestTimeText.setText('');
      this.starRatingContainer.removeAll(true);
      return;
    }

    // Format and display best time
    const minutes = Math.floor(this.completionDetails.bestTimeSeconds / 60);
    const seconds = Math.floor(this.completionDetails.bestTimeSeconds % 60);
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    this.bestTimeText.setText(`Best Time: ${timeFormatted}`);

    // Display star rating
    this.starRatingContainer.removeAll(true);
    for (let i = 0; i < 3; i++) {
      const starX = i * 25;
      const starColor = i < this.completionDetails.starRating ? STAR_COLOR_FILLED : STAR_COLOR_EMPTY;
      const starText = this.scene.add.text(starX, 0, '★', {
        fontSize: '20px',
        color: starColor
      });
      this.starRatingContainer.add(starText);
    }
  }

  /**
   * Clean up
   */
  destroy(fromScene?: boolean): void {
    this.backdrop.destroy();
    super.destroy(fromScene);
  }
}
