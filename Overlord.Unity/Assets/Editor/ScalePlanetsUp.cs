using UnityEngine;
using UnityEditor;
using Overlord.Unity.Galaxy;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Scales planets up so they're actually visible.
    /// The planets are rendering but microscopic (0.2 units vs 400 unit viewport).
    /// </summary>
    public static class ScalePlanetsUp
    {
        [MenuItem("Overlord/Debug/Scale All Planets to Visible Size (PLAY MODE)")]
        public static void ScalePlanetsToVisibleSize()
        {
            if (!Application.isPlaying)
            {
                Debug.LogError("❌ Run this during PLAY MODE!");
                return;
            }

            PlanetVisual[] planets = Object.FindObjectsByType<PlanetVisual>(FindObjectsSortMode.None);

            if (planets.Length == 0)
            {
                Debug.LogError("No planets found!");
                return;
            }

            Debug.Log($"Scaling {planets.Length} planets...");

            foreach (var planet in planets)
            {
                // Scale up by 50x to make them visible
                // Camera size 200 = 400 unit viewport
                // Target planet size: ~20 units (5% of screen height)
                // Current size: 0.2 units → need 100x scale
                // Using 50x for reasonable size
                planet.transform.localScale = Vector3.one * 50f;

                Debug.Log($"✓ Scaled {planet.gameObject.name} to 50x");
            }

            Debug.Log("<color=green>✓ All planets scaled! CHECK GAME VIEW NOW!</color>");
        }

        [MenuItem("Overlord/Fix/Set Planet Prefab Base Scale (EDIT MODE)")]
        public static void SetPlanetPrefabScale()
        {
            if (Application.isPlaying)
            {
                Debug.LogError("❌ Exit Play mode first!");
                return;
            }

            GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/Planet.prefab");
            if (prefab == null)
            {
                Debug.LogError("Planet.prefab not found!");
                return;
            }

            // Set the prefab's base scale to 50x
            prefab.transform.localScale = Vector3.one * 50f;

            EditorUtility.SetDirty(prefab);
            AssetDatabase.SaveAssets();

            Debug.Log("<color=green>✓ Planet prefab scale set to 50x! Future planets will spawn at visible size.</color>");
        }
    }
}
