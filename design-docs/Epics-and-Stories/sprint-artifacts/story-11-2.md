# Story 11-2: Touch Gesture Support for Mobile

**Epic**: Epic 11 - Input System Enhancement
**Status**: drafted
**Estimated Complexity**: Medium

## Story Description

Enable basic touch gestures for mobile web browsers. Focus on core functionality: tap selection and swipe camera pan. This is the foundation story - advanced gestures (pinch-zoom, long-press) will be separate stories.

## Acceptance Criteria

- [ ] AC1: Single tap on planet opens planet details panel
  - Verification: Open game on mobile device, tap any planet, verify details panel appears

- [ ] AC2: Swipe gesture on galaxy map pans the camera view
  - Verification: Touch and drag finger across screen, verify map pans smoothly in drag direction

- [ ] AC3: Touch controls work on iOS Safari 14+ and Chrome Mobile 90+
  - Verification: Test both gestures on both browsers, verify no recognition failures

- [ ] AC4: Touch targets are minimum 44×44 pixels (Apple HIG requirement)
  - Verification: Measure planet sprites and UI buttons, verify none smaller than 44×44px

- [ ] AC5: No conflicts with browser default behaviors (pull-to-refresh)
  - Verification: Perform gestures, verify browser doesn't trigger refresh outside game canvas

## Architecture Context

**Platform-Agnostic Input Abstraction:**
- Input handling must remain in Phaser scene layer (`src/scenes/`)
- Core systems (`src/core/`) receive normalized input commands, never raw touch events
- TouchGestureManager translates touch gestures into abstract commands

**Event-Driven Communication:**
- Touch gestures fire Core system methods (e.g., `SelectionSystem.selectPlanet(planetId)`)
- Core systems update GameState and fire callbacks
- Scenes subscribe to Core callbacks to update rendering

**Phaser Integration:**
- Use Phaser's built-in pointer events (`pointerdown`, `pointermove`, `pointerup`)
- Phaser normalizes mouse and touch events into unified pointer API
- Gesture recognition built on top of pointer events

## Task Breakdown

### Task 1: Create Basic TouchGestureManager
**File**: `Overlord.Phaser/src/scenes/input/TouchGestureManager.ts`
**Description**: Create foundation class to detect tap and swipe gestures from Phaser pointer events
**Dependencies**: Phaser 3 pointer API
**Test Requirements**:
- Unit tests for tap detection (pointerdown → pointerup within 300ms, movement <10px)
- Unit tests for swipe detection (movement >50px within 500ms)
- Mock pointer events to verify gesture recognition

### Task 2: Implement Planet Selection via Tap
**File**: `Overlord.Phaser/src/scenes/GalaxyMapScene.ts`
**Description**: Wire TouchGestureManager tap events to SelectionSystem.selectPlanet()
**Dependencies**: TouchGestureManager from Task 1
**Test Requirements**:
- Integration test: tap planet sprite → SelectionSystem.selectPlanet(planetId) called
- Integration test: tap empty space → deselects current selection
- Test tap coordinates correctly identify planet sprites

### Task 3: Implement Camera Pan via Swipe
**File**: `Overlord.Phaser/src/scenes/GalaxyMapScene.ts`
**Description**: Wire TouchGestureManager swipe events to camera pan functionality
**Dependencies**: TouchGestureManager from Task 1, existing camera system
**Test Requirements**:
- Integration test: swipe updates camera position in drag direction
- Test camera pan respects galaxy bounds (doesn't pan outside map)
- Test swipe velocity affects pan distance

### Task 4: Prevent Browser Gesture Interference
**File**: `Overlord.Phaser/src/config/PhaserConfig.ts`
**Description**: Configure Phaser canvas to disable browser default touch behaviors
**Dependencies**: Phaser configuration
**Test Requirements**:
- Verify CSS `touch-action: none` applied to game canvas
- Verify `preventDefault()` called on touch events to stop pull-to-refresh
- Manual test: confirm browser zoom/refresh doesn't trigger during gameplay

### Task 5: Ensure Touch Targets Meet 44×44px Minimum
**File**: `Overlord.Phaser/src/scenes/GalaxyMapScene.ts`
**Description**: Audit and adjust interactive elements to meet accessibility requirements
**Dependencies**: Existing planet sprite rendering
**Test Requirements**:
- Verify planet sprites rendered at minimum 44×44px even at min zoom
- Verify all UI buttons meet 44×44px target size
- Add debug mode to visualize touch target hit areas

## Implementation Notes

**Gesture Thresholds:**
- Tap: pointerdown → pointerup within 300ms, movement <10px
- Swipe: pointerdown → pointermove >50px → pointerup within 500ms

**Phaser Pointer Event API:**
```typescript
scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
  pointer.x, pointer.y // Position
  pointer.getDuration() // Time since pointerdown
  pointer.getDistance() // Total movement distance
});
```

**Touch Target Guidelines:**
- Minimum 44×44 CSS pixels (Apple HIG)
- Visual feedback for all touch interactions
- Clear hit areas that don't overlap

**Mobile Performance:**
- Target 30 FPS minimum (vs 60 FPS desktop)
- Debounce gesture processing to avoid excessive calculations

## Definition of Done

- [ ] All tasks completed
- [ ] Unit tests written and passing for TouchGestureManager
- [ ] Integration tests passing for planet selection and camera pan
- [ ] Manual testing on iOS Safari 14+ confirmed working
- [ ] Manual testing on Chrome Mobile 90+ confirmed working
- [ ] No build errors
- [ ] All acceptance criteria verified
- [ ] Touch target audit completed (all ≥44×44px)
- [ ] Browser gesture interference eliminated
- [ ] Code committed to epic branch