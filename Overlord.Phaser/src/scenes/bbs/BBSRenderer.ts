import Phaser from 'phaser';
import { BBSColors, hexToString, BoxChars } from './BBSColors';

/**
 * BBSRenderer - ASCII/text rendering utilities for BBS interface
 * Handles box drawing, text layout, and terminal-style rendering
 */
export class BBSRenderer {
  private scene: Phaser.Scene;
  private textObjects: Phaser.GameObjects.Text[] = [];
  private container: Phaser.GameObjects.Container;

  // Terminal dimensions (characters)
  public readonly cols = 64;
  public readonly rows = 30;

  // Character size in pixels
  public readonly charWidth = 12;
  public readonly charHeight = 20;

  // Screen offset for centering
  private offsetX = 0;
  private offsetY = 0;

  // Font settings
  private readonly fontFamily = 'Courier New, Courier, monospace';
  private readonly fontSize = '16px';

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);

    // Calculate centering offset
    const screenWidth = scene.cameras.main.width;
    const screenHeight = scene.cameras.main.height;
    this.offsetX = Math.floor((screenWidth - this.cols * this.charWidth) / 2);
    this.offsetY = Math.floor((screenHeight - this.rows * this.charHeight) / 2);
  }

  /**
   * Clear all rendered text
   */
  public clear(): void {
    this.textObjects.forEach(t => t.destroy());
    this.textObjects = [];
  }

  /**
   * Render a single character at grid position
   */
  public putChar(col: number, row: number, char: string, color: number = BBSColors.text): Phaser.GameObjects.Text {
    const x = this.offsetX + col * this.charWidth;
    const y = this.offsetY + row * this.charHeight;

    const text = this.scene.add.text(x, y, char, {
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      color: hexToString(color),
    });
    this.container.add(text);
    this.textObjects.push(text);
    return text;
  }

  /**
   * Render a string starting at grid position
   */
  public putString(col: number, row: number, str: string, color: number = BBSColors.text): void {
    for (let i = 0; i < str.length; i++) {
      if (col + i < this.cols) {
        this.putChar(col + i, row, str[i], color);
      }
    }
  }

  /**
   * Render centered string on a row
   */
  public putCentered(row: number, str: string, color: number = BBSColors.text): void {
    const col = Math.floor((this.cols - str.length) / 2);
    this.putString(col, row, str, color);
  }

  /**
   * Draw a box with borders
   */
  public drawBox(left: number, top: number, width: number, height: number, color: number = BBSColors.border): void {
    // Top border
    this.putChar(left, top, BoxChars.topLeft, color);
    for (let i = 1; i < width - 1; i++) {
      this.putChar(left + i, top, BoxChars.horizontal, color);
    }
    this.putChar(left + width - 1, top, BoxChars.topRight, color);

    // Side borders
    for (let i = 1; i < height - 1; i++) {
      this.putChar(left, top + i, BoxChars.vertical, color);
      this.putChar(left + width - 1, top + i, BoxChars.vertical, color);
    }

    // Bottom border
    this.putChar(left, top + height - 1, BoxChars.bottomLeft, color);
    for (let i = 1; i < width - 1; i++) {
      this.putChar(left + i, top + height - 1, BoxChars.horizontal, color);
    }
    this.putChar(left + width - 1, top + height - 1, BoxChars.bottomRight, color);
  }

  /**
   * Draw a horizontal separator line
   */
  public drawHorizontalLine(left: number, row: number, width: number, color: number = BBSColors.border): void {
    this.putChar(left, row, BoxChars.tLeft, color);
    for (let i = 1; i < width - 1; i++) {
      this.putChar(left + i, row, BoxChars.horizontal, color);
    }
    this.putChar(left + width - 1, row, BoxChars.tRight, color);
  }

  /**
   * Fill a rectangular area with a character
   */
  public fillRect(left: number, top: number, width: number, height: number, char: string = ' ', color: number = BBSColors.text): void {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        this.putChar(left + col, top + row, char, color);
      }
    }
  }

  /**
   * Render a menu item with key indicator
   */
  public putMenuItem(col: number, row: number, key: string, label: string, enabled: boolean = true): void {
    const keyColor = enabled ? BBSColors.highlight : BBSColors.textDim;
    const labelColor = enabled ? BBSColors.text : BBSColors.textDim;

    this.putString(col, row, '[', BBSColors.textDim);
    this.putString(col + 1, row, key, keyColor);
    this.putString(col + 2, row, '] ', BBSColors.textDim);
    this.putString(col + 4, row, label, labelColor);
  }

  /**
   * Render a numbered list item
   */
  public putListItem(col: number, row: number, index: number, text: string, selected: boolean = false): void {
    const numStr = `${index}.`;
    const color = selected ? BBSColors.highlight : BBSColors.text;

    if (selected) {
      // Highlight background for selected item
      this.putString(col - 1, row, '>', BBSColors.highlight);
    }

    this.putString(col, row, numStr, BBSColors.textDim);
    this.putString(col + numStr.length + 1, row, text, color);
  }

  /**
   * Render a status bar item
   */
  public putStatus(col: number, row: number, label: string, value: string, valueColor: number = BBSColors.text): void {
    this.putString(col, row, label + ': ', BBSColors.textDim);
    this.putString(col + label.length + 2, row, value, valueColor);
  }

  /**
   * Format number with commas
   */
  public formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Pad string to fixed width
   */
  public padRight(str: string, width: number): string {
    return str.padEnd(width);
  }

  public padLeft(str: string, width: number): string {
    return str.padStart(width);
  }

  /**
   * Truncate string to max width
   */
  public truncate(str: string, maxWidth: number): string {
    if (str.length <= maxWidth) return str;
    return str.substring(0, maxWidth - 3) + '...';
  }

  /**
   * Get the container for depth management
   */
  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  /**
   * Set container depth
   */
  public setDepth(depth: number): void {
    this.container.setDepth(depth);
  }

  /**
   * Destroy renderer and all text objects
   */
  public destroy(): void {
    this.clear();
    this.container.destroy();
  }
}
