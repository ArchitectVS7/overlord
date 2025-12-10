import { InputSystem } from '@core/InputSystem';
import type { KeyboardShortcut, FocusableElement } from '@core/models/InputModels';

describe('InputSystem', () => {
  let inputSystem: InputSystem;

  beforeEach(() => {
    inputSystem = new InputSystem();
  });

  describe('Keyboard Shortcuts', () => {
    test('should register and trigger a simple shortcut', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onShortcutTriggered: callback });

      const shortcut: KeyboardShortcut = {
        key: 'Escape',
        action: 'pause'
      };

      inputSystem.registerShortcut(shortcut);
      const triggered = inputSystem.triggerShortcut(
        'Escape',
        { ctrl: false, shift: false, alt: false },
        Date.now()
      );

      expect(triggered).toBe(true);
      expect(callback).toHaveBeenCalledWith('pause', expect.any(Number));
    });

    test('should register and trigger a shortcut with modifiers', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onShortcutTriggered: callback });

      const shortcut: KeyboardShortcut = {
        key: 's',
        ctrl: true,
        action: 'save'
      };

      inputSystem.registerShortcut(shortcut);

      const triggered1 = inputSystem.triggerShortcut(
        's',
        { ctrl: true, shift: false, alt: false },
        100
      );
      expect(triggered1).toBe(true);
      expect(callback).toHaveBeenCalledWith('save', 100);

      callback.mockClear();
      const triggered2 = inputSystem.triggerShortcut(
        's',
        { ctrl: false, shift: false, alt: false },
        200
      );
      expect(triggered2).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });

    test('should handle case-insensitive key matching', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onShortcutTriggered: callback });

      inputSystem.registerShortcut({ key: 'h', action: 'help' });

      expect(inputSystem.triggerShortcut('h', { ctrl: false, shift: false, alt: false }, 100)).toBe(true);
      expect(inputSystem.triggerShortcut('H', { ctrl: false, shift: false, alt: false }, 100)).toBe(true);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test('should unregister shortcut by ID', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onShortcutTriggered: callback });

      const id = inputSystem.registerShortcut({ key: 'Escape', action: 'pause' });
      const removed = inputSystem.unregisterShortcut(id);

      expect(removed).toBe(true);

      const triggered = inputSystem.triggerShortcut(
        'Escape',
        { ctrl: false, shift: false, alt: false },
        100
      );
      expect(triggered).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });

    test('should unregister shortcuts by action', () => {
      inputSystem.registerShortcut({ key: 'Escape', action: 'pause' });
      inputSystem.registerShortcut({ key: 'p', action: 'pause' });
      inputSystem.registerShortcut({ key: 'h', action: 'help' });

      const removed = inputSystem.unregisterShortcutsByAction('pause');
      expect(removed).toBe(2);

      const shortcuts = inputSystem.getShortcuts();
      expect(shortcuts).toHaveLength(1);
      expect(shortcuts[0].action).toBe('help');
    });

    test('should clear all shortcuts', () => {
      inputSystem.registerShortcut({ key: 'Escape', action: 'pause' });
      inputSystem.registerShortcut({ key: 'h', action: 'help' });

      inputSystem.clearShortcuts();

      expect(inputSystem.getShortcuts()).toHaveLength(0);
    });

    test('should not trigger shortcuts when keyboard disabled', () => {
      const callback = jest.fn();
      inputSystem = new InputSystem({ enableKeyboard: false });
      inputSystem.setCallbacks({ onShortcutTriggered: callback });

      inputSystem.registerShortcut({ key: 'Escape', action: 'pause' });
      const triggered = inputSystem.triggerShortcut(
        'Escape',
        { ctrl: false, shift: false, alt: false },
        100
      );

      expect(triggered).toBe(false);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    beforeEach(() => {
      inputSystem.registerFocusableElement({ id: 'btn1', order: 1, enabled: true });
      inputSystem.registerFocusableElement({ id: 'btn2', order: 2, enabled: true });
      inputSystem.registerFocusableElement({ id: 'btn3', order: 3, enabled: true });
    });

    test('should register and retrieve focusable elements', () => {
      const elements = inputSystem.getFocusableElements();
      expect(elements).toHaveLength(3);
      expect(elements.map(e => e.id)).toEqual(['btn1', 'btn2', 'btn3']);
    });

    test('should order elements correctly', () => {
      inputSystem.registerFocusableElement({ id: 'btn0', order: 0, enabled: true });

      const elements = inputSystem.getFocusableElements();
      expect(elements[0].id).toBe('btn0');
      expect(elements[1].id).toBe('btn1');
    });

    test('should set focus and trigger callback', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onFocusChanged: callback });

      inputSystem.setFocus('btn2');

      expect(inputSystem.getFocusedElementId()).toBe('btn2');
      expect(callback).toHaveBeenCalledWith('btn2');
    });

    test('should not focus disabled element', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onFocusChanged: callback });

      inputSystem.setElementEnabled('btn2', false);
      inputSystem.setFocus('btn2');

      expect(inputSystem.getFocusedElementId()).toBeNull();
      expect(callback).not.toHaveBeenCalled();
    });

    test('should clear focus when element is disabled', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onFocusChanged: callback });

      inputSystem.setFocus('btn2');
      callback.mockClear();

      inputSystem.setElementEnabled('btn2', false);

      expect(inputSystem.getFocusedElementId()).toBeNull();
      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should focus next element', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onFocusChanged: callback });

      inputSystem.setFocus('btn1');
      callback.mockClear();

      const nextId = inputSystem.focusNext();

      expect(nextId).toBe('btn2');
      expect(inputSystem.getFocusedElementId()).toBe('btn2');
      expect(callback).toHaveBeenCalledWith('btn2');
    });

    test('should focus previous element', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onFocusChanged: callback });

      inputSystem.setFocus('btn2');
      callback.mockClear();

      const prevId = inputSystem.focusPrevious();

      expect(prevId).toBe('btn1');
      expect(inputSystem.getFocusedElementId()).toBe('btn1');
      expect(callback).toHaveBeenCalledWith('btn1');
    });

    test('should wrap focus to first when reaching end', () => {
      inputSystem.setFocus('btn3');
      const nextId = inputSystem.focusNext();

      expect(nextId).toBe('btn1');
      expect(inputSystem.getFocusedElementId()).toBe('btn1');
    });

    test('should wrap focus to last when going before first', () => {
      inputSystem.setFocus('btn1');
      const prevId = inputSystem.focusPrevious();

      expect(prevId).toBe('btn3');
      expect(inputSystem.getFocusedElementId()).toBe('btn3');
    });

    test('should not wrap focus when disabled', () => {
      inputSystem = new InputSystem({ enableFocusWrap: false });
      inputSystem.registerFocusableElement({ id: 'btn1', order: 1, enabled: true });
      inputSystem.registerFocusableElement({ id: 'btn2', order: 2, enabled: true });

      inputSystem.setFocus('btn2');
      const nextId = inputSystem.focusNext();

      expect(nextId).toBe('btn2');
    });

    test('should focus first element', () => {
      const firstId = inputSystem.focusFirst();
      expect(firstId).toBe('btn1');
      expect(inputSystem.getFocusedElementId()).toBe('btn1');
    });

    test('should focus last element', () => {
      const lastId = inputSystem.focusLast();
      expect(lastId).toBe('btn3');
      expect(inputSystem.getFocusedElementId()).toBe('btn3');
    });

    test('should skip disabled elements when focusing next', () => {
      inputSystem.setElementEnabled('btn2', false);
      inputSystem.setFocus('btn1');

      const nextId = inputSystem.focusNext();
      expect(nextId).toBe('btn3');
    });

    test('should clear focus', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onFocusChanged: callback });

      inputSystem.setFocus('btn1');
      callback.mockClear();

      inputSystem.clearFocus();

      expect(inputSystem.getFocusedElementId()).toBeNull();
      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should unregister focusable element', () => {
      const removed = inputSystem.unregisterFocusableElement('btn2');
      expect(removed).toBe(true);

      const elements = inputSystem.getFocusableElements();
      expect(elements).toHaveLength(2);
    });

    test('should return null when no focusable elements', () => {
      inputSystem.reset();

      expect(inputSystem.focusNext()).toBeNull();
      expect(inputSystem.focusPrevious()).toBeNull();
      expect(inputSystem.focusFirst()).toBeNull();
      expect(inputSystem.focusLast()).toBeNull();
    });
  });

  describe('Activation', () => {
    beforeEach(() => {
      inputSystem.registerFocusableElement({ id: 'btn1', order: 1, enabled: true });
      inputSystem.registerFocusableElement({ id: 'btn2', order: 2, enabled: true });
    });

    test('should activate focused element via keyboard', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onElementActivated: callback });

      inputSystem.setFocus('btn1');
      inputSystem.activateFocused('keyboard');

      expect(callback).toHaveBeenCalledWith('btn1', 'keyboard');
    });

    test('should activate focused element via mouse', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onElementActivated: callback });

      inputSystem.setFocus('btn2');
      inputSystem.activateFocused('mouse');

      expect(callback).toHaveBeenCalledWith('btn2', 'mouse');
    });

    test('should not activate when no focus', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onElementActivated: callback });

      inputSystem.activateFocused('keyboard');

      expect(callback).not.toHaveBeenCalled();
    });

    test('should activate specific element by ID', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onElementActivated: callback });

      inputSystem.activateElement('btn2', 'mouse');

      expect(callback).toHaveBeenCalledWith('btn2', 'mouse');
    });
  });

  describe('Hover Management', () => {
    beforeEach(() => {
      inputSystem.registerFocusableElement({ id: 'btn1', order: 1, enabled: true });
      inputSystem.registerFocusableElement({ id: 'btn2', order: 2, enabled: true });
    });

    test('should set hover and trigger callback', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onHoverChanged: callback });

      inputSystem.setHover('btn1');

      expect(inputSystem.getHoveredElementId()).toBe('btn1');
      expect(callback).toHaveBeenCalledWith('btn1');
    });

    test('should not set hover on disabled element', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onHoverChanged: callback });

      inputSystem.setElementEnabled('btn1', false);
      inputSystem.setHover('btn1');

      expect(inputSystem.getHoveredElementId()).toBeNull();
      expect(callback).not.toHaveBeenCalled();
    });

    test('should clear hover', () => {
      const callback = jest.fn();
      inputSystem.setCallbacks({ onHoverChanged: callback });

      inputSystem.setHover('btn1');
      callback.mockClear();

      inputSystem.setHover(null);

      expect(inputSystem.getHoveredElementId()).toBeNull();
      expect(callback).toHaveBeenCalledWith(null);
    });

    test('should not set hover when mouse disabled', () => {
      inputSystem = new InputSystem({ enableMouse: false });
      inputSystem.registerFocusableElement({ id: 'btn1', order: 1, enabled: true });

      const callback = jest.fn();
      inputSystem.setCallbacks({ onHoverChanged: callback });

      inputSystem.setHover('btn1');

      expect(inputSystem.getHoveredElementId()).toBeNull();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    test('should use default configuration', () => {
      const config = inputSystem.getConfig();
      expect(config.enableKeyboard).toBe(true);
      expect(config.enableMouse).toBe(true);
      expect(config.enableFocusWrap).toBe(true);
    });

    test('should accept custom configuration', () => {
      const customSystem = new InputSystem({
        enableKeyboard: false,
        enableMouse: false,
        enableFocusWrap: false
      });

      const config = customSystem.getConfig();
      expect(config.enableKeyboard).toBe(false);
      expect(config.enableMouse).toBe(false);
      expect(config.enableFocusWrap).toBe(false);
    });

    test('should update configuration', () => {
      inputSystem.updateConfig({ enableKeyboard: false });

      const config = inputSystem.getConfig();
      expect(config.enableKeyboard).toBe(false);
      expect(config.enableMouse).toBe(true);
    });
  });

  describe('Reset', () => {
    test('should clear all state', () => {
      inputSystem.registerShortcut({ key: 'Escape', action: 'pause' });
      inputSystem.registerFocusableElement({ id: 'btn1', order: 1, enabled: true });
      inputSystem.setFocus('btn1');
      inputSystem.setHover('btn1');

      inputSystem.reset();

      expect(inputSystem.getShortcuts()).toHaveLength(0);
      expect(inputSystem.getFocusableElements()).toHaveLength(0);
      expect(inputSystem.getFocusedElementId()).toBeNull();
      expect(inputSystem.getHoveredElementId()).toBeNull();
    });
  });
});
