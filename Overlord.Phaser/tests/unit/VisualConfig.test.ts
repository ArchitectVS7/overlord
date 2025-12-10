/**
 * Unit tests for VisualConfig
 */

import { PLANET_VISUALS, OWNER_COLORS, VISUAL_CONSTANTS } from '../../src/config/VisualConfig';

describe('VisualConfig', () => {
  describe('PLANET_VISUALS', () => {
    test('should contain all visual planet types', () => {
      // Visual types mapped from Core PlanetType enum:
      // Tropical → Terran, Desert → Desert, Volcanic → Volcanic, Metropolis → GasGiant
      expect(PLANET_VISUALS).toHaveProperty('Terran');
      expect(PLANET_VISUALS).toHaveProperty('Desert');
      expect(PLANET_VISUALS).toHaveProperty('Volcanic');
      expect(PLANET_VISUALS).toHaveProperty('GasGiant');
    });

    test('should have valid color values (0 to 0xffffff)', () => {
      Object.values(PLANET_VISUALS).forEach(config => {
        expect(config.color).toBeGreaterThanOrEqual(0);
        expect(config.color).toBeLessThanOrEqual(0xffffff);
      });
    });

    test('should have valid size values (positive)', () => {
      Object.values(PLANET_VISUALS).forEach(config => {
        expect(config.size).toBeGreaterThan(0);
        expect(config.size).toBeLessThan(100);
      });
    });

    test('Terran planet should have green color', () => {
      expect(PLANET_VISUALS.Terran.color).toBe(0x22aa22);
      expect(PLANET_VISUALS.Terran.size).toBe(32);
    });

    test('GasGiant should be the largest planet', () => {
      const gasGiantSize = PLANET_VISUALS.GasGiant.size;
      Object.entries(PLANET_VISUALS).forEach(([type, config]) => {
        if (type !== 'GasGiant') {
          expect(config.size).toBeLessThanOrEqual(gasGiantSize);
        }
      });
    });
  });

  describe('OWNER_COLORS', () => {
    test('should contain all owner types', () => {
      expect(OWNER_COLORS).toHaveProperty('Player');
      expect(OWNER_COLORS).toHaveProperty('AI');
      expect(OWNER_COLORS).toHaveProperty('Neutral');
    });

    test('should have valid color values', () => {
      Object.values(OWNER_COLORS).forEach(color => {
        expect(color).toBeGreaterThanOrEqual(0);
        expect(color).toBeLessThanOrEqual(0xffffff);
      });
    });

    test('Player should be green', () => {
      expect(OWNER_COLORS.Player).toBe(0x00ff00);
    });

    test('AI should be red', () => {
      expect(OWNER_COLORS.AI).toBe(0xff0000);
    });

    test('Neutral should be gray', () => {
      expect(OWNER_COLORS.Neutral).toBe(0x808080);
    });
  });

  describe('VISUAL_CONSTANTS', () => {
    test('should have all required constants', () => {
      expect(VISUAL_CONSTANTS).toHaveProperty('OWNER_RING_WIDTH');
      expect(VISUAL_CONSTANTS).toHaveProperty('HIGHLIGHT_OFFSET');
      expect(VISUAL_CONSTANTS).toHaveProperty('HIGHLIGHT_SIZE_MULTIPLIER');
      expect(VISUAL_CONSTANTS).toHaveProperty('HIGHLIGHT_ALPHA');
      expect(VISUAL_CONSTANTS).toHaveProperty('TEXT_OFFSET_Y');
      expect(VISUAL_CONSTANTS).toHaveProperty('TEXT_FONT_SIZE');
      expect(VISUAL_CONSTANTS).toHaveProperty('TEXT_STROKE_WIDTH');
    });

    test('OWNER_RING_WIDTH should be 3', () => {
      expect(VISUAL_CONSTANTS.OWNER_RING_WIDTH).toBe(3);
    });

    test('HIGHLIGHT_ALPHA should be between 0 and 1', () => {
      expect(VISUAL_CONSTANTS.HIGHLIGHT_ALPHA).toBeGreaterThan(0);
      expect(VISUAL_CONSTANTS.HIGHLIGHT_ALPHA).toBeLessThanOrEqual(1);
    });

    test('HIGHLIGHT_SIZE_MULTIPLIER should be between 0 and 1', () => {
      expect(VISUAL_CONSTANTS.HIGHLIGHT_SIZE_MULTIPLIER).toBeGreaterThan(0);
      expect(VISUAL_CONSTANTS.HIGHLIGHT_SIZE_MULTIPLIER).toBeLessThanOrEqual(1);
    });
  });
});
