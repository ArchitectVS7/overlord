using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Core.Tests;

public class GameStateTests
{
    [Fact]
    public void GameState_DefaultConstructor_InitializesCorrectly()
    {
        // Arrange & Act
        var gameState = new GameState();

        // Assert
        Assert.Equal(1, gameState.CurrentTurn);
        Assert.Equal(TurnPhase.Income, gameState.CurrentPhase);
        Assert.Empty(gameState.Craft);
        Assert.Empty(gameState.Platoons);
        Assert.Empty(gameState.Planets);
        Assert.NotNull(gameState.PlayerFaction);
        Assert.NotNull(gameState.AIFaction);
    }

    [Fact]
    public void GameState_Validate_EmptyState_ReturnsTrue()
    {
        // Arrange
        var gameState = new GameState();

        // Act
        bool isValid = gameState.Validate();

        // Assert
        Assert.True(isValid);
    }

    [Fact]
    public void GameState_Validate_ExceedsCraftLimit_ReturnsFalse()
    {
        // Arrange
        var gameState = new GameState();
        for (int i = 0; i < 33; i++)
        {
            gameState.Craft.Add(new CraftEntity { ID = i });
        }

        // Act
        bool isValid = gameState.Validate();

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void GameState_Validate_ExceedsPlatoonLimit_ReturnsFalse()
    {
        // Arrange
        var gameState = new GameState();
        for (int i = 0; i < 25; i++)
        {
            gameState.Platoons.Add(new PlatoonEntity { ID = i });
        }

        // Act
        bool isValid = gameState.Validate();

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void GameState_Validate_ExceedsPlanetLimit_ReturnsFalse()
    {
        // Arrange
        var gameState = new GameState();
        for (int i = 0; i < 7; i++)
        {
            gameState.Planets.Add(new PlanetEntity { ID = i });
        }

        // Act
        bool isValid = gameState.Validate();

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void GameState_Validate_DuplicateCraftIDs_ReturnsFalse()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Craft.Add(new CraftEntity { ID = 1 });
        gameState.Craft.Add(new CraftEntity { ID = 1 }); // Duplicate ID

        // Act
        bool isValid = gameState.Validate();

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void GameState_Validate_InvalidTurnNumber_ReturnsFalse()
    {
        // Arrange
        var gameState = new GameState { CurrentTurn = 0 };

        // Act
        bool isValid = gameState.Validate();

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void GameState_RebuildLookups_CreatesCorrectDictionaries()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Craft.Add(new CraftEntity { ID = 1, Name = "Craft1" });
        gameState.Craft.Add(new CraftEntity { ID = 2, Name = "Craft2" });
        gameState.Platoons.Add(new PlatoonEntity { ID = 10, Name = "Platoon1" });
        gameState.Planets.Add(new PlanetEntity { ID = 100, Name = "Planet1" });

        // Act
        gameState.RebuildLookups();

        // Assert
        Assert.Equal(2, gameState.CraftLookup.Count);
        Assert.Equal(1, gameState.PlatoonLookup.Count);
        Assert.Equal(1, gameState.PlanetLookup.Count);
        Assert.Equal("Craft1", gameState.CraftLookup[1].Name);
        Assert.Equal("Platoon1", gameState.PlatoonLookup[10].Name);
        Assert.Equal("Planet1", gameState.PlanetLookup[100].Name);
    }

    [Fact]
    public void ResourceCollection_Add_UpdatesCorrectly()
    {
        // Arrange
        var resources = new ResourceCollection
        {
            Credits = 100,
            Minerals = 50
        };
        var delta = new ResourceDelta
        {
            Credits = 25,
            Minerals = -10
        };

        // Act
        resources.Add(delta);

        // Assert
        Assert.Equal(125, resources.Credits);
        Assert.Equal(40, resources.Minerals);
    }

    [Fact]
    public void ResourceCollection_CanAfford_SufficientResources_ReturnsTrue()
    {
        // Arrange
        var resources = new ResourceCollection
        {
            Credits = 100,
            Minerals = 50,
            Fuel = 30
        };
        var delta = new ResourceDelta
        {
            Credits = -50,
            Minerals = -25,
            Fuel = -10
        };

        // Act
        bool canAfford = resources.CanAfford(delta);

        // Assert
        Assert.True(canAfford);
    }

    [Fact]
    public void ResourceCollection_CanAfford_InsufficientResources_ReturnsFalse()
    {
        // Arrange
        var resources = new ResourceCollection
        {
            Credits = 100,
            Minerals = 50
        };
        var delta = new ResourceDelta
        {
            Credits = -150, // Would go negative
            Minerals = -25
        };

        // Act
        bool canAfford = resources.CanAfford(delta);

        // Assert
        Assert.False(canAfford);
    }

    [Fact]
    public void ResourceDelta_IsZero_AllZeros_ReturnsTrue()
    {
        // Arrange
        var delta = new ResourceDelta();

        // Act & Assert
        Assert.True(delta.IsZero);
    }

    [Fact]
    public void ResourceDelta_IsPositive_AllPositive_ReturnsTrue()
    {
        // Arrange
        var delta = new ResourceDelta
        {
            Credits = 10,
            Minerals = 5,
            Fuel = 0 // Zero is considered positive
        };

        // Act & Assert
        Assert.True(delta.IsPositive);
    }

    [Fact]
    public void ResourceDelta_IsPositive_HasNegative_ReturnsFalse()
    {
        // Arrange
        var delta = new ResourceDelta
        {
            Credits = 10,
            Minerals = -5
        };

        // Act & Assert
        Assert.False(delta.IsPositive);
    }
}
