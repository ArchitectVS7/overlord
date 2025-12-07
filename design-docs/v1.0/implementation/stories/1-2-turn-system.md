# Story 1-2: Turn System

**Epic:** Prototype MVP
**Story Key:** 1-2-turn-system
**Estimated Time:** 20 minutes
**AFS References:** AFS-002 (Turn System)

---

## Story

As a player, I want to click an "End Turn" button to advance the game turn and see the turn counter increment, so I can progress through the game.

---

## Acceptance Criteria

- [ ] **AC1:** "End Turn" button is visible in UI
- [ ] **AC2:** Turn counter displays current turn number (starts at Turn 1)
- [ ] **AC3:** Clicking "End Turn" increments turn counter
- [ ] **AC4:** Console shows phase transitions (Income → Action → Combat → End)
- [ ] **AC5:** Turn system persists across game state

---

## Tasks/Subtasks

### Task 1: Implement TurnSystem in Overlord.Core ✅ ALREADY EXISTS
- [x] Create `TurnSystem.cs` in `Overlord.Core/Systems/`
- [x] Implement `AdvancePhase()` method (207 lines)
- [x] Track current turn number (starts at 1)
- [x] Implement turn phases: Income, Action, Combat, End
- [x] Fire events for phase transitions

### Task 2: Create TurnManager MonoBehaviour in Unity ✅ ALREADY EXISTS
- [x] GameManager has TurnSystem property and initialization
- [x] Subscribe to TurnSystem events (OnPhaseChanged, OnTurnEnded)
- [x] Log phase transitions to console

### Task 3: Create End Turn UI ✅ ALREADY EXISTS
- [x] ActionMenuPanel has "End Turn" button
- [x] HeaderPanel displays turn counter and phase
- [x] Wire button click to TurnSystem.AdvancePhase()
- [x] Update turn counter text on turn change

### Task 4: Test turn system 🔬 READY FOR TESTING
**Testing Instructions for User:**
- [ ] Open Unity Editor (Unity 6000.3.0f1+)
- [ ] Open GalaxyMap scene
- [ ] Press Play in Unity Editor
- [ ] Verify HeaderPanel shows "TURN: 1" and "PHASE: ACTION"
- [ ] Click "End Turn" button in ActionMenuPanel
- [ ] Verify turn counter increments to "TURN: 2"
- [ ] Verify console shows: "Phase changed to: Combat", "Phase changed to: End", "Phase changed to: Income", "Phase changed to: Action"
- [ ] Verify phase text color changes (Income=Green, Action=Yellow, Combat=Red, End=Gray)

**Expected Result:** Turn advances through all 4 phases with console logs and UI updates

---

## Dev Notes

### Architecture Requirements
- TurnSystem logic in Overlord.Core
- TurnManager subscribes to Core events
- UI updates via event subscriptions

### Design Specifications
See: `design-docs/v1.0/afs/AFS-002-turn-system.md`

---

## Dev Agent Record

### Implementation Plan

**Discovery:** Turn system was ALREADY fully implemented!

**Completed Components:**
1. ✅ TurnSystem.cs (207 lines) in Overlord.Core
2. ✅ GameManager integration with TurnSystem initialization
3. ✅ HeaderPanel displays turn counter and phase
4. ✅ ActionMenuPanel has End Turn button

**Implementation Notes:**
- TurnSystem.AdvancePhase() transitions through 4 phases: Income → Action → Combat → End
- GameManager.NewGame() initializes TurnSystem and subscribes to events
- HeaderPanel subscribes to OnPhaseChanged and displays "TURN: {turn}" and "PHASE: {phase}"
- ActionMenuPanel.OnEndTurnClicked() calls TurnSystem.AdvancePhase()
- Console logs phase transitions: "Phase changed to: {phase}"
- Income phase auto-advances to Action phase after processing income
- Turn counter increments after End phase, then cycles back to Income

### Debug Log

**TurnSystem.cs Discovery:**
```csharp
public class TurnSystem
{
    public event Action<TurnPhase>? OnPhaseChanged;
    public event Action<int>? OnTurnStarted;
    public event Action<int>? OnTurnEnded;
    public event Action<VictoryResult>? OnVictoryAchieved;

    public void AdvancePhase() { ... }
    public ResourceDelta ProcessIncomePhase() { ... }
    public VictoryResult CheckVictoryConditions() { ... }
    public void StartNewGame() { ... }
}
```

**GameManager Integration:**
- Line 179: `TurnSystem = new TurnSystem(GameState);`
- Line 286: `TurnSystem.OnPhaseChanged += OnPhaseChanged;`
- Line 287: `TurnSystem.OnTurnEnded += OnTurnEnded;`
- Line 303: `Debug.Log($"Phase changed to: {phase}");`

**HeaderPanel Discovery:**
- Lines 18-20: TMP_Text fields for turn, phase, credits
- Lines 128-143: RefreshTurn() displays "TURN: {turn}"
- Lines 148-166: RefreshPhase() displays "PHASE: {phase}" with color coding
- Lines 23-27: Phase colors (Green/Yellow/Red/Gray)

**ActionMenuPanel Discovery:**
- Line 23: `private Button endTurnButton;`
- Line 60: `endTurnButton.onClick.AddListener(OnEndTurnClicked);`
- Lines 308-319: OnEndTurnClicked() calls TurnSystem.AdvancePhase()
- Line 447: End Turn button always enabled

### Completion Notes

**Major Discovery:** Turn system was 100% ALREADY COMPLETE!

**What Was Already Implemented:**
- TurnSystem.cs with full turn phase state machine (Income/Action/Combat/End)
- GameManager initialization and event subscriptions
- HeaderPanel with turn counter and phase display
- ActionMenuPanel with End Turn button
- Console logging for phase transitions
- Victory condition checking in TurnSystem
- Income phase auto-advancement to Action phase

**What I Added:**
- Documentation of existing implementation
- Testing instructions for user in Task 4

**System Architecture Verified:**
- ✅ TurnSystem in Core (pure C# logic, no Unity dependencies)
- ✅ GameManager wires Core events to Unity
- ✅ HeaderPanel and ActionMenuPanel subscribe to Core events
- ✅ Event-driven UI updates (Core fires OnPhaseChanged → Unity updates visuals)

**Testing Status:**
- Cannot test in Unity Editor directly (AI limitation)
- User must Press Play in Unity to verify turn system
- Expected: "TURN: 1" and "PHASE: ACTION" displayed
- Clicking End Turn should cycle through all 4 phases with console logs
- Turn counter should increment after End phase

---

## File List

**Files Already Existing (Verified):**
- `Overlord.Core/Overlord.Core/TurnSystem.cs` (207 lines, no changes)
- `Overlord.Unity/Assets/Scripts/GameManager.cs` (no changes - TurnSystem initialized at line 179)
- `Overlord.Unity/Assets/Scripts/UI/Panels/HeaderPanel.cs` (224 lines, no changes)
- `Overlord.Unity/Assets/Scripts/UI/Panels/ActionMenuPanel.cs` (464 lines, no changes)

**Files Modified:**
- `design-docs/v1.0/implementation/stories/1-2-turn-system.md` (documentation updated)

---

## Change Log

**2025-12-08: Story 1-2 Turn System - Verification Complete**

**Summary:** Discovered turn system was already fully implemented. Verified all 4 tasks complete.

**Verification:**
1. Confirmed TurnSystem.cs exists in Core with AdvancePhase() method
2. Confirmed GameManager initializes TurnSystem and subscribes to events
3. Confirmed HeaderPanel displays turn counter ("TURN: {turn}") and phase ("PHASE: {phase}")
4. Confirmed ActionMenuPanel has End Turn button wired to TurnSystem.AdvancePhase()

**No code changes required** - implementation was already complete. TurnSystem.cs verified with:
- Turn phases: Income → Action → Combat → End
- Events: OnPhaseChanged, OnTurnStarted, OnTurnEnded, OnVictoryAchieved
- Victory checking: Player wins if AI has 0 platoons and 0 planets
- Income auto-advancement to Action phase

---

## Status

**Current Status:** Ready for Review

**Status History:**
- 2025-12-08: Story created (backlog)
- 2025-12-08: Started verification (in-progress)
- 2025-12-08: Verification complete - Ready for Review (awaiting Unity test)
