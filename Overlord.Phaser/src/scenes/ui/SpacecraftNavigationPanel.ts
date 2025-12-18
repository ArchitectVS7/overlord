/**
 * SpacecraftNavigationPanel - UI panel for navigating spacecraft between planets
 *
 * Story 5-5: Spacecraft Navigation Between Planets
 *
 * Features:
 * - Shows current location and available destinations
 * - Displays fuel cost (10 per jump) and travel time (instant)
 * - Validates fuel availability
 * - Handles navigation through callback
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { NavigationSystem } from '@core/NavigationSystem';

// Panel dimensions and styling
const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 450;
const PADDING = 20;
const BUTTON_HEIGHT = 36;
const DESTINATION_ITEM_HEIGHT = 40;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const SUCCESS_COLOR = '#44aa44';
const WARNING_COLOR = '#ff9900';
const SELECTED_COLOR = 0x3a5a7a;
const DISABLED_COLOR = '#666666';

// Fuel cost per jump (from NavigationSystem)
const FUEL_COST_PER_JUMP = 10;

export class SpacecraftNavigationPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private craft: CraftEntity | null = null;
  private planets: PlanetEntity[] = [];
  private selectedDestinationId: number | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;
  private navigationSystem: NavigationSystem | null = null;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private currentLocationText!: Phaser.GameObjects.Text;
  private fuelStatusText!: Phaser.GameObjects.Text;
  private fuelCostText!: Phaser.GameObjects.Text;
  private travelTimeText!: Phaser.GameObjects.Text;
  private destinationListContainer!: Phaser.GameObjects.Container;
  private navigateButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onNavigate?: (craftID: number, destinationPlanetID: number) => void;

  constructor(scene: Phaser.Scene, navigationSystem?: NavigationSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);

    if (navigationSystem) {
      this.navigationSystem = navigationSystem;
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
    this.titleText = this.scene.add.text(PADDING, PADDING, 'Navigate Spacecraft', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: SUCCESS_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.titleText);

    // Current location
    this.currentLocationText = this.scene.add.text(PADDING, 50, 'Currently at: -', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.currentLocationText);

    // Fuel status
    this.fuelStatusText = this.scene.add.text(PADDING, 75, 'Fuel Available: -', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.fuelStatusText);

    // Navigation info section
    this.fuelCostText = this.scene.add.text(PANEL_WIDTH - PADDING - 150, 50, 'Fuel Cost: 10', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.fuelCostText);

    this.travelTimeText = this.scene.add.text(PANEL_WIDTH - PADDING - 150, 70, 'Travel Time: Instant', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.travelTimeText);

    // Destinations section header
    const destLabel = this.scene.add.text(PADDING, 105, 'Select Destination', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(destLabel);

    // Destination list container
    this.destinationListContainer = this.scene.add.container(PADDING, 130);
    this.contentContainer.add(this.destinationListContainer);

    // Navigate button
    this.createNavigateButton();

    // Close button
    this.createCloseButton();
  }

  private createNavigateButton(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 10;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    this.navigateButton = this.scene.add.container(PADDING, buttonY - PADDING);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x4488ff, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    this.navigateButton.add(bg);
    this.navigateButton.setData('bg', bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, 'NAVIGATE', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.navigateButton.add(text);
    this.navigateButton.setData('text', text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.handleNavigate());
    this.navigateButton.add(zone);
    this.navigateButton.setData('width', buttonWidth);
    this.navigateButton.setData('zone', zone);

    this.contentContainer.add(this.navigateButton);
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

  public show(craft: CraftEntity, planets: PlanetEntity[], onClose?: () => void): void {
    if (this.isVisible) {return;}

    this.craft = craft;
    this.planets = planets;
    this.selectedDestinationId = null;
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

  public getCurrentPlanetName(): string {
    if (!this.craft) {return '';}
    const planet = this.planets.find(p => p.id === this.craft!.planetID);
    return planet?.name || '';
  }

  public getAvailableDestinations(): PlanetEntity[] {
    if (!this.craft) {return [];}
    return this.planets.filter(p => p.id !== this.craft!.planetID);
  }

  public selectDestination(planetID: number): void {
    if (!this.craft) {return;}
    if (planetID === this.craft.planetID) {return;}

    const planet = this.planets.find(p => p.id === planetID);
    if (planet) {
      this.selectedDestinationId = planetID;
      this.updateUI();
    }
  }

  public getSelectedDestination(): number | null {
    return this.selectedDestinationId;
  }

  public getFuelCost(): number {
    return FUEL_COST_PER_JUMP;
  }

  public getTravelTime(): string {
    return 'Instant';
  }

  public hasEnoughFuel(): boolean {
    return this.getCurrentFuel() >= FUEL_COST_PER_JUMP;
  }

  public getCurrentFuel(): number {
    if (!this.craft) {return 0;}
    const planet = this.planets.find(p => p.id === this.craft!.planetID);
    return planet?.resources.fuel || 0;
  }

  public isDestinationReachable(planetID: number): boolean {
    return this.hasEnoughFuel() && planetID !== this.craft?.planetID;
  }

  public handleNavigate(): void {
    if (!this.craft || !this.selectedDestinationId || !this.hasEnoughFuel()) {return;}

    // If NavigationSystem is provided, call it directly
    if (this.navigationSystem) {
      const result = this.navigationSystem.moveShip(this.craft.id, this.selectedDestinationId);
      if (result) {
        // Navigation succeeded
        this.hide();
      }
    }

    // Fire callback for external handling
    if (this.onNavigate) {
      this.onNavigate(this.craft.id, this.selectedDestinationId);
    }
  }

  private updateUI(): void {
    if (!this.craft) {return;}

    // Update current location
    this.currentLocationText.setText(`Currently at: ${this.getCurrentPlanetName()}`);

    // Update fuel status
    const currentFuel = this.getCurrentFuel();
    this.fuelStatusText.setText(`Fuel Available: ${currentFuel}`);
    this.fuelStatusText.setColor(this.hasEnoughFuel() ? LABEL_COLOR : WARNING_COLOR);

    // Update destination list
    this.updateDestinationList();

    // Update navigate button state
    this.updateNavigateButton();
  }

  private updateDestinationList(): void {
    this.destinationListContainer.removeAll(true);

    const destinations = this.getAvailableDestinations();
    const hasEnoughFuel = this.hasEnoughFuel();

    destinations.forEach((planet, index) => {
      const y = index * (DESTINATION_ITEM_HEIGHT + 5);
      const isSelected = planet.id === this.selectedDestinationId;
      const isReachable = hasEnoughFuel;

      // Entry background
      const entryBg = this.scene.add.graphics();
      entryBg.fillStyle(isSelected ? SELECTED_COLOR : 0x2a3a4a, isReachable ? 1 : 0.5);
      entryBg.fillRoundedRect(0, y, PANEL_WIDTH - PADDING * 2 - 20, DESTINATION_ITEM_HEIGHT, 4);
      this.destinationListContainer.add(entryBg);

      // Planet name
      const nameText = this.scene.add.text(10, y + 10, planet.name, {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: isReachable ? TEXT_COLOR : DISABLED_COLOR,
        fontStyle: isSelected ? 'bold' : 'normal',
      });
      this.destinationListContainer.add(nameText);

      // Owner indicator
      const ownerText = this.scene.add.text(PANEL_WIDTH - PADDING * 2 - 100, y + 10, this.getOwnerLabel(planet), {
        fontSize: '12px',
        fontFamily: 'Arial',
        color: isReachable ? LABEL_COLOR : DISABLED_COLOR,
      });
      this.destinationListContainer.add(ownerText);

      // Clickable zone
      if (isReachable) {
        const zone = this.scene.add.zone(
          (PANEL_WIDTH - PADDING * 2 - 20) / 2,
          y + DESTINATION_ITEM_HEIGHT / 2,
          PANEL_WIDTH - PADDING * 2 - 20,
          DESTINATION_ITEM_HEIGHT,
        );
        zone.setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => this.selectDestination(planet.id));
        this.destinationListContainer.add(zone);
      }
    });
  }

  private getOwnerLabel(planet: PlanetEntity): string {
    switch (planet.owner) {
      case 'Player': return 'Your Planet';
      case 'AI': return 'Enemy';
      case 'Neutral': return 'Neutral';
      default: return '';
    }
  }

  private updateNavigateButton(): void {
    const buttonWidth = this.navigateButton.getData('width') as number;
    const bg = this.navigateButton.getData('bg') as Phaser.GameObjects.Graphics;
    const text = this.navigateButton.getData('text') as Phaser.GameObjects.Text;
    const zone = this.navigateButton.getData('zone') as Phaser.GameObjects.Zone;

    const canNavigate = this.selectedDestinationId !== null && this.hasEnoughFuel();

    bg.clear();
    bg.fillStyle(canNavigate ? 0x4488ff : 0x333333, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);

    text.setColor(canNavigate ? TEXT_COLOR : DISABLED_COLOR);
    zone.setInteractive({ useHandCursor: canNavigate });
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
