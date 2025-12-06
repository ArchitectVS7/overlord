# AFS-011: Galaxy Generation

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-GALAXY-001

---

## Summary

Procedural star system generator that creates 4-6 planet systems with player/AI starting planets (Starbase and Hitotsu) and 2-4 neutral planets, assigning planet types, positions, and initial resources to create varied strategic scenarios.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Stores generated planet entities
- **AFS-012 (Planet System)**: Planet entity structure and properties

---

## Requirements

### Galaxy Structure

1. **Star System Layout**
   - Central star (visual only, not interactive)
   - 4-6 planets in orbital arrangement
   - Planets positioned at varying distances from star
   - Orbital radius: 50-300 units from center
   - Planets spaced with minimum 30-degree angular separation
   - 3D positioning (not flat plane) for visual interest

2. **Starting Planets**
   - **Starbase** (Player starting planet)
     - Always Metropolis type
     - Position: Random orbit (50-150 units from center)
     - Initial resources: 10,000 of each (Food, Minerals, Fuel, Energy)
     - Initial structures: 3 Docking Bays (pre-built)
     - Initial population: 1,000
     - Initial tax rate: 50%
   - **Hitotsu** (AI starting planet)
     - Always Metropolis type
     - Position: Opposite side of star from Starbase (±90 degrees)
     - Distance: 100-250 units from Starbase
     - Initial resources: Same as Starbase
     - Initial structures: 3 Docking Bays (pre-built)
     - Initial population: 1,000
     - Initial military: 1 Platoon (50 troops, Basic equipment)

3. **Neutral Planets**
   - Count: 2-4 planets (randomly determined)
   - Types: Volcanic, Desert, Tropical (randomly assigned)
   - Positions: Random orbits avoiding overlap with starting planets
   - Initial state: Uninhabited (no buildings, no population)
   - Resources: None (until colonized)
   - Terraforming required: Yes (Atmosphere Processor)

### Procedural Generation Rules

1. **Deterministic Seed**
   - Use random seed for reproducibility
   - Seed displayed in galaxy generation screen
   - Player can enter custom seed for specific galaxy layout
   - Default: Generate random seed from system time

2. **Planet Type Distribution**
   - 2 Metropolis (Starbase and Hitotsu, fixed)
   - Remaining planets: 1-2 Volcanic, 1-2 Desert, 1-2 Tropical
   - No duplicate types if possible (with 4-6 planets)
   - Example 4-planet system: Metropolis (x2), Volcanic, Desert
   - Example 6-planet system: Metropolis (x2), Volcanic (x2), Desert, Tropical

3. **Position Generation Algorithm**
   - Place Starbase first (random angle, radius 50-150)
   - Place Hitotsu opposite Starbase (±90°, radius 100-250)
   - For each neutral planet:
     - Random angle (avoiding ±30° of existing planets)
     - Random radius (50-300 units)
     - Check minimum distance (50 units from other planets)
     - Retry if collision detected (max 10 attempts)

4. **Visual Variation**
   - Each planet has unique visual seed for surface texture
   - Rotation speed: 0.1-0.5 degrees per second (varied per planet)
   - Orbit animation: Optional visual orbit paths (not functional)
   - Size variation: 1.0-1.5x scale multiplier per planet type

### Galaxy Metadata

1. **Galaxy Name**
   - Auto-generated from seed (e.g., "System Alpha-7429")
   - Player can rename in save file metadata
   - Displayed in save/load screen

2. **Difficulty Adjustment**
   - Easy: 6 planets (more neutrals to claim)
   - Normal: 5 planets
   - Hard: 4 planets (fewer resources available)
   - AI starting military scales with difficulty

---

## Acceptance Criteria

### Functional Criteria

- [ ] Galaxy generates 4-6 planets consistently
- [ ] Starbase and Hitotsu always generated as Metropolis
- [ ] Neutral planets assigned Volcanic/Desert/Tropical types
- [ ] No planets overlap (minimum 50 unit separation)
- [ ] Same seed generates identical galaxy layout
- [ ] Player can input custom seed for reproducible galaxies
- [ ] Initial resources and structures match specification

### Performance Criteria

- [ ] Galaxy generation completes in <500ms
- [ ] No visual popping during generation
- [ ] Smooth transition from loading to galaxy view

### Integration Criteria

- [ ] Generated planets stored in Game State Manager (AFS-001)
- [ ] Planet entities conform to Planet System structure (AFS-012)
- [ ] Galaxy View renders generated layout (AFS-013)

---

## Technical Notes

### Implementation Approach

```csharp
public class GalaxyGenerator : MonoBehaviour
{
    [SerializeField] private int _minPlanets = 4;
    [SerializeField] private int _maxPlanets = 6;

    public Galaxy GenerateGalaxy(int? seed = null)
    {
        // Use provided seed or generate random
        int actualSeed = seed ?? (int)DateTime.Now.Ticks;
        Random.InitState(actualSeed);

        var galaxy = new Galaxy
        {
            Seed = actualSeed,
            Name = GenerateGalaxyName(actualSeed)
        };

        // Determine planet count (4-6)
        int planetCount = Random.Range(_minPlanets, _maxPlanets + 1);

        // Create planet list
        var planets = new List<PlanetEntity>();

        // 1. Generate Starbase (Player starting planet)
        var starbase = GenerateStartingPlanet(
            "Starbase",
            PlanetType.Metropolis,
            FactionType.Player,
            actualSeed
        );
        planets.Add(starbase);

        // 2. Generate Hitotsu (AI starting planet)
        var hitotsu = GenerateStartingPlanet(
            "Hitotsu",
            PlanetType.Metropolis,
            FactionType.AI,
            actualSeed + 1,
            oppositeOf: starbase.Position
        );
        planets.Add(hitotsu);

        // 3. Generate neutral planets
        int neutralCount = planetCount - 2;
        var availableTypes = new List<PlanetType>
        {
            PlanetType.Volcanic,
            PlanetType.Desert,
            PlanetType.Tropical
        };

        for (int i = 0; i < neutralCount; i++)
        {
            PlanetType type = availableTypes[i % availableTypes.Count];
            var planet = GenerateNeutralPlanet(
                $"Planet {(char)('A' + i)}",
                type,
                planets,
                actualSeed + i + 2
            );
            planets.Add(planet);
        }

        galaxy.Planets = planets;
        return galaxy;
    }

    private PlanetEntity GenerateStartingPlanet(
        string name,
        PlanetType type,
        FactionType owner,
        int seed,
        Vector3? oppositeOf = null)
    {
        Random.InitState(seed);

        // Position logic
        Vector3 position;
        if (oppositeOf.HasValue)
        {
            // Place opposite to another planet
            float angle = Mathf.Atan2(oppositeOf.Value.z, oppositeOf.Value.x);
            angle += Mathf.PI + Random.Range(-0.5f, 0.5f); // ±90° variation
            float radius = Random.Range(100f, 250f);
            position = new Vector3(
                Mathf.Cos(angle) * radius,
                Random.Range(-20f, 20f), // Slight vertical variation
                Mathf.Sin(angle) * radius
            );
        }
        else
        {
            // Random position
            float angle = Random.Range(0f, Mathf.PI * 2f);
            float radius = Random.Range(50f, 150f);
            position = new Vector3(
                Mathf.Cos(angle) * radius,
                Random.Range(-20f, 20f),
                Mathf.Sin(angle) * radius
            );
        }

        var planet = new PlanetEntity
        {
            ID = GameStateManager.Instance.GetNextPlanetID(),
            Name = name,
            Type = type,
            Owner = owner,
            Position = position,
            VisualSeed = seed,
            RotationSpeed = Random.Range(0.1f, 0.5f),
            ScaleMultiplier = Random.Range(1.0f, 1.5f)
        };

        // Initial resources for starting planets
        planet.Resources = new ResourceCollection
        {
            Food = 10000,
            Minerals = 10000,
            Fuel = 10000,
            Energy = 10000,
            Credits = 50000
        };

        // Initial structures (3 Docking Bays)
        planet.Structures = new List<Structure>
        {
            new Structure { Type = BuildingType.DockingBay, Status = BuildingStatus.Active },
            new Structure { Type = BuildingType.DockingBay, Status = BuildingStatus.Active },
            new Structure { Type = BuildingType.DockingBay, Status = BuildingStatus.Active }
        };

        // Initial population
        planet.Population = 1000;
        planet.TaxRate = 50;

        // AI starting military
        if (owner == FactionType.AI)
        {
            var platoon = new PlatoonEntity
            {
                ID = GameStateManager.Instance.GetNextPlatoonID(),
                Owner = FactionType.AI,
                Troops = 50,
                Equipment = EquipmentLevel.Basic,
                Training = TrainingLevel.Recruit,
                LocationPlanetID = planet.ID
            };
            GameStateManager.Instance.AddPlatoon(platoon);
        }

        return planet;
    }

    private PlanetEntity GenerateNeutralPlanet(
        string name,
        PlanetType type,
        List<PlanetEntity> existingPlanets,
        int seed)
    {
        Random.InitState(seed);

        // Find valid position (avoiding collisions)
        Vector3 position = Vector3.zero;
        bool validPosition = false;
        int attempts = 0;

        while (!validPosition && attempts < 10)
        {
            float angle = Random.Range(0f, Mathf.PI * 2f);
            float radius = Random.Range(50f, 300f);
            position = new Vector3(
                Mathf.Cos(angle) * radius,
                Random.Range(-20f, 20f),
                Mathf.Sin(angle) * radius
            );

            // Check distance from existing planets
            validPosition = true;
            foreach (var existing in existingPlanets)
            {
                if (Vector3.Distance(position, existing.Position) < 50f)
                {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }

        if (!validPosition)
        {
            Debug.LogWarning($"Could not find valid position for {name} after {attempts} attempts!");
        }

        var planet = new PlanetEntity
        {
            ID = GameStateManager.Instance.GetNextPlanetID(),
            Name = name,
            Type = type,
            Owner = FactionType.Neutral,
            Position = position,
            VisualSeed = seed,
            RotationSpeed = Random.Range(0.1f, 0.5f),
            ScaleMultiplier = Random.Range(1.0f, 1.5f)
        };

        // Neutral planets start with no resources or structures
        planet.Resources = new ResourceCollection();
        planet.Structures = new List<Structure>();
        planet.Population = 0;

        return planet;
    }

    private string GenerateGalaxyName(int seed)
    {
        return $"System Alpha-{seed % 10000:D4}";
    }
}

[Serializable]
public class Galaxy
{
    public int Seed;
    public string Name;
    public List<PlanetEntity> Planets;
}
```

### Example Galaxy Layouts

**4-Planet System (Hard Difficulty):**
```
Starbase (Metropolis) - Player - (120, 5, 80) - 10k resources
Hitotsu (Metropolis) - AI - (-150, -10, -100) - 10k resources, 1 platoon
Planet A (Volcanic) - Neutral - (200, 15, 50) - Uninhabited
Planet B (Desert) - Neutral - (-80, -5, 180) - Uninhabited
```

**6-Planet System (Easy Difficulty):**
```
Starbase (Metropolis) - Player - (100, 0, 100)
Hitotsu (Metropolis) - AI - (-200, 5, -150)
Planet A (Volcanic) - Neutral - (250, -10, 100)
Planet B (Volcanic) - Neutral - (-100, 8, 220)
Planet C (Desert) - Neutral - (150, 12, -200)
Planet D (Tropical) - Neutral - (-250, -8, 80)
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Stores generated planet entities
- **AFS-012 (Planet System)**: Planet entity structure

### Depended On By
- **AFS-013 (Galaxy View)**: Renders generated galaxy layout
- **AFS-021 (Resource System)**: Initial resource allocation
- **AFS-061 (Building System)**: Initial structures (Docking Bays)

### Events Published
- `OnGalaxyGenerated(Galaxy galaxy)`: Galaxy generation complete
- `OnPlanetCreated(PlanetEntity planet)`: Each planet added to system

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
