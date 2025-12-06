# AFS-042: Space Combat System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-COMBAT-001, FR-CRAFT-003

---

## Summary

Space combat system implementing orbital battles between craft (Battle Cruisers, Cargo Cruisers), managing combat resolution when fleets meet in space, calculating damage based on craft strength and weapon levels, and determining victory conditions with craft destruction.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Craft entity storage
- **AFS-032 (Craft System)**: Craft properties, fleet composition
- **AFS-014 (Navigation System)**: Fleet interception
- **AFS-041 (Combat System)**: Combat resolution patterns

---

## Requirements

### Combat Triggers

1. **Fleet Interception**
   - **Trigger**: Two hostile fleets occupy same orbital space
   - **Detection**: Automatic when fleet arrives at enemy-occupied planet
   - **Initiation**: Combat begins immediately (no player choice)
   - **Resolution**: One combat round, then winner takes orbit

2. **Orbital Defense**
   - **Scenario**: Attacker fleet arrives at defended planet
   - **Defender Advantage**: Planet-based defenses add +20% strength
   - **Automatic**: Combat executes during Combat Phase
   - **Display**: "USCS Fleet 01 engaged enemy craft at Zeta Reticuli!"

### Craft Strength Calculation

1. **Battle Cruiser Strength**
   - **Base Strength**: 100 per ship
   - **Weapon Modifier**: 1.0x (Laser) to 2.0x (Photon Torpedo)
   - **Damage Modifier**: Current HP ÷ Max HP (damaged ships weaker)
   - **Formula**: `Strength = 100 × Weapon Mod × (Current HP ÷ Max HP)`
   - **Example**: Battle Cruiser with Photon (2.0x) at 75% HP = 150 strength

2. **Cargo Cruiser Strength**
   - **Base Strength**: 30 per ship (weak, non-combat)
   - **Weapon Modifier**: 1.0x (no weapons, defensive only)
   - **Role**: Transport only, minimal combat value
   - **Formula**: `Strength = 30 × (Current HP ÷ Max HP)`

3. **Fleet Strength**
   - **Total**: Sum of all craft strengths in fleet
   - **Example**: 3 Battle Cruisers (100 each) + 1 Cargo (30) = 330 total strength

### Weapon Systems

1. **Weapon Levels** (Battle Cruiser only)
   - **Laser** (500,000 Credits): 1.0x damage modifier
   - **Missile** (750,000 Credits): 1.5x damage modifier
   - **Photon Torpedo** (1,000,000 Credits): 2.0x damage modifier
   - **One-time cost**: Applies to entire fleet (all Battle Cruisers)

2. **Weapon Upgrades**
   - **Progressive**: Must upgrade Laser → Missile → Photon
   - **Fleet-wide**: All Battle Cruisers use same weapon level
   - **Persistent**: Weapon level saved, applies to new ships
   - **Strategic**: Photon Torpedoes double combat effectiveness

### Combat Resolution

1. **Strength Comparison**
   - **Calculate**: Total fleet strength for attacker and defender
   - **Apply Modifiers**: Defender +20% if at planet with orbital defenses
   - **Determine Winner**: Higher total strength wins
   - **Tie**: Attacker wins (aggressive advantage)

2. **Damage Calculation**
   - **Strength Ratio**: Winner Strength ÷ Loser Strength
   - **Damage Formula**: `Damage = (Ratio - 1.0) × 50 HP per craft`
   - **Example**: 400 vs 200 strength → Ratio 2.0 → 50 HP damage to loser
   - **Distribution**: Damage distributed evenly across losing fleet

3. **Craft Destruction**
   - **HP Threshold**: Craft destroyed when HP ≤ 0
   - **Cascading**: Destroy weakest craft first, carry excess damage
   - **Display**: "USCS Cruiser 03 destroyed!"
   - **Remove**: Destroyed craft removed from fleet immediately

4. **Victory Conditions**
   - **Total Victory**: All enemy craft destroyed
   - **Partial Victory**: Enemy fleet retreats (future feature, MVP: fight to death)
   - **Orbital Control**: Winner controls planet orbit
   - **Follow-up**: Ground invasion phase begins (if platoons aboard)

### Combat Example

**Scenario: Player Fleet vs AI Defender at Vulcan Prime**

**Player Fleet (Attacker):**
- 3 Battle Cruisers (Photon Torpedoes, 2.0x, 100% HP)
- Strength: 3 × (100 × 2.0 × 1.0) = 600

**AI Fleet (Defender):**
- 2 Battle Cruisers (Laser, 1.0x, 100% HP)
- 1 Cargo Cruiser (30 strength)
- Defender bonus: +20% (orbital defenses)
- Strength: [(2 × 100) + 30] × 1.2 = 276

**Combat Resolution:**
1. Strength Ratio: 600 ÷ 276 = 2.17
2. Damage to AI: (2.17 - 1.0) × 50 = 58.5 HP per craft
3. AI Battle Cruiser 1: 100 - 58.5 = 41.5 HP (survives, damaged)
4. AI Battle Cruiser 2: 100 - 58.5 = 41.5 HP (survives, damaged)
5. AI Cargo Cruiser: 50 - 58.5 = -8.5 HP (**destroyed**)

**Result:** Player victory, AI Cargo destroyed, 2 AI Battle Cruisers damaged and retreat

---

## Acceptance Criteria

### Functional Criteria

- [ ] Combat triggers when hostile fleets meet
- [ ] Battle Cruiser strength calculates correctly (100 × Weapon × HP%)
- [ ] Cargo Cruiser strength calculates correctly (30 × HP%)
- [ ] Weapon levels (Laser, Missile, Photon) apply correct modifiers
- [ ] Defender receives +20% orbital defense bonus
- [ ] Strength ratio determines damage distribution
- [ ] Craft destroyed when HP ≤ 0
- [ ] Winner controls orbital space
- [ ] Combat results logged and displayed

### Performance Criteria

- [ ] Combat resolution executes in <50ms
- [ ] Damage calculations execute in <10ms
- [ ] UI updates smooth during combat animation

### Integration Criteria

- [ ] Integrates with Craft System (AFS-032) for fleet data
- [ ] Uses Navigation System (AFS-014) for fleet interception
- [ ] Triggers Invasion System (AFS-044) if platoons aboard
- [ ] Logs combat events to Game State Manager (AFS-001)
- [ ] Executes during Combat Phase (AFS-002)

---

## Technical Notes

### Implementation Approach

```csharp
public class SpaceCombatSystem : MonoBehaviour
{
    private static SpaceCombatSystem _instance;
    public static SpaceCombatSystem Instance => _instance;

    public event Action<int, int> OnSpaceBattleStarted; // attackerFleetID, defenderFleetID
    public event Action<int, int> OnCraftDestroyed; // craftID, ownerFactionID
    public event Action<int> OnBattleEnded; // winnerFactionID

    // Execute space combat between two fleets
    public SpaceBattleResult ExecuteSpaceCombat(int attackerFleetID, int defenderFleetID, bool defenderHasOrbitalDefense)
    {
        var attackerFleet = GetFleetCraft(attackerFleetID);
        var defenderFleet = GetFleetCraft(defenderFleetID);

        OnSpaceBattleStarted?.Invoke(attackerFleetID, defenderFleetID);

        // Calculate fleet strengths
        int attackerStrength = CalculateFleetStrength(attackerFleet);
        int defenderStrength = CalculateFleetStrength(defenderFleet);

        // Apply orbital defense bonus
        if (defenderHasOrbitalDefense)
        {
            defenderStrength = Mathf.FloorToInt(defenderStrength * 1.2f);
            Debug.Log($"Defender receives +20% orbital defense bonus: {defenderStrength}");
        }

        // Determine winner
        bool attackerWins = attackerStrength >= defenderStrength; // Tie goes to attacker

        // Calculate damage
        int winnerStrength = attackerWins ? attackerStrength : defenderStrength;
        int loserStrength = attackerWins ? defenderStrength : attackerStrength;
        float strengthRatio = winnerStrength / (float)loserStrength;
        int damagePerCraft = Mathf.FloorToInt((strengthRatio - 1.0f) * 50f);

        Debug.Log($"Space Combat: Attacker {attackerStrength} vs Defender {defenderStrength}");
        Debug.Log($"Winner: {(attackerWins ? "Attacker" : "Defender")}, Damage: {damagePerCraft} HP per craft");

        // Apply damage to losing fleet
        var losingFleet = attackerWins ? defenderFleet : attackerFleet;
        ApplyDamage(losingFleet, damagePerCraft);

        // Prepare result
        var result = new SpaceBattleResult
        {
            AttackerWins = attackerWins,
            AttackerStrength = attackerStrength,
            DefenderStrength = defenderStrength,
            DamageDealt = damagePerCraft,
            CraftDestroyed = GetDestroyedCraftCount(losingFleet)
        };

        OnBattleEnded?.Invoke(attackerWins ? attackerFleetID : defenderFleetID);

        return result;
    }

    // Calculate total fleet strength
    private int CalculateFleetStrength(List<Craft> fleet)
    {
        int totalStrength = 0;

        foreach (var craft in fleet)
        {
            int craftStrength = GetCraftStrength(craft);
            totalStrength += craftStrength;
        }

        return totalStrength;
    }

    // Get individual craft strength
    private int GetCraftStrength(Craft craft)
    {
        int baseStrength = 0;
        float weaponMod = 1.0f;

        if (craft.Type == CraftType.BattleCruiser)
        {
            baseStrength = 100;
            weaponMod = GetWeaponModifier(craft.WeaponLevel);
        }
        else if (craft.Type == CraftType.CargoCruiser)
        {
            baseStrength = 30;
            weaponMod = 1.0f; // No weapons
        }

        // Apply HP damage modifier
        float hpPercent = craft.CurrentHP / (float)craft.MaxHP;

        int strength = Mathf.FloorToInt(baseStrength * weaponMod * hpPercent);

        return strength;
    }

    private float GetWeaponModifier(WeaponLevel weapon)
    {
        switch (weapon)
        {
            case WeaponLevel.Laser: return 1.0f;
            case WeaponLevel.Missile: return 1.5f;
            case WeaponLevel.PhotonTorpedo: return 2.0f;
            default: return 1.0f;
        }
    }

    // Apply damage to fleet, destroy craft if HP <= 0
    private void ApplyDamage(List<Craft> fleet, int damagePerCraft)
    {
        foreach (var craft in fleet.ToList()) // ToList to allow removal during iteration
        {
            craft.CurrentHP -= damagePerCraft;

            if (craft.CurrentHP <= 0)
            {
                // Craft destroyed
                Debug.Log($"{craft.Name} destroyed!");
                OnCraftDestroyed?.Invoke(craft.ID, craft.Owner);

                // Remove from fleet
                EntitySystem.Instance.DestroyCraft(craft.ID);
            }
            else
            {
                Debug.Log($"{craft.Name} damaged: {craft.CurrentHP}/{craft.MaxHP} HP remaining");
            }
        }
    }

    private List<Craft> GetFleetCraft(int fleetID)
    {
        // Retrieve all craft belonging to fleet
        return GameStateManager.Instance.GetCraftByFleetID(fleetID);
    }

    private int GetDestroyedCraftCount(List<Craft> fleet)
    {
        return fleet.Count(c => c.CurrentHP <= 0);
    }
}

public class SpaceBattleResult
{
    public bool AttackerWins;
    public int AttackerStrength;
    public int DefenderStrength;
    public int DamageDealt;
    public int CraftDestroyed;
}
```

### Weapon Cost Summary

| Weapon Level | Cost (Credits) | Damage Modifier |
|--------------|----------------|-----------------|
| Laser | 500,000 | 1.0x |
| Missile | 750,000 | 1.5x |
| Photon Torpedo | 1,000,000 | 2.0x |

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Craft storage
- **AFS-032 (Craft System)**: Craft properties

### Depended On By
- **AFS-002 (Turn System)**: Combat Phase execution
- **AFS-044 (Invasion System)**: Post-combat ground invasion
- **AFS-071 (UI State Machine)**: Combat UI display

### Events Published
- `OnSpaceBattleStarted(int attackerFleetID, int defenderFleetID)`: Combat initiated
- `OnCraftDestroyed(int craftID, int ownerFactionID)`: Craft destroyed
- `OnBattleEnded(int winnerFactionID)`: Combat resolved

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
