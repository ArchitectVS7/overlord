/**
 * SaveGamePanel - Save Slot Selection UI Component
 *
 * Allows players to save their game to named slots.
 * Supports cloud and local storage with slot selection.
 */

import Phaser from 'phaser';
import { getSaveService, CloudSaveMetadata } from '@services/SaveService';
import { getAuthService } from '@services/AuthService';

const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 450;
const SLOT_HEIGHT = 60;
const SLOT_MARGIN = 8;

const COLORS = {
  BACKGROUND: 0x1a1a2e,
  BORDER: 0x00bfff,
  SLOT_BG: 0x0a0a1a,
  SLOT_HOVER: 0x1a2a3a,
  SLOT_SELECTED: 0x0a2a4a,
  SLOT_EMPTY: 0x0a0a15,
  TEXT: '#00bfff',
  TEXT_SECONDARY: '#888888',
  TEXT_DIM: '#555555',
  INPUT_BG: '#0a0a1a',
  INPUT_BORDER: '#4a4a6a',
  INPUT_BORDER_FOCUS: '#00bfff',
  BUTTON_BG: 0x002244,
  BUTTON_HOVER: 0x003366,
  BUTTON_TEXT: '#00bfff',
  ERROR: '#ff4444',
  SUCCESS: '#00bfff',
  CLOUD_BADGE: 0x003366,
  LOCAL_BADGE: 0x333300,
};

const MAX_SLOTS = 5;

/**
 * SaveGamePanel - Container-based save game UI
 */
export class SaveGamePanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private closeButton!: Phaser.GameObjects.Rectangle;
  private closeButtonText!: Phaser.GameObjects.Text;
  private loadingText!: Phaser.GameObjects.Text;
  private saveNameLabel!: Phaser.GameObjects.Text;
  private saveButton!: Phaser.GameObjects.Rectangle;
  private saveButtonText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private storageNote!: Phaser.GameObjects.Text;

  // DOM input elements
  private saveNameInput!: HTMLInputElement;
  private inputContainer!: HTMLDivElement;

  private saveSlots: SaveSlotUI[] = [];
  private existingSaves: CloudSaveMetadata[] = [];
  private selectedSlotIndex = 0;
  private isSaving = false;

  /**
   * Callback fired when save is requested
   */
  public onSaveRequested?: (slotName: string, saveName: string) => void;

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
    this.createSaveNameInput();
    this.createSaveButton();
    this.createStatusText();
    this.createStorageNote();

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  /**
   * Show the panel and load existing saves
   */
  public async show(): Promise<void> {
    this.setVisible(true);
    this.clearStatus();
    this.isSaving = false;
    this.createDOMInputs();
    await this.refreshSaveSlots();
  }

  /**
   * Hide the panel
   */
  public hide(): void {
    this.setVisible(false);
    this.removeDOMInputs();
    this.clearSlots();
  }

  /**
   * Show saving in progress
   */
  public setLoading(loading: boolean): void {
    this.isSaving = loading;
    this.saveButtonText.setText(loading ? 'SAVING...' : 'SAVE GAME');
    if (this.saveNameInput) {
      this.saveNameInput.disabled = loading;
    }
  }

  /**
   * Show success message
   */
  public showSuccess(message: string): void {
    this.statusText.setText(message);
    this.statusText.setColor(COLORS.SUCCESS);
    this.statusText.setVisible(true);
  }

  /**
   * Show error message
   */
  public showError(message: string): void {
    this.statusText.setText(message);
    this.statusText.setColor(COLORS.ERROR);
    this.statusText.setVisible(true);
  }

  /**
   * Clear status message
   */
  public clearStatus(): void {
    this.statusText.setText('');
    this.statusText.setVisible(false);
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
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 25, 'SAVE CAMPAIGN', {
      fontSize: '24px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createCloseButton(): void {
    this.closeButton = this.scene.add.rectangle(PANEL_WIDTH - 25, 25, 36, 36, COLORS.BUTTON_BG);
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

    this.closeButtonText = this.scene.add.text(PANEL_WIDTH - 25, 25, 'X', {
      fontSize: '18px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.closeButtonText.setOrigin(0.5, 0.5);
    this.add(this.closeButtonText);
  }

  private createLoadingText(): void {
    this.loadingText = this.scene.add.text(PANEL_WIDTH / 2, 200, 'Loading...', {
      fontSize: '16px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.loadingText.setOrigin(0.5, 0.5);
    this.loadingText.setVisible(false);
    this.add(this.loadingText);
  }

  private createSaveNameInput(): void {
    this.saveNameLabel = this.scene.add.text(20, 330, 'SAVE NAME', {
      fontSize: '12px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.saveNameLabel);
  }

  private createSaveButton(): void {
    const buttonWidth = PANEL_WIDTH - 40;
    const buttonHeight = 40;
    const buttonY = 400;

    this.saveButton = this.scene.add.rectangle(
      PANEL_WIDTH / 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      COLORS.BUTTON_BG,
    );
    this.saveButton.setStrokeStyle(2, COLORS.BORDER);
    this.saveButton.setInteractive({ useHandCursor: true });

    this.saveButton.on('pointerover', () => {
      if (!this.isSaving) {
        this.saveButton.setFillStyle(COLORS.BUTTON_HOVER);
      }
    });

    this.saveButton.on('pointerout', () => {
      this.saveButton.setFillStyle(COLORS.BUTTON_BG);
    });

    this.saveButton.on('pointerdown', () => {
      if (!this.isSaving) {
        this.handleSave();
      }
    });

    this.add(this.saveButton);

    this.saveButtonText = this.scene.add.text(PANEL_WIDTH / 2, buttonY, 'SAVE GAME', {
      fontSize: '16px',
      color: COLORS.BUTTON_TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.saveButtonText.setOrigin(0.5, 0.5);
    this.add(this.saveButtonText);
  }

  private createStatusText(): void {
    this.statusText = this.scene.add.text(PANEL_WIDTH / 2, 430, '', {
      fontSize: '12px',
      color: COLORS.SUCCESS,
      fontFamily: 'monospace',
    });
    this.statusText.setOrigin(0.5, 0.5);
    this.statusText.setVisible(false);
    this.add(this.statusText);
  }

  private createStorageNote(): void {
    const authService = getAuthService();
    const isGuest = authService.isGuest();
    const noteText = isGuest
      ? 'Guest mode: Saves stored locally only'
      : 'Saves will sync to cloud';

    this.storageNote = this.scene.add.text(PANEL_WIDTH / 2, 52, noteText, {
      fontSize: '11px',
      color: isGuest ? '#ffaa00' : COLORS.TEXT_DIM,
      fontFamily: 'monospace',
    });
    this.storageNote.setOrigin(0.5, 0.5);
    this.add(this.storageNote);
  }

  // ============================================
  // DOM Input Management
  // ============================================

  private createDOMInputs(): void {
    this.removeDOMInputs();

    const canvas = this.scene.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const panelX = this.x + canvasRect.left;
    const panelY = this.y + canvasRect.top;

    this.inputContainer = document.createElement('div');
    this.inputContainer.style.position = 'absolute';
    this.inputContainer.style.left = `${panelX}px`;
    this.inputContainer.style.top = `${panelY}px`;
    this.inputContainer.style.width = `${PANEL_WIDTH}px`;
    this.inputContainer.style.height = `${PANEL_HEIGHT}px`;
    this.inputContainer.style.pointerEvents = 'none';
    this.inputContainer.style.zIndex = '1000';

    this.saveNameInput = document.createElement('input');
    this.saveNameInput.placeholder = 'Enter save name (optional)';
    this.saveNameInput.style.cssText = `
      position: absolute;
      left: 20px;
      top: 348px;
      width: ${PANEL_WIDTH - 40}px;
      height: 32px;
      padding: 6px 12px;
      font-size: 14px;
      font-family: monospace;
      color: ${COLORS.TEXT};
      background-color: ${COLORS.INPUT_BG};
      border: 1px solid ${COLORS.INPUT_BORDER};
      border-radius: 4px;
      outline: none;
      pointer-events: auto;
      box-sizing: border-box;
    `;

    this.saveNameInput.addEventListener('focus', () => {
      this.saveNameInput.style.borderColor = COLORS.INPUT_BORDER_FOCUS;
    });

    this.saveNameInput.addEventListener('blur', () => {
      this.saveNameInput.style.borderColor = COLORS.INPUT_BORDER;
    });

    this.saveNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.isSaving) {
        this.handleSave();
      }
    });

    this.inputContainer.appendChild(this.saveNameInput);
    document.body.appendChild(this.inputContainer);
  }

  private removeDOMInputs(): void {
    if (this.inputContainer && this.inputContainer.parentNode) {
      this.inputContainer.parentNode.removeChild(this.inputContainer);
    }
  }

  // ============================================
  // Save Slot Management
  // ============================================

  private async refreshSaveSlots(): Promise<void> {
    this.clearSlots();
    this.loadingText.setVisible(true);

    try {
      const saveService = getSaveService();
      this.existingSaves = await saveService.listSaves();
      this.loadingText.setVisible(false);
      this.createSlotButtons();
    } catch (error) {
      console.error('Failed to load saves:', error);
      this.loadingText.setText('Error loading saves');
    }
  }

  private createSlotButtons(): void {
    const startY = 70;
    const slotWidth = PANEL_WIDTH - 40;

    for (let i = 0; i < MAX_SLOTS; i++) {
      const y = startY + i * (SLOT_HEIGHT + SLOT_MARGIN);
      const slotName = `slot${i + 1}`;
      const existingSave = this.existingSaves.find((s) => s.slotName === slotName);

      const slot = this.createSlotButton(i, slotName, existingSave, 20, y, slotWidth);
      this.saveSlots.push(slot);
    }

    // Select first slot by default
    this.selectSlot(0);
  }

  private createSlotButton(
    index: number,
    slotName: string,
    existingSave: CloudSaveMetadata | undefined,
    x: number,
    y: number,
    width: number,
  ): SaveSlotUI {
    const container = this.scene.add.container(x, y);
    const isEmpty = !existingSave;

    // Background
    const background = this.scene.add.rectangle(
      width / 2,
      SLOT_HEIGHT / 2,
      width,
      SLOT_HEIGHT,
      isEmpty ? COLORS.SLOT_EMPTY : COLORS.SLOT_BG,
    );
    background.setStrokeStyle(1, COLORS.BORDER);
    background.setInteractive({ useHandCursor: true });

    background.on('pointerover', () => {
      if (this.selectedSlotIndex !== index) {
        background.setFillStyle(COLORS.SLOT_HOVER);
      }
    });

    background.on('pointerout', () => {
      if (this.selectedSlotIndex !== index) {
        background.setFillStyle(isEmpty ? COLORS.SLOT_EMPTY : COLORS.SLOT_BG);
      }
    });

    background.on('pointerdown', () => {
      this.selectSlot(index);
    });

    container.add(background);

    // Slot number
    const slotLabel = this.scene.add.text(15, 10, `SLOT ${index + 1}`, {
      fontSize: '14px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    container.add(slotLabel);

    if (existingSave) {
      // Show existing save info
      const saveName = existingSave.saveName || 'Unnamed Save';
      const nameText = this.scene.add.text(15, 32, saveName, {
        fontSize: '12px',
        color: COLORS.TEXT_SECONDARY,
        fontFamily: 'monospace',
      });
      container.add(nameText);

      // Details
      const details = `Turn ${existingSave.turnNumber} | ${this.formatDate(existingSave.updatedAt)}`;
      const detailsText = this.scene.add.text(width - 15, 32, details, {
        fontSize: '11px',
        color: COLORS.TEXT_DIM,
        fontFamily: 'monospace',
      });
      detailsText.setOrigin(1, 0);
      container.add(detailsText);

      // Overwrite warning
      const overwriteText = this.scene.add.text(width - 15, 10, '(OVERWRITE)', {
        fontSize: '11px',
        color: '#ffaa00',
        fontFamily: 'monospace',
      });
      overwriteText.setOrigin(1, 0);
      container.add(overwriteText);
    } else {
      // Empty slot
      const emptyText = this.scene.add.text(15, 32, 'Empty slot', {
        fontSize: '12px',
        color: COLORS.TEXT_DIM,
        fontFamily: 'monospace',
      });
      container.add(emptyText);
    }

    this.add(container);

    return {
      container,
      background,
      slotName,
      existingSave,
      isEmpty,
    };
  }

  private selectSlot(index: number): void {
    // Deselect previous
    if (this.selectedSlotIndex < this.saveSlots.length) {
      const prevSlot = this.saveSlots[this.selectedSlotIndex];
      prevSlot.background.setFillStyle(
        prevSlot.isEmpty ? COLORS.SLOT_EMPTY : COLORS.SLOT_BG,
      );
    }

    // Select new
    this.selectedSlotIndex = index;
    const slot = this.saveSlots[index];
    slot.background.setFillStyle(COLORS.SLOT_SELECTED);

    // Pre-fill save name if overwriting
    if (slot.existingSave?.saveName && this.saveNameInput) {
      this.saveNameInput.value = slot.existingSave.saveName;
    }
  }

  private clearSlots(): void {
    this.saveSlots.forEach((slot) => {
      slot.container.destroy();
    });
    this.saveSlots = [];
    this.existingSaves = [];
  }

  // ============================================
  // Save Handler
  // ============================================

  private handleSave(): void {
    if (this.selectedSlotIndex >= this.saveSlots.length) {
      return;
    }

    const slot = this.saveSlots[this.selectedSlotIndex];
    const saveName = this.saveNameInput?.value?.trim() || `Save ${this.selectedSlotIndex + 1}`;

    this.clearStatus();
    this.onSaveRequested?.(slot.slotName, saveName);
  }

  // ============================================
  // Formatting Helpers
  // ============================================

  private formatDate(isoDate: string): string {
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown';
    }
  }

  /**
   * Update input positions when panel moves
   */
  public updateInputPositions(): void {
    if (!this.inputContainer || !this.visible) {
      return;
    }

    const canvas = this.scene.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const panelX = this.x + canvasRect.left;
    const panelY = this.y + canvasRect.top;

    this.inputContainer.style.left = `${panelX}px`;
    this.inputContainer.style.top = `${panelY}px`;
  }

  /**
   * Clean up resources
   */
  public destroy(fromScene?: boolean): void {
    this.removeDOMInputs();
    this.clearSlots();
    super.destroy(fromScene);
  }
}

interface SaveSlotUI {
  container: Phaser.GameObjects.Container;
  background: Phaser.GameObjects.Rectangle;
  slotName: string;
  existingSave: CloudSaveMetadata | undefined;
  isEmpty: boolean;
}
