# UX Flow & Responsibility Audit

**Audit Date:** 2025-12-22 (Updated)
**Auditor:** Claude (UX Flow & Responsibility Auditor)
**Codebase:** Overlord 4X Strategy Game
**Interface:** BBS Edition (Graphical mode removed as of commit cab4e9c)

---

## 1. Screen Enumeration

### Current Interface (BBS Mode - ONLY Interface)

| Scene | File | Scene Key | Purpose |
|-------|------|-----------|---------|
| Boot | `BootScene.ts` | `BootScene` | Startup, env check, auth routing |
| Authentication | `AuthScene.ts` | `AuthScene` | Login/Register/Guest mode |
| **BBS Game** | `BBSGameScene.ts` | `BBSGameScene` | All gameplay (menu screens are modal states) |

### BBS Menu Screens (Within BBSGameScene)

| Screen | Enum Value | Description |
|--------|------------|-------------|
| Start Menu | `START_MENU` | Main menu before game starts |
| In-Game | `IN_GAME` | Primary game interface with all commands |
| Galaxy | `GALAXY` | Planet list and selection |
| Planet | `PLANET` | Detailed planet info view |
| Build | `BUILD` | Structure construction (2-step: select planet, then building) |
| Shipyard | `SHIPYARD` | Spacecraft purchase (2-step: select planet, then craft) |
| Commission | `COMMISSION` | Platoon recruitment (2-step: select planet, then config) |
| Move Fleet | `MOVE_FLEET` | Ship movement (2-step: select craft, then destination) |
| Attack | `ATTACK` | Combat initiation (2-step: select target, then attack type) |
| Tax Rate | `TAX_RATE` | Tax adjustment (2-step: select planet, then rate) |
| Research | `RESEARCH` | Weapon tier upgrades |
| Help | `HELP` | Keyboard command reference |
| How to Play | `HOW_TO_PLAY` | 8-chapter tutorial/help content |
| Victory | `VICTORY` | Win screen |
| Defeat | `DEFEAT` | Loss screen |

---

## 2. Screen → Responsibility Table

### 2.1 Boot Scene
| Aspect | Details |
|--------|---------|
| **Player Intent** | None (automatic) |
| **Actions Available** | None - automatic transition |
| **Data Shown** | Console startup messages |
| **Decisions Made** | None |

### 2.2 Auth Scene
| Aspect | Details |
|--------|---------|
| **Player Intent** | Authenticate or play as guest |
| **Actions Available** | Sign In, Register, Forgot Password, Play as Guest |
| **Data Shown** | Login/Register forms, guest option |
| **Decisions Made** | Authentication method |

### 2.3 BBS Game Scene - Start Menu
| Aspect | Details |
|--------|---------|
| **Player Intent** | Start a new game, continue, access help |
| **Actions Available** | `[N]` New Campaign, `[C]` Continue (if game active), `[H]` How to Play, `[D]` Download Debug Log |
| **Data Shown** | Menu options, campaign status indicator |
| **Decisions Made** | Game mode selection |

### 2.4 BBS Game Scene - In-Game (Primary)
| Aspect | Details |
|--------|---------|
| **Player Intent** | Manage empire, issue commands, progress turns |
| **Actions Available** | `[G]` Galaxy, `[P]` Planet, `[B]` Build, `[C]` Commission, `[S]` Shipyard, `[M]` Move, `[A]` Attack, `[T]` Tax, `[R]` Research, `[H]` Help, `[E]` End Turn, `[Q]` Quit |
| **Data Shown** | Turn number, phase, credits, planets/craft/platoons count, contextual hints, message log |
| **Decisions Made** | ALL strategic decisions |

### 2.5 BBS Game Scene - Galaxy View
| Aspect | Details |
|--------|---------|
| **Player Intent** | View all planets, select target |
| **Actions Available** | `[1-9]` Select planet by number, `[ESC]` Back |
| **Data Shown** | Planet list with name, owner, type, population, craft count |
| **Decisions Made** | Planet selection for viewing |

### 2.6 BBS Game Scene - Planet View
| Aspect | Details |
|--------|---------|
| **Player Intent** | View detailed planet information |
| **Actions Available** | `[ESC]` Back (read-only view) |
| **Data Shown** | Owner, type, population, morale, tax rate, resources, structures, orbiting craft |
| **Decisions Made** | None (informational only) |

### 2.7 BBS Game Scene - Build
| Aspect | Details |
|--------|---------|
| **Player Intent** | Construct structures on owned planets |
| **Actions Available** | Step 1: `[1-9]` Select planet | Step 2: `[1-5]` Select building type |
| **Data Shown** | Step 1: Planet list with slot counts | Step 2: Building options with costs/status |
| **Decisions Made** | WHERE to build, WHAT to build |

### 2.8 BBS Game Scene - Shipyard
| Aspect | Details |
|--------|---------|
| **Player Intent** | Purchase spacecraft |
| **Actions Available** | Step 1: `[1-9]` Select planet | Step 2: `[1-4]` Select craft type |
| **Data Shown** | Step 1: Planet list with docking bay count | Step 2: Craft options with costs |
| **Decisions Made** | WHERE to build craft, WHAT craft to build |

### 2.9 BBS Game Scene - Commission
| Aspect | Details |
|--------|---------|
| **Player Intent** | Recruit and equip platoons |
| **Actions Available** | Step 1: `[1-9]` Select planet | Step 2: `[1-4]` Select platoon configuration |
| **Data Shown** | Step 1: Planet list with population/platoon counts | Step 2: Platoon options with costs |
| **Decisions Made** | WHERE to recruit, WHAT equipment/size |

### 2.10 BBS Game Scene - Move Fleet
| Aspect | Details |
|--------|---------|
| **Player Intent** | Reposition spacecraft |
| **Actions Available** | Step 1: `[1-9]` Select craft | Step 2: `[1-9]` Select destination |
| **Data Shown** | Step 1: Craft list with types/locations | Step 2: Planet list with owners |
| **Decisions Made** | WHICH craft to move, WHERE to move it |

### 2.11 BBS Game Scene - Attack
| Aspect | Details |
|--------|---------|
| **Player Intent** | Initiate combat against enemy/neutral planets |
| **Actions Available** | Step 1: `[1-9]` Select target | Step 2: `[1]` Bombard or `[2]` Invade |
| **Data Shown** | Step 1: Target planets with forces | Step 2: Attack options with requirements |
| **Decisions Made** | WHERE to attack, HOW to attack |

### 2.12 BBS Game Scene - Tax Rate
| Aspect | Details |
|--------|---------|
| **Player Intent** | Adjust planetary tax rates |
| **Actions Available** | Step 1: `[1-9]` Select planet | Step 2: `[1-6]` Select rate |
| **Data Shown** | Step 1: Planet list with current rates/morale | Step 2: Rate options with effects |
| **Decisions Made** | WHICH planet to adjust, WHAT rate to set |

### 2.13 BBS Game Scene - Research
| Aspect | Details |
|--------|---------|
| **Player Intent** | Upgrade weapon technology |
| **Actions Available** | `[1]` Start research (if available), `[ESC]` Back |
| **Data Shown** | Current tier, research progress, next tier cost/duration |
| **Decisions Made** | Whether to invest in research |

---

## 3. Navigation Flow Diagram

```
                         ┌─────────────┐
                         │  BootScene  │
                         └──────┬──────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
        Supabase OK?                      Supabase Unavailable
               │                                 │
               ▼                                 │
        ┌──────────────┐                         │
        │  AuthScene   │                         │
        │  (Login/     │                         │
        │   Guest)     │                         │
        └──────┬───────┘                         │
               │                                 │
               └────────────┬────────────────────┘
                            ▼
              ┌─────────────────────────┐
              │      BBSGameScene       │
              │      (START_MENU)       │
              └────────────┬────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
    [N] New          [C] Continue        [H] How to Play
    Campaign         (if active)              │
       │                   │                   │
       └─────────┬─────────┘                   │
                 ▼                             │
    ┌─────────────────────────┐                │
    │      BBSGameScene       │                │
    │       (IN_GAME)         │                │
    └────────────┬────────────┘                │
                 │                             │
    ┌────┬───┬───┼───┬───┬───┬───┬───┬───┐    │
    ▼    ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼    ▼
  [G]  [P] [B] [S] [C] [M] [A] [T] [R] [H] [HOW_TO_PLAY]
   │    │   │   │   │   │   │   │   │   │
   ▼    ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼   ▼
GALAXY PLANET BUILD SHIP COMM MOVE ATK TAX RES HELP
   │           │   │   │   │   │   │   │
   └───────────┴───┴───┴───┴───┴───┴───┘
         All return to IN_GAME via [ESC]
```

---

## 4. Analysis vs. Playthrough Manual

### 4.1 Critical Discrepancy: Manual Describes REMOVED Interface

**BLOCKING FINDING:** The Playthrough Manual (`OVERLORD-COMPLETE-PLAYTHROUGH-MANUAL.md`) describes a **graphical click-based interface** that was REMOVED in commit `cab4e9c`.

| Manual Instruction | Manual Says | Actual BBS Interface |
|--------------------|-------------|---------------------|
| Planet selection | "Click your planet" | Press `[G]` then `[1-9]` |
| Building | "Click [BUILD] button" | Press `[B]`, then `[1-9]`, then `[1-5]` |
| Tax adjustment | "Drag slider" | Press `[T]`, then `[1-9]`, then `[1-6]` |
| Fleet movement | "Click [NAVIGATE]" | Press `[M]`, then `[1-9]`, then `[1-9]` |
| End turn | "Press SPACE" / "Click button" | Press `[E]` |

**Recommendation:** The Playthrough Manual MUST be updated to reflect the BBS keyboard interface.

### 4.2 Manual Expectation vs. BBS Implementation

| Manual Section | Expected Pattern | BBS Pattern | Match? |
|----------------|------------------|-------------|--------|
| Building structures | Select planet → Build menu | Build menu → Select planet → Select building | ⚠️ REVERSED |
| Commissioning | Select planet → Platoons tab | Commission menu → Select planet → Configure | ⚠️ REVERSED |
| Spacecraft purchase | Select planet → Spacecraft menu | Shipyard menu → Select planet → Select craft | ⚠️ REVERSED |
| Fleet movement | Select craft → Select destination | Move menu → Select craft → Select destination | ✅ MATCHES |
| Attacking | Arrive at planet → Attack | Attack menu → Select target → Select type | ✅ MATCHES |
| Tax adjustment | Select planet → Adjust slider | Tax menu → Select planet → Select rate | ⚠️ REVERSED |
| End turn | Space/Enter | `[E]` key | ⚠️ DIFFERENT |

### 4.3 Pattern Analysis

The BBS interface uses a **Command-First** pattern:
1. Select the ACTION you want to perform
2. Then select the TARGET for that action
3. Then confirm/configure specifics

The Manual describes a **Context-First** pattern:
1. Select the OBJECT (planet/craft)
2. Then see available actions in context
3. Then perform the action

**Neither pattern is wrong** - both are valid UX approaches. The BBS Command-First pattern is faster for keyboard-driven interfaces and is common in CLI/BBS systems. The Context-First pattern is more intuitive for mouse-driven graphical interfaces.

---

## 5. Specific Audit Questions

### 5.1 Should BUILD exist on Planet screen instead of Main screen?

**Analysis:**

| Approach | Current BBS | Alternative (Context-First) |
|----------|-------------|----------------------------|
| Navigation | `[B]` from main → planet select → building select | `[G]` → planet select → `[B]` → building select |
| Keystrokes | 3 presses minimum | 4 presses minimum |
| Mental model | "I want to BUILD" → "WHERE?" | "I'm looking at THIS planet" → "BUILD here" |

**Verdict:** The current placement is **CORRECT for the BBS interface paradigm**. Command-First is the standard pattern for keyboard-driven menus. Requiring users to navigate to a planet first would add unnecessary steps.

**However:** The Planet screen (`[P]`) is currently READ-ONLY with no actions. Adding a contextual build option there (e.g., `[B]` while viewing a planet triggers build for that planet) would ENHANCE discoverability without breaking the existing flow.

**Recommendation:** LOW PRIORITY - Keep current, optionally add contextual shortcuts to Planet view.

### 5.2 Does the game start without user intent due to missing auth gating?

**Analysis:**

| Scenario | Behavior | Assessment |
|----------|----------|------------|
| Supabase available + not authenticated | Routes to AuthScene first | ✅ CORRECT |
| Supabase available + already authenticated | Proceeds to BBSGameScene | ✅ CORRECT |
| Supabase available + guest session exists | Proceeds to BBSGameScene | ✅ CORRECT |
| Supabase unavailable | Proceeds to BBSGameScene (offline mode) | ⚠️ INTENTIONAL |

**Code evidence (BootScene.ts:76-101):**
```typescript
if (authService.isAuthenticated()) {
  this.scene.start('BBSGameScene');
} else if (guestService.isGuestMode()) {
  this.scene.start('BBSGameScene');
} else {
  this.scene.start('AuthScene'); // Auth required
}
```

**Verdict:** The auth gating is **CORRECT**. The game requires either:
- User authentication (sign in), OR
- Explicit guest mode selection, OR
- Supabase unavailable (intentional offline fallback)

Users cannot accidentally enter the game without making an intentional choice.

### 5.3 Are critical actions discoverable without reading the manual?

**Analysis:**

| Critical Action | Discovery Method | Discoverable? |
|----------------|------------------|---------------|
| **Build** | Main menu shows `[B] Build Structure` | ✅ YES |
| **Deploy/Move** | Main menu shows `[M] Move Fleet` | ✅ YES |
| **End Turn** | Main menu shows `[E] End Turn` | ✅ YES |
| **Attack** | Main menu shows `[A] Attack` | ✅ YES |
| **Help** | Main menu shows `[H] Help` | ✅ YES |
| **What to build first** | Contextual hint system on main screen | ✅ YES |

**Key Feature: Contextual Hint System (BBSGameScene.ts:1841-1920)**

The game provides intelligent hints based on game state:
- No mining station? → "TIP: Press [B] to build a Mining Station for resources"
- Has mining, no food? → "TIP: Press [B] to build a Horticultural Station for food"
- Has economy, no docking? → "TIP: Press [B] to build a Docking Bay for spacecraft"
- Has docking, no ships? → "TIP: Press [S] to purchase a Battle Cruiser"
- Has ships, no platoons? → "TIP: Press [C] to commission a Platoon for invasion"
- Ready to attack? → "TIP: Press [A] to attack and invade the enemy planet!"

**Verdict:** Critical actions are **HIGHLY DISCOVERABLE**. The BBS interface shows all available commands clearly, and the contextual hint system guides new players through optimal progression.

---

## 6. Misplaced Actions Analysis

### Actions Located on Unintuitive Screens

| Action | Current Location | Issue | Recommendation |
|--------|------------------|-------|----------------|
| (None identified) | - | BBS layout is logical | N/A |

### Actions Duplicated Across Screens

| Action | Locations | Issue | Recommendation |
|--------|-----------|-------|----------------|
| `[ESC]` Back | All sub-screens | Consistent | ✅ OK |
| `[H]` Help | Start menu + In-game | Consistent | ✅ OK |

### Missing Navigation or Confirmation Steps

| Flow | Missing Element | Risk Level | Recommendation |
|------|-----------------|------------|----------------|
| Build | Pre-build resource check | LOW | Already shows "NO FUNDS"/"NO SLOT" |
| Attack | Combat preview/odds | MEDIUM | Add strength comparison before confirm |
| End Turn | Pending actions warning | LOW | Consider "You have unspent resources" |

---

## 7. First-Time Player Experience Check

### Can a first-time player reasonably find how to:

| Action | Method | Verdict |
|--------|--------|---------|
| **Build** | Menu shows `[B] Build Structure` + hint system | ✅ PASS |
| **Deploy** | Menu shows `[M] Move Fleet` + hint system | ✅ PASS |
| **End Turn** | Menu shows `[E] End Turn` + hint system | ✅ PASS |
| **Get Help** | Menu shows `[H] Help` + `[H] How to Play` | ✅ PASS |

### STOP CONDITION CHECK

> **If a first-time player cannot reasonably find how to build, deploy, or end a turn, STOP and flag UX as BLOCKING.**

**Assessment:**
- **Build:** ✅ PASS - `[B]` clearly shown + contextual hints
- **Deploy:** ✅ PASS - `[M]` clearly shown + contextual hints
- **End Turn:** ✅ PASS - `[E]` clearly shown + contextual hints

**VERDICT: UX is NOT BLOCKING** - All critical actions are clearly discoverable through the menu system and hint system.

---

## 8. Identified Issues and Recommendations

### Critical Issues (Must Fix)

| # | Issue | Severity | Recommendation |
|---|-------|----------|----------------|
| 1 | Playthrough Manual describes removed graphical interface | **CRITICAL** | Rewrite manual for BBS keyboard interface |
| 2 | User Manual also describes graphical interface | **CRITICAL** | Rewrite or remove outdated sections |

### Medium Issues (Should Fix)

| # | Issue | Severity | Recommendation |
|---|-------|----------|----------------|
| 3 | Planet view is read-only | MEDIUM | Add contextual action shortcuts |
| 4 | No combat preview before attack | MEDIUM | Add strength comparison screen |
| 5 | "How to Play" chapters still reference clicking | MEDIUM | Verify all help content is BBS-accurate |

### Low Issues (Nice to Have)

| # | Issue | Severity | Recommendation |
|---|-------|----------|----------------|
| 6 | No keyboard shortcut quick-reference overlay | LOW | Add `[?]` for instant hotkey reminder |
| 7 | End turn could warn about unspent resources | LOW | Consider optional warning |

---

## 9. Files Requiring Changes

### Critical (Documentation)

| File | Change Type | Description |
|------|-------------|-------------|
| `OVERLORD-COMPLETE-PLAYTHROUGH-MANUAL.md` | **REWRITE** | Convert from graphical to BBS keyboard instructions |
| `USER_MANUAL.md` | **REWRITE** | Update all click references to keyboard commands |

### Medium Priority (Code)

| File | Change Type | Description |
|------|-------------|-------------|
| `src/scenes/BBSGameScene.ts` | Enhancement | Add contextual actions to Planet view |
| `src/scenes/BBSGameScene.ts` | Enhancement | Add combat strength preview to Attack |

### Low Priority (Code)

| File | Change Type | Description |
|------|-------------|-------------|
| `src/scenes/BBSGameScene.ts` | Enhancement | Add `[?]` quick-help overlay |
| `src/scenes/BBSGameScene.ts` | Enhancement | Add end-turn resource warning |

---

## 10. Summary

### Key Findings

1. **Interface is now BBS-only** - Graphical mode was removed; all interaction is keyboard-driven
2. **BUILD placement is CORRECT** - Command-First pattern is appropriate for BBS interface
3. **Auth gating is CORRECT** - Users must explicitly choose sign-in, register, or guest mode
4. **Action discoverability is EXCELLENT** - Clear menu labels + intelligent contextual hints
5. **UX is NOT BLOCKING** - First-time players can find all critical actions
6. **Documentation is OUTDATED** - Manuals still describe the removed graphical interface

### Priority Actions

1. **CRITICAL:** Update Playthrough Manual for BBS keyboard interface
2. **CRITICAL:** Update User Manual for BBS keyboard interface
3. **MEDIUM:** Consider adding contextual actions to Planet view
4. **MEDIUM:** Add combat preview before attack confirmation
5. **LOW:** Add quick-help overlay for keyboard shortcuts

### Overall UX Assessment

The BBS interface is **well-designed** for its paradigm:
- Clear command structure visible at all times
- Intelligent hint system guides new players
- Consistent navigation patterns (command → target → confirm)
- Escape key universally returns to previous screen

The primary issue is **documentation lag** - the manuals describe an interface that no longer exists.

---

*End of UX Flow Audit*
