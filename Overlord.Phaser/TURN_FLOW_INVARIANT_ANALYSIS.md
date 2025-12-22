# Turn Flow Invariant Analysis

## Overview

This document analyzes the turn flow system in the Overlord game, identifying all phases, their entry/exit conditions, expected state mutations, and potential zero-state-change scenarios.

## Turn Phases

The game uses a 4-phase turn structure defined in `src/core/models/Enums.ts:32-37`:

```
TurnPhase.Income → TurnPhase.Action → TurnPhase.Combat → TurnPhase.End → (next turn)
```

---

## Phase-by-Phase Analysis

### 1. INCOME PHASE (`TurnPhase.Income`)

**Entry Conditions:**
- Start of new turn (from End phase) OR game start
- `gameState.currentPhase === TurnPhase.Income`

**Exit Conditions:**
- `advancePhase()` called → transitions to `TurnPhase.Action`

**State Mutations (PhaseProcessor.processIncomePhase):**

| State Property | Mutation | Source |
|----------------|----------|--------|
| `playerFaction.resources` | +income delta | `IncomeSystem.calculateFactionIncome()` |
| `aiFaction.resources` | +income delta | `IncomeSystem.calculateFactionIncome()` |
| `planet.resources.credits` | +tax revenue | `TaxationSystem.calculateFactionTaxRevenue()` |
| `planet.population` | Growth based on morale | `PopulationSystem.updateFactionPopulation()` |
| `planet.morale` | +/- based on tax rate and food | `PopulationSystem.updateMorale()` |
| `planet.growthRate` | Updated | `PopulationSystem.updatePopulationGrowth()` |
| `planet.resources.food` | -consumption | `PopulationSystem.consumeFoodForPopulation()` |
| `building.status` | Active/Damaged (crew allocation) | `IncomeSystem.allocateCrew()` |
| `building.turnsRemaining` | -1 (under construction) | `BuildingSystem.updateConstruction()` |
| `building.status` | UnderConstruction→Active | `BuildingSystem.updateConstruction()` |
| `craft.active` (Solar Satellite) | true/false (crew allocation) | `IncomeSystem.allocateCrew()` |

**Guaranteed State Changes:**
- If faction owns habitable planets with population > 0: **ALWAYS** resource/tax income
- If buildings under construction: **ALWAYS** construction progress
- If population exists: **ALWAYS** food consumption (or starvation event)

**Zero-Change Scenarios:**
- ⚠️ **Faction owns no planets** → Returns zero income (handled by `IncomeSystem.onNoPlanetsOwned`)
- ⚠️ **All planets uninhabitable** → No tax revenue, no population growth

---

### 2. ACTION PHASE (`TurnPhase.Action`)

**Entry Conditions:**
- From Income phase via `advancePhase()`
- `gameState.currentPhase === TurnPhase.Action`

**Exit Conditions:**
- Player clicks "End Turn" → transitions to `TurnPhase.Combat`

**State Mutations (Player Manual Actions):**

| State Property | Mutation | Source |
|----------------|----------|--------|
| `factionResources` | -building cost | `BuildingSystem.startConstruction()` |
| `planet.structures[]` | +new building (UnderConstruction) | `BuildingSystem.startConstruction()` |
| `planet.resources` | -craft purchase cost | `CraftSystem.purchaseCraft()` |
| `gameState.craft[]` | +new craft | `CraftSystem.purchaseCraft()` |
| `planet.population` | -troops | `PlatoonSystem.commissionPlatoon()` |
| `planet.resources.credits` | -platoon cost | `PlatoonSystem.commissionPlatoon()` |
| `gameState.platoons[]` | +new platoon | `PlatoonSystem.commissionPlatoon()` |
| `craft.planetID` | Changed | `NavigationSystem.moveShip()` |
| `planet.resources.fuel` | -fuel cost | `NavigationSystem.moveShip()` |
| `planet.taxRate` | 0-100 | `TaxationSystem.setTaxRate()` |

**Guaranteed State Changes:**
- **NONE** - This phase relies on player input

**Zero-Change Scenarios:**
- ⚠️ **Player takes no action** → Phase has NO automated processing (by design)
- `PhaseProcessor.processActionPhase()` at line 259-266 explicitly returns `{success: true, processingTimeMs: 0}` with NO mutations

---

### 3. COMBAT PHASE (`TurnPhase.Combat`)

**Entry Conditions:**
- From Action phase via `advancePhase()`
- `gameState.currentPhase === TurnPhase.Combat`

**Exit Conditions:**
- `advancePhase()` called → transitions to `TurnPhase.End`

**State Mutations (PhaseProcessor.processCombatPhase):**

| State Property | Mutation | Source |
|----------------|----------|--------|
| `craft.health` | -damage | `SpaceCombatSystem.applyDamage()` |
| `gameState.craft[]` | -destroyed craft | `SpaceCombatSystem.executeSpaceCombat()` |
| `platoon.troopCount` | -casualties | `CombatSystem.executeCombat()` |
| `gameState.platoons[]` | -destroyed platoons | `CombatSystem.executeCombat()` |
| `planet.owner` | Changed (capture) | `InvasionSystem.capturePlanet()` |
| `planet.morale` | -30 (occupation) | `InvasionSystem.capturePlanet()` |
| `planet.resources` | Cleared (captured) | `InvasionSystem.capturePlanet()` |
| `factionResources` | +captured resources | `InvasionSystem.capturePlanet()` |
| `building.status` | Active→Damaged (capture) | `InvasionSystem.capturePlanet()` |
| `platoon.planetID` | Changed (garrison) | `InvasionSystem.capturePlanet()` |
| `craft.carriedPlatoonIDs[]` | -disembarked | `InvasionSystem.capturePlanet()` |

**Guaranteed State Changes:**
- If opposing fleets at same planet: **ALWAYS** combat resolution
- If ground invasion with platoons: **ALWAYS** casualties or capture

**Zero-Change Scenarios:**
- ⚠️ **No opposing forces at any planet** → Phase produces ZERO mutations
- ⚠️ **InvasionSystem not configured** → Ground invasions skipped entirely (line 303)

---

### 4. END PHASE (`TurnPhase.End`)

**Entry Conditions:**
- From Combat phase via `advancePhase()`
- `gameState.currentPhase === TurnPhase.End`

**Exit Conditions:**
- `advancePhase()` called → checks victory, increments turn, transitions to `TurnPhase.Income`

**State Mutations (PhaseProcessor.processEndPhase):**

| State Property | Mutation | Source |
|----------------|----------|--------|
| AI Resources | -building/craft/platoon costs | `AIDecisionSystem.executeAITurn()` |
| `gameState.craft[]` | +AI purchased craft | `AIDecisionSystem.expandToNeutral()` |
| `planet.structures[]` | +AI buildings | `AIDecisionSystem.buildEconomy()` |
| `gameState.platoons[]` | +AI platoons | `AIDecisionSystem.trainMilitary()` |
| `craft.planetID` | AI fleet movement | `AIDecisionSystem.launchAttack()` |
| `planet.taxRate` | AI adjustment | `AIDecisionSystem.adjustTaxRateFallback()` |
| `gameState.currentTurn` | +1 | `TurnSystem.completeTurn()` |

**Guaranteed State Changes:**
- `gameState.currentTurn` increments (unless victory)
- AI fallback guarantees mutation via `applyFallbackAction()`:
  1. Adjust tax rate (if not at 50)
  2. Queue cheapest construction
  3. Commission cheapest platoon

**Zero-Change Scenarios:**
- ⚠️ **AIDecisionSystem not configured** → AI turn skipped (line 390-392)
- ⚠️ **AI owns no planets** → `applyFallbackAction()` returns early (line 832-836)
- ⚠️ **Victory condition met** → Turn doesn't increment (line 174)

---

## Full Turn Simulation Analysis

### PLAYER TURN FLOW

```
Income → Action → Combat → End
```

**Minimum Guaranteed Mutations:**
1. Income Phase: Resource generation (if planets exist)
2. Action Phase: **ZERO** (player-dependent)
3. Combat Phase: **ZERO** (if no enemy contact)
4. End Phase: Turn counter +1 OR victory

### AI TURN FLOW

The AI executes during End Phase with the following decision tree:

```
1. Defend (if under attack) → Commission platoon
2. Expand (if neutral planets) → Purchase Atmosphere Processor
3. Build Economy (turn < 30) → Start construction
4. Build Military (turn >= 5 OR threat > 0.8) → Commission platoon
5. Attack (if can attack) → Move fleet
6. Fallback (if no mutation) → Adjust tax rate / queue build / commission platoon
```

**AI Fingerprint Check:** Lines 957-981 create a fingerprint of:
- `aiFaction.resources`
- Tax rates across AI planets
- Queued builds count
- Fleet orders count

If fingerprint unchanged after AI turn, error is logged (line 232-243).

### COMBAT TURN FLOW

Combat occurs during Combat Phase:

1. **Space Combat** (for each planet with opposing fleets):
   - Calculate fleet strengths
   - Apply weapon/defense modifiers
   - Damage losing fleet
   - Remove destroyed craft

2. **Ground Invasion** (for planets with enemy cruisers + platoons):
   - Check orbital control
   - Land platoons
   - Execute ground combat
   - Capture planet on success

---

## CRITICAL: Zero State Change Scenarios

### ⛔ STOP CONDITION TRIGGERS

| Scenario | Phase | Root Cause | Impact |
|----------|-------|------------|--------|
| Player owns no planets | Income | No income calculation | Game effectively lost |
| Player takes no action | Action | Phase has no auto-processing | **BY DESIGN** |
| No combat encounters | Combat | No opposing forces | Normal gameplay |
| AI owns no planets | End | `applyFallbackAction()` early return | AI eliminated |
| AIDecisionSystem not configured | End | Line 390-392 skip | **BUG - AI inoperative** |
| InvasionSystem not configured | Combat | Line 303 skip | **BUG - No ground combat** |

### ⚠️ PHASES THAT CAN PRODUCE ZERO STATE CHANGE

1. **Action Phase** - **ALWAYS** produces zero automated state change (by design)
2. **Combat Phase** - Zero change if no opposing forces present
3. **End Phase** - Zero change if AI not configured OR AI owns no planets

---

## Mandatory State Mutation Recommendations

### 1. Income Phase - ✅ Already Enforced
- Tax revenue calculated even at 0% rate (base population income)
- Food consumption always occurs if population exists

### 2. Action Phase - ⚠️ No Enforcement Needed
- Player autonomy requires allowing "no action" turns
- Consider: Optional "auto-manage" for idle planets

### 3. Combat Phase - ⚠️ Consider Enforcement
```typescript
// Recommendation: Log warning if combat phase produces zero battles
if (battlesResolved === 0 && invasionsProcessed === 0) {
  console.debug('[Combat Phase] No combat occurred this turn');
}
```

### 4. End Phase - ⚠️ Critical Enforcement Exists
The AI system already enforces mutation via:
- `applyFallbackAction()` - guarantees state change
- Fingerprint check logs error if no change detected

**Remaining Gap:** If AI owns no planets, no mutation occurs and no error is logged.

---

## Test Coverage Gaps

Current `TurnSystem.test.ts` covers:
- ✅ Phase transitions
- ✅ Turn counter increment
- ✅ Victory conditions
- ✅ Event firing

**Missing Tests:**
- ❌ Zero-change scenarios for each phase
- ❌ AI fallback action verification
- ❌ Combat phase with no encounters
- ❌ Income phase with uninhabitable planets
- ❌ Full integration test: Player turn → AI turn → Combat resolution

---

## Files Analyzed

| File | Purpose |
|------|---------|
| `src/core/TurnSystem.ts` | Phase transitions, turn counter |
| `src/core/PhaseProcessor.ts` | Phase-specific processing |
| `src/core/AIDecisionSystem.ts` | AI turn execution |
| `src/core/IncomeSystem.ts` | Resource generation |
| `src/core/PopulationSystem.ts` | Population/morale updates |
| `src/core/TaxationSystem.ts` | Credit generation |
| `src/core/BuildingSystem.ts` | Construction progress |
| `src/core/SpaceCombatSystem.ts` | Fleet combat |
| `src/core/InvasionSystem.ts` | Ground combat |
| `src/core/NavigationSystem.ts` | Ship movement |
| `src/core/GameState.ts` | State container |
| `src/core/models/Enums.ts` | TurnPhase enum |
