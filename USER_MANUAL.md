# Overlord User Manual

*A comprehensive guide to galactic conquest*

---

## Part 1: Welcome to the Galaxy

In the distant reaches of space, empires rise and fall with the turning of stellar ages. You have inherited command of a fledgling interstellar civilization—a single world, a handful of loyal citizens, and the burning ambition to rule the stars.

But you are not alone.

Across the void, another power stirs. An AI-controlled empire with its own agenda, its own fleets, and its own claim to galactic supremacy. The galaxy is not large enough for two overlords.

As commander of your empire, you will:
- **Expand** your territory by colonizing neutral worlds and capturing enemy planets
- **Exploit** planetary resources to fuel your war machine
- **Build** fleets of mighty spacecraft and armies of trained soldiers
- **Conquer** through strategic planning, careful resource management, and decisive military action

The path to victory is paved with credits, sealed with steel, and written in the stars. The galaxy awaits its Overlord.

Will it be you?

---

## Part 2: Quick Reference

### Turn Phases

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **Income** | Automatic | Resources generate, population grows, morale updates |
| **Action** | Player-controlled | Build, purchase, move fleets, issue orders |
| **Combat** | Automatic | All battles resolve simultaneously |
| **End** | Automatic | Buildings complete, victory conditions checked |

### Resources at a Glance

| Resource | Symbol | Primary Use | Produced By |
|----------|--------|-------------|-------------|
| **Credits** | Cr | Purchases, research | Tax revenue, Metropolis planets |
| **Minerals** | Min | Construction | Mining Stations |
| **Fuel** | Fuel | Spacecraft movement | Mining Stations |
| **Food** | Food | Population sustenance | Horticultural Stations |
| **Energy** | Eng | Building operations | Solar Satellites |

### Planet Type Bonuses

| Planet Type | Minerals | Fuel | Food | Energy | Credits |
|-------------|----------|------|------|--------|---------|
| **Volcanic** | 5.0x | 3.0x | 0.5x | 1.0x | 1.0x |
| **Desert** | 1.0x | 1.0x | 0.25x | 2.0x | 1.0x |
| **Tropical** | 1.0x | 1.0x | 2.0x | 0.75x | 1.0x |
| **Metropolis** | 1.0x | 1.0x | 1.0x | 1.0x | 2.0x |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** or **Enter** | End current phase / Advance turn |
| **Escape** | Cancel current action / Close panel |

---

## Part 3: Core Mechanics

### 3.1 The Galaxy Map

The galaxy consists of 4-6 planets connected by space lanes. Each planet is displayed with:
- **Color coding**: Your planets (blue), Enemy planets (red), Neutral planets (gray)
- **Name and type**: Hover to see planet details
- **Fleet indicators**: Spacecraft icons showing docked ships

**Navigation**: Click on any planet to select it and view its details. From there, you can manage buildings, view resources, or issue orders to spacecraft.

---

### 3.2 Planet Management

#### Planet Types

Each planet type has unique characteristics that affect resource production:

**Volcanic Worlds** are rich in heavy metals and geothermal activity. Mining operations here yield exceptional returns (5x minerals, 3x fuel), but the harsh environment makes food production difficult (0.5x).

**Desert Worlds** receive intense stellar radiation, making them ideal for energy collection (2x energy). However, the arid conditions severely limit agriculture (0.25x food).

**Tropical Worlds** are lush with vegetation and ideal for food production (2x food). The dense atmosphere slightly reduces solar energy efficiency (0.75x energy).

**Metropolis Worlds** are pre-developed urban centers that generate significant tax revenue (2x credits). These planets begin already colonized and habitable.

#### Colonization

To colonize a neutral planet:

1. **Build an Atmosphere Processor** at one of your planets (Cost: 10,000 Cr / 5,000 Min / 2,000 Fuel / 20 crew)
2. **Navigate** the Atmosphere Processor to the target neutral planet
3. **Deploy** the processor—it will be consumed to begin terraforming
4. **Wait 10 turns** for terraforming to complete
5. The planet becomes yours once habitable

> **Example Scenario: "Establishing Your First Outpost"**
>
> Turn 1: You notice Kepler-7, a volcanic world with no owner, two sectors away. Perfect for mining! You commission an Atmosphere Processor at your home world.
>
> Turn 2: The Atmosphere Processor launches and begins its journey to Kepler-7.
>
> Turn 3: The processor arrives and you deploy it. Terraforming begins.
>
> Turns 4-12: You focus on building up your home world while the terraforming progresses. Each turn, the processor converts the hostile atmosphere into breathable air.
>
> Turn 13: Kepler-7 is now habitable! You can now build structures and grow population there. Immediately start a Mining Station to capitalize on those 5x mineral yields.

#### Population and Morale

Your citizens are the lifeblood of your empire:

- **Population Growth**: People multiply at a rate based on morale (up to 5% per turn at 100% morale)
- **Food Consumption**: Each citizen consumes 0.5 food per turn
- **Crew**: Population is used to crew buildings and spacecraft
- **Maximum Population**: 99,999 per planet

**Morale** (0-100%) affects population growth and income:
- **High taxes** (>75%): -5 morale per turn
- **Low taxes** (<25%): +2 morale per turn
- **Food shortages**: Severe morale penalties
- **Morale below 50%**: Income production penalties

**Strategy Tip**: Keep taxes moderate (40-60%) and ensure adequate food production. A happy population grows faster and produces more income.

#### Buildings

Buildings provide essential infrastructure for your empire:

| Building | Cost | Build Time | Production/Effect | Crew Needed |
|----------|------|------------|-------------------|-------------|
| **Docking Bay** | 5,000 Cr / 1,000 Min / 500 Fuel | 2 turns | Orbital platform for spacecraft | 0 |
| **Mining Station** | 8,000 Cr / 2,000 Min / 1,000 Fuel | 3 turns | 50 Minerals + 30 Fuel/turn | 15 |
| **Horticultural Station** | 6,000 Cr / 1,500 Min / 800 Fuel | 2 turns | 100 Food/turn | 10 |
| **Orbital Defense Platform** | 12,000 Cr / 3,000 Min / 2,000 Fuel | 3 turns | +20% space combat defense | 20 |

**Capacity Limits**:
- Maximum 3 Docking Bays per planet (orbital slots)
- Maximum 5 surface structures per planet (Mining Stations, Horticultural Stations)
- Maximum 2 Orbital Defense Platforms per planet

**Strategy Tip**: Early game, prioritize Mining Stations on Volcanic planets and Horticultural Stations on Tropical planets to maximize their type bonuses. Docking Bays can wait until you're ready to build a fleet.

---

### 3.3 Fleet Operations

#### Spacecraft Types

Your fleet can include four types of spacecraft:

**Battle Cruiser** — The backbone of your military
- Cost: 50,000 Cr / 10,000 Min / 5,000 Fuel
- Crew: 50
- Speed: 50 units/turn
- Capacity: Carries up to 4 platoons for invasions
- Role: Combat and troop transport

**Cargo Cruiser** — Essential for logistics
- Cost: 30,000 Cr / 5,000 Min / 3,000 Fuel
- Crew: 30
- Speed: 30 units/turn
- Capacity: 1,000 units of each resource type
- Role: Resource transport between planets

**Solar Satellite** — Orbital power station
- Cost: 15,000 Cr / 3,000 Min / 1,000 Fuel
- Crew: 5
- Speed: Stationary once deployed
- Production: 80 Energy/turn
- Role: Permanent energy production

**Atmosphere Processor** — Terraforming equipment
- Cost: 10,000 Cr / 5,000 Min / 2,000 Fuel
- Crew: 20
- Speed: 30 units/turn
- Duration: 10 turns to terraform
- Role: Colonizing neutral planets (consumed on use)

**Fleet Limits**: Maximum 32 spacecraft total across your empire.

#### Movement and Navigation

To move a spacecraft:
1. Select the craft at its current location
2. Choose a destination planet
3. The craft will travel based on its speed rating
4. Fuel is consumed during transit

**Strategy Tip**: Battle Cruisers are faster but Cargo Cruisers carry the resources your new colonies desperately need. Consider sending both when expanding to a new planet.

> **Example Scenario: "Launching Your First Fleet"**
>
> Your economy is humming along and you've saved up resources. Time to build military power.
>
> Turn 1: At your home world (population 500), you purchase a Battle Cruiser. 50 crew are drawn from the population, leaving 450. The ship appears in orbit.
>
> Turn 2: You commission 2 platoons with Standard equipment and Rifles. They cost 65,000 Cr each but you need ground forces for invasion.
>
> Turn 3: Once training begins, you embark both platoons onto your Battle Cruiser. It can carry up to 4, so you have room for more later.
>
> Turn 4: Intelligence shows the enemy has a lightly defended planet. You send your Battle Cruiser on its way, carrying your invasion force.

#### Scrapping Spacecraft

Spacecraft can be scrapped when docked at a planet:
- Returns 50% of construction cost
- Returns crew to planetary population
- Cannot scrap ships in transit

---

### 3.4 Military Forces

#### Platoons

Platoons are ground military units that capture enemy planets. Each platoon consists of:
- **Troop Count**: 1-200 soldiers
- **Equipment Level**: Body armor quality
- **Weapon Level**: Armament quality
- **Training Level**: Combat readiness (0-100%)

#### Equipment Levels

| Level | Cost | Combat Modifier | Description |
|-------|------|-----------------|-------------|
| **Civilian** | 20,000 Cr | 0.5x | No armor |
| **Basic** | 35,000 Cr | 1.0x | Light armor |
| **Standard** | 55,000 Cr | 1.5x | Medium armor |
| **Advanced** | 80,000 Cr | 2.0x | Heavy armor |
| **Elite** | 109,000 Cr | 2.5x | Power armor |

#### Weapon Levels

| Level | Cost | Combat Modifier | Description |
|-------|------|-----------------|-------------|
| **Pistol** | 5,000 Cr | 0.8x | Sidearms |
| **Rifle** | 10,000 Cr | 1.0x | Standard rifles |
| **Assault Rifle** | 18,000 Cr | 1.3x | Automatic weapons |
| **Plasma** | 30,000 Cr | 1.6x | Energy weapons |

#### Training

New platoons start at 0% training and gain 10% per turn, reaching maximum effectiveness at 100% after 10 turns. Training level directly multiplies combat strength.

**Military Strength Formula**:
```
Strength = Troops × Equipment Modifier × Weapon Modifier × (Training / 100)
```

**Example**: 100 troops with Elite equipment (2.5x), Plasma weapons (1.6x), and 80% training:
```
100 × 2.5 × 1.6 × 0.8 = 320 strength
```

**Strategy Tip**: Quality vs. quantity is a key decision. A small force of Elite troops with Plasma weapons can defeat a much larger poorly-equipped army. However, Elite forces are expensive. For early expansion against lightly defended planets, Basic equipment with Rifles is cost-effective.

> **Example Scenario: "Preparing an Invasion Force"**
>
> You've identified the enemy's weakest planet: Proxima-3, defended by 2 platoons of 50 troops each with Basic equipment.
>
> Your plan: Overwhelming force.
>
> You commission 3 platoons of 100 troops each with Standard equipment and Assault Rifles:
> - Each platoon costs: 55,000 (equip) + 18,000 (weapons) = 73,000 Cr
> - Total: 219,000 Cr for your invasion force
>
> While they train over the next 5 turns (reaching 50% training), you build a second Battle Cruiser to transport them all.
>
> At 50% training, each of your platoons has:
> - 100 × 1.5 × 1.3 × 0.5 = 97.5 strength
> - Total: 292.5 strength
>
> The defenders have:
> - 50 × 1.0 × 1.0 × 1.0 = 50 strength each
> - Total: 100 strength
>
> Victory seems assured, but remember: defenders may have Orbital Defense Platforms providing bonuses. Scout carefully before committing.

---

### 3.5 Combat

#### Space Combat

Space combat occurs when fleets meet at a planet. Combat resolution:

1. **Calculate Attack Strength**: Based on Battle Cruiser count, crew levels, and weapon tier
2. **Calculate Defense Strength**: Defender strength + Orbital Defense bonuses (up to +40% with 2 platforms)
3. **Resolve Battle**: Higher strength wins; tie goes to attacker
4. **Calculate Losses**: Damaged ships may be destroyed or captured

**Weapon Tiers** (Fleet-wide research upgrades):
| Tier | Damage Multiplier | Research Cost | Research Time |
|------|-------------------|---------------|---------------|
| **Laser** | 1.0x | Starting | - |
| **Missile** | 1.5x | 500,000 Cr | 5 turns |
| **Photon Torpedo** | 2.0x | 1,000,000 Cr | 8 turns |

**Strategy Tip**: Two Orbital Defense Platforms give a significant 40% defense bonus. If assaulting a fortified planet, bring overwhelming fleet superiority or soften defenses first.

#### Ground Combat

Ground combat occurs during planetary invasion after achieving orbital control:

1. **Attacker deploys platoons** from Battle Cruisers
2. **Calculate attacker strength**: Sum of all platoon strengths
3. **Calculate defender strength**: Sum of defending platoons
4. **Resolve battle**: Higher strength wins
5. **Calculate casualties**:
   - Winner: 10-30% losses
   - Loser: 50-90% losses (surviving troops retreat or are captured)

**Undefended Planets**: If no enemy platoons are present, the planet surrenders immediately with zero casualties.

**Capturing Resources**: The victor captures 50% of the planet's stored resources.

#### The Invasion Process

To invade an enemy planet:

1. **Achieve orbital control**: Destroy or drive off enemy spacecraft
2. **Arrive with invasion force**: Battle Cruisers carrying platoons
3. **Disembark platoons**: Ground troops deploy to the surface
4. **Ground combat resolves**: Winner takes the planet
5. **Planet ownership changes**: Structures and remaining resources transfer

> **Example Scenario: "The Battle for Zeta Prime"**
>
> Zeta Prime is a Tropical world held by the enemy with:
> - 1 Battle Cruiser in orbit
> - 1 Orbital Defense Platform (+20% defense)
> - 2 defending platoons (60 troops each, Standard equipment, Rifles)
>
> You arrive with:
> - 2 Battle Cruisers
> - 3 platoons aboard (100 troops each, Advanced equipment, Assault Rifles, 70% trained)
>
> **Space Combat Phase:**
> Your 2 Battle Cruisers vs. their 1 + defense bonus. You have numerical superiority. After a brief exchange, the enemy cruiser is destroyed. Orbital control achieved.
>
> **Ground Combat Phase:**
> Your forces: 3 × (100 × 2.0 × 1.3 × 0.7) = 546 strength
> Their forces: 2 × (60 × 1.5 × 1.0 × 1.0) = 180 strength
>
> Your overwhelming strength crushes the defenders. You lose approximately 15% of your troops (45 total), while enemy forces are annihilated.
>
> **Victory:** Zeta Prime is yours! You capture half its stored resources and can now exploit its 2x food production bonus.

---

### 3.6 Economy and Resources

#### The Five Resources

**Credits** — The universal currency
- Used for: All purchases, research, platoon equipment
- Generated by: Tax revenue from population, Metropolis bonuses
- Tip: Never run out—credits fuel everything

**Minerals** — Construction materials
- Used for: Buildings, spacecraft, structures
- Generated by: Mining Stations (50/turn each)
- Tip: Volcanic planets yield 5x minerals—prioritize mining there

**Fuel** — Spacecraft propulsion
- Used for: Building spacecraft, fleet movement
- Generated by: Mining Stations (30/turn each)
- Tip: Keep reserves for unexpected fleet actions

**Food** — Population sustenance
- Used for: Feeding population (0.5 per person per turn)
- Generated by: Horticultural Stations (100/turn each)
- Tip: Food shortages cause starvation and morale collapse

**Energy** — Infrastructure power
- Used for: Powering buildings and advanced operations
- Generated by: Solar Satellites (80/turn when deployed)
- Tip: Desert planets get 2x energy—ideal for satellites

#### Resource Thresholds

| Status | Amount | Effect |
|--------|--------|--------|
| **Normal** | 500+ | Standard operations |
| **Warning** | 100-499 | Yellow alert—take action soon |
| **Critical** | <100 | Red alert—immediate shortage |

#### Income Phase Calculation

Each Income Phase:
1. Buildings produce resources (with planet type multipliers)
2. Tax revenue collected based on population and tax rate
3. Population consumes food
4. Morale updates based on food availability and taxes
5. Population grows based on morale

> **Example Scenario: "Recovering from a Food Shortage"**
>
> Disaster! Your expanding empire has outgrown its food supply. Your home world has 800 population but only 1 Horticultural Station producing 100 food/turn. Consumption: 400 food/turn. Deficit: 300/turn.
>
> Your food reserves are at 150—critical level. In 1 turn, you'll hit zero and starvation begins.
>
> **Recovery Plan:**
>
> Turn 1: Immediately begin construction of 2 more Horticultural Stations (2 turns each). Reduce tax rate to 20% to boost morale during the crisis.
>
> Turn 2: Food hits zero. Starvation event triggers—population decreases by 5%. Morale drops to 40%. But your stations are almost ready...
>
> Turn 3: First new Horticultural Station completes! Food production jumps to 200/turn. Still a deficit, but smaller.
>
> Turn 4: Second station completes. Food production now 300/turn vs. 400 consumption. You're still short but the bleeding is slowed.
>
> Turn 5: Population has decreased to 700 due to starvation. But now consumption is 350/turn and production is 300/turn—almost balanced. Begin construction of a 4th Horticultural Station.
>
> **Lesson Learned**: Always build food infrastructure ahead of population growth. One extra Horticultural Station is cheap insurance against starvation.

---

## Part 4: The Turn Cycle in Detail

### Income Phase

The Income Phase is fully automated. The game calculates:

1. **Resource Production**
   - Each active building produces its output
   - Planet type multipliers are applied
   - Crew requirements checked (buildings without crew produce nothing)

2. **Tax Revenue**
   - Credits generated based on population and tax rate
   - Higher taxes = more credits but lower morale

3. **Food Consumption**
   - Each citizen consumes 0.5 food
   - If food runs out: starvation event, population loss

4. **Morale Update**
   - Taxes above 75%: -5 morale
   - Taxes below 25%: +2 morale
   - Food surplus: stable morale
   - Food shortage: severe morale penalty

5. **Population Growth**
   - Growth rate = Population × (Morale / 100) × 0.05
   - At 100% morale: 5% growth per turn
   - Maximum population: 99,999

### Action Phase

During the Action Phase, you can:

**Planet Actions:**
- Build structures (if resources and capacity allow)
- Adjust tax rates
- Commission new platoons
- Scrap buildings (50% refund)

**Fleet Actions:**
- Purchase spacecraft (if resources and crew available)
- Issue movement orders to ships
- Load/unload cargo (Cargo Cruisers)
- Embark/disembark platoons (Battle Cruisers)
- Deploy Solar Satellites or Atmosphere Processors
- Scrap spacecraft (50% refund + crew returned)

**Research Actions:**
- Upgrade weapon tiers (fleet-wide)

Click "End Turn" or press Space/Enter when finished.

### Combat Phase

The Combat Phase resolves automatically:

1. **Space Combat** resolves at each contested location
2. **AI makes decisions** for its empire
3. **Ground Combat** resolves for invasion attempts

Combat results are displayed before proceeding.

### End Phase

The End Phase handles turn cleanup:

1. **Construction Progress**: Buildings under construction advance by 1 turn
2. **Building Completion**: Structures reaching 0 turns remaining become active
3. **Victory Check**: Game checks if victory/defeat conditions are met
4. **Turn Counter**: Advances to next turn

---

## Part 5: Victory and Defeat

### Standard Victory Conditions

You achieve victory when:
- **Conquest**: All enemy planets are captured (enemy controls 0 planets)
- **Annihilation**: All enemy military forces are destroyed

### Scenario Victory Conditions

Some scenarios have special victory conditions:
- **Build X Structures**: Complete construction targets
- **Capture Specific Planet**: Take control of named objectives
- **Survive X Turns**: Hold out against enemy assault
- **Accumulate Resources**: Reach economic targets

### Defeat Conditions

You are defeated when:
- **Total Conquest**: You control 0 planets
- **Annihilation**: All your spacecraft are destroyed
- **Turn Limit Exceeded**: Time runs out in timed scenarios
- **Objective Failed**: Fail scenario-specific requirements

### Avoiding Defeat

- **Diversify**: Don't put all resources in one location
- **Defend Key Worlds**: Orbital Defense Platforms buy time
- **Maintain Reserves**: Keep emergency resources for crisis response
- **Scout**: Know enemy strength before it arrives at your doorstep

---

## Part 6: Know Your Enemy

### AI Personality Types

The AI opponent has a distinct personality that shapes its strategy:

**Commander Kratos — Aggressive**
- Prioritizes military buildup
- Attacks early and often
- Willing to take risks for territory
- Counter-strategy: Strong defenses early, then counter-attack when overextended

**Overseer Aegis — Defensive**
- Builds extensive fortifications
- Rarely attacks unless provoked
- Accumulates resources safely
- Counter-strategy: Economic warfare, cut off expansion, slow siege

**Magistrate Midas — Economic**
- Focuses on expansion and resources
- Prefers to out-produce opponents
- Military comes second to economy
- Counter-strategy: Early military pressure before economy snowballs

**General Nexus — Balanced**
- Adapts strategy to circumstances
- Responds proportionally to threats
- Neither reckless nor passive
- Counter-strategy: Unpredictability, probe for weaknesses

### Difficulty Levels

| Difficulty | AI Bonuses | AI Behavior |
|------------|------------|-------------|
| **Easy** | -20% resources, -20% military | Cautious, makes mistakes |
| **Normal** | No bonuses | Standard AI |
| **Hard** | +20% resources, +20% military | Aggressive, optimized |

**Strategy Tip**: On Hard difficulty, you cannot match the AI in a fair economy race. Strike early while their bonuses haven't compounded, or find tactical advantages the AI doesn't exploit.

---

## Part 7: Advanced Strategies

### Early Game Priorities (Turns 1-10)

1. **Build Economy First**: At least 2 production buildings before any military
2. **Identify Expansion Targets**: Which neutral planets match your strategy?
3. **Colonize Strategically**:
   - Volcanic for minerals/fuel
   - Tropical for food
   - Desert for energy
4. **Delay Military**: Unless enemy shows aggression, economy wins long-term

### Mid-Game Decisions (Turns 11-25)

1. **Consolidate or Expand?**
   - If ahead: Press advantage with more colonization
   - If behind: Fortify and build up

2. **Fleet Composition**
   - 2-3 Battle Cruisers for offense
   - 1-2 Cargo Cruisers for logistics
   - Atmosphere Processors for new colonies
   - Solar Satellites for energy-hungry worlds

3. **Platoon Timing**
   - Commission 5-10 turns before you need them (training time)
   - Don't let trained troops sit idle—they cost nothing, but resources do

### Late Game Victory Push (Turns 25+)

1. **Mass for Assault**: Concentrate forces for decisive strikes
2. **Cut Supply Lines**: Capture planets that feed enemy economy
3. **Defend Gains**: Newly captured planets are vulnerable
4. **Research Weapons**: Photon Torpedoes double your fleet power

### Common Mistakes to Avoid

**Economic:**
- Building military before economy (starves expansion)
- Ignoring food production (leads to starvation spirals)
- Spreading buildings thin (concentrate for efficiency)

**Military:**
- Attacking before training is complete
- Sending invasion forces without orbital control
- Leaving home world undefended

**Strategic:**
- Ignoring AI personality (fight their weakness, not their strength)
- Over-extending early (can't defend everything)
- Waiting too long to strike (AI compounds advantages)

---

## Appendix: Quick Reference Tables

### All Building Costs

| Building | Credits | Minerals | Fuel | Build Time | Crew |
|----------|---------|----------|------|------------|------|
| Docking Bay | 5,000 | 1,000 | 500 | 2 turns | 0 |
| Mining Station | 8,000 | 2,000 | 1,000 | 3 turns | 15 |
| Horticultural Station | 6,000 | 1,500 | 800 | 2 turns | 10 |
| Orbital Defense Platform | 12,000 | 3,000 | 2,000 | 3 turns | 20 |
| Surface Platform | 2,000 | 500 | 0 | 1 turn | 0 |

### All Spacecraft Costs

| Spacecraft | Credits | Minerals | Fuel | Crew | Speed |
|------------|---------|----------|------|------|-------|
| Battle Cruiser | 50,000 | 10,000 | 5,000 | 50 | 50/turn |
| Cargo Cruiser | 30,000 | 5,000 | 3,000 | 30 | 30/turn |
| Solar Satellite | 15,000 | 3,000 | 1,000 | 5 | 0 (stationary) |
| Atmosphere Processor | 10,000 | 5,000 | 2,000 | 20 | 30/turn |

### Platoon Costs Summary

| Equipment + Weapon | Total Cost | Combined Modifier |
|-------------------|------------|-------------------|
| Civilian + Pistol | 25,000 Cr | 0.4x |
| Basic + Rifle | 45,000 Cr | 1.0x |
| Standard + Assault Rifle | 73,000 Cr | 1.95x |
| Advanced + Plasma | 110,000 Cr | 3.2x |
| Elite + Plasma | 139,000 Cr | 4.0x |

---

*Good luck, Commander. The galaxy is waiting.*
