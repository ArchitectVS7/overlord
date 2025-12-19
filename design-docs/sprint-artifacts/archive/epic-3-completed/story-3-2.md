# Story 3-2: Planet Selection and Highlighting

**Epic:** Epic 3: Galaxy Exploration & Planet Discovery
**Story ID:** 3-2
**Status:** Drafted
**Implementation Tag:** [GREENFIELD]

## Story Description

As a player, I want to click or tap planets on the galaxy map to select them with visual feedback, so that I can focus on specific planets and access their detailed information.

## Acceptance Criteria

### AC1: Click/Tap Selection
**Given** I am viewing the galaxy map
**When** I click or tap on a planet sprite
**Then** the planet becomes selected within 100ms (NFR-P3)
**And** the selected planet displays a highlight visual (glowing outline, selection ring, or border)
**And** the previously selected planet (if any) is deselected and loses its highlight

**Status:** PARTIALLY COMPLETE - InputManager provides click handling, need to verify highlight

### AC2: Selection Persistence
**Given** I have selected a planet
**When** I view the galaxy map
**Then** the selected planet's highlight remains visible
**And** the highlight animation is smooth and doesn't flicker
**And** the selection state persists until I select a different planet or deselect

**Status:** PARTIALLY COMPLETE - Selection state exists, need to verify persistence

### AC3: Touch Target Size
**Given** I am using a touch device
**When** I tap a planet
**Then** the tap target is at least 44×44 pixels (NFR-A2)
**And** the planet selection works reliably on first tap
**And** no accidental selections occur from nearby planets

**Status:** NEEDS VERIFICATION - Hit area uses planet size + 10px padding

### AC4: Keyboard Navigation
**Given** I am using keyboard navigation (accessibility requirement NFR-A1)
**When** I press Tab or arrow keys
**Then** the selection cycles through planets in a logical order (left-to-right, top-to-bottom)
**And** the selected planet is highlighted with a visible focus indicator (3px border per NFR-A1)
**And** I can press Enter or Space to confirm selection and open the planet details panel

**Status:** PARTIALLY COMPLETE - Tab navigation works, need Enter/Space confirmation

### AC5: Default Selection
**Given** no planet is currently selected
**When** the galaxy map loads
**Then** the player's home planet is automatically selected by default
**And** the selection highlight is immediately visible

**Status:** NEEDS IMPLEMENTATION - Camera centers on home planet but no auto-select

## Task Breakdown

### Task 3-2.1: Verify and Enhance Selection Highlight
**Files:** `src/scenes/GalaxyMapScene.ts` (MODIFY)

Current implementation has a yellow circle outline for focused planets. Need to:
- Ensure selection highlight is distinct from focus highlight
- Add subtle animation (pulse or glow effect)
- Make highlight 3px thick per WCAG requirements
- Verify 100ms response time

**Done when:** Selection has visible, animated highlight that meets accessibility standards

### Task 3-2.2: Add Default Planet Selection on Load
**Files:** `src/scenes/GalaxyMapScene.ts` (MODIFY)

After rendering planets, auto-select the player's home planet:
- Find first player-owned planet
- Call selectPlanet() with that planet's ID
- Ensure selection happens after InputManager registration

**Done when:** Galaxy map loads with player's home planet pre-selected

### Task 3-2.3: Verify Touch Target Sizes
**Files:** `src/scenes/renderers/PlanetRenderer.ts` (MODIFY if needed)

Verify hit areas meet 44×44px minimum:
- Current: planet size + 10px padding
- Smallest planet (Ice/Desert) = 28px + 10px = 38px (TOO SMALL)
- Need minimum hit area of 44px for all planets

**Done when:** All planets have hit areas ≥44×44 pixels

### Task 3-2.4: Enhance Keyboard Navigation
**Files:** `src/scenes/GalaxyMapScene.ts` (MODIFY)

Current Tab navigation works. Need to add:
- Arrow key navigation (not just Tab)
- Enter/Space to confirm selection and trigger panel (for Story 3-3)
- Escape to deselect current planet

**Done when:** Full keyboard navigation works per AC4

### Task 3-2.5: Add Selection State Persistence
**Files:** `src/scenes/GalaxyMapScene.ts` (MODIFY)

Ensure selection persists:
- Selection should not clear on camera pan/zoom
- Selection should survive focus changes
- Add visual distinction between "focused" and "selected"

**Done when:** Selection state is stable and persistent

### Task 3-2.6: Add Unit Tests for Selection Logic
**Files:** `tests/unit/SelectionSystem.test.ts` (NEW)

Test selection behavior:
- Selection on click
- Selection on keyboard
- Default selection on load
- Selection persistence
- Touch target size validation

**Done when:** Tests pass, coverage maintained

## Dependencies

- InputSystem (COMPLETE) - Handles keyboard/mouse events
- InputManager (COMPLETE) - Phaser integration for input
- PlanetRenderer (COMPLETE) - Planet visuals
- GalaxyMapScene (COMPLETE) - Scene integration

## Architecture Notes

- Selection is UI state, lives in GalaxyMapScene (Phaser layer)
- Core layer has no knowledge of selection (platform-agnostic)
- Event-driven: selection triggers callbacks for Story 3-3 panel

---

**Created:** 2025-12-10
**Status:** Ready for Implementation
