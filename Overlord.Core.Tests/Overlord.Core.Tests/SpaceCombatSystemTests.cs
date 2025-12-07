using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class SpaceCombatSystemTests
{
    private (GameState gameState, UpgradeSystem upgradeSystem, DefenseSystem defenseSystem, CraftSystem craftSystem, SpaceCombatSystem spaceCombatSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Add test planet (Player owned)
        gameState.Planets.Add(new PlanetEntity
        {
            ID = 0,
            Name = "Test Planet",
            Owner = FactionType.Player,
            Population = 10000,
            Colonized = true,
            Resources = new ResourceCollection
            {
                Credits = 2000000,
                Minerals = 200000, // Increased for purchasing multiple craft
                Fuel = 50000
            }
        });

        // Initialize faction resources for upgrades
        gameState.AIFaction.Resources.Credits = 1000000;

        gameState.RebuildLookups();

        var entitySystem = new EntitySystem(gameState);
        var resourceSystem = new ResourceSystem(gameState);
        var upgradeSystem = new UpgradeSystem(gameState);
        var defenseSystem = new DefenseSystem(gameState);
        var craftSystem = new CraftSystem(gameState, entitySystem, resourceSystem);
        var spaceCombatSystem = new SpaceCombatSystem(gameState, upgradeSystem, defenseSystem);

        return (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem);
    }

    [Fact]
    public void InitiateSpaceBattle_ValidPlanet_CreatesBattle()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Create attacking fleet (AI faction)
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Create defending fleet (Player faction)
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Assert
        Assert.NotNull(battle);
        Assert.Equal(0, battle.PlanetID);
        Assert.Equal("Test Planet", battle.PlanetName);
        Assert.Equal(FactionType.AI, battle.AttackerFaction);
        Assert.Equal(FactionType.Player, battle.DefenderFaction);
        Assert.Equal(2, battle.AttackerCraftIDs.Count);
        Assert.Single(battle.DefenderCraftIDs);
        Assert.False(battle.DefenderHasOrbitalDefense);
    }

    [Fact]
    public void InitiateSpaceBattle_NoAttackers_ReturnsNull()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Create only defending fleet
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Assert
        Assert.Null(battle);
    }

    [Fact]
    public void InitiateSpaceBattle_NoDefenders_ReturnsNull()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Create only attacking fleet
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Act
        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Assert
        Assert.Null(battle);
    }

    [Fact]
    public void InitiateSpaceBattle_WithOrbitalDefense_SetsDefenseFlag()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Build orbital defense platform
        var buildingSystem = new BuildingSystem(gameState);
        buildingSystem.StartConstruction(0, BuildingType.OrbitalDefense);

        // Complete construction
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        // Create fleets
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Assert
        Assert.NotNull(battle);
        Assert.True(battle.DefenderHasOrbitalDefense);
    }

    [Fact]
    public void ExecuteSpaceCombat_AttackerStronger_AttackerWins()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Strong attacker fleet
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker3 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Weak defender fleet
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        Assert.True(result.AttackerWins);
        Assert.True(result.AttackerStrength > result.DefenderStrength);
    }

    [Fact]
    public void ExecuteSpaceCombat_DefenderStronger_DefenderWins()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Weak attacker fleet
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Strong defender fleet
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int defender2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int defender3 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        Assert.False(result.AttackerWins);
        Assert.True(result.DefenderStrength > result.AttackerStrength);
    }

    [Fact]
    public void ExecuteSpaceCombat_BattleCruiserStrongerThanCargoCruiser()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Attacker: 1 Battle Cruiser
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Defender: 3 Cargo Cruisers
        int defender1 = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        int defender2 = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);
        int defender3 = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        // Battle Cruiser strength: 100
        // Cargo Cruiser strength: 30 × 3 = 90
        Assert.True(result.AttackerWins);
        Assert.Equal(100, result.AttackerStrength);
        Assert.Equal(90, result.DefenderStrength);
    }

    [Fact]
    public void ExecuteSpaceCombat_WeaponUpgrade_IncreasesStrength()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Create attacker fleet
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Upgrade AI weapons to Missile (1.5x)
        upgradeSystem.StartResearch(FactionType.AI);
        for (int i = 0; i < 10; i++)
        {
            upgradeSystem.UpdateResearch();
        }

        // Create defender fleet (no upgrades)
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        // Attacker: 100 × 1.5 = 150
        // Defender: 100 × 1.0 = 100
        Assert.True(result.AttackerWins);
        Assert.Equal(150, result.AttackerStrength);
        Assert.Equal(100, result.DefenderStrength);
    }

    [Fact]
    public void ExecuteSpaceCombat_DamagedCraft_ReducedStrength()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Create fleets
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Damage defender to 50% HP
        gameState.CraftLookup[defender1].Health = 50;

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        // Attacker: 100 (full HP)
        // Defender: 100 × 0.5 = 50
        Assert.True(result.AttackerWins);
        Assert.Equal(100, result.AttackerStrength);
        Assert.Equal(50, result.DefenderStrength);
    }

    [Fact]
    public void ExecuteSpaceCombat_OrbitalDefense_BoostsDefender()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Build 2 orbital defense platforms
        var buildingSystem = new BuildingSystem(gameState);
        buildingSystem.StartConstruction(0, BuildingType.OrbitalDefense);

        // Complete first platform
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        buildingSystem.StartConstruction(0, BuildingType.OrbitalDefense);

        // Complete second platform
        for (int i = 0; i < 10; i++)
        {
            buildingSystem.UpdateConstruction();
        }

        // Create equal fleets
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        // Attacker: 100
        // Defender: 100 × 1.4 (2 platforms = +40%) = 140
        Assert.False(result.AttackerWins);
        Assert.Equal(100, result.AttackerStrength);
        Assert.Equal(140, result.DefenderStrength);
    }

    [Fact]
    public void ExecuteSpaceCombat_DestroysLosersWhenHP_Zero()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Overwhelming attacker
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker3 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker4 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Weak defender
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        int initialDefenderCount = gameState.Craft.Count(c => c.Owner == FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        Assert.True(result.AttackerWins);
        Assert.NotEmpty(result.DestroyedCraftIDs);
        Assert.Contains(defender1, result.DestroyedCraftIDs);

        // Verify craft removed from game state
        int finalDefenderCount = gameState.Craft.Count(c => c.Owner == FactionType.Player);
        Assert.True(finalDefenderCount < initialDefenderCount);
    }

    [Fact]
    public void ExecuteSpaceCombat_CalculatesDamagePerCraft()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Create fleets
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        var result = spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        Assert.True(result.DamagePerCraft > 0);
        Assert.NotEmpty(result.CraftDamage);
    }

    [Fact]
    public void ExecuteSpaceCombat_FiresOnSpaceBattleStartedEvent()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        SpaceBattle? firedBattle = null;
        spaceCombatSystem.OnSpaceBattleStarted += (battle) => firedBattle = battle;

        // Act
        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Assert
        Assert.NotNull(firedBattle);
        Assert.Equal(battle!.PlanetID, firedBattle!.PlanetID);
    }

    [Fact]
    public void ExecuteSpaceCombat_FiresOnSpaceBattleCompletedEvent()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        SpaceBattleResult? firedResult = null;
        spaceCombatSystem.OnSpaceBattleCompleted += (battle, result) => firedResult = result;

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        Assert.NotNull(firedResult);
    }

    [Fact]
    public void ExecuteSpaceCombat_FiresOnCraftDestroyedEvent()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        // Overwhelming attacker
        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker3 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int attacker4 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Weak defender
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        var destroyedCraftIDs = new List<int>();
        var destroyedOwners = new List<FactionType>();
        spaceCombatSystem.OnCraftDestroyed += (craftID, owner) =>
        {
            destroyedCraftIDs.Add(craftID);
            destroyedOwners.Add(owner);
        };

        var battle = spaceCombatSystem.InitiateSpaceBattle(0, FactionType.AI);

        // Act
        spaceCombatSystem.ExecuteSpaceCombat(battle!);

        // Assert
        Assert.NotEmpty(destroyedCraftIDs);
        Assert.Contains(defender1, destroyedCraftIDs);
        Assert.Contains(FactionType.Player, destroyedOwners);
    }

    [Fact]
    public void ShouldSpaceBattleOccur_MultipleFactions_ReturnsTrue()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        int attacker1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int defender1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        bool shouldOccur = spaceCombatSystem.ShouldSpaceBattleOccur(0);

        // Assert
        Assert.True(shouldOccur);
    }

    [Fact]
    public void ShouldSpaceBattleOccur_SingleFaction_ReturnsFalse()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        int craft1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int craft2 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);

        // Act
        bool shouldOccur = spaceCombatSystem.ShouldSpaceBattleOccur(0);

        // Assert
        Assert.False(shouldOccur);
    }

    [Fact]
    public void GetHostileCraftAtPlanet_ReturnsEnemyCraft()
    {
        // Arrange
        var (gameState, upgradeSystem, defenseSystem, craftSystem, spaceCombatSystem) = CreateTestSystems();

        int friendly1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.Player);
        int hostile1 = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);
        int hostile2 = craftSystem.PurchaseCraft(CraftType.CargoCruiser, 0, FactionType.AI);

        // Act
        var hostileCraft = spaceCombatSystem.GetHostileCraftAtPlanet(0, FactionType.Player);

        // Assert
        Assert.Equal(2, hostileCraft.Count);
        Assert.Contains(hostile1, hostileCraft);
        Assert.Contains(hostile2, hostileCraft);
        Assert.DoesNotContain(friendly1, hostileCraft);
    }
}
