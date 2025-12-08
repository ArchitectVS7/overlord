using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Unity.UI.Dialogs
{
    /// <summary>
    /// Dialog for selecting a building type to construct.
    /// Shows 5 buildable structure types with costs, times, and capacity validation.
    /// </summary>
    public class BuildingPickerDialog : ModalDialogPanel
    {
        #region Serialized Fields

        [Header("Building Buttons")]
        [SerializeField] private Button dockingBayButton;
        [SerializeField] private Button surfacePlatformButton;
        [SerializeField] private Button miningStationButton;
        [SerializeField] private Button horticulturalStationButton;
        [SerializeField] private Button orbitalDefenseButton;

        [Header("Building Info Text")]
        [SerializeField] private TMP_Text dockingBayInfoText;
        [SerializeField] private TMP_Text surfacePlatformInfoText;
        [SerializeField] private TMP_Text miningStationInfoText;
        [SerializeField] private TMP_Text horticulturalStationInfoText;
        [SerializeField] private TMP_Text orbitalDefenseInfoText;

        [Header("Colors")]
        [SerializeField] private Color affordableColor = new Color(0.2f, 0.8f, 0.2f); // Green
        [SerializeField] private Color unaffordableColor = new Color(0.8f, 0.2f, 0.2f); // Red
        [SerializeField] private Color capacityFullColor = new Color(0.5f, 0.5f, 0.5f); // Gray

        #endregion

        #region Private Fields

        private int _currentPlanetID = -1;
        private BuildingType _selectedBuildingType;
        private System.Action<BuildingType> _onBuildingSelectedCallback;

        #endregion

        #region Unity Lifecycle

        protected override void Awake()
        {
            base.Awake();

            // Wire up building button listeners
            if (dockingBayButton != null)
                dockingBayButton.onClick.AddListener(() => OnBuildingButtonClicked(BuildingType.DockingBay));
            if (surfacePlatformButton != null)
                surfacePlatformButton.onClick.AddListener(() => OnBuildingButtonClicked(BuildingType.SurfacePlatform));
            if (miningStationButton != null)
                miningStationButton.onClick.AddListener(() => OnBuildingButtonClicked(BuildingType.MiningStation));
            if (horticulturalStationButton != null)
                horticulturalStationButton.onClick.AddListener(() => OnBuildingButtonClicked(BuildingType.HorticulturalStation));
            if (orbitalDefenseButton != null)
                orbitalDefenseButton.onClick.AddListener(() => OnBuildingButtonClicked(BuildingType.OrbitalDefense));
        }

        protected override void OnDestroy()
        {
            // Clean up building button listeners
            if (dockingBayButton != null)
                dockingBayButton.onClick.RemoveAllListeners();
            if (surfacePlatformButton != null)
                surfacePlatformButton.onClick.RemoveAllListeners();
            if (miningStationButton != null)
                miningStationButton.onClick.RemoveAllListeners();
            if (horticulturalStationButton != null)
                horticulturalStationButton.onClick.RemoveAllListeners();
            if (orbitalDefenseButton != null)
                orbitalDefenseButton.onClick.RemoveAllListeners();

            base.OnDestroy();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Show the building picker dialog for a specific planet.
        /// </summary>
        public void Show(int planetID, System.Action<BuildingType> onBuildingSelectedCallback)
        {
            _currentPlanetID = planetID;
            _onBuildingSelectedCallback = onBuildingSelectedCallback;
            _selectedBuildingType = BuildingType.DockingBay; // Default selection

            SetTitle("SELECT STRUCTURE TO BUILD");
            SetMessage($"Planet ID: {planetID}");

            RefreshBuildingOptions();

            base.Show(OnConfirmSelection, null);
        }

        #endregion

        #region Protected Override Methods

        protected override void OnShow()
        {
            base.OnShow();
            RefreshBuildingOptions();
        }

        protected override void OnConfirmClicked()
        {
            // Invoke the building selected callback
            _onBuildingSelectedCallback?.Invoke(_selectedBuildingType);

            // Clear callback
            _onBuildingSelectedCallback = null;

            // Hide dialog
            Hide();

            // Don't call base.OnConfirmClicked() to avoid invoking onConfirm twice
        }

        protected override void OnCancelClicked()
        {
            // Clear callback
            _onBuildingSelectedCallback = null;

            // Call base to handle standard cancel behavior
            base.OnCancelClicked();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Refresh all building options based on current planet state.
        /// </summary>
        private void RefreshBuildingOptions()
        {
            if (_currentPlanetID < 0) return;

            var planet = GameManager.Instance?.GameState?.PlanetLookup?.TryGetValue(_currentPlanetID, out var p) == true ? p : null;
            if (planet == null) return;

            // Update each building option
            UpdateBuildingOption(BuildingType.DockingBay, dockingBayButton, dockingBayInfoText, planet);
            UpdateBuildingOption(BuildingType.SurfacePlatform, surfacePlatformButton, surfacePlatformInfoText, planet);
            UpdateBuildingOption(BuildingType.MiningStation, miningStationButton, miningStationInfoText, planet);
            UpdateBuildingOption(BuildingType.HorticulturalStation, horticulturalStationButton, horticulturalStationInfoText, planet);
            UpdateBuildingOption(BuildingType.OrbitalDefense, orbitalDefenseButton, orbitalDefenseInfoText, planet);
        }

        /// <summary>
        /// Update a single building option button and info text.
        /// </summary>
        private void UpdateBuildingOption(BuildingType buildingType, Button button, TMP_Text infoText, PlanetEntity planet)
        {
            if (button == null || infoText == null) return;

            // Get cost and construction time
            var cost = BuildingCosts.GetCost(buildingType);
            int constructionTime = BuildingCosts.GetConstructionTime(buildingType);

            // Check if player can build this type (capacity validation)
            bool canBuild = GameManager.Instance?.BuildingSystem?.CanBuild(_currentPlanetID, buildingType) ?? false;

            // Check if player can afford this building
            bool canAfford = GameManager.Instance?.ResourceSystem?.CanAfford(_currentPlanetID, cost) ?? false;

            // Determine button state and color
            bool isAvailable = canBuild && canAfford;
            button.interactable = isAvailable;

            // Format info text
            string infoString = $"{buildingType}\n";
            infoString += $"Cost: {cost.Credits}c";
            if (cost.Minerals > 0) infoString += $", {cost.Minerals}m";
            if (cost.Fuel > 0) infoString += $", {cost.Fuel}f";
            if (cost.Energy > 0) infoString += $", {cost.Energy}e";
            infoString += $"\nTime: {constructionTime} turns";

            // Add status indicator
            if (!canBuild)
            {
                infoString += "\n[CAPACITY FULL]";
                infoText.color = capacityFullColor;
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
        /// Called when a building button is clicked.
        /// </summary>
        private void OnBuildingButtonClicked(BuildingType buildingType)
        {
            _selectedBuildingType = buildingType;

            // Highlight selected building (optional: visual feedback)
            // For now, we just store the selection and wait for confirmation
        }

        /// <summary>
        /// Called when confirm button is clicked with a building selected.
        /// </summary>
        private void OnConfirmSelection()
        {
            // This is handled in OnConfirmClicked override
        }

        #endregion
    }
}
