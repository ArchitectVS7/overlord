# AFS-032: Craft System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ENTITY-001, FR-ENTITY-003

---

## Summary

Space craft management system implementing 4 craft types (Battle Cruiser, Cargo Cruiser, Solar Satellite, Atmosphere Processor), managing craft properties, crew requirements, cargo capacity, platoon transport, and providing fleet roster UI.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Craft entity storage
- **AFS-031 (Entity System)**: Craft entity base structure
- **AFS-014 (Navigation System)**: Craft movement and travel
- **AFS-021 (Resource System)**: Cargo transport
- **AFS-033 (Platoon System)**: Platoon transport on Battle Cruisers

---

## Requirements

### Craft Types

1. **Battle Cruiser** (Combat & Transport)
   - **Purpose**: Military combat vessel, platoon transport
   - **Crew**: 50 population
   - **Cost**: 50,000 Credits + 10,000 Minerals + 5,000 Fuel
   - **Platoon Capacity**: 4 platoons maximum
   - **Cargo Capacity**: None (military vessel)
   - **Speed**: 50 units/turn
   - **Fuel Consumption**: 1 Fuel per 10 units traveled
   - **Combat**: Participates in space battles (future feature)
   - **Strategic Role**: Invasion force, planet defense, military projection

2. **Cargo Cruiser** (Resource Transport)
   - **Purpose**: Inter-planet resource shipping
   - **Crew**: 30 population
   - **Cost**: 30,000 Credits + 5,000 Minerals + 3,000 Fuel
   - **Platoon Capacity**: None (civilian vessel)
   - **Cargo Capacity**: 1,000 units per resource type
   - **Speed**: 30 units/turn (slower than Battle Cruiser)
   - **Fuel Consumption**: 1 Fuel per 5 units traveled (less efficient)
   - **Combat**: Cannot fight (defenseless)
   - **Strategic Role**: Resource logistics, colony supply chains

3. **Solar Satellite** (Energy Production)
   - **Purpose**: Orbital energy generation
   - **Crew**: 5 population (orbital crew)
   - **Cost**: 15,000 Credits + 3,000 Minerals + 1,000 Fuel
   - **Platoon Capacity**: None
   - **Cargo Capacity**: None
   - **Speed**: 0 (stationary once deployed)
   - **Fuel Consumption**: None (deployed at planet)
   - **Production**: 80 Energy/turn × planet multiplier
   - **Deployment**: Purchased at planet, cannot move afterward
   - **Strategic Role**: Energy production, especially on Desert planets

4. **Atmosphere Processor** (Terraforming)
   - **Purpose**: Colonize uninhabitable neutral planets
   - **Crew**: 20 population (construction crew)
   - **Cost**: 10,000 Credits + 5,000 Minerals + 2,000 Fuel
   - **Platoon Capacity**: None
   - **Cargo Capacity**: None
   - **Speed**: 30 units/turn (transport to target planet)
   - **Fuel Consumption**: 1 Fuel per 5 units traveled
   - **Terraforming Duration**: 10 turns once deployed
   - **Deployment**: One-time use, cannot be reused
   - **Strategic Role**: Colony expansion, claiming neutral planets

### Craft Properties

1. **Common Properties** (from AFS-031 Entity)
   - ID, Name, Owner, State, Position
   - LocationPlanetID (current planet, -1 if in transit)
   - InTransit (boolean)

2. **Type-Specific Properties**
   - **Battle Cruiser**: CarriedPlatoonIDs (List<int>, max 4)
   - **Cargo Cruiser**: CargoHold (ResourceDelta)
   - **Solar Satellite**: Active (boolean, requires 5 crew)
   - **Atmosphere Processor**: DeployedAtPlanetID, TurnsRemaining (10 → 0)

3. **Crew Requirements**
   - Crew deducted from planet population on purchase
   - Crew returns to population if craft destroyed
   - Crew warning if insufficient population

### Fleet Management

1. **Fleet Roster UI**
   - List all craft (max 32)
   - Display columns:
     - Name (e.g., "USCS Cruiser 01")
     - Type (Battle Cruiser, Cargo, etc.)
     - Location (Planet name or "In Transit to X")
     - Cargo (for Cargo Cruisers: "500 Food, 300 Minerals")
     - Platoons (for Battle Cruisers: "3/4 platoons")
     - Crew (50/30/5/20 depending on type)
   - Sort by: Type, Location, Name
   - Filter by: All, Combat, Transport, Production

2. **Craft Selection**
   - Click craft to select
   - Display craft detail panel:
     - Craft name and type
     - Current location or journey status
     - Cargo/platoon manifest
     - Command buttons (Launch, Journey, Land, Abort)
   - Multi-select for fleet operations (Shift+Click)

3. **Craft Commands**
   - **Purchase**: Buy new craft (validate crew, cost, limit)
   - **Scrap**: Destroy craft, refund 50% cost, return crew
   - **Journey**: Navigate to destination planet (see AFS-014)
   - **Abort Journey**: Cancel in-transit movement
   - **Load Cargo**: Transfer resources (Cargo Cruiser only)
   - **Unload Cargo**: Deliver resources at destination
   - **Embark Platoons**: Load troops (Battle Cruiser only, max 4)
   - **Disembark Platoons**: Unload troops at planet
   - **Deploy**: Activate Atmosphere Processor or Solar Satellite

### Craft Lifecycle

1. **Purchase**
   - Validate: Credits, Minerals, Fuel, Crew, Fleet limit (32)
   - Deduct cost from planet resources
   - Deduct crew from planet population
   - Create craft entity at purchase planet
   - Add to fleet roster

2. **Operation**
   - Battle Cruiser: Transport platoons, engage in combat
   - Cargo Cruiser: Transport resources between planets
   - Solar Satellite: Generate energy each turn (if active)
   - Atmosphere Processor: Terraform planet over 10 turns

3. **Destruction**
   - Combat destruction (see AFS-041)
   - Scrapping (player decision)
   - Return crew to planet population (if docked)
   - Remove from fleet roster
   - Trigger OnCraftDestroyed event

---

## Acceptance Criteria

### Functional Criteria

- [ ] All 4 craft types (Battle Cruiser, Cargo, Solar, Atmosphere) implemented
- [ ] Fleet limit (32 craft) enforced
- [ ] Crew requirements validated on purchase
- [ ] Battle Cruiser can carry 4 platoons
- [ ] Cargo Cruiser can transport 1,000 per resource type
- [ ] Solar Satellite generates 80 Energy/turn when active
- [ ] Atmosphere Processor terraforms planet in 10 turns
- [ ] Fleet roster displays all craft with correct info
- [ ] Craft commands (Purchase, Journey, Load, etc.) work correctly

### Performance Criteria

- [ ] Fleet roster updates in <50ms
- [ ] Craft queries execute in <1ms
- [ ] No lag when selecting craft in large fleets (32 craft)

### Integration Criteria

- [ ] Integrates with Entity System (AFS-031) for craft entities
- [ ] Uses Navigation System (AFS-014) for craft movement
- [ ] Uses Resource System (AFS-021) for cargo transport
- [ ] Integrates with Platoon System (AFS-033) for troop transport
- [ ] Provides craft data to UI System (AFS-071)

---

## Technical Notes

### Implementation Approach

```csharp
public class CraftSystem : MonoBehaviour
{
    private static CraftSystem _instance;
    public static CraftSystem Instance => _instance;

    public event Action<int> OnCraftPurchased; // craftID
    public event Action<int> OnCraftScrapped; // craftID
    public event Action<int, List<int>> OnPlatoonsEmbarked; // craftID, platoonIDs
    public event Action<int, List<int>> OnPlatoonsDisembarked; // craftID, platoonIDs

    // Purchase new craft
    public int PurchaseCraft(CraftType type, int planetID, FactionType owner)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError("Invalid planet!");
            return -1;
        }

        // Validate fleet limit
        if (!EntitySystem.Instance.CanCreateCraft())
        {
            UIManager.Instance.ShowError("Fleet limit reached (32/32)!");
            return -1;
        }

        // Get cost and crew requirements
        var cost = GetCraftCost(type);
        int crewRequired = GetCraftCrew(type);

        // Validate resources
        if (!ResourceSystem.Instance.CanAfford(planetID, cost))
        {
            UIManager.Instance.ShowError("Insufficient resources!");
            return -1;
        }

        // Validate crew
        if (!PopulationSystem.Instance.HasSufficientCrew(planetID, crewRequired))
        {
            UIManager.Instance.ShowError($"Insufficient crew! Need {crewRequired} population.");
            return -1;
        }

        // Deduct cost
        ResourceSystem.Instance.RemoveResources(planetID, cost);

        // Deduct crew from population
        planet.Population -= crewRequired;

        // Create craft
        int craftID = EntitySystem.Instance.CreateCraft(type, planetID, owner);

        OnCraftPurchased?.Invoke(craftID);
        Debug.Log($"Purchased {type} (ID: {craftID}) at {planet.Name} for {cost.Credits} Credits");

        return craftID;
    }

    // Scrap craft (destroy, refund 50% cost, return crew)
    public void ScrapCraft(int craftID)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        if (craft == null || craft.InTransit)
        {
            UIManager.Instance.ShowError("Cannot scrap craft in transit!");
            return;
        }

        var planet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
        if (planet == null)
            return;

        // Refund 50% of cost
        var cost = GetCraftCost(craft.Type);
        var refund = new ResourceCost
        {
            Credits = cost.Credits / 2,
            Minerals = cost.Minerals / 2,
            Fuel = cost.Fuel / 2
        };

        ResourceSystem.Instance.AddResources(planet.ID, refund.ToResourceDelta());

        // Return crew to population
        int crew = GetCraftCrew(craft.Type);
        planet.Population += crew;

        // Destroy craft
        EntitySystem.Instance.DestroyCraft(craftID);

        OnCraftScrapped?.Invoke(craftID);
        Debug.Log($"Scrapped {craft.Name}, refunded {refund.Credits} Credits, returned {crew} crew");
    }

    // Embark platoons onto Battle Cruiser
    public bool EmbarkPlatoons(int craftID, List<int> platoonIDs)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        if (craft == null || craft.Type != CraftType.BattleCruiser)
        {
            UIManager.Instance.ShowError("Only Battle Cruisers can carry platoons!");
            return false;
        }

        if (craft.CarriedPlatoonIDs.Count + platoonIDs.Count > 4)
        {
            UIManager.Instance.ShowError("Battle Cruiser can carry max 4 platoons!");
            return false;
        }

        foreach (var platoonID in platoonIDs)
        {
            var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
            if (platoon == null || platoon.LocationPlanetID != craft.LocationPlanetID)
            {
                UIManager.Instance.ShowError("Platoon not at same planet as Battle Cruiser!");
                return false;
            }

            // Embark platoon
            craft.CarriedPlatoonIDs.Add(platoonID);
            platoon.LocationPlanetID = -1;
            platoon.CarriedByCraftID = craftID;
        }

        OnPlatoonsEmbarked?.Invoke(craftID, platoonIDs);
        Debug.Log($"Embarked {platoonIDs.Count} platoons onto {craft.Name}");
        return true;
    }

    // Disembark platoons from Battle Cruiser
    public bool DisembarkPlatoons(int craftID, List<int> platoonIDs)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        if (craft == null || craft.Type != CraftType.BattleCruiser)
            return false;

        var planet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
        if (planet == null)
        {
            UIManager.Instance.ShowError("Cannot disembark in space!");
            return false;
        }

        foreach (var platoonID in platoonIDs)
        {
            var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
            if (platoon == null || platoon.CarriedByCraftID != craftID)
                continue;

            // Disembark platoon
            craft.CarriedPlatoonIDs.Remove(platoonID);
            platoon.LocationPlanetID = craft.LocationPlanetID;
            platoon.CarriedByCraftID = -1;
        }

        OnPlatoonsDisembarked?.Invoke(craftID, platoonIDs);
        Debug.Log($"Disembarked {platoonIDs.Count} platoons from {craft.Name} at {planet.Name}");
        return true;
    }

    // Deploy Solar Satellite (permanent)
    public void DeploySolarSatellite(int craftID)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        if (craft == null || craft.Type != CraftType.SolarSatellite)
            return;

        // Solar Satellite is purchased already deployed
        // Just ensure it has 5 crew assigned
        var planet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
        if (PopulationSystem.Instance.HasSufficientCrew(planet.ID, 5))
        {
            craft.Active = true;
            Debug.Log($"Solar Satellite deployed at {planet.Name}, generating 80 Energy/turn");
        }
        else
        {
            craft.Active = false;
            UIManager.Instance.ShowWarning($"Solar Satellite inactive (insufficient crew on {planet.Name})");
        }
    }

    // Deploy Atmosphere Processor (starts terraforming)
    public void DeployAtmosphereProcessor(int craftID)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        if (craft == null || craft.Type != CraftType.AtmosphereProcessor)
            return;

        var planet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
        if (planet == null || planet.Colonized)
        {
            UIManager.Instance.ShowError("Planet already colonized or invalid!");
            return;
        }

        // Start terraforming
        planet.TerraformingProgress = 10; // 10 turns to completion

        // Destroy Atmosphere Processor (one-time use)
        EntitySystem.Instance.DestroyCraft(craftID);

        UIManager.Instance.ShowMessage($"Atmosphere Processor deployed at {planet.Name}! Terraforming in 10 turns.");
        Debug.Log($"Atmosphere Processor deployed at {planet.Name}, terraforming started");
    }

    // Get craft cost
    private ResourceCost GetCraftCost(CraftType type)
    {
        switch (type)
        {
            case CraftType.BattleCruiser:
                return new ResourceCost { Credits = 50000, Minerals = 10000, Fuel = 5000 };
            case CraftType.CargoCruiser:
                return new ResourceCost { Credits = 30000, Minerals = 5000, Fuel = 3000 };
            case CraftType.SolarSatellite:
                return new ResourceCost { Credits = 15000, Minerals = 3000, Fuel = 1000 };
            case CraftType.AtmosphereProcessor:
                return new ResourceCost { Credits = 10000, Minerals = 5000, Fuel = 2000 };
            default:
                return ResourceCost.Zero;
        }
    }

    // Get craft crew requirement
    private int GetCraftCrew(CraftType type)
    {
        switch (type)
        {
            case CraftType.BattleCruiser: return 50;
            case CraftType.CargoCruiser: return 30;
            case CraftType.SolarSatellite: return 5;
            case CraftType.AtmosphereProcessor: return 20;
            default: return 0;
        }
    }
}
```

### Craft Cost Summary

| Craft Type | Credits | Minerals | Fuel | Crew |
|------------|---------|----------|------|------|
| Battle Cruiser | 50,000 | 10,000 | 5,000 | 50 |
| Cargo Cruiser | 30,000 | 5,000 | 3,000 | 30 |
| Solar Satellite | 15,000 | 3,000 | 1,000 | 5 |
| Atmosphere Processor | 10,000 | 5,000 | 2,000 | 20 |

### Fleet Roster UI Example

```csharp
public class FleetRosterUI : MonoBehaviour
{
    [SerializeField] private Transform _craftListContainer;
    [SerializeField] private GameObject _craftRowPrefab;

    private void Start()
    {
        RefreshFleetRoster();
    }

    private void RefreshFleetRoster()
    {
        // Clear existing rows
        foreach (Transform child in _craftListContainer)
        {
            Destroy(child.gameObject);
        }

        // Get all player craft
        var craft = GameStateManager.Instance.GetCraft(FactionType.Player);

        // Create row for each craft
        foreach (var c in craft)
        {
            var row = Instantiate(_craftRowPrefab, _craftListContainer);
            var rowUI = row.GetComponent<CraftRowUI>();
            rowUI.Initialize(c);
        }

        UIManager.Instance.ShowMessage($"Fleet: {craft.Count}/32 craft");
    }
}

public class CraftRowUI : MonoBehaviour
{
    [SerializeField] private Text _nameLabel;
    [SerializeField] private Text _typeLabel;
    [SerializeField] private Text _locationLabel;
    [SerializeField] private Text _cargoLabel;
    [SerializeField] private Button _selectButton;

    private CraftEntity _craft;

    public void Initialize(CraftEntity craft)
    {
        _craft = craft;

        _nameLabel.text = craft.Name;
        _typeLabel.text = craft.Type.ToString();

        // Location
        if (craft.InTransit)
        {
            _locationLabel.text = "In Transit";
        }
        else
        {
            var planet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
            _locationLabel.text = planet?.Name ?? "Unknown";
        }

        // Cargo/Platoons
        if (craft.Type == CraftType.CargoCruiser && craft.CargoHold != null)
        {
            _cargoLabel.text = $"Cargo: {craft.CargoHold}";
        }
        else if (craft.Type == CraftType.BattleCruiser)
        {
            _cargoLabel.text = $"Platoons: {craft.CarriedPlatoonIDs.Count}/4";
        }
        else
        {
            _cargoLabel.text = "-";
        }

        _selectButton.onClick.AddListener(() => OnCraftSelected());
    }

    private void OnCraftSelected()
    {
        UIManager.Instance.ShowCraftDetails(_craft.ID);
    }
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Craft storage
- **AFS-031 (Entity System)**: Craft entity structure
- **AFS-014 (Navigation System)**: Craft movement
- **AFS-021 (Resource System)**: Craft costs and cargo

### Depended On By
- **AFS-033 (Platoon System)**: Platoon transport
- **AFS-041 (Combat System)**: Battle Cruiser combat
- **AFS-022 (Income System)**: Solar Satellite energy production
- **AFS-012 (Planet System)**: Atmosphere Processor terraforming
- **AFS-071 (UI State Machine)**: Fleet roster UI

### Events Published
- `OnCraftPurchased(int craftID)`: New craft bought
- `OnCraftScrapped(int craftID)`: Craft destroyed by player
- `OnPlatoonsEmbarked(int craftID, List<int> platoonIDs)`: Troops loaded
- `OnPlatoonsDisembarked(int craftID, List<int> platoonIDs)`: Troops unloaded
- `OnAtmosphereProcessorDeployed(int planetID)`: Terraforming started

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
