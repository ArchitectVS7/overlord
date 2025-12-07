using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Automated setup for Phase 3: Galaxy Map Scene + Camera.
    /// Run from: Tools > Overlord > Setup Phase 3 - Galaxy Scene
    /// </summary>
    public class Phase3AutoSetup : EditorWindow
    {
        [MenuItem("Tools/Overlord/Setup Phase 3 - Galaxy Scene")]
        public static void SetupGalaxyScene()
        {
            if (!EditorUtility.DisplayDialog(
                "Phase 3 Auto Setup",
                "This will create the GalaxyMap scene with camera controller.\n\n" +
                "This will create a NEW scene. Save current scene first!\n\n" +
                "Continue?",
                "Yes, Create Scene",
                "Cancel"))
            {
                return;
            }

            Debug.Log("=== Phase 3 Auto Setup Started ===");

            try
            {
                // Step 1: Save current scene
                if (!EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
                {
                    Debug.Log("Setup cancelled by user");
                    return;
                }

                // Step 2: Create new scene
                var newScene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
                Debug.Log("✓ New scene created");

                // Step 3: Configure Main Camera
                Camera mainCamera = Camera.main;
                if (mainCamera != null)
                {
                    mainCamera.orthographic = true;
                    mainCamera.orthographicSize = 10f;
                    mainCamera.backgroundColor = Color.black;
                    mainCamera.transform.position = new Vector3(0, 0, -10);
                    Debug.Log("✓ Main Camera configured (Orthographic, black background)");

                    // Add GalaxyCameraController script
                    // Note: Script must exist first - we'll create it separately
                    Debug.Log("ℹ Camera controller script will be added manually in next step");
                }

                // Step 4: Add GameManager
                GameObject gameManager = new GameObject("GameManager");
                var gmScript = gameManager.AddComponent<Overlord.Unity.GameManager>();
                Debug.Log("✓ GameManager added to scene");

                // Step 5: Save scene
                string scenePath = "Assets/Scenes/GalaxyMap.unity";
                System.IO.Directory.CreateDirectory("Assets/Scenes");
                EditorSceneManager.SaveScene(newScene, scenePath);
                Debug.Log($"✓ Scene saved to {scenePath}");

                // Step 6: Add to Build Profiles
                AddSceneToBuildSettings(scenePath);
                Debug.Log("✓ Scene added to Build Settings");

                Debug.Log("=== Phase 3 Auto Setup Complete! ===");
                EditorUtility.DisplayDialog(
                    "Success!",
                    "Phase 3 Galaxy Scene setup complete!\n\n" +
                    "✓ GalaxyMap scene created\n" +
                    "✓ Camera configured (orthographic)\n" +
                    "✓ GameManager added\n" +
                    "✓ Scene saved\n" +
                    "✓ Added to Build Settings\n\n" +
                    "NEXT STEP:\n" +
                    "Manually add GalaxyCameraController script to Main Camera\n" +
                    "(Script will be created in Phase 3B)",
                    "OK");
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Phase 3 Auto Setup failed: {e.Message}");
                EditorUtility.DisplayDialog(
                    "Setup Failed",
                    $"An error occurred during setup:\n\n{e.Message}\n\n" +
                    "Check Console for details.",
                    "OK");
            }
        }

        private static void AddSceneToBuildSettings(string scenePath)
        {
            // Get current scenes in build settings
            var scenes = new System.Collections.Generic.List<EditorBuildSettingsScene>(EditorBuildSettings.scenes);

            // Check if scene already exists
            bool sceneExists = false;
            foreach (var scene in scenes)
            {
                if (scene.path == scenePath)
                {
                    sceneExists = true;
                    scene.enabled = true;
                    break;
                }
            }

            // Add if not exists
            if (!sceneExists)
            {
                scenes.Add(new EditorBuildSettingsScene(scenePath, true));
            }

            // Update build settings
            EditorBuildSettings.scenes = scenes.ToArray();
        }
    }
}
