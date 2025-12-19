# Story 9-1: Scenario Pack Browsing and Selection

**Epic:** 9 - Scenario Pack System
**Status:** drafted
**Complexity:** Medium
**Implementation Tag:** [GREENFIELD] - Pack system + UI
**Human Intervention:** PARTIAL - Pack content definitions

## Story Description

As a player, I want to browse available scenario packs from the main menu, so that I can explore different faction themes and gameplay variations.

## Acceptance Criteria

- [ ] AC1: "Scenario Packs" option visible on main menu
- [ ] AC2: Pack browser shows available packs with metadata
- [ ] AC3: Pack details show: name, faction, AI personality, planet count, lore
- [ ] AC4: "Select Pack" button activates pack
- [ ] AC5: Locked packs show unlock requirements
- [ ] AC6: Active pack indicator visible

## Task Breakdown

### Task 1: Create ScenarioPackScene
**File:** `src/scenes/ScenarioPackScene.ts`
**Duration:** ~20 min
- Add scene to PhaserConfig
- Back button to main menu
- Pack list panel
- Pack detail panel

### Task 2: Create PackListPanel Component
**File:** `src/scenes/ui/PackListPanel.ts`
**Duration:** ~15 min
- Display pack cards
- Show name, faction, difficulty
- Selection emits event

### Task 3: Create PackDetailPanel Component
**File:** `src/scenes/ui/PackDetailPanel.ts`
**Duration:** ~15 min
- Full pack metadata display
- Lore description
- "Select Pack" button
- Locked state handling

### Task 4: Create ScenarioPackManager
**File:** `src/core/ScenarioPackManager.ts`
**Duration:** ~20 min
- Load pack configurations
- Track active pack
- Validate pack JSON
- Store selection in localStorage

### Task 5: Create Default Pack JSON
**File:** `public/assets/data/packs/default.json`
**Duration:** ~15 min (HUMAN INPUT)
- Standard campaign configuration
- Balanced AI, Normal difficulty
- Create at least 1-2 additional packs

## Definition of Done

- [ ] ScenarioPackScene created
- [ ] Pack browser displays packs
- [ ] Pack selection works
- [ ] Active pack persisted
- [ ] 15+ tests passing
- [ ] All acceptance criteria verified

---

## Pre-Planning (Game Dev)

### Data Schemas

```typescript
interface ScenarioPack {
  id: string;
  name: string;
  version: string;
  faction: FactionMetadata;
  aiConfig: AIConfig;
  galaxyTemplate: GalaxyTemplate;
  unlockRequirements?: UnlockRequirement[];
}

interface FactionMetadata {
  name: string;
  leader: string;
  lore: string;
  colorTheme: number;
}
```

### Dependencies

| File | Status |
|------|--------|
| `src/core/ScenarioPackManager.ts` | CREATE |
| `src/scenes/ScenarioPackScene.ts` | CREATE |
| `public/assets/data/packs/*.json` | CREATE |
