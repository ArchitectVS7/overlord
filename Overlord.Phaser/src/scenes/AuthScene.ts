/**
 * AuthScene - Authentication Scene
 *
 * Full-screen authentication scene with login/register tabs.
 * Redirects to MainMenuScene if already authenticated.
 */

import Phaser from 'phaser';
import { LoginPanel } from './ui/LoginPanel';
import { RegisterPanel } from './ui/RegisterPanel';
import { getAuthService } from '@services/AuthService';
import { getSaveService } from '@services/SaveService';
import { getScenarioSyncService } from '@services/ScenarioSyncService';
import { getUserProfileService } from '@services/UserProfileService';

const COLORS = {
  BACKGROUND: 0x0a0a1a,
  TEXT: '#00ff00',
  TEXT_INACTIVE: '#555555',
  TAB_ACTIVE: 0x003300,
  TAB_INACTIVE: 0x1a1a2e,
  TAB_BORDER: 0x00ff00,
};

type AuthTab = 'login' | 'register';

/**
 * AuthScene - Authentication flow before main menu
 */
export class AuthScene extends Phaser.Scene {
  private loginPanel!: LoginPanel;
  private registerPanel!: RegisterPanel;
  private loginTab!: Phaser.GameObjects.Rectangle;
  private registerTab!: Phaser.GameObjects.Rectangle;
  private loginTabText!: Phaser.GameObjects.Text;
  private registerTabText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private syncingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'AuthScene' });
  }

  public async create(): Promise<void> {
    const { width, height } = this.scale;

    // Initialize auth service
    const authService = getAuthService();
    await authService.initialize();

    // Check if already authenticated
    if (authService.isAuthenticated()) {
      this.proceedToMainMenu();
      return;
    }

    // Create background
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND);

    // Create title
    this.createTitle(width);

    // Create tab buttons
    this.createTabs(width, height);

    // Create panels
    this.createPanels(width, height);

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
      COLORS.TAB_ACTIVE
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
      COLORS.TAB_INACTIVE
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
    this.loginPanel.onLoginAttempt = (email, password) => this.handleLogin(email, password);

    // Create register panel
    this.registerPanel = new RegisterPanel(this);
    this.registerPanel.setPosition(panelX, panelY - 50); // Slightly higher due to more fields
    this.registerPanel.onRegisterAttempt = (email, password, username) =>
      this.handleRegister(email, password, username);

    // Create syncing text (hidden initially)
    this.syncingText = this.add.text(width / 2, height / 2, 'Syncing data...', {
      fontSize: '20px',
      color: COLORS.TEXT,
      fontFamily: 'monospace',
    });
    this.syncingText.setOrigin(0.5, 0.5);
    this.syncingText.setVisible(false);
  }

  private switchToTab(tab: AuthTab): void {
    if (tab === 'login') {
      // Update tab styles
      this.loginTab.setFillStyle(COLORS.TAB_ACTIVE);
      this.registerTab.setFillStyle(COLORS.TAB_INACTIVE);
      this.loginTabText.setColor(COLORS.TEXT);
      this.registerTabText.setColor(COLORS.TEXT_INACTIVE);

      // Show/hide panels
      this.loginPanel.show();
      this.registerPanel.hide();
    } else {
      // Update tab styles
      this.loginTab.setFillStyle(COLORS.TAB_INACTIVE);
      this.registerTab.setFillStyle(COLORS.TAB_ACTIVE);
      this.loginTabText.setColor(COLORS.TEXT_INACTIVE);
      this.registerTabText.setColor(COLORS.TEXT);

      // Show/hide panels
      this.loginPanel.hide();
      this.registerPanel.show();
    }
  }

  private async handleLogin(email: string, password: string): Promise<void> {
    this.loginPanel.setLoading(true);
    this.loginPanel.clearError();

    const authService = getAuthService();
    const result = await authService.signIn(email, password);

    if (result.success) {
      await this.onAuthSuccess();
    } else {
      this.loginPanel.setLoading(false);
      this.loginPanel.showError(result.error ?? 'Login failed');
    }
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
  }
}
