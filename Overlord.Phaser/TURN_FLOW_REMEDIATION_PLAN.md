# Turn Flow Invariant Remediation Plan

## Executive Summary

This plan addresses the issues identified in `TURN_FLOW_INVARIANT_ANALYSIS.md`, focusing on:
1. Runtime validation to catch misconfiguration
2. Test coverage for zero-state-change scenarios
3. Defensive error handling for edge cases

---

## Issues to Remediate

### Issue 1: AIDecisionSystem Not Configured Warning
**Location:** `PhaseProcessor.ts:390-392`
**Severity:** Medium
**Problem:** Silent warning when AI system not configured - game appears broken

### Issue 2: InvasionSystem Not Configured
**Location:** `PhaseProcessor.ts:303`
**Severity:** Medium
**Problem:** Ground invasions silently skipped if not configured

### Issue 3: AI Owns No Planets - Silent Failure
**Location:** `AIDecisionSystem.ts:832-836`
**Severity:** Low
**Problem:** `applyFallbackAction()` returns early without logging defeat state

### Issue 4: Missing Zero-Change Test Coverage
**Location:** `tests/unit/PhaseProcessor.test.ts`, `tests/unit/TurnSystem.test.ts`
**Severity:** Medium
**Problem:** No tests verify behavior when phases produce no mutations

### Issue 5: No Integration Test for Full Turn Cycle
**Location:** `tests/`
**Severity:** High
**Problem:** No test validates complete Player→AI→Combat flow

---

## Remediation Steps

### Step 1: Add Configuration Validation to PhaseProcessor

**File:** `src/core/PhaseProcessor.ts`

**Changes:**
1. Add `validateConfiguration()` method that checks if required systems are configured
2. Add `isFullyConfigured()` getter for UI to display warnings
3. Change warnings to structured error events

```typescript
// Add to PhaseProcessor class:

public isAIConfigured(): boolean {
  return this.aiDecisionSystem !== undefined;
}

public isInvasionConfigured(): boolean {
  return this.invasionSystem !== undefined;
}

public validateConfiguration(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!this.aiDecisionSystem) {
    warnings.push('AIDecisionSystem not configured - AI will not take turns');
  }

  if (!this.invasionSystem) {
    warnings.push('InvasionSystem not configured - ground invasions disabled');
  }

  return { valid: warnings.length === 0, warnings };
}
```

---

### Step 2: Add AI Defeat Detection to AIDecisionSystem

**File:** `src/core/AIDecisionSystem.ts`

**Changes:**
1. Add `onAIDefeated` event callback
2. Fire event when AI owns no planets in `applyFallbackAction()`
3. Log structured defeat state

```typescript
// Add event:
public onAIDefeated?: () => void;

// Modify applyFallbackAction():
private applyFallbackAction(): void {
  this.fallbackAttempted = true;

  const aiPlanets = this.gameState.planets.filter(p => p.owner === FactionType.AI);
  if (aiPlanets.length === 0) {
    console.warn('[AI] AI owns no planets - defeat imminent');
    this.onAIDefeated?.();  // NEW: Fire defeat event
    return;
  }
  // ... rest of method
}
```

---

### Step 3: Add Zero-Change Scenario Tests

**File:** `tests/unit/PhaseProcessor.test.ts`

**New Test Suite:**

```typescript
describe('Zero-state-change scenarios', () => {
  describe('Income Phase - No planets owned', () => {
    it('should return zero income when faction owns no planets', () => {
      // Remove all player planets
      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.Player);
      gameState.rebuildLookups();

      const result = phaseProcessor.processIncomePhase() as IncomePhaseResult;

      expect(result.success).toBe(true);
      expect(result.playerIncome.credits).toBe(0);
      expect(result.playerIncome.minerals).toBe(0);
      expect(result.playerIncome.fuel).toBe(0);
      expect(result.playerIncome.food).toBe(0);
    });

    it('should fire onNoPlanetsOwned event', () => {
      let firedFaction: FactionType | undefined;
      phaseProcessor.getIncomeSystem().onNoPlanetsOwned = (faction) => {
        firedFaction = faction;
      };

      gameState.planets = gameState.planets.filter(p => p.owner !== FactionType.Player);
      gameState.rebuildLookups();

      phaseProcessor.processIncomePhase();

      expect(firedFaction).toBe(FactionType.Player);
    });
  });

  describe('Combat Phase - No encounters', () => {
    it('should return zero battles when no opposing forces', () => {
      const result = phaseProcessor.processCombatPhase();

      expect(result.success).toBe(true);
      expect(result.battlesResolved).toBe(0);
      expect(result.invasionsProcessed).toBe(0);
    });
  });

  describe('End Phase - AI not configured', () => {
    it('should return aiTurnProcessed=false when AI not configured', () => {
      // PhaseProcessor created without configureEndPhase()
      const result = phaseProcessor.processEndPhase() as EndPhaseResult;

      expect(result.success).toBe(true);
      expect(result.aiTurnProcessed).toBe(false);
    });
  });
});
```

---

### Step 4: Add Integration Test for Full Turn Cycle

**File:** `tests/integration/TurnCycle.test.ts` (NEW FILE)

```typescript
import { GameState } from '@core/GameState';
import { TurnSystem } from '@core/TurnSystem';
import { PhaseProcessor } from '@core/PhaseProcessor';
import { AIDecisionSystem } from '@core/AIDecisionSystem';
import { TurnPhase, FactionType, VictoryResult } from '@core/models/Enums';
// ... other imports

describe('Full Turn Cycle Integration', () => {
  let gameState: GameState;
  let turnSystem: TurnSystem;
  let phaseProcessor: PhaseProcessor;
  let aiDecisionSystem: AIDecisionSystem;

  beforeEach(() => {
    gameState = createFullGameState(); // Includes buildings, craft, platoons
    turnSystem = new TurnSystem(gameState);
    phaseProcessor = new PhaseProcessor(gameState);

    // Configure AI
    aiDecisionSystem = new AIDecisionSystem(
      gameState,
      phaseProcessor.getIncomeSystem(),
      phaseProcessor.getResourceSystem(),
      phaseProcessor.getBuildingSystem(),
      // ... craftSystem, platoonSystem
    );

    phaseProcessor.configureEndPhase({
      aiDecisionSystem,
      victoryChecker: () => turnSystem.checkVictoryConditions(),
    });
  });

  describe('Player Turn Flow', () => {
    it('should produce state changes across full turn cycle', () => {
      const initialResources = gameState.playerFaction.resources.credits;
      const initialTurn = gameState.currentTurn;

      // Income Phase
      turnSystem.startNewGame();
      phaseProcessor.processPhase(TurnPhase.Income);
      expect(gameState.playerFaction.resources.credits).toBeGreaterThan(initialResources);

      // Action Phase (no auto changes)
      turnSystem.advancePhase();
      phaseProcessor.processPhase(TurnPhase.Action);

      // Combat Phase
      turnSystem.advancePhase();
      phaseProcessor.processPhase(TurnPhase.Combat);

      // End Phase (AI turn)
      turnSystem.advancePhase();
      const endResult = phaseProcessor.processPhase(TurnPhase.End);
      expect(endResult.aiTurnProcessed).toBe(true);

      // Next turn
      turnSystem.advancePhase();
      expect(gameState.currentTurn).toBe(initialTurn + 1);
    });
  });

  describe('AI Turn Guarantees State Change', () => {
    it('should always mutate state during AI turn', () => {
      const beforeCredits = gameState.aiFaction.resources.credits;
      const beforePlanets = gameState.planets.filter(p => p.owner === FactionType.AI);

      // Snapshot AI state
      const beforeTaxRates = beforePlanets.map(p => p.taxRate);
      const beforeBuildCount = beforePlanets.reduce(
        (sum, p) => sum + p.structures.length, 0
      );

      // Execute AI turn
      aiDecisionSystem.executeAITurn();

      // Verify at least one change occurred
      const afterCredits = gameState.aiFaction.resources.credits;
      const afterPlanets = gameState.planets.filter(p => p.owner === FactionType.AI);
      const afterTaxRates = afterPlanets.map(p => p.taxRate);
      const afterBuildCount = afterPlanets.reduce(
        (sum, p) => sum + p.structures.length, 0
      );

      const stateChanged =
        afterCredits !== beforeCredits ||
        JSON.stringify(afterTaxRates) !== JSON.stringify(beforeTaxRates) ||
        afterBuildCount !== beforeBuildCount;

      expect(stateChanged).toBe(true);
    });
  });

  describe('Combat Resolution', () => {
    it('should resolve space combat when fleets meet', () => {
      // Setup: Place opposing fleets at same planet
      setupOpposingFleetsAtPlanet(gameState, 0);

      const initialCraftCount = gameState.craft.length;

      phaseProcessor.processCombatPhase();

      // Combat should destroy at least one craft
      expect(gameState.craft.length).toBeLessThan(initialCraftCount);
    });
  });
});

function createFullGameState(): GameState {
  // Create game state with:
  // - 2 player planets with buildings + population
  // - 2 AI planets with buildings + population
  // - 1 neutral planet
  // - Battle Cruisers for both factions
  // - Platoons for both factions
  // - Sufficient resources for AI actions
}

function setupOpposingFleetsAtPlanet(gameState: GameState, planetId: number): void {
  // Place player and AI Battle Cruisers at same planet
}
```

---

### Step 5: Add PhaseProcessor Configuration Warnings to UI

**File:** `src/scenes/GalaxyMapScene.ts`

**Changes:**
Add configuration validation check during scene initialization:

```typescript
// In create() method, after configureEndPhase():
const configStatus = this.phaseProcessor.validateConfiguration();
if (!configStatus.valid) {
  console.warn('[GalaxyMapScene] PhaseProcessor configuration warnings:', configStatus.warnings);
  // Optionally show UI warning
}
```

---

## Implementation Order

| Step | Priority | Estimated Changes | Files |
|------|----------|-------------------|-------|
| 1 | High | +30 lines | `PhaseProcessor.ts` |
| 2 | Medium | +10 lines | `AIDecisionSystem.ts` |
| 3 | High | +80 lines | `PhaseProcessor.test.ts` |
| 4 | High | +150 lines | `TurnCycle.test.ts` (new) |
| 5 | Low | +10 lines | `GalaxyMapScene.ts` |

---

## Acceptance Criteria

1. [ ] `PhaseProcessor.validateConfiguration()` returns structured warnings
2. [ ] `AIDecisionSystem.onAIDefeated` event fires when AI owns no planets
3. [ ] Tests exist for all zero-state-change scenarios
4. [ ] Integration test covers full turn cycle with state verification
5. [ ] All new tests pass with `npm test`
6. [ ] No console errors during normal gameplay

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing tests | Run `npm test` after each change |
| Performance regression | Verify NFR-P3 tests still pass (<2s per phase) |
| Integration test flakiness | Use deterministic random seed for AI |

---

## Out of Scope

- Action Phase mandatory mutations (by design - player autonomy)
- Real-time combat visualization
- Network/multiplayer considerations
