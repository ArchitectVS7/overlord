/**
 * AdminModeService - Admin Edit Mode Management
 *
 * Manages admin edit mode state for UI panel positioning.
 * Only admin users can enter edit mode to reposition UI panels.
 */

import { getUserProfileService } from './UserProfileService';
import { getAuthService } from './AuthService';
import type { User } from '@supabase/supabase-js';

/**
 * AdminModeService singleton class
 * Manages admin status and edit mode state
 */
class AdminModeService {
  private static instance: AdminModeService | null = null;
  private editModeActive: boolean = false;
  private adminStatus: boolean = false;
  private initialized: boolean = false;

  /**
   * Callback fired when edit mode changes
   */
  public onEditModeChanged?: (active: boolean) => void;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): AdminModeService {
    if (!AdminModeService.instance) {
      AdminModeService.instance = new AdminModeService();
    }
    return AdminModeService.instance;
  }

  /**
   * Initialize the service - must be called after auth is ready
   * Checks admin status from user profile
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.refreshAdminStatus();
    this.initialized = true;

    // Subscribe to auth state changes to update admin status
    const authService = getAuthService();
    const originalOnAuthStateChanged = authService.onAuthStateChanged;
    authService.onAuthStateChanged = async (user: User | null) => {
      originalOnAuthStateChanged?.(user);
      await this.refreshAdminStatus();
    };
  }

  /**
   * Refresh admin status from user profile
   */
  public async refreshAdminStatus(): Promise<void> {
    const authService = getAuthService();

    if (!authService.isAuthenticated()) {
      this.adminStatus = false;
      // Exit edit mode if we lose admin status
      if (this.editModeActive) {
        this.exitEditMode();
      }
      return;
    }

    const profileService = getUserProfileService();
    const result = await profileService.getProfile(true); // Force refresh

    if (result.success && result.profile) {
      this.adminStatus = result.profile.isAdmin;
    } else {
      this.adminStatus = false;
    }

    // Exit edit mode if we lose admin status
    if (!this.adminStatus && this.editModeActive) {
      this.exitEditMode();
    }
  }

  /**
   * Check if the current user is an admin
   */
  public isAdmin(): boolean {
    return this.adminStatus;
  }

  /**
   * Check if edit mode is currently active
   */
  public isEditModeActive(): boolean {
    return this.editModeActive;
  }

  /**
   * Toggle edit mode on/off
   * @returns The new edit mode state, or false if not admin
   */
  public toggleEditMode(): boolean {
    if (!this.adminStatus) {
      console.warn('Cannot toggle edit mode: user is not an admin');
      return false;
    }

    if (this.editModeActive) {
      this.exitEditMode();
    } else {
      this.enterEditMode();
    }

    return this.editModeActive;
  }

  /**
   * Enter edit mode (admin only)
   */
  public enterEditMode(): void {
    if (!this.adminStatus) {
      console.warn('Cannot enter edit mode: user is not an admin');
      return;
    }

    if (this.editModeActive) {
      return; // Already in edit mode
    }

    this.editModeActive = true;
    console.log('Admin UI Edit Mode: ENABLED');
    this.onEditModeChanged?.(true);
  }

  /**
   * Exit edit mode
   */
  public exitEditMode(): void {
    if (!this.editModeActive) {
      return; // Already out of edit mode
    }

    this.editModeActive = false;
    console.log('Admin UI Edit Mode: DISABLED');
    this.onEditModeChanged?.(false);
  }

  /**
   * Register keyboard shortcut for edit mode toggle
   * Should be called from a scene with an active input manager
   */
  public registerKeyboardShortcut(scene: Phaser.Scene): void {
    if (!scene.input.keyboard) {
      console.warn('Cannot register keyboard shortcut: no keyboard input');
      return;
    }

    scene.input.keyboard.on('keydown-E', (event: KeyboardEvent) => {
      // Ctrl+Shift+E to toggle edit mode
      if (event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        this.toggleEditMode();
      }
    });
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (AdminModeService.instance) {
      AdminModeService.instance.editModeActive = false;
      AdminModeService.instance.adminStatus = false;
      AdminModeService.instance.initialized = false;
      AdminModeService.instance.onEditModeChanged = undefined;
    }
    AdminModeService.instance = null;
  }
}

/**
 * Get the AdminModeService singleton instance
 */
export function getAdminModeService(): AdminModeService {
  return AdminModeService.getInstance();
}

export { AdminModeService };
