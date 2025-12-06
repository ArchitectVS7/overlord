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
