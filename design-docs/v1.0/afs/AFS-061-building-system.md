# AFS-061: Building System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-COLONY-002

---

## Summary

Colony infrastructure system implementing building construction (Docking Bays, Mining Stations, Horticultural Stations, Surface Platforms), managing construction timers, crew requirements, production bonuses, and planet capacity limits.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Building entity storage
- **AFS-012 (Planet System)**: Planet capacity and properties
- **AFS-021 (Resource System)**: Construction costs
- **AFS-023 (Population System)**: Crew allocation
- **AFS-022 (Income System)**: Building production

---

## Requirements

### Building Types

1. **Docking Bay** (Orbital Platform)
   - **Purpose**: Dock craft in orbit (2 craft per bay)
   - **Capacity**: Maximum 3 per planet
   - **Cost**: 5,000 Credits + 1,000 Minerals + 500 Fuel
   - **Construction Time**: 2 turns
   - **Crew**: None (automated)
   - **Production**: None
   - **Strategic Value**: Essential for fleet operations

2. **Surface Platform** (Foundation)
   - **Purpose**: Foundation for surface buildings
   - **Capacity**: Maximum 6 per planet
   - **Cost**: 2,000 Credits + 500 Minerals
   - **Construction Time**: 1 turn
   - **Crew**: None
   - **Production**: None
   - **Strategic Value**: Required before building structures

3. **Mining Station** (Resource Production)
   - **Purpose**: Extract Minerals and Fuel
   - **Requires**: 1 Surface Platform slot
   - **Cost**: 8,000 Credits + 2,000 Minerals + 1,000 Fuel
   - **Construction Time**: 3 turns
   - **Crew**: 15 population
   - **Production**:
     - 50 Minerals/turn × planet multiplier
     - 30 Fuel/turn × planet multiplier
   - **Planet Bonuses**:
     - Volcanic: 5x Minerals, 3x Fuel
     - Others: 1x

4. **Horticultural Station** (Food Production)
   - **Purpose**: Grow food for population
   - **Requires**: 1 Surface Platform slot
   - **Cost**: 6,000 Credits + 1,500 Minerals + 800 Fuel
   - **Construction Time**: 2 turns
   - **Crew**: 10 population
   - **Production**:
     - 100 Food/turn × planet multiplier
   - **Planet Bonuses**:
     - Tropical: 2x Food
     - Volcanic: 0.5x Food (penalty)
     - Desert: 0.25x Food (penalty)

### Construction Process

1. **Construction Validation**
   - Check planet capacity (3 Docking Bays, 6 Surface Platforms)
   - Validate resources (Credits, Minerals, Fuel)
   - Check crew availability (for stations requiring crew)
   - Prevent construction if any check fails

2. **Construction Initiation**
   - Deduct construction cost from planet resources
   - Create building entity (State = UnderConstruction)
   - Set TurnsRemaining (1-3 turns depending on type)
   - Add to planet Structures list
   - Display: "Mining Station under construction (3 turns)"

3. **Construction Progress**
   - Execute during Income Phase (each turn)
   - Decrement TurnsRemaining by 1
   - Update UI: "Mining Station (2 turns remaining)"
   - Complete when TurnsRemaining = 0

4. **Construction Completion**
   - Set State = Active
   - Allocate crew (if required)
   - Begin production (next Income Phase)
   - Display: "Mining Station complete! Now producing resources."

### Building Management

1. **Building Status**
   - **Under Construction**: Not yet operational, countdown visible
   - **Active**: Fully operational, producing resources
   - **Inactive**: Built but no crew assigned (no production)
   - **Damaged**: Combat damage (future feature, not MVP)
   - **Destroyed**: Removed from planet (combat loss)

2. **Crew Assignment**
   - Automatic crew allocation (see AFS-022 Income System)
   - Priority: Horticultural (food) → Mining (resources) → Solar (energy)
   - Buildings without crew show "Inactive" status (red icon)
   - Player warned: "Mining Station inactive (insufficient crew on Vulcan Prime)"

3. **Building Destruction**
   - Combat damage destroys buildings (future feature)
   - Player can scrap buildings (50% refund)
   - Scrapping returns 50% of Credits and Minerals
   - Crew returns to population

### Planet Capacity

1. **Docking Bay Capacity**
   - **Maximum**: 3 Docking Bays per planet
   - **Slot Usage**: Each bay takes 1 orbital slot
   - **Craft Capacity**: 2 craft per bay (6 craft total)
   - **Overflow**: Excess craft orbit planet (vulnerable)

2. **Surface Platform Capacity**
   - **Maximum**: 6 Surface Platforms per planet
   - **Slot Usage**: Each building takes 1 platform
   - **Building Types**: Mining, Horticultural, or Platoon garrison
   - **Mixed Use**: Can combine different building types

3. **Capacity Display**
   - Show capacity: "Docking Bays: 2/3"
   - Show capacity: "Surface Platforms: 4/6 (2 Mining, 2 Horticultural)"
   - Disable "Build" button when capacity full
   - Warning: "Planet at maximum capacity!"

### Construction Queue

1. **Sequential Construction**
   - Only 1 building under construction at a time per planet (MVP)
   - Player can queue multiple buildings (future feature)
   - Construction starts automatically when previous finishes

2. **Construction Cancellation**
   - Player can cancel construction (refund 75% cost)
   - Building removed from queue
   - Resources returned to planet
   - Display: "Construction cancelled, 75% refunded"

---

## Acceptance Criteria

### Functional Criteria

- [ ] All 4 building types (Docking Bay, Platform, Mining, Horticultural) implemented
- [ ] Planet capacity limits enforced (3 Docking Bays, 6 Platforms)
- [ ] Construction costs deducted correctly
- [ ] Construction timers count down each turn
- [ ] Buildings activate on completion
- [ ] Crew requirements enforced (10/15 per station)
- [ ] Inactive buildings don't produce resources
- [ ] Building production matches specifications
- [ ] Scrap building refunds 50% cost

### Performance Criteria

- [ ] Construction validation executes in <10ms
- [ ] Building updates execute in <50ms per turn
- [ ] UI updates smooth when building completes

### Integration Criteria

- [ ] Integrates with Planet System (AFS-012) for capacity
- [ ] Uses Resource System (AFS-021) for costs and refunds
- [ ] Uses Population System (AFS-023) for crew allocation
- [ ] Provides production to Income System (AFS-022)
- [ ] Triggered by Turn System (AFS-002) for construction progress

---

## Technical Notes

### Implementation Approach

```csharp
public class BuildingSystem : MonoBehaviour
{
    private static BuildingSystem _instance;
    public static BuildingSystem Instance => _instance;

    public event Action<int, BuildingType> OnBuildingStarted; // planetID, buildingType
    public event Action<int, BuildingType> OnBuildingCompleted; // planetID, buildingType
    public event Action<int, BuildingType> OnBuildingScrapped; // planetID, buildingType

    // Start building construction
    public bool StartConstruction(int planetID, BuildingType type)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError("Invalid planet!");
            return false;
        }

        // Validate capacity
        if (!CanBuild(planetID, type))
        {
            UIManager.Instance.ShowError("Planet at maximum capacity!");
            return false;
        }

        // Get cost and construction time
        var cost = GetBuildingCost(type);
        int constructionTime = GetConstructionTime(type);

        // Validate resources
        if (!ResourceSystem.Instance.CanAfford(planetID, cost))
        {
            UIManager.Instance.ShowError("Insufficient resources!");
            return false;
        }

        // Deduct cost
        ResourceSystem.Instance.RemoveResources(planetID, cost);

        // Create building entity
        var building = new Structure
        {
            ID = GameStateManager.Instance.GetNextStructureID(),
            Type = type,
            Status = BuildingStatus.UnderConstruction,
            TurnsRemaining = constructionTime
        };

        planet.Structures.Add(building);

        OnBuildingStarted?.Invoke(planetID, type);
        UIManager.Instance.ShowMessage($"{type} construction started on {planet.Name} ({constructionTime} turns)");
        Debug.Log($"Started {type} on {planet.Name}, cost: {cost.Credits} Credits");

        return true;
    }

    // Update construction progress (called each turn)
    public void UpdateConstructions()
    {
        var planets = GameStateManager.Instance.GetAllPlanets();

        foreach (var planet in planets)
        {
            var underConstruction = planet.Structures
                .Where(s => s.Status == BuildingStatus.UnderConstruction)
                .ToList();

            foreach (var building in underConstruction)
            {
                building.TurnsRemaining--;

                if (building.TurnsRemaining <= 0)
                {
                    // Construction complete
                    building.Status = BuildingStatus.Active;
                    building.TurnsRemaining = 0;

                    OnBuildingCompleted?.Invoke(planet.ID, building.Type);
                    UIManager.Instance.ShowMessage($"{building.Type} complete on {planet.Name}!");
                    Debug.Log($"{building.Type} construction complete on {planet.Name}");
                }
                else
                {
                    Debug.Log($"{building.Type} on {planet.Name}: {building.TurnsRemaining} turns remaining");
                }
            }
        }
    }

    // Scrap building (destroy, refund 50%)
    public void ScrapBuilding(int planetID, int buildingID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return;

        var building = planet.Structures.FirstOrDefault(s => s.ID == buildingID);
        if (building == null)
            return;

        // Refund 50% of cost
        var cost = GetBuildingCost(building.Type);
        var refund = new ResourceDelta
        {
            Credits = cost.Credits / 2,
            Minerals = cost.Minerals / 2
        };

        ResourceSystem.Instance.AddResources(planetID, refund);

        // Remove building
        planet.Structures.Remove(building);

        OnBuildingScrapped?.Invoke(planetID, building.Type);
        UIManager.Instance.ShowMessage($"{building.Type} scrapped, refunded {refund.Credits} Credits");
        Debug.Log($"Scrapped {building.Type} on {planet.Name}");
    }

    // Check if can build (capacity validation)
    private bool CanBuild(int planetID, BuildingType type)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return false;

        if (type == BuildingType.DockingBay)
        {
            return planet.CanBuildDockingBay(); // Max 3
        }
        else
        {
            return planet.CanBuildSurfaceStructure(); // Max 6
        }
    }

    // Get building cost
    private ResourceCost GetBuildingCost(BuildingType type)
    {
        switch (type)
        {
            case BuildingType.DockingBay:
                return new ResourceCost { Credits = 5000, Minerals = 1000, Fuel = 500 };
            case BuildingType.SurfacePlatform:
                return new ResourceCost { Credits = 2000, Minerals = 500 };
            case BuildingType.MiningStation:
                return new ResourceCost { Credits = 8000, Minerals = 2000, Fuel = 1000 };
            case BuildingType.HorticulturalStation:
                return new ResourceCost { Credits = 6000, Minerals = 1500, Fuel = 800 };
            default:
                return ResourceCost.Zero;
        }
    }

    // Get construction time
    private int GetConstructionTime(BuildingType type)
    {
        switch (type)
        {
            case BuildingType.DockingBay: return 2;
            case BuildingType.SurfacePlatform: return 1;
            case BuildingType.MiningStation: return 3;
            case BuildingType.HorticulturalStation: return 2;
            default: return 1;
        }
    }

    // Get building info for UI
    public BuildingInfo GetBuildingInfo(BuildingType type)
    {
        var cost = GetBuildingCost(type);
        int constructionTime = GetConstructionTime(type);

        return new BuildingInfo
        {
            Type = type,
            Name = type.ToString(),
            Description = GetBuildingDescription(type),
            Cost = cost,
            ConstructionTime = constructionTime,
            CrewRequired = GetCrewRequired(type),
            Production = GetProductionInfo(type)
        };
    }

    private string GetBuildingDescription(BuildingType type)
    {
        switch (type)
        {
            case BuildingType.DockingBay:
                return "Orbital platform for docking craft (2 craft per bay)";
            case BuildingType.SurfacePlatform:
                return "Foundation for surface buildings";
            case BuildingType.MiningStation:
                return "Extracts Minerals (50/turn) and Fuel (30/turn)";
            case BuildingType.HorticulturalStation:
                return "Produces Food (100/turn)";
            default:
                return "Unknown building";
        }
    }

    private int GetCrewRequired(BuildingType type)
    {
        switch (type)
        {
            case BuildingType.MiningStation: return 15;
            case BuildingType.HorticulturalStation: return 10;
            default: return 0;
        }
    }

    private string GetProductionInfo(BuildingType type)
    {
        switch (type)
        {
            case BuildingType.MiningStation:
                return "50 Minerals/turn, 30 Fuel/turn (× planet bonus)";
            case BuildingType.HorticulturalStation:
                return "100 Food/turn (× planet bonus)";
            default:
                return "None";
        }
    }
}

public class BuildingInfo
{
    public BuildingType Type;
    public string Name;
    public string Description;
    public ResourceCost Cost;
    public int ConstructionTime;
    public int CrewRequired;
    public string Production;
}
```

### Building Cost Summary

| Building | Credits | Minerals | Fuel | Time | Crew | Production |
|----------|---------|----------|------|------|------|------------|
| Docking Bay | 5,000 | 1,000 | 500 | 2 turns | 0 | None (docks 2 craft) |
| Surface Platform | 2,000 | 500 | 0 | 1 turn | 0 | None (foundation) |
| Mining Station | 8,000 | 2,000 | 1,000 | 3 turns | 15 | 50 Minerals, 30 Fuel/turn |
| Horticultural Station | 6,000 | 1,500 | 800 | 2 turns | 10 | 100 Food/turn |

### Planet Build Example

**Vulcan Prime (Volcanic Planet) - Full Buildout:**
```
Docking Bays: 3/3
  - Bay 1: Active (USCS Cruiser 01, USCS Cruiser 02)
  - Bay 2: Active (USCS Cargo 01, Empty)
  - Bay 3: Active (Empty, Empty)

Surface Platforms: 6/6
  - Platform 1: Mining Station (Active, 15 crew) → 250 Minerals/turn (50 × 5.0)
  - Platform 2: Mining Station (Active, 15 crew) → 250 Minerals/turn (50 × 5.0)
  - Platform 3: Mining Station (Active, 15 crew) → 250 Minerals/turn (50 × 5.0)
  - Platform 4: Mining Station (Active, 15 crew) → 250 Minerals/turn (50 × 5.0)
  - Platform 5: Horticultural Station (Active, 10 crew) → 50 Food/turn (100 × 0.5 penalty)
  - Platform 6: Platoon Garrison (Platoon 03, 150 troops)

Total Crew Used: 70 (out of 500 population)
Total Production: 1,000 Minerals/turn, 360 Fuel/turn, 50 Food/turn
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Building storage
- **AFS-012 (Planet System)**: Planet capacity
- **AFS-021 (Resource System)**: Construction costs

### Depended On By
- **AFS-002 (Turn System)**: Construction progress updates
- **AFS-022 (Income System)**: Building production
- **AFS-023 (Population System)**: Crew allocation
- **AFS-071 (UI State Machine)**: Building UI panels

### Events Published
- `OnBuildingStarted(int planetID, BuildingType type)`: Construction begun
- `OnBuildingCompleted(int planetID, BuildingType type)`: Construction finished
- `OnBuildingScrapped(int planetID, BuildingType type)`: Building destroyed by player

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
