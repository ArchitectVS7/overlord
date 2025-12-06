# AFS-041: Combat System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-COMBAT-001, FR-COMBAT-002, FR-COMBAT-003

---

## Summary

Turn-based combat resolution system that handles ground battles between platoons, calculates military strength comparison, determines casualties based on strength differential, manages planet ownership transfer, and displays combat animations in the Video Window.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Combat state and entity updates
- **AFS-012 (Planet System)**: Planet ownership changes
- **AFS-033 (Platoon System)**: Military strength calculations
- **AFS-032 (Craft System)**: Battle Cruiser presence
- **AFS-002 (Turn System)**: Combat Phase execution

---

## Requirements

### Combat Triggers

1. **Arrival at Enemy Planet**
   - Fleet arrives at planet owned by opposing faction
   - Trigger: NavigationSystem.OnJourneyCompleted event
   - Condition: `DestinationPlanet.Owner != Craft.Owner && DestinationPlanet.Owner != Neutral`
   - Action: Initiate ground combat

2. **Combat Timing**
   - Executes during Combat Phase
   - All battles resolved simultaneously
   - Battles sorted by proximity to Starbase (closest first)
   - Display battles one-by-one in sequence

3. **Combat Participants**
   - **Attacker**: Platoons aboard arriving Battle Cruisers
   - **Defender**: Platoons garrisoned on planet surface
   - **Civilians**: Population does not fight (morale penalty only)

### Combat Resolution

1. **Military Strength Calculation**
   - **Formula**: `Strength = Σ(Troops × Equipment Modifier × Weapon Modifier × Training Modifier)`
   - Sum all platoons on each side
   - **Attacker Total**: All platoons on all arriving Battle Cruisers
   - **Defender Total**: All platoons garrisoned on planet

2. **Strength Comparison**
   - Calculate ratio: `StrengthRatio = AttackerStrength ÷ DefenderStrength`
   - **Decisive Victory**: Ratio > 2.0 (attacker 2× stronger)
   - **Close Victory**: Ratio 1.2-2.0 (attacker stronger)
   - **Stalemate**: Ratio 0.8-1.2 (roughly equal)
   - **Defender Holds**: Ratio < 0.8 (defender stronger)

3. **Casualty Calculation**
   - **Winner Casualties**: `BaseRate × (DefenderStrength ÷ AttackerStrength)`
   - **Loser Casualties**: `BaseRate × (AttackerStrength ÷ DefenderStrength)`
   - **Base Casualty Rate**: 20% of troops
   - **Minimum Casualties**: 10% (winner), 50% (loser)
   - **Maximum Casualties**: 30% (winner), 90% (loser)

4. **Outcome Determination**
   - If AttackerStrength > DefenderStrength: **Attacker Wins**
     - Planet ownership → Attacker faction
     - Defender platoons destroyed or routed
     - Attacker platoons survive with casualties
   - If DefenderStrength ≥ AttackerStrength: **Defender Wins**
     - Planet ownership unchanged
     - Attacker platoons destroyed or routed
     - Defender platoons survive with casualties

### Aggression Control

1. **Aggression Slider** (Player Only)
   - **Range**: 0-100% (0 = Cautious, 100 = Aggressive)
   - **Default**: 50% (Balanced)
   - **Affects**:
     - Strength multiplier: `(0.8 to 1.2) = 0.8 + (Aggression × 0.004)`
     - Casualty rate: Higher aggression = More casualties
   - **Strategic Trade-off**: More strength vs more losses

2. **Aggression Impact**
   - **Cautious (0%)**:
     - Strength: 0.8x (defensive fighting)
     - Casualties: 50% reduced
     - Suitable for: Preserving forces
   - **Balanced (50%)**:
     - Strength: 1.0x (normal)
     - Casualties: Normal (20% base)
     - Suitable for: Most engagements
   - **Aggressive (100%)**:
     - Strength: 1.2x (all-out assault)
     - Casualties: 50% increased
     - Suitable for: Overwhelming victory

3. **AI Aggression**
   - AI uses fixed aggression based on difficulty
   - Easy: 30% (cautious)
   - Normal: 50% (balanced)
   - Hard: 70% (aggressive)

### Combat Sequence

1. **Pre-Combat Phase**
   - Identify all conflict zones (planets with opposing forces)
   - Display "Battle at [Planet Name]!" message
   - Show aggression slider (player only, if attacking)
   - Player confirms engagement ("Begin Battle" button)

2. **Combat Execution**
   - Calculate military strengths
   - Apply aggression modifiers
   - Determine winner
   - Calculate casualties for each platoon
   - Apply damage (reduce troop counts)
   - Destroy eliminated platoons (troops = 0)
   - Transfer planet ownership if attacker wins

3. **Post-Combat Phase**
   - Display combat results:
     - "VICTORY!" or "DEFEAT"
     - Attacker strength vs Defender strength
     - Casualties: "Lost 50 troops" or "Enemy lost 150 troops"
     - Planet ownership: "[Planet] captured!" or "[Planet] defended!"
   - Update planet morale (victory +5%, defeat -10%)
   - Cleanup destroyed platoons
   - Proceed to next battle (if any)

### Combat Animation

1. **Video Window Display**
   - Combat plays out in dedicated Video Window (2D or 3D)
   - Show force comparison bars: Attacker (blue) vs Defender (red)
   - Animated troop icons clashing
   - Flash effects for casualties
   - Victory/defeat text overlay

2. **Animation Duration**
   - **Quick**: 2 seconds per battle
   - **Normal**: 5 seconds per battle
   - **Detailed**: 10 seconds per battle (future feature)
   - **Skip**: Instant resolution (no animation)

3. **Audio Feedback**
   - Battle sounds: Weapons fire, explosions
   - Victory fanfare or defeat sound
   - Narrator: "Battle at Vulcan Prime!" (future feature)

### Combat Outcomes

1. **Attacker Victory**
   - Planet ownership → Attacker faction
   - Defender platoons destroyed (or routed off-planet)
   - Attacker platoons garrison planet
   - Display: "[Planet] CAPTURED!"
   - Morale: Planet -10% (occupied), Attacker planets +5%

2. **Defender Victory**
   - Planet ownership unchanged
   - Attacker platoons destroyed
   - Defender platoons remain garrisoned
   - Display: "[Planet] DEFENDED!"
   - Morale: Planet +5% (successful defense)

3. **Pyrrhic Victory** (Special Case)
   - Attacker wins but suffers 70%+ casualties
   - Planet captured but attacker platoons severely weakened
   - Display: "COSTLY VICTORY - Heavy Losses!"

---

## Acceptance Criteria

### Functional Criteria

- [ ] Combat triggers when fleet arrives at enemy planet
- [ ] Military strength calculated correctly (troops × equipment × weapon × training)
- [ ] Strength comparison determines winner accurately
- [ ] Casualties calculated based on strength differential
- [ ] Aggression slider affects strength and casualties
- [ ] Planet ownership transfers on attacker victory
- [ ] Defender platoons destroyed on defeat
- [ ] Combat results displayed with clear outcome
- [ ] Multiple battles resolve in sequence

### Performance Criteria

- [ ] Combat resolution executes in <500ms per battle
- [ ] Combat animation runs at 30 FPS minimum
- [ ] No frame drops during combat sequence

### Integration Criteria

- [ ] Integrates with Turn System (AFS-002) for Combat Phase
- [ ] Uses Platoon System (AFS-033) for strength calculations
- [ ] Updates Planet System (AFS-012) for ownership transfer
- [ ] Triggers on Navigation System (AFS-014) fleet arrival
- [ ] Displays combat in Video Window (AFS-082)

---

## Technical Notes

### Implementation Approach

```csharp
public class CombatSystem : MonoBehaviour
{
    private static CombatSystem _instance;
    public static CombatSystem Instance => _instance;

    public event Action<Battle> OnBattleStarted;
    public event Action<Battle, BattleResult> OnBattleCompleted;

    // Initiate battle at planet
    public void InitiateBattle(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null)
            return;

        // Identify combatants
        var attackers = GetAttackingPlatoons(planetID);
        var defenders = GetDefendingPlatoons(planetID);

        if (attackers.Count == 0 || defenders.Count == 0)
        {
            Debug.LogWarning($"No combat at {planet.Name} - one side has no forces");
            return;
        }

        // Create battle
        var battle = new Battle
        {
            PlanetID = planetID,
            PlanetName = planet.Name,
            AttackerFaction = attackers[0].Owner,
            DefenderFaction = planet.Owner,
            AttackingPlatoons = attackers,
            DefendingPlatoons = defenders
        };

        OnBattleStarted?.Invoke(battle);
        UIManager.Instance.ShowBattleScreen(battle);

        Debug.Log($"Battle initiated at {planet.Name}: {attackers.Count} attackers vs {defenders.Count} defenders");
    }

    // Execute combat (called after player confirms aggression)
    public BattleResult ExecuteCombat(Battle battle, int aggressionPercent)
    {
        // Calculate military strengths
        int attackerStrength = CalculateStrength(battle.AttackingPlatoons);
        int defenderStrength = CalculateStrength(battle.DefendingPlatoons);

        // Apply aggression modifier (player only)
        float aggressionMod = 0.8f + (aggressionPercent / 100f) * 0.4f; // 0.8 to 1.2
        attackerStrength = Mathf.FloorToInt(attackerStrength * aggressionMod);

        // Determine winner
        bool attackerWins = attackerStrength > defenderStrength;

        // Calculate casualties
        var attackerCasualties = CalculateCasualties(battle.AttackingPlatoons, attackerStrength, defenderStrength, attackerWins, aggressionPercent);
        var defenderCasualties = CalculateCasualties(battle.DefendingPlatoons, defenderStrength, attackerStrength, !attackerWins, 50); // AI uses 50%

        // Apply casualties
        ApplyCasualties(battle.AttackingPlatoons, attackerCasualties);
        ApplyCasualties(battle.DefendingPlatoons, defenderCasualties);

        // Create result
        var result = new BattleResult
        {
            AttackerWins = attackerWins,
            AttackerStrength = attackerStrength,
            DefenderStrength = defenderStrength,
            AttackerCasualties = attackerCasualties.Sum(c => c.Value),
            DefenderCasualties = defenderCasualties.Sum(c => c.Value),
            PlanetCaptured = attackerWins
        };

        // Transfer planet ownership if attacker wins
        if (attackerWins)
        {
            var planet = GameStateManager.Instance.GetPlanetByID(battle.PlanetID);
            planet.Owner = battle.AttackerFaction;
            planet.Morale = Mathf.Max(0, planet.Morale - 10); // Occupation penalty

            // Destroy defender platoons
            foreach (var platoon in battle.DefendingPlatoons)
            {
                EntitySystem.Instance.DestroyPlatoon(platoon.ID);
            }

            Debug.Log($"ATTACKER VICTORY! {battle.PlanetName} captured by {battle.AttackerFaction}");
        }
        else
        {
            var planet = GameStateManager.Instance.GetPlanetByID(battle.PlanetID);
            planet.Morale = Mathf.Min(100, planet.Morale + 5); // Successful defense bonus

            // Destroy attacker platoons
            foreach (var platoon in battle.AttackingPlatoons)
            {
                EntitySystem.Instance.DestroyPlatoon(platoon.ID);
            }

            Debug.Log($"DEFENDER VICTORY! {battle.PlanetName} defended by {battle.DefenderFaction}");
        }

        OnBattleCompleted?.Invoke(battle, result);
        return result;
    }

    // Calculate total military strength
    private int CalculateStrength(List<PlatoonEntity> platoons)
    {
        int totalStrength = 0;

        foreach (var platoon in platoons)
        {
            totalStrength += platoon.GetMilitaryStrength();
        }

        return totalStrength;
    }

    // Calculate casualties for each platoon
    private Dictionary<int, int> CalculateCasualties(List<PlatoonEntity> platoons, int ownStrength, int enemyStrength, bool isWinner, int aggressionPercent)
    {
        var casualties = new Dictionary<int, int>();

        float baseCasualtyRate = 0.2f; // 20%
        float strengthRatio = enemyStrength / (float)Mathf.Max(1, ownStrength);

        // Aggression increases casualties
        float aggressionMod = 1.0f + ((aggressionPercent - 50f) / 100f) * 0.5f; // 0.75 to 1.25

        // Winner vs loser casualty rates
        float casualtyRate;
        if (isWinner)
        {
            casualtyRate = Mathf.Clamp(baseCasualtyRate * strengthRatio * aggressionMod, 0.1f, 0.3f); // 10-30%
        }
        else
        {
            casualtyRate = Mathf.Clamp(baseCasualtyRate * strengthRatio * aggressionMod * 2f, 0.5f, 0.9f); // 50-90%
        }

        // Apply casualties to each platoon
        foreach (var platoon in platoons)
        {
            int troopLoss = Mathf.FloorToInt(platoon.Troops * casualtyRate);
            casualties[platoon.ID] = troopLoss;
        }

        return casualties;
    }

    // Apply casualties (reduce troop counts, destroy if eliminated)
    private void ApplyCasualties(List<PlatoonEntity> platoons, Dictionary<int, int> casualties)
    {
        foreach (var platoon in platoons)
        {
            if (casualties.TryGetValue(platoon.ID, out int loss))
            {
                platoon.Troops = Mathf.Max(0, platoon.Troops - loss);

                if (platoon.Troops == 0)
                {
                    // Platoon eliminated
                    Debug.Log($"{platoon.Name} ELIMINATED!");
                }
                else
                {
                    Debug.Log($"{platoon.Name} lost {loss} troops, {platoon.Troops} remaining");
                }
            }
        }
    }

    // Get attacking platoons (on Battle Cruisers at planet)
    private List<PlatoonEntity> GetAttackingPlatoons(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        var attackers = new List<PlatoonEntity>();

        // Get craft at planet
        var craft = GameStateManager.Instance.GetCraftAtPlanet(planetID);

        foreach (var c in craft)
        {
            // Only Battle Cruisers from enemy faction
            if (c.Type == CraftType.BattleCruiser && c.Owner != planet.Owner)
            {
                // Get platoons on board
                foreach (var platoonID in c.CarriedPlatoonIDs)
                {
                    var platoon = GameStateManager.Instance.GetPlatoonByID(platoonID);
                    if (platoon != null)
                    {
                        attackers.Add(platoon);
                    }
                }
            }
        }

        return attackers;
    }

    // Get defending platoons (garrisoned on planet)
    private List<PlatoonEntity> GetDefendingPlatoons(int planetID)
    {
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        var defenders = new List<PlatoonEntity>();

        var platoons = GameStateManager.Instance.GetPlatoonsAtPlanet(planetID);

        foreach (var platoon in platoons)
        {
            if (platoon.Owner == planet.Owner)
            {
                defenders.Add(platoon);
            }
        }

        return defenders;
    }
}

[Serializable]
public class Battle
{
    public int PlanetID;
    public string PlanetName;
    public FactionType AttackerFaction;
    public FactionType DefenderFaction;
    public List<PlatoonEntity> AttackingPlatoons;
    public List<PlatoonEntity> DefendingPlatoons;
}

[Serializable]
public class BattleResult
{
    public bool AttackerWins;
    public int AttackerStrength;
    public int DefenderStrength;
    public int AttackerCasualties;
    public int DefenderCasualties;
    public bool PlanetCaptured;
}
```

### Combat Example

**Battle at Vulcan Prime:**
```
Attacker: Player
- Platoon 01: 150 troops, Standard (1.5x), Rifle (1.0x), 100% (1.0x) = 225 strength
- Platoon 02: 120 troops, Advanced (2.0x), Assault (1.3x), 100% (1.0x) = 312 strength
Total Attacker Strength: 537

Defender: AI
- Enemy Platoon 01: 100 troops, Basic (1.0x), Rifle (1.0x), 100% (1.0x) = 100 strength
- Enemy Platoon 02: 80 troops, Basic (1.0x), Pistol (0.8x), 80% (0.8x) = 51 strength
Total Defender Strength: 151

Aggression: 50% (balanced)
  Aggression Modifier: 1.0x
  Adjusted Attacker Strength: 537

Outcome: ATTACKER WINS (537 > 151)
  Strength Ratio: 537 ÷ 151 = 3.56 (Decisive Victory!)

Attacker Casualties:
  Base Rate: 20%
  Strength Ratio Modifier: 151 ÷ 537 = 0.28
  Casualty Rate: 20% × 0.28 = 5.6% (clamped to 10% minimum)
  Platoon 01: 15 troops lost (135 remaining)
  Platoon 02: 12 troops lost (108 remaining)
  Total: 27 troops lost

Defender Casualties:
  Base Rate: 20%
  Strength Ratio Modifier: 537 ÷ 151 = 3.56
  Casualty Rate: 20% × 3.56 × 2 = 142% (clamped to 90% maximum)
  Enemy Platoon 01: ELIMINATED (90 troops lost, 10 flee)
  Enemy Platoon 02: ELIMINATED (72 troops lost, 8 flee)
  Total: 162 troops lost

Result: Vulcan Prime CAPTURED by Player!
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Combat state storage
- **AFS-012 (Planet System)**: Ownership transfer
- **AFS-033 (Platoon System)**: Military strength
- **AFS-032 (Craft System)**: Battle Cruiser transport

### Depended On By
- **AFS-002 (Turn System)**: Combat Phase execution
- **AFS-014 (Navigation System)**: Fleet arrival triggers combat
- **AFS-051 (AI System)**: AI combat decisions
- **AFS-082 (Video System)**: Combat animation display

### Events Published
- `OnBattleStarted(Battle battle)`: Combat initiated
- `OnBattleCompleted(Battle battle, BattleResult result)`: Combat resolved
- `OnPlanetCaptured(int planetID, FactionType newOwner)`: Ownership changed
- `OnPlatoonDestroyed(int platoonID, bool inCombat)`: Platoon eliminated

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
