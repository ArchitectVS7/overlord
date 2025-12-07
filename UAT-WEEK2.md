# Week 2 UAT: Functional Testing Only

**Prerequisites**: UI components wired in Unity (run EditorUIBuilder.cs first if not done)
**Test Time**: ~15 minutes

---

## TASK 4: Dialogs Open/Close, Show Correct Data

### 4.1 BuildingPickerDialog
1. Play mode → Select player planet → Click "Build Structure"
2. **Verify**: Dialog visible, title = "SELECT STRUCTURE TO BUILD"
3. **Verify**: 5 building costs displayed (check against Core values below)
4. **Verify**: Click Cancel → dialog closes

**Expected Costs (from BuildingCosts class)**:
| Building | Credits | Minerals | Time |
|----------|---------|----------|------|
| DockingBay | ? | ? | ? |
| SurfacePlatform | ? | ? | ? |
| MiningStation | ? | ? | ? |
| HorticulturalStation | ? | ? | ? |
| OrbitalDefense | ? | ? | ? |

**Result**: [ ] PASS / [ ] FAIL - Notes: ___________

---

### 4.2 CraftPurchaseDialog
1. Click "Purchase Craft"
2. **Verify**: Title = "PURCHASE CRAFT"
3. **Verify**: 4 craft types with costs and crew requirements shown
4. **Verify**: Cancel closes dialog

**Result**: [ ] PASS / [ ] FAIL - Notes: ___________

---

### 4.3 PlatoonCommissionDialog
1. Click "Commission Platoon"
2. **Verify**: Slider moves (1-200), text updates
3. **Verify**: Equipment dropdown has 5 options (Civilian→Elite)
4. **Verify**: Weapon dropdown has 4 options (Pistol→Plasma)
5. **Verify**: Cost/Strength preview updates when controls change
6. **Verify**: Cancel closes dialog

**Result**: [ ] PASS / [ ] FAIL - Notes: ___________

---

### 4.4 ResearchDialog
1. Click "Research Weapons"
2. **Verify**: Current tier shown (Laser/Missile/PhotonTorpedo)
3. **Verify**: Next tier cost/time shown OR "MAX TIER REACHED"
4. **Verify**: Cancel closes dialog

**Result**: [ ] PASS / [ ] FAIL - Notes: ___________

---

### 4.5 TaxRateDialog
1. Select player planet → Click "Set Tax Rate"
2. **Verify**: Slider moves (0-100%), text updates
3. **Verify**: Revenue preview updates with slider
4. **Verify**: Morale impact: 0% = Green(+), 50% = Yellow(0), 100% = Red(-)
5. **Verify**: Cancel closes dialog

**Result**: [ ] PASS / [ ] FAIL - Notes: ___________

---

## TASK 11: Resource Deduction & Validation

### 11.1 Build Structure - Deduction
1. Note credits/minerals before
2. Build DockingBay → Confirm
3. **Verify**: Credits decreased by DockingBay cost
4. **Verify**: Console shows "Started construction..."

Before: Credits=_____ Minerals=_____
After:  Credits=_____ Minerals=_____
**Result**: [ ] PASS / [ ] FAIL

---

### 11.2 Build Structure - Validation
1. Set planet to 0 credits (or use poor planet)
2. Open BuildingPickerDialog
3. **Verify**: Buttons red/disabled for unaffordable
4. **Verify**: Cannot build, no resource change

**Result**: [ ] PASS / [ ] FAIL

---

### 11.3 Purchase Craft - Deduction
1. Note credits/population before
2. Purchase BattleCruiser → Confirm
3. **Verify**: Credits decreased
4. **Verify**: Population decreased by crew requirement
5. **Verify**: FleetPanel shows new craft

Before: Credits=_____ Pop=_____
After:  Credits=_____ Pop=_____
**Result**: [ ] PASS / [ ] FAIL

---

### 11.4 Commission Platoon - Deduction
1. Note credits/population before
2. Commission 50 troops (Basic/Rifle) → Confirm
3. **Verify**: Credits decreased by displayed cost
4. **Verify**: Population decreased by 50

Before: Credits=_____ Pop=_____
After:  Credits=_____ Pop=_____
**Result**: [ ] PASS / [ ] FAIL

---

### 11.5 Research - Deduction
1. Note credits before
2. Start research → Confirm
3. **Verify**: Credits decreased by research cost
4. **Verify**: Reopen dialog shows "Researching..." with turns remaining

Before: Credits=_____
After:  Credits=_____
**Result**: [ ] PASS / [ ] FAIL

---

### 11.6 Tax Rate - State Update
1. Set tax to 75% → Confirm
2. Reopen TaxRateDialog
3. **Verify**: Current rate shows 75%

**Result**: [ ] PASS / [ ] FAIL

---

### 11.7 End Turn
1. Click "End Turn"
2. **Verify**: Phase advances (check console)
3. **Verify**: Click repeatedly until turn number increments

**Result**: [ ] PASS / [ ] FAIL

---

## SUMMARY

**Task 4 (Dialogs)**: ___/5 passed
**Task 11 (Resources)**: ___/7 passed
**Total**: ___/12 passed

**Critical Issues**:
1. ___________
2. ___________

**Mark complete in todo.md when**: 11/12 tests pass (≥90%)
