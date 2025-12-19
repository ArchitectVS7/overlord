/**
 * ResearchPanel - UI panel for researching weapon upgrades
 *
 * Features:
 * - Shows current weapon tier (Laser → Missile → Photon Torpedo)
 * - Displays research cost and time
 * - Shows research progress if in progress
 * - Start research button
 * - Damage modifier display
 */

import Phaser from 'phaser';
import { UpgradeSystem } from '@core/UpgradeSystem';
import { UpgradeCosts } from '@core/models/UpgradeModels';
import { FactionType, WeaponTier } from '@core/models/Enums';

// Panel dimensions and styling
const PANEL_WIDTH = 420;
const PANEL_HEIGHT = 380;
const PADDING = 20;
const BUTTON_HEIGHT = 36;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x9933ff; // Purple for research
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const SUCCESS_COLOR = '#44aa44';
const WARNING_COLOR = '#ff9900';
const DISABLED_COLOR = '#666666';

export class ResearchPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private upgradeSystem: UpgradeSystem | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private currentTierText!: Phaser.GameObjects.Text;
  private damageModifierText!: Phaser.GameObjects.Text;
  private researchStatusText!: Phaser.GameObjects.Text;
  private progressContainer!: Phaser.GameObjects.Container;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressText!: Phaser.GameObjects.Text;
  private nextTierInfoText!: Phaser.GameObjects.Text;
  private costText!: Phaser.GameObjects.Text;
  private researchButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onResearchStarted?: () => void;

  constructor(scene: Phaser.Scene, upgradeSystem?: UpgradeSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);

    if (upgradeSystem) {
      this.upgradeSystem = upgradeSystem;
    }

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1100);
    this.setScrollFactor(0);
  }

  public setUpgradeSystem(upgradeSystem: UpgradeSystem): void {
    this.upgradeSystem = upgradeSystem;
  }

  private createBackdrop(): void {
    const camera = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.6);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setInteractive({ useHandCursor: false });
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(1099);
    this.backdrop.setVisible(false);
    this.backdrop.on('pointerdown', () => this.hide());
  }

  private createPanel(): void {
    // Hit blocker - prevents clicks from reaching the backdrop behind the panel
    const hitBlocker = this.scene.add.rectangle(PADDING, PADDING, PANEL_WIDTH, PANEL_HEIGHT, 0x000000, 0);
    hitBlocker.setOrigin(0, 0);
    hitBlocker.setInteractive(); // Interactive but no handler - just blocks backdrop clicks
    this.add(hitBlocker);

    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.background);

    // Border
    this.borderGraphics = this.scene.add.graphics();
    this.borderGraphics.lineStyle(2, BORDER_COLOR, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.borderGraphics);

    // Title
    this.titleText = this.scene.add.text(PADDING, PADDING, 'Weapon Research', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#9933ff',
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.titleText);

    // Current tier section
    this.createCurrentTierSection();

    // Progress section
    this.createProgressSection();

    // Next tier info section
    this.createNextTierSection();

    // Research button
    this.createResearchButton();

    // Close button
    this.createCloseButton();
  }

  private createCurrentTierSection(): void {
    const startY = 55;

    const label = this.scene.add.text(PADDING, startY, 'Current Weapon Technology:', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(label);

    this.currentTierText = this.scene.add.text(PADDING, startY + 20, 'Laser Weapons', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.currentTierText);

    this.damageModifierText = this.scene.add.text(PADDING, startY + 45, 'Damage: 1.0x (Base)', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.damageModifierText);
  }

  private createProgressSection(): void {
    const startY = 120;

    this.progressContainer = this.scene.add.container(0, startY);
    this.contentContainer.add(this.progressContainer);

    // Status text
    this.researchStatusText = this.scene.add.text(PADDING, 0, 'Research Status: Idle', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.progressContainer.add(this.researchStatusText);

    // Progress bar background
    const barWidth = PANEL_WIDTH - PADDING * 2;
    const progressBg = this.scene.add.graphics();
    progressBg.fillStyle(0x333333, 1);
    progressBg.fillRoundedRect(PADDING, 25, barWidth, 20, 4);
    this.progressContainer.add(progressBg);

    // Progress bar fill
    this.progressBar = this.scene.add.graphics();
    this.progressContainer.add(this.progressBar);

    // Progress text
    this.progressText = this.scene.add.text(PANEL_WIDTH / 2, 35, '', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    this.progressText.setOrigin(0.5);
    this.progressContainer.add(this.progressText);

    this.progressContainer.setVisible(false);
  }

  private createNextTierSection(): void {
    const startY = 180;

    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(PADDING, startY - 5, PANEL_WIDTH - PADDING, startY - 5);
    this.contentContainer.add(divider);

    const label = this.scene.add.text(PADDING, startY, 'Next Available Research:', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(label);

    this.nextTierInfoText = this.scene.add.text(PADDING, startY + 20, 'Missile Weapons', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: WARNING_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.nextTierInfoText);

    const benefitLabel = this.scene.add.text(PADDING, startY + 45, 'Benefit: +50% damage to all Battle Cruisers', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(benefitLabel);

    this.costText = this.scene.add.text(PADDING, startY + 65, 'Cost: 500,000 Credits | Time: 5 turns', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ffd700',
    });
    this.contentContainer.add(this.costText);
  }

  private createResearchButton(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 10;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    this.researchButton = this.scene.add.container(PADDING, buttonY - PADDING);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x9933ff, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    this.researchButton.add(bg);
    this.researchButton.setData('bg', bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, 'START RESEARCH', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.researchButton.add(text);
    this.researchButton.setData('text', text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.startResearch());
    this.researchButton.add(zone);
    this.researchButton.setData('width', buttonWidth);
    this.researchButton.setData('zone', zone);

    this.contentContainer.add(this.researchButton);
  }

  private createCloseButton(): void {
    const closeX = PANEL_WIDTH - 30;
    const closeY = 15;

    const closeContainer = this.scene.add.container(closeX, closeY);

    const touchZone = this.scene.add.zone(0, 0, 44, 44);
    touchZone.setInteractive({ useHandCursor: true });
    closeContainer.add(touchZone);

    const closeText = this.scene.add.text(0, 0, '×', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#999999',
    });
    closeText.setOrigin(0.5);
    closeContainer.add(closeText);

    touchZone.on('pointerdown', () => this.hide());
    touchZone.on('pointerover', () => closeText.setColor('#ffffff'));
    touchZone.on('pointerout', () => closeText.setColor('#999999'));

    this.contentContainer.add(closeContainer);
  }

  public show(onClose?: () => void): void {
    if (this.isVisible) return;

    this.closeCallback = onClose || null;

    this.isVisible = true;
    this.setVisible(true);
    this.backdrop.setVisible(true);

    const camera = this.scene.cameras.main;
    this.setPosition(
      (camera.width - PANEL_WIDTH) / 2,
      (camera.height - PANEL_HEIGHT) / 2,
    );

    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 100,
      ease: 'Power2',
    });

    this.updateUI();
  }

  public hide(): void {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.backdrop.setVisible(false);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 100,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false);
        if (this.closeCallback) {
          this.closeCallback();
        }
      },
    });
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  private updateUI(): void {
    if (!this.upgradeSystem) {
      this.showNoUpgradeSystem();
      return;
    }

    const currentTier = this.upgradeSystem.getWeaponTier(FactionType.Player);
    const isResearching = this.upgradeSystem.isResearching(FactionType.Player);
    const researchingTier = this.upgradeSystem.getResearchingTier(FactionType.Player);
    const turnsRemaining = this.upgradeSystem.getResearchTurnsRemaining(FactionType.Player);
    const damageModifier = this.upgradeSystem.getDamageModifier(FactionType.Player);

    // Update current tier display
    this.currentTierText.setText(this.getTierDisplayName(currentTier));
    this.damageModifierText.setText(`Damage: ${damageModifier.toFixed(1)}x${damageModifier > 1 ? ' (Enhanced)' : ' (Base)'}`);

    // Update progress section
    if (isResearching && researchingTier) {
      this.progressContainer.setVisible(true);
      this.researchStatusText.setText(`Researching: ${this.getTierDisplayName(researchingTier)}`);
      this.researchStatusText.setColor(WARNING_COLOR);

      const totalTurns = UpgradeCosts.getResearchTime(researchingTier);
      const turnsCompleted = totalTurns - turnsRemaining;
      const progress = turnsCompleted / totalTurns;

      // Update progress bar
      const barWidth = PANEL_WIDTH - PADDING * 2;
      this.progressBar.clear();
      if (progress > 0) {
        this.progressBar.fillStyle(0x9933ff, 1);
        this.progressBar.fillRoundedRect(PADDING, 25, barWidth * progress, 20, 4);
      }
      this.progressText.setText(`${turnsCompleted}/${totalTurns} turns`);
    } else {
      this.progressContainer.setVisible(false);
    }

    // Update next tier section
    this.updateNextTierSection(currentTier, isResearching);

    // Update button state
    this.updateButtonState(currentTier, isResearching);
  }

  private updateNextTierSection(currentTier: WeaponTier, isResearching: boolean): void {
    const nextTier = this.getNextTier(currentTier);

    if (nextTier === null) {
      this.nextTierInfoText.setText('Maximum Technology Achieved!');
      this.nextTierInfoText.setColor(SUCCESS_COLOR);
      this.costText.setText('All weapon technologies have been researched.');
    } else if (isResearching) {
      this.nextTierInfoText.setText(`${this.getTierDisplayName(nextTier)} (In Progress)`);
      this.nextTierInfoText.setColor(WARNING_COLOR);
      const cost = UpgradeCosts.getResearchCost(nextTier);
      const time = UpgradeCosts.getResearchTime(nextTier);
      this.costText.setText(`Cost: ${cost.toLocaleString()} Credits | Time: ${time} turns`);
    } else {
      this.nextTierInfoText.setText(this.getTierDisplayName(nextTier));
      this.nextTierInfoText.setColor(WARNING_COLOR);
      const cost = UpgradeCosts.getResearchCost(nextTier);
      const time = UpgradeCosts.getResearchTime(nextTier);
      const bonus = this.getDamageBonus(nextTier);
      this.costText.setText(`Cost: ${cost.toLocaleString()} Credits | Time: ${time} turns\nBonus: ${bonus}`);
    }
  }

  private updateButtonState(currentTier: WeaponTier, isResearching: boolean): void {
    const nextTier = this.getNextTier(currentTier);
    const canAfford = this.upgradeSystem?.canAffordNextResearch(FactionType.Player) ?? false;
    const canStart = nextTier !== null && !isResearching && canAfford;

    const bg = this.researchButton.getData('bg') as Phaser.GameObjects.Graphics;
    const text = this.researchButton.getData('text') as Phaser.GameObjects.Text;
    const width = this.researchButton.getData('width') as number;
    const zone = this.researchButton.getData('zone') as Phaser.GameObjects.Zone;

    bg.clear();
    bg.fillStyle(canStart ? 0x9933ff : 0x4a4a4a, 1);
    bg.fillRoundedRect(0, 0, width, BUTTON_HEIGHT, 6);

    if (nextTier === null) {
      text.setText('FULLY RESEARCHED');
    } else if (isResearching) {
      text.setText('RESEARCH IN PROGRESS');
    } else if (!canAfford) {
      text.setText('INSUFFICIENT CREDITS');
    } else {
      text.setText('START RESEARCH');
    }

    text.setColor(canStart ? TEXT_COLOR : DISABLED_COLOR);
    zone.setInteractive({ useHandCursor: canStart });
  }

  private showNoUpgradeSystem(): void {
    this.currentTierText.setText('No upgrade system available');
    this.currentTierText.setColor(DISABLED_COLOR);
    this.damageModifierText.setText('');
    this.progressContainer.setVisible(false);
    this.nextTierInfoText.setText('');
    this.costText.setText('');
  }

  private startResearch(): void {
    if (!this.upgradeSystem) return;

    const currentTier = this.upgradeSystem.getWeaponTier(FactionType.Player);
    const nextTier = this.getNextTier(currentTier);
    const isResearching = this.upgradeSystem.isResearching(FactionType.Player);
    const canAfford = this.upgradeSystem.canAffordNextResearch(FactionType.Player);

    if (nextTier === null || isResearching || !canAfford) return;

    const success = this.upgradeSystem.startResearch(FactionType.Player);
    if (success) {
      this.onResearchStarted?.();
      this.updateUI();
    }
  }

  private getTierDisplayName(tier: WeaponTier): string {
    switch (tier) {
      case WeaponTier.Laser: return 'Laser Weapons';
      case WeaponTier.Missile: return 'Missile Weapons';
      case WeaponTier.PhotonTorpedo: return 'Photon Torpedoes';
      default: return 'Unknown';
    }
  }

  private getDamageBonus(tier: WeaponTier): string {
    switch (tier) {
      case WeaponTier.Missile: return '+50% damage to all Battle Cruisers';
      case WeaponTier.PhotonTorpedo: return '+100% damage to all Battle Cruisers';
      default: return '';
    }
  }

  private getNextTier(current: WeaponTier): WeaponTier | null {
    switch (current) {
      case WeaponTier.Laser: return WeaponTier.Missile;
      case WeaponTier.Missile: return WeaponTier.PhotonTorpedo;
      case WeaponTier.PhotonTorpedo: return null;
      default: return null;
    }
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
