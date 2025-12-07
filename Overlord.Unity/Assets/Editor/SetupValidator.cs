using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using UnityEditor.SceneManagement;
using TMPro;
using Overlord.Unity.UI;
using System.Text;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Comprehensive UAT (User Acceptance Testing) validator for all phases.
    /// Run from: Tools > Overlord > Validate Setup (UAT)
    /// </summary>
    public class SetupValidator : EditorWindow
    {
        private static StringBuilder report = new StringBuilder();
        private static int passCount = 0;
        private static int failCount = 0;
        private static int warnCount = 0;

        [MenuItem("Tools/Overlord/Validate Setup (UAT)")]
        public static void RunValidation()
        {
            report = new StringBuilder();
            passCount = 0;
            failCount = 0;
            warnCount = 0;

            Debug.Log("=== Starting UAT Validation ===");
            report.AppendLine("=== OVERLORD UNITY SETUP VALIDATION REPORT ===\n");

            // Get current scene name
            string sceneName = EditorSceneManager.GetActiveScene().name;
            report.AppendLine($"Current Scene: {sceneName}\n");

            // Run appropriate validations based on scene
            ValidateDLLDependencies();
            ValidateScripts();

            if (sceneName == "MainMenu")
            {
                ValidatePhase1();
                ValidatePhase2();
            }
            else if (sceneName == "GalaxyMap")
            {
                ValidatePhase3();
            }

            // Summary
            report.AppendLine("\n" + new string('=', 60));
            report.AppendLine("VALIDATION SUMMARY");
            report.AppendLine(new string('=', 60));
            report.AppendLine($"✓ PASS: {passCount}");
            report.AppendLine($"⚠ WARN: {warnCount}");
            report.AppendLine($"✗ FAIL: {failCount}");

            string status = failCount == 0 ? "ALL TESTS PASSED" : "SOME TESTS FAILED";
            report.AppendLine($"\nStatus: {status}");

            // Display results
            Debug.Log(report.ToString());

            string dialogMessage = $"Validation Complete!\n\n" +
                                   $"✓ Passed: {passCount}\n" +
                                   $"⚠ Warnings: {warnCount}\n" +
                                   $"✗ Failed: {failCount}\n\n" +
                                   $"Check Console for detailed report.";

            EditorUtility.DisplayDialog(
                failCount == 0 ? "Validation Passed!" : "Validation Failed",
                dialogMessage,
                "OK");
        }

        private static void ValidateDLLDependencies()
        {
            report.AppendLine("--- DLL Dependencies ---");

            string[] requiredDLLs = new string[]
            {
                "Assets/Plugins/Overlord.Core/Overlord.Core.dll",
                "Assets/Plugins/Overlord.Core/System.Text.Json.dll",
                "Assets/Plugins/Overlord.Core/System.Text.Encodings.Web.dll",
                "Assets/Plugins/Overlord.Core/Microsoft.Bcl.AsyncInterfaces.dll",
                "Assets/Plugins/Overlord.Core/System.Runtime.CompilerServices.Unsafe.dll"
            };

            foreach (string dll in requiredDLLs)
            {
                if (System.IO.File.Exists(dll))
                {
                    Pass($"DLL present: {System.IO.Path.GetFileName(dll)}");
                }
                else
                {
                    Fail($"DLL missing: {dll}");
                }
            }

            report.AppendLine();
        }

        private static void ValidateScripts()
        {
            report.AppendLine("--- Core Scripts ---");

            string[] requiredScripts = new string[]
            {
                "Assets/Scripts/GameManager.cs",
                "Assets/Scripts/UI/MainMenuUI.cs",
                "Assets/Scripts/UI/UIManager.cs"
            };

            foreach (string script in requiredScripts)
            {
                if (System.IO.File.Exists(script))
                {
                    Pass($"Script present: {System.IO.Path.GetFileName(script)}");
                }
                else
                {
                    Fail($"Script missing: {script}");
                }
            }

            report.AppendLine();
        }

        private static void ValidatePhase1()
        {
            report.AppendLine("--- Phase 1: MainMenu Scene ---");

            // Check if MainMenu scene exists
            if (EditorSceneManager.GetActiveScene().name != "MainMenu")
            {
                Fail("MainMenu scene is not open");
                return;
            }
            else
            {
                Pass("MainMenu scene is open");
            }

            // Check for GameManager GameObject
            var gameManager = GameObject.Find("GameManager");
            if (gameManager != null)
            {
                Pass("GameManager GameObject exists");

                // Check for GameManager script
                var gmScript = gameManager.GetComponent<Overlord.Unity.GameManager>();
                if (gmScript != null)
                {
                    Pass("GameManager script attached");
                }
                else
                {
                    Fail("GameManager script not attached");
                }
            }
            else
            {
                Fail("GameManager GameObject not found");
            }

            // Check if scene is in build settings
            bool inBuildSettings = false;
            foreach (var scene in EditorBuildSettings.scenes)
            {
                if (scene.path.Contains("MainMenu"))
                {
                    inBuildSettings = true;
                    if (scene.enabled)
                    {
                        Pass("MainMenu scene in Build Settings (enabled)");
                    }
                    else
                    {
                        Warn("MainMenu scene in Build Settings but disabled");
                    }
                    break;
                }
            }

            if (!inBuildSettings)
            {
                Fail("MainMenu scene not in Build Settings");
            }

            report.AppendLine();
        }

        private static void ValidatePhase2()
        {
            report.AppendLine("--- Phase 2: Main Menu UI ---");

            // Check for Canvas
            Canvas canvas = Object.FindFirstObjectByType<Canvas>();
            if (canvas != null)
            {
                Pass("Canvas exists");

                // Check for MainMenuUI script
                MainMenuUI menuUI = canvas.GetComponent<MainMenuUI>();
                if (menuUI != null)
                {
                    Pass("MainMenuUI script attached to Canvas");

                    // Validate button references using SerializedObject
                    SerializedObject so = new SerializedObject(menuUI);

                    var newGameButton = so.FindProperty("newGameButton").objectReferenceValue as Button;
                    var loadGameButton = so.FindProperty("loadGameButton").objectReferenceValue as Button;
                    var quitButton = so.FindProperty("quitButton").objectReferenceValue as Button;
                    var titleText = so.FindProperty("titleText").objectReferenceValue as TMP_Text;

                    if (newGameButton != null)
                        Pass("New Game button assigned");
                    else
                        Fail("New Game button not assigned");

                    if (loadGameButton != null)
                    {
                        Pass("Load Game button assigned");
                        if (!loadGameButton.interactable)
                            Pass("Load Game button is disabled (correct)");
                        else
                            Warn("Load Game button is enabled (should be disabled)");
                    }
                    else
                    {
                        Fail("Load Game button not assigned");
                    }

                    if (quitButton != null)
                        Pass("Quit button assigned");
                    else
                        Fail("Quit button not assigned");

                    if (titleText != null)
                        Pass("Title text assigned");
                    else
                        Warn("Title text not assigned (optional)");
                }
                else
                {
                    Fail("MainMenuUI script not found on Canvas");
                }

                // Check for EventSystem
                var eventSystem = Object.FindFirstObjectByType<UnityEngine.EventSystems.EventSystem>();
                if (eventSystem != null)
                {
                    Pass("EventSystem exists");
                }
                else
                {
                    Fail("EventSystem not found (buttons won't work!)");
                }
            }
            else
            {
                Fail("Canvas not found");
            }

            // Check for specific UI elements by name
            ValidateGameObject("TitleText");
            ValidateGameObject("NewGameButton");
            ValidateGameObject("LoadGameButton");
            ValidateGameObject("QuitButton");

            report.AppendLine();
        }

        private static void ValidatePhase3()
        {
            report.AppendLine("--- Phase 3: Galaxy Map Scene ---");

            // Check if GalaxyMap scene exists
            if (EditorSceneManager.GetActiveScene().name != "GalaxyMap")
            {
                Fail("GalaxyMap scene is not open");
                return;
            }
            else
            {
                Pass("GalaxyMap scene is open");
            }

            // Check for Main Camera
            Camera mainCamera = Camera.main;
            if (mainCamera != null)
            {
                Pass("Main Camera exists");

                if (mainCamera.orthographic)
                {
                    Pass("Camera is orthographic (correct for 2D)");
                }
                else
                {
                    Fail("Camera is perspective (should be orthographic)");
                }

                if (mainCamera.backgroundColor == Color.black)
                {
                    Pass("Camera background is black");
                }
                else
                {
                    Warn($"Camera background is {mainCamera.backgroundColor} (expected black)");
                }
            }
            else
            {
                Fail("Main Camera not found");
            }

            // Check for GameManager
            var gameManager = GameObject.Find("GameManager");
            if (gameManager != null)
            {
                Pass("GameManager GameObject exists");
            }
            else
            {
                Fail("GameManager GameObject not found");
            }

            // Check if scene is in build settings
            bool inBuildSettings = false;
            foreach (var scene in EditorBuildSettings.scenes)
            {
                if (scene.path.Contains("GalaxyMap"))
                {
                    inBuildSettings = true;
                    Pass("GalaxyMap scene in Build Settings");
                    break;
                }
            }

            if (!inBuildSettings)
            {
                Fail("GalaxyMap scene not in Build Settings");
            }

            report.AppendLine();
        }

        private static void ValidateGameObject(string name)
        {
            GameObject obj = GameObject.Find(name);
            if (obj != null)
            {
                Pass($"GameObject '{name}' exists");
            }
            else
            {
                Fail($"GameObject '{name}' not found");
            }
        }

        private static void Pass(string message)
        {
            report.AppendLine($"✓ PASS: {message}");
            passCount++;
        }

        private static void Fail(string message)
        {
            report.AppendLine($"✗ FAIL: {message}");
            failCount++;
        }

        private static void Warn(string message)
        {
            report.AppendLine($"⚠ WARN: {message}");
            warnCount++;
        }
    }
}
