/**
 * ScenarioResultsPanel - Display scenario completion results
 * Story 1-5: Scenario Completion and Results Display
 *
 * Features:
 * - Display victory or defeat screen
 * - Show completion time (MM:SS format)
 * - Show victory condition met or defeat reason
 * - Star rating display (1-3 stars)
 * - Continue/Retry/Exit buttons
 */

import Phaser from 'phaser';
import { ScenarioResults, StarRatingSystem } from '@core/StarRatingSystem';

// Panel styling constants
const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 380;
const PADDING = 30;
const BG_COLOR = 0x1a2a3a;
const BORDER_COLOR_VICTORY = 0x44ff44;
const BORDER_COLOR_DEFEAT = 0xff4444;
const TEXT_COLOR = '#ffffff';
const STAR_COLOR_FILLED = '#ffcc00';
const STAR_COLOR_EMPTY = '#444444';
const PANEL_DEPTH = 1700;

/**
 * UI panel for displaying scenario completion results
 */
export class ScenarioResultsPanel {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private conditionText!: Phaser.GameObjects.Text;
  private starTexts: Phaser.GameObjects.Text[] = [];
  private ratingText!: Phaser.GameObjects.Text;
  private continueButton!: Phaser.GameObjects.Text;
  private retryButton!: Phaser.GameObjects.Text;
  private exitButton!: Phaser.GameObjects.Text;

  private visible: boolean = false;
  private ratingSystem: StarRatingSystem;

  // Callbacks
  public onContinue?: () => void;
  public onRetry?: () => void;
  public onExit?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.ratingSystem = new StarRatingSystem();
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
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.7);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(PANEL_DEPTH - 1);
    this.backdrop.setVisible(false);
    this.backdrop.setInteractive({ useHandCursor: false }); // Block clicks behind

    // Container for panel contents
    this.container = this.scene.add.container(x, y);
    this.container.setDepth(PANEL_DEPTH);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.container.add(this.background);

    // Title
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, PADDING, '', {
      fontSize: '32px',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0);
    this.container.add(this.titleText);

    // Time
    this.timeText = this.scene.add.text(PANEL_WIDTH / 2, PADDING + 60, '', {
      fontSize: '24px',
      color: TEXT_COLOR,
    });
    this.timeText.setOrigin(0.5, 0);
    this.container.add(this.timeText);

    // Condition/Reason text
    this.conditionText = this.scene.add.text(PANEL_WIDTH / 2, PADDING + 100, '', {
      fontSize: '18px',
      color: '#aaaaaa',
    });
    this.conditionText.setOrigin(0.5, 0);
    this.container.add(this.conditionText);

    // Star rating (3 stars)
    for (let i = 0; i < 3; i++) {
      const starX = PANEL_WIDTH / 2 - 50 + i * 50;
      const star = this.scene.add.text(starX, PADDING + 150, '★', {
        fontSize: '40px',
        color: STAR_COLOR_EMPTY,
      });
      star.setOrigin(0.5, 0);
      this.starTexts.push(star);
      this.container.add(star);
    }

    // Rating description
    this.ratingText = this.scene.add.text(PANEL_WIDTH / 2, PADDING + 200, '', {
      fontSize: '20px',
      color: STAR_COLOR_FILLED,
      fontStyle: 'bold',
    });
    this.ratingText.setOrigin(0.5, 0);
    this.container.add(this.ratingText);

    // Continue button
    this.continueButton = this.createButton(
      PANEL_WIDTH / 2,
      PANEL_HEIGHT - PADDING - 80,
      'Continue',
      '#44ff44',
      () => this.triggerContinue(),
    );

    // Retry button
    this.retryButton = this.createButton(
      PANEL_WIDTH / 2 - 80,
      PANEL_HEIGHT - PADDING - 30,
      'Retry',
      '#ffaa44',
      () => this.triggerRetry(),
    );

    // Exit button
    this.exitButton = this.createButton(
      PANEL_WIDTH / 2 + 80,
      PANEL_HEIGHT - PADDING - 30,
      'Exit',
      '#888888',
      () => this.triggerExit(),
    );
  }

  /**
   * Create a text button
   */
  private createButton(
    x: number,
    y: number,
    text: string,
    color: string,
    onClick: () => void,
  ): Phaser.GameObjects.Text {
    const button = this.scene.add.text(x, y, text, {
      fontSize: '20px',
      color: color,
      fontStyle: 'bold',
    });
    button.setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });
    button.on('pointerover', () => button.setAlpha(0.7));
    button.on('pointerout', () => button.setAlpha(1));
    button.on('pointerdown', onClick);
    this.container.add(button);
    return button;
  }

  /**
   * Show victory results
   * @param results Scenario completion results
   */
  public showVictory(results: ScenarioResults): void {
    // Update border color
    this.background.clear();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.background.lineStyle(3, BORDER_COLOR_VICTORY, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);

    // Update content
    this.titleText.setText('Scenario Complete!');
    this.titleText.setColor('#44ff44');

    this.timeText.setText(`Time: ${this.ratingSystem.formatTime(results.completionTime)}`);

    if (results.conditionMet) {
      this.conditionText.setText(`Victory: ${results.conditionMet}`);
    } else {
      this.conditionText.setText('All conditions met!');
    }

    // Update stars
    this.updateStars(results.starRating);
    this.ratingText.setText(this.ratingSystem.getStarDescription(results.starRating));

    // Show buttons
    this.continueButton.setVisible(true);
    this.retryButton.setVisible(false);
    this.exitButton.setVisible(false);

    this.show();
  }

  /**
   * Show defeat results
   * @param results Scenario completion results
   */
  public showDefeat(results: ScenarioResults): void {
    // Update border color
    this.background.clear();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.background.lineStyle(3, BORDER_COLOR_DEFEAT, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);

    // Update content
    this.titleText.setText('Scenario Failed');
    this.titleText.setColor('#ff4444');

    this.timeText.setText(`Time: ${this.ratingSystem.formatTime(results.completionTime)}`);

    if (results.defeatReason) {
      this.conditionText.setText(`Reason: ${results.defeatReason}`);
    } else {
      this.conditionText.setText('Defeat conditions met');
    }

    // Clear stars for defeat
    this.updateStars(0);
    this.ratingText.setText(this.ratingSystem.getStarDescription(0));

    // Show buttons
    this.continueButton.setVisible(false);
    this.retryButton.setVisible(true);
    this.exitButton.setVisible(true);

    this.show();
  }

  /**
   * Update star display
   * @param starCount Number of filled stars (0-3)
   */
  private updateStars(starCount: number): void {
    for (let i = 0; i < 3; i++) {
      if (i < starCount) {
        this.starTexts[i].setColor(STAR_COLOR_FILLED);
      } else {
        this.starTexts[i].setColor(STAR_COLOR_EMPTY);
      }
    }
  }

  /**
   * Trigger continue action
   */
  public triggerContinue(): void {
    this.onContinue?.();
  }

  /**
   * Trigger retry action
   */
  public triggerRetry(): void {
    this.onRetry?.();
  }

  /**
   * Trigger exit action
   */
  public triggerExit(): void {
    this.onExit?.();
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
   * Check if panel is visible
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Destroy the panel
   */
  public destroy(): void {
    this.backdrop.destroy();
    this.container.destroy();
  }
}
