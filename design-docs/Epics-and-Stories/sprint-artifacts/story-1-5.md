# Story 1-5: Scenario Completion and Results Display

**Epic:** 1 - Player Onboarding & Tutorials
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-PARTIAL] - Events exist, needs UI

## Story Description

As a player, I want to see completion results when I achieve scenario victory conditions, so that I know I've succeeded and can see my performance metrics.

## Acceptance Criteria

- [ ] AC1: Victory detected within 1 second of conditions met
  - Verification: Meet victory condition, detection triggers quickly

- [ ] AC2: "Scenario Complete!" results screen displayed
  - Verification: See victory screen with results

- [ ] AC3: Results show: status, time, condition met, star rating
  - Verification: All metrics displayed correctly

- [ ] AC4: Gameplay paused during results
  - Verification: Cannot take actions while results shown

- [ ] AC5: Defeat screen shows failure info with retry option
  - Verification: Lose scenario, see defeat screen with Retry button

- [ ] AC6: Continue button returns to Flash Conflicts menu
  - Verification: Click Continue, return to menu with completion badge

## Architecture Context

**Core Integration:**
- Victory conditions checked in TurnSystem
- Completion events already exist
- Extend with scenario-specific results

**UI Pattern:**
- ScenarioResultsPanel (similar to BattleResultsPanel)
- Victory and defeat layouts
- Star rating calculation

**Dependencies:**
- Story 1-3: Victory condition checking
- TurnSystem victory events
- Timer for completion time tracking

## Task Breakdown

### Task 1: Create ScenarioResultsPanel Component
**File:** `src/scenes/ui/ScenarioResultsPanel.ts`
**Duration:** ~20 min
**Description:**
- Display "Scenario Complete!" or "Scenario Failed"
- Show completion time (MM:SS format)
- Show victory condition that was met
- Star rating display (1-3 stars)
- Continue/Retry/Exit buttons

**Tests Required:** 5 unit tests
- Victory display correct
- Defeat display correct
- Time formatted correctly
- Star rating calculated
- Buttons emit events

### Task 2: Implement Star Rating System
**File:** `src/core/StarRatingSystem.ts`
**Duration:** ~15 min
**Description:**
- Calculate stars based on completion time
- Compare to scenario target times
- 3 stars: under target, 2 stars: near target, 1 star: any completion
- Optional secondary objectives bonus

**Tests Required:** 4 tests
- 3 stars for fast completion
- 2 stars for average
- 1 star for slow
- Bonus stars for secondary objectives

### Task 3: Track Completion Time
**File:** `src/scenes/ScenarioGameScene.ts`
**Duration:** ~10 min
**Description:**
- Start timer on scenario start
- Pause timer during menus/pauses
- Stop timer on completion
- Format time for display

**Tests Required:** 3 tests
- Timer starts correctly
- Timer pauses appropriately
- Time formatted correctly

### Task 4: Victory Detection Integration
**File:** `src/scenes/ScenarioGameScene.ts`
**Duration:** ~15 min
**Description:**
- Subscribe to victory/defeat events
- Pause gameplay on result
- Show ScenarioResultsPanel
- Handle Continue/Retry buttons

**Tests Required:** 4 integration tests
- Victory shows results
- Defeat shows results
- Continue returns to menu
- Retry restarts scenario

### Task 5: Update Flash Conflicts Menu
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~10 min
**Description:**
- Show "Completed" badge on finished scenarios
- Display best time
- Update scenario list on return

**Tests Required:** 2 tests
- Badge shows on completed
- Best time displays

## Implementation Notes

**Star Rating Calculation:**
```typescript
function calculateStars(completionTime: number, targetTime: number): number {
  if (completionTime <= targetTime * 0.75) return 3; // Under 75% of target
  if (completionTime <= targetTime * 1.25) return 2; // Within 125% of target
  return 1; // Any completion
}
```

**Results Panel Display:**
```typescript
export class ScenarioResultsPanel extends Phaser.GameObjects.Container {
  showVictory(results: ScenarioResults): void {
    this.titleText.setText('🎉 Scenario Complete!');
    this.timeText.setText(`Time: ${formatTime(results.completionTime)}`);
    this.conditionText.setText(`Victory: ${results.conditionMet}`);
    this.showStars(results.starRating);
    this.showContinueButton();
    this.setVisible(true);
  }

  showDefeat(results: ScenarioResults): void {
    this.titleText.setText('💀 Scenario Failed');
    this.reasonText.setText(`Reason: ${results.defeatReason}`);
    this.showRetryButton();
    this.showExitButton();
    this.setVisible(true);
  }
}
```

**Gameplay Pause:**
```typescript
// In ScenarioGameScene
onVictory(): void {
  this.scene.pause();
  this.resultsPanel.showVictory(this.calculateResults());
}

onDefeat(reason: string): void {
  this.scene.pause();
  this.resultsPanel.showDefeat({ defeatReason: reason });
}
```

## Definition of Done

- [ ] All 5 tasks completed
- [ ] ScenarioResultsPanel shows victory/defeat
- [ ] Star rating system works
- [ ] Completion time tracked and displayed
- [ ] Gameplay pauses during results
- [ ] Continue/Retry buttons functional
- [ ] Flash Conflicts shows completion badges
- [ ] 18+ unit/integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/1-tutorials branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Scenario results
interface ScenarioResults {
  scenarioId: string;
  completed: boolean;
  completionTime: number;  // seconds
  conditionMet?: string;
  defeatReason?: string;
  starRating: 1 | 2 | 3;
  attempts: number;
}

// Star rating config (from scenario JSON)
interface StarTargets {
  threeStarTime: number;  // seconds
  twoStarTime: number;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/scenes/ScenarioGameScene.ts` | ⚠️ STORY 1-3 | Victory events needed |
| `src/scenes/FlashConflictsScene.ts` | ⚠️ STORY 1-1 | Show completion badges |
| `src/scenes/ui/ScenarioResultsPanel.ts` | ❌ CREATE | Results display |
| `src/core/StarRatingSystem.ts` | ❌ CREATE | Rating calculation |

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/ScenarioResultsPanel.test.ts` | 5 | Victory, defeat, time, stars, buttons |
| `tests/unit/StarRatingSystem.test.ts` | 4 | 3-star, 2-star, 1-star, bonus |
| `tests/integration/ScenarioCompletion.test.ts` | 4 | Full flow |
