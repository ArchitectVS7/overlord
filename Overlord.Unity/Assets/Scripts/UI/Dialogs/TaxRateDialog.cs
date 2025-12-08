using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Unity.UI.Dialogs
{
    /// <summary>
    /// Dialog for adjusting planet tax rate.
    /// Shows real-time revenue and morale impact preview.
    /// </summary>
    public class TaxRateDialog : ModalDialogPanel
    {
        #region Serialized Fields

        [Header("Tax Rate Controls")]
        [SerializeField] private Slider taxRateSlider;
        [SerializeField] private TMP_Text taxRateValueText;

        [Header("Preview Display")]
        [SerializeField] private TMP_Text currentRateText;
        [SerializeField] private TMP_Text revenuePreviewText;
        [SerializeField] private TMP_Text moraleImpactText;
        [SerializeField] private TMP_Text categoryText;

        [Header("Colors")]
        [SerializeField] private Color positiveMoraleColor = new Color(0.2f, 0.8f, 0.2f); // Green
        [SerializeField] private Color neutralMoraleColor = new Color(0.8f, 0.8f, 0.2f); // Yellow
        [SerializeField] private Color negativeMoraleColor = new Color(0.8f, 0.2f, 0.2f); // Red

        #endregion

        #region Private Fields

        private int _currentPlanetID = -1;
        private int _newTaxRate = 50;
        private System.Action<int> _onTaxRateConfirmedCallback;

        #endregion

        #region Unity Lifecycle

        protected override void Awake()
        {
            base.Awake();

            // Wire up slider listener
            if (taxRateSlider != null)
            {
                taxRateSlider.onValueChanged.AddListener(OnTaxRateChanged);
            }
        }

        protected override void OnDestroy()
        {
            // Clean up slider listener
            if (taxRateSlider != null)
            {
                taxRateSlider.onValueChanged.RemoveListener(OnTaxRateChanged);
            }

            base.OnDestroy();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Show the tax rate dialog for a specific planet.
        /// </summary>
        public void Show(int planetID, System.Action<int> onTaxRateConfirmedCallback)
        {
            _currentPlanetID = planetID;
            _onTaxRateConfirmedCallback = onTaxRateConfirmedCallback;

            SetTitle("SET TAX RATE");
            SetMessage($"Planet ID: {planetID}");

            // Get current tax rate from planet
            int currentRate = GameManager.Instance?.TaxationSystem?.GetTaxRate(planetID) ?? TaxationSystem.DefaultTaxRate;
            _newTaxRate = currentRate;

            // Initialize slider
            if (taxRateSlider != null)
            {
                taxRateSlider.minValue = TaxationSystem.MinTaxRate;
                taxRateSlider.maxValue = TaxationSystem.MaxTaxRate;
                taxRateSlider.value = _newTaxRate;
                taxRateSlider.wholeNumbers = true;
            }

            // Display current rate
            if (currentRateText != null)
            {
                currentRateText.text = $"Current Rate: {currentRate}%";
                currentRateText.color = Color.white;
            }

            RefreshPreview();

            base.Show(OnConfirmSelection, null);
        }

        #endregion

        #region Protected Override Methods

        protected override void OnShow()
        {
            base.OnShow();
            RefreshPreview();
        }

        protected override void OnConfirmClicked()
        {
            // Invoke the tax rate confirmed callback
            _onTaxRateConfirmedCallback?.Invoke(_newTaxRate);

            // Clear callback
            _onTaxRateConfirmedCallback = null;

            // Hide dialog
            Hide();

            // Don't call base.OnConfirmClicked() to avoid invoking onConfirm twice
        }

        protected override void OnCancelClicked()
        {
            // Clear callback
            _onTaxRateConfirmedCallback = null;

            // Call base to handle standard cancel behavior
            base.OnCancelClicked();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Called when tax rate slider value changes.
        /// </summary>
        private void OnTaxRateChanged(float value)
        {
            _newTaxRate = (int)value;

            if (taxRateValueText != null)
            {
                taxRateValueText.text = $"{_newTaxRate}%";
            }

            RefreshPreview();
        }

        /// <summary>
        /// Refresh the revenue and morale impact preview.
        /// </summary>
        private void RefreshPreview()
        {
            if (_currentPlanetID < 0 || GameManager.Instance?.TaxationSystem == null) return;

            // Get estimated revenue
            int estimatedRevenue = GameManager.Instance.TaxationSystem.GetEstimatedRevenue(_currentPlanetID, _newTaxRate);

            // Get morale impact
            int moraleImpact = GameManager.Instance.TaxationSystem.GetTaxRateMoraleImpact(_newTaxRate);

            // Get tax category
            string category = GameManager.Instance.TaxationSystem.GetTaxRateCategory(_newTaxRate);

            // Display revenue preview
            if (revenuePreviewText != null)
            {
                revenuePreviewText.text = $"Est. Revenue: +{estimatedRevenue:N0} Credits/turn";
                revenuePreviewText.color = Color.white;
            }

            // Display morale impact with color coding
            if (moraleImpactText != null)
            {
                string moraleSign = moraleImpact > 0 ? "+" : "";
                moraleImpactText.text = $"Morale Impact: {moraleSign}{moraleImpact}/turn";

                if (moraleImpact > 0)
                {
                    moraleImpactText.color = positiveMoraleColor; // Green for positive
                }
                else if (moraleImpact == 0)
                {
                    moraleImpactText.color = neutralMoraleColor; // Yellow for neutral
                }
                else
                {
                    moraleImpactText.color = negativeMoraleColor; // Red for negative
                }
            }

            // Display tax category
            if (categoryText != null)
            {
                categoryText.text = $"Category: {category}";
                categoryText.color = Color.white;
            }
        }

        /// <summary>
        /// Called when confirm button is clicked.
        /// </summary>
        private void OnConfirmSelection()
        {
            // This is handled in OnConfirmClicked override
        }

        #endregion
    }
}
