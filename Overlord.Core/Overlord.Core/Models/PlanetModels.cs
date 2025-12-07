using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Planet type affecting resource production bonuses.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PlanetType
{
    Volcanic,    // 5x Minerals, 3x Fuel, 0.5x Food
    Desert,      // 2x Energy, 0.25x Food
    Tropical,    // 2x Food, 0.75x Energy
    Metropolis   // 2x Credits (starting planets)
}

/// <summary>
/// Building/structure type on a planet.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BuildingType
{
    DockingBay,          // Orbital platform for craft (max 3)
    SurfacePlatform,     // Generic surface slot
    MiningStation,       // Produces Minerals and Fuel
    HorticulturalStation, // Produces Food
    SolarSatellite,      // Produces Energy (deployed craft)
    AtmosphereProcessor, // Terraforms neutral planets (10 turns)
    OrbitalDefense       // Defense platform (+20% defense bonus)
}

/// <summary>
/// Status of a building/structure.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BuildingStatus
{
    UnderConstruction,
    Active,
    Damaged,
    Destroyed
}

/// <summary>
/// Represents a structure on a planet.
/// </summary>
public class Structure
{
    public int ID { get; set; }
    public BuildingType Type { get; set; }
    public BuildingStatus Status { get; set; }
    public int TurnsRemaining { get; set; } // For construction/repair
}

/// <summary>
/// Resource production multipliers based on planet type.
/// </summary>
public class ResourceMultipliers
{
    public float Food { get; set; } = 1.0f;
    public float Minerals { get; set; } = 1.0f;
    public float Fuel { get; set; } = 1.0f;
    public float Energy { get; set; } = 1.0f;
    public float Credits { get; set; } = 1.0f;
}

/// <summary>
/// Building costs for construction.
/// </summary>
public class BuildingCosts
{
    /// <summary>
    /// Gets the construction cost for a building type.
    /// </summary>
    public static ResourceCost GetCost(BuildingType type)
    {
        return type switch
        {
            BuildingType.DockingBay => new ResourceCost
            {
                Credits = 5000,
                Minerals = 1000,
                Fuel = 500
            },
            BuildingType.SurfacePlatform => new ResourceCost
            {
                Credits = 2000,
                Minerals = 500,
                Fuel = 0
            },
            BuildingType.MiningStation => new ResourceCost
            {
                Credits = 8000,
                Minerals = 2000,
                Fuel = 1000
            },
            BuildingType.HorticulturalStation => new ResourceCost
            {
                Credits = 6000,
                Minerals = 1500,
                Fuel = 800
            },
            BuildingType.OrbitalDefense => new ResourceCost
            {
                Credits = 12000,
                Minerals = 3000,
                Fuel = 2000
            },
            _ => ResourceCost.Zero
        };
    }

    /// <summary>
    /// Gets the construction time in turns.
    /// </summary>
    public static int GetConstructionTime(BuildingType type)
    {
        return type switch
        {
            BuildingType.DockingBay => 2,
            BuildingType.SurfacePlatform => 1,
            BuildingType.MiningStation => 3,
            BuildingType.HorticulturalStation => 2,
            BuildingType.OrbitalDefense => 3,
            _ => 1
        };
    }

    /// <summary>
    /// Gets the crew requirement for a building type.
    /// </summary>
    public static int GetCrewRequirement(BuildingType type)
    {
        return type switch
        {
            BuildingType.MiningStation => 15,
            BuildingType.HorticulturalStation => 10,
            _ => 0
        };
    }
}
