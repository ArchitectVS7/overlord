/**
 * UserStatisticsService Tests
 * Story 10-7: User Statistics Tracking
 *
 * Tests for user statistics management including:
 * - Local storage fallback for guest mode
 * - Statistics retrieval and updates
 * - Increment methods for game events
 * - Playtime tracking
 */

import {
  UserStatisticsService,
  getUserStatisticsService,
  UserStatistics,
} from '../../src/services/UserStatisticsService';

// Mock dependencies
jest.mock('../../src/services/SupabaseClient', () => ({
  getSupabaseClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: null,
              error: { code: 'PGRST116', message: 'Not found' },
            })
          ),
        })),
      })),
      upsert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  })),
}));

jest.mock('../../src/services/AuthService', () => ({
  getAuthService: jest.fn(() => ({
    getUserId: jest.fn(() => null),
    isAuthenticated: jest.fn(() => false),
  })),
}));

jest.mock('../../src/services/GuestModeService', () => ({
  getGuestModeService: jest.fn(() => ({
    isGuestMode: jest.fn(() => true),
    getGuestId: jest.fn(() => 'guest_test_123'),
  })),
}));

const LOCAL_STATS_KEY = 'overlord_user_statistics';

describe('UserStatisticsService', () => {
  beforeEach(() => {
    // Reset singleton and clear localStorage
    UserStatisticsService.resetInstance();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getInstance', () => {
    it('returns the same instance on multiple calls', () => {
      const instance1 = UserStatisticsService.getInstance();
      const instance2 = UserStatisticsService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('getUserStatisticsService returns the singleton', () => {
      const service = getUserStatisticsService();
      expect(service).toBe(UserStatisticsService.getInstance());
    });
  });

  describe('getStatistics', () => {
    it('returns default statistics for guest mode', async () => {
      const service = getUserStatisticsService();
      const result = await service.getStatistics();

      expect(result.success).toBe(true);
      expect(result.statistics).toBeDefined();
      expect(result.statistics?.campaignsStarted).toBe(0);
      expect(result.statistics?.campaignsWon).toBe(0);
      expect(result.statistics?.campaignsLost).toBe(0);
      expect(result.statistics?.totalPlaytimeSeconds).toBe(0);
    });

    it('returns cached statistics on second call', async () => {
      const service = getUserStatisticsService();

      const result1 = await service.getStatistics();
      const result2 = await service.getStatistics();

      expect(result1.statistics).toBe(result2.statistics);
    });

    it('force refresh bypasses cache', async () => {
      const service = getUserStatisticsService();

      await service.getStatistics();
      const result = await service.getStatistics(true);

      expect(result.success).toBe(true);
    });
  });

  describe('Increment Methods', () => {
    describe('recordCampaignStarted', () => {
      it('increments campaigns started', async () => {
        const service = getUserStatisticsService();

        await service.recordCampaignStarted();
        const result = await service.getStatistics(true);

        expect(result.statistics?.campaignsStarted).toBe(1);
      });
    });

    describe('recordCampaignWon', () => {
      it('increments campaigns won', async () => {
        const service = getUserStatisticsService();

        await service.recordCampaignWon();
        const result = await service.getStatistics(true);

        expect(result.statistics?.campaignsWon).toBe(1);
      });
    });

    describe('recordCampaignLost', () => {
      it('increments campaigns lost', async () => {
        const service = getUserStatisticsService();

        await service.recordCampaignLost();
        const result = await service.getStatistics(true);

        expect(result.statistics?.campaignsLost).toBe(1);
      });
    });

    describe('recordPlanetConquered', () => {
      it('increments planets conquered', async () => {
        const service = getUserStatisticsService();

        await service.recordPlanetConquered();
        await service.recordPlanetConquered();
        const result = await service.getStatistics(true);

        expect(result.statistics?.planetsConquered).toBe(2);
      });
    });

    describe('recordPlanetLost', () => {
      it('increments planets lost', async () => {
        const service = getUserStatisticsService();

        await service.recordPlanetLost();
        const result = await service.getStatistics(true);

        expect(result.statistics?.planetsLost).toBe(1);
      });
    });

    describe('recordBattleWon', () => {
      it('increments battles won', async () => {
        const service = getUserStatisticsService();

        await service.recordBattleWon();
        const result = await service.getStatistics(true);

        expect(result.statistics?.battlesWon).toBe(1);
      });
    });

    describe('recordBattleLost', () => {
      it('increments battles lost', async () => {
        const service = getUserStatisticsService();

        await service.recordBattleLost();
        const result = await service.getStatistics(true);

        expect(result.statistics?.battlesLost).toBe(1);
      });
    });

    describe('recordFlashConflictCompleted', () => {
      it('increments flash conflicts completed', async () => {
        const service = getUserStatisticsService();

        await service.recordFlashConflictCompleted(2);
        const result = await service.getStatistics(true);

        expect(result.statistics?.flashConflictsCompleted).toBe(1);
        expect(result.statistics?.flashConflictsThreeStar).toBe(0);
      });

      it('increments three star count for 3-star completion', async () => {
        const service = getUserStatisticsService();

        await service.recordFlashConflictCompleted(3);
        const result = await service.getStatistics(true);

        expect(result.statistics?.flashConflictsCompleted).toBe(1);
        expect(result.statistics?.flashConflictsThreeStar).toBe(1);
      });
    });
  });

  describe('Playtime Tracking', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('getCurrentSessionPlaytime returns 0 when not tracking', () => {
      const service = getUserStatisticsService();
      expect(service.getCurrentSessionPlaytime()).toBe(0);
    });

    it('getCurrentSessionPlaytime tracks elapsed time', () => {
      const service = getUserStatisticsService();

      service.startPlaytimeTracking();
      jest.advanceTimersByTime(5000); // 5 seconds

      expect(service.getCurrentSessionPlaytime()).toBe(5);
    });

    it('stopPlaytimeTracking adds to total playtime', async () => {
      const service = getUserStatisticsService();

      service.startPlaytimeTracking();
      jest.advanceTimersByTime(10000); // 10 seconds
      await service.stopPlaytimeTracking();

      const result = await service.getStatistics(true);
      expect(result.statistics?.totalPlaytimeSeconds).toBe(10);
    });

    it('stopPlaytimeTracking does nothing if not tracking', async () => {
      const service = getUserStatisticsService();

      await service.stopPlaytimeTracking();
      const result = await service.getStatistics();

      expect(result.statistics?.totalPlaytimeSeconds).toBe(0);
    });
  });

  describe('Utility Methods', () => {
    describe('formatPlaytime', () => {
      it('formats seconds as minutes only', () => {
        const service = getUserStatisticsService();
        expect(service.formatPlaytime(300)).toBe('5m');
      });

      it('formats hours and minutes', () => {
        const service = getUserStatisticsService();
        expect(service.formatPlaytime(3720)).toBe('1h 2m');
      });

      it('handles zero', () => {
        const service = getUserStatisticsService();
        expect(service.formatPlaytime(0)).toBe('0m');
      });
    });

    describe('calculateWinRate', () => {
      it('returns 0 when no games played', () => {
        const service = getUserStatisticsService();
        const stats: UserStatistics = {
          userId: 'test',
          campaignsStarted: 0,
          campaignsWon: 0,
          campaignsLost: 0,
          totalPlaytimeSeconds: 0,
          planetsConquered: 0,
          planetsLost: 0,
          battlesWon: 0,
          battlesLost: 0,
          flashConflictsCompleted: 0,
          flashConflictsThreeStar: 0,
        };

        expect(service.calculateWinRate(stats)).toBe(0);
      });

      it('calculates correct win rate', () => {
        const service = getUserStatisticsService();
        const stats: UserStatistics = {
          userId: 'test',
          campaignsStarted: 10,
          campaignsWon: 7,
          campaignsLost: 3,
          totalPlaytimeSeconds: 0,
          planetsConquered: 0,
          planetsLost: 0,
          battlesWon: 0,
          battlesLost: 0,
          flashConflictsCompleted: 0,
          flashConflictsThreeStar: 0,
        };

        expect(service.calculateWinRate(stats)).toBe(70);
      });
    });
  });

  describe('Cache Management', () => {
    it('clearCache clears cached stats', async () => {
      const service = getUserStatisticsService();

      await service.getStatistics();
      service.clearCache();

      // Should fetch fresh stats
      const result = await service.getStatistics();
      expect(result.success).toBe(true);
    });
  });

  describe('Local Storage Persistence', () => {
    it('persists statistics to localStorage in guest mode', async () => {
      const service = getUserStatisticsService();

      await service.recordCampaignWon();

      const stored = localStorage.getItem(LOCAL_STATS_KEY);
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.campaignsWon).toBe(1);
    });

    it('restores statistics from localStorage', async () => {
      // Pre-populate localStorage
      const existingStats = {
        campaignsStarted: 5,
        campaignsWon: 3,
        campaignsLost: 2,
        totalPlaytimeSeconds: 3600,
        planetsConquered: 10,
        planetsLost: 5,
        battlesWon: 20,
        battlesLost: 8,
        flashConflictsCompleted: 4,
        flashConflictsThreeStar: 2,
      };
      localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(existingStats));

      const service = getUserStatisticsService();
      const result = await service.getStatistics();

      expect(result.statistics?.campaignsStarted).toBe(5);
      expect(result.statistics?.campaignsWon).toBe(3);
      expect(result.statistics?.totalPlaytimeSeconds).toBe(3600);
    });
  });
});
