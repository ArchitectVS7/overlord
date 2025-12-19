/**
 * Scenario Pack Models
 * Story 9-1: Scenario Pack Browsing and Selection
 *
 * Defines data structures for scenario packs that configure
 * AI behavior, galaxy templates, and faction themes.
 */

import { AIPersonality, AIDifficulty, PlanetType } from './Enums';

/**
 * Faction metadata for a scenario pack
 */
export interface FactionMetadata {
  /** Faction name */
  name: string;
  /** Leader/commander name */
  leader: string;
  /** Faction lore/backstory */
  lore: string;
  /** Color theme (hex) */
  colorTheme: number;
}

/**
 * AI configuration for a scenario pack
 */
export interface PackAIConfig {
  /** AI personality archetype */
  personality: AIPersonality;
  /** AI difficulty level */
  difficulty: AIDifficulty;
  /** Optional modifier overrides */
  modifiers?: {
    resourceBonus?: number;
    militaryBonus?: number;
    aggressionMultiplier?: number;
  };
}

/**
 * Galaxy template for a scenario pack
 */
export interface GalaxyTemplate {
  /** Planet count range */
  planetCount: {
    min: number;
    max: number;
  };
  /** Allowed planet types */
  planetTypes: PlanetType[];
  /** Resource abundance level */
  resourceAbundance: 'scarce' | 'standard' | 'rich';
  /** Starting resources multiplier */
  startingResourcesMultiplier?: number;
}

/**
 * Unlock requirements for locked packs
 */
export interface UnlockRequirement {
  /** Requirement type */
  type: 'scenario_complete' | 'pack_complete' | 'achievement';
  /** Target ID to unlock */
  targetId: string;
  /** Human-readable description */
  description: string;
}

/**
 * Complete scenario pack definition
 */
export interface ScenarioPack {
  /** Unique pack identifier */
  id: string;
  /** Display name */
  name: string;
  /** Pack version */
  version: string;
  /** Pack description */
  description: string;
  /** Faction metadata */
  faction: FactionMetadata;
  /** AI configuration */
  aiConfig: PackAIConfig;
  /** Galaxy template */
  galaxyTemplate: GalaxyTemplate;
  /** Unlock requirements (undefined = unlocked) */
  unlockRequirements?: UnlockRequirement[];
  /** Whether this is the default pack */
  isDefault?: boolean;
  /** Featured pack (shown first) */
  featured?: boolean;
}

/**
 * Pack display data for UI
 */
export interface PackDisplayData {
  /** Pack ID */
  id: string;
  /** Display name */
  name: string;
  /** Faction leader name */
  factionLeader: string;
  /** Pack difficulty */
  difficulty: 'easy' | 'normal' | 'hard';
  /** AI personality */
  aiPersonality: AIPersonality;
  /** Planet count display string */
  planetCount: string;
  /** Resource abundance */
  resourceAbundance: string;
  /** Color theme */
  colorTheme: number;
  /** Portrait URL (optional) */
  portraitUrl?: string;
  /** Whether pack is locked */
  isLocked: boolean;
  /** Whether pack is currently active */
  isActive: boolean;
}

/**
 * Converts AIDifficulty to display difficulty string
 */
export function difficultyToDisplayString(difficulty: AIDifficulty): 'easy' | 'normal' | 'hard' {
  switch (difficulty) {
    case AIDifficulty.Easy: return 'easy';
    case AIDifficulty.Normal: return 'normal';
    case AIDifficulty.Hard: return 'hard';
    default: return 'normal';
  }
}

/**
 * Creates pack display data from a scenario pack
 */
export function createPackDisplayData(
  pack: ScenarioPack,
  isLocked: boolean,
  isActive: boolean,
): PackDisplayData {
  return {
    id: pack.id,
    name: pack.name,
    factionLeader: pack.faction.leader,
    difficulty: difficultyToDisplayString(pack.aiConfig.difficulty),
    aiPersonality: pack.aiConfig.personality,
    planetCount: `${pack.galaxyTemplate.planetCount.min}-${pack.galaxyTemplate.planetCount.max} planets`,
    resourceAbundance: pack.galaxyTemplate.resourceAbundance,
    colorTheme: pack.faction.colorTheme,
    isLocked,
    isActive,
  };
}
