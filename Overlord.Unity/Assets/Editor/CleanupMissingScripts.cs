using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using UnityEditor.SceneManagement;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Editor utility to clean up missing script references from scenes.
    /// This fixes the infinite planet spawning bug caused by orphaned SceneBootstrapper reference.
    /// </summary>
    public static class CleanupMissingScripts
    {
        [MenuItem("Overlord/Fix/Remove Missing Scripts from GalaxyMap Scene")]
        public static void CleanGalaxyMapScene()
        {
            // Open the GalaxyMap scene
            string scenePath = "Assets/Scenes/GalaxyMap.unity";
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);

            int removedCount = 0;
            GameObject[] allObjects = scene.GetRootGameObjects();

            foreach (GameObject go in allObjects)
            {
                removedCount += CleanupGameObject(go);
            }

            if (removedCount > 0)
            {
                Debug.Log($"<color=green>✓ Removed {removedCount} missing script(s) from GalaxyMap scene</color>");
                EditorSceneManager.SaveScene(scene);
                Debug.Log("<color=green>✓ Scene saved successfully</color>");
            }
            else
            {
                Debug.Log("<color=yellow>No missing scripts found in scene</color>");
            }
        }

        [MenuItem("Overlord/Fix/Remove SceneBootstrapper GameObject")]
        public static void RemoveSceneBootstrapperGameObject()
        {
            // Open the GalaxyMap scene
            string scenePath = "Assets/Scenes/GalaxyMap.unity";
            Scene scene = EditorSceneManager.OpenScene(scenePath, OpenSceneMode.Single);

            GameObject[] allObjects = scene.GetRootGameObjects();
            bool found = false;

            foreach (GameObject go in allObjects)
            {
                if (go.name == "SceneBootstrapper")
                {
                    Debug.Log($"<color=green>✓ Found and destroying GameObject: {go.name}</color>");
                    Object.DestroyImmediate(go);
                    found = true;
                    break;
                }
            }

            if (found)
            {
                EditorSceneManager.SaveScene(scene);
                Debug.Log("<color=green>✓ SceneBootstrapper GameObject removed and scene saved</color>");
            }
            else
            {
                Debug.Log("<color=yellow>SceneBootstrapper GameObject not found in scene</color>");
            }
        }

        private static int CleanupGameObject(GameObject go)
        {
            int count = 0;

            // Remove missing scripts from this GameObject
            var components = go.GetComponents<Component>();
            for (int i = components.Length - 1; i >= 0; i--)
            {
                if (components[i] == null)
                {
                    Debug.Log($"Removing missing script from: {go.name}");
                    GameObjectUtility.RemoveMonoBehavioursWithMissingScript(go);
                    count++;
                    break; // Only need to call this once per GameObject
                }
            }

            // Recursively clean children
            foreach (Transform child in go.transform)
            {
                count += CleanupGameObject(child.gameObject);
            }

            return count;
        }
    }
}
