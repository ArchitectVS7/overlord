# AFS-077: Cargo Bay UI

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-006

---

## Summary

User interface for managing spacecraft docking, cargo loading/unloading on Cargo Cruisers, platoon boarding/disembarking on Battle Cruisers, crew assignment, fuel management, and launching craft from planetary orbit.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Access to craft and planet data
- **AFS-032 (Craft System)**: Craft entity operations
- **AFS-034 (Spacecraft Details)**: Battle Cruiser and Cargo Cruiser specs
- **AFS-033 (Platoon System)**: Platoon loading operations
- **AFS-021 (Resource System)**: Resource transfer operations
- **AFS-014 (Navigation System)**: Launch and journey initiation
- **AFS-071 (Main Screen)**: Navigation to Cargo Bay screen

---

## Requirements

### Screen Layout (FR-UI-006)

#### 1. Screen Structure

**Primary Components:**
- **Header Bar:** Planet name, current turn, docking capacity indicator
- **Docked Craft Panel (Left):** List of craft in Docking Bays
- **Craft Details Panel (Center):** Selected craft cargo/platoons, fuel, crew
- **Planet Resources Panel (Right):** Available resources for loading
- **Action Buttons (Bottom):** Launch, Load, Unload, Assign Crew, Refuel

**Screen Division:**
```
┌─────────────────────────────────────────────────────────────┐
│ Planet: Starbase | Turn: 15 | Docking Bays: 3/3 Occupied    │
├──────────────────┬────────────────────────────┬─────────────┤
│ DOCKED CRAFT     │ CRAFT DETAILS              │ PLANET      │
│                  │                            │ RESOURCES   │
│ ☐ BC-01          │ Battle Cruiser BC-01       │             │
│   Battle Cruiser │ ──────────────────────     │ Food: 2,500 │
│   3/4 platoons   │ Crew: 20/20 ✓              │ Minerals:   │
│                  │ Fuel: 180/200 ⚠            │   1,200     │
│ ☑ CC-01          │                            │ Fuel: 800   │
│   Cargo Cruiser  │ PLATOONS ABOARD (3/4):     │ Energy: 650 │
│   2,500 cargo    │ • Platoon 01 (150 troops)  │ Credits:    │
│                  │ • Platoon 03 (175 troops)  │   45,000    │
│ ☐ CC-02          │ • Platoon 04 (125 troops)  │             │
│   Cargo Cruiser  │                            │ Population: │
│   Empty          │ [Unload Platoon]           │   1,500     │
│                  │ [Load Platoon from Planet] │             │
│ [Orbit: BC-02]   │                            │ GARRISON    │
│   Battle Cruiser │ ──────────────────────     │ PLATOONS    │
│   Traveling      │ [Launch to Navigation]     │             │
│                  │ [Assign Crew] [Refuel]     │ ☐ Plat. 02  │
│                  │                            │   200 troops│
│                  │                            │ ☐ Plat. 05  │
│                  │                            │   140 troops│
│                  │                            │             │
│                  │                            │ [Load →]    │
├──────────────────┴────────────────────────────┴─────────────┤
│ [Launch Selected Craft] [Transfer Resources] [Close]        │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Docked Craft Panel

**Craft List Entry:**
- **Craft ID:** "BC-01" or "CC-01" (Battle Cruiser or Cargo Cruiser)
- **Craft Type Icon:** Visual indicator (warship vs cargo ship)
- **Capacity Summary:** "3/4 platoons" or "2,500 cargo" or "Empty"
- **Selection Indicator:** Checkbox or highlight
- **State Icon:** Docked (anchor icon) vs Orbit (orbit ring icon)

**Orbital Craft Display:**
- **Separate Section:** "[Orbit: BC-02]" - craft not in docking bay
- **Limited Actions:** Cannot load/unload while in orbit, must land first
- **Launch Available:** Can launch from orbit without landing

**Docking Capacity Indicator:**
- **Header Display:** "Docking Bays: 3/3 Occupied" or "2/3 Available"
- **Color Coding:** Green (<3), Yellow (3/3), Red (overflowing, invalid state)
- **Warning:** "Docking Bay full - must launch craft before landing others"

#### 3. Craft Details Panel (Battle Cruiser)

**Battle Cruiser Information:**

**A. Crew and Fuel Status:**
- **Crew:** "Crew: 20/20 ✓" (green checkmark if minimum met)
- **Fuel:** "Fuel: 180/200 ⚠" (yellow warning if <50, red critical if <20)
- **Visual:** Progress bars for crew and fuel

**B. Platoons Aboard:**
- **Section Title:** "PLATOONS ABOARD (3/4):"
- **Platoon List:**
  - "• Platoon 01 (150 troops, 100% trained)"
  - "• Platoon 03 (175 troops, 100% trained)"
  - "• Platoon 04 (125 troops, 75% trained)"
- **Empty Slots:** "• [Empty Slot]" (clickable to load platoon)

**C. Platoon Actions:**
- **Unload Button:** "Unload Platoon 01" (select platoon first)
- **Load Button:** "Load Platoon from Planet" (opens platoon selection dialog)
- **Validation:** Cannot load if 4/4 full, cannot unload if traveling

**D. Craft Actions:**
- **Launch to Navigation:** Opens Navigation Screen with this craft preselected
- **Assign Crew:** Deduct 20 from planet population, set CrewCount = 20
- **Refuel:** Transfer fuel from planet stores to craft tank (up to 200 Fuel max)

#### 4. Craft Details Panel (Cargo Cruiser)

**Cargo Cruiser Information:**

**A. Crew and Fuel Status:**
- **Crew:** "Crew: 15/15 ✓"
- **Fuel:** "Fuel: 200/200 ✓"

**B. Cargo Hold:**
- **Section Title:** "CARGO HOLD (2,500 / 4,000):"
- **Resource Bars:**
  - "Food: 1,000 / 1,000 ████████████" (full bar)
  - "Minerals: 500 / 1,000 ██████░░░░░░" (half bar)
  - "Fuel: 800 / 1,000 ████████░░░░" (80% bar)
  - "Energy: 200 / 1,000 ██░░░░░░░░░░" (20% bar)
- **Total:** "Total Cargo: 2,500 / 4,000 units"

**C. Passenger Count:**
- **Display:** "Passengers: 150 / 200"
- **Visual:** Progress bar

**D. Cargo Actions:**
- **Load Resources Button:** Opens resource transfer dialog
- **Unload Resources Button:** Opens unload dialog (reverses transfer)
- **Load Passengers Button:** Opens population transfer dialog
- **Validation:** Cannot exceed 1,000 per resource type, 200 passengers

#### 5. Planet Resources Panel

**Resource Display:**
- **Food:** "Food: 2,500"
- **Minerals:** "Minerals: 1,200"
- **Fuel:** "Fuel: 800"
- **Energy:** "Energy: 650"
- **Credits:** "Credits: 45,000"
- **Population:** "Population: 1,500"

**Garrison Platoons:**
- **Section Title:** "GARRISON PLATOONS"
- **Platoon List:**
  - "☐ Platoon 02 (200 troops)"
  - "☐ Platoon 05 (140 troops)"
- **Load Button:** "[Load →]" - transfers selected platoon to selected Battle Cruiser

**Visual Feedback:**
- Resources highlighted in green if abundant (>1,000)
- Resources highlighted in yellow if low (<500)
- Resources highlighted in red if critical (<100)

#### 6. Load Resources Dialog (Cargo Cruiser)

**Resource Transfer Interface:**
```
┌─────────────────────────────────────────┐
│ Load Resources onto CC-01               │
│                                         │
│ Food:     [████░░░░░░] 500 units       │
│           (Planet: 2,500 → 2,000)       │
│           (Craft: 1,000/1,000 FULL)     │
│                                         │
│ Minerals: [██░░░░░░░░] 200 units       │
│           (Planet: 1,200 → 1,000)       │
│           (Craft: 500 → 700)            │
│                                         │
│ Fuel:     [░░░░░░░░░░] 0 units         │
│           (Planet: 800)                 │
│           (Craft: 800/1,000)            │
│                                         │
│ Energy:   [████░░░░░░] 400 units       │
│           (Planet: 650 → 250)           │
│           (Craft: 200 → 600)            │
│                                         │
│ Total: 1,100 units (900 available)      │
│                                         │
│ [Load Selected] [Cancel]                │
└─────────────────────────────────────────┘
```

**Slider Controls:**
- **Range:** 0 to min(Planet Available, Cargo Space Remaining)
- **Real-Time Preview:** Shows planet/craft changes as slider moves
- **Total Limit:** Cannot exceed 4,000 total cargo units
- **Validation:** Disabled if craft full or planet has 0 resources

**Process:**
1. Click "Load Resources" on Cargo Cruiser
2. Dialog opens with sliders for each resource type
3. Adjust sliders, see real-time planet/craft updates
4. Click "Load Selected"
5. Resources transferred from planet to craft
6. Dialog closes, Craft Details panel updates

#### 7. Unload Resources Dialog (Cargo Cruiser)

**Same Interface as Load, but reversed:**
- Sliders show craft cargo as source
- Transfer from craft to planet
- Validation: Cannot unload more than craft has

#### 8. Load/Unload Platoons (Battle Cruiser)

**Load Platoon Dialog:**
```
┌─────────────────────────────────────────┐
│ Load Platoon onto BC-01                 │
│                                         │
│ Available Platoons at Starbase:         │
│ ○ Platoon 02 (200 troops, 100% trained)│
│ ○ Platoon 05 (140 troops, 85% trained) │
│ ○ Platoon 07 (175 troops, 100% trained)│
│                                         │
│ Battle Cruiser Capacity: 3/4            │
│                                         │
│ [Load Selected Platoon] [Cancel]        │
└─────────────────────────────────────────┘
```

**Unload Platoon Dialog:**
```
┌─────────────────────────────────────────┐
│ Unload Platoon from BC-01               │
│                                         │
│ Platoons Aboard BC-01:                  │
│ ○ Platoon 01 (150 troops, 100% trained)│
│ ○ Platoon 03 (175 troops, 100% trained)│
│ ○ Platoon 04 (125 troops, 75% trained) │
│                                         │
│ [Unload to Planet Garrison] [Cancel]    │
└─────────────────────────────────────────┘
```

**Process:**
1. Select Battle Cruiser with <4 platoons
2. Click "Load Platoon from Planet"
3. Dialog shows garrison platoons
4. Select platoon, click Load
5. Platoon location updates from Planet → Battle Cruiser
6. Battle Cruiser capacity updates (3/4 → 4/4)

#### 9. Assign Crew

**Crew Assignment Confirmation:**
```
┌─────────────────────────────────────────┐
│ Assign Crew to CC-01?                   │
│                                         │
│ Required: 15 personnel                  │
│ Available: 1,500 population             │
│                                         │
│ This will deduct 15 from planet         │
│ population.                             │
│                                         │
│ [Confirm] [Cancel]                      │
└─────────────────────────────────────────┘
```

**Validation:**
- Cannot assign if planet population < required crew
- Cannot assign if craft already has crew
- Button disabled if crew already assigned

**Process:**
1. Select craft with CrewCount = 0
2. Click "Assign Crew"
3. Confirmation dialog displays
4. Deduct crew from planet population
5. Set craft CrewCount = minimum required
6. Craft state changes to Operational

#### 10. Refuel Craft

**Refuel Confirmation:**
```
┌─────────────────────────────────────────┐
│ Refuel CC-01?                           │
│                                         │
│ Current Fuel: 120 / 200                 │
│ Refuel Amount: 80 Fuel                  │
│                                         │
│ Planet Fuel: 800 → 720                  │
│                                         │
│ [Refuel] [Cancel]                       │
└─────────────────────────────────────────┘
```

**Validation:**
- Cannot refuel if planet Fuel = 0
- Cannot refuel if craft tank already full (200/200)
- Refuel amount = min(200 - CurrentFuel, Planet Fuel)

**Process:**
1. Select craft with <200 Fuel
2. Click "Refuel"
3. Confirmation shows fuel transfer amount
4. Deduct from planet, add to craft tank
5. Craft fuel bar updates to full

#### 11. Launch to Navigation

**Launch Validation:**
- **Crew Check:** Must have minimum crew assigned
- **Fuel Check:** Must have >0 Fuel
- **State Check:** Craft must be in Docking Bay or Orbit
- **Warning:** "Launch CC-01? This will move craft to Navigation Screen."

**Process:**
1. Select craft, click "Launch to Navigation"
2. Validation checks pass
3. Confirmation dialog
4. Craft state → Traveling
5. Navigation Screen opens with craft preselected
6. Cargo Bay screen updates, craft moves from "Docked" to "Orbit" section

---

## Acceptance Criteria

### Functional Criteria

- [ ] Docked craft list displays all craft at planet with type, capacity summary
- [ ] Selecting craft displays details: crew, fuel, cargo/platoons
- [ ] Battle Cruiser details show 4 platoon slots with load/unload buttons
- [ ] Cargo Cruiser details show 4 resource bars + passenger count
- [ ] Load Resources dialog allows slider control for each resource type
- [ ] Real-time preview updates planet/craft totals as sliders move
- [ ] Cannot exceed 1,000 per resource type or 4,000 total cargo
- [ ] Platoon load dialog shows garrison platoons, updates Battle Cruiser capacity
- [ ] Crew assignment deducts from planet population, enables craft operations
- [ ] Refuel transfers fuel from planet to craft up to 200 Fuel max
- [ ] Launch button opens Navigation Screen with craft preselected
- [ ] Cannot launch without crew or fuel

### UI and Visual Criteria

- [ ] Docking capacity indicator shows X/3 with color coding
- [ ] Fuel/crew progress bars color-coded (green >50%, yellow 20-50%, red <20%)
- [ ] Resource bars display current/max with visual fill percentage
- [ ] Orbital craft displayed in separate section from docked craft
- [ ] Selected craft highlighted in craft list
- [ ] Planet resources panel updates immediately after transfers
- [ ] Garrison platoons list scrollable if >5 platoons

### Mobile UI Criteria

- [ ] Panels stack vertically on mobile (<600px width)
- [ ] Resource sliders use mobile-optimized touch input
- [ ] Touch targets ≥44×44 points for all buttons
- [ ] Dialogs full-screen on mobile
- [ ] Swipe left/right to navigate between docked craft (mobile only)

### Performance Criteria

- [ ] Craft list renders <100ms for 32 craft
- [ ] Details panel updates <50ms on selection change
- [ ] Resource transfer operations complete <200ms
- [ ] Slider updates render <16ms (60 FPS)

---

## Implementation Notes

### State Management

**Selected Craft:**
```csharp
class CargoBayUI : MonoBehaviour {
    int selectedCraftID = -1;

    void OnCraftSelected(int craftID) {
        selectedCraftID = craftID;
        UpdateDetailsPanel();
    }

    void UpdateDetailsPanel() {
        if (selectedCraftID == -1) {
            detailsPanel.SetActive(false);
            return;
        }

        Craft craft = GameManager.Instance.GameState.GetCraft(selectedCraftID);

        if (craft is BattleCruiser bc) {
            DisplayBattleCruiserDetails(bc);
        } else if (craft is CargoCruiser cc) {
            DisplayCargoCruiserDetails(cc);
        }
    }
}
```

### Resource Transfer

**Load Resources Dialog:**
```csharp
void OnLoadResourcesClicked() {
    CargoCruiser cargo = GameState.GetCraft(selectedCraftID) as CargoCruiser;
    Planet planet = GameState.GetPlanet(currentPlanetID);

    ResourceTransferDialog.Show(
        sourcePlanet: planet,
        targetCraft: cargo,
        onConfirm: (foodAmount, mineralAmount, fuelAmount, energyAmount) => {
            int totalTransfer = foodAmount + mineralAmount + fuelAmount + energyAmount;
            int currentCargo = cargo.GetTotalCargo();

            if (currentCargo + totalTransfer > 4000) {
                ShowError("Exceeds cargo capacity");
                return;
            }

            // Transfer resources
            planet.Resources.Food -= foodAmount;
            planet.Resources.Minerals -= mineralAmount;
            planet.Resources.Fuel -= fuelAmount;
            planet.Resources.Energy -= energyAmount;

            cargo.Cargo.Food += foodAmount;
            cargo.Cargo.Minerals += mineralAmount;
            cargo.Cargo.Fuel += fuelAmount;
            cargo.Cargo.Energy += energyAmount;

            RefreshPanels();
        }
    );
}
```

### Platoon Loading

**Load Platoon Dialog:**
```csharp
void OnLoadPlatoonClicked() {
    BattleCruiser bc = GameState.GetCraft(selectedCraftID) as BattleCruiser;

    if (bc.GetPlatoonCount() >= 4) {
        ShowError("Battle Cruiser full (4/4 platoons)");
        return;
    }

    // Get garrison platoons at same planet
    var availablePlatoons = GameState.Platoons
        .Where(p => p.Owner == FactionType.Player)
        .Where(p => p.CurrentPlanetID == bc.CurrentPlanetID)
        .Where(p => p.State == PlatoonState.Garrison)
        .ToList();

    if (availablePlatoons.Count == 0) {
        ShowError("No platoons available at this planet");
        return;
    }

    PlatoonSelectionDialog.Show(availablePlatoons, onConfirm: (platoonID) => {
        GameManager.Instance.PlatoonSystem.LoadOntoBattleCruiser(platoonID, selectedCraftID);
        RefreshPanels();
    });
}
```

### Crew Assignment

**Assign Crew:**
```csharp
void OnAssignCrewClicked() {
    Craft craft = GameState.GetCraft(selectedCraftID);
    Planet planet = GameState.GetPlanet(currentPlanetID);

    int requiredCrew = craft.GetRequiredCrew();  // BC: 20, CC: 15

    if (planet.Population < requiredCrew) {
        ShowError($"Insufficient population (need {requiredCrew})");
        return;
    }

    if (craft.CrewCount >= requiredCrew) {
        ShowError("Craft already has crew assigned");
        return;
    }

    ConfirmDialog.Show(
        $"Assign {requiredCrew} crew to {craft.ID}?",
        onConfirm: () => {
            planet.Population -= requiredCrew;
            craft.CrewCount = requiredCrew;
            craft.State = CraftState.Operational;
            RefreshPanels();
        }
    );
}
```

### Launch to Navigation

**Launch Validation:**
```csharp
void OnLaunchClicked() {
    Craft craft = GameState.GetCraft(selectedCraftID);

    if (craft.CrewCount < craft.GetRequiredCrew()) {
        ShowError("Must assign crew before launch");
        return;
    }

    if (craft.FuelTank <= 0) {
        ShowError("Must refuel before launch");
        return;
    }

    ConfirmDialog.Show(
        $"Launch {craft.ID}? This will open Navigation Screen.",
        onConfirm: () => {
            craft.State = CraftState.Traveling;
            NavigationScreen.Open(craft.ID);
        }
    );
}
```

---

## Testing Scenarios

### Resource Transfer Tests

1. **Load Resources on Cargo Cruiser:**
   - Given Cargo Cruiser with empty hold at planet with 5,000 Food
   - When player loads 1,000 Food via slider
   - Then craft cargo = 1,000 Food, planet = 4,000 Food remaining

2. **Cargo Capacity Limit:**
   - Given Cargo Cruiser with 3,500 cargo already loaded
   - When player attempts to load 600 more units (total 4,100)
   - Then error message "Exceeds cargo capacity (4,000 max)"

3. **Unload Resources:**
   - Given Cargo Cruiser with 800 Minerals aboard
   - When player unloads 500 Minerals to planet
   - Then craft = 300 Minerals, planet gains 500 Minerals

### Platoon Loading Tests

1. **Load Platoon onto Battle Cruiser:**
   - Given Battle Cruiser with 2/4 platoons at Starbase
   - When player loads Platoon 05 from garrison
   - Then Battle Cruiser shows 3/4 platoons, Platoon 05 location = "Battle Cruiser"

2. **Cannot Load if Full:**
   - Given Battle Cruiser with 4/4 platoons
   - When player clicks "Load Platoon"
   - Then error message "Battle Cruiser full (4/4 platoons)"

3. **Unload Platoon to Garrison:**
   - Given Battle Cruiser with 3 platoons
   - When player unloads Platoon 01
   - Then Battle Cruiser 2/4, Platoon 01 added to planet garrison

### Crew and Fuel Tests

1. **Assign Crew:**
   - Given Cargo Cruiser with 0 crew at planet with 1,500 population
   - When player assigns crew
   - Then craft CrewCount = 15, planet population = 1,485

2. **Refuel Craft:**
   - Given Battle Cruiser with 120/200 Fuel at planet with 800 Fuel
   - When player refuels
   - Then craft Fuel = 200, planet Fuel = 720

3. **Cannot Launch Without Crew:**
   - Given Cargo Cruiser with 0 crew
   - When player clicks Launch
   - Then error message "Must assign crew before launch"

---

## Future Enhancements (Post-MVP)

**Advanced Features:**
- Auto-load presets (save cargo configurations)
- Batch operations (load multiple craft simultaneously)
- Cargo manifest history (track shipments)
- Express transfer (1-click "Fill to max" button)

**Visual Enhancements:**
- 3D craft preview in details panel
- Animated cargo loading sequences
- Fuel gauge with warning lights
- Platoon embarkation animation

**Mobile Optimizations:**
- Gesture-based resource sliders (swipe up/down)
- Haptic feedback for transfer confirmations
- Quick-load buttons (25%, 50%, 75%, 100%)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-032 (Craft System), AFS-034 (Spacecraft Details), AFS-033 (Platoon System), AFS-021 (Resource System)
