/**
 * CameraController - Manages galaxy map camera controls
 * Handles pan, zoom, and viewport management for the galaxy map
 *
 * This is a Phaser-specific class (presentation layer)
 */

export interface CameraControllerConfig {
  zoomMin: number;
  zoomMax: number;
  zoomStep: number;
  smoothDuration: number;
  dragThreshold: number;
}

export interface GalaxyBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const DEFAULT_CONFIG: CameraControllerConfig = {
  zoomMin: 0.5,
  zoomMax: 2.0,
  zoomStep: 0.075,
  smoothDuration: 500,
  dragThreshold: 5
};

export class CameraController {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private config: CameraControllerConfig;
  private galaxyBounds: GalaxyBounds;

  // Drag state
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private dragStartScrollX: number = 0;
  private dragStartScrollY: number = 0;
  private dragDistance: number = 0;

  // Home position for reset
  private homeX: number = 0;
  private homeY: number = 0;
  private defaultZoom: number = 1.0;

  constructor(
    scene: Phaser.Scene,
    galaxyBounds: GalaxyBounds,
    config?: Partial<CameraControllerConfig>
  ) {
    this.scene = scene;
    this.camera = scene.cameras.main;
    this.galaxyBounds = galaxyBounds;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get the galaxy bounds
   */
  public getGalaxyBounds(): GalaxyBounds {
    return this.galaxyBounds;
  }

  /**
   * Set the home position for reset view
   */
  public setHomePosition(x: number, y: number, zoom: number = 1.0): void {
    this.homeX = x;
    this.homeY = y;
    this.defaultZoom = zoom;
  }

  /**
   * Enable mouse drag panning
   */
  public enableDragPan(): void {
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointerupoutside', this.handlePointerUp, this);
  }

  /**
   * Disable mouse drag panning
   */
  public disableDragPan(): void {
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointerupoutside', this.handlePointerUp, this);
  }

  /**
   * Enable mouse wheel zoom
   */
  public enableWheelZoom(): void {
    this.scene.input.on('wheel', this.handleWheel, this);
  }

  /**
   * Disable mouse wheel zoom
   */
  public disableWheelZoom(): void {
    this.scene.input.off('wheel', this.handleWheel, this);
  }

  /**
   * Center camera on a position
   */
  public centerOn(x: number, y: number, smooth: boolean = false): void {
    if (smooth) {
      this.scene.tweens.add({
        targets: this.camera,
        scrollX: x - this.camera.width / 2 / this.camera.zoom,
        scrollY: y - this.camera.height / 2 / this.camera.zoom,
        duration: this.config.smoothDuration,
        ease: 'Cubic.easeOut'
      });
    } else {
      this.camera.centerOn(x, y);
    }
  }

  /**
   * Reset camera to home position with default zoom
   */
  public resetView(smooth: boolean = true): void {
    if (smooth) {
      this.scene.tweens.add({
        targets: this.camera,
        zoom: this.defaultZoom,
        scrollX: this.homeX - this.camera.width / 2 / this.defaultZoom,
        scrollY: this.homeY - this.camera.height / 2 / this.defaultZoom,
        duration: this.config.smoothDuration,
        ease: 'Cubic.easeOut'
      });
    } else {
      this.camera.setZoom(this.defaultZoom);
      this.camera.centerOn(this.homeX, this.homeY);
    }
  }

  /**
   * Get visible bounds in world coordinates
   */
  public getVisibleBounds(): Phaser.Geom.Rectangle {
    const zoom = this.camera.zoom;
    const width = this.camera.width / zoom;
    const height = this.camera.height / zoom;

    return new Phaser.Geom.Rectangle(
      this.camera.scrollX,
      this.camera.scrollY,
      width,
      height
    );
  }

  /**
   * Check if a point is visible in current viewport
   */
  public isVisible(x: number, y: number, margin: number = 0): boolean {
    const bounds = this.getVisibleBounds();
    return (
      x >= bounds.x + margin &&
      x <= bounds.x + bounds.width - margin &&
      y >= bounds.y + margin &&
      y <= bounds.y + bounds.height - margin
    );
  }

  /**
   * Pan to position if not currently visible
   */
  public panToIfNotVisible(x: number, y: number, margin: number = 50): void {
    if (!this.isVisible(x, y, margin)) {
      this.centerOn(x, y, true);
    }
  }

  /**
   * Check if currently in a drag operation
   */
  public getIsDragging(): boolean {
    return this.isDragging && this.dragDistance >= this.config.dragThreshold;
  }

  /**
   * Get current zoom level
   */
  public getZoom(): number {
    return this.camera.zoom;
  }

  /**
   * Set zoom level (clamped to limits)
   */
  public setZoom(zoom: number, smooth: boolean = false): void {
    const clampedZoom = Phaser.Math.Clamp(
      zoom,
      this.config.zoomMin,
      this.config.zoomMax
    );

    if (smooth) {
      this.scene.tweens.add({
        targets: this.camera,
        zoom: clampedZoom,
        duration: this.config.smoothDuration,
        ease: 'Cubic.easeOut'
      });
    } else {
      this.camera.setZoom(clampedZoom);
    }
  }

  /**
   * Clean up event listeners
   */
  public destroy(): void {
    this.disableDragPan();
    this.disableWheelZoom();
  }

  // Private event handlers

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (!pointer.leftButtonDown()) return;

    // Don't start camera drag if pointer is over an interactive UI element
    // This allows UI elements (buttons, draggable panels) to handle their own input
    const objectsUnderPointer = this.scene.input.hitTestPointer(pointer);
    if (objectsUnderPointer.length > 0) {
      // Check if any object under pointer is interactive (has input enabled)
      const hasInteractiveUI = objectsUnderPointer.some(obj => {
        // Check if it's a UI element (high depth or scroll factor 0)
        const gameObject = obj as Phaser.GameObjects.GameObject;
        const depth = (gameObject as unknown as { depth?: number }).depth ?? 0;
        const scrollFactor = (gameObject as unknown as { scrollFactorX?: number }).scrollFactorX;

        // UI elements typically have high depth (>= 100) or scrollFactor of 0
        return depth >= 100 || scrollFactor === 0;
      });

      if (hasInteractiveUI) {
        return; // Let UI handle the interaction
      }
    }

    this.isDragging = true;
    this.dragStartX = pointer.x;
    this.dragStartY = pointer.y;
    this.dragStartScrollX = this.camera.scrollX;
    this.dragStartScrollY = this.camera.scrollY;
    this.dragDistance = 0;
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isDragging) return;

    const dx = pointer.x - this.dragStartX;
    const dy = pointer.y - this.dragStartY;
    this.dragDistance = Math.sqrt(dx * dx + dy * dy);

    // Only pan if past threshold
    if (this.dragDistance >= this.config.dragThreshold) {
      // Inverted movement for natural drag feel
      const deltaX = (this.dragStartX - pointer.x) / this.camera.zoom;
      const deltaY = (this.dragStartY - pointer.y) / this.camera.zoom;

      this.camera.scrollX = this.dragStartScrollX + deltaX;
      this.camera.scrollY = this.dragStartScrollY + deltaY;
    }
  }

  private handlePointerUp(): void {
    this.isDragging = false;
    this.dragDistance = 0;
  }

  private handleWheel(
    pointer: Phaser.Input.Pointer,
    _gameObjects: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
    _deltaZ: number
  ): void {
    // Get world position of cursor before zoom
    const worldX = this.camera.scrollX + pointer.x / this.camera.zoom;
    const worldY = this.camera.scrollY + pointer.y / this.camera.zoom;

    // Calculate new zoom (deltaY > 0 means scroll down = zoom out)
    const zoomDelta = deltaY > 0 ? -this.config.zoomStep : this.config.zoomStep;
    const newZoom = Phaser.Math.Clamp(
      this.camera.zoom + zoomDelta,
      this.config.zoomMin,
      this.config.zoomMax
    );

    // Apply zoom
    this.camera.setZoom(newZoom);

    // Adjust camera to keep cursor world position fixed
    const newWorldX = this.camera.scrollX + pointer.x / this.camera.zoom;
    const newWorldY = this.camera.scrollY + pointer.y / this.camera.zoom;

    this.camera.scrollX += worldX - newWorldX;
    this.camera.scrollY += worldY - newWorldY;
  }
}
