# AFS-012: Planet System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-GALAXY-002

---

## Summary

Planet entity system that defines planet properties (type, resources, structures, population), resource production bonuses, colonization state, and provides queries for planet data used by economy, combat, and UI systems.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Stores planet entities
- **AFS-021 (Resource System)**: Resource calculations and bonuses

---

## Requirements

### Planet Types and Bonuses

1. **Volcanic Planets**
   - **Visual**: Red/orange terrain, lava flows, volcanic peaks
   - **Resource Bonuses**:
     - Mineral yield: **5x** from Mining Stations
     - Fuel yield: **3x** from Mining Stations
     - Food yield: **0.5x** from Horticultural Stations (penalty)
     - Energy yield: **1x** (normal)
   - **Strategic Role**: High-value mining, fuel production hub
   - **Terraforming Cost**: High (hostile environment)

2. **Desert Planets**
   - **Visual**: Sandy terrain, dunes, rocky outcrops, minimal atmosphere
   - **Resource Bonuses**:
     - Energy yield: **2x** from Solar Satellites (clear skies)
     - Food yield: **0.25x** from Horticultural Stations (penalty)
     - Mineral yield: **1x** (normal)
     - Fuel yield: **1x** (normal)
   - **Strategic Role**: Energy production hub, satellite deployment
   - **Terraforming Cost**: High (arid environment)

3. **Tropical Planets**
   - **Visual**: Green/blue terrain, oceans, forests, clouds
   - **Resource Bonuses**:
     - Food yield: **2x** from Horticultural Stations (fertile)
     - Energy yield: **0.75x** from Solar Satellites (cloudy)
     - Mineral yield: **1x** (normal)
     - Fuel yield: **1x** (normal)
   - **Strategic Role**: Food production hub, population growth
   - **Terraforming Cost**: Low (habitable environment)

4. **Metropolis Planets**
   - **Visual**: Urban terrain, cities, lights, industrial zones
   - **Resource Bonuses**:
     - Credit income: **2x** from taxation (large population)
     - All resource yields: **1x** (balanced)
   - **Strategic Role**: Economic hub, population center, production base
   - **Terraforming**: Not required (pre-colonized)
   - **Starting Planets**: Starbase (Player) and Hitotsu (AI)

### Planet Properties

1. **Core Attributes**
   - **ID**: Unique identifier (0-5)
   - **Name**: Display name (Starbase, Hitotsu, Planet A-D)
   - **Type**: PlanetType enum (Volcanic, Desert, Tropical, Metropolis)
   - **Owner**: FactionType enum (Player, AI, Neutral)
   - **Position**: Vector3 (3D coordinates in star system)
   - **VisualSeed**: Int (for procedural surface generation)

2. **Resources**
   - **Food**: 0-999,999 units
   - **Minerals**: 0-999,999 units
   - **Fuel**: 0-999,999 units
   - **Energy**: 0-999,999 units
   - **Credits**: 0-9,999,999 units
   - Resource storage unlimited (no cap)

3. **Population**
   - **Population**: 0-99,999 people
   - **Morale**: 0-100% (affects growth rate)
   - **Tax Rate**: 0-100% (set by player, affects income and morale)
   - **Growth Rate**: Population increase per turn (morale-dependent)
   - **Food Consumption**: Population × 0.5 Food/turn

4. **Structures**
   - **Docking Bays**: 0-3 (orbital platforms for craft)
   - **Surface Platforms**: 0-6 (surface slots for buildings/platoons)
   - **Active Buildings**: List of Structure entities
   - **Under Construction**: List of Structure entities with completion timers

5. **Military Presence**
   - **Docked Craft**: List of CraftEntity IDs at this planet
   - **Surface Platoons**: List of PlatoonEntity IDs garrisoned here
   - **Defense Strength**: Calculated from platoons + structures
   - **Under Attack**: Boolean flag (combat in progress)

6. **Colonization State**
   - **Colonized**: Boolean (has Atmosphere Processor or is Metropolis)
   - **Terraforming Progress**: 0-10 turns (Atmosphere Processor active)
   - **Habitable**: Boolean (ready for building/population)

### Planet Capacity Limits

1. **Orbital Slots (Docking Bays)**
   - Maximum: 3 Docking Bays per planet
   - Each Docking Bay can dock 2 craft (6 craft total per planet)
   - Craft exceeding capacity orbit planet (vulnerable to attack)
   - Docking Bay cost: 5,000 Credits + 1,000 Minerals + 500 Fuel

2. **Surface Slots (Platforms)**
   - Maximum: 6 Surface Platforms per planet
   - Each platform holds 1 building OR 1 platoon
   - Platform types:
     - Building slot (Mining Station, Horticultural Station)
     - Military slot (Platoon garrison)
   - Platform cost: 2,000 Credits + 500 Minerals

3. **Special Structures**
   - **Atmosphere Processor**: Required for neutral planet colonization
     - Takes 1 surface slot (cannot be removed)
     - Terraforming duration: 10 turns
     - After completion, unlocks full planet functionality
     - Cost: 10,000 Credits + 5,000 Minerals + 2,000 Fuel

---

## Acceptance Criteria

### Functional Criteria

- [ ] Planet entities store all required properties
- [ ] Resource bonuses apply correctly based on planet type
- [ ] Volcanic planets give 5x Minerals, 3x Fuel from Mining
- [ ] Desert planets give 2x Energy from Solar Satellites
- [ ] Tropical planets give 2x Food from Horticultural Stations
- [ ] Metropolis planets give 2x Credits from taxation
- [ ] Planet capacity limits enforced (3 Docking Bays, 6 Platforms)
- [ ] Colonization state tracks terraforming progress
- [ ] Population consumes 0.5 Food per person per turn

### Performance Criteria

- [ ] Planet data queries execute in <1ms
- [ ] Resource bonus calculations efficient (cached if needed)
- [ ] Planet entity serialization <100 bytes per planet

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for storage
- [ ] Provides resource bonuses to Resource System (AFS-021)
- [ ] Provides capacity limits to Building System (AFS-061)
- [ ] Provides population data to Economy System (AFS-022)

---

## Technical Notes

### Implementation Approach

```csharp
[Serializable]
public class PlanetEntity
{
    // Core Attributes
    public int ID;
    public string Name;
    public PlanetType Type;
    public FactionType Owner;
    public Vector3 Position;
    public int VisualSeed;

    // Visual Properties
    public float RotationSpeed;
    public float ScaleMultiplier;

    // Resources
    public ResourceCollection Resources;

    // Population
    public int Population;
    public int Morale; // 0-100
    public int TaxRate; // 0-100
    public float GrowthRate; // Calculated each turn

    // Structures
    public List<Structure> Structures;
    public int DockingBayCount => Structures.Count(s => s.Type == BuildingType.DockingBay);
    public int SurfacePlatformCount => Structures.Count(s => s.Type != BuildingType.DockingBay);

    // Military Presence
    public List<int> DockedCraftIDs;
    public List<int> GarrisonedPlatoonIDs;

    // Colonization State
    public bool Colonized;
    public int TerraformingProgress; // 0-10 turns
    public bool Habitable => Colonized || Type == PlanetType.Metropolis;

    // Combat State
    public bool UnderAttack;

    // Resource Production Bonuses
    public ResourceMultipliers GetResourceMultipliers()
    {
        var multipliers = new ResourceMultipliers
        {
            Food = 1.0f,
            Minerals = 1.0f,
            Fuel = 1.0f,
            Energy = 1.0f,
            Credits = 1.0f
        };

        switch (Type)
        {
            case PlanetType.Volcanic:
                multipliers.Minerals = 5.0f;
                multipliers.Fuel = 3.0f;
                multipliers.Food = 0.5f;
                break;

            case PlanetType.Desert:
                multipliers.Energy = 2.0f;
                multipliers.Food = 0.25f;
                break;

            case PlanetType.Tropical:
                multipliers.Food = 2.0f;
                multipliers.Energy = 0.75f;
                break;

            case PlanetType.Metropolis:
                multipliers.Credits = 2.0f;
                break;
        }

        return multipliers;
    }

    // Capacity Checks
    public bool CanBuildDockingBay()
    {
        return DockingBayCount < 3;
    }

    public bool CanBuildSurfaceStructure()
    {
        return SurfacePlatformCount < 6;
    }

    public int GetAvailableDockingSlots()
    {
        int maxSlots = DockingBayCount * 2; // 2 craft per bay
        int usedSlots = DockedCraftIDs.Count;
        return Mathf.Max(0, maxSlots - usedSlots);
    }

    // Population Management
    public void UpdatePopulationGrowth()
    {
        if (!Habitable || Population == 0)
            return;

        // Growth rate based on morale (0-100)
        // 100 morale = 5% growth, 50 morale = 2.5% growth, 0 morale = 0% growth
        GrowthRate = (Morale / 100f) * 0.05f;

        int growthAmount = Mathf.FloorToInt(Population * GrowthRate);
        Population = Mathf.Min(Population + growthAmount, 99999);
    }

    public void ConsumeFoodForPopulation()
    {
        if (Population == 0)
            return;

        int foodRequired = Mathf.FloorToInt(Population * 0.5f);
        Resources.Food = Mathf.Max(0, Resources.Food - foodRequired);

        // Morale penalty if food is depleted
        if (Resources.Food == 0)
        {
            Morale = Mathf.Max(0, Morale - 10);
        }
    }

    // Taxation Income
    public int CalculateTaxIncome()
    {
        if (Population == 0 || !Habitable)
            return 0;

        // Base income: 1 Credit per 10 population
        int baseIncome = Population / 10;

        // Tax rate multiplier (0-100% → 0.0-1.0)
        float taxMultiplier = TaxRate / 100f;

        // Metropolis bonus (2x Credits)
        var multipliers = GetResourceMultipliers();
        float totalMultiplier = taxMultiplier * multipliers.Credits;

        int income = Mathf.FloorToInt(baseIncome * totalMultiplier);

        // Morale penalty based on tax rate
        // High taxes (>75%) reduce morale, Low taxes (<25%) increase morale
        if (TaxRate > 75)
            Morale = Mathf.Max(0, Morale - 5);
        else if (TaxRate < 25)
            Morale = Mathf.Min(100, Morale + 2);

        return income;
    }

    // Terraforming
    public void UpdateTerraforming()
    {
        if (!Colonized && TerraformingProgress > 0)
        {
            TerraformingProgress--;
            if (TerraformingProgress == 0)
            {
                Colonized = true;
                Debug.Log($"{Name} terraforming complete! Planet is now habitable.");
            }
        }
    }

    // Defense Strength
    public int GetDefenseStrength()
    {
        int strength = 0;

        // Add strength from garrisoned platoons
        foreach (var platoonID in GarrisonedPlatoonIDs)
        {
            var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
            if (platoon != null)
            {
                strength += platoon.GetMilitaryStrength();
            }
        }

        // Add defensive bonus from structures (future: defense platforms)
        // Currently no defensive structures implemented

        return strength;
    }
}

public enum PlanetType
{
    Volcanic,
    Desert,
    Tropical,
    Metropolis
}

[Serializable]
public class Structure
{
    public int ID;
    public BuildingType Type;
    public BuildingStatus Status;
    public int TurnsRemaining; // For under-construction buildings
}

public enum BuildingType
{
    DockingBay,
    SurfacePlatform,
    MiningStation,
    HorticulturalStation,
    AtmosphereProcessor,
    SolarSatellite // Deployed craft, tracked separately
}

public enum BuildingStatus
{
    UnderConstruction,
    Active,
    Damaged,
    Destroyed
}

[Serializable]
public class ResourceMultipliers
{
    public float Food;
    public float Minerals;
    public float Fuel;
    public float Energy;
    public float Credits;
}
```

### Planet Capacity Example

```csharp
// Example: Volcanic planet with full capacity
PlanetEntity volcano = new PlanetEntity
{
    Name = "Vulcan Prime",
    Type = PlanetType.Volcanic,
    Owner = FactionType.Player,
    Structures = new List<Structure>
    {
        // 3 Docking Bays (max)
        new Structure { Type = BuildingType.DockingBay, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.DockingBay, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.DockingBay, Status = BuildingStatus.Active },

        // 6 Surface Platforms (max)
        new Structure { Type = BuildingType.MiningStation, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.MiningStation, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.MiningStation, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.MiningStation, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.HorticulturalStation, Status = BuildingStatus.Active },
        new Structure { Type = BuildingType.HorticulturalStation, Status = BuildingStatus.Active }
    }
};

// 4 Mining Stations × 50 Minerals × 5.0 (Volcanic bonus) = 1,000 Minerals/turn
// 4 Mining Stations × 30 Fuel × 3.0 (Volcanic bonus) = 360 Fuel/turn
// 2 Horticultural × 100 Food × 0.5 (Volcanic penalty) = 100 Food/turn
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Planet entity storage

### Depended On By
- **AFS-011 (Galaxy Generation)**: Creates planet entities
- **AFS-013 (Galaxy View)**: Renders planet visuals
- **AFS-021 (Resource System)**: Resource production bonuses
- **AFS-022 (Economy System)**: Population and taxation
- **AFS-061 (Building System)**: Structure construction
- **AFS-041 (Combat System)**: Defense strength calculations

### Events Published
- `OnPlanetOwnerChanged(int planetID, FactionType newOwner)`: Ownership transfer
- `OnPlanetColonized(int planetID)`: Terraforming complete
- `OnStructureBuilt(int planetID, BuildingType type)`: New structure added
- `OnPopulationChanged(int planetID, int newPopulation)`: Population growth/decline

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
