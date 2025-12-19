/**
 * UserProfileService Tests
 * Story 10-6: User Settings Persistence
 *
 * Tests for user profile settings management including:
 * - Local storage fallback for guest mode
 * - Debounced sync
 * - UI settings (uiScale, highContrastMode)
 */

import {
  UserProfileService,
  getUserProfileService,
  LocalSettings,
} from '../../src/services/UserProfileService';
import { GuestModeService } from '../../src/services/GuestModeService';
import { AudioManager } from '../../src/core/AudioManager';

// Mock dependencies
jest.mock('../../src/services/SupabaseClient', () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: null,
              error: { message: 'Not found' },
            })
          ),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}));

jest.mock('../../src/services/AuthService', () => ({
  getAuthService: jest.fn(() => ({
    getUserId: jest.fn(() => null),
    isAuthenticated: jest.fn(() => false),
    isUsernameAvailable: jest.fn(() => Promise.resolve(true)),
  })),
}));

jest.mock('../../src/services/GuestModeService', () => ({
  getGuestModeService: jest.fn(() => ({
    isGuestMode: jest.fn(() => false),
  })),
  GuestModeService: {
    resetInstance: jest.fn(),
  },
}));

jest.mock('../../src/core/AudioManager', () => ({
  AudioManager: {
    getInstance: jest.fn(() => ({
      getSettings: jest.fn(() => ({
        masterVolume: 100,
        sfxVolume: 80,
        musicVolume: 70,
        isMuted: false,
      })),
      setMusicVolume: jest.fn(),
      setSfxVolume: jest.fn(),
      mute: jest.fn(),
      unmute: jest.fn(),
      loadSettings: jest.fn(),
      saveSettings: jest.fn(),
    })),
  },
}));

const LOCAL_SETTINGS_KEY = 'overlord_user_settings';

describe('UserProfileService', () => {
  beforeEach(() => {
    // Reset singleton and clear localStorage
    UserProfileService.resetInstance();
    localStorage.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    jest.useRealTimers();
  });

  describe('getInstance', () => {
    it('returns the same instance on multiple calls', () => {
      const instance1 = UserProfileService.getInstance();
      const instance2 = UserProfileService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('getUserProfileService returns the singleton', () => {
      const service = getUserProfileService();
      expect(service).toBe(UserProfileService.getInstance());
    });
  });

  describe('Local Settings', () => {
    describe('getLocalSettings', () => {
      it('returns default settings when localStorage is empty', () => {
        const service = getUserProfileService();
        const settings = service.getLocalSettings();

        expect(settings.uiScale).toBe(1.0);
        expect(settings.highContrastMode).toBe(false);
        expect(settings.audioEnabled).toBe(true);
        expect(settings.musicVolume).toBe(0.7);
        expect(settings.sfxVolume).toBe(0.8);
      });

      it('returns stored settings from localStorage', () => {
        const customSettings: LocalSettings = {
          uiScale: 1.5,
          highContrastMode: true,
          audioEnabled: false,
          musicVolume: 0.5,
          sfxVolume: 0.6,
        };
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(customSettings));

        const service = getUserProfileService();
        const settings = service.getLocalSettings();

        expect(settings.uiScale).toBe(1.5);
        expect(settings.highContrastMode).toBe(true);
        expect(settings.audioEnabled).toBe(false);
        expect(settings.musicVolume).toBe(0.5);
        expect(settings.sfxVolume).toBe(0.6);
      });

      it('merges partial stored settings with defaults', () => {
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify({ uiScale: 1.25 }));

        const service = getUserProfileService();
        const settings = service.getLocalSettings();

        expect(settings.uiScale).toBe(1.25);
        expect(settings.highContrastMode).toBe(false); // default
        expect(settings.audioEnabled).toBe(true); // default
      });

      it('handles corrupted localStorage gracefully', () => {
        localStorage.setItem(LOCAL_SETTINGS_KEY, 'not-valid-json');

        const service = getUserProfileService();
        const settings = service.getLocalSettings();

        // Should return defaults
        expect(settings.uiScale).toBe(1.0);
        expect(settings.highContrastMode).toBe(false);
      });
    });

    describe('updateLocalSettings', () => {
      it('updates settings in localStorage', () => {
        const service = getUserProfileService();
        service.updateLocalSettings({ uiScale: 1.75 });

        const stored = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)!);
        expect(stored.uiScale).toBe(1.75);
      });

      it('preserves existing settings when updating', () => {
        const service = getUserProfileService();
        service.updateLocalSettings({ uiScale: 1.5 });
        service.updateLocalSettings({ highContrastMode: true });

        const stored = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)!);
        expect(stored.uiScale).toBe(1.5);
        expect(stored.highContrastMode).toBe(true);
      });
    });
  });

  describe('UI Settings Methods', () => {
    describe('getUISettings', () => {
      it('returns settings from local storage when no cached profile', () => {
        localStorage.setItem(
          LOCAL_SETTINGS_KEY,
          JSON.stringify({ uiScale: 1.25, highContrastMode: true })
        );

        const service = getUserProfileService();
        const settings = service.getUISettings();

        expect(settings.uiScale).toBe(1.25);
        expect(settings.highContrastMode).toBe(true);
      });
    });

    describe('setUIScale', () => {
      it('updates local storage immediately', async () => {
        const service = getUserProfileService();
        await service.setUIScale(1.5);

        const stored = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)!);
        expect(stored.uiScale).toBe(1.5);
      });

      it('clamps scale to valid range (min 0.5)', async () => {
        const service = getUserProfileService();
        await service.setUIScale(0.1);

        const settings = service.getUISettings();
        expect(settings.uiScale).toBe(0.5);
      });

      it('clamps scale to valid range (max 2.0)', async () => {
        const service = getUserProfileService();
        await service.setUIScale(5.0);

        const settings = service.getUISettings();
        expect(settings.uiScale).toBe(2.0);
      });
    });

    describe('setHighContrastMode', () => {
      it('updates local storage immediately', async () => {
        const service = getUserProfileService();
        await service.setHighContrastMode(true);

        const stored = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)!);
        expect(stored.highContrastMode).toBe(true);
      });

      it('can be toggled off', async () => {
        const service = getUserProfileService();
        await service.setHighContrastMode(true);
        await service.setHighContrastMode(false);

        const settings = service.getUISettings();
        expect(settings.highContrastMode).toBe(false);
      });
    });
  });

  describe('Debounced Sync', () => {
    it('does not sync to cloud for guest mode', async () => {
      const mockGuestService = require('../../src/services/GuestModeService');
      mockGuestService.getGuestModeService.mockReturnValue({
        isGuestMode: jest.fn(() => true),
      });

      const service = getUserProfileService();
      await service.setUIScale(1.5);

      // Advance timers past debounce delay
      jest.advanceTimersByTime(2000);

      // Local storage should still be updated
      const stored = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)!);
      expect(stored.uiScale).toBe(1.5);
    });

    it('flushPendingSync clears debounce timer', async () => {
      const service = getUserProfileService();
      await service.setUIScale(1.5);

      // Should not throw
      await service.flushPendingSync();
    });
  });

  describe('Default Settings', () => {
    it('getDefaultSettings returns correct defaults', () => {
      const service = getUserProfileService();
      const defaults = service.getDefaultSettings();

      expect(defaults.uiScale).toBe(1.0);
      expect(defaults.highContrastMode).toBe(false);
      expect(defaults.audioEnabled).toBe(true);
      expect(defaults.musicVolume).toBe(0.7);
      expect(defaults.sfxVolume).toBe(0.8);
    });
  });

  describe('Cache Management', () => {
    it('clearCache clears pending updates and timer', () => {
      const service = getUserProfileService();

      // Should not throw
      service.clearCache();
    });
  });

  describe('applyAllSettings', () => {
    it('calls loadSettings on AudioManager', async () => {
      const mockLoadSettings = jest.fn();
      const mockAudioManagerModule = require('../../src/core/AudioManager');
      mockAudioManagerModule.AudioManager.getInstance.mockReturnValue({
        getSettings: jest.fn(() => ({
          masterVolume: 100,
          sfxVolume: 80,
          musicVolume: 70,
          isMuted: false,
        })),
        setMusicVolume: jest.fn(),
        setSfxVolume: jest.fn(),
        mute: jest.fn(),
        unmute: jest.fn(),
        loadSettings: mockLoadSettings,
        saveSettings: jest.fn(),
      });

      const service = getUserProfileService();
      await service.applyAllSettings();

      expect(mockLoadSettings).toHaveBeenCalled();
    });
  });
});
