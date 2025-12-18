# Story 3-3: Planet Information Panel

**Epic:** Epic 3: Galaxy Exploration & Planet Discovery
**Story ID:** 3-3
**Status:** Drafted
**Implementation Tag:** [CORE-PARTIAL]

## Story Description

As a player, I want to view detailed planet attributes in an information panel when a planet is selected, so that I can make informed strategic decisions about resource management and military actions.

## Acceptance Criteria

### AC1: Panel Display on Selection
**Given** I have selected a planet on the galaxy map
**When** the planet is selected
**Then** a planet information panel appears on the screen within 100ms (NFR-P3)
**And** the panel displays: planet name, planet type, owner (Player/AI/Neutral with color indicator), population, morale percentage (0-100%)

**Note:** Population maximum not available in current Core model - shows current population only.

**Status:** COMPLETE

### AC2: Resource Information
**Given** the planet information panel is displayed
**When** I view the panel
**Then** I see current resource stockpile (if planet is owned by player): Credits, Minerals, Fuel, Food, Energy
**And** resource values are clearly labeled and color-coded
**And** neutral and AI-owned planets show "Unknown" or obscured resource values (fog of war)

**Note:** Per-turn income rates will be displayed when IncomeSystem integration is complete (Epic 4). Current implementation shows stockpile amounts.

**Status:** COMPLETE

### AC3: Player-Owned Planet Options
**Given** the planet is player-owned
**When** I view the planet information panel
**Then** I see additional management options: "Build" button (disabled - Epic 4), "Manage" button (disabled - future), current buildings list (if any exist)
**And** all interactive buttons provide hover/focus feedback

**Status:** COMPLETE (buttons disabled for now, Epic 4/5/6 will enable)

### AC4: AI/Neutral Planet Display
**Given** the planet is AI-owned or Neutral
**When** I view the planet information panel
**Then** I see limited information: planet type, estimated military strength (if scouted), ownership status
**And** I see strategic options: "Scout" button (disabled), "Invade" button (disabled)
**And** unavailable actions are grayed out with tooltip explanations

**Status:** COMPLETE

### AC5: Panel Dismissal
**Given** I am viewing the planet information panel
**When** I click outside the panel or press Escape
**Then** the panel closes smoothly
**And** the planet remains selected (highlight visible)
**And** I can reopen the panel by clicking the selected planet again

**Status:** COMPLETE (backdrop for click-outside, Escape handled via scene)

### AC6: Real-time Updates (Deferred)
**Given** the planet information updates during gameplay
**When** the panel is open
**Then** the displayed information updates in real-time

**Status:** DEFERRED - Will implement with turn system integration

### AC7: High Contrast Mode (Deferred)
**Status:** DEFERRED - Will implement with Epic 11

## Task Breakdown

### Task 3-3.1: Create PlanetInfoPanel Component
**Files:** `src/scenes/ui/PlanetInfoPanel.ts` (NEW)

Create a reusable UI panel component:
- Extends Phaser.GameObjects.Container
- Fixed size: 280×350 pixels (adjustable)
- Background with border (owner color)
- Position: Right side of screen, vertically centered
- Smooth show/hide animations (fade + slide)

**Done when:** Panel component exists with show/hide methods

### Task 3-3.2: Panel Layout - Header Section
**Files:** `src/scenes/ui/PlanetInfoPanel.ts` (MODIFY)

Create header with planet identification:
- Planet name (large, bold)
- Planet type icon + label
- Owner indicator (colored badge)
- Close button (X) in top-right

**Done when:** Header displays planet name, type, owner

### Task 3-3.3: Panel Layout - Stats Section
**Files:** `src/scenes/ui/PlanetInfoPanel.ts` (MODIFY)

Display planet statistics:
- Population: current / maximum with bar
- Morale: percentage with color indicator (green/yellow/red)
- For player planets: 5 resource rates with icons
- For AI/Neutral: "Unknown" placeholders

**Done when:** Stats display correctly based on owner

### Task 3-3.4: Panel Layout - Actions Section
**Files:** `src/scenes/ui/PlanetInfoPanel.ts` (MODIFY)

Create action buttons:
- Player planets: "Build" (disabled), "Manage" (disabled)
- AI/Neutral planets: "Scout" (disabled), "Invade" (disabled)
- All buttons with hover effects
- Disabled state with tooltip explanation

**Done when:** Buttons render with correct disabled state

### Task 3-3.5: Integrate with GalaxyMapScene
**Files:** `src/scenes/GalaxyMapScene.ts` (MODIFY)

Connect panel to scene:
- Create panel instance in create()
- Show panel when planet selected
- Hide panel on Escape or click outside
- Update panel content on planet change

**Done when:** Panel shows/hides correctly with selection

### Task 3-3.6: Add Panel UI Tests
**Files:** `tests/unit/PlanetInfoPanel.test.ts` (NEW)

Test panel behavior:
- Panel content updates for different planet types
- Owner-based visibility rules
- Show/hide state management

**Done when:** Tests pass, coverage maintained

## Dependencies

- PlanetEntity (COMPLETE) - Planet data model
- GalaxyMapScene (COMPLETE) - Scene integration
- Selection system (COMPLETE from Story 3-2)

## Architecture Notes

- Panel is Phaser UI only (src/scenes/ui/)
- Reads data from Core PlanetEntity
- No Core changes needed
- Event-driven updates via callbacks

---

**Created:** 2025-12-10
**Status:** Ready for Implementation
