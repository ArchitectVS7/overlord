using System.Text.Json.Serialization;

namespace Overlord.Core;

/// <summary>
/// Central game state container that maintains complete game state.
/// Serializable to JSON for save/load operations.
/// </summary>
public class GameState
{
    /// <summary>
    /// Current turn number (starts at 1).
    /// </summary>
    public int CurrentTurn { get; set; } = 1;

    /// <summary>
    /// Current phase of the turn.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public TurnPhase CurrentPhase { get; set; } = TurnPhase.Income;

    /// <summary>
    /// Timestamp of last action for auto-save timing.
    /// </summary>
    public DateTime LastActionTime { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// All craft entities in the game (max 32).
    /// </summary>
    public List<CraftEntity> Craft { get; set; } = new List<CraftEntity>(32);

    /// <summary>
    /// All platoon entities in the game (max 24).
    /// </summary>
    public List<PlatoonEntity> Platoons { get; set; } = new List<PlatoonEntity>(24);

    /// <summary>
    /// All planet entities in the game (4-6 per game).
    /// </summary>
    public List<PlanetEntity> Planets { get; set; } = new List<PlanetEntity>(6);

    /// <summary>
    /// Player faction state.
    /// </summary>
    public FactionState PlayerFaction { get; set; } = new FactionState();

    /// <summary>
    /// AI faction state.
    /// </summary>
    public FactionState AIFaction { get; set; } = new FactionState();

    /// <summary>
    /// Lookup dictionary for craft entities by ID (not serialized, rebuilt after load).
    /// </summary>
    [JsonIgnore]
    public Dictionary<int, CraftEntity> CraftLookup { get; private set; } = new Dictionary<int, CraftEntity>();

    /// <summary>
    /// Lookup dictionary for platoon entities by ID (not serialized, rebuilt after load).
    /// </summary>
    [JsonIgnore]
    public Dictionary<int, PlatoonEntity> PlatoonLookup { get; private set; } = new Dictionary<int, PlatoonEntity>();

    /// <summary>
    /// Lookup dictionary for planet entities by ID (not serialized, rebuilt after load).
    /// </summary>
    [JsonIgnore]
    public Dictionary<int, PlanetEntity> PlanetLookup { get; private set; } = new Dictionary<int, PlanetEntity>();

    /// <summary>
    /// Rebuilds lookup dictionaries after deserialization for O(1) entity access.
    /// </summary>
    public void RebuildLookups()
    {
        CraftLookup = Craft.ToDictionary(c => c.ID);
        PlatoonLookup = Platoons.ToDictionary(p => p.ID);
        PlanetLookup = Planets.ToDictionary(p => p.ID);
    }

    /// <summary>
    /// Validates the game state for consistency.
    /// </summary>
    /// <returns>True if state is valid, false otherwise.</returns>
    public bool Validate()
    {
        // Check entity limits
        if (Craft.Count > 32) return false;
        if (Platoons.Count > 24) return false;
        if (Planets.Count > 6) return false;

        // Check for duplicate IDs
        if (Craft.Select(c => c.ID).Distinct().Count() != Craft.Count) return false;
        if (Platoons.Select(p => p.ID).Distinct().Count() != Platoons.Count) return false;
        if (Planets.Select(p => p.ID).Distinct().Count() != Planets.Count) return false;

        // Turn number must be positive
        if (CurrentTurn < 1) return false;

        return true;
    }
}

/// <summary>
/// Represents a craft (ship) entity in the game.
/// </summary>
public class CraftEntity
{
    public int ID { get; set; }
    public string Name { get; set; } = string.Empty;
    public int PlanetID { get; set; }
    public FactionType Owner { get; set; }
    public int Health { get; set; } = 100;
    public int Attack { get; set; } = 10;
    public int Defense { get; set; } = 10;
}

/// <summary>
/// Represents a platoon (ground unit) entity in the game.
/// </summary>
public class PlatoonEntity
{
    public int ID { get; set; }
    public string Name { get; set; } = string.Empty;
    public int PlanetID { get; set; }
    public FactionType Owner { get; set; }
    public int Strength { get; set; } = 100;
}

/// <summary>
/// Represents a planet entity in the game.
/// </summary>
public class PlanetEntity
{
    public int ID { get; set; }
    public string Name { get; set; } = string.Empty;
    public FactionType Owner { get; set; }
    public ResourceCollection Resources { get; set; } = new ResourceCollection();
    public int Population { get; set; }
}

/// <summary>
/// Represents the state of a faction (player or AI).
/// </summary>
public class FactionState
{
    public List<int> OwnedPlanetIDs { get; set; } = new List<int>();
    public int MilitaryStrength { get; set; }
    public ResourceCollection Resources { get; set; } = new ResourceCollection();
}

/// <summary>
/// Represents a collection of resources.
/// </summary>
public class ResourceCollection
{
    public int Credits { get; set; }
    public int Minerals { get; set; }
    public int Fuel { get; set; }
    public int Food { get; set; }
    public int Energy { get; set; }

    /// <summary>
    /// Adds resources from a delta.
    /// </summary>
    public void Add(Models.ResourceDelta delta)
    {
        Credits += delta.Credits;
        Minerals += delta.Minerals;
        Fuel += delta.Fuel;
        Food += delta.Food;
        Energy += delta.Energy;
    }

    /// <summary>
    /// Checks if this collection can afford a delta (all values would remain non-negative).
    /// </summary>
    public bool CanAfford(Models.ResourceDelta delta)
    {
        return Credits + delta.Credits >= 0 &&
               Minerals + delta.Minerals >= 0 &&
               Fuel + delta.Fuel >= 0 &&
               Food + delta.Food >= 0 &&
               Energy + delta.Energy >= 0;
    }
}
