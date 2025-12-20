/**
 * LoadGamePanel - Save Slot Browser UI Component
 *
 * Displays available saves (cloud and local) and allows loading/deleting.
 */

import Phaser from 'phaser';
import { getSaveService, CloudSaveMetadata } from '@services/SaveService';
import { ConfirmationDialog } from './ConfirmationDialog';
import { COLORS as THEME_COLORS, TEXT_COLORS, BUTTON } from '@config/UITheme';

const PANEL_WIDTH = 600;
const PANEL_HEIGHT = 500;
const SLOT_HEIGHT = 80;
const SLOT_MARGIN = 10;

const COLORS = {
  BACKGROUND: THEME_COLORS.PANEL_BG,
  BORDER: THEME_COLORS.PRIMARY,
  SLOT_BG: THEME_COLORS.PANEL_BG_DARK,
  SLOT_HOVER: THEME_COLORS.BUTTON_SECONDARY_HOVER,
  SLOT_SELECTED: THEME_COLORS.BUTTON_PRIMARY,
  TEXT: TEXT_COLORS.ACCENT,
  TEXT_SECONDARY: TEXT_COLORS.SECONDARY,
  TEXT_DIM: TEXT_COLORS.MUTED,
  BUTTON_BG: BUTTON.PRIMARY.bg,
  BUTTON_HOVER: BUTTON.PRIMARY.bgHover,
  BUTTON_DANGER: BUTTON.DANGER.bg,
  BUTTON_DANGER_HOVER: BUTTON.DANGER.bgHover,
  CLOUD_BADGE: THEME_COLORS.BUTTON_PRIMARY,
  LOCAL_BADGE: 0x333300,
};

/**
 * LoadGamePanel - Container-based save slot browser
 */
export class LoadGamePanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private loadingText!: Phaser.GameObjects.Text;
  private noSavesText!: Phaser.GameObjects.Text;
  private closeButton!: Phaser.GameObjects.Rectangle;
  private closeButtonText!: Phaser.GameObjects.Text;

  private saveSlots: SaveSlotItem[] = [];
  private selectedSlot: CloudSaveMetadata | null = null;
  private confirmationDialog!: ConfirmationDialog;

  /**
   * Callback fired when a save is selected for loading
   */
  public onLoadSelected?: (slotName: string) => void;

  /**
   * Callback fired when a save is selected for deletion
   */
  public onDeleteSelected?: (slotName: string) => void;

  /**
   * Callback fired when panel is closed
   */
  public onClose?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.setVisible(false);
    this.setDepth(1100);

    this.createBackground();
    this.createTitle();
    this.createCloseButton();
    this.createLoadingText();
    this.createNoSavesText();
    this.createConfirmationDialog();

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  private createConfirmationDialog(): void {
    this.confirmationDialog = new ConfirmationDialog(this.scene);
  }

  /**
   * Show delete confirmation before removing a save
   */
  private showDeleteConfirmation(save: CloudSaveMetadata): void {
    const displayName = save.saveName || save.slotName;
    this.confirmationDialog.showDeleteConfirmation(displayName, () => {
      this.onDeleteSelected?.(save.slotName);
    });
  }

  /**
   * Show the panel and load saves
   */
  public async show(): Promise<void> {
    this.setVisible(true);
    this.selectedSlot = null;
    await this.refreshSaveList();
  }

  /**
   * Hide the panel
   */
  public hide(): void {
    this.setVisible(false);
    this.clearSlots();
  }

  /**
   * Refresh the list of saves
   */
  public async refreshSaveList(): Promise<void> {
    this.clearSlots();
    this.loadingText.setVisible(true);
    this.noSavesText.setVisible(false);

    try {
      const saveService = getSaveService();
      const saves = await saveService.listSaves();

      this.loadingText.setVisible(false);

      if (saves.length === 0) {
        this.noSavesText.setVisible(true);
        return;
      }

      this.createSaveSlots(saves);
    } catch (error) {
      console.error('Failed to load saves:', error);
      this.loadingText.setText('Error loading saves');
    }
  }

  // ============================================
  // UI Creation
  // ============================================

  private createBackground(): void {
    this.background = this.scene.add.graphics();
    this.background.fillStyle(COLORS.BACKGROUND, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.background.lineStyle(2, COLORS.BORDER);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);
  }

  private createTitle(): void {
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 30, 'LOAD CAMPAIGN', {
      fontSize: '28px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createCloseButton(): void {
    this.closeButton = this.scene.add.rectangle(PANEL_WIDTH - 30, 30, 40, 40, COLORS.BUTTON_BG);
    this.closeButton.setStrokeStyle(2, COLORS.BORDER);
    this.closeButton.setInteractive({ useHandCursor: true });

    this.closeButton.on('pointerover', () => {
      this.closeButton.setFillStyle(COLORS.BUTTON_HOVER);
    });
    this.closeButton.on('pointerout', () => {
      this.closeButton.setFillStyle(COLORS.BUTTON_BG);
    });
    this.closeButton.on('pointerdown', () => {
      this.hide();
      this.onClose?.();
    });

    this.add(this.closeButton);

    this.closeButtonText = this.scene.add.text(PANEL_WIDTH - 30, 30, 'X', {
      fontSize: '20px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.closeButtonText.setOrigin(0.5, 0.5);
    this.add(this.closeButtonText);
  }

  private createLoadingText(): void {
    this.loadingText = this.scene.add.text(PANEL_WIDTH / 2, PANEL_HEIGHT / 2, 'Loading saves...', {
      fontSize: '18px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.loadingText.setOrigin(0.5, 0.5);
    this.loadingText.setVisible(false);
    this.add(this.loadingText);
  }

  private createNoSavesText(): void {
    this.noSavesText = this.scene.add.text(PANEL_WIDTH / 2, PANEL_HEIGHT / 2, 'No saved games found', {
      fontSize: '18px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.noSavesText.setOrigin(0.5, 0.5);
    this.noSavesText.setVisible(false);
    this.add(this.noSavesText);
  }

  // ============================================
  // Save Slot Management
  // ============================================

  private createSaveSlots(saves: CloudSaveMetadata[]): void {
    const startY = 70;
    const slotWidth = PANEL_WIDTH - 40;

    saves.forEach((save, index) => {
      const y = startY + index * (SLOT_HEIGHT + SLOT_MARGIN);
      const slot = this.createSaveSlotItem(save, 20, y, slotWidth);
      this.saveSlots.push(slot);
    });
  }

  private createSaveSlotItem(
    save: CloudSaveMetadata,
    x: number,
    y: number,
    width: number,
  ): SaveSlotItem {
    // Container for this slot
    const container = this.scene.add.container(x, y);

    // Background
    const background = this.scene.add.rectangle(
      width / 2,
      SLOT_HEIGHT / 2,
      width,
      SLOT_HEIGHT,
      COLORS.SLOT_BG,
    );
    background.setStrokeStyle(1, COLORS.BORDER);
    background.setInteractive({ useHandCursor: true });

    background.on('pointerover', () => {
      if (this.selectedSlot !== save) {
        background.setFillStyle(COLORS.SLOT_HOVER);
      }
    });

    background.on('pointerout', () => {
      if (this.selectedSlot !== save) {
        background.setFillStyle(COLORS.SLOT_BG);
      }
    });

    background.on('pointerdown', () => {
      this.selectSlot(save, background);
    });

    container.add(background);

    // Save name / slot name
    const displayName = save.saveName || save.slotName;
    const nameText = this.scene.add.text(15, 12, displayName, {
      fontSize: '18px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    container.add(nameText);

    // Source badge (CLOUD / LOCAL)
    const badgeX = width - 80;
    const badgeColor = save.source === 'cloud' ? COLORS.CLOUD_BADGE : COLORS.LOCAL_BADGE;
    const badge = this.scene.add.rectangle(badgeX, 20, 70, 22, badgeColor);
    badge.setStrokeStyle(1, COLORS.BORDER);
    container.add(badge);

    const badgeText = this.scene.add.text(badgeX, 20, save.source.toUpperCase(), {
      fontSize: '11px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
    });
    badgeText.setOrigin(0.5, 0.5);
    container.add(badgeText);

    // Details line
    const details = `Turn ${save.turnNumber} | ${this.formatPlaytime(save.playtime)} | ${this.formatDate(save.updatedAt)}`;
    const detailsText = this.scene.add.text(15, 42, details, {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    container.add(detailsText);

    // Victory status
    if (save.victoryStatus !== 'None') {
      const statusColor = save.victoryStatus === 'Victory' ? '#00bfff' : '#ff4444';
      const statusText = this.scene.add.text(15, 60, save.victoryStatus, {
        fontSize: '12px',
        color: statusColor,
        fontFamily: 'monospace',
      });
      container.add(statusText);
    }

    // Load button
    const loadButton = this.scene.add.rectangle(width - 150, SLOT_HEIGHT / 2, 60, 30, COLORS.BUTTON_BG);
    loadButton.setStrokeStyle(1, COLORS.BORDER);
    loadButton.setInteractive({ useHandCursor: true });

    loadButton.on('pointerover', () => loadButton.setFillStyle(COLORS.BUTTON_HOVER));
    loadButton.on('pointerout', () => loadButton.setFillStyle(COLORS.BUTTON_BG));
    loadButton.on('pointerdown', () => {
      this.onLoadSelected?.(save.slotName);
    });

    container.add(loadButton);

    const loadText = this.scene.add.text(width - 150, SLOT_HEIGHT / 2, 'LOAD', {
      fontSize: '12px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
    });
    loadText.setOrigin(0.5, 0.5);
    container.add(loadText);

    // Delete button
    const deleteButton = this.scene.add.rectangle(
      width - 80,
      SLOT_HEIGHT / 2,
      60,
      30,
      COLORS.BUTTON_DANGER,
    );
    deleteButton.setStrokeStyle(1, 0xff4444);
    deleteButton.setInteractive({ useHandCursor: true });

    deleteButton.on('pointerover', () => deleteButton.setFillStyle(COLORS.BUTTON_DANGER_HOVER));
    deleteButton.on('pointerout', () => deleteButton.setFillStyle(COLORS.BUTTON_DANGER));
    deleteButton.on('pointerdown', () => {
      this.showDeleteConfirmation(save);
    });

    container.add(deleteButton);

    const deleteText = this.scene.add.text(width - 80, SLOT_HEIGHT / 2, 'DEL', {
      fontSize: '12px',
      color: '#ff4444',
      fontFamily: 'monospace',
    });
    deleteText.setOrigin(0.5, 0.5);
    container.add(deleteText);

    this.add(container);

    return {
      container,
      background,
      save,
    };
  }

  private selectSlot(save: CloudSaveMetadata, background: Phaser.GameObjects.Rectangle): void {
    // Deselect previous
    if (this.selectedSlot) {
      const prevSlot = this.saveSlots.find((s) => s.save === this.selectedSlot);
      if (prevSlot) {
        prevSlot.background.setFillStyle(COLORS.SLOT_BG);
      }
    }

    // Select new
    this.selectedSlot = save;
    background.setFillStyle(COLORS.SLOT_SELECTED);
  }

  private clearSlots(): void {
    this.saveSlots.forEach((slot) => {
      slot.container.destroy();
    });
    this.saveSlots = [];
  }

  // ============================================
  // Formatting Helpers
  // ============================================

  private formatPlaytime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private formatDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  }

  /**
   * Clean up resources
   */
  public destroy(fromScene?: boolean): void {
    this.clearSlots();
    this.confirmationDialog?.destroy();
    super.destroy(fromScene);
  }
}

interface SaveSlotItem {
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Rectangle;
  save: CloudSaveMetadata;
}
