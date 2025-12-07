using System.Text.Json.Serialization;

namespace Overlord.Core.Models;

/// <summary>
/// Represents a ground battle between platoons.
/// </summary>
public class Battle
{
    public int PlanetID { get; set; }
    public string PlanetName { get; set; } = string.Empty;
    public FactionType AttackerFaction { get; set; }
    public FactionType DefenderFaction { get; set; }
    public List<int> AttackingPlatoonIDs { get; set; } = new List<int>();
    public List<int> DefendingPlatoonIDs { get; set; } = new List<int>();
}

/// <summary>
/// Result of a ground battle.
/// </summary>
public class BattleResult
{
    public bool AttackerWins { get; set; }
    public int AttackerStrength { get; set; }
    public int DefenderStrength { get; set; }
    public int AttackerCasualties { get; set; }
    public int DefenderCasualties { get; set; }
    public bool PlanetCaptured { get; set; }
    public Dictionary<int, int> PlatoonCasualties { get; set; } = new Dictionary<int, int>();
}

/// <summary>
/// Represents a space battle between craft fleets.
/// </summary>
public class SpaceBattle
{
    public int PlanetID { get; set; }
    public string PlanetName { get; set; } = string.Empty;
    public FactionType AttackerFaction { get; set; }
    public FactionType DefenderFaction { get; set; }
    public List<int> AttackerCraftIDs { get; set; } = new List<int>();
    public List<int> DefenderCraftIDs { get; set; } = new List<int>();
    public bool DefenderHasOrbitalDefense { get; set; }
}

/// <summary>
/// Result of a space battle.
/// </summary>
public class SpaceBattleResult
{
    public bool AttackerWins { get; set; }
    public int AttackerStrength { get; set; }
    public int DefenderStrength { get; set; }
    public int DamagePerCraft { get; set; }
    public List<int> DestroyedCraftIDs { get; set; } = new List<int>();
    public Dictionary<int, int> CraftDamage { get; set; } = new Dictionary<int, int>();
}

/// <summary>
/// Result of planetary bombardment.
/// </summary>
public class BombardmentResult
{
    public int PlanetID { get; set; }
    public int BombardmentStrength { get; set; }
    public int StructuresDestroyed { get; set; }
    public List<int> DestroyedStructureIDs { get; set; } = new List<int>();
    public int CivilianCasualties { get; set; }
    public int NewMorale { get; set; }
}

/// <summary>
/// Result of planetary invasion.
/// </summary>
public class InvasionResult
{
    public bool AttackerWins { get; set; }
    public bool PlanetCaptured { get; set; }
    public bool InstantSurrender { get; set; }
    public int AttackerCasualties { get; set; }
    public int DefenderCasualties { get; set; }
    public int NewPopulation { get; set; }
    public int NewMorale { get; set; }
    public ResourceDelta? CapturedResources { get; set; }
}
