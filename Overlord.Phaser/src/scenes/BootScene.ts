import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Future: load assets (sprites, fonts, etc.)
  }

  public create(): void {
    // Start main galaxy map scene
    this.scene.start('GalaxyMapScene');
  }
}
