/**
 * InvasionPanel - UI panel for initiating planetary invasions
 *
 * Story 6-1: Initiate Planetary Invasion
 *
 * Features:
 * - Display target planet information
 * - Show available invasion force (platoons on cruisers)
 * - Aggression slider for combat strategy
 * - Estimated casualties display
 * - Invasion confirmation
 */

import Phaser from 'phaser';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { PlatoonEntity } from '@core/models/PlatoonEntity';
import { CraftType, FactionType } from '@core/models/Enums';

// Panel dimensions and styling
const PANEL_WIDTH = 480;
const PANEL_HEIGHT = 420;
const PADDING = 20;
const BUTTON_HEIGHT = 36;

// Colors
const BG_COLOR = 0x1a1a2e;
const BORDER_COLOR = 0xcc4444;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';
const ERROR_COLOR = '#cc0000';
const WARNING_COLOR = '#ffaa00';
const DISABLED_COLOR = '#666666';

export interface TargetInfo {
  id: number;
  name: string;
  owner: FactionType;
  population: number;
}

export class InvasionPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private borderGraphics!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private targetPlanet: PlanetEntity | null = null;
  private cruisers: CraftEntity[] = [];
  private platoons: PlatoonEntity[] = [];
  private aggression: number = 50;
  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;

  // UI elements
  private targetInfoText!: Phaser.GameObjects.Text;
  private forceInfoText!: Phaser.GameObjects.Text;
  private aggressionText!: Phaser.GameObjects.Text;
  private casualtyText!: Phaser.GameObjects.Text;
  private invadeButton!: Phaser.GameObjects.Container;

  // Callbacks
  public onInvade?: (planet: PlanetEntity, aggression: number) => void;

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
    this.contentContainer = this.scene.add.container(PADDING, PADDING);
    this.add(this.contentContainer);

    // Background with red tint for combat
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.background);

    // Red border for combat warning
    this.borderGraphics = this.scene.add.graphics();
    this.borderGraphics.lineStyle(2, BORDER_COLOR, 1);
    this.borderGraphics.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.borderGraphics);

    // Title
    const title = this.scene.add.text(PADDING, PADDING, '⚔️ Planetary Invasion', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: ERROR_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(title);

    this.createTargetSection();
    this.createForceSection();
    this.createAggressionSection();
    this.createInvadeButton();
    this.createCloseButton();
  }

  private createTargetSection(): void {
    const startY = 55;

    const label = this.scene.add.text(PADDING, startY, 'Target:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(label);

    this.targetInfoText = this.scene.add.text(PADDING, startY + 22, '', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.targetInfoText);
  }

  private createForceSection(): void {
    const startY = 120;

    const label = this.scene.add.text(PADDING, startY, 'Invasion Force:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(label);

    this.forceInfoText = this.scene.add.text(PADDING, startY + 22, '', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(this.forceInfoText);
  }

  private createAggressionSection(): void {
    const startY = 200;

    const label = this.scene.add.text(PADDING, startY, 'Combat Strategy:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(label);

    this.aggressionText = this.scene.add.text(PADDING, startY + 22, '', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: WARNING_COLOR,
      fontStyle: 'bold',
    });
    this.contentContainer.add(this.aggressionText);

    // Aggression buttons
    this.createAggressionButtons(startY + 50);

    // Casualty estimate
    this.casualtyText = this.scene.add.text(PADDING, startY + 100, '', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(this.casualtyText);
  }

  private createAggressionButtons(y: number): void {
    // Slider track
    const sliderWidth = PANEL_WIDTH - PADDING * 2 - 100;
    const sliderX = PADDING + 50;
    const track = this.scene.add.graphics();
    track.fillStyle(0x2a3a4a, 1);
    track.fillRoundedRect(sliderX, y, sliderWidth, 8, 4);
    track.lineStyle(1, 0x4a5a6a, 1);
    track.strokeRoundedRect(sliderX, y, sliderWidth, 8, 4);
    this.contentContainer.add(track);

    // Tick marks and labels at key positions
    const ticks = [
      { value: 0, label: 'Very\nConservative' },
      { value: 25, label: 'Defensive' },
      { value: 50, label: 'Balanced' },
      { value: 75, label: 'Aggressive' },
      { value: 100, label: 'All-Out\nAssault' },
    ];

    ticks.forEach(tick => {
      const tickX = sliderX + (tick.value / 100) * sliderWidth;
      const tickMark = this.scene.add.graphics();
      tickMark.fillStyle(0x6a7a8a, 1);
      tickMark.fillRect(tickX - 1, y - 4, 2, 16);
      this.contentContainer.add(tickMark);

      const label = this.scene.add.text(tickX, y + 20, tick.label, {
        fontSize: '9px',
        fontFamily: 'Arial',
        color: LABEL_COLOR,
        align: 'center',
      });
      label.setOrigin(0.5, 0);
      this.contentContainer.add(label);
    });

    // Slider thumb (draggable)
    const thumb = this.scene.add.graphics();
    thumb.fillStyle(0xffaa00, 1);
    thumb.fillCircle(0, 0, 10);
    thumb.lineStyle(2, 0xffffff, 1);
    thumb.strokeCircle(0, 0, 10);

    const updateThumbPosition = () => {
      const thumbX = sliderX + (this.aggression / 100) * sliderWidth;
      thumb.setPosition(thumbX, y + 4);
    };
    updateThumbPosition();

    thumb.setInteractive(new Phaser.Geom.Circle(0, 0, 12), Phaser.Geom.Circle.Contains);
    this.scene.input.setDraggable(thumb);

    thumb.on('drag', (pointer: Phaser.Input.Pointer) => {
      const relativeX = pointer.x - this.x - PADDING - sliderX;
      const newValue = Math.round((relativeX / sliderWidth) * 100);
      this.setAggression(newValue);
      updateThumbPosition();
      this.updateUI();
    });

    this.contentContainer.add(thumb);
  }

  private createInvadeButton(): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT - 10;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    this.invadeButton = this.scene.add.container(PADDING, buttonY - PADDING);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x8a2222, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    this.invadeButton.add(bg);
    this.invadeButton.setData('bg', bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, '⚔️ LAUNCH INVASION', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: DISABLED_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    this.invadeButton.add(text);
    this.invadeButton.setData('text', text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.confirmInvasion());
    this.invadeButton.add(zone);
    this.invadeButton.setData('width', buttonWidth);

    this.contentContainer.add(this.invadeButton);
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

  public show(
    targetPlanet: PlanetEntity,
    cruisers: CraftEntity[],
    platoons: PlatoonEntity[],
    onClose?: () => void,
  ): void {
    if (this.isVisible) {return;}

    this.targetPlanet = targetPlanet;
    this.cruisers = cruisers.filter(c =>
      c.type === CraftType.BattleCruiser &&
      c.owner === FactionType.Player &&
      c.carriedPlatoonIDs.length > 0,
    );
    this.platoons = platoons.filter(p => p.owner === FactionType.Player);
    this.closeCallback = onClose || null;
    this.aggression = 50;

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

  public getTargetPlanet(): PlanetEntity | null {
    return this.targetPlanet;
  }

  public getAggression(): number {
    return this.aggression;
  }

  public setAggression(value: number): void {
    this.aggression = Math.max(0, Math.min(100, value));
  }

  public getTotalPlatoonCount(): number {
    let count = 0;
    for (const cruiser of this.cruisers) {
      count += cruiser.carriedPlatoonIDs.length;
    }
    return count;
  }

  public getTotalTroopCount(): number {
    let total = 0;
    for (const cruiser of this.cruisers) {
      for (const platoonID of cruiser.carriedPlatoonIDs) {
        const platoon = this.platoons.find(p => p.id === platoonID);
        if (platoon) {
          total += platoon.troopCount;
        }
      }
    }
    return total;
  }

  public getTotalStrength(): number {
    let total = 0;
    for (const cruiser of this.cruisers) {
      for (const platoonID of cruiser.carriedPlatoonIDs) {
        const platoon = this.platoons.find(p => p.id === platoonID);
        if (platoon) {
          total += platoon.strength;
        }
      }
    }
    return total;
  }

  public getEstimatedCasualties(): number {
    const troops = this.getTotalTroopCount();
    // Higher aggression = higher casualties (rough estimate)
    const casualtyRate = this.aggression / 200; // 0-50% based on aggression
    return Math.floor(troops * casualtyRate);
  }

  public getTargetInfo(): TargetInfo {
    if (!this.targetPlanet) {
      return { id: 0, name: '', owner: FactionType.Neutral, population: 0 };
    }
    return {
      id: this.targetPlanet.id,
      name: this.targetPlanet.name,
      owner: this.targetPlanet.owner,
      population: this.targetPlanet.population,
    };
  }

  public getAggressionDescription(): string {
    if (this.aggression <= 25) {return 'Cautious';}
    if (this.aggression <= 50) {return 'Balanced';}
    if (this.aggression <= 75) {return 'Aggressive';}
    return 'All-Out Assault';
  }

  public isInvadeEnabled(): boolean {
    return this.getTotalPlatoonCount() > 0;
  }

  public confirmInvasion(): void {
    if (!this.targetPlanet || !this.isInvadeEnabled()) {return;}

    if (this.onInvade) {
      this.onInvade(this.targetPlanet, this.aggression);
    }

    this.hide();
  }

  private updateUI(): void {
    this.updateTargetInfo();
    this.updateForceInfo();
    this.updateAggressionDisplay();
    this.updateButtonState();
  }

  private updateTargetInfo(): void {
    const info = this.getTargetInfo();
    const ownerStr = info.owner === FactionType.AI ? 'AI Controlled' : FactionType[info.owner];
    this.targetInfoText.setText(
      `${info.name}\n` +
      `Owner: ${ownerStr}\n` +
      `Population: ${info.population.toLocaleString()}`,
    );
  }

  private updateForceInfo(): void {
    const platoonCount = this.getTotalPlatoonCount();
    const troopCount = this.getTotalTroopCount();
    const strength = this.getTotalStrength();

    if (platoonCount === 0) {
      this.forceInfoText.setText('No platoons available for invasion!');
      this.forceInfoText.setColor(ERROR_COLOR);
    } else {
      this.forceInfoText.setText(
        `${platoonCount} Platoons | ${troopCount.toLocaleString()} Troops\n` +
        `Combined Strength: ${strength.toLocaleString()}`,
      );
      this.forceInfoText.setColor(TEXT_COLOR);
    }
  }

  private updateAggressionDisplay(): void {
    this.aggressionText.setText(
      `${this.getAggressionDescription()} (${this.aggression}%)`,
    );

    const casualties = this.getEstimatedCasualties();
    this.casualtyText.setText(
      `Estimated casualties: ~${casualties.toLocaleString()} troops`,
    );
  }

  private updateButtonState(): void {
    const enabled = this.isInvadeEnabled();
    const bg = this.invadeButton.getData('bg') as Phaser.GameObjects.Graphics;
    const text = this.invadeButton.getData('text') as Phaser.GameObjects.Text;
    const width = this.invadeButton.getData('width') as number;

    bg.clear();
    bg.fillStyle(enabled ? 0x8a2222 : 0x4a4a4a, 1);
    bg.fillRoundedRect(0, 0, width, BUTTON_HEIGHT, 6);

    text.setColor(enabled ? TEXT_COLOR : DISABLED_COLOR);
  }

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
