# Story 2-2: Turn System and HUD

**Epic:** 2 - Campaign Setup & Turn Flow
**Status:** DONE
**Commit:** edd8cb3 (updated with compliance fixes)

## Description

Display turn number, current phase, and End Turn button with keyboard support for phase advancement.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | Turn HUD visible top-left/center showing "Turn X" | TurnHUD container at position (150, 60) | ✅ PASS |
| AC2 | Phase indicator: Income, Action, Combat, End | phaseText shows "X Phase" | ✅ PASS |
| AC3 | Keyboard shortcut: Space or Enter | **FIXED** - Now Space/Enter (was T key) | ✅ PASS |
| AC4 | Phase notification for 1 second | **FIXED** - Changed from 500ms to 1000ms | ✅ PASS |
| AC5 | Transitions < 100ms (NFR-P3) | Performance.now() instrumentation | ✅ PASS |

## Implementation Files

- `src/scenes/ui/TurnHUD.ts` - Main HUD component (~485 lines)
- `src/core/TurnSystem.ts` - Phase state management
- `tests/unit/TurnHUD.test.ts` - 24 tests

## Key Implementation Details

1. **TurnHUD Component**
   - Extends Phaser.GameObjects.Container
   - Shows turn number, phase, End Turn button
   - Stacked notification system (C4.3-1 compliance)

2. **Keyboard Shortcuts (C2.2-1 fix)**
   - Space/Enter triggers End Turn in Action phase
   - Context-aware: only when button visible
   - Button label shows "[Space]"

3. **Notification Duration (C2.2-2 fix)**
   - Default changed from 500ms to 1000ms
   - Configurable via TurnHUDConfig.notificationDurationMs

4. **Stacked Notifications (C4.3-1)**
   - Multiple notifications appear vertically stacked
   - Max 5 notifications visible
   - Auto-cleanup on timeout

## Compliance Changes Applied

- **C2.2-1**: Changed T key to Space/Enter per design spec
- **C2.2-2**: Notification duration 500ms → 1000ms per design spec

## Test Coverage

- 24 tests for TurnHUD functionality
- Keyboard handlers, phase transitions, UI updates verified
