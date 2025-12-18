# Developer Documentation

Technical documentation for developers working on the Overlord codebase.

## Quick Start

1. **New to the project?** Start with [setup/getting-started.md](setup/getting-started.md)
2. **Understanding the code?** Read [architecture/system-overview.md](architecture/system-overview.md)
3. **Making changes?** Follow [patterns/git-workflow.md](patterns/git-workflow.md)

## Contents

### [architecture/](architecture/)
System design and core components:
- `system-overview.md` - High-level architecture, ADRs, integration patterns
- `core-systems-reference.md` - All 34+ game systems explained

### [setup/](setup/)
Getting started and deployment:
- `getting-started.md` - Development environment setup
- `deployment-guide.md` - Vercel + Supabase deployment

### [patterns/](patterns/)
Development practices:
- `git-workflow.md` - Git, PRs, and issue management
- `scenario-authoring.md` - Creating Flash Conflict scenarios

### [reference/](reference/)
Technical reference:
- `adjustable-variables.md` - Gameplay tuning parameters

## Key Commands

```bash
# From Overlord.Phaser/ directory
npm start              # Dev server at localhost:8080
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run build          # Production build
```

## Architecture Overview

```
Overlord.Phaser/src/
├── core/              # Platform-agnostic game logic (NO Phaser imports)
│   ├── models/        # Data models
│   └── *System.ts     # 34+ game systems
├── scenes/            # Phaser rendering layer
│   ├── ui/            # 28 UI panel components
│   └── renderers/     # Visual utilities
├── services/          # External integrations (Supabase, Auth)
└── config/            # Configuration
```

**Critical Rule:** `src/core/` must have zero Phaser dependencies.
