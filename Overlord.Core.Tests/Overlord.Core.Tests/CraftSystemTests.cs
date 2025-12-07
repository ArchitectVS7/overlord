using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class CraftSystemTests
{
    private (GameState gameState, EntitySystem entitySystem, ResourceSystem resourceSystem, CraftSystem craftSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add test planets
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Earth",
            Owner = FactionType.Player,
            Type = PlanetType.Metropolis,
            Position = new Position3D(0, 0, 0),
            Population = 1000,
            Colonized = true,
            Resources = new ResourceCollection
            {
                Credits = 100000,
                Minerals = 50000,
                Fuel = 20000,
                Food = 10000,
                Energy = 5000
            }
        });

        gameState.Planets.Add(new PlanetEntity
        {
            ID = 1,
            Name = "Mars",
            Owner = FactionType.Player,
            Type = PlanetType.Desert,
            Position = new Position3D(100, 50, 0),
            Population = 500,
            Colonized = false,
            Resources = new ResourceCollection
            {
                Credits = 50000,
                Minerals = 25000,
                Fuel = 10000,
                Food = 5000,
                Energy = 2000
            }
        });

        gameState.RebuildLookups();

        var entitySystem = new EntitySystem(gameState);
        var resourceSystem = new ResourceSystem(gameState);
        var craftSystem = new CraftSystem(gameState, entitySystem, resourceSystem);

        return (gameState, entitySystem, resourceSystem, craftSystem);
    }

    #region Purchase Tests

    [Fact]
    public void PurchaseCraft_BattleCruiser_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();

        // Act
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Assert
        Assert.NotEqual(-1, craftID);
        Assert.Single(gameState.Craft);
        Assert.Equal(CraftType.BattleCruiser, gameState.Craft[0].Type);
        Assert.Equal(0, gameState.Craft[0].PlanetID);

        // Check resources deducted
        var planet = gameState.PlanetLookup[0];
        Assert.Equal(50000, planet.Resources.Credits); // 100000 - 50000
        Assert.Equal(40000, planet.Resources.Minerals); // 50000 - 10000
        Assert.Equal(15000, planet.Resources.Fuel); // 20000 - 5000

        // Check crew deducted
        Assert.Equal(950, planet.Population); // 1000 - 50
    }

    [Fact]
    public void PurchaseCraft_InsufficientResources_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];
        planet.Resources.Credits = 10000; // Not enough for Battle Cruiser

        // Act
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Assert
        Assert.Equal(-1, craftID);
        Assert.Empty(gameState.Craft);
    }

    [Fact]
    public void PurchaseCraft_InsufficientCrew_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];
        planet.Population = 30; // Not enough for Battle Cruiser (needs 50)

        // Act
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Assert
        Assert.Equal(-1, craftID);
        Assert.Empty(gameState.Craft);
    }

    [Fact]
    public void PurchaseCraft_FleetLimitReached_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();

        // Fill fleet to max (32)
        for (int i = 0; i < EntitySystem.MaxCraft; i++)
        {
            entitySystem.CreateCraft(CraftType.SolarSatellite, 0, FactionType.Player);
        }

        // Act
        int craftID = craftSystem.PurchaseCraft(CraftType.SolarSatellite, 0, FactionType.Player);

        // Assert
        Assert.Equal(-1, craftID);
        Assert.Equal(32, gameState.Craft.Count);
    }

    [Fact]
    public void PurchaseCraft_FiresOnCraftPurchasedEvent()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int firedCraftID = -1;
        craftSystem.OnCraftPurchased += (id) => firedCraftID = id;

        // Act
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);

        // Assert
        Assert.Equal(craftID, firedCraftID);
    }

    [Fact]
    public void PurchaseCraft_AllTypes_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();

        // Increase credits to afford all 4 craft types
        gameState.PlanetLookup[0].Resources.Credits = 200000;

        // Act & Assert - Battle Cruiser
        int bc = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        Assert.NotEqual(-1, bc);

        // Act & Assert - Cargo Cruiser
        int cc = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        Assert.NotEqual(-1, cc);

        // Act & Assert - Solar Satellite
        int ss = craftSystem.PurchaseCraft(CraftType.SolarSatellite, 0, FactionType.Player);
        Assert.NotEqual(-1, ss);

        // Act & Assert - Atmosphere Processor
        int ap = craftSystem.PurchaseCraft(CraftType.AtmosphereProcessor, 0, FactionType.Player);
        Assert.NotEqual(-1, ap);

        Assert.Equal(4, gameState.Craft.Count);
    }

    #endregion

    #region Scrap Tests

    [Fact]
    public void ScrapCraft_Refunds50PercentAndReturnsCrew()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        var planet = gameState.PlanetLookup[0];
        int resourcesBefore = planet.Resources.Credits;
        int popBefore = planet.Population;

        // Act
        bool result = craftSystem.ScrapCraft(craftID);

        // Assert
        Assert.True(result);
        Assert.Empty(gameState.Craft);

        // Check 50% refund
        Assert.Equal(resourcesBefore + 25000, planet.Resources.Credits); // 50% of 50000
        Assert.Equal(popBefore + 50, planet.Population); // Crew returned
    }

    [Fact]
    public void ScrapCraft_InTransit_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        gameState.Craft[0].InTransit = true;

        // Act
        bool result = craftSystem.ScrapCraft(craftID);

        // Assert
        Assert.False(result);
        Assert.Single(gameState.Craft); // Still exists
    }

    [Fact]
    public void ScrapCraft_NonexistentCraft_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();

        // Act
        bool result = craftSystem.ScrapCraft(999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void ScrapCraft_FiresOnCraftScrappedEvent()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        int firedCraftID = -1;
        craftSystem.OnCraftScrapped += (id) => firedCraftID = id;

        // Act
        craftSystem.ScrapCraft(craftID);

        // Assert
        Assert.Equal(craftID, firedCraftID);
    }

    #endregion

    #region Platoon Embark/Disembark Tests

    [Fact]
    public void EmbarkPlatoons_BattleCruiser_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon1 = entitySystem.CreatePlatoon(0, FactionType.Player);
        int platoon2 = entitySystem.CreatePlatoon(0, FactionType.Player);

        // Act
        bool result = craftSystem.EmbarkPlatoons(craftID, new List<int> { platoon1, platoon2 });

        // Assert
        Assert.True(result);
        var craft = gameState.CraftLookup[craftID];
        Assert.Equal(2, craft.CarriedPlatoonIDs.Count);
        Assert.Equal(-1, gameState.PlatoonLookup[platoon1].PlanetID); // No longer at planet
        Assert.Equal(-1, gameState.PlatoonLookup[platoon2].PlanetID);
    }

    [Fact]
    public void EmbarkPlatoons_ExceedsCapacity_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Create 5 platoons (exceeds max of 4)
        var platoonIDs = new List<int>();
        for (int i = 0; i < 5; i++)
        {
            platoonIDs.Add(entitySystem.CreatePlatoon(0, FactionType.Player));
        }

        // Act
        bool result = craftSystem.EmbarkPlatoons(craftID, platoonIDs);

        // Assert
        Assert.False(result);
        Assert.Empty(gameState.CraftLookup[craftID].CarriedPlatoonIDs);
    }

    [Fact]
    public void EmbarkPlatoons_NonBattleCruiser_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        int platoonID = entitySystem.CreatePlatoon(0, FactionType.Player);

        // Act
        bool result = craftSystem.EmbarkPlatoons(craftID, new List<int> { platoonID });

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void EmbarkPlatoons_PlatoonNotAtSamePlanet_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoonID = entitySystem.CreatePlatoon(1, FactionType.Player); // Different planet

        // Act
        bool result = craftSystem.EmbarkPlatoons(craftID, new List<int> { platoonID });

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void DisembarkPlatoons_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon1 = entitySystem.CreatePlatoon(0, FactionType.Player);
        int platoon2 = entitySystem.CreatePlatoon(0, FactionType.Player);
        craftSystem.EmbarkPlatoons(craftID, new List<int> { platoon1, platoon2 });

        // Act
        bool result = craftSystem.DisembarkPlatoons(craftID, new List<int> { platoon1 });

        // Assert
        Assert.True(result);
        var craft = gameState.CraftLookup[craftID];
        Assert.Single(craft.CarriedPlatoonIDs); // Only platoon2 remains
        Assert.Equal(0, gameState.PlatoonLookup[platoon1].PlanetID); // Back at planet
    }

    [Fact]
    public void DisembarkPlatoons_InTransit_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoonID = entitySystem.CreatePlatoon(0, FactionType.Player);
        craftSystem.EmbarkPlatoons(craftID, new List<int> { platoonID });
        gameState.CraftLookup[craftID].InTransit = true;

        // Act
        bool result = craftSystem.DisembarkPlatoons(craftID, new List<int> { platoonID });

        // Assert
        Assert.False(result);
    }

    #endregion

    #region Cargo Load/Unload Tests

    [Fact]
    public void LoadCargo_CargoCruiser_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        var cargo = new ResourceDelta { Food = 500, Minerals = 300 };

        // Act
        bool result = craftSystem.LoadCargo(craftID, cargo);

        // Assert
        Assert.True(result);
        var craft = gameState.CraftLookup[craftID];
        Assert.Equal(500, craft.CargoHold!.Food);
        Assert.Equal(300, craft.CargoHold.Minerals);

        // Check planet resources deducted
        var planet = gameState.PlanetLookup[0];
        Assert.Equal(9500, planet.Resources.Food); // 10000 - 500
        Assert.Equal(44700, planet.Resources.Minerals); // 50000 - 5000 (purchase) - 300 (cargo)
    }

    [Fact]
    public void LoadCargo_ExceedsCapacity_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        var cargo = new ResourceDelta { Food = 1500 }; // Exceeds 1000 capacity

        // Act
        bool result = craftSystem.LoadCargo(craftID, cargo);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void LoadCargo_NonCargoCruiser_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        var cargo = new ResourceDelta { Food = 100 };

        // Act
        bool result = craftSystem.LoadCargo(craftID, cargo);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void LoadCargo_InsufficientPlanetResources_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        var cargo = new ResourceDelta { Food = 50000 }; // More than planet has

        // Act
        bool result = craftSystem.LoadCargo(craftID, cargo);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void UnloadCargo_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        var cargo = new ResourceDelta { Food = 500, Minerals = 300 };
        craftSystem.LoadCargo(craftID, cargo);

        // Act
        bool result = craftSystem.UnloadCargo(craftID, new ResourceDelta { Food = 200 });

        // Assert
        Assert.True(result);
        var craft = gameState.CraftLookup[craftID];
        Assert.Equal(300, craft.CargoHold!.Food); // 500 - 200
        Assert.Equal(300, craft.CargoHold.Minerals); // Unchanged
    }

    [Fact]
    public void UnloadCargo_InsufficientCargo_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        var cargo = new ResourceDelta { Food = 100 };
        craftSystem.LoadCargo(craftID, cargo);

        // Act
        bool result = craftSystem.UnloadCargo(craftID, new ResourceDelta { Food = 200 }); // More than loaded

        // Assert
        Assert.False(result);
    }

    #endregion

    #region Solar Satellite Tests

    [Fact]
    public void DeploySolarSatellite_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.SolarSatellite, 0, FactionType.Player);

        // Act
        bool result = craftSystem.DeploySolarSatellite(craftID);

        // Assert
        Assert.True(result);
        var craft = gameState.CraftLookup[craftID];
        Assert.Equal(0, craft.DeployedAtPlanetID);
        Assert.True(craft.Active); // Planet has >5 population
    }

    [Fact]
    public void DeploySolarSatellite_InsufficientCrew_Inactive()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.SolarSatellite, 0, FactionType.Player);

        // Reduce population after purchase
        var planet = gameState.PlanetLookup[0];
        planet.Population = 3; // Less than 5 required

        // Act
        bool result = craftSystem.DeploySolarSatellite(craftID);

        // Assert
        Assert.True(result); // Deployment succeeds
        var craft = gameState.CraftLookup[craftID];
        Assert.False(craft.Active); // But inactive due to insufficient crew
    }

    [Fact]
    public void DeploySolarSatellite_NonSolarSatellite_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        bool result = craftSystem.DeploySolarSatellite(craftID);

        // Assert
        Assert.False(result);
    }

    #endregion

    #region Atmosphere Processor Tests

    [Fact]
    public void DeployAtmosphereProcessor_Success()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.AtmosphereProcessor, 1, FactionType.Player);

        // Act
        bool result = craftSystem.DeployAtmosphereProcessor(craftID);

        // Assert
        Assert.True(result);
        var planet = gameState.PlanetLookup[1];
        Assert.Equal(10, planet.TerraformingProgress); // Terraforming started
        Assert.Empty(gameState.Craft); // Craft destroyed (one-time use)
    }

    [Fact]
    public void DeployAtmosphereProcessor_AlreadyColonized_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.AtmosphereProcessor, 0, FactionType.Player);

        // Act
        bool result = craftSystem.DeployAtmosphereProcessor(craftID);

        // Assert
        Assert.False(result); // Earth is already colonized
        Assert.Single(gameState.Craft); // Craft not destroyed
    }

    [Fact]
    public void DeployAtmosphereProcessor_NonAtmosphereProcessor_Fails()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 1, FactionType.Player);

        // Act
        bool result = craftSystem.DeployAtmosphereProcessor(craftID);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void DeployAtmosphereProcessor_FiresEvent()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        int craftID = craftSystem.PurchaseCraft(CraftType.AtmosphereProcessor, 1, FactionType.Player);
        int firedPlanetID = -1;
        int firedCraftID = -1;
        craftSystem.OnAtmosphereProcessorDeployed += (planetID, cid) =>
        {
            firedPlanetID = planetID;
            firedCraftID = cid;
        };

        // Act
        craftSystem.DeployAtmosphereProcessor(craftID);

        // Assert
        Assert.Equal(1, firedPlanetID);
        Assert.Equal(craftID, firedCraftID);
    }

    #endregion

    #region Query Methods Tests

    [Fact]
    public void GetCraft_ReturnsCraftByOwner()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        var playerCraft = craftSystem.GetCraft(FactionType.Player);
        var aiCraft = craftSystem.GetCraft(FactionType.AI);

        // Assert
        Assert.Equal(2, playerCraft.Count);
        Assert.Single(aiCraft);
    }

    [Fact]
    public void CanPurchaseCraft_ReturnsTrueWhenUnderLimit()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();

        // Assert
        Assert.True(craftSystem.CanPurchaseCraft());
    }

    [Fact]
    public void CanPurchaseCraft_ReturnsFalseWhenAtLimit()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();

        // Fill to max
        for (int i = 0; i < EntitySystem.MaxCraft; i++)
        {
            entitySystem.CreateCraft(CraftType.SolarSatellite, 0, FactionType.Player);
        }

        // Assert
        Assert.False(craftSystem.CanPurchaseCraft());
    }

    [Fact]
    public void GetFleetCount_ReturnsCorrectCounts()
    {
        // Arrange
        var (gameState, entitySystem, resourceSystem, craftSystem) = CreateTestSystems();
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        int totalCount = craftSystem.GetFleetCount();
        int playerCount = craftSystem.GetFleetCount(FactionType.Player);
        int aiCount = craftSystem.GetFleetCount(FactionType.AI);

        // Assert
        Assert.Equal(3, totalCount);
        Assert.Equal(2, playerCount);
        Assert.Equal(1, aiCount);
    }

    #endregion
}
