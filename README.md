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
| [PRD](./design-docs/artifacts/prd.md) | Product Requirements Document - all 55 functional requirements |
| [Architecture](./design-docs/artifacts/game-architecture.md) | Technical architecture, ADRs, platform decisions |
| [Epics & Stories](./design-docs/artifacts/epics.md) | All 12 epics with 52 user stories and acceptance criteria |

### For Development

| Document | Description |
|----------|-------------|
| [Sprint Status](./design-docs/artifacts/sprint-artifacts/sprint-status.yaml) | Current epic/story status with implementation tags |
| [Implementation Readiness](./design-docs/artifacts/implementation-readiness-report-2025-12-09.md) | Pre-implementation validation report |
| [Wireframes](./design-docs/artifacts/diagrams/wireframe-overlord-prototype-20251209.excalidraw) | UI wireframes (Excalidraw format) |

### Legacy Reference

| Directory | Description |
|-----------|-------------|
| [C64-remake/](./C64-remake/) | Original Commodore 64 version (archive - DO NOT EDIT) |
| [MS-Dos/](./MS-Dos/) | Original MS-DOS version (archive - DO NOT EDIT) |
| [analysis/](./analysis/) | Decompiled source code for reference |
| [Overlord.Core/](./Overlord.Core/) | Legacy C# implementation (reference only) |

## Recommended Epic Order

Development should follow this sequence to maximize existing code reuse:

### Phase A: Core Gameplay Loop
1. **Epic 11** (11-1, 11-3 only) - Input system foundation
2. **Epic 3** - Planet selection and info panels
3. **Epic 2** - Campaign setup and turn flow
4. **Epic 4** - Economy management UI
5. **Epic 5** - Military forces UI
6. **Epic 6** - Combat resolution UI
7. **Epic 7** - AI notifications (core logic already complete)

### Phase B: Onboarding & Content
8. **Epic 1** - Flash Conflicts (tutorials)
9. **Epic 8** - Tactical Scenarios (quick-play)
10. **Epic 9** - Scenario Packs (content variety)

### Phase C: Polish & Platform
11. **Epic 10** - User accounts & cloud saves
12. **Epic 11** (remaining) - Full accessibility
13. **Epic 12** - Audio & immersion

**Story Execution Flow**
  1. Review sprint-status.yaml for complete tracking structure
  2. Start first story - Use /bmad:bmm:workflows:create-story to draft Story X.Y
  3. Mark story ready - Use /bmad:bmm:workflows:story-ready to move drafted story to ready-for-dev
  4. Implement story - Use /bmad:bmm:workflows:dev-story to develop and test the story
  5. Review and complete - Use /bmad:bmm:workflows:code-review and /bmad:bmm:workflows:story-done

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

## Implementation Status by Epic

| Epic | Stories | Core Done | UI Done | Priority |
|------|---------|-----------|---------|----------|
| 1: Onboarding | 6 | 0 | 0 | Phase B |
| 2: Campaign | 5 | 3 | 0 | HIGH |
| 3: Galaxy | 3 | 1 | 0 | HIGH |
| 4: Economy | 4 | 3 | 0 | MEDIUM |
| 5: Military | 5 | 4 | 0 | MEDIUM |
| 6: Combat | 3 | 3 | 0 | MEDIUM |
| 7: AI | 2 | 2 | 0 | MEDIUM |
| 8: Scenarios | 1 | 0 | 0 | Phase B |
| 9: Packs | 3 | 0 | 0 | Phase B |
| 10: Accounts | 7 | 2 | 0 | Phase C |
| 11: Accessibility | 8 | 0 | 0 | CRITICAL |
| 12: Audio | 5 | 0 | 0 | Phase C |

**Legend:**
- Core Done = TypeScript game logic implemented
- UI Done = Phaser scenes implemented
- See [sprint-status.yaml](./design-docs/artifacts/sprint-artifacts/sprint-status.yaml) for detailed story status

## BMAD Workflows

This project uses the BMAD methodology for structured development. Key commands:

```bash
# Check current workflow status
/bmad:bmm:workflows:workflow-status

# Create a new story from epics
/bmad:bmm:workflows:create-story

# Mark story ready for development
/bmad:bmm:workflows:story-ready

# Implement a story
/bmad:bmm:workflows:dev-story

# Code review a completed story
/bmad:bmm:workflows:code-review

# Mark story as done
/bmad:bmm:workflows:story-done
```

## License

This project is a fan remake for educational and preservation purposes.

Original game by Probe Software (1990).
