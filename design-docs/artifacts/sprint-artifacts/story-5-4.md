# Story 5-4: Loading Platoons onto Battle Cruisers

**Epic:** 5 - Military Forces & Movement
**Status:** DONE

## Description

As a player, I want to load platoons onto Battle Cruisers for transport, so that I can move ground forces between planets for invasions or reinforcement.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | "Load Platoon" button visible on Battle Cruiser details | PlatoonLoadingPanel accessible via PlatoonDetailsPanel.onLoadRequest | DONE |
| AC2 | Current cargo status shown | "Cargo: X/4 platoons loaded" display with warning color when full | DONE |
| AC3 | List of available platoons on planet | getAvailablePlatoons() filters by planetID | DONE |
| AC4 | Each platoon shows: troop count, equipment, weapon | createPlatoonEntry() shows all details | DONE |
| AC5 | Load action transfers platoon to cargo bay | handleLoad() calls CraftSystem.embarkPlatoons() | DONE |
| AC6 | Platoon status changes to "In Transit" | CraftSystem sets planetID=-1 on embark | DONE |
| AC7 | Error when cargo bay full | isCargoBayFull() disables Load button | DONE |
| AC8 | Unload action returns platoon to planet garrison | handleUnload() calls CraftSystem.disembarkPlatoons() | DONE |

## Technical Design

### Core Systems (Already Implemented)
- `CraftSystem.ts` - embarkPlatoons(), disembarkPlatoons()
- `CraftEntity.ts` - carriedPlatoonIDs[], specs.platoonCapacity
- `PlatoonEntity.ts` - planetID (set to -1 when carried)
- `EntitySystem.ts` - getPlatoonsAtPlanet()

### New UI Component
- `src/scenes/ui/PlatoonLoadingPanel.ts` - Panel for loading/unloading platoons

### Component Structure
```
PlatoonLoadingPanel extends Phaser.GameObjects.Container
├── Background (Graphics)
├── Title ("Platoon Loading - [Cruiser ID]")
├── Cargo Status Section
│   └── "Cargo: X/4 platoons loaded"
├── Available Platoons Section (left side)
│   ├── Label "Available on Planet"
│   └── PlatoonListEntry[] (loadable platoons)
│       ├── Platoon info
│       └── "Load" button
├── Loaded Platoons Section (right side)
│   ├── Label "Loaded on Cruiser"
│   └── PlatoonListEntry[] (carried platoons)
│       ├── Platoon info
│       └── "Unload" button
├── Empty State Messages
└── Close button
```

### Key Methods
- `show(craft: CraftEntity, planet: PlanetEntity, platoons: PlatoonEntity[])` - Opens with data
- `hide()` - Closes panel
- `handleLoad(platoonID: number)` - Validates and calls CraftSystem.embarkPlatoons()
- `handleUnload(platoonID: number)` - Calls CraftSystem.disembarkPlatoons()
- `refresh()` - Updates lists after load/unload
- `getCargoCount()` - Returns current loaded count
- `getMaxCapacity()` - Returns max capacity (4)

### Integration Points
- Accessible from spacecraft details view
- Links from PlatoonDetailsPanel "Load onto Cruiser" action
- Events: `onLoad?: (craftID: number, platoonID: number) => void`, `onUnload?: (craftID: number, platoonID: number) => void`

## Task Breakdown

1. **RED Phase - Write failing tests**
   - Test panel creation
   - Test show with craft and platoon data
   - Test available platoons list
   - Test loaded platoons list
   - Test load callback and state change
   - Test unload callback and state change
   - Test cargo capacity error
   - Test empty states (no platoons available, none loaded)

2. **GREEN Phase - Implement PlatoonLoadingPanel**
   - Create dual-list panel layout
   - Implement available platoons list
   - Implement loaded platoons list
   - Wire load to CraftSystem.embarkPlatoons()
   - Wire unload to CraftSystem.disembarkPlatoons()
   - Add cargo capacity validation
   - Handle empty states

3. **REFACTOR Phase**
   - Extract shared list rendering
   - Optimize refresh after load/unload

## Dependencies
- Story 5-1 (platoons must exist)
- Story 5-3 (Battle Cruisers must exist)
- CraftSystem, PlatoonSystem - Already implemented

## Test File
`tests/unit/PlatoonLoadingPanel.test.ts`

## Definition of Done
- [ ] All acceptance criteria have passing tests
- [ ] PlatoonLoadingPanel.ts implements full functionality
- [ ] Panel accessible from craft details
- [ ] Code review approved
- [ ] npm test passes
- [ ] npm run build succeeds
