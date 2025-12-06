using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Equipment levels for platoons (body armor).
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum EquipmentLevel
{
    Civilian,   // 20,000 Credits, 0.5x modifier (no armor)
    Basic,      // 35,000 Credits, 1.0x modifier (light armor)
    Standard,   // 55,000 Credits, 1.5x modifier (medium armor)
    Advanced,   // 80,000 Credits, 2.0x modifier (heavy armor)
    Elite       // 109,000 Credits, 2.5x modifier (power armor)
}

/// <summary>
/// Weapon levels for platoons.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum WeaponLevel
{
    Pistol,        // 5,000 Credits, 0.8x modifier
    Rifle,         // 10,000 Credits, 1.0x modifier
    AssaultRifle,  // 18,000 Credits, 1.3x modifier
    Plasma         // 30,000 Credits, 1.6x modifier
}

/// <summary>
/// Platoon costs based on equipment and weapon levels.
/// </summary>
public class PlatoonCosts
{
    /// <summary>
    /// Equipment cost by level.
    /// </summary>
    public static int GetEquipmentCost(EquipmentLevel level)
    {
        return level switch
        {
            EquipmentLevel.Civilian => 20000,
            EquipmentLevel.Basic => 35000,
            EquipmentLevel.Standard => 55000,
            EquipmentLevel.Advanced => 80000,
            EquipmentLevel.Elite => 109000,
            _ => 0
        };
    }

    /// <summary>
    /// Weapon cost by level.
    /// </summary>
    public static int GetWeaponCost(WeaponLevel level)
    {
        return level switch
        {
            WeaponLevel.Pistol => 5000,
            WeaponLevel.Rifle => 10000,
            WeaponLevel.AssaultRifle => 18000,
            WeaponLevel.Plasma => 30000,
            _ => 0
        };
    }

    /// <summary>
    /// Total cost for a platoon (equipment + weapon, one-time cost).
    /// </summary>
    public static int GetTotalCost(EquipmentLevel equipment, WeaponLevel weapon)
    {
        return GetEquipmentCost(equipment) + GetWeaponCost(weapon);
    }
}

/// <summary>
/// Combat modifiers for equipment and weapons.
/// </summary>
public class PlatoonModifiers
{
    /// <summary>
    /// Equipment combat modifier.
    /// </summary>
    public static float GetEquipmentModifier(EquipmentLevel level)
    {
        return level switch
        {
            EquipmentLevel.Civilian => 0.5f,
            EquipmentLevel.Basic => 1.0f,
            EquipmentLevel.Standard => 1.5f,
            EquipmentLevel.Advanced => 2.0f,
            EquipmentLevel.Elite => 2.5f,
            _ => 1.0f
        };
    }

    /// <summary>
    /// Weapon combat modifier.
    /// </summary>
    public static float GetWeaponModifier(WeaponLevel level)
    {
        return level switch
        {
            WeaponLevel.Pistol => 0.8f,
            WeaponLevel.Rifle => 1.0f,
            WeaponLevel.AssaultRifle => 1.3f,
            WeaponLevel.Plasma => 1.6f,
            _ => 1.0f
        };
    }

    /// <summary>
    /// Training modifier (0.0 to 1.0 based on training level).
    /// </summary>
    public static float GetTrainingModifier(int trainingLevel)
    {
        return trainingLevel / 100.0f;
    }

    /// <summary>
    /// Calculates total military strength for a platoon.
    /// Formula: Troops × Equipment × Weapon × Training
    /// </summary>
    public static int CalculateMilitaryStrength(int troops, EquipmentLevel equipment, WeaponLevel weapon, int trainingLevel)
    {
        float equipMod = GetEquipmentModifier(equipment);
        float weaponMod = GetWeaponModifier(weapon);
        float trainingMod = GetTrainingModifier(trainingLevel);

        return (int)Math.Floor(troops * equipMod * weaponMod * trainingMod);
    }
}
