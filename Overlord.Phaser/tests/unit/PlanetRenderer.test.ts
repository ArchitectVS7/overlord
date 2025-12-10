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
    function getHitAreaSize(planetType: PlanetType): number {
      const typeKey = PLANET_TYPE_MAP[planetType] || 'Terran';
      const visualConfig = PLANET_VISUALS[typeKey] || PLANET_VISUALS.Terran;
      return visualConfig.size + 10; // 10px padding for easier clicking
    }

    test('Desert planet hit area includes padding', () => {
      const size = getHitAreaSize(PlanetType.Desert);
      expect(size).toBe(PLANET_VISUALS.Desert.size + 10);
      expect(size).toBe(40); // 30 + 10
    });

    test('Volcanic planet hit area includes padding', () => {
      const size = getHitAreaSize(PlanetType.Volcanic);
      expect(size).toBe(PLANET_VISUALS.Volcanic.size + 10);
      expect(size).toBe(44); // 34 + 10
    });

    test('Tropical planet hit area uses Terran config', () => {
      const size = getHitAreaSize(PlanetType.Tropical);
      expect(size).toBe(PLANET_VISUALS.Terran.size + 10);
      expect(size).toBe(42); // 32 + 10
    });

    test('Metropolis planet hit area uses GasGiant config (largest)', () => {
      const size = getHitAreaSize(PlanetType.Metropolis);
      expect(size).toBe(PLANET_VISUALS.GasGiant.size + 10);
      expect(size).toBe(58); // 48 + 10
    });

    test('all hit areas are positive and reasonable', () => {
      Object.values(PlanetType).forEach(planetType => {
        const size = getHitAreaSize(planetType);
        expect(size).toBeGreaterThan(0);
        expect(size).toBeLessThan(100); // Reasonable upper bound
      });
    });
  });
});
