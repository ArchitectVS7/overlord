# AFS-075: Tutorial System

**Status:** New (Post Design Review)
**Priority:** P2 (Medium)
**Owner:** UI/UX Engineer
**PRD Reference:** FR-UI-001 (Tutorial system for newcomers)
**Design Review:** Added per design review recommendation for player satisfaction

---

## Summary

Interactive tutorial system that guides new players through core game mechanics, provides contextual tooltips, implements a guided first-time experience for the first 5 turns, and offers help system accessible throughout gameplay.

---

## Dependencies

- **AFS-071 (UI State Machine)**: Integrates tutorial overlays into UI flow
- **AFS-072 (HUD System)**: Displays tutorial hints and progress indicators
- **AFS-074 (Notification System)**: Shows tutorial messages and tips
- **AFS-002 (Turn System)**: Triggers turn-based tutorial steps

---

## Requirements

### First-Time Experience (FTE)

1. **Welcome Screen**
   - Displays on first game launch
   - Brief overview of game concept (4X strategy, AI opponent, galactic conquest)
   - Options: "Start Tutorial" or "Skip Tutorial"
   - Skipping tutorial still shows basic tooltips

2. **Tutorial Mode (Guided First 5 Turns)**
   - **Turn 1: Introduction**
     - Explains galaxy map, player's home planet, resources
     - Highlights HUD elements (Credits, Minerals, Fuel, Food, Energy)
     - Prompts: "Click on your home planet to see details"

   - **Turn 2: Resource Management**
     - Explains income and production
     - Guides player to adjust tax rate
     - Demonstrates how resources are consumed/produced
     - Prompts: "Try changing the tax rate slider"

   - **Turn 3: Building Construction**
     - Explains building construction mechanics
     - Guides player to build first structure (Docking Bay)
     - Shows construction timer and turn-based progress
     - Prompts: "Build a Docking Bay to produce Battle Cruisers"

   - **Turn 4: Military Production**
     - Explains craft purchase and entity limits (32 craft max)
     - Guides player to purchase first Battle Cruiser
     - Shows craft statistics and orbital defense bonus
     - Prompts: "Purchase a Battle Cruiser to defend your planet"

   - **Turn 5: Combat Basics**
     - Explains space combat mechanics (strength-based resolution)
     - Shows AI opponent's actions (if AI builds military)
     - Explains bombardment and invasion systems
     - Prompts: "End turn and see how the AI responds"

3. **Tutorial Completion**
   - Congratulations message: "Tutorial Complete! You're ready to conquer the galaxy."
   - Unlocks "Tutorial Completed" achievement (if achievements system exists)
   - Option to replay tutorial from main menu

### Contextual Tooltips

1. **HUD Element Tooltips**
   - **Credits**: "Credits: Purchase craft, buildings, and upgrades"
   - **Minerals**: "Minerals: Required for building construction"
   - **Fuel**: "Fuel: Consumed by Battle Cruisers and Cargo Cruisers"
   - **Food**: "Food: Required for population growth"
   - **Energy**: "Energy: Powers orbital defenses and satellites"
   - **Turn Number**: "Current turn. End turn to advance time."

2. **Building Tooltips**
   - **Docking Bay**: "Docking Bay: Enables Battle Cruiser and Cargo Cruiser production"
   - **Mining Station**: "Mining Station: +40% mineral production"
   - **Horticultural Station**: "Horticultural Station: +40% food production"
   - **Orbital Defense**: "Orbital Defense Platform: +20% defense strength in space combat"

3. **Craft Tooltips**
   - **Battle Cruiser**: "Battle Cruiser: Strength 100, Can bombard planets, Carries platoons for invasion"
   - **Cargo Cruiser**: "Cargo Cruiser: Transports resources and populations between planets"
   - **Solar Satellite**: "Solar Satellite: Generates +20 Energy per turn"
   - **Atmosphere Processor**: "Atmosphere Processor: Increases maximum population capacity"

4. **Platoon Tooltips**
   - **Ground Combat**: "Platoons fight ground battles during planetary invasions"
   - **Equipment**: "Equipment modifier: +X% combat effectiveness"
   - **Weapons**: "Weapons modifier: +Y% combat effectiveness"

### Help System

1. **In-Game Help Menu**
   - Accessible via "?" button in HUD or F1 hotkey
   - Categories:
     - **Getting Started**: Tutorial summary, basic controls
     - **Resources & Economy**: Income, production, taxation
     - **Buildings**: All building types, costs, benefits
     - **Military**: Craft types, platoons, combat mechanics
     - **Combat**: Space combat, bombardment, invasion rules
     - **AI Difficulty**: Easy, Normal, Hard modifier explanations
     - **Victory Conditions**: How to win the game

2. **Searchable Help Database**
   - Search bar for keywords (e.g., "bombardment", "tax rate")
   - Quick links to related topics
   - Example queries: "How do I invade a planet?", "What do platoons do?"

3. **Glossary**
   - Alphabetical list of game terms
   - Definitions with cross-references
   - Examples: "Orbital Defense", "Income Phase", "Entity Limit"

### Progressive Hints

1. **Contextual Hints (After Tutorial)**
   - **First Combat**: "Tip: Battle Cruisers get +20% strength when defending their orbital space"
   - **First Bombardment**: "Tip: Bombardment destroys 1-3 structures but causes civilian casualties"
   - **First Invasion**: "Tip: You need platoons aboard Battle Cruisers to invade planets"
   - **Resource Shortage**: "Warning: You are running low on [Resource]. Build more [Building] or adjust tax rate."
   - **Entity Limit Reached**: "Warning: You have reached the maximum of 32 craft. Destroy old craft or upgrade existing ones."

2. **Hint Frequency**
   - Each hint shown only once per playthrough
   - Can be disabled in Settings ("Show Hints: On/Off")
   - Hints dismissed with "X" button or "Got It" button

### Tutorial Replay

1. **Main Menu Option**
   - "Replay Tutorial" button in main menu
   - Resets tutorial progress flag
   - Starts new tutorial game (separate from main save)

2. **Settings Option**
   - "Reset Tutorial Progress" in Settings menu
   - Next new game will trigger tutorial mode

---

## Acceptance Criteria

### Functional Criteria

- [ ] Welcome screen displays on first game launch
- [ ] Tutorial mode guides player through first 5 turns
- [ ] Each tutorial turn has clear objectives and prompts
- [ ] Contextual tooltips appear on hover/tap for all HUD elements
- [ ] Building, craft, and platoon tooltips show relevant stats
- [ ] Help menu accessible via "?" button or F1 hotkey
- [ ] Help menu searchable with keyword queries
- [ ] Progressive hints appear at appropriate moments
- [ ] Hints can be disabled in Settings
- [ ] Tutorial can be replayed from main menu

### UX Criteria

- [ ] Tutorial does not feel overwhelming or too lengthy (5 turns max)
- [ ] Tooltips are concise and informative (<50 words)
- [ ] Help menu well-organized and easy to navigate
- [ ] Tutorial skippable at any point (with confirmation dialog)
- [ ] Hints visually distinct from other notifications

### Integration Criteria

- [ ] Integrates with UI State Machine (AFS-071) for overlay management
- [ ] Uses Notification System (AFS-074) for tutorial messages
- [ ] Pauses game flow during tutorial prompts
- [ ] Saves tutorial completion status via Settings Manager (AFS-004)

---

## Technical Notes

### Implementation Approach

```csharp
using UnityEngine;
using System.Collections.Generic;

public class TutorialSystem : MonoBehaviour
{
    private static TutorialSystem _instance;
    public static TutorialSystem Instance => _instance;

    [Header("Tutorial Configuration")]
    public bool TutorialEnabled = true;
    public bool ShowHints = true;

    private int _currentTutorialStep = 0;
    private HashSet<string> _shownHints = new HashSet<string>();

    private void Awake()
    {
        _instance = this;

        // Check if tutorial should run (first-time player)
        if (SettingsManager.Instance.IsFirstLaunch())
        {
            ShowWelcomeScreen();
        }
    }

    private void ShowWelcomeScreen()
    {
        UIManager.Instance.ShowModal(
            title: "Welcome to Overlord!",
            message: "Conquer the galaxy in this turn-based 4X strategy game. Would you like to play the tutorial?",
            buttons: new[] {
                ("Start Tutorial", () => StartTutorial()),
                ("Skip Tutorial", () => SkipTutorial())
            }
        );
    }

    public void StartTutorial()
    {
        TutorialEnabled = true;
        _currentTutorialStep = 0;
        GameStateManager.Instance.StartNewGame(tutorialMode: true);
        ShowTutorialStep(0);
    }

    public void SkipTutorial()
    {
        TutorialEnabled = false;
        SettingsManager.Instance.SetTutorialCompleted();
        GameStateManager.Instance.StartNewGame(tutorialMode: false);
    }

    private void ShowTutorialStep(int stepIndex)
    {
        switch (stepIndex)
        {
            case 0: // Turn 1: Introduction
                ShowTutorialMessage(
                    "Turn 1: Introduction",
                    "Welcome to the galaxy! You control a single home planet. Your goal is to expand your empire and defeat the AI opponent.\\n\\nLet's start by exploring the galaxy map. Click on your home planet to see its details.",
                    onConfirm: () => HighlightHomePlanet()
                );
                break;

            case 1: // Turn 2: Resource Management
                ShowTutorialMessage(
                    "Turn 2: Resource Management",
                    "Resources are the key to your empire's success. You have 5 resources: Credits, Minerals, Fuel, Food, and Energy.\\n\\nTry changing the tax rate slider to see how it affects your income and morale.",
                    onConfirm: () => HighlightTaxRateSlider()
                );
                break;

            case 2: // Turn 3: Building Construction
                ShowTutorialMessage(
                    "Turn 3: Building Construction",
                    "Buildings provide production bonuses and unlock new capabilities. Let's build your first Docking Bay, which allows you to produce Battle Cruisers.\\n\\nClick the 'Build' button and select 'Docking Bay'.",
                    onConfirm: () => HighlightBuildButton()
                );
                break;

            case 3: // Turn 4: Military Production
                ShowTutorialMessage(
                    "Turn 4: Military Production",
                    "Now that you have a Docking Bay, you can produce Battle Cruisers. These powerful warships defend your planets and attack enemy targets.\\n\\nPurchase your first Battle Cruiser from the craft menu.",
                    onConfirm: () => HighlightCraftMenu()
                );
                break;

            case 4: // Turn 5: Combat Basics
                ShowTutorialMessage(
                    "Turn 5: Combat Basics",
                    "Combat in Overlord is strength-based. Battle Cruisers have 100 strength each, and weapon upgrades increase this value.\\n\\nEnd your turn to see how the AI responds. If combat occurs, you'll see the battle results.",
                    onConfirm: () => HighlightEndTurnButton()
                );
                break;

            case 5: // Tutorial Complete
                ShowTutorialMessage(
                    "Tutorial Complete!",
                    "Congratulations! You've learned the basics of Overlord. You're now ready to conquer the galaxy on your own.\\n\\nGood luck, Commander!",
                    onConfirm: () => CompleteTutorial()
                );
                break;
        }
    }

    private void ShowTutorialMessage(string title, string message, System.Action onConfirm)
    {
        UIManager.Instance.ShowModal(
            title: title,
            message: message,
            buttons: new[] {
                ("Next", onConfirm),
                ("Skip Tutorial", () => SkipTutorial())
            }
        );
    }

    public void AdvanceTutorialStep()
    {
        if (!TutorialEnabled) return;

        _currentTutorialStep++;
        ShowTutorialStep(_currentTutorialStep);
    }

    private void CompleteTutorial()
    {
        TutorialEnabled = false;
        SettingsManager.Instance.SetTutorialCompleted();
        NotificationSystem.Instance.ShowToast("Tutorial completed! You can replay it from the main menu.", NotificationType.Success);
    }

    public void ShowHint(string hintId, string message)
    {
        if (!ShowHints || _shownHints.Contains(hintId)) return;

        _shownHints.Add(hintId);
        NotificationSystem.Instance.ShowToast(message, NotificationType.Info);
    }

    public void ShowTooltip(string content)
    {
        UIManager.Instance.ShowTooltip(content);
    }

    public void HideTooltip()
    {
        UIManager.Instance.HideTooltip();
    }
}
```

### Tooltip Component

```csharp
using UnityEngine;
using UnityEngine.EventSystems;

public class TooltipTrigger : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
{
    [TextArea(3, 10)]
    public string tooltipText;

    public void OnPointerEnter(PointerEventData eventData)
    {
        TutorialSystem.Instance.ShowTooltip(tooltipText);
    }

    public void OnPointerExit(PointerEventData eventData)
    {
        TutorialSystem.Instance.HideTooltip();
    }
}
```

### Help Menu Data Structure

```csharp
[System.Serializable]
public class HelpTopic
{
    public string Title;
    public string Category;
    [TextArea(5, 20)]
    public string Content;
    public string[] Keywords; // For search functionality
    public string[] RelatedTopics; // Cross-references
}

public class HelpDatabase : ScriptableObject
{
    public List<HelpTopic> Topics = new List<HelpTopic>();

    public List<HelpTopic> Search(string query)
    {
        query = query.ToLower();
        return Topics.FindAll(topic =>
            topic.Title.ToLower().Contains(query) ||
            topic.Content.ToLower().Contains(query) ||
            topic.Keywords.Any(k => k.ToLower().Contains(query))
        );
    }
}
```

---

## Integration Points

### Depends On
- **AFS-071 (UI State Machine)**: Tutorial overlay UI management
- **AFS-072 (HUD System)**: Tooltip display
- **AFS-074 (Notification System)**: Tutorial messages and hints
- **AFS-002 (Turn System)**: Turn-based tutorial progression
- **AFS-004 (Settings Manager)**: Tutorial completion status

### Depended On By
- None (optional enhancement system)

### Events Published
- `OnTutorialStarted()`: Tutorial mode begins
- `OnTutorialStepAdvanced(int stepIndex)`: Tutorial progresses to next step
- `OnTutorialCompleted()`: Tutorial finished
- `OnHintShown(string hintId)`: Progressive hint displayed
- `OnTooltipShown(string content)`: Tooltip appears
- `OnTooltipHidden()`: Tooltip disappears

---

**Last Updated:** December 6, 2025
**Review Status:** Approved (Post Design Review)
