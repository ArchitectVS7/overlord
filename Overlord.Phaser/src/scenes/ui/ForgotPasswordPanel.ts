/**
 * ForgotPasswordPanel - Password Recovery Form UI Component
 *
 * Provides email input for password reset using DOM input elements
 * overlaid on the Phaser canvas.
 */

import Phaser from 'phaser';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 250;

const COLORS = {
  BACKGROUND: 0x1a1a2e,
  BORDER: 0x00ff00,
  INPUT_BG: '#0a0a1a',
  INPUT_BORDER: '#4a4a6a',
  INPUT_BORDER_FOCUS: '#00ff00',
  TEXT: '#00ff00',
  TEXT_SECONDARY: '#aaaaaa',
  BUTTON_BG: 0x003300,
  BUTTON_HOVER: 0x005500,
  BUTTON_TEXT: '#00ff00',
  ERROR: '#ff4444',
  SUCCESS: '#00ff00',
};

/**
 * ForgotPasswordPanel - Container-based password reset form
 */
export class ForgotPasswordPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private emailLabel!: Phaser.GameObjects.Text;
  private sendButton!: Phaser.GameObjects.Rectangle;
  private sendButtonText!: Phaser.GameObjects.Text;
  private backButton!: Phaser.GameObjects.Text;
  private errorText!: Phaser.GameObjects.Text;
  private successText!: Phaser.GameObjects.Text;
  private loadingText!: Phaser.GameObjects.Text;

  // DOM input elements
  private emailInput!: HTMLInputElement;
  private inputContainer!: HTMLDivElement;

  private isLoading = false;

  /**
   * Callback fired when reset is attempted
   */
  public onResetAttempt?: (email: string) => void;

  /**
   * Callback fired when back is clicked
   */
  public onBackClick?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.setVisible(false);

    this.createBackground();
    this.createTitle();
    this.createInstruction();
    this.createLabels();
    this.createButton();
    this.createBackButton();
    this.createErrorText();
    this.createSuccessText();
    this.createLoadingText();

    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  /**
   * Show the panel and create DOM inputs
   */
  public show(): void {
    this.setVisible(true);
    this.createDOMInputs();
    this.clearError();
    this.clearSuccess();
    this.setLoading(false);
  }

  /**
   * Hide the panel and remove DOM inputs
   */
  public hide(): void {
    this.setVisible(false);
    this.removeDOMInputs();
  }

  /**
   * Display an error message
   */
  public showError(message: string): void {
    this.clearSuccess();
    this.errorText.setText(message);
    this.errorText.setVisible(true);
  }

  /**
   * Clear the error message
   */
  public clearError(): void {
    this.errorText.setText('');
    this.errorText.setVisible(false);
  }

  /**
   * Display a success message
   */
  public showSuccess(message: string): void {
    this.clearError();
    this.successText.setText(message);
    this.successText.setVisible(true);
  }

  /**
   * Clear the success message
   */
  public clearSuccess(): void {
    this.successText.setText('');
    this.successText.setVisible(false);
  }

  /**
   * Set loading state
   */
  public setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.loadingText.setVisible(loading);
    this.sendButtonText.setText(loading ? 'SENDING...' : 'SEND RESET EMAIL');

    if (this.emailInput) {
      this.emailInput.disabled = loading;
    }
  }

  /**
   * Clean up resources
   */
  public destroy(fromScene?: boolean): void {
    this.removeDOMInputs();
    super.destroy(fromScene);
  }

  // ============================================
  // UI Creation
  // ============================================

  private createBackground(): void {
    this.background = this.scene.add.graphics();
    this.background.fillStyle(COLORS.BACKGROUND, 0.98);
    this.background.fillRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.background.lineStyle(2, COLORS.BORDER);
    this.background.strokeRoundedRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT, 8);
    this.add(this.background);
  }

  private createTitle(): void {
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 25, 'RESET PASSWORD', {
      fontSize: '24px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createInstruction(): void {
    this.instructionText = this.scene.add.text(
      PANEL_WIDTH / 2,
      55,
      'Enter your email to receive a password reset link.',
      {
        fontSize: '12px',
        color: COLORS.TEXT_SECONDARY,
        fontFamily: 'monospace',
        wordWrap: { width: PANEL_WIDTH - 60 },
        align: 'center',
      },
    );
    this.instructionText.setOrigin(0.5, 0.5);
    this.add(this.instructionText);
  }

  private createLabels(): void {
    this.emailLabel = this.scene.add.text(30, 85, 'EMAIL', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.emailLabel);
  }

  private createButton(): void {
    const buttonWidth = PANEL_WIDTH - 60;
    const buttonHeight = 45;
    const buttonY = 160;

    this.sendButton = this.scene.add.rectangle(
      PANEL_WIDTH / 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      COLORS.BUTTON_BG,
    );
    this.sendButton.setStrokeStyle(2, COLORS.BORDER);
    this.sendButton.setInteractive({ useHandCursor: true });

    this.sendButton.on('pointerover', () => {
      if (!this.isLoading) {
        this.sendButton.setFillStyle(COLORS.BUTTON_HOVER);
      }
    });

    this.sendButton.on('pointerout', () => {
      this.sendButton.setFillStyle(COLORS.BUTTON_BG);
    });

    this.sendButton.on('pointerdown', () => {
      if (!this.isLoading) {
        this.handleReset();
      }
    });

    this.add(this.sendButton);

    this.sendButtonText = this.scene.add.text(PANEL_WIDTH / 2, buttonY, 'SEND RESET EMAIL', {
      fontSize: '16px',
      color: COLORS.BUTTON_TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.sendButtonText.setOrigin(0.5, 0.5);
    this.add(this.sendButtonText);
  }

  private createBackButton(): void {
    this.backButton = this.scene.add.text(30, PANEL_HEIGHT - 25, '← Back to Sign In', {
      fontSize: '12px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.backButton.setInteractive({ useHandCursor: true });

    this.backButton.on('pointerover', () => {
      this.backButton.setColor(COLORS.TEXT);
    });

    this.backButton.on('pointerout', () => {
      this.backButton.setColor(COLORS.TEXT_SECONDARY);
    });

    this.backButton.on('pointerdown', () => {
      if (!this.isLoading) {
        this.onBackClick?.();
      }
    });

    this.add(this.backButton);
  }

  private createErrorText(): void {
    this.errorText = this.scene.add.text(PANEL_WIDTH / 2, 195, '', {
      fontSize: '12px',
      color: COLORS.ERROR,
      fontFamily: 'monospace',
      wordWrap: { width: PANEL_WIDTH - 40 },
      align: 'center',
    });
    this.errorText.setOrigin(0.5, 0);
    this.errorText.setVisible(false);
    this.add(this.errorText);
  }

  private createSuccessText(): void {
    this.successText = this.scene.add.text(PANEL_WIDTH / 2, 195, '', {
      fontSize: '12px',
      color: COLORS.SUCCESS,
      fontFamily: 'monospace',
      wordWrap: { width: PANEL_WIDTH - 40 },
      align: 'center',
    });
    this.successText.setOrigin(0.5, 0);
    this.successText.setVisible(false);
    this.add(this.successText);
  }

  private createLoadingText(): void {
    this.loadingText = this.scene.add.text(PANEL_WIDTH / 2, PANEL_HEIGHT - 25, 'Please wait...', {
      fontSize: '12px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.loadingText.setOrigin(0.5, 0.5);
    this.loadingText.setVisible(false);
    this.add(this.loadingText);
  }

  // ============================================
  // DOM Input Management
  // ============================================

  private createDOMInputs(): void {
    // Remove any existing inputs
    this.removeDOMInputs();

    // Get canvas position for overlay positioning
    const canvas = this.scene.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();

    // Calculate panel position in screen coordinates
    const panelX = this.x + canvasRect.left;
    const panelY = this.y + canvasRect.top;

    // Create container for inputs
    this.inputContainer = document.createElement('div');
    this.inputContainer.style.position = 'absolute';
    this.inputContainer.style.left = `${panelX}px`;
    this.inputContainer.style.top = `${panelY}px`;
    this.inputContainer.style.width = `${PANEL_WIDTH}px`;
    this.inputContainer.style.height = `${PANEL_HEIGHT}px`;
    this.inputContainer.style.pointerEvents = 'none';
    this.inputContainer.style.zIndex = '1000';

    // Email input
    this.emailInput = this.createInput('email', 'Enter your email address', 105);
    this.inputContainer.appendChild(this.emailInput);

    // Add Enter key handler
    this.emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.isLoading) {
        this.handleReset();
      }
    });

    document.body.appendChild(this.inputContainer);
  }

  private createInput(name: string, placeholder: string, top: number): HTMLInputElement {
    const input = document.createElement('input');
    input.name = name;
    input.placeholder = placeholder;
    input.autocomplete = name as AutoFill;
    input.style.cssText = `
      position: absolute;
      left: 30px;
      top: ${top}px;
      width: ${PANEL_WIDTH - 60}px;
      height: 36px;
      padding: 8px 12px;
      font-size: 16px;
      font-family: monospace;
      color: ${COLORS.TEXT};
      background-color: ${COLORS.INPUT_BG};
      border: 1px solid ${COLORS.INPUT_BORDER};
      border-radius: 4px;
      outline: none;
      pointer-events: auto;
      box-sizing: border-box;
    `;

    input.addEventListener('focus', () => {
      input.style.borderColor = COLORS.INPUT_BORDER_FOCUS;
    });

    input.addEventListener('blur', () => {
      input.style.borderColor = COLORS.INPUT_BORDER;
    });

    return input;
  }

  private removeDOMInputs(): void {
    if (this.inputContainer && this.inputContainer.parentNode) {
      this.inputContainer.parentNode.removeChild(this.inputContainer);
    }
  }

  // ============================================
  // Reset Handler
  // ============================================

  private handleReset(): void {
    const email = this.emailInput?.value?.trim() ?? '';

    this.clearError();
    this.clearSuccess();

    // Basic validation
    if (!email) {
      this.showError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    // Trigger callback
    this.onResetAttempt?.(email);
  }

  /**
   * Update input positions when panel moves
   */
  public updateInputPositions(): void {
    if (!this.inputContainer || !this.visible) {
      return;
    }

    const canvas = this.scene.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const panelX = this.x + canvasRect.left;
    const panelY = this.y + canvasRect.top;

    this.inputContainer.style.left = `${panelX}px`;
    this.inputContainer.style.top = `${panelY}px`;
  }
}
