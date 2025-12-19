import Phaser from 'phaser';
import { AudioManager } from '@core/AudioManager';
import { TopMenuBar } from './ui/TopMenuBar';
import { LoadGamePanel } from './ui/LoadGamePanel';
import { StatisticsPanel } from './ui/StatisticsPanel';
import { getAuthService } from '@services/AuthService';
import { getSaveService } from '@services/SaveService';
import { getUserProfileService } from '@services/UserProfileService';
import { getGuestModeService } from '@services/GuestModeService';
import { AdminEditModeIndicator } from './ui/AdminEditModeIndicator';
import { AdminUIEditorController } from '@services/AdminUIEditorController';
import { getAdminModeService } from '@services/AdminModeService';
import { getUIPanelPositionService } from '@services/UIPanelPositionService';

/**
 * Main Menu Scene
 * AC-1: Entry point with "New Campaign" button
 * Story 12-3/12-5: Audio initialization and browser compliance
 */
export class MainMenuScene extends Phaser.Scene {
  private loadGamePanel?: LoadGamePanel;
  private statisticsPanel?: StatisticsPanel;
  private userGreeting?: Phaser.GameObjects.Text;
  private logoutButton?: Phaser.GameObjects.Text;
  private adminEditIndicator?: AdminEditModeIndicator;
  private adminUIEditor?: AdminUIEditorController;

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  public create(): void {
    // Story 12-3: Load audio settings from localStorage
    const audioManager = AudioManager.getInstance();
    audioManager.loadSettings();

    // Create top menu bar with audio controls (no home button - we're already home)
    new TopMenuBar(this, { showHome: false });
    const { width, height } = this.cameras.main;
    const centerX = width / 2;

    // Title
    this.add
      .text(centerX, height * 0.15, 'OVERLORD', {
        fontSize: '64px',
        color: '#00bfff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(centerX, height * 0.25, 'A Strategy Game of Galactic Conquest', {
        fontSize: '20px',
        color: '#0088cc',
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

    // Load Campaign button (now enabled)
    this.createMenuButton(centerX, buttonY + buttonSpacing, 'LOAD CAMPAIGN', true, () => {
      this.showLoadGamePanel();
    });

    // Flash Conflicts button (Story 1-1)
    this.createMenuButton(centerX, buttonY + buttonSpacing * 2, 'FLASH CONFLICTS', true, () => {
      this.scene.start('FlashConflictsScene');
    });

    // Statistics button (Story 10-7)
    this.createMenuButton(centerX, buttonY + buttonSpacing * 3, 'STATISTICS', true, () => {
      this.showStatisticsPanel();
    });

    // How to Play button
    this.createMenuButton(centerX, buttonY + buttonSpacing * 4, 'HOW TO PLAY', true, () => {
      this.scene.start('HowToPlayScene');
    });

    // Create load game panel
    this.createLoadGamePanel(width, height);

    // Create statistics panel (Story 10-7)
    this.createStatisticsPanel();

    // Create user display (if authenticated)
    this.createUserDisplay(width);

    // Initialize Admin UI Editor
    this.setupAdminUIEditor(width, height);

    // Version
    this.add
      .text(width - 10, height - 10, 'v0.4.0-supabase', {
        fontSize: '12px',
        color: '#444444',
        fontFamily: 'monospace',
      })
      .setOrigin(1, 1);
  }

  private createLoadGamePanel(width: number, height: number): void {
    this.loadGamePanel = new LoadGamePanel(this);
    this.loadGamePanel.setPosition(width / 2 - 300, height / 2 - 250);

    this.loadGamePanel.onLoadSelected = async (slotName: string) => {
      await this.handleLoadGame(slotName);
    };

    this.loadGamePanel.onDeleteSelected = async (slotName: string) => {
      await this.handleDeleteSave(slotName);
    };

    this.loadGamePanel.onClose = () => {
      // Panel handles its own hide
    };
  }

  private createUserDisplay(width: number): void {
    const authService = getAuthService();
    const guestService = getGuestModeService();
    const user = authService.getCurrentUser();
    const isGuest = guestService.isGuestMode();

    if (user || isGuest) {
      // Get display name
      let displayName: string;
      if (isGuest) {
        displayName = guestService.getGuestUsername() || 'Guest';
      } else {
        const profileService = getUserProfileService();
        displayName = profileService.getUsername() || user?.email || 'Player';
      }

      // Show guest indicator if in guest mode
      const greetingText = isGuest
        ? `Welcome, ${displayName} (Guest)`
        : `Welcome, ${displayName}`;

      // Position below top menu bar
      const topOffset = TopMenuBar.getHeight() + 8;
      this.userGreeting = this.add.text(width - 20, topOffset, greetingText, {
        fontSize: '14px',
        color: isGuest ? '#ffaa00' : '#00bfff',
        fontFamily: 'monospace',
      });
      this.userGreeting.setOrigin(1, 0);

      // Show sign in button for guests, logout for authenticated users
      const buttonText = isGuest ? '[SIGN IN]' : '[LOGOUT]';
      this.logoutButton = this.add.text(width - 20, topOffset + 25, buttonText, {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'monospace',
      });
      this.logoutButton.setOrigin(1, 0);
      this.logoutButton.setInteractive({ useHandCursor: true });

      this.logoutButton.on('pointerover', () => {
        this.logoutButton?.setColor(isGuest ? '#00bfff' : '#ff4444');
      });

      this.logoutButton.on('pointerout', () => {
        this.logoutButton?.setColor('#888888');
      });

      this.logoutButton.on('pointerdown', () => {
        if (isGuest) {
          this.handleGuestSignIn();
        } else {
          this.handleLogout();
        }
      });

      // Show note for guests about local saves
      if (isGuest) {
        const guestNote = this.add.text(width - 20, topOffset + 45, 'Saves stored locally only', {
          fontSize: '10px',
          color: '#666666',
          fontFamily: 'monospace',
        });
        guestNote.setOrigin(1, 0);
      }
    }
  }

  private handleGuestSignIn(): void {
    // Exit guest mode and go to auth scene
    const guestService = getGuestModeService();
    guestService.exitGuestMode();
    this.scene.start('AuthScene');
  }

  private showLoadGamePanel(): void {
    this.loadGamePanel?.show();
  }

  private createStatisticsPanel(): void {
    this.statisticsPanel = new StatisticsPanel(this);
  }

  private showStatisticsPanel(): void {
    this.statisticsPanel?.show();
  }

  private async handleLoadGame(slotName: string): Promise<void> {
    console.log('Loading save:', slotName);

    const saveService = getSaveService();
    const result = await saveService.loadGame(slotName);

    if (result.success && result.saveData) {
      // Store the loaded save data in registry for CampaignConfigScene/GalaxyMapScene to use
      this.registry.set('loadedSaveData', result.saveData);
      this.registry.set('loadedFrom', result.loadedFrom);

      this.loadGamePanel?.hide();

      // TODO: Navigate to the appropriate scene based on save state
      // For now, just show a message that loading worked
      console.log(`Loaded save from ${result.loadedFrom}:`, result.saveData);

      // The actual game state restoration would happen in a scene that can handle it
      // This is a placeholder - full implementation would restore the game state
      this.scene.start('GalaxyMapScene');
    } else {
      console.error('Failed to load save:', result.error);
      // Could show an error dialog here
    }
  }

  private async handleDeleteSave(slotName: string): Promise<void> {
    // Simple confirmation via console for now
    // A proper implementation would show a confirmation dialog
    console.log('Deleting save:', slotName);

    const saveService = getSaveService();
    const result = await saveService.deleteSave(slotName);

    if (result.success) {
      console.log('Save deleted successfully');
      // Refresh the save list
      this.loadGamePanel?.refreshSaveList();
    } else {
      console.error('Failed to delete save:', result.error);
    }
  }

  private async handleLogout(): Promise<void> {
    const authService = getAuthService();
    const result = await authService.signOut();

    if (result.success) {
      // Clear profile cache
      const profileService = getUserProfileService();
      profileService.clearCache();

      // Go back to auth scene
      this.scene.start('AuthScene');
    } else {
      console.error('Logout failed:', result.error);
    }
  }

  private createMenuButton(
    x: number,
    y: number,
    text: string,
    enabled: boolean,
    onClick?: () => void,
  ): Phaser.GameObjects.Text {
    const button = this.add
      .text(x, y, text, {
        fontSize: '28px',
        color: enabled ? '#ffffff' : '#555555',
        fontFamily: 'monospace',
        backgroundColor: enabled ? '#002244' : '#1a1a1a',
        padding: { x: 25, y: 12 },
      })
      .setOrigin(0.5);

    if (enabled && onClick) {
      button.setInteractive({ useHandCursor: true });

      button.on('pointerover', () => {
        button.setStyle({ backgroundColor: '#003366' });
      });

      button.on('pointerout', () => {
        button.setStyle({ backgroundColor: '#002244' });
      });

      button.on('pointerdown', onClick);
    }

    return button;
  }

  /**
   * Sets up the Admin UI Editor for repositioning UI panels.
   * Only active for admin users.
   */
  private async setupAdminUIEditor(width: number, height: number): Promise<void> {
    const adminService = getAdminModeService();
    const positionService = getUIPanelPositionService();

    // Create the UI editor controller
    this.adminUIEditor = new AdminUIEditorController(this, 'MainMenuScene');

    // Create the edit mode indicator with callbacks
    this.adminEditIndicator = new AdminEditModeIndicator(this, {
      onSaveAll: async () => {
        if (!this.adminUIEditor) { return; }
        const positions = this.adminUIEditor.getPendingChanges();
        if (positions.length > 0) {
          const result = await positionService.saveAllPositions(positions);
          if (result.success) {
            this.adminUIEditor.clearPendingChanges();
            console.log('Saved all panel positions');
          } else {
            console.error('Failed to save positions:', result.error);
          }
        }
      },
      onResetAll: () => {
        this.adminUIEditor?.resetAllPositions();
      },
      onDiscard: () => {
        this.adminUIEditor?.resetAllPositions();
        this.adminUIEditor?.clearPendingChanges();
      },
      onExit: () => {
        adminService.exitEditMode();
      },
    });

    // Register panels with the editor
    if (this.loadGamePanel) {
      this.adminUIEditor.registerPanel(
        this.loadGamePanel,
        'LoadGamePanel',
        width / 2 - 300,
        height / 2 - 250,
        600,
        500,
      );
    }

    if (this.statisticsPanel) {
      this.adminUIEditor.registerPanel(
        this.statisticsPanel,
        'StatisticsPanel',
        width / 2 + 50, // Offset to avoid perfect stacking
        height / 2 + 50,
        600,
        500,
      );
    }

    // Apply stored positions from database
    const positions = await positionService.getPositionsForScene('MainMenuScene');
    for (const [panelId, position] of positions) {
      this.adminUIEditor.applyPosition(panelId, position.x, position.y);
    }

    if (positions.size > 0) {
      console.log(`Applied ${positions.size} stored panel positions for MainMenuScene`);
    }

    // Wire up edit mode toggle
    adminService.onEditModeChanged = (active) => {
      if (active) {
        this.adminUIEditor?.enableEditMode();
        this.adminEditIndicator?.show();
      } else {
        this.adminUIEditor?.disableEditMode();
        this.adminEditIndicator?.hide();
      }
    };

    // Register keyboard shortcut (Ctrl+Shift+E)
    adminService.registerKeyboardShortcut(this);

    // Update indicator when pending changes change
    this.time.addEvent({
      delay: 500,
      callback: () => {
        if (adminService.isEditModeActive() && this.adminUIEditor && this.adminEditIndicator) {
          this.adminEditIndicator.updateChangesCount(
            this.adminUIEditor.getPendingChangesCount(),
          );
        }
      },
      loop: true,
    });
  }
}
