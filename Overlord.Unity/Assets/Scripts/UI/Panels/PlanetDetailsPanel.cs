using UnityEngine;
using TMPro;
using System.Linq;
using System.Text;
using Overlord.Core;
using Overlord.Core.Models;

namespace Overlord.Unity.UI.Panels
{
    /// <summary>
    /// Planet details panel displaying comprehensive information about selected planet.
    /// Shows owner, population, morale, tax rate, buildings, defenses, and income.
    /// </summary>
    public class PlanetDetailsPanel : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Basic Info")]
        [SerializeField] private TMP_Text planetNameText;
        [SerializeField] private TMP_Text ownerText;

        [Header("Population & Morale")]
        [SerializeField] private TMP_Text populationText;
        [SerializeField] private TMP_Text moraleText;
        [SerializeField] private TMP_Text taxText;

        [Header("Infrastructure")]
        [SerializeField] private TMP_Text buildingsText;
        [SerializeField] private TMP_Text defensesText;

        [Header("Colors")]
        [SerializeField] private Color playerColor = new Color(0.19f, 0.5f, 0.75f); // #3080C0
        [SerializeField] private Color aiColor = new Color(0.75f, 0.19f, 0.19f); // #C03030
        [SerializeField] private Color neutralColor = new Color(0.5f, 0.5f, 0.5f); // #808080
        [SerializeField] private Color highMoraleColor = new Color(0.2f, 0.8f, 0.2f); // Green >= 75
        [SerializeField] private Color mediumMoraleColor = new Color(0.8f, 0.8f, 0.2f); // Yellow 50-74
        [SerializeField] private Color lowMoraleColor = new Color(0.8f, 0.2f, 0.2f); // Red < 50

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
            if (GameManager.Instance?.PopulationSystem != null)
            {
                GameManager.Instance.PopulationSystem.OnPopulationChanged += OnPopulationChanged;
                GameManager.Instance.PopulationSystem.OnMoraleChanged += OnMoraleChanged;
            }

            if (GameManager.Instance?.BuildingSystem != null)
            {
                GameManager.Instance.BuildingSystem.OnBuildingStarted += OnBuildingChanged;
                GameManager.Instance.BuildingSystem.OnBuildingCompleted += OnBuildingChanged;
            }

            if (GameManager.Instance?.TaxationSystem != null)
            {
                GameManager.Instance.TaxationSystem.OnTaxRateChanged += OnTaxRateChanged;
            }
        }

        /// <summary>
        /// Unsubscribe from Core events.
        /// </summary>
        private void UnsubscribeFromEvents()
        {
            if (GameManager.Instance?.PopulationSystem != null)
            {
                GameManager.Instance.PopulationSystem.OnPopulationChanged -= OnPopulationChanged;
                GameManager.Instance.PopulationSystem.OnMoraleChanged -= OnMoraleChanged;
            }

            if (GameManager.Instance?.BuildingSystem != null)
            {
                GameManager.Instance.BuildingSystem.OnBuildingStarted -= OnBuildingChanged;
                GameManager.Instance.BuildingSystem.OnBuildingCompleted -= OnBuildingChanged;
            }

            if (GameManager.Instance?.TaxationSystem != null)
            {
                GameManager.Instance.TaxationSystem.OnTaxRateChanged -= OnTaxRateChanged;
            }
        }

        #endregion

        #region Event Handlers

        private void OnPopulationChanged(int planetId, int newPopulation)
        {
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshDetails(planetId);
            }
        }

        private void OnMoraleChanged(int planetId, int newMorale)
        {
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshDetails(planetId);
            }
        }

        private void OnBuildingChanged(int planetId, BuildingType buildingType)
        {
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshDetails(planetId);
            }
        }

        private void OnTaxRateChanged(int planetId, int newRate)
        {
            if (planetId == GameManager.Instance?.SelectedPlanetID)
            {
                RefreshDetails(planetId);
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Refresh planet details display for a specific planet.
        /// </summary>
        public void RefreshDetails(int planetID)
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

            // Update basic info
            UpdateBasicInfo(planet);

            // Update population & morale
            UpdatePopulationInfo(planet);

            // Update infrastructure
            UpdateBuildingsInfo(planet);
            UpdateDefensesInfo(planet);
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Update basic planet info (name, owner).
        /// </summary>
        private void UpdateBasicInfo(PlanetEntity planet)
        {
            if (planetNameText != null)
            {
                planetNameText.text = $"PLANET: {planet.Name}";
                planetNameText.color = Color.white;
            }

            if (ownerText != null)
            {
                string ownerName = GetOwnerName(planet.Owner);
                Color ownerColor = GetOwnerColor(planet.Owner);
                ownerText.text = $"OWNER: {ownerName}";
                ownerText.color = ownerColor;
            }
        }

        /// <summary>
        /// Update population and morale info.
        /// </summary>
        private void UpdatePopulationInfo(PlanetEntity planet)
        {
            if (populationText != null)
            {
                populationText.text = $"POPULATION: {planet.Population:N0}";
                populationText.color = Color.white;
            }

            if (moraleText != null)
            {
                moraleText.text = $"MORALE: {planet.Morale}%";
                moraleText.color = GetMoraleColor(planet.Morale);
            }

            if (taxText != null)
            {
                taxText.text = $"TAX RATE: {planet.TaxRate}%";
                taxText.color = Color.white;
            }
        }

        /// <summary>
        /// Update buildings info.
        /// </summary>
        private void UpdateBuildingsInfo(PlanetEntity planet)
        {
            if (buildingsText == null) return;

            var buildingsList = FormatBuildingsList(planet);
            if (string.IsNullOrEmpty(buildingsList))
            {
                buildingsText.text = "BUILDINGS: None";
                buildingsText.color = neutralColor;
            }
            else
            {
                buildingsText.text = $"BUILDINGS:\n{buildingsList}";
                buildingsText.color = Color.white;
            }
        }

        /// <summary>
        /// Update defenses info.
        /// </summary>
        private void UpdateDefensesInfo(PlanetEntity planet)
        {
            if (defensesText == null) return;

            var defensesList = FormatDefensesText(planet);
            if (string.IsNullOrEmpty(defensesList))
            {
                defensesText.text = "DEFENSES: None";
                defensesText.color = neutralColor;
            }
            else
            {
                defensesText.text = $"DEFENSES:\n{defensesList}";
                defensesText.color = Color.white;
            }
        }

        /// <summary>
        /// Format buildings list for display.
        /// </summary>
        private string FormatBuildingsList(PlanetEntity planet)
        {
            if (planet.Structures == null || planet.Structures.Count == 0)
                return string.Empty;

            var sb = new StringBuilder();

            foreach (var structure in planet.Structures)
            {
                string status = structure.Status == BuildingStatus.Active ? "[Active]" :
                               structure.Status == BuildingStatus.UnderConstruction ? $"[{structure.TurnsRemaining}T]" :
                               $"[{structure.Status}]";
                sb.AppendLine($"  {structure.Type} {status}");
            }

            return sb.ToString().TrimEnd();
        }

        /// <summary>
        /// Format defenses text for display.
        /// </summary>
        private string FormatDefensesText(PlanetEntity planet)
        {
            if (planet.Structures == null || planet.Structures.Count == 0)
                return string.Empty;

            var sb = new StringBuilder();

            // Count defensive structures
            var orbitalDefenses = planet.Structures.Count(s => s.Type == BuildingType.OrbitalDefense && s.Status == BuildingStatus.Active);

            if (orbitalDefenses > 0)
                sb.AppendLine($"  Orbital Defenses: {orbitalDefenses}");

            return sb.ToString().TrimEnd();
        }

        /// <summary>
        /// Get owner name for display.
        /// </summary>
        private string GetOwnerName(FactionType owner)
        {
            switch (owner)
            {
                case FactionType.Player: return "Player";
                case FactionType.AI: return "AI";
                case FactionType.Neutral: return "Neutral";
                default: return "Unknown";
            }
        }

        /// <summary>
        /// Get color for owner faction.
        /// </summary>
        private Color GetOwnerColor(FactionType owner)
        {
            switch (owner)
            {
                case FactionType.Player: return playerColor;
                case FactionType.AI: return aiColor;
                case FactionType.Neutral: return neutralColor;
                default: return Color.white;
            }
        }

        /// <summary>
        /// Get color based on morale level.
        /// </summary>
        private Color GetMoraleColor(int morale)
        {
            if (morale >= 75)
                return highMoraleColor; // Green
            if (morale >= 50)
                return mediumMoraleColor; // Yellow

            return lowMoraleColor; // Red
        }

        /// <summary>
        /// Clear all detail displays.
        /// </summary>
        private void ClearDisplay()
        {
            SetTextIfNotNull(planetNameText, "PLANET: --", Color.gray);
            SetTextIfNotNull(ownerText, "OWNER: --", Color.gray);
            SetTextIfNotNull(populationText, "POPULATION: --", Color.gray);
            SetTextIfNotNull(moraleText, "MORALE: --", Color.gray);
            SetTextIfNotNull(taxText, "TAX RATE: --", Color.gray);
            SetTextIfNotNull(buildingsText, "BUILDINGS: --", Color.gray);
            SetTextIfNotNull(defensesText, "DEFENSES: --", Color.gray);
        }

        /// <summary>
        /// Helper to set text and color if component exists.
        /// </summary>
        private void SetTextIfNotNull(TMP_Text textComponent, string text, Color color)
        {
            if (textComponent != null)
            {
                textComponent.text = text;
                textComponent.color = color;
            }
        }

        #endregion
    }
}
