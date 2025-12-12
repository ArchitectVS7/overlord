/**
 * PackMetadataHelper Tests
 * Story 9-3: Scenario Pack Metadata Display
 */

import {
  PackMetadataHelper,
  DifficultyBadge,
  PersonalityBadge,
  SortOption
} from '../../src/core/PackMetadataHelper';
import { PackDisplayData } from '../../src/core/models/ScenarioPackModels';
import { AIPersonality } from '../../src/core/models/Enums';

describe('PackMetadataHelper', () => {
  let helper: PackMetadataHelper;
  let mockPacks: PackDisplayData[];

  beforeEach(() => {
    helper = new PackMetadataHelper();

    mockPacks = [
      {
        id: 'default',
        name: 'Standard Campaign',
        factionLeader: 'Admiral Chen',
        difficulty: 'normal',
        aiPersonality: AIPersonality.Balanced,
        planetCount: '4-6 planets',
        resourceAbundance: 'standard',
        colorTheme: 0x4488ff,
        isLocked: false,
        isActive: true
      },
      {
        id: 'aggressive',
        name: 'Warlord Challenge',
        factionLeader: 'Commander Kratos',
        difficulty: 'hard',
        aiPersonality: AIPersonality.Aggressive,
        planetCount: '3-5 planets',
        resourceAbundance: 'scarce',
        colorTheme: 0xff4444,
        isLocked: false,
        isActive: false
      },
      {
        id: 'easy',
        name: 'Beginner Tutorial',
        factionLeader: 'Instructor Smith',
        difficulty: 'easy',
        aiPersonality: AIPersonality.Defensive,
        planetCount: '5-7 planets',
        resourceAbundance: 'rich',
        colorTheme: 0x44ff44,
        isLocked: false,
        isActive: false
      }
    ];
  });

  describe('getDifficultyBadge', () => {
    test('should return green badge for easy difficulty', () => {
      const badge = helper.getDifficultyBadge('easy');

      expect(badge.label).toBe('Easy');
      expect(badge.color).toBe('#44ff44');
    });

    test('should return yellow badge for normal difficulty', () => {
      const badge = helper.getDifficultyBadge('normal');

      expect(badge.label).toBe('Normal');
      expect(badge.color).toBe('#ffcc44');
    });

    test('should return red badge for hard difficulty', () => {
      const badge = helper.getDifficultyBadge('hard');

      expect(badge.label).toBe('Hard');
      expect(badge.color).toBe('#ff4444');
    });
  });

  describe('getPersonalityBadge', () => {
    test('should return aggressive badge', () => {
      const badge = helper.getPersonalityBadge(AIPersonality.Aggressive);

      expect(badge.label).toBe('Aggressive');
      expect(badge.icon).toBe('⚔️');
    });

    test('should return defensive badge', () => {
      const badge = helper.getPersonalityBadge(AIPersonality.Defensive);

      expect(badge.label).toBe('Defensive');
      expect(badge.icon).toBe('🛡️');
    });

    test('should return economic badge', () => {
      const badge = helper.getPersonalityBadge(AIPersonality.Economic);

      expect(badge.label).toBe('Economic');
      expect(badge.icon).toBe('💰');
    });

    test('should return balanced badge', () => {
      const badge = helper.getPersonalityBadge(AIPersonality.Balanced);

      expect(badge.label).toBe('Balanced');
      expect(badge.icon).toBe('⚖️');
    });
  });

  describe('sortPacks', () => {
    test('should sort by difficulty (easy to hard), active first', () => {
      const sorted = helper.sortPacks(mockPacks, SortOption.DifficultyAsc);

      // Active pack (Standard Campaign, normal) is first
      expect(sorted[0].isActive).toBe(true);
      // Non-active packs sorted by difficulty
      expect(sorted[1].difficulty).toBe('easy');
      expect(sorted[2].difficulty).toBe('hard');
    });

    test('should sort by difficulty (hard to easy), active first', () => {
      const sorted = helper.sortPacks(mockPacks, SortOption.DifficultyDesc);

      // Active pack first
      expect(sorted[0].isActive).toBe(true);
      // Non-active packs sorted by difficulty descending
      expect(sorted[1].difficulty).toBe('hard');
      expect(sorted[2].difficulty).toBe('easy');
    });

    test('should sort by name A-Z, active first', () => {
      const sorted = helper.sortPacks(mockPacks, SortOption.NameAsc);

      // Active pack first
      expect(sorted[0].isActive).toBe(true);
      expect(sorted[0].name).toBe('Standard Campaign');
      // Non-active packs sorted alphabetically
      expect(sorted[1].name).toBe('Beginner Tutorial');
      expect(sorted[2].name).toBe('Warlord Challenge');
    });

    test('should sort by name Z-A, active first', () => {
      const sorted = helper.sortPacks(mockPacks, SortOption.NameDesc);

      // Active pack first
      expect(sorted[0].isActive).toBe(true);
      expect(sorted[0].name).toBe('Standard Campaign');
      // Non-active packs sorted reverse alphabetically
      expect(sorted[1].name).toBe('Warlord Challenge');
      expect(sorted[2].name).toBe('Beginner Tutorial');
    });

    test('should keep active pack first regardless of sort', () => {
      const sorted = helper.sortPacks(mockPacks, SortOption.NameAsc);

      // Active pack (Standard Campaign) should be first even though
      // Beginner Tutorial comes before it alphabetically
      expect(sorted[0].isActive).toBe(true);
    });
  });

  describe('formatResourceAbundance', () => {
    test('should format scarce resources', () => {
      const result = helper.formatResourceAbundance('scarce');
      expect(result).toBe('Scarce Resources');
    });

    test('should format standard resources', () => {
      const result = helper.formatResourceAbundance('standard');
      expect(result).toBe('Standard Resources');
    });

    test('should format rich resources', () => {
      const result = helper.formatResourceAbundance('rich');
      expect(result).toBe('Rich Resources');
    });
  });

  describe('getColorThemePreview', () => {
    test('should return color as hex string', () => {
      const color = helper.getColorThemePreview(0xff4444);
      expect(color).toBe('#ff4444');
    });

    test('should pad short color values', () => {
      const color = helper.getColorThemePreview(0x4444);
      expect(color).toBe('#004444');
    });
  });

  describe('getPackSummary', () => {
    test('should generate pack summary string', () => {
      const summary = helper.getPackSummary(mockPacks[0]);

      expect(summary).toContain('Normal');
      expect(summary).toContain('Balanced');
      expect(summary).toContain('4-6 planets');
    });
  });
});
