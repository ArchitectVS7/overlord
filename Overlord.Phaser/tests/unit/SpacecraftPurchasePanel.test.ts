/**
 * Tests for SpacecraftPurchasePanel
 * Story 5-3: Spacecraft Purchase and Types
 *
 * Tests verify the UI panel for purchasing spacecraft.
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

import { SpacecraftPurchasePanel } from '../../src/scenes/ui/SpacecraftPurchasePanel';
import { PlanetEntity } from '../../src/core/models/PlanetEntity';
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

// Create mock planet with resources
function createMockPlanet(id = 1, name = 'Test Planet', credits = 100000): PlanetEntity {
  const planet = new PlanetEntity();
  planet.id = id;
  planet.name = name;
  planet.type = PlanetType.Metropolis;
  planet.owner = FactionType.Player;
  planet.population = 500;
  planet.resources = new ResourceCollection();
  planet.resources.credits = credits;
  planet.resources.minerals = 20000;
  planet.resources.fuel = 10000;
  return planet;
}

describe('SpacecraftPurchasePanel', () => {
  let scene: Phaser.Scene;
  let panel: SpacecraftPurchasePanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new SpacecraftPurchasePanel(scene);
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
    it('should show panel with planet data', () => {
      const planet = createMockPlanet();
      panel.show(planet);
      expect(panel.getIsVisible()).toBe(true);
    });

    it('should hide panel', () => {
      const planet = createMockPlanet();
      panel.show(planet);
      panel.hide();
      expect(panel.getIsVisible()).toBe(false);
    });

    it('should call onClose callback when hidden', () => {
      const onClose = jest.fn();
      const planet = createMockPlanet();
      panel.show(planet, onClose);
      panel.hide();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('craft types display (AC2)', () => {
    it('should list all available craft types', () => {
      const planet = createMockPlanet();
      panel.show(planet);
      const craftTypes = panel.getAvailableCraftTypes();
      expect(craftTypes).toContain(CraftType.BattleCruiser);
      expect(craftTypes).toContain(CraftType.CargoCruiser);
      expect(craftTypes).toContain(CraftType.SolarSatellite);
      expect(craftTypes).toContain(CraftType.AtmosphereProcessor);
    });
  });

  describe('cost display (AC3)', () => {
    it('should return cost for BattleCruiser', () => {
      const planet = createMockPlanet();
      panel.show(planet);
      const cost = panel.getCraftCost(CraftType.BattleCruiser);
      expect(cost.credits).toBe(50000);
      expect(cost.minerals).toBe(10000);
      expect(cost.fuel).toBe(5000);
    });

    it('should return cost for SolarSatellite', () => {
      const planet = createMockPlanet();
      panel.show(planet);
      const cost = panel.getCraftCost(CraftType.SolarSatellite);
      expect(cost.credits).toBe(15000);
      expect(cost.minerals).toBe(3000);
      expect(cost.fuel).toBe(1000);
    });
  });

  describe('affordability check (AC4)', () => {
    it('should indicate craft is affordable when resources sufficient', () => {
      const planet = createMockPlanet(1, 'Rich Planet', 100000);
      panel.show(planet);
      expect(panel.canAfford(CraftType.BattleCruiser)).toBe(true);
    });

    it('should indicate craft is not affordable when resources insufficient', () => {
      const planet = createMockPlanet(1, 'Poor Planet', 1000);
      panel.show(planet);
      expect(panel.canAfford(CraftType.BattleCruiser)).toBe(false);
    });

    it('should check crew requirements for affordability', () => {
      const planet = createMockPlanet(1, 'Low Pop', 100000);
      planet.population = 10; // Too few for BattleCruiser (needs 50)
      panel.show(planet);
      expect(panel.canAfford(CraftType.BattleCruiser)).toBe(false);
    });
  });

  describe('purchase action (AC5)', () => {
    it('should fire onPurchase callback when purchasing', () => {
      const onPurchase = jest.fn();
      const planet = createMockPlanet();
      panel.onPurchase = onPurchase;
      panel.show(planet);
      panel.handlePurchase(CraftType.BattleCruiser);
      expect(onPurchase).toHaveBeenCalledWith(CraftType.BattleCruiser);
    });

    it('should not fire onPurchase when not affordable', () => {
      const onPurchase = jest.fn();
      const planet = createMockPlanet(1, 'Poor', 100);
      panel.onPurchase = onPurchase;
      panel.show(planet);
      panel.handlePurchase(CraftType.BattleCruiser);
      expect(onPurchase).not.toHaveBeenCalled();
    });
  });

  describe('fleet limit (AC6)', () => {
    it('should track current fleet count', () => {
      const planet = createMockPlanet();
      panel.show(planet, undefined, 5);
      expect(panel.getFleetCount()).toBe(5);
    });

    it('should return max fleet limit', () => {
      expect(panel.getMaxFleetLimit()).toBe(32);
    });
  });

  describe('cargo capacity display (AC8)', () => {
    it('should return cargo capacity for BattleCruiser', () => {
      const capacity = panel.getPlatoonCapacity(CraftType.BattleCruiser);
      expect(capacity).toBe(4);
    });

    it('should return zero capacity for non-transport craft', () => {
      const capacity = panel.getPlatoonCapacity(CraftType.SolarSatellite);
      expect(capacity).toBe(0);
    });
  });

  describe('crew requirements', () => {
    it('should return crew requirement for BattleCruiser', () => {
      expect(panel.getCrewRequired(CraftType.BattleCruiser)).toBe(50);
    });

    it('should return crew requirement for SolarSatellite', () => {
      expect(panel.getCrewRequired(CraftType.SolarSatellite)).toBe(5);
    });
  });
});
