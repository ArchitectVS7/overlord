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
import { TaxationSystem } from '@core/TaxationSystem';
import { OWNER_COLORS } from '../../config/VisualConfig';
import { COLORS, TEXT_COLORS, FONTS, PANEL, RESOURCE_COLORS, BUTTON } from '@config/UITheme';

// Panel dimensions and styling
const PANEL_WIDTH = 280;
const PANEL_HEIGHT = 560; // Increased for construction section + platoons button + tax slider
const PADDING = PANEL.PADDING;
const HEADER_HEIGHT = 60;
const BUTTON_HEIGHT = BUTTON.HEIGHT;

export class PlanetInfoPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private planet: PlanetEntity | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;

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

  // Tax slider elements
  private taxContainer!: Phaser.GameObjects.Container;
  private taxRateText!: Phaser.GameObjects.Text;
  private taxRevenueText!: Phaser.GameObjects.Text;
  private taxWarningText!: Phaser.GameObjects.Text;
  private taxSliderThumb!: Phaser.GameObjects.Graphics;
  private taxationSystem?: TaxationSystem;
  private currentTaxRate: number = 50;

  // Action callbacks (Story 4-2, Story 5-1, Story 5-2, Story 5-3, Story 5-5, Story 6-1)
  public onBuildClick?: (planet: PlanetEntity) => void;
  public onCommissionClick?: (planet: PlanetEntity) => void;
  public onPlatoonsClick?: (planet: PlanetEntity) => void;
  public onSpacecraftClick?: (planet: PlanetEntity) => void;
  public onNavigateClick?: (planet: PlanetEntity) => void;
  public onInvadeClick?: (planet: PlanetEntity) => void;
  public onBombardClick?: (planet: PlanetEntity) => void;
  public onDeployProcessorClick?: (planet: PlanetEntity) => void;
  public onTaxRateChanged?: (planetID: number, newTaxRate: number) => void;

  // Flag to indicate if atmosphere processor is available at this planet
  private hasAtmosphereProcessor: boolean = false;

  constructor(scene: Phaser.Scene, buildingSystem?: BuildingSystem, taxationSystem?: TaxationSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);
    this.buildingSystem = buildingSystem;
    this.taxationSystem = taxationSystem;

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
   * Sets the TaxationSystem reference for tax rate management
   */
  public setTaxationSystem(taxationSystem: TaxationSystem): void {
    this.taxationSystem = taxationSystem;
  }

  /**
   * Sets up click-outside-to-close functionality (AC5) using scene-level input.
   * This approach avoids creating an interactive backdrop that could intercept
   * button clicks within the panel.
   */
  private createBackdrop(): void {
    // We'll use a scene-level pointerdown handler instead of a backdrop rectangle
    // This is set up in show() and cleaned up in hide()
  }

  /**
   * Handles scene-level pointer events for click-outside-to-close and button clicks.
   * Because the panel uses scrollFactor(0), zones inside nested containers don't receive
   * input correctly (Phaser converts screen coords to world coords for hit testing).
   * We handle all input at the scene level using screen coordinates directly.
   */
  private onScenePointerDown = (pointer: Phaser.Input.Pointer): void => {
    if (!this.isVisible) return;

    // Get pointer screen position
    const screenX = pointer.x;
    const screenY = pointer.y;

    // Check if click is inside the panel bounds
    const panelX = this.x;
    const panelY = this.y;
    const isInsidePanel = screenX >= panelX &&
                          screenX <= panelX + PANEL_WIDTH &&
                          screenY >= panelY &&
                          screenY <= panelY + PANEL_HEIGHT;

    if (!isInsidePanel) {
      console.log('CLICK OUTSIDE PANEL - closing');
      this.hide();
      return;
    }

    // Check if click is on a button
    const clickedButton = this.getClickedButton(screenX, screenY);
    if (clickedButton) {
      console.log('BUTTON CLICKED via scene handler:', clickedButton);
      this.handleButtonClick(clickedButton);
    }
  };

  /**
   * Determines which button (if any) was clicked at the given screen position
   */
  private getClickedButton(screenX: number, screenY: number): string | null {
    const panelX = this.x;
    const panelY = this.y;
    const buttonWidth = 115;
    const buttonHeight = BUTTON_HEIGHT;

    // Button positions relative to panel (content starts at PADDING)
    const startY = HEADER_HEIGHT + 370; // Must match createActionButtons
    const buttonConfigs = [
      { label: 'Build', x: 0, y: startY },
      { label: 'Commission', x: 125, y: startY },
      { label: 'Platoons', x: 0, y: startY + 42 },
      { label: 'Spacecraft', x: 125, y: startY + 42 },
      { label: 'Navigate', x: 0, y: startY + 84 },
      { label: 'Invade', x: 125, y: startY + 84 },
      { label: 'Bombard', x: 0, y: startY + 126 },
    ];

    for (const btn of buttonConfigs) {
      // Calculate button screen position
      const btnScreenX = panelX + PADDING + btn.x;
      const btnScreenY = panelY + PADDING + btn.y;

      // Check if click is within button bounds
      if (screenX >= btnScreenX && screenX <= btnScreenX + buttonWidth &&
          screenY >= btnScreenY && screenY <= btnScreenY + buttonHeight) {
        // Check if button is disabled
        const buttonContainer = this.actionButtons.find(b => b.getData('label') === btn.label);
        if (buttonContainer && !buttonContainer.getData('disabled') && buttonContainer.visible) {
          return btn.label;
        }
      }
    }

    // Check close button (at top-right)
    const closeX = panelX + PANEL_WIDTH - 25;
    const closeY = panelY + 15;
    const closeRadius = 22; // Half of 44px touch target
    const distToClose = Math.sqrt(Math.pow(screenX - closeX, 2) + Math.pow(screenY - closeY, 2));
    if (distToClose <= closeRadius) {
      return 'Close';
    }

    return null;
  }

  /**
   * Handles button click based on button label
   */
  private handleButtonClick(buttonLabel: string): void {
    if (!this.planet) return;

    switch (buttonLabel) {
      case 'Build':
        if (this.onBuildClick) this.onBuildClick(this.planet);
        break;
      case 'Commission':
        if (this.onCommissionClick) this.onCommissionClick(this.planet);
        break;
      case 'Platoons':
        if (this.onPlatoonsClick) this.onPlatoonsClick(this.planet);
        break;
      case 'Spacecraft':
        if (this.onSpacecraftClick) this.onSpacecraftClick(this.planet);
        break;
      case 'Navigate':
        if (this.onNavigateClick) this.onNavigateClick(this.planet);
        break;
      case 'Invade':
        if (this.onInvadeClick) this.onInvadeClick(this.planet);
        break;
      case 'Bombard':
        if (this.onBombardClick) this.onBombardClick(this.planet);
        break;
      case 'Close':
        this.hide();
        break;
    }
  }

  /**
   * Creates the panel structure with all UI elements
   */
  private createPanel(): void {
    // Hit blocker - prevents clicks from reaching the backdrop behind the panel
    // Must be added first (bottom of display list) so buttons render on top
    const hitBlocker = this.scene.add.rectangle(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 0x000000, 0);
    hitBlocker.setOrigin(0, 0);
    hitBlocker.setInteractive(); // Interactive but no handler - just blocks backdrop clicks
    this.add(hitBlocker);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(COLORS.PANEL_BG, PANEL.BG_ALPHA);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, PANEL.BORDER_RADIUS);
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

    // Create tax slider section
    this.createTaxSection();

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
      fontSize: FONTS.SIZE_HEADER,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.PRIMARY,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.nameText);

    // Planet type
    this.typeText = this.scene.add.text(0, 26, 'Type: Unknown', {
      fontSize: FONTS.SIZE_SMALL,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.SECONDARY,
    });
    this.contentContainer.add(this.typeText);

    // Owner indicator
    this.ownerText = this.scene.add.text(0, 44, 'Owner: Unknown', {
      fontSize: FONTS.SIZE_SMALL,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.SECONDARY,
    });
    this.contentContainer.add(this.ownerText);
  }

  private createStatsSection(): void {
    const startY = HEADER_HEIGHT + 10;

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, COLORS.DIVIDER, 1);
    divider.lineBetween(0, startY - 5, PANEL_WIDTH - PADDING * 2, startY - 5);
    this.contentContainer.add(divider);

    // Stats header
    const statsLabel = this.scene.add.text(0, startY, 'Stats', {
      fontSize: FONTS.SIZE_BODY,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.PRIMARY,
      fontStyle: 'bold',
    });
    this.contentContainer.add(statsLabel);

    // Population
    this.populationText = this.scene.add.text(0, startY + 22, 'Population: 0 / 0', {
      fontSize: FONTS.SIZE_SMALL,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.SECONDARY,
    });
    this.contentContainer.add(this.populationText);

    // Morale
    this.moraleText = this.scene.add.text(0, startY + 44, 'Morale: 0%', {
      fontSize: FONTS.SIZE_SMALL,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.SECONDARY,
    });
    this.contentContainer.add(this.moraleText);
  }

  private createResourceSection(): void {
    const startY = HEADER_HEIGHT + 85;

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, COLORS.DIVIDER, 1);
    divider.lineBetween(0, startY - 5, PANEL_WIDTH - PADDING * 2, startY - 5);
    this.contentContainer.add(divider);

    // Resources header
    const resourcesLabel = this.scene.add.text(0, startY, 'Resources (stockpile)', {
      fontSize: FONTS.SIZE_BODY,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.PRIMARY,
      fontStyle: 'bold',
    });
    this.contentContainer.add(resourcesLabel);

    // Resource types with colors (from centralized theme)
    const resources = [
      { name: 'Credits', color: RESOURCE_COLORS.credits },
      { name: 'Minerals', color: RESOURCE_COLORS.minerals },
      { name: 'Fuel', color: RESOURCE_COLORS.fuel },
      { name: 'Food', color: RESOURCE_COLORS.food },
      { name: 'Energy', color: RESOURCE_COLORS.energy },
    ];

    resources.forEach((res, i) => {
      const text = this.scene.add.text(0, startY + 22 + i * 18, `${res.name}: ---`, {
        fontSize: FONTS.SIZE_SMALL,
        fontFamily: FONTS.PRIMARY,
        color: res.color,
      });
      this.contentContainer.add(text);
      this.resourceTexts.push(text);
    });
  }

  /**
   * Creates the tax slider section for adjusting planet tax rate
   */
  private createTaxSection(): void {
    const startY = HEADER_HEIGHT + 195;

    // Container for tax elements (shown/hidden based on ownership)
    this.taxContainer = this.scene.add.container(0, startY);
    this.contentContainer.add(this.taxContainer);

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(0, -5, PANEL_WIDTH - PADDING * 2, -5);
    this.taxContainer.add(divider);

    // Section header
    const headerText = this.scene.add.text(0, 0, 'Tax Rate', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLORS.PRIMARY,
      fontStyle: 'bold',
    });
    this.taxContainer.add(headerText);

    // Tax rate display
    this.taxRateText = this.scene.add.text(0, 20, 'Rate: 50%', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ffd700',
    });
    this.taxContainer.add(this.taxRateText);

    // Tax slider track
    const sliderWidth = PANEL_WIDTH - PADDING * 2 - 20;
    const sliderY = 42;
    const track = this.scene.add.graphics();
    track.fillStyle(0x333333, 1);
    track.fillRoundedRect(0, sliderY, sliderWidth, 10, 5);
    this.taxContainer.add(track);

    // Slider thumb
    this.taxSliderThumb = this.scene.add.graphics();
    this.taxSliderThumb.fillStyle(0xffd700, 1);
    this.taxSliderThumb.fillCircle(0, 0, 8);
    this.taxSliderThumb.lineStyle(2, 0xffffff, 1);
    this.taxSliderThumb.strokeCircle(0, 0, 8);
    this.taxSliderThumb.setPosition(sliderWidth / 2, sliderY + 5);
    this.taxContainer.add(this.taxSliderThumb);

    // Make slider interactive
    const sliderZone = this.scene.add.zone(sliderWidth / 2, sliderY + 5, sliderWidth + 20, 30);
    sliderZone.setInteractive({ useHandCursor: true });
    this.taxContainer.add(sliderZone);

    sliderZone.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handleTaxSliderDrag(pointer, sliderWidth);
    });

    sliderZone.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        this.handleTaxSliderDrag(pointer, sliderWidth);
      }
    });

    // Estimated revenue text
    this.taxRevenueText = this.scene.add.text(0, 58, 'Revenue: 0 credits/turn', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: TEXT_COLORS.SECONDARY,
    });
    this.taxContainer.add(this.taxRevenueText);

    // Warning text for high taxes
    this.taxWarningText = this.scene.add.text(0, 73, '', {
      fontSize: '10px',
      fontFamily: 'Arial',
      color: '#ff6600',
      fontStyle: 'italic',
    });
    this.taxContainer.add(this.taxWarningText);

    // Initially hidden
    this.taxContainer.setVisible(false);
  }

  /**
   * Handles tax slider drag interaction
   */
  private handleTaxSliderDrag(pointer: Phaser.Input.Pointer, sliderWidth: number): void {
    if (!this.planet) return;

    // Calculate local X position within the tax container
    const containerWorldPos = this.taxContainer.getWorldTransformMatrix();
    const localX = pointer.x - this.x - PADDING - containerWorldPos.tx + this.x;

    // Calculate tax rate from slider position
    const normalizedX = Math.max(0, Math.min(sliderWidth, localX));
    const newTaxRate = Math.round((normalizedX / sliderWidth) * 100);

    this.currentTaxRate = newTaxRate;

    // Update slider thumb position
    this.taxSliderThumb.setPosition(normalizedX, 47);

    // Apply tax rate if TaxationSystem is available
    if (this.taxationSystem) {
      this.taxationSystem.setTaxRate(this.planet.id, newTaxRate);
    } else {
      // Update planet directly if no system
      this.planet.taxRate = newTaxRate;
    }

    // Update UI
    this.updateTaxSection(true);

    // Fire callback
    if (this.onTaxRateChanged) {
      this.onTaxRateChanged(this.planet.id, newTaxRate);
    }
  }

  /**
   * Creates the construction progress section (Story 4-3)
   * Shows: building name, progress bar, turns remaining
   */
  private createConstructionSection(): void {
    const startY = HEADER_HEIGHT + 285; // Pushed down for tax section

    // Container for construction elements (shown/hidden based on construction state)
    this.constructionContainer = this.scene.add.container(0, startY);
    this.contentContainer.add(this.constructionContainer);

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, COLORS.DIVIDER, 1);
    divider.lineBetween(0, -5, PANEL_WIDTH - PADDING * 2, -5);
    this.constructionContainer.add(divider);

    // Section header
    const headerText = this.scene.add.text(0, 0, 'Construction', {
      fontSize: FONTS.SIZE_BODY,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.PRIMARY,
      fontStyle: 'bold',
    });
    this.constructionContainer.add(headerText);

    // Building name under construction
    this.constructionText = this.scene.add.text(0, 22, 'Building: None', {
      fontSize: FONTS.SIZE_SMALL,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.WARNING, // Orange for construction
    });
    this.constructionContainer.add(this.constructionText);

    // Progress bar background
    const progressBarBg = this.scene.add.graphics();
    progressBarBg.fillStyle(COLORS.BUTTON_DISABLED, 1);
    progressBarBg.fillRoundedRect(0, 42, PANEL_WIDTH - PADDING * 2, 16, 4);
    this.constructionContainer.add(progressBarBg);

    // Progress bar fill
    this.constructionProgressBar = this.scene.add.graphics();
    this.constructionContainer.add(this.constructionProgressBar);

    // Turns remaining text
    this.constructionTurnsText = this.scene.add.text(0, 62, 'Completes in: 0 turns', {
      fontSize: FONTS.SIZE_TINY,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.SECONDARY,
    });
    this.constructionContainer.add(this.constructionTurnsText);

    // Initially hidden
    this.constructionContainer.setVisible(false);
  }

  private createActionButtons(): void {
    const startY = HEADER_HEIGHT + 370; // Pushed down to accommodate tax and construction sections

    // Section divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, COLORS.DIVIDER, 1);
    divider.lineBetween(0, startY - 5, PANEL_WIDTH - PADDING * 2, startY - 5);
    this.contentContainer.add(divider);

    // Actions header
    const actionsLabel = this.scene.add.text(0, startY, 'Actions', {
      fontSize: FONTS.SIZE_BODY,
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLORS.PRIMARY,
      fontStyle: 'bold',
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
    this.createButton('Invade', 125, buttonY + 84, true, 'Initiate planetary invasion');
    this.createButton('Bombard', 0, buttonY + 126, true, 'Orbital bombardment of enemy planet'); // index 6
    this.createButton('Deploy', 0, buttonY + 84, true, 'Deploy Atmosphere Processor to colonize'); // index 7
  }

  private createButton(
    label: string,
    x: number,
    y: number,
    disabled: boolean,
    tooltip: string,
    onClick?: () => void,
  ): void {
    const buttonWidth = 115;
    const buttonContainer = this.scene.add.container(x, y);

    // Button background
    const bg = this.scene.add.graphics();
    bg.fillStyle(disabled ? COLORS.BUTTON_DISABLED : COLORS.BUTTON_SECONDARY, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, BUTTON.BORDER_RADIUS);
    buttonContainer.add(bg);

    // Button text
    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, label, {
      fontSize: FONTS.SIZE_SMALL,
      fontFamily: FONTS.PRIMARY,
      color: disabled ? TEXT_COLORS.MUTED : TEXT_COLORS.PRIMARY,
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
      color: '#888888',
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
    if (!this.planet) {return;}

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
    this.borderGraphics.lineStyle(PANEL.BORDER_WIDTH, ownerColor, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, PANEL.BORDER_RADIUS);

    // Update stats
    this.populationText.setText(
      `Population: ${this.planet.population.toLocaleString()}`,
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
      this.planet.resources.energy,
    ];

    this.resourceTexts.forEach((text, i) => {
      const resourceNames = ['Credits', 'Minerals', 'Fuel', 'Food', 'Energy'];
      if (isPlayerOwned) {
        text.setText(`${resourceNames[i]}: ${resources[i].toLocaleString()}`);
      } else {
        text.setText(`${resourceNames[i]}: Unknown`);
      }
    });

    // Update tax section (only show for player-owned planets)
    this.updateTaxSection(isPlayerOwned);

    // Update construction progress (Story 4-3)
    this.updateConstructionProgress(isPlayerOwned);

    // Update button visibility/states based on ownership
    this.updateButtonStates(isPlayerOwned);
  }

  /**
   * Updates the tax rate section
   */
  private updateTaxSection(isPlayerOwned: boolean): void {
    if (!isPlayerOwned || !this.planet) {
      this.taxContainer.setVisible(false);
      return;
    }

    // Show tax section for player-owned planets
    this.taxContainer.setVisible(true);

    // Get current tax rate
    this.currentTaxRate = this.planet.taxRate;
    this.taxRateText.setText(`Rate: ${this.currentTaxRate}%`);

    // Update slider thumb position
    const sliderWidth = PANEL_WIDTH - PADDING * 2 - 20;
    const thumbX = (this.currentTaxRate / 100) * sliderWidth;
    this.taxSliderThumb.setPosition(thumbX, 47);

    // Calculate estimated revenue
    let estimatedRevenue = 0;
    if (this.taxationSystem) {
      estimatedRevenue = this.taxationSystem.getEstimatedRevenue(this.planet.id, this.currentTaxRate);
    } else {
      // Fallback calculation
      estimatedRevenue = Math.floor((this.planet.population / 10) * (this.currentTaxRate / 100));
    }
    this.taxRevenueText.setText(`Revenue: ~${estimatedRevenue.toLocaleString()} credits/turn`);

    // Show warning for high taxes
    if (this.currentTaxRate > 75) {
      this.taxWarningText.setText('⚠️ High taxes hurt morale! (-5/turn)');
      this.taxWarningText.setVisible(true);
    } else if (this.currentTaxRate < 25) {
      this.taxWarningText.setText('Low taxes boost morale (+2/turn)');
      this.taxWarningText.setColor('#44aa44');
      this.taxWarningText.setVisible(true);
    } else {
      this.taxWarningText.setVisible(false);
    }
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
        s => s.status === BuildingStatus.UnderConstruction,
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
    // Button 6 is for Neutral with Atmosphere Processor (Deploy)
    const isNeutral = this.planet?.owner === FactionType.Neutral;
    const isAI = this.planet?.owner === FactionType.AI;

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
      } else if (isNeutral) {
        // For neutral planets, show Deploy button if atmosphere processor is available
        if (label === 'Deploy') {
          button.setVisible(this.hasAtmosphereProcessor);
          if (this.hasAtmosphereProcessor) {
            this.enableButton(button, () => {
              if (this.planet && this.onDeployProcessorClick) {
                this.onDeployProcessorClick(this.planet);
              }
            });
          }
        } else {
          button.setVisible(false);
        }
      } else if (isAI) {
        // Show and enable Invade button for AI-owned planets (Story 6-1)
        if (label === 'Invade') {
          button.setVisible(true);
          this.enableButton(button, () => {
            if (this.planet && this.onInvadeClick) {
              this.onInvadeClick(this.planet);
            }
          });
        } else if (label === 'Bombard') {
          // Show and enable Bombard button for AI-owned planets (Story 6-4)
          button.setVisible(true);
          this.enableButton(button, () => {
            if (this.planet && this.onBombardClick) {
              this.onBombardClick(this.planet);
            }
          });
        } else {
          button.setVisible(false);
        }
      } else {
        button.setVisible(false);
      }
    });
  }

  /**
   * Sets whether an atmosphere processor is available at the current planet
   * Should be called by the scene when showing the panel for a neutral planet
   */
  public setHasAtmosphereProcessor(available: boolean): void {
    this.hasAtmosphereProcessor = available;
    if (this.planet) {
      this.updateButtonStates(this.planet.owner === FactionType.Player);
    }
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

    if (!bg || !text || !zone) {return;}

    // Update appearance to enabled state
    bg.clear();
    bg.fillStyle(COLORS.BUTTON_SECONDARY, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, BUTTON.BORDER_RADIUS);
    text.setColor(TEXT_COLORS.PRIMARY);

    // Remove old listeners and add new ones
    zone.removeAllListeners();
    zone.setInteractive({ useHandCursor: true });

    zone.on('pointerdown', () => {
      console.log('BUTTON CLICKED:', buttonContainer.getData('label'));
      onClick();
    });
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(COLORS.BUTTON_SECONDARY_HOVER, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, BUTTON.BORDER_RADIUS);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(COLORS.BUTTON_SECONDARY, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, BUTTON.BORDER_RADIUS);
    });

    buttonContainer.setData('disabled', false);
  }

  private getOwnerColorHex(owner: FactionType): string {
    switch (owner) {
      case FactionType.Player: return '#00bfff';
      case FactionType.AI: return '#ff0000';
      case FactionType.Neutral: return '#808080';
      default: return '#ffffff';
    }
  }

  private getMoraleColor(morale: number): string {
    if (morale >= 70) {return '#00aacc';} // Blue - happy
    if (morale >= 40) {return '#cccc00';} // Yellow - neutral
    return '#cc0000'; // Red - unhappy
  }

  /**
   * Shows the panel with animation (100ms per NFR-P3)
   */
  public show(onClose?: () => void): void {
    if (this.isVisible) {return;}

    this.closeCallback = onClose || null;
    this.isVisible = true;
    this.setVisible(true);

    // Set up scene-level click-outside-to-close handler
    // Use a small delay to avoid the current click being detected
    this.scene.time.delayedCall(50, () => {
      this.scene.input.on('pointerdown', this.onScenePointerDown);
    });

    // Position on right side of screen
    const camera = this.scene.cameras.main;
    this.setPosition(
      camera.width - PANEL_WIDTH - 20,
      (camera.height - PANEL_HEIGHT) / 2,
    );

    // Animate in from right (100ms per NFR-P3 requirement)
    this.setAlpha(0);
    this.x += 50;
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      x: camera.width - PANEL_WIDTH - 20,
      duration: 100,
      ease: 'Power2',
    });
  }

  /**
   * Hides the panel with animation (100ms per NFR-P3)
   */
  public hide(): void {
    if (!this.isVisible) {return;}

    this.isVisible = false;

    // Remove scene-level click-outside-to-close handler
    this.scene.input.off('pointerdown', this.onScenePointerDown);

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
      },
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
    // Remove scene input listener if still attached
    this.scene.input.off('pointerdown', this.onScenePointerDown);
    this.resourceTexts = [];
    this.actionButtons = [];
    super.destroy();
  }
}
