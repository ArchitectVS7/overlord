/**
 * LoginPanel - Login Form UI Component
 *
 * Provides email/password login form using DOM input elements
 * overlaid on the Phaser canvas.
 */

import Phaser from 'phaser';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 300;

const COLORS = {
  BACKGROUND: 0x1a1a2e,
  BORDER: 0x00bfff,
  INPUT_BG: '#0a0a1a',
  INPUT_BORDER: '#4a4a6a',
  INPUT_BORDER_FOCUS: '#00bfff',
  TEXT: '#00bfff',
  TEXT_SECONDARY: '#aaaaaa',
  BUTTON_BG: 0x002244,
  BUTTON_HOVER: 0x003366,
  BUTTON_TEXT: '#00bfff',
  ERROR: '#ff4444',
};

/**
 * LoginPanel - Container-based login form
 */
export class LoginPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private emailLabel!: Phaser.GameObjects.Text;
  private passwordLabel!: Phaser.GameObjects.Text;
  private loginButton!: Phaser.GameObjects.Rectangle;
  private loginButtonText!: Phaser.GameObjects.Text;
  private errorText!: Phaser.GameObjects.Text;
  private loadingText!: Phaser.GameObjects.Text;

  // DOM input elements
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private rememberMeCheckbox!: HTMLInputElement;
  private inputContainer!: HTMLDivElement;

  // Forgot password link
  private forgotPasswordText!: Phaser.GameObjects.Text;

  private isLoading = false;

  /**
   * Callback fired when login is attempted
   */
  public onLoginAttempt?: (email: string, password: string, rememberMe: boolean) => void;

  /**
   * Callback fired when forgot password is clicked
   */
  public onForgotPasswordClick?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.setVisible(false);

    this.createBackground();
    this.createTitle();
    this.createLabels();
    this.createForgotPasswordLink();
    this.createButton();
    this.createErrorText();
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
   * Set loading state
   */
  public setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.loadingText.setVisible(loading);
    this.loginButtonText.setText(loading ? 'SIGNING IN...' : 'SIGN IN');

    if (this.emailInput) {
      this.emailInput.disabled = loading;
    }
    if (this.passwordInput) {
      this.passwordInput.disabled = loading;
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
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 30, 'SIGN IN', {
      fontSize: '28px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createLabels(): void {
    this.emailLabel = this.scene.add.text(30, 70, 'EMAIL', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.emailLabel);

    this.passwordLabel = this.scene.add.text(30, 140, 'PASSWORD', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.passwordLabel);
  }

  private createForgotPasswordLink(): void {
    this.forgotPasswordText = this.scene.add.text(PANEL_WIDTH - 30, 192, 'Forgot Password?', {
      fontSize: '12px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.forgotPasswordText.setOrigin(1, 0);
    this.forgotPasswordText.setInteractive({ useHandCursor: true });

    this.forgotPasswordText.on('pointerover', () => {
      this.forgotPasswordText.setColor(COLORS.TEXT);
    });

    this.forgotPasswordText.on('pointerout', () => {
      this.forgotPasswordText.setColor(COLORS.TEXT_SECONDARY);
    });

    this.forgotPasswordText.on('pointerdown', () => {
      if (!this.isLoading) {
        this.onForgotPasswordClick?.();
      }
    });

    this.add(this.forgotPasswordText);
  }

  private createButton(): void {
    const buttonWidth = PANEL_WIDTH - 60;
    const buttonHeight = 45;
    const buttonY = 220;

    this.loginButton = this.scene.add.rectangle(
      PANEL_WIDTH / 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      COLORS.BUTTON_BG,
    );
    this.loginButton.setStrokeStyle(2, COLORS.BORDER);
    this.loginButton.setInteractive({ useHandCursor: true });

    this.loginButton.on('pointerover', () => {
      if (!this.isLoading) {
        this.loginButton.setFillStyle(COLORS.BUTTON_HOVER);
      }
    });

    this.loginButton.on('pointerout', () => {
      this.loginButton.setFillStyle(COLORS.BUTTON_BG);
    });

    this.loginButton.on('pointerdown', () => {
      if (!this.isLoading) {
        this.handleLogin();
      }
    });

    this.add(this.loginButton);

    this.loginButtonText = this.scene.add.text(PANEL_WIDTH / 2, buttonY, 'SIGN IN', {
      fontSize: '18px',
      color: COLORS.BUTTON_TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.loginButtonText.setOrigin(0.5, 0.5);
    this.add(this.loginButtonText);
  }

  private createErrorText(): void {
    this.errorText = this.scene.add.text(PANEL_WIDTH / 2, PANEL_HEIGHT - 30, '', {
      fontSize: '14px',
      color: COLORS.ERROR,
      fontFamily: 'monospace',
      wordWrap: { width: PANEL_WIDTH - 40 },
    });
    this.errorText.setOrigin(0.5, 0.5);
    this.errorText.setVisible(false);
    this.add(this.errorText);
  }

  private createLoadingText(): void {
    this.loadingText = this.scene.add.text(PANEL_WIDTH / 2, 280, 'Please wait...', {
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
    this.emailInput = this.createInput('email', 'Enter your email', 90);
    this.inputContainer.appendChild(this.emailInput);

    // Password input
    this.passwordInput = this.createInput('password', 'Enter your password', 160);
    this.passwordInput.type = 'password';
    this.inputContainer.appendChild(this.passwordInput);

    // Remember me checkbox
    const checkboxContainer = this.createRememberMeCheckbox(195);
    this.inputContainer.appendChild(checkboxContainer);

    // Add Enter key handler
    this.passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.isLoading) {
        this.handleLogin();
      }
    });

    document.body.appendChild(this.inputContainer);
  }

  private createRememberMeCheckbox(top: number): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: 30px;
      top: ${top}px;
      display: flex;
      align-items: center;
      gap: 8px;
      pointer-events: auto;
    `;

    this.rememberMeCheckbox = document.createElement('input');
    this.rememberMeCheckbox.type = 'checkbox';
    this.rememberMeCheckbox.id = 'remember-me';
    this.rememberMeCheckbox.style.cssText = `
      width: 16px;
      height: 16px;
      accent-color: ${COLORS.TEXT};
      cursor: pointer;
    `;

    const label = document.createElement('label');
    label.htmlFor = 'remember-me';
    label.textContent = 'Remember me';
    label.style.cssText = `
      font-size: 12px;
      font-family: monospace;
      color: ${COLORS.TEXT_SECONDARY};
      cursor: pointer;
    `;

    container.appendChild(this.rememberMeCheckbox);
    container.appendChild(label);

    return container;
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
  // Login Handler
  // ============================================

  private handleLogin(): void {
    const email = this.emailInput?.value?.trim() ?? '';
    const password = this.passwordInput?.value ?? '';
    const rememberMe = this.rememberMeCheckbox?.checked ?? false;

    this.clearError();

    // Basic validation
    if (!email) {
      this.showError('Please enter your email');
      return;
    }

    if (!password) {
      this.showError('Please enter your password');
      return;
    }

    // Trigger callback
    this.onLoginAttempt?.(email, password, rememberMe);
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
