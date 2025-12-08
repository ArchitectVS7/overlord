using UnityEngine;
using UnityEngine.UI;
using Overlord.Unity.Galaxy;

namespace Overlord.Unity
{
    /// <summary>
    /// Simple manual initializer - press button to start game.
    /// Provides controlled, sequential initialization to avoid timing issues.
    /// </summary>
    public class SimpleInitializer : MonoBehaviour
    {
        [SerializeField] private Button initButton;

        void Start()
        {
            if (initButton != null)
            {
                initButton.onClick.AddListener(InitializeGame);
                Debug.Log("SimpleInitializer ready - click button to initialize galaxy");
            }
            else
            {
                Debug.LogWarning("SimpleInitializer: Init button not assigned!");
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
            else
            {
                Debug.Log("GameState already exists, using existing game");
            }

            // Step 2: Wait and initialize GalaxyMapManager
            StartCoroutine(InitializeGalaxyMap());

            // Disable button after use
            if (initButton != null)
            {
                initButton.interactable = false;
                Debug.Log("Button disabled - initialization in progress");
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
