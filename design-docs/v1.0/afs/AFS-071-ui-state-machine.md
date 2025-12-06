# AFS-071: UI State Machine

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-001, FR-UX-001

---

## Summary

UI state management system implementing screen flow navigation, modal management, context-sensitive UI panels, and smooth transitions between game states (Main Menu, Galaxy View, Planet Management, Combat Resolution, End Game) with proper back-stack navigation and ESC key handling.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Game state queries
- **AFS-002 (Turn System)**: Turn phase transitions
- **AFS-005 (Input System)**: UI input handling
- **AFS-013 (Galaxy View)**: 3D camera integration

---

## Requirements

### UI States (Screen Hierarchy)

1. **Main Menu** (Entry Point)
   - **Substates**: Title Screen, New Game, Load Game, Settings, Credits
   - **Transitions**: New Game → Galaxy View, Load Game → Galaxy View
   - **ESC Behavior**: Exit to desktop (with confirmation)
   - **Persistent**: Always returns here on game end

2. **Galaxy View** (Primary Gameplay Screen)
   - **Purpose**: 3D star system view, planet selection, fleet movement
   - **Panels**: HUD (resources, turn info), Action Menu (bottom-right)
   - **Substates**: Normal View, Planet Selected, Fleet Selected
   - **ESC Behavior**: Open Pause Menu
   - **Transitions**: Click planet → Planet Management, End Turn → Combat/Income

3. **Planet Management** (Planet Detail Screen)
   - **Purpose**: Build structures, commission platoons, manage population
   - **Panels**: Planet Info, Building List, Construction Queue, Garrison
   - **ESC Behavior**: Return to Galaxy View
   - **Transitions**: Build/Train actions trigger construction, Back button → Galaxy View

4. **Combat Resolution** (Modal Overlay)
   - **Purpose**: Display combat results (space battles, invasions, bombardments)
   - **Panels**: Attacker vs Defender, Casualty Report, Outcome Summary
   - **ESC Behavior**: Disabled during combat (must watch resolution)
   - **Transitions**: Auto-close after 5 seconds OR player clicks "Continue"

5. **End Game** (Victory/Defeat Screen)
   - **Purpose**: Display game outcome, statistics, replay option
   - **Panels**: Victory Message, Stats Summary, Final Score
   - **ESC Behavior**: Return to Main Menu
   - **Transitions**: New Game → Main Menu, Return to Main Menu

### State Transition Rules

1. **Navigation Stack**
   - **Pattern**: Push/Pop stack for hierarchical navigation
   - **Example**: Main Menu → Galaxy View → Planet Management
   - **Back Button**: Pops current state, returns to previous
   - **ESC Key**: Same as Back button (context-sensitive)
   - **Clear Stack**: Victory/Defeat clears entire stack, returns to Main Menu

2. **Modal Overlays** (Non-Blocking UI)
   - **Types**: Confirmation Dialogs, Combat Results, Tutorial Tooltips
   - **Behavior**: Overlay on current screen, dim background
   - **Input Blocking**: Only modal receives input (background locked)
   - **ESC Behavior**: Close modal (if dismissible)
   - **Example**: "End Turn?" confirmation modal over Galaxy View

3. **Transition Animations**
   - **Fade**: Screen fades to black, new screen fades in (500ms total)
   - **Slide**: Panels slide in/out from edges (300ms)
   - **Zoom**: Galaxy View zooms to planet for Planet Management (400ms)
   - **None**: Instant transition for modals (immediate)
   - **Cancelable**: Can be skipped with ESC/Space (MVP: no skipping)

### UI Panel Management

1. **Panel Visibility**
   - **Context-Sensitive**: Show/hide panels based on state
   - **Example**: Action Menu visible only in Galaxy View
   - **Example**: Planet Info panel visible only in Planet Management
   - **Persistent HUD**: Resource bar, turn counter always visible (except Main Menu)

2. **Panel Stacking** (Z-Order)
   - **Base Layer**: 3D Galaxy View (canvas layer 0)
   - **HUD Layer**: Resource bars, turn info (canvas layer 1)
   - **Panel Layer**: Planet Management, Building panels (canvas layer 2)
   - **Modal Layer**: Confirmations, combat results (canvas layer 3)
   - **Tooltip Layer**: Hover tooltips (canvas layer 4, always on top)

3. **Panel Preloading**
   - **Lazy Loading**: Load panels on first access (not at startup)
   - **Caching**: Keep recent panels in memory (max 5 panels)
   - **Unload**: Remove old panels after 10 screen transitions
   - **Performance**: Reduces initial load time, smooth transitions

### Input Handling

1. **ESC Key Behavior** (Context-Sensitive)
   - **Main Menu**: Exit to desktop (confirmation dialog)
   - **Galaxy View**: Open Pause Menu
   - **Planet Management**: Return to Galaxy View
   - **Modal Open**: Close modal (if dismissible)
   - **Combat Resolution**: Disabled (must watch)

2. **Back Button** (Mobile/Gamepad)
   - **Android**: Hardware back button = ESC key
   - **Gamepad**: B button (Xbox) / Circle (PlayStation) = ESC key
   - **UI Button**: "Back" button in top-left corner (all screens)

3. **Tab Navigation** (Keyboard)
   - **Tab Key**: Cycle through interactive elements (buttons, dropdowns)
   - **Shift+Tab**: Reverse cycle
   - **Enter**: Activate selected button
   - **Arrow Keys**: Navigate lists (planet list, building list)

### Error State Handling

1. **Load Failure**
   - **Trigger**: Save file corrupt or incompatible
   - **Action**: Display error modal, return to Main Menu
   - **Display**: "Save file corrupted. Please start a new game."

2. **Network Timeout** (Future: Multiplayer)
   - **Trigger**: Cloud save fails, multiplayer connection lost
   - **Action**: Display error, offer retry or offline mode
   - **MVP**: Not applicable (single-player only)

3. **Invalid Action**
   - **Trigger**: Player attempts illegal action (e.g., invade own planet)
   - **Action**: Display error toast (bottom-center, auto-dismiss 3s)
   - **Display**: "Cannot invade your own planet!"

---

## Acceptance Criteria

### Functional Criteria

- [ ] All 5 primary UI states implemented (Main Menu, Galaxy View, Planet Management, Combat, End Game)
- [ ] State transitions smooth with animations (fade, slide, zoom)
- [ ] Navigation stack push/pop correctly
- [ ] ESC key behavior context-sensitive (Main Menu, Galaxy View, Planet Management)
- [ ] Modal overlays block background input
- [ ] Back button returns to previous state
- [ ] Panel visibility controlled by current state
- [ ] HUD persistent across gameplay screens
- [ ] Error states display correctly (load failure, invalid actions)

### Performance Criteria

- [ ] State transitions complete in <500ms (including animations)
- [ ] Panel loading completes in <100ms
- [ ] No frame drops during transitions (<16ms per frame)
- [ ] Memory usage stable (panel caching prevents leaks)

### Integration Criteria

- [ ] Integrates with Input System (AFS-005) for ESC/Back handling
- [ ] Uses Game State Manager (AFS-001) for state queries
- [ ] Triggers Turn System (AFS-002) transitions from Galaxy View
- [ ] Controls Galaxy View (AFS-013) camera during Planet Management transitions
- [ ] Displays combat results from Combat System (AFS-041, AFS-042)

---

## Technical Notes

### Implementation Approach

```csharp
public enum UIState
{
    MainMenu,
    GalaxyView,
    PlanetManagement,
    CombatResolution,
    EndGame
}

public class UIStateManager : MonoBehaviour
{
    private static UIStateManager _instance;
    public static UIStateManager Instance => _instance;

    private Stack<UIState> _stateStack = new Stack<UIState>();
    private UIState _currentState = UIState.MainMenu;

    public UIState CurrentState => _currentState;

    public event Action<UIState, UIState> OnStateChanged; // oldState, newState

    private void Awake()
    {
        _instance = this;
    }

    // Transition to new state (push onto stack)
    public void PushState(UIState newState, bool animate = true)
    {
        UIState oldState = _currentState;

        // Push current state onto stack (for back navigation)
        _stateStack.Push(_currentState);

        // Transition to new state
        _currentState = newState;

        OnStateChanged?.Invoke(oldState, newState);

        Debug.Log($"UI State: {oldState} → {newState} (stack depth: {_stateStack.Count})");

        // Update UI visibility
        UpdatePanelVisibility(newState, animate);
    }

    // Return to previous state (pop from stack)
    public void PopState(bool animate = true)
    {
        if (_stateStack.Count == 0)
        {
            Debug.LogWarning("Cannot pop UI state: stack empty!");
            return;
        }

        UIState oldState = _currentState;
        UIState newState = _stateStack.Pop();

        _currentState = newState;

        OnStateChanged?.Invoke(oldState, newState);

        Debug.Log($"UI State: {oldState} ← {newState} (stack depth: {_stateStack.Count})");

        UpdatePanelVisibility(newState, animate);
    }

    // Clear stack and transition to state (used for Main Menu, End Game)
    public void SetState(UIState newState, bool clearStack = true, bool animate = true)
    {
        UIState oldState = _currentState;

        if (clearStack)
        {
            _stateStack.Clear();
        }

        _currentState = newState;

        OnStateChanged?.Invoke(oldState, newState);

        Debug.Log($"UI State: {oldState} → {newState} (stack cleared: {clearStack})");

        UpdatePanelVisibility(newState, animate);
    }

    // Handle ESC key press (context-sensitive)
    public void OnEscapePressed()
    {
        switch (_currentState)
        {
            case UIState.MainMenu:
                // Show "Exit to Desktop?" confirmation
                ShowExitConfirmation();
                break;

            case UIState.GalaxyView:
                // Open Pause Menu
                ShowPauseMenu();
                break;

            case UIState.PlanetManagement:
                // Return to Galaxy View
                PopState();
                break;

            case UIState.CombatResolution:
                // Disabled (must watch combat)
                Debug.Log("ESC disabled during combat");
                break;

            case UIState.EndGame:
                // Return to Main Menu
                SetState(UIState.MainMenu, clearStack: true);
                break;
        }
    }

    // Update panel visibility based on state
    private void UpdatePanelVisibility(UIState state, bool animate)
    {
        // Hide all panels first
        HideAllPanels();

        // Show panels for current state
        switch (state)
        {
            case UIState.MainMenu:
                ShowPanel("MainMenuPanel", animate);
                break;

            case UIState.GalaxyView:
                ShowPanel("GalaxyViewPanel", animate);
                ShowPanel("HUDPanel", animate: false); // HUD always visible
                break;

            case UIState.PlanetManagement:
                ShowPanel("PlanetManagementPanel", animate);
                ShowPanel("HUDPanel", animate: false);
                break;

            case UIState.CombatResolution:
                ShowPanel("CombatResultsPanel", animate);
                break;

            case UIState.EndGame:
                ShowPanel("EndGamePanel", animate);
                break;
        }
    }

    private void ShowPanel(string panelName, bool animate)
    {
        var panel = GameObject.Find(panelName);
        if (panel != null)
        {
            if (animate)
            {
                // Fade in animation (use DOTween or Animator)
                StartCoroutine(FadeInPanel(panel));
            }
            else
            {
                panel.SetActive(true);
            }
        }
    }

    private void HideAllPanels()
    {
        // Hide all panels (except HUD if in gameplay)
        // Implementation depends on panel structure
    }

    private IEnumerator FadeInPanel(GameObject panel)
    {
        panel.SetActive(true);
        var canvasGroup = panel.GetComponent<CanvasGroup>();
        if (canvasGroup != null)
        {
            canvasGroup.alpha = 0;
            float elapsed = 0;
            while (elapsed < 0.5f)
            {
                elapsed += Time.deltaTime;
                canvasGroup.alpha = Mathf.Clamp01(elapsed / 0.5f);
                yield return null;
            }
        }
    }

    private void ShowExitConfirmation()
    {
        // Show modal: "Exit to Desktop?"
        ModalManager.Instance.ShowConfirmation("Exit to Desktop?",
            onConfirm: () => Application.Quit(),
            onCancel: () => { /* do nothing */ });
    }

    private void ShowPauseMenu()
    {
        // Show Pause Menu modal overlay
        ModalManager.Instance.ShowPauseMenu();
    }
}
```

### State Transition Diagram

```
Main Menu ──New Game──> Galaxy View ──Planet Click──> Planet Management
    ↑                        ↑                              ↓
    │                        └──────────ESC/Back────────────┘
    │                        │
    │                   End Turn
    │                        ↓
    │                  Combat Resolution (modal)
    │                        ↓
    │                   Galaxy View
    │                        │
    └─────Victory/Defeat─────┘
                    ↓
               End Game ──ESC──> Main Menu
```

### Panel Visibility Matrix

| UI State | Main Menu Panel | Galaxy View Panel | HUD Panel | Planet Mgmt Panel | Combat Panel | End Game Panel |
|----------|-----------------|-------------------|-----------|-------------------|--------------|----------------|
| Main Menu | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Galaxy View | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Planet Management | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Combat Resolution | ✗ | ✓ (dimmed) | ✓ | ✗ | ✓ (modal) | ✗ |
| End Game | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: State queries
- **AFS-005 (Input System)**: ESC/Back input handling

### Depended On By
- **AFS-002 (Turn System)**: Triggers UI state changes
- **AFS-013 (Galaxy View)**: Controls 3D camera
- **AFS-041 (Combat System)**: Displays combat results
- **AFS-061 (Building System)**: Planet Management UI
- **All UI Panels**: Controlled by this state machine

### Events Published
- `OnStateChanged(UIState oldState, UIState newState)`: UI state transition

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
