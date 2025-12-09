# Overlord Unity → Phaser Migration Plan

**Objective:** Systematic and deliberate migration of all 18 game systems from Unity/C# to Phaser/TypeScript

**Status:** Phase 1 Complete (2/18 systems) ✅

---

## 🎯 Migration Strategy

### Principles
1. **Dependency-driven order** - Port systems in dependency order
2. **Test-first approach** - Each system must have 70%+ test coverage before moving on
3. **Incremental integration** - Systems integrate with Phaser rendering as they're completed
4. **Quality gates** - No phase advances without passing all tests
5. **Documentation** - Each system documented as ported

### Quality Gates (Per System)
- ✅ Unit tests written (70%+ coverage)
- ✅ Integration tests pass
- ✅ Type safety verified (no `any` types)
- ✅ Phaser rendering working (where applicable)
- ✅ Performance validated (no regressions)

---

## 📊 System Dependency Analysis

```
Foundation Layer (Phase 1) ✅
├── GameState
├── GalaxyGenerator
└── Models (Position3D, Enums, PlanetEntity)

Economy Layer (Phase 2)
├── ResourceSystem ← GameState
├── IncomeSystem ← ResourceSystem, GameState
├── PopulationSystem ← GameState
└── TaxationSystem ← ResourceSystem, PopulationSystem

Turn Management (Phase 3)
├── TurnSystem ← GameState, ResourceSystem, IncomeSystem
└── SaveSystem ← GameState (all models)

Entity Layer (Phase 4)
├── EntitySystem ← GameState
├── CraftSystem ← EntitySystem, GameState, ResourceSystem
└── PlatoonSystem ← EntitySystem, GameState, ResourceSystem

Infrastructure Layer (Phase 5)
├── BuildingSystem ← GameState, ResourceSystem
├── UpgradeSystem ← GameState, ResourceSystem
└── DefenseSystem ← GameState, BuildingSystem

Navigation Layer (Phase 6)
└── NavigationSystem ← GameState, CraftSystem, GalaxyGenerator

Combat Layer (Phase 7)
├── CombatSystem ← GameState, PlatoonSystem, ResourceSystem
├── SpaceCombatSystem ← GameState, CraftSystem, ResourceSystem
├── BombardmentSystem ← GameState, CraftSystem, DefenseSystem
└── InvasionSystem ← GameState, CombatSystem, PlatoonSystem

AI Layer (Phase 8)
└── AIDecisionSystem ← ALL economic + entity + combat systems

Integration Layer (Phase 9)
└── Full game loop, UI, optimization
```

---

## 🚀 Migration Phases

### ✅ Phase 1: Foundation (COMPLETE)
**Duration:** Day 1 (Complete)
**Systems:** 2/18

**Completed:**
- ✅ GameState (minimal subset)
- ✅ GalaxyGenerator (with seeded RNG)
- ✅ Position3D model
- ✅ Enums (FactionType, PlanetType, Difficulty)
- ✅ PlanetEntity interface
- ✅ Basic Phaser rendering (5 planets as rectangles)

**Test Coverage:** 100% (47 tests passing)

**Deliverables:**
- ✅ Project scaffolded (Webpack, TypeScript, Jest)
- ✅ Dev server running (http://localhost:8080)
- ✅ Galaxy generation deterministic (seed 42)
- ✅ README.md created

---

### 🔄 Phase 2: Core Economy Systems
**Duration:** 2-3 days
**Systems:** 4/18 (ResourceSystem, IncomeSystem, PopulationSystem, TaxationSystem)

**Dependencies:** GameState

**Port Order:**
1. **ResourceSystem** (Day 2)
   - Port `ResourceCollection` model
   - Port resource types (Credits, Minerals, Fuel, Food, Energy)
   - Implement `AddResources()`, `SubtractResources()`, `HasEnough()`
   - Tests: Resource arithmetic, validation, limits
   - Rendering: Add resource display panel to Phaser

2. **PopulationSystem** (Day 2)
   - Port population growth calculations
   - Port morale system (0-100)
   - Implement `CalculateGrowth()`, `UpdateMorale()`
   - Tests: Growth rates, morale effects, edge cases
   - Rendering: Population counter on planets

3. **IncomeSystem** (Day 3)
   - Port per-turn income calculations
   - Port building-based income modifiers
   - Implement `CalculateIncome()`, `ApplyIncome()`
   - Tests: Income formulas, building bonuses, difficulty scaling
   - Rendering: Income preview tooltips

4. **TaxationSystem** (Day 3)
   - Port tax rate management (0-100%)
   - Port morale-tax relationship
   - Implement `SetTaxRate()`, `CalculateTaxIncome()`
   - Tests: Tax calculations, morale penalties
   - Rendering: Tax slider UI

**Quality Gates:**
- [ ] All 4 systems have 70%+ test coverage
- [ ] Resources display correctly in Phaser
- [ ] Population updates each turn
- [ ] Income tooltips work
- [ ] Tax slider affects income/morale

**Milestone:** Basic economy loop functional

---

### 🔄 Phase 3: Turn Management
**Duration:** 2 days
**Systems:** 2/18 (TurnSystem, SaveSystem)

**Dependencies:** GameState, ResourceSystem, IncomeSystem

**Port Order:**
1. **TurnSystem** (Day 4)
   - Port turn phases (Income → Action → Combat → End)
   - Port phase transition logic
   - Implement `AdvanceTurn()`, `AdvancePhase()`
   - Port event system for phase changes
   - Tests: Phase transitions, turn counter, event firing
   - Rendering: Turn counter, phase indicator, "End Turn" button

2. **SaveSystem** (Day 5)
   - Port JSON serialization (using browser localStorage)
   - Port save data validation (SHA256 checksums)
   - Port GZip compression (pako library)
   - Implement `SaveGame()`, `LoadGame()`, `ValidateSave()`
   - Tests: Serialization, deserialization, corruption detection
   - Rendering: Save/Load menu UI

**Quality Gates:**
- [ ] TurnSystem advances phases correctly
- [ ] Events fire on phase changes
- [ ] SaveSystem serializes all current state
- [ ] Saves can be loaded without errors
- [ ] Save corruption detected

**Milestone:** Full turn cycle working with persistence

---

### 🔄 Phase 4: Entity Systems
**Duration:** 3 days
**Systems:** 3/18 (EntitySystem, CraftSystem, PlatoonSystem)

**Dependencies:** GameState, ResourceSystem

**Port Order:**
1. **EntitySystem** (Day 6)
   - Port base entity ID generation
   - Port entity lookup patterns
   - Implement `CreateEntity()`, `DestroyEntity()`
   - Tests: ID uniqueness, lookup performance
   - Rendering: Entity debug panel

2. **CraftSystem** (Day 6-7)
   - Port `CraftEntity` model (Scouts, Battle Cruisers, Bombers)
   - Port craft stats (health, firepower, speed, cargo)
   - Port construction costs/time
   - Implement `BuildCraft()`, `DestroyCraft()`, `GetCraftsAtPlanet()`
   - Tests: Construction, stats, validation
   - Rendering: Ship icons on planets, construction queue

3. **PlatoonSystem** (Day 7)
   - Port `PlatoonEntity` model
   - Port equipment/weapons/training levels
   - Port platoon stats calculation
   - Implement `CreatePlatoon()`, `DestroyPlatoon()`, `AssignToPlanet()`
   - Tests: Creation, stats, assignment
   - Rendering: Platoon markers, garrison display

**Quality Gates:**
- [ ] Entities have unique IDs
- [ ] Craft can be built and destroyed
- [ ] Platoons can be created and assigned
- [ ] Stats calculated correctly
- [ ] Rendering shows entities on planets

**Milestone:** Entities manageable, visible on map

---

### 🔄 Phase 5: Infrastructure Systems
**Duration:** 3 days
**Systems:** 3/18 (BuildingSystem, UpgradeSystem, DefenseSystem)

**Dependencies:** GameState, ResourceSystem

**Port Order:**
1. **BuildingSystem** (Day 8)
   - Port `Structure` model (all building types)
   - Port building costs, effects, construction time
   - Port building status (Active, UnderConstruction, Damaged)
   - Implement `BuildStructure()`, `DestroyStructure()`, `GetBuildingEffects()`
   - Tests: Construction, effects, limits
   - Rendering: Building icons on planets, construction UI

2. **UpgradeSystem** (Day 9)
   - Port upgrade levels (Equipment, Weapons, Training)
   - Port upgrade costs (exponential scaling)
   - Implement `UpgradeTech()`, `GetUpgradeLevel()`, `GetUpgradeCost()`
   - Tests: Level progression, cost calculations
   - Rendering: Tech tree UI, upgrade buttons

3. **DefenseSystem** (Day 10)
   - Port planetary defenses (Shields, Missiles, Laser Batteries)
   - Port defense effectiveness calculations
   - Implement `BuildDefense()`, `CalculateDefenseStrength()`
   - Tests: Defense building, strength formulas
   - Rendering: Defense indicators on planets

**Quality Gates:**
- [ ] Buildings can be constructed
- [ ] Building effects apply (income, production)
- [ ] Tech upgrades increase entity stats
- [ ] Defenses reduce attack effectiveness
- [ ] UI shows all infrastructure

**Milestone:** Infrastructure functional, affects gameplay

---

### 🔄 Phase 6: Navigation & Movement
**Duration:** 1 day
**Systems:** 1/18 (NavigationSystem)

**Dependencies:** GameState, CraftSystem, GalaxyGenerator

**Port Order:**
1. **NavigationSystem** (Day 11)
   - Port ship movement between planets
   - Port travel time calculations (based on distance)
   - Port fleet grouping logic
   - Implement `SetDestination()`, `UpdateMovement()`, `GetTravelTime()`
   - Tests: Movement, travel time, arrival detection
   - Rendering: Ship movement animation, flight paths

**Quality Gates:**
- [ ] Ships move between planets
- [ ] Travel time based on distance
- [ ] Fleets can move together
- [ ] Animation shows movement
- [ ] Arrival events fire

**Milestone:** Ship movement working

---

### 🔄 Phase 7: Combat Systems
**Duration:** 4 days
**Systems:** 4/18 (CombatSystem, SpaceCombatSystem, BombardmentSystem, InvasionSystem)

**Dependencies:** GameState, PlatoonSystem, CraftSystem, DefenseSystem

**Port Order:**
1. **CombatSystem** (Day 12)
   - Port ground combat (platoon vs platoon)
   - Port combat resolution formulas
   - Port casualties, retreat, victory conditions
   - Implement `ResolveCombat()`, `CalculateDamage()`, `DetermineCasualties()`
   - Tests: Combat outcomes, damage formulas, edge cases
   - Rendering: Combat animation, casualty reports

2. **SpaceCombatSystem** (Day 13)
   - Port space combat (fleet vs fleet)
   - Port ship-to-ship targeting
   - Port damage allocation, ship destruction
   - Implement `ResolveSpaceBattle()`, `CalculateShipDamage()`
   - Tests: Fleet battles, targeting, destruction
   - Rendering: Space battle visualization

3. **BombardmentSystem** (Day 14)
   - Port orbital bombardment mechanics
   - Port civilian casualties, building damage
   - Port bombardment effectiveness (vs defenses)
   - Implement `BombardPlanet()`, `CalculateDamage()`
   - Tests: Bombardment, defense mitigation
   - Rendering: Bombardment animation

4. **InvasionSystem** (Day 15)
   - Port planetary invasion logic
   - Port landing, combat, occupation
   - Port planet ownership transfer
   - Implement `InvadePlanet()`, `ResolveInvasion()`
   - Tests: Invasion outcomes, ownership transfer
   - Rendering: Invasion progress UI

**Quality Gates:**
- [ ] Ground combat resolves correctly
- [ ] Space battles work
- [ ] Bombardment damages planets
- [ ] Invasions transfer ownership
- [ ] All combat visualized

**Milestone:** Full combat system operational

---

### 🔄 Phase 8: AI System
**Duration:** 3 days
**Systems:** 1/18 (AIDecisionSystem)

**Dependencies:** ALL economic, entity, combat systems

**Port Order:**
1. **AIDecisionSystem** (Day 16-18)
   - Port AI personalities (Aggressive, Defensive, Economic, Balanced)
   - Port difficulty levels (Easy, Normal, Hard)
   - Port decision tree (Defense → Military → Economy → Attack)
   - Port strategic evaluation functions
   - Implement `MakeDecision()`, `EvaluateThreat()`, `PlanExpansion()`
   - Tests: AI decisions, personality traits, difficulty scaling
   - Rendering: AI status panel (for debugging)

**Quality Gates:**
- [ ] AI makes valid decisions
- [ ] Personalities play differently
- [ ] Difficulty affects challenge
- [ ] AI doesn't cheat (uses same rules)
- [ ] Performance acceptable (decisions < 100ms)

**Milestone:** Playable single-player game vs AI

---

### 🔄 Phase 9: Integration & Polish
**Duration:** 3-5 days
**Systems:** Full game integration

**Tasks:**
1. **UI Framework Integration** (Day 19-20)
   - Integrate React or Vue for complex UI
   - Create main menu, HUD, planet detail panel
   - Add tooltips, notifications, modals
   - Implement responsive layouts

2. **Game Loop Refinement** (Day 20-21)
   - Connect all systems into cohesive gameplay
   - Balance turn phases, resource rates
   - Add victory/defeat conditions
   - Implement game over screen

3. **Rendering Polish** (Day 21-22)
   - Replace rectangles with sprites
   - Add animations (movement, combat, construction)
   - Particle effects (explosions, shields)
   - Camera controls (pan, zoom, focus)

4. **Optimization** (Day 22-23)
   - Profile performance
   - Optimize rendering (object pooling)
   - Code splitting (lazy load systems)
   - Bundle size optimization

5. **Documentation & Tutorial** (Day 23)
   - In-game tutorial
   - Help screens
   - API documentation
   - Deployment guide

**Quality Gates:**
- [ ] All systems integrated
- [ ] 60 FPS maintained
- [ ] No critical bugs
- [ ] Tutorial completable
- [ ] Production build < 2 MB

**Milestone:** Release Candidate ready

---

## 📋 Tracking & Metrics

### Daily Standups
- Systems completed today
- Tests written/passing
- Blockers encountered
- Tomorrow's target

### Weekly Reviews
- Phase completion status
- Test coverage metrics
- Performance benchmarks
- Adjust timeline if needed

### Metrics to Track
| Metric | Target | Current |
|--------|--------|---------|
| Total Systems | 18 | 18 |
| Systems Ported | 18 | 2 ✅ |
| Test Coverage | 70%+ | 100% ✅ |
| Total Tests | 500+ | 47 |
| Bundle Size | < 2 MB | 1.14 MB ✅ |
| Load Time | < 3s | TBD |
| Frame Rate | 60 FPS | TBD |

---

## 🧪 Testing Strategy

### Test Pyramid
```
        E2E Tests (10%)
       /              \
      /   Integration   \
     /    Tests (20%)    \
    /____________________\
   /                      \
  /     Unit Tests (70%)   \
 /_________________________ \
```

### Test Coverage Requirements
- **Unit tests:** Every system, every public method
- **Integration tests:** System interactions
- **E2E tests:** Full game scenarios (new game → victory)

### Regression Testing
- Run full test suite after each system port
- No new system starts until all tests pass
- Performance benchmarks after each phase

---

## 🚧 Risk Mitigation

### Known Risks
1. **Seeded RNG parity** - C# vs TypeScript random differences
   - Mitigation: Already solved in Phase 1 ✅

2. **Save/load compatibility** - Browser storage limits
   - Mitigation: GZip compression, IndexedDB for large saves

3. **Performance degradation** - TypeScript slower than C#
   - Mitigation: Profile early, optimize hot paths, Web Workers

4. **UI complexity** - Phaser UI vs Unity UI
   - Mitigation: React/Vue integration, proven patterns

### Contingency Plans
- **Timeline slips:** Reduce scope (e.g., AI personalities)
- **Bugs found late:** Bug bash week before release
- **Performance issues:** Profiling sprint, Web Workers

---

## 📅 Timeline Summary

| Phase | Duration | Systems | Completion |
|-------|----------|---------|------------|
| Phase 1: Foundation | 1 day | 2 | ✅ 100% |
| Phase 2: Economy | 3 days | 4 | 🔄 0% |
| Phase 3: Turn Management | 2 days | 2 | 🔄 0% |
| Phase 4: Entities | 3 days | 3 | 🔄 0% |
| Phase 5: Infrastructure | 3 days | 3 | 🔄 0% |
| Phase 6: Navigation | 1 day | 1 | 🔄 0% |
| Phase 7: Combat | 4 days | 4 | 🔄 0% |
| Phase 8: AI | 3 days | 1 | 🔄 0% |
| Phase 9: Integration | 5 days | - | 🔄 0% |
| **TOTAL** | **25 days** | **18** | **11%** |

**Target Completion:** ~1 month (with buffer)

---

## 🎯 Success Criteria

### Phase Completion
- ✅ All systems ported and tested
- ✅ 70%+ test coverage maintained
- ✅ No P0/P1 bugs
- ✅ Performance targets met
- ✅ Playable end-to-end

### Release Ready
- ✅ Single-player campaign completable
- ✅ AI provides challenge
- ✅ Save/Load works
- ✅ Tutorial guides new players
- ✅ Production build optimized

---

## 📝 Notes

**Current Status:** Phase 1 complete, Phase 2 ready to start

**Next Actions:**
1. Begin ResourceSystem port (Day 2)
2. Set up daily tracking spreadsheet
3. Create migration branch in git
4. Set up CI/CD for automated testing

**Questions/Decisions Needed:**
- UI framework choice (React vs Vue vs pure Phaser)
- Multiplayer scope (Phase 10 or post-launch?)
- Art assets (placeholder sprites vs commissioned art)

---

**Last Updated:** 2025-12-09
**Maintained By:** Migration Team
**Review Frequency:** Weekly
