/**
 * TopMenuBar
 * Minimal top menu bar with audio controls and navigation.
 */

import Phaser from 'phaser';
import { AudioManager } from '../../core/AudioManager';

const BAR_HEIGHT = 32;
const BAR_DEPTH = 1000;

const COLORS = {
  BAR_BG: 0x1a1a2e,
  BAR_BORDER: 0x2a2a4e,
  ICON_DEFAULT: '#888888',
  ICON_HOVER: '#ffffff',
  ICON_ACTIVE: '#00bfff',
  ICON_MUTED: '#ff4444',
};

export interface TopMenuBarOptions {
  showHome?: boolean;
}

/**
 * TopMenuBar - Minimal top menu bar with home navigation and audio toggle
 */
export class TopMenuBar extends Phaser.GameObjects.Container {
  private audioManager: AudioManager;
  private barBackground!: Phaser.GameObjects.Rectangle;
  private barBorder!: Phaser.GameObjects.Rectangle;
  private homeButton!: Phaser.GameObjects.Text;
  private speakerIcon!: Phaser.GameObjects.Text;
  private options: TopMenuBarOptions;

  constructor(scene: Phaser.Scene, options: TopMenuBarOptions = {}) {
    super(scene, 0, 0);

    this.options = { showHome: true, ...options };
    this.audioManager = AudioManager.getInstance();
    this.setDepth(BAR_DEPTH);

    this.createBar();
    if (this.options.showHome) {
      this.createHomeButton();
    }
    this.createSpeakerIcon();

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  private createBar(): void {
    const { width } = this.scene.cameras.main;

    // Background
    this.barBackground = this.scene.add.rectangle(
      width / 2,
      BAR_HEIGHT / 2,
      width,
      BAR_HEIGHT,
      COLORS.BAR_BG,
      0.9
    );
    this.add(this.barBackground);

    // Bottom border line
    this.barBorder = this.scene.add.rectangle(
      width / 2,
      BAR_HEIGHT,
      width,
      1,
      COLORS.BAR_BORDER
    );
    this.add(this.barBorder);
  }

  private createHomeButton(): void {
    const iconX = 15;
    const iconY = BAR_HEIGHT / 2;

    this.homeButton = this.scene.add.text(iconX, iconY, '🏠 HOME', {
      fontSize: '14px',
      color: COLORS.ICON_DEFAULT,
      fontFamily: 'monospace',
    });
    this.homeButton.setOrigin(0, 0.5);
    this.homeButton.setInteractive({ useHandCursor: true });
    this.add(this.homeButton);

    // Click handler - navigate to main menu
    this.homeButton.on('pointerdown', () => {
      this.scene.scene.start('MainMenuScene');
    });

    // Hover effects
    this.homeButton.on('pointerover', () => {
      this.homeButton.setColor(COLORS.ICON_HOVER);
    });

    this.homeButton.on('pointerout', () => {
      this.homeButton.setColor(COLORS.ICON_DEFAULT);
    });
  }

  private createSpeakerIcon(): void {
    const { width } = this.scene.cameras.main;

    // Position speaker icon on the right side
    const iconX = width - 20;
    const iconY = BAR_HEIGHT / 2;

    this.speakerIcon = this.scene.add.text(iconX, iconY, this.getSpeakerEmoji(), {
      fontSize: '18px',
    });
    this.speakerIcon.setOrigin(1, 0.5);
    this.speakerIcon.setInteractive({ useHandCursor: true });
    this.add(this.speakerIcon);

    // Click handler
    this.speakerIcon.on('pointerdown', () => {
      this.handleSpeakerClick();
    });

    // Hover effects
    this.speakerIcon.on('pointerover', () => {
      this.speakerIcon.setScale(1.2);
    });

    this.speakerIcon.on('pointerout', () => {
      this.speakerIcon.setScale(1.0);
    });

    // Listen for mute changes
    this.audioManager.onMuteChanged = () => {
      this.updateSpeakerIcon();
    };
  }

  private getSpeakerEmoji(): string {
    if (!this.audioManager.isActivated()) {
      return '🔇'; // Not activated yet
    }
    return this.audioManager.isMuted() ? '🔇' : '🔊';
  }

  private updateSpeakerIcon(): void {
    this.speakerIcon.setText(this.getSpeakerEmoji());
  }

  private handleSpeakerClick(): void {
    if (!this.audioManager.isActivated()) {
      // First click activates audio
      this.audioManager.activate();
      this.updateSpeakerIcon();
      console.log('Audio activated by user interaction');
    } else {
      // Subsequent clicks toggle mute
      this.audioManager.toggleMute();
      this.audioManager.saveSettings();
    }
  }

  /**
   * Get the bar height for layout purposes
   */
  public static getHeight(): number {
    return BAR_HEIGHT;
  }

  public destroy(): void {
    this.barBackground?.destroy();
    this.barBorder?.destroy();
    this.homeButton?.destroy();
    this.speakerIcon?.destroy();
    super.destroy();
  }
}
