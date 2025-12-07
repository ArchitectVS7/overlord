using UnityEngine;
using Overlord.Core;

namespace Overlord.Unity.Galaxy
{
    /// <summary>
    /// Factory for creating planet visual GameObjects from Core.PlanetEntity data.
    /// Uses prefab instantiation pattern.
    /// </summary>
    public class PlanetFactory : MonoBehaviour
    {
        #region Serialized Fields

        [Header("Prefabs")]
        [SerializeField] private GameObject planetPrefab;

        [Header("Settings")]
        [SerializeField] private Transform planetsContainer;

        #endregion

        #region Public Methods

        /// <summary>
        /// Creates a planet visual GameObject from Core planet data.
        /// </summary>
        /// <param name="planet">Core planet model</param>
        /// <returns>Created PlanetVisual component</returns>
        public PlanetVisual CreatePlanetVisual(PlanetEntity planet)
        {
            if (planet == null)
            {
                Debug.LogError("Cannot create planet visual from null planet!");
                return null;
            }

            if (planetPrefab == null)
            {
                Debug.LogError("Planet prefab not assigned to PlanetFactory!");
                return null;
            }

            // Instantiate prefab
            GameObject planetObj = Instantiate(planetPrefab);

            // Set parent (keep world position)
            if (planetsContainer != null)
            {
                planetObj.transform.SetParent(planetsContainer, true);
            }

            // Get PlanetVisual component
            PlanetVisual planetVisual = planetObj.GetComponent<PlanetVisual>();
            if (planetVisual == null)
            {
                Debug.LogError($"Planet prefab is missing PlanetVisual component!");
                Destroy(planetObj);
                return null;
            }

            // Initialize with Core data
            planetVisual.Initialize(planet);

            return planetVisual;
        }

        #endregion
    }
}
