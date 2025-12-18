/**
 * RegisterPanel - Registration Form UI Component
 *
 * Provides username/email/password registration form using DOM input elements
 * overlaid on the Phaser canvas.
 */

import Phaser from 'phaser';

const PANEL_WIDTH = 400;
const PANEL_HEIGHT = 400;

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
  STRENGTH_WEAK: '#ff4444',
  STRENGTH_FAIR: '#ffaa00',
  STRENGTH_GOOD: '#88cc00',
  STRENGTH_STRONG: '#00ff00',
};

/**
 * Password strength levels
 */
type PasswordStrength = 'none' | 'weak' | 'fair' | 'good' | 'strong';

/**
 * RegisterPanel - Container-based registration form
 */
export class RegisterPanel extends Phaser.GameObjects.Container {
  private background!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private usernameLabel!: Phaser.GameObjects.Text;
  private emailLabel!: Phaser.GameObjects.Text;
  private passwordLabel!: Phaser.GameObjects.Text;
  private confirmLabel!: Phaser.GameObjects.Text;
  private registerButton!: Phaser.GameObjects.Rectangle;
  private registerButtonText!: Phaser.GameObjects.Text;
  private errorText!: Phaser.GameObjects.Text;
  private loadingText!: Phaser.GameObjects.Text;

  // DOM input elements
  private usernameInput!: HTMLInputElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private confirmPasswordInput!: HTMLInputElement;
  private inputContainer!: HTMLDivElement;

  // Password strength indicator
  private strengthBar!: HTMLDivElement;
  private strengthText!: Phaser.GameObjects.Text;

  private isLoading = false;

  /**
   * Callback fired when registration is attempted
   */
  public onRegisterAttempt?: (email: string, password: string, username: string) => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.setVisible(false);

    this.createBackground();
    this.createTitle();
    this.createLabels();
    this.createStrengthText();
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
    this.registerButtonText.setText(loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT');

    if (this.usernameInput) {this.usernameInput.disabled = loading;}
    if (this.emailInput) {this.emailInput.disabled = loading;}
    if (this.passwordInput) {this.passwordInput.disabled = loading;}
    if (this.confirmPasswordInput) {this.confirmPasswordInput.disabled = loading;}
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
    this.titleText = this.scene.add.text(PANEL_WIDTH / 2, 30, 'CREATE ACCOUNT', {
      fontSize: '28px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.add(this.titleText);
  }

  private createLabels(): void {
    this.usernameLabel = this.scene.add.text(30, 60, 'USERNAME', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.usernameLabel);

    this.emailLabel = this.scene.add.text(30, 120, 'EMAIL', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.emailLabel);

    this.passwordLabel = this.scene.add.text(30, 180, 'PASSWORD', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.passwordLabel);

    this.confirmLabel = this.scene.add.text(30, 240, 'CONFIRM PASSWORD', {
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.add(this.confirmLabel);
  }

  private createStrengthText(): void {
    // Password strength label - positioned below password input
    this.strengthText = this.scene.add.text(PANEL_WIDTH - 30, 228, '', {
      fontSize: '11px',
      color: COLORS.TEXT_SECONDARY,
      fontFamily: 'monospace',
    });
    this.strengthText.setOrigin(1, 0.5);
    this.add(this.strengthText);
  }

  private createButton(): void {
    const buttonWidth = PANEL_WIDTH - 60;
    const buttonHeight = 45;
    const buttonY = 320;

    this.registerButton = this.scene.add.rectangle(
      PANEL_WIDTH / 2,
      buttonY,
      buttonWidth,
      buttonHeight,
      COLORS.BUTTON_BG,
    );
    this.registerButton.setStrokeStyle(2, COLORS.BORDER);
    this.registerButton.setInteractive({ useHandCursor: true });

    this.registerButton.on('pointerover', () => {
      if (!this.isLoading) {
        this.registerButton.setFillStyle(COLORS.BUTTON_HOVER);
      }
    });

    this.registerButton.on('pointerout', () => {
      this.registerButton.setFillStyle(COLORS.BUTTON_BG);
    });

    this.registerButton.on('pointerdown', () => {
      if (!this.isLoading) {
        this.handleRegister();
      }
    });

    this.add(this.registerButton);

    this.registerButtonText = this.scene.add.text(PANEL_WIDTH / 2, buttonY, 'CREATE ACCOUNT', {
      fontSize: '18px',
      color: COLORS.BUTTON_TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.registerButtonText.setOrigin(0.5, 0.5);
    this.add(this.registerButtonText);
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
    this.loadingText = this.scene.add.text(PANEL_WIDTH / 2, PANEL_HEIGHT - 10, 'Please wait...', {
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

    // Username input
    this.usernameInput = this.createInput('username', 'Choose a username', 78);
    this.inputContainer.appendChild(this.usernameInput);

    // Email input
    this.emailInput = this.createInput('email', 'Enter your email', 138);
    this.inputContainer.appendChild(this.emailInput);

    // Password input
    this.passwordInput = this.createInput('new-password', 'Create a password', 198);
    this.passwordInput.type = 'password';
    this.inputContainer.appendChild(this.passwordInput);

    // Password strength bar
    this.strengthBar = this.createStrengthBar(230);
    this.inputContainer.appendChild(this.strengthBar);

    // Listen for password changes
    this.passwordInput.addEventListener('input', () => {
      this.updateStrengthIndicator(this.passwordInput.value);
    });

    // Confirm password input
    this.confirmPasswordInput = this.createInput('confirm-password', 'Confirm password', 258);
    this.confirmPasswordInput.type = 'password';
    this.inputContainer.appendChild(this.confirmPasswordInput);

    // Add Enter key handler
    this.confirmPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !this.isLoading) {
        this.handleRegister();
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
      height: 32px;
      padding: 6px 12px;
      font-size: 15px;
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

  private createStrengthBar(top: number): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: 30px;
      top: ${top}px;
      width: ${PANEL_WIDTH - 100}px;
      height: 4px;
      background-color: ${COLORS.INPUT_BORDER};
      border-radius: 2px;
      overflow: hidden;
      pointer-events: none;
    `;

    const bar = document.createElement('div');
    bar.id = 'password-strength-fill';
    bar.style.cssText = `
      width: 0%;
      height: 100%;
      background-color: ${COLORS.STRENGTH_WEAK};
      border-radius: 2px;
      transition: width 0.2s ease, background-color 0.2s ease;
    `;

    container.appendChild(bar);
    return container;
  }

  /**
   * Calculate password strength based on various criteria
   */
  private calculatePasswordStrength(password: string): PasswordStrength {
    if (!password) {
      return 'none';
    }

    let score = 0;

    // Length checks
    if (password.length >= 6) {score += 1;}
    if (password.length >= 8) {score += 1;}
    if (password.length >= 12) {score += 1;}

    // Character variety checks
    if (/[a-z]/.test(password)) {score += 1;}
    if (/[A-Z]/.test(password)) {score += 1;}
    if (/[0-9]/.test(password)) {score += 1;}
    if (/[^a-zA-Z0-9]/.test(password)) {score += 1;}

    // Bonus for mixing character types
    const types = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ].filter(Boolean).length;

    if (types >= 3) {score += 1;}
    if (types === 4) {score += 1;}

    // Map score to strength level
    if (score <= 2) {return 'weak';}
    if (score <= 4) {return 'fair';}
    if (score <= 6) {return 'good';}
    return 'strong';
  }

  /**
   * Update the password strength indicator visuals
   */
  private updateStrengthIndicator(password: string): void {
    const strength = this.calculatePasswordStrength(password);
    const fill = this.strengthBar?.querySelector('#password-strength-fill') as HTMLDivElement;

    if (!fill || !this.strengthText) {
      return;
    }

    let widthPercent = 0;
    let color = COLORS.TEXT_SECONDARY;
    let text = '';

    switch (strength) {
      case 'none':
        widthPercent = 0;
        text = '';
        break;
      case 'weak':
        widthPercent = 25;
        color = COLORS.STRENGTH_WEAK;
        text = 'WEAK';
        break;
      case 'fair':
        widthPercent = 50;
        color = COLORS.STRENGTH_FAIR;
        text = 'FAIR';
        break;
      case 'good':
        widthPercent = 75;
        color = COLORS.STRENGTH_GOOD;
        text = 'GOOD';
        break;
      case 'strong':
        widthPercent = 100;
        color = COLORS.STRENGTH_STRONG;
        text = 'STRONG';
        break;
    }

    fill.style.width = `${widthPercent}%`;
    fill.style.backgroundColor = color;
    this.strengthText.setText(text);
    this.strengthText.setColor(color);
  }

  private removeDOMInputs(): void {
    if (this.inputContainer && this.inputContainer.parentNode) {
      this.inputContainer.parentNode.removeChild(this.inputContainer);
    }
  }

  // ============================================
  // Registration Handler
  // ============================================

  private handleRegister(): void {
    const username = this.usernameInput?.value?.trim() ?? '';
    const email = this.emailInput?.value?.trim() ?? '';
    const password = this.passwordInput?.value ?? '';
    const confirmPassword = this.confirmPasswordInput?.value ?? '';

    this.clearError();

    // Validation
    const error = this.validate(username, email, password, confirmPassword);
    if (error) {
      this.showError(error);
      return;
    }

    // Trigger callback
    this.onRegisterAttempt?.(email, password, username);
  }

  private validate(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): string | null {
    // Username validation
    if (!username) {
      return 'Please enter a username';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (username.length > 20) {
      return 'Username must be 20 characters or less';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    // Email validation
    if (!email) {
      return 'Please enter your email';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      return 'Please enter a password';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    // Confirm password
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
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
