using UnityEngine;
using UnityEngine.UI;
using UnityEditor;
using UnityEditor.SceneManagement;
using TMPro;
using Overlord.Unity.UI;

namespace Overlord.Unity.Editor
{
    /// <summary>
    /// Automated setup for Phase 2: Main Menu UI.
    /// Run from: Tools > Overlord > Setup Phase 2 - Main Menu
    /// </summary>
    public class Phase2AutoSetup : EditorWindow
    {
        [MenuItem("Tools/Overlord/Setup Phase 2 - Main Menu")]
        public static void SetupMainMenu()
        {
            if (!EditorUtility.DisplayDialog(
                "Phase 2 Auto Setup",
                "This will automatically create the Main Menu UI in the current scene.\n\n" +
                "Make sure MainMenu.unity is open before proceeding.\n\n" +
                "Continue?",
                "Yes, Setup Main Menu",
                "Cancel"))
            {
                return;
            }

            Debug.Log("=== Phase 2 Auto Setup Started ===");

            try
            {
                // Step 1: Create Canvas
                GameObject canvas = CreateCanvas();
                Debug.Log("✓ Canvas created");

                // Step 2: Create Title Text
                GameObject titleText = CreateTitleText(canvas);
                Debug.Log("✓ Title text created");

                // Step 3: Create Buttons
                GameObject newGameButton = CreateButton(canvas, "NewGameButton", 0f, 50f, "#3080C0", "NEW GAME");
                GameObject loadGameButton = CreateButton(canvas, "LoadGameButton", 0f, -30f, "#404040", "LOAD GAME");
                GameObject quitButton = CreateButton(canvas, "QuitButton", 0f, -110f, "#404040", "QUIT");
                Debug.Log("✓ Buttons created");

                // Step 4: Wire up MainMenuUI script
                MainMenuUI menuUI = canvas.GetComponent<MainMenuUI>();
                if (menuUI == null)
                {
                    menuUI = canvas.AddComponent<MainMenuUI>();
                }

                SerializedObject so = new SerializedObject(menuUI);
                so.FindProperty("newGameButton").objectReferenceValue = newGameButton.GetComponent<Button>();
                so.FindProperty("loadGameButton").objectReferenceValue = loadGameButton.GetComponent<Button>();
                so.FindProperty("quitButton").objectReferenceValue = quitButton.GetComponent<Button>();
                so.FindProperty("titleText").objectReferenceValue = titleText.GetComponent<TMP_Text>();
                so.ApplyModifiedProperties();
                Debug.Log("✓ MainMenuUI script configured");

                // Step 5: Disable Load Game button
                loadGameButton.GetComponent<Button>().interactable = false;
                Debug.Log("✓ Load Game button disabled");

                // Step 6: Save scene
                EditorSceneManager.MarkSceneDirty(EditorSceneManager.GetActiveScene());
                EditorSceneManager.SaveOpenScenes();
                Debug.Log("✓ Scene saved");

                Debug.Log("=== Phase 2 Auto Setup Complete! ===");
                EditorUtility.DisplayDialog(
                    "Success!",
                    "Phase 2 Main Menu setup complete!\n\n" +
                    "✓ Canvas created\n" +
                    "✓ Title text added\n" +
                    "✓ 3 buttons created\n" +
                    "✓ MainMenuUI script configured\n" +
                    "✓ Scene saved\n\n" +
                    "Press Play to test!",
                    "OK");
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Phase 2 Auto Setup failed: {e.Message}");
                EditorUtility.DisplayDialog(
                    "Setup Failed",
                    $"An error occurred during setup:\n\n{e.Message}\n\n" +
                    "Check Console for details.",
                    "OK");
            }
        }

        private static GameObject CreateCanvas()
        {
            // Check if Canvas already exists
            Canvas existingCanvas = Object.FindFirstObjectByType<Canvas>();
            if (existingCanvas != null)
            {
                if (EditorUtility.DisplayDialog(
                    "Canvas Exists",
                    "A Canvas already exists in the scene. Use existing Canvas?",
                    "Use Existing",
                    "Create New"))
                {
                    return existingCanvas.gameObject;
                }
            }

            // Create Canvas
            GameObject canvasObj = new GameObject("Canvas");
            Canvas canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            CanvasScaler scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1920, 1080);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // Create EventSystem if needed
            if (Object.FindFirstObjectByType<UnityEngine.EventSystems.EventSystem>() == null)
            {
                GameObject eventSystem = new GameObject("EventSystem");
                eventSystem.AddComponent<UnityEngine.EventSystems.EventSystem>();
                eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }

            return canvasObj;
        }

        private static GameObject CreateTitleText(GameObject parent)
        {
            GameObject textObj = new GameObject("TitleText");
            textObj.transform.SetParent(parent.transform, false);

            RectTransform rect = textObj.AddComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 1f); // Top-center
            rect.anchorMax = new Vector2(0.5f, 1f);
            rect.pivot = new Vector2(0.5f, 1f);
            rect.anchoredPosition = new Vector2(0, -150);
            rect.sizeDelta = new Vector2(600, 100);

            TMP_Text text = textObj.AddComponent<TextMeshProUGUI>();
            text.text = "OVERLORD";
            text.fontSize = 72;
            text.fontStyle = FontStyles.Bold;
            text.alignment = TextAlignmentOptions.Center;
            text.color = Color.white;

            return textObj;
        }

        private static GameObject CreateButton(GameObject parent, string name, float posX, float posY, string colorHex, string buttonText)
        {
            GameObject buttonObj = new GameObject(name);
            buttonObj.transform.SetParent(parent.transform, false);

            // RectTransform
            RectTransform rect = buttonObj.AddComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f); // Center
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = new Vector2(posX, posY);
            rect.sizeDelta = new Vector2(300, 60);

            // Image (background)
            Image image = buttonObj.AddComponent<Image>();
            image.color = HexToColor(colorHex);

            // Button
            Button button = buttonObj.AddComponent<Button>();
            ColorBlock colors = button.colors;

            if (colorHex == "#3080C0") // Blue button
            {
                colors.normalColor = HexToColor("#3080C0");
                colors.highlightedColor = HexToColor("#60A0E0");
                colors.pressedColor = HexToColor("#2060A0");
            }
            else // Gray button
            {
                colors.normalColor = HexToColor("#404040");
                colors.highlightedColor = HexToColor("#606060");
                colors.pressedColor = HexToColor("#303030");
            }

            colors.disabledColor = HexToColor("#404040") * new Color(1, 1, 1, 0.5f);
            button.colors = colors;

            // Text child
            GameObject textObj = new GameObject("Text (TMP)");
            textObj.transform.SetParent(buttonObj.transform, false);

            RectTransform textRect = textObj.AddComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.sizeDelta = Vector2.zero;

            TMP_Text text = textObj.AddComponent<TextMeshProUGUI>();
            text.text = buttonText;
            text.fontSize = 28;
            text.alignment = TextAlignmentOptions.Center;
            text.color = Color.white;

            return buttonObj;
        }

        private static Color HexToColor(string hex)
        {
            if (ColorUtility.TryParseHtmlString(hex, out Color color))
            {
                return color;
            }
            return Color.white;
        }
    }
}
