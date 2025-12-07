using UnityEngine;
using UnityEditor;
using Overlord.Unity.Galaxy;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Diagnostic tool to figure out why planets aren't visible.
    /// Run this while in Play mode after planets spawn.
    /// </summary>
    public static class DiagnosePlanetVisibility
    {
        [MenuItem("Overlord/Debug/Diagnose Planet Visibility (RUN DURING PLAY MODE)")]
        public static void DiagnosePlanets()
        {
            if (!Application.isPlaying)
            {
                Debug.LogError("❌ This tool must be run DURING PLAY MODE!");
                Debug.LogError("Press Play first, then run this tool.");
                return;
            }

            Debug.Log("=== PLANET VISIBILITY DIAGNOSTIC START ===");

            // Find all PlanetVisual components in the scene
            PlanetVisual[] planets = Object.FindObjectsByType<PlanetVisual>(FindObjectsSortMode.None);

            if (planets.Length == 0)
            {
                Debug.LogError("❌ NO PlanetVisual components found in scene!");
                Debug.LogError("   Planets may not have spawned at all.");
                Debug.LogError("   Check Console for spawn messages.");
                return;
            }

            Debug.Log($"✓ Found {planets.Length} planet(s) in scene");

            // Check each planet
            for (int i = 0; i < planets.Length; i++)
            {
                var planet = planets[i];
                Debug.Log($"\n--- PLANET {i + 1}: {planet.gameObject.name} ---");

                // Check position
                Vector3 pos = planet.transform.position;
                Debug.Log($"  Position: ({pos.x:F2}, {pos.y:F2}, {pos.z:F2})");

                // Check if position is reasonable
                if (Mathf.Abs(pos.x) > 1000 || Mathf.Abs(pos.y) > 1000)
                {
                    Debug.LogWarning($"  ⚠️ WARNING: Planet very far from origin! May be outside camera view.");
                }

                // Check SpriteRenderer
                var spriteRenderer = planet.GetComponent<SpriteRenderer>();
                if (spriteRenderer == null)
                {
                    Debug.LogError($"  ❌ ERROR: NO SpriteRenderer component!");
                    continue;
                }

                Debug.Log($"  SpriteRenderer found: ✓");
                Debug.Log($"    Enabled: {spriteRenderer.enabled}");
                Debug.Log($"    Sprite: {(spriteRenderer.sprite != null ? spriteRenderer.sprite.name : "NULL")}");
                Debug.Log($"    Color: {spriteRenderer.color}");
                Debug.Log($"    Sorting Layer: {spriteRenderer.sortingLayerName}");
                Debug.Log($"    Order in Layer: {spriteRenderer.sortingOrder}");

                // Check if sprite is null
                if (spriteRenderer.sprite == null)
                {
                    Debug.LogError($"  ❌ ERROR: Sprite is NULL!");
                    Debug.LogError($"     Planet prefab's sprite wasn't assigned properly.");
                }

                // Check if enabled
                if (!spriteRenderer.enabled)
                {
                    Debug.LogWarning($"  ⚠️ WARNING: SpriteRenderer is DISABLED!");
                }

                // Check GameObject active
                if (!planet.gameObject.activeInHierarchy)
                {
                    Debug.LogError($"  ❌ ERROR: GameObject is INACTIVE!");
                }

                // Check scale
                Vector3 scale = planet.transform.localScale;
                Debug.Log($"  Scale: ({scale.x:F2}, {scale.y:F2}, {scale.z:F2})");
                if (scale.x < 0.01f || scale.y < 0.01f)
                {
                    Debug.LogWarning($"  ⚠️ WARNING: Scale is very small! Planet might be invisible.");
                }
            }

            // Check camera
            Debug.Log("\n--- CAMERA CHECK ---");
            Camera mainCam = Camera.main;
            if (mainCam == null)
            {
                Debug.LogError("❌ ERROR: No Main Camera found!");
                return;
            }

            Debug.Log($"✓ Main Camera found: {mainCam.gameObject.name}");
            Debug.Log($"  Position: {mainCam.transform.position}");
            Debug.Log($"  Orthographic: {mainCam.orthographic}");
            Debug.Log($"  Orthographic Size: {mainCam.orthographicSize}");
            Debug.Log($"  Culling Mask: {mainCam.cullingMask}");

            if (!mainCam.orthographic)
            {
                Debug.LogError("  ❌ ERROR: Camera is NOT orthographic!");
                Debug.LogError("     Set Camera → Projection to Orthographic");
            }

            // Calculate what the camera can see
            float camHeight = mainCam.orthographicSize * 2;
            float camWidth = camHeight * mainCam.aspect;
            float camLeft = mainCam.transform.position.x - camWidth / 2;
            float camRight = mainCam.transform.position.x + camWidth / 2;
            float camBottom = mainCam.transform.position.y - mainCam.orthographicSize;
            float camTop = mainCam.transform.position.y + mainCam.orthographicSize;

            Debug.Log($"  Camera viewport:");
            Debug.Log($"    X: {camLeft:F2} to {camRight:F2}");
            Debug.Log($"    Y: {camBottom:F2} to {camTop:F2}");

            // Check if planets are in camera view
            Debug.Log("\n--- VISIBILITY CHECK ---");
            int visibleCount = 0;
            foreach (var planet in planets)
            {
                Vector3 pos = planet.transform.position;
                bool inView = (pos.x >= camLeft && pos.x <= camRight &&
                              pos.y >= camBottom && pos.y <= camTop);

                if (inView)
                {
                    Debug.Log($"✓ {planet.gameObject.name} is IN camera view");
                    visibleCount++;
                }
                else
                {
                    Debug.LogWarning($"⚠️ {planet.gameObject.name} is OUTSIDE camera view!");
                    Debug.LogWarning($"   Planet at ({pos.x:F2}, {pos.y:F2})");
                    Debug.LogWarning($"   Camera sees X:[{camLeft:F2} to {camRight:F2}] Y:[{camBottom:F2} to {camTop:F2}]");
                }
            }

            Debug.Log($"\n{visibleCount}/{planets.Length} planets are within camera viewport");

            // Final recommendations
            Debug.Log("\n=== RECOMMENDATIONS ===");
            if (visibleCount == 0)
            {
                Debug.LogError("❌ NO planets in camera view!");
                Debug.LogError("SOLUTION: Increase camera Orthographic Size or reposition camera");
                Debug.LogError("Try: Select Main Camera → Set Orthographic Size to 200");
            }
            else if (visibleCount < planets.Length)
            {
                Debug.LogWarning($"⚠️ Only {visibleCount}/{planets.Length} planets visible");
                Debug.LogWarning("SOLUTION: Increase camera Orthographic Size to see all planets");
            }
            else
            {
                Debug.Log("✓ All planets are in camera view");
                Debug.Log("If still not visible, check:");
                Debug.Log("  1. Sprite is assigned (check above)");
                Debug.Log("  2. SpriteRenderer is enabled");
                Debug.Log("  3. Color alpha is not 0");
                Debug.Log("  4. GameObject is active");
            }

            Debug.Log("\n=== PLANET VISIBILITY DIAGNOSTIC END ===");
        }

        [MenuItem("Overlord/Debug/List All GameObjects in Scene (Play Mode)")]
        public static void ListAllGameObjects()
        {
            if (!Application.isPlaying)
            {
                Debug.LogError("❌ This tool must be run DURING PLAY MODE!");
                return;
            }

            GameObject[] allObjects = Object.FindObjectsByType<GameObject>(FindObjectsSortMode.None);
            Debug.Log($"=== ALL GAMEOBJECTS IN SCENE ({allObjects.Length}) ===");

            foreach (var go in allObjects)
            {
                // Only show root objects
                if (go.transform.parent == null)
                {
                    PrintHierarchy(go, 0);
                }
            }
        }

        private static void PrintHierarchy(GameObject go, int indent)
        {
            string prefix = new string(' ', indent * 2);
            string components = "";
            var comps = go.GetComponents<Component>();
            foreach (var comp in comps)
            {
                if (comp != null && !(comp is Transform))
                {
                    components += $" [{comp.GetType().Name}]";
                }
            }
            Debug.Log($"{prefix}{go.name}{components}");

            foreach (Transform child in go.transform)
            {
                PrintHierarchy(child.gameObject, indent + 1);
            }
        }
    }
}
