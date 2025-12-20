/**
 * PlatoonLoadingPanel - UI panel for loading/unloading platoons onto spacecraft
 *
 * Story 5-4: Loading Platoons onto Battle Cruisers
 *
 * Features:
 * - Shows cargo status (X/4 platoons loaded)
 * - Dual-list layout: Available on Planet | Loaded on Cruiser
 * - Load/Unload buttons per platoon
 * - Validates cargo capacity
 */

import Phaser from 'phaser';
import type { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { PlatoonEntity } from '@core/models/PlatoonEntity';
import { EquipmentLevel, WeaponLevel } from '@core/models/Enums';
import { CraftSystem } from '@core/CraftSystem';
import { COLORS as THEME_COLORS, TEXT_COLORS, FONTS } from '@config/UITheme';

// Panel dimensions and styling
const PANEL_WIDTH = 600;
const PANEL_HEIGHT = 480;
const PADDING = 20;
const LIST_WIDTH = 260;
const BUTTON_HEIGHT = 28;

// Colors - use theme
const BG_COLOR = THEME_COLORS.PANEL_BG;
const BORDER_COLOR = THEME_COLORS.BORDER_PRIMARY;
const TEXT_COLOR = TEXT_COLORS.PRIMARY;
const LABEL_COLOR = TEXT_COLORS.SECONDARY;
const SUCCESS_COLOR = TEXT_COLORS.SUCCESS;
const WARNING_COLOR = TEXT_COLORS.WARNING;

// Max cargo capacity
const MAX_CARGO_CAPACITY = 4;

export class PlatoonLoadingPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private craft: CraftEntity | null = null;
  private allPlatoons: PlatoonEntity[] = [];
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;
  private craftSystem: CraftSystem | null = null;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private cargoStatusText!: Phaser.GameObjects.Text;
  private availableListContainer!: Phaser.GameObjects.Container;
  private loadedListContainer!: Phaser.GameObjects.Container;
  private availableEmptyText!: Phaser.GameObjects.Text;
  private loadedEmptyText!: Phaser.GameObjects.Text;

  // Callbacks
  public onLoad?: (craftID: number, platoonID: number) => void;
  public onUnload?: (craftID: number, platoonID: number) => void;

  constructor(scene: Phaser.Scene, craftSystem?: CraftSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);

    if (craftSystem) {
      this.craftSystem = craftSystem;
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
    this.titleText = this.scene.add.text(PADDING, PADDING, 'Platoon Loading', {
      fontSize: '20px',
      fontFamily: FONTS.PRIMARY,
      color: SUCCESS_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.titleText);

    // Cargo status display
    this.cargoStatusText = this.scene.add.text(PADDING, 50, 'Cargo: 0/4 platoons', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.cargoStatusText);

    // Available platoons section (left side)
    const availableLabel = this.scene.add.text(PADDING, 80, 'Available on Planet', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(availableLabel);

    this.availableListContainer = this.scene.add.container(PADDING, 105);
    this.contentContainer.add(this.availableListContainer);

    this.availableEmptyText = this.scene.add.text(PADDING, 110, 'No platoons available', {
      fontSize: '12px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
      fontStyle: 'italic',
    });
    this.availableEmptyText.setVisible(false);
    this.contentContainer.add(this.availableEmptyText);

    // Loaded platoons section (right side)
    const loadedLabel = this.scene.add.text(PADDING + LIST_WIDTH + 20, 80, 'Loaded on Cruiser', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(loadedLabel);

    this.loadedListContainer = this.scene.add.container(PADDING + LIST_WIDTH + 20, 105);
    this.contentContainer.add(this.loadedListContainer);

    this.loadedEmptyText = this.scene.add.text(PADDING + LIST_WIDTH + 20, 110, 'No platoons loaded', {
      fontSize: '12px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
      fontStyle: 'italic',
    });
    this.loadedEmptyText.setVisible(false);
    this.contentContainer.add(this.loadedEmptyText);

    // Create close button
    this.createCloseButton();
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
      fontFamily: FONTS.PRIMARY,
      color: '#999999',
    });
    closeText.setOrigin(0.5);
    closeContainer.add(closeText);

    touchZone.on('pointerdown', () => this.hide());
    touchZone.on('pointerover', () => closeText.setColor('#ffffff'));
    touchZone.on('pointerout', () => closeText.setColor('#999999'));

    this.contentContainer.add(closeContainer);
  }

  public show(craft: CraftEntity, _planet: PlanetEntity, platoons: PlatoonEntity[], onClose?: () => void): void {
    if (this.isVisible) {return;}

    this.craft = craft;
    this.allPlatoons = platoons;
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
    if (!this.isVisible) {return;}

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

  public getCargoCount(): number {
    return this.craft?.carriedPlatoonIDs.length || 0;
  }

  public getMaxCapacity(): number {
    return MAX_CARGO_CAPACITY;
  }

  public isCargoBayFull(): boolean {
    return this.getCargoCount() >= MAX_CARGO_CAPACITY;
  }

  public getAvailablePlatoons(): PlatoonEntity[] {
    if (!this.craft) {return [];}
    return this.allPlatoons.filter(p =>
      !this.craft!.carriedPlatoonIDs.includes(p.id) && p.planetID >= 0,
    );
  }

  public getLoadedPlatoons(): PlatoonEntity[] {
    if (!this.craft) {return [];}
    return this.allPlatoons.filter(p =>
      this.craft!.carriedPlatoonIDs.includes(p.id),
    );
  }

  public hasAvailablePlatoons(): boolean {
    return this.getAvailablePlatoons().length > 0;
  }

  public hasLoadedPlatoons(): boolean {
    return this.getLoadedPlatoons().length > 0;
  }

  public getPlatoonTroopCount(platoon: PlatoonEntity): number {
    return platoon.troopCount;
  }

  public getPlatoonEquipment(platoon: PlatoonEntity): EquipmentLevel {
    return platoon.equipment;
  }

  public getPlatoonWeapon(platoon: PlatoonEntity): WeaponLevel {
    return platoon.weapon;
  }

  public handleLoad(platoonID: number): void {
    if (!this.craft || this.isCargoBayFull()) {return;}

    const platoon = this.allPlatoons.find(p => p.id === platoonID);
    if (!platoon || this.craft.carriedPlatoonIDs.includes(platoonID)) {return;}

    // If CraftSystem is provided, call it directly
    if (this.craftSystem) {
      const result = this.craftSystem.embarkPlatoons(this.craft.id, [platoonID]);
      if (result) {
        this.updateUI();
      }
    }

    // Fire callback for external handling
    if (this.onLoad) {
      this.onLoad(this.craft.id, platoonID);
    }
  }

  public handleUnload(platoonID: number): void {
    if (!this.craft) {return;}

    if (!this.craft.carriedPlatoonIDs.includes(platoonID)) {return;}

    // If CraftSystem is provided, call it directly
    if (this.craftSystem) {
      const result = this.craftSystem.disembarkPlatoons(this.craft.id, [platoonID]);
      if (result) {
        this.updateUI();
      }
    }

    // Fire callback for external handling
    if (this.onUnload) {
      this.onUnload(this.craft.id, platoonID);
    }
  }

  public refresh(craft: CraftEntity, platoons: PlatoonEntity[]): void {
    this.craft = craft;
    this.allPlatoons = platoons;
    this.updateUI();
  }

  private updateUI(): void {
    if (!this.craft) {return;}

    // Update cargo status
    const cargoCount = this.getCargoCount();
    this.cargoStatusText.setText(`Cargo: ${cargoCount}/${MAX_CARGO_CAPACITY} platoons`);
    this.cargoStatusText.setColor(this.isCargoBayFull() ? WARNING_COLOR : LABEL_COLOR);

    // Update lists
    this.updateAvailableList();
    this.updateLoadedList();
  }

  private updateAvailableList(): void {
    this.availableListContainer.removeAll(true);

    const available = this.getAvailablePlatoons();
    this.availableEmptyText.setVisible(available.length === 0);

    available.forEach((platoon, index) => {
      const y = index * 70;
      this.createPlatoonEntry(platoon, y, 'load', this.availableListContainer);
    });
  }

  private updateLoadedList(): void {
    this.loadedListContainer.removeAll(true);

    const loaded = this.getLoadedPlatoons();
    this.loadedEmptyText.setVisible(loaded.length === 0);

    loaded.forEach((platoon, index) => {
      const y = index * 70;
      this.createPlatoonEntry(platoon, y, 'unload', this.loadedListContainer);
    });
  }

  private createPlatoonEntry(platoon: PlatoonEntity, y: number, action: 'load' | 'unload', container: Phaser.GameObjects.Container): void {
    const entryWidth = LIST_WIDTH - 10;

    // Entry background
    const entryBg = this.scene.add.graphics();
    entryBg.fillStyle(0x2a3a4a, 1);
    entryBg.fillRoundedRect(0, y, entryWidth, 60, 4);
    container.add(entryBg);

    // Platoon name
    const nameText = this.scene.add.text(8, y + 6, platoon.name || `Platoon ${platoon.id}`, {
      fontSize: '13px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    container.add(nameText);

    // Troop count
    const troopText = this.scene.add.text(8, y + 24, `${platoon.troopCount} troops`, {
      fontSize: '11px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
    });
    container.add(troopText);

    // Equipment/Weapon
    const equipText = this.scene.add.text(8, y + 40, `${platoon.equipment} / ${platoon.weapon}`, {
      fontSize: '10px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
    });
    container.add(equipText);

    // Action button
    const buttonX = entryWidth - 60;
    const buttonY = y + 15;
    const buttonLabel = action === 'load' ? 'Load' : 'Unload';
    const canAct = action === 'load' ? !this.isCargoBayFull() : true;

    const buttonBg = this.scene.add.graphics();
    buttonBg.fillStyle(canAct ? 0x4488ff : 0x333333, 1);
    buttonBg.fillRoundedRect(buttonX, buttonY, 50, BUTTON_HEIGHT, 4);
    container.add(buttonBg);

    const buttonText = this.scene.add.text(buttonX + 25, buttonY + BUTTON_HEIGHT / 2, buttonLabel, {
      fontSize: '11px',
      fontFamily: FONTS.PRIMARY,
      color: canAct ? TEXT_COLOR : '#666666',
    });
    buttonText.setOrigin(0.5);
    container.add(buttonText);

    const zone = this.scene.add.zone(buttonX + 25, buttonY + BUTTON_HEIGHT / 2, 50, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: canAct });
    container.add(zone);

    if (canAct) {
      zone.on('pointerdown', () => {
        if (action === 'load') {
          this.handleLoad(platoon.id);
        } else {
          this.handleUnload(platoon.id);
        }
      });
      zone.on('pointerover', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x5599ff, 1);
        buttonBg.fillRoundedRect(buttonX, buttonY, 50, BUTTON_HEIGHT, 4);
      });
      zone.on('pointerout', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x4488ff, 1);
        buttonBg.fillRoundedRect(buttonX, buttonY, 50, BUTTON_HEIGHT, 4);
      });
    }
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
