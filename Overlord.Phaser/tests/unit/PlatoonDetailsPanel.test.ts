/**
 * Tests for PlatoonDetailsPanel
 * Story 5-2: Platoon Details and Management
 *
 * Tests verify the UI panel for viewing and managing platoons.
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

import { PlatoonDetailsPanel } from '../../src/scenes/ui/PlatoonDetailsPanel';
import { PlanetEntity } from '../../src/core/models/PlanetEntity';
import { PlatoonEntity } from '../../src/core/models/PlatoonEntity';
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
  return planet;
}

// Create mock platoon
function createMockPlatoon(id: number, name: string, planetID: number): PlatoonEntity {
  const platoon = new PlatoonEntity();
  platoon.id = id;
  platoon.name = name;
  platoon.planetID = planetID;
  platoon.owner = FactionType.Player;
  platoon.troopCount = 100;
  platoon.equipment = EquipmentLevel.Basic;
  platoon.weapon = WeaponLevel.Rifle;
  platoon.trainingLevel = 100;
  platoon.trainingTurnsRemaining = 0;
  platoon.strength = 100;
  return platoon;
}

describe('PlatoonDetailsPanel', () => {
  let scene: Phaser.Scene;
  let panel: PlatoonDetailsPanel;

  beforeEach(() => {
    scene = createMockScene();
    panel = new PlatoonDetailsPanel(scene);
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
    it('should show panel with planet and platoon data', () => {
      const planet = createMockPlanet();
      const platoons = [createMockPlatoon(1, 'Alpha Squad', planet.id)];

      panel.show(planet, platoons);

      expect(panel.getIsVisible()).toBe(true);
    });

    it('should hide panel', () => {
      const planet = createMockPlanet();
      const platoons = [createMockPlatoon(1, 'Alpha Squad', planet.id)];

      panel.show(planet, platoons);
      panel.hide();

      expect(panel.getIsVisible()).toBe(false);
    });

    it('should call onClose callback when hidden', () => {
      const onClose = jest.fn();
      const planet = createMockPlanet();

      panel.show(planet, [], onClose);
      panel.hide();

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('platoon list rendering (AC1, AC2)', () => {
    it('should return correct platoon count', () => {
      const planet = createMockPlanet();
      const platoons = [
        createMockPlatoon(1, 'Alpha Squad', planet.id),
        createMockPlatoon(2, 'Bravo Squad', planet.id),
        createMockPlatoon(3, 'Charlie Squad', planet.id)
      ];

      panel.show(planet, platoons);

      expect(panel.getPlatoonCount()).toBe(3);
    });

    it('should track planet reference', () => {
      const planet = createMockPlanet(42, 'Mars Base');
      panel.show(planet, []);

      expect(panel.getPlanet()?.id).toBe(42);
    });
  });

  describe('platoon selection (AC3)', () => {
    it('should allow selecting a platoon', () => {
      const planet = createMockPlanet();
      const platoons = [
        createMockPlatoon(1, 'Alpha Squad', planet.id),
        createMockPlatoon(2, 'Bravo Squad', planet.id)
      ];

      panel.show(planet, platoons);
      panel.selectPlatoon(2);

      expect(panel.getSelectedPlatoonId()).toBe(2);
    });

    it('should return null when no platoon selected', () => {
      const planet = createMockPlanet();
      panel.show(planet, []);

      expect(panel.getSelectedPlatoonId()).toBeNull();
    });

    it('should clear selection on hide', () => {
      const planet = createMockPlanet();
      const platoons = [createMockPlatoon(1, 'Alpha Squad', planet.id)];

      panel.show(planet, platoons);
      panel.selectPlatoon(1);
      panel.hide();
      panel.show(planet, platoons);

      expect(panel.getSelectedPlatoonId()).toBeNull();
    });
  });

  describe('disband action (AC5)', () => {
    it('should fire onDisband callback when disbanding', () => {
      const onDisband = jest.fn();
      const planet = createMockPlanet();
      const platoons = [createMockPlatoon(1, 'Alpha Squad', planet.id)];

      panel.onDisband = onDisband;
      panel.show(planet, platoons);
      panel.selectPlatoon(1);
      panel.handleDisband();

      expect(onDisband).toHaveBeenCalledWith(1);
    });

    it('should not fire onDisband when no platoon selected', () => {
      const onDisband = jest.fn();
      const planet = createMockPlanet();

      panel.onDisband = onDisband;
      panel.show(planet, []);
      panel.handleDisband();

      expect(onDisband).not.toHaveBeenCalled();
    });
  });

  describe('empty state (AC7)', () => {
    it('should indicate empty state when no platoons', () => {
      const planet = createMockPlanet();
      panel.show(planet, []);

      expect(panel.isEmpty()).toBe(true);
    });

    it('should not be empty when platoons exist', () => {
      const planet = createMockPlanet();
      const platoons = [createMockPlatoon(1, 'Alpha Squad', planet.id)];
      panel.show(planet, platoons);

      expect(panel.isEmpty()).toBe(false);
    });
  });

  describe('training status (AC8)', () => {
    it('should detect platoon in training', () => {
      const planet = createMockPlanet();
      const trainingPlatoon = createMockPlatoon(1, 'Alpha Squad', planet.id);
      trainingPlatoon.trainingLevel = 50;
      trainingPlatoon.trainingTurnsRemaining = 5;

      panel.show(planet, [trainingPlatoon]);
      panel.selectPlatoon(1);

      expect(panel.isSelectedPlatoonTraining()).toBe(true);
    });

    it('should detect fully trained platoon', () => {
      const planet = createMockPlanet();
      const trainedPlatoon = createMockPlatoon(1, 'Alpha Squad', planet.id);
      trainedPlatoon.trainingLevel = 100;
      trainedPlatoon.trainingTurnsRemaining = 0;

      panel.show(planet, [trainedPlatoon]);
      panel.selectPlatoon(1);

      expect(panel.isSelectedPlatoonTraining()).toBe(false);
    });
  });

  describe('platoon data access (AC4, AC6)', () => {
    it('should return selected platoon troop count', () => {
      const planet = createMockPlanet();
      const platoon = createMockPlatoon(1, 'Alpha Squad', planet.id);
      platoon.troopCount = 150;

      panel.show(planet, [platoon]);
      panel.selectPlatoon(1);

      expect(panel.getSelectedPlatoonTroopCount()).toBe(150);
    });

    it('should return selected platoon strength', () => {
      const planet = createMockPlanet();
      const platoon = createMockPlatoon(1, 'Alpha Squad', planet.id);
      platoon.strength = 250;

      panel.show(planet, [platoon]);
      panel.selectPlatoon(1);

      expect(panel.getSelectedPlatoonStrength()).toBe(250);
    });

    it('should return null for troop count when no selection', () => {
      const planet = createMockPlanet();
      panel.show(planet, []);

      expect(panel.getSelectedPlatoonTroopCount()).toBeNull();
    });
  });
});
