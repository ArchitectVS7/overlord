/**
 * AudioManager
 * Story 12-3: Independent Volume Controls
 * Story 12-4: Mute Audio Toggle
 * Story 12-5: User Activation for Browser Audio Compliance
 *
 * Core audio management system for Overlord game.
 * Handles volume control, muting, and browser audio activation.
 */

const STORAGE_KEY = 'overlord_audio_settings';

/**
 * Audio settings interface for persistence
 */
export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  isMuted: boolean;
}

/**
 * Volume type for callbacks
 */
export type VolumeType = 'master' | 'sfx' | 'music';

// Singleton instance
let instance: AudioManager | null = null;

/**
 * Reset the AudioManager singleton (for testing)
 */
export function resetAudioManager(): void {
  instance = null;
}

/**
 * AudioManager - Singleton class for managing game audio settings
 *
 * Features:
 * - Independent volume controls (Master, SFX, Music)
 * - Mute/unmute toggle
 * - Browser audio context activation
 * - Settings persistence via localStorage
 * - Volume change callbacks for real-time UI updates
 */
export class AudioManager {
  private masterVolume: number = 100;
  private sfxVolume: number = 100;
  private musicVolume: number = 100;
  private muted: boolean = false;
  private activated: boolean = false;

  // Callbacks for UI updates
  public onVolumeChanged: ((type: VolumeType, value: number) => void) | null = null;
  public onMuteChanged: ((isMuted: boolean) => void) | null = null;
  public onActivationChanged: ((isActivated: boolean) => void) | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance of AudioManager
   */
  public static getInstance(): AudioManager {
    if (!instance) {
      instance = new AudioManager();
    }
    return instance;
  }

  // ============================================
  // Volume Getters
  // ============================================

  /**
   * Get current master volume (0-100)
   */
  public getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Get current SFX volume (0-100)
   */
  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  /**
   * Get current music volume (0-100)
   */
  public getMusicVolume(): number {
    return this.musicVolume;
  }

  // ============================================
  // Volume Setters
  // ============================================

  /**
   * Set master volume (0-100)
   * @param volume Volume level (will be clamped to 0-100)
   */
  public setMasterVolume(volume: number): void {
    this.masterVolume = this.clampVolume(volume);
    this.onVolumeChanged?.('master', this.masterVolume);
  }

  /**
   * Set SFX volume (0-100)
   * @param volume Volume level (will be clamped to 0-100)
   */
  public setSfxVolume(volume: number): void {
    this.sfxVolume = this.clampVolume(volume);
    this.onVolumeChanged?.('sfx', this.sfxVolume);
  }

  /**
   * Set music volume (0-100)
   * @param volume Volume level (will be clamped to 0-100)
   */
  public setMusicVolume(volume: number): void {
    this.musicVolume = this.clampVolume(volume);
    this.onVolumeChanged?.('music', this.musicVolume);
  }

  /**
   * Clamp volume to valid range (0-100)
   */
  private clampVolume(volume: number): number {
    return Math.max(0, Math.min(100, volume));
  }

  // ============================================
  // Effective Volume (with mute and master applied)
  // ============================================

  /**
   * Get effective SFX volume (master * sfx), accounting for mute
   * @returns Effective volume (0-100)
   */
  public getEffectiveSfxVolume(): number {
    if (this.muted) return 0;
    return Math.round((this.masterVolume * this.sfxVolume) / 100);
  }

  /**
   * Get effective music volume (master * music), accounting for mute
   * @returns Effective volume (0-100)
   */
  public getEffectiveMusicVolume(): number {
    if (this.muted) return 0;
    return Math.round((this.masterVolume * this.musicVolume) / 100);
  }

  /**
   * Get normalized SFX volume (0-1) for audio APIs
   * @returns Normalized volume (0.0-1.0)
   */
  public getNormalizedSfxVolume(): number {
    return this.getEffectiveSfxVolume() / 100;
  }

  /**
   * Get normalized music volume (0-1) for audio APIs
   * @returns Normalized volume (0.0-1.0)
   */
  public getNormalizedMusicVolume(): number {
    return this.getEffectiveMusicVolume() / 100;
  }

  // ============================================
  // Mute Functionality
  // ============================================

  /**
   * Check if audio is currently muted
   */
  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Mute all audio
   */
  public mute(): void {
    this.muted = true;
    this.onMuteChanged?.(true);
  }

  /**
   * Unmute all audio
   */
  public unmute(): void {
    this.muted = false;
    this.onMuteChanged?.(false);
  }

  /**
   * Toggle mute state
   */
  public toggleMute(): void {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  // ============================================
  // Audio Context Activation
  // ============================================

  /**
   * Check if audio context is activated (user interaction received)
   */
  public isActivated(): boolean {
    return this.activated;
  }

  /**
   * Activate audio context after user interaction
   * This is required by browser security policies before audio can play
   */
  public activate(): void {
    if (!this.activated) {
      this.activated = true;
      this.onActivationChanged?.(true);
    }
  }

  /**
   * Check if audio can currently be played
   * Requires activation and not muted
   */
  public canPlayAudio(): boolean {
    return this.activated && !this.muted;
  }

  // ============================================
  // Settings Persistence
  // ============================================

  /**
   * Get all settings as an object
   */
  public getSettings(): AudioSettings {
    return {
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      isMuted: this.muted
    };
  }

  /**
   * Set all settings from an object
   */
  public setSettings(settings: AudioSettings): void {
    this.masterVolume = this.clampVolume(settings.masterVolume);
    this.sfxVolume = this.clampVolume(settings.sfxVolume);
    this.musicVolume = this.clampVolume(settings.musicVolume);
    this.muted = settings.isMuted;
  }

  /**
   * Save settings to localStorage
   */
  public saveSettings(): void {
    try {
      const settings = this.getSettings();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Silently fail if localStorage unavailable
      console.warn('Failed to save audio settings to localStorage');
    }
  }

  /**
   * Load settings from localStorage
   */
  public loadSettings(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored) as AudioSettings;
        this.setSettings(settings);
      }
    } catch {
      // Silently fail and use defaults
      console.warn('Failed to load audio settings from localStorage');
    }
  }

  /**
   * Reset all settings to defaults
   */
  public resetToDefaults(): void {
    this.masterVolume = 100;
    this.sfxVolume = 100;
    this.musicVolume = 100;
    this.muted = false;
  }
}
