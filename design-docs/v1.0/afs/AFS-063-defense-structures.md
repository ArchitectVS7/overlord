# AFS-063: Defense Structures

**Status:** Draft
**Priority:** P2 (Medium)
**Owner:** Lead Developer
**PRD Reference:** FR-MILITARY-007, FR-COLONY-003

---

## Summary

Planetary defense infrastructure system implementing Orbital Defense Platforms that provide defensive bonuses during space combat, protecting planets from invasion by granting +20% strength to defending craft, with construction mechanics and strategic placement considerations.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Defense structure storage
- **AFS-061 (Building System)**: Construction mechanics
- **AFS-042 (Space Combat)**: Defense bonus application
- **AFS-043 (Bombardment)**: Bombardment resistance

---

## Requirements

### Orbital Defense Platform

1. **Structure Type**
   - **Classification**: Orbital structure (immune to bombardment)
   - **Purpose**: Provide defensive bonus during space combat
   - **Bonus**: +20% strength to defending craft
   - **Capacity**: Maximum 2 per planet (orbital platform slots)
   - **Strategic Value**: Makes planets harder to invade

2. **Construction Requirements**
   - **Cost**: 150,000 Credits + 30,000 Minerals + 15,000 Fuel
   - **Construction Time**: 6 turns
   - **Prerequisite**: Must own planet (cannot build during invasion)
   - **Crew**: 20 population (maintenance and operation)
   - **Location**: Orbital slot (separate from Docking Bays)

3. **Defensive Capabilities**
   - **Space Combat Bonus**: +20% strength to defending craft (multiplicative)
   - **Bombardment Resistance**: None (orbital platforms cannot reduce bombardment)
   - **Ground Combat Bonus**: None (space-only defense)
   - **Automatic Activation**: No player action required, always active

### Defense Bonus Application

1. **Space Combat** (AFS-042)
   - **Trigger**: Enemy fleet arrives at planet with defense platform
   - **Calculation**: Defender Strength × (1.0 + 0.2 × Platforms)
   - **Example 1**: 1 Platform = +20% strength (1.2× multiplier)
   - **Example 2**: 2 Platforms = +40% strength (1.4× multiplier)
   - **Stacking**: Multiple platforms stack additively
   - **Display**: "Orbital Defense active: +20% defensive strength"

2. **Defense Bonus Example**
   - **Scenario**: Player defends planet with 1 Orbital Defense Platform
   - **Defender Fleet**: 2 Battle Cruisers (Laser, 100 each) = 200 base strength
   - **Defense Bonus**: 200 × 1.2 = **240 total strength**
   - **Attacker Fleet**: 2 Battle Cruisers (Laser, 100 each) = 200 strength
   - **Result**: Defender wins (240 vs 200) due to orbital defense

3. **Strategic Considerations**
   - **Cost-Effective**: Cheaper than building additional Battle Cruisers
   - **Defensive Doctrine**: Essential for protecting core colonies
   - **Vulnerable**: Can be destroyed by orbital bombardment? (No, immune as orbital structure)
   - **Limited Utility**: Only helps in space combat, not ground battles

### Construction Mechanics

1. **Build Process** (Uses AFS-061 Building System)
   - **Initiation**: Player selects "Build Orbital Defense Platform"
   - **Validation**: Check Credits/Minerals/Fuel, population (crew), platform limit (2)
   - **Construction**: State = UnderConstruction, TurnsRemaining = 6
   - **Completion**: State = Active, crew assigned, bonus active

2. **Capacity Limits**
   - **Maximum**: 2 Orbital Defense Platforms per planet
   - **Separate Slots**: Not counted in Docking Bay capacity (different orbital zones)
   - **Visual**: Displayed separately in planet defense panel
   - **Overflow**: Cannot build more than 2, button disabled when full

3. **Crew Assignment**
   - **Required**: 20 population per platform (maintenance)
   - **Inactive Without Crew**: Platform inactive if insufficient population
   - **Priority**: Lower than production buildings (Mining, Horticultural)
   - **Display**: "Orbital Defense Platform inactive (insufficient crew)"

### Platform Management

1. **Status Indicators**
   - **Active**: Fully operational, providing +20% defense bonus
   - **Under Construction**: Not yet operational (countdown visible)
   - **Inactive**: Built but no crew assigned (no bonus)
   - **Destroyed**: Combat damage (future feature, not MVP)

2. **Scrapping**
   - **Player Action**: Can scrap platforms to free orbital slots
   - **Refund**: 50% of cost (75,000 Credits + 15,000 Minerals + 7,500 Fuel)
   - **Crew Return**: 20 population returned to planet
   - **Strategic**: Remove obsolete defenses to build new structures

3. **AI Behavior**
   - **Construction**: AI builds Orbital Defense on core colonies (AFS-051)
   - **Priority**: Higher priority on Hard difficulty
   - **Strategic**: AI protects high-value planets (Volcanic, rich resources)
   - **Example**: Hard AI builds 2 platforms at every colony by turn 20

### Future Expansion (Post-MVP)

1. **Advanced Defense Platforms** (Not MVP)
   - **Tier 2**: Enhanced Platform (+35% bonus, 2× cost)
   - **Tier 3**: Fortress Platform (+50% bonus, 3× cost, 1 per planet)
   - **Implementation**: Post-MVP upgrade path

2. **Planetary Shields** (Not MVP)
   - **Purpose**: Reduce bombardment damage by 50%
   - **Cost**: 300,000 Credits (expensive!)
   - **Strategic**: Protect infrastructure from orbital bombardment
   - **Implementation**: Post-MVP defensive option

3. **Surface-to-Space Missiles** (Not MVP)
   - **Purpose**: Deal damage to attacking fleet before combat
   - **Mechanic**: 10% HP damage to 1 random attacker craft
   - **Implementation**: Post-MVP active defense

### Defense Structure UI

1. **Defense Panel** (Planet Management Screen)
   - **Display Elements**:
     - Orbital Defense Platforms: 1/2
     - Defense bonus: +20% (or +40% if 2 platforms)
     - Crew assigned: 20/20
     - Status: Active / Under Construction / Inactive
   - **Build Button**: "Build Orbital Defense Platform" (disabled if at capacity)

2. **Planet Info Tooltip**
   - **Hover**: Show defense bonus in planet info
   - **Display**: "Defense: +20% (1 Orbital Platform)"
   - **Warning**: "No orbital defenses! Vulnerable to attack!"

3. **Combat Log Integration**
   - **Display**: "Orbital Defense active: Defender strength increased to 240 (+20%)"
   - **Visual**: Icon showing shield/defense when bonus applied
   - **Strategic Feedback**: Player sees defense value in combat results

---

## Acceptance Criteria

### Functional Criteria

- [ ] Orbital Defense Platform constructible (150K Credits, 6 turns, 20 crew)
- [ ] Maximum 2 platforms per planet enforced
- [ ] Defense bonus applies correctly (+20% per platform)
- [ ] Platforms immune to orbital bombardment (orbital structure)
- [ ] Inactive platforms without crew assigned
- [ ] Platforms can be scrapped (50% refund)
- [ ] AI builds Orbital Defense on core colonies
- [ ] Defense bonus stacks additively (2 platforms = +40%)

### Performance Criteria

- [ ] Construction validation executes in <10ms
- [ ] Defense bonus calculation executes in <5ms
- [ ] No performance impact on combat resolution

### Integration Criteria

- [ ] Integrates with Building System (AFS-061) for construction
- [ ] Applies bonus in Space Combat System (AFS-042)
- [ ] Uses Resource System (AFS-021) for costs
- [ ] Uses Population System (AFS-023) for crew allocation
- [ ] AI uses in Decision System (AFS-051) for defense planning

---

## Technical Notes

### Implementation Approach

```csharp
public class DefenseSystem : MonoBehaviour
{
    private static DefenseSystem _instance;
    public static DefenseSystem Instance => _instance;

    public event Action<int> OnDefensePlatformBuilt; // planetID
    public event Action<int> OnDefensePlatformDestroyed; // planetID

    // Get defensive bonus multiplier for planet
    public float GetDefenseBonus(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return 1.0f; // No bonus

        // Count active Orbital Defense Platforms
        int activePlatforms = planet.Structures
            .Count(s => s.Type == BuildingType.OrbitalDefensePlatform && s.Status == BuildingStatus.Active);

        // Calculate bonus (20% per platform, stacks additively)
        float bonus = 1.0f + (activePlatforms * 0.2f);

        Debug.Log($"{planet.Name} defense bonus: {bonus}× ({activePlatforms} platforms)");

        return bonus;
    }

    // Build Orbital Defense Platform (uses AFS-061 BuildingSystem)
    public bool BuildDefensePlatform(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return false;

        // Check platform limit (max 2)
        int currentPlatforms = planet.Structures
            .Count(s => s.Type == BuildingType.OrbitalDefensePlatform);

        if (currentPlatforms >= 2)
        {
            UIManager.Instance.ShowError("Maximum 2 Orbital Defense Platforms per planet!");
            return false;
        }

        // Use BuildingSystem to construct
        bool success = BuildingSystem.Instance.StartConstruction(planetID, BuildingType.OrbitalDefensePlatform);

        if (success)
        {
            OnDefensePlatformBuilt?.Invoke(planetID);
        }

        return success;
    }

    // Apply defense bonus to combat (called by SpaceCombatSystem)
    public int ApplyDefenseBonus(int planetID, int baseStrength)
    {
        float bonus = GetDefenseBonus(planetID);
        int modifiedStrength = Mathf.FloorToInt(baseStrength * bonus);

        if (bonus > 1.0f)
        {
            UIManager.Instance.ShowMessage($"Orbital Defense active: +{(bonus - 1.0f) * 100:F0}% defensive strength");
        }

        return modifiedStrength;
    }

    // Check if planet has active defenses
    public bool HasActiveDefenses(int planetID)
    {
        return GetDefenseBonus(planetID) > 1.0f;
    }

    // Get defense platform count (for UI)
    public int GetDefensePlatformCount(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return 0;

        return planet.Structures
            .Count(s => s.Type == BuildingType.OrbitalDefensePlatform);
    }
}
```

### Extension to BuildingSystem (AFS-061)

```csharp
// Add to BuildingType enum
public enum BuildingType
{
    DockingBay,
    SurfacePlatform,
    MiningStation,
    HorticulturalStation,
    OrbitalDefensePlatform // New type
}

// Add to GetBuildingCost()
case BuildingType.OrbitalDefensePlatform:
    return new ResourceCost { Credits = 150000, Minerals = 30000, Fuel = 15000 };

// Add to GetConstructionTime()
case BuildingType.OrbitalDefensePlatform: return 6;

// Add to GetCrewRequired()
case BuildingType.OrbitalDefensePlatform: return 20;
```

### Defense Bonus Examples

**Example 1: Single Platform**
- Defender: 200 base strength
- Defense Bonus: 200 × 1.2 = **240 total strength** (+20%)

**Example 2: Double Platform**
- Defender: 200 base strength
- Defense Bonus: 200 × 1.4 = **280 total strength** (+40%)

**Example 3: No Platforms**
- Defender: 200 base strength
- Defense Bonus: 200 × 1.0 = **200 total strength** (no bonus)

### Cost-Benefit Analysis

**Orbital Defense Platform:**
- Cost: 150,000 Credits + 30,000 Minerals + 15,000 Fuel
- Benefit: +20% defensive strength (permanent)
- Equivalent to: Adding 1 extra Battle Cruiser (100 strength) to 500-strength fleet

**vs Battle Cruiser:**
- Cost: 1,000,000 Credits + 200,000 Minerals + 100,000 Fuel (6× more expensive!)
- Benefit: +100 strength (mobile, can attack)
- Strategic: Platforms cheaper for pure defense, cruisers better for offense

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Structure storage
- **AFS-061 (Building System)**: Construction mechanics

### Depended On By
- **AFS-042 (Space Combat)**: Defense bonus application
- **AFS-051 (AI Decision System)**: AI defense planning
- **AFS-071 (UI State Machine)**: Defense panel UI

### Events Published
- `OnDefensePlatformBuilt(int planetID)`: Platform construction started
- `OnDefensePlatformDestroyed(int planetID)`: Platform destroyed (future feature)

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
