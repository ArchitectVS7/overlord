using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic resource management system.
/// Handles resource operations, validation, and critical resource monitoring.
/// </summary>
public class ResourceSystem
{
    private readonly GameState _gameState;

    /// <summary>
    /// Event fired when resources change on a planet.
    /// Parameters: (planetID, delta)
    /// </summary>
    public event Action<int, ResourceDelta>? OnResourcesChanged;

    /// <summary>
    /// Event fired when a resource falls below critical threshold.
    /// Parameters: (planetID, resourceType)
    /// </summary>
    public event Action<int, ResourceType>? OnResourceCritical;

    /// <summary>
    /// Critical resource threshold (red alert).
    /// </summary>
    public const int CriticalThreshold = 100;

    /// <summary>
    /// Warning resource threshold (yellow warning).
    /// </summary>
    public const int WarningThreshold = 500;

    /// <summary>
    /// Cargo capacity per resource type per cargo cruiser.
    /// </summary>
    public const int CargoCapacity = 1000;

    public ResourceSystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
    }

    /// <summary>
    /// Adds resources to a planet. Clamps to non-negative values.
    /// </summary>
    /// <param name="planetID">Planet ID to add resources to</param>
    /// <param name="delta">Resource delta (can be positive or negative)</param>
    /// <returns>True if successful, false if planet not found</returns>
    public bool AddResources(int planetID, ResourceDelta delta)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        planet.Resources.Add(delta);

        // Clamp to non-negative
        planet.Resources.Credits = Math.Max(0, planet.Resources.Credits);
        planet.Resources.Minerals = Math.Max(0, planet.Resources.Minerals);
        planet.Resources.Fuel = Math.Max(0, planet.Resources.Fuel);
        planet.Resources.Food = Math.Max(0, planet.Resources.Food);
        planet.Resources.Energy = Math.Max(0, planet.Resources.Energy);

        OnResourcesChanged?.Invoke(planetID, delta);
        CheckCriticalResources(planetID);

        return true;
    }

    /// <summary>
    /// Removes resources from a planet (for purchases/construction).
    /// </summary>
    /// <param name="planetID">Planet ID to remove resources from</param>
    /// <param name="cost">Resource cost</param>
    /// <returns>True if successful, false if insufficient resources or planet not found</returns>
    public bool RemoveResources(int planetID, ResourceCost cost)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        if (!planet.Resources.CanAfford(cost))
            return false; // Cannot afford

        planet.Resources.Subtract(cost);

        var delta = cost.ToDelta(); // Converts to negative delta
        OnResourcesChanged?.Invoke(planetID, delta);
        CheckCriticalResources(planetID);

        return true;
    }

    /// <summary>
    /// Checks if a planet can afford a cost.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="cost">Resource cost</param>
    /// <returns>True if planet can afford the cost</returns>
    public bool CanAfford(int planetID, ResourceCost cost)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        return planet.Resources.CanAfford(cost);
    }

    /// <summary>
    /// Gets the total resources across all planets owned by a faction.
    /// </summary>
    /// <param name="faction">Faction to calculate total for</param>
    /// <returns>Total resources across all faction planets</returns>
    public ResourceCollection GetTotalResources(FactionType faction)
    {
        var total = new ResourceCollection();

        foreach (var planet in _gameState.Planets.Where(p => p.Owner == faction))
        {
            total.Credits += planet.Resources.Credits;
            total.Minerals += planet.Resources.Minerals;
            total.Fuel += planet.Resources.Fuel;
            total.Food += planet.Resources.Food;
            total.Energy += planet.Resources.Energy;
        }

        return total;
    }

    /// <summary>
    /// Checks if a resource is at warning or critical levels.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="resourceType">Resource type to check</param>
    /// <returns>ResourceLevel indicating the status</returns>
    public ResourceLevel GetResourceLevel(int planetID, ResourceType resourceType)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return ResourceLevel.Unknown;

        int amount = resourceType switch
        {
            ResourceType.Food => planet.Resources.Food,
            ResourceType.Minerals => planet.Resources.Minerals,
            ResourceType.Fuel => planet.Resources.Fuel,
            ResourceType.Energy => planet.Resources.Energy,
            ResourceType.Credits => planet.Resources.Credits,
            _ => 0
        };

        if (amount < CriticalThreshold)
            return ResourceLevel.Critical;
        if (amount < WarningThreshold)
            return ResourceLevel.Warning;

        return ResourceLevel.Normal;
    }

    /// <summary>
    /// Gets the current amount of a specific resource on a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="resourceType">Resource type</param>
    /// <returns>Amount of the resource, or 0 if planet not found</returns>
    public int GetResourceAmount(int planetID, ResourceType resourceType)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        return resourceType switch
        {
            ResourceType.Food => planet.Resources.Food,
            ResourceType.Minerals => planet.Resources.Minerals,
            ResourceType.Fuel => planet.Resources.Fuel,
            ResourceType.Energy => planet.Resources.Energy,
            ResourceType.Credits => planet.Resources.Credits,
            _ => 0
        };
    }

    /// <summary>
    /// Sets the amount of a specific resource on a planet (for testing/cheats).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="resourceType">Resource type</param>
    /// <param name="amount">New amount (clamped to non-negative)</param>
    /// <returns>True if successful, false if planet not found</returns>
    public bool SetResourceAmount(int planetID, ResourceType resourceType, int amount)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        amount = Math.Max(0, amount);

        switch (resourceType)
        {
            case ResourceType.Food:
                planet.Resources.Food = amount;
                break;
            case ResourceType.Minerals:
                planet.Resources.Minerals = amount;
                break;
            case ResourceType.Fuel:
                planet.Resources.Fuel = amount;
                break;
            case ResourceType.Energy:
                planet.Resources.Energy = amount;
                break;
            case ResourceType.Credits:
                planet.Resources.Credits = amount;
                break;
        }

        CheckCriticalResources(planetID);
        return true;
    }

    /// <summary>
    /// Checks for critical resource levels and fires events.
    /// </summary>
    /// <param name="planetID">Planet ID to check</param>
    private void CheckCriticalResources(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return;

        // Only check for owned planets (not neutral)
        if (planet.Owner == FactionType.Neutral)
            return;

        // Check each resource type
        if (planet.Resources.Food < CriticalThreshold)
            OnResourceCritical?.Invoke(planetID, ResourceType.Food);

        if (planet.Resources.Fuel < CriticalThreshold)
            OnResourceCritical?.Invoke(planetID, ResourceType.Fuel);

        if (planet.Resources.Minerals < CriticalThreshold)
            OnResourceCritical?.Invoke(planetID, ResourceType.Minerals);

        if (planet.Resources.Energy < CriticalThreshold)
            OnResourceCritical?.Invoke(planetID, ResourceType.Energy);

        if (planet.Resources.Credits < CriticalThreshold)
            OnResourceCritical?.Invoke(planetID, ResourceType.Credits);
    }
}

/// <summary>
/// Resource level status.
/// </summary>
public enum ResourceLevel
{
    Unknown,   // Planet not found
    Normal,    // >= 500
    Warning,   // 100-499 (yellow warning)
    Critical   // < 100 (red alert)
}
