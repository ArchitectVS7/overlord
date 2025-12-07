using UnityEngine;
using System.Collections.Generic;
using Overlord.Core;

namespace Overlord.Unity.Galaxy
{
    /// <summary>
    /// Main manager for the galaxy map scene.
    /// Coordinates planet visuals, camera, and scene state.
    /// </summary>
    public class GalaxyMapManager : MonoBehaviour
    {
        #region Singleton

        private static GalaxyMapManager _instance;
        public static GalaxyMapManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<GalaxyMapManager>();
                }
                return _instance;
            }
        }

        #endregion

        #region Serialized Fields

        [Header("Components")]
        [SerializeField] private PlanetFactory planetFactory;

        [Header("Containers")]
        [SerializeField] private Transform planetsContainer;

        #endregion

        #region Private Fields

        private Dictionary<int, PlanetVisual> planetVisuals = new Dictionary<int, PlanetVisual>();
        private bool isInitialized;

        #endregion

        #region Unity Lifecycle

        void Awake()
        {
            // Singleton setup
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            _instance = this;

            Debug.Log("GalaxyMapManager awakened");
        }

        void Start()
        {
            InitializeGalaxyMap();
        }

        #endregion

        #region Initialization

        /// <summary>
        /// Initializes galaxy map from GameManager.GameState.
        /// </summary>
        private void InitializeGalaxyMap()
        {
            if (isInitialized)
            {
                Debug.LogWarning("GalaxyMapManager already initialized");
                return;
            }

            // Check if GameManager exists and has GameState
            if (GameManager.Instance == null)
            {
                Debug.LogError("GameManager not found! Cannot initialize galaxy map.");
                return;
            }

            if (GameManager.Instance.GameState == null)
            {
                Debug.LogError("GameState is null! Creating new game...");
                GameManager.Instance.NewGame();
            }

            // Spawn planet visuals
            SpawnPlanets();

            isInitialized = true;
            Debug.Log("GalaxyMapManager initialized successfully");
        }

        /// <summary>
        /// Spawns visual representations for all planets in GameState.
        /// </summary>
        private void SpawnPlanets()
        {
            if (GameManager.Instance?.GameState?.Planets == null)
            {
                Debug.LogError("Cannot spawn planets - GameState.Planets is null");
                return;
            }

            if (planetFactory == null)
            {
                Debug.LogError("PlanetFactory not assigned to GalaxyMapManager!");
                return;
            }

            // Clear existing visuals
            ClearPlanets();

            // Spawn each planet
            int planetCount = 0;
            foreach (PlanetEntity planet in GameManager.Instance.GameState.Planets)
            {
                PlanetVisual visual = planetFactory.CreatePlanetVisual(planet);
                if (visual != null)
                {
                    planetVisuals[planet.ID] = visual;
                    planetCount++;
                }
            }

            Debug.Log($"Spawned {planetCount} planet visuals");
        }

        /// <summary>
        /// Clears all existing planet visuals.
        /// </summary>
        private void ClearPlanets()
        {
            foreach (var kvp in planetVisuals)
            {
                if (kvp.Value != null)
                {
                    Destroy(kvp.Value.gameObject);
                }
            }
            planetVisuals.Clear();
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Gets planet visual by ID.
        /// </summary>
        public PlanetVisual GetPlanetVisual(int planetID)
        {
            if (planetVisuals.TryGetValue(planetID, out PlanetVisual visual))
            {
                return visual;
            }
            return null;
        }

        /// <summary>
        /// Refreshes all planet visuals to match current GameState.
        /// </summary>
        public void RefreshAllPlanets()
        {
            foreach (var kvp in planetVisuals)
            {
                kvp.Value?.UpdateVisual();
            }
        }

        #endregion
    }
}
