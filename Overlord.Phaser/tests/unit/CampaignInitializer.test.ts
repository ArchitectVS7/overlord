import { CampaignInitializer } from '@core/CampaignInitializer';
import { Difficulty, AIPersonality, TurnPhase } from '@core/models/Enums';
import { DEFAULT_CAMPAIGN_CONFIG } from '@core/models/CampaignConfig';

describe('CampaignInitializer', () => {
  let initializer: CampaignInitializer;

  beforeEach(() => {
    initializer = new CampaignInitializer();
  });

  describe('initializeCampaign', () => {
    test('should initialize campaign successfully', () => {
      const result = initializer.initializeCampaign();
      expect(result.success).toBe(true);
      expect(result.gameState).toBeDefined();
      expect(result.galaxy).toBeDefined();
      expect(result.turnSystem).toBeDefined();
    });

    test('should apply default config when no overrides provided (AC-6)', () => {
      const result = initializer.initializeCampaign();
      expect(result.gameState.campaignConfig?.difficulty).toBe(Difficulty.Normal);
      expect(result.gameState.campaignConfig?.aiPersonality).toBe(AIPersonality.Balanced);
    });

    test('should set initial turn to 1 (AC-5)', () => {
      const result = initializer.initializeCampaign();
      expect(result.gameState.currentTurn).toBe(1);
    });

    test('should set initial phase to Income (AC-5)', () => {
      const result = initializer.initializeCampaign();
      expect(result.gameState.currentPhase).toBe(TurnPhase.Income);
    });

    test('should generate galaxy with 4-6 planets (AC-5)', () => {
      const result = initializer.initializeCampaign();
      expect(result.galaxy.planets.length).toBeGreaterThanOrEqual(4);
      expect(result.galaxy.planets.length).toBeLessThanOrEqual(6);
    });

    test('should add planets to game state', () => {
      const result = initializer.initializeCampaign();
      expect(result.gameState.planets.length).toBe(result.galaxy.planets.length);
    });

    test('should populate planetLookup map', () => {
      const result = initializer.initializeCampaign();
      expect(result.gameState.planetLookup.size).toBe(result.galaxy.planets.length);
    });

    test('should override difficulty', () => {
      const result = initializer.initializeCampaign({ difficulty: Difficulty.Hard });
      expect(result.gameState.campaignConfig?.difficulty).toBe(Difficulty.Hard);
    });

    test('should override AI personality', () => {
      const result = initializer.initializeCampaign({ aiPersonality: AIPersonality.Aggressive });
      expect(result.gameState.campaignConfig?.aiPersonality).toBe(AIPersonality.Aggressive);
    });

    test('should override galaxy seed', () => {
      const result = initializer.initializeCampaign({ galaxySeed: 9999 });
      expect(result.gameState.campaignConfig?.galaxySeed).toBe(9999);
    });

    test('should use deterministic seed for reproducibility', () => {
      const result1 = initializer.initializeCampaign({ galaxySeed: 12345 });
      const result2 = initializer.initializeCampaign({ galaxySeed: 12345 });
      expect(result1.galaxy.planets.length).toBe(result2.galaxy.planets.length);
    });

    test('should complete initialization within 3 seconds (AC-4)', () => {
      const result = initializer.initializeCampaign();
      expect(result.initializationTimeMs).toBeLessThan(3000);
    });

    test('should record initialization time', () => {
      const result = initializer.initializeCampaign();
      expect(result.initializationTimeMs).toBeGreaterThan(0);
    });

    test('should fail initialization with invalid config (zero seed)', () => {
      const result = initializer.initializeCampaign({ galaxySeed: 0 });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid campaign configuration');
    });

    test('should fail initialization with invalid config (zero startingTurn)', () => {
      const result = initializer.initializeCampaign({ startingTurn: 0 });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateConfig', () => {
    test('should validate default configuration', () => {
      expect(initializer.validateConfig(DEFAULT_CAMPAIGN_CONFIG)).toBe(true);
    });

    test('should validate custom valid configuration', () => {
      const config = {
        difficulty: Difficulty.Hard,
        aiPersonality: AIPersonality.Aggressive,
        galaxySeed: 1234,
        startingTurn: 1,
      };
      expect(initializer.validateConfig(config)).toBe(true);
    });

    test('should reject config with zero galaxy seed', () => {
      const config = { ...DEFAULT_CAMPAIGN_CONFIG, galaxySeed: 0 };
      expect(initializer.validateConfig(config)).toBe(false);
    });

    test('should reject config with negative galaxy seed', () => {
      const config = { ...DEFAULT_CAMPAIGN_CONFIG, galaxySeed: -1 };
      expect(initializer.validateConfig(config)).toBe(false);
    });

    test('should reject config with zero starting turn', () => {
      const config = { ...DEFAULT_CAMPAIGN_CONFIG, startingTurn: 0 };
      expect(initializer.validateConfig(config)).toBe(false);
    });
  });

  describe('getEstimatedInitTime', () => {
    test('should return estimated initialization time', () => {
      const estimatedTime = initializer.getEstimatedInitTime();
      expect(estimatedTime).toBeGreaterThan(0);
    });

    test('should return estimate under 3 seconds', () => {
      const estimatedTime = initializer.getEstimatedInitTime();
      expect(estimatedTime).toBeLessThan(3000);
    });
  });
});
