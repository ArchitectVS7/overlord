# Overlord Developer's Manual

**Project:** Overlord - Classic 4X Strategy Game Remake
**Version:** 1.0.0
**Date:** December 2025
**Maintainer:** Project Team

---

## About This Manual

This three-volume developer's manual provides comprehensive documentation for the Overlord game remake project. Whether you're a new contributor, maintainer, or planning to fork the project, these volumes contain everything you need to understand, extend, and operate the game.

---

## Manual Structure

### [Volume I: Technical Reference Manual](volume-1-technical-reference/README.md)

**Purpose:** Complete technical reference for the existing implementation
**Audience:** Developers who need to understand how the game works
**Contents:**
- Core architecture and system design
- All 18 game systems explained in detail
- Data models and state management
- Phaser integration patterns
- Testing strategies and coverage
- Build system and tooling

### [Volume II: Development Guide & Open Items](volume-2-development-guide/README.md)

**Purpose:** Specifications and guides for remaining development work
**Audience:** Contributors working on incomplete features
**Contents:**
- Remaining work breakdown (Epic 1, 8, 9, 10, 12)
- Human tasks required (content creation, assets, configuration)
- Implementation guides with step-by-step instructions
- Best practices and coding patterns
- Free tools and resources
- Asset creation workflows

### [Volume III: Future Expansion & Operations](volume-3-expansion-operations/README.md)

**Purpose:** Long-term planning and operational guidance
**Audience:** Project leads, maintainers, community managers
**Contents:**
- Alpha/beta testing procedures
- Player feedback management
- Performance scaling strategies
- Release strategies (open source vs commercial)
- Cross-platform deployment options
- Sequel and expansion planning
- Community management
- Monetization approaches

---

## Quick Navigation

### For New Contributors
1. Read [Volume I - Getting Started](volume-1-technical-reference/01-getting-started.md)
2. Review [Volume I - Architecture Overview](volume-1-technical-reference/02-architecture-overview.md)
3. Check [Volume II - Open Items](volume-2-development-guide/01-open-items-overview.md)
4. Pick a task from [Volume II - Task Backlog](volume-2-development-guide/02-task-backlog.md)

### For System Understanding
1. See [Volume I - Core Systems Reference](volume-1-technical-reference/03-core-systems-reference.md)
2. Review [Volume I - Phaser Integration](volume-1-technical-reference/04-phaser-integration.md)
3. Study [Volume I - Testing Guide](volume-1-technical-reference/06-testing-guide.md)

### For Content Creators
1. Read [Volume II - Content Creation Guide](volume-2-development-guide/05-content-creation-guide.md)
2. See [Volume II - Audio Assets](volume-2-development-guide/06-audio-assets.md)
3. Check [Volume II - Scenario Authoring](volume-2-development-guide/03-scenario-authoring.md)

### For Operations & Scaling
1. See [Volume III - Testing Procedures](volume-3-expansion-operations/01-testing-procedures.md)
2. Review [Volume III - Scaling Strategies](volume-3-expansion-operations/03-scaling-strategies.md)
3. Check [Volume III - Release Planning](volume-3-expansion-operations/04-release-strategies.md)

---

## Project Context

**Overlord** is a browser-based remake of the classic 1990 4X strategy game. Key characteristics:

- **Tech Stack:** Phaser 3 + TypeScript (platform-agnostic core)
- **Deployment:** Vercel Edge + Supabase PostgreSQL
- **Test Coverage:** 835 tests, 93%+ coverage
- **Architecture:** Event-driven, zero rendering dependencies in core
- **Development Style:** AI-assisted (Claude Code compatible)

**Current Status (December 2025):**
- 7 of 12 epics complete
- Core gameplay loop functional
- Combat system implemented
- AI opponent active
- Remaining: Tutorials, scenarios, cloud saves, audio

---

## Documentation Standards

All documentation in this manual follows these principles:

1. **Code Examples:** Executable, tested snippets with comments
2. **Diagrams:** Mermaid-based architecture and flow diagrams
3. **Cross-References:** Explicit links between volumes and sections
4. **Versioning:** Manual updated with each major release
5. **Practical Focus:** How-to guides over abstract theory

**Terminology:**
- **Core Systems:** Platform-agnostic game logic in `src/core/`
- **Phaser Layer:** Rendering and UI in `src/scenes/`
- **Flash Conflicts:** Tutorial/quick-play tactical scenarios
- **Scenario Packs:** JSON-based AI/galaxy configurations

---

## Getting Help

**Documentation Issues:**
- File issue at project repository
- Tag with `documentation` label
- Suggest corrections or improvements

**Technical Questions:**
- Review relevant volume section first
- Check existing tests for examples
- Consult `CLAUDE.md` for AI-assisted development guidance

**Contributing:**
- See [Volume II - Contributing Guide](volume-2-development-guide/08-contributing-guide.md)
- Follow test-driven development (TDD) workflow
- Maintain 70%+ code coverage for new features

---

## Changelog

**v1.0.0 (December 2025)**
- Initial comprehensive manual created
- Volumes I, II, III published
- Covers all 18 core systems
- Documents remaining work (Epics 1, 8, 9, 10, 12)

---

## License & Attribution

**Game Code:** [Check repository LICENSE file]
**Manual Content:** Available under same license as source code
**Original Game:** Overlord (Supremacy) © 1990 C64/MS-DOS versions

---

**Last Updated:** December 11, 2025
**Next Review:** Q1 2026
