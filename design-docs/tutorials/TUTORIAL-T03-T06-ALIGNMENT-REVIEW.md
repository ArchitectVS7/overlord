# Tutorial Alignment Review: T03 & T06

**Date:** 2025-12-19
**Tutorials:** T03 (Planet Selection), T06 (Building a Structure)
**Status:** Ready for E2E Testing

---

## Overview

This document reviews the alignment of tutorials T03 and T06 with the design documents (PRD, stories, architecture, scenario schema).

---

## Tutorial T03: Planet Selection ("First Command")

### PRD Functional Requirements Alignment

| Requirement | Description | Status | Notes |
|-------------|-------------|--------|-------|
| FR9 | Players can select planets to view detailed information | ✅ ALIGNED | Core mechanic of tutorial |
| FR10 | Players can view planet attributes (type, owner, population, morale, resources) | ✅ ALIGNED | All attributes shown in PlanetInfoPanel |
| FR25 | Players can access a Flash Conflicts menu | ✅ ALIGNED | Tutorial accessible via Flash Conflicts |
| FR26 | Players can select and start individual Flash Conflicts | ✅ ALIGNED | Tutorial selectable from list |
| FR27 | Players can complete tutorial Flash Conflicts that teach specific game mechanics | ✅ ALIGNED | Teaches planet selection |
| FR29 | Players can view Flash Conflict victory conditions before starting | ✅ ALIGNED | Story object includes objective |

### Non-Functional Requirements Alignment

| Requirement | Description | Status | Notes |
|-------------|-------------|--------|-------|
| NFR-P3 | UI responds within 100ms | ✅ ALIGNED | PlanetInfoPanel has 100ms animation |
| NFR-A1 | Full keyboard navigation | ✅ ALIGNED | Tab/Enter/Esc documented in clickByClickRecipe |
| NFR-U1 | Tutorial completable in stated time | ✅ ALIGNED | Duration: 2-3 min |

### Scenario Schema Validation

| Field | Value | Valid |
|-------|-------|-------|
| id | "tutorial-003-planet-selection" | ✅ |
| name | "First Command" | ✅ |
| type | "tutorial" | ✅ |
| difficulty | "easy" | ✅ |
| duration | "2-3 min" | ✅ |
| prerequisites | [] (empty) | ✅ |
| victoryConditions | ui_interaction | ⚠️ See Note 1 |
| tutorialSteps | 3 steps with TutorialAction | ✅ |
| story | briefing, objective, victory | ✅ |

### Discrepancies Found

1. **Victory Condition Type Not Standard** (Medium)
   - Issue: `"type": "ui_interaction"` is not in the VictoryCondition interface (ScenarioModels.ts)
   - Current types: `build_structure`, `capture_planet`, `capture_all_planets`, `defeat_enemy`, `survive_turns`, `resource_target`, `destroy_all_ships`
   - Recommendation: Add `ui_interaction` type to VictoryCondition interface OR use existing type
   - Action Required: Yes

2. **clickByClickRecipe Not Standard Schema** (Low)
   - Issue: `clickByClickRecipe` is a custom extension not in Scenario interface
   - Impact: Won't break loading, provides useful documentation
   - Action Required: Optional - could add to interface or keep as documentation-only

### UI Components Verified

- [x] `PlanetInfoPanel` - slides in from right, shows all data
- [x] `PlanetRenderer` - renders planets with owner color coding
- [x] Selection ring (cyan) appears on planet click
- [x] Focus ring (yellow) appears on keyboard navigation
- [x] Close button (X) with 44×44 touch target
- [x] Click-outside-to-close functionality

---

## Tutorial T06: Building a Structure ("Foundation of Empire")

### PRD Functional Requirements Alignment

| Requirement | Description | Status | Notes |
|-------------|-------------|--------|-------|
| FR12 | Players can construct buildings on owned planets | ✅ ALIGNED | Core mechanic of tutorial |
| FR13 | Players can view building construction progress and completion status | ✅ ALIGNED | Construction section in PlanetInfoPanel |
| FR25 | Players can access a Flash Conflicts menu | ✅ ALIGNED | Tutorial accessible via Flash Conflicts |
| FR27 | Players can complete tutorial Flash Conflicts | ✅ ALIGNED | Teaches building construction |

### Story Alignment

| Story | Description | Status |
|-------|-------------|--------|
| Story 4-2 | Building Menu shows available buildings with costs | ✅ ALIGNED |
| Story 4-3 | Construction progress shown in Planet Info Panel | ✅ ALIGNED |
| Story 4-3 AC1 | Shows "Under Construction: [Building Name]" | ✅ ALIGNED |
| Story 4-3 AC3 | Notification on completion | ✅ ALIGNED (in GalaxyMapScene) |

### Non-Functional Requirements Alignment

| Requirement | Description | Status | Notes |
|-------------|-------------|--------|-------|
| NFR-P3 | UI responds within 100ms | ✅ ALIGNED | BuildingMenuPanel has 100ms animation |
| NFR-U1 | Tutorial completable in stated time | ✅ ALIGNED | Duration: 5-7 min |

### Scenario Schema Validation

| Field | Value | Valid |
|-------|-------|-------|
| id | "tutorial-006-building-structure" | ✅ |
| name | "Foundation of Empire" | ✅ |
| type | "tutorial" | ✅ |
| difficulty | "easy" | ✅ |
| duration | "5-7 min" | ✅ |
| prerequisites | ["tutorial-003-planet-selection"] | ✅ |
| victoryConditions | build_structure, count: 1 | ✅ |
| tutorialSteps | 6 steps with TutorialAction | ✅ |
| story | briefing, objective, victory | ✅ |

### Discrepancies Found

1. **clickByClickRecipe Not Standard Schema** (Low)
   - Same as T03 - documentation-only field

2. **Buildings Reference in Recipe** (Low)
   - Contains building costs that should match BuildingMenuPanel.BUILDINGS
   - Verified: Costs match implementation

### UI Components Verified

- [x] `BuildingMenuPanel` - shows 5 buildings with costs/times
- [x] Build button in `PlanetInfoPanel` triggers menu
- [x] Grayed out buildings when unaffordable
- [x] Red cost text when insufficient resources
- [x] "Construction in progress" message when already building
- [x] Construction section in `PlanetInfoPanel` shows progress bar
- [x] Backdrop click-to-close

---

## Summary of Required Actions

### Must Fix Before Testing

| Priority | Issue | Tutorial | Action |
|----------|-------|----------|--------|
| HIGH | Victory condition type `ui_interaction` not in schema | T03 | Add to VictoryCondition interface OR change to existing type |

### Recommended Improvements (Post-Testing)

| Priority | Issue | Tutorial | Action |
|----------|-------|----------|--------|
| LOW | Add `clickByClickRecipe` to Scenario interface | Both | Optional - useful for documentation |
| LOW | Add story object to Scenario interface | Both | Schema already supports, just not typed |

---

## E2E Test Coverage

### T03: Planet Selection Tests

| Test | Description | Status |
|------|-------------|--------|
| should display Flash Conflicts button on main menu | Verifies main menu loads | Ready |
| should navigate to Flash Conflicts scene | Tests navigation | Ready |
| should show planet info panel when planet is clicked | Core mechanic | Ready |
| should close planet info panel when clicking outside | Close functionality | Ready |

### T06: Building a Structure Tests

| Test | Description | Status |
|------|-------------|--------|
| should navigate to galaxy map and open planet info panel | Pre-requisite flow | Ready |
| should open Build button from Planet Info Panel | Build menu access | Ready |
| should display building options with costs | Menu content | Ready |
| should start construction when building is selected | Core mechanic | Ready |
| should close build menu when clicking outside | Close functionality | Ready |

---

## Next Steps

1. **Fix High Priority Issue:**
   - Add `ui_interaction` to VictoryCondition types in ScenarioModels.ts

2. **Run E2E Tests:**
   ```bash
   cd Overlord.Phaser
   npm run test:e2e tutorials/
   ```

3. **Manual Playthrough:**
   - Start game and navigate through tutorial flow
   - Verify all UI elements work as documented

4. **Update Documentation:**
   - Mark T03 and T06 as complete in TUTORIAL-ELEMENTS-LIST.md after tests pass

---

## Approval

| Reviewer | Status | Date |
|----------|--------|------|
| Claude Code (Web) | Prepared | 2025-12-19 |
| Developer (VS7) | Pending | - |
