using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class InvasionSystemTests
{
    private (GameState gameState, PlatoonSystem platoonSystem, CraftSystem craftSystem, CombatSystem combatSystem, InvasionSystem invasionSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add test planet (AI owned, with resources)
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Test Planet",
            Owner = FactionType.AI,
            Population = 500,
            Morale = 80,
            Colonized = true,
            Resources = new ResourceCollection
            {
                Credits = 500000, // Increased for craft purchases
                Minerals = 100000, // Increased for craft purchases
                Fuel = 50000, // Increased for craft purchases
                Food = 10000
            }
        });

        gameState.RebuildLookups();

        // Initialize faction resources for craft and platoon purchases
        gameState.PlayerFaction.Resources.Credits = 1000000;
        gameState.PlayerFaction.Resources.Minerals = 1000000;
        gameState.AIFaction.Resources.Credits = 1000000;
        gameState.AIFaction.Resources.Minerals = 1000000;

        var entitySystem = new EntitySystem(gameState);
        var resourceSystem = new ResourceSystem(gameState);
        var platoonSystem = new PlatoonSystem(gameState, entitySystem);
        var craftSystem = new CraftSystem(gameState, entitySystem, resourceSystem);
        var combatSystem = new CombatSystem(gameState, platoonSystem);
        var invasionSystem = new InvasionSystem(gameState, combatSystem);

        return (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem);
    }

    [Fact]
    public void InvadePlanet_UndefendedPlanet_InstantSurrender()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Create Battle Cruiser with platoons
        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        int initialCredits = gameState.PlayerFaction.Resources.Credits;

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.AttackerWins);
        Assert.True(result.PlanetCaptured);
        Assert.True(result.InstantSurrender);
        Assert.Equal(0, result.AttackerCasualties);
        Assert.Equal(0, result.DefenderCasualties);
        Assert.Equal(FactionType.Player, gameState.PlanetLookup[0].Owner);
        Assert.Equal(385000, result.CapturedResources!.Credits); // 500k - 50k (cruiser) - 65k (platoon) = 385k
    }

    [Fact]
    public void InvadePlanet_SuccessfulInvasion_CapturesPlanet()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Create attacking force
        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        // Remove all defenders to ensure capture
        var defenders = gameState.Platoons.Where(p => p.Owner == FactionType.AI).ToList();
        foreach (var d in defenders)
        {
            gameState.Platoons.Remove(d);
        }
        gameState.RebuildLookups();

        // Train platoon
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        int initialOwner = gameState.PlanetLookup[0].Owner == FactionType.AI ? 1 : 0;

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.AttackerWins);
        Assert.True(result.PlanetCaptured);
        Assert.True(result.InstantSurrender); // No defenders = instant surrender
        Assert.Equal(FactionType.Player, gameState.PlanetLookup[0].Owner);
    }

    [Fact]
    public void InvadePlanet_FailedInvasion_PlanetStaysWithDefender()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Create weak attacking force
        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int attacker = platoonSystem.CommissionPlatoon(0, FactionType.Player, 50, EquipmentLevel.Civilian, WeaponLevel.Pistol);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { attacker });

        // Create strong defender
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 150, EquipmentLevel.Elite, WeaponLevel.Plasma);
        int defender2 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 120, EquipmentLevel.Advanced, WeaponLevel.AssaultRifle);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.False(result.AttackerWins);
        Assert.False(result.PlanetCaptured);
        Assert.Equal(FactionType.AI, gameState.PlanetLookup[0].Owner); // Still AI owned
    }

    [Fact]
    public void InvadePlanet_OwnPlanet_ReturnsNull()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Create Battle Cruiser with platoons (AI faction)
        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        // Act - Try to invade own planet
        var result = invasionSystem.InvadePlanet(0, FactionType.AI);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void InvadePlanet_NoOrbitalControl_ReturnsNull()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Create mixed fleet (no orbital control)
        int playerCruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int aiCruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(playerCruiser, new List<int> { platoon });

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void InvadePlanet_NoPlatoons_ReturnsNull()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Create Battle Cruiser without platoons
        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void InvadePlanet_TransfersResources()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        int initialCredits = gameState.PlayerFaction.Resources.Credits;

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.True(result.PlanetCaptured);
        Assert.NotNull(result.CapturedResources);
        Assert.Equal(385000, result.CapturedResources.Credits); // 500k - 50k (cruiser) - 65k (platoon) = 385k
        Assert.Equal(90000, result.CapturedResources.Minerals); // 100k - 10k (cruiser) = 90k
        Assert.Equal(45000, result.CapturedResources.Fuel); // 50k - 5k (cruiser) = 45k
        Assert.Equal(10000, result.CapturedResources.Food);

        // Resources transferred to player faction
        Assert.Equal(initialCredits + 385000, gameState.PlayerFaction.Resources.Credits);

        // Planet stockpiles cleared
        Assert.Equal(0, gameState.PlanetLookup[0].Resources.Credits);
        Assert.Equal(0, gameState.PlanetLookup[0].Resources.Minerals);
    }

    [Fact]
    public void InvadePlanet_ReducesMorale_ThirtyPercent()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        int initialMorale = gameState.PlanetLookup[0].Morale;

        // Act
        var result = invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(50, result.NewMorale); // 80 - 30
        Assert.Equal(50, gameState.PlanetLookup[0].Morale);
    }

    [Fact]
    public void InvadePlanet_DeactivatesBuildings()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        // Build structures
        var buildingSystem = new BuildingSystem(gameState);
        buildingSystem.StartConstruction(0, BuildingType.MiningStation);
        buildingSystem.StartConstruction(0, BuildingType.HorticulturalStation);

        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        int activeStructures = gameState.PlanetLookup[0].Structures.Count(s => s.Status == BuildingStatus.Active);
        Assert.True(activeStructures > 0);

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        // Act
        invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        int damagedStructures = gameState.PlanetLookup[0].Structures.Count(s => s.Status == BuildingStatus.Damaged);
        Assert.Equal(activeStructures, damagedStructures); // All structures now damaged (inactive)
    }

    [Fact]
    public void InvadePlanet_GarrisonsSurvivingPlatoons()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int platoon2 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 80, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon1, platoon2 });

        // Act
        invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        // Platoons should be disembarked and garrisoned
        var platoon1Entity = gameState.PlatoonLookup[platoon1];
        var platoon2Entity = gameState.PlatoonLookup[platoon2];

        Assert.Equal(0, platoon1Entity.PlanetID);
        Assert.Equal(0, platoon2Entity.PlanetID);

        // Craft should no longer carry platoons
        var cruiserEntity = gameState.CraftLookup[cruiser];
        Assert.Empty(cruiserEntity.CarriedPlatoonIDs);
    }

    [Fact]
    public void InvadePlanet_FiresOnInvasionStartedEvent()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        int firedPlanetID = -1;
        FactionType firedFaction = FactionType.Player;
        invasionSystem.OnInvasionStarted += (planetID, faction) =>
        {
            firedPlanetID = planetID;
            firedFaction = faction;
        };

        // Act
        invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.Equal(0, firedPlanetID);
        Assert.Equal(FactionType.Player, firedFaction);
    }

    [Fact]
    public void InvadePlanet_FiresOnPlatoonsLandedEvent()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int platoon2 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 80, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon1, platoon2 });

        int firedPlanetID = -1;
        int firedPlatoonCount = -1;
        int firedTotalTroops = -1;
        invasionSystem.OnPlatoonsLanded += (planetID, platoonCount, totalTroops) =>
        {
            firedPlanetID = planetID;
            firedPlatoonCount = platoonCount;
            firedTotalTroops = totalTroops;
        };

        // Act
        invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.Equal(0, firedPlanetID);
        Assert.Equal(2, firedPlatoonCount);
        Assert.Equal(180, firedTotalTroops); // 100 + 80
    }

    [Fact]
    public void InvadePlanet_FiresOnPlanetCapturedEvent()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        int cruiser = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int platoon = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        craftSystem.EmbarkPlatoons(cruiser, new List<int> { platoon });

        int firedPlanetID = -1;
        FactionType firedNewOwner = FactionType.AI;
        ResourceDelta? firedResources = null;
        invasionSystem.OnPlanetCaptured += (planetID, newOwner, resources) =>
        {
            firedPlanetID = planetID;
            firedNewOwner = newOwner;
            firedResources = resources;
        };

        // Act
        invasionSystem.InvadePlanet(0, FactionType.Player);

        // Assert
        Assert.Equal(0, firedPlanetID);
        Assert.Equal(FactionType.Player, firedNewOwner);
        Assert.NotNull(firedResources);
        Assert.Equal(385000, firedResources.Credits); // 500k - 50k (cruiser) - 65k (platoon) = 385k
    }

    [Fact]
    public void HasOrbitalControl_NoEnemyCraft_ReturnsTrue()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        bool hasControl = invasionSystem.HasOrbitalControl(0, FactionType.Player);

        // Assert
        Assert.True(hasControl);
    }

    [Fact]
    public void HasOrbitalControl_EnemyCraftPresent_ReturnsFalse()
    {
        // Arrange
        var (gameState, platoonSystem, craftSystem, combatSystem, invasionSystem) = CreateTestSystems();

        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        bool hasControl = invasionSystem.HasOrbitalControl(0, FactionType.Player);

        // Assert
        Assert.False(hasControl);
    }
}
