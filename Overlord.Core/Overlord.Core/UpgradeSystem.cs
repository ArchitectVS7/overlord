using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic upgrade system for fleet-wide weapon research.
/// Manages weapon tier progression (Laser → Missile → Photon Torpedo).
/// </summary>
public class UpgradeSystem
{
    private readonly GameState _gameState;

    /// <summary>
    /// Event fired when weapon research starts.
    /// Parameters: (faction, weaponTier)
    /// </summary>
    public event Action<FactionType, WeaponTier>? OnResearchStarted;

    /// <summary>
    /// Event fired when weapon research completes.
    /// Parameters: (faction, weaponTier)
    /// </summary>
    public event Action<FactionType, WeaponTier>? OnResearchCompleted;

    // Research state per faction
    private WeaponTier _playerWeaponTier = WeaponTier.Laser;
    private WeaponTier _aiWeaponTier = WeaponTier.Laser;

    private WeaponTier? _playerResearchingTier = null;
    private WeaponTier? _aiResearchingTier = null;

    private int _playerResearchTurnsRemaining = 0;
    private int _aiResearchTurnsRemaining = 0;

    public UpgradeSystem(GameState gameState)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
    }

    /// <summary>
    /// Gets the current weapon tier for a faction.
    /// </summary>
    public WeaponTier GetWeaponTier(FactionType faction)
    {
        return faction == FactionType.Player ? _playerWeaponTier : _aiWeaponTier;
    }

    /// <summary>
    /// Checks if a faction is currently researching a weapon upgrade.
    /// </summary>
    public bool IsResearching(FactionType faction)
    {
        return faction == FactionType.Player ? _playerResearchingTier.HasValue : _aiResearchingTier.HasValue;
    }

    /// <summary>
    /// Gets the weapon tier currently being researched (null if none).
    /// </summary>
    public WeaponTier? GetResearchingTier(FactionType faction)
    {
        return faction == FactionType.Player ? _playerResearchingTier : _aiResearchingTier;
    }

    /// <summary>
    /// Gets the remaining research turns for a faction.
    /// </summary>
    public int GetResearchTurnsRemaining(FactionType faction)
    {
        return faction == FactionType.Player ? _playerResearchTurnsRemaining : _aiResearchTurnsRemaining;
    }

    /// <summary>
    /// Starts weapon upgrade research for a faction.
    /// </summary>
    /// <param name="faction">Faction researching</param>
    /// <returns>True if research started, false if failed</returns>
    public bool StartResearch(FactionType faction)
    {
        // Get current and target tiers
        var currentTier = GetWeaponTier(faction);
        var nextTier = GetNextTier(currentTier);

        // Cannot research if already at max tier
        if (nextTier == null)
            return false; // Already at Photon Torpedo

        // Cannot research if already researching
        if (IsResearching(faction))
            return false; // Research already in progress

        // Get cost
        int cost = UpgradeCosts.GetResearchCost(nextTier.Value);

        // Validate resources (from faction resources)
        var factionState = faction == FactionType.Player ? _gameState.PlayerFaction : _gameState.AIFaction;
        if (factionState.Resources.Credits < cost)
            return false; // Insufficient credits

        // Deduct cost
        factionState.Resources.Credits -= cost;

        // Start research
        int researchTime = UpgradeCosts.GetResearchTime(nextTier.Value);

        if (faction == FactionType.Player)
        {
            _playerResearchingTier = nextTier;
            _playerResearchTurnsRemaining = researchTime;
        }
        else
        {
            _aiResearchingTier = nextTier;
            _aiResearchTurnsRemaining = researchTime;
        }

        OnResearchStarted?.Invoke(faction, nextTier.Value);
        return true;
    }

    /// <summary>
    /// Updates research progress (called each turn during Income Phase).
    /// </summary>
    public void UpdateResearch()
    {
        // Update player research
        if (_playerResearchingTier.HasValue && _playerResearchTurnsRemaining > 0)
        {
            _playerResearchTurnsRemaining--;

            if (_playerResearchTurnsRemaining <= 0)
            {
                CompleteResearch(FactionType.Player);
            }
        }

        // Update AI research
        if (_aiResearchingTier.HasValue && _aiResearchTurnsRemaining > 0)
        {
            _aiResearchTurnsRemaining--;

            if (_aiResearchTurnsRemaining <= 0)
            {
                CompleteResearch(FactionType.AI);
            }
        }
    }

    /// <summary>
    /// Completes weapon research and upgrades all Battle Cruisers.
    /// </summary>
    private void CompleteResearch(FactionType faction)
    {
        WeaponTier? researchedTier = faction == FactionType.Player ? _playerResearchingTier : _aiResearchingTier;

        if (!researchedTier.HasValue)
            return;

        // Upgrade faction weapon tier
        if (faction == FactionType.Player)
        {
            _playerWeaponTier = researchedTier.Value;
            _playerResearchingTier = null;
            _playerResearchTurnsRemaining = 0;
        }
        else
        {
            _aiWeaponTier = researchedTier.Value;
            _aiResearchingTier = null;
            _aiResearchTurnsRemaining = 0;
        }

        // Upgrade all existing Battle Cruisers owned by this faction
        var battleCruisers = _gameState.Craft
            .Where(c => c.Owner == faction && c.Type == CraftType.BattleCruiser)
            .ToList();

        foreach (var craft in battleCruisers)
        {
            // Apply weapon upgrade (future combat system will use this)
            // For now, we can just track the faction's weapon tier
        }

        OnResearchCompleted?.Invoke(faction, researchedTier.Value);
    }

    /// <summary>
    /// Gets the next weapon tier in progression.
    /// </summary>
    private WeaponTier? GetNextTier(WeaponTier current)
    {
        return current switch
        {
            WeaponTier.Laser => WeaponTier.Missile,
            WeaponTier.Missile => WeaponTier.PhotonTorpedo,
            WeaponTier.PhotonTorpedo => null, // Max tier
            _ => null
        };
    }

    /// <summary>
    /// Checks if a faction can afford to start the next weapon research.
    /// </summary>
    public bool CanAffordNextResearch(FactionType faction)
    {
        var currentTier = GetWeaponTier(faction);
        var nextTier = GetNextTier(currentTier);

        if (nextTier == null)
            return false; // Already at max tier

        int cost = UpgradeCosts.GetResearchCost(nextTier.Value);
        var factionState = faction == FactionType.Player ? _gameState.PlayerFaction : _gameState.AIFaction;

        return factionState.Resources.Credits >= cost;
    }

    /// <summary>
    /// Gets the damage modifier for a faction's current weapon tier.
    /// </summary>
    public float GetDamageModifier(FactionType faction)
    {
        var tier = GetWeaponTier(faction);
        return UpgradeCosts.GetDamageModifier(tier);
    }
}
