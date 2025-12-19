/**
 * AuthScene - Authentication Scene
 *
 * Full-screen authentication scene with login/register tabs.
 * Redirects to MainMenuScene if already authenticated.
 */

import Phaser from 'phaser';
import { LoginPanel } from './ui/LoginPanel';
import { RegisterPanel } from './ui/RegisterPanel';
import { ForgotPasswordPanel } from './ui/ForgotPasswordPanel';
import { getAuthService } from '@services/AuthService';
import { getSaveService } from '@services/SaveService';
import { getScenarioSyncService } from '@services/ScenarioSyncService';
import { getUserProfileService } from '@services/UserProfileService';
import { getGuestModeService } from '@services/GuestModeService';
import { TopMenuBar } from './ui/TopMenuBar';

const COLORS = {
  BACKGROUND: 0x0a0a1a,
  TEXT: '#00bfff',
  TEXT_INACTIVE: '#555555',
  TAB_ACTIVE: 0x002244,
  TAB_INACTIVE: 0x1a1a2e,
  TAB_BORDER: 0x00bfff,
};

type AuthTab = 'login' | 'register' | 'forgot-password';

/**
 * AuthScene - Authentication flow before main menu
 */
export class AuthScene extends Phaser.Scene {
  private loginPanel!: LoginPanel;
  private registerPanel!: RegisterPanel;
  private forgotPasswordPanel!: ForgotPasswordPanel;
  private loginTab!: Phaser.GameObjects.Rectangle;
  private registerTab!: Phaser.GameObjects.Rectangle;
  private loginTabText!: Phaser.GameObjects.Text;
  private registerTabText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private guestButton!: Phaser.GameObjects.Text;
  private syncingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'AuthScene' });
  }

  public async create(): Promise<void> {
    const { width, height } = this.scale;

    // Initialize auth service and guest mode service
    const authService = getAuthService();
    const guestService = getGuestModeService();
    await authService.initialize();
    guestService.initialize();

    // Check if already authenticated (includes guest mode)
    if (authService.isAuthenticated()) {
      this.proceedToMainMenu();
      return;
    }

    // Create background
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

    // Create top menu bar (no home button - not authenticated yet)
    new TopMenuBar(this, { showHome: false });

    // Create title
    this.createTitle(width);

    // Create tab buttons
    this.createTabs(width, height);

    // Create panels
    this.createPanels(width, height);

    // Create guest button
    this.createGuestButton(width, height);

    // Show login panel by default
    this.switchToTab('login');
  }

  private createTitle(width: number): void {
    this.titleText = this.add.text(width / 2, 60, 'OVERLORD', {
      fontSize: '48px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.titleText.setOrigin(0.5, 0.5);

    this.subtitleText = this.add.text(width / 2, 100, 'Strategic Conquest', {
      fontSize: '18px',
      color: '#888888',
      fontFamily: 'monospace',
    });
    this.subtitleText.setOrigin(0.5, 0.5);
  }

  private createTabs(width: number, height: number): void {
    const tabWidth = 150;
    const tabHeight = 40;
    const tabY = height / 2 - 220;
    const centerX = width / 2;

    // Login tab
    this.loginTab = this.add.rectangle(
      centerX - tabWidth / 2 - 5,
      tabY,
      tabWidth,
      tabHeight,
      COLORS.TAB_ACTIVE,
    );
    this.loginTab.setStrokeStyle(2, COLORS.TAB_BORDER);
    this.loginTab.setInteractive({ useHandCursor: true });
    this.loginTab.on('pointerdown', () => this.switchToTab('login'));

    this.loginTabText = this.add.text(centerX - tabWidth / 2 - 5, tabY, 'SIGN IN', {
      fontSize: '16px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.loginTabText.setOrigin(0.5, 0.5);

    // Register tab
    this.registerTab = this.add.rectangle(
      centerX + tabWidth / 2 + 5,
      tabY,
      tabWidth,
      tabHeight,
      COLORS.TAB_INACTIVE,
    );
    this.registerTab.setStrokeStyle(2, COLORS.TAB_BORDER);
    this.registerTab.setInteractive({ useHandCursor: true });
    this.registerTab.on('pointerdown', () => this.switchToTab('register'));

    this.registerTabText = this.add.text(centerX + tabWidth / 2 + 5, tabY, 'REGISTER', {
      fontSize: '16px',
      color: COLORS.TEXT_INACTIVE,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.registerTabText.setOrigin(0.5, 0.5);
  }

  private createPanels(width: number, height: number): void {
    const panelX = width / 2 - 200;
    const panelY = height / 2 - 150;

    // Create login panel
    this.loginPanel = new LoginPanel(this);
    this.loginPanel.setPosition(panelX, panelY);
    this.loginPanel.onLoginAttempt = (email, password, rememberMe) =>
      this.handleLogin(email, password, rememberMe);
    this.loginPanel.onForgotPasswordClick = () => this.switchToTab('forgot-password');

    // Create register panel
    this.registerPanel = new RegisterPanel(this);
    this.registerPanel.setPosition(panelX, panelY - 50); // Slightly higher due to more fields
    this.registerPanel.onRegisterAttempt = (email, password, username) =>
      this.handleRegister(email, password, username);

    // Create forgot password panel
    this.forgotPasswordPanel = new ForgotPasswordPanel(this);
    this.forgotPasswordPanel.setPosition(panelX, panelY);
    this.forgotPasswordPanel.onResetAttempt = (email) => this.handleForgotPassword(email);
    this.forgotPasswordPanel.onBackClick = () => this.switchToTab('login');

    // Create syncing text (hidden initially)
    this.syncingText = this.add.text(width / 2, height / 2, 'Syncing data...', {
      fontSize: '20px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
    });
    this.syncingText.setOrigin(0.5, 0.5);
    this.syncingText.setVisible(false);
  }

  private createGuestButton(width: number, height: number): void {
    this.guestButton = this.add.text(width / 2, height - 80, 'PLAY AS GUEST', {
      fontSize: '16px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
      backgroundColor: '#1a1a2e',
      padding: { x: 20, y: 10 },
    });
    this.guestButton.setOrigin(0.5, 0.5);
    this.guestButton.setInteractive({ useHandCursor: true });

    this.guestButton.on('pointerover', () => {
      this.guestButton.setStyle({ backgroundColor: '#2a2a4e' });
    });

    this.guestButton.on('pointerout', () => {
      this.guestButton.setStyle({ backgroundColor: '#1a1a2e' });
    });

    this.guestButton.on('pointerdown', () => {
      this.handleGuestMode();
    });

    // Add note about guest mode
    const guestNote = this.add.text(
      width / 2,
      height - 45,
      'Local saves only • Cannot sync across devices',
      {
        fontSize: '11px',
        color: '#666666',
        fontFamily: 'monospace',
      },
    );
    guestNote.setOrigin(0.5, 0.5);
  }

  private switchToTab(tab: AuthTab): void {
    // Hide all panels first
    this.loginPanel.hide();
    this.registerPanel.hide();
    this.forgotPasswordPanel.hide();

    // Show/hide tabs based on mode
    const showTabs = tab !== 'forgot-password';
    this.loginTab.setVisible(showTabs);
    this.registerTab.setVisible(showTabs);
    this.loginTabText.setVisible(showTabs);
    this.registerTabText.setVisible(showTabs);
    this.guestButton.setVisible(showTabs);

    if (tab === 'login') {
      // Update tab styles
      this.loginTab.setFillStyle(COLORS.TAB_ACTIVE);
      this.registerTab.setFillStyle(COLORS.TAB_INACTIVE);
      this.loginTabText.setColor(COLORS.TEXT);
      this.registerTabText.setColor(COLORS.TEXT_INACTIVE);

      // Show login panel
      this.loginPanel.show();
    } else if (tab === 'register') {
      // Update tab styles
      this.loginTab.setFillStyle(COLORS.TAB_INACTIVE);
      this.registerTab.setFillStyle(COLORS.TAB_ACTIVE);
      this.loginTabText.setColor(COLORS.TEXT_INACTIVE);
      this.registerTabText.setColor(COLORS.TEXT);

      // Show register panel
      this.registerPanel.show();
    } else if (tab === 'forgot-password') {
      // Show forgot password panel (tabs are hidden)
      this.forgotPasswordPanel.show();
    }
  }

  private async handleLogin(email: string, password: string, rememberMe: boolean): Promise<void> {
    this.loginPanel.setLoading(true);
    this.loginPanel.clearError();

    const authService = getAuthService();
    const result = await authService.signIn(email, password);

    if (result.success) {
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('overlord_remember_email', email);
      } else {
        localStorage.removeItem('overlord_remember_email');
      }
      await this.onAuthSuccess();
    } else {
      this.loginPanel.setLoading(false);
      this.loginPanel.showError(result.error ?? 'Login failed');
    }
  }

  private async handleForgotPassword(email: string): Promise<void> {
    this.forgotPasswordPanel.setLoading(true);
    this.forgotPasswordPanel.clearError();

    const authService = getAuthService();
    const result = await authService.resetPassword(email);

    this.forgotPasswordPanel.setLoading(false);

    if (result.success) {
      this.forgotPasswordPanel.showSuccess(
        'Password reset email sent! Check your inbox and follow the link to reset your password.',
      );
    } else {
      this.forgotPasswordPanel.showError(result.error ?? 'Failed to send reset email');
    }
  }

  private handleGuestMode(): void {
    const guestService = getGuestModeService();
    guestService.enterGuestMode();
    this.proceedToMainMenu();
  }

  private async handleRegister(email: string, password: string, username: string): Promise<void> {
    this.registerPanel.setLoading(true);
    this.registerPanel.clearError();

    const authService = getAuthService();
    const result = await authService.signUp({ email, password, username });

    if (result.success) {
      await this.onAuthSuccess();
    } else {
      this.registerPanel.setLoading(false);
      this.registerPanel.showError(result.error ?? 'Registration failed');
    }
  }

  private async onAuthSuccess(): Promise<void> {
    // Hide panels and show syncing message
    this.loginPanel.hide();
    this.registerPanel.hide();
    this.loginTab.setVisible(false);
    this.registerTab.setVisible(false);
    this.loginTabText.setVisible(false);
    this.registerTabText.setVisible(false);
    this.syncingText.setVisible(true);

    // Sync local data to cloud
    await this.syncLocalData();

    // Proceed to main menu
    this.proceedToMainMenu();
  }

  private async syncLocalData(): Promise<void> {
    try {
      // Sync saves
      this.syncingText.setText('Syncing saves...');
      const saveService = getSaveService();
      await saveService.syncLocalSavesToCloud();

      // Sync scenario completions
      this.syncingText.setText('Syncing completions...');
      const scenarioService = getScenarioSyncService();
      await scenarioService.syncCompletionsToCloud();

      // Apply cloud profile to audio manager
      this.syncingText.setText('Loading profile...');
      const profileService = getUserProfileService();
      await profileService.applyProfileToAudioManager();
    } catch (error) {
      console.warn('Sync failed, continuing anyway:', error);
    }
  }

  private proceedToMainMenu(): void {
    this.scene.start('MainMenuScene');
  }

  public shutdown(): void {
    // Clean up panels
    this.loginPanel?.destroy();
    this.registerPanel?.destroy();
    this.forgotPasswordPanel?.destroy();
  }
}
