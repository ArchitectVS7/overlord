# AFS-014: Navigation System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-GALAXY-004

---

## Summary

Fleet navigation system that calculates travel time between planets, manages in-transit craft movement, consumes fuel during journeys, displays ETAs, and supports journey abortion for strategic repositioning.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Craft entities and positions
- **AFS-012 (Planet System)**: Planet positions and ownership
- **AFS-031 (Entity System)**: Craft entity structure
- **AFS-021 (Resource System)**: Fuel consumption

---

## Requirements

### Travel Mechanics

1. **Distance Calculation**
   - **3D Euclidean distance**: `Distance = √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)`
   - **Travel time formula**: `TravelTime (turns) = Distance ÷ CraftSpeed`
   - **Craft speeds**:
     - Battle Cruiser: 50 units/turn
     - Cargo Cruiser: 30 units/turn (slower, larger cargo capacity)
     - Solar Satellite: 0 units/turn (stationary, deployed at planet)
   - **Turn rounding**: Always round up (minimum 1 turn)

2. **Fuel Consumption**
   - **Fuel cost formula**: `FuelCost = Distance × FuelRate`
   - **Fuel rates**:
     - Battle Cruiser: 1 Fuel per 10 units traveled
     - Cargo Cruiser: 1 Fuel per 5 units traveled (less efficient)
   - **Fuel check**: Must have sufficient fuel before departure
   - **Fuel deducted**: On departure (not on arrival)

3. **Journey States**
   - **Docked**: Craft at planet, in Docking Bay slot
   - **In Transit**: Craft traveling between planets
   - **Orbiting**: Craft arrived but no docking slots available
   - **Aborting**: Journey canceled mid-flight, returning to origin

4. **ETA Display**
   - **Before departure**: "ETA: X turns" shown in UI
   - **During transit**: Turn countdown updated each turn
   - **Visual indicator**: Progress bar or line on galaxy map
   - **Fleet ETA**: Slowest craft determines fleet arrival time

### Movement Commands

1. **Move Fleet Command**
   - **Selection**: Player selects craft (or fleet) at source planet
   - **Destination**: Player clicks target planet
   - **Validation**:
     - Target planet must be visible (not obscured)
     - Craft must have sufficient fuel
     - Cannot move to same planet (already there)
   - **Confirmation**: Dialog shows ETA, fuel cost, and "Confirm Move" button

2. **Fleet Formation**
   - **Multiple craft**: Can move multiple craft together as fleet
   - **Speed matching**: Fleet travels at speed of slowest craft
   - **Fuel check**: Each craft must have individual fuel
   - **Formation maintained**: Craft arrive together on same turn

3. **Abort Journey**
   - **Abort command**: Available during transit (Action Phase only)
   - **Return to origin**: Craft returns to departure planet
   - **Fuel refund**: 50% of fuel cost refunded (half burned already)
   - **ETA to origin**: Same turns remaining as already traveled
   - **Strategic use**: Respond to enemy movements, change priorities

### In-Transit Behavior

1. **Turn Updates**
   - **Decrement ETA**: Each turn reduces TurnsRemaining by 1
   - **Position interpolation**: Visual position lerped between origin and destination
   - **Vulnerable state**: In-transit craft cannot fight or dock
   - **No resource production**: Craft not contributing to economy while traveling

2. **Arrival Handling**
   - **Docking priority**: Friendly planets dock automatically (if slots available)
   - **Orbiting overflow**: Excess craft orbit planet (vulnerable)
   - **Enemy arrival**: Triggers combat immediately (see AFS-041)
   - **Notification**: "Fleet arrived at [Planet Name]" message

3. **Mid-Journey Events**
   - **Enemy intercepts**: Not implemented in MVP (future feature)
   - **Random encounters**: Not implemented in MVP
   - **System changes**: If destination planet ownership changes during transit, craft still arrives (combat triggered)

### Visual Representation

1. **Galaxy Map Indicators**
   - **Travel lines**: Dotted line from origin to destination
   - **Craft icons**: Small ship sprites moving along line
   - **Progress indicator**: Fill percentage of line (0-100%)
   - **ETA label**: "2 turns" text near craft icon

2. **Fleet Trails**
   - **Particle effects**: Subtle engine trail behind craft (optional)
   - **Color coding**: Player fleets (blue), AI fleets (red)
   - **Fade out**: Trails fade after craft arrives

3. **Arrival Animations**
   - **Orbit insertion**: Craft swoops into orbit around planet
   - **Docking sequence**: Craft descends to docking bay (if slot available)
   - **Combat alert**: Red flash if arrival triggers combat

---

## Acceptance Criteria

### Functional Criteria

- [ ] Travel time calculated correctly based on distance and craft speed
- [ ] Fuel consumption calculated and deducted on departure
- [ ] Cannot depart without sufficient fuel
- [ ] ETA displayed accurately before and during journey
- [ ] In-transit craft position updates each turn
- [ ] Craft arrive on correct turn
- [ ] Abort journey returns craft to origin with 50% fuel refund
- [ ] Fleet movement keeps craft together (slowest speed)
- [ ] Arrival at enemy planet triggers combat

### Performance Criteria

- [ ] Distance calculations execute in <1ms
- [ ] ETA updates do not cause frame drops
- [ ] Visual interpolation smooth (60 FPS on PC)
- [ ] Up to 32 craft in transit simultaneously supported

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for craft positions
- [ ] Reads planet positions from Planet System (AFS-012)
- [ ] Consumes fuel via Resource System (AFS-021)
- [ ] Triggers combat via Combat System (AFS-041) on enemy arrival
- [ ] Updates Galaxy View (AFS-013) with travel lines and progress

---

## Technical Notes

### Implementation Approach

```csharp
public class NavigationSystem : MonoBehaviour
{
    private static NavigationSystem _instance;
    public static NavigationSystem Instance => _instance;

    private List<Journey> _activeJourneys = new List<Journey>();

    public event Action<Journey> OnJourneyStarted;
    public event Action<Journey> OnJourneyCompleted;
    public event Action<Journey> OnJourneyAborted;

    // Movement Command
    public bool MoveCraft(int craftID, int destinationPlanetID)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        var destPlanet = GameStateManager.Instance.GetPlanetByID(destinationPlanetID);

        if (craft == null || destPlanet == null)
        {
            Debug.LogError("Invalid craft or destination!");
            return false;
        }

        // Get origin planet
        var originPlanet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
        if (originPlanet == null)
        {
            Debug.LogError("Craft not at valid planet!");
            return false;
        }

        // Calculate journey parameters
        float distance = Vector3.Distance(originPlanet.Position, destPlanet.Position);
        int travelTime = CalculateTravelTime(distance, craft.Type);
        int fuelCost = CalculateFuelCost(distance, craft.Type);

        // Check fuel availability
        if (originPlanet.Resources.Fuel < fuelCost)
        {
            UIManager.Instance.ShowError($"Insufficient fuel! Need {fuelCost} Fuel.");
            return false;
        }

        // Deduct fuel
        originPlanet.Resources.Fuel -= fuelCost;

        // Create journey
        var journey = new Journey
        {
            CraftID = craftID,
            OriginPlanetID = originPlanet.ID,
            DestinationPlanetID = destPlanet.ID,
            TotalTurns = travelTime,
            TurnsRemaining = travelTime,
            FuelCost = fuelCost,
            OriginPosition = originPlanet.Position,
            DestinationPosition = destPlanet.Position
        };

        _activeJourneys.Add(journey);

        // Update craft state
        craft.InTransit = true;
        craft.LocationPlanetID = -1; // Not at planet

        OnJourneyStarted?.Invoke(journey);
        Debug.Log($"{craft.Name} departing {originPlanet.Name} → {destPlanet.Name} (ETA: {travelTime} turns, Fuel: {fuelCost})");

        return true;
    }

    // Move Fleet (multiple craft)
    public bool MoveFleet(List<int> craftIDs, int destinationPlanetID)
    {
        // Validate all craft can move
        foreach (var craftID in craftIDs)
        {
            var craft = GameStateManager.Instance.GetCraftByID(craftID);
            if (craft == null || craft.InTransit)
            {
                UIManager.Instance.ShowError("Cannot move craft: Invalid or already in transit.");
                return false;
            }
        }

        // Calculate slowest craft (determines fleet ETA)
        int slowestTravelTime = 0;
        foreach (var craftID in craftIDs)
        {
            var craft = GameStateManager.Instance.GetCraftByID(craftID);
            var originPlanet = GameStateManager.Instance.GetPlanetByID(craft.LocationPlanetID);
            var destPlanet = GameStateManager.Instance.GetPlanetByID(destinationPlanetID);
            float distance = Vector3.Distance(originPlanet.Position, destPlanet.Position);
            int travelTime = CalculateTravelTime(distance, craft.Type);
            slowestTravelTime = Mathf.Max(slowestTravelTime, travelTime);
        }

        // Move each craft (all arrive together)
        bool allMoved = true;
        foreach (var craftID in craftIDs)
        {
            if (!MoveCraft(craftID, destinationPlanetID))
            {
                allMoved = false;
                break;
            }
        }

        return allMoved;
    }

    // Abort Journey
    public bool AbortJourney(int craftID)
    {
        var journey = _activeJourneys.Find(j => j.CraftID == craftID);
        if (journey == null)
        {
            Debug.LogError("Craft not in transit!");
            return false;
        }

        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        var originPlanet = GameStateManager.Instance.GetPlanetByID(journey.OriginPlanetID);

        // Refund 50% fuel
        int fuelRefund = journey.FuelCost / 2;
        originPlanet.Resources.Fuel += fuelRefund;

        // Return to origin
        craft.InTransit = false;
        craft.LocationPlanetID = journey.OriginPlanetID;

        _activeJourneys.Remove(journey);
        OnJourneyAborted?.Invoke(journey);

        Debug.Log($"{craft.Name} aborted journey, returned to {originPlanet.Name} (Fuel refund: {fuelRefund})");
        return true;
    }

    // Update journeys each turn
    public void UpdateJourneys()
    {
        var completedJourneys = new List<Journey>();

        foreach (var journey in _activeJourneys)
        {
            journey.TurnsRemaining--;

            if (journey.TurnsRemaining <= 0)
            {
                completedJourneys.Add(journey);
            }
        }

        // Complete arrived journeys
        foreach (var journey in completedJourneys)
        {
            CompleteJourney(journey);
        }
    }

    private void CompleteJourney(Journey journey)
    {
        var craft = GameStateManager.Instance.GetCraftByID(journey.CraftID);
        var destPlanet = GameStateManager.Instance.GetPlanetByID(journey.DestinationPlanetID);

        craft.InTransit = false;
        craft.LocationPlanetID = destPlanet.ID;

        // Check docking availability
        if (destPlanet.GetAvailableDockingSlots() > 0)
        {
            // Dock craft
            destPlanet.DockedCraftIDs.Add(craft.ID);
            Debug.Log($"{craft.Name} docked at {destPlanet.Name}");
        }
        else
        {
            // Orbit planet (vulnerable)
            Debug.LogWarning($"{craft.Name} orbiting {destPlanet.Name} (no docking slots!)");
        }

        // Check for combat
        if (destPlanet.Owner != craft.Owner && destPlanet.Owner != FactionType.Neutral)
        {
            // Trigger combat
            CombatSystem.Instance.InitiateBattle(destPlanet.ID);
        }

        _activeJourneys.Remove(journey);
        OnJourneyCompleted?.Invoke(journey);
    }

    // Calculate travel time (turns)
    private int CalculateTravelTime(float distance, CraftType type)
    {
        float speed = GetCraftSpeed(type);
        if (speed <= 0f)
            return 999; // Stationary craft (Solar Satellite)

        int turns = Mathf.CeilToInt(distance / speed);
        return Mathf.Max(1, turns); // Minimum 1 turn
    }

    // Calculate fuel cost
    private int CalculateFuelCost(float distance, CraftType type)
    {
        float fuelRate = GetCraftFuelRate(type);
        return Mathf.CeilToInt(distance * fuelRate);
    }

    private float GetCraftSpeed(CraftType type)
    {
        switch (type)
        {
            case CraftType.BattleCruiser: return 50f;
            case CraftType.CargoCruiser: return 30f;
            case CraftType.SolarSatellite: return 0f; // Stationary
            default: return 50f;
        }
    }

    private float GetCraftFuelRate(CraftType type)
    {
        switch (type)
        {
            case CraftType.BattleCruiser: return 0.1f; // 1 Fuel per 10 units
            case CraftType.CargoCruiser: return 0.2f; // 1 Fuel per 5 units
            case CraftType.SolarSatellite: return 0f; // No fuel (deployed)
            default: return 0.1f;
        }
    }

    // Get visual position for in-transit craft
    public Vector3 GetCraftVisualPosition(int craftID)
    {
        var journey = _activeJourneys.Find(j => j.CraftID == craftID);
        if (journey == null)
            return Vector3.zero;

        float progress = 1f - (journey.TurnsRemaining / (float)journey.TotalTurns);
        return Vector3.Lerp(journey.OriginPosition, journey.DestinationPosition, progress);
    }
}

[Serializable]
public class Journey
{
    public int CraftID;
    public int OriginPlanetID;
    public int DestinationPlanetID;
    public int TotalTurns;
    public int TurnsRemaining;
    public int FuelCost;
    public Vector3 OriginPosition;
    public Vector3 DestinationPosition;
}
```

### Travel Time Examples

```
Example Galaxy Layout:
- Starbase (0, 0, 0)
- Planet A (100, 0, 50) → Distance from Starbase = 111.8 units

Battle Cruiser (Speed 50):
- Travel time = 111.8 ÷ 50 = 2.24 turns → **3 turns** (rounded up)
- Fuel cost = 111.8 × 0.1 = **12 Fuel**

Cargo Cruiser (Speed 30):
- Travel time = 111.8 ÷ 30 = 3.73 turns → **4 turns** (rounded up)
- Fuel cost = 111.8 × 0.2 = **23 Fuel**

Fleet (1 Battle Cruiser + 1 Cargo Cruiser):
- Fleet ETA = **4 turns** (slowest craft)
- Total Fuel = 12 + 23 = **35 Fuel**
```

### Journey Visualization

```csharp
public class JourneyVisualizer : MonoBehaviour
{
    [SerializeField] private LineRenderer _travelLinePrefab;
    [SerializeField] private GameObject _craftIconPrefab;

    private Dictionary<int, LineRenderer> _journeyLines = new Dictionary<int, LineRenderer>();
    private Dictionary<int, GameObject> _craftIcons = new Dictionary<int, GameObject>();

    private void Start()
    {
        NavigationSystem.Instance.OnJourneyStarted += OnJourneyStarted;
        NavigationSystem.Instance.OnJourneyCompleted += OnJourneyCompleted;
        NavigationSystem.Instance.OnJourneyAborted += OnJourneyAborted;
    }

    private void OnJourneyStarted(Journey journey)
    {
        // Create travel line
        var line = Instantiate(_travelLinePrefab);
        line.SetPosition(0, journey.OriginPosition);
        line.SetPosition(1, journey.DestinationPosition);
        line.startColor = GetFactionColor(journey.CraftID);
        line.endColor = GetFactionColor(journey.CraftID);
        _journeyLines[journey.CraftID] = line;

        // Create craft icon
        var icon = Instantiate(_craftIconPrefab);
        _craftIcons[journey.CraftID] = icon;
    }

    private void Update()
    {
        foreach (var kvp in _craftIcons)
        {
            int craftID = kvp.Key;
            GameObject icon = kvp.Value;

            Vector3 position = NavigationSystem.Instance.GetCraftVisualPosition(craftID);
            icon.transform.position = position;
        }
    }

    private void OnJourneyCompleted(Journey journey)
    {
        CleanupJourney(journey.CraftID);
    }

    private void OnJourneyAborted(Journey journey)
    {
        CleanupJourney(journey.CraftID);
    }

    private void CleanupJourney(int craftID)
    {
        if (_journeyLines.ContainsKey(craftID))
        {
            Destroy(_journeyLines[craftID].gameObject);
            _journeyLines.Remove(craftID);
        }

        if (_craftIcons.ContainsKey(craftID))
        {
            Destroy(_craftIcons[craftID]);
            _craftIcons.Remove(craftID);
        }
    }

    private Color GetFactionColor(int craftID)
    {
        var craft = GameStateManager.Instance.GetCraftByID(craftID);
        return craft.Owner == FactionType.Player ? Color.cyan : Color.red;
    }
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Craft and planet entities
- **AFS-012 (Planet System)**: Planet positions
- **AFS-021 (Resource System)**: Fuel consumption

### Depended On By
- **AFS-013 (Galaxy View)**: Travel line visualization
- **AFS-041 (Combat System)**: Triggered on enemy planet arrival
- **AFS-071 (UI State Machine)**: Move command UI
- **AFS-002 (Turn System)**: Journey updates each turn

### Events Published
- `OnJourneyStarted(Journey journey)`: Craft begins travel
- `OnJourneyCompleted(Journey journey)`: Craft arrives at destination
- `OnJourneyAborted(Journey journey)`: Journey canceled mid-flight
- `OnFleetArrival(int planetID, List<int> craftIDs)`: Fleet arrives together

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
