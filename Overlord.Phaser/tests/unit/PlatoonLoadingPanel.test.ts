/**
 * Tests for PlatoonLoadingPanel
 * Story 5-4: Loading Platoons onto Battle Cruisers
 *
 * Tests verify the UI panel for loading/unloading platoons onto spacecraft.
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

import { PlatoonLoadingPanel } from '../../src/scenes/ui/PlatoonLoadingPanel';
import { PlanetEntity } from '../../src/core/models/PlanetEntity';
import { CraftEntity } from '../../src/core/models/CraftEntity';
import { PlatoonEntity } from '../../src/core/models/PlatoonEntity';
import { FactionType, PlanetType, CraftType, EquipmentLevel, WeaponLevel } from '../../src/core/models/Enums';
import { ResourceCollection } from '../../src/core/models/ResourceModels';
// CraftSpecs not imported - specs is computed getter on CraftEntity

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
function createMockPlanet(id = 1, name = 'Test Planet'): PlanetEntity {
  const planet = new PlanetEntity();
  planet.id = id;
  planet.name = name;
  planet.type = PlanetType.Metropolis;
  planet.owner = FactionType.Player;
  planet.population = 500;
  planet.resources = new ResourceCollection();
  planet.resources.credits = 100000;
  planet.resources.minerals = 20000;
  planet.resources.fuel = 10000;
  return planet;
}

// Create mock Battle Cruiser
function createMockBattleCruiser(id = 1, planetID = 1): CraftEntity {
  const craft = new CraftEntity();
  craft.id = id;
  craft.type = CraftType.BattleCruiser;
  craft.owner = FactionType.Player;
  craft.planetID = planetID;
  craft.carriedPlatoonIDs = [];
  craft.inTransit = false;
  // Note: specs is a computed getter based on type, no need to set
  return craft;
}

// Create mock platoon
function createMockPlatoon(id: number, planetID = 1, name?: string): PlatoonEntity {
  const platoon = new PlatoonEntity();
  platoon.id = id;
  platoon.name = name || `Platoon ${id}`;
  platoon.owner = FactionType.Player;
  platoon.planetID = planetID;
  platoon.troopCount = 100;
  platoon.equipment = EquipmentLevel.BasicArmor;
  platoon.weapon = WeaponLevel.Rifle;
  platoon.trainingLevel = 100;
  platoon.trainingTurnsRemaining = 0; // This makes isTraining = false (computed getter)
  platoon.strength = 100;
  return platoon;
}

describe('PlatoonLoadingPanel', () => {
  let scene: Phaser.Scene;
  let panel: PlatoonLoadingPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new PlatoonLoadingPanel(scene);
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
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      const platoons = [createMockPlatoon(1), createMockPlatoon(2)];
      panel.show(craft, planet, platoons);
      expect(panel.getIsVisible()).toBe(true);
    });

    it('should hide panel', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      panel.show(craft, planet, []);
      panel.hide();
      expect(panel.getIsVisible()).toBe(false);
    });

    it('should call onClose callback when hidden', () => {
      const onClose = jest.fn();
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      panel.show(craft, planet, [], onClose);
      panel.hide();
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('cargo status display (AC2)', () => {
    it('should return cargo count of 0 when empty', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      panel.show(craft, planet, []);
      expect(panel.getCargoCount()).toBe(0);
    });

    it('should return correct cargo count when platoons loaded', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1, 2];
      panel.show(craft, planet, []);
      expect(panel.getCargoCount()).toBe(2);
    });

    it('should return max capacity of 4', () => {
      expect(panel.getMaxCapacity()).toBe(4);
    });
  });

  describe('available platoons list (AC3)', () => {
    it('should return available platoons on planet', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      const platoons = [createMockPlatoon(1), createMockPlatoon(2)];
      panel.show(craft, planet, platoons);
      expect(panel.getAvailablePlatoons().length).toBe(2);
    });

    it('should exclude platoons already loaded on craft', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1];
      const platoons = [createMockPlatoon(1), createMockPlatoon(2)];
      panel.show(craft, planet, platoons);
      expect(panel.getAvailablePlatoons().length).toBe(1);
      expect(panel.getAvailablePlatoons()[0].id).toBe(2);
    });
  });

  describe('platoon info display (AC4)', () => {
    it('should return platoon troop count', () => {
      const platoon = createMockPlatoon(1);
      platoon.troopCount = 75;
      expect(panel.getPlatoonTroopCount(platoon)).toBe(75);
    });

    it('should return platoon equipment level', () => {
      const platoon = createMockPlatoon(1);
      platoon.equipment = EquipmentLevel.HeavyArmor;
      expect(panel.getPlatoonEquipment(platoon)).toBe(EquipmentLevel.HeavyArmor);
    });

    it('should return platoon weapon level', () => {
      const platoon = createMockPlatoon(1);
      platoon.weapon = WeaponLevel.LaserRifle;
      expect(panel.getPlatoonWeapon(platoon)).toBe(WeaponLevel.LaserRifle);
    });
  });

  describe('load action (AC5)', () => {
    it('should fire onLoad callback when loading platoon', () => {
      const onLoad = jest.fn();
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      const platoons = [createMockPlatoon(1)];
      panel.onLoad = onLoad;
      panel.show(craft, planet, platoons);
      panel.handleLoad(1);
      expect(onLoad).toHaveBeenCalledWith(craft.id, 1);
    });
  });

  describe('platoon status change (AC6)', () => {
    it('should update loaded platoons list after load', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      const platoons = [createMockPlatoon(1)];
      panel.show(craft, planet, platoons);

      // Simulate successful load by updating craft and refreshing
      craft.carriedPlatoonIDs = [1];
      panel.refresh(craft, platoons);

      expect(panel.getLoadedPlatoons().length).toBe(1);
    });
  });

  describe('cargo full error (AC7)', () => {
    it('should return true when cargo bay is full', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1, 2, 3, 4];
      panel.show(craft, planet, []);
      expect(panel.isCargoBayFull()).toBe(true);
    });

    it('should return false when cargo bay has space', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1, 2];
      panel.show(craft, planet, []);
      expect(panel.isCargoBayFull()).toBe(false);
    });

    it('should not fire onLoad when cargo bay is full', () => {
      const onLoad = jest.fn();
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1, 2, 3, 4];
      const platoons = [createMockPlatoon(5)];
      panel.onLoad = onLoad;
      panel.show(craft, planet, platoons);
      panel.handleLoad(5);
      expect(onLoad).not.toHaveBeenCalled();
    });
  });

  describe('unload action (AC8)', () => {
    it('should fire onUnload callback when unloading platoon', () => {
      const onUnload = jest.fn();
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1];
      const platoons = [createMockPlatoon(1)];
      panel.onUnload = onUnload;
      panel.show(craft, planet, platoons);
      panel.handleUnload(1);
      expect(onUnload).toHaveBeenCalledWith(craft.id, 1);
    });

    it('should not fire onUnload for platoon not on craft', () => {
      const onUnload = jest.fn();
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [1];
      panel.onUnload = onUnload;
      panel.show(craft, planet, []);
      panel.handleUnload(99);
      expect(onUnload).not.toHaveBeenCalled();
    });
  });

  describe('empty states', () => {
    it('should indicate no available platoons', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      panel.show(craft, planet, []);
      expect(panel.hasAvailablePlatoons()).toBe(false);
    });

    it('should indicate no loaded platoons', () => {
      const planet = createMockPlanet();
      const craft = createMockBattleCruiser();
      craft.carriedPlatoonIDs = [];
      panel.show(craft, planet, []);
      expect(panel.hasLoadedPlatoons()).toBe(false);
    });
  });
});
