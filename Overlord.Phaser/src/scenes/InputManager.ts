/**
 * Phaser integration layer for InputSystem
 * Wraps Phaser.Input for keyboard and mouse, forwards events to InputSystem
 */

import Phaser from 'phaser';
import { InputSystem } from '@core/InputSystem';
import type { KeyboardShortcut } from '@core/models/InputModels';

interface VisualConfig {
  hoverTint: number;
  focusBorderColor: number;
  focusBorderWidth: number;
  defaultCursor: string;
  hoverCursor: string;
}

export class InputManager {
  private scene: Phaser.Scene;
  private inputSystem: InputSystem;
  private visualConfig: VisualConfig;

  private interactiveObjects: Map<string, Phaser.GameObjects.GameObject> = new Map();
  private focusGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map();
  private originalTints: Map<string, number> = new Map();

  constructor(
    scene: Phaser.Scene,
    inputSystem: InputSystem,
    visualConfig: Partial<VisualConfig> = {},
  ) {
    this.scene = scene;
    this.inputSystem = inputSystem;

    this.visualConfig = {
      hoverTint: 0xcccccc,
      focusBorderColor: 0x00bfff,
      focusBorderWidth: 3,
      defaultCursor: 'default',
      hoverCursor: 'pointer',
      ...visualConfig,
    };

    this.setupKeyboardListeners();
    this.setupInputSystemCallbacks();
  }

  private setupKeyboardListeners(): void {
    if (!this.scene.input.keyboard) {
      return;
    }

    // Tab navigation
    this.scene.input.keyboard.on('keydown-TAB', (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.shiftKey) {
        this.inputSystem.focusPrevious();
      } else {
        this.inputSystem.focusNext();
      }
    });

    // Enter/Space activation
    this.scene.input.keyboard.on('keydown-ENTER', (event: KeyboardEvent) => {
      event.preventDefault();
      this.inputSystem.activateFocused('keyboard');
    });

    this.scene.input.keyboard.on('keydown-SPACE', (event: KeyboardEvent) => {
      event.preventDefault();
      this.inputSystem.activateFocused('keyboard');
    });

    // Generic keydown for shortcuts
    this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      // Skip Tab, Enter, Space (handled separately)
      if (['Tab', 'Enter', ' '].includes(event.key)) {
        return;
      }

      const triggered = this.inputSystem.triggerShortcut(
        event.key,
        {
          ctrl: event.ctrlKey || event.metaKey,
          shift: event.shiftKey,
          alt: event.altKey,
        },
        Date.now(),
      );

      // Prevent browser default behavior for registered shortcuts
      if (triggered) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  private setupInputSystemCallbacks(): void {
    this.inputSystem.setCallbacks({
      onFocusChanged: (elementId) => {
        this.updateFocusVisuals(elementId);
      },
      onHoverChanged: (elementId) => {
        this.updateHoverVisuals(elementId);
      },
    });
  }

  /**
   * Register a game object as interactive
   */
  public registerInteractive(
    id: string,
    gameObject: Phaser.GameObjects.GameObject,
    order: number = 0,
  ): void {
    this.inputSystem.registerFocusableElement({
      id,
      order,
      enabled: true,
    });

    this.interactiveObjects.set(id, gameObject);

    if ('setInteractive' in gameObject) {
      (gameObject as any).setInteractive({ useHandCursor: true });

      gameObject.on('pointerover', () => {
        this.inputSystem.setHover(id);
        this.scene.input.setDefaultCursor(this.visualConfig.hoverCursor);
      });

      gameObject.on('pointerout', () => {
        this.inputSystem.setHover(null);
        this.scene.input.setDefaultCursor(this.visualConfig.defaultCursor);
      });

      gameObject.on('pointerdown', () => {
        this.inputSystem.setFocus(id);
        this.inputSystem.activateElement(id, 'mouse');
      });

      if ('tint' in gameObject) {
        this.originalTints.set(id, (gameObject as any).tint || 0xffffff);
      }
    }
  }

  /**
   * Unregister an interactive element
   */
  public unregisterInteractive(id: string): void {
    this.inputSystem.unregisterFocusableElement(id);

    const obj = this.interactiveObjects.get(id);
    if (obj) {
      obj.removeAllListeners();
    }

    this.interactiveObjects.delete(id);
    this.originalTints.delete(id);

    const focusGraphic = this.focusGraphics.get(id);
    if (focusGraphic) {
      focusGraphic.destroy();
      this.focusGraphics.delete(id);
    }
  }

  /**
   * Set element enabled state
   */
  public setElementEnabled(id: string, enabled: boolean): void {
    this.inputSystem.setElementEnabled(id, enabled);

    const obj = this.interactiveObjects.get(id);
    if (obj && 'setInteractive' in obj) {
      if (enabled) {
        (obj as any).setInteractive({ useHandCursor: true });
      } else {
        (obj as any).disableInteractive();
        this.clearElementVisuals(id);
      }
    }
  }

  /**
   * Register a keyboard shortcut
   */
  public registerShortcut(shortcut: KeyboardShortcut): string {
    return this.inputSystem.registerShortcut(shortcut);
  }

  private updateFocusVisuals(elementId: string | null): void {
    // Clear all focus borders
    for (const graphic of this.focusGraphics.values()) {
      graphic.clear();
    }

    if (elementId === null) {
      return;
    }

    const obj = this.interactiveObjects.get(elementId);
    if (!obj) {
      return;
    }

    let focusGraphic = this.focusGraphics.get(elementId);
    if (!focusGraphic) {
      focusGraphic = this.scene.add.graphics();
      this.focusGraphics.set(elementId, focusGraphic);
    }

    focusGraphic.clear();
    focusGraphic.lineStyle(
      this.visualConfig.focusBorderWidth,
      this.visualConfig.focusBorderColor,
      1,
    );

    const bounds = this.getObjectBounds(obj);
    if (bounds) {
      focusGraphic.strokeRect(
        bounds.x - this.visualConfig.focusBorderWidth,
        bounds.y - this.visualConfig.focusBorderWidth,
        bounds.width + this.visualConfig.focusBorderWidth * 2,
        bounds.height + this.visualConfig.focusBorderWidth * 2,
      );
    }
  }

  private updateHoverVisuals(elementId: string | null): void {
    // Clear all hover tints
    for (const [id, obj] of this.interactiveObjects.entries()) {
      const originalTint = this.originalTints.get(id) || 0xffffff;
      if ('setTint' in obj) {
        (obj as any).setTint(originalTint);
      }
    }

    if (elementId === null) {
      return;
    }

    const obj = this.interactiveObjects.get(elementId);
    if (obj && 'setTint' in obj) {
      (obj as any).setTint(this.visualConfig.hoverTint);
    }
  }

  private clearElementVisuals(id: string): void {
    const focusGraphic = this.focusGraphics.get(id);
    if (focusGraphic) {
      focusGraphic.clear();
    }

    const obj = this.interactiveObjects.get(id);
    const originalTint = this.originalTints.get(id) || 0xffffff;
    if (obj && 'setTint' in obj) {
      (obj as any).setTint(originalTint);
    }
  }

  private getObjectBounds(obj: Phaser.GameObjects.GameObject): Phaser.Geom.Rectangle | null {
    if ('getBounds' in obj) {
      return (obj as any).getBounds();
    }

    if ('x' in obj && 'y' in obj && 'width' in obj && 'height' in obj) {
      const x = (obj as any).x;
      const y = (obj as any).y;
      const width = (obj as any).width;
      const height = (obj as any).height;
      return new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height);
    }

    return null;
  }

  /**
   * Get the underlying InputSystem
   */
  public getInputSystem(): InputSystem {
    return this.inputSystem;
  }

  /**
   * Cleanup on scene shutdown
   */
  public destroy(): void {
    for (const [id] of this.interactiveObjects.entries()) {
      this.unregisterInteractive(id);
    }

    this.scene.input.keyboard?.removeAllListeners();
    this.inputSystem.reset();
  }
}
