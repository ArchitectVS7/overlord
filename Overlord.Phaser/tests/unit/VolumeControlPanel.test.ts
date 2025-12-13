/**
 * VolumeControlPanel Tests
 * Story 12-3: Independent Volume Controls
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
        width = 0;
        height = 0;
        visible = true;
        fillColor = 0;

        constructor(_scene: unknown, x: number, y: number, w: number, h: number) {
          this.x = x;
          this.y = y;
          this.width = w;
          this.height = h;
        }

        setOrigin(): this { return this; }
        setInteractive(): this { return this; }
        disableInteractive(): this { return this; }
        setScrollFactor(): this { return this; }
        setDepth(): this { return this; }
        setVisible(v: boolean): this { this.visible = v; return this; }
        setFillStyle(color: number): this { this.fillColor = color; return this; }
        on(): this { return this; }
        destroy(): void {}
      }
    }
  }
}));

import { VolumeControlPanel } from '../../src/scenes/ui/VolumeControlPanel';
import { AudioManager, resetAudioManager } from '../../src/core/AudioManager';

// Mock localStorage
const mockStorage: Record<string, string> = {};
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => mockStorage[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
    clear: jest.fn(() => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); })
  }
});

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

describe('VolumeControlPanel', () => {
  let scene: ReturnType<typeof createMockScene>;
  let panel: VolumeControlPanel;
  let audioManager: AudioManager;

  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    jest.clearAllMocks();
    resetAudioManager();

    scene = createMockScene();
    audioManager = AudioManager.getInstance();
    panel = new VolumeControlPanel(scene as unknown as Phaser.Scene);
  });

  afterEach(() => {
    panel.destroy();
    resetAudioManager();
  });

  describe('creation', () => {
    test('should create panel', () => {
      expect(panel).toBeDefined();
    });

    test('should be hidden by default', () => {
      expect(panel.visible).toBe(false);
    });

    test('should have title', () => {
      expect(panel.getTitle()).toBe('Audio Settings');
    });
  });

  describe('visibility', () => {
    test('should show panel', () => {
      panel.show();
      expect(panel.visible).toBe(true);
    });

    test('should hide panel', () => {
      panel.show();
      panel.hide();
      expect(panel.visible).toBe(false);
    });
  });

  describe('volume sliders', () => {
    test('should have master volume slider', () => {
      expect(panel.hasMasterVolumeSlider()).toBe(true);
    });

    test('should have SFX volume slider', () => {
      expect(panel.hasSfxVolumeSlider()).toBe(true);
    });

    test('should have music volume slider', () => {
      expect(panel.hasMusicVolumeSlider()).toBe(true);
    });

    test('should reflect AudioManager master volume', () => {
      audioManager.setMasterVolume(75);
      panel.refresh();
      expect(panel.getMasterVolumeValue()).toBe(75);
    });

    test('should reflect AudioManager SFX volume', () => {
      audioManager.setSfxVolume(60);
      panel.refresh();
      expect(panel.getSfxVolumeValue()).toBe(60);
    });

    test('should reflect AudioManager music volume', () => {
      audioManager.setMusicVolume(40);
      panel.refresh();
      expect(panel.getMusicVolumeValue()).toBe(40);
    });

    test('should update AudioManager when master slider changes', () => {
      panel.setMasterVolume(80);
      expect(audioManager.getMasterVolume()).toBe(80);
    });

    test('should update AudioManager when SFX slider changes', () => {
      panel.setSfxVolume(55);
      expect(audioManager.getSfxVolume()).toBe(55);
    });

    test('should update AudioManager when music slider changes', () => {
      panel.setMusicVolume(30);
      expect(audioManager.getMusicVolume()).toBe(30);
    });
  });

  describe('mute toggle', () => {
    test('should have mute toggle', () => {
      expect(panel.hasMuteToggle()).toBe(true);
    });

    test('should reflect AudioManager mute state', () => {
      audioManager.mute();
      panel.refresh();
      expect(panel.isMuted()).toBe(true);
    });

    test('should toggle mute state', () => {
      expect(panel.isMuted()).toBe(false);
      panel.toggleMute();
      expect(audioManager.isMuted()).toBe(true);
    });

    test('should update when AudioManager mute changes', () => {
      audioManager.mute();
      panel.refresh();
      expect(panel.isMuted()).toBe(true);
      audioManager.unmute();
      panel.refresh();
      expect(panel.isMuted()).toBe(false);
    });
  });

  describe('volume labels', () => {
    test('should display master volume percentage', () => {
      audioManager.setMasterVolume(75);
      panel.refresh();
      expect(panel.getMasterVolumeLabel()).toBe('75%');
    });

    test('should display SFX volume percentage', () => {
      audioManager.setSfxVolume(50);
      panel.refresh();
      expect(panel.getSfxVolumeLabel()).toBe('50%');
    });

    test('should display music volume percentage', () => {
      audioManager.setMusicVolume(25);
      panel.refresh();
      expect(panel.getMusicVolumeLabel()).toBe('25%');
    });
  });

  describe('mute indicator', () => {
    test('should show muted indicator when muted', () => {
      panel.toggleMute();
      expect(panel.getMuteIndicatorText()).toBe('Audio Muted');
    });

    test('should not show muted indicator when unmuted', () => {
      expect(panel.getMuteIndicatorText()).toBe('');
    });
  });

  describe('callbacks', () => {
    test('should trigger callback on volume change', () => {
      const callback = jest.fn();
      panel.onVolumeChanged = callback;
      panel.setMasterVolume(60);
      expect(callback).toHaveBeenCalledWith('master', 60);
    });

    test('should trigger callback on mute toggle', () => {
      const callback = jest.fn();
      panel.onMuteToggled = callback;
      panel.toggleMute();
      expect(callback).toHaveBeenCalledWith(true);
    });
  });

  describe('save settings', () => {
    test('should save settings to AudioManager', () => {
      panel.setMasterVolume(70);
      panel.setSfxVolume(50);
      panel.setMusicVolume(30);
      panel.saveSettings();

      // Settings should be persisted
      expect(audioManager.getMasterVolume()).toBe(70);
      expect(audioManager.getSfxVolume()).toBe(50);
      expect(audioManager.getMusicVolume()).toBe(30);
    });
  });
});
