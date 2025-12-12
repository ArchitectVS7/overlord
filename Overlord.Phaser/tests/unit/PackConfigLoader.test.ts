/**
 * PackConfigLoader Tests
 * Story 9-2: Scenario Pack Switching and Configuration Loading
 */

import { PackConfigLoader, PackConfigResult } from '../../src/core/PackConfigLoader';
import { ScenarioPack } from '../../src/core/models/ScenarioPackModels';
import { AIPersonality, AIDifficulty, PlanetType, Difficulty } from '../../src/core/models/Enums';

describe('PackConfigLoader', () => {
  let loader: PackConfigLoader;
  let mockPack: ScenarioPack;

  beforeEach(() => {
    loader = new PackConfigLoader();

    mockPack = {
      id: 'test-pack',
      name: 'Test Pack',
      version: '1.0.0',
      description: 'A test pack',
      faction: {
        name: 'Test Faction',
        leader: 'Test Leader',
        lore: 'Test lore',
        colorTheme: 0xff0000
      },
      aiConfig: {
        personality: AIPersonality.Aggressive,
        difficulty: AIDifficulty.Hard,
        modifiers: {
          resourceBonus: 0.2,
          militaryBonus: 0.3
        }
      },
      galaxyTemplate: {
        planetCount: { min: 3, max: 5 },
        planetTypes: [PlanetType.Volcanic, PlanetType.Desert],
        resourceAbundance: 'scarce'
      }
    };
  });

  describe('loadPackConfig', () => {
    test('should load valid pack configuration', () => {
      const result = loader.loadPackConfig(mockPack);

      expect(result.success).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.config?.aiPersonality).toBe(AIPersonality.Aggressive);
    });

    test('should return error for invalid pack', () => {
      const invalidPack = { id: 'invalid' } as ScenarioPack;
      const result = loader.loadPackConfig(invalidPack);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should extract AI personality from pack', () => {
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.aiPersonality).toBe(AIPersonality.Aggressive);
    });

    test('should extract difficulty from pack', () => {
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.difficulty).toBe(Difficulty.Hard);
    });

    test('should extract galaxy template from pack', () => {
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.galaxyTemplate).toBeDefined();
      expect(result.config?.galaxyTemplate?.planetCount.min).toBe(3);
      expect(result.config?.galaxyTemplate?.planetCount.max).toBe(5);
    });

    test('should extract AI modifiers from pack', () => {
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.aiModifiers?.resourceBonus).toBe(0.2);
      expect(result.config?.aiModifiers?.militaryBonus).toBe(0.3);
    });
  });

  describe('convertDifficulty', () => {
    test('should convert AIDifficulty.Easy to Difficulty.Easy', () => {
      mockPack.aiConfig.difficulty = AIDifficulty.Easy;
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.difficulty).toBe(Difficulty.Easy);
    });

    test('should convert AIDifficulty.Normal to Difficulty.Normal', () => {
      mockPack.aiConfig.difficulty = AIDifficulty.Normal;
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.difficulty).toBe(Difficulty.Normal);
    });

    test('should convert AIDifficulty.Hard to Difficulty.Hard', () => {
      mockPack.aiConfig.difficulty = AIDifficulty.Hard;
      const result = loader.loadPackConfig(mockPack);

      expect(result.config?.difficulty).toBe(Difficulty.Hard);
    });
  });

  describe('validatePackConfig', () => {
    test('should validate complete pack configuration', () => {
      expect(loader.validatePackConfig(mockPack)).toBe(true);
    });

    test('should reject pack without aiConfig', () => {
      const invalidPack = { ...mockPack, aiConfig: undefined } as unknown as ScenarioPack;
      expect(loader.validatePackConfig(invalidPack)).toBe(false);
    });

    test('should reject pack without galaxyTemplate', () => {
      const invalidPack = { ...mockPack, galaxyTemplate: undefined } as unknown as ScenarioPack;
      expect(loader.validatePackConfig(invalidPack)).toBe(false);
    });

    test('should reject pack with invalid planet count range', () => {
      const invalidPack = {
        ...mockPack,
        galaxyTemplate: {
          ...mockPack.galaxyTemplate,
          planetCount: { min: 10, max: 2 }
        }
      };
      expect(loader.validatePackConfig(invalidPack)).toBe(false);
    });
  });

  describe('getDefaultConfig', () => {
    test('should return default configuration', () => {
      const defaultConfig = loader.getDefaultConfig();

      expect(defaultConfig.aiPersonality).toBe(AIPersonality.Balanced);
      expect(defaultConfig.difficulty).toBe(Difficulty.Normal);
    });
  });

  describe('applyPackToConfig', () => {
    test('should apply pack settings to campaign config', () => {
      const baseConfig = {
        difficulty: Difficulty.Easy,
        aiPersonality: AIPersonality.Defensive,
        galaxySeed: 12345,
        startingTurn: 1
      };

      const applied = loader.applyPackToConfig(mockPack, baseConfig);

      expect(applied.difficulty).toBe(Difficulty.Hard);
      expect(applied.aiPersonality).toBe(AIPersonality.Aggressive);
      expect(applied.galaxySeed).toBe(12345); // Preserved
      expect(applied.startingTurn).toBe(1); // Preserved
    });
  });
});
