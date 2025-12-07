using UnityEngine;
using UnityEditor;
using Overlord.Unity.Galaxy;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Detailed sprite renderer inspection during play mode.
    /// </summary>
    public static class InspectPlanetInPlayMode
    {
        [MenuItem("Overlord/Debug/Inspect Planet Sprite Details (PLAY MODE)")]
        public static void InspectPlanetSprites()
        {
            if (!Application.isPlaying)
            {
                Debug.LogError("❌ Run this during PLAY MODE!");
                return;
            }

            Debug.Log("=== DETAILED SPRITE INSPECTION ===");

            PlanetVisual[] planets = Object.FindObjectsByType<PlanetVisual>(FindObjectsSortMode.None);

            if (planets.Length == 0)
            {
                Debug.LogError("No planets found!");
                return;
            }

            Debug.Log($"Inspecting {planets.Length} planets...\n");

            foreach (var planet in planets)
            {
                Debug.Log($"--- {planet.gameObject.name} ---");

                var sr = planet.GetComponent<SpriteRenderer>();
                if (sr == null)
                {
                    Debug.LogError("  ❌ NO SpriteRenderer!");
                    continue;
                }

                Debug.Log($"  GameObject Active: {planet.gameObject.activeInHierarchy}");
                Debug.Log($"  SpriteRenderer Enabled: {sr.enabled}");
                Debug.Log($"  Sprite: {(sr.sprite != null ? sr.sprite.name : "NULL")}");

                if (sr.sprite != null)
                {
                    Debug.Log($"    Sprite Texture: {(sr.sprite.texture != null ? sr.sprite.texture.name : "NULL")}");
                    Debug.Log($"    Sprite Rect: {sr.sprite.rect}");
                    Debug.Log($"    Sprite Pivot: {sr.sprite.pivot}");
                }

                Debug.Log($"  Color: {sr.color} (A={sr.color.a})");
                Debug.Log($"  Material: {(sr.sharedMaterial != null ? sr.sharedMaterial.name : "NULL")}");
                Debug.Log($"  Sorting Layer: '{sr.sortingLayerName}' (ID:{sr.sortingLayerID})");
                Debug.Log($"  Order in Layer: {sr.sortingOrder}");
                Debug.Log($"  Layer Mask: {LayerMask.LayerToName(planet.gameObject.layer)} ({planet.gameObject.layer})");
                Debug.Log($"  Bounds: {sr.bounds}");
                Debug.Log($"  Is Visible: {sr.isVisible}");
                Debug.Log("");
            }

            // Check if there are any sprite renderers at all in the scene
            SpriteRenderer[] allSprites = Object.FindObjectsByType<SpriteRenderer>(FindObjectsSortMode.None);
            Debug.Log($"Total SpriteRenderers in scene: {allSprites.Length}");

            Debug.Log("\n=== CAMERA INFO ===");
            Camera cam = Camera.main;
            if (cam != null)
            {
                Debug.Log($"Culling Mask (binary): {System.Convert.ToString(cam.cullingMask, 2)}");
                Debug.Log($"Culling Mask (int): {cam.cullingMask}");
                Debug.Log($"Is Layer 0 (Default) visible: {((cam.cullingMask & (1 << 0)) != 0)}");
            }
        }

        [MenuItem("Overlord/Debug/Force Enable All Sprite Renderers (PLAY MODE)")]
        public static void ForceEnableSpriteRenderers()
        {
            if (!Application.isPlaying)
            {
                Debug.LogError("❌ Run this during PLAY MODE!");
                return;
            }

            PlanetVisual[] planets = Object.FindObjectsByType<PlanetVisual>(FindObjectsSortMode.None);
            int enabledCount = 0;

            foreach (var planet in planets)
            {
                var sr = planet.GetComponent<SpriteRenderer>();
                if (sr != null)
                {
                    if (!sr.enabled)
                    {
                        sr.enabled = true;
                        Debug.Log($"✓ Enabled SpriteRenderer on {planet.gameObject.name}");
                        enabledCount++;
                    }

                    // Force full opacity
                    if (sr.color.a < 1f)
                    {
                        Color c = sr.color;
                        c.a = 1f;
                        sr.color = c;
                        Debug.Log($"✓ Set alpha to 1.0 on {planet.gameObject.name}");
                    }

                    // Force active
                    if (!planet.gameObject.activeSelf)
                    {
                        planet.gameObject.SetActive(true);
                        Debug.Log($"✓ Activated GameObject {planet.gameObject.name}");
                    }
                }
            }

            if (enabledCount > 0)
            {
                Debug.Log($"<color=green>✓ Enabled {enabledCount} sprite renderers. Check Game view now!</color>");
            }
            else
            {
                Debug.Log("All sprite renderers were already enabled.");
            }
        }
    }
}
