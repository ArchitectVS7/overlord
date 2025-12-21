# Overlord

A modern web-based remake of the classic 4X strategy game "Overlord" (also known in the UK as "Supremacy") from the late 1980s/early 1990s. Command your galactic empire, manage planetary economies, build military forces, and conquer the galaxy.

## About the Game

**Overlord** is a turn-based space strategy game where you:

- **Explore** a procedurally generated galaxy 
- **Expand** your empire by colonizing neutral worlds and conquering enemies
- **Exploit** planetary resources to build your fleet and grow your economy 
- **Exterminate** AI opponents with distinct personalities and strategies

**Key Features:**
- Browser-based gameplay (desktop & mobile)
- Flash Conflicts: 5-15 minute tutorial and tactical scenarios
- Campaign Mode: Full galactic conquest
- AI with 4 personality types and 3 difficulty levels

## Project Status

| Milestone | Status |
|-----------|--------|
| Core Game Logic | 95% Complete (32 TypeScript systems) |
| Phaser UI Layer | 95% Complete (37 UI panels) |
| Test Coverage | 1329 passing tests |
| Implementation Phase | Near Feature-Complete |

See [ROADMAP.md](./ROADMAP.md) for detailed status and remaining work.

## Local Install 

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

## How to Play - Quick Start

### Objective
Conquer the galaxy by capturing all enemy planets or eliminating all enemy forces. You command a fledgling space empire in a galaxy of 4-6 planets, competing against an AI opponent for galactic supremacy.

### Turn Sequence
Each turn consists of four phases:

| Phase | What Happens |
|-------|--------------|
| **Income** | Resources generate from buildings, population grows, morale updates |
| **Action** | You build structures, purchase spacecraft, train troops, and issue orders |
| **Combat** | All battles (space and ground) resolve simultaneously |
| **End** | Buildings complete construction, victory conditions are checked |

### Victory & Defeat
- **Victory**: Capture all enemy planets OR destroy all enemy forces
- **Defeat**: Lose all your planets OR lose all your spacecraft

### Your First Turn
1. **Check your home planet** - Note your starting resources (Credits, Minerals, Fuel, Food, Energy)
2. **Build infrastructure** - Start a Mining Station (produces Minerals + Fuel) or Horticultural Station (produces Food)
3. **Consider expansion** - If you can afford an Atmosphere Processor (10,000 Cr / 5,000 Min / 2,000 Fuel), send it to colonize a neutral planet
4. **End your turn** - Click "End Turn" or press Space/Enter to advance

**Tip**: Focus on economy early. Build Mining Stations on Volcanic planets (5x mineral bonus) and Horticultural Stations on Tropical planets (2x food bonus).

For comprehensive rules and strategies, see the [User Manual](USER_MANUAL.md).

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

