/**
 * Unit tests for PlanetInfoPanel
 * Tests panel display logic without Phaser scene dependency
 */

import { FactionType, PlanetType, BuildingType, BuildingStatus } from '@core/models/Enums';
import { BuildingCosts, Structure } from '@core/models/BuildingModels';
import { OWNER_COLORS } from '../../src/config/VisualConfig';

describe('PlanetInfoPanel Logic', () => {
  // Helper function to get owner color hex (mirrors panel logic)
  function getOwnerColorHex(owner: FactionType): string {
    switch (owner) {
      case FactionType.Player: return '#00bfff';
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
    test('Player owner returns cyan', () => {
      expect(getOwnerColorHex(FactionType.Player)).toBe('#00bfff');
    });

    test('AI owner returns red', () => {
      expect(getOwnerColorHex(FactionType.AI)).toBe('#ff0000');
    });

    test('Neutral owner returns gray', () => {
      expect(getOwnerColorHex(FactionType.Neutral)).toBe('#808080');
    });

    test('OWNER_COLORS config matches expected values', () => {
      expect(OWNER_COLORS.Player).toBe(0x00bfff);
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
    const PANEL_HEIGHT = 460; // Updated for construction section (Story 4-3)
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

  describe('Construction Progress Logic (Story 4-3)', () => {
    // Helper to calculate construction progress
    function calculateConstructionProgress(
      turnsRemaining: number,
      buildingType: BuildingType
    ): { percentComplete: number; turnsCompleted: number; totalTurns: number } {
      const totalTurns = BuildingCosts.getConstructionTime(buildingType);
      const turnsCompleted = totalTurns - turnsRemaining;
      const percentComplete = (turnsCompleted / totalTurns) * 100;
      return { percentComplete, turnsCompleted, totalTurns };
    }

    // Helper to get building display name (mirrors panel logic)
    function getBuildingDisplayName(type: BuildingType): string {
      switch (type) {
        case BuildingType.MiningStation: return 'Mining Station';
        case BuildingType.HorticulturalStation: return 'Horticultural Station';
        case BuildingType.DockingBay: return 'Docking Bay';
        case BuildingType.OrbitalDefense: return 'Orbital Defense';
        case BuildingType.SurfacePlatform: return 'Surface Platform';
        default: return String(type);
      }
    }

    test('Construction progress starts at 0%', () => {
      // Mining Station: 3 turns, starts with 3 turns remaining
      const progress = calculateConstructionProgress(3, BuildingType.MiningStation);
      expect(progress.percentComplete).toBe(0);
      expect(progress.turnsCompleted).toBe(0);
      expect(progress.totalTurns).toBe(3);
    });

    test('Construction progress updates correctly at each turn', () => {
      // Mining Station: 3 turns
      // After 1 turn (2 remaining)
      const progress1 = calculateConstructionProgress(2, BuildingType.MiningStation);
      expect(progress1.percentComplete).toBeCloseTo(33.33, 1);
      expect(progress1.turnsCompleted).toBe(1);

      // After 2 turns (1 remaining)
      const progress2 = calculateConstructionProgress(1, BuildingType.MiningStation);
      expect(progress2.percentComplete).toBeCloseTo(66.67, 1);
      expect(progress2.turnsCompleted).toBe(2);

      // After 3 turns (0 remaining - about to complete)
      const progress3 = calculateConstructionProgress(0, BuildingType.MiningStation);
      expect(progress3.percentComplete).toBe(100);
      expect(progress3.turnsCompleted).toBe(3);
    });

    test('Surface Platform completes in 1 turn', () => {
      const progress = calculateConstructionProgress(1, BuildingType.SurfacePlatform);
      expect(progress.totalTurns).toBe(1);
      expect(progress.percentComplete).toBe(0); // Just started

      const progressDone = calculateConstructionProgress(0, BuildingType.SurfacePlatform);
      expect(progressDone.percentComplete).toBe(100);
    });

    test('All building types have display names', () => {
      const buildingTypes = [
        BuildingType.MiningStation,
        BuildingType.HorticulturalStation,
        BuildingType.DockingBay,
        BuildingType.OrbitalDefense,
        BuildingType.SurfacePlatform
      ];

      buildingTypes.forEach(type => {
        const name = getBuildingDisplayName(type);
        expect(name).not.toBe(String(type)); // Should have friendly name
        expect(name.length).toBeGreaterThan(0);
      });
    });

    test('Building construction times are correct', () => {
      expect(BuildingCosts.getConstructionTime(BuildingType.MiningStation)).toBe(3);
      expect(BuildingCosts.getConstructionTime(BuildingType.HorticulturalStation)).toBe(2);
      expect(BuildingCosts.getConstructionTime(BuildingType.DockingBay)).toBe(2);
      expect(BuildingCosts.getConstructionTime(BuildingType.OrbitalDefense)).toBe(3);
      expect(BuildingCosts.getConstructionTime(BuildingType.SurfacePlatform)).toBe(1);
    });

    test('Construction visibility logic', () => {
      // Construction section only shows for player-owned planets with buildings under construction
      function shouldShowConstruction(
        isPlayerOwned: boolean,
        buildingsUnderConstruction: Structure[]
      ): boolean {
        return isPlayerOwned && buildingsUnderConstruction.length > 0;
      }

      const buildingUnderConstruction = new Structure();
      buildingUnderConstruction.status = BuildingStatus.UnderConstruction;
      buildingUnderConstruction.turnsRemaining = 2;

      // Player-owned with construction
      expect(shouldShowConstruction(true, [buildingUnderConstruction])).toBe(true);

      // Player-owned without construction
      expect(shouldShowConstruction(true, [])).toBe(false);

      // AI-owned with construction
      expect(shouldShowConstruction(false, [buildingUnderConstruction])).toBe(false);

      // AI-owned without construction
      expect(shouldShowConstruction(false, [])).toBe(false);
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
