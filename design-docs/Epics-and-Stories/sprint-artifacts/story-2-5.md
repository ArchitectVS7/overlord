# Story 2-5: Defeat Detection and Screen

**Epic:** 2 - Campaign Setup & Turn Flow
**Status:** DONE
**Commit:** 159fe93 (updated with compliance fixes)

## Description

Detect defeat condition (all player planets lost) and display defeat screen with retry functionality.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | Defeat detected within 1 second | GalaxyMapScene checks on phase change | ✅ PASS |
| AC2 | Defeat screen shows final statistics | DefeatScene with stats panel | ✅ PASS |
| AC3 | "Retry Campaign" with same settings | **FIXED** - Passes previousDifficulty/previousPersonality (C2.5-1) | ✅ PASS |
| AC4 | "Main Menu" returns to menu | Button navigates to MainMenuScene | ✅ PASS |
| AC5 | "Save Campaign" preserves state | Saves to localStorage with timestamp | ✅ PASS |

## Implementation Files

- `src/scenes/DefeatScene.ts` - Defeat screen (~398 lines)
- `src/scenes/CampaignConfigScene.ts` - Receives retry settings
- `src/scenes/GalaxyMapScene.ts` - Defeat detection check
- `tests/unit/DefeatScene.test.ts` - 12 tests

## Key Implementation Details

1. **Defeat Detection**
   - GalaxyMapScene.checkVictoryDefeat() on phase changes
   - Defeat when player owns 0 planets
   - Transitions to DefeatScene via scene.start()

2. **Statistics Display**
   - Turns survived
   - Planets lost to AI
   - Remaining military forces
   - Final resources

3. **Retry Campaign (C2.5-1 fix)**
   - tryAgain() extracts gameState.campaignConfig
   - Passes {previousDifficulty, previousPersonality} to CampaignConfigScene
   - CampaignConfigScene.init() applies previous settings
   - Player sees same difficulty/personality pre-selected

4. **Save Campaign**
   - Saves to localStorage with "defeat-{timestamp}" slot
   - Preserves full game state for analysis

## Compliance Changes Applied

- **C2.5-1**: "Retry Campaign" now preserves difficulty and AI personality settings

## Test Coverage

- 12 tests for DefeatScene
- Statistics calculation, retry with settings, save functionality verified
