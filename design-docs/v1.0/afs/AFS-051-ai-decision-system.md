# AFS-051: AI Decision System

**Status:** Updated (Post Design Review)
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-AI-001, FR-AI-002, FR-AI-003
**Design Review:** Added AI personality traits for varied opponent behavior

---

## Summary

AI opponent decision-making system that executes full game loop for enemy faction (Hitotsu), prioritizes actions based on game state, manages resource allocation, builds infrastructure and military, launches attacks, and provides varied difficulty levels through strategic parameters.

---

## Dependencies

- **AFS-001 (Game State Manager)**: AI faction state
- **AFS-002 (Turn System)**: AI Turn Phase execution
- **AFS-022 (Income System)**: AI resource production
- **AFS-033 (Platoon System)**: AI military creation
- **AFS-032 (Craft System)**: AI fleet management
- **AFS-041 (Combat System)**: AI combat decisions

---

## Requirements

### AI Turn Execution

1. **AI Turn Phases**
   - **AI Income Phase**: Calculate resources (same as player)
   - **AI Action Phase**: Execute AI decisions (build, train, purchase, move, attack)
   - **AI Combat Phase**: Resolve battles (same as player)
   - **AI End Phase**: Cleanup, transition to Player turn

2. **Turn Duration**
   - AI turn executes in <10 seconds total
   - Actions execute rapidly (no delays)
   - Optional "AI Thinking..." animation for player feedback
   - Silent execution (no UI popups during AI turn)

3. **AI Visibility**
   - AI income/production hidden from player
   - AI military movements visible on galaxy map
   - AI battles displayed in Video Window
   - AI resource totals hidden (fog of war)

### Decision Tree

1. **Priority System**
   - **Priority 1 (Critical)**: Defend planets under attack
   - **Priority 2 (High)**: Train platoons if under threat
   - **Priority 3 (Medium)**: Build economy (Mining/Horticultural)
   - **Priority 4 (Low)**: Attack player if military advantage
   - **Priority 5 (Lowest)**: Expand to neutral planets

2. **Decision Evaluation Frequency**
   - Evaluate priorities each AI turn
   - Execute highest priority action first
   - Continue to next priority if resources allow
   - Stop when resources exhausted or all actions complete

3. **Decision Weights**
   - Military Threat Assessment: Player military ÷ AI military
   - Economic Assessment: Player resources ÷ AI resources
   - Territorial Assessment: Player planets ÷ AI planets
   - Aggression Threshold: Varies by difficulty

### AI Personality Traits (NEW)

**Purpose:** Provide varied opponent behavior and strategic diversity across playthroughs. Each AI opponent has a personality archetype that influences decision-making, creating distinct play experiences.

1. **Aggressive (Warmonger)**
   - **Name:** Commander Kratos
   - **Portrait:** Red armor, stern expression
   - **Playstyle:**
     - Prioritizes military production over economy
     - Attacks early (Turn 5-10) if militarily advantageous
     - Builds mostly Battle Cruisers (80% military budget)
     - Constructs Orbital Defense Platforms aggressively
     - Low economic investment (minimal Mining/Horticultural Stations)
   - **Strengths:** Strong early-game military pressure
   - **Weaknesses:** Weak late-game economy, vulnerable to attrition
   - **Aggression Modifier:** +50% (attacks at lower thresholds)
   - **Economic Modifier:** -30% (builds fewer economic structures)
   - **Quote:** "Strength through conquest! Your planets will fall."

2. **Defensive (Turtle)**
   - **Name:** Overseer Aegis
   - **Portrait:** Blue armor, calculating gaze
   - **Playstyle:**
     - Prioritizes defense over offense
     - Builds Orbital Defense Platforms on all planets
     - Rarely attacks unless player is significantly weaker
     - Balanced economic development
     - Keeps large garrison forces on all planets
   - **Strengths:** Difficult to invade, strong late-game
   - **Weaknesses:** Passive early-game, allows player to expand
   - **Aggression Modifier:** -50% (attacks only when overwhelmingly superior)
   - **Defense Modifier:** +40% (prioritizes defensive structures)
   - **Quote:** "Patience is the strongest fortress. I can wait."

3. **Economic (Expansionist)**
   - **Name:** Magistrate Midas
   - **Portrait:** Gold-trimmed robes, confident smile
   - **Playstyle:**
     - Prioritizes resource production infrastructure
     - Builds many Mining/Horticultural Stations early
     - Deploys Solar Satellites for energy dominance
     - Minimal military until mid-game (Turn 15+)
     - Uses economic advantage to outproduce player late-game
   - **Strengths:** Dominant late-game economy, can outproduce player
   - **Weaknesses:** Vulnerable early-game, weak initial defenses
   - **Aggression Modifier:** -30% (defensive until economically dominant)
   - **Economic Modifier:** +50% (builds economic structures aggressively)
   - **Quote:** "Credits are power. My wealth will crush you."

4. **Balanced (Tactical)**
   - **Name:** General Nexus
   - **Portrait:** Gray armor, tactical visor
   - **Playstyle:**
     - Balanced approach (50% economy, 50% military)
     - Adapts strategy based on player actions
     - Attacks when advantageous, defends when threatened
     - Moderate infrastructure development
     - No extreme tendencies (default AI behavior)
   - **Strengths:** Adaptable, no obvious weaknesses
   - **Weaknesses:** No standout strengths, can be outplayed in specific areas
   - **Aggression Modifier:** 0% (standard thresholds)
   - **Economic Modifier:** 0% (balanced investment)
   - **Quote:** "Strategy, not emotion, wins wars."

**Personality Selection:**
- **Random Assignment:** Each new game selects random personality (25% chance each)
- **Player Choice (Optional):** Allow player to select AI personality in New Game menu
- **Visual Indicator:** AI portrait and name displayed in HUD
- **Personality Lock:** AI personality does not change mid-game

**Implementation Notes:**
- Personality modifiers applied to decision weights and priority system
- Aggressive AI has higher attack priority, lower defense priority
- Defensive AI has higher defense priority, lower attack priority
- Economic AI delays military production, prioritizes infrastructure
- Balanced AI uses standard weights (no modifiers)

### Economic Strategy

1. **Early Game (Turns 1-10)**
   - **Focus**: Resource production infrastructure
   - **Actions**:
     - Build 2-3 Mining Stations (Minerals + Fuel)
     - Build 1-2 Horticultural Stations (Food)
     - Deploy 1-2 Solar Satellites (Energy)
     - Save Credits for military (if threatened)
   - **Logic**: Establish economic foundation before military

2. **Mid Game (Turns 11-30)**
   - **Focus**: Balanced economy + military
   - **Actions**:
     - Maintain resource production
     - Train 2-4 platoons (Basic equipment)
     - Purchase 1-2 Battle Cruisers
     - Colonize 1 neutral planet (if safe)
   - **Logic**: Prepare for conflict while expanding

3. **Late Game (Turns 31+)**
   - **Focus**: Military supremacy
   - **Actions**:
     - Train elite platoons (Advanced/Elite equipment)
     - Expand fleet to 10+ craft
     - Launch invasions on player planets
     - Defend conquered territories
   - **Logic**: Overwhelm player with superior forces

### Military Strategy

1. **Threat Assessment**
   - **Formula**: `ThreatLevel = PlayerMilitaryStrength ÷ AIMilitaryStrength`
   - **Low Threat** (Threat < 0.5): AI has 2× player strength, can attack
   - **Medium Threat** (Threat 0.5-1.5): Roughly equal, build military
   - **High Threat** (Threat > 1.5): Player has 1.5× AI strength, focus defense

2. **Platoon Training**
   - Train at Hitotsu (AI starting planet)
   - Equipment selection:
     - Easy difficulty: Civilian/Basic (cheap)
     - Normal difficulty: Basic/Standard (balanced)
     - Hard difficulty: Standard/Advanced (expensive)
   - Weapon selection: Match equipment level
   - Training: Always 100% before deployment

3. **Fleet Composition**
   - 1 Battle Cruiser per 4 platoons (max 4 platoons per ship)
   - 1 Cargo Cruiser per 3 planets (resource logistics)
   - 1-2 Solar Satellites per planet (energy production)
   - No Atmosphere Processors initially (expansion later)

### Attack Logic

1. **Attack Conditions**
   - AI military strength > Player total strength × 1.5
   - AI owns ≥ 2 planets (secure base)
   - AI has ≥ 2 Battle Cruisers with platoons
   - Target planet has weak garrison (< 2 platoons or low strength)

2. **Target Selection**
   - **Priority 1**: Weakest player planet (lowest garrison)
   - **Priority 2**: Closest planet to Hitotsu (logistics)
   - **Priority 3**: Resource-rich planet (Volcanic/Desert/Tropical)
   - Avoid Starbase initially (strongest defense)

3. **Force Allocation**
   - Attack with 2× defender strength (minimum)
   - Send 2-4 Battle Cruisers per invasion
   - Keep 1-2 Battle Cruisers for Hitotsu defense
   - Retreat if casualties > 50% (preserve forces)

### Defense Logic

1. **Defense Triggers**
   - Player fleet en route to AI planet
   - Player fleet arrived at AI planet
   - AI planet garrison < 2 platoons (reinforce)

2. **Reinforcement Strategy**
   - Calculate required strength: Player force × 1.5
   - Send Battle Cruisers with sufficient platoons
   - Garrison planets with at least 2 platoons each
   - Prioritize Hitotsu defense (capital preservation)

3. **Retreat Conditions**
   - Battle odds < 30% chance of victory
   - Planet not Hitotsu (abandon colony to save forces)
   - Regroup at Hitotsu and rebuild military

### Difficulty Levels

1. **Easy**
   - **AI Bonuses**: None
   - **AI Penalties**: -20% resource production, -20% military strength
   - **Aggression**: 30% (cautious, defensive)
   - **Equipment**: Civilian/Basic only
   - **Attack Threshold**: AI military > Player × 2.0
   - **Strategic Behavior**: Reactive, focuses on economy

2. **Normal** (Default)
   - **AI Bonuses**: None
   - **AI Penalties**: None
   - **Aggression**: 50% (balanced)
   - **Equipment**: Basic/Standard
   - **Attack Threshold**: AI military > Player × 1.5
   - **Strategic Behavior**: Balanced economy and military

3. **Hard**
   - **AI Bonuses**: +20% resource production, +20% military strength
   - **AI Penalties**: None
   - **Aggression**: 70% (aggressive, offensive)
   - **Equipment**: Standard/Advanced/Elite
   - **Attack Threshold**: AI military > Player × 1.2
   - **Strategic Behavior**: Aggressive expansion, early military

---

## Acceptance Criteria

### Functional Criteria

- [ ] AI executes full turn in <10 seconds
- [ ] AI prioritizes defense when under attack
- [ ] AI builds economy early game (turns 1-10)
- [ ] AI trains military mid-late game
- [ ] AI attacks when military advantage exists
- [ ] AI defends Hitotsu aggressively
- [ ] Difficulty levels apply correct bonuses/penalties
- [ ] AI decisions vary based on game state

### Performance Criteria

- [ ] AI decision evaluation executes in <1s
- [ ] AI turn completes in <10s total
- [ ] No AI decision loops or hangs

### Integration Criteria

- [ ] Integrates with Turn System (AFS-002) for AI phases
- [ ] Uses Income System (AFS-022) for AI resources
- [ ] Uses Platoon System (AFS-033) for AI military
- [ ] Uses Combat System (AFS-041) for AI battles
- [ ] Triggered by Turn System during AI Turn Phase

---

## Technical Notes

### Implementation Approach

```csharp
public class AISystem : MonoBehaviour
{
    private static AISystem _instance;
    public static AISystem Instance => _instance;

    private DifficultyLevel _difficulty = DifficultyLevel.Normal;
    private int _currentTurn;

    public event Action OnAITurnStarted;
    public event Action OnAITurnCompleted;

    // Execute AI turn
    public void ExecuteAITurn()
    {
        _currentTurn = GameStateManager.Instance.GetCurrentTurn();
        OnAITurnStarted?.Invoke();

        Debug.Log($"AI Turn {_currentTurn} starting...");

        // AI Income Phase (automatic, same as player)
        IncomeSystem.Instance.CalculateAIIncome();

        // AI Action Phase (decision tree)
        ExecuteAIActions();

        // AI Combat Phase (handled by CombatSystem)
        // Combat triggered automatically when AI fleets arrive at player planets

        // AI End Phase
        OnAITurnCompleted?.Invoke();
        Debug.Log("AI Turn complete");
    }

    // Execute AI decision tree
    private void ExecuteAIActions()
    {
        // Evaluate game state
        float threatLevel = EvaluateThreatLevel();
        float economicStrength = EvaluateEconomicStrength();
        int aiPlanets = GameStateManager.Instance.GetPlanets(FactionType.AI).Count;

        Debug.Log($"AI Assessment: Threat={threatLevel:F2}, Economy={economicStrength:F2}, Planets={aiPlanets}");

        // Priority 1: Defend if under attack
        if (IsUnderAttack())
        {
            ReinforceDefenses();
        }

        // Priority 2: Build military if threatened
        if (threatLevel > 0.8f)
        {
            TrainMilitary();
        }

        // Priority 3: Build economy (early-mid game)
        if (_currentTurn < 20)
        {
            BuildEconomy();
        }

        // Priority 4: Attack if advantage
        if (CanAttack(threatLevel))
        {
            LaunchAttack();
        }

        // Priority 5: Expand to neutral planets
        if (aiPlanets < 3 && economicStrength > 0.5f)
        {
            ColonizeNeutral();
        }
    }

    // Evaluate threat level (player strength vs AI strength)
    private float EvaluateThreatLevel()
    {
        int playerStrength = CalculateTotalMilitaryStrength(FactionType.Player);
        int aiStrength = CalculateTotalMilitaryStrength(FactionType.AI);

        if (aiStrength == 0)
            return 10.0f; // Critical threat!

        return playerStrength / (float)aiStrength;
    }

    // Calculate total military strength for faction
    private int CalculateTotalMilitaryStrength(FactionType faction)
    {
        int totalStrength = 0;
        var platoons = GameStateManager.Instance.GetPlatoons(faction);

        foreach (var platoon in platoons)
        {
            totalStrength += platoon.GetMilitaryStrength();
        }

        // Apply difficulty modifiers
        if (faction == FactionType.AI)
        {
            switch (_difficulty)
            {
                case DifficultyLevel.Easy:
                    totalStrength = Mathf.FloorToInt(totalStrength * 0.8f); // -20%
                    break;
                case DifficultyLevel.Hard:
                    totalStrength = Mathf.FloorToInt(totalStrength * 1.2f); // +20%
                    break;
            }
        }

        return totalStrength;
    }

    // Evaluate economic strength
    private float EvaluateEconomicStrength()
    {
        var playerResources = ResourceSystem.Instance.GetTotalResources(FactionType.Player);
        var aiResources = ResourceSystem.Instance.GetTotalResources(FactionType.AI);

        int playerTotal = playerResources.Food + playerResources.Minerals + playerResources.Fuel + playerResources.Energy;
        int aiTotal = aiResources.Food + aiResources.Minerals + aiResources.Fuel + aiResources.Energy;

        if (aiTotal == 0)
            return 0.0f;

        return aiTotal / (float)Mathf.Max(1, playerTotal);
    }

    // Check if AI is under attack
    private bool IsUnderAttack()
    {
        var aiPlanets = GameStateManager.Instance.GetPlanets(FactionType.AI);

        foreach (var planet in aiPlanets)
        {
            // Check for player fleets en route
            var craft = GameStateManager.Instance.GetCraftAtPlanet(planet.ID);
            foreach (var c in craft)
            {
                if (c.Owner == FactionType.Player && c.Type == CraftType.BattleCruiser)
                {
                    return true; // Player fleet at AI planet!
                }
            }
        }

        return false;
    }

    // Reinforce planet defenses
    private void ReinforceDefenses()
    {
        // Find weakest AI planet
        var aiPlanets = GameStateManager.Instance.GetPlanets(FactionType.AI);
        PlanetEntity weakest = null;
        int lowestGarrison = int.MaxValue;

        foreach (var planet in aiPlanets)
        {
            int garrison = planet.GetDefenseStrength();
            if (garrison < lowestGarrison)
            {
                lowestGarrison = garrison;
                weakest = planet;
            }
        }

        if (weakest != null && lowestGarrison < 200)
        {
            // Train 1-2 platoons for defense
            var hitotsu = aiPlanets.FirstOrDefault(p => p.Name == "Hitotsu");
            if (hitotsu != null)
            {
                TrainPlatoonForDefense(hitotsu.ID);
            }
        }

        Debug.Log($"AI reinforcing defenses at {weakest?.Name ?? "unknown"}");
    }

    // Build economy infrastructure
    private void BuildEconomy()
    {
        var aiPlanets = GameStateManager.Instance.GetPlanets(FactionType.AI);

        foreach (var planet in aiPlanets)
        {
            // Build Mining Stations (priority: Volcanic planets)
            if (planet.Type == PlanetType.Volcanic && planet.SurfacePlatformCount < 6)
            {
                BuildStructure(planet.ID, BuildingType.MiningStation);
            }

            // Build Horticultural Stations (priority: Tropical planets)
            if (planet.Type == PlanetType.Tropical && planet.SurfacePlatformCount < 6)
            {
                BuildStructure(planet.ID, BuildingType.HorticulturalStation);
            }

            // Deploy Solar Satellites (priority: Desert planets)
            if (planet.Type == PlanetType.Desert)
            {
                PurchaseCraft(planet.ID, CraftType.SolarSatellite);
            }
        }

        Debug.Log("AI building economy infrastructure");
    }

    // Train military units
    private void TrainMilitary()
    {
        var hitotsu = GameStateManager.Instance.GetPlanets(FactionType.AI)
            .FirstOrDefault(p => p.Name == "Hitotsu");

        if (hitotsu == null)
            return;

        // Determine equipment based on difficulty
        EquipmentLevel equipment;
        WeaponLevel weapon;

        switch (_difficulty)
        {
            case DifficultyLevel.Easy:
                equipment = EquipmentLevel.Basic;
                weapon = WeaponLevel.Rifle;
                break;
            case DifficultyLevel.Hard:
                equipment = EquipmentLevel.Advanced;
                weapon = WeaponLevel.Plasma;
                break;
            default: // Normal
                equipment = EquipmentLevel.Standard;
                weapon = WeaponLevel.AssaultRifle;
                break;
        }

        // Train 100-150 troops
        int troops = Random.Range(100, 151);
        PlatoonSystem.Instance.CommissionPlatoon(troops, equipment, weapon, hitotsu.ID, FactionType.AI);

        Debug.Log($"AI training platoon: {troops} troops, {equipment} equipment, {weapon} weapons");
    }

    private void TrainPlatoonForDefense(int planetID)
    {
        // Simpler version for emergency defense
        PlatoonSystem.Instance.CommissionPlatoon(100, EquipmentLevel.Basic, WeaponLevel.Rifle, planetID, FactionType.AI);
    }

    // Determine if AI can attack
    private bool CanAttack(float threatLevel)
    {
        float attackThreshold;

        switch (_difficulty)
        {
            case DifficultyLevel.Easy:
                attackThreshold = 0.5f; // AI needs 2× player strength
                break;
            case DifficultyLevel.Hard:
                attackThreshold = 0.83f; // AI needs 1.2× player strength
                break;
            default: // Normal
                attackThreshold = 0.67f; // AI needs 1.5× player strength
                break;
        }

        return threatLevel < attackThreshold;
    }

    // Launch attack on player planet
    private void LaunchAttack()
    {
        // Find weakest player planet
        var playerPlanets = GameStateManager.Instance.GetPlanets(FactionType.Player);
        if (playerPlanets.Count == 0)
            return;

        PlanetEntity target = playerPlanets
            .Where(p => p.Name != "Starbase") // Avoid Starbase initially
            .OrderBy(p => p.GetDefenseStrength())
            .FirstOrDefault();

        if (target == null)
            target = playerPlanets[0]; // Attack Starbase if it's the only option

        // Get AI Battle Cruisers with platoons
        var battleCruisers = GameStateManager.Instance.GetCraft(FactionType.AI)
            .Where(c => c.Type == CraftType.BattleCruiser && c.CarriedPlatoonIDs.Count > 0)
            .ToList();

        if (battleCruisers.Count < 2)
        {
            Debug.Log("AI insufficient forces to attack");
            return; // Need at least 2 Battle Cruisers
        }

        // Send 2-3 Battle Cruisers to attack
        int fleetsToSend = Mathf.Min(3, battleCruisers.Count - 1); // Keep 1 for defense
        for (int i = 0; i < fleetsToSend; i++)
        {
            NavigationSystem.Instance.MoveCraft(battleCruisers[i].ID, target.ID);
        }

        Debug.Log($"AI launching attack on {target.Name} with {fleetsToSend} Battle Cruisers");
    }

    // Colonize neutral planet
    private void ColonizeNeutral()
    {
        var neutralPlanets = GameStateManager.Instance.GetPlanets(FactionType.Neutral);
        if (neutralPlanets.Count == 0)
            return;

        // Purchase Atmosphere Processor and deploy
        var hitotsu = GameStateManager.Instance.GetPlanets(FactionType.AI)
            .FirstOrDefault(p => p.Name == "Hitotsu");

        if (hitotsu != null)
        {
            int processorID = CraftSystem.Instance.PurchaseCraft(CraftType.AtmosphereProcessor, hitotsu.ID, FactionType.AI);
            if (processorID != -1)
            {
                // Send to nearest neutral planet
                var target = neutralPlanets[0];
                NavigationSystem.Instance.MoveCraft(processorID, target.ID);
                Debug.Log($"AI colonizing {target.Name}");
            }
        }
    }

    // Helper: Build structure
    private void BuildStructure(int planetID, BuildingType type)
    {
        // Check if affordable and planet has capacity
        var planet = GameStateManager.Instance.GetPlanetByID(planetID);
        if (planet == null || !planet.CanBuildSurfaceStructure())
            return;

        // Simplified building (actual costs from AFS-061)
        var cost = new ResourceCost { Credits = 5000, Minerals = 1000, Fuel = 500 };

        if (ResourceSystem.Instance.CanAfford(planetID, cost))
        {
            ResourceSystem.Instance.RemoveResources(planetID, cost);
            // Add structure to planet
            planet.Structures.Add(new Structure
            {
                Type = type,
                Status = BuildingStatus.Active
            });
            Debug.Log($"AI built {type} on {planet.Name}");
        }
    }

    // Helper: Purchase craft
    private void PurchaseCraft(int planetID, CraftType type)
    {
        CraftSystem.Instance.PurchaseCraft(type, planetID, FactionType.AI);
    }

    // Set difficulty
    public void SetDifficulty(DifficultyLevel difficulty)
    {
        _difficulty = difficulty;
        Debug.Log($"AI difficulty set to {difficulty}");
    }
}

public enum DifficultyLevel
{
    Easy,
    Normal,
    Hard
}
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: AI faction state
- **AFS-022 (Income System)**: AI resource production
- **AFS-033 (Platoon System)**: AI military training
- **AFS-032 (Craft System)**: AI fleet management

### Depended On By
- **AFS-002 (Turn System)**: AI Turn Phase
- **AFS-041 (Combat System)**: AI combat execution

### Events Published
- `OnAITurnStarted()`: AI turn begins
- `OnAITurnCompleted()`: AI turn ends
- `OnAIAttacking(int targetPlanetID)`: AI launches attack
- `OnAIBuilding(int planetID, BuildingType type)`: AI constructs building

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
