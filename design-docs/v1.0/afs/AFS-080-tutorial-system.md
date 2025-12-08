# AFS-080: Tutorial and Help System

**Status:** Draft
**Priority:** P1 (Important)
**Owner:** Lead Developer
**PRD Reference:** FR-TUTORIAL-001, FR-TUTORIAL-002

---

## Summary

Interactive tutorial system for new players including step-by-step guided missions, contextual help tooltips, in-game documentation, and progressive difficulty curve to teach core game mechanics without overwhelming players.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Tutorial progress tracking
- **AFS-002 (Turn System)**: Tutorial mission turn management
- **AFS-003 (Save System)**: Save tutorial progress
- **AFS-071-079 (All UI Screens)**: Tutorial overlays on each screen
- **AFS-011 (Galaxy Generation)**: Tutorial galaxy setup
- **AFS-081 (Localization)**: Multi-language tutorial text

---

## Requirements

### Tutorial Mode (FR-TUTORIAL-001)

#### 1. Tutorial Mission Structure

**Mission-Based Learning:**
- **5 Tutorial Missions:** Each teaches specific game mechanic
- **Sequential Progression:** Unlock Mission 2 after completing Mission 1
- **Guided Steps:** Each mission broken into 5-10 steps
- **Completion Rewards:** Unlock features, earn starting resources
- **Skip Option:** Advanced players can skip to main game

**Tutorial Missions:**

**Mission 1: "First Steps" (5 minutes)**
- **Goal:** Learn basic UI navigation and resource management
- **Steps:**
  1. Welcome screen: "Welcome to Overlord! Click 'Begin Tutorial' to start."
  2. Navigate to Government Screen: "Click the 'Government' button to view your empire."
  3. Review resources: "You have 5 resource types: Credits, Minerals, Fuel, Food, Energy."
  4. Adjust tax rate: "Set tax rate to 20% to generate Credits income."
  5. End turn: "Click 'End Turn' to advance time and collect income."
- **Completion:** Player earns 10,000 Credits

**Mission 2: "Building Your Empire" (10 minutes)**
- **Goal:** Learn building construction and production
- **Steps:**
  1. Navigate to Planet Surface: "Click Starbase planet, then 'Surface' button."
  2. Build Mining Station: "Select Platform 1, choose Mining Station, purchase for 50,000 Credits."
  3. Wait for construction: "Buildings take 5 turns to build. Click 'End Turn' 5 times."
  4. Toggle building ON: "Click Mining Station, then 'Toggle ON' to start production."
  5. View income increase: "Check Government screen - Minerals income now +150/turn."
- **Completion:** Player has 1 active Mining Station

**Mission 3: "Military Might" (15 minutes)**
- **Goal:** Learn platoon commissioning and equipment
- **Steps:**
  1. Navigate to Platoon Management: "Click 'Platoons' button."
  2. Commission platoon: "Click 'Commission New Platoon', set 150 troops, confirm."
  3. Wait for training: "Platoon builds in 4 turns. Advance turns."
  4. Upgrade equipment: "Select Platoon 01, click 'Upgrade Equipment to Level 2'."
  5. Assign to Battle Cruiser: "Click 'Assign to Battle Cruiser', select BC-01."
- **Completion:** Player has 1 fully trained platoon aboard Battle Cruiser

**Mission 4: "Expanding Territory" (20 minutes)**
- **Goal:** Learn navigation, terraforming, colonization
- **Steps:**
  1. Purchase Atmosphere Processor: "Buy Screen → Atmosphere Processor (200,000 Credits)."
  2. Wait for construction: "Advance 8 turns for completion."
  3. Navigate to neutral planet: "Navigation → Select Processor → Destination: Desert Planet."
  4. Launch journey: "Click 'Launch Journey', wait 3 turns for arrival."
  5. Terraform planet: "Processor automatically terraforms, wait 3 turns for completion."
  6. Colony established: "Desert Planet now yours! +500 resources added."
- **Completion:** Player controls 2 planets (Starbase + Desert)

**Mission 5: "First Battle" (25 minutes)**
- **Goal:** Learn combat mechanics and planetary assault
- **Steps:**
  1. Build second platoon: "Commission another platoon (150 troops)."
  2. Load platoons onto Battle Cruiser: "Load Platoon 01 and 02 onto BC-01 (2/4)."
  3. Navigate to enemy planet: "Navigation → BC-01 → Destination: Enemy planet 'Hitotsu'."
  4. Launch assault: "Advance turn, combat begins automatically."
  5. Use orbital bombardment: "Combat screen → Select 'Orbital Bombardment' → Execute."
  6. Win battle: "Continue combat until victory, capture planet."
- **Completion:** Player captures first enemy planet, tutorial complete!

#### 2. Tutorial UI Overlays

**Highlight and Tooltip System:**
- **Spotlight:** Dim entire screen except highlighted element (80% black overlay)
- **Arrow Pointer:** Animated arrow pointing to next action
- **Tooltip Box:** White box with instruction text and [Next] button
- **Forced Interaction:** Cannot click outside tutorial area until step complete

**Example Overlay:**
```
┌──────────────────────────────────────────┐
│  Tutorial: Building Your Empire (2/5)   │
├──────────────────────────────────────────┤
│                                          │
│  ╔════════════════════════╗              │
│  ║ [Government] Button ←──┼──── CLICK   │
│  ╚════════════════════════╝   THIS!     │
│  (highlighted, rest dimmed)              │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Navigate to the Government Screen  │  │
│  │ to view your empire's resources    │  │
│  │ and tax settings.                  │  │
│  │                                    │  │
│  │ [Skip Tutorial] [Next →]           │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Tutorial Step Structure:**
```csharp
class TutorialStep {
    string InstructionText;     // "Click the Government button"
    string TargetElementID;     // "GovernmentButton" (UI element to highlight)
    TutorialActionType ActionType;  // Click, Navigate, Wait, Custom
    bool BlockInput;            // True = block all input except target element
    float TimeoutSeconds;       // Auto-advance after X seconds (optional)
}
```

#### 3. Tutorial Progress Tracking

**Progress Save:**
- **Current Mission:** 1-5 (which mission player is on)
- **Current Step:** 1-10 (which step within mission)
- **Completed Missions:** Bitmask (00001 = Mission 1 complete, 11111 = all complete)
- **Tutorial Enabled:** Bool (player can disable tutorial anytime)

**Tutorial State:**
```csharp
class TutorialState {
    bool TutorialEnabled = true;
    int CurrentMission = 1;
    int CurrentStep = 1;
    int CompletedMissions = 0;  // Bitmask: 0b11111 = all 5 complete

    bool IsMissionComplete(int missionIndex) {
        return (CompletedMissions & (1 << (missionIndex - 1))) != 0;
    }

    void CompleteMission(int missionIndex) {
        CompletedMissions |= (1 << (missionIndex - 1));
    }

    bool AllMissionsComplete() {
        return CompletedMissions == 0b11111;  // All 5 missions done
    }
}
```

**Persistence:**
- Tutorial progress saved in game save file
- Separate "Tutorial Save" slot (doesn't overwrite main saves)
- Can restart tutorial from Settings menu

#### 4. Tutorial Skip and Disable

**Skip Tutorial Button:**
- **Location:** Top-right of every tutorial overlay
- **Action:** Skip current mission, unlock all features
- **Confirmation:** "Skip tutorial? You can restart from Settings."
- **Effect:** Set TutorialEnabled = false, unlock all missions

**Disable Tutorial (Settings):**
- **Settings Menu:** "Tutorial: ON / OFF" toggle
- **Effect:** Hides all tutorial overlays, allows free play
- **Re-enable:** Player can turn back on and resume from last step

**Tutorial Complete:**
- **After Mission 5:** "Tutorial complete! You're ready to conquer the galaxy."
- **Rewards:** Bonus starting resources (50,000 Credits, 1,000 each resource)
- **Transition:** Seamlessly continue from tutorial galaxy to main game

---

### In-Game Help (FR-TUTORIAL-002)

#### 1. Contextual Help Tooltips

**Hover/Long-Press Tooltips:**
- **Trigger:** Mouse hover (PC) or long-press (mobile) on UI element
- **Content:** Brief explanation of feature (1-2 sentences)
- **Example:**
  - Hover "Tax Rate": "Percentage of civilian income collected as Credits. Higher rates reduce morale."
  - Hover "Combat Strength": "Total military power = Troops × (Equipment + Weapons + Training multiplier)."

**Tooltip Format:**
```
┌──────────────────────────────────┐
│ Tax Rate                         │
├──────────────────────────────────┤
│ Percentage of civilian income   │
│ collected as Credits each turn.  │
│                                  │
│ • Higher rates = more Credits   │
│ • Higher rates = lower morale   │
│ • Recommended: 10-30%            │
└──────────────────────────────────┘
```

**Tooltip Coverage:**
- All buttons with icons (no text labels)
- All numerical stats (Combat Strength, Production Rate, etc.)
- All resource types (Food, Minerals, Fuel, Energy, Credits)
- All building types (Mining Station, Horticultural Station, etc.)

#### 2. Help Menu (In-Game Encyclopedia)

**Access:**
- **Button:** "?" icon in top-right corner (all screens)
- **Hotkey:** F1 (PC) or long-press header bar (mobile)

**Help Menu Structure:**
```
┌──────────────────────────────────────────┐
│ Help & Documentation                     │
├──────────────────────────────────────────┤
│ [Search: ____________]                   │
│                                          │
│ ▼ Getting Started                        │
│   • Tutorial Missions                    │
│   • Basic Controls                       │
│   • Resource Management                  │
│                                          │
│ ▼ Economy                                │
│   • Resource Types                       │
│   • Income Calculation                   │
│   • Tax System                           │
│   • Building Production                  │
│                                          │
│ ▼ Military                               │
│   • Platoons                             │
│   • Equipment & Weapons                  │
│   • Training System                      │
│   • Combat Mechanics                     │
│                                          │
│ ▼ Expansion                              │
│   • Terraforming                         │
│   • Colonization                         │
│   • Planet Types                         │
│                                          │
│ ▼ Spacecraft                             │
│   • Battle Cruiser                       │
│   • Cargo Cruiser                        │
│   • Navigation                           │
│                                          │
│ [Close]                                  │
└──────────────────────────────────────────┘
```

**Help Article Format:**
```
┌──────────────────────────────────────────┐
│ Combat Strength                          │
├──────────────────────────────────────────┤
│ Combat Strength determines how much      │
│ damage a platoon deals in battle.        │
│                                          │
│ FORMULA:                                 │
│ Troops × Combat Multiplier               │
│                                          │
│ MULTIPLIER:                              │
│ • Base: 1.0                              │
│ • Equipment: +0.5 per level              │
│ • Weapons: +0.5 per level                │
│ • Training: +1.0 if 100%                 │
│                                          │
│ EXAMPLE:                                 │
│ 150 troops, Eq 2, Wpn 3, Training 100%   │
│ = 150 × (1.0 + 1.0 + 1.5 + 1.0)          │
│ = 150 × 4.5 = 675 Combat Strength        │
│                                          │
│ SEE ALSO:                                │
│ • Platoons                               │
│ • Equipment System                       │
│ • Weapons System                         │
│                                          │
│ [Back to Help Menu]                      │
└──────────────────────────────────────────┘
```

**Search Functionality:**
- Type keyword in search box (e.g., "combat")
- Shows all articles mentioning keyword
- Highlights search term in article text

#### 3. First-Time Feature Prompts

**Feature Unlock Notifications:**
- **Trigger:** First time player accesses new screen
- **Display:** One-time popup explaining screen purpose
- **Example:**
  - First time opening Buy Screen: "This is the Buy Screen. Here you can purchase spacecraft, buildings, and upgrades."
  - First time opening Navigation: "Use Navigation to move spacecraft between planets. Select craft, choose destination, launch journey."

**Dismissible Hints:**
- **Don't Show Again:** Checkbox in popup
- **User Preference:** Saved per feature (BuyScreenHintShown = true)

#### 4. Loading Screen Tips

**Random Tips During Loading:**
- **Display:** Rotating tips shown during scene transitions
- **Examples:**
  - "Volcanic planets provide ×5 Mineral production!"
  - "Retreat from losing battles to save your platoons."
  - "Orbital bombardment has a 3-turn cooldown."
  - "Toggle buildings OFF to save crew food consumption."
  - "Cargo Cruisers are 20% more fuel-efficient than Battle Cruisers."

**Tip Database:**
- 50+ tips covering all game mechanics
- Randomly selected each loading screen
- Tips marked as "read" after displaying (avoid repetition)

---

## Acceptance Criteria

### Tutorial Mode Criteria

- [ ] 5 tutorial missions available, unlocking sequentially
- [ ] Each mission has 5-10 guided steps with tooltips
- [ ] UI overlays highlight target elements, dim rest of screen
- [ ] Cannot interact with non-tutorial elements during tutorial step
- [ ] [Skip Tutorial] button allows skipping current mission
- [ ] [Next →] button advances to next step
- [ ] Tutorial progress saved in game save file
- [ ] Tutorial can be disabled in Settings menu
- [ ] All 5 missions completable without errors
- [ ] Completion rewards granted (Credits, resources)

### In-Game Help Criteria

- [ ] Contextual tooltips on all buttons, stats, resources
- [ ] Tooltip displays on hover (PC) or long-press (mobile)
- [ ] Help menu accessible via "?" button or F1 key
- [ ] Help menu organized into 5 categories (Getting Started, Economy, Military, Expansion, Spacecraft)
- [ ] Search functionality finds articles by keyword
- [ ] Each help article includes description, formula/details, examples, "See Also" links
- [ ] First-time feature prompts display on initial screen access
- [ ] "Don't show again" checkbox saves user preference
- [ ] Loading screen tips display random tip from 50+ database

### UI and Visual Criteria

- [ ] Tutorial overlays dim screen to 80% black except highlighted element
- [ ] Animated arrow points to next action
- [ ] Tooltip box clearly readable (white background, black text)
- [ ] Help menu scrollable for >10 articles
- [ ] Search results highlight keyword in text
- [ ] Loading tips rotate every 5 seconds

### Performance Criteria

- [ ] Tutorial overlay renders <100ms
- [ ] Tooltip displays <50ms after hover/long-press
- [ ] Help menu opens <200ms
- [ ] Search results return <100ms

---

## Implementation Notes

### Tutorial Manager

**Tutorial System:**
```csharp
class TutorialManager : MonoBehaviour {
    TutorialState tutorialState;
    List<TutorialMission> missions;
    TutorialOverlay overlay;

    void Start() {
        tutorialState = GameManager.Instance.GameState.TutorialState;

        if (tutorialState.TutorialEnabled && !tutorialState.AllMissionsComplete()) {
            StartCurrentMission();
        }
    }

    void StartCurrentMission() {
        var mission = missions[tutorialState.CurrentMission - 1];
        var step = mission.Steps[tutorialState.CurrentStep - 1];

        overlay.Show(step);
    }

    void OnStepComplete() {
        tutorialState.CurrentStep++;

        if (tutorialState.CurrentStep > missions[tutorialState.CurrentMission - 1].Steps.Count) {
            // Mission complete
            tutorialState.CompleteMission(tutorialState.CurrentMission);
            tutorialState.CurrentMission++;
            tutorialState.CurrentStep = 1;

            if (tutorialState.AllMissionsComplete()) {
                ShowTutorialCompleteScreen();
            } else {
                StartCurrentMission();
            }
        } else {
            StartCurrentMission();
        }
    }

    void OnSkipTutorial() {
        tutorialState.TutorialEnabled = false;
        overlay.Hide();
    }
}
```

### Tutorial Overlay

**UI Overlay:**
```csharp
class TutorialOverlay : MonoBehaviour {
    Image dimOverlay;           // 80% black overlay
    Image arrowPointer;         // Animated arrow
    RectTransform tooltipBox;   // Instruction text box
    Text instructionText;
    Button nextButton;
    Button skipButton;

    void Show(TutorialStep step) {
        gameObject.SetActive(true);

        // Dim screen
        dimOverlay.color = new Color(0, 0, 0, 0.8f);

        // Highlight target element
        var targetElement = GameObject.Find(step.TargetElementID);
        if (targetElement != null) {
            HighlightElement(targetElement);
            PositionArrow(targetElement);
        }

        // Show tooltip
        instructionText.text = step.InstructionText;
        PositionTooltip(targetElement);

        // Block input
        if (step.BlockInput) {
            BlockAllInputExcept(targetElement);
        }

        nextButton.onClick.RemoveAllListeners();
        nextButton.onClick.AddListener(() => OnStepComplete());

        skipButton.onClick.RemoveAllListeners();
        skipButton.onClick.AddListener(() => OnSkipTutorial());
    }

    void HighlightElement(GameObject element) {
        // Create cutout in dim overlay to show element clearly
        var rect = element.GetComponent<RectTransform>();
        // Use mask or shader to create spotlight effect
    }

    void PositionArrow(GameObject element) {
        var rect = element.GetComponent<RectTransform>();
        arrowPointer.rectTransform.position = rect.position + new Vector3(100, 50, 0);
        StartCoroutine(AnimateArrow());
    }

    IEnumerator AnimateArrow() {
        while (true) {
            arrowPointer.rectTransform.Rotate(Vector3.forward, 5f);
            yield return new WaitForSeconds(0.1f);
        }
    }
}
```

### Contextual Tooltip

**Tooltip Component:**
```csharp
class Tooltip : MonoBehaviour {
    static TooltipPanel tooltipPanel;
    string tooltipText;

    void OnPointerEnter() {
        tooltipPanel.Show(tooltipText, Input.mousePosition);
    }

    void OnPointerExit() {
        tooltipPanel.Hide();
    }

    // Mobile: long-press trigger
    void OnLongPress() {
        tooltipPanel.Show(tooltipText, Input.mousePosition);
    }
}

class TooltipPanel : MonoBehaviour {
    Text tooltipText;
    RectTransform panel;

    void Show(string text, Vector2 position) {
        gameObject.SetActive(true);
        tooltipText.text = text;
        panel.position = position + new Vector2(50, -50);  // Offset from cursor
    }

    void Hide() {
        gameObject.SetActive(false);
    }
}
```

### Help Menu

**Help System:**
```csharp
class HelpMenu : MonoBehaviour {
    List<HelpArticle> articles;
    InputField searchInput;
    ScrollRect articleList;
    Text articleContent;

    void Start() {
        LoadArticles();
        searchInput.onValueChanged.AddListener(OnSearchChanged);
    }

    void LoadArticles() {
        // Load from JSON or ScriptableObject
        articles = HelpArticleDatabase.GetAllArticles();
    }

    void OnSearchChanged(string query) {
        if (string.IsNullOrEmpty(query)) {
            ShowAllArticles();
        } else {
            var results = articles.Where(a =>
                a.Title.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                a.Content.Contains(query, StringComparison.OrdinalIgnoreCase)
            ).ToList();

            ShowSearchResults(results, query);
        }
    }

    void ShowArticle(HelpArticle article) {
        articleContent.text = article.Content;
    }
}

class HelpArticle {
    string Title;
    string Content;
    string Category;  // "Economy", "Military", etc.
    List<string> SeeAlso;  // Related article titles
}
```

---

## Testing Scenarios

### Tutorial Tests

1. **Mission 1 Completion:**
   - Given new player starts tutorial
   - When player completes all 5 steps of Mission 1
   - Then Mission 1 marked complete, Mission 2 unlocks, 10,000 Credits awarded

2. **Tutorial Skip:**
   - Given player in middle of Mission 2 (step 3/5)
   - When player clicks "Skip Tutorial"
   - Then tutorial overlay disappears, all features unlocked, free play enabled

3. **Tutorial Progress Save:**
   - Given player completes Mission 1 and 2
   - When player saves game and reloads
   - Then tutorial state restored, Mission 3 available

### Help System Tests

1. **Tooltip Display:**
   - Given player hovers over "Tax Rate" label
   - When hover duration >0.5s
   - Then tooltip displays explanation of tax rate mechanic

2. **Help Search:**
   - Given Help menu open
   - When player searches "combat"
   - Then articles "Combat Strength", "Combat Mechanics", "Space Combat" displayed

3. **First-Time Prompt:**
   - Given player never opened Buy Screen
   - When player clicks Buy button for first time
   - Then prompt displays "This is the Buy Screen..."

---

## Future Enhancements

**Advanced Tutorial Features:**
- Interactive sandbox mode (practice without consequences)
- Replay tutorial missions (re-learn mechanics)
- Advanced tutorials for expert strategies
- Community-created tutorial missions

**Help System Enhancements:**
- Video tutorials (embedded YouTube links)
- Animated GIFs demonstrating mechanics
- Community wiki integration
- In-game bug reporting

**AI Tutorial Coach:**
- Adaptive difficulty (AI suggests tips based on player mistakes)
- Personalized recommendations ("You haven't built any Horticultural Stations - low Food warning!")
- Achievement-based hints (unlock advanced tips after achievements)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-071-079 (All UI Screens), AFS-081 (Localization), AFS-011 (Galaxy Generation)
