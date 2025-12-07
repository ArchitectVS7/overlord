# Unity Development Quick Reference

**Version:** 1.0
**Last Updated:** 2025-12-06
**Purpose:** Fast reference for common Unity patterns and syntax validation

---

## Table of Contents

1. [Pre-Flight Checklist](#pre-flight-checklist)
2. [Script Templates](#script-templates)
3. [Common Patterns](#common-patterns)
4. [Syntax Validation](#syntax-validation)
5. [Debugging Tips](#debugging-tips)
6. [Common Errors](#common-errors)

---

## Pre-Flight Checklist

Before adding ANY script to Unity:

- [ ] File name matches class name exactly
- [ ] Namespace matches folder structure
- [ ] All `{` have matching `}`
- [ ] All methods have return type or `void`
- [ ] All `using` statements at top
- [ ] MonoBehaviour methods spelled correctly (Awake, Start, Update, OnEnable, OnDisable, OnDestroy)
- [ ] No missing semicolons
- [ ] SerializeField attributes for Inspector fields
- [ ] Null checks for all external references

**Validate before copying to Unity:**
```bash
# Run C# compiler check (if available)
csc /target:library /nologo /out:temp.dll YourScript.cs

# Or use Unity's script updater
# (Requires Unity installation)
```

---

## Script Templates

### Template 1: Basic MonoBehaviour

```csharp
using UnityEngine;

namespace Overlord.Unity.CategoryName
{
    /// <summary>
    /// Brief description of what this script does.
    /// </summary>
    public class ScriptName : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Settings")]
        [SerializeField] private float exampleValue = 1.0f;

        #endregion

        #region Private Fields

        private bool isInitialized;

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            // Initialize components
        }

        void Start()
        {
            // Initialize after all Awake() calls
        }

        void Update()
        {
            // Per-frame logic
        }

        #endregion

        #region Private Methods

        private void ExampleMethod()
        {
            // Implementation
        }

        #endregion

        #region Public Methods

        public void PublicMethod()
        {
            // Public API
        }

        #endregion
    }
}
```

---

### Template 2: UI Controller

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace Overlord.Unity.UI
{
    /// <summary>
    /// Controls [specific UI element].
    /// </summary>
    public class UIControllerName : MonoBehaviour
    {
        #region Serialized Fields

        [Header("UI References")]
        [SerializeField] private Button exampleButton;
        [SerializeField] private TMP_Text exampleText;

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            ValidateReferences();
        }

        void Start()
        {
            SetupUI();
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
            if (exampleButton == null)
            {
                Debug.LogError("ExampleButton not assigned!");
            }
            if (exampleText == null)
            {
                Debug.LogError("ExampleText not assigned!");
            }
        }

        private void SetupUI()
        {
            if (exampleButton != null)
            {
                exampleButton.onClick.AddListener(OnButtonClicked);
            }
        }

        #endregion

        #region Event Subscription

        private void SubscribeToEvents()
        {
            // Subscribe to Core events
            if (GameManager.Instance != null)
            {
                // Example: GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
            }
        }

        private void UnsubscribeFromEvents()
        {
            // Unsubscribe with null checks
            if (GameManager.Instance != null)
            {
                // Example: GameManager.Instance.TurnSystem.OnTurnEnded -= HandleTurnEnded;
            }
        }

        #endregion

        #region Event Handlers

        private void OnButtonClicked()
        {
            Debug.Log("Button clicked");
            // Handle button click
        }

        #endregion

        #region Display Update

        public void UpdateDisplay()
        {
            if (GameManager.Instance == null || GameManager.Instance.GameState == null)
            {
                return;
            }

            // Update UI from Core state
            if (exampleText != null)
            {
                exampleText.text = "Example";
            }
        }

        #endregion
    }
}
```

---

### Template 3: Manager (Singleton)

```csharp
using UnityEngine;

namespace Overlord.Unity.Managers
{
    /// <summary>
    /// Manages [specific system].
    /// </summary>
    public class ManagerName : MonoBehaviour
    {
        #region Singleton

        private static ManagerName _instance;

        public static ManagerName Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<ManagerName>();
                    if (_instance == null)
                    {
                        var go = new GameObject("ManagerName");
                        _instance = go.AddComponent<ManagerName>();
                    }
                }
                return _instance;
            }
        }

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            // Enforce singleton
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);

            Initialize();
        }

        void OnDestroy()
        {
            if (_instance == this)
            {
                _instance = null;
            }
        }

        #endregion

        #region Initialization

        private void Initialize()
        {
            // Initialize manager
            Debug.Log($"{nameof(ManagerName)} initialized");
        }

        #endregion

        #region Public API

        public void DoSomething()
        {
            // Public method
        }

        #endregion
    }
}
```

---

### Template 4: Visual Component (Planet, Ship, etc.)

```csharp
using UnityEngine;
using Overlord.Core.Models;

namespace Overlord.Unity.Visuals
{
    /// <summary>
    /// Visual representation of [Core object].
    /// </summary>
    public class VisualName : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Visual Components")]
        [SerializeField] private SpriteRenderer spriteRenderer;

        [Header("Settings")]
        [SerializeField] private float baseScale = 1.0f;

        #endregion

        #region Private Fields

        private Planet coreObject; // Replace Planet with actual Core type
        private int objectID;

        #endregion

        #region Properties

        public int ObjectID => objectID;

        #endregion

        #region Initialization

        /// <summary>
        /// Initializes visual from Core object data.
        /// </summary>
        public void Initialize(Planet coreObj) // Replace Planet with actual type
        {
            if (coreObj == null)
            {
                Debug.LogError("Cannot initialize with null Core object!");
                return;
            }

            coreObject = coreObj;
            objectID = coreObj.ID;

            gameObject.name = $"{GetType().Name}_{coreObj.Name}";

            UpdateVisual();
        }

        #endregion

        #region Visual Update

        /// <summary>
        /// Updates visual based on Core object state.
        /// </summary>
        public void UpdateVisual()
        {
            if (coreObject == null)
            {
                return;
            }

            // Update appearance from Core data
            if (spriteRenderer != null)
            {
                // Example: spriteRenderer.color = GetColorForState();
            }
        }

        #endregion

        #region Mouse Interaction

        void OnMouseEnter()
        {
            // Handle hover
        }

        void OnMouseExit()
        {
            // Handle hover end
        }

        void OnMouseDown()
        {
            // Handle click
        }

        #endregion
    }
}
```

---

## Common Patterns

### Pattern 1: Safe Core Reference Access

```csharp
// ALWAYS use this pattern when accessing Core
private void AccessCoreData()
{
    // Check GameManager exists
    if (GameManager.Instance == null)
    {
        Debug.LogWarning("GameManager not initialized");
        return;
    }

    // Check GameState exists
    var gameState = GameManager.Instance.GameState;
    if (gameState == null)
    {
        Debug.LogWarning("GameState not initialized");
        return;
    }

    // NOW safe to access
    int currentTurn = gameState.CurrentTurn;
}
```

---

### Pattern 2: Event Subscription Lifecycle

```csharp
// ALWAYS subscribe in OnEnable, unsubscribe in OnDisable
void OnEnable()
{
    if (GameManager.Instance?.TurnSystem != null)
    {
        GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
    }
}

void OnDisable()
{
    if (GameManager.Instance?.TurnSystem != null)
    {
        GameManager.Instance.TurnSystem.OnTurnEnded -= HandleTurnEnded;
    }
}

private void HandleTurnEnded(int turn)
{
    Debug.Log($"Turn {turn} ended");
}
```

---

### Pattern 3: Component Caching

```csharp
// Cache in Awake, use in other methods
private Button button;
private TMP_Text textComponent;

void Awake()
{
    // Cache components
    button = GetComponent<Button>();
    textComponent = GetComponent<TMP_Text>();

    // Validate
    if (button == null)
    {
        Debug.LogError($"Button component not found on {gameObject.name}!");
    }
    if (textComponent == null)
    {
        Debug.LogError($"TMP_Text component not found on {gameObject.name}!");
    }
}

void Start()
{
    // NOW safe to use cached references
    if (button != null)
    {
        button.onClick.AddListener(OnClick);
    }
}
```

---

### Pattern 4: UI Update from Core

```csharp
public void UpdateFromCore()
{
    // Safety checks
    if (GameManager.Instance?.GameState == null)
    {
        return;
    }

    var gameState = GameManager.Instance.GameState;

    // Update UI components
    if (turnText != null)
    {
        turnText.text = $"Turn {gameState.CurrentTurn}";
    }

    if (resourceText != null)
    {
        var playerFaction = gameState.PlayerFaction;
        if (playerFaction != null)
        {
            resourceText.text = $"Credits: {playerFaction.Resources.Credits}";
        }
    }
}
```

---

### Pattern 5: Coroutine Management

```csharp
private Coroutine activeCoroutine;

public void StartAnimation()
{
    // Stop existing coroutine if running
    if (activeCoroutine != null)
    {
        StopCoroutine(activeCoroutine);
    }

    // Start new coroutine and cache reference
    activeCoroutine = StartCoroutine(AnimationCoroutine());
}

IEnumerator AnimationCoroutine()
{
    float elapsed = 0f;
    float duration = 1.0f;

    while (elapsed < duration)
    {
        elapsed += Time.deltaTime;
        float t = elapsed / duration;

        // Animate something
        transform.localScale = Vector3.Lerp(Vector3.one, Vector3.one * 1.5f, t);

        yield return null;
    }

    activeCoroutine = null; // Clear reference when done
}
```

---

### Pattern 6: Scene Transition

```csharp
using UnityEngine.SceneManagement;

public void LoadScene(string sceneName)
{
    // Validate scene exists
    if (Application.CanStreamedLevelBeLoaded(sceneName))
    {
        SceneManager.LoadScene(sceneName);
    }
    else
    {
        Debug.LogError($"Scene '{sceneName}' not found in build settings!");
    }
}

// Alternative: Async loading with progress
public void LoadSceneAsync(string sceneName)
{
    StartCoroutine(LoadSceneCoroutine(sceneName));
}

IEnumerator LoadSceneCoroutine(string sceneName)
{
    AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName);

    while (!asyncLoad.isDone)
    {
        float progress = asyncLoad.progress;
        Debug.Log($"Loading: {progress * 100}%");
        yield return null;
    }
}
```

---

## Syntax Validation

### Manual Validation Checklist

**Step 1: Brace Matching**
- Count opening `{`: ____
- Count closing `}`: ____
- Should be equal!

**Step 2: Method Signatures**
```csharp
// CORRECT
void Awake() { }
private void Start() { }
public void UpdateDisplay() { }
IEnumerator MyCoroutine() { yield return null; }

// WRONG
void Awake { } // Missing ()
Awake() { } // Missing return type
public UpdateDisplay() { } // Missing return type
```

**Step 3: Field Declarations**
```csharp
// CORRECT
private int myValue;
[SerializeField] private Button myButton;
public int MyProperty { get; private set; }

// WRONG
private int myValue // Missing ;
[SerializeField] Button myButton; // Missing access modifier
public MyProperty { get; private set; } // Missing type
```

**Step 4: Namespace and Class**
```csharp
// CORRECT
namespace Overlord.Unity.UI
{
    public class MainMenuUI : MonoBehaviour
    {
        // ...
    }
}

// WRONG
namespace Overlord.Unity.UI // Missing {
    public class MainMenuUI : MonoBehaviour // Class should be inside namespace
    // ...
// Missing }
```

---

### Automated Validation (Optional)

Create a simple validation script:

```csharp
// File: Tools/ValidateScript.cs
using System;
using System.IO;
using System.Linq;

public class ValidateScript
{
    public static bool Validate(string filePath)
    {
        if (!File.Exists(filePath))
        {
            Console.WriteLine($"File not found: {filePath}");
            return false;
        }

        string content = File.ReadAllText(filePath);

        // Check brace balance
        int openBraces = content.Count(c => c == '{');
        int closeBraces = content.Count(c => c == '}');
        if (openBraces != closeBraces)
        {
            Console.WriteLine($"Brace mismatch: { openBraces} open, {closeBraces} close");
            return false;
        }

        // Check for common Unity method typos
        string[] correctMethods = { "Awake", "Start", "Update", "OnEnable", "OnDisable", "OnDestroy" };
        string[] typos = { "awake", "start", "update", "onEnable", "onDisable", "onDestroy" };

        foreach (var typo in typos)
        {
            if (content.Contains($"void {typo}("))
            {
                Console.WriteLine($"Possible typo: 'void {typo}()' should be capitalized");
                return false;
            }
        }

        Console.WriteLine("Validation passed!");
        return true;
    }

    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage: ValidateScript <filepath>");
            return;
        }

        Validate(args[0]);
    }
}
```

**Usage:**
```bash
csc ValidateScript.cs
ValidateScript.exe MyScript.cs
```

---

## Debugging Tips

### Tip 1: Use Debug.Log Extensively

```csharp
void Awake()
{
    Debug.Log($"{nameof(MainMenuUI)} Awake() called");
}

void Start()
{
    Debug.Log($"{nameof(MainMenuUI)} Start() called");
    Debug.Log($"Button reference: {(exampleButton != null ? "Valid" : "NULL")}");
}
```

### Tip 2: Color-Coded Debug Messages

```csharp
Debug.Log("<color=green>Success: Game initialized</color>");
Debug.Log("<color=yellow>Warning: Resource low</color>");
Debug.Log("<color=red>Error: Null reference</color>");
```

### Tip 3: Conditional Compilation

```csharp
#if UNITY_EDITOR
    Debug.Log("This only runs in Editor");
#endif

#if DEVELOPMENT_BUILD || UNITY_EDITOR
    Debug.Log("This runs in dev builds and editor");
#endif
```

### Tip 4: Inspector Debugging

```csharp
[Header("Debug Info")]
[SerializeField, ReadOnly] private string debugStatus = "Not initialized";
[SerializeField, ReadOnly] private int debugValue = 0;

void Update()
{
    // Update debug fields (visible in Inspector)
    debugStatus = isInitialized ? "Running" : "Waiting";
    debugValue = GameManager.Instance?.GameState?.CurrentTurn ?? 0;
}
```

---

## Common Errors

### Error 1: CS0246 (Type or namespace not found)

**Cause:** Missing `using` statement or incorrect namespace

**Fix:**
```csharp
// Add missing using
using UnityEngine.UI;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;
```

---

### Error 2: NullReferenceException

**Cause:** Accessing object that hasn't been initialized

**Fix:**
```csharp
// WRONG
void Start()
{
    GameManager.Instance.TurnSystem.AdvancePhase(); // Crash if not initialized
}

// CORRECT
void Start()
{
    if (GameManager.Instance?.TurnSystem != null)
    {
        GameManager.Instance.TurnSystem.AdvancePhase();
    }
    else
    {
        Debug.LogError("TurnSystem not initialized!");
    }
}
```

---

### Error 3: CS1061 (Does not contain a definition)

**Cause:** Typo in method/property name, or wrong type

**Fix:**
```csharp
// WRONG
void Awake()
{
    GetComponent<Button>().OnClick.AddListener(OnClick); // 'OnClick' doesn't exist
}

// CORRECT
void Awake()
{
    GetComponent<Button>().onClick.AddListener(OnClick); // Lowercase 'onClick'
}
```

---

### Error 4: CS1705 (Assembly version mismatch)

**Cause:** Overlord.Core.dll built for wrong .NET version

**Fix:**
```bash
# Rebuild Core for netstandard2.1
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release

# Copy to Unity
cp Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll ../Overlord.Unity/Assets/Plugins/Overlord.Core/
```

---

### Error 5: GameObject not found in scene

**Cause:** Missing GameObject or incorrect tag/name

**Fix:**
```csharp
// WRONG
void Start()
{
    var obj = GameObject.Find("MyObject"); // Crashes if not found
}

// CORRECT
void Start()
{
    var obj = GameObject.Find("MyObject");
    if (obj == null)
    {
        Debug.LogError("GameObject 'MyObject' not found in scene!");
        return;
    }

    // Use obj
}
```

---

### Error 6: SerializeField not visible in Inspector

**Cause:** Not marked `[SerializeField]`, or private without attribute

**Fix:**
```csharp
// WRONG
private Button myButton; // Not visible

// CORRECT
[SerializeField] private Button myButton; // Visible in Inspector
```

---

### Error 7: Event subscribed multiple times

**Cause:** Subscribing in Start/Awake instead of OnEnable

**Fix:**
```csharp
// WRONG
void Start()
{
    GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
    // This will subscribe multiple times if object is reused!
}

// CORRECT
void OnEnable()
{
    if (GameManager.Instance?.TurnSystem != null)
    {
        GameManager.Instance.TurnSystem.OnTurnEnded += HandleTurnEnded;
    }
}

void OnDisable()
{
    if (GameManager.Instance?.TurnSystem != null)
    {
        GameManager.Instance.TurnSystem.OnTurnEnded -= HandleTurnEnded;
    }
}
```

---

## Quick Command Reference

### Build Overlord.Core
```bash
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release
```

### Copy DLL to Unity
```bash
cp Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll \
   Overlord.Unity/Assets/Plugins/Overlord.Core/
```

### Run Core Tests
```bash
cd Overlord.Core.Tests
dotnet test
```

### Open Unity Project
```bash
# Add Unity to PATH, then:
Unity -projectPath "C:\dev\GIT\Overlord\Overlord.Unity"
```

---

## Daily Workflow

1. **Morning:**
   - Pull latest from git
   - Run `dotnet test` in Overlord.Core.Tests
   - Open Unity, check for errors

2. **During Development:**
   - Write ONE script at a time
   - Validate syntax manually
   - Copy to Unity Assets folder
   - Wait for Unity compilation
   - Fix errors immediately
   - Test in Play mode
   - Commit when working

3. **End of Day:**
   - Run all Core tests
   - Test Unity project in Play mode
   - Commit working code
   - Document any blockers

---

## Emergency Fixes

### Unity won't compile (100+ errors)

1. **Close Unity**
2. Delete `Library/` folder
3. Reopen Unity (will reimport all assets)
4. Check console for real errors

### Core DLL not found

1. Check `Assets/Plugins/Overlord.Core/` contains both:
   - Overlord.Core.dll
   - System.Text.Json.dll
2. Rebuild Core for netstandard2.1
3. Restart Unity

### GameManager not found in scene

1. Open scene
2. Create empty GameObject
3. Add `GameManager.cs` component
4. Save scene

---

**Remember:**
- Small iterations (50-100 lines)
- Validate syntax before Unity
- Fix errors immediately
- Test frequently
- Commit working code

---

**End of Quick Reference**
