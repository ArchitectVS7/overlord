# Implementation Plan

**Version:** 1.1
**Last Updated:** December 6, 2025
**Status:** Approved (Post Design Review)
**Target:** Unity 6000 LTS | C# .NET 8.0 | URP | Cross-Platform

---

## Overview

This implementation plan outlines the development roadmap for Overlord, a Unity-based turn-based 4X strategy game. The plan follows an incremental delivery approach, prioritizing core gameplay mechanics first, then expanding with polish and platform support.

---

## Development Phases

### Phase 1: Foundation + Tech Stack Alignment (Weeks 1-5)

**Goal:** Establish core infrastructure, dual-library architecture, and basic gameplay loop

**NEW: Tech Stack Alignment Tasks (Week 1):**
- Day 1: Upgrade Unity project to Unity 6000 LTS
- Day 1: Set up Universal Render Pipeline (URP 17.3.0+)
- Day 2-3: Create Overlord.Core .NET 8.0 class library
- Day 3: Create Overlord.Core.Tests xUnit test project
- Day 4-5: Move GameState logic to Overlord.Core (interface-based design)
- Day 5: Set up GitHub Actions CI/CD for automated testing

**Milestones:**
- Unity 6000 LTS project with URP pipeline
- Dual-library architecture (Overlord.Core + Unity presentation layer)
- Core systems operational (Game State, Turn, Save/Load with System.Text.Json)
- Testing framework with 70% coverage target
- Basic 3D Galaxy View rendering with URP shaders
- Placeholder art assets

**Deliverables:**
- ✅ AFS-001: Game State Manager (in Overlord.Core)
- ✅ AFS-002: Turn System (in Overlord.Core)
- ✅ AFS-003: Save/Load System (using System.Text.Json with checksum validation)
- ✅ AFS-004: Settings Manager
- ✅ AFS-005: Input System (Unity New Input System)
- ✅ AFS-013: Galaxy View (URP shaders, 3D scene)
- ✅ NEW: Overlord.Core library with interfaces (IGameSettings, IRenderer, etc.)
- ✅ NEW: Overlord.Core.Tests with 70%+ test coverage
- ✅ NEW: URP render pipeline configured

**Acceptance Test:**
- Can start new game, advance turns, save/load game
- Galaxy View displays planets in 3D space with URP shaders
- Settings persist across sessions
- Save files use System.Text.Json format with checksum validation
- Core systems have 70%+ unit test coverage (fast xUnit tests)
- All tests pass in GitHub Actions CI/CD
- Project runs on Unity 6000 LTS

---

### Phase 2: Galaxy & Economy (Weeks 5-8)

**Goal:** Implement galaxy generation, planet management, and resource economy

**Milestones:**
- Procedural galaxy generation (4-6 planets)
- Planet system with production multipliers
- Resource management (Credits, Minerals, Fuel, Food, Energy)
- Basic income/production calculations

**Deliverables:**
- ✅ AFS-011: Galaxy Generation
- ✅ AFS-012: Planet System
- ✅ AFS-014: Navigation System
- ✅ AFS-021: Resource System
- ✅ AFS-022: Income/Production System
- ✅ AFS-023: Population System
- ✅ AFS-024: Taxation System

**Acceptance Test:**
- Galaxy generates with unique planets
- Resources produce and consume each turn
- Population grows based on food availability
- Tax rate affects income and morale

---

### Phase 3: Entities & Buildings (Weeks 9-12)

**Goal:** Implement craft, platoons, and building construction

**Milestones:**
- Craft system (Battle Cruiser, Cargo, Solar Satellite)
- Platoon system (training, equipment, weapons)
- Building construction (Docking Bays, Mining Stations, etc.)
- Entity limits enforced (32 craft, 24 platoons)

**Deliverables:**
- ✅ AFS-031: Entity System
- ✅ AFS-032: Craft System
- ✅ AFS-033: Platoon System
- ✅ AFS-061: Building System
- ✅ AFS-062: Upgrade System
- ✅ AFS-063: Defense Structures

**Acceptance Test:**
- Can purchase and manage craft
- Can commission and train platoons
- Can build structures with turn-based timers
- Weapon upgrades apply to all Battle Cruisers

---

### Phase 4: Combat Systems (Weeks 13-16)

**Goal:** Implement ground combat, space battles, and invasions

**Milestones:**
- Ground combat resolution (platoon vs platoon)
- Space combat (fleet vs fleet)
- Planetary bombardment
- Planetary invasion mechanics

**Deliverables:**
- ✅ AFS-041: Combat System
- ✅ AFS-042: Space Combat
- ✅ AFS-043: Bombardment System
- ✅ AFS-044: Invasion System

**Acceptance Test:**
- Space battles resolve correctly (strength-based)
- Ground combat applies equipment/weapon modifiers
- Bombardment destroys structures
- Invasions transfer planet ownership

---

### Phase 5: AI & Difficulty (Weeks 17-20)

**Goal:** Implement AI opponent with decision-making and difficulty levels

**Milestones:**
- AI decision tree (defend, build, attack, expand)
- Difficulty modifiers (Easy, Normal, Hard)
- AI executes full turn (income, actions, combat)
- AI strategic behavior (threat assessment, priority targets)

**Deliverables:**
- ✅ AFS-051: AI Decision System
- ✅ AFS-052: AI Difficulty System

**Acceptance Test:**
- AI completes turns autonomously
- AI builds economy and military
- AI attacks when advantageous
- Difficulty levels provide appropriate challenge

---

### Phase 6: UI & UX (Weeks 21-24)

**Goal:** Polish user interface, notifications, tutorial system, and player experience

**Milestones:**
- UI state machine (screen navigation)
- HUD system (resource display, turn info)
- Planet management UI (building panels, garrison)
- Notification system (toasts, modals, alerts)
- **NEW: Tutorial system** (onboarding for new players)

**Deliverables:**
- ✅ AFS-071: UI State Machine
- ✅ AFS-072: HUD System
- ✅ AFS-073: Planet Management UI
- ✅ AFS-074: Notification System
- ✅ **NEW: AFS-075: Tutorial System** (tooltips, guided tours, first-time experience)

**Acceptance Test:**
- UI navigation smooth and intuitive
- HUD displays accurate real-time data
- Planet management UI functional
- Notifications inform player of events
- **NEW: Tutorial guides new players through first 5 turns**
- **NEW: Tooltips explain key mechanics**

---

### Phase 7: Audio & Visual Polish (Weeks 25-28)

**Goal:** Add audio, visual effects, and animations

**Milestones:**
- Music system (Main Menu, Galaxy, Combat, Victory/Defeat)
- Sound effects (UI clicks, construction, combat)
- Visual effects (explosions, lasers, particle systems)
- Animations (ship movement, UI transitions)

**Deliverables:**
- ✅ AFS-081: Audio System
- ✅ AFS-082: Visual Effects System

**Acceptance Test:**
- Music transitions smoothly between states
- SFX play on UI interactions and combat
- VFX enhance combat and environmental feedback
- Animations run at 60 FPS

---

### Phase 8: Platform Support (Weeks 29-32)

**Goal:** Optimize for PC and Mobile platforms

**Milestones:**
- PC build (Windows, Mac, Linux)
- Mobile build (iOS, Android)
- Platform-specific input handling
- Performance optimization (30 FPS mobile, 60 FPS PC)

**Deliverables:**
- ✅ AFS-091: Platform Support

**Acceptance Test:**
- Game runs on Windows, Mac, Linux
- Mobile version optimized for touch input
- Performance targets met on all platforms
- Cloud saves functional (Steam, iCloud, Google Play)

---

### Phase 9: Testing & Bug Fixing (Weeks 33-36)

**Goal:** Comprehensive testing, bug fixing, and balance tuning

**Milestones:**
- Playtesting sessions (internal and external)
- Bug tracking and resolution
- Balance tuning (costs, combat, AI difficulty)
- Performance profiling and optimization

**Deliverables:**
- Bug database (Jira, GitHub Issues)
- Test plan with 100+ test cases
- Performance report (FPS, memory, load times)
- Balance spreadsheet (costs, modifiers, timings)

**Acceptance Test:**
- No critical bugs (crashes, save corruption)
- Game balanced for 40-60 turn playtime
- Performance targets met consistently
- All acceptance criteria passed

---

### Phase 10: Release Preparation (Weeks 37-40)

**Goal:** Finalize builds, marketing materials, and launch

**Milestones:**
- Final builds for all platforms
- Store page setup (Steam, App Store, Google Play)
- Marketing assets (trailers, screenshots, press kit)
- Documentation (manual, FAQ, patch notes)

**Deliverables:**
- Release build (v1.0.0)
- Store listings approved
- Launch trailer (2 minutes)
- Player manual (PDF)

**Acceptance Test:**
- Builds certified by platform holders
- Store pages live and discoverable
- Marketing materials distributed
- Community channels active (Discord, Reddit)

---

## Development Team Structure

### Recommended Team

**Core Team (4-6 people):**
- **1× Lead Developer/Architect**: System design, core gameplay
- **1× Gameplay Engineer**: Combat, AI, balance
- **1× UI/UX Engineer**: Interface, user experience
- **1× 3D Artist**: Models, textures, VFX
- **1× Audio Designer**: Music, SFX
- **1× QA/Tester**: Testing, bug tracking (part-time)

**Optional (Post-MVP):**
- **1× Narrative Designer**: Story, lore, flavor text
- **1× Marketing Manager**: Community, PR, social media

---

## Technology Stack

**Engine:**
- Unity 6000 LTS (C# / .NET 8.0)
- Universal Render Pipeline (URP) 17.3.0+
- Unity New Input System 1.16.0+

**Architecture:**
- **Dual-Library Pattern** (aligned with company warzones project)
  - **Overlord.Core:** .NET 8.0 class library (platform-agnostic game logic)
  - **Unity Project:** Presentation layer (rendering, input, UI)
  - Interface-based design (IGameSettings, IRenderer, IInputProvider)

**Serialization:**
- System.Text.Json 8.0.5+ (with checksum validation, versioned save format)

**Testing:**
- **xUnit** 2.6.6+ for Overlord.Core (fast, no Unity editor required)
- **Unity Test Framework** 1.6.0+ for Unity-specific code
- Target: 70% code coverage for core systems
- GitHub Actions CI/CD for automated test execution

**Version Control:**
- Git + GitHub
- Feature branch workflow
- Pull request reviews required

**CI/CD:**
- GitHub Actions (primary)
  - Automated unit tests on commit
  - Build validation
  - Code coverage reports
- Unity Cloud Build (optional, for platform builds)

**Project Management:**
- GitHub Projects or Jira
- Weekly sprint planning
- Daily standups

**Communication:**
- Discord, Slack

**Asset Management:**
- Unity Asset Store
- Blender (3D modeling)
- Aseprite (pixel art, if needed)

---

## Risk Management

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance issues on mobile | High | Early mobile testing, LOD system, quality presets |
| Save file corruption | Critical | Versioned save format, backup system, extensive testing |
| AI too weak/strong | Medium | Iterative tuning, difficulty presets, playtesting |
| Cross-platform input bugs | Medium | Input abstraction layer, device testing |

### Schedule Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Strict MVP definition, post-MVP backlog |
| Team turnover | Medium | Documentation, code reviews, knowledge sharing |
| Platform certification delays | Medium | Submit early, buffer time in schedule |

---

## Success Metrics

**MVP (v1.0) Goals:**
- ✅ Complete single-player campaign (player vs AI)
- ✅ 40-60 turn average playtime
- ✅ 60 FPS on PC (GTX 1060), 30 FPS on mobile (iPhone 8)
- ✅ <5 critical bugs at launch
- ✅ Positive user reviews (>70% on Steam)

**Post-MVP (v1.1+) Goals:**
- Multiplayer support (hot-seat, online)
- Additional planet types and building variants
- Campaign mode with story missions
- Modding support (custom scenarios, maps)

---

## Deferred Features (Post-Prototype Playtesting)

The following features have been **deferred** until after initial prototype playtesting, per design review decisions. These features will be evaluated based on playtesting feedback and may be integrated into post-MVP releases:

### Story & Narrative Elements (DEFERRED)
**Status:** Stub/scaffold only in MVP
**Rationale:** Game engine and core playability take priority. Narrative elements add flavor but are not critical to core 4X gameplay loop.
**Planned Approach:**
- MVP: Minimal story scaffolding
  - Generic planet names (Volcanic, Desert, Tropical, Metropolis)
  - Basic AI opponent identification (AI Player 1, AI Player 2)
  - No backstory, lore, or campaign narrative
- Post-Playtesting: Evaluate player feedback on interest in narrative
  - Add flavor text for planets (descriptions, historical notes)
  - Create AI opponent profiles (names, portraits, personality descriptions)
  - Opening text crawl explaining conflict
  - Victory/defeat narrative closure
  - Consider campaign mode with story missions

**Implementation Trigger:** Positive playtesting feedback on core gameplay + player requests for more narrative context
**Owner:** Narrative Designer (or Lead Developer if no dedicated narrative role)
**Estimated Effort:** 2-3 weeks (post-MVP)

### Undo/Redo System (DEFERRED)
**Status:** Not included in MVP
**Rationale:** Turn-based games benefit from undo/redo (prevents mis-click frustration), but core gameplay must be solid first. Evaluate during playtesting whether players request this feature.
**Planned Approach:**
- MVP: No undo/redo (actions are final)
- Playtesting: Note player feedback on mis-click frustration
- Post-Playtesting: If players report significant frustration with accidental actions, implement undo/redo
  - Implement command pattern for reversible actions
  - Add "Undo Last Action" button to UI
  - Limit to 1-3 undo steps (not full history)

**Implementation Trigger:** Player feedback indicates mis-click frustration during playtesting
**Owner:** Gameplay Engineer
**Estimated Effort:** 1 week (if needed)
**AFS Document:** Would extend AFS-002 (Turn System) or AFS-005 (Input System)

**Note:** Comment preserved in design-review-notes.md for future reference.

---

## Milestone Timeline

```
Week 1-5:   Phase 1 - Foundation + Tech Stack Alignment (UPDATED: +1 week for dual-library setup)
Week 6-9:   Phase 2 - Galaxy & Economy
Week 10-13: Phase 3 - Entities & Buildings
Week 14-17: Phase 4 - Combat Systems
Week 18-21: Phase 5 - AI & Difficulty
Week 22-25: Phase 6 - UI & UX (includes Tutorial System)
Week 26-29: Phase 7 - Audio & Visual Polish
Week 30-33: Phase 8 - Platform Support
Week 34-37: Phase 9 - Testing & Bug Fixing
Week 38-41: Phase 10 - Release Preparation

TOTAL: 41 weeks (~9.5 months)

CHANGE NOTES:
- Phase 1 extended by 1 week for tech stack alignment (Unity 6000, dual-library, URP, testing)
- All subsequent phases shifted by 1 week
- Total timeline increased by 1 week (acceptable trade-off for long-term maintainability)
```

---

**Document Owner:** Lead Developer
**Review Status:** Approved
**Next Review:** After Phase 1 Completion
