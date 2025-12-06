using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic taxation system.
/// Calculates Credit income from population based on tax rates.
/// </summary>
public class TaxationSystem
{
    private readonly GameState _gameState;
    private readonly ResourceSystem _resourceSystem;

    /// <summary>
    /// Event fired when tax revenue is calculated for a planet.
    /// Parameters: (planetID, revenue)
    /// </summary>
    public event Action<int, int>? OnTaxRevenueCalculated;

    /// <summary>
    /// Event fired when tax rate is changed.
    /// Parameters: (planetID, newTaxRate)
    /// </summary>
    public event Action<int, int>? OnTaxRateChanged;

    /// <summary>
    /// Minimum tax rate (0%)
    /// </summary>
    public const int MinTaxRate = 0;

    /// <summary>
    /// Maximum tax rate (100%)
    /// </summary>
    public const int MaxTaxRate = 100;

    /// <summary>
    /// Default tax rate for new planets (50%)
    /// </summary>
    public const int DefaultTaxRate = 50;

    public TaxationSystem(GameState gameState, ResourceSystem resourceSystem)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _resourceSystem = resourceSystem ?? throw new ArgumentNullException(nameof(resourceSystem));
    }

    /// <summary>
    /// Calculates tax revenue for all planets owned by a faction.
    /// </summary>
    /// <param name="faction">Faction to calculate taxes for</param>
    /// <returns>Total tax revenue across all faction planets</returns>
    public int CalculateFactionTaxRevenue(FactionType faction)
    {
        int totalRevenue = 0;

        foreach (var planet in _gameState.Planets.Where(p => p.Owner == faction))
        {
            int planetRevenue = CalculatePlanetTaxRevenue(planet.ID);
            totalRevenue += planetRevenue;

            // Add Credits to planet resources
            if (planetRevenue > 0)
            {
                var creditDelta = new ResourceDelta { Credits = planetRevenue };
                _resourceSystem.AddResources(planet.ID, creditDelta);

                OnTaxRevenueCalculated?.Invoke(planet.ID, planetRevenue);
            }
        }

        return totalRevenue;
    }

    /// <summary>
    /// Calculates tax revenue for a single planet.
    /// Formula: (Population ÷ 10) × (TaxRate ÷ 100) × PlanetMultiplier
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Tax revenue in Credits</returns>
    public int CalculatePlanetTaxRevenue(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        // Uninhabited planets produce no tax revenue
        if (!planet.IsHabitable || planet.Population == 0)
            return 0;

        // Base calculation: (Population ÷ 10) × (TaxRate ÷ 100)
        float baseRevenue = (planet.Population / 10f) * (planet.TaxRate / 100f);

        // Apply planet multiplier (Metropolis = 2.0x, others = 1.0x)
        float planetMultiplier = planet.ResourceMultipliers.Credits;
        float totalRevenue = baseRevenue * planetMultiplier;

        return (int)Math.Floor(totalRevenue);
    }

    /// <summary>
    /// Sets the tax rate for a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="taxRate">Tax rate (0-100)</param>
    /// <returns>True if successful, false if planet not found or invalid rate</returns>
    public bool SetTaxRate(int planetID, int taxRate)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return false;

        // Clamp to valid range
        taxRate = Math.Clamp(taxRate, MinTaxRate, MaxTaxRate);

        int oldTaxRate = planet.TaxRate;
        planet.TaxRate = taxRate;

        if (planet.TaxRate != oldTaxRate)
        {
            OnTaxRateChanged?.Invoke(planetID, taxRate);
        }

        return true;
    }

    /// <summary>
    /// Gets the current tax rate for a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Tax rate (0-100), or -1 if planet not found</returns>
    public int GetTaxRate(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return -1;

        return planet.TaxRate;
    }

    /// <summary>
    /// Gets the estimated tax revenue for a given tax rate (for UI preview).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="taxRate">Tax rate to simulate (0-100)</param>
    /// <returns>Estimated revenue in Credits</returns>
    public int GetEstimatedRevenue(int planetID, int taxRate)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        // Clamp to valid range
        taxRate = Math.Clamp(taxRate, MinTaxRate, MaxTaxRate);

        // Calculate with simulated tax rate
        float baseRevenue = (planet.Population / 10f) * (taxRate / 100f);
        float planetMultiplier = planet.ResourceMultipliers.Credits;
        float totalRevenue = baseRevenue * planetMultiplier;

        return (int)Math.Floor(totalRevenue);
    }

    /// <summary>
    /// Gets the morale impact of a tax rate.
    /// </summary>
    /// <param name="taxRate">Tax rate (0-100)</param>
    /// <returns>Morale change per turn</returns>
    public int GetTaxRateMoraleImpact(int taxRate)
    {
        if (taxRate > 75)
            return -5;  // High taxes penalty
        else if (taxRate < 25)
            return +2;  // Low taxes bonus
        else
            return 0;   // Moderate taxes (no change)
    }

    /// <summary>
    /// Gets a tax rate category description.
    /// </summary>
    /// <param name="taxRate">Tax rate (0-100)</param>
    /// <returns>Category description</returns>
    public string GetTaxRateCategory(int taxRate)
    {
        if (taxRate == 0)
            return "No Taxes";
        else if (taxRate < 25)
            return "Low Taxes";
        else if (taxRate <= 75)
            return "Moderate Taxes";
        else
            return "High Taxes";
    }

    /// <summary>
    /// Generates a tax report for a planet (for UI display).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Tax report string</returns>
    public string GenerateTaxReport(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return "Planet not found";

        int revenue = CalculatePlanetTaxRevenue(planetID);
        string category = GetTaxRateCategory(planet.TaxRate);
        int moraleImpact = GetTaxRateMoraleImpact(planet.TaxRate);

        var report = $"{planet.Name} Tax Report:\n";
        report += $"  Population: {planet.Population:N0}\n";
        report += $"  Tax Rate: {planet.TaxRate}% ({category})\n";
        report += $"  Multiplier: {planet.ResourceMultipliers.Credits:F1}x";

        if (planet.Type == PlanetType.Metropolis)
            report += " (Metropolis)";

        report += $"\n  Revenue: {revenue} Credits/turn\n";

        if (moraleImpact != 0)
        {
            report += $"  Morale Impact: {(moraleImpact > 0 ? "+" : "")}{moraleImpact}%/turn";
        }
        else
        {
            report += "  Morale Impact: None";
        }

        return report;
    }
}
