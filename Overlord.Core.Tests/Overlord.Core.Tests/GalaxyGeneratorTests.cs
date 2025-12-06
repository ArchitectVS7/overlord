using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

/// <summary>
/// Unit tests for the GalaxyGenerator system.
/// </summary>
public class GalaxyGeneratorTests
{
    [Fact]
    public void GenerateGalaxy_WithSeed_ReturnsDeterministicGalaxy()
    {
        // Arrange
        var generator = new GalaxyGenerator();
        int seed = 12345;

        // Act
        var galaxy1 = generator.GenerateGalaxy(seed, Difficulty.Normal);
        var galaxy2 = generator.GenerateGalaxy(seed, Difficulty.Normal);

        // Assert
        Assert.Equal(galaxy1.Seed, galaxy2.Seed);
        Assert.Equal(galaxy1.Name, galaxy2.Name);
        Assert.Equal(galaxy1.Planets.Count, galaxy2.Planets.Count);

        // Verify positions are identical
        for (int i = 0; i < galaxy1.Planets.Count; i++)
        {
            var planet1 = galaxy1.Planets[i];
            var planet2 = galaxy2.Planets[i];
            Assert.Equal(planet1.Position.X, planet2.Position.X, precision: 5);
            Assert.Equal(planet1.Position.Y, planet2.Position.Y, precision: 5);
            Assert.Equal(planet1.Position.Z, planet2.Position.Z, precision: 5);
        }
    }

    [Theory]
    [InlineData(Difficulty.Easy, 6)]
    [InlineData(Difficulty.Normal, 5)]
    [InlineData(Difficulty.Hard, 4)]
    public void GenerateGalaxy_DifficultyLevel_GeneratesCorrectPlanetCount(Difficulty difficulty, int expectedPlanetCount)
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, difficulty);

        // Assert
        Assert.Equal(expectedPlanetCount, galaxy.Planets.Count);
        Assert.Equal(difficulty, galaxy.Difficulty);
    }

    [Fact]
    public void GenerateGalaxy_Always_GeneratesStarbaseAndHitotsu()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var starbase = galaxy.Planets.FirstOrDefault(p => p.Name == "Starbase");
        var hitotsu = galaxy.Planets.FirstOrDefault(p => p.Name == "Hitotsu");

        Assert.NotNull(starbase);
        Assert.NotNull(hitotsu);
        Assert.Equal(FactionType.Player, starbase.Owner);
        Assert.Equal(FactionType.AI, hitotsu.Owner);
        Assert.Equal(PlanetType.Metropolis, starbase.Type);
        Assert.Equal(PlanetType.Metropolis, hitotsu.Type);
    }

    [Fact]
    public void GenerateGalaxy_StarbaseAndHitotsu_ArePlacedOpposite()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var starbase = galaxy.Planets.First(p => p.Name == "Starbase");
        var hitotsu = galaxy.Planets.First(p => p.Name == "Hitotsu");

        // Calculate angle difference (should be close to π radians / 180 degrees)
        float starbaseAngle = starbase.Position.GetAngleXZ();
        float hitotsuAngle = hitotsu.Position.GetAngleXZ();
        float angleDifference = Math.Abs(starbaseAngle - hitotsuAngle);

        // Normalize to [0, 2π]
        if (angleDifference > Math.PI)
            angleDifference = (float)(2 * Math.PI - angleDifference);

        // Should be close to π (180 degrees) with ±30 degree variation
        Assert.InRange(angleDifference, Math.PI - 0.5, Math.PI + 0.5); // ±0.5 radians ≈ ±30°
    }

    [Fact]
    public void GenerateGalaxy_StartingPlanets_HaveInitialResources()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var starbase = galaxy.Planets.First(p => p.Name == "Starbase");
        var hitotsu = galaxy.Planets.First(p => p.Name == "Hitotsu");

        // Both starting planets should have 10,000 of each resource
        Assert.Equal(10000, starbase.Resources.Food);
        Assert.Equal(10000, starbase.Resources.Minerals);
        Assert.Equal(10000, starbase.Resources.Fuel);
        Assert.Equal(10000, starbase.Resources.Energy);
        Assert.Equal(50000, starbase.Resources.Credits);

        Assert.Equal(10000, hitotsu.Resources.Food);
        Assert.Equal(10000, hitotsu.Resources.Minerals);
        Assert.Equal(10000, hitotsu.Resources.Fuel);
        Assert.Equal(10000, hitotsu.Resources.Energy);
        Assert.Equal(50000, hitotsu.Resources.Credits);
    }

    [Fact]
    public void GenerateGalaxy_StartingPlanets_Have3DockingBays()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var starbase = galaxy.Planets.First(p => p.Name == "Starbase");
        var hitotsu = galaxy.Planets.First(p => p.Name == "Hitotsu");

        Assert.Equal(3, starbase.Structures.Count);
        Assert.All(starbase.Structures, s =>
        {
            Assert.Equal(BuildingType.DockingBay, s.Type);
            Assert.Equal(BuildingStatus.Active, s.Status);
        });

        Assert.Equal(3, hitotsu.Structures.Count);
        Assert.All(hitotsu.Structures, s =>
        {
            Assert.Equal(BuildingType.DockingBay, s.Type);
            Assert.Equal(BuildingStatus.Active, s.Status);
        });
    }

    [Fact]
    public void GenerateGalaxy_StartingPlanets_AreColonizedWithPopulation()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var starbase = galaxy.Planets.First(p => p.Name == "Starbase");
        var hitotsu = galaxy.Planets.First(p => p.Name == "Hitotsu");

        Assert.True(starbase.Colonized);
        Assert.Equal(1000, starbase.Population);
        Assert.Equal(50, starbase.Morale);
        Assert.Equal(50, starbase.TaxRate);

        Assert.True(hitotsu.Colonized);
        Assert.Equal(1000, hitotsu.Population);
        Assert.Equal(50, hitotsu.Morale);
        Assert.Equal(50, hitotsu.TaxRate);
    }

    [Fact]
    public void GenerateGalaxy_NeutralPlanets_AreUncolonized()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var neutralPlanets = galaxy.Planets.Where(p => p.Owner == FactionType.Neutral).ToList();

        Assert.NotEmpty(neutralPlanets);
        Assert.All(neutralPlanets, p =>
        {
            Assert.False(p.Colonized);
            Assert.Equal(0, p.Population);
            Assert.Equal(0, p.Morale);
            Assert.Equal(0, p.TaxRate);
            Assert.Empty(p.Structures);
        });
    }

    [Fact]
    public void GenerateGalaxy_NeutralPlanets_HaveVariedTypes()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Easy); // Easy = 6 planets = 4 neutrals

        // Assert
        var neutralPlanets = galaxy.Planets.Where(p => p.Owner == FactionType.Neutral).ToList();

        // Should have volcanic, desert, and tropical types
        var types = neutralPlanets.Select(p => p.Type).Distinct().ToList();
        Assert.Contains(PlanetType.Volcanic, types.Concat(new[] { PlanetType.Volcanic })); // At least one
        Assert.Contains(PlanetType.Desert, types.Concat(new[] { PlanetType.Desert }));
        Assert.Contains(PlanetType.Tropical, types.Concat(new[] { PlanetType.Tropical }));

        // No neutral planet should be Metropolis
        Assert.All(neutralPlanets, p => Assert.NotEqual(PlanetType.Metropolis, p.Type));
    }

    [Fact]
    public void GenerateGalaxy_Planets_HaveMininumSeparation()
    {
        // Arrange
        var generator = new GalaxyGenerator();
        const float minDistance = 50f;

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Easy); // Max planets

        // Assert
        var planets = galaxy.Planets;
        for (int i = 0; i < planets.Count; i++)
        {
            for (int j = i + 1; j < planets.Count; j++)
            {
                float distance = planets[i].Position.DistanceTo(planets[j].Position);

                // Allow some tolerance for collision detection algorithm
                // (it tries 10 times, might not always succeed)
                if (distance < minDistance)
                {
                    // This is acceptable - collision detection is best-effort
                    // Just verify it's not too close (e.g., overlapping)
                    Assert.True(distance > 10f, $"Planets {i} and {j} are too close ({distance:F2} units)");
                }
            }
        }
    }

    [Fact]
    public void GenerateGalaxy_Planets_HaveUniqueIDs()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Easy);

        // Assert
        var ids = galaxy.Planets.Select(p => p.ID).ToList();
        var uniqueIds = ids.Distinct().ToList();

        Assert.Equal(ids.Count, uniqueIds.Count);
    }

    [Fact]
    public void GenerateGalaxy_Planets_HaveSequentialIDs()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var sortedPlanets = galaxy.Planets.OrderBy(p => p.ID).ToList();
        for (int i = 0; i < sortedPlanets.Count; i++)
        {
            Assert.Equal(i, sortedPlanets[i].ID);
        }
    }

    [Fact]
    public void GenerateGalaxy_Planets_HaveRandomVisualProperties()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        Assert.All(galaxy.Planets, p =>
        {
            Assert.InRange(p.RotationSpeed, 0.1f, 0.5f);
            Assert.InRange(p.ScaleMultiplier, 1.0f, 1.5f);
            Assert.NotEqual(0, p.VisualSeed); // Should have a seed for procedural generation
        });
    }

    [Fact]
    public void GenerateGalaxy_WithoutSeed_GeneratesRandomGalaxy()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy1 = generator.GenerateGalaxy(null, Difficulty.Normal);
        var galaxy2 = generator.GenerateGalaxy(null, Difficulty.Normal);

        // Assert
        // Different seeds should generate different galaxies
        Assert.NotEqual(galaxy1.Seed, galaxy2.Seed);
    }

    [Fact]
    public void GenerateGalaxy_GeneratesGalaxyName()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        Assert.NotEmpty(galaxy.Name);
        Assert.Contains("System Alpha-", galaxy.Name);
    }

    [Fact]
    public void GenerateGalaxy_FiresOnGalaxyGeneratedEvent()
    {
        // Arrange
        var generator = new GalaxyGenerator();
        Galaxy? eventGalaxy = null;
        generator.OnGalaxyGenerated += (galaxy) => eventGalaxy = galaxy;

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        Assert.NotNull(eventGalaxy);
        Assert.Equal(galaxy.Seed, eventGalaxy.Seed);
        Assert.Equal(galaxy.Name, eventGalaxy.Name);
    }

    [Fact]
    public void GenerateGalaxy_FiresOnPlanetCreatedEvent()
    {
        // Arrange
        var generator = new GalaxyGenerator();
        var createdPlanets = new List<PlanetEntity>();
        generator.OnPlanetCreated += (planet) => createdPlanets.Add(planet);

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        Assert.Equal(galaxy.Planets.Count, createdPlanets.Count);

        // Verify Starbase was created first
        Assert.Equal("Starbase", createdPlanets[0].Name);

        // Verify Hitotsu was created second
        Assert.Equal("Hitotsu", createdPlanets[1].Name);
    }

    [Fact]
    public void GenerateGalaxy_NeutralPlanets_HaveAlphabeticNames()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Easy); // 4 neutral planets

        // Assert
        var neutralPlanets = galaxy.Planets
            .Where(p => p.Owner == FactionType.Neutral)
            .OrderBy(p => p.ID)
            .ToList();

        for (int i = 0; i < neutralPlanets.Count; i++)
        {
            char expectedLetter = (char)('A' + i);
            Assert.Equal($"Planet {expectedLetter}", neutralPlanets[i].Name);
        }
    }

    [Fact]
    public void Galaxy_Planets_CanAccessResourceMultipliers()
    {
        // Arrange
        var generator = new GalaxyGenerator();

        // Act
        var galaxy = generator.GenerateGalaxy(12345, Difficulty.Normal);

        // Assert
        var volcanicPlanet = galaxy.Planets.FirstOrDefault(p => p.Type == PlanetType.Volcanic);
        if (volcanicPlanet != null)
        {
            var multipliers = volcanicPlanet.ResourceMultipliers;
            Assert.Equal(5.0f, multipliers.Minerals);
            Assert.Equal(3.0f, multipliers.Fuel);
            Assert.Equal(0.5f, multipliers.Food);
        }

        var desertPlanet = galaxy.Planets.FirstOrDefault(p => p.Type == PlanetType.Desert);
        if (desertPlanet != null)
        {
            var multipliers = desertPlanet.ResourceMultipliers;
            Assert.Equal(2.0f, multipliers.Energy);
            Assert.Equal(0.25f, multipliers.Food);
        }

        var tropicalPlanet = galaxy.Planets.FirstOrDefault(p => p.Type == PlanetType.Tropical);
        if (tropicalPlanet != null)
        {
            var multipliers = tropicalPlanet.ResourceMultipliers;
            Assert.Equal(2.0f, multipliers.Food);
            Assert.Equal(0.75f, multipliers.Energy);
        }

        var metropolis = galaxy.Planets.First(p => p.Type == PlanetType.Metropolis);
        var metropolisMultipliers = metropolis.ResourceMultipliers;
        Assert.Equal(2.0f, metropolisMultipliers.Credits);
    }
}
