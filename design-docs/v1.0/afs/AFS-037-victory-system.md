# AFS-037: Victory and Defeat System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-VICTORY-001, FR-VICTORY-002

---

## Summary

Victory and defeat condition detection system that monitors game state each turn to determine when a player or AI opponent has achieved military victory or suffered complete defeat, triggering appropriate end-game sequences and screens.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Access to all game entities and states
- **AFS-002 (Turn System)**: Victory check during End Phase
- **AFS-012 (Planet System)**: Planet ownership queries
- **AFS-033 (Platoon System)**: Military unit existence checks
- **AFS-032 (Craft System)**: Battle Cruiser existence checks

---

## Requirements

### Victory Conditions (FR-VICTORY-001)

#### 1. Military Victory Definition

**Victory Achieved When ALL of the following are TRUE:**
1. **All Enemy Platoons Eliminated:** AI faction has 0 platoons remaining
2. **All Enemy Planets Captured:** AI faction owns 0 planets
3. **Enemy Home Planet Controlled:** Player owns "Hitotsu" (AI starting planet)

**Rationale:** Complete military domination - enemy cannot recover without planets or military

**Victory Detection Timing:**
- Checked during Turn End Phase (after combat resolution)
- Triggers immediately when conditions met (no delay)
- Cannot be reversed once triggered

#### 2. Victory Condition Checks

**Check 1: All Enemy Platoons Eliminated**
```csharp
bool AllEnemyPlatoonsDestroyed() {
    int enemyPlatoons = GameState.Platoons
        .Where(p => p.Owner == FactionType.AI)
        .Count();
    return enemyPlatoons == 0;
}
```

**Conditions:**
- AI owns 0 platoons across all planets
- Includes garrisoned platoons AND platoons aboard Battle Cruisers
- Platoons under construction do NOT count (not yet operational)

**Check 2: All Enemy Planets Captured**
```csharp
bool AllEnemyPlanetsLost() {
    int enemyPlanets = GameState.Planets
        .Where(p => p.Owner == FactionType.AI)
        .Count();
    return enemyPlanets == 0;
}
```

**Conditions:**
- AI owns 0 planets (including Hitotsu home planet)
- Neutral planets do NOT count (not owned by AI)
- Player must own or AI must have lost all AI-controlled planets

**Check 3: Enemy Home Planet (Hitotsu) Captured**
```csharp
bool EnemyHomePlanetCaptured() {
    Planet hitotsu = GameState.Planets
        .FirstOrDefault(p => p.Name == "Hitotsu");
    return hitotsu != null && hitotsu.Owner == FactionType.Player;
}
```

**Conditions:**
- "Hitotsu" planet specifically controlled by player
- This check is redundant with Check 2 (all planets) but explicitly verifies home planet capture
- Symbolic importance: Capturing enemy capital

**Combined Victory Check:**
```csharp
bool CheckVictory() {
    return AllEnemyPlatoonsDestroyed() &&
           AllEnemyPlanetsLost() &&
           EnemyHomePlanetCaptured();
}
```

#### 3. Victory Sequence

**When Victory Detected:**

1. **Pause Turn System**
   - No further turns execute
   - Game state frozen at victory moment
   - Cannot load/save game (victory is final)

2. **Display Victory Screen**
   - **Header:** "VICTORY!" (large, gold text)
   - **Subheader:** "You have conquered the star system"
   - **Statistics:**
     - Total turns played
     - Final planet count (Player: X, Enemy: 0)
     - Final military strength (Platoons destroyed: X)
     - Total resources accumulated
   - **Visual:** Victory animation (fireworks, celebratory effects)
   - **Audio:** Victory fanfare music (AFS-081 integration)

3. **Victory Button Options:**
   - **"Return to Main Menu"** - Exit to title screen
   - **"View Statistics"** - Show detailed game stats (optional)
   - **"Continue Playing"** - (Future feature, sandbox mode)

4. **Achievement Tracking (Future):**
   - Record victory date, turn count
   - Unlock achievements (e.g., "Speed Victory" <20 turns)
   - Update player profile

**Victory Screen Layout:**
```
┌─────────────────────────────────┐
│         V I C T O R Y !         │
│                                 │
│  You have conquered the system  │
│                                 │
│  Turn: 42                       │
│  Planets Controlled: 6/6        │
│  Enemy Forces Destroyed: 24     │
│  Total Resources: 125,000       │
│                                 │
│  [Return to Main Menu]          │
│  [View Statistics]              │
└─────────────────────────────────┘
```

---

### Defeat Conditions (FR-VICTORY-002)

#### 1. Defeat Definition

**Defeat Occurs When ANY of the following are TRUE:**
1. **Player Loses All Planets:** Player faction owns 0 planets
2. **Player Has No Military Units:** Player has 0 platoons AND 0 Battle Cruisers
3. **Resource Deadlock:** Player cannot recover due to resource constraints (optional advanced check)

**Rationale:** Player cannot continue playing if they have no territory or military capacity to reclaim planets

**Defeat Detection Timing:**
- Checked during Turn End Phase (same as victory)
- Triggers immediately when conditions met
- Game over - cannot be reversed

#### 2. Defeat Condition Checks

**Check 1: Player Loses All Planets**
```csharp
bool PlayerLostAllPlanets() {
    int playerPlanets = GameState.Planets
        .Where(p => p.Owner == FactionType.Player)
        .Count();
    return playerPlanets == 0;
}
```

**Conditions:**
- Player owns 0 planets (including Starbase home planet)
- Most critical defeat condition - no territory means no production
- Cannot build units or structures without planets

**Check 2: Player Has No Military**
```csharp
bool PlayerHasNoMilitary() {
    int playerPlatoons = GameState.Platoons
        .Where(p => p.Owner == FactionType.Player)
        .Count();

    int playerBattleCruisers = GameState.Craft
        .Where(c => c.Type == CraftType.BattleCruiser &&
                    c.Owner == FactionType.Player)
        .Count();

    return playerPlatoons == 0 && playerBattleCruisers == 0;
}
```

**Conditions:**
- Player has 0 platoons (garrisoned or aboard craft)
- Player has 0 Battle Cruisers (no invasion capability)
- Cargo Cruisers, Solar Satellites, etc. do NOT count (cannot recapture planets)

**Check 3: Resource Deadlock (Advanced)**
```csharp
bool PlayerInDeadlock() {
    bool hasNoPlanets = PlayerLostAllPlanets();
    bool hasNoMilitary = PlayerHasNoMilitary();
    bool hasNoResources = GameState.GetTotalPlayerResources().IsEmpty();

    // Deadlock if: No planets, no military, and no resources to rebuild
    return hasNoPlanets && hasNoMilitary && hasNoResources;
}
```

**Conditions (Optional, Future Enhancement):**
- Player has no planets (no production)
- Player has no military (no offensive capability)
- Player has no resources (<100 of any resource type)
- Cannot purchase units or structures to recover
- **Note:** This check is optional - Checks 1 or 2 alone trigger defeat

**Combined Defeat Check:**
```csharp
bool CheckDefeat() {
    return PlayerLostAllPlanets() ||
           (PlayerHasNoMilitary() && /* other conditions */);
}
```

**Typical Defeat Scenarios:**
- **Scenario 1:** AI captures all player planets (including Starbase) → Defeat
- **Scenario 2:** Player loses Starbase and last platoon destroyed → Defeat
- **Scenario 3:** Player has 1 planet but 0 military and AI invading → Likely defeat next turn

#### 3. Defeat Sequence

**When Defeat Detected:**

1. **Pause Turn System**
   - No further turns execute
   - Game state frozen at defeat moment
   - Cannot load/save game (defeat is final)

2. **Display Defeat Screen**
   - **Header:** "DEFEAT" (large, red text)
   - **Subheader:** "Your empire has fallen"
   - **Defeat Reason:**
     - "All planets lost to enemy forces"
     - "Military forces completely destroyed"
     - "Unable to continue resistance"
   - **Statistics:**
     - Total turns survived
     - Planets lost count
     - Military units lost count
   - **Visual:** Defeat animation (dimmed screen, somber effects)
   - **Audio:** Defeat music (melancholic theme, AFS-081 integration)

3. **Defeat Button Options:**
   - **"Return to Main Menu"** - Exit to title screen
   - **"Retry"** - Restart same game with same seed (optional)
   - **"View Statistics"** - Show detailed game stats (optional)

**Defeat Screen Layout:**
```
┌─────────────────────────────────┐
│          D E F E A T            │
│                                 │
│   Your empire has fallen        │
│                                 │
│  Reason: All planets lost       │
│                                 │
│  Turns Survived: 28             │
│  Planets Lost: 6                │
│  Military Casualties: 18        │
│                                 │
│  [Return to Main Menu]          │
│  [Retry]                        │
└─────────────────────────────────┘
```

---

## Acceptance Criteria

### Victory Condition Criteria

- [ ] Victory detected when all 3 conditions met (enemy platoons = 0, enemy planets = 0, Hitotsu captured)
- [ ] Victory check executes during Turn End Phase
- [ ] Victory screen displays immediately upon detection
- [ ] Victory screen shows: turn count, planets controlled, enemy forces destroyed
- [ ] "Return to Main Menu" button exits to title screen
- [ ] Game state frozen after victory (no further turns)

### Defeat Condition Criteria

- [ ] Defeat detected when player loses all planets
- [ ] Defeat detected when player has 0 platoons AND 0 Battle Cruisers
- [ ] Defeat check executes during Turn End Phase
- [ ] Defeat screen displays immediately upon detection
- [ ] Defeat screen shows: reason, turns survived, losses
- [ ] "Return to Main Menu" and "Retry" buttons functional
- [ ] Game state frozen after defeat (no further turns)

### Edge Cases

- [ ] Victory/Defeat not triggered during Action Phase (player still has actions)
- [ ] If player and AI both meet defeat conditions simultaneously, player victory takes precedence
- [ ] Platoons under construction do NOT count toward victory/defeat checks
- [ ] Neutral planets do NOT affect victory/defeat conditions

### UI and Visual Criteria

- [ ] Victory screen uses gold color scheme, celebratory visuals
- [ ] Defeat screen uses red/gray color scheme, somber visuals
- [ ] Statistics display is accurate and clear
- [ ] Button interactions responsive (<200ms)
- [ ] Screen transitions smooth (300ms fade)

### Performance Criteria

- [ ] Victory/Defeat check completes in <10ms
- [ ] Screen rendering <500ms
- [ ] No memory leaks on repeated victory/defeat checks

---

## Implementation Notes

### Turn System Integration

**End Phase Logic:**
```csharp
void ExecuteEndPhase() {
    // Check victory first (player wins if mutual destruction)
    if (CheckVictory()) {
        TriggerVictory();
        return; // Stop turn system
    }

    // Check defeat second
    if (CheckDefeat()) {
        TriggerDefeat();
        return; // Stop turn system
    }

    // Otherwise, continue to next turn
    IncrementTurnCounter();
    AutoSave();
    BeginNextTurn();
}
```

### Victory/Defeat Triggers

**Victory Trigger:**
```csharp
void TriggerVictory() {
    GameState.IsGameOver = true;
    GameState.VictoryStatus = VictoryType.PlayerVictory;

    // Calculate statistics
    var stats = new VictoryStats {
        TurnsPlayed = GameState.CurrentTurn,
        PlanetsControlled = GameState.GetPlayerPlanetCount(),
        EnemyForcesDestroyed = GameState.GetTotalEnemyLossCount(),
        TotalResources = GameState.GetTotalPlayerResources()
    };

    // Display victory screen
    UI.ShowVictoryScreen(stats);

    // Play victory music
    AudioSystem.PlayVictoryTheme();
}
```

**Defeat Trigger:**
```csharp
void TriggerDefeat() {
    GameState.IsGameOver = true;
    GameState.VictoryStatus = VictoryType.PlayerDefeat;

    // Determine defeat reason
    string reason = GetDefeatReason();

    // Calculate statistics
    var stats = new DefeatStats {
        TurnsSurvived = GameState.CurrentTurn,
        PlanetsLost = GameState.GetOriginalPlanetCount() - GameState.GetPlayerPlanetCount(),
        MilitaryCasualties = GameState.GetTotalPlayerLossCount(),
        DefeatReason = reason
    };

    // Display defeat screen
    UI.ShowDefeatScreen(stats);

    // Play defeat music
    AudioSystem.PlayDefeatTheme();
}

string GetDefeatReason() {
    if (PlayerLostAllPlanets()) {
        return "All planets lost to enemy forces";
    } else if (PlayerHasNoMilitary()) {
        return "Military forces completely destroyed";
    } else {
        return "Unable to continue resistance";
    }
}
```

### State Management

**Game State Additions:**
```csharp
class GameState {
    bool IsGameOver;            // True if victory or defeat
    VictoryType VictoryStatus;  // PlayerVictory, PlayerDefeat, None
    int CurrentTurn;            // For statistics
}

enum VictoryType {
    None,
    PlayerVictory,
    PlayerDefeat
}
```

### UI Components

**Victory Screen (VictoryScreen.cs):**
```csharp
class VictoryScreen : UIPanel {
    Text HeaderText;            // "VICTORY!"
    Text SubheaderText;         // "You have conquered..."
    Text StatsText;             // Turn count, planets, etc.
    Button MainMenuButton;      // Return to menu
    Button ViewStatsButton;     // Detailed statistics
    ParticleSystem Fireworks;   // Celebratory VFX
}
```

**Defeat Screen (DefeatScreen.cs):**
```csharp
class DefeatScreen : UIPanel {
    Text HeaderText;            // "DEFEAT"
    Text SubheaderText;         // "Your empire has fallen"
    Text ReasonText;            // Defeat reason
    Text StatsText;             // Turns survived, losses
    Button MainMenuButton;      // Return to menu
    Button RetryButton;         // Restart game
}
```

---

## Testing Scenarios

### Victory Tests

1. **Complete Military Victory:**
   - Given player has captured Hitotsu and all other AI planets
   - And player has destroyed all 24 enemy platoons
   - When End Phase executes
   - Then victory screen displays with correct statistics

2. **Victory During Same Turn:**
   - Given player invades last enemy planet with platoons
   - When combat resolves and enemy has 0 platoons and 0 planets
   - Then victory triggers during same turn End Phase

3. **Victory Screen Statistics:**
   - Given player achieves victory on Turn 42
   - When victory screen displays
   - Then statistics show: Turn 42, Planets 6/6, correct resource totals

### Defeat Tests

1. **All Planets Lost:**
   - Given player has 1 remaining planet (Starbase)
   - When AI invades and captures Starbase
   - Then defeat screen displays reason "All planets lost"

2. **No Military Units:**
   - Given player has 0 platoons and 0 Battle Cruisers
   - And player still owns 1 planet but cannot build units (0 resources)
   - When End Phase executes
   - Then defeat triggered (unable to recover)

3. **Defeat Screen Statistics:**
   - Given player defeated on Turn 28
   - When defeat screen displays
   - Then statistics show: Turns 28, Planets Lost 6, correct casualties

### Edge Case Tests

1. **Mutual Destruction:**
   - Given both player and AI lose all units/planets simultaneously
   - When End Phase checks victory/defeat
   - Then player victory takes precedence (player wins tiebreaker)

2. **Units Under Construction:**
   - Given AI has 0 operational platoons but 2 platoons under construction
   - When victory check executes
   - Then victory triggered (under-construction units don't count)

3. **Neutral Planets:**
   - Given 2 neutral planets remain unclaimed
   - And player owns all AI planets (AI has 0 planets)
   - When victory check executes
   - Then victory triggered (neutral planets don't prevent victory)

---

## Balance Considerations

**Victory Difficulty:**
- **Moderate Challenge:** Capturing all enemy planets requires substantial military
- **Strategic Depth:** Must balance expansion vs. defense
- **Typical Victory:** 30-50 turns for balanced difficulty

**Defeat Prevention:**
- **Early Warning:** Display warnings when resources low or military weak
- **Recovery Mechanics:** Player can recover from 1-2 planet losses
- **Last Stand:** Player with Starbase alone can still rebuild and win

**AI Behavior:**
- AI should also check victory/defeat conditions (symmetric rules)
- AI should pursue victory (invade player planets)
- AI should defend against defeat (protect home planet)

---

## Future Enhancements (Post-MVP)

**Multiple Victory Conditions:**
- Economic Victory (control 80% of resources for 10 turns)
- Diplomatic Victory (ally with neutral factions)
- Scientific Victory (research ultimate technology)

**Difficulty Achievements:**
- Speed Victory (<20 turns)
- Domination Victory (control all planets + all neutrals)
- Perfect Victory (0 player casualties)

**Replay System:**
- Save full game replay on victory/defeat
- Watch game replay from any turn
- Share victory replays with community

**Victory/Defeat Cinematics:**
- 3D cinematic sequences (zoom to Hitotsu for victory)
- Voice-over narration
- Custom music tracks per victory type

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-001 (Game State Manager), AFS-002 (Turn System), AFS-012 (Planet System)
