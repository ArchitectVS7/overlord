/**
 * BombardmentPanel - UI panel for orbital bombardment
 *
 * Story 6-4: Orbital Bombardment
 *
 * Features:
 * - Display target planet information
 * - Show Battle Cruisers in orbit and bombardment strength
 * - Estimated destruction preview
 * - Execute Bombardment button
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { CraftType, FactionType } from '@core/models/Enums';
import { BombardmentSystem } from '@core/BombardmentSystem';
import { BombardmentResult } from '@core/models/CombatModels';
import { COLORS as THEME_COLORS, TEXT_COLORS, FONTS } from '@config/UITheme';

// Panel dimensions and styling
const PANEL_WIDTH = 450;
const PANEL_HEIGHT = 380;
const PADDING = 20;
const BUTTON_HEIGHT = 36;

// Colors - use theme with orange tint for bombardment
const BG_COLOR = THEME_COLORS.PANEL_BG;
const BORDER_COLOR = 0xff6600; // Orange for bombardment
const TEXT_COLOR = TEXT_COLORS.PRIMARY;
const LABEL_COLOR = TEXT_COLORS.SECONDARY;
const WARNING_COLOR = TEXT_COLORS.WARNING;
const DANGER_COLOR = TEXT_COLORS.DANGER;
const DISABLED_COLOR = TEXT_COLORS.MUTED;

export class BombardmentPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private targetPlanet: PlanetEntity | null = null;
  private cruisers: CraftEntity[] = [];
  private bombardmentSystem: BombardmentSystem | null = null;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;

  // UI elements
  private targetInfoText!: Phaser.GameObjects.Text;
  private cruiserInfoText!: Phaser.GameObjects.Text;
  private strengthInfoText!: Phaser.GameObjects.Text;
  private warningText!: Phaser.GameObjects.Text;
  private bombardButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onBombard?: (planet: PlanetEntity, result: BombardmentResult) => void;

  constructor(scene: Phaser.Scene, bombardmentSystem?: BombardmentSystem) {
    super(scene, 0, 0);
    scene.add.existing(this);

    if (bombardmentSystem) {
      this.bombardmentSystem = bombardmentSystem;
    }

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1100);
    this.setScrollFactor(0);
  }

  public setBombardmentSystem(system: BombardmentSystem): void {
    this.bombardmentSystem = system;
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
    // Hit blocker
    const hitBlocker = this.scene.add.rectangle(PADDING, PADDING, PANEL_WIDTH, PANEL_HEIGHT, 0x000000, 0);
    hitBlocker.setOrigin(0, 0);
    hitBlocker.setInteractive();
    this.add(hitBlocker);

    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.background);

    // Orange border for bombardment
    this.borderGraphics = this.scene.add.graphics();
    this.borderGraphics.lineStyle(2, BORDER_COLOR, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.borderGraphics);

    // Title
    const title = this.scene.add.text(PADDING, PADDING, '💥 Orbital Bombardment', {
      fontSize: '20px',
      fontFamily: FONTS.PRIMARY,
      color: WARNING_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(title);

    this.createTargetSection();
    this.createStrengthSection();
    this.createWarningSection();
    this.createButtons();
    this.createCloseButton();
  }

  private createTargetSection(): void {
    const startY = 60;

    const header = this.scene.add.text(PADDING, startY, 'TARGET PLANET', {
      fontSize: '12px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
    });
    this.contentContainer.add(header);

    this.targetInfoText = this.scene.add.text(PADDING, startY + 20, 'No target selected', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.targetInfoText);
  }

  private createStrengthSection(): void {
    const startY = 130;

    const header = this.scene.add.text(PADDING, startY, 'BOMBARDMENT FORCE', {
      fontSize: '12px',
      fontFamily: FONTS.PRIMARY,
      color: LABEL_COLOR,
    });
    this.contentContainer.add(header);

    this.cruiserInfoText = this.scene.add.text(PADDING, startY + 20, 'No cruisers in orbit', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.cruiserInfoText);

    this.strengthInfoText = this.scene.add.text(PADDING, startY + 45, 'Bombardment Strength: 0', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: WARNING_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.strengthInfoText);
  }

  private createWarningSection(): void {
    const startY = 220;

    this.warningText = this.scene.add.text(PADDING, startY,
      '⚠️ BOMBARDMENT EFFECTS:\n' +
      '• Destroys planetary structures\n' +
      '• Causes civilian casualties\n' +
      '• Reduces morale by 20%\n\n' +
      'This action cannot be undone!',
      {
        fontSize: '13px',
        fontFamily: FONTS.PRIMARY,
        color: DANGER_COLOR,
        lineSpacing: 4,
      }
    );
    this.contentContainer.add(this.warningText);
  }

  private createButtons(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT;

    // Execute Bombardment button
    this.bombardButton = this.scene.add.container(PANEL_WIDTH / 2, buttonY);

    const buttonBg = this.scene.add.graphics();
    buttonBg.fillStyle(0xff4400, 1);
    buttonBg.fillRoundedRect(-100, 0, 200, BUTTON_HEIGHT, 6);

    const buttonText = this.scene.add.text(0, BUTTON_HEIGHT / 2, 'EXECUTE BOMBARDMENT', {
      fontSize: '14px',
      fontFamily: FONTS.PRIMARY,
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5);

    const buttonZone = this.scene.add.zone(0, BUTTON_HEIGHT / 2, 200, BUTTON_HEIGHT);
    buttonZone.setInteractive({ useHandCursor: true });

    buttonZone.on('pointerdown', () => this.executeBombardment());
    buttonZone.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0xff6600, 1);
      buttonBg.fillRoundedRect(-100, 0, 200, BUTTON_HEIGHT, 6);
    });
    buttonZone.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0xff4400, 1);
      buttonBg.fillRoundedRect(-100, 0, 200, BUTTON_HEIGHT, 6);
    });

    this.bombardButton.add([buttonBg, buttonText, buttonZone]);
    this.contentContainer.add(this.bombardButton);
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

  public show(planet: PlanetEntity, cruisers: CraftEntity[], onClose?: () => void): void {
    if (this.isVisible) return;

    this.targetPlanet = planet;
    this.cruisers = cruisers.filter(c => c.type === CraftType.BattleCruiser);
    this.closeCallback = onClose || null;

    this.isVisible = true;
    this.setVisible(true);
    this.backdrop.setVisible(true);

    // Center panel
    const camera = this.scene.cameras.main;
    this.setPosition(
      (camera.width - PANEL_WIDTH) / 2,
      (camera.height - PANEL_HEIGHT) / 2,
    );

    // Fade in
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
    if (!this.targetPlanet) return;

    // Target info
    const ownerName = this.targetPlanet.owner === FactionType.AI ? 'AI' : 'Player';
    this.targetInfoText.setText(
      `${this.targetPlanet.name}\n` +
      `Owner: ${ownerName}\n` +
      `Population: ${this.targetPlanet.population.toLocaleString()}\n` +
      `Structures: ${this.targetPlanet.structures.length}\n` +
      `Morale: ${this.targetPlanet.morale}%`
    );

    // Cruiser info
    const cruiserCount = this.cruisers.length;
    this.cruiserInfoText.setText(
      cruiserCount > 0
        ? `${cruiserCount} Battle Cruiser${cruiserCount > 1 ? 's' : ''} in orbit`
        : 'No Battle Cruisers in orbit'
    );

    // Bombardment strength
    const strength = cruiserCount * 50;
    this.strengthInfoText.setText(`Bombardment Strength: ${strength}`);
    this.strengthInfoText.setColor(strength > 0 ? WARNING_COLOR : DISABLED_COLOR);

    // Disable button if no strength
    this.bombardButton.setAlpha(cruiserCount > 0 ? 1 : 0.5);
  }

  private executeBombardment(): void {
    if (!this.targetPlanet || !this.bombardmentSystem || this.cruisers.length === 0) {
      return;
    }

    // Execute bombardment
    const result = this.bombardmentSystem.bombardPlanet(
      this.targetPlanet.id,
      FactionType.Player
    );

    if (result) {
      // Fire callback with result
      if (this.onBombard) {
        this.onBombard(this.targetPlanet, result);
      }
    }

    this.hide();
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
