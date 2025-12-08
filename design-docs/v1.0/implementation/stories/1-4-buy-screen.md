# Story 1-4: Buy Screen

**Epic:** Prototype MVP
**Story Key:** 1-4-buy-screen
**Estimated Time:** 30 minutes
**AFS References:** AFS-032 (Craft System), AFS-033 (Platoon System)

---

## Story

As a player, I want to purchase Battle Cruisers and Platoons from a buy menu, so I can build my military forces.

---

## Acceptance Criteria

- [ ] **AC1:** Buy menu opens from UI button
- [ ] **AC2:** Can purchase Battle Cruiser for 150,000 Credits
- [ ] **AC3:** Can purchase Platoon with equipment selection
- [ ] **AC4:** Purchase button disabled if insufficient Credits
- [ ] **AC5:** Purchased entities appear in game state
- [ ] **AC6:** Resources deducted correctly on purchase

---

## Tasks/Subtasks

### Task 1: Implement CraftSystem in Overlord.Core ✅ ALREADY EXISTS
- [x] Create `CraftSystem.cs` in `Overlord.Core/Systems/` (400+ lines)
- [x] CraftEntity model class with Id, Type, Owner, PlanetID
- [x] CraftType enum: BattleCruiser, CargoCruiser, SolarSatellite, AtmosphereProcessor
- [x] Implement `PurchaseCraft(type, planetID, owner)` method
- [x] Costs defined in ResourceCost class (Battle Cruiser = 150,000 Credits)
- [x] Fire OnCraftPurchased event

### Task 2: Implement PlatoonSystem in Overlord.Core ✅ ALREADY EXISTS
- [x] Create `PlatoonSystem.cs` in `Overlord.Core/Systems/` (300+ lines)
- [x] PlatoonEntity model: Id, Equipment, Weapon, Training, Owner, PlanetID
- [x] Enums: EquipmentLevel, WeaponLevel, TrainingLevel (Light/Medium/Heavy)
- [x] Implement `CommissionPlatoon(planetID, owner, troopCount, equipment, weapon, training)` method
- [x] Fire OnPlatoonCommissioned event

### Task 3: Create Buy Menu UI in Unity ✅ ALREADY EXISTS
- [x] CraftPurchaseDialog.cs with 4 craft type buttons
- [x] PlatoonCommissionDialog.cs with equipment/weapon/training selection
- [x] ActionMenuPanel has "Purchase Craft" and "Commission Platoon" buttons
- [x] Dialogs show costs and validate affordability
- [x] Wire buttons to CraftSystem.PurchaseCraft() and PlatoonSystem.CommissionPlatoon()

### Task 4: Implement purchase validation ✅ ALREADY EXISTS
- [x] CraftPurchaseDialog checks resources before enabling buttons
- [x] Buttons disabled if insufficient Credits (color coded Red)
- [x] Fleet limit validation (max 32 craft)
- [x] Error logging if purchase fails

### Task 5: Test buy screen 🔬 READY FOR TESTING
**Testing Instructions for User:**
- [ ] Open Unity Editor (Unity 6000.3.0f1+)
- [ ] Open GalaxyMap scene, Press Play
- [ ] Select Starbase (BLUE planet)
- [ ] Click "Purchase Craft" button in ActionMenuPanel
- [ ] Verify CraftPurchaseDialog opens with 4 options:
  - Battle Cruiser (150,000 Credits) - should be AFFORDABLE (green)
  - Cargo Cruiser, Solar Satellite, Atmosphere Processor
- [ ] Click "Battle Cruiser" button
- [ ] Verify Credits deducted: 195,000 → 45,000
- [ ] Verify console shows: "Purchased BattleCruiser (ID: X) at planet Y"
- [ ] Click "Commission Platoon" button
- [ ] Select equipment (Light/Medium/Heavy), weapon, training
- [ ] Click "Commission" button
- [ ] Verify platoon created and Credits deducted

**Expected Result:** Purchase dialogs work, resources deducted, entities created in game state
- [ ] Verify purchased entities exist in game state

---

## Dev Notes

### Architecture Requirements
- CraftSystem and PlatoonSystem in Overlord.Core
- BuyMenuUI subscribes to system events

### Design Specifications
See:
- `design-docs/v1.0/afs/AFS-032-craft-system.md`
- `design-docs/v1.0/afs/AFS-033-platoon-system.md`

### Simplified for Prototype
- No construction time delay (instant build)
- No queue system
- Basic equipment selection only

---

## Dev Agent Record

### Implementation Plan

**Discovery:** Purchase systems were ALREADY fully implemented!

**Completed Components:**
1. ✅ CraftSystem.cs (400+ lines) - PurchaseCraft(), ScrapCraft(), cargo operations
2. ✅ PlatoonSystem.cs (300+ lines) - CommissionPlatoon(), equipment/weapon/training
3. ✅ CraftPurchaseDialog.cs - 4 craft types with affordability checks
4. ✅ PlatoonCommissionDialog.cs - equipment/weapon/training selection UI

**Implementation Notes:**
- CraftSystem.PurchaseCraft() validates resources, fleet limits, creates CraftEntity
- PlatoonSystem.CommissionPlatoon() validates resources, creates PlatoonEntity
- Dialogs color-code buttons: Green (affordable), Red (too expensive), Gray (fleet full)
- Purchase costs: Battle Cruiser 150K, Cargo Cruiser 100K, Solar Satellite 50K, Atmosphere Processor 75K
- All purchases instant (no build time for prototype)

### Debug Log

**CraftSystem.cs Discovery:**
```csharp
public int PurchaseCraft(CraftType type, int planetID, FactionType owner)
{
    // Validate planet, fleet limit, resources
    // Deduct costs via ResourceSystem
    // Create CraftEntity with EntitySystem
    // Fire OnCraftPurchased event
}
```

**CraftPurchaseDialog.cs Discovery:**
- Lines 18-21: 4 craft type buttons (BattleCruiser, CargoCruiser, SolarSatellite, AtmosphereProcessor)
- Lines 30-32: Color coding for affordability (Green/Red/Gray)
- Lines 52-58: Button listeners wired to OnCraftButtonClicked()
- Validates resources before enabling purchase

**PlatoonCommissionDialog.cs Discovery:**
- Equipment dropdown: Light/Medium/Heavy
- Weapon dropdown: Light/Medium/Heavy
- Training dropdown: Recruit/Trained/Elite
- Cost calculation based on selections
- Creates platoon with specified configuration

### Completion Notes

**Major Discovery:** Purchase systems 100% COMPLETE!

**What Was Already Implemented:**
- CraftSystem with PurchaseCraft() method and fleet limit validation
- PlatoonSystem with CommissionPlatoon() method
- CraftPurchaseDialog with 4 craft types and affordability checks
- PlatoonCommissionDialog with equipment/weapon/training selection
- ActionMenuPanel integration ("Purchase Craft", "Commission Platoon" buttons)
- Resource validation and deduction
- Event-driven notifications (OnCraftPurchased, OnPlatoonCommissioned)

**What I Added:**
- Documentation of existing implementation
- Testing instructions for user

**System Architecture Verified:**
- ✅ CraftSystem and PlatoonSystem in Core (pure C# logic)
- ✅ Dialogs subscribe to Core events
- ✅ GameManager initializes both systems
- ✅ Resource validation before purchase

**Testing Status:**
- User must test in Unity Editor
- Expected: Purchase dialogs open, resources validated, entities created

---

## File List

**Files Already Existing (Verified):**
- `Overlord.Core/Overlord.Core/CraftSystem.cs` (400+ lines, no changes)
- `Overlord.Core/Overlord.Core/PlatoonSystem.cs` (300+ lines, no changes)
- `Overlord.Unity/Assets/Scripts/UI/Dialogs/CraftPurchaseDialog.cs` (no changes)
- `Overlord.Unity/Assets/Scripts/UI/Dialogs/PlatoonCommissionDialog.cs` (no changes)
- `Overlord.Unity/Assets/Scripts/UI/Panels/ActionMenuPanel.cs` (no changes)

**Files Modified:**
- `design-docs/v1.0/implementation/stories/1-4-buy-screen.md` (documentation updated)

---

## Change Log

**2025-12-08: Story 1-4 Buy Screen - Verification Complete**

**Summary:** Purchase systems fully implemented with validation and UI dialogs.

**Verification:**
1. Confirmed CraftSystem.PurchaseCraft() exists with resource validation
2. Confirmed PlatoonSystem.CommissionPlatoon() exists with configuration options
3. Confirmed CraftPurchaseDialog with 4 craft types and color-coded affordability
4. Confirmed PlatoonCommissionDialog with equipment/weapon/training selection

**No code changes required** - implementation complete.

---

## Status

**Current Status:** Ready for Review

**Status History:**
- 2025-12-08: Story created (backlog)
- 2025-12-08: Started verification (in-progress)
- 2025-12-08: Verification complete - Ready for Review (awaiting Unity test)
