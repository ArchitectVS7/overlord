# Story 1-2: Scenario Selection Interface

**Epic:** 1 - Player Onboarding & Tutorials
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [GREENFIELD] - Depends on 1-1
**Human Intervention:** PARTIAL - Scenario JSON content structure

## Story Description

As a new player, I want to browse available Flash Conflicts and view their details, so that I can choose an appropriate tutorial scenario to start learning.

## Acceptance Criteria

- [ ] AC1: Scenario list displays in scrollable list/grid
  - Verification: See all scenarios with name, type, difficulty, duration

- [ ] AC2: Scenarios sorted with tutorials first
  - Verification: Tutorial scenarios appear before tactical scenarios

- [ ] AC3: Clicking scenario shows expanded detail panel
  - Verification: See description, victory conditions, prerequisites, completion status

- [ ] AC4: "Start Scenario" button loads scenario
  - Verification: Click Start, scenario initializes within 2 seconds

- [ ] AC5: Prerequisites blocking shown
  - Verification: Locked scenarios show "Prerequisites Not Met" message

## Architecture Context

**Data-Driven Design:**
- Scenarios defined in JSON files
- ScenarioManager loads and validates scenarios
- Support both bundled and downloaded scenarios

**UI Pattern:**
- List/grid view component
- Detail panel component
- Follow FlashConflictsScene patterns

**Dependencies:**
- Story 1-1: FlashConflictsScene exists
- ScenarioManager: New core system
- Scenario JSON files: Need structure definition

## Task Breakdown

### Task 1: Create ScenarioManager Core System
**File:** `src/core/ScenarioManager.ts`
**Duration:** ~20 min
**Description:**
- Load scenario JSON files
- Parse and validate scenario data
- Provide getScenarios(), getScenarioById()
- Track completion status via localStorage/Supabase

**Tests Required:** 5 unit tests
- Load valid scenario JSON
- Validate required fields
- Return sorted scenario list
- Check prerequisites
- Handle invalid JSON gracefully

### Task 2: Define Scenario JSON Schema
**File:** `src/core/models/ScenarioModels.ts`
**Duration:** ~15 min
**Description:**
- Define Scenario interface
- Define ScenarioConfig interface
- Define VictoryCondition types
- Define InitialState structure
- Define TutorialStep structure (for 1-4)

**Tests Required:** 3 tests
- Schema validates correct JSON
- Schema rejects invalid JSON
- All scenario types supported

### Task 3: Create ScenarioListPanel Component
**File:** `src/scenes/ui/ScenarioListPanel.ts`
**Duration:** ~20 min
**Description:**
- Display scenario cards in grid/list
- Show name, type badge, difficulty, duration
- Support scrolling for many scenarios
- Emit 'scenarioSelected' event

**Tests Required:** 4 tests
- Renders scenario list
- Emits selection event
- Scrolling works
- Badges display correctly

### Task 4: Create ScenarioDetailPanel Component
**File:** `src/scenes/ui/ScenarioDetailPanel.ts`
**Duration:** ~20 min
**Description:**
- Show expanded scenario info
- Display description, victory conditions
- Show prerequisites and completion status
- "Start Scenario" and "Back to List" buttons

**Tests Required:** 4 tests
- Shows correct scenario data
- Start button triggers load
- Prerequisites check works
- Completion status displays

### Task 5: Integrate into FlashConflictsScene
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~15 min
**Description:**
- Add ScenarioListPanel and ScenarioDetailPanel
- Handle panel transitions
- Connect to ScenarioManager
- Start scenario on button click

**Tests Required:** 3 integration tests
- Panels display correctly
- Selection flow works
- Scenario starts successfully

### Task 6: Create Sample Tutorial Scenario JSON
**File:** `src/data/scenarios/tutorial-001.json`
**Duration:** ~10 min (HUMAN INPUT NEEDED)
**Description:**
- Create first tutorial scenario structure
- Define initial state, victory conditions
- Add tutorial steps (placeholders)
- Document schema for content creators

**Human Intervention:**
- Actual tutorial content text
- Game state configuration values
- Victory condition specifics

## Implementation Notes

**Scenario JSON Structure:**
```json
{
  "id": "tutorial-001",
  "name": "First Steps",
  "type": "tutorial",
  "difficulty": "easy",
  "duration": "5-10 min",
  "description": "Learn the basics of planet management.",
  "prerequisites": [],
  "victory_conditions": [
    { "type": "build_structure", "target": "MiningStation", "count": 1 }
  ],
  "initial_state": {
    "player_planets": ["planet-1"],
    "player_resources": { "credits": 5000, "minerals": 1000 },
    "ai_planets": [],
    "ai_enabled": false
  },
  "tutorial_steps": [
    { "step": 1, "text": "Click on your planet to select it.", "highlight": "planet" },
    { "step": 2, "text": "Open the build menu.", "highlight": "build-button" }
  ]
}
```

**ScenarioManager Pattern:**
```typescript
export class ScenarioManager {
  private scenarios: Map<string, Scenario> = new Map();

  async loadScenarios(): Promise<void> {
    const files = await this.fetchScenarioList();
    for (const file of files) {
      const scenario = await this.loadScenario(file);
      if (this.validateScenario(scenario)) {
        this.scenarios.set(scenario.id, scenario);
      }
    }
  }

  getScenarios(): Scenario[] {
    return Array.from(this.scenarios.values())
      .sort((a, b) => this.sortPriority(a) - this.sortPriority(b));
  }
}
```

## Definition of Done

- [ ] All 6 tasks completed
- [ ] ScenarioManager loads and validates scenarios
- [ ] Scenario list displays with correct sorting
- [ ] Detail panel shows all required info
- [ ] Prerequisites blocking works
- [ ] 19+ unit/integration tests passing
- [ ] Sample tutorial JSON created
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/1-tutorials branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Core scenario structure
interface Scenario {
  id: string;
  name: string;
  type: 'tutorial' | 'tactical';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  description: string;
  prerequisites: string[];
  victoryConditions: VictoryCondition[];
  defeatConditions?: DefeatCondition[];
  initialState: ScenarioInitialState;
  tutorialSteps?: TutorialStep[];
}

interface VictoryCondition {
  type: 'build_structure' | 'capture_planet' | 'defeat_enemy' | 'survive_turns';
  target?: string;
  count?: number;
  turns?: number;
}

interface ScenarioInitialState {
  playerPlanets: string[];
  playerResources: ResourceState;
  aiPlanets: string[];
  aiEnabled: boolean;
  aiPersonality?: AIPersonality;
  aiDifficulty?: AIDifficulty;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/scenes/FlashConflictsScene.ts` | ⚠️ STORY 1-1 | Created in previous story |
| `src/core/ScenarioManager.ts` | ❌ CREATE | New core system |
| `src/core/models/ScenarioModels.ts` | ❌ CREATE | New model definitions |
| `src/data/scenarios/` | ❌ CREATE | New directory for JSON files |

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/ScenarioManager.test.ts` | 5 | Load, validate, sort, prereqs, errors |
| `tests/unit/ScenarioListPanel.test.ts` | 4 | Render, events, scroll, badges |
| `tests/unit/ScenarioDetailPanel.test.ts` | 4 | Data, buttons, prereqs, status |
| `tests/integration/ScenarioSelection.test.ts` | 3 | Flow from list to start |

---

## Implementation Complete (AI Agent)

**Date:** 2025-12-11
**Status:** Ready for Review

### All Tasks Completed

- [x] Task 1: ScenarioManager core system created (8 tests passing)
- [x] Task 2: ScenarioModels TypeScript interfaces defined
- [x] Task 3: ScenarioListPanel UI component created (4 tests passing)
- [x] Task 4: ScenarioDetailPanel UI component created (4 tests passing)
- [x] Task 5: FlashConflictsScene integration (3 integration tests passing)
- [x] Task 6: Sample tutorial JSON created (tutorial-001.json)

### Files Created/Modified

**Core Systems:**
- `src/core/ScenarioManager.ts` - Scenario loading, validation, and completion tracking
- `src/core/models/ScenarioModels.ts` - TypeScript interfaces for scenarios

**UI Components:**
- `src/scenes/ui/ScenarioListPanel.ts` - Scrollable scenario list with type badges
- `src/scenes/ui/ScenarioDetailPanel.ts` - Detailed scenario view with prerequisites check

**Integration:**
- `src/scenes/FlashConflictsScene.ts` - Minimal scene created for integration (Story 1-1 stub)

**Data:**
- `src/data/scenarios/tutorial-001.json` - Sample tutorial with 4 tutorial steps

**Tests (19 new tests):**
- `tests/unit/ScenarioManager.test.ts` (8 tests)
- `tests/unit/ScenarioListPanel.test.ts` (4 tests)
- `tests/unit/ScenarioDetailPanel.test.ts` (4 tests)
- `tests/integration/ScenarioSelection.test.ts` (3 tests)

### Test Results

- **Total tests:** 798 (all passing)
- **New tests added:** 19
- **Build status:** Success (TypeScript compiles without errors)
- **Coverage:** All acceptance criteria tested

### Acceptance Criteria Verification

- [x] AC1: Scenario list displays in scrollable list/grid ✓
- [x] AC2: Scenarios sorted with tutorials first ✓
- [x] AC3: Clicking scenario shows expanded detail panel ✓
- [x] AC4: "Start Scenario" button loads scenario ✓
- [x] AC5: Prerequisites blocking shown ✓

### Notes

**FlashConflictsScene Dependency:**
Story 1-1 (Flash Conflicts Menu Access) is marked as "drafted" but not yet implemented. A minimal FlashConflictsScene was created to enable Story 1-2 integration and testing. The full FlashConflictsScene implementation should be completed in Story 1-1.

**Tutorial Content:**
The sample tutorial JSON (`tutorial-001.json`) uses placeholder text and game state values. Actual tutorial content, narrative text, and balanced resource values should be reviewed and refined by game design.

**Ready for Review:**
All technical implementation is complete and tested. Code review can proceed.
