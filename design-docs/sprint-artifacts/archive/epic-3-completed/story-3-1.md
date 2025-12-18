# Story 3-1: Galaxy Generation and Visualization

**Epic:** Epic 3: Galaxy Exploration & Planet Discovery
**Story ID:** 3-1
**Status:** Drafted
**Implementation Tag:** [CORE-PARTIAL]

## Story Description

As a player, I want to see a procedurally generated galaxy with 4-6 planets displayed on an interactive map, so that I can explore the game world and plan my strategy.

## Acceptance Criteria

### AC1: Galaxy Generation
**Given** a new campaign is started
**When** the campaign loads
**Then** the GalaxyGenerator creates a galaxy with 4-6 planets with unique ID, planet type (Terran, Desert, Ice, Volcanic, Gas Giant), position coordinates, owner (Player, AI, Neutral), initial population, morale, and resource rates.

**Status:** ALREADY COMPLETE - `src/core/GalaxyGenerator.ts` implements this

### AC2: Visual Rendering
**Given** the galaxy has been generated
**When** the galaxy map scene is displayed
**Then** all planets render with visual sprite matching type, owner color indicator (green=Player, red=AI, gray=Neutral), planet name label, galaxy background shows stars/space imagery, map sized for screen resolution (1280x720 min desktop, 375x667 min mobile).

**Status:** PARTIAL - Basic rendering exists, needs enhancement

### AC3: Camera Positioning
**Given** I am viewing the galaxy map
**When** the scene first loads
**Then** camera centered on player's starting planet, all planets visible or accessible via pan/zoom, initial view loads within 100ms.

**Status:** ALREADY COMPLETE - CameraController handles this

### AC4: Deterministic Generation
**Given** multiple campaigns use the same random seed
**When** galaxies are generated with identical seeds
**Then** the same galaxy layout is produced (deterministic generation for reproducible testing).

**Status:** ALREADY COMPLETE - GalaxyGenerator uses seeded RNG

## Task Breakdown

### Task 3-1.1: Create Visual Config
**Files:** `src/config/VisualConfig.ts` (NEW)

Define visual constants for planet types and owner colors:
- Planet type colors: Terran=0x22aa22, Desert=0xddaa77, Ice=0xccffff, Volcanic=0xff4422, GasGiant=0xffaa44
- Owner ring colors: Player=0x00ff00, AI=0xff0000, Neutral=0x808080
- Planet sizes by type

**Done when:** Config file exists with exported constants

### Task 3-1.2: Create PlanetRenderer Class
**Files:** `src/scenes/renderers/PlanetRenderer.ts` (NEW)

Dedicated class for rendering planets:
- `renderPlanet(planet)` returns Container with planet graphic, owner ring, name label
- Planet body as filled circle with 3D highlight effect
- Owner indicator as colored ring around planet
- Name label below planet with stroke for readability

**Done when:** PlanetRenderer creates visually distinct planets by type and owner

### Task 3-1.3: Create StarFieldRenderer Class
**Files:** `src/scenes/renderers/StarFieldRenderer.ts` (NEW)

Multi-layer parallax star field:
- 3 layers of stars (bright distant, medium, dim near)
- Random distribution with varying brightness
- Depth set behind planets

**Done when:** Star field visible behind planets with depth effect

### Task 3-1.4: Update GalaxyMapScene
**Files:** `src/scenes/GalaxyMapScene.ts` (MODIFY)

Integrate new renderers:
- Replace rectangle rendering with PlanetRenderer
- Add StarFieldRenderer for background
- Update renderPlanets() to use new renderer
- Add responsive scale calculation

**Done when:** Scene uses new renderers, planets look better than rectangles

### Task 3-1.5: Add Unit Tests
**Files:** `tests/unit/PlanetRenderer.test.ts` (NEW), `tests/unit/StarFieldRenderer.test.ts` (NEW)

Test renderer creation and configuration:
- PlanetRenderer creates containers for each planet type
- StarFieldRenderer creates star layers
- Visual config values are correct

**Done when:** Tests pass, coverage maintained

### Task 3-1.6: Manual Visual Verification
**Files:** `tests/visual/story-3-1-checklist.md` (NEW)

Manual testing checklist:
- [ ] All 5 planet types visually distinct
- [ ] Owner rings clearly visible (green/red/gray)
- [ ] Planet names readable with stroke
- [ ] Star field visible behind planets
- [ ] Performance: 60 FPS on desktop
- [ ] Responsive: works at 1280x720 and 1920x1080

**Done when:** Checklist completed with all items passing

## Dependencies

- GalaxyGenerator (COMPLETE)
- CameraController (COMPLETE)
- InputSystem (COMPLETE)
- GalaxyMapScene (EXISTS, needs modification)

## Architecture Notes

- Core layer (`src/core/`) has NO changes - already complete
- New files go in `src/scenes/renderers/` (Phaser-specific)
- Config goes in `src/config/` (shared constants)
- Maintains platform-agnostic Core architecture

---

**Created:** 2025-12-10
**Status:** Ready for Implementation
