/**
 * PlanetInfoPanel - Displays detailed planet information when a planet is selected
 *
 * Features:
 * - Shows planet name, type, owner with color coding
 * - Displays population and morale stats
 * - Shows resource income for player-owned planets
 * - Provides action buttons (disabled for Epic 4/5/6 integration)
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { FactionType, BuildingType, BuildingStatus } from '@core/models/Enums';
import { BuildingCosts, Structure } from '@core/models/BuildingModels';
import { BuildingSystem } from '@core/BuildingSystem';
import { OWNER_COLORS } from '../../config/VisualConfig';

// Panel dimensions and styling
const PANEL_WIDTH = 280;
const PANEL_HEIGHT = 500; // Increased for construction section + platoons button
const PADDING = 15;
const HEADER_HEIGHT = 60;
const BUTTON_HEIGHT = 36;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_WIDTH = 3;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const DISABLED_COLOR = '#666666';

export class PlanetInfoPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private planet: PlanetEntity | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;
  private backdrop!: Phaser.GameObjects.Rectangle; // Fullscreen backdrop for click-outside-to-close

  // Text elements for updating
  private nameText!: Phaser.GameObjects.Text;
  private typeText!: Phaser.GameObjects.Text;
  private ownerText!: Phaser.GameObjects.Text;
  private populationText!: Phaser.GameObjects.Text;
  private moraleText!: Phaser.GameObjects.Text;
  private resourceTexts: Phaser.GameObjects.Text[] = [];
  private actionButtons: Phaser.GameObjects.Container[] = [];

  // Construction progress elements (Story 4-3)
  private constructionContainer!: Phaser.GameObjects.Container;
  private constructionText!: Phaser.GameObjects.Text;
  private constructionProgressBar!: Phaser.GameObjects.Graphics;
  private constructionTurnsText!: Phaser.GameObjects.Text;
  private buildingSystem?: BuildingSystem;

  // Action callbacks (Story 4-2, Story 5-1, Story 5-2, Story 5-3, Story 5-5)
  public onBuildClick?: (planet: PlanetEntity) => void;
  public onCommissionClick?: (planet: PlanetEntity) => void;
  public onPlatoonsClick?: (planet: PlanetEntity) => void;
  public onSpacecraftClick?: (planet: PlanetEntity) => void;
  public onNavigateClick?: (planet: PlanetEntity) => void;

  constructor(scene: Phaser.Scene, buildingSystem?: BuildingSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.buildingSystem = buildingSystem;

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1000); // Above all game elements
    this.setScrollFactor(0); // Fixed to camera
  }

  /**
   * Sets the BuildingSystem reference for construction progress tracking (Story 4-3)
   */
  public setBuildingSystem(buildingSystem: BuildingSystem): void {
    this.buildingSystem = buildingSystem;
  }

  /**
   * Creates a fullscreen backdrop for click-outside-to-close functionality (AC5)
   */
  private createBackdrop(): void {
    const camera = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setInteractive({ useHandCursor: false });
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(999); // Just below panel
    this.backdrop.setVisible(false);

    // Click on backdrop closes panel (AC5 requirement)
    this.backdrop.on('pointerdown', () => this.hide());
  }

  /**
   * Creates the panel structure with all UI elements
   */
  private createPanel(): void {
    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.95);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);

    // Border (will be colored by owner)
    this.borderGraphics = this.scene.add.graphics();
    this.add(this.borderGraphics);

    // Content container
    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Create header section
    this.createHeader();

    // Create stats section
    this.createStatsSection();

    // Create resource section
    this.createResourceSection();

    // Create construction progress section (Story 4-3)
    this.createConstructionSection();

    // Create action buttons
    this.createActionButtons();

    // Create close button
    this.createCloseButton();
  }

  private createHeader(): void {
    // Planet name
    this.nameText = this.scene.add.text(0, 0, 'Planet Name', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(this.nameText);

    // Planet type
    this.typeText = this.scene.add.text(0, 26, 'Type: Unknown', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(this.typeText);

    // Owner indicator
    this.ownerText = this.scene.add.text(0, 44, 'Owner: Unknown', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(this.ownerText);
  }

  private createStatsSection(): void {
    const startY = HEADER_HEIGHT + 10;

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(0, startY - 5, PANEL_WIDTH - PADDING * 2, startY - 5);
    this.contentContainer.add(divider);

    // Stats header
    const statsLabel = this.scene.add.text(0, startY, 'Stats', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(statsLabel);

    // Population
    this.populationText = this.scene.add.text(0, startY + 22, 'Population: 0 / 0', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(this.populationText);

    // Morale
    this.moraleText = this.scene.add.text(0, startY + 44, 'Morale: 0%', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.contentContainer.add(this.moraleText);
  }

  private createResourceSection(): void {
    const startY = HEADER_HEIGHT + 85;

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(0, startY - 5, PANEL_WIDTH - PADDING * 2, startY - 5);
    this.contentContainer.add(divider);

    // Resources header
    const resourcesLabel = this.scene.add.text(0, startY, 'Resources (stockpile)', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(resourcesLabel);

    // Resource types with colors
    const resources = [
      { name: 'Credits', color: '#ffd700' },
      { name: 'Minerals', color: '#c0c0c0' },
      { name: 'Fuel', color: '#ff6600' },
      { name: 'Food', color: '#00cc00' },
      { name: 'Energy', color: '#00ccff' }
    ];

    resources.forEach((res, i) => {
      const text = this.scene.add.text(0, startY + 22 + i * 18, `${res.name}: ---`, {
        fontSize: '12px',
        fontFamily: 'Arial',
        color: res.color
      });
      this.contentContainer.add(text);
      this.resourceTexts.push(text);
    });
  }

  /**
   * Creates the construction progress section (Story 4-3)
   * Shows: building name, progress bar, turns remaining
   */
  private createConstructionSection(): void {
    const startY = HEADER_HEIGHT + 195;

    // Container for construction elements (shown/hidden based on construction state)
    this.constructionContainer = this.scene.add.container(0, startY);
    this.contentContainer.add(this.constructionContainer);

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(0, -5, PANEL_WIDTH - PADDING * 2, -5);
    this.constructionContainer.add(divider);

    // Section header
    const headerText = this.scene.add.text(0, 0, 'Construction', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.constructionContainer.add(headerText);

    // Building name under construction
    this.constructionText = this.scene.add.text(0, 22, 'Building: None', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ff9900' // Orange for construction
    });
    this.constructionContainer.add(this.constructionText);

    // Progress bar background
    const progressBarBg = this.scene.add.graphics();
    progressBarBg.fillStyle(0x333333, 1);
    progressBarBg.fillRoundedRect(0, 42, PANEL_WIDTH - PADDING * 2, 16, 4);
    this.constructionContainer.add(progressBarBg);

    // Progress bar fill
    this.constructionProgressBar = this.scene.add.graphics();
    this.constructionContainer.add(this.constructionProgressBar);

    // Turns remaining text
    this.constructionTurnsText = this.scene.add.text(0, 62, 'Completes in: 0 turns', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: LABEL_COLOR
    });
    this.constructionContainer.add(this.constructionTurnsText);

    // Initially hidden
    this.constructionContainer.setVisible(false);
  }

  private createActionButtons(): void {
    const startY = HEADER_HEIGHT + 280; // Pushed down to accommodate construction section

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(0, startY - 5, PANEL_WIDTH - PADDING * 2, startY - 5);
    this.contentContainer.add(divider);

    // Actions header
    const actionsLabel = this.scene.add.text(0, startY, 'Actions', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold'
    });
    this.contentContainer.add(actionsLabel);

    // Create placeholder buttons (will be updated based on planet owner in show())
    // Actual enabled/disabled state is set when the panel is shown
    const buttonY = startY + 25;
    this.createButton('Build', 0, buttonY, true, 'Open building construction menu');
    this.createButton('Commission', 125, buttonY, true, 'Commission platoon (Story 5-1)');
    this.createButton('Platoons', 0, buttonY + 42, true, 'View garrisoned platoons (Story 5-2)');
    this.createButton('Spacecraft', 125, buttonY + 42, true, 'Purchase spacecraft (Story 5-3)');
    this.createButton('Navigate', 0, buttonY + 84, true, 'Navigate spacecraft (Story 5-5)');
    this.createButton('Invade', 125, buttonY + 84, true, 'Coming in Epic 6');
  }

  private createButton(
    label: string,
    x: number,
    y: number,
    disabled: boolean,
    tooltip: string,
    onClick?: () => void
  ): void {
    const buttonWidth = 115;
    const buttonContainer = this.scene.add.container(x, y);

    // Button background
    const bg = this.scene.add.graphics();
    bg.fillStyle(disabled ? 0x333333 : 0x4a4a6a, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 4);
    buttonContainer.add(bg);

    // Button text
    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, label, {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: disabled ? DISABLED_COLOR : TEXT_COLOR
    });
    text.setOrigin(0.5);
    buttonContainer.add(text);

    // Interactive zone
    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: !disabled });
    buttonContainer.add(zone);

    // Add click handler if provided and not disabled
    if (!disabled && onClick) {
      zone.on('pointerdown', onClick);
      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(0x5a5a7a, 1);
        bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 4);
      });
      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(0x4a4a6a, 1);
        bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 4);
      });
    }

    // Store tooltip for future use
    buttonContainer.setData('tooltip', tooltip);
    buttonContainer.setData('disabled', disabled);
    buttonContainer.setData('label', label);

    this.contentContainer.add(buttonContainer);
    this.actionButtons.push(buttonContainer);
  }

  private createCloseButton(): void {
    const closeX = PANEL_WIDTH - 25;
    const closeY = 15;
    const MIN_TOUCH_TARGET = 44; // WCAG 2.1 minimum touch target size

    // Container for close button with proper touch target
    const closeContainer = this.scene.add.container(closeX, closeY);

    // Invisible zone for 44x44px touch target (accessibility requirement)
    const touchZone = this.scene.add.zone(0, 0, MIN_TOUCH_TARGET, MIN_TOUCH_TARGET);
    touchZone.setInteractive({ useHandCursor: true });
    closeContainer.add(touchZone);

    // Visible X text
    const closeText = this.scene.add.text(0, 0, '×', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#888888'
    });
    closeText.setOrigin(0.5);
    closeContainer.add(closeText);

    // Event handlers on the touch zone
    touchZone.on('pointerover', () => closeText.setColor('#ffffff'));
    touchZone.on('pointerout', () => closeText.setColor('#888888'));
    touchZone.on('pointerdown', () => this.hide());

    this.add(closeContainer);
  }

  /**
   * Updates the panel to display information for the given planet
   */
  public setPlanet(planet: PlanetEntity): void {
    this.planet = planet;
    this.updateContent();
  }

  /**
   * Updates all panel content based on current planet
   */
  private updateContent(): void {
    if (!this.planet) return;

    const isPlayerOwned = this.planet.owner === FactionType.Player;

    // Update header
    this.nameText.setText(this.planet.name);
    this.typeText.setText(`Type: ${this.planet.type}`);

    // Update owner with color
    const ownerColorHex = this.getOwnerColorHex(this.planet.owner);
    this.ownerText.setText(`Owner: ${this.planet.owner}`);
    this.ownerText.setColor(ownerColorHex);

    // Update border color
    const ownerColor = OWNER_COLORS[this.planet.owner] || OWNER_COLORS.Neutral;
    this.borderGraphics.clear();
    this.borderGraphics.lineStyle(BORDER_WIDTH, ownerColor, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);

    // Update stats
    this.populationText.setText(
      `Population: ${this.planet.population.toLocaleString()}`
    );

    const moraleColor = this.getMoraleColor(this.planet.morale);
    this.moraleText.setText(`Morale: ${this.planet.morale}%`);
    this.moraleText.setColor(moraleColor);

    // Update resources (only show for player-owned planets)
    // Shows current stockpile from planet.resources
    const resources = [
      this.planet.resources.credits,
      this.planet.resources.minerals,
      this.planet.resources.fuel,
      this.planet.resources.food,
      this.planet.resources.energy
    ];

    this.resourceTexts.forEach((text, i) => {
      const resourceNames = ['Credits', 'Minerals', 'Fuel', 'Food', 'Energy'];
      if (isPlayerOwned) {
        text.setText(`${resourceNames[i]}: ${resources[i].toLocaleString()}`);
      } else {
        text.setText(`${resourceNames[i]}: Unknown`);
      }
    });

    // Update construction progress (Story 4-3)
    this.updateConstructionProgress(isPlayerOwned);

    // Update button visibility/states based on ownership
    this.updateButtonStates(isPlayerOwned);
  }

  /**
   * Updates the construction progress section (Story 4-3)
   * AC1: Shows "Under Construction: [Building Name]", progress bar, estimated completion
   */
  private updateConstructionProgress(isPlayerOwned: boolean): void {
    if (!isPlayerOwned || !this.planet) {
      this.constructionContainer.setVisible(false);
      return;
    }

    // Get buildings under construction from BuildingSystem or planet structures
    let underConstruction: Structure[] = [];

    if (this.buildingSystem) {
      underConstruction = this.buildingSystem.getBuildingsUnderConstruction(this.planet.id);
    } else {
      // Fallback: check planet structures directly
      underConstruction = this.planet.structures.filter(
        s => s.status === BuildingStatus.UnderConstruction
      );
    }

    if (underConstruction.length === 0) {
      this.constructionContainer.setVisible(false);
      return;
    }

    // Show construction section
    this.constructionContainer.setVisible(true);

    // Display first building under construction
    const building = underConstruction[0];
    const buildingName = this.getBuildingDisplayName(building.type);
    const totalTurns = BuildingCosts.getConstructionTime(building.type);
    const turnsCompleted = totalTurns - building.turnsRemaining;
    const percentComplete = (turnsCompleted / totalTurns) * 100;

    // Update building name text
    this.constructionText.setText(`Under Construction: ${buildingName}`);

    // Update progress bar
    const barWidth = PANEL_WIDTH - PADDING * 2;
    const fillWidth = (percentComplete / 100) * barWidth;

    this.constructionProgressBar.clear();
    if (fillWidth > 0) {
      this.constructionProgressBar.fillStyle(0x00cc00, 1); // Green for progress
      this.constructionProgressBar.fillRoundedRect(0, 42, fillWidth, 16, 4);
    }

    // Update turns remaining text
    const turnsText = building.turnsRemaining === 1
      ? 'Completes in: 1 turn'
      : `Completes in: ${building.turnsRemaining} turns`;
    this.constructionTurnsText.setText(`${turnsText} (Turn ${turnsCompleted + 1} of ${totalTurns})`);
  }

  /**
   * Gets display name for a building type
   */
  private getBuildingDisplayName(type: BuildingType): string {
    switch (type) {
      case BuildingType.MiningStation: return 'Mining Station';
      case BuildingType.HorticulturalStation: return 'Horticultural Station';
      case BuildingType.DockingBay: return 'Docking Bay';
      case BuildingType.OrbitalDefense: return 'Orbital Defense';
      case BuildingType.SurfacePlatform: return 'Surface Platform';
      default: return String(type);
    }
  }

  private updateButtonStates(isPlayerOwned: boolean): void {
    // Buttons 0-4 are for player (Build, Commission, Platoons, Spacecraft, Navigate)
    // Button 5 is for AI/Neutral (Invade)
    this.actionButtons.forEach((button, i) => {
      const label = button.getData('label');

      if (isPlayerOwned) {
        button.setVisible(i < 5); // Show Build, Commission, Platoons, Spacecraft, Navigate

        // Enable Build button for player-owned planets (Story 4-2)
        if (label === 'Build') {
          this.enableButton(button, () => {
            if (this.planet && this.onBuildClick) {
              this.onBuildClick(this.planet);
            }
          });
        }

        // Enable Commission button for player-owned planets (Story 5-1)
        if (label === 'Commission') {
          this.enableButton(button, () => {
            if (this.planet && this.onCommissionClick) {
              this.onCommissionClick(this.planet);
            }
          });
        }

        // Enable Platoons button for player-owned planets (Story 5-2)
        if (label === 'Platoons') {
          this.enableButton(button, () => {
            if (this.planet && this.onPlatoonsClick) {
              this.onPlatoonsClick(this.planet);
            }
          });
        }

        // Enable Spacecraft button for player-owned planets (Story 5-3)
        if (label === 'Spacecraft') {
          this.enableButton(button, () => {
            if (this.planet && this.onSpacecraftClick) {
              this.onSpacecraftClick(this.planet);
            }
          });
        }

        // Enable Navigate button for player-owned planets (Story 5-5)
        if (label === 'Navigate') {
          this.enableButton(button, () => {
            if (this.planet && this.onNavigateClick) {
              this.onNavigateClick(this.planet);
            }
          });
        }
      } else {
        button.setVisible(i >= 5); // Show Invade only
      }
    });
  }

  /**
   * Enables a button and sets up its click handler
   */
  private enableButton(buttonContainer: Phaser.GameObjects.Container, onClick: () => void): void {
    const buttonWidth = 115;
    const children = buttonContainer.getAll();

    // Find the background graphics
    const bg = children.find(c => c instanceof Phaser.GameObjects.Graphics) as Phaser.GameObjects.Graphics | undefined;
    // Find the text
    const text = children.find(c => c instanceof Phaser.GameObjects.Text) as Phaser.GameObjects.Text | undefined;
    // Find the zone
    const zone = children.find(c => c instanceof Phaser.GameObjects.Zone) as Phaser.GameObjects.Zone | undefined;

    if (!bg || !text || !zone) return;

    // Update appearance to enabled state
    bg.clear();
    bg.fillStyle(0x4a4a6a, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 4);
    text.setColor(TEXT_COLOR);

    // Remove old listeners and add new ones
    zone.removeAllListeners();
    zone.setInteractive({ useHandCursor: true });

    zone.on('pointerdown', onClick);
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x5a5a7a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 4);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x4a4a6a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 4);
    });

    buttonContainer.setData('disabled', false);
  }

  private getOwnerColorHex(owner: FactionType): string {
    switch (owner) {
      case FactionType.Player: return '#00ff00';
      case FactionType.AI: return '#ff0000';
      case FactionType.Neutral: return '#808080';
      default: return '#ffffff';
    }
  }

  private getMoraleColor(morale: number): string {
    if (morale >= 70) return '#00cc00'; // Green - happy
    if (morale >= 40) return '#cccc00'; // Yellow - neutral
    return '#cc0000'; // Red - unhappy
  }

  /**
   * Shows the panel with animation (100ms per NFR-P3)
   */
  public show(onClose?: () => void): void {
    if (this.isVisible) return;

    this.closeCallback = onClose || null;
    this.isVisible = true;
    this.setVisible(true);
    this.backdrop.setVisible(true); // Show backdrop for click-outside-to-close

    // Position on right side of screen
    const camera = this.scene.cameras.main;
    this.setPosition(
      camera.width - PANEL_WIDTH - 20,
      (camera.height - PANEL_HEIGHT) / 2
    );

    // Animate in from right (100ms per NFR-P3 requirement)
    this.setAlpha(0);
    this.x += 50;
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      x: camera.width - PANEL_WIDTH - 20,
      duration: 100,
      ease: 'Power2'
    });
  }

  /**
   * Hides the panel with animation (100ms per NFR-P3)
   */
  public hide(): void {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.backdrop.setVisible(false); // Hide backdrop

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      x: this.x + 50,
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

  /**
   * Returns whether the panel is currently visible
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Cleans up the panel
   */
  public destroy(): void {
    // Stop any running tweens to prevent memory leaks
    this.scene.tweens.killTweensOf(this);
    this.resourceTexts = [];
    this.actionButtons = [];
    if (this.backdrop) {
      this.backdrop.destroy();
    }
    super.destroy();
  }
}
