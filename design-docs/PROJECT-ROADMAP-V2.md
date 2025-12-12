# Overlord Project Roadmap v2.0

**Generated:** 2025-12-12
**Enhanced With:** Acceptance Criteria Links, Sprint Planning, Resource Assignments, Timeline

---

## Sprint Configuration

| Parameter | Value |
|-----------|-------|
| Sprint Duration | 1 week (5 working days) |
| Hours per Day | 6 productive hours |
| Hours per Sprint | 30 hours |
| Resource Mix | AI-Assisted + Human Input |

---

## Resource Key

| Symbol | Meaning |
|--------|---------|
| `[AI]` | AI can implement autonomously |
| `[AI+R]` | AI implements, human reviews |
| `[HUMAN]` | Requires human decision/input |
| `[COLLAB]` | AI + Human collaboration needed |
| `[EXT]` | External dependency (Supabase, assets) |

---

## Sprint Schedule Overview

```
WEEK 1  ████████████████████████████████  Sprint 1: Combat Completion (Epic 6)
WEEK 2  ████████████████████████████████  Sprint 2: AI Visibility (Epic 7)
WEEK 3  ████████████████████████████████  Sprint 3: Flash Conflicts Core (Epic 1 pt.1)
WEEK 4  ████████████████████████████████  Sprint 4: Tutorials & Results (Epic 1 pt.2)
WEEK 5  ████████████████████████████████  Sprint 5: Tactical Content (Epics 1, 8)
WEEK 6  ████████████████████████████████  Sprint 6: Scenario Packs (Epic 9)
────────────────────────────────────────  MVP MILESTONE
WEEK 7  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Sprint 7: Accounts Setup (Epic 10 pt.1)
WEEK 8  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Sprint 8: Accounts Complete (Epic 10 pt.2)
WEEK 9  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Sprint 9: Audio System (Epic 12)
```

---

# SPRINT 1: Combat Completion (Week 1)

**Epic:** 6 - Combat & Planetary Invasion
**Goal:** Complete combat gameplay loop with visible results
**Capacity:** 30 hours

## Story 6-2: Combat Aggression Configuration

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 6-2-T1 | Create AggressionSlider component | AC1, AC4 | 2.0 | [AI] | None |
| 6-2-T2 | Add tactical approach labels (0-100%) | AC2, AC5 | 1.0 | [AI] | 6-2-T1 |
| 6-2-T3 | Set default value to 50% (Balanced) | AC3 | 0.5 | [AI] | 6-2-T1 |
| 6-2-T4 | Add aggression field to InvasionSystem | AC6 | 1.0 | [AI] | None |
| 6-2-T5 | Integrate slider into InvasionPanel | AC1, AC6 | 1.5 | [AI] | 6-2-T1, 6-2-T4 |
| 6-2-T6 | Visual polish (colors, hover) | AC4 | 1.0 | [AI] | 6-2-T5 |
| 6-2-T7 | Write unit tests (14 tests) | ALL | 2.0 | [AI] | 6-2-T5 |
| 6-2-T8 | Integration test - E2E flow | AC6 | 1.0 | [AI+R] | 6-2-T7 |

**Story 6-2 Subtotal:** 10.0 hours

### Acceptance Criteria Mapping - Story 6-2

| AC | Description | Tasks |
|----|-------------|-------|
| AC1 | Aggression slider visible in invasion setup | 6-2-T1, 6-2-T5 |
| AC2 | Slider shows tactical approach labels | 6-2-T2 |
| AC3 | Default value is 50% (Balanced) | 6-2-T3 |
| AC4 | Slider updates smoothly with percentage display | 6-2-T1, 6-2-T6 |
| AC5 | Tactical description updates with slider | 6-2-T2 |
| AC6 | Aggression value passed to CombatSystem | 6-2-T4, 6-2-T5, 6-2-T8 |

---

## Story 6-3: Combat Resolution and Battle Results

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 6-3-T1 | Design BattleResultsPanel mockup | AC2, AC3 | 1.0 | [COLLAB] | None |
| 6-3-T2 | Create BattleResultsPanel component | AC1, AC2 | 3.0 | [AI] | 6-3-T1 |
| 6-3-T3 | Create victory display layout | AC2 | 1.5 | [AI] | 6-3-T2 |
| 6-3-T4 | Create defeat display layout | AC3 | 1.5 | [AI] | 6-3-T2 |
| 6-3-T5 | Integrate with GalaxyMapScene | AC1, AC6 | 2.0 | [AI] | 6-3-T2 |
| 6-3-T6 | Add Continue button dismiss + map update | AC4 | 1.0 | [AI] | 6-3-T5 |
| 6-3-T7 | Handle multiple battles queue | AC5 | 1.5 | [AI] | 6-3-T5 |
| 6-3-T8 | Connect InvasionPanel to InvasionSystem | AC1, AC6 | 2.0 | [AI] | None |
| 6-3-T9 | Visual polish and animations | AC2, AC3 | 1.0 | [AI] | 6-3-T3, 6-3-T4 |
| 6-3-T10 | Write unit tests (16 tests) | ALL | 2.5 | [AI] | 6-3-T9 |
| 6-3-T11 | Integration test - full invasion flow | AC1, AC4 | 2.0 | [AI+R] | 6-3-T10 |

**Story 6-3 Subtotal:** 19.0 hours

### Acceptance Criteria Mapping - Story 6-3

| AC | Description | Tasks |
|----|-------------|-------|
| AC1 | Battle results panel displays after combat | 6-3-T2, 6-3-T5, 6-3-T8 |
| AC2 | Victory shows planet, casualties, resources | 6-3-T1, 6-3-T3 |
| AC3 | Defeat shows casualties and reason | 6-3-T1, 6-3-T4 |
| AC4 | Continue button dismisses and updates map | 6-3-T6, 6-3-T11 |
| AC5 | Multiple battles show sequential results | 6-3-T7 |
| AC6 | Combat events trigger UI via subscription | 6-3-T5, 6-3-T8 |

---

### Sprint 1 Summary

| Metric | Value |
|--------|-------|
| Total Hours | 29.0 / 30.0 |
| Stories | 2 (6-2, 6-3) |
| Tasks | 19 |
| Tests Added | ~30 |
| Human Input | 1 task (mockup design) |

**Sprint 1 Deliverables:**
- [ ] AggressionSlider component with 0-100% range
- [ ] BattleResultsPanel with victory/defeat layouts
- [ ] Combat flow fully wired (InvasionPanel → InvasionSystem → CombatSystem → Results)
- [ ] Epic 6 marked DONE

---

# SPRINT 2: AI Visibility (Week 2)

**Epic:** 7 - AI Opponent System
**Goal:** Make AI actions visible to player
**Capacity:** 30 hours

## Story 7-1: AI Strategic Decision Making (Notifications)

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 7-1-T1 | Create NotificationToast component | AC1, AC2, AC3 | 2.0 | [AI] | None |
| 7-1-T2 | Create MessageLog component | AC5 | 2.0 | [AI] | None |
| 7-1-T3 | Subscribe to AI turn events | AC1, AC6 | 1.0 | [AI] | 7-1-T1 |
| 7-1-T4 | Subscribe to AI building events | AC2, AC6 | 1.0 | [AI] | 7-1-T1 |
| 7-1-T5 | Subscribe to AI attack events | AC3, AC6 | 1.0 | [AI] | 7-1-T1 |
| 7-1-T6 | Implement fog of war filter | AC4 | 1.5 | [AI] | 7-1-T4 |
| 7-1-T7 | Toast stacking and auto-dismiss | AC1 | 1.0 | [AI] | 7-1-T1 |
| 7-1-T8 | Style notifications by type | AC3 | 1.0 | [AI] | 7-1-T1 |
| 7-1-T9 | Write unit tests (14 tests) | ALL | 2.0 | [AI] | 7-1-T8 |
| 7-1-T10 | Integration test - AI turn flow | AC6 | 1.5 | [AI+R] | 7-1-T9 |

**Story 7-1 Subtotal:** 14.0 hours

### Acceptance Criteria Mapping - Story 7-1

| AC | Description | Tasks |
|----|-------------|-------|
| AC1 | AI turn start/end notifications | 7-1-T1, 7-1-T3, 7-1-T7 |
| AC2 | AI building construction notification | 7-1-T4 |
| AC3 | AI attack warning displayed | 7-1-T5, 7-1-T8 |
| AC4 | Hidden AI actions not revealed (fog) | 7-1-T6 |
| AC5 | Notification log persists | 7-1-T2 |
| AC6 | Notifications fire via event subscription | 7-1-T3, 7-1-T4, 7-1-T5, 7-1-T10 |

---

## Story 7-2: AI Personality and Difficulty Display

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 7-2-T1 | Create OpponentInfoPanel component | AC3, AC6 | 2.0 | [AI] | None |
| 7-2-T2 | Verify AI selection in CampaignConfigScene | AC1, AC2 | 1.0 | [AI] | None |
| 7-2-T3 | Add personality indicator to TurnHUD | AC6 | 1.5 | [AI] | 7-2-T1 |
| 7-2-T4 | Add difficulty indicator to TurnHUD | AC6 | 0.5 | [AI] | 7-2-T3 |
| 7-2-T5 | Show personality tooltip on hover | AC1 | 1.0 | [AI] | 7-2-T1 |
| 7-2-T6 | Verify AI behavior differs by personality | AC4 | 1.0 | [AI+R] | None |
| 7-2-T7 | Verify difficulty affects AI strength | AC5 | 1.0 | [AI+R] | None |
| 7-2-T8 | Add personality icons | AC6 | 1.5 | [AI] | 7-2-T1 |
| 7-2-T9 | Write unit tests (12 tests) | ALL | 2.0 | [AI] | 7-2-T8 |
| 7-2-T10 | Integration test - HUD display | AC6 | 1.5 | [AI+R] | 7-2-T9 |

**Story 7-2 Subtotal:** 13.0 hours

### Acceptance Criteria Mapping - Story 7-2

| AC | Description | Tasks |
|----|-------------|-------|
| AC1 | Personality displayed in campaign setup | 7-2-T2, 7-2-T5 |
| AC2 | Difficulty displayed in campaign setup | 7-2-T2 |
| AC3 | AI commander portrait/name shown | 7-2-T1 |
| AC4 | Personality affects visible AI behavior | 7-2-T6 |
| AC5 | Difficulty affects AI resource bonuses | 7-2-T7 |
| AC6 | AI info displayed in game HUD | 7-2-T3, 7-2-T4, 7-2-T8, 7-2-T10 |

---

### Sprint 2 Summary

| Metric | Value |
|--------|-------|
| Total Hours | 27.0 / 30.0 |
| Stories | 2 (7-1, 7-2) |
| Tasks | 20 |
| Tests Added | ~26 |
| Human Input | 0 tasks |
| Buffer | 3 hours |

**Sprint 2 Deliverables:**
- [ ] NotificationToast system with stacking
- [ ] MessageLog for persistent history
- [ ] OpponentInfoPanel in HUD
- [ ] Fog of war filtering for AI actions
- [ ] Epic 7 marked DONE

---

# SPRINT 3: Flash Conflicts Core (Week 3)

**Epic:** 1 - Player Onboarding & Tutorials (Part 1)
**Goal:** Enable Flash Conflicts menu and scenario selection
**Capacity:** 30 hours

## Story 1-1: Flash Conflicts Menu Access

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 1-1-T1 | Enable Flash Scenarios button in MainMenuScene | AC1 | 0.5 | [AI] | None |
| 1-1-T2 | Create FlashConflictsMenuScene skeleton | AC2 | 2.0 | [AI] | None |
| 1-1-T3 | Register scene in PhaserConfig | AC2 | 0.5 | [AI] | 1-1-T2 |
| 1-1-T4 | Add back button navigation | AC3 | 0.5 | [AI] | 1-1-T2 |
| 1-1-T5 | Show "Recommended for Beginners" indicator | AC4 | 1.0 | [AI] | 1-1-T2 |
| 1-1-T6 | Verify scene loads < 2 seconds | AC5 | 0.5 | [AI+R] | 1-1-T3 |
| 1-1-T7 | Write unit tests (8 tests) | ALL | 1.5 | [AI] | 1-1-T6 |

**Story 1-1 Subtotal:** 6.5 hours

---

## Story 1-2: Scenario Selection Interface (IN REVIEW)

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 1-2-T1 | Code review pass - address findings | ALL | 1.5 | [AI+R] | None |
| 1-2-T2 | Verify scrolling works | AC1 | 0.5 | [AI] | 1-2-T1 |
| 1-2-T3 | Verify prerequisites display | AC5 | 0.5 | [AI] | 1-2-T1 |
| 1-2-T4 | Update sprint-status to done | ALL | 0.25 | [AI] | 1-2-T3 |

**Story 1-2 Subtotal:** 2.75 hours (already 90% complete)

---

## Story 1-3: Scenario Initialization and Victory Conditions

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 1-3-T1 | Review/fix VictoryConditionChecker | AC1 | 2.0 | [AI] | None |
| 1-3-T2 | Create ScenarioInitializer | AC1 | 2.5 | [AI] | None |
| 1-3-T3 | Initialize player planets/resources | AC1 | 1.0 | [AI] | 1-3-T2 |
| 1-3-T4 | Initialize AI state if enabled | AC1 | 1.0 | [AI] | 1-3-T2 |
| 1-3-T5 | Create ObjectivesPanel component | AC2, AC3 | 2.0 | [AI] | None |
| 1-3-T6 | Add "O" key to reopen objectives | AC3 | 0.5 | [AI] | 1-3-T5 |
| 1-3-T7 | Show panel at scenario start | AC2 | 1.0 | [AI] | 1-3-T5 |
| 1-3-T8 | Dismiss overlay to start gameplay | AC4 | 0.5 | [AI] | 1-3-T7 |
| 1-3-T9 | Error handling for malformed scenarios | AC5 | 1.5 | [AI] | 1-3-T2 |
| 1-3-T10 | Connect to ScenarioDetailPanel.onStartScenario | AC1 | 1.5 | [AI] | 1-3-T2 |
| 1-3-T11 | Write unit tests (20 tests) | ALL | 3.0 | [AI] | 1-3-T10 |
| 1-3-T12 | Integration test - full init flow | ALL | 2.0 | [AI+R] | 1-3-T11 |

**Story 1-3 Subtotal:** 18.5 hours

### Acceptance Criteria Mapping - Story 1-3

| AC | Description | Tasks |
|----|-------------|-------|
| AC1 | Game state initializes from scenario JSON | 1-3-T1 to T4, 1-3-T10 |
| AC2 | Victory conditions overlay at start | 1-3-T5, 1-3-T7 |
| AC3 | Objectives panel via "O" key | 1-3-T5, 1-3-T6 |
| AC4 | Dismiss overlay to start gameplay | 1-3-T8 |
| AC5 | Malformed scenario shows error | 1-3-T9 |

---

### Sprint 3 Summary

| Metric | Value |
|--------|-------|
| Total Hours | 27.75 / 30.0 |
| Stories | 3 (1-1, 1-2, 1-3) |
| Tasks | 23 |
| Tests Added | ~28 |
| Human Input | 0 tasks |
| Buffer | 2.25 hours |

**Sprint 3 Deliverables:**
- [ ] Flash Conflicts accessible from main menu
- [ ] Scenario selection working end-to-end
- [ ] Scenarios initialize game state correctly
- [ ] Objectives panel with keyboard shortcut
- [ ] Stories 1-1, 1-2, 1-3 marked DONE

---

# SPRINT 4: Tutorials & Results (Week 4)

**Epic:** 1 - Player Onboarding & Tutorials (Part 2)
**Goal:** Tutorial guidance system and completion tracking
**Capacity:** 30 hours

## Story 1-4: Tutorial Step Guidance System (COMPLEX)

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 1-4-T1 | Create TutorialManager core | AC1, AC4, AC5 | 3.0 | [AI] | None |
| 1-4-T2 | Create HighlightManager (glow/spotlight) | AC2 | 2.5 | [AI] | None |
| 1-4-T3 | Create ActionDetector | AC4 | 3.0 | [AI] | None |
| 1-4-T4 | Create TutorialStepPanel | AC1 | 2.0 | [AI] | None |
| 1-4-T5 | Integrate into ScenarioGameScene | AC1, AC7 | 2.5 | [AI] | 1-4-T1 to T4 |
| 1-4-T6 | Dim non-essential UI during steps | AC3 | 1.5 | [AI] | 1-4-T2 |
| 1-4-T7 | Step completion indicator | AC4 | 1.0 | [AI] | 1-4-T4 |
| 1-4-T8 | Auto-advance after 1 second | AC5 | 0.5 | [AI] | 1-4-T1 |
| 1-4-T9 | Final step closes tutorial | AC6 | 0.5 | [AI] | 1-4-T1 |
| 1-4-T10 | Skip tutorial for non-tutorial scenarios | AC7 | 0.5 | [AI] | 1-4-T5 |
| 1-4-T11 | Define tutorial actions enum | AC4 | 1.0 | [AI] | None |
| 1-4-T12 | Tutorial content for tutorial-001.json | AC1 | 1.0 | [HUMAN] | 1-4-T11 |
| 1-4-T13 | Write unit tests (26 tests) | ALL | 3.5 | [AI] | 1-4-T10 |
| 1-4-T14 | Integration test - full tutorial flow | ALL | 2.5 | [AI+R] | 1-4-T13 |

**Story 1-4 Subtotal:** 25.0 hours

### Acceptance Criteria Mapping - Story 1-4

| AC | Description | Tasks |
|----|-------------|-------|
| AC1 | First tutorial step shown at start | 1-4-T1, 1-4-T4, 1-4-T5 |
| AC2 | UI elements highlighted | 1-4-T2 |
| AC3 | Non-essential UI dimmed | 1-4-T6 |
| AC4 | Step completes on action | 1-4-T1, 1-4-T3, 1-4-T7, 1-4-T11 |
| AC5 | Next step after 1s delay | 1-4-T8 |
| AC6 | Final step closes system | 1-4-T9 |
| AC7 | Non-tutorial scenarios skip | 1-4-T5, 1-4-T10 |

---

### Sprint 4 Summary

| Metric | Value |
|--------|-------|
| Total Hours | 25.0 / 30.0 |
| Stories | 1 (1-4) - COMPLEX |
| Tasks | 14 |
| Tests Added | ~26 |
| Human Input | 1 task (tutorial content) |
| Buffer | 5 hours |

**Sprint 4 Deliverables:**
- [ ] TutorialManager orchestrating step flow
- [ ] Highlight system (glow, spotlight, dim)
- [ ] ActionDetector for step completion
- [ ] Tutorial-001 playable with guidance
- [ ] Story 1-4 marked DONE

---

# SPRINT 5: Completion & Content (Week 5)

**Epics:** 1 (finish), 8 (start)
**Goal:** Scenario completion tracking and tactical content
**Capacity:** 30 hours

## Story 1-5: Scenario Completion and Results Display

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 1-5-T1 | Create ScenarioResultsPanel | AC2 | 2.5 | [AI] | None |
| 1-5-T2 | Victory detection within 1 second | AC1 | 1.0 | [AI] | None |
| 1-5-T3 | Display status, time, condition met | AC3 | 1.5 | [AI] | 1-5-T1 |
| 1-5-T4 | Implement star rating system | AC3 | 2.0 | [AI] | None |
| 1-5-T5 | Pause gameplay during results | AC4 | 1.0 | [AI] | 1-5-T1 |
| 1-5-T6 | Defeat screen with retry option | AC5 | 1.5 | [AI] | 1-5-T1 |
| 1-5-T7 | Continue returns to menu with badge | AC6 | 1.0 | [AI] | 1-5-T1 |
| 1-5-T8 | Write unit tests (12 tests) | ALL | 2.0 | [AI] | 1-5-T7 |

**Story 1-5 Subtotal:** 12.5 hours

---

## Story 1-6: Scenario Completion History (LocalStorage Only)

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 1-6-T1 | Verify localStorage persistence | AC5 | 1.0 | [AI] | None |
| 1-6-T2 | Show completion badges in list | AC2 | 1.5 | [AI] | 1-6-T1 |
| 1-6-T3 | Track best time per scenario | AC3 | 1.0 | [AI] | 1-6-T1 |
| 1-6-T4 | Show best time in detail panel | AC2 | 0.5 | [AI] | 1-6-T3 |
| 1-6-T5 | Track attempts counter | AC4 | 0.5 | [AI] | 1-6-T1 |
| 1-6-T6 | Write unit tests (5 tests) | ALL | 1.0 | [AI] | 1-6-T5 |

**Story 1-6 Subtotal:** 5.5 hours (Supabase deferred to Sprint 7-8)

---

## Story 8-1: Tactical Scenario Content (Partial)

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 8-1-T1 | Design tactical scenario concepts | AC4 | 1.5 | [HUMAN] | None |
| 8-1-T2 | Create tactical-001-conquest.json | AC4 | 1.5 | [COLLAB] | 8-1-T1 |
| 8-1-T3 | Create tactical-002-defense.json | AC4 | 1.5 | [COLLAB] | 8-1-T1 |
| 8-1-T4 | Ensure tutorials first in sort | AC1, AC3 | 0.5 | [AI] | None |
| 8-1-T5 | Add "Tactical" badge styling | AC2 | 0.5 | [AI] | None |
| 8-1-T6 | Verify no tutorial overlay | AC5 | 0.5 | [AI] | None |
| 8-1-T7 | Verify star rating on completion | AC6 | 0.5 | [AI] | 1-5-T4 |
| 8-1-T8 | Playtest and balance scenarios | ALL | 2.0 | [HUMAN] | 8-1-T2, 8-1-T3 |
| 8-1-T9 | Write integration tests (4 tests) | ALL | 1.0 | [AI] | 8-1-T8 |

**Story 8-1 Subtotal:** 9.5 hours

---

### Sprint 5 Summary

| Metric | Value |
|--------|-------|
| Total Hours | 27.5 / 30.0 |
| Stories | 3 (1-5, 1-6, 8-1) |
| Tasks | 23 |
| Tests Added | ~21 |
| Human Input | 3 tasks (content design, playtesting) |
| Buffer | 2.5 hours |

**Sprint 5 Deliverables:**
- [ ] ScenarioResultsPanel with star ratings
- [ ] Completion history in localStorage
- [ ] 2 tactical scenarios playable
- [ ] Epic 1 marked DONE
- [ ] Epic 8 marked DONE (partial content)

---

# SPRINT 6: Scenario Packs (Week 6)

**Epic:** 9 - Scenario Pack System
**Goal:** Enable scenario pack browsing and switching
**Capacity:** 30 hours

## Story 9-1: Scenario Pack Browsing

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 9-1-T1 | Define ScenarioPack JSON schema | - | 1.5 | [AI] | None |
| 9-1-T2 | Create ScenarioPackListPanel | AC1 | 3.0 | [AI] | 9-1-T1 |
| 9-1-T3 | Create default pack (current scenarios) | AC1 | 1.5 | [AI] | 9-1-T1 |
| 9-1-T4 | Design 2 alternative pack concepts | - | 1.0 | [HUMAN] | None |
| 9-1-T5 | Create "Classic" pack JSON | - | 2.0 | [COLLAB] | 9-1-T4 |
| 9-1-T6 | Create "Challenge" pack JSON | - | 2.0 | [COLLAB] | 9-1-T4 |
| 9-1-T7 | Write unit tests (5 tests) | ALL | 1.5 | [AI] | 9-1-T6 |

**Story 9-1 Subtotal:** 12.5 hours

---

## Story 9-2: Scenario Pack Switching

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 9-2-T1 | Add pack selection to ScenarioManager | AC1 | 2.0 | [AI] | 9-1-T1 |
| 9-2-T2 | Reload scenario list on pack switch | AC1 | 1.5 | [AI] | 9-2-T1 |
| 9-2-T3 | Persist selected pack to localStorage | - | 0.5 | [AI] | 9-2-T1 |
| 9-2-T4 | Write unit tests (4 tests) | ALL | 1.0 | [AI] | 9-2-T3 |

**Story 9-2 Subtotal:** 5.0 hours

---

## Story 9-3: Scenario Pack Metadata Display

| Task ID | Task | AC | Hours | Resource | Blocker |
|---------|------|-----|-------|----------|---------|
| 9-3-T1 | Create ScenarioPackDetailPanel | AC1, AC2 | 2.0 | [AI] | 9-1-T1 |
| 9-3-T2 | Display description, author, version | AC2 | 1.0 | [AI] | 9-3-T1 |
| 9-3-T3 | Display scenario count per pack | AC2 | 0.5 | [AI] | 9-3-T1 |
| 9-3-T4 | Write unit tests (3 tests) | ALL | 0.5 | [AI] | 9-3-T3 |

**Story 9-3 Subtotal:** 4.0 hours

---

### Sprint 6 Summary

| Metric | Value |
|--------|-------|
| Total Hours | 21.5 / 30.0 |
| Stories | 3 (9-1, 9-2, 9-3) |
| Tasks | 15 |
| Tests Added | ~12 |
| Human Input | 1 task (pack concept design) |
| Buffer | 8.5 hours (use for polish/bugs) |

**Sprint 6 Deliverables:**
- [ ] Scenario pack browsing UI
- [ ] Pack switching functionality
- [ ] 3 packs available (Default, Classic, Challenge)
- [ ] Epic 9 marked DONE

---

## MVP MILESTONE (End of Week 6)

At this point, the game has:
- Complete combat loop with visible results
- AI notifications and personality display
- Flash Conflicts with tutorials
- Scenario completion tracking
- Multiple scenario packs

**Total Progress:**
- Epics Complete: 9/12 (75%)
- All Phase A-B functionality working
- Game is playable end-to-end

---

# POST-MVP SPRINTS

## Sprint 7-8: User Accounts (Weeks 7-8)

**Epic:** 10 - User Accounts & Cross-Device Persistence
**Blocker:** [EXT] Supabase project setup required

### Prerequisites (Week 7 Day 1)
| Task | Owner | Notes |
|------|-------|-------|
| Create Supabase project | [HUMAN] | supabase.com |
| Configure auth (email/pass) | [HUMAN] | Dashboard |
| Create database schema | [COLLAB] | Migration files |
| Set up RLS policies | [COLLAB] | Security |
| Add SDK to project | [AI] | npm install |
| Configure env vars | [AI] | .env.local |

### Stories 10-1 through 10-7
- 10-1: User account creation
- 10-2: User login
- 10-3: Save campaign progress
- 10-4: Load saved campaigns
- 10-5: Cross-device sync
- 10-6: User settings persistence
- 10-7: User statistics tracking

**Estimated:** 30-40 hours total

---

## Sprint 9: Audio System (Week 9)

**Epic:** 12 - Audio & Atmospheric Immersion
**Blocker:** [EXT] Audio assets required

### Prerequisites
| Task | Owner | Notes |
|------|-------|-------|
| Source UI sound effects | [HUMAN] | Click, hover, error |
| Source combat sounds | [HUMAN] | Laser, explosion |
| Source background music | [HUMAN] | Menu, gameplay themes |
| Convert to web formats | [AI] | MP3/OGG |

### Stories 12-1 through 12-5
- 12-1: Sound effects for game actions
- 12-2: Background music during gameplay
- 12-3: Independent volume controls
- 12-4: Mute audio toggle
- 12-5: Browser audio compliance

**Estimated:** 15-20 hours total

---

# TIMELINE GANTT CHART

```
           W1      W2      W3      W4      W5      W6      W7      W8      W9
         ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐
Epic 6   │██████│      │      │      │      │      │      │      │      │ Combat
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
Epic 7   │      │██████│      │      │      │      │      │      │      │ AI
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
Epic 1   │      │      │██████│██████│████──│      │      │      │      │ Tutorials
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
Epic 8   │      │      │      │      │──████│      │      │      │      │ Scenarios
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
Epic 9   │      │      │      │      │      │██████│      │      │      │ Packs
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
         │      │      │      │      │      │  MVP │      │      │      │ MILESTONE
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
Epic 10  │      │      │      │      │      │      │░░░░░░│░░░░░░│      │ Accounts
         ├──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤
Epic 12  │      │      │      │      │      │      │      │      │░░░░░░│ Audio
         └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘

Legend: ██ = MVP Sprint | ░░ = Post-MVP Sprint | ── = Partial week
```

---

# DEPENDENCY GRAPH

```
                    ┌─────────────┐
                    │   Epic 6    │
                    │   Combat    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  Epic 7  │ │  Epic 1  │ │  Epic 8  │
       │    AI    │ │ Tutorials│ │ Tactical │
       └──────────┘ └────┬─────┘ └────┬─────┘
                         │            │
                         └─────┬──────┘
                               │
                               ▼
                        ┌──────────┐
                        │  Epic 9  │
                        │  Packs   │
                        └──────────┘
                               │
                               ▼
                        ╔══════════╗
                        ║   MVP    ║
                        ╚══════════╝

        ┌──────────┐              ┌──────────┐
        │ Epic 10  │              │ Epic 12  │
        │ Accounts │              │  Audio   │
        │ (EXT:SB) │              │(EXT:SFX) │
        └──────────┘              └──────────┘
```

---

# RESOURCE SUMMARY

## AI-Executable Tasks
| Sprint | AI Tasks | Hours |
|--------|----------|-------|
| Sprint 1 | 17/19 | 27.0 |
| Sprint 2 | 20/20 | 27.0 |
| Sprint 3 | 23/23 | 27.75 |
| Sprint 4 | 13/14 | 24.0 |
| Sprint 5 | 20/23 | 22.0 |
| Sprint 6 | 13/15 | 17.5 |
| **Total MVP** | **106/114** | **145.25** |

## Human Input Required
| Sprint | Task | Type | Hours |
|--------|------|------|-------|
| Sprint 1 | Mockup design | Design | 1.0 |
| Sprint 4 | Tutorial content | Content | 1.0 |
| Sprint 5 | Scenario design | Content | 1.5 |
| Sprint 5 | Playtesting | QA | 2.0 |
| Sprint 6 | Pack concepts | Design | 1.0 |
| **Total MVP** | | | **6.5** |

## External Dependencies
| Dependency | Blocks | Lead Time |
|------------|--------|-----------|
| Supabase setup | Epic 10 | 2-3 days |
| Audio assets | Epic 12 | 1 week |

---

# NEXT STEPS

1. **Review this roadmap** for accuracy and priority alignment
2. **Approve Sprint 1 scope** (Stories 6-2, 6-3)
3. **Decide MVP cutoff** (Week 6 as planned?)
4. **Schedule human input sessions:**
   - Week 1: Combat mockup review
   - Week 4: Tutorial content authoring
   - Week 5: Tactical scenario design + playtesting
5. **Begin Sprint 1 execution**

---

*Document Version: 2.0*
*Last Updated: 2025-12-12*
