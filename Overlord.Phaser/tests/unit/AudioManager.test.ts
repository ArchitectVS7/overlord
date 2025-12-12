/**
 * AudioManager Tests
 * Story 12-3: Independent Volume Controls
 * Story 12-4: Mute Audio Toggle
 * Story 12-5: User Activation for Browser Audio Compliance
 */

import { AudioManager, AudioSettings, resetAudioManager } from '../../src/core/AudioManager';

// Mock localStorage
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: jest.fn((key: string) => mockStorage[key] || null),
  setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
  removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
  clear: jest.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); })
};

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

describe('AudioManager', () => {
  let manager: AudioManager;

  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    jest.clearAllMocks();
    resetAudioManager();
    manager = AudioManager.getInstance();
  });

  afterEach(() => {
    resetAudioManager();
  });

  describe('singleton pattern', () => {
    test('should return same instance', () => {
      const instance1 = AudioManager.getInstance();
      const instance2 = AudioManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    test('should reset properly', () => {
      const instance1 = AudioManager.getInstance();
      resetAudioManager();
      const instance2 = AudioManager.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe('volume controls', () => {
    test('should have default master volume of 100', () => {
      expect(manager.getMasterVolume()).toBe(100);
    });

    test('should have default SFX volume of 100', () => {
      expect(manager.getSfxVolume()).toBe(100);
    });

    test('should have default music volume of 100', () => {
      expect(manager.getMusicVolume()).toBe(100);
    });

    test('should set master volume', () => {
      manager.setMasterVolume(75);
      expect(manager.getMasterVolume()).toBe(75);
    });

    test('should set SFX volume', () => {
      manager.setSfxVolume(50);
      expect(manager.getSfxVolume()).toBe(50);
    });

    test('should set music volume', () => {
      manager.setMusicVolume(25);
      expect(manager.getMusicVolume()).toBe(25);
    });

    test('should clamp volume to 0-100 range', () => {
      manager.setMasterVolume(-10);
      expect(manager.getMasterVolume()).toBe(0);

      manager.setMasterVolume(150);
      expect(manager.getMasterVolume()).toBe(100);
    });

    test('should clamp SFX volume to 0-100 range', () => {
      manager.setSfxVolume(-5);
      expect(manager.getSfxVolume()).toBe(0);

      manager.setSfxVolume(200);
      expect(manager.getSfxVolume()).toBe(100);
    });

    test('should clamp music volume to 0-100 range', () => {
      manager.setMusicVolume(-1);
      expect(manager.getMusicVolume()).toBe(0);

      manager.setMusicVolume(101);
      expect(manager.getMusicVolume()).toBe(100);
    });
  });

  describe('effective volume calculation', () => {
    test('should calculate effective SFX volume', () => {
      manager.setMasterVolume(50);
      manager.setSfxVolume(80);
      // 50% master * 80% sfx = 40% effective
      expect(manager.getEffectiveSfxVolume()).toBe(40);
    });

    test('should calculate effective music volume', () => {
      manager.setMasterVolume(75);
      manager.setMusicVolume(60);
      // 75% master * 60% music = 45% effective
      expect(manager.getEffectiveMusicVolume()).toBe(45);
    });

    test('should return 0 when master is 0', () => {
      manager.setMasterVolume(0);
      manager.setSfxVolume(100);
      manager.setMusicVolume(100);
      expect(manager.getEffectiveSfxVolume()).toBe(0);
      expect(manager.getEffectiveMusicVolume()).toBe(0);
    });

    test('should return normalized volume (0-1)', () => {
      manager.setMasterVolume(100);
      manager.setSfxVolume(50);
      expect(manager.getNormalizedSfxVolume()).toBe(0.5);
    });

    test('should return normalized music volume (0-1)', () => {
      manager.setMasterVolume(80);
      manager.setMusicVolume(50);
      // 80% * 50% = 40% = 0.4
      expect(manager.getNormalizedMusicVolume()).toBe(0.4);
    });
  });

  describe('mute functionality', () => {
    test('should not be muted by default', () => {
      expect(manager.isMuted()).toBe(false);
    });

    test('should mute audio', () => {
      manager.mute();
      expect(manager.isMuted()).toBe(true);
    });

    test('should unmute audio', () => {
      manager.mute();
      manager.unmute();
      expect(manager.isMuted()).toBe(false);
    });

    test('should toggle mute state', () => {
      expect(manager.isMuted()).toBe(false);
      manager.toggleMute();
      expect(manager.isMuted()).toBe(true);
      manager.toggleMute();
      expect(manager.isMuted()).toBe(false);
    });

    test('should return 0 volume when muted', () => {
      manager.setMasterVolume(100);
      manager.setSfxVolume(100);
      manager.setMusicVolume(100);
      manager.mute();

      expect(manager.getEffectiveSfxVolume()).toBe(0);
      expect(manager.getEffectiveMusicVolume()).toBe(0);
      expect(manager.getNormalizedSfxVolume()).toBe(0);
      expect(manager.getNormalizedMusicVolume()).toBe(0);
    });

    test('should restore volume after unmute', () => {
      manager.setMasterVolume(80);
      manager.setSfxVolume(60);
      manager.setMusicVolume(40);
      manager.mute();
      manager.unmute();

      expect(manager.getEffectiveSfxVolume()).toBe(48); // 80% * 60%
      expect(manager.getEffectiveMusicVolume()).toBe(32); // 80% * 40%
    });
  });

  describe('audio context activation', () => {
    test('should not be activated by default', () => {
      expect(manager.isActivated()).toBe(false);
    });

    test('should activate audio context', () => {
      manager.activate();
      expect(manager.isActivated()).toBe(true);
    });

    test('should remain activated once activated', () => {
      manager.activate();
      // Multiple activations should not change state
      manager.activate();
      expect(manager.isActivated()).toBe(true);
    });

    test('should trigger activation callback', () => {
      const callback = jest.fn();
      manager.onActivationChanged = callback;
      manager.activate();
      expect(callback).toHaveBeenCalledWith(true);
    });

    test('should not play audio when not activated', () => {
      expect(manager.canPlayAudio()).toBe(false);
    });

    test('should allow audio playback when activated', () => {
      manager.activate();
      expect(manager.canPlayAudio()).toBe(true);
    });

    test('should not allow audio when activated but muted', () => {
      manager.activate();
      manager.mute();
      expect(manager.canPlayAudio()).toBe(false);
    });
  });

  describe('settings persistence', () => {
    test('should save settings to localStorage', () => {
      manager.setMasterVolume(80);
      manager.setSfxVolume(60);
      manager.setMusicVolume(40);
      manager.saveSettings();

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = JSON.parse(mockStorage['overlord_audio_settings']);
      expect(savedData.masterVolume).toBe(80);
      expect(savedData.sfxVolume).toBe(60);
      expect(savedData.musicVolume).toBe(40);
    });

    test('should save mute state', () => {
      manager.mute();
      manager.saveSettings();

      const savedData = JSON.parse(mockStorage['overlord_audio_settings']);
      expect(savedData.isMuted).toBe(true);
    });

    test('should load settings from localStorage', () => {
      mockStorage['overlord_audio_settings'] = JSON.stringify({
        masterVolume: 70,
        sfxVolume: 50,
        musicVolume: 30,
        isMuted: false
      });

      resetAudioManager();
      const newManager = AudioManager.getInstance();
      newManager.loadSettings();

      expect(newManager.getMasterVolume()).toBe(70);
      expect(newManager.getSfxVolume()).toBe(50);
      expect(newManager.getMusicVolume()).toBe(30);
      expect(newManager.isMuted()).toBe(false);
    });

    test('should load muted state from localStorage', () => {
      mockStorage['overlord_audio_settings'] = JSON.stringify({
        masterVolume: 100,
        sfxVolume: 100,
        musicVolume: 100,
        isMuted: true
      });

      resetAudioManager();
      const newManager = AudioManager.getInstance();
      newManager.loadSettings();

      expect(newManager.isMuted()).toBe(true);
    });

    test('should use defaults when localStorage has no data', () => {
      resetAudioManager();
      const newManager = AudioManager.getInstance();
      newManager.loadSettings();

      expect(newManager.getMasterVolume()).toBe(100);
      expect(newManager.getSfxVolume()).toBe(100);
      expect(newManager.getMusicVolume()).toBe(100);
      expect(newManager.isMuted()).toBe(false);
    });

    test('should handle corrupted localStorage data', () => {
      mockStorage['overlord_audio_settings'] = 'not valid json';

      resetAudioManager();
      const newManager = AudioManager.getInstance();
      newManager.loadSettings();

      // Should fall back to defaults
      expect(newManager.getMasterVolume()).toBe(100);
    });
  });

  describe('settings object', () => {
    test('should get all settings as object', () => {
      manager.setMasterVolume(80);
      manager.setSfxVolume(60);
      manager.setMusicVolume(40);
      manager.mute();

      const settings = manager.getSettings();

      expect(settings).toEqual({
        masterVolume: 80,
        sfxVolume: 60,
        musicVolume: 40,
        isMuted: true
      });
    });

    test('should set all settings from object', () => {
      const settings: AudioSettings = {
        masterVolume: 70,
        sfxVolume: 50,
        musicVolume: 30,
        isMuted: false
      };

      manager.setSettings(settings);

      expect(manager.getMasterVolume()).toBe(70);
      expect(manager.getSfxVolume()).toBe(50);
      expect(manager.getMusicVolume()).toBe(30);
      expect(manager.isMuted()).toBe(false);
    });
  });

  describe('volume change callbacks', () => {
    test('should trigger callback on master volume change', () => {
      const callback = jest.fn();
      manager.onVolumeChanged = callback;
      manager.setMasterVolume(50);
      expect(callback).toHaveBeenCalledWith('master', 50);
    });

    test('should trigger callback on SFX volume change', () => {
      const callback = jest.fn();
      manager.onVolumeChanged = callback;
      manager.setSfxVolume(60);
      expect(callback).toHaveBeenCalledWith('sfx', 60);
    });

    test('should trigger callback on music volume change', () => {
      const callback = jest.fn();
      manager.onVolumeChanged = callback;
      manager.setMusicVolume(40);
      expect(callback).toHaveBeenCalledWith('music', 40);
    });

    test('should trigger callback on mute toggle', () => {
      const callback = jest.fn();
      manager.onMuteChanged = callback;
      manager.mute();
      expect(callback).toHaveBeenCalledWith(true);
    });

    test('should trigger callback on unmute', () => {
      const callback = jest.fn();
      manager.mute();
      manager.onMuteChanged = callback;
      manager.unmute();
      expect(callback).toHaveBeenCalledWith(false);
    });
  });

  describe('reset to defaults', () => {
    test('should reset all volumes to defaults', () => {
      manager.setMasterVolume(50);
      manager.setSfxVolume(30);
      manager.setMusicVolume(20);
      manager.mute();

      manager.resetToDefaults();

      expect(manager.getMasterVolume()).toBe(100);
      expect(manager.getSfxVolume()).toBe(100);
      expect(manager.getMusicVolume()).toBe(100);
      expect(manager.isMuted()).toBe(false);
    });
  });
});
