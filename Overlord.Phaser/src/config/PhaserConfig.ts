import Phaser from 'phaser';
import { BootScene } from '@scenes/BootScene';
import { GalaxyMapScene } from '@scenes/GalaxyMapScene';

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [BootScene, GalaxyMapScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};
