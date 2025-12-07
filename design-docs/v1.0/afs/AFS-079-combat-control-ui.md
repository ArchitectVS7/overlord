# AFS-079: Combat Control UI

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-008

---

## Summary

User interface for managing combat operations including planetary assault coordination, fleet battle monitoring, bombardment targeting, retreat decisions, and real-time combat result visualization with detailed battle logs.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Access to combat state data
- **AFS-041 (Combat System)**: Ground combat mechanics
- **AFS-042 (Space Combat)**: Fleet battle mechanics
- **AFS-043 (Bombardment System)**: Orbital bombardment
- **AFS-044 (Invasion System)**: Planetary invasion mechanics
- **AFS-033 (Platoon System)**: Platoon combat strength
- **AFS-032 (Craft System)**: Battle Cruiser participation
- **AFS-071 (Main Screen)**: Navigation to Combat Control screen

---

## Requirements

### Screen Layout (FR-UI-008)

#### 1. Screen Structure

**Primary Components:**
- **Header Bar:** Combat type, location, turn counter
- **Battle Overview Panel (Top):** Force comparison, combat status
- **Combat Visualization (Center):** Animated battle representation
- **Action Panel (Left):** Player decisions (Bombard, Retreat, Continue)
- **Combat Log (Right):** Scrolling text log of combat events
- **Results Panel (Bottom):** Victory/Defeat outcome with casualties

**Screen Division:**
```
┌──────────────────────────────────────────────────────────────┐
│ PLANETARY ASSAULT: Hitotsu | Turn: 3/10 | Status: Active    │
├──────────────────────────────────────────────────────────────┤
│ FORCE COMPARISON                                             │
│ Player Forces: 3 Platoons (450 troops) | Strength: 1,350    │
│ Enemy Forces:  2 Platoons (350 troops) | Strength: 1,050    │
│ ────────────────────────────────────────────────────────     │
│ Advantage: PLAYER (+28% strength)                            │
├───────────────────┬──────────────────────────┬───────────────┤
│ ACTIONS           │ COMBAT VISUALIZATION     │ COMBAT LOG    │
│                   │                          │               │
│ ○ Continue Battle │      ⚔️ BATTLE ⚔️        │ Turn 1:       │
│   (Default)       │                          │  Player Plat. │
│                   │   🔫 [Player Forces]     │  01 attacks   │
│ ○ Orbital Bombard │        ↓↓↓↓↓↓            │  Enemy Plat.  │
│   (−50 enemy      │   💥 [Explosions]        │  07 for 45    │
│    troops)        │        ↑↑↑↑↑↑            │  damage       │
│                   │   🛡️ [Enemy Forces]      │               │
│ ○ Retreat         │                          │  Enemy Plat.  │
│   (Abort mission) │   Health Bars:           │  07 retaliates│
│                   │   Player: ████████░░ 80% │  for 30 dmg   │
│ [Execute Action]  │   Enemy:  ██████░░░░ 60% │               │
│                   │                          │ Turn 2:       │
│ BOMBARDMENT INFO  │   Casualties:            │  Bombardment  │
│ Available: Yes    │   Player: -20 troops     │  hits enemy   │
│ Battle Cruisers:  │   Enemy:  -80 troops     │  for -50      │
│  2 in orbit       │                          │  troops       │
│ Effect: -50 troops│                          │               │
│ Cooldown: 0 turns │                          │ Turn 3:       │
│                   │                          │  Player Plat. │
│                   │                          │  02 attacks...│
│                   │                          │               │
│                   │                          │ [Scroll ↓]    │
├───────────────────┴──────────────────────────┴───────────────┤
│ BATTLE RESULT: Player Victory | Casualties: 35 troops lost   │
│ Hitotsu captured! | Enemy eliminated | [Continue]            │
└──────────────────────────────────────────────────────────────┘
```

#### 2. Combat Types

**Type 1: Planetary Assault (Invasion)**
- **Trigger:** Player Battle Cruiser with platoons arrives at enemy planet
- **Participants:** Player platoons vs Enemy garrison platoons
- **Objective:** Capture planet by eliminating all enemy platoons
- **Options:** Continue, Orbital Bombardment, Retreat

**Type 2: Space Combat (Fleet Battle)**
- **Trigger:** Player fleet encounters enemy fleet in same orbital position
- **Participants:** Player Battle Cruisers vs Enemy Battle Cruisers
- **Objective:** Destroy or force retreat of enemy fleet
- **Options:** Continue, Focus Fire (target specific enemy craft), Retreat

**Type 3: Planetary Defense**
- **Trigger:** Enemy invades player-controlled planet
- **Participants:** Player garrison vs Enemy assault platoons
- **Objective:** Defend planet from invasion
- **Options:** Continue, Activate Defense Systems (Shields/Missiles), Retreat (surrender planet)

#### 3. Battle Overview Panel

**Force Comparison Display:**
- **Player Forces:** "3 Platoons (450 troops) | Strength: 1,350"
- **Enemy Forces:** "2 Platoons (350 troops) | Strength: 1,050"
- **Combat Strength:** Sum of (Troop Count × Combat Multiplier) for all platoons
- **Advantage Indicator:** "PLAYER (+28% strength)" or "ENEMY (+15% strength)" or "EVEN MATCH"

**Visual Comparison:**
- **Strength Bars:** Side-by-side bars showing relative strength
- **Color Coding:** Green (player advantage), Red (enemy advantage), Yellow (even)

**Additional Info:**
- **Battle Cruisers in Orbit:** "2 Battle Cruisers providing orbital support"
- **Defense Systems:** "Shield Generator active (20% damage reduction)"
- **Turn Counter:** "Turn: 3/10" (max 10 turns, then stalemate)

#### 4. Combat Visualization

**Animated Battle Scene:**
- **Player Forces:** Top of screen, blue-colored unit icons
- **Enemy Forces:** Bottom of screen, red-colored unit icons
- **Attack Animations:** Projectiles (bullets, lasers) flying between forces
- **Explosions:** Impact effects when damage dealt
- **Troop Movement:** Units advance/retreat based on combat flow

**Health Bars:**
- **Player Health:** Green bar, percentage (100% → 0%)
- **Enemy Health:** Red bar, percentage (100% → 0%)
- **Updates Real-Time:** Decreases as casualties occur

**Casualty Counter:**
- **Player Casualties:** "-20 troops"
- **Enemy Casualties:** "-80 troops"
- **Updated Each Turn:** Shows cumulative losses

**Special Effects:**
- **Bombardment:** Spacecraft icon appears, fires laser beam at enemy forces
- **Shields:** Blue energy field appears around defending forces
- **Retreat:** Forces fade out and disappear

#### 5. Action Panel

**Action Options:**

**A. Continue Battle (Default):**
- **Description:** "Continue fighting without special actions"
- **Effect:** Standard turn-by-turn combat resolution
- **Always Available:** Yes

**B. Orbital Bombardment:**
- **Description:** "Call in orbital strike from Battle Cruisers"
- **Effect:** "-50 enemy troops (instant damage)"
- **Availability:** Only if player has Battle Cruisers in orbit
- **Cooldown:** 3 turns (cannot bombard every turn)
- **Risk:** Can damage planet infrastructure (10% chance)

**C. Retreat:**
- **Description:** "Abort mission and withdraw forces"
- **Effect (Assault):** Platoons return to Battle Cruiser, planet remains enemy-controlled
- **Effect (Defense):** Planet surrenders to enemy, player loses planet
- **Penalty:** Morale penalty to retreating platoons (-10%)

**D. Focus Fire (Space Combat Only):**
- **Description:** "Concentrate fire on specific enemy Battle Cruiser"
- **Effect:** +50% damage to selected target
- **Selection:** Dropdown list of enemy craft

**E. Activate Defense Systems (Planetary Defense Only):**
- **Shield Generator:** "-20% damage taken for 3 turns (50,000 Credits)"
- **Missile Battery:** "Deal 100 damage to enemy fleet (40,000 Credits)"
- **Laser Battery:** "Deal 150 damage to enemy fleet (60,000 Credits)"

**Execution:**
1. Select action radio button
2. Click "Execute Action" button
3. Action processed, combat turn resolves
4. Combat log updates with results

#### 6. Combat Log

**Scrolling Text Log:**
- **Turn-by-Turn Breakdown:** "Turn 1:", "Turn 2:", etc.
- **Event Entries:**
  - "Player Platoon 01 attacks Enemy Platoon 07 for 45 damage"
  - "Enemy Platoon 07 retaliates for 30 damage"
  - "Orbital Bombardment hits enemy for -50 troops"
  - "Player Platoon 02 destroyed (125 troops lost)"

**Color Coding:**
- **Player Actions:** Blue text
- **Enemy Actions:** Red text
- **Special Events:** Yellow text (bombardment, shields)
- **Casualties:** Orange text

**Auto-Scroll:**
- Automatically scrolls to bottom as new events added
- Player can manually scroll up to review earlier events
- Scrollbar appears if >10 entries

**Log Export (Future):**
- "Copy Log to Clipboard" button
- Save battle report as text file

#### 7. Battle Results Panel

**Victory Display:**
```
┌─────────────────────────────────────────┐
│ ✅ PLAYER VICTORY                       │
│                                         │
│ Hitotsu Captured!                       │
│                                         │
│ Player Casualties:                      │
│  - Platoon 01: 50 troops lost (100/150) │
│  - Platoon 03: 25 troops lost (150/175) │
│  Total: 75 troops lost                  │
│                                         │
│ Enemy Casualties:                       │
│  - All enemy platoons eliminated        │
│  Total: 350 troops destroyed            │
│                                         │
│ Planet Ownership: Player                │
│ Captured Resources: 1,200 Minerals      │
│                                         │
│ [Continue]                              │
└─────────────────────────────────────────┘
```

**Defeat Display:**
```
┌─────────────────────────────────────────┐
│ ❌ PLAYER DEFEAT                        │
│                                         │
│ Invasion Failed                         │
│                                         │
│ Player Casualties:                      │
│  - Platoon 01: Destroyed (150 troops)   │
│  - Platoon 03: Destroyed (175 troops)   │
│  - Platoon 04: 75 troops lost (50/125)  │
│  Total: 400 troops lost                 │
│                                         │
│ Enemy Casualties:                       │
│  - Enemy Platoon 07: 120 troops lost    │
│  Total: 120 troops destroyed            │
│                                         │
│ Planet Ownership: Enemy (unchanged)     │
│ Retreating forces return to BC-01       │
│                                         │
│ [Return to Galaxy Map]                  │
└─────────────────────────────────────────┘
```

**Stalemate Display (Turn 10+):**
```
┌─────────────────────────────────────────┐
│ ⚠️ STALEMATE                            │
│                                         │
│ Battle Inconclusive (10 turns)          │
│                                         │
│ Both sides withdraw to regroup.         │
│                                         │
│ Player Casualties: 120 troops           │
│ Enemy Casualties: 95 troops             │
│                                         │
│ Planet Ownership: Unchanged             │
│                                         │
│ [Return to Galaxy Map]                  │
└─────────────────────────────────────────┘
```

#### 8. Turn Resolution

**Combat Turn Sequence:**
1. **Player Action Phase:** Execute selected action (Bombard, Retreat, Continue)
2. **Platoon Attacks:** Each player platoon attacks random enemy platoon
3. **Damage Calculation:** Damage = Attacker Strength - Defender Defense
4. **Casualty Application:** Reduce troop counts, destroy platoons if 0 troops
5. **Enemy Attacks:** Enemy platoons retaliate
6. **Victory Check:** If one side eliminated, battle ends
7. **Turn Increment:** Turn counter increments, repeat from Step 1

**Combat Formula:**
```
Damage = Attacker Combat Strength / 10
Combat Strength = Troops × (1.0 + Equipment×0.5 + Weapons×0.5 + Training)
Defense Reduction = Shields (20%), Fortifications (30%)
```

**Example:**
- Platoon 01: 150 troops, Eq 2, Wpn 3, Training 100%
- Combat Strength = 150 × (1.0 + 1.0 + 1.5 + 1.0) = 150 × 4.5 = 675
- Damage per Turn = 675 / 10 = 67 troops eliminated per attack

---

## Acceptance Criteria

### Functional Criteria

- [ ] Combat screen displays when player engages enemy forces
- [ ] Force comparison shows troop counts, combat strength, advantage indicator
- [ ] Combat visualization animates attacks, displays health bars, casualty counters
- [ ] Action panel allows Continue, Orbital Bombardment (if available), Retreat
- [ ] Orbital Bombardment requires Battle Cruiser in orbit, has 3-turn cooldown
- [ ] Retreat aborts combat, returns forces to Battle Cruiser (assault) or surrenders planet (defense)
- [ ] Combat log displays turn-by-turn events with color coding
- [ ] Battle resolves turn-by-turn until victory, defeat, or stalemate (10 turns)
- [ ] Victory screen shows casualties, planet ownership change, captured resources
- [ ] Defeat screen shows casualties, forces retreat to Battle Cruiser
- [ ] Stalemate screen shows inconclusive result after 10 turns

### UI and Visual Criteria

- [ ] Health bars update smoothly as damage dealt
- [ ] Attack animations play between forces
- [ ] Casualty counters update in real-time
- [ ] Action buttons disabled if unavailable (e.g., Bombard on cooldown)
- [ ] Combat log auto-scrolls to latest entry
- [ ] Victory/Defeat screen displays with appropriate color scheme (green/red)
- [ ] Force comparison bars visually show relative strength

### Mobile UI Criteria

- [ ] Combat visualization resizes to fit mobile screen
- [ ] Action panel stacks vertically below visualization
- [ ] Combat log displayed as expandable panel (tap to expand)
- [ ] Touch targets ≥44×44 points for all buttons
- [ ] Results screen full-screen on mobile

### Performance Criteria

- [ ] Combat turn resolves <500ms
- [ ] Health bar animations smooth (60 FPS)
- [ ] Combat log updates <100ms per entry
- [ ] Results screen displays <200ms after combat ends

---

## Implementation Notes

### Combat State Management

**Combat Session:**
```csharp
class CombatSession {
    List<Platoon> playerForces;
    List<Platoon> enemyForces;
    int currentTurn = 1;
    int maxTurns = 10;
    bool bombardmentAvailable = true;
    int bombardmentCooldown = 0;

    CombatResult ResolveTurn(CombatAction playerAction) {
        // Apply player action
        if (playerAction == CombatAction.OrbitalBombard) {
            ApplyBombardment();
            bombardmentCooldown = 3;
            bombardmentAvailable = false;
        } else if (playerAction == CombatAction.Retreat) {
            return CombatResult.Retreat;
        }

        // Platoon attacks
        foreach (var playerPlatoon in playerForces) {
            var target = GetRandomEnemyPlatoon();
            int damage = CalculateDamage(playerPlatoon, target);
            ApplyDamage(target, damage);
            LogCombatEvent($"Player {playerPlatoon.ID} attacks Enemy {target.ID} for {damage} damage");
        }

        // Enemy attacks
        foreach (var enemyPlatoon in enemyForces) {
            var target = GetRandomPlayerPlatoon();
            int damage = CalculateDamage(enemyPlatoon, target);
            ApplyDamage(target, damage);
            LogCombatEvent($"Enemy {enemyPlatoon.ID} attacks Player {target.ID} for {damage} damage");
        }

        // Check victory/defeat
        if (enemyForces.Count == 0) return CombatResult.Victory;
        if (playerForces.Count == 0) return CombatResult.Defeat;

        // Check stalemate
        currentTurn++;
        if (currentTurn > maxTurns) return CombatResult.Stalemate;

        // Decrement cooldown
        if (bombardmentCooldown > 0) {
            bombardmentCooldown--;
            if (bombardmentCooldown == 0) bombardmentAvailable = true;
        }

        return CombatResult.Ongoing;
    }
}
```

### Damage Calculation

**Combat Strength:**
```csharp
int CalculateDamage(Platoon attacker, Platoon defender) {
    float attackerStrength = attacker.TroopCount * GetCombatMultiplier(attacker);
    float damage = attackerStrength / 10f;

    // Apply defender bonuses (shields, fortifications)
    if (defender.HasShields) {
        damage *= 0.8f;  // 20% reduction
    }

    return Mathf.RoundToInt(damage);
}

float GetCombatMultiplier(Platoon platoon) {
    float multiplier = 1.0f;
    multiplier += platoon.EquipmentLevel * 0.5f;
    multiplier += platoon.WeaponsLevel * 0.5f;
    if (platoon.TrainingPercentage >= 100) multiplier += 1.0f;
    return multiplier;
}

void ApplyDamage(Platoon target, int damage) {
    target.TroopCount -= damage;
    if (target.TroopCount <= 0) {
        target.TroopCount = 0;
        DestroyPlatoon(target);
    }
}
```

### Orbital Bombardment

**Bombardment Effect:**
```csharp
void ApplyBombardment() {
    if (!bombardmentAvailable) {
        ShowError("Bombardment on cooldown");
        return;
    }

    int bombardmentDamage = 50;
    var target = GetRandomEnemyPlatoon();

    target.TroopCount -= bombardmentDamage;
    LogCombatEvent($"Orbital Bombardment hits Enemy {target.ID} for {bombardmentDamage} damage", CombatEventType.Special);

    // 10% chance to damage planet infrastructure
    if (Random.value < 0.1f) {
        LogCombatEvent("Bombardment damaged planet infrastructure!", CombatEventType.Warning);
        // Reduce planet building count or resources
    }

    bombardmentAvailable = false;
    bombardmentCooldown = 3;
}
```

### Combat Log

**Event Logging:**
```csharp
class CombatLog : MonoBehaviour {
    ScrollRect scrollRect;
    Text logText;
    List<string> logEntries = new List<string>();

    void LogCombatEvent(string message, CombatEventType type = CombatEventType.Normal) {
        string coloredMessage = ApplyColor(message, type);
        logEntries.Add(coloredMessage);
        UpdateLogDisplay();
        ScrollToBottom();
    }

    string ApplyColor(string message, CombatEventType type) {
        switch (type) {
            case CombatEventType.PlayerAction:
                return $"<color=blue>{message}</color>";
            case CombatEventType.EnemyAction:
                return $"<color=red>{message}</color>";
            case CombatEventType.Special:
                return $"<color=yellow>{message}</color>";
            case CombatEventType.Casualty:
                return $"<color=orange>{message}</color>";
            default:
                return message;
        }
    }

    void ScrollToBottom() {
        Canvas.ForceUpdateCanvases();
        scrollRect.verticalNormalizedPosition = 0f;
    }
}
```

### Results Display

**Victory Screen:**
```csharp
void ShowVictoryScreen(CombatSession combat) {
    var playerCasualties = CalculateCasualties(combat.playerForces);
    var enemyCasualties = CalculateCasualties(combat.enemyForces);

    VictoryScreen.Show(
        planetName: combat.PlanetName,
        playerCasualties: playerCasualties,
        enemyCasualties: enemyCasualties,
        capturedResources: combat.Planet.Resources,
        onContinue: () => {
            // Transfer planet ownership
            combat.Planet.Owner = FactionType.Player;
            ReturnToGalaxyMap();
        }
    );
}

CasualtyReport CalculateCasualties(List<Platoon> forces) {
    int totalLost = 0;
    var platoonDetails = new List<string>();

    foreach (var platoon in forces) {
        int lost = platoon.InitialTroopCount - platoon.TroopCount;
        totalLost += lost;

        if (platoon.TroopCount == 0) {
            platoonDetails.Add($"Platoon {platoon.ID}: Destroyed ({lost} troops)");
        } else {
            platoonDetails.Add($"Platoon {platoon.ID}: {lost} troops lost ({platoon.TroopCount}/{platoon.InitialTroopCount})");
        }
    }

    return new CasualtyReport {
        TotalLost = totalLost,
        PlatoonDetails = platoonDetails
    };
}
```

---

## Testing Scenarios

### Combat Initiation Tests

1. **Planetary Assault Start:**
   - Given player Battle Cruiser with 3 platoons arrives at enemy planet
   - When combat begins
   - Then Combat Control screen displays with force comparison, action options, combat log

2. **Space Combat Start:**
   - Given player fleet encounters enemy fleet in orbit
   - When combat begins
   - Then screen displays fleet combat variant with Focus Fire option

### Combat Resolution Tests

1. **Player Victory:**
   - Given player has 1,350 combat strength vs enemy 1,050
   - When combat resolves over 5 turns
   - Then player wins, victory screen displays casualties, planet captured

2. **Player Defeat:**
   - Given player has 800 combat strength vs enemy 1,500
   - When combat resolves
   - Then player loses all platoons, defeat screen shows casualties, forces retreat

3. **Stalemate:**
   - Given evenly matched forces (1,200 vs 1,150)
   - When combat reaches Turn 10
   - Then stalemate screen displays, both sides withdraw, planet ownership unchanged

### Action Tests

1. **Orbital Bombardment:**
   - Given player has 2 Battle Cruisers in orbit, bombardment available
   - When player selects Bombard and executes
   - Then enemy loses 50 troops, bombardment goes on 3-turn cooldown

2. **Retreat:**
   - Given player losing combat (2 platoons destroyed)
   - When player selects Retreat
   - Then combat ends, remaining platoons return to Battle Cruiser, planet remains enemy

3. **Bombardment Cooldown:**
   - Given player used bombardment this turn
   - When next turn begins
   - Then Bombardment option grayed out, "Cooldown: 2 turns remaining" displayed

---

## Future Enhancements (Post-MVP)

**Advanced Features:**
- Tactical positioning (flanking, ambush bonuses)
- Morale system (units can break and flee)
- Hero units (commanders with special abilities)
- Terrain effects (fortifications, urban combat penalties)

**Visual Enhancements:**
- 3D combat cinematics (zoom into battle scenes)
- Unit-specific animations (different for different equipment levels)
- Slow-motion replays of critical moments
- Cinematic camera angles

**Mobile Optimizations:**
- Auto-resolve option (skip animation, show results only)
- Speed control (1x, 2x, 4x combat speed)
- Tap-to-pause during combat visualization

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-041 (Combat System), AFS-042 (Space Combat), AFS-043 (Bombardment), AFS-044 (Invasion), AFS-033 (Platoon System)
