using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic bombardment system.
/// Handles orbital bombardment, structure destruction, and civilian casualties.
/// </summary>
public class BombardmentSystem
{
    private readonly GameState _gameState;
    private readonly Random _random;

    /// <summary>
    /// Event fired when bombardment starts.
    /// Parameters: (planetID, strength)
    /// </summary>
    public event Action<int, int>? OnBombardmentStarted;

    /// <summary>
    /// Event fired when structure is destroyed.
    /// Parameters: (structureID, planetID)
    /// </summary>
    public event Action<int, int>? OnStructureDestroyed;

    /// <summary>
    /// Event fired when civilian casualties occur.
    /// Parameters: (planetID, casualties)
    /// </summary>
    public event Action<int, int>? OnCivilianCasualties;

    public BombardmentSystem(GameState gameState, Random? random = null)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _random = random ?? new Random();
    }

    /// <summary>
    /// Executes orbital bombardment of a planet.
    /// </summary>
    /// <param name="planetID">Target planet ID</param>
    /// <param name="attackerFaction">Attacking faction</param>
    /// <returns>Bombardment result if successful, null if failed</returns>
    public BombardmentResult? BombardPlanet(int planetID, FactionType attackerFaction)
    {
        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return null;

        // Cannot bombard own planets
        if (planet.Owner == attackerFaction)
            return null;

        // Must control orbit (no enemy craft)
        if (!HasOrbitalControl(planetID, attackerFaction))
            return null;

        // Calculate bombardment strength (Battle Cruisers × 50)
        var battleCruisers = GetBattleCruisersInOrbit(planetID, attackerFaction);
        if (battleCruisers.Count == 0)
            return null; // No bombardment craft

        int bombardmentStrength = battleCruisers.Count * 50;

        OnBombardmentStarted?.Invoke(planetID, bombardmentStrength);

        // Destroy structures
        var destroyedStructures = DestroyStructures(planet, bombardmentStrength);

        // Cause civilian casualties
        int casualties = CauseCasualties(planet, bombardmentStrength);

        // Reduce morale by 20%
        int oldMorale = planet.Morale;
        planet.Morale = Math.Max(0, planet.Morale - 20);

        // Create result
        var result = new BombardmentResult
        {
            PlanetID = planetID,
            BombardmentStrength = bombardmentStrength,
            StructuresDestroyed = destroyedStructures.Count,
            DestroyedStructureIDs = destroyedStructures,
            CivilianCasualties = casualties,
            NewMorale = planet.Morale
        };

        return result;
    }

    /// <summary>
    /// Destroys structures based on bombardment strength.
    /// </summary>
    /// <param name="planet">Target planet</param>
    /// <param name="bombardmentStrength">Bombardment strength</param>
    /// <returns>List of destroyed structure IDs</returns>
    private List<int> DestroyStructures(PlanetEntity planet, int bombardmentStrength)
    {
        var destroyedStructureIDs = new List<int>();

        // Calculate number of structures to destroy (max 3)
        int structuresToDestroy = Math.Min(bombardmentStrength / 100, 3);

        // Get vulnerable structures (exclude Docking Bays and Orbital Defense)
        var vulnerableStructures = planet.Structures
            .Where(s => s.Type != BuildingType.DockingBay &&
                       s.Type != BuildingType.OrbitalDefense &&
                       s.Status == BuildingStatus.Active)
            .ToList();

        if (vulnerableStructures.Count == 0)
            return destroyedStructureIDs;

        // Randomly select structures to destroy
        for (int i = 0; i < structuresToDestroy && vulnerableStructures.Count > 0; i++)
        {
            int randomIndex = _random.Next(vulnerableStructures.Count);
            var structure = vulnerableStructures[randomIndex];

            // Destroy structure
            planet.Structures.Remove(structure);
            destroyedStructureIDs.Add(structure.ID);
            vulnerableStructures.RemoveAt(randomIndex);

            OnStructureDestroyed?.Invoke(structure.ID, planet.ID);
        }

        _gameState.RebuildLookups();
        return destroyedStructureIDs;
    }

    /// <summary>
    /// Causes civilian casualties (10% of bombardment strength).
    /// </summary>
    /// <param name="planet">Target planet</param>
    /// <param name="bombardmentStrength">Bombardment strength</param>
    /// <returns>Number of casualties</returns>
    private int CauseCasualties(PlanetEntity planet, int bombardmentStrength)
    {
        int casualties = (int)Math.Floor(bombardmentStrength * 0.1f); // 10% of strength
        casualties = Math.Min(casualties, planet.Population); // Cannot kill more than population

        planet.Population -= casualties;

        OnCivilianCasualties?.Invoke(planet.ID, casualties);
        return casualties;
    }

    /// <summary>
    /// Checks if faction controls orbit (no enemy craft).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="faction">Faction checking control</param>
    /// <returns>True if faction controls orbit</returns>
    public bool HasOrbitalControl(int planetID, FactionType faction)
    {
        var craftInOrbit = _gameState.Craft
            .Where(c => c.PlanetID == planetID && !c.IsDeployed)
            .ToList();

        // No enemy craft = orbital control
        var enemyCraft = craftInOrbit.Where(c => c.Owner != faction).ToList();
        return enemyCraft.Count == 0;
    }

    /// <summary>
    /// Gets Battle Cruisers in orbit for a faction.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="faction">Faction</param>
    /// <returns>List of Battle Cruisers</returns>
    private List<CraftEntity> GetBattleCruisersInOrbit(int planetID, FactionType faction)
    {
        return _gameState.Craft
            .Where(c => c.PlanetID == planetID &&
                       c.Owner == faction &&
                       c.Type == CraftType.BattleCruiser &&
                       !c.IsDeployed)
            .ToList();
    }
}
