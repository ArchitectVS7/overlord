# AFS-072: HUD System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-002

---

## Summary

Heads-Up Display (HUD) system implementing persistent on-screen information overlay showing resource stockpiles (Credits, Minerals, Fuel, Food, Energy), income rates, current turn number, game date, and quick-access buttons for menu navigation and turn progression.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Game data queries
- **AFS-021 (Resource System)**: Resource stockpiles and income
- **AFS-002 (Turn System)**: Turn number and phase
- **AFS-071 (UI State Machine)**: HUD visibility control

---

## Requirements

### HUD Layout

1. **Top Bar** (Full Width)
   - **Left Section**: Resource stockpiles (Credits, Minerals, Fuel, Food, Energy)
   - **Center Section**: Turn number and game date
   - **Right Section**: Quick-access buttons (Menu, Settings, End Turn)
   - **Background**: Semi-transparent dark panel (80% opacity)
   - **Height**: 60 pixels (fixed)

2. **Resource Display** (Top-Left)
   - **Format**: Icon + Value + Income Rate
   - **Example**: `💰 15,000 (+2,500/turn)`
   - **Colors**:
     - Green: Positive income (+)
     - Red: Negative income (-)
     - White: Zero income
   - **Tooltip**: Hover shows breakdown (production - consumption)
   - **Spacing**: 10px between resources

3. **Turn Info** (Top-Center)
   - **Turn Number**: "Turn 12"
   - **Game Date**: "Stardate 2247.3" (calculated from turn)
   - **Current Phase**: "Income Phase" / "Action Phase" / "Combat Phase" / "End Phase"
   - **Font**: Large, bold (18pt)
   - **Visibility**: Always visible during gameplay

4. **Quick-Access Buttons** (Top-Right)
   - **Menu Button**: Opens Pause Menu (⚙️ icon)
   - **Settings Button**: Opens Settings panel (🔧 icon)
   - **End Turn Button**: Advances to next turn ("End Turn" text, large)
   - **Disabled State**: End Turn grayed out during AI turn
   - **Hotkey**: Space bar = End Turn (when enabled)

### Resource Indicators

1. **Credits** (💰 Currency)
   - **Icon**: Gold coin symbol
   - **Display**: `💰 15,000 (+2,500/turn)`
   - **Tooltip**: "Credits: 15,000 | Income: +2,500/turn (Tax: 1,500 + Production: 1,000)"
   - **Warning**: Red flash when Credits < 1,000 (low funds)

2. **Minerals** (⛏️ Raw Materials)
   - **Icon**: Gray rock/crystal symbol
   - **Display**: `⛏️ 3,500 (+250/turn)`
   - **Tooltip**: "Minerals: 3,500 | Production: +250/turn (2 Mining Stations)"
   - **Warning**: Red flash when Minerals < 500

3. **Fuel** (⚡ Energy Source)
   - **Icon**: Lightning bolt symbol
   - **Display**: `⚡ 1,200 (+150/turn)`
   - **Tooltip**: "Fuel: 1,200 | Production: +150/turn (2 Mining Stations)"
   - **Warning**: Red flash when Fuel < 200

4. **Food** (🌾 Population Sustenance)
   - **Icon**: Wheat/grain symbol
   - **Display**: `🌾 800 (-50/turn)`
   - **Tooltip**: "Food: 800 | Production: 100/turn | Consumption: -150/turn (500 pop)"
   - **Warning**: Red flash when Food < 100 (starvation risk)

5. **Energy** (🔋 Power)
   - **Icon**: Battery/power symbol
   - **Display**: `🔋 500 (+100/turn)`
   - **Tooltip**: "Energy: 500 | Production: +100/turn (Solar Satellites)"
   - **Warning**: Red flash when Energy < 50

### Turn Progression UI

1. **End Turn Button**
   - **Label**: "End Turn" (large text)
   - **Icon**: Forward arrow (►)
   - **State - Enabled**: Bright green background, clickable
   - **State - Disabled**: Gray background, not clickable (AI turn)
   - **State - Hover**: Glow effect, cursor changes to pointer
   - **Animation**: Pulse effect when player can end turn (attention-grabber)

2. **Turn Phase Indicator**
   - **Display**: Small text below turn number
   - **Phases**:
     - "Income Phase" (green)
     - "Action Phase" (yellow)
     - "Combat Phase" (red)
     - "End Phase" (blue)
   - **Animation**: Fade transition between phases (500ms)

3. **Turn Counter**
   - **Format**: "Turn X" (e.g., "Turn 12")
   - **Increment**: Increments at start of each turn
   - **Victory Condition**: Displays "FINAL TURN" on last turn (if time limit)
   - **Font**: Bold, large (20pt)

### HUD Visibility

1. **Always Visible**
   - **Screens**: Galaxy View, Planet Management, Combat Resolution
   - **Hidden**: Main Menu, End Game screen
   - **Reason**: Core gameplay information must persist

2. **Auto-Hide** (Optional Setting)
   - **Setting**: "Auto-hide HUD" (default: OFF)
   - **Trigger**: Mouse inactivity for 5 seconds
   - **Reveal**: Mouse movement or keyboard input
   - **Purpose**: Cinematic screenshot mode

3. **Compact Mode** (Mobile)
   - **Trigger**: Screen width < 768px (mobile/tablet)
   - **Changes**: Smaller icons, abbreviated text ("15K" instead of "15,000")
   - **Layout**: Single row, condensed spacing
   - **Purpose**: Fit HUD on smaller screens

### Warning States

1. **Low Resource Warnings**
   - **Trigger**: Resource falls below threshold
   - **Animation**: Red flash (3 times), then steady red glow
   - **Sound**: Warning beep (optional, muted by default)
   - **Example**: Food < 100 → "⚠️ LOW FOOD" tooltip

2. **Negative Income**
   - **Display**: Income value in red with minus sign (e.g., `💰 -500/turn`)
   - **Tooltip**: "Warning: Spending more than earning! Deficit: -500/turn"
   - **Strategic**: Player must reduce expenses or increase income

3. **Deficit Mode** (Resources Depleting)
   - **Trigger**: Stockpile decreasing each turn (negative income)
   - **Display**: Countdown to zero (e.g., "💰 2,000 (4 turns until bankrupt)")
   - **Warning**: Flash red when < 3 turns remaining
   - **Critical**: Display modal when any resource hits zero

---

## Acceptance Criteria

### Functional Criteria

- [ ] HUD displays all 5 resources (Credits, Minerals, Fuel, Food, Energy)
- [ ] Income rates shown correctly (+/- values, color-coded)
- [ ] Turn number and game date displayed
- [ ] End Turn button functional (advances turn)
- [ ] End Turn disabled during AI turn
- [ ] Resource tooltips show production breakdown
- [ ] Low resource warnings flash red
- [ ] HUD hidden on Main Menu and End Game screens
- [ ] HUD visible on Galaxy View and Planet Management
- [ ] Quick-access buttons (Menu, Settings) functional

### Performance Criteria

- [ ] HUD updates in <5ms per frame (60 FPS maintained)
- [ ] No memory allocation during HUD updates (pre-allocated strings)
- [ ] Tooltip rendering completes in <2ms

### Integration Criteria

- [ ] Integrates with Resource System (AFS-021) for stockpile data
- [ ] Uses Turn System (AFS-002) for turn number and phase
- [ ] Controlled by UI State Machine (AFS-071) for visibility
- [ ] Updates via Game State Manager (AFS-001) events
- [ ] Triggers End Turn via Turn System (AFS-002)

---

## Technical Notes

### Implementation Approach

```csharp
public class HUDSystem : MonoBehaviour
{
    private static HUDSystem _instance;
    public static HUDSystem Instance => _instance;

    [Header("Resource Display")]
    public TextMeshProUGUI creditsText;
    public TextMeshProUGUI mineralsText;
    public TextMeshProUGUI fuelText;
    public TextMeshProUGUI foodText;
    public TextMeshProUGUI energyText;

    [Header("Turn Info")]
    public TextMeshProUGUI turnNumberText;
    public TextMeshProUGUI gameDateText;
    public TextMeshProUGUI phaseText;

    [Header("Buttons")]
    public Button endTurnButton;
    public Button menuButton;
    public Button settingsButton;

    private void Awake()
    {
        _instance = this;
    }

    private void Start()
    {
        // Subscribe to events
        ResourceSystem.Instance.OnResourcesChanged += UpdateResourceDisplay;
        TurnSystem.Instance.OnTurnStarted += UpdateTurnDisplay;
        TurnSystem.Instance.OnPhaseChanged += UpdatePhaseDisplay;

        // Button listeners
        endTurnButton.onClick.AddListener(OnEndTurnClicked);
        menuButton.onClick.AddListener(OnMenuClicked);
        settingsButton.onClick.AddListener(OnSettingsClicked);

        // Initial update
        UpdateAllDisplays();
    }

    // Update resource display (called each time resources change)
    private void UpdateResourceDisplay()
    {
        var player = GameStateManager.Instance.GetPlayerFaction();

        // Credits
        int credits = ResourceSystem.Instance.GetCredits(player);
        int creditsIncome = ResourceSystem.Instance.GetIncome(player, ResourceType.Credits);
        creditsText.text = FormatResource("💰", credits, creditsIncome);
        creditsText.color = GetIncomeColor(creditsIncome);

        // Minerals
        int minerals = ResourceSystem.Instance.GetMinerals(player);
        int mineralsIncome = ResourceSystem.Instance.GetIncome(player, ResourceType.Minerals);
        mineralsText.text = FormatResource("⛏️", minerals, mineralsIncome);
        mineralsText.color = GetIncomeColor(mineralsIncome);

        // Fuel
        int fuel = ResourceSystem.Instance.GetFuel(player);
        int fuelIncome = ResourceSystem.Instance.GetIncome(player, ResourceType.Fuel);
        fuelText.text = FormatResource("⚡", fuel, fuelIncome);
        fuelText.color = GetIncomeColor(fuelIncome);

        // Food
        int food = ResourceSystem.Instance.GetFood(player);
        int foodIncome = ResourceSystem.Instance.GetIncome(player, ResourceType.Food);
        foodText.text = FormatResource("🌾", food, foodIncome);
        foodText.color = GetIncomeColor(foodIncome);

        // Energy
        int energy = ResourceSystem.Instance.GetEnergy(player);
        int energyIncome = ResourceSystem.Instance.GetIncome(player, ResourceType.Energy);
        energyText.text = FormatResource("🔋", energy, energyIncome);
        energyText.color = GetIncomeColor(energyIncome);

        // Check for low resource warnings
        CheckResourceWarnings(credits, minerals, fuel, food, energy);
    }

    // Format resource display (icon + value + income)
    private string FormatResource(string icon, int value, int income)
    {
        string incomeStr = income >= 0 ? $"+{income:N0}" : $"{income:N0}";
        return $"{icon} {value:N0} ({incomeStr}/turn)";
    }

    // Get color based on income (green = positive, red = negative, white = zero)
    private Color GetIncomeColor(int income)
    {
        if (income > 0) return Color.green;
        if (income < 0) return Color.red;
        return Color.white;
    }

    // Update turn number and date
    private void UpdateTurnDisplay()
    {
        int turn = TurnSystem.Instance.CurrentTurn;
        turnNumberText.text = $"Turn {turn}";

        // Calculate game date (starting at Stardate 2245.0)
        float stardate = 2245.0f + (turn * 0.1f);
        gameDateText.text = $"Stardate {stardate:F1}";
    }

    // Update phase indicator
    private void UpdatePhaseDisplay(TurnPhase phase)
    {
        switch (phase)
        {
            case TurnPhase.Income:
                phaseText.text = "Income Phase";
                phaseText.color = Color.green;
                break;
            case TurnPhase.Action:
                phaseText.text = "Action Phase";
                phaseText.color = Color.yellow;
                endTurnButton.interactable = true; // Enable End Turn
                break;
            case TurnPhase.Combat:
                phaseText.text = "Combat Phase";
                phaseText.color = Color.red;
                endTurnButton.interactable = false; // Disable End Turn
                break;
            case TurnPhase.End:
                phaseText.text = "End Phase";
                phaseText.color = Color.cyan;
                break;
        }
    }

    // Check for low resource warnings
    private void CheckResourceWarnings(int credits, int minerals, int fuel, int food, int energy)
    {
        if (credits < 1000) FlashWarning(creditsText);
        if (minerals < 500) FlashWarning(mineralsText);
        if (fuel < 200) FlashWarning(fuelText);
        if (food < 100) FlashWarning(foodText);
        if (energy < 50) FlashWarning(energyText);
    }

    // Flash warning animation (red flash 3 times)
    private void FlashWarning(TextMeshProUGUI text)
    {
        StartCoroutine(FlashCoroutine(text));
    }

    private IEnumerator FlashCoroutine(TextMeshProUGUI text)
    {
        for (int i = 0; i < 3; i++)
        {
            text.color = Color.red;
            yield return new WaitForSeconds(0.2f);
            text.color = Color.white;
            yield return new WaitForSeconds(0.2f);
        }
        text.color = Color.red; // Stay red
    }

    // End Turn button clicked
    private void OnEndTurnClicked()
    {
        TurnSystem.Instance.EndTurn();
    }

    // Menu button clicked
    private void OnMenuClicked()
    {
        UIStateManager.Instance.OnEscapePressed(); // Open Pause Menu
    }

    // Settings button clicked
    private void OnSettingsClicked()
    {
        // Open Settings panel (modal)
        ModalManager.Instance.ShowSettings();
    }

    // Update all displays
    private void UpdateAllDisplays()
    {
        UpdateResourceDisplay();
        UpdateTurnDisplay();
        UpdatePhaseDisplay(TurnSystem.Instance.CurrentPhase);
    }
}
```

### Resource Display Examples

**Example 1: Healthy Economy**
```
💰 25,000 (+3,500/turn)  ⛏️ 8,000 (+400/turn)  ⚡ 3,500 (+200/turn)  🌾 1,500 (+50/turn)  🔋 1,000 (+150/turn)
```

**Example 2: Deficit Mode**
```
💰 2,000 (-500/turn)  ⛏️ 500 (+100/turn)  ⚡ 100 (-50/turn)  🌾 50 (-200/turn)  🔋 300 (+50/turn)
```
*Red text indicates negative income, warning player of resource depletion*

**Example 3: Compact Mobile Mode**
```
💰 25K (+3.5K)  ⛏️ 8K (+400)  ⚡ 3.5K (+200)  🌾 1.5K (+50)  🔋 1K (+150)
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Player faction data
- **AFS-021 (Resource System)**: Resource stockpiles and income
- **AFS-002 (Turn System)**: Turn number and phase

### Depended On By
- **AFS-071 (UI State Machine)**: Controls HUD visibility
- **All Gameplay Screens**: HUD overlay on Galaxy View, Planet Management

### Events Subscribed
- `ResourceSystem.OnResourcesChanged`: Updates resource display
- `TurnSystem.OnTurnStarted`: Updates turn number
- `TurnSystem.OnPhaseChanged`: Updates phase indicator

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
