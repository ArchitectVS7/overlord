/**
 * UserProfileService - User Profile Management
 * Story 10-6: User Settings Persistence
 *
 * Manages user profile settings including audio and UI preferences.
 * Features:
 * - Cloud sync for authenticated users (Supabase)
 * - LocalStorage fallback for guest mode
 * - Debounced sync to prevent server flooding
 * - UI settings (uiScale, highContrastMode) persistence
 */

import { getSupabaseClient } from './SupabaseClient';
import { getAuthService } from './AuthService';
import { getGuestModeService } from './GuestModeService';
import { AudioManager } from '@core/AudioManager';

// LocalStorage key for guest/offline settings
const LOCAL_SETTINGS_KEY = 'overlord_user_settings';

// Default settings for new users
const DEFAULT_SETTINGS: LocalSettings = {
  uiScale: 1.0,
  highContrastMode: false,
  audioEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 0.8,
};

/**
 * Settings that can be stored locally for guest mode
 */
export interface LocalSettings {
  uiScale: number;
  highContrastMode: boolean;
  audioEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

/**
 * User profile data structure
 */
export interface UserProfile {
  userId: string;
  username: string;
  uiScale: number;
  highContrastMode: boolean;
  audioEnabled: boolean;
  musicVolume: number; // 0.0-1.0
  sfxVolume: number; // 0.0-1.0
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Result of profile operations
 */
export interface ProfileResult {
  success: boolean;
  error?: string;
  profile?: UserProfile;
}

/**
 * UserProfileService singleton class
 * Manages user profile and settings synchronization
 */
class UserProfileService {
  private static instance: UserProfileService | null = null;
  private cachedProfile: UserProfile | null = null;
  private syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingUpdates: Partial<UserProfile> = {};

  // Debounce delay for settings sync (ms)
  private static readonly SYNC_DEBOUNCE_MS = 1000;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  /**
   * Get the current user's profile from Supabase
   * Uses cache if available
   */
  public async getProfile(forceRefresh = false): Promise<ProfileResult> {
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    // Return cached profile if available and not forcing refresh
    if (this.cachedProfile && !forceRefresh) {
      return { success: true, profile: this.cachedProfile };
    }

    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: 'Profile not found' };
      }

      // Cast data to expected shape
      type ProfileRow = {
        user_id: string;
        username: string;
        ui_scale: number;
        high_contrast_mode: boolean;
        audio_enabled: boolean;
        music_volume: number;
        sfx_volume: number;
        is_admin: boolean;
        created_at: string;
        updated_at: string;
      };
      const row = data as unknown as ProfileRow;

      const profile: UserProfile = {
        userId: row.user_id,
        username: row.username,
        uiScale: row.ui_scale,
        highContrastMode: row.high_contrast_mode,
        audioEnabled: row.audio_enabled,
        musicVolume: row.music_volume,
        sfxVolume: row.sfx_volume,
        isAdmin: row.is_admin,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      this.cachedProfile = profile;
      return { success: true, profile };
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  /**
   * Update the current user's profile
   * @param updates - Partial profile data to update
   */
  public async updateProfile(updates: Partial<UserProfile>): Promise<ProfileResult> {
    const authService = getAuthService();
    const userId = authService.getUserId();

    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const supabase = getSupabaseClient();

    try {
      // Map UserProfile fields to database column names
      const dbUpdates: Record<string, unknown> = {};

      if (updates.username !== undefined) {
        dbUpdates.username = updates.username;
      }
      if (updates.uiScale !== undefined) {
        dbUpdates.ui_scale = updates.uiScale;
      }
      if (updates.highContrastMode !== undefined) {
        dbUpdates.high_contrast_mode = updates.highContrastMode;
      }
      if (updates.audioEnabled !== undefined) {
        dbUpdates.audio_enabled = updates.audioEnabled;
      }
      if (updates.musicVolume !== undefined) {
        dbUpdates.music_volume = updates.musicVolume;
      }
      if (updates.sfxVolume !== undefined) {
        dbUpdates.sfx_volume = updates.sfxVolume;
      }

      // Use type assertion to bypass strict Supabase typing
      const { error } = await (supabase
        .from('user_profiles') as any)
        .update(dbUpdates)
        .eq('user_id', userId);

      if (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
      }

      // Fetch updated profile
      return this.getProfile(true);
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  /**
   * Sync local AudioManager settings to cloud profile
   * Uploads current AudioManager settings to Supabase
   */
  public async syncAudioSettingsToCloud(): Promise<ProfileResult> {
    const audioManager = AudioManager.getInstance();
    const settings = audioManager.getSettings();

    // Convert from 0-100 to 0.0-1.0 for database
    const updates: Partial<UserProfile> = {
      audioEnabled: !settings.isMuted,
      musicVolume: settings.musicVolume / 100,
      sfxVolume: settings.sfxVolume / 100,
    };

    return this.updateProfile(updates);
  }

  /**
   * Apply cloud profile settings to local AudioManager
   * Downloads settings from Supabase and applies to AudioManager
   */
  public async applyProfileToAudioManager(): Promise<void> {
    const result = await this.getProfile(true); // Force refresh

    if (!result.success || !result.profile) {
      console.warn('Could not load profile for AudioManager:', result.error);
      return;
    }

    const audioManager = AudioManager.getInstance();
    const profile = result.profile;

    // Convert from 0.0-1.0 to 0-100 for AudioManager
    audioManager.setMusicVolume(Math.round(profile.musicVolume * 100));
    audioManager.setSfxVolume(Math.round(profile.sfxVolume * 100));

    if (profile.audioEnabled) {
      audioManager.unmute();
    } else {
      audioManager.mute();
    }

    // Save to localStorage as well for offline access
    audioManager.saveSettings();
  }

  /**
   * Check if a username is available
   * @param username - The username to check
   */
  public async isUsernameAvailable(username: string): Promise<boolean> {
    const authService = getAuthService();
    return authService.isUsernameAvailable(username);
  }

  /**
   * Update the user's username
   * @param newUsername - The new username to set
   */
  public async updateUsername(newUsername: string): Promise<ProfileResult> {
    // Validate username format
    if (!newUsername || newUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }
    if (newUsername.length > 20) {
      return { success: false, error: 'Username must be 20 characters or less' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      return {
        success: false,
        error: 'Username can only contain letters, numbers, underscores, and hyphens',
      };
    }

    // Check availability
    const isAvailable = await this.isUsernameAvailable(newUsername);
    if (!isAvailable) {
      return { success: false, error: 'Username is already taken' };
    }

    return this.updateProfile({ username: newUsername });
  }

  /**
   * Get the current user's username
   */
  public getUsername(): string | null {
    return this.cachedProfile?.username ?? null;
  }

  /**
   * Check if the current user is an admin
   * Returns false if not authenticated or profile not loaded
   */
  public isAdmin(): boolean {
    return this.cachedProfile?.isAdmin ?? false;
  }

  /**
   * Clear the profile cache
   * Call this on logout
   */
  public clearCache(): void {
    this.cachedProfile = null;
    this.pendingUpdates = {};
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = null;
    }
  }

  // ============================================
  // Story 10-6: UI Settings Methods
  // ============================================

  /**
   * Get current UI settings (from profile or local storage)
   * Works for both authenticated users and guests
   */
  public getUISettings(): { uiScale: number; highContrastMode: boolean } {
    // Try cached profile first (authenticated users)
    if (this.cachedProfile) {
      return {
        uiScale: this.cachedProfile.uiScale,
        highContrastMode: this.cachedProfile.highContrastMode,
      };
    }

    // Fall back to local storage
    const localSettings = this.getLocalSettings();
    return {
      uiScale: localSettings.uiScale,
      highContrastMode: localSettings.highContrastMode,
    };
  }

  /**
   * Update UI scale setting with debounced sync
   * @param scale - UI scale factor (0.5 to 2.0)
   */
  public async setUIScale(scale: number): Promise<void> {
    // Clamp to valid range
    const clampedScale = Math.max(0.5, Math.min(2.0, scale));

    // Update local storage immediately
    this.updateLocalSettings({ uiScale: clampedScale });

    // Update cached profile if available
    if (this.cachedProfile) {
      this.cachedProfile.uiScale = clampedScale;
    }

    // Debounced cloud sync for authenticated users
    await this.debouncedSync({ uiScale: clampedScale });
  }

  /**
   * Update high contrast mode setting with debounced sync
   * @param enabled - Whether high contrast mode is enabled
   */
  public async setHighContrastMode(enabled: boolean): Promise<void> {
    // Update local storage immediately
    this.updateLocalSettings({ highContrastMode: enabled });

    // Update cached profile if available
    if (this.cachedProfile) {
      this.cachedProfile.highContrastMode = enabled;
    }

    // Debounced cloud sync for authenticated users
    await this.debouncedSync({ highContrastMode: enabled });
  }

  /**
   * Sync all settings to cloud with debouncing
   * Collects updates and syncs after debounce delay
   */
  private async debouncedSync(updates: Partial<UserProfile>): Promise<void> {
    const authService = getAuthService();
    const guestService = getGuestModeService();

    // Don't sync to cloud for guests
    if (guestService.isGuestMode() || !authService.isAuthenticated()) {
      return;
    }

    // Merge with pending updates
    this.pendingUpdates = { ...this.pendingUpdates, ...updates };

    // Clear existing timer
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
    }

    // Set new timer
    this.syncDebounceTimer = setTimeout(async () => {
      if (Object.keys(this.pendingUpdates).length > 0) {
        const toSync = { ...this.pendingUpdates };
        this.pendingUpdates = {};
        await this.updateProfile(toSync);
      }
      this.syncDebounceTimer = null;
    }, UserProfileService.SYNC_DEBOUNCE_MS);
  }

  /**
   * Force immediate sync of pending settings
   * Use before logout or app close
   */
  public async flushPendingSync(): Promise<void> {
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = null;
    }

    if (Object.keys(this.pendingUpdates).length > 0) {
      const toSync = { ...this.pendingUpdates };
      this.pendingUpdates = {};
      await this.updateProfile(toSync);
    }
  }

  // ============================================
  // Local Storage Methods (Guest Mode Fallback)
  // ============================================

  /**
   * Get settings from local storage
   * Used for guest mode and offline fallback
   */
  public getLocalSettings(): LocalSettings {
    try {
      const stored = localStorage.getItem(LOCAL_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<LocalSettings>;
        // Merge with defaults to ensure all fields exist
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load local settings:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Update settings in local storage
   * @param updates - Partial settings to update
   */
  public updateLocalSettings(updates: Partial<LocalSettings>): void {
    try {
      const current = this.getLocalSettings();
      const updated = { ...current, ...updates };
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save local settings:', error);
    }
  }

  /**
   * Apply all settings from profile/local storage
   * Call this on app startup to restore user preferences
   */
  public async applyAllSettings(): Promise<void> {
    const authService = getAuthService();
    const guestService = getGuestModeService();

    // Apply audio settings first (from AudioManager's own localStorage)
    const audioManager = AudioManager.getInstance();
    audioManager.loadSettings();

    // If authenticated, try to load from cloud
    if (authService.isAuthenticated() && !guestService.isGuestMode()) {
      const result = await this.getProfile(true);
      if (result.success && result.profile) {
        // Apply audio settings from profile
        audioManager.setMusicVolume(Math.round(result.profile.musicVolume * 100));
        audioManager.setSfxVolume(Math.round(result.profile.sfxVolume * 100));
        if (result.profile.audioEnabled) {
          audioManager.unmute();
        } else {
          audioManager.mute();
        }
        audioManager.saveSettings();

        // Also update local storage as backup
        this.updateLocalSettings({
          uiScale: result.profile.uiScale,
          highContrastMode: result.profile.highContrastMode,
          audioEnabled: result.profile.audioEnabled,
          musicVolume: result.profile.musicVolume,
          sfxVolume: result.profile.sfxVolume,
        });
      }
    }
    // For guests, settings are already in local storage
  }

  /**
   * Sync all current settings to cloud
   * Used after login to push local settings to cloud
   */
  public async syncAllSettingsToCloud(): Promise<ProfileResult> {
    const authService = getAuthService();
    const guestService = getGuestModeService();

    if (guestService.isGuestMode() || !authService.isAuthenticated()) {
      return { success: false, error: 'Not authenticated or in guest mode' };
    }

    const audioManager = AudioManager.getInstance();
    const audioSettings = audioManager.getSettings();
    const localSettings = this.getLocalSettings();

    const updates: Partial<UserProfile> = {
      uiScale: localSettings.uiScale,
      highContrastMode: localSettings.highContrastMode,
      audioEnabled: !audioSettings.isMuted,
      musicVolume: audioSettings.musicVolume / 100,
      sfxVolume: audioSettings.sfxVolume / 100,
    };

    return this.updateProfile(updates);
  }

  /**
   * Get default settings
   */
  public getDefaultSettings(): LocalSettings {
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
    if (UserProfileService.instance) {
      UserProfileService.instance.clearCache();
    }
    UserProfileService.instance = null;
  }
}

/**
 * Get the UserProfileService singleton instance
 */
export function getUserProfileService(): UserProfileService {
  return UserProfileService.getInstance();
}

export { UserProfileService };
