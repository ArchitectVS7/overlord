# AFS-005: Input System

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-CORE-005

---

## Summary

Cross-platform input abstraction layer that provides consistent interaction model across mouse/keyboard (PC), touchscreen (Mobile), and gamepad (PC optional), using Unity's Input System to handle device-specific controls and remapping.

---

## Dependencies

- **AFS-004 (Settings Manager)**: Control bindings and sensitivity settings
- **AFS-071 (UI State Machine)**: UI interaction handling

---

## Requirements

### Input Methods

1. **Mouse + Keyboard (PC)**
   - **Camera Control**: WASD or Arrow Keys for pan, Q/E or Mouse Wheel for zoom
   - **Selection**: Left-click to select entity/planet, Shift+Click for multi-select
   - **Commands**: Right-click for context menu, drag for area selection
   - **UI Navigation**: Mouse hover for tooltips, click for buttons
   - **Hotkeys**: Space (End Turn), F5 (Quick Save), F9 (Quick Load), Esc (Menu)
   - **Edge Scrolling**: Move mouse to screen edge to pan camera (optional)

2. **Touchscreen (Mobile)**
   - **Camera Control**: One-finger drag to pan, two-finger pinch to zoom, two-finger rotate for angle
   - **Selection**: Tap to select entity/planet, double-tap for quick actions
   - **Commands**: Long-press for context menu, swipe for navigation
   - **UI Navigation**: Tap buttons, scroll lists with swipe
   - **Gestures**: Pinch, drag, tap, long-press, swipe

3. **Gamepad (PC, Optional)**
   - **Camera Control**: Left stick to pan, Right stick to zoom/rotate, Triggers for fine control
   - **Selection**: A button to confirm, B button to cancel, D-Pad for navigation
   - **Commands**: X button for context menu, Y button for quick actions
   - **UI Navigation**: D-Pad or Left Stick, A to select, B to back

### Input Actions

1. **Core Actions** (must work on all input methods)
   - SelectEntity
   - CommandEntity
   - PanCamera
   - ZoomCamera
   - RotateCamera (mobile/gamepad only)
   - EndTurn
   - OpenMenu
   - QuickSave
   - QuickLoad
   - Cancel

2. **Contextual Actions** (available depending on selected entity)
   - BuildStructure
   - TrainPlatoon
   - PurchaseCraft
   - MoveFleet
   - AttackPlanet
   - SetTaxRate
   - DeployAtmosphereProcessor

3. **UI Actions**
   - Navigate (up/down/left/right)
   - Confirm
   - Cancel
   - TabNext
   - TabPrevious
   - ToggleFullscreen (PC only)

### Input Remapping

1. **Remappable Actions (PC)**
   - All keyboard keys can be remapped
   - Mouse buttons can be remapped (except left-click)
   - Conflict detection (warn if key already bound)
   - Reset to defaults option

2. **Sensitivity Settings**
   - Mouse sensitivity: 0.1-2.0 multiplier
   - Touch sensitivity: 0.5-2.0 multiplier
   - Gamepad sensitivity: 0.5-2.0 multiplier
   - Dead zone (gamepad): 0.0-0.5 range
   - Invert Y-axis toggle (gamepad/touch)

3. **Edge Scrolling (PC)**
   - Enable/disable toggle
   - Edge threshold: 5-50 pixels from screen edge
   - Scroll speed: Slow/Normal/Fast presets

### Input Feedback

1. **Visual Feedback**
   - Highlight selected entity
   - Show context menu on right-click/long-press
   - Tooltip on hover/tap
   - Cursor changes based on context (selection, command, invalid)
   - Touch indicators (show tap locations temporarily)

2. **Haptic Feedback (Mobile)**
   - Light haptic on tap
   - Medium haptic on long-press
   - Strong haptic on error (invalid action)
   - Disable option in settings

---

## Acceptance Criteria

### Functional Criteria

- [ ] Mouse + keyboard controls work on PC
- [ ] Touchscreen controls work on mobile
- [ ] Gamepad controls work on PC (optional)
- [ ] All core actions accessible on all input methods
- [ ] Key remapping works without conflicts (PC)
- [ ] Sensitivity settings apply correctly
- [ ] Edge scrolling works when enabled (PC)
- [ ] Haptic feedback works on supported devices (Mobile)
- [ ] Input system switches seamlessly when input device changes

### Performance Criteria

- [ ] Input latency: <16ms (1 frame at 60 FPS)
- [ ] No input lag during AI turn or combat
- [ ] Touch input responsive on 30 FPS mobile devices
- [ ] Gamepad input polling: 60Hz minimum

### Integration Criteria

- [ ] Integrates with Settings Manager (AFS-004) for bindings and sensitivity
- [ ] Provides input events to UI State Machine (AFS-071)
- [ ] Provides input events to Camera System (AFS-072)
- [ ] Provides input events to Entity Selection System (AFS-031)

---

## Technical Notes

### Implementation Approach

```csharp
using UnityEngine.InputSystem;

public class InputManager : MonoBehaviour
{
    private static InputManager _instance;
    public static InputManager Instance => _instance;

    private InputActions _inputActions;

    // Events for input actions
    public event Action<Vector2> OnCameraPan;
    public event Action<float> OnCameraZoom;
    public event Action<Vector2> OnPointerDown;
    public event Action<Vector2> OnPointerUp;
    public event Action OnEndTurn;
    public event Action OnOpenMenu;
    public event Action OnQuickSave;
    public event Action OnQuickLoad;

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeInput();
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void InitializeInput()
    {
        _inputActions = new InputActions();

        // Camera controls
        _inputActions.Gameplay.PanCamera.performed += ctx => OnCameraPan?.Invoke(ctx.ReadValue<Vector2>());
        _inputActions.Gameplay.ZoomCamera.performed += ctx => OnCameraZoom?.Invoke(ctx.ReadValue<float>());

        // Selection
        _inputActions.Gameplay.PointerDown.performed += ctx => OnPointerDown?.Invoke(ctx.ReadValue<Vector2>());
        _inputActions.Gameplay.PointerUp.performed += ctx => OnPointerUp?.Invoke(ctx.ReadValue<Vector2>());

        // Hotkeys
        _inputActions.Gameplay.EndTurn.performed += ctx => OnEndTurn?.Invoke();
        _inputActions.Gameplay.OpenMenu.performed += ctx => OnOpenMenu?.Invoke();
        _inputActions.Gameplay.QuickSave.performed += ctx => OnQuickSave?.Invoke();
        _inputActions.Gameplay.QuickLoad.performed += ctx => OnQuickLoad?.Invoke();

        _inputActions.Enable();
    }

    private void OnDestroy()
    {
        _inputActions?.Disable();
    }

    public void RebindKey(string actionName, int bindingIndex, InputBinding newBinding)
    {
        var action = _inputActions.asset.FindAction(actionName);
        if (action == null)
        {
            Debug.LogError($"Action {actionName} not found!");
            return;
        }

        action.ApplyBindingOverride(bindingIndex, newBinding);
        SettingsManager.Instance.SaveSettings();
    }

    public string GetBindingDisplayString(string actionName)
    {
        var action = _inputActions.asset.FindAction(actionName);
        return action?.GetBindingDisplayString() ?? "Unbound";
    }

    public void SetMouseSensitivity(float sensitivity)
    {
        // Applied in camera controller
    }

    public void SetTouchSensitivity(float sensitivity)
    {
        // Applied in touch input handler
    }

    public void EnableGameplayInput(bool enable)
    {
        if (enable)
            _inputActions.Gameplay.Enable();
        else
            _inputActions.Gameplay.Disable();
    }

    public void EnableUIInput(bool enable)
    {
        if (enable)
            _inputActions.UI.Enable();
        else
            _inputActions.UI.Disable();
    }
}
```

### Input Actions Asset

Create `InputActions.inputactions` file in Unity with these action maps:

**Gameplay Action Map:**
- PanCamera (WASD, Arrow Keys, Gamepad Left Stick, Touch Drag)
- ZoomCamera (Mouse Wheel, Q/E Keys, Gamepad Triggers, Touch Pinch)
- PointerDown (Mouse Left Click, Touch Tap)
- PointerUp (Mouse Release, Touch Release)
- ContextMenu (Mouse Right Click, Touch Long Press, Gamepad X)
- SelectAll (Ctrl+A, Gamepad Y)
- EndTurn (Space, Gamepad Start)
- OpenMenu (Escape, Gamepad Select)
- QuickSave (F5)
- QuickLoad (F9)

**UI Action Map:**
- Navigate (Arrow Keys, Gamepad D-Pad)
- Confirm (Enter, Gamepad A)
- Cancel (Escape, Gamepad B)
- TabNext (Tab)
- TabPrevious (Shift+Tab)
- Point (Mouse Position, Touch Position)
- Click (Mouse Left Click, Touch Tap)

### Touch Input Handler

```csharp
public class TouchInputHandler : MonoBehaviour
{
    private float _touchSensitivity = 1.0f;
    private Vector2 _lastTouchPosition;
    private float _lastPinchDistance;

    private void Update()
    {
        HandleTouchInput();
    }

    private void HandleTouchInput()
    {
        if (Input.touchCount == 0)
            return;

        // Single touch - pan camera
        if (Input.touchCount == 1)
        {
            Touch touch = Input.GetTouch(0);

            if (touch.phase == TouchPhase.Began)
            {
                _lastTouchPosition = touch.position;
            }
            else if (touch.phase == TouchPhase.Moved)
            {
                Vector2 delta = touch.position - _lastTouchPosition;
                delta *= _touchSensitivity;
                InputManager.Instance.OnCameraPan?.Invoke(delta);
                _lastTouchPosition = touch.position;
            }
            else if (touch.phase == TouchPhase.Ended)
            {
                // Tap to select
                InputManager.Instance.OnPointerUp?.Invoke(touch.position);
            }
        }
        // Two touches - pinch to zoom
        else if (Input.touchCount == 2)
        {
            Touch touch0 = Input.GetTouch(0);
            Touch touch1 = Input.GetTouch(1);

            if (touch0.phase == TouchPhase.Began || touch1.phase == TouchPhase.Began)
            {
                _lastPinchDistance = Vector2.Distance(touch0.position, touch1.position);
            }
            else if (touch0.phase == TouchPhase.Moved || touch1.phase == TouchPhase.Moved)
            {
                float currentDistance = Vector2.Distance(touch0.position, touch1.position);
                float delta = currentDistance - _lastPinchDistance;
                InputManager.Instance.OnCameraZoom?.Invoke(delta * 0.01f * _touchSensitivity);
                _lastPinchDistance = currentDistance;
            }
        }
    }

    public void SetSensitivity(float sensitivity)
    {
        _touchSensitivity = Mathf.Clamp(sensitivity, 0.5f, 2.0f);
    }

    public void TriggerHaptic(HapticStrength strength)
    {
        #if UNITY_IOS || UNITY_ANDROID
        if (SettingsManager.Instance.HapticFeedbackEnabled)
        {
            switch (strength)
            {
                case HapticStrength.Light:
                    Handheld.Vibrate();
                    break;
                case HapticStrength.Medium:
                    Handheld.Vibrate();
                    break;
                case HapticStrength.Strong:
                    Handheld.Vibrate();
                    break;
            }
        }
        #endif
    }
}

public enum HapticStrength { Light, Medium, Strong }
```

### Edge Scrolling (PC)

```csharp
public class EdgeScrolling : MonoBehaviour
{
    private bool _enabled = true;
    private float _edgeThreshold = 10f; // pixels
    private float _scrollSpeed = 1.0f;

    private void Update()
    {
        if (!_enabled || !Application.isFocused)
            return;

        Vector2 mousePos = Input.mousePosition;
        Vector2 scrollDirection = Vector2.zero;

        // Check screen edges
        if (mousePos.x < _edgeThreshold)
            scrollDirection.x = -1;
        else if (mousePos.x > Screen.width - _edgeThreshold)
            scrollDirection.x = 1;

        if (mousePos.y < _edgeThreshold)
            scrollDirection.y = -1;
        else if (mousePos.y > Screen.height - _edgeThreshold)
            scrollDirection.y = 1;

        if (scrollDirection != Vector2.zero)
        {
            InputManager.Instance.OnCameraPan?.Invoke(scrollDirection * _scrollSpeed);
        }
    }

    public void SetEnabled(bool enabled)
    {
        _enabled = enabled;
    }

    public void SetThreshold(float pixels)
    {
        _edgeThreshold = Mathf.Clamp(pixels, 5f, 50f);
    }

    public void SetSpeed(float speed)
    {
        _scrollSpeed = Mathf.Clamp(speed, 0.5f, 2.0f);
    }
}
```

### Gamepad Support

```csharp
public class GamepadInputHandler : MonoBehaviour
{
    private float _sensitivity = 1.0f;
    private float _deadZone = 0.2f;
    private bool _invertYAxis = false;

    private void Update()
    {
        if (!Gamepad.current.wasUpdatedThisFrame)
            return;

        // Camera pan with left stick
        Vector2 leftStick = Gamepad.current.leftStick.ReadValue();
        if (leftStick.magnitude > _deadZone)
        {
            if (_invertYAxis)
                leftStick.y = -leftStick.y;

            InputManager.Instance.OnCameraPan?.Invoke(leftStick * _sensitivity);
        }

        // Camera zoom with triggers
        float leftTrigger = Gamepad.current.leftTrigger.ReadValue();
        float rightTrigger = Gamepad.current.rightTrigger.ReadValue();
        float zoomDelta = (rightTrigger - leftTrigger) * _sensitivity;
        if (Mathf.Abs(zoomDelta) > 0.01f)
        {
            InputManager.Instance.OnCameraZoom?.Invoke(zoomDelta);
        }

        // Buttons handled by Input Actions
    }

    public void SetSensitivity(float sensitivity)
    {
        _sensitivity = Mathf.Clamp(sensitivity, 0.5f, 2.0f);
    }

    public void SetDeadZone(float deadZone)
    {
        _deadZone = Mathf.Clamp(deadZone, 0.0f, 0.5f);
    }

    public void SetInvertYAxis(bool invert)
    {
        _invertYAxis = invert;
    }
}
```

---

## Integration Points

### Depends On
- **AFS-004 (Settings Manager)**: Control bindings and sensitivity settings

### Depended On By
- **AFS-071 (UI State Machine)**: UI interaction events
- **AFS-072 (Camera System)**: Camera control events
- **AFS-031 (Entity System)**: Entity selection events
- **AFS-002 (Turn System)**: End Turn button

### Events Published
- `OnCameraPan(Vector2 delta)`: Camera pan request
- `OnCameraZoom(float delta)`: Camera zoom request
- `OnPointerDown(Vector2 position)`: Selection started
- `OnPointerUp(Vector2 position)`: Selection ended
- `OnEndTurn()`: Player pressed End Turn
- `OnOpenMenu()`: Player opened menu
- `OnQuickSave()`: Player pressed Quick Save
- `OnQuickLoad()`: Player pressed Quick Load

---

**Last Updated:** December 6, 2025
**Review Status:** Awaiting Technical Review
