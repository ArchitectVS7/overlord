# Story 6-3: Combat Resolution and Battle Results

**Epic:** 6 - Combat & Planetary Invasion
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-DONE] - CombatSystem complete, needs results UI

## Story Description

As a player, I want to view detailed combat results after invasions including casualties, victory/defeat status, and captured resources, so that I understand the outcome and consequences of the battle.

## Acceptance Criteria

- [ ] AC1: Battle results panel displays after combat completes
  - Verification: Launch invasion, combat resolves, results panel appears

- [ ] AC2: Victory screen shows planet name, casualties, and captured resources
  - Verification: Win a battle, see "Victory - [Planet] Conquered!", attacker/defender casualties, resource capture

- [ ] AC3: Defeat screen shows casualties and defeat reason
  - Verification: Lose a battle, see "Defeat - Invasion Failed", losses, defeat reason

- [ ] AC4: Continue button dismisses panel and updates map
  - Verification: Click Continue, panel closes, planet ownership updates on galaxy map

- [ ] AC5: Multiple battles show sequential result screens
  - Verification: Multiple invasions in one turn show separate results OR consolidated summary

- [ ] AC6: Combat events trigger UI updates via subscription
  - Verification: GalaxyMapScene subscribes to CombatSystem.onBattleCompleted

## Architecture Context

**Core Integration (Already Complete):**
- `CombatSystem.executeCombat()` returns `BattleResult` with all data
- Events available: `onBattleStarted`, `onBattleCompleted`, `onPlanetCaptured`
- `BattleResult` contains: attackerWins, casualties, platoonCasualties, planetCaptured

**UI Pattern:**
- Create BattleResultsPanel as Phaser.GameObjects.Container
- Subscribe to CombatSystem events in GalaxyMapScene
- Panel displays BattleResult data with Continue button
- Follow existing panel patterns (InvasionPanel, PlatoonLoadingPanel)

**Dependencies:**
- `CombatSystem.ts` - Events and BattleResult (no changes needed)
- `InvasionSystem.ts` - Triggers combat execution (no changes needed)
- `GalaxyMapScene.ts` - Subscribe to combat events, show results panel

## Task Breakdown

### Task 1: Create BattleResultsPanel Component
**File:** `src/scenes/ui/BattleResultsPanel.ts`
**Duration:** ~25 min
**Description:**
- Extend Phaser.GameObjects.Container
- Display victory/defeat header with planet name
- Show attacker casualties (troop count)
- Show defender casualties (troop count)
- Show captured resources (if victory)
- Add "Continue" button to dismiss

**Tests Required:** 5 unit tests
- Victory state displays correct header
- Defeat state displays correct header
- Casualty counts displayed correctly
- Resources captured shown only on victory
- Continue button emits 'dismissed' event

### Task 2: Create Victory Display Layout
**File:** `src/scenes/ui/BattleResultsPanel.ts` (same file)
**Duration:** ~15 min
**Description:**
- Green "Victory!" header
- Planet name with conquered icon
- Casualty summary (Your losses: X, Enemy losses: Y)
- Resources captured section (Credits: X, Minerals: Y, etc.)
- Surviving platoons list
- Continue button (green styling)

**Tests Required:** 3 unit tests
- Victory layout shows all required elements
- Resource capture visible
- Green victory styling applied

### Task 3: Create Defeat Display Layout
**File:** `src/scenes/ui/BattleResultsPanel.ts` (same file)
**Duration:** ~15 min
**Description:**
- Red "Defeat" header
- Planet name with failed invasion icon
- Casualty summary
- Defeat reason text (e.g., "Superior enemy defenses")
- Surviving forces (if any retreated)
- Continue button (neutral styling)

**Tests Required:** 3 unit tests
- Defeat layout shows all required elements
- Defeat reason displayed
- Red defeat styling applied

### Task 4: Integrate with GalaxyMapScene
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~15 min
**Description:**
- Import BattleResultsPanel
- Create panel instance (initially hidden)
- Subscribe to CombatSystem.onBattleCompleted event
- Show panel with result data when combat completes
- Handle 'dismissed' event to close panel
- Update planet rendering on victory (change owner color)

**Tests Required:** 3 integration tests
- Panel shows when combat completes
- Correct result data displayed
- Map updates after dismissal

### Task 5: Handle Multiple Battles
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~10 min
**Description:**
- Queue multiple battle results if simultaneous
- Show first result, then next on Continue
- Clear queue when all results shown
- Alternative: Consolidated summary view (design choice)

**Tests Required:** 2 tests
- Multiple battles queued correctly
- Sequential display works

### Task 6: Visual Polish and Animation
**File:** `src/scenes/ui/BattleResultsPanel.ts`
**Duration:** ~10 min
**Description:**
- Fade-in animation on show
- Victory confetti/particles effect (subtle)
- Defeat smoke/fade effect
- Smooth transition on Continue

**Tests Required:** Manual visual testing
- Animations feel appropriate
- Not distracting from information

## Implementation Notes

**BattleResult Data Structure (Already Exists):**
```typescript
class BattleResult {
  attackerWins: boolean;
  attackerStrength: number;
  defenderStrength: number;
  attackerCasualties: number;
  defenderCasualties: number;
  planetCaptured: boolean;
  platoonCasualties: Map<number, number>;
}
```

**Event Subscription Pattern:**
```typescript
// In GalaxyMapScene.create()
this.combatSystem.onBattleCompleted = (battle: Battle, result: BattleResult) => {
  this.showBattleResults(battle, result);
};

private showBattleResults(battle: Battle, result: BattleResult): void {
  this.battleResultsPanel.show(battle, result);
}
```

**Panel Display Pattern:**
```typescript
// In BattleResultsPanel
public show(battle: Battle, result: BattleResult): void {
  this.setBattle(battle);
  this.setResult(result);
  this.setVisible(true);
  // Animate in
}

public hide(): void {
  this.setVisible(false);
  this.emit('dismissed');
}
```

**Resource Capture (If Implementing):**
- Calculate captured resources from planet stockpile (25-50%)
- Transfer resources to attacker
- Display breakdown in results panel
- Note: May need ResourceSystem integration

## Definition of Done

- [ ] All 6 tasks completed
- [ ] BattleResultsPanel component created and tested
- [ ] Victory and defeat layouts implemented
- [ ] GalaxyMapScene shows panel on combat completion
- [ ] Multiple battles handled correctly
- [ ] 16+ unit tests written and passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Visual verification: launch invasion → see results
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/6-combat branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// BattleResultsPanel configuration
interface BattleResultsPanelConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width?: number;   // Default: 500px
  height?: number;  // Default: 400px
}

// Data to display (uses existing CombatModels)
import { Battle, BattleResult } from '@core/models/CombatModels';

// Display state
interface BattleResultsState {
  battle: Battle;
  result: BattleResult;
  capturedResources?: ResourceCapture;  // Optional enhancement
}

interface ResourceCapture {
  credits: number;
  minerals: number;
  fuel: number;
  food: number;
  energy: number;
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/core/CombatSystem.ts` | ✅ EXISTS | onBattleCompleted event already implemented |
| `src/core/models/CombatModels.ts` | ✅ EXISTS | Battle, BattleResult classes ready |
| `src/scenes/GalaxyMapScene.ts` | ✅ EXISTS | Add event subscription |
| `src/scenes/ui/InvasionPanel.ts` | ✅ EXISTS | Reference for panel pattern |

### Critical Code Examples

**BattleResultsPanel structure:**
```typescript
export class BattleResultsPanel extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private headerText: Phaser.GameObjects.Text;
  private planetText: Phaser.GameObjects.Text;
  private attackerCasualtyText: Phaser.GameObjects.Text;
  private defenderCasualtyText: Phaser.GameObjects.Text;
  private reasonText: Phaser.GameObjects.Text;
  private continueButton: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.createBackground();
    this.createHeader();
    this.createCasualtyDisplay();
    this.createContinueButton();
    this.setVisible(false);
    scene.add.existing(this);
  }

  show(battle: Battle, result: BattleResult): void {
    this.updateDisplay(battle, result);
    this.setVisible(true);
  }

  private updateDisplay(battle: Battle, result: BattleResult): void {
    if (result.attackerWins) {
      this.showVictory(battle, result);
    } else {
      this.showDefeat(battle, result);
    }
  }
}
```

**GalaxyMapScene integration:**
```typescript
// In GalaxyMapScene
private battleResultsPanel!: BattleResultsPanel;
private battleResultsQueue: Array<{battle: Battle, result: BattleResult}> = [];

create(): void {
  // ... existing code ...

  // Create results panel
  this.battleResultsPanel = new BattleResultsPanel(this, 640, 360);
  this.battleResultsPanel.on('dismissed', () => this.onResultsDismissed());

  // Subscribe to combat events
  this.combatSystem.onBattleCompleted = (battle, result) => {
    this.queueBattleResults(battle, result);
  };
}

private queueBattleResults(battle: Battle, result: BattleResult): void {
  this.battleResultsQueue.push({ battle, result });
  if (this.battleResultsQueue.length === 1) {
    this.showNextResult();
  }
}

private showNextResult(): void {
  if (this.battleResultsQueue.length > 0) {
    const { battle, result } = this.battleResultsQueue[0];
    this.battleResultsPanel.show(battle, result);
  }
}

private onResultsDismissed(): void {
  this.battleResultsQueue.shift();
  if (this.battleResultsQueue.length > 0) {
    this.showNextResult();
  } else {
    this.updatePlanetOwnership();
  }
}
```

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/BattleResultsPanel.test.ts` | 11 | Victory display, defeat display, casualty formatting, button events |
| `tests/integration/CombatResultsFlow.test.ts` | 5 | Event subscription, panel display, map update, multi-battle queue |

### Integration Points

1. **GalaxyMapScene.ts** (create): Import and create BattleResultsPanel instance
2. **GalaxyMapScene.ts** (create): Subscribe to combatSystem.onBattleCompleted
3. **GalaxyMapScene.ts** (new methods): queueBattleResults(), showNextResult(), onResultsDismissed()
4. **BattleResultsPanel.ts** (new file): Complete UI component
5. **Planet rendering** (updatePlanetOwnership): Refresh planet colors after ownership change
