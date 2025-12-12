# Overlord Project Roadmap

**Generated:** 2025-12-12
**Based on:** Comprehensive QA Audit
**Current Milestone:** v0.5.0-military
**Target:** MVP (Playable Vertical Slice)

---

## Project Status Overview

| Metric | Value | Notes |
|--------|-------|-------|
| Epics Complete | 5/12 (42%) | Epics 11, 3, 2, 4, 5 |
| Tests Passing | 798/798 (100%) | All green |
| Code Coverage | 85.45% | Exceeds 70% target |
| Build Status | Passing | Bundle size warnings only |
| Architecture | Clean | No Core/Phaser violations |

---

## Phase Overview

| Phase | Epic(s) | Priority | Dependency | Est. Stories |
|-------|---------|----------|------------|--------------|
| **Phase 1** | Epic 6 (Combat) | CRITICAL | None | 2 |
| **Phase 2** | Epic 7 (AI) | HIGH | Phase 1 | 2 |
| **Phase 3** | Epics 1, 8 (Tutorials/Scenarios) | HIGH | Phase 1 | 7 |
| **Phase 4** | Epic 9 (Packs) | MEDIUM | Phase 3 | 3 |
| **Phase 5** | Epic 10 (Accounts) | LOW | External (Supabase) | 7 |
| **Phase 6** | Epic 12 (Audio) | LOW | None | 5 |

**MVP Critical Path:** Phase 1 → Phase 2 → Phase 3 (partial)

---

## Phase 1: Complete Combat Epic (CRITICAL)

**Goal:** Complete the combat gameplay loop so players can execute and understand battle outcomes.

### Story 6-2: Combat Aggression Configuration
**Status:** Drafted
**Priority:** P0 - Blocks combat usability
**Existing Implementation:** InvasionPanel accepts aggression parameter

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 6-2-1 | Create AggressionSlider UI component | 2h | None | None | Reusable slider with 0-100% range |
| 6-2-2 | Add slider to InvasionPanel | 1h | 6-2-1 | InvasionPanel.ts | Replace hardcoded value |
| 6-2-3 | Display aggression impact preview | 2h | 6-2-1 | CombatSystem.ts | Show estimated casualties |
| 6-2-4 | Add tooltip explaining aggression mechanics | 30m | 6-2-1 | None | UX clarity |
| 6-2-5 | Write unit tests for AggressionSlider | 1h | 6-2-1 | Jest mocks | Min 5 tests |
| 6-2-6 | Integration test with InvasionPanel | 1h | 6-2-2 | Existing mocks | Verify value passing |

**Related Systems:** CombatSystem.ts, InvasionSystem.ts, InvasionPanel.ts
**External Assistance:** None required
**Acceptance Criteria Reference:** Story file `story-6-2.md` (drafted)

---

### Story 6-3: Combat Resolution and Battle Results
**Status:** Drafted
**Priority:** P0 - Players cannot see battle outcomes
**Existing Implementation:** CombatSystem.resolve() returns full CombatResult

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 6-3-1 | Design CombatResultsPanel UI mockup | 1h | None | None | Show casualties, victor, loot |
| 6-3-2 | Create CombatResultsPanel component | 3h | 6-3-1 | Phaser patterns | Modal overlay |
| 6-3-3 | Wire CombatResult to panel display | 2h | 6-3-2 | CombatSystem.ts | Map all result fields |
| 6-3-4 | Add round-by-round breakdown view | 2h | 6-3-2 | CombatResult.rounds | Expandable section |
| 6-3-5 | Add "Continue" button to dismiss | 30m | 6-3-2 | None | Returns to GalaxyMapScene |
| 6-3-6 | Connect InvasionPanel.onInvade to InvasionSystem | 2h | 6-3-2 | InvasionSystem.ts | Currently has TODO comment |
| 6-3-7 | Show results panel after invasion completes | 1h | 6-3-6, 6-3-2 | Event flow | Chain events |
| 6-3-8 | Write unit tests for CombatResultsPanel | 2h | 6-3-2 | Jest mocks | Min 8 tests |
| 6-3-9 | Integration test: full invasion flow | 2h | 6-3-7 | All combat systems | E2E verification |

**Related Systems:** CombatSystem.ts, InvasionSystem.ts, InvasionPanel.ts, GalaxyMapScene.ts
**External Assistance:** None required
**Known Issue:** GalaxyMapScene.ts:325 has `// TODO: Call InvasionSystem in Story 6-3`

---

### Phase 1 Deliverables Checklist

- [ ] AggressionSlider component with 0-100% range
- [ ] Aggression preview showing estimated casualties
- [ ] CombatResultsPanel showing battle outcomes
- [ ] Round-by-round combat breakdown
- [ ] InvasionSystem fully wired to UI
- [ ] All combat flow tests passing
- [ ] Story 6-2 marked done in sprint-status.yaml
- [ ] Story 6-3 marked done in sprint-status.yaml
- [ ] Epic 6 marked done

---

## Phase 2: AI Visibility (HIGH)

**Goal:** Make AI actions visible to player so they understand what opponent is doing.

### Story 7-1: AI Strategic Decision Making (Notifications)
**Status:** Drafted
**Priority:** P1 - AI acts invisibly currently
**Existing Implementation:** AIDecisionSystem has event callbacks (onAIAttacking, onAIBuilding)

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 7-1-1 | Create AINotificationPanel component | 2h | None | Phaser patterns | Toast-style notifications |
| 7-1-2 | Subscribe to AIDecisionSystem.onAIAttacking | 1h | 7-1-1 | AIDecisionSystem.ts | Show attack intent |
| 7-1-3 | Subscribe to AIDecisionSystem.onAIBuilding | 1h | 7-1-1 | AIDecisionSystem.ts | Show construction |
| 7-1-4 | Add notification queue (max 3 visible) | 1h | 7-1-1 | None | Stack management |
| 7-1-5 | Add auto-dismiss with manual dismiss option | 30m | 7-1-1 | None | 4s timeout |
| 7-1-6 | Style notifications by type (attack=red, build=blue) | 30m | 7-1-1 | None | Visual clarity |
| 7-1-7 | Write unit tests | 1h | 7-1-1 | Jest mocks | Min 5 tests |

**Related Systems:** AIDecisionSystem.ts, GalaxyMapScene.ts, PhaseProcessor.ts
**External Assistance:** None required

---

### Story 7-2: AI Personality and Difficulty Adaptation
**Status:** Drafted
**Priority:** P1 - Player doesn't know AI behavior
**Existing Implementation:** AIPersonality enum, AI_PERSONALITY_DESCRIPTIONS

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 7-2-1 | Add AI personality indicator to TurnHUD | 1h | None | TurnHUD.ts | Small icon/label |
| 7-2-2 | Add difficulty indicator to TurnHUD | 30m | 7-2-1 | TurnHUD.ts | Next to personality |
| 7-2-3 | Show AI personality tooltip on hover | 30m | 7-2-1 | AI_PERSONALITY_DESCRIPTIONS | Reuse existing descriptions |
| 7-2-4 | Add "AI Status" section to debug panel | 1h | None | GalaxyMapScene.ts | Development aid |
| 7-2-5 | Write unit tests | 1h | 7-2-1 | Jest mocks | Min 4 tests |

**Related Systems:** TurnHUD.ts, AIDecisionSystem.ts, CampaignConfig.ts
**External Assistance:** None required

---

### Phase 2 Deliverables Checklist

- [ ] AI notification system showing attacks and builds
- [ ] AI personality/difficulty visible in HUD
- [ ] Notifications auto-dismiss with queue management
- [ ] Story 7-1 marked done
- [ ] Story 7-2 marked done
- [ ] Epic 7 marked done

---

## Phase 3: Flash Conflicts & Tutorials (HIGH)

**Goal:** Enable Flash Conflicts menu and deliver playable tutorial scenarios.

### Story 1-1: Flash Conflicts Menu Access
**Status:** Drafted
**Priority:** P1 - Entry point blocked
**Existing Implementation:** MainMenuScene has disabled "FLASH SCENARIOS" button

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 1-1-1 | Enable "FLASH SCENARIOS" button in MainMenuScene | 30m | None | MainMenuScene.ts | Change enabled: false → true |
| 1-1-2 | Create FlashConflictsMenuScene | 2h | None | Scene patterns | Wrapper for scenario selection |
| 1-1-3 | Add scene transition from MainMenu | 30m | 1-1-2 | PhaserConfig.ts | Register new scene |
| 1-1-4 | Integrate ScenarioListPanel into FlashConflictsMenuScene | 1h | 1-1-2 | ScenarioListPanel.ts | Already built |
| 1-1-5 | Add "Back to Main Menu" navigation | 30m | 1-1-2 | None | Standard pattern |
| 1-1-6 | Write integration tests | 1h | 1-1-4 | Jest mocks | Scene transitions |

**Related Systems:** MainMenuScene.ts, FlashConflictsScene.ts, ScenarioListPanel.ts
**External Assistance:** None required

---

### Story 1-2: Scenario Selection Interface
**Status:** In Review
**Priority:** P1
**Existing Implementation:** ScenarioListPanel, ScenarioDetailPanel already built

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 1-2-1 | Code review pass (address any findings) | 1h | None | Code review feedback | Story in review status |
| 1-2-2 | Verify ScenarioListPanel scrolling works | 30m | None | Manual testing | Regression check |
| 1-2-3 | Verify ScenarioDetailPanel prerequisites display | 30m | None | Manual testing | Blocking logic |
| 1-2-4 | Mark story done if review passes | 15m | 1-2-1 | sprint-status.yaml | Status update |

**Related Systems:** ScenarioListPanel.ts, ScenarioDetailPanel.ts, ScenarioManager.ts
**External Assistance:** None required

---

### Story 1-3: Scenario Initialization and Victory Conditions
**Status:** Drafted
**Priority:** P1
**Existing Implementation:** VictoryConditionChecker exists but may have issues from prior review

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 1-3-1 | Review/fix VictoryConditionChecker from code review | 2h | None | Prior review findings | Division by zero, null checks |
| 1-3-2 | Create ScenarioInitializer if not exists | 2h | None | ScenarioModels.ts | Initialize GameState from Scenario |
| 1-3-3 | Connect scenario start to game initialization | 2h | 1-3-2 | ScenarioDetailPanel | onStartScenario callback |
| 1-3-4 | Track victory conditions during gameplay | 2h | 1-3-1 | PhaseProcessor | Check each turn |
| 1-3-5 | Trigger victory when conditions met | 1h | 1-3-4 | VictoryScene | Scenario-specific victory |
| 1-3-6 | Write comprehensive tests | 2h | 1-3-1, 1-3-2 | Jest | Cover edge cases |

**Related Systems:** ScenarioManager.ts, VictoryConditionChecker.ts, GameState.ts, PhaseProcessor.ts
**External Assistance:** None required
**Known Issues:** Prior code review found architecture violation (Phaser in Core)

---

### Story 1-4: Tutorial Step Guidance System
**Status:** Drafted
**Priority:** P2 - Enhances tutorial experience
**Existing Implementation:** TutorialStep interface in ScenarioModels.ts

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 1-4-1 | Design TutorialOverlay UI mockup | 1h | None | None | Highlight + text box |
| 1-4-2 | Create TutorialOverlay component | 3h | 1-4-1 | Phaser patterns | Spotlight effect |
| 1-4-3 | Create TutorialManager to track step progression | 2h | None | TutorialStep model | State machine |
| 1-4-4 | Implement element highlighting system | 2h | 1-4-2 | DOM/Phaser coords | Spotlight on target |
| 1-4-5 | Implement step advancement logic | 2h | 1-4-3 | Action detection | Detect completion |
| 1-4-6 | Wire to ScenarioGameScene | 2h | 1-4-2, 1-4-3 | Scene integration | Show during scenario |
| 1-4-7 | Test with tutorial-001.json | 1h | All above | Existing scenario | End-to-end |
| 1-4-8 | Write unit tests | 2h | 1-4-2, 1-4-3 | Jest | Min 10 tests |

**Related Systems:** ScenarioModels.ts (TutorialStep), GalaxyMapScene.ts, InputSystem.ts
**External Assistance:** UX input helpful for highlight design
**Complexity:** HIGH - This is the most complex story in Phase 3

---

### Story 1-5: Scenario Completion and Results Display
**Status:** Drafted
**Priority:** P1
**Existing Implementation:** None - ScenarioCompletionPanel needed

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 1-5-1 | Create ScenarioCompletionPanel component | 2h | None | Phaser patterns | Victory/defeat display |
| 1-5-2 | Show completion time | 30m | 1-5-1 | Timer tracking | Track from scenario start |
| 1-5-3 | Show victory conditions achieved | 1h | 1-5-1 | VictoryConditionChecker | Checkmarks |
| 1-5-4 | Add "Retry" button | 30m | 1-5-1 | Scene management | Restart scenario |
| 1-5-5 | Add "Return to Menu" button | 30m | 1-5-1 | Scene management | Back to list |
| 1-5-6 | Write unit tests | 1h | 1-5-1 | Jest | Min 5 tests |

**Related Systems:** ScenarioManager.ts, VictoryConditionChecker.ts
**External Assistance:** None required

---

### Story 1-6: Scenario Completion History Tracking
**Status:** Drafted
**Priority:** P2
**Existing Implementation:** ScenarioManager has completion tracking with localStorage

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 1-6-1 | Verify localStorage persistence works | 30m | None | ScenarioManager | Manual testing |
| 1-6-2 | Show completion badges in ScenarioListPanel | 1h | None | ScenarioListPanel | Checkmark overlay |
| 1-6-3 | Track best completion time per scenario | 1h | None | ScenarioCompletion model | Already has bestTime field |
| 1-6-4 | Show best time in ScenarioDetailPanel | 30m | 1-6-3 | ScenarioDetailPanel | "Your best: X:XX" |
| 1-6-5 | Write unit tests | 1h | All above | Jest | Persistence tests |

**Related Systems:** ScenarioManager.ts, ScenarioListPanel.ts, ScenarioDetailPanel.ts
**External Assistance:** None required

---

### Story 8-1: Tactical Scenario Content and Variety
**Status:** Drafted
**Priority:** P2 - Content creation
**Existing Implementation:** tutorial-001.json exists as template

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 8-1-1 | Design 2-3 tactical scenario concepts | 1h | None | PRD reference | "Defend Starbase", etc. |
| 8-1-2 | Create tactical-001.json (Defend Starbase) | 2h | 8-1-1 | JSON schema | Pre-configured battle |
| 8-1-3 | Create tactical-002.json (Terraform Rush) | 2h | 8-1-1 | JSON schema | Resource pressure |
| 8-1-4 | Validate scenarios load correctly | 1h | 8-1-2, 8-1-3 | ScenarioManager | Integration test |
| 8-1-5 | Playtest and balance scenarios | 2h | 8-1-4 | Manual testing | Adjust difficulty |

**Related Systems:** ScenarioManager.ts, src/data/scenarios/
**External Assistance:** Game design input helpful for balance
**Content Creation:** HUMAN INPUT REQUIRED for scenario design decisions

---

### Phase 3 Deliverables Checklist

- [ ] Flash Scenarios button enabled in main menu
- [ ] Scenario list with completion badges
- [ ] Scenario detail panel with prerequisites
- [ ] Tutorial overlay with step guidance
- [ ] Scenario completion results panel
- [ ] Completion history with best times
- [ ] 3+ playable scenarios (1 tutorial, 2 tactical)
- [ ] Stories 1-1 through 1-6 marked done
- [ ] Story 8-1 marked done
- [ ] Epic 1 marked done
- [ ] Epic 8 marked done

---

## Phase 4: Scenario Pack System (MEDIUM)

**Goal:** Enable hot-swappable scenario packs for variety.

### Story 9-1: Scenario Pack Browsing and Selection
**Status:** Drafted
**Priority:** P2

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 9-1-1 | Define ScenarioPack JSON schema | 1h | None | ScenarioModels | Pack metadata |
| 9-1-2 | Create ScenarioPackListPanel component | 2h | 9-1-1 | Phaser patterns | Browse packs |
| 9-1-3 | Create default pack (current scenarios) | 1h | 9-1-1 | Existing content | Wrap existing |
| 9-1-4 | Create 1-2 alternative packs | 2h | 9-1-1 | Content creation | Variety demo |
| 9-1-5 | Write unit tests | 1h | 9-1-2 | Jest | Min 5 tests |

---

### Story 9-2: Scenario Pack Switching
**Status:** Drafted
**Priority:** P2

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 9-2-1 | Add pack selection to ScenarioManager | 1h | 9-1-1 | ScenarioManager | Switch active pack |
| 9-2-2 | Reload scenario list on pack switch | 1h | 9-2-1 | ScenarioListPanel | Refresh UI |
| 9-2-3 | Persist selected pack to localStorage | 30m | 9-2-1 | None | Remember choice |
| 9-2-4 | Write unit tests | 1h | 9-2-1 | Jest | Min 4 tests |

---

### Story 9-3: Scenario Pack Metadata Display
**Status:** Drafted
**Priority:** P3

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 9-3-1 | Create ScenarioPackDetailPanel | 1h | 9-1-1 | Phaser patterns | Show pack info |
| 9-3-2 | Display pack description, author, version | 30m | 9-3-1 | Pack schema | Metadata fields |
| 9-3-3 | Display scenario count per pack | 30m | 9-3-1 | Pack data | Summary stat |
| 9-3-4 | Write unit tests | 30m | 9-3-1 | Jest | Min 3 tests |

---

### Phase 4 Deliverables Checklist

- [ ] Scenario pack JSON schema defined
- [ ] Pack browsing UI
- [ ] Pack switching functionality
- [ ] 2-3 packs available
- [ ] Stories 9-1 through 9-3 marked done
- [ ] Epic 9 marked done

---

## Phase 5: User Accounts & Persistence (LOW - EXTERNAL DEPENDENCY)

**Goal:** Enable cloud saves and cross-device sync.

**BLOCKER:** Requires Supabase project setup and configuration.

### Prerequisites (Before Phase 5)

| ID | Task | Est. | Owner | Notes |
|----|------|------|-------|-------|
| PRE-5-1 | Create Supabase project | 30m | Human | supabase.com account |
| PRE-5-2 | Configure auth providers | 1h | Human | Email/password at minimum |
| PRE-5-3 | Create database schema | 2h | Dev | Users, saves, settings tables |
| PRE-5-4 | Set up RLS policies | 1h | Dev | Row-level security |
| PRE-5-5 | Add Supabase SDK to project | 1h | Dev | npm install @supabase/supabase-js |
| PRE-5-6 | Configure environment variables | 30m | Dev | SUPABASE_URL, SUPABASE_ANON_KEY |

### Stories 10-1 through 10-7 (Deferred)

Stories remain in drafted status pending Supabase setup. Estimated 15-20 hours total.

**External Assistance Required:**
- Supabase account setup (Human)
- Database schema design review
- Security review for RLS policies

---

## Phase 6: Audio & Immersion (LOW)

**Goal:** Add sound effects and music for atmosphere.

**BLOCKER:** Requires audio asset creation or sourcing.

### Prerequisites (Before Phase 6)

| ID | Task | Est. | Owner | Notes |
|----|------|------|-------|-------|
| PRE-6-1 | Source/create UI sound effects | 4h | Human | Click, hover, confirm, error |
| PRE-6-2 | Source/create combat sound effects | 4h | Human | Laser, explosion, victory, defeat |
| PRE-6-3 | Source/create background music | 4h | Human | Menu theme, gameplay ambient |
| PRE-6-4 | Convert to web audio formats | 1h | Dev | MP3/OGG/WebM |

### Story 12-1: Sound Effects for Game Actions
**Status:** Drafted

#### Tasks

| ID | Task | Est. | Blockers | Dependencies | Notes |
|----|------|------|----------|--------------|-------|
| 12-1-1 | Create AudioManager singleton | 2h | PRE-6-4 | None | Central audio control |
| 12-1-2 | Implement SFX playback | 1h | 12-1-1 | Phaser.Sound | Play on demand |
| 12-1-3 | Add sounds to UI interactions | 2h | 12-1-2 | All UI panels | Button clicks, etc. |
| 12-1-4 | Add sounds to game events | 2h | 12-1-2 | Combat, building | Action feedback |
| 12-1-5 | Write unit tests | 1h | 12-1-1 | Jest | Min 5 tests |

### Stories 12-2 through 12-5 (Abbreviated)

Similar pattern for music, volume controls, mute toggle, and browser audio compliance.

**External Assistance Required:**
- Audio asset creation/licensing (Human)
- Sound design consultation (optional)

---

## Dependency Matrix

```
Phase 1 (Combat)
    │
    ├── Phase 2 (AI) ─── depends on combat being complete to show attack notifications
    │
    └── Phase 3 (Flash Conflicts) ─── depends on combat for tactical scenarios
            │
            └── Phase 4 (Packs) ─── depends on scenarios existing to package

Phase 5 (Accounts) ─── independent but requires external Supabase setup
Phase 6 (Audio) ─── independent but requires external audio assets
```

---

## Critical Path to MVP

**Minimum Viable Product requires:**

1. **Phase 1 Complete** - Combat playable with visible results
2. **Phase 2 Complete** - AI actions visible
3. **Phase 3 Partial** - Stories 1-1, 1-2, 1-3, 1-5 minimum

**MVP Excludes (can defer):**
- Tutorial step guidance (1-4)
- Completion history (1-6)
- Tactical scenarios (8-1)
- Scenario packs (Phase 4)
- User accounts (Phase 5)
- Audio (Phase 6)

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Combat results panel complexity | High | Medium | Start with simple layout, iterate |
| Tutorial overlay technical challenges | Medium | Medium | Prototype spotlight effect early |
| Scenario balancing takes too long | Medium | High | Ship with 2 scenarios, add more later |
| Supabase integration delays | Low | High | Keep Phase 5 as post-MVP |
| Audio licensing issues | Low | Medium | Use royalty-free sources (Kenney.nl) |

---

## Estimation Summary

| Phase | Estimated Hours | Stories |
|-------|-----------------|---------|
| Phase 1 | 20-25h | 2 |
| Phase 2 | 10-12h | 2 |
| Phase 3 | 35-45h | 7 |
| Phase 4 | 12-15h | 3 |
| Phase 5 | 15-20h | 7 |
| Phase 6 | 15-20h | 5 |
| **Total** | **107-137h** | **26** |

**MVP (Phases 1-3 partial):** ~50-60 hours

---

## Next Steps

1. Review this roadmap for accuracy and priority alignment
2. Decide on MVP scope (full Phase 3 or partial)
3. Confirm Phase 5 timing (Supabase setup)
4. Confirm Phase 6 timing (audio asset sourcing)
5. Begin Phase 1 implementation

---

*Document Version: 1.0*
*Last Updated: 2025-12-12*
