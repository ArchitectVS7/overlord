using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class DefenseSystemTests
{
    private (GameState gameState, DefenseSystem defenseSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add test planet
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Test Planet",
            Owner = FactionType.Player,
            Population = 5000,
            Colonized = true,
            Resources = new ResourceCollection
            {
                Credits = 100000,
                Minerals = 50000,
                Fuel = 20000
            }
        });

        gameState.RebuildLookups();

        var defenseSystem = new DefenseSystem(gameState);

        return (gameState, defenseSystem);
    }

    [Fact]
    public void GetDefenseMultiplier_NoDefenses_Returns1()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();

        // Act
        float multiplier = defenseSystem.GetDefenseMultiplier(0);

        // Assert
        Assert.Equal(1.0f, multiplier);
    }

    [Fact]
    public void GetDefenseMultiplier_OnePlatform_Returns1Point2()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        // Add 1 active Orbital Defense Platform
        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        float multiplier = defenseSystem.GetDefenseMultiplier(0);

        // Assert
        Assert.Equal(1.2f, multiplier, precision: 2);
    }

    [Fact]
    public void GetDefenseMultiplier_TwoPlatforms_Returns1Point4()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        // Add 2 active Orbital Defense Platforms
        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        float multiplier = defenseSystem.GetDefenseMultiplier(0);

        // Assert
        Assert.Equal(1.4f, multiplier, precision: 2);
    }

    [Fact]
    public void GetDefenseMultiplier_UnderConstructionPlatform_NotCounted()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        // Add 1 active and 1 under construction
        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.UnderConstruction
        });

        // Act
        float multiplier = defenseSystem.GetDefenseMultiplier(0);

        // Assert - Only active platform counts
        Assert.Equal(1.2f, multiplier, precision: 2);
    }

    [Fact]
    public void GetActiveDefensePlatformCount_NoDefenses_Returns0()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();

        // Act
        int count = defenseSystem.GetActiveDefensePlatformCount(0);

        // Assert
        Assert.Equal(0, count);
    }

    [Fact]
    public void GetActiveDefensePlatformCount_OneActive_Returns1()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        int count = defenseSystem.GetActiveDefensePlatformCount(0);

        // Assert
        Assert.Equal(1, count);
    }

    [Fact]
    public void GetActiveDefensePlatformCount_TwoActive_Returns2()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        int count = defenseSystem.GetActiveDefensePlatformCount(0);

        // Assert
        Assert.Equal(2, count);
    }

    [Fact]
    public void GetTotalDefensePlatformCount_IncludesUnderConstruction()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.UnderConstruction
        });

        // Act
        int total = defenseSystem.GetTotalDefensePlatformCount(0);

        // Assert
        Assert.Equal(2, total);
    }

    [Fact]
    public void CanBuildDefensePlatform_Under2_ReturnsTrue()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        bool canBuild = defenseSystem.CanBuildDefensePlatform(0);

        // Assert
        Assert.True(canBuild);
    }

    [Fact]
    public void CanBuildDefensePlatform_At2_ReturnsFalse()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        // Add 2 platforms (max)
        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        bool canBuild = defenseSystem.CanBuildDefensePlatform(0);

        // Assert
        Assert.False(canBuild);
    }

    [Fact]
    public void CalculateDefensiveStrength_NoDefenses_ReturnsBase()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();

        // Act
        int strength = defenseSystem.CalculateDefensiveStrength(0, 100);

        // Assert
        Assert.Equal(100, strength);
    }

    [Fact]
    public void CalculateDefensiveStrength_OnePlatform_Returns120()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        int strength = defenseSystem.CalculateDefensiveStrength(0, 100);

        // Assert - 100 × 1.2 = 120
        Assert.Equal(120, strength);
    }

    [Fact]
    public void CalculateDefensiveStrength_TwoPlatforms_Returns140()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        int strength = defenseSystem.CalculateDefensiveStrength(0, 100);

        // Assert - 100 × 1.4 = 140
        Assert.Equal(140, strength);
    }

    [Fact]
    public void GetDefenseReport_NoDefenses_ReturnsCorrectMessage()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();

        // Act
        string report = defenseSystem.GetDefenseReport(0);

        // Assert
        Assert.Equal("No orbital defenses", report);
    }

    [Fact]
    public void GetDefenseReport_OnePlatform_ReturnsCorrectMessage()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        string report = defenseSystem.GetDefenseReport(0);

        // Assert
        Assert.Contains("+20% defense", report);
        Assert.Contains("(1/2 active)", report);
    }

    [Fact]
    public void GetDefenseReport_TwoPlatforms_ReturnsCorrectMessage()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });

        // Act
        string report = defenseSystem.GetDefenseReport(0);

        // Assert
        Assert.Contains("+40% defense", report);
        Assert.Contains("(2/2 active)", report);
    }

    [Fact]
    public void GetDefenseReport_InactivePlatform_ShowsInactiveWarning()
    {
        // Arrange
        var (gameState, defenseSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];

        planet.Structures.Add(new Structure
        {
            ID = 0,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.Active
        });
        planet.Structures.Add(new Structure
        {
            ID = 1,
            Type = BuildingType.OrbitalDefense,
            Status = BuildingStatus.UnderConstruction // Inactive
        });

        // Act
        string report = defenseSystem.GetDefenseReport(0);

        // Assert
        Assert.Contains("+20% defense", report);
        Assert.Contains("(1/2 active)", report);
        Assert.Contains("[1 inactive - insufficient crew]", report);
    }
}
