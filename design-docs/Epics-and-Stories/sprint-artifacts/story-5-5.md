# Story 5-5: Spacecraft Navigation Between Planets

**Epic:** 5 - Military Forces & Movement
**Status:** DONE

## Description

As a player, I want to navigate spacecraft between planets on the galaxy map, so that I can position my fleet for exploration, invasion, and defense.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | "Navigate" button visible when spacecraft selected | Navigate button in PlanetInfoPanel, SpacecraftNavigationPanel accessible | DONE |
| AC2 | Navigation interface shows galaxy map with planets | List of available destinations (prototype simplified) | DONE |
| AC3 | Current planet highlighted as origin | "Currently at: [Planet Name]" display | DONE |
| AC4 | Destination selection shows: distance, fuel cost, travel time | Fuel cost (10), Travel time (Instant) display | DONE |
| AC5 | Out-of-range planets grayed out | isDestinationReachable() checks fuel, disables entries | DONE |
| AC6 | Confirm navigation deducts fuel and moves spacecraft | handleNavigate() calls NavigationSystem.moveShip() | DONE |
| AC7 | Spacecraft status changes to "In Transit" | NavigationSystem sets inTransit (instant teleport) | DONE |
| AC8 | Notification shows navigation result | Panel hides on success (notifications in future) | DONE |

## Technical Design

### Core Systems (Already Implemented)
- `NavigationSystem.ts` - moveShip(), canMoveShip(), FuelCostPerJump = 10
- `CraftEntity.ts` - planetID, inTransit, carriedPlatoonIDs
- `ResourceSystem.ts` - addResources() for fuel deduction
- Note: Prototype uses **instant teleport** (no travel time), travel time is future enhancement

### New UI Component
- `src/scenes/ui/SpacecraftNavigationPanel.ts` - Panel for spacecraft navigation

### Component Structure
```
SpacecraftNavigationPanel extends Phaser.GameObjects.Container
├── Background (semi-transparent overlay)
├── Title ("Navigate [Spacecraft Type]")
├── Current Location Display
│   └── "Currently at: [Planet Name]"
├── Destination Selector
│   └── Planet selection UI (clickable map or list)
├── Navigation Info Display
│   ├── Distance (future: calculated from Position3D)
│   ├── Fuel cost (10 per jump for prototype)
│   ├── Travel time ("Instant" for prototype)
│   └── Fuel availability warning
├── Action Buttons
│   ├── Confirm Navigation (enabled when valid destination)
│   └── Cancel
└── Status Messages
```

### Key Methods
- `show(craft: CraftEntity, planets: PlanetEntity[])` - Opens with data
- `hide()` - Closes panel
- `selectDestination(planetID: number)` - Highlights selected planet
- `handleNavigate()` - Validates and calls NavigationSystem.moveShip()
- `checkFuelAvailability()` - Validates source planet has fuel
- `getIsVisible()`, `getSelectedDestination()` - State accessors

### Integration Points
- Accessible from spacecraft details view
- SpacecraftNavigationPanel calls `navigationSystem.moveShip()` on confirm
- Events: `onNavigate?: (craftID: number, destinationPlanetID: number) => void`

### Navigation Logic (Prototype Simplified)
- **Fuel Cost**: Fixed 10 fuel per jump (regardless of distance)
- **Travel Time**: Instant teleport (no turn-based movement)
- **Future Enhancement**: Distance-based fuel cost, multi-turn travel with ETA

## Task Breakdown

1. **RED Phase - Write failing tests**
   - Test panel creation
   - Test show with craft and planet data
   - Test destination selection
   - Test fuel cost calculation
   - Test navigate callback fires
   - Test fuel availability validation
   - Test out-of-range planet disabling
   - Test navigation with loaded platoons (platoons stay loaded)

2. **GREEN Phase - Implement SpacecraftNavigationPanel**
   - Create navigation overlay panel
   - Implement planet selection UI
   - Add fuel cost display (10 fixed)
   - Wire to NavigationSystem.moveShip()
   - Add fuel availability check
   - Handle navigation success/failure
   - Show instant teleport notification

3. **REFACTOR Phase**
   - Extract planet selector component
   - Prepare for future distance-based costs

## Dependencies
- Story 5-3 (spacecraft must exist)
- Epic 3 (galaxy map and planets)
- NavigationSystem - Already implemented

## Test File
`tests/unit/SpacecraftNavigationPanel.test.ts`

## Definition of Done
- [ ] All acceptance criteria have passing tests
- [ ] SpacecraftNavigationPanel.ts implements full functionality
- [ ] Panel accessible from craft details
- [ ] Code review approved
- [ ] npm test passes
- [ ] npm run build succeeds
