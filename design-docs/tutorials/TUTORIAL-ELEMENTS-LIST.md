# Tutorial Elements List

**Version:** 1.0.0
**Created:** 2025-12-19
**Purpose:** Comprehensive list of game elements requiring tutorials for player onboarding

---

## Overview

This document identifies all discrete game mechanics that require dedicated tutorials. Each element will be validated through:
1. Tutorial scenario (Flash Conflict format)
2. E2E test (Playwright)
3. Design alignment review

---

## Tutorial Tiers (Learning Progression)

### Tier 1: Foundation (Learn First)

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T01 | Main Menu Navigation | Understand menu options and navigation | Button clicks, navigation flow | Pending |
| T02 | Galaxy Map Orientation | Read the galaxy map, identify planets, understand HUD | Planet colors, connections, resource bar | Pending |
| **T03** | **Planet Selection** | **Click planets and view the info panel** | **Clicking, panel open/close** | **In Progress** |
| T04 | Understanding Resources | Learn the 5 resource types and their purposes | Credits, Minerals, Fuel, Food, Energy | Pending |
| T05 | Turn Advancement | End turn with SPACE, watch income phase execute | Turn cycle, automatic phases | Pending |

---

### Tier 2: Economy (Build First)

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| **T06** | **Building Your First Structure** | **Complete build process from menu to confirmation** | **Build menu, costs, build times, confirmation** | **In Progress** |
| T07 | Food Production | Build Horticultural Station, prevent starvation | Food consumption, population needs | Pending |
| T08 | Mining Production | Build Mining Station, understand Mineral/Fuel output | Resource production, planet bonuses | Pending |
| T09 | Tax Rate Management | Adjust taxes, understand morale tradeoffs | Slider control, morale effects | Pending |
| T10 | Population Growth | Watch population grow, understand morale impact | Growth formula, morale, food | Pending |
| T11 | Building Slots & Crew | Understand 5-slot limit and crew requirements | Slot management, crew allocation | Pending |
| T12 | Planet Specialization | Match buildings to planet type bonuses | Volcanic 5×Min, Tropical 2×Food, etc. | Pending |

---

### Tier 3: Infrastructure

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T13 | Building a Docking Bay | Prerequisite for spacecraft construction | Building, prerequisite unlock | Pending |
| T14 | Constructing Battle Cruiser | Build first military spacecraft | Spacecraft menu, costs, crew | Pending |
| T15 | Constructing Cargo Cruiser | Build transport for resources | Resource capacity, transport role | Pending |
| T16 | Atmosphere Processor | Build colonization spacecraft | Colonization tool | Pending |
| T17 | Solar Satellite Deployment | Build orbital energy producer | Energy production, space-based | Pending |
| T18 | Building Orbital Defense | Construct planetary defenses | Defense bonus, protection | Pending |

---

### Tier 4: Military

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T19 | Commissioning a Platoon | Create ground military unit | Troop count, equipment, weapons, training | Pending |
| T20 | Platoon Training | Wait for training (0%→100%), understand timing | 10-turn training, combat strength | Pending |
| T21 | Equipment & Weapons Selection | Choose equipment tier and weapon type | Multipliers, cost/benefit | Pending |
| T22 | Embarking Platoons | Load trained platoons onto Battle Cruiser | Transport capacity, embark/disembark | Pending |
| T23 | Disembarking Platoons | Unload platoons at destination | Garrison, invasion prep | Pending |

---

### Tier 5: Movement & Expansion

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T24 | Fleet Navigation | Send spacecraft to another planet | Destination selection, travel time, fuel | Pending |
| T25 | Colonizing a Neutral Planet | Use Atmosphere Processor to claim new world | Colonization process, neutral targeting | Pending |
| T26 | Resource Transport | Load/unload cargo with Cargo Cruisers | Loading interface, transfer mechanics | Pending |
| T27 | Multi-Planet Management | Manage economy across 2+ planets | Switching focus, supply lines | Pending |

---

### Tier 6: Combat

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T28 | Space Combat Basics | Watch fleet vs fleet battle resolve | Attack/defense calculation, casualties | Pending |
| T29 | Orbital Defense Combat | Fight against defended planet | Defense bonus, tougher battle | Pending |
| T30 | Ground Invasion | Disembark platoons, capture enemy planet | Ground combat, resource capture | Pending |
| T31 | Defending Against Invasion | Garrison platoons, repel enemy attack | Defense preparation, garrison strength | Pending |
| T32 | Combat Strength Calculation | Understand what makes units powerful | Troops × Equipment × Weapons × Training | Pending |

---

### Tier 7: Advanced

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T33 | Weapon Tier Research | Upgrade from Laser to Missile/Photon | Research costs, time, global upgrade | Pending |
| T34 | Economic Warfare | Cut off enemy resources via blockade | Strategic positioning | Pending |
| T35 | Counter-Attack Strategy | Respond to enemy aggression | Reactive gameplay | Pending |
| T36 | Victory Achievement | Win by conquering all enemy planets | Victory conditions | Pending |
| T37 | Defeat Recovery | Recognize when losing, attempt comeback | Defeat conditions, recovery | Pending |

---

### Tier 8: System/Meta

| ID | Element | Description | Key Mechanics | Status |
|----|---------|-------------|---------------|--------|
| T38 | Campaign Setup | Configure galaxy size, difficulty, AI personality | Pre-game options | Pending |
| T39 | Saving Your Game | Save progress to continue later | Save system | Pending |
| T40 | Loading a Save | Resume from saved game | Load system | Pending |
| T41 | Flash Conflicts Overview | Understand tutorial/scenario system | Scenario selection | Pending |
| T42 | Help Menu Usage | Access in-game help and quick reference | Help overlay | Pending |

---

## Priority Implementation Order

For iterative validation, tutorials should be built in this order:

| Priority | Tutorial ID | Element | Rationale |
|----------|-------------|---------|-----------|
| 1 | T03 | Planet Selection | Simplest interaction, validates click mechanics |
| 2 | T06 | Building a Structure | Core gameplay loop, tests build menu flow |
| 3 | T05 | Turn Advancement | Validates turn cycle works |
| 4 | T24 | Fleet Navigation | Tests spacecraft movement UI |
| 5 | T25 | Colonizing a Planet | End-to-end expansion flow |
| 6 | T19 | Commissioning Platoons | Military UI validation |
| 7 | T30 | Ground Invasion | Combat system validation |

---

## Validation Methodology

Each tutorial element undergoes three-phase validation:

### Phase 1: E2E Test
- Playwright test validates tutorial runs without errors
- Captures screenshots at key steps
- Verifies UI elements exist and are clickable

### Phase 2: Human Playthrough
- Developer manually runs the tutorial
- Confirms alignment with design vision
- Notes any UI gaps or confusing steps

### Phase 3: Design Review
- Compare tutorial flow to PRD requirements (FR25-FR31)
- Verify scenario JSON matches schema
- Document any discrepancies for resolution

---

## Progress Tracking

| Phase | Tutorials Complete | E2E Tests Passing | Notes |
|-------|-------------------|-------------------|-------|
| Initial | 0/42 | 0/42 | Starting with T03, T06 |

---

## Related Documents

- [TUTORIAL-METHODOLOGY.md](./TUTORIAL-METHODOLOGY.md) - Standard process for creating tutorials
- [scenario-pack-schema.md](../specifications/scenario-pack-schema.md) - JSON schema for scenarios
- [scenario-authoring.md](../for-developers/patterns/scenario-authoring.md) - Authoring guide
- [prd.md](../for-managers/prd.md) - Product requirements (FR25-FR31)

---

**Total Tutorial Elements: 42**
