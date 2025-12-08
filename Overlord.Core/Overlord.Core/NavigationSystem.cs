using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic navigation system for ship movement.
/// Handles ship movement between planets with fuel cost validation.
/// </summary>
public class NavigationSystem
{
    private readonly GameState _gameState;
    private readonly ResourceSystem _resourceSystem;
    private readonly CombatSystem _combatSystem;

    /// <summary>
    /// Event fired when a ship moves between planets.
    /// Parameters: (craftID, sourcePlanetID, destinationPlanetID)
    /// </summary>
    public event Action<int, int, int>? OnShipMoved;

    /// <summary>
    /// Event fired when ship movement fails due to insufficient fuel or invalid destination.
    /// Parameters: (craftID, reason)
    /// </summary>
    public event Action<int, string>? OnMovementFailed;

    /// <summary>
    /// Fixed fuel cost per jump for prototype (simplified).
    /// </summary>
    public const int FuelCostPerJump = 10;

    public NavigationSystem(GameState gameState, ResourceSystem resourceSystem, CombatSystem combatSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _resourceSystem = resourceSystem ?? throw new ArgumentNullException(nameof(resourceSystem));
        _combatSystem = combatSystem ?? throw new ArgumentNullException(nameof(combatSystem));
    }

    /// <summary>
    /// Moves a ship from its current planet to a destination planet.
    /// Instant teleport for prototype (no travel time).
    /// </summary>
    /// <param name="craftID">ID of the craft to move</param>
    /// <param name="destinationPlanetID">Destination planet ID</param>
    /// <returns>True if movement successful, false otherwise</returns>
    public bool MoveShip(int craftID, int destinationPlanetID)
    {
        // Validate craft exists
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
        {
            OnMovementFailed?.Invoke(craftID, "Ship not found");
            return false;
        }

        // Get source planet
        int sourcePlanetID = craft.PlanetID;
        if (!_gameState.PlanetLookup.TryGetValue(sourcePlanetID, out var sourcePlanet))
        {
            OnMovementFailed?.Invoke(craftID, "Source planet not found");
            return false;
        }

        // Validate destination planet exists
        if (!_gameState.PlanetLookup.TryGetValue(destinationPlanetID, out var destinationPlanet))
        {
            OnMovementFailed?.Invoke(craftID, "Destination planet not found");
            return false;
        }

        // Can't move to same planet
        if (sourcePlanetID == destinationPlanetID)
        {
            OnMovementFailed?.Invoke(craftID, "Already at destination");
            return false;
        }

        // Check fuel availability at source planet
        if (sourcePlanet.Resources.Fuel < FuelCostPerJump)
        {
            OnMovementFailed?.Invoke(craftID, $"Insufficient fuel (need {FuelCostPerJump}, have {sourcePlanet.Resources.Fuel})");
            return false;
        }

        // Deduct fuel from source planet
        var fuelCost = new ResourceDelta { Fuel = -FuelCostPerJump };
        _resourceSystem.AddResources(sourcePlanetID, fuelCost);

        // Remove craft from source planet's docked list
        sourcePlanet.DockedCraftIDs.Remove(craftID);

        // Update craft location (instant teleport for prototype)
        craft.PlanetID = destinationPlanetID;
        craft.InTransit = false;

        // Add craft to destination planet's docked list
        destinationPlanet.DockedCraftIDs.Add(craftID);

        // Check for combat if arriving at enemy planet
        if (destinationPlanet.Owner != FactionType.Neutral &&
            destinationPlanet.Owner != craft.Owner)
        {
            // Enemy planet - check if we have platoons to attack with
            if (craft.CarriedPlatoonIDs.Count > 0)
            {
                // Initiate combat
                var battle = _combatSystem.InitiateBattle(
                    destinationPlanetID,
                    craft.Owner,
                    craft.CarriedPlatoonIDs);

                if (battle != null)
                {
                    // Execute auto-resolve combat
                    _combatSystem.ExecuteCombat(battle, aggressionPercent: 50);
                    // Combat result handled by CombatSystem events
                }
            }
        }

        // Fire event
        OnShipMoved?.Invoke(craftID, sourcePlanetID, destinationPlanetID);

        return true;
    }

    /// <summary>
    /// Gets all ships docked at a specific planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>List of CraftEntity at the planet</returns>
    public List<CraftEntity> GetShipsAtPlanet(int planetID)
    {
        return _gameState.Craft
            .Where(c => c.PlanetID == planetID)
            .ToList();
    }

    /// <summary>
    /// Gets all player-owned ships at a specific planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>List of player CraftEntity at the planet</returns>
    public List<CraftEntity> GetPlayerShipsAtPlanet(int planetID)
    {
        return _gameState.Craft
            .Where(c => c.PlanetID == planetID && c.Owner == FactionType.Player)
            .ToList();
    }

    /// <summary>
    /// Validates if a ship can move to a destination (checks fuel only, for UI validation).
    /// </summary>
    /// <param name="craftID">Craft ID</param>
    /// <param name="destinationPlanetID">Destination planet ID</param>
    /// <returns>True if move is valid, false otherwise</returns>
    public bool CanMoveShip(int craftID, int destinationPlanetID)
    {
        if (!_gameState.CraftLookup.TryGetValue(craftID, out var craft))
            return false;

        if (!_gameState.PlanetLookup.TryGetValue(craft.PlanetID, out var sourcePlanet))
            return false;

        if (!_gameState.PlanetLookup.TryGetValue(destinationPlanetID, out _))
            return false;

        if (craft.PlanetID == destinationPlanetID)
            return false;

        if (sourcePlanet.Resources.Fuel < FuelCostPerJump)
            return false;

        return true;
    }
}
