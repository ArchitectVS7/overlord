# Work Breakdown Structure (WBS)

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Draft
**Project:** Overlord v1.0
**Total Work Packages:** 113 tasks
**Total Estimated Hours:** 1,680 hours

---

## Overview

This Work Breakdown Structure (WBS) decomposes the Overlord project into hierarchical work packages. Each task is assigned a unique WBS ID and estimated hours.

**WBS Levels:**
- **Level 1:** Phases (1.0, 2.0, 3.0...)
- **Level 2:** Sprints (1.1, 1.2, 1.3...)
- **Level 3:** Tasks (1.1.1, 1.1.2, 1.1.3...)

**Hour Estimation Key:**
- S (Small): 4-8 hours
- M (Medium): 8-16 hours
- L (Large): 16-32 hours
- XL (Extra Large): 32-40 hours

---

## 1.0 Phase 1: Foundation + Tech Stack Alignment (200h)

### 1.1 Sprint 1: Dual-Library Architecture (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-1.1.1 | Upgrade Unity project to Unity 6000 LTS | 16 | M | - |
| WBS-1.1.2 | Set up Universal Render Pipeline (URP 17.3.0+) | 8 | S | - |
| WBS-1.1.3 | Create Overlord.Core .NET 8.0 class library | 12 | M | - |
| WBS-1.1.4 | Create Overlord.Core.Tests xUnit project | 8 | S | - |
| WBS-1.1.5 | Define core interfaces (IGameSettings, IRenderer, etc.) | 12 | M | - |
| WBS-1.1.6 | Implement GameState model in Overlord.Core | 16 | M | AFS-001 |
| WBS-1.1.7 | Set up GitHub Actions CI/CD | 8 | S | - |

**Subtotal:** 80h

### 1.2 Sprint 2: Turn and Save Systems (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-1.2.1 | Implement TurnSystem in Overlord.Core | 20 | L | AFS-002 |
| WBS-1.2.2 | Implement SaveSystem with System.Text.Json | 24 | L | AFS-003 |
| WBS-1.2.3 | Write unit tests for TurnSystem and SaveSystem | 16 | M | - |
| WBS-1.2.4 | Implement Unity SaveManager wrapper | 12 | M | - |
| WBS-1.2.5 | Basic debug UI for testing turn system | 8 | S | - |

**Subtotal:** 80h

### 1.3 Sprint 3: Settings, Input, Galaxy View (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-1.3.1 | Implement SettingsManager | 16 | M | AFS-004 |
| WBS-1.3.2 | Implement InputSystem with Unity New Input System | 12 | M | AFS-005 |
| WBS-1.3.3 | Create basic 3D Galaxy View | 28 | L | AFS-013 |
| WBS-1.3.4 | Unit tests for SettingsManager | 16 | M | - |
| WBS-1.3.5 | Integration testing (save → load → turn) | 8 | S | - |

**Subtotal:** 80h

**Phase 1 Total:** 240h

---

## 2.0 Phase 2: Galaxy & Economy (160h)

### 2.1 Sprint 4: Galaxy and Planets (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-2.1.1 | Implement GalaxyGenerator | 20 | L | AFS-011 |
| WBS-2.1.2 | Implement PlanetSystem | 24 | L | AFS-012 |
| WBS-2.1.3 | Implement NavigationSystem | 16 | M | AFS-014 |
| WBS-2.1.4 | Unit tests for Galaxy and Planet systems | 12 | M | - |
| WBS-2.1.5 | Galaxy View integration (render planets) | 8 | S | - |

**Subtotal:** 80h

### 2.2 Sprint 5: Economy Systems (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-2.2.1 | Implement ResourceSystem | 20 | L | AFS-021 |
| WBS-2.2.2 | Implement IncomeSystem | 20 | L | AFS-022 |
| WBS-2.2.3 | Implement PopulationSystem | 16 | M | AFS-023 |
| WBS-2.2.4 | Implement TaxationSystem | 16 | M | AFS-024 |
| WBS-2.2.5 | Unit tests for economy systems | 8 | S | - |

**Subtotal:** 80h

**Phase 2 Total:** 160h

---

## 3.0 Phase 3: Entities & Buildings (160h)

### 3.1 Sprint 6: Entities and Craft (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-3.1.1 | Implement EntitySystem | 16 | M | AFS-031 |
| WBS-3.1.2 | Implement CraftSystem | 28 | L | AFS-032 |
| WBS-3.1.3 | 3D models for craft (placeholder) | 16 | M | - |
| WBS-3.1.4 | Craft rendering in Galaxy View | 12 | M | - |
| WBS-3.1.5 | Unit tests for EntitySystem and CraftSystem | 8 | S | - |

**Subtotal:** 80h

### 3.2 Sprint 7: Platoons and Buildings (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-3.2.1 | Implement PlatoonSystem | 20 | L | AFS-033 |
| WBS-3.2.2 | Implement BuildingSystem | 28 | L | AFS-061 |
| WBS-3.2.3 | Implement UpgradeSystem | 12 | M | AFS-062 |
| WBS-3.2.4 | Implement DefenseStructures | 12 | M | AFS-063 |
| WBS-3.2.5 | Unit tests for Buildings and Platoons | 8 | S | - |

**Subtotal:** 80h

**Phase 3 Total:** 160h

---

## 4.0 Phase 4: Combat Systems (160h)

### 4.1 Sprint 8: Combat Resolution (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-4.1.1 | Implement CombatSystem (ground combat) | 28 | L | AFS-041 |
| WBS-4.1.2 | Implement SpaceCombat | 28 | L | AFS-042 |
| WBS-4.1.3 | Combat math balancing and tuning | 16 | M | - |
| WBS-4.1.4 | Unit tests for combat systems | 8 | S | - |

**Subtotal:** 80h

### 4.2 Sprint 9: Bombardment and Invasion (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-4.2.1 | Implement BombardmentSystem | 24 | L | AFS-043 |
| WBS-4.2.2 | Implement InvasionSystem | 28 | L | AFS-044 |
| WBS-4.2.3 | Combat VFX (placeholder) | 16 | M | - |
| WBS-4.2.4 | Unit tests for bombardment and invasion | 12 | M | - |

**Subtotal:** 80h

**Phase 4 Total:** 160h

---

## 5.0 Phase 5: AI & Difficulty (80h)

### 5.1 Sprint 10: AI Systems (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-5.1.1 | Implement AIDecisionSystem (with 4 personalities) | 40 | XL | AFS-051 |
| WBS-5.1.2 | Implement AIDifficultySystem | 16 | M | AFS-052 |
| WBS-5.1.3 | AI turn execution integration | 16 | M | - |
| WBS-5.1.4 | Unit tests for AI systems | 8 | S | - |

**Subtotal:** 80h

**Phase 5 Total:** 80h

---

## 6.0 Phase 6: UI & UX (240h)

### 6.1 Sprint 11: UI State and HUD (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-6.1.1 | Implement UIStateMachine | 24 | L | AFS-071 |
| WBS-6.1.2 | Implement HUDSystem | 28 | L | AFS-072 |
| WBS-6.1.3 | UI art assets (buttons, panels, icons) | 16 | M | - |
| WBS-6.1.4 | UI layout and responsive design | 12 | M | - |

**Subtotal:** 80h

### 6.2 Sprint 12: Planet UI and Notifications (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-6.2.1 | Implement PlanetManagementUI | 32 | XL | AFS-073 |
| WBS-6.2.2 | Implement NotificationSystem | 20 | L | AFS-074 |
| WBS-6.2.3 | UI polish and animations | 16 | M | - |
| WBS-6.2.4 | Integration testing (UI → Core) | 12 | M | - |

**Subtotal:** 80h

### 6.3 Sprint 13: Tutorial System (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-6.3.1 | Implement TutorialSystem | 24 | L | AFS-075 |
| WBS-6.3.2 | Implement tooltip system | 20 | L | - |
| WBS-6.3.3 | Implement help system | 16 | M | - |
| WBS-6.3.4 | Progressive hints system | 12 | M | - |
| WBS-6.3.5 | Tutorial testing and refinement | 8 | S | - |

**Subtotal:** 80h

**Phase 6 Total:** 240h

---

## 7.0 Phase 7: Audio & Visual Polish (160h)

### 7.1 Sprint 14: Audio System (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-7.1.1 | Implement AudioSystem | 24 | L | AFS-081 |
| WBS-7.1.2 | Music tracks (5 total) | 16 | M | - |
| WBS-7.1.3 | Sound effects (10+ SFX) | 16 | M | - |
| WBS-7.1.4 | Audio integration and mixing | 16 | M | - |
| WBS-7.1.5 | Audio testing (PC and mobile) | 8 | S | - |

**Subtotal:** 80h

### 7.2 Sprint 15: Visual Effects (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-7.2.1 | Implement VFXSystem (6 particle effects + URP post-processing) | 32 | XL | AFS-082 |
| WBS-7.2.2 | Ship animations | 16 | M | - |
| WBS-7.2.3 | UI animations | 16 | M | - |
| WBS-7.2.4 | VFX optimization (particle pooling) | 8 | S | - |
| WBS-7.2.5 | VFX testing (PC and mobile) | 8 | S | - |

**Subtotal:** 80h

**Phase 7 Total:** 160h

---

## 8.0 Phase 8: Platform Support (240h)

### 8.1 Sprint 16: PC Platform (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-8.1.1 | PC platform optimization (Windows, Mac, Linux) | 24 | L | AFS-091 |
| WBS-8.1.2 | Resolution and display mode support | 16 | M | - |
| WBS-8.1.3 | Keyboard shortcuts and hotkeys | 16 | M | - |
| WBS-8.1.4 | PC performance profiling | 16 | M | - |
| WBS-8.1.5 | PC build testing (3 platforms) | 8 | S | - |

**Subtotal:** 80h

### 8.2 Sprint 17: Mobile Platform (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-8.2.1 | Mobile platform optimization (iOS, Android) | 28 | L | AFS-091 |
| WBS-8.2.2 | Touch input implementation | 20 | L | - |
| WBS-8.2.3 | Mobile performance optimization | 16 | M | - |
| WBS-8.2.4 | Mobile device testing | 8 | S | - |
| WBS-8.2.5 | Cloud save integration (iCloud, Google Play) | 8 | S | - |

**Subtotal:** 80h

### 8.3 Sprint 18: Steam and PC Polish (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-8.3.1 | Steam integration (SDK, Cloud, Achievements) | 24 | L | - |
| WBS-8.3.2 | PC-specific features (controller, rich presence) | 16 | M | - |
| WBS-8.3.3 | Build automation (Unity Cloud Build) | 16 | M | - |
| WBS-8.3.4 | PC platform testing and bug fixes | 16 | M | - |
| WBS-8.3.5 | Create store page assets | 8 | S | - |

**Subtotal:** 80h

**Phase 8 Total:** 240h

---

## 9.0 Phase 9: Testing & Bug Fixing (160h)

### 9.1 Sprint 19: Comprehensive Testing (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-9.1.1 | Create test plan and test cases (100+) | 24 | L | All |
| WBS-9.1.2 | Execute test plan (PC, Mobile) | 24 | L | All |
| WBS-9.1.3 | Fix critical bugs | 24 | L | - |
| WBS-9.1.4 | Performance profiling | 8 | S | - |

**Subtotal:** 80h

### 9.2 Sprint 20: Balance and Playtesting (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-9.2.1 | Internal playtesting sessions | 24 | L | All |
| WBS-9.2.2 | Balance tuning | 24 | L | - |
| WBS-9.2.3 | External playtesting | 16 | M | - |
| WBS-9.2.4 | Fix high-priority bugs from playtesting | 16 | M | - |

**Subtotal:** 80h

**Phase 9 Total:** 160h

---

## 10.0 Phase 10: Release Preparation (80h)

### 10.1 Sprint 21: Release and Launch (80h)

| WBS ID | Task | Hours | Size | AFS |
|--------|------|-------|------|-----|
| WBS-10.1.1 | Final release builds (v1.0.0) | 16 | M | All |
| WBS-10.1.2 | Store page setup (Steam, App Store, Google Play) | 16 | M | - |
| WBS-10.1.3 | Marketing materials (trailer, screenshots, press kit) | 16 | M | - |
| WBS-10.1.4 | Documentation (manual, FAQ, patch notes) | 16 | M | - |
| WBS-10.1.5 | Pre-launch testing | 8 | S | - |
| WBS-10.1.6 | Launch day coordination | 8 | S | - |

**Subtotal:** 80h

**Phase 10 Total:** 80h

---

## WBS Summary

| Phase | Description | Sprints | Tasks | Hours | % of Total |
|-------|-------------|---------|-------|-------|------------|
| 1 | Foundation + Tech Stack Alignment | 3 | 17 | 240 | 14.3% |
| 2 | Galaxy & Economy | 2 | 10 | 160 | 9.5% |
| 3 | Entities & Buildings | 2 | 10 | 160 | 9.5% |
| 4 | Combat Systems | 2 | 8 | 160 | 9.5% |
| 5 | AI & Difficulty | 1 | 4 | 80 | 4.8% |
| 6 | UI & UX | 3 | 13 | 240 | 14.3% |
| 7 | Audio & Visual Polish | 2 | 10 | 160 | 9.5% |
| 8 | Platform Support | 3 | 15 | 240 | 14.3% |
| 9 | Testing & Bug Fixing | 2 | 8 | 160 | 9.5% |
| 10 | Release Preparation | 1 | 6 | 80 | 4.8% |

**Total:** 21 sprints, 113 tasks, 1,680 hours

---

## Task Distribution by Size

| Size | Count | Total Hours | Percentage |
|------|-------|-------------|------------|
| S (4-8h) | 27 | 216 | 12.9% |
| M (8-16h) | 48 | 720 | 42.9% |
| L (16-32h) | 34 | 748 | 44.5% |
| XL (32-40h) | 4 | 112 | 6.7% |

**Total:** 113 tasks, 1,680 hours

---

## AFS Coverage

| AFS ID | Title | WBS Tasks | Total Hours |
|--------|-------|-----------|-------------|
| AFS-001 | Game State Manager | WBS-1.1.6 | 16 |
| AFS-002 | Turn System | WBS-1.2.1 | 20 |
| AFS-003 | Save/Load System | WBS-1.2.2 | 24 |
| AFS-004 | Settings Manager | WBS-1.3.1 | 16 |
| AFS-005 | Input System | WBS-1.3.2 | 12 |
| AFS-011 | Galaxy Generation | WBS-2.1.1 | 20 |
| AFS-012 | Planet System | WBS-2.1.2 | 24 |
| AFS-013 | Galaxy View | WBS-1.3.3 | 28 |
| AFS-014 | Navigation System | WBS-2.1.3 | 16 |
| AFS-021 | Resource System | WBS-2.2.1 | 20 |
| AFS-022 | Income/Production | WBS-2.2.2 | 20 |
| AFS-023 | Population System | WBS-2.2.3 | 16 |
| AFS-024 | Taxation System | WBS-2.2.4 | 16 |
| AFS-031 | Entity System | WBS-3.1.1 | 16 |
| AFS-032 | Craft System | WBS-3.1.2 | 28 |
| AFS-033 | Platoon System | WBS-3.2.1 | 20 |
| AFS-041 | Combat System | WBS-4.1.1 | 28 |
| AFS-042 | Space Combat | WBS-4.1.2 | 28 |
| AFS-043 | Bombardment System | WBS-4.2.1 | 24 |
| AFS-044 | Invasion System | WBS-4.2.2 | 28 |
| AFS-051 | AI Decision System | WBS-5.1.1 | 40 |
| AFS-052 | AI Difficulty | WBS-5.1.2 | 16 |
| AFS-061 | Building System | WBS-3.2.2 | 28 |
| AFS-062 | Upgrade System | WBS-3.2.3 | 12 |
| AFS-063 | Defense Structures | WBS-3.2.4 | 12 |
| AFS-071 | UI State Machine | WBS-6.1.1 | 24 |
| AFS-072 | HUD System | WBS-6.1.2 | 28 |
| AFS-073 | Planet Management UI | WBS-6.2.1 | 32 |
| AFS-074 | Notification System | WBS-6.2.2 | 20 |
| AFS-075 | Tutorial System | WBS-6.3.1 | 24 |
| AFS-081 | Audio System | WBS-7.1.1 | 24 |
| AFS-082 | Visual Effects | WBS-7.2.1 | 32 |
| AFS-091 | Platform Support | WBS-8.1.1, WBS-8.2.1 | 52 |

**Total AFS Documents:** 33
**Total Direct AFS Hours:** 816 hours (48.6% of project)
**Indirect Support Hours:** 864 hours (testing, art, polish, integration)

---

**Document Owner:** Lead Developer
**Review Status:** Draft
