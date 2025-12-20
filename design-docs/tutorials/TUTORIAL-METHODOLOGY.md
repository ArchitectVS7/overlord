# Tutorial Creation Methodology

**Version:** 1.0.0
**Created:** 2025-12-19
**Purpose:** Standard process for creating, testing, and validating game tutorials

---

## Overview

This document establishes the standard methodology for creating tutorials that:
1. Fit into the Flash Conflicts data structure
2. Include story-driven elements and click-by-click recipes
3. Are validated by E2E tests
4. Align with design documents (PRD, stories, epics)

---

## Tutorial Creation Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TUTORIAL CREATION WORKFLOW                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│  │   PHASE 1    │───►│   PHASE 2    │───►│   PHASE 3    │           │
│  │    DESIGN    │    │    BUILD     │    │   VALIDATE   │           │
│  └──────────────┘    └──────────────┘    └──────────────┘           │
│        │                   │                   │                     │
│        ▼                   ▼                   ▼                     │
│  • Identify mechanic  • Create JSON      • Write E2E test           │
│  • Write story        • Story elements   • Run test                 │
│  • Click-by-click     • Tutorial steps   • Manual playthrough       │
│  • Review PRD         • Victory conds    • Design review            │
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐                               │
│  │   PHASE 4    │───►│   PHASE 5    │                               │
│  │    REVIEW    │    │   RELEASE    │                               │
│  └──────────────┘    └──────────────┘                               │
│        │                   │                                         │
│        ▼                   ▼                                         │
│  • Discrepancy check • Commit to repo                               │
│  • Developer review  • Update tracking                               │
│  • Iterate if needed • Document completion                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Design

### Step 1.1: Identify the Mechanic
- Select one tutorial element from TUTORIAL-ELEMENTS-LIST.md
- Define the specific learning objective
- Keep scope narrow (ONE mechanic per tutorial)

### Step 1.2: Write Story Elements
Create narrative context:
```
TITLE: [Tutorial Name]
BRIEFING: [Why the player is doing this]
OBJECTIVE: [What they must accomplish]
VICTORY: [How success is determined]
```

Example:
```
TITLE: First Command
BRIEFING: Commander, you've just arrived at your new posting.
          Your first task is simple - select your homeworld
          and review its status.
OBJECTIVE: Select Planet Alpha and view its information panel.
VICTORY: Planet info panel opens successfully.
```

### Step 1.3: Write Click-by-Click Recipe
Document exact steps the player must take:
```markdown
## Steps

### Step 1: [Action Name]
**What to do:** [Instruction]
**Expected result:** [What should happen]
**UI Element:** [Element to click/interact with]

### Step 2: ...
```

### Step 1.4: Review PRD Requirements
Cross-reference with:
- FR25-FR31 (Flash Conflicts requirements)
- Relevant epic/story requirements
- NFR-P3 (100ms UI response)
- NFR-U1 (Learnability)

---

## Phase 2: Build

### Step 2.1: Create Tutorial JSON

File location: `Overlord.Phaser/src/data/scenarios/`
Filename pattern: `tutorial-XXX-[short-name].json`

```json
{
  "id": "tutorial-003-planet-selection",
  "name": "First Command",
  "type": "tutorial",
  "difficulty": "easy",
  "duration": "2-3 min",
  "description": "Learn to select planets and view their information.",
  "prerequisites": [],

  "story": {
    "briefing": "Commander, you've arrived at your new posting...",
    "objective": "Select your homeworld and review its status.",
    "victory": "Well done! You've mastered basic planet selection."
  },

  "victoryConditions": [
    {
      "type": "ui_interaction",
      "target": "planet_info_panel_opened"
    }
  ],

  "defeatConditions": [],

  "initialState": {
    "playerPlanets": ["planet-1"],
    "playerResources": {
      "credits": 10000,
      "minerals": 5000,
      "fuel": 3000,
      "food": 2000,
      "energy": 1000
    },
    "aiPlanets": [],
    "aiEnabled": false
  },

  "tutorialSteps": [
    {
      "stepId": 1,
      "title": "Welcome",
      "message": "Welcome to Overlord, Commander. Let's start by selecting your homeworld.",
      "highlightElement": "planet-1",
      "requiredAction": "click_planet",
      "nextStepTrigger": "planet_clicked"
    },
    {
      "stepId": 2,
      "title": "Planet Selected",
      "message": "Excellent! The Planet Info Panel shows all vital information about this world.",
      "highlightElement": "planet_info_panel",
      "requiredAction": "none",
      "nextStepTrigger": "auto_complete"
    }
  ],

  "starTargets": {
    "threeStarTurns": 1,
    "twoStarTurns": 3
  }
}
```

### Step 2.2: JSON Schema Requirements

All tutorials must include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier (kebab-case) |
| name | string | Yes | Display name |
| type | "tutorial" | Yes | Must be "tutorial" |
| difficulty | "easy" | Yes | Should be "easy" for tutorials |
| duration | string | Yes | Estimated completion time |
| description | string | Yes | One-sentence summary |
| story.briefing | string | Yes | Narrative introduction |
| story.objective | string | Yes | Player's goal |
| story.victory | string | Yes | Success message |
| victoryConditions | array | Yes | How victory is determined |
| initialState | object | Yes | Starting game state |
| tutorialSteps | array | Yes | Step-by-step guidance |
| starTargets | object | No | Time-based scoring |

### Step 2.3: Tutorial Step Schema

Each tutorial step requires:

```json
{
  "stepId": 1,                      // Sequential number
  "title": "Step Title",            // Short title for display
  "message": "Instruction text...", // What player should do
  "highlightElement": "element-id", // UI element to highlight
  "requiredAction": "action_type",  // What player must do
  "nextStepTrigger": "trigger_type" // What advances to next step
}
```

**requiredAction values:**
- `"none"` - No action required (informational step)
- `"click_planet"` - Click on a planet
- `"click_button"` - Click a UI button
- `"open_panel"` - Open a specific panel
- `"build_structure"` - Complete a build action
- `"end_turn"` - End the current turn

**nextStepTrigger values:**
- `"auto_complete"` - Advances automatically after delay
- `"planet_clicked"` - Planet was clicked
- `"panel_opened"` - Panel is now visible
- `"building_started"` - Construction began
- `"turn_ended"` - Turn was ended
- `"button_clicked"` - Button was clicked

---

## Phase 3: Validate

### Step 3.1: Create E2E Test

File location: `Overlord.Phaser/tests/e2e/tutorials/`
Filename pattern: `tutorial-XXX-[short-name].spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { waitForPhaserGame, waitForScene, clickCanvasAt } from '../helpers/phaser-helpers';

test.describe('Tutorial: [Tutorial Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
  });

  test('should complete tutorial successfully', async ({ page }) => {
    // Navigate to tutorial
    // ...

    // Step 1: [Action description]
    await page.screenshot({ path: 'test-results/tutorial-XXX-step-1.png' });
    // Perform action
    // ...

    // Verify expected result
    // ...

    // Step 2: ...

    // Final verification
    await expect(...).toBeTruthy();
    await page.screenshot({ path: 'test-results/tutorial-XXX-complete.png' });
  });
});
```

### Step 3.2: Run E2E Test

```bash
cd Overlord.Phaser
npm run start &  # Start dev server in background
sleep 5          # Wait for server to start
npx playwright test tests/e2e/tutorials/tutorial-XXX-*.spec.ts --headed
```

### Step 3.3: Manual Playthrough

1. Start the game: `npm run start`
2. Navigate to Flash Conflicts menu
3. Select the new tutorial
4. Play through completely
5. Note any issues:
   - UI elements not found
   - Instructions unclear
   - Steps out of order
   - Victory doesn't trigger

### Step 3.4: Capture Screenshots

During manual playthrough, capture:
- Tutorial start screen
- Each step highlight
- Victory screen
- Any error states

---

## Phase 4: Review

### Step 4.1: Design Alignment Checklist

Compare against design documents:

```markdown
## Design Alignment Review: [Tutorial ID]

### PRD Requirements
- [ ] FR25: Accessible from Flash Conflicts menu
- [ ] FR26: Can be selected and started
- [ ] FR27: Teaches specific game mechanic
- [ ] FR29: Victory conditions visible before start
- [ ] FR30: Completion results displayed
- [ ] FR31: Completion tracked per user

### NFR Requirements
- [ ] NFR-P3: UI responds within 100ms
- [ ] NFR-U1: Tutorial completable in stated time
- [ ] NFR-A1: Keyboard navigable

### Scenario Schema
- [ ] JSON validates against schema
- [ ] All required fields present
- [ ] tutorialSteps properly structured

### Discrepancies Found
1. [Issue description] - [Severity: Low/Medium/High]
2. ...
```

### Step 4.2: Developer Review

Present findings to developer (VS7) for approval:
- E2E test results (pass/fail)
- Manual playthrough notes
- Design alignment checklist
- Recommended fixes

### Step 4.3: Iterate if Needed

If issues found:
1. Fix JSON or code
2. Re-run E2E test
3. Re-do manual playthrough
4. Update alignment checklist

---

## Phase 5: Release

### Step 5.1: Commit to Repository

```bash
git add Overlord.Phaser/src/data/scenarios/tutorial-XXX-*.json
git add Overlord.Phaser/tests/e2e/tutorials/tutorial-XXX-*.spec.ts
git add design-docs/tutorials/...
git commit -m "Add tutorial: [Tutorial Name] (T##)

- Created tutorial scenario JSON
- Added E2E test with screenshots
- Validated against PRD FR25-FR31
- Manual playthrough confirmed"
```

### Step 5.2: Update Tracking

Update TUTORIAL-ELEMENTS-LIST.md:
- Change status from "Pending" to "Complete"
- Update progress tracking table

### Step 5.3: Document Completion

Create completion record:
```markdown
## Tutorial Completion: T## - [Name]

**Date:** YYYY-MM-DD
**E2E Test:** Pass/Fail
**Manual Test:** Pass/Fail
**Design Aligned:** Yes/No
**Issues Found:** [Count]
**Issues Resolved:** [Count]
```

---

## File Templates

### Tutorial JSON Template

```json
{
  "id": "tutorial-XXX-name",
  "name": "Tutorial Name",
  "type": "tutorial",
  "difficulty": "easy",
  "duration": "X-Y min",
  "description": "One sentence description.",
  "prerequisites": [],

  "story": {
    "briefing": "Narrative introduction...",
    "objective": "What player must do.",
    "victory": "Success message."
  },

  "victoryConditions": [
    {
      "type": "condition_type",
      "target": "target_value"
    }
  ],

  "defeatConditions": [],

  "initialState": {
    "playerPlanets": ["planet-1"],
    "playerResources": {
      "credits": 10000,
      "minerals": 5000,
      "fuel": 3000,
      "food": 2000,
      "energy": 1000
    },
    "aiPlanets": [],
    "aiEnabled": false
  },

  "tutorialSteps": [
    {
      "stepId": 1,
      "title": "Step Title",
      "message": "Instruction message.",
      "highlightElement": "element-id",
      "requiredAction": "action_type",
      "nextStepTrigger": "trigger_type"
    }
  ],

  "starTargets": {
    "threeStarTurns": 1,
    "twoStarTurns": 3
  }
}
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';
import {
  waitForPhaserGame,
  waitForScene,
  clickCanvasAt,
  getPhaserCanvas
} from '../helpers/phaser-helpers';

test.describe('Tutorial T##: [Name]', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
  });

  test('should complete tutorial successfully', async ({ page }) => {
    // Step 1: Navigate to Flash Conflicts
    await page.screenshot({ path: 'test-results/tutorial-XXX-step-01-main-menu.png' });

    // TODO: Click Flash Conflicts button
    // TODO: Navigate to specific tutorial
    // TODO: Complete each step

    // Final verification
    // TODO: Verify victory condition met

    await page.screenshot({ path: 'test-results/tutorial-XXX-complete.png' });
  });

  test('should show correct tutorial steps', async ({ page }) => {
    // Verify each step displays correctly
  });
});
```

---

## Common Issues and Solutions

### Issue: Tutorial step doesn't advance
**Cause:** nextStepTrigger not matching actual event
**Solution:** Verify event name matches code implementation

### Issue: Highlight element not visible
**Cause:** Element ID doesn't match rendered element
**Solution:** Check scene code for actual element IDs

### Issue: Victory condition never triggers
**Cause:** Condition type not implemented
**Solution:** Add condition handler to VictoryConditionSystem

### Issue: E2E test times out
**Cause:** Game not fully loaded or scene not active
**Solution:** Increase waitForScene timeout, verify scene key

---

## Related Documents

- [TUTORIAL-ELEMENTS-LIST.md](./TUTORIAL-ELEMENTS-LIST.md) - All tutorial elements
- [scenario-authoring.md](../for-developers/patterns/scenario-authoring.md) - Scenario JSON guide
- [prd.md](../for-managers/prd.md) - Product requirements
- [phaser-helpers.ts](../../Overlord.Phaser/tests/e2e/helpers/phaser-helpers.ts) - E2E helpers
