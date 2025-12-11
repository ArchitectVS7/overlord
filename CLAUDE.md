# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an archive and remake repository for the classic game "Overlord" (also known as "Supremacy"), a 4X strategy game from the late 1980s/early 1990s. The repository serves three purposes:

1. **Preservation:** Original game files (C64, MS-DOS) archived for historical reference
2. **Analysis:** Decompilation and reverse engineering to understand game mechanics
3. **Remake Development:** Modern **Phaser 3 + TypeScript** web-based remake with platform-agnostic architecture

## Repository Structure

- **C64-remake/** ⚠️ ARCHIVE - DO NOT EDIT
  - Commodore 64 version files (EasyFlash cartridge, music)

- **MS-Dos/** ⚠️ ARCHIVE - DO NOT EDIT
  - MS-DOS version files (game.exe, graphics, manual)

- **analysis/** - Decompilation work (Ghidra outputs)
  - `dos/game.exe.c` - Decompiled MS-DOS version
  - `c64/` - Decompiled C64 ROM banks

- **Overlord.Phaser/** - **PRIMARY ACTIVE CODEBASE** (Phaser 3 + TypeScript)
  - `src/core/` - Platform-agnostic game logic (all 18 systems)
  - `src/scenes/` - Phaser-specific rendering (BootScene, GalaxyMapScene, FlashConflictsScene)
  - `src/scenes/ui/` - Reusable UI components (panels, HUDs, dialogs)
  - `src/config/` - Phaser configuration
  - `tests/` - Jest test suite (835 tests, 93%+ coverage)
  - `design-docs/artifacts/sprint-artifacts/` - Story files and sprint status tracking

- **Overlord.Core/** - Legacy C# .NET Standard 2.1 library (no longer primary)
  - Contains 18 game systems ported to TypeScript in Overlord.Phaser
  - Kept for reference, but Phaser is now the canonical implementation

- **Overlord.Core.Tests/** - Legacy xUnit test suite (.NET 8.0)
  - 328+ tests for C# version

- **Overlord.Unity/** - Legacy Unity 6 presentation layer (deprecated)
  - Migration to Phaser completed (commit 56bdfcb)
  - Kept for reference only

- **design-docs/** - Design documentation
  - `artifacts/prd.md` - Current Product Requirements Document (Phaser-focused)
  - `PROTOTYPE-BATTLE-PLAN.md` - Development roadmap

## Critical Architecture Principle

This project uses **strict separation of concerns** with a web-first approach:

```
Overlord.Phaser/src/core/ (TypeScript)
    ↓ Platform-independent business logic
    ↓ ALL game systems, models, AI, serialization
    ↓ NO Phaser dependencies
    ↓
Overlord.Phaser/src/scenes/ (Phaser 3)
    ↓ Presentation layer ONLY
    ↓ Rendering, input, UI, audio
    ↓ Subscribes to Core events for state updates
```

**NEVER put game logic in Phaser scenes.** Scene code should only:
- Call Core system methods
- Subscribe to Core events
- Update rendering based on Core state

## Development Workflow

### Quick Start

```bash
# From repository root
cd Overlord.Phaser

# Install dependencies
npm install

# Start development server (http://localhost:8080, opens browser)
npm start

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

### Project Commands

**Development:**
- `npm start` - Start Webpack dev server with hot reload (port 8080)
- `npm run build` - Production build to `dist/` directory

**Testing:**
- `npm test` - Run all Jest tests once
- `npm test -- ComponentName` - Run specific test file (e.g., `npm test -- InvasionPanel`)
- `npm run test:watch` - Run tests in watch mode (recommended during development)
- `npm run test:coverage` - Generate coverage report (target: >70%)

**Code Quality:**
- Use TypeScript path aliases: `@core/*`, `@scenes/*`, `@config/*`
- Strict TypeScript enabled (no `any` types, all functions must have return types)
- Jest tests required for all Core systems (scenes can have minimal coverage)

### Running C# Legacy Code (Reference Only)

The C# implementation is no longer the primary codebase but remains for reference:

```bash
# From repository root - build C# Core library
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release --framework netstandard2.1

# Run C# tests
cd Overlord.Core.Tests
dotnet test

# Run specific test class
dotnet test --filter "FullyQualifiedName~AIDecisionSystemTests"
```

## Core System Architecture

All 18 game systems implemented in `Overlord.Phaser/src/core/`:

**State Management:**
- `GameState.ts` - Central state with entity lookup dictionaries
- `SaveSystem.ts` - Compressed JSON serialization with checksums
- `TurnSystem.ts` - Turn phases (Income → Action → Combat → End)

**Economy:**
- `ResourceSystem.ts` - 5 resources (Credits, Minerals, Fuel, Food, Energy)
- `IncomeSystem.ts` - Per-turn resource generation
- `PopulationSystem.ts` - Growth, morale, happiness
- `TaxationSystem.ts` - Tax rate management

**Entities:**
- `EntitySystem.ts` - Base entity management
- `CraftSystem.ts` - Spacecraft (Scouts, Battle Cruisers, Bombers)
- `PlatoonSystem.ts` - Ground forces with equipment/weapons/training

**Infrastructure:**
- `BuildingSystem.ts` - Planetary structures (Mines, Factories, Labs, etc.)
- `UpgradeSystem.ts` - Tech levels (Equipment, Weapons, Training)
- `DefenseSystem.ts` - Planetary defenses (Shields, Missiles, Laser Batteries)

**Combat:**
- `CombatSystem.ts` - Ground combat (platoon vs platoon)
- `SpaceCombatSystem.ts` - Fleet battles
- `BombardmentSystem.ts` - Orbital bombardment
- `InvasionSystem.ts` - Planetary invasions
- `NavigationSystem.ts` - Spacecraft movement between planets

**AI:**
- `AIDecisionSystem.ts` - 4 personalities (Aggressive, Defensive, Economic, Balanced)
- 3 difficulty levels (Easy, Normal, Hard)
- Priority-based decision tree (Defense → Military → Economy → Attack)

**Galaxy:**
- `GalaxyGenerator.ts` - Deterministic seeded RNG, procedural 4-6 planet systems

## Phaser Integration Pattern

Phaser scenes subscribe to Core events and update rendering:

```typescript
// In BootScene.ts or GalaxyMapScene.ts
import { GameState } from '@core/GameState';
import { GalaxyGenerator } from '@core/GalaxyGenerator';
import { TurnSystem } from '@core/TurnSystem';

export class GalaxyMapScene extends Phaser.Scene {
  private gameState!: GameState;
  private turnSystem!: TurnSystem;

  create() {
    // Initialize Core systems
    this.gameState = new GameState();
    const generator = new GalaxyGenerator();
    const galaxy = generator.generateGalaxy(42); // Seeded RNG

    this.turnSystem = new TurnSystem(this.gameState);

    // Subscribe to events
    this.turnSystem.onPhaseChanged = (phase) => {
      this.updatePhaseUI(phase);
    };

    // Render planets from Core state
    this.renderGalaxy(galaxy);
  }
}
```

**Event-Driven Communication:**
- Core systems fire callbacks/events
- Phaser scenes subscribe and update UI/rendering
- No direct Core → Phaser dependencies

## Key Implementation Details

**GameState Lookups:**
- Entities stored in `Map<string, T>` for O(1) access
- All entities have unique IDs (UUIDs or generated IDs)
- Lookups: `planetLookup`, `craftLookup`, `platoonLookup`

**Seeded Random Number Generation:**
- `GalaxyGenerator` uses deterministic PRNG (seed 42 always produces same galaxy)
- Critical for testing and reproducibility
- Implemented as simple linear congruential generator (LCG)

**Save/Load Flow:**
- `SaveSystem.createSaveData(gameState)` → serializable object
- `SaveSystem.serialize(saveData)` → compressed JSON string
- `SaveSystem.deserialize(json)` → SaveData object
- `SaveSystem.applyToGameState(saveData, gameState)` → restores state

**TypeScript Path Aliases:**
- `@core/*` → `src/core/*`
- `@scenes/*` → `src/scenes/*`
- `@config/*` → `src/config/*`

Configured in both `tsconfig.json` and `webpack.config.js`.

## Testing Strategy

**Jest Configuration:**
- Test files: `tests/unit/*.test.ts`, `tests/integration/*.test.ts`
- Coverage threshold: 70% minimum (currently 93%+)
- Watch mode recommended during development
- **Mock Phaser components** when testing UI panels - use existing test patterns in `InvasionPanel.test.ts` as reference

**Test Structure:**
```typescript
// tests/unit/Position3D.test.ts
import { Position3D } from '@core/models/Position3D';

describe('Position3D', () => {
  test('should calculate distance correctly', () => {
    const p1 = new Position3D(0, 0, 0);
    const p2 = new Position3D(3, 4, 0);
    expect(p1.distanceTo(p2)).toBe(5);
  });
});
```

**Coverage Targets:**
- Core systems (`src/core/*.ts`): 90%+ coverage (business logic critical)
- Models (`src/core/models/*.ts`): 80%+ coverage
- Scenes (`src/scenes/*.ts`): 50%+ coverage (rendering, less critical)

Run `npm run test:coverage` to generate HTML coverage report in `coverage/` directory.

## Common Development Tasks

**Adding a New Core System:**
1. Create TypeScript file in `src/core/` (e.g., `DiplomacySystem.ts`)
2. Define models in `src/core/models/` if needed
3. Write tests in `tests/unit/DiplomacySystem.test.ts`
4. Ensure no Phaser imports in Core code
5. Integrate with GameState and existing systems
6. Update this CLAUDE.md if architecture changes

**Adding a New Phaser Scene:**
1. Create scene in `src/scenes/` (e.g., `DiplomacyScene.ts`)
2. Extend `Phaser.Scene` base class
3. Subscribe to Core system events in `create()`
4. Update rendering in response to events
5. Register scene in `src/config/PhaserConfig.ts`

**Creating UI Components:**
- All reusable UI components go in `src/scenes/ui/`
- Extend `Phaser.GameObjects.Container` for composite components
- Use consistent patterns: see `InvasionPanel.ts`, `BattleResultsPanel.ts`, `NotificationToast.ts`
- Set `setDepth()` and `setScrollFactor(0)` for HUD elements
- Use `scene.add.existing(this)` in constructor
- Provide public getters/setters for component state
- Include comprehensive JSDoc comments with story references

**Debugging:**
- Source maps enabled in development mode (`eval-source-map`)
- Browser DevTools work seamlessly with TypeScript
- Hot reload active on file changes (Webpack dev server)
- Check browser console for Phaser warnings/errors

## Browser & Platform Support

**Target Browsers:**
- Desktop: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS Safari 14+, Chrome Mobile 90+

**Rendering:**
- Primary: WebGL 2.0 (60 FPS target desktop, 30 FPS mobile)
- Fallback: Canvas 2D (30 FPS acceptable)
- Phaser.AUTO auto-selects best renderer

**Screen Sizes:**
- Desktop: 1920×1080 optimized, 1280×720 minimum
- Mobile: 375×667 minimum (iPhone 8), landscape recommended

## Archive Protection Rules

**NEVER modify files in `C64-remake/` or `MS-Dos/` directories.**

These are read-only preservation archives. Original binary integrity must be maintained. All analysis work belongs in `analysis/` directory.

## Design Documentation

Current design docs reflect the **Phaser + TypeScript implementation**:

- `design-docs/artifacts/prd.md` - Product Requirements Document (Phaser-focused)
- `design-docs/PROTOTYPE-BATTLE-PLAN.md` - Development roadmap and status
- `design-docs/documentation-standards.md` - Documentation conventions

**Legacy Unity/C# Design Docs (Archived):**
- `design-docs/v1.0/` directory contains original Unity-focused documentation
- These are reference only; Phaser PRD is canonical

## Git Pre-Commit Hooks

**Automated Quality Checks:**
The repository uses Git pre-commit hooks that automatically run on every commit:

1. **Build C# Core** - Ensures legacy code compiles (reference check)
2. **Run C# Tests** - Validates 328 C# tests pass
3. **Code Formatting** - Checks code style compliance

These hooks run automatically via `.git/hooks/pre-commit`. You'll see output like:
```
========================================
Running pre-commit quality checks...
========================================
[1/3] Building Overlord.Core...
✅ Build succeeded
[2/3] Running tests...
✅ Tests passed
[3/3] Checking code formatting...
✅ All critical pre-commit checks passed!
```

**Important:** Commits will be blocked if any check fails. Fix issues before committing.

## Development Workflow Tools

The repository includes BMAD (Business Modeling and Development) workflow system in `.claude/` for project management and design workflows:
- **Sprint orchestration** - Multi-agent autonomous development workflow
- **Story tracking** - `sprint-status.yaml` tracks all epics and stories
- **Agent directives** - See `.claude/CLAUDE.md` for autonomous operation rules

These tools enable AI-assisted sprint execution. For manual development, you can ignore them.

## Migration Notes (Unity → Phaser)

**Why Phaser?**
- AI-assisted development compatibility (Claude Code works seamlessly with TypeScript)
- Zero-friction iteration (edit → save → browser refresh in 2 seconds)
- Platform-agnostic Core (game logic has zero rendering dependencies)
- Comprehensive testing (304 tests run in <5 seconds, no Unity editor required)

**What Changed:**
- ✅ All 18 Core systems ported from C# to TypeScript (functional parity)
- ✅ 835 tests with 93%+ coverage (exceeding C# test coverage)
- ✅ Web-first deployment (browser-based, no native builds required)
- ✅ Deterministic seeded RNG for galaxy generation (matches C# behavior)
- ✅ Comprehensive UI component library in `src/scenes/ui/`

**What Stayed the Same:**
- Core game architecture (platform-agnostic logic layer)
- All 18 game systems and their interactions
- Event-driven communication pattern
- Save/load system design

**Legacy Code Status:**
- `Overlord.Core/` (C#): Reference only, not actively maintained
- `Overlord.Unity/`: Deprecated, kept for reference
- `Overlord.Phaser/`: **Primary active codebase**

## Current Development Status

**Completed (as of Dec 2025):**
- ✅ All 18 core systems ported to TypeScript
- ✅ 835 tests passing with 93%+ code coverage
- ✅ Galaxy generation with deterministic seeded RNG
- ✅ Full galaxy map rendering with camera controls
- ✅ **Epic 2:** Campaign setup & turn system
- ✅ **Epic 3:** Galaxy exploration & planet selection
- ✅ **Epic 4:** Planetary economy & infrastructure
- ✅ **Epic 5:** Military forces & spacecraft movement
- ✅ **Epic 6:** Combat system & planetary invasion UI
- ✅ **Epic 7:** AI opponent with notifications & info display
- ✅ **Epic 11:** Input system (mouse, keyboard, touch, accessibility)
- ✅ Development server running at http://localhost:8080

**Sprint Workflow:**
- Active sprint tracking in `design-docs/artifacts/sprint-artifacts/sprint-status.yaml`
- Story files define implementation requirements
- Three-agent workflow: tech-writer → game-dev → code-reviewer
- See `.claude/CLAUDE.md` for autonomous sprint execution directives

**Remaining Work:**
- **Epic 1:** Tutorial system (requires scenario JSON content from human)
- **Epic 8:** Tactical scenarios (requires scenario content)
- **Epic 9:** Scenario pack system (requires pack JSON files)
- **Epic 10:** User accounts & Supabase integration (requires cloud setup)
- **Epic 12:** Audio system (requires sound/music files)
