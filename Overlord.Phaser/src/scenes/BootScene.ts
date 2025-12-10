import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  public preload(): void {
    // Future: load assets (sprites, fonts, etc.)
  }

  public create(): void {
    // Start at main menu (AC-1)
    this.scene.start('MainMenuScene');
  }
}
