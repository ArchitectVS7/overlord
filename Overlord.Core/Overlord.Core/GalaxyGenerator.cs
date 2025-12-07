using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Procedural galaxy generator that creates 4-6 planet systems.
/// Platform-agnostic implementation using deterministic seeding.
/// </summary>
public class GalaxyGenerator
{
    private Random _random = new Random();

    /// <summary>
    /// Event fired when galaxy generation completes.
    /// </summary>
    public event Action<Galaxy>? OnGalaxyGenerated;

    /// <summary>
    /// Event fired when a planet is created.
    /// </summary>
    public event Action<PlanetEntity>? OnPlanetCreated;

    /// <summary>
    /// Generates a new galaxy with procedurally generated planets.
    /// </summary>
    /// <param name="seed">Optional seed for reproducibility. If null, uses current time.</param>
    /// <param name="difficulty">Difficulty level affecting planet count (Easy=6, Normal=5, Hard=4)</param>
    /// <returns>Generated galaxy with planets</returns>
    public Galaxy GenerateGalaxy(int? seed = null, Difficulty difficulty = Difficulty.Normal)
    {
        // Use provided seed or generate from time
        int actualSeed = seed ?? (int)(DateTime.UtcNow.Ticks & 0x7FFFFFFF);
        _random = new Random(actualSeed);

        var galaxy = new Galaxy
        {
            Seed = actualSeed,
            Name = GenerateGalaxyName(actualSeed),
            Difficulty = difficulty
        };

        // Determine planet count based on difficulty
        int planetCount = difficulty switch
        {
            Difficulty.Easy => 6,
            Difficulty.Normal => 5,
            Difficulty.Hard => 4,
            _ => 5
        };

        var planets = new List<PlanetEntity>();

        // 1. Generate Starbase (Player starting planet)
        var starbase = GenerateStartingPlanet(
            id: 0,
            name: "Starbase",
            type: PlanetType.Metropolis,
            owner: FactionType.Player,
            seed: actualSeed
        );
        planets.Add(starbase);
        OnPlanetCreated?.Invoke(starbase);

        // 2. Generate Hitotsu (AI starting planet) opposite to Starbase
        var hitotsu = GenerateStartingPlanet(
            id: 1,
            name: "Hitotsu",
            type: PlanetType.Metropolis,
            owner: FactionType.AI,
            seed: actualSeed + 1,
            oppositeOf: starbase.Position
        );
        planets.Add(hitotsu);
        OnPlanetCreated?.Invoke(hitotsu);

        // 3. Generate neutral planets
        int neutralCount = planetCount - 2;
        var availableTypes = new List<PlanetType>
        {
            PlanetType.Volcanic,
            PlanetType.Desert,
            PlanetType.Tropical,
            PlanetType.Volcanic, // Allow duplicates for 6-planet systems
            PlanetType.Desert,
            PlanetType.Tropical
        };

        // Shuffle available types for variety
        ShuffleList(availableTypes);

        for (int i = 0; i < neutralCount; i++)
        {
            PlanetType type = availableTypes[i % availableTypes.Count];
            var planet = GenerateNeutralPlanet(
                id: i + 2,
                name: $"Planet {(char)('A' + i)}",
                type: type,
                existingPlanets: planets,
                seed: actualSeed + i + 2
            );
            planets.Add(planet);
            OnPlanetCreated?.Invoke(planet);
        }

        galaxy.Planets = planets;
        OnGalaxyGenerated?.Invoke(galaxy);

        return galaxy;
    }

    /// <summary>
    /// Generates a starting planet (Starbase or Hitotsu) with initial resources.
    /// </summary>
    private PlanetEntity GenerateStartingPlanet(
        int id,
        string name,
        PlanetType type,
        FactionType owner,
        int seed,
        Position3D? oppositeOf = null)
    {
        var localRandom = new Random(seed);

        // Position logic
        Position3D position;
        if (oppositeOf != null)
        {
            // Place opposite to Starbase with ±90° variation
            float starbaseAngle = oppositeOf.GetAngleXZ();
            float angleVariation = (float)(localRandom.NextDouble() - 0.5) * 1.0f; // ±0.5 radians (~±30°)
            float angle = starbaseAngle + (float)Math.PI + angleVariation;
            float radius = 100f + (float)localRandom.NextDouble() * 150f; // 100-250 units

            position = Position3D.FromPolar(
                angle,
                radius,
                y: -20f + (float)localRandom.NextDouble() * 40f // -20 to +20
            );
        }
        else
        {
            // Random position for Starbase
            float angle = (float)(localRandom.NextDouble() * Math.PI * 2);
            float radius = 50f + (float)localRandom.NextDouble() * 100f; // 50-150 units

            position = Position3D.FromPolar(
                angle,
                radius,
                y: -20f + (float)localRandom.NextDouble() * 40f
            );
        }

        var planet = new PlanetEntity
        {
            ID = id,
            Name = name,
            Type = type,
            Owner = owner,
            Position = position,
            VisualSeed = seed,
            RotationSpeed = 0.1f + (float)localRandom.NextDouble() * 0.4f, // 0.1-0.5
            ScaleMultiplier = 1.0f + (float)localRandom.NextDouble() * 0.5f, // 1.0-1.5
            Colonized = true, // Metropolis planets start colonized
            Population = 1000,
            Morale = 50,
            TaxRate = 50
        };

        // Initial resources for starting planets
        planet.Resources.Food = 10000;
        planet.Resources.Minerals = 10000;
        planet.Resources.Fuel = 10000;
        planet.Resources.Energy = 10000;
        planet.Resources.Credits = 50000;

        // Initial structures (3 Docking Bays)
        for (int i = 0; i < 3; i++)
        {
            planet.Structures.Add(new Structure
            {
                ID = i,
                Type = BuildingType.DockingBay,
                Status = BuildingStatus.Active
            });
        }

        return planet;
    }

    /// <summary>
    /// Generates a neutral planet with random type and position.
    /// </summary>
    private PlanetEntity GenerateNeutralPlanet(
        int id,
        string name,
        PlanetType type,
        List<PlanetEntity> existingPlanets,
        int seed)
    {
        var localRandom = new Random(seed);

        // Find valid position (avoiding collisions)
        Position3D position = new Position3D();
        bool validPosition = false;
        int attempts = 0;
        const int maxAttempts = 10;
        const float minDistance = 50f;

        while (!validPosition && attempts < maxAttempts)
        {
            float angle = (float)(localRandom.NextDouble() * Math.PI * 2);
            float radius = 50f + (float)localRandom.NextDouble() * 250f; // 50-300 units

            position = Position3D.FromPolar(
                angle,
                radius,
                y: -20f + (float)localRandom.NextDouble() * 40f
            );

            // Check distance from existing planets
            validPosition = true;
            foreach (var existing in existingPlanets)
            {
                if (position.DistanceTo(existing.Position) < minDistance)
                {
                    validPosition = false;
                    break;
                }
            }

            attempts++;
        }

        var planet = new PlanetEntity
        {
            ID = id,
            Name = name,
            Type = type,
            Owner = FactionType.Neutral,
            Position = position,
            VisualSeed = seed,
            RotationSpeed = 0.1f + (float)localRandom.NextDouble() * 0.4f,
            ScaleMultiplier = 1.0f + (float)localRandom.NextDouble() * 0.5f,
            Colonized = false, // Neutral planets not colonized
            Population = 0,
            Morale = 0,
            TaxRate = 0
        };

        // Neutral planets start with no resources or structures
        planet.Resources = new ResourceCollection();
        planet.Structures = new List<Structure>();

        return planet;
    }

    /// <summary>
    /// Generates a galaxy name from the seed.
    /// </summary>
    private string GenerateGalaxyName(int seed)
    {
        return $"System Alpha-{seed % 10000:D4}";
    }

    /// <summary>
    /// Fisher-Yates shuffle for randomizing planet types.
    /// </summary>
    private void ShuffleList<T>(List<T> list)
    {
        int n = list.Count;
        for (int i = n - 1; i > 0; i--)
        {
            int j = _random.Next(i + 1);
            (list[i], list[j]) = (list[j], list[i]);
        }
    }
}

/// <summary>
/// Represents a generated galaxy with planets.
/// </summary>
public class Galaxy
{
    public int Seed { get; set; }
    public string Name { get; set; } = string.Empty;
    public Difficulty Difficulty { get; set; }
    public List<PlanetEntity> Planets { get; set; } = new List<PlanetEntity>();
}

/// <summary>
/// Game difficulty affecting galaxy generation.
/// </summary>
public enum Difficulty
{
    Easy,   // 6 planets (more neutrals to claim)
    Normal, // 5 planets
    Hard    // 4 planets (fewer resources)
}
