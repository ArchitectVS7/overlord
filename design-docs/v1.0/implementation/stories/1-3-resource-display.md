# Story 1-3: Resource Display

**Epic:** Prototype MVP
**Story Key:** 1-3-resource-display
**Estimated Time:** 15 minutes
**AFS References:** AFS-021 (Resource System)

---

## Story

As a player, I want to see my current resources (Credits, Minerals, Fuel, Food, Energy) displayed on screen and updating each turn, so I can make informed decisions.

---

## Acceptance Criteria

- [ ] **AC1:** Display shows all 5 resource types: Credits, Minerals, Fuel, Food, Energy
- [ ] **AC2:** Starting values match PRD: 195,000 Credits, 500 Minerals, 500 Fuel, 500 Food, 500 Energy
- [ ] **AC3:** Resources update each turn based on income
- [ ] **AC4:** Display updates immediately when resources change

---

## Tasks/Subtasks

### Task 1: Implement ResourceSystem in Overlord.Core ✅ ALREADY EXISTS
- [x] Create `ResourceSystem.cs` in `Overlord.Core/Systems/` (180+ lines)
- [x] ResourceType enum defined in Models (Credits, Minerals, Fuel, Food, Energy)
- [x] Track resources in PlanetEntity.Resources (ResourceCollection class)
- [x] Initialize with starting values via GalaxyGenerator
- [x] Implement `AddResources()` and `RemoveResources()` methods
- [x] Fire events when resources change (OnResourcesChanged event)

### Task 2: Connect ResourceSystem to TurnSystem ✅ ALREADY EXISTS
- [x] IncomeSystem handles income calculation per planet
- [x] TurnSystem ProcessIncomePhase() adds income to player faction
- [x] Income calculated each turn based on buildings and planet type

### Task 3: Create ResourceDisplay UI in Unity ✅ ALREADY EXISTS
- [x] ResourcePanel.cs (230 lines) with TextMeshPro components
- [x] Show all 5 resource types with labels and values
- [x] Color coding: Red < 100 (critical), Yellow < 500 (warning), Green >= 500 (normal)
- [x] Subscribe to ResourceSystem.OnResourcesChanged event
- [x] Update UI text when resources change
- [x] Bonus: Income display showing "+X/turn" for each resource

### Task 4: Test resource display 🔬 READY FOR TESTING
**Testing Instructions for User:**
- [ ] Open Unity Editor (Unity 6000.3.0f1+)
- [ ] Open GalaxyMap scene
- [ ] Press Play in Unity Editor
- [ ] Click on Starbase (player homeworld, BLUE planet)
- [ ] Verify ResourcePanel shows all 5 resources:
  - Credits: 195,000 (GREEN)
  - Minerals: 500 (GREEN/YELLOW border)
  - Fuel: 500 (GREEN/YELLOW border)
  - Food: 500 (GREEN/YELLOW border)
  - Energy: 500 (GREEN/YELLOW border)
- [ ] Click End Turn button
- [ ] Verify resources update with income (should see "+X/turn" values)
- [ ] Verify color changes based on amounts

**Expected Result:** Resource panel displays all 5 resources with color coding and income display

---

## Dev Notes

### Architecture Requirements
- ResourceSystem in Overlord.Core
- Event-driven UI updates (no polling)

### Design Specifications
See: `design-docs/v1.0/afs/AFS-021-resource-system.md`

### Starting Values (PRD)
- Credits: 195,000
- Minerals: 500
- Fuel: 500
- Food: 500
- Energy: 500

---

## Dev Agent Record

### Implementation Plan

**Discovery:** Resource system was ALREADY fully implemented!

**Completed Components:**
1. ✅ ResourceSystem.cs (180+ lines) in Overlord.Core
2. ✅ ResourcePanel.cs (230 lines) in Unity with color coding
3. ✅ IncomeSystem integration with TurnSystem
4. ✅ GameManager ResourceSystem initialization

**Implementation Notes:**
- ResourceSystem.AddResources() adds resources to planets
- ResourceSystem.RemoveResources() validates and deducts resources for purchases
- OnResourcesChanged event fires when resources change on any planet
- ResourcePanel displays all 5 resource types with color coding:
  - Red < 100 (critical)
  - Yellow < 500 (warning)
  - Green >= 500 (normal)
- Bonus feature: Income display showing "+X/turn" for each resource
- ResourcePanel.RefreshResources() updates when selected planet changes or resources change

### Debug Log

**ResourceSystem.cs Discovery:**
```csharp
public class ResourceSystem
{
    public event Action<int, ResourceDelta>? OnResourcesChanged;
    public event Action<int, ResourceType>? OnResourceCritical;

    public bool AddResources(int planetID, ResourceDelta delta) { ... }
    public bool RemoveResources(int planetID, ResourceCost cost) { ... }
    public ResourceCollection GetTotalResources(FactionType faction) { ... }
}
```

**ResourcePanel.cs Discovery:**
- Lines 16-21: TMP_Text fields for all 5 resources
- Lines 23-28: TMP_Text fields for income display
- Lines 30-34: Color coding (critical/warning/normal/income)
- Lines 99-123: RefreshResources() updates all resource displays
- Lines 143-158: UpdateIncomeDisplay() shows "+X/turn" for each resource
- Lines 187-195: GetResourceColor() applies color coding based on amount

**GameManager Integration:**
- Line 146: `ResourceSystem = new ResourceSystem(GameState);` (NewGame)
- Line 210: `ResourceSystem = new ResourceSystem(GameState);` (LoadGame)

### Completion Notes

**Major Discovery:** Resource system was 100% ALREADY COMPLETE with bonus features!

**What Was Already Implemented:**
- ResourceSystem.cs with AddResources(), RemoveResources(), GetTotalResources()
- ResourcePanel.cs with color coding (red/yellow/green)
- Income display showing "+X/turn" (not required by AC, but nice to have!)
- Event subscriptions: OnResourcesChanged triggers UI refresh
- Integration with IncomeSystem for per-turn income calculation
- Critical/warning thresholds (100/500)

**What I Added:**
- Documentation of existing implementation
- Testing instructions for user in Task 4

**System Architecture Verified:**
- ✅ ResourceSystem in Core (pure C# logic, no Unity dependencies)
- ✅ ResourcePanel subscribes to ResourceSystem.OnResourcesChanged event
- ✅ GameManager initializes ResourceSystem in NewGame() and LoadGame()
- ✅ Color-coded UI based on resource amounts (visual feedback)

**Testing Status:**
- Cannot test in Unity Editor directly (AI limitation)
- User must Press Play and select Starbase planet
- Expected: All 5 resources displayed with values and color coding
- Income display should show "+X/turn" for each resource after clicking End Turn

---

## File List

**Files Already Existing (Verified):**
- `Overlord.Core/Overlord.Core/ResourceSystem.cs` (180+ lines, no changes)
- `Overlord.Unity/Assets/Scripts/UI/Panels/ResourcePanel.cs` (230 lines, no changes)
- `Overlord.Unity/Assets/Scripts/GameManager.cs` (no changes - ResourceSystem initialized at line 146)

**Files Modified:**
- `design-docs/v1.0/implementation/stories/1-3-resource-display.md` (documentation updated)

---

## Change Log

**2025-12-08: Story 1-3 Resource Display - Verification Complete**

**Summary:** Discovered resource system was already fully implemented with bonus features (color coding, income display).

**Verification:**
1. Confirmed ResourceSystem.cs exists in Core with AddResources() and RemoveResources()
2. Confirmed ResourcePanel.cs displays all 5 resources with color coding
3. Confirmed OnResourcesChanged event wired to UI refresh
4. Confirmed GameManager initializes ResourceSystem

**Bonus Features Found:**
- Color coding: Red (critical < 100), Yellow (warning < 500), Green (normal >= 500)
- Income display: Shows "+X/turn" for each resource type
- Critical resource alerts via OnResourceCritical event

**No code changes required** - implementation was already complete and exceeded acceptance criteria.

---

## Status

**Current Status:** Ready for Review

**Status History:**
- 2025-12-08: Story created (backlog)
- 2025-12-08: Started verification (in-progress)
- 2025-12-08: Verification complete - Ready for Review (awaiting Unity test)
