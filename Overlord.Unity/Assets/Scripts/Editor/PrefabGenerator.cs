using UnityEngine;
using UnityEditor;
using Overlord.Unity.Galaxy;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Editor utility to generate basic prefabs for prototype testing.
    /// </summary>
    public class PrefabGenerator : MonoBehaviour
    {
        [MenuItem("Overlord/Generate Planet Prefab")]
        public static void GeneratePlanetPrefab()
        {
            // Create root GameObject
            GameObject planetObj = new GameObject("Planet");

            // Add SpriteRenderer for visual
            SpriteRenderer spriteRenderer = planetObj.AddComponent<SpriteRenderer>();
            spriteRenderer.sprite = CreateCircleSprite();
            spriteRenderer.sortingOrder = 0;

            // Add CircleCollider2D for click detection
            CircleCollider2D collider = planetObj.AddComponent<CircleCollider2D>();
            collider.radius = 0.5f;

            // Add PlanetVisual script
            planetObj.AddComponent<PlanetVisual>();

            // Create selection ring child
            GameObject ringObj = new GameObject("SelectionRing");
            ringObj.transform.SetParent(planetObj.transform);
            ringObj.transform.localPosition = Vector3.zero;
            ringObj.transform.localScale = new Vector3(1.3f, 1.3f, 1f);

            SpriteRenderer ringRenderer = ringObj.AddComponent<SpriteRenderer>();
            ringRenderer.sprite = CreateRingSprite();
            ringRenderer.color = Color.yellow;
            ringRenderer.sortingOrder = -1;
            ringObj.SetActive(false);

            // Assign ring reference to PlanetVisual
            PlanetVisual planetVisual = planetObj.GetComponent<PlanetVisual>();
            SerializedObject so = new SerializedObject(planetVisual);
            so.FindProperty("selectionRing").objectReferenceValue = ringObj;
            so.FindProperty("planetSprite").objectReferenceValue = spriteRenderer;
            so.ApplyModifiedProperties();

            // Save as prefab
            string prefabPath = "Assets/Prefabs/Planet.prefab";

            // Create Prefabs folder if it doesn't exist
            if (!AssetDatabase.IsValidFolder("Assets/Prefabs"))
            {
                AssetDatabase.CreateFolder("Assets", "Prefabs");
            }

            // Save prefab
            PrefabUtility.SaveAsPrefabAsset(planetObj, prefabPath);

            // Clean up scene object
            DestroyImmediate(planetObj);

            Debug.Log($"Planet prefab created at {prefabPath}");
            EditorUtility.DisplayDialog("Success", "Planet prefab generated successfully!", "OK");
        }

        private static Sprite CreateCircleSprite()
        {
            int size = 128;
            Texture2D texture = new Texture2D(size, size);
            Color[] pixels = new Color[size * size];

            Vector2 center = new Vector2(size / 2f, size / 2f);
            float radius = size / 2f - 2;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dist = Vector2.Distance(new Vector2(x, y), center);
                    if (dist <= radius)
                    {
                        pixels[y * size + x] = Color.white;
                    }
                    else
                    {
                        pixels[y * size + x] = Color.clear;
                    }
                }
            }

            texture.SetPixels(pixels);
            texture.Apply();

            return Sprite.Create(texture, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        private static Sprite CreateRingSprite()
        {
            int size = 128;
            Texture2D texture = new Texture2D(size, size);
            Color[] pixels = new Color[size * size];

            Vector2 center = new Vector2(size / 2f, size / 2f);
            float outerRadius = size / 2f - 2;
            float innerRadius = outerRadius - 4;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dist = Vector2.Distance(new Vector2(x, y), center);
                    if (dist <= outerRadius && dist >= innerRadius)
                    {
                        pixels[y * size + x] = Color.white;
                    }
                    else
                    {
                        pixels[y * size + x] = Color.clear;
                    }
                }
            }

            texture.SetPixels(pixels);
            texture.Apply();

            return Sprite.Create(texture, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), 100f);
        }
    }
}
