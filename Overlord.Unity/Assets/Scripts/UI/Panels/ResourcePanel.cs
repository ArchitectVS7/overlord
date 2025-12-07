using UnityEngine;
using TMPro;
using Overlord.Core;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Resource panel displaying all 5 resource types for selected planet.
    /// Color-codes resources based on amount (Red=Critical, Yellow=Warning, Green=Normal).
    /// </summary>
    public class ResourcePanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Text Components")]
        [SerializeField] private TMP_Text creditsText;
        [SerializeField] private TMP_Text mineralsText;
        [SerializeField] private TMP_Text fuelText;
        [SerializeField] private TMP_Text foodText;
        [SerializeField] private TMP_Text energyText;

        [Header("Income Display")]
        [SerializeField] private TMP_Text creditsIncomeText;
        [SerializeField] private TMP_Text mineralsIncomeText;
        [SerializeField] private TMP_Text fuelIncomeText;
        [SerializeField] private TMP_Text foodIncomeText;
        [SerializeField] private TMP_Text energyIncomeText;

        [Header("Color Coding")]
        [SerializeField] private Color criticalColor = new Color(0.8f, 0.2f, 0.2f); // Red < 100
        [SerializeField] private Color warningColor = new Color(0.8f, 0.8f, 0.2f); // Yellow < 500
        [SerializeField] private Color normalColor = new Color(0.2f, 0.8f, 0.2f); // Green >= 500
        [SerializeField] private Color incomeColor = new Color(0.5f, 0.8f, 0.5f); // Light green

        #endregion

        #region Unity Lifecycle

        void OnEnable()
        {
            SubscribeToEvents();
        }

        void OnDisable()
        {
            UnsubscribeFromEvents();
        }

        #endregion

        #region Event Subscription

        /// <summary>
        /// Subscribe to Core events.
        /// </summary>
        private void SubscribeToEvents()
        {
            if (GameManager.Instance?.ResourceSystem != null)
            {
                GameManager.Instance.ResourceSystem.OnResourcesChanged += OnResourcesChanged;
            }
        }

        /// <summary>
        /// Unsubscribe from Core events.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.ResourceSystem != null)
            {
                GameManager.Instance.ResourceSystem.OnResourcesChanged -= OnResourcesChanged;
            }
        }

        #endregion

        #region Event Handlers

        /// <summary>
        /// Called when resources change on any planet.
        /// </summary>
        private void OnResourcesChanged(int planetId, ResourceDelta delta)
        {
            // Only refresh if changed planet is currently selected
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshResources(planetId);
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Refresh resource display for a specific planet.
        /// </summary>
        public void RefreshResources(int planetID)
        {
            if (planetID < 0)
            {
                ClearDisplay();
                return;
            }

            var planet = GameManager.Instance?.GameState?.PlanetLookup.TryGetValue(planetID, out var p) == true ? p : null;
            if (planet == null)
            {
                ClearDisplay();
                return;
            }

            // Update resource amounts with color coding
            UpdateResourceText(creditsText, planet.Resources.Credits, ResourceType.Credits, planetID);
            UpdateResourceText(mineralsText, planet.Resources.Minerals, ResourceType.Minerals, planetID);
            UpdateResourceText(fuelText, planet.Resources.Fuel, ResourceType.Fuel, planetID);
            UpdateResourceText(foodText, planet.Resources.Food, ResourceType.Food, planetID);
            UpdateResourceText(energyText, planet.Resources.Energy, ResourceType.Energy, planetID);

            // Update income display
            UpdateIncomeDisplay(planetID);
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Update a single resource text component.
        /// </summary>
        private void UpdateResourceText(TMP_Text textComponent, int amount, ResourceType resourceType, int planetID)
        {
            if (textComponent == null) return;

            textComponent.text = $"{resourceType}: {amount:N0}";
            textComponent.color = GetResourceColor(amount);
        }

        /// <summary>
        /// Update income display for all resources.
        /// </summary>
        private void UpdateIncomeDisplay(int planetID)
        {
            if (GameManager.Instance?.IncomeSystem == null) return;

            var planet = GameManager.Instance?.GameState?.PlanetLookup.TryGetValue(planetID, out var p) == true ? p : null;
            if (planet == null) return;

            // Calculate income for this planet
            var income = GameManager.Instance.IncomeSystem.CalculateIncome(planetID);

            UpdateIncomeText(creditsIncomeText, income.Credits);
            UpdateIncomeText(mineralsIncomeText, income.Minerals);
            UpdateIncomeText(fuelIncomeText, income.Fuel);
            UpdateIncomeText(foodIncomeText, income.Food);
            UpdateIncomeText(energyIncomeText, income.Energy);
        }

        /// <summary>
        /// Update a single income text component.
        /// </summary>
        private void UpdateIncomeText(TMP_Text textComponent, int incomeAmount)
        {
            if (textComponent == null) return;

            if (incomeAmount > 0)
            {
                textComponent.text = $"+{incomeAmount:N0}/turn";
                textComponent.color = incomeColor;
            }
            else if (incomeAmount < 0)
            {
                textComponent.text = $"{incomeAmount:N0}/turn";
                textComponent.color = criticalColor;
            }
            else
            {
                textComponent.text = "0/turn";
                textComponent.color = warningColor;
            }
        }

        /// <summary>
        /// Get color based on resource amount.
        /// </summary>
        private Color GetResourceColor(int amount)
        {
            if (amount < 100)
                return criticalColor; // Red (critical)
            if (amount < 500)
                return warningColor; // Yellow (warning)

            return normalColor; // Green (normal)
        }

        /// <summary>
        /// Clear all resource displays.
        /// </summary>
        private void ClearDisplay()
        {
            SetTextIfNotNull(creditsText, "Credits: --", Color.gray);
            SetTextIfNotNull(mineralsText, "Minerals: --", Color.gray);
            SetTextIfNotNull(fuelText, "Fuel: --", Color.gray);
            SetTextIfNotNull(foodText, "Food: --", Color.gray);
            SetTextIfNotNull(energyText, "Energy: --", Color.gray);

            SetTextIfNotNull(creditsIncomeText, "", Color.gray);
            SetTextIfNotNull(mineralsIncomeText, "", Color.gray);
            SetTextIfNotNull(fuelIncomeText, "", Color.gray);
            SetTextIfNotNull(foodIncomeText, "", Color.gray);
            SetTextIfNotNull(energyIncomeText, "", Color.gray);
        }

        /// <summary>
        /// Helper to set text and color if component exists.
        /// </summary>
        private void SetTextIfNotNull(TMP_Text textComponent, string text, Color color)
        {
            if (textComponent != null)
            {
            textComponent.text = text;
                textComponent.color = color;
            }
        }

        #endregion
    }
}
