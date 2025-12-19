# Story 9-2: Scenario Pack Switching and Configuration Loading

**Epic:** 9 - Scenario Pack System
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [CORE-PARTIAL] - Config support exists

## Story Description

As a player, I want to switch between scenario packs to change AI config, galaxy layout, and resources, so that I experience fresh gameplay with different strategic challenges.

## Acceptance Criteria

- [ ] AC1: Confirmation prompt before pack switch
- [ ] AC2: Pack JSON loaded and validated
- [ ] AC3: AI personality configured from pack
- [ ] AC4: Galaxy template applied from pack
- [ ] AC5: New campaigns use active pack config
- [ ] AC6: Malformed JSON falls back to default

## Task Breakdown

### Task 1: Pack Configuration Loader
**File:** `src/core/ScenarioPackManager.ts`
**Duration:** ~20 min
- Load pack JSON from assets
- Validate against schema
- Apply to game configuration
- Handle loading errors

### Task 2: Pack Switch Confirmation Dialog
**File:** `src/scenes/ui/PackSwitchDialog.ts`
**Duration:** ~15 min
- Confirmation prompt UI
- Warning about active campaigns
- Confirm/cancel buttons

### Task 3: Integrate with AIDecisionSystem
**File:** `src/scenes/GalaxyMapScene.ts`
**Duration:** ~15 min
- Apply pack AI personality
- Apply difficulty modifiers
- Configure on campaign start

### Task 4: Integrate with GalaxyGenerator
**File:** `src/core/GalaxyGenerator.ts`
**Duration:** ~15 min
- Apply galaxy template from pack
- Planet count, types, resources
- Validate template values

### Task 5: Error Handling and Fallback
**File:** `src/core/ScenarioPackManager.ts`
**Duration:** ~10 min
- Catch JSON parse errors
- Catch validation errors
- Fall back to default pack
- Log errors for debugging

## Definition of Done

- [ ] Pack switching works with confirmation
- [ ] Config applied to new campaigns
- [ ] Error handling robust
- [ ] 12+ tests passing
- [ ] All acceptance criteria verified

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
interface PackConfig {
  aiConfig: {
    personality: AIPersonality;
    difficulty: AIDifficulty;
    modifiers: AIModifiers;
  };
  galaxyTemplate: {
    planetCount: { min: number; max: number };
    planetTypes: PlanetType[];
    resourceAbundance: 'scarce' | 'standard' | 'rich';
  };
}
```

### Dependencies

| File | Status |
|------|--------|
| `src/core/ScenarioPackManager.ts` | EXTEND |
| `src/core/GalaxyGenerator.ts` | MODIFY |
| `src/core/AIDecisionSystem.ts` | NO CHANGE |
