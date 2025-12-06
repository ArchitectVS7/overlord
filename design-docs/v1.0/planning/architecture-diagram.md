# Architecture Diagram

**Version:** 1.0
**Last Updated:** December 6, 2025
**Status:** Complete
**Architecture Pattern:** Dual-Library (Overlord.Core + Unity)

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         UNITY PROJECT                            │
│                    (Presentation Layer)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Input      │  │ Rendering  │  │ UI/UX      │                │
│  │ System     │  │ (URP)      │  │ Systems    │                │
│  │ (AFS-005)  │  │ (AFS-013,  │  │ (AFS-071-  │                │
│  │            │  │  AFS-082)  │  │  AFS-075)  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Audio      │  │ VFX        │  │ Platform   │                │
│  │ System     │  │ System     │  │ Support    │                │
│  │ (AFS-081)  │  │ (AFS-082)  │  │ (AFS-091)  │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Unity Manager Layer (Thin Wrappers)              │  │
│  │  • GameStateManager  • TurnManager  • UIManager          │  │
│  │  • AudioManager      • VFXManager   • InputManager       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Overlord.Core Interface Layer                 │  │
│  │  IGameSettings • IRenderer • IInputProvider • IAudioMix  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬───────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     OVERLORD.CORE LIBRARY                        │
│                    (.NET 8.0 Class Library)                      │
│                  (Platform-Agnostic Game Logic)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Core Systems Layer                        │    │
│  │  • GameState (AFS-001)  • TurnSystem (AFS-002)        │    │
│  │  • SaveSystem (AFS-003) • SettingsManager (AFS-004)   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            Economy & Resources Layer                   │    │
│  │  • ResourceSystem (AFS-021)                            │    │
│  │  • IncomeSystem (AFS-022)                              │    │
│  │  • PopulationSystem (AFS-023)                          │    │
│  │  • TaxationSystem (AFS-024)                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Entity Management Layer                   │    │
│  │  • EntitySystem (AFS-031)                              │    │
│  │  • CraftSystem (AFS-032)                               │    │
│  │  • PlatoonSystem (AFS-033)                             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │               Combat Systems Layer                     │    │
│  │  • CombatSystem (AFS-041)                              │    │
│  │  • SpaceCombat (AFS-042)                               │    │
│  │  • BombardmentSystem (AFS-043)                         │    │
│  │  • InvasionSystem (AFS-044)                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              AI & Difficulty Layer                     │    │
│  │  • AIDecisionSystem (AFS-051)                          │    │
│  │  • AIDifficultySystem (AFS-052)                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            Buildings & Upgrades Layer                  │    │
│  │  • BuildingSystem (AFS-061)                            │    │
│  │  • UpgradeSystem (AFS-062)                             │    │
│  │  • DefenseStructures (AFS-063)                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                 Data Models                            │    │
│  │  • GameState  • Planet  • Craft  • Platoon  • Faction  │    │
│  │  • Building  • Resource • Combat Result               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ System.Text.Json │
                    │ Serialization    │
                    │ (AFS-003)        │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Save Files      │
                    │  (.sav + cloud)  │
                    └──────────────────┘
```

---

## Layer Responsibilities

### Unity Presentation Layer

**Responsibilities:**
- Rendering 3D graphics (URP shaders, post-processing)
- Handling user input (mouse, keyboard, touch, gamepad)
- Playing audio (music, SFX)
- Displaying UI (HUD, menus, dialogs, tutorial)
- Managing visual effects (particles, animations)
- Platform-specific integration (PC, mobile, cloud saves)

**Key Components:**
- Unity GameObjects, MonoBehaviours
- URP renderer, cameras, lights
- UI Toolkit / uGUI Canvas elements
- Unity Audio Source/Mixer
- Particle Systems

**Does NOT Contain:**
- Game logic or rules
- Combat calculations
- AI decision-making
- Resource management logic

### Overlord.Core Library

**Responsibilities:**
- All game logic and rules
- Turn-based system execution
- Combat calculations
- AI decision-making
- Resource management
- Save/load game state
- Victory condition checking

**Key Components:**
- Pure C# classes (no Unity dependencies)
- Interfaces for Unity-specific features (IRenderer, IInputProvider)
- Data models (GameState, Planet, Craft, etc.)
- System.Text.Json serialization

**Does NOT Contain:**
- Unity-specific code (MonoBehaviour, GameObject, etc.)
- Rendering logic
- Audio playback
- Input handling (only receives input via interfaces)

---

## Communication Patterns

### Unity → Overlord.Core

```
Player clicks "End Turn" button (Unity UI)
    ↓
UIManager.OnEndTurnClicked() (Unity MonoBehaviour)
    ↓
Overlord.Core.TurnSystem.EndTurn(player, gameState)
    ↓
Combat calculations, AI turn execution, etc. (Overlord.Core)
    ↓
Overlord.Core.TurnSystem fires OnTurnEnded event
    ↓
Unity listens to event, updates UI
```

### Overlord.Core → Unity

```
Overlord.Core needs to display battle result
    ↓
CombatSystem.ResolveBattle() calculates winner
    ↓
CombatSystem calls IRenderer.ShowBattleResult(result)
    ↓
Unity implementation of IRenderer displays 3D battle scene
```

---

## Dependency Flow

```
High-Level (Unity)
    ↓
Mid-Level (Unity Managers implementing Overlord.Core interfaces)
    ↓
Low-Level (Overlord.Core game logic)
```

**Rule:** Overlord.Core never depends on Unity. Unity depends on Overlord.Core.

---

## Testing Architecture

```
┌────────────────────────────────────┐
│   Unity Test Framework             │
│   (Play Mode & Edit Mode Tests)    │
│   • Test Unity-specific features   │
│   • Test rendering, input, UI      │
│   • Integration tests              │
└────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│         xUnit Tests                │
│   (Fast unit tests, no Unity)      │
│   • Test Overlord.Core logic       │
│   • Test combat calculations       │
│   • Test AI decision-making        │
│   • Test save/load serialization   │
│   • 70%+ code coverage target      │
└────────────────────────────────────┘
```

---

## Build Pipeline

```
┌─────────────────┐
│  Source Code    │
│  (.cs files)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Overlord.Core   │──────│ xUnit Tests      │
│ (.NET 8.0 DLL)  │      │ (CI/CD: GitHub   │
│                 │      │  Actions)        │
└────────┬────────┘      └──────────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Unity Project   │──────│ Unity Tests      │
│ (References     │      │ (Play Mode)      │
│  Overlord.Core) │      └──────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Platform Builds│
│  • Windows      │
│  • Mac/Linux    │
│  • iOS/Android  │
└─────────────────┘
```

---

## Scalability & Extensibility

### Adding New Features

**Example: Add New Craft Type**

1. **Overlord.Core:**
   - Add craft definition to CraftSystem.cs
   - Add combat logic if needed
   - Add tests to CraftSystemTests.cs

2. **Unity:**
   - Add 3D model and materials (URP shaders)
   - Add UI icon and tooltip
   - Register with CraftFactory

**Example: Add New Planet Type**

1. **Overlord.Core:**
   - Add planet definition to PlanetSystem.cs
   - Add production modifiers
   - Add tests

2. **Unity:**
   - Add planet texture and shader (URP)
   - Add visual atmosphere effect
   - Register with Galaxy Generator

---

## Performance Considerations

### Overlord.Core

- Fast game logic (all calculations in C#, no Unity overhead)
- Unit tests run quickly (10-100x faster than Unity Play Mode tests)
- Can profile and optimize independently of Unity

### Unity Layer

- URP optimized for mobile (Forward rendering, LOD, batching)
- Particle pooling for VFX (reuse instead of instantiate/destroy)
- Async loading for large assets

---

**Document Owner:** Lead Developer
**Review Status:** Approved
