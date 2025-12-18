/**
 * GuestModeService - Local-Only Play Mode
 *
 * Enables users to play without creating an account.
 * All data is stored locally (localStorage) and cannot sync to cloud.
 * Singleton pattern for consistent state across the application.
 */

const GUEST_MODE_KEY = 'overlord_guest_mode';
const GUEST_SESSION_KEY = 'overlord_guest_session';

/**
 * Guest user representation for local-only play
 */
export interface GuestUser {
  id: string;
  username: string;
  isGuest: true;
  createdAt: string;
}

/**
 * GuestModeService singleton class
 * Manages guest mode state and local session
 */
class GuestModeService {
  private static instance: GuestModeService | null = null;
  private guestUser: GuestUser | null = null;
  private active = false;

  /**
   * Callback fired when guest mode state changes
   */
  public onGuestModeChanged?: (active: boolean, user: GuestUser | null) => void;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance of GuestModeService
   */
  public static getInstance(): GuestModeService {
    if (!GuestModeService.instance) {
      GuestModeService.instance = new GuestModeService();
    }
    return GuestModeService.instance;
  }

  /**
   * Initialize guest mode service and restore any existing session
   * Should be called at app startup
   */
  public initialize(): void {
    const storedSession = this.getStoredSession();
    if (storedSession) {
      this.guestUser = storedSession;
      this.active = true;
    }
  }

  /**
   * Enter guest mode with a generated or existing session
   * @param username - Optional username for the guest (defaults to 'Guest')
   * @returns The guest user object
   */
  public enterGuestMode(username = 'Guest'): GuestUser {
    // Check if we already have a guest session
    const existingSession = this.getStoredSession();
    if (existingSession) {
      this.guestUser = existingSession;
      this.active = true;
      this.onGuestModeChanged?.(true, this.guestUser);
      return this.guestUser;
    }

    // Create new guest user
    this.guestUser = {
      id: this.generateGuestId(),
      username: username.trim() || 'Guest',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };

    // Store session
    this.storeSession(this.guestUser);
    this.active = true;

    this.onGuestModeChanged?.(true, this.guestUser);
    return this.guestUser;
  }

  /**
   * Exit guest mode and clear the session
   */
  public exitGuestMode(): void {
    this.guestUser = null;
    this.active = false;
    this.clearStoredSession();
    this.onGuestModeChanged?.(false, null);
  }

  /**
   * Check if currently in guest mode
   */
  public isGuestMode(): boolean {
    return this.active && this.guestUser !== null;
  }

  /**
   * Get the current guest user
   * @returns GuestUser or null if not in guest mode
   */
  public getGuestUser(): GuestUser | null {
    return this.guestUser;
  }

  /**
   * Get the guest user ID for local storage keys
   * @returns Guest ID or null if not in guest mode
   */
  public getGuestId(): string | null {
    return this.guestUser?.id ?? null;
  }

  /**
   * Get the guest username
   * @returns Guest username or null if not in guest mode
   */
  public getGuestUsername(): string | null {
    return this.guestUser?.username ?? null;
  }

  /**
   * Update the guest username
   * @param username - New username
   */
  public updateUsername(username: string): void {
    if (!this.guestUser) {
      return;
    }

    this.guestUser.username = username.trim() || 'Guest';
    this.storeSession(this.guestUser);
  }

  /**
   * Get local storage prefix for guest saves
   * Uses guest ID to namespace saves
   */
  public getLocalStoragePrefix(): string {
    if (!this.guestUser) {
      return 'overlord_guest_';
    }
    return `overlord_guest_${this.guestUser.id}_`;
  }

  // ============================================
  // Private Methods
  // ============================================

  /**
   * Generate a unique guest ID
   */
  private generateGuestId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `guest_${timestamp}_${randomPart}`;
  }

  /**
   * Store guest session in localStorage
   */
  private storeSession(user: GuestUser): void {
    try {
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(GUEST_MODE_KEY, 'true');
    } catch (error) {
      console.warn('Failed to store guest session:', error);
    }
  }

  /**
   * Get stored guest session from localStorage
   */
  private getStoredSession(): GuestUser | null {
    try {
      const stored = localStorage.getItem(GUEST_SESSION_KEY);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored) as GuestUser;
      // Validate the structure
      if (parsed.id && parsed.username && parsed.isGuest === true) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Clear stored guest session
   */
  private clearStoredSession(): void {
    try {
      localStorage.removeItem(GUEST_SESSION_KEY);
      localStorage.removeItem(GUEST_MODE_KEY);
    } catch (error) {
      console.warn('Failed to clear guest session:', error);
    }
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    GuestModeService.instance = null;
  }
}

/**
 * Get the GuestModeService singleton instance
 * Convenience function for cleaner imports
 */
export function getGuestModeService(): GuestModeService {
  return GuestModeService.getInstance();
}

export { GuestModeService };
