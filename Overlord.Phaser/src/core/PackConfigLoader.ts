/**
 * PackConfigLoader
 * Story 9-2: Scenario Pack Switching and Configuration Loading
 *
 * Loads and validates scenario pack configurations,
 * converting pack settings to campaign configuration format.
 */

import { ScenarioPack, GalaxyTemplate } from './models/ScenarioPackModels';
import { AIPersonality, AIDifficulty, Difficulty } from './models/Enums';
import { CampaignConfig } from './models/CampaignConfig';

/**
 * Loaded pack configuration for campaign use
 */
export interface LoadedPackConfig {
  /** AI personality from pack */
  aiPersonality: AIPersonality;
  /** Converted difficulty level */
  difficulty: Difficulty;
  /** Galaxy generation template */
  galaxyTemplate?: GalaxyTemplate;
  /** AI behavior modifiers */
  aiModifiers?: {
    resourceBonus?: number;
    militaryBonus?: number;
    aggressionMultiplier?: number;
  };
}

/**
 * Result of loading pack configuration
 */
export interface PackConfigResult {
  /** Whether loading succeeded */
  success: boolean;
  /** Loaded configuration (if success) */
  config?: LoadedPackConfig;
  /** Error message (if failed) */
  error?: string;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: LoadedPackConfig = {
  aiPersonality: AIPersonality.Balanced,
  difficulty: Difficulty.Normal,
};

/**
 * Loads and validates scenario pack configurations
 */
export class PackConfigLoader {
  /**
   * Load configuration from a scenario pack
   */
  loadPackConfig(pack: ScenarioPack): PackConfigResult {
    // Validate pack
    if (!this.validatePackConfig(pack)) {
      return {
        success: false,
        error: 'Invalid pack configuration: missing required fields',
      };
    }

    try {
      const config: LoadedPackConfig = {
        aiPersonality: pack.aiConfig.personality,
        difficulty: this.convertDifficulty(pack.aiConfig.difficulty),
        galaxyTemplate: pack.galaxyTemplate,
        aiModifiers: pack.aiConfig.modifiers,
      };

      return {
        success: true,
        config,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error loading pack config',
      };
    }
  }

  /**
   * Validate pack configuration has required fields
   */
  validatePackConfig(pack: ScenarioPack): boolean {
    if (!pack) {return false;}
    if (!pack.aiConfig) {return false;}
    if (!pack.galaxyTemplate) {return false;}

    // Validate planet count range
    const { min, max } = pack.galaxyTemplate.planetCount;
    if (min > max || min < 1) {return false;}

    return true;
  }

  /**
   * Convert AIDifficulty enum to Difficulty enum
   */
  convertDifficulty(aiDifficulty: AIDifficulty): Difficulty {
    switch (aiDifficulty) {
      case AIDifficulty.Easy:
        return Difficulty.Easy;
      case AIDifficulty.Hard:
        return Difficulty.Hard;
      case AIDifficulty.Normal:
      default:
        return Difficulty.Normal;
    }
  }

  /**
   * Get default configuration
   */
  getDefaultConfig(): LoadedPackConfig {
    return { ...DEFAULT_CONFIG };
  }

  /**
   * Apply pack settings to existing campaign config
   */
  applyPackToConfig(pack: ScenarioPack, baseConfig: CampaignConfig): CampaignConfig {
    const packResult = this.loadPackConfig(pack);

    if (!packResult.success || !packResult.config) {
      return baseConfig;
    }

    return {
      ...baseConfig,
      difficulty: packResult.config.difficulty,
      aiPersonality: packResult.config.aiPersonality,
    };
  }
}
