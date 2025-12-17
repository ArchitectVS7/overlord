# Story 11-3: Galaxy Map Pan and Zoom Controls

**Status:** DONE
**Epic:** Epic 11 - Accessible User Interface
**Priority:** HIGH
**Implementation Tag:** [CORE-PARTIAL]

---

## User Story

**As a** player,
**I want to** navigate the galaxy map by panning and zooming,
**So that** I can explore the entire map and focus on specific areas.

---

## Acceptance Criteria

### A. Initial Camera State
- [ ] Camera is centered on player's home planet on map load
- [ ] All planets (or most) are visible in initial view
- [ ] Default zoom level is 100%

### B. Mouse Pan (Desktop)
- [ ] Click and drag with mouse pans the map
- [ ] Map scrolls in direction of drag
- [ ] Panning is smooth (60 FPS per NFR-P1)
- [ ] Panning stops when mouse button released

### C. Mouse Zoom (Desktop)
- [ ] Mouse wheel scrolling up zooms in
- [ ] Mouse wheel scrolling down zooms out
- [ ] Zoom increments smoothly (5-10% per scroll tick)
- [ ] Zoom is centered on cursor position
- [ ] Zoom limits: min 50%, max 200%

### D. Reset View
- [ ] "Reset View" or "Center on Home" button visible
- [ ] Clicking button resets camera to default position and zoom
- [ ] Transition is smooth (not instant jump)

### E. Auto-Pan to Selection
- [ ] When selecting planet outside visible area, camera pans to it
- [ ] Pan is smooth animation, not instant jump
- [ ] Zoom adjusts if needed to fit planet in view

---

## Technical Tasks

### Task 1: Create CameraController.ts (Phaser Integration)
**File:** `Overlord.Phaser/src/scenes/controllers/CameraController.ts`

- [ ] 1.1: Create CameraController class
- [ ] 1.2: Implement camera bounds (galaxy extents)
- [ ] 1.3: Implement zoom limits (0.5 to 2.0)
- [ ] 1.4: Implement centerOnPosition(x, y, smooth)
- [ ] 1.5: Implement resetView() method
- [ ] 1.6: Implement getVisibleBounds() for visibility checks

### Task 2: Implement Mouse Drag Pan
- [ ] 2.1: Add pointerdown handler to start drag
- [ ] 2.2: Track drag start position and camera scroll position
- [ ] 2.3: Add pointermove handler to update camera scroll
- [ ] 2.4: Add pointerup handler to stop drag
- [ ] 2.5: Prevent pan from conflicting with planet clicks

### Task 3: Implement Mouse Wheel Zoom
- [ ] 3.1: Add wheel event listener
- [ ] 3.2: Calculate zoom delta (5-10% per tick)
- [ ] 3.3: Get cursor world position before zoom
- [ ] 3.4: Apply zoom with limits (0.5-2.0)
- [ ] 3.5: Adjust scroll to keep cursor point stable

### Task 4: Create Reset View Button
- [ ] 4.1: Add "Reset View" button to GalaxyMapScene UI
- [ ] 4.2: Style button to match UI theme
- [ ] 4.3: Wire button click to CameraController.resetView()
- [ ] 4.4: Implement smooth transition animation

### Task 5: Implement Auto-Pan to Selection
- [ ] 5.1: Subscribe to InputSystem onElementActivated
- [ ] 5.2: Check if selected planet is in visible bounds
- [ ] 5.3: If outside bounds, smoothly pan camera to center on planet
- [ ] 5.4: Optionally adjust zoom if planet too far

### Task 6: Integrate with GalaxyMapScene
**File:** `Overlord.Phaser/src/scenes/GalaxyMapScene.ts`

- [ ] 6.1: Add CameraController to scene
- [ ] 6.2: Initialize in create() with camera and galaxy bounds
- [ ] 6.3: Find home planet and center camera on it
- [ ] 6.4: Connect planet selection to auto-pan
- [ ] 6.5: Add Reset View button to UI

### Task 7: Write Unit Tests
**File:** `Overlord.Phaser/tests/unit/CameraController.test.ts`

- [ ] 7.1: Test zoom limits enforcement
- [ ] 7.2: Test pan bounds clamping
- [ ] 7.3: Test centerOnPosition calculation
- [ ] 7.4: Test resetView restores defaults
- [ ] 7.5: Test visibility bounds calculation

---

## Files to Create

| File | Layer | Purpose |
|------|-------|---------|
| `src/scenes/controllers/CameraController.ts` | Phaser | Camera pan/zoom control |
| `tests/unit/CameraController.test.ts` | Test | Unit tests |

## Files to Modify

| File | Changes |
|------|---------|
| `src/scenes/GalaxyMapScene.ts` | Add CameraController, Reset View button |

---

## Definition of Done

### Functional
- [ ] Camera starts centered on home planet
- [ ] Mouse drag pans the map smoothly
- [ ] Mouse wheel zooms in/out centered on cursor
- [ ] Zoom limited to 50%-200%
- [ ] Reset View button works
- [ ] Selecting planet outside view pans camera

### Performance
- [ ] Panning is smooth at 60 FPS
- [ ] No visible lag or stutter during zoom

### Quality
- [ ] CameraController is in scenes/ (Phaser-specific)
- [ ] Unit tests passing
- [ ] All existing tests still pass
- [ ] npm run build succeeds

---

## Architecture

```
GalaxyMapScene
    |
    | Uses
    v
CameraController (src/scenes/controllers/)
    | - Wraps Phaser.Camera
    | - Handles pan/zoom logic
    | - Manages bounds and limits
    |
    | Uses
    v
Phaser.Cameras.Scene2D.Camera
    | - Native Phaser camera
    | - scrollX, scrollY, zoom properties
```
