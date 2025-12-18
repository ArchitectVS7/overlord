# Overlord Design Documentation

This folder contains all design documentation for the Overlord 4X strategy game remake.

## Quick Navigation

| I need to... | Go to |
|--------------|-------|
| Set up my development environment | [for-developers/setup/](for-developers/setup/) |
| Understand the architecture | [for-developers/architecture/](for-developers/architecture/) |
| Learn coding patterns | [for-developers/patterns/](for-developers/patterns/) |
| Test the game (alpha tester) | [for-testers/](for-testers/) |
| Check project status | [for-managers/](for-managers/) |
| Find JSON schemas & specs | [specifications/](specifications/) |
| See active sprint work | [sprint-artifacts/](sprint-artifacts/) |

## Project Status

| Metric | Value |
|--------|-------|
| **Epics Complete** | 9 of 12 |
| **Stories Done** | 38 of 48 |
| **Test Coverage** | 93%+ |
| **Core Systems** | 34+ implemented |
| **UI Components** | 28 implemented |

### Remaining Work

| Epic | Name | Status | Blockers |
|------|------|--------|----------|
| 8 | Quick-Play Tactical Scenarios | Backlog | Human input needed for scenario design |
| 10 | User Accounts & Persistence | Backlog | Supabase setup required |
| 12 | Audio & Atmospheric Immersion | In-Progress | 12-1, 12-2 need audio assets |

## Folder Structure

```
design-docs/
├── for-developers/          # Technical documentation
│   ├── architecture/        # System design, core systems reference
│   ├── setup/               # Getting started, deployment guide
│   ├── patterns/            # Coding patterns, git workflow
│   └── reference/           # Adjustable variables, naming conventions
│
├── for-testers/             # QA and alpha testing
│   ├── alpha-tester-guide.md
│   ├── uat-methodology.md
│   └── testing-procedures.md
│
├── for-managers/            # Project management
│   ├── prd.md               # Product Requirements Document
│   ├── sprint-status.yaml   # Current sprint status
│   ├── ux-roadmap.md        # UX improvements priority
│   └── release-notes/       # Version history
│
├── specifications/          # Technical specifications
│   ├── art-master-spec.md   # Asset generation guide
│   ├── scenario-pack-schema.md
│   ├── admin-mode-spec.md   # Admin UI editor
│   └── asset-spec-package.md
│
├── sprint-artifacts/        # Sprint planning & stories
│   ├── active/              # In-progress/blocked stories
│   ├── archive/             # Completed stories by epic
│   ├── epics.md             # Epic definitions
│   └── sprint-status.yaml
│
├── diagrams/                # Visual diagrams
│
└── archive/                 # Historical documentation
    ├── dev-manual-v1/       # Original 3-volume dev manual
    └── HUMAN-TASKS-REQUIRED.md
```

## Key Documents

| Document | Location | Description |
|----------|----------|-------------|
| **PRD** | [for-managers/prd.md](for-managers/prd.md) | Product requirements, user journeys, innovations |
| **Architecture** | [for-developers/architecture/system-overview.md](for-developers/architecture/system-overview.md) | Technical architecture, ADRs |
| **Getting Started** | [for-developers/setup/getting-started.md](for-developers/setup/getting-started.md) | Development setup |
| **Deployment** | [for-developers/setup/deployment-guide.md](for-developers/setup/deployment-guide.md) | Vercel + Supabase deployment |
| **Core Systems** | [for-developers/architecture/core-systems-reference.md](for-developers/architecture/core-systems-reference.md) | All 34+ game systems |

## Recent Updates

- **2025-12-18:** Documentation reorganized by audience/role
- **2025-12-18:** Added Admin UI Editor and Star Rating to PRD
- **2025-12-16:** Admin UI Editor mode implemented
- **2025-12-11:** Epic 9 (Scenario Packs) completed

## Contributing

See [for-developers/patterns/git-workflow.md](for-developers/patterns/git-workflow.md) for contribution guidelines.
