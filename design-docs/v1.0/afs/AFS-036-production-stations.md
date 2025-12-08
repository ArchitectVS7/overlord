# AFS-036: Production Stations (Mining & Horticultural Stations)

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-CRAFT-005, FR-CRAFT-006

---

## Summary

Detailed specifications for the two primary resource production structures: Mining Stations (produce Minerals and Fuel) and Horticultural Stations (produce Food), including placement mechanics, crew requirements, production rates, planet-specific bonuses, and operational toggles.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Building entity storage
- **AFS-012 (Planet System)**: Planet types and resource bonuses
- **AFS-021 (Resource System)**: Resource generation and storage
- **AFS-022 (Income Production)**: Per-turn resource calculation
- **AFS-023 (Population System)**: Crew assignment from population
- **AFS-061 (Building System)**: General building mechanics and placement

---

## Requirements

### Mining Station (FR-CRAFT-005)

#### 1. Purpose and Role

**Primary Function:** Surface-based resource extraction facility that produces Minerals and Fuel from planetary geological resources

**Resource Production:**
- **Minerals:** Primary output (used for construction, equipment)
- **Fuel:** Secondary output (used for craft movement, building operations)
- **Dual Output:** Both resources produced simultaneously each turn

**Strategic Importance:**
- Essential for military expansion (equipment, craft, buildings require Minerals)
- Critical for fleet operations (Fuel powers all craft journeys)
- Volcanic planets with Mining Stations create resource powerhouses (5× Minerals, 3× Fuel)

#### 2. Placement and Capacity

**Placement Locations:**
- **Surface Platforms:** 6 available platforms per planet
- **Orbit:** Cannot be placed in orbit (surface-only structure)
- **Docking Bays:** Cannot occupy Docking Bays (those are for craft)

**Surface Platform Grid:**
```
[Platform 1] [Platform 2] [Platform 3]
[Platform 4] [Platform 5] [Platform 6]
```

**Placement Rules:**
- Each platform can hold 1 Mining Station OR 1 Horticultural Station (mutually exclusive)
- Once placed, station occupies platform until manually removed/demolished
- Solar Satellites do NOT occupy surface platforms (they orbit)

**Visual Representation:**
- Platform UI shows occupied slots with station icons
- Empty slots display "Empty Platform" placeholder
- Clicking platform: Opens station detail panel or placement options

#### 3. Purchase and Construction

**Cost:**
- **Purchase Price:** 50,000 Credits
- **Build Time:** 2 turns (constructed on-planet)
- **Delivery:** Appears on selected surface platform when complete

**Purchase Process:**
1. Player opens Buy Screen, selects "Mining Station"
2. System prompts: "Select planet and surface platform for placement"
3. Player chooses planet and empty platform slot (1-6)
4. Deduct 50,000 Credits from player resources
5. Add to construction queue (TurnsRemaining = 2, Location = PlanetID + PlatformID)
6. Turn 2: Mining Station appears on designated platform, State = NeedsCrew

**Construction Queue Display:**
- "Mining Station (Planet: Gamma, Platform 3) - 2 turns"
- Progress bar showing completion percentage

**Cannot Purchase If:**
- Player has insufficient Credits (<50,000)
- All surface platforms on target planet occupied
- Planet not owned by player (neutral/enemy planets)

#### 4. Crew Requirements

**Crew Assignment:**
- **Minimum Crew:** 10 personnel (engineers, technicians, operators)
- **Crew Source:** Assigned from planet population via Planet Surface Screen
- **State Before Crew:** `State = NeedsCrew`, produces 0 resources
- **State After Crew:** `State = Operational`, begins production

**Crew Assignment Process:**
1. Select Mining Station on Planet Surface Screen
2. Click "Assign Crew" button
3. Deduct 10 from planet population
4. Set station `CrewCount = 10`, `State = Operational`
5. Station activates, begins producing next turn

**Crew Consumption:**
- **Food:** Crew consumes Food from planet stores (0.5 Food/person/turn = 5 Food/turn total)
- **Food Shortage:** If planet has insufficient Food, crew morale drops (production reduced 50%)
- **No Crew Removal:** Once assigned, crew cannot be unassigned (unless station demolished)

#### 5. Production Mechanics

**Base Production Rates:**
- **Minerals:** 100 units per turn (base rate)
- **Fuel:** 50 units per turn (base rate)
- **Formula:** `Output = Base Rate × Planet Modifier × Operational Status`

**Planet Type Modifiers:**
- **Volcanic:** 5× Minerals (500/turn), 3× Fuel (150/turn)
- **Desert:** 1× Minerals (100/turn), 1× Fuel (50/turn)
- **Tropical:** 0.5× Minerals (50/turn), 0.5× Fuel (25/turn)
- **Metropolis:** 1× Minerals (100/turn), 1× Fuel (50/turn)

**Examples:**
| Planet Type | Minerals/Turn | Fuel/Turn | Total Value |
|-------------|---------------|-----------|-------------|
| Volcanic    | 500           | 150       | 650 units   |
| Desert      | 100           | 50        | 150 units   |
| Tropical    | 50            | 25        | 75 units    |
| Metropolis  | 100           | 50        | 150 units   |

**Production Timing:**
- **Income Phase:** All Mining Stations produce during Turn Income Phase
- **Automatic:** No player action required once operational
- **Storage:** Resources added to planet's resource stores (unlimited capacity)

#### 6. Operational Controls

**ON/OFF Toggle:**
- **UI Element:** Toggle switch on Planet Surface Screen
- **Default State:** ON (operational, producing)
- **When Toggled OFF:**
  - Production stops (0 output next turn)
  - Crew remains assigned (still consumes Food)
  - Can be toggled back ON anytime (instant reactivation)

**Use Cases for OFF:**
- Resource storage management (prevent overflow, though storage is unlimited)
- Crew food conservation during shortages
- Strategic resource control (limit enemy capture value)

**Visual Indicators:**
- **ON:** Green light icon, "Operational" status
- **OFF:** Gray icon, "Inactive" status
- **Needs Crew:** Red icon, "Requires Crew" status

#### 7. Visual Representation

**3D Model (from Art Requirements):**
- **Triangle Count:** 200 tris
- **Texture:** 128×128 (industrial machinery, drill equipment)
- **Emissive:** Green status lights when operational
- **Animation:** Rotating drill bit (when ON)
- **LOD Levels:** 2 levels (200/100 tris)

**UI Icon:**
- **Size:** 64×64 pixels (pixel art)
- **Design:** Drill + rocks symbol
- **Color:** Gray machinery with green (ON) or red (OFF) indicator

---

### Horticultural Station (FR-CRAFT-006)

#### 1. Purpose and Role

**Primary Function:** Surface-based agricultural facility that produces Food for population consumption and export

**Resource Production:**
- **Food:** Only output (sustains population, enables growth)
- **Single Output:** Focused on Food production only

**Strategic Importance:**
- Essential for population growth (population consumes Food every turn)
- Required for large populations (1,000+ requires substantial Food production)
- Tropical planets with Horticultural Stations create Food surplus for export

#### 2. Placement and Capacity

**Placement Locations:**
- **Surface Platforms:** 6 available platforms per planet (same as Mining Stations)
- **Orbit:** Cannot be placed in orbit (surface-only structure)
- **Mutual Exclusion:** Cannot coexist with Mining Station on same platform

**Platform Selection Strategy:**
- **Volcanic Planets:** Prioritize Mining Stations (poor Food yield)
- **Tropical Planets:** Prioritize Horticultural Stations (2× Food yield)
- **Desert/Metropolis:** Balanced approach based on needs

#### 3. Purchase and Construction

**Cost:**
- **Purchase Price:** 40,000 Credits (cheaper than Mining Station)
- **Build Time:** 2 turns (same as Mining Station)
- **Delivery:** Appears on selected surface platform when complete

**Purchase Process:**
1. Player opens Buy Screen, selects "Horticultural Station"
2. System prompts: "Select planet and surface platform for placement"
3. Player chooses planet and empty platform slot (1-6)
4. Deduct 40,000 Credits from player resources
5. Add to construction queue (TurnsRemaining = 2)
6. Turn 2: Horticultural Station appears on platform, State = NeedsCrew

**Cost Rationale:**
- Cheaper than Mining Station (40K vs 50K)
- Food less strategically critical than Minerals/Fuel (early game)
- Balances building choices between resource types

#### 4. Crew Requirements

**Crew Assignment:**
- **Minimum Crew:** 8 personnel (farmers, botanists, technicians)
- **Crew Source:** Assigned from planet population
- **State Before Crew:** `State = NeedsCrew`, produces 0 Food
- **State After Crew:** `State = Operational`, begins production

**Crew Assignment Process:**
(Same as Mining Station, but only 8 crew instead of 10)

**Crew Consumption:**
- **Food:** 4 Food/turn (8 crew × 0.5 Food/person)
- **Net Production:** Food produced minus crew consumption = net gain
- **Example:** 200 Food produced - 4 consumed = 196 net Food/turn

#### 5. Production Mechanics

**Base Production Rate:**
- **Food:** 200 units per turn (base rate)
- **Formula:** `Output = Base Rate × Planet Modifier × Operational Status`

**Planet Type Modifiers:**
- **Tropical:** 2× Food (400/turn) - **BEST**
- **Desert:** 0.25× Food (50/turn) - **WORST**
- **Volcanic:** 0.5× Food (100/turn) - **POOR**
- **Metropolis:** 1× Food (200/turn) - **NORMAL**

**Examples:**
| Planet Type | Food/Turn | Crew Consumption | Net Food/Turn |
|-------------|-----------|------------------|---------------|
| Tropical    | 400       | -4               | +396          |
| Metropolis  | 200       | -4               | +196          |
| Volcanic    | 100       | -4               | +96           |
| Desert      | 50        | -4               | +46           |

**Production Timing:**
- **Income Phase:** All Horticultural Stations produce during Income Phase
- **Before Consumption:** Production happens before population consumes Food
- **Net Effect:** Station output - crew consumption - population consumption = storage change

#### 6. Operational Controls

**ON/OFF Toggle:**
(Same mechanics as Mining Station)

**Use Cases for OFF:**
- Food surplus management
- Prevent crew Food consumption during shortage
- Temporarily halt production during crisis

**Visual Indicators:**
- **ON:** Cyan grow lights emissive, "Operational" status
- **OFF:** Dark, "Inactive" status
- **Needs Crew:** Red icon, "Requires Crew" status

#### 7. Visual Representation

**3D Model (from Art Requirements):**
- **Triangle Count:** 150 tris
- **Texture:** 128×128 (greenhouse domes, biodomes)
- **Emissive:** Cyan grow lights when operational
- **Animation:** Gentle pulsing lights (simulating plant growth)
- **LOD Levels:** 2 levels (150/75 tris)

**UI Icon:**
- **Size:** 64×64 pixels (pixel art)
- **Design:** Dome + plant symbol
- **Color:** Green dome with cyan (ON) or red (OFF) indicator

---

## Acceptance Criteria

### Mining Station Functional Criteria

- [ ] Mining Station can be purchased for 50,000 Credits
- [ ] Builds in 2 turns on selected surface platform
- [ ] Requires 10 crew from planet population to operate
- [ ] Produces 100 Minerals + 50 Fuel per turn (base rate)
- [ ] Production multiplied by planet type modifier (Volcanic: 5× Minerals, 3× Fuel)
- [ ] Can be toggled ON/OFF via Planet Surface Screen
- [ ] When OFF, produces 0 resources but crew still consumes Food
- [ ] Crew consumes 5 Food per turn when operational

### Horticultural Station Functional Criteria

- [ ] Horticultural Station can be purchased for 40,000 Credits
- [ ] Builds in 2 turns on selected surface platform
- [ ] Requires 8 crew from planet population to operate
- [ ] Produces 200 Food per turn (base rate)
- [ ] Production multiplied by planet type modifier (Tropical: 2×)
- [ ] Can be toggled ON/OFF via Planet Surface Screen
- [ ] Crew consumes 4 Food per turn
- [ ] Net Food production = Gross production - Crew consumption

### Platform Management Criteria

- [ ] Each planet has 6 surface platforms for building placement
- [ ] Mining and Horticultural Stations occupy surface platforms (1 per platform)
- [ ] Cannot place station if all 6 platforms occupied
- [ ] Planet Surface Screen displays all 6 platforms with occupancy status
- [ ] Player can select empty platform for new station placement

### UI and Visual Criteria

- [ ] Buy Screen displays station cost, build time, and resource output
- [ ] Construction queue shows station location (planet + platform number)
- [ ] Planet Surface Screen shows ON/OFF toggle for each operational station
- [ ] Station icons display operational status (ON/OFF/Needs Crew)
- [ ] Production statistics visible on planet overview

### Performance Criteria

- [ ] Production calculation (<10ms) during Income Phase for all stations
- [ ] ON/OFF toggle response (<100ms)
- [ ] Platform selection UI responsive (<200ms)

---

## Implementation Notes

### Entity Structure

**Mining Station Entity:**
```csharp
class MiningStation : Building {
    int CrewCount;              // 10 required
    bool IsOperational;         // True if crew assigned and ON
    int PlatformSlot;           // 1-6 surface platform number
    BuildingState State;        // NeedsCrew, Operational, Inactive, UnderConstruction
}
```

**Horticultural Station Entity:**
```csharp
class HorticulturalStation : Building {
    int CrewCount;              // 8 required
    bool IsOperational;         // True if crew assigned and ON
    int PlatformSlot;           // 1-6 surface platform number
    BuildingState State;        // NeedsCrew, Operational, Inactive, UnderConstruction
}
```

### Production Calculation

**Income Phase Logic:**
```csharp
void CalculateResourceIncome(Planet planet) {
    foreach (MiningStation station in planet.GetMiningStations()) {
        if (station.IsOperational) {
            int minerals = 100 * planet.GetMineralModifier();
            int fuel = 50 * planet.GetFuelModifier();
            planet.Resources.Minerals += minerals;
            planet.Resources.Fuel += fuel;

            // Crew consumption
            planet.Resources.Food -= 5;
        }
    }

    foreach (HorticulturalStation station in planet.GetHorticulturalStations()) {
        if (station.IsOperational) {
            int food = 200 * planet.GetFoodModifier();
            planet.Resources.Food += food;

            // Crew consumption
            planet.Resources.Food -= 4;
        }
    }
}
```

### Planet Modifier Methods

```csharp
float GetMineralModifier() {
    return Type switch {
        PlanetType.Volcanic => 5.0f,
        PlanetType.Tropical => 0.5f,
        _ => 1.0f
    };
}

float GetFuelModifier() {
    return Type switch {
        PlanetType.Volcanic => 3.0f,
        PlanetType.Tropical => 0.5f,
        _ => 1.0f
    };
}

float GetFoodModifier() {
    return Type switch {
        PlanetType.Tropical => 2.0f,
        PlanetType.Desert => 0.25f,
        PlanetType.Volcanic => 0.5f,
        _ => 1.0f
    };
}
```

---

## Testing Scenarios

### Mining Station Tests

1. **Volcanic Planet Production:**
   - Given Mining Station on Volcanic planet with crew
   - When Income Phase executes
   - Then planet gains 500 Minerals and 150 Fuel

2. **Toggle OFF:**
   - Given operational Mining Station producing resources
   - When player toggles station OFF
   - Then next turn production = 0 but crew still consumes 5 Food

3. **Insufficient Food:**
   - Given planet has 3 Food remaining and Mining Station needs 5 Food for crew
   - When Income Phase executes
   - Then production reduced to 50% and Food deficit warning displayed

### Horticultural Station Tests

1. **Tropical Planet Production:**
   - Given Horticultural Station on Tropical planet with crew
   - When Income Phase executes
   - Then planet gains 400 Food (gross) - 4 Food (crew) = 396 net Food

2. **Platform Limit:**
   - Given planet has 6 Horticultural Stations (all platforms occupied)
   - When player attempts to build 7th station
   - Then Buy Screen displays "No available platforms" error

3. **Net Food Calculation:**
   - Given Desert planet Horticultural Station (50 Food/turn gross)
   - When crew consumes 4 Food
   - Then net Food = 46 Food/turn

---

## Strategic Considerations

### Optimal Planet Development

**Volcanic Planets:**
- Build 4-5 Mining Stations (maximize Mineral/Fuel production)
- Build 1 Horticultural Station (minimal Food for crew)
- Export Minerals/Fuel to Starbase for construction

**Tropical Planets:**
- Build 4-5 Horticultural Stations (maximize Food production)
- Build 1 Mining Station (minimal Minerals for basic needs)
- Export Food to support high-population planets

**Desert Planets:**
- Build 3 Mining Stations (normal Mineral/Fuel)
- Build 2-3 Solar Satellites in orbit (Energy production)
- Minimal Horticultural Stations (poor Food yield)

**Metropolis Planets (Starbase):**
- Balanced approach (2-3 of each type)
- Focus on population growth for tax revenue
- Central hub for construction and military

### Economic Balance

**Mining Station ROI:**
- Cost: 50,000 Credits
- Volcanic production: 500 Minerals + 150 Fuel = 650 units/turn
- Break-even: ~77 turns (if valued at 1:1 Credit ratio)
- **High value** due to Mineral scarcity and Fuel necessity

**Horticultural Station ROI:**
- Cost: 40,000 Credits
- Tropical production: 396 net Food/turn
- Break-even: ~101 turns
- **Moderate value** - Food abundant but necessary for growth

---

## Future Enhancements (Post-MVP)

**Mining Station Upgrades:**
- Automated mining (no crew required)
- Deep core drilling (+50% production)
- Refined output (Minerals → Advanced Materials)

**Horticultural Station Upgrades:**
- Hydroponics (works on any planet type at 1.5× rate)
- Genetic modification (+100% Food yield)
- Food processing (Food → Packaged Rations, longer storage)

**Hybrid Facilities:**
- Multi-resource stations (produce 2+ resource types)
- Convertible stations (switch between types)
- Modular platforms (upgrade in place)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-021 (Resource System), AFS-022 (Income Production), AFS-061 (Building System)
