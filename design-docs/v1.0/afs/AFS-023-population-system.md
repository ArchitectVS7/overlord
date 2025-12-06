# AFS-023: Population System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-ECON-003

---

## Summary

Population management system that tracks population count per planet, calculates growth based on morale and tax rates, manages food consumption, provides crew for buildings/craft, and influences economic output and military capacity.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet population storage
- **AFS-012 (Planet System)**: Planet population properties
- **AFS-021 (Resource System)**: Food consumption
- **AFS-024 (Taxation System)**: Tax revenue and morale impact

---

## Requirements

### Population Properties

1. **Population Count**
   - **Range**: 0-99,999 per planet
   - **Starting value**: 1,000 for Starbase and Hitotsu
   - **Uninhabited planets**: 0 population until colonized
   - **Display format**: "1,250 people" or "1.2K"

2. **Morale**
   - **Range**: 0-100%
   - **Starting value**: 75% (moderate)
   - **Affects**:
     - Population growth rate (higher morale = faster growth)
     - Building productivity (future feature)
     - Tax revenue efficiency
   - **Influenced by**:
     - Tax rate (high taxes reduce morale)
     - Food availability (starvation reduces morale)
     - Victory/defeat events (future feature)

3. **Growth Rate**
   - **Formula**: `GrowthRate = (Morale ÷ 100) × 5%`
   - **Examples**:
     - 100% morale → 5% growth per turn
     - 75% morale → 3.75% growth per turn
     - 50% morale → 2.5% growth per turn
     - 0% morale → 0% growth (stagnation)
   - **Applied each turn**: During Income Phase

4. **Food Consumption**
   - **Formula**: `FoodRequired = Population × 0.5`
   - **Examples**:
     - 1,000 population → 500 Food/turn
     - 5,000 population → 2,500 Food/turn
   - **Starvation**: If Food = 0, morale drops 10% per turn

### Population Growth Mechanics

1. **Growth Calculation**
   - Executes during Income Phase (after resource production)
   - Growth = `Population × (Morale ÷ 100) × 0.05`
   - Round down to nearest integer
   - Cap at 99,999 population
   - No growth if morale ≤ 0% or Food = 0

2. **Morale Modifiers**
   - **Tax Rate Impact**:
     - Tax > 75%: Morale -5%/turn
     - Tax 25-75%: Morale unchanged
     - Tax < 25%: Morale +2%/turn
   - **Food Shortage Impact**:
     - Food = 0: Morale -10%/turn (starvation!)
     - Food < (Population × 0.5): Morale -3%/turn (rationing)
   - **Building Destruction Impact** (future feature):
     - Building destroyed in combat: Morale -5%
   - **Victory Impact** (future feature):
     - Enemy defeated: Morale +10%

3. **Population Migration** (Future Feature, Not MVP)
   - Overpopulated planets can migrate to colonies
   - Requires transport ships
   - Not implemented in initial release

### Crew Allocation

1. **Buildings Require Crew**
   - Horticultural Station: 10 crew
   - Mining Station: 15 crew
   - Solar Satellite: 5 crew (orbital crew)
   - Crew assigned automatically (see AFS-022)

2. **Craft Require Crew**
   - Battle Cruiser: 50 crew
   - Cargo Cruiser: 30 crew
   - Solar Satellite: 5 crew (once deployed)
   - Crew assigned on construction/purchase

3. **Crew Availability Check**
   - Total crew needed = Buildings + Craft
   - If crew needed > Population:
     - Disable lowest-priority buildings first
     - Prevent craft purchase if insufficient crew
     - Display warning: "Insufficient crew on [Planet]!"

### Food Consumption Mechanics

1. **Consumption Timing**
   - Executes during Income Phase (after production, after growth)
   - Deducted from planet Food resources
   - Cannot go negative (clamped at 0)

2. **Starvation Consequences**
   - Morale drops 10% per turn
   - No population growth (growth rate = 0%)
   - Population decline: -5% per turn (future feature)
   - Warning displayed: "STARVATION on [Planet]!"

3. **Rationing** (Future Feature, Not MVP)
   - Player can reduce food consumption to 0.25 per person
   - Morale penalty: -5%/turn
   - Extends food supplies during shortages

### Population Display

1. **UI Elements**
   - Population count: "1,250"
   - Morale bar: Green (>60%), Yellow (30-60%), Red (<30%)
   - Growth rate: "+50/turn (4.0%)"
   - Food consumption: "-625 Food/turn"
   - Crew allocation: "45 / 1,250 assigned"

2. **Warnings**
   - Yellow warning: Morale < 50%
   - Red alert: Food = 0 (starvation)
   - Orange alert: Crew shortage (buildings inactive)

---

## Acceptance Criteria

### Functional Criteria

- [ ] Population grows each turn based on morale
- [ ] Growth formula: (Morale ÷ 100) × 5%
- [ ] Food consumption: Population × 0.5 per turn
- [ ] Starvation (Food = 0) reduces morale by 10%/turn
- [ ] High taxes (>75%) reduce morale by 5%/turn
- [ ] Low taxes (<25%) increase morale by 2%/turn
- [ ] Morale capped at 0-100%
- [ ] Population capped at 0-99,999
- [ ] Crew requirements enforced for buildings and craft
- [ ] Warnings displayed for starvation and crew shortages

### Performance Criteria

- [ ] Population calculations complete in <50ms per turn
- [ ] No frame drops during population updates
- [ ] UI updates smooth (<16ms per frame)

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for population storage
- [ ] Uses Planet System (AFS-012) for population properties
- [ ] Consumes food via Resource System (AFS-021)
- [ ] Coordinates with Income System (AFS-022) for crew allocation
- [ ] Coordinates with Taxation System (AFS-024) for tax impact on morale

---

## Technical Notes

### Implementation Approach

```csharp
public class PopulationSystem : MonoBehaviour
{
    private static PopulationSystem _instance;
    public static PopulationSystem Instance => _instance;

    public event Action<int, int> OnPopulationChanged; // planetID, newPopulation
    public event Action<int, int> OnMoraleChanged; // planetID, newMorale
    public event Action<int> OnStarvation; // planetID

    // Update population for all player planets (called during Income Phase)
    public void UpdatePopulations()
    {
        var planets = GameStateManager.Instance.GetPlanets(FactionType.Player);

        foreach (var planet in planets)
        {
            if (!planet.Habitable || planet.Population == 0)
                continue;

            // 1. Calculate population growth
            UpdatePopulationGrowth(planet);

            // 2. Consume food
            ConsumeFoodForPopulation(planet);

            // 3. Update morale based on tax rate and food availability
            UpdateMorale(planet);
        }
    }

    // Calculate and apply population growth
    private void UpdatePopulationGrowth(PlanetEntity planet)
    {
        if (planet.Morale <= 0 || planet.Resources.Food == 0)
        {
            // No growth if morale is 0 or starvation
            return;
        }

        // Growth formula: Population × (Morale ÷ 100) × 0.05
        float growthRate = (planet.Morale / 100f) * 0.05f;
        int growthAmount = Mathf.FloorToInt(planet.Population * growthRate);

        int oldPopulation = planet.Population;
        planet.Population = Mathf.Min(planet.Population + growthAmount, 99999);

        if (planet.Population != oldPopulation)
        {
            OnPopulationChanged?.Invoke(planet.ID, planet.Population);
            Debug.Log($"{planet.Name}: Population grew by {growthAmount} (now {planet.Population})");
        }
    }

    // Consume food for population
    private void ConsumeFoodForPopulation(PlanetEntity planet)
    {
        int foodRequired = Mathf.FloorToInt(planet.Population * 0.5f);

        if (planet.Resources.Food >= foodRequired)
        {
            // Sufficient food
            planet.Resources.Food -= foodRequired;
        }
        else
        {
            // Food shortage or starvation
            int availableFood = planet.Resources.Food;
            planet.Resources.Food = 0;

            if (availableFood == 0)
            {
                // Starvation!
                OnStarvation?.Invoke(planet.ID);
                UIManager.Instance.ShowError($"STARVATION on {planet.Name}! Population starving!");
            }
            else
            {
                // Rationing (partial food)
                UIManager.Instance.ShowWarning($"Food shortage on {planet.Name}! Morale declining.");
            }
        }
    }

    // Update morale based on tax rate and food availability
    private void UpdateMorale(PlanetEntity planet)
    {
        int oldMorale = planet.Morale;

        // Tax rate impact
        if (planet.TaxRate > 75)
        {
            planet.Morale = Mathf.Max(0, planet.Morale - 5); // High taxes
        }
        else if (planet.TaxRate < 25)
        {
            planet.Morale = Mathf.Min(100, planet.Morale + 2); // Low taxes
        }

        // Food availability impact
        int foodRequired = Mathf.FloorToInt(planet.Population * 0.5f);
        if (planet.Resources.Food == 0 && planet.Population > 0)
        {
            // Starvation
            planet.Morale = Mathf.Max(0, planet.Morale - 10);
        }
        else if (planet.Resources.Food < foodRequired)
        {
            // Rationing
            planet.Morale = Mathf.Max(0, planet.Morale - 3);
        }

        // Clamp morale
        planet.Morale = Mathf.Clamp(planet.Morale, 0, 100);

        if (planet.Morale != oldMorale)
        {
            OnMoraleChanged?.Invoke(planet.ID, planet.Morale);
            Debug.Log($"{planet.Name}: Morale changed from {oldMorale}% to {planet.Morale}%");
        }
    }

    // Check if planet has sufficient crew for buildings/craft
    public bool HasSufficientCrew(int planetID, int crewRequired)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return false;

        int assignedCrew = GetAssignedCrew(planet);
        int availableCrew = planet.Population - assignedCrew;

        return availableCrew >= crewRequired;
    }

    // Get total crew currently assigned to buildings and craft
    private int GetAssignedCrew(PlanetEntity planet)
    {
        int crew = 0;

        // Buildings
        foreach (var structure in planet.Structures)
        {
            if (structure.Status == BuildingStatus.Active)
            {
                switch (structure.Type)
                {
                    case BuildingType.HorticulturalStation:
                        crew += 10;
                        break;
                    case BuildingType.MiningStation:
                        crew += 15;
                        break;
                }
            }
        }

        // Craft (Solar Satellites)
        var craft = GameStateManager.Instance.GetCraftAtPlanet(planet.ID);
        foreach (var c in craft)
        {
            if (c.Type == CraftType.SolarSatellite && c.Active)
            {
                crew += 5;
            }
            else if (c.Type == CraftType.BattleCruiser)
            {
                crew += 50;
            }
            else if (c.Type == CraftType.CargoCruiser)
            {
                crew += 30;
            }
        }

        return crew;
    }

    // Get available crew for new assignments
    public int GetAvailableCrew(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return 0;

        int assignedCrew = GetAssignedCrew(planet);
        return Mathf.Max(0, planet.Population - assignedCrew);
    }
}
```

### Population Growth Examples

**Example 1: Healthy Colony**
```
Planet: "Starbase"
Population: 1,000
Morale: 75%
Tax Rate: 50%
Food Available: 10,000

Turn 1:
  Growth = 1,000 × (75 ÷ 100) × 0.05 = 37
  New Population = 1,037
  Food Consumed = 1,000 × 0.5 = 500
  Remaining Food = 9,500
  Morale: 75% (unchanged, tax rate 25-75%)

Turn 2:
  Growth = 1,037 × 0.75 × 0.05 = 38
  New Population = 1,075
  Food Consumed = 519
  Remaining Food = 8,981
```

**Example 2: High Taxes**
```
Planet: "Overtaxed"
Population: 5,000
Morale: 80%
Tax Rate: 90% (high!)
Food Available: 5,000

Turn 1:
  Morale: 80% - 5% = 75% (high tax penalty)
  Growth = 5,000 × 0.75 × 0.05 = 187
  New Population = 5,187
  Food Consumed = 2,500
  Remaining Food = 2,500

Turn 2:
  Morale: 75% - 5% = 70%
  Growth = 5,187 × 0.70 × 0.05 = 181
  New Population = 5,368
  Food Consumed = 2,594
  Remaining Food = -94 → 0 (starvation!)

Turn 3:
  Morale: 70% - 10% = 60% (starvation penalty!)
  Growth = 0 (no food)
  Food Consumed = 0 (no food available)
  Warning: "STARVATION on Overtaxed!"
```

**Example 3: Low Taxes**
```
Planet: "Paradise"
Population: 2,000
Morale: 50%
Tax Rate: 10% (low)
Food Available: 10,000

Turn 1:
  Morale: 50% + 2% = 52% (low tax bonus)
  Growth = 2,000 × 0.52 × 0.05 = 52
  New Population = 2,052
  Food Consumed = 1,000
  Remaining Food = 9,000

Turn 5 (after 5 turns):
  Morale: 50% + (2% × 5) = 60%
  Population: ~2,300 (compounding growth)
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Population storage
- **AFS-012 (Planet System)**: Population properties
- **AFS-021 (Resource System)**: Food consumption

### Depended On By
- **AFS-002 (Turn System)**: Population updates during Income Phase
- **AFS-022 (Income System)**: Crew allocation for buildings
- **AFS-024 (Taxation System)**: Tax impact on morale
- **AFS-061 (Building System)**: Crew requirements for construction
- **AFS-062 (Unit Production)**: Crew requirements for craft

### Events Published
- `OnPopulationChanged(int planetID, int newPopulation)`: Population grew/declined
- `OnMoraleChanged(int planetID, int newMorale)`: Morale changed
- `OnStarvation(int planetID)`: Food depleted, population starving

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
