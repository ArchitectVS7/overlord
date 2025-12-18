# Story 1-3: Scenario Initialization and Victory Conditions

**Epic:** 1 - Player Onboarding & Tutorials
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-PARTIAL] - Victory logic exists in TurnSystem
**Human Intervention:** PARTIAL - Scenario JSON content values

## Story Description

As a new player, I want to view victory conditions before starting a scenario and have the game initialize to the scenario's defined state, so that I understand my objectives and start with the correct game configuration.

## Acceptance Criteria

- [ ] AC1: Game state initializes from scenario JSON
  - Verification: Start scenario, see correct planets/resources/entities

- [ ] AC2: Victory conditions overlay displayed at start
  - Verification: See objectives panel with primary/secondary conditions

- [ ] AC3: Objectives panel reopenable via "O" key
  - Verification: Press O, see objectives panel

- [ ] AC4: Dismiss overlay to start gameplay
  - Verification: Click Continue, overlay closes, gameplay begins

- [ ] AC5: Malformed scenario shows error and returns to menu
  - Verification: Load bad JSON, see error, return to FlashConflicts

## Architecture Context

**Core Integration:**
- `GameState` can be initialized from scenario config
- Victory conditions checked each turn via TurnSystem
- Extend VictoryCondition types as needed

**UI Pattern:**
- ObjectivesPanel component (modal overlay)
- Keyboard shortcut integration
- Error handling UI

**Dependencies:**
- Story 1-2: ScenarioManager and Scenario model
- GameState initialization from config
- TurnSystem victory checking

## Task Breakdown

### Task 1: Create ScenarioInitializer
**File:** `src/core/ScenarioInitializer.ts`
**Duration:** ~20 min
**Description:**
- Accept Scenario config and GameState
- Initialize player planets/resources
- Initialize AI state if enabled
- Set up victory/defeat conditions
- Return initialized GameState

**Tests Required:** 5 unit tests
- Initializes player planets
- Initializes player resources
- Initializes AI correctly
- Sets victory conditions
- Handles missing optional fields

### Task 2: Extend VictoryCondition System
**File:** `src/core/VictoryConditionSystem.ts` (extend existing)
**Duration:** ~15 min
**Description:**
- Add scenario-specific victory types
- build_structure condition
- capture_planet condition
- survive_turns condition
- Check conditions each turn

**Tests Required:** 4 tests
- Build structure detected
- Capture planet detected
- Survive turns detected
- Multiple conditions combined

### Task 3: Create ObjectivesPanel Component
**File:** `src/scenes/ui/ObjectivesPanel.ts`
**Duration:** ~15 min
**Description:**
- Display victory conditions list
- Show primary and secondary objectives
- Checkmarks for completed conditions
- Estimated duration display
- "Continue" button to dismiss

**Tests Required:** 4 tests
- Displays conditions correctly
- Checkmarks update on completion
- Dismiss button works
- Keyboard shortcut works

### Task 4: Integrate into ScenarioGameScene
**File:** `src/scenes/ScenarioGameScene.ts`
**Duration:** ~20 min
**Description:**
- Create new scene for scenario gameplay
- Initialize from ScenarioInitializer
- Show ObjectivesPanel at start
- Handle "O" key to reopen panel
- Connect to victory checking

**Tests Required:** 4 integration tests
- Scene initializes from scenario
- Panel shows at start
- Keyboard shortcut works
- Victory detected correctly

### Task 5: Error Handling
**File:** `src/core/ScenarioInitializer.ts`
**Duration:** ~10 min
**Description:**
- Validate scenario config before init
- Catch and report errors clearly
- Return to FlashConflicts on error
- Log detailed error for debugging

**Tests Required:** 3 tests
- Invalid config shows error
- Returns to menu on error
- Error logged correctly

## Implementation Notes

**Scenario Initialization Flow:**
```typescript
// In ScenarioGameScene.create()
const initializer = new ScenarioInitializer();
try {
  this.gameState = initializer.initialize(this.scenario);
  this.showObjectivesPanel();
} catch (error) {
  this.showError(error.message);
  this.scene.start('FlashConflictsScene');
}
```

**Victory Condition Checking:**
```typescript
// Extended victory types
enum VictoryConditionType {
  PlanetCount,      // Existing
  MilitaryStrength, // Existing
  BuildStructure,   // NEW
  CapturePlanet,    // NEW
  SurviveTurns      // NEW
}

// Check in TurnSystem
checkScenarioVictory(scenario: Scenario, gameState: GameState): boolean {
  return scenario.victoryConditions.every(cond =>
    this.evaluateCondition(cond, gameState)
  );
}
```

**Keyboard Shortcut:**
```typescript
// In ScenarioGameScene
this.input.keyboard.on('keydown-O', () => {
  this.toggleObjectivesPanel();
});
```

## Definition of Done

- [ ] All 5 tasks completed
- [ ] ScenarioInitializer creates correct game state
- [ ] Victory conditions extended and working
- [ ] ObjectivesPanel displays and dismisses
- [ ] Keyboard shortcut functional
- [ ] Error handling robust
- [ ] 20+ unit/integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/1-tutorials branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Scenario initialization result
interface InitializationResult {
  success: boolean;
  gameState?: GameState;
  error?: string;
}

// Extended victory condition types
type VictoryConditionType =
  | 'planet_count'
  | 'military_strength'
  | 'build_structure'
  | 'capture_planet'
  | 'survive_turns'
  | 'defeat_enemy';

// Objectives display
interface ObjectiveDisplay {
  text: string;
  completed: boolean;
  primary: boolean;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/core/GameState.ts` | ✅ EXISTS | Base state management |
| `src/core/TurnSystem.ts` | ✅ EXISTS | Victory checking exists |
| `src/core/ScenarioManager.ts` | ⚠️ STORY 1-2 | Scenario loading |
| `src/scenes/ScenarioGameScene.ts` | ❌ CREATE | New gameplay scene |

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/ScenarioInitializer.test.ts` | 5 | Init planets, resources, AI, conditions, errors |
| `tests/unit/VictoryConditions.test.ts` | 4 | Build, capture, survive, combined |
| `tests/unit/ObjectivesPanel.test.ts` | 4 | Display, checkmarks, dismiss, keyboard |
| `tests/integration/ScenarioInit.test.ts` | 4 | Full init flow |
