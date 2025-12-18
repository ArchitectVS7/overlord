# Overlord Implementation Planning Roadmap

**Generated:** 2025-12-11
**Status:** Planning Phase (Pre-Implementation)
**Remaining Stories:** 26 across 7 epics

---

## Executive Summary

This roadmap outlines all remaining implementation work for Overlord from current state to Alpha testing readiness. Stories are organized by epic with dependency analysis, blocker identification, and human intervention requirements.

**Completion Status:**
- **DONE:** Epics 11, 3, 2, 4, 5 (25 stories)
- **IN-PROGRESS:** Epic 6 (1/3 stories)
- **BACKLOG:** Epics 6 (partial), 7, 1, 8, 9, 10, 12 (26 stories)

---

## PHASE A: Core Gameplay Completion (Epic 6)

### Epic 6: Combat & Planetary Invasion
**Epic Status:** IN-PROGRESS (1/3 done)
**Priority:** CRITICAL - Completes combat loop
**FRs Covered:** FR20, FR21, FR22

---

### Story 6-2: Combat Aggression Configuration
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [CORE-DONE] - Aggression logic exists, needs UI only

#### Upstream Dependencies
- [x] Story 6-1: Invasion initiation (DONE - InvasionPanel exists)
- [x] CombatSystem.ts - aggression parameter already implemented
- [x] InvasionPanel.ts - integration point exists

#### Downstream Dependencies
- Story 6-3: Combat resolution uses aggression setting
- Story 7-1: AI uses aggression for its attacks

#### FR/NFR Traceability
- **FR21:** Players can configure combat aggression levels (0-100%) before battles
- **NFR-P3:** Visual feedback within 100ms
- **NFR-U4:** UI patterns consistent (slider matches other game sliders)

#### Blockers
- **NONE** - All dependencies satisfied

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Phaser 3 UI components (Slider)
- Core/UI integration pattern (event subscription)

#### Testing Requirements
- Unit: AggressionSlider component tests (5-8 tests)
- Integration: InvasionPanel with aggression value (3-4 tests)
- E2E: Set aggression → verify combat uses value

#### Estimated Tasks
1. Create AggressionSlider.ts component
2. Integrate into InvasionPanel
3. Connect to CombatSystem aggression parameter
4. Add visual feedback (percentage display, labels)

---

### Story 6-3: Combat Resolution and Battle Results
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [CORE-DONE] - CombatSystem complete, needs results UI

#### Upstream Dependencies
- [x] Story 6-1: Invasion initiation (DONE)
- [x] Story 6-2: Aggression configuration (must complete first)
- [x] CombatSystem.ts - resolution logic complete
- [x] InvasionSystem.ts - integration exists

#### Downstream Dependencies
- Epic 7: AI sees combat results to adapt strategy
- Epic 1: Tutorial scenarios show combat results

#### FR/NFR Traceability
- **FR22:** Players can view combat results (casualties, victory/defeat, captured resources)
- **NFR-P3:** Combat resolution within 5 seconds
- **NFR-U3:** Clear error messages for edge cases

#### Blockers
- **Story 6-2** must complete first (aggression affects results)

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Phaser 3 scene transitions
- Core event subscription pattern
- UI panel design (results screen)

#### Testing Requirements
- Unit: CombatResultsPanel display tests (8-10 tests)
- Integration: Combat resolution → results display flow (5-6 tests)
- E2E: Full invasion → combat → results cycle

#### Estimated Tasks
1. Create CombatResultsPanel.ts component
2. Subscribe to CombatSystem.onCombatResolved event
3. Display victory/defeat status
4. Show casualty breakdown (attacker/defender)
5. Show resource capture breakdown
6. Add "Continue" button with proper focus handling
7. Integrate with GalaxyMapScene (show panel after combat phase)

---

## PHASE B: AI Integration (Epic 7)

### Epic 7: AI Opponent System
**Epic Status:** BACKLOG
**Priority:** HIGH - AI already works, just needs visibility
**FRs Covered:** FR23, FR24

**Epic-Level Notes:**
- AIDecisionSystem.ts is COMPLETE with all 4 personalities
- All difficulty levels (Easy/Normal/Hard) implemented
- This epic is primarily UI/notifications work, NOT core logic

---

### Story 7-1: AI Strategic Decision-Making
**Status:** backlog
**Complexity:** LOW-MEDIUM
**Implementation Tag:** [CORE-DONE] - AIDecisionSystem complete, needs notifications

#### Upstream Dependencies
- [x] Epic 6 complete (combat system for AI attacks)
- [x] AIDecisionSystem.ts - fully implemented
- [x] TurnSystem.ts - AI turn phase exists

#### Downstream Dependencies
- Story 7-2: Difficulty affects decision making
- Epic 1: Tutorial explains AI behavior

#### FR/NFR Traceability
- **FR23:** AI opponents make strategic decisions (build economy, train military, launch attacks)
- **NFR-P3:** AI turn processing within 2 seconds

#### Blockers
- **Epic 6** must complete (AI needs combat system for attacks)

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Event-driven notification system
- Phaser 3 toast/notification UI
- AIDecisionSystem event subscription

#### Testing Requirements
- Unit: AINotificationManager tests (6-8 tests)
- Integration: AI turn → notification display (4-5 tests)
- E2E: Watch AI turn, verify visible notifications

#### Estimated Tasks
1. Create AINotificationManager.ts
2. Subscribe to AIDecisionSystem events
3. Create toast/notification UI component
4. Display AI actions during AI turn phase
5. Add option to auto-skip AI turn visualization (speed setting)

---

### Story 7-2: AI Personality and Difficulty Adaptation
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [CORE-DONE] - Already works, needs UI display

#### Upstream Dependencies
- [x] Story 7-1: AI notifications (extends this)
- [x] Story 2-1: Campaign creation (difficulty selection)
- [x] AIDecisionSystem.ts - 4 personalities implemented

#### Downstream Dependencies
- Epic 9: Scenario packs can override AI personality

#### FR/NFR Traceability
- **FR24:** AI adapts behavior based on personality type and difficulty level
- **FR2:** (Already covered in Epic 2) Players select AI personality

#### Blockers
- **Story 7-1** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- UI information display
- Campaign configuration integration

#### Testing Requirements
- Unit: AI personality indicator tests (4-5 tests)
- Integration: Campaign config → AI behavior verification (3-4 tests)

#### Estimated Tasks
1. Add AI personality indicator to galaxy map UI
2. Show difficulty badge near AI planets
3. Add tooltip explaining current AI behavior tendencies
4. Verify personality affects AI decisions (existing tests)

---

## PHASE C: Player Onboarding (Epic 1)

### Epic 1: Player Onboarding & Tutorials
**Epic Status:** BACKLOG
**Priority:** HIGH - Critical for new player experience
**FRs Covered:** FR25, FR26, FR27, FR29, FR30, FR31

**Epic-Level Notes:**
- This is a GREENFIELD epic - new Flash Conflicts system
- Requires significant new infrastructure
- Tutorial engine is complex - break into small tasks

---

### Story 1-1: Flash Conflicts Menu Access
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - New FlashConflict system

#### Upstream Dependencies
- [x] MainMenuScene exists (from boot)
- [x] Scene transition system works

#### Downstream Dependencies
- Story 1-2: Scenario selection interface
- Story 1-3: Scenario initialization
- ALL subsequent Epic 1 stories

#### FR/NFR Traceability
- **FR25:** Players can access Flash Conflicts menu separate from campaign mode
- **NFR-P2:** Flash Conflict menu loads within 2 seconds

#### Blockers
- **NONE** - Entry point story

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Phaser 3 scene management
- Menu UI component design
- Scene transition patterns

#### Testing Requirements
- Unit: FlashConflictsScene initialization (5-6 tests)
- Integration: MainMenu → FlashConflicts navigation (3-4 tests)
- E2E: Click menu → scene loads within 2s

#### Estimated Tasks
1. Create FlashConflictsScene.ts
2. Add "Flash Conflicts" button to MainMenuScene
3. Implement scene transition with loading indicator
4. Create basic menu layout (scenario list placeholder)
5. Add "Back" button to return to main menu
6. Register scene in PhaserConfig

---

### Story 1-2: Scenario Selection Interface
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - Depends on 1-1

#### Upstream Dependencies
- [ ] Story 1-1: Flash Conflicts menu (MUST COMPLETE FIRST)
- [x] JSON scenario schema (defined in Architecture)

#### Downstream Dependencies
- Story 1-3: Selected scenario initializes
- Story 1-5: Completion results

#### FR/NFR Traceability
- **FR26:** Players can select and start individual Flash Conflicts
- **NFR-P2:** Scenario start within 2 seconds
- **NFR-U1:** Scenarios sorted by learning sequence

#### Blockers
- **Story 1-1** must complete first

#### Human Intervention Required
- **PARTIAL** - Requires scenario JSON content creation
  - Tutorial scenario definitions needed
  - Can stub with placeholder scenarios initially

#### Core Competencies Required
- Phaser 3 scrollable lists
- JSON loading and parsing
- Scenario data model

#### Testing Requirements
- Unit: ScenarioService.loadScenarios() tests (6-8 tests)
- Integration: Select scenario → load details (4-5 tests)
- E2E: Browse → select → view details

#### Estimated Tasks
1. Create ScenarioService.ts for loading scenarios
2. Define scenario JSON schema (if not exists)
3. Create placeholder tutorial scenarios (2-3 minimum)
4. Build ScenarioListComponent.ts
5. Build ScenarioDetailPanel.ts
6. Add scenario filtering (tutorial vs tactical)
7. Implement "Start Scenario" button

---

### Story 1-3: Scenario Initialization and Victory Conditions
**Status:** backlog
**Complexity:** HIGH
**Implementation Tag:** [CORE-PARTIAL] - Victory logic exists, needs scenario init

#### Upstream Dependencies
- [ ] Story 1-2: Scenario selection (MUST COMPLETE FIRST)
- [x] GameState.ts - state management exists
- [x] VictorySystem - victory detection exists

#### Downstream Dependencies
- Story 1-4: Tutorial guidance uses initialized state
- Story 1-5: Completion checks victory conditions

#### FR/NFR Traceability
- **FR29:** Players can view Flash Conflict victory conditions before starting
- **NFR-S3:** Scenario JSON validated against schema

#### Blockers
- **Story 1-2** must complete first

#### Human Intervention Required
- **PARTIAL** - Tutorial scenario JSON content needed

#### Core Competencies Required
- GameState initialization from JSON
- Custom victory condition evaluation
- Scenario state serialization

#### Testing Requirements
- Unit: ScenarioInitializer tests (10-12 tests)
- Integration: Scenario → GameState initialization (6-8 tests)
- Validation: JSON schema validation tests

#### Estimated Tasks
1. Create ScenarioInitializer.ts
2. Parse scenario JSON initial_state
3. Configure GameState from scenario config
4. Create VictoryConditionPanel.ts
5. Display victory conditions overlay
6. Add "O" key shortcut to reopen objectives
7. Handle malformed JSON gracefully (error screen)

---

### Story 1-4: Tutorial Step Guidance System
**Status:** backlog
**Complexity:** HIGH
**Implementation Tag:** [GREENFIELD] - Tutorial engine needed

#### Upstream Dependencies
- [ ] Story 1-3: Scenario initialization (MUST COMPLETE FIRST)
- [x] InputSystem - for detecting user actions
- [x] UI components - for highlighting

#### Downstream Dependencies
- Story 1-5: Completion after tutorial finishes
- Epic 8: Tactical scenarios may reuse guidance system

#### FR/NFR Traceability
- **FR27:** Players can complete tutorial Flash Conflicts that teach specific game mechanics
- **NFR-U1:** Tutorial teaches mechanics in 5-10 minutes

#### Blockers
- **Story 1-3** must complete first

#### Human Intervention Required
- **YES** - Tutorial content design needed
  - Step-by-step instructions for each tutorial
  - Highlight targets and action triggers
  - Can implement engine, stub content

#### Core Competencies Required
- Step-based state machine
- UI element highlighting/spotlight
- User action detection
- Tutorial content authoring format

#### Testing Requirements
- Unit: TutorialEngine state machine (12-15 tests)
- Unit: TutorialStep action detection (8-10 tests)
- Integration: Tutorial flow (start → step → complete)
- E2E: Complete a tutorial scenario

#### Estimated Tasks (REQUIRES SUB-TASKS)
1. **Task Group A: Tutorial Engine Core**
   - Create TutorialEngine.ts state machine
   - Define TutorialStep interface
   - Implement step progression logic

2. **Task Group B: UI Highlighting**
   - Create HighlightOverlay.ts
   - Implement spotlight effect
   - Add instruction panel component

3. **Task Group C: Action Detection**
   - Hook into InputSystem for action detection
   - Create TutorialActionValidator.ts
   - Implement step completion triggers

4. **Task Group D: Content Integration**
   - Parse tutorial_steps from scenario JSON
   - Create stub tutorial content
   - Wire tutorial engine to scenario flow

---

### Story 1-5: Scenario Completion and Results Display
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [CORE-PARTIAL] - Events exist, needs UI

#### Upstream Dependencies
- [ ] Story 1-4: Tutorial guidance (or skip if tactical)
- [ ] Story 1-3: Victory condition checking
- [x] VictorySystem - emits completion events

#### Downstream Dependencies
- Story 1-6: Completion history tracking

#### FR/NFR Traceability
- **FR30:** Players can view Flash Conflict completion results (success/failure, completion time)
- **NFR-U2:** Clear success/failure indication

#### Blockers
- **Story 1-3** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Phaser 3 UI panels
- Timer implementation
- Victory event subscription

#### Testing Requirements
- Unit: ScenarioResultsPanel tests (6-8 tests)
- Integration: Victory → results display (4-5 tests)
- E2E: Complete scenario → see results

#### Estimated Tasks
1. Create ScenarioResultsPanel.ts
2. Track scenario start time
3. Calculate completion time on victory
4. Display success/failure status
5. Show performance metrics (time, turns)
6. Add "Retry" and "Back to Menu" buttons

---

### Story 1-6: Scenario Completion History Tracking
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [CORE-PARTIAL] - Save logic exists

#### Upstream Dependencies
- [ ] Story 1-5: Completion results (what to track)
- [x] SaveSystem - can persist data
- [x] LocalStorage - for offline support

#### Downstream Dependencies
- Epic 10: Cloud sync of completion history

#### FR/NFR Traceability
- **FR31:** System can track Flash Conflict completion history per user
- **NFR-R3:** Completion data syncs within 5 seconds (when cloud ready)

#### Blockers
- **Story 1-5** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- LocalStorage management
- Completion data model
- Best time tracking

#### Testing Requirements
- Unit: CompletionTracker tests (8-10 tests)
- Integration: Complete → save → reload (5-6 tests)
- E2E: Complete scenario, restart game, verify history

#### Estimated Tasks
1. Create CompletionTracker.ts
2. Define completion data model (scenario_id, completed, time, attempts)
3. Save to LocalStorage on completion
4. Display completion badges in scenario list
5. Show best time for completed scenarios
6. Prepare for future Supabase sync (Epic 10)

---

## PHASE D: Extended Content (Epics 8, 9)

### Epic 8: Quick-Play Tactical Scenarios
**Epic Status:** BACKLOG
**Priority:** MEDIUM - Content variety
**FRs Covered:** FR28

---

### Story 8-1: Tactical Scenario Content and Variety
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - Scenario definitions

#### Upstream Dependencies
- [ ] Epic 1 COMPLETE (Flash Conflicts infrastructure)
- [ ] Story 1-2: Scenario selection interface
- [ ] Story 1-3: Scenario initialization

#### Downstream Dependencies
- Epic 9: Scenario packs include tactical scenarios

#### FR/NFR Traceability
- **FR28:** Players can complete tactical Flash Conflicts as quick-play challenges

#### Blockers
- **Epic 1 MUST COMPLETE FIRST** - Reuses all Flash Conflicts infrastructure

#### Human Intervention Required
- **YES** - Tactical scenario content design needed
  - Scenario configurations (initial state, victory conditions)
  - Difficulty balancing
  - Variety of tactical challenges

#### Core Competencies Required
- Scenario JSON authoring
- Victory condition variety
- Difficulty progression design

#### Testing Requirements
- Unit: Tactical scenario loading (4-5 tests)
- Integration: Tactical scenarios in selection UI (3-4 tests)
- E2E: Play through a tactical scenario

#### Estimated Tasks
1. Design 3-5 tactical scenario concepts
2. Create tactical scenario JSON files
3. Add "Tactical" filter to scenario selection
4. Verify tactical scenarios work with existing infrastructure
5. Balance difficulty for quick-play (5-15 minute sessions)

---

### Epic 9: Scenario Pack System
**Epic Status:** BACKLOG
**Priority:** LOW - Content extensibility
**FRs Covered:** FR32, FR33, FR34, FR35

---

### Story 9-1: Scenario Pack Browsing and Selection
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - Pack system + UI

#### Upstream Dependencies
- [ ] Epic 1 COMPLETE (scenario infrastructure)
- [ ] MainMenuScene - add pack selection

#### Downstream Dependencies
- Story 9-2: Pack switching
- Story 9-3: Pack metadata display

#### FR/NFR Traceability
- **FR32:** Players can browse available scenario packs from the main menu
- **NFR-P2:** Pack list loads within 2 seconds

#### Blockers
- **Epic 1 SHOULD COMPLETE FIRST** (scenario system needed)

#### Human Intervention Required
- **PARTIAL** - Pack content needs design
  - At least 2-3 starter packs needed
  - Can implement with placeholder packs

#### Core Competencies Required
- JSON pack schema
- Pack management UI
- Pack configuration loading

#### Testing Requirements
- Unit: PackService tests (6-8 tests)
- Integration: Pack selection → configuration (4-5 tests)
- E2E: Browse packs, select one

#### Estimated Tasks
1. Define scenario pack JSON schema
2. Create PackService.ts
3. Create at least 2 placeholder packs
4. Build PackSelectionScene.ts
5. Add "Scenario Packs" to main menu

---

### Story 9-2: Scenario Pack Switching and Configuration Loading
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [CORE-PARTIAL] - Config support exists

#### Upstream Dependencies
- [ ] Story 9-1: Pack browsing (MUST COMPLETE FIRST)
- [x] AIDecisionSystem - accepts config overrides
- [x] GalaxyGenerator - accepts seed/params

#### Downstream Dependencies
- All campaigns use selected pack configuration

#### FR/NFR Traceability
- **FR33:** Players can switch between scenario packs
- **FR34:** System can load scenario pack configurations from JSON

#### Blockers
- **Story 9-1** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Configuration hot-swapping
- System parameter injection
- State management for active pack

#### Testing Requirements
- Unit: PackConfigurationLoader tests (8-10 tests)
- Integration: Pack switch → system config update (5-6 tests)
- E2E: Switch pack, start campaign, verify config applied

#### Estimated Tasks
1. Create PackConfigurationLoader.ts
2. Inject pack config into AIDecisionSystem
3. Inject pack config into GalaxyGenerator
4. Store active pack preference
5. Handle pack switch mid-session (warn/block)

---

### Story 9-3: Scenario Pack Metadata Display
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [CORE-PARTIAL] - Enums exist

#### Upstream Dependencies
- [ ] Story 9-1: Pack browsing (MUST COMPLETE FIRST)
- [x] UI components from Epic 11

#### Downstream Dependencies
- None (terminal story)

#### FR/NFR Traceability
- **FR35:** Players can view scenario pack metadata

#### Blockers
- **Story 9-1** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Metadata display UI
- Pack JSON parsing

#### Testing Requirements
- Unit: PackMetadataPanel tests (4-5 tests)
- Integration: Select pack → show metadata (2-3 tests)

#### Estimated Tasks
1. Create PackMetadataPanel.ts
2. Display pack name, version, difficulty
3. Show faction information (name, leader, lore)
4. Display AI configuration summary
5. Show galaxy template info (planet count, types)

---

## PHASE E: Platform Features (Epic 10)

### Epic 10: User Accounts & Cross-Device Persistence
**Epic Status:** BACKLOG
**Priority:** LOW - Polish feature, requires Supabase
**FRs Covered:** FR36, FR37, FR38, FR39, FR40, FR41, FR42

**Epic-Level Notes:**
- Requires Supabase project setup (external dependency)
- SaveSystem.ts already works for local saves
- This epic adds cloud sync capability

---

### Story 10-1: User Account Creation
**Status:** backlog
**Complexity:** HIGH
**Implementation Tag:** [GREENFIELD] - Auth + Supabase

#### Upstream Dependencies
- [x] None for basic UI
- [ ] **EXTERNAL:** Supabase project configured

#### Downstream Dependencies
- Story 10-2: Login requires accounts to exist
- All other Epic 10 stories

#### FR/NFR Traceability
- **FR36:** Players can create user accounts with email/password authentication
- **NFR-S1:** Passwords hashed with bcrypt (Supabase handles)
- **NFR-S4:** No PII beyond email/username

#### Blockers
- **EXTERNAL DEPENDENCY:** Supabase project must be configured
- **HUMAN INTERVENTION REQUIRED:** Supabase setup

#### Human Intervention Required
- **YES** - Supabase configuration needed
  - Create Supabase project
  - Configure authentication settings
  - Set up database tables
  - Create RLS policies
  - Get API keys for environment variables

#### Core Competencies Required
- Supabase SDK integration
- Authentication flow design
- Form validation
- Error handling for auth failures

#### Testing Requirements
- Unit: AuthService tests (10-12 tests)
- Integration: Registration flow (5-6 tests)
- E2E: Create account → verify email → login
- **NOTE:** May need mock Supabase for unit tests

#### Estimated Tasks
1. Create SupabaseService.ts wrapper
2. Create AuthService.ts
3. Build RegistrationScene.ts / RegistrationPanel.ts
4. Implement email validation
5. Implement password strength validation
6. Handle registration errors gracefully
7. Add "Create Account" to main menu

---

### Story 10-2: User Login
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - Auth + Supabase

#### Upstream Dependencies
- [ ] Story 10-1: Account creation (MUST COMPLETE FIRST)
- [ ] Supabase configured

#### Downstream Dependencies
- Story 10-3: Save requires authenticated user
- Story 10-5: Cloud sync requires login

#### FR/NFR Traceability
- **FR37:** Players can log in to access their saved games and profile
- **NFR-S1:** Secure HTTP-only cookies

#### Blockers
- **Story 10-1** must complete first
- **Supabase** must be configured

#### Human Intervention Required
- **NONE** (if Supabase already configured in 10-1)

#### Core Competencies Required
- Login flow implementation
- Session management
- Remember me functionality

#### Testing Requirements
- Unit: Login validation tests (6-8 tests)
- Integration: Login → session established (4-5 tests)
- E2E: Login → access authenticated features

#### Estimated Tasks
1. Build LoginScene.ts / LoginPanel.ts
2. Implement login form validation
3. Handle login errors (wrong password, etc.)
4. Store session securely
5. Implement "Remember Me" checkbox
6. Add session refresh logic

---

### Story 10-3: Save Campaign Progress
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [CORE-DONE] - SaveSystem works, needs UI + cloud

#### Upstream Dependencies
- [ ] Story 10-2: Login (for cloud saves)
- [x] SaveSystem.ts - local save works
- [x] GameState serialization complete

#### Downstream Dependencies
- Story 10-4: Load requires saved games
- Story 10-5: Cloud sync of saves

#### FR/NFR Traceability
- **FR38:** Players can save campaign progress at any time
- **NFR-R1:** Save operations succeed >99.9%

#### Blockers
- **Story 10-2** for cloud saves (local saves can work without)

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Save UI panel design
- Supabase storage integration
- Offline/online detection

#### Testing Requirements
- Unit: SaveManager tests (8-10 tests)
- Integration: Save → verify stored (5-6 tests)
- E2E: Save game → reload page → verify data exists

#### Estimated Tasks
1. Create SaveManager.ts (coordinates local + cloud)
2. Build SaveGamePanel.ts UI
3. Add save slot selection
4. Implement save naming
5. Show save timestamp
6. Queue saves for cloud sync when online

---

### Story 10-4: Load Previously Saved Campaigns
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [CORE-DONE] - LoadSystem works, needs UI + cloud

#### Upstream Dependencies
- [ ] Story 10-3: Save (need saves to load)
- [x] SaveSystem.ts - load logic exists

#### Downstream Dependencies
- None (can load without cloud sync)

#### FR/NFR Traceability
- **FR39:** Players can load previously saved campaigns
- **NFR-R1:** Load operations succeed >99.9%

#### Blockers
- **Story 10-3** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Load UI panel design
- Save game preview
- Corruption detection

#### Testing Requirements
- Unit: LoadManager tests (6-8 tests)
- Integration: Load → game state restored (5-6 tests)
- E2E: Load game → verify correct state

#### Estimated Tasks
1. Create LoadManager.ts
2. Build LoadGamePanel.ts UI
3. Display save slot previews (name, date, turn)
4. Handle corrupted saves gracefully
5. Add delete save functionality
6. Implement autosave loading

---

### Story 10-5: Cross-Device Save Synchronization
**Status:** backlog
**Complexity:** HIGH
**Implementation Tag:** [GREENFIELD] - Supabase integration

#### Upstream Dependencies
- [ ] Story 10-2: Login (authentication required)
- [ ] Story 10-3: Save (saves exist to sync)
- [ ] Story 10-4: Load (for receiving synced saves)
- [ ] Supabase configured

#### Downstream Dependencies
- None (capstone cloud feature)

#### FR/NFR Traceability
- **FR40:** Players can access saved games from different devices
- **NFR-R3:** Save data syncs within 5 seconds
- **NFR-R3:** Last-write-wins conflict resolution

#### Blockers
- **Stories 10-2, 10-3, 10-4** must complete first
- **Supabase** must be configured

#### Human Intervention Required
- **PARTIAL** - Supabase storage tables needed
  - If 10-1 sets up Supabase, this should be covered

#### Core Competencies Required
- Supabase realtime subscriptions
- Conflict resolution strategies
- Offline queue management
- Background sync

#### Testing Requirements
- Unit: SyncService tests (10-12 tests)
- Integration: Save → sync → other device load (6-8 tests)
- E2E: Save on device A → load on device B
- **NOTE:** May need mock Supabase for unit tests

#### Estimated Tasks
1. Create SyncService.ts
2. Implement save upload to Supabase
3. Implement save download from Supabase
4. Add offline queue for pending syncs
5. Implement last-write-wins conflict resolution
6. Add sync status indicator to UI
7. Handle sync failures gracefully

---

### Story 10-6: User Settings Persistence
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [GREENFIELD] - Settings system

#### Upstream Dependencies
- [ ] Story 10-2: Login (for cloud settings)
- [x] LocalStorage - for offline settings
- [x] AccessibilitySettings - exists from Epic 11

#### Downstream Dependencies
- None (independent feature)

#### FR/NFR Traceability
- **FR41:** System can persist user settings and preferences across sessions

#### Blockers
- **Story 10-2** for cloud persistence (local works without)

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Settings data model
- LocalStorage management
- Optional Supabase integration

#### Testing Requirements
- Unit: SettingsPersistence tests (6-8 tests)
- Integration: Change setting → reload → verify (4-5 tests)

#### Estimated Tasks
1. Create SettingsManager.ts
2. Define settings data model
3. Save to LocalStorage on change
4. Load settings on game start
5. Optional: Sync to Supabase user_profiles table

---

### Story 10-7: User Statistics Tracking
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - Stats aggregation

#### Upstream Dependencies
- [ ] Story 10-2: Login (for cloud stats)
- [ ] Story 1-6: Scenario completion tracking
- [x] TurnSystem - for playtime tracking

#### Downstream Dependencies
- None (terminal feature)

#### FR/NFR Traceability
- **FR42:** System can track user statistics (campaigns completed, Flash Conflicts completed, playtime)

#### Blockers
- **Story 10-2** for cloud persistence
- **Story 1-6** for completion stats

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Statistics aggregation
- Playtime tracking
- Stats display UI

#### Testing Requirements
- Unit: StatsTracker tests (8-10 tests)
- Integration: Complete campaign → stats updated (4-5 tests)
- E2E: Play → check stats screen

#### Estimated Tasks
1. Create StatsTracker.ts
2. Define statistics data model
3. Track playtime (active game time)
4. Track campaigns started/completed
5. Track Flash Conflicts completed
6. Build StatsPanel.ts UI
7. Add stats access from main menu

---

## PHASE F: Audio Polish (Epic 12)

### Epic 12: Audio & Atmospheric Immersion
**Epic Status:** BACKLOG
**Priority:** LOW - Polish feature
**FRs Covered:** FR51, FR52, FR53, FR54, FR55

**Epic-Level Notes:**
- Requires audio asset creation (external dependency)
- Web Audio API requires user gesture to initialize
- Can implement system, stub with placeholder sounds

---

### Story 12-1: Sound Effects for Game Actions
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - AudioSystem

#### Upstream Dependencies
- [x] Game actions exist (combat, construction, UI)
- [ ] **EXTERNAL:** Sound effect audio files

#### Downstream Dependencies
- Story 12-3: Volume controls for SFX
- Story 12-4: Mute affects SFX

#### FR/NFR Traceability
- **FR51:** Players can hear sound effects for game actions
- **NFR-P4:** Audio assets load on-demand

#### Blockers
- **EXTERNAL DEPENDENCY:** Sound effect audio files needed

#### Human Intervention Required
- **YES** - Audio asset creation/sourcing
  - Combat sounds
  - Construction completion
  - UI click sounds
  - Can use placeholder/royalty-free sounds initially

#### Core Competencies Required
- Phaser 3 audio system
- Web Audio API
- Audio sprite/atlas management
- Event-driven sound triggers

#### Testing Requirements
- Unit: AudioManager tests (8-10 tests)
- Integration: Action → sound plays (5-6 tests)
- E2E: Trigger action → hear sound (manual verification)
- **NOTE:** Audio tests may be limited to initialization/configuration

#### Estimated Tasks
1. Create AudioManager.ts
2. Create SoundEffectService.ts
3. Define sound effect map (action → sound file)
4. Integrate with game events (combat, build, UI)
5. Add placeholder sound files (can use royalty-free)
6. Implement audio preloading strategy

---

### Story 12-2: Background Music During Gameplay
**Status:** backlog
**Complexity:** MEDIUM
**Implementation Tag:** [GREENFIELD] - Music playback

#### Upstream Dependencies
- [ ] Story 12-1: AudioManager (SHOULD COMPLETE FIRST)
- [ ] **EXTERNAL:** Music audio files

#### Downstream Dependencies
- Story 12-3: Volume controls for music
- Story 12-4: Mute affects music

#### FR/NFR Traceability
- **FR52:** Players can hear background music during gameplay
- **NFR-P4:** Music streams on-demand

#### Blockers
- **EXTERNAL DEPENDENCY:** Music audio files needed

#### Human Intervention Required
- **YES** - Music asset creation/sourcing
  - Main menu music
  - Galaxy map music
  - Combat music
  - Can use placeholder/royalty-free music initially

#### Core Competencies Required
- Audio streaming
- Music looping
- Cross-fade between tracks
- Scene-based music selection

#### Testing Requirements
- Unit: MusicService tests (6-8 tests)
- Integration: Scene change → music change (4-5 tests)
- E2E: Navigate scenes → music changes (manual)

#### Estimated Tasks
1. Create MusicService.ts
2. Define music tracks per scene
3. Implement looping playback
4. Add cross-fade between tracks
5. Add placeholder music files
6. Hook into scene transitions

---

### Story 12-3: Independent Volume Controls
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [GREENFIELD] - Mixer + UI

#### Upstream Dependencies
- [ ] Story 12-1: SFX system (to control)
- [ ] Story 12-2: Music system (to control)
- [x] SettingsPanel - from Epic 11

#### Downstream Dependencies
- Story 10-6: Volume settings persistence

#### FR/NFR Traceability
- **FR53:** Players can adjust audio volume levels independently (Master, SFX, Music)
- **NFR-U4:** UI patterns consistent (sliders match other game sliders)

#### Blockers
- **Stories 12-1, 12-2** should complete first (but can stub)

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Audio mixer design
- Volume slider UI
- Settings integration

#### Testing Requirements
- Unit: AudioMixer tests (6-8 tests)
- Integration: Slider → volume change (4-5 tests)
- E2E: Adjust volume → hear difference (manual)

#### Estimated Tasks
1. Create AudioMixer.ts
2. Implement master volume
3. Implement SFX volume
4. Implement music volume
5. Add volume sliders to SettingsPanel
6. Persist volume settings

---

### Story 12-4: Mute Audio Toggle
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [GREENFIELD] - Mute logic

#### Upstream Dependencies
- [ ] Story 12-3: Volume controls (to integrate)
- [x] SettingsPanel - from Epic 11

#### Downstream Dependencies
- None (terminal feature)

#### FR/NFR Traceability
- **FR54:** Players can mute audio entirely

#### Blockers
- **Story 12-3** should complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Mute state management
- Quick toggle UI

#### Testing Requirements
- Unit: Mute toggle tests (4-5 tests)
- Integration: Toggle → audio stops (3-4 tests)
- E2E: Click mute → verify silence (manual)

#### Estimated Tasks
1. Add mute state to AudioMixer
2. Create mute toggle button
3. Add to SettingsPanel
4. Add keyboard shortcut (M key)
5. Show mute indicator in game UI

---

### Story 12-5: User Activation for Browser Audio Compliance
**Status:** backlog
**Complexity:** LOW
**Implementation Tag:** [GREENFIELD] - Browser policy

#### Upstream Dependencies
- [ ] Story 12-1: AudioManager (initialization)
- [x] User gesture detection exists in InputSystem

#### Downstream Dependencies
- None (prerequisite feature)

#### FR/NFR Traceability
- **FR55:** System can request user activation before enabling audio

#### Blockers
- **Story 12-1** must complete first

#### Human Intervention Required
- **NONE** - Fully automatable

#### Core Competencies Required
- Browser autoplay policies
- User gesture detection
- Audio context resume

#### Testing Requirements
- Unit: AudioActivation tests (4-5 tests)
- Integration: First click → audio enabled (3-4 tests)
- E2E: Fresh page load → click → audio works

#### Estimated Tasks
1. Detect Web Audio context state
2. Create audio activation prompt if needed
3. Resume audio context on user gesture
4. Hide prompt after activation
5. Remember activation state for session

---

## Summary: Human Intervention Requirements

### Stories Requiring Human Intervention

| Story | Intervention Type | Description |
|-------|------------------|-------------|
| 1-2 | PARTIAL | Tutorial scenario JSON content |
| 1-3 | PARTIAL | Tutorial scenario JSON content |
| 1-4 | YES | Tutorial step-by-step content design |
| 8-1 | YES | Tactical scenario content design |
| 9-1 | PARTIAL | Scenario pack content (can stub) |
| 10-1 | YES | Supabase project configuration |
| 12-1 | YES | Sound effect audio files |
| 12-2 | YES | Music audio files |

### Fully Automatable Stories (18 of 26)
6-2, 6-3, 7-1, 7-2, 1-1, 1-5, 1-6, 9-2, 9-3, 10-2, 10-3, 10-4, 10-5, 10-6, 10-7, 12-3, 12-4, 12-5

---

## Recommended Implementation Order

### Sprint 1: Complete Core Combat (Epic 6)
1. Story 6-2: Combat Aggression Configuration
2. Story 6-3: Combat Resolution and Battle Results

### Sprint 2: AI Visibility (Epic 7)
3. Story 7-1: AI Strategic Decision-Making
4. Story 7-2: AI Personality and Difficulty Adaptation

### Sprint 3: Tutorial Foundation (Epic 1 Part 1)
5. Story 1-1: Flash Conflicts Menu Access
6. Story 1-2: Scenario Selection Interface
7. Story 1-3: Scenario Initialization and Victory Conditions

### Sprint 4: Tutorial Completion (Epic 1 Part 2)
8. Story 1-4: Tutorial Step Guidance System (COMPLEX - multiple sub-tasks)
9. Story 1-5: Scenario Completion and Results Display
10. Story 1-6: Scenario Completion History Tracking

### Sprint 5: Content Expansion (Epics 8, 9)
11. Story 8-1: Tactical Scenario Content and Variety
12. Story 9-1: Scenario Pack Browsing and Selection
13. Story 9-2: Scenario Pack Switching and Configuration Loading
14. Story 9-3: Scenario Pack Metadata Display

### Sprint 6: User Accounts (Epic 10 Part 1) [REQUIRES SUPABASE]
15. Story 10-1: User Account Creation
16. Story 10-2: User Login
17. Story 10-3: Save Campaign Progress

### Sprint 7: Cloud Features (Epic 10 Part 2)
18. Story 10-4: Load Previously Saved Campaigns
19. Story 10-5: Cross-Device Save Synchronization
20. Story 10-6: User Settings Persistence
21. Story 10-7: User Statistics Tracking

### Sprint 8: Audio Polish (Epic 12) [REQUIRES AUDIO ASSETS]
22. Story 12-1: Sound Effects for Game Actions
23. Story 12-2: Background Music During Gameplay
24. Story 12-3: Independent Volume Controls
25. Story 12-4: Mute Audio Toggle
26. Story 12-5: User Activation for Browser Audio Compliance

---

## Next Steps

This roadmap is ready for detailed story planning using the three-agent workflow:

1. **Sprint Orchestrator** processes stories in order
2. **Tech Writer** creates detailed story files with sub-tasks
3. **Game Dev** pre-plans implementation with schemas and tests
4. **Code Reviewer** (optional) validates planning quality

Begin with: **Story 6-2: Combat Aggression Configuration**
