# AFS-073: Planet Management UI

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-003

---

## Summary

Planet management interface implementing detailed planet view with building construction panels, population management, resource stockpiles, garrison overview, and production statistics, providing comprehensive control over colony development and infrastructure.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet data queries
- **AFS-012 (Planet System)**: Planet properties
- **AFS-061 (Building System)**: Construction mechanics
- **AFS-071 (UI State Machine)**: Panel visibility control
- **AFS-072 (HUD System)**: Persistent HUD overlay

---

## Requirements

### UI Layout

1. **Left Panel** (Planet Info)
   - **Planet Name**: "Vulcan Prime" (editable, click to rename)
   - **Planet Type**: Volcanic / Desert / Tropical / Metropolis (icon + text)
   - **Population**: 500 / 10,000 (current / max capacity)
   - **Morale**: 85% (green bar, tooltip shows factors)
   - **Production Bonuses**: 5.0× Minerals, 3.0× Fuel, 0.5× Food
   - **Tax Rate**: Slider 0-100% (affects morale and income)

2. **Center Panel** (3D Planet View)
   - **3D Model**: Rotating planet sphere (Prodeus-style low-poly)
   - **Orbit Indicators**: Docking Bays shown as orbital platforms
   - **Surface Markers**: Surface Platforms shown as building icons
   - **Camera Controls**: Mouse drag to rotate, scroll to zoom
   - **Click Interactions**: Click building to view details/scrap

3. **Right Panel** (Building Management)
   - **Tabs**: Buildings, Construction Queue, Garrison, Upgrades
   - **Buildings Tab**: List of all structures
     - Docking Bays: 2/3 (capacity indicator)
     - Surface Platforms: 4/6
     - Mining Stations: 3 (production rates)
     - Horticultural Stations: 1
   - **Build Buttons**: "Build Docking Bay", "Build Mining Station", etc.
   - **Construction Queue**: Shows buildings under construction (turn countdown)

4. **Bottom Panel** (Action Buttons)
   - **Back Button**: Return to Galaxy View (top-left)
   - **Build Queue**: Show/hide construction queue panel
   - **Garrison**: Show/hide platoon garrison list
   - **Scrap**: Enable scrap mode (click buildings to destroy, 50% refund)

### Building List Panel

1. **Structure Display**
   - **Icon**: Visual icon for building type (orbital platform, mining rig, farm)
   - **Name**: "Mining Station" (or custom name if renamed)
   - **Status**: Active / Under Construction / Inactive
   - **Progress Bar**: For buildings under construction (e.g., "3 turns remaining")
   - **Production**: "250 Minerals/turn, 150 Fuel/turn" (if active)
   - **Crew**: "15/15 assigned" (green if staffed, red if insufficient)

2. **Filters**
   - **All**: Show all structures
   - **Orbital**: Docking Bays and Orbital Defense Platforms
   - **Surface**: Mining Stations, Horticultural Stations, Garrisons
   - **Under Construction**: Only buildings being built
   - **Inactive**: Buildings without crew (warning state)

3. **Sorting**
   - **By Type**: Group by building type (default)
   - **By Production**: Highest production first
   - **By Status**: Active → Under Construction → Inactive

### Construction Panel

1. **Available Buildings**
   - **Grid Layout**: 2×2 grid showing 4 building types
   - **Building Cards**:
     - Icon (large, 128×128px)
     - Name ("Docking Bay")
     - Cost (💰 5,000 + ⛏️ 1,000 + ⚡ 500)
     - Time (⏱️ 2 turns)
     - Crew (👤 0)
     - Description (1 sentence)
   - **Disabled State**: Grayed out if:
     - Insufficient resources
     - Planet at capacity
     - Prerequisites not met

2. **Build Confirmation Modal**
   - **Title**: "Build Mining Station?"
   - **Cost Breakdown**: Credits, Minerals, Fuel
   - **Construction Time**: "3 turns"
   - **Crew Required**: "15 population"
   - **Production Preview**: "50 Minerals/turn (×5.0 Volcanic bonus = 250/turn)"
   - **Buttons**: "Confirm Build" (green), "Cancel" (gray)

3. **Construction Queue Display**
   - **List**: All buildings under construction
   - **Format**: "Mining Station (2 turns remaining)"
   - **Progress Bar**: Visual countdown (e.g., 66% complete)
   - **Cancel Button**: "❌" to cancel construction (75% refund)
   - **MVP Limit**: Only 1 building under construction at a time

### Garrison Panel

1. **Platoon List**
   - **Display Columns**:
     - Name: "Platoon 01"
     - Troops: 150
     - Equipment: Standard (1.5×)
     - Weapon: Assault Rifle (1.3×)
     - Training: 100%
     - Strength: 293
   - **Status Icons**: Active (green), Training (yellow), Embarked (blue)
   - **Action Buttons**: "Embark on Ship", "Decommission" (disband)

2. **Embarkation Modal**
   - **Title**: "Embark Platoon on Battle Cruiser?"
   - **Ship Selection**: Dropdown of available Battle Cruisers in orbit
   - **Capacity Check**: "USCS Cruiser 01 (2/4 platoons)"
   - **Confirmation**: "Embark" button (disabled if ship full)

3. **Garrison Summary**
   - **Total Garrison Strength**: 450 (sum of all platoons)
   - **Total Troops**: 300
   - **Defense Rating**: Strong / Medium / Weak / None
   - **Warning**: "No garrison! Planet vulnerable to invasion!"

### Resource Stockpile Panel

1. **Planet Resources**
   - **Display**: Same format as HUD, but planet-specific
   - **Credits**: 💰 15,000 (planet stockpile, not global)
   - **Minerals**: ⛏️ 3,500
   - **Fuel**: ⚡ 1,200
   - **Food**: 🌾 800
   - **Production Rates**: "+250/turn" (green), "-50/turn" (red)

2. **Transfer Resources Modal**
   - **Title**: "Transfer Resources to Another Planet?"
   - **Destination**: Dropdown (select planet)
   - **Amount Sliders**: Credits, Minerals, Fuel, Food (0 to max)
   - **Transfer Cost**: Fuel cost for transport (e.g., "100 Fuel")
   - **Confirm**: "Transfer" button

### Population Management

1. **Population Display**
   - **Current Population**: 500 / 10,000
   - **Growth Rate**: +15/turn (affected by food and morale)
   - **Breakdown**:
     - Idle: 420 (available for crew assignment)
     - Crew: 70 (assigned to buildings)
     - Military: 10 (reserved for platoon commissioning)
   - **Morale Factors**: Tooltip shows:
     - Base: 100%
     - Tax Rate: -10% (if 50% tax)
     - Food Surplus: +5%
     - Recent Combat: -20%

2. **Crew Allocation**
   - **Automatic**: Crew assigned automatically (AFS-022 Income System)
   - **Priority Display**: Show allocation priority order
     - 1st: Horticultural Stations (food production)
     - 2nd: Mining Stations (resource production)
     - 3rd: Orbital Defense (defense)
   - **Manual Override** (Post-MVP): Player can manually assign crew

---

## Acceptance Criteria

### Functional Criteria

- [ ] Planet info panel displays name, type, population, morale, bonuses
- [ ] 3D planet view shows rotating planet model
- [ ] Building list shows all structures with status and production
- [ ] Construction panel shows available buildings with costs
- [ ] Build confirmation modal validates resources and capacity
- [ ] Construction queue displays buildings under construction
- [ ] Garrison panel lists all platoons with details
- [ ] Resource stockpile panel shows planet-specific resources
- [ ] Population breakdown shows idle, crew, military
- [ ] Back button returns to Galaxy View

### Performance Criteria

- [ ] Panel loads in <200ms
- [ ] 3D planet rotation maintains 60 FPS
- [ ] Building list updates in <50ms when construction completes
- [ ] No frame drops during panel transitions

### Integration Criteria

- [ ] Integrates with Planet System (AFS-012) for planet data
- [ ] Uses Building System (AFS-061) for construction
- [ ] Displays garrison from Platoon System (AFS-033)
- [ ] Controlled by UI State Machine (AFS-071)
- [ ] Updates via HUD System (AFS-072) for resources

---

## Technical Notes

### Implementation Approach

```csharp
public class PlanetManagementUI : MonoBehaviour
{
    [Header("Panels")]
    public GameObject planetInfoPanel;
    public GameObject buildingListPanel;
    public GameObject constructionPanel;
    public GameObject garrisonPanel;

    [Header("3D View")]
    public GameObject planetModel;
    public Camera planetCamera;

    private int _currentPlanetID = -1;

    public void ShowPlanetManagement(int planetID)
    {
        _currentPlanetID = planetID;

        // Transition to Planet Management state
        UIStateManager.Instance.PushState(UIState.PlanetManagement, animate: true);

        // Load planet data
        LoadPlanetData(planetID);

        // Update 3D view
        UpdatePlanetModel(planetID);

        // Show panels
        planetInfoPanel.SetActive(true);
        buildingListPanel.SetActive(true);
    }

    private void LoadPlanetData(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return;

        // Update planet info
        UpdatePlanetInfo(planet);

        // Update building list
        UpdateBuildingList(planet);

        // Update garrison
        UpdateGarrisonList(planet);

        // Update resources
        UpdateResourceDisplay(planet);
    }

    private void UpdatePlanetInfo(Planet planet)
    {
        // Planet name
        var nameText = planetInfoPanel.GetComponentInChildren<TextMeshProUGUI>();
        nameText.text = planet.Name;

        // Planet type
        var typeIcon = planetInfoPanel.transform.Find("TypeIcon").GetComponent<Image>();
        typeIcon.sprite = GetPlanetTypeIcon(planet.Type);

        // Population
        var popText = planetInfoPanel.transform.Find("Population").GetComponent<TextMeshProUGUI>();
        popText.text = $"{planet.Population:N0} / {planet.MaxPopulation:N0}";

        // Morale
        var moraleSlider = planetInfoPanel.transform.Find("MoraleBar").GetComponent<Slider>();
        moraleSlider.value = planet.Morale / 100f;

        // Production bonuses
        var bonusText = planetInfoPanel.transform.Find("Bonuses").GetComponent<TextMeshProUGUI>();
        bonusText.text = GetProductionBonusText(planet);
    }

    private void UpdateBuildingList(Planet planet)
    {
        // Clear existing list
        var listContainer = buildingListPanel.transform.Find("List");
        foreach (Transform child in listContainer)
        {
            Destroy(child.gameObject);
        }

        // Add building entries
        foreach (var structure in planet.Structures)
        {
            var entry = Instantiate(buildingEntryPrefab, listContainer);
            var entryUI = entry.GetComponent<BuildingEntryUI>();
            entryUI.SetStructure(structure, planet);
        }
    }

    private void UpdateGarrisonList(Planet planet)
    {
        var platoons = GameStateManager.Instance.GetPlatoonsAtPlanet(planet.ID);

        // Clear existing list
        var listContainer = garrisonPanel.transform.Find("List");
        foreach (Transform child in listContainer)
        {
            Destroy(child.gameObject);
        }

        // Add platoon entries
        foreach (var platoon in platoons)
        {
            var entry = Instantiate(platoonEntryPrefab, listContainer);
            var entryUI = entry.GetComponent<PlatoonEntryUI>();
            entryUI.SetPlatoon(platoon);
        }

        // Update garrison summary
        int totalStrength = platoons.Sum(p => PlatoonSystem.Instance.GetMilitaryStrength(p.ID));
        var summaryText = garrisonPanel.transform.Find("Summary").GetComponent<TextMeshProUGUI>();
        summaryText.text = $"Total Garrison Strength: {totalStrength}";
    }

    private void UpdatePlanetModel(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return;

        // Set planet material based on type
        var renderer = planetModel.GetComponent<MeshRenderer>();
        renderer.material = GetPlanetMaterial(planet.Type);

        // Add orbital structures (Docking Bays, Defense Platforms)
        UpdateOrbitalStructures(planet);

        // Start rotation animation
        StartCoroutine(RotatePlanet());
    }

    private IEnumerator RotatePlanet()
    {
        while (true)
        {
            planetModel.transform.Rotate(Vector3.up, 10f * Time.deltaTime);
            yield return null;
        }
    }

    public void OnBuildButtonClicked(BuildingType type)
    {
        // Show build confirmation modal
        BuildConfirmationModal.Instance.Show(_currentPlanetID, type);
    }

    public void OnBackButtonClicked()
    {
        // Return to Galaxy View
        UIStateManager.Instance.PopState(animate: true);
    }

    private string GetProductionBonusText(Planet planet)
    {
        var bonuses = new List<string>();

        if (planet.MineralsMultiplier > 1.0f)
            bonuses.Add($"{planet.MineralsMultiplier}× Minerals");
        if (planet.FuelMultiplier > 1.0f)
            bonuses.Add($"{planet.FuelMultiplier}× Fuel");
        if (planet.FoodMultiplier != 1.0f)
            bonuses.Add($"{planet.FoodMultiplier}× Food");

        return bonuses.Count > 0 ? string.Join(", ", bonuses) : "No bonuses";
    }

    private Sprite GetPlanetTypeIcon(PlanetType type)
    {
        // Load icon from Resources
        return Resources.Load<Sprite>($"Icons/Planet_{type}");
    }

    private Material GetPlanetMaterial(PlanetType type)
    {
        // Load material from Resources
        return Resources.Load<Material>($"Materials/Planet_{type}");
    }
}
```

### UI Mockup Layout

```
┌────────────────────────────────────────────────────────────────┐
│ ← Back                      VULCAN PRIME                  HUD │
├───────────────┬──────────────────────────────┬─────────────────┤
│ PLANET INFO   │      3D PLANET VIEW          │  BUILDINGS      │
│               │                              │                 │
│ Volcanic      │         ╭───╮                │ Docking Bays    │
│ 🌋            │        │ 🌍 │  ← rotating   │ 2/3             │
│               │         ╰───╯                │ [Build]         │
│ Population    │                              │                 │
│ 500 / 10,000  │    (orbital platforms)       │ Surface         │
│               │                              │ Platforms       │
│ Morale: 85%   │                              │ 4/6             │
│ ████████░░    │    (surface buildings)       │ [Build]         │
│               │                              │                 │
│ Bonuses:      │                              │ Mining Stations │
│ • 5.0× Min    │                              │ 3 active        │
│ • 3.0× Fuel   │                              │ +750 Min/turn   │
│ • 0.5× Food   │                              │ [Build]         │
│               │                              │                 │
│ Tax Rate      │                              │ Horticultural   │
│ ──●────── 50% │                              │ 1 active        │
│               │                              │ +50 Food/turn   │
│               │                              │ [Build]         │
└───────────────┴──────────────────────────────┴─────────────────┘
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Planet data
- **AFS-012 (Planet System)**: Planet properties
- **AFS-061 (Building System)**: Construction mechanics

### Depended On By
- **AFS-071 (UI State Machine)**: Panel visibility control
- **AFS-072 (HUD System)**: Resource overlay

### Events Subscribed
- `BuildingSystem.OnBuildingStarted`: Updates construction queue
- `BuildingSystem.OnBuildingCompleted`: Updates building list
- `PlatoonSystem.OnPlatoonCommissioned`: Updates garrison list

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
