# UX Flow & Responsibility Audit

**Audit Date:** 2025-12-22
**Auditor:** Claude (UX Flow & Responsibility Auditor)
**Codebase:** Overlord 4X Strategy Game

---

## 1. Screen Enumeration

### Primary Interface Path (BBS Mode - DEFAULT)

| Screen | File | Scene Key |
|--------|------|-----------|
| Boot | `BootScene.ts` | `BootScene` |
| Authentication | `AuthScene.ts` | `AuthScene` |
| **BBS Game (Main)** | `BBSGameScene.ts` | `BBSGameScene` |

### Secondary Interface Path (Graphical Mode)

| Screen | File | Scene Key |
|--------|------|-----------|
| Main Menu | `MainMenuScene.ts` | `MainMenuScene` |
| Campaign Config | `CampaignConfigScene.ts` | `CampaignConfigScene` |
| Galaxy Map (Game) | `GalaxyMapScene.ts` | `GalaxyMapScene` |
| How to Play | `HowToPlayScene.ts` | `HowToPlayScene` |
| Tutorials | `TutorialsScene.ts` | `TutorialsScene` |
| Flash Conflicts | `FlashConflictsScene.ts` | `FlashConflictsScene` |
| Scenario Game | `ScenarioGameScene.ts` | `ScenarioGameScene` |
| Victory | `VictoryScene.ts` | `VictoryScene` |
| Defeat | `DefeatScene.ts` | `DefeatScene` |

---

## 2. Screen → Responsibility Table

### 2.1 BBS Interface (Primary - Default Path)

#### BBSGameScene - Start Menu Mode
| Aspect | Details |
|--------|---------|
| **Player Intent** | Start a new game, load saved game, access help |
| **Actions Available** | `[N]` New Campaign, `[L]` Load Campaign, `[H]` How to Play, `[Q]` Quit |
| **Data Shown** | Menu options, keyboard shortcuts |
| **Decisions** | Game mode selection |

#### BBSGameScene - InGame Mode (Main Game Screen)
| Aspect | Details |
|--------|---------|
| **Player Intent** | Manage empire, issue commands, progress turns |
| **Actions Available** | `[B]` Build, `[S]` Ships, `[A]` Attack, `[M]` Move, `[T]` Troops, `[G]` Galaxy View, `[P]` Planet Info, `[E]` End Turn, `[H]` Help, `[Q]` Quit |
| **Data Shown** | Empire resources (header), command log, galaxy status |
| **Decisions** | ALL strategic decisions (build, military, exploration, economy) |

#### BBSGameScene - Galaxy View Mode
| Aspect | Details |
|--------|---------|
| **Player Intent** | View spatial relationships between planets |
| **Actions Available** | `[←/→]` Cycle planets, `[Enter]` Select, `[Esc]` Return |
| **Data Shown** | ASCII galaxy map, planet positions, ownership colors |
| **Decisions** | Target selection for operations |

#### BBSGameScene - Planet Info Mode
| Aspect | Details |
|--------|---------|
| **Player Intent** | View detailed planet information |
| **Actions Available** | `[←/→]` Cycle planets, `[Esc]` Return |
| **Data Shown** | Population, morale, resources, buildings, garrison |
| **Decisions** | Information gathering (no direct actions) |

#### BBSGameScene - Build Mode
| Aspect | Details |
|--------|---------|
| **Player Intent** | Construct buildings on owned planets |
| **Actions Available** | `[1-5]` Select building type, `[Esc]` Cancel |
| **Data Shown** | Available buildings, costs, current planet context |
| **Decisions** | Building selection |

#### BBSGameScene - Attack Mode
| Aspect | Details |
|--------|---------|
| **Player Intent** | Initiate combat against enemy planets |
| **Actions Available** | Planet selection, attack confirmation |
| **Data Shown** | Target options, military strength comparisons |
| **Decisions** | Target selection, attack execution |

---

### 2.2 Graphical Interface (Secondary Path)

#### MainMenuScene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Navigate to game modes |
| **Actions Available** | New Campaign, Load Campaign, Tutorials, Flash Conflicts, Statistics, How to Play |
| **Data Shown** | Menu buttons, player profile (if authenticated) |
| **Decisions** | Game mode selection |

#### CampaignConfigScene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Configure new campaign settings |
| **Actions Available** | Select difficulty, galaxy size, AI count, Start Campaign |
| **Data Shown** | Configuration options, descriptions |
| **Decisions** | Campaign parameters |

#### GalaxyMapScene (Main Graphical Game)
| Aspect | Details |
|--------|---------|
| **Player Intent** | Visual empire management |
| **Actions Available** | Click planets, End Turn button, HUD interactions |
| **Data Shown** | Visual galaxy map, resource HUD, planet sprites, spacecraft |
| **Decisions** | Planet selection triggers PlanetInfoPanel |

#### PlanetInfoPanel (UI Overlay in GalaxyMapScene)
| Aspect | Details |
|--------|---------|
| **Player Intent** | Manage selected planet |
| **Actions Available** | Build, Commission, Platoons, Spacecraft, Navigate, Invade, Bombard, Deploy |
| **Data Shown** | Planet name/type/owner, population, morale, resources, construction progress, tax rate |
| **Decisions** | Building, military unit creation, tax adjustment, invasion |

#### HowToPlayScene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Learn game mechanics |
| **Actions Available** | Navigate chapters, scroll content |
| **Data Shown** | Help chapters, game instructions |
| **Decisions** | None (informational) |

#### TutorialsScene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Learn through guided scenarios |
| **Actions Available** | Select tutorial, view details, start scenario |
| **Data Shown** | Tutorial list, completion status, star ratings |
| **Decisions** | Tutorial selection |

#### FlashConflictsScene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Play tactical mini-scenarios |
| **Actions Available** | Select scenario, view details, start scenario |
| **Data Shown** | Scenario list, completion status, star ratings |
| **Decisions** | Scenario selection |

#### VictoryScene / DefeatScene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Review game outcome |
| **Actions Available** | Continue (return to menu), Save Campaign |
| **Data Shown** | Victory/defeat message, campaign statistics |
| **Decisions** | Save game, return to menu |

---

## 3. Navigation Flow Diagram

```
                              ┌─────────────┐
                              │  BootScene  │
                              └──────┬──────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
             ┌──────────────┐                ┌────────────────┐
             │  AuthScene   │                │ (Skip if auth  │
             │              │                │   unavailable) │
             └──────┬───────┘                └───────┬────────┘
                    │                                │
                    └────────────────┬───────────────┘
                                     ▼
                         ┌───────────────────┐
                         │   BBSGameScene    │ ◄── DEFAULT PATH
                         │   (Start Menu)    │
                         └─────────┬─────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
    ┌───────────────┐     ┌───────────────┐      ┌───────────────┐
    │ [N] New       │     │ [L] Load      │      │ [H] How to    │
    │   Campaign    │     │   Campaign    │      │     Play      │
    └───────┬───────┘     └───────┬───────┘      └───────────────┘
            │                     │
            └──────────┬──────────┘
                       ▼
            ┌───────────────────┐
            │   BBSGameScene    │
            │    (InGame)       │
            └─────────┬─────────┘
                      │
    ┌─────────┬───────┼───────┬─────────┬─────────┐
    ▼         ▼       ▼       ▼         ▼         ▼
 [B]Build  [S]Ships [A]Attack [M]Move [G]Galaxy [E]EndTurn
    │         │       │       │         │         │
    ▼         ▼       ▼       ▼         ▼         ▼
 (modal)  (modal) (modal) (modal) (view mode)  (process)
```

### Graphical Interface Path (Accessed via MainMenuScene)

```
┌────────────────┐
│ MainMenuScene  │
└───────┬────────┘
        │
   ┌────┴────┬──────────┬───────────┬─────────────┐
   ▼         ▼          ▼           ▼             ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐
│New     │ │Load    │ │Tutorials │ │Flash      │ │How to Play   │
│Campaign│ │Campaign│ │          │ │Conflicts  │ │              │
└───┬────┘ └───┬────┘ └────┬─────┘ └─────┬─────┘ └──────────────┘
    │          │           │             │
    ▼          │           ▼             ▼
┌───────────┐  │    ┌────────────┐ ┌────────────────┐
│Campaign   │  │    │TutorialsScn│ │FlashConflictsScn│
│Config     │  │    └─────┬──────┘ └───────┬────────┘
└─────┬─────┘  │          │                │
      │        │          ▼                ▼
      │        │    ┌────────────┐   ┌────────────────┐
      └────────┴───►│GalaxyMap   │   │ScenarioGame    │
                    │Scene       │   │Scene           │
                    └─────┬──────┘   └───────┬────────┘
                          │                  │
                    ┌─────┴──────┐     ┌─────┴──────┐
                    ▼            ▼     ▼            ▼
               ┌─────────┐  ┌────────┐ ┌─────────┐ ┌────────┐
               │Victory  │  │Defeat  │ │Victory  │ │Defeat  │
               │Scene    │  │Scene   │ │Scene    │ │Scene   │
               └─────────┘  └────────┘ └─────────┘ └────────┘
```

---

## 4. Analysis vs. Playthrough Manual

### 4.1 Manual Expectation Check

| Manual Section | Expected Location | Actual Location | Status |
|----------------|-------------------|-----------------|--------|
| Building structures | Planet screen | BBS: Main screen `[B]`<br>Graphical: PlanetInfoPanel | ⚠️ Different |
| Commissioning platoons | Planet screen | BBS: Main screen `[T]`<br>Graphical: PlanetInfoPanel | ⚠️ Different |
| Purchasing spacecraft | Planet screen | BBS: Main screen `[S]`<br>Graphical: PlanetInfoPanel | ⚠️ Different |
| Navigation/movement | Planet/ship context | BBS: Main screen `[M]`<br>Graphical: PlanetInfoPanel | ⚠️ Different |
| Attacking | Military context | BBS: Main screen `[A]`<br>Graphical: PlanetInfoPanel | ⚠️ Different |
| Ending turn | Main screen | BBS: Main screen `[E]`<br>Graphical: HUD button | ✅ Consistent |
| Tax adjustment | Planet screen | Graphical: PlanetInfoPanel<br>BBS: Not implemented | ⚠️ Missing in BBS |

### 4.2 Identified Issues

#### Issue #1: Dual Interface Inconsistency
- **Severity:** HIGH
- **Description:** Game has two completely different interfaces (BBS vs Graphical) with different action locations
- **Impact:** User confusion when switching between modes or following tutorials
- **Manual Reference:** Manual appears to describe graphical interface, but BBS is the default

#### Issue #2: BUILD Action Location
- **Severity:** MEDIUM
- **Question:** Should BUILD exist on Planet screen instead of Main screen?
- **Analysis:**
  - **BBS Interface:** BUILD is on main screen `[B]` → prompts for planet selection
  - **Graphical Interface:** BUILD is inside PlanetInfoPanel → requires clicking planet first
  - **Manual Expectation:** "Select a planet, then build" pattern (graphical)
  - **Recommendation:** Graphical approach is more intuitive (context-first), but BBS approach is faster for keyboard users. Both are valid.

#### Issue #3: Auth Gating Bypass
- **Severity:** LOW
- **Question:** Does the game start without user intent due to missing auth gating?
- **Analysis:**
  - `BootScene` checks Supabase availability
  - If Supabase unavailable → proceeds to `BBSGameScene` directly (anonymous mode)
  - If Supabase available → routes to `AuthScene` first
  - **Finding:** Game can start without explicit auth, but this is intentional for offline play

#### Issue #4: Action Discoverability
- **Severity:** MEDIUM
- **Question:** Are critical actions discoverable without reading the manual?
- **Analysis:**
  - **BBS Interface:** Clear keyboard shortcuts displayed at bottom of screen
  - **Graphical Interface:** Requires clicking a planet to see action buttons
  - **Finding:** First-time graphical users may not realize they need to click planets

---

## 5. Misplaced Actions Analysis

### Actions Located on Unintuitive Screens

| Action | Current Location | Expected Location | Recommendation |
|--------|------------------|-------------------|----------------|
| Tax Rate | PlanetInfoPanel only | Should also be in empire overview | Add empire-wide tax summary |
| Galaxy View | BBS: Main menu `[G]` | Should be default view | Consider making persistent |

### Actions Duplicated Across Screens

| Action | Locations | Issue | Recommendation |
|--------|-----------|-------|----------------|
| Help | Multiple screens | Inconsistent content | Unify help content |
| Return to Menu | Victory, Defeat, HowToPlay | Consistent | ✅ OK |

### Missing Navigation or Confirmation Steps

| Flow | Missing Element | Risk | Recommendation |
|------|-----------------|------|----------------|
| Attack execution | Damage preview | Surprise outcomes | Add combat preview |
| Building construction | Cost confirmation | Accidental builds | ✅ Already has confirmation |
| End Turn | Pending actions warning | Missed opportunities | Consider "X actions remaining" |

---

## 6. First-Time Player Experience Check

### Can a first-time player reasonably find how to:

| Action | BBS Interface | Graphical Interface | Verdict |
|--------|---------------|---------------------|---------|
| **Build** | ✅ `[B]` shown in menu | ⚠️ Must click planet first | PASSABLE |
| **Deploy** | ⚠️ `[M]` for move ships | ⚠️ Hidden in planet panel | NEEDS IMPROVEMENT |
| **End Turn** | ✅ `[E]` shown in menu | ✅ Button visible in HUD | ✅ OK |

### STOP CONDITION CHECK

> **If a first-time player cannot reasonably find how to build, deploy, or end a turn, STOP and flag UX as BLOCKING.**

**Assessment:**
- **Build:** PASSABLE - BBS shows hotkey, Graphical requires planet click (learnable)
- **Deploy:** NEEDS IMPROVEMENT - Both interfaces require discovery
- **End Turn:** OK - Both interfaces make this clear

**VERDICT: UX is NOT BLOCKING** - All critical actions are findable, though "deploy" could be more discoverable.

---

## 7. Recommended Screen Reassignment

### Minimal UI Change Set (Low-Risk)

| Change | Screen | Description | Risk Level |
|--------|--------|-------------|------------|
| 1 | GalaxyMapScene | Add tooltip on first planet click: "Click a planet to see actions" | LOW |
| 2 | GalaxyMapScene | Add "?" button to HUD linking to How to Play | LOW |
| 3 | BBSGameScene | Add `[?]` quick help overlay for hotkeys | LOW |
| 4 | PlanetInfoPanel | Add visual indicator for actionable planets (pulse effect) | LOW |

### Medium-Risk Improvements

| Change | Screen | Description | Risk Level |
|--------|--------|-------------|------------|
| 5 | GalaxyMapScene | Add top-level "Build" button in HUD (not just in panel) | MEDIUM |
| 6 | BBSGameScene | Add tax rate adjustment command | MEDIUM |
| 7 | Both | Unified onboarding flow for new players | MEDIUM |

### High-Risk Improvements (Not Recommended Now)

| Change | Description | Risk Level |
|--------|-------------|------------|
| Merge interfaces | Unify BBS and Graphical into single mode | HIGH |
| Complete UI redesign | Move all actions to a command palette | HIGH |

---

## 8. Summary

### Key Findings

1. **Two parallel interfaces exist** - BBS (keyboard, default) and Graphical (mouse, secondary)
2. **BUILD placement is correct for each interface** - Context differs but both are valid
3. **Auth gating works properly** - Anonymous play is intentional feature
4. **Action discoverability needs improvement** - Especially for graphical interface
5. **UX is NOT BLOCKING** - First-time players can find critical actions

### Priority Actions

1. **LOW PRIORITY:** Add hover tooltips/hints for first-time graphical users
2. **MEDIUM PRIORITY:** Add "getting started" prompt on first play
3. **DEFER:** Interface unification (high risk, low immediate value)

### Files Requiring Changes

For minimal improvements:
- `src/scenes/GalaxyMapScene.ts` - Add onboarding hints
- `src/scenes/ui/HUD.ts` - Add help button
- `src/scenes/BBSGameScene.ts` - Add quick-help overlay

---

*End of UX Flow Audit*
