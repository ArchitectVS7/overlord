# Story 11-4: Keyboard Shortcuts System

**Epic:** Epic 11 - Accessible User Interface
**Story ID:** 11-4
**Status:** Drafted
**Implementation Tag:** [GREENFIELD]

## Story Description

As a player, I want to use keyboard shortcuts for common actions, so that I can play more efficiently and reduce mouse usage.

## Acceptance Criteria

### AC1: Help Overlay (H Key)
**Given** I am playing the game
**When** I press H
**Then** a help overlay appears showing all available keyboard shortcuts
**And** the overlay displays: Action name, Keyboard shortcut (e.g., "End Turn - Space"), Description
**And** shortcuts are organized by category (Navigation, Actions, Menus, etc.)

### AC2: Shortcuts Persist Across Scenes
**Given** I configure or learn shortcuts
**When** I transition between scenes (galaxy map, planet view, combat, etc.)
**Then** the shortcuts remain consistent and functional
**And** context-specific shortcuts activate only in appropriate scenes

### AC3: Visual Feedback
**Given** I press a keyboard shortcut
**When** the action is triggered
**Then** I receive visual feedback (button highlight, sound cue, notification)
**And** the feedback appears within 100ms (NFR-P3)

### AC4: Quick Save (Ctrl+S)
**Given** I am in gameplay
**When** I press Ctrl+S
**Then** the game saves to the most recent save slot (or creates auto-save)
**And** I see a quick notification: "Quick save complete"

### AC5: No Browser Conflicts (NFR-U4)
**Given** I use keyboard shortcuts
**When** shortcuts overlap with browser defaults (Ctrl+S, Ctrl+R, etc.)
**Then** the game shortcut takes precedence within the game canvas
**And** browser shortcuts are NOT accidentally triggered

## Task Breakdown

### Task 11-4.1: Create ShortcutRegistry Class
**File:** `Overlord.Phaser/src/core/ShortcutRegistry.ts`
**Description:** Create centralized registry for all keyboard shortcuts with categories and descriptions
**Test Requirements:**
- Unit test: Register and retrieve shortcuts by key
- Unit test: Organize shortcuts by category
- Unit test: Get all shortcuts for help display

### Task 11-4.2: Create HelpOverlay Component
**File:** `Overlord.Phaser/src/scenes/ui/HelpOverlay.ts`
**Description:** Create modal overlay displaying all shortcuts organized by category
**Test Requirements:**
- Unit test: Overlay shows/hides correctly
- Unit test: Shortcuts grouped by category
- Unit test: Accessible via keyboard (Escape to close)

### Task 11-4.3: Implement Quick Save Functionality
**File:** `Overlord.Phaser/src/scenes/GalaxyMapScene.ts` (modify)
**Description:** Wire Ctrl+S to SaveSystem.quickSave() with notification
**Test Requirements:**
- Integration test: Ctrl+S triggers save
- Integration test: Notification appears
- Unit test: SaveSystem creates valid save slot

### Task 11-4.4: Prevent Browser Shortcut Conflicts
**File:** `Overlord.Phaser/src/scenes/InputManager.ts` (modify)
**Description:** Intercept browser shortcuts within game canvas using preventDefault()
**Test Requirements:**
- Unit test: Ctrl+S doesn't trigger browser save dialog
- Unit test: Ctrl+R doesn't refresh page
- Manual test: Verify no browser conflicts

### Task 11-4.5: Add Visual Feedback for Shortcuts
**File:** `Overlord.Phaser/src/scenes/ui/TurnHUD.ts` (modify)
**Description:** Show brief flash/highlight when shortcut triggers an action
**Test Requirements:**
- Unit test: Feedback animation triggered
- Unit test: Feedback duration < 100ms
- Integration test: End Turn shows feedback on Space press

## Dependencies

- InputSystem (COMPLETE) - Core input handling
- InputManager (COMPLETE) - Phaser input integration
- SaveSystem (COMPLETE) - Save/load functionality
- TurnHUD (COMPLETE) - Turn phase display

## Architecture Notes

- ShortcutRegistry lives in Core layer (platform-agnostic)
- HelpOverlay lives in Scenes layer (Phaser UI)
- Shortcuts registered in InputManager, displayed via ShortcutRegistry
- Browser conflict prevention handled at InputManager level

## Definition of Done

- [ ] ShortcutRegistry class with category support
- [ ] HelpOverlay showing all shortcuts by category
- [ ] H key opens HelpOverlay from any game screen
- [ ] Ctrl+S performs quick save with notification
- [ ] No browser shortcut conflicts
- [ ] Visual feedback on shortcut activation
- [ ] All unit tests passing
- [ ] Build succeeds

---

**Created:** 2025-12-10
**Status:** Ready for Implementation
