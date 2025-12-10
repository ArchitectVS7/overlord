import {
  CampaignConfig,
  DEFAULT_CAMPAIGN_CONFIG,
  createCampaignConfig,
  DIFFICULTY_DESCRIPTIONS,
  AI_PERSONALITY_DESCRIPTIONS,
} from '@core/models/CampaignConfig';
import { Difficulty, AIPersonality } from '@core/models/Enums';

describe('CampaignConfig', () => {
  describe('DEFAULT_CAMPAIGN_CONFIG', () => {
    test('should have Normal difficulty by default (AC-6)', () => {
      expect(DEFAULT_CAMPAIGN_CONFIG.difficulty).toBe(Difficulty.Normal);
    });

    test('should have Balanced AI personality by default (AC-6)', () => {
      expect(DEFAULT_CAMPAIGN_CONFIG.aiPersonality).toBe(AIPersonality.Balanced);
    });

    test('should have seed 42 by default', () => {
      expect(DEFAULT_CAMPAIGN_CONFIG.galaxySeed).toBe(42);
    });

    test('should start on turn 1 by default', () => {
      expect(DEFAULT_CAMPAIGN_CONFIG.startingTurn).toBe(1);
    });
  });

  describe('createCampaignConfig', () => {
    test('should return default config when no overrides provided', () => {
      const config = createCampaignConfig();
      expect(config).toEqual(DEFAULT_CAMPAIGN_CONFIG);
    });

    test('should override difficulty while keeping other defaults', () => {
      const config = createCampaignConfig({ difficulty: Difficulty.Hard });
      expect(config.difficulty).toBe(Difficulty.Hard);
      expect(config.aiPersonality).toBe(AIPersonality.Balanced);
      expect(config.galaxySeed).toBe(42);
    });

    test('should override AI personality while keeping other defaults', () => {
      const config = createCampaignConfig({ aiPersonality: AIPersonality.Aggressive });
      expect(config.aiPersonality).toBe(AIPersonality.Aggressive);
      expect(config.difficulty).toBe(Difficulty.Normal);
    });

    test('should override multiple properties', () => {
      const config = createCampaignConfig({
        difficulty: Difficulty.Easy,
        aiPersonality: AIPersonality.Economic,
        galaxySeed: 1234,
      });
      expect(config.difficulty).toBe(Difficulty.Easy);
      expect(config.aiPersonality).toBe(AIPersonality.Economic);
      expect(config.galaxySeed).toBe(1234);
      expect(config.startingTurn).toBe(1);
    });
  });

  describe('DIFFICULTY_DESCRIPTIONS (AC-2)', () => {
    test('should have descriptions for all difficulty levels', () => {
      expect(DIFFICULTY_DESCRIPTIONS[Difficulty.Easy]).toBeDefined();
      expect(DIFFICULTY_DESCRIPTIONS[Difficulty.Normal]).toBeDefined();
      expect(DIFFICULTY_DESCRIPTIONS[Difficulty.Hard]).toBeDefined();
    });

    test('should have non-empty descriptions', () => {
      expect(DIFFICULTY_DESCRIPTIONS[Difficulty.Easy].length).toBeGreaterThan(0);
      expect(DIFFICULTY_DESCRIPTIONS[Difficulty.Normal].length).toBeGreaterThan(0);
      expect(DIFFICULTY_DESCRIPTIONS[Difficulty.Hard].length).toBeGreaterThan(0);
    });

    test('Easy should mention learning or reduced difficulty', () => {
      const desc = DIFFICULTY_DESCRIPTIONS[Difficulty.Easy].toLowerCase();
      expect(desc.includes('learning') || desc.includes('reduced')).toBe(true);
    });

    test('Hard should mention challenge or expert', () => {
      const desc = DIFFICULTY_DESCRIPTIONS[Difficulty.Hard].toLowerCase();
      expect(desc.includes('challenge') || desc.includes('expert') || desc.includes('maximum')).toBe(true);
    });
  });

  describe('AI_PERSONALITY_DESCRIPTIONS (AC-3)', () => {
    test('should have descriptions for all AI personalities', () => {
      expect(AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Aggressive]).toBeDefined();
      expect(AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Defensive]).toBeDefined();
      expect(AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Economic]).toBeDefined();
      expect(AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Balanced]).toBeDefined();
    });

    test('should have non-empty descriptions', () => {
      Object.values(AI_PERSONALITY_DESCRIPTIONS).forEach(desc => {
        expect(desc.length).toBeGreaterThan(0);
      });
    });

    test('Aggressive should mention military or attack', () => {
      const desc = AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Aggressive].toLowerCase();
      expect(desc.includes('military') || desc.includes('attack')).toBe(true);
    });

    test('Defensive should mention defense or fortify', () => {
      const desc = AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Defensive].toLowerCase();
      expect(desc.includes('defense') || desc.includes('fortify') || desc.includes('defensive')).toBe(true);
    });

    test('Economic should mention resource or infrastructure', () => {
      const desc = AI_PERSONALITY_DESCRIPTIONS[AIPersonality.Economic].toLowerCase();
      expect(desc.includes('resource') || desc.includes('infrastructure') || desc.includes('production')).toBe(true);
    });
  });
});
