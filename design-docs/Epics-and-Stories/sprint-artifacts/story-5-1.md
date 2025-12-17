# Story 5-1: Platoon Commissioning with Equipment Configuration

**Epic:** 5 - Military Forces & Movement
**Status:** DRAFTED

## Description

As a player, I want to commission platoons with configurable equipment and weapons levels, so that I can build military forces tailored to my strategic needs.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | "Commission Platoon" button visible on planet management | PlatoonCommissionPanel accessible from PlanetInfoPanel | PENDING |
| AC2 | Button enabled only when sufficient resources | canAffordPlatoon() check before enabling | PENDING |
| AC3 | Configuration options: troop count (1-200), equipment level, weapon level | Sliders/dropdowns for each option | PENDING |
| AC4 | Real-time cost preview as configuration changes | Update total cost display on change | PENDING |
| AC5 | Commission deducts resources and creates platoon | Calls PlatoonSystem.commissionPlatoon() | PENDING |
| AC6 | Notification on successful commission | "Platoon commissioned on [Planet]" message | PENDING |
| AC7 | Error message when insufficient resources | "Insufficient resources. Need: [X]" display | PENDING |
| AC8 | Current platoon count displayed | Show "Platoons: X" on planet | PENDING |

## Technical Design

### Core Systems (Already Implemented)
- `PlatoonSystem.ts` - commissionPlatoon(), canAffordPlatoon(), getPlatoonsAtPlanet()
- `PlatoonEntity.ts` - Entity model with troopCount, equipment, weapon, strength
- `PlatoonModels.ts` - PlatoonCosts.getTotalCost(), equipment/weapon multipliers
- `EntitySystem.ts` - createPlatoon(), canCreatePlatoon() (24 max)

### New UI Component
- `src/scenes/ui/PlatoonCommissionPanel.ts` - Modal panel for platoon configuration

### Component Structure
```
PlatoonCommissionPanel extends Phaser.GameObjects.Container
├── Background (Graphics)
├── Title ("Commission Platoon")
├── Planet Info Section
│   └── Planet name, current platoon count
├── Configuration Section
│   ├── Troop count slider (1-200)
│   ├── Equipment dropdown (Basic/Standard/Advanced)
│   └── Weapon dropdown (Rifle/HeavyWeapons/Artillery)
├── Cost Preview Section
│   └── Credits cost with real-time update
├── Strength Preview
│   └── Estimated military strength
├── Action Buttons
│   ├── Commission button (enabled when affordable)
│   └── Cancel button
└── Error/Success notifications
```

### Key Methods
- `show(planet: PlanetEntity)` - Opens panel for planet
- `hide()` - Closes panel
- `updateCostPreview()` - Recalculates displayed cost
- `updateStrengthPreview()` - Shows estimated strength
- `handleCommission()` - Validates and calls Core system
- `getIsVisible()`, `getTroopCount()`, `getEquipmentLevel()`, `getWeaponLevel()` - State accessors

### Integration Points
- PlanetInfoPanel calls `commissionPanel.show(planet)` when "Commission" button clicked
- PlatoonCommissionPanel calls `platoonSystem.commissionPlatoon()` on confirm
- Events: `onCommission?: (platoonID: number) => void`

## Task Breakdown

1. **RED Phase - Write failing tests**
   - Test panel creation and initialization
   - Test show/hide with planet data
   - Test configuration state (troop count, equipment, weapon)
   - Test cost preview updates
   - Test strength preview calculation
   - Test commission callback fires with correct data
   - Test error states (insufficient resources, max platoons)
   - Test button enable/disable states

2. **GREEN Phase - Implement PlatoonCommissionPanel**
   - Create panel class extending Container
   - Implement show/hide with animation
   - Add troop slider with value tracking
   - Add equipment/weapon dropdowns
   - Implement cost preview calculation
   - Wire commission button to Core system
   - Add error message display

3. **REFACTOR Phase**
   - Extract shared panel styling
   - Optimize re-renders on configuration changes

## Dependencies
- Epic 3 (PlanetInfoPanel) - Must exist to add Commission button
- PlatoonSystem - Already implemented in Core

## Test File
`tests/unit/PlatoonCommissionPanel.test.ts`

## Definition of Done
- [ ] All acceptance criteria have passing tests
- [ ] PlatoonCommissionPanel.ts implements full functionality
- [ ] Panel integrates with PlanetInfoPanel
- [ ] Code review approved
- [ ] npm test passes
- [ ] npm run build succeeds
