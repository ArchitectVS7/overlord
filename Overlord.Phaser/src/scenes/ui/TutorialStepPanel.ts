/**
 * TutorialStepPanel - UI panel for tutorial step display
 * Story 1-4: Tutorial Step Guidance System
 *
 * Features:
 * - Display step number and total
 * - Display instruction text
 * - Show "Step Complete!" animation
 * - Progress indicators
 * - Skip tutorial option
 */

import Phaser from 'phaser';
import { TutorialStep } from '@core/models/TutorialModels';

// Panel styling constants
const PANEL_WIDTH = 450;
const PANEL_HEIGHT = 140;
const PADDING = 20;
const BG_COLOR = 0x1a2a3a;
const BORDER_COLOR = 0x4488ff;
const TEXT_COLOR = '#ffffff';
const STEP_COLOR = '#88bbff';
const COMPLETE_COLOR = '#44ff44';
const PANEL_DEPTH = 1600;

/**
 * UI panel for displaying tutorial step instructions
 */
export class TutorialStepPanel {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private background!: Phaser.GameObjects.Graphics;
  private stepText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private completionText!: Phaser.GameObjects.Text;
  private skipButton!: Phaser.GameObjects.Text;

  private visible: boolean = false;

  // Callbacks
  public onSkip?: () => void;
  public onCompletionDone?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createPanel();
    this.hide();
  }

  /**
   * Create the panel UI elements
   */
  private createPanel(): void {
    const camera = this.scene.cameras.main;
    const x = (camera.width - PANEL_WIDTH) / 2;
    const y = camera.height - PANEL_HEIGHT - 40; // Near bottom of screen

    // Container for all panel elements
    this.container = this.scene.add.container(x, y);
    this.container.setDepth(PANEL_DEPTH);
    this.container.setScrollFactor(0);

    // Background
    this.background = this.scene.add.graphics();
    this.background.fillStyle(BG_COLOR, 0.95);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.background.lineStyle(2, BORDER_COLOR, 1);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.container.add(this.background);

    // Step counter (e.g., "Step 1 of 5")
    this.stepText = this.scene.add.text(PADDING, PADDING, '', {
      fontSize: '16px',
      color: STEP_COLOR,
      fontStyle: 'bold'
    });
    this.container.add(this.stepText);

    // Instruction text
    this.instructionText = this.scene.add.text(
      PADDING,
      PADDING + 30,
      '',
      {
        fontSize: '20px',
        color: TEXT_COLOR,
        wordWrap: { width: PANEL_WIDTH - PADDING * 2 }
      }
    );
    this.container.add(this.instructionText);

    // Completion text (hidden by default)
    this.completionText = this.scene.add.text(
      PANEL_WIDTH / 2,
      PANEL_HEIGHT / 2,
      'Step Complete!',
      {
        fontSize: '24px',
        color: COMPLETE_COLOR,
        fontStyle: 'bold'
      }
    );
    this.completionText.setOrigin(0.5);
    this.completionText.setVisible(false);
    this.container.add(this.completionText);

    // Skip button
    this.skipButton = this.scene.add.text(
      PANEL_WIDTH - PADDING,
      PANEL_HEIGHT - PADDING - 10,
      'Skip Tutorial',
      {
        fontSize: '14px',
        color: '#666666'
      }
    );
    this.skipButton.setOrigin(1, 1);
    this.skipButton.setInteractive({ useHandCursor: true });
    this.skipButton.on('pointerover', () => {
      this.skipButton.setColor('#aaaaaa');
    });
    this.skipButton.on('pointerout', () => {
      this.skipButton.setColor('#666666');
    });
    this.skipButton.on('pointerdown', () => {
      this.triggerSkip();
    });
    this.container.add(this.skipButton);
  }

  /**
   * Show a tutorial step
   * @param step The tutorial step to display
   * @param currentIndex Current step index (1-based for display)
   * @param totalSteps Total number of steps
   */
  public showStep(step: TutorialStep, currentIndex: number, totalSteps: number): void {
    this.stepText.setText(`Step ${currentIndex} of ${totalSteps}`);
    this.instructionText.setText(step.text);
    this.completionText.setVisible(false);
    this.show();
  }

  /**
   * Show completion animation
   */
  public showCompletion(): void {
    // Hide instruction, show completion
    this.instructionText.setVisible(false);
    this.completionText.setVisible(true);
    this.completionText.setAlpha(0);

    // Animate completion text
    this.scene.tweens.add({
      targets: this.completionText,
      alpha: 1,
      scale: { from: 0.8, to: 1 },
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Brief pause, then notify completion
        this.scene.tweens.add({
          targets: this.completionText,
          alpha: 0,
          duration: 200,
          delay: 500,
          onComplete: () => {
            this.instructionText.setVisible(true);
            this.completionText.setVisible(false);
            this.onCompletionDone?.();
          }
        });
      }
    });
  }

  /**
   * Trigger skip action
   */
  public triggerSkip(): void {
    this.onSkip?.();
  }

  /**
   * Show the panel
   */
  public show(): void {
    this.visible = true;
    this.container.setVisible(true);
  }

  /**
   * Hide the panel
   */
  public hide(): void {
    this.visible = false;
    this.container.setVisible(false);
  }

  /**
   * Check if panel is visible
   */
  public isVisible(): boolean {
    return this.visible;
  }

  /**
   * Destroy the panel
   */
  public destroy(): void {
    this.scene.tweens.killTweensOf(this.completionText);
    this.skipButton.off('pointerover');
    this.skipButton.off('pointerout');
    this.skipButton.off('pointerdown');
    this.container.destroy();
  }
}
