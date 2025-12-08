# Fresh Unity Scene Setup - Overlord Prototype

This guide will help you set up a clean Unity scene from scratch, avoiding all the initialization timing issues.

## Step 1: Delete Problematic Scripts

**Delete these files permanently:**

1. `Assets/Scripts/SceneBootstrapper.cs` - DELETE THIS FILE
2. `Assets/Scripts/SceneBootstrapper.cs.meta` - DELETE THIS FILE

**Why?** SceneBootstrapper was causing infinite initialization loops and cannot be easily fixed.

## Step 2: Create New Clean Scene

1. In Unity, go to **File → New Scene**
2. Choose **Basic (Built-in)** template
3. Save as `Assets/Scenes/GalaxyMap.unity` (overwrite the old one)
4. You should see:
   - Main Camera
   - Directional Light

## Step 3: Create GameManager

1. In Hierarchy, **right-click → Create Empty**
2. Rename to `GameManager`
3. In Inspector, click **Add Component**
4. Search for `Game Manager` script and add it
5. **Verify in Console**: You should see "GameManager awakened"

## Step 4: Create GalaxyMapManager

1. In Hierarchy, **right-click → Create Empty**
2. Rename to `GalaxyMapManager`
3. In Inspector, click **Add Component**
4. Search for `Galaxy Map Manager` script and add it

## Step 5: Create PlanetFactory

1. In Hierarchy, **right-click → Create Empty**
2. Rename to `PlanetFactory`
3. In Inspector, click **Add Component**
4. Search for `Planet Factory` script and add it
5. **Assign Planet Prefab**:
   - In Inspector, find the `Planet Prefab` field
   - Drag `Assets/Prefabs/Planet.prefab` into this field

## Step 6: Create Planets Container

1. In Hierarchy, **right-click → Create Empty**
2. Rename to `Planets`
3. This will hold all spawned planets (leave empty)

## Step 7: Wire Up GalaxyMapManager References

1. Select `GalaxyMapManager` in Hierarchy
2. In Inspector, assign:
   - **Planet Factory**: Drag `PlanetFactory` GameObject here
   - **Planets Container**: Drag `Planets` GameObject here

## Step 8: Disable Auto-Initialization (Temporary)

We need to control initialization order manually. Edit `GalaxyMapManager.cs`:

1. Find the `Start()` method (around line 63)
2. Comment out the entire method:

```csharp
// void Start()
// {
//     if (hasStartedInitialization)
//     {
//         Debug.LogWarning("GalaxyMapManager.Start() called but initialization already started! Skipping.");
//         return;
//     }
//
//     hasStartedInitialization = true;
//     // Wait one frame to ensure GameManager.Start() has completed
//     StartCoroutine(InitializeNextFrame());
// }
```

## Step 9: Create Simple Test Button

We'll manually trigger initialization with a UI button.

1. In Hierarchy, **right-click → UI → Button - TextMeshPro**
2. If prompted to import TMP Essentials, click **Import TMP Essentials**
3. Rename Button to `InitButton`
4. Select `InitButton → Text (TMP)` child
5. Change text to "Initialize Galaxy"
6. Position button in top-left corner of Canvas

## Step 10: Create Initialization Script

Create a new simple script to handle initialization:

**File: `Assets/Scripts/SimpleInitializer.cs`**

```csharp
using UnityEngine;
using UnityEngine.UI;
using Overlord.Unity.Galaxy;

namespace Overlord.Unity
{
    /// <summary>
    /// Simple manual initializer - press button to start game.
    /// </summary>
    public class SimpleInitializer : MonoBehaviour
    {
        [SerializeField] private Button initButton;

        void Start()
        {
            if (initButton != null)
            {
                initButton.onClick.AddListener(InitializeGame);
            }
        }

        private void InitializeGame()
        {
            Debug.Log("=== Manual Initialization Started ===");

            // Step 1: Initialize GameManager (create new game)
            if (GameManager.Instance == null)
            {
                Debug.LogError("GameManager not found!");
                return;
            }

            if (GameManager.Instance.GameState == null)
            {
                Debug.Log("Creating new game...");
                GameManager.Instance.NewGame();
            }

            // Step 2: Wait and initialize GalaxyMapManager
            StartCoroutine(InitializeGalaxyMap());

            // Disable button after use
            if (initButton != null)
            {
                initButton.interactable = false;
            }
        }

        private System.Collections.IEnumerator InitializeGalaxyMap()
        {
            // Wait 2 frames to ensure GameManager.NewGame() completed
            yield return null;
            yield return null;

            Debug.Log("Initializing galaxy map...");

            var galaxyMapManager = GalaxyMapManager.Instance;
            if (galaxyMapManager == null)
            {
                Debug.LogError("GalaxyMapManager not found!");
                yield break;
            }

            // Use reflection to call private InitializeGalaxyMap method
            var method = typeof(GalaxyMapManager).GetMethod(
                "InitializeGalaxyMap",
                System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);

            if (method != null)
            {
                method.Invoke(galaxyMapManager, null);
                Debug.Log("=== Initialization Complete ===");
            }
            else
            {
                Debug.LogError("Could not find InitializeGalaxyMap method!");
            }
        }
    }
}
```

## Step 11: Wire Up Initializer

1. Select `GameManager` in Hierarchy
2. **Add Component → Simple Initializer**
3. In Inspector, assign:
   - **Init Button**: Drag `InitButton` from Hierarchy

## Step 12: Final Scene Structure

Your Hierarchy should look like this:

```
GalaxyMap (scene)
├── Main Camera
├── Directional Light
├── GameManager
│   └── [GameManager script]
│   └── [SimpleInitializer script]
├── GalaxyMapManager
│   └── [GalaxyMapManager script]
├── PlanetFactory
│   └── [PlanetFactory script]
├── Planets (empty Transform)
└── Canvas
    └── InitButton
        └── Text (TMP)
```

## Step 13: Test Run

1. **Save the scene**: Ctrl+S
2. **Press Play**
3. **Check Console**: Should see "GameManager awakened" and "GalaxyMapManager awakened"
4. **Click "Initialize Galaxy" button**
5. **Expected Console Output**:
   ```
   === Manual Initialization Started ===
   Creating new game...
   Galaxy generated: 5 planets
   Player assigned to planet: [Planet Name]
   AI assigned to planet: [Planet Name]
   Initializing galaxy map...
   Spawned 5 planet visuals
   === Initialization Complete ===
   ```
6. **Check Game View**: You should see 5 planets positioned in 3D space
7. **Check Hierarchy**: `Planets` container should have 5 child objects

## Troubleshooting

### "GameManager not found"
- Ensure GameManager GameObject exists in scene
- Check GameManager script is attached

### "GalaxyMapManager not found"
- Ensure GalaxyMapManager GameObject exists
- Check GalaxyMapManager script is attached

### "PlanetFactory not assigned"
- Select GalaxyMapManager
- Verify Planet Factory field is assigned in Inspector

### "Spawned 0 planet visuals"
- Select PlanetFactory
- Verify Planet Prefab field is assigned
- Check that Planet.prefab exists in Assets/Prefabs/

### Planets spawn but not visible
- Select Main Camera
- Check camera position (should be at 0, 0, -10)
- Check camera Clear Flags is set to Skybox or Solid Color

### Button doesn't work
- Select GameManager
- Verify SimpleInitializer has Init Button assigned
- Check Console for errors when clicking

## Success Criteria

✅ Press Play → See "GameManager awakened"
✅ Click button → See "Galaxy generated: 5 planets"
✅ See "Spawned 5 planet visuals"
✅ See 5 planet GameObjects under Planets in Hierarchy
✅ See 5 colored circles in Game view
✅ NO infinite spawning
✅ NO errors in Console

## Next Steps After Success

Once you confirm planets are spawning correctly:
1. Remove the SimpleInitializer (or keep it for debugging)
2. Re-enable GalaxyMapManager.Start() auto-initialization if desired
3. Proceed with UAT testing (SCENE-SETUP-GUIDE.md)
