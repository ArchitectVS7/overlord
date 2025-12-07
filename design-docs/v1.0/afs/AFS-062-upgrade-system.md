# AFS-062: Upgrade System

**Status:** Draft
**Priority:** P2 (Medium)
**Owner:** Lead Developer
**PRD Reference:** FR-MILITARY-002

---

## Summary

Technology upgrade system implementing fleet-wide weapon upgrades for Battle Cruisers (Laser → Missile → Photon Torpedo) with progressive research costs and construction time, providing strategic progression and military advantage as the game advances.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Technology level storage
- **AFS-021 (Resource System)**: Upgrade costs
- **AFS-032 (Craft System)**: Weapon level application
- **AFS-042 (Space Combat)**: Weapon damage modifiers

---

## Requirements

### Weapon Upgrade Progression

1. **Technology Tree** (Linear Progression)
   - **Tier 1**: Laser (starting weapon, 1.0x damage)
   - **Tier 2**: Missile (requires Laser, 1.5x damage)
   - **Tier 3**: Photon Torpedo (requires Missile, 2.0x damage)
   - **Restriction**: Must upgrade sequentially (cannot skip tiers)
   - **Strategic**: Each tier doubles combat effectiveness vs Tier 1

2. **Upgrade Costs**
   - **Missile Upgrade**: 500,000 Credits
   - **Photon Torpedo Upgrade**: 1,000,000 Credits
   - **Total Cost**: 1,500,000 Credits for full progression (Laser → Photon)
   - **One-Time**: Cost applies to entire fleet (all Battle Cruisers)
   - **Persistent**: New Battle Cruisers built with current weapon level

3. **Research Time** (Turn-Based)
   - **Missile Research**: 5 turns
   - **Photon Research**: 8 turns
   - **Total Time**: 13 turns for full progression
   - **Non-Blocking**: Player can build/train during research
   - **Display**: "Missile Research: 3 turns remaining"

### Upgrade Mechanics

1. **Research Initiation**
   - **Action Phase**: Player selects "Research Upgrade" action
   - **Validation**: Check Credits, current weapon level, research queue
   - **Deduction**: Cost paid upfront (not on completion)
   - **Queue**: Only 1 upgrade can be researched at a time (MVP)

2. **Research Progress**
   - **Income Phase**: Research countdown decrements by 1 turn
   - **Completion**: Weapon level increases automatically
   - **Fleet Upgrade**: All existing Battle Cruisers upgrade instantly
   - **Future Craft**: New Battle Cruisers built with upgraded weapons
   - **Display**: "Missile research complete! Fleet upgraded to Missile weapons."

3. **Upgrade Application**
   - **Immediate**: Existing craft receive upgrade at turn end
   - **Retroactive**: All Battle Cruisers benefit (including damaged ones)
   - **Permanent**: Upgrade persists across save/load
   - **Strategic**: Delayed payoff encourages planning

### Upgrade Benefits

1. **Combat Strength**
   - **Laser (1.0x)**: Base 100 strength per Battle Cruiser
   - **Missile (1.5x)**: 150 strength per Battle Cruiser (+50%)
   - **Photon (2.0x)**: 200 strength per Battle Cruiser (+100%)
   - **Example**: 3 Battle Cruisers
     - Laser: 3 × 100 = **300 total strength**
     - Missile: 3 × 150 = **450 total strength**
     - Photon: 3 × 200 = **600 total strength**

2. **Strategic Timing**
   - **Early Game**: Laser sufficient for AI fleets
   - **Mid Game**: Missile upgrade crucial for space dominance
   - **Late Game**: Photon required to overcome AI Hard difficulty
   - **Resource Priority**: Balance upgrade cost vs fleet expansion

3. **Competitive Advantage**
   - **AI Upgrade**: AI also researches weapons (AFS-051)
   - **Arms Race**: Player vs AI weapon level competition
   - **Superiority**: Higher weapon tier = significant combat advantage
   - **Example**: Player Photon (2.0x) vs AI Laser (1.0x) = 2× strength advantage

### Future Expansion (Post-MVP)

1. **Additional Upgrade Paths** (Not MVP)
   - **Building Upgrades**: Mining Station II (2× production)
   - **Platoon Upgrades**: Elite Training Program (+50% strength)
   - **Ship Upgrades**: Battle Cruiser HP increase (+50 HP)
   - **Implementation**: Post-MVP feature

2. **Parallel Research** (Not MVP)
   - **Concept**: Research multiple upgrades simultaneously
   - **Cost**: Increased complexity in UI and balancing
   - **Implementation**: Post-MVP feature

3. **Tech Branches** (Not MVP)
   - **Concept**: Choose between mutually exclusive upgrades
   - **Example**: Offensive (damage) vs Defensive (HP/shields)
   - **Implementation**: Post-MVP feature

### Upgrade UI

1. **Research Panel**
   - **Location**: Technology tab in planet management
   - **Display Elements**:
     - Current weapon level (Laser / Missile / Photon)
     - Next upgrade button (if available)
     - Cost preview (Credits)
     - Research time (turns)
     - Progress bar (if researching)
   - **Disabled State**: Next upgrade grayed out if:
     - Insufficient Credits
     - Research already in progress
     - Maximum tier reached (Photon)

2. **Research Progress Indicator**
   - **HUD Element**: Small icon with turn countdown
   - **Display**: "Research: Missile (3 turns)"
   - **Completion Notification**: Pop-up message with visual effect
   - **Sound**: Victory fanfare when upgrade completes

3. **Fleet Status Display**
   - **Battle Cruiser Info**: Show weapon level icon
   - **Tooltip**: "Armed with Missile weapons (1.5× damage)"
   - **Comparison**: Show strength vs enemy craft (if known)

---

## Acceptance Criteria

### Functional Criteria

- [ ] Three weapon tiers (Laser, Missile, Photon) implemented
- [ ] Sequential progression enforced (Laser → Missile → Photon)
- [ ] Upgrade costs deducted correctly (500K, 1M Credits)
- [ ] Research time counts down each turn (5, 8 turns)
- [ ] Existing Battle Cruisers upgraded on completion
- [ ] New Battle Cruisers built with current weapon level
- [ ] Only one upgrade can be researched at a time (MVP)
- [ ] Weapon upgrades persist across save/load
- [ ] AI can research weapon upgrades (AFS-051)

### Performance Criteria

- [ ] Research initiation executes in <50ms
- [ ] Fleet upgrade application executes in <100ms
- [ ] No performance impact on combat calculations

### Integration Criteria

- [ ] Integrates with Resource System (AFS-021) for upgrade costs
- [ ] Updates Craft System (AFS-032) for weapon levels
- [ ] Affects Space Combat System (AFS-042) for damage modifiers
- [ ] Triggered by Turn System (AFS-002) for research progress
- [ ] Saves upgrade state with Game State Manager (AFS-001)

---

## Technical Notes

### Implementation Approach

```csharp
public enum WeaponLevel
{
    Laser,
    Missile,
    PhotonTorpedo
}

public class UpgradeSystem : MonoBehaviour
{
    private static UpgradeSystem _instance;
    public static UpgradeSystem Instance => _instance;

    private WeaponLevel _currentWeaponLevel = WeaponLevel.Laser;
    private WeaponLevel? _researchingWeapon = null;
    private int _researchTurnsRemaining = 0;

    public WeaponLevel CurrentWeaponLevel => _currentWeaponLevel;
    public bool IsResearching => _researchingWeapon.HasValue;

    public event Action<WeaponLevel> OnUpgradeStarted;
    public event Action<WeaponLevel> OnUpgradeCompleted;

    // Start weapon upgrade research
    public bool StartWeaponUpgrade(FactionType faction)
    {
        // Validate: Only player can manually research (AI uses AFS-051)
        if (faction != FactionType.Player)
            return false;

        // Validate: Check if already researching
        if (IsResearching)
        {
            UIManager.Instance.ShowError("Already researching upgrade!");
            return false;
        }

        // Get next weapon level
        WeaponLevel nextWeapon = GetNextWeaponLevel(_currentWeaponLevel);
        if (nextWeapon == _currentWeaponLevel)
        {
            UIManager.Instance.ShowError("Already at maximum weapon level!");
            return false;
        }

        // Get cost and research time
        var cost = GetUpgradeCost(nextWeapon);
        int researchTime = GetResearchTime(nextWeapon);

        // Validate resources
        if (!ResourceSystem.Instance.CanAfford(cost))
        {
            UIManager.Instance.ShowError($"Insufficient Credits! Need {cost.Credits:N0}");
            return false;
        }

        // Deduct cost
        ResourceSystem.Instance.RemoveResources(cost);

        // Start research
        _researchingWeapon = nextWeapon;
        _researchTurnsRemaining = researchTime;

        OnUpgradeStarted?.Invoke(nextWeapon);
        UIManager.Instance.ShowMessage($"{nextWeapon} research started ({researchTime} turns, {cost.Credits:N0} Credits)");
        Debug.Log($"Started {nextWeapon} research: {researchTime} turns");

        return true;
    }

    // Update research progress (called each turn)
    public void UpdateResearch()
    {
        if (!IsResearching)
            return;

        _researchTurnsRemaining--;
        Debug.Log($"{_researchingWeapon} research: {_researchTurnsRemaining} turns remaining");

        if (_researchTurnsRemaining <= 0)
        {
            // Research complete
            CompleteUpgrade(_researchingWeapon.Value);
        }
    }

    // Complete weapon upgrade
    private void CompleteUpgrade(WeaponLevel newWeapon)
    {
        _currentWeaponLevel = newWeapon;
        _researchingWeapon = null;
        _researchTurnsRemaining = 0;

        // Upgrade all existing Battle Cruisers
        UpgradeFleet(newWeapon);

        OnUpgradeCompleted?.Invoke(newWeapon);
        UIManager.Instance.ShowMessage($"{newWeapon} research complete! Fleet upgraded to {newWeapon} weapons.");
        Debug.Log($"{newWeapon} upgrade complete");
    }

    // Upgrade all Battle Cruisers to new weapon level
    private void UpgradeFleet(WeaponLevel newWeapon)
    {
        var playerCraft = GameStateManager.Instance.GetCraftByOwner(FactionType.Player);
        var battleCruisers = playerCraft.Where(c => c.Type == CraftType.BattleCruiser).ToList();

        foreach (var cruiser in battleCruisers)
        {
            cruiser.WeaponLevel = newWeapon;
            Debug.Log($"{cruiser.Name} upgraded to {newWeapon}");
        }

        Debug.Log($"Upgraded {battleCruisers.Count} Battle Cruisers to {newWeapon}");
    }

    // Get next weapon level in progression
    private WeaponLevel GetNextWeaponLevel(WeaponLevel current)
    {
        switch (current)
        {
            case WeaponLevel.Laser: return WeaponLevel.Missile;
            case WeaponLevel.Missile: return WeaponLevel.PhotonTorpedo;
            case WeaponLevel.PhotonTorpedo: return WeaponLevel.PhotonTorpedo; // Max level
            default: return WeaponLevel.Laser;
        }
    }

    // Get upgrade cost
    private ResourceCost GetUpgradeCost(WeaponLevel weapon)
    {
        switch (weapon)
        {
            case WeaponLevel.Missile:
                return new ResourceCost { Credits = 500000 };
            case WeaponLevel.PhotonTorpedo:
                return new ResourceCost { Credits = 1000000 };
            default:
                return ResourceCost.Zero;
        }
    }

    // Get research time
    private int GetResearchTime(WeaponLevel weapon)
    {
        switch (weapon)
        {
            case WeaponLevel.Missile: return 5;
            case WeaponLevel.PhotonTorpedo: return 8;
            default: return 0;
        }
    }

    // Get current research progress (for UI)
    public ResearchProgress GetResearchProgress()
    {
        if (!IsResearching)
            return null;

        return new ResearchProgress
        {
            WeaponLevel = _researchingWeapon.Value,
            TurnsRemaining = _researchTurnsRemaining
        };
    }
}

public class ResearchProgress
{
    public WeaponLevel WeaponLevel;
    public int TurnsRemaining;
}
```

### Upgrade Cost & Time Summary

| Weapon Level | Cost (Credits) | Research Time | Damage Modifier | Cumulative Cost |
|--------------|----------------|---------------|-----------------|-----------------|
| Laser | 0 (starting) | 0 | 1.0× | 0 |
| Missile | 500,000 | 5 turns | 1.5× | 500,000 |
| Photon Torpedo | 1,000,000 | 8 turns | 2.0× | 1,500,000 |

### Strategic Value Analysis

**Early Missile Upgrade (Turn 10):**
- Cost: 500,000 Credits
- Time Investment: 5 turns
- Combat Boost: +50% fleet strength
- ROI: Essential for mid-game dominance

**Late Photon Upgrade (Turn 25):**
- Cost: 1,000,000 Credits (expensive!)
- Time Investment: 8 turns (long!)
- Combat Boost: +100% fleet strength vs Laser
- ROI: Necessary for defeating Hard AI

**Delayed Upgrade (Turn 40+):**
- Risk: AI may outpace player technologically
- Consequence: Player fleet becomes obsolete
- Recovery: Very difficult without weapon parity

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Weapon level storage
- **AFS-021 (Resource System)**: Upgrade costs

### Depended On By
- **AFS-002 (Turn System)**: Research progress updates
- **AFS-032 (Craft System)**: Weapon level application
- **AFS-042 (Space Combat)**: Weapon damage modifiers
- **AFS-051 (AI Decision System)**: AI upgrade planning
- **AFS-071 (UI State Machine)**: Research panel UI

### Events Published
- `OnUpgradeStarted(WeaponLevel weapon)`: Research initiated
- `OnUpgradeCompleted(WeaponLevel weapon)`: Research complete, fleet upgraded

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
