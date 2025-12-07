# Story 1-6: Combat

**Epic:** Prototype MVP
**Story Key:** 1-6-combat
**Estimated Time:** 30 minutes
**AFS References:** AFS-041 (Combat System)

---

## Story

As a player, I want combat to auto-resolve when my Battle Cruiser arrives at an enemy planet, with a text result showing the outcome, so I can capture enemy planets.

---

## Acceptance Criteria

- [ ] **AC1:** Combat triggers when Battle Cruiser arrives at enemy planet
- [ ] **AC2:** Strength calculated correctly (platoons × equipment × training)
- [ ] **AC3:** Winner determined by higher total strength
- [ ] **AC4:** Text message shows battle result ("Battle at Vulcan! You won! Enemy destroyed.")
- [ ] **AC5:** Planet ownership changes on player victory
- [ ] **AC6:** Defeated platoons removed from game state

---

## Tasks/Subtasks

### Task 1: Verify CombatSystem in Overlord.Core ✅ ALREADY EXISTS
- [x] CombatSystem.cs already fully implemented (360+ lines)
- [x] InitiateBattle() creates Battle entity with platoon IDs
- [x] ExecuteCombat() calculates strength and resolves battle
- [x] Strength calculation: base 100 × equipment modifier
- [x] Planet ownership changes on attacker victory
- [x] Defeated platoons removed from game state
- [x] Events: OnBattleCompleted, OnPlanetCaptured

### Task 2: Integrate combat with navigation ✅ COMPLETE
- [x] Added combat trigger to NavigationSystem.MoveShip()
- [x] Check if destination planet is enemy-owned
- [x] Get craft.CarriedPlatoonIDs for attacking force
- [x] Call CombatSystem.InitiateBattle() if platoons present
- [x] Execute auto-resolve combat (aggression 50%)
- [x] Combat result handled by CombatSystem events

### Task 3: Verify combat UI integration ✅ ALREADY EXISTS
- [x] GameManager.OnBattleCompleted() event handler exists
- [x] GameManager.OnPlanetCaptured() event handler exists
- [x] Console logs show battle results
- [x] UI panels can subscribe to combat events

### Task 4: Test combat 🔬 READY FOR TESTING
**Testing Instructions for User:**
- [ ] Purchase Battle Cruiser (150K Credits)
- [ ] Purchase Platoon with Medium equipment (70K Credits)
- [ ] Load platoon onto Battle Cruiser
- [ ] Navigate Battle Cruiser to enemy planet (Hitotsu - RED planet)
- [ ] Verify console shows: "Battle at Hitotsu! {result}"
- [ ] Verify planet ownership changes to Player (BLUE) if victory
- [ ] Verify enemy platoons removed from game state

---

## Dev Notes

### Architecture Requirements
- CombatSystem in Overlord.Core
- Combat triggered by NavigationSystem
- UI displays results via events

### Design Specifications
See: `design-docs/v1.0/afs/AFS-041-combat-system.md`

### Simplified for Prototype
- Auto-resolve (no tactical combat)
- All-or-nothing casualties (loser loses everything)
- No aggression slider (fixed behavior)

### Strength Calculation (Simplified)
- Base strength per platoon: 100
- Equipment modifier: Light ×1.0, Medium ×1.5, Heavy ×2.0
- Winner = higher total strength

---

## Dev Agent Record

### Implementation Plan

**Discovery:** CombatSystem already exists - only needed navigation integration.

**Implementation Steps:**
1. ✅ Verified CombatSystem.cs exists (360+ lines) with full combat logic
2. ✅ Modified NavigationSystem constructor to accept CombatSystem parameter
3. ✅ Updated GameManager NavigationSystem initialization (2 places)
4. ✅ Added combat trigger logic to NavigationSystem.MoveShip()
5. ✅ Built Core DLL and copied to Unity
6. ✅ Verified GameManager combat event subscriptions already exist

**Combat Flow:**
```
Ship arrives at enemy planet
  → NavigationSystem.MoveShip() checks destination owner
    → If enemy planet AND craft has platoons
      → CombatSystem.InitiateBattle(planetID, faction, platoonIDs)
        → CombatSystem.ExecuteCombat(battle, aggression=50)
          → OnBattleCompleted event fires
          → OnPlanetCaptured event fires (if attacker wins)
            → GameManager.OnBattleCompleted() logs result
            → GameManager.OnPlanetCaptured() logs capture
```

### Debug Log

**NavigationSystem.MoveShip() Integration:**
```csharp
// After ship docks at destination
if (destinationPlanet.Owner != FactionType.Neutral &&
    destinationPlanet.Owner != craft.Owner)
{
    if (craft.CarriedPlatoonIDs.Count > 0)
    {
        var battle = _combatSystem.InitiateBattle(
            destinationPlanetID, craft.Owner, craft.CarriedPlatoonIDs);

        if (battle != null)
        {
            _combatSystem.ExecuteCombat(battle, aggressionPercent: 50);
        }
    }
}
```

**Build Output:**
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
Time Elapsed 00:00:01.42
```

### Completion Notes

**Implementation Complete:** Combat triggers automatically on ship arrival at enemy planet!

**What Was Implemented:**
- NavigationSystem combat integration (20 lines added)
- CombatSystem constructor parameter added
- GameManager NavigationSystem initialization updated (2 places)
- Combat auto-triggers when ship with platoons arrives at enemy planet
- Event-driven architecture (Core fires events → Unity handles UI)

**Key Features:**
- **Auto-Resolve Combat:** Instant battle resolution, no tactical phase
- **Strength Calculation:** Base 100 per platoon × equipment modifier
- **All-or-Nothing:** Loser loses all platoons (prototype simplification)
- **Planet Capture:** Ownership changes on attacker victory
- **Event-Driven:** OnBattleCompleted, OnPlanetCaptured events

**System Architecture:**
- ✅ CombatSystem in Core (already existed)
- ✅ NavigationSystem triggers combat (NEW integration)
- ✅ GameManager subscribes to events (already existed)
- ✅ Event-driven UI updates (console logs for prototype)

**Testing Status:**
- Cannot test in Unity Editor directly (AI limitation)
- User must Press Play and test combat flow
- Expected: Purchase ship+platoon → Load platoon → Navigate to enemy → Auto-combat → Planet captured

---

## File List

**Files Modified:**
- `Overlord.Core/Overlord.Core/NavigationSystem.cs` (added combat trigger logic)
- `Overlord.Unity/Assets/Scripts/GameManager.cs` (updated NavigationSystem initialization)
- `Overlord.Unity/Assets/Plugins/Overlord.Core/Overlord.Core.dll` (rebuilt with combat integration)

**Files Verified (Already Exist):**
- `Overlord.Core/Overlord.Core/CombatSystem.cs` (360+ lines, full combat logic)
- `Overlord.Unity/Assets/Scripts/GameManager.cs` (OnBattleCompleted, OnPlanetCaptured handlers)

---

## Change Log

**2025-12-08: Story 1-6 Combat - Implementation Complete**

**Summary:** Integrated combat auto-trigger with navigation system.

**Changes:**
1. Modified NavigationSystem constructor to accept CombatSystem parameter
2. Added combat trigger logic to NavigationSystem.MoveShip() (lines 98-118)
3. Updated GameManager.NewGame() NavigationSystem initialization
4. Updated GameManager.LoadGame() NavigationSystem initialization
5. Built Core DLL with combat integration
6. Copied DLL to Unity Plugins folder

**Implementation Approach:**
- Combat triggers when ship arrives at enemy planet
- Auto-resolve using CombatSystem.ExecuteCombat()
- Event-driven UI updates (GameManager subscriptions already exist)
- All-or-nothing casualties for prototype simplicity

---

## Status

**Current Status:** Ready for Review

**Status History:**
- 2025-12-08: Story created (backlog)
- 2025-12-08: Started implementation (in-progress)
- 2025-12-08: Implementation complete - Ready for Review (awaiting Unity test)
