using UnityEngine;
using TMPro;
using System.Collections.Generic;
using Overlord.Core;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Message log panel displaying game events in chronological order.
    /// Subscribes to all Core system events for comprehensive logging.
    /// </summary>
    public class MessageLogPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Text Components")]
        [SerializeField] private TMP_Text logText;

        [Header("Settings")]
        [SerializeField] private int maxMessages = 20;
        [SerializeField] private Color systemMessageColor = new Color(0.7f, 0.7f, 0.7f);
        [SerializeField] private Color playerActionColor = new Color(0.3f, 0.8f, 0.3f);
        [SerializeField] private Color combatColor = new Color(0.8f, 0.3f, 0.3f);
        [SerializeField] private Color warningColor = new Color(0.8f, 0.8f, 0.2f);

        #endregion

        #region Private Fields

        private Queue<string> messages = new Queue<string>();

        #endregion

        #region Unity Lifecycle

        void OnEnable()
        {
            SubscribeToEvents();
            RefreshDisplay();
        }

        void OnDisable()
        {
            UnsubscribeFromEvents();
        }

        #endregion

        #region Event Subscription

        /// <summary>
        /// Subscribe to all Core system events.
        /// </summary>
        private void SubscribeToEvents()
        {
            // Turn system events
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged += OnPhaseChanged;
                GameManager.Instance.TurnSystem.OnTurnStarted += OnTurnStarted;
            }

            // Resource system events
            if (GameManager.Instance?.ResourceSystem != null)
            {
                GameManager.Instance.ResourceSystem.OnResourcesChanged += OnResourcesChanged;
                GameManager.Instance.ResourceSystem.OnResourceCritical += OnResourceCritical;
            }

            // Combat system events
            if (GameManager.Instance?.CombatSystem != null)
            {
                GameManager.Instance.CombatSystem.OnBattleCompleted += OnBattleCompleted;
            }

            // Building system events
            if (GameManager.Instance?.BuildingSystem != null)
            {
                GameManager.Instance.BuildingSystem.OnConstructionStarted += OnConstructionStarted;
                GameManager.Instance.BuildingSystem.OnConstructionCompleted += OnConstructionCompleted;
            }

            // Craft system events
            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased += OnCraftPurchased;
                GameManager.Instance.CraftSystem.OnCraftDestroyed += OnCraftDestroyed;
            }

            // Income system events
            if (GameManager.Instance?.IncomeSystem != null)
            {
                GameManager.Instance.IncomeSystem.OnIncomeGenerated += OnIncomeGenerated;
            }
        }

        /// <summary>
        /// Unsubscribe from all Core system events to prevent memory leaks.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged -= OnPhaseChanged;
                GameManager.Instance.TurnSystem.OnTurnStarted -= OnTurnStarted;
            }

            if (GameManager.Instance?.ResourceSystem != null)
            {
                GameManager.Instance.ResourceSystem.OnResourcesChanged -= OnResourcesChanged;
                GameManager.Instance.ResourceSystem.OnResourceCritical -= OnResourceCritical;
            }

            if (GameManager.Instance?.CombatSystem != null)
            {
                GameManager.Instance.CombatSystem.OnBattleCompleted -= OnBattleCompleted;
            }

            if (GameManager.Instance?.BuildingSystem != null)
            {
                GameManager.Instance.BuildingSystem.OnConstructionStarted -= OnConstructionStarted;
                GameManager.Instance.BuildingSystem.OnConstructionCompleted -= OnConstructionCompleted;
            }

            if (GameManager.Instance?.CraftSystem != null)
            {
                GameManager.Instance.CraftSystem.OnCraftPurchased -= OnCraftPurchased;
                GameManager.Instance.CraftSystem.OnCraftDestroyed -= OnCraftDestroyed;
            }

            if (GameManager.Instance?.IncomeSystem != null)
            {
                GameManager.Instance.IncomeSystem.OnIncomeGenerated -= OnIncomeGenerated;
            }
        }

        #endregion

        #region Event Handlers

        private void OnPhaseChanged(TurnPhase phase)
        {
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(systemMessageColor)}>PHASE: {phase}</color>");
        }

        private void OnTurnStarted(int turn)
        {
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(systemMessageColor)}>--- TURN {turn} ---</color>");
        }

        private void OnResourcesChanged(int planetId, ResourceDelta delta)
        {
            string planetName = GetPlanetName(planetId);
            if (delta.Credits != 0)
            {
                string sign = delta.Credits > 0 ? "+" : "";
                AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(playerActionColor)}>{planetName}: {sign}{delta.Credits} Credits</color>");
            }
        }

        private void OnResourceCritical(int planetId, ResourceType resourceType)
        {
            string planetName = GetPlanetName(planetId);
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(warningColor)}>WARNING: {planetName} - {resourceType} critically low!</color>");
        }

        private void OnBattleCompleted(int attackerPlanetId, int defenderPlanetId, bool attackerWon)
        {
            string attackerName = GetPlanetName(attackerPlanetId);
            string defenderName = GetPlanetName(defenderPlanetId);
            string result = attackerWon ? "VICTORY" : "DEFEAT";
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(combatColor)}>BATTLE: {attackerName} vs {defenderName} - {result}</color>");
        }

        private void OnConstructionStarted(int planetId, BuildingType buildingType)
        {
            string planetName = GetPlanetName(planetId);
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(playerActionColor)}>{planetName}: Construction started - {buildingType}</color>");
        }

        private void OnConstructionCompleted(int planetId, BuildingType buildingType)
        {
            string planetName = GetPlanetName(planetId);
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(playerActionColor)}>{planetName}: {buildingType} completed</color>");
        }

        private void OnCraftPurchased(int planetId, CraftType craftType)
        {
            string planetName = GetPlanetName(planetId);
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(playerActionColor)}>{planetName}: Purchased {craftType}</color>");
        }

        private void OnCraftDestroyed(int craftId)
        {
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(combatColor)}>Craft destroyed: ID {craftId}</color>");
        }

        private void OnIncomeGenerated(int planetId, ResourceDelta income)
        {
            string planetName = GetPlanetName(planetId);
            AddMessage($"<color=#{ColorUtility.ToHtmlStringRGB(systemMessageColor)}>{planetName}: Income +{income.Credits} Credits</color>");
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Add a message to the log.
        /// </summary>
        public void AddMessage(string message)
        {
            if (messages.Count >= maxMessages)
            {
                messages.Dequeue();
            }

            messages.Enqueue(message);
            RefreshDisplay();
        }

        /// <summary>
        /// Clear all messages from the log.
        /// </summary>
        public void ClearLog()
        {
            messages.Clear();
            RefreshDisplay();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Refresh the log display with all current messages.
        /// </summary>
        private void RefreshDisplay()
        {
            if (logText == null) return;

            logText.text = string.Join("\n", messages);
        }

        /// <summary>
        /// Get planet name from ID, with fallback.
        /// </summary>
        private string GetPlanetName(int planetId)
        {
            if (GameManager.Instance?.GameState?.PlanetLookup.TryGetValue(planetId, out var planet) == true)
            {
                return planet.Name;
            }
            return $"Planet {planetId}";
        }

        #endregion
    }
}
