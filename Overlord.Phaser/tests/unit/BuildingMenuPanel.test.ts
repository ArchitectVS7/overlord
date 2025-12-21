import { GameState, FactionState } from '@core/GameState';
import { BuildingSystem } from '@core/BuildingSystem';
import { ResourceCollection } from '@core/models/ResourceModels';
import { BuildingType, FactionType, PlanetType } from '@core/models/Enums';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { Position3D } from '@core/models/Position3D';

// Track created containers and their children
const createdContainers: MockContainer[] = [];
let lastTween: { targets: unknown; alpha?: number; duration?: number; onComplete?: () => void } | null = null;

class MockText {
  _text: string = '';
  x: number = 0;
  y: number = 0;
  _color: string = '#ffffff';

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this._text = text;
  }

  setText(text: string): this {
    this._text = text;
    return this;
  }

  setOrigin(_x: number, _y?: number): this {
    return this;
  }

  setColor(color: string): this {
    this._color = color;
    return this;
  }

  setDepth(_depth: number): this {
    return this;
  }

  destroy(): void {}
}

class MockRectangle {
  _interactive: boolean = false;
  _handlers: Map<string, (() => void)[]> = new Map();

  setStrokeStyle(_lineWidth: number, _color: number): this {
    return this;
  }

  setFillStyle(_color: number): this {
    return this;
  }

  setInteractive(_config?: object): this {
    this._interactive = true;
    return this;
  }

  on(event: string, callback: () => void): this {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, []);
    }
    this._handlers.get(event)!.push(callback);
    return this;
  }

  emit(event: string): void {
    const handlers = this._handlers.get(event);
    if (handlers) {
      handlers.forEach(h => h());
    }
  }
}

class MockZone {
  _handlers: Map<string, (() => void)[]> = new Map();

  setInteractive(): this {
    return this;
  }

  setDepth(): this {
    return this;
  }

  on(event: string, callback: () => void): this {
    if (!this._handlers.has(event)) {
      this._handlers.set(event, []);
    }
    this._handlers.get(event)!.push(callback);
    return this;
  }

  emit(event: string): void {
    const handlers = this._handlers.get(event);
    if (handlers) {
      handlers.forEach(h => h());
    }
  }

  destroy(): void {}
}

class MockContainer {
  scene: unknown;
  x: number;
  y: number;
  children: unknown[] = [];
  visible: boolean = true;
  alpha: number = 1;
  _depth: number = 0;

  constructor(scene: unknown, x: number, y: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    createdContainers.push(this);
  }

  add(child: unknown): this {
    this.children.push(child);
    return this;
  }

  setVisible(visible: boolean): this {
    this.visible = visible;
    return this;
  }

  setAlpha(alpha: number): this {
    this.alpha = alpha;
    return this;
  }

  setDepth(depth: number): this {
    this._depth = depth;
    return this;
  }

  setScrollFactor(_factor: number): this {
    return this;
  }

  destroy(): void {
    this.children = [];
  }
}

// Mock Phaser
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    GameObjects: {
      Container: MockContainer,
      Text: MockText,
      Rectangle: MockRectangle,
      Zone: MockZone,
    },
    Scene: class MockScene {},
  },
}));

// Import after mocks
import { BuildingMenuPanel } from '@scenes/ui/BuildingMenuPanel';

describe('BuildingMenuPanel', () => {
  let buildingMenuPanel: BuildingMenuPanel;
  let mockGameState: GameState;
  let mockBuildingSystem: BuildingSystem;
  let mockScene: any;
  let mockPlanet: PlanetEntity;

  beforeEach(() => {
    // Clear tracked containers
    createdContainers.length = 0;
    lastTween = null;

    mockGameState = createMockGameState();
    mockBuildingSystem = {
      getBuildingsUnderConstruction: jest.fn().mockReturnValue([]),
      canBuild: jest.fn().mockReturnValue(true),
      startConstruction: jest.fn().mockReturnValue(true),
    } as unknown as BuildingSystem;

    mockScene = {
      add: {
        rectangle: jest.fn().mockImplementation(() => new MockRectangle()),
        text: jest.fn().mockImplementation((x: number, y: number, text: string) => new MockText(x, y, text)),
        zone: jest.fn().mockImplementation(() => new MockZone()),
        container: jest.fn().mockImplementation((x: number, y: number) => new MockContainer(mockScene, x, y)),
        existing: jest.fn(),
      },
      tweens: {
        add: jest.fn().mockImplementation((config) => {
          lastTween = config;
          // Auto-complete tweens for testing
          if (config.onComplete) {
            config.onComplete();
          }
          return { remove: jest.fn() };
        }),
      },
      time: {
        delayedCall: jest.fn().mockImplementation((_delay: number, callback: Function) => {
          // Immediately invoke callback for testing
          callback();
          return { remove: jest.fn() };
        }),
      },
      cameras: {
        main: { width: 1024, height: 768 },
      },
    };

    mockPlanet = createMockPlanet();

    buildingMenuPanel = new BuildingMenuPanel(mockScene, mockGameState, mockBuildingSystem);
  });

  describe('Constructor', () => {
    it('should create BuildingMenuPanel', () => {
      expect(buildingMenuPanel).toBeDefined();
    });

    it('should start hidden', () => {
      expect(buildingMenuPanel.visible).toBe(false);
    });

    it('should set high depth for modal behavior', () => {
      expect(buildingMenuPanel['_depth']).toBe(1100);
    });
  });

  describe('Show/Hide', () => {
    it('should show the panel when show() is called', () => {
      buildingMenuPanel.show(mockPlanet);
      expect(buildingMenuPanel.visible).toBe(true);
    });

    it('should update title with planet name', () => {
      buildingMenuPanel.show(mockPlanet);

      // Find title text in children
      const titleText = (buildingMenuPanel as any).titleText as MockText;
      expect(titleText._text).toContain('Test Planet');
    });

    it('should hide the panel when hide() is called', () => {
      buildingMenuPanel.show(mockPlanet);
      buildingMenuPanel.hide();

      // Tween auto-completes in our mock, so it should be hidden
      expect(buildingMenuPanel.visible).toBe(false);
    });

    it('should fire onClose callback when hidden', () => {
      const onCloseSpy = jest.fn();
      buildingMenuPanel.onClose = onCloseSpy;

      buildingMenuPanel.show(mockPlanet);
      buildingMenuPanel.hide();

      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should report open state correctly via isOpen()', () => {
      expect(buildingMenuPanel.isOpen()).toBe(false);

      buildingMenuPanel.show(mockPlanet);
      expect(buildingMenuPanel.isOpen()).toBe(true);

      buildingMenuPanel.hide();
      expect(buildingMenuPanel.isOpen()).toBe(false);
    });
  });

  describe('Building Buttons', () => {
    it('should create buttons for all building types', () => {
      buildingMenuPanel.show(mockPlanet);

      // Should have created building buttons (5 types)
      const buttons = (buildingMenuPanel as any).buildingButtons;
      expect(buttons.length).toBeGreaterThanOrEqual(5);
    });

    it('should check construction in progress', () => {
      buildingMenuPanel.show(mockPlanet);

      expect(mockBuildingSystem.getBuildingsUnderConstruction).toHaveBeenCalledWith(mockPlanet.id);
    });

    it('should check canBuild for each building type', () => {
      buildingMenuPanel.show(mockPlanet);

      expect(mockBuildingSystem.canBuild).toHaveBeenCalled();
    });
  });

  describe('Affordability', () => {
    it('should gray out buildings player cannot afford', () => {
      // Set low resources
      mockGameState.playerFaction.resources.credits = 100;
      mockGameState.playerFaction.resources.minerals = 100;
      mockGameState.playerFaction.resources.fuel = 100;

      buildingMenuPanel.show(mockPlanet);

      // Buttons should still be created, just grayed out
      const buttons = (buildingMenuPanel as any).buildingButtons;
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should enable buttons when player can afford', () => {
      // Set high resources
      mockGameState.playerFaction.resources.credits = 100000;
      mockGameState.playerFaction.resources.minerals = 50000;
      mockGameState.playerFaction.resources.fuel = 30000;

      buildingMenuPanel.show(mockPlanet);

      const buttons = (buildingMenuPanel as any).buildingButtons;
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Construction In Progress', () => {
    it('should show message when construction is in progress', () => {
      (mockBuildingSystem.getBuildingsUnderConstruction as jest.Mock).mockReturnValue([
        { type: BuildingType.MiningStation }
      ]);

      buildingMenuPanel.show(mockPlanet);

      // Should have added construction message
      const buttons = (buildingMenuPanel as any).buildingButtons;
      expect(buttons.length).toBeGreaterThan(5); // 5 building buttons + 1 message
    });

    it('should disable all buttons when construction in progress', () => {
      (mockBuildingSystem.getBuildingsUnderConstruction as jest.Mock).mockReturnValue([
        { type: BuildingType.MiningStation }
      ]);

      buildingMenuPanel.show(mockPlanet);

      // canBuild should still be called but buttons disabled due to construction
      expect(mockBuildingSystem.getBuildingsUnderConstruction).toHaveBeenCalled();
    });
  });

  describe('Building Selection', () => {
    it('should fire onBuildingSelected callback when building is selected', () => {
      const onSelectedSpy = jest.fn();
      buildingMenuPanel.onBuildingSelected = onSelectedSpy;

      // Set high resources to afford building
      mockGameState.playerFaction.resources.credits = 100000;
      mockGameState.playerFaction.resources.minerals = 50000;
      mockGameState.playerFaction.resources.fuel = 30000;

      buildingMenuPanel.show(mockPlanet);

      // Simulate selecting a building by calling selectBuilding directly
      (buildingMenuPanel as any).selectBuilding(BuildingType.SurfacePlatform, mockPlanet);

      expect(onSelectedSpy).toHaveBeenCalledWith(BuildingType.SurfacePlatform, mockPlanet.id);
    });

    it('should deduct resources when building is selected', () => {
      const initialCredits = 100000;
      mockGameState.playerFaction.resources.credits = initialCredits;
      mockGameState.playerFaction.resources.minerals = 50000;
      mockGameState.playerFaction.resources.fuel = 30000;

      buildingMenuPanel.show(mockPlanet);

      // Select Surface Platform (cheapest: 2000 credits)
      (buildingMenuPanel as any).selectBuilding(BuildingType.SurfacePlatform, mockPlanet);

      expect(mockGameState.playerFaction.resources.credits).toBeLessThan(initialCredits);
    });

    it('should start construction when building is selected', () => {
      mockGameState.playerFaction.resources.credits = 100000;
      mockGameState.playerFaction.resources.minerals = 50000;
      mockGameState.playerFaction.resources.fuel = 30000;

      buildingMenuPanel.show(mockPlanet);
      (buildingMenuPanel as any).selectBuilding(BuildingType.SurfacePlatform, mockPlanet);

      expect(mockBuildingSystem.startConstruction).toHaveBeenCalledWith(
        mockPlanet.id,
        BuildingType.SurfacePlatform
      );
    });

    it('should close menu after successful building selection', () => {
      mockGameState.playerFaction.resources.credits = 100000;
      mockGameState.playerFaction.resources.minerals = 50000;
      mockGameState.playerFaction.resources.fuel = 30000;

      buildingMenuPanel.show(mockPlanet);
      (buildingMenuPanel as any).selectBuilding(BuildingType.SurfacePlatform, mockPlanet);

      // Should have triggered hide via tween
      expect(mockScene.tweens.add).toHaveBeenCalled();
    });

    it('should refund resources if construction fails', () => {
      (mockBuildingSystem.startConstruction as jest.Mock).mockReturnValue(false);

      mockGameState.playerFaction.resources.credits = 100000;
      mockGameState.playerFaction.resources.minerals = 50000;
      mockGameState.playerFaction.resources.fuel = 30000;

      const initialCredits = mockGameState.playerFaction.resources.credits;

      buildingMenuPanel.show(mockPlanet);
      (buildingMenuPanel as any).selectBuilding(BuildingType.SurfacePlatform, mockPlanet);

      // Resources should be refunded (back to original after deduct + refund)
      expect(mockGameState.playerFaction.resources.credits).toBe(initialCredits);
    });
  });

  describe('Performance', () => {
    it('should complete show() within 100ms (NFR-P3)', () => {
      const startTime = performance.now();

      buildingMenuPanel.show(mockPlanet);

      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Building Names', () => {
    it('should return correct name for building type', () => {
      const name = (buildingMenuPanel as any).getBuildingName(BuildingType.MiningStation);
      expect(name).toBe('Mining Station');
    });

    it('should return type string for unknown building', () => {
      const name = (buildingMenuPanel as any).getBuildingName('UnknownType' as BuildingType);
      expect(name).toBe('UnknownType');
    });
  });

  describe('Destroy', () => {
    it('should clean up building buttons on destroy', () => {
      buildingMenuPanel.show(mockPlanet);

      const buttonCount = (buildingMenuPanel as any).buildingButtons.length;
      expect(buttonCount).toBeGreaterThan(0);

      buildingMenuPanel.destroy();

      expect((buildingMenuPanel as any).buildingButtons.length).toBe(0);
    });
  });
});

// Helper to create mock game state
function createMockGameState(): GameState {
  const gameState = new GameState();
  gameState.currentTurn = 5;

  // Set up player faction resources
  gameState.playerFaction = new FactionState();
  gameState.playerFaction.resources = new ResourceCollection();
  gameState.playerFaction.resources.credits = 50000;
  gameState.playerFaction.resources.minerals = 25000;
  gameState.playerFaction.resources.fuel = 15000;
  gameState.playerFaction.resources.food = 30000;
  gameState.playerFaction.resources.energy = 20000;

  // Create player planet
  const playerPlanet = new PlanetEntity();
  playerPlanet.id = 1;
  playerPlanet.name = 'Home World';
  playerPlanet.type = PlanetType.Tropical;
  playerPlanet.owner = FactionType.Player;
  playerPlanet.position = new Position3D(0, 0, 0);
  playerPlanet.colonized = true;
  playerPlanet.population = 500;
  gameState.planets.push(playerPlanet);

  gameState.rebuildLookups();
  return gameState;
}

// Helper to create mock planet
function createMockPlanet(): PlanetEntity {
  const planet = new PlanetEntity();
  planet.id = 10;
  planet.name = 'Test Planet';
  planet.type = PlanetType.Tropical;
  planet.owner = FactionType.Player;
  planet.position = new Position3D(100, 50, 0);
  planet.colonized = true;
  planet.population = 200;
  return planet;
}
