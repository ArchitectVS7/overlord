/**
 * ScenarioPackScene - Main scene for browsing and selecting scenario packs
 * Story 9-1: Scenario Pack Browsing and Selection
 *
 * Features:
 * - Displays available scenario packs
 * - Pack detail view with full metadata
 * - Pack selection and activation
 * - Navigation back to main menu
 */

import Phaser from 'phaser';
import { ScenarioPackManager, getPackManager } from '@core/ScenarioPackManager';
import { ScenarioPack, PackDisplayData } from '@core/models/ScenarioPackModels';
import { AIPersonality, AIDifficulty, PlanetType } from '@core/models/Enums';
import { PackListPanel } from './ui/PackListPanel';
import { PackDetailPanel } from './ui/PackDetailPanel';

/**
 * Default scenario pack configuration
 */
const DEFAULT_PACK: ScenarioPack = {
  id: 'default',
  name: 'Standard Campaign',
  version: '1.0.0',
  description: 'The classic Overlord experience with balanced gameplay and strategic depth.',
  faction: {
    name: 'Earth Federation',
    leader: 'Admiral Chen',
    lore: 'The original Earth forces, seeking to expand their galactic influence through diplomacy and strength.',
    colorTheme: 0x4488ff
  },
  aiConfig: {
    personality: AIPersonality.Balanced,
    difficulty: AIDifficulty.Normal
  },
  galaxyTemplate: {
    planetCount: { min: 4, max: 6 },
    planetTypes: [PlanetType.Volcanic, PlanetType.Desert, PlanetType.Tropical, PlanetType.Metropolis],
    resourceAbundance: 'standard'
  },
  isDefault: true,
  featured: true
};

/**
 * Aggressive AI pack
 */
const AGGRESSIVE_PACK: ScenarioPack = {
  id: 'aggressive',
  name: 'Warlord Challenge',
  version: '1.0.0',
  description: 'Face an aggressive AI commander who prioritizes military might above all else.',
  faction: {
    name: 'Martian Dominion',
    leader: 'Commander Kratos',
    lore: 'A militaristic faction from Mars, forged in the fires of conquest and driven by an unquenchable thirst for expansion.',
    colorTheme: 0xff4444
  },
  aiConfig: {
    personality: AIPersonality.Aggressive,
    difficulty: AIDifficulty.Hard
  },
  galaxyTemplate: {
    planetCount: { min: 3, max: 5 },
    planetTypes: [PlanetType.Volcanic, PlanetType.Desert],
    resourceAbundance: 'scarce'
  },
  featured: false
};

/**
 * Economic AI pack
 */
const ECONOMIC_PACK: ScenarioPack = {
  id: 'economic',
  name: 'Merchant Kings',
  version: '1.0.0',
  description: 'Compete against an AI focused on economic dominance and resource control.',
  faction: {
    name: 'Trade Consortium',
    leader: 'Magistrate Midas',
    lore: 'A coalition of wealthy merchant houses who believe that credits speak louder than weapons.',
    colorTheme: 0xffcc00
  },
  aiConfig: {
    personality: AIPersonality.Economic,
    difficulty: AIDifficulty.Normal
  },
  galaxyTemplate: {
    planetCount: { min: 5, max: 8 },
    planetTypes: [PlanetType.Tropical, PlanetType.Metropolis],
    resourceAbundance: 'rich'
  },
  featured: false
};

export class ScenarioPackScene extends Phaser.Scene {
  private packManager!: ScenarioPackManager;
  private listPanel!: PackListPanel;
  private detailPanel!: PackDetailPanel;
  private titleText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'ScenarioPackScene' });
  }

  create(): void {
    // Initialize pack manager
    this.packManager = getPackManager();

    // Register default packs
    this.registerDefaultPacks();

    // Load active pack from storage
    this.packManager.loadActivePackFromStorage();

    // Create background
    this.cameras.main.setBackgroundColor('#0a0a1a');

    // Create title
    this.titleText = this.add.text(
      this.cameras.main.centerX,
      40,
      'Scenario Packs',
      {
        fontSize: '42px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    );
    this.titleText.setOrigin(0.5, 0);
    this.titleText.setScrollFactor(0);

    // Create subtitle
    const subtitleText = this.add.text(
      this.cameras.main.centerX,
      90,
      'Choose your challenge',
      {
        fontSize: '16px',
        color: '#aaaaaa'
      }
    );
    subtitleText.setOrigin(0.5, 0);
    subtitleText.setScrollFactor(0);

    // Create panels
    this.createPanels();

    // Load packs into list
    this.refreshPackList();

    // Show list panel
    this.listPanel.show();

    // Create back button
    this.createBackButton();
  }

  /**
   * Register default packs
   */
  private registerDefaultPacks(): void {
    this.packManager.registerPack(DEFAULT_PACK);
    this.packManager.registerPack(AGGRESSIVE_PACK);
    this.packManager.registerPack(ECONOMIC_PACK);
  }

  /**
   * Create UI panels
   */
  private createPanels(): void {
    // Pack list panel
    this.listPanel = new PackListPanel(this);
    this.listPanel.onPackSelected = (pack: PackDisplayData) => {
      this.showPackDetail(pack.id);
    };
    this.listPanel.onClose = () => {
      this.returnToMainMenu();
    };

    // Pack detail panel
    this.detailPanel = new PackDetailPanel(this);
    this.detailPanel.onSelectPack = (pack: ScenarioPack) => {
      this.selectPack(pack.id);
      this.detailPanel.hide();
      this.listPanel.show();
      this.refreshPackList();
    };
    this.detailPanel.onBack = () => {
      this.detailPanel.hide();
      this.listPanel.show();
    };
  }

  /**
   * Refresh the pack list
   */
  private refreshPackList(): void {
    const displayData = this.packManager.getPackDisplayData();
    this.listPanel.setPacks(displayData);
  }

  /**
   * Show pack detail
   */
  private showPackDetail(packId: string): void {
    const pack = this.packManager.getPackById(packId);
    if (!pack) return;

    const activePack = this.packManager.getActivePack();

    this.detailPanel.setPack(pack);
    this.detailPanel.setLocked(this.packManager.isPackLocked(packId));
    this.detailPanel.setPackActive(activePack?.id === packId);

    this.listPanel.hide();
    this.detailPanel.show();
  }

  /**
   * Create back button
   */
  private createBackButton(): void {
    const backButton = this.add.text(
      20,
      this.cameras.main.height - 40,
      '← Back to Menu',
      {
        fontSize: '18px',
        color: '#4488ff'
      }
    );
    backButton.setScrollFactor(0);
    backButton.setInteractive({ useHandCursor: true });
    backButton.on('pointerdown', () => {
      this.returnToMainMenu();
    });
    backButton.on('pointerover', () => {
      backButton.setColor('#66aaff');
    });
    backButton.on('pointerout', () => {
      backButton.setColor('#4488ff');
    });
  }

  /**
   * Return to main menu
   */
  private returnToMainMenu(): void {
    this.scene.start('MainMenuScene');
  }

  /**
   * Get the pack manager
   */
  getPackManager(): ScenarioPackManager {
    return this.packManager;
  }

  /**
   * Get the currently active pack
   */
  getActivePack(): ScenarioPack | undefined {
    return this.packManager.getActivePack();
  }

  /**
   * Select a pack by ID
   */
  selectPack(packId: string): boolean {
    return this.packManager.setActivePack(packId);
  }

  /**
   * Reset to default pack
   */
  resetToDefaultPack(): void {
    this.packManager.resetToDefault();
    this.refreshPackList();
  }
}
