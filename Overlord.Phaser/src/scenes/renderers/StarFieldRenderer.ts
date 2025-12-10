/**
 * StarFieldRenderer - Creates parallax star background layers
 */

export class StarFieldRenderer {
  private scene: Phaser.Scene;
  private starLayers: Phaser.GameObjects.Graphics[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Creates a multi-layer star field background
   */
  public createStarField(width: number, height: number): void {
    // Clear existing star layers
    this.destroy();

    // Layer 1: Background stars (smallest, dimmest, most dense)
    this.createStarLayer(width, height, {
      count: 300,
      minSize: 1,
      maxSize: 1,
      minAlpha: 0.2,
      maxAlpha: 0.4,
      depth: -30
    });

    // Layer 2: Mid-ground stars (medium brightness)
    this.createStarLayer(width, height, {
      count: 150,
      minSize: 1,
      maxSize: 2,
      minAlpha: 0.4,
      maxAlpha: 0.7,
      depth: -20
    });

    // Layer 3: Foreground stars (largest, brightest, least dense)
    this.createStarLayer(width, height, {
      count: 75,
      minSize: 2,
      maxSize: 2,
      minAlpha: 0.7,
      maxAlpha: 1.0,
      depth: -10
    });
  }

  /**
   * Creates a single star layer with specified parameters
   */
  private createStarLayer(
    width: number,
    height: number,
    config: {
      count: number;
      minSize: number;
      maxSize: number;
      minAlpha: number;
      maxAlpha: number;
      depth: number;
    }
  ): void {
    const graphics = this.scene.add.graphics();
    graphics.setDepth(config.depth);

    for (let i = 0; i < config.count; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.Between(config.minSize, config.maxSize);
      const alpha = Phaser.Math.FloatBetween(config.minAlpha, config.maxAlpha);

      graphics.fillStyle(0xffffff, alpha);
      graphics.fillCircle(x, y, size);
    }

    this.starLayers.push(graphics);
  }

  /**
   * Destroys all star layers
   */
  public destroy(): void {
    this.starLayers.forEach(layer => layer.destroy());
    this.starLayers = [];
  }

  /**
   * Gets the star layers for external manipulation
   */
  public getLayers(): Phaser.GameObjects.Graphics[] {
    return this.starLayers;
  }
}
