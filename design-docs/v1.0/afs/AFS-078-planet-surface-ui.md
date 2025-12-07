# AFS-078: Planet Surface UI

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-007

---

## Summary

User interface for managing planetary infrastructure including building placement on 6 surface platforms, toggling production stations ON/OFF, viewing resource production rates, and accessing building upgrade/demolition controls.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Access to planet and building data
- **AFS-025 (Building System)**: Building entity operations
- **AFS-036 (Production Stations)**: Mining/Horticultural Station mechanics
- **AFS-026 (Solar Satellite)**: Energy production buildings
- **AFS-021 (Resource System)**: Resource production calculations
- **AFS-012 (Planet System)**: Planet properties and type bonuses
- **AFS-071 (Main Screen)**: Navigation to Planet Surface screen

---

## Requirements

### Screen Layout (FR-UI-007)

#### 1. Screen Structure

**Primary Components:**
- **Header Bar:** Planet name, type, owner, resource summary
- **3D Planet View (Left):** Rotating planet with 6 platform markers
- **Platform Grid (Center):** 6 building slots with status indicators
- **Building Details Panel (Right):** Selected building/slot information
- **Action Buttons (Bottom):** Build, Demolish, Toggle ON/OFF, Upgrade

**Screen Division:**
```
┌──────────────────────────────────────────────────────────────┐
│ Planet: Starbase (Metropolis) | Owner: Player | Turn: 15     │
│ Food: 2,500 (+200/turn) | Minerals: 1,200 (+150/turn)        │
├─────────────────────┬──────────────────────┬─────────────────┤
│  3D PLANET VIEW     │  SURFACE PLATFORMS   │ BUILDING DETAILS│
│                     │                      │                 │
│      🌍             │ Platform 1: [MINE]   │ Mining Station  │
│   Rotating          │   ⚡ Active          │ ───────────     │
│   Metropolis        │   +150 Min/turn     │ Status: Active  │
│   Planet            │                      │ Crew: 10        │
│                     │ Platform 2: [HORT]   │ Output:         │
│   [1] [2] [3]       │   ⚡ Active          │  150 Minerals   │
│   (markers on       │   +200 Food/turn    │  75 Fuel        │
│    surface)         │                      │ /turn           │
│                     │ Platform 3: [SOLAR]  │                 │
│   [4] [5] [6]       │   ⚡ Active          │ Cost: 50,000 Cr │
│                     │   +100 Energy/turn  │ Crew Food:      │
│                     │                      │  -5 Food/turn   │
│                     │ Platform 4: [EMPTY]  │                 │
│                     │   ⚪ Available       │ [Toggle OFF]    │
│                     │                      │ [Demolish]      │
│                     │ Platform 5: [LAB]    │                 │
│                     │   🔬 Research        │ BUILD OPTIONS   │
│                     │   +Tech progress    │                 │
│                     │                      │ ☐ Mining Stn    │
│                     │ Platform 6: [FACT]   │   50,000 Cr     │
│                     │   🏭 Manufacturing   │ ☐ Hort. Stn     │
│                     │   +Production       │   40,000 Cr     │
│                     │                      │ ☐ Solar Sat     │
│                     │                      │   30,000 Cr     │
├─────────────────────┴──────────────────────┴─────────────────┤
│ [Build on Selected Platform] [Demolish Building] [Close]     │
└──────────────────────────────────────────────────────────────┘
```

#### 2. 3D Planet View

**Visual Representation:**
- **Planet Model:** 3D sphere with planet-type texture (Metropolis, Volcanic, Desert, Tropical)
- **Rotation:** Continuous slow rotation (10-15 seconds per full rotation)
- **Platform Markers:** 6 numbered markers on planet surface (1-6)
- **Clickable Markers:** Click marker to select corresponding platform slot

**Platform Marker States:**
- **Occupied:** Green marker with building icon
- **Empty:** Gray marker with dashed outline
- **Selected:** Yellow highlight ring around marker
- **Under Construction:** Pulsing blue marker with progress ring

**Camera Controls:**
- **Mouse Drag:** Rotate planet manually
- **Mouse Wheel:** Zoom in/out (75%-150% scale)
- **Reset Button:** Return to default rotation and zoom

#### 3. Platform Grid Panel

**Grid Layout:**
- **6 Slots:** Arranged in 2 columns × 3 rows
- **Slot Entry Format:**
  ```
  Platform 1: [MINE] ⚡ Active
    +150 Minerals/turn
  ```

**Slot States:**
- **Empty:** "Platform 4: [EMPTY] ⚪ Available"
- **Occupied:** "Platform 1: [MINE] ⚡ Active"
- **Under Construction:** "Platform 6: [FACT] 🔨 Building (3 turns)"
- **Inactive:** "Platform 2: [HORT] ⏸ Inactive (Toggled OFF)"

**Visual Indicators:**
- **Active Icon:** ⚡ (green lightning bolt)
- **Inactive Icon:** ⏸ (gray pause symbol)
- **Construction Icon:** 🔨 (hammer with progress percentage)
- **Empty Icon:** ⚪ (white circle outline)

**Production Summary:**
- Display per-turn production for active buildings
- Example: "+150 Minerals/turn" or "+200 Food/turn"
- Color-coded: Green (positive), Gray (inactive), Red (negative, crew consumption)

#### 4. Building Details Panel

**Selected Building Information:**

**A. Basic Info:**
- **Building Name:** "Mining Station"
- **Status:** "Active" or "Inactive" or "Under Construction (3 turns)"
- **Crew Assigned:** "10 personnel"
- **Power Status:** "Powered" or "No Power Required"

**B. Production Output:**
- **Resource Type(s):** "Minerals, Fuel"
- **Base Production:** "100 Minerals, 50 Fuel"
- **Planet Modifier:** "×1.5 (Metropolis bonus)"
- **Actual Output:** "150 Minerals, 75 Fuel per turn"
- **Crew Consumption:** "-5 Food/turn (crew meals)"

**C. Building Costs:**
- **Purchase Price:** "50,000 Credits"
- **Build Time:** "5 turns"
- **Maintenance:** "0 Credits/turn" (no ongoing cost)

**D. Toggle and Demolish:**
- **Toggle Button:** "Toggle OFF" (if active) or "Toggle ON" (if inactive)
- **Demolish Button:** "Demolish Building (Refund: 15,000 Credits)"
- **Warning:** Demolish is permanent, shows confirmation dialog

**E. Upgrade Options (Future):**
- **Upgrade to Level 2:** "Upgrade Mining Station (100,000 Credits)"
- **Effect:** "+50% production output"

#### 5. Empty Platform Details

**When Empty Slot Selected:**

**A. Build Options List:**
- **Mining Station:** "50,000 Credits | 5 turns | +Minerals +Fuel"
- **Horticultural Station:** "40,000 Credits | 4 turns | +Food"
- **Solar Satellite Generator:** "30,000 Credits | 3 turns | +Energy"
- **Research Lab:** "60,000 Credits | 6 turns | +Tech Progress"
- **Factory:** "70,000 Credits | 7 turns | +Craft Production"
- **Defense System:** "80,000 Credits | 8 turns | +Planet Defense"

**B. Build Option Details:**
- **Selected Option:** Highlights in blue
- **Cost Check:** Grayed out if insufficient Credits
- **Requirements:** Some buildings require tech level or other prerequisites
- **Description:** "Mining Station extracts Minerals and Fuel from planet surface."

**C. Build Button:**
- **Label:** "Build Mining Station"
- **Enabled:** If Credits ≥ cost
- **Disabled:** If insufficient Credits or all 6 platforms occupied

#### 6. Build Confirmation Dialog

**Construction Confirmation:**
```
┌─────────────────────────────────────────┐
│ Build Mining Station on Platform 4?    │
│                                         │
│ Cost: 50,000 Credits                    │
│ Build Time: 5 turns                     │
│                                         │
│ Production (when complete):             │
│  +100 Minerals/turn (base)              │
│  +50 Fuel/turn (base)                   │
│  ×1.5 Metropolis bonus                  │
│  = 150 Minerals, 75 Fuel/turn          │
│                                         │
│ Crew Required: 10 personnel             │
│ Crew Consumption: -5 Food/turn          │
│                                         │
│ [Confirm Build] [Cancel]                │
└─────────────────────────────────────────┘
```

**Process:**
1. Select empty platform slot
2. Select building type from build options
3. Click "Build on Selected Platform"
4. Confirmation dialog shows all details
5. Deduct Credits, add to construction queue
6. Platform displays "[MINE] 🔨 Building (5 turns)"

#### 7. Demolish Building Dialog

**Demolish Confirmation:**
```
┌─────────────────────────────────────────┐
│ Demolish Mining Station?                │
│                                         │
│ This will permanently remove:           │
│  - Mining Station (Platform 1)          │
│  - 150 Minerals/turn production         │
│  - 75 Fuel/turn production              │
│                                         │
│ Refund: 15,000 Credits (30% of cost)    │
│                                         │
│ WARNING: This cannot be undone.         │
│                                         │
│ [Confirm Demolish] [Cancel]             │
└─────────────────────────────────────────┘
```

**Refund Calculation:**
- **Original Cost:** Building purchase price
- **Refund:** 30% of original cost
- **Example:** Mining Station (50K) → Refund 15K

**Process:**
1. Select occupied platform
2. Click "Demolish Building"
3. Confirmation dialog displays refund
4. Remove building, refund Credits
5. Platform becomes empty, available for new construction

#### 8. Toggle Building ON/OFF

**Toggle Functionality:**
- **Purpose:** Disable production temporarily (save crew food consumption)
- **Active → Inactive:** Stops production, stops crew food consumption
- **Inactive → Active:** Resumes production, resumes crew food consumption
- **No Cost:** Toggle is instant and free
- **Use Case:** Turn off Horticultural Stations when Food abundant, save crew meals

**Visual Feedback:**
- **Active:** ⚡ Green lightning icon, production displayed
- **Inactive:** ⏸ Gray pause icon, "Inactive (No Production)"
- **Platform Entry:** Updates immediately on toggle

**Process:**
1. Select active building
2. Click "Toggle OFF"
3. Building state → Inactive
4. Production stops, crew consumption stops
5. Platform entry shows "⏸ Inactive"

#### 9. Planet Type Bonuses Display

**Bonus Indicator:**
- **Metropolis:** "×1.5 all resources"
- **Volcanic:** "×5 Minerals, ×3 Fuel"
- **Desert:** "×2 Energy from Solar Satellites"
- **Tropical:** "×2 Food from Horticultural Stations"

**Visual:**
- Display planet type icon in header
- Tooltip on hover explains bonuses
- Production calculations show modifier application

---

## Acceptance Criteria

### Functional Criteria

- [ ] 3D planet view displays with 6 platform markers
- [ ] Clicking marker selects corresponding platform slot
- [ ] Platform grid shows all 6 slots with building status and production
- [ ] Empty platform displays build options with cost and build time
- [ ] Building details panel shows production, crew, status for occupied platforms
- [ ] Build confirmation dialog displays cost, build time, production preview
- [ ] Cannot build if insufficient Credits or all 6 platforms occupied
- [ ] Demolish confirmation displays refund (30% of original cost)
- [ ] Toggle ON/OFF stops/resumes production and crew consumption
- [ ] Planet type bonuses correctly applied to production calculations
- [ ] Under-construction buildings display turns remaining

### UI and Visual Criteria

- [ ] 3D planet rotates smoothly (10-15s per rotation)
- [ ] Platform markers visually distinct (green occupied, gray empty, yellow selected)
- [ ] Selected platform highlighted in both 3D view and grid
- [ ] Production values color-coded (green active, gray inactive)
- [ ] Toggle icon updates immediately (⚡ → ⏸)
- [ ] Build options grayed out if insufficient Credits
- [ ] Construction progress displays percentage completion

### Mobile UI Criteria

- [ ] 3D planet view resizes to fill width on mobile
- [ ] Platform grid stacks vertically below planet view
- [ ] Building details panel stacks below grid
- [ ] Touch targets ≥44×44 points for all buttons
- [ ] Pinch-to-zoom on 3D planet (mobile only)
- [ ] Swipe left/right to select platforms (mobile only)

### Performance Criteria

- [ ] 3D planet renders at 30+ FPS on mobile, 60+ FPS on desktop
- [ ] Platform selection updates details panel <50ms
- [ ] Production calculation <10ms
- [ ] Build/demolish operations complete <200ms

---

## Implementation Notes

### 3D Planet Rendering

**Planet GameObject:**
```csharp
class PlanetSurfaceView : MonoBehaviour {
    GameObject planetModel;
    List<PlatformMarker> platformMarkers = new List<PlatformMarker>();

    void Start() {
        // Load planet model based on type
        planetModel = LoadPlanetModel(planet.Type);
        planetModel.transform.Rotate(Vector3.up, 15f * Time.deltaTime);  // Slow rotation

        // Create 6 platform markers
        CreatePlatformMarkers();
    }

    void CreatePlatformMarkers() {
        Vector3[] positions = {
            new Vector3(0, 1, 0),      // Platform 1 (North Pole)
            new Vector3(1, 0.5f, 0),   // Platform 2
            new Vector3(-1, 0.5f, 0),  // Platform 3
            new Vector3(1, -0.5f, 0),  // Platform 4
            new Vector3(-1, -0.5f, 0), // Platform 5
            new Vector3(0, -1, 0)      // Platform 6 (South Pole)
        };

        for (int i = 0; i < 6; i++) {
            var marker = Instantiate(platformMarkerPrefab, positions[i], Quaternion.identity);
            marker.PlatformIndex = i;
            marker.OnClick += OnPlatformMarkerClicked;
            platformMarkers.Add(marker);
        }
    }

    void OnPlatformMarkerClicked(int platformIndex) {
        selectedPlatformIndex = platformIndex;
        UpdatePlatformGrid();
        UpdateBuildingDetails();
    }
}
```

### Platform Grid UI

**Grid Rendering:**
```csharp
class PlatformGridUI : MonoBehaviour {
    void RefreshGrid() {
        for (int i = 0; i < 6; i++) {
            var platform = planet.SurfacePlatforms[i];
            var entry = platformEntries[i];

            if (platform.Building == null) {
                // Empty slot
                entry.NameText.text = $"Platform {i + 1}: [EMPTY]";
                entry.StatusIcon.sprite = emptyIcon;
                entry.ProductionText.text = "⚪ Available";
            } else if (platform.Building.IsUnderConstruction) {
                // Building in progress
                entry.NameText.text = $"Platform {i + 1}: [{platform.Building.Type}]";
                entry.StatusIcon.sprite = constructionIcon;
                entry.ProductionText.text = $"🔨 Building ({platform.Building.TurnsRemaining} turns)";
            } else if (platform.Building.IsActive) {
                // Active building
                entry.NameText.text = $"Platform {i + 1}: [{platform.Building.Type}]";
                entry.StatusIcon.sprite = activeIcon;
                entry.ProductionText.text = $"⚡ {platform.Building.GetProductionSummary()}";
            } else {
                // Inactive building
                entry.NameText.text = $"Platform {i + 1}: [{platform.Building.Type}]";
                entry.StatusIcon.sprite = inactiveIcon;
                entry.ProductionText.text = "⏸ Inactive";
            }
        }
    }
}
```

### Build Building

**Construction Process:**
```csharp
void OnBuildButtonClicked() {
    var platform = planet.SurfacePlatforms[selectedPlatformIndex];

    if (platform.Building != null) {
        ShowError("Platform already occupied");
        return;
    }

    BuildingType selectedType = buildOptionsPanel.SelectedBuildingType;
    int cost = GetBuildingCost(selectedType);

    if (GameState.Credits < cost) {
        ShowError("Insufficient Credits");
        return;
    }

    ConfirmDialog.Show(
        $"Build {selectedType} on Platform {selectedPlatformIndex + 1}?\n\nCost: {cost} Credits",
        onConfirm: () => {
            GameState.Credits -= cost;

            var building = new Building {
                Type = selectedType,
                PlatformIndex = selectedPlatformIndex,
                TurnsRemaining = GetBuildTime(selectedType),
                IsActive = false  // Becomes active when construction complete
            };

            planet.SurfacePlatforms[selectedPlatformIndex].Building = building;
            RefreshGrid();
        }
    );
}
```

### Toggle Building

**ON/OFF Control:**
```csharp
void OnToggleButtonClicked() {
    var platform = planet.SurfacePlatforms[selectedPlatformIndex];

    if (platform.Building == null || platform.Building.IsUnderConstruction) {
        ShowError("No operational building on this platform");
        return;
    }

    platform.Building.IsActive = !platform.Building.IsActive;

    // Update button text
    if (platform.Building.IsActive) {
        toggleButton.text = "Toggle OFF";
    } else {
        toggleButton.text = "Toggle ON";
    }

    RefreshGrid();
    UpdateBuildingDetails();
}
```

### Production Calculation

**Display with Modifiers:**
```csharp
string GetProductionSummary(Building building) {
    var production = CalculateProduction(building, planet);

    if (building.Type == BuildingType.MiningStation) {
        return $"+{production.Minerals} Minerals, +{production.Fuel} Fuel/turn";
    } else if (building.Type == BuildingType.HorticulturalStation) {
        return $"+{production.Food} Food/turn";
    } else if (building.Type == BuildingType.SolarSatellite) {
        return $"+{production.Energy} Energy/turn";
    }

    return "";
}

ResourceCollection CalculateProduction(Building building, Planet planet) {
    var baseProduction = GetBaseProduction(building.Type);
    var modifier = planet.GetProductionModifier(building.Type);

    return new ResourceCollection {
        Minerals = Mathf.RoundToInt(baseProduction.Minerals * modifier),
        Fuel = Mathf.RoundToInt(baseProduction.Fuel * modifier),
        Food = Mathf.RoundToInt(baseProduction.Food * modifier),
        Energy = Mathf.RoundToInt(baseProduction.Energy * modifier)
    };
}
```

---

## Testing Scenarios

### Building Construction Tests

1. **Build Mining Station:**
   - Given empty Platform 4 at Metropolis planet with 100,000 Credits
   - When player builds Mining Station (50,000 Credits)
   - Then Credits = 50,000, Platform 4 shows "[MINE] 🔨 Building (5 turns)"

2. **Cannot Build if Insufficient Credits:**
   - Given player has 25,000 Credits
   - When player attempts to build Mining Station (50,000 Credits)
   - Then build option grayed out, error message if clicked

3. **Building Completes After Turns:**
   - Given Mining Station under construction (1 turn remaining)
   - When turn ends
   - Then Platform shows "[MINE] ⚡ Active +150 Minerals/turn"

### Demolish Tests

1. **Demolish Building with Refund:**
   - Given Mining Station on Platform 1 (original cost 50,000)
   - When player demolishes building
   - Then refund = 15,000 Credits, Platform 1 becomes empty

2. **Demolish Confirmation Required:**
   - Given active Horticultural Station
   - When player clicks Demolish
   - Then confirmation dialog displays with refund amount

### Toggle Tests

1. **Toggle Building OFF:**
   - Given active Mining Station producing 150 Minerals/turn
   - When player toggles OFF
   - Then production stops, crew food consumption stops, icon changes to ⏸

2. **Toggle Building ON:**
   - Given inactive Horticultural Station
   - When player toggles ON
   - Then production resumes, icon changes to ⚡

### Production Display Tests

1. **Production with Planet Bonus:**
   - Given Mining Station on Volcanic planet (×5 Minerals modifier)
   - When details panel displays
   - Then production shows: "100 Minerals (base) × 5 = 500 Minerals/turn"

2. **Crew Food Consumption:**
   - Given active Mining Station with 10 crew
   - When details panel displays
   - Then shows "-5 Food/turn (crew consumption)"

---

## Future Enhancements (Post-MVP)

**Advanced Features:**
- Building upgrade system (Level 1-3, increasing production)
- Special buildings (Wonder structures with unique bonuses)
- Automated building queue (schedule construction across multiple turns)
- Building templates (save platform layouts for new colonies)

**Visual Enhancements:**
- Animated building construction sequences (3D models assembling)
- Day/night cycle on planet surface
- Weather effects (clouds, storms) on Tropical planets
- Mining operations visuals (drills, excavators)

**Mobile Optimizations:**
- Simplified 2D platform grid view (toggle between 3D and 2D)
- Quick-build menu (one-tap construction for common buildings)
- Gesture controls (swipe to rotate planet, pinch to zoom)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-025 (Building System), AFS-036 (Production Stations), AFS-012 (Planet System), AFS-021 (Resource System)
