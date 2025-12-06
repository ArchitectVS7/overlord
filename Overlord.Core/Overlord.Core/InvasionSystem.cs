using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic invasion system.
/// Handles planetary invasions, ground combat, and planet capture.
/// </summary>
public class InvasionSystem
{
    private readonly GameState _gameState;
    private readonly CombatSystem _combatSystem;

    /// <summary>
    /// Event fired when invasion starts.
    /// Parameters: (planetID, attackerFaction)
    /// </summary>
    public event Action<int, FactionType>? OnInvasionStarted;

    /// <summary>
    /// Event fired when planet is captured.
    /// Parameters: (planetID, newOwner, capturedResources)
    /// </summary>
    public event Action<int, FactionType, ResourceDelta>? OnPlanetCaptured;

    /// <summary>
    /// Event fired when platoons land.
    /// Parameters: (planetID, platoonCount, totalTroops)
    /// </summary>
    public event Action<int, int, int>? OnPlatoonsLanded;

    public InvasionSystem(GameState gameState, CombatSystem combatSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _combatSystem = combatSystem ?? throw new ArgumentNullException(nameof(combatSystem));
    }

    /// <summary>
    /// Executes planetary invasion.
    /// </summary>
    /// <param name="planetID">Target planet ID</param>
    /// <param name="attackerFaction">Attacking faction</param>
    /// <param name="aggressionPercent">Attacker aggression (0-100)</param>
    /// <returns>Invasion result if successful, null if failed</returns>
    public InvasionResult? InvadePlanet(int planetID, FactionType attackerFaction, int aggressionPercent = 100)
    {
        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return null;

        // Cannot invade own planet
        if (planet.Owner == attackerFaction)
            return null;

        // Must control orbit (no enemy craft)
        if (!HasOrbitalControl(planetID, attackerFaction))
            return null;

        // Get invasion force (platoons aboard Battle Cruisers)
        var attackingPlatoonIDs = GetInvasionForce(planetID, attackerFaction);
        if (attackingPlatoonIDs.Count == 0)
            return null; // No platoons to invade

        // Get defender garrison
        var defendingPlatoonIDs = _combatSystem.GetDefendingPlatoons(planetID);

        OnInvasionStarted?.Invoke(planetID, attackerFaction);

        // Fire platoons landed event
        int totalTroops = attackingPlatoonIDs
            .Select(id => _gameState.PlatoonLookup.TryGetValue(id, out var p) ? p.TroopCount : 0)
            .Sum();
        OnPlatoonsLanded?.Invoke(planetID, attackingPlatoonIDs.Count, totalTroops);

        // Check for undefended planet (instant surrender)
        if (defendingPlatoonIDs.Count == 0)
        {
            var capturedResources = CapturePlanet(planet, attackerFaction, attackingPlatoonIDs);

            return new InvasionResult
            {
                AttackerWins = true,
                PlanetCaptured = true,
                InstantSurrender = true,
                AttackerCasualties = 0,
                DefenderCasualties = 0,
                NewPopulation = planet.Population,
                NewMorale = planet.Morale,
                CapturedResources = capturedResources
            };
        }

        // Execute ground combat (uses CombatSystem)
        var battle = _combatSystem.InitiateBattle(planetID, attackerFaction, attackingPlatoonIDs);
        if (battle == null)
            return null; // Battle failed to initiate

        var combatResult = _combatSystem.ExecuteCombat(battle, aggressionPercent);

        // Resolve invasion outcome
        ResourceDelta? resources = null;
        if (combatResult.AttackerWins)
        {
            // Attacker victory: Capture planet
            resources = CapturePlanet(planet, attackerFaction, attackingPlatoonIDs);
        }

        // Create result
        var result = new InvasionResult
        {
            AttackerWins = combatResult.AttackerWins,
            PlanetCaptured = combatResult.PlanetCaptured,
            InstantSurrender = false,
            AttackerCasualties = combatResult.AttackerCasualties,
            DefenderCasualties = combatResult.DefenderCasualties,
            NewPopulation = planet.Population,
            NewMorale = planet.Morale,
            CapturedResources = resources
        };

        return result;
    }

    /// <summary>
    /// Captures planet (transfers ownership and resources).
    /// </summary>
    /// <param name="planet">Planet to capture</param>
    /// <param name="newOwner">New owner faction</param>
    /// <param name="survivingPlatoonIDs">IDs of surviving attacker platoons</param>
    /// <returns>Captured resources</returns>
    private ResourceDelta CapturePlanet(PlanetEntity planet, FactionType newOwner, List<int> survivingPlatoonIDs)
    {
        // Transfer ownership
        planet.Owner = newOwner;

        // Reduce morale (occupation penalty: -30%)
        planet.Morale = Math.Max(0, planet.Morale - 30);

        // Capture resources
        var capturedResources = new ResourceDelta
        {
            Credits = planet.Resources.Credits,
            Minerals = planet.Resources.Minerals,
            Fuel = planet.Resources.Fuel,
            Food = planet.Resources.Food
        };

        // Clear planet stockpiles (resources transferred to attacker faction)
        planet.Resources.Credits = 0;
        planet.Resources.Minerals = 0;
        planet.Resources.Fuel = 0;
        planet.Resources.Food = 0;

        // Add resources to attacker faction
        var factionState = newOwner == FactionType.Player ? _gameState.PlayerFaction : _gameState.AIFaction;
        factionState.Resources.Add(capturedResources);

        // Deactivate all buildings (need new crew assignment)
        foreach (var structure in planet.Structures)
        {
            if (structure.Status == BuildingStatus.Active)
            {
                structure.Status = BuildingStatus.Damaged;
            }
        }

        // Garrison surviving platoons
        foreach (var platoonID in survivingPlatoonIDs)
        {
            if (_gameState.PlatoonLookup.TryGetValue(platoonID, out var platoon))
            {
                platoon.PlanetID = planet.ID;

                // Remove from any craft (disembark)
                var craft = _gameState.Craft.FirstOrDefault(c => c.CarriedPlatoonIDs.Contains(platoonID));
                if (craft != null)
                {
                    craft.CarriedPlatoonIDs.Remove(platoonID);
                }
            }
        }

        _gameState.RebuildLookups();

        OnPlanetCaptured?.Invoke(planet.ID, newOwner, capturedResources);
        return capturedResources;
    }

    /// <summary>
    /// Gets invasion force (platoons aboard Battle Cruisers in orbit).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="faction">Faction</param>
    /// <returns>List of platoon IDs</returns>
    private List<int> GetInvasionForce(int planetID, FactionType faction)
    {
        var platoonIDs = new List<int>();

        // Get Battle Cruisers in orbit
        var battleCruisers = _gameState.Craft
            .Where(c => c.PlanetID == planetID &&
                       c.Owner == faction &&
                       c.Type == CraftType.BattleCruiser &&
                       !c.IsDeployed)
            .ToList();

        // Get all platoons aboard these ships
        foreach (var cruiser in battleCruisers)
        {
            platoonIDs.AddRange(cruiser.CarriedPlatoonIDs);
        }

        return platoonIDs;
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
}
