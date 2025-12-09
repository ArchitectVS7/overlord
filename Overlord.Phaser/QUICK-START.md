# Quick Start Guide - Overlord Phaser Migration

## 🚀 For New Contributors

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- VS Code (recommended)

### First Time Setup

```bash
# Clone repository
git clone <repo-url>
cd Overlord/Overlord.Phaser

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start dev server
npm start
```

Browser opens at http://localhost:8080 showing the galaxy map.

---

## 📁 Project Structure Quick Reference

```
Overlord.Phaser/
├── src/
│   ├── core/              # Platform-agnostic game logic
│   │   ├── models/        # Data models (Position3D, etc.)
│   │   ├── GameState.ts   # Central game state
│   │   └── *System.ts     # Game systems (18 total)
│   ├── scenes/            # Phaser scenes
│   │   ├── BootScene.ts
│   │   └── GalaxyMapScene.ts
│   ├── config/            # Configuration
│   └── main.ts            # Entry point
├── tests/
│   ├── unit/              # Unit tests per system
│   └── integration/       # Integration tests
├── MIGRATION-PLAN.md      # Full migration plan
└── MIGRATION-TRACKER.md   # Daily progress tracking
```

---

## 🎯 Current Status

**Phase:** 1/9 Complete (Foundation) ✅
**Systems Ported:** 2/18 (11%)
**Tests:** 47 passing, 100% coverage
**Next Up:** Phase 2 - Economy Systems

---

## 💻 Common Commands

```bash
# Development
npm start              # Dev server (hot reload)
npm test               # Run all tests
npm run test:watch     # Watch mode for TDD
npm run test:coverage  # Coverage report
npm run build          # Production build

# Code Quality
npm run lint           # ESLint check
npx tsc --noEmit       # TypeScript check
```

---

## 📝 Contributing to Migration

### Before Starting a System

1. Read `MIGRATION-PLAN.md` for the full plan
2. Check `MIGRATION-TRACKER.md` for current status
3. Find the system in `Overlord.Core/Overlord.Core/<System>.cs`
4. Review existing C# tests in `Overlord.Core.Tests/`

### Porting Workflow

1. **Port Model** (if needed)
   - Create TypeScript interface/class in `src/core/models/`
   - Match C# properties exactly
   - Add JSDoc comments

2. **Port System**
   - Create `src/core/<System>.ts`
   - Match C# method signatures
   - Use TypeScript types (no `any`)
   - Add JSDoc comments

3. **Write Tests**
   - Create `tests/unit/<System>.test.ts`
   - Port C# tests from `Overlord.Core.Tests/`
   - Target 70%+ coverage
   - Run: `npm test -- <System>.test.ts`

4. **Integrate with Phaser** (if applicable)
   - Update `GalaxyMapScene.ts` for rendering
   - Add UI elements as needed
   - Test in browser: `npm start`

5. **Update Tracker**
   - Mark system complete in `MIGRATION-TRACKER.md`
   - Update test count and coverage
   - Note any blockers or issues

### Code Standards

- **TypeScript Strict Mode:** Enabled (no `any`, `unknown` preferred)
- **Naming:** camelCase for methods, PascalCase for classes
- **Testing:** 70%+ coverage required
- **Comments:** JSDoc for public APIs
- **Formatting:** Prettier (auto-format on save)

---

## 🧪 Testing Philosophy

### Test Pyramid
- 70% Unit tests (fast, isolated)
- 20% Integration tests (system interactions)
- 10% E2E tests (full game scenarios)

### Example Test

```typescript
import { ResourceSystem } from '@core/ResourceSystem';
import { GameState } from '@core/GameState';

describe('ResourceSystem', () => {
  let gameState: GameState;
  let resourceSystem: ResourceSystem;

  beforeEach(() => {
    gameState = new GameState();
    resourceSystem = new ResourceSystem(gameState);
  });

  it('should add resources correctly', () => {
    const planet = gameState.planets[0];
    resourceSystem.addResources(planet.id, {
      credits: 100,
      minerals: 50
    });

    expect(planet.resources.credits).toBe(100);
    expect(planet.resources.minerals).toBe(50);
  });
});
```

---

## 🔍 Finding Things

### Where to find...

**C# source code:**
- `../../Overlord.Core/Overlord.Core/<System>.cs`

**C# tests:**
- `../../Overlord.Core.Tests/Overlord.Core.Tests/<System>Tests.cs`

**Design docs:**
- `../../design-docs/v1.0/afs/AFS-<number>-<system>.md`

**Migration plan:**
- `./MIGRATION-PLAN.md`

**Current progress:**
- `./MIGRATION-TRACKER.md`

---

## 🐛 Common Issues

### Issue: Tests failing with module not found
**Solution:** Check path aliases in `tsconfig.json` and `jest.config.js`

### Issue: TypeScript errors in Phaser code
**Solution:** `npm install --save-dev @types/phaser`

### Issue: Dev server won't start
**Solution:** Kill existing process, clear `node_modules`, run `npm install`

### Issue: Coverage below 70%
**Solution:** Add more test cases, especially edge cases

---

## 📚 Key Resources

### Internal Docs
- [Migration Plan](./MIGRATION-PLAN.md) - Full 9-phase plan
- [Migration Tracker](./MIGRATION-TRACKER.md) - Daily progress
- [README](./README.md) - Project overview

### External Docs
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Docs](https://jestjs.io/docs/getting-started)

### C# Reference
- `Overlord.Core/` - All game systems (C# source)
- `Overlord.Core.Tests/` - 328 C# tests to port

---

## 🎮 Playing the Game

**Current Build:**
- Galaxy map with 5 planets
- Seed 42 (deterministic)
- Debug panel (top-left)

**Controls:**
- None yet (Phase 1 is rendering only)

**Coming Soon (Phase 2+):**
- Click planets to select
- Resource management
- Turn advancement
- Combat

---

## 📞 Getting Help

**Stuck on something?**
1. Check `MIGRATION-PLAN.md` for context
2. Review C# source in `Overlord.Core/`
3. Look at existing TypeScript systems as examples
4. Check tests in `tests/unit/` for patterns

**Found a bug?**
1. Check if it's in the tracker already
2. Add to "Active Issues" in `MIGRATION-TRACKER.md`
3. Create detailed repro steps

---

## ✅ Daily Workflow

### Morning
1. Pull latest code: `git pull`
2. Check tracker: Review `MIGRATION-TRACKER.md`
3. Install deps: `npm install` (if needed)
4. Run tests: `npm test` (should all pass)

### During Work
1. Start dev server: `npm start`
2. Run tests in watch mode: `npm run test:watch`
3. Code and test iteratively
4. Check coverage: `npm run test:coverage`

### End of Day
1. Run full test suite: `npm test`
2. Build production: `npm run build`
3. Update tracker: Note progress in `MIGRATION-TRACKER.md`
4. Commit: `git commit -m "feat: port ResourceSystem"`

---

**Happy Migrating! 🚀**

Questions? Check `MIGRATION-PLAN.md` or ask the team!
