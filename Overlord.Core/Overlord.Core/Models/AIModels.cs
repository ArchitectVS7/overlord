namespace Overlord.Core.Models;

/// <summary>
/// AI personality archetypes that influence decision-making.
/// </summary>
public enum AIPersonality
{
    /// <summary>
    /// Aggressive warmonger - prioritizes military over economy, attacks early.
    /// Commander Kratos.
    /// </summary>
    Aggressive,

    /// <summary>
    /// Defensive turtle - prioritizes defense, rarely attacks, strong late-game.
    /// Overseer Aegis.
    /// </summary>
    Defensive,

    /// <summary>
    /// Economic expansionist - prioritizes resource production, weak early-game.
    /// Magistrate Midas.
    /// </summary>
    Economic,

    /// <summary>
    /// Balanced tactical - adapts to player actions, no extreme tendencies.
    /// General Nexus.
    /// </summary>
    Balanced
}

/// <summary>
/// AI difficulty levels that apply bonuses/penalties.
/// </summary>
public enum AIDifficulty
{
    /// <summary>
    /// Easy: -20% resource production, -20% military strength, cautious aggression.
    /// </summary>
    Easy,

    /// <summary>
    /// Normal: No bonuses/penalties, balanced aggression.
    /// </summary>
    Normal,

    /// <summary>
    /// Hard: +20% resource production, +20% military strength, aggressive expansion.
    /// </summary>
    Hard
}

/// <summary>
/// AI personality configuration with modifiers.
/// </summary>
public class AIPersonalityConfig
{
    public AIPersonality Personality { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Quote { get; set; } = string.Empty;

    /// <summary>
    /// Aggression modifier: +0.5 = more aggressive, -0.5 = more defensive.
    /// </summary>
    public float AggressionModifier { get; set; }

    /// <summary>
    /// Economic modifier: +0.5 = prioritize economy, -0.3 = deprioritize economy.
    /// </summary>
    public float EconomicModifier { get; set; }

    /// <summary>
    /// Defense modifier: +0.4 = prioritize defense, 0 = normal.
    /// </summary>
    public float DefenseModifier { get; set; }

    /// <summary>
    /// Gets personality configuration for a given type.
    /// </summary>
    public static AIPersonalityConfig GetConfig(AIPersonality personality)
    {
        return personality switch
        {
            AIPersonality.Aggressive => new AIPersonalityConfig
            {
                Personality = AIPersonality.Aggressive,
                Name = "Commander Kratos",
                Quote = "Strength through conquest! Your planets will fall.",
                AggressionModifier = 0.5f,
                EconomicModifier = -0.3f,
                DefenseModifier = 0.0f
            },
            AIPersonality.Defensive => new AIPersonalityConfig
            {
                Personality = AIPersonality.Defensive,
                Name = "Overseer Aegis",
                Quote = "Patience is the strongest fortress. I can wait.",
                AggressionModifier = -0.5f,
                EconomicModifier = 0.0f,
                DefenseModifier = 0.4f
            },
            AIPersonality.Economic => new AIPersonalityConfig
            {
                Personality = AIPersonality.Economic,
                Name = "Magistrate Midas",
                Quote = "Credits are power. My wealth will crush you.",
                AggressionModifier = -0.3f,
                EconomicModifier = 0.5f,
                DefenseModifier = 0.0f
            },
            AIPersonality.Balanced => new AIPersonalityConfig
            {
                Personality = AIPersonality.Balanced,
                Name = "General Nexus",
                Quote = "Strategy, not emotion, wins wars.",
                AggressionModifier = 0.0f,
                EconomicModifier = 0.0f,
                DefenseModifier = 0.0f
            },
            _ => throw new ArgumentException($"Unknown personality: {personality}")
        };
    }
}

/// <summary>
/// AI game state assessment result.
/// </summary>
public class AIAssessment
{
    /// <summary>
    /// Threat level: Player military strength ÷ AI military strength.
    /// <![CDATA[< 0.5 = AI dominant, > 1.5 = Player dominant]]>
    /// </summary>
    public float ThreatLevel { get; set; }

    /// <summary>
    /// Economic strength ratio: AI resources ÷ Player resources.
    /// </summary>
    public float EconomicStrength { get; set; }

    /// <summary>
    /// Number of AI-owned planets.
    /// </summary>
    public int AIPlanets { get; set; }

    /// <summary>
    /// Number of player-owned planets.
    /// </summary>
    public int PlayerPlanets { get; set; }

    /// <summary>
    /// True if player has fleet at AI planet (under attack).
    /// </summary>
    public bool UnderAttack { get; set; }

    /// <summary>
    /// True if AI has military advantage and can attack.
    /// </summary>
    public bool CanAttack { get; set; }
}
