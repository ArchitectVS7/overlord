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
    // Core Attributes
    public int ID { get; set; }
    public string Name { get; set; } = string.Empty;

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public Models.PlanetType Type { get; set; }

    public FactionType Owner { get; set; }
    public Models.Position3D Position { get; set; } = new Models.Position3D();
    public int VisualSeed { get; set; }

    // Visual Properties
    public float RotationSpeed { get; set; } = 0.3f;
    public float ScaleMultiplier { get; set; } = 1.0f;

    // Resources
    public ResourceCollection Resources { get; set; } = new ResourceCollection();

    // Population
    public int Population { get; set; }
    public int Morale { get; set; } = 50; // 0-100
    public int TaxRate { get; set; } = 50; // 0-100
    public float GrowthRate { get; set; } // Calculated each turn

    // Structures
    public List<Models.Structure> Structures { get; set; } = new List<Models.Structure>();

    // Military Presence
    public List<int> DockedCraftIDs { get; set; } = new List<int>();
    public List<int> GarrisonedPlatoonIDs { get; set; } = new List<int>();

    // Colonization State
    public bool Colonized { get; set; }
    public int TerraformingProgress { get; set; } // 0-10 turns

    // Combat State
    public bool UnderAttack { get; set; }

    /// <summary>
    /// Gets resource production multipliers based on planet type.
    /// </summary>
    [JsonIgnore]
    public Models.ResourceMultipliers ResourceMultipliers
    {
        get
        {
            var multipliers = new Models.ResourceMultipliers();

            switch (Type)
            {
                case Models.PlanetType.Volcanic:
                    multipliers.Minerals = 5.0f;
                    multipliers.Fuel = 3.0f;
                    multipliers.Food = 0.5f;
                    break;

                case Models.PlanetType.Desert:
                    multipliers.Energy = 2.0f;
                    multipliers.Food = 0.25f;
                    break;

                case Models.PlanetType.Tropical:
                    multipliers.Food = 2.0f;
                    multipliers.Energy = 0.75f;
                    break;

                case Models.PlanetType.Metropolis:
                    multipliers.Credits = 2.0f;
                    break;
            }

            return multipliers;
        }
    }

    /// <summary>
    /// Checks if planet is habitable (colonized or Metropolis).
    /// </summary>
    [JsonIgnore]
    public bool IsHabitable => Colonized || Type == Models.PlanetType.Metropolis;

    /// <summary>
    /// Gets count of Docking Bays (max 3).
    /// </summary>
    [JsonIgnore]
    public int DockingBayCount => Structures.Count(s => s.Type == Models.BuildingType.DockingBay && s.Status == Models.BuildingStatus.Active);

    /// <summary>
    /// Gets count of Surface Platforms (max 6).
    /// </summary>
    [JsonIgnore]
    public int SurfacePlatformCount => Structures.Count(s => s.Type != Models.BuildingType.DockingBay && s.Status == Models.BuildingStatus.Active);

    /// <summary>
    /// Checks if another Docking Bay can be built.
    /// </summary>
    public bool CanBuildDockingBay()
    {
        return DockingBayCount < 3;
    }

    /// <summary>
    /// Checks if another Surface Structure can be built.
    /// </summary>
    public bool CanBuildSurfaceStructure()
    {
        return SurfacePlatformCount < 6;
    }

    /// <summary>
    /// Gets available docking slots (2 craft per bay).
    /// </summary>
    public int GetAvailableDockingSlots()
    {
        int maxSlots = DockingBayCount * 2;
        int usedSlots = DockedCraftIDs.Count;
        return Math.Max(0, maxSlots - usedSlots);
    }
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
