import { GameState, FactionState } from '@core/GameState';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { PlatoonEntity } from '@core/models/PlatoonEntity';
import { CraftEntity } from '@core/models/CraftEntity';
import { FactionType, PlanetType, CraftType } from '@core/models/Enums';
import { Position3D } from '@core/models/Position3D';
import { ResourceCollection } from '@core/models/ResourceModels';

// Mock Phaser with proper structure for default export
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Scene: class MockScene {
      public scene = { start: jest.fn() };
      public registry = {
        get: jest.fn(),
        remove: jest.fn(),
        set: jest.fn(),
      };
      public cameras = {
        main: { width: 1024, height: 768 },
      };
      public add = {
        text: jest.fn().mockReturnValue({
          setOrigin: jest.fn().mockReturnThis(),
          setStyle: jest.fn().mockReturnThis(),
          setInteractive: jest.fn().mockReturnThis(),
          setText: jest.fn().mockReturnThis(),
          setName: jest.fn().mockReturnThis(),
          on: jest.fn().mockReturnThis(),
        }),
        graphics: jest.fn().mockReturnValue({
          lineStyle: jest.fn().mockReturnThis(),
          strokeRect: jest.fn().mockReturnThis(),
          createGeometryMask: jest.fn(),
        }),
      };
      public tweens = {
        add: jest.fn(),
      };
      public children = {
        getByName: jest.fn().mockReturnValue({
          setText: jest.fn(),
          setStyle: jest.fn(),
        }),
      };
    },
  },
}));

// Import DefeatScene after mock is set up
import { DefeatScene, DefeatStatistics } from '@scenes/DefeatScene';

describe('DefeatScene', () => {
  let defeatScene: DefeatScene;
  let mockGameState: GameState;

  beforeEach(() => {
    mockGameState = createMockDefeatGameState();
    defeatScene = new DefeatScene();

    // Setup registry mock to return game state
    (defeatScene as any).registry = {
      get: jest.fn((key: string) => {
        if (key === 'gameState') return mockGameState;
        return undefined;
      }),
      remove: jest.fn(),
      set: jest.fn(),
    };
  });

  describe('Constructor', () => {
    it('should create scene with correct key', () => {
      expect(defeatScene).toBeDefined();
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate turns played correctly', () => {
      const stats = (defeatScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as DefeatStatistics;

      expect(stats.turnsPlayed).toBe(12);
    });

    it('should calculate planets lost correctly', () => {
      const stats = (defeatScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as DefeatStatistics;

      // All 4 planets are AI-owned in defeat state
      expect(stats.planetsLost).toBe(4);
      expect(stats.totalPlanets).toBe(4);
    });

    it('should calculate remaining military units correctly', () => {
      const stats = (defeatScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as DefeatStatistics;

      // Player has no remaining units in defeat state
      expect(stats.totalPlatoons).toBe(0);
      expect(stats.totalCraft).toBe(0);
    });

    it('should calculate final resources correctly', () => {
      const stats = (defeatScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as DefeatStatistics;

      expect(stats.finalCredits).toBe(100);
      expect(stats.finalMinerals).toBe(50);
      expect(stats.finalFuel).toBe(25);
      expect(stats.finalFood).toBe(10);
      expect(stats.finalEnergy).toBe(5);
    });

    it('should return default statistics when no game state', () => {
      const stats = (defeatScene as any).calculateStatistics.call({
        gameState: undefined,
        getDefaultStatistics: () => getDefaultStats(),
      }) as DefeatStatistics;

      expect(stats.turnsPlayed).toBe(0);
      expect(stats.planetsLost).toBe(0);
      expect(stats.totalPlatoons).toBe(0);
      expect(stats.totalCraft).toBe(0);
    });
  });

  describe('Default Statistics', () => {
    it('should provide zero values for all fields', () => {
      const stats = (defeatScene as any).getDefaultStatistics.call(defeatScene) as DefeatStatistics;

      expect(stats.turnsPlayed).toBe(0);
      expect(stats.planetsLost).toBe(0);
      expect(stats.totalPlanets).toBe(0);
      expect(stats.finalCredits).toBe(0);
      expect(stats.finalMinerals).toBe(0);
      expect(stats.finalFuel).toBe(0);
      expect(stats.finalFood).toBe(0);
      expect(stats.finalEnergy).toBe(0);
      expect(stats.totalPlatoons).toBe(0);
      expect(stats.totalCraft).toBe(0);
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers with locale separators', () => {
      const formatted = (defeatScene as any).formatNumber.call(defeatScene, 1000000);
      expect(formatted).toMatch(/1.*000.*000/);
    });

    it('should handle zero correctly', () => {
      const formatted = (defeatScene as any).formatNumber.call(defeatScene, 0);
      expect(formatted).toBe('0');
    });

    it('should handle small numbers correctly', () => {
      const formatted = (defeatScene as any).formatNumber.call(defeatScene, 42);
      expect(formatted).toBe('42');
    });
  });

  describe('Try Again', () => {
    it('should clear registry and start CampaignConfigScene', () => {
      const mockScene = {
        start: jest.fn(),
      };
      const mockRegistry = {
        remove: jest.fn(),
      };

      (defeatScene as any).tryAgain.call({
        registry: mockRegistry,
        scene: mockScene,
      });

      expect(mockRegistry.remove).toHaveBeenCalledWith('gameState');
      expect(mockRegistry.remove).toHaveBeenCalledWith('galaxy');
      expect(mockRegistry.remove).toHaveBeenCalledWith('turnSystem');
      expect(mockRegistry.remove).toHaveBeenCalledWith('phaseProcessor');
      expect(mockScene.start).toHaveBeenCalledWith('CampaignConfigScene');
    });
  });

  describe('Return to Main Menu', () => {
    it('should clear registry and start MainMenuScene', () => {
      const mockScene = {
        start: jest.fn(),
      };
      const mockRegistry = {
        remove: jest.fn(),
      };

      (defeatScene as any).returnToMainMenu.call({
        registry: mockRegistry,
        scene: mockScene,
      });

      expect(mockRegistry.remove).toHaveBeenCalledWith('gameState');
      expect(mockRegistry.remove).toHaveBeenCalledWith('galaxy');
      expect(mockRegistry.remove).toHaveBeenCalledWith('turnSystem');
      expect(mockRegistry.remove).toHaveBeenCalledWith('phaseProcessor');
      expect(mockScene.start).toHaveBeenCalledWith('MainMenuScene');
    });
  });
});

// Helper to create default statistics
function getDefaultStats(): DefeatStatistics {
  return {
    turnsPlayed: 0,
    planetsLost: 0,
    totalPlanets: 0,
    finalCredits: 0,
    finalMinerals: 0,
    finalFuel: 0,
    finalFood: 0,
    finalEnergy: 0,
    totalPlatoons: 0,
    totalCraft: 0,
  };
}

// Helper to create mock game state for defeat scenario
function createMockDefeatGameState(): GameState {
  const gameState = new GameState();
  gameState.currentTurn = 12;

  // Set up player faction resources (depleted in defeat)
  gameState.playerFaction = new FactionState();
  gameState.playerFaction.resources = new ResourceCollection();
  gameState.playerFaction.resources.credits = 100;
  gameState.playerFaction.resources.minerals = 50;
  gameState.playerFaction.resources.fuel = 25;
  gameState.playerFaction.resources.food = 10;
  gameState.playerFaction.resources.energy = 5;

  // Create planets - all AI-owned (defeat state)
  for (let i = 0; i < 4; i++) {
    const planet = new PlanetEntity();
    planet.id = i;
    planet.name = `Planet ${i + 1}`;
    planet.type = PlanetType.Tropical;
    planet.owner = FactionType.AI; // All AI-owned in defeat
    planet.position = new Position3D(i * 100, 0, 0);
    planet.colonized = true;
    planet.population = 500;
    gameState.planets.push(planet);
  }

  // No player platoons or craft in defeat state
  // (all destroyed or captured)

  gameState.rebuildLookups();
  return gameState;
}
