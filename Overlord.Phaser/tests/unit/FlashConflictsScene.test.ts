/**
 * Tests for FlashConflictsScene
 * Story 1-1: Flash Conflicts Menu Access
 * Story 1-2: Scenario Selection Interface
 *
 * Tests verify the Flash Conflicts entry point scene with integrated
 * ScenarioListPanel and ScenarioDetailPanel.
 */

// Mock Phaser before imports
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Scene: class MockScene {
      key: string;
      constructor(config: { key: string }) {
        this.key = config.key;
      }
    },
    GameObjects: {
      Container: class MockContainer {
        scene: unknown;
        x = 0;
        y = 0;
        visible = true;
        depth = 0;
        list: unknown[] = [];
        data: Map<string, unknown> = new Map();

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
        setData(key: string, value: unknown): this { this.data.set(key, value); return this; }
        getData(key: string): unknown { return this.data.get(key); }
        destroy(): void { this.list = []; this.data.clear(); }
      },
      Graphics: class MockGraphics {
        fillStyle(): this { return this; }
        fillRoundedRect(): this { return this; }
        fillRect(): this { return this; }
        lineStyle(): this { return this; }
        strokeRoundedRect(): this { return this; }
        strokeRect(): this { return this; }
        clear(): this { return this; }
        createGeometryMask(): { destroy: () => void } { return { destroy: jest.fn() }; }
        destroy(): void {}
      },
      Text: class MockText {
        x = 0;
        y = 0;
        text = '';
        constructor(_scene: unknown, x: number, y: number, text: string) {
          this.x = x;
          this.y = y;
          this.text = text;
        }
        setText(t: string): this { this.text = t; return this; }
        setOrigin(): this { return this; }
        setColor(): this { return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      },
      Rectangle: class MockRectangle {
        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      },
      Zone: class MockZone {
        setInteractive(): this { return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { FlashConflictsScene } from '../../src/scenes/FlashConflictsScene';

// Create mock scene context
function createMockSceneContext() {
  const addedObjects: unknown[] = [];

  return {
    scene: {
      add: {
        text: jest.fn((x: number, y: number, text: string, style?: unknown) => {
          const textObj = {
            x, y, text, style,
            setOrigin: jest.fn().mockReturnThis(),
            setInteractive: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis()
          };
          addedObjects.push(textObj);
          return textObj;
        }),
        container: jest.fn((x: number, y: number) => {
          const containerData = new Map<string, unknown>();
          const container = {
            x, y,
            y_local: y,
            add: jest.fn().mockReturnThis(),
            setVisible: jest.fn().mockReturnThis(),
            setDepth: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setPosition: jest.fn().mockReturnThis(),
            setMask: jest.fn().mockReturnThis(),
            setInteractive: jest.fn().mockReturnThis(),
            setData: jest.fn((key: string, value: unknown) => { containerData.set(key, value); return container; }),
            getData: jest.fn((key: string) => containerData.get(key)),
            on: jest.fn().mockReturnThis(),
            destroy: jest.fn()
          };
          addedObjects.push(container);
          return container;
        }),
        existing: jest.fn().mockReturnValue(undefined),
        rectangle: jest.fn(() => {
          return {
            setOrigin: jest.fn().mockReturnThis(),
            setInteractive: jest.fn().mockReturnThis(),
            setScrollFactor: jest.fn().mockReturnThis(),
            setDepth: jest.fn().mockReturnThis(),
            setVisible: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis()
          };
        }),
        graphics: jest.fn(() => {
          const gfx = {
            fillStyle: jest.fn().mockReturnThis(),
            fillRoundedRect: jest.fn().mockReturnThis(),
            fillRect: jest.fn().mockReturnThis(),
            lineStyle: jest.fn().mockReturnThis(),
            strokeRoundedRect: jest.fn().mockReturnThis(),
            strokeRect: jest.fn().mockReturnThis(),
            clear: jest.fn().mockReturnThis(),
            createGeometryMask: jest.fn().mockReturnValue({ destroy: jest.fn() })
          };
          addedObjects.push(gfx);
          return gfx;
        }),
        zone: jest.fn(() => {
          const zone = {
            setInteractive: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis()
          };
          addedObjects.push(zone);
          return zone;
        })
      },
      start: jest.fn()
    },
    cameras: {
      main: {
        width: 1024,
        height: 768,
        centerX: 512,
        centerY: 384,
        setBackgroundColor: jest.fn()
      }
    },
    input: {
      on: jest.fn().mockReturnThis(),
      off: jest.fn().mockReturnThis()
    },
    tweens: {
      add: jest.fn((config) => {
        if (config.onComplete) config.onComplete();
        return { stop: jest.fn() };
      }),
      killTweensOf: jest.fn()
    },
    addedObjects
  };
}

describe('FlashConflictsScene', () => {
  let sceneInstance: FlashConflictsScene;
  let mockContext: ReturnType<typeof createMockSceneContext>;

  beforeEach(() => {
    sceneInstance = new FlashConflictsScene();
    mockContext = createMockSceneContext();
    // Assign mock properties to scene instance
    (sceneInstance as any).add = mockContext.scene.add;
    (sceneInstance as any).scene = mockContext.scene;
    (sceneInstance as any).cameras = mockContext.cameras;
    (sceneInstance as any).input = mockContext.input;
    (sceneInstance as any).tweens = mockContext.tweens;
  });

  describe('initialization', () => {
    test('should create scene with correct key', () => {
      expect(sceneInstance).toBeDefined();
      expect((sceneInstance as any).key).toBe('FlashConflictsScene');
    });
  });

  describe('create', () => {
    test('should set background color', () => {
      sceneInstance.create();
      expect(mockContext.cameras.main.setBackgroundColor).toHaveBeenCalledWith('#0a0a1a');
    });

    test('should create title text', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const titleCall = textCalls.find(call => call[2] === 'Flash Conflicts');
      expect(titleCall).toBeDefined();
    });

    test('should create title at correct position', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const titleCall = textCalls.find(call => call[2] === 'Flash Conflicts');
      expect(titleCall).toBeDefined();
      expect(titleCall[0]).toBe(512); // centerX
      expect(titleCall[1]).toBe(50);  // y position
    });

    test('should create ScenarioListPanel', () => {
      sceneInstance.create();

      // ScenarioListPanel creates containers for its UI
      const containerCalls = (mockContext.scene.add.container as jest.Mock).mock.calls;
      expect(containerCalls.length).toBeGreaterThan(0);
    });

    test('should create ScenarioDetailPanel', () => {
      sceneInstance.create();

      // Both panels create multiple containers
      const containerCalls = (mockContext.scene.add.container as jest.Mock).mock.calls;
      expect(containerCalls.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('panels integration', () => {
    test('should initialize scenario manager', () => {
      sceneInstance.create();

      // After create, scenarioManager should be initialized
      expect((sceneInstance as any).scenarioManager).toBeDefined();
    });

    test('should have listPanel accessible', () => {
      sceneInstance.create();

      expect((sceneInstance as any).listPanel).toBeDefined();
    });

    test('should have detailPanel accessible', () => {
      sceneInstance.create();

      expect((sceneInstance as any).detailPanel).toBeDefined();
    });
  });
});
