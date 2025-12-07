using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic space combat system.
/// Handles fleet-vs-fleet orbital battles, damage calculations, and craft destruction.
/// </summary>
public class SpaceCombatSystem
{
    private readonly GameState _gameState;
    private readonly UpgradeSystem _upgradeSystem;
    private readonly DefenseSystem _defenseSystem;

    /// <summary>
    /// Event fired when space battle starts.
    /// Parameters: (battle)
    /// </summary>
    public event Action<SpaceBattle>? OnSpaceBattleStarted;

    /// <summary>
    /// Event fired when space battle completes.
    /// Parameters: (battle, result)
    /// </summary>
    public event Action<SpaceBattle, SpaceBattleResult>? OnSpaceBattleCompleted;

    /// <summary>
    /// Event fired when craft is destroyed.
    /// Parameters: (craftID, owner)
    /// </summary>
    public event Action<int, FactionType>? OnCraftDestroyed;

    public SpaceCombatSystem(GameState gameState, UpgradeSystem upgradeSystem, DefenseSystem defenseSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _upgradeSystem = upgradeSystem ?? throw new ArgumentNullException(nameof(upgradeSystem));
        _defenseSystem = defenseSystem ?? throw new ArgumentNullException(nameof(defenseSystem));
    }

    /// <summary>
    /// Initiates a space battle at a planet.
    /// </summary>
    /// <param name="planetID">Planet where battle occurs</param>
    /// <param name="attackerFaction">Attacking faction</param>
    /// <returns>Space battle instance if combat initiated, null if no combat possible</returns>
    public SpaceBattle? InitiateSpaceBattle(int planetID, FactionType attackerFaction)
    {
        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return null;

        // Get craft at planet
        var allCraft = _gameState.Craft.Where(c => c.PlanetID == planetID && !c.IsDeployed).ToList();

        // Get attacker and defender craft
        var attackerCraft = allCraft.Where(c => c.Owner == attackerFaction).Select(c => c.ID).ToList();
        var defenderCraft = allCraft.Where(c => c.Owner == planet.Owner).Select(c => c.ID).ToList();

        // Need both sides to have craft
        if (attackerCraft.Count == 0 || defenderCraft.Count == 0)
            return null;

        // Check if defender has orbital defenses
        bool hasOrbitalDefense = _defenseSystem.GetActiveDefensePlatformCount(planetID) > 0;

        // Create battle
        var battle = new SpaceBattle
        {
            PlanetID = planetID,
            PlanetName = planet.Name,
            AttackerFaction = attackerFaction,
            DefenderFaction = planet.Owner,
            AttackerCraftIDs = attackerCraft,
            DefenderCraftIDs = defenderCraft,
            DefenderHasOrbitalDefense = hasOrbitalDefense
        };

        OnSpaceBattleStarted?.Invoke(battle);
        return battle;
    }

    /// <summary>
    /// Executes space combat between two fleets.
    /// </summary>
    /// <param name="battle">Battle to execute</param>
    /// <returns>Battle result</returns>
    public SpaceBattleResult ExecuteSpaceCombat(SpaceBattle battle)
    {
        // Get craft entities
        var attackerFleet = battle.AttackerCraftIDs
            .Select(id => _gameState.CraftLookup.TryGetValue(id, out var c) ? c : null)
            .Where(c => c != null)
            .Cast<CraftEntity>()
            .ToList();

        var defenderFleet = battle.DefenderCraftIDs
            .Select(id => _gameState.CraftLookup.TryGetValue(id, out var c) ? c : null)
            .Where(c => c != null)
            .Cast<CraftEntity>()
            .ToList();

        // Calculate fleet strengths
        int attackerStrength = CalculateFleetStrength(attackerFleet, battle.AttackerFaction);
        int defenderStrength = CalculateFleetStrength(defenderFleet, battle.DefenderFaction);

        // Apply orbital defense bonus
        if (battle.DefenderHasOrbitalDefense)
        {
            float defenseMultiplier = _defenseSystem.GetDefenseMultiplier(battle.PlanetID);
            defenderStrength = (int)Math.Floor(defenderStrength * defenseMultiplier);
        }

        // Determine winner (tie goes to attacker)
        bool attackerWins = attackerStrength >= defenderStrength;

        // Calculate damage
        int winnerStrength = attackerWins ? attackerStrength : defenderStrength;
        int loserStrength = attackerWins ? defenderStrength : attackerStrength;
        float strengthRatio = winnerStrength / (float)Math.Max(1, loserStrength);
        int damagePerCraft = (int)Math.Floor((strengthRatio - 1.0f) * 50f);

        // Apply damage to losing fleet
        var losingFleet = attackerWins ? defenderFleet : attackerFleet;
        var craftDamage = new Dictionary<int, int>();
        var destroyedCraftIDs = new List<int>();

        ApplyDamage(losingFleet, damagePerCraft, craftDamage, destroyedCraftIDs);

        // Remove destroyed craft from game state
        foreach (var craftID in destroyedCraftIDs)
        {
            if (_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            {
                _gameState.Craft.Remove(craft);
                OnCraftDestroyed?.Invoke(craftID, craft.Owner);
            }
        }

        _gameState.RebuildLookups();

        // Create result
        var result = new SpaceBattleResult
        {
            AttackerWins = attackerWins,
            AttackerStrength = attackerStrength,
            DefenderStrength = defenderStrength,
            DamagePerCraft = damagePerCraft,
            DestroyedCraftIDs = destroyedCraftIDs,
            CraftDamage = craftDamage
        };

        OnSpaceBattleCompleted?.Invoke(battle, result);
        return result;
    }

    /// <summary>
    /// Calculates total fleet strength.
    /// </summary>
    /// <param name="fleet">List of craft in fleet</param>
    /// <param name="faction">Faction owning the fleet</param>
    /// <returns>Total strength</returns>
    private int CalculateFleetStrength(List<CraftEntity> fleet, FactionType faction)
    {
        int totalStrength = 0;

        // Get weapon damage modifier for faction
        float weaponMod = _upgradeSystem.GetDamageModifier(faction);

        foreach (var craft in fleet)
        {
            int craftStrength = CalculateCraftStrength(craft, weaponMod);
            totalStrength += craftStrength;
        }

        return totalStrength;
    }

    /// <summary>
    /// Calculates strength for a single craft.
    /// </summary>
    /// <param name="craft">Craft to calculate</param>
    /// <param name="weaponMod">Weapon damage modifier (from UpgradeSystem)</param>
    /// <returns>Craft strength</returns>
    private int CalculateCraftStrength(CraftEntity craft, float weaponMod)
    {
        int baseStrength = craft.Type switch
        {
            CraftType.BattleCruiser => 100,
            CraftType.CargoCruiser => 30,
            _ => 0 // Solar Satellite and Atmosphere Processor don't participate in space combat
        };

        // Apply weapon modifier (Battle Cruiser only)
        if (craft.Type == CraftType.BattleCruiser)
        {
            baseStrength = (int)Math.Floor(baseStrength * weaponMod);
        }

        // Apply damage modifier (current HP / max HP)
        float hpPercent = craft.Health / 100f; // Assume max HP is 100
        int strength = (int)Math.Floor(baseStrength * hpPercent);

        return strength;
    }

    /// <summary>
    /// Applies damage to a fleet, distributing evenly across all craft.
    /// Destroys craft when HP ≤ 0.
    /// </summary>
    /// <param name="fleet">Fleet to damage</param>
    /// <param name="damagePerCraft">Damage per craft</param>
    /// <param name="craftDamage">Output: Dictionary of craft ID to damage taken</param>
    /// <param name="destroyedCraftIDs">Output: List of destroyed craft IDs</param>
    private void ApplyDamage(List<CraftEntity> fleet, int damagePerCraft, Dictionary<int, int> craftDamage, List<int> destroyedCraftIDs)
    {
        foreach (var craft in fleet)
        {
            // Apply damage
            craft.Health -= damagePerCraft;
            craftDamage[craft.ID] = damagePerCraft;

            // Check if destroyed
            if (craft.Health <= 0)
            {
                destroyedCraftIDs.Add(craft.ID);
            }
        }
    }

    /// <summary>
    /// Gets all hostile craft at a planet (for detecting space battles).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="faction">Faction to check against</param>
    /// <returns>List of hostile craft IDs</returns>
    public List<int> GetHostileCraftAtPlanet(int planetID, FactionType faction)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return new List<int>();

        return _gameState.Craft
            .Where(c => c.PlanetID == planetID && c.Owner != faction && !c.IsDeployed)
            .Select(c => c.ID)
            .ToList();
    }

    /// <summary>
    /// Checks if a space battle should occur at a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>True if hostile fleets are present</returns>
    public bool ShouldSpaceBattleOccur(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        var craft = _gameState.Craft.Where(c => c.PlanetID == planetID && !c.IsDeployed).ToList();

        // Check if multiple factions have craft at this planet
        var factions = craft.Select(c => c.Owner).Distinct().ToList();
        return factions.Count > 1; // Battle if multiple factions present
    }
}
