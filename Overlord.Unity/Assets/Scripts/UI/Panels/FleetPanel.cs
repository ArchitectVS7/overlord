using UnityEngine;
using TMPro;
using System.Linq;
using Overlord.Core;
using Overlord.Core.Models;

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
                GameManager.Instance.CraftSystem.OnCraftPurchased += OnCraftPurchased;
                GameManager.Instance.CraftSystem.OnCraftScrapped += OnCraftScrapped;
            }

            if (GameManager.Instance?.PlatoonSystem != null)
            {
                GameManager.Instance.PlatoonSystem.OnPlatoonCommissioned += OnPlatoonCommissioned;
                GameManager.Instance.PlatoonSystem.OnPlatoonDecommissioned += OnPlatoonDecommissioned;
            }
        }

        /// <summary>
        /// Unsubscribe from Core events.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased -= OnCraftPurchased;
                GameManager.Instance.CraftSystem.OnCraftScrapped -= OnCraftScrapped;
            }

            if (GameManager.Instance?.PlatoonSystem != null)
            {
                GameManager.Instance.PlatoonSystem.OnPlatoonCommissioned -= OnPlatoonCommissioned;
                GameManager.Instance.PlatoonSystem.OnPlatoonDecommissioned -= OnPlatoonDecommissioned;
            }
        }

        #endregion

        #region Event Handlers

        /// <summary>
        /// Called when a craft is purchased.
        /// </summary>
        private void OnCraftPurchased(int craftId)
        {
            // Look up craft to get its location
            if (GameManager.Instance?.GameState?.CraftLookup.TryGetValue(craftId, out var craft) == true)
            {
                if (craft.PlanetID == GameManager.Instance?.SelectedPlanetID)
                {
                    RefreshFleet(craft.PlanetID);
                }
            }
        }

        /// <summary>
        /// Called when a craft is scrapped.
        /// </summary>
        private void OnCraftScrapped(int craftId)
        {
            // Refresh current planet (craft might have been here)
            RefreshFleet(GameManager.Instance?.SelectedPlanetID ?? -1);
        }

        /// <summary>
        /// Called when a platoon is commissioned.
        /// </summary>
        private void OnPlatoonCommissioned(int platoonId)
        {
            // Look up platoon to get its location
            if (GameManager.Instance?.GameState?.PlatoonLookup.TryGetValue(platoonId, out var platoon) == true)
            {
                if (platoon.PlanetID == GameManager.Instance?.SelectedPlanetID)
                {
                    RefreshFleet(platoon.PlanetID);
                }
            }
        }

        /// <summary>
        /// Called when a platoon is decommissioned.
        /// </summary>
        private void OnPlatoonDecommissioned(int platoonId)
        {
            // Refresh current planet (platoon might have been here)
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
                .Where(c => c.PlanetID == planetID)
                .ToList();

            if (craftsAtPlanet.Count == 0)
            {
                craftSummaryText.text = "CRAFT: None";
                craftSummaryText.color = noUnitsColor;
                return;
            }

            // Count by type
            var bcCount = craftsAtPlanet.Count(c => c.Type == CraftType.BattleCruiser);
            var ccCount = craftsAtPlanet.Count(c => c.Type == CraftType.CargoCruiser);
            var ssCount = craftsAtPlanet.Count(c => c.Type == CraftType.SolarSatellite);
            var apCount = craftsAtPlanet.Count(c => c.Type == CraftType.AtmosphereProcessor);

            // Build summary text
            var summary = "CRAFT:\n";
            if (bcCount > 0) summary += $"  B.Cruisers: {bcCount}\n";
            if (ccCount > 0) summary += $"  C.Cruisers: {ccCount}\n";
            if (ssCount > 0) summary += $"  Satellites: {ssCount}\n";
            if (apCount > 0) summary += $"  Processors: {apCount}\n";

            summary += $"  Total: {craftsAtPlanet.Count()}";

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
                .Where(p => p.PlanetID == planetID)
                .ToList();

            if (platoonsAtPlanet.Count == 0)
            {
                platoonSummaryText.text = "PLATOONS: None";
                platoonSummaryText.color = noUnitsColor;
                return;
            }

            // Count by equipment level
            var civilianCount = platoonsAtPlanet.Count(p => p.Equipment == EquipmentLevel.Civilian);
            var basicCount = platoonsAtPlanet.Count(p => p.Equipment == EquipmentLevel.Basic);
            var standardCount = platoonsAtPlanet.Count(p => p.Equipment == EquipmentLevel.Standard);
            var advancedCount = platoonsAtPlanet.Count(p => p.Equipment == EquipmentLevel.Advanced);
            var eliteCount = platoonsAtPlanet.Count(p => p.Equipment == EquipmentLevel.Elite);

            // Build summary text
            var summary = "PLATOONS:\n";
            if (civilianCount > 0) summary += $"  Civilian: {civilianCount}\n";
            if (basicCount > 0) summary += $"  Basic: {basicCount}\n";
            if (standardCount > 0) summary += $"  Standard: {standardCount}\n";
            if (advancedCount > 0) summary += $"  Advanced: {advancedCount}\n";
            if (eliteCount > 0) summary += $"  Elite: {eliteCount}\n";

            summary += $"  Total: {platoonsAtPlanet.Count()}";

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
