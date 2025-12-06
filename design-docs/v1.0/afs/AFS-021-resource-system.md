# AFS-021: Resource System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ECON-001, FR-COLONY-003

---

## Summary

Resource management system implementing 4 resource types (Food, Minerals, Fuel, Energy) plus Credits, providing storage, transfer, validation, and UI display with planet-specific multipliers and cargo ship logistics.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Resource state storage
- **AFS-012 (Planet System)**: Planet resource bonuses and storage
- **AFS-031 (Entity System)**: Cargo ship resource transport

---

## Requirements

### Resource Types

1. **Food**
   - **Purpose**: Feed population, required for population growth
   - **Production**: Horticultural Stations
   - **Consumption**: 0.5 Food per person per turn
   - **Planet Bonuses**:
     - Tropical: **2x** production
     - Volcanic: **0.5x** production (penalty)
     - Desert: **0.25x** production (penalty)
   - **Storage**: Unlimited per planet
   - **UI Color**: **Green**

2. **Minerals**
   - **Purpose**: Build structures, craft, and equipment
   - **Production**: Mining Stations
   - **Consumption**: Construction and manufacturing
   - **Planet Bonuses**:
     - Volcanic: **5x** production
     - All others: **1x** (normal)
   - **Storage**: Unlimited per planet
   - **UI Color**: **Brown/Gray**

3. **Fuel**
   - **Purpose**: Power craft movement, construction energy
   - **Production**: Mining Stations
   - **Consumption**: Fleet travel, building operation
   - **Planet Bonuses**:
     - Volcanic: **3x** production
     - All others: **1x** (normal)
   - **Storage**: Unlimited per planet
   - **UI Color**: **Orange/Red**

4. **Energy**
   - **Purpose**: Power structures, craft systems
   - **Production**: Solar Satellites (orbital craft)
   - **Consumption**: Building operation, production
   - **Planet Bonuses**:
     - Desert: **2x** production (clear skies)
     - Tropical: **0.75x** production (cloudy)
     - All others: **1x** (normal)
   - **Storage**: Unlimited per planet
   - **UI Color**: **Yellow/Blue**

5. **Credits**
   - **Purpose**: Purchase units, structures, equipment
   - **Production**: Taxation (population-based)
   - **Consumption**: All purchases
   - **Planet Bonuses**:
     - Metropolis: **2x** from taxation
     - All others: **1x** (normal)
   - **Storage**: Unlimited per planet
   - **UI Color**: **Gold/White**

### Resource Storage

1. **Per-Planet Storage**
   - Each planet stores resources independently
   - No maximum capacity (unlimited storage)
   - Resources do not decay or expire
   - Resources persist between turns

2. **Starbase as Central Depot**
   - Player's starting planet (Starbase) acts as main resource hub
   - Most production/construction occurs at Starbase
   - Other colonies specialize in resource production
   - Cargo ships transport resources to Starbase

3. **Resource Transfer**
   - **Cargo Cruiser** required for inter-planet transport
   - Cargo capacity: 1,000 units per resource type per ship
   - Transfer takes 1 turn + travel time (see AFS-014 Navigation)
   - Manual transfer command (player selects source/destination)

### Resource Operations

1. **Add Resources**
   - Income phase adds production to planets
   - Validation: Cannot go negative
   - Event published for UI updates
   - Log changes in message console

2. **Remove Resources**
   - Construction/purchase deducts from planet
   - Validation: Must have sufficient resources
   - Return false if insufficient (transaction fails)
   - Display error message to player

3. **Transfer Resources**
   - Cargo ship loads resources at source planet
   - Travels to destination planet (see AFS-014)
   - Unloads resources on arrival
   - Partial transfers allowed (player specifies amount)

4. **Check Affordability**
   - Query before any purchase/construction
   - Returns true if planet has all required resources
   - Used by UI to enable/disable buttons
   - Used by AI to validate economic actions

### Resource Production Formulas

1. **Base Production Rates**
   - **Horticultural Station**: 100 Food/turn
   - **Mining Station**: 50 Minerals/turn + 30 Fuel/turn
   - **Solar Satellite**: 80 Energy/turn
   - **Taxation**: (Population ÷ 10) × Tax Rate × Credits Multiplier

2. **Planet Multipliers Applied**
   - Production = Base Rate × Planet Multiplier
   - Example: Horticultural on Tropical = 100 × 2.0 = **200 Food/turn**
   - Example: Mining on Volcanic = 50 × 5.0 = **250 Minerals/turn**

3. **Total Income Calculation**
   - Sum all buildings of each type on planet
   - Apply planet multipliers
   - Add to planet resource storage
   - Display breakdown in income report

### UI Display

1. **Resource Counters**
   - Display format: "X / Y" (current / maximum)
   - Maximum is "∞" (unlimited storage)
   - Color-coded icons for each resource type
   - Tooltips show production/consumption rates

2. **Income Report**
   - Breakdown per planet:
     - "Starbase: +200 Food (2 Horticultural)"
     - "Vulcan Prime: +1000 Minerals (4 Mining × 5.0)"
   - Total income summary: "Total: +500 Food, +1200 Minerals, +400 Fuel, +640 Energy"
   - Consumption summary: "Consumed: -500 Food (population), -150 Fuel (fleet)"

3. **Low Resource Warnings**
   - Yellow warning if resource < 500
   - Red alert if resource < 100
   - Critical alert if Food = 0 (population starving)
   - Display in message log: "WARNING: Low Fuel on Starbase!"

---

## Acceptance Criteria

### Functional Criteria

- [ ] All 5 resource types (Food, Minerals, Fuel, Energy, Credits) implemented
- [ ] Per-planet resource storage with unlimited capacity
- [ ] Planet multipliers apply correctly to production
- [ ] Resource transfers via Cargo Cruiser work
- [ ] Affordability checks prevent invalid transactions
- [ ] Resource consumption validated (cannot go negative)
- [ ] UI displays current resources with color-coded icons
- [ ] Income report shows per-planet breakdown

### Performance Criteria

- [ ] Resource queries execute in <1ms
- [ ] Resource mutations execute in <5ms
- [ ] Income calculations complete in <100ms per turn
- [ ] UI updates smooth (<16ms per frame)

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for storage
- [ ] Provides multipliers from Planet System (AFS-012)
- [ ] Provides transfer via Entity System (AFS-031) Cargo Cruisers
- [ ] Provides income calculations to Turn System (AFS-002)

---

## Technical Notes

### Implementation Approach

```csharp
[Serializable]
public class ResourceCollection
{
    public int Food;
    public int Minerals;
    public int Fuel;
    public int Energy;
    public int Credits;

    public static ResourceCollection operator +(ResourceCollection a, ResourceCollection b)
    {
        return new ResourceCollection
        {
            Food = a.Food + b.Food,
            Minerals = a.Minerals + b.Minerals,
            Fuel = a.Fuel + b.Fuel,
            Energy = a.Energy + b.Energy,
            Credits = a.Credits + b.Credits
        };
    }

    public static ResourceCollection operator -(ResourceCollection a, ResourceCollection b)
    {
        return new ResourceCollection
        {
            Food = a.Food - b.Food,
            Minerals = a.Minerals - b.Minerals,
            Fuel = a.Fuel - b.Fuel,
            Energy = a.Energy - b.Energy,
            Credits = a.Credits - b.Credits
        };
    }

    public bool HasSufficient(ResourceCost cost)
    {
        return Food >= cost.Food &&
               Minerals >= cost.Minerals &&
               Fuel >= cost.Fuel &&
               Energy >= cost.Energy &&
               Credits >= cost.Credits;
    }

    public override string ToString()
    {
        return $"Food: {Food}, Minerals: {Minerals}, Fuel: {Fuel}, Energy: {Energy}, Credits: {Credits}";
    }
}

[Serializable]
public class ResourceCost
{
    public int Food;
    public int Minerals;
    public int Fuel;
    public int Energy;
    public int Credits;

    public static ResourceCost Zero => new ResourceCost();
}

[Serializable]
public class ResourceDelta
{
    public int Food;
    public int Minerals;
    public int Fuel;
    public int Energy;
    public int Credits;

    public static ResourceDelta Zero => new ResourceDelta();

    public ResourceCollection ToCollection()
    {
        return new ResourceCollection
        {
            Food = this.Food,
            Minerals = this.Minerals,
            Fuel = this.Fuel,
            Energy = this.Energy,
            Credits = this.Credits
        };
    }
}

public class ResourceSystem : MonoBehaviour
{
    private static ResourceSystem _instance;
    public static ResourceSystem Instance => _instance;

    public event Action<int, ResourceDelta> OnResourcesChanged;
    public event Action<int, ResourceType> OnResourceCritical;

    // Add resources to planet
    public void AddResources(int planetID, ResourceDelta delta)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError($"Planet {planetID} not found!");
            return;
        }

        planet.Resources.Food += delta.Food;
        planet.Resources.Minerals += delta.Minerals;
        planet.Resources.Fuel += delta.Fuel;
        planet.Resources.Energy += delta.Energy;
        planet.Resources.Credits += delta.Credits;

        // Clamp to non-negative
        planet.Resources.Food = Mathf.Max(0, planet.Resources.Food);
        planet.Resources.Minerals = Mathf.Max(0, planet.Resources.Minerals);
        planet.Resources.Fuel = Mathf.Max(0, planet.Resources.Fuel);
        planet.Resources.Energy = Mathf.Max(0, planet.Resources.Energy);
        planet.Resources.Credits = Mathf.Max(0, planet.Resources.Credits);

        OnResourcesChanged?.Invoke(planetID, delta);
        CheckCriticalResources(planetID);
    }

    // Remove resources from planet
    public bool RemoveResources(int planetID, ResourceCost cost)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null || !planet.Resources.HasSufficient(cost))
        {
            return false; // Cannot afford
        }

        planet.Resources.Food -= cost.Food;
        planet.Resources.Minerals -= cost.Minerals;
        planet.Resources.Fuel -= cost.Fuel;
        planet.Resources.Energy -= cost.Energy;
        planet.Resources.Credits -= cost.Credits;

        var delta = new ResourceDelta
        {
            Food = -cost.Food,
            Minerals = -cost.Minerals,
            Fuel = -cost.Fuel,
            Energy = -cost.Energy,
            Credits = -cost.Credits
        };

        OnResourcesChanged?.Invoke(planetID, delta);
        CheckCriticalResources(planetID);
        return true;
    }

    // Transfer resources between planets via Cargo Cruiser
    public bool TransferResources(int cargoShipID, int sourcePlanetID, int destPlanetID, ResourceDelta delta)
    {
        var cargoShip = GameStateManager.Instance.GetCraftByID(cargoShipID);
        if (cargoShip == null || cargoShip.Type != CraftType.CargoCruiser)
        {
            Debug.LogError("Invalid cargo ship!");
            return false;
        }

        var sourcePlanet = GameStateManager.Instance.GetPlanetByID(sourcePlanetID);
        var destPlanet = GameStateManager.Instance.GetPlanetByID(destPlanetID);

        if (sourcePlanet == null || destPlanet == null)
        {
            Debug.LogError("Invalid planets!");
            return false;
        }

        // Check capacity (1,000 units per resource type)
        if (delta.Food > 1000 || delta.Minerals > 1000 || delta.Fuel > 1000 ||
            delta.Energy > 1000 || delta.Credits > 1000)
        {
            Debug.LogError("Cargo capacity exceeded!");
            return false;
        }

        // Remove from source
        var cost = new ResourceCost
        {
            Food = delta.Food,
            Minerals = delta.Minerals,
            Fuel = delta.Fuel,
            Energy = delta.Energy,
            Credits = delta.Credits
        };

        if (!RemoveResources(sourcePlanetID, cost))
        {
            Debug.LogError("Insufficient resources at source!");
            return false;
        }

        // Load cargo into ship
        cargoShip.CargoHold = delta;

        // Navigate to destination (see AFS-014)
        NavigationSystem.Instance.MoveCraft(cargoShipID, destPlanetID);

        Debug.Log($"Cargo ship loading {delta} from {sourcePlanet.Name} to {destPlanet.Name}");
        return true;
    }

    // Unload cargo on arrival
    public void UnloadCargo(int cargoShipID)
    {
        var cargoShip = GameStateManager.Instance.GetCraftByID(cargoShipID);
        if (cargoShip == null || cargoShip.CargoHold == null)
            return;

        int destPlanetID = cargoShip.LocationPlanetID;
        AddResources(destPlanetID, cargoShip.CargoHold);

        Debug.Log($"Cargo unloaded at planet {destPlanetID}: {cargoShip.CargoHold}");
        cargoShip.CargoHold = null;
    }

    // Check affordability
    public bool CanAfford(int planetID, ResourceCost cost)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        return planet != null && planet.Resources.HasSufficient(cost);
    }

    // Get total resources across all player planets
    public ResourceCollection GetTotalResources(FactionType faction)
    {
        var total = new ResourceCollection();
        var planets = GameStateManager.Instance.GetPlanets(faction);

        foreach (var planet in planets)
        {
            total = total + planet.Resources;
        }

        return total;
    }

    // Check for critical resource levels
    private void CheckCriticalResources(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return;

        if (planet.Resources.Food < 100)
            OnResourceCritical?.Invoke(planetID, ResourceType.Food);
        if (planet.Resources.Fuel < 100)
            OnResourceCritical?.Invoke(planetID, ResourceType.Fuel);
    }
}

public enum ResourceType
{
    Food,
    Minerals,
    Fuel,
    Energy,
    Credits
}
```

### Resource Production Example

```csharp
// Tropical planet with 2 Horticultural Stations
PlanetEntity tropicalPlanet = GameStateManager.Instance.GetPlanetByID(3);
tropicalPlanet.Type = PlanetType.Tropical; // 2x Food bonus

var multipliers = tropicalPlanet.GetResourceMultipliers();
// multipliers.Food = 2.0

int horticulturalCount = 2;
int baseFoodProduction = 100; // per Horticultural Station
int totalFoodProduction = horticulturalCount * baseFoodProduction * (int)multipliers.Food;
// totalFoodProduction = 2 × 100 × 2.0 = 400 Food/turn

var delta = new ResourceDelta { Food = totalFoodProduction };
ResourceSystem.Instance.AddResources(tropicalPlanet.ID, delta);
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Resource storage
- **AFS-012 (Planet System)**: Planet multipliers

### Depended On By
- **AFS-002 (Turn System)**: Income phase calculations
- **AFS-022 (Income System)**: Production calculations
- **AFS-023 (Population System)**: Food consumption
- **AFS-061 (Building System)**: Construction costs
- **AFS-062 (Unit Production)**: Unit costs

### Events Published
- `OnResourcesChanged(int planetID, ResourceDelta delta)`: Resources modified
- `OnResourceCritical(int planetID, ResourceType type)`: Resource critically low
- `OnCargoTransferred(int shipID, int sourcePlanetID, int destPlanetID)`: Cargo operation

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
