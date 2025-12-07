using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

namespace Overlord.Unity.UI
{
    /// <summary>
    /// Main menu UI controller.
    /// Handles menu interactions and scene transitions.
    /// </summary>
    public class MainMenuUI : MonoBehaviour
    {
        #region Serialized Fields

        [Header("UI References")]
        [SerializeField] private Button newGameButton;
        [SerializeField] private Button loadGameButton;
        [SerializeField] private Button quitButton;
        [SerializeField] private TMP_Text titleText;

        [Header("Settings")]
        [SerializeField] private string galaxyMapSceneName = "GalaxyMap";

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            ValidateReferences();
        }

        void Start()
        {
            SetupButtons();

            if (loadGameButton != null)
            {
                loadGameButton.interactable = false;
            }
        }

        #endregion

        #region Setup

        private void ValidateReferences()
        {
            if (newGameButton == null)
            {
                Debug.LogError("NewGameButton not assigned in Inspector!");
            }
            if (loadGameButton == null)
            {
                Debug.LogError("LoadGameButton not assigned in Inspector!");
            }
            if (quitButton == null)
            {
                Debug.LogError("QuitButton not assigned in Inspector!");
            }
            if (titleText == null)
            {
                Debug.LogWarning("TitleText not assigned in Inspector (optional)");
            }
        }

        private void SetupButtons()
        {
            if (newGameButton != null)
            {
                newGameButton.onClick.AddListener(OnNewGameClicked);
            }

            if (loadGameButton != null)
            {
                loadGameButton.onClick.AddListener(OnLoadGameClicked);
            }

            if (quitButton != null)
            {
                quitButton.onClick.AddListener(OnQuitClicked);
            }
        }

        #endregion

        #region Button Handlers

        private void OnNewGameClicked()
        {
            Debug.Log("New Game clicked");

            if (GameManager.Instance != null)
            {
                GameManager.Instance.NewGame();
            }

            SceneManager.LoadScene(galaxyMapSceneName);
        }

        private void OnLoadGameClicked()
        {
            Debug.Log("Load Game clicked (not implemented)");
        }

        private void OnQuitClicked()
        {
            Debug.Log("Quit clicked");

            #if UNITY_EDITOR
                UnityEditor.EditorApplication.isPlaying = false;
            #else
                Application.Quit();
            #endif
        }

        #endregion
    }
}
