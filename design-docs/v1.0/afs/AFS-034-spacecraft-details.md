# AFS-034: Spacecraft Details (Battle Cruiser & Cargo Cruiser)

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-CRAFT-001, FR-CRAFT-002

---

## Summary

Detailed specifications for the two primary player-controlled spacecraft: Battle Cruiser (military transport carrying up to 4 platoons) and Cargo Cruiser (logistics transport for resources and civilians), including capacity, fuel consumption, crew requirements, and operational mechanics.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Craft entity storage
- **AFS-031 (Entity System)**: Craft entity base structure
- **AFS-032 (Craft System)**: General craft mechanics
- **AFS-033 (Platoon System)**: Platoon loading/unloading
- **AFS-014 (Navigation System)**: Journey and fuel consumption
- **AFS-021 (Resource System)**: Cargo resource handling
- **AFS-023 (Population System)**: Crew assignment

---

## Requirements

### Battle Cruiser (FR-CRAFT-001)

#### 1. Purpose and Role

**Primary Function:** Military transport and planetary assault platform
- Carries up to 4 platoons for invasion operations
- Provides orbital fire support during combat
- Defends controlled planets from enemy forces
- Transports troops between player-controlled planets

**Strategic Importance:**
- Required for all offensive military operations
- Essential for capturing enemy/neutral planets
- Main tool for projecting military power across star system

#### 2. Capacity Specifications

**Platoon Capacity:**
- **Maximum Platoons:** 4 platoons per Battle Cruiser
- **Platoon Size Range:** 1-200 troops per platoon
- **Total Troop Capacity:** Up to 800 troops (4 × 200)
- **Equipment:** Platoons carry their own equipment (not stored separately)

**Cargo Hold:**
- **No Resource Storage:** Battle Cruiser cannot carry Food/Minerals/Fuel/Energy
- **No Civilian Passengers:** Military craft only
- **Design Philosophy:** Specialized for combat, not logistics

**Visual Representation:**
- Platoon slots displayed as 4 boxes (empty/occupied indicator)
- Each occupied slot shows: Platoon ID, troop count, training %
- Example: "Platoon 03 (150 troops, 100% trained)"

#### 3. Fuel and Crew Requirements

**Fuel Consumption:**
- **Base Consumption:** 10 Fuel per day of travel
- **Distance Modifier:** Fuel cost scales with distance
- **Formula:** `Fuel Cost = Base Rate × Travel Days`
- **Example:** 5-day journey = 50 Fuel consumed

**Fuel Capacity:**
- **Internal Tank:** 200 Fuel (enough for 20 days travel)
- **Refueling:** Automatic when docked at planet with Fuel stores
- **Warning:** Display "Low Fuel" warning if tank < 50 Fuel
- **Journey Abort:** If insufficient fuel, journey cannot be initiated

**Crew Requirements:**
- **Minimum Crew:** 20 personnel (pilots, engineers, support)
- **Crew Source:** Assigned from planet population via Cargo Bay screen
- **Crew State:** Stored in craft entity as `CrewCount` integer
- **Operation:** Craft cannot launch without minimum crew
- **Crew Consumption:** No ongoing Food consumption (included in planet overhead)

**Crew Assignment Process:**
1. Select Battle Cruiser in Cargo Bay screen
2. Click "Assign Crew" button
3. Deduct 20 from planet population
4. Set craft `CrewCount = 20`, `State = Operational`
5. Craft now available for journey commands

#### 4. Operational Mechanics

**Launch and Landing:**
- **Launch:** Transition from Docking Bay to Orbit (instant)
- **Landing:** Transition from Orbit to Docking Bay (instant)
- **Surface Deployment:** Battle Cruisers cannot land on planet surface (orbit only)
- **Capacity Check:** Cannot land if Docking Bay full (max 3 craft)

**Platoon Operations:**
- **Loading:** Select platoon from planet garrison, transfer to Battle Cruiser
- **Unloading:** Select platoon from Battle Cruiser, transfer to planet garrison
- **During Journey:** Platoons aboard craft travel with ship
- **Combat:** Platoons automatically deploy during planetary assault

**Combat Integration:**
- **Orbital Bombardment:** Battle Cruiser provides fire support (future feature, AFS-043)
- **Invasion:** Platoons land from orbit when arriving at enemy planet
- **Defense:** Platoons aboard orbiting Battle Cruiser defend planet
- **Strength Bonus:** Platoons in Battle Cruiser receive +10% combat strength (morale)

#### 5. Purchase and Construction

**Cost:**
- **Purchase Price:** 150,000 Credits
- **Build Time:** 5 turns (constructed at Starbase)
- **Delivery:** Appears in Starbase Docking Bay when complete

**Construction Process:**
1. Player selects Battle Cruiser from Buy Screen
2. Deduct 150,000 Credits from player resources
3. Add to construction queue (TurnsRemaining = 5)
4. Each turn: Decrement TurnsRemaining
5. Turn 5: Create Battle Cruiser entity at Starbase

**Limitations:**
- **Maximum Fleet Size:** 32 total craft (all types combined, NFR-SCALE-001)
- **Cannot purchase if fleet full:** Display warning message
- **Cannot purchase if Docking Bay full:** Can queue for later delivery

#### 6. Visual Representation

**3D Model (from Art Requirements):**
- **Triangle Count:** 300-400 tris
- **Texture:** 256×256 diffuse (gray hull + blue accent stripes)
- **Emissive:** Engine glow (blue), weapon hardpoints (red)
- **LOD Levels:** 3 levels (400/200/50 tris)
- **Faction Colors:** Player (blue accents), AI (red accents)

**UI Icon:**
- **Size:** 64×64 pixels (pixel art)
- **Design:** Warship silhouette with angular hull
- **Color:** Blue (player), Red (enemy)

---

### Cargo Cruiser (FR-CRAFT-002)

#### 1. Purpose and Role

**Primary Function:** Logistics and resource transport
- Carries large quantities of resources between planets
- Transports civilian population for colonization
- Supplies remote colonies with Food/Minerals/Fuel/Energy
- Enables multi-planet economic strategy

**Strategic Importance:**
- Essential for moving resources to Starbase for construction
- Required for population redistribution
- Enables specialized planet roles (mining worlds, food worlds)

#### 2. Capacity Specifications

**Resource Cargo:**
- **Capacity per Resource Type:** 1,000 units
- **Resource Types:** Food, Minerals, Fuel, Energy (4 types)
- **Total Capacity:** 4,000 resource units maximum
- **Mixed Loading:** Can carry any combination (e.g., 500 Food + 500 Minerals)

**Examples:**
- Full Food load: 1,000 Food, 0 Minerals, 0 Fuel, 0 Energy
- Mixed load: 500 Food, 300 Minerals, 200 Fuel, 0 Energy
- Empty: 0/0/0/0 (available for loading)

**Civilian Passenger Capacity:**
- **Maximum Passengers:** 200 civilians
- **Purpose:** Colonization, crew transfer, population redistribution
- **Loading:** Manual selection from planet population
- **Unloading:** Automatic when docked at destination

**No Military Capacity:**
- **Cannot Carry Platoons:** Military transport is Battle Cruiser exclusive
- **Design Philosophy:** Logistics only, not combat-capable

**Visual Representation:**
- Cargo hold display shows 4 resource bars (Food/Minerals/Fuel/Energy)
- Passenger count: "Passengers: 150 / 200"
- Each bar shows: Current / Maximum (e.g., "Food: 750 / 1,000")

#### 3. Fuel and Crew Requirements

**Fuel Consumption:**
- **Base Consumption:** 8 Fuel per day of travel (lower than Battle Cruiser)
- **Distance Modifier:** Same formula as Battle Cruiser
- **Formula:** `Fuel Cost = 8 × Travel Days`
- **Example:** 5-day journey = 40 Fuel consumed
- **Efficiency:** 20% more fuel-efficient than military craft

**Fuel Capacity:**
- **Internal Tank:** 200 Fuel (enough for 25 days travel)
- **Refueling:** Automatic when docked at planet with Fuel stores
- **Self-Transport:** Can carry 1,000 Fuel in cargo hold (separate from tank)

**Crew Requirements:**
- **Minimum Crew:** 15 personnel (smaller crew than Battle Cruiser)
- **Crew Source:** Assigned from planet population
- **Operation:** Cannot launch without minimum crew
- **Crew Consumption:** No ongoing Food consumption

#### 4. Operational Mechanics

**Launch and Landing:**
- **Launch:** Transition from Docking Bay to Orbit (instant)
- **Landing:** Transition from Orbit to Docking Bay (instant)
- **Surface Deployment:** Cannot land on planet surface (orbit only)
- **Capacity Check:** Cannot land if Docking Bay full (max 3 craft)

**Resource Transfer:**
- **Loading:** Select resources from planet stores, transfer to cargo hold
- **Unloading:** Select resources from cargo hold, transfer to planet stores
- **Interface:** Cargo Bay screen with drag-and-drop or +/- buttons
- **Validation:** Cannot load more than cargo capacity
- **Validation:** Cannot load resources planet doesn't have

**Passenger Operations:**
- **Embarking:** Select number of civilians from planet population
- **Disembarking:** Passengers automatically added to destination planet population
- **During Journey:** Passengers consume no resources (trip assumed short)

**Journey Mechanics:**
- **Same as Battle Cruiser:** Uses Navigation System (AFS-014)
- **Fuel Check:** Journey aborted if insufficient fuel for round trip
- **ETA Display:** Shows arrival time in days

#### 5. Purchase and Construction

**Cost:**
- **Purchase Price:** 100,000 Credits (cheaper than Battle Cruiser)
- **Build Time:** 3 turns (faster construction)
- **Delivery:** Appears in Starbase Docking Bay when complete

**Construction Process:**
1. Player selects Cargo Cruiser from Buy Screen
2. Deduct 100,000 Credits from player resources
3. Add to construction queue (TurnsRemaining = 3)
4. Each turn: Decrement TurnsRemaining
5. Turn 3: Create Cargo Cruiser entity at Starbase

**Limitations:**
- **Maximum Fleet Size:** 32 total craft (all types combined)
- **Cannot purchase if fleet full**
- **Typical Fleet Composition:** 4-6 Cargo Cruisers recommended for logistics

#### 6. Visual Representation

**3D Model (from Art Requirements):**
- **Triangle Count:** 200-300 tris (simpler than Battle Cruiser)
- **Texture:** 256×256 (utilitarian gray, cargo containers)
- **Emissive:** Navigation lights (green/red)
- **LOD Levels:** 3 levels
- **Design:** Boxy, industrial look with visible cargo pods

**UI Icon:**
- **Size:** 64×64 pixels (pixel art)
- **Design:** Boxy transport with cargo containers
- **Color:** Gray with blue (player) or red (enemy) markings

---

## Acceptance Criteria

### Battle Cruiser Functional Criteria

- [ ] Battle Cruiser can carry up to 4 platoons simultaneously
- [ ] Platoons can be loaded/unloaded via Cargo Bay screen
- [ ] Fuel consumption: 10 Fuel per day of travel
- [ ] Minimum crew requirement: 20 personnel from planet population
- [ ] Cannot launch without crew and sufficient fuel
- [ ] Purchase cost: 150,000 Credits, build time: 5 turns
- [ ] Platoons aboard Battle Cruiser participate in planetary assault combat
- [ ] Battle Cruiser cannot carry resources or civilian passengers
- [ ] Visual display shows 4 platoon slots with occupancy indicators
- [ ] Cannot exceed 32-craft fleet limit

### Cargo Cruiser Functional Criteria

- [ ] Cargo Cruiser can carry 1,000 units per resource type (4,000 total)
- [ ] Can carry up to 200 civilian passengers
- [ ] Resources can be loaded/unloaded via Cargo Bay screen
- [ ] Fuel consumption: 8 Fuel per day of travel
- [ ] Minimum crew requirement: 15 personnel
- [ ] Cannot launch without crew and sufficient fuel
- [ ] Purchase cost: 100,000 Credits, build time: 3 turns
- [ ] Cannot carry platoons (military transport exclusive to Battle Cruiser)
- [ ] Visual display shows resource cargo bars and passenger count
- [ ] Cannot exceed 32-craft fleet limit

### Performance Criteria

- [ ] Craft loading/unloading operations complete in <500ms
- [ ] Journey initiation validates fuel availability before departure
- [ ] Crew assignment deducts from planet population immediately
- [ ] Visual updates (cargo bars, platoon slots) render in <100ms

### Integration Criteria

- [ ] Battle Cruiser integrates with Combat System (AFS-041) for assault
- [ ] Both craft types integrate with Navigation System (AFS-014) for journeys
- [ ] Cargo Cruiser integrates with Resource System (AFS-021) for transfers
- [ ] Both craft types enforce 32-craft fleet limit (NFR-SCALE-001)

---

## Implementation Notes

### State Management

**Battle Cruiser Entity:**
```csharp
class BattleCruiser : Craft {
    int CrewCount;              // Minimum 20 required
    List<int> PlatoonIDs;       // Up to 4 platoon references
    int FuelTank;               // 0-200 Fuel
    CraftState State;           // Operational, Traveling, UnderConstruction
}
```

**Cargo Cruiser Entity:**
```csharp
class CargoCruiser : Craft {
    int CrewCount;              // Minimum 15 required
    ResourceCollection Cargo;   // Food, Minerals, Fuel, Energy (max 1000 each)
    int PassengerCount;         // 0-200 civilians
    int FuelTank;               // 0-200 Fuel
    CraftState State;           // Operational, Traveling, UnderConstruction
}
```

### UI Integration

**Navigation Screen:**
- Display Battle Cruiser with platoon count: "Battle Cruiser (4 platoons)"
- Display Cargo Cruiser with cargo summary: "Cargo Cruiser (2,500 resources)"

**Cargo Bay Screen:**
- For Battle Cruiser: Show 4 platoon slots with load/unload buttons
- For Cargo Cruiser: Show resource sliders and passenger embark/disembark

### Balance Considerations

**Economic Balance:**
- Battle Cruiser (150K) = 1.5× Cargo Cruiser (100K) cost
- Reflects military vs. logistics value proposition
- Typical early game: 1-2 Battle Cruisers, 2-3 Cargo Cruisers

**Fuel Efficiency:**
- Cargo Cruiser 20% more efficient (8 vs 10 Fuel/day)
- Encourages resource logistics over military transport for economy

**Crew Ratios:**
- Battle Cruiser: 20 crew (military operations)
- Cargo Cruiser: 15 crew (simpler logistics)
- Population impact manageable for both

---

## Testing Scenarios

### Battle Cruiser Tests

1. **Platoon Loading:**
   - Given a Battle Cruiser with 0 platoons in Starbase Docking Bay
   - When player loads 4 platoons (150, 200, 175, 125 troops)
   - Then Battle Cruiser shows "4 platoons, 650 total troops"

2. **Fuel Validation:**
   - Given a Battle Cruiser with 30 Fuel in tank
   - When player attempts 5-day journey (requires 50 Fuel)
   - Then system displays "Insufficient Fuel" error and prevents launch

3. **Combat Integration:**
   - Given a Battle Cruiser arrives at enemy planet with 3 platoons
   - When combat phase begins
   - Then all 3 platoons deploy and participate in ground battle

### Cargo Cruiser Tests

1. **Resource Loading:**
   - Given a Cargo Cruiser with empty cargo hold at planet with 5,000 Food
   - When player loads 1,000 Food
   - Then cargo hold shows "Food: 1,000 / 1,000" and planet shows 4,000 Food remaining

2. **Passenger Transport:**
   - Given a Cargo Cruiser with 150 passengers traveling to destination
   - When craft arrives and lands at destination planet
   - Then planet population increases by 150

3. **Mixed Cargo:**
   - Given a Cargo Cruiser with empty hold
   - When player loads 500 Food, 300 Minerals, 200 Fuel
   - Then cargo display shows all three resources correctly
   - And total cargo = 1,000 units

---

## Future Enhancements (Post-MVP)

**Battle Cruiser:**
- Orbital bombardment damage bonus (AFS-043)
- Upgradeable armor/shields for survivability
- Platoon rapid deployment animation

**Cargo Cruiser:**
- Auto-trade routes (set source/destination, repeat journey)
- Cargo manifest tracking (historical shipments)
- Upgraded cargo capacity (research unlock)

**Both Craft Types:**
- Maintenance costs (periodic repair requirements)
- Craft naming by player
- Visual customization (paint schemes, decals)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-032 (Craft System), AFS-033 (Platoon System), AFS-014 (Navigation System)
