/**
 * PackSwitchDialog Tests
 * Story 9-2: Scenario Pack Switching and Configuration Loading
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
        removeAll(): this { this.list = []; return this; }
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
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { PackSwitchDialog } from '../../src/scenes/ui/PackSwitchDialog';

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

describe('PackSwitchDialog', () => {
  let scene: any;
  let dialog: PackSwitchDialog;

  beforeEach(() => {
    scene = createMockScene();
    dialog = new PackSwitchDialog(scene);
  });

  afterEach(() => {
    dialog.destroy();
  });

  test('should create dialog', () => {
    expect(dialog).toBeDefined();
    expect(dialog.visible).toBe(false);
  });

  test('should show dialog with pack name', () => {
    dialog.show('Aggressive Pack');
    expect(dialog.visible).toBe(true);
  });

  test('should hide dialog', () => {
    dialog.show('Test Pack');
    dialog.hide();
    expect(dialog.visible).toBe(false);
  });

  test('should trigger confirm callback', () => {
    const mockCallback = jest.fn();
    dialog.onConfirm = mockCallback;
    dialog.show('Test Pack');

    dialog.confirm();

    expect(mockCallback).toHaveBeenCalled();
    expect(dialog.visible).toBe(false);
  });

  test('should trigger cancel callback', () => {
    const mockCallback = jest.fn();
    dialog.onCancel = mockCallback;
    dialog.show('Test Pack');

    dialog.cancel();

    expect(mockCallback).toHaveBeenCalled();
    expect(dialog.visible).toBe(false);
  });

  test('should show warning about active campaigns', () => {
    dialog.setHasActiveCampaign(true);
    const hasWarning = dialog.hasWarning();
    expect(hasWarning).toBe(true);
  });

  test('should not show warning when no active campaigns', () => {
    dialog.setHasActiveCampaign(false);
    const hasWarning = dialog.hasWarning();
    expect(hasWarning).toBe(false);
  });

  test('should get current pack name', () => {
    dialog.show('My Pack');
    expect(dialog.getPackName()).toBe('My Pack');
  });
});
