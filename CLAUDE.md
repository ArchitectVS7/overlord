# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an archive and remake repository for the classic game "Overlord" (also known as "Supremacy"), a 4X strategy game from the late 1980s/early 1990s. The repository serves three purposes:

1. **Preservation:** Original game files (C64, MS-DOS) archived for historical reference
2. **Analysis:** Decompilation and reverse engineering to understand game mechanics
3. **Remake Development:** Modern Unity 6 remake with platform-agnostic architecture

## Repository Structure

- **C64-remake/** ⚠️ ARCHIVE - DO NOT EDIT
  - Commodore 64 version files (EasyFlash cartridge, music)

- **MS-Dos/** ⚠️ ARCHIVE - DO NOT EDIT
  - MS-DOS version files (game.exe, graphics, manual)

- **analysis/** - Decompilation work (Ghidra outputs)
  - `dos/game.exe.c` - Decompiled MS-DOS version
  - `c64/` - Decompiled C64 ROM banks

- **Overlord.Core/** - Platform-agnostic game logic (.NET Standard 2.1)
  - All 18 game systems (combat, AI, resources, etc.)
  - Models, interfaces, save system

- **Overlord.Core.Tests/** - xUnit test suite (.NET 8.0)
  - 328+ tests, target 70%+ coverage

- **Overlord.Unity/** - Unity 6 presentation layer
  - Thin wrappers around Overlord.Core
  - UI, rendering, input, audio

- **design-docs/v1.0/** - Comprehensive design documentation
  - PRD, AFS (Atomic Feature Specifications), architecture diagrams

## Critical Architecture Principle

This project uses **strict separation of concerns**:

```
Overlord.Core (netstandard2.1)
    ↓ Platform-independent business logic
    ↓ ALL game systems, models, AI, serialization
    ↓ NO Unity dependencies
    ↓
Overlord.Unity (Unity 6)
    ↓ Presentation layer ONLY
    ↓ Rendering, input, UI, audio
    ↓ GameManager singleton coordinates Core systems
```

**NEVER put game logic in Unity scripts.** Unity code should only:
- Call Overlord.Core methods
- Subscribe to Core events
- Update UI/rendering based on Core state

## Building Overlord.Core

Overlord.Core **must be built for .NET Standard 2.1** (not net8.0) for Unity compatibility:

```bash
# From repository root
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release --framework netstandard2.1
```

**Why .NET Standard 2.1?**
- Unity 6 runtime is .NET Standard 2.1
- Building for net8.0 causes CS1705 errors (System.Runtime version conflicts)
- System.Text.Json 5.0.2 is the highest compatible version

### Copying DLLs to Unity

Unity requires **ALL 5 DLLs** (Core + System.Text.Json dependencies):

**PowerShell (Windows):**
```powershell
# From repository root
$pluginsDir = "Overlord.Unity/Assets/Plugins/Overlord.Core"

# 1. Core DLL
Copy-Item "Overlord.Core/Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll" $pluginsDir

# 2. System.Text.Json and ALL transitive dependencies
Copy-Item "$env:USERPROFILE/.nuget/packages/system.text.json/5.0.2/lib/netstandard2.0/System.Text.Json.dll" $pluginsDir
Copy-Item "$env:USERPROFILE/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll" $pluginsDir
Copy-Item "$env:USERPROFILE/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll" $pluginsDir
Copy-Item "$env:USERPROFILE/.nuget/packages/system.runtime.compilerservices.unsafe/5.0.0/lib/netstandard2.0/System.Runtime.CompilerServices.Unsafe.dll" $pluginsDir

Write-Host "All DLLs copied successfully!"
```

**Bash (Git Bash/WSL/Linux/Mac):**
```bash
# From repository root
PLUGINS_DIR="Overlord.Unity/Assets/Plugins/Overlord.Core"

cp Overlord.Core/Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.text.json/5.0.2/lib/netstandard2.0/System.Text.Json.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll $PLUGINS_DIR/
cp ~/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.runtime.compilerservices.unsafe/5.0.0/lib/netstandard2.0/System.Runtime.CompilerServices.Unsafe.dll $PLUGINS_DIR/

echo "All DLLs copied successfully!"
```

**Complete reference:** `Overlord.Unity/UNITY-DLL-DEPENDENCIES.md`

## Running Tests

```bash
# From repository root - run all 328 tests
cd Overlord.Core.Tests
dotnet test

# Run specific test class
dotnet test --filter "FullyQualifiedName~AIDecisionSystemTests"

# Run with code coverage
dotnet test --collect:"XPlat Code Coverage"
```

**Important:** Tests use .NET 8.0, but Overlord.Core itself targets netstandard2.1 when built for Unity.

## Opening Unity Project

1. Open Unity Hub
2. Add project: `Overlord.Unity/`
3. Unity 6000.3.0f1 or later required
4. First import takes 2-5 minutes (URP, Input System, TextMeshPro packages)

## Core System Architecture

All 18 game systems implemented in `Overlord.Core/`:

**State Management:**
- `GameState` - Central state with entity lookup dictionaries
- `SaveSystem` - GZip-compressed JSON serialization with SHA256 checksums
- `TurnSystem` - Turn phases (Income → Action → Combat → End)

**Economy:**
- `ResourceSystem` - 5 resources (Credits, Minerals, Fuel, Food, Energy)
- `IncomeSystem` - Per-turn resource generation
- `PopulationSystem` - Growth, morale, happiness
- `TaxationSystem` - Tax rate management

**Entities:**
- `EntitySystem` - Base entity management
- `CraftSystem` - Spacecraft (Scouts, Battle Cruisers, Bombers)
- `PlatoonSystem` - Ground forces with equipment/weapons/training

**Infrastructure:**
- `BuildingSystem` - Planetary structures (Mines, Factories, Labs, etc.)
- `UpgradeSystem` - Tech levels (Equipment, Weapons, Training)
- `DefenseSystem` - Planetary defenses (Shields, Missiles, Laser Batteries)

**Combat:**
- `CombatSystem` - Ground combat (platoon vs platoon)
- `SpaceCombatSystem` - Fleet battles
- `BombardmentSystem` - Orbital bombardment
- `InvasionSystem` - Planetary invasions
- `NavigationSystem` - Spacecraft movement between planets

**AI:**
- `AIDecisionSystem` - 4 personalities (Aggressive, Defensive, Economic, Balanced)
- 3 difficulty levels (Easy, Normal, Hard)
- Priority-based decision tree (Defense → Military → Economy → Attack)

**Galaxy:**
- `GalaxyGenerator` - Procedural 4-6 planet systems

## Unity Integration Pattern

`GameManager.cs` (singleton at `Overlord.Unity/Assets/Scripts/GameManager.cs`) coordinates all Core systems:

```csharp
// Initialize Core systems
GameState = new GameState();
GalaxyGenerator = new GalaxyGenerator();
var galaxy = GalaxyGenerator.GenerateGalaxy(seed: 42);

// Systems initialized with GameState
ResourceSystem = new ResourceSystem(GameState);
TurnSystem = new TurnSystem(GameState);
AIDecisionSystem = new AIDecisionSystem(GameState, IncomeSystem, ResourceSystem,
    BuildingSystem, CraftSystem, PlatoonSystem, personality, difficulty);

// Subscribe to events
TurnSystem.OnPhaseChanged += OnPhaseChanged;
CombatSystem.OnBattleCompleted += OnBattleCompleted;
```

**Event-Driven Communication:**
- Core systems fire C# `Action` events
- Unity scripts subscribe and update UI/rendering
- No direct Core → Unity dependencies

## Key Implementation Details

**GameState Lookups:**
- Entities stored in `List<T>` for JSON serialization
- Dictionary lookups rebuilt after load: `GameState.RebuildLookups()`
- O(1) access via `PlanetLookup`, `CraftLookup`, `PlatoonLookup`

**Constructor Dependencies:**
- Most systems take `GameState` as first parameter
- Some need additional dependencies (e.g., `CombatSystem` needs `PlatoonSystem`)
- AI system has 6 dependencies (GameState + 5 systems)

**Save/Load Flow:**
- `SaveSystem.CreateSaveData(GameState)` → serializable POCO
- `SaveSystem.Serialize(saveData)` → GZip-compressed byte[]
- `SaveSystem.Deserialize(byte[])` → SaveData
- `SaveSystem.ApplyToGameState(saveData, GameState)` → restores state
- Call `GameState.RebuildLookups()` after load

## Common Issues

**CS1705 Error (System.Runtime version conflict):**
- Cause: Overlord.Core built for net8.0 instead of netstandard2.1
- Solution: Rebuild with `--framework netstandard2.1` flag

**"Unable to resolve reference 'System.Text.Json'" or "Reference has errors":**
- Cause: Missing System.Text.Json transitive dependencies
- Solution: Copy all 5 DLLs (see "Copying DLLs to Unity" above)

**"Assembly will not be loaded due to errors":**
- Verify all 5 DLLs present in `Assets/Plugins/Overlord.Core/`:
  1. Overlord.Core.dll (118 KB)
  2. System.Text.Json.dll (344 KB)
  3. System.Text.Encodings.Web.dll (67 KB)
  4. Microsoft.Bcl.AsyncInterfaces.dll (21 KB)
  5. System.Runtime.CompilerServices.Unsafe.dll (17 KB)

**Constructor signature mismatches:**
- Core API may have changed since GameManager.cs was written
- Check actual constructor signatures in Core source files
- Many constructors take fewer parameters than older versions

## Archive Protection Rules

**NEVER modify files in `C64-remake/` or `MS-Dos/` directories.**

These are read-only preservation archives. Original binary integrity must be maintained. All analysis work belongs in `analysis/` directory.

## Design Documentation

- `design-docs/v1.0/prd/PRD-overlord.md` - Product Requirements Document
- `design-docs/v1.0/afs/` - 60+ Atomic Feature Specifications
  - AFS-001 to AFS-010: Core Systems
  - AFS-011 to AFS-020: Galaxy & Planets
  - AFS-021 to AFS-030: Economy
  - AFS-031 to AFS-040: Entities & Craft
  - AFS-041 to AFS-050: Combat Systems
  - AFS-051 to AFS-060: AI
  - AFS-061 to AFS-070: Buildings & Infrastructure
  - AFS-071 to AFS-080: UI Systems
  - AFS-081 to AFS-092: Audio, VFX, Platform Support

## Development Workflow

The repository includes BMAD (Business Modeling and Development) workflow system in `.bmad/` for project management and design workflows. These are optional tools and can be ignored if not needed.
