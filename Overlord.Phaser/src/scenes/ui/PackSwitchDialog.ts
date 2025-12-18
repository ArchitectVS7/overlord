/**
 * PackSwitchDialog - Confirmation dialog for switching scenario packs
 * Story 9-2: Scenario Pack Switching and Configuration Loading
 *
 * Features:
 * - Confirmation prompt UI
 * - Warning about active campaigns
 * - Confirm/Cancel buttons
 */

import Phaser from 'phaser';

// Dialog dimensions
const DIALOG_WIDTH = 400;
const DIALOG_HEIGHT = 220;
const BUTTON_WIDTH = 120;
const BUTTON_HEIGHT = 35;
const PADDING = 20;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const WARNING_COLOR = '#ffaa44';
const CONFIRM_BG_COLOR = 0x44aa44;
const CONFIRM_HOVER_COLOR = 0x55bb55;
const CANCEL_BG_COLOR = 0x666666;
const CANCEL_HOVER_COLOR = 0x888888;

export class PackSwitchDialog extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private backdrop!: Phaser.GameObjects.Rectangle;
  private titleText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private warningText!: Phaser.GameObjects.Text;
  private confirmButton!: Phaser.GameObjects.Container;
  private cancelButton!: Phaser.GameObjects.Container;

  private packName: string = '';
  private hasActiveCampaign: boolean = false;

  // Callbacks
  public onConfirm?: () => void;
  public onCancel?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);

    this.createBackdrop();
    this.createDialog();
    this.setVisible(false);
    this.setDepth(1500);
    this.setScrollFactor(0);
  }

  private createBackdrop(): void {
    const camera = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.7);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setInteractive({ useHandCursor: false });
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(1499);
    this.backdrop.setVisible(false);
    // Block clicks but don't auto-cancel
  }

  private createDialog(): void {
    const camera = this.scene.cameras.main;
    const x = (camera.width - DIALOG_WIDTH) / 2;
    const y = (camera.height - DIALOG_HEIGHT) / 2;
    this.setPosition(x, y);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, DIALOG_WIDTH, DIALOG_HEIGHT, 8);
    this.background.lineStyle(2, BORDER_COLOR, 1);
    this.background.strokeRoundedRect(0, 0, DIALOG_WIDTH, DIALOG_HEIGHT, 8);
    this.add(this.background);

    // Title
    this.titleText = this.scene.add.text(
      DIALOG_WIDTH / 2,
      PADDING,
      'Switch Scenario Pack?',
      {
        fontSize: '22px',
        color: TEXT_COLOR,
        fontStyle: 'bold',
      },
    );
    this.titleText.setOrigin(0.5, 0);
    this.add(this.titleText);

    // Message
    this.messageText = this.scene.add.text(
      DIALOG_WIDTH / 2,
      60,
      '',
      {
        fontSize: '14px',
        color: TEXT_COLOR,
        wordWrap: { width: DIALOG_WIDTH - PADDING * 2 },
      },
    );
    this.messageText.setOrigin(0.5, 0);
    this.add(this.messageText);

    // Warning text (for active campaigns)
    this.warningText = this.scene.add.text(
      DIALOG_WIDTH / 2,
      100,
      '',
      {
        fontSize: '12px',
        color: WARNING_COLOR,
        fontStyle: 'italic',
      },
    );
    this.warningText.setOrigin(0.5, 0);
    this.add(this.warningText);

    // Buttons
    const buttonY = DIALOG_HEIGHT - PADDING - BUTTON_HEIGHT;

    this.confirmButton = this.createButton(
      DIALOG_WIDTH / 2 - BUTTON_WIDTH - 10,
      buttonY,
      'Confirm',
      CONFIRM_BG_COLOR,
      CONFIRM_HOVER_COLOR,
      () => this.confirm(),
    );
    this.add(this.confirmButton);

    this.cancelButton = this.createButton(
      DIALOG_WIDTH / 2 + 10,
      buttonY,
      'Cancel',
      CANCEL_BG_COLOR,
      CANCEL_HOVER_COLOR,
      () => this.cancel(),
    );
    this.add(this.cancelButton);
  }

  private createButton(
    x: number,
    y: number,
    label: string,
    bgColor: number,
    hoverColor: number,
    callback: () => void,
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    bg.fillStyle(bgColor, 1);
    bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    container.add(bg);

    const text = this.scene.add.text(BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, label, {
      fontSize: '14px',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5, 0.5);
    container.add(text);

    const hitArea = this.scene.add.rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 0x000000, 0);
    hitArea.setOrigin(0, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(hoverColor, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    });
    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(bgColor, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    });
    hitArea.on('pointerdown', callback);
    container.add(hitArea);

    return container;
  }

  /**
   * Show the dialog
   */
  show(packName: string): void {
    this.packName = packName;
    this.messageText.setText(`Switch to "${packName}"?\n\nNew campaigns will use this pack's settings.`);
    this.updateWarning();
    this.backdrop.setVisible(true);
    this.setVisible(true);
  }

  /**
   * Hide the dialog
   */
  hide(): void {
    this.backdrop.setVisible(false);
    this.setVisible(false);
  }

  /**
   * Confirm the switch
   */
  confirm(): void {
    this.hide();
    if (this.onConfirm) {
      this.onConfirm();
    }
  }

  /**
   * Cancel the switch
   */
  cancel(): void {
    this.hide();
    if (this.onCancel) {
      this.onCancel();
    }
  }

  /**
   * Set whether there's an active campaign
   */
  setHasActiveCampaign(hasActive: boolean): void {
    this.hasActiveCampaign = hasActive;
    this.updateWarning();
  }

  /**
   * Update warning text
   */
  private updateWarning(): void {
    if (this.hasActiveCampaign) {
      this.warningText.setText('Warning: Active campaigns will not be affected.');
    } else {
      this.warningText.setText('');
    }
  }

  /**
   * Check if dialog has warning
   */
  hasWarning(): boolean {
    return this.hasActiveCampaign;
  }

  /**
   * Get the pack name being switched to
   */
  getPackName(): string {
    return this.packName;
  }

  /**
   * Clean up
   */
  destroy(fromScene?: boolean): void {
    this.backdrop.destroy();
    super.destroy(fromScene);
  }
}
