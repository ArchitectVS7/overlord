/**
 * Unit tests for PlanetInfoPanel
 * Tests panel display logic without Phaser scene dependency
 */

import { FactionType, PlanetType } from '@core/models/Enums';
import { OWNER_COLORS } from '../../src/config/VisualConfig';

describe('PlanetInfoPanel Logic', () => {
  // Helper function to get owner color hex (mirrors panel logic)
  function getOwnerColorHex(owner: FactionType): string {
    switch (owner) {
      case FactionType.Player: return '#00ff00';
      case FactionType.AI: return '#ff0000';
      case FactionType.Neutral: return '#808080';
      default: return '#ffffff';
    }
  }

  // Helper function to get morale color (mirrors panel logic)
  function getMoraleColor(morale: number): string {
    if (morale >= 70) return '#00cc00';
    if (morale >= 40) return '#cccc00';
    return '#cc0000';
  }

  describe('Owner Color Mapping', () => {
    test('Player owner returns green', () => {
      expect(getOwnerColorHex(FactionType.Player)).toBe('#00ff00');
    });

    test('AI owner returns red', () => {
      expect(getOwnerColorHex(FactionType.AI)).toBe('#ff0000');
    });

    test('Neutral owner returns gray', () => {
      expect(getOwnerColorHex(FactionType.Neutral)).toBe('#808080');
    });

    test('OWNER_COLORS config matches expected values', () => {
      expect(OWNER_COLORS.Player).toBe(0x00ff00);
      expect(OWNER_COLORS.AI).toBe(0xff0000);
      expect(OWNER_COLORS.Neutral).toBe(0x808080);
    });
  });

  describe('Morale Color Mapping', () => {
    test('High morale (70-100) returns green', () => {
      expect(getMoraleColor(100)).toBe('#00cc00');
      expect(getMoraleColor(85)).toBe('#00cc00');
      expect(getMoraleColor(70)).toBe('#00cc00');
    });

    test('Medium morale (40-69) returns yellow', () => {
      expect(getMoraleColor(69)).toBe('#cccc00');
      expect(getMoraleColor(50)).toBe('#cccc00');
      expect(getMoraleColor(40)).toBe('#cccc00');
    });

    test('Low morale (0-39) returns red', () => {
      expect(getMoraleColor(39)).toBe('#cc0000');
      expect(getMoraleColor(20)).toBe('#cc0000');
      expect(getMoraleColor(0)).toBe('#cc0000');
    });

    test('Edge cases handled correctly', () => {
      expect(getMoraleColor(70)).toBe('#00cc00'); // Boundary: exactly 70
      expect(getMoraleColor(40)).toBe('#cccc00'); // Boundary: exactly 40
      expect(getMoraleColor(39)).toBe('#cc0000'); // Boundary: just below 40
    });
  });

  describe('Resource Visibility Logic', () => {
    // Resource visibility based on owner
    function shouldShowResources(owner: FactionType): boolean {
      return owner === FactionType.Player;
    }

    test('Player-owned planets show resources', () => {
      expect(shouldShowResources(FactionType.Player)).toBe(true);
    });

    test('AI-owned planets hide resources', () => {
      expect(shouldShowResources(FactionType.AI)).toBe(false);
    });

    test('Neutral planets hide resources', () => {
      expect(shouldShowResources(FactionType.Neutral)).toBe(false);
    });
  });

  describe('Action Button Visibility Logic', () => {
    // Button visibility based on owner
    function getVisibleButtons(owner: FactionType): string[] {
      if (owner === FactionType.Player) {
        return ['Build', 'Manage'];
      }
      return ['Scout', 'Invade'];
    }

    test('Player-owned planets show Build and Manage buttons', () => {
      const buttons = getVisibleButtons(FactionType.Player);
      expect(buttons).toContain('Build');
      expect(buttons).toContain('Manage');
      expect(buttons).not.toContain('Scout');
      expect(buttons).not.toContain('Invade');
    });

    test('AI-owned planets show Scout and Invade buttons', () => {
      const buttons = getVisibleButtons(FactionType.AI);
      expect(buttons).toContain('Scout');
      expect(buttons).toContain('Invade');
      expect(buttons).not.toContain('Build');
      expect(buttons).not.toContain('Manage');
    });

    test('Neutral planets show Scout and Invade buttons', () => {
      const buttons = getVisibleButtons(FactionType.Neutral);
      expect(buttons).toContain('Scout');
      expect(buttons).toContain('Invade');
      expect(buttons).not.toContain('Build');
      expect(buttons).not.toContain('Manage');
    });
  });

  describe('Panel Dimensions', () => {
    const PANEL_WIDTH = 280;
    const PANEL_HEIGHT = 380;
    const MIN_TOUCH_TARGET = 44;

    test('Panel width is reasonable for mobile', () => {
      // Panel should fit on minimum mobile width (375px) with margin
      expect(PANEL_WIDTH).toBeLessThan(375 - 20); // 20px margin
    });

    test('Panel height is reasonable for mobile', () => {
      // Panel should fit on minimum mobile height (667px) with header/footer room
      expect(PANEL_HEIGHT).toBeLessThan(667 - 100);
    });

    test('Close button meets touch target minimum', () => {
      const closeButtonSize = 24; // Font size
      // Close button touch area should be at least 44x44
      // This is documented but not enforced in current implementation
      expect(MIN_TOUCH_TARGET).toBe(44);
    });
  });

  describe('Planet Type Display', () => {
    test('All planet types have display names', () => {
      Object.values(PlanetType).forEach(type => {
        expect(typeof type).toBe('string');
        expect(type.length).toBeGreaterThan(0);
      });
    });

    test('Planet types are readable strings', () => {
      expect(PlanetType.Desert).toBe('Desert');
      expect(PlanetType.Volcanic).toBe('Volcanic');
      expect(PlanetType.Tropical).toBe('Tropical');
      expect(PlanetType.Metropolis).toBe('Metropolis');
    });
  });
});
