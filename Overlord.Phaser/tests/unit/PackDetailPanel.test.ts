/**
 * PackDetailPanel Tests
 * Story 9-1: Scenario Pack Browsing and Selection
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
        list: unknown[] = [];

        constructor(scene: unknown, x = 0, y = 0) {
          this.scene = scene;
          this.x = x;
          this.y = y;
        }

        add(child: unknown): this { this.list.push(child); return this; }
        removeAll(destroyChildren?: boolean): this { this.list = []; return this; }
        setPosition(x: number, y: number): this { this.x = x; this.y = y; return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setDepth(d: number): this { this.depth = d; return this; }
        setScrollFactor(): this { return this; }
        destroy(): void { this.list = []; }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
        fillRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRoundedRect(): this { return this; }
        clear(): this { return this; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        style: Record<string, unknown> = {};
        visible = true;

        constructor(_scene: unknown, x: number, y: number, text: string, style?: Record<string, unknown>) {
          this.x = x;
          this.y = y;
          this.text = text;
          this.style = style || {};
        }

        setText(t: string): this { this.text = t; return this; }
        setOrigin(): this { return this; }
        setWordWrapWidth(): this { return this; }
        setColor(c: string): this { this.style.color = c; return this; }
        setInteractive(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        x = 0;
        y = 0;
        visible = true;

        constructor(_scene: unknown, x: number, y: number, w: number, h: number) {
          this.x = x;
          this.y = y;
        }

        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        disableInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { PackDetailPanel } from '../../src/scenes/ui/PackDetailPanel';
import { ScenarioPack } from '../../src/core/models/ScenarioPackModels';
import { AIPersonality, AIDifficulty, PlanetType } from '../../src/core/models/Enums';

// Mock scene
const createMockScene = () => ({
  add: {
    existing: jest.fn(),
    graphics: jest.fn(() => new (jest.requireMock('phaser').default.GameObjects.Graphics)()),
    text: jest.fn((x: number, y: number, text: string, style?: Record<string, unknown>) =>
      new (jest.requireMock('phaser').default.GameObjects.Text)(null, x, y, text, style)),
    rectangle: jest.fn((x: number, y: number, w: number, h: number) =>
      new (jest.requireMock('phaser').default.GameObjects.Rectangle)(null, x, y, w, h)),
    container: jest.fn((x: number, y: number) =>
      new (jest.requireMock('phaser').default.GameObjects.Container)(null, x, y))
  },
  cameras: {
    main: {
      width: 1024,
      height: 768
    }
  }
});

describe('PackDetailPanel', () => {
  let scene: any;
  let panel: PackDetailPanel;
  let mockPack: ScenarioPack;

  beforeEach(() => {
    scene = createMockScene();

    mockPack = {
      id: 'default',
      name: 'Standard Campaign',
      version: '1.0.0',
      description: 'The classic Overlord experience with balanced gameplay.',
      faction: {
        name: 'Earth Federation',
        leader: 'Admiral Chen',
        lore: 'The original Earth forces, seeking to expand their galactic influence.',
        colorTheme: 0x4488ff
      },
      aiConfig: {
        personality: AIPersonality.Balanced,
        difficulty: AIDifficulty.Normal
      },
      galaxyTemplate: {
        planetCount: { min: 4, max: 6 },
        planetTypes: [PlanetType.Volcanic, PlanetType.Desert, PlanetType.Tropical, PlanetType.Metropolis],
        resourceAbundance: 'standard'
      },
      isDefault: true
    };

    panel = new PackDetailPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  test('should create panel', () => {
    expect(panel).toBeDefined();
    expect(panel.visible).toBe(false);
  });

  test('should set pack data', () => {
    panel.setPack(mockPack);
    expect(panel.getDisplayedPackId()).toBe('default');
  });

  test('should show panel', () => {
    panel.setPack(mockPack);
    panel.show();
    expect(panel.visible).toBe(true);
  });

  test('should hide panel', () => {
    panel.show();
    panel.hide();
    expect(panel.visible).toBe(false);
  });

  test('should trigger select callback for unlocked pack', () => {
    const mockCallback = jest.fn();
    panel.onSelectPack = mockCallback;
    panel.setPack(mockPack);

    panel.selectPack();

    expect(mockCallback).toHaveBeenCalledWith(mockPack);
  });

  test('should not trigger select callback for locked pack', () => {
    const mockCallback = jest.fn();
    panel.onSelectPack = mockCallback;

    const lockedPack: ScenarioPack = {
      ...mockPack,
      id: 'locked',
      unlockRequirements: [
        { type: 'scenario_complete', targetId: 'test', description: 'Complete test' }
      ]
    };
    panel.setPack(lockedPack);
    panel.setLocked(true);

    panel.selectPack();

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('should trigger back callback', () => {
    const mockCallback = jest.fn();
    panel.onBack = mockCallback;

    panel.goBack();

    expect(mockCallback).toHaveBeenCalled();
  });

  test('should display unlock requirements for locked pack', () => {
    const lockedPack: ScenarioPack = {
      ...mockPack,
      id: 'locked',
      unlockRequirements: [
        { type: 'scenario_complete', targetId: 'test', description: 'Complete test scenario' }
      ]
    };
    panel.setPack(lockedPack);
    panel.setLocked(true);

    const requirements = panel.getUnlockRequirements();
    expect(requirements).toHaveLength(1);
    expect(requirements[0].description).toBe('Complete test scenario');
  });

  test('should indicate if pack is active', () => {
    panel.setPack(mockPack);
    panel.setPackActive(true);

    expect(panel.isPackActive()).toBe(true);
  });

  test('should return pack metadata', () => {
    panel.setPack(mockPack);

    const metadata = panel.getPackMetadata();
    expect(metadata.name).toBe('Standard Campaign');
    expect(metadata.leader).toBe('Admiral Chen');
    expect(metadata.difficulty).toBe('Normal');
    expect(metadata.personality).toBe('Balanced');
  });
});
