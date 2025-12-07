using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic planetary defense system.
/// Calculates defensive bonuses from Orbital Defense Platforms for space combat.
/// </summary>
public class DefenseSystem
{
    private readonly GameState _gameState;

    // Defense constants
    public const int MaxOrbitalDefensePlatforms = 2;
    public const float DefenseBonusPerPlatform = 0.20f; // 20% bonus per platform
    public const int OrbitalDefenseCrewRequirement = 20;

    public DefenseSystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
    }

    /// <summary>
    /// Gets the defensive bonus multiplier for a planet based on active Orbital Defense Platforms.
    /// Formula: 1.0 + (0.2 × ActivePlatforms)
    /// Example: 1 platform = 1.2x, 2 platforms = 1.4x
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Defense multiplier (1.0 to 1.4)</returns>
    public float GetDefenseMultiplier(int planetID)
    {
        int activePlatforms = GetActiveDefensePlatformCount(planetID);
        return 1.0f + (DefenseBonusPerPlatform * activePlatforms);
    }

    /// <summary>
    /// Gets the count of active Orbital Defense Platforms at a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Count of active platforms (0-2)</returns>
    public int GetActiveDefensePlatformCount(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        // Count active Orbital Defense platforms
        // Note: Platforms require 20 crew to be active (handled by IncomeSystem crew allocation)
        return planet.Structures.Count(s =>
            s.Type == BuildingType.OrbitalDefense &&
            s.Status == BuildingStatus.Active);
    }

    /// <summary>
    /// Gets the total defense platforms (active and under construction) at a planet.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Total platform count</returns>
    public int GetTotalDefensePlatformCount(int planetID)
    {
        if (!_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
            return 0;

        return planet.Structures.Count(s => s.Type == BuildingType.OrbitalDefense);
    }

    /// <summary>
    /// Checks if a planet can build another Orbital Defense Platform.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>True if can build, false if at max (2)</returns>
    public bool CanBuildDefensePlatform(int planetID)
    {
        return GetTotalDefensePlatformCount(planetID) < MaxOrbitalDefensePlatforms;
    }

    /// <summary>
    /// Calculates the defensive strength for a planet's defending fleet.
    /// Applies the defense bonus from Orbital Defense Platforms.
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <param name="baseStrength">Base fleet strength</param>
    /// <returns>Modified defensive strength</returns>
    public int CalculateDefensiveStrength(int planetID, int baseStrength)
    {
        float multiplier = GetDefenseMultiplier(planetID);
        return (int)Math.Floor(baseStrength * multiplier);
    }

    /// <summary>
    /// Gets a defense report for a planet (for UI display).
    /// </summary>
    /// <param name="planetID">Planet ID</param>
    /// <returns>Defense report string</returns>
    public string GetDefenseReport(int planetID)
    {
        int activePlatforms = GetActiveDefensePlatformCount(planetID);
        int totalPlatforms = GetTotalDefensePlatformCount(planetID);

        if (totalPlatforms == 0)
            return "No orbital defenses";

        int inactivePlatforms = totalPlatforms - activePlatforms;
        float bonus = DefenseBonusPerPlatform * activePlatforms;
        int bonusPercent = (int)(bonus * 100);

        string report = $"Orbital Defense: +{bonusPercent}% defense ({activePlatforms}/{MaxOrbitalDefensePlatforms} active)";

        if (inactivePlatforms > 0)
            report += $" [{inactivePlatforms} inactive - insufficient crew]";

        return report;
    }
}
