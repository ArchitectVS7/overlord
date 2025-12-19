/**
 * CargoLoadingPanel - UI panel for loading/unloading resources onto cargo cruisers
 *
 * Features:
 * - Shows cargo cruiser capacity (1,000 of each resource)
 * - Allows loading resources from planet to ship
 * - Allows unloading resources from ship to planet
 * - Real-time validation of capacity limits
 * - Transfer confirmation
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { CraftType } from '@core/models/Enums';

// Panel dimensions and styling
const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 420;
const PADDING = 20;
const BUTTON_HEIGHT = 32;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0xffa500; // Orange for cargo
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const SUCCESS_COLOR = '#44aa44';
const WARNING_COLOR = '#ff9900';
const DISABLED_COLOR = '#666666';

// Cargo capacity per resource type
const CARGO_CAPACITY = 1000;

// Resource types for cargo
const RESOURCE_TYPES = ['credits', 'minerals', 'fuel'] as const;
type ResourceType = typeof RESOURCE_TYPES[number];

export class CargoLoadingPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private craft: CraftEntity | null = null;
  private planet: PlanetEntity | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;

  // Transfer amounts (positive = load onto ship, negative = unload)
  private transferAmounts: Record<ResourceType, number> = {
    credits: 0,
    minerals: 0,
    fuel: 0,
  };

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private capacityText!: Phaser.GameObjects.Text;
  private resourceRows: Map<ResourceType, {
    planetText: Phaser.GameObjects.Text;
    shipText: Phaser.GameObjects.Text;
    transferText: Phaser.GameObjects.Text;
    loadButton: Phaser.GameObjects.Container;
    unloadButton: Phaser.GameObjects.Container;
  }> = new Map();
  private confirmButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onTransferComplete?: (
    craftID: number,
    planetID: number,
    credits: number,
    minerals: number,
    fuel: number
  ) => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

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
    this.titleText = this.scene.add.text(PADDING, PADDING, '📦 Cargo Transfer', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: WARNING_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.titleText);

    // Capacity display
    this.capacityText = this.scene.add.text(PADDING, 50, 'Capacity: 1,000 per resource', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.capacityText);

    // Create resource rows
    this.createResourceSection();

    // Create confirm button
    this.createConfirmButton();

    // Create close button
    this.createCloseButton();
  }

  private createResourceSection(): void {
    const startY = 90;

    // Header row
    const headerY = startY;
    const headers = [
      { text: 'Resource', x: PADDING },
      { text: 'Planet', x: 120 },
      { text: 'Ship', x: 200 },
      { text: 'Transfer', x: 280 },
      { text: 'Actions', x: 370 },
    ];

    headers.forEach(h => {
      const text = this.scene.add.text(h.x, headerY, h.text, {
        fontSize: '12px',
        fontFamily: 'Arial',
        color: TEXT_COLOR,
        fontStyle: 'bold',
      });
      this.contentContainer.add(text);
    });

    // Divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(PADDING, headerY + 20, PANEL_WIDTH - PADDING, headerY + 20);
    this.contentContainer.add(divider);

    // Resource rows
    const resourceConfig: { type: ResourceType; name: string; color: string }[] = [
      { type: 'credits', name: 'Credits', color: '#ffd700' },
      { type: 'minerals', name: 'Minerals', color: '#c0c0c0' },
      { type: 'fuel', name: 'Fuel', color: '#ff6600' },
    ];

    resourceConfig.forEach((res, index) => {
      const rowY = startY + 35 + index * 60;
      this.createResourceRow(res.type, res.name, res.color, rowY);
    });
  }

  private createResourceRow(type: ResourceType, name: string, color: string, y: number): void {
    // Resource name
    const nameText = this.scene.add.text(PADDING, y, name, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: color,
      fontStyle: 'bold',
    });
    this.contentContainer.add(nameText);

    // Planet amount
    const planetText = this.scene.add.text(120, y, '0', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(planetText);

    // Ship amount
    const shipText = this.scene.add.text(200, y, '0/1000', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(shipText);

    // Transfer amount
    const transferText = this.scene.add.text(280, y, '0', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR,
    });
    this.contentContainer.add(transferText);

    // Load button (100)
    const loadButton = this.createTransferButton(370, y - 5, '+100', () => {
      this.adjustTransfer(type, 100);
    });

    // Unload button (-100)
    const unloadButton = this.createTransferButton(420, y - 5, '-100', () => {
      this.adjustTransfer(type, -100);
    });

    // Quick load all button
    const loadAllButton = this.createTransferButton(370, y + 20, 'All→', () => {
      this.loadMax(type);
    }, 40);

    // Quick unload all button
    const unloadAllButton = this.createTransferButton(420, y + 20, '←All', () => {
      this.unloadMax(type);
    }, 40);

    this.resourceRows.set(type, {
      planetText,
      shipText,
      transferText,
      loadButton,
      unloadButton,
    });
  }

  private createTransferButton(
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    width: number = 42,
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x4488ff, 1);
    bg.fillRoundedRect(0, 0, width, 22, 4);
    container.add(bg);
    container.setData('bg', bg);

    const text = this.scene.add.text(width / 2, 11, label, {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    text.setOrigin(0.5);
    container.add(text);

    const zone = this.scene.add.zone(width / 2, 11, width, 22);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', onClick);
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x5599ff, 1);
      bg.fillRoundedRect(0, 0, width, 22, 4);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x4488ff, 1);
      bg.fillRoundedRect(0, 0, width, 22, 4);
    });
    container.add(zone);

    this.contentContainer.add(container);
    return container;
  }

  private createConfirmButton(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 10;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    this.confirmButton = this.scene.add.container(PADDING, buttonY - PADDING);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x44aa44, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    this.confirmButton.add(bg);
    this.confirmButton.setData('bg', bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, '✓ CONFIRM TRANSFER', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.confirmButton.add(text);
    this.confirmButton.setData('text', text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.confirmTransfer());
    this.confirmButton.add(zone);
    this.confirmButton.setData('width', buttonWidth);

    this.contentContainer.add(this.confirmButton);
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

  public show(craft: CraftEntity, planet: PlanetEntity, onClose?: () => void): void {
    if (this.isVisible) return;
    if (craft.type !== CraftType.CargoCruiser) {
      console.warn('CargoLoadingPanel: Can only be used with Cargo Cruisers');
      return;
    }

    this.craft = craft;
    this.planet = planet;
    this.closeCallback = onClose || null;

    // Reset transfer amounts
    this.transferAmounts = { credits: 0, minerals: 0, fuel: 0 };

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

  private adjustTransfer(type: ResourceType, amount: number): void {
    if (!this.craft || !this.planet) return;

    const currentTransfer = this.transferAmounts[type];
    let newTransfer = currentTransfer + amount;

    // Get current amounts
    const planetAmount = this.getPlanetResource(type);
    const shipAmount = this.getShipCargo(type);

    // Validate loading (positive transfer)
    if (newTransfer > 0) {
      // Can't load more than planet has
      newTransfer = Math.min(newTransfer, planetAmount);
      // Can't exceed ship capacity
      newTransfer = Math.min(newTransfer, CARGO_CAPACITY - shipAmount);
    }
    // Validate unloading (negative transfer)
    else if (newTransfer < 0) {
      // Can't unload more than ship has
      newTransfer = Math.max(newTransfer, -shipAmount);
    }

    this.transferAmounts[type] = newTransfer;
    this.updateUI();
  }

  private loadMax(type: ResourceType): void {
    if (!this.craft || !this.planet) return;

    const planetAmount = this.getPlanetResource(type);
    const shipAmount = this.getShipCargo(type);
    const availableCapacity = CARGO_CAPACITY - shipAmount;

    this.transferAmounts[type] = Math.min(planetAmount, availableCapacity);
    this.updateUI();
  }

  private unloadMax(type: ResourceType): void {
    if (!this.craft || !this.planet) return;

    const shipAmount = this.getShipCargo(type);
    this.transferAmounts[type] = -shipAmount;
    this.updateUI();
  }

  private getPlanetResource(type: ResourceType): number {
    if (!this.planet) return 0;
    return this.planet.resources[type];
  }

  private getShipCargo(type: ResourceType): number {
    if (!this.craft) return 0;
    switch (type) {
      case 'credits': return this.craft.cargoCredits;
      case 'minerals': return this.craft.cargoMinerals;
      case 'fuel': return this.craft.cargoFuel;
      default: return 0;
    }
  }

  private updateUI(): void {
    if (!this.craft || !this.planet) return;

    // Update each resource row
    for (const type of RESOURCE_TYPES) {
      const row = this.resourceRows.get(type);
      if (!row) continue;

      const planetAmount = this.getPlanetResource(type);
      const shipAmount = this.getShipCargo(type);
      const transfer = this.transferAmounts[type];

      // Planet amount (after transfer)
      const planetAfter = planetAmount - transfer;
      row.planetText.setText(`${planetAfter.toLocaleString()}`);
      row.planetText.setColor(transfer > 0 ? WARNING_COLOR : LABEL_COLOR);

      // Ship amount (after transfer)
      const shipAfter = shipAmount + transfer;
      row.shipText.setText(`${shipAfter.toLocaleString()}/${CARGO_CAPACITY}`);
      row.shipText.setColor(shipAfter >= CARGO_CAPACITY ? WARNING_COLOR : LABEL_COLOR);

      // Transfer amount
      const transferPrefix = transfer > 0 ? '+' : '';
      row.transferText.setText(`${transferPrefix}${transfer.toLocaleString()}`);
      row.transferText.setColor(transfer === 0 ? LABEL_COLOR : (transfer > 0 ? SUCCESS_COLOR : '#ff6666'));
    }

    // Update confirm button state
    this.updateConfirmButton();
  }

  private updateConfirmButton(): void {
    const hasTransfer = Object.values(this.transferAmounts).some(v => v !== 0);
    const bg = this.confirmButton.getData('bg') as Phaser.GameObjects.Graphics;
    const text = this.confirmButton.getData('text') as Phaser.GameObjects.Text;
    const width = this.confirmButton.getData('width') as number;

    bg.clear();
    bg.fillStyle(hasTransfer ? 0x44aa44 : 0x4a4a4a, 1);
    bg.fillRoundedRect(0, 0, width, BUTTON_HEIGHT, 6);

    text.setColor(hasTransfer ? TEXT_COLOR : DISABLED_COLOR);
  }

  private confirmTransfer(): void {
    if (!this.craft || !this.planet) return;

    const hasTransfer = Object.values(this.transferAmounts).some(v => v !== 0);
    if (!hasTransfer) return;

    // Apply transfers to planet
    this.planet.resources.credits -= this.transferAmounts.credits;
    this.planet.resources.minerals -= this.transferAmounts.minerals;
    this.planet.resources.fuel -= this.transferAmounts.fuel;

    // Apply transfers to ship
    this.craft.cargoCredits += this.transferAmounts.credits;
    this.craft.cargoMinerals += this.transferAmounts.minerals;
    this.craft.cargoFuel += this.transferAmounts.fuel;

    // Fire callback
    if (this.onTransferComplete) {
      this.onTransferComplete(
        this.craft.id,
        this.planet.id,
        this.transferAmounts.credits,
        this.transferAmounts.minerals,
        this.transferAmounts.fuel,
      );
    }

    this.hide();
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
