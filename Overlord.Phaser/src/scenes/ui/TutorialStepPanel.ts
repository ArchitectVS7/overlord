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
import { COLORS as THEME_COLORS, TEXT_COLORS } from '@config/UITheme';

// Panel styling constants
const PANEL_WIDTH = 500;
const PANEL_HEIGHT = 180;
const PADDING = 20;
const BG_COLOR = THEME_COLORS.PANEL_BG;
const BORDER_COLOR = THEME_COLORS.BORDER_PRIMARY;
const TEXT_COLOR = TEXT_COLORS.PRIMARY;
const STEP_COLOR = TEXT_COLORS.ACCENT;
const COMPLETE_COLOR = TEXT_COLORS.SUCCESS;
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
  private nextButton!: Phaser.GameObjects.Container;
  private nextButtonText!: Phaser.GameObjects.Text;
  private nextButtonBg!: Phaser.GameObjects.Graphics;

  private visible: boolean = false;

  // Callbacks
  public onSkip?: () => void;
  public onNext?: () => void;
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
      fontStyle: 'bold',
    });
    this.container.add(this.stepText);

    // Instruction text
    this.instructionText = this.scene.add.text(
      PADDING,
      PADDING + 30,
      '',
      {
        fontSize: '18px',
        color: TEXT_COLOR,
        wordWrap: { width: PANEL_WIDTH - PADDING * 2 },
        lineSpacing: 4,
      },
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
        fontStyle: 'bold',
      },
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
        color: '#666666',
      },
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

    // Next button (for 'acknowledge' actions)
    this.createNextButton();
  }

  private createNextButton(): void {
    const buttonWidth = 100;
    const buttonHeight = 36;
    const x = PANEL_WIDTH - PADDING - buttonWidth;
    const y = PANEL_HEIGHT - PADDING - 50;

    this.nextButton = this.scene.add.container(x, y);

    this.nextButtonBg = this.scene.add.graphics();
    this.nextButtonBg.fillStyle(0x00bfff, 1); // Blue button
    this.nextButtonBg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    this.nextButton.add(this.nextButtonBg);

    this.nextButtonText = this.scene.add.text(buttonWidth / 2, buttonHeight / 2, 'NEXT', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      padding: { x: 30, y: 8 },
    });
    this.nextButtonText.setOrigin(0.5);
    this.nextButton.add(this.nextButtonText);

    // Use text-based interaction instead of zone (fixes scrollFactor(0) hit detection - P003)
    this.nextButtonText.setInteractive({ useHandCursor: true });

    this.nextButtonText.on('pointerover', () => {
      this.nextButtonBg.clear();
      this.nextButtonBg.fillStyle(0x33ccff, 1); // Lighter blue
      this.nextButtonBg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    });

    this.nextButtonText.on('pointerout', () => {
      this.nextButtonBg.clear();
      this.nextButtonBg.fillStyle(0x00bfff, 1);
      this.nextButtonBg.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 6);
    });

    this.nextButtonText.on('pointerdown', () => {
      this.onNext?.();
    });

    this.nextButton.setVisible(false);
    this.container.add(this.nextButton);
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
    
    // Show Next button if action target is 'acknowledge' (user just needs to read/click next)
    // Tutorial JSONs use { type: 'click_button', target: 'acknowledge' } pattern
    const showNext = step.action && 'target' in step.action && step.action.target === 'acknowledge';
    this.nextButton.setVisible(!!showNext);

    this.show();
  }

  /**
   * Show completion animation
   */
  public showCompletion(): void {
    // Hide instruction, show completion
    // Hide instruction and next button, show completion
    this.instructionText.setVisible(false);
    this.nextButton.setVisible(false);
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
          },
        });
      },
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
    this.nextButtonText.off('pointerover');
    this.nextButtonText.off('pointerout');
    this.nextButtonText.off('pointerdown');
    this.container.destroy();
  }
}
