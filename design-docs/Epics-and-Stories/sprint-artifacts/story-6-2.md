# Story 6-2: Combat Aggression Configuration

**Epic:** 6 - Combat & Planetary Invasion
**Status:** drafted
**Complexity:** Low
**Implementation Tag:** [CORE-DONE] - CombatSystem.resolveCombat() already accepts aggression parameter

## Story Description

As a player, I want to configure combat aggression levels (0-100%) before battles, so that I can balance between aggressive attacks and conservative tactics to minimize casualties.

## Acceptance Criteria

- [ ] AC1: Aggression slider visible in invasion setup
  - Verification: Open InvasionPanel, see slider with 0-100% range

- [ ] AC2: Slider shows tactical approach labels
  - Verification: Markers at 0% (Very Conservative), 25% (Defensive), 50% (Balanced), 75% (Aggressive), 100% (All-Out Assault)

- [ ] AC3: Default value is 50% (Balanced)
  - Verification: Open fresh invasion panel, slider defaults to 50%

- [ ] AC4: Slider updates smoothly with percentage display
  - Verification: Drag slider, see "Aggression: XX%" update in real-time

- [ ] AC5: Tactical description updates with slider
  - Verification: Move slider, see description text change

- [ ] AC6: Aggression value passed to CombatSystem
  - Verification: Check combat resolution receives correct aggression value

## Architecture Context

**Core Integration:**
- `CombatSystem.resolveCombat()` already accepts `aggressionLevel: number` parameter (0-1 range)
- InvasionPanel needs to collect this value and pass it to InvasionSystem
- InvasionSystem will forward to CombatSystem during combat resolution

**UI Pattern:**
- Follow existing Phaser UI component patterns (e.g., PlatoonLoadingPanel)
- Use Phaser.GameObjects.Container for composite components
- Emit custom events for value changes
- No direct Core dependencies in UI components

**Dependencies:**
- `InvasionPanel.ts` - Add aggression slider to existing panel
- `InvasionSystem.ts` - Store aggression value, pass to CombatSystem
- `CombatSystem.ts` - Already implemented, no changes needed

## Task Breakdown

### Task 1: Create AggressionSlider Component
**File:** `src/scenes/ui/components/AggressionSlider.ts`
**Duration:** ~20 min
**Description:**
- Extend Phaser.GameObjects.Container
- Add Phaser.GameObjects.Graphics for slider track/thumb
- Add Phaser.GameObjects.Text for percentage label
- Add Phaser.GameObjects.Text for tactical description
- Range: 0-100 (UI) → convert to 0-1 for Core
- Default: 50
- Emit 'valueChanged' event with number value

**Tests Required:** 6 unit tests
- Default value is 50
- setValue() updates visual position
- Drag updates value correctly
- Value clamped to 0-100 range
- Event emitted on value change
- Percentage label updates

### Task 2: Add Tactical Approach Labels
**File:** `src/scenes/ui/components/AggressionSlider.ts` (same file)
**Duration:** ~10 min
**Description:**
- Add text labels at key positions
- 0%: "Very Conservative"
- 25%: "Defensive"
- 50%: "Balanced"
- 75%: "Aggressive"
- 100%: "All-Out Assault"
- Dynamic description updates based on current value

**Tests Required:** 3 unit tests
- Description updates for each range
- Labels positioned correctly
- Description visible and readable

### Task 3: Add Aggression Field to InvasionSystem
**File:** `src/core/InvasionSystem.ts`
**Duration:** ~10 min
**Description:**
- Add `aggressionLevel: number` to InitiateInvasion parameters
- Store in invasion state
- Pass to CombatSystem.resolveCombat() when resolving combat
- Default to 0.5 (50%) if not specified

**Tests Required:** 2 unit tests
- Aggression stored correctly in invasion state
- Default value applied when not specified

### Task 4: Integrate Slider into InvasionPanel
**File:** `src/scenes/ui/InvasionPanel.ts`
**Duration:** ~15 min
**Description:**
- Import AggressionSlider component
- Add slider to panel layout (between platoon selection and confirm button)
- Subscribe to 'valueChanged' event
- Store current aggression value
- Pass value to InvasionSystem.initiateInvasion()

**Tests Required:** 3 integration tests
- Slider appears in panel
- Value updates when slider changed
- Correct value passed to InvasionSystem

### Task 5: Visual Polish
**File:** `src/scenes/ui/components/AggressionSlider.ts`
**Duration:** ~10 min
**Description:**
- Add color gradient (green → yellow → red)
- Add hover effect on slider thumb
- Smooth drag interaction
- Add tick marks at labeled positions

**Tests Required:** Manual visual testing (scene tests)
- Colors visible and appropriate
- Hover feedback works
- Drag feels smooth

### Task 6: Integration Test - End-to-End
**File:** `tests/integration/InvasionAggressionFlow.test.ts`
**Duration:** ~15 min
**Description:**
- Test full flow: open panel → set aggression → confirm invasion → verify combat uses value
- Verify aggression value propagates from UI → InvasionSystem → CombatSystem
- Test edge cases (0%, 50%, 100%)

**Tests Required:** 3 integration tests
- Conservative setting (0%) affects combat outcome
- Balanced setting (50%) is default
- Aggressive setting (100%) affects combat outcome

## Implementation Notes

**Aggression Conversion:**
- UI displays 0-100 for user clarity
- Core systems use 0-1 (decimal) internally
- Conversion: `coreValue = uiValue / 100`

**Event Pattern:**
```typescript
this.aggressionSlider.on('valueChanged', (value: number) => {
  this.currentAggression = value / 100; // Convert to 0-1
});
```

**CombatSystem Integration:**
- CombatSystem.resolveCombat() signature includes aggressionLevel parameter
- aggressionLevel affects damage multipliers and casualty calculations
- No changes needed to CombatSystem (already implemented in Story 6-1)

**Gotchas:**
- Slider thumb needs proper drag bounds (don't let it escape slider track)
- Text labels may overlap at small screen sizes (test at 1280x720)
- Percentage display should update during drag, not just on release

## Definition of Done

- [ ] All 6 tasks completed
- [ ] AggressionSlider component created and tested
- [ ] InvasionPanel integrates slider
- [ ] InvasionSystem accepts and stores aggression value
- [ ] 14+ unit tests written and passing
- [ ] 3+ integration tests passing
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Visual verification in GalaxyMapScene → InvasionPanel
- [ ] All acceptance criteria verified
- [ ] Code committed to epic/6-combat branch

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// AggressionSlider configuration
interface AggressionSliderConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width?: number;          // Default: 400px
}

// Event payload
interface AggressionChangedEvent {
  level: number;           // 0-4 (UI) or 0-100 (percentage)
  label: string;           // Tactical description
}

// Existing InvasionContext - add aggressionLevel field
interface InvasionContext {
  // ... existing fields ...
  aggressionLevel: number;  // NEW: 0-1 range for core
}
```

### Dependencies Verification

| File | Status | Notes |
|------|--------|-------|
| `src/core/InvasionSystem.ts` | ✅ EXISTS | Add aggressionLevel to initiateInvasion() |
| `src/core/CombatSystem.ts` | ✅ EXISTS | Already accepts aggressionLevel parameter |
| `src/scenes/ui/InvasionPanel.ts` | ✅ EXISTS | Add AggressionSlider component |
| `src/scenes/ui/components/` | ❌ CREATE | New directory for slider component |

### Critical Code Examples

**AggressionSlider structure:**
```typescript
export class AggressionSlider extends Phaser.GameObjects.Container {
  private static readonly LEVELS = [
    { label: 'Very Conservative', value: 0 },
    { label: 'Defensive', value: 25 },
    { label: 'Balanced', value: 50 },
    { label: 'Aggressive', value: 75 },
    { label: 'All-Out Assault', value: 100 }
  ];

  getValue(): number { return this.currentValue; }
  setValue(value: number): void { /* clamp 0-100, update visuals */ }
}
```

**Event pattern:**
```typescript
// In InvasionPanel
this.aggressionSlider.on('valueChanged', (value: number) => {
  this.currentAggression = value / 100; // Convert to 0-1
});
```

### Test Strategy

| File | Test Count | Coverage |
|------|-----------|----------|
| `tests/unit/AggressionSlider.test.ts` | 6 | Default value, setValue, drag, clamping, events, label updates |
| `tests/unit/InvasionSystem.test.ts` | 2 | Aggression stored, default applied |
| `tests/integration/InvasionAggressionFlow.test.ts` | 3 | 0%, 50%, 100% values flow correctly |

### Integration Points

1. **InvasionPanel.ts** (~line 100): Import and instantiate AggressionSlider
2. **InvasionPanel.ts** (~line 200): Subscribe to valueChanged event
3. **InvasionPanel.ts** (launchInvasion): Pass aggression to InvasionSystem
4. **InvasionSystem.ts** (initiateInvasion): Accept optional aggressionLevel parameter
5. **InvasionSystem.ts** (combat resolution): Pass aggression to CombatSystem
