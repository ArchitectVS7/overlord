namespace Overlord.Core.Models;

/// <summary>
/// Represents a change in resources (can be positive or negative).
/// </summary>
public class ResourceDelta
{
    /// <summary>
    /// Change in credits (currency).
    /// </summary>
    public int Credits { get; set; }

    /// <summary>
    /// Change in minerals (building material).
    /// </summary>
    public int Minerals { get; set; }

    /// <summary>
    /// Change in fuel (for ships).
    /// </summary>
    public int Fuel { get; set; }

    /// <summary>
    /// Change in food (for population).
    /// </summary>
    public int Food { get; set; }

    /// <summary>
    /// Change in energy (for systems).
    /// </summary>
    public int Energy { get; set; }

    /// <summary>
    /// Returns true if all resource deltas are zero.
    /// </summary>
    public bool IsZero => Credits == 0 && Minerals == 0 && Fuel == 0 && Food == 0 && Energy == 0;

    /// <summary>
    /// Returns true if all resource deltas are non-negative.
    /// </summary>
    public bool IsPositive => Credits >= 0 && Minerals >= 0 && Fuel >= 0 && Food >= 0 && Energy >= 0;
}
