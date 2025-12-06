namespace Overlord.Core.Models;

/// <summary>
/// Represents the cost of a purchase or construction action.
/// All values must be non-negative.
/// </summary>
public class ResourceCost
{
    /// <summary>
    /// Credits cost.
    /// </summary>
    public int Credits { get; set; }

    /// <summary>
    /// Minerals cost.
    /// </summary>
    public int Minerals { get; set; }

    /// <summary>
    /// Fuel cost.
    /// </summary>
    public int Fuel { get; set; }

    /// <summary>
    /// Food cost.
    /// </summary>
    public int Food { get; set; }

    /// <summary>
    /// Energy cost.
    /// </summary>
    public int Energy { get; set; }

    /// <summary>
    /// Returns a zero-cost (free) resource cost.
    /// </summary>
    public static ResourceCost Zero => new ResourceCost();

    /// <summary>
    /// Returns true if this cost is zero (free).
    /// </summary>
    public bool IsZero => Credits == 0 && Minerals == 0 && Fuel == 0 && Food == 0 && Energy == 0;

    /// <summary>
    /// Creates a ResourceDelta with negative values (for spending).
    /// </summary>
    public ResourceDelta ToDelta()
    {
        return new ResourceDelta
        {
            Credits = -Credits,
            Minerals = -Minerals,
            Fuel = -Fuel,
            Food = -Food,
            Energy = -Energy
        };
    }
}
