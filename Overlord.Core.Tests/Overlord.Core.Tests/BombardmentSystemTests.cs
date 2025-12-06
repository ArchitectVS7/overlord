using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class BombardmentSystemTests
{
    private (GameState gameState, CraftSystem craftSystem, BuildingSystem buildingSystem, BombardmentSystem bombardmentSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add test planet (AI owned)
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Test Planet",
            Owner = FactionType.AI,
            Population = 1000,
            Morale = 80,
            Colonized = true,
            Resources = new ResourceCollection
            {
                Credits = 500000, // Increased for multiple craft purchases
                Minerals = 100000, // Increased for multiple craft purchases
                Fuel = 50000 // Increased for multiple craft purchases (6 cruisers × 5000)
            }
        });

        gameState.RebuildLookups();

        // Initialize faction resources for craft purchases
        gameState.PlayerFaction.Resources.Credits = 1000000;
        gameState.PlayerFaction.Resources.Minerals = 1000000;
        gameState.AIFaction.Resources.Credits = 1000000;
        gameState.AIFaction.Resources.Minerals = 1000000;

        var entitySystem = new EntitySystem(gameState);
        var resourceSystem = new ResourceSystem(gameState);
        var craftSystem = new CraftSystem(gameState, entitySystem, resourceSystem);
        var buildingSystem = new BuildingSystem(gameState);
        var bombardmentSystem = new BombardmentSystem(gameState, new Random(12345)); // Fixed seed for deterministic tests

        return (gameState, craftSystem, buildingSystem, bombardmentSystem);
    }

    [Fact]
    public void BombardPlanet_WithOrbitalControl_SucceedsBombardment()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create Battle Cruisers in orbit
        int cruiser1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int cruiser2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Build some structures to bombard
        buildingSystem.StartConstruction(0, BuildingType.MiningStation);
        buildingSystem.StartConstruction(0, BuildingType.HorticulturalStation);

        // Complete construction
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        int initialStructureCount = gameState.PlanetLookup[0].Structures.Count(s => s.Status == BuildingStatus.Active);
        int initialPopulation = gameState.PlanetLookup[0].Population;

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.PlanetID);
        Assert.Equal(100, result.BombardmentStrength); // 2 cruisers × 50
        Assert.Equal(60, gameState.PlanetLookup[0].Morale); // 80 - 20
        Assert.Equal(10, result.CivilianCasualties); // 100 × 0.1
        Assert.Equal(890, gameState.PlanetLookup[0].Population); // 1000 - 100 (crew for 2 cruisers) - 10 (casualties)
    }

    [Fact]
    public void BombardPlanet_NoOrbitalControl_ReturnsNull()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create mixed fleet (no orbital control)
        int playerCruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int aiCruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.Null(result); // Cannot bombard without orbital control
    }

    [Fact]
    public void BombardPlanet_OwnPlanet_ReturnsNull()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create Battle Cruiser
        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act - Try to bombard own planet
        var result = bombardmentSystem.BombardPlanet(0, FactionType.AI);

        // Assert
        Assert.Null(result); // Cannot bombard own planet
    }

    [Fact]
    public void BombardPlanet_NoBattleCruisers_ReturnsNull()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create Cargo Cruiser (not bombardment capable)
        int cargo = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.Null(result); // No Battle Cruisers
    }

    [Fact]
    public void BombardPlanet_DestroysStructures_MaxThree()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create 6 Battle Cruisers (300 strength = 3 structures destroyed)
        for (int i = 0; i < 6; i++)
        {
            craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        }

        // Build 5 surface structures
        buildingSystem.StartConstruction(0, BuildingType.MiningStation);
        buildingSystem.StartConstruction(0, BuildingType.MiningStation);
        buildingSystem.StartConstruction(0, BuildingType.HorticulturalStation);
        buildingSystem.StartConstruction(0, BuildingType.SurfacePlatform);
        buildingSystem.StartConstruction(0, BuildingType.SurfacePlatform);

        // Complete construction
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        int initialStructureCount = gameState.PlanetLookup[0].Structures.Count(s => s.Status == BuildingStatus.Active);

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(300, result.BombardmentStrength); // 6 × 50
        Assert.Equal(3, result.StructuresDestroyed); // Max 3
        Assert.Equal(3, result.DestroyedStructureIDs.Count);
        int finalStructureCount = gameState.PlanetLookup[0].Structures.Count(s => s.Status == BuildingStatus.Active);
        Assert.Equal(initialStructureCount - 3, finalStructureCount);
    }

    [Fact]
    public void BombardPlanet_IgnoresDockingBays()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create Battle Cruisers
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Build only Docking Bays (immune to bombardment)
        buildingSystem.StartConstruction(0, BuildingType.DockingBay);

        // Complete construction
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        int initialDockingBayCount = gameState.PlanetLookup[0].Structures.Count(s => s.Type == BuildingType.DockingBay);

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.StructuresDestroyed); // No vulnerable structures
        int finalDockingBayCount = gameState.PlanetLookup[0].Structures.Count(s => s.Type == BuildingType.DockingBay);
        Assert.Equal(initialDockingBayCount, finalDockingBayCount); // Docking Bays intact
    }

    [Fact]
    public void BombardPlanet_IgnoresOrbitalDefense()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create Battle Cruisers
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Build Orbital Defense Platform (immune to bombardment)
        buildingSystem.StartConstruction(0, BuildingType.OrbitalDefense);

        // Complete construction
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        int initialDefenseCount = gameState.PlanetLookup[0].Structures.Count(s => s.Type == BuildingType.OrbitalDefense);

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.StructuresDestroyed); // No vulnerable structures
        int finalDefenseCount = gameState.PlanetLookup[0].Structures.Count(s => s.Type == BuildingType.OrbitalDefense);
        Assert.Equal(initialDefenseCount, finalDefenseCount); // Orbital Defense intact
    }

    [Fact]
    public void BombardPlanet_CausesCasualties_TenPercent()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create 4 Battle Cruisers (200 strength)
        for (int i = 0; i < 4; i++)
        {
            craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        }

        int initialPopulation = gameState.PlanetLookup[0].Population;

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.BombardmentStrength);
        Assert.Equal(20, result.CivilianCasualties); // 200 × 0.1
        Assert.Equal(780, gameState.PlanetLookup[0].Population); // 1000 - 200 (crew for 4 cruisers) - 20 (casualties)
    }

    [Fact]
    public void BombardPlanet_ReducesMorale_TwentyPercent()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Create Battle Cruiser
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        int initialMorale = gameState.PlanetLookup[0].Morale;

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(60, result.NewMorale); // 80 - 20
        Assert.Equal(60, gameState.PlanetLookup[0].Morale);
    }

    [Fact]
    public void BombardPlanet_MoraleCannotGoNegative()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        // Set low morale
        gameState.PlanetLookup[0].Morale = 10;

        // Create Battle Cruiser
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        var result = bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(0, result.NewMorale); // 10 - 20 = 0 (clamped)
        Assert.Equal(0, gameState.PlanetLookup[0].Morale);
    }

    [Fact]
    public void BombardPlanet_FiresOnBombardmentStartedEvent()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        int firedPlanetID = -1;
        int firedStrength = -1;
        bombardmentSystem.OnBombardmentStarted += (planetID, strength) =>
        {
            firedPlanetID = planetID;
            firedStrength = strength;
        };

        // Act
        bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.Equal(0, firedPlanetID);
        Assert.Equal(100, firedStrength); // 2 × 50
    }

    [Fact]
    public void BombardPlanet_FiresOnStructureDestroyedEvent()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Build structure
        buildingSystem.StartConstruction(0, BuildingType.MiningStation);
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        var destroyedStructureIDs = new List<int>();
        bombardmentSystem.OnStructureDestroyed += (structureID, planetID) =>
        {
            destroyedStructureIDs.Add(structureID);
        };

        // Act
        bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.Single(destroyedStructureIDs);
    }

    [Fact]
    public void BombardPlanet_FiresOnCivilianCasualtiesEvent()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        int firedPlanetID = -1;
        int firedCasualties = -1;
        bombardmentSystem.OnCivilianCasualties += (planetID, casualties) =>
        {
            firedPlanetID = planetID;
            firedCasualties = casualties;
        };

        // Act
        bombardmentSystem.BombardPlanet(0, FactionType.Player);

        // Assert
        Assert.Equal(0, firedPlanetID);
        Assert.Equal(5, firedCasualties); // 50 × 0.1
    }

    [Fact]
    public void HasOrbitalControl_NoEnemyCraft_ReturnsTrue()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        bool hasControl = bombardmentSystem.HasOrbitalControl(0, FactionType.Player);

        // Assert
        Assert.True(hasControl);
    }

    [Fact]
    public void HasOrbitalControl_EnemyCraftPresent_ReturnsFalse()
    {
        // Arrange
        var (gameState, craftSystem, buildingSystem, bombardmentSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        bool hasControl = bombardmentSystem.HasOrbitalControl(0, FactionType.Player);

        // Assert
        Assert.False(hasControl);
    }
}
