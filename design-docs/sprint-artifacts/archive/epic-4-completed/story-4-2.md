# Story 4-2: Building Construction Menu

**Epic:** 4 - Economy Management
**Status:** DONE
**Commit:** ae2e8cb

## Description

Implement building construction menu allowing players to construct planetary infrastructure.

## Acceptance Criteria

| AC | Requirement | Implementation | Status |
|----|-------------|----------------|--------|
| AC1 | Menu opens <100ms from "Build" button | Performance instrumented, typically <50ms | ✅ PASS |
| AC2 | Building list | Uses Core BuildingTypes (design adjusted per C4.2-1) | ✅ PASS |
| AC3 | Each shows: name, cost, time, description | Inline display for all info | ✅ PASS |
| AC4 | Tooltip on insufficient resources | Inline "Insufficient resources" text (per C4.2-2) | ✅ PASS |
| AC5 | Resources deducted, building queued | startConstruction() + resource subtraction | ✅ PASS |
| AC6 | One building at a time per planet | getBuildingsUnderConstruction() check | ✅ PASS |

## Implementation Files

- `src/scenes/ui/BuildingMenuPanel.ts` - Menu component (~475 lines)
- `src/core/BuildingSystem.ts` - Construction logic
- `tests/unit/BuildingMenuPanel.test.ts` - 24 tests

## Key Implementation Details

1. **Building Types (C4.2-1 design adjustment)**
   - Uses pre-existing Core BuildingType enum:
     - MiningStation (was "Mine")
     - HorticulturalStation (was "Farm")
     - DockingBay (orbital platform)
     - OrbitalDefense (was "Defense Grid")
     - SurfacePlatform (generic slot)
   - Note: Factory, Power Plant, Research Lab not in Core

2. **Display Pattern (C4.2-2 design adjustment)**
   - All info shown inline (not tooltips)
   - Better for touch devices, accessibility
   - Hover only changes background color

3. **Construction Flow**
   - Check affordability vs playerFaction.resources
   - Check capacity via buildingSystem.canBuild()
   - Check one-at-a-time via getBuildingsUnderConstruction()
   - Deduct resources → startConstruction() → confirmation → close

4. **UI Features**
   - Click-outside-to-close backdrop
   - 44x44px touch targets
   - 100ms open/close animations

## Design Adjustments Applied

- **C4.2-1**: Uses Core BuildingType enum (existed before Epic 4)
- **C4.2-2**: Inline info display instead of tooltips

## Test Coverage

- 24 tests for BuildingMenuPanel
- Affordability, capacity, construction flow verified
