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

*(Add entries as discovered)*

### Testing / Playwright

*(Add entries as discovered)*

### Supabase / Backend

*(Add entries as discovered)*
