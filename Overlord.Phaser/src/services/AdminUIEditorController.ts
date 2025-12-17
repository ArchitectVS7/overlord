/**
 * AdminUIEditorController - UI Panel Drag & Position Management
 *
 * Manages drag handlers and position overlay during admin edit mode.
 * Tracks position changes in memory until explicit save.
 */

import { PanelPosition } from './UIPanelPositionService';

/**
 * Data structure for a draggable panel
 */
export interface DraggablePanel {
  container: Phaser.GameObjects.Container;
  panelId: string;
  sceneName: string;
  originalX: number;
  originalY: number;
  width: number;
  height: number;
}

/**
 * AdminUIEditorController class
 * Manages drag handlers and position overlay for admin UI editing
 */
export class AdminUIEditorController {
  private scene: Phaser.Scene;
  private sceneName: string;
  private registeredPanels: Map<string, DraggablePanel> = new Map();
  private pendingChanges: Map<string, PanelPosition> = new Map();
  private positionOverlay: Phaser.GameObjects.Text | null = null;
  private editModeActive: boolean = false;
  private dragBorders: Map<string, Phaser.GameObjects.Graphics> = new Map();

  constructor(scene: Phaser.Scene, sceneName: string) {
    this.scene = scene;
    this.sceneName = sceneName;
  }

  /**
   * Register a panel for admin editing
   */
  public registerPanel(
    container: Phaser.GameObjects.Container,
    panelId: string,
    defaultX: number,
    defaultY: number,
    width: number = 200,
    height: number = 100
  ): void {
    const panel: DraggablePanel = {
      container,
      panelId,
      sceneName: this.sceneName,
      originalX: defaultX,
      originalY: defaultY,
      width,
      height,
    };

    this.registeredPanels.set(panelId, panel);

    // If edit mode is already active, enable dragging for this panel
    if (this.editModeActive) {
      this.enablePanelDragging(panel);
    }
  }

  /**
   * Unregister a panel
   */
  public unregisterPanel(panelId: string): void {
    const panel = this.registeredPanels.get(panelId);
    if (panel) {
      this.disablePanelDragging(panel);
      this.registeredPanels.delete(panelId);
    }
    this.pendingChanges.delete(panelId);
    this.removeDragBorder(panelId);
  }

  /**
   * Enable edit mode - make all registered panels draggable
   */
  public enableEditMode(): void {
    if (this.editModeActive) {
      return;
    }

    this.editModeActive = true;

    // Create position overlay
    this.createPositionOverlay();

    // Enable dragging for all registered panels
    for (const panel of this.registeredPanels.values()) {
      this.enablePanelDragging(panel);
    }

    console.log(`Edit mode enabled for ${this.sceneName} with ${this.registeredPanels.size} panels`);
  }

  /**
   * Disable edit mode - remove drag handlers
   */
  public disableEditMode(): void {
    if (!this.editModeActive) {
      return;
    }

    this.editModeActive = false;

    // Destroy position overlay
    this.destroyPositionOverlay();

    // Disable dragging for all registered panels
    for (const panel of this.registeredPanels.values()) {
      this.disablePanelDragging(panel);
    }

    // Clear drag borders
    for (const border of this.dragBorders.values()) {
      border.destroy();
    }
    this.dragBorders.clear();

    console.log(`Edit mode disabled for ${this.sceneName}`);
  }

  /**
   * Enable dragging for a single panel
   */
  private enablePanelDragging(panel: DraggablePanel): void {
    const container = panel.container;

    // Make the container interactive and draggable
    container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, panel.width, panel.height),
      Phaser.Geom.Rectangle.Contains
    );
    this.scene.input.setDraggable(container, true);

    // Add drag border
    this.addDragBorder(panel);

    // Set up drag events
    container.on('dragstart', this.onDragStart.bind(this, panel));
    container.on('drag', this.onDrag.bind(this, panel));
    container.on('dragend', this.onDragEnd.bind(this, panel));
  }

  /**
   * Disable dragging for a single panel
   */
  private disablePanelDragging(panel: DraggablePanel): void {
    const container = panel.container;

    // Remove drag events
    container.off('dragstart');
    container.off('drag');
    container.off('dragend');

    // Disable dragging
    this.scene.input.setDraggable(container, false);

    // Remove drag border
    this.removeDragBorder(panel.panelId);
  }

  /**
   * Add visual border to indicate draggable panel
   */
  private addDragBorder(panel: DraggablePanel): void {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0x00ff00, 0.8);
    graphics.strokeRect(
      panel.container.x,
      panel.container.y,
      panel.width,
      panel.height
    );
    graphics.setDepth(9999);
    graphics.setScrollFactor(0);

    this.dragBorders.set(panel.panelId, graphics);
  }

  /**
   * Update drag border position
   */
  private updateDragBorder(panel: DraggablePanel): void {
    const graphics = this.dragBorders.get(panel.panelId);
    if (graphics) {
      graphics.clear();
      graphics.lineStyle(2, 0x00ff00, 0.8);
      graphics.strokeRect(
        panel.container.x,
        panel.container.y,
        panel.width,
        panel.height
      );
    }
  }

  /**
   * Remove drag border
   */
  private removeDragBorder(panelId: string): void {
    const graphics = this.dragBorders.get(panelId);
    if (graphics) {
      graphics.destroy();
      this.dragBorders.delete(panelId);
    }
  }

  /**
   * Handle drag start event
   */
  private onDragStart(panel: DraggablePanel): void {
    // Show position overlay
    this.updatePositionOverlay(panel);

    // Highlight the border
    const graphics = this.dragBorders.get(panel.panelId);
    if (graphics) {
      graphics.clear();
      graphics.lineStyle(3, 0xffff00, 1);
      graphics.strokeRect(
        panel.container.x,
        panel.container.y,
        panel.width,
        panel.height
      );
    }
  }

  /**
   * Handle drag event
   */
  private onDrag(
    panel: DraggablePanel,
    _pointer: Phaser.Input.Pointer,
    dragX: number,
    dragY: number
  ): void {
    const camera = this.scene.cameras.main;

    // Clamp position to screen bounds
    const clampedX = Phaser.Math.Clamp(dragX, 0, camera.width - panel.width);
    const clampedY = Phaser.Math.Clamp(dragY, 0, camera.height - panel.height);

    // Apply position
    panel.container.setPosition(clampedX, clampedY);

    // Update overlay
    this.updatePositionOverlay(panel);

    // Update drag border
    this.updateDragBorder(panel);
  }

  /**
   * Handle drag end event
   */
  private onDragEnd(panel: DraggablePanel): void {
    // Track the position change
    this.trackPositionChange(
      panel.panelId,
      panel.container.x,
      panel.container.y,
      panel.originalX,
      panel.originalY
    );

    // Hide position overlay
    this.hidePositionOverlay();

    // Reset border color
    const graphics = this.dragBorders.get(panel.panelId);
    if (graphics) {
      graphics.clear();
      graphics.lineStyle(2, 0x00ff00, 0.8);
      graphics.strokeRect(
        panel.container.x,
        panel.container.y,
        panel.width,
        panel.height
      );
    }
  }

  /**
   * Create position overlay text
   */
  private createPositionOverlay(): void {
    if (this.positionOverlay) {
      return;
    }

    this.positionOverlay = this.scene.add.text(0, 0, '', {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: { x: 6, y: 4 },
    });
    this.positionOverlay.setDepth(10000);
    this.positionOverlay.setScrollFactor(0);
    this.positionOverlay.setVisible(false);
  }

  /**
   * Update position overlay with current panel position
   */
  private updatePositionOverlay(panel: DraggablePanel): void {
    if (!this.positionOverlay) {
      return;
    }

    const x = Math.round(panel.container.x);
    const y = Math.round(panel.container.y);

    this.positionOverlay.setText(`${panel.panelId}\nX: ${x}  Y: ${y}`);
    this.positionOverlay.setPosition(
      panel.container.x + panel.width + 10,
      panel.container.y
    );
    this.positionOverlay.setVisible(true);
  }

  /**
   * Hide position overlay
   */
  private hidePositionOverlay(): void {
    if (this.positionOverlay) {
      this.positionOverlay.setVisible(false);
    }
  }

  /**
   * Destroy position overlay
   */
  private destroyPositionOverlay(): void {
    if (this.positionOverlay) {
      this.positionOverlay.destroy();
      this.positionOverlay = null;
    }
  }

  /**
   * Track a position change (in memory until save)
   */
  public trackPositionChange(
    panelId: string,
    x: number,
    y: number,
    defaultX: number,
    defaultY: number
  ): void {
    const position: PanelPosition = {
      sceneName: this.sceneName,
      panelId,
      x,
      y,
      defaultX,
      defaultY,
    };

    this.pendingChanges.set(panelId, position);
    console.log(`Position change tracked: ${panelId} -> (${x}, ${y})`);
  }

  /**
   * Check if there are pending changes
   */
  public hasPendingChanges(): boolean {
    return this.pendingChanges.size > 0;
  }

  /**
   * Get the count of pending changes
   */
  public getPendingChangesCount(): number {
    return this.pendingChanges.size;
  }

  /**
   * Get all pending position changes
   */
  public getPendingChanges(): PanelPosition[] {
    return Array.from(this.pendingChanges.values());
  }

  /**
   * Clear all pending changes (after save or discard)
   */
  public clearPendingChanges(): void {
    this.pendingChanges.clear();
  }

  /**
   * Get all current positions (including unchanged)
   */
  public getCurrentPositions(): PanelPosition[] {
    const positions: PanelPosition[] = [];

    for (const panel of this.registeredPanels.values()) {
      positions.push({
        sceneName: this.sceneName,
        panelId: panel.panelId,
        x: panel.container.x,
        y: panel.container.y,
        defaultX: panel.originalX,
        defaultY: panel.originalY,
      });
    }

    return positions;
  }

  /**
   * Reset a panel to its original position
   */
  public resetPanelPosition(panelId: string): void {
    const panel = this.registeredPanels.get(panelId);
    if (panel) {
      panel.container.setPosition(panel.originalX, panel.originalY);
      this.pendingChanges.delete(panelId);
      this.updateDragBorder(panel);
    }
  }

  /**
   * Reset all panels to their original positions
   */
  public resetAllPositions(): void {
    for (const panel of this.registeredPanels.values()) {
      panel.container.setPosition(panel.originalX, panel.originalY);
      this.updateDragBorder(panel);
    }
    this.pendingChanges.clear();
  }

  /**
   * Apply a stored position to a panel
   */
  public applyPosition(panelId: string, x: number, y: number): void {
    const panel = this.registeredPanels.get(panelId);
    if (panel) {
      panel.container.setPosition(x, y);
      if (this.editModeActive) {
        this.updateDragBorder(panel);
      }
    }
  }

  /**
   * Check if edit mode is active
   */
  public isEditModeActive(): boolean {
    return this.editModeActive;
  }

  /**
   * Get the number of registered panels
   */
  public getRegisteredPanelCount(): number {
    return this.registeredPanels.size;
  }

  /**
   * Destroy the controller and clean up resources
   */
  public destroy(): void {
    this.disableEditMode();
    this.registeredPanels.clear();
    this.pendingChanges.clear();
  }
}
