# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Overlord is a browser-based 4X strategy game remake of the classic 1990 game "Overlord" (aka "Supremacy"). Built with Phaser 3 + TypeScript, deployed on Vercel with Supabase backend.

## Commands

All commands run from `Overlord.Phaser/` directory:

```bash
# Development
npm start              # Start dev server at http://localhost:8080
npm run build          # Production build

# Testing
npm test               # Run Jest unit/integration tests
npm run test:watch     # Watch mode for TDD
npm run test:coverage  # Generate coverage report

# E2E Testing (Playwright)
npm run test:e2e           # Run all E2E tests
npm run test:e2e:headed    # Run with visible browser
npm run test:e2e:debug     # Debug mode
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:report    # View test report
```

To run a single Jest test file:
```bash
npx jest tests/unit/CombatSystem.test.ts
```

To run a single Playwright test:
```bash
npx playwright test tests/e2e/admin-ui-editor.spec.ts
```

## Architecture

```
Overlord.Phaser/
├── src/
│   ├── core/           # Platform-agnostic game logic (NO Phaser imports)
│   │   ├── models/     # Data models (Planet, Craft, Platoon, etc.)
│   │   └── *System.ts  # 18 game systems (Combat, AI, Resource, etc.)
│   ├── scenes/         # Phaser presentation layer (rendering only)
│   │   ├── ui/         # UI panels and HUD components
│   │   └── renderers/  # Visual rendering utilities
│   ├── services/       # External integrations (Supabase, Auth)
│   └── config/         # Phaser and visual configuration
├── tests/
│   ├── unit/           # Unit tests for core systems
│   ├── integration/    # Integration tests
│   └── e2e/            # Playwright E2E tests
└── public/assets/      # Static assets (sprites, audio, scenario JSON)
```

### Critical Rule: Core/Scene Separation
- `src/core/` must have **zero Phaser dependencies** - pure game logic only
- `src/scenes/` subscribes to Core events for rendering updates
- Communication is uni-directional: Core → Phaser via callbacks

### Path Aliases
```typescript
import { GameState } from '@core/GameState';
import { GalaxyMapScene } from '@scenes/GalaxyMapScene';
import { SaveService } from '@services/SaveService';
import { PhaserConfig } from '@config/PhaserConfig';
```

## Key Systems

**State:** GameState (central), SaveSystem (compression + SHA256), TurnSystem (phases)
**Economy:** ResourceSystem, IncomeSystem, PopulationSystem, TaxationSystem
**Military:** CraftSystem, PlatoonSystem, CombatSystem, SpaceCombatSystem, InvasionSystem
**Infrastructure:** BuildingSystem, DefenseSystem, UpgradeSystem
**AI:** AIDecisionSystem (4 personalities × 3 difficulties)
**Flash Conflicts:** ScenarioManager, TutorialManager, VictoryConditionSystem

## Naming Conventions

- **TypeScript:** PascalCase for classes/interfaces, camelCase for variables/functions
- **Phaser Scenes:** PascalCase + `Scene` suffix (e.g., `GalaxyMapScene.ts`)
- **Scene Keys:** kebab-case (e.g., `'galaxy-map'`)
- **JSON Data:** snake_case for keys, kebab-case for filenames
- **Database Tables:** snake_case

## Testing

- Jest for unit/integration tests (70% coverage threshold)
- Playwright for E2E tests with global setup for auth
- Tests in `tests/` directory with `.test.ts` suffix
- E2E tests use `.spec.ts` suffix

## Supabase Backend

- Database migrations in `supabase/migrations/`
- Tables: `user_profiles`, `saves`, `scenario_completions`, `ui_panel_positions`
- Row Level Security enforced on all tables
- Admin role system for UI editor access

### Supabase CLI Commands

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations to Supabase
supabase db push
```

### Environment Variables

Create `.env` file in `Overlord.Phaser/`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

For E2E tests, create `.env.test` with test user credentials.

## Legacy .NET Projects

The repository contains legacy C# projects (no longer actively developed):
- `Overlord.Core/` - .NET Standard 2.1 library
- `Overlord.Console/` - .NET 8 console app
- `Overlord.Core.Tests/` - .NET test project

## Deployment

- **Platform:** Vercel (automatic deployments from main branch)
- **Build command:** `npm run build` (runs from `Overlord.Phaser/`)
- **Output directory:** `Overlord.Phaser/dist/`
- **Environment variables:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel dashboard

---

## Lessons Learned

> **Instructions for Claude**: Continuously record lessons learned during development. When you encounter a non-obvious bug, discover a pattern, or solve a tricky problem, add it here. Keep entries atomic (one concept per entry) and concise for eventual export to other projects. Format: Problem → Root Cause → Solution → Files affected.

### Phaser 3

#### P001: scrollFactor(0) breaks input hit detection
- **Problem**: UI containers/objects with `scrollFactor(0)` don't receive correct pointer events when camera is scrolled
- **Root Cause**: Phaser converts screen coordinates to world coordinates for hit testing, but `scrollFactor(0)` objects render at fixed screen positions. When camera scrolls, the hit area is in the wrong world position.
- **Solution**: For interactive elements in `scrollFactor(0)` containers, either:
  1. Handle input at scene level using screen coordinates directly, OR
  2. Create interactive zones in WORLD coordinates at camera position (e.g., `scrollX + width/2`)
- **Files**: `BuildingMenuPanel.ts`, `PlanetInfoPanel.ts`

#### P002: Click-outside handlers catch the opening click
- **Problem**: Registering a "click outside to close" handler immediately when opening a panel catches the same click that opened it
- **Root Cause**: The pointerdown event that triggers panel.show() continues propagating and is caught by the newly registered handler
- **Solution**: Use `scene.time.delayedCall(50, ...)` before registering click-outside handlers
- **Files**: `BuildingMenuPanel.ts:244`, `PlanetInfoPanel.ts:785`

#### P003: Zone positioning for click-outside detection
- **Problem**: Fullscreen zones for click-outside detection don't work when added to `scrollFactor(0)` containers
- **Solution**: Add the zone directly to the scene (not the container) and position it at camera's world center: `scene.add.zone(scrollX + width/2, scrollY + height/2, width, height)`. Set depth just below the panel.
- **Files**: `BuildingMenuPanel.ts:505-542`

### TypeScript

#### T001: Multiple services sharing localStorage key must use same format
- **Problem**: Completing a tutorial didn't unlock the next one - prerequisites showed "not complete"
- **Root Cause**: `ScenarioCompletionService` saved completions as an **array** `[{scenarioId: "x", ...}]`, but `ScenarioManager` loaded expecting an **object** `{"x": {...}}`. Both used the same localStorage key `overlord_scenario_completions`.
- **Solution**: Standardize on object format with scenarioId as keys. Add backwards-compatible loading that handles both formats.
- **Files**: `ScenarioCompletionService.ts:131-143`, `ScenarioManager.ts:166-178`

#### T002: Singleton services may have stale data across scene transitions
- **Problem**: After completing a scenario and returning to menu, the completion wasn't reflected
- **Root Cause**: ScenarioManager creates a new instance per scene, loading from localStorage. ScenarioCompletionService is a singleton. If they're not synchronized, data diverges.
- **Solution**: Either use one service consistently, or ensure both read from localStorage at the right time. The singleton pattern (`getCompletionService()`) is preferred for cross-scene state.
- **Files**: `ScenarioCompletionService.ts`, `ScenarioManager.ts`

### Phaser 3 (continued)

#### P004: Defer tutorial/overlay start until blocking UI is dismissed
- **Problem**: Tutorial step panel wasn't visible when scenario started
- **Root Cause**: Tutorial initialized immediately in `create()`, but ObjectivesPanel was shown on top. Tutorial was running behind the modal.
- **Solution**: Create tutorial components in `initializeTutorialSystem()`, but call `tutorialManager.initialize()` in the objectives panel's `onContinue` callback.
- **Files**: `ScenarioGameScene.ts:173-217`

#### P005: Position3D uses z as screen Y in 2D contexts
- **Problem**: Planets rendered in wrong position - expected center, got top-left
- **Root Cause**: `PlanetRenderer` uses `planet.position.x` and `planet.position.z` (not `.y`). The Position3D model uses z for the vertical screen axis in this 2D game context.
- **Solution**: When setting planet positions for 2D rendering, use `new Position3D(screenX, unused, screenY)` or check renderer code for coordinate mapping.
- **Files**: `ScenarioInitializer.ts:186-202`, `PlanetRenderer.ts:35`

#### P006: Scene routing should check scenario type for correct return destination
- **Problem**: Completing a tutorial returned to FlashConflictsScene instead of TutorialsScene
- **Root Cause**: `handleContinue()` and `handleExit()` had hardcoded `scene.start('FlashConflictsScene')`
- **Solution**: Create `returnToMenu()` method that checks `scenario.type === 'tutorial'` and routes accordingly
- **Files**: `ScenarioGameScene.ts:353-359`

### Testing / Playwright

#### E001: Canvas-based games need coordinate mapping for clicks
- **Problem**: E2E tests couldn't click on specific game elements
- **Root Cause**: Playwright can't see Phaser game objects - only the canvas element. Need to calculate pixel coordinates for clicks.
- **Solution**: Use `page.evaluate()` to query game state for object positions, then use `clickCanvasAt(page, x, y)` helper. Consider adding data-testid zones for critical UI.
- **Files**: `tests/e2e/helpers/phaser-helpers.ts:64-70`

#### E002: UI audit via page.evaluate helps diagnose missing elements
- **Problem**: Tests failing but unclear what UI elements exist
- **Solution**: Add UI audit that queries scene state: `page.evaluate(() => { const scene = game.scene.getScene('X'); return { planets: scene.gameState?.planets.length, ... }; })`. Log results to identify what's missing.
- **Files**: `tests/e2e/tutorials/tutorial-003-player-journey.spec.ts`

### Supabase / Backend

*(Add entries as discovered)*

### Flash Conflicts / Tutorials

#### F001: Tutorial scenario JSON structure
- **Location**: `src/data/scenarios/tutorial-XXX-name.json`
- **Required fields**: `id`, `name`, `type: "tutorial"`, `difficulty`, `duration`, `description`, `prerequisites[]`, `victoryConditions[]`, `initialState`
- **Optional**: `tutorialSteps[]`, `story{}`, `starTargets{}`, `clickByClickRecipe{}`
- **Victory condition types**: `ui_interaction`, `turn_reached`, `build_structure`, `capture_planet`, `commission_platoon`, `move_ship`, `deploy_atmosphere_processor`

#### F002: Tutorial prerequisites create unlock chains
- **Pattern**: T03 (no prereqs) → T05, T06 (prereq: T03) → T19, T24 (prereq: T05) → T25 (prereq: T24) → T30 (prereq: T19 + T24)
- **Validation**: `ScenarioManager.checkPrerequisites()` verifies all prereq scenario IDs have `completed: true` in completions
- **Files**: Tutorial JSON files, `ScenarioManager.ts:93-108`
