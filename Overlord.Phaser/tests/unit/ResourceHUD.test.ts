import { GameState, FactionState } from '@core/GameState';
import { ResourceDelta, ResourceCollection, ResourceLevel } from '@core/models/ResourceModels';
import { FactionType, PlanetType } from '@core/models/Enums';
import { PlanetEntity } from '@core/models/PlanetEntity';
import { Position3D } from '@core/models/Position3D';
import { PhaseProcessor } from '@core/PhaseProcessor';

// Create proper mocks for Phaser
class MockText {
  _name?: string;
  _text: string = '';
  _style: object = {};
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number, text: string) {
    this.x = x;
    this.y = y;
    this._text = text;
  }

  setText(text: string): this {
    this._text = text;
    return this;
  }

  setName(name: string): this {
    this._name = name;
    return this;
  }

  setOrigin(_x: number, _y?: number): this {
    return this;
  }

  setStyle(style: object): this {
    this._style = style;
    return this;
  }

  setInteractive(_config?: object): this {
    return this;
  }

  setDepth(_depth: number): this {
    return this;
  }

  on(_event: string, _callback: () => void): this {
    return this;
  }

  destroy(): void {}
}

class MockRectangle {
  setStrokeStyle(_lineWidth: number, _color: number): this {
    return this;
  }
}

// Track all created text objects by name
const textsByName: Map<string, MockText> = new Map();

// Mock Phaser
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    GameObjects: {
      Container: class MockContainer {
        scene: unknown;
        x: number;
        y: number;
        children: unknown[] = [];

        constructor(scene: unknown, x: number, y: number) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this {
          this.children.push(child);
          return this;
        }

        getByName(name: string): unknown {
          return textsByName.get(name);
        }

        setScrollFactor(_factor: number): this {
          return this;
        }

        setDepth(_depth: number): this {
          return this;
        }

        destroy(): void {}
      },
      Text: MockText,
      Rectangle: MockRectangle,
    },
    Scene: class MockScene {},
  },
}));

// Import after mocks
import { ResourceHUD, ResourceHUDConfig } from '@scenes/ui/ResourceHUD';

// Mock PhaseProcessor
jest.mock('@core/PhaseProcessor');

describe('ResourceHUD', () => {
  let resourceHUD: ResourceHUD;
  let mockGameState: GameState;
  let mockPhaseProcessor: PhaseProcessor;
  let mockScene: any;

  beforeEach(() => {
    // Clear tracked texts
    textsByName.clear();

    mockGameState = createMockGameState();
    mockPhaseProcessor = {
      onIncomeProcessed: undefined,
      getIncomeSystem: jest.fn().mockReturnValue({
        calculateFactionIncome: jest.fn().mockReturnValue(new ResourceDelta()),
      }),
    } as unknown as PhaseProcessor;

    mockScene = {
      add: {
        rectangle: jest.fn().mockReturnValue(new MockRectangle()),
        text: jest.fn().mockImplementation((x: number, y: number, text: string, _style: object) => {
          const mockText = new MockText(x, y, text);
          // Override setName to track by name
          const originalSetName = mockText.setName.bind(mockText);
          mockText.setName = (name: string) => {
            originalSetName(name);
            textsByName.set(name, mockText);
            return mockText;
          };
          return mockText;
        }),
        existing: jest.fn(),
      },
      tweens: {
        add: jest.fn(),
      },
      cameras: {
        main: { width: 1024, height: 768 },
      },
    };

    resourceHUD = new ResourceHUD(mockScene, 800, 100, mockGameState, mockPhaseProcessor);
  });

  describe('Constructor', () => {
    it('should create ResourceHUD with default config', () => {
      expect(resourceHUD).toBeDefined();
    });

    it('should create ResourceHUD with custom config', () => {
      const config: ResourceHUDConfig = {
        animationDurationMs: 2000,
        warningThreshold: 300,
        criticalThreshold: 50,
      };
      const customHUD = new ResourceHUD(mockScene, 800, 100, mockGameState, mockPhaseProcessor, config);
      expect(customHUD).toBeDefined();
    });

    it('should create text elements for all 5 resources', () => {
      // Verify all resource texts were created
      expect(textsByName.has('resource_Credits')).toBe(true);
      expect(textsByName.has('resource_Minerals')).toBe(true);
      expect(textsByName.has('resource_Fuel')).toBe(true);
      expect(textsByName.has('resource_Food')).toBe(true);
      expect(textsByName.has('resource_Energy')).toBe(true);
    });

    it('should create income texts for all 5 resources', () => {
      expect(textsByName.has('income_Credits')).toBe(true);
      expect(textsByName.has('income_Minerals')).toBe(true);
      expect(textsByName.has('income_Fuel')).toBe(true);
      expect(textsByName.has('income_Food')).toBe(true);
      expect(textsByName.has('income_Energy')).toBe(true);
    });
  });

  describe('Number Formatting', () => {
    it('should format numbers with thousand separators', () => {
      const formatted = (resourceHUD as any).formatNumber.call(resourceHUD, 1000000);
      expect(formatted).toMatch(/1.*000.*000/);
    });

    it('should handle zero correctly', () => {
      const formatted = (resourceHUD as any).formatNumber.call(resourceHUD, 0);
      expect(formatted).toBe('0');
    });

    it('should handle negative numbers correctly', () => {
      const formatted = (resourceHUD as any).formatNumber.call(resourceHUD, -500);
      expect(formatted).toMatch(/-500/);
    });
  });

  describe('Resource Level Detection', () => {
    it('should return Normal for high values', () => {
      const level = (resourceHUD as any).getResourceLevel.call(resourceHUD, 1000);
      expect(level).toBe(ResourceLevel.Normal);
    });

    it('should return Warning for mid-range values', () => {
      const level = (resourceHUD as any).getResourceLevel.call(resourceHUD, 300);
      expect(level).toBe(ResourceLevel.Warning);
    });

    it('should return Critical for low values', () => {
      const level = (resourceHUD as any).getResourceLevel.call(resourceHUD, 50);
      expect(level).toBe(ResourceLevel.Critical);
    });

    it('should use custom thresholds from config', () => {
      const config: ResourceHUDConfig = {
        warningThreshold: 1000,
        criticalThreshold: 500,
      };
      const customHUD = new ResourceHUD(mockScene, 800, 100, mockGameState, mockPhaseProcessor, config);

      // 600 is below warning (1000) but above critical (500)
      const level = (customHUD as any).getResourceLevel.call(customHUD, 600);
      expect(level).toBe(ResourceLevel.Warning);
    });
  });

  describe('Level Colors', () => {
    it('should return white for Normal level', () => {
      const color = (resourceHUD as any).getLevelColor.call(resourceHUD, ResourceLevel.Normal);
      expect(color).toBe('#ffffff');
    });

    it('should return orange for Warning level', () => {
      const color = (resourceHUD as any).getLevelColor.call(resourceHUD, ResourceLevel.Warning);
      expect(color).toBe('#ffaa00');
    });

    it('should return red for Critical level', () => {
      const color = (resourceHUD as any).getLevelColor.call(resourceHUD, ResourceLevel.Critical);
      expect(color).toBe('#ff4444');
    });
  });

  describe('Can Afford', () => {
    it('should return true when player has enough resources', () => {
      mockGameState.playerFaction.resources.credits = 1000;
      mockGameState.playerFaction.resources.minerals = 500;

      const canAfford = resourceHUD.canAfford({ credits: 500, minerals: 200 });
      expect(canAfford).toBe(true);
    });

    it('should return false when player lacks resources', () => {
      mockGameState.playerFaction.resources.credits = 100;
      mockGameState.playerFaction.resources.minerals = 500;

      const canAfford = resourceHUD.canAfford({ credits: 500, minerals: 200 });
      expect(canAfford).toBe(false);
    });

    it('should handle partial cost objects', () => {
      mockGameState.playerFaction.resources.credits = 1000;

      const canAfford = resourceHUD.canAfford({ credits: 500 });
      expect(canAfford).toBe(true);
    });

    it('should check all 5 resource types', () => {
      mockGameState.playerFaction.resources.credits = 100;
      mockGameState.playerFaction.resources.minerals = 100;
      mockGameState.playerFaction.resources.fuel = 100;
      mockGameState.playerFaction.resources.food = 100;
      mockGameState.playerFaction.resources.energy = 100;

      const canAfford = resourceHUD.canAfford({
        credits: 50,
        minerals: 50,
        fuel: 50,
        food: 50,
        energy: 50,
      });
      expect(canAfford).toBe(true);
    });
  });

  describe('Get Missing Resources', () => {
    it('should return empty array when all resources available', () => {
      mockGameState.playerFaction.resources.credits = 1000;
      mockGameState.playerFaction.resources.minerals = 500;

      const missing = resourceHUD.getMissingResources({ credits: 500, minerals: 200 });
      expect(missing).toHaveLength(0);
    });

    it('should return missing resources when not available', () => {
      mockGameState.playerFaction.resources.credits = 100;
      mockGameState.playerFaction.resources.minerals = 100;

      const missing = resourceHUD.getMissingResources({ credits: 500, minerals: 200 });
      expect(missing).toHaveLength(2);
      expect(missing[0]).toContain('Insufficient Credits');
      expect(missing[1]).toContain('Insufficient Minerals');
    });

    it('should only return actually missing resources', () => {
      mockGameState.playerFaction.resources.credits = 100;
      mockGameState.playerFaction.resources.minerals = 500;

      const missing = resourceHUD.getMissingResources({ credits: 500, minerals: 200 });
      expect(missing).toHaveLength(1);
      expect(missing[0]).toContain('Insufficient Credits');
    });

    it('should include needed and have amounts in message (AC4 format)', () => {
      mockGameState.playerFaction.resources.credits = 100;

      const missing = resourceHUD.getMissingResources({ credits: 500 });
      // AC4 format: "Insufficient [Resource]. Need [X] have [Y]"
      expect(missing[0]).toBe('Insufficient Credits. Need 500 have 100');
    });
  });

  describe('Income Callback', () => {
    it('should subscribe to phaseProcessor income events', () => {
      expect(mockPhaseProcessor.onIncomeProcessed).toBeDefined();
    });

    it('should chain with original callback on income processed', () => {
      const originalCallback = jest.fn();

      // Set original callback BEFORE creating new HUD
      const newMockPhaseProcessor = {
        onIncomeProcessed: originalCallback,
        getIncomeSystem: jest.fn().mockReturnValue({
          calculateFactionIncome: jest.fn().mockReturnValue(new ResourceDelta()),
        }),
      } as unknown as PhaseProcessor;

      // Create new HUD that should chain with original
      const newHUD = new ResourceHUD(mockScene, 800, 100, mockGameState, newMockPhaseProcessor);

      const playerIncome = new ResourceDelta();
      playerIncome.credits = 100;
      const aiIncome = new ResourceDelta();

      // Call the new callback
      newMockPhaseProcessor.onIncomeProcessed?.(playerIncome, aiIncome);

      // Original should have been called (via chaining)
      expect(originalCallback).toHaveBeenCalledWith(playerIncome, aiIncome);

      newHUD.destroy();
    });
  });

  describe('Update Display', () => {
    it('should update display with current resource values', () => {
      mockGameState.playerFaction.resources.credits = 9999;

      resourceHUD.updateDisplay();

      const creditsText = textsByName.get('resource_Credits');
      expect(creditsText?._text).toMatch(/9.*999/);
    });
  });

  describe('Destroy', () => {
    it('should restore original callback on destroy', () => {
      const originalCallback = jest.fn();

      const newMockPhaseProcessor = {
        onIncomeProcessed: originalCallback,
        getIncomeSystem: jest.fn().mockReturnValue({
          calculateFactionIncome: jest.fn().mockReturnValue(new ResourceDelta()),
        }),
      } as unknown as PhaseProcessor;

      const newHUD = new ResourceHUD(mockScene, 800, 100, mockGameState, newMockPhaseProcessor);
      newHUD.destroy();

      // Original callback should be restored
      expect(newMockPhaseProcessor.onIncomeProcessed).toBe(originalCallback);
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
  gameState.playerFaction.resources.credits = 5000;
  gameState.playerFaction.resources.minerals = 2500;
  gameState.playerFaction.resources.fuel = 1500;
  gameState.playerFaction.resources.food = 3000;
  gameState.playerFaction.resources.energy = 2000;

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

  // Create AI planet
  const aiPlanet = new PlanetEntity();
  aiPlanet.id = 2;
  aiPlanet.name = 'Enemy World';
  aiPlanet.type = PlanetType.Desert;
  aiPlanet.owner = FactionType.AI;
  aiPlanet.position = new Position3D(100, 0, 0);
  aiPlanet.colonized = true;
  aiPlanet.population = 300;
  gameState.planets.push(aiPlanet);

  gameState.rebuildLookups();
  return gameState;
}
