# OVERLORD: Game Design Document

**Version:** 1.0
**Last Updated:** December 21, 2025
**Game Type:** Turn-Based 4X Strategy
**Players:** 1 Player vs AI Opponent

---

## Table of Contents

1. [Game Overview](#game-overview)
2. [Objective & Victory Conditions](#objective--victory-conditions)
3. [Turn Sequence](#turn-sequence)
4. [Resources](#resources)
5. [Planets & Colonization](#planets--colonization)
6. [Buildings & Structures](#buildings--structures)
7. [Military Units](#military-units)
8. [Spacecraft](#spacecraft)
9. [Combat System](#combat-system)
10. [Population & Morale](#population--morale)
11. [AI Opponent Strategy](#ai-opponent-strategy)
12. [Game Balance & Difficulty](#game-balance--difficulty)

---

## Game Overview

**Overlord** is a turn-based 4X (eXplore, eXpand, eXploit, eXterminate) strategy game set in space. You control a galactic faction competing against an AI opponent to dominate the galaxy through conquest, economic superiority, or strategic objectives.

### Core Gameplay Loop

Each turn, you will:
1. Collect resources from your planets
2. Build infrastructure and military units
3. Move your fleets across the galaxy
4. Engage in combat with enemy forces
5. Expand your empire to new worlds

The game progresses through distinct phases each turn, with some actions automated (resource collection, combat resolution) and others requiring your strategic decisions.

---

## Objective & Victory Conditions

### Primary Victory Condition

**Defeat the Enemy:** Capture all planets controlled by the AI opponent.

### Alternative Victory Conditions

The game supports multiple victory conditions depending on the scenario:

| Victory Type | Requirement |
|--------------|-------------|
| **Total Conquest** | Capture all planets in the galaxy |
| **Specific Target** | Capture a designated enemy homeworld |
| **Economic Victory** | Accumulate a target amount of resources |
| **Military Supremacy** | Destroy all enemy spacecraft |
| **Survival** | Survive for a set number of turns |
| **Development** | Build a certain number of advanced structures |

**Defeat Condition:** You lose if the AI captures all of your planets.

---

## Turn Sequence

Each game turn consists of four automatic phases:

### Phase 1: Income Phase (Automatic)

**What Happens:**
- All planets produce resources from their buildings
- Tax revenue is collected from planet populations
- Populations consume food
- Populations grow (if well-fed and morale is high)

**Player Action Required:** None (all calculations are automatic)

### Phase 2: Action Phase (Player Control)

**Available Actions:**
- **Build Structures:** Start construction on planet buildings (requires resources)
- **Commission Platoons:** Train ground troops (requires credits)
- **Purchase Spacecraft:** Buy new ships (requires credits, minerals, fuel)
- **Move Fleets:** Navigate ships between planets (consumes fuel)
- **Adjust Tax Rates:** Change planetary tax levels (affects income vs morale)
- **Load/Unload Cargo:** Transfer platoons onto Battle Cruisers

**Turn Limit:** You may take multiple actions, but typically 3 major actions per turn to maintain strategic pacing.

### Phase 3: Combat Phase (Automatic)

**What Happens:**
- Space battles resolve automatically at any planet with opposing fleets
- Ground invasions execute if you have platoons landed on enemy planets
- Casualties are calculated and units destroyed

**Player Action Required:** None (combat is fully automated based on unit strengths)

### Phase 4: End Phase (Automatic)

**What Happens:**
- Buildings under construction advance by 1 turn
- Completed buildings become operational
- Final population growth calculations
- Victory/defeat conditions checked

**Player Action Required:** None

---

## Resources

The game uses **five primary resources** that drive your economy and military:

### 1. Credits (₡)

- **Primary currency** for purchasing everything
- **Gained from:** Taxation, trade, starting reserves
- **Used for:** Buildings, spacecraft, platoons, upgrades

### 2. Minerals (Min)

- **Raw materials** for construction
- **Gained from:** Mining Stations
- **Used for:** Buildings, spacecraft

### 3. Fuel (Fuel)

- **Energy source** for movement and production
- **Gained from:** Mining Stations
- **Used for:** Buildings, spacecraft, ship movement

### 4. Food (Food)

- **Sustains population** growth
- **Gained from:** Horticultural Stations
- **Used for:** Feeding population (0.5 food per person per turn)

### 5. Energy (Energy)

- **Power source** (currently limited use in base game)
- **Gained from:** Solar Satellites
- **Used for:** Future advanced systems

### Starting Resources

At the beginning of a standard game, you start with:
- **50,000 Credits**
- **10,000 Minerals**
- **10,000 Fuel**
- **10,000 Food**
- **10,000 Energy**

---

## Planets & Colonization

### Planet Types

Each planet has a type that affects resource production:

| Planet Type | Production Bonus |
|-------------|------------------|
| **Volcanic** | 5× Minerals, 3× Fuel |
| **Tropical** | 2× Food |
| **Desert** | 2× Energy |
| **Metropolis** | 2× Credits (from taxation) |

**Example:** A Mining Station on a Volcanic planet produces 250 minerals (50 × 5) and 90 fuel (30 × 3) per turn instead of the base 50 minerals and 30 fuel.

### Planet Ownership

Planets can be owned by:
- **Player** (you)
- **AI** (enemy)
- **Neutral** (unclaimed)

### Colonizing Neutral Planets

To claim a neutral planet:
1. **Build** an Atmosphere Processor spacecraft
2. **Move** the Atmosphere Processor to the neutral planet
3. **Deploy** the processor (automatic upon arrival)
4. **Wait** 10 turns for terraforming to complete
5. **Control** the planet once terraforming finishes

**Colonized planets start with:**
- Zero population
- Zero buildings
- Empty garrison

You must transport population or build Horticultural Stations to grow the colony.

### Planet Capacity Limits

Each planet has building slot limits:

- **Surface Slots:** Maximum 5 structures (Mining Stations, Horticultural Stations, Surface Platforms)
- **Orbital Slots:** Maximum 3 structures (Docking Bays, Orbital Defenses)

**Strategic Implication:** Choose your buildings wisely—once slots are full, you cannot build more without scrapping existing structures.

---

## Buildings & Structures

### Building Construction

All buildings require:
1. **Resource Cost** (Credits, Minerals, Fuel)
2. **Construction Time** (1-3 turns)
3. **Available Slot** (Surface or Orbital)

Buildings under construction do not produce resources. They become operational when construction completes at the end of the turn.

### Building Catalog

#### Mining Station
- **Cost:** 8,000₡ + 2,000 Min + 1,000 Fuel
- **Construction Time:** 3 turns
- **Slot Type:** Surface
- **Crew Required:** 15
- **Production:** 50 Minerals + 30 Fuel per turn
- **Strategic Value:** Essential for spacecraft production and construction

#### Horticultural Station
- **Cost:** 6,000₡ + 1,500 Min + 800 Fuel
- **Construction Time:** 2 turns
- **Slot Type:** Surface
- **Crew Required:** 10
- **Production:** 100 Food per turn
- **Special Effect:** +1% population growth per station (max +10%)
- **Strategic Value:** Feeds population and enables growth

#### Docking Bay
- **Cost:** 5,000₡ + 1,000 Min + 500 Fuel
- **Construction Time:** 2 turns
- **Slot Type:** Orbital
- **Crew Required:** 0
- **Production:** None
- **Special Effect:** **Required** to purchase spacecraft
- **Strategic Value:** Mandatory for fleet expansion

#### Orbital Defense
- **Cost:** 12,000₡ + 3,000 Min + 2,000 Fuel
- **Construction Time:** 3 turns
- **Slot Type:** Orbital
- **Crew Required:** 0
- **Production:** None
- **Special Effect:** +20% defense bonus to planet
- **Strategic Value:** Protects planets from invasion

#### Surface Platform
- **Cost:** 2,000₡ + 500 Min
- **Construction Time:** 1 turn
- **Slot Type:** Surface
- **Crew Required:** 0
- **Production:** None
- **Special Effect:** General-purpose structure slot
- **Strategic Value:** Placeholder or future expansion

### Crew Assignment Priority

Planets automatically assign population as crew to buildings in this order:
1. **Food Production** (Horticultural Stations)
2. **Resource Production** (Mining Stations)
3. **Energy Production** (Solar Satellites)

**Important:** If your planet lacks sufficient population, buildings become inactive and stop producing.

---

## Military Units

### Platoon System

Platoons are ground troops used to invade and garrison planets.

#### Platoon Composition

Each platoon has:
- **Troop Count:** 100-150 soldiers (chosen at commission time)
- **Equipment Level:** Determines defensive strength
- **Weapon Level:** Determines offensive strength
- **Training Level:** Improves combat performance over time

#### Commissioning Platoons

**Cost Formula:**
```
Total Cost = Equipment Cost + Weapon Cost
```

#### Equipment Levels

| Equipment | Cost | Combat Modifier |
|-----------|------|-----------------|
| Civilian | 2,500₡ | 0.5× |
| Basic | 6,000₡ | 1.0× |
| Standard | 10,000₡ | 1.5× |
| Advanced | 16,000₡ | 2.0× |
| Elite | 25,000₡ | 2.5× |

#### Weapon Levels

| Weapon | Cost | Combat Modifier |
|--------|------|-----------------|
| Pistol | 500₡ | 0.8× |
| Rifle | 2,000₡ | 1.0× |
| Assault Rifle | 3,500₡ | 1.3× |
| Plasma | 6,000₡ | 1.6× |

**Example Platoon:**
- **Standard Equipment** (10,000₡) + **Rifle** (2,000₡) = **12,000₡ total**
- Combat Strength: Troops × 1.5 (equipment) × 1.0 (weapon) = 1.5× base strength

**Commissioned platoons:**
- Appear on the planet where they were trained
- Can garrison the planet or be loaded onto Battle Cruisers
- Consume 0.5 food per soldier per turn

### Platoon Strategy

**Early Game:** Commission Civilian/Pistol platoons (3,000₡) or Basic/Rifle (8,000₡) for quick deployment
**Mid Game:** Upgrade to Standard/Assault Rifle (13,500₡) for balanced cost/strength
**Late Game:** Deploy Elite/Plasma (31,000₡) for maximum combat power

---

## Spacecraft

### Spacecraft Types

All spacecraft require a **Docking Bay** to purchase. Spacecraft cost both credits and resources.

#### Battle Cruiser
- **Cost:** 50,000₡ + 10,000 Min + 5,000 Fuel
- **Crew Required:** 50
- **Speed:** 50 units per turn
- **Fuel Consumption:** 1 fuel per 10 units traveled
- **Capacity:** 4 platoons
- **Combat Strength:** 100 (modified by weapon upgrades)
- **Purpose:** Primary combat vessel and troop transport

#### Cargo Cruiser
- **Cost:** 30,000₡ + 5,000 Min + 3,000 Fuel
- **Crew Required:** 30
- **Speed:** 30 units per turn
- **Fuel Consumption:** 1 fuel per 5 units traveled
- **Capacity:** 1,000 cargo units
- **Combat Strength:** 30
- **Purpose:** Resource transport and logistics

#### Solar Satellite
- **Cost:** 15,000₡ + 3,000 Min + 1,000 Fuel
- **Crew Required:** 5
- **Speed:** Stationary (cannot move)
- **Fuel Consumption:** None
- **Capacity:** N/A
- **Combat Strength:** 0 (non-combatant)
- **Production:** 80 Energy per turn
- **Purpose:** Energy generation

#### Atmosphere Processor
- **Cost:** 10,000₡ + 5,000 Min + 2,000 Fuel
- **Crew Required:** 20
- **Speed:** 30 units per turn
- **Fuel Consumption:** 1 fuel per 5 units traveled
- **Capacity:** N/A
- **Combat Strength:** 0 (non-combatant)
- **Purpose:** Colonize neutral planets (10-turn process)

### Fleet Movement

**Movement Cost:**
```
Fuel Required = Distance ÷ Fuel Efficiency
```

**Example:** A Battle Cruiser traveling 100 units consumes 10 fuel (100 ÷ 10).

**Strategic Consideration:** Plan fuel supply carefully—running out of fuel strands your fleet!

---

## Combat System

### Space Combat

Space battles occur automatically when opposing fleets occupy the same planet.

#### Fleet Strength Calculation

**Total Fleet Strength:**
```
Strength = Sum of all combat-capable spacecraft strengths
```

- Battle Cruiser: 100 strength per ship
- Cargo Cruiser: 30 strength per ship
- Solar Satellite: 0 (does not fight)
- Atmosphere Processor: 0 (does not fight)

#### Combat Resolution

1. **Compare Strengths:** Higher total fleet strength wins
2. **Ties:** Attacker wins ties
3. **Calculate Damage:**
   ```
   Damage per Craft = Floor((Winner Strength ÷ Loser Strength - 1.0) × 50)
   ```
4. **Apply Casualties:** Weaker side loses more ships
5. **Winner Occupies Orbit:** Victorious fleet remains at planet

**Orbital Defense Bonus:**
- If the defender has an Orbital Defense building, their fleet strength is multiplied by **1.2×**
- This makes defending planets significantly easier

#### Space Combat Example

**Player Fleet:** 3 Battle Cruisers = 300 strength
**AI Fleet:** 2 Battle Cruisers = 200 strength (×1.2 with Orbital Defense = 240)

**Outcome:** Player wins (300 > 240)
**Damage Calculation:** (300 ÷ 240 - 1.0) × 50 = 12.5 damage per craft
**Casualties:** AI loses 1-2 ships, Player loses 0-1 ships

### Ground Combat

Ground battles occur when platoons attempt to invade an enemy planet.

#### Military Strength Calculation

**Platoon Combat Strength:**
```
Strength = Troops × Equipment Modifier × Weapon Modifier × Training Modifier
```

**Example:**
- 150 troops
- Standard equipment (1.5×)
- Rifle weapon (1.0×)
- Training modifier (1.0× base)
- **Total Strength:** 150 × 1.5 × 1.0 × 1.0 = **225**

#### Invasion Requirements

To invade a planet, you must:
1. **Have orbital control** (no enemy spacecraft at planet)
2. **Land platoons** from Battle Cruisers
3. **Engage garrison** (enemy platoons defending planet)

#### Combat Resolution

1. **Compare Strengths:** Sum of all attacker vs defender platoon strengths
2. **Determine Winner:** Highest strength wins
3. **Calculate Casualties:**
   - **Base Rate:** 20% of troops
   - **Strength Ratio Modifier:** Weaker side suffers more losses
   - **Winner Casualties:** 10-30% of troops
   - **Loser Casualties:** 50-90% of troops

4. **Planet Capture (if attacker wins):**
   - Ownership transfers to attacker
   - All planet resources transfer to attacker
   - Morale drops by 30%
   - All buildings deactivate (require new crew)
   - Surviving attacker platoons garrison planet

#### Ground Combat Example

**Attacker:** 2 platoons (150 troops each, Standard/Rifle)
**Attacker Strength:** 2 × 225 = 450

**Defender:** 1 platoon (150 troops, Basic/Pistol)
**Defender Strength:** 150 × 1.0 × 0.8 = 120

**Outcome:** Attacker wins (450 >> 120)
**Attacker Casualties:** ~15% (22 troops lost)
**Defender Casualties:** ~80% (120 troops lost)

**Result:** Planet captured, attacker has 278 troops garrisoning, defender eliminated.

### Bombardment (Orbital Strike)

Before ground invasion, you may choose to bombard the planet from orbit:

**Effects:**
- Destroys some buildings (random selection)
- Reduces defender platoon strength
- Lowers planet morale
- Damages infrastructure

**Strategic Use:** Weaken heavily defended planets before invasion, but at the cost of destroying valuable infrastructure.

---

## Population & Morale

### Population Growth

Populations grow each turn based on this formula:

```
Growth = Current Population × (Morale ÷ 100) × 5%
```

**Factors Affecting Growth:**
- **Morale:** Higher morale = faster growth
- **Food Supply:** Zero food halts growth entirely
- **Horticultural Stations:** Each station adds +1% growth (max +10%)

**Maximum Population:** 99,999 per planet

**Example:**
- Planet with 1,000 population, 100% morale, 2 Horticultural Stations
- Growth: 1,000 × 1.0 × (5% + 2%) = **70 new citizens per turn**

### Food Consumption

Each person consumes **0.5 food per turn**.

**Starvation:** If food reaches zero:
- Morale drops by 10 per turn
- Population growth stops
- Eventually population begins dying

**Strategic Importance:** Always maintain food surplus or build Horticultural Stations early!

### Morale System

Morale ranges from **0% to 100%** and affects:
- Population growth rate
- Resource production (penalty below 50%)
- Tax revenue
- Risk of rebellion (future feature)

#### Morale Modifiers

| Event | Morale Change |
|-------|---------------|
| Starvation (food = 0) | -10 per turn |
| Food shortage (rationing) | -3 per turn |
| High taxes (>75%) | -5 per turn |
| Low taxes (<25%) | +2 per turn |
| Planet captured | -30 (one-time) |
| Buildings completed | +1 per building |

#### Morale Impact on Income

If morale drops below 50%, your resource production suffers:

```
Effective Production = Base Production × (Morale ÷ 100)
```

**Example:**
- Mining Station produces 50 minerals per turn
- Planet morale is 40%
- Actual production: 50 × 0.4 = **20 minerals per turn**

**Strategic Lesson:** Keep morale high (>50%) to maximize income!

### Taxation

You can adjust tax rates per planet from **0% to 100%**.

**Tax Revenue Formula:**
```
Revenue = (Population × 10 × Tax Rate × Planet Modifier) ÷ 100
```

**Example:** 500 population @ 50% tax on Metropolis (2× multiplier):
- Revenue = (500 × 10 × 50 × 2) ÷ 100 = **5,000 credits per turn**

**Planet Modifiers:**
- Metropolis: 2× revenue
- Other types: 1× revenue

**Tax Rate Effects:**
- **0-25%:** Low morale penalty, slow income
- **26-50%:** Balanced morale and income
- **51-75%:** Good income, moderate morale cost
- **76-100%:** Maximum income, morale crashes

**Recommended:** 40-50% tax rate for balanced economy and morale.

---

## AI Opponent Strategy

The AI opponent uses a sophisticated decision-making system with personality types and difficulty levels.

### AI Personalities

#### 1. Balanced (Default)
- Equal focus on economy, military, and expansion
- Adaptable strategy based on game state
- Moderate aggression

#### 2. Aggressive
- Prioritizes military production
- Attacks early and often
- Lower attack threshold (strikes sooner)
- Risk-taking behavior

#### 3. Economic
- Focuses on resource production
- Builds many Mining and Horticultural Stations
- 80% build chance (vs 60% for Balanced)
- Rarely attacks unless heavily threatened

#### 4. Defensive
- Emphasizes Orbital Defenses
- High attack threshold (only attacks when overwhelming advantage)
- 20% chance to skip attacking even when able
- Turtles on homeworld

### AI Difficulty Levels

| Difficulty | Military Strength Modifier | Attack Threshold |
|------------|---------------------------|------------------|
| Easy | 0.8× (−20%) | 0.5 (needs 2× player strength) |
| Normal | 1.0× | 0.67 (needs 1.5× player strength) |
| Hard | 1.2× (+20%) | 0.83 (needs 1.2× player strength) |

**Attack Threshold** determines how strong the AI must be relative to the player before launching an attack.

### AI Decision Tree (Every Turn)

The AI evaluates actions in strict priority order:

#### Priority 1: Defend
**Trigger:** Under attack (player has ships at AI planet)
**Action:** Reinforce defenses, build Orbital Defense, commission platoons

#### Priority 2: Expand
**Trigger:** Neutral planets exist
**Action:** **ALWAYS** attempts to purchase Atmosphere Processors to colonize neutral planets
**Strategic Importance:** Expansion is the AI's highest non-emergency priority

#### Priority 3: Build Economy
**Trigger:** Turn < 30 OR Economic personality
**Action:** Build structures in priority order:
1. Mining Station (minerals/fuel for spacecraft)
2. Horticultural Station (food for population)
3. Docking Bay (required for spacecraft)

**Build Chance:**
- Economic personality: 80%
- Other personalities: 60%

**Note:** AI will skip building randomly based on this chance.

#### Priority 4: Build Military
**Trigger:** Threat level > 0.8 OR Turn ≥ 5
**Action:** Commission platoons with equipment/weapons based on difficulty:
- Easy: Basic equipment, Pistol weapon
- Normal: Standard equipment, Rifle weapon
- Hard: Elite equipment, Plasma weapon

**Troop Count:** Random 100-150 soldiers per platoon

#### Priority 5: Attack
**Trigger:** Military advantage exists, not under attack
**Action:** Select weakest player planet and launch invasion

**Attack Requirements:**
- Threat level meets difficulty threshold
- At least 2 Battle Cruisers available
- Platoons loaded on cruisers

**Target Selection:**
- Avoids player Starbase (homeworld) initially
- Targets planet with lowest defense strength
- Prioritizes capturing isolated or weakly defended worlds

### AI Strategic Weaknesses

Understanding AI behavior helps you win:

1. **Predictable Expansion:** AI always expands to neutral planets—deny them by colonizing first
2. **Random Build Skips:** 40-60% chance AI does nothing on economy phase—exploit this delay
3. **Threshold-Based Attacks:** AI won't attack until meeting strength threshold—you can prepare
4. **No Docking Bay Priority:** AI may build many Mining Stations before Docking Bay, delaying spacecraft
5. **No Strategic Specialization:** AI builds all structures equally; player can optimize planet types for efficiency

---

## Game Balance & Difficulty

### Starting Conditions

Both player and AI begin with identical starting resources:
- 50,000 Credits
- 10,000 Minerals, Fuel, Food, Energy
- 1 starting planet (Metropolis type)
- 0 population on non-Metropolis planets

**Homeworld Advantage:** Metropolis planets generate 2× tax revenue, giving both factions a strong economic base.

### Economic Balance

The game economy is balanced around steady progression:
- **Turn 1-5:** Infrastructure buildup (buildings cost 2k-12k credits)
- **Turn 5-10:** First military units (platoons cost 3k-13k credits)
- **Turn 10-20:** Expansion phase (colonize neutral planets)
- **Turn 20-40:** Military buildup and first major battles
- **Turn 40-80:** Strategic warfare for territory control
- **Turn 80-120:** Endgame - victory condition achieved

**Key Economic Metrics:**
- Starting credits: 50,000₡ (player), 40,000₡ (AI on Easy/Normal), 50,000₡ (AI on Hard)
- Typical income: 5,000₡ per turn per Metropolis planet @ 50% tax
- Time to first platoon: 2-3 turns after initial infrastructure
- Time to Battle Cruiser: 8-10 turns

### Recommended Difficulty Curve

**First Playthrough:** Easy difficulty, Defensive AI personality
**Learning the Game:** Normal difficulty, Balanced AI personality
**Experienced Players:** Hard difficulty, Aggressive AI personality

### Winning Strategies

#### Economic Victory Path
1. Build 2 Mining Stations, 2 Horticultural Stations, 1 Docking Bay (Turn 1-3)
2. Maintain 40% tax rate for balanced income/morale
3. Expand to 2-3 neutral planets (Turns 5-15)
4. Build economic infrastructure on new planets
5. Generate massive resource surplus
6. Purchase large fleet and platoons (Turn 20+)
7. Overwhelm AI with superior numbers

#### Military Rush Path
1. Build 1 Docking Bay immediately (Turn 1)
2. Purchase 2 Battle Cruisers (Turn 5)
3. Commission 2 Standard/Rifle platoons (Turn 11+ when affordable)
4. Load platoons onto cruisers
5. Invade AI homeworld before they build defenses
6. Capture AI planet for instant victory

#### Expansion Dominance Path
1. Build 1 Docking Bay (Turn 1)
2. Purchase 3 Atmosphere Processors (Turns 5-7)
3. Deploy to 3 neutral planets
4. Wait 10 turns for colonization (Turn 15-17)
5. Control 4 planets (1 starting + 3 colonized) vs AI's 1
6. Economic superiority leads to military victory

---

## Quick Reference Tables

### Building Costs Summary
| Building | Credits | Minerals | Fuel | Turns | Slot |
|----------|---------|----------|------|-------|------|
| Surface Platform | 2,000 | 500 | 0 | 1 | Surface |
| Docking Bay | 5,000 | 1,000 | 500 | 2 | Orbital |
| Horticultural Station | 6,000 | 1,500 | 800 | 2 | Surface |
| Mining Station | 8,000 | 2,000 | 1,000 | 3 | Surface |
| Orbital Defense | 12,000 | 3,000 | 2,000 | 3 | Orbital |

### Spacecraft Costs Summary
| Spacecraft | Credits | Minerals | Fuel | Crew |
|------------|---------|----------|------|------|
| Atmosphere Processor | 10,000 | 5,000 | 2,000 | 20 |
| Solar Satellite | 15,000 | 3,000 | 1,000 | 5 |
| Cargo Cruiser | 30,000 | 5,000 | 3,000 | 30 |
| Battle Cruiser | 50,000 | 10,000 | 5,000 | 50 |

### Platoon Cost Examples
| Equipment | Weapon | Total Cost | Combat Modifier |
|-----------|--------|------------|-----------------|
| Civilian | Pistol | 3,000₡ | 0.4× |
| Basic | Pistol | 6,500₡ | 0.8× |
| Basic | Rifle | 8,000₡ | 1.0× |
| Standard | Rifle | 12,000₡ | 1.5× |
| Advanced | Assault Rifle | 19,500₡ | 2.6× |
| Elite | Plasma | 31,000₡ | 4.0× |

### Combat Modifiers Summary
| Equipment Level | Modifier | Weapon Level | Modifier |
|-----------------|----------|--------------|----------|
| Civilian | 0.5× | Pistol | 0.8× |
| Basic | 1.0× | Rifle | 1.0× |
| Standard | 1.5× | Assault Rifle | 1.3× |
| Advanced | 2.0× | Plasma | 1.6× |
| Elite | 2.5× | - | - |

---

## Game Flow Example: First 10 Turns

### Turn 1
- **Income:** Collect starting resources
- **Action:** Build 2 Mining Stations, 2 Horticultural Stations, 1 Docking Bay
- **Spending:** 34,000₡ + 8,500 Min + 4,100 Fuel
- **AI Action:** Purchases Atmosphere Processor, builds Mining Station

### Turn 2
- **Income:** Zero (buildings under construction)
- **Action:** Wait for constructions to complete
- **AI Action:** Builds another Mining Station

### Turn 3
- **Income:** Buildings complete, generate resources
- **Action:** Purchase Atmosphere Processor (10,000₡)
- **AI Action:** Builds more Mining Stations

### Turn 4
- **Income:** Mining Stations produce 100 Min + 60 Fuel
- **Action:** Deploy Atmosphere Processor to neutral planet
- **AI Action:** Cannot afford anything, waits

### Turn 5
- **Income:** Taxation generates ~5,000₡ per turn
- **Action:** Commission first platoon (12,000₡ Standard/Rifle)
- **AI Action:** Atmosphere Processor reaches neutral planet

### Turns 6-10
- **Income:** Steady resource accumulation (5,000₡/turn)
- **Action:** Commission 2nd platoon, build Battle Cruiser
- **AI Action:** Colonization completes (Turn 15), AI expands to second planet

### Turn 11-15
- **Income:** Increased income as population grows
- **Action:** Platoons complete training, load onto Battle Cruiser
- **AI Action:** Builds infrastructure on new planet, commissions military

**Strategic Lesson:** First player to expand to 2-3 planets gains massive economic advantage!

---

## Glossary of Terms

**4X:** eXplore, eXpand, eXploit, eXterminate—the four pillars of strategy games
**Garrison:** Platoons stationed on a planet for defense
**Morale:** Population happiness, affects production and growth
**Orbital Control:** Having spacecraft at a planet with no enemy ships
**Terraforming:** 10-turn process to make neutral planets habitable
**Threat Level:** AI's assessment of player military strength vs its own
**Fleet Strength:** Combined combat power of all ships at a location
**Building Slots:** Limited spaces on planets for structures
**Tax Rate:** Percentage of population wealth collected as credits
**Combat Modifier:** Equipment/weapon multiplier affecting platoon strength

---

## Design Philosophy

**Overlord** is designed around these core principles:

1. **Strategic Depth:** Multiple paths to victory (military, economic, expansion)
2. **Meaningful Choices:** Every building, unit, and action has trade-offs
3. **Resource Management:** Balancing five resources creates tension
4. **Asymmetric Gameplay:** AI personalities create varied challenges
5. **Scalable Difficulty:** Easy to learn, hard to master
6. **Turn-Based Pacing:** Time to think and plan each move
7. **Automated Combat:** Focus on strategy, not micromanagement

The game rewards long-term planning, adaptability, and understanding the interplay between economy, military, and territorial control.

---

**End of Game Design Document**

*For technical implementation details, see the codebase documentation in `/Overlord.Phaser/src/core/`.*
