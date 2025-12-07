using UnityEngine;
using UnityEditor;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Editor utility to fix the Planet prefab by assigning a circle sprite.
    /// This fixes the "planets spawn but are invisible" bug.
    /// </summary>
    public static class FixPlanetSprite
    {
        [MenuItem("Overlord/Fix/Assign Circle Sprite to Planet Prefab")]
        public static void AssignCircleSpriteToPlanetPrefab()
        {
            // Load the Planet prefab
            string prefabPath = "Assets/Prefabs/Planet.prefab";
            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath);

            if (prefab == null)
            {
                Debug.LogError($"Could not find Planet prefab at {prefabPath}");
                return;
            }

            // Get the SpriteRenderer component
            SpriteRenderer spriteRenderer = prefab.GetComponent<SpriteRenderer>();
            if (spriteRenderer == null)
            {
                Debug.LogError("Planet prefab does not have a SpriteRenderer component!");
                return;
            }

            // Load Unity's built-in circle sprite
            // This is the "Knob" sprite from Unity's default resources
            Sprite circleSprite = AssetDatabase.GetBuiltinExtraResource<Sprite>("UI/Skin/Knob.psd");

            if (circleSprite == null)
            {
                Debug.LogWarning("Knob.psd not found, trying UISprite...");
                circleSprite = AssetDatabase.GetBuiltinExtraResource<Sprite>("UI/Skin/UISprite.psd");
            }

            if (circleSprite == null)
            {
                Debug.LogError("Could not load built-in circle sprite!");
                Debug.Log("You'll need to manually assign a sprite to the Planet prefab.");
                Debug.Log("Instructions:");
                Debug.Log("1. Select Planet.prefab in Project window");
                Debug.Log("2. In Inspector, find 'Sprite Renderer' component");
                Debug.Log("3. Click the circle next to 'Sprite' field");
                Debug.Log("4. Search for 'Knob' or any circle sprite");
                Debug.Log("5. Select it and save");
                return;
            }

            // Assign the sprite
            spriteRenderer.sprite = circleSprite;

            // Also check SelectionRing child
            Transform selectionRing = prefab.transform.Find("SelectionRing");
            if (selectionRing != null)
            {
                SpriteRenderer ringRenderer = selectionRing.GetComponent<SpriteRenderer>();
                if (ringRenderer != null && ringRenderer.sprite == null)
                {
                    ringRenderer.sprite = circleSprite;
                    Debug.Log("✓ Assigned sprite to SelectionRing");
                }
            }

            // Save the prefab
            PrefabUtility.SavePrefabAsset(prefab);

            Debug.Log($"<color=green>✓ SUCCESS! Assigned circle sprite to Planet prefab</color>");
            Debug.Log($"<color=green>✓ Sprite: {circleSprite.name}</color>");
            Debug.Log($"<color=green>✓ Press Play now - planets should be VISIBLE!</color>");
        }

        [MenuItem("Overlord/Fix/Show Manual Sprite Assignment Instructions")]
        public static void ShowManualInstructions()
        {
            string instructions = @"
=== MANUAL SPRITE ASSIGNMENT INSTRUCTIONS ===

If the automatic fix didn't work, follow these steps:

1. In Project window, navigate to: Assets/Prefabs
2. Select 'Planet.prefab'
3. In Inspector, find 'Sprite Renderer' component
4. Look for the 'Sprite' field (currently shows 'None')
5. Click the small circle icon next to it
6. In the popup window:
   - Search for: 'Knob' or 'Circle'
   - Or browse: Default-Material → Knob
   - Or use any circle sprite you have
7. Double-click the sprite to assign it
8. Press Ctrl+S to save

ALTERNATIVE - Create a Simple Sprite:
1. Create a white 128x128 PNG circle image
2. Import it into Unity (drag into Assets folder)
3. Select the image in Project window
4. In Inspector:
   - Texture Type: Sprite (2D and UI)
   - Click Apply
5. Assign this sprite to the Planet prefab

After assigning the sprite, press Play - planets should be visible!
";

            Debug.Log(instructions);
            EditorUtility.DisplayDialog(
                "Manual Sprite Assignment",
                "Check the Console for detailed instructions on how to manually assign a sprite to the Planet prefab.",
                "OK"
            );
        }
    }
}
