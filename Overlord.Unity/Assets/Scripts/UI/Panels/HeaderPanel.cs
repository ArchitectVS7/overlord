using UnityEngine;
using TMPro;
using Overlord.Core;
using Overlord.Core.Models;
using System.Linq;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Header panel displaying turn number, current phase, and player credits.
    /// Updates in real-time based on Core events.
    /// </summary>
    public class HeaderPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Text Components")]
        [SerializeField] private TMP_Text turnText;
        [SerializeField] private TMP_Text phaseText;
        [SerializeField] private TMP_Text creditsText;

        [Header("Display Settings")]
        [SerializeField] private Color playerColor = new Color(0.19f, 0.5f, 0.75f); // #3080C0
        [SerializeField] private Color phaseIncomeColor = new Color(0.2f, 0.8f, 0.2f); // Green
        [SerializeField] private Color phaseActionColor = new Color(0.8f, 0.8f, 0.2f); // Yellow
        [SerializeField] private Color phaseCombatColor = new Color(0.8f, 0.2f, 0.2f); // Red
        [SerializeField] private Color phaseEndColor = new Color(0.5f, 0.5f, 0.5f); // Gray

        #endregion

        #region Unity Lifecycle

        void OnEnable()
        {
            SubscribeToEvents();
            RefreshHeader();
        }

        void OnDisable()
        {
            UnsubscribeFromEvents();
        }

        #endregion

        #region Event Subscription

        /// <summary>
        /// Subscribe to Core system events.
        /// </summary>
        private void SubscribeToEvents()
        {
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged += OnPhaseChanged;
            }

            if (GameManager.Instance?.ResourceSystem != null)
            {
                GameManager.Instance.ResourceSystem.OnResourcesChanged += OnResourcesChanged;
            }
        }

        /// <summary>
        /// Unsubscribe from Core system events to prevent memory leaks.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.TurnSystem != null)
            {
                GameManager.Instance.TurnSystem.OnPhaseChanged -= OnPhaseChanged;
            }

            if (GameManager.Instance?.ResourceSystem != null)
            {
                GameManager.Instance.ResourceSystem.OnResourcesChanged -= OnResourcesChanged;
            }
        }

        #endregion

        #region Event Handlers

        /// <summary>
        /// Called when turn phase changes.
        /// </summary>
        private void OnPhaseChanged(TurnPhase phase)
        {
            RefreshHeader();
        }

        /// <summary>
        /// Called when resources change on any planet.
        /// </summary>
        private void OnResourcesChanged(int planetId, ResourceDelta delta)
        {
            // Check if changed planet is player-owned
            if (GameManager.Instance?.GameState?.PlanetLookup.TryGetValue(planetId, out var planet) == true)
            {
                if (planet.Owner == FactionType.Player)
                {
                    RefreshCredits();
                }
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Refresh all header text components.
        /// </summary>
        public void RefreshHeader()
        {
            RefreshTurn();
            RefreshPhase();
            RefreshCredits();
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Update turn number display.
        /// </summary>
        private void RefreshTurn()
        {
            if (turnText == null) return;

            if (GameManager.Instance?.TurnSystem != null)
            {
                int turn = GameManager.Instance.TurnSystem.CurrentTurn;
                turnText.text = $"TURN: {turn}";
                turnText.color = Color.white;
            }
            else
            {
                turnText.text = "TURN: --";
                turnText.color = Color.gray;
            }
        }

        /// <summary>
        /// Update phase display with color coding.
        /// </summary>
        private void RefreshPhase()
        {
            if (phaseText == null) return;

            if (GameManager.Instance?.TurnSystem != null)
            {
                TurnPhase phase = GameManager.Instance.TurnSystem.CurrentPhase;
                string phaseName = GetPhaseName(phase);
                Color phaseColor = GetPhaseColor(phase);

                phaseText.text = $"PHASE: {phaseName}";
                phaseText.color = phaseColor;
            }
            else
            {
                phaseText.text = "PHASE: --";
                phaseText.color = Color.gray;
            }
        }

        /// <summary>
        /// Update credits display.
        /// </summary>
        private void RefreshCredits()
        {
            if (creditsText == null) return;

            if (GameManager.Instance?.ResourceSystem != null)
            {
                // Get total player resources across all owned planets
                var playerResources = GameManager.Instance.ResourceSystem.GetTotalResources(FactionType.Player);
                int credits = playerResources.Credits;

                creditsText.text = $"CREDITS: {credits:N0}";
                creditsText.color = playerColor;
            }
            else
            {
                creditsText.text = "CREDITS: --";
                creditsText.color = Color.gray;
            }
        }

        /// <summary>
        /// Get human-readable phase name.
        /// </summary>
        private string GetPhaseName(TurnPhase phase)
        {
            switch (phase)
            {
                case TurnPhase.Income: return "INCOME";
                case TurnPhase.Action: return "ACTION";
                case TurnPhase.Combat: return "COMBAT";
                case TurnPhase.End: return "END";
                default: return "UNKNOWN";
            }
        }

        /// <summary>
        /// Get color for current phase.
        /// </summary>
        private Color GetPhaseColor(TurnPhase phase)
        {
            switch (phase)
            {
                case TurnPhase.Income: return phaseIncomeColor;
                case TurnPhase.Action: return phaseActionColor;
                case TurnPhase.Combat: return phaseCombatColor;
                case TurnPhase.End: return phaseEndColor;
                default: return Color.white;
            }
        }

        #endregion
    }
}
