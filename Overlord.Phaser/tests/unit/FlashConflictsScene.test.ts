/**
 * Tests for FlashConflictsScene
 * Story 1-1: Flash Conflicts Menu Access
 *
 * Tests verify the Flash Conflicts tutorial/scenario selection menu.
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
    }
  }
}));

import { FlashConflictsScene } from '../../src/scenes/FlashConflictsScene';

// Create mock scene
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
            on: jest.fn().mockReturnThis()
          };
          addedObjects.push(textObj);
          return textObj;
        }),
        graphics: jest.fn(() => {
          const gfx = {
            fillStyle: jest.fn().mockReturnThis(),
            fillRoundedRect: jest.fn().mockReturnThis(),
            lineStyle: jest.fn().mockReturnThis(),
            strokeRoundedRect: jest.fn().mockReturnThis(),
            clear: jest.fn().mockReturnThis()
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
        height: 768
      }
    },
    addedObjects
  };
}

describe('FlashConflictsScene', () => {
  let sceneInstance: FlashConflictsScene;
  let mockContext: ReturnType<typeof createMockSceneContext>;

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    sceneInstance = new FlashConflictsScene();
    mockContext = createMockSceneContext();
    // Assign mock properties to scene instance
    (sceneInstance as any).add = mockContext.scene.add;
    (sceneInstance as any).scene = mockContext.scene;
    (sceneInstance as any).cameras = mockContext.cameras;
  });

  describe('initialization', () => {
    test('should create scene', () => {
      expect(sceneInstance).toBeDefined();
    });
  });

  describe('create', () => {
    test('should create title text', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const titleCall = textCalls.find(call => call[2] === 'FLASH CONFLICTS');
      expect(titleCall).toBeDefined();
    });

    test('should create subtitle', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const subtitleCall = textCalls.find(call => call[2] === 'Tutorial Scenarios & Quick Combat');
      expect(subtitleCall).toBeDefined();
    });

    test('should show beginner badge on first visit', () => {
      localStorage.removeItem('flashConflicts_visited');
      // Recreate instance to reset first visit flag
      sceneInstance = new FlashConflictsScene();
      (sceneInstance as any).add = mockContext.scene.add;
      (sceneInstance as any).scene = mockContext.scene;
      (sceneInstance as any).cameras = mockContext.cameras;

      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const badgeCall = textCalls.find(call => call[2]?.includes('RECOMMENDED FOR BEGINNERS'));
      expect(badgeCall).toBeDefined();
    });

    test('should not show beginner badge on return visit', () => {
      localStorage.setItem('flashConflicts_visited', 'true');
      // Recreate instance
      sceneInstance = new FlashConflictsScene();
      (sceneInstance as any).add = mockContext.scene.add;
      (sceneInstance as any).scene = mockContext.scene;
      (sceneInstance as any).cameras = mockContext.cameras;

      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const badgeCall = textCalls.find(call => call[2]?.includes('RECOMMENDED FOR BEGINNERS'));
      expect(badgeCall).toBeUndefined();
    });

    test('should create placeholder scenarios', () => {
      sceneInstance.create();

      // Should have at least 4 scenario cards (from placeholder data)
      const zoneCalls = (mockContext.scene.add.zone as jest.Mock).mock.calls;
      expect(zoneCalls.length).toBeGreaterThanOrEqual(4);
    });

    test('should create back button', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const backButton = textCalls.find(call => call[2] === 'BACK TO MAIN MENU');
      expect(backButton).toBeDefined();
    });
  });

  describe('scenario cards', () => {
    test('should show tutorial scenarios', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const tutorialCard = textCalls.find(call => call[2] === 'Basic Combat Tutorial');
      expect(tutorialCard).toBeDefined();
    });

    test('should show tactical scenarios', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const tacticalCard = textCalls.find(call => call[2] === 'Defend the Colony');
      expect(tacticalCard).toBeDefined();
    });

    test('should display difficulty levels', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const easyDifficulty = textCalls.find(call => call[2] === 'EASY');
      const mediumDifficulty = textCalls.find(call => call[2] === 'MEDIUM');
      expect(easyDifficulty || mediumDifficulty).toBeDefined();
    });

    test('should display scenario durations', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const durationText = textCalls.find(call => call[2]?.includes('min'));
      expect(durationText).toBeDefined();
    });
  });

  describe('navigation', () => {
    test('should navigate back to main menu when back button clicked', () => {
      sceneInstance.create();

      const textCalls = (mockContext.scene.add.text as jest.Mock).mock.calls;
      const backButton = textCalls.find(call => call[2] === 'BACK TO MAIN MENU');
      expect(backButton).toBeDefined();

      // Find the pointerdown event handler
      const backButtonObj = (mockContext.scene.add.text as jest.Mock).mock.results
        .find(result => result.value.text === 'BACK TO MAIN MENU')?.value;

      if (backButtonObj) {
        const onCall = backButtonObj.on.mock.calls.find((call: unknown[]) => call[0] === 'pointerdown');
        if (onCall) {
          onCall[1](); // Trigger the click handler
          expect(mockContext.scene.start).toHaveBeenCalledWith('MainMenuScene');
        }
      }
    });
  });

  describe('localStorage', () => {
    test('should mark as visited on first load', () => {
      localStorage.removeItem('flashConflicts_visited');
      // Recreate instance
      sceneInstance = new FlashConflictsScene();
      (sceneInstance as any).add = mockContext.scene.add;
      (sceneInstance as any).scene = mockContext.scene;
      (sceneInstance as any).cameras = mockContext.cameras;

      sceneInstance.create();

      expect(localStorage.getItem('flashConflicts_visited')).toBe('true');
    });
  });
});
