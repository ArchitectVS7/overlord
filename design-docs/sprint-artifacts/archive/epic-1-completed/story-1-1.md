# Story 1-1: Flash Conflicts Menu Access

**Epic:** 1 - Player Onboarding & Tutorials
**Status:** drafted
**Complexity:** Low
**Implementation Tag:** [GREENFIELD] - New FlashConflict system

## Story Description

As a new player, I want to access a Flash Conflicts menu from the main menu, so that I can choose to learn game mechanics through tutorials before starting a campaign.

## Acceptance Criteria

- [ ] AC1: "Flash Conflicts" button visible on main menu
  - Verification: See Flash Conflicts option on MainMenuScene

- [ ] AC2: Clicking button loads FlashConflictsScene
  - Verification: Click button, scene transitions within 2 seconds

- [ ] AC3: Back button returns to main menu
  - Verification: Click Back, return to MainMenuScene

- [ ] AC4: Tutorial scenarios prominently displayed for new players
  - Verification: First-time users see "Recommended for Beginners" indicator

- [ ] AC5: Scene loads within 2 seconds (NFR-P2)
  - Verification: Measure transition time

## Architecture Context

**New Scene Required:**
- Create `FlashConflictsScene` as new Phaser scene
- Add to scene registry in PhaserConfig

**UI Pattern:**
- Follow existing scene patterns (MainMenuScene, GalaxyMapScene)
- Menu button component reusable
- Scene transition handling

**Dependencies:**
- MainMenuScene - Add Flash Conflicts button
- FlashConflictsScene - New scene
- ScenarioSystem - To be created in 1-2 (stub for now)

## Task Breakdown

### Task 1: Create FlashConflictsScene Skeleton
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~15 min
**Description:**
- Extend Phaser.Scene
- Implement preload(), create(), update()
- Add title text "Flash Conflicts"
- Add back button to return to main menu
- Register in PhaserConfig.ts

**Tests Required:** 3 unit tests
- Scene creates without errors
- Back button navigates to MainMenuScene
- Title displayed correctly

### Task 2: Add Menu Button to MainMenuScene
**File:** `src/scenes/MainMenuScene.ts`
**Duration:** ~10 min
**Description:**
- Add "Flash Conflicts" button
- Position in menu layout
- On click: transition to FlashConflictsScene
- Style consistent with other menu buttons

**Tests Required:** 2 tests
- Button visible on main menu
- Button navigates to correct scene

### Task 3: Create Placeholder Scenario List
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~15 min
**Description:**
- Display placeholder scenario cards/list
- Show tutorial scenarios with badges
- Mark first tutorial as "Recommended for Beginners"
- Prepare for data-driven list (1-2)

**Tests Required:** 2 tests
- Scenario list displays
- Beginner badge visible

### Task 4: Scene Transition Performance
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~10 min
**Description:**
- Ensure scene loads within 2 seconds
- Add loading indicator if needed
- Preload minimal assets
- Lazy load scenario data

**Tests Required:** 1 performance test
- Scene transition under 2 seconds

## Implementation Notes

**Scene Registration:**
```typescript
// In PhaserConfig.ts
scene: [BootScene, MainMenuScene, FlashConflictsScene, GalaxyMapScene, ...]
```

**Scene Transition:**
```typescript
// In MainMenuScene
this.flashConflictsBtn.on('pointerdown', () => {
  this.scene.start('FlashConflictsScene');
});

// In FlashConflictsScene
this.backBtn.on('pointerdown', () => {
  this.scene.start('MainMenuScene');
});
```

**Beginner Indicator:**
```typescript
const isFirstTime = !localStorage.getItem('flashConflicts_completed');
if (isFirstTime) {
  this.showBeginnerRecommendation();
}
```

## Definition of Done

- [ ] All 4 tasks completed
- [ ] FlashConflictsScene created and registered
- [ ] MainMenuScene has Flash Conflicts button
- [ ] Scene transition works both directions
- [ ] Beginner indicator shows for new players
- [ ] 8+ unit tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Scene loads within 2 seconds
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/1-tutorials branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Scene state
interface FlashConflictsSceneState {
  scenarios: ScenarioPreview[];
  selectedScenario: string | null;
  isFirstVisit: boolean;
}

// Scenario preview (for list display)
interface ScenarioPreview {
  id: string;
  name: string;
  type: 'tutorial' | 'tactical';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;  // e.g., "5-10 min"
  completed: boolean;
  bestTime?: number;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/scenes/MainMenuScene.ts` | ⚠️ CHECK | May need creation or modification |
| `src/config/PhaserConfig.ts` | ✅ EXISTS | Add new scene to registry |
| `src/scenes/FlashConflictsScene.ts` | ❌ CREATE | New scene file |

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/FlashConflictsScene.test.ts` | 5 | Create, back, title, list, badge |
| `tests/integration/MenuNavigation.test.ts` | 3 | Scene transitions |
