# Story 5-2: Platoon Details and Management

**Epic:** 5 - Military Forces & Movement
**Status:** DONE

## Description

As a player, I want to view detailed information about my platoons including troop count, equipment level, and weapon level, so that I can assess my military strength and make tactical decisions.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | Planet info shows "Platoons" section with list | PlatoonDetailsPanel shows all garrisoned platoons | DONE |
| AC2 | Each platoon shows: ID/name, troop count, equipment, weapon | List entries show name, troops, equipment/weapon | DONE |
| AC3 | Clickable platoon expands to full details | selectPlatoon() shows expanded details | DONE |
| AC4 | Full details show: exact troop count, equipment desc, weapon desc, status, strength | updateDetailsDisplay() shows all stats | DONE |
| AC5 | "Disband" action returns troops to population | handleDisband() calls PlatoonSystem.decommissionPlatoon() | DONE |
| AC6 | Casualties reflected in troop count | Display "X/Y (-Z)" format when maxTroopCount set | DONE |
| AC7 | Empty state message when no platoons | "No platoons garrisoned" display | DONE |
| AC8 | Training status shown for platoons in training | Training percentage shown in list | DONE |

## Technical Design

### Core Systems (Already Implemented)
- `PlatoonSystem.ts` - getPlatoonsAtPlanet(), decommissionPlatoon(), calculateMilitaryStrength()
- `PlatoonEntity.ts` - troopCount, equipment, weapon, strength, trainingLevel, isTraining
- `EntitySystem.ts` - getPlatoonsAtPlanet()

### New UI Component
- `src/scenes/ui/PlatoonDetailsPanel.ts` - Panel for viewing/managing platoons

### Component Structure
```
PlatoonDetailsPanel extends Phaser.GameObjects.Container
├── Background (Graphics)
├── Title ("Garrisoned Platoons")
├── Platoon List Container
│   └── PlatoonListEntry[] (clickable items)
│       ├── ID/Name text
│       ├── Troop count
│       ├── Equipment icon
│       ├── Weapon icon
│       └── Status indicator
├── Selected Platoon Details (expanded)
│   ├── Full stats display
│   ├── Training progress (if applicable)
│   └── Action buttons (Disband, Load onto Cruiser)
├── Empty State Message
└── Close button
```

### Key Methods
- `show(planet: PlanetEntity, platoons: PlatoonEntity[])` - Opens with data
- `hide()` - Closes panel
- `selectPlatoon(platoonID: number)` - Shows expanded details
- `handleDisband(platoonID: number)` - Confirms and calls Core
- `refresh()` - Updates list after changes
- `getSelectedPlatoon()` - Returns currently selected platoon

### Integration Points
- Accessible from PlanetInfoPanel "View Platoons" button
- "Load onto Cruiser" links to Story 5-4 panel
- Events: `onDisband?: (platoonID: number) => void`, `onLoadRequest?: (platoonID: number) => void`

## Task Breakdown

1. **RED Phase - Write failing tests**
   - Test panel creation
   - Test show with platoon data
   - Test list rendering with correct platoon info
   - Test platoon selection/expansion
   - Test disband callback
   - Test empty state
   - Test training status display
   - Test casualty display format

2. **GREEN Phase - Implement PlatoonDetailsPanel**
   - Create panel with list container
   - Implement list entry components
   - Add selection/expansion logic
   - Wire disband to Core system
   - Add training progress display
   - Handle empty state

3. **REFACTOR Phase**
   - Optimize list rendering for many platoons
   - Extract reusable list item component

## Dependencies
- Story 5-1 (platoons must exist to view)
- PlatoonSystem - Already implemented

## Test File
`tests/unit/PlatoonDetailsPanel.test.ts`

## Definition of Done
- [ ] All acceptance criteria have passing tests
- [ ] PlatoonDetailsPanel.ts implements full functionality
- [ ] Panel accessible from PlanetInfoPanel
- [ ] Code review approved
- [ ] npm test passes
- [ ] npm run build succeeds
