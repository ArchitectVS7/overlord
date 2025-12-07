# AFS-035: Terraforming System (Atmosphere Processor & Colonization)

**Status:** Draft
**Priority:** P0 (Critical)
**Owner:** Lead Developer
**PRD Reference:** FR-COLONY-001, FR-CRAFT-004

---

## Summary

Terraforming and colonization system that enables players to convert neutral planets into productive colonies using Atmosphere Processors, expanding territorial control and resource production capacity across the star system.

---

## Dependencies

- **AFS-001 (Game State Manager)**: Planet ownership and state changes
- **AFS-011 (Galaxy Generation)**: Neutral planet existence
- **AFS-012 (Planet System)**: Planet properties and types
- **AFS-014 (Navigation System)**: Atmosphere Processor journey
- **AFS-031 (Entity System)**: Atmosphere Processor as craft entity
- **AFS-021 (Resource System)**: Initial resource allocation for new colonies

---

## Requirements

### Atmosphere Processor Craft (FR-CRAFT-004)

#### 1. Purpose and Role

**Primary Function:** Single-use terraforming device that converts uninhabited neutral planets into player-controlled colonies

**Strategic Importance:**
- Only method to claim neutral planets
- Essential for territorial expansion beyond starting planet (Starbase)
- Enables multi-planet empire building
- Critical for accessing planet-specific resource bonuses (Volcanic: Minerals, Desert: Energy, etc.)

**Design Philosophy:**
- Single-use consumable (destroyed during terraforming process)
- Cannot be recovered or reused
- Expensive investment requiring strategic planet selection

#### 2. Ownership and Limitations

**Single Ownership Rule:**
- **Maximum Owned:** 1 Atmosphere Processor at any time
- **Cannot Purchase:** If player already owns one (active or in construction)
- **Purchase Enabled:** Only after current Processor used (destroyed) or sold
- **Rationale:** Prevents excessive expansion, forces strategic planet selection

**UI Feedback:**
- If player owns Processor: "Already own Atmosphere Processor" grayed out in Buy Screen
- If player can purchase: Normal purchase button enabled
- Status indicator: "Atmosphere Processor: In Inventory" or "Atmosphere Processor: None"

#### 3. Purchase and Construction

**Cost:**
- **Purchase Price:** 200,000 Credits (most expensive craft)
- **Build Time:** 8 turns (longest construction time)
- **Delivery:** Appears in Starbase Docking Bay when complete

**Construction Process:**
1. Player selects Atmosphere Processor from Buy Screen
2. Validate: Player does not already own one
3. Deduct 200,000 Credits from player resources
4. Add to construction queue (TurnsRemaining = 8)
5. Each turn: Decrement TurnsRemaining, display "Under Construction (X turns)"
6. Turn 8: Create Atmosphere Processor entity at Starbase, State = Operational

**High Cost Justification:**
- Unlocks permanent new colony (huge strategic value)
- Generates ongoing resource income from new planet
- Long-term investment with compounding returns

#### 4. Operational Mechanics

**Nuclear Powered (No Crew Required):**
- **Crew:** 0 personnel required (autonomous operation)
- **Fuel:** No fuel consumption (nuclear reactor powered)
- **Advantage:** Can launch immediately after purchase without preparation
- **Rationale:** Advanced automated terraforming technology

**Journey to Target Planet:**
1. **Launch:** Atmosphere Processor launches from Starbase to orbit (instant)
2. **Navigation:** Player selects neutral planet destination via Navigation Screen
3. **Journey:** Uses standard navigation mechanics (AFS-014) but consumes no fuel
4. **ETA:** Displays estimated arrival time in days
5. **Arrival:** Automatically transitions to terraforming upon reaching neutral planet

**Abort Journey:**
- **Allowed:** Player can abort journey mid-flight
- **Effect:** Processor returns to Starbase orbit, can be redeployed
- **Use Case:** Strategic change (different planet chosen, enemy threat)

#### 5. Terraforming Process (FR-COLONY-001)

**Automatic Triggering:**
- **Condition:** Atmosphere Processor arrives at neutral planet
- **Action:** Terraforming begins immediately (no player confirmation needed)
- **State Change:** Planet ownership → Player faction
- **Processor Fate:** Consumed/destroyed during process

**Terraforming Duration:**
- **Small Planet (Desert):** 3 turns
- **Medium Planet (Tropical, Volcanic):** 5 turns
- **Large Planet (Metropolis):** 8 turns
- **Note:** Neutral planets are typically Small/Medium (3-5 turns)

**Planet Size Determination:**
- **Visual Size:** Planet model scale in galaxy view
- **Stored Value:** `PlanetData.Size` enum (Small, Medium, Large)
- **Display:** "Terraforming in progress (3 turns remaining)"

**Terraforming Phases:**
1. **Turn 1-N:** Processor orbits planet, displays terraforming animation
   - Visual: Energy waves emanating from processor to planet
   - UI: Progress bar showing completion percentage
   - Planet: Pulsing/animated to indicate active terraforming

2. **Turn N (Final):** Terraforming completes
   - Atmosphere Processor destroyed (removed from game)
   - Planet ownership transferred to player
   - Planet initialized with default structures (see below)
   - Message log: "Planet [Name] successfully colonized!"

**Cannot Be Interrupted:**
- Once terraforming starts, cannot be aborted
- Enemy cannot destroy Processor during terraforming (protected)
- Player must defend planet if enemy fleet arrives

#### 6. New Colony Initialization

**Default Structures (Auto-Created):**
- **3 Docking Bays:** Pre-built at new colony (same as Starbase)
- **Rationale:** Enables immediate craft docking and operations
- **Cost:** Included in Atmosphere Processor price (no additional charge)

**Initial Resources:**
- **Food:** 500 units (starter supply)
- **Minerals:** 500 units
- **Fuel:** 500 units
- **Energy:** 500 units
- **Credits:** 0 (no starting Credits)
- **Purpose:** Allows colony to function immediately, build first structures

**Initial Population:**
- **Population:** 100 civilians (colonists from Starbase)
- **Source:** Deducted from Starbase population when terraforming completes
- **Morale:** 50% (moderate, no tax pressure yet)
- **Tax Rate:** 0% (player can adjust)

**Planet Properties Retained:**
- **Planet Type:** Unchanged (Volcanic/Desert/Tropical remains)
- **Resource Bonuses:** Active (e.g., Volcanic 5× Mineral yield)
- **Orbital Position:** Unchanged
- **Name:** Unchanged (or player can rename)

#### 7. Visual Representation

**3D Model (from Art Requirements):**
- **Triangle Count:** 150-200 tris
- **Texture:** 128×128 (industrial machinery, processing vents)
- **Emissive:** Cyan glow from processing vents (active terraforming)
- **Animation:** Rotating processing modules
- **LOD Levels:** 2 levels (200/100 tris)

**UI Icon:**
- **Size:** 64×64 pixels (pixel art)
- **Design:** Smokestack machine with energy field
- **Color:** Gray body with cyan energy accents

**Terraforming VFX:**
- **Planet Animation:** Pulsing atmospheric glow effect
- **Energy Waves:** Particle effect from Processor to planet surface
- **Duration:** Looping animation during terraforming turns
- **Completion:** Flash effect when terraforming completes

---

### Strategic Considerations

#### 1. Planet Selection Strategy

**Volcanic Planets:**
- **Bonus:** 5× Mineral yield, 3× Fuel yield
- **Best For:** Resource production worlds
- **Strategy:** Build Mining Stations, export to Starbase for construction

**Desert Planets:**
- **Bonus:** 2× Energy from Solar Satellites
- **Best For:** Energy production
- **Strategy:** Build multiple Solar Satellites for Energy-intensive operations

**Tropical Planets:**
- **Bonus:** 2× Food from Horticultural Stations
- **Best For:** Population support, Food export
- **Strategy:** Build Horticultural Stations, supply other colonies

#### 2. Expansion Timing

**Early Game (Turns 1-10):**
- Save Credits for first Atmosphere Processor (200K)
- Identify best neutral planet (usually Volcanic for resources)
- Purchase Processor, send to chosen planet

**Mid Game (Turns 11-30):**
- After first colony established, save for second Processor
- Expand to 2-3 total planets (including Starbase)
- Diversify planet types for balanced economy

**Late Game (Turns 31+):**
- Control 4+ planets for maximum production
- All neutral planets claimed (player or AI-controlled)
- Focus shifts from expansion to military conquest

#### 3. Economic Impact

**Immediate Costs:**
- 200,000 Credits (Atmosphere Processor purchase)
- 100 population (colonist transfer from Starbase)
- 8 turns wait (construction time)

**Long-Term Returns:**
- Permanent new colony with ongoing resource generation
- Access to planet-specific bonuses (e.g., 5× Mineral yield)
- Additional building slots (6 surface platforms)
- Strategic positioning for military operations

**Break-Even Point:**
- Typically 15-20 turns after colonization
- Varies based on planet type and development

---

## Acceptance Criteria

### Atmosphere Processor Functional Criteria

- [ ] Player can purchase Atmosphere Processor for 200,000 Credits
- [ ] Processor builds in 8 turns at Starbase
- [ ] Player cannot own more than 1 Atmosphere Processor simultaneously
- [ ] Processor requires no crew and consumes no fuel
- [ ] Processor can journey to neutral planets via Navigation Screen
- [ ] Journey can be aborted mid-flight, returning Processor to Starbase

### Terraforming Process Criteria

- [ ] Terraforming begins automatically upon Processor arrival at neutral planet
- [ ] Terraforming duration: 3-8 turns based on planet size
- [ ] Planet displays terraforming animation and progress bar
- [ ] Terraforming cannot be interrupted once started
- [ ] Atmosphere Processor destroyed upon terraforming completion

### Colony Initialization Criteria

- [ ] New colony receives 3 pre-built Docking Bays
- [ ] New colony receives 500 units of each resource (Food/Minerals/Fuel/Energy)
- [ ] New colony receives 100 population (deducted from Starbase)
- [ ] Planet ownership transfers to player faction
- [ ] Planet type and resource bonuses retained
- [ ] Player receives "Planet colonized" message upon completion

### UI and Visual Criteria

- [ ] Buy Screen shows "Already own Processor" if player owns one
- [ ] Navigation Screen displays Atmosphere Processor destination and ETA
- [ ] Galaxy view shows terraforming animation on planet during process
- [ ] Progress bar displays "Terraforming: X turns remaining"
- [ ] Completion displays success message with colony name

### Performance Criteria

- [ ] Terraforming animation runs smoothly at 30+ FPS
- [ ] Colony initialization completes in <1 second
- [ ] Purchase validation (<100ms) prevents duplicate ownership

---

## Implementation Notes

### State Management

**Atmosphere Processor Entity:**
```csharp
class AtmosphereProcessor : Craft {
    CraftState State;           // Operational, Traveling, Terraforming
    int TargetPlanetID;         // Destination neutral planet
    int TurnsRemaining;         // Terraforming countdown (3-8 turns)
}
```

**Planet State Changes:**
```csharp
class Planet {
    FactionType Owner;          // Neutral → Player upon terraforming
    bool IsTerraforming;        // True during terraforming process
    int TerraformingTurns;      // Countdown to completion
}
```

### Game Loop Integration

**Turn System Integration:**
```csharp
// During Turn End Phase:
foreach (Planet planet in planets.Where(p => p.IsTerraforming)) {
    planet.TerraformingTurns--;
    if (planet.TerraformingTurns == 0) {
        CompleteTerraforming(planet);
        DestroyAtmosphereProcessor(planet);
        InitializeColony(planet);
    }
}
```

**Colonization Method:**
```csharp
void InitializeColony(Planet planet) {
    planet.Owner = FactionType.Player;
    planet.IsTerraforming = false;

    // Add default structures
    planet.DockingBays = 3;

    // Add starting resources
    planet.Resources.Food = 500;
    planet.Resources.Minerals = 500;
    planet.Resources.Fuel = 500;
    planet.Resources.Energy = 500;

    // Transfer population from Starbase
    Planet starbase = GetPlayerStarbase();
    starbase.Population -= 100;
    planet.Population = 100;
    planet.Morale = 50;
    planet.TaxRate = 0;

    // Log message
    MessageLog.Add($"Planet {planet.Name} successfully colonized!");
}
```

### UI Integration

**Buy Screen:**
```csharp
bool CanPurchaseAtmosphereProcessor() {
    // Check if player already owns one
    bool ownsProcessor = GameState.Craft.Any(c =>
        c.Type == CraftType.AtmosphereProcessor &&
        c.Owner == FactionType.Player
    );

    return !ownsProcessor && PlayerCredits >= 200000;
}
```

**Navigation Screen:**
- Display Atmosphere Processor in craft list
- Enable "Select Destination" for neutral planets only
- Disable enemy/player planets as destinations

---

## Testing Scenarios

### Purchase and Ownership Tests

1. **Single Ownership Enforcement:**
   - Given player owns 1 Atmosphere Processor
   - When player attempts to purchase another
   - Then Buy Screen displays "Already own Atmosphere Processor" (disabled)

2. **Purchase After Use:**
   - Given player used Atmosphere Processor to colonize planet
   - When player checks Buy Screen
   - Then Atmosphere Processor purchase option is enabled again

### Terraforming Process Tests

1. **Automatic Start:**
   - Given Atmosphere Processor traveling to neutral Desert planet
   - When Processor arrives at planet
   - Then terraforming begins automatically with 3-turn countdown

2. **Colony Initialization:**
   - Given planet completes 3-turn terraforming process
   - When final turn ends
   - Then planet has: 3 Docking Bays, 500 resources each, 100 population, Player ownership

3. **Population Transfer:**
   - Given Starbase has 1,500 population
   - When new colony is initialized
   - Then Starbase has 1,400 population and new colony has 100

### Strategic Tests

1. **Volcanic Planet Value:**
   - Given player colonizes Volcanic planet
   - When Mining Station built and operating
   - Then Mineral production is 5× base rate

2. **Multi-Colony Expansion:**
   - Given player has Starbase + 1 colonized planet
   - When player purchases second Atmosphere Processor
   - Then second neutral planet can be colonized independently

---

## Balance Considerations

**Economic Balance:**
- **High Cost (200K):** Prevents early-game spam, requires strategic saving
- **Long Build Time (8 turns):** Creates urgency, forces planning ahead
- **Single Ownership:** Prevents excessive expansion speed
- **Break-Even:** 15-20 turns justifies cost with ongoing returns

**Strategic Balance:**
- **Planet Type Matters:** Choosing right planet for bonuses critical
- **Timing Matters:** Too early = weak economy, too late = AI claims planets
- **Population Cost:** 100 colonists reduces Starbase workforce temporarily

**AI Behavior:**
- AI should also purchase Atmosphere Processors
- AI should prioritize valuable planet types (Volcanic > Desert > Tropical)
- AI expansion creates competition for neutral planets

---

## Future Enhancements (Post-MVP)

**Advanced Terraforming:**
- Faster terraforming technology (research unlock)
- Multi-planet terraforming (own 2 Processors simultaneously)
- Terraform enemy planets (sabotage, flip ownership)

**Colony Customization:**
- Player chooses starting resources allocation
- Player names new colonies
- Special colony types (mining outpost, food world, military base)

**Terraforming Disasters:**
- Random events during terraforming (10% chance)
- Failures requiring second Processor attempt
- Partial success (reduced initial resources)

---

**Document Owner:** Lead Developer
**Review Status:** Awaiting Review
**Related AFS:** AFS-011 (Galaxy Generation), AFS-012 (Planet System), AFS-014 (Navigation System)
