# Story 8-1: Tactical Scenario Content and Variety

**Epic:** 8 - Quick-Play Tactical Scenarios
**Status:** review
**Complexity:** Medium
**Implementation Tag:** [GREENFIELD] - Scenario content definitions
**Human Intervention:** YES - Tactical scenario content design required (COMPLETED)

## Story Description

As a player who has completed tutorial scenarios, I want to access tactical Flash Conflicts as quick-play challenges, so that I can enjoy fast, replayable strategic gameplay during short play sessions.

## Acceptance Criteria

- [x] AC1: Tactical scenarios visible after completing tutorial
  - Verification: Complete tutorial, see tactical scenarios unlocked
  - Implementation: `isScenarioUnlocked()` in ScenarioListPanel checks prerequisites

- [x] AC2: Tactical scenarios marked with "Tactical" badge
  - Verification: See badge differentiating from Tutorial type
  - Implementation: ScenarioListPanel shows type badge with TACTICAL_BADGE_COLOR

- [x] AC3: Scenarios sorted by difficulty (Easy → Expert)
  - Verification: List shows difficulty-ordered scenarios
  - Implementation: `renderScenarioCards()` sorts by DIFFICULTY_ORDER

- [x] AC4: Varied objectives available
  - Verification: See "Conquer planets", "Defend", "Resource race", "Fleet battle" types
  - Implementation: 6 scenarios with varied victory conditions created

- [x] AC5: No tutorial overlay in tactical scenarios
  - Verification: Start tactical scenario, jump straight to gameplay
  - Implementation: Tactical scenarios have no tutorialSteps field

- [x] AC6: Completion tracked with star rating
  - Verification: Complete scenario, see stars and best time
  - Implementation: starTargets field in each scenario JSON

## Architecture Context

**Reuses Epic 1 Infrastructure:**
- ScenarioManager loads tactical scenarios (same as tutorials)
- ScenarioGameScene handles gameplay (tutorial steps disabled)
- ScenarioResultsPanel shows completion (same UI)
- ScenarioProgressService tracks history (same persistence)

**New Content Only:**
- Tactical scenario JSON files
- Varied victory condition configurations
- Special rules support

**Dependencies:**
- Epic 1 complete (all story infrastructure)
- ScenarioManager supports tactical type
- VictoryConditionSystem handles all objective types

## Task Breakdown

### Task 1: Create Tactical Scenario JSON Files (HUMAN INPUT)
**File:** `src/data/scenarios/tactical-*.json`
**Duration:** ~30 min (content design)
**Description:**
- Create 4-6 tactical scenario JSON files
- Cover varied objectives and difficulties
- Configure initial states and victory conditions
- Define special rules if applicable

**Human Intervention Required:**
- Scenario names and themes
- Victory condition values
- Initial state configurations
- Difficulty balancing

**Files to Create:**
- `tactical-001-conquest.json` - Conquer 3 planets in 10 turns
- `tactical-002-defense.json` - Defend against invasion
- `tactical-003-resource-race.json` - Reach 5000 credits first
- `tactical-004-fleet-battle.json` - Destroy all enemy ships
- `tactical-005-blitz.json` - Speed conquest (Hard)
- `tactical-006-last-stand.json` - Defend with limited forces (Expert)

### Task 2: Extend VictoryConditionSystem
**File:** `src/core/VictoryConditionSystem.ts`
**Duration:** ~15 min
**Description:**
- Add "resource_race" victory type
- Add "destroy_all_ships" victory type
- Add "survive_time" victory type
- Handle special rules constraints

**Tests Required:** 4 tests
- Resource race detected correctly
- Ship destruction victory works
- Survive timer works
- Special rules applied

### Task 3: Add Difficulty Filtering to ScenarioListPanel
**File:** `src/scenes/ui/ScenarioListPanel.ts`
**Duration:** ~15 min
**Description:**
- Add difficulty filter (All, Easy, Medium, Hard, Expert)
- Sort by difficulty within filter
- Show difficulty badge prominently
- Color coding by difficulty

**Tests Required:** 3 tests
- Filter works correctly
- Sorting works
- Visual badges display

### Task 4: Add Prerequisites to Scenario List
**File:** `src/scenes/FlashConflictsScene.ts`
**Duration:** ~15 min
**Description:**
- Check tutorial completion before showing tactical
- Gray out locked scenarios
- Show "Complete tutorial to unlock" message
- Update on completion

**Tests Required:** 3 tests
- Locked scenarios grayed
- Unlock message shown
- Updates after tutorial completion

### Task 5: Special Rules Display
**File:** `src/scenes/ui/ScenarioDetailPanel.ts`
**Duration:** ~10 min
**Description:**
- Display special rules in detail panel
- Explain rule effects
- Visual distinction from normal rules
- Support multiple rules

**Tests Required:** 2 tests
- Rules display correctly
- Multiple rules handled

## Implementation Notes

**Tactical Scenario JSON Example:**
```json
{
  "id": "tactical-001-conquest",
  "name": "Planetary Conquest",
  "type": "tactical",
  "difficulty": "medium",
  "duration": "10-15 min",
  "description": "Conquer 3 enemy planets before turn 15.",
  "prerequisites": ["tutorial-001"],
  "victory_conditions": [
    { "type": "capture_planet", "count": 3, "turns_limit": 15 }
  ],
  "defeat_conditions": [
    { "type": "turn_limit", "turns": 15 },
    { "type": "home_planet_lost" }
  ],
  "special_rules": [],
  "initial_state": {
    "player_planets": ["planet-1"],
    "player_resources": { "credits": 10000, "minerals": 2000, "fuel": 1000 },
    "player_craft": [
      { "type": "BattleCruiser", "planet": "planet-1" },
      { "type": "BattleCruiser", "planet": "planet-1" }
    ],
    "player_platoons": [
      { "troops": 200, "equipment": "Standard", "weapon": "Rifle" },
      { "troops": 200, "equipment": "Standard", "weapon": "Rifle" }
    ],
    "ai_planets": ["planet-2", "planet-3", "planet-4"],
    "ai_enabled": true,
    "ai_personality": "Defensive",
    "ai_difficulty": "Normal"
  },
  "star_targets": {
    "three_star_turns": 8,
    "two_star_turns": 12
  }
}
```

**Special Rules Support:**
```json
{
  "special_rules": [
    { "type": "no_new_platoons", "description": "Cannot commission new platoons" },
    { "type": "limited_resources", "description": "No resource income" },
    { "type": "fog_of_war", "description": "Enemy planets hidden until scouted" }
  ]
}
```

**Victory Condition Extensions:**
```typescript
// In VictoryConditionSystem
evaluateCondition(condition: VictoryCondition, gameState: GameState): boolean {
  switch (condition.type) {
    case 'capture_planet':
      return this.checkPlanetsCaptured(gameState, condition.count);
    case 'resource_race':
      return this.checkResourceTarget(gameState, condition.resource, condition.target);
    case 'destroy_all_ships':
      return this.checkEnemyShipsDestroyed(gameState);
    case 'survive_turns':
      return gameState.currentTurn >= condition.turns;
    // ... other types
  }
}
```

## Definition of Done

- [ ] All 5 tasks completed
- [ ] 4-6 tactical scenario JSON files created
- [ ] Victory conditions extended for new types
- [ ] Difficulty filter working
- [ ] Prerequisites check working
- [ ] Special rules display working
- [ ] 12+ unit/integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/8-scenarios branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Special rule types
interface SpecialRule {
  type: 'no_new_platoons' | 'no_new_craft' | 'limited_resources' | 'fog_of_war' | 'time_limit';
  description: string;
  value?: number;
}

// Extended victory condition
interface TacticalVictoryCondition extends VictoryCondition {
  turnsLimit?: number;
  resource?: ResourceType;
  target?: number;
}

// Star rating targets for tactical
interface StarTargets {
  threeStarTurns?: number;
  twoStarTurns?: number;
  threeStarTime?: number;
  twoStarTime?: number;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| All Epic 1 stories | ⚠️ REQUIRED | Infrastructure prerequisite |
| `src/core/VictoryConditionSystem.ts` | ⚠️ EXTEND | Add new condition types |
| `src/data/scenarios/tactical-*.json` | ❌ CREATE | Scenario content files |

### Human Intervention Points

- **Scenario themes and names** - Creative content
- **Victory condition values** - Game balance
- **Initial state configurations** - Difficulty tuning
- **Special rules design** - Unique challenges

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/VictoryConditions.test.ts` | 4 | New victory types |
| `tests/unit/ScenarioFilter.test.ts` | 3 | Difficulty filtering |
| `tests/integration/TacticalScenarios.test.ts` | 5 | Full flow |
