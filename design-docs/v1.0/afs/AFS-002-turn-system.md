# AFS-002: Turn System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-CORE-002

---

## Summary

Turn-based game loop that manages turn phases (Income, Action, Combat, End), executes AI turns, resolves combat, and checks victory conditions.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Stores current turn and phase
- **AFS-051 (AI Decision Tree)**: Executes AI opponent actions

---

## Requirements

### Turn Structure

1. **Turn Phases**
   - **Income Phase**: Calculate and apply resource generation, population growth, tax revenue
   - **Action Phase**: Player performs actions (build, move, purchase)
   - **Combat Phase**: Resolve all battles between opposing forces
   - **End Phase**: Check victory conditions, auto-save, prepare next turn

2. **Phase Transitions**
   - Player initiates "End Turn" button press
   - System transitions through phases automatically
   - UI updates to show current phase
   - Phase cannot be skipped or reversed

3. **Turn Counter**
   - Turn number increments after End Phase
   - Starts at Turn 1 (Day 1 of Year 2010 in game lore)
   - No turn limit (game continues until victory/defeat)
   - Display format: "Turn X" or "Day X, Year 2010"

### Player Turn Execution

1. **Income Phase (Automatic)**
   - For each player-owned planet:
     - Generate resources from buildings
     - Apply population growth (based on morale/tax rate)
     - Collect tax revenue
     - Consume food (population × food consumption rate)
   - Apply maintenance costs (optional, if implemented)
   - Display resource changes in message log

2. **Action Phase (Player Control)**
   - Player has unlimited time
   - Can perform actions in any order:
     - Build structures on colonies
     - Commission platoons
     - Purchase craft
     - Move fleets
     - Adjust tax rates
     - Deploy Atmosphere Processors
   - "End Turn" button available at all times
   - Warning if critical resources low (e.g., Food < 500)

3. **Combat Phase (Automatic)**
   - Identify all conflict zones (planets with opposing forces)
   - Resolve battles in planet order (closest to Starbase first)
   - Display battle animation in Video Window
   - Update planet ownership based on results
   - Display casualties and outcome messages

4. **End Phase (Automatic)**
   - Check victory conditions
   - If victory: Display victory screen, end game
   - If defeat: Display defeat screen, end game
   - If continuing: Auto-save game state
   - Increment turn counter
   - Transition to AI turn

### AI Turn Execution

1. **AI Income Phase**
   - Same as player income phase
   - No UI updates (executes silently in background)

2. **AI Action Phase**
   - AI executes decision tree (see AFS-051)
   - Actions include: build, train, purchase, move, attack
   - Fast execution (all actions in <5 seconds)
   - Optional: "Thinking" animation in UI

3. **AI Combat Phase**
   - Same combat resolution as player
   - Battles involving AI are displayed
   - Player can see AI military actions

4. **AI End Phase**
   - Transition back to Player Income Phase
   - Turn counter already incremented in Player End Phase

### Victory/Defeat Conditions

1. **Victory Conditions**
   - **Military Victory**: AI has zero platoons AND zero owned planets
   - **Territorial Victory**: Player controls all planets in system
   - Display "VICTORY" screen with stats (turn count, military strength, resources)

2. **Defeat Conditions**
   - **Military Defeat**: Player has zero platoons AND zero owned planets
   - **Economic Collapse**: Player cannot produce resources AND has <100 of each resource
   - Display "DEFEAT" screen with summary

3. **Victory Check Timing**
   - Checked at start of Player End Phase
   - Checked after each combat resolution
   - Game ends immediately when condition met

---

## Acceptance Criteria

### Functional Criteria

- [ ] Player can end turn via "End Turn" button
- [ ] Turn phases execute in correct sequence
- [ ] AI turn completes within 10 seconds
- [ ] Victory/defeat conditions checked accurately
- [ ] Turn counter increments correctly
- [ ] Resources calculated correctly each turn
- [ ] Combat resolves before turn ends

### Performance Criteria

- [ ] Turn transition time: <2 seconds (Player → AI)
- [ ] AI turn execution: <10 seconds total
- [ ] Combat resolution: <5 seconds per battle
- [ ] No frame drops during turn transitions

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for phase storage
- [ ] Triggers Save System (AFS-003) during End Phase
- [ ] Invokes AI Decision Tree (AFS-051) during AI turn
- [ ] Updates UI State Machine (AFS-071) on phase changes
- [ ] Triggers Combat System (AFS-041) during Combat Phase

---

## Technical Notes

### Implementation Approach

```csharp
public class TurnManager : MonoBehaviour
{
    private StateMachine<TurnPhase> _turnStateMachine;

    public void Initialize()
    {
        _turnStateMachine = new StateMachine<TurnPhase>();

        // Player Turn States
        _turnStateMachine.AddState(TurnPhase.PlayerIncome, OnPlayerIncomeEnter, OnPlayerIncomeUpdate, OnPlayerIncomeExit);
        _turnStateMachine.AddState(TurnPhase.PlayerAction, OnPlayerActionEnter, OnPlayerActionUpdate, OnPlayerActionExit);
        _turnStateMachine.AddState(TurnPhase.PlayerCombat, OnPlayerCombatEnter, OnPlayerCombatUpdate, OnPlayerCombatExit);
        _turnStateMachine.AddState(TurnPhase.PlayerEnd, OnPlayerEndEnter, OnPlayerEndUpdate, OnPlayerEndExit);

        // AI Turn States
        _turnStateMachine.AddState(TurnPhase.AIIncome, OnAIIncomeEnter, OnAIIncomeUpdate, OnAIIncomeExit);
        _turnStateMachine.AddState(TurnPhase.AIAction, OnAIActionEnter, OnAIActionUpdate, OnAIActionExit);
        _turnStateMachine.AddState(TurnPhase.AICombat, OnAICombatEnter, OnAICombatUpdate, OnAICombatExit);
        _turnStateMachine.AddState(TurnPhase.AIEnd, OnAIEndEnter, OnAIEndUpdate, OnAIEndExit);

        _turnStateMachine.SetState(TurnPhase.PlayerIncome);
    }

    public void EndPlayerTurn()
    {
        if (_turnStateMachine.CurrentState == TurnPhase.PlayerAction)
        {
            _turnStateMachine.SetState(TurnPhase.PlayerCombat);
        }
    }

    private void OnPlayerIncomeEnter()
    {
        // Calculate income for all player planets
        foreach (var planet in GameStateManager.Instance.GetPlayerPlanets())
        {
            var income = CalculateIncome(planet);
            GameStateManager.Instance.AddResources(planet.ID, income);
        }

        // Auto-transition to Action Phase
        _turnStateMachine.SetState(TurnPhase.PlayerAction);
    }

    private void OnPlayerActionEnter()
    {
        UIManager.Instance.EnableEndTurnButton(true);
    }

    private void OnPlayerCombatEnter()
    {
        var battles = IdentifyBattles();
        foreach (var battle in battles)
        {
            CombatManager.Instance.ResolveBattle(battle);
        }
        _turnStateMachine.SetState(TurnPhase.PlayerEnd);
    }

    private void OnPlayerEndEnter()
    {
        // Check victory
        var result = CheckVictoryConditions();
        if (result != VictoryResult.Continue)
        {
            GameManager.Instance.EndGame(result);
            return;
        }

        // Auto-save
        SaveSystem.Instance.AutoSave();

        // Increment turn
        GameStateManager.Instance.IncrementTurn();

        // Transition to AI turn
        _turnStateMachine.SetState(TurnPhase.AIIncome);
    }
}
```

### Income Calculation Example

```csharp
private ResourceDelta CalculateIncome(PlanetEntity planet)
{
    var income = new ResourceDelta();

    // Horticultural Stations produce Food
    int activeHorticultural = planet.GetActiveBuildingCount(BuildingType.HorticulturalStation);
    float foodMultiplier = planet.Type == PlanetType.Tropical ? 2.0f : 1.0f;
    income.Food = activeHorticultural * 100 * foodMultiplier;

    // Mining Stations produce Minerals and Fuel
    int activeMining = planet.GetActiveBuildingCount(BuildingType.MiningStation);
    float mineralMultiplier = planet.Type == PlanetType.Volcanic ? 5.0f : 1.0f;
    float fuelMultiplier = planet.Type == PlanetType.Volcanic ? 3.0f : 1.0f;
    income.Minerals = activeMining * 50 * mineralMultiplier;
    income.Fuel = activeMining * 30 * fuelMultiplier;

    // Solar Satellites produce Energy
    int activeSatellites = planet.GetCraftCount(CraftType.SolarSatellite);
    float energyMultiplier = planet.Type == PlanetType.Desert ? 2.0f : 1.0f;
    income.Energy = activeSatellites * 80 * energyMultiplier;

    return income;
}
```

### Victory Check Logic

```csharp
private VictoryResult CheckVictoryConditions()
{
    var playerPlanets = GameStateManager.Instance.GetPlayerPlanets().Count;
    var aiPlanets = GameStateManager.Instance.GetAIPlanets().Count;
    var playerPlatoons = GameStateManager.Instance.GetPlatoons(FactionType.Player).Count;
    var aiPlatoons = GameStateManager.Instance.GetPlatoons(FactionType.AI).Count;

    // Player Victory: AI eliminated
    if (aiPlanets == 0 && aiPlatoons == 0)
        return VictoryResult.PlayerVictory;

    // Player Defeat: Player eliminated
    if (playerPlanets == 0 && playerPlatoons == 0)
        return VictoryResult.PlayerDefeat;

    return VictoryResult.Continue;
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: State storage and queries
- **AFS-051 (AI Decision Tree)**: AI turn execution

### Depended On By
- **AFS-003 (Save/Load System)**: Triggered during End Phase
- **AFS-041 (Combat System)**: Invoked during Combat Phase
- **AFS-071 (UI State Machine)**: Phase transitions update UI

### Events Published
- `OnPhaseChanged(TurnPhase newPhase)`: Phase transitions
- `OnTurnStarted(int turnNumber)`: New turn begins
- `OnTurnEnded(int turnNumber)`: Turn completes
- `OnVictoryAchieved(VictoryResult result)`: Game ends

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
