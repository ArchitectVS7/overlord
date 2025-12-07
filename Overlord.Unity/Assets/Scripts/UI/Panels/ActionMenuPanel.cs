using UnityEngine;
using UnityEngine.UI;
using Overlord.Core;
using Overlord.Core.Models;
using Overlord.Unity.UI.Dialogs;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Action menu panel showing context-aware buttons for player actions.
    /// Provides access to building, purchasing, commissioning, research, taxation, and end turn.
    /// </summary>
    public class ActionMenuPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Action Buttons")]
        [SerializeField] private Button buildStructureButton;
        [SerializeField] private Button purchaseCraftButton;
        [SerializeField] private Button commissionPlatoonButton;
        [SerializeField] private Button researchWeaponsButton;
        [SerializeField] private Button setTaxRateButton;
        [SerializeField] private Button endTurnButton;

        [Header("Modal Dialogs")]
        [SerializeField] private BuildingPickerDialog buildingPickerDialog;
        [SerializeField] private CraftPurchaseDialog craftPurchaseDialog;
        [SerializeField] private PlatoonCommissionDialog platoonCommissionDialog;
        [SerializeField] private ResearchDialog researchDialog;
        [SerializeField] private TaxRateDialog taxRateDialog;

        #endregion

        #region Unity Lifecycle

        void OnEnable()
        {
            SubscribeToEvents();
            RefreshActionMenu();
        }

        void OnDisable()
        {
            UnsubscribeFromEvents();
        }

        void Awake()
        {
            // Wire up button listeners
            if (buildStructureButton != null)
                buildStructureButton.onClick.AddListener(OnBuildStructureClicked);
            if (purchaseCraftButton != null)
                purchaseCraftButton.onClick.AddListener(OnPurchaseCraftClicked);
            if (commissionPlatoonButton != null)
                commissionPlatoonButton.onClick.AddListener(OnCommissionPlatoonClicked);
            if (researchWeaponsButton != null)
                researchWeaponsButton.onClick.AddListener(OnResearchWeaponsClicked);
            if (setTaxRateButton != null)
                setTaxRateButton.onClick.AddListener(OnSetTaxRateClicked);
            if (endTurnButton != null)
                endTurnButton.onClick.AddListener(OnEndTurnClicked);
        }

        void OnDestroy()
        {
            // Clean up button listeners
            if (buildStructureButton != null)
                buildStructureButton.onClick.RemoveListener(OnBuildStructureClicked);
            if (purchaseCraftButton != null)
                purchaseCraftButton.onClick.RemoveListener(OnPurchaseCraftClicked);
            if (commissionPlatoonButton != null)
                commissionPlatoonButton.onClick.RemoveListener(OnCommissionPlatoonClicked);
            if (researchWeaponsButton != null)
                researchWeaponsButton.onClick.RemoveListener(OnResearchWeaponsClicked);
            if (setTaxRateButton != null)
                setTaxRateButton.onClick.RemoveListener(OnSetTaxRateClicked);
            if (endTurnButton != null)
                endTurnButton.onClick.RemoveListener(OnEndTurnClicked);
        }

        #endregion

        #region Event Subscription

        /// <summary>
        /// Subscribe to Core events to refresh menu when actions complete.
        /// </summary>
        private void SubscribeToEvents()
        {
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged += OnPhaseChanged;
                GameManager.Instance.TurnSystem.OnTurnStarted += OnTurnStarted;
            }

            if (GameManager.Instance?.BuildingSystem != null)
            {
                GameManager.Instance.BuildingSystem.OnBuildingStarted += OnBuildingStarted;
            }

            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased += OnCraftPurchased;
            }

            if (GameManager.Instance?.PlatoonSystem != null)
            {
                GameManager.Instance.PlatoonSystem.OnPlatoonCommissioned += OnPlatoonCommissioned;
            }

            if (GameManager.Instance?.UpgradeSystem != null)
            {
                GameManager.Instance.UpgradeSystem.OnResearchStarted += OnResearchStarted;
            }

            if (GameManager.Instance?.TaxationSystem != null)
            {
                GameManager.Instance.TaxationSystem.OnTaxRateChanged += OnTaxRateChanged;
            }
        }

        /// <summary>
        /// Unsubscribe from Core events to prevent memory leaks.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged -= OnPhaseChanged;
                GameManager.Instance.TurnSystem.OnTurnStarted -= OnTurnStarted;
            }

            if (GameManager.Instance?.BuildingSystem != null)
            {
                GameManager.Instance.BuildingSystem.OnBuildingStarted -= OnBuildingStarted;
            }

            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased -= OnCraftPurchased;
            }

            if (GameManager.Instance?.PlatoonSystem != null)
            {
                GameManager.Instance.PlatoonSystem.OnPlatoonCommissioned -= OnPlatoonCommissioned;
            }

            if (GameManager.Instance?.UpgradeSystem != null)
            {
                GameManager.Instance.UpgradeSystem.OnResearchStarted -= OnResearchStarted;
            }

            if (GameManager.Instance?.TaxationSystem != null)
            {
                GameManager.Instance.TaxationSystem.OnTaxRateChanged -= OnTaxRateChanged;
            }
        }

        #endregion

        #region Event Handlers

        private void OnPhaseChanged(TurnPhase phase)
        {
            RefreshActionMenu();
        }

        private void OnTurnStarted(int turn)
        {
            RefreshActionMenu();
        }

        private void OnBuildingStarted(int planetId, BuildingType buildingType)
        {
            RefreshActionMenu();
        }

        private void OnCraftPurchased(int craftId)
        {
            RefreshActionMenu();
        }

        private void OnPlatoonCommissioned(int platoonId)
        {
            RefreshActionMenu();
        }

        private void OnResearchStarted(FactionType faction, WeaponTier tier)
        {
            RefreshActionMenu();
        }

        private void OnTaxRateChanged(int planetId, int newRate)
        {
            RefreshActionMenu();
        }

        #endregion

        #region Button Click Handlers

        /// <summary>
        /// Handle Build Structure button click.
        /// </summary>
        private void OnBuildStructureClicked()
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0)
            {
                Debug.LogWarning("No planet selected for building construction");
                return;
            }

            if (buildingPickerDialog != null)
            {
                buildingPickerDialog.Show(planetID, OnBuildingSelected);
            }
            else
            {
                Debug.LogError("BuildingPickerDialog reference is null!");
            }
        }

        /// <summary>
        /// Handle Purchase Craft button click.
        /// </summary>
        private void OnPurchaseCraftClicked()
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0)
            {
                Debug.LogWarning("No planet selected for craft purchase");
                return;
            }

            if (craftPurchaseDialog != null)
            {
                craftPurchaseDialog.Show(planetID, OnCraftSelected);
            }
            else
            {
                Debug.LogError("CraftPurchaseDialog reference is null!");
            }
        }

        /// <summary>
        /// Handle Commission Platoon button click.
        /// </summary>
        private void OnCommissionPlatoonClicked()
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0)
            {
                Debug.LogWarning("No planet selected for platoon commissioning");
                return;
            }

            if (platoonCommissionDialog != null)
            {
                platoonCommissionDialog.Show(planetID, OnPlatoonConfigured);
            }
            else
            {
                Debug.LogError("PlatoonCommissionDialog reference is null!");
            }
        }

        /// <summary>
        /// Handle Research Weapons button click.
        /// </summary>
        private void OnResearchWeaponsClicked()
        {
            if (researchDialog != null)
            {
                researchDialog.Show(OnResearchConfirmed);
            }
            else
            {
                Debug.LogError("ResearchDialog reference is null!");
            }
        }

        /// <summary>
        /// Handle Set Tax Rate button click.
        /// </summary>
        private void OnSetTaxRateClicked()
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0)
            {
                Debug.LogWarning("No planet selected for tax rate adjustment");
                return;
            }

            if (taxRateDialog != null)
            {
                taxRateDialog.Show(planetID, OnTaxRateConfirmed);
            }
            else
            {
                Debug.LogError("TaxRateDialog reference is null!");
            }
        }

        /// <summary>
        /// Handle End Turn button click.
        /// </summary>
        private void OnEndTurnClicked()
        {
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.AdvancePhase();
                Debug.Log("Turn advanced");
            }
            else
            {
                Debug.LogError("TurnSystem is null!");
            }
        }

        #endregion

        #region Dialog Callbacks

        /// <summary>
        /// Called when a building type is selected from the dialog.
        /// </summary>
        private void OnBuildingSelected(BuildingType buildingType)
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0) return;

            bool success = GameManager.Instance?.BuildingSystem?.StartConstruction(planetID, buildingType) ?? false;
            if (success)
            {
                Debug.Log($"Started construction of {buildingType} on planet {planetID}");
                RefreshActionMenu();
            }
            else
            {
                Debug.LogWarning($"Failed to start construction of {buildingType} on planet {planetID}");
            }
        }

        /// <summary>
        /// Called when a craft type is selected from the dialog.
        /// </summary>
        private void OnCraftSelected(CraftType craftType)
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0) return;

            int craftID = GameManager.Instance?.CraftSystem?.PurchaseCraft(craftType, planetID, FactionType.Player) ?? -1;
            if (craftID >= 0)
            {
                Debug.Log($"Purchased {craftType} (ID: {craftID}) at planet {planetID}");
                RefreshActionMenu();
            }
            else
            {
                Debug.LogWarning($"Failed to purchase {craftType} at planet {planetID}");
            }
        }

        /// <summary>
        /// Called when platoon configuration is confirmed from the dialog.
        /// </summary>
        private void OnPlatoonConfigured(int troopCount, EquipmentLevel equipment, WeaponLevel weapon)
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0) return;

            int platoonID = GameManager.Instance?.PlatoonSystem?.CommissionPlatoon(
                planetID, FactionType.Player, troopCount, equipment, weapon, null) ?? -1;

            if (platoonID >= 0)
            {
                Debug.Log($"Commissioned platoon (ID: {platoonID}) with {troopCount} troops at planet {planetID}");
                RefreshActionMenu();
            }
            else
            {
                Debug.LogWarning($"Failed to commission platoon at planet {planetID}");
            }
        }

        /// <summary>
        /// Called when research is confirmed from the dialog.
        /// </summary>
        private void OnResearchConfirmed()
        {
            bool success = GameManager.Instance?.UpgradeSystem?.StartResearch(FactionType.Player) ?? false;
            if (success)
            {
                Debug.Log("Started weapon research");
                RefreshActionMenu();
            }
            else
            {
                Debug.LogWarning("Failed to start weapon research");
            }
        }

        /// <summary>
        /// Called when tax rate is confirmed from the dialog.
        /// </summary>
        private void OnTaxRateConfirmed(int newRate)
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            if (planetID < 0) return;

            bool success = GameManager.Instance?.TaxationSystem?.SetTaxRate(planetID, newRate) ?? false;
            if (success)
            {
                Debug.Log($"Set tax rate to {newRate}% on planet {planetID}");
                RefreshActionMenu();
            }
            else
            {
                Debug.LogWarning($"Failed to set tax rate to {newRate}% on planet {planetID}");
            }
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Refresh action menu button states based on current game state.
        /// </summary>
        private void RefreshActionMenu()
        {
            int planetID = GameManager.Instance?.SelectedPlanetID ?? -1;
            var planet = planetID >= 0 ? GameManager.Instance?.GetSelectedPlanet() : null;
            bool playerOwned = planet?.Owner == FactionType.Player;

            // Build/Purchase/Commission/Tax: Only enabled if player-owned planet selected
            SetButtonEnabled(buildStructureButton, playerOwned);
            SetButtonEnabled(purchaseCraftButton, playerOwned);
            SetButtonEnabled(commissionPlatoonButton, playerOwned);
            SetButtonEnabled(setTaxRateButton, playerOwned);

            // Research: Always enabled (faction-level)
            SetButtonEnabled(researchWeaponsButton, true);

            // End Turn: Always enabled
            SetButtonEnabled(endTurnButton, true);
        }

        /// <summary>
        /// Helper to enable/disable a button safely.
        /// </summary>
        private void SetButtonEnabled(Button button, bool enabled)
        {
            if (button != null)
            {
                button.interactable = enabled;
            }
        }

        #endregion
    }
}
