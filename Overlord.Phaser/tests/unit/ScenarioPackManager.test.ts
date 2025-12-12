/**
 * ScenarioPackManager Tests
 * Story 9-1: Scenario Pack Browsing and Selection
 */

import { ScenarioPackManager } from '../../src/core/ScenarioPackManager';
import { ScenarioPack, PackDisplayData } from '../../src/core/models/ScenarioPackModels';
import { AIPersonality, AIDifficulty, PlanetType } from '../../src/core/models/Enums';

// Mock localStorage
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: jest.fn((key: string) => mockStorage[key] || null),
  setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
  removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
  clear: jest.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); })
};

Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

describe('ScenarioPackManager', () => {
  let manager: ScenarioPackManager;
  let defaultPack: ScenarioPack;

  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();

    defaultPack = {
      id: 'default',
      name: 'Standard Campaign',
      version: '1.0.0',
      description: 'The classic Overlord experience',
      faction: {
        name: 'Earth Federation',
        leader: 'Admiral Chen',
        lore: 'The original Earth forces.',
        colorTheme: 0x4488ff
      },
      aiConfig: {
        personality: AIPersonality.Balanced,
        difficulty: AIDifficulty.Normal
      },
      galaxyTemplate: {
        planetCount: { min: 4, max: 6 },
        planetTypes: [PlanetType.Volcanic, PlanetType.Desert, PlanetType.Tropical, PlanetType.Metropolis],
        resourceAbundance: 'standard'
      },
      isDefault: true
    };

    manager = new ScenarioPackManager();
  });

  describe('pack registration', () => {
    test('should register a pack', () => {
      manager.registerPack(defaultPack);
      const packs = manager.getAllPacks();
      expect(packs).toHaveLength(1);
      expect(packs[0].id).toBe('default');
    });

    test('should not register duplicate packs', () => {
      manager.registerPack(defaultPack);
      manager.registerPack(defaultPack);
      expect(manager.getAllPacks()).toHaveLength(1);
    });

    test('should register multiple unique packs', () => {
      manager.registerPack(defaultPack);
      manager.registerPack({
        ...defaultPack,
        id: 'aggressive',
        name: 'Aggressive AI Pack'
      });
      expect(manager.getAllPacks()).toHaveLength(2);
    });
  });

  describe('pack retrieval', () => {
    beforeEach(() => {
      manager.registerPack(defaultPack);
    });

    test('should get pack by ID', () => {
      const pack = manager.getPackById('default');
      expect(pack).toBeDefined();
      expect(pack?.name).toBe('Standard Campaign');
    });

    test('should return undefined for non-existent pack', () => {
      const pack = manager.getPackById('nonexistent');
      expect(pack).toBeUndefined();
    });

    test('should get default pack', () => {
      const pack = manager.getDefaultPack();
      expect(pack).toBeDefined();
      expect(pack?.isDefault).toBe(true);
    });
  });

  describe('active pack management', () => {
    beforeEach(() => {
      manager.registerPack(defaultPack);
      manager.registerPack({
        ...defaultPack,
        id: 'aggressive',
        name: 'Aggressive AI Pack'
      });
    });

    test('should set active pack', () => {
      const result = manager.setActivePack('aggressive');
      expect(result).toBe(true);
      expect(manager.getActivePack()?.id).toBe('aggressive');
    });

    test('should not set non-existent pack as active', () => {
      const result = manager.setActivePack('nonexistent');
      expect(result).toBe(false);
    });

    test('should persist active pack selection', () => {
      manager.setActivePack('aggressive');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'overlord_active_pack',
        'aggressive'
      );
    });

    test('should load active pack from storage', () => {
      mockStorage['overlord_active_pack'] = 'aggressive';
      const manager2 = new ScenarioPackManager();
      manager2.registerPack(defaultPack);
      manager2.registerPack({
        ...defaultPack,
        id: 'aggressive',
        name: 'Aggressive AI Pack'
      });
      manager2.loadActivePackFromStorage();
      expect(manager2.getActivePack()?.id).toBe('aggressive');
    });

    test('should fall back to default pack if stored pack not found', () => {
      mockStorage['overlord_active_pack'] = 'nonexistent';
      manager.loadActivePackFromStorage();
      expect(manager.getActivePack()?.id).toBe('default');
    });

    test('should reset to default pack', () => {
      manager.setActivePack('aggressive');
      manager.resetToDefault();
      expect(manager.getActivePack()?.id).toBe('default');
    });
  });

  describe('pack locking', () => {
    let lockedPack: ScenarioPack;

    beforeEach(() => {
      lockedPack = {
        ...defaultPack,
        id: 'locked-pack',
        name: 'Locked Pack',
        isDefault: false,
        unlockRequirements: [
          {
            type: 'scenario_complete',
            targetId: 'tutorial-001',
            description: 'Complete Tutorial 1'
          }
        ]
      };
      manager.registerPack(defaultPack);
      manager.registerPack(lockedPack);
    });

    test('should check if pack is locked', () => {
      expect(manager.isPackLocked('locked-pack')).toBe(true);
      expect(manager.isPackLocked('default')).toBe(false);
    });

    test('should return unlock requirements', () => {
      const reqs = manager.getUnlockRequirements('locked-pack');
      expect(reqs).toHaveLength(1);
      expect(reqs[0].type).toBe('scenario_complete');
    });

    test('should not set locked pack as active', () => {
      const result = manager.setActivePack('locked-pack');
      expect(result).toBe(false);
    });

    test('should unlock pack when requirements met', () => {
      manager.markRequirementComplete('scenario_complete', 'tutorial-001');
      expect(manager.isPackLocked('locked-pack')).toBe(false);
    });
  });

  describe('pack display data', () => {
    beforeEach(() => {
      manager.registerPack(defaultPack);
    });

    test('should generate display data for all packs', () => {
      manager.setActivePack('default');
      const displayData = manager.getPackDisplayData();
      expect(displayData).toHaveLength(1);
      expect(displayData[0].name).toBe('Standard Campaign');
      expect(displayData[0].isActive).toBe(true);
      expect(displayData[0].isLocked).toBe(false);
    });

    test('should include correct metadata in display data', () => {
      const displayData = manager.getPackDisplayData();
      const data = displayData[0];
      expect(data.factionLeader).toBe('Admiral Chen');
      expect(data.aiPersonality).toBe(AIPersonality.Balanced);
      expect(data.difficulty).toBe('normal');
      expect(data.planetCount).toBe('4-6 planets');
    });
  });

  describe('pack validation', () => {
    test('should validate pack schema', () => {
      const validPack = defaultPack;
      expect(manager.validatePack(validPack)).toBe(true);
    });

    test('should reject pack with missing required fields', () => {
      const invalidPack = {
        id: 'invalid',
        name: 'Invalid Pack'
        // Missing required fields
      } as ScenarioPack;
      expect(manager.validatePack(invalidPack)).toBe(false);
    });

    test('should reject pack with invalid planet count range', () => {
      const invalidPack = {
        ...defaultPack,
        id: 'invalid',
        galaxyTemplate: {
          ...defaultPack.galaxyTemplate,
          planetCount: { min: 10, max: 2 } // min > max
        }
      };
      expect(manager.validatePack(invalidPack)).toBe(false);
    });
  });
});
