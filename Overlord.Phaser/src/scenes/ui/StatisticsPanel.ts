/**
 * StatisticsPanel
 * Story 10-7: User Statistics Tracking
 *
 * UI panel displaying user lifetime gameplay statistics.
 * Shows campaign stats, playtime, combat stats, and Flash Conflict progress.
 */

import Phaser from 'phaser';
import {
  getUserStatisticsService,
  UserStatistics,
} from '../../services/UserStatisticsService';

const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 450;
const PADDING = 30;
const LINE_HEIGHT = 32;

const COLORS = {
  BACKGROUND: 0x1a1a2e,
  BORDER: 0x4a4a6a,
  SECTION_BG: 0x252545,
  TEXT: '#ffffff',
  TEXT_LABEL: '#aaaacc',
  TEXT_VALUE: '#88ff88',
  TEXT_HIGHLIGHT: '#ffcc44',
  CLOSE_BUTTON: 0x664444,
  CLOSE_HOVER: 0x884444,
};

/**
 * StatisticsPanel - UI component for displaying user statistics
 */
export class StatisticsPanel extends Phaser.GameObjects.Container {
  // UI Elements
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private closeButton!: Phaser.GameObjects.Rectangle;
  private closeButtonText!: Phaser.GameObjects.Text;

  // Statistics display elements
  private statsLabels: Phaser.GameObjects.Text[] = [];
  private statsValues: Phaser.GameObjects.Text[] = [];
  private loadingText!: Phaser.GameObjects.Text;

  // Callbacks
  public onClose: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.setVisible(false);
    this.createBackground();
    this.createTitle();
    this.createCloseButton();
    this.createLoadingText();

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  // ============================================
  // UI Creation
  // ============================================

  private createBackground(): void {
    this.background = this.scene.add.graphics();
    this.background.fillStyle(COLORS.BACKGROUND, 0.95);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.background.lineStyle(2, COLORS.BORDER);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);
    this.add(this.background);
  }

  private createTitle(): void {
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 25, 'Player Statistics', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: COLORS.TEXT,
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createCloseButton(): void {
    const buttonWidth = 80;
    const buttonHeight = 32;
    const buttonX = PANEL_WIDTH - buttonWidth - 15;
    const buttonY = 10;

    this.closeButton = this.scene.add.rectangle(
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      COLORS.CLOSE_BUTTON
    );
    this.closeButton.setInteractive({ useHandCursor: true });
    this.add(this.closeButton);

    this.closeButtonText = this.scene.add.text(
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2,
      'Close',
      {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: COLORS.TEXT,
      }
    );
    this.closeButtonText.setOrigin(0.5, 0.5);
    this.add(this.closeButtonText);

    // Hover effects
    this.closeButton.on('pointerover', () => {
      this.closeButton.setFillStyle(COLORS.CLOSE_HOVER);
    });

    this.closeButton.on('pointerout', () => {
      this.closeButton.setFillStyle(COLORS.CLOSE_BUTTON);
    });

    this.closeButton.on('pointerdown', () => {
      this.hide();
      this.onClose?.();
    });
  }

  private createLoadingText(): void {
    this.loadingText = this.scene.add.text(
      PANEL_WIDTH / 2,
      PANEL_HEIGHT / 2,
      'Loading statistics...',
      {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: COLORS.TEXT_LABEL,
      }
    );
    this.loadingText.setOrigin(0.5, 0.5);
    this.add(this.loadingText);
  }

  // ============================================
  // Statistics Display
  // ============================================

  /**
   * Load and display statistics
   */
  public async loadStatistics(): Promise<void> {
    this.loadingText.setVisible(true);
    this.clearStatsDisplay();

    const service = getUserStatisticsService();
    const result = await service.getStatistics();

    this.loadingText.setVisible(false);

    if (result.success && result.statistics) {
      this.displayStatistics(result.statistics);
    } else {
      this.displayError(result.error || 'Failed to load statistics');
    }
  }

  /**
   * Clear existing stats display
   */
  private clearStatsDisplay(): void {
    this.statsLabels.forEach((label) => label.destroy());
    this.statsValues.forEach((value) => value.destroy());
    this.statsLabels = [];
    this.statsValues = [];
  }

  /**
   * Display statistics in the panel
   */
  private displayStatistics(stats: UserStatistics): void {
    const service = getUserStatisticsService();
    let y = 70;

    // Campaign Statistics Section
    y = this.addSectionHeader('Campaign Statistics', y);
    y = this.addStatRow('Campaigns Started', stats.campaignsStarted.toString(), y);
    y = this.addStatRow('Campaigns Won', stats.campaignsWon.toString(), y);
    y = this.addStatRow('Campaigns Lost', stats.campaignsLost.toString(), y);
    y = this.addStatRow(
      'Win Rate',
      `${service.calculateWinRate(stats)}%`,
      y,
      COLORS.TEXT_HIGHLIGHT
    );

    y += 10; // Section spacing

    // Playtime Section
    y = this.addSectionHeader('Playtime', y);
    y = this.addStatRow(
      'Total Playtime',
      service.formatPlaytime(stats.totalPlaytimeSeconds),
      y,
      COLORS.TEXT_HIGHLIGHT
    );

    y += 10;

    // Combat Statistics Section
    y = this.addSectionHeader('Combat Statistics', y);
    y = this.addStatRow('Planets Conquered', stats.planetsConquered.toString(), y);
    y = this.addStatRow('Planets Lost', stats.planetsLost.toString(), y);
    y = this.addStatRow('Battles Won', stats.battlesWon.toString(), y);
    y = this.addStatRow('Battles Lost', stats.battlesLost.toString(), y);

    y += 10;

    // Flash Conflicts Section
    y = this.addSectionHeader('Flash Conflicts', y);
    y = this.addStatRow('Completed', stats.flashConflictsCompleted.toString(), y);
    y = this.addStatRow(
      '3-Star Completions',
      stats.flashConflictsThreeStar.toString(),
      y,
      COLORS.TEXT_HIGHLIGHT
    );
  }

  /**
   * Add a section header
   */
  private addSectionHeader(title: string, y: number): number {
    const header = this.scene.add.text(PADDING, y, title, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: COLORS.TEXT_HIGHLIGHT,
      fontStyle: 'bold',
    });
    this.add(header);
    this.statsLabels.push(header);
    return y + LINE_HEIGHT;
  }

  /**
   * Add a stat row with label and value
   */
  private addStatRow(
    label: string,
    value: string,
    y: number,
    valueColor: string = COLORS.TEXT_VALUE
  ): number {
    const labelText = this.scene.add.text(PADDING + 20, y, label, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: COLORS.TEXT_LABEL,
    });
    this.add(labelText);
    this.statsLabels.push(labelText);

    const valueText = this.scene.add.text(PANEL_WIDTH - PADDING - 20, y, value, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: valueColor,
    });
    valueText.setOrigin(1, 0);
    this.add(valueText);
    this.statsValues.push(valueText);

    return y + LINE_HEIGHT - 6;
  }

  /**
   * Display error message
   */
  private displayError(message: string): void {
    const errorText = this.scene.add.text(PANEL_WIDTH / 2, PANEL_HEIGHT / 2, message, {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ff6666',
    });
    errorText.setOrigin(0.5, 0.5);
    this.add(errorText);
    this.statsLabels.push(errorText);
  }

  // ============================================
  // Show/Hide
  // ============================================

  /**
   * Show the panel centered on screen
   */
  public show(): void {
    const centerX = this.scene.cameras.main.width / 2 - PANEL_WIDTH / 2;
    const centerY = this.scene.cameras.main.height / 2 - PANEL_HEIGHT / 2;
    this.setPosition(centerX, centerY);
    this.setVisible(true);
    this.setDepth(1000);
    this.loadStatistics();
  }

  /**
   * Hide the panel
   */
  public hide(): void {
    this.setVisible(false);
    this.clearStatsDisplay();
  }

  /**
   * Toggle panel visibility
   */
  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  // ============================================
  // Cleanup
  // ============================================

  public destroy(fromScene?: boolean): void {
    this.clearStatsDisplay();
    super.destroy(fromScene);
  }
}
