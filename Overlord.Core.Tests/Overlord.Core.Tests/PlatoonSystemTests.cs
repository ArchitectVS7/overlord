using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class PlatoonSystemTests
{
    private (GameState gameState, EntitySystem entitySystem, PlatoonSystem platoonSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add Starbase (planet 0)
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Starbase",
            Owner = FactionType.Player,
            Population = 10000,
            Colonized = true,
            Resources = new ResourceCollection
            {
                Credits = 1000000,
                Minerals = 50000,
                Fuel = 20000
            }
        });

        gameState.RebuildLookups();

        var entitySystem = new EntitySystem(gameState);
        var platoonSystem = new PlatoonSystem(gameState, entitySystem);

        return (gameState, entitySystem, platoonSystem);
    }

    [Fact]
    public void CommissionPlatoon_Success()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();

        // Act
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Assert
        Assert.NotEqual(-1, platoonID);
        Assert.Single(gameState.Platoons);
        var platoon = gameState.Platoons[0];
        Assert.Equal(100, platoon.TroopCount);
        Assert.Equal(EquipmentLevel.Standard, platoon.Equipment);
        Assert.Equal(WeaponLevel.Rifle, platoon.Weapon);
        Assert.Equal(0, platoon.TrainingLevel);
        Assert.Equal(10, platoon.TrainingTurnsRemaining); // Training at Starbase
    }

    [Fact]
    public void CommissionPlatoon_DeductsCostAndTroops()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        var planet = gameState.PlanetLookup[0];
        int initialCredits = planet.Resources.Credits;
        int initialPop = planet.Population;

        // Act
        platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Assert
        int expectedCost = PlatoonCosts.GetTotalCost(EquipmentLevel.Standard, WeaponLevel.Rifle);
        Assert.Equal(initialCredits - expectedCost, planet.Resources.Credits);
        Assert.Equal(initialPop - 100, planet.Population);
    }

    [Fact]
    public void CommissionPlatoon_InsufficientCredits_Fails()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        gameState.PlanetLookup[0].Resources.Credits = 1000;

        // Act
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Elite, WeaponLevel.Plasma);

        // Assert
        Assert.Equal(-1, platoonID);
        Assert.Empty(gameState.Platoons);
    }

    [Fact]
    public void CommissionPlatoon_InsufficientPopulation_Fails()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        gameState.PlanetLookup[0].Population = 50;

        // Act
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Basic, WeaponLevel.Rifle);

        // Assert
        Assert.Equal(-1, platoonID);
        Assert.Empty(gameState.Platoons);
    }

    [Fact]
    public void DecommissionPlatoon_ReturnsTroops()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Basic, WeaponLevel.Rifle);
        int popAfterCommission = gameState.PlanetLookup[0].Population;

        // Act
        bool result = platoonSystem.DecommissionPlatoon(platoonID);

        // Assert
        Assert.True(result);
        Assert.Empty(gameState.Platoons);
        Assert.Equal(popAfterCommission + 100, gameState.PlanetLookup[0].Population);
    }

    [Fact]
    public void UpdateTraining_ProgressesTraining()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Basic, WeaponLevel.Rifle);

        // Act
        platoonSystem.UpdateTraining();

        // Assert
        var platoon = gameState.PlatoonLookup[platoonID];
        Assert.Equal(10, platoon.TrainingLevel); // 10% after 1 turn
        Assert.Equal(9, platoon.TrainingTurnsRemaining);
    }

    [Fact]
    public void UpdateTraining_CompleteTraining()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Basic, WeaponLevel.Rifle);

        // Act - Train for 10 turns
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        // Assert
        var platoon = gameState.PlatoonLookup[platoonID];
        Assert.Equal(100, platoon.TrainingLevel);
        Assert.Equal(0, platoon.TrainingTurnsRemaining);
        Assert.True(platoon.IsFullyTrained);
    }

    [Fact]
    public void CalculateMilitaryStrength_Correct()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Train to 100%
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        // Act
        var platoon = gameState.PlatoonLookup[platoonID];
        int strength = platoonSystem.CalculateMilitaryStrength(platoon);

        // Assert
        // Formula: 100 troops × 1.5 equipment × 1.0 weapon × 1.0 training = 150
        Assert.Equal(150, strength);
    }

    [Fact]
    public void CalculateMilitaryStrength_PartiallyTrained()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        int platoonID = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Train to 50%
        for (int i = 0; i < 5; i++)
        {
            platoonSystem.UpdateTraining();
        }

        // Act
        var platoon = gameState.PlatoonLookup[platoonID];
        int strength = platoonSystem.CalculateMilitaryStrength(platoon);

        // Assert
        // Formula: 100 troops × 1.5 equipment × 1.0 weapon × 0.5 training = 75
        Assert.Equal(75, strength);
    }

    [Fact]
    public void GetTotalMilitaryStrength_SumsAllPlatoons()
    {
        // Arrange
        var (gameState, entitySystem, platoonSystem) = CreateTestSystems();
        platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Basic, WeaponLevel.Rifle);
        platoonSystem.CommissionPlatoon(0, FactionType.Player, 150, EquipmentLevel.Standard, WeaponLevel.AssaultRifle);

        // Train both to 100%
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        // Act
        int totalStrength = platoonSystem.GetTotalMilitaryStrength(FactionType.Player);

        // Assert
        // Platoon 1: 100 × 1.0 × 1.0 × 1.0 = 100
        // Platoon 2: 150 × 1.5 × 1.3 × 1.0 = 292
        Assert.Equal(392, totalStrength);
    }
}
