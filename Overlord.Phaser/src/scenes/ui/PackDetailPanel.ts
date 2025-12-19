/**
 * PackDetailPanel - UI panel for displaying detailed pack information
 * Story 9-1: Scenario Pack Browsing and Selection
 *
 * Features:
 * - Shows full pack metadata
 * - Displays faction lore and AI configuration
 * - "Select Pack" button for unlocked packs
 * - Unlock requirements display for locked packs
 */

import Phaser from 'phaser';
import { ScenarioPack, UnlockRequirement } from '@core/models/ScenarioPackModels';

// Panel dimensions and styling
const PANEL_WIDTH = 450;
const PANEL_HEIGHT = 600;
const PADDING = 20;
const BUTTON_HEIGHT = 40;
const BUTTON_WIDTH = 180;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const LORE_COLOR = '#cccccc';
const BUTTON_BG_COLOR = 0x4488ff;
const BUTTON_HOVER_COLOR = 0x5599ff;
const ACTIVE_COLOR = '#44ff44';
const LOCKED_COLOR = '#ff6666';

export class PackDetailPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;

  private pack: ScenarioPack | null = null;
  private isLocked: boolean = false;
  private isActive: boolean = false;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private versionText!: Phaser.GameObjects.Text;
  private descriptionText!: Phaser.GameObjects.Text;
  private factionNameText!: Phaser.GameObjects.Text;
  private leaderText!: Phaser.GameObjects.Text;
  private loreText!: Phaser.GameObjects.Text;
  private difficultyText!: Phaser.GameObjects.Text;
  private personalityText!: Phaser.GameObjects.Text;
  private planetCountText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private requirementsText!: Phaser.GameObjects.Text;
  private selectButton!: Phaser.GameObjects.Container;
  private backButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onSelectPack?: (pack: ScenarioPack) => void;
  public onBack?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);

    this.createPanel();
    this.setVisible(false);
    this.setDepth(1200);
    this.setScrollFactor(0);
  }

  private createPanel(): void {
    const camera = this.scene.cameras.main;
    const x = (camera.width - PANEL_WIDTH) / 2;
    const y = (camera.height - PANEL_HEIGHT) / 2;
    this.setPosition(x, y);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.background.lineStyle(2, BORDER_COLOR, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);

    // Content container
    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Title
    this.titleText = this.scene.add.text(0, 0, '', {
      fontSize: '24px',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.titleText);

    // Version
    this.versionText = this.scene.add.text(0, 32, '', {
      fontSize: '12px',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.versionText);

    // Description
    this.descriptionText = this.scene.add.text(0, 55, '', {
      fontSize: '14px',
      color: TEXT_COLOR,
      wordWrap: { width: PANEL_WIDTH - PADDING * 2 },
    });
    this.contentContainer.add(this.descriptionText);

    // Faction section
    const factionLabel = this.scene.add.text(0, 110, 'FACTION', {
      fontSize: '11px',
      color: LABEL_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(factionLabel);

    this.factionNameText = this.scene.add.text(0, 128, '', {
      fontSize: '16px',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.factionNameText);

    this.leaderText = this.scene.add.text(0, 150, '', {
      fontSize: '14px',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.leaderText);

    this.loreText = this.scene.add.text(0, 175, '', {
      fontSize: '13px',
      color: LORE_COLOR,
      fontStyle: 'italic',
      wordWrap: { width: PANEL_WIDTH - PADDING * 2 },
    });
    this.contentContainer.add(this.loreText);

    // Configuration section
    const configLabel = this.scene.add.text(0, 270, 'CONFIGURATION', {
      fontSize: '11px',
      color: LABEL_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(configLabel);

    this.difficultyText = this.scene.add.text(0, 290, '', {
      fontSize: '14px',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.difficultyText);

    this.personalityText = this.scene.add.text(0, 312, '', {
      fontSize: '14px',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.personalityText);

    this.planetCountText = this.scene.add.text(0, 334, '', {
      fontSize: '14px',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.planetCountText);

    // Status text
    this.statusText = this.scene.add.text(0, 380, '', {
      fontSize: '14px',
      color: ACTIVE_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.statusText);

    // Requirements text (for locked packs)
    this.requirementsText = this.scene.add.text(0, 400, '', {
      fontSize: '12px',
      color: LOCKED_COLOR,
      wordWrap: { width: PANEL_WIDTH - PADDING * 2 },
    });
    this.contentContainer.add(this.requirementsText);

    // Select button
    this.selectButton = this.createButton(
      PANEL_WIDTH / 2 - BUTTON_WIDTH - 10,
      PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 20,
      'Select Pack',
      () => this.selectPack(),
    );
    this.add(this.selectButton);

    // Back button
    this.backButton = this.createButton(
      PANEL_WIDTH / 2 + 10,
      PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 20,
      'Back',
      () => this.goBack(),
    );
    this.add(this.backButton);
  }

  private createButton(x: number, y: number, label: string, callback: () => void): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    bg.fillStyle(BUTTON_BG_COLOR, 1);
    bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    container.add(bg);

    const text = this.scene.add.text(BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, label, {
      fontSize: '16px',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5, 0.5);
    container.add(text);

    const hitArea = this.scene.add.rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 0x000000, 0);
    hitArea.setOrigin(0, 0);
    hitArea.setInteractive({ useHandCursor: true });
    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(BUTTON_HOVER_COLOR, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    });
    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(BUTTON_BG_COLOR, 1);
      bg.fillRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 4);
    });
    hitArea.on('pointerdown', callback);
    container.add(hitArea);

    return container;
  }

  /**
   * Set the pack to display
   */
  setPack(pack: ScenarioPack): void {
    this.pack = pack;
    this.updateDisplay();
  }

  /**
   * Get the displayed pack ID
   */
  getDisplayedPackId(): string | null {
    return this.pack?.id || null;
  }

  /**
   * Update the display with pack data
   */
  private updateDisplay(): void {
    if (!this.pack) {return;}

    this.titleText.setText(this.pack.name);
    this.versionText.setText(`Version ${this.pack.version}`);
    this.descriptionText.setText(this.pack.description);

    this.factionNameText.setText(this.pack.faction.name);
    this.leaderText.setText(`Leader: ${this.pack.faction.leader}`);
    this.loreText.setText(this.pack.faction.lore);

    this.difficultyText.setText(`Difficulty: ${this.pack.aiConfig.difficulty}`);
    this.personalityText.setText(`AI Personality: ${this.pack.aiConfig.personality}`);

    const { min, max } = this.pack.galaxyTemplate.planetCount;
    this.planetCountText.setText(`Planets: ${min}-${max} | Resources: ${this.pack.galaxyTemplate.resourceAbundance}`);

    this.updateStatusDisplay();
  }

  /**
   * Update status display (active/locked)
   */
  private updateStatusDisplay(): void {
    if (this.isActive) {
      this.statusText.setText('✓ Currently Active');
      this.statusText.setColor(ACTIVE_COLOR);
    } else if (this.isLocked) {
      this.statusText.setText('🔒 Locked');
      this.statusText.setColor(LOCKED_COLOR);

      // Show unlock requirements
      if (this.pack?.unlockRequirements && this.pack.unlockRequirements.length > 0) {
        const reqText = this.pack.unlockRequirements
          .map(r => `• ${r.description}`)
          .join('\n');
        this.requirementsText.setText(`Unlock requirements:\n${reqText}`);
      }
    } else {
      this.statusText.setText('');
      this.requirementsText.setText('');
    }
  }

  /**
   * Set whether the pack is locked
   */
  setLocked(locked: boolean): void {
    this.isLocked = locked;
    this.updateStatusDisplay();
  }

  /**
   * Set whether the pack is active
   */
  setPackActive(active: boolean): void {
    this.isActive = active;
    this.updateStatusDisplay();
  }

  /**
   * Check if the pack is active
   */
  isPackActive(): boolean {
    return this.isActive;
  }

  /**
   * Get unlock requirements
   */
  getUnlockRequirements(): UnlockRequirement[] {
    return this.pack?.unlockRequirements || [];
  }

  /**
   * Get pack metadata for display
   */
  getPackMetadata(): { name: string; leader: string; difficulty: string; personality: string } {
    if (!this.pack) {
      return { name: '', leader: '', difficulty: '', personality: '' };
    }

    return {
      name: this.pack.name,
      leader: this.pack.faction.leader,
      difficulty: this.pack.aiConfig.difficulty,
      personality: this.pack.aiConfig.personality,
    };
  }

  /**
   * Select the current pack
   */
  selectPack(): void {
    if (!this.pack || this.isLocked) {
      return;
    }

    if (this.onSelectPack) {
      this.onSelectPack(this.pack);
    }
  }

  /**
   * Go back to pack list
   */
  goBack(): void {
    if (this.onBack) {
      this.onBack();
    }
  }

  /**
   * Show the panel
   */
  show(): void {
    this.setVisible(true);
  }

  /**
   * Hide the panel
   */
  hide(): void {
    this.setVisible(false);
  }

  /**
   * Clean up
   */
  destroy(fromScene?: boolean): void {
    super.destroy(fromScene);
  }
}
