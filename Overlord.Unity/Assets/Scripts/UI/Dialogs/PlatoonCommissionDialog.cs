using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Unity.UI.Dialogs
{
    /// <summary>
    /// Dialog for commissioning a new platoon.
    /// Allows configuration of troop count, equipment, and weapons with real-time cost/strength preview.
    /// </summary>
    public class PlatoonCommissionDialog : ModalDialogPanel
    {
        #region Serialized Fields

        [Header("Configuration UI")]
        [SerializeField] private Slider troopCountSlider;
        [SerializeField] private TMP_Text troopCountText;
        [SerializeField] private TMP_Dropdown equipmentDropdown;
        [SerializeField] private TMP_Dropdown weaponDropdown;

        [Header("Preview Display")]
        [SerializeField] private TMP_Text costPreviewText;
        [SerializeField] private TMP_Text strengthPreviewText;
        [SerializeField] private TMP_Text validationText;

        [Header("Colors")]
        [SerializeField] private Color validColor = new Color(0.2f, 0.8f, 0.2f); // Green
        [SerializeField] private Color invalidColor = new Color(0.8f, 0.2f, 0.2f); // Red

        #endregion

        #region Private Fields

        private int _currentPlanetID = -1;
        private int _troopCount = 50;
        private EquipmentLevel _equipment = EquipmentLevel.Basic;
        private WeaponLevel _weapon = WeaponLevel.Rifle;
        private System.Action<int, EquipmentLevel, WeaponLevel> _onPlatoonConfiguredCallback;

        #endregion

        #region Unity Lifecycle

        protected override void Awake()
        {
            base.Awake();

            // Wire up slider listener
            if (troopCountSlider != null)
            {
                troopCountSlider.onValueChanged.AddListener(OnTroopCountChanged);
            }

            // Wire up dropdown listeners
            if (equipmentDropdown != null)
            {
                equipmentDropdown.onValueChanged.AddListener(OnEquipmentChanged);
            }

            if (weaponDropdown != null)
            {
                weaponDropdown.onValueChanged.AddListener(OnWeaponChanged);
            }

            InitializeDropdowns();
        }

        protected override void OnDestroy()
        {
            // Clean up listeners
            if (troopCountSlider != null)
            {
                troopCountSlider.onValueChanged.RemoveListener(OnTroopCountChanged);
            }

            if (equipmentDropdown != null)
            {
                equipmentDropdown.onValueChanged.RemoveListener(OnEquipmentChanged);
            }

            if (weaponDropdown != null)
            {
                weaponDropdown.onValueChanged.RemoveListener(OnWeaponChanged);
            }

            base.OnDestroy();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Show the platoon commission dialog for a specific planet.
        /// </summary>
        public void Show(int planetID, System.Action<int, EquipmentLevel, WeaponLevel> onPlatoonConfiguredCallback)
        {
            _currentPlanetID = planetID;
            _onPlatoonConfiguredCallback = onPlatoonConfiguredCallback;

            // Set defaults
            _troopCount = 50;
            _equipment = EquipmentLevel.Basic;
            _weapon = WeaponLevel.Rifle;

            SetTitle("COMMISSION PLATOON");
            SetMessage($"Planet ID: {planetID}");

            // Initialize slider range (using PlatoonSystem constants)
            if (troopCountSlider != null)
            {
                troopCountSlider.minValue = PlatoonSystem.MinTroops;
                troopCountSlider.maxValue = PlatoonSystem.MaxTroops;
                troopCountSlider.value = _troopCount;
                troopCountSlider.wholeNumbers = true;
            }

            // Reset dropdowns to default selections
            if (equipmentDropdown != null)
            {
                equipmentDropdown.value = 1; // Basic (index 1)
            }

            if (weaponDropdown != null)
            {
                weaponDropdown.value = 1; // Rifle (index 1)
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
            // Validate before confirming
            if (!ValidateConfiguration())
            {
                Debug.LogWarning("Cannot commission platoon: validation failed");
                return;
            }

            // Invoke the platoon configured callback
            _onPlatoonConfiguredCallback?.Invoke(_troopCount, _equipment, _weapon);

            // Clear callback
            _onPlatoonConfiguredCallback = null;

            // Hide dialog
            Hide();

            // Don't call base.OnConfirmClicked() to avoid invoking onConfirm twice
        }

        protected override void OnCancelClicked()
        {
            // Clear callback
            _onPlatoonConfiguredCallback = null;

            // Call base to handle standard cancel behavior
            base.OnCancelClicked();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Initialize dropdown options.
        /// </summary>
        private void InitializeDropdowns()
        {
            if (equipmentDropdown != null)
            {
                equipmentDropdown.ClearOptions();
                var equipmentOptions = new System.Collections.Generic.List<string>
                {
                    "Civilian (20k)",
                    "Basic (35k)",
                    "Standard (55k)",
                    "Advanced (80k)",
                    "Elite (109k)"
                };
                equipmentDropdown.AddOptions(equipmentOptions);
                equipmentDropdown.value = 1; // Basic
            }

            if (weaponDropdown != null)
            {
                weaponDropdown.ClearOptions();
                var weaponOptions = new System.Collections.Generic.List<string>
                {
                    "Pistol (5k)",
                    "Rifle (10k)",
                    "Assault Rifle (18k)",
                    "Plasma (30k)"
                };
                weaponDropdown.AddOptions(weaponOptions);
                weaponDropdown.value = 1; // Rifle
            }
        }

        /// <summary>
        /// Called when troop count slider value changes.
        /// </summary>
        private void OnTroopCountChanged(float value)
        {
            _troopCount = (int)value;
            if (troopCountText != null)
            {
                troopCountText.text = $"Troop Count: {_troopCount}";
            }
            RefreshPreview();
        }

        /// <summary>
        /// Called when equipment dropdown value changes.
        /// </summary>
        private void OnEquipmentChanged(int index)
        {
            _equipment = index switch
            {
                0 => EquipmentLevel.Civilian,
                1 => EquipmentLevel.Basic,
                2 => EquipmentLevel.Standard,
                3 => EquipmentLevel.Advanced,
                4 => EquipmentLevel.Elite,
                _ => EquipmentLevel.Basic
            };
            RefreshPreview();
        }

        /// <summary>
        /// Called when weapon dropdown value changes.
        /// </summary>
        private void OnWeaponChanged(int index)
        {
            _weapon = index switch
            {
                0 => WeaponLevel.Pistol,
                1 => WeaponLevel.Rifle,
                2 => WeaponLevel.AssaultRifle,
                3 => WeaponLevel.Plasma,
                _ => WeaponLevel.Rifle
            };
            RefreshPreview();
        }

        /// <summary>
        /// Refresh the cost and strength preview.
        /// </summary>
        private void RefreshPreview()
        {
            // Calculate total cost
            int totalCost = PlatoonCosts.GetTotalCost(_equipment, _weapon);

            // Calculate estimated strength
            int estimatedStrength = GameManager.Instance?.PlatoonSystem?.GetEstimatedStrength(
                _troopCount, _equipment, _weapon, 100) ?? 0;

            // Display cost
            if (costPreviewText != null)
            {
                costPreviewText.text = $"Total Cost: {totalCost:N0} Credits";
            }

            // Display strength
            if (strengthPreviewText != null)
            {
                strengthPreviewText.text = $"Estimated Strength: {estimatedStrength}";
            }

            // Validate and display validation message
            bool isValid = ValidateConfiguration();
            if (validationText != null)
            {
                if (isValid)
                {
                    validationText.text = "READY TO COMMISSION";
                    validationText.color = validColor;
                }
                else
                {
                    validationText.text = GetValidationError();
                    validationText.color = invalidColor;
                }
            }

            // Enable/disable confirm button based on validation
            SetConfirmButtonEnabled(isValid);
        }

        /// <summary>
        /// Validate platoon configuration.
        /// </summary>
        private bool ValidateConfiguration()
        {
            if (_currentPlanetID < 0) return false;

            var planet = GameManager.Instance?.GameState?.PlanetLookup?.TryGetValue(_currentPlanetID, out var p) == true ? p : null;
            if (planet == null) return false;

            // Check troop count range
            if (_troopCount < PlatoonSystem.MinTroops || _troopCount > PlatoonSystem.MaxTroops)
                return false;

            // Check population availability
            if (planet.Population < _troopCount)
                return false;

            // Check credits affordability
            int totalCost = PlatoonCosts.GetTotalCost(_equipment, _weapon);
            if (planet.Resources.Credits < totalCost)
                return false;

            // Check platoon limit (24 max)
            bool canCreate = GameManager.Instance?.EntitySystem?.CanCreatePlatoon() ?? false;
            if (!canCreate)
                return false;

            return true;
        }

        /// <summary>
        /// Get validation error message.
        /// </summary>
        private string GetValidationError()
        {
            if (_currentPlanetID < 0) return "NO PLANET SELECTED";

            var planet = GameManager.Instance?.GameState?.PlanetLookup?.TryGetValue(_currentPlanetID, out var p) == true ? p : null;
            if (planet == null) return "PLANET NOT FOUND";

            // Check platoon limit first
            bool canCreate = GameManager.Instance?.EntitySystem?.CanCreatePlatoon() ?? false;
            if (!canCreate)
                return "PLATOON LIMIT REACHED (24 MAX)";

            // Check population
            if (planet.Population < _troopCount)
                return $"INSUFFICIENT POPULATION ({planet.Population}/{_troopCount})";

            // Check credits
            int totalCost = PlatoonCosts.GetTotalCost(_equipment, _weapon);
            if (planet.Resources.Credits < totalCost)
                return $"INSUFFICIENT CREDITS ({planet.Resources.Credits}/{totalCost})";

            return "UNKNOWN ERROR";
        }

        /// <summary>
        /// Called when confirm button is clicked with valid configuration.
        /// </summary>
        private void OnConfirmSelection()
        {
            // This is handled in OnConfirmClicked override
        }

        #endregion
    }
}
