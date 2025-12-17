/**
 * UserProfileService - User Profile Management
 *
 * Manages user profile settings including audio preferences.
 * Syncs between cloud storage and local AudioManager.
 */

import { getSupabaseClient } from './SupabaseClient';
import { getAuthService } from './AuthService';
import { AudioManager } from '@core/AudioManager';

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
  }

  /**
   * Reset the singleton instance (for testing)
   */
  public static resetInstance(): void {
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
