# Volume I: Technical Reference Manual

**Purpose:** Comprehensive technical documentation of the existing Overlord implementation
**Last Updated:** December 11, 2025

---

## Table of Contents

### Getting Started
- [01: Getting Started](01-getting-started.md) - Environment setup, build, and first run
- [02: Architecture Overview](02-architecture-overview.md) - High-level system design and patterns

### Core Systems Reference
- [03: Core Systems Reference](03-core-systems-reference.md) - All 18 game systems explained
- [04: Phaser Integration](04-phaser-integration.md) - Event-driven Core → Phaser communication
- [05: Data Models & State](05-data-models-state.md) - Entity models, GameState, lookups

### Development & Testing
- [06: Testing Guide](06-testing-guide.md) - TDD workflow, test patterns, coverage
- [07: Build System & Tooling](07-build-tooling.md) - Webpack, TypeScript, CI/CD

### Advanced Topics
- [08: Flash Conflicts System](08-flash-conflicts-system.md) - Tutorial/tactical scenario architecture
- [09: User Onboarding](09-user-onboarding.md) - Tutorial system and progression
- [10: Persistence & Save System](10-persistence-save-system.md) - Save/load, serialization, checksums

### UI Components Library
- [11: UI Components Reference](11-ui-components.md) - Reusable Phaser UI panels and HUDs

### Appendices
- [12: Glossary](12-glossary.md) - Term definitions
- [13: Migration Notes](13-migration-notes.md) - Unity → Phaser migration history

---

## How to Use This Volume

### For Understanding the Codebase
1. Start with [Architecture Overview](02-architecture-overview.md)
2. Review [Core Systems Reference](03-core-systems-reference.md) for system details
3. Study [Phaser Integration](04-phaser-integration.md) for event patterns

### For Adding Features
1. Review [Testing Guide](06-testing-guide.md) for TDD workflow
2. Check [Data Models & State](05-data-models-state.md) for state structure
3. Use [UI Components Reference](11-ui-components.md) for existing UI patterns

### For Debugging
1. Check [Build System & Tooling](07-build-tooling.md) for source maps
2. Review relevant system in [Core Systems Reference](03-core-systems-reference.md)
3. Examine test files for expected behavior examples

---

## Key Architectural Principles

### 1. Platform-Agnostic Core
```
src/core/ (TypeScript only, zero Phaser imports)
    ↓ Platform-independent business logic
    ↓ ALL game systems, models, AI, serialization
    ↓ NO rendering dependencies
    ↓
src/scenes/ (Phaser 3)
    ↓ Presentation layer ONLY
    ↓ Rendering, input, UI, audio
    ↓ Subscribes to Core events
```

**Rule:** Core systems never import Phaser. All communication is uni-directional via callbacks.

### 2. Event-Driven Communication
```typescript
// Core System fires events
export class TurnSystem {
  public onPhaseChanged?: (phase: TurnPhase) => void;

  private transitionToPhase(newPhase: TurnPhase): void {
    this.gameState.currentPhase = newPhase;
    if (this.onPhaseChanged) {
      this.onPhaseChanged(newPhase);  // Notify subscribers
    }
  }
}

// Phaser Scene subscribes
export class GalaxyMapScene extends Phaser.Scene {
  create() {
    this.turnSystem.onPhaseChanged = (phase) => {
      this.turnHUD.setPhase(phase);  // Update UI
    };
  }
}
```

### 3. Test-Driven Development
- All core systems have 90%+ test coverage
- Tests written before implementation (red → green → refactor)
- Mock Phaser components when testing UI panels
- 835 tests currently passing

### 4. Type Safety
```typescript
// Strict TypeScript enabled
// No 'any' types allowed
// All functions must have explicit return types
// No implicit returns or fallthrough cases

function calculateDamage(attacker: Platoon, defender: Platoon): number {
  // Type-safe implementation
  return Math.floor(attacker.strength * defender.vulnerability);
}
```

---

## Technology Stack

**Core Technologies:**
- **TypeScript 5.4.5** - Strict mode enabled
- **Phaser 3.85.2** - WebGL 2.0 / Canvas 2D rendering
- **Jest 29.7.0** - Testing framework
- **Webpack 5.91.0** - Module bundler with HMR

**Development Tools:**
- **ESLint + TypeScript ESLint** - Code quality
- **ts-jest** - TypeScript test execution
- **webpack-dev-server** - Hot reload development

**Deployment:**
- **Vercel Edge Network** - Static site hosting
- **Supabase PostgreSQL** - Cloud persistence (planned)

---

## File Organization

```
Overlord.Phaser/
├── src/
│   ├── core/              # Platform-agnostic game logic (18 systems)
│   │   ├── models/        # Entity models, enums, interfaces
│   │   ├── GameState.ts   # Central state container
│   │   ├── TurnSystem.ts  # Turn-based game loop
│   │   ├── CombatSystem.ts
│   │   ├── AIDecisionSystem.ts
│   │   └── ... (15 more systems)
│   ├── scenes/            # Phaser presentation layer
│   │   ├── ui/            # Reusable UI components
│   │   ├── renderers/     # Planet, starfield rendering
│   │   ├── controllers/   # Camera, input management
│   │   ├── BootScene.ts   # Initial load scene
│   │   ├── GalaxyMapScene.ts  # Main gameplay scene
│   │   └── FlashConflictsScene.ts  # Tutorial/scenario menu
│   ├── config/            # Phaser configuration
│   └── data/              # JSON scenario/pack files (planned)
├── tests/
│   ├── unit/              # Core system tests (90%+ coverage)
│   └── integration/       # Multi-system integration tests
├── public/                # Static assets
│   └── assets/            # Images, audio (future)
└── dist/                  # Production build output
```

---

## Code Quality Standards

### Coverage Requirements
- **Core systems:** 90%+ coverage (business logic critical)
- **Models:** 80%+ coverage
- **Scenes:** 50%+ coverage (rendering less critical)
- **Overall:** 70%+ minimum enforced by CI/CD

### Naming Conventions
```typescript
// Classes: PascalCase
export class GameState { }
export class TurnSystem { }

// Interfaces: PascalCase with descriptive names
export interface SaveData { }
export interface ResourceCollection { }

// Enums: PascalCase for enum and values
export enum TurnPhase {
  Income,
  Action,
  Combat,
  End
}

// Functions/Methods: camelCase with verb prefix
public advancePhase(): void { }
private calculateIncome(): ResourceDelta { }

// Constants: UPPER_SNAKE_CASE
const MAX_PLANETS = 6;
const DEFAULT_SEED = 42;

// Files: kebab-case matching class names
// GameState.ts, TurnSystem.ts, CombatSystem.ts
```

### Documentation Standards
```typescript
/**
 * Manages turn-based game loop with Income, Action, Combat, and End phases.
 * Platform-agnostic implementation.
 *
 * @example
 * const turnSystem = new TurnSystem(gameState);
 * turnSystem.onPhaseChanged = (phase) => console.log(phase);
 * turnSystem.advancePhase();
 */
export class TurnSystem {
  /**
   * Advances to the next turn phase.
   * Call this when the player presses "End Turn" during Action phase.
   */
  public advancePhase(): void {
    // Implementation
  }
}
```

---

## Quick Reference

### Common Tasks
- **Run dev server:** `npm start` (http://localhost:8080)
- **Run tests:** `npm test`
- **Test with watch:** `npm run test:watch`
- **Coverage report:** `npm run test:coverage`
- **Production build:** `npm run build`

### Key Directories
- Core logic: `src/core/`
- UI components: `src/scenes/ui/`
- Tests: `tests/unit/`, `tests/integration/`
- Config: `src/config/PhaserConfig.ts`

### Important Files
- Central state: `src/core/GameState.ts`
- Main scene: `src/scenes/GalaxyMapScene.ts`
- Package config: `package.json`
- TypeScript config: `tsconfig.json`
- Webpack config: `webpack.config.js`

---

## Next Steps

After reviewing this overview:
1. Set up your development environment: [01: Getting Started](01-getting-started.md)
2. Understand the architecture: [02: Architecture Overview](02-architecture-overview.md)
3. Explore core systems: [03: Core Systems Reference](03-core-systems-reference.md)
4. Learn testing patterns: [06: Testing Guide](06-testing-guide.md)

---

**Volume I Status:** Complete
**Systems Documented:** 18 of 18 core systems
**UI Components Documented:** 13 Phaser components
**Test Coverage:** 93%+ documented
