# AFS-076: Platoon Management UI

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-005

---

## Summary

User interface for managing military platoons including commissioning new units, viewing status, assigning equipment/weapons/training upgrades, loading onto Battle Cruisers, and decommissioning obsolete forces.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Access to platoon data
- **AFS-033 (Platoon System)**: Platoon entity structure and operations
- **AFS-038 (Equipment System)**: Equipment level upgrades
- **AFS-039 (Weapons System)**: Weapons level upgrades
- **AFS-040 (Training System)**: Training percentage mechanics
- **AFS-034 (Spacecraft Details)**: Battle Cruiser platoon capacity
- **AFS-071 (Main Screen)**: Navigation to Platoon Management screen

---

## Requirements

### Screen Layout (FR-UI-005)

#### 1. Screen Structure

**Primary Components:**
- **Header Bar:** Planet name, current turn, resource summary
- **Platoon Roster Panel (Left):** Scrollable list of all player platoons
- **Platoon Details Panel (Right):** Selected platoon information
- **Action Buttons (Bottom):** Commission, Decommission, Assign to Battle Cruiser
- **Quick Stats Bar (Top):** Total platoons, total troops, training average, equipment/weapons levels

**Screen Division:**
```
┌─────────────────────────────────────────────────┐
│ Planet: Starbase | Turn: 15 | Credits: 45,000   │
│ Platoons: 8/24 | Troops: 1,200 | Avg Training: 85%│
├──────────────────┬──────────────────────────────┤
│ PLATOON ROSTER   │ PLATOON DETAILS              │
│                  │                              │
│ ☑ Platoon 01     │ Platoon 03                   │
│   150 troops     │ ────────────────             │
│   100% trained   │ Troop Count: 175             │
│                  │ Training: 100%               │
│ ☑ Platoon 02     │ Equipment: Level 2           │
│   200 troops     │ Weapons: Level 3             │
│   95% trained    │ Location: Starbase (Garrison)│
│                  │                              │
│ ☐ Platoon 03     │ Combat Strength: 525         │
│   175 troops     │ (175 × 3.0 multiplier)       │
│   100% trained   │                              │
│                  │ [Assign to Battle Cruiser]   │
│ ☐ Platoon 04     │ [Begin Training]             │
│   125 troops     │ [Upgrade Equipment]          │
│   75% trained    │ [Upgrade Weapons]            │
│                  │                              │
│ [Under Const.]   │ Upgrade Costs:               │
│   Platoon 05     │ Equipment Lvl 3: 50,000 Cr   │
│   3 turns left   │ Weapons Lvl 4: 60,000 Cr     │
│                  │                              │
├──────────────────┴──────────────────────────────┤
│ [Commission New Platoon] [Decommission Selected]│
└─────────────────────────────────────────────────┘
```

#### 2. Platoon Roster Panel

**Roster Entry Display:**
- **Platoon ID:** "Platoon 01" (sequential numbering)
- **Troop Count:** "150 troops" (1-200 range)
- **Training Status:** "100% trained" (0-100% progress)
- **Selection Indicator:** Checkbox or highlight for selected platoon
- **Visual State:** Color-coded by status (Operational: green, Training: yellow, Under Construction: gray)

**Roster Actions:**
- **Click to Select:** Single-click highlights platoon, displays details in right panel
- **Multi-Select (Optional):** Shift+click to select multiple for batch operations
- **Scroll:** Vertical scrolling for >10 platoons
- **Sort Options:** By ID, Troop Count, Training %, Location

**Under Construction Indicator:**
- Display platoons currently being commissioned
- Format: "[Under Construction] Platoon 05 (3 turns remaining)"
- Gray-out, cannot select for operations until complete

#### 3. Platoon Details Panel

**Information Sections:**

**A. Basic Stats:**
- **Platoon ID:** "Platoon 03"
- **Troop Count:** "175 troops"
- **Training Percentage:** "100% trained" (progress bar 0-100%)
- **Equipment Level:** "Level 2" (1-10 scale)
- **Weapons Level:** "Level 3" (1-10 scale)
- **Location:** "Starbase (Garrison)" or "Battle Cruiser BC-01 (Traveling)" or "Planet Surface (Deployed)"

**B. Combat Strength Calculation:**
- **Formula Display:** `Combat Strength = Troops × Combat Multiplier`
- **Multiplier Breakdown:**
  - Base: 1.0
  - Equipment: +0.5 per level (Level 2 = +1.0)
  - Weapons: +0.5 per level (Level 3 = +1.5)
  - Training: +1.0 if 100% trained
  - **Total Multiplier:** 1.0 + 1.0 + 1.5 + 1.0 = 4.5
- **Example:** "Combat Strength: 787 (175 × 4.5)"
- **Visual:** Bar chart comparing to average platoon strength

**C. Upgrade Options:**
- **Equipment Upgrade Button:** "Upgrade to Level 3 (50,000 Credits)"
- **Weapons Upgrade Button:** "Upgrade to Level 4 (60,000 Credits)"
- **Training Button:** "Begin Training" (if <100%) or "Fully Trained" (if 100%)
- **Disabled State:** Grayed out if insufficient Credits or already max level

**D. Assignment Actions:**
- **Assign to Battle Cruiser:** Opens dropdown of available Battle Cruisers with capacity
- **Deploy to Surface:** (Future feature, planetary defense assignments)
- **Transfer to Planet:** Opens dropdown of player-controlled planets

#### 4. Commission New Platoon

**Commission Dialog:**
```
┌─────────────────────────────────────┐
│ Commission New Platoon              │
│                                     │
│ Troop Count: [150] (1-200 slider)  │
│                                     │
│ Initial Equipment Level: [1]        │
│ Initial Weapons Level: [1]          │
│                                     │
│ Cost Breakdown:                     │
│ - Base Cost: 10,000 Credits         │
│ - Troops (150): 15,000 Credits      │
│ - Equipment Lvl 1: 10,000 Credits   │
│ - Weapons Lvl 1: 10,000 Credits     │
│ ─────────────────────────────────   │
│ Total: 45,000 Credits               │
│                                     │
│ Build Time: 4 turns                 │
│                                     │
│ [Confirm] [Cancel]                  │
└─────────────────────────────────────┘
```

**Validation:**
- Cannot commission if player owns 24 platoons (max limit)
- Cannot commission if insufficient Credits
- Cannot commission if population < troop count requested
- Slider dynamically updates cost preview

**Process:**
1. Player clicks "Commission New Platoon" button
2. Dialog opens with default values (150 troops, Level 1/1)
3. Player adjusts sliders, sees real-time cost update
4. Player clicks Confirm
5. Deduct Credits, deduct population, add to construction queue
6. Dialog closes, roster updates with "[Under Construction] Platoon XX"

#### 5. Decommission Platoon

**Decommission Confirmation:**
```
┌─────────────────────────────────────┐
│ Decommission Platoon 04?            │
│                                     │
│ This will permanently remove:       │
│ - 125 troops                        │
│ - Equipment Level 2                 │
│ - Weapons Level 2                   │
│                                     │
│ Refund: 15,000 Credits (30% of cost)│
│                                     │
│ WARNING: This cannot be undone.     │
│                                     │
│ [Confirm Decommission] [Cancel]     │
└─────────────────────────────────────┘
```

**Refund Calculation:**
- **Base Cost:** 10,000 + (Troops × 100)
- **Equipment Cost:** Level × 10,000
- **Weapons Cost:** Level × 10,000
- **Total Original Cost:** Sum of above
- **Refund:** 30% of Total Original Cost
- **Example:** Platoon 04 (125 troops, Eq 2, Wpn 2) = 10K + 12.5K + 20K + 20K = 62.5K → Refund 18.75K

**Process:**
1. Select platoon, click "Decommission Selected"
2. Confirmation dialog displays refund amount
3. Player confirms
4. Remove platoon from GameState, add refund Credits
5. Roster updates immediately

#### 6. Training Interface

**Training Progress Indicator:**
- **Progress Bar:** Visual 0-100% bar with percentage text
- **Turns Remaining:** "3 turns to 100% training" (calculated)
- **Training Speed:** 25% per turn (default, 4 turns to full)
- **Status Text:** "Training in Progress" or "Fully Trained"

**Begin Training Button:**
- Only visible if Training < 100%
- Click toggles platoon to "Training" state
- Training auto-increments each turn until 100%
- No additional cost (included in maintenance)

**Visual Feedback:**
- Training platoons show yellow highlight in roster
- Training icon animates (rotating target reticle)
- Training complete notification in message log

#### 7. Equipment and Weapons Upgrades

**Upgrade Button States:**
- **Available:** "Upgrade Equipment to Level 3 (50,000 Credits)"
- **Insufficient Credits:** "Upgrade Equipment to Level 3 (50,000 Credits) - INSUFFICIENT FUNDS" (red text, disabled)
- **Max Level:** "Equipment Level 10 (MAX)" (gray text, disabled)

**Upgrade Confirmation:**
```
┌─────────────────────────────────────┐
│ Upgrade Equipment to Level 3?       │
│                                     │
│ Current: Level 2                    │
│ New: Level 3                        │
│                                     │
│ Cost: 50,000 Credits                │
│ Combat Strength Increase: +87       │
│ (175 troops × +0.5 multiplier)      │
│                                     │
│ [Confirm] [Cancel]                  │
└─────────────────────────────────────┘
```

**Process:**
1. Click upgrade button
2. Confirmation dialog shows cost and benefit
3. Deduct Credits, increment Equipment or Weapons level
4. Details panel updates combat strength immediately

#### 8. Battle Cruiser Assignment

**Assign to Battle Cruiser Dialog:**
```
┌─────────────────────────────────────┐
│ Assign Platoon 03 to Battle Cruiser│
│                                     │
│ Available Battle Cruisers:          │
│ ○ BC-01 (3/4 platoons) - Starbase   │
│ ○ BC-02 (1/4 platoons) - Traveling  │
│ ○ BC-03 (4/4 platoons) - FULL       │
│                                     │
│ [Assign to Selected] [Cancel]       │
└─────────────────────────────────────┘
```

**Validation:**
- Only show Battle Cruisers at same planet as platoon
- Gray out full Battle Cruisers (4/4 platoons)
- Cannot assign if platoon already aboard a Battle Cruiser

**Process:**
1. Click "Assign to Battle Cruiser"
2. Dialog shows available Battle Cruisers with capacity
3. Select Battle Cruiser, click Assign
4. Platoon location updates to "Battle Cruiser BC-01"
5. Battle Cruiser platoon list updates

---

## Acceptance Criteria

### Functional Criteria

- [ ] Roster displays all player platoons with troop count, training %, selection indicator
- [ ] Clicking roster entry displays full details in right panel
- [ ] Details panel shows troop count, training, equipment, weapons, location, combat strength
- [ ] Combat strength calculation displays formula and real-time multiplier breakdown
- [ ] Commission New Platoon dialog allows troop count 1-200, equipment/weapons levels 1-10
- [ ] Cost preview updates dynamically as sliders adjusted
- [ ] Cannot commission if >24 platoons, insufficient Credits, or insufficient population
- [ ] Decommission displays confirmation with 30% refund calculation
- [ ] Training progress bar shows 0-100%, increments 25% per turn automatically
- [ ] Equipment/Weapons upgrade buttons show cost, disabled if insufficient Credits or max level
- [ ] Assign to Battle Cruiser shows only available Battle Cruisers with capacity
- [ ] Platoons under construction display "[Under Construction]" with turns remaining

### UI and Visual Criteria

- [ ] Roster entries color-coded: green (operational), yellow (training), gray (under construction)
- [ ] Selected platoon highlighted in roster
- [ ] Combat strength bar chart shows comparison to average
- [ ] Training progress bar animates smoothly
- [ ] Upgrade buttons display red text if insufficient Credits
- [ ] Scrollbar appears for >10 platoons in roster
- [ ] All dialogs centered, semi-transparent overlay behind

### Mobile UI Criteria

- [ ] Roster and Details panels stack vertically on mobile (<600px width)
- [ ] Touch targets ≥44×44 points for all buttons
- [ ] Sliders use mobile-optimized touch input
- [ ] Dialogs full-screen on mobile for easier interaction
- [ ] Swipe left/right to navigate between platoons (mobile only)

### Performance Criteria

- [ ] Roster renders <100ms for 24 platoons
- [ ] Details panel updates <50ms on selection change
- [ ] Combat strength calculation <10ms
- [ ] Commission/Decommission operations complete <200ms

---

## Implementation Notes

### State Management

**Platoon Selection State:**
```csharp
class PlatoonManagementUI : MonoBehaviour {
    int selectedPlatoonID = -1;  // -1 = none selected

    void OnPlatoonSelected(int platoonID) {
        selectedPlatoonID = platoonID;
        UpdateDetailsPanel();
    }

    void UpdateDetailsPanel() {
        if (selectedPlatoonID == -1) {
            detailsPanel.SetActive(false);
            return;
        }

        Platoon platoon = GameManager.Instance.GameState.GetPlatoon(selectedPlatoonID);
        DisplayPlatoonDetails(platoon);
    }
}
```

### Combat Strength Display

**Real-Time Calculation:**
```csharp
void DisplayCombatStrength(Platoon platoon) {
    float multiplier = 1.0f;
    multiplier += platoon.EquipmentLevel * 0.5f;
    multiplier += platoon.WeaponsLevel * 0.5f;
    if (platoon.TrainingPercentage >= 100) {
        multiplier += 1.0f;
    }

    int combatStrength = Mathf.RoundToInt(platoon.TroopCount * multiplier);

    combatStrengthText.text = $"Combat Strength: {combatStrength}";
    combatStrengthFormula.text = $"({platoon.TroopCount} troops × {multiplier:F1} multiplier)";

    // Update breakdown
    breakdownText.text = $"Base: 1.0\nEquipment: +{platoon.EquipmentLevel * 0.5f:F1}\nWeapons: +{platoon.WeaponsLevel * 0.5f:F1}\nTraining: +{(platoon.TrainingPercentage >= 100 ? 1.0f : 0.0f):F1}";
}
```

### Commission Platoon

**Dialog Integration:**
```csharp
void OnCommissionButtonClicked() {
    if (GameState.Platoons.Count >= 24) {
        ShowError("Maximum 24 platoons allowed");
        return;
    }

    CommissionDialog.Show(
        onConfirm: (troopCount, equipLevel, weaponLevel) => {
            int cost = CalculateCommissionCost(troopCount, equipLevel, weaponLevel);

            if (GameState.Credits < cost) {
                ShowError("Insufficient Credits");
                return;
            }

            if (GameState.GetPlanet(currentPlanetID).Population < troopCount) {
                ShowError("Insufficient Population");
                return;
            }

            // Create platoon (under construction)
            var platoon = new Platoon {
                TroopCount = troopCount,
                EquipmentLevel = equipLevel,
                WeaponsLevel = weaponLevel,
                TrainingPercentage = 0,
                TurnsRemaining = 4
            };

            GameManager.Instance.PlatoonSystem.CommissionPlatoon(platoon, currentPlanetID);
            RefreshRoster();
        }
    );
}

int CalculateCommissionCost(int troops, int equipLevel, int weaponLevel) {
    return 10000 + (troops * 100) + (equipLevel * 10000) + (weaponLevel * 10000);
}
```

### Decommission Platoon

**Refund Calculation:**
```csharp
void OnDecommissionButtonClicked() {
    if (selectedPlatoonID == -1) return;

    Platoon platoon = GameState.GetPlatoon(selectedPlatoonID);
    int originalCost = CalculateCommissionCost(
        platoon.TroopCount,
        platoon.EquipmentLevel,
        platoon.WeaponsLevel
    );
    int refund = Mathf.RoundToInt(originalCost * 0.3f);

    ConfirmDialog.Show(
        $"Decommission Platoon {platoon.ID}?\n\nRefund: {refund} Credits",
        onConfirm: () => {
            GameManager.Instance.PlatoonSystem.DecommissionPlatoon(selectedPlatoonID);
            GameState.Credits += refund;
            selectedPlatoonID = -1;
            RefreshRoster();
        }
    );
}
```

### Battle Cruiser Assignment

**Available Battle Cruisers Query:**
```csharp
void OnAssignToBattleCruiserClicked() {
    Platoon platoon = GameState.GetPlatoon(selectedPlatoonID);

    // Find Battle Cruisers at same planet with capacity
    var availableBCs = GameState.Craft
        .Where(c => c.Type == CraftType.BattleCruiser)
        .Where(c => c.Owner == FactionType.Player)
        .Where(c => c.CurrentPlanetID == platoon.CurrentPlanetID)
        .Where(c => c.GetPlatoonCount() < 4)
        .ToList();

    if (availableBCs.Count == 0) {
        ShowError("No available Battle Cruisers at this location");
        return;
    }

    AssignBattleCruiserDialog.Show(availableBCs, onConfirm: (battleCruiserID) => {
        GameManager.Instance.PlatoonSystem.AssignToBattleCruiser(selectedPlatoonID, battleCruiserID);
        RefreshRoster();
    });
}
```

---

## Testing Scenarios

### Commission Tests

1. **Commission New Platoon:**
   - Given player has 100,000 Credits and 500 population
   - When player commissions 150-troop platoon with Eq 1, Wpn 1
   - Then cost = 45,000 Credits, population reduced by 150, platoon added to construction queue (4 turns)

2. **Commission Limit Enforcement:**
   - Given player owns 24 platoons
   - When player clicks "Commission New Platoon"
   - Then error message displays "Maximum 24 platoons allowed"

### Decommission Tests

1. **Decommission with Refund:**
   - Given platoon with 125 troops, Eq 2, Wpn 2 (original cost 62,500)
   - When player decommissions platoon
   - Then refund = 18,750 Credits added to player resources

2. **Decommission Removes from Battle Cruiser:**
   - Given platoon aboard Battle Cruiser BC-01
   - When player decommissions platoon
   - Then platoon removed from Battle Cruiser, capacity now 3/4

### Combat Strength Tests

1. **Combat Strength Display:**
   - Given platoon with 175 troops, Eq 2, Wpn 3, Training 100%
   - When details panel displayed
   - Then combat strength = 787 (175 × 4.5 multiplier)

2. **Multiplier Breakdown:**
   - Given platoon with Eq 5, Wpn 3, Training 100%
   - When details panel displayed
   - Then breakdown shows: Base 1.0, Eq +2.5, Wpn +1.5, Training +1.0 = 6.0

### Battle Cruiser Assignment Tests

1. **Assign to Available Battle Cruiser:**
   - Given BC-01 has 2/4 platoons at Starbase
   - When player assigns Platoon 03 to BC-01
   - Then BC-01 shows 3/4 platoons, Platoon 03 location = "Battle Cruiser BC-01"

2. **Cannot Assign to Full Battle Cruiser:**
   - Given BC-02 has 4/4 platoons
   - When assign dialog displayed
   - Then BC-02 grayed out with "(FULL)" indicator

---

## Future Enhancements (Post-MVP)

**Advanced Features:**
- Batch operations (upgrade multiple platoons simultaneously)
- Platoon templates (save configurations for quick commissioning)
- Platoon renaming (custom names vs "Platoon 01")
- Detailed combat history per platoon (battles fought, wins/losses)
- Veterancy system (platoons gain bonuses from combat experience)

**Visual Enhancements:**
- 3D platoon preview (troop formation visualization)
- Animated training sequences
- Equipment/Weapons 3D model previews
- Combat strength comparison graph (vs enemy platoons)

**Mobile Optimizations:**
- Swipe gestures for quick platoon navigation
- Haptic feedback for upgrade confirmations
- Simplified "Quick Upgrade" button (auto-upgrade to highest affordable level)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-033 (Platoon System), AFS-038-040 (Equipment/Weapons/Training), AFS-034 (Battle Cruiser)
