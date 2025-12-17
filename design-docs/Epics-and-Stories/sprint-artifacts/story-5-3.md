# Story 5-3: Spacecraft Purchase and Types

**Epic:** 5 - Military Forces & Movement
**Status:** DONE

## Description

As a player, I want to purchase spacecraft of different types (BattleCruiser, CargoCruiser, SolarSatellite, AtmosphereProcessor) using resources, so that I can build a fleet for combat, transport, energy production, and terraforming operations.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | "Purchase Spacecraft" section visible on planet management | SpacecraftPurchasePanel accessible from PlanetInfoPanel | DONE |
| AC2 | Available types shown (per CraftType enum): BattleCruiser, CargoCruiser, SolarSatellite, AtmosphereProcessor | List all CraftType options | DONE |
| AC3 | Each type shows: name, cost, capabilities, crew req | Formatted display cards | DONE |
| AC4 | Purchase button enabled when sufficient resources | canAfford() check for each type | DONE |
| AC5 | Purchase deducts resources and creates spacecraft | Calls CraftSystem.purchaseCraft() | DONE |
| AC6 | Spacecraft appears in planet's docked fleet | Added to planet's craft list via CraftSystem | DONE |
| AC7 | UI refreshes on successful purchase | onPurchase callback refreshes ResourceHUD | DONE |
| AC8 | Battle Cruiser shows cargo capacity | Capability text shows platoon capacity | DONE |

## Technical Design

### Core Systems (Already Implemented)
- `CraftSystem.ts` - purchaseCraft(), canPurchaseCraft(), getCraftAtPlanet()
- `CraftEntity.ts` - Entity model with type, owner, planetID, carriedPlatoonIDs, specs
- `CraftModels.ts` - CraftCosts.getCost(), CraftCrewRequirements.getCrewRequired()
- `EntitySystem.ts` - createCraft(), canCreateCraft() (32 max)

### New UI Component
- `src/scenes/ui/SpacecraftPurchasePanel.ts` - Panel for purchasing spacecraft

### Component Structure
```
SpacecraftPurchasePanel extends Phaser.GameObjects.Container
├── Background (Graphics)
├── Title ("Purchase Spacecraft")
├── Planet Info Section
│   └── Planet name, current fleet count
├── Spacecraft Type Cards
│   ├── Scout Card
│   │   ├── Icon/sprite
│   │   ├── Type name
│   │   ├── Cost display (Credits, Minerals, Fuel)
│   │   ├── Capabilities description
│   │   └── Purchase button
│   ├── Battle Cruiser Card
│   │   └── (same structure + cargo capacity)
│   ├── Bomber Card
│   │   └── (same structure)
│   └── Other types (Solar Satellite, etc.)
├── Resource Availability Display
└── Close button
```

### Key Methods
- `show(planet: PlanetEntity)` - Opens panel for planet
- `hide()` - Closes panel
- `handlePurchase(craftType: CraftType)` - Validates and calls Core
- `updateAffordability()` - Enable/disable purchase buttons
- `getIsVisible()` - State accessor

### Integration Points
- Accessible from PlanetInfoPanel "Purchase Spacecraft" button
- SpacecraftPurchasePanel calls `craftSystem.purchaseCraft()` on confirm
- Events: `onPurchase?: (craftID: number) => void`

### Craft Type Details
- **Scout**: Low cost (500 Credits), fast, reveals enemy info
- **Battle Cruiser**: High cost (2000 Credits, 500 Minerals), 4 platoon capacity, combat
- **Bomber**: Medium cost (1500 Credits, 300 Minerals), orbital bombardment
- **Solar Satellite**: Special (1000 Credits), generates 80 Energy/turn
- **Atmosphere Processor**: Special (3000 Credits), terraforming (one-time use)

## Task Breakdown

1. **RED Phase - Write failing tests**
   - Test panel creation
   - Test show with planet data
   - Test all craft types displayed
   - Test cost display for each type
   - Test purchase callback fires
   - Test affordability checks
   - Test error states (insufficient resources, fleet limit)
   - Test capabilities descriptions

2. **GREEN Phase - Implement SpacecraftPurchasePanel**
   - Create panel with type cards
   - Implement cost display from CraftCosts
   - Add purchase buttons with affordability logic
   - Wire to CraftSystem.purchaseCraft()
   - Add fleet count display
   - Handle error states

3. **REFACTOR Phase**
   - Extract reusable craft card component
   - Optimize resource checks

## Dependencies
- Epic 3 (PlanetInfoPanel) - Must exist to add Purchase button
- CraftSystem - Already implemented

## Test File
`tests/unit/SpacecraftPurchasePanel.test.ts`

## Definition of Done
- [ ] All acceptance criteria have passing tests
- [ ] SpacecraftPurchasePanel.ts implements full functionality
- [ ] Panel accessible from PlanetInfoPanel
- [ ] Code review approved
- [ ] npm test passes
- [ ] npm run build succeeds
