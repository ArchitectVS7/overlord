using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Core.Tests;

public class TurnSystemTests
{
    [Fact]
    public void TurnSystem_Constructor_RequiresGameState()
    {
        Assert.Throws<ArgumentNullException>(() => new TurnSystem(null!));
    }

    [Fact]
    public void StartNewGame_InitializesToTurn1ActionPhase()
    {
        // Arrange
        var gameState = new GameState();
        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.StartNewGame();

        // Assert
        Assert.Equal(1, turnSystem.CurrentTurn);
        Assert.Equal(TurnPhase.Action, turnSystem.CurrentPhase); // Income auto-advances to Action
    }

    [Fact]
    public void StartNewGame_FiresTurnStartedEvent()
    {
        // Arrange
        var gameState = new GameState();
        var turnSystem = new TurnSystem(gameState);
        int firedTurnNumber = 0;

        turnSystem.OnTurnStarted += (turn) => firedTurnNumber = turn;

        // Act
        turnSystem.StartNewGame();

        // Assert
        Assert.Equal(1, firedTurnNumber);
    }

    [Fact]
    public void StartNewGame_FiresPhaseChangedEvent()
    {
        // Arrange
        var gameState = new GameState();
        var turnSystem = new TurnSystem(gameState);
        var phases = new List<TurnPhase>();

        turnSystem.OnPhaseChanged += (phase) => phases.Add(phase);

        // Act
        turnSystem.StartNewGame();

        // Assert - Should fire Income, then auto-advance to Action
        Assert.Contains(TurnPhase.Income, phases);
        Assert.Contains(TurnPhase.Action, phases);
    }

    [Fact]
    public void ProcessIncomePhase_ThrowsIfNotInIncomePhase()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Action };
        var turnSystem = new TurnSystem(gameState);

        // Act & Assert
        var exception = Assert.Throws<InvalidOperationException>(() => turnSystem.ProcessIncomePhase());
        Assert.Contains("Cannot process income during", exception.Message);
    }

    [Fact]
    public void ProcessIncomePhase_ReturnsResourceDelta()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Income };
        var turnSystem = new TurnSystem(gameState);

        // Act
        var income = turnSystem.ProcessIncomePhase();

        // Assert
        Assert.NotNull(income);
        Assert.True(income.Credits > 0);
    }

    [Fact]
    public void ProcessIncomePhase_AddsResourcesToPlayerFaction()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Income };
        gameState.PlayerFaction.Resources.Credits = 0;
        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.ProcessIncomePhase();

        // Assert
        Assert.True(gameState.PlayerFaction.Resources.Credits > 0);
    }

    [Fact]
    public void ProcessIncomePhase_FiresOnIncomeCalculatedEvent()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Income };
        var turnSystem = new TurnSystem(gameState);
        ResourceDelta? firedDelta = null;

        turnSystem.OnIncomeCalculated += (delta) => firedDelta = delta;

        // Act
        turnSystem.ProcessIncomePhase();

        // Assert
        Assert.NotNull(firedDelta);
        Assert.True(firedDelta.Credits > 0);
    }

    [Fact]
    public void AdvancePhase_TransitionsFromIncomeToAction()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Income };
        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(TurnPhase.Action, turnSystem.CurrentPhase);
    }

    [Fact]
    public void AdvancePhase_TransitionsFromActionToCombat()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Action };
        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(TurnPhase.Combat, turnSystem.CurrentPhase);
    }

    [Fact]
    public void AdvancePhase_TransitionsFromCombatToEnd()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Combat };
        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(TurnPhase.End, turnSystem.CurrentPhase);
    }

    [Fact]
    public void AdvancePhase_TransitionsFromEndToIncomeAndIncrementsTurn()
    {
        // Arrange
        var gameState = new GameState { CurrentTurn = 1, CurrentPhase = TurnPhase.End };
        // Add units to prevent victory condition
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Platoons.Add(new PlatoonEntity { ID = 2, Owner = FactionType.AI });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 2, Owner = FactionType.AI });

        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(2, turnSystem.CurrentTurn);
        Assert.Equal(TurnPhase.Action, turnSystem.CurrentPhase); // Income auto-advances to Action
    }

    [Fact]
    public void AdvancePhase_FiresPhaseChangedEvent()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.Action };
        var turnSystem = new TurnSystem(gameState);
        TurnPhase firedPhase = TurnPhase.Income;

        turnSystem.OnPhaseChanged += (phase) => firedPhase = phase;

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(TurnPhase.Combat, firedPhase);
    }

    [Fact]
    public void CheckVictoryConditions_ReturnsNone_WhenBothFactionsHaveUnits()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Platoons.Add(new PlatoonEntity { ID = 2, Owner = FactionType.AI });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 2, Owner = FactionType.AI });

        var turnSystem = new TurnSystem(gameState);

        // Act
        var result = turnSystem.CheckVictoryConditions();

        // Assert
        Assert.Equal(VictoryResult.None, result);
    }

    [Fact]
    public void CheckVictoryConditions_ReturnsPlayerVictory_WhenAIEliminated()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });
        // No AI platoons or planets

        var turnSystem = new TurnSystem(gameState);

        // Act
        var result = turnSystem.CheckVictoryConditions();

        // Assert
        Assert.Equal(VictoryResult.PlayerVictory, result);
    }

    [Fact]
    public void CheckVictoryConditions_ReturnsAIVictory_WhenPlayerEliminated()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.AI });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.AI });
        // No player platoons or planets

        var turnSystem = new TurnSystem(gameState);

        // Act
        var result = turnSystem.CheckVictoryConditions();

        // Assert
        Assert.Equal(VictoryResult.AIVictory, result);
    }

    [Fact]
    public void CheckVictoryConditions_ReturnsAIVictory_WhenPlayerHasEconomicCollapse()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.AI });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.AI });
        // Player has no planets and low resources
        gameState.PlayerFaction.Resources.Credits = 50;
        gameState.PlayerFaction.Resources.Minerals = 50;
        gameState.PlayerFaction.Resources.Fuel = 50;
        gameState.PlayerFaction.Resources.Food = 50;
        gameState.PlayerFaction.Resources.Energy = 50;

        var turnSystem = new TurnSystem(gameState);

        // Act
        var result = turnSystem.CheckVictoryConditions();

        // Assert
        Assert.Equal(VictoryResult.AIVictory, result);
    }

    [Fact]
    public void CompleteTurn_DoesNotIncrementTurn_WhenVictoryAchieved()
    {
        // Arrange
        var gameState = new GameState { CurrentTurn = 5, CurrentPhase = TurnPhase.End };
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });
        // No AI units = Player Victory

        var turnSystem = new TurnSystem(gameState);

        // Act
        turnSystem.AdvancePhase(); // Triggers CompleteTurn via End phase

        // Assert - Turn should NOT increment because victory was achieved
        Assert.Equal(5, turnSystem.CurrentTurn);
    }

    [Fact]
    public void CompleteTurn_FiresVictoryAchievedEvent()
    {
        // Arrange
        var gameState = new GameState { CurrentPhase = TurnPhase.End };
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });

        var turnSystem = new TurnSystem(gameState);
        VictoryResult firedResult = VictoryResult.None;

        turnSystem.OnVictoryAchieved += (result) => firedResult = result;

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(VictoryResult.PlayerVictory, firedResult);
    }

    [Fact]
    public void CompleteTurn_FiresTurnEndedEvent()
    {
        // Arrange
        var gameState = new GameState { CurrentTurn = 3, CurrentPhase = TurnPhase.End };
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Platoons.Add(new PlatoonEntity { ID = 2, Owner = FactionType.AI });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 2, Owner = FactionType.AI });

        var turnSystem = new TurnSystem(gameState);
        int firedTurn = 0;

        turnSystem.OnTurnEnded += (turn) => firedTurn = turn;

        // Act
        turnSystem.AdvancePhase();

        // Assert
        Assert.Equal(3, firedTurn); // Turn 3 ended
    }

    [Fact]
    public void FullTurnCycle_TransitionsCorrectly()
    {
        // Arrange
        var gameState = new GameState();
        gameState.Platoons.Add(new PlatoonEntity { ID = 1, Owner = FactionType.Player });
        gameState.Platoons.Add(new PlatoonEntity { ID = 2, Owner = FactionType.AI });
        gameState.Planets.Add(new PlanetEntity { ID = 1, Owner = FactionType.Player });
        gameState.Planets.Add(new PlanetEntity { ID = 2, Owner = FactionType.AI });

        var turnSystem = new TurnSystem(gameState);
        turnSystem.StartNewGame(); // Turn 1, Action phase (Income auto-advances)

        var phases = new List<TurnPhase>();
        turnSystem.OnPhaseChanged += (phase) => phases.Add(phase);

        // Act - Complete full turn cycle
        turnSystem.AdvancePhase(); // Action -> Combat
        turnSystem.AdvancePhase(); // Combat -> End
        turnSystem.AdvancePhase(); // End -> Income (Turn 2), then Income -> Action

        // Assert
        Assert.Equal(2, turnSystem.CurrentTurn);
        Assert.Equal(TurnPhase.Action, turnSystem.CurrentPhase);
        Assert.Contains(TurnPhase.Combat, phases);
        Assert.Contains(TurnPhase.End, phases);
        Assert.Contains(TurnPhase.Income, phases);
    }

    [Fact]
    public void TurnSystem_UpdatesGameStateLastActionTime()
    {
        // Arrange
        var gameState = new GameState();
        var turnSystem = new TurnSystem(gameState);
        var originalTime = gameState.LastActionTime;

        // Act
        System.Threading.Thread.Sleep(10); // Ensure time difference
        turnSystem.StartNewGame();

        // Assert
        Assert.True(gameState.LastActionTime > originalTime);
    }
}
