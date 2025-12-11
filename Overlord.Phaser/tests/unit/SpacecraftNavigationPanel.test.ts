/**
 * Tests for SpacecraftNavigationPanel
 * Story 5-5: Spacecraft Navigation Between Planets
 *
 * Tests verify the UI panel for navigating spacecraft between planets.
 */

// Mock Phaser before imports
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    GameObjects: {
      Container: class MockContainer {
        scene: unknown;
        x = 0;
        y = 0;
        visible = true;
        depth = 0;
        alpha = 1;
        scrollFactorX = 1;
        scrollFactorY = 1;
        list: unknown[] = [];
        dataStore: Map<string, unknown> = new Map();

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        getAll(): unknown[] { return this.list; }
        removeAll(_destroyChild?: boolean): this { this.list = []; return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setAlpha(a: number): this { this.alpha = a; return this; }
        setScrollFactor(x: number, y?: number): this {
          this.scrollFactorX = x;
          this.scrollFactorY = y ?? x;
          return this;
        }
        setData(key: string, value: unknown): this { this.dataStore.set(key, value); return this; }
        getData(key: string): unknown { return this.dataStore.get(key); }
        destroy(): void { this.list = []; this.dataStore.clear(); }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
        fillRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRoundedRect(): this { return this; }
        lineBetween(): this { return this; }
        clear(): this { return this; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        style: Record<string, unknown> = {};
        originX = 0;
        originY = 0;
        visible = true;
        dataStore: Map<string, unknown> = new Map();

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }

        setText(t: string): this { this.text = t; return this; }
        setOrigin(x: number, y?: number): this { this.originX = x; this.originY = y ?? x; return this; }
        setColor(c: string): this { this.style.color = c; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setData(key: string, value: unknown): this { this.dataStore.set(key, value); return this; }
        getData(key: string): unknown { return this.dataStore.get(key); }
        destroy(): void { this.dataStore.clear(); }
      },
      Rectangle: class MockRectangle {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        fillColor = 0;
        fillAlpha = 1;
        visible = true;
        listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

        constructor(_scene: unknown, x: number, y: number, w: number, h: number, color?: number, alpha?: number) {
          this.x = x;
          this.y = y;
          this.width = w;
          this.height = h;
          this.fillColor = color || 0;
          this.fillAlpha = alpha ?? 1;
        }

        setOrigin(x: number, _y?: number): this { this.x = x; return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        on(event: string, callback: (...args: unknown[]) => void): this {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
          }
          this.listeners.get(event)!.push(callback);
          return this;
        }
        emit(event: string, ...args: unknown[]): void {
          const handlers = this.listeners.get(event);
          if (handlers) handlers.forEach(h => h(...args));
        }
        destroy(): void {}
      },
      Zone: class MockZone {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        listeners: Map<string, ((...args: unknown[]) => void)[]> = new Map();

        constructor(_scene: unknown, x: number, y: number, w: number, h: number) {
          this.x = x;
          this.y = y;
          this.width = w;
          this.height = h;
        }

        setInteractive(): this { return this; }
        on(event: string, callback: (...args: unknown[]) => void): this {
          if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
          }
          this.listeners.get(event)!.push(callback);
          return this;
        }
        emit(event: string, ...args: unknown[]): void {
          const handlers = this.listeners.get(event);
          if (handlers) handlers.forEach(h => h(...args));
        }
        removeAllListeners(): this { this.listeners.clear(); return this; }
        destroy(): void {}
      }
    },
    Scene: class MockScene {}
  }
}));

import { SpacecraftNavigationPanel } from '../../src/scenes/ui/SpacecraftNavigationPanel';
import { PlanetEntity } from '../../src/core/models/PlanetEntity';
import { CraftEntity } from '../../src/core/models/CraftEntity';
import { FactionType, PlanetType, CraftType } from '../../src/core/models/Enums';
import { ResourceCollection } from '../../src/core/models/ResourceModels';

// Create mock scene
function createMockScene(): Phaser.Scene {
  return {
    add: {
      existing: jest.fn(),
      graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
      text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
        new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)
      ),
      rectangle: jest.fn((x: number, y: number, w: number, h: number, color?: number, alpha?: number) =>
        new (jest.requireMock('phaser').default.GameObjects.Rectangle)(null, x, y, w, h, color, alpha)
      ),
      zone: jest.fn((x: number, y: number, w: number, h: number) =>
        new (jest.requireMock('phaser').default.GameObjects.Zone)(null, x, y, w, h)
      ),
      container: jest.fn((x: number, y: number) =>
        new (jest.requireMock('phaser').default.GameObjects.Container)(null, x, y)
      )
    },
    cameras: {
      main: {
        width: 1920,
        height: 1080
      }
    },
    tweens: {
      add: jest.fn((config) => {
        if (config.onComplete) config.onComplete();
        return { stop: jest.fn() };
      }),
      killTweensOf: jest.fn()
    }
  } as unknown as Phaser.Scene;
}

// Create mock planet
function createMockPlanet(id: number, name: string, fuel = 100): PlanetEntity {
  const planet = new PlanetEntity();
  planet.id = id;
  planet.name = name;
  planet.type = PlanetType.Metropolis;
  planet.owner = FactionType.Player;
  planet.population = 500;
  planet.resources = new ResourceCollection();
  planet.resources.credits = 100000;
  planet.resources.minerals = 20000;
  planet.resources.fuel = fuel;
  return planet;
}

// Create mock spacecraft
function createMockCraft(id = 1, planetID = 1): CraftEntity {
  const craft = new CraftEntity();
  craft.id = id;
  craft.type = CraftType.BattleCruiser;
  craft.owner = FactionType.Player;
  craft.planetID = planetID;
  craft.carriedPlatoonIDs = [];
  craft.inTransit = false;
  return craft;
}

describe('SpacecraftNavigationPanel', () => {
  let scene: Phaser.Scene;
  let panel: SpacecraftNavigationPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new SpacecraftNavigationPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    it('should create panel', () => {
      expect(panel).toBeDefined();
      expect(panel.getIsVisible()).toBe(false);
    });
  });

  describe('show and hide', () => {
    it('should show panel with craft and planet data', () => {
      const craft = createMockCraft();
      const planets = [createMockPlanet(1, 'Earth'), createMockPlanet(2, 'Mars')];
      panel.show(craft, planets);
      expect(panel.getIsVisible()).toBe(true);
    });

    it('should hide panel', () => {
      const craft = createMockCraft();
      const planets = [createMockPlanet(1, 'Earth')];
      panel.show(craft, planets);
      panel.hide();
      expect(panel.getIsVisible()).toBe(false);
    });

    it('should call onClose callback when hidden', () => {
      const onClose = jest.fn();
      const craft = createMockCraft();
      const planets = [createMockPlanet(1, 'Earth')];
      panel.show(craft, planets, onClose);
      panel.hide();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('current location display (AC3)', () => {
    it('should return current planet name', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth'), createMockPlanet(2, 'Mars')];
      panel.show(craft, planets);
      expect(panel.getCurrentPlanetName()).toBe('Earth');
    });
  });

  describe('destination selection (AC2, AC4)', () => {
    it('should return available destinations excluding current planet', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth'), createMockPlanet(2, 'Mars'), createMockPlanet(3, 'Venus')];
      panel.show(craft, planets);
      const destinations = panel.getAvailableDestinations();
      expect(destinations.length).toBe(2);
      expect(destinations.find(p => p.id === 1)).toBeUndefined();
    });

    it('should select destination planet', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth'), createMockPlanet(2, 'Mars')];
      panel.show(craft, planets);
      panel.selectDestination(2);
      expect(panel.getSelectedDestination()).toBe(2);
    });
  });

  describe('fuel cost display (AC4)', () => {
    it('should return fuel cost of 10 per jump', () => {
      expect(panel.getFuelCost()).toBe(10);
    });

    it('should return travel time as instant', () => {
      expect(panel.getTravelTime()).toBe('Instant');
    });
  });

  describe('fuel availability check (AC5)', () => {
    it('should return true when source planet has enough fuel', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 100)];
      panel.show(craft, planets);
      expect(panel.hasEnoughFuel()).toBe(true);
    });

    it('should return false when source planet has insufficient fuel', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 5)];
      panel.show(craft, planets);
      expect(panel.hasEnoughFuel()).toBe(false);
    });

    it('should return current fuel amount', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 75)];
      panel.show(craft, planets);
      expect(panel.getCurrentFuel()).toBe(75);
    });
  });

  describe('navigation action (AC6)', () => {
    it('should fire onNavigate callback when navigating', () => {
      const onNavigate = jest.fn();
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 100), createMockPlanet(2, 'Mars')];
      panel.onNavigate = onNavigate;
      panel.show(craft, planets);
      panel.selectDestination(2);
      panel.handleNavigate();
      expect(onNavigate).toHaveBeenCalledWith(craft.id, 2);
    });

    it('should not fire onNavigate when no destination selected', () => {
      const onNavigate = jest.fn();
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 100)];
      panel.onNavigate = onNavigate;
      panel.show(craft, planets);
      panel.handleNavigate();
      expect(onNavigate).not.toHaveBeenCalled();
    });

    it('should not fire onNavigate when insufficient fuel', () => {
      const onNavigate = jest.fn();
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 5), createMockPlanet(2, 'Mars')];
      panel.onNavigate = onNavigate;
      panel.show(craft, planets);
      panel.selectDestination(2);
      panel.handleNavigate();
      expect(onNavigate).not.toHaveBeenCalled();
    });
  });

  describe('destination planet validation (AC5)', () => {
    it('should mark destination as reachable when fuel available', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 100), createMockPlanet(2, 'Mars')];
      panel.show(craft, planets);
      expect(panel.isDestinationReachable(2)).toBe(true);
    });

    it('should mark destination as unreachable when fuel unavailable', () => {
      const craft = createMockCraft(1, 1);
      const planets = [createMockPlanet(1, 'Earth', 5), createMockPlanet(2, 'Mars')];
      panel.show(craft, planets);
      expect(panel.isDestinationReachable(2)).toBe(false);
    });
  });

  describe('navigation with loaded platoons', () => {
    it('should allow navigation with carried platoons', () => {
      const onNavigate = jest.fn();
      const craft = createMockCraft(1, 1);
      craft.carriedPlatoonIDs = [1, 2];
      const planets = [createMockPlanet(1, 'Earth', 100), createMockPlanet(2, 'Mars')];
      panel.onNavigate = onNavigate;
      panel.show(craft, planets);
      panel.selectDestination(2);
      panel.handleNavigate();
      expect(onNavigate).toHaveBeenCalledWith(craft.id, 2);
    });
  });
});
