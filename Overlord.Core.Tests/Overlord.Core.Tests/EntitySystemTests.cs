using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class EntitySystemTests
{
    private GameState CreateTestGameState()
    {
        var gameState = new GameState();

        // Add test planets
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Earth",
            Owner = FactionType.Player,
            Position = new Position3D(0, 0, 0),
            Population = 1000,
            Colonized = true
        });

        gameState.Planets.Add(new PlanetEntity
        {
            ID = 1,
            Name = "Mars",
            Owner = FactionType.Player,
            Position = new Position3D(100, 50, 0),
            Population = 500,
            Colonized = true
        });

        gameState.RebuildLookups();
        return gameState;
    }

    [Fact]
    public void Constructor_InitializesNextIDsFromExistingEntities()
    {
        // Arrange
        var gameState = CreateTestGameState();
        gameState.Craft.Add(new CraftEntity { ID = 5, Type = CraftType.BattleCruiser, Owner = FactionType.Player, PlanetID = 0 });
        gameState.Platoons.Add(new PlatoonEntity { ID = 3, Owner = FactionType.Player, PlanetID = 0 });
        gameState.RebuildLookups();

        // Act
        var entitySystem = new EntitySystem(gameState);
        int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoonID = entitySystem.CreatePlatoon(0, FactionType.Player);

        // Assert
        Assert.Equal(6, craftID); // Next ID after 5
        Assert.Equal(4, platoonID); // Next ID after 3
    }

    [Fact]
    public void CreateCraft_CreatesNewCraft()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act
        int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player, "USS Enterprise");

        // Assert
        Assert.Equal(0, craftID);
        Assert.Single(gameState.Craft);
        Assert.Equal("USS Enterprise", gameState.Craft[0].Name);
        Assert.Equal(CraftType.BattleCruiser, gameState.Craft[0].Type);
        Assert.Equal(FactionType.Player, gameState.Craft[0].Owner);
        Assert.Equal(0, gameState.Craft[0].PlanetID);
        Assert.False(gameState.Craft[0].InTransit);
    }

    [Fact]
    public void CreateCraft_GeneratesDefaultName()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act
        int id1 = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int id2 = entitySystem.CreateCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        int id3 = entitySystem.CreateCraft(CraftType.SolarSatellite, 0, FactionType.Player);
        int id4 = entitySystem.CreateCraft(CraftType.AtmosphereProcessor, 0, FactionType.Player);

        // Assert
        Assert.Equal("BC-000", gameState.Craft[0].Name);
        Assert.Equal("CC-001", gameState.Craft[1].Name);
        Assert.Equal("SS-002", gameState.Craft[2].Name);
        Assert.Equal("AP-003", gameState.Craft[3].Name);
    }

    [Fact]
    public void CreateCraft_SetsCraftPositionToPlanetPosition()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act
        int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 1, FactionType.Player);

        // Assert
        var craft = gameState.Craft[0];
        var planet = gameState.PlanetLookup[1];
        Assert.Equal(planet.Position.X, craft.Position.X);
        Assert.Equal(planet.Position.Y, craft.Position.Y);
        Assert.Equal(planet.Position.Z, craft.Position.Z);
    }

    [Fact]
    public void CreateCraft_RespectsMaxLimit()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act - Create 32 craft (max limit)
        for (int i = 0; i < EntitySystem.MaxCraft; i++)
        {
            int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
            Assert.NotEqual(-1, craftID);
        }

        // Act - Try to create 33rd craft
        int failedID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Assert
        Assert.Equal(-1, failedID);
        Assert.Equal(32, gameState.Craft.Count);
    }

    [Fact]
    public void CanCreateCraft_ReturnsTrueWhenUnderLimit()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Assert
        Assert.True(entitySystem.CanCreateCraft());
    }

    [Fact]
    public void CanCreateCraft_ReturnsFalseWhenAtLimit()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act - Fill to max
        for (int i = 0; i < EntitySystem.MaxCraft; i++)
        {
            entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        }

        // Assert
        Assert.False(entitySystem.CanCreateCraft());
    }

    [Fact]
    public void DestroyCraft_RemovesCraft()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        bool result = entitySystem.DestroyCraft(craftID);

        // Assert
        Assert.True(result);
        Assert.Empty(gameState.Craft);
    }

    [Fact]
    public void DestroyCraft_ReturnsFalseForNonexistentCraft()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act
        bool result = entitySystem.DestroyCraft(999);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void CreateCraft_FiresOnCraftCreatedEvent()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        int firedCraftID = -1;
        entitySystem.OnCraftCreated += (id) => firedCraftID = id;

        // Act
        int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Assert
        Assert.Equal(craftID, firedCraftID);
    }

    [Fact]
    public void DestroyCraft_FiresOnCraftDestroyedEvent()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        int craftID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int firedCraftID = -1;
        entitySystem.OnCraftDestroyed += (id) => firedCraftID = id;

        // Act
        entitySystem.DestroyCraft(craftID);

        // Assert
        Assert.Equal(craftID, firedCraftID);
    }

    [Fact]
    public void GetCraft_ReturnsCraftByOwner()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        entitySystem.CreateCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        var playerCraft = entitySystem.GetCraft(FactionType.Player);
        var aiCraft = entitySystem.GetCraft(FactionType.AI);

        // Assert
        Assert.Equal(2, playerCraft.Count);
        Assert.Single(aiCraft);
    }

    [Fact]
    public void GetCraftAtPlanet_ReturnsCraftAtSpecificPlanet()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        entitySystem.CreateCraft(CraftType.CargoCruiser, 1, FactionType.Player);

        // Create in-transit craft (should not be returned)
        int transitID = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        gameState.Craft.First(c => c.ID == transitID).InTransit = true;

        // Act
        var craftAtPlanet0 = entitySystem.GetCraftAtPlanet(0);
        var craftAtPlanet1 = entitySystem.GetCraftAtPlanet(1);

        // Assert
        Assert.Single(craftAtPlanet0); // Only one non-transit craft
        Assert.Single(craftAtPlanet1);
    }

    [Fact]
    public void GetCraftInTransit_ReturnsOnlyTransitCraft()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        int id1 = entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int id2 = entitySystem.CreateCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        gameState.Craft.First(c => c.ID == id2).InTransit = true;

        // Act
        var transitCraft = entitySystem.GetCraftInTransit();

        // Assert
        Assert.Single(transitCraft);
        Assert.Equal(id2, transitCraft[0].ID);
    }

    [Fact]
    public void CreatePlatoon_CreatesNewPlatoon()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act
        int platoonID = entitySystem.CreatePlatoon(0, FactionType.Player, 100, "Alpha Squad");

        // Assert
        Assert.Equal(0, platoonID);
        Assert.Single(gameState.Platoons);
        Assert.Equal("Alpha Squad", gameState.Platoons[0].Name);
        Assert.Equal(FactionType.Player, gameState.Platoons[0].Owner);
        Assert.Equal(0, gameState.Platoons[0].PlanetID);
        Assert.Equal(100, gameState.Platoons[0].Strength);
    }

    [Fact]
    public void CreatePlatoon_GeneratesDefaultName()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(0, FactionType.Player);

        // Assert
        Assert.Equal("Platoon-000", gameState.Platoons[0].Name);
        Assert.Equal("Platoon-001", gameState.Platoons[1].Name);
    }

    [Fact]
    public void CreatePlatoon_RespectsMaxLimit()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);

        // Act - Create 24 platoons (max limit)
        for (int i = 0; i < EntitySystem.MaxPlatoons; i++)
        {
            int platoonID = entitySystem.CreatePlatoon(0, FactionType.Player);
            Assert.NotEqual(-1, platoonID);
        }

        // Act - Try to create 25th platoon
        int failedID = entitySystem.CreatePlatoon(0, FactionType.Player);

        // Assert
        Assert.Equal(-1, failedID);
        Assert.Equal(24, gameState.Platoons.Count);
    }

    [Fact]
    public void DestroyPlatoon_RemovesPlatoon()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        int platoonID = entitySystem.CreatePlatoon(0, FactionType.Player);

        // Act
        bool result = entitySystem.DestroyPlatoon(platoonID);

        // Assert
        Assert.True(result);
        Assert.Empty(gameState.Platoons);
    }

    [Fact]
    public void GetPlatoons_ReturnsPlatoonsByOwner()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(0, FactionType.AI);

        // Act
        var playerPlatoons = entitySystem.GetPlatoons(FactionType.Player);
        var aiPlatoons = entitySystem.GetPlatoons(FactionType.AI);

        // Assert
        Assert.Equal(2, playerPlatoons.Count);
        Assert.Single(aiPlatoons);
    }

    [Fact]
    public void GetPlatoonsAtPlanet_ReturnsPlatoonsAtSpecificPlanet()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(1, FactionType.Player);

        // Act
        var platoonsAtPlanet0 = entitySystem.GetPlatoonsAtPlanet(0);
        var platoonsAtPlanet1 = entitySystem.GetPlatoonsAtPlanet(1);

        // Assert
        Assert.Equal(2, platoonsAtPlanet0.Count);
        Assert.Single(platoonsAtPlanet1);
    }

    [Fact]
    public void GetCraftCount_ReturnsCorrectCount()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        entitySystem.CreateCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        entitySystem.CreateCraft(CraftType.CargoCruiser, 0, FactionType.AI);

        // Act
        int totalCount = entitySystem.GetCraftCount();
        int playerCount = entitySystem.GetCraftCount(FactionType.Player);
        int aiCount = entitySystem.GetCraftCount(FactionType.AI);

        // Assert
        Assert.Equal(2, totalCount);
        Assert.Equal(1, playerCount);
        Assert.Equal(1, aiCount);
    }

    [Fact]
    public void GetPlatoonCount_ReturnsCorrectCount()
    {
        // Arrange
        var gameState = CreateTestGameState();
        var entitySystem = new EntitySystem(gameState);
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(0, FactionType.Player);
        entitySystem.CreatePlatoon(0, FactionType.AI);

        // Act
        int totalCount = entitySystem.GetPlatoonCount();
        int playerCount = entitySystem.GetPlatoonCount(FactionType.Player);
        int aiCount = entitySystem.GetPlatoonCount(FactionType.AI);

        // Assert
        Assert.Equal(3, totalCount);
        Assert.Equal(2, playerCount);
        Assert.Equal(1, aiCount);
    }
}
