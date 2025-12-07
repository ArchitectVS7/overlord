using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

public class UpgradeSystemTests
{
    private (GameState gameState, UpgradeSystem upgradeSystem) CreateTestSystems()
    {
        var gameState = new GameState();

        // Initialize faction resources
        gameState.PlayerFaction.Resources.Credits = 2000000;
        gameState.AIFaction.Resources.Credits = 2000000;

        var upgradeSystem = new UpgradeSystem(gameState);

        return (gameState, upgradeSystem);
    }

    [Fact]
    public void GetWeaponTier_InitialState_ReturnsLaser()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Act
        var playerTier = upgradeSystem.GetWeaponTier(FactionType.Player);
        var aiTier = upgradeSystem.GetWeaponTier(FactionType.AI);

        // Assert
        Assert.Equal(WeaponTier.Laser, playerTier);
        Assert.Equal(WeaponTier.Laser, aiTier);
    }

    [Fact]
    public void StartResearch_FromLaser_ResearchesMissile()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Act
        bool result = upgradeSystem.StartResearch(FactionType.Player);

        // Assert
        Assert.True(result);
        Assert.True(upgradeSystem.IsResearching(FactionType.Player));
        Assert.Equal(WeaponTier.Missile, upgradeSystem.GetResearchingTier(FactionType.Player));
        Assert.Equal(5, upgradeSystem.GetResearchTurnsRemaining(FactionType.Player));
    }

    [Fact]
    public void StartResearch_DeductsCost()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        int initialCredits = gameState.PlayerFaction.Resources.Credits;

        // Act
        upgradeSystem.StartResearch(FactionType.Player);

        // Assert
        int cost = UpgradeCosts.GetResearchCost(WeaponTier.Missile);
        Assert.Equal(initialCredits - cost, gameState.PlayerFaction.Resources.Credits);
    }

    [Fact]
    public void StartResearch_InsufficientCredits_Fails()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        gameState.PlayerFaction.Resources.Credits = 1000;

        // Act
        bool result = upgradeSystem.StartResearch(FactionType.Player);

        // Assert
        Assert.False(result);
        Assert.False(upgradeSystem.IsResearching(FactionType.Player));
    }

    [Fact]
    public void StartResearch_AlreadyResearching_Fails()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        upgradeSystem.StartResearch(FactionType.Player);

        // Act - Try to start another research
        bool result = upgradeSystem.StartResearch(FactionType.Player);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void StartResearch_AtMaxTier_Fails()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Research to Photon Torpedo
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 5; i++) upgradeSystem.UpdateResearch();

        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 8; i++) upgradeSystem.UpdateResearch();

        // Act - Try to research beyond max tier
        bool result = upgradeSystem.StartResearch(FactionType.Player);

        // Assert
        Assert.False(result);
        Assert.Equal(WeaponTier.PhotonTorpedo, upgradeSystem.GetWeaponTier(FactionType.Player));
    }

    [Fact]
    public void UpdateResearch_ProgressesResearch()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        upgradeSystem.StartResearch(FactionType.Player);

        // Act
        upgradeSystem.UpdateResearch();

        // Assert
        Assert.Equal(4, upgradeSystem.GetResearchTurnsRemaining(FactionType.Player));
        Assert.True(upgradeSystem.IsResearching(FactionType.Player));
    }

    [Fact]
    public void UpdateResearch_CompletesResearch()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        upgradeSystem.StartResearch(FactionType.Player);

        // Act - Complete research (5 turns)
        for (int i = 0; i < 5; i++)
        {
            upgradeSystem.UpdateResearch();
        }

        // Assert
        Assert.Equal(WeaponTier.Missile, upgradeSystem.GetWeaponTier(FactionType.Player));
        Assert.False(upgradeSystem.IsResearching(FactionType.Player));
        Assert.Null(upgradeSystem.GetResearchingTier(FactionType.Player));
        Assert.Equal(0, upgradeSystem.GetResearchTurnsRemaining(FactionType.Player));
    }

    [Fact]
    public void UpdateResearch_PlayerAndAI_Independent()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        upgradeSystem.StartResearch(FactionType.Player);
        upgradeSystem.StartResearch(FactionType.AI);

        // Act - Progress 3 turns
        for (int i = 0; i < 3; i++)
        {
            upgradeSystem.UpdateResearch();
        }

        // Assert - Both progress independently
        Assert.Equal(2, upgradeSystem.GetResearchTurnsRemaining(FactionType.Player));
        Assert.Equal(2, upgradeSystem.GetResearchTurnsRemaining(FactionType.AI));
    }

    [Fact]
    public void ResearchProgression_LaserToMissileToPhoton()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Act - Research Missile
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 5; i++) upgradeSystem.UpdateResearch();

        Assert.Equal(WeaponTier.Missile, upgradeSystem.GetWeaponTier(FactionType.Player));

        // Research Photon Torpedo
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 8; i++) upgradeSystem.UpdateResearch();

        // Assert
        Assert.Equal(WeaponTier.PhotonTorpedo, upgradeSystem.GetWeaponTier(FactionType.Player));
    }

    [Fact]
    public void CanAffordNextResearch_SufficientCredits_ReturnsTrue()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Act
        bool canAfford = upgradeSystem.CanAffordNextResearch(FactionType.Player);

        // Assert
        Assert.True(canAfford);
    }

    [Fact]
    public void CanAffordNextResearch_InsufficientCredits_ReturnsFalse()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        gameState.PlayerFaction.Resources.Credits = 1000;

        // Act
        bool canAfford = upgradeSystem.CanAffordNextResearch(FactionType.Player);

        // Assert
        Assert.False(canAfford);
    }

    [Fact]
    public void CanAffordNextResearch_AtMaxTier_ReturnsFalse()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Research to max tier
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 5; i++) upgradeSystem.UpdateResearch();
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 8; i++) upgradeSystem.UpdateResearch();

        // Act
        bool canAfford = upgradeSystem.CanAffordNextResearch(FactionType.Player);

        // Assert
        Assert.False(canAfford);
    }

    [Fact]
    public void GetDamageModifier_Laser_Returns1()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Act
        float modifier = upgradeSystem.GetDamageModifier(FactionType.Player);

        // Assert
        Assert.Equal(1.0f, modifier);
    }

    [Fact]
    public void GetDamageModifier_Missile_Returns1Point5()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Research Missile
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 5; i++) upgradeSystem.UpdateResearch();

        // Act
        float modifier = upgradeSystem.GetDamageModifier(FactionType.Player);

        // Assert
        Assert.Equal(1.5f, modifier);
    }

    [Fact]
    public void GetDamageModifier_PhotonTorpedo_Returns2()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();

        // Research to Photon Torpedo
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 5; i++) upgradeSystem.UpdateResearch();
        upgradeSystem.StartResearch(FactionType.Player);
        for (int i = 0; i < 8; i++) upgradeSystem.UpdateResearch();

        // Act
        float modifier = upgradeSystem.GetDamageModifier(FactionType.Player);

        // Assert
        Assert.Equal(2.0f, modifier);
    }

    [Fact]
    public void OnResearchStarted_EventFired()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        FactionType eventFaction = FactionType.AI;
        WeaponTier eventTier = WeaponTier.Laser;

        upgradeSystem.OnResearchStarted += (faction, tier) =>
        {
            eventFaction = faction;
            eventTier = tier;
        };

        // Act
        upgradeSystem.StartResearch(FactionType.Player);

        // Assert
        Assert.Equal(FactionType.Player, eventFaction);
        Assert.Equal(WeaponTier.Missile, eventTier);
    }

    [Fact]
    public void OnResearchCompleted_EventFired()
    {
        // Arrange
        var (gameState, upgradeSystem) = CreateTestSystems();
        FactionType eventFaction = FactionType.AI;
        WeaponTier eventTier = WeaponTier.Laser;

        upgradeSystem.OnResearchCompleted += (faction, tier) =>
        {
            eventFaction = faction;
            eventTier = tier;
        };

        upgradeSystem.StartResearch(FactionType.Player);

        // Act - Complete research
        for (int i = 0; i < 5; i++)
        {
            upgradeSystem.UpdateResearch();
        }

        // Assert
        Assert.Equal(FactionType.Player, eventFaction);
        Assert.Equal(WeaponTier.Missile, eventTier);
    }
}
