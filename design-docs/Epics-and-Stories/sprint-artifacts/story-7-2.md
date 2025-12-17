# Story 7-2: AI Personality and Difficulty Adaptation (Display)

**Epic:** 7 - AI Opponent System
**Status:** drafted
**Complexity:** Low
**Implementation Tag:** [CORE-DONE] - 4 personalities + 3 difficulties implemented, needs UI display

## Story Description

As a player, I want to see the AI opponent's personality (Aggressive, Defensive, Economic, Balanced) and selected difficulty level displayed in the UI, so that I understand who I'm facing and can adjust my strategy accordingly.

## Acceptance Criteria

- [ ] AC1: AI personality displayed during campaign setup
  - Verification: Start new campaign, see AI personality selection/display

- [ ] AC2: Difficulty level displayed during campaign setup
  - Verification: Start new campaign, see difficulty selection (Easy/Normal/Hard)

- [ ] AC3: AI commander portrait/name shown
  - Verification: See AI commander name (e.g., "Commander Kratos") with quote

- [ ] AC4: Personality affects visible AI behavior
  - Verification: Aggressive AI attacks more, Defensive AI builds defenses more

- [ ] AC5: Difficulty affects AI resource bonuses
  - Verification: Easy AI has -20% strength, Hard AI has +20% strength

- [ ] AC6: AI personality/difficulty displayed in game HUD
  - Verification: During gameplay, see opponent info panel with personality

## Architecture Context

**Core Integration (Already Complete):**
- `AIPersonality` enum: Aggressive, Defensive, Economic, Balanced
- `AIDifficulty` enum: Easy, Normal, Hard
- `AIPersonalityConfig`: Commander names, quotes, modifiers
- `AIDecisionSystem.getPersonality()`, `getPersonalityName()`, `getDifficulty()`

**UI Pattern:**
- Campaign setup screen shows AI configuration
- In-game opponent panel shows commander info
- Existing AIModels provide all display data

**Dependencies:**
- `AIDecisionSystem.ts` - Getters for personality/difficulty (no changes)
- `AIModels.ts` - AIPersonalityConfig with names/quotes (no changes)
- Campaign setup scene (CampaignSetupScene or similar)
- GalaxyMapScene HUD panel

## Task Breakdown

### Task 1: Create OpponentInfoPanel Component
**File:** `src/scenes/ui/components/OpponentInfoPanel.ts`
**Duration:** ~15 min
**Description:**
- Display AI commander name
- Display personality type
- Display difficulty level
- Optional: Commander portrait placeholder
- Display personality quote

**Tests Required:** 4 unit tests
- Commander name displayed
- Personality type shown
- Difficulty level shown
- Quote displayed

### Task 2: Add AI Selection to Campaign Setup
**File:** `src/scenes/CampaignSetupScene.ts` (or create if needed)
**Duration:** ~20 min
**Description:**
- Dropdown or buttons for personality selection
- Dropdown or buttons for difficulty selection
- Preview of selected AI commander
- Pass selections to AIDecisionSystem on game start

**Tests Required:** 4 unit tests
- Personality options selectable
- Difficulty options selectable
- Selections persist to game state
- Default values applied

### Task 3: Integrate OpponentInfoPanel in GalaxyMapScene
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~10 min
**Description:**
- Create OpponentInfoPanel instance in HUD
- Position in corner (top-right recommended)
- Update with current AI personality/difficulty
- Toggle visibility option

**Tests Required:** 2 integration tests
- Panel shows in HUD
- Correct data displayed

### Task 4: Add Personality Tooltips/Details
**File:** `src/scenes/ui/components/OpponentInfoPanel.ts`
**Duration:** ~10 min
**Description:**
- Hover/click shows personality details
- Explain behavior tendencies
- Show difficulty modifiers
- "Know your enemy" flavor text

**Tests Required:** 2 tests
- Tooltip shows on hover
- Correct details displayed

### Task 5: Visual Polish
**File:** Various UI components
**Duration:** ~10 min
**Description:**
- Personality icons (sword=Aggressive, shield=Defensive, coin=Economic, scales=Balanced)
- Difficulty color coding (green=Easy, yellow=Normal, red=Hard)
- Commander portrait frame
- Subtle personality-themed styling

**Tests Required:** Manual visual testing

## Implementation Notes

**AIPersonalityConfig Data (Already Exists):**
```typescript
// From AIModels.ts
static getConfig(personality: AIPersonality): AIPersonalityConfig {
  switch (personality) {
    case AIPersonality.Aggressive:
      return { name: 'Commander Kratos', quote: 'Victory through strength!', ... };
    case AIPersonality.Defensive:
      return { name: 'Admiral Chen', quote: 'A strong defense wins wars.', ... };
    case AIPersonality.Economic:
      return { name: 'Director Midas', quote: 'Credits are the true power.', ... };
    case AIPersonality.Balanced:
      return { name: 'General Theron', quote: 'Adapt or perish.', ... };
  }
}
```

**Reading AI Config:**
```typescript
// In GalaxyMapScene or OpponentInfoPanel
const personalityName = this.aiSystem.getPersonalityName(); // "Commander Kratos"
const personality = this.aiSystem.getPersonality();          // AIPersonality.Aggressive
const difficulty = this.aiSystem.getDifficulty();            // AIDifficulty.Normal
```

**Campaign Setup Flow:**
```typescript
// In CampaignSetupScene
private selectedPersonality: AIPersonality = AIPersonality.Balanced;
private selectedDifficulty: AIDifficulty = AIDifficulty.Normal;

startCampaign(): void {
  // Create AIDecisionSystem with selections
  const aiSystem = new AIDecisionSystem(
    gameState, incomeSystem, resourceSystem, buildingSystem, craftSystem, platoonSystem,
    this.selectedPersonality,
    this.selectedDifficulty
  );

  // Start game scene
  this.scene.start('GalaxyMapScene', { aiSystem, gameState, ... });
}
```

## Definition of Done

- [ ] All 5 tasks completed
- [ ] OpponentInfoPanel component displays AI info
- [ ] Campaign setup allows personality/difficulty selection
- [ ] HUD shows opponent info during gameplay
- [ ] Tooltips explain personality behavior
- [ ] 12+ unit/integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Visual verification: see AI commander in HUD
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/7-ai branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// OpponentInfoPanel configuration
interface OpponentInfoConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  personality: AIPersonality;
  difficulty: AIDifficulty;
}

// Personality display data (already in AIModels.ts)
interface AIPersonalityConfig {
  name: string;
  quote: string;
  aggressionModifier: number;
  economicModifier: number;
}

// Difficulty display
interface DifficultyDisplay {
  label: string;
  color: number;
  modifier: string;  // e.g., "-20% AI strength"
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/core/AIDecisionSystem.ts` | ✅ EXISTS | Getters implemented |
| `src/core/models/AIModels.ts` | ✅ EXISTS | AIPersonalityConfig ready |
| `src/core/models/Enums.ts` | ✅ EXISTS | AIPersonality, AIDifficulty enums |
| `src/scenes/GalaxyMapScene.ts` | ✅ EXISTS | Add HUD panel |
| `src/scenes/CampaignSetupScene.ts` | ⚠️ CHECK | May need creation |

### Critical Code Examples

**OpponentInfoPanel structure:**
```typescript
export class OpponentInfoPanel extends Phaser.GameObjects.Container {
  private nameText: Phaser.GameObjects.Text;
  private personalityText: Phaser.GameObjects.Text;
  private difficultyText: Phaser.GameObjects.Text;
  private quoteText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.createBackground();
    this.createLabels();
    scene.add.existing(this);
  }

  setOpponent(personality: AIPersonality, difficulty: AIDifficulty): void {
    const config = AIPersonalityConfig.getConfig(personality);
    this.nameText.setText(config.name);
    this.personalityText.setText(AIPersonality[personality]);
    this.difficultyText.setText(AIDifficulty[difficulty]);
    this.quoteText.setText(`"${config.quote}"`);
  }
}
```

**Campaign setup selection:**
```typescript
// Personality buttons
const personalities = [AIPersonality.Aggressive, AIPersonality.Defensive,
                       AIPersonality.Economic, AIPersonality.Balanced];

personalities.forEach((p, i) => {
  const btn = this.add.text(100, 200 + i * 50, AIPersonality[p])
    .setInteractive()
    .on('pointerdown', () => this.selectedPersonality = p);
});
```

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/OpponentInfoPanel.test.ts` | 4 | Name, personality, difficulty, quote |
| `tests/unit/CampaignSetup.test.ts` | 4 | Selection, persistence, defaults |
| `tests/integration/AIDisplay.test.ts` | 4 | HUD integration, tooltip |

### Integration Points

1. **CampaignSetupScene.ts** (modify/create): Add personality/difficulty selection UI
2. **GalaxyMapScene.ts** (create): Add OpponentInfoPanel to HUD
3. **OpponentInfoPanel.ts** (new file): Display component
4. **AIModels.ts** (no changes): Already has AIPersonalityConfig
5. **Scene transitions**: Pass AI config from setup to game
