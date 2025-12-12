import Phaser from 'phaser';
import { AudioManager } from '@core/AudioManager';
import { AudioActivationOverlay } from './ui/AudioActivationOverlay';

/**
 * Main Menu Scene
 * AC-1: Entry point with "New Campaign" button
 * Story 12-3/12-5: Audio initialization and browser compliance
 */
export class MainMenuScene extends Phaser.Scene {
  private audioActivationOverlay?: AudioActivationOverlay;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  public create(): void {
    // Story 12-3: Load audio settings from localStorage
    const audioManager = AudioManager.getInstance();
    audioManager.loadSettings();

    // Story 12-5: Show audio activation overlay for browser compliance
    if (!audioManager.isActivated()) {
      this.audioActivationOverlay = new AudioActivationOverlay(this);
      this.audioActivationOverlay.onActivated = () => {
        console.log('Audio activated by user interaction');
      };
      this.audioActivationOverlay.show();
    }
    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // Title
    this.add
      .text(centerX, height * 0.15, 'OVERLORD', {
        fontSize: '64px',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(centerX, height * 0.25, 'A Strategy Game of Galactic Conquest', {
        fontSize: '20px',
        color: '#00aa00',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Menu buttons
    const buttonY = height * 0.45;
    const buttonSpacing = 70;

    // New Campaign button (AC-1)
    this.createMenuButton(centerX, buttonY, 'NEW CAMPAIGN', true, () => {
      this.scene.start('CampaignConfigScene');
    });

    // Load Campaign button (disabled placeholder)
    this.createMenuButton(centerX, buttonY + buttonSpacing, 'LOAD CAMPAIGN', false);

    // Flash Conflicts button (Story 1-1)
    this.createMenuButton(centerX, buttonY + buttonSpacing * 2, 'FLASH CONFLICTS', true, () => {
      this.scene.start('FlashConflictsScene');
    });

    // Coming soon notice
    this.add
      .text(centerX, height * 0.85, 'Load Campaign coming soon...', {
        fontSize: '14px',
        color: '#666666',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Version
    this.add
      .text(width - 10, height - 10, 'v0.3.0-campaign', {
        fontSize: '12px',
        color: '#444444',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 1);
  }

  private createMenuButton(
    x: number,
    y: number,
    text: string,
    enabled: boolean,
    onClick?: () => void
  ): Phaser.GameObjects.Text {
    const button = this.add
      .text(x, y, text, {
        fontSize: '28px',
        color: enabled ? '#ffffff' : '#555555',
        fontFamily: 'monospace',
        backgroundColor: enabled ? '#003300' : '#1a1a1a',
        padding: { x: 25, y: 12 },
      })
      .setOrigin(0.5);

    if (enabled && onClick) {
      button.setInteractive({ useHandCursor: true });

      button.on('pointerover', () => {
        button.setStyle({ backgroundColor: '#005500' });
      });

      button.on('pointerout', () => {
        button.setStyle({ backgroundColor: '#003300' });
      });

      button.on('pointerdown', onClick);
    }

    return button;
  }
}
