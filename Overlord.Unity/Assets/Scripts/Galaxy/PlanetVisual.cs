using UnityEngine;
using Overlord.Core;

namespace Overlord.Unity.Galaxy
{
    /// <summary>
    /// Visual representation of a planet from Core.GameState.
    /// Handles rendering, color updates, and click detection.
    /// </summary>
    public class PlanetVisual : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Visual Settings")]
        [SerializeField] private SpriteRenderer planetSprite;
        [SerializeField] private float baseScale = 1f;
        [SerializeField] private Color playerColor = new Color(0.19f, 0.5f, 0.75f); // #3080C0
        [SerializeField] private Color aiColor = new Color(0.75f, 0.19f, 0.19f); // #C03030
        [SerializeField] private Color neutralColor = new Color(0.5f, 0.5f, 0.5f); // #808080

        [Header("Interaction")]
        [SerializeField] private GameObject selectionRing;

        #endregion

        #region Private Fields

        private PlanetEntity corePlanet;
        private int planetID;
        private bool isSelected;

        #endregion

        #region Properties

        public int PlanetID => planetID;
        public PlanetEntity CorePlanet => corePlanet;
        public bool IsSelected => isSelected;

        #endregion

        #region Initialization

        /// <summary>
        /// Initializes planet visual from Core.PlanetEntity data.
        /// </summary>
        public void Initialize(PlanetEntity planet)
        {
            if (planet == null)
            {
                Debug.LogError("Cannot initialize PlanetVisual with null planet!");
                return;
            }

            corePlanet = planet;
            planetID = planet.ID;

            // Set name for debugging
            gameObject.name = $"Planet_{planet.Name}";

            // Position from Core
            transform.position = new Vector3(planet.Position.X, planet.Position.Y, 0f);

            // Update visual
            UpdateVisual();

            // Hide selection ring initially
            if (selectionRing != null)
            {
                selectionRing.SetActive(false);
            }

            Debug.Log($"PlanetVisual initialized: {planet.Name} at ({planet.Position.X}, {planet.Position.Y})");
        }

        #endregion

        #region Visual Update

        /// <summary>
        /// Updates visual appearance based on Core planet state.
        /// </summary>
        public void UpdateVisual()
        {
            if (corePlanet == null)
            {
                return;
            }

            // Color by owner
            Color color = neutralColor;
            if (corePlanet.Owner == FactionType.Player)
            {
                color = playerColor;
            }
            else if (corePlanet.Owner == FactionType.AI)
            {
                color = aiColor;
            }

            if (planetSprite != null)
            {
                planetSprite.color = color;
            }

            // Scale based on planet size (placeholder - all same size for now)
            transform.localScale = Vector3.one * baseScale;
        }

        #endregion

        #region Selection

        /// <summary>
        /// Sets selection state and shows/hides selection ring.
        /// </summary>
        public void SetSelected(bool selected)
        {
            isSelected = selected;

            if (selectionRing != null)
            {
                selectionRing.SetActive(selected);
            }
        }

        #endregion

        #region Mouse Events

        /// <summary>
        /// Called when planet is clicked.
        /// </summary>
        void OnMouseDown()
        {
            Debug.Log($"Planet clicked: {corePlanet?.Name ?? "Unknown"}");

            // Notify selection system (will be hooked up in Phase 5)
            // For now, just toggle selection for testing
            SetSelected(!isSelected);
        }

        #endregion
    }
}
