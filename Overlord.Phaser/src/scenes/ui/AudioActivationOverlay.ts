/**
 * AudioActivationOverlay
 * Story 12-5: User Activation for Browser Audio Compliance
 *
 * Displays a prompt to enable audio (required by browser security policies).
 * Audio context must be unlocked by user interaction before any audio can play.
 */

import Phaser from 'phaser';
import { AudioManager } from '../../core/AudioManager';

const OVERLAY_DEPTH = 2000;

const COLORS = {
  OVERLAY: 0x000000,
  OVERLAY_ALPHA: 0.7,
  BOX_BG: 0x1a1a2e,
  BOX_BORDER: 0x4a4a6a,
  TEXT: '#ffffff',
  TEXT_SECONDARY: '#aaaacc',
  ICON: '#4488ff',
};

/**
 * AudioActivationOverlay - Prompts user to enable audio
 *
 * Browser security policies require user interaction before audio can play.
 * This overlay displays a prompt and activates the audio context when
 * the user clicks or presses a key.
 */
export class AudioActivationOverlay extends Phaser.GameObjects.Container {
  private audioManager: AudioManager;
  private activated: boolean = false;
  private dismissed: boolean = false;

  // UI Elements
  private backgroundOverlay!: Phaser.GameObjects.Rectangle;
  private messageBox!: Phaser.GameObjects.Graphics;
  private iconText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private subText!: Phaser.GameObjects.Text;
  private interactiveRegion!: Phaser.GameObjects.Rectangle;

  // Callback
  public onActivated: (() => void) | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.audioManager = AudioManager.getInstance();
    this.setDepth(OVERLAY_DEPTH);
    this.setVisible(true);

    this.createOverlay();
    this.setupInputHandlers();

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  // ============================================
  // UI Creation
  // ============================================

  private createOverlay(): void {
    const { width, height } = this.scene.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Full-screen semi-transparent background
    this.backgroundOverlay = this.scene.add.rectangle(
      centerX,
      centerY,
      width,
      height,
    );
    this.backgroundOverlay.setFillStyle(COLORS.OVERLAY, COLORS.OVERLAY_ALPHA);
    this.backgroundOverlay.setOrigin(0.5, 0.5);
    this.add(this.backgroundOverlay);

    // Message box
    const boxWidth = 400;
    const boxHeight = 200;
    this.messageBox = this.scene.add.graphics();
    this.messageBox.fillStyle(COLORS.BOX_BG, 0.95);
    this.messageBox.fillRoundedRect(
      centerX - boxWidth / 2,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      15,
    );
    this.messageBox.lineStyle(2, COLORS.BOX_BORDER);
    this.messageBox.strokeRoundedRect(
      centerX - boxWidth / 2,
      centerY - boxHeight / 2,
      boxWidth,
      boxHeight,
      15,
    );
    this.add(this.messageBox);

    // Speaker icon (using text emoji)
    this.iconText = this.scene.add.text(centerX, centerY - 50, '🔊', {
      fontSize: '48px',
    });
    this.iconText.setOrigin(0.5, 0.5);
    this.add(this.iconText);

    // Main message
    this.messageText = this.scene.add.text(
      centerX,
      centerY + 10,
      'Click anywhere or press any key to enable audio',
      {
        fontSize: '18px',
        color: COLORS.TEXT,
        align: 'center',
      },
    );
    this.messageText.setOrigin(0.5, 0.5);
    this.add(this.messageText);

    // Sub text
    this.subText = this.scene.add.text(
      centerX,
      centerY + 45,
      'Audio is optional and can be enabled later in Settings',
      {
        fontSize: '14px',
        color: COLORS.TEXT_SECONDARY,
        align: 'center',
      },
    );
    this.subText.setOrigin(0.5, 0.5);
    this.add(this.subText);

    // Invisible interactive region covering full screen
    this.interactiveRegion = this.scene.add.rectangle(
      centerX,
      centerY,
      width,
      height,
    );
    this.interactiveRegion.setFillStyle(0x000000, 0);
    this.interactiveRegion.setOrigin(0.5, 0.5);
    this.interactiveRegion.setInteractive({ useHandCursor: true });
    this.add(this.interactiveRegion);

    // Click handler
    this.interactiveRegion.on('pointerdown', () => {
      this.activate();
    });
  }

  private setupInputHandlers(): void {
    // Keyboard handler
    this.scene.input.keyboard?.on('keydown', () => {
      if (this.visible && !this.activated) {
        this.activate();
      }
    });
  }

  // ============================================
  // Public Methods
  // ============================================

  /**
   * Get the activation message text
   */
  public getMessage(): string {
    return 'Click anywhere or press any key to enable audio';
  }

  /**
   * Get the depth value
   */
  public getDepthValue(): number {
    return OVERLAY_DEPTH;
  }

  /**
   * Activate audio and hide overlay
   */
  public activate(): void {
    if (this.activated) {return;}

    this.activated = true;
    this.audioManager.activate();
    this.setVisible(false);
    this.onActivated?.();
  }

  /**
   * Show the overlay (unless already activated)
   */
  public show(): void {
    if (!this.activated) {
      this.setVisible(true);
    }
  }

  /**
   * Hide the overlay
   */
  public hide(): void {
    this.setVisible(false);
  }

  /**
   * Dismiss overlay without activating audio
   * User can activate later in settings
   */
  public dismiss(): void {
    this.dismissed = true;
    this.setVisible(false);
  }

  /**
   * Check if audio can be activated later (was dismissed without activating)
   */
  public canActivateLater(): boolean {
    return this.dismissed && !this.activated;
  }

  /**
   * Static helper to check if activation is needed
   */
  public static needsActivation(): boolean {
    return !AudioManager.getInstance().isActivated();
  }

  // ============================================
  // UI Element Queries
  // ============================================

  public hasBackgroundOverlay(): boolean {
    return !!this.backgroundOverlay;
  }

  public hasMessageText(): boolean {
    return !!this.messageText;
  }

  public hasInteractiveRegion(): boolean {
    return !!this.interactiveRegion;
  }

  // ============================================
  // Cleanup
  // ============================================

  public destroy(): void {
    this.backgroundOverlay?.destroy();
    this.messageBox?.destroy();
    this.iconText?.destroy();
    this.messageText?.destroy();
    this.subText?.destroy();
    this.interactiveRegion?.destroy();
    super.destroy();
  }
}
