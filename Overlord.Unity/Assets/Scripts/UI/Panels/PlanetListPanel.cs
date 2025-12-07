using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System;
using System.Collections.Generic;
using System.Linq;
using Overlord.Core;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Planet list panel displaying all planets with clickable selection.
    /// Fires event when planet is selected for other panels to update.
    /// </summary>
    public class PlanetListPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Components")]
        [SerializeField] private Transform buttonContainer;
        [SerializeField] private GameObject planetButtonPrefab;

        [Header("Colors")]
        [SerializeField] private Color playerColor = new Color(0.19f, 0.5f, 0.75f); // #3080C0
        [SerializeField] private Color aiColor = new Color(0.75f, 0.19f, 0.19f); // #C03030
        [SerializeField] private Color neutralColor = new Color(0.5f, 0.5f, 0.5f); // #808080
        [SerializeField] private Color selectedColor = new Color(1f, 1f, 0.3f); // Yellow highlight

        #endregion

        #region Private Fields

        private List<GameObject> planetButtons = new List<GameObject>();
        private int selectedPlanetID = -1;

        #endregion

        #region Events

        /// <summary>
        /// Event fired when a planet is selected.
        /// Parameter: planetID
        /// </summary>
        public event Action<int> OnPlanetSelected;

        #endregion

        #region Unity Lifecycle

        void OnEnable()
        {
            RefreshPlanetList();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Refresh the planet list from GameState.
        /// </summary>
        public void RefreshPlanetList()
        {
            ClearButtons();

            if (GameManager.Instance?.GameState?.Planets == null)
            {
                Debug.LogWarning("Cannot refresh planet list - GameState.Planets is null");
                return;
            }

            if (buttonContainer == null)
            {
                Debug.LogError("ButtonContainer not assigned to PlanetListPanel!");
                return;
            }

            if (planetButtonPrefab == null)
            {
                Debug.LogError("PlanetButtonPrefab not assigned to PlanetListPanel!");
                return;
            }

            // Create button for each planet
            foreach (var planet in GameManager.Instance.GameState.Planets)
            {
                CreatePlanetButton(planet);
            }
        }

        /// <summary>
        /// Get the currently selected planet ID.
        /// </summary>
        public int GetSelectedPlanetID()
        {
            return selectedPlanetID;
        }

        /// <summary>
        /// Set the selected planet by ID.
        /// </summary>
        public void SetSelectedPlanet(int planetID)
        {
            if (selectedPlanetID != planetID)
            {
                selectedPlanetID = planetID;
                UpdateButtonHighlights();
                OnPlanetSelected?.Invoke(planetID);
            }
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Create a button for a planet.
        /// </summary>
        private void CreatePlanetButton(PlanetEntity planet)
        {
            GameObject buttonObj = Instantiate(planetButtonPrefab, buttonContainer);
            planetButtons.Add(buttonObj);

            // Get button component
            Button button = buttonObj.GetComponent<Button>();
            if (button == null)
            {
                Debug.LogError("Planet button prefab missing Button component!");
                Destroy(buttonObj);
                return;
            }

            // Get text component
            TMP_Text buttonText = buttonObj.GetComponentInChildren<TMP_Text>();
            if (buttonText == null)
            {
                Debug.LogError("Planet button prefab missing TMP_Text component!");
                Destroy(buttonObj);
                return;
            }

            // Set button text
            buttonText.text = GetPlanetDisplayText(planet);

            // Set button color based on owner
            Color buttonColor = GetOwnerColor(planet.Owner);
            var colors = button.colors;
            colors.normalColor = buttonColor;
            colors.highlightedColor = buttonColor * 1.2f;
            colors.pressedColor = buttonColor * 0.8f;
            button.colors = colors;

            // Wire up click event
            int planetID = planet.ID; // Capture for closure
            button.onClick.AddListener(() => OnPlanetButtonClicked(planetID));

            // Highlight if currently selected
            if (planet.ID == selectedPlanetID)
            {
                buttonText.color = selectedColor;
            }
        }

        /// <summary>
        /// Handle planet button click.
        /// </summary>
        private void OnPlanetButtonClicked(int planetID)
        {
            SetSelectedPlanet(planetID);
        }

        /// <summary>
        /// Get display text for a planet button.
        /// </summary>
        private string GetPlanetDisplayText(PlanetEntity planet)
        {
            string ownerSymbol = GetOwnerSymbol(planet.Owner);
            return $"{ownerSymbol} {planet.Name}";
        }

        /// <summary>
        /// Get owner symbol for display.
        /// </summary>
        private string GetOwnerSymbol(FactionType owner)
        {
            switch (owner)
            {
                case FactionType.Player: return "[P]";
                case FactionType.AI: return "[A]";
                case FactionType.Neutral: return "[N]";
                default: return "[?]";
            }
        }

        /// <summary>
        /// Get color for planet owner.
        /// </summary>
        private Color GetOwnerColor(FactionType owner)
        {
            switch (owner)
            {
                case FactionType.Player: return playerColor;
                case FactionType.AI: return aiColor;
                case FactionType.Neutral: return neutralColor;
                default: return Color.white;
            }
        }

        /// <summary>
        /// Update button text colors to highlight selected planet.
        /// </summary>
        private void UpdateButtonHighlights()
        {
            if (GameManager.Instance?.GameState?.Planets == null) return;

            for (int i = 0; i < planetButtons.Count && i < GameManager.Instance.GameState.Planets.Count; i++)
            {
                var buttonObj = planetButtons[i];
                var planet = GameManager.Instance.GameState.Planets[i];
                var buttonText = buttonObj.GetComponentInChildren<TMP_Text>();

                if (buttonText != null)
                {
                    if (planet.ID == selectedPlanetID)
                    {
                        buttonText.color = selectedColor;
                    }
                    else
                    {
                        buttonText.color = Color.white;
                    }
                }
            }
        }

        /// <summary>
        /// Clear all planet buttons.
        /// </summary>
        private void ClearButtons()
        {
            foreach (var button in planetButtons)
            {
                if (button != null)
                {
                    Destroy(button);
                }
            }
            planetButtons.Clear();
        }

        #endregion
    }
}
