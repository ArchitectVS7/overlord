# Story 9-3: Scenario Pack Metadata Display

**Epic:** 9 - Scenario Pack System
**Status:** drafted
**Complexity:** Low
**Implementation Tag:** [CORE-PARTIAL] - Enums exist, needs wrapper

## Story Description

As a player, I want to view scenario pack metadata including name, difficulty, AI personality, and planet count, so that I understand what gameplay experience each pack offers before selecting it.

## Acceptance Criteria

- [ ] AC1: Key metadata visible in pack list
- [ ] AC2: Expanded details show full metadata
- [ ] AC3: Packs sorted by featured/difficulty/name
- [ ] AC4: Filter by difficulty and AI personality
- [ ] AC5: Visual theme preview loads quickly
- [ ] AC6: Default pack option available

## Task Breakdown

### Task 1: Enhance PackListPanel Metadata
**File:** `src/scenes/ui/PackListPanel.ts`
**Duration:** ~15 min
- Show all key metadata fields
- Difficulty indicator icons
- AI personality badges
- Planet count range

### Task 2: Pack Filtering and Sorting
**File:** `src/scenes/ScenarioPackScene.ts`
**Duration:** ~15 min
- Add filter dropdowns
- Sort by difficulty/name
- Featured packs first
- Update list on filter change

### Task 3: Visual Theme Preview
**File:** `src/scenes/ui/PackDetailPanel.ts`
**Duration:** ~15 min
- Color theme preview
- Leader portrait placeholder
- Load within 500ms
- Handle missing assets

### Task 4: Default Pack Reset
**File:** `src/scenes/ScenarioPackScene.ts`
**Duration:** ~10 min
- "Reset to Default" button
- Clear active pack selection
- Notification on reset
- Confirm current pack status

## Definition of Done

- [ ] All metadata displays correctly
- [ ] Filtering and sorting works
- [ ] Visual preview loads fast
- [ ] Default pack reset works
- [ ] 10+ tests passing
- [ ] All acceptance criteria verified

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
// Pack metadata display
interface PackDisplayData {
  name: string;
  factionLeader: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  aiPersonality: AIPersonality;
  planetCount: string;  // e.g., "4-6 planets"
  resourceAbundance: string;
  colorTheme: number;
  portraitUrl?: string;
}
```

### Dependencies

| File | Status |
|------|--------|
| `src/scenes/ui/PackListPanel.ts` | EXTEND |
| `src/scenes/ui/PackDetailPanel.ts` | EXTEND |
| `src/scenes/ScenarioPackScene.ts` | EXTEND |
