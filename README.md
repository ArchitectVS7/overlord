# Overlord

A modern web-based remake of the classic 4X strategy game "Overlord" (also known as "Supremacy") from the late 1980s/early 1990s. Command your galactic empire, manage planetary economies, build military forces, and conquer the galaxy.

## About the Game

**Overlord** is a turn-based space strategy game where you:

- **Explore** a procedurally generated galaxy with 4-6 planets
- **Expand** your empire by colonizing neutral worlds and conquering enemies
- **Exploit** planetary resources (Credits, Minerals, Fuel, Food, Energy) to build your economy
- **Exterminate** AI opponents with distinct personalities (Aggressive, Defensive, Economic, Balanced)

**Key Features:**
- Browser-based gameplay (desktop & mobile)
- Flash Conflicts: 5-15 minute tutorial and tactical scenarios
- Campaign Mode: Full galactic conquest
- AI with 4 personality types and 3 difficulty levels
- Save/load with cross-device sync (via Supabase)

## Project Status

| Milestone | Status |
|-----------|--------|
| Core Game Logic | 85% Complete (18 TypeScript systems) |
| Phaser UI Layer | 5% Complete |
| Test Coverage | 93.78% (304 tests) |
| Implementation Phase | Phase 4 - Active Development |

## Quick Start

```bash
# Clone and navigate
cd Overlord/Overlord.Phaser

# Install dependencies
npm install

# Start development server (http://localhost:8080)
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Documentation

### For Contributors

| Document | Description |
|----------|-------------|
| [CLAUDE.md](./CLAUDE.md) | AI assistant guidelines, architecture overview, development workflow |
| [PRD](./design-docs/prd.md) | Product Requirements Document - all 55 functional requirements |
| [Architecture](./design-docs/game-architecture.md) | Technical architecture, ADRs, platform decisions |
| [Epics & Stories](./design-docs/epics.md) | All 12 epics with 52 user stories and acceptance criteria |


## Architecture

```
Overlord.Phaser/src/core/     <- Platform-agnostic game logic (TypeScript)
    |                            NO Phaser dependencies
    |                            All 18 game systems
    v
Overlord.Phaser/src/scenes/   <- Phaser 3 presentation layer
                                 Rendering, input, UI only
                                 Subscribes to Core events
```

**Key Principle:** Game logic lives in `/core/`, never in scenes. Scenes only render and dispatch user input to Core systems.

