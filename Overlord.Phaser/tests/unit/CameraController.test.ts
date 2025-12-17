/**
 * Unit tests for CameraController
 */

import { CameraController, GalaxyBounds } from '@scenes/controllers/CameraController';

// Mock Phaser camera
class MockCamera {
  public zoom: number = 1.0;
  public scrollX: number = 0;
  public scrollY: number = 0;
  public width: number = 800;
  public height: number = 600;

  centerOn(x: number, y: number): void {
    this.scrollX = x - this.width / 2 / this.zoom;
    this.scrollY = y - this.height / 2 / this.zoom;
  }

  setZoom(zoom: number): void {
    this.zoom = zoom;
  }
}

// Mock tween that immediately applies values
class MockTweenManager {
  add(config: { targets: MockCamera; zoom?: number; scrollX?: number; scrollY?: number }): void {
    if (config.zoom !== undefined) {
      config.targets.zoom = config.zoom;
    }
    if (config.scrollX !== undefined) {
      config.targets.scrollX = config.scrollX;
    }
    if (config.scrollY !== undefined) {
      config.targets.scrollY = config.scrollY;
    }
  }
}

// Mock input manager with event handlers
class MockInput {
  private handlers: Map<string, Array<(this: unknown, ...args: unknown[]) => void>> = new Map();

  on(event: string, handler: (...args: unknown[]) => void, context?: unknown): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler.bind(context));
  }

  off(event: string, _handler: (...args: unknown[]) => void, _context?: unknown): void {
    this.handlers.delete(event);
  }

  emit(event: string, ...args: unknown[]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(...args));
    }
  }

  // Returns empty array - no UI elements under pointer in tests
  hitTestPointer(_pointer: unknown): unknown[] {
    return [];
  }
}

// Mock Phaser scene
class MockScene {
  public cameras = {
    main: new MockCamera()
  };
  public input = new MockInput();
  public tweens = new MockTweenManager();
}

// Mock Phaser.Math.Clamp
const originalMath = (global as { Phaser?: { Math?: { Clamp?: (v: number, min: number, max: number) => number }; Geom?: { Rectangle?: new (x: number, y: number, w: number, h: number) => { x: number; y: number; width: number; height: number } } } }).Phaser;
beforeAll(() => {
  (global as { Phaser?: unknown }).Phaser = {
    Math: {
      Clamp: (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
    },
    Geom: {
      Rectangle: class {
        constructor(public x: number, public y: number, public width: number, public height: number) {}
      }
    }
  };
});

afterAll(() => {
  (global as { Phaser?: unknown }).Phaser = originalMath;
});

describe('CameraController', () => {
  let scene: MockScene;
  let controller: CameraController;
  const galaxyBounds: GalaxyBounds = {
    minX: -500,
    maxX: 500,
    minY: -500,
    maxY: 500
  };

  beforeEach(() => {
    scene = new MockScene();
    controller = new CameraController(scene as unknown as Phaser.Scene, galaxyBounds);
  });

  afterEach(() => {
    controller.destroy();
  });

  describe('Zoom Limits', () => {
    beforeEach(() => {
      controller.enableWheelZoom();
    });

    test('should clamp zoom to minimum limit (0.5)', () => {
      const pointer = { x: 400, y: 300 } as Phaser.Input.Pointer;

      // Zoom out many times (deltaY > 0)
      for (let i = 0; i < 20; i++) {
        scene.input.emit('wheel', pointer, [], 0, 100, 0);
      }

      expect(scene.cameras.main.zoom).toBeGreaterThanOrEqual(0.5);
    });

    test('should clamp zoom to maximum limit (2.0)', () => {
      const pointer = { x: 400, y: 300 } as Phaser.Input.Pointer;

      // Zoom in many times (deltaY < 0)
      for (let i = 0; i < 20; i++) {
        scene.input.emit('wheel', pointer, [], 0, -100, 0);
      }

      expect(scene.cameras.main.zoom).toBeLessThanOrEqual(2.0);
    });

    test('should respect custom zoom limits', () => {
      const customController = new CameraController(
        scene as unknown as Phaser.Scene,
        galaxyBounds,
        { zoomMin: 0.75, zoomMax: 1.5 }
      );
      customController.enableWheelZoom();

      const pointer = { x: 400, y: 300 } as Phaser.Input.Pointer;

      // Zoom out
      for (let i = 0; i < 10; i++) {
        scene.input.emit('wheel', pointer, [], 0, 100, 0);
      }
      expect(scene.cameras.main.zoom).toBeGreaterThanOrEqual(0.75);

      // Reset and zoom in
      scene.cameras.main.zoom = 1.0;
      for (let i = 0; i < 10; i++) {
        scene.input.emit('wheel', pointer, [], 0, -100, 0);
      }
      expect(scene.cameras.main.zoom).toBeLessThanOrEqual(1.5);

      customController.destroy();
    });
  });

  describe('Center Position', () => {
    test('should center camera on position without smooth', () => {
      controller.centerOn(200, 300, false);

      const expectedX = 200 - scene.cameras.main.width / 2;
      const expectedY = 300 - scene.cameras.main.height / 2;

      expect(scene.cameras.main.scrollX).toBe(expectedX);
      expect(scene.cameras.main.scrollY).toBe(expectedY);
    });

    test('should center camera on position with smooth animation', () => {
      controller.centerOn(200, 300, true);

      // Mock tween applies immediately
      const expectedX = 200 - scene.cameras.main.width / 2;
      const expectedY = 300 - scene.cameras.main.height / 2;

      expect(scene.cameras.main.scrollX).toBe(expectedX);
      expect(scene.cameras.main.scrollY).toBe(expectedY);
    });
  });

  describe('Reset View', () => {
    test('should reset to home position with default zoom', () => {
      controller.setHomePosition(100, 200, 1.0);

      // Move camera somewhere else
      scene.cameras.main.scrollX = 500;
      scene.cameras.main.scrollY = 500;
      scene.cameras.main.zoom = 1.8;

      controller.resetView(false);

      const expectedX = 100 - scene.cameras.main.width / 2;
      const expectedY = 200 - scene.cameras.main.height / 2;

      expect(scene.cameras.main.zoom).toBe(1.0);
      expect(scene.cameras.main.scrollX).toBe(expectedX);
      expect(scene.cameras.main.scrollY).toBe(expectedY);
    });

    test('should reset smoothly when requested', () => {
      controller.setHomePosition(100, 200, 1.0);

      scene.cameras.main.zoom = 1.5;
      controller.resetView(true);

      // Mock tween applies immediately
      expect(scene.cameras.main.zoom).toBe(1.0);
    });
  });

  describe('Visible Bounds', () => {
    test('should calculate visible bounds at zoom 1.0', () => {
      scene.cameras.main.zoom = 1.0;
      scene.cameras.main.scrollX = 100;
      scene.cameras.main.scrollY = 200;

      const bounds = controller.getVisibleBounds();

      expect(bounds.x).toBe(100);
      expect(bounds.y).toBe(200);
      expect(bounds.width).toBe(800);
      expect(bounds.height).toBe(600);
    });

    test('should calculate visible bounds at zoom 2.0', () => {
      scene.cameras.main.zoom = 2.0;
      scene.cameras.main.scrollX = 100;
      scene.cameras.main.scrollY = 200;

      const bounds = controller.getVisibleBounds();

      expect(bounds.x).toBe(100);
      expect(bounds.y).toBe(200);
      expect(bounds.width).toBe(400); // 800 / 2
      expect(bounds.height).toBe(300); // 600 / 2
    });

    test('should check if position is visible', () => {
      scene.cameras.main.zoom = 1.0;
      scene.cameras.main.scrollX = 0;
      scene.cameras.main.scrollY = 0;

      // Center is visible
      expect(controller.isVisible(400, 300)).toBe(true);

      // Outside is not visible
      expect(controller.isVisible(1000, 1000)).toBe(false);

      // Edge is visible
      expect(controller.isVisible(10, 10)).toBe(true);
    });

    test('should check visibility with margin', () => {
      scene.cameras.main.zoom = 1.0;
      scene.cameras.main.scrollX = 0;
      scene.cameras.main.scrollY = 0;

      // Edge with margin check
      expect(controller.isVisible(10, 10, 50)).toBe(false);
      expect(controller.isVisible(100, 100, 50)).toBe(true);
    });
  });

  describe('Drag Pan', () => {
    beforeEach(() => {
      controller.enableDragPan();
    });

    test('should track drag state', () => {
      expect(controller.getIsDragging()).toBe(false);

      // Start drag
      const downPointer = { x: 400, y: 300, leftButtonDown: () => true } as Phaser.Input.Pointer;
      scene.input.emit('pointerdown', downPointer);

      // Not yet dragging (below threshold)
      expect(controller.getIsDragging()).toBe(false);

      // Move past threshold
      const movePointer = { x: 420, y: 320 } as Phaser.Input.Pointer;
      scene.input.emit('pointermove', movePointer);

      expect(controller.getIsDragging()).toBe(true);

      // End drag
      scene.input.emit('pointerup');
      expect(controller.getIsDragging()).toBe(false);
    });

    test('should update camera position during drag', () => {
      const initialScrollX = scene.cameras.main.scrollX;
      const initialScrollY = scene.cameras.main.scrollY;

      // Start drag
      const downPointer = { x: 400, y: 300, leftButtonDown: () => true } as Phaser.Input.Pointer;
      scene.input.emit('pointerdown', downPointer);

      // Move past threshold (move left, camera scrolls right)
      const movePointer = { x: 350, y: 250 } as Phaser.Input.Pointer;
      scene.input.emit('pointermove', movePointer);

      expect(scene.cameras.main.scrollX).toBeGreaterThan(initialScrollX);
      expect(scene.cameras.main.scrollY).toBeGreaterThan(initialScrollY);
    });

    test('should not drag with small movements', () => {
      const initialScrollX = scene.cameras.main.scrollX;
      const initialScrollY = scene.cameras.main.scrollY;

      const downPointer = { x: 400, y: 300, leftButtonDown: () => true } as Phaser.Input.Pointer;
      scene.input.emit('pointerdown', downPointer);

      // Small move (below 5px threshold)
      const movePointer = { x: 402, y: 301 } as Phaser.Input.Pointer;
      scene.input.emit('pointermove', movePointer);

      expect(scene.cameras.main.scrollX).toBe(initialScrollX);
      expect(scene.cameras.main.scrollY).toBe(initialScrollY);
      expect(controller.getIsDragging()).toBe(false);
    });
  });

  describe('Wheel Zoom', () => {
    beforeEach(() => {
      controller.enableWheelZoom();
    });

    test('should zoom in on wheel scroll up', () => {
      const initialZoom = scene.cameras.main.zoom;
      const pointer = { x: 400, y: 300 } as Phaser.Input.Pointer;

      // deltaY < 0 = scroll up = zoom in
      scene.input.emit('wheel', pointer, [], 0, -100, 0);

      expect(scene.cameras.main.zoom).toBeGreaterThan(initialZoom);
    });

    test('should zoom out on wheel scroll down', () => {
      const initialZoom = scene.cameras.main.zoom;
      const pointer = { x: 400, y: 300 } as Phaser.Input.Pointer;

      // deltaY > 0 = scroll down = zoom out
      scene.input.emit('wheel', pointer, [], 0, 100, 0);

      expect(scene.cameras.main.zoom).toBeLessThan(initialZoom);
    });

    test('should keep cursor world position stable during zoom', () => {
      // Setup: Camera at specific position, zoom 1.0
      scene.cameras.main.scrollX = 100;
      scene.cameras.main.scrollY = 200;
      scene.cameras.main.zoom = 1.0;

      // Cursor at off-center position (not camera center)
      const pointer = { x: 200, y: 150 } as Phaser.Input.Pointer;

      // Calculate world position under cursor BEFORE zoom
      const worldXBefore = scene.cameras.main.scrollX + pointer.x / scene.cameras.main.zoom;
      const worldYBefore = scene.cameras.main.scrollY + pointer.y / scene.cameras.main.zoom;

      // Zoom in
      scene.input.emit('wheel', pointer, [], 0, -100, 0);

      // Calculate world position under cursor AFTER zoom
      const worldXAfter = scene.cameras.main.scrollX + pointer.x / scene.cameras.main.zoom;
      const worldYAfter = scene.cameras.main.scrollY + pointer.y / scene.cameras.main.zoom;

      // World coordinates under cursor should remain stable (within floating point tolerance)
      expect(Math.abs(worldXAfter - worldXBefore)).toBeLessThan(0.01);
      expect(Math.abs(worldYAfter - worldYBefore)).toBeLessThan(0.01);
    });
  });

  describe('Auto-pan', () => {
    test('should pan to position if not visible', () => {
      scene.cameras.main.scrollX = 0;
      scene.cameras.main.scrollY = 0;
      scene.cameras.main.zoom = 1.0;

      // Position far outside
      controller.panToIfNotVisible(2000, 2000);

      // Should have panned (tween applies immediately in mock)
      const expectedX = 2000 - scene.cameras.main.width / 2;
      const expectedY = 2000 - scene.cameras.main.height / 2;

      expect(scene.cameras.main.scrollX).toBe(expectedX);
      expect(scene.cameras.main.scrollY).toBe(expectedY);
    });

    test('should not pan if position is visible', () => {
      scene.cameras.main.scrollX = 0;
      scene.cameras.main.scrollY = 0;
      scene.cameras.main.zoom = 1.0;

      const initialScrollX = scene.cameras.main.scrollX;
      const initialScrollY = scene.cameras.main.scrollY;

      // Center of viewport is visible
      controller.panToIfNotVisible(400, 300);

      expect(scene.cameras.main.scrollX).toBe(initialScrollX);
      expect(scene.cameras.main.scrollY).toBe(initialScrollY);
    });
  });

  describe('Zoom API', () => {
    test('should get current zoom level', () => {
      scene.cameras.main.zoom = 1.5;
      expect(controller.getZoom()).toBe(1.5);
    });

    test('should set zoom level with clamping', () => {
      controller.setZoom(3.0, false);
      expect(scene.cameras.main.zoom).toBe(2.0); // Clamped to max

      controller.setZoom(0.1, false);
      expect(scene.cameras.main.zoom).toBe(0.5); // Clamped to min
    });

    test('should return galaxy bounds', () => {
      const bounds = controller.getGalaxyBounds();
      expect(bounds.minX).toBe(-500);
      expect(bounds.maxX).toBe(500);
      expect(bounds.minY).toBe(-500);
      expect(bounds.maxY).toBe(500);
    });
  });

  describe('Cleanup', () => {
    test('should clean up event listeners on destroy', () => {
      controller.enableDragPan();
      controller.enableWheelZoom();

      controller.destroy();

      // Should not crash when events fire after destroy
      const pointer = { x: 400, y: 300, leftButtonDown: () => true } as Phaser.Input.Pointer;
      scene.input.emit('pointerdown', pointer);
      scene.input.emit('wheel', pointer, [], 0, -100, 0);

      expect(controller.getIsDragging()).toBe(false);
    });
  });
});
