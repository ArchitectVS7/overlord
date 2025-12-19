/**
 * HelpContent.ts
 * Contains all help chapter content for the in-game help system.
 * Written as actionable "How To Play" instructions based on the complete playthrough manual.
 */

export interface HelpChapter {
  id: string;
  title: string;
  content: string;
}

export const HELP_CHAPTERS: HelpChapter[] = [
  {
    id: 'quickstart',
    title: 'Quick Start',
    content: `HOW TO PLAY OVERLORD
=====================================

GOAL: Capture all enemy planets to win the galaxy!

GETTING STARTED
---------------
New players should start with FLASH CONFLICTS:
1. From Main Menu, click "FLASH CONFLICTS"
2. Select "First Steps" tutorial
3. Complete 2-3 scenarios to learn the basics
4. Return to Main Menu and click "NEW CAMPAIGN"

THE TURN CYCLE
--------------
Every turn has 4 phases that cycle automatically:

  1. INCOME PHASE (automatic)
     Resources generate, population grows, food consumed.
     Buildings under construction make progress.
     Just watch - you cannot act during this phase.

  2. ACTION PHASE (your turn!)
     This is when YOU play. Click planets, build things,
     move ships, train troops. Take your time - no timer!
     When done, press SPACE or click "END TURN".

  3. COMBAT PHASE (automatic)
     All battles resolve. Your ships vs enemy ships.
     Ground invasions complete. Watch the results.

  4. END PHASE (automatic)
     Victory condition checked. Next turn begins.

YOUR FIRST TURN
---------------
1. Look at the HUD: It says "Turn 1" and "ACTION"
   This means it's your turn to act.

2. Click on your blue planet (your homeworld)
   A panel opens on the right showing planet info.

3. Click the "Build" button
   A menu opens showing available buildings.

4. Click "Mining Station" to start building it
   (You need minerals and fuel for ships later!)

5. Click outside the panel to close it

6. Click "END TURN" button (or press SPACE)
   Watch the turn cycle through phases.

7. Repeat! Each turn: build, train troops, buy ships.

RECOMMENDED BUILD ORDER
-----------------------
Turn 1-3:  Mining Station (minerals + fuel)
Turn 3-5:  Horticultural Station (food!)
Turn 5-7:  Docking Bay (allows ship building)
Turn 7-10: Commission platoons (start training)
Turn 10+:  Battle Cruisers + expand!`
  },
  {
    id: 'phases',
    title: 'Turn Phases',
    content: `UNDERSTANDING TURN PHASES
=====================================

INCOME PHASE - "I see INCOME on screen"
---------------------------------------
WHAT HAPPENS (all automatic):

1. PRODUCTION - Buildings generate resources:
   Mining Station: +50 Minerals, +30 Fuel
   Horticultural Station: +100 Food
   Solar Satellite: +80 Energy

   Planet bonuses multiply production:
   - Volcanic: 5x Minerals, 3x Fuel
   - Tropical: 2x Food
   - Desert: 2x Energy
   - Metropolis: 2x Credits

2. TAX COLLECTION:
   Credits = Population x Tax Rate x Planet Bonus
   Example: 500 pop x 40% tax x 2.0 bonus = 400 Cr

3. FOOD CONSUMPTION:
   Food used = Population x 0.5 per turn
   Example: 500 pop = 250 Food consumed

   WARNING: If Food reaches 0:
   - Population decreases 5% per turn
   - Morale drops to 25%
   - Production halts!

4. MORALE UPDATE:
   Tax > 75%: Morale decreases
   Tax < 25%: Morale increases
   Food shortage: Morale -10

5. POPULATION GROWTH:
   New pop = Current x (Morale/100) x 0.05
   Example: 500 x 0.75 x 0.05 = 19 new people

6. CONSTRUCTION PROGRESS:
   Each building: Turns Remaining - 1
   If reaches 0: Building becomes operational!

This phase ends automatically after 2-3 seconds.


ACTION PHASE - "I see ACTION on screen"
---------------------------------------
THIS IS YOUR TURN! The game WAITS for you.

You can:
  - Click planets to view info and take actions
  - Build structures on your planets
  - Purchase spacecraft (requires Docking Bay)
  - Commission platoons (ground troops)
  - Move ships to other planets
  - Load troops onto Battle Cruisers
  - Adjust tax rates

HOW TO END YOUR TURN:
  - Press SPACE bar, or
  - Press ENTER, or
  - Click the "END TURN" button

Take your time - there's no timer!


COMBAT PHASE - "I see COMBAT on screen"
---------------------------------------
All battles resolve automatically:

1. SPACE COMBAT first:
   Your ships vs enemy ships + orbital defenses
   Higher strength wins

2. GROUND COMBAT second (if you have troops):
   Your platoons vs enemy garrison
   Winner controls the planet!

Combat results appear as notifications.
This phase ends automatically after battles resolve.


END PHASE - "I see END on screen"
---------------------------------
WHAT HAPPENS (automatic):
- AI opponent takes their turn
- Victory condition checked
- If you control all planets: YOU WIN!
- If you lost all planets: DEFEAT

Then the next turn begins with Income Phase.`
  },
  {
    id: 'planets',
    title: 'Planet Actions',
    content: `PLANET MANAGEMENT
=====================================

HOW TO SELECT A PLANET
----------------------
1. Click on any planet in the galaxy map
2. A panel appears on the right side
3. You see: name, type, population, resources, buildings

The panel has ACTION BUTTONS at the bottom.
Different options appear based on planet owner.


YOUR PLANETS (Blue) - Available Actions:
----------------------------------------

[BUILD] BUTTON
  Opens the construction menu.
  Pick a building to start construction.
  Buildings take 2-3 turns to complete.
  Only one building can construct at a time.

[COMMISSION] BUTTON
  Train a new platoon (ground troops).
  Configure: troop count, equipment, weapons.
  Platoons take 10 turns to reach 100% training.
  WARNING: Untrained troops fight poorly!

[PLATOONS] BUTTON
  View troops stationed on this planet.
  Options:
  - [EMBARK] - Load onto a Battle Cruiser
  - [DISBAND] - Remove the platoon

[SPACECRAFT] BUTTON
  Purchase new ships (requires Docking Bay).
  Ships appear immediately when purchased.
  View docked ships and their status.

[NAVIGATE] BUTTON
  Send a ship to another planet.
  Select ship, then select destination.
  Travel time depends on distance and ship speed.

TAX SLIDER
  Adjust tax rate (0-100%)
  Higher tax = more Credits
  But tax > 75% hurts morale!
  Recommended: 40-60%


ENEMY PLANETS (Red) - Available Actions:
----------------------------------------

[INVADE] BUTTON (if you have troops in orbit)
  Launch ground assault with your platoons.
  Requirements:
  - Battle Cruiser(s) in orbit
  - Platoons loaded on cruisers
  - Orbital control (no enemy ships)

  Win the battle to capture the planet!


NEUTRAL PLANETS (Gray):
-----------------------
These are unclaimed. To colonize:
1. Build an Atmosphere Processor
2. Navigate it to the neutral planet
3. Deploy it when you arrive
4. Wait ~10 turns for terraforming
5. Planet becomes yours!


PLANET INFO EXPLAINED
---------------------
POPULATION: X / 99,999
  Current pop / Maximum capacity
  More people = more tax income

MORALE: X%
  Happiness of your citizens
  High morale = faster growth
  Low morale = slow growth, unrest

RESOURCES (stored on planet):
  Credits, Minerals, Fuel, Food, Energy

BUILDINGS: (X/5 slots used)
  Shows built and under-construction buildings
  Each planet has 5 building slots

SPACECRAFT: (X docked)
  Ships currently at this planet`
  },
  {
    id: 'building',
    title: 'How to Build',
    content: `HOW TO BUILD STRUCTURES
=====================================

STEP-BY-STEP BUILDING
---------------------
1. Click on YOUR planet (blue color)
2. Click the [BUILD] button in the panel
3. Review available buildings
4. Buildings you can't afford are grayed out
5. Click a building to start construction
6. Click [CONFIRM] in the dialog

DURING CONSTRUCTION:
  The planet panel shows progress:
  "[Mining Station] - 2 turns remaining"
  You cannot build another thing until it finishes.

WHEN COMPLETE:
  You'll see: "Mining Station completed!"
  Production begins on the NEXT turn.


BUILDING PRIORITY GUIDE
-----------------------
TURN 1-3: Mining Station
  Cost: 8,000 Cr / 2,000 Min / 1,000 Fuel
  Build Time: 3 turns
  Produces: +50 Minerals, +30 Fuel per turn
  WHY: You need minerals and fuel for everything!

TURN 3-5: Horticultural Station
  Cost: 6,000 Cr / 1,500 Min / 800 Fuel
  Build Time: 2 turns
  Produces: +100 Food per turn
  WHY: Prevents starvation as population grows!

TURN 5-7: Docking Bay
  Cost: 5,000 Cr / 1,000 Min / 500 Fuel
  Build Time: 2 turns
  Effect: Allows spacecraft construction
  WHY: You can't buy ships without this!

LATER: Orbital Defense Platform
  Cost: 12,000 Cr / 3,000 Min / 2,000 Fuel
  Build Time: 3 turns
  Effect: +20% defense bonus per platform
  WHY: Protects against enemy attacks!


BUILDING COSTS TABLE
--------------------
Building              Cr      Min    Fuel   Time
---------------------------------------------
Mining Station        8,000   2,000  1,000  3 turns
Horticultural Stn     6,000   1,500    800  2 turns
Docking Bay           5,000   1,000    500  2 turns
Orbital Defense      12,000   3,000  2,000  3 turns


PLANET TYPE BONUSES
-------------------
Build the RIGHT buildings on the RIGHT planets!

VOLCANIC PLANETS (red/orange):
  5x Minerals, 3x Fuel from Mining Stations
  -> BUILD: Mining Stations here!
  Example: Mining Station = 250 Min, 90 Fuel!

TROPICAL PLANETS (green):
  2x Food from Horticultural Stations
  -> BUILD: Horticultural Stations here!
  Example: Hort Station = 200 Food!

DESERT PLANETS (tan):
  2x Energy from Solar Satellites
  -> DEPLOY: Solar Satellites here!

METROPOLIS PLANETS (developed):
  2x Credits from taxes
  -> Focus on high population + taxes!


SCRAPPING BUILDINGS
-------------------
If you need to free up a slot:
1. Click planet
2. Click the building you want to remove
3. Click [SCRAP]
4. You receive 50% of original cost back`
  },
  {
    id: 'military',
    title: 'Military Guide',
    content: `HOW TO BUILD YOUR MILITARY
=====================================

YOUR MILITARY HAS TWO PARTS:
1. Spacecraft (fight in space, transport troops)
2. Platoons (ground troops that capture planets)

You need BOTH to conquer enemy planets!


BUYING SPACECRAFT
-----------------
REQUIREMENTS:
  - Planet must have a Docking Bay
  - Sufficient resources

STEP-BY-STEP:
1. Click on your planet with Docking Bay
2. Click [SPACECRAFT] button
3. Select ship type to purchase
4. Click [CONFIRM]
5. Ship appears immediately, docked at planet

SHIP TYPES:

BATTLE CRUISER
  Cost: 50,000 Cr / 10,000 Min / 5,000 Fuel
  Crew: 50 people from population
  Speed: 50 units/turn (fast)
  Capacity: 4 platoons
  PURPOSE: Combat + troop transport

CARGO CRUISER
  Cost: 30,000 Cr / 5,000 Min / 3,000 Fuel
  Crew: 30 people
  Speed: 30 units/turn
  Capacity: 1,000 of each resource
  PURPOSE: Transport resources between planets

ATMOSPHERE PROCESSOR
  Cost: 10,000 Cr / 5,000 Min / 2,000 Fuel
  Crew: 20 people
  Speed: 30 units/turn
  PURPOSE: Colonize neutral planets
  NOTE: Consumed when deployed!

SOLAR SATELLITE
  Cost: 15,000 Cr / 3,000 Min / 1,000 Fuel
  Crew: 5 people
  Speed: Stationary (orbits planet)
  Produces: +80 Energy per turn
  PURPOSE: Energy production


TRAINING PLATOONS
-----------------
STEP-BY-STEP:
1. Click on your planet
2. Click [COMMISSION] button
3. Configure your platoon:

TROOP COUNT: 1-200 troops per platoon
  More troops = more strength
  But costs more and takes crew

EQUIPMENT (armor quality):
  Civilian    - 20,000 Cr - 0.5x strength
  Basic       - 35,000 Cr - 1.0x strength
  Standard    - 55,000 Cr - 1.5x strength
  Advanced    - 80,000 Cr - 2.0x strength
  Elite      - 109,000 Cr - 2.5x strength

WEAPONS:
  Pistol        - 5,000 Cr - 0.8x damage
  Rifle        - 10,000 Cr - 1.0x damage
  Assault Rifle - 18,000 Cr - 1.3x damage
  Plasma       - 30,000 Cr - 1.6x damage

4. Click [COMMISSION]
5. Platoon begins training!

TRAINING PROGRESS:
  - New platoons start at 0% training
  - Gain +10% per turn
  - 10 turns to reach 100%
  - NEVER attack with untrained troops!

  Training = Combat effectiveness multiplier
  50% trained = 50% effective!


LOADING TROOPS ONTO SHIPS
-------------------------
1. Click planet with both platoons and Battle Cruisers
2. Click [PLATOONS] button
3. Select a platoon
4. Click [EMBARK]
5. Choose which Battle Cruiser
6. Click [CONFIRM]

Each Battle Cruiser holds up to 4 platoons.
You MUST load troops before invading!`
  },
  {
    id: 'movement',
    title: 'Moving Ships',
    content: `HOW TO MOVE SPACECRAFT
=====================================

STEP-BY-STEP MOVEMENT
---------------------
1. Click on a planet with your ships
2. Click [NAVIGATE] button
3. Select the ship you want to move
4. Destination list appears showing:
   - Planet name and owner
   - Distance (sectors)
   - Travel time (turns)
5. Click a destination
6. Click [CONFIRM]
7. Ship begins traveling!

DURING TRANSIT:
  - Ship shows "In Transit" status
  - Cannot be used for other orders
  - Fuel consumed during travel
  - Arrives after calculated travel time
  - You CANNOT cancel or recall mid-journey!


TRAVEL TIMES
------------
Speed determines travel time:

BATTLE CRUISER:  Speed 50 - Fastest
CARGO CRUISER:   Speed 30 - Moderate
ATMOSPHERE PROC: Speed 30 - Moderate
SOLAR SATELLITE: Speed 0  - Cannot move

Travel Time = Distance / Speed (rounded up)

Example: 2 sectors at Speed 50 = 1 turn
Example: 3 sectors at Speed 30 = 2 turns


FUEL CONSUMPTION
----------------
Ships consume fuel while traveling:
  - Base: 500 fuel per journey
  - Long trips use more fuel

Keep fuel reserves! If you run out:
  - Ships cannot travel
  - Build more Mining Stations!


WHAT HAPPENS ON ARRIVAL?
------------------------

ARRIVING AT YOUR PLANET:
  Ship docks automatically.
  You can unload cargo or troops.
  Ship can receive new orders next turn.

ARRIVING AT NEUTRAL PLANET:
  If Atmosphere Processor: Can deploy to colonize
  If other ship: Just orbits the planet

ARRIVING AT ENEMY PLANET:
  SPACE COMBAT triggers automatically!
  Your ships fight their ships + defenses.

  If you WIN space combat:
  - You have orbital control
  - Can launch ground invasion
  - Click planet -> Click [INVADE]

  If you LOSE space combat:
  - Your ships are destroyed
  - No invasion possible


FLEET TACTICS
-------------
- Send multiple ships together for strength
- Don't trickle ships one at a time!
- Larger fleets win battles
- Plan travel times - ships arrive together
- Keep some ships for defense at home`
  },
  {
    id: 'invasion',
    title: 'How to Invade',
    content: `HOW TO CAPTURE ENEMY PLANETS
=====================================

INVASION REQUIREMENTS CHECKLIST
-------------------------------
Before you can invade, you need:

[X] Battle Cruiser(s) at the enemy planet
[X] Platoons LOADED onto those cruisers
[X] Orbital control (enemy ships destroyed)
[X] Platoons should be 70%+ trained

If enemy ships are present, space combat
happens first. You must win to proceed.


COMPLETE INVASION PROCESS
-------------------------

STEP 1: PREPARE YOUR FORCES
  1. Commission platoons (10 turns to train!)
  2. Build Battle Cruisers (need Docking Bay)
  3. Wait for platoons to reach 70-100% training

STEP 2: LOAD TROOPS
  1. Click your planet
  2. Click [PLATOONS]
  3. Select platoon -> Click [EMBARK]
  4. Choose Battle Cruiser
  5. Repeat until cruisers are loaded

STEP 3: SEND FLEET TO ENEMY
  1. Click your planet
  2. Click [NAVIGATE]
  3. Select your Battle Cruiser(s)
  4. Select enemy planet destination
  5. Click [CONFIRM]

STEP 4: WAIT FOR ARRIVAL
  Travel takes 1-3 turns depending on distance.
  Plan ahead!

STEP 5: SPACE COMBAT (AUTOMATIC)
  When fleet arrives at enemy planet:
  - Your ships vs their ships + orbital defenses
  - Higher total strength wins
  - If you win: Orbital control achieved!
  - If you lose: Fleet destroyed, invasion fails

STEP 6: LAUNCH INVASION
  After winning space combat:
  1. Click the enemy planet
  2. [INVADE] button appears
  3. Click [INVADE]
  4. Select aggression level:
     - Low: Fewer casualties, might not win
     - Medium: Balanced (recommended)
     - High: More casualties, stronger attack
  5. Click [CONFIRM]

STEP 7: GROUND COMBAT (AUTOMATIC)
  Your platoons vs enemy garrison.
  Higher strength wins.

STEP 8: VICTORY!
  If you win ground combat:
  - Planet turns blue (yours!)
  - Enemy buildings become yours
  - You capture 50% of stored resources
  - Your troops garrison the planet


COMBAT STRENGTH CALCULATION
---------------------------
Platoon Strength = Troops x Equipment x Weapons x Training

Example:
  100 troops
  x Elite equipment (2.5)
  x Plasma weapons (1.6)
  x 80% training (0.8)
  = 100 x 2.5 x 1.6 x 0.8 = 320 strength


COMBAT TIPS
-----------
- Bring overwhelming force (2-3 cruisers minimum)
- 100% trained platoons fight MUCH better
- Elite + Plasma beats large numbers of Basic + Rifle
- Each Orbital Defense gives defender +20%
- Undefended planets surrender without a fight!
- After capture, build defenses immediately!


CASUALTIES
----------
WINNER takes 10-30% losses
LOSER takes 50-100% losses (often annihilated)

Higher aggression = more damage both ways
Use moderate aggression for balance.`
  },
  {
    id: 'colonize',
    title: 'Colonization',
    content: `HOW TO COLONIZE NEUTRAL PLANETS
=====================================

Neutral planets (gray) are unclaimed.
Colonize them to expand your empire!


WHAT YOU NEED
-------------
1. An Atmosphere Processor spacecraft
   Cost: 10,000 Cr / 5,000 Min / 2,000 Fuel

2. A neutral planet to colonize


STEP-BY-STEP COLONIZATION
-------------------------

STEP 1: BUILD ATMOSPHERE PROCESSOR
  1. Click your planet (must have Docking Bay)
  2. Click [SPACECRAFT]
  3. Click [ATMOSPHERE PROCESSOR]
  4. Click [CONFIRM]
  5. Processor appears docked at planet

STEP 2: NAVIGATE TO NEUTRAL PLANET
  1. Click [NAVIGATE]
  2. Select your Atmosphere Processor
  3. Select neutral planet destination
  4. Click [CONFIRM]
  5. Processor begins traveling

STEP 3: WAIT FOR ARRIVAL
  Travel takes 1-3 turns.

STEP 4: DEPLOY THE PROCESSOR
  When arrived:
  1. Click on the neutral planet
  2. Click [DEPLOY ATMOSPHERE PROCESSOR]
  3. Click [CONFIRM]

  WARNING: The processor is CONSUMED!
  It disappears after deployment.

STEP 5: WAIT FOR TERRAFORMING
  Terraforming takes ~10 turns.
  Progress shows on planet panel.

STEP 6: COLONY ESTABLISHED!
  When complete:
  - Planet turns blue (yours!)
  - Small starting population
  - No buildings yet - start building!


CHOOSING WHAT TO COLONIZE
-------------------------
Scout first! Know the planet type:

VOLCANIC (red/orange):
  Best for: Mining (5x minerals, 3x fuel)
  Priority: HIGH if you need production

TROPICAL (green):
  Best for: Food (2x food production)
  Priority: HIGH if food is scarce

DESERT (tan):
  Best for: Energy (2x energy)
  Priority: MEDIUM

METROPOLIS (developed):
  Best for: Credits (2x tax income)
  Rare to find unclaimed!


COLONIZATION TIPS
-----------------
1. PROTECT YOUR COLONY
   New colonies start weak!
   - Small population
   - No buildings
   - No defenses
   Build Orbital Defense ASAP.

2. SEND RESOURCES
   Send a Cargo Cruiser with the processor:
   - Load minerals, fuel, food
   - New colony can start building immediately

3. DON'T OVEREXTEND
   Colonizing costs resources.
   Each colony needs:
   - Building investments
   - Defense investments
   - Time to become productive

   Expand at a sustainable pace!

4. STRATEGIC LOCATION
   Consider the planet's position:
   - Near enemy = frontline (needs defense)
   - Near you = safe expansion
   - Cuts off enemy access = strategic value


COLONY DEVELOPMENT ORDER
------------------------
After colonizing:
1. Horticultural Station (food for new population)
2. Mining Station (production)
3. Docking Bay (if staging military here)
4. Orbital Defense (protection)`
  },
  {
    id: 'economy',
    title: 'Economy',
    content: `MANAGING YOUR ECONOMY
=====================================

THE FIVE RESOURCES
------------------

CREDITS (gold color)
  Source: Taxes on population
  Formula: Population x Tax Rate x Planet Bonus
  Used for: All purchases (primary currency)
  Tips: Metropolis planets give 2x credits!

MINERALS (silver color)
  Source: Mining Stations
  Base: +50 per Mining Station
  Used for: Buildings, spacecraft
  Tips: Volcanic planets give 5x bonus!

FUEL (orange color)
  Source: Mining Stations
  Base: +30 per Mining Station
  Used for: Building ships, travel
  Tips: Volcanic planets give 3x bonus!

FOOD (green color)
  Source: Horticultural Stations
  Base: +100 per station
  Used for: Population (0.5 per person/turn)
  CRITICAL: No food = STARVATION!
  Tips: Tropical planets give 2x bonus!

ENERGY (cyan/blue color)
  Source: Solar Satellites
  Base: +80 per satellite
  Used for: Building operations
  Tips: Desert planets give 2x bonus!


RESOURCE STATUS COLORS
----------------------
500+      Green/White  - Healthy
100-499   Yellow       - Warning, take action
<100      Red          - CRITICAL, act now!


HOW TO INCREASE EACH RESOURCE
-----------------------------

NEED MORE CREDITS?
  1. Increase population (more taxpayers)
  2. Keep morale high (population grows)
  3. Capture Metropolis planets (2x bonus)
  4. Raise tax rate (but watch morale!)
  5. Don't overspend on military early

NEED MORE MINERALS?
  1. Build Mining Stations
  2. Prioritize Volcanic planets (5x bonus!)
  3. Capture enemy Mining Stations
  4. Reduce construction temporarily

NEED MORE FUEL?
  1. Mining Stations also produce fuel
  2. Volcanic planets give 3x fuel bonus
  3. Reduce fleet movements
  4. Don't build ships you don't need yet

NEED MORE FOOD?
  1. Build Horticultural Stations IMMEDIATELY
  2. Tropical planets give 2x bonus
  3. Control population growth (lower morale)
  4. Capture enemy food production

NEED MORE ENERGY?
  1. Deploy Solar Satellites
  2. Desert planets give 2x bonus
  3. Reduce energy-heavy operations


TAX STRATEGY
------------
Tax Rate affects:
  - Credit income (higher = more money)
  - Morale (higher taxes = lower morale)
  - Population growth (lower morale = less growth)

RECOMMENDATIONS:
  40-60%: Balanced (safe choice)
  <40%:   Happy population, slow income
  >75%:   High income, morale penalty!

When to raise taxes:
  - Emergency need for Credits
  - About to invade (need ships/troops)
  - Population very high already

When to lower taxes:
  - Morale dropping
  - Population growth needed
  - After a starvation crisis


COMMON ECONOMIC MISTAKES
------------------------
1. Building military before economy
   -> You'll run out of resources mid-game

2. Ignoring food production
   -> Starvation destroys your empire!

3. Setting taxes too high too early
   -> Stunts population growth

4. Not matching buildings to planet types
   -> Waste 50-80% potential production

5. Over-expanding without economy
   -> Can't defend new colonies


ECONOMIC TIMELINE
-----------------
EARLY GAME (Turns 1-10):
  Focus 80% on economy
  Build: Mining, Hort Stations, Docking Bay

MID GAME (Turns 10-20):
  Balance economy and military 50/50
  Maintain positive income

LATE GAME (Turns 20+):
  Economy fuels military production
  Capture enemy resources`
  },
  {
    id: 'combat',
    title: 'Combat Guide',
    content: `HOW COMBAT WORKS
=====================================

There are two types of combat:
1. SPACE COMBAT - Ships vs Ships
2. GROUND COMBAT - Platoons vs Garrison


SPACE COMBAT MECHANICS
----------------------
Triggers when: Your fleet arrives at enemy planet

YOUR ATTACK STRENGTH:
  = Number of Ships x Crew x Weapon Multiplier

ENEMY DEFENSE STRENGTH:
  = Their Ships x Crew x Weapons x Defense Bonus

Defense Bonus: +20% per Orbital Defense Platform

EXAMPLE SPACE BATTLE:

  YOUR FORCES:
  2x Battle Cruisers, 100 total crew
  Weapons: Laser (1.0x)
  Attack = 100 x 1.0 = 100 strength

  ENEMY FORCES:
  1x Battle Cruiser, 50 crew
  2x Orbital Defense Platforms (+40%)
  Defense = 50 x 1.0 x 1.4 = 70 strength

  RESULT: 100 > 70, YOU WIN!

CASUALTIES:
  Winner: 10-30% losses
  Loser: 50-100% losses (often destroyed)

After winning space combat:
  You have ORBITAL CONTROL
  Can now launch ground invasion!


GROUND COMBAT MECHANICS
-----------------------
Triggers when: You click [INVADE]

PLATOON STRENGTH FORMULA:
  Strength = Troops x Equipment x Weapons x Training%

EQUIPMENT MULTIPLIERS:
  Civilian   - 0.5x (very weak)
  Basic      - 1.0x (standard)
  Standard   - 1.5x (good)
  Advanced   - 2.0x (strong)
  Elite      - 2.5x (powerful)

WEAPON MULTIPLIERS:
  Pistol        - 0.8x
  Rifle         - 1.0x
  Assault Rifle - 1.3x
  Plasma        - 1.6x

TRAINING MULTIPLIER:
  0% trained   = 0.0x (useless!)
  50% trained  = 0.5x (weak)
  100% trained = 1.0x (full power)

EXAMPLE GROUND BATTLE:

  YOUR INVASION FORCE:
  Platoon 1: 100 troops, Standard (1.5),
             Assault Rifle (1.3), 100% trained
  Strength = 100 x 1.5 x 1.3 x 1.0 = 195

  Platoon 2: 100 troops, Advanced (2.0),
             Plasma (1.6), 80% trained
  Strength = 100 x 2.0 x 1.6 x 0.8 = 256

  TOTAL: 195 + 256 = 451 strength

  ENEMY DEFENDERS:
  2 Platoons, 110 total troops
  Basic equipment (1.0), Rifle (1.0)
  Strength = 110 x 1.0 x 1.0 = 110

  RESULT: 451 vs 110 = OVERWHELMING VICTORY!
  Enemy annihilated, minimal losses for you.


WINNING COMBAT TIPS
-------------------
SPACE COMBAT:
  - Bring multiple Battle Cruisers (numbers matter!)
  - Attack before they build Orbital Defenses
  - 2-3 cruisers minimum for contested planets
  - Research better weapons if available

GROUND COMBAT:
  - WAIT for 100% training!
  - 50% trained = 50% combat effectiveness
  - Elite + Plasma (4.0x) beats Basic + Rifle (1.0x)
  - Large numbers can compensate for low quality
  - Undefended planets surrender without fight

GENERAL:
  - Concentrate force, don't spread thin
  - Attack enemy weak points first
  - Leave garrison after capturing
  - Build defenses on border planets


COMBAT OUTCOME EFFECTS
----------------------
PLANET CAPTURED:
  - Planet turns blue (yours)
  - All buildings become yours
  - You get 50% of stored resources
  - Population may be reduced
  - Your troops become garrison

BATTLE LOST:
  - Your attacking forces destroyed
  - Enemy keeps the planet
  - You lose invested resources
  - Must rebuild and try again`
  },
  {
    id: 'strategy',
    title: 'Strategy Tips',
    content: `WINNING STRATEGIES
=====================================

EARLY GAME (Turns 1-10)
-----------------------
PRIORITY: Build your economy!

DO:
  Turn 1:   Start Mining Station
  Turn 3-4: Start Horticultural Station
  Turn 5-6: Start Docking Bay
  Turn 6-7: Commission platoons (they need 10 turns!)
  Turn 7-10: Buy Atmosphere Processor, colonize

DON'T:
  - Build military turn 1 (wastes resources)
  - Ignore food (starvation spiral is devastating)
  - Set tax above 60% (hurts growth)

Economy beats military in the long run!


MID GAME (Turns 11-20)
----------------------
PRIORITY: Expand and prepare for war

DO:
  - Colonize 1-2 neutral planets
  - Build Mining/Hort on new colonies
  - Buy 2-3 Battle Cruisers
  - Your platoons reach 100% training
  - Build Orbital Defense on border planets

DON'T:
  - Attack with untrained troops
  - Send single ships against fortified planets
  - Leave homeworld completely undefended


LATE GAME (Turns 20+)
---------------------
PRIORITY: Crush the enemy

DO:
  - Mass your fleet at a staging planet
  - Load trained platoons onto cruisers
  - Attack weakest enemy planet first
  - Capture and immediately fortify
  - Keep producing reinforcements

DON'T:
  - Get complacent (enemy can recover)
  - Ignore enemy counter-attacks
  - Forget to garrison captured planets


COMMON MISTAKES TO AVOID
------------------------
1. BUILDING MILITARY TOO EARLY
   Turn 1: Build Battle Cruiser (50k Cr)
   Turn 2: Broke, can't build economy
   Turn 10: Enemy has 3 planets, you have 1
   SOLUTION: Economy first (turns 1-10)

2. ATTACKING WITH UNTRAINED TROOPS
   New platoons = 0% training = 0 strength!
   50% trained = 50% effectiveness
   SOLUTION: Wait for 100% training

3. IGNORING FOOD PRODUCTION
   Population grows -> needs more food
   Food hits zero -> STARVATION
   Population crashes, morale collapses
   SOLUTION: 1 Hort Station per 200 population

4. SINGLE PLANET FOCUS
   You: 5/5 buildings on homeworld
   Enemy: Expanding to neutrals
   Turn 15: Enemy has 4 planets, you have 1
   SOLUTION: Colonize early!

5. TRICKLING SHIPS ONE AT A TIME
   1 ship vs defended planet = destroyed
   SOLUTION: Mass fleet, attack together


KNOW YOUR ENEMY
---------------
Check enemy behavior:

AGGRESSIVE AI (Commander Kratos):
  - Attacks early (turns 10-15)
  - Prioritizes military
  COUNTER: Build defenses early!

DEFENSIVE AI (Overseer Aegis):
  - Builds many defenses
  - Rarely attacks first
  COUNTER: Take your time, build economy

ECONOMIC AI (Magistrate Midas):
  - Focuses on expansion
  - Snowballs if left alone
  COUNTER: Attack before too late!

BALANCED AI (General Nexus):
  - Adapts to your playstyle
  - Most unpredictable
  COUNTER: Be unpredictable yourself


RECOMMENDED BUILD ORDER
-----------------------
SAFE ECONOMY-FIRST APPROACH:

Turns 1-3:   Mining Station
Turns 3-5:   Horticultural Station
Turns 5-7:   Docking Bay
Turns 6-8:   Commission Platoon #1
Turns 7-9:   Atmosphere Processor
Turns 8-12:  Colonize neutral planet
Turns 10-12: Commission Platoon #2
Turns 12-14: Battle Cruiser #1
Turns 14-16: Battle Cruiser #2
Turns 16+:   Launch invasion!`
  },
  {
    id: 'controls',
    title: 'Controls',
    content: `GAME CONTROLS
=====================================

MOUSE CONTROLS
--------------
LEFT CLICK on planet:
  Select it, show info panel

LEFT CLICK on button:
  Activate that button/action

LEFT CLICK outside panel:
  Close the current panel

MOUSE WHEEL UP/DOWN:
  Zoom in/out on galaxy map

CLICK AND DRAG:
  Pan the galaxy map

DRAG SLIDER:
  Adjust value (like tax rate)


KEYBOARD SHORTCUTS
------------------
SPACE or ENTER:
  End your turn (during Action phase)

ESCAPE:
  Close current panel
  Open/close pause menu

H:
  Toggle this help panel


TOP MENU BAR
------------
HOME icon:
  Return to main menu
  (Warning: unsaved progress lost!)

HELP icon:
  Open/close this help panel

RESET icon:
  Reset camera to your home planet

SPEAKER icon:
  Toggle audio on/off


TURN HUD (Top-Left Corner)
--------------------------
Displays:
  Current turn number
  Current phase (Income/Action/Combat/End)

END TURN button:
  Only visible during Action phase
  Click to end your turn


PLANET INFO PANEL (Right Side)
------------------------------
Appears when you click a planet.
Shows:
  - Planet name and type
  - Owner (you, enemy, or neutral)
  - Population and morale
  - Resource stockpiles
  - Buildings list
  - Docked spacecraft
  - Action buttons

Click outside the panel to close it.


RESOURCE HUD (Top-Right)
------------------------
Shows your total resource stockpiles:
  Credits / Minerals / Fuel / Food / Energy

COLOR CODING:
  White/Green: Healthy (500+)
  Yellow: Warning (100-499)
  Red: Critical (<100)


TOUCH CONTROLS (Mobile)
-----------------------
TAP planet:
  Select it, show info

TAP button:
  Activate action

TAP outside panel:
  Close panel

PINCH in/out:
  Zoom map

TWO-FINGER DRAG:
  Pan map


ACCESSIBILITY
-------------
- All clickable elements have hover effects
- Critical warnings shown in red
- Sound cues for important events
- No time pressure in Action phase`
  },
  {
    id: 'reference',
    title: 'Quick Reference',
    content: `QUICK REFERENCE CARD
=====================================

TURN PHASES
-----------
INCOME  -> Resources auto-generate
ACTION  -> YOUR TURN - build, move, train
COMBAT  -> Battles auto-resolve
END     -> Victory check, next turn

End your turn: SPACE / ENTER / Click END TURN


BUILDINGS
---------
Building              Cost           Time  Effect
---------------------------------------------------------
Mining Station        8k/2k/1k       3T    +50 Min, +30 Fuel
Horticultural Stn     6k/1.5k/0.8k   2T    +100 Food
Docking Bay           5k/1k/0.5k     2T    Build spacecraft
Orbital Defense       12k/3k/2k      3T    +20% defense


SPACECRAFT
----------
Ship                  Cost           Effect
---------------------------------------------------------
Battle Cruiser        50k/10k/5k     Combat, 4 platoons
Cargo Cruiser         30k/5k/3k      Transport resources
Atmosphere Processor  10k/5k/2k      Colonize planets
Solar Satellite       15k/3k/1k      +80 Energy


PLATOON EQUIPMENT
-----------------
Type        Cost      Multiplier
--------------------------------
Civilian    20k Cr    0.5x
Basic       35k Cr    1.0x
Standard    55k Cr    1.5x
Advanced    80k Cr    2.0x
Elite       109k Cr   2.5x


PLATOON WEAPONS
---------------
Type           Cost     Multiplier
----------------------------------
Pistol         5k Cr    0.8x
Rifle          10k Cr   1.0x
Assault Rifle  18k Cr   1.3x
Plasma         30k Cr   1.6x


PLATOON STRENGTH FORMULA
------------------------
Strength = Troops x Equipment x Weapon x Training%

Example: 100 x Elite(2.5) x Plasma(1.6) x 100% = 400


PLANET TYPE BONUSES
-------------------
Type        Minerals  Fuel  Food  Energy  Credits
-------------------------------------------------
Volcanic    5x        3x    0.5x  1x      1x
Tropical    1x        1x    2x    0.75x   1x
Desert      1x        1x    0.25x 2x      1x
Metropolis  1x        1x    1x    1x      2x


RECOMMENDED BUILD ORDER
-----------------------
T1-3:  Mining Station
T3-5:  Horticultural Station
T5-7:  Docking Bay
T6-8:  Commission Platoon
T7-10: Atmosphere Processor -> Colonize
T10+:  Battle Cruisers -> ATTACK!


VICTORY/DEFEAT
--------------
WIN:  Capture ALL enemy planets
LOSE: Lose ALL your planets


QUICK TIPS
----------
- Economy before military
- 100% trained troops only
- Mass your fleet together
- Food prevents starvation
- Match buildings to planet type`
  }
];

/**
 * Get a chapter by ID
 */
export function getChapter(id: string): HelpChapter | undefined {
  return HELP_CHAPTERS.find(chapter => chapter.id === id);
}

/**
 * Get chapter titles for navigation
 */
export function getChapterTitles(): { id: string; title: string }[] {
  return HELP_CHAPTERS.map(({ id, title }) => ({ id, title }));
}
