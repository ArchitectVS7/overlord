using UnityEngine;
using TMPro;
using System.Linq;
using Overlord.Core;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Fleet panel displaying craft and platoon counts for selected planet.
    /// Shows breakdown by craft type and total platoon count.
    /// </summary>
    public class FleetPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Text Components")]
        [SerializeField] private TMP_Text craftSummaryText;
        [SerializeField] private TMP_Text platoonSummaryText;

        [Header("Colors")]
        [SerializeField] private Color craftColor = new Color(0.4f, 0.7f, 0.9f); // Light blue
        [SerializeField] private Color platoonColor = new Color(0.7f, 0.9f, 0.4f); // Light green
        [SerializeField] private Color noUnitsColor = new Color(0.5f, 0.5f, 0.5f); // Gray

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
            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased += OnCraftChanged;
                GameManager.Instance.CraftSystem.OnCraftDestroyed += OnCraftDestroyed;
            }

            if (GameManager.Instance?.PlatoonSystem != null)
            {
                GameManager.Instance.PlatoonSystem.OnPlatoonCommissioned += OnPlatoonChanged;
                GameManager.Instance.PlatoonSystem.OnPlatoonDisbanded += OnPlatoonDisbanded;
            }
        }

        /// <summary>
        /// Unsubscribe from Core events.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased -= OnCraftChanged;
                GameManager.Instance.CraftSystem.OnCraftDestroyed -= OnCraftDestroyed;
            }

            if (GameManager.Instance?.PlatoonSystem != null)
            {
                GameManager.Instance.PlatoonSystem.OnPlatoonCommissioned -= OnPlatoonChanged;
                GameManager.Instance.PlatoonSystem.OnPlatoonDisbanded -= OnPlatoonDisbanded;
            }
        }

        #endregion

        #region Event Handlers

        /// <summary>
        /// Called when a craft is purchased.
        /// </summary>
        private void OnCraftChanged(int planetId, CraftType craftType)
        {
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshFleet(planetId);
            }
        }

        /// <summary>
        /// Called when a craft is destroyed.
        /// </summary>
        private void OnCraftDestroyed(int craftId)
        {
            // Refresh if current planet has this craft
            RefreshFleet(GameManager.Instance?.SelectedPlanetID ?? -1);
        }

        /// <summary>
        /// Called when a platoon is commissioned.
        /// </summary>
        private void OnPlatoonChanged(int planetId, int platoonId)
        {
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshFleet(planetId);
            }
        }

        /// <summary>
        /// Called when a platoon is disbanded.
        /// </summary>
        private void OnPlatoonDisbanded(int platoonId)
        {
            // Refresh if current planet might be affected
            RefreshFleet(GameManager.Instance?.SelectedPlanetID ?? -1);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Refresh fleet display for a specific planet.
        /// </summary>
        public void RefreshFleet(int planetID)
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

            // Update craft summary
            UpdateCraftSummary(planetID);

            // Update platoon summary
            UpdatePlatoonSummary(planetID);
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Update craft summary display.
        /// </summary>
        private void UpdateCraftSummary(int planetID)
        {
            if (craftSummaryText == null) return;

            if (GameManager.Instance?.GameState?.Craft == null)
            {
                craftSummaryText.text = "CRAFT: --";
                craftSummaryText.color = noUnitsColor;
                return;
            }

            // Get all craft at this planet
            var craftsAtPlanet = GameManager.Instance.GameState.Craft
                .Where(c => c.Location == planetID)
                .ToList();

            if (craftsAtPlanet.Count == 0)
            {
                craftSummaryText.text = "CRAFT: None";
                craftSummaryText.color = noUnitsColor;
                return;
            }

            // Count by type
            var scoutCount = craftsAtPlanet.Count(c => c.Type == CraftType.Scout);
            var bcCount = craftsAtPlanet.Count(c => c.Type == CraftType.BattleCruiser);
            var ccCount = craftsAtPlanet.Count(c => c.Type == CraftType.CargoCruiser);
            var bomberCount = craftsAtPlanet.Count(c => c.Type == CraftType.Bomber);

            // Build summary text
            var summary = "CRAFT:\n";
            if (scoutCount > 0) summary += $"  Scouts: {scoutCount}\n";
            if (bcCount > 0) summary += $"  B.Cruisers: {bcCount}\n";
            if (ccCount > 0) summary += $"  C.Cruisers: {ccCount}\n";
            if (bomberCount > 0) summary += $"  Bombers: {bomberCount}\n";

            summary += $"  Total: {craftsAtPlanet.Count}";

            craftSummaryText.text = summary;
            craftSummaryText.color = craftColor;
        }

        /// <summary>
        /// Update platoon summary display.
        /// </summary>
        private void UpdatePlatoonSummary(int planetID)
        {
            if (platoonSummaryText == null) return;

            if (GameManager.Instance?.GameState?.Platoons == null)
            {
                platoonSummaryText.text = "PLATOONS: --";
                platoonSummaryText.color = noUnitsColor;
                return;
            }

            // Get all platoons at this planet
            var platoonsAtPlanet = GameManager.Instance.GameState.Platoons
                .Where(p => p.Location == planetID)
                .ToList();

            if (platoonsAtPlanet.Count == 0)
            {
                platoonSummaryText.text = "PLATOONS: None";
                platoonSummaryText.color = noUnitsColor;
                return;
            }

            // Count by equipment type
            var infantryCount = platoonsAtPlanet.Count(p => p.EquipmentType == EquipmentType.Infantry);
            var gliderCount = platoonsAtPlanet.Count(p => p.EquipmentType == EquipmentType.Glider);
            var tankCount = platoonsAtPlanet.Count(p => p.EquipmentType == EquipmentType.Tank);
            var artilleryCount = platoonsAtPlanet.Count(p => p.EquipmentType == EquipmentType.Artillery);
            var airMobileCount = platoonsAtPlanet.Count(p => p.EquipmentType == EquipmentType.AirMobile);

            // Build summary text
            var summary = "PLATOONS:\n";
            if (infantryCount > 0) summary += $"  Infantry: {infantryCount}\n";
            if (gliderCount > 0) summary += $"  Glider: {gliderCount}\n";
            if (tankCount > 0) summary += $"  Tank: {tankCount}\n";
            if (artilleryCount > 0) summary += $"  Artillery: {artilleryCount}\n";
            if (airMobileCount > 0) summary += $"  Air Mobile: {airMobileCount}\n";

            summary += $"  Total: {platoonsAtPlanet.Count}";

            platoonSummaryText.text = summary;
            platoonSummaryText.color = platoonColor;
        }

        /// <summary>
        /// Clear all fleet displays.
        /// </summary>
        private void ClearDisplay()
        {
            if (craftSummaryText != null)
            {
                craftSummaryText.text = "CRAFT: --";
                craftSummaryText.color = noUnitsColor;
            }

            if (platoonSummaryText != null)
            {
                platoonSummaryText.text = "PLATOONS: --";
                platoonSummaryText.color = noUnitsColor;
            }
        }

        #endregion
    }
}
