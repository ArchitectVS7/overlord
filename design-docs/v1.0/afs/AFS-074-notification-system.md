# AFS-074: Notification System

**Status:** Draft
**Priority:** P1 (High)
**Owner:** Lead Developer
**PRD Reference:** FR-UI-004

---

## Summary

Notification and messaging system implementing toast notifications, modal dialogs, turn events log, and alert banners to communicate game events (combat results, construction completion, resource warnings, AI actions) to the player with appropriate urgency and visual hierarchy.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Game events
- **AFS-071 (UI State Machine)**: Modal management
- **AFS-072 (HUD System)**: HUD overlay integration

---

## Requirements

### Notification Types

1. **Toast Notifications** (Non-Blocking)
   - **Purpose**: Low-priority information (building complete, resource milestone)
   - **Position**: Bottom-center of screen
   - **Duration**: 3 seconds auto-dismiss
   - **Style**: Semi-transparent dark panel, small text
   - **Stackable**: Up to 3 toasts visible simultaneously
   - **Example**: "Mining Station complete on Vulcan Prime!"

2. **Modal Dialogs** (Blocking)
   - **Purpose**: High-priority events requiring acknowledgment
   - **Position**: Center of screen, dims background
   - **Duration**: Requires player click to dismiss
   - **Style**: Large panel with title, message, buttons
   - **Blocking**: Prevents other input until dismissed
   - **Example**: "Planet Captured! Zeta Reticuli now under your control."

3. **Alert Banners** (Warning)
   - **Purpose**: Critical warnings (low resources, invasion imminent)
   - **Position**: Top of screen, below HUD
   - **Duration**: Persistent until condition resolved
   - **Style**: Red background, flashing animation
   - **Dismissible**: "X" button to hide (reappears next turn)
   - **Example**: "⚠️ LOW FOOD! Starvation in 3 turns!"

4. **Event Log** (Historical)
   - **Purpose**: Record of all game events (scrollable history)
   - **Position**: Toggle panel (F1 or icon button)
   - **Duration**: Persists entire game session
   - **Style**: List of timestamped events
   - **Filters**: All, Combat, Economy, Diplomacy
   - **Example**: "Turn 12: Mining Station built on Vulcan Prime"

### Notification Priority

1. **Critical** (Red, Modal)
   - Planet captured/lost
   - Victory/defeat conditions
   - Game-ending events
   - **Action**: Blocks gameplay, requires acknowledgment

2. **High** (Yellow, Alert Banner)
   - Combat initiated
   - Resource depletion warnings
   - Invasion detected
   - **Action**: Persistent banner until resolved

3. **Medium** (Blue, Toast)
   - Construction completed
   - Research finished
   - Fleet arrived at destination
   - **Action**: Auto-dismiss after 3 seconds

4. **Low** (Gray, Event Log Only)
   - Resource production
   - Population growth
   - Minor AI actions
   - **Action**: Log only, no toast

### Toast Notification System

1. **Toast Display**
   - **Format**: Icon + Message
   - **Example**: "✅ Battle Cruiser complete! (USCS Cruiser 04)"
   - **Animation**: Slide up from bottom (300ms), fade out (200ms)
   - **Stacking**: New toasts push older ones up
   - **Max Stack**: 3 toasts (oldest disappears when 4th arrives)

2. **Toast Types**
   - **Success** (Green): Construction complete, research finished
   - **Info** (Blue): Fleet arrived, turn advanced
   - **Warning** (Yellow): Resource low, morale decreased
   - **Error** (Red): Insufficient resources, action failed

3. **Toast Interactions**
   - **Hover**: Pauses auto-dismiss timer
   - **Click**: Dismisses immediately
   - **Context Link**: Click to jump to relevant screen (e.g., planet management)

### Modal Dialog System

1. **Confirmation Dialogs**
   - **Purpose**: Confirm destructive actions
   - **Title**: "Scrap Building?"
   - **Message**: "Are you sure you want to scrap Mining Station? You will receive 50% refund (4,000 Credits)."
   - **Buttons**: "Confirm" (red), "Cancel" (gray)
   - **Callback**: Executes action on Confirm

2. **Combat Result Dialogs**
   - **Title**: "Battle Results"
   - **Content**:
     - Attacker: USCS Fleet (strength 450)
     - Defender: AI Fleet (strength 200)
     - Result: Victory!
     - Casualties: 1 Battle Cruiser damaged
   - **Button**: "Continue" (green, large)
   - **Auto-Advance**: After 5 seconds (optional setting)

3. **Alert Dialogs**
   - **Title**: "⚠️ Warning"
   - **Message**: "Food stockpile depleted! Population will starve next turn!"
   - **Button**: "Understood" (yellow)
   - **Sound**: Warning beep (optional)

### Alert Banner System

1. **Banner Display**
   - **Position**: Top of screen, below HUD (sticky)
   - **Height**: 40px
   - **Background**: Red gradient (pulsing animation)
   - **Text**: White, bold, centered
   - **Icon**: Warning triangle (⚠️)
   - **Example**: "⚠️ INVASION! Enemy fleet detected at Zeta Reticuli!"

2. **Banner Types**
   - **Resource Warning**: "LOW FOOD! 100 remaining (3 turns until starvation)"
   - **Combat Alert**: "INVASION! Enemy platoons landing on Vulcan Prime!"
   - **Deficit Alert**: "BANKRUPT! Credits: -500 (cannot afford construction)"
   - **Victory/Defeat**: "VICTORY IMMINENT! AI has 1 planet remaining!"

3. **Banner Management**
   - **Dismissible**: "X" button hides banner (right side)
   - **Reappears**: Banner shows again next turn if condition persists
   - **Multiple Banners**: Stack vertically (max 2 visible)
   - **Priority**: Critical banners replace lower-priority ones

### Event Log System

1. **Log Display**
   - **Panel**: Slide-in from right side (400px width)
   - **Toggle**: F1 key or "Log" button (HUD)
   - **Scrollable**: Infinite scroll (virtualized list)
   - **Timestamped**: "Turn 12, Action Phase: Mining Station complete"

2. **Event Categories**
   - **Combat** (Red): Battles, invasions, bombardments
   - **Economy** (Green): Construction, production, resources
   - **Military** (Orange): Platoon training, fleet movements
   - **Diplomacy** (Blue): AI actions, negotiations (future)
   - **System** (Gray): Turn advanced, game saved

3. **Log Filters**
   - **All Events**: Show everything (default)
   - **Combat Only**: Show battles and invasions
   - **Economy Only**: Show construction and production
   - **My Actions**: Show player actions only
   - **AI Actions**: Show AI opponent actions only

4. **Log Interactions**
   - **Click Event**: Jump to relevant screen (e.g., planet, galaxy view)
   - **Search**: Text search for keywords (e.g., "Vulcan Prime")
   - **Export**: Save log to text file (future feature)

### Turn Event Summary

1. **End Turn Summary** (Modal)
   - **Trigger**: After AI turn completes
   - **Title**: "Turn 13 Summary"
   - **Content**:
     - Income: +5,000 Credits, +500 Minerals, +300 Fuel
     - Construction: Mining Station complete on Vulcan Prime
     - AI Actions: AI built Battle Cruiser, AI attacked Zeta Reticuli
   - **Button**: "Continue" (proceed to player turn)

2. **Auto-Advance Setting**
   - **Option**: "Auto-skip turn summary" (default: OFF)
   - **Behavior**: If ON, summary auto-dismisses after 2 seconds
   - **Override**: Hold Space to pause auto-advance

---

## Acceptance Criteria

### Functional Criteria

- [ ] Toast notifications display for 3 seconds
- [ ] Modal dialogs block input until dismissed
- [ ] Alert banners persist until condition resolved
- [ ] Event log records all game events
- [ ] Toasts stack up to 3 visible
- [ ] Notifications color-coded by priority (red, yellow, blue, green)
- [ ] Event log filterable by category
- [ ] Click notification to jump to context (planet, galaxy view)
- [ ] Turn summary shows income, construction, AI actions

### Performance Criteria

- [ ] Toast animation smooth (60 FPS)
- [ ] Modal displays in <100ms
- [ ] Event log scrolling performs well (10,000+ events)
- [ ] No memory leaks from old notifications

### Integration Criteria

- [ ] Integrates with all game systems for event notifications
- [ ] Uses UI State Machine (AFS-071) for modals
- [ ] Overlays on HUD System (AFS-072)
- [ ] Subscribes to Game State Manager (AFS-001) events

---

## Technical Notes

### Implementation Approach

```csharp
public enum NotificationType
{
    Success,
    Info,
    Warning,
    Error
}

public enum NotificationPriority
{
    Low,       // Event log only
    Medium,    // Toast
    High,      // Alert banner
    Critical   // Modal dialog
}

public class NotificationSystem : MonoBehaviour
{
    private static NotificationSystem _instance;
    public static NotificationSystem Instance => _instance;

    [Header("Prefabs")]
    public GameObject toastPrefab;
    public GameObject modalPrefab;
    public GameObject bannerPrefab;

    [Header("Containers")]
    public Transform toastContainer;
    public Transform modalContainer;
    public Transform bannerContainer;

    private Queue<GameObject> _activeToasts = new Queue<GameObject>();
    private List<GameObject> _activeBanners = new List<GameObject>();
    private List<string> _eventLog = new List<string>();

    // Show toast notification
    public void ShowToast(string message, NotificationType type = NotificationType.Info)
    {
        // Limit to 3 toasts
        if (_activeToasts.Count >= 3)
        {
            var oldest = _activeToasts.Dequeue();
            Destroy(oldest);
        }

        // Create toast
        var toast = Instantiate(toastPrefab, toastContainer);
        var toastUI = toast.GetComponent<ToastUI>();
        toastUI.SetMessage(message, type);

        _activeToasts.Enqueue(toast);

        // Auto-dismiss after 3 seconds
        StartCoroutine(DismissToastAfterDelay(toast, 3f));

        // Add to event log
        LogEvent(message, GetCategoryFromType(type));
    }

    // Show modal dialog
    public void ShowModal(string title, string message, string buttonText = "OK", System.Action onConfirm = null)
    {
        var modal = Instantiate(modalPrefab, modalContainer);
        var modalUI = modal.GetComponent<ModalUI>();
        modalUI.SetContent(title, message, buttonText, onConfirm);

        // Dim background
        DimBackground(true);
    }

    // Show confirmation dialog
    public void ShowConfirmation(string title, string message, System.Action onConfirm, System.Action onCancel = null)
    {
        var modal = Instantiate(modalPrefab, modalContainer);
        var modalUI = modal.GetComponent<ConfirmationModalUI>();
        modalUI.SetContent(title, message, onConfirm, onCancel);

        DimBackground(true);
    }

    // Show alert banner
    public void ShowBanner(string message, NotificationPriority priority = NotificationPriority.High)
    {
        // Check if banner already exists
        var existing = _activeBanners.FirstOrDefault(b => b.GetComponent<BannerUI>().Message == message);
        if (existing != null)
            return; // Don't duplicate

        // Limit to 2 banners
        if (_activeBanners.Count >= 2)
        {
            Destroy(_activeBanners[0]);
            _activeBanners.RemoveAt(0);
        }

        // Create banner
        var banner = Instantiate(bannerPrefab, bannerContainer);
        var bannerUI = banner.GetComponent<BannerUI>();
        bannerUI.SetMessage(message, priority);
        bannerUI.OnDismissed += () => RemoveBanner(banner);

        _activeBanners.Add(banner);
    }

    // Dismiss banner (called when condition resolved)
    public void DismissBanner(string message)
    {
        var banner = _activeBanners.FirstOrDefault(b => b.GetComponent<BannerUI>().Message == message);
        if (banner != null)
        {
            RemoveBanner(banner);
        }
    }

    private void RemoveBanner(GameObject banner)
    {
        _activeBanners.Remove(banner);
        Destroy(banner);
    }

    // Log event to history
    public void LogEvent(string message, string category = "System")
    {
        int turn = TurnSystem.Instance.CurrentTurn;
        string phase = TurnSystem.Instance.CurrentPhase.ToString();
        string timestamp = $"Turn {turn}, {phase}";

        string logEntry = $"[{timestamp}] [{category}] {message}";
        _eventLog.Add(logEntry);

        Debug.Log(logEntry);
    }

    // Get event log (for UI display)
    public List<string> GetEventLog(string categoryFilter = null)
    {
        if (string.IsNullOrEmpty(categoryFilter))
            return _eventLog;

        return _eventLog.Where(e => e.Contains($"[{categoryFilter}]")).ToList();
    }

    private IEnumerator DismissToastAfterDelay(GameObject toast, float delay)
    {
        yield return new WaitForSeconds(delay);

        if (toast != null)
        {
            _activeToasts = new Queue<GameObject>(_activeToasts.Where(t => t != toast));
            Destroy(toast);
        }
    }

    private void DimBackground(bool dim)
    {
        // Show/hide dim overlay
        var overlay = GameObject.Find("DimOverlay");
        if (overlay != null)
        {
            overlay.SetActive(dim);
        }
    }

    private string GetCategoryFromType(NotificationType type)
    {
        switch (type)
        {
            case NotificationType.Success: return "Economy";
            case NotificationType.Warning: return "System";
            case NotificationType.Error: return "System";
            default: return "Info";
        }
    }
}
```

### Usage Examples

```csharp
// Toast notification (construction complete)
NotificationSystem.Instance.ShowToast("Mining Station complete on Vulcan Prime!", NotificationType.Success);

// Modal dialog (combat result)
NotificationSystem.Instance.ShowModal(
    "Battle Results",
    "Victory! Enemy fleet destroyed at Zeta Reticuli.",
    "Continue",
    onConfirm: () => Debug.Log("Player acknowledged combat result")
);

// Confirmation dialog (scrap building)
NotificationSystem.Instance.ShowConfirmation(
    "Scrap Building?",
    "Scrap Mining Station? Refund: 4,000 Credits",
    onConfirm: () => BuildingSystem.Instance.ScrapBuilding(planetID, buildingID),
    onCancel: () => Debug.Log("Scrapping cancelled")
);

// Alert banner (low food)
NotificationSystem.Instance.ShowBanner("⚠️ LOW FOOD! Starvation in 3 turns!", NotificationPriority.High);

// Dismiss banner (food surplus restored)
NotificationSystem.Instance.DismissBanner("⚠️ LOW FOOD! Starvation in 3 turns!");

// Event log
NotificationSystem.Instance.LogEvent("Player built Mining Station on Vulcan Prime", "Economy");
```

---

## Integration Points

### Depends On
- **AFS-001 (Game State Manager)**: Game events

### Depended On By
- **AFS-071 (UI State Machine)**: Modal display
- **AFS-072 (HUD System)**: Toast overlay
- **All Game Systems**: Event notifications

### Events Subscribed
- `BuildingSystem.OnBuildingCompleted`: Construction toast
- `CombatSystem.OnBattleEnded`: Combat modal
- `ResourceSystem.OnResourcesChanged`: Low resource banner
- `TurnSystem.OnTurnEnded`: Turn summary modal

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
