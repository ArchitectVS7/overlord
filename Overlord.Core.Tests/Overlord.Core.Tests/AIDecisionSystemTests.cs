using Overlord.Core;
using Overlord.Core.Models;
using Xunit;

namespace Overlord.Core.Tests;

/// <summary>
/// Tests for AI Decision System with 4 personalities and 3 difficulty levels.
/// </summary>
public class AIDecisionSystemTests
{
    private GameState CreateTestGameState()
    {
        var gameState = new GameState
        {
            CurrentTurn = 1,
            PlayerFaction = new FactionState
            {
                Resources = new ResourceCollection
                {
                    Credits = 1000,
                    Minerals = 500,
                    Fuel = 200,
                    Food = 300,
                    Energy = 100
                }
            },
            AIFaction = new FactionState
            {
                Resources = new ResourceCollection
                {
                    Credits = 1000,
                    Minerals = 500,
                    Fuel = 200,
                    Food = 300,
                    Energy = 100
                }
            },
            Planets = new List<PlanetEntity>
            {
                new PlanetEntity
                {
                    ID = 1,
                    Name = "Starbase",
                    Owner = FactionType.Player,
                    Type = PlanetType.Metropolis,
                    Population = 1000,
                    Morale = 80,
                    Colonized = true,
                    Resources = new ResourceCollection { Credits = 500, Minerals = 200 }
                },
                new PlanetEntity
                {
                    ID = 2,
                    Name = "Hitotsu",
                    Owner = FactionType.AI,
                    Type = PlanetType.Volcanic,
                    Population = 1000,
                    Morale = 80,
                    Colonized = true,
                    Resources = new ResourceCollection { Credits = 1000, Minerals = 500 }
                }
            },
            Craft = new List<CraftEntity>(),
            Platoons = new List<PlatoonEntity>()
        };

        gameState.RebuildLookups();
        return gameState;
    }

    private AIDecisionSystem CreateAISystem(
        GameState gameState,
        AIPersonality personality = AIPersonality.Balanced,
        AIDifficulty difficulty = AIDifficulty.Normal)
    {
        var resourceSystem = new ResourceSystem(gameState);
        var incomeSystem = new IncomeSystem(gameState, resourceSystem);
        var buildingSystem = new BuildingSystem(gameState);
        var entitySystem = new EntitySystem(gameState);
        var craftSystem = new CraftSystem(gameState, entitySystem, resourceSystem);
        var platoonSystem = new PlatoonSystem(gameState, entitySystem);

        return new AIDecisionSystem(
            gameState,
            incomeSystem,
            resourceSystem,
            buildingSystem,
            craftSystem,
            platoonSystem,
            personality,
            difficulty,
            new Random(42));
    }

    #region Personality Configuration Tests

    [Fact]
    public void GetConfig_Aggressive_ReturnsKratosConfig()
    {
        var config = AIPersonalityConfig.GetConfig(AIPersonality.Aggressive);

        Assert.Equal(AIPersonality.Aggressive, config.Personality);
        Assert.Equal("Commander Kratos", config.Name);
        Assert.Equal(0.5f, config.AggressionModifier);
        Assert.Equal(-0.3f, config.EconomicModifier);
    }

    [Fact]
    public void GetConfig_Defensive_ReturnsAegisConfig()
    {
        var config = AIPersonalityConfig.GetConfig(AIPersonality.Defensive);

        Assert.Equal("Overseer Aegis", config.Name);
        Assert.Equal(-0.5f, config.AggressionModifier);
        Assert.Equal(0.4f, config.DefenseModifier);
    }

    [Fact]
    public void GetConfig_Economic_ReturnsMidasConfig()
    {
        var config = AIPersonalityConfig.GetConfig(AIPersonality.Economic);

        Assert.Equal("Magistrate Midas", config.Name);
        Assert.Equal(0.5f, config.EconomicModifier);
    }

    [Fact]
    public void GetConfig_Balanced_ReturnsNexusConfig()
    {
        var config = AIPersonalityConfig.GetConfig(AIPersonality.Balanced);

        Assert.Equal("General Nexus", config.Name);
        Assert.Equal(0.0f, config.AggressionModifier);
    }

    #endregion

    #region Constructor Tests

    [Fact]
    public void Constructor_SetsPersonalityAndDifficulty()
    {
        var gameState = CreateTestGameState();
        var ai = CreateAISystem(gameState, AIPersonality.Aggressive, AIDifficulty.Hard);

        Assert.Equal(AIPersonality.Aggressive, ai.GetPersonality());
        Assert.Equal(AIDifficulty.Hard, ai.GetDifficulty());
        Assert.Equal("Commander Kratos", ai.GetPersonalityName());
    }

    [Fact]
    public void SetDifficulty_UpdatesDifficulty()
    {
        var gameState = CreateTestGameState();
        var ai = CreateAISystem(gameState);

        ai.SetDifficulty(AIDifficulty.Hard);

        Assert.Equal(AIDifficulty.Hard, ai.GetDifficulty());
    }

    #endregion

    #region AssessGameState Tests

    [Fact]
    public void AssessGameState_EqualForces_ReturnsThreatLevelNearOne()
    {
        var gameState = CreateTestGameState();

        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 1,
            Owner = FactionType.Player,
            PlanetID = 1,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });
        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 2,
            Owner = FactionType.AI,
            PlanetID = 2,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });

        var ai = CreateAISystem(gameState);
        var assessment = ai.AssessGameState();

        Assert.InRange(assessment.ThreatLevel, 0.9f, 1.1f);
        Assert.Equal(1, assessment.AIPlanets);
        Assert.Equal(1, assessment.PlayerPlanets);
    }

    [Fact]
    public void AssessGameState_AIStronger_ReturnsLowThreatLevel()
    {
        var gameState = CreateTestGameState();

        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 1,
            Owner = FactionType.Player,
            PlanetID = 1,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });
        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 2,
            Owner = FactionType.AI,
            PlanetID = 2,
            TroopCount = 200,
            Equipment = EquipmentLevel.Elite,
            Weapon = WeaponLevel.Plasma,
            TrainingLevel = 100
        });

        var ai = CreateAISystem(gameState);
        var assessment = ai.AssessGameState();

        Assert.True(assessment.ThreatLevel < 0.7f);
        Assert.True(assessment.CanAttack);
    }

    [Fact]
    public void AssessGameState_UnderAttack_DetectsPlayerBattleCruiser()
    {
        var gameState = CreateTestGameState();

        gameState.Craft.Add(new CraftEntity
        {
            ID = 1,
            Owner = FactionType.Player,
            Type = CraftType.BattleCruiser,
            PlanetID = 2 // AI planet
        });

        var ai = CreateAISystem(gameState);
        var assessment = ai.AssessGameState();

        Assert.True(assessment.UnderAttack);
    }

    #endregion

    #region Difficulty Tests

    [Fact]
    public void AssessGameState_EasyDifficulty_ReducesAIStrength()
    {
        var gameState = CreateTestGameState();

        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 1,
            Owner = FactionType.Player,
            PlanetID = 1,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });
        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 2,
            Owner = FactionType.AI,
            PlanetID = 2,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });

        var ai = CreateAISystem(gameState, AIPersonality.Balanced, AIDifficulty.Easy);
        var assessment = ai.AssessGameState();

        Assert.True(assessment.ThreatLevel > 1.15f);
    }

    [Fact]
    public void AssessGameState_HardDifficulty_IncreasesAIStrength()
    {
        var gameState = CreateTestGameState();

        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 1,
            Owner = FactionType.Player,
            PlanetID = 1,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });
        gameState.Platoons.Add(new PlatoonEntity
        {
            ID = 2,
            Owner = FactionType.AI,
            PlanetID = 2,
            TroopCount = 100,
            Equipment = EquipmentLevel.Standard,
            Weapon = WeaponLevel.Rifle,
            TrainingLevel = 100
        });

        var ai = CreateAISystem(gameState, AIPersonality.Balanced, AIDifficulty.Hard);
        var assessment = ai.AssessGameState();

        Assert.True(assessment.ThreatLevel < 0.9f);
    }

    #endregion

    #region Event Tests

    [Fact]
    public void ExecuteAITurn_FiresStartAndEndEvents()
    {
        var gameState = CreateTestGameState();
        var ai = CreateAISystem(gameState);

        bool startFired = false;
        bool completeFired = false;

        ai.OnAITurnStarted += () => startFired = true;
        ai.OnAITurnCompleted += () => completeFired = true;

        ai.ExecuteAITurn();

        Assert.True(startFired);
        Assert.True(completeFired);
    }

    #endregion
}
