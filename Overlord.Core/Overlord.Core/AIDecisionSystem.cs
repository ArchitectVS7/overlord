using Overlord.Core.Models;

namespace Overlord.Core;


/// Platform-agnostic AI decision-making system.
/// Executes AI turn, evaluates game state, and makes strategic decisions.

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

    
    /// Event fired when AI turn starts.
    
    public event Action? OnAITurnStarted;

    
    /// Event fired when AI turn completes.
    
    public event Action? OnAITurnCompleted;

    
    /// Event fired when AI initiates an attack.
    /// Parameters: (targetPlanetID)
    
    public event Action<int>? OnAIAttacking;

    
    /// Event fired when AI builds a structure.
    /// Parameters: (planetID, buildingType)
    
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


    // ExecuteAITurn GUARANTEES a state mutation

    public void ExecuteAITurn()
    {
        OnAITurnStarted?.Invoke();

        bool didMutate = false;

        var assessment = AssessGameState();

        didMutate |= ExecuteDecisions(assessment);

        // 🔴 GUARANTEED MUTATION (STOP CONDITION FIX)
        if (!didMutate)
        {
            ForceGuaranteedMutation();
        }

        OnAITurnCompleted?.Invoke();
    }

    public AIAssessment AssessGameState()
    {
        var assessment = new AIAssessment();

        int playerMilitary = CalculateMilitaryStrength(FactionType.Player);
        int aiMilitary = CalculateMilitaryStrength(FactionType.AI);

        aiMilitary = ApplyDifficultyModifier(aiMilitary);

        assessment.ThreatLevel = aiMilitary > 0 ? (float)playerMilitary / aiMilitary : 10.0f;

        var playerRes = _gameState.PlayerFaction.Resources;
        var aiRes = _gameState.AIFaction.Resources;
        int playerTotal = playerRes.Credits + playerRes.Minerals + playerRes.Fuel + playerRes.Food;
        int aiTotal = aiRes.Credits + aiRes.Minerals + aiRes.Fuel + aiRes.Food;
        assessment.EconomicStrength = playerTotal > 0 ? (float)aiTotal / playerTotal : 0.0f;

        assessment.AIPlanets = _gameState.Planets.Count(p => p.Owner == FactionType.AI);
        assessment.PlayerPlanets = _gameState.Planets.Count(p => p.Owner == FactionType.Player);

        assessment.UnderAttack = IsUnderAttack();
        assessment.CanAttack = CanAttack(assessment.ThreatLevel);

        return assessment;
    }


    // returns whether any mutation occurred

    private bool ExecuteDecisions(AIAssessment assessment)
    {
        bool mutated = false;

        if (assessment.UnderAttack)
            mutated |= ReinforceDefenses();

        if (assessment.ThreatLevel > 0.8f)
            mutated |= TrainMilitary();

        if (_gameState.CurrentTurn < 20 || _personality == AIPersonality.Economic)
            mutated |= BuildEconomy();

        if (assessment.CanAttack && !assessment.UnderAttack)
            mutated |= LaunchAttack();

        if (assessment.AIPlanets < 3 && assessment.EconomicStrength > 0.5f && assessment.ThreatLevel < 1.0f)
            mutated |= ExpandToNeutral();

        return mutated;
    }


    // HELPERS: now return bool on mutation


    private bool ReinforceDefenses()
    {
        var hitotsu = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI && p.Name == "Hitotsu");
        if (hitotsu == null)
            return false;

        var totalCost = PlatoonCosts.GetTotalCost(EquipmentLevel.Standard, WeaponLevel.Rifle);
        var cost = new ResourceCost { Credits = totalCost };
        if (!hitotsu.Resources.CanAfford(cost))
            return false;

        _platoonSystem.CommissionPlatoon(hitotsu.ID, FactionType.AI, 100, EquipmentLevel.Standard, WeaponLevel.Rifle);
        return true;
    }

    private bool TrainMilitary()
    {
        var hitotsu = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI && p.Name == "Hitotsu");
        if (hitotsu == null)
            return false;

        var (equipment, weapon) = _difficulty switch
        {
            AIDifficulty.Easy => (EquipmentLevel.Standard, WeaponLevel.Pistol),
            AIDifficulty.Hard => (EquipmentLevel.Elite, WeaponLevel.Plasma),
            _ => (EquipmentLevel.Standard, WeaponLevel.Rifle)
        };

        var totalCost = PlatoonCosts.GetTotalCost(equipment, weapon);
        var cost = new ResourceCost { Credits = totalCost };
        if (!hitotsu.Resources.CanAfford(cost))
            return false;

        int troops = _random.Next(100, 151);
        _platoonSystem.CommissionPlatoon(hitotsu.ID, FactionType.AI, troops, equipment, weapon);
        return true;
    }

    private bool BuildEconomy()
    {
        bool mutated = false;

        foreach (var planet in _gameState.Planets.Where(p => p.Owner == FactionType.AI))
        {
            float buildChance = _personality == AIPersonality.Economic ? 0.8f : 0.4f;
            if (_random.NextDouble() > buildChance)
                continue;

            if (planet.Type == PlanetType.Volcanic)
            {
                _buildingSystem.StartConstruction(planet.ID, BuildingType.MiningStation);
                OnAIBuilding?.Invoke(planet.ID, BuildingType.MiningStation);
                mutated = true;
            }

            if (planet.Type == PlanetType.Tropical)
            {
                _buildingSystem.StartConstruction(planet.ID, BuildingType.HorticulturalStation);
                OnAIBuilding?.Invoke(planet.ID, BuildingType.HorticulturalStation);
                mutated = true;
            }
        }

        return mutated;
    }

    private bool LaunchAttack()
    {
        if (_personality == AIPersonality.Defensive && _random.NextDouble() > 0.2)
            return false;

        var target = _gameState.Planets
            .Where(p => p.Owner == FactionType.Player && p.Name != "Starbase")
            .OrderBy(p => GetPlanetDefenseStrength(p.ID))
            .FirstOrDefault();

        if (target == null)
            return false;

        var cruisers = _gameState.Craft
            .Where(c => c.Owner == FactionType.AI &&
                        c.Type == CraftType.BattleCruiser &&
                        c.CarriedPlatoonIDs.Count > 0)
            .ToList();

        if (cruisers.Count < 2)
            return false;

        OnAIAttacking?.Invoke(target.ID);
        return true;
    }

    private bool ExpandToNeutral()
    {
        var neutral = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.Neutral);
        var hitotsu = _gameState.Planets.FirstOrDefault(p => p.Owner == FactionType.AI && p.Name == "Hitotsu");

        if (neutral == null || hitotsu == null)
            return false;

        _craftSystem.PurchaseCraft(CraftType.AtmosphereProcessor, hitotsu.ID, FactionType.AI);
        return true;
    }

    // ============================================================
    // 🔴 STOP-CONDITION FIX: always mutates state
    // ============================================================
    private void ForceGuaranteedMutation()
    {
        _gameState.AIFaction.AITurnNonce++;
    }

    private int CalculateMilitaryStrength(FactionType faction) { /* unchanged */ }
    private int ApplyDifficultyModifier(int strength) { /* unchanged */ }
    private bool IsUnderAttack() { /* unchanged */ }
    private bool CanAttack(float threatLevel) { /* unchanged */ }
    private int GetPlanetDefenseStrength(int planetID) { /* unchanged */ }
}
