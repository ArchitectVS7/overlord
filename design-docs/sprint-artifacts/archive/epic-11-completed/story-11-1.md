# Story 11-1: Mouse and Keyboard Input Support

**Status:** DONE
**Epic:** Epic 11 - Accessible User Interface
**Priority:** CRITICAL
**Implementation Tag:** [GREENFIELD]

---

## User Story

**As a** desktop player,
**I want to** interact with the game using mouse and keyboard,
**So that** I can play comfortably on my desktop or laptop computer.

---

## Acceptance Criteria

### A. Mouse Interactions
- [ ] Can click all interactive UI elements (buttons, planets, units, menu items)
- [ ] Clickable elements display hover states (color change, highlight, tooltip)
- [ ] Mouse cursor changes to pointer on hover
- [ ] All interactions provide feedback within 100ms (NFR-P3)

### B. Keyboard Tab Navigation
- [ ] Tab cycles through interactive elements in logical order (left-to-right, top-to-bottom)
- [ ] Focused elements display visible 3px focus indicator (NFR-A1 - WCAG 2.1 Level A)
- [ ] Focus order makes sense for current screen

### C. Keyboard Button Activation
- [ ] Enter or Space on focused button activates it (same as mouse click)
- [ ] Action executes immediately

### D. Keyboard Shortcuts (Common Actions)
- [ ] Space/Enter = End Turn (Action phase)
- [ ] Escape = Pause Menu
- [ ] H = Help Overlay
- [ ] O = Objectives Panel
- [ ] Ctrl+S = Save Game
- [ ] M = Main Menu
- [ ] Shortcuts don't conflict with browser shortcuts (NFR-U4)
- [ ] Visual feedback on activation (button highlight, menu opening, etc.)
- [ ] Actions complete within 100ms (NFR-P3)

---

## Technical Tasks

### Task 1: Create InputSystem.ts (Core Layer - Platform-Agnostic)
**File:** `Overlord.Phaser/src/core/InputSystem.ts`

- [ ] 1.1: Create InputSystem class with NO Phaser dependencies
- [ ] 1.2: Implement keyboard shortcut registry
  - Register/unregister shortcuts
  - Conflict detection (prevent overriding browser shortcuts)
- [ ] 1.3: Implement focus management state
  - Track current focused element ID
  - Track focusable element list (ordered)
  - Methods: setFocus(), clearFocus(), getFocusedElement()
- [ ] 1.4: Implement navigation logic
  - focusNext() - Tab forward
  - focusPrevious() - Shift+Tab backward
  - activateFocused() - Enter/Space on focused element
- [ ] 1.5: Implement callback system
  - onShortcutTriggered(action, timestamp)
  - onFocusChanged(elementId)
  - onElementActivated(elementId, method)
  - onHoverChanged(elementId)

### Task 2: Create InputModels.ts (Core Models)
**File:** `Overlord.Phaser/src/core/models/InputModels.ts`

- [ ] 2.1: Define KeyboardShortcut interface
- [ ] 2.2: Define FocusableElement interface
- [ ] 2.3: Define InputEvent interface
- [ ] 2.4: Define InteractiveElementConfig interface

### Task 3: Create InputManager.ts (Phaser Integration Layer)
**File:** `Overlord.Phaser/src/scenes/InputManager.ts`

- [ ] 3.1: Create InputManager class that wraps Phaser input
- [ ] 3.2: Integrate with InputSystem (Core)
- [ ] 3.3: Implement Phaser keyboard listener setup
  - Listen to keydown, keyup events
  - Map Phaser key codes to InputSystem format
- [ ] 3.4: Implement Phaser mouse listener setup
  - Listen to pointerdown, pointerup, pointermove events
  - Implement hit detection for interactive elements
- [ ] 3.5: Implement interactive element registration
  - registerInteractive(elementId, gameObject, order)
  - unregisterInteractive(elementId)
- [ ] 3.6: Implement visual feedback
  - Apply hover tint on hover enter/exit
  - Apply focus indicator on focus change
  - Apply activation flash on click/keypress
- [ ] 3.7: Add cursor management (pointer on hover)

### Task 4: Implement Mouse Click Handling
- [ ] 4.1: Add click detection to InputManager
- [ ] 4.2: Implement element bounds checking
- [ ] 4.3: Handle z-index/depth (topmost element gets click)
- [ ] 4.4: Fire InputSystem callbacks on click
- [ ] 4.5: Add click feedback animation

### Task 5: Implement Hover State Management
- [ ] 5.1: Add hover detection to InputManager
- [ ] 5.2: Implement hover enter/exit tracking
- [ ] 5.3: Apply hover tint to game objects
- [ ] 5.4: Implement cursor change on hover

### Task 6: Implement Keyboard Tab Navigation
- [ ] 6.1: Implement focus order sorting by order property
- [ ] 6.2: Add Tab key handler (forward/backward with wrap)
- [ ] 6.3: Implement focus indicator rendering (3px border)
- [ ] 6.4: Add focus change callbacks

### Task 7: Implement Keyboard Shortcuts
- [ ] 7.1: Register all required shortcuts
- [ ] 7.2: Implement shortcut conflict detection
- [ ] 7.3: Implement Enter/Space activation of focused element
- [ ] 7.4: Add visual feedback for shortcuts

### Task 8: Integrate with GalaxyMapScene
**File:** `Overlord.Phaser/src/scenes/GalaxyMapScene.ts`

- [ ] 8.1: Add InputManager to GalaxyMapScene
- [ ] 8.2: Initialize InputManager in create()
- [ ] 8.3: Register interactive planets
- [ ] 8.4: Subscribe to input callbacks
- [ ] 8.5: Implement keyboard shortcuts for galaxy scene

### Task 9: Write Unit Tests for InputSystem
**File:** `Overlord.Phaser/tests/unit/InputSystem.test.ts`

- [ ] 9.1: Test keyboard shortcut registration
- [ ] 9.2: Test focus management (set, clear, next, previous)
- [ ] 9.3: Test activation (Enter/Space)
- [ ] 9.4: Test shortcut triggering
- [ ] 9.5: Achieve >90% code coverage

### Task 10: Write Integration Tests
**File:** `Overlord.Phaser/tests/integration/InputIntegration.test.ts`

- [ ] 10.1: Test full mouse click flow
- [ ] 10.2: Test full keyboard navigation flow
- [ ] 10.3: Test keyboard shortcuts end-to-end
- [ ] 10.4: Test performance (<100ms latency)

---

## Files to Create

| File | Layer | Purpose |
|------|-------|---------|
| `src/core/InputSystem.ts` | Core | Platform-agnostic input logic |
| `src/core/models/InputModels.ts` | Core | Input type definitions |
| `src/scenes/InputManager.ts` | Phaser | Phaser input integration |
| `tests/unit/InputSystem.test.ts` | Test | Core system unit tests |
| `tests/integration/InputIntegration.test.ts` | Test | End-to-end tests |

## Files to Modify

| File | Changes |
|------|---------|
| `src/scenes/GalaxyMapScene.ts` | Add InputManager integration |
| `src/core/GameState.ts` | Add InputSystem instance (optional) |

---

## Definition of Done

### Functional
- [ ] All mouse clicks work on interactive elements
- [ ] Hover states display correctly
- [ ] Tab cycles through elements in logical order
- [ ] Focus indicator visible (3px border)
- [ ] Enter/Space activates focused buttons
- [ ] All 6 keyboard shortcuts work
- [ ] No shortcut conflicts with browser

### Performance
- [ ] All interactions complete within 100ms

### Accessibility
- [ ] Focus indicator meets WCAG 2.1 Level A
- [ ] All interactive elements reachable via keyboard

### Quality
- [ ] InputSystem has NO Phaser dependencies
- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] All existing tests still pass
- [ ] npm run build succeeds

---

## Architecture

```
Phaser Scene (GalaxyMapScene)
    │
    │ Uses
    ▼
InputManager.ts (src/scenes/)
    │ - Wraps Phaser input events
    │ - Manages game object interactivity
    │ - Applies visual feedback
    │
    │ Calls
    ▼
InputSystem.ts (src/core/)
    │ - Keyboard shortcut registry
    │ - Focus management
    │ - Navigation logic
    │ - NO Phaser dependencies
```
