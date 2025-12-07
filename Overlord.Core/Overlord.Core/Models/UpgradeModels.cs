using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Weapon levels for Battle Cruisers.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WeaponTier
{
    Laser,          // 1.0x damage (starting)
    Missile,        // 1.5x damage (Tier 2)
    PhotonTorpedo   // 2.0x damage (Tier 3)
}

/// <summary>
/// Upgrade costs and research times.
/// </summary>
public class UpgradeCosts
{
    /// <summary>
    /// Gets the research cost for a weapon tier.
    /// </summary>
    public static int GetResearchCost(WeaponTier tier)
    {
        return tier switch
        {
            WeaponTier.Missile => 500000,       // 500,000 Credits
            WeaponTier.PhotonTorpedo => 1000000, // 1,000,000 Credits
            _ => 0 // Laser is starting tier (no cost)
        };
    }

    /// <summary>
    /// Gets the research time in turns.
    /// </summary>
    public static int GetResearchTime(WeaponTier tier)
    {
        return tier switch
        {
            WeaponTier.Missile => 5,          // 5 turns
            WeaponTier.PhotonTorpedo => 8,    // 8 turns
            _ => 0 // Laser is starting tier (no research)
        };
    }

    /// <summary>
    /// Gets the damage modifier for a weapon tier.
    /// </summary>
    public static float GetDamageModifier(WeaponTier tier)
    {
        return tier switch
        {
            WeaponTier.Laser => 1.0f,
            WeaponTier.Missile => 1.5f,
            WeaponTier.PhotonTorpedo => 2.0f,
            _ => 1.0f
        };
    }
}
