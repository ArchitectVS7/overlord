---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - 'design-docs/artifacts/prd.md'
  - 'design-docs/artifacts/game-architecture.md'
---

# Overlord - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Overlord, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Campaign Gameplay:**
- FR1: Players can start a new campaign game with configurable difficulty (Easy/Normal/Hard)
- FR2: Players can select AI personality type for their opponent (Aggressive, Defensive, Economic, Balanced)
- FR3: Players can play turn-based campaigns against AI opponents
- FR4: Players can end their turn when ready to proceed
- FR5: Players can view current turn number and game phase (Income/Action/Combat/End)
- FR6: Players can achieve victory by conquering all AI-owned planets
- FR7: Players can experience defeat if all player-owned planets are lost

**Galaxy & Planet Management:**
- FR8: Players can view a generated galaxy with 4-6 planets
- FR9: Players can select planets to view detailed information
- FR10: Players can view planet attributes (type, owner, population, morale, resources)
- FR11: Players can manage planet resources (Credits, Minerals, Fuel, Food, Energy)
- FR12: Players can construct buildings on owned planets
- FR13: Players can view building construction progress and completion status
- FR14: Players can receive automated resource income per turn from owned planets

**Military & Combat:**
- FR15: Players can commission platoons with configurable equipment and weapons
- FR16: Players can view platoon details (troop count, equipment level, weapon level)
- FR17: Players can purchase spacecraft (Scouts, Battle Cruisers, Bombers, Atmosphere Processors)
- FR18: Players can load platoons onto Battle Cruisers for transport
- FR19: Players can navigate craft between planets
- FR20: Players can initiate planetary invasions when controlling orbit
- FR21: Players can configure combat aggression levels (0-100%) before battles
- FR22: Players can view combat results (casualties, victory/defeat, captured resources)
- FR23: AI opponents can make strategic decisions (build economy, train military, launch attacks)
- FR24: AI opponents can adapt behavior based on personality type and difficulty level

**Flash Scenarios:**
- FR25: Players can access a Flash Scenarios menu separate from campaign mode
- FR26: Players can select and start individual Flash Scenarios
- FR27: Players can complete tutorial Flash Scenarios that teach specific game mechanics
- FR28: Players can complete tactical Flash Scenarios as quick-play challenges
- FR29: Players can view Flash Scenario victory conditions before starting
- FR30: Players can view Flash Scenario completion results (success/failure, completion time)
- FR31: System can track Flash Scenario completion history per user

**Scenario Pack System:**
- FR32: Players can browse available scenario packs from the main menu
- FR33: Players can switch between scenario packs (changes AI config, galaxy layout, resources)
- FR34: System can load scenario pack configurations from JSON data files
- FR35: Players can view scenario pack metadata (name, difficulty, AI personality, planet count)

**Persistence & User Management:**
- FR36: Players can create user accounts with email/password authentication
- FR37: Players can log in to access their saved games and profile
- FR38: Players can save campaign progress at any time
- FR39: Players can load previously saved campaigns
- FR40: Players can access saved games from different devices (cross-device sync)
- FR41: System can persist user settings and preferences across sessions
- FR42: System can track user statistics (campaigns completed, Flash Scenarios completed, playtime)

**User Interface & Controls:**
- FR43: Players can interact with the game using mouse and keyboard (desktop)
- FR44: Players can interact with the game using touch gestures (mobile)
- FR45: Players can navigate the galaxy map by panning and zooming
- FR46: Players can use keyboard shortcuts for common actions
- FR47: Players can customize UI scale (100%, 125%, 150%)
- FR48: Players can enable high contrast mode for visual accessibility
- FR49: Players can navigate all game functions using only the keyboard
- FR50: Players can view help overlays for keyboard shortcuts and game mechanics

**Audio & Media:**
- FR51: Players can hear sound effects for game actions (combat, construction, UI interactions)
- FR52: Players can hear background music during gameplay
- FR53: Players can adjust audio volume levels independently (Master, SFX, Music)
- FR54: Players can mute audio entirely
- FR55: System can request user activation before enabling audio (browser security requirement)

### Non-Functional Requirements

**Performance:**
- NFR-P1: Frame Rate - Desktop browsers must sustain 60 FPS; Mobile browsers must sustain 30 FPS
- NFR-P2: Load Time - Initial page load to playable state within 5 seconds; Flash Scenario start within 2 seconds; Campaign load within 3 seconds
- NFR-P3: Response Time - User interactions provide feedback within 100ms; Turn processing within 2 seconds; Combat resolution within 5 seconds
- NFR-P4: Asset Loading - Critical assets in first 10 MB; On-demand assets within 500ms; Mobile uses 50% resolution on <4 GB RAM

**Reliability:**
- NFR-R1: Save/Load Success Rate - Save operations >99.9% success; Load operations >99.9% success; Data corruption <0.01%
- NFR-R2: Crash Rate - Application crashes <0.1% of sessions; Zero critical bugs at launch; Graceful network failure handling
- NFR-R3: Cross-Device Sync - Save data syncs within 5 seconds; Last-write-wins conflict resolution; Offline saves queue for sync
- NFR-R4: Uptime & Availability - Vercel uptime >99.9%; Supabase uptime >99.5%; LocalStorage fallback if Supabase unavailable

**Accessibility:**
- NFR-A1: Keyboard Navigation (WCAG 2.1 Level A) - All functions keyboard-accessible; Logical tab order; Visible focus indicators (3px); Help overlay (H key)
- NFR-A2: Visual Accessibility - UI scale adjustable (100%/125%/150%); High contrast mode (4px borders, white-on-black, yellow highlights); Tap targets minimum 44×44px; Patterns + colors (not color alone)
- NFR-A3: Screen Reader Support (Post-MVP) - ARIA labels; Live regions announce events; Semantic HTML5 landmarks

**Security:**
- NFR-S1: Authentication - Passwords hashed (bcrypt cost 12+); Secure HTTP-only cookies; Password reset with 15-min expiration
- NFR-S2: Data Protection - Save data encrypted at rest; HTTPS/TLS 1.2+ for all communication; Supabase RLS policies enforce user ownership
- NFR-S3: Input Validation - Client-side validation (type checking, range validation); Server-side validation (Supabase Edge Functions); Scenario JSON schema validation
- NFR-S4: Privacy - No PII beyond email/username; Anonymized analytics only; Save games contain no PII

**Usability:**
- NFR-U1: Learnability - Tutorial Flash Scenarios teach mechanics in 5-10 min; "Genesis Device 101" >60% completion rate; Keyboard shortcuts discoverable via H key
- NFR-U2: Efficiency - Experienced users complete Flash Scenarios 20-30% faster; Keyboard shortcuts reduce action time 50%; Turn advancement = single action
- NFR-U3: Error Prevention - Destructive actions require confirmation; Clear error messages (not "Error 500"); Undo for reversible actions (post-MVP)
- NFR-U4: Consistency - UI patterns consistent across screens; Keyboard shortcuts don't conflict with browser; Touch gestures match platform conventions

**Compatibility:**
- NFR-C1: Browser Support - Desktop: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (95%+ coverage); Mobile: iOS Safari 14+, Chrome Mobile 90+ (90%+ coverage); Canvas 2D fallback for older browsers
- NFR-C2: Device Support - Desktop: 1280×720 min, 1920×1080 optimized; Mobile phones: 375×667 min (iPhone 8), landscape recommended; Tablets: 768×1024 min (iPad Mini)
- NFR-C3: Input Methods - Mouse + keyboard fully supported (desktop); Touch gestures fully supported (mobile); Gamepad deferred to post-MVP
- NFR-C4: Network Conditions - Game loads on 3G (3 Mbps); Offline gameplay after initial load; Asset streaming adapts to connection speed

**Scalability:**
- NFR-SC1: Concurrent Users - Supabase free tier: 500 concurrent connections; 100 concurrent save/load requests without degradation; Vercel handles 1,000 simultaneous loads
- NFR-SC2: Data Growth - 500 MB database storage (10,000+ save games); Save game <50 KB compressed; User profile <5 KB
- NFR-SC3: Future Growth (Post-MVP) - Scalable to Supabase Pro (50,000 concurrent users); Platform-agnostic core supports multiple engines; Scenario pack system scales to 100+ packs

### Additional Requirements

**Architecture & Infrastructure:**
- Platform-agnostic core architecture: `src/core/` must have zero Phaser dependencies (enables future engine swaps)
- Event-driven communication: Core systems fire callbacks, Phaser scenes subscribe (uni-directional: Core → Phaser)
- Service layer abstraction: Supabase SDK wrapped by `services/` layer, Core never imports Supabase directly
- TypeScript strict mode: All strict checks enabled (`strict`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`)
- Code coverage minimum: 70% coverage threshold enforced by CI/CD (currently 93.78%)
- Test-driven development: 304 existing tests maintained, new features require tests before merge

**Technology Stack Versions:**
- Phaser 3.85.2 (recommend upgrade to 3.90.0 latest stable)
- TypeScript 5.x with strict mode
- Webpack 5 with hot module replacement (HMR)
- Jest (test runner with TypeScript support)
- Supabase SDK 2.86.2 (latest stable as of Dec 2025)
- Vercel Edge Network deployment
- ESLint + Prettier (code quality and formatting)

**Deployment & Hosting:**
- Vercel automatic deploys on push to `main` branch
- Preview deployments per pull request (shareable URLs)
- CI/CD quality gates: All tests pass, coverage ≥70%, TypeScript compilation succeeds, ESLint errors block (warnings allowed)
- Zero-downtime deploys with Vercel Edge rollback capability
- Content Security Policy (CSP) headers to prevent XSS
- Environment variables for Supabase credentials (never committed to repo)

**Asset Loading Strategy:**
- **Priority 1 (Initial <10 MB):** UI framework, galaxy map background, placeholder sprites, core sound effects
- **Priority 2 (On-Demand):** Planet textures (load on selection), craft sprites (load on first build), combat animations, background music (stream)
- **Priority 3 (Cached):** Asset pools for frequent sprites, color tinting for factions, texture atlases
- Mobile optimization: Detect `navigator.deviceMemory`, load 50% resolution on <4 GB RAM, disable particle effects on low FPS (<25), WebP compression (PNG fallback for Safari)

**Flash Scenarios JSON Schema:**
- Scenario definitions stored in `public/assets/data/scenarios/{scenario_id}.json`
- Schema includes: `scenario_id`, `name`, `type` (tutorial/tactical), `difficulty`, `duration_estimate_minutes`, `initial_state`, `victory_conditions`, `tutorial_steps`
- ScenarioService validates JSON against schema before loading
- Extensible: New scenarios added without code changes (data-driven)

**Scenario Pack JSON Schema:**
- Pack definitions stored in `public/assets/data/packs/{pack_id}.json`
- Schema includes: `pack_id`, `name`, `version`, `difficulty`, `faction` (name, leader, lore, color_theme), `ai_config` (personality, difficulty, modifiers), `galaxy_template` (planet_count, types, resource_abundance, spatial_layout)
- Hot-swappable at runtime (no code changes for new packs)

**Database Schema (Supabase PostgreSQL):**
- `saves` table: id (UUID PK), user_id (FK), data (BYTEA compressed), checksum (SHA256), campaign_name, turn_number, created_at, updated_at
- `user_profiles` table: user_id (UUID PK FK), username (unique), created_at, ui_scale, high_contrast_mode, audio_enabled, music_volume, sfx_volume
- `scenario_completions` table: id (UUID PK), user_id (FK), scenario_id, completed (boolean), completion_time_seconds, completed_at, attempts, best_time_seconds
- Row Level Security (RLS) policies: Users can only access their own saves, profiles, and scenario completions

**Implementation Patterns (from Architecture):**
- Naming: PascalCase (classes), camelCase (vars/functions), SCREAMING_SNAKE_CASE (constants), kebab-case (JSON files, scene keys)
- Error handling: GameError class with codes (COMBAT_*, SAVE_*, AUTH_*, SCENARIO_*, RESOURCE_*), user-friendly messages, technical details logged
- Logging: LogLevel enum (DEBUG, INFO, WARN, ERROR), structured logging with categories (Core, Phaser, Supabase, Performance)
- Date/time: ISO 8601 strings for persistence, Date objects for computation, UTC always (never local timezones)
- Supabase patterns: Always check `error` before `data`, throw GameError with user message, return `null` for "not found"

**Development Environment:**
- Node.js 20+ LTS (22.x recommended), npm 10+ or pnpm 9+, Git 2.40+
- VS Code recommended with: ESLint, Prettier, TypeScript Language Features, Phaser Editor (optional)
- Development workflow: `npm start` (hot reload), `npm run test:watch` (TDD), `npm run build` (production)
- Pre-commit hooks: ESLint + Prettier run on commit

**Architecture Decision Records (from Architecture doc):**
- ADR-001: Migrate from Unity to Phaser 3 (AI-assisted development compatibility)
- ADR-002: Use Supabase for Backend (PostgreSQL, auth, RLS, generous free tier)
- ADR-003: TypeScript Path Aliases (`@core/*`, `@scenes/*`, `@services/*`)
- ADR-004: Platform-Agnostic Core Architecture (zero Phaser dependencies in `src/core/`)
- ADR-005: Flash Scenarios as Dual-Purpose System (tutorials + quick-play unified)

### FR Coverage Map

**FR1** → Epic 2: Campaign Setup & Core Loop (configurable difficulty)
**FR2** → Epic 2: Campaign Setup & Core Loop (AI personality selection)
**FR3** → Epic 2: Campaign Setup & Core Loop (turn-based gameplay)
**FR4** → Epic 2: Campaign Setup & Core Loop (end turn action)
**FR5** → Epic 2: Campaign Setup & Core Loop (turn number/phase display)
**FR6** → Epic 2: Campaign Setup & Core Loop (victory condition)
**FR7** → Epic 2: Campaign Setup & Core Loop (defeat condition)
**FR8** → Epic 3: Galaxy Exploration & Planet Discovery (view galaxy)
**FR9** → Epic 3: Galaxy Exploration & Planet Discovery (select planets)
**FR10** → Epic 3: Galaxy Exploration & Planet Discovery (view planet attributes)
**FR11** → Epic 4: Planetary Economy & Infrastructure (manage resources)
**FR12** → Epic 4: Planetary Economy & Infrastructure (construct buildings)
**FR13** → Epic 4: Planetary Economy & Infrastructure (view construction progress)
**FR14** → Epic 4: Planetary Economy & Infrastructure (automated income)
**FR15** → Epic 5: Military Forces & Movement (commission platoons)
**FR16** → Epic 5: Military Forces & Movement (view platoon details)
**FR17** → Epic 5: Military Forces & Movement (purchase spacecraft)
**FR18** → Epic 5: Military Forces & Movement (load platoons onto cruisers)
**FR19** → Epic 5: Military Forces & Movement (navigate craft between planets)
**FR20** → Epic 6: Combat & Planetary Invasion (initiate invasions)
**FR21** → Epic 6: Combat & Planetary Invasion (configure combat aggression)
**FR22** → Epic 6: Combat & Planetary Invasion (view combat results)
**FR23** → Epic 7: AI Opponent System (AI strategic decisions)
**FR24** → Epic 7: AI Opponent System (AI personality/difficulty adaptation)
**FR25** → Epic 1: Player Onboarding & Tutorials (Flash Scenarios menu)
**FR26** → Epic 1: Player Onboarding & Tutorials (select scenarios)
**FR27** → Epic 1: Player Onboarding & Tutorials (tutorial Flash Scenarios)
**FR28** → Epic 8: Quick-Play Tactical Scenarios (tactical Flash Scenarios)
**FR29** → Epic 1: Player Onboarding & Tutorials (view victory conditions)
**FR30** → Epic 1: Player Onboarding & Tutorials (view completion results)
**FR31** → Epic 1: Player Onboarding & Tutorials (track completion history)
**FR32** → Epic 9: Scenario Pack System (browse scenario packs)
**FR33** → Epic 9: Scenario Pack System (switch between packs)
**FR34** → Epic 9: Scenario Pack System (load pack JSON configs)
**FR35** → Epic 9: Scenario Pack System (view pack metadata)
**FR36** → Epic 10: User Accounts & Cross-Device Persistence (create account)
**FR37** → Epic 10: User Accounts & Cross-Device Persistence (login)
**FR38** → Epic 10: User Accounts & Cross-Device Persistence (save campaign)
**FR39** → Epic 10: User Accounts & Cross-Device Persistence (load campaign)
**FR40** → Epic 10: User Accounts & Cross-Device Persistence (cross-device sync)
**FR41** → Epic 10: User Accounts & Cross-Device Persistence (settings persistence)
**FR42** → Epic 10: User Accounts & Cross-Device Persistence (user statistics)
**FR43** → Epic 11: Accessible User Interface (mouse and keyboard)
**FR44** → Epic 11: Accessible User Interface (touch gestures)
**FR45** → Epic 11: Accessible User Interface (galaxy navigation)
**FR46** → Epic 11: Accessible User Interface (keyboard shortcuts)
**FR47** → Epic 11: Accessible User Interface (UI scale customization)
**FR48** → Epic 11: Accessible User Interface (high contrast mode)
**FR49** → Epic 11: Accessible User Interface (keyboard-only navigation)
**FR50** → Epic 11: Accessible User Interface (help overlays)
**FR51** → Epic 12: Audio & Atmospheric Immersion (sound effects)
**FR52** → Epic 12: Audio & Atmospheric Immersion (background music)
**FR53** → Epic 12: Audio & Atmospheric Immersion (volume controls)
**FR54** → Epic 12: Audio & Atmospheric Immersion (mute functionality)
**FR55** → Epic 12: Audio & Atmospheric Immersion (user activation for audio)

## Epic List

### Epic 1: Player Onboarding & Tutorials

**User Outcome:** New players learn game mechanics through interactive Flash Scenario tutorials before starting their first campaign.

**FRs Covered:** FR25, FR26, FR27, FR29, FR30, FR31

**Implementation Notes:** Complete Flash Scenario system infrastructure (menu, selection, victory conditions, completion tracking). Initially used for tutorials to onboard new players (Sam's journey). This system provides the foundation for Epic 8 (Quick-Play Tactical Scenarios).

---

### Epic 2: Campaign Setup & Core Loop

**User Outcome:** Players start campaigns with configurable difficulty and AI opponents, manage turn phases, and achieve victory or defeat.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7

**Implementation Notes:** Standalone campaign management - turn system, game phases (Income/Action/Combat/End), win/loss conditions. Foundation for all gameplay. This epic enables the core game loop that all other epics extend.

---

### Epic 3: Galaxy Exploration & Planet Discovery

**User Outcome:** Players explore procedurally generated galaxies, select planets, and view detailed planetary information.

**FRs Covered:** FR8, FR9, FR10

**Implementation Notes:** Galaxy generation (4-6 planets), planet selection UI, attribute display (type, owner, population, morale). Visual foundation for strategy gameplay. Requires Epic 2 (campaign context) to provide meaningful exploration.

---

### Epic 4: Planetary Economy & Infrastructure

**User Outcome:** Players manage five resources (Credits, Minerals, Fuel, Food, Energy), receive automated income, and construct planetary buildings.

**FRs Covered:** FR11, FR12, FR13, FR14

**Implementation Notes:** Complete economy system - resource display, per-turn income calculation, building construction queue, progress tracking. Enables economic strategy paths (Alex's approach). Requires Epic 2 (turn system for income) and Epic 3 (planets to manage).

---

### Epic 5: Military Forces & Movement

**User Outcome:** Players commission platoons with configurable equipment/weapons, purchase spacecraft (Scouts, Battle Cruisers, Bombers, Atmosphere Processors), load troops, and navigate between planets.

**FRs Covered:** FR15, FR16, FR17, FR18, FR19

**Implementation Notes:** Complete military production and logistics - platoon creation, spacecraft purchase, cargo bay management, navigation system. Requires Epic 4 (resource costs for production) and Epic 3 (planet destinations for navigation).

---

### Epic 6: Combat & Planetary Invasion

**User Outcome:** Players invade enemy planets, configure combat aggression levels, and view detailed battle results including casualties and captured resources.

**FRs Covered:** FR20, FR21, FR22

**Implementation Notes:** Complete combat mechanics - invasion initiation (requires orbital control), aggression slider (0-100%), combat resolution with results screen. Requires Epic 5 (military units to conduct battles) and Epic 3 (planets to invade).

---

### Epic 7: AI Opponent System

**User Outcome:** Players face intelligent AI opponents that make strategic decisions based on configurable personality types (Aggressive, Defensive, Economic, Balanced) and difficulty levels.

**FRs Covered:** FR23, FR24

**Implementation Notes:** Complete AI decision-making - priority tree (Defense → Military → Economy → Attack), personality modifiers, difficulty scaling. Requires Epic 2-6 systems to make strategic decisions. Enables meaningful single-player experience. Note: FR2 (AI personality selection) is covered in Epic 2 during campaign setup.

---

### Epic 8: Quick-Play Tactical Scenarios

**User Outcome:** Players enjoy fast-paced tactical challenges through Flash Scenarios as replayable content after completing basic campaigns.

**FRs Covered:** FR28

**Implementation Notes:** Tactical scenario configurations extending Epic 1's Flash Scenario infrastructure. Unlocked after campaign introduction to provide quick-play content (Jordan's commute gaming). Uses same menu/selection/tracking system from Epic 1 but with tactical challenges instead of tutorials.

---

### Epic 9: Scenario Pack System

**User Outcome:** Players experience faction variety by browsing and switching scenario packs that change AI configurations, galaxy layouts, and resource abundance.

**FRs Covered:** FR32, FR33, FR34, FR35

**Implementation Notes:** JSON-based hot-swappable content - pack browser UI, pack switching (alters AI config, galaxy template, faction metadata), schema validation for JSON data. Extends replayability by providing different enemy factions and galaxy configurations. Configures systems from Epic 2-7.

---

### Epic 10: User Accounts & Cross-Device Persistence

**User Outcome:** Players create accounts with email/password, save campaign progress at any time, load previous games, and sync across devices (desktop/mobile).

**FRs Covered:** FR36, FR37, FR38, FR39, FR40, FR41, FR42

**Implementation Notes:** Complete authentication and save system - Supabase email/password auth, save/load with GZip compression + SHA256 checksums, cross-device sync (<5s), settings persistence (UI scale, audio preferences), user statistics tracking. Critical for Jordan's multi-device experience. Enables players to preserve progress across sessions.

---

### Epic 11: Accessible User Interface

**User Outcome:** Players interact through mouse/keyboard/touch with accessible UI featuring customizable scaling, high contrast mode, keyboard-only navigation, and help overlays.

**FRs Covered:** FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50

**Implementation Notes:** Complete UI/UX system - input abstraction layer (mouse/keyboard/touch), galaxy map pan/zoom controls, keyboard shortcuts system, UI scale options (100%/125%/150%), WCAG 2.1 Level A compliance (high contrast mode, focus indicators, tab order), help overlay system (H key). Essential for Sam's accessibility needs and supports all player types across desktop/mobile platforms.

---

### Epic 12: Audio & Atmospheric Immersion

**User Outcome:** Players experience immersive audio with sound effects for actions, background music, independent volume controls, and browser-compliant audio activation.

**FRs Covered:** FR51, FR52, FR53, FR54, FR55

**Implementation Notes:** Complete audio system - SFX library for game actions (combat sounds, construction alerts, UI clicks), background music tracks, independent volume sliders (Master/SFX/Music), mute toggle, user activation prompt (required by browser security policies for auto-play). Enhances player immersion and provides audio feedback for all game actions.

---

## Epic 1: Player Onboarding & Tutorials

**Epic Goal:** New players learn game mechanics through interactive Flash Scenario tutorials before starting their first campaign.

**FRs Covered:** FR25, FR26, FR27, FR29, FR30, FR31

### Story 1.1: Flash Scenarios Menu Access

As a new player,
I want to access a Flash Scenarios menu from the main menu,
So that I can choose to learn game mechanics through tutorials before starting a campaign.

**Acceptance Criteria:**

**Given** the game has loaded and I am viewing the main menu
**When** I click the "Flash Scenarios" menu option
**Then** the Flash Scenarios scene is loaded within 2 seconds (NFR-P2)
**And** the main menu is hidden/replaced with the Flash Scenarios interface
**And** I can return to the main menu via a "Back" button

**Given** I have not yet completed any Flash Scenarios
**When** I access the Flash Scenarios menu for the first time
**Then** I see tutorial scenarios prominently displayed
**And** I see a "Recommended for Beginners" indicator on the first tutorial scenario

### Story 1.2: Scenario Selection Interface

As a new player,
I want to browse available Flash Scenarios and view their details,
So that I can choose an appropriate tutorial scenario to start learning.

**Acceptance Criteria:**

**Given** I am viewing the Flash Scenarios menu
**When** the scenario list loads
**Then** I see all available scenarios displayed in a scrollable list or grid
**And** each scenario shows: name, type (tutorial/tactical), difficulty badge, estimated duration
**And** scenarios are sorted with tutorial scenarios first, ordered by recommended learning sequence

**Given** I am viewing a scenario in the list
**When** I click on a scenario to view details
**Then** I see an expanded detail panel showing: full description, victory conditions summary, prerequisites (if any), best completion time (if completed), completion status badge
**And** I see a "Start Scenario" button if prerequisites are met
**And** I see a "Prerequisites Not Met" message if prerequisites are not fulfilled

**Given** I am viewing scenario details
**When** I click "Start Scenario"
**Then** the scenario initializes and loads within 2 seconds (NFR-P2)
**And** I am transitioned to the scenario gameplay scene

### Story 1.3: Scenario Initialization and Victory Conditions

As a new player,
I want to view victory conditions before starting a scenario and have the game initialize to the scenario's defined state,
So that I understand my objectives and start with the correct game configuration.

**Acceptance Criteria:**

**Given** I have selected a Flash Scenario to start
**When** the scenario loads
**Then** the game state is initialized according to the scenario JSON configuration (`initial_state` section)
**And** the galaxy is generated/configured per scenario specifications
**And** player resources match scenario initial values
**And** player-owned entities (planets, craft, platoons) are created as specified
**And** AI opponent state is initialized per scenario configuration

**Given** the scenario has initialized
**When** the scenario gameplay scene is displayed
**Then** I see a victory conditions overlay or panel showing: primary victory condition, optional secondary objectives (if any), estimated completion time
**And** I can dismiss the overlay to start gameplay
**And** I can reopen the victory conditions panel via a "Objectives" button (O key shortcut)

**Given** the scenario JSON is malformed or missing required fields
**When** the scenario attempts to load
**Then** I see a clear error message: "Unable to load scenario. Please try another scenario."
**And** I am returned to the Flash Scenarios menu
**And** the error details are logged for debugging (NFR-S3 validation requirement)

### Story 1.4: Tutorial Step Guidance System

As a new player completing a tutorial scenario,
I want step-by-step guidance with highlighted UI elements and instructional text,
So that I learn specific game mechanics in a structured way.

**Acceptance Criteria:**

**Given** I am playing a tutorial-type Flash Scenario (type: "tutorial" in JSON)
**When** the scenario starts
**Then** I see the first tutorial step displayed in a guidance panel
**And** the tutorial step shows: step number/total (e.g., "Step 1 of 5"), instructional text, highlighted UI element (if applicable)

**Given** I am viewing a tutorial step that requires a specific action
**When** the relevant UI element is displayed
**Then** that element is highlighted with a visual indicator (glowing border, arrow pointer, or spotlight effect)
**And** other non-essential UI elements are dimmed or disabled
**And** I cannot proceed until the required action is completed

**Given** I have completed the required action for the current tutorial step
**When** the game detects completion (e.g., clicked button, purchased item, ended turn)
**Then** the current step is marked complete
**And** the next tutorial step is automatically displayed after a 1-second delay
**And** I see a brief "Step Complete!" success indicator

**Given** I am on the final tutorial step
**When** I complete the final required action
**Then** the tutorial guidance system closes
**And** I continue playing the scenario until victory conditions are met (standard scenario flow)

**Given** a tutorial scenario does not have `tutorial_steps` in its JSON configuration
**When** the scenario loads
**Then** the tutorial guidance system does not activate
**And** the scenario plays as a standard Flash Scenario without step-by-step guidance

### Story 1.5: Scenario Completion and Results Display

As a player,
I want to see completion results when I achieve scenario victory conditions,
So that I know I've succeeded and can see my performance metrics.

**Acceptance Criteria:**

**Given** I am playing a Flash Scenario
**When** I meet the scenario's victory conditions (defined in scenario JSON)
**Then** the game detects victory within 1 second
**And** a "Scenario Complete!" results screen is displayed
**And** gameplay is paused (no further actions can be taken)

**Given** the scenario completion results screen is displayed
**When** I view the results
**Then** I see: completion status ("Victory!"), total completion time (MM:SS format), victory condition that was met, optional: star rating (1-3 stars based on time/efficiency)
**And** I see a "Continue" button to proceed
**And** I see my best time for this scenario (if previously completed)

**Given** I am playing a Flash Scenario
**When** I meet the scenario's defeat conditions (if defined, e.g., all planets lost)
**Then** a "Scenario Failed" results screen is displayed
**And** I see: failure status ("Defeat"), time played before failure, reason for defeat
**And** I see "Retry" and "Exit to Menu" buttons

**Given** I click "Continue" on the victory results screen
**When** the button is clicked
**Then** the scenario completion is recorded (triggers Story 1.6)
**And** I am returned to the Flash Scenarios menu
**And** the completed scenario shows a "Completed" badge in the scenario list

### Story 1.6: Scenario Completion History Tracking

As a player,
I want the system to track my Flash Scenario completion history across sessions and devices,
So that my progress is saved and I can see my best times and completion status.

**Acceptance Criteria:**

**Given** I have completed a Flash Scenario (reached victory conditions)
**When** I click "Continue" on the results screen
**Then** a completion record is saved to Supabase `scenario_completions` table with: user_id (current user), scenario_id, completed=true, completion_time_seconds, completed_at (UTC timestamp), attempts (incremented), best_time_seconds (updated if new record)
**And** the save operation succeeds >99.9% of the time (NFR-R1)

**Given** I am playing a scenario I have previously attempted but not completed
**When** the completion record is saved
**Then** the `attempts` counter is incremented
**And** the `completed` status changes from false to true
**And** `best_time_seconds` is set to the current completion time (first completion)

**Given** I am playing a scenario I have previously completed
**When** I complete it again with a faster time
**Then** `best_time_seconds` is updated to the new faster time
**And** `attempts` counter is incremented
**And** a new `completed_at` timestamp is recorded

**Given** I complete a scenario while offline (no Supabase connection)
**When** the save operation is attempted
**Then** the completion record is queued in LocalStorage for later sync
**And** I see a "Progress saved locally - will sync when online" notification
**And** the scenario shows as completed in the local session

**Given** I have queued completion records in LocalStorage
**When** my device reconnects to Supabase
**Then** all queued records are synced within 5 seconds (NFR-R3)
**And** I see a "Progress synced" notification
**And** synced records are removed from LocalStorage queue

**Given** I load the Flash Scenarios menu on a different device
**When** I am logged in with my account
**Then** my scenario completion history is loaded from Supabase
**And** all previously completed scenarios show "Completed" badges
**And** my best times are displayed for each completed scenario

---

## Epic 2: Campaign Setup & Core Loop

**Epic Goal:** Players start campaigns with configurable difficulty and AI opponents, manage turn phases, and achieve victory or defeat.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7

### Story 2.1: Campaign Creation and Configuration

As a player,
I want to create a new campaign with configurable difficulty and AI personality,
So that I can tailor the challenge and opponent behavior to my preferred playstyle.

**Acceptance Criteria:**

**Given** I am viewing the main menu
**When** I click "New Campaign"
**Then** I see a campaign configuration screen
**And** I see difficulty options: Easy, Normal, Hard (radio buttons or dropdown)
**And** I see AI personality options: Aggressive, Defensive, Economic, Balanced (radio buttons or dropdown)
**And** I see a "Start Campaign" button

**Given** I am on the campaign configuration screen
**When** I select "Easy" difficulty
**Then** the Easy option is visually highlighted as selected
**And** I see a tooltip or description: "Reduced AI aggression, slower enemy expansion, good for learning"

**Given** I am on the campaign configuration screen
**When** I select "Hard" difficulty
**Then** the Hard option is visually highlighted as selected
**And** I see a tooltip or description: "Maximum AI aggression, faster expansion, expert challenge"

**Given** I am on the campaign configuration screen
**When** I select "Aggressive" AI personality
**Then** the Aggressive option is visually highlighted
**And** I see a description: "Prioritizes military production and early attacks"

**Given** I have selected difficulty and AI personality
**When** I click "Start Campaign"
**Then** a new campaign is initialized within 3 seconds (NFR-P2)
**And** the galaxy is generated with 4-6 planets
**And** the campaign gameplay scene loads
**And** I start on turn 1 in the Income phase
**And** the selected difficulty and AI personality are stored in the campaign state

**Given** I have not selected a difficulty or AI personality
**When** I click "Start Campaign"
**Then** default values are used (Normal difficulty, Balanced AI personality)
**And** the campaign starts successfully

### Story 2.2: Turn System and Phase Management

As a player,
I want to view the current turn number and game phase, and end my turn when ready,
So that I can manage my actions and progress through the campaign at my own pace.

**Acceptance Criteria:**

**Given** I am playing a campaign
**When** the campaign gameplay scene is displayed
**Then** I see a HUD element showing: current turn number (e.g., "Turn 5"), current game phase (Income/Action/Combat/End)
**And** the HUD is always visible in a consistent screen position (top-left or top-center recommended)

**Given** I am in the Action phase
**When** I view the HUD
**Then** I see an "End Turn" button
**And** the button is clearly labeled and accessible via keyboard shortcut (Space or Enter key)

**Given** I am in the Action phase
**When** I click "End Turn" or press the keyboard shortcut
**Then** the turn advances to the Combat phase immediately
**And** the phase indicator updates to show "Combat"
**And** I see a brief phase transition notification (e.g., "Combat Phase" overlay for 1 second)

**Given** I am in the Income phase
**When** the phase loads
**Then** income is automatically calculated and applied (no user action required)
**And** the phase automatically advances to Action phase after income processing
**And** I see a notification: "Income collected: +[amount] Credits, +[amount] resources..."

**Given** I am in the Combat phase
**When** the phase loads
**Then** all pending combats are automatically resolved (if any exist)
**And** the phase automatically advances to End phase after combat resolution
**And** I see combat result notifications for any battles that occurred

**Given** I am in the End phase
**When** the phase loads
**Then** end-of-turn cleanup occurs (building construction progress, etc.)
**And** the turn number increments by 1
**And** the phase automatically advances to Income phase of the new turn
**And** I see a "Turn [N] Complete" notification

**Given** I am in any phase
**When** the phase changes
**Then** the phase transition completes within 100ms (NFR-P3)
**And** UI feedback is immediate and responsive

### Story 2.3: Turn Phase Processing

As a player,
I want the game to process each turn phase efficiently and provide clear feedback,
So that turn advancement feels smooth and I understand what's happening during automated phases.

**Acceptance Criteria:**

**Given** the turn advances to the Income phase
**When** the Income phase processing executes
**Then** all player-owned planets generate resources per their income rates
**And** all AI-owned planets generate resources for the AI
**And** resource totals are updated in the player's HUD
**And** the processing completes within 2 seconds (NFR-P3)
**And** a summary notification displays total income gained

**Given** the turn advances to the Action phase
**When** the Action phase begins
**Then** the player can perform actions (build, purchase units, navigate craft, etc.)
**And** the AI does not take actions yet (AI acts in Combat phase)
**And** the "End Turn" button becomes enabled
**And** I receive a notification: "Your Turn - Action Phase"

**Given** the turn advances to the Combat phase
**When** the Combat phase processing executes
**Then** the AI opponent makes strategic decisions (build economy, train military, launch attacks per Epic 7 AI system)
**And** any pending space or ground combats are resolved
**And** combat results are calculated and displayed
**And** the processing completes within 2 seconds (NFR-P3)
**And** I see notifications for any AI actions or combat outcomes

**Given** the turn advances to the End phase
**When** the End phase processing executes
**Then** building construction progress increments for all in-progress buildings
**And** any buildings that complete construction become active
**And** population growth/morale updates occur for all planets
**And** the processing completes within 2 seconds (NFR-P3)
**And** I see notifications for completed buildings or significant events

**Given** any turn phase is processing
**When** an error occurs during processing (e.g., data corruption, invalid state)
**Then** a clear error message is displayed: "Turn processing error. Your game has been auto-saved."
**And** the game state is saved to prevent progress loss
**And** the error details are logged with structured logging (LogLevel.ERROR, category: Core)
**And** gameplay pauses and I can choose "Retry" or "Exit to Menu"

### Story 2.4: Victory Condition Detection

As a player,
I want to achieve victory when I conquer all AI-owned planets,
So that I experience a satisfying campaign conclusion with recognition of my success.

**Acceptance Criteria:**

**Given** I am playing a campaign with AI-owned planets
**When** the turn processing executes after I capture the last AI-owned planet
**Then** the game detects victory within 1 second
**And** the victory condition is checked during the End phase
**And** gameplay pauses immediately upon victory detection

**Given** victory has been detected
**When** the victory screen displays
**Then** I see a "Victory!" message with celebratory visual/audio effects
**And** I see campaign statistics: total turns taken, planets conquered, final resource totals, military units built, casualties inflicted/sustained
**And** I see a "Continue" button to return to main menu
**And** I see a "Save Campaign" button to preserve the final state

**Given** I am viewing the victory screen
**When** I click "Save Campaign"
**Then** the campaign is saved to Supabase with victory status marked
**And** I see a "Campaign saved successfully" notification
**And** the save operation succeeds >99.9% of the time (NFR-R1)

**Given** I am viewing the victory screen
**When** I click "Continue"
**Then** I am returned to the main menu
**And** the victory screen is closed
**And** I can start a new campaign or access other game modes

**Given** I achieve victory while offline
**When** the save operation is attempted
**Then** the victory save is queued in LocalStorage for later sync
**And** I see a "Victory recorded locally - will sync when online" notification

### Story 2.5: Defeat Condition Detection

As a player,
I want to experience defeat when I lose all my planets,
So that I understand campaign failure conditions and can learn from my mistakes.

**Acceptance Criteria:**

**Given** I am playing a campaign with player-owned planets
**When** the turn processing executes after I lose my last player-owned planet
**Then** the game detects defeat within 1 second
**And** the defeat condition is checked during the End phase
**And** gameplay pauses immediately upon defeat detection

**Given** defeat has been detected
**When** the defeat screen displays
**Then** I see a "Defeat" message
**And** I see campaign statistics: total turns survived, planets lost, resources depleted, cause of defeat (e.g., "All planets conquered by AI")
**And** I see a "Retry Campaign" button to start a new campaign with the same settings
**And** I see a "Exit to Menu" button

**Given** I am viewing the defeat screen
**When** I click "Retry Campaign"
**Then** a new campaign is started with the same difficulty and AI personality settings
**And** the previous failed campaign state is discarded
**And** I am transitioned to the new campaign's turn 1

**Given** I am viewing the defeat screen
**When** I click "Exit to Menu"
**Then** I am returned to the main menu
**And** the defeat screen is closed
**And** the failed campaign state is not saved (unless explicitly saved before defeat)

**Given** I lose my last planet during the Combat phase
**When** the planet ownership changes to AI
**Then** the defeat condition is detected immediately after the combat resolves
**And** the defeat screen displays after a 2-second delay to show the final combat result
**And** I can see the combat result notification before the defeat screen appears

**Given** I am playing a campaign
**When** I have exactly 1 planet remaining
**Then** I see a warning notification: "Warning: Only 1 planet remaining! Losing it will result in defeat."
**And** the notification appears at the start of the Action phase
**And** the warning can be dismissed but reappears each turn until I gain another planet

---

## Epic 3: Galaxy Exploration & Planet Discovery

**Epic Goal:** Players explore procedurally generated galaxies, select planets, and view detailed planetary information.

**FRs Covered:** FR8, FR9, FR10

### Story 3.1: Galaxy Generation and Visualization

As a player,
I want to see a procedurally generated galaxy with 4-6 planets displayed on an interactive map,
So that I can explore the game world and plan my strategy.

**Acceptance Criteria:**

**Given** a new campaign is started
**When** the campaign loads
**Then** the GalaxyGenerator system creates a galaxy with 4-6 planets (random count within range)
**And** each planet has: unique ID, planet type (Terran, Desert, Ice, Volcanic, Gas Giant), position coordinates (x, y), owner (Player, AI, or Neutral), initial population, initial morale, base resource generation rates

**Given** the galaxy has been generated
**When** the galaxy map scene is displayed
**Then** I see all planets rendered at their designated positions
**And** each planet displays: visual sprite matching its type, owner color indicator (green=Player, red=AI, gray=Neutral), planet name label
**And** the galaxy background shows stars/space imagery
**And** the map is sized appropriately for the screen resolution (1280×720 min desktop, 375×667 min mobile per NFR-C2)

**Given** I am viewing the galaxy map
**When** the scene first loads
**Then** the camera is centered on the player's starting planet
**And** all planets are visible within the viewport or accessible via pan/zoom
**And** the initial view loads within 100ms of scene creation (NFR-P3)

**Given** multiple campaigns use the same random seed
**When** galaxies are generated with identical seeds
**Then** the same galaxy layout is produced (same planet count, types, positions)
**And** deterministic generation enables reproducible testing

### Story 3.2: Planet Selection and Highlighting

As a player,
I want to click or tap planets on the galaxy map to select them with visual feedback,
So that I can focus on specific planets and access their detailed information.

**Acceptance Criteria:**

**Given** I am viewing the galaxy map
**When** I click or tap on a planet sprite
**Then** the planet becomes selected within 100ms (NFR-P3)
**And** the selected planet displays a highlight visual (glowing outline, selection ring, or border)
**And** the previously selected planet (if any) is deselected and loses its highlight

**Given** I have selected a planet
**When** I view the galaxy map
**Then** the selected planet's highlight remains visible
**And** the highlight animation is smooth and doesn't flicker
**And** the selection state persists until I select a different planet or deselect

**Given** I am using a touch device
**When** I tap a planet
**Then** the tap target is at least 44×44 pixels (NFR-A2)
**And** the planet selection works reliably on first tap
**And** no accidental selections occur from nearby planets

**Given** I am using keyboard navigation (accessibility requirement NFR-A1)
**When** I press Tab or arrow keys
**Then** the selection cycles through planets in a logical order (left-to-right, top-to-bottom)
**And** the selected planet is highlighted with a visible focus indicator (3px border per NFR-A1)
**And** I can press Enter or Space to confirm selection and open the planet details panel

**Given** no planet is currently selected
**When** the galaxy map loads
**Then** the player's home planet is automatically selected by default
**And** the selection highlight is immediately visible

### Story 3.3: Planet Information Panel

As a player,
I want to view detailed planet attributes in an information panel when a planet is selected,
So that I can make informed strategic decisions about resource management and military actions.

**Acceptance Criteria:**

**Given** I have selected a planet on the galaxy map
**When** the planet is selected
**Then** a planet information panel appears on the screen within 100ms (NFR-P3)
**And** the panel displays: planet name, planet type (with icon), owner (Player/AI/Neutral with color indicator), population (current/maximum), morale percentage (0-100%)

**Given** the planet information panel is displayed
**When** I view the panel
**Then** I see current resource information (if planet is owned by player): Credits per turn, Minerals per turn, Fuel per turn, Food per turn, Energy per turn
**And** resource values are clearly labeled and color-coded
**And** neutral and AI-owned planets show "Unknown" or obscured resource values (fog of war)

**Given** the planet is player-owned
**When** I view the planet information panel
**Then** I see additional management options: "Build" button (opens building menu - Epic 4), "Manage" button (detailed planet screen), current buildings list (if any exist)
**And** all interactive buttons provide hover/focus feedback

**Given** the planet is AI-owned or Neutral
**When** I view the planet information panel
**Then** I see limited information: planet type, estimated military strength (if scouted), ownership status
**And** I see strategic options: "Scout" button (send scout craft - Epic 5), "Invade" button (if I control orbit - Epic 6)
**And** unavailable actions are grayed out with tooltip explanations

**Given** I am viewing the planet information panel
**When** I click outside the panel or press Escape
**Then** the panel closes smoothly
**And** the planet remains selected (highlight visible)
**And** I can reopen the panel by clicking the selected planet again

**Given** the planet information updates during gameplay (e.g., population grows, building completes)
**When** the panel is open for that planet
**Then** the displayed information updates in real-time without requiring manual refresh
**And** significant changes trigger brief highlight animations on the affected values

**Given** I am using high contrast mode (NFR-A2)
**When** I view the planet information panel
**Then** all text has sufficient contrast ratio (4.5:1 minimum)
**And** borders are thickened to 4px
**And** important information uses patterns in addition to color (not color alone)

---

## Epic 4: Planetary Economy & Infrastructure

**Epic Goal:** Players manage five resources (Credits, Minerals, Fuel, Food, Energy), receive automated income, and construct planetary buildings.

**FRs Covered:** FR11, FR12, FR13, FR14

### Story 4.1: Resource Display and Management

As a player,
I want to view my current resource totals and per-turn income for all five resources,
So that I can make informed decisions about spending and economic development.

**Acceptance Criteria:**

**Given** I am playing a campaign
**When** the campaign gameplay scene is displayed
**Then** I see a resource display HUD element showing all five resources: Credits, Minerals, Fuel, Food, Energy
**And** each resource displays: current total, per-turn income (e.g., "+50/turn"), resource icon or color code
**And** the resource display is always visible in a consistent screen position (top-right recommended)

**Given** I am viewing the resource display
**When** my resource totals change (spending, income, etc.)
**Then** the displayed values update immediately within 100ms (NFR-P3)
**And** increases show brief "+X" animations in green
**And** decreases show brief "-X" animations in red or orange
**And** resource totals are formatted clearly (e.g., "1,250" not "1250")

**Given** I have insufficient resources for an action (e.g., building construction)
**When** I attempt the action
**Then** I see a clear error message: "Insufficient [Resource Name]. You need [amount] but have [current total]."
**And** the deficient resource is highlighted in the resource display
**And** the action is blocked until I have sufficient resources

**Given** a resource total reaches zero or negative
**When** the resource is depleted
**Then** I see a warning notification: "[Resource Name] depleted! Income may be affected."
**And** the resource display shows the resource in a warning color (red or orange)
**And** gameplay continues (no automatic defeat), but certain actions may be blocked

**Given** I am in the Income phase
**When** per-turn income is applied
**Then** each resource total increases by its per-turn income value
**And** I see a summary notification: "Income: +[Credits], +[Minerals], +[Fuel], +[Food], +[Energy]"
**And** the resource display animates the increases

### Story 4.2: Building Construction Queue

As a player,
I want to construct buildings on my owned planets using resources,
So that I can improve resource production, defense, and planetary capabilities.

**Acceptance Criteria:**

**Given** I have selected a player-owned planet
**When** I click the "Build" button in the planet information panel
**Then** a building construction menu opens within 100ms (NFR-P3)
**And** I see a list of available buildings: Mine (increases Minerals income), Factory (increases production capacity), Farm (increases Food income), Power Plant (increases Energy income), Research Lab (future tech system), Defense Grid (Epic 4.4)
**And** each building shows: name, icon, resource cost (Credits, Minerals, etc.), construction time (turns), benefit description

**Given** I am viewing the building construction menu
**When** I have sufficient resources for a building
**Then** the building option is displayed as available (normal colors, clickable)
**And** I can click the building to queue it for construction
**And** I see a tooltip showing: "Click to build [Building Name]. Cost: [resources]. Time: [turns]"

**Given** I have insufficient resources for a building
**When** I view that building option
**Then** the building option is grayed out or dimmed
**And** I see a tooltip: "Insufficient resources. Need: [missing resources]"
**And** the option cannot be clicked

**Given** I click to construct a building
**When** the building is queued
**Then** the required resources are immediately deducted from my totals
**And** the building appears in the planet's construction queue
**And** I see a confirmation notification: "[Building Name] construction started on [Planet Name]"
**And** the building construction menu closes automatically

**Given** a planet already has a building under construction
**When** I try to queue another building on the same planet
**Then** I see a message: "Construction already in progress. Only one building can be built at a time per planet."
**And** the new building is blocked (or queued for after current building completes - implementation choice)

### Story 4.3: Building Construction Progress Tracking

As a player,
I want to view building construction progress and receive notifications when buildings complete,
So that I know when new capabilities become available.

**Acceptance Criteria:**

**Given** a building is under construction on a planet
**When** I select that planet
**Then** the planet information panel shows: "Under Construction: [Building Name]", progress bar (e.g., "Turn 2 of 5"), estimated completion (e.g., "Completes in 3 turns")
**And** the progress bar visually indicates percentage complete

**Given** a building is under construction
**When** the End phase processes each turn
**Then** the building's construction progress increments by 1 turn
**And** the progress bar updates to reflect the new completion percentage
**And** the "turns remaining" counter decreases by 1

**Given** a building's construction reaches 100% (all turns complete)
**When** the End phase processes
**Then** the building construction completes automatically
**And** the building is added to the planet's active buildings list
**And** the building's benefits are immediately applied (e.g., increased resource income)
**And** I see a notification: "[Building Name] completed on [Planet Name]! +[benefit description]"

**Given** multiple buildings complete on the same turn
**When** the End phase processes
**Then** I see separate notifications for each completed building
**And** all notifications are stacked or queued (not overlapping)
**And** I can dismiss notifications individually or all at once

**Given** I capture an enemy planet with buildings under construction
**When** the planet ownership changes to me
**Then** in-progress buildings are either: cancelled (resources not refunded), OR continue construction under new ownership (implementation choice)
**And** the behavior is consistent and documented

### Story 4.4: Automated Resource Income Processing

As a player,
I want to receive automated per-turn resource income from all owned planets,
So that my economy grows without requiring manual actions each turn.

**Acceptance Criteria:**

**Given** I own one or more planets
**When** the Income phase processes
**Then** each owned planet generates resources according to its base generation rates
**And** buildings on the planet add bonuses to generation (e.g., Mine +10 Minerals/turn)
**And** all planet income is summed into total per-turn income
**And** the total income is added to my resource totals

**Given** a planet has multiple buildings affecting income
**When** income is calculated
**Then** all building bonuses stack additively (e.g., 2 Mines = +20 Minerals/turn total)
**And** the planet information panel shows the breakdown: "Base: +5 Minerals/turn, Buildings: +20 Minerals/turn, Total: +25 Minerals/turn"

**Given** a planet has low morale (<50%)
**When** income is calculated
**Then** income may be reduced by a morale penalty (e.g., 50% morale = 50% income reduction)
**And** the penalty is clearly indicated in the planet information panel
**And** I see a warning: "Low morale on [Planet Name] reducing income by [percentage]"

**Given** I own no planets (edge case - should not happen unless defeat)
**When** the Income phase processes
**Then** I receive zero income
**And** resource totals do not increase
**And** I see a warning: "No planets owned - no income generated"

**Given** the Income phase completes
**When** income processing finishes
**Then** the processing completes within 2 seconds (NFR-P3)
**And** I see a summary notification with total income across all resources
**And** the resource display HUD updates with new totals

---

## Epic 5: Military Forces & Movement

**Epic Goal:** Players commission platoons with configurable equipment/weapons, purchase spacecraft, load troops, and navigate between planets.

**FRs Covered:** FR15, FR16, FR17, FR18, FR19

### Story 5.1: Platoon Commissioning with Equipment Configuration

As a player,
I want to commission platoons with configurable equipment and weapons levels,
So that I can build military forces tailored to my strategic needs.

**Acceptance Criteria:**

**Given** I have selected a player-owned planet
**When** I access the planet management screen
**Then** I see a "Commission Platoon" button
**And** the button is enabled if I have sufficient resources
**And** I see current platoon count on this planet (e.g., "Platoons: 3")

**Given** I click "Commission Platoon"
**When** the platoon configuration interface opens
**Then** I see configuration options: troop count (slider or input: 100-1000 troops), equipment level (Basic/Standard/Advanced), weapon level (Light/Medium/Heavy)
**And** I see the total resource cost updating in real-time as I adjust configurations
**And** higher equipment/weapon levels cost more resources

**Given** I am configuring a platoon
**When** I select "Advanced" equipment level
**Then** the equipment level is highlighted
**And** the resource cost increases (e.g., +50% Credits cost)
**And** I see a tooltip: "Advanced equipment improves combat effectiveness by [percentage]"

**Given** I have configured a platoon
**When** I click "Commission Platoon" to confirm
**Then** the required resources are deducted from my totals
**And** a new platoon entity is created with: unique ID, troop count, equipment level, weapon level, current location (planet), owner (Player)
**And** the platoon appears in the planet's garrison list
**And** I see a notification: "Platoon commissioned on [Planet Name]. Troops: [count], Equipment: [level], Weapons: [level]"

**Given** I have insufficient resources
**When** I attempt to commission a platoon
**Then** I see an error: "Insufficient resources. Need: [missing resources]"
**And** the commission action is blocked
**And** suggested configurations within my budget are highlighted (optional UX enhancement)

### Story 5.2: Platoon Details and Management

As a player,
I want to view detailed information about my platoons including troop count, equipment level, and weapon level,
So that I can assess my military strength and make tactical decisions.

**Acceptance Criteria:**

**Given** I have commissioned one or more platoons
**When** I view a planet with garrisoned platoons
**Then** the planet information panel shows a "Platoons" section listing all platoons
**And** each platoon entry shows: platoon ID or name, troop count, equipment level icon/badge, weapon level icon/badge

**Given** I click on a platoon in the list
**When** the platoon details expand
**Then** I see full platoon information: exact troop count (e.g., "842/1000 troops - 158 casualties"), equipment level with description, weapon level with description, current status (Garrisoned/In Transit/In Combat), morale percentage (if implemented)
**And** I see available actions: "Load onto Battle Cruiser" (if cruiser available), "Disband" (recovers partial resources)

**Given** a platoon has taken casualties in combat
**When** I view the platoon details
**Then** the troop count reflects casualties (e.g., reduced from 1000 to 750)
**And** I see a casualty indicator: "Casualties: 250 troops"
**And** the platoon's combat effectiveness is reduced proportionally

**Given** I want to reinforce a damaged platoon
**When** I commission a new platoon on the same planet
**Then** I can choose to merge it with an existing platoon (optional feature)
**Or** both platoons exist independently as separate units

**Given** I have no platoons commissioned yet
**When** I view the military status screen
**Then** I see a message: "No platoons commissioned. Visit a planet to commission troops."
**And** I see a tutorial hint: "Tip: Commission platoons to defend planets and conduct invasions."

### Story 5.3: Spacecraft Purchase and Types

As a player,
I want to purchase spacecraft of different types (Scouts, Battle Cruisers, Bombers, Atmosphere Processors) using resources,
So that I can build a fleet for exploration, combat, and planetary operations.

**Acceptance Criteria:**

**Given** I have selected a player-owned planet
**When** I access the planet management or construction screen
**Then** I see a "Purchase Spacecraft" section
**And** I see available spacecraft types: Scout (low cost, fast, reveals enemy info), Battle Cruiser (high cost, transports platoons, heavy combat), Bomber (medium cost, orbital bombardment specialist), Atmosphere Processor (special, terraforming - future epic if applicable)
**And** each spacecraft shows: name, icon/sprite, resource cost, capabilities description, build time (turns or instant)

**Given** I am viewing spacecraft purchase options
**When** I have sufficient resources for a spacecraft
**Then** the spacecraft option is displayed as available
**And** I can click "Purchase" to buy the spacecraft
**And** I see the total cost displayed clearly

**Given** I click "Purchase" for a spacecraft
**When** the purchase is confirmed
**Then** the required resources are immediately deducted
**And** a new spacecraft entity is created with: unique ID, type (Scout/Battle Cruiser/Bomber/etc.), owner (Player), current location (planet where purchased), cargo capacity (if Battle Cruiser), fuel capacity, health/shields
**And** the spacecraft appears in the planet's docked fleet list
**And** I see a notification: "[Spacecraft Type] purchased at [Planet Name]"

**Given** I purchase a Battle Cruiser
**When** the spacecraft is created
**Then** the Battle Cruiser has cargo capacity for platoons (e.g., 2-3 platoons max)
**And** the cargo bay is initially empty
**And** I see cargo capacity displayed: "Cargo: 0/3 platoons"

**Given** I purchase a Scout
**When** the spacecraft is created
**Then** the Scout has no cargo capacity (cannot transport platoons)
**And** the Scout has higher speed/range than Battle Cruisers
**And** the Scout can reveal fog of war or enemy planet details (scouting mechanic)

### Story 5.4: Loading Platoons onto Battle Cruisers

As a player,
I want to load platoons onto Battle Cruisers for transport,
So that I can move ground forces between planets for invasions or reinforcement.

**Acceptance Criteria:**

**Given** I have a Battle Cruiser and one or more platoons on the same planet
**When** I view the Battle Cruiser details
**Then** I see a "Load Platoon" button
**And** I see current cargo status: "Cargo: [X]/[max] platoons loaded"
**And** available platoons on this planet are listed

**Given** I click "Load Platoon"
**When** the loading interface opens
**Then** I see a list of all platoons garrisoned on this planet
**And** each platoon shows: troop count, equipment level, weapon level, "Load" button
**And** platoons that are already loaded on other craft are not shown or are grayed out

**Given** I select a platoon to load
**When** I click "Load" and the Battle Cruiser has available cargo capacity
**Then** the platoon is transferred from the planet garrison to the Battle Cruiser cargo bay
**And** the platoon's status changes to "In Transit" or "Loaded"
**And** the Battle Cruiser cargo count increases by 1
**And** I see a notification: "[Platoon ID] loaded onto [Battle Cruiser ID]"

**Given** I attempt to load a platoon onto a Battle Cruiser at full cargo capacity
**When** I click "Load"
**Then** I see an error message: "Cargo bay full. Maximum [X] platoons."
**And** the load action is blocked
**And** I am prompted to unload a platoon first or use a different Battle Cruiser

**Given** a Battle Cruiser has loaded platoons
**When** I view the Battle Cruiser details
**Then** I see a list of all loaded platoons
**And** each platoon has an "Unload" button
**And** I can unload platoons back to the current planet's garrison

**Given** I unload a platoon from a Battle Cruiser
**When** I click "Unload"
**Then** the platoon is transferred from the cargo bay to the planet garrison
**And** the platoon's status changes to "Garrisoned"
**And** the Battle Cruiser cargo count decreases by 1

### Story 5.5: Spacecraft Navigation Between Planets

As a player,
I want to navigate spacecraft between planets on the galaxy map,
So that I can position my fleet for exploration, invasion, and defense.

**Acceptance Criteria:**

**Given** I have one or more spacecraft docked at a planet
**When** I select a spacecraft
**Then** I see spacecraft details: type, current location, fuel level, cargo (if applicable), health/shields
**And** I see a "Navigate" button

**Given** I click "Navigate" for a spacecraft
**When** the navigation interface opens
**Then** I see the galaxy map with all planets visible
**And** the current planet is highlighted as the origin
**And** other planets are selectable as destinations
**And** I see a prompt: "Select destination planet for [Spacecraft Type]"

**Given** I am selecting a destination planet
**When** I hover over or select a planet
**Then** I see navigation information: distance (in units or turns), fuel cost, estimated travel time (turns)
**And** planets out of range (insufficient fuel) are grayed out or marked "Out of Range"

**Given** I select a valid destination planet
**When** I confirm the navigation order
**Then** the spacecraft's destination is set to the target planet
**And** the spacecraft status changes to "In Transit"
**And** the spacecraft begins moving on the galaxy map (animated path or instant depending on implementation)
**And** fuel is consumed according to distance
**And** I see a notification: "[Spacecraft Type] navigating to [Destination Planet]. ETA: [turns]"

**Given** a spacecraft is in transit
**When** the End phase processes each turn
**Then** the spacecraft's travel progress increments
**And** the spacecraft moves closer to the destination on the map (visual update)
**And** the ETA decreases by 1 turn

**Given** a spacecraft completes its journey
**When** the spacecraft arrives at the destination planet
**Then** the spacecraft status changes to "Docked" at the new planet
**And** the spacecraft appears in the destination planet's docked fleet list
**And** I see a notification: "[Spacecraft Type] arrived at [Destination Planet]"
**And** if the spacecraft is a Battle Cruiser with loaded platoons, the platoons remain loaded (can be unloaded at destination)

**Given** a spacecraft runs out of fuel mid-journey (edge case)
**When** fuel reaches zero
**Then** the spacecraft becomes stranded in space (implementation choice: drifts or stays stationary)
**And** I see a warning: "[Spacecraft Type] out of fuel! Stranded in transit."
**And** I must send a refueling mission or abandon the craft

---

## Epic 6: Combat & Planetary Invasion

**Epic Goal:** Players invade enemy planets, configure combat aggression levels, and view detailed battle results including casualties and captured resources.

**FRs Covered:** FR20, FR21, FR22

### Story 6.1: Initiate Planetary Invasion

As a player,
I want to initiate planetary invasions when I control orbit around an enemy planet,
So that I can conquer enemy territory and expand my empire.

**Acceptance Criteria:**

**Given** I have a Battle Cruiser with loaded platoons in orbit around an AI-owned or neutral planet
**When** I select the Battle Cruiser
**Then** I see an "Invade Planet" button
**And** the button is enabled if orbital control conditions are met (no enemy ships in orbit, platoons loaded)

**Given** enemy spacecraft are present in orbit
**When** I attempt to invade
**Then** I see a message: "Orbital space contested. Destroy enemy ships before invading."
**And** the invasion is blocked until I win space combat (Epic 6 extension or future epic)

**Given** I click "Invade Planet" with valid conditions
**When** the invasion interface opens
**Then** I see invasion setup screen: attacking platoons list (from Battle Cruiser cargo), defending forces estimate (if scouted, otherwise "Unknown"), planet name and type, combat aggression slider (0-100%)
**And** I can select which loaded platoons participate in the invasion

**Given** I am configuring the invasion
**When** I select platoons to deploy
**Then** I see total attacking force strength: total troops, average equipment level, average weapon level, estimated combat power
**And** I see defender strength estimate (if scouted) or "Unknown forces"

**Given** I have configured the invasion
**When** I click "Launch Invasion"
**Then** the invasion is queued for the Combat phase
**And** I see a confirmation: "Invasion of [Planet Name] will commence during Combat phase"
**And** the invasion setup screen closes
**And** the Battle Cruiser remains in orbit (does not dock or leave)

**Given** no platoons are loaded on the Battle Cruiser
**When** I attempt to invade
**Then** I see an error: "No platoons loaded. Load platoons before invading."
**And** the invasion is blocked

### Story 6.2: Combat Aggression Configuration

As a player,
I want to configure combat aggression levels (0-100%) before battles,
So that I can balance between aggressive attacks and conservative tactics to minimize casualties.

**Acceptance Criteria:**

**Given** I am configuring an invasion
**When** I view the invasion setup screen
**Then** I see a combat aggression slider ranging from 0% to 100%
**And** the slider has clear markers: 0% = "Very Conservative", 25% = "Defensive", 50% = "Balanced", 75% = "Aggressive", 100% = "All-Out Assault"
**And** the default value is 50% (Balanced)

**Given** I adjust the aggression slider
**When** I move the slider to a new value
**Then** the slider position updates smoothly
**And** I see the current percentage value displayed (e.g., "Aggression: 67%")
**And** I see a description of the tactical approach: "Aggressive: Higher casualties but faster victory. Defensive: Lower casualties but longer battle."

**Given** I set aggression to 0% (Very Conservative)
**When** combat is resolved
**Then** my forces prioritize defense and cover
**And** I take fewer casualties but deal less damage to the enemy
**And** the battle may last longer or result in retreat/stalemate

**Given** I set aggression to 100% (All-Out Assault)
**When** combat is resolved
**Then** my forces attack aggressively with maximum firepower
**And** I deal maximum damage but may take higher casualties
**And** the battle resolves quickly (faster victory or faster defeat)

**Given** I set aggression to 50% (Balanced)
**When** combat is resolved
**Then** combat is resolved using standard combat calculations
**And** casualties and damage are balanced per the combat system algorithms

**Given** I have set a specific aggression level
**When** I confirm the invasion
**Then** the aggression setting is stored with the invasion order
**And** the combat resolution uses this aggression modifier during the Combat phase

### Story 6.3: Combat Resolution and Battle Results

As a player,
I want to view detailed combat results after invasions including casualties, victory/defeat status, and captured resources,
So that I understand the outcome and consequences of the battle.

**Acceptance Criteria:**

**Given** an invasion has been queued
**When** the Combat phase processes
**Then** the combat system calculates battle outcome using: attacker troop count, attacker equipment level, attacker weapon level, attacker aggression setting, defender troop count, defender equipment level, defender weapon level, defender planet defense structures (if any)
**And** the combat resolves within 5 seconds (NFR-P3)

**Given** combat is being resolved
**When** the calculation completes
**Then** the outcome is determined: Victory (attacker conquers planet), Defeat (attacker repelled), or Stalemate (rare - both sides withdraw)
**And** casualty counts are calculated for both sides
**And** survivors are updated (platoon troop counts reduced by casualties)

**Given** the attacker wins the invasion
**When** the battle concludes
**Then** the planet ownership changes from AI/Neutral to Player
**And** surviving attacking platoons are garrisoned on the conquered planet
**And** defending platoons are destroyed or captured (implementation choice)
**And** a percentage of the planet's resources are captured (e.g., 25-50% of stockpiled resources)
**And** I see a "Victory!" results screen

**Given** the victory results screen is displayed
**When** I view the results
**Then** I see: "Victory - [Planet Name] Conquered!", attacker casualties (e.g., "Your losses: 234 troops"), defender casualties (e.g., "Enemy losses: 512 troops"), resources captured (breakdown by type), surviving platoons list, "Continue" button

**Given** the attacker loses the invasion
**When** the battle concludes
**Then** the planet ownership remains with the defender (AI/Neutral)
**And** attacking platoons are destroyed or forced to retreat to the Battle Cruiser with reduced strength
**And** the Battle Cruiser can retreat to a friendly planet
**And** I see a "Defeat" results screen

**Given** the defeat results screen is displayed
**When** I view the results
**Then** I see: "Defeat - Invasion Failed", attacker casualties (my losses), defender casualties (damage inflicted), reason for defeat (e.g., "Outnumbered", "Superior enemy defenses"), surviving forces (if any), "Retreat" or "Continue" button

**Given** the combat results screen is displayed (victory or defeat)
**When** I click "Continue"
**Then** the results screen closes
**And** the galaxy map updates to reflect new planet ownership (if victory)
**And** I can see the aftermath on the map (conquered planet now green/player-colored)
**And** a notification remains in the message log: "Battle report: [Planet Name] - [Victory/Defeat]"

**Given** multiple combats occur in the same turn
**When** the Combat phase processes
**Then** all combats are resolved sequentially
**And** I see separate result screens for each battle
**Or** I see a consolidated "Combat Summary" screen listing all battle outcomes (UX choice)

---

## Epic 7: AI Opponent System

**Epic Goal:** Players face intelligent AI opponents that make strategic decisions based on configurable personality types and difficulty levels.

**FRs Covered:** FR23, FR24

### Story 7.1: AI Strategic Decision-Making

As a player,
I want the AI opponent to make strategic decisions each turn including building economy, training military, and launching attacks,
So that I face a challenging and realistic opponent that adapts to the game state.

**Acceptance Criteria:**

**Given** a campaign is in progress with an AI opponent
**When** the Combat phase processes (AI turn)
**Then** the AI executes its decision-making system using the AIDecisionSystem
**And** the AI evaluates its current game state: owned planets, resources, military strength, threat assessment
**And** the AI makes decisions within 2 seconds (NFR-P3)

**Given** the AI is making decisions
**When** the AI decision tree executes
**Then** the AI follows a priority order: 1. Defense (respond to threats), 2. Military (build forces if safe), 3. Economy (build income structures), 4. Attack (invade enemy planets if strong)
**And** each decision branch is evaluated based on current conditions

**Given** the AI identifies a threat (enemy forces near AI planets)
**When** the Defense priority is evaluated
**Then** the AI may: commission defensive platoons on threatened planets, purchase defensive structures (if implemented), move existing forces to defend
**And** defensive actions take precedence over offensive plans

**Given** the AI has no immediate threats
**When** the Military priority is evaluated
**Then** the AI may: commission new platoons on core planets, purchase spacecraft (Scouts, Battle Cruisers), upgrade equipment/weapons (if upgrade system exists)
**And** military spending is balanced against economy needs

**Given** the AI has stable defenses and military
**When** the Economy priority is evaluated
**Then** the AI may: construct economy buildings (Mines, Factories, Farms, Power Plants), expand to neutral planets (if safe), optimize resource generation
**And** economy investments support long-term growth

**Given** the AI has military superiority
**When** the Attack priority is evaluated
**Then** the AI may: launch invasions on weak player planets, send scouts to gather intelligence, position Battle Cruisers for future invasions
**And** attacks are coordinated (platoons loaded onto cruisers, navigation to target)

**Given** the AI makes decisions
**When** decisions are finalized
**Then** I see notifications for visible AI actions: "[AI Faction Name] constructed [Building] on [Planet Name]", "[AI Faction Name] fleet detected near [Planet Name]", "Enemy invasion of [Player Planet] imminent!"
**And** hidden AI actions (on AI planets I haven't scouted) are not revealed

### Story 7.2: AI Personality and Difficulty Adaptation

As a player,
I want the AI opponent to adapt its behavior based on personality type (Aggressive, Defensive, Economic, Balanced) and difficulty level (Easy, Normal, Hard),
So that I experience varied and appropriately challenging opponents.

**Acceptance Criteria:**

**Given** I start a campaign with "Aggressive" AI personality
**When** the AI makes decisions
**Then** the AI prioritizes Military and Attack decisions over Economy
**And** the AI attacks earlier in the game (e.g., turn 5 vs turn 10)
**And** the AI takes higher risks (invading with smaller force advantages)
**And** I see more frequent invasions and aggressive expansion

**Given** I start a campaign with "Defensive" AI personality
**When** the AI makes decisions
**Then** the AI prioritizes Defense and Economy over Attack
**And** the AI builds up defenses on core planets heavily
**And** the AI only attacks when it has overwhelming superiority (2:1 force ratio or better)
**And** I see fewer invasions but stronger defensive positions

**Given** I start a campaign with "Economic" AI personality
**When** the AI makes decisions
**Then** the AI prioritizes Economy building above all else
**And** the AI expands to neutral planets quickly for resource generation
**And** the AI delays military spending until mid-game
**And** I see rapid AI economic growth but slower military buildup

**Given** I start a campaign with "Balanced" AI personality
**When** the AI makes decisions
**Then** the AI balances all priority branches equally
**And** the AI adapts to the game state (defensive when threatened, aggressive when strong)
**And** I see a versatile opponent that adjusts strategy dynamically

**Given** I start a campaign on "Easy" difficulty
**When** the AI makes decisions
**Then** the AI receives resource/production penalties (e.g., -25% income)
**And** the AI makes suboptimal decisions occasionally (random chance to skip optimal choice)
**And** the AI delays attacks and expansion
**And** I have breathing room to learn the game mechanics

**Given** I start a campaign on "Normal" difficulty
**When** the AI makes decisions
**Then** the AI plays with standard rules (no bonuses or penalties)
**And** the AI makes competent decisions following its personality
**And** the challenge is balanced for intermediate players

**Given** I start a campaign on "Hard" difficulty
**When** the AI makes decisions
**Then** the AI receives resource/production bonuses (e.g., +25% income)
**And** the AI makes optimal decisions consistently
**And** the AI reacts faster to threats and opportunities
**And** I face a highly challenging and aggressive opponent

**Given** the AI personality and difficulty are set at campaign start
**When** the campaign progresses
**Then** the AI behavior remains consistent with these settings
**And** the AI does not change personality mid-game (unless triggered by a specific event - future feature)

---

## Epic 8: Quick-Play Tactical Scenarios

**Epic Goal:** Players enjoy fast-paced tactical challenges through Flash Scenarios as replayable content after completing basic campaigns.

**FRs Covered:** FR28

### Story 8.1: Tactical Scenario Content and Variety

As a player who has completed tutorial scenarios,
I want to access tactical Flash Scenarios as quick-play challenges,
So that I can enjoy fast, replayable strategic gameplay during short play sessions.

**Acceptance Criteria:**

**Given** I have completed at least one tutorial Flash Scenario (from Epic 1)
**When** I access the Flash Scenarios menu
**Then** I see tactical scenarios unlocked and available
**And** tactical scenarios are marked with type badge: "Tactical" (vs "Tutorial")
**And** tactical scenarios are sorted by difficulty: Easy, Medium, Hard, Expert

**Given** I am viewing the scenario list
**When** I filter or view tactical scenarios
**Then** I see scenarios with varied objectives: "Conquer 3 planets in 10 turns", "Defend against overwhelming invasion", "Resource race: Reach 5000 Credits first", "Fleet battle: Destroy all enemy ships"
**And** each tactical scenario has unique initial conditions and victory requirements

**Given** I select a tactical Flash Scenario
**When** I view the scenario details
**Then** I see: scenario name, difficulty badge, estimated completion time (5-15 minutes), victory conditions, optional: special rules (e.g., "No new platoon commissioning - use starting forces only"), best completion time (if completed), star rating (if replay)
**And** I do NOT see tutorial step guidance (tactical scenarios skip the tutorial system)

**Given** I start a tactical Flash Scenario
**When** the scenario initializes
**Then** the game state is configured per the scenario JSON (initial_state)
**And** I am dropped directly into gameplay (no tutorial overlay)
**And** the scenario loads within 2 seconds (NFR-P2)
**And** I see the victory conditions panel (can be reopened with O key)

**Given** I complete a tactical Flash Scenario
**When** I achieve victory
**Then** I see the scenario completion results screen (same as Epic 1.5)
**And** I see completion time, star rating (1-3 stars based on time/efficiency), personal best time, "Retry" and "Next Scenario" buttons
**And** the completion is tracked in Supabase (same as Epic 1.6)

**Given** tactical scenarios are available
**When** I complete scenarios and improve my times
**Then** I can compete for better star ratings and faster times
**And** I see leaderboards or personal progress tracking (optional future enhancement)

---

## Epic 9: Scenario Pack System

**Epic Goal:** Players experience faction variety by browsing and switching scenario packs that change AI configurations, galaxy layouts, and resource abundance.

**FRs Covered:** FR32, FR33, FR34, FR35

### Story 9.1: Scenario Pack Browsing and Selection

As a player,
I want to browse available scenario packs from the main menu,
So that I can explore different faction themes and gameplay variations.

**Acceptance Criteria:**

**Given** I am viewing the main menu
**When** I access the "Scenario Packs" option
**Then** I see a scenario pack browser interface
**And** I see a list of available packs (at least a default pack + 1-2 additional packs)
**And** each pack displays: pack name, faction name, faction leader portrait/icon, difficulty rating, planet count, short lore description

**Given** I am viewing the scenario pack list
**When** I select a pack to view details
**Then** I see an expanded detail panel showing: full faction lore, AI personality type (Aggressive/Defensive/Economic/Balanced), AI difficulty modifiers, galaxy template details (planet count range, planet types distribution), resource abundance (Standard/Rich/Scarce), visual theme preview (color scheme, UI tinting)
**And** I see a "Select Pack" button

**Given** I view a scenario pack
**When** the pack has not been unlocked (optional progression system)
**Then** I see a "Locked" indicator
**And** I see unlock requirements (e.g., "Complete Campaign on Normal difficulty to unlock")
**And** the "Select Pack" button is disabled

**Given** I view an unlocked scenario pack
**When** I review the pack details
**Then** the "Select Pack" button is enabled
**And** I can click to activate this pack as my current pack

### Story 9.2: Scenario Pack Switching and Configuration Loading

As a player,
I want to switch between scenario packs to change AI config, galaxy layout, and resources,
So that I experience fresh gameplay with different strategic challenges.

**Acceptance Criteria:**

**Given** I have selected a new scenario pack
**When** I click "Select Pack"
**Then** I see a confirmation prompt: "Switch to [Pack Name]? This will affect new campaigns and Flash Scenarios."
**And** I see a warning: "Active campaigns will not be affected. Only new games will use this pack."

**Given** I confirm the pack switch
**When** the pack is activated
**Then** the system loads the pack JSON configuration from `public/assets/data/packs/{pack_id}.json`
**And** the JSON is validated against the scenario pack schema (NFR-S3)
**And** the pack data is parsed and stored in application state
**And** I see a notification: "[Pack Name] activated! Start a new campaign or Flash Scenario to experience it."

**Given** the scenario pack JSON is loaded
**When** the pack configuration is applied
**Then** the following systems are configured: AI personality (from pack `ai_config.personality`), AI difficulty modifiers (from pack `ai_config.modifiers`), galaxy template (planet_count, types, resource_abundance from `galaxy_template`), faction metadata (name, leader, lore, color_theme from `faction`)
**And** all configuration values are validated (type checking, range validation)

**Given** a scenario pack is active
**When** I start a new campaign
**Then** the campaign uses the active pack's configuration
**And** the galaxy is generated using the pack's galaxy template
**And** the AI opponent uses the pack's AI config
**And** faction colors/theme are applied to the UI (AI planets colored per pack theme)

**Given** a scenario pack is active
**When** I start a Flash Scenario
**Then** scenarios tagged with this pack use the pack configuration
**Or** scenarios remain independent (implementation choice - packs may or may not affect Flash Scenarios)

**Given** the scenario pack JSON is malformed or fails validation
**When** the pack is loaded
**Then** I see an error message: "Unable to load scenario pack. Using default pack."
**And** the system falls back to the default scenario pack
**And** error details are logged (LogLevel.ERROR, category: Core)

### Story 9.3: Scenario Pack Metadata Display

As a player,
I want to view scenario pack metadata including name, difficulty, AI personality, and planet count,
So that I understand what gameplay experience each pack offers before selecting it.

**Acceptance Criteria:**

**Given** I am browsing scenario packs
**When** I view a pack in the list
**Then** I see key metadata displayed: pack name (e.g., "The Crimson Empire"), faction leader (e.g., "Emperor Valerius"), difficulty indicator (Easy/Normal/Hard/Expert), AI personality (Aggressive/Defensive/Economic/Balanced), planet count range (e.g., "4-6 planets"), resource abundance (Standard/Rich/Scarce)

**Given** I view detailed pack information
**When** I expand the pack details
**Then** I see additional metadata: pack version number (e.g., "v1.2"), author/creator (if applicable), lore description (2-3 paragraphs), faction color theme (visual preview), special rules or modifiers (e.g., "+25% AI production speed", "Player starts with 2 planets")

**Given** multiple scenario packs are installed
**When** I browse the pack list
**Then** packs are sorted by: featured/official packs first, difficulty (Easy → Expert), alphabetically by name
**And** I can filter packs by: difficulty level, AI personality type, planet count

**Given** a scenario pack includes custom assets (portraits, UI themes)
**When** I view the pack preview
**Then** I see a visual preview of the faction theme (color scheme, leader portrait)
**And** the preview loads within 500ms (NFR-P4)

**Given** I want to return to the default pack
**When** I select "Default Pack" or "Standard Campaign"
**Then** the system resets to default configuration (Balanced AI, Normal difficulty, standard galaxy template)
**And** I see a notification: "Default pack activated"

---

## Epic 10: User Accounts & Cross-Device Persistence

**Epic Goal:** Players create accounts with email/password, save campaign progress at any time, load previous games, and sync across devices.

**FRs Covered:** FR36, FR37, FR38, FR39, FR40, FR41, FR42

### Story 10.1: User Account Creation

As a new player,
I want to create a user account with email and password,
So that my game progress is saved and accessible across devices.

**Acceptance Criteria:**

**Given** I am viewing the main menu and not logged in
**When** the menu loads
**Then** I see "Create Account" and "Login" buttons
**And** I see a "Play as Guest" option for offline/anonymous play

**Given** I click "Create Account"
**When** the registration form opens
**Then** I see input fields: Email (text input), Password (password input, hidden characters), Confirm Password (password input), optional: Username (text input)
**And** I see a "Create Account" submit button
**And** I see a link: "Already have an account? Login"

**Given** I am filling out the registration form
**When** I enter an email address
**Then** the email is validated for correct format (contains @, valid domain)
**And** I see real-time validation feedback (green checkmark if valid, red error if invalid)

**Given** I enter a password
**When** I type in the password field
**Then** I see password strength indicator (Weak/Medium/Strong)
**And** I see requirements: minimum 8 characters, at least one uppercase, one lowercase, one number (optional: symbols)
**And** the password is hidden by default but can be revealed via "Show Password" toggle

**Given** I submit the registration form with valid data
**When** I click "Create Account"
**Then** the account creation request is sent to Supabase authentication
**And** the password is hashed using bcrypt with cost factor 12+ (NFR-S1)
**And** a new user record is created in Supabase auth.users table
**And** a user profile is created in the `user_profiles` table with default settings

**Given** account creation succeeds
**When** the response returns
**Then** I see a success notification: "Account created successfully! Welcome, [username/email]"
**And** I am automatically logged in
**And** I am redirected to the main menu (now logged in state)
**And** I see my username/email displayed in the menu

**Given** account creation fails (e.g., email already exists)
**When** the error response returns
**Then** I see a clear error message: "Email already registered. Please login or use a different email."
**And** the registration form remains open for corrections
**And** I can try again with different credentials

**Given** I am offline during account creation
**When** the registration request fails due to no connection
**Then** I see an error: "Unable to create account. Please check your internet connection."
**And** I am prompted to retry or "Play as Guest"

### Story 10.2: User Login

As a returning player,
I want to log in to my account to access my saved games and profile,
So that I can continue my progress from where I left off.

**Acceptance Criteria:**

**Given** I am viewing the main menu and not logged in
**When** I click "Login"
**Then** I see a login form with: Email (text input), Password (password input), "Login" button, "Forgot Password?" link, "Don't have an account? Create Account" link

**Given** I enter my credentials
**When** I type my email and password
**Then** the input fields accept my entries
**And** the password is hidden by default (with optional "Show Password" toggle)

**Given** I submit the login form with correct credentials
**When** I click "Login"
**Then** the login request is sent to Supabase authentication
**And** the credentials are verified (password hash comparison)
**And** a secure HTTP-only session cookie is created (NFR-S1)
**And** I am logged in successfully

**Given** login succeeds
**When** the authentication completes
**Then** I see a success notification: "Welcome back, [username]!"
**And** I am redirected to the main menu (logged in state)
**And** my user profile data is loaded from Supabase `user_profiles` table
**And** my saved games list is loaded (available in "Load Game" menu)
**And** my scenario completion history is loaded (for Flash Scenarios tracking)

**Given** I submit incorrect credentials (wrong password or nonexistent email)
**When** the login fails
**Then** I see an error message: "Invalid email or password. Please try again."
**And** the login form remains open
**And** I can attempt login again (rate-limited after 5 failed attempts for security)

**Given** I am offline during login
**When** the login request fails
**Then** I see an error: "Unable to login. Please check your internet connection."
**And** I am prompted to retry or "Play as Guest"

**Given** I click "Forgot Password?"
**When** the password reset flow initiates
**Then** I see a password reset form requesting my email
**And** a password reset email is sent with a 15-minute expiration link (NFR-S1)
**And** I see a message: "Password reset email sent. Check your inbox."

### Story 10.3: Save Campaign Progress

As a player,
I want to save my campaign progress at any time,
So that I can safely quit the game and resume later without losing progress.

**Acceptance Criteria:**

**Given** I am playing a campaign
**When** I press the Escape key or open the pause menu
**Then** I see a "Save Game" option
**And** I can trigger save from the pause menu or via keyboard shortcut (Ctrl+S)

**Given** I click "Save Game"
**When** the save dialog opens
**Then** I see a save slot interface: existing save slots (if any) with: save name, turn number, last saved timestamp, "Overwrite" option
**And** I see a "Save to New Slot" option
**And** I see a "Campaign Name" text input field

**Given** I enter a campaign name and confirm save
**When** I click "Save"
**Then** the current game state is serialized using SaveSystem.CreateSaveData()
**And** the save data is compressed using GZip
**And** a SHA256 checksum is calculated for integrity verification
**And** the save is uploaded to Supabase `saves` table with: user_id (current user), data (BYTEA compressed), checksum, campaign_name, turn_number, created_at, updated_at

**Given** the save operation is in progress
**When** the save is uploading
**Then** I see a progress indicator: "Saving game..."
**And** the save completes within 3 seconds (typical - NFR-R1 >99.9% success rate)

**Given** the save succeeds
**When** the save completes
**Then** I see a success notification: "Game saved successfully as '[Campaign Name]'"
**And** the save appears in my save slots list
**And** I can continue playing or quit safely

**Given** the save fails (network error, Supabase unavailable)
**When** the save operation fails
**Then** the save is automatically queued in LocalStorage for later sync (NFR-R4 fallback)
**And** I see a notification: "Save queued locally. Will sync when connection restored."
**And** I can continue playing with local save active

**Given** I am offline
**When** I attempt to save
**Then** the save is written to LocalStorage immediately
**And** I see a notification: "Game saved locally (offline mode)"
**And** the save will sync to Supabase when connection is restored

### Story 10.4: Load Previously Saved Campaigns

As a player,
I want to load previously saved campaigns,
So that I can resume my progress from past play sessions.

**Acceptance Criteria:**

**Given** I am logged in and viewing the main menu
**When** I click "Load Game"
**Then** I see a load game interface listing all my saved campaigns
**And** each save displays: campaign name, turn number, last saved timestamp (e.g., "2 hours ago"), difficulty and AI personality, thumbnail or preview (optional)

**Given** I am viewing my saved campaigns
**When** the save list loads
**Then** saves are sorted by most recent first (latest saved at top)
**And** I can filter or search saves by campaign name
**And** each save has a "Load" button and "Delete" button

**Given** I click "Load" on a saved campaign
**When** the load operation begins
**Then** the save data is fetched from Supabase `saves` table
**And** the SHA256 checksum is verified for data integrity
**And** the data is decompressed (GZip)
**And** the save data is deserialized using SaveSystem.Deserialize()
**And** the load completes within 3 seconds (NFR-P2)

**Given** the load succeeds
**When** the game state is restored
**Then** SaveSystem.ApplyToGameState() applies the save data to GameState
**And** GameState.RebuildLookups() rebuilds entity lookup dictionaries
**And** I am transitioned to the campaign gameplay scene
**And** I see the game state exactly as it was when saved (same turn, resources, entities, planet ownership)
**And** I see a notification: "Campaign '[Name]' loaded. Turn [N]"

**Given** the save data is corrupted (checksum mismatch)
**When** the load is attempted
**Then** I see an error: "Save file corrupted. Unable to load campaign."
**And** the load is aborted
**And** I am returned to the load game menu
**And** the corrupted save is marked with a warning icon (data corruption <0.01% per NFR-R1)

**Given** I am offline and have local saves
**When** I access "Load Game"
**Then** I see saves from LocalStorage
**And** I can load local saves normally
**And** I see an indicator: "Offline mode - showing local saves only"

### Story 10.5: Cross-Device Save Synchronization

As a player,
I want to access my saved games from different devices,
So that I can play on desktop at home and mobile during my commute without losing progress.

**Acceptance Criteria:**

**Given** I save a campaign on Device A (desktop)
**When** the save is uploaded to Supabase
**Then** the save is stored in the cloud with my user_id

**Given** I log in on Device B (mobile) with the same account
**When** I access "Load Game"
**Then** I see all my cloud-saved campaigns from Device A
**And** saves are fetched from Supabase within 5 seconds (NFR-R3)
**And** I can load and play any campaign seamlessly

**Given** I save a campaign on Device B while offline
**When** Device B reconnects to the internet
**Then** the local save is automatically synced to Supabase within 5 seconds (NFR-R3)
**And** I see a notification: "Saves synced to cloud"
**And** the save becomes accessible on Device A

**Given** I modify the same campaign on two devices without syncing
**When** both devices sync to Supabase
**Then** the last-write-wins conflict resolution is applied (NFR-R3)
**And** the most recently saved version overwrites the older version
**And** I see a warning: "Conflict detected. Most recent save kept."
**And** the overwritten save is not lost (optional: stored as a conflict backup)

**Given** Supabase is unavailable (service outage)
**When** I attempt to load or save
**Then** the system falls back to LocalStorage (NFR-R4)
**And** I see a notification: "Cloud unavailable. Using local saves."
**And** I can continue playing with local-only saves
**And** saves sync automatically when Supabase becomes available

### Story 10.6: User Settings Persistence

As a player,
I want my settings and preferences to persist across sessions,
So that my preferred UI scale, audio levels, and accessibility options are remembered.

**Acceptance Criteria:**

**Given** I am logged in
**When** I access the settings menu
**Then** I see configurable settings: UI Scale (100%/125%/150%), High Contrast Mode (On/Off), Audio Enabled (On/Off), Music Volume (0-100%), SFX Volume (0-100%), Master Volume (0-100%)
**And** current settings are loaded from Supabase `user_profiles` table

**Given** I change a setting (e.g., UI Scale to 125%)
**When** I apply the change
**Then** the setting is updated in real-time in the game
**And** the setting is saved to Supabase `user_profiles` table (updated in database)
**And** I see a notification: "Settings saved"

**Given** I log out and log back in
**When** I load the game
**Then** my settings are automatically loaded from Supabase
**And** UI scale, audio levels, and accessibility options are applied immediately
**And** the game appears exactly as I configured it previously

**Given** I play as a guest (not logged in)
**When** I change settings
**Then** settings are saved to LocalStorage only
**And** settings persist across sessions on the same device/browser
**And** settings do NOT sync across devices (guest mode is local-only)

**Given** I log in on a new device
**When** the game loads
**Then** my settings sync from Supabase within 5 seconds
**And** my preferred UI scale and audio levels are applied automatically

### Story 10.7: User Statistics Tracking

As a player,
I want the system to track my statistics including campaigns completed, Flash Scenarios completed, and playtime,
So that I can see my progress and achievements.

**Acceptance Criteria:**

**Given** I complete a campaign (victory condition met)
**When** the victory screen is displayed
**Then** my `campaigns_completed` counter increments in the user profile
**And** the statistic is saved to Supabase

**Given** I complete a Flash Scenario
**When** the scenario completion is recorded (Epic 1.6)
**Then** my `scenarios_completed` counter increments
**And** the statistic is updated in the user profile

**Given** I am actively playing the game
**When** each game session occurs
**Then** my total playtime is tracked (in seconds or minutes)
**And** playtime is updated periodically (e.g., every 5 minutes) in the user profile

**Given** I access my profile or statistics screen
**When** I view my stats
**Then** I see: Campaigns Completed: [count], Flash Scenarios Completed: [count], Total Playtime: [hours:minutes], optional: Planets Conquered: [count], Battles Won: [count], Fastest Scenario Time: [time]
**And** statistics are displayed in a clear, readable format

**Given** I want to see my achievements
**When** I view the statistics screen
**Then** I see unlocked achievements or milestones (optional future feature): "First Victory", "Tactical Genius (10 scenarios completed)", "Marathon Player (10+ hours playtime)"

---

## Epic 11: Accessible User Interface

**Epic Goal:** Players interact through mouse/keyboard/touch with accessible UI featuring customizable scaling, high contrast mode, keyboard-only navigation, and help overlays.

**FRs Covered:** FR43, FR44, FR45, FR46, FR47, FR48, FR49, FR50

### Story 11.1: Mouse and Keyboard Input Support

As a desktop player,
I want to interact with the game using mouse and keyboard,
So that I can play comfortably on my desktop or laptop computer.

**Acceptance Criteria:**

**Given** I am playing on a desktop browser
**When** I use the mouse
**Then** I can click all interactive UI elements (buttons, planets, units, menu items)
**And** clickable elements have hover states (color change, highlight, tooltip)
**And** mouse cursor changes to pointer on clickable elements
**And** mouse interactions provide feedback within 100ms (NFR-P3)

**Given** I am using the keyboard
**When** I press Tab
**Then** focus cycles through interactive elements in logical order (left-to-right, top-to-bottom)
**And** focused elements display a visible 3px focus indicator (NFR-A1)
**And** focus order makes sense for the current screen

**Given** I am navigating with keyboard
**When** I press Enter or Space on a focused button
**Then** the button is activated (same as mouse click)
**And** the action executes immediately

**Given** I am playing the game
**When** I use common keyboard shortcuts
**Then** the following shortcuts work: Space/Enter = End Turn (Action phase), Escape = Pause Menu, H = Help Overlay, O = Objectives Panel, S = Save Game (Ctrl+S), M = Main Menu
**And** shortcuts do not conflict with browser shortcuts (NFR-U4)

**Given** I press a keyboard shortcut
**When** the shortcut is activated
**Then** I see visual feedback (button highlight, menu opening, etc.)
**And** the action completes within 100ms (NFR-P3)

### Story 11.2: Touch Gesture Support for Mobile

As a mobile player,
I want to interact with the game using touch gestures,
So that I can play comfortably on my phone or tablet.

**Acceptance Criteria:**

**Given** I am playing on a mobile device (phone or tablet)
**When** I tap an interactive element
**Then** the element is activated (same as mouse click)
**And** tap targets are at least 44×44 pixels (NFR-A2)
**And** taps provide haptic feedback (if device supports it)
**And** accidental double-taps are prevented (debounce)

**Given** I am viewing the galaxy map on mobile
**When** I use touch gestures
**Then** I can: single tap = select planet, double tap = open planet details, swipe = pan the map, pinch = zoom in/out
**And** gestures match platform conventions (iOS/Android standards per NFR-U4)

**Given** I am panning the galaxy map
**When** I swipe my finger across the screen
**Then** the map scrolls smoothly in the direction of the swipe
**And** the panning speed matches my finger velocity (natural physics)
**And** the map does not overshoot or bounce unnaturally

**Given** I am zooming the galaxy map
**When** I pinch two fingers together or apart
**Then** the map zooms in or out smoothly
**And** zoom is centered on the pinch midpoint
**And** zoom limits are enforced (min/max zoom levels)

**Given** I am using a tablet in landscape orientation
**When** I interact with the UI
**Then** UI elements are sized appropriately for tablet screen (768×1024 min per NFR-C2)
**And** buttons and text are large enough to read and tap comfortably
**And** the layout adapts to landscape orientation

**Given** I am using a phone in portrait orientation
**When** I play the game
**Then** I see a message: "Landscape orientation recommended for best experience"
**And** the game still functions in portrait mode (not blocked)
**And** UI elements are compacted to fit the narrower screen

### Story 11.3: Galaxy Map Pan and Zoom Controls

As a player,
I want to navigate the galaxy map by panning and zooming,
So that I can explore the entire map and focus on specific areas.

**Acceptance Criteria:**

**Given** I am viewing the galaxy map
**When** the map loads
**Then** the camera is centered on my home planet
**And** I can see all planets (or most planets) in the initial view
**And** zoom level is set to default (100%)

**Given** I want to pan the map (desktop)
**When** I click and drag with the mouse
**Then** the map scrolls in the direction of the drag
**And** the map follows my cursor smoothly (60 FPS desktop per NFR-P1)
**And** panning stops when I release the mouse button

**Given** I want to zoom the map (desktop)
**When** I use the mouse wheel
**Then** scrolling up zooms in, scrolling down zooms out
**And** zoom increments smoothly (5-10% per scroll tick)
**And** zoom is centered on the cursor position
**And** zoom limits prevent extreme zoom (min 50%, max 200% for example)

**Given** I want to pan the map (mobile)
**When** I swipe across the screen
**Then** the map pans as described in Story 11.2 (touch gestures)

**Given** I want to zoom the map (mobile)
**When** I pinch gesture
**Then** the map zooms as described in Story 11.2 (pinch zoom)

**Given** the map is zoomed or panned
**When** I want to reset the view
**Then** I see a "Center on Home" button or "Reset View" button
**And** clicking it resets the camera to the default position and zoom

**Given** I am zoomed in on a specific area
**When** I select a planet outside the visible area
**Then** the camera smoothly pans to center on the selected planet
**And** the zoom level adjusts if necessary to fit the planet in view

### Story 11.4: Keyboard Shortcuts System

As a player,
I want to use keyboard shortcuts for common actions,
So that I can play more efficiently and reduce mouse usage.

**Acceptance Criteria:**

**Given** I am playing the game
**When** I press H
**Then** a help overlay appears showing all available keyboard shortcuts
**And** the overlay displays: Action name, Keyboard shortcut (e.g., "End Turn - Space"), Description
**And** shortcuts are organized by category (Navigation, Actions, Menus, etc.)

**Given** the help overlay is displayed
**When** I press H again or Escape
**Then** the help overlay closes
**And** I return to normal gameplay

**Given** I am in the Action phase
**When** I press Space or Enter
**Then** my turn ends and the game advances to Combat phase
**And** I see the phase transition notification

**Given** I am viewing the galaxy map
**When** I press 1-9 number keys
**Then** I select the planet corresponding to that number (if planets are numbered)
**Or** I cycle through planets in a predefined order

**Given** I am navigating menus
**When** I press Escape
**Then** the current menu or screen closes
**And** I return to the previous screen or pause menu

**Given** I am viewing a planet
**When** I press B
**Then** the building construction menu opens (if planet is owned)

**Given** I want to quick-save
**When** I press Ctrl+S
**Then** the game saves to the most recent save slot (or creates auto-save)
**And** I see a quick notification: "Quick save complete"

**Given** keyboard shortcuts are configurable (optional future feature)
**When** I access settings
**Then** I can rebind shortcuts to custom keys
**And** conflicts are detected and warned

### Story 11.5: UI Scale Customization

As a player,
I want to customize UI scale to 100%, 125%, or 150%,
So that I can adjust the interface size for my screen resolution and vision needs.

**Acceptance Criteria:**

**Given** I access the settings menu
**When** I view display settings
**Then** I see a "UI Scale" option with choices: 100% (Standard), 125% (Large), 150% (Extra Large)
**And** the current selection is highlighted

**Given** I select a different UI scale (e.g., 125%)
**When** I apply the setting
**Then** all UI elements scale by the selected percentage: text size increases by 25%, buttons increase by 25%, icons increase by 25%, HUD elements increase by 25%
**And** the layout adjusts to accommodate larger elements (word wrapping, scrollbars if needed)
**And** the change applies immediately (no restart required)

**Given** I am using 150% UI scale
**When** I view the game
**Then** all text is significantly larger and more readable
**And** UI elements do not overlap or clip off-screen
**And** the game remains playable (all functions accessible)

**Given** I am on a high-resolution display (4K)
**When** I use 100% UI scale
**Then** UI elements are small but sharp and crisp
**And** I have maximum screen space for the galaxy map

**Given** I am on a lower-resolution display (1280×720)
**When** I use 150% UI scale
**Then** UI elements are large enough to read comfortably
**And** some UI elements may scroll or compact to fit
**And** the game remains fully functional

**Given** I change UI scale
**When** I save my settings
**Then** the UI scale preference is saved to my user profile (Epic 10.6)
**And** the scale is applied automatically on next login

### Story 11.6: High Contrast Mode for Accessibility

As a player with visual accessibility needs,
I want to enable high contrast mode with enhanced borders and color schemes,
So that I can distinguish UI elements and text more easily.

**Acceptance Criteria:**

**Given** I access the settings menu
**When** I view accessibility settings
**Then** I see a "High Contrast Mode" toggle (On/Off)
**And** the current state is displayed (default: Off)

**Given** I enable high contrast mode
**When** I toggle the setting to On
**Then** the following changes apply immediately: text color changes to white-on-black or high contrast yellow-on-black, borders thicken to 4px (from default 1-2px), buttons and panels have solid black backgrounds with bright borders, focus indicators become more prominent (yellow or bright cyan), important information uses patterns in addition to color (icons, hatching, etc. per NFR-A2)
**And** the entire UI updates within 100ms

**Given** high contrast mode is enabled
**When** I view the galaxy map
**Then** planets have high-contrast outlines (thick borders)
**And** ownership colors are enhanced (bright green for player, bright red for AI, bright gray for neutral)
**And** selected planets have highly visible highlight (yellow border, pulsing)

**Given** high contrast mode is enabled
**When** I view text
**Then** all text has sufficient contrast ratio (minimum 4.5:1 per WCAG AA standards)
**And** text is rendered with increased weight/boldness for readability

**Given** high contrast mode is enabled
**When** I view resource displays or notifications
**Then** critical information uses both color and patterns/symbols
**And** I can distinguish resource types even if I cannot perceive colors (colorblind-friendly)

**Given** I disable high contrast mode
**When** I toggle the setting to Off
**Then** the UI reverts to standard appearance
**And** all visual changes are reversed immediately

**Given** I change high contrast mode
**When** I save my settings
**Then** the preference is saved to my user profile (Epic 10.6)
**And** the setting is applied automatically on next login

### Story 11.7: Keyboard-Only Navigation Compliance

As a player who prefers or requires keyboard-only interaction,
I want to navigate all game functions using only the keyboard,
So that I can play the game without needing a mouse.

**Acceptance Criteria:**

**Given** I am playing the game
**When** I use only the keyboard (no mouse)
**Then** I can access all game functions: start/load campaigns, access Flash Scenarios, configure settings, navigate menus, play campaigns (select planets, build, commission units, end turn), save/load games, view help, quit game

**Given** I am navigating menus with keyboard
**When** I press Tab
**Then** focus moves to the next interactive element in logical order (NFR-A1 logical tab order)
**And** focus indicators are always visible (3px border per NFR-A1)
**And** I never get "trapped" in a menu (can always Escape or Tab out)

**Given** I am playing a campaign with keyboard only
**When** I press Tab or arrow keys
**Then** I can cycle through planets on the galaxy map
**And** I can press Enter to select a planet
**And** I can press B to open build menu, P to view platoons, N to navigate spacecraft (or other defined shortcuts)

**Given** I am in a dialog or modal with keyboard only
**When** I navigate the dialog
**Then** focus starts on the first interactive element (e.g., first button)
**And** I can Tab through all buttons/inputs
**And** I can press Enter to confirm or Escape to cancel
**And** focus returns to the triggering element when dialog closes

**Given** I need help with keyboard navigation
**When** I press H
**Then** I see the help overlay (Story 11.4) showing all keyboard shortcuts
**And** the shortcuts are discoverable without needing external documentation (NFR-U1)

**Given** the game uses tooltips or hover states
**When** I navigate with keyboard
**Then** tooltips appear when an element gains keyboard focus (not just mouse hover)
**And** screen reader users (future - NFR-A3 Post-MVP) can access tooltip content

### Story 11.8: Help Overlays and Tutorials

As a player learning the game,
I want to view help overlays for keyboard shortcuts and game mechanics,
So that I can quickly reference controls and features without leaving the game.

**Acceptance Criteria:**

**Given** I am playing the game
**When** I press H
**Then** a help overlay appears over the current screen
**And** the overlay shows: keyboard shortcuts section (all shortcuts with descriptions), game mechanics section (brief explanations of turns, resources, combat, etc.), context-sensitive tips (relevant to current screen/phase)

**Given** the help overlay is displayed
**When** I view the content
**Then** I see shortcuts organized by category: Navigation (arrow keys, Tab, etc.), Actions (Space, Enter, B, N, etc.), Menus (Escape, S, M, etc.), Quick Access (H, O, etc.)
**And** each shortcut shows: Icon or key graphic, Action name, Brief description

**Given** I am viewing the help overlay
**When** I want to dismiss it
**Then** I can press H again, Escape, or click outside the overlay
**And** the overlay closes smoothly
**And** I return to gameplay

**Given** I am on a specific screen (e.g., planet management)
**When** I open the help overlay
**Then** I see context-specific help tips: "Building Construction: Select a building type to queue construction. Each building takes multiple turns to complete."
**And** the tips are relevant to my current activity

**Given** I am a new player
**When** I access help for the first time
**Then** I see a prompt: "Press H anytime to view keyboard shortcuts and game help"
**And** this tip appears as a tutorial hint during the first campaign turn

**Given** I want permanent reference
**When** I access the main menu
**Then** I see a "Game Guide" or "Manual" option
**And** clicking it opens a comprehensive help document or external link
**And** the guide covers all game systems in detail (can be PDF, web page, or in-game encyclopedia)

---

## Epic 12: Audio & Atmospheric Immersion

**Epic Goal:** Players experience immersive audio with sound effects for actions, background music, independent volume controls, and browser-compliant audio activation.

**FRs Covered:** FR51, FR52, FR53, FR54, FR55

### Story 12.1: Sound Effects for Game Actions

As a player,
I want to hear sound effects for game actions like combat, construction, and UI interactions,
So that I receive audio feedback that enhances immersion.

**Acceptance Criteria:**

**Given** I am playing the game with audio enabled
**When** I perform an action
**Then** I hear an appropriate sound effect: UI click (button press, menu selection), combat (laser fire, explosions, troop movements), construction (building placement, completion alert), resource collection (income notification chime), spacecraft navigation (engine sounds, arrival beep), turn advancement (phase change sound)

**Given** I click a UI button
**When** the button is pressed
**Then** I hear a short click or beep sound (<0.5 seconds)
**And** the sound plays within 50ms of the click (immediate feedback)
**And** the sound does not overlap or cut off if I click multiple buttons quickly (sound mixing)

**Given** combat occurs during the Combat phase
**When** battle results are displayed
**Then** I hear combat sound effects: weapon fire (lasers, projectiles), explosions (impacts, destruction), victory fanfare (if I win) or defeat sound (if I lose)
**And** combat sounds are layered and mixed appropriately (not overwhelming)

**Given** a building completes construction
**When** the End phase processes and a building finishes
**Then** I hear a construction complete sound (satisfying "ding" or alert)
**And** I see a visual notification synchronized with the audio

**Given** I navigate a spacecraft
**When** a spacecraft arrives at a destination
**Then** I hear an arrival notification sound
**And** the sound draws my attention to the event

**Given** the turn advances
**When** the phase changes (Income → Action → Combat → End)
**Then** I hear a subtle phase transition sound
**And** the sound is distinct for each phase (optional: different tones for different phases)

**Given** I have sound effects muted (SFX volume = 0)
**When** actions occur
**Then** I hear no sound effects
**And** gameplay continues normally (audio is optional, not required)

### Story 12.2: Background Music During Gameplay

As a player,
I want to hear background music during gameplay,
So that I enjoy an immersive and atmospheric gaming experience.

**Acceptance Criteria:**

**Given** I am playing the game with audio enabled
**When** I start a campaign or Flash Scenario
**Then** background music begins playing automatically
**And** the music loops seamlessly (no gaps or abrupt restarts)
**And** the music volume is set to the user's configured Music Volume level

**Given** background music is playing
**When** I navigate between screens (galaxy map, planet management, combat results)
**Then** the music continues playing without interruption
**Or** the music transitions smoothly to a different track appropriate for the screen (implementation choice)

**Given** I am in combat
**When** the Combat phase processes
**Then** the music may shift to a more intense combat track (optional)
**Or** the music continues with increased tempo/volume (implementation choice)
**And** the transition is smooth (crossfade, not jarring cut)

**Given** I achieve victory in a campaign
**When** the victory screen displays
**Then** I hear a triumphant victory theme
**And** the victory music replaces the standard background music

**Given** I experience defeat
**When** the defeat screen displays
**Then** I hear a somber or tense defeat theme
**And** the music matches the emotional tone of the defeat

**Given** I have music muted (Music volume = 0)
**When** gameplay occurs
**Then** I hear no background music
**And** sound effects still play (if SFX volume > 0)

**Given** I leave the game idle (AFK)
**When** no actions occur for an extended period (e.g., 5 minutes)
**Then** the music may fade out or reduce in volume (optional power-saving feature)
**And** the music resumes when I interact with the game again

### Story 12.3: Independent Volume Controls

As a player,
I want to adjust audio volume levels independently for Master, SFX, and Music,
So that I can balance audio to my preferences (e.g., loud SFX, quiet music).

**Acceptance Criteria:**

**Given** I access the settings menu
**When** I view audio settings
**Then** I see three volume sliders: Master Volume (0-100%), SFX Volume (0-100%), Music Volume (0-100%)
**And** each slider has a clear label and current percentage value displayed

**Given** I adjust the Master Volume slider
**When** I move the slider to a new position (e.g., 75%)
**Then** the Master Volume is set to 75%
**And** all audio (SFX + Music) is scaled by 75% (multiplicative: SFX plays at Master × SFX %, Music plays at Master × Music %)
**And** I hear the change immediately (real-time preview)

**Given** I adjust the SFX Volume slider
**When** I move the slider
**Then** the SFX Volume is updated
**And** I hear a test sound effect at the new volume level (preview)
**And** future sound effects play at the new volume

**Given** I adjust the Music Volume slider
**When** I move the slider
**Then** the Music Volume is updated immediately
**And** the background music volume changes in real-time as I drag the slider
**And** no music restart is required

**Given** I set Master Volume to 0%
**When** I play the game
**Then** all audio is muted (SFX and Music are both silent)
**And** I see a "Muted" indicator in the audio settings

**Given** I set SFX Volume to 100% and Music Volume to 25%
**When** I play the game
**Then** sound effects are loud and clear
**And** background music is quiet (25% volume)
**And** I can hear important gameplay sounds without music overpowering them

**Given** I adjust volume settings
**When** I save my settings
**Then** the volume preferences are saved to my user profile (Epic 10.6)
**And** the volumes are applied automatically on next login

### Story 12.4: Mute Audio Toggle

As a player,
I want to mute audio entirely with a single toggle,
So that I can quickly silence the game in noise-sensitive environments.

**Acceptance Criteria:**

**Given** I am playing the game with audio enabled
**When** I access the audio settings
**Then** I see a "Mute All Audio" toggle or checkbox
**And** the current state is displayed (default: Off/Unmuted)

**Given** I enable the mute toggle
**When** I toggle "Mute All Audio" to On
**Then** all audio is immediately silenced (SFX and Music stop playing)
**And** volume sliders are disabled or grayed out (cannot adjust while muted)
**And** I see a "Muted" indicator icon in the UI (e.g., speaker with X icon)

**Given** audio is muted
**When** I play the game
**Then** no sounds play (SFX, Music, or any other audio)
**And** gameplay functions normally (audio is optional)

**Given** audio is muted
**When** I disable the mute toggle (toggle to Off)
**Then** audio is immediately re-enabled
**And** SFX and Music resume playing at the previously configured volume levels
**And** the "Muted" indicator disappears

**Given** I want quick access to mute
**When** I press a keyboard shortcut (e.g., M key)
**Then** audio is toggled On/Off instantly
**And** I see a brief notification: "Audio Muted" or "Audio Unmuted"

**Given** I mute audio
**When** I save my settings
**Then** the mute state is saved to my user profile (Epic 10.6)
**And** if I log in later, audio is still muted (preference persists)

### Story 12.5: User Activation for Browser Audio Compliance

As a player,
I want the game to request user activation before enabling audio,
So that the game complies with browser security policies requiring user interaction before auto-playing audio.

**Acceptance Criteria:**

**Given** I load the game for the first time in a browser
**When** the game initializes
**Then** audio does NOT start playing automatically (browser security requirement per NFR-S)
**And** I see a prompt overlay: "Click anywhere or press any key to enable audio"
**And** gameplay is not blocked (I can play without activating audio)

**Given** I see the audio activation prompt
**When** I click anywhere on the screen or press any key
**Then** the prompt is dismissed
**And** audio is enabled (SFX and Music can now play)
**And** background music starts playing (if Music Volume > 0)
**And** the audio context is activated (browser AudioContext unlocked)

**Given** I have previously activated audio in a past session
**When** I load the game again in the same browser
**Then** I may still see the activation prompt (browser policy varies)
**Or** audio is automatically enabled if the browser allows it (implementation note: behavior varies by browser and user settings)

**Given** I dismiss the audio activation prompt without clicking
**When** I continue playing
**Then** I can still enable audio later by clicking "Enable Audio" in settings
**And** the game remains playable without audio

**Given** I am using a browser with strict autoplay policies (e.g., mobile Safari)
**When** I load the game
**Then** the audio activation prompt appears
**And** I must interact with the page before any audio can play (browser enforced)

**Given** audio activation fails (rare edge case: browser blocks audio entirely)
**When** the activation is attempted
**Then** I see a warning: "Audio could not be enabled. Check browser permissions."
**And** the game continues without audio
**And** I can manually enable audio in browser settings and retry
