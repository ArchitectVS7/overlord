/**
 * AdminEditModeIndicator - Visual indicator for admin edit mode
 *
 * Displays a banner when edit mode is active with:
 * - Edit mode status text
 * - Save All button
 * - Reset All button
 * - Discard button
 * - Exit button
 * - Pending changes count
 */

import Phaser from 'phaser';

/**
 * Callback types for indicator actions
 */
export interface AdminEditModeIndicatorCallbacks {
  onSaveAll?: () => Promise<void>;
  onResetAll?: () => void;
  onDiscard?: () => void;
  onExit?: () => void;
}

/**
 * AdminEditModeIndicator component
 * Shows edit mode status and control buttons
 */
export class AdminEditModeIndicator extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private titleText: Phaser.GameObjects.Text;
  private changesText: Phaser.GameObjects.Text;
  private saveButton: Phaser.GameObjects.Container;
  private resetButton: Phaser.GameObjects.Container;
  private discardButton: Phaser.GameObjects.Container;
  private exitButton: Phaser.GameObjects.Container;
  private callbacks: AdminEditModeIndicatorCallbacks;
  private pendingChangesCount: number = 0;
  private isSaving: boolean = false;

  private static readonly PANEL_WIDTH = 600;
  private static readonly PANEL_HEIGHT = 50;
  private static readonly BUTTON_WIDTH = 80;
  private static readonly BUTTON_HEIGHT = 30;

  constructor(scene: Phaser.Scene, callbacks: AdminEditModeIndicatorCallbacks = {}) {
    super(scene, 0, 0);

    this.callbacks = callbacks;

    // Position at top center of screen
    const camera = scene.cameras.main;
    this.setPosition(camera.width / 2, 35);
    this.setDepth(10000);
    this.setScrollFactor(0);

    // Create background
    this.background = scene.add.rectangle(
      0,
      0,
      AdminEditModeIndicator.PANEL_WIDTH,
      AdminEditModeIndicator.PANEL_HEIGHT,
      0x990000,
      0.95
    );
    this.background.setStrokeStyle(2, 0xff0000);
    this.add(this.background);

    // Create title text
    this.titleText = scene.add.text(-270, -8, 'EDIT MODE', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5);
    this.add(this.titleText);

    // Create changes count text
    this.changesText = scene.add.text(-270, 10, '0 unsaved changes', {
      fontSize: '11px',
      color: '#ffcccc',
      fontFamily: 'monospace',
    }).setOrigin(0, 0.5);
    this.add(this.changesText);

    // Create buttons
    this.saveButton = this.createButton('Save All', 30, 0x006600, () => this.handleSave());
    this.add(this.saveButton);

    this.resetButton = this.createButton('Reset All', 120, 0x666600, () => this.handleReset());
    this.add(this.resetButton);

    this.discardButton = this.createButton('Discard', 210, 0x666666, () => this.handleDiscard());
    this.add(this.discardButton);

    this.exitButton = this.createButton('Exit', 285, 0x660000, () => this.handleExit());
    this.add(this.exitButton);

    // Initially hidden
    this.setVisible(false);

    // Add to scene
    scene.add.existing(this);
  }

  /**
   * Create a button with text and click handler
   */
  private createButton(
    label: string,
    x: number,
    color: number,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, 0);

    // Button background
    const bg = this.scene.add.rectangle(
      0,
      0,
      AdminEditModeIndicator.BUTTON_WIDTH,
      AdminEditModeIndicator.BUTTON_HEIGHT,
      color,
      1
    );
    bg.setStrokeStyle(1, 0xffffff);
    container.add(bg);

    // Button text
    const text = this.scene.add.text(0, 0, label, {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
    container.add(text);

    // Interactive zone
    const zone = this.scene.add.zone(
      0,
      0,
      AdminEditModeIndicator.BUTTON_WIDTH,
      AdminEditModeIndicator.BUTTON_HEIGHT
    );
    zone.setInteractive({ useHandCursor: true });
    container.add(zone);

    // Hover effects
    zone.on('pointerover', () => {
      bg.setFillStyle(color + 0x333333);
    });

    zone.on('pointerout', () => {
      bg.setFillStyle(color);
    });

    zone.on('pointerdown', () => {
      onClick();
    });

    return container;
  }

  /**
   * Show the indicator
   */
  public show(): void {
    this.setVisible(true);

    // Animate in from top
    this.setAlpha(0);
    this.y = 0;
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      y: 35,
      duration: 200,
      ease: 'Power2',
    });
  }

  /**
   * Hide the indicator
   */
  public hide(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      y: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false);
      },
    });
  }

  /**
   * Update the pending changes count
   */
  public updateChangesCount(count: number): void {
    this.pendingChangesCount = count;
    const text = count === 1 ? '1 unsaved change' : `${count} unsaved changes`;
    this.changesText.setText(text);

    // Highlight if there are unsaved changes
    if (count > 0) {
      this.changesText.setColor('#ffff00');
    } else {
      this.changesText.setColor('#ffcccc');
    }
  }

  /**
   * Set saving state (disables buttons during save)
   */
  public setSaving(saving: boolean): void {
    this.isSaving = saving;

    if (saving) {
      this.titleText.setText('SAVING...');
      this.saveButton.setAlpha(0.5);
    } else {
      this.titleText.setText('EDIT MODE');
      this.saveButton.setAlpha(1);
    }
  }

  /**
   * Handle Save All button click
   */
  private async handleSave(): Promise<void> {
    if (this.isSaving) {
      return;
    }

    if (this.pendingChangesCount === 0) {
      console.log('No changes to save');
      return;
    }

    this.setSaving(true);

    try {
      await this.callbacks.onSaveAll?.();
      this.updateChangesCount(0);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      this.setSaving(false);
    }
  }

  /**
   * Handle Reset All button click
   */
  private handleReset(): void {
    if (this.isSaving) {
      return;
    }

    this.callbacks.onResetAll?.();
    this.updateChangesCount(0);
  }

  /**
   * Handle Discard button click
   */
  private handleDiscard(): void {
    if (this.isSaving) {
      return;
    }

    this.callbacks.onDiscard?.();
    this.updateChangesCount(0);
  }

  /**
   * Handle Exit button click
   */
  private handleExit(): void {
    if (this.isSaving) {
      return;
    }

    // Warn if there are unsaved changes
    if (this.pendingChangesCount > 0) {
      // For now, just exit - could add confirmation dialog later
      console.warn(`Exiting with ${this.pendingChangesCount} unsaved changes`);
    }

    this.callbacks.onExit?.();
  }

  /**
   * Set callbacks
   */
  public setCallbacks(callbacks: AdminEditModeIndicatorCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Check if currently visible
   */
  public getIsVisible(): boolean {
    return this.visible;
  }

  /**
   * Destroy the indicator
   */
  public destroy(): void {
    this.scene.tweens.killTweensOf(this);
    super.destroy();
  }
}
