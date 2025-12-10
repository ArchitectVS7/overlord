/**
 * Input system type definitions
 * Platform-agnostic models for keyboard/mouse input handling
 */

/**
 * Keyboard shortcut definition
 * Represents a key combination and the action it triggers
 */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
}

/**
 * Focusable element definition
 * Represents an interactive element that can receive keyboard focus
 */
export interface FocusableElement {
  id: string;
  order: number;
  enabled: boolean;
}

/**
 * Input event callbacks
 * Platform-agnostic event handlers for input actions
 */
export interface InputCallbacks {
  onShortcutTriggered?: (action: string, timestamp: number) => void;
  onFocusChanged?: (elementId: string | null) => void;
  onElementActivated?: (elementId: string, method: 'mouse' | 'keyboard') => void;
  onHoverChanged?: (elementId: string | null) => void;
}

/**
 * Input configuration options
 */
export interface InputConfig {
  enableKeyboard?: boolean;
  enableMouse?: boolean;
  enableFocusWrap?: boolean;
  defaultFocusOrder?: number;
}
