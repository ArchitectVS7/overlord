/**
 * HelpContent.ts
 * Contains all help chapter content for the in-game help system.
 * Written as actionable "How To Play" instructions.
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

GOAL: Capture all enemy planets to win.

THE TURN CYCLE
--------------
Every turn has 4 phases that cycle automatically:

  1. INCOME PHASE (automatic)
     Just watch - resources generate, population grows.
     You cannot do anything during this phase.

  2. ACTION PHASE (your turn!)
     This is when YOU play. Click planets, build things,
     move ships. When done, click "END TURN" or press Space.

  3. COMBAT PHASE (automatic)
     Battles resolve. Watch the results.

  4. END PHASE (automatic)
     Buildings complete. Victory check happens.
     Then the next turn starts.

YOUR FIRST TURN - STEP BY STEP
------------------------------
1. Look at the top-left: It says "Turn 1" and "ACTION"
   This means it's your turn to act.

2. Click on your blue planet (your home world)
   A panel opens on the right showing planet info.

3. Click the "Build" button
   A menu opens showing available buildings.

4. Click "Mining Station" to start building it
   (You need minerals and fuel for ships later)

5. Close the panel by clicking outside it

6. Click "END TURN" button (or press Space)
   The turn advances through Combat and End phases.

7. Repeat! Each turn, build more, train troops, buy ships.`
  },
  {
    id: 'phases',
    title: 'Turn Phases',
    content: `WHAT TO DO IN EACH PHASE
=====================================

INCOME PHASE - "I see INCOME on screen"
---------------------------------------
WHAT HAPPENS: Resources generate automatically.
WHAT YOU DO:  Nothing. Just wait 1-2 seconds.
              Watch your resource numbers update.

The game shows you income notifications:
  "+500 Credits from taxes"
  "+50 Minerals from Mining Station"

This phase ends automatically.


ACTION PHASE - "I see ACTION on screen"
---------------------------------------
WHAT HAPPENS: This is YOUR turn to play!
WHAT YOU DO:  Everything! This is the main game phase.

You can:
  - Click planets to see info and take actions
  - Build structures on your planets
  - Purchase spacecraft
  - Train platoons (troops)
  - Move your ships to other planets
  - Load troops onto Battle Cruisers

HOW TO END YOUR TURN:
  Click the "END TURN" button (top-left)
  OR press the Space bar
  OR press Enter

Take your time - there's no timer.


COMBAT PHASE - "I see COMBAT on screen"
---------------------------------------
WHAT HAPPENS: All battles resolve automatically.
WHAT YOU DO:  Watch. You cannot intervene.

If your ships arrived at an enemy planet, combat happens.
Results appear as notifications.

This phase ends automatically after ~2 seconds.


END PHASE - "I see END on screen"
---------------------------------
WHAT HAPPENS: Buildings finish, victory is checked.
WHAT YOU DO:  Nothing. Just wait.

If a building was 1 turn from completion, it finishes now.
You'll see: "Mining Station completed on [Planet]!"

Then the next turn begins with Income Phase.`
  },
  {
    id: 'planets',
    title: 'Planet Actions',
    content: `WHAT CAN I DO WITH PLANETS?
=====================================

HOW TO SELECT A PLANET
----------------------
1. Click on any planet in the galaxy map
2. A panel appears on the right side
3. You see: name, type, population, resources

The panel has ACTION BUTTONS at the bottom.
Different buttons appear based on who owns the planet.


YOUR PLANETS (Blue) - Available Actions:
----------------------------------------

BUILD BUTTON
  Opens the construction menu.
  Pick a building to start construction.
  Buildings take 2-3 turns to complete.

COMMISSION BUTTON
  Train a new platoon (ground troops).
  Pick equipment quality and weapons.
  Platoons take ~10 turns to reach full training.

PLATOONS BUTTON
  View troops stationed on this planet.
  You can disband them here.
  Or load them onto Battle Cruisers.

SPACECRAFT BUTTON
  Buy new ships at this planet.
  Ships appear immediately when purchased.
  Requires a Docking Bay to build most ships.

NAVIGATE BUTTON
  Send a ship to another planet.
  Select destination, ship travels over turns.
  Uses fuel during transit.


ENEMY PLANETS (Red) - Available Actions:
----------------------------------------

INVADE BUTTON (if you have troops nearby)
  Launch ground assault with your platoons.
  Must have Battle Cruisers with loaded troops.
  Win the battle to capture the planet!


NEUTRAL PLANETS (Gray):
-----------------------
These are unclaimed. To colonize:
1. Buy an Atmosphere Processor
2. Navigate it to the neutral planet
3. Deploy it (colonization takes time)`
  },
  {
    id: 'building',
    title: 'How to Build',
    content: `HOW TO BUILD STRUCTURES
=====================================

STEP-BY-STEP BUILDING
---------------------
1. Click on YOUR planet (blue color)
2. Click the "Build" button in the panel
3. A menu shows available buildings
4. Buildings you can't afford are grayed out
5. Click a building to start construction
6. Construction takes 2-3 turns to complete

DURING CONSTRUCTION:
  The planet panel shows a progress bar
  "Mining Station - 2 turns remaining"
  You cannot build another thing until it finishes.


WHAT SHOULD I BUILD FIRST?
--------------------------
Turn 1-2: Mining Station
  Gives you Minerals (+50) and Fuel (+30) per turn.
  You need these to build ships!

Turn 3-4: Horticultural Station
  Gives you Food (+100) per turn.
  Your population starves without food!

Turn 5+: Docking Bay
  Allows you to build spacecraft.
  You can't buy ships without this!

Later: Orbital Defense
  Protects your planet from attack.
  Build these before the enemy arrives.


BUILDING COSTS (Credits / Minerals / Fuel)
------------------------------------------
Mining Station        8,000 / 2,000 / 1,000  (3 turns)
Horticultural Station 6,000 / 1,500 / 800    (2 turns)
Docking Bay           5,000 / 1,000 / 500    (2 turns)
Orbital Defense      12,000 / 3,000 / 2,000  (3 turns)


PLANET TYPE BONUSES
-------------------
Build the RIGHT buildings on the RIGHT planets:

Volcanic planets:  5x minerals, 3x fuel
  -> Build Mining Stations here!

Tropical planets:  2x food
  -> Build Horticultural Stations here!

Desert planets:    2x energy
  -> Deploy Solar Satellites here!

Metropolis:        2x credits
  -> Already developed, just collect taxes!`
  },
  {
    id: 'military',
    title: 'Military Guide',
    content: `HOW TO BUILD AN ARMY
=====================================

YOUR MILITARY HAS TWO PARTS:
1. Spacecraft (fight in space, transport troops)
2. Platoons (ground troops that capture planets)

You need BOTH to conquer enemy planets!


HOW TO BUY SPACECRAFT
---------------------
1. Click on your planet (must have a Docking Bay)
2. Click "Spacecraft" button
3. Choose a ship type:

   Battle Cruiser - 50,000 Cr / 10,000 Min / 5,000 Fuel
     Your main warship. Can carry 4 platoons.
     Fast (50 speed). Use these for invasions!

   Cargo Cruiser - 30,000 Cr / 5,000 Min / 3,000 Fuel
     Carries resources between planets.
     Slower (30 speed). For logistics.

   Atmosphere Processor - 10,000 Cr / 5,000 Min / 2,000 Fuel
     Colonizes neutral planets.
     Consumed when you use it.

4. Click to purchase. Ship appears immediately.


HOW TO TRAIN TROOPS (PLATOONS)
------------------------------
1. Click on your planet
2. Click "Commission" button
3. Choose troop count (up to 200 per platoon)
4. Choose equipment quality:
   - Civilian (cheap but weak)
   - Basic (standard)
   - Standard (good)
   - Advanced (strong)
   - Elite (best, very expensive)
5. Choose weapons:
   - Pistol / Rifle / Assault Rifle / Plasma
6. Click to commission

IMPORTANT: New platoons start at 0% training!
They gain +10% per turn. Wait 10 turns for 100%.
Untrained troops fight poorly!


HOW TO LOAD TROOPS ONTO SHIPS
-----------------------------
1. Click your planet with platoons and Battle Cruisers
2. Click "Platoons" button
3. Select a platoon
4. Click "Load onto Cruiser"
5. The platoon is now on the ship!

Each Battle Cruiser holds up to 4 platoons.
You need loaded cruisers to invade planets.`
  },
  {
    id: 'movement',
    title: 'Moving Ships',
    content: `HOW TO MOVE SPACECRAFT
=====================================

STEP-BY-STEP MOVEMENT
---------------------
1. Click on a planet with your ships
2. Click the "Navigate" button
3. A list of destinations appears
4. Click a destination planet
5. Your ship begins traveling!

DURING TRANSIT:
  The ship is "in transit" and cannot be used
  Travel time depends on distance and ship speed
  Fuel is consumed during travel


TRAVEL TIMES (approximate)
--------------------------
Battle Cruiser:  Speed 50 - fastest
Cargo Cruiser:   Speed 30 - moderate
Atmosphere Proc: Speed 30 - moderate


MOVEMENT TIPS
-------------
- Plan ahead! Ships take multiple turns to arrive.
- Send troops BEFORE you need them.
- Keep fuel reserves for emergencies.
- You can't recall ships mid-journey.


WHAT HAPPENS ON ARRIVAL?
------------------------
When your ship reaches a destination:

YOUR PLANET: Ship docks. You can unload cargo/troops.

NEUTRAL PLANET:
  If it's an Atmosphere Processor, you can deploy it
  to begin colonization.

ENEMY PLANET:
  SPACE COMBAT happens first!
  If you win, you achieve orbital control.
  Then you can INVADE with ground troops.`
  },
  {
    id: 'invasion',
    title: 'How to Invade',
    content: `HOW TO CAPTURE ENEMY PLANETS
=====================================

INVASION CHECKLIST
------------------
Before you can invade, you need:

[ ] Battle Cruiser(s) at the enemy planet
[ ] Platoons LOADED onto those cruisers
[ ] Orbital control (no enemy ships remaining)

If enemy ships are present, space combat happens
first. You must destroy them to proceed.


STEP-BY-STEP INVASION
---------------------
1. Move Battle Cruiser(s) to enemy planet
   (Make sure platoons are loaded aboard!)

2. Wait for arrival (may take several turns)

3. Space combat resolves automatically
   Your ships vs their ships + orbital defenses

4. If you win space combat, you have orbital control

5. Click on the enemy planet

6. Click the "Invade" button

7. Choose aggression level:
   - Low: Fewer casualties, but might not win
   - High: More casualties, but stronger attack

8. Ground combat resolves

9. If you win, the planet is now YOURS!


COMBAT TIPS
-----------
- Bring overwhelming force. 2-3 cruisers minimum.
- Fully trained platoons (100%) fight much better.
- Elite troops beat larger numbers of basic troops.
- Orbital Defense platforms give defenders +20% each.
- Undefended planets surrender without a fight!


AFTER CAPTURING A PLANET
------------------------
- The planet turns blue (yours)
- Enemy buildings become yours
- You capture 50% of stored resources
- Population may be reduced from fighting
- Start building immediately to fortify it!`
  },
  {
    id: 'colonize',
    title: 'Colonization',
    content: `HOW TO COLONIZE NEUTRAL PLANETS
=====================================

Neutral planets (gray) are unclaimed.
You can colonize them to expand your empire.


WHAT YOU NEED
-------------
1. An Atmosphere Processor spacecraft
   Cost: 10,000 Credits / 5,000 Minerals / 2,000 Fuel
   Buy it like any other ship (Spacecraft button)

2. A destination neutral planet to colonize


STEP-BY-STEP COLONIZATION
-------------------------
1. Buy an Atmosphere Processor at one of your planets

2. Click "Navigate" and select the neutral planet

3. Wait for the Atmosphere Processor to arrive
   (Travel takes 1-3 turns depending on distance)

4. Once arrived, click on the neutral planet

5. Deploy the Atmosphere Processor
   The processor is CONSUMED (disappears)

6. Terraforming begins!
   Takes about 10 turns to complete.

7. When finished, the planet turns blue (yours)


COLONIZATION TIPS
-----------------
- Scout first: Know what planet type it is!
  Volcanic = great for mining
  Tropical = great for food
  Desert = great for energy

- Send a Cargo Cruiser with the processor
  New colonies need resources to get started!

- Protect your colonies: They start weak
  Build Orbital Defense as soon as possible

- Don't overextend: Colonizing costs resources
  Make sure you can defend new territory`
  },
  {
    id: 'economy',
    title: 'Economy',
    content: `MANAGING YOUR ECONOMY
=====================================

THE FIVE RESOURCES
------------------
CREDITS (gold) - Money for everything
  From: Taxes on population
  Used for: All purchases

MINERALS (silver) - Building materials
  From: Mining Stations
  Used for: Buildings, spacecraft

FUEL (orange) - Ship propulsion
  From: Mining Stations
  Used for: Building ships, travel

FOOD (green) - Feeds your people
  From: Horticultural Stations
  Used for: Population (0.5 per person/turn)
  WARNING: No food = starvation!

ENERGY (cyan) - Powers operations
  From: Solar Satellites
  Used for: Building operations


RESOURCE STATUS INDICATORS
--------------------------
500+     Normal (white/green)
100-499  Warning (yellow) - take action soon
<100     Critical (red) - immediate shortage!


HOW TO INCREASE INCOME
----------------------
Credits:
  - Increase population (they pay taxes)
  - Don't set taxes too low
  - Capture Metropolis planets (2x credits)

Minerals:
  - Build Mining Stations
  - Volcanic planets give 5x bonus!

Fuel:
  - Mining Stations also produce fuel
  - Volcanic planets give 3x bonus!

Food:
  - Build Horticultural Stations
  - Tropical planets give 2x bonus!

Energy:
  - Deploy Solar Satellites
  - Desert planets give 2x bonus!


COMMON ECONOMIC MISTAKES
------------------------
- Building military before economy
- Ignoring food (causes starvation)
- Setting taxes too high (hurts morale)
- Not matching buildings to planet types`
  },
  {
    id: 'combat',
    title: 'Combat Guide',
    content: `HOW COMBAT WORKS
=====================================

There are two types of combat:

1. SPACE COMBAT - Ships vs Ships
2. GROUND COMBAT - Platoons vs Planet Defense


SPACE COMBAT
------------
Happens when your fleet arrives at an enemy planet.

FACTORS:
  - Number of Battle Cruisers
  - Crew on each ship
  - Weapon technology level
  - Orbital Defense platforms (+20% each for defender)

Higher total strength wins.
Loser's ships are destroyed.

If you win, you have ORBITAL CONTROL.
Now you can invade with ground troops.


GROUND COMBAT
-------------
Happens when you click "Invade" on an enemy planet.

YOUR STRENGTH:
  Platoon Strength = Troops x Equipment x Weapons x Training%

  Example: 100 troops, Elite gear (2.5x), Plasma (1.6x), 80% trained
           100 x 2.5 x 1.6 x 0.80 = 320 strength

DEFENDER STRENGTH:
  Based on planet population and defense buildings.

CASUALTIES:
  - Winner takes 10-30% losses
  - Loser takes 50-90% losses
  - Higher aggression = more damage both ways


WINNING COMBAT TIPS
-------------------
Space:
  - Bring multiple Battle Cruisers (strength in numbers)
  - Attack before they build Orbital Defenses
  - Research better weapons if available

Ground:
  - Wait for 100% training on platoons
  - Elite + Plasma beats larger Basic + Rifle armies
  - Undefended planets surrender without a fight
  - Use moderate aggression (50-70%) for balance`
  },
  {
    id: 'strategy',
    title: 'Strategy Tips',
    content: `WINNING STRATEGIES
=====================================

EARLY GAME (Turns 1-10)
-----------------------
Priority: Build your economy!

Turn 1: Start Mining Station (minerals + fuel)
Turn 2: Wait for Mining Station (still building)
Turn 3: Mining Station done! Start Horticultural Station
Turn 4: Start Docking Bay
Turn 5-6: Docking Bay done! Buy an Atmosphere Processor
Turn 7-10: Send processor to colonize a good planet

DO NOT build military yet unless threatened!
Economy beats military in the long run.


MID GAME (Turns 11-25)
----------------------
Priority: Expand and prepare for war

- Colonize 1-2 neutral planets
- Build Mining/Horticultural on new colonies
- Start training platoons (they need 10 turns!)
- Buy 2-3 Battle Cruisers
- Build Orbital Defenses on vulnerable planets


LATE GAME (Turns 25+)
---------------------
Priority: Crush the enemy

- Mass your fleet at a staging planet
- Load trained platoons onto cruisers
- Attack the weakest enemy planet first
- Capture and immediately fortify
- Repeat until victory!


COMMON MISTAKES TO AVOID
------------------------
1. Building military before economy
   -> You'll run out of resources

2. Attacking with untrained troops
   -> 50% trained = 50% effectiveness

3. Sending ships one at a time
   -> Mass your fleet, attack together

4. Ignoring food production
   -> Starvation destroys morale and population

5. Not building Orbital Defenses
   -> Easy target for enemy attacks

6. Over-expanding too fast
   -> Can't defend all your planets


KNOW YOUR ENEMY
---------------
Check the opponent panel (top-left area):

AGGRESSIVE AI: Will attack early. Build defenses!
DEFENSIVE AI:  Turtles up. Take your time, build economy.
ECONOMIC AI:   Out-produces you. Attack before too late!
BALANCED AI:   Adapts. Be unpredictable.`
  },
  {
    id: 'controls',
    title: 'Controls',
    content: `GAME CONTROLS
=====================================

MOUSE CONTROLS
--------------
Left Click on planet: Select it, show info panel
Left Click outside panel: Close the panel
Mouse Wheel: Zoom in/out on galaxy map
Click and Drag: Pan the galaxy map


KEYBOARD SHORTCUTS
------------------
Space or Enter: End your turn (during Action phase)
Escape: Close current panel / Pause menu
H: Toggle help overlay
Ctrl+S: Save game
Ctrl+M: Mute/unmute audio
Ctrl+,: Audio settings


TOP MENU BAR
------------
HOME: Return to main menu
HELP: Open this help panel
RESET: Reset camera to home planet
Speaker icon: Toggle audio on/off


TURN HUD (Top-Left)
-------------------
Shows: Current turn number
Shows: Current phase (Income/Action/Combat/End)
Button: "END TURN" (only visible during Action phase)


PLANET INFO PANEL (Right Side)
------------------------------
Appears when you click a planet.
Shows planet details and action buttons.
Click outside the panel to close it.


RESOURCE HUD (Top-Right)
------------------------
Shows your current resource stockpiles:
  Credits / Minerals / Fuel / Food / Energy

Colors indicate status:
  White/Green: Healthy (500+)
  Yellow: Warning (100-499)
  Red: Critical (<100)`
  },
  {
    id: 'reference',
    title: 'Quick Reference',
    content: `QUICK REFERENCE CARD
=====================================

TURN PHASES
-----------
INCOME   -> Resources auto-generate
ACTION   -> YOUR TURN - build, move, train
COMBAT   -> Battles auto-resolve
END      -> Buildings complete, next turn


BUILDINGS (Cost: Cr / Min / Fuel)
---------------------------------
Mining Station         8k / 2k / 1k    +50 min, +30 fuel
Horticultural Station  6k / 1.5k / 0.8k +100 food
Docking Bay            5k / 1k / 0.5k  Allows ship building
Orbital Defense       12k / 3k / 2k    +20% space defense


SPACECRAFT (Cost: Cr / Min / Fuel)
----------------------------------
Battle Cruiser    50k / 10k / 5k   Combat, carries 4 platoons
Cargo Cruiser     30k / 5k / 3k    Transports resources
Atmosphere Proc   10k / 5k / 2k    Colonizes planets
Solar Satellite   15k / 3k / 1k    +80 energy


PLATOON EQUIPMENT
-----------------
Civilian    20k Cr    0.5x strength
Basic       35k Cr    1.0x strength
Standard    55k Cr    1.5x strength
Advanced    80k Cr    2.0x strength
Elite      109k Cr    2.5x strength


PLATOON WEAPONS
---------------
Pistol         5k Cr    0.8x damage
Rifle         10k Cr    1.0x damage
Assault Rifle 18k Cr    1.3x damage
Plasma        30k Cr    1.6x damage


PLANET TYPE BONUSES
-------------------
Volcanic:   5x minerals, 3x fuel
Tropical:   2x food
Desert:     2x energy
Metropolis: 2x credits


VICTORY CONDITION
-----------------
Capture ALL enemy planets!
Or destroy all enemy spacecraft.


DEFEAT CONDITION
----------------
Lose ALL your planets.
Or lose all your spacecraft.`
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
