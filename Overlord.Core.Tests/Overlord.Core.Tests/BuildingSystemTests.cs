using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class BuildingSystemTests
{
    private (GameState gameState, BuildingSystem buildingSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add test planet with resources
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

        var buildingSystem = new BuildingSystem(gameState);

        return (gameState, buildingSystem);
    }

    [Fact]
    public void StartConstruction_Success()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Act
        bool result = buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Assert
        Assert.True(result);
        var planet = gameState.PlanetLookup[0];
        Assert.Single(planet.Structures);
        var building = planet.Structures[0];
        Assert.Equal(BuildingType.DockingBay, building.Type);
        Assert.Equal(BuildingStatus.UnderConstruction, building.Status);
        Assert.Equal(2, building.TurnsRemaining); // Docking Bay takes 2 turns
    }

    [Fact]
    public void StartConstruction_DeductsCost()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];
        int initialCredits = planet.Resources.Credits;
        int initialMinerals = planet.Resources.Minerals;
        int initialFuel = planet.Resources.Fuel;

        // Act
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Assert
        var cost = BuildingCosts.GetCost(BuildingType.DockingBay);
        Assert.Equal(initialCredits - cost.Credits, planet.Resources.Credits);
        Assert.Equal(initialMinerals - cost.Minerals, planet.Resources.Minerals);
        Assert.Equal(initialFuel - cost.Fuel, planet.Resources.Fuel);
    }

    [Fact]
    public void StartConstruction_InsufficientResources_Fails()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        gameState.PlanetLookup[0].Resources.Credits = 100;

        // Act
        bool result = buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Assert
        Assert.False(result);
        Assert.Empty(gameState.PlanetLookup[0].Structures);
    }

    [Fact]
    public void StartConstruction_MaxDockingBays_Fails()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Build 3 Docking Bays (max)
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Act - Try to build 4th
        bool result = buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Assert
        Assert.False(result);
        Assert.Equal(3, gameState.PlanetLookup[0].Structures.Count);
    }

    [Fact]
    public void StartConstruction_MaxSurfaceStructures_Fails()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Build 6 Surface Platforms (max)
        for (int i = 0; i < 6; i++)
        {
            buildingSystem.StartConstruction(0, BuildingType.SurfacePlatform);
        }

        // Act - Try to build 7th
        bool result = buildingSystem.StartConstruction(0, BuildingType.SurfacePlatform);

        // Assert
        Assert.False(result);
        Assert.Equal(6, gameState.PlanetLookup[0].Structures.Count);
    }

    [Fact]
    public void UpdateConstruction_ProgressesConstruction()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        var building = gameState.PlanetLookup[0].Structures[0];

        // Act
        buildingSystem.UpdateConstruction();

        // Assert
        Assert.Equal(1, building.TurnsRemaining);
        Assert.Equal(BuildingStatus.UnderConstruction, building.Status);
    }

    [Fact]
    public void UpdateConstruction_CompletesConstruction()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        var building = gameState.PlanetLookup[0].Structures[0];

        // Act - Progress 2 turns
        for (int i = 0; i < 2; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        // Assert
        Assert.Equal(0, building.TurnsRemaining);
        Assert.Equal(BuildingStatus.Active, building.Status);
    }

    [Fact]
    public void ScrapBuilding_Refunds50Percent()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Complete construction (2 turns)
        for (int i = 0; i < 2; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        var planet = gameState.PlanetLookup[0];
        var building = planet.Structures[0];
        int creditsBeforeScrap = planet.Resources.Credits;

        // Act
        bool result = buildingSystem.ScrapBuilding(0, building.ID);

        // Assert
        Assert.True(result);
        Assert.Empty(planet.Structures);

        var cost = BuildingCosts.GetCost(BuildingType.DockingBay);
        int expectedRefund = cost.Credits / 2;
        Assert.Equal(creditsBeforeScrap + expectedRefund, planet.Resources.Credits);
    }

    [Fact]
    public void ScrapBuilding_NonexistentBuilding_Fails()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Act
        bool result = buildingSystem.ScrapBuilding(0, 999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void GetBuildings_ReturnsAllBuildings()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.MiningStation);

        // Act
        var buildings = buildingSystem.GetBuildings(0);

        // Assert
        Assert.Equal(2, buildings.Count);
    }

    [Fact]
    public void GetBuildingsUnderConstruction_ReturnsOnlyUnderConstruction()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay); // 2 turns
        buildingSystem.StartConstruction(0, BuildingType.MiningStation); // 3 turns

        // Complete first building (DockingBay), second still has 1 turn left
        for (int i = 0; i < 2; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        // Act
        var underConstruction = buildingSystem.GetBuildingsUnderConstruction(0);

        // Assert
        Assert.Single(underConstruction);
        Assert.Equal(BuildingType.MiningStation, underConstruction[0].Type);
    }

    [Fact]
    public void GetActiveBuildings_ReturnsOnlyActive()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay); // 2 turns
        buildingSystem.StartConstruction(0, BuildingType.MiningStation); // 3 turns

        // Complete first building (DockingBay), second still has 1 turn left
        for (int i = 0; i < 2; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        // Act
        var activeBuildings = buildingSystem.GetActiveBuildings(0);

        // Assert
        Assert.Single(activeBuildings);
        Assert.Equal(BuildingType.DockingBay, activeBuildings[0].Type);
    }

    [Fact]
    public void GetBuildingCount_ReturnsCorrectCount()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Complete both (2 turns)
        for (int i = 0; i < 2; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        // Act
        int count = buildingSystem.GetBuildingCount(0, BuildingType.DockingBay);

        // Assert
        Assert.Equal(2, count);
    }

    [Fact]
    public void CanAffordBuilding_SufficientResources_ReturnsTrue()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Act
        bool canAfford = buildingSystem.CanAffordBuilding(0, BuildingType.DockingBay);

        // Assert
        Assert.True(canAfford);
    }

    [Fact]
    public void CanAffordBuilding_InsufficientResources_ReturnsFalse()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();
        gameState.PlanetLookup[0].Resources.Credits = 100;

        // Act
        bool canAfford = buildingSystem.CanAffordBuilding(0, BuildingType.DockingBay);

        // Assert
        Assert.False(canAfford);
    }

    [Fact]
    public void CanBuild_UnderCapacity_ReturnsTrue()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Act
        bool canBuild = buildingSystem.CanBuild(0, BuildingType.DockingBay);

        // Assert
        Assert.True(canBuild);
    }

    [Fact]
    public void CanBuild_AtCapacity_ReturnsFalse()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Build 3 Docking Bays (max)
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Act
        bool canBuild = buildingSystem.CanBuild(0, BuildingType.DockingBay);

        // Assert
        Assert.False(canBuild);
    }

    [Fact]
    public void OrbitalDefense_UsesDockingBaySlot()
    {
        // Arrange
        var (gameState, buildingSystem) = CreateTestSystems();

        // Build 2 Docking Bays and 1 Orbital Defense
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);
        buildingSystem.StartConstruction(0, BuildingType.OrbitalDefense);

        // Act - Try to build another (should fail, 3/3 orbital slots used)
        bool canBuild = buildingSystem.CanBuild(0, BuildingType.DockingBay);

        // Assert
        Assert.False(canBuild);
    }
}
