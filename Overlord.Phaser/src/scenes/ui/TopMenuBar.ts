/**
 * TopMenuBar
 * Top menu bar with navigation, help, and audio controls.
 * Fixed to top of screen, unaffected by camera movement.
 */

import Phaser from 'phaser';
import { AudioManager } from '../../core/AudioManager';
import { HelpPanel } from './HelpPanel';
import { COLORS as THEME_COLORS, TEXT_COLORS, FONTS, HUD, PANEL } from '@config/UITheme';

const BAR_HEIGHT = HUD.MENU_BAR.height;
const BAR_DEPTH = PANEL.DEPTH_NOTIFICATION; // High depth for menu bar

const COLORS = {
  BAR_BG: THEME_COLORS.PANEL_BG,
  BAR_BORDER: THEME_COLORS.BORDER_SUBTLE,
  ICON_DEFAULT: TEXT_COLORS.SECONDARY,
  ICON_HOVER: TEXT_COLORS.PRIMARY,
  ICON_ACTIVE: TEXT_COLORS.ACCENT,
  ICON_MUTED: TEXT_COLORS.DANGER,
};

export interface TopMenuBarOptions {
  showHome?: boolean;
  showHelp?: boolean;
  showResetCamera?: boolean;
  showResearch?: boolean;
  onResetCamera?: () => void;
  onResearch?: () => void;
}

/**
 * TopMenuBar - Top menu bar with home navigation, help, reset camera, and audio toggle
 * Uses individual elements with scrollFactor(0) for proper fixed positioning.
 */
export class TopMenuBar {
  private scene: Phaser.Scene;
  private audioManager: AudioManager;
  private barBackground!: Phaser.GameObjects.Rectangle;
  private barBorder!: Phaser.GameObjects.Rectangle;
  private homeButton!: Phaser.GameObjects.Text;
  private helpButton!: Phaser.GameObjects.Text;
  private resetCameraButton!: Phaser.GameObjects.Text;
  private researchButton!: Phaser.GameObjects.Text;
  private speakerIcon!: Phaser.GameObjects.Text;
  private helpPanel!: HelpPanel;
  private options: TopMenuBarOptions;
  private elements: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, options: TopMenuBarOptions = {}) {
    this.scene = scene;
    this.options = {
      showHome: true,
      showHelp: false,
      showResetCamera: false,
      ...options,
    };
    this.audioManager = AudioManager.getInstance();

    this.createBar();
    if (this.options.showHome) {
      this.createHomeButton();
    }
    if (this.options.showHelp) {
      this.createHelpButton();
      this.createHelpPanel();
    }
    if (this.options.showResetCamera) {
      this.createResetCameraButton();
    }
    if (this.options.showResearch) {
      this.createResearchButton();
    }
    this.createSpeakerIcon();
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
    this.barBackground.setScrollFactor(0);
    this.barBackground.setDepth(BAR_DEPTH);
    this.elements.push(this.barBackground);

    // Bottom border line
    this.barBorder = this.scene.add.rectangle(
      width / 2,
      BAR_HEIGHT,
      width,
      1,
      COLORS.BAR_BORDER
    );
    this.barBorder.setScrollFactor(0);
    this.barBorder.setDepth(BAR_DEPTH);
    this.elements.push(this.barBorder);
  }

  private createHomeButton(): void {
    const iconX = 15;
    const iconY = BAR_HEIGHT / 2;

    this.homeButton = this.scene.add.text(iconX, iconY, '🏠 HOME', {
      fontSize: '14px',
      color: COLORS.ICON_DEFAULT,
      fontFamily: FONTS.PRIMARY,
    });
    this.homeButton.setOrigin(0, 0.5);
    this.homeButton.setScrollFactor(0);
    this.homeButton.setDepth(BAR_DEPTH + 1);
    this.homeButton.setInteractive({ useHandCursor: true });
    this.elements.push(this.homeButton);

    // Click handler - navigate to BBS game
    this.homeButton.on('pointerdown', () => {
      this.scene.scene.start('BBSGameScene');
    });

    // Hover effects
    this.homeButton.on('pointerover', () => {
      this.homeButton.setColor(COLORS.ICON_HOVER);
    });

    this.homeButton.on('pointerout', () => {
      this.homeButton.setColor(COLORS.ICON_DEFAULT);
    });
  }

  private createHelpButton(): void {
    // Position after HOME button
    const iconX = this.options.showHome ? 110 : 15;
    const iconY = BAR_HEIGHT / 2;

    this.helpButton = this.scene.add.text(iconX, iconY, '❓ HELP', {
      fontSize: '14px',
      color: COLORS.ICON_DEFAULT,
      fontFamily: FONTS.PRIMARY,
    });
    this.helpButton.setOrigin(0, 0.5);
    this.helpButton.setScrollFactor(0);
    this.helpButton.setDepth(BAR_DEPTH + 1);
    this.helpButton.setInteractive({ useHandCursor: true });
    this.elements.push(this.helpButton);

    // Click handler - toggle help panel
    this.helpButton.on('pointerdown', () => {
      this.toggleHelpPanel();
    });

    // Hover effects
    this.helpButton.on('pointerover', () => {
      this.helpButton.setColor(COLORS.ICON_HOVER);
    });

    this.helpButton.on('pointerout', () => {
      if (!this.helpPanel?.isVisible()) {
        this.helpButton.setColor(COLORS.ICON_DEFAULT);
      }
    });
  }

  private createResetCameraButton(): void {
    // Position after HELP button
    let iconX = 15;
    if (this.options.showHome) iconX += 95;
    if (this.options.showHelp) iconX += 80;
    const iconY = BAR_HEIGHT / 2;

    this.resetCameraButton = this.scene.add.text(iconX, iconY, '🎯 RESET', {
      fontSize: '14px',
      color: COLORS.ICON_DEFAULT,
      fontFamily: FONTS.PRIMARY,
    });
    this.resetCameraButton.setOrigin(0, 0.5);
    this.resetCameraButton.setScrollFactor(0);
    this.resetCameraButton.setDepth(BAR_DEPTH + 1);
    this.resetCameraButton.setInteractive({ useHandCursor: true });
    this.elements.push(this.resetCameraButton);

    // Click handler - call onResetCamera callback
    this.resetCameraButton.on('pointerdown', () => {
      this.options.onResetCamera?.();
    });

    // Hover effects
    this.resetCameraButton.on('pointerover', () => {
      this.resetCameraButton.setColor(COLORS.ICON_HOVER);
    });

    this.resetCameraButton.on('pointerout', () => {
      this.resetCameraButton.setColor(COLORS.ICON_DEFAULT);
    });
  }

  private createResearchButton(): void {
    // Position after other buttons
    let iconX = 15;
    if (this.options.showHome) iconX += 95;
    if (this.options.showHelp) iconX += 80;
    if (this.options.showResetCamera) iconX += 90;
    const iconY = BAR_HEIGHT / 2;

    this.researchButton = this.scene.add.text(iconX, iconY, '🔬 RESEARCH', {
      fontSize: '14px',
      color: COLORS.ICON_DEFAULT,
      fontFamily: FONTS.PRIMARY,
    });
    this.researchButton.setOrigin(0, 0.5);
    this.researchButton.setScrollFactor(0);
    this.researchButton.setDepth(BAR_DEPTH + 1);
    this.researchButton.setInteractive({ useHandCursor: true });
    this.elements.push(this.researchButton);

    // Click handler - call onResearch callback
    this.researchButton.on('pointerdown', () => {
      this.options.onResearch?.();
    });

    // Hover effects
    this.researchButton.on('pointerover', () => {
      this.researchButton.setColor(COLORS.ICON_HOVER);
    });

    this.researchButton.on('pointerout', () => {
      this.researchButton.setColor(COLORS.ICON_DEFAULT);
    });
  }

  private createHelpPanel(): void {
    this.helpPanel = new HelpPanel(this.scene);
    this.helpPanel.onClose = () => {
      this.helpButton?.setColor(COLORS.ICON_DEFAULT);
    };
  }

  private toggleHelpPanel(): void {
    if (this.helpPanel) {
      this.helpPanel.toggle();
      if (this.helpPanel.isVisible()) {
        this.helpButton.setColor(COLORS.ICON_ACTIVE);
      } else {
        this.helpButton.setColor(COLORS.ICON_DEFAULT);
      }
    }
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
    this.speakerIcon.setScrollFactor(0);
    this.speakerIcon.setDepth(BAR_DEPTH + 1);
    this.speakerIcon.setInteractive({ useHandCursor: true });
    this.elements.push(this.speakerIcon);

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
   * Show the help panel programmatically
   */
  public showHelp(): void {
    if (this.helpPanel && !this.helpPanel.isVisible()) {
      this.helpPanel.show();
      this.helpButton?.setColor(COLORS.ICON_ACTIVE);
    }
  }

  /**
   * Hide the help panel programmatically
   */
  public hideHelp(): void {
    if (this.helpPanel && this.helpPanel.isVisible()) {
      this.helpPanel.hide();
      this.helpButton?.setColor(COLORS.ICON_DEFAULT);
    }
  }

  /**
   * Get the bar height for layout purposes
   */
  public static getHeight(): number {
    return BAR_HEIGHT;
  }

  /**
   * No-op for compatibility - elements already have scrollFactor set
   */
  public setScrollFactor(_factor: number): this {
    // Elements already have scrollFactor(0) set individually
    return this;
  }

  public destroy(): void {
    // Destroy all tracked elements
    for (const element of this.elements) {
      element.destroy();
    }
    this.elements = [];
    this.helpPanel?.destroy();
  }
}
