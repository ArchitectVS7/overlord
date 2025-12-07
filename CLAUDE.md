# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an archive repository for the classic game "Overlord" (also known as "Supremacy"), a strategy game from the late 1980s/early 1990s. The repository contains abandonware preservation files for historical/archival purposes.

## Repository Structure

- **C64-remake/** ⚠️ ARCHIVE - DO NOT EDIT
  - `Supremacy_aka_Overlord_+8D_[ExCeSs].crt`: C64 EasyFlash cartridge image (615KB)
  - `Supremacy.sid`: C64 music file by Jeroen Tel (PlaySID v2.2+ format)

- **MS-Dos/** ⚠️ ARCHIVE - DO NOT EDIT
  - `Overlord_DOS_EN/`: Extracted game files
    - `game.exe`: Main DOS executable (MZ format, 147KB)
    - `*.bin`, `*.gph`: Graphics data files for different video modes (CGA, EGA, MCGA, TGA)
    - `readme`: Original game instructions
  - `Overlord_DOS_EN.zip`: Compressed game archive
  - `Overlord_Manual_DOS_EN.pdf`: Original game manual

- **analysis/** - Decompilation analysis work
  - Working directory for decompilation analysis
  - Keep original archives untouched

- **design-docs/v1.0/** - Game remake design documentation
  - `executive-summary.md` - Project overview
  - `PRD-overlord.md` - Product Requirements Document
  - `afs/` - Atomic Feature Specifications (AFS-001 to AFS-100)
  - Following warzones project documentation standards

## Running the MS-DOS Version

The MS-DOS version uses command-line switches to configure graphics, input, and sound:

```
GAME [GRAPHICS] [INPUT] [SOUND]
```

**Graphics options:**
- `M` - MCGA
- `E` - EGA
- `T` - Tandy 16
- `C` - CGA

**Input options:**
- `M` - Mouse
- `K` - Keyboard

**Sound options:**
- `R` - Roland MT-32 or LAPC-1
- `A` - AdLib or SoundBlaster
- (omit for no sound)

**Examples:**
- `GAME M M R` - MCGA graphics, mouse input, Roland sound
- `GAME E K A` - EGA graphics, keyboard input, AdLib sound
- `GAME C K` - CGA graphics, keyboard input, no sound

**Note:** Commands must be in UPPER CASE when running from floppy disk.

## Important Context

This repository serves three purposes:

1. **Preservation:** Original game files in `C64-remake/` and `MS-Dos/` are archived and must never be modified
2. **Analysis:** Decompilation and reverse engineering work to understand the source code and game mechanics
3. **Remake Development:** Modern Unity-based remake with comprehensive design documentation in `design-docs/`

### Archive Protection Rules

- **NEVER modify files in `C64-remake/` or `MS-Dos/` directories**
- These directories are read-only preservation archives
- All analysis work should be done in separate directories (e.g., `analysis/`)
- Original binary integrity must be maintained

### Decompilation and Analysis

**Status:** ✅ **BOTH VERSIONS SUCCESSFULLY DECOMPILED!**

See **analysis/DECOMPILATION-SUCCESS.md** for complete details.

**Decompiled Code:**
- MS-DOS: `analysis/dos/game.exe.c` (88 KB, 2,272 lines)
- C64: `analysis/c64/bank_00_headless.c` (4.8 KB, entry point + loader)
- C64 ROM banks: `analysis/c64/extracted_rom/` (75 banks, 600 KB total)

**Tools Used:**
- Ghidra 11.4.3 (GUI for DOS, headless for C64)
- Custom Python scripts for automation
- Java 25 runtime

**Methodology:**
- Manual GUI analysis for MS-DOS (straightforward)
- Automated headless analysis for C64 (scripted)
- Original archives never modified ✓

**Documentation:**
- `DECOMPILATION-GUIDE.md` - Complete reference
- `GHIDRA-SETUP-GUIDE.md` - Step-by-step setup
- `analysis/DECOMPILATION-SUCCESS.md` - Results and findings

**Claude Code's capabilities demonstrated:**
- Automated Ghidra headless analysis
- ROM extraction scripting
- Complete workflow automation
- Can read, analyze, and document decompiled code
- Cannot directly decompile (uses Ghidra as a tool)

## Game Remake Project

**Status:** ✅ **CORE SYSTEMS IMPLEMENTED - UNITY INTEGRATION IN PROGRESS**

The repository includes a complete Unity 6 remake with platform-agnostic game logic.

### Architecture Overview

This project uses a **strict platform-agnostic architecture**:

```
Overlord.Core (netstandard2.1)
    ↓ Platform-independent business logic
    ↓ All game systems, models, and AI
    ↓ Serialization, state management
    ↓
Overlord.Unity (Unity 6)
    ↓ Thin presentation layer
    ↓ Rendering, input, UI, audio
    ↓ GameManager singleton coordinates Core systems
```

**Critical Principle:** Unity scripts are **thin wrappers** only. ALL game logic lives in Overlord.Core.

### Building Overlord.Core

Overlord.Core **must be built for .NET Standard 2.1** for Unity compatibility:

```bash
# Build for Unity (Release mode)
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release

# Copy ALL required DLLs to Unity (5 DLLs total)
PLUGINS_DIR="../Overlord.Unity/Assets/Plugins/Overlord.Core"

# 1. Core DLL
cp Overlord.Core/bin/Release/netstandard2.1/Overlord.Core.dll $PLUGINS_DIR/

# 2. System.Text.Json and ALL its transitive dependencies
cp ~/.nuget/packages/system.text.json/5.0.2/lib/netstandard2.0/System.Text.Json.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.text.encodings.web/5.0.1/lib/netstandard2.0/System.Text.Encodings.Web.dll $PLUGINS_DIR/
cp ~/.nuget/packages/microsoft.bcl.asyncinterfaces/5.0.0/lib/netstandard2.0/Microsoft.Bcl.AsyncInterfaces.dll $PLUGINS_DIR/
cp ~/.nuget/packages/system.runtime.compilerservices.unsafe/5.0.0/lib/netstandard2.0/System.Runtime.CompilerServices.Unsafe.dll $PLUGINS_DIR/
```

**Why .NET Standard 2.1?**
- Unity 6 uses .NET Standard 2.1 runtime
- Building for net8.0 causes CS1705 errors (System.Runtime version conflicts)
- System.Text.Json 5.0.2 is the highest compatible version

**Why 5 DLLs?**
- Unity requires ALL transitive dependencies to be physically present
- System.Text.Json depends on System.Text.Encodings.Web, Microsoft.Bcl.AsyncInterfaces, and System.Runtime.CompilerServices.Unsafe
- Missing any dependency causes "Reference has errors" in Unity

**Complete reference:** See `Overlord.Unity/UNITY-DLL-DEPENDENCIES.md` for full details

### Running Tests

```bash
# Run all Core tests (328 tests)
cd Overlord.Core.Tests
dotnet test

# Run specific test
dotnet test --filter "FullyQualifiedName~AIDecisionSystemTests"

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

**Test Coverage Target:** 70%+ for all Core systems

### Opening Unity Project

1. Open Unity Hub
2. Add project: `Overlord.Unity/`
3. Unity 6000.3.0f1 or later required
4. First import takes 2-5 minutes (URP packages)

**Unity Dependencies:**
- Universal Render Pipeline (URP) 17.0.3
- Input System 1.11.2
- TextMeshPro 3.2.0-pre.11

### Core System Architecture

All 18 game systems are implemented in `Overlord.Core/`:

**State Management:**
- `GameState` - Central game state with entity lookups
- `SaveSystem` - JSON serialization with GZip compression
- `TurnSystem` - Turn phases (Income → Action → Combat → End)

**Economy:**
- `ResourceSystem` - 5 resource types (Credits, Minerals, Fuel, Food, Energy)
- `IncomeSystem` - Per-turn resource generation
- `PopulationSystem` - Population growth and morale
- `TaxationSystem` - Tax rate management

**Entities:**
- `EntitySystem` - Base entity management
- `CraftSystem` - Spacecraft (Scouts, Battle Cruisers, Bombers)
- `PlatoonSystem` - Ground forces with equipment/weapons/training

**Infrastructure:**
- `BuildingSystem` - Planetary structures (Mines, Factories, Labs, etc.)
- `UpgradeSystem` - Technology levels (Equipment, Weapons, Training)
- `DefenseSystem` - Planetary defenses (Shields, Missiles, Laser Batteries)

**Combat:**
- `CombatSystem` - Ground combat (platoon vs platoon)
- `SpaceCombatSystem` - Fleet battles
- `BombardmentSystem` - Orbital bombardment
- `InvasionSystem` - Planetary invasions

**AI:**
- `AIDecisionSystem` - 4 personalities (Aggressive, Defensive, Economic, Balanced)
- 3 difficulty levels (Easy, Normal, Hard)
- Priority-based decision tree (Defense → Military → Economy → Attack)

**Galaxy:**
- `GalaxyGenerator` - Procedural 4-6 planet systems
- `SettingsManager` - Game settings persistence

### Unity Integration Pattern

`GameManager.cs` (singleton) coordinates all Core systems:

```csharp
// Initialize Core systems
GameState = new GameState();
GalaxyGenerator = new GalaxyGenerator();
var galaxy = GalaxyGenerator.GenerateGalaxy(seed: 42);

// All 18 systems initialized with GameState
ResourceSystem = new ResourceSystem(GameState);
TurnSystem = new TurnSystem(GameState);
AIDecisionSystem = new AIDecisionSystem(
    GameState, IncomeSystem, ResourceSystem,
    BuildingSystem, CraftSystem, PlatoonSystem,
    personality, difficulty);

// Subscribe to events
TurnSystem.OnPhaseChanged += OnPhaseChanged;
CombatSystem.OnBattleCompleted += OnBattleCompleted;
```

**Event-Driven Communication:**
- Core systems fire C# `Action` events
- Unity scripts subscribe and update UI/rendering
- No direct Core → Unity dependencies

### Key Implementation Details

**GameState Lookups:**
- All entities stored in `List<T>` for serialization
- Dictionary lookups rebuilt after load: `GameState.RebuildLookups()`
- O(1) entity access via `PlanetLookup`, `CraftLookup`, `PlatoonLookup`

**Constructor Dependencies:**
- Most systems take `GameState` as first parameter
- Some take additional system dependencies (e.g., `CombatSystem` needs `PlatoonSystem`)
- AI system needs 6 dependencies (GameState + 5 systems)

**Save/Load:**
- Saves are GZip-compressed JSON with SHA256 checksum
- `SaveSystem.CreateSaveData()` → `SaveSystem.Serialize()` → byte[]
- `SaveSystem.Deserialize(byte[])` → `SaveSystem.ApplyToGameState()`

### Design Documentation

- `design-docs/v1.0/executive-summary.md` - Project overview
- `design-docs/v1.0/PRD-overlord.md` - Full requirements (750+ lines)
- `design-docs/v1.0/afs/` - 60+ Atomic Feature Specifications
  - AFS-001 to AFS-010: Core Systems
  - AFS-011 to AFS-020: Galaxy Map
  - AFS-021 to AFS-030: Economy
  - AFS-031 to AFS-040: Entities
  - AFS-041 to AFS-050: Combat
  - AFS-051 to AFS-060: AI

### Common Issues

**CS1705 Error (System.Runtime version conflict):**
- Overlord.Core built for wrong framework
- Solution: Rebuild for netstandard2.1 (see "Building Overlord.Core")

**"Unable to resolve reference 'System.Text.Json'" or "Reference has errors":**
- Missing transitive dependencies for System.Text.Json
- Solution: Copy ALL 5 DLLs (see "Building Overlord.Core" section above)
- Quick fix script in `Overlord.Unity/UNITY-DLL-DEPENDENCIES.md`

**"Unable to resolve reference 'System.Text.Encodings.Web'" or 'Microsoft.Bcl.AsyncInterfaces':**
- Missing System.Text.Json dependencies
- Solution: Run the 5-DLL copy script from "Building Overlord.Core"
- These are transitive dependencies that Unity requires explicitly

**"Assembly will not be loaded due to errors":**
- One or more DLLs missing from Plugins folder
- Solution: Verify all 5 DLLs present in `Assets/Plugins/Overlord.Core/`:
  1. Overlord.Core.dll (118 KB)
  2. System.Text.Json.dll (344 KB)
  3. System.Text.Encodings.Web.dll (67 KB)
  4. Microsoft.Bcl.AsyncInterfaces.dll (21 KB)
  5. System.Runtime.CompilerServices.Unsafe.dll (17 KB)

**Constructor signature mismatches:**
- Core API changed after GameManager.cs was written
- Solution: Check actual constructor in Core source files (many take fewer parameters than expected)
