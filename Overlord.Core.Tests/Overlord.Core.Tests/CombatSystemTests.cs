using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class CombatSystemTests
{
    private (GameState gameState, PlatoonSystem platoonSystem, CombatSystem combatSystem) CreateTestSystems()
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
                Credits = 1000000,
                Minerals = 50000,
                Fuel = 20000
            }
        });

        gameState.RebuildLookups();

        var entitySystem = new EntitySystem(gameState);
        var platoonSystem = new PlatoonSystem(gameState, entitySystem);
        var combatSystem = new CombatSystem(gameState, platoonSystem);

        return (gameState, platoonSystem, combatSystem);
    }

    [Fact]
    public void InitiateBattle_ValidPlanet_CreatesBattle()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Create attacking platoons (AI faction)
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int attacker2 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 80, EquipmentLevel.Basic, WeaponLevel.Pistol);

        // Create defending platoons (Player faction)
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 120, EquipmentLevel.Advanced, WeaponLevel.AssaultRifle);

        var attackingIDs = new List<int> { attacker1, attacker2 };

        // Act
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Assert
        Assert.NotNull(battle);
        Assert.Equal(0, battle.PlanetID);
        Assert.Equal("Test Planet", battle.PlanetName);
        Assert.Equal(FactionType.AI, battle.AttackerFaction);
        Assert.Equal(FactionType.Player, battle.DefenderFaction);
        Assert.Equal(2, battle.AttackingPlatoonIDs.Count);
        Assert.Single(battle.DefendingPlatoonIDs);
    }

    [Fact]
    public void InitiateBattle_NoDefenders_ReturnsNull()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Create attacking platoon
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Remove all platoons owned by planet owner (Player) - no defenders
        var defenderPlatoons = gameState.Platoons.Where(p => p.Owner == FactionType.Player).ToList();
        foreach (var platoon in defenderPlatoons)
        {
            gameState.Platoons.Remove(platoon);
        }
        gameState.RebuildLookups();

        var attackingIDs = new List<int> { attacker1 };

        // Act
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Assert
        Assert.Null(battle);
    }

    [Fact]
    public void ExecuteCombat_AttackerStronger_AttackerWins()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Strong attackers
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 150, EquipmentLevel.Advanced, WeaponLevel.AssaultRifle);
        int attacker2 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 120, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Weak defender
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 80, EquipmentLevel.Basic, WeaponLevel.Pistol);

        // Train all to 100%
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        var attackingIDs = new List<int> { attacker1, attacker2 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        var result = combatSystem.ExecuteCombat(battle!, 50); // 50% aggression

        // Assert
        Assert.True(result.AttackerWins);
        Assert.True(result.PlanetCaptured);
        Assert.True(result.AttackerStrength > result.DefenderStrength);
        Assert.Equal(FactionType.AI, gameState.PlanetLookup[0].Owner); // Planet captured
    }

    [Fact]
    public void ExecuteCombat_DefenderStronger_DefenderWins()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Weak attacker
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 50, EquipmentLevel.Civilian, WeaponLevel.Pistol);

        // Strong defender
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 150, EquipmentLevel.Elite, WeaponLevel.Plasma);
        int defender2 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 120, EquipmentLevel.Advanced, WeaponLevel.AssaultRifle);

        // Train all to 100%
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        var result = combatSystem.ExecuteCombat(battle!, 50);

        // Assert
        Assert.False(result.AttackerWins);
        Assert.False(result.PlanetCaptured);
        Assert.True(result.DefenderStrength > result.AttackerStrength);
        Assert.Equal(FactionType.Player, gameState.PlanetLookup[0].Owner); // Planet still owned by defender
    }

    [Fact]
    public void ExecuteCombat_CalculatesCasualties()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Train all to 100%
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        var result = combatSystem.ExecuteCombat(battle!, 50);

        // Assert
        Assert.True(result.AttackerCasualties > 0 || result.DefenderCasualties > 0);
        Assert.NotEmpty(result.PlatoonCasualties);
    }

    [Fact]
    public void ExecuteCombat_HighAggression_IncreasesAttackerStrength()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act - Execute with high aggression (100%)
        var result = combatSystem.ExecuteCombat(battle!, 100);

        // Assert - Aggression 100% = 1.2x multiplier
        // Base strength: 100 troops × 1.5 equipment × 1.0 weapon × 1.0 training = 150
        // With 100% aggression: 150 × 1.2 = 180
        Assert.True(result.AttackerStrength >= 180);
    }

    [Fact]
    public void ExecuteCombat_LowAggression_DecreasesAttackerStrength()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act - Execute with low aggression (0%)
        var result = combatSystem.ExecuteCombat(battle!, 0);

        // Assert - Aggression 0% = 0.8x multiplier
        // Base strength: 150 × 0.8 = 120
        Assert.True(result.AttackerStrength <= 120);
    }

    [Fact]
    public void ExecuteCombat_AttackerWins_DestroysDefenders()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Overwhelming attacker
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 200, EquipmentLevel.Elite, WeaponLevel.Plasma);

        // Weak defender
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 50, EquipmentLevel.Civilian, WeaponLevel.Pistol);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        int initialDefenderCount = gameState.Platoons.Count(p => p.Owner == FactionType.Player);

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        combatSystem.ExecuteCombat(battle!, 50);

        // Assert - Defender platoons destroyed
        int finalDefenderCount = gameState.Platoons.Count(p => p.Owner == FactionType.Player);
        Assert.True(finalDefenderCount < initialDefenderCount);
    }

    [Fact]
    public void ExecuteCombat_DefenderWins_DestroysAttackers()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Weak attacker
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 30, EquipmentLevel.Civilian, WeaponLevel.Pistol);

        // Overwhelming defender
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 200, EquipmentLevel.Elite, WeaponLevel.Plasma);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        int initialAttackerCount = gameState.Platoons.Count(p => p.Owner == FactionType.AI);

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        combatSystem.ExecuteCombat(battle!, 50);

        // Assert - Attacker platoons destroyed
        int finalAttackerCount = gameState.Platoons.Count(p => p.Owner == FactionType.AI);
        Assert.True(finalAttackerCount < initialAttackerCount);
    }

    [Fact]
    public void ExecuteCombat_FiresOnBattleStartedEvent()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        Battle? firedBattle = null;
        combatSystem.OnBattleStarted += (battle) => firedBattle = battle;

        var attackingIDs = new List<int> { attacker1 };

        // Act
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Assert
        Assert.NotNull(firedBattle);
        Assert.Equal(battle!.PlanetID, firedBattle!.PlanetID);
    }

    [Fact]
    public void ExecuteCombat_FiresOnBattleCompletedEvent()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        BattleResult? firedResult = null;
        combatSystem.OnBattleCompleted += (battle, result) => firedResult = result;

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        combatSystem.ExecuteCombat(battle!, 50);

        // Assert
        Assert.NotNull(firedResult);
    }

    [Fact]
    public void ExecuteCombat_FiresOnPlanetCapturedEvent()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Strong attacker
        int attacker1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 200, EquipmentLevel.Elite, WeaponLevel.Plasma);

        // Weak defender
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 50, EquipmentLevel.Civilian, WeaponLevel.Pistol);

        // Train all
        for (int i = 0; i < 10; i++)
        {
            platoonSystem.UpdateTraining();
        }

        int capturedPlanetID = -1;
        FactionType capturedBy = FactionType.Player;
        combatSystem.OnPlanetCaptured += (planetID, newOwner) =>
        {
            capturedPlanetID = planetID;
            capturedBy = newOwner;
        };

        var attackingIDs = new List<int> { attacker1 };
        var battle = combatSystem.InitiateBattle(0, FactionType.AI, attackingIDs);

        // Act
        combatSystem.ExecuteCombat(battle!, 50);

        // Assert
        Assert.Equal(0, capturedPlanetID);
        Assert.Equal(FactionType.AI, capturedBy);
    }

    [Fact]
    public void GetAttackingPlatoons_ReturnsPlatoonsOnBattleCruisers()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();
        var entitySystem = new EntitySystem(gameState);
        var resourceSystem = new ResourceSystem(gameState);
        var craftSystem = new CraftSystem(gameState, entitySystem, resourceSystem);

        // Create Battle Cruiser
        int craftID = craftSystem.PurchaseCraft(CraftType.BattleCruiser, 0, FactionType.AI);

        // Create platoons and embark them
        int platoon1 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int platoon2 = platoonSystem.CommissionPlatoon(0, FactionType.AI, 80, EquipmentLevel.Basic, WeaponLevel.Pistol);

        craftSystem.EmbarkPlatoons(craftID, new List<int> { platoon1, platoon2 });

        // Act
        var attackingPlatoons = combatSystem.GetAttackingPlatoons(0, FactionType.AI);

        // Assert
        Assert.Equal(2, attackingPlatoons.Count);
        Assert.Contains(platoon1, attackingPlatoons);
        Assert.Contains(platoon2, attackingPlatoons);
    }

    [Fact]
    public void GetDefendingPlatoons_ReturnsPlatoonsOnPlanet()
    {
        // Arrange
        var (gameState, platoonSystem, combatSystem) = CreateTestSystems();

        // Create defending platoons
        int defender1 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        int defender2 = platoonSystem.CommissionPlatoon(0, FactionType.Player, 80, EquipmentLevel.Basic, WeaponLevel.Pistol);

        // Act
        var defendingPlatoons = combatSystem.GetDefendingPlatoons(0);

        // Assert
        Assert.Equal(2, defendingPlatoons.Count);
        Assert.Contains(defender1, defendingPlatoons);
        Assert.Contains(defender2, defendingPlatoons);
    }
}
