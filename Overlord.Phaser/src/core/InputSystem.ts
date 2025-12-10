/**
 * Platform-agnostic input system
 * Manages keyboard shortcuts, focus navigation, and input callbacks
 * NO PHASER DEPENDENCIES - pure business logic
 */

import type { KeyboardShortcut, FocusableElement, InputCallbacks, InputConfig } from './models/InputModels';

export class InputSystem {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private focusableElements: Map<string, FocusableElement> = new Map();
  private currentFocusId: string | null = null;
  private currentHoverId: string | null = null;
  private callbacks: InputCallbacks = {};
  private config: Required<InputConfig>;

  constructor(config: InputConfig = {}) {
    this.config = {
      enableKeyboard: config.enableKeyboard ?? true,
      enableMouse: config.enableMouse ?? true,
      enableFocusWrap: config.enableFocusWrap ?? true,
      defaultFocusOrder: config.defaultFocusOrder ?? 0
    };
  }

  /**
   * Register event callbacks
   */
  public setCallbacks(callbacks: InputCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // ==================== KEYBOARD SHORTCUTS ====================

  /**
   * Register a keyboard shortcut
   */
  public registerShortcut(shortcut: KeyboardShortcut): string {
    const id = this.generateShortcutId(shortcut);
    this.shortcuts.set(id, shortcut);
    return id;
  }

  /**
   * Unregister a keyboard shortcut
   */
  public unregisterShortcut(id: string): boolean {
    return this.shortcuts.delete(id);
  }

  /**
   * Unregister all shortcuts for a specific action
   */
  public unregisterShortcutsByAction(action: string): number {
    let count = 0;
    for (const [id, shortcut] of this.shortcuts.entries()) {
      if (shortcut.action === action) {
        this.shortcuts.delete(id);
        count++;
      }
    }
    return count;
  }

  /**
   * Clear all registered shortcuts
   */
  public clearShortcuts(): void {
    this.shortcuts.clear();
  }

  /**
   * Trigger shortcut check based on key event
   */
  public triggerShortcut(
    key: string,
    modifiers: { ctrl: boolean; shift: boolean; alt: boolean },
    timestamp: number
  ): boolean {
    if (!this.config.enableKeyboard) {
      return false;
    }

    const normalizedKey = key.toLowerCase();

    for (const shortcut of this.shortcuts.values()) {
      const shortcutKey = shortcut.key.toLowerCase();

      if (
        shortcutKey === normalizedKey &&
        (shortcut.ctrl ?? false) === modifiers.ctrl &&
        (shortcut.shift ?? false) === modifiers.shift &&
        (shortcut.alt ?? false) === modifiers.alt
      ) {
        this.callbacks.onShortcutTriggered?.(shortcut.action, timestamp);
        return true;
      }
    }

    return false;
  }

  /**
   * Get all registered shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  private generateShortcutId(shortcut: KeyboardShortcut): string {
    const parts = [shortcut.key.toLowerCase()];
    if (shortcut.ctrl) parts.push('ctrl');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    return parts.join('+');
  }

  // ==================== FOCUS MANAGEMENT ====================

  /**
   * Register a focusable element
   */
  public registerFocusableElement(element: FocusableElement): void {
    this.focusableElements.set(element.id, element);
  }

  /**
   * Unregister a focusable element
   */
  public unregisterFocusableElement(id: string): boolean {
    if (this.currentFocusId === id) {
      this.clearFocus();
    }
    return this.focusableElements.delete(id);
  }

  /**
   * Update element enabled state
   */
  public setElementEnabled(id: string, enabled: boolean): void {
    const element = this.focusableElements.get(id);
    if (element) {
      element.enabled = enabled;
      if (!enabled && this.currentFocusId === id) {
        this.clearFocus();
      }
    }
  }

  /**
   * Update element focus order
   */
  public setElementOrder(id: string, order: number): void {
    const element = this.focusableElements.get(id);
    if (element) {
      element.order = order;
    }
  }

  /**
   * Get ordered list of focusable elements
   */
  public getFocusableElements(includeDisabled: boolean = false): FocusableElement[] {
    const elements = Array.from(this.focusableElements.values());
    const filtered = includeDisabled ? elements : elements.filter(e => e.enabled);
    return filtered.sort((a, b) => a.order - b.order);
  }

  /**
   * Set focus to a specific element
   */
  public setFocus(id: string | null): void {
    if (id === this.currentFocusId) {
      return;
    }

    if (id !== null) {
      const element = this.focusableElements.get(id);
      if (!element || !element.enabled) {
        return;
      }
    }

    this.currentFocusId = id;
    this.callbacks.onFocusChanged?.(id);
  }

  /**
   * Clear current focus
   */
  public clearFocus(): void {
    this.setFocus(null);
  }

  /**
   * Get current focused element ID
   */
  public getFocusedElementId(): string | null {
    return this.currentFocusId;
  }

  /**
   * Focus next element in order
   */
  public focusNext(): string | null {
    const elements = this.getFocusableElements(false);
    if (elements.length === 0) {
      return null;
    }

    let nextIndex = 0;

    if (this.currentFocusId !== null) {
      const currentIndex = elements.findIndex(e => e.id === this.currentFocusId);
      if (currentIndex !== -1) {
        nextIndex = currentIndex + 1;
        if (nextIndex >= elements.length) {
          nextIndex = this.config.enableFocusWrap ? 0 : currentIndex;
        }
      }
    }

    const nextElement = elements[nextIndex];
    this.setFocus(nextElement.id);
    return nextElement.id;
  }

  /**
   * Focus previous element in order
   */
  public focusPrevious(): string | null {
    const elements = this.getFocusableElements(false);
    if (elements.length === 0) {
      return null;
    }

    let prevIndex = elements.length - 1;

    if (this.currentFocusId !== null) {
      const currentIndex = elements.findIndex(e => e.id === this.currentFocusId);
      if (currentIndex !== -1) {
        prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = this.config.enableFocusWrap ? elements.length - 1 : currentIndex;
        }
      }
    }

    const prevElement = elements[prevIndex];
    this.setFocus(prevElement.id);
    return prevElement.id;
  }

  /**
   * Focus first element
   */
  public focusFirst(): string | null {
    const elements = this.getFocusableElements(false);
    if (elements.length === 0) {
      return null;
    }

    this.setFocus(elements[0].id);
    return elements[0].id;
  }

  /**
   * Focus last element
   */
  public focusLast(): string | null {
    const elements = this.getFocusableElements(false);
    if (elements.length === 0) {
      return null;
    }

    this.setFocus(elements[elements.length - 1].id);
    return elements[elements.length - 1].id;
  }

  // ==================== ACTIVATION ====================

  /**
   * Activate the currently focused element
   */
  public activateFocused(method: 'mouse' | 'keyboard' = 'keyboard'): void {
    if (this.currentFocusId === null) {
      return;
    }

    const element = this.focusableElements.get(this.currentFocusId);
    if (element && element.enabled) {
      this.callbacks.onElementActivated?.(this.currentFocusId, method);
    }
  }

  /**
   * Activate a specific element by ID
   */
  public activateElement(id: string, method: 'mouse' | 'keyboard'): void {
    const element = this.focusableElements.get(id);
    if (element && element.enabled) {
      this.callbacks.onElementActivated?.(id, method);
    }
  }

  // ==================== HOVER MANAGEMENT ====================

  /**
   * Set hover state for an element
   */
  public setHover(id: string | null): void {
    if (!this.config.enableMouse) {
      return;
    }

    if (id === this.currentHoverId) {
      return;
    }

    if (id !== null) {
      const element = this.focusableElements.get(id);
      if (!element || !element.enabled) {
        return;
      }
    }

    this.currentHoverId = id;
    this.callbacks.onHoverChanged?.(id);
  }

  /**
   * Get current hovered element ID
   */
  public getHoveredElementId(): string | null {
    return this.currentHoverId;
  }

  // ==================== UTILITY ====================

  /**
   * Clear all state
   */
  public reset(): void {
    this.shortcuts.clear();
    this.focusableElements.clear();
    this.currentFocusId = null;
    this.currentHoverId = null;
  }

  /**
   * Get configuration
   */
  public getConfig(): Readonly<Required<InputConfig>> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<InputConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
