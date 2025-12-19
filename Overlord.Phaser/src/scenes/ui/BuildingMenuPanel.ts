import Phaser from 'phaser';
import { GameState } from '@core/GameState';
import { BuildingSystem } from '@core/BuildingSystem';
import { BuildingType } from '@core/models/Enums';
import { BuildingCosts } from '@core/models/BuildingModels';
import { PlanetEntity } from '@core/models/PlanetEntity';

/**
 * Building information for display
 */
interface BuildingInfo {
  type: BuildingType;
  name: string;
  description: string;
  cost: { credits: number; minerals: number; fuel: number };
  constructionTime: number;
}

/**
 * Building Construction Menu Panel
 * Story 4-2: Shows available buildings for construction on a planet.
 *
 * Features:
 * - Lists available buildings with costs and construction times
 * - Grays out buildings player can't afford
 * - Shows construction in progress indicator
 * - One building at a time per planet limitation
 */
export class BuildingMenuPanel extends Phaser.GameObjects.Container {
  private gameState: GameState;
  private buildingSystem: BuildingSystem;

  // UI elements
  private backdrop!: Phaser.GameObjects.Rectangle;
  private panel!: Phaser.GameObjects.Rectangle;
  private titleText!: Phaser.GameObjects.Text;
  private closeButton!: Phaser.GameObjects.Text;
  private buildingButtons: Phaser.GameObjects.Container[] = [];

  // Callbacks
  public onBuildingSelected?: (buildingType: BuildingType, planetId: number) => void;
  public onClose?: () => void;

  // Available buildings for construction (mapped from AC requirements to existing types)
  private static readonly BUILDINGS: BuildingInfo[] = [
    {
      type: BuildingType.MiningStation,
      name: 'Mining Station',
      description: 'Produces Minerals (+50/turn) and Fuel (+30/turn)',
      cost: { credits: 8000, minerals: 2000, fuel: 1000 },
      constructionTime: 3,
    },
    {
      type: BuildingType.HorticulturalStation,
      name: 'Horticultural Station',
      description: 'Produces Food (+100/turn)',
      cost: { credits: 6000, minerals: 1500, fuel: 800 },
      constructionTime: 2,
    },
    {
      type: BuildingType.DockingBay,
      name: 'Docking Bay',
      description: 'Orbital platform for spacecraft (max 3 per planet)',
      cost: { credits: 5000, minerals: 1000, fuel: 500 },
      constructionTime: 2,
    },
    {
      type: BuildingType.OrbitalDefense,
      name: 'Orbital Defense',
      description: 'Defense platform (+20% defense bonus)',
      cost: { credits: 12000, minerals: 3000, fuel: 2000 },
      constructionTime: 3,
    },
    {
      type: BuildingType.SurfacePlatform,
      name: 'Surface Platform',
      description: 'Generic surface expansion slot',
      cost: { credits: 2000, minerals: 500, fuel: 0 },
      constructionTime: 1,
    },
  ];

  // Colors
  private static readonly COLORS = {
    panelBg: 0x1a1a2e,
    panelBorder: 0x00bfff,
    title: '#00bfff',
    available: '#ffffff',
    unavailable: '#666666',
    cost: '#ffff00',
    constructing: '#ff9900',
    hover: 0x2a2a4e,
    button: 0x0a0a1e,
    buttonBorder: 0x0088cc,
  };

  constructor(
    scene: Phaser.Scene,
    gameState: GameState,
    buildingSystem: BuildingSystem,
  ) {
    super(scene, 0, 0);
    this.gameState = gameState;
    this.buildingSystem = buildingSystem;

    this.createUI();
    this.setVisible(false);
    this.setDepth(1100);

    scene.add.existing(this);
  }

  /**
   * Creates the panel UI elements.
   */
  private createUI(): void {
    const { width, height } = this.scene.cameras.main;
    const panelWidth = 400;
    const panelHeight = 450;
    const panelX = width / 2;
    const panelY = height / 2;

    // Fullscreen backdrop for click-outside-to-close
    this.backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
    this.backdrop.setInteractive();
    this.backdrop.on('pointerdown', () => this.hide());
    this.add(this.backdrop);

    // Main panel
    this.panel = this.scene.add.rectangle(panelX, panelY, panelWidth, panelHeight, BuildingMenuPanel.COLORS.panelBg, 0.95);
    this.panel.setStrokeStyle(2, BuildingMenuPanel.COLORS.panelBorder);
    this.add(this.panel);

    // Title
    this.titleText = this.scene.add.text(panelX, panelY - panelHeight / 2 + 25, 'BUILD MENU', {
      fontSize: '20px',
      color: BuildingMenuPanel.COLORS.title,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.titleText);

    // Close button (44x44 touch target)
    this.closeButton = this.scene.add.text(panelX + panelWidth / 2 - 25, panelY - panelHeight / 2 + 25, 'X', {
      fontSize: '20px',
      color: '#ff0000',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const closeZone = this.scene.add.zone(
      panelX + panelWidth / 2 - 25,
      panelY - panelHeight / 2 + 25,
      44,
      44,
    ).setInteractive();
    closeZone.on('pointerdown', () => this.hide());
    closeZone.on('pointerover', () => this.closeButton.setColor('#ff6666'));
    closeZone.on('pointerout', () => this.closeButton.setColor('#ff0000'));

    this.add(this.closeButton);
    this.add(closeZone);

    // Building buttons will be created in show()
  }

  /**
   * Shows the building menu for a planet.
   */
  public show(planet: PlanetEntity): void {
    // Performance timing start
    const startTime = performance.now();

    // Clear existing buttons
    for (const btn of this.buildingButtons) {
      btn.destroy();
    }
    this.buildingButtons = [];

    // Update title
    this.titleText.setText(`BUILD - ${planet.name}`);

    // Check if construction already in progress
    const constructing = this.buildingSystem.getBuildingsUnderConstruction(planet.id);
    const hasConstructionInProgress = constructing.length > 0;

    // Create building buttons
    const { width, height } = this.scene.cameras.main;
    const panelX = width / 2;
    const panelY = height / 2;
    const buttonStartY = panelY - 140;
    const buttonHeight = 70;
    const buttonWidth = 360;

    BuildingMenuPanel.BUILDINGS.forEach((buildingInfo, index) => {
      const buttonY = buttonStartY + index * (buttonHeight + 10);
      const button = this.createBuildingButton(
        panelX,
        buttonY,
        buttonWidth,
        buttonHeight,
        buildingInfo,
        planet,
        hasConstructionInProgress,
      );
      this.buildingButtons.push(button);
      this.add(button);
    });

    // Show construction in progress message if applicable
    if (hasConstructionInProgress) {
      const constructionMsg = this.scene.add.text(
        panelX,
        panelY + 180,
        `Construction in progress: ${this.getBuildingName(constructing[0].type)}`,
        {
          fontSize: '14px',
          color: BuildingMenuPanel.COLORS.constructing,
          fontFamily: 'monospace',
          fontStyle: 'italic',
        },
      ).setOrigin(0.5);
      this.add(constructionMsg);
      this.buildingButtons.push(constructionMsg as unknown as Phaser.GameObjects.Container);
    }

    this.setVisible(true);

    // Show animation (100ms per NFR-P3)
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 100,
      ease: 'Power2',
    });

    // Performance timing end
    const endTime = performance.now();
    if (endTime - startTime > 100) {
      console.warn(`BuildingMenuPanel.show() took ${(endTime - startTime).toFixed(1)}ms (>100ms NFR-P3)`);
    }
  }

  /**
   * Creates a building button.
   */
  private createBuildingButton(
    x: number,
    y: number,
    width: number,
    height: number,
    buildingInfo: BuildingInfo,
    planet: PlanetEntity,
    hasConstructionInProgress: boolean,
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    // Check affordability using player faction resources
    const playerResources = this.gameState.playerFaction.resources;
    const canAfford =
      playerResources.credits >= buildingInfo.cost.credits &&
      playerResources.minerals >= buildingInfo.cost.minerals &&
      playerResources.fuel >= buildingInfo.cost.fuel;

    // Check capacity
    const canBuild = this.buildingSystem.canBuild(planet.id, buildingInfo.type);

    const isAvailable = canAfford && canBuild && !hasConstructionInProgress;

    // Button background
    const bg = this.scene.add.rectangle(0, 0, width, height, BuildingMenuPanel.COLORS.button, 0.9);
    bg.setStrokeStyle(1, isAvailable ? BuildingMenuPanel.COLORS.buttonBorder : 0x444444);
    container.add(bg);

    // Building name
    const nameText = this.scene.add.text(-width / 2 + 15, -height / 2 + 10, buildingInfo.name, {
      fontSize: '14px',
      color: isAvailable ? BuildingMenuPanel.COLORS.available : BuildingMenuPanel.COLORS.unavailable,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    container.add(nameText);

    // Description
    const descText = this.scene.add.text(-width / 2 + 15, -height / 2 + 28, buildingInfo.description, {
      fontSize: '11px',
      color: isAvailable ? '#aaaaaa' : '#555555',
      fontFamily: 'monospace',
    });
    container.add(descText);

    // Cost
    const costStr = `Cost: ${buildingInfo.cost.credits.toLocaleString()} Cr, ${buildingInfo.cost.minerals.toLocaleString()} Min, ${buildingInfo.cost.fuel.toLocaleString()} Fuel`;
    const costText = this.scene.add.text(-width / 2 + 15, -height / 2 + 45, costStr, {
      fontSize: '10px',
      color: canAfford ? BuildingMenuPanel.COLORS.cost : '#ff4444',
      fontFamily: 'monospace',
    });
    container.add(costText);

    // Construction time
    const timeText = this.scene.add.text(width / 2 - 15, -height / 2 + 10, `${buildingInfo.constructionTime} turns`, {
      fontSize: '11px',
      color: isAvailable ? '#88ff88' : '#555555',
      fontFamily: 'monospace',
    }).setOrigin(1, 0);
    container.add(timeText);

    // Unavailability reason
    if (!isAvailable) {
      let reason = '';
      if (hasConstructionInProgress) {
        reason = 'Construction in progress';
      } else if (!canBuild) {
        reason = 'Capacity limit reached';
      } else if (!canAfford) {
        reason = 'Insufficient resources';
      }

      const reasonText = this.scene.add.text(width / 2 - 15, height / 2 - 15, reason, {
        fontSize: '10px',
        color: '#ff6666',
        fontFamily: 'monospace',
        fontStyle: 'italic',
      }).setOrigin(1, 1);
      container.add(reasonText);
    }

    // Interactivity
    if (isAvailable) {
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerover', () => {
        bg.setFillStyle(BuildingMenuPanel.COLORS.hover);
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(BuildingMenuPanel.COLORS.button);
      });
      bg.on('pointerdown', () => {
        this.selectBuilding(buildingInfo.type, planet);
      });
    }

    return container;
  }

  /**
   * Gets the display name for a building type.
   */
  private getBuildingName(type: BuildingType): string {
    const building = BuildingMenuPanel.BUILDINGS.find(b => b.type === type);
    return building?.name ?? type;
  }

  /**
   * Handles building selection.
   */
  private selectBuilding(buildingType: BuildingType, planet: PlanetEntity): void {
    // Start construction using player faction resources
    const cost = BuildingCosts.getCost(buildingType);
    const playerResources = this.gameState.playerFaction.resources;

    // Double-check affordability
    if (!playerResources.canAfford(cost)) {
      this.showError('Insufficient resources');
      return;
    }

    // Deduct from player faction (not planet resources)
    playerResources.subtract(cost);

    // Start construction
    const success = this.buildingSystem.startConstruction(planet.id, buildingType);

    if (success) {
      // Show success notification
      this.showNotification(`${this.getBuildingName(buildingType)} construction started on ${planet.name}`);

      // Fire callback
      this.onBuildingSelected?.(buildingType, planet.id);

      // Close menu (AC: menu closes automatically)
      this.hide();
    } else {
      // Refund resources if construction failed
      const refund = cost.toDelta();
      refund.credits = -refund.credits;
      refund.minerals = -refund.minerals;
      refund.fuel = -refund.fuel;
      playerResources.add(refund);

      this.showError('Construction failed');
    }
  }

  /**
   * Shows an error message.
   */
  private showError(message: string): void {
    const { width, height } = this.scene.cameras.main;
    const errorText = this.scene.add.text(width / 2, height / 2 + 200, message, {
      fontSize: '16px',
      color: '#ff0000',
      fontFamily: 'monospace',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5).setDepth(1200);

    this.scene.tweens.add({
      targets: errorText,
      alpha: 0,
      duration: 500,
      delay: 2000,
      onComplete: () => errorText.destroy(),
    });
  }

  /**
   * Shows a notification message.
   */
  private showNotification(message: string): void {
    const { width, height } = this.scene.cameras.main;
    const notification = this.scene.add.text(width / 2, height - 100, message, {
      fontSize: '16px',
      color: '#00bfff',
      fontFamily: 'monospace',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: { x: 15, y: 8 },
    }).setOrigin(0.5).setDepth(1200);

    this.scene.tweens.add({
      targets: notification,
      alpha: 0,
      duration: 500,
      delay: 3000,
      onComplete: () => notification.destroy(),
    });
  }

  /**
   * Hides the building menu.
   */
  public hide(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 100,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false);
        this.onClose?.();
      },
    });
  }

  /**
   * Checks if the menu is visible.
   */
  public isOpen(): boolean {
    return this.visible;
  }

  /**
   * Clean up resources.
   */
  public destroy(): void {
    for (const btn of this.buildingButtons) {
      btn.destroy();
    }
    this.buildingButtons = [];
    super.destroy();
  }
}
