# Story 4-1: Resource Display HUD

**Epic:** 4 - Economy Management
**Status:** DONE
**Commit:** 208a602

## Description

Display player resources and per-turn income in a HUD panel with animations and warnings for resource depletion.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | HUD visible top-right with 5 resources | ResourceHUD at (width-200, 20) | ✅ PASS |
| AC2 | Shows total + per-turn income | calculateCurrentIncome() with +X display | ✅ PASS |
| AC3 | Updates <100ms with animations (NFR-P3) | Green flash on income, timing verified | ✅ PASS |
| AC4 | Insufficient resource message format | "Insufficient [Resource]. Need X have Y" | ✅ PASS |
| AC5 | Zero-resource warnings | checkForDepletedResources() shows warning | ✅ PASS |
| AC6 | Income summary notification | showIncomeSummary() on phase change | ✅ PASS |

## Implementation Files

- `src/scenes/ui/ResourceHUD.ts` - Main HUD component (~550 lines)
- `src/scenes/GalaxyMapScene.ts` - Integration at lines 129-138
- `tests/unit/ResourceHUD.test.ts` - 43 tests

## Key Implementation Details

1. **Resource Display**
   - 5 resources: Credits, Minerals, Fuel, Food, Energy
   - Each shows: icon/label, current amount, per-turn income
   - Color-coded: Credits=yellow, Minerals=gray, Fuel=orange, Food=green, Energy=cyan

2. **Income Tracking**
   - calculateCurrentIncome() computes base + building bonuses
   - lastIncome stored for change detection
   - Green "+X" animation on positive change

3. **Warnings**
   - getMissingResources() returns formatted message
   - checkForDepletedResources() fires for zero-value resources
   - Yellow/red warning notifications

4. **Integration**
   - GalaxyMapScene creates ResourceHUD in createUI()
   - Subscribes to incomeSystem events
   - Cleanup in scene shutdown

## Test Coverage

- 43 tests covering display, updates, warnings, formatting
- Insufficient resource message format verified
