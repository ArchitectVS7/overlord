/**
 * PackListPanel Tests
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

import { PackListPanel } from '../../src/scenes/ui/PackListPanel';
import { PackDisplayData } from '../../src/core/models/ScenarioPackModels';
import { AIPersonality } from '../../src/core/models/Enums';

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

describe('PackListPanel', () => {
  let scene: any;
  let panel: PackListPanel;
  let mockPacks: PackDisplayData[];

  beforeEach(() => {
    scene = createMockScene();

    mockPacks = [
      {
        id: 'default',
        name: 'Standard Campaign',
        factionLeader: 'Admiral Chen',
        difficulty: 'normal',
        aiPersonality: AIPersonality.Balanced,
        planetCount: '4-6 planets',
        resourceAbundance: 'standard',
        colorTheme: 0x4488ff,
        isLocked: false,
        isActive: true
      },
      {
        id: 'aggressive',
        name: 'Warlord Challenge',
        factionLeader: 'Commander Kratos',
        difficulty: 'hard',
        aiPersonality: AIPersonality.Aggressive,
        planetCount: '3-5 planets',
        resourceAbundance: 'scarce',
        colorTheme: 0xff4444,
        isLocked: false,
        isActive: false
      },
      {
        id: 'locked',
        name: 'Expert Campaign',
        factionLeader: 'Unknown',
        difficulty: 'hard',
        aiPersonality: AIPersonality.Balanced,
        planetCount: '5-8 planets',
        resourceAbundance: 'standard',
        colorTheme: 0x888888,
        isLocked: true,
        isActive: false
      }
    ];

    panel = new PackListPanel(scene);
  });

  afterEach(() => {
    panel.destroy();
  });

  test('should create panel', () => {
    expect(panel).toBeDefined();
    expect(panel.visible).toBe(false); // Initially hidden
  });

  test('should set packs data', () => {
    panel.setPacks(mockPacks);
    expect(panel.getPackCount()).toBe(3);
  });

  test('should show panel', () => {
    panel.show();
    expect(panel.visible).toBe(true);
  });

  test('should hide panel', () => {
    panel.show();
    panel.hide();
    expect(panel.visible).toBe(false);
  });

  test('should track selected pack', () => {
    panel.setPacks(mockPacks);
    expect(panel.getSelectedPackId()).toBeNull();

    panel.selectPack('aggressive');
    expect(panel.getSelectedPackId()).toBe('aggressive');
  });

  test('should trigger selection callback', () => {
    const mockCallback = jest.fn();
    panel.onPackSelected = mockCallback;
    panel.setPacks(mockPacks);

    panel.selectPack('aggressive');

    expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({
      id: 'aggressive',
      name: 'Warlord Challenge'
    }));
  });

  test('should not select locked packs', () => {
    const mockCallback = jest.fn();
    panel.onPackSelected = mockCallback;
    panel.setPacks(mockPacks);

    panel.selectPack('locked');

    expect(mockCallback).not.toHaveBeenCalled();
    expect(panel.getSelectedPackId()).toBeNull();
  });

  test('should filter by difficulty', () => {
    panel.setPacks(mockPacks);
    panel.setDifficultyFilter('hard');

    const visiblePacks = panel.getFilteredPacks();
    expect(visiblePacks.length).toBe(2); // aggressive and locked
    expect(visiblePacks.every(p => p.difficulty === 'hard')).toBe(true);
  });

  test('should filter by AI personality', () => {
    panel.setPacks(mockPacks);
    panel.setPersonalityFilter(AIPersonality.Aggressive);

    const visiblePacks = panel.getFilteredPacks();
    expect(visiblePacks.length).toBe(1);
    expect(visiblePacks[0].id).toBe('aggressive');
  });

  test('should clear filters', () => {
    panel.setPacks(mockPacks);
    panel.setDifficultyFilter('hard');
    panel.clearFilters();

    const visiblePacks = panel.getFilteredPacks();
    expect(visiblePacks.length).toBe(3);
  });

  test('should sort packs with active first', () => {
    panel.setPacks(mockPacks);
    const sorted = panel.getSortedPacks();

    // Active pack should be first
    expect(sorted[0].isActive).toBe(true);
  });
});
