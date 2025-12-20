/**
 * ConfirmationDialog - Generic Confirmation Dialog UI Component
 *
 * Reusable modal dialog for confirming destructive actions like delete,
 * overwrite, or discard changes.
 */

import Phaser from 'phaser';
import { COLORS as THEME_COLORS, TEXT_COLORS, FONTS, BUTTON } from '@config/UITheme';

const DIALOG_WIDTH = 400;
const DIALOG_HEIGHT = 180;

const COLORS = {
  OVERLAY: THEME_COLORS.OVERLAY,
  BACKGROUND: THEME_COLORS.PANEL_BG,
  BORDER: THEME_COLORS.BORDER_PRIMARY,
  TEXT: TEXT_COLORS.ACCENT,
  TEXT_SECONDARY: TEXT_COLORS.SECONDARY,
  BUTTON_CONFIRM: BUTTON.PRIMARY.bg,
  BUTTON_CONFIRM_HOVER: BUTTON.PRIMARY.bgHover,
  BUTTON_CANCEL: THEME_COLORS.PANEL_BG,
  BUTTON_CANCEL_HOVER: THEME_COLORS.BUTTON_SECONDARY_HOVER,
  BUTTON_DANGER: BUTTON.DANGER.bg,
  BUTTON_DANGER_HOVER: BUTTON.DANGER.bgHover,
  BUTTON_TEXT: TEXT_COLORS.ACCENT,
  BUTTON_TEXT_DANGER: TEXT_COLORS.DANGER,
};

export interface ConfirmationDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

/**
 * ConfirmationDialog - Modal confirmation dialog
 */
export class ConfirmationDialog extends Phaser.GameObjects.Container {
  private overlay!: Phaser.GameObjects.Rectangle;
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private confirmButton!: Phaser.GameObjects.Rectangle;
  private confirmButtonText!: Phaser.GameObjects.Text;
  private cancelButton!: Phaser.GameObjects.Rectangle;
  private cancelButtonText!: Phaser.GameObjects.Text;

  private options: ConfirmationDialogOptions = {
    title: 'Confirm',
    message: 'Are you sure?',
  };

  /**
   * Callback fired when confirmed
   */
  public onConfirm?: () => void;

  /**
   * Callback fired when cancelled
   */
  public onCancel?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    const { width, height } = scene.scale;
    this.setPosition(0, 0);
    this.setVisible(false);
    this.setDepth(2000); // Above other panels
    this.setScrollFactor(0); // Fixed to camera

    this.createOverlay(width, height);
    this.createBackground(width, height);
    this.createTitle(width);
    this.createMessage(width);
    this.createButtons(width, height);

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  /**
   * Show the dialog with specific options
   */
  public show(options: ConfirmationDialogOptions): void {
    this.options = { ...this.options, ...options };
    this.updateContent();
    this.setVisible(true);
  }

  /**
   * Hide the dialog
   */
  public hide(): void {
    this.setVisible(false);
  }

  /**
   * Show a delete confirmation dialog
   */
  public showDeleteConfirmation(itemName: string, onConfirm: () => void): void {
    this.onConfirm = onConfirm;
    this.onCancel = undefined;
    this.show({
      title: 'Delete Save',
      message: `Are you sure you want to delete "${itemName}"?\nThis cannot be undone.`,
      confirmText: 'DELETE',
      cancelText: 'CANCEL',
      isDangerous: true,
    });
  }

  /**
   * Show an overwrite confirmation dialog
   */
  public showOverwriteConfirmation(slotName: string, onConfirm: () => void): void {
    this.onConfirm = onConfirm;
    this.onCancel = undefined;
    this.show({
      title: 'Overwrite Save',
      message: `This will overwrite the existing save in ${slotName}.\nDo you want to continue?`,
      confirmText: 'OVERWRITE',
      cancelText: 'CANCEL',
      isDangerous: true,
    });
  }

  /**
   * Show an unsaved changes warning
   */
  public showUnsavedChangesWarning(onConfirm: () => void, onCancel?: () => void): void {
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;
    this.show({
      title: 'Unsaved Changes',
      message: 'You have unsaved progress. Loading a different save\nwill lose your current game. Continue?',
      confirmText: 'CONTINUE',
      cancelText: 'CANCEL',
      isDangerous: true,
    });
  }

  // ============================================
  // UI Creation
  // ============================================

  private createOverlay(width: number, height: number): void {
    this.overlay = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      COLORS.OVERLAY,
      0.7,
    );
    this.overlay.setInteractive(); // Block clicks to elements behind
    this.add(this.overlay);
  }

  private createBackground(width: number, height: number): void {
    const x = (width - DIALOG_WIDTH) / 2;
    const y = (height - DIALOG_HEIGHT) / 2;

    this.background = this.scene.add.graphics();
    this.background.fillStyle(COLORS.BACKGROUND, 1);
    this.background.fillRoundedRect(x, y, DIALOG_WIDTH, DIALOG_HEIGHT, 8);
    this.background.lineStyle(2, COLORS.BORDER);
    this.background.strokeRoundedRect(x, y, DIALOG_WIDTH, DIALOG_HEIGHT, 8);
    this.add(this.background);
  }

  private createTitle(width: number): void {
    this.titleText = this.scene.add.text(width / 2, this.getDialogY() + 30, '', {
      fontSize: '22px',
      color: COLORS.TEXT,
      fontFamily: FONTS.PRIMARY,
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createMessage(width: number): void {
    this.messageText = this.scene.add.text(width / 2, this.getDialogY() + 75, '', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: FONTS.PRIMARY,
      align: 'center',
      wordWrap: { width: DIALOG_WIDTH - 40 },
    });
    this.messageText.setOrigin(0.5, 0.5);
    this.add(this.messageText);
  }

  private createButtons(width: number, _height: number): void {
    const dialogY = this.getDialogY();
    const buttonWidth = 120;
    const buttonHeight = 36;
    const buttonY = dialogY + DIALOG_HEIGHT - 45;
    const buttonGap = 20;

    // Cancel button (left)
    const cancelX = width / 2 - buttonWidth / 2 - buttonGap / 2;
    this.cancelButton = this.scene.add.rectangle(
      cancelX,
      buttonY,
      buttonWidth,
      buttonHeight,
      COLORS.BUTTON_CANCEL,
    );
    this.cancelButton.setStrokeStyle(1, COLORS.BORDER);
    this.cancelButton.setInteractive({ useHandCursor: true });

    this.cancelButton.on('pointerover', () => {
      this.cancelButton.setFillStyle(COLORS.BUTTON_CANCEL_HOVER);
    });

    this.cancelButton.on('pointerout', () => {
      this.cancelButton.setFillStyle(COLORS.BUTTON_CANCEL);
    });

    this.cancelButton.on('pointerdown', () => {
      this.hide();
      this.onCancel?.();
    });

    this.add(this.cancelButton);

    this.cancelButtonText = this.scene.add.text(cancelX, buttonY, 'CANCEL', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: FONTS.PRIMARY,
      fontStyle: 'bold',
    });
    this.cancelButtonText.setOrigin(0.5, 0.5);
    this.add(this.cancelButtonText);

    // Confirm button (right)
    const confirmX = width / 2 + buttonWidth / 2 + buttonGap / 2;
    this.confirmButton = this.scene.add.rectangle(
      confirmX,
      buttonY,
      buttonWidth,
      buttonHeight,
      COLORS.BUTTON_CONFIRM,
    );
    this.confirmButton.setStrokeStyle(1, COLORS.BORDER);
    this.confirmButton.setInteractive({ useHandCursor: true });

    this.confirmButton.on('pointerover', () => {
      const hoverColor = this.options.isDangerous
        ? COLORS.BUTTON_DANGER_HOVER
        : COLORS.BUTTON_CONFIRM_HOVER;
      this.confirmButton.setFillStyle(hoverColor);
    });

    this.confirmButton.on('pointerout', () => {
      const baseColor = this.options.isDangerous
        ? COLORS.BUTTON_DANGER
        : COLORS.BUTTON_CONFIRM;
      this.confirmButton.setFillStyle(baseColor);
    });

    this.confirmButton.on('pointerdown', () => {
      this.hide();
      this.onConfirm?.();
    });

    this.add(this.confirmButton);

    this.confirmButtonText = this.scene.add.text(confirmX, buttonY, 'CONFIRM', {
      fontSize: '14px',
      color: COLORS.BUTTON_TEXT,
      fontFamily: FONTS.PRIMARY,
      fontStyle: 'bold',
    });
    this.confirmButtonText.setOrigin(0.5, 0.5);
    this.add(this.confirmButtonText);
  }

  // ============================================
  // Content Update
  // ============================================

  private updateContent(): void {
    this.titleText.setText(this.options.title);
    this.messageText.setText(this.options.message);
    this.confirmButtonText.setText(this.options.confirmText || 'CONFIRM');
    this.cancelButtonText.setText(this.options.cancelText || 'CANCEL');

    // Update confirm button style based on danger level
    if (this.options.isDangerous) {
      this.confirmButton.setFillStyle(COLORS.BUTTON_DANGER);
      this.confirmButton.setStrokeStyle(1, 0xff4444);
      this.confirmButtonText.setColor(COLORS.BUTTON_TEXT_DANGER);
    } else {
      this.confirmButton.setFillStyle(COLORS.BUTTON_CONFIRM);
      this.confirmButton.setStrokeStyle(1, COLORS.BORDER);
      this.confirmButtonText.setColor(COLORS.BUTTON_TEXT);
    }
  }

  private getDialogY(): number {
    return (this.scene.scale.height - DIALOG_HEIGHT) / 2;
  }

  /**
   * Clean up resources
   */
  public destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
