using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic platoon management system.
/// Handles platoon commissioning, training, decommissioning, and military strength calculations.
/// </summary>
public class PlatoonSystem
{
    private readonly GameState _gameState;
    private readonly EntitySystem _entitySystem;

    /// <summary>
    /// Event fired when a platoon is commissioned.
    /// Parameters: (platoonID)
    /// </summary>
    public event Action<int>? OnPlatoonCommissioned;

    /// <summary>
    /// Event fired when a platoon is decommissioned.
    /// Parameters: (platoonID)
    /// </summary>
    public event Action<int>? OnPlatoonDecommissioned;

    /// <summary>
    /// Event fired when a platoon completes training.
    /// Parameters: (platoonID)
    /// </summary>
    public event Action<int>? OnPlatoonTrainingComplete;

    // Training constants
    public const int TrainingTurns = 10;
    public const int TrainingPerTurn = 10; // 10% per turn
    public const int StarbasePlanetID = 0; // Assumed Starbase is planet 0

    // Troop limits
    public const int MinTroops = 1;
    public const int MaxTroops = 200;

    public PlatoonSystem(GameState gameState, EntitySystem entitySystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _entitySystem = entitySystem ?? throw new ArgumentNullException(nameof(entitySystem));
    }

    /// <summary>
    /// Commissions a new platoon (draft troops, purchase equipment/weapons, begin training).
    /// </summary>
    /// <param name="planetID">Planet ID where platoon is commissioned</param>
    /// <param name="owner">Faction owner</param>
    /// <param name="troopCount">Number of troops (1-200)</param>
    /// <param name="equipment">Equipment level</param>
    /// <param name="weapon">Weapon level</param>
    /// <param name="name">Optional custom name</param>
    /// <returns>Platoon ID if successful, -1 if failed</returns>
    public int CommissionPlatoon(int planetID, FactionType owner, int troopCount,
        EquipmentLevel equipment, WeaponLevel weapon, string? name = null)
    {
        // Validate planet exists
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return -1;

        // Validate troop count
        if (troopCount < MinTroops || troopCount > MaxTroops)
            return -1;

        // Validate platoon limit
        if (!_entitySystem.CanCreatePlatoon())
            return -1; // Limit reached (24/24)

        // Get total cost
        int totalCost = PlatoonCosts.GetTotalCost(equipment, weapon);

        // Validate resources
        if (planet.Resources.Credits < totalCost)
            return -1; // Insufficient credits

        // Validate population (need troops)
        if (planet.Population < troopCount)
            return -1; // Insufficient population

        // Deduct cost
        planet.Resources.Credits -= totalCost;

        // Draft troops from population
        planet.Population -= troopCount;

        // Create platoon entity
        int platoonID = _entitySystem.CreatePlatoon(planetID, owner, 0, name);

        // Get platoon and configure it
        if (_gameState.PlatoonLookup.TryGetValue(platoonID, out var platoon))
        {
            platoon.TroopCount = troopCount;
            platoon.Equipment = equipment;
            platoon.Weapon = weapon;
            platoon.TrainingLevel = 0;
            platoon.TrainingTurnsRemaining = planetID == StarbasePlanetID ? TrainingTurns : 0; // Only train at Starbase
            platoon.Strength = CalculateMilitaryStrength(platoon);
        }

        OnPlatoonCommissioned?.Invoke(platoonID);
        return platoonID;
    }

    /// <summary>
    /// Decommissions a platoon (disband, return troops to population).
    /// Equipment cannot be sold back (design decision).
    /// </summary>
    /// <param name="platoonID">Platoon ID to decommission</param>
    /// <returns>True if decommissioned, false if failed</returns>
    public bool DecommissionPlatoon(int platoonID)
    {
        // Get platoon
        if (!_gameState.PlatoonLookup.TryGetValue(platoonID, out var platoon))
            return false;

        // Get planet (troops return to planet where platoon is located)
        if (!_gameState.PlanetLookup.TryGetValue(platoon.PlanetID, out var planet))
            return false; // Cannot decommission if carried by craft or invalid location

        // Return troops to population
        planet.Population += platoon.TroopCount;

        // Destroy platoon entity
        _entitySystem.DestroyPlatoon(platoonID);

        OnPlatoonDecommissioned?.Invoke(platoonID);
        return true;
    }

    /// <summary>
    /// Updates training for all platoons (called each turn during Income Phase).
    /// Only platoons at Starbase can train.
    /// </summary>
    public void UpdateTraining()
    {
        var trainingPlatoons = _gameState.Platoons
            .Where(p => p.IsTraining && p.PlanetID == StarbasePlanetID)
            .ToList();

        foreach (var platoon in trainingPlatoons)
        {
            // Increment training
            platoon.TrainingLevel = Math.Min(100, platoon.TrainingLevel + TrainingPerTurn);
            platoon.TrainingTurnsRemaining = Math.Max(0, platoon.TrainingTurnsRemaining - 1);

            // Recalculate strength
            platoon.Strength = CalculateMilitaryStrength(platoon);

            // Fire event if training complete
            if (platoon.IsFullyTrained)
            {
                OnPlatoonTrainingComplete?.Invoke(platoon.ID);
            }
        }
    }

    /// <summary>
    /// Calculates military strength for a platoon.
    /// Formula: Troops × Equipment × Weapon × Training
    /// </summary>
    public int CalculateMilitaryStrength(PlatoonEntity platoon)
    {
        return PlatoonModifiers.CalculateMilitaryStrength(
            platoon.TroopCount,
            platoon.Equipment,
            platoon.Weapon,
            platoon.TrainingLevel
        );
    }

    /// <summary>
    /// Gets the estimated strength for a platoon configuration (used for UI preview).
    /// </summary>
    public int GetEstimatedStrength(int troopCount, EquipmentLevel equipment, WeaponLevel weapon, int trainingLevel = 100)
    {
        return PlatoonModifiers.CalculateMilitaryStrength(troopCount, equipment, weapon, trainingLevel);
    }

    /// <summary>
    /// Gets all platoons owned by a faction.
    /// </summary>
    public List<PlatoonEntity> GetPlatoons(FactionType owner)
    {
        return _entitySystem.GetPlatoons(owner);
    }

    /// <summary>
    /// Gets all platoons at a specific planet.
    /// </summary>
    public List<PlatoonEntity> GetPlatoonsAtPlanet(int planetID)
    {
        return _entitySystem.GetPlatoonsAtPlanet(planetID);
    }

    /// <summary>
    /// Gets all platoons currently under training.
    /// </summary>
    public List<PlatoonEntity> GetTrainingPlatoons()
    {
        return _gameState.Platoons.Where(p => p.IsTraining).ToList();
    }

    /// <summary>
    /// Gets all fully trained platoons.
    /// </summary>
    public List<PlatoonEntity> GetFullyTrainedPlatoons()
    {
        return _gameState.Platoons.Where(p => p.IsFullyTrained).ToList();
    }

    /// <summary>
    /// Checks if a platoon can be commissioned (validates limit only).
    /// </summary>
    public bool CanCommissionPlatoon()
    {
        return _entitySystem.CanCreatePlatoon();
    }

    /// <summary>
    /// Gets the total military strength for a faction (sum of all platoon strengths).
    /// </summary>
    public int GetTotalMilitaryStrength(FactionType owner)
    {
        return _gameState.Platoons
            .Where(p => p.Owner == owner)
            .Sum(p => p.Strength);
    }

    /// <summary>
    /// Gets the platoon count for a faction.
    /// </summary>
    public int GetPlatoonCount(FactionType owner)
    {
        return _entitySystem.GetPlatoonCount(owner);
    }

    /// <summary>
    /// Validates if a platoon commission is affordable (resources and population).
    /// </summary>
    public bool CanAffordPlatoon(int planetID, int troopCount, EquipmentLevel equipment, WeaponLevel weapon)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        int totalCost = PlatoonCosts.GetTotalCost(equipment, weapon);

        return planet.Resources.Credits >= totalCost && planet.Population >= troopCount;
    }
}
