/**
 * Tests for PlatoonCommissionPanel
 * Story 5-1: Platoon Commissioning with Equipment Configuration
 *
 * Tests verify the UI panel for commissioning platoons with configurable equipment and weapons.
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

import { PlatoonCommissionPanel } from '../../src/scenes/ui/PlatoonCommissionPanel';
import { PlanetEntity } from '../../src/core/models/PlanetEntity';
import { FactionType, EquipmentLevel, WeaponLevel, PlanetType } from '../../src/core/models/Enums';
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
function createMockPlanet(id = 1, name = 'Test Planet'): PlanetEntity {
  const planet = new PlanetEntity();
  planet.id = id;
  planet.name = name;
  planet.type = PlanetType.Metropolis;
  planet.owner = FactionType.Player;
  planet.population = 500;
  planet.resources = new ResourceCollection();
  planet.resources.credits = 10000;
  planet.resources.minerals = 5000;
  planet.resources.fuel = 3000;
  planet.resources.food = 2000;
  planet.resources.energy = 1000;
  return planet;
}

describe('PlatoonCommissionPanel', () => {
  let scene: Phaser.Scene;
  let panel: PlatoonCommissionPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new PlatoonCommissionPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  describe('initialization', () => {
    it('should create panel', () => {
      expect(panel).toBeDefined();
      expect(panel.getIsVisible()).toBe(false);
    });

    it('should start with default configuration', () => {
      expect(panel.getTroopCount()).toBe(100);
      expect(panel.getEquipmentLevel()).toBe(EquipmentLevel.Basic);
      expect(panel.getWeaponLevel()).toBe(WeaponLevel.Rifle);
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

    it('should track current planet', () => {
      const planet = createMockPlanet(42, 'Starbase');
      panel.show(planet);
      expect(panel.getPlanet()?.id).toBe(42);
    });
  });

  describe('troop count configuration', () => {
    it('should allow setting troop count', () => {
      panel.setTroopCount(150);
      expect(panel.getTroopCount()).toBe(150);
    });

    it('should clamp troop count between 1 and 200', () => {
      panel.setTroopCount(250);
      expect(panel.getTroopCount()).toBe(200);

      panel.setTroopCount(-10);
      expect(panel.getTroopCount()).toBe(1);
    });

    it('should update cost preview when troop count changes', () => {
      const planet = createMockPlanet();
      panel.show(planet);

      const initialCost = panel.getTotalCost();
      panel.setTroopCount(150);
      const newCost = panel.getTotalCost();

      // Cost should not change with troop count (only equipment/weapon affect cost)
      expect(newCost).toBe(initialCost);
    });
  });

  describe('equipment level configuration', () => {
    it('should allow setting equipment level', () => {
      panel.setEquipmentLevel(EquipmentLevel.Advanced);
      expect(panel.getEquipmentLevel()).toBe(EquipmentLevel.Advanced);
    });

    it('should update cost preview when equipment changes', () => {
      const planet = createMockPlanet();
      panel.show(planet);

      const basicCost = panel.getTotalCost();
      panel.setEquipmentLevel(EquipmentLevel.Advanced);
      const advancedCost = panel.getTotalCost();

      expect(advancedCost).toBeGreaterThan(basicCost);
    });

    it('should update strength preview when equipment changes', () => {
      const planet = createMockPlanet();
      panel.show(planet);

      const basicStrength = panel.getEstimatedStrength();
      panel.setEquipmentLevel(EquipmentLevel.Advanced);
      const advancedStrength = panel.getEstimatedStrength();

      expect(advancedStrength).toBeGreaterThan(basicStrength);
    });
  });

  describe('weapon level configuration', () => {
    it('should allow setting weapon level', () => {
      panel.setWeaponLevel(WeaponLevel.Plasma);
      expect(panel.getWeaponLevel()).toBe(WeaponLevel.Plasma);
    });

    it('should update cost preview when weapon changes', () => {
      const planet = createMockPlanet();
      panel.show(planet);

      const rifleCost = panel.getTotalCost();
      panel.setWeaponLevel(WeaponLevel.Plasma);
      const plasmaCost = panel.getTotalCost();

      expect(plasmaCost).toBeGreaterThan(rifleCost);
    });

    it('should update strength preview when weapon changes', () => {
      const planet = createMockPlanet();
      panel.show(planet);

      const rifleStrength = panel.getEstimatedStrength();
      panel.setWeaponLevel(WeaponLevel.Plasma);
      const plasmaStrength = panel.getEstimatedStrength();

      expect(plasmaStrength).toBeGreaterThan(rifleStrength);
    });
  });

  describe('cost calculation', () => {
    it('should calculate total cost for Basic/Rifle', () => {
      panel.setTroopCount(100);
      panel.setEquipmentLevel(EquipmentLevel.Basic);
      panel.setWeaponLevel(WeaponLevel.Rifle);

      // From PlatoonCosts: Basic (35000) + Rifle (10000) = 45000
      expect(panel.getTotalCost()).toBe(45000);
    });

    it('should calculate total cost for Advanced/Plasma', () => {
      panel.setTroopCount(100);
      panel.setEquipmentLevel(EquipmentLevel.Advanced);
      panel.setWeaponLevel(WeaponLevel.Plasma);

      // From PlatoonCosts: Advanced (80000) + Plasma (30000) = 110000
      expect(panel.getTotalCost()).toBe(110000);
    });
  });

  describe('strength preview', () => {
    it('should calculate estimated strength', () => {
      panel.setTroopCount(100);
      panel.setEquipmentLevel(EquipmentLevel.Basic);
      panel.setWeaponLevel(WeaponLevel.Rifle);

      const strength = panel.getEstimatedStrength();
      expect(strength).toBeGreaterThan(0);
    });

    it('should increase strength with more troops', () => {
      panel.setEquipmentLevel(EquipmentLevel.Basic);
      panel.setWeaponLevel(WeaponLevel.Rifle);

      panel.setTroopCount(100);
      const strength100 = panel.getEstimatedStrength();

      panel.setTroopCount(200);
      const strength200 = panel.getEstimatedStrength();

      expect(strength200).toBeGreaterThan(strength100);
    });
  });

  describe('commission action', () => {
    it('should fire onCommission callback with correct configuration', () => {
      const onCommission = jest.fn();
      panel.onCommission = onCommission;

      const planet = createMockPlanet();
      planet.resources.credits = 100000; // Ensure affordable (Standard 55000 + AssaultRifle 18000 = 73000)
      panel.show(planet);
      panel.setTroopCount(150);
      panel.setEquipmentLevel(EquipmentLevel.Standard);
      panel.setWeaponLevel(WeaponLevel.AssaultRifle);

      panel.confirmCommission();

      expect(onCommission).toHaveBeenCalledWith(
        planet,
        150,
        EquipmentLevel.Standard,
        WeaponLevel.AssaultRifle
      );
    });

    it('should not fire onCommission when planet is null', () => {
      const onCommission = jest.fn();
      panel.onCommission = onCommission;

      panel.confirmCommission();

      expect(onCommission).not.toHaveBeenCalled();
    });

    it('should close panel after successful commission', () => {
      panel.onCommission = jest.fn();

      const planet = createMockPlanet();
      planet.resources.credits = 100000; // Ensure affordable
      panel.show(planet);

      panel.confirmCommission();

      expect(panel.getIsVisible()).toBe(false);
    });
  });

  describe('affordability checking', () => {
    it('should enable commission button when affordable', () => {
      const planet = createMockPlanet();
      planet.resources.credits = 50000; // Enough for Basic/Rifle (45000)
      panel.show(planet);

      expect(panel.isCommissionEnabled()).toBe(true);
    });

    it('should disable commission button when insufficient credits', () => {
      const planet = createMockPlanet();
      planet.resources.credits = 1000; // Not enough for Basic/Rifle (45000)
      panel.show(planet);

      expect(panel.isCommissionEnabled()).toBe(false);
    });

    it('should disable commission button when insufficient population', () => {
      const planet = createMockPlanet();
      planet.population = 50; // Less than troop count (100)
      panel.show(planet);

      expect(panel.isCommissionEnabled()).toBe(false);
    });

    it('should update button state when configuration changes', () => {
      const planet = createMockPlanet();
      planet.resources.credits = 60000;
      panel.show(planet);

      // Basic/Rifle costs 45000 - should be enabled
      expect(panel.isCommissionEnabled()).toBe(true);

      // Advanced/Plasma costs 110000 - should be disabled
      panel.setEquipmentLevel(EquipmentLevel.Advanced);
      panel.setWeaponLevel(WeaponLevel.Plasma);
      expect(panel.isCommissionEnabled()).toBe(false);
    });
  });

  describe('planet count display', () => {
    it('should show current platoon count on planet', () => {
      const planet = createMockPlanet();
      panel.show(planet, undefined, 3);

      expect(panel.getPlatoonCount()).toBe(3);
    });

    it('should default to 0 when count not provided', () => {
      const planet = createMockPlanet();
      panel.show(planet);

      expect(panel.getPlatoonCount()).toBe(0);
    });
  });
});
