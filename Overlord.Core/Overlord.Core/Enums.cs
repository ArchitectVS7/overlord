namespace Overlord.Core;

/// <summary>
/// Represents the faction type in the game.
/// </summary>
public enum FactionType
{
    Player,
    AI,
    Neutral // For unclaimed planets
}

/// <summary>
/// Represents the current phase of a turn.
/// </summary>
public enum TurnPhase
{
    Income,
    Action,
    Combat,
    End
}

/// <summary>
/// Represents the victory condition result.
/// </summary>
public enum VictoryResult
{
    None,
    PlayerVictory,
    AIVictory,
    Draw
}

/// <summary>
/// Represents the type of state change that occurred.
/// </summary>
public enum ChangeType
{
    CraftAdded,
    CraftRemoved,
    PlatoonAdded,
    PlatoonRemoved,
    ResourcesChanged,
    TurnChanged,
    PhaseChanged
}

/// <summary>
/// Resource types in the game.
/// </summary>
public enum ResourceType
{
    Food,      // Feeds population, required for growth
    Minerals,  // Building material for structures and craft
    Fuel,      // Powers craft movement and construction
    Energy,    // Powers structures and systems
    Credits    // Currency for purchases
}
