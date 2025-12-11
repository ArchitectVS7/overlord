/**
 * Tests for InvasionPanel
 * Story 6-1: Initiate Planetary Invasion
 *
 * Tests verify the UI panel for initiating planetary invasions.
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

import { InvasionPanel } from '../../src/scenes/ui/InvasionPanel';
import { PlanetEntity } from '../../src/core/models/PlanetEntity';
import { CraftEntity } from '../../src/core/models/CraftEntity';
import { PlatoonEntity } from '../../src/core/models/PlatoonEntity';
import { FactionType, CraftType, PlanetType, EquipmentLevel, WeaponLevel } from '../../src/core/models/Enums';

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

// Create mock enemy planet
function createMockEnemyPlanet(id = 1, name = 'Enemy World'): PlanetEntity {
  const planet = new PlanetEntity();
  planet.id = id;
  planet.name = name;
  planet.type = PlanetType.Metropolis;
  planet.owner = FactionType.AI;
  planet.population = 200;
  return planet;
}

// Create mock platoon
function createMockPlatoon(id: number, owner = FactionType.Player): PlatoonEntity {
  const platoon = new PlatoonEntity();
  platoon.id = id;
  platoon.planetID = -1;
  platoon.owner = owner;
  platoon.troopCount = 100;
  platoon.equipment = EquipmentLevel.Basic;
  platoon.weapon = WeaponLevel.Rifle;
  platoon.strength = 100;
  return platoon;
}

// Create mock Battle Cruiser with platoons
function createMockBattleCruiser(id: number, planetID: number, platoonIDs: number[]): CraftEntity {
  const craft = new CraftEntity();
  craft.id = id;
  craft.type = CraftType.BattleCruiser;
  craft.owner = FactionType.Player;
  craft.planetID = planetID;
  craft.carriedPlatoonIDs = platoonIDs;
  return craft;
}

describe('InvasionPanel', () => {
  let scene: Phaser.Scene;
  let panel: InvasionPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new InvasionPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    it('should create panel', () => {
      expect(panel).toBeDefined();
      expect(panel.getIsVisible()).toBe(false);
    });

    it('should start with default aggression of 50', () => {
      expect(panel.getAggression()).toBe(50);
    });
  });

  describe('show and hide', () => {
    it('should show panel with target planet data', () => {
      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100]);
      const platoons = [createMockPlatoon(100)];
      panel.show(planet, [cruiser], platoons);
      expect(panel.getIsVisible()).toBe(true);
    });

    it('should hide panel', () => {
      const planet = createMockEnemyPlanet();
      panel.show(planet, [], []);
      panel.hide();
      expect(panel.getIsVisible()).toBe(false);
    });

    it('should call onClose callback when hidden', () => {
      const onClose = jest.fn();
      const planet = createMockEnemyPlanet();
      panel.show(planet, [], [], onClose);
      panel.hide();
      expect(onClose).toHaveBeenCalled();
    });

    it('should track target planet', () => {
      const planet = createMockEnemyPlanet(42, 'Target World');
      panel.show(planet, [], []);
      expect(panel.getTargetPlanet()?.id).toBe(42);
    });
  });

  describe('invasion force display', () => {
    it('should show total platoon count from cruisers', () => {
      const planet = createMockEnemyPlanet();
      const cruiser1 = createMockBattleCruiser(1, 1, [100, 101]);
      const cruiser2 = createMockBattleCruiser(2, 1, [102]);
      const platoons = [
        createMockPlatoon(100),
        createMockPlatoon(101),
        createMockPlatoon(102)
      ];
      panel.show(planet, [cruiser1, cruiser2], platoons);

      expect(panel.getTotalPlatoonCount()).toBe(3);
    });

    it('should show total troop count', () => {
      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100, 101]);
      const platoon1 = createMockPlatoon(100);
      platoon1.troopCount = 100;
      const platoon2 = createMockPlatoon(101);
      platoon2.troopCount = 150;
      panel.show(planet, [cruiser], [platoon1, platoon2]);

      expect(panel.getTotalTroopCount()).toBe(250);
    });

    it('should show combined military strength', () => {
      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100]);
      const platoon = createMockPlatoon(100);
      platoon.strength = 500;
      panel.show(planet, [cruiser], [platoon]);

      expect(panel.getTotalStrength()).toBe(500);
    });
  });

  describe('aggression slider', () => {
    it('should allow setting aggression level', () => {
      panel.setAggression(75);
      expect(panel.getAggression()).toBe(75);
    });

    it('should clamp aggression between 0 and 100', () => {
      panel.setAggression(150);
      expect(panel.getAggression()).toBe(100);

      panel.setAggression(-50);
      expect(panel.getAggression()).toBe(0);
    });

    it('should show casualty estimate based on aggression', () => {
      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100]);
      const platoon = createMockPlatoon(100);
      panel.show(planet, [cruiser], [platoon]);

      panel.setAggression(100);
      const highEstimate = panel.getEstimatedCasualties();

      panel.setAggression(25);
      const lowEstimate = panel.getEstimatedCasualties();

      // Higher aggression = higher casualties
      expect(highEstimate).toBeGreaterThanOrEqual(lowEstimate);
    });
  });

  describe('invasion action', () => {
    it('should fire onInvade callback with aggression level', () => {
      const onInvade = jest.fn();
      panel.onInvade = onInvade;

      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100]);
      const platoon = createMockPlatoon(100);
      panel.show(planet, [cruiser], [platoon]);
      panel.setAggression(75);

      panel.confirmInvasion();

      expect(onInvade).toHaveBeenCalledWith(planet, 75);
    });

    it('should not fire onInvade when no platoons available', () => {
      const onInvade = jest.fn();
      panel.onInvade = onInvade;

      const planet = createMockEnemyPlanet();
      panel.show(planet, [], []);

      panel.confirmInvasion();

      expect(onInvade).not.toHaveBeenCalled();
    });

    it('should close panel after successful invasion start', () => {
      panel.onInvade = jest.fn();

      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100]);
      const platoon = createMockPlatoon(100);
      panel.show(planet, [cruiser], [platoon]);

      panel.confirmInvasion();

      expect(panel.getIsVisible()).toBe(false);
    });
  });

  describe('button states', () => {
    it('should enable invade button when platoons available', () => {
      const planet = createMockEnemyPlanet();
      const cruiser = createMockBattleCruiser(1, 1, [100]);
      const platoon = createMockPlatoon(100);
      panel.show(planet, [cruiser], [platoon]);

      expect(panel.isInvadeEnabled()).toBe(true);
    });

    it('should disable invade button when no platoons available', () => {
      const planet = createMockEnemyPlanet();
      panel.show(planet, [], []);

      expect(panel.isInvadeEnabled()).toBe(false);
    });
  });

  describe('target planet info', () => {
    it('should show target planet name', () => {
      const planet = createMockEnemyPlanet(1, 'Fortress World');
      panel.show(planet, [], []);
      expect(panel.getTargetInfo().name).toBe('Fortress World');
    });

    it('should show target owner faction', () => {
      const planet = createMockEnemyPlanet();
      panel.show(planet, [], []);
      expect(panel.getTargetInfo().owner).toBe(FactionType.AI);
    });

    it('should show target population', () => {
      const planet = createMockEnemyPlanet();
      planet.population = 350;
      panel.show(planet, [], []);
      expect(panel.getTargetInfo().population).toBe(350);
    });
  });

  describe('aggression level descriptions', () => {
    it('should show "Cautious" for low aggression', () => {
      panel.setAggression(20);
      expect(panel.getAggressionDescription()).toBe('Cautious');
    });

    it('should show "Balanced" for medium aggression', () => {
      panel.setAggression(50);
      expect(panel.getAggressionDescription()).toBe('Balanced');
    });

    it('should show "Aggressive" for high aggression', () => {
      panel.setAggression(75);
      expect(panel.getAggressionDescription()).toBe('Aggressive');
    });

    it('should show "All-Out Assault" for maximum aggression', () => {
      panel.setAggression(100);
      expect(panel.getAggressionDescription()).toBe('All-Out Assault');
    });
  });
});
