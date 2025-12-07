using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic entity management system.
/// Manages entity lifecycle, ID generation, and entity limits.
/// </summary>
public class EntitySystem
{
    private readonly GameState _gameState;

    /// <summary>
    /// Event fired when a craft is created.
    /// Parameters: (craftID)
    /// </summary>
    public event Action<int>? OnCraftCreated;

    /// <summary>
    /// Event fired when a craft is destroyed.
    /// Parameters: (craftID)
    /// </summary>
    public event Action<int>? OnCraftDestroyed;

    /// <summary>
    /// Event fired when a platoon is created.
    /// Parameters: (platoonID)
    /// </summary>
    public event Action<int>? OnPlatoonCreated;

    /// <summary>
    /// Event fired when a platoon is destroyed.
    /// Parameters: (platoonID)
    /// </summary>
    public event Action<int>? OnPlatoonDestroyed;

    // Entity limits
    public const int MaxCraft = 32;
    public const int MaxPlatoons = 24;

    // Next IDs for entity creation
    private int _nextCraftID = 0;
    private int _nextPlatoonID = 0;

    public EntitySystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));

        // Initialize next IDs based on existing entities
        if (_gameState.Craft.Count > 0)
            _nextCraftID = _gameState.Craft.Max(c => c.ID) + 1;

        if (_gameState.Platoons.Count > 0)
            _nextPlatoonID = _gameState.Platoons.Max(p => p.ID) + 1;
    }

    #region Craft Management

    /// <summary>
    /// Checks if a new craft can be created (under limit).
    /// </summary>
    public bool CanCreateCraft()
    {
        return _gameState.Craft.Count < MaxCraft;
    }

    /// <summary>
    /// Creates a new craft entity.
    /// </summary>
    /// <param name="type">Craft type</param>
    /// <param name="planetID">Starting planet ID</param>
    /// <param name="owner">Faction owner</param>
    /// <param name="name">Custom name (optional)</param>
    /// <returns>Craft ID, or -1 if limit reached</returns>
    public int CreateCraft(CraftType type, int planetID, FactionType owner, string? name = null)
    {
        if (!CanCreateCraft())
            return -1;

        int id = _nextCraftID++;
        var craft = new CraftEntity
        {
            ID = id,
            Name = name ?? GenerateCraftName(type, id),
            Type = type,
            Owner = owner,
            PlanetID = planetID,
            InTransit = false,
            Health = 100,
            Active = false,
            DeployedAtPlanetID = -1,
            TerraformingTurnsRemaining = 0
        };

        // Set position to planet position
        if (_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
        {
            craft.Position = new Position3D(planet.Position.X, planet.Position.Y, planet.Position.Z);
        }

        _gameState.Craft.Add(craft);
        _gameState.RebuildLookups();

        OnCraftCreated?.Invoke(id);
        return id;
    }

    /// <summary>
    /// Destroys a craft entity.
    /// </summary>
    /// <param name="craftID">Craft ID</param>
    /// <returns>True if destroyed, false if not found</returns>
    public bool DestroyCraft(int craftID)
    {
        var craft = _gameState.Craft.FirstOrDefault(c => c.ID == craftID);
        if (craft == null)
            return false;

        _gameState.Craft.Remove(craft);
        _gameState.RebuildLookups();

        OnCraftDestroyed?.Invoke(craftID);
        return true;
    }

    /// <summary>
    /// Gets craft entities by owner.
    /// </summary>
    public List<CraftEntity> GetCraft(FactionType owner)
    {
        return _gameState.Craft.Where(c => c.Owner == owner).ToList();
    }

    /// <summary>
    /// Gets craft entities at a specific planet.
    /// </summary>
    public List<CraftEntity> GetCraftAtPlanet(int planetID)
    {
        return _gameState.Craft.Where(c => c.PlanetID == planetID && !c.InTransit).ToList();
    }

    /// <summary>
    /// Gets craft entities currently in transit.
    /// </summary>
    public List<CraftEntity> GetCraftInTransit()
    {
        return _gameState.Craft.Where(c => c.InTransit).ToList();
    }

    #endregion

    #region Platoon Management

    /// <summary>
    /// Checks if a new platoon can be created (under limit).
    /// </summary>
    public bool CanCreatePlatoon()
    {
        return _gameState.Platoons.Count < MaxPlatoons;
    }

    /// <summary>
    /// Creates a new platoon entity.
    /// </summary>
    /// <param name="planetID">Starting planet ID</param>
    /// <param name="owner">Faction owner</param>
    /// <param name="strength">Initial strength</param>
    /// <param name="name">Custom name (optional)</param>
    /// <returns>Platoon ID, or -1 if limit reached</returns>
    public int CreatePlatoon(int planetID, FactionType owner, int strength = 100, string? name = null)
    {
        if (!CanCreatePlatoon())
            return -1;

        int id = _nextPlatoonID++;
        var platoon = new PlatoonEntity
        {
            ID = id,
            Name = name ?? GeneratePlatoonName(id),
            Owner = owner,
            PlanetID = planetID,
            Strength = strength
        };

        _gameState.Platoons.Add(platoon);
        _gameState.RebuildLookups();

        OnPlatoonCreated?.Invoke(id);
        return id;
    }

    /// <summary>
    /// Destroys a platoon entity.
    /// </summary>
    /// <param name="platoonID">Platoon ID</param>
    /// <returns>True if destroyed, false if not found</returns>
    public bool DestroyPlatoon(int platoonID)
    {
        var platoon = _gameState.Platoons.FirstOrDefault(p => p.ID == platoonID);
        if (platoon == null)
            return false;

        _gameState.Platoons.Remove(platoon);
        _gameState.RebuildLookups();

        OnPlatoonDestroyed?.Invoke(platoonID);
        return true;
    }

    /// <summary>
    /// Gets platoon entities by owner.
    /// </summary>
    public List<PlatoonEntity> GetPlatoons(FactionType owner)
    {
        return _gameState.Platoons.Where(p => p.Owner == owner).ToList();
    }

    /// <summary>
    /// Gets platoon entities at a specific planet.
    /// </summary>
    public List<PlatoonEntity> GetPlatoonsAtPlanet(int planetID)
    {
        return _gameState.Platoons.Where(p => p.PlanetID == planetID).ToList();
    }

    #endregion

    #region Name Generation

    private string GenerateCraftName(CraftType type, int id)
    {
        string prefix = type switch
        {
            CraftType.BattleCruiser => "BC",
            CraftType.CargoCruiser => "CC",
            CraftType.SolarSatellite => "SS",
            CraftType.AtmosphereProcessor => "AP",
            _ => "UNK"
        };

        return $"{prefix}-{id:D3}";
    }

    private string GeneratePlatoonName(int id)
    {
        return $"Platoon-{id:D3}";
    }

    #endregion

    #region Statistics

    /// <summary>
    /// Gets the current craft count.
    /// </summary>
    public int GetCraftCount() => _gameState.Craft.Count;

    /// <summary>
    /// Gets the current platoon count.
    /// </summary>
    public int GetPlatoonCount() => _gameState.Platoons.Count;

    /// <summary>
    /// Gets the craft count for a specific owner.
    /// </summary>
    public int GetCraftCount(FactionType owner) => _gameState.Craft.Count(c => c.Owner == owner);

    /// <summary>
    /// Gets the platoon count for a specific owner.
    /// </summary>
    public int GetPlatoonCount(FactionType owner) => _gameState.Platoons.Count(p => p.Owner == owner);

    #endregion
}
