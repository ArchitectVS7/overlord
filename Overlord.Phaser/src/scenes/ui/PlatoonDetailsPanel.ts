/**
 * PlatoonDetailsPanel - UI panel for viewing and managing platoons
 *
 * Story 5-2: Platoon Details and Management
 *
 * Features:
 * - Shows list of garrisoned platoons
 * - Displays platoon details (troops, equipment, weapon, strength)
 * - Select platoon to view expanded details
 * - Disband action returns troops to population
 * - Training status display
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { PlatoonEntity } from '@core/models/PlatoonEntity';
import { PlatoonSystem } from '@core/PlatoonSystem';
import { COLORS as THEME_COLORS, TEXT_COLORS, FONTS } from '@config/UITheme';

// Panel dimensions and styling
const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 480;
const PADDING = 20;
const BUTTON_HEIGHT = 36;

// Colors - use theme
const BG_COLOR = THEME_COLORS.PANEL_BG;
const BORDER_COLOR = THEME_COLORS.BORDER_PRIMARY;
const TEXT_COLOR = TEXT_COLORS.PRIMARY;
const LABEL_COLOR = TEXT_COLORS.SECONDARY;
const SUCCESS_COLOR = TEXT_COLORS.SUCCESS;
const WARNING_COLOR = TEXT_COLORS.WARNING;

export class PlatoonDetailsPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private planet: PlanetEntity | null = null;
  private platoons: PlatoonEntity[] = [];
  private selectedPlatoonId: number | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;
  private platoonSystem: PlatoonSystem | null = null;

  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private emptyStateText!: Phaser.GameObjects.Text;
  private platoonListContainer!: Phaser.GameObjects.Container;
  private detailsContainer!: Phaser.GameObjects.Container;
  private disbandButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onDisband?: (platoonID: number) => void;
  public onLoadRequest?: (platoonID: number) => void;

  constructor(scene: Phaser.Scene, platoonSystem?: PlatoonSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);

    if (platoonSystem) {
      this.platoonSystem = platoonSystem;
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
    this.titleText = this.scene.add.text(PADDING, PADDING, 'Garrisoned Platoons', {
      fontSize: '20px',
      fontFamily: FONTS.PRIMARY,
      color: SUCCESS_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.titleText);

    // Create platoon list container
    this.platoonListContainer = this.scene.add.container(PADDING, 55);
    this.contentContainer.add(this.platoonListContainer);

    // Empty state message
    this.emptyStateText = this.scene.add.text(PADDING, 80, 'No platoons garrisoned', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
      fontStyle: 'italic',
    });
    this.emptyStateText.setVisible(false);
    this.contentContainer.add(this.emptyStateText);

    // Details container (shown when platoon selected)
    this.detailsContainer = this.scene.add.container(PADDING, 200);
    this.detailsContainer.setVisible(false);
    this.contentContainer.add(this.detailsContainer);

    // Create disband button
    this.createDisbandButton();

    // Create close button
    this.createCloseButton();
  }

  private createDisbandButton(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 10;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    this.disbandButton = this.scene.add.container(PADDING, buttonY - PADDING);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0xcc4444, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    this.disbandButton.add(bg);
    this.disbandButton.setData('bg', bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, 'DISBAND PLATOON', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.disbandButton.add(text);
    this.disbandButton.setData('text', text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.handleDisband());
    this.disbandButton.add(zone);
    this.disbandButton.setData('width', buttonWidth);

    this.disbandButton.setVisible(false);
    this.contentContainer.add(this.disbandButton);
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

  public show(planet: PlanetEntity, platoons: PlatoonEntity[], onClose?: () => void): void {
    if (this.isVisible) {return;}

    this.planet = planet;
    this.platoons = platoons;
    this.closeCallback = onClose || null;
    this.selectedPlatoonId = null;

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

  public getPlanet(): PlanetEntity | null {
    return this.planet;
  }

  public getPlatoonCount(): number {
    return this.platoons.length;
  }

  public isEmpty(): boolean {
    return this.platoons.length === 0;
  }

  public selectPlatoon(platoonID: number): void {
    const platoon = this.platoons.find(p => p.id === platoonID);
    if (platoon) {
      this.selectedPlatoonId = platoonID;
      this.updateUI();
    }
  }

  public getSelectedPlatoonId(): number | null {
    return this.selectedPlatoonId;
  }

  public getSelectedPlatoon(): PlatoonEntity | null {
    if (this.selectedPlatoonId === null) {return null;}
    return this.platoons.find(p => p.id === this.selectedPlatoonId) || null;
  }

  public isSelectedPlatoonTraining(): boolean {
    const platoon = this.getSelectedPlatoon();
    if (!platoon) {return false;}
    return platoon.isTraining;
  }

  public getSelectedPlatoonTroopCount(): number | null {
    const platoon = this.getSelectedPlatoon();
    if (!platoon) {return null;}
    return platoon.troopCount;
  }

  public getSelectedPlatoonStrength(): number | null {
    const platoon = this.getSelectedPlatoon();
    if (!platoon) {return null;}
    return platoon.strength;
  }

  /**
   * Gets the casualty count for the selected platoon (AC6)
   * Casualties = maxTroopCount - troopCount
   * Note: maxTroopCount is tracked separately when casualties occur in combat
   */
  public getSelectedPlatoonCasualties(): number | null {
    const platoon = this.getSelectedPlatoon();
    if (!platoon) {return null;}
    // Use type assertion for maxTroopCount which may be added by combat system
    const maxTroops = (platoon as PlatoonEntity & { maxTroopCount?: number }).maxTroopCount || platoon.troopCount;
    return maxTroops - platoon.troopCount;
  }

  public handleDisband(): void {
    if (this.selectedPlatoonId === null) {return;}

    // Save the ID before potentially clearing it
    const platoonIdToDisband = this.selectedPlatoonId;

    // If PlatoonSystem is provided, call it directly
    if (this.platoonSystem) {
      const result = this.platoonSystem.decommissionPlatoon(platoonIdToDisband);
      if (result) {
        // Remove from local list
        this.platoons = this.platoons.filter(p => p.id !== platoonIdToDisband);
        this.selectedPlatoonId = null;
        this.updateUI();
      }
    }

    // Fire callback for external handling
    if (this.onDisband) {
      this.onDisband(platoonIdToDisband);
    }
  }

  private updateUI(): void {
    // Show/hide empty state
    this.emptyStateText.setVisible(this.isEmpty());

    // Update platoon list
    this.updatePlatoonList();

    // Show/hide details and disband button based on selection
    const hasSelection = this.selectedPlatoonId !== null;
    this.detailsContainer.setVisible(hasSelection);
    this.disbandButton.setVisible(hasSelection);

    if (hasSelection) {
      this.updateDetailsDisplay();
    }
  }

  private updatePlatoonList(): void {
    // Clear existing list
    this.platoonListContainer.removeAll(true);

    if (this.isEmpty()) {return;}

    // Create list entries
    this.platoons.forEach((platoon, index) => {
      const y = index * 35;
      const isSelected = platoon.id === this.selectedPlatoonId;

      // Entry background
      const entryBg = this.scene.add.graphics();
      entryBg.fillStyle(isSelected ? 0x3a5a7a : 0x2a3a4a, 1);
      entryBg.fillRoundedRect(0, y, PANEL_WIDTH - PADDING * 2 - 20, 32, 4);
      this.platoonListContainer.add(entryBg);

      // Platoon name
      const nameText = this.scene.add.text(10, y + 6, platoon.name || `Platoon ${platoon.id}`, {
        fontSize: '13px',
        fontFamily: FONTS.PRIMARY,
        color: TEXT_COLOR,
      });
      this.platoonListContainer.add(nameText);

      // Troop count with casualty info (AC6)
      // Use type assertion for maxTroopCount which may be added by combat system
      const maxTroops = (platoon as PlatoonEntity & { maxTroopCount?: number }).maxTroopCount || platoon.troopCount;
      const casualties = maxTroops - platoon.troopCount;
      const troopDisplay = casualties > 0
        ? `${platoon.troopCount}/${maxTroops} (-${casualties})`
        : `${platoon.troopCount} troops`;
      const troopText = this.scene.add.text(140, y + 6, troopDisplay, {
        fontSize: '12px',
        fontFamily: FONTS.PRIMARY,
        color: casualties > 0 ? WARNING_COLOR : LABEL_COLOR,
      });
      this.platoonListContainer.add(troopText);

      // Equipment/Weapon summary (AC2)
      const equipWeapon = `${platoon.equipment}/${platoon.weapon}`;
      const equipText = this.scene.add.text(250, y + 6, equipWeapon, {
        fontSize: '10px',
        fontFamily: FONTS.PRIMARY,
        color: LABEL_COLOR,
      });
      this.platoonListContainer.add(equipText);

      // Training indicator (show on second line if training)
      if (platoon.isTraining) {
        const trainingText = this.scene.add.text(10, y + 18, `⏳ Training ${platoon.trainingLevel}%`, {
          fontSize: '10px',
          fontFamily: FONTS.PRIMARY,
          color: WARNING_COLOR,
        });
        this.platoonListContainer.add(trainingText);
      }

      // Clickable zone
      const zone = this.scene.add.zone(
        (PANEL_WIDTH - PADDING * 2 - 20) / 2,
        y + 16,
        PANEL_WIDTH - PADDING * 2 - 20,
        32,
      );
      zone.setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => this.selectPlatoon(platoon.id));
      this.platoonListContainer.add(zone);
    });
  }

  private updateDetailsDisplay(): void {
    // Clear existing details
    this.detailsContainer.removeAll(true);

    const platoon = this.getSelectedPlatoon();
    if (!platoon) {return;}

    let y = 0;

    // Divider
    const divider = this.scene.add.graphics();
    divider.lineStyle(1, 0x444444, 1);
    divider.lineBetween(0, y, PANEL_WIDTH - PADDING * 2, y);
    this.detailsContainer.add(divider);

    // Section header
    y += 10;
    const headerText = this.scene.add.text(0, y, 'Selected Platoon Details', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    this.detailsContainer.add(headerText);

    // Platoon info with casualty display (AC6)
    y += 28;
    // Use type assertion for maxTroopCount which may be added by combat system
    const maxTroops = (platoon as PlatoonEntity & { maxTroopCount?: number }).maxTroopCount || platoon.troopCount;
    const casualties = maxTroops - platoon.troopCount;
    const troopDisplay = casualties > 0
      ? `Troops: ${platoon.troopCount}/${maxTroops} (${casualties} casualties)`
      : `Troops: ${platoon.troopCount}`;

    const details = [
      `Name: ${platoon.name || `Platoon ${platoon.id}`}`,
      troopDisplay,
      `Equipment: ${platoon.equipment}`,
      `Weapon: ${platoon.weapon}`,
      `Training: ${platoon.trainingLevel}%`,
      `Strength: ${platoon.strength}`,
    ];

    details.forEach((detail, i) => {
      const text = this.scene.add.text(0, y + i * 20, detail, {
        fontSize: '12px',
        fontFamily: FONTS.PRIMARY,
        color: LABEL_COLOR,
      });
      this.detailsContainer.add(text);
    });
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
