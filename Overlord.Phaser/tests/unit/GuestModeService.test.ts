/**
 * GuestModeService Tests
 *
 * Tests for guest mode functionality including session management
 * and local storage persistence.
 */

import { GuestModeService, getGuestModeService } from '../../src/services/GuestModeService';

describe('GuestModeService', () => {
  beforeEach(() => {
    // Reset singleton and clear localStorage
    GuestModeService.resetInstance();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getInstance', () => {
    it('returns the same instance on multiple calls', () => {
      const instance1 = GuestModeService.getInstance();
      const instance2 = GuestModeService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('getGuestModeService returns the singleton', () => {
      const service = getGuestModeService();
      expect(service).toBe(GuestModeService.getInstance());
    });
  });

  describe('enterGuestMode', () => {
    it('creates a guest user with default username', () => {
      const service = getGuestModeService();
      const guestUser = service.enterGuestMode();

      expect(guestUser).toBeDefined();
      expect(guestUser.username).toBe('Guest');
      expect(guestUser.isGuest).toBe(true);
      expect(guestUser.id).toMatch(/^guest_[a-z0-9]+_[a-z0-9]+$/);
    });

    it('creates a guest user with custom username', () => {
      const service = getGuestModeService();
      const guestUser = service.enterGuestMode('Commander');

      expect(guestUser.username).toBe('Commander');
    });

    it('trims whitespace from username', () => {
      const service = getGuestModeService();
      const guestUser = service.enterGuestMode('  Player One  ');

      expect(guestUser.username).toBe('Player One');
    });

    it('uses default username for empty string', () => {
      const service = getGuestModeService();
      const guestUser = service.enterGuestMode('');

      expect(guestUser.username).toBe('Guest');
    });

    it('sets isGuestMode to true', () => {
      const service = getGuestModeService();
      expect(service.isGuestMode()).toBe(false);

      service.enterGuestMode();
      expect(service.isGuestMode()).toBe(true);
    });

    it('fires onGuestModeChanged callback', () => {
      const service = getGuestModeService();
      const callback = jest.fn();
      service.onGuestModeChanged = callback;

      service.enterGuestMode();

      expect(callback).toHaveBeenCalledWith(true, expect.objectContaining({ isGuest: true }));
    });

    it('persists session to localStorage', () => {
      const service = getGuestModeService();
      service.enterGuestMode('TestPlayer');

      const stored = localStorage.getItem('overlord_guest_session');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.username).toBe('TestPlayer');
      expect(parsed.isGuest).toBe(true);
    });
  });

  describe('exitGuestMode', () => {
    it('clears the guest user', () => {
      const service = getGuestModeService();
      service.enterGuestMode();
      expect(service.isGuestMode()).toBe(true);

      service.exitGuestMode();
      expect(service.isGuestMode()).toBe(false);
      expect(service.getGuestUser()).toBeNull();
    });

    it('fires onGuestModeChanged callback', () => {
      const service = getGuestModeService();
      service.enterGuestMode();

      const callback = jest.fn();
      service.onGuestModeChanged = callback;

      service.exitGuestMode();

      expect(callback).toHaveBeenCalledWith(false, null);
    });

    it('clears localStorage', () => {
      const service = getGuestModeService();
      service.enterGuestMode();
      expect(localStorage.getItem('overlord_guest_session')).toBeDefined();

      service.exitGuestMode();
      expect(localStorage.getItem('overlord_guest_session')).toBeNull();
    });
  });

  describe('session restoration', () => {
    it('restores existing session on initialize', () => {
      // Create a session
      const service1 = getGuestModeService();
      const originalUser = service1.enterGuestMode('SavedPlayer');
      const originalId = originalUser.id;

      // Reset and create new instance
      GuestModeService.resetInstance();
      const service2 = getGuestModeService();
      service2.initialize();

      expect(service2.isGuestMode()).toBe(true);
      expect(service2.getGuestUser()?.id).toBe(originalId);
      expect(service2.getGuestUser()?.username).toBe('SavedPlayer');
    });

    it('returns existing session when enterGuestMode is called again', () => {
      const service = getGuestModeService();
      const firstUser = service.enterGuestMode('FirstName');
      const firstId = firstUser.id;

      // Reset singleton but keep localStorage
      GuestModeService.resetInstance();
      const newService = getGuestModeService();
      newService.initialize();

      // Enter guest mode again - should return existing session
      const secondUser = newService.enterGuestMode('DifferentName');
      expect(secondUser.id).toBe(firstId);
      expect(secondUser.username).toBe('FirstName'); // Original name preserved
    });
  });

  describe('getGuestId', () => {
    it('returns null when not in guest mode', () => {
      const service = getGuestModeService();
      expect(service.getGuestId()).toBeNull();
    });

    it('returns guest ID when in guest mode', () => {
      const service = getGuestModeService();
      const user = service.enterGuestMode();
      expect(service.getGuestId()).toBe(user.id);
    });
  });

  describe('getGuestUsername', () => {
    it('returns null when not in guest mode', () => {
      const service = getGuestModeService();
      expect(service.getGuestUsername()).toBeNull();
    });

    it('returns username when in guest mode', () => {
      const service = getGuestModeService();
      service.enterGuestMode('TestPlayer');
      expect(service.getGuestUsername()).toBe('TestPlayer');
    });
  });

  describe('updateUsername', () => {
    it('updates the username', () => {
      const service = getGuestModeService();
      service.enterGuestMode('OldName');
      expect(service.getGuestUsername()).toBe('OldName');

      service.updateUsername('NewName');
      expect(service.getGuestUsername()).toBe('NewName');
    });

    it('persists the updated username to localStorage', () => {
      const service = getGuestModeService();
      service.enterGuestMode('OldName');
      service.updateUsername('UpdatedName');

      const stored = JSON.parse(localStorage.getItem('overlord_guest_session')!);
      expect(stored.username).toBe('UpdatedName');
    });

    it('does nothing when not in guest mode', () => {
      const service = getGuestModeService();
      service.updateUsername('SomeName');
      expect(service.getGuestUsername()).toBeNull();
    });
  });

  describe('getLocalStoragePrefix', () => {
    it('returns default prefix when not in guest mode', () => {
      const service = getGuestModeService();
      expect(service.getLocalStoragePrefix()).toBe('overlord_guest_');
    });

    it('returns prefixed with guest ID when in guest mode', () => {
      const service = getGuestModeService();
      const user = service.enterGuestMode();
      expect(service.getLocalStoragePrefix()).toBe(`overlord_guest_${user.id}_`);
    });
  });
});
