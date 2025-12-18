/**
 * BattleResultsPanel - Displays combat outcomes after planetary invasions
 *
 * Story 6-3: Combat Resolution and Battle Results
 *
 * Features:
 * - Victory/defeat header with planet name
 * - Casualty summary (attacker & defender losses)
 * - Resources captured (victory only)
 * - Continue button to dismiss
 */

import Phaser from 'phaser';

// Panel dimensions
const PANEL_WIDTH = 420;
const PANEL_HEIGHT = 380;
const PADDING = 20;
const BUTTON_HEIGHT = 36;

// Colors
const BG_COLOR = 0x1a1a2e;
const VICTORY_COLOR = 0x22aa44;
const DEFEAT_COLOR = 0xcc4444;
const TEXT_COLOR = '#ffffff';
const LABEL_COLOR = '#aaaaaa';

export interface BattleResultData {
  victory: boolean;
  planetName: string;
  attackerCasualties: number;
  defenderCasualties: number;
  resourcesCaptured?: {
    credits: number;
    minerals: number;
    fuel: number;
  };
  defeatReason?: string;
}

export class BattleResultsPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private contentContainer!: Phaser.GameObjects.Container;
  private backdrop!: Phaser.GameObjects.Rectangle;

  private isVisible: boolean = false;
  private closeCallback: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.createBackdrop();
    this.createPanel();
    this.setVisible(false);
    this.setDepth(1200);
    this.setScrollFactor(0);
  }

  private createBackdrop(): void {
    const camera = this.scene.cameras.main;
    this.backdrop = this.scene.add.rectangle(0, 0, camera.width, camera.height, 0x000000, 0.7);
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setInteractive({ useHandCursor: false });
    this.backdrop.setScrollFactor(0);
    this.backdrop.setDepth(1199);
    this.backdrop.setVisible(false);
  }

  private createPanel(): void {
    this.contentContainer = this.scene.add.container(0, 0);
    this.add(this.contentContainer);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.background.lineStyle(2, 0x555555, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 12);
    this.contentContainer.add(this.background);
  }

  public show(resultData: BattleResultData, onClose?: () => void): void {
    if (this.isVisible) {return;}

    this.closeCallback = onClose || null;
    this.isVisible = true;
    this.setVisible(true);
    this.backdrop.setVisible(true);

    // Clear previous content
    this.contentContainer.removeAll(true);
    this.contentContainer.add(this.background);

    // Build UI based on victory/defeat
    if (resultData.victory) {
      this.buildVictoryUI(resultData);
    } else {
      this.buildDefeatUI(resultData);
    }

    // Position panel
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
      duration: 150,
      ease: 'Power2',
    });
  }

  private buildVictoryUI(data: BattleResultData): void {
    let yPos = PADDING;

    // Victory header
    const header = this.scene.add.text(PANEL_WIDTH / 2, yPos, '⚔️ VICTORY! ⚔️', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#22aa44',
      fontStyle: 'bold',
    });
    header.setOrigin(0.5, 0);
    this.contentContainer.add(header);
    yPos += 40;

    // Planet conquered
    const planetText = this.scene.add.text(PANEL_WIDTH / 2, yPos, `${data.planetName} Conquered!`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    planetText.setOrigin(0.5, 0);
    this.contentContainer.add(planetText);
    yPos += 40;

    // Casualties section
    const casualtyLabel = this.scene.add.text(PADDING, yPos, 'Battle Casualties:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(casualtyLabel);
    yPos += 25;

    const yourLosses = this.scene.add.text(PADDING, yPos, `Your losses: ${data.attackerCasualties} troops`, {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(yourLosses);
    yPos += 22;

    const enemyLosses = this.scene.add.text(PADDING, yPos, `Enemy losses: ${data.defenderCasualties} troops`, {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#66ff66',
    });
    this.contentContainer.add(enemyLosses);
    yPos += 35;

    // Resources captured (if available)
    if (data.resourcesCaptured) {
      const resourceLabel = this.scene.add.text(PADDING, yPos, 'Resources Captured:', {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: LABEL_COLOR,
      });
      this.contentContainer.add(resourceLabel);
      yPos += 25;

      const resources = data.resourcesCaptured;
      const resourceText = this.scene.add.text(PADDING, yPos,
        `Credits: ${resources.credits.toLocaleString()}\n` +
        `Minerals: ${resources.minerals.toLocaleString()}\n` +
        `Fuel: ${resources.fuel.toLocaleString()}`, {
        fontSize: '13px',
        fontFamily: 'Arial',
        color: '#ffdd88',
      });
      this.contentContainer.add(resourceText);
      yPos += 70;
    }

    // Continue button
    this.createContinueButton(VICTORY_COLOR);
  }

  private buildDefeatUI(data: BattleResultData): void {
    let yPos = PADDING;

    // Defeat header
    const header = this.scene.add.text(PANEL_WIDTH / 2, yPos, '☠️ DEFEAT ☠️', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#cc4444',
      fontStyle: 'bold',
    });
    header.setOrigin(0.5, 0);
    this.contentContainer.add(header);
    yPos += 40;

    // Invasion failed
    const planetText = this.scene.add.text(PANEL_WIDTH / 2, yPos, `Invasion of ${data.planetName} Failed`, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    planetText.setOrigin(0.5, 0);
    this.contentContainer.add(planetText);
    yPos += 40;

    // Casualties section
    const casualtyLabel = this.scene.add.text(PADDING, yPos, 'Battle Casualties:', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: LABEL_COLOR,
    });
    this.contentContainer.add(casualtyLabel);
    yPos += 25;

    const yourLosses = this.scene.add.text(PADDING, yPos, `Your losses: ${data.attackerCasualties} troops`, {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#ff6666',
    });
    this.contentContainer.add(yourLosses);
    yPos += 22;

    const enemyLosses = this.scene.add.text(PADDING, yPos, `Enemy losses: ${data.defenderCasualties} troops`, {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
    });
    this.contentContainer.add(enemyLosses);
    yPos += 35;

    // Defeat reason
    if (data.defeatReason) {
      const reasonLabel = this.scene.add.text(PADDING, yPos, 'Defeat Reason:', {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: LABEL_COLOR,
      });
      this.contentContainer.add(reasonLabel);
      yPos += 25;

      const reasonText = this.scene.add.text(PADDING, yPos, data.defeatReason, {
        fontSize: '13px',
        fontFamily: 'Arial',
        color: TEXT_COLOR,
        wordWrap: { width: PANEL_WIDTH - PADDING * 2 },
      });
      this.contentContainer.add(reasonText);
      yPos += 50;
    }

    // Continue button
    this.createContinueButton(DEFEAT_COLOR);
  }

  private createContinueButton(borderColor: number): void {
    const buttonY = PANEL_HEIGHT - PADDING - BUTTON_HEIGHT;
    const buttonWidth = PANEL_WIDTH - PADDING * 2;

    const buttonContainer = this.scene.add.container(PADDING, buttonY);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x3a4a5a, 1);
    bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    bg.lineStyle(2, borderColor, 1);
    bg.strokeRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    buttonContainer.add(bg);

    const text = this.scene.add.text(buttonWidth / 2, BUTTON_HEIGHT / 2, 'CONTINUE', {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: TEXT_COLOR,
      fontStyle: 'bold',
    });
    text.setOrigin(0.5);
    buttonContainer.add(text);

    const zone = this.scene.add.zone(buttonWidth / 2, BUTTON_HEIGHT / 2, buttonWidth, BUTTON_HEIGHT);
    zone.setInteractive({ useHandCursor: true });
    zone.on('pointerdown', () => this.hide());
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x4a5a6a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
      bg.lineStyle(2, borderColor, 1);
      bg.strokeRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x3a4a5a, 1);
      bg.fillRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
      bg.lineStyle(2, borderColor, 1);
      bg.strokeRoundedRect(0, 0, buttonWidth, BUTTON_HEIGHT, 6);
    });
    buttonContainer.add(zone);

    this.contentContainer.add(buttonContainer);
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

  public destroy(): void {
    this.backdrop?.destroy();
    super.destroy();
  }
}
