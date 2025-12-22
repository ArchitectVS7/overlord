# Overlord: Complete Playthrough Manual
## A Click-by-Click Guide to Galactic Conquest

#### Phase 1: INCOME
- **Automatic** (no player action)
- Resources are produced
- Population grows
- Food is consumed
- Buildings complete construction
- **Duration:** 2-3 seconds (display income phase stats, allow player to press spacebar to continue)

#### Phase 2: ACTION
- **Player controlled**
- Build structures
- Purchase units
- Issue movement orders
- Make all your decisions
- **Duration:** As long as you want

#### Phase 3: COMBAT
- **Automatic**
- All battles resolve
- Fleets engage
- Invasions occur
- **Duration:** 5-10 seconds per battle

#### Phase 4: END
- **Automatic**
- AI takes its turn
- Victory checked
- Next turn begins
- **Duration:** 2-5 seconds

---

## 🔄 Complete Turn Cycle {#turn-cycle}

### Detailed Breakdown of Every Turn

Let me explain EXACTLY what happens each turn and what YOU do.

### INCOME PHASE (Automatic - Watch This Happen)

```
═══════════════════════════════════════════════════
                  INCOME PHASE
═══════════════════════════════════════════════════

For EACH planet you own:

1. PRODUCTION (Buildings generate resources)
   
   Mining Station: +50 Minerals, +30 Fuel
   Horticultural Station: +100 Food
   Solar Satellite: +80 Energy
   
   [Planet multipliers applied]
   Volcanic: 5× Min, 3× Fuel
   Desert: 2× Energy
   Tropical: 2× Food
   Metropolis: 2× Credits

2. TAX COLLECTION
   
   Credits gained = Population × Tax Rate × Planet Bonus
   
   Example:
   500 pop × 40% tax × 2.0 (Metropolis) = 400 Credits

3. FOOD CONSUMPTION
   
   Food used = Population × 0.5
   
   Example:
   500 pop × 0.5 = 250 Food consumed
   
   If Food < 0:
   ⚠️ STARVATION EVENT
   - Population decreases 5%
   - Morale drops to 25%
   - Production halts

4. MORALE UPDATE
   
   Tax Rate > 75%: Morale -5
   Tax Rate < 25%: Morale +2
   Food surplus: Morale stable
   Food shortage: Morale -10
   
5. POPULATION GROWTH
   
   New population = Current × (Morale/100) × 0.05
   
   Example:
   500 × (75/100) × 0.05 = 18.75 → 19 new people
   
   Population cap: 99,999 per planet

6. CONSTRUCTION PROGRESS
   
   Each building under construction:
   Turns Remaining = Turns Remaining - 1
   
   If Turns Remaining = 0:
   ✓ Building becomes operational
   Crew assigned from population
   Production begins next turn

═══════════════════════════════════════════════════
```

### ACTION PHASE (This is YOUR turn)

This is where you make ALL your decisions. The game WAITS for you.

#### What You Can Do:

**A) PLANET MANAGEMENT**

1. Click any of your planets
2. See planet details panel
3. Options available:
   - Build new structures
   - Adjust tax rate
   - Commission platoons
   - View/manage buildings
   - Scrap buildings (50% refund)

**B) SPACECRAFT MANAGEMENT**

1. Click planet with docking bay
2. Click [SPACECRAFT] button
3. Purchase options:
   - Battle Cruiser
   - Cargo Cruiser
   - Solar Satellite
   - Atmosphere Processor

**C) FLEET MOVEMENT**

1. Click planet with spacecraft
2. Select spacecraft to move
3. Click destination planet
4. Fleet travels automatically next turn

**D) MILITARY COMMISSIONING**

1. Click your planet
2. Click [PLATOONS] button
3. Configure:
   - Troop count (1-200)
   - Equipment level
   - Weapon type
4. Training begins (10 turns to 100%)

**E) COMBAT PREPARATION**

1. Load platoons onto Battle Cruisers
2. Move fleets to enemy planets
3. Combat resolves in Combat Phase

**F) RESEARCH** (if available)

1. Access research menu
2. Upgrade weapon tiers
3. Cost: 500k+ Credits
4. Takes multiple turns

#### Example Action Phase Turn:

```
TURN 5 - YOUR ACTION PHASE

Current Situation:
- You control 1 planet (Alpha Prime)
- Resources: 15k Cr, 3k Min, 2k Fuel, 1k Food
- 1 Mining Station operational
- 1 Horticultural Station operational
- No military yet

Your Decision Process:

Step 1: "What do I need most?"
→ Look at resources
→ Credits good, Minerals ok, Food low
→ Decision: Build another Food station

Step 2: Click Alpha Prime
Step 3: Click [BUILD]
Step 4: Select [HORTICULTURAL STATION]
Step 5: Click [CONFIRM]

Step 6: "Should I prepare military?"
→ Enemy has 1 planet
→ No immediate threat
→ Decision: Wait 2 more turns, build economy

Step 7: Press SPACE to end turn

═══════════════════════════════════════════════════
```

### COMBAT PHASE (Automatic - Watch Battles)

If you sent fleets to enemy planets, combat resolves here.

#### Space Combat Resolution

```
BATTLE AT: Enemy Planet "Beta"

YOUR FORCES:
2× Battle Cruisers
- Crew: 100 total
- Weapons: Laser (1.0×)
Attack Strength: 100

ENEMY FORCES:
1× Battle Cruiser
1× Orbital Defense Platform (+20%)
- Crew: 50
- Weapons: Laser (1.0×)
Defense Strength: 60 (50 + 20% bonus)

═══════════════════════════════════════════════════

COMBAT BEGINS...

Your Attack: 100 vs Enemy Defense: 60
Result: YOU WIN

Enemy Battle Cruiser DESTROYED
Orbital Defense Platform damaged

Casualties:
- You: 1 Battle Cruiser damaged (20% crew loss)
- Enemy: 1 Battle Cruiser lost

ORBITAL CONTROL ACHIEVED
You may now invade the planet

═══════════════════════════════════════════════════
```

#### Ground Combat Resolution

If you have Battle Cruisers with platoons:

```
GROUND INVASION: Enemy Planet "Beta"

YOUR INVASION FORCE:
3× Platoons disembarking
- 100 troops each (300 total)
- Equipment: Standard (1.5×)
- Weapons: Assault Rifle (1.3×)
- Training: 70%

Calculation:
300 × 1.5 × 1.3 × 0.7 = 409 Strength

ENEMY DEFENDERS:
2× Platoons
- 60 troops each (120 total)
- Equipment: Basic (1.0×)
- Weapons: Rifle (1.0×)
- Training: 100%

Calculation:
120 × 1.0 × 1.0 × 1.0 = 120 Strength

═══════════════════════════════════════════════════

BATTLE BEGINS...

Your Strength: 409 vs Enemy Strength: 120
Result: OVERWHELMING VICTORY

Enemy forces annihilated!
Your losses: 12% (36 troops lost)

PLANET CAPTURED!
Planet Beta is now yours

Resources Captured:
- 50% of stored resources
- Credits: +5,000
- Minerals: +2,000
- Fuel: +1,500

═══════════════════════════════════════════════════
```

### END PHASE (Automatic - Brief Pause)

```
═══════════════════════════════════════════════════
                    END PHASE
═══════════════════════════════════════════════════

AI Turn Processing...

Enemy builds:
- 1× Mining Station at their planet
- 1× Battle Cruiser

Enemy moves:
- No fleet movements

Victory Check:
- You control: 2 planets
- Enemy controls: 1 planet
→ Game continues

Turn 6 begins...

═══════════════════════════════════════════════════
```

---

## 🏗️ Planet Management {#planet-management}

### How to Actually Build and Manage

This section explains HOW to do everything, step-by-step.

### Building Your First Mining Station

**Scenario:** You need more minerals for expansion.

**Step-by-Step:**

1. **Click your planet** on the galaxy map
   - Planet details panel opens on right

2. **Check if you can afford it:**
```
Mining Station Costs:
- 8,000 Credits
- 2,000 Minerals  
- 1,000 Fuel

Your Resources:
- 10,000 Credits ✓
- 5,000 Minerals ✓
- 3,000 Fuel ✓
```

3. **Check if you have space:**
```
BUILDINGS: (1/5 slots used)
[Docking Bay]

Surface Slots Available: 4
```

4. **Check if you have crew:**
```
Population: 500
Crew Required: 15
Available Crew: 485 (500 - 15 from Docking Bay)
```

5. **Click [BUILD] button**

6. **Build menu appears:**
```
╔══════════════════════════════════════╗
║ SELECT BUILDING                      ║
║                                      ║
║ [MINING STATION] ← Click this        ║
║ Produces: 50 Min, 30 Fuel per turn  ║
║ ...                                  ║
╚══════════════════════════════════════╝
```

7. **Click [MINING STATION]**

8. **Confirmation dialog:**
```
╔══════════════════════════════════════╗
║ BUILD MINING STATION?                ║
║                                      ║
║ This will cost:                      ║
║ -8,000 Credits                       ║
║ -2,000 Minerals                      ║
║ -1,000 Fuel                          ║
║ -15 Crew (from population)           ║
║                                      ║
║ [CONFIRM]  [CANCEL]                  ║
╚══════════════════════════════════════╝
```

9. **Click [CONFIRM]**

10. **Result:**
```
✓ Mining Station construction started
Turns remaining: 3

Resources deducted:
Credits: 2,000 (was 10,000)
Minerals: 3,000 (was 5,000)
Fuel: 2,000 (was 3,000)

Crew assigned: 15
Population: 485 (was 500)
```

11. **Wait 3 turns** (press SPACE three times)

12. **Turn 4 Income Phase:**
```
✓ Mining Station COMPLETE

Now producing each turn:
+50 Minerals (×5 if Volcanic planet = 250!)
+30 Fuel (×3 if Volcanic planet = 90!)
```

### Adjusting Tax Rate

**When to adjust:**
- High morale + need credits? → Increase tax
- Low morale? → Decrease tax
- Food shortage? → Decrease tax (helps morale)

**How to adjust:**

1. Click your planet
2. Find tax slider:
```
TAX RATE: [40%] ◄═══●═══════► [100%]
                  ▲
            Drag this
```

3. Drag slider left (decrease) or right (increase)

4. See immediate preview:
```
Current: 40% tax
Change to: 60% tax

Tax Revenue:
Before: 400 Credits/turn
After: 600 Credits/turn

Morale Effect:
Before: 75% (stable)
After: 75% → 70% (will decrease)

Warning: High taxes decrease morale!
```

5. Release slider when satisfied

6. Click [CLOSE] to confirm

**Tax Strategy:**
- **40-60%:** Balanced (recommended)
- **<40%:** Happy population, slow income
- **>75%:** Angry population, morale penalty

### Managing Multiple Planets

**Scenario:** You now control 3 planets.

**Specialization Strategy:**

**Planet 1 (Your Homeworld - Metropolis):**
- Focus: Economy (2× Credits bonus)
- Buildings:
  - 3× Horticultural Stations (food for all planets)
  - 2× Docking Bays (spacecraft construction)
- Tax: 60% (maximize credit income)
- Role: Economic engine

**Planet 2 (Volcanic World):**
- Focus: Production (5× Minerals, 3× Fuel)
- Buildings:
  - 5× Mining Stations (maximum production)
- Tax: 40% (standard)
- Role: Resource supply depot

**Planet 3 (Frontier World - Desert):**
- Focus: Military staging (2× Energy)
- Buildings:
  - 2× Orbital Defense Platforms (fortified)
  - 2× Solar Satellites (energy for fleet)
  - 1× Docking Bay (fleet staging)
- Tax: 50%
- Role: Forward military base

**Managing Resources Across Planets:**

Use Cargo Cruisers to transport resources:

1. Build Cargo Cruiser at Planet 1
2. Load resources:
```
Click planet → Click [SPACECRAFT] → Select Cargo Cruiser
→ Click [LOAD CARGO]

╔══════════════════════════════════════╗
║ LOAD CARGO                           ║
║                                      ║
║ Available Resources:                 ║
║ Credits: 50,000                      ║
║ Minerals: 25,000                     ║
║ Fuel: 15,000                         ║
║ Food: 10,000                         ║
║                                      ║
║ Cargo Capacity: 1,000 each           ║
║                                      ║
║ Load:                                ║
║ Minerals: [1,000] ◄═●═► [max]       ║
║ Fuel:     [1,000] ◄═●═► [max]       ║
║ Food:     [500]   ◄═●═► [max]       ║
║                                      ║
║ [CONFIRM]  [CANCEL]                  ║
╚══════════════════════════════════════╝
```

3. Navigate to destination planet
4. Unload cargo when arrived

---

## ⚔️ Military Operations {#military-operations}

### Building Your First Military

**Timeline for invasion force:**

**Turns 1-5: Economy**
Build production infrastructure first

**Turn 5: Commission Platoons**
Start training now (takes 10 turns)

**Turns 6-14: Training period**
Build Battle Cruisers during this time

**Turn 15: Ready to invade**
Platoons at 100% training, ships ready

### Commissioning a Platoon: Complete Process

**Step 1:** Ensure you have resources
```
Platoon Cost (Standard + Assault Rifle):
- 55,000 Credits (equipment)
- 18,000 Credits (weapons)
Total: 73,000 Credits

Your Credits: 150,000 ✓
```

**Step 2:** Click your planet

**Step 3:** Click [PLATOONS] button

**Step 4:** Platoon commissioning screen appears:
```
╔══════════════════════════════════════════╗
║ COMMISSION NEW PLATOON                   ║
║                                          ║
║ TROOP COUNT: [100] ◄═══●═══► [200]      ║
║                    ▲                     ║
║            Drag to set number            ║
║                                          ║
║ EQUIPMENT:                               ║
║ ○ Civilian    (20k Cr) - No armor       ║
║ ○ Basic       (35k Cr) - Light armor    ║
║ ● Standard    (55k Cr) - Medium armor   ║
║ ○ Advanced    (80k Cr) - Heavy armor    ║
║ ○ Elite      (109k Cr) - Power armor    ║
║                                          ║
║ WEAPONS:                                 ║
║ ○ Pistol         (5k Cr) - Sidearms     ║
║ ○ Rifle         (10k Cr) - Standard     ║
║ ● Assault Rifle (18k Cr) - Automatic    ║
║ ○ Plasma        (30k Cr) - Energy       ║
║                                          ║
║ COMBAT STRENGTH PREVIEW:                 ║
║ At 0% training:   0                      ║
║ At 50% training:  97.5                   ║
║ At 100% training: 195                    ║
║                                          ║
║ Training Time: 10 turns to 100%          ║
║                                          ║
║ [COMMISSION]  [CANCEL]                   ║
╚══════════════════════════════════════════╝
```

**Step 5:** Configure your platoon
- Set troop count (100 recommended)
- Select equipment (Standard for balance)
- Select weapons (Assault Rifle for power)

**Step 6:** Click [COMMISSION]

**Step 7:** Platoon begins training:
```
✓ Platoon commissioned

Status: Training (0%)
Training progress: +10% per turn
Expected completion: Turn 15

Credits spent: -73,000
Remaining: 77,000
```

**Step 8:** Wait 10 turns for training

**Turns 6-15: Training progress:**
```
Turn 6:  Training 10%  (Strength: 19.5)
Turn 7:  Training 20%  (Strength: 39)
Turn 8:  Training 30%  (Strength: 58.5)
Turn 9:  Training 40%  (Strength: 78)
Turn 10: Training 50%  (Strength: 97.5)
Turn 11: Training 60%  (Strength: 117)
Turn 12: Training 70%  (Strength: 136.5)
Turn 13: Training 80%  (Strength: 156)
Turn 14: Training 90%  (Strength: 175.5)
Turn 15: Training 100% (Strength: 195) ✓ READY
```

### Building Battle Cruisers

**When to build:** While platoons train (Turns 6-14)

**Step 1:** Ensure you have a Docking Bay
```
If you don't have one:
1. Build Docking Bay first (2 turns, 5k Cr)
2. Wait for completion
3. Then proceed
```

**Step 2:** Click planet with Docking Bay

**Step 3:** Click [SPACECRAFT] button

**Step 4:** Spacecraft menu:
```
╔══════════════════════════════════════╗
║ SPACECRAFT CONSTRUCTION              ║
║                                      ║
║ [BATTLE CRUISER]                     ║
║ Cost: 50k Cr / 10k Min / 5k Fuel    ║
║ Crew: 50                             ║
║ Speed: 50 units/turn                 ║
║ Capacity: 4 platoons                 ║
║                                      ║
║ [CARGO CRUISER]                      ║
║ Cost: 30k Cr / 5k Min / 3k Fuel     ║
║ Crew: 30                             ║
║ Speed: 30 units/turn                 ║
║ Capacity: 1000 of each resource      ║
║                                      ║
║ [SOLAR SATELLITE]                    ║
║ Cost: 15k Cr / 3k Min / 1k Fuel     ║
║ Crew: 5                              ║
║ Produces: 80 Energy/turn             ║
║                                      ║
║ [ATMOSPHERE PROCESSOR]               ║
║ Cost: 10k Cr / 5k Min / 2k Fuel     ║
║ Crew: 20                             ║
║ Use: Colonize neutral planets        ║
║                                      ║
║ [BACK]                               ║
╚══════════════════════════════════════╝
```

**Step 5:** Click [BATTLE CRUISER]

**Step 6:** Purchase confirmation:
```
╔══════════════════════════════════════╗
║ BUILD BATTLE CRUISER?                ║
║                                      ║
║ Cost:                                ║
║ -50,000 Credits                      ║
║ -10,000 Minerals                     ║
║ -5,000 Fuel                          ║
║ -50 Crew                             ║
║                                      ║
║ You have:                            ║
║ Credits: 150,000 ✓                   ║
║ Minerals: 50,000 ✓                   ║
║ Fuel: 25,000 ✓                       ║
║ Available crew: 400 ✓                ║
║                                      ║
║ [CONFIRM]  [CANCEL]                  ║
╚══════════════════════════════════════╝
```

**Step 7:** Click [CONFIRM]

**Step 8:** Ship constructed instantly:
```
✓ Battle Cruiser constructed

Location: Docked at Alpha Prime
Status: Ready for orders
Crew: 50
Platoons aboard: 0/4
```

### Loading Platoons onto Battle Cruisers

**When:** After platoons reach 50%+ training (Turn 10+)

**Step 1:** Click planet with both platoons and Battle Cruiser

**Step 2:** In planet panel, click [PLATOONS] tab

**Step 3:** Platoon list appears:
```
╔══════════════════════════════════════╗
║ PLATOONS AT ALPHA PRIME              ║
║                                      ║
║ Platoon #1                           ║
║ - Troops: 100                        ║
║ - Equipment: Standard                ║
║ - Weapons: Assault Rifle             ║
║ - Training: 100%                     ║
║ - Strength: 195                      ║
║ - Location: On planet                ║
║   [EMBARK]  [DISBAND]                ║
║                                      ║
║ Platoon #2                           ║
║ - Troops: 100                        ║
║ - Equipment: Advanced                ║
║ - Weapons: Plasma                    ║
║ - Training: 80%                      ║
║ - Strength: 256                      ║
║ - Location: On planet                ║
║   [EMBARK]  [DISBAND]                ║
║                                      ║
║ [BACK]                               ║
╚══════════════════════════════════════╝
```

**Step 4:** Click [EMBARK] for Platoon #1

**Step 5:** Select transport:
```
╔══════════════════════════════════════╗
║ EMBARK PLATOON #1                    ║
║                                      ║
║ Select Battle Cruiser:               ║
║                                      ║
║ ● Battle Cruiser Alpha               ║
║   Platoons: 0/4 (room available)     ║
║                                      ║
║ ○ Battle Cruiser Beta                ║
║   Platoons: 3/4 (room available)     ║
║                                      ║
║ [CONFIRM]  [CANCEL]                  ║
╚══════════════════════════════════════╝
```

**Step 6:** Select Battle Cruiser Alpha, click [CONFIRM]

**Step 7:** Platoon embarked:
```
✓ Platoon #1 embarked on Battle Cruiser Alpha

Battle Cruiser Alpha status:
Platoons: 1/4
Total invasion strength: 195
```

**Step 8:** Repeat for Platoon #2

**Final status:**
```
Battle Cruiser Alpha:
- Platoon #1 (Strength 195)
- Platoon #2 (Strength 256)
Total: 451 invasion strength
Capacity: 2/4 platoons
```

### Navigating Fleets to Enemy Territory

**Step 1:** Click your planet with Battle Cruiser

**Step 2:** In planet panel, click [SPACECRAFT] tab

**Step 3:** Spacecraft list:
```
╔══════════════════════════════════════╗
║ SPACECRAFT AT ALPHA PRIME            ║
║                                      ║
║ Battle Cruiser Alpha                 ║
║ - Crew: 50                           ║
║ - Platoons: 2/4                      ║
║ - Status: Docked                     ║
║   [NAVIGATE]  [SCRAP]                ║
║                                      ║
║ [BACK]                               ║
╚══════════════════════════════════════╝
```

**Step 4:** Click [NAVIGATE]

**Step 5:** Target selection:
```
╔══════════════════════════════════════╗
║ SELECT DESTINATION                   ║
║                                      ║
║ Your location: Alpha Prime           ║
║                                      ║
║ Available destinations:              ║
║                                      ║
║ ○ Beta (Enemy) - 2 sectors away      ║
║   Travel time: 1 turn                ║
║   Intelligence: Lightly defended     ║
║                                      ║
║ ○ Gamma (Neutral) - 1 sector away    ║
║   Travel time: 1 turn                ║
║                                      ║
║ ○ Delta (Enemy HQ) - 3 sectors away  ║
║   Travel time: 2 turns               ║
║   Intelligence: Heavily fortified    ║
║                                      ║
║ [CONFIRM]  [CANCEL]                  ║
╚══════════════════════════════════════╝
```

**Step 6:** Select Beta (Enemy), click [CONFIRM]

**Step 7:** Fleet sets course:
```
✓ Battle Cruiser Alpha en route to Beta

ETA: 1 turn
Fuel consumed: 500 (deducted now)

Status: Traveling
Cannot issue new orders until arrival
```

**Step 8:** Press SPACE to end turn

**Turn 16: Fleet arrives at Beta**
```
═══════════════════════════════════════
FLEET ARRIVAL

Battle Cruiser Alpha has reached Beta

Enemy forces detected:
- 1× Battle Cruiser (Enemy)
- 1× Orbital Defense Platform

COMBAT WILL OCCUR IN COMBAT PHASE

Press SPACE to continue to Combat Phase
═══════════════════════════════════════
```

---

## ⚔️ Combat System {#combat-system}

### How Combat Actually Works

When your fleet reaches an enemy planet, two phases of combat occur:

**Phase 1:** Space Combat (fleet vs fleet)
**Phase 2:** Ground Combat (platoons vs platoons)

### Space Combat: Detailed Mechanics

**Scenario:** Your Battle Cruiser vs Enemy Planet

**YOUR FORCES:**
```
2× Battle Cruisers
- Total crew: 100
- Weapon tier: Laser (1.0×)
- No orbital defenses (attacking)

Attack Calculation:
Base Strength = Crew × Weapon Multiplier
100 × 1.0 = 100
```

**ENEMY FORCES:**
```
1× Battle Cruiser
1× Orbital Defense Platform
- Total crew: 50
- Weapon tier: Laser (1.0×)
- Defense bonus: +20% (1 platform)

Defense Calculation:
Base Strength = Crew × Weapon Multiplier × Defense Bonus
50 × 1.0 × 1.2 = 60
```

**COMBAT RESOLUTION:**
```
Attack: 100
Defense: 60

100 > 60 → ATTACKER WINS

Damage Calculation:
Strength Ratio = 100 / 60 = 1.67

Winner Losses:
Base Loss = 10% at 1.0 ratio
Reduced by dominance: 10% × (1.0/1.67) = 6%
Your losses: 6 crew (100 × 0.06)

Loser Losses:
Base Loss = 50% at 1.0 ratio
Increased by defeat: 50% × 1.67 = 83.5%
Enemy losses: 42 crew (50 × 0.835)
Enemy Battle Cruiser DESTROYED
```

**RESULT:**
```
✓ SPACE BATTLE WON

Your Forces Remaining:
- 2× Battle Cruisers (94 crew total)
- 1× Battle Cruiser undamaged
- 1× Battle Cruiser at 94% crew

Enemy Forces Remaining:
- 1× Orbital Defense Platform (damaged)
- All Battle Cruisers destroyed

ORBITAL CONTROL SECURED
Ground invasion may proceed
```

### Ground Combat: Detailed Mechanics

**Now your platoons disembark to capture the planet.**

**YOUR INVASION FORCE:**
```
Platoon #1:
- 100 troops
- Equipment: Standard (1.5×)
- Weapons: Assault Rifle (1.3×)
- Training: 100% (1.0×)

Strength = 100 × 1.5 × 1.3 × 1.0 = 195

Platoon #2:
- 100 troops
- Equipment: Advanced (2.0×)
- Weapons: Plasma (1.6×)
- Training: 80% (0.8×)

Strength = 100 × 2.0 × 1.6 × 0.8 = 256

TOTAL INVASION STRENGTH: 451
```

**ENEMY DEFENDERS:**
```
Platoon #1:
- 60 troops
- Equipment: Basic (1.0×)
- Weapons: Rifle (1.0×)
- Training: 100% (1.0×)

Strength = 60 × 1.0 × 1.0 × 1.0 = 60

Platoon #2:
- 50 troops
- Equipment: Basic (1.0×)
- Weapons: Rifle (1.0×)
- Training: 100% (1.0×)

Strength = 50 × 1.0 × 1.0 × 1.0 = 50

TOTAL DEFENSE STRENGTH: 110
```

**COMBAT RESOLUTION:**
```
Attack: 451
Defense: 110

451 > 110 → ATTACKER WINS

Strength Ratio = 451 / 110 = 4.1

Winner Losses:
Base Loss = 10%
Reduced by dominance: 10% × (1.0/4.1) = 2.4%
Your losses: 11 troops (451 × 0.024 = 10.8)

Loser Losses:
Base Loss = 50%
Increased by defeat: 50% × 4.1 = 205% (capped at 100%)
Enemy losses: 110 troops (ALL defenders eliminated)
```

**BATTLE REPORT:**
```
╔══════════════════════════════════════════════╗
║          PLANET BETA CAPTURED!               ║
╠══════════════════════════════════════════════╣
║                                              ║
║ Your Forces:                                 ║
║ Before: 200 troops (451 strength)           ║
║ After:  189 troops (427 strength)           ║
║ Losses: 11 troops (5.5%)                    ║
║                                              ║
║ Enemy Forces:                                ║
║ Before: 110 troops                           ║
║ After:  0 troops (ANNIHILATED)              ║
║                                              ║
║ Resources Captured:                          ║
║ - Credits: +8,500 (50% of stored)            ║
║ - Minerals: +3,200 (50% of stored)           ║
║ - Fuel: +2,100 (50% of stored)               ║
║ - Food: +1,800 (50% of stored)               ║
║                                              ║
║ Planet Beta Ownership: NOW YOURS             ║
║                                              ║
║ Buildings on Planet:                         ║
║ - 1× Mining Station (now producing for you) ║
║ - 1× Docking Bay (now yours)                ║
║                                              ║
║ [CONTINUE]                                   ║
╚══════════════════════════════════════════════╝
```

### What Happens After Victory

**Immediate Effects:**
1. Planet changes color from Red to Blue
2. All buildings transfer to your ownership
3. You gain 50% of stored resources
4. Your fleet remains in orbit
5. Your platoons garrison the planet

**Next Turn:**
- Planet produces resources for YOU
- Enemy must recapture it to get it back
- You can build additional defenses
- Population begins growing under your rule

---

## 🏆 Victory Conditions {#victory-conditions}

### How to Win

**Standard Victory: Conquest**
- Capture ALL enemy planets
- Enemy controls 0 planets
- Victory screen appears

**Example:**
```
Turn 25:

You control:
- Alpha Prime (homeworld)
- Beta (captured turn 16)
- Gamma (colonized turn 20)
- Delta (captured turn 25)

Enemy controls:
- (none - their last planet just fell)

═══════════════════════════════════════
        ✓ VICTORY ACHIEVED!
═══════════════════════════════════════

You have conquered the galaxy!

Final Statistics:
- Turns taken: 25
- Planets controlled: 4
- Total military strength: 1,250
- Economy value: 500,000 credits

Rating: ★★★★☆ (4/5 stars)

[RETURN TO MENU]  [PLAY AGAIN]
═══════════════════════════════════════
```

### How to Lose

**Defeat Conditions:**

**1. Total Conquest**
- Enemy captures ALL your planets
- You control 0 planets
- Defeat screen appears

**2. Annihilation**
- All your spacecraft destroyed
- No means to defend or attack
- Unable to rebuild (no resources)

**Example Defeat:**
```
Turn 18:

Enemy has captured Alpha Prime
(Your last remaining planet)

═══════════════════════════════════════
           DEFEAT
═══════════════════════════════════════

Your empire has fallen.

The enemy controls the galaxy.

Cause of defeat:
- Lost all planets to enemy conquest
- Unable to mount effective defense

Try again? Analyze what went wrong:
- Did you build defenses?
- Did you expand fast enough?
- Did you balance economy and military?

[RETURN TO MENU]  [RETRY]
═══════════════════════════════════════
```

---

## 📊 Quick Reference Tables

### Resource Production Summary

| Building | Produces | Best Planet Type | Notes |
|----------|----------|------------------|-------|
| Mining Station | 50 Min, 30 Fuel/turn | Volcanic (5× Min, 3× Fuel) | Essential early game |
| Horticultural Station | 100 Food/turn | Tropical (2× Food) | Prevents starvation |
| Solar Satellite | 80 Energy/turn | Desert (2× Energy) | Deploy in space |
| Tax Collection | Credits | Metropolis (2× Credits) | Based on population |

### Building Construction Times

| Building | Cost | Build Time | Crew |
|----------|------|------------|------|
| Docking Bay | 5k Cr, 1k Min, 500 F | 2 turns | 0 |
| Mining Station | 8k Cr, 2k Min, 1k F | 3 turns | 15 |
| Horticultural Station | 6k Cr, 1.5k Min, 800 F | 2 turns | 10 |
| Orbital Defense | 12k Cr, 3k Min, 2k F | 3 turns | 20 |

### Spacecraft Comparison

| Type | Cost | Crew | Speed | Capacity | Purpose |
|------|------|------|-------|----------|---------|
| Battle Cruiser | 50k Cr, 10k Min, 5k F | 50 | 50/turn | 4 platoons | Combat & invasion |
| Cargo Cruiser | 30k Cr, 5k Min, 3k F | 30 | 30/turn | 1000 each resource | Transport |
| Solar Satellite | 15k Cr, 3k Min, 1k F | 5 | 0 (stationary) | N/A | Energy production |
| Atmosphere Processor | 10k Cr, 5k Min, 2k F | 20 | 30/turn | N/A | Colonization |

### Military Equipment Costs

| Equipment + Weapon | Total Cost | Combat Multiplier |
|-------------------|------------|-------------------|
| Civilian + Pistol | 25k Cr | 0.4× |
| Basic + Rifle | 45k Cr | 1.0× |
| Standard + Assault Rifle | 73k Cr | 1.95× |
| Advanced + Plasma | 110k Cr | 3.2× |
| Elite + Plasma | 139k Cr | 4.0× |

### Planet Type Bonuses

| Type | Min | Fuel | Food | Energy | Credits |
|------|-----|------|------|--------|---------|
| Volcanic | 5× | 3× | 0.5× | 1× | 1× |
| Desert | 1× | 1× | 0.25× | 2× | 1× |
| Tropical | 1× | 1× | 2× | 0.75× | 1× |
| Metropolis | 1× | 1× | 1× | 1× | 2× |

---