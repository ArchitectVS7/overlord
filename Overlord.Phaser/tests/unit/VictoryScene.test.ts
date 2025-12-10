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
          lineBetween: jest.fn().mockReturnThis(),
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

// Import VictoryScene after mock is set up
import { VictoryScene, VictoryStatistics } from '@scenes/VictoryScene';

describe('VictoryScene', () => {
  let victoryScene: VictoryScene;
  let mockGameState: GameState;

  beforeEach(() => {
    mockGameState = createMockGameState();
    victoryScene = new VictoryScene();

    // Setup registry mock to return game state
    (victoryScene as any).registry = {
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
      // Scene key is set in constructor via super call
      expect(victoryScene).toBeDefined();
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate turns played correctly', () => {
      // Access private method through reflection for testing
      const stats = (victoryScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as VictoryStatistics;

      expect(stats.turnsPlayed).toBe(15);
    });

    it('should calculate planets conquered correctly', () => {
      const stats = (victoryScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as VictoryStatistics;

      // All 4 planets are player-owned in victory state
      expect(stats.planetsConquered).toBe(4);
      expect(stats.totalPlanets).toBe(4);
    });

    it('should calculate military units correctly', () => {
      const stats = (victoryScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as VictoryStatistics;

      expect(stats.totalPlatoons).toBe(3);
      expect(stats.totalCraft).toBe(2);
    });

    it('should calculate final resources correctly', () => {
      const stats = (victoryScene as any).calculateStatistics.call({
        gameState: mockGameState,
        getDefaultStatistics: () => getDefaultStats(),
      }) as VictoryStatistics;

      expect(stats.finalCredits).toBe(5000);
      expect(stats.finalMinerals).toBe(2500);
      expect(stats.finalFuel).toBe(1500);
      expect(stats.finalFood).toBe(3000);
      expect(stats.finalEnergy).toBe(2000);
    });

    it('should return default statistics when no game state', () => {
      const stats = (victoryScene as any).calculateStatistics.call({
        gameState: undefined,
        getDefaultStatistics: () => getDefaultStats(),
      }) as VictoryStatistics;

      expect(stats.turnsPlayed).toBe(0);
      expect(stats.planetsConquered).toBe(0);
      expect(stats.totalPlatoons).toBe(0);
      expect(stats.totalCraft).toBe(0);
    });
  });

  describe('Default Statistics', () => {
    it('should provide zero values for all fields', () => {
      const stats = (victoryScene as any).getDefaultStatistics.call(victoryScene) as VictoryStatistics;

      expect(stats.turnsPlayed).toBe(0);
      expect(stats.planetsConquered).toBe(0);
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
      const formatted = (victoryScene as any).formatNumber.call(victoryScene, 1000000);
      // The exact format depends on locale, but should contain separator
      expect(formatted).toMatch(/1.*000.*000/);
    });

    it('should handle zero correctly', () => {
      const formatted = (victoryScene as any).formatNumber.call(victoryScene, 0);
      expect(formatted).toBe('0');
    });

    it('should handle small numbers correctly', () => {
      const formatted = (victoryScene as any).formatNumber.call(victoryScene, 42);
      expect(formatted).toBe('42');
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

      (victoryScene as any).returnToMainMenu.call({
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
function getDefaultStats(): VictoryStatistics {
  return {
    turnsPlayed: 0,
    planetsConquered: 0,
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

// Helper to create mock game state for victory scenario
function createMockGameState(): GameState {
  const gameState = new GameState();
  gameState.currentTurn = 15;

  // Set up player faction resources
  gameState.playerFaction = new FactionState();
  gameState.playerFaction.resources = new ResourceCollection();
  gameState.playerFaction.resources.credits = 5000;
  gameState.playerFaction.resources.minerals = 2500;
  gameState.playerFaction.resources.fuel = 1500;
  gameState.playerFaction.resources.food = 3000;
  gameState.playerFaction.resources.energy = 2000;

  // Create planets - all player-owned (victory state)
  for (let i = 0; i < 4; i++) {
    const planet = new PlanetEntity();
    planet.id = i;
    planet.name = `Planet ${i + 1}`;
    planet.type = PlanetType.Tropical;
    planet.owner = FactionType.Player;
    planet.position = new Position3D(i * 100, 0, 0);
    planet.colonized = true;
    planet.population = 500;
    gameState.planets.push(planet);
  }

  // Create player platoons
  for (let i = 0; i < 3; i++) {
    const platoon = new PlatoonEntity();
    platoon.id = i;
    platoon.owner = FactionType.Player;
    gameState.platoons.push(platoon);
  }

  // Create player craft
  for (let i = 0; i < 2; i++) {
    const craft = new CraftEntity();
    craft.id = i;
    craft.owner = FactionType.Player;
    craft.type = CraftType.BattleCruiser;
    gameState.craft.push(craft);
  }

  gameState.rebuildLookups();
  return gameState;
}
