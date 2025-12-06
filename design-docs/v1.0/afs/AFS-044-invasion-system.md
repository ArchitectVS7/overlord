# AFS-044: Invasion System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-COMBAT-003, FR-MILITARY-002

---

## Summary

Planetary invasion system implementing ground assault mechanics where platoons aboard Battle Cruisers land on enemy planets, engage defending garrison forces in ground combat, and capture the planet if attackers win, transferring ownership and remaining population to the victor.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet ownership and platoon data
- **AFS-032 (Craft System)**: Battle Cruiser transport capacity
- **AFS-033 (Platoon System)**: Platoon strength calculation
- **AFS-041 (Combat System)**: Ground combat resolution
- **AFS-042 (Space Combat)**: Orbital control requirement

---

## Requirements

### Invasion Prerequisites

1. **Orbital Control**
   - **Required**: Attacker must control planet orbit (no enemy craft)
   - **Validation**: Space combat must be won first (AFS-042)
   - **Strategic**: Cannot invade while enemy fleet defends
   - **Display**: "Must secure orbital control before landing forces!"

2. **Invasion Force**
   - **Transport**: Platoons aboard Battle Cruisers (max 4 per ship)
   - **Minimum**: At least 1 platoon required to invade
   - **Landing**: All platoons land simultaneously
   - **Display**: "3 platoons preparing to land on Zeta Reticuli..."

3. **Defender Garrison**
   - **Defense**: Planet's garrisoned platoons defend automatically
   - **Zero Defense**: If no garrison, planet surrenders immediately
   - **Strategic**: Undefended colonies are easy captures
   - **Display**: "No garrison detected, planet surrenders!"

### Invasion Execution

1. **Landing Phase**
   - **Trigger**: Player selects "Invade Planet" during Action Phase
   - **Automatic**: All platoons aboard orbiting Battle Cruisers land
   - **Disembark**: Platoons transfer from ships to planet surface
   - **Combat**: Ground battle begins immediately

2. **Ground Combat Resolution**
   - **Uses**: AFS-041 Combat System mechanics
   - **Attacker Strength**: Sum of all landing platoon strengths
   - **Defender Strength**: Sum of all garrison platoon strengths
   - **Formula**: Same as AFS-041 (Troops × Equipment × Weapon × Training)
   - **Casualties**: Both sides take casualties based on strength ratio

3. **Victory Conditions**
   - **Attacker Victory**: All defender platoons destroyed
   - **Defender Victory**: All attacker platoons destroyed
   - **Outcome**: Winner controls planet

### Planet Capture Mechanics

1. **Ownership Transfer**
   - **Trigger**: Attacker wins ground combat
   - **Transfer**: Planet.Owner changes to attacker faction
   - **Immediate**: Takes effect at end of Combat Phase
   - **Display**: "Zeta Reticuli captured! Planet now under your control."

2. **Population Transfer**
   - **Survival**: Civilian population becomes attacker's workforce
   - **Morale Impact**: Population morale reduced by 30% (occupation penalty)
   - **Strategic**: Conquered populations are less productive initially
   - **Example**: 300 population at 80% morale → 70 morale after conquest

3. **Infrastructure Capture**
   - **Buildings**: All structures transfer intact to attacker
   - **Production**: Mining/Horticultural Stations continue operating
   - **Crew Reallocation**: Structures become inactive (no crew assigned)
   - **Strategic**: Attacker must allocate own population to crew buildings

4. **Resource Transfer**
   - **Stockpiles**: Planet's Credits, Minerals, Fuel, Food transfer to attacker
   - **Full Transfer**: Attacker gains all stored resources
   - **Strategic**: Rich colonies are high-value targets
   - **Display**: "Captured 15,000 Credits, 5,000 Minerals, 2,000 Fuel!"

### Invasion Casualties

1. **Attacker Casualties**
   - **Survival**: Platoons with HP > 0 survive and garrison planet
   - **Destroyed**: Platoons with HP ≤ 0 are eliminated
   - **Strength Loss**: Surviving platoons lose troops based on damage
   - **Example**: 150-troop platoon takes 40% casualties → 90 troops remain

2. **Defender Casualties**
   - **Total Loss**: All defender platoons destroyed on defeat
   - **No Retreat**: Defenders fight to the death (MVP, no surrender)
   - **Equipment Lost**: All defender equipment destroyed
   - **Example**: AI loses 3 platoons (450 troops total)

3. **Pyrrhic Victory**
   - **Scenario**: Attacker wins but loses most platoons
   - **Risk**: Captured planet left undefended, vulnerable to counter-attack
   - **Strategic**: Ensure overwhelming force to minimize casualties
   - **Display**: "Victory! But 2 of 3 platoons destroyed in fierce battle."

### Post-Invasion State

1. **Garrison Assignment**
   - **Automatic**: Surviving attacker platoons garrison planet
   - **Defense**: Platoons defend against future invasions
   - **Redeployment**: Player can evacuate platoons later via Battle Cruisers
   - **Display**: "2 platoons garrisoned at Zeta Reticuli"

2. **Economic Integration**
   - **Immediate**: Planet's resources added to attacker's income
   - **Delayed Production**: Buildings inactive until crew assigned
   - **Population Growth**: Conquered population grows normally
   - **Morale Recovery**: Morale recovers slowly (+5% per turn if food surplus)

### Invasion Example

**Scenario: Player Invades AI Colony**

**Attacker: Player Fleet at Zeta Reticuli**
- 2 Battle Cruisers (orbital control secured)
- 3 Platoons aboard:
  - Platoon 01: 150 troops, Standard armor (1.5x), Assault Rifle (1.3x), 100% trained → **293 strength**
  - Platoon 02: 120 troops, Basic armor (1.0x), Rifle (1.0x), 100% trained → **120 strength**
  - Platoon 03: 100 troops, Standard armor (1.5x), Assault Rifle (1.3x), 80% trained → **156 strength**
- **Total Attacker Strength**: 569

**Defender: AI Garrison at Zeta Reticuli**
- 2 Platoons garrisoned:
  - Platoon 05: 100 troops, Basic armor (1.0x), Rifle (1.0x), 100% trained → **100 strength**
  - Platoon 06: 80 troops, Civilian armor (0.5x), Pistol (0.8x), 60% trained → **19 strength**
- **Total Defender Strength**: 119

**Combat Resolution (AFS-041):**
1. Strength Ratio: 569 ÷ 119 = 4.78
2. Attacker Casualties: Minimal (overwhelming advantage)
   - Platoon 01: 150 → 145 troops (-5)
   - Platoon 02: 120 → 117 troops (-3)
   - Platoon 03: 100 → 98 troops (-2)
3. Defender Casualties: **Total destruction** (all platoons destroyed)

**Result:**
- **Planet captured!** Ownership: AI → Player
- Population: 250 (morale 70% → 40% occupation penalty)
- Resources captured: 10,000 Credits, 3,000 Minerals, 1,500 Fuel
- Buildings: 2 Mining Stations, 1 Horticultural Station (inactive, need crew)
- Garrison: 3 platoons (360 troops total) defend planet

---

## Acceptance Criteria

### Functional Criteria

- [ ] Invasion requires orbital control (no enemy craft)
- [ ] Platoons land from Battle Cruisers automatically
- [ ] Ground combat uses AFS-041 combat resolution
- [ ] Planet ownership transfers to attacker on victory
- [ ] Population and resources transfer to attacker
- [ ] Buildings transfer intact but become inactive
- [ ] Surviving platoons garrison captured planet
- [ ] Defender platoons destroyed on defeat
- [ ] Population morale reduced by 30% on conquest
- [ ] Undefended planets surrender immediately

### Performance Criteria

- [ ] Invasion execution completes in <100ms
- [ ] Combat resolution executes in <50ms
- [ ] Ownership transfer executes in <20ms

### Integration Criteria

- [ ] Integrates with Craft System (AFS-032) for platoon transport
- [ ] Uses Platoon System (AFS-033) for strength calculation
- [ ] Uses Combat System (AFS-041) for battle resolution
- [ ] Uses Space Combat System (AFS-042) for orbital control
- [ ] Updates Game State Manager (AFS-001) for ownership
- [ ] Executes during Action/Combat Phase (AFS-002)

---

## Technical Notes

### Implementation Approach

```csharp
public class InvasionSystem : MonoBehaviour
{
    private static InvasionSystem _instance;
    public static InvasionSystem Instance => _instance;

    public event Action<int, int> OnInvasionStarted; // planetID, attackerFactionID
    public event Action<int, int> OnPlanetCaptured; // planetID, newOwnerFactionID
    public event Action<int, int, int> OnPlatoonsLanded; // planetID, platoonCount, totalTroops

    // Execute planetary invasion
    public InvasionResult InvadePlanet(int planetID, int attackerFactionID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
        {
            Debug.LogError("Invalid planet!");
            return null;
        }

        // Validate: Cannot invade own planet
        if (planet.Owner == attackerFactionID)
        {
            UIManager.Instance.ShowError("Cannot invade your own planet!");
            return null;
        }

        // Validate: Must control orbit
        if (!HasOrbitalControl(planetID, attackerFactionID))
        {
            UIManager.Instance.ShowError("Must control orbit to invade!");
            return null;
        }

        // Get invasion force (platoons aboard Battle Cruisers)
        var attackingPlatoons = GetInvasionForce(planetID, attackerFactionID);
        if (attackingPlatoons.Count == 0)
        {
            UIManager.Instance.ShowError("No platoons aboard ships to invade!");
            return null;
        }

        // Get defender garrison
        var defendingPlatoons = GetGarrison(planetID);

        OnInvasionStarted?.Invoke(planetID, attackerFactionID);
        Debug.Log($"Invasion of {planet.Name}: {attackingPlatoons.Count} platoons landing");

        // Check for undefended planet
        if (defendingPlatoons.Count == 0)
        {
            // Instant surrender
            CapturePlanet(planet, attackerFactionID, attackingPlatoons);
            UIManager.Instance.ShowMessage($"{planet.Name} captured! No resistance.");
            return new InvasionResult { AttackerWins = true, InstantSurrender = true };
        }

        // Execute ground combat (AFS-041)
        var combatResult = CombatSystem.Instance.ExecuteCombat(attackingPlatoons, defendingPlatoons, 100);

        // Resolve invasion outcome
        if (combatResult.AttackerWins)
        {
            // Attacker victory: Capture planet
            CapturePlanet(planet, attackerFactionID, attackingPlatoons);
            UIManager.Instance.ShowMessage($"{planet.Name} captured after fierce battle!");
        }
        else
        {
            // Defender victory: Invasion repelled
            UIManager.Instance.ShowMessage($"Invasion of {planet.Name} repelled! Our forces defeated.");
        }

        // Prepare result
        var result = new InvasionResult
        {
            AttackerWins = combatResult.AttackerWins,
            AttackerCasualties = combatResult.AttackerCasualties,
            DefenderCasualties = combatResult.DefenderCasualties,
            PlanetCaptured = combatResult.AttackerWins
        };

        return result;
    }

    // Capture planet (transfer ownership and resources)
    private void CapturePlanet(Planet planet, int newOwnerFactionID, List<Platoon> survivingPlatoons)
    {
        int oldOwnerID = planet.Owner;

        // Transfer ownership
        planet.Owner = newOwnerFactionID;

        // Reduce morale (occupation penalty)
        planet.Morale = Mathf.Max(0, planet.Morale - 30);

        // Transfer resources to attacker
        var capturedResources = new ResourceDelta
        {
            Credits = planet.Credits,
            Minerals = planet.Minerals,
            Fuel = planet.Fuel,
            Food = planet.Food
        };

        ResourceSystem.Instance.AddResources(newOwnerFactionID, capturedResources);
        UIManager.Instance.ShowMessage($"Captured resources: {capturedResources.Credits} Credits, {capturedResources.Minerals} Minerals");

        // Clear planet stockpiles (transferred to attacker)
        planet.Credits = 0;
        planet.Minerals = 0;
        planet.Fuel = 0;
        planet.Food = 0;

        // Deactivate buildings (need new crew)
        foreach (var structure in planet.Structures)
        {
            if (structure.Status == BuildingStatus.Active)
            {
                structure.Status = BuildingStatus.Inactive; // No crew assigned
            }
        }

        // Garrison surviving platoons
        foreach (var platoon in survivingPlatoons)
        {
            platoon.LocationPlanetID = planet.ID;
            platoon.LocationCraftID = -1; // Disembark from ship
        }

        OnPlanetCaptured?.Invoke(planet.ID, newOwnerFactionID);
        Debug.Log($"{planet.Name} captured by faction {newOwnerFactionID}");
    }

    // Get invasion force (platoons aboard Battle Cruisers in orbit)
    private List<Platoon> GetInvasionForce(int planetID, int factionID)
    {
        var battleCruisers = GameStateManager.Instance.GetCraftAtPlanet(planetID)
            .Where(c => c.Owner == factionID && c.Type == CraftType.BattleCruiser)
            .ToList();

        var platoons = new List<Platoon>();

        foreach (var cruiser in battleCruisers)
        {
            var embarkedPlatoons = GameStateManager.Instance.GetPlatoonsAboardCraft(cruiser.ID);
            platoons.AddRange(embarkedPlatoons);
        }

        return platoons;
    }

    // Get garrison platoons (defenders)
    private List<Platoon> GetGarrison(int planetID)
    {
        return GameStateManager.Instance.GetPlatoonsAtPlanet(planetID);
    }

    // Check if faction controls orbit
    private bool HasOrbitalControl(int planetID, int factionID)
    {
        var craftInOrbit = GameStateManager.Instance.GetCraftAtPlanet(planetID);
        var enemyCraft = craftInOrbit.Where(c => c.Owner != factionID).ToList();

        return enemyCraft.Count == 0;
    }
}

public class InvasionResult
{
    public bool AttackerWins;
    public bool PlanetCaptured;
    public bool InstantSurrender;
    public int AttackerCasualties;
    public int DefenderCasualties;
}
```

### Invasion Outcome Examples

**Example 1: Overwhelming Victory**
```
Attacker: 500 strength
Defender: 100 strength
Result: Planet captured, attacker loses 5% troops, defender annihilated
```

**Example 2: Pyrrhic Victory**
```
Attacker: 150 strength
Defender: 140 strength
Result: Planet captured, attacker loses 45% troops, defender annihilated
```

**Example 3: Failed Invasion**
```
Attacker: 100 strength
Defender: 200 strength
Result: Invasion repelled, attacker annihilated, defender loses 30% troops
```

**Example 4: Undefended Colony**
```
Attacker: Any strength
Defender: 0 strength (no garrison)
Result: Instant surrender, no combat, planet captured
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Planet ownership and platoon data
- **AFS-032 (Craft System)**: Battle Cruiser transport
- **AFS-033 (Platoon System)**: Platoon strength
- **AFS-041 (Combat System)**: Ground combat resolution

### Depended On By
- **AFS-002 (Turn System)**: Combat Phase execution
- **AFS-043 (Bombardment System)**: Pre-invasion softening
- **AFS-051 (AI Decision System)**: AI invasion planning
- **AFS-071 (UI State Machine)**: Invasion UI and results

### Events Published
- `OnInvasionStarted(int planetID, int attackerFactionID)`: Invasion initiated
- `OnPlanetCaptured(int planetID, int newOwnerFactionID)`: Planet ownership transferred
- `OnPlatoonsLanded(int planetID, int platoonCount, int totalTroops)`: Forces landed

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
