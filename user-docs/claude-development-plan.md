# Overlord Phase A: Multi-Agent Orchestration Plan

## Overview

Execute Phase A Core Gameplay Loop (7 epics, 22 stories) using a three-agent workflow pattern with sequential story processing and epic-based git branching.

**Target**: All stories in `backlog` → `done` with full test suite validation

---

## Workflow Pattern (Per Story)

```
┌─────────────────────────────────────────────────────────────┐
│ STORY CYCLE                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. PLANNING (technical-writer agent)                        │
│    - Read story from epics.md                               │
│    - Expand into detailed task plan with acceptance criteria│
│    - Create story file in sprint-artifacts/                 │
│    - Update sprint-status.yaml: backlog → drafted           │
│                                                             │
│ 2. IMPLEMENTATION (game-developer agent)                    │
│    - Load story file + architecture context                 │
│    - Execute tasks with TDD (RED→GREEN→REFACTOR)            │
│    - Write unit tests for new code                          │
│    - Update sprint-status.yaml: drafted → in-progress → review│
│    - Commit changes                                         │
│                                                             │
│ 3. REVIEW (code-reviewer agent)                             │
│    - Verify acceptance criteria met                         │
│    - Check architecture compliance (no Core→Phaser imports) │
│    - Ensure tests pass: npm test                            │
│    - Find 3-10 issues (adversarial review)                  │
│    - IF issues: return to step 2                            │
│    - IF approved: update status → done                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Git Branching Strategy

**Pattern**: Sequential from main

```
main ─┬─> epic/11-input ─(merge)─> main ─┬─> epic/3-planets ─(merge)─> main ─┬─> ...
      │                                  │                                   │
      └── tag: v0.1.0-input             └── tag: v0.2.0-planets             └──
```

**Branch Naming**: `epic/{epic-num}-{short-name}`

**Per-Epic Git Flow**:
1. `git checkout main && git pull`
2. `git checkout -b epic/{num}-{name}`
3. Implement all stories (commits on epic branch)
4. After all stories done: `git checkout main && git merge epic/{num}-{name}`
5. `git tag -a v0.{phase}.{epic} -m "Epic {num} complete"`
6. `git push origin main --tags`
7. Delete epic branch: `git branch -d epic/{num}-{name}`

---

## Phase A Epic Sequence

| Order | Epic | Stories | Implementation Tag | Key Files to Create/Modify |
|-------|------|---------|-------------------|---------------------------|
| 1 | **Epic 11** (partial) | 11-1, 11-3 | GREENFIELD | `src/core/InputSystem.ts`, `src/scenes/GalaxyMapScene.ts` |
| 2 | **Epic 3** | 3-1, 3-2, 3-3 | CORE-PARTIAL | `src/scenes/GalaxyMapScene.ts`, `src/scenes/ui/PlanetInfoPanel.ts` |
| 3 | **Epic 2** | 2-1, 2-2, 2-3, 2-4, 2-5 | CORE-DONE | `src/scenes/MainMenuScene.ts`, `src/scenes/ui/TurnHUD.ts` |
| 4 | **Epic 4** | 4-1, 4-2, 4-3, 4-4 | CORE-DONE | `src/scenes/ui/ResourceHUD.ts`, `src/scenes/BuildingMenuScene.ts` |
| 5 | **Epic 5** | 5-1, 5-2, 5-3, 5-4, 5-5 | CORE-DONE | `src/scenes/PlatoonMenuScene.ts`, `src/scenes/NavigationScene.ts` |
| 6 | **Epic 6** | 6-1, 6-2, 6-3 | CORE-DONE | `src/scenes/InvasionScene.ts`, `src/scenes/CombatResultsScene.ts` |
| 7 | **Epic 7** | 7-1, 7-2 | CORE-DONE | `src/scenes/ui/AINotificationPanel.ts` |

---

## Detailed Story Breakdown

### Epic 11: Input System Foundation (Stories 11-1, 11-3 ONLY)

**Story 11-1: Mouse and Keyboard Input Support** [GREENFIELD]
- Create platform-agnostic `InputSystem.ts` in `src/core/`
- Mouse click detection on interactive elements
- Keyboard shortcuts: Tab, Enter, Escape, Space, Arrow keys
- Focus management with visible 3px indicators
- Response time < 100ms (NFR-P3)

**Story 11-3: Galaxy Map Pan and Zoom Controls** [CORE-PARTIAL]
- Mouse drag to pan galaxy map
- Mouse wheel zoom (50%-200% range)
- Arrow keys for pan, +/- for zoom
- "Reset View" button to center on home planet

### Epic 3: Planet Selection & Info Panels (3 Stories)

**Story 3-1**: Galaxy visualization with planet type colors
**Story 3-2**: Click/tap planet selection with highlight effect
**Story 3-3**: Planet info panel (name, type, owner, resources)

### Epic 2: Campaign Setup & Turn Flow (5 Stories)

**Story 2-1**: Campaign creation UI (difficulty + AI personality)
**Story 2-2**: Turn HUD (turn number, phase, End Turn button)
**Story 2-3**: Phase auto-processing (Income→Action→Combat→End)
**Story 2-4**: Victory screen
**Story 2-5**: Defeat screen

### Epic 4: Economy Management (4 Stories)

**Story 4-1**: Resource HUD (5 resources + income display)
**Story 4-2**: Building construction menu
**Story 4-3**: Construction progress tracking
**Story 4-4**: Income processing notifications

### Epic 5: Military Forces (5 Stories)

**Story 5-1**: Platoon commissioning UI
**Story 5-2**: Platoon details panel
**Story 5-3**: Spacecraft purchase menu
**Story 5-4**: Load platoons onto Battle Cruisers
**Story 5-5**: Navigation interface

### Epic 6: Combat Resolution (3 Stories)

**Story 6-1**: Invasion initiation UI
**Story 6-2**: Aggression slider (0-100%)
**Story 6-3**: Battle results screen

### Epic 7: AI Notifications (2 Stories)

**Story 7-1**: AI action notifications
**Story 7-2**: Personality/difficulty indicators

---

## Agent Selection

| Role | Agent Type | Responsibility |
|------|-----------|----------------|
| Planning | `technical-writer` | Expand story slug into detailed task plan with AC |
| Implementation | `game-developer` | Execute story with TDD, write tests, update status |
| Review | `code-reviewer` | Adversarial review, find issues, verify AC |

---

## Checkpoint Gates

### Pre-Implementation Gate
- [ ] Story file created in `sprint-artifacts/`
- [ ] All acceptance criteria decomposed to tasks
- [ ] Required files identified
- [ ] Dependencies mapped

### Post-Implementation Gate
- [ ] `npm test` passes (all 304+ tests)
- [ ] Coverage >= 70%
- [ ] `npm run build` succeeds
- [ ] All tasks marked complete in story file

### Epic Completion Gate
- [ ] All stories in epic marked `done`
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Manual smoke test (browser console clean)
- [ ] Commit, merge, tag, push

---

## Error Handling

**Test Failures**: Do not proceed to review. Fix tests, retry implementation. Max 3 retries before escalation.

**Review Rejections**: Address all issues, re-run tests, re-submit for review. Max 2 review cycles.

**Build Failures**: Log error, investigate TypeScript issues, fix and re-test.

**Rollback Triggers**:
- Story: 3+ failed implementation attempts
- Epic: Critical architectural issue
- Command: `git checkout main && git branch -D epic/{num}-{name}`

---

## Critical Files Reference

| File | Purpose |
|------|---------|
| `design-docs/artifacts/epics.md` | All 52 stories with acceptance criteria |
| `design-docs/artifacts/sprint-artifacts/sprint-status.yaml` | Story status tracking |
| `design-docs/artifacts/game-architecture.md` | Architecture decisions |
| `Overlord.Phaser/src/core/*.ts` | 18 game systems (DO NOT add Phaser imports) |
| `Overlord.Phaser/src/scenes/*.ts` | Phaser scenes (UI only) |
| `Overlord.Phaser/tests/` | Jest test files |

---

## Execution Sequence

```
START
  │
  ├─► Create epic/11-input branch from main
  │     ├─► Story 11-1 cycle (plan → implement → review)
  │     └─► Story 11-3 cycle (plan → implement → review)
  │     └─► Validate: npm test + npm build
  │     └─► Merge to main, tag v0.1.0-input
  │
  ├─► Create epic/3-planets branch from main
  │     ├─► Story 3-1 cycle
  │     ├─► Story 3-2 cycle
  │     └─► Story 3-3 cycle
  │     └─► Merge to main, tag v0.2.0-planets
  │
  ├─► Create epic/2-campaign branch from main
  │     ├─► Stories 2-1 through 2-5
  │     └─► Merge to main, tag v0.3.0-campaign
  │
  ├─► Create epic/4-economy branch from main
  │     ├─► Stories 4-1 through 4-4
  │     └─► Merge to main, tag v0.4.0-economy
  │
  ├─► Create epic/5-military branch from main
  │     ├─► Stories 5-1 through 5-5
  │     └─► Merge to main, tag v0.5.0-military
  │
  ├─► Create epic/6-combat branch from main
  │     ├─► Stories 6-1 through 6-3
  │     └─► Merge to main, tag v0.6.0-combat
  │
  ├─► Create epic/7-ai branch from main
  │     ├─► Stories 7-1 and 7-2
  │     └─► Merge to main, tag v0.7.0-ai
  │
  └─► FINAL VALIDATION
        ├─► npm test (full suite)
        ├─► npm run test:coverage (verify >= 70%)
        ├─► npm run build
        └─► npm start (manual smoke test)
END
```

---

## First Action

1. Create branch: `git checkout -b epic/11-input`
2. Spawn `technical-writer` agent for Story 11-1:
   - Read story 11-1 from `design-docs/artifacts/epics.md`
   - Create task plan in `design-docs/artifacts/sprint-artifacts/story-11-1.md`
   - Update `sprint-status.yaml`: `11-1-mouse-and-keyboard-input-support: drafted`
3. Spawn `game-developer` agent to implement Story 11-1
4. Spawn `code-reviewer` agent to validate
5. Repeat for Story 11-3
6. Complete epic cycle (merge, tag, push)
