/**
 * SpacecraftPurchasePanel - UI panel for purchasing spacecraft
 *
 * Story 5-3: Spacecraft Purchase and Types
 *
 * Features:
 * - Shows available spacecraft types (BattleCruiser, CargoCruiser, SolarSatellite, AtmosphereProcessor)
 * - Displays costs and capabilities for each type
 * - Validates affordability based on planet resources and population
 * - Handles purchase action through callback
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftType, FactionType } from '@core/models/Enums';
import { CraftCosts, CraftCrewRequirements, CraftSpecs } from '@core/models/CraftModels';
import { ResourceCost } from '@core/models/ResourceModels';
import { CraftSystem } from '@core/CraftSystem';

// Panel dimensions and styling
const PANEL_WIDTH = 480;
const PANEL_HEIGHT = 520;
const PADDING = 20;
const CARD_HEIGHT = 90;
const BUTTON_HEIGHT = 32;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const SUCCESS_COLOR = '#44aa44';
const WARNING_COLOR = '#ff9900';
const DISABLED_COLOR = '#666666';

// Fleet limit constant
const MAX_FLEET_LIMIT = 32;

export class SpacecraftPurchasePanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private planet: PlanetEntity | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;
  private craftSystem: CraftSystem | null = null;
  private fleetCount: number = 0;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private fleetCountText!: Phaser.GameObjects.Text;
  private craftCardsContainer!: Phaser.GameObjects.Container;

  // Available craft types
  private readonly availableCraftTypes: CraftType[] = [
    CraftType.BattleCruiser,
    CraftType.CargoCruiser,
    CraftType.SolarSatellite,
    CraftType.AtmosphereProcessor
  ];

  // Callbacks
  public onPurchase?: (craftType: CraftType) => void;
  public onNavigateRequest?: (craftID: number) => void;

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
    this.titleText = this.scene.add.text(PADDING, PADDING, 'Purchase Spacecraft', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.titleText);

    // Fleet count display
    this.fleetCountText = this.scene.add.text(PADDING, 50, 'Fleet: 0/32', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(this.fleetCountText);

    // Craft cards container
    this.craftCardsContainer = this.scene.add.container(PADDING, 75);
    this.contentContainer.add(this.craftCardsContainer);

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

  public show(planet: PlanetEntity, onClose?: () => void, currentFleetCount?: number): void {
    if (this.isVisible) return;

    this.planet = planet;
    this.closeCallback = onClose || null;
    this.fleetCount = currentFleetCount ?? 0;

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

  public getAvailableCraftTypes(): CraftType[] {
    return [...this.availableCraftTypes];
  }

  public getCraftCost(craftType: CraftType): ResourceCost {
    return CraftCosts.getCost(craftType);
  }

  public getCrewRequired(craftType: CraftType): number {
    return CraftCrewRequirements.getCrewRequired(craftType);
  }

  public getPlatoonCapacity(craftType: CraftType): number {
    const specs = CraftSpecs.getSpecs(craftType);
    return specs.platoonCapacity;
  }

  public getFleetCount(): number {
    return this.fleetCount;
  }

  public getMaxFleetLimit(): number {
    return MAX_FLEET_LIMIT;
  }

  public canAfford(craftType: CraftType): boolean {
    if (!this.planet) return false;

    // Check fleet limit
    if (this.fleetCount >= MAX_FLEET_LIMIT) return false;

    // Check resources
    const cost = CraftCosts.getCost(craftType);
    if (!this.planet.resources.canAfford(cost)) return false;

    // Check crew requirements
    const crewRequired = CraftCrewRequirements.getCrewRequired(craftType);
    if (this.planet.population < crewRequired) return false;

    return true;
  }

  public handlePurchase(craftType: CraftType): void {
    if (!this.planet || !this.canAfford(craftType)) return;

    // If CraftSystem is provided, call it directly
    if (this.craftSystem) {
      const result = this.craftSystem.purchaseCraft(craftType, this.planet.id, FactionType.Player);
      if (result > 0) {
        this.fleetCount++;
        this.updateUI();
      }
    }

    // Fire callback for external handling
    if (this.onPurchase) {
      this.onPurchase(craftType);
    }
  }

  private updateUI(): void {
    // Update fleet count display
    this.fleetCountText.setText(`Fleet: ${this.fleetCount}/${MAX_FLEET_LIMIT}`);
    this.fleetCountText.setColor(this.fleetCount >= MAX_FLEET_LIMIT ? WARNING_COLOR : LABEL_COLOR);

    // Update craft cards
    this.updateCraftCards();
  }

  private updateCraftCards(): void {
    // Clear existing cards
    this.craftCardsContainer.removeAll(true);

    if (!this.planet) return;

    // Create card for each craft type
    this.availableCraftTypes.forEach((craftType, index) => {
      const y = index * (CARD_HEIGHT + 10);
      this.createCraftCard(craftType, y);
    });
  }

  private createCraftCard(craftType: CraftType, y: number): void {
    const cardWidth = PANEL_WIDTH - PADDING * 2 - 20;
    const canAfford = this.canAfford(craftType);

    // Card background
    const cardBg = this.scene.add.graphics();
    cardBg.fillStyle(canAfford ? 0x2a3a4a : 0x1a2030, 1);
    cardBg.fillRoundedRect(0, y, cardWidth, CARD_HEIGHT, 6);
    this.craftCardsContainer.add(cardBg);

    // Craft name
    const nameText = this.scene.add.text(10, y + 8, this.getCraftDisplayName(craftType), {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.craftCardsContainer.add(nameText);

    // Cost display
    const cost = CraftCosts.getCost(craftType);
    const costText = this.scene.add.text(10, y + 28,
      `Cost: ${cost.credits.toLocaleString()}cr, ${cost.minerals.toLocaleString()}min, ${cost.fuel.toLocaleString()}fuel`, {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: canAfford ? LABEL_COLOR : WARNING_COLOR
    });
    this.craftCardsContainer.add(costText);

    // Crew requirement
    const crew = CraftCrewRequirements.getCrewRequired(craftType);
    const crewText = this.scene.add.text(10, y + 44, `Crew: ${crew} population`, {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: this.planet && this.planet.population >= crew ? LABEL_COLOR : WARNING_COLOR
    });
    this.craftCardsContainer.add(crewText);

    // Capabilities
    const capText = this.scene.add.text(10, y + 60, this.getCraftCapabilities(craftType), {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR
    });
    this.craftCardsContainer.add(capText);

    // Purchase button
    const buttonX = cardWidth - 90;
    const buttonY = y + (CARD_HEIGHT - BUTTON_HEIGHT) / 2;
    this.createPurchaseButton(craftType, buttonX, buttonY, canAfford);
  }

  private createPurchaseButton(craftType: CraftType, x: number, y: number, enabled: boolean): void {
    const buttonWidth = 80;

    const buttonBg = this.scene.add.graphics();
    buttonBg.fillStyle(enabled ? 0x4488ff : 0x333333, 1);
    buttonBg.fillRoundedRect(x, y, buttonWidth, BUTTON_HEIGHT, 4);
    this.craftCardsContainer.add(buttonBg);

    const buttonText = this.scene.add.text(x + buttonWidth / 2, y + BUTTON_HEIGHT / 2, 'Purchase', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: enabled ? TEXT_COLOR : DISABLED_COLOR
    });
    buttonText.setOrigin(0.5);
    this.craftCardsContainer.add(buttonText);

    const zone = this.scene.add.zone(x + buttonWidth / 2, y + BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: enabled });
    this.craftCardsContainer.add(zone);

    if (enabled) {
      zone.on('pointerdown', () => this.handlePurchase(craftType));
      zone.on('pointerover', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x5599ff, 1);
        buttonBg.fillRoundedRect(x, y, buttonWidth, BUTTON_HEIGHT, 4);
      });
      zone.on('pointerout', () => {
        buttonBg.clear();
        buttonBg.fillStyle(0x4488ff, 1);
        buttonBg.fillRoundedRect(x, y, buttonWidth, BUTTON_HEIGHT, 4);
      });
    }
  }

  private getCraftDisplayName(craftType: CraftType): string {
    switch (craftType) {
      case CraftType.BattleCruiser: return 'Battle Cruiser';
      case CraftType.CargoCruiser: return 'Cargo Cruiser';
      case CraftType.SolarSatellite: return 'Solar Satellite';
      case CraftType.AtmosphereProcessor: return 'Atmosphere Processor';
      default: return String(craftType);
    }
  }

  private getCraftCapabilities(craftType: CraftType): string {
    const specs = CraftSpecs.getSpecs(craftType);
    switch (craftType) {
      case CraftType.BattleCruiser:
        return `Combat vessel, carries ${specs.platoonCapacity} platoons`;
      case CraftType.CargoCruiser:
        return `Transport, ${specs.cargoCapacity} cargo capacity`;
      case CraftType.SolarSatellite:
        return `Generates ${specs.energyProduction} energy/turn`;
      case CraftType.AtmosphereProcessor:
        return `Terraforming (${specs.terraformingDuration} turns)`;
      default:
        return '';
    }
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
