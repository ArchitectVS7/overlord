using UnityEngine;
using UnityEngine.UI;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Unity.UI.Dialogs
{
    /// <summary>
    /// Dialog for weapon tier research.
    /// Shows current tier, next tier cost/time, and research progress.
    /// </summary>
    public class ResearchDialog : ModalDialogPanel
    {
        #region Serialized Fields

        [Header("Display Components")]
        [SerializeField] private TMP_Text currentTierText;
        [SerializeField] private TMP_Text nextTierText;
        [SerializeField] private TMP_Text costText;
        [SerializeField] private TMP_Text timeText;
        [SerializeField] private TMP_Text progressText;

        [Header("Colors")]
        [SerializeField] private Color availableColor = new Color(0.2f, 0.8f, 0.2f); // Green
        [SerializeField] private Color unavailableColor = new Color(0.8f, 0.2f, 0.2f); // Red
        [SerializeField] private Color researchingColor = new Color(0.8f, 0.8f, 0.2f); // Yellow
        [SerializeField] private Color maxTierColor = new Color(0.4f, 0.7f, 0.9f); // Light blue

        #endregion

        #region Private Fields

        private System.Action _onResearchConfirmedCallback;

        #endregion

        #region Public Methods

        /// <summary>
        /// Show the research dialog.
        /// </summary>
        public void Show(System.Action onResearchConfirmedCallback)
        {
            _onResearchConfirmedCallback = onResearchConfirmedCallback;

            SetTitle("WEAPON RESEARCH");
            SetMessage("Upgrade your fleet's weapon systems");

            RefreshResearchDisplay();

            base.Show(OnConfirmSelection, null);
        }

        #endregion

        #region Protected Override Methods

        protected override void OnShow()
        {
            base.OnShow();
            RefreshResearchDisplay();
        }

        protected override void OnConfirmClicked()
        {
            // Check if research can be started
            if (!CanStartResearch())
            {
                Debug.LogWarning("Cannot start research");
                return;
            }

            // Invoke the research confirmed callback
            _onResearchConfirmedCallback?.Invoke();

            // Clear callback
            _onResearchConfirmedCallback = null;

            // Hide dialog
            Hide();

            // Don't call base.OnConfirmClicked() to avoid invoking onConfirm twice
        }

        protected override void OnCancelClicked()
        {
            // Clear callback
            _onResearchConfirmedCallback = null;

            // Call base to handle standard cancel behavior
            base.OnCancelClicked();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Refresh the research display with current state.
        /// </summary>
        private void RefreshResearchDisplay()
        {
            if (GameManager.Instance?.UpgradeSystem == null)
            {
                Debug.LogError("UpgradeSystem is null!");
                return;
            }

            // Get current tier
            var currentTier = GameManager.Instance.UpgradeSystem.GetWeaponTier(FactionType.Player);

            // Get next tier
            var nextTier = GetNextTier(currentTier);

            // Display current tier
            if (currentTierText != null)
            {
                currentTierText.text = $"Current Tier: {currentTier}";
                currentTierText.color = Color.white;
            }

            // Check if currently researching
            var researchingTier = GameManager.Instance.UpgradeSystem.GetResearchingTier(FactionType.Player);
            int turnsRemaining = GameManager.Instance.UpgradeSystem.GetResearchTurnsRemaining(FactionType.Player);

            if (researchingTier.HasValue)
            {
                // Currently researching
                if (nextTierText != null)
                {
                    nextTierText.text = $"Researching: {researchingTier.Value}";
                    nextTierText.color = researchingColor;
                }

                if (progressText != null)
                {
                    progressText.text = $"Progress: {turnsRemaining} turns remaining";
                    progressText.color = researchingColor;
                }

                if (costText != null)
                {
                    costText.text = "Research In Progress";
                    costText.color = researchingColor;
                }

                if (timeText != null)
                {
                    timeText.text = "";
                }

                // Disable confirm button while researching
                SetConfirmButtonEnabled(false);
            }
            else if (!nextTier.HasValue)
            {
                // Max tier reached
                if (nextTierText != null)
                {
                    nextTierText.text = "Next Tier: MAX TIER REACHED";
                    nextTierText.color = maxTierColor;
                }

                if (progressText != null)
                {
                    progressText.text = "All research complete";
                    progressText.color = maxTierColor;
                }

                if (costText != null)
                {
                    costText.text = "";
                }

                if (timeText != null)
                {
                    timeText.text = "";
                }

                // Disable confirm button at max tier
                SetConfirmButtonEnabled(false);
            }
            else
            {
                // Next tier available
                int cost = UpgradeCosts.GetResearchCost(nextTier.Value);
                int time = UpgradeCosts.GetResearchTime(nextTier.Value);

                if (nextTierText != null)
                {
                    nextTierText.text = $"Next Tier: {nextTier.Value}";
                    nextTierText.color = Color.white;
                }

                if (costText != null)
                {
                    costText.text = $"Cost: {cost:N0} Credits";
                }

                if (timeText != null)
                {
                    timeText.text = $"Time: {time} turns";
                }

                // Check if player can afford research
                bool canAfford = GameManager.Instance.UpgradeSystem.CanAffordNextResearch(FactionType.Player);

                if (progressText != null)
                {
                    if (canAfford)
                    {
                        progressText.text = "READY TO RESEARCH";
                        progressText.color = availableColor;
                    }
                    else
                    {
                        progressText.text = "INSUFFICIENT CREDITS";
                        progressText.color = unavailableColor;
                    }
                }

                // Enable/disable confirm button based on affordability
                SetConfirmButtonEnabled(canAfford);
            }
        }

        /// <summary>
        /// Get the next weapon tier in progression.
        /// </summary>
        private WeaponTier? GetNextTier(WeaponTier current)
        {
            return current switch
            {
                WeaponTier.Laser => WeaponTier.Missile,
                WeaponTier.Missile => WeaponTier.PhotonTorpedo,
                WeaponTier.PhotonTorpedo => null, // Max tier
                _ => null
            };
        }

        /// <summary>
        /// Check if research can be started.
        /// </summary>
        private bool CanStartResearch()
        {
            if (GameManager.Instance?.UpgradeSystem == null) return false;

            // Check if already researching
            var researchingTier = GameManager.Instance.UpgradeSystem.GetResearchingTier(FactionType.Player);
            if (researchingTier.HasValue) return false;

            // Check if max tier reached
            var currentTier = GameManager.Instance.UpgradeSystem.GetWeaponTier(FactionType.Player);
            var nextTier = GetNextTier(currentTier);
            if (!nextTier.HasValue) return false;

            // Check if can afford
            bool canAfford = GameManager.Instance.UpgradeSystem.CanAffordNextResearch(FactionType.Player);
            return canAfford;
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
