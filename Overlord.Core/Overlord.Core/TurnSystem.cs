using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Manages turn-based game loop with Income, Action, Combat, and End phases.
/// Platform-agnostic implementation that can be wrapped by Unity.
/// </summary>
public class TurnSystem
{
    private readonly GameState _gameState;

    /// <summary>
    /// Fired when a turn phase changes.
    /// </summary>
    public event Action<TurnPhase>? OnPhaseChanged;

    /// <summary>
    /// Fired when a new turn begins (after turn counter increments).
    /// </summary>
    public event Action<int>? OnTurnStarted;

    /// <summary>
    /// Fired when a turn ends (before turn counter increments).
    /// </summary>
    public event Action<int>? OnTurnEnded;

    /// <summary>
    /// Fired when victory or defeat condition is met.
    /// </summary>
    public event Action<VictoryResult>? OnVictoryAchieved;

    /// <summary>
    /// Fired when income is calculated for a phase.
    /// </summary>
    public event Action<ResourceDelta>? OnIncomeCalculated;

    public TurnSystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
    }

    /// <summary>
    /// Advances to the next turn phase.
    /// Call this when the player presses "End Turn" during Action phase.
    /// </summary>
    public void AdvancePhase()
    {
        var currentPhase = _gameState.CurrentPhase;

        switch (currentPhase)
        {
            case TurnPhase.Income:
                // Auto-transition to Action phase after income calculation
                TransitionToPhase(TurnPhase.Action);
                break;

            case TurnPhase.Action:
                // Player ended their turn, move to Combat phase
                TransitionToPhase(TurnPhase.Combat);
                break;

            case TurnPhase.Combat:
                // Combat resolved, move to End phase
                TransitionToPhase(TurnPhase.End);
                break;

            case TurnPhase.End:
                // End phase complete, start new turn at Income phase
                CompleteTurn();
                break;
        }
    }

    /// <summary>
    /// Processes the Income phase (resource generation, population growth).
    /// Returns the total income delta for the active faction.
    /// </summary>
    public ResourceDelta ProcessIncomePhase()
    {
        if (_gameState.CurrentPhase != TurnPhase.Income)
        {
            throw new InvalidOperationException($"Cannot process income during {_gameState.CurrentPhase} phase");
        }

        // For now, return a simple income calculation
        // In full implementation, this would calculate based on planets, buildings, etc.
        var income = new ResourceDelta
        {
            Credits = 1000,
            Minerals = 500,
            Fuel = 300,
            Food = 200,
            Energy = 400
        };

        // Apply income to player faction
        _gameState.PlayerFaction.Resources.Add(income);

        OnIncomeCalculated?.Invoke(income);

        return income;
    }

    /// <summary>
    /// Checks victory/defeat conditions.
    /// Returns None if game should continue.
    /// </summary>
    public VictoryResult CheckVictoryConditions()
    {
        // Player Victory: AI has zero platoons AND zero owned planets
        var aiPlatoons = _gameState.Platoons.Count(p => p.Owner == FactionType.AI);
        var aiPlanets = _gameState.Planets.Count(p => p.Owner == FactionType.AI);

        if (aiPlatoons == 0 && aiPlanets == 0)
        {
            return VictoryResult.PlayerVictory;
        }

        // Player Defeat: Player has zero platoons AND zero owned planets
        var playerPlatoons = _gameState.Platoons.Count(p => p.Owner == FactionType.Player);
        var playerPlanets = _gameState.Planets.Count(p => p.Owner == FactionType.Player);

        if (playerPlatoons == 0 && playerPlanets == 0)
        {
            return VictoryResult.AIVictory;
        }

        // Economic Collapse: Player cannot produce resources AND has <100 of each resource
        if (playerPlanets == 0 &&
            _gameState.PlayerFaction.Resources.Credits < 100 &&
            _gameState.PlayerFaction.Resources.Minerals < 100 &&
            _gameState.PlayerFaction.Resources.Fuel < 100 &&
            _gameState.PlayerFaction.Resources.Food < 100 &&
            _gameState.PlayerFaction.Resources.Energy < 100)
        {
            return VictoryResult.AIVictory;
        }

        return VictoryResult.None;
    }

    /// <summary>
    /// Starts a new game, initializing to turn 1 at Income phase.
    /// Income phase auto-advances to Action phase after processing.
    /// </summary>
    public void StartNewGame()
    {
        _gameState.CurrentTurn = 1;
        _gameState.LastActionTime = DateTime.UtcNow;

        OnTurnStarted?.Invoke(_gameState.CurrentTurn);

        // Transition to Income phase (which will auto-advance to Action)
        TransitionToPhase(TurnPhase.Income);
    }

    /// <summary>
    /// Gets the current turn number.
    /// </summary>
    public int CurrentTurn => _gameState.CurrentTurn;

    /// <summary>
    /// Gets the current turn phase.
    /// </summary>
    public TurnPhase CurrentPhase => _gameState.CurrentPhase;

    private void TransitionToPhase(TurnPhase newPhase)
    {
        _gameState.CurrentPhase = newPhase;
        _gameState.LastActionTime = DateTime.UtcNow;

        OnPhaseChanged?.Invoke(newPhase);

        // Auto-advance Income phase
        if (newPhase == TurnPhase.Income)
        {
            ProcessIncomePhase();
            AdvancePhase(); // Auto-transition to Action
        }
    }

    private void CompleteTurn()
    {
        // Check victory conditions before ending turn
        var victoryResult = CheckVictoryConditions();
        if (victoryResult != VictoryResult.None)
        {
            OnVictoryAchieved?.Invoke(victoryResult);
            return; // Game ends, don't increment turn
        }

        // Fire turn ended event
        OnTurnEnded?.Invoke(_gameState.CurrentTurn);

        // Increment turn counter
        _gameState.CurrentTurn++;
        _gameState.LastActionTime = DateTime.UtcNow;

        // Fire turn started event
        OnTurnStarted?.Invoke(_gameState.CurrentTurn);

        // Transition to next Income phase
        TransitionToPhase(TurnPhase.Income);
    }
}
