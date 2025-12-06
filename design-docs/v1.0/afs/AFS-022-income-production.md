# AFS-022: Income/Production System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ECON-002

---

## Summary

Turn-based income calculation system that produces resources from buildings (Horticultural Stations, Mining Stations, Solar Satellites), applies planet multipliers, calculates population growth, and executes during Income Phase of each turn.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet and building data
- **AFS-012 (Planet System)**: Planet multipliers
- **AFS-021 (Resource System)**: Resource storage and operations
- **AFS-023 (Population System)**: Population growth calculations
- **AFS-024 (Taxation System)**: Tax revenue generation

---

## Requirements

### Production Buildings

1. **Horticultural Stations** (Food Production)
   - **Base production**: 100 Food/turn per station
   - **Planet modifiers**:
     - Tropical: 2.0x (200 Food/turn)
     - Volcanic: 0.5x (50 Food/turn)
     - Desert: 0.25x (25 Food/turn)
     - Metropolis: 1.0x (100 Food/turn)
   - **Crew requirement**: 10 population per station
   - **Inactive if insufficient crew**: No production

2. **Mining Stations** (Minerals + Fuel Production)
   - **Base production**:
     - 50 Minerals/turn per station
     - 30 Fuel/turn per station
   - **Planet modifiers**:
     - Volcanic: 5.0x Minerals (250), 3.0x Fuel (90)
     - All others: 1.0x (50 Minerals, 30 Fuel)
   - **Crew requirement**: 15 population per station
   - **Inactive if insufficient crew**: No production

3. **Solar Satellites** (Energy Production)
   - **Base production**: 80 Energy/turn per satellite
   - **Planet modifiers**:
     - Desert: 2.0x (160 Energy/turn)
     - Tropical: 0.75x (60 Energy/turn)
     - All others: 1.0x (80 Energy/turn)
   - **Crew requirement**: 5 population per satellite (orbital crew)
   - **Deployment**: Satellite is a deployed craft (CraftType.SolarSatellite)
   - **Inactive if no crew**: No production

### Income Phase Execution

1. **Phase Timing**
   - Executes at start of Player Income Phase (after AI turn)
   - Executes for all planets owned by player
   - AI income calculated during AI Income Phase (silent)
   - Order: Income → Population Growth → Food Consumption → Taxation

2. **Calculation Steps**
   - For each player-owned planet:
     1. Calculate building production (Horticultural, Mining, Solar)
     2. Apply planet multipliers
     3. Check crew availability
     4. Add production to planet resources
     5. Update population growth (see AFS-023)
     6. Consume food for population (see AFS-023)
     7. Calculate tax revenue (see AFS-024)
     8. Display income summary in message log

3. **Income Report**
   - **Per-planet breakdown**:
     - "Starbase: +200 Food (2 Horticultural), +500 Credits (tax)"
     - "Vulcan Prime: +1,000 Minerals (4 Mining × 5.0), +360 Fuel (4 Mining × 3.0)"
   - **Total summary**:
     - "Total Income: +500 Food, +1,200 Minerals, +400 Fuel, +640 Energy, +2,000 Credits"
   - **Consumption summary**:
     - "Consumed: -500 Food (population), -150 Fuel (fleet travel)"
   - **Net change**:
     - "Net: +0 Food, +1,200 Minerals, +250 Fuel, +640 Energy, +2,000 Credits"

### Crew Allocation

1. **Crew Requirements**
   - Each building requires crew to operate
   - Crew assigned automatically (priority: Horticultural → Mining → Solar)
   - Inactive buildings (red indicator) if insufficient population
   - Player warned if buildings inactive due to lack of crew

2. **Crew Priority**
   - Food production first (Horticultural) - survival priority
   - Resource production second (Mining) - economy priority
   - Energy production third (Solar) - luxury priority

3. **Crew Allocation Algorithm**
   ```
   Available Crew = Population

   For each Horticultural Station:
     If Available Crew >= 10:
       Assign 10 crew, set Active
       Available Crew -= 10
     Else:
       Set Inactive

   For each Mining Station:
     If Available Crew >= 15:
       Assign 15 crew, set Active
       Available Crew -= 15
     Else:
       Set Inactive

   For each Solar Satellite:
     If Available Crew >= 5:
       Assign 5 crew, set Active
       Available Crew -= 5
     Else:
       Set Inactive
   ```

### Production Bonuses

1. **Research/Technology** (Future Expansion)
   - Technology upgrades increase production rates
   - Example: "Agricultural Tech I" → +20% Food production
   - Example: "Mining Tech I" → +15% Minerals/Fuel
   - Not implemented in MVP

2. **Morale Bonuses** (Future Expansion)
   - High morale (>80%) → +10% production
   - Low morale (<40%) → -10% production
   - Not implemented in MVP

---

## Acceptance Criteria

### Functional Criteria

- [ ] Income calculated correctly for all building types
- [ ] Planet multipliers apply correctly (Volcanic 5x Minerals, etc.)
- [ ] Crew requirements enforced (10/15/5 per building)
- [ ] Inactive buildings produce nothing
- [ ] Income phase executes each turn
- [ ] Income report displays per-planet breakdown
- [ ] Total income summary accurate
- [ ] Player warned if buildings inactive due to crew shortage

### Performance Criteria

- [ ] Income calculations complete in <100ms per turn
- [ ] No frame drops during income phase
- [ ] Income report generation <50ms

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for building data
- [ ] Uses Planet System (AFS-012) multipliers
- [ ] Adds resources via Resource System (AFS-021)
- [ ] Triggered by Turn System (AFS-002) during Income Phase
- [ ] Coordinates with Population System (AFS-023) and Taxation (AFS-024)

---

## Technical Notes

### Implementation Approach

```csharp
public class IncomeSystem : MonoBehaviour
{
    private static IncomeSystem _instance;
    public static IncomeSystem Instance => _instance;

    public event Action<int, ResourceDelta> OnIncomeCalculated;

    // Calculate income for all player planets
    public void CalculatePlayerIncome()
    {
        var planets = GameStateManager.Instance.GetPlanets(FactionType.Player);
        var totalIncome = new ResourceDelta();

        foreach (var planet in planets)
        {
            var planetIncome = CalculatePlanetIncome(planet);
            totalIncome = totalIncome + planetIncome;

            ResourceSystem.Instance.AddResources(planet.ID, planetIncome);
            OnIncomeCalculated?.Invoke(planet.ID, planetIncome);
        }

        DisplayIncomeReport(planets, totalIncome);
    }

    // Calculate income for single planet
    private ResourceDelta CalculatePlanetIncome(PlanetEntity planet)
    {
        var income = new ResourceDelta();

        if (!planet.Habitable)
            return income; // No production on uninhabitable planets

        // Get planet multipliers
        var multipliers = planet.GetResourceMultipliers();

        // Allocate crew to buildings
        AllocateCrew(planet);

        // Calculate production from each building type
        income.Food = CalculateFoodProduction(planet, multipliers.Food);
        income.Minerals = CalculateMineralProduction(planet, multipliers.Minerals);
        income.Fuel = CalculateFuelProduction(planet, multipliers.Fuel);
        income.Energy = CalculateEnergyProduction(planet, multipliers.Energy);

        return income;
    }

    // Allocate crew to buildings (priority: Food → Minerals/Fuel → Energy)
    private void AllocateCrew(PlanetEntity planet)
    {
        int availableCrew = planet.Population;

        // Horticultural Stations (Food) - Priority 1
        var horticulturalStations = planet.Structures.Where(s => s.Type == BuildingType.HorticulturalStation).ToList();
        foreach (var station in horticulturalStations)
        {
            if (availableCrew >= 10)
            {
                station.Status = BuildingStatus.Active;
                availableCrew -= 10;
            }
            else
            {
                station.Status = BuildingStatus.Inactive;
            }
        }

        // Mining Stations (Minerals + Fuel) - Priority 2
        var miningStations = planet.Structures.Where(s => s.Type == BuildingType.MiningStation).ToList();
        foreach (var station in miningStations)
        {
            if (availableCrew >= 15)
            {
                station.Status = BuildingStatus.Active;
                availableCrew -= 15;
            }
            else
            {
                station.Status = BuildingStatus.Inactive;
            }
        }

        // Solar Satellites (Energy) - Priority 3
        var solarSatellites = GameStateManager.Instance.GetCraftAtPlanet(planet.ID)
            .Where(c => c.Type == CraftType.SolarSatellite).ToList();
        foreach (var satellite in solarSatellites)
        {
            if (availableCrew >= 5)
            {
                satellite.Active = true;
                availableCrew -= 5;
            }
            else
            {
                satellite.Active = false;
            }
        }

        // Warn player if buildings are inactive
        int inactiveCount = horticulturalStations.Count(s => s.Status == BuildingStatus.Inactive) +
                            miningStations.Count(s => s.Status == BuildingStatus.Inactive) +
                            solarSatellites.Count(s => !s.Active);

        if (inactiveCount > 0)
        {
            UIManager.Instance.ShowWarning($"{planet.Name}: {inactiveCount} buildings inactive (insufficient crew)");
        }
    }

    // Calculate Food production from Horticultural Stations
    private int CalculateFoodProduction(PlanetEntity planet, float multiplier)
    {
        int activeStations = planet.Structures.Count(s =>
            s.Type == BuildingType.HorticulturalStation &&
            s.Status == BuildingStatus.Active);

        int baseProduction = 100; // per station
        return Mathf.FloorToInt(activeStations * baseProduction * multiplier);
    }

    // Calculate Mineral production from Mining Stations
    private int CalculateMineralProduction(PlanetEntity planet, float multiplier)
    {
        int activeStations = planet.Structures.Count(s =>
            s.Type == BuildingType.MiningStation &&
            s.Status == BuildingStatus.Active);

        int baseProduction = 50; // per station
        return Mathf.FloorToInt(activeStations * baseProduction * multiplier);
    }

    // Calculate Fuel production from Mining Stations
    private int CalculateFuelProduction(PlanetEntity planet, float multiplier)
    {
        int activeStations = planet.Structures.Count(s =>
            s.Type == BuildingType.MiningStation &&
            s.Status == BuildingStatus.Active);

        int baseProduction = 30; // per station
        return Mathf.FloorToInt(activeStations * baseProduction * multiplier);
    }

    // Calculate Energy production from Solar Satellites
    private int CalculateEnergyProduction(PlanetEntity planet, float multiplier)
    {
        int activeSatellites = GameStateManager.Instance.GetCraftAtPlanet(planet.ID)
            .Count(c => c.Type == CraftType.SolarSatellite && c.Active);

        int baseProduction = 80; // per satellite
        return Mathf.FloorToInt(activeSatellites * baseProduction * multiplier);
    }

    // Display income report to player
    private void DisplayIncomeReport(List<PlanetEntity> planets, ResourceDelta totalIncome)
    {
        var report = new StringBuilder();
        report.AppendLine("=== INCOME REPORT ===");

        foreach (var planet in planets)
        {
            report.AppendLine($"{planet.Name}:");
            // Detail breakdown per planet
        }

        report.AppendLine($"\nTotal Income: {totalIncome}");

        UIManager.Instance.ShowMessage(report.ToString());
    }
}
```

### Income Calculation Examples

**Example 1: Tropical Planet (Food Specialist)**
```
Planet: "Paradise"
Type: Tropical (2x Food bonus)
Population: 500
Buildings:
  - 3 Horticultural Stations (Active, 10 crew each = 30 crew)
  - 1 Mining Station (Active, 15 crew = 15 crew)
Total Crew Used: 45 (out of 500 available)

Income:
- Food: 3 × 100 × 2.0 = 600 Food/turn
- Minerals: 1 × 50 × 1.0 = 50 Minerals/turn
- Fuel: 1 × 30 × 1.0 = 30 Fuel/turn
```

**Example 2: Volcanic Planet (Mining Specialist)**
```
Planet: "Vulcan Prime"
Type: Volcanic (5x Minerals, 3x Fuel)
Population: 200
Buildings:
  - 4 Mining Stations (Active, 15 crew each = 60 crew)
  - 1 Horticultural Station (Active, 10 crew = 10 crew)
Total Crew Used: 70 (out of 200 available)

Income:
- Food: 1 × 100 × 0.5 = 50 Food/turn (penalty!)
- Minerals: 4 × 50 × 5.0 = 1,000 Minerals/turn
- Fuel: 4 × 30 × 3.0 = 360 Fuel/turn
```

**Example 3: Desert Planet (Energy Specialist)**
```
Planet: "Arid"
Type: Desert (2x Energy)
Population: 150
Buildings:
  - 1 Horticultural Station (Active, 10 crew)
  - 1 Mining Station (Active, 15 crew)
Deployed Craft:
  - 3 Solar Satellites (Active, 5 crew each = 15 crew)
Total Crew Used: 40 (out of 150 available)

Income:
- Food: 1 × 100 × 0.25 = 25 Food/turn (penalty!)
- Minerals: 1 × 50 × 1.0 = 50 Minerals/turn
- Fuel: 1 × 30 × 1.0 = 30 Fuel/turn
- Energy: 3 × 80 × 2.0 = 480 Energy/turn
```

**Example 4: Insufficient Crew**
```
Planet: "Undermanned"
Type: Metropolis
Population: 20 (low!)
Buildings:
  - 3 Horticultural Stations (needs 30 crew, only 20 available)
  - 2 Mining Stations (needs 30 crew)

Crew Allocation:
- Horticultural #1: Active (10 crew)
- Horticultural #2: Active (10 crew)
- Horticultural #3: INACTIVE (0 crew)
- Mining #1: INACTIVE (0 crew)
- Mining #2: INACTIVE (0 crew)

Income:
- Food: 2 × 100 × 1.0 = 200 Food/turn (1 station inactive!)
- Minerals: 0 (all mining inactive)
- Fuel: 0 (all mining inactive)

Warning: "Undermanned: 3 buildings inactive (insufficient crew)"
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Planet and building queries
- **AFS-012 (Planet System)**: Planet multipliers
- **AFS-021 (Resource System)**: Resource additions

### Depended On By
- **AFS-002 (Turn System)**: Triggered during Income Phase
- **AFS-023 (Population System)**: Population growth after income
- **AFS-024 (Taxation System)**: Tax revenue after income

### Events Published
- `OnIncomeCalculated(int planetID, ResourceDelta income)`: Income calculated for planet
- `OnBuildingInactive(int planetID, BuildingType type)`: Building inactive due to crew shortage

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
