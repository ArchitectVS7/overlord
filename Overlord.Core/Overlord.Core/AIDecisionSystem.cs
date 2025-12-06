using Overlord.Core.Models;

namespace Overlord.Core;

/// <summary>
/// Platform-agnostic AI decision-making system.
/// Executes AI turn, evaluates game state, and makes strategic decisions.
/// </summary>
public class AIDecisionSystem
{
    private readonly GameState _gameState;
    private readonly Random _random;

    // System dependencies
    private readonly IncomeSystem _incomeSystem;
    private readonly ResourceSystem _resourceSystem;
    private readonly BuildingSystem _buildingSystem;
    private readonly CraftSystem _craftSystem;
    private readonly PlatoonSystem _platoonSystem;

    // AI configuration
    private AIPersonality _personality;
    private AIPersonalityConfig _personalityConfig;
    private AIDifficulty _difficulty;

    /// <summary>
    /// Event fired when AI turn starts.
    /// </summary>
    public event Action? OnAITurnStarted;

    /// <summary>
    /// Event fired when AI turn completes.
    /// </summary>
    public event Action? OnAITurnCompleted;

    /// <summary>
    /// Event fired when AI initiates an attack.
    /// Parameters: (targetPlanetID)
    /// </summary>
    public event Action<int>? OnAIAttacking;

    /// <summary>
    /// Event fired when AI builds a structure.
    /// Parameters: (planetID, buildingType)
    /// </summary>
    public event Action<int, BuildingType>? OnAIBuilding;

    public AIDecisionSystem(
        GameState gameState,
        IncomeSystem incomeSystem,
        ResourceSystem resourceSystem,
        BuildingSystem buildingSystem,
        CraftSystem craftSystem,
        PlatoonSystem platoonSystem,
        AIPersonality personality = AIPersonality.Balanced,
        AIDifficulty difficulty = AIDifficulty.Normal,
        Random? random = null)
    {
        _gameState = gameState ?? throw new ArgumentNullException(nameof(gameState));
        _incomeSystem = incomeSystem ?? throw new ArgumentNullException(nameof(incomeSystem));
        _resourceSystem = resourceSystem ?? throw new ArgumentNullException(nameof(resourceSystem));
        _buildingSystem = buildingSystem ?? throw new ArgumentNullException(nameof(buildingSystem));
        _craftSystem = craftSystem ?? throw new ArgumentNullException(nameof(craftSystem));
        _platoonSystem = platoonSystem ?? throw new ArgumentNullException(nameof(platoonSystem));

        _personality = personality;
        _personalityConfig = AIPersonalityConfig.GetConfig(personality);
        _difficulty = difficulty;
        _random = random ?? new Random();
    }

    /// <summary>
    /// Gets current AI personality.
    /// </summary>
    public AIPersonality GetPersonality() => _personality;

    /// <summary>
    /// Gets AI personality name (e.g., "Commander Kratos").
    /// </summary>
    public string GetPersonalityName() => _personalityConfig.Name;

    /// <summary>
    /// Gets AI personality quote.
    /// </summary>
    public string GetPersonalityQuote() => _personalityConfig.Quote;

    /// <summary>
    /// Gets current difficulty level.
    /// </summary>
    public AIDifficulty GetDifficulty() => _difficulty;

    /// <summary>
    /// Sets AI difficulty level.
    /// </summary>
    public void SetDifficulty(AIDifficulty difficulty)
    {
        _difficulty = difficulty;
    }

    /// <summary>
    /// Executes full AI turn.
    /// </summary>
    public void ExecuteAITurn()
    {
        OnAITurnStarted?.Invoke();

        // Assess game state
        var assessment = AssessGameState();

        // Execute decision tree
        ExecuteDecisions(assessment);

        OnAITurnCompleted?.Invoke();
    }

    /// <summary>
    /// Assesses current game state (threat level, economy, territory).
    /// </summary>
    public AIAssessment AssessGameState()
    {
        var assessment = new AIAssessment();

        // Calculate military strengths
        int playerMilitary = CalculateMilitaryStrength(FactionType.Player);
        int aiMilitary = CalculateMilitaryStrength(FactionType.AI);

        // Apply difficulty modifiers to AI strength
        aiMilitary = ApplyDifficultyModifier(aiMilitary);

        // Threat level = Player ÷ AI (higher = player stronger)
        assessment.ThreatLevel = aiMilitary > 0 ? (float)playerMilitary / aiMilitary : 10.0f;

        // Economic strength
        var playerRes = _gameState.PlayerFaction.Resources;
        var aiRes = _gameState.AIFaction.Resources;
        int playerTotal = playerRes.Credits + playerRes.Minerals + playerRes.Fuel + playerRes.Food;
        int aiTotal = aiRes.Credits + aiRes.Minerals + aiRes.Fuel + aiRes.Food;
        assessment.EconomicStrength = playerTotal > 0 ? (float)aiTotal / playerTotal : 0.0f;

        // Territory
        assessment.AIPlanets = _gameState.Planets.Count(p => p.Owner == FactionType.AI);
        assessment.PlayerPlanets = _gameState.Planets.Count(p => p.Owner == FactionType.Player);

        // Under attack check
        assessment.UnderAttack = IsUnderAttack();

        // Can attack check
        assessment.CanAttack = CanAttack(assessment.ThreatLevel);

        return assessment;
    }

    /// <summary>
    /// Executes AI decision tree based on assessment.
    /// </summary>
    private void ExecuteDecisions(AIAssessment assessment)
    {
        // Priority 1: Defend if under attack
        if (assessment.UnderAttack)
        {
            ReinforceDefenses();
        }

        // Priority 2: Build military if threatened
        if (assessment.ThreatLevel > 0.8f)
        {
            TrainMilitary();
        }

        // Priority 3: Build economy (early-mid game or economic personality)
        if (_gameState.CurrentTurn < 20 || _personality == AIPersonality.Economic)
        {
            float economicPriority = 1.0f + _personalityConfig.EconomicModifier;
            if (economicPriority > 0.5f)
            {
                BuildEconomy();
            }
        }

        // Priority 4: Attack if advantage
        if (assessment.CanAttack && !assessment.UnderAttack)
        {
            LaunchAttack();
        }

        // Priority 5: Expand to neutral planets (if safe)
        if (assessment.AIPlanets < 3 && assessment.EconomicStrength > 0.5f && assessment.ThreatLevel < 1.0f)
        {
            ExpandToNeutral();
        }
    }

    /// <summary>
    /// Calculates total military strength for a faction.
    /// </summary>
    private int CalculateMilitaryStrength(FactionType faction)
    {
        int totalStrength = 0;

        var platoons = _gameState.Platoons.Where(p => p.Owner == faction).ToList();

        foreach (var platoon in platoons)
        {
            // Base strength from troop count
            int strength = platoon.TroopCount;

            // Equipment multipliers
            strength += platoon.Equipment switch
            {
                EquipmentLevel.Civilian => 0,
                EquipmentLevel.Standard => platoon.TroopCount / 2,
                EquipmentLevel.Elite => platoon.TroopCount,
                _ => 0
            };

            // Weapon multipliers
            strength += platoon.Weapon switch
            {
                WeaponLevel.Pistol => 0,
                WeaponLevel.Rifle => platoon.TroopCount / 2,
                WeaponLevel.Plasma => platoon.TroopCount,
                _ => 0
            };

            totalStrength += strength;
        }

        return totalStrength;
    }

    /// <summary>
    /// Applies difficulty modifier to AI military strength.
    /// </summary>
    private int ApplyDifficultyModifier(int strength)
    {
        return _difficulty switch
        {
            AIDifficulty.Easy => (int)(strength * 0.8f), // -20%
            AIDifficulty.Hard => (int)(strength * 1.2f), // +20%
            _ => strength // Normal
        };
    }

    /// <summary>
    /// Checks if AI is under attack.
    /// </summary>
    private bool IsUnderAttack()
    {
        var aiPlanets = _gameState.Planets.Where(p => p.Owner == FactionType.AI).ToList();

        foreach (var planet in aiPlanets)
        {
            // Check for player craft in orbit
            var playerCraft = _gameState.Craft
                .Where(c => c.PlanetID == planet.ID && c.Owner == FactionType.Player)
                .ToList();

            if (playerCraft.Any(c => c.Type == CraftType.BattleCruiser))
            {
                return true; // Player Battle Cruiser at AI planet
            }
        }

        return false;
    }

    /// <summary>
    /// Determines if AI can attack based on threat level and personality.
    /// </summary>
    private bool CanAttack(float threatLevel)
    {
        // Base attack thresholds by difficulty
        float baseThreshold = _difficulty switch
        {
            AIDifficulty.Easy => 0.5f,   // AI needs 2× player strength
            AIDifficulty.Hard => 0.83f,  // AI needs 1.2× player strength
            _ => 0.67f                    // AI needs 1.5× player strength (Normal)
        };

        // Apply personality aggression modifier
        float adjustedThreshold = baseThreshold + _personalityConfig.AggressionModifier;

        // AI can attack if threat level is below threshold (AI is stronger)
        return threatLevel < adjustedThreshold;
    }

    /// <summary>
    /// Reinforces defenses at threatened planets.
    /// </summary>
    private void ReinforceDefenses()
    {
        var hitotsu = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI && p.Name == "Hitotsu");
        if (hitotsu == null)
            return;

        // Check if we can afford a platoon
        var totalCost = PlatoonCosts.GetTotalCost(EquipmentLevel.Standard, WeaponLevel.Rifle);
        var cost = new ResourceCost { Credits = totalCost };
        if (!hitotsu.Resources.CanAfford(cost))
            return;

        // Train defensive platoon
        _platoonSystem.CommissionPlatoon(hitotsu.ID, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
    }

    /// <summary>
    /// Trains military units based on difficulty and game state.
    /// </summary>
    private void TrainMilitary()
    {
        var hitotsu = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI && p.Name == "Hitotsu");
        if (hitotsu == null)
            return;

        // Determine equipment/weapons by difficulty
        var (equipment, weapon) = _difficulty switch
        {
            AIDifficulty.Easy => (EquipmentLevel.Standard, WeaponLevel.Pistol),
            AIDifficulty.Hard => (EquipmentLevel.Elite, WeaponLevel.Plasma),
            _ => (EquipmentLevel.Standard, WeaponLevel.Rifle) // Normal
        };

        // Check if we can afford
        var totalCost = PlatoonCosts.GetTotalCost(equipment, weapon);
        var cost = new ResourceCost { Credits = totalCost };
        if (!hitotsu.Resources.CanAfford(cost))
            return;

        // Train platoon
        int troops = _random.Next(100, 151);
        _platoonSystem.CommissionPlatoon(hitotsu.ID, FactionType.AI, troops, equipment, weapon);
    }

    /// <summary>
    /// Builds economic infrastructure based on personality.
    /// </summary>
    private void BuildEconomy()
    {
        var aiPlanets = _gameState.Planets.Where(p => p.Owner == FactionType.AI).ToList();

        foreach (var planet in aiPlanets)
        {
            // Economic personality builds more aggressively
            float buildChance = _personality == AIPersonality.Economic ? 0.8f : 0.4f;
            if (_random.NextDouble() > buildChance)
                continue;

            // Build Mining Stations on Volcanic planets
            if (planet.Type == PlanetType.Volcanic)
            {
                _buildingSystem.StartConstruction(planet.ID, BuildingType.MiningStation);
                OnAIBuilding?.Invoke(planet.ID, BuildingType.MiningStation);
            }

            // Build Horticultural Stations on Tropical planets
            if (planet.Type == PlanetType.Tropical)
            {
                _buildingSystem.StartConstruction(planet.ID, BuildingType.HorticulturalStation);
                OnAIBuilding?.Invoke(planet.ID, BuildingType.HorticulturalStation);
            }
        }
    }

    /// <summary>
    /// Launches attack on player planet.
    /// </summary>
    private void LaunchAttack()
    {
        // Aggressive personality attacks more often
        if (_personality == AIPersonality.Defensive)
        {
            // Defensive personality rarely attacks
            if (_random.NextDouble() > 0.2)
                return;
        }

        // Find target (weakest player planet)
        var playerPlanets = _gameState.Planets.Where(p => p.Owner == FactionType.Player).ToList();
        if (playerPlanets.Count == 0)
            return;

        // Avoid Starbase initially
        var target = playerPlanets
            .Where(p => p.Name != "Starbase")
            .OrderBy(p => GetPlanetDefenseStrength(p.ID))
            .FirstOrDefault();

        if (target == null)
            target = playerPlanets[0]; // Attack Starbase if only option

        // Get AI Battle Cruisers with platoons
        var battleCruisers = _gameState.Craft
            .Where(c => c.Owner == FactionType.AI &&
                       c.Type == CraftType.BattleCruiser &&
                       c.CarriedPlatoonIDs.Count > 0)
            .ToList();

        if (battleCruisers.Count < 2)
            return; // Need at least 2 cruisers

        // NOTE: Actual movement would require a NavigationSystem
        // For now, just fire the event
        OnAIAttacking?.Invoke(target.ID);
    }

    /// <summary>
    /// Expands to neutral planets.
    /// </summary>
    private void ExpandToNeutral()
    {
        var neutralPlanets = _gameState.Planets.Where(p => p.Owner == FactionType.Neutral).ToList();
        if (neutralPlanets.Count == 0)
            return;

        var hitotsu = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI && p.Name == "Hitotsu");
        if (hitotsu == null)
            return;

        // Try to purchase Atmosphere Processor
        int processorID = _craftSystem.PurchaseCraft(CraftType.AtmosphereProcessor, hitotsu.ID, FactionType.AI);

        // NOTE: Would normally send to neutral planet via NavigationSystem
        // For now, just creating the craft is progress
    }

    /// <summary>
    /// Gets defense strength of a planet (garrison + defenses).
    /// </summary>
    private int GetPlanetDefenseStrength(int planetID)
    {
        int strength = 0;

        // Garrison strength
        var garrison = _gameState.Platoons.Where(p => p.PlanetID == planetID).ToList();
        foreach (var platoon in garrison)
        {
            strength += platoon.TroopCount;
        }

        // Orbital Defense bonus
        if (_gameState.PlanetLookup.TryGetValue(planetID, out var planet))
        {
            bool hasOrbitalDefense = planet.Structures.Any(s => s.Type == BuildingType.OrbitalDefense && s.Status == BuildingStatus.Active);
            if (hasOrbitalDefense)
            {
                strength = (int)(strength * 1.2f); // +20% defense bonus
            }
        }

        return strength;
    }
}
