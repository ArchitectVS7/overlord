/**
 * ScenarioPackScene Tests
 * Story 9-1: Scenario Pack Browsing and Selection
 */

// Mock Phaser before imports
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Scene: class MockScene {
      key: string;
      constructor(config: { key: string }) {
        this.key = config.key;
      }
      add = {
        existing: jest.fn(),
        graphics: jest.fn(() => ({
          fillStyle: jest.fn().mockReturnThis(),
          fillRoundedRect: jest.fn().mockReturnThis(),
          lineStyle: jest.fn().mockReturnThis(),
          strokeRoundedRect: jest.fn().mockReturnThis(),
          clear: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        })),
        text: jest.fn(() => ({
          setOrigin: jest.fn().mockReturnThis(),
          setScrollFactor: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          setText: jest.fn().mockReturnThis(),
          setColor: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        })),
        container: jest.fn(() => ({
          add: jest.fn().mockReturnThis(),
          removeAll: jest.fn().mockReturnThis(),
          setPosition: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          setDepth: jest.fn().mockReturnThis(),
          setScrollFactor: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        })),
        rectangle: jest.fn(() => ({
          setOrigin: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          setScrollFactor: jest.fn().mockReturnThis(),
          setDepth: jest.fn().mockReturnThis(),
          setVisible: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
          destroy: jest.fn()
        }))
      };
      cameras = {
        main: {
          width: 1024,
          height: 768,
          setBackgroundColor: jest.fn()
        }
      };
      scene = {
        start: jest.fn()
      };
    },
    GameObjects: {
      Container: class MockContainer {
        scene: unknown;
        x = 0;
        y = 0;
        visible = true;
        depth = 0;
        list: unknown[] = [];

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        removeAll(): this { this.list = []; return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setScrollFactor(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

// Mock the UI components
jest.mock('../../src/scenes/ui/PackListPanel', () => ({
  PackListPanel: jest.fn().mockImplementation(() => ({
    setPacks: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    destroy: jest.fn(),
    onPackSelected: null,
    onClose: null
  }))
}));

jest.mock('../../src/scenes/ui/PackDetailPanel', () => ({
  PackDetailPanel: jest.fn().mockImplementation(() => ({
    setPack: jest.fn(),
    setLocked: jest.fn(),
    setActive: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    destroy: jest.fn(),
    onSelectPack: null,
    onBack: null
  }))
}));

import { ScenarioPackScene } from '../../src/scenes/ScenarioPackScene';
import { ScenarioPackManager, resetPackManager } from '../../src/core/ScenarioPackManager';
import { ScenarioPack } from '../../src/core/models/ScenarioPackModels';
import { AIPersonality, AIDifficulty, PlanetType } from '../../src/core/models/Enums';

// Mock localStorage
const mockStorage: Record<string, string> = {};
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => mockStorage[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
    clear: jest.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); })
  }
});

describe('ScenarioPackScene', () => {
  let scene: ScenarioPackScene;

  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    jest.clearAllMocks();
    resetPackManager();

    scene = new ScenarioPackScene();
  });

  afterEach(() => {
    resetPackManager();
  });

  test('should have correct scene key', () => {
    expect((scene as any).key).toBe('ScenarioPackScene');
  });

  test('should create scene without errors', () => {
    expect(scene).toBeDefined();
  });

  test('should have create method', () => {
    expect(typeof scene.create).toBe('function');
  });

  test('should initialize pack manager on create', () => {
    scene.create();
    const manager = (scene as any).packManager;
    expect(manager).toBeDefined();
  });

  test('should register default pack on create', () => {
    scene.create();
    const manager = (scene as any).packManager as ScenarioPackManager;
    const defaultPack = manager.getDefaultPack();
    expect(defaultPack).toBeDefined();
    expect(defaultPack?.isDefault).toBe(true);
  });

  test('should get pack manager', () => {
    scene.create();
    const manager = scene.getPackManager();
    expect(manager).toBeDefined();
  });

  test('should get active pack', () => {
    scene.create();
    const activePack = scene.getActivePack();
    expect(activePack).toBeDefined();
    expect(activePack?.id).toBe('default');
  });

  test('should select pack', () => {
    scene.create();
    const result = scene.selectPack('default');
    expect(result).toBe(true);
  });

  test('should not select non-existent pack', () => {
    scene.create();
    const result = scene.selectPack('nonexistent');
    expect(result).toBe(false);
  });

  test('should reset to default pack', () => {
    scene.create();
    scene.resetToDefaultPack();
    const activePack = scene.getActivePack();
    expect(activePack?.id).toBe('default');
  });
});
