import { AIPersonality } from './Enums';

/**
 * AI personality configuration with modifiers.
 */
export class AIPersonalityConfig {
  public personality: AIPersonality = AIPersonality.Balanced;
  public name: string = '';
  public quote: string = '';

  /**
   * Aggression modifier: +0.5 = more aggressive, -0.5 = more defensive.
   */
  public aggressionModifier: number = 0;

  /**
   * Economic modifier: +0.5 = prioritize economy, -0.3 = deprioritize economy.
   */
  public economicModifier: number = 0;

  /**
   * Defense modifier: +0.4 = prioritize defense, 0 = normal.
   */
  public defenseModifier: number = 0;

  /**
   * Gets personality configuration for a given type.
   */
  public static getConfig(personality: AIPersonality): AIPersonalityConfig {
    const config = new AIPersonalityConfig();

    switch (personality) {
      case AIPersonality.Aggressive:
        config.personality = AIPersonality.Aggressive;
        config.name = 'Commander Kratos';
        config.quote = 'Strength through conquest! Your planets will fall.';
        config.aggressionModifier = 0.5;
        config.economicModifier = -0.3;
        config.defenseModifier = 0.0;
        break;

      case AIPersonality.Defensive:
        config.personality = AIPersonality.Defensive;
        config.name = 'Overseer Aegis';
        config.quote = 'Patience is the strongest fortress. I can wait.';
        config.aggressionModifier = -0.5;
        config.economicModifier = 0.0;
        config.defenseModifier = 0.4;
        break;

      case AIPersonality.Economic:
        config.personality = AIPersonality.Economic;
        config.name = 'Magistrate Midas';
        config.quote = 'Credits are power. My wealth will crush you.';
        config.aggressionModifier = -0.3;
        config.economicModifier = 0.5;
        config.defenseModifier = 0.0;
        break;

      case AIPersonality.Balanced:
        config.personality = AIPersonality.Balanced;
        config.name = 'General Nexus';
        config.quote = 'Strategy, not emotion, wins wars.';
        config.aggressionModifier = 0.0;
        config.economicModifier = 0.0;
        config.defenseModifier = 0.0;
        break;

      default:
        throw new Error(`Unknown personality: ${personality}`);
    }

    return config;
  }
}

/**
 * AI game state assessment result.
 */
export class AIAssessment {
  /**
   * Threat level: Player military strength ÷ AI military strength.
   * < 0.5 = AI dominant, > 1.5 = Player dominant
   */
  public threatLevel: number = 0;

  /**
   * Economic strength ratio: AI resources ÷ Player resources.
   */
  public economicStrength: number = 0;

  /**
   * Number of AI-owned planets.
   */
  public aiPlanets: number = 0;

  /**
   * Number of player-owned planets.
   */
  public playerPlanets: number = 0;

  /**
   * True if player has fleet at AI planet (under attack).
   */
  public underAttack: boolean = false;

  /**
   * True if AI has military advantage and can attack.
   */
  public canAttack: boolean = false;
}
