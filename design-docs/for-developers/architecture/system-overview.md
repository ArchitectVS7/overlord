# Game Architecture - Overlord

**Project:** Overlord
**Author:** Venomous
**Date:** 2025-12-09
**Version:** 1.0.0
**Tech Stack:** Phaser 3.85.2 + TypeScript
**Deployment:** Vercel Edge + Supabase PostgreSQL

---

## Executive Summary

[To be generated through architectural decisions]

## Project Context Understanding

### What Is Overlord?

**Overlord** is a turn-based 4X strategy game - a modern web-based remake of the classic 1990 game "Overlord" (aka "Supremacy"). This architecture supports the 


- **1,272 passing tests** (comprehensive coverage maintained)
- **Platform-agnostic architecture** (zero rendering dependencies in core logic)
- **AI-assisted development compatibility** (2-second edit → browser refresh cycle)

### Project Scale & Complexity

**Epic Count:** TBD (to be created from PRD)
**Story Count:** TBD (to be created from PRD)
**Functional Requirements:** 55 FRs covering campaign, Flash Conflicts, persistence, UI/UX
**Non-Functional Requirements:** 20+ NFRs (performance, reliability, accessibility, security)

**Complexity Indicators:**
- ✅ **Real-time rendering** (WebGL 2.0, 60 FPS target desktop, 30 FPS mobile)
- ✅ **Cross-device persistence** (Supabase cloud saves with sync)
- ✅ **Data-driven extensibility** (JSON-based scenario packs, hot-swappable enemy factions)
- ✅ **Dual-platform optimization** (desktop mouse+keyboard, mobile touch)
- ✅ **Accessibility requirements** (WCAG 2.1 Level A keyboard navigation, UI scaling, high contrast)

### Core Game Systems (Already Implemented ✓)

All 18 systems exist in `Overlord.Phaser/src/core/` with TypeScript implementations:

**State Management:**
- GameState (central state with entity lookups)
- SaveSystem (compressed JSON serialization with SHA256 checksums)
- TurnSystem (turn phases: Income → Action → Combat → End)

**Economy:**
- ResourceSystem (5 resources: Credits, Minerals, Fuel, Food, Energy)
- IncomeSystem (per-turn resource generation)
- PopulationSystem (growth, morale, happiness)
- TaxationSystem (tax rate management)

**Entities:**
- EntitySystem (base entity management)
- CraftSystem (Scouts, Battle Cruisers, Bombers, Atmosphere Processors)
- PlatoonSystem (ground forces with equipment/weapons/training)

**Infrastructure:**
- BuildingSystem (Mining Stations, Factories, Labs, Defense Structures)
- UpgradeSystem (tech levels: Equipment, Weapons, Training)
- DefenseSystem (Shields, Missiles, Laser Batteries)

**Combat:**
- CombatSystem (ground combat: platoon vs platoon)
- SpaceCombatSystem (fleet battles)
- BombardmentSystem (orbital bombardment)
- InvasionSystem (planetary invasions)
- NavigationSystem (spacecraft movement between planets)

**AI:**
- AIDecisionSystem (4 personalities × 3 difficulties, priority-based decision tree)

**Galaxy:**
- GalaxyGenerator (deterministic seeded RNG, procedural 4-6 planet systems)

### Novel Features & Strategic Innovations

**1. Flash Conflicts (Dual-Purpose System):**

**Phase 1 - Onboarding (New Players):**
- Tutorial-style scenarios teach core mechanics (Genesis Device deployment, combat basics, empire building)
- 5-10 minute focused learning experiences
- Safe practice environment (low-stakes, repeatable)

**Phase 2 - Quick-Play (Experienced Players):**
- Tactical skirmish challenges unlock after basic campaign completion
- 5-15 minute gameplay sessions for shorter play windows
- Replayable tactical puzzles (speedrun potential, leaderboards post-MVP)

**Implementation:** Single JSON-based scenario system serves both purposes - scenarios tagged as `"type": "tutorial"` or `"type": "tactical"`.

**2. Data-Driven Scenario Packs:**
- Enemy factions, AI configurations, and galaxy templates loaded from JSON at runtime
- Hot-swappable without code changes (community content support)
- Enables unlimited replayability variations

**3. Developer Experience as Product Requirement:**
- Architecture explicitly optimized for AI-assisted development (Claude Code)
- Zero-friction iteration (edit → save → 2 sec browser refresh)
- Comprehensive test coverage (AI can refactor safely)

### Key Architectural Challenges

**1. Phaser Integration with Platform-Agnostic Core:**
- Core game logic (`src/core/`) must have **zero Phaser dependencies**
- Phaser scenes (`src/scenes/`) subscribe to Core events for rendering updates
- Event-driven communication ensures Core can swap rendering engines if needed

**2. Supabase Persistence Integration:**
- Save/load operations must achieve >99.9% success rate (NFR-R1)
- Cross-device sync with conflict resolution (last-write-wins)
- Authentication, user profiles, scenario completion tracking

**3. Mobile Web Performance:**
- 30 FPS sustained on iOS Safari 14+ and Chrome Mobile 90+
- Asset streaming and lazy loading (<200 MB mobile budget)
- Progressive quality degradation based on device memory

**4. Flash Conflicts Architecture:**
- JSON-based scenario definitions (reusable system for tutorials + quick-play)
- Pre-configured game states (mid-game tactical situations)
- Victory condition validation and completion tracking

**5. Accessibility Compliance:**
- Full keyboard navigation (WCAG 2.1 Level A)
- UI scaling (100%, 125%, 150%)
- High contrast mode
- Touch targets minimum 44×44px (mobile)

---

## Project Initialization

**Current Status:** Initial gameplay testing

**Existing Setup:**
- Webpack 5 bundler with TypeScript loader (ts-loader)
- Phaser 3.85.2 (released September 17, 2024)
- TypeScript strict mode enabled
- Jest testing framework (1,272 tests)
- Development server at http://localhost:8080

**Recommendation:**
Upgrade to latest stable versions for bug fixes and performance improvements:
```bash
npm install phaser@3.90.0 @supabase/supabase-js@2.86.2
```

**Note:** This architecture documents the existing implementation and provides consistency guidelines for future AI-assisted development.

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Game Engine** | Phaser 3 | 3.85.2 → 3.90.0 recommended | All epics | Browser-based WebGL rendering, mature ecosystem, TypeScript support |
| **Language** | TypeScript | 5.x (strict mode) | All epics | Type safety for AI-assisted development, excellent IDE support |
| **Build Tool** | Webpack | 5.x | All epics | Code splitting, hot module reload, asset optimization |
| **Testing** | Jest | Latest | All epics | 1,272 tests, TypeScript integration, coverage reporting |
| **Backend/Auth** | Supabase | SDK 2.86.2 | Persistence, Authentication | PostgreSQL backend, built-in auth, real-time subscriptions |
| **Deployment** | Vercel | Edge Network | Hosting | Instant deploys, global CDN, zero config, free tier |
| **State Management** | Custom (GameState) | N/A | Core systems | Platform-agnostic, already implemented with 93.78% coverage |
| **HTTP Client** | Fetch API | Native | API calls | Built-in browser API, no external dependency |
| **Code Quality** | ESLint + Prettier | Latest | All epics | Consistent code formatting, catch errors early |

---

## Technology Stack Details

### Core Technologies

**Rendering Engine:**
- **Phaser 3.90.0** (latest stable as of May 2025)
  - WebGL 2.0 renderer (60 FPS target desktop)
  - Canvas 2D fallback (30 FPS graceful degradation)
  - AUTO mode detection (Phaser selects best available)

**Language & Type Safety:**
- **TypeScript 5.x** with strict mode enabled
  - `strict: true` - All strict checks enabled
  - `noUnusedLocals: true` - No unused variables
  - `noUnusedParameters: true` - No unused function params
  - `noImplicitReturns: true` - All code paths return values
  - `noFallthroughCasesInSwitch: true` - Switch statements complete

**Build & Development:**
- **Webpack 5** - Module bundler
  - Dev server with hot module replacement (HMR)
  - Production builds with code splitting
  - Content-hash based cache busting
  - Brotli/Gzip compression

- **ts-loader** - TypeScript compilation for Webpack
- **Source Maps** - `eval-source-map` (dev), `source-map` (prod)

**Testing:**
- **Jest** - Test runner with TypeScript support
  - 1,272 tests with comprehensive coverage
  - Coverage threshold: 70% minimum
  - Watch mode for TDD workflows

**Backend & Cloud Services:**
- **Supabase SDK 2.86.2** - Backend-as-a-Service
  - PostgreSQL database (500 MB free tier)
  - Authentication (email/password, OAuth post-MVP)
  - Real-time subscriptions (optional)
  - Edge Functions (serverless)
  - Storage (compressed save games)

- **Vercel Edge Network** - Hosting & CDN
  - Automatic HTTPS/TLS 1.3
  - Global CDN (300+ edge locations)
  - Zero-downtime deploys
  - Preview deployments per PR

**Code Quality:**
- **ESLint** - Linting (TypeScript rules)
- **Prettier** - Code formatting (2-space indent, single quotes)

---

## Project Structure

```
Overlord.Phaser/
├── public/
│   ├── index.html              # Entry HTML
│   └── assets/                 # Static assets
│       ├── sprites/            # Sprite sheets, textures
│       ├── audio/              # Sound effects, music
│       └── data/               # JSON scenario packs
│
├── src/
│   ├── main.ts                 # Application entry point
│   │
│   ├── config/
│   │   └── PhaserConfig.ts     # Phaser game configuration
│   │
│   ├── core/                   # Platform-agnostic game logic
│   │   ├── GameState.ts        # Central game state
│   │   ├── SaveSystem.ts       # Save/load with compression
│   │   ├── TurnSystem.ts       # Turn phase management
│   │   ├── ResourceSystem.ts   # Economy (Credits, Minerals, etc.)
│   │   ├── CombatSystem.ts     # Ground combat
│   │   ├── SpaceCombatSystem.ts # Fleet battles
│   │   ├── AIDecisionSystem.ts # AI opponent logic
│   │   ├── GalaxyGenerator.ts  # Procedural galaxy
│   │   ├── [... 10 more systems]
│   │   │
│   │   └── models/             # Data models (Planet, Craft, Platoon)
│   │       ├── Position3D.ts
│   │       ├── Planet.ts
│   │       ├── Craft.ts
│   │       └── [... more models]
│   │
│   ├── scenes/                 # Phaser presentation layer
│   │   ├── BootScene.ts        # Preloader, asset loading
│   │   ├── MainMenuScene.ts    # Campaign vs Flash Conflicts choice
│   │   ├── GalaxyMapScene.ts   # Main gameplay view
│   │   ├── PlanetDetailScene.ts # Planet management UI
│   │   ├── CombatScene.ts      # Combat resolution UI
│   │   ├── FlashScenarioMenuScene.ts # Scenario browser
│   │   └── FlashScenarioScene.ts # Scenario gameplay
│   │
│   ├── services/               # Integration layer
│   │   ├── SupabaseClient.ts   # Supabase singleton
│   │   ├── AuthService.ts      # User authentication
│   │   ├── SaveService.ts      # Save/load via Supabase
│   │   └── ScenarioService.ts  # Load scenario packs
│   │
│   └── utils/                  # Shared utilities
│       ├── AssetLoader.ts      # Lazy loading strategy
│       ├── InputManager.ts     # Keyboard + touch abstraction
│       └── Analytics.ts        # Telemetry (post-MVP)
│
├── tests/
│   ├── unit/                   # Unit tests for core systems
│   │   ├── GameState.test.ts
│   │   ├── CombatSystem.test.ts
│   │   └── [... 8 more test files]
│   │
│   └── integration/            # Integration tests
│       └── GalaxyGeneration.test.ts
│
├── dist/                       # Build output (gitignored)
├── coverage/                   # Test coverage reports
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── webpack.config.js           # Build configuration
├── jest.config.js              # Test configuration
└── README.md                   # Project documentation
```

**Epic to Architecture Mapping:**

| Epic | Architecture Components | Location |
|------|------------------------|----------|
| **Campaign System** | GameState, TurnSystem, All 18 core systems, GalaxyMapScene | `src/core/`, `src/scenes/GalaxyMapScene.ts` |
| **Flash Conflicts** | ScenarioService, FlashScenarioScene, JSON scenario definitions | `src/services/ScenarioService.ts`, `public/assets/data/scenarios/` |
| **Scenario Packs** | ScenarioService, JSON pack definitions, runtime loading | `public/assets/data/packs/` |
| **Persistence** | SaveSystem (core), SaveService, SupabaseClient, AuthService | `src/core/SaveSystem.ts`, `src/services/` |
| **Combat** | CombatSystem, SpaceCombatSystem, BombardmentSystem, InvasionSystem, CombatScene | `src/core/`, `src/scenes/CombatScene.ts` |
| **AI Opponents** | AIDecisionSystem | `src/core/AIDecisionSystem.ts` |
| **Galaxy Generation** | GalaxyGenerator | `src/core/GalaxyGenerator.ts` |
| **Planet Management** | ResourceSystem, IncomeSystem, PopulationSystem, BuildingSystem, PlanetDetailScene | `src/core/`, `src/scenes/PlanetDetailScene.ts` |
| **Mobile Support** | InputManager, Touch gesture handlers, Responsive UI | `src/utils/InputManager.ts`, `src/scenes/*` |
| **Accessibility** | Keyboard navigation, UI scaling, High contrast mode | All scenes with consistent patterns |

---

## Integration Points

### Core ↔ Phaser Communication (Event-Driven)

**Pattern:** Core systems fire events → Phaser scenes subscribe and update rendering

**Example Flow:**
```typescript
// Core System (src/core/TurnSystem.ts)
export class TurnSystem {
  public onPhaseChanged?: (phase: TurnPhase) => void;
  public onTurnEnded?: (turnNumber: number) => void;

  advanceTurn(): void {
    this.currentTurn++;
    this.onTurnEnded?.(this.currentTurn); // Fire event
  }
}

// Phaser Scene (src/scenes/GalaxyMapScene.ts)
export class GalaxyMapScene extends Phaser.Scene {
  create() {
    this.turnSystem.onTurnEnded = (turnNumber) => {
      this.updateTurnDisplay(turnNumber); // Update UI
    };
  }
}
```

**Critical Rule:** Core systems NEVER import Phaser types. Communication is uni-directional (Core → Phaser via callbacks).

### Supabase Integration

**Pattern:** Services layer wraps Supabase SDK, Core uses services without knowing about Supabase

**Example Flow:**
```typescript
// Service Layer (src/services/SaveService.ts)
import { SaveSystem } from '@core/SaveSystem';
import { supabase } from './SupabaseClient';

export class SaveService {
  async saveCampaign(gameState: GameState, userId: string): Promise<void> {
    const saveData = SaveSystem.createSaveData(gameState);
    const compressed = SaveSystem.serialize(saveData);

    await supabase.from('saves').insert({
      user_id: userId,
      data: compressed,
      checksum: saveData.checksum,
      created_at: new Date().toISOString()
    });
  }
}

// Core System (src/core/SaveSystem.ts)
// NO Supabase imports! Platform-agnostic.
export class SaveSystem {
  static createSaveData(gameState: GameState): SaveData {
    // Pure logic, no external dependencies
  }
}
```

### Asset Loading Strategy

**Pattern:** Lazy loading with priority tiers

**Priority 1 (Initial Load <10 MB):**
- UI framework (buttons, panels, fonts)
- Galaxy map background
- Placeholder planet sprites (low-res)
- Core sound effects (click, confirm, error)

**Priority 2 (On-Demand):**
- Planet detail textures (loaded when player selects planet)
- Craft sprites (loaded when first craft of type is built)
- Combat animations (loaded when first battle starts)
- Background music (streamed, not preloaded)

**Priority 3 (Cached for Reuse):**
- Asset pools for frequently used sprites
- Color tinting for faction differentiation (Player=blue, AI=red, Neutral=gray)
- Texture atlases for GPU efficiency

**Mobile Optimization:**
- Detect `navigator.deviceMemory` and load 50% resolution textures on <4 GB RAM devices
- Disable particle effects on low-end devices (FPS < 25 sustained)
- Aggressive WebP compression (PNG fallback for Safari)

---

## Novel Architectural Patterns

### Pattern 1: Flash Conflicts System

**Problem Solved:**
Traditional 4X game tutorials are passive and boring. Players need a way to learn mechanics through interactive play AND have quick tactical challenges for shorter sessions. This pattern unifies both needs into a single system.

**Components Involved:**

```typescript
// src/services/ScenarioService.ts
export class ScenarioService {
  async loadScenario(scenarioId: string): Promise<ScenarioDefinition> {
    // Load from public/assets/data/scenarios/{scenarioId}.json
    const response = await fetch(`/assets/data/scenarios/${scenarioId}.json`);
    return await response.json();
  }

  validateScenario(scenario: ScenarioDefinition): boolean {
    // Schema validation before loading
  }
}

// src/scenes/FlashScenarioScene.ts
export class FlashScenarioScene extends Phaser.Scene {
  private gameState: GameState;
  private scenarioDef: ScenarioDefinition;

  create() {
    // Initialize GameState from scenario initial_state
    this.gameState = this.createGameStateFromScenario(this.scenarioDef);

    // Subscribe to victory/defeat events
    this.checkVictoryConditions();
  }
}
```

**Data Flow:**

1. User selects Flash Conflict from menu
2. `ScenarioService` loads JSON definition from `/assets/data/scenarios/`
3. `FlashScenarioScene` creates fresh `GameState` from scenario's `initial_state`
4. Player interacts with pre-configured tactical situation
5. Victory/defeat conditions checked each turn
6. Completion tracked to user profile (Supabase)

**JSON Schema:**

```json
{
  "scenario_id": "genesis_device_101",
  "name": "Genesis Device 101",
  "type": "tutorial",
  "difficulty": "easy",
  "duration_estimate_minutes": 5,
  "initial_state": {
    "turn": 1,
    "planets": [
      {
        "id": "neutral_planet_1",
        "name": "Uncharted World",
        "type": "volcanic",
        "owner": "neutral",
        "position": { "x": 100, "y": 100, "z": 0 }
      }
    ],
    "player_resources": {
      "credits": 1000,
      "minerals": 500,
      "fuel": 100,
      "food": 100,
      "energy": 100
    },
    "player_craft": [
      {
        "type": "atmosphere_processor",
        "id": "genesis_device_1",
        "position": { "x": 50, "y": 50, "z": 0 }
      }
    ],
    "ai_config": null
  },
  "victory_conditions": {
    "type": "planet_terraformed",
    "target_planet_id": "neutral_planet_1"
  },
  "tutorial_steps": [
    {
      "step": 1,
      "instruction": "Select your Atmosphere Processor",
      "highlight": "genesis_device_1"
    },
    {
      "step": 2,
      "instruction": "Navigate to Uncharted World",
      "highlight": "neutral_planet_1"
    },
    {
      "step": 3,
      "instruction": "Deploy Genesis Device to terraform the planet",
      "action_required": "deploy"
    }
  ]
}
```

**Implementation Pattern for AI Agents:**

```typescript
// When creating new Flash Conflicts, follow this pattern:

// 1. Create JSON definition in public/assets/data/scenarios/
// 2. Use ScenarioService to load and validate
// 3. FlashScenarioScene handles all scenario types uniformly
// 4. Victory conditions checked via VictorySystem (reuses campaign logic)
// 5. Tutorial steps rendered as UI overlays (optional, only for type: "tutorial")
```

**Affects Epics:**
- Flash Conflicts MVP (3-5 scenarios)
- Tutorial System (onboarding new players)
- Quick-Play Mode (tactical challenges for experienced players)

---

### Pattern 2: Data-Driven Scenario Packs

**Problem Solved:**
Fixed enemy factions limit replayability. Traditional 4X games hardcode enemy AI, requiring code changes for variety. This pattern treats enemy factions and galaxy configurations as hot-swappable JSON data.

**Components Involved:**

```typescript
// src/services/ScenarioService.ts
export class ScenarioService {
  async loadScenarioPack(packId: string): Promise<ScenarioPackDefinition> {
    const response = await fetch(`/assets/data/packs/${packId}.json`);
    return await response.json();
  }

  applyScenarioPack(pack: ScenarioPackDefinition, gameState: GameState): void {
    // Apply AI configuration from pack
    gameState.aiPersonality = pack.ai_config.personality;
    gameState.aiDifficulty = pack.ai_config.difficulty;

    // Apply galaxy template from pack
    const galaxy = GalaxyGenerator.generateFromTemplate(pack.galaxy_template);
    gameState.loadGalaxy(galaxy);
  }
}
```

**JSON Schema:**

```json
{
  "pack_id": "krylon_empire",
  "name": "Krylon Empire",
  "version": "1.0",
  "difficulty": "hard",
  "faction": {
    "name": "Krylon Empire",
    "leader_name": "Overlord Vex",
    "lore": "Ancient warmongers seeking galactic dominance.",
    "color_theme": "#FF0000"
  },
  "ai_config": {
    "personality": "aggressive",
    "difficulty": "hard",
    "aggression_modifier": 0.8,
    "economic_modifier": -0.2,
    "defense_modifier": -0.1
  },
  "galaxy_template": {
    "planet_count": 6,
    "planet_types": ["volcanic", "volcanic", "desert", "tropical", "metropolis", "metropolis"],
    "resource_abundance": 1.5,
    "spatial_layout": "clustered"
  }
}
```

**Implementation Pattern for AI Agents:**

```typescript
// When implementing scenario pack support:

// 1. Load pack JSON from /assets/data/packs/
// 2. Validate against schema (ScenarioService.validatePack)
// 3. Apply AI config to AIDecisionSystem constructor
// 4. Pass galaxy_template to GalaxyGenerator.generateFromTemplate()
// 5. Apply faction visual theme to Phaser scenes (color tinting)

// CRITICAL: NO code changes needed to add new packs - purely data-driven
```

**Affects Epics:**
- Scenario Pack System (3+ packs in MVP)
- Campaign Replayability (variety through different enemy types)
- Community Content (post-MVP: user-created packs)

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents building this codebase.

### Naming Conventions

**TypeScript Files:**
- **PascalCase** for classes and interfaces: `GameState.ts`, `CombatSystem.ts`, `Planet.ts`
- **camelCase** for variables, functions, parameters: `gameState`, `calculateDamage()`, `turnNumber`
- **SCREAMING_SNAKE_CASE** for constants: `MAX_PLANETS`, `DEFAULT_RESOURCES`

**Phaser Scenes:**
- **PascalCase** + `Scene` suffix: `GalaxyMapScene.ts`, `BootScene.ts`, `CombatScene.ts`
- Scene keys (string IDs) use **kebab-case**: `'galaxy-map'`, `'boot'`, `'combat'`

**JSON Data Files:**
- **snake_case** for keys: `scenario_id`, `initial_state`, `victory_conditions`
- **kebab-case** for file names: `genesis-device-101.json`, `krylon-empire.json`

**Database Tables (Supabase):**
- **snake_case** for table names: `saves`, `user_profiles`, `scenario_completions`
- **snake_case** for column names: `user_id`, `created_at`, `checksum`

**Example:**
```typescript
// ✅ CORRECT
export class GameState {
  private currentTurn: number = 1;
  public readonly MAX_TURNS: number = 100;

  calculateResourceIncome(): ResourceDelta {
    // ...
  }
}

// ❌ WRONG
export class gamestate {
  private CurrentTurn: number = 1;
  public readonly max_turns: number = 100;

  CalculateResourceIncome(): resourceDelta {
    // ...
  }
}
```

---

### Code Organization

**Feature-Based Structure:**
- Group related files by feature/system, not by type
- Core systems in `src/core/` (no Phaser dependencies)
- Phaser scenes in `src/scenes/` (rendering only)
- Services in `src/services/` (external integrations)

**Test Co-Location:**
- Unit tests in `tests/unit/` matching core file structure
- Integration tests in `tests/integration/`
- Test files use `.test.ts` suffix: `CombatSystem.test.ts`

**Import Path Aliases:**
```typescript
// tsconfig.json paths configuration
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/core/*"],
      "@scenes/*": ["src/scenes/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}

// Usage in code
import { GameState } from '@core/GameState';
import { GalaxyMapScene } from '@scenes/GalaxyMapScene';
import { SaveService } from '@services/SaveService';
```

---

### Error Handling

**Pattern:** Structured error objects with codes and user-friendly messages

```typescript
// src/utils/GameError.ts
export class GameError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    public technicalDetails?: any
  ) {
    super(userMessage);
    this.name = 'GameError';
  }
}

// Usage in Core Systems
export class CombatSystem {
  resolveBattle(attackers: Platoon[], defenders: Platoon[]): BattleResult {
    if (attackers.length === 0) {
      throw new GameError(
        'COMBAT_NO_ATTACKERS',
        'Cannot start battle without attacking forces.',
        { attackers, defenders }
      );
    }
    // ... battle logic
  }
}

// Usage in Phaser Scenes
export class GalaxyMapScene extends Phaser.Scene {
  handleCombat() {
    try {
      const result = this.combatSystem.resolveBattle(attackers, defenders);
      this.displayBattleResults(result);
    } catch (error) {
      if (error instanceof GameError) {
        this.showErrorDialog(error.userMessage);
        console.error(`[${error.code}]`, error.technicalDetails);
      } else {
        this.showErrorDialog('An unexpected error occurred.');
        console.error(error);
      }
    }
  }
}
```

**Error Codes:**
- `COMBAT_*` - Combat system errors
- `SAVE_*` - Save/load errors
- `AUTH_*` - Authentication errors
- `SCENARIO_*` - Flash Conflict/pack errors
- `RESOURCE_*` - Resource/economy errors

**Critical Rule:** NEVER let errors crash the game. All Core system methods must handle errors gracefully and provide meaningful messages.

---

### Logging Strategy

**Pattern:** Structured logging with log levels

```typescript
// src/utils/Logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;

  static debug(category: string, message: string, data?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG][${category}]`, message, data);
    }
  }

  static info(category: string, message: string, data?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO][${category}]`, message, data);
    }
  }

  static warn(category: string, message: string, data?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN][${category}]`, message, data);
    }
  }

  static error(category: string, message: string, error?: Error): void {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR][${category}]`, message, error);
    }
  }
}

// Usage
Logger.info('TurnSystem', `Turn ${turnNumber} ended`, { phase: 'Combat' });
Logger.error('SaveSystem', 'Failed to save game', saveError);
```

**Log Categories:**
- `Core` - Core game systems
- `Phaser` - Rendering/scene events
- `Supabase` - Backend API calls
- `Performance` - FPS drops, load times

**Production:** Set `LogLevel.WARN` or `LogLevel.ERROR` only. Development: `LogLevel.DEBUG`.

---

### Date/Time Handling

**Pattern:** ISO 8601 strings for persistence, Date objects for computation

```typescript
// Supabase save data
interface SaveRecord {
  user_id: string;
  created_at: string; // ISO 8601: "2025-12-09T12:34:56.789Z"
  data: Uint8Array;
}

// Core game logic
export class TurnSystem {
  private turnStartTime: Date = new Date();

  endTurn(): void {
    const turnDuration = Date.now() - this.turnStartTime.getTime();
    Logger.debug('TurnSystem', `Turn completed in ${turnDuration}ms`);
    this.turnStartTime = new Date();
  }
}

// Converting for Supabase
const timestamp = new Date().toISOString();
```

**Critical Rule:** ALWAYS use UTC for timestamps. Never use local time zones for game logic or persistence.

---

### API Response Format (Supabase)

**Pattern:** Consistent error checking with Supabase SDK

```typescript
// src/services/SaveService.ts
export class SaveService {
  async loadCampaign(saveId: string): Promise<SaveData | null> {
    const { data, error } = await supabase
      .from('saves')
      .select('*')
      .eq('id', saveId)
      .single();

    if (error) {
      Logger.error('SaveService', 'Failed to load campaign', error);
      throw new GameError(
        'SAVE_LOAD_FAILED',
        'Could not load your saved game. Please try again.',
        { saveId, error }
      );
    }

    if (!data) {
      return null;
    }

    return SaveSystem.deserialize(data.data);
  }
}
```

**Critical Rules:**
- ALWAYS check `error` first before using `data`
- Log technical errors with `Logger.error()`
- Throw `GameError` with user-friendly message
- Return `null` for "not found" cases (not an error)

---

## Data Architecture

### Core Game Models

**GameState (Central State Container):**
```typescript
export class GameState {
  // Metadata
  public readonly gameId: string;
  public currentTurn: number = 1;
  public currentPhase: TurnPhase = TurnPhase.Income;

  // Entities (stored in Maps for O(1) lookup)
  public readonly planets: Map<string, Planet> = new Map();
  public readonly craft: Map<string, Craft> = new Map();
  public readonly platoons: Map<string, Platoon> = new Map();

  // Player state
  public playerResources: ResourcePool;
  public playerOwnedPlanetIds: Set<string> = new Set();

  // AI state
  public aiResources: ResourcePool;
  public aiOwnedPlanetIds: Set<string> = new Set();
  public aiPersonality: AIPersonality = 'balanced';
  public aiDifficulty: Difficulty = 'normal';
}
```

**Planet:**
```typescript
export interface Planet {
  id: string;
  name: string;
  type: PlanetType; // volcanic, desert, tropical, barren, metropolis
  owner: Owner; // 'player' | 'ai' | 'neutral'
  position: Position3D;

  population: number;
  morale: number; // 0-100

  buildings: Building[];
  defenses: DefenseStructure[];
  garrisonedPlatoons: string[]; // Platoon IDs
}
```

**Craft:**
```typescript
export interface Craft {
  id: string;
  type: CraftType; // scout, battle_cruiser, bomber, atmosphere_processor
  owner: Owner;
  position: Position3D;

  cargoCapacity: number;
  loadedPlatoons: string[]; // Platoon IDs

  targetPlanetId?: string; // If navigating
  isDeployed: boolean; // For Atmosphere Processors
}
```

**Platoon:**
```typescript
export interface Platoon {
  id: string;
  owner: Owner;
  troopCount: number;

  equipmentLevel: number; // 0-3 (Standard, Enhanced, Advanced, Elite)
  weaponLevel: number; // 0-3
  trainingLevel: number; // 0-3

  locationPlanetId?: string; // If garrisoned on planet
  locationCraftId?: string; // If loaded on craft
}
```

**ResourcePool:**
```typescript
export interface ResourcePool {
  credits: number;
  minerals: number;
  fuel: number;
  food: number;
  energy: number;
}
```

### Data Relationships

```
GameState
├─ planets: Map<string, Planet>
│  └─ Planet.garrisonedPlatoons → Platoon IDs
│
├─ craft: Map<string, Craft>
│  └─ Craft.loadedPlatoons → Platoon IDs
│  └─ Craft.targetPlanetId → Planet ID
│
└─ platoons: Map<string, Platoon>
   └─ Platoon.locationPlanetId → Planet ID
   └─ Platoon.locationCraftId → Craft ID
```

**Referential Integrity Rules:**
- Platoons MUST exist in exactly one location: `locationPlanetId` XOR `locationCraftId`
- Craft navigating to planets MUST have valid `targetPlanetId`
- Planet garrisons MUST contain valid Platoon IDs
- Orphaned entities (no owner, no location) are considered data corruption

---

## API Contracts (Supabase Schema)

### Database Tables

**saves:**
```sql
CREATE TABLE saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  data BYTEA NOT NULL, -- Compressed GameState (GZip)
  checksum VARCHAR(64) NOT NULL, -- SHA256 hash

  campaign_name VARCHAR(100),
  turn_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saves_user_id ON saves(user_id);
CREATE INDEX idx_saves_updated_at ON saves(updated_at DESC);
```

**user_profiles:**
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Settings
  ui_scale VARCHAR(10) DEFAULT '100%', -- '100%', '125%', '150%'
  high_contrast_mode BOOLEAN DEFAULT FALSE,
  audio_enabled BOOLEAN DEFAULT TRUE,
  music_volume INTEGER DEFAULT 70, -- 0-100
  sfx_volume INTEGER DEFAULT 80 -- 0-100
);
```

**scenario_completions:**
```sql
CREATE TABLE scenario_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  scenario_id VARCHAR(50) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_time_seconds INTEGER,
  completed_at TIMESTAMPTZ,

  attempts INTEGER DEFAULT 0,
  best_time_seconds INTEGER
);

CREATE INDEX idx_scenario_user ON scenario_completions(user_id, scenario_id);
```

### Row Level Security (RLS) Policies

```sql
-- Users can only access their own saves
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saves"
  ON saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saves"
  ON saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saves"
  ON saves FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saves"
  ON saves FOR DELETE
  USING (auth.uid() = user_id);

-- Similar policies for user_profiles and scenario_completions
```

### Supabase Edge Functions (Optional - Post-MVP)

**Leaderboards:**
```typescript
// supabase/functions/leaderboard/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { scenarioId } = await req.json();

  const { data, error } = await supabase
    .from('scenario_completions')
    .select('user_id, username, best_time_seconds')
    .eq('scenario_id', scenarioId)
    .order('best_time_seconds', { ascending: true })
    .limit(100);

  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## Security Architecture

### Authentication Strategy

**MVP:**
- **Supabase Auth** with email/password
- Email verification required before save access
- Password reset via magic link (15-minute expiration)

**Post-MVP:**
- OAuth providers (Google, GitHub, Discord)
- Two-factor authentication (TOTP)

**Session Management:**
- HTTP-only cookies (Supabase handles)
- Auto-refresh tokens (1 hour expiration, 7-day refresh window)
- Logout invalidates refresh token

### Data Protection

**At Rest:**
- Supabase PostgreSQL encryption (AES-256) - managed by Supabase
- Save game data compressed (GZip) before storage
- Checksum validation (SHA256) prevents data corruption

**In Transit:**
- All communication over HTTPS/TLS 1.3 (enforced by Vercel + Supabase)
- Supabase API keys stored in environment variables (never committed)
- Content Security Policy (CSP) headers prevent XSS

**Environment Variables:**
```bash
# .env.local (NEVER commit to repo)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Input Validation

**Client-Side (TypeScript):**
```typescript
// Validate scenario JSON before loading
export function validateScenarioSchema(json: any): json is ScenarioDefinition {
  return (
    typeof json.scenario_id === 'string' &&
    typeof json.name === 'string' &&
    ['tutorial', 'tactical'].includes(json.type) &&
    json.initial_state !== undefined &&
    json.victory_conditions !== undefined
  );
}
```

**Server-Side (Supabase):**
- Row Level Security (RLS) policies enforce user ownership
- Check constraints on database columns (e.g., `ui_scale IN ('100%', '125%', '150%')`)
- Supabase Edge Functions validate API requests

### Privacy & GDPR Compliance

**Data Collection:**
- Email (required for authentication)
- Username (public, user-chosen)
- Save games (private, user-owned)
- Scenario completion history (private, user-owned)

**Data NOT Collected:**
- No IP address logging
- No third-party analytics (until explicitly added post-MVP)
- No behavioral tracking beyond game telemetry

**User Rights:**
- **Right to Access:** Download all save data via Supabase dashboard
- **Right to Deletion:** Account deletion cascades to all user data (RLS enforced)
- **Right to Portability:** Save games exportable as JSON

---

## Performance Considerations

### Frame Rate Optimization

**Target:** 60 FPS desktop, 30 FPS mobile

**Strategies:**
1. **Object Pooling:** Reuse Phaser GameObjects instead of creating/destroying
2. **Texture Atlases:** Combine sprites into single atlas (reduce draw calls)
3. **Culling:** Don't render off-screen entities
4. **Lazy Updates:** Only update UI when game state changes (not every frame)

**Example:**
```typescript
// ❌ BAD: Creating new text every frame
update() {
  this.turnText.destroy();
  this.turnText = this.add.text(10, 10, `Turn ${this.turn}`);
}

// ✅ GOOD: Update existing text only when turn changes
onTurnEnded(turn: number) {
  this.turnText.setText(`Turn ${turn}`);
}
```

### Asset Loading Performance

**Metrics:**
- Initial load: <5 seconds (target <3 seconds)
- On-demand asset load: <500ms per asset
- Scenario load: <2 seconds

**Techniques:**
- Webpack code splitting (chunk per scene)
- Lazy load textures/audio (don't block initial load)
- Brotli compression (smaller asset sizes)
- CDN caching (Vercel Edge Network)

### Memory Management

**Budget:**
- Desktop: <500 MB total
- Mobile: <200 MB total

**Monitoring:**
```typescript
// Log memory usage in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const memory = (performance as any).memory;
    if (memory) {
      Logger.debug('Performance', `Memory: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`);
    }
  }, 10000); // Every 10 seconds
}
```

### Network Optimization

**Supabase API Calls:**
- Batch read operations where possible
- Cache user profile locally (only fetch on login)
- Debounce save operations (don't save every turn, save on manual save or exit)

**Save/Load Performance:**
```typescript
// Save compression example
const saveData = SaveSystem.createSaveData(gameState);
const compressed = pako.gzip(JSON.stringify(saveData)); // GZip compression
// Typical save: 50 KB compressed (from ~200 KB uncompressed)
```

---

## Deployment Architecture

### Hosting (Vercel)

**Configuration:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

**Deployment Flow:**
1. Push to `main` branch → Automatic production deploy
2. Push to feature branch → Preview deployment (shareable URL)
3. Pull request → Preview deploy with unique URL

### Backend (Supabase)

**Configuration:**
- **Free Tier Limits:**
  - 500 MB database storage
  - 500 concurrent connections
  - 2 GB file storage (for scenario packs post-MVP)
  - 5 GB bandwidth/month

- **Upgrade Path (Post-MVP):**
  - Pro Tier: $25/month (8 GB database, 50 GB bandwidth)
  - Trigger on: 10,000+ monthly active users OR storage >400 MB

### CI/CD Pipeline

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Quality Gates:**
- All tests must pass
- Code coverage must be ≥70%
- TypeScript compilation must succeed with zero errors
- ESLint warnings allowed, errors block deploy

---

## Development Environment

### Prerequisites

**Required:**
- Node.js 20+ LTS (22.x recommended)
- npm 10+ or pnpm 9+
- Git 2.40+
- Modern browser (Chrome 90+, Firefox 88+)

**Recommended:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript + JavaScript Language Features
  - Phaser Editor (optional, for scene editing)

### Setup Commands

```bash
# Clone repository
git clone https://github.com/venomous/overlord.git
cd overlord/Overlord.Phaser

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server (http://localhost:8080)
npm start

# Run tests
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Build for production
npm run build

# Type-check (without building)
npm run typecheck
```

### Environment Setup

```bash
# .env.example (commit this to repo)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# .env.local (DO NOT commit - add to .gitignore)
# Copy .env.example and fill in real values
```

### Development Workflow

1. **Start dev server:** `npm start` (hot reload enabled)
2. **Make changes:** Edit TypeScript files in `src/`
3. **Auto-refresh:** Browser reloads on save (2-second cycle)
4. **Run tests:** `npm run test:watch` in separate terminal
5. **Commit:** `git commit` (pre-commit hook runs ESLint + Prettier)

---

## Architecture Decision Records (ADRs)

### ADR-001: Migrate from Unity to Phaser 3

**Date:** 2025-11 (estimated)
**Status:** Accepted
**Context:** Unity 6000 + C# proved incompatible with Claude Code AI-assisted development workflows.
**Decision:** Migrate to Phaser 3 + TypeScript for browser-based deployment and AI compatibility.
**Consequences:**
- ✅ Zero-friction iteration (2-second edit → refresh cycle)
- ✅ Platform-agnostic testing (no editor required, 1,272 tests run in ~10 seconds)
- ✅ Web-first deployment (instant access, no downloads)
- ❌ Loss of Unity's 3D rendering capabilities (mitigated by 2D/isometric sprites)
- ❌ Loss of native mobile app support (mitigated by responsive web design)

### ADR-002: Use Supabase for Backend

**Date:** 2025-12-09
**Status:** Accepted
**Context:** Need cloud persistence, authentication, and cross-device sync. Options: Supabase, Firebase, AWS Amplify, custom backend.
**Decision:** Use Supabase for PostgreSQL backend, authentication, and real-time subscriptions.
**Consequences:**
- ✅ Generous free tier (500 MB database, 500 connections)
- ✅ Built-in authentication (email/password, OAuth)
- ✅ Row Level Security (RLS) for data protection
- ✅ Real-time subscriptions (optional for multiplayer post-MVP)
- ❌ Vendor lock-in (mitigated by standard PostgreSQL underneath)
- ❌ Cold start latency on free tier (mitigated by Vercel Edge caching)

### ADR-003: TypeScript Path Aliases

**Date:** 2025-12-09
**Status:** Accepted
**Context:** Deep import paths become unwieldy (`../../../core/GameState`). Need cleaner imports for AI-assisted development.
**Decision:** Use TypeScript path aliases (`@core/*`, `@scenes/*`, `@services/*`).
**Consequences:**
- ✅ Cleaner imports: `import { GameState } from '@core/GameState'`
- ✅ Easier refactoring (move files without breaking imports)
- ✅ Better IDE autocomplete
- ❌ Requires Webpack alias configuration (already done)

### ADR-004: Platform-Agnostic Core Architecture

**Date:** 2025-11 (estimated)
**Status:** Accepted
**Context:** Game logic should be independent of rendering engine to support future platform changes.
**Decision:** Separate `src/core/` (zero Phaser dependencies) from `src/scenes/` (Phaser rendering).
**Consequences:**
- ✅ Core systems portable to any rendering engine (Unity, Godot, React Native, etc.)
- ✅ 93.78% test coverage possible (Core testable without Phaser)
- ✅ Easier to swap rendering engines if needed
- ❌ Additional abstraction layer (mitigated by event-driven communication)

### ADR-005: Flash Conflicts as Dual-Purpose System

**Date:** 2025-12-09
**Status:** Accepted
**Context:** Need both tutorial system for onboarding AND quick-play mode for experienced players.
**Decision:** Build single JSON-driven Flash Conflicts system serving both purposes.
**Consequences:**
- ✅ Reduced development effort (one system, two use cases)
- ✅ Scenarios reusable for tutorials and quick-play
- ✅ Data-driven (easy to create new scenarios without code changes)
- ❌ Tutorial scenarios must be designed carefully to teach AND be fun

---

## Executive Summary

**Overlord Game Architecture** defines the technical foundation for a browser-based 4X strategy game built with **Phaser 3 + TypeScript**, deployed on **Vercel Edge Network**, with **Supabase PostgreSQL** backend.

**Key Architectural Principles:**

1. **Platform-Agnostic Core:** Game logic (`src/core/`) has zero rendering dependencies, enabling portability to any platform while maintaining 93.78% test coverage.

2. **AI-Assisted Development First:** Architecture explicitly optimized for Claude Code workflows with 2-second edit → refresh cycles, comprehensive TypeScript strict mode, and path aliases for clarity.

3. **Novel Patterns:** Flash Conflicts system unifies tutorials and quick-play into single JSON-driven feature. Scenario Packs enable data-driven enemy faction hot-swapping without code changes.

4. **Event-Driven Communication:** Core systems fire callbacks, Phaser scenes subscribe. Uni-directional communication prevents coupling while enabling clean separation.

5. **Performance Targets:** 60 FPS desktop (WebGL 2.0), 30 FPS mobile (Canvas fallback), <5 second load time, >99.9% save/load success rate.

**Technology Stack:** Phaser 3.90.0, TypeScript 5.x strict mode, Webpack 5, Jest (1,272 tests), Supabase SDK 2.86.2, Vercel Edge deployment.

**Security:** Supabase Auth (bcrypt passwords), HTTPS/TLS 1.3, Row Level Security policies, encrypted data at rest, GDPR-compliant data handling.

**Deployment:** Automatic Vercel deploys on push to `main`, preview deploys per PR, CI/CD with GitHub Actions, quality gates (tests, coverage, TypeScript compilation).

This architecture enables consistent AI-assisted implementation across all epics while maintaining flexibility for future platform expansion.

---

_Generated by BMAD Game Architecture Workflow v1.3.2_
_Date: 2025-12-09_
_For: Venomous_
_Project: Overlord (Phaser 3 + TypeScript Remake)_
