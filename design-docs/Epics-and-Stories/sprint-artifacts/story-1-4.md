# Story 1-4: Tutorial Step Guidance System

**Epic:** 1 - Player Onboarding & Tutorials
**Status:** drafted
**Complexity:** HIGH
**Implementation Tag:** [GREENFIELD] - Tutorial engine from scratch
**Human Intervention:** YES - Tutorial step content and flow design

## Story Description

As a new player completing a tutorial scenario, I want step-by-step guidance with highlighted UI elements and instructional text, so that I learn specific game mechanics in a structured way.

## Acceptance Criteria

- [ ] AC1: First tutorial step shown at scenario start
  - Verification: Start tutorial, see step 1 with instructions

- [ ] AC2: UI elements highlighted with visual indicator
  - Verification: See glowing border/arrow on target element

- [ ] AC3: Non-essential UI dimmed during tutorial steps
  - Verification: Other UI elements grayed out

- [ ] AC4: Step completes when required action performed
  - Verification: Do required action, see "Step Complete!" indicator

- [ ] AC5: Next step auto-displays after 1 second delay
  - Verification: Complete step, next step appears after brief pause

- [ ] AC6: Final step completion closes tutorial system
  - Verification: Complete all steps, tutorial overlay closes

- [ ] AC7: Scenarios without tutorial_steps skip system
  - Verification: Tactical scenario loads without step guidance

## Architecture Context

**Complex System:**
- TutorialManager orchestrates step flow
- HighlightManager handles UI highlighting
- ActionDetector monitors user actions
- Integrates with all UI components

**UI Pattern:**
- Tutorial overlay panel
- Highlight effects (spotlight, glow, arrow)
- Progress indicator
- Step completion animations

**Dependencies:**
- Story 1-3: ScenarioGameScene exists
- All UI components need highlight support
- Action detection for various interactions

## Task Breakdown

### Task 1: Create TutorialManager Core
**File:** `src/core/TutorialManager.ts`
**Duration:** ~25 min
**Description:**
- Load tutorial steps from scenario config
- Track current step index
- Expose getCurrentStep(), nextStep(), isComplete()
- Fire events: onStepStarted, onStepCompleted, onTutorialComplete

**Tests Required:** 5 unit tests
- Loads steps correctly
- Tracks current step
- Advances on completion
- Fires correct events
- Handles no-tutorial scenarios

### Task 2: Create HighlightManager
**File:** `src/scenes/ui/TutorialHighlight.ts`
**Duration:** ~20 min
**Description:**
- Create highlight effect (glowing border)
- Create spotlight effect (dim background, bright target)
- Create arrow pointer effect
- Support multiple highlight types
- Animate highlight on/off

**Tests Required:** 4 tests
- Highlight applies to element
- Spotlight dims background
- Arrow points to element
- Animation plays correctly

### Task 3: Create ActionDetector
**File:** `src/core/TutorialActionDetector.ts`
**Duration:** ~25 min
**Description:**
- Register action listeners for step requirements
- Detect clicks on specific UI elements
- Detect game state changes (building built, etc.)
- Fire 'actionCompleted' event
- Support multiple action types

**Tests Required:** 6 tests
- Detects button click
- Detects menu open
- Detects building construction
- Detects turn end
- Detects planet selection
- Ignores incorrect actions

### Task 4: Create TutorialStepPanel Component
**File:** `src/scenes/ui/TutorialStepPanel.ts`
**Duration:** ~20 min
**Description:**
- Display step number / total
- Display instruction text
- Show "Step Complete!" animation
- Progress bar or step indicators
- Skip tutorial option (advanced users)

**Tests Required:** 4 tests
- Displays step info
- Updates on step change
- Shows completion animation
- Skip option works

### Task 5: Integrate Tutorial System
**File:** `src/scenes/ScenarioGameScene.ts`
**Duration:** ~20 min
**Description:**
- Initialize TutorialManager if tutorial scenario
- Connect HighlightManager to UI components
- Connect ActionDetector to game systems
- Show TutorialStepPanel during tutorial
- Handle tutorial completion

**Tests Required:** 5 integration tests
- Tutorial initializes correctly
- Highlights show on steps
- Actions detected and advance steps
- Tutorial completes successfully
- Non-tutorial scenarios unaffected

### Task 6: Define Tutorial Actions
**File:** `src/core/models/TutorialModels.ts`
**Duration:** ~15 min
**Description:**
- Define TutorialAction enum/types
- Map action names to detectable events
- Support parameterized actions
- Document available actions for content creators

**Tests Required:** 2 tests
- All action types mapped
- Parameters validated

### Task 7: Visual Polish
**File:** Various UI components
**Duration:** ~15 min
**Description:**
- Smooth highlight transitions
- Step completion celebration effect
- Tutorial progress animations
- Consistent styling with game UI

**Tests Required:** Manual visual testing

## Implementation Notes

**Tutorial Step JSON Structure:**
```json
{
  "tutorial_steps": [
    {
      "step": 1,
      "text": "Welcome! Click on your home planet to select it.",
      "highlight": "planet-starbase",
      "action": { "type": "select_planet", "target": "starbase" }
    },
    {
      "step": 2,
      "text": "Now open the Build menu by clicking the Build button.",
      "highlight": "build-button",
      "action": { "type": "click_button", "target": "build-menu" }
    },
    {
      "step": 3,
      "text": "Select Mining Station to begin construction.",
      "highlight": "building-mining-station",
      "action": { "type": "start_construction", "building": "MiningStation" }
    },
    {
      "step": 4,
      "text": "Great! Now end your turn to see construction progress.",
      "highlight": "end-turn-button",
      "action": { "type": "end_turn" }
    }
  ]
}
```

**TutorialManager Flow:**
```typescript
export class TutorialManager {
  private steps: TutorialStep[] = [];
  private currentIndex: number = 0;

  public onStepStarted?: (step: TutorialStep) => void;
  public onStepCompleted?: (step: TutorialStep) => void;
  public onTutorialComplete?: () => void;

  initialize(scenario: Scenario): boolean {
    if (!scenario.tutorialSteps?.length) return false;
    this.steps = scenario.tutorialSteps;
    this.startStep(0);
    return true;
  }

  completeCurrentStep(): void {
    this.onStepCompleted?.(this.getCurrentStep());
    if (this.currentIndex < this.steps.length - 1) {
      setTimeout(() => this.startStep(this.currentIndex + 1), 1000);
    } else {
      this.onTutorialComplete?.();
    }
  }
}
```

**Highlight Integration:**
```typescript
// In ScenarioGameScene
this.tutorialManager.onStepStarted = (step) => {
  this.highlightManager.highlight(step.highlight);
  this.tutorialPanel.showStep(step);
  this.actionDetector.watchFor(step.action);
};

this.actionDetector.onActionCompleted = () => {
  this.highlightManager.clear();
  this.tutorialManager.completeCurrentStep();
};
```

## Definition of Done

- [ ] All 7 tasks completed
- [ ] TutorialManager orchestrates step flow
- [ ] Highlights work on all UI elements
- [ ] Actions detected correctly
- [ ] Step panel displays instructions
- [ ] Tutorial completes successfully
- [ ] Non-tutorial scenarios unaffected
- [ ] 26+ unit/integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/1-tutorials branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Tutorial step structure
interface TutorialStep {
  step: number;
  text: string;
  highlight?: string;
  action: TutorialAction;
}

// Action types
type TutorialAction =
  | { type: 'click_button'; target: string }
  | { type: 'select_planet'; target?: string }
  | { type: 'open_menu'; menu: string }
  | { type: 'start_construction'; building: string }
  | { type: 'end_turn' }
  | { type: 'purchase_craft'; craftType: string }
  | { type: 'commission_platoon' };

// Highlight config
interface HighlightConfig {
  elementId: string;
  type: 'glow' | 'spotlight' | 'arrow';
  pulsate?: boolean;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/scenes/ScenarioGameScene.ts` | ⚠️ STORY 1-3 | Scene must exist |
| `src/core/TutorialManager.ts` | ❌ CREATE | Core orchestrator |
| `src/core/TutorialActionDetector.ts` | ❌ CREATE | Action monitoring |
| `src/scenes/ui/TutorialHighlight.ts` | ❌ CREATE | Visual effects |
| `src/scenes/ui/TutorialStepPanel.ts` | ❌ CREATE | UI panel |

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/TutorialManager.test.ts` | 5 | Load, track, advance, events, no-steps |
| `tests/unit/TutorialActionDetector.test.ts` | 6 | All action types |
| `tests/unit/TutorialHighlight.test.ts` | 4 | Effects, animations |
| `tests/unit/TutorialStepPanel.test.ts` | 4 | Display, completion |
| `tests/integration/TutorialFlow.test.ts` | 5 | End-to-end tutorial |

### Human Intervention Points

- **Tutorial step text content** - Instructional wording
- **Step sequencing** - Learning flow design
- **Action targets** - UI element IDs to highlight
- **Step count** - How many steps per tutorial
