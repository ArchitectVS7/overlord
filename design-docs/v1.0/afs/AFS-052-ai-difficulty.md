# AFS-052: AI Difficulty System

**Status:** Draft
**Priority:** P1 (High)
**Owner:** Lead Developer
**PRD Reference:** FR-AI-003

---

## Summary

AI difficulty system implementing three difficulty levels (Easy, Normal, Hard) with scaling bonuses/penalties to AI income, production, construction time, and military strength, providing progressive challenge for players while maintaining fair and engaging gameplay.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Game settings and AI faction data
- **AFS-022 (Income System)**: Income modifiers
- **AFS-051 (AI Decision System)**: AI strategic behavior
- **AFS-041 (Combat System)**: Combat strength modifiers

---

## Requirements

### Difficulty Levels

1. **Easy Mode** (Beginner-Friendly)
   - **Target Audience**: New players learning mechanics
   - **AI Behavior**: Less aggressive, slower expansion
   - **Challenge Level**: Player has significant advantage
   - **Victory Time**: 30-40 turns for experienced players

2. **Normal Mode** (Balanced)
   - **Target Audience**: Standard gameplay experience
   - **AI Behavior**: Competent, balanced aggression
   - **Challenge Level**: Even match for skilled players
   - **Victory Time**: 40-60 turns for experienced players

3. **Hard Mode** (Expert Challenge)
   - **Target Audience**: Veteran players seeking challenge
   - **AI Behavior**: Aggressive, optimal decision-making
   - **Challenge Level**: Requires strategic mastery
   - **Victory Time**: 60+ turns, frequent player defeats

### Difficulty Modifiers

1. **Income Bonuses** (Credits, Minerals, Fuel, Food)
   - **Easy**: AI receives **-20%** income penalty (80% of normal)
   - **Normal**: AI receives **0%** modifier (100% baseline)
   - **Hard**: AI receives **+40%** income bonus (140% of normal)
   - **Application**: Applied during Income Phase (AFS-022)
   - **Example**: Mining Station produces 50 Minerals/turn
     - Easy AI: 50 × 0.8 = **40 Minerals/turn**
     - Normal AI: 50 × 1.0 = **50 Minerals/turn**
     - Hard AI: 50 × 1.4 = **70 Minerals/turn**

2. **Construction Speed** (Buildings, Craft, Platoons)
   - **Easy**: AI construction takes **+50%** longer (1.5x time)
   - **Normal**: AI construction takes **normal time** (1.0x)
   - **Hard**: AI construction takes **-25%** less time (0.75x)
   - **Application**: Applied to TurnsRemaining during construction
   - **Example**: Battle Cruiser (8 turns)
     - Easy AI: 8 × 1.5 = **12 turns**
     - Normal AI: 8 × 1.0 = **8 turns**
     - Hard AI: 8 × 0.75 = **6 turns**

3. **Military Strength** (Combat Power)
   - **Easy**: AI platoons/craft receive **-15%** strength penalty
   - **Normal**: AI receives **0%** modifier (baseline)
   - **Hard**: AI platoons/craft receive **+20%** strength bonus
   - **Application**: Applied during combat resolution (AFS-041, AFS-042)
   - **Example**: AI platoon with 150 base strength
     - Easy AI: 150 × 0.85 = **127 strength**
     - Normal AI: 150 × 1.0 = **150 strength**
     - Hard AI: 150 × 1.2 = **180 strength**

4. **Starting Resources** (Initial Advantage)
   - **Easy**: AI starts with **50%** of player's starting resources
   - **Normal**: AI starts with **100%** of player's starting resources
   - **Hard**: AI starts with **150%** of player's starting resources
   - **Application**: Applied during game initialization (AFS-001)
   - **Example**: Player starts with 10,000 Credits
     - Easy AI: **5,000 Credits**
     - Normal AI: **10,000 Credits**
     - Hard AI: **15,000 Credits**

### Behavioral Adjustments

1. **Easy AI Behavior**
   - **Aggression**: Defensive stance, rarely attacks
   - **Expansion**: Slow colony development
   - **Decision Speed**: Longer delays before major actions
   - **Mistakes**: Occasionally makes suboptimal choices (10% chance)
   - **Target Priority**: Focuses on economy over military

2. **Normal AI Behavior**
   - **Aggression**: Balanced, attacks when advantage exists
   - **Expansion**: Steady colony development
   - **Decision Speed**: Normal strategic timing
   - **Mistakes**: Minimal suboptimal choices (2% chance)
   - **Target Priority**: Balanced economy and military

3. **Hard AI Behavior**
   - **Aggression**: Highly aggressive, exploits weaknesses
   - **Expansion**: Rapid colony development
   - **Decision Speed**: Immediate optimal responses
   - **Mistakes**: Never makes suboptimal choices (0% chance)
   - **Target Priority**: Military dominance, early rushes

### Dynamic Difficulty (Future Feature)

1. **Adaptive Difficulty** (Not MVP)
   - **Concept**: AI adjusts difficulty based on player performance
   - **Trigger**: If player winning easily (3+ planets ahead), AI gets bonus
   - **Trigger**: If player struggling (2+ planets behind), AI gets penalty
   - **Implementation**: Post-MVP feature

2. **Mid-Game Difficulty Change** (Not MVP)
   - **Concept**: Player can change difficulty mid-game
   - **Restriction**: Can only lower difficulty, not raise (prevent exploits)
   - **Implementation**: Post-MVP feature

### Difficulty Display

1. **Difficulty Selection** (New Game Screen)
   - **UI Element**: Dropdown menu with 3 options
   - **Labels**: "Easy", "Normal", "Hard"
   - **Description**: Show modifier summary
     - Easy: "AI receives -20% income, +50% construction time, -15% strength"
     - Normal: "Balanced AI with no modifiers"
     - Hard: "AI receives +40% income, -25% construction time, +20% strength"
   - **Default**: Normal (pre-selected)

2. **In-Game Indicator**
   - **Location**: Top-right HUD corner
   - **Display**: Small icon with difficulty badge ("E", "N", "H")
   - **Tooltip**: Hover shows full modifier breakdown
   - **Persistent**: Visible at all times for player reference

---

## Acceptance Criteria

### Functional Criteria

- [ ] Three difficulty levels (Easy, Normal, Hard) selectable at game start
- [ ] Income modifiers apply correctly (-20%, 0%, +40%)
- [ ] Construction time modifiers apply correctly (+50%, 0%, -25%)
- [ ] Military strength modifiers apply correctly (-15%, 0%, +20%)
- [ ] Starting resources scale correctly (50%, 100%, 150%)
- [ ] AI behavior adapts per difficulty (aggression, expansion)
- [ ] Difficulty persists across save/load
- [ ] Difficulty displayed in HUD during gameplay

### Performance Criteria

- [ ] Modifier calculations execute in <1ms (negligible overhead)
- [ ] Difficulty change at game start completes in <50ms
- [ ] No performance impact on combat or income phases

### Integration Criteria

- [ ] Integrates with Game State Manager (AFS-001) for settings storage
- [ ] Modifies Income System (AFS-022) for AI income bonuses
- [ ] Modifies Combat System (AFS-041) for strength modifiers
- [ ] Affects AI Decision System (AFS-051) for behavior tuning
- [ ] Saves difficulty setting with game state (AFS-003)

---

## Technical Notes

### Implementation Approach

```csharp
public enum DifficultyLevel
{
    Easy,
    Normal,
    Hard
}

public class DifficultySystem : MonoBehaviour
{
    private static DifficultySystem _instance;
    public static DifficultySystem Instance => _instance;

    public DifficultyLevel CurrentDifficulty { get; private set; } = DifficultyLevel.Normal;

    public event Action<DifficultyLevel> OnDifficultyChanged;

    // Set difficulty (game start only)
    public void SetDifficulty(DifficultyLevel difficulty)
    {
        CurrentDifficulty = difficulty;
        OnDifficultyChanged?.Invoke(difficulty);
        Debug.Log($"Difficulty set to: {difficulty}");
    }

    // Get income modifier for AI
    public float GetIncomeModifier()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy: return 0.8f;   // -20%
            case DifficultyLevel.Normal: return 1.0f; // 0%
            case DifficultyLevel.Hard: return 1.4f;   // +40%
            default: return 1.0f;
        }
    }

    // Get construction time modifier for AI
    public float GetConstructionTimeModifier()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy: return 1.5f;   // +50% slower
            case DifficultyLevel.Normal: return 1.0f; // Normal
            case DifficultyLevel.Hard: return 0.75f;  // -25% faster
            default: return 1.0f;
        }
    }

    // Get military strength modifier for AI
    public float GetStrengthModifier()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy: return 0.85f;  // -15%
            case DifficultyLevel.Normal: return 1.0f; // 0%
            case DifficultyLevel.Hard: return 1.2f;   // +20%
            default: return 1.0f;
        }
    }

    // Get starting resources modifier for AI
    public float GetStartingResourceModifier()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy: return 0.5f;   // 50%
            case DifficultyLevel.Normal: return 1.0f; // 100%
            case DifficultyLevel.Hard: return 1.5f;   // 150%
            default: return 1.0f;
        }
    }

    // Get aggression level (for AI behavior)
    public float GetAggressionLevel()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy: return 0.5f;   // Defensive
            case DifficultyLevel.Normal: return 1.0f; // Balanced
            case DifficultyLevel.Hard: return 1.5f;   // Aggressive
            default: return 1.0f;
        }
    }

    // Get mistake chance (AI suboptimal decisions)
    public float GetMistakeChance()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy: return 0.1f;   // 10% chance
            case DifficultyLevel.Normal: return 0.02f; // 2% chance
            case DifficultyLevel.Hard: return 0.0f;   // 0% chance (perfect play)
            default: return 0.02f;
        }
    }

    // Get difficulty description for UI
    public string GetDifficultyDescription()
    {
        switch (CurrentDifficulty)
        {
            case DifficultyLevel.Easy:
                return "AI receives -20% income, +50% construction time, -15% strength";
            case DifficultyLevel.Normal:
                return "Balanced AI with no modifiers";
            case DifficultyLevel.Hard:
                return "AI receives +40% income, -25% construction time, +20% strength";
            default:
                return "Unknown difficulty";
        }
    }
}
```

### Modifier Application Examples

**Example 1: AI Income (Mining Station on Volcanic Planet)**
- Base Production: 50 Minerals × 5.0 (Volcanic) = 250 Minerals/turn
- Easy AI: 250 × 0.8 = **200 Minerals/turn**
- Normal AI: 250 × 1.0 = **250 Minerals/turn**
- Hard AI: 250 × 1.4 = **350 Minerals/turn**

**Example 2: AI Construction (Battle Cruiser)**
- Base Time: 8 turns
- Easy AI: 8 × 1.5 = **12 turns**
- Normal AI: 8 × 1.0 = **8 turns**
- Hard AI: 8 × 0.75 = **6 turns**

**Example 3: AI Military Strength (Elite Platoon)**
- Base Strength: 200 troops × 2.5 (Elite) × 1.6 (Plasma) × 1.0 (100% trained) = 800
- Easy AI: 800 × 0.85 = **680 strength**
- Normal AI: 800 × 1.0 = **800 strength**
- Hard AI: 800 × 1.2 = **960 strength**

### Difficulty Balance Table

| Modifier | Easy | Normal | Hard |
|----------|------|--------|------|
| AI Income | -20% | 0% | +40% |
| AI Construction Time | +50% | 0% | -25% |
| AI Strength | -15% | 0% | +20% |
| AI Starting Resources | 50% | 100% | 150% |
| AI Aggression | 0.5x | 1.0x | 1.5x |
| AI Mistake Chance | 10% | 2% | 0% |

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Difficulty setting storage

### Depended On By
- **AFS-022 (Income System)**: Income modifier application
- **AFS-041 (Combat System)**: Strength modifier application
- **AFS-051 (AI Decision System)**: Behavioral adjustments
- **AFS-061 (Building System)**: Construction time modifiers
- **AFS-032 (Craft System)**: Craft construction time modifiers

### Events Published
- `OnDifficultyChanged(DifficultyLevel difficulty)`: Difficulty level set/changed

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
