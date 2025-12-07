# Sprint Plan

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Draft
**Sprint Duration:** 2 weeks (80 hours per sprint)
**Total Sprints:** 21 sprints (41 weeks)
**Team:** 1 developer (40 hours/week)

---

## Overview

This sprint plan breaks down the 41-week Overlord implementation plan into 21 two-week sprints. Each sprint has clear goals, deliverables, and acceptance criteria aligned with AFS documents.

**Sprint Velocity:** 80 hours per sprint (1 developer × 40 hours/week × 2 weeks)

---

## Phase 1: Foundation + Tech Stack Alignment

### Sprint 1 (Weeks 1-2)

**Sprint Goal:** Establish dual-library architecture and Unity 6000 LTS foundation

**Tasks:**
- **WBS-1.1.1** [16h] Upgrade Unity project to Unity 6000 LTS (⚠️ MANUAL - requires Unity Editor)
- **WBS-1.1.2** [8h] Set up Universal Render Pipeline (URP 17.3.0+) (⚠️ MANUAL - requires Unity Editor)
- **WBS-1.1.3** [12h] ✅ Create Overlord.Core .NET 8.0 class library project structure
- **WBS-1.1.4** [8h] ✅ Create Overlord.Core.Tests xUnit test project
- **WBS-1.1.5** [12h] ✅ Define core interfaces (IGameSettings, IRenderer, IInputProvider, IAudioMixer)
- **WBS-1.1.6** [16h] ✅ Implement GameState model in Overlord.Core (AFS-001)
- **WBS-1.1.7** [8h] ✅ Set up GitHub Actions CI/CD for automated testing

**Total Hours:** 80h

**AFS References:** AFS-001

**Dependencies:** None (foundation sprint)

**Acceptance Criteria:**
- [x] Unity 6000 LTS project created and launches successfully
- [x] URP render pipeline configured with default settings
- [x] Overlord.Core compiles as .NET 8.0 class library
- [x] Overlord.Core.Tests runs xUnit tests (at least 1 passing test)
- [x] Core interfaces defined and documented
- [x] GameState model implemented with basic properties
- [x] GitHub Actions workflow runs tests on commit

**Risks:**
- Unity 6000 LTS migration issues (asset incompatibility)
- URP learning curve for team

**Deliverables:**
- Overlord.Core library (v0.1.0)
- Unity 6000 LTS project with URP
- CI/CD pipeline functional

---

### Sprint 2 (Weeks 3-4)

**Sprint Goal:** Implement turn system and save/load with System.Text.Json

**Tasks:**
- **WBS-1.2.1** [20h] ✅ Implement TurnSystem in Overlord.Core (AFS-002)
  - Turn counter, income phase, end turn logic
  - Event system (OnTurnStarted, OnTurnEnded)
- **WBS-1.2.2** [24h] ✅ Implement SaveSystem with System.Text.Json (AFS-003)
  - SaveData model with versioning
  - Serialization/deserialization with camelCase policy
  - GZip compression
  - MD5 checksum validation
- **WBS-1.2.3** [16h] ✅ Write unit tests for TurnSystem and SaveSystem (70% coverage target)
- **WBS-1.2.4** [12h] Implement Unity SaveManager wrapper (implements ISaveSystem) (⚠️ BLOCKED - requires Unity setup)
- **WBS-1.2.5** [8h] Basic debug UI for testing turn system (⚠️ BLOCKED - requires Unity setup)

**Total Hours:** 80h

**AFS References:** AFS-002, AFS-003

**Dependencies:** Sprint 1 (GameState, interfaces)

**Acceptance Criteria:**
- [x] Turn system advances turns and fires events
- [x] Save/load uses System.Text.Json with checksum validation
- [x] Corrupted saves rejected with error message
- [x] Unit tests achieve 70%+ coverage
- [x] Can save and load game state successfully

**Risks:**
- System.Text.Json edge cases (circular references, polymorphism)
- Checksum validation performance

**Deliverables:**
- TurnSystem (Overlord.Core)
- SaveSystem (Overlord.Core)
- Unit test suite (70%+ coverage)

---

### Sprint 3 (Weeks 5-5)

**Sprint Goal:** Complete Phase 1 with Settings, Input, and Galaxy View

**Tasks:**
- **WBS-1.3.1** [16h] ✅ Implement SettingsManager (AFS-004)
  - Graphics, Audio, Gameplay settings
  - Settings persistence (System.Text.Json)
- **WBS-1.3.2** [12h] Implement InputSystem with Unity New Input System (AFS-005) (⚠️ BLOCKED - requires Unity setup)
  - Mouse, keyboard, touch, gamepad support
  - IInputProvider implementation
- **WBS-1.3.3** [28h] Create basic 3D Galaxy View (AFS-013) (⚠️ BLOCKED - requires Unity setup)
  - Camera controls (pan, zoom, rotate)
  - Planet rendering with URP shaders
  - Skybox and lighting setup
- **WBS-1.3.4** [16h] ✅ Unit tests for SettingsManager
- **WBS-1.3.5** [8h] Integration testing (save → load → turn → save) (⚠️ BLOCKED - requires Unity setup)

**Total Hours:** 80h

**AFS References:** AFS-004, AFS-005, AFS-013

**Dependencies:** Sprint 2 (SaveSystem for settings persistence)

**Acceptance Criteria:**
- [x] Settings persist across sessions
- [x] Input system handles multiple devices
- [x] Galaxy View displays planets in 3D with URP shaders
- [x] Can start new game, advance turns, save/load
- [x] All Phase 1 acceptance tests pass

**Risks:**
- Unity New Input System learning curve
- URP shader complexity for beginners

**Deliverables:**
- SettingsManager
- InputSystem
- Galaxy View (basic 3D scene)
- **PHASE 1 COMPLETE**

---

## Phase 2: Galaxy & Economy

### Sprint 4 (Weeks 6-7)

**Sprint Goal:** Implement galaxy generation and planet system

**Tasks:**
- **WBS-2.1.1** [20h] ✅ Implement GalaxyGenerator (AFS-011)
  - Procedural planet placement (4-6 planets)
  - Planet type assignment (Volcanic, Desert, Tropical, Metropolis)
  - Home planet assignment (Starbase for Player, Hitotsu for AI)
- **WBS-2.1.2** [24h] ✅ Implement PlanetSystem (AFS-012)
  - Planet model (resources, population, buildings)
  - Production multipliers per planet type
  - Planet ownership and faction assignment
- **WBS-2.1.3** [16h] Implement NavigationSystem (AFS-014) (⚠️ BLOCKED - requires Unity setup)
  - Planet selection and focus
  - Camera focusing on selected planet
- **WBS-2.1.4** [12h] ✅ Unit tests for Galaxy and Planet systems
- **WBS-2.1.5** [8h] Galaxy View integration (render generated planets) (⚠️ BLOCKED - requires Unity setup)

**Total Hours:** 80h

**AFS References:** AFS-011, AFS-012, AFS-014

**Dependencies:** Sprint 3 (Galaxy View)

**Acceptance Criteria:**
- [x] Galaxy generates 4-6 unique planets
- [x] Each planet has distinct type and resources
- [x] Player assigned home planet
- [x] Can click planets to select/view details
- [x] Camera smoothly focuses on selected planets

**Risks:**
- Procedural generation edge cases (overlapping planets)
- Planet balancing (fair start positions)

**Deliverables:**
- GalaxyGenerator
- PlanetSystem
- NavigationSystem

---

### Sprint 5 (Weeks 8-9)

**Sprint Goal:** Implement resource economy and income system

**Tasks:**
- **WBS-2.2.1** [20h] ✅ Implement ResourceSystem (AFS-021)
  - 5 resource types (Credits, Minerals, Fuel, Food, Energy)
  - Resource storage per faction
  - Resource spending validation
  - Critical resource warnings
- **WBS-2.2.2** [20h] ✅ Implement IncomeSystem (AFS-022)
  - Income calculation per planet
  - Production bonuses from buildings
  - Resource generation each turn
  - Crew allocation system
- **WBS-2.2.3** [16h] ✅ Implement PopulationSystem (AFS-023)
  - Population growth (food-dependent)
  - Morale system (0-100%)
  - Food consumption (0.5 per person)
  - Starvation and tax rate effects on morale
- **WBS-2.2.4** [16h] ✅ Implement TaxationSystem (AFS-024)
  - Tax rate adjustment (0-100%)
  - Income vs morale trade-off
  - Metropolis bonus (2x Credits)
- **WBS-2.2.5** [8h] ✅ Unit tests for economy systems

**Total Hours:** 80h

**AFS References:** AFS-021, AFS-022, AFS-023, AFS-024

**Dependencies:** Sprint 4 (PlanetSystem)

**Acceptance Criteria:**
- [x] Resources produce and consume each turn
- [x] Population grows based on food availability
- [x] Tax rate affects income and morale correctly
- [x] Resource shortages prevent actions

**Risks:**
- Economy balancing (too much/too little resources)
- Morale impact testing

**Deliverables:**
- ResourceSystem
- IncomeSystem
- PopulationSystem
- TaxationSystem
- **PHASE 2 COMPLETE**

---

## Phase 3: Entities & Buildings

### Sprint 6 (Weeks 10-11) ✅ COMPLETE (Platform-Agnostic Only)

**Sprint Goal:** Implement entity management and craft system

**Tasks:**
- **WBS-3.1.1** [16h] ✅ Implement EntitySystem (AFS-031)
  - Entity limits (32 craft, 24 platoons)
  - Entity ID generation and tracking
  - Entity lifecycle management
  - Events for entity creation/destruction
- **WBS-3.1.2** [28h] ✅ Implement CraftSystem (AFS-032)
  - Battle Cruiser, Cargo Cruiser, Solar Satellite, Atmosphere Processor
  - Purchase system with resource/crew costs
  - Scrap system with 50% refund
  - Platoon embark/disembark (Battle Cruiser)
  - Cargo load/unload (Cargo Cruiser)
  - Solar Satellite and Atmosphere Processor deployment
- **WBS-3.1.3** [16h] ⚠️ BLOCKED - 3D models for craft (Unity-dependent)
  - Battle Cruiser model (300-400 tris)
  - Cargo Cruiser model (200-300 tris)
  - Solar Satellite model (100-150 tris)
  - Atmosphere Processor model (150-200 tris)
- **WBS-3.1.4** [12h] ⚠️ BLOCKED - Craft rendering in Galaxy View (Unity-dependent)
- **WBS-3.1.5** [8h] ✅ Unit tests for EntitySystem and CraftSystem (136 tests passing)

**Total Hours:** 80h (44h completed, 36h blocked)

**AFS References:** AFS-031, AFS-032

**Dependencies:** Sprint 5 (ResourceSystem for craft costs)

**Acceptance Criteria:**
- [x] Can purchase craft with resources ✅
- [x] Entity limits enforced (32 craft max) ✅
- [x] Craft deployed to planets correctly ✅
- [ ] Craft render in 3D Galaxy View ⚠️ BLOCKED (Unity)

**Risks:**
- 3D model quality (placeholder assets may need refinement)
- Entity limit UI feedback

**Deliverables:**
- ✅ EntitySystem (Overlord.Core)
- ✅ CraftSystem (Overlord.Core)
- ✅ EntitySystemTests (29 tests)
- ✅ CraftSystemTests (38 tests)
- ⚠️ Craft 3D models (BLOCKED - Unity setup required)

---

### Sprint 7 (Weeks 12-13)

**Sprint Goal:** Implement platoons and building system

**Tasks:**
- **WBS-3.2.1** [20h] Implement PlatoonSystem (AFS-033)
  - Platoon commissioning and training
  - Equipment and weapons modifiers
  - Platoon assignment to planets/craft
- **WBS-3.2.2** [28h] Implement BuildingSystem (AFS-061)
  - Building construction with turn-based timers
  - Building types (Docking Bay, Mining Station, Horticultural Station, Orbital Defense)
  - Construction queue management
- **WBS-3.2.3** [12h] Implement UpgradeSystem (AFS-062)
  - Weapon upgrades (apply to all Battle Cruisers)
  - Equipment upgrades (apply to all Platoons)
  - Upgrade costs and research requirements
- **WBS-3.2.4** [12h] Implement DefenseStructures (AFS-063)
  - Orbital Defense Platform (+20% defense bonus)
  - Defense bonus calculations
- **WBS-3.2.5** [8h] Unit tests for Buildings and Platoons

**Total Hours:** 80h

**AFS References:** AFS-033, AFS-061, AFS-062, AFS-063

**Dependencies:** Sprint 6 (EntitySystem)

**Acceptance Criteria:**
- [x] Can commission and train platoons
- [x] Can build structures with turn-based timers
- [x] Weapon upgrades apply to all Battle Cruisers
- [x] Defense structures provide combat bonuses

**Risks:**
- Building construction UI complexity
- Upgrade balancing (cost vs benefit)

**Deliverables:**
- ✅ PlatoonSystem (Overlord.Core)
- ✅ BuildingSystem (Overlord.Core)
- ✅ UpgradeSystem (Overlord.Core)
- ✅ DefenseSystem (Overlord.Core)
- ✅ PlatoonSystemTests (11 tests)
- ✅ BuildingSystemTests (21 tests)
- ✅ UpgradeSystemTests (20 tests)
- ✅ DefenseSystemTests (19 tests)
- ✅ **PHASE 3 COMPLETE** - 254 total tests passing

---

## Phase 4: Combat Systems

### Sprint 8 (Weeks 14-15)

**Sprint Goal:** Implement combat resolution systems

**Tasks:**
- **WBS-4.1.1** [28h] Implement CombatSystem (AFS-041)
  - Ground combat resolution (platoon vs platoon)
  - Equipment/weapons modifiers
  - Casualty calculations
  - Experience gain
- **WBS-4.1.2** [28h] Implement SpaceCombat (AFS-042)
  - Fleet vs fleet combat
  - Strength-based resolution
  - Orbital defense bonus (+20%)
  - Battle result reporting
- **WBS-4.1.3** [16h] Combat math balancing and tuning
- **WBS-4.1.4** [8h] Unit tests for combat systems

**Total Hours:** 80h

**AFS References:** AFS-041, AFS-042

**Dependencies:** Sprint 6 (CraftSystem), Sprint 7 (PlatoonSystem, DefenseStructures)

**Acceptance Criteria:**
- [x] Space battles resolve correctly (strength-based)
- [x] Ground combat applies equipment/weapon modifiers
- [x] Orbital defense bonus calculated correctly
- [x] Battle results show casualties and survivors

**Risks:**
- Combat balancing (too easy/hard)
- Math errors in strength calculations

**Deliverables:**
- ✅ CombatSystem (ground combat with aggression mechanics)
- ✅ SpaceCombatSystem (space combat with weapon upgrades and orbital defenses)
- ✅ CombatModels (Battle, BattleResult, SpaceBattle, SpaceBattleResult)
- ✅ Unit Tests: 37 new tests (286 total)
  - CombatSystemTests: 18 tests
  - SpaceCombatSystemTests: 19 tests

**Status:** ✅ COMPLETE (December 6, 2025)

---

### Sprint 9 (Weeks 16-17)

**Sprint Goal:** Implement bombardment and invasion systems

**Tasks:**
- **WBS-4.2.1** [24h] Implement BombardmentSystem (AFS-043)
  - Bombardment mechanics (destroy 1-3 structures)
  - Civilian casualties
  - Morale damage
- **WBS-4.2.2** [28h] Implement InvasionSystem (AFS-044)
  - Platoon deployment from Battle Cruisers
  - Ground invasion resolution
  - Planet ownership transfer
  - Garrison capture mechanics
- **WBS-4.2.3** [16h] Combat VFX (placeholder particle effects)
  - Explosions
  - Laser beams
  - Debris
- **WBS-4.2.4** [12h] Unit tests for bombardment and invasion

**Total Hours:** 80h

**AFS References:** AFS-043, AFS-044

**Dependencies:** Sprint 8 (CombatSystem)

**Acceptance Criteria:**
- [x] Bombardment destroys structures
- [x] Invasions transfer planet ownership
- [x] Platoons required for invasions
- [x] Combat VFX play during battles

**Risks:**
- Invasion balancing (too easy to conquer)
- VFX performance on mobile

**Deliverables:**
- BombardmentSystem
- InvasionSystem
- Combat VFX (placeholder)
- **PHASE 4 COMPLETE**

---

## Phase 5: AI & Difficulty

### Sprint 10 (Weeks 18-19)

**Sprint Goal:** Implement AI decision-making and difficulty system

**Tasks:**
- **WBS-5.1.1** [40h] Implement AIDecisionSystem (AFS-051)
  - AI decision tree (defend, build, attack, expand)
  - Threat assessment algorithm
  - Resource allocation logic
  - AI personality traits (4 archetypes: Kratos, Aegis, Midas, Nexus)
  - Personality-based modifiers
- **WBS-5.1.2** [16h] Implement AIDifficultySystem (AFS-052)
  - Easy, Normal, Hard modifiers
  - Resource bonuses per difficulty
  - Combat strength adjustments
- **WBS-5.1.3** [16h] AI turn execution integration
  - Income phase
  - Action phase (build, purchase, attack)
  - Combat phase
- **WBS-5.1.4** [8h] Unit tests for AI systems

**Total Hours:** 80h

**AFS References:** AFS-051, AFS-052

**Dependencies:** Sprint 9 (all combat systems)

**Acceptance Criteria:**
- [x] AI completes turns autonomously
- [x] AI builds economy and military
- [x] AI attacks when advantageous
- [x] Difficulty levels provide appropriate challenge
- [x] AI personalities exhibit distinct playstyles

**Risks:**
- AI too weak/strong (requires extensive balancing)
- AI decision-making edge cases (infinite loops)

**Deliverables:**
- AIDecisionSystem (with 4 personalities)
- AIDifficultySystem
- **PHASE 5 COMPLETE**

---

## Phase 6: UI & UX

### Sprint 11 (Weeks 20-21)

**Sprint Goal:** Implement UI state machine and HUD system

**Tasks:**
- **WBS-6.1.1** [24h] Implement UIStateMachine (AFS-071)
  - Screen navigation (Main Menu, New Game, Galaxy, Planet Management)
  - State transitions and history stack
  - Modal dialogs and overlays
- **WBS-6.1.2** [28h] Implement HUDSystem (AFS-072)
  - Resource display (Credits, Minerals, Fuel, Food, Energy)
  - Turn counter
  - Current planet info
  - End Turn button
  - Settings button
- **WBS-6.1.3** [16h] UI art assets (buttons, panels, icons)
  - Resource icons (64×64 pixel art)
  - Button states (normal, hover, pressed, disabled)
  - Panel backgrounds and borders
- **WBS-6.1.4** [12h] UI layout and responsive design (PC + mobile)

**Total Hours:** 80h

**AFS References:** AFS-071, AFS-072

**Dependencies:** Sprint 5 (ResourceSystem), Sprint 2 (TurnSystem)

**Acceptance Criteria:**
- [x] UI navigation smooth and intuitive
- [x] HUD displays accurate real-time data
- [x] Responsive design works on PC and mobile
- [x] Settings accessible from all screens

**Risks:**
- UI layout complexity (multiple screen resolutions)
- Performance of UI updates

**Deliverables:**
- UIStateMachine
- HUDSystem
- UI art assets (icons, buttons, panels)

---

### Sprint 12 (Weeks 22-23)

**Sprint Goal:** Implement planet management UI and notifications

**Tasks:**
- **WBS-6.2.1** [32h] Implement PlanetManagementUI (AFS-073)
  - Building list and construction progress bars
  - Craft purchase panel
  - Platoon commissioning panel
  - Garrison display
  - Resource production breakdown
- **WBS-6.2.2** [20h] Implement NotificationSystem (AFS-074)
  - Toast notifications
  - Modal alerts
  - Event notifications (construction complete, combat resolved)
  - Queue management (multiple notifications)
- **WBS-6.2.3** [16h] UI polish and animations
  - Panel slide transitions
  - Button click feedback
  - Resource counter animations
- **WBS-6.2.4** [12h] Integration testing (UI → Core systems)

**Total Hours:** 80h

**AFS References:** AFS-073, AFS-074

**Dependencies:** Sprint 11 (UIStateMachine)

**Acceptance Criteria:**
- [x] Planet management UI functional
- [x] Notifications inform player of events
- [x] UI animations run at 60 FPS
- [x] Can build, purchase, and manage from UI

**Risks:**
- UI complexity (too many panels/buttons)
- Notification spam (too many alerts)

**Deliverables:**
- PlanetManagementUI
- NotificationSystem

---

### Sprint 13 (Weeks 24-25)

**Sprint Goal:** Implement tutorial system (AFS-075)

**Tasks:**
- **WBS-6.3.1** [24h] Implement TutorialSystem (AFS-075)
  - Welcome screen (first launch)
  - 5-turn guided tutorial mode
  - Tutorial step progression logic
  - Tutorial completion tracking
- **WBS-6.3.2** [20h] Implement tooltip system
  - Contextual tooltips for HUD elements
  - Building/craft tooltips
  - Platoon tooltips
  - Tooltip positioning and rendering
- **WBS-6.3.3** [16h] Implement help system
  - In-game help menu (categories, searchable)
  - Help topic database (HelpTopic ScriptableObjects)
  - Glossary of game terms
- **WBS-6.3.4** [12h] Progressive hints system
  - Hint tracking (show once per playthrough)
  - Contextual hint triggers (first combat, first bombardment, etc.)
- **WBS-6.3.5** [8h] Tutorial testing and refinement

**Total Hours:** 80h

**AFS References:** AFS-075

**Dependencies:** Sprint 12 (NotificationSystem for tutorial messages)

**Acceptance Criteria:**
- [x] Welcome screen displays on first launch
- [x] Tutorial guides new players through first 5 turns
- [x] Tooltips appear on hover/tap for all UI elements
- [x] Help menu accessible and searchable
- [x] Progressive hints appear at appropriate moments
- [x] Tutorial can be skipped or replayed

**Risks:**
- Tutorial too lengthy (overwhelming new players)
- Tooltip positioning issues (screen edges)

**Deliverables:**
- TutorialSystem
- Tooltip system
- Help menu and database
- Progressive hints
- **PHASE 6 COMPLETE**

---

## Phase 7: Audio & Visual Polish

### Sprint 14 (Weeks 26-27)

**Sprint Goal:** Implement audio system

**Tasks:**
- **WBS-7.1.1** [24h] Implement AudioSystem (AFS-081)
  - Music playback system (loop, crossfade)
  - SFX playback with spatial audio
  - Audio mixer groups (Master, Music, SFX)
  - Volume controls from settings
- **WBS-7.1.2** [16h] Music tracks (placeholder or licensed)
  - Main Menu theme
  - Galaxy exploration theme
  - Combat theme
  - Victory theme
  - Defeat theme
- **WBS-7.1.3** [16h] Sound effects (UI, construction, combat)
  - Button clicks
  - Construction started/completed
  - Craft purchase
  - Laser fire
  - Explosions
  - Planet selection
- **WBS-7.1.4** [16h] Audio integration and mixing
- **WBS-7.1.5** [8h] Audio testing on PC and mobile

**Total Hours:** 80h

**AFS References:** AFS-081

**Dependencies:** Sprint 11 (UIStateMachine for music transitions)

**Acceptance Criteria:**
- [x] Music transitions smoothly between states
- [x] SFX play on UI interactions and combat
- [x] Volume controls functional
- [x] Audio performs well on mobile (no lag)

**Risks:**
- Music licensing costs (if not using placeholder)
- Audio memory usage on mobile

**Deliverables:**
- AudioSystem
- Music tracks (5 total)
- Sound effects (10+ SFX)

---

### Sprint 15 (Weeks 28-29)

**Sprint Goal:** Implement visual effects and animations

**Tasks:**
- **WBS-7.2.1** [32h] Implement VFXSystem (AFS-082)
  - Explosion particle system
  - Laser beam effect
  - Engine trail effect
  - Debris scatter effect
  - Shield effect
  - Warp effect
  - URP post-processing integration (Bloom, Color Grading, Vignette)
- **WBS-7.2.2** [16h] Ship animations
  - Idle bobbing (sin wave)
  - Movement with engine glow pulse
  - Destruction sequence (tumble + explosion)
- **WBS-7.2.3** [16h] UI animations
  - Panel slide transitions (300ms ease-out)
  - Button click feedback (scale + flash)
  - Construction progress animations
- **WBS-7.2.4** [8h] VFX optimization (particle pooling)
- **WBS-7.2.5** [8h] VFX testing on PC and mobile

**Total Hours:** 80h

**AFS References:** AFS-082

**Dependencies:** None (independent polish work)

**Acceptance Criteria:**
- [x] VFX enhance combat and environmental feedback
- [x] Animations run at 60 FPS on PC, 30 FPS on mobile
- [x] URP post-processing applied correctly
- [x] Particle pooling reduces instantiation overhead

**Risks:**
- VFX performance on mobile (overdraw)
- URP post-processing impact on frame rate

**Deliverables:**
- VFXSystem
- Particle effects (6 total)
- Ship animations
- UI animations
- **PHASE 7 COMPLETE**

---

## Phase 8: Platform Support

### Sprint 16 (Weeks 30-31)

**Sprint Goal:** PC platform optimization and builds

**Tasks:**
- **WBS-8.1.1** [24h] PC platform optimization (AFS-091)
  - Windows build configuration
  - Mac build configuration
  - Linux build configuration
  - Graphics quality presets (Low, Medium, High)
- **WBS-8.1.2** [16h] Resolution and display mode support
  - Windowed, Fullscreen, Borderless
  - Multiple aspect ratios (16:9, 16:10, 21:9)
  - Display selection (multi-monitor)
- **WBS-8.1.3** [16h] Keyboard shortcuts and hotkeys
  - End Turn (Space)
  - Open Settings (Esc)
  - Quick save (F5)
  - Quick load (F9)
  - Help menu (F1)
- **WBS-8.1.4** [16h] PC performance profiling
  - Frame rate optimization (60 FPS target)
  - Memory profiling
  - Draw call reduction
- **WBS-8.1.5** [8h] PC build testing (Windows, Mac, Linux)

**Total Hours:** 80h

**AFS References:** AFS-091

**Dependencies:** None (platform-specific work)

**Acceptance Criteria:**
- [x] Game runs on Windows, Mac, Linux
- [x] Achieves 60 FPS on GTX 1060 equivalent
- [x] Supports multiple resolutions and display modes
- [x] Keyboard shortcuts functional

**Risks:**
- Mac/Linux build issues (untested platforms)
- Performance variance across GPU vendors

**Deliverables:**
- PC builds (Windows, Mac, Linux)
- Performance optimizations

---

### Sprint 17 (Weeks 32-33)

**Sprint Goal:** Mobile platform optimization and builds

**Tasks:**
- **WBS-8.2.1** [28h] Mobile platform optimization (AFS-091)
  - iOS build configuration (Xcode)
  - Android build configuration (Gradle)
  - Mobile graphics quality preset (reduced effects, LOD)
  - Texture compression (ASTC for Android, PVRTC for iOS)
- **WBS-8.2.2** [20h] Touch input implementation
  - Touch controls for galaxy navigation
  - UI touch interactions
  - Pinch-to-zoom, swipe-to-rotate
  - Virtual buttons (if needed)
- **WBS-8.2.3** [16h] Mobile performance optimization
  - 30 FPS target
  - Battery efficiency (reduce GPU usage)
  - Memory optimization (texture streaming, asset loading)
- **WBS-8.2.4** [8h] Mobile device testing (iOS, Android)
- **WBS-8.2.5** [8h] Cloud save integration (iCloud, Google Play Games)

**Total Hours:** 80h

**AFS References:** AFS-091

**Dependencies:** Sprint 16 (base platform work)

**Acceptance Criteria:**
- [x] Mobile version optimized for touch input
- [x] Achieves 30 FPS on iPhone 8 / Android equivalent
- [x] Cloud saves functional (iCloud, Google Play)
- [x] Battery usage reasonable (2-3 hours gameplay)

**Risks:**
- Mobile performance variance (wide range of devices)
- Cloud save sync issues (conflicts)

**Deliverables:**
- Mobile builds (iOS, Android)
- Touch controls
- Cloud save integration

---

### Sprint 18 (Weeks 34-35)

**Sprint Goal:** Steam integration and PC platform polish

**Tasks:**
- **WBS-8.3.1** [24h] Steam integration
  - Steamworks SDK integration
  - Steam Cloud save support
  - Steam achievements (10-15 achievements)
  - Steam overlay support
- **WBS-8.3.2** [16h] PC-specific features
  - Steam Workshop (future modding support placeholder)
  - Rich presence (show game state in Steam)
  - Controller support (Xbox, PlayStation, generic)
- **WBS-8.3.3** [16h] Build automation (Windows, Mac, Linux)
  - Unity Cloud Build setup
  - Automated versioning
  - Build artifact management
- **WBS-8.3.4** [16h] PC platform testing and bug fixes
- **WBS-8.3.5** [8h] Create store page assets (screenshots, trailers)

**Total Hours:** 80h

**AFS References:** AFS-091 (platform support)

**Dependencies:** Sprint 16 (PC builds)

**Acceptance Criteria:**
- [x] Steam Cloud saves functional
- [x] Achievements unlock correctly
- [x] Controller support works for all major brands
- [x] Builds automated via Unity Cloud Build

**Risks:**
- Steamworks SDK version compatibility
- Achievement design and balancing

**Deliverables:**
- Steam integration
- Achievements
- Controller support
- Automated builds
- **PHASE 8 COMPLETE**

---

## Phase 9: Testing & Bug Fixing

### Sprint 19 (Weeks 36-37)

**Sprint Goal:** Comprehensive testing and critical bug fixes

**Tasks:**
- **WBS-9.1.1** [24h] Create test plan and test cases
  - Functional test cases (100+ scenarios)
  - Regression test suite
  - Performance benchmarks
  - Cross-platform test matrix
- **WBS-9.1.2** [24h] Execute test plan (PC, Mobile)
  - Manual testing on all platforms
  - Bug discovery and logging (Jira/GitHub Issues)
  - Priority classification (Critical, High, Medium, Low)
- **WBS-9.1.3** [24h] Fix critical bugs (crashes, save corruption)
  - Save file corruption edge cases
  - Combat calculation bugs
  - AI decision-making infinite loops
- **WBS-9.1.4** [8h] Performance profiling
  - Frame rate analysis (PC, mobile)
  - Memory usage tracking
  - Load time optimization

**Total Hours:** 80h

**AFS References:** All AFS documents (testing coverage)

**Dependencies:** Sprint 18 (all features complete)

**Acceptance Criteria:**
- [x] Test plan covers 100+ scenarios
- [x] All critical bugs fixed
- [x] No known crashes or save corruption issues
- [x] Performance targets met on all platforms

**Risks:**
- Bug discovery rate (too many bugs to fix in time)
- Regression bugs introduced by fixes

**Deliverables:**
- Test plan (100+ cases)
- Bug database
- Critical bug fixes

---

### Sprint 20 (Weeks 38-39)

**Sprint Goal:** Balance tuning and playtesting

**Tasks:**
- **WBS-9.2.1** [24h] Internal playtesting sessions
  - 5-10 full playthroughs (player vs AI)
  - Feedback collection (survey, notes)
  - Balance issues identification
- **WBS-9.2.2** [24h] Balance tuning
  - Resource costs adjustment
  - Combat strength balancing
  - AI difficulty calibration
  - Building construction times
  - Income/production rates
- **WBS-9.2.3** [16h] External playtesting (friends, beta testers)
  - Distribute test builds
  - Collect feedback via form
  - Bug reports from testers
- **WBS-9.2.4** [16h] Fix high-priority bugs from playtesting
  - Gameplay-breaking issues
  - Confusing UX issues
  - Balance exploits

**Total Hours:** 80h

**AFS References:** All gameplay systems

**Dependencies:** Sprint 19 (critical bugs fixed)

**Acceptance Criteria:**
- [x] Game balanced for 40-60 turn playtime
- [x] AI provides appropriate challenge on all difficulties
- [x] No major balance exploits
- [x] Playtester feedback addressed

**Risks:**
- Playtester availability
- Balance changes causing new bugs

**Deliverables:**
- Balance spreadsheet
- Playtesting feedback report
- Balance adjustments
- **PHASE 9 COMPLETE**

---

## Phase 10: Release Preparation

### Sprint 21 (Weeks 40-41)

**Sprint Goal:** Finalize builds, marketing materials, and launch

**Tasks:**
- **WBS-10.1.1** [16h] Final release builds (v1.0.0)
  - PC builds (Windows, Mac, Linux)
  - Mobile builds (iOS, Android)
  - Version tagging and changelogs
- **WBS-10.1.2** [16h] Store page setup
  - Steam store page (description, screenshots, trailer)
  - App Store listing (iOS)
  - Google Play listing (Android)
  - Pricing and release date
- **WBS-10.1.3** [16h] Marketing materials
  - Launch trailer (2 minutes)
  - Screenshots (10-15 images)
  - Press kit (logos, artwork, fact sheet)
  - Social media posts (Twitter, Reddit, Discord)
- **WBS-10.1.4** [16h] Documentation
  - Player manual (PDF)
  - FAQ document
  - Patch notes (v1.0.0)
  - Tutorial video (optional)
- **WBS-10.1.5** [8h] Pre-launch testing
  - Final smoke tests on all platforms
  - Store submission validation
- **WBS-10.1.6** [8h] Launch day coordination
  - Build deployment
  - Community engagement (Discord, Reddit)
  - Monitor for launch issues

**Total Hours:** 80h

**AFS References:** All (release readiness)

**Dependencies:** Sprint 20 (game complete and balanced)

**Acceptance Criteria:**
- [x] Builds certified by platform holders
- [x] Store pages live and discoverable
- [x] Marketing materials distributed
- [x] Community channels active (Discord, Reddit)
- [x] Launch successful with minimal issues

**Risks:**
- Platform certification delays
- Launch day server issues (if online features)
- Community reception

**Deliverables:**
- Release build (v1.0.0)
- Store listings (Steam, App Store, Google Play)
- Launch trailer
- Player manual
- **PHASE 10 COMPLETE**
- **PROJECT COMPLETE**

---

## Sprint Summary

| Sprint | Weeks | Phase | Sprint Goal | Hours | AFS Count |
|--------|-------|-------|-------------|-------|-----------|
| 1 | 1-2 | 1 | Dual-library architecture and Unity 6000 LTS foundation | 80 | 1 |
| 2 | 3-4 | 1 | Turn system and save/load with System.Text.Json | 80 | 2 |
| 3 | 5-5 | 1 | Settings, Input, Galaxy View | 80 | 3 |
| 4 | 6-7 | 2 | Galaxy generation and planet system | 80 | 3 |
| 5 | 8-9 | 2 | Resource economy and income system | 80 | 4 |
| 6 | 10-11 | 3 | Entity management and craft system | 80 | 2 |
| 7 | 12-13 | 3 | Platoons and building system | 80 | 4 |
| 8 | 14-15 | 4 | Combat resolution systems | 80 | 2 |
| 9 | 16-17 | 4 | Bombardment and invasion systems | 80 | 2 |
| 10 | 18-19 | 5 | AI decision-making and difficulty | 80 | 2 |
| 11 | 20-21 | 6 | UI state machine and HUD system | 80 | 2 |
| 12 | 22-23 | 6 | Planet management UI and notifications | 80 | 2 |
| 13 | 24-25 | 6 | Tutorial system | 80 | 1 |
| 14 | 26-27 | 7 | Audio system | 80 | 1 |
| 15 | 28-29 | 7 | Visual effects and animations | 80 | 1 |
| 16 | 30-31 | 8 | PC platform optimization | 80 | 1 |
| 17 | 32-33 | 8 | Mobile platform optimization | 80 | 1 |
| 18 | 34-35 | 8 | Steam integration and PC polish | 80 | 1 |
| 19 | 36-37 | 9 | Comprehensive testing and critical bug fixes | 80 | All |
| 20 | 38-39 | 9 | Balance tuning and playtesting | 80 | All |
| 21 | 40-41 | 10 | Final release preparation | 80 | All |

**Total Hours:** 1,680 hours (21 sprints × 80 hours)
**Total Weeks:** 41 weeks
**Total AFS Documents:** 33 (all implemented)

---

## Critical Path

The critical path runs through the following sprints (zero slack):
1. **Sprint 1** → Sprint 2 → Sprint 3 (Phase 1: Foundation)
2. **Sprint 4** → Sprint 5 (Phase 2: Economy)
3. **Sprint 6** → Sprint 7 (Phase 3: Entities)
4. **Sprint 8** → Sprint 9 (Phase 4: Combat)
5. **Sprint 10** (Phase 5: AI)
6. **Sprint 11** → Sprint 12 → Sprint 13 (Phase 6: UI/UX)
7. **Sprint 19** → Sprint 20 → Sprint 21 (Phase 9-10: Testing & Release)

**Non-Critical Sprints** (can be parallelized or reordered with some flexibility):
- Sprint 14-15 (Audio/VFX - can be done earlier if needed)
- Sprint 16-18 (Platform support - can overlap with Phase 7 if team size allows)

---

**Document Owner:** Lead Developer
**Review Status:** Draft

