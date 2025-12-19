/**
 * PackMetadataHelper
 * Story 9-3: Scenario Pack Metadata Display
 *
 * Utility functions for displaying and formatting pack metadata,
 * including difficulty badges, personality icons, and sorting.
 */

import { PackDisplayData } from './models/ScenarioPackModels';
import { AIPersonality } from './models/Enums';

/**
 * Difficulty badge display data
 */
export interface DifficultyBadge {
  label: string;
  color: string;
}

/**
 * Personality badge display data
 */
export interface PersonalityBadge {
  label: string;
  icon: string;
  color: string;
}

/**
 * Sort options for pack list
 */
export enum SortOption {
  DifficultyAsc = 'difficulty_asc',
  DifficultyDesc = 'difficulty_desc',
  NameAsc = 'name_asc',
  NameDesc = 'name_desc'
}

/**
 * Difficulty level order for sorting
 */
const DIFFICULTY_ORDER: Record<string, number> = {
  'easy': 0,
  'normal': 1,
  'hard': 2,
};

/**
 * Helper class for pack metadata display
 */
export class PackMetadataHelper {
  /**
   * Get difficulty badge display data
   */
  getDifficultyBadge(difficulty: 'easy' | 'normal' | 'hard'): DifficultyBadge {
    switch (difficulty) {
      case 'easy':
        return { label: 'Easy', color: '#44ff44' };
      case 'normal':
        return { label: 'Normal', color: '#ffcc44' };
      case 'hard':
        return { label: 'Hard', color: '#ff4444' };
      default:
        return { label: 'Normal', color: '#ffcc44' };
    }
  }

  /**
   * Get personality badge display data
   */
  getPersonalityBadge(personality: AIPersonality): PersonalityBadge {
    switch (personality) {
      case AIPersonality.Aggressive:
        return { label: 'Aggressive', icon: '⚔️', color: '#ff4444' };
      case AIPersonality.Defensive:
        return { label: 'Defensive', icon: '🛡️', color: '#4488ff' };
      case AIPersonality.Economic:
        return { label: 'Economic', icon: '💰', color: '#ffcc44' };
      case AIPersonality.Balanced:
      default:
        return { label: 'Balanced', icon: '⚖️', color: '#888888' };
    }
  }

  /**
   * Sort packs by specified option
   * Active packs always come first
   */
  sortPacks(packs: PackDisplayData[], sortOption: SortOption): PackDisplayData[] {
    const sorted = [...packs];

    // First sort by active status (active first)
    sorted.sort((a, b) => {
      if (a.isActive && !b.isActive) {return -1;}
      if (!a.isActive && b.isActive) {return 1;}
      return 0;
    });

    // Get non-active packs for secondary sort
    const activePacks = sorted.filter(p => p.isActive);
    const nonActivePacks = sorted.filter(p => !p.isActive);

    // Sort non-active packs by the specified option
    nonActivePacks.sort((a, b) => {
      switch (sortOption) {
        case SortOption.DifficultyAsc:
          return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
        case SortOption.DifficultyDesc:
          return DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty];
        case SortOption.NameAsc:
          return a.name.localeCompare(b.name);
        case SortOption.NameDesc:
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    // Combine: active first, then sorted non-active
    return [...activePacks, ...nonActivePacks];
  }

  /**
   * Format resource abundance for display
   */
  formatResourceAbundance(abundance: string): string {
    switch (abundance) {
      case 'scarce':
        return 'Scarce Resources';
      case 'standard':
        return 'Standard Resources';
      case 'rich':
        return 'Rich Resources';
      default:
        return 'Standard Resources';
    }
  }

  /**
   * Convert color theme to hex string for preview
   */
  getColorThemePreview(colorTheme: number): string {
    return '#' + colorTheme.toString(16).padStart(6, '0');
  }

  /**
   * Generate a summary string for a pack
   */
  getPackSummary(pack: PackDisplayData): string {
    const diffBadge = this.getDifficultyBadge(pack.difficulty);
    const persBadge = this.getPersonalityBadge(pack.aiPersonality);

    return `${diffBadge.label} | ${persBadge.label} AI | ${pack.planetCount}`;
  }
}
