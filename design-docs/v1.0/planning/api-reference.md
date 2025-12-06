# API Reference

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Complete
**Architecture:** Dual-Library (Overlord.Core + Unity)

---

## Overview

This document provides a reference for the public API of the **Overlord.Core** library. All interfaces and classes listed here are intended for consumption by the Unity presentation layer.

**Key Principles:**
- Overlord.Core has NO dependencies on Unity
- Unity implements interfaces (IRenderer, IInputProvider, etc.)
- Communication via events (Overlord.Core fires events, Unity listens)
- Platform-agnostic game logic

---

## Core Interfaces

Unity must implement these interfaces to integrate with Overlord.Core.

### IGameSettings

```csharp
public interface IGameSettings
{
    // Graphics settings
    int ResolutionWidth { get; }
    int ResolutionHeight { get; }
    bool IsFullscreen { get; }
    int GraphicsQuality { get; } // 0 = Low, 1 = Medium, 2 = High

    // Audio settings
    float MasterVolume { get; }
    float MusicVolume { get; }
    float SfxVolume { get; }

    // Gameplay settings
    bool AutoSaveEnabled { get; }
    int AutoSaveInterval { get; } // Turns between auto-saves
    bool CloudSaveEnabled { get; }
    bool TutorialCompleted { get; }

    // Difficulty settings
    int AIDifficulty { get; } // 0 = Easy, 1 = Normal, 2 = Hard
}
```

**Implemented by:** Unity's SettingsManager (MonoBehaviour)

---

### IRenderer

```csharp
public interface IRenderer
{
    // Battle visualization
    void ShowBattleResult(BattleResult result);
    void PlayExplosionEffect(Vector3 position);
    void PlayLaserEffect(Vector3 start, Vector3 end, Color color);

    // UI notifications
    void ShowNotification(string message, NotificationType type);
    void ShowTooltip(string content);
    void HideTooltip();

    // Camera control
    void FocusCamera(string planetId);
    void ResetCamera();

    // Loading states
    void ShowLoadingScreen(string message);
    void HideLoadingScreen();
}
```

**Implemented by:** Unity's RenderManager (MonoBehaviour)

---

### IInputProvider

```csharp
public interface IInputProvider
{
    // Events fired by Unity input system
    event Action<string> OnPlanetClicked; // planetId
    event Action OnEndTurnClicked;
    event Action OnMenuOpened;
    event Action<int> OnSaveSlotSelected; // slotIndex

    // Input state queries
    bool IsMouseOverUI();
    Vector2 GetMousePosition();
}
```

**Implemented by:** Unity's InputManager (MonoBehaviour)

---

### IAudioMixer

```csharp
public interface IAudioMixer
{
    // Music control
    void PlayMusic(string trackName, bool loop = true);
    void StopMusic();
    void FadeMusic(float targetVolume, float duration);

    // Sound effects
    void PlaySfx(string sfxName, float volume = 1.0f);
    void PlaySfxAtPosition(string sfxName, Vector3 position, float volume = 1.0f);
}
```

**Implemented by:** Unity's AudioManager (MonoBehaviour)

---

## Core Systems

These are the main game logic systems in Overlord.Core.

### GameStateManager

**Namespace:** `Overlord.Core`

**Purpose:** Central manager for game state and coordination between systems.

```csharp
public class GameStateManager
{
    public static GameStateManager Instance { get; }

    // Game state access
    public GameState CurrentState { get; }

    // Game lifecycle
    public void StartNewGame(bool tutorialMode = false);
    public void LoadGame(SaveData saveData);
    public void QuitToMainMenu();

    // Events
    public event Action<GameState> OnGameStateChanged;
    public event Action<GameState> OnGameLoaded;
    public event Action OnGameEnded;
}
```

---

### TurnSystem

**Namespace:** `Overlord.Core.Systems`

**Purpose:** Manages turn-based gameplay loop.

**AFS Reference:** AFS-002

```csharp
public class TurnSystem
{
    public static TurnSystem Instance { get; }

    // Turn control
    public int CurrentTurn { get; }
    public void EndPlayerTurn();
    public void ProcessAITurn();

    // Turn phases
    public void ExecuteIncomePhase();
    public void ExecuteProductionPhase();
    public void ExecuteCombatPhase();
    public void ExecuteEndPhase();

    // Events
    public event Action<int> OnTurnStarted; // turnNumber
    public event Action<int> OnTurnEnded; // turnNumber
    public event Action OnPlayerTurnStarted;
    public event Action OnAITurnStarted;
    public event Action OnAITurnCompleted;
}
```

---

### SaveSystem

**Namespace:** `Overlord.Core.Systems`

**Purpose:** Save/load game state with System.Text.Json serialization.

**AFS Reference:** AFS-003

```csharp
public class SaveSystem
{
    public static SaveSystem Instance { get; }

    // Save/load operations
    public void SaveGame(int slotIndex, string saveName = null);
    public void LoadGame(int slotIndex);
    public void DeleteSave(int slotIndex);
    public void AutoSave();

    // Save metadata
    public SaveMetadata[] GetSaveSlots();
    public bool SaveExists(int slotIndex);

    // Events
    public event Action<int, bool> OnGameSaved; // slotIndex, success
    public event Action<int, bool> OnGameLoaded; // slotIndex, success
    public event Action<int> OnSaveDeleted; // slotIndex
}

public class SaveMetadata
{
    public int SlotIndex { get; set; }
    public string SaveName { get; set; }
    public DateTime SavedAt { get; set; }
    public int TurnNumber { get; set; }
    public float Playtime { get; set; }
    public byte[] Thumbnail { get; set; } // PNG encoded
}
```

---

### ResourceSystem

**Namespace:** `Overlord.Core.Systems`

**Purpose:** Manages faction resources (Credits, Minerals, Fuel, Food, Energy).

**AFS Reference:** AFS-021

```csharp
public class ResourceSystem
{
    public static ResourceSystem Instance { get; }

    // Resource access
    public int GetResource(string factionId, ResourceType type);
    public void AddResource(string factionId, ResourceType type, int amount);
    public bool SpendResource(string factionId, ResourceType type, int amount);

    // Resource queries
    public bool HasResources(string factionId, ResourceCost cost);
    public Dictionary<ResourceType, int> GetAllResources(string factionId);

    // Events
    public event Action<string, ResourceType, int> OnResourceChanged; // factionId, type, newAmount
    public event Action<string, ResourceType> OnResourceDepleted; // factionId, type
}

public enum ResourceType
{
    Credits,
    Minerals,
    Fuel,
    Food,
    Energy
}

public class ResourceCost
{
    public int Credits { get; set; }
    public int Minerals { get; set; }
    public int Fuel { get; set; }
    public int Food { get; set; }
    public int Energy { get; set; }
}
```

---

### CombatSystem

**Namespace:** `Overlord.Core.Systems`

**Purpose:** Resolves space combat, bombardment, and invasions.

**AFS Reference:** AFS-041, AFS-042, AFS-043, AFS-044

```csharp
public class CombatSystem
{
    public static CombatSystem Instance { get; }

    // Combat resolution
    public BattleResult InitiateBattle(string attackerFactionId, string defenderFactionId, string targetPlanetId);
    public BombardmentResult BombardPlanet(string attackerFactionId, string planetId, int craftCount);
    public InvasionResult InvadePlanet(string attackerFactionId, string planetId, int platoonCount);

    // Combat calculations
    public int CalculateAttackStrength(List<Craft> attackerCraft);
    public int CalculateDefenseStrength(List<Craft> defenderCraft, bool orbitalDefenseBonus);

    // Events
    public event Action<BattleResult> OnCombatResolved;
    public event Action<BombardmentResult> OnBombardmentCompleted;
    public event Action<InvasionResult> OnInvasionCompleted;
}

public class BattleResult
{
    public string Winner { get; set; } // "Attacker" or "Defender"
    public int AttackerLosses { get; set; }
    public int DefenderLosses { get; set; }
    public List<Craft> SurvivingAttackerCraft { get; set; }
    public List<Craft> SurvivingDefenderCraft { get; set; }
    public int ExperienceGained { get; set; }
}

public class BombardmentResult
{
    public bool Success { get; set; }
    public int StructuresDestroyed { get; set; }
    public int CiviliansKilled { get; set; }
    public int MoraleDamage { get; set; }
}

public class InvasionResult
{
    public bool Success { get; set; }
    public int AttackerLosses { get; set; }
    public int DefenderLosses { get; set; }
    public bool PlanetCaptured { get; set; }
}
```

---

### BuildingSystem

**Namespace:** `Overlord.Core.Systems`

**Purpose:** Manages building construction and upgrades.

**AFS Reference:** AFS-061

```csharp
public class BuildingSystem
{
    public static BuildingSystem Instance { get; }

    // Construction
    public void StartConstruction(string planetId, BuildingType type);
    public void CancelConstruction(string planetId, string buildingId);
    public void UpdateConstructionProgress();

    // Building queries
    public List<Building> GetBuildings(string planetId);
    public bool CanBuild(string planetId, BuildingType type);
    public ResourceCost GetBuildingCost(BuildingType type);

    // Events
    public event Action<Building> OnConstructionStarted;
    public event Action<Building> OnConstructionCompleted;
    public event Action<Building> OnBuildingDestroyed;
}

public enum BuildingType
{
    DockingBay,
    MiningStation,
    HorticulturalStation,
    OrbitalDefensePlatform,
    SolarSatellite,
    AtmosphereProcessor
}
```

---

### AIDecisionSystem

**Namespace:** `Overlord.Core.AI`

**Purpose:** AI decision-making and turn execution.

**AFS Reference:** AFS-051

```csharp
public class AIDecisionSystem
{
    public static AIDecisionSystem Instance { get; }

    // AI execution
    public void ExecuteAITurn(string aiFactionId);
    public void AssignPersonality(string aiFactionId, AIPersonality personality);

    // AI queries
    public AIPersonality GetPersonality(string aiFactionId);
    public float GetThreatLevel(string aiFactionId);

    // Events
    public event Action<string> OnAITurnStarted; // aiFactionId
    public event Action<string> OnAITurnCompleted; // aiFactionId
    public event Action<string, AIAction> OnAIActionTaken; // aiFactionId, action
}

public enum AIPersonality
{
    Aggressive,   // Commander Kratos (warmonger)
    Defensive,    // Overseer Aegis (turtle)
    Economic,     // Magistrate Midas (expansionist)
    Balanced      // General Nexus (tactical)
}

public class AIAction
{
    public AIActionType Type { get; set; }
    public string TargetId { get; set; } // planetId or craftId
    public Dictionary<string, object> Parameters { get; set; }
}

public enum AIActionType
{
    BuildStructure,
    PurchaseCraft,
    AttackPlanet,
    DefendPlanet,
    ExpandTerritory
}
```

---

## Data Models

Core data structures used throughout Overlord.Core.

### GameState

**Namespace:** `Overlord.Core.Models`

```csharp
public class GameState
{
    public string GameId { get; set; }
    public int TurnNumber { get; set; }
    public DateTime GameStartedAt { get; set; }
    public float Playtime { get; set; } // Total playtime in seconds

    // Galaxy
    public List<Planet> Planets { get; set; }
    public List<Faction> Factions { get; set; }

    // Victory conditions
    public bool GameEnded { get; set; }
    public string WinnerFactionId { get; set; }
    public VictoryType VictoryType { get; set; }
}

public enum VictoryType
{
    Conquest,      // Captured all enemy planets
    Elimination,   // Destroyed all enemy craft and structures
    Resignation    // AI surrendered
}
```

---

### Planet

**Namespace:** `Overlord.Core.Models`

```csharp
public class Planet
{
    public string Id { get; set; }
    public string Name { get; set; }
    public PlanetType Type { get; set; }
    public string OwnerFactionId { get; set; }

    // Position
    public Vector3 Position { get; set; }

    // Resources
    public int MineralProduction { get; set; } // Base production per turn
    public int FuelProduction { get; set; }
    public int FoodProduction { get; set; }
    public int EnergyProduction { get; set; }

    // Population
    public int Population { get; set; }
    public int MaxPopulation { get; set; }
    public int Morale { get; set; } // 0-100

    // Buildings
    public List<Building> Buildings { get; set; }

    // Garrison
    public List<Craft> OrbitingCraft { get; set; }
    public List<Platoon> Garrison { get; set; }
}

public enum PlanetType
{
    Volcanic,
    Desert,
    Tropical,
    Metropolis
}
```

---

### Craft

**Namespace:** `Overlord.Core.Models`

```csharp
public class Craft
{
    public string Id { get; set; }
    public CraftType Type { get; set; }
    public string OwnerFactionId { get; set; }
    public string CurrentPlanetId { get; set; } // Null if in transit

    // Combat stats
    public int Strength { get; set; } // Base 100 for Battle Cruisers
    public int WeaponModifier { get; set; } // +X% from upgrades
    public int Experience { get; set; } // Combat experience points

    // Cargo (for Cargo Cruisers)
    public Dictionary<ResourceType, int> Cargo { get; set; }
    public List<Platoon> TransportedPlatoons { get; set; }
}

public enum CraftType
{
    BattleCruiser,
    CargoCruiser,
    SolarSatellite,
    AtmosphereProcessor
}
```

---

### Building

**Namespace:** `Overlord.Core.Models`

```csharp
public class Building
{
    public string Id { get; set; }
    public BuildingType Type { get; set; }
    public string PlanetId { get; set; }

    // Construction
    public BuildingStatus Status { get; set; }
    public int TurnsRemaining { get; set; } // -1 if operational

    // Effects
    public Dictionary<string, float> ProductionModifiers { get; set; } // e.g., {"Minerals": 1.4f}
}

public enum BuildingStatus
{
    UnderConstruction,
    Operational,
    Damaged,
    Destroyed
}
```

---

### Faction

**Namespace:** `Overlord.Core.Models`

```csharp
public class Faction
{
    public string Id { get; set; }
    public string Name { get; set; }
    public FactionType Type { get; set; }
    public Color Color { get; set; }

    // Resources
    public Dictionary<ResourceType, int> Resources { get; set; }

    // AI (if applicable)
    public AIPersonality? Personality { get; set; } // Null for player
    public int Difficulty { get; set; } // 0 = Easy, 1 = Normal, 2 = Hard

    // Diplomacy
    public bool IsPlayerControlled { get; set; }
    public bool IsDefeated { get; set; }
}

public enum FactionType
{
    Player,
    AIOpponent
}
```

---

### Platoon

**Namespace:** `Overlord.Core.Models`

```csharp
public class Platoon
{
    public string Id { get; set; }
    public string OwnerFactionId { get; set; }
    public string CurrentPlanetId { get; set; } // Null if aboard craft

    // Combat stats
    public int Strength { get; set; } // Base 50
    public int EquipmentModifier { get; set; } // +X% from upgrades
    public int WeaponsModifier { get; set; } // +Y% from upgrades
    public int Experience { get; set; }
}
```

---

## Events Summary

All events published by Overlord.Core systems.

### GameStateManager Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnGameStateChanged` | `GameState` | Game state updated |
| `OnGameLoaded` | `GameState` | Game loaded from save |
| `OnGameEnded` | None | Game ended (victory/defeat) |

### TurnSystem Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnTurnStarted` | `int turnNumber` | New turn begins |
| `OnTurnEnded` | `int turnNumber` | Turn ends |
| `OnPlayerTurnStarted` | None | Player's turn begins |
| `OnAITurnStarted` | None | AI's turn begins |
| `OnAITurnCompleted` | None | AI's turn ends |

### SaveSystem Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnGameSaved` | `int slotIndex, bool success` | Game saved |
| `OnGameLoaded` | `int slotIndex, bool success` | Game loaded |
| `OnSaveDeleted` | `int slotIndex` | Save slot deleted |

### ResourceSystem Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnResourceChanged` | `string factionId, ResourceType type, int newAmount` | Resource updated |
| `OnResourceDepleted` | `string factionId, ResourceType type` | Resource reached zero |

### CombatSystem Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnCombatResolved` | `BattleResult` | Space combat resolved |
| `OnBombardmentCompleted` | `BombardmentResult` | Bombardment completed |
| `OnInvasionCompleted` | `InvasionResult` | Invasion completed |

### BuildingSystem Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnConstructionStarted` | `Building` | Construction begins |
| `OnConstructionCompleted` | `Building` | Construction finishes |
| `OnBuildingDestroyed` | `Building` | Building destroyed |

### AIDecisionSystem Events

| Event | Parameters | Description |
|-------|-----------|-------------|
| `OnAITurnStarted` | `string aiFactionId` | AI turn begins |
| `OnAITurnCompleted` | `string aiFactionId` | AI turn ends |
| `OnAIActionTaken` | `string aiFactionId, AIAction` | AI performs action |

---

## Usage Examples

### Example 1: Unity Implementing IRenderer

```csharp
using UnityEngine;
using Overlord.Core;

public class UnityRenderManager : MonoBehaviour, IRenderer
{
    public void ShowBattleResult(BattleResult result)
    {
        // Show 3D battle scene with VFX
        BattleVFXController.Instance.PlayBattle(result);

        // Display battle report UI
        UIManager.Instance.ShowBattleReport(result);
    }

    public void PlayExplosionEffect(Vector3 position)
    {
        // Instantiate explosion particle system
        Instantiate(explosionPrefab, position, Quaternion.identity);
    }

    public void ShowNotification(string message, NotificationType type)
    {
        NotificationSystem.Instance.ShowToast(message, type);
    }

    // ... other IRenderer methods
}
```

---

### Example 2: Listening to Overlord.Core Events

```csharp
using UnityEngine;
using Overlord.Core.Systems;

public class HUDController : MonoBehaviour
{
    private void OnEnable()
    {
        // Subscribe to Core events
        TurnSystem.Instance.OnTurnEnded += OnTurnEnded;
        ResourceSystem.Instance.OnResourceChanged += OnResourceChanged;
        CombatSystem.Instance.OnCombatResolved += OnCombatResolved;
    }

    private void OnDisable()
    {
        // Unsubscribe to prevent memory leaks
        TurnSystem.Instance.OnTurnEnded -= OnTurnEnded;
        ResourceSystem.Instance.OnResourceChanged -= OnResourceChanged;
        CombatSystem.Instance.OnCombatResolved -= OnCombatResolved;
    }

    private void OnTurnEnded(int turnNumber)
    {
        turnCounterText.text = $"Turn {turnNumber}";
    }

    private void OnResourceChanged(string factionId, ResourceType type, int newAmount)
    {
        if (factionId == "player")
        {
            UpdateResourceDisplay(type, newAmount);
        }
    }

    private void OnCombatResolved(BattleResult result)
    {
        ShowBattleResultPopup(result);
    }
}
```

---

### Example 3: Calling Overlord.Core from Unity

```csharp
using UnityEngine;
using Overlord.Core.Systems;

public class UIEndTurnButton : MonoBehaviour
{
    public void OnEndTurnClicked()
    {
        // Call Overlord.Core to process turn
        TurnSystem.Instance.EndPlayerTurn();
    }
}

public class UIBuildButton : MonoBehaviour
{
    public void OnBuildDockingBay()
    {
        var selectedPlanetId = GalaxyViewController.Instance.SelectedPlanetId;

        // Check if player can afford it
        if (BuildingSystem.Instance.CanBuild(selectedPlanetId, BuildingType.DockingBay))
        {
            BuildingSystem.Instance.StartConstruction(selectedPlanetId, BuildingType.DockingBay);
        }
        else
        {
            UIManager.Instance.ShowError("Insufficient resources to build Docking Bay.");
        }
    }
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 6, 2025 | Initial API reference for dual-library architecture |

---

**Document Owner:** Lead Developer
**Review Status:** Approved
