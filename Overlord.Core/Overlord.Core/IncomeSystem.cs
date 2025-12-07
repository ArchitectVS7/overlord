using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic income/production system.
/// Calculates resource production from buildings and applies planet multipliers.
/// </summary>
public class IncomeSystem
{
    private readonly GameState _gameState;
    private readonly ResourceSystem _resourceSystem;

    /// <summary>
    /// Event fired when income is calculated for a planet.
    /// Parameters: (planetID, income)
    /// </summary>
    public event Action<int, ResourceDelta>? OnIncomeCalculated;

    /// <summary>
    /// Event fired when buildings are inactive due to insufficient crew.
    /// Parameters: (planetID, inactiveCount)
    /// </summary>
    public event Action<int, int>? OnInsufficientCrew;

    // Base production rates (per turn, per building)
    public const int BaseFoodProduction = 100;     // Horticultural Station
    public const int BaseMineralProduction = 50;   // Mining Station
    public const int BaseFuelProduction = 30;      // Mining Station
    public const int BaseEnergyProduction = 80;    // Solar Satellite

    // Crew requirements
    public const int HorticulturalCrewRequired = 10;
    public const int MiningCrewRequired = 15;
    public const int SolarSatelliteCrewRequired = 5;

    public IncomeSystem(GameState gameState, ResourceSystem resourceSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _resourceSystem = resourceSystem ?? throw new ArgumentNullException(nameof(resourceSystem));
    }

    /// <summary>
    /// Calculates income for all planets owned by a faction.
    /// </summary>
    /// <param name="faction">Faction to calculate income for</param>
    /// <returns>Total income delta across all faction planets</returns>
    public ResourceDelta CalculateFactionIncome(FactionType faction)
    {
        var totalIncome = new ResourceDelta();

        foreach (var planet in _gameState.Planets.Where(p => p.Owner == faction))
        {
            var planetIncome = CalculatePlanetIncome(planet.ID);

            totalIncome.Food += planetIncome.Food;
            totalIncome.Minerals += planetIncome.Minerals;
            totalIncome.Fuel += planetIncome.Fuel;
            totalIncome.Energy += planetIncome.Energy;
            totalIncome.Credits += planetIncome.Credits;

            // Add income to planet resources
            _resourceSystem.AddResources(planet.ID, planetIncome);

            // Fire event
            OnIncomeCalculated?.Invoke(planet.ID, planetIncome);
        }

        return totalIncome;
    }

    /// <summary>
    /// Calculates income for a single planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Resource delta for the planet</returns>
    public ResourceDelta CalculatePlanetIncome(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return new ResourceDelta();

        // Uninhabited planets produce nothing
        if (!planet.IsHabitable)
            return new ResourceDelta();

        // Allocate crew to buildings (sets Active/Inactive status)
        AllocateCrew(planet);

        // Get planet multipliers
        var multipliers = planet.ResourceMultipliers;

        // Calculate production from each building type
        var income = new ResourceDelta
        {
            Food = CalculateFoodProduction(planet, multipliers.Food),
            Minerals = CalculateMineralProduction(planet, multipliers.Minerals),
            Fuel = CalculateFuelProduction(planet, multipliers.Fuel),
            Energy = CalculateEnergyProduction(planet, multipliers.Energy)
        };

        return income;
    }

    /// <summary>
    /// Allocates crew to buildings based on priority.
    /// Priority: Food → Minerals/Fuel → Energy
    /// </summary>
    /// <param name="planet">Planet to allocate crew on</param>
    private void AllocateCrew(PlanetEntity planet)
    {
        int availableCrew = planet.Population;
        int inactiveCount = 0;

        // Priority 1: Horticultural Stations (Food production)
        var horticulturalStations = planet.Structures
            .Where(s => s.Type == BuildingType.HorticulturalStation)
            .ToList();

        foreach (var station in horticulturalStations)
        {
            if (availableCrew >= HorticulturalCrewRequired)
            {
                station.Status = BuildingStatus.Active;
                availableCrew -= HorticulturalCrewRequired;
            }
            else
            {
                station.Status = BuildingStatus.Damaged; // Using Damaged to indicate inactive due to crew shortage
                inactiveCount++;
            }
        }

        // Priority 2: Mining Stations (Minerals + Fuel production)
        var miningStations = planet.Structures
            .Where(s => s.Type == BuildingType.MiningStation)
            .ToList();

        foreach (var station in miningStations)
        {
            if (availableCrew >= MiningCrewRequired)
            {
                station.Status = BuildingStatus.Active;
                availableCrew -= MiningCrewRequired;
            }
            else
            {
                station.Status = BuildingStatus.Damaged;
                inactiveCount++;
            }
        }

        // Priority 3: Solar Satellites (Energy production)
        // Note: Solar Satellites are deployed craft, not structures
        // This will be handled when CraftSystem is implemented
        // For now, we check if there are craft entities at this planet
        if (_gameState.Craft != null)
        {
            var solarSatellites = _gameState.Craft
                .Where(c => c.PlanetID == planet.ID)
                .ToList();

            foreach (var satellite in solarSatellites)
            {
                if (availableCrew >= SolarSatelliteCrewRequired)
                {
                    // Satellite is active (this would be a property on CraftEntity)
                    availableCrew -= SolarSatelliteCrewRequired;
                }
                else
                {
                    // Satellite inactive
                    inactiveCount++;
                }
            }
        }

        // Fire event if buildings are inactive due to crew shortage
        if (inactiveCount > 0)
        {
            OnInsufficientCrew?.Invoke(planet.ID, inactiveCount);
        }
    }

    /// <summary>
    /// Calculates Food production from Horticultural Stations.
    /// </summary>
    private int CalculateFoodProduction(PlanetEntity planet, float multiplier)
    {
        int activeStations = planet.Structures.Count(s =>
            s.Type == BuildingType.HorticulturalStation &&
            s.Status == BuildingStatus.Active);

        return (int)Math.Floor(activeStations * BaseFoodProduction * multiplier);
    }

    /// <summary>
    /// Calculates Mineral production from Mining Stations.
    /// </summary>
    private int CalculateMineralProduction(PlanetEntity planet, float multiplier)
    {
        int activeStations = planet.Structures.Count(s =>
            s.Type == BuildingType.MiningStation &&
            s.Status == BuildingStatus.Active);

        return (int)Math.Floor(activeStations * BaseMineralProduction * multiplier);
    }

    /// <summary>
    /// Calculates Fuel production from Mining Stations.
    /// </summary>
    private int CalculateFuelProduction(PlanetEntity planet, float multiplier)
    {
        int activeStations = planet.Structures.Count(s =>
            s.Type == BuildingType.MiningStation &&
            s.Status == BuildingStatus.Active);

        return (int)Math.Floor(activeStations * BaseFuelProduction * multiplier);
    }

    /// <summary>
    /// Calculates Energy production from Solar Satellites.
    /// Note: Solar Satellites are deployed craft, not structures.
    /// This will be fully implemented when CraftSystem is ready.
    /// </summary>
    private int CalculateEnergyProduction(PlanetEntity planet, float multiplier)
    {
        // Placeholder: Will be implemented when CraftSystem is ready
        // For now, check if craft entities exist and calculate
        if (_gameState.Craft == null)
            return 0;

        int activeSatellites = _gameState.Craft
            .Count(c => c.PlanetID == planet.ID);
        // TODO: Add check for CraftType.SolarSatellite when CraftType enum exists
        // TODO: Add check for Active status when that property exists

        return (int)Math.Floor(activeSatellites * BaseEnergyProduction * multiplier);
    }

    /// <summary>
    /// Gets the crew allocation for a planet (for UI display).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Tuple of (used crew, total population)</returns>
    public (int UsedCrew, int TotalPopulation) GetCrewAllocation(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return (0, 0);

        int usedCrew = 0;

        // Count active Horticultural Stations
        usedCrew += planet.Structures.Count(s =>
            s.Type == BuildingType.HorticulturalStation &&
            s.Status == BuildingStatus.Active) * HorticulturalCrewRequired;

        // Count active Mining Stations
        usedCrew += planet.Structures.Count(s =>
            s.Type == BuildingType.MiningStation &&
            s.Status == BuildingStatus.Active) * MiningCrewRequired;

        // Count active Solar Satellites (when implemented)
        // TODO: Add when CraftSystem is ready

        return (usedCrew, planet.Population);
    }

    /// <summary>
    /// Generates an income report for a planet (for UI display).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Income report string</returns>
    public string GenerateIncomeReport(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return "Planet not found";

        var income = CalculatePlanetIncome(planetID);
        var multipliers = planet.ResourceMultipliers;

        var report = $"{planet.Name} Income:\n";

        // Food
        int horticulturalActive = planet.Structures.Count(s =>
            s.Type == BuildingType.HorticulturalStation && s.Status == BuildingStatus.Active);
        if (horticulturalActive > 0)
            report += $"  +{income.Food} Food ({horticulturalActive} Horticultural × {multipliers.Food:F1})\n";

        // Minerals
        int miningActive = planet.Structures.Count(s =>
            s.Type == BuildingType.MiningStation && s.Status == BuildingStatus.Active);
        if (miningActive > 0)
            report += $"  +{income.Minerals} Minerals ({miningActive} Mining × {multipliers.Minerals:F1})\n";

        // Fuel
        if (miningActive > 0)
            report += $"  +{income.Fuel} Fuel ({miningActive} Mining × {multipliers.Fuel:F1})\n";

        // Energy (when Solar Satellites implemented)
        if (income.Energy > 0)
            report += $"  +{income.Energy} Energy\n";

        return report;
    }
}
