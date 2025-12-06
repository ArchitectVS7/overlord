using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Craft type categories.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CraftType
{
    BattleCruiser,       // Combat vessel, platoon transport (4 max)
    CargoCruiser,        // Resource transport (1,000 per resource)
    SolarSatellite,      // Energy production (80/turn)
    AtmosphereProcessor  // Terraforming equipment (10 turns)
}

/// <summary>
/// Craft costs for each craft type.
/// </summary>
public class CraftCosts
{
    /// <summary>
    /// Battle Cruiser cost.
    /// </summary>
    public static ResourceCost BattleCruiser => new ResourceCost
    {
        Credits = 50000,
        Minerals = 10000,
        Fuel = 5000
    };

    /// <summary>
    /// Cargo Cruiser cost.
    /// </summary>
    public static ResourceCost CargoCruiser => new ResourceCost
    {
        Credits = 30000,
        Minerals = 5000,
        Fuel = 3000
    };

    /// <summary>
    /// Solar Satellite cost.
    /// </summary>
    public static ResourceCost SolarSatellite => new ResourceCost
    {
        Credits = 15000,
        Minerals = 3000,
        Fuel = 1000
    };

    /// <summary>
    /// Atmosphere Processor cost.
    /// </summary>
    public static ResourceCost AtmosphereProcessor => new ResourceCost
    {
        Credits = 10000,
        Minerals = 5000,
        Fuel = 2000
    };

    /// <summary>
    /// Gets the cost for a specific craft type.
    /// </summary>
    public static ResourceCost GetCost(CraftType type)
    {
        return type switch
        {
            CraftType.BattleCruiser => BattleCruiser,
            CraftType.CargoCruiser => CargoCruiser,
            CraftType.SolarSatellite => SolarSatellite,
            CraftType.AtmosphereProcessor => AtmosphereProcessor,
            _ => ResourceCost.Zero
        };
    }
}

/// <summary>
/// Craft crew requirements.
/// </summary>
public class CraftCrewRequirements
{
    public const int BattleCruiser = 50;
    public const int CargoCruiser = 30;
    public const int SolarSatellite = 5;
    public const int AtmosphereProcessor = 20;

    /// <summary>
    /// Gets the crew requirement for a specific craft type.
    /// </summary>
    public static int GetCrewRequired(CraftType type)
    {
        return type switch
        {
            CraftType.BattleCruiser => BattleCruiser,
            CraftType.CargoCruiser => CargoCruiser,
            CraftType.SolarSatellite => SolarSatellite,
            CraftType.AtmosphereProcessor => AtmosphereProcessor,
            _ => 0
        };
    }
}

/// <summary>
/// Craft specifications (speed, capacity, etc.).
/// </summary>
public class CraftSpecs
{
    public int Speed { get; set; }              // Units per turn
    public int FuelConsumptionRate { get; set; } // Fuel per distance unit
    public int PlatoonCapacity { get; set; }    // Max platoons (Battle Cruiser only)
    public int CargoCapacity { get; set; }      // Max cargo per resource (Cargo Cruiser only)
    public int EnergyProduction { get; set; }   // Energy per turn (Solar Satellite only)
    public int TerraformingDuration { get; set; } // Turns to terraform (Atmosphere Processor only)

    /// <summary>
    /// Gets the specifications for a specific craft type.
    /// </summary>
    public static CraftSpecs GetSpecs(CraftType type)
    {
        return type switch
        {
            CraftType.BattleCruiser => new CraftSpecs
            {
                Speed = 50,
                FuelConsumptionRate = 10, // 1 Fuel per 10 units
                PlatoonCapacity = 4,
                CargoCapacity = 0,
                EnergyProduction = 0,
                TerraformingDuration = 0
            },
            CraftType.CargoCruiser => new CraftSpecs
            {
                Speed = 30,
                FuelConsumptionRate = 5,  // 1 Fuel per 5 units (less efficient)
                PlatoonCapacity = 0,
                CargoCapacity = 1000,
                EnergyProduction = 0,
                TerraformingDuration = 0
            },
            CraftType.SolarSatellite => new CraftSpecs
            {
                Speed = 0, // Stationary once deployed
                FuelConsumptionRate = 0,
                PlatoonCapacity = 0,
                CargoCapacity = 0,
                EnergyProduction = 80,
                TerraformingDuration = 0
            },
            CraftType.AtmosphereProcessor => new CraftSpecs
            {
                Speed = 30,
                FuelConsumptionRate = 5,  // 1 Fuel per 5 units
                PlatoonCapacity = 0,
                CargoCapacity = 0,
                EnergyProduction = 0,
                TerraformingDuration = 10 // 10 turns to complete
            },
            _ => new CraftSpecs()
        };
    }
}
