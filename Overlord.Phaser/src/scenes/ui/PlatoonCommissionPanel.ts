/**
 * PlatoonCommissionPanel - UI panel for commissioning platoons
 *
 * Story 5-1: Platoon Commissioning with Equipment Configuration
 *
 * Features:
 * - Configure troop count (1-200)
 * - Select equipment level (Basic/Standard/Advanced)
 * - Select weapon level (Rifle/HeavyWeapons/Artillery)
 * - Real-time cost and strength previews
 * - Commission validation (resources, population)
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { EquipmentLevel, WeaponLevel, FactionType } from '@core/models/Enums';
import { PlatoonCosts, PlatoonModifiers } from '@core/models/PlatoonModels';
import { PlatoonSystem } from '@core/PlatoonSystem';

// Panel dimensions and styling
const PANEL_WIDTH = 480;
const PANEL_HEIGHT = 560;
const PADDING = 20;
const BUTTON_HEIGHT = 36;
const MAX_PLATOONS_PER_PLANET = 24;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x44aa44;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const ERROR_COLOR = '#cc0000';
const SUCCESS_COLOR = '#44aa44';
const DISABLED_COLOR = '#666666';

export class PlatoonCommissionPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private planet: PlanetEntity | null = null;
  private troopCount: number = 100;
  private equipmentLevel: EquipmentLevel = EquipmentLevel.Basic;
  private weaponLevel: WeaponLevel = WeaponLevel.Rifle;
  private platoonCount: number = 0;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;
  private platoonSystem: PlatoonSystem | null = null;
  private lastCommissionResult: number = -1;

  // UI elements
  private planetInfoText!: Phaser.GameObjects.Text;
  private troopCountText!: Phaser.GameObjects.Text;
  private costText!: Phaser.GameObjects.Text;
  private strengthText!: Phaser.GameObjects.Text;
  private commissionButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onCommission?: (
    planet: PlanetEntity,
    troopCount: number,
    equipment: EquipmentLevel,
    weapon: WeaponLevel
  ) => void;

  constructor(scene: Phaser.Scene, platoonSystem?: PlatoonSystem | unknown) {
    super(scene, 0, 0);
    scene.add.existing(this);

    // Accept PlatoonSystem for Core integration (optional for backwards compatibility)
    if (platoonSystem && typeof (platoonSystem as PlatoonSystem).commissionPlatoon === 'function') {
      this.platoonSystem = platoonSystem as PlatoonSystem;
    }

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1100);
    this.setScrollFactor(0);
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
    const title = this.scene.add.text(PADDING, PADDING, '🪖 Commission Platoon', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(title);

    this.createPlanetInfoSection();
    this.createTroopCountSection();
    this.createEquipmentSection();
    this.createWeaponSection();
    this.createPreviewSection();
    this.createCommissionButton();
    this.createCloseButton();
  }

  private createPlanetInfoSection(): void {
    const startY = 55;

    const label = this.scene.add.text(PADDING, startY, 'Planet:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(label);

    this.planetInfoText = this.scene.add.text(PADDING, startY + 22, '', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR
    });
    this.contentContainer.add(this.planetInfoText);
  }

  private createTroopCountSection(): void {
    const startY = 110;

    const label = this.scene.add.text(PADDING, startY, 'Troop Count:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(label);

    this.troopCountText = this.scene.add.text(PADDING, startY + 22, '100 troops', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.troopCountText);

    // Troop count buttons
    this.createTroopCountButtons(startY + 50);
  }

  private createTroopCountButtons(y: number): void {
    const values = [50, 100, 150, 200];
    const buttonWidth = (PANEL_WIDTH - PADDING * 2 - 30) / 4;

    values.forEach((value, index) => {
      const x = PADDING + index * (buttonWidth + 10);
      const container = this.scene.add.container(x, y);

      const bg = this.scene.add.graphics();
      bg.fillStyle(0x3a4a5a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, 30, 4);
      container.add(bg);
      container.setData('bg', bg);
      container.setData('value', value);

      const text = this.scene.add.text(buttonWidth / 2, 15, value.toString(), {
        fontSize: '12px',
        fontFamily: 'Arial',
        color: LABEL_COLOR
      });
      text.setOrigin(0.5);
      container.add(text);
      container.setData('text', text);

      const zone = this.scene.add.zone(buttonWidth / 2, 15, buttonWidth, 30);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        this.setTroopCount(value);
        this.updateUI();
      });
      container.add(zone);

      container.setData('width', buttonWidth);
      this.contentContainer.add(container);
    });
  }

  private createEquipmentSection(): void {
    const startY = 200;

    const label = this.scene.add.text(PADDING, startY, 'Equipment Level:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(label);

    this.createEquipmentButtons(startY + 25);
  }

  private createEquipmentButtons(y: number): void {
    const levels = [
      { level: EquipmentLevel.Basic, label: 'Basic' },
      { level: EquipmentLevel.Standard, label: 'Standard' },
      { level: EquipmentLevel.Advanced, label: 'Advanced' }
    ];
    const buttonWidth = (PANEL_WIDTH - PADDING * 2 - 20) / 3;

    levels.forEach((item, index) => {
      const x = PADDING + index * (buttonWidth + 10);
      const container = this.scene.add.container(x, y);

      const bg = this.scene.add.graphics();
      bg.fillStyle(0x3a4a5a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, 30, 4);
      container.add(bg);
      container.setData('bg', bg);
      container.setData('level', item.level);

      const text = this.scene.add.text(buttonWidth / 2, 15, item.label, {
        fontSize: '11px',
        fontFamily: 'Arial',
        color: LABEL_COLOR
      });
      text.setOrigin(0.5);
      container.add(text);
      container.setData('text', text);

      const zone = this.scene.add.zone(buttonWidth / 2, 15, buttonWidth, 30);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        this.setEquipmentLevel(item.level);
        this.updateUI();
      });
      container.add(zone);

      container.setData('width', buttonWidth);
      this.contentContainer.add(container);
    });
  }

  private createWeaponSection(): void {
    const startY = 270;

    const label = this.scene.add.text(PADDING, startY, 'Weapon Level:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(label);

    this.createWeaponButtons(startY + 25);
  }

  private createWeaponButtons(y: number): void {
    const levels = [
      { level: WeaponLevel.Pistol, label: 'Pistol' },
      { level: WeaponLevel.Rifle, label: 'Rifle' },
      { level: WeaponLevel.AssaultRifle, label: 'Assault' },
      { level: WeaponLevel.Plasma, label: 'Plasma' }
    ];
    const buttonWidth = (PANEL_WIDTH - PADDING * 2 - 30) / 4;

    levels.forEach((item, index) => {
      const x = PADDING + index * (buttonWidth + 10);
      const container = this.scene.add.container(x, y);

      const bg = this.scene.add.graphics();
      bg.fillStyle(0x3a4a5a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, 30, 4);
      container.add(bg);
      container.setData('bg', bg);
      container.setData('level', item.level);

      const text = this.scene.add.text(buttonWidth / 2, 15, item.label, {
        fontSize: '11px',
        fontFamily: 'Arial',
        color: LABEL_COLOR
      });
      text.setOrigin(0.5);
      container.add(text);
      container.setData('text', text);

      const zone = this.scene.add.zone(buttonWidth / 2, 15, buttonWidth, 30);
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        this.setWeaponLevel(item.level);
        this.updateUI();
      });
      container.add(zone);

      container.setData('width', buttonWidth);
      this.contentContainer.add(container);
    });
  }

  private createPreviewSection(): void {
    const startY = 340;

    const costLabel = this.scene.add.text(PADDING, startY, 'Total Cost:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(costLabel);

    this.costText = this.scene.add.text(PADDING, startY + 22, '', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.costText);

    const strengthLabel = this.scene.add.text(PADDING, startY + 55, 'Estimated Strength:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(strengthLabel);

    this.strengthText = this.scene.add.text(PADDING, startY + 77, '', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.strengthText);
  }

  private createCommissionButton(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 10;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    this.commissionButton = this.scene.add.container(PADDING, buttonY - PADDING);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x44aa44, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    this.commissionButton.add(bg);
    this.commissionButton.setData('bg', bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, '✓ COMMISSION PLATOON', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);
    this.commissionButton.add(text);
    this.commissionButton.setData('text', text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.confirmCommission());
    this.commissionButton.add(zone);
    this.commissionButton.setData('width', buttonWidth);

    this.contentContainer.add(this.commissionButton);
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
      color: '#999999'
    });
    closeText.setOrigin(0.5);
    closeContainer.add(closeText);

    touchZone.on('pointerdown', () => this.hide());
    touchZone.on('pointerover', () => closeText.setColor('#ffffff'));
    touchZone.on('pointerout', () => closeText.setColor('#999999'));

    this.contentContainer.add(closeContainer);
  }

  public show(planet: PlanetEntity, onClose?: () => void, platoonCount: number = 0): void {
    if (this.isVisible) return;

    this.planet = planet;
    this.closeCallback = onClose || null;
    this.platoonCount = platoonCount;

    // Reset to defaults
    this.troopCount = 100;
    this.equipmentLevel = EquipmentLevel.Basic;
    this.weaponLevel = WeaponLevel.Rifle;

    this.isVisible = true;
    this.setVisible(true);
    this.backdrop.setVisible(true);

    const camera = this.scene.cameras.main;
    this.setPosition(
      (camera.width - PANEL_WIDTH) / 2,
      (camera.height - PANEL_HEIGHT) / 2
    );

    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 100,
      ease: 'Power2'
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
      }
    });
  }

  public getIsVisible(): boolean {
    return this.isVisible;
  }

  public getPlanet(): PlanetEntity | null {
    return this.planet;
  }

  public getTroopCount(): number {
    return this.troopCount;
  }

  public setTroopCount(value: number): void {
    this.troopCount = Math.max(1, Math.min(200, value));
  }

  public getEquipmentLevel(): EquipmentLevel {
    return this.equipmentLevel;
  }

  public setEquipmentLevel(level: EquipmentLevel): void {
    this.equipmentLevel = level;
  }

  public getWeaponLevel(): WeaponLevel {
    return this.weaponLevel;
  }

  public setWeaponLevel(level: WeaponLevel): void {
    this.weaponLevel = level;
  }

  public getTotalCost(): number {
    return PlatoonCosts.getTotalCost(this.equipmentLevel, this.weaponLevel);
  }

  public getEstimatedStrength(): number {
    return PlatoonModifiers.calculateMilitaryStrength(
      this.troopCount,
      this.equipmentLevel,
      this.weaponLevel,
      100 // Assume fully trained for preview
    );
  }

  public getPlatoonCount(): number {
    return this.platoonCount;
  }

  public getMaxPlatoonCapacity(): number {
    return MAX_PLATOONS_PER_PLANET;
  }

  public getPopulationAfterCommission(): number {
    if (!this.planet) return 0;
    return this.planet.population - this.troopCount;
  }

  public isAtCapacity(): boolean {
    return this.platoonCount >= MAX_PLATOONS_PER_PLANET;
  }

  public isCommissionEnabled(): boolean {
    if (!this.planet) return false;
    if (this.isAtCapacity()) return false;

    const cost = this.getTotalCost();
    const hasCredits = this.planet.resources.credits >= cost;
    const hasPopulation = this.planet.population >= this.troopCount;

    return hasCredits && hasPopulation;
  }

  public confirmCommission(): void {
    if (!this.planet || !this.isCommissionEnabled()) return;

    // If PlatoonSystem is provided, use it directly
    if (this.platoonSystem) {
      const result = this.platoonSystem.commissionPlatoon(
        this.planet.id,
        FactionType.Player,
        this.troopCount,
        this.equipmentLevel,
        this.weaponLevel
      );
      this.lastCommissionResult = result;

      // Only close if commission succeeded
      if (result >= 0) {
        this.hide();
      }
      return;
    }

    // Legacy callback pattern (backwards compatibility)
    if (this.onCommission) {
      this.onCommission(this.planet, this.troopCount, this.equipmentLevel, this.weaponLevel);
    }

    this.hide();
  }

  public getLastCommissionResult(): number {
    return this.lastCommissionResult;
  }

  private updateUI(): void {
    this.updatePlanetInfo();
    this.updateTroopCountDisplay();
    this.updateCostDisplay();
    this.updateStrengthDisplay();
    this.updateButtonState();
  }

  private updatePlanetInfo(): void {
    if (!this.planet) return;

    const popAfter = this.getPopulationAfterCommission();
    this.planetInfoText.setText(
      `${this.planet.name}\n` +
      `Platoons: ${this.platoonCount}/${MAX_PLATOONS_PER_PLANET}\n` +
      `Population: ${this.planet.population.toLocaleString()} → ${popAfter.toLocaleString()}`
    );
  }

  private updateTroopCountDisplay(): void {
    this.troopCountText.setText(`${this.troopCount} troops`);
  }

  private updateCostDisplay(): void {
    const cost = this.getTotalCost();
    this.costText.setText(`${cost.toLocaleString()} Credits`);

    if (!this.planet) return;

    const canAfford = this.planet.resources.credits >= cost;
    this.costText.setColor(canAfford ? TEXT_COLOR : ERROR_COLOR);
  }

  private updateStrengthDisplay(): void {
    const strength = this.getEstimatedStrength();
    this.strengthText.setText(strength.toLocaleString());
  }

  private updateButtonState(): void {
    const enabled = this.isCommissionEnabled();
    const bg = this.commissionButton.getData('bg') as Phaser.GameObjects.Graphics;
    const text = this.commissionButton.getData('text') as Phaser.GameObjects.Text;
    const width = this.commissionButton.getData('width') as number;

    bg.clear();
    bg.fillStyle(enabled ? 0x44aa44 : 0x4a4a4a, 1);
    bg.fillRoundedRect(0, 0, width, BUTTON_HEIGHT, 6);

    text.setColor(enabled ? TEXT_COLOR : DISABLED_COLOR);
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
