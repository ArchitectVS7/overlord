using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Unity.UI.Dialogs
{
    /// <summary>
    /// Dialog for purchasing craft/ships.
    /// Shows 4 purchasable craft types with costs, crew requirements, and fleet capacity validation.
    /// </summary>
    public class CraftPurchaseDialog : ModalDialogPanel
    {
        #region Serialized Fields

        [Header("Craft Buttons")]
        [SerializeField] private Button battleCruiserButton;
        [SerializeField] private Button cargoCruiserButton;
        [SerializeField] private Button solarSatelliteButton;
        [SerializeField] private Button atmosphereProcessorButton;

        [Header("Craft Info Text")]
        [SerializeField] private TMP_Text battleCruiserInfoText;
        [SerializeField] private TMP_Text cargoCruiserInfoText;
        [SerializeField] private TMP_Text solarSatelliteInfoText;
        [SerializeField] private TMP_Text atmosphereProcessorInfoText;

        [Header("Colors")]
        [SerializeField] private Color affordableColor = new Color(0.2f, 0.8f, 0.2f); // Green
        [SerializeField] private Color unaffordableColor = new Color(0.8f, 0.2f, 0.2f); // Red
        [SerializeField] private Color fleetFullColor = new Color(0.5f, 0.5f, 0.5f); // Gray

        #endregion

        #region Private Fields

        private int _currentPlanetID = -1;
        private CraftType _selectedCraftType;
        private System.Action<CraftType> _onCraftSelectedCallback;

        #endregion

        #region Unity Lifecycle

        protected override void Awake()
        {
            base.Awake();

            // Wire up craft button listeners
            if (battleCruiserButton != null)
                battleCruiserButton.onClick.AddListener(() => OnCraftButtonClicked(CraftType.BattleCruiser));
            if (cargoCruiserButton != null)
                cargoCruiserButton.onClick.AddListener(() => OnCraftButtonClicked(CraftType.CargoCruiser));
            if (solarSatelliteButton != null)
                solarSatelliteButton.onClick.AddListener(() => OnCraftButtonClicked(CraftType.SolarSatellite));
            if (atmosphereProcessorButton != null)
                atmosphereProcessorButton.onClick.AddListener(() => OnCraftButtonClicked(CraftType.AtmosphereProcessor));
        }

        protected override void OnDestroy()
        {
            // Clean up craft button listeners
            if (battleCruiserButton != null)
                battleCruiserButton.onClick.RemoveAllListeners();
            if (cargoCruiserButton != null)
                cargoCruiserButton.onClick.RemoveAllListeners();
            if (solarSatelliteButton != null)
                solarSatelliteButton.onClick.RemoveAllListeners();
            if (atmosphereProcessorButton != null)
                atmosphereProcessorButton.onClick.RemoveAllListeners();

            base.OnDestroy();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Show the craft purchase dialog for a specific planet.
        /// </summary>
        public void Show(int planetID, System.Action<CraftType> onCraftSelectedCallback)
        {
            _currentPlanetID = planetID;
            _onCraftSelectedCallback = onCraftSelectedCallback;
            _selectedCraftType = CraftType.BattleCruiser; // Default selection

            SetTitle("PURCHASE CRAFT");
            SetMessage($"Planet ID: {planetID}");

            RefreshCraftOptions();

            base.Show(OnConfirmSelection, null);
        }

        #endregion

        #region Protected Override Methods

        protected override void OnShow()
        {
            base.OnShow();
            RefreshCraftOptions();
        }

        protected override void OnConfirmClicked()
        {
            // Invoke the craft selected callback
            _onCraftSelectedCallback?.Invoke(_selectedCraftType);

            // Clear callback
            _onCraftSelectedCallback = null;

            // Hide dialog
            Hide();

            // Don't call base.OnConfirmClicked() to avoid invoking onConfirm twice
        }

        protected override void OnCancelClicked()
        {
            // Clear callback
            _onCraftSelectedCallback = null;

            // Call base to handle standard cancel behavior
            base.OnCancelClicked();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Refresh all craft options based on current planet state and fleet capacity.
        /// </summary>
        private void RefreshCraftOptions()
        {
            if (_currentPlanetID < 0) return;

            var planet = GameManager.Instance?.GameState?.PlanetLookup?.TryGetValue(_currentPlanetID, out var p) == true ? p : null;
            if (planet == null) return;

            // Check fleet capacity (32 max)
            bool fleetHasCapacity = GameManager.Instance?.EntitySystem?.CanCreateCraft() ?? false;

            // Update each craft option
            UpdateCraftOption(CraftType.BattleCruiser, battleCruiserButton, battleCruiserInfoText, planet, fleetHasCapacity);
            UpdateCraftOption(CraftType.CargoCruiser, cargoCruiserButton, cargoCruiserInfoText, planet, fleetHasCapacity);
            UpdateCraftOption(CraftType.SolarSatellite, solarSatelliteButton, solarSatelliteInfoText, planet, fleetHasCapacity);
            UpdateCraftOption(CraftType.AtmosphereProcessor, atmosphereProcessorButton, atmosphereProcessorInfoText, planet, fleetHasCapacity);
        }

        /// <summary>
        /// Update a single craft option button and info text.
        /// </summary>
        private void UpdateCraftOption(CraftType craftType, Button button, TMP_Text infoText, PlanetEntity planet, bool fleetHasCapacity)
        {
            if (button == null || infoText == null) return;

            // Get cost and crew requirement
            var cost = CraftCosts.GetCost(craftType);
            int crewRequired = CraftCrewRequirements.GetCrewRequired(craftType);

            // Check if player can afford this craft
            bool canAfford = GameManager.Instance?.ResourceSystem?.CanAfford(_currentPlanetID, cost) ?? false;

            // Check if planet has enough population for crew
            bool hasCrewAvailable = planet.Population >= crewRequired;

            // Determine button state and color
            bool isAvailable = fleetHasCapacity && canAfford && hasCrewAvailable;
            button.interactable = isAvailable;

            // Format info text
            string infoString = $"{craftType}\n";
            infoString += $"Cost: {cost.Credits}c";
            if (cost.Minerals > 0) infoString += $", {cost.Minerals}m";
            if (cost.Fuel > 0) infoString += $", {cost.Fuel}f";
            if (cost.Energy > 0) infoString += $", {cost.Energy}e";
            infoString += $"\nCrew: {crewRequired}";

            // Add status indicator
            if (!fleetHasCapacity)
            {
                infoString += "\n[FLEET CAPACITY FULL]";
                infoText.color = fleetFullColor;
            }
            else if (!hasCrewAvailable)
            {
                infoString += "\n[INSUFFICIENT CREW]";
                infoText.color = unaffordableColor;
            }
            else if (!canAfford)
            {
                infoString += "\n[INSUFFICIENT RESOURCES]";
                infoText.color = unaffordableColor;
            }
            else
            {
                infoString += "\n[AVAILABLE]";
                infoText.color = affordableColor;
            }

            infoText.text = infoString;
        }

        /// <summary>
        /// Called when a craft button is clicked.
        /// </summary>
        private void OnCraftButtonClicked(CraftType craftType)
        {
            _selectedCraftType = craftType;

            // Highlight selected craft (optional: visual feedback)
            // For now, we just store the selection and wait for confirmation
        }

        /// <summary>
        /// Called when confirm button is clicked with a craft selected.
        /// </summary>
        private void OnConfirmSelection()
        {
            // This is handled in OnConfirmClicked override
        }

        #endregion
    }
}
