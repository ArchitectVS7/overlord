using UnityEngine;
using Overlord.Core;
using Overlord.Core.Models;
using System;

namespace Overlord.Unity
{
    /// <summary>
    /// Main singleton that interfaces with Overlord.Core.
    /// Manages game state, systems, and coordinates between Unity and Core logic.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        #region Singleton

        private static GameManager _instance;
        public static GameManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = FindFirstObjectByType<GameManager>();
                    if (_instance == null)
                    {
                        var go = new GameObject("GameManager");
                        _instance = go.AddComponent<GameManager>();
                    }
                }
                return _instance;
            }
        }

        #endregion

        #region Core Systems

        // Core game state
        public GameState GameState { get; private set; }

        // Core systems
        public TurnSystem TurnSystem { get; private set; }
        public SaveSystem SaveSystem { get; private set; }
        public SettingsManager SettingsManager { get; private set; }
        public GalaxyGenerator GalaxyGenerator { get; private set; }
        public ResourceSystem ResourceSystem { get; private set; }
        public IncomeSystem IncomeSystem { get; private set; }
        public PopulationSystem PopulationSystem { get; private set; }
        public TaxationSystem TaxationSystem { get; private set; }
        public EntitySystem EntitySystem { get; private set; }
        public CraftSystem CraftSystem { get; private set; }
        public PlatoonSystem PlatoonSystem { get; private set; }
        public BuildingSystem BuildingSystem { get; private set; }
        public UpgradeSystem UpgradeSystem { get; private set; }
        public DefenseSystem DefenseSystem { get; private set; }
        public CombatSystem CombatSystem { get; private set; }
        public SpaceCombatSystem SpaceCombatSystem { get; private set; }
        public BombardmentSystem BombardmentSystem { get; private set; }
        public InvasionSystem InvasionSystem { get; private set; }
        public AIDecisionSystem AIDecisionSystem { get; private set; }

        #endregion

        #region Unity Lifecycle

        private void Awake()
        {
            // Enforce singleton
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);

            Debug.Log("GameManager initialized");
        }

        private void OnDestroy()
        {
            if (_instance == this)
            {
                _instance = null;
            }
        }

        #endregion

        #region Game Initialization

        /// <summary>
        /// Initializes a new game with default settings.
        /// </summary>
        public void NewGame(
            AIPersonality aiPersonality = AIPersonality.Balanced,
            AIDifficulty aiDifficulty = AIDifficulty.Normal)
        {
            Debug.Log($"Starting new game: AI={aiPersonality}, Difficulty={aiDifficulty}");

            // Initialize game state
            GameState = new GameState();

            // Initialize core systems
            SaveSystem = new SaveSystem();
            SettingsManager = new SettingsManager();
            GalaxyGenerator = new GalaxyGenerator(new Random());

            // Generate galaxy
            var galaxyData = GalaxyGenerator.GenerateGalaxy(GameState, 10, 42);
            Debug.Log($"Galaxy generated: {galaxyData.Planets.Count} planets");

            // Initialize resource and economy systems
            ResourceSystem = new ResourceSystem(GameState);
            IncomeSystem = new IncomeSystem(GameState, ResourceSystem);
            PopulationSystem = new PopulationSystem(GameState);
            TaxationSystem = new TaxationSystem(GameState, ResourceSystem);

            // Initialize entity systems
            EntitySystem = new EntitySystem(GameState);
            CraftSystem = new CraftSystem(GameState, EntitySystem, ResourceSystem);
            PlatoonSystem = new PlatoonSystem(GameState, EntitySystem);

            // Initialize building and defense systems
            BuildingSystem = new BuildingSystem(GameState);
            UpgradeSystem = new UpgradeSystem(GameState);
            DefenseSystem = new DefenseSystem(GameState);

            // Initialize combat systems
            CombatSystem = new CombatSystem(GameState, PlatoonSystem, DefenseSystem);
            SpaceCombatSystem = new SpaceCombatSystem(GameState, CombatSystem, DefenseSystem);
            BombardmentSystem = new BombardmentSystem(GameState, CombatSystem);
            InvasionSystem = new InvasionSystem(GameState, CombatSystem, PlatoonSystem);

            // Initialize AI system
            AIDecisionSystem = new AIDecisionSystem(
                GameState,
                IncomeSystem,
                ResourceSystem,
                BuildingSystem,
                CraftSystem,
                PlatoonSystem,
                aiPersonality,
                aiDifficulty);

            // Initialize turn system (must be last)
            TurnSystem = new TurnSystem(
                GameState,
                IncomeSystem,
                PopulationSystem,
                TaxationSystem,
                BuildingSystem,
                UpgradeSystem,
                CraftSystem,
                PlatoonSystem,
                CombatSystem);

            // Subscribe to events
            SubscribeToEvents();

            Debug.Log($"New game initialized - Turn {GameState.CurrentTurn}");
        }

        /// <summary>
        /// Loads a game from save data.
        /// </summary>
        public void LoadGame(string saveFilePath)
        {
            Debug.Log($"Loading game from: {saveFilePath}");

            try
            {
                SaveSystem = new SaveSystem();
                string json = System.IO.File.ReadAllText(saveFilePath);
                GameState = SaveSystem.Deserialize(json);

                // Re-initialize all systems with loaded game state
                // (Similar to NewGame but without generating new galaxy)
                ResourceSystem = new ResourceSystem(GameState);
                IncomeSystem = new IncomeSystem(GameState, ResourceSystem);
                // ... (initialize other systems)

                SubscribeToEvents();

                Debug.Log($"Game loaded successfully - Turn {GameState.CurrentTurn}");
            }
            catch (Exception ex)
            {
                Debug.LogError($"Failed to load game: {ex.Message}");
            }
        }

        /// <summary>
        /// Saves the current game to a file.
        /// </summary>
        public void SaveGame(string saveFilePath)
        {
            Debug.Log($"Saving game to: {saveFilePath}");

            try
            {
                string json = SaveSystem.Serialize(GameState);
                System.IO.File.WriteAllText(saveFilePath, json);
                Debug.Log("Game saved successfully");
            }
            catch (Exception ex)
            {
                Debug.LogError($"Failed to save game: {ex.Message}");
            }
        }

        #endregion

        #region Event Handling

        private void SubscribeToEvents()
        {
            // Turn events
            TurnSystem.OnPhaseChanged += OnPhaseChanged;
            TurnSystem.OnTurnEnded += OnTurnEnded;

            // Combat events
            CombatSystem.OnCombatResolved += OnCombatResolved;
            BombardmentSystem.OnBombardmentComplete += OnBombardmentComplete;
            InvasionSystem.OnInvasionComplete += OnInvasionComplete;

            // AI events
            AIDecisionSystem.OnAITurnStarted += OnAITurnStarted;
            AIDecisionSystem.OnAITurnCompleted += OnAITurnCompleted;
            AIDecisionSystem.OnAIAttacking += OnAIAttacking;
            AIDecisionSystem.OnAIBuilding += OnAIBuilding;
        }

        private void OnPhaseChanged(TurnPhase phase)
        {
            Debug.Log($"Phase changed to: {phase}");
        }

        private void OnTurnEnded(int turn)
        {
            Debug.Log($"Turn {turn} ended");
        }

        private void OnCombatResolved(CombatResult result)
        {
            Debug.Log($"Combat resolved: {result.Winner} wins at planet {result.PlanetID}");
        }

        private void OnBombardmentComplete(int planetID, int structuresDestroyed)
        {
            Debug.Log($"Bombardment at planet {planetID}: {structuresDestroyed} structures destroyed");
        }

        private void OnInvasionComplete(int planetID, FactionType newOwner)
        {
            Debug.Log($"Invasion at planet {planetID}: Now owned by {newOwner}");
        }

        private void OnAITurnStarted()
        {
            Debug.Log("AI turn started");
        }

        private void OnAITurnCompleted()
        {
            Debug.Log("AI turn completed");
        }

        private void OnAIAttacking(int targetPlanetID)
        {
            Debug.Log($"AI is attacking planet {targetPlanetID}");
        }

        private void OnAIBuilding(int planetID, BuildingType buildingType)
        {
            Debug.Log($"AI is building {buildingType} on planet {planetID}");
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Advances the game by one turn.
        /// </summary>
        public void EndTurn()
        {
            if (TurnSystem == null || GameState == null)
            {
                Debug.LogWarning("Cannot end turn - game not initialized");
                return;
            }

            Debug.Log($"Ending turn {GameState.CurrentTurn}...");
            TurnSystem.EndTurn();

            // Execute AI turn
            Debug.Log("Executing AI turn...");
            AIDecisionSystem.ExecuteAITurn();
        }

        /// <summary>
        /// Gets the current player faction.
        /// </summary>
        public FactionState GetPlayerFaction()
        {
            return GameState?.PlayerFaction;
        }

        /// <summary>
        /// Gets the current AI faction.
        /// </summary>
        public FactionState GetAIFaction()
        {
            return GameState?.AIFaction;
        }

        #endregion
    }
}
