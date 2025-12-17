import Phaser from 'phaser';
import { BootScene } from '@scenes/BootScene';
import { AuthScene } from '@scenes/AuthScene';
import { MainMenuScene } from '@scenes/MainMenuScene';
import { FlashConflictsScene } from '@scenes/FlashConflictsScene';
import { ScenarioGameScene } from '@scenes/ScenarioGameScene';
import { ScenarioPackScene } from '@scenes/ScenarioPackScene';
import { CampaignConfigScene } from '@scenes/CampaignConfigScene';
import { GalaxyMapScene } from '@scenes/GalaxyMapScene';
import { VictoryScene } from '@scenes/VictoryScene';
import { DefeatScene } from '@scenes/DefeatScene';

export const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [BootScene, AuthScene, MainMenuScene, FlashConflictsScene, ScenarioGameScene, ScenarioPackScene, CampaignConfigScene, GalaxyMapScene, VictoryScene, DefeatScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};
