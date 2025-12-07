using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic ground combat system.
/// Handles platoon vs platoon combat, casualty calculations, and planet ownership transfer.
/// </summary>
public class CombatSystem
{
    private readonly GameState _gameState;
    private readonly PlatoonSystem _platoonSystem;

    /// <summary>
    /// Event fired when battle starts.
    /// Parameters: (battle)
    /// </summary>
    public event Action<Battle>? OnBattleStarted;

    /// <summary>
    /// Event fired when battle completes.
    /// Parameters: (battle, result)
    /// </summary>
    public event Action<Battle, BattleResult>? OnBattleCompleted;

    /// <summary>
    /// Event fired when planet is captured.
    /// Parameters: (planetID, newOwner)
    /// </summary>
    public event Action<int, FactionType>? OnPlanetCaptured;

    public CombatSystem(GameState gameState, PlatoonSystem platoonSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _platoonSystem = platoonSystem ?? throw new ArgumentNullException(nameof(platoonSystem));
    }

    /// <summary>
    /// Initiates a ground battle at a planet.
    /// </summary>
    /// <param name="planetID">Planet where battle occurs</param>
    /// <param name="attackerFaction">Attacking faction</param>
    /// <param name="attackingPlatoonIDs">Platoon IDs of attackers</param>
    /// <returns>Battle instance if combat initiated, null if no combat possible</returns>
    public Battle? InitiateBattle(int planetID, FactionType attackerFaction, List<int> attackingPlatoonIDs)
    {
        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return null;

        // Get defending platoons (garrisoned on planet, owned by defender)
        var defendingPlatoonIDs = _gameState.Platoons
            .Where(p => p.PlanetID == planetID && p.Owner == planet.Owner)
            .Select(p => p.ID)
            .ToList();

        // Need both sides to have forces
        if (attackingPlatoonIDs.Count == 0 || defendingPlatoonIDs.Count == 0)
            return null;

        // Create battle
        var battle = new Battle
        {
            PlanetID = planetID,
            PlanetName = planet.Name,
            AttackerFaction = attackerFaction,
            DefenderFaction = planet.Owner,
            AttackingPlatoonIDs = attackingPlatoonIDs,
            DefendingPlatoonIDs = defendingPlatoonIDs
        };

        OnBattleStarted?.Invoke(battle);
        return battle;
    }

    /// <summary>
    /// Executes ground combat.
    /// </summary>
    /// <param name="battle">Battle to execute</param>
    /// <param name="aggressionPercent">Attacker aggression (0-100)</param>
    /// <returns>Battle result</returns>
    public BattleResult ExecuteCombat(Battle battle, int aggressionPercent = 50)
    {
        // Clamp aggression
        aggressionPercent = Math.Clamp(aggressionPercent, 0, 100);

        // Get platoons
        var attackers = battle.AttackingPlatoonIDs
            .Select(id => _gameState.PlatoonLookup.TryGetValue(id, out var p) ? p : null)
            .Where(p => p != null)
            .Cast<PlatoonEntity>()
            .ToList();

        var defenders = battle.DefendingPlatoonIDs
            .Select(id => _gameState.PlatoonLookup.TryGetValue(id, out var p) ? p : null)
            .Where(p => p != null)
            .Cast<PlatoonEntity>()
            .ToList();

        // Calculate military strengths
        int attackerStrength = CalculateStrength(attackers);
        int defenderStrength = CalculateStrength(defenders);

        // Apply aggression modifier (0.8 to 1.2)
        float aggressionMod = 0.8f + (aggressionPercent / 100f) * 0.4f;
        attackerStrength = (int)Math.Floor(attackerStrength * aggressionMod);

        // Determine winner
        bool attackerWins = attackerStrength > defenderStrength;

        // Calculate casualties
        var attackerCasualties = CalculateCasualties(attackers, attackerStrength, defenderStrength, attackerWins, aggressionPercent);
        var defenderCasualties = CalculateCasualties(defenders, defenderStrength, attackerStrength, !attackerWins, 50); // AI uses 50%

        // Apply casualties
        ApplyCasualties(attackers, attackerCasualties);
        ApplyCasualties(defenders, defenderCasualties);

        // Combine casualty dictionaries
        var allCasualties = new Dictionary<int, int>(attackerCasualties);
        foreach (var kvp in defenderCasualties)
        {
            allCasualties[kvp.Key] = kvp.Value;
        }

        // Create result
        var result = new BattleResult
        {
            AttackerWins = attackerWins,
            AttackerStrength = attackerStrength,
            DefenderStrength = defenderStrength,
            AttackerCasualties = attackerCasualties.Values.Sum(),
            DefenderCasualties = defenderCasualties.Values.Sum(),
            PlanetCaptured = attackerWins,
            PlatoonCasualties = allCasualties
        };

        // Transfer planet ownership if attacker wins
        if (attackerWins)
        {
            var planet = _gameState.PlanetLookup[battle.PlanetID];
            planet.Owner = battle.AttackerFaction;

            // Destroy defender platoons
            foreach (var platoon in defenders)
            {
                _gameState.Platoons.Remove(platoon);
            }

            _gameState.RebuildLookups();

            OnPlanetCaptured?.Invoke(battle.PlanetID, battle.AttackerFaction);
        }
        else
        {
            // Destroy attacker platoons
            foreach (var platoon in attackers)
            {
                _gameState.Platoons.Remove(platoon);
            }

            _gameState.RebuildLookups();
        }

        OnBattleCompleted?.Invoke(battle, result);
        return result;
    }

    /// <summary>
    /// Calculates total military strength for a list of platoons.
    /// </summary>
    private int CalculateStrength(List<PlatoonEntity> platoons)
    {
        int totalStrength = 0;

        foreach (var platoon in platoons)
        {
            totalStrength += _platoonSystem.CalculateMilitaryStrength(platoon);
        }

        return totalStrength;
    }

    /// <summary>
    /// Calculates casualties for each platoon.
    /// </summary>
    /// <param name="platoons">Platoons in combat</param>
    /// <param name="ownStrength">Own total strength</param>
    /// <param name="enemyStrength">Enemy total strength</param>
    /// <param name="isWinner">Is this side the winner</param>
    /// <param name="aggressionPercent">Aggression percentage</param>
    /// <returns>Dictionary of platoon ID to troop losses</returns>
    private Dictionary<int, int> CalculateCasualties(List<PlatoonEntity> platoons, int ownStrength, int enemyStrength, bool isWinner, int aggressionPercent)
    {
        var casualties = new Dictionary<int, int>();

        float baseCasualtyRate = 0.2f; // 20%
        float strengthRatio = enemyStrength / (float)Math.Max(1, ownStrength);

        // Aggression increases casualties
        float aggressionMod = 1.0f + ((aggressionPercent - 50f) / 100f) * 0.5f; // 0.75 to 1.25

        // Winner vs loser casualty rates
        float casualtyRate;
        if (isWinner)
        {
            casualtyRate = Math.Clamp(baseCasualtyRate * strengthRatio * aggressionMod, 0.1f, 0.3f); // 10-30%
        }
        else
        {
            casualtyRate = Math.Clamp(baseCasualtyRate * strengthRatio * aggressionMod * 2f, 0.5f, 0.9f); // 50-90%
        }

        // Apply casualties to each platoon
        foreach (var platoon in platoons)
        {
            int troopLoss = (int)Math.Floor(platoon.TroopCount * casualtyRate);
            casualties[platoon.ID] = troopLoss;
        }

        return casualties;
    }

    /// <summary>
    /// Applies casualties to platoons (reduces troop counts).
    /// </summary>
    private void ApplyCasualties(List<PlatoonEntity> platoons, Dictionary<int, int> casualties)
    {
        foreach (var platoon in platoons)
        {
            if (casualties.TryGetValue(platoon.ID, out int loss))
            {
                platoon.TroopCount = Math.Max(0, platoon.TroopCount - loss);

                // Recalculate strength
                platoon.Strength = _platoonSystem.CalculateMilitaryStrength(platoon);
            }
        }
    }

    /// <summary>
    /// Gets attacking platoons at a planet (on Battle Cruisers).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="attackerFaction">Attacking faction</param>
    /// <returns>List of attacking platoon IDs</returns>
    public List<int> GetAttackingPlatoons(int planetID, FactionType attackerFaction)
    {
        var attackingPlatoonIDs = new List<int>();

        // Get craft at planet
        var craft = _gameState.Craft.Where(c => c.PlanetID == planetID).ToList();

        foreach (var c in craft)
        {
            // Only Battle Cruisers from attacker faction
            if (c.Type == CraftType.BattleCruiser && c.Owner == attackerFaction)
            {
                // Get platoons on board
                attackingPlatoonIDs.AddRange(c.CarriedPlatoonIDs);
            }
        }

        return attackingPlatoonIDs;
    }

    /// <summary>
    /// Gets defending platoons at a planet (garrisoned on surface).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>List of defending platoon IDs</returns>
    public List<int> GetDefendingPlatoons(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return new List<int>();

        return _gameState.Platoons
            .Where(p => p.PlanetID == planetID && p.Owner == planet.Owner)
            .Select(p => p.ID)
            .ToList();
    }
}
