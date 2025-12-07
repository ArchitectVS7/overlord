# Unity Integration Strategy

**Version:** 1.0
**Last Updated:** 2025-12-06
**Status:** Planning Phase

## Table of Contents

1. [Overview](#overview)
2. [Development Loop with Syntax Validation](#development-loop-with-syntax-validation)
3. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
4. [Critical Unity Syntax Rules](#critical-unity-syntax-rules)
5. [Code Samples](#code-samples)
6. [Testing Strategy](#testing-strategy)
7. [Risk Mitigation](#risk-mitigation)

---

## Overview

### Architecture Principles

This Unity integration follows a **strict platform-agnostic architecture**:

```
Overlord.Core (netstandard2.1) → All game logic, models, systems
         ↓
Overlord.Unity (Unity 6) → Thin presentation layer only
```

**Critical Rules:**
- Unity scripts are **thin wrappers** that subscribe to Core events
- NO game logic in Unity scripts
- Unity scripts only handle: rendering, input, UI updates, audio
- All state lives in `Overlord.Core.GameState`
- Communication is **one-way**: Core fires events → Unity responds

### Current State

**Implemented:**
- ✅ GameManager.cs (singleton coordinator)
- ✅ Overlord.Core.dll integration
- ✅ System.Text.Json.dll dependency

**Missing:**
- ❌ Scene setup
- ❌ UI system (menus, HUD, planet panels)
- ❌ Camera system
- ❌ Galaxy map visualization
- ❌ Input handling
- ❌ Audio system
- ❌ Visual feedback (particles, animations)

### Goal

Create a **minimal viable Unity integration** that demonstrates:
1. Main menu → New Game flow
2. Galaxy map visualization
3. Turn system integration
4. Basic planet interaction
5. Resource display
6. End turn functionality

**NOT in scope yet:** Combat animations, advanced UI, art polish, sound effects

---

## Development Loop with Syntax Validation

### The Problem

Unity's strict C# compiler will cascade small syntax errors into 100+ error messages. A single misplaced `}` can break the entire project.

### The Solution: Short Iterations + Pre-Validation

**Step-by-Step Loop:**

```
1. Write ONE small script (50-100 lines max)
   ↓
2. MANUAL SYNTAX CHECK (see rules below)
   ↓
3. Copy into Unity Assets folder
   ↓
4. Open Unity → Wait for compilation
   ↓
5. If errors: FIX immediately (don't add more code)
   ↓
6. Only proceed to next script when current compiles
```

**Pre-Validation Checklist:**

Before adding any script to Unity, verify:

- [ ] Every `{` has a matching `}`
- [ ] Every method has return type or `void`
- [ ] All `using` statements at top
- [ ] Namespace matches folder structure
- [ ] Class name matches filename exactly
- [ ] No missing semicolons
- [ ] All MonoBehaviour methods are spelled correctly
- [ ] All Core types are fully qualified or imported

**Use a Code Validator Tool:**

```bash
# Before copying to Unity, validate syntax
csc /target:library /out:temp.dll YourScript.cs

# If this fails, fix before adding to Unity
```

---

## Phase-by-Phase Implementation

### Phase 1: Scene Setup (1 script)

**Goal:** Create base scene with GameManager

**Files to Create:**
1. `Scenes/MainMenu.unity`
2. `Scenes/GalaxyMap.unity`

**Steps:**
1. Create MainMenu scene
2. Add GameObject with GameManager.cs
3. Test scene loads
4. Verify GameManager singleton works

**Validation:** Console shows "GameManager initialized"

---

### Phase 2: Main Menu UI (3 scripts)

**Goal:** Simple menu to start new game

**Files to Create:**
1. `Scripts/UI/MainMenuUI.cs` (MonoBehaviour)
2. `Scripts/UI/UIManager.cs` (Singleton)
3. `Scripts/UI/ButtonHandler.cs` (Helper)

**Components:**
- Title text
- "New Game" button
- "Load Game" button (disabled)
- "Quit" button

**Validation:** Clicking "New Game" calls `GameManager.NewGame()` and loads GalaxyMap scene

---

### Phase 3: Camera System (2 scripts)

**Goal:** Orthographic camera for galaxy map

**Files to Create:**
1. `Scripts/Camera/GalaxyCameraController.cs`
2. `Scripts/Camera/CameraInputHandler.cs`

**Features:**
- Orthographic view
- WASD pan
- Mouse wheel zoom
- Click and drag (optional)

**Validation:** Camera moves smoothly, zooms without jitter

---

### Phase 4: Galaxy Map Visualization (3 scripts)

**Goal:** Display planets as simple circles

**Files to Create:**
1. `Scripts/Galaxy/GalaxyMapManager.cs`
2. `Scripts/Galaxy/PlanetVisual.cs`
3. `Scripts/Galaxy/PlanetFactory.cs`

**Features:**
- Generate planet visuals from Core.GameState
- Color-code by owner (Player=Blue, AI=Red, Neutral=Gray)
- Display planet name on hover
- Click to select

**Validation:** All planets appear on map, colors match ownership

---

### Phase 5: Planet Panel UI (2 scripts)

**Goal:** Show planet details when selected

**Files to Create:**
1. `Scripts/UI/PlanetPanelUI.cs`
2. `Scripts/UI/ResourceDisplayUI.cs`

**Features:**
- Planet name and stats
- Resource production
- Building list
- Fleet list
- "Build" buttons (placeholder)

**Validation:** Clicking planet shows correct data from Core

---

### Phase 6: Turn System Integration (2 scripts)

**Goal:** End Turn button and phase feedback

**Files to Create:**
1. `Scripts/UI/TurnUI.cs`
2. `Scripts/UI/PhaseIndicatorUI.cs`

**Features:**
- Current turn number display
- Current phase display
- "End Turn" button
- Phase transition animation

**Validation:** End Turn advances Core.TurnSystem, UI updates

---

### Phase 7: Input System (1 script)

**Goal:** Centralized input handling

**Files to Create:**
1. `Scripts/Input/InputManager.cs`

**Features:**
- Unity Input System integration
- Action maps (UI, Gameplay, Camera)
- Event delegation

**Validation:** All input flows through InputManager

---

### Phase 8: Audio Manager (1 script)

**Goal:** Basic audio playback (placeholders)

**Files to Create:**
1. `Scripts/Audio/AudioManager.cs`

**Features:**
- Play SFX
- Play music
- Volume control
- Audio source pooling

**Validation:** Can trigger test sounds

---

## Critical Unity Syntax Rules

### Rule 1: Exact Case Sensitivity

```csharp
// WRONG
void awake() { }        // Unity won't call this
void Start() { }         // Correct, but inconsistent

// CORRECT
void Awake() { }
void Start() { }
```

### Rule 2: MonoBehaviour Lifecycle

```csharp
// CORRECT order
void Awake() { }        // First
void OnEnable() { }     // Second
void Start() { }        // Third
void Update() { }       // Every frame
void OnDisable() { }    // On disable
void OnDestroy() { }    // Last
```

### Rule 3: Serialized Fields

```csharp
// CORRECT
[SerializeField] private Button startButton;

// WRONG (not visible in Inspector)
private Button startButton;

// ALSO WRONG (public breaks encapsulation)
public Button startButton;
```

### Rule 4: Namespace Matching

```csharp
// File: Assets/Scripts/UI/MainMenuUI.cs

// CORRECT
namespace Overlord.Unity.UI
{
    public class MainMenuUI : MonoBehaviour { }
}

// WRONG (namespace doesn't match folder)
namespace Overlord.Unity
{
    public class MainMenuUI : MonoBehaviour { }
}
```

### Rule 5: GetComponent Pattern

```csharp
// CORRECT
private Button button;

void Awake()
{
    button = GetComponent<Button>();
    if (button == null)
    {
        Debug.LogError("Button component not found!");
    }
}

// WRONG (null reference if component missing)
void Start()
{
    GetComponent<Button>().onClick.AddListener(OnClick);
}
```

### Rule 6: Event Subscription Safety

```csharp
// CORRECT
void OnEnable()
{
    GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
}

void OnDisable()
{
    if (GameManager.Instance != null && GameManager.Instance.TurnSystem != null)
    {
        GameManager.Instance.TurnSystem.OnTurnEnded -= HandleTurnEnded;
    }
}

// WRONG (memory leak, double subscription)
void Start()
{
    GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
}
```

### Rule 7: Null Checks for Core References

```csharp
// CORRECT
public void UpdateDisplay()
{
    if (GameManager.Instance == null)
    {
        Debug.LogWarning("GameManager not initialized");
        return;
    }

    var gameState = GameManager.Instance.GameState;
    if (gameState == null)
    {
        Debug.LogWarning("GameState not initialized");
        return;
    }

    // Now safe to use
    turnText.text = $"Turn {gameState.CurrentTurn}";
}

// WRONG (NullReferenceException)
public void UpdateDisplay()
{
    turnText.text = $"Turn {GameManager.Instance.GameState.CurrentTurn}";
}
```

### Rule 8: String Formatting

```csharp
// CORRECT
Debug.Log($"Planet {planet.Name} has {planet.Population} population");

// ALSO CORRECT
Debug.Log(string.Format("Planet {0} has {1} population", planet.Name, planet.Population));

// WRONG (concatenation is slow)
Debug.Log("Planet " + planet.Name + " has " + planet.Population + " population");
```

### Rule 9: Coroutine Pattern

```csharp
// CORRECT
private Coroutine fadeCoroutine;

public void FadeIn()
{
    if (fadeCoroutine != null)
    {
        StopCoroutine(fadeCoroutine);
    }
    fadeCoroutine = StartCoroutine(FadeCoroutine(1f));
}

IEnumerator FadeCoroutine(float targetAlpha)
{
    while (canvasGroup.alpha < targetAlpha)
    {
        canvasGroup.alpha += Time.deltaTime;
        yield return null;
    }
}

// WRONG (can't stop, multiple instances)
public void FadeIn()
{
    StartCoroutine(FadeCoroutine(1f));
}
```

### Rule 10: Static References to MonoBehaviour

```csharp
// CORRECT (Singleton pattern)
public class UIManager : MonoBehaviour
{
    private static UIManager _instance;

    public static UIManager Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = FindFirstObjectByType<UIManager>();
            }
            return _instance;
        }
    }

    void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        }
        _instance = this;
        DontDestroyOnLoad(gameObject);
    }
}

// WRONG (race conditions, null references)
public static UIManager instance;
void Awake() { instance = this; }
```

---

## Code Samples

### Sample 1: MainMenuUI.cs

```csharp
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

namespace Overlord.Unity.UI
{
    /// <summary>
    /// Main menu UI controller.
    /// Handles menu interactions and scene transitions.
    /// </summary>
    public class MainMenuUI : MonoBehaviour
    {
        #region Serialized Fields

        [Header("UI References")]
        [SerializeField] private Button newGameButton;
        [SerializeField] private Button loadGameButton;
        [SerializeField] private Button quitButton;
        [SerializeField] private TMP_Text titleText;

        [Header("Settings")]
        [SerializeField] private string galaxyMapSceneName = "GalaxyMap";

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            ValidateReferences();
        }

        void Start()
        {
            SetupButtons();
            loadGameButton.interactable = false; // Not implemented yet
        }

        #endregion

        #region Setup

        private void ValidateReferences()
        {
            if (newGameButton == null)
            {
                Debug.LogError("NewGameButton not assigned in Inspector!");
            }
            if (loadGameButton == null)
            {
                Debug.LogError("LoadGameButton not assigned in Inspector!");
            }
            if (quitButton == null)
            {
                Debug.LogError("QuitButton not assigned in Inspector!");
            }
            if (titleText == null)
            {
                Debug.LogError("TitleText not assigned in Inspector!");
            }
        }

        private void SetupButtons()
        {
            newGameButton.onClick.AddListener(OnNewGameClicked);
            loadGameButton.onClick.AddListener(OnLoadGameClicked);
            quitButton.onClick.AddListener(OnQuitClicked);
        }

        #endregion

        #region Button Handlers

        private void OnNewGameClicked()
        {
            Debug.Log("New Game clicked");

            // Initialize Core systems
            GameManager.Instance.NewGame();

            // Load galaxy map scene
            SceneManager.LoadScene(galaxyMapSceneName);
        }

        private void OnLoadGameClicked()
        {
            Debug.Log("Load Game clicked (not implemented)");
            // TODO: Show file browser, load save
        }

        private void OnQuitClicked()
        {
            Debug.Log("Quit clicked");

            #if UNITY_EDITOR
                UnityEditor.EditorApplication.isPlaying = false;
            #else
                Application.Quit();
            #endif
        }

        #endregion
    }
}
```

**Usage:**
1. Create Canvas in MainMenu scene
2. Add this script to Canvas
3. Create 3 buttons as children
4. Assign in Inspector

---

### Sample 2: GalaxyCameraController.cs

```csharp
using UnityEngine;

namespace Overlord.Unity.Camera
{
    /// <summary>
    /// Controls orthographic camera for galaxy map.
    /// Handles pan, zoom, and bounds.
    /// </summary>
    [RequireComponent(typeof(UnityEngine.Camera))]
    public class GalaxyCameraController : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Zoom Settings")]
        [SerializeField] private float minZoom = 2f;
        [SerializeField] private float maxZoom = 20f;
        [SerializeField] private float zoomSpeed = 2f;

        [Header("Pan Settings")]
        [SerializeField] private float panSpeed = 10f;
        [SerializeField] private bool enableEdgePanning = true;
        [SerializeField] private float edgePanThreshold = 20f;

        [Header("Bounds")]
        [SerializeField] private Vector2 minBounds = new Vector2(-50f, -50f);
        [SerializeField] private Vector2 maxBounds = new Vector2(50f, 50f);

        #endregion

        #region Private Fields

        private UnityEngine.Camera cam;
        private Vector3 dragOrigin;
        private bool isDragging;

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            cam = GetComponent<UnityEngine.Camera>();
            if (cam == null)
            {
                Debug.LogError("Camera component not found!");
            }

            // Ensure orthographic mode
            cam.orthographic = true;
        }

        void Update()
        {
            HandleZoom();
            HandlePan();
            ClampPosition();
        }

        #endregion

        #region Zoom

        private void HandleZoom()
        {
            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.01f)
            {
                cam.orthographicSize -= scroll * zoomSpeed;
                cam.orthographicSize = Mathf.Clamp(cam.orthographicSize, minZoom, maxZoom);
            }
        }

        #endregion

        #region Pan

        private void HandlePan()
        {
            Vector3 movement = Vector3.zero;

            // WASD panning
            if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow))
            {
                movement.y += panSpeed * Time.deltaTime;
            }
            if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow))
            {
                movement.y -= panSpeed * Time.deltaTime;
            }
            if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow))
            {
                movement.x -= panSpeed * Time.deltaTime;
            }
            if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow))
            {
                movement.x += panSpeed * Time.deltaTime;
            }

            // Edge panning
            if (enableEdgePanning)
            {
                Vector3 mousePos = Input.mousePosition;
                if (mousePos.x < edgePanThreshold)
                {
                    movement.x -= panSpeed * Time.deltaTime;
                }
                if (mousePos.x > Screen.width - edgePanThreshold)
                {
                    movement.x += panSpeed * Time.deltaTime;
                }
                if (mousePos.y < edgePanThreshold)
                {
                    movement.y -= panSpeed * Time.deltaTime;
                }
                if (mousePos.y > Screen.height - edgePanThreshold)
                {
                    movement.y += panSpeed * Time.deltaTime;
                }
            }

            // Mouse drag panning
            if (Input.GetMouseButtonDown(2)) // Middle mouse button
            {
                dragOrigin = cam.ScreenToWorldPoint(Input.mousePosition);
                isDragging = true;
            }

            if (Input.GetMouseButton(2) && isDragging)
            {
                Vector3 currentPos = cam.ScreenToWorldPoint(Input.mousePosition);
                Vector3 difference = dragOrigin - currentPos;
                movement += difference;
                dragOrigin = cam.ScreenToWorldPoint(Input.mousePosition);
            }

            if (Input.GetMouseButtonUp(2))
            {
                isDragging = false;
            }

            // Apply movement
            transform.position += movement;
        }

        #endregion

        #region Bounds

        private void ClampPosition()
        {
            Vector3 pos = transform.position;
            pos.x = Mathf.Clamp(pos.x, minBounds.x, maxBounds.x);
            pos.y = Mathf.Clamp(pos.y, minBounds.y, maxBounds.y);
            transform.position = pos;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Centers camera on world position.
        /// </summary>
        public void CenterOn(Vector2 worldPosition)
        {
            Vector3 pos = transform.position;
            pos.x = worldPosition.x;
            pos.y = worldPosition.y;
            transform.position = pos;
            ClampPosition();
        }

        #endregion
    }
}
```

**Usage:**
1. Add to Main Camera in GalaxyMap scene
2. Configure bounds to match galaxy size
3. Adjust zoom/pan speeds to taste

---

### Sample 3: PlanetVisual.cs

```csharp
using UnityEngine;
using Overlord.Core.Models;

namespace Overlord.Unity.Galaxy
{
    /// <summary>
    /// Visual representation of a planet on the galaxy map.
    /// Subscribes to Core.Planet changes and updates appearance.
    /// </summary>
    public class PlanetVisual : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Visual Settings")]
        [SerializeField] private SpriteRenderer planetSprite;
        [SerializeField] private float baseScale = 1f;
        [SerializeField] private Color playerColor = Color.blue;
        [SerializeField] private Color aiColor = Color.red;
        [SerializeField] private Color neutralColor = Color.gray;

        [Header("Interaction")]
        [SerializeField] private GameObject selectionRing;

        #endregion

        #region Private Fields

        private Planet corePlanet;
        private int planetID;
        private bool isSelected;

        #endregion

        #region Properties

        public int PlanetID => planetID;
        public Planet CorePlanet => corePlanet;
        public bool IsSelected => isSelected;

        #endregion

        #region Initialization

        /// <summary>
        /// Initializes planet visual from Core.Planet data.
        /// </summary>
        public void Initialize(Planet planet)
        {
            if (planet == null)
            {
                Debug.LogError("Cannot initialize PlanetVisual with null planet!");
                return;
            }

            corePlanet = planet;
            planetID = planet.ID;

            // Set name for debugging
            gameObject.name = $"Planet_{planet.Name}";

            // Position from Core
            transform.position = new Vector3(planet.X, planet.Y, 0f);

            // Update visual
            UpdateVisual();

            // Hide selection ring initially
            if (selectionRing != null)
            {
                selectionRing.SetActive(false);
            }
        }

        #endregion

        #region Visual Update

        /// <summary>
        /// Updates visual appearance based on Core planet state.
        /// </summary>
        public void UpdateVisual()
        {
            if (corePlanet == null)
            {
                return;
            }

            // Color by owner
            Color color = neutralColor;
            if (corePlanet.Owner == FactionType.Player)
            {
                color = playerColor;
            }
            else if (corePlanet.Owner == FactionType.AI)
            {
                color = aiColor;
            }

            if (planetSprite != null)
            {
                planetSprite.color = color;
            }

            // Scale by population (optional)
            float scale = baseScale + (corePlanet.Population / 1000000f) * 0.2f;
            transform.localScale = Vector3.one * Mathf.Clamp(scale, baseScale, baseScale * 2f);
        }

        #endregion

        #region Selection

        /// <summary>
        /// Sets selection state.
        /// </summary>
        public void SetSelected(bool selected)
        {
            isSelected = selected;
            if (selectionRing != null)
            {
                selectionRing.SetActive(selected);
            }
        }

        #endregion

        #region Mouse Interaction

        void OnMouseEnter()
        {
            // TODO: Show tooltip with planet name
            Debug.Log($"Mouse over {corePlanet.Name}");
        }

        void OnMouseExit()
        {
            // TODO: Hide tooltip
        }

        void OnMouseDown()
        {
            // Notify GalaxyMapManager
            var mapManager = FindFirstObjectByType<GalaxyMapManager>();
            if (mapManager != null)
            {
                mapManager.OnPlanetClicked(this);
            }
        }

        #endregion
    }
}
```

**Usage:**
1. Create prefab: Sprite (circle) + SpriteRenderer + CircleCollider2D
2. Add this script
3. Assign planetSprite and selectionRing
4. GalaxyMapManager instantiates from prefab

---

### Sample 4: TurnUI.cs

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Overlord.Core;

namespace Overlord.Unity.UI
{
    /// <summary>
    /// Displays turn information and handles End Turn button.
    /// </summary>
    public class TurnUI : MonoBehaviour
    {
        #region Serialized Fields

        [Header("UI References")]
        [SerializeField] private TMP_Text turnNumberText;
        [SerializeField] private TMP_Text phaseText;
        [SerializeField] private Button endTurnButton;

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            ValidateReferences();
        }

        void Start()
        {
            SetupButton();
            UpdateDisplay();
        }

        void OnEnable()
        {
            SubscribeToEvents();
        }

        void OnDisable()
        {
            UnsubscribeFromEvents();
        }

        #endregion

        #region Setup

        private void ValidateReferences()
        {
            if (turnNumberText == null)
            {
                Debug.LogError("TurnNumberText not assigned!");
            }
            if (phaseText == null)
            {
                Debug.LogError("PhaseText not assigned!");
            }
            if (endTurnButton == null)
            {
                Debug.LogError("EndTurnButton not assigned!");
            }
        }

        private void SetupButton()
        {
            if (endTurnButton != null)
            {
                endTurnButton.onClick.AddListener(OnEndTurnClicked);
            }
        }

        #endregion

        #region Event Subscription

        private void SubscribeToEvents()
        {
            if (GameManager.Instance != null && GameManager.Instance.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged += HandlePhaseChanged;
                GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
            }
        }

        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance != null && GameManager.Instance.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged -= HandlePhaseChanged;
                GameManager.Instance.TurnSystem.OnTurnEnded -= HandleTurnEnded;
            }
        }

        #endregion

        #region Display Update

        private void UpdateDisplay()
        {
            if (GameManager.Instance == null || GameManager.Instance.GameState == null)
            {
                return;
            }

            var gameState = GameManager.Instance.GameState;
            var turnSystem = GameManager.Instance.TurnSystem;

            if (turnNumberText != null)
            {
                turnNumberText.text = $"Turn {gameState.CurrentTurn}";
            }

            if (phaseText != null && turnSystem != null)
            {
                phaseText.text = $"Phase: {turnSystem.CurrentPhase}";
            }
        }

        #endregion

        #region Event Handlers

        private void HandlePhaseChanged(TurnPhase phase)
        {
            Debug.Log($"Phase changed to {phase}");
            UpdateDisplay();
        }

        private void HandleTurnEnded(int turn)
        {
            Debug.Log($"Turn {turn} ended");
            UpdateDisplay();
        }

        private void OnEndTurnClicked()
        {
            Debug.Log("End Turn clicked");

            if (GameManager.Instance != null)
            {
                GameManager.Instance.EndTurn();
            }
        }

        #endregion
    }
}
```

**Usage:**
1. Add to Canvas in GalaxyMap scene
2. Create UI panel with turn text and button
3. Assign references in Inspector

---

## Testing Strategy

### Unit Testing (Core)

All Core systems already have tests. Run before each Unity session:

```bash
cd Overlord.Core.Tests
dotnet test
```

**Required:** All tests must pass before Unity work.

### Unity Manual Testing

After each script addition, test:

1. **Compilation Test**
   - Open Unity
   - Wait for compilation
   - Console shows 0 errors

2. **Runtime Test**
   - Enter Play mode
   - Check console for initialization logs
   - Verify GameManager singleton

3. **Integration Test**
   - Test UI interactions
   - Verify Core events fire
   - Check UI updates from Core

### Validation Checklist per Phase

**Phase 1 (Scene Setup):**
- [ ] MainMenu scene loads
- [ ] GameManager initializes
- [ ] Console shows "GameManager initialized"

**Phase 2 (Main Menu):**
- [ ] Menu UI visible
- [ ] New Game button clickable
- [ ] NewGame() called on click
- [ ] Scene transitions to GalaxyMap

**Phase 3 (Camera):**
- [ ] Camera pans with WASD
- [ ] Camera zooms with mouse wheel
- [ ] Movement stays in bounds

**Phase 4 (Galaxy Map):**
- [ ] All planets render
- [ ] Colors match ownership
- [ ] Hover shows planet name
- [ ] Click selects planet

**Phase 5 (Planet Panel):**
- [ ] Panel shows on planet click
- [ ] Data matches Core.Planet
- [ ] Resources display correctly

**Phase 6 (Turn System):**
- [ ] Turn number displays
- [ ] Phase displays
- [ ] End Turn advances turn
- [ ] AI executes after player

---

## Risk Mitigation

### Risk 1: Cascading Syntax Errors

**Mitigation:**
- Write 50-100 lines at a time
- Pre-validate before adding to Unity
- Fix errors before adding new code
- Use syntax validation tool

### Risk 2: Null Reference Exceptions

**Mitigation:**
- Always null-check Core references
- Validate Inspector assignments in Awake()
- Use Debug.LogError for missing references
- Test in Play mode after every change

### Risk 3: Event Subscription Leaks

**Mitigation:**
- Subscribe in OnEnable, unsubscribe in OnDisable
- Null-check before unsubscribe
- Use weak references if needed
- Monitor memory in Profiler

### Risk 4: Core/Unity Version Mismatch

**Mitigation:**
- Rebuild Overlord.Core.dll before Unity work
- Copy to Assets/Plugins/Overlord.Core/
- Restart Unity after DLL update
- Check Unity console for CS1705 errors

### Risk 5: Scene References Break

**Mitigation:**
- Use [SerializeField] for all Unity references
- Validate in Awake()
- Use prefabs for reusable objects
- Avoid Find() calls in Update()

### Risk 6: Performance Issues

**Mitigation:**
- Profile early and often
- Cache component references
- Avoid allocations in Update()
- Use object pooling for instantiated objects

---

## Next Steps

1. Review this strategy document
2. Create asset specifications (see unity-asset-specifications.md)
3. Begin Phase 1 implementation
4. Test each phase before proceeding
5. Iterate based on findings

**Remember:** Short iterations, validate syntax, test frequently, fix immediately.
