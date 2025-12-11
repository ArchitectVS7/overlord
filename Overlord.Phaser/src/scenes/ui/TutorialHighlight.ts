/**
 * TutorialHighlight - Visual highlight effects for tutorial steps
 * Story 1-4: Tutorial Step Guidance System
 *
 * Features:
 * - Glow effect (pulsating border)
 * - Spotlight effect (dim background, bright target)
 * - Arrow pointer effect
 * - Animated transitions
 */

import Phaser from 'phaser';
import { HighlightConfig } from '@core/models/TutorialModels';

// Constants
const GLOW_COLOR = 0xffff00;
const GLOW_ALPHA = 0.8;
const BACKDROP_COLOR = 0x000000;
const BACKDROP_ALPHA = 0.6;
const ARROW_COLOR = 0xffff00;
const HIGHLIGHT_DEPTH = 1500;
const PADDING = 10;

/**
 * Element-like interface for positioning
 */
interface HighlightTarget {
  x: number;
  y: number;
  width?: number;
  height?: number;
  displayWidth?: number;
  displayHeight?: number;
  getBounds?: () => { x: number; y: number; width: number; height: number };
}

/**
 * Manages visual highlight effects for tutorial elements
 */
export class TutorialHighlight {
  private scene: Phaser.Scene;
  private active: boolean = false;

  // Visual elements
  private glowGraphics?: Phaser.GameObjects.Graphics;
  private backdrop?: Phaser.GameObjects.Rectangle;
  private arrowGraphics?: Phaser.GameObjects.Graphics;
  private cutout?: Phaser.GameObjects.Graphics;

  // Animation tweens
  private activeTweens: Phaser.Tweens.Tween[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Check if highlight is currently active
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Show glow highlight around element
   * @param target Element to highlight
   * @param pulsate Whether to animate pulsation
   */
  public showGlow(target: HighlightTarget, pulsate: boolean = false): void {
    this.clear();
    this.active = true;

    const bounds = this.getBounds(target);

    // Create glow graphics
    this.glowGraphics = this.scene.add.graphics();
    this.glowGraphics.setDepth(HIGHLIGHT_DEPTH);
    this.glowGraphics.setScrollFactor(0);

    // Draw glow border
    this.drawGlow(bounds);

    if (pulsate) {
      this.startPulsation(this.glowGraphics);
    }
  }

  /**
   * Show spotlight effect (dim background, highlight target)
   * @param target Element to highlight
   * @param pulsate Whether to animate
   */
  public showSpotlight(target: HighlightTarget, pulsate: boolean = false): void {
    this.clear();
    this.active = true;

    const camera = this.scene.cameras.main;
    const bounds = this.getBounds(target);

    // Create semi-transparent backdrop
    this.backdrop = this.scene.add.rectangle(
      0, 0,
      camera.width,
      camera.height,
      BACKDROP_COLOR,
      BACKDROP_ALPHA
    );
    this.backdrop.setOrigin(0, 0);
    this.backdrop.setDepth(HIGHLIGHT_DEPTH - 1);
    this.backdrop.setScrollFactor(0);

    // Create cutout graphics to show target area
    this.cutout = this.scene.add.graphics();
    this.cutout.setDepth(HIGHLIGHT_DEPTH);
    this.cutout.setScrollFactor(0);

    // Draw bright border around cutout area
    this.cutout.lineStyle(3, GLOW_COLOR, 1);
    this.cutout.strokeRoundedRect(
      bounds.x - PADDING,
      bounds.y - PADDING,
      bounds.width + PADDING * 2,
      bounds.height + PADDING * 2,
      8
    );

    if (pulsate) {
      this.startPulsation(this.cutout);
    }
  }

  /**
   * Show arrow pointing to element
   * @param target Element to point to
   * @param animate Whether to animate bounce
   */
  public showArrow(target: HighlightTarget, animate: boolean = false): void {
    this.clear();
    this.active = true;

    const bounds = this.getBounds(target);

    // Create arrow graphics
    this.arrowGraphics = this.scene.add.graphics();
    this.arrowGraphics.setDepth(HIGHLIGHT_DEPTH);
    this.arrowGraphics.setScrollFactor(0);

    // Draw arrow pointing down to target
    const arrowX = bounds.x + bounds.width / 2;
    const arrowY = bounds.y - 30;

    this.drawArrow(arrowX, arrowY);

    if (animate) {
      this.startBounce(this.arrowGraphics, arrowX, arrowY);
    }
  }

  /**
   * Apply highlight from config
   * @param config Highlight configuration
   * @param target Element to highlight
   */
  public applyConfig(config: HighlightConfig, target: HighlightTarget): void {
    const pulsate = config.pulsate ?? false;

    switch (config.type) {
      case 'glow':
        this.showGlow(target, pulsate);
        break;
      case 'spotlight':
        this.showSpotlight(target, pulsate);
        break;
      case 'arrow':
        this.showArrow(target, pulsate);
        break;
    }
  }

  /**
   * Clear all highlight effects
   */
  public clear(): void {
    // Stop animations
    for (const tween of this.activeTweens) {
      tween.stop();
    }
    this.activeTweens = [];

    // Kill any ongoing tweens on our objects
    if (this.glowGraphics) {
      this.scene.tweens.killTweensOf(this.glowGraphics);
      this.glowGraphics.destroy();
      this.glowGraphics = undefined;
    }

    if (this.backdrop) {
      this.scene.tweens.killTweensOf(this.backdrop);
      this.backdrop.destroy();
      this.backdrop = undefined;
    }

    if (this.cutout) {
      this.scene.tweens.killTweensOf(this.cutout);
      this.cutout.destroy();
      this.cutout = undefined;
    }

    if (this.arrowGraphics) {
      this.scene.tweens.killTweensOf(this.arrowGraphics);
      this.arrowGraphics.destroy();
      this.arrowGraphics = undefined;
    }

    this.active = false;
  }

  /**
   * Destroy highlight manager
   */
  public destroy(): void {
    this.clear();
  }

  /**
   * Get bounds of target element
   */
  private getBounds(target: HighlightTarget): { x: number; y: number; width: number; height: number } {
    if (target.getBounds) {
      return target.getBounds();
    }

    return {
      x: target.x,
      y: target.y,
      width: target.displayWidth ?? target.width ?? 100,
      height: target.displayHeight ?? target.height ?? 50
    };
  }

  /**
   * Draw glow effect
   */
  private drawGlow(bounds: { x: number; y: number; width: number; height: number }): void {
    if (!this.glowGraphics) return;

    // Outer glow
    this.glowGraphics.lineStyle(6, GLOW_COLOR, 0.3);
    this.glowGraphics.strokeRoundedRect(
      bounds.x - PADDING - 3,
      bounds.y - PADDING - 3,
      bounds.width + (PADDING + 3) * 2,
      bounds.height + (PADDING + 3) * 2,
      12
    );

    // Inner glow
    this.glowGraphics.lineStyle(3, GLOW_COLOR, GLOW_ALPHA);
    this.glowGraphics.strokeRoundedRect(
      bounds.x - PADDING,
      bounds.y - PADDING,
      bounds.width + PADDING * 2,
      bounds.height + PADDING * 2,
      8
    );
  }

  /**
   * Draw arrow pointing down
   */
  private drawArrow(x: number, y: number): void {
    if (!this.arrowGraphics) return;

    this.arrowGraphics.fillStyle(ARROW_COLOR, 1);

    // Arrow triangle pointing down
    this.arrowGraphics.beginPath();
    this.arrowGraphics.moveTo(x - 15, y - 20);
    this.arrowGraphics.lineTo(x + 15, y - 20);
    this.arrowGraphics.lineTo(x, y);
    this.arrowGraphics.closePath();
    this.arrowGraphics.fillPath();
  }

  /**
   * Start pulsation animation
   */
  private startPulsation(target: Phaser.GameObjects.Graphics): void {
    const tween = this.scene.tweens.add({
      targets: target,
      alpha: { from: 1, to: 0.5 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.activeTweens.push(tween);
  }

  /**
   * Start bounce animation for arrow
   */
  private startBounce(target: Phaser.GameObjects.Graphics, _x: number, baseY: number): void {
    const tween = this.scene.tweens.add({
      targets: target,
      y: baseY - 10,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.activeTweens.push(tween);
  }
}
