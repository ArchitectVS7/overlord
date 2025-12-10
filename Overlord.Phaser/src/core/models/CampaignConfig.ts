import { Difficulty, AIPersonality } from './Enums';

/**
 * Campaign Configuration
 * Stores settings for a new campaign including difficulty and AI behavior.
 */
export interface CampaignConfig {
  /** Difficulty level affecting AI capabilities */
  difficulty: Difficulty;
  /** AI personality determining strategic priorities */
  aiPersonality: AIPersonality;
  /** Random seed for deterministic galaxy generation */
  galaxySeed: number;
  /** Starting turn number */
  startingTurn: number;
}

/**
 * Default campaign configuration (AC-6: Normal difficulty, Balanced AI)
 */
export const DEFAULT_CAMPAIGN_CONFIG: CampaignConfig = {
  difficulty: Difficulty.Normal,
  aiPersonality: AIPersonality.Balanced,
  galaxySeed: 42,
  startingTurn: 1,
};

/**
 * Creates a campaign configuration with optional overrides
 * @param overrides Partial configuration to override defaults
 * @returns Complete campaign configuration
 */
export function createCampaignConfig(overrides?: Partial<CampaignConfig>): CampaignConfig {
  return {
    ...DEFAULT_CAMPAIGN_CONFIG,
    ...overrides,
  };
}

/**
 * Difficulty descriptions for UI tooltips (AC-2)
 */
export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  [Difficulty.Easy]: 'Reduced AI aggression, slower enemy expansion, good for learning',
  [Difficulty.Normal]: 'Balanced AI behavior, moderate challenge',
  [Difficulty.Hard]: 'Maximum AI aggression, faster expansion, expert challenge',
};

/**
 * AI Personality descriptions for UI tooltips (AC-3)
 */
export const AI_PERSONALITY_DESCRIPTIONS: Record<AIPersonality, string> = {
  [AIPersonality.Aggressive]: 'Prioritizes military production and early attacks',
  [AIPersonality.Defensive]: 'Focuses on fortifying planets and defensive structures',
  [AIPersonality.Economic]: 'Maximizes resource production and infrastructure',
  [AIPersonality.Balanced]: 'Adapts strategy based on game state',
};
