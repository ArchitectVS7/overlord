/**
 * Unit tests for PlanetRenderer
 * Tests the planet type to visual config mapping logic
 */

import { PlanetType, FactionType } from '@core/models/Enums';
import { PLANET_VISUALS, OWNER_COLORS } from '../../src/config/VisualConfig';

// Test the mapping logic without requiring Phaser
describe('PlanetRenderer Mapping Logic', () => {
  // Mirror the mapping from PlanetRenderer.ts for testing
  const PLANET_TYPE_MAP: Record<PlanetType, string> = {
    [PlanetType.Desert]: 'Desert',
    [PlanetType.Volcanic]: 'Volcanic',
    [PlanetType.Tropical]: 'Terran',
    [PlanetType.Metropolis]: 'GasGiant'
  };

  const FACTION_MAP: Record<FactionType, string> = {
    [FactionType.Player]: 'Player',
    [FactionType.AI]: 'AI',
    [FactionType.Neutral]: 'Neutral'
  };

  describe('Planet Type Mapping', () => {
    test('should map all PlanetType enum values to visual configs', () => {
      // Verify every PlanetType has a mapping
      Object.values(PlanetType).forEach(planetType => {
        expect(PLANET_TYPE_MAP).toHaveProperty(planetType);
      });
    });

    test('should map to existing visual config keys', () => {
      Object.values(PLANET_TYPE_MAP).forEach(visualKey => {
        expect(PLANET_VISUALS).toHaveProperty(visualKey);
      });
    });

    test('Desert maps to Desert visual', () => {
      expect(PLANET_TYPE_MAP[PlanetType.Desert]).toBe('Desert');
    });

    test('Volcanic maps to Volcanic visual', () => {
      expect(PLANET_TYPE_MAP[PlanetType.Volcanic]).toBe('Volcanic');
    });

    test('Tropical maps to Terran visual', () => {
      expect(PLANET_TYPE_MAP[PlanetType.Tropical]).toBe('Terran');
    });

    test('Metropolis maps to GasGiant visual', () => {
      expect(PLANET_TYPE_MAP[PlanetType.Metropolis]).toBe('GasGiant');
    });
  });

  describe('Faction Type Mapping', () => {
    test('should map all FactionType enum values to owner colors', () => {
      Object.values(FactionType).forEach(factionType => {
        expect(FACTION_MAP).toHaveProperty(factionType);
      });
    });

    test('should map to existing owner color keys', () => {
      Object.values(FACTION_MAP).forEach(colorKey => {
        expect(OWNER_COLORS).toHaveProperty(colorKey);
      });
    });

    test('Player faction maps to Player color', () => {
      expect(FACTION_MAP[FactionType.Player]).toBe('Player');
      expect(OWNER_COLORS.Player).toBe(0x00ff00); // Green
    });

    test('AI faction maps to AI color', () => {
      expect(FACTION_MAP[FactionType.AI]).toBe('AI');
      expect(OWNER_COLORS.AI).toBe(0xff0000); // Red
    });

    test('Neutral faction maps to Neutral color', () => {
      expect(FACTION_MAP[FactionType.Neutral]).toBe('Neutral');
      expect(OWNER_COLORS.Neutral).toBe(0x808080); // Gray
    });
  });

  describe('Hit Area Size Calculation', () => {
    // Test the calculation logic without Phaser dependency
    // Updated to match PlanetRenderer's minimum 44px for accessibility
    function getHitAreaSize(planetType: PlanetType): number {
      const typeKey = PLANET_TYPE_MAP[planetType] || 'Terran';
      const visualConfig = PLANET_VISUALS[typeKey] || PLANET_VISUALS.Terran;
      const baseSize = visualConfig.size + 10; // 10px padding for easier clicking
      return Math.max(baseSize, 44); // Minimum 44px for touch accessibility (NFR-A2)
    }

    test('Desert planet hit area meets minimum touch target', () => {
      const size = getHitAreaSize(PlanetType.Desert);
      // 30 + 10 = 40, but min is 44
      expect(size).toBe(44);
    });

    test('Volcanic planet hit area includes padding', () => {
      const size = getHitAreaSize(PlanetType.Volcanic);
      // 34 + 10 = 44, meets minimum exactly
      expect(size).toBe(44);
    });

    test('Tropical planet hit area meets minimum touch target', () => {
      const size = getHitAreaSize(PlanetType.Tropical);
      // 32 + 10 = 42, but min is 44
      expect(size).toBe(44);
    });

    test('Metropolis planet hit area uses GasGiant config (largest)', () => {
      const size = getHitAreaSize(PlanetType.Metropolis);
      // 48 + 10 = 58, exceeds minimum
      expect(size).toBe(58);
    });

    test('all hit areas meet minimum 44px touch target (NFR-A2)', () => {
      Object.values(PlanetType).forEach(planetType => {
        const size = getHitAreaSize(planetType);
        expect(size).toBeGreaterThanOrEqual(44); // Accessibility requirement
        expect(size).toBeLessThan(100); // Reasonable upper bound
      });
    });

    test('all hit areas are positive and reasonable', () => {
      Object.values(PlanetType).forEach(planetType => {
        const size = getHitAreaSize(planetType);
        expect(size).toBeGreaterThan(0);
        expect(size).toBeLessThan(100);
      });
    });
  });
});
