using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic building construction system.
/// Manages building construction, completion, scrapping, and planet capacity limits.
/// </summary>
public class BuildingSystem
{
    private readonly GameState _gameState;
    private int _nextStructureID = 0;

    /// <summary>
    /// Event fired when building construction starts.
    /// Parameters: (planetID, buildingType)
    /// </summary>
    public event Action<int, BuildingType>? OnBuildingStarted;

    /// <summary>
    /// Event fired when building construction completes.
    /// Parameters: (planetID, buildingType)
    /// </summary>
    public event Action<int, BuildingType>? OnBuildingCompleted;

    /// <summary>
    /// Event fired when a building is scrapped.
    /// Parameters: (planetID, buildingType)
    /// </summary>
    public event Action<int, BuildingType>? OnBuildingScrapped;

    public BuildingSystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));

        // Initialize next structure ID based on existing structures
        foreach (var planet in _gameState.Planets)
        {
            if (planet.Structures.Count > 0)
            {
                int maxID = planet.Structures.Max(s => s.ID);
                if (maxID >= _nextStructureID)
                    _nextStructureID = maxID + 1;
            }
        }
    }

    /// <summary>
    /// Starts construction of a building on a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="buildingType">Building type to construct</param>
    /// <returns>True if construction started, false if failed</returns>
    public bool StartConstruction(int planetID, BuildingType buildingType)
    {
        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        // Validate capacity
        if (!CanBuild(planetID, buildingType))
            return false; // Planet at maximum capacity

        // Get cost and construction time
        var cost = BuildingCosts.GetCost(buildingType);
        int constructionTime = BuildingCosts.GetConstructionTime(buildingType);

        // Validate resources
        if (!planet.Resources.CanAfford(cost))
            return false; // Insufficient resources

        // Deduct cost
        planet.Resources.Subtract(cost);

        // Create building entity
        var building = new Structure
        {
            ID = _nextStructureID++,
            Type = buildingType,
            Status = BuildingStatus.UnderConstruction,
            TurnsRemaining = constructionTime
        };

        planet.Structures.Add(building);

        OnBuildingStarted?.Invoke(planetID, buildingType);
        return true;
    }

    /// <summary>
    /// Updates construction progress for all buildings (called each turn during Income Phase).
    /// </summary>
    public void UpdateConstruction()
    {
        foreach (var planet in _gameState.Planets)
        {
            var underConstructionBuildings = planet.Structures
                .Where(s => s.Status == BuildingStatus.UnderConstruction && s.TurnsRemaining > 0)
                .ToList();

            foreach (var building in underConstructionBuildings)
            {
                // Decrement turns
                building.TurnsRemaining--;

                // Complete construction
                if (building.TurnsRemaining <= 0)
                {
                    building.Status = BuildingStatus.Active;
                    OnBuildingCompleted?.Invoke(planet.ID, building.Type);
                }
            }
        }
    }

    /// <summary>
    /// Scraps a building (destroys it, refunds 50% cost).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="buildingID">Building ID</param>
    /// <returns>True if scrapped, false if failed</returns>
    public bool ScrapBuilding(int planetID, int buildingID)
    {
        // Get planet
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        // Find building
        var building = planet.Structures.FirstOrDefault(s => s.ID == buildingID);
        if (building == null)
            return false;

        // Refund 50% of cost
        var cost = BuildingCosts.GetCost(building.Type);
        var refund = new ResourceDelta
        {
            Credits = cost.Credits / 2,
            Minerals = cost.Minerals / 2,
            Fuel = cost.Fuel / 2,
            Food = 0,
            Energy = 0
        };

        planet.Resources.Add(refund);

        // Remove building
        planet.Structures.Remove(building);

        OnBuildingScrapped?.Invoke(planetID, building.Type);
        return true;
    }

    /// <summary>
    /// Checks if a building can be built on a planet (validates capacity only).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="buildingType">Building type</param>
    /// <returns>True if can build, false if capacity limit reached</returns>
    public bool CanBuild(int planetID, BuildingType buildingType)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        return buildingType switch
        {
            BuildingType.DockingBay => planet.CanBuildDockingBay(),
            BuildingType.SurfacePlatform => planet.CanBuildSurfaceStructure(),
            BuildingType.MiningStation => planet.CanBuildSurfaceStructure(),
            BuildingType.HorticulturalStation => planet.CanBuildSurfaceStructure(),
            BuildingType.OrbitalDefense => planet.CanBuildDockingBay(), // Orbital defense uses orbital slot
            _ => false
        };
    }

    /// <summary>
    /// Gets all buildings on a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>List of structures</returns>
    public List<Structure> GetBuildings(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return new List<Structure>();

        return planet.Structures.ToList();
    }

    /// <summary>
    /// Gets all buildings under construction on a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>List of structures under construction</returns>
    public List<Structure> GetBuildingsUnderConstruction(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return new List<Structure>();

        return planet.Structures
            .Where(s => s.Status == BuildingStatus.UnderConstruction)
            .ToList();
    }

    /// <summary>
    /// Gets all active buildings on a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>List of active structures</returns>
    public List<Structure> GetActiveBuildings(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return new List<Structure>();

        return planet.Structures
            .Where(s => s.Status == BuildingStatus.Active)
            .ToList();
    }

    /// <summary>
    /// Gets building count by type on a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="buildingType">Building type</param>
    /// <returns>Count of buildings of this type</returns>
    public int GetBuildingCount(int planetID, BuildingType buildingType)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        return planet.Structures.Count(s => s.Type == buildingType && s.Status == BuildingStatus.Active);
    }

    /// <summary>
    /// Checks if a planet can afford a building (resources check).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="buildingType">Building type</param>
    /// <returns>True if affordable, false otherwise</returns>
    public bool CanAffordBuilding(int planetID, BuildingType buildingType)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        var cost = BuildingCosts.GetCost(buildingType);
        return planet.Resources.CanAfford(cost);
    }
}
