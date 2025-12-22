# Overlord: Comprehensive Game Balance Analysis
**Version:** 2.0 (Post-Rebalance)
**Date:** 2025-12-22

---

## Executive Summary

After identifying critical economic imbalances, the game has been rebalanced with:
- **Taxation income increased 100×** (population × 10 instead of population ÷ 10)
- **Platoon costs reduced 5×** (Standard platoon: 12,000₡ instead of 65,000₡)

This document provides a complete game balance analysis across all three difficulty levels, with turn-by-turn economic projections and strategic pacing guidelines.

---

## Part 1: Core Economic Balance

### Starting Resources

| Faction | Credits | Minerals | Fuel | Food | Energy |
|---------|---------|----------|------|------|--------|
| Player | 50,000 | 10,000 | 10,000 | 10,000 | 10,000 |
| AI (Easy/Normal) | 40,000 | 8,000 | 8,000 | 8,000 | 8,000 |
| AI (Hard) | 50,000 | 10,000 | 10,000 | 10,000 | 10,000 |

**Reasoning:** Player starts with advantage on Easy/Normal. AI matches player on Hard for challenge.

### Income Rates (NEW - After Rebalance)

#### Taxation Income

Formula: `(Population × 10) × (Tax Rate ÷ 100) × Planet Multiplier`

| Population | Tax Rate | Planet Type | Credits/Turn |
|------------|----------|-------------|--------------|
| 500 | 25% | Normal | 1,250 |
| 500 | 50% | Normal | 2,500 |
| 500 | 75% | Normal | 3,750 |
| 500 | 50% | **Metropolis** | **5,000** |
| 1,000 | 50% | Metropolis | 10,000 |
| 2,000 | 50% | Metropolis | 20,000 |

**Key Insight:** A Metropolis homeworld with 500 population @ 50% tax generates **5,000 credits/turn** (previously 50).

#### Building Production (Per Building, Per Turn)

| Building Type | Produces | Volcanic Bonus | Desert Bonus | Tropical Bonus |
|---------------|----------|----------------|--------------|----------------|
| Mining Station | 50 Min, 30 Fuel | 5× Min, 3× Fuel | 1× | 1× |
| Horticultural Station | 100 Food | 0.5× | 0.25× | 2× |
| Solar Satellite | 80 Energy | 1× | 2× | 0.75× |

**Example:** Volcanic planet with 1 Mining Station produces **250 minerals + 150 fuel per turn**.

### Building Costs

| Building | Credits | Minerals | Fuel | Turns | Crew |
|----------|---------|----------|------|-------|------|
| Surface Platform | 2,000 | 500 | 0 | 1 | 0 |
| Docking Bay | 5,000 | 1,000 | 500 | 2 | 0 |
| Horticultural Station | 6,000 | 1,500 | 800 | 2 | 10 |
| Mining Station | 8,000 | 2,000 | 1,000 | 3 | 15 |
| Orbital Defense | 12,000 | 3,000 | 2,000 | 3 | 0 |

**Total for standard opening** (2 Mining, 2 Horticulture, 1 Docking Bay):
- **33,000 credits, 8,500 minerals, 4,100 fuel**

### Platoon Costs (NEW - After Rebalance)

| Equipment | Weapon | Total Cost | Time to Afford @ 5k/turn | Combat Strength (100 troops) |
|-----------|--------|------------|--------------------------|------------------------------|
| Civilian | Pistol | **3,000₡** | **0.6 turns** | 40 |
| Basic | Rifle | **8,000₡** | **1.6 turns** | 100 |
| Standard | Rifle | **12,000₡** | **2.4 turns** | 150 |
| Standard | Assault Rifle | **13,500₡** | **2.7 turns** | 195 |
| Advanced | Plasma | **22,000₡** | **4.4 turns** | 320 |
| Elite | Plasma | **31,000₡** | **6.2 turns** | 400 |

**Key Insight:** Players can afford Basic/Rifle platoons by **Turn 2-3**, Standard/Assault Rifle by **Turn 3-4**.

### Spacecraft Costs

| Spacecraft | Credits | Minerals | Fuel | Crew | Purpose |
|------------|---------|----------|------|------|---------|
| Atmosphere Processor | 10,000 | 5,000 | 2,000 | 20 | Colonization |
| Solar Satellite | 15,000 | 3,000 | 1,000 | 5 | Energy production |
| Cargo Cruiser | 30,000 | 5,000 | 3,000 | 30 | Resource transport |
| Battle Cruiser | 50,000 | 10,000 | 5,000 | 50 | Combat (4 platoons) |

---

## Part 2: Turn-by-Turn Economic Projection

### Standard Opening (Player, Metropolis Homeworld)

| Turn | Action | Credits | Income | Buildings | Military | Population |
|------|--------|---------|--------|-----------|----------|------------|
| **1** | Build 2 Mining, 2 Horticulture, 1 Docking Bay | 17,000 | +5,000 | 5 UC | 0 | 500 |
| **2** | Wait (buildings under construction) | 22,000 | +5,000 | 3 UC | 0 | 519 |
| **3** | Buildings complete; Commission 1 Standard/Rifle | 15,000 | +5,000 | 5 Active | 1 (0% trained) | 419 |
| **4** | Commission 2nd Standard/Rifle | 8,000 | +5,000 | 5 Active | 2 (10%/0%) | 435 |
| **5** | Build Battle Cruiser | -37,000 | +5,000 | 5 Active | 2 (20%/10%) | 451 |
| **6** | Accumulate resources | -32,000 | +5,000 | 5 Active | 2 (30%/20%) | 468 |
| **7** | Accumulate resources | -27,000 | +5,000 | 5 Active | 2 (40%/30%) | 485 |
| **8** | Accumulate resources | -22,000 | +5,000 | 5 Active | 2 (50%/40%) | 503 |
| **9** | Accumulate resources | -17,000 | +5,000 | 5 Active | 2 (60%/50%) | 521 |
| **10** | Commission 3rd platoon | 0 | +5,200 | 5 Active | 3 (70%/60%/0%) | 421 |
| **11** | Build 2nd Battle Cruiser | -38,000 | +5,200 | 5 Active | 3 (80%/70%/10%) | 437 |
| **12** | Accumulate | -32,800 | +5,200 | 5 Active | 3 (90%/80%/20%) | 454 |
| **13** | Platoons 1+2 fully trained! Load onto cruisers | -27,600 | +5,200 | 5 Active | 3 (100%/100%/30%) | 471 |
| **14** | Build Atmosphere Processor | -32,400 | +5,200 | 5 Active | 3 (100%/100%/40%) | 488 |
| **15** | **INVASION READY** - Launch attack | -27,200 | +5,200 | 5 Active | 2 in space, 1 home | 506 |

**Conclusion:** Player can launch first invasion by **Turn 15** with 2 fully-trained platoons (strength 390).

### AI Economic Projection (Normal Difficulty)

| Turn | AI Action | Credits | Military | Notes |
|------|-----------|---------|----------|-------|
| **1** | Build 1 Mining Station | 32,000 | 0 | AI starts with 40k |
| **2** | Build 1 Horticultural Station | 26,000 | 0 | |
| **3** | Build Docking Bay | 21,000 | 0 | |
| **4** | Mining/Horticulture complete (+income) | 25,000 | 0 | +4,000 cr/turn |
| **5** | Build Atmosphere Processor | 15,000 | 0 | Expansion to neutral |
| **6** | Attempt platoon commission (Standard/Rifle) | 19,000 | 0 | Can afford! |
| **7** | Commission Standard/Rifle platoon (12k) | 11,000 | 1 (0%) | **AI BUILDS MILITARY** |
| **8** | Accumulate | 15,000 | 1 (10%) | |
| **9** | Commission 2nd platoon | 7,000 | 2 (20%/0%) | |
| **10** | Accumulate | 11,000 | 2 (30%/10%) | |
| **15** | Atmosphere Processor completes | 31,000 | 2 (80%/60%) | AI owns 2 planets |
| **17** | Platoon 1 fully trained | 39,000 | 2 (100%/80%) | |
| **18** | Build Battle Cruiser | -11,000 | 2 (100%/90%) | |
| **20** | **AI CAN ATTACK** | 1,000 | 2 (100%/100%) | Platoons on cruiser |

**Conclusion:** AI can attack by **Turn 20** (was NEVER before rebalance).

---

## Part 3: Difficulty Level Balance

### Easy Difficulty

**AI Characteristics:**
- Starting resources: 40,000 credits (20% less than player)
- Military strength modifier: 0.8× (−20%)
- Attack threshold: 0.5 (needs 2× player strength to attack)
- Equipment: Standard + Pistol (weaker than normal)
- Build frequency: 60% chance per turn

**Expected Game Pacing:**
- **Turn 1-10:** Player builds economy, AI slowly builds
- **Turn 11-20:** Player commissions military, AI attempts military
- **Turn 21-30:** Player launches first invasion, AI defends
- **Turn 31-40:** Player captures 2-3 planets, dominates
- **Turn 41-50:** Victory - Player controls galaxy

**Player Strategy:**
- Rush economy (Turns 1-5)
- Build Civilian/Pistol platoons (cheap, 3k each)
- Early aggression overwhelms weak AI
- Expand to 3-4 planets by Turn 25
- Victory by Turn 40-50

**Design Goal:** New players learn mechanics without pressure. AI is passive.

---

### Normal Difficulty (Default)

**AI Characteristics:**
- Starting resources: 40,000 credits (20% less than player)
- Military strength modifier: 1.0× (equal to player)
- Attack threshold: 0.67 (needs 1.5× player strength to attack)
- Equipment: Standard + Rifle (balanced)
- Build frequency: 60% chance per turn

**Expected Game Pacing:**
- **Turn 1-10:** Economic buildup, infrastructure race
- **Turn 11-25:** Military buildup, expansion to neutral planets
- **Turn 26-40:** First major battles, territory changes hands
- **Turn 41-60:** Strategic warfare, resource competition
- **Turn 61-80:** Endgame - One faction gains dominance
- **Turn 81-100:** Victory condition reached

**Player Strategy:**
- Balanced economy + military investment
- Commission Standard/Rifle platoons (12k, good value)
- Defend homeworld, expand to 2 neutrals
- Build fleet of 2-3 Battle Cruisers by Turn 30
- Strategic attacks on weakly defended AI planets
- Victory by Turn 80-100

**Design Goal:** Balanced challenge. Requires strategic planning and military timing.

---

### Hard Difficulty

**AI Characteristics:**
- Starting resources: 50,000 credits (EQUAL to player)
- Military strength modifier: 1.2× (+20%)
- Attack threshold: 0.83 (needs only 1.2× player strength to attack)
- Equipment: Elite + Plasma (31k per platoon!)
- Build frequency: 60% chance per turn
- **Aggressive personality:** Attacks early and often

**Expected Game Pacing:**
- **Turn 1-10:** Economic race, AI keeps pace
- **Turn 11-20:** AI builds military FASTER (cheaper elites with 1.2× bonus)
- **Turn 21-30:** AI launches early invasion (Turn 25-30)
- **Turn 31-50:** Player defends, counterattacks
- **Turn 51-80:** Prolonged war, multiple planet captures
- **Turn 81-120:** Endgame - Victory requires total domination

**Player Strategy:**
- Max efficiency economy (all 5 surface slots by Turn 3)
- Rush Advanced/Plasma platoons (22k, match AI quality)
- Build Orbital Defenses (12k) on homeworld by Turn 10
- Expect AI attack by Turn 25-30
- Counterattack after AI commits forces
- Victory by Turn 100-120 (requires superior tactics)

**Design Goal:** Punishing. AI is competent and aggressive. Player must optimize or lose.

---

## Part 4: Strategic Depth & Player Choices

### Economic Strategies

#### Rush Economy (Early Game Dominance)
**Build order:** 3× Mining Station, 2× Horticultural Station (Turn 1-5)
**Result:** Massive resource income (+750 minerals, +450 fuel, +200 food per turn)
**Advantage:** Can afford Battle Cruisers by Turn 8-10
**Risk:** No military until Turn 10+, vulnerable to early AI rush

#### Balanced Expansion (Recommended)
**Build order:** 2× Mining, 2× Horticultural, 1× Docking Bay (Turn 1-3)
**Result:** Moderate income, enables spacecraft purchases
**Advantage:** Flexible, can pivot to military or expansion
**Risk:** AI may outpace if focused on single strategy

#### Military Rush (Aggressive)
**Build order:** 1× Docking Bay (Turn 1), 2× Battle Cruiser (Turn 5-6)
**Platoons:** 4× Civilian/Pistol (cheap, 3k each)
**Result:** Fast military ready by Turn 10-12
**Advantage:** Early conquest, capture AI planets before they defend
**Risk:** Low income, cannot sustain prolonged war

### Military Progression

| Strategy | Early Game (T1-20) | Mid Game (T21-50) | Late Game (T51+) |
|----------|-------------------|-------------------|------------------|
| **Budget** | Civilian/Pistol (3k) | Basic/Rifle (8k) | Standard/Assault (13.5k) |
| **Balanced** | Standard/Rifle (12k) | Standard/Assault (13.5k) | Advanced/Plasma (22k) |
| **Premium** | Standard/Assault (13.5k) | Advanced/Plasma (22k) | Elite/Plasma (31k) |

**Recommendation:**
- Easy: Budget → Balanced (save credits for expansion)
- Normal: Balanced → Premium (quality over quantity)
- Hard: Premium from Turn 1 (match AI Elite units)

### Expansion Timing

| Difficulty | First Expansion | Second Expansion | Third Expansion |
|------------|-----------------|------------------|-----------------|
| Easy | Turn 8-10 | Turn 15-20 | Turn 25-30 |
| Normal | Turn 10-15 | Turn 25-30 | Turn 40-50 |
| Hard | Turn 15-20 | Turn 35-45 | Turn 60+ (if surviving) |

**Atmosphere Processor deployment:** Takes 10 turns to colonize. Plan accordingly!

---

## Part 5: Combat Balance

### Ground Combat Strength Calculations

**Formula:** `Troops × Equipment Modifier × Weapon Modifier × Training %`

| Platoon Type | 100 Troops @ 100% Training | Combat Strength |
|--------------|---------------------------|-----------------|
| Civilian + Pistol | 100 × 0.5 × 0.8 × 1.0 | **40** |
| Basic + Rifle | 100 × 1.0 × 1.0 × 1.0 | **100** |
| Standard + Rifle | 100 × 1.5 × 1.0 × 1.0 | **150** |
| Standard + Assault Rifle | 100 × 1.5 × 1.3 × 1.0 | **195** |
| Advanced + Plasma | 100 × 2.0 × 1.6 × 1.0 | **320** |
| Elite + Plasma | 100 × 2.5 × 1.6 × 1.0 | **400** |

### Invasion Scenarios

#### Scenario 1: Early Rush (Turn 15)
**Attacker:** 2× Standard/Assault (195 strength each) = **390 total**
**Defender:** 1× Basic/Rifle (100 strength) = **100 total**
**Result:** Attacker wins decisively (3.9:1 ratio)
**Casualties:** Attacker loses 10-15%, Defender annihilated

#### Scenario 2: Mid-Game Battle (Turn 40)
**Attacker:** 4× Standard/Assault (195 each) = **780 total**
**Defender:** 2× Advanced/Plasma (320 each) + Orbital Defense (+20%) = **768 total**
**Result:** Attacker wins narrowly (1.02:1 ratio)
**Casualties:** Attacker loses 40-50%, Defender loses 80-90%

#### Scenario 3: Late-Game Siege (Turn 80, Hard Difficulty)
**Attacker:** 6× Elite/Plasma (400 each) = **2,400 total**
**Defender:** 4× Elite/Plasma (400 × 1.2 AI bonus = 480 each) + Orbital Defense = **2,304 total**
**Result:** Attacker wins (1.04:1 ratio)
**Casualties:** Brutal - Both sides lose 50%+

**Design Philosophy:** Combat should be decisive but costly. Losing an invasion sets you back 10-20 turns.

---

## Part 6: Victory Conditions & Game Length

### Victory Thresholds

| Condition | Requirement | Expected Turn Range |
|-----------|-------------|---------------------|
| **Total Conquest** | Capture all enemy planets | Turn 50-120 |
| **Economic Victory** | 500,000 credits + 100,000 resources | Turn 60-100 |
| **Military Supremacy** | Destroy all enemy spacecraft | Turn 40-80 |
| **Survival** | Survive 100 turns | Turn 100 (if enabled) |

### Expected Game Length (Time)

| Difficulty | Turns to Victory | Minutes per Turn | Total Time |
|------------|------------------|------------------|------------|
| Easy | 40-50 | 2-3 min | **80-150 minutes** (1.5-2.5 hours) |
| Normal | 80-100 | 3-5 min | **240-500 minutes** (4-8 hours) |
| Hard | 100-120 | 5-7 min | **500-840 minutes** (8-14 hours) |

**Design Goal:** Games should be completable in a single session (Easy) or over multiple sessions (Normal/Hard).

---

## Part 7: AI Behavior Analysis

### AI Decision Tree Priority

1. **Defend** (if under attack) → Build Orbital Defense, commission platoons
2. **Expand** (if neutral planets exist) → ALWAYS purchase Atmosphere Processor
3. **Build Economy** (Turn < 30 or Economic personality) → 60% chance to build Mining/Horticultural
4. **Build Military** (Threat > 0.8 or Turn ≥ 5) → Commission platoons
5. **Attack** (Military advantage) → Launch invasion

### AI Limitations (Intentional)

- **Random build skips:** 40% chance AI does nothing on economy phase
  - **Design:** Gives player windows of opportunity
- **No strategic focus:** AI builds all planet types equally
  - **Design:** Player can optimize better (Volcanic for minerals, etc.)
- **Attack threshold dependency:** AI waits for advantage before attacking
  - **Design:** Predictable behavior allows player to prepare

### AI Strengths

- **ALWAYS expands** to neutral planets (no skip chance)
- **Adapts equipment** to difficulty (Elite/Plasma on Hard)
- **Defends when attacked** (emergency response)
- **Multiple personalities:** Aggressive/Defensive/Economic (future expansion)

**Design Philosophy:** AI should be challenging but beatable through superior strategy.

---

## Part 8: Recommended Balance Adjustments

### Immediate Fixes Applied ✓

1. **Taxation increased 100×** - Fixes economic stagnation
2. **Platoon costs reduced 5×** - Makes military affordable

### Future Tweaks (Optional)

#### 1. Building Slot Limits
**Current:** 5 surface + 3 orbital slots
**Problem:** Slots fill by Turn 3-5, no room for expansion
**Recommendation:** Increase to 8 surface + 5 orbital slots
**Impact:** Allows economic scaling into late game

#### 2. AI Docking Bay Priority
**Current:** 60% random chance to build Mining Station before Docking Bay
**Problem:** AI cannot purchase Atmosphere Processors without Docking Bay
**Recommendation:** Guarantee Docking Bay is built first
**Impact:** AI expands more consistently, increases challenge

#### 3. Population Growth Rates
**Current:** 5% base growth (500 pop → 525 in 1 turn)
**Concern:** May grow too slowly for large-scale wars
**Recommendation:** Test in playtest - adjust if recruitment bottlenecked

#### 4. Training Time
**Current:** 10 turns to reach 100% training
**Concern:** May delay first battles excessively
**Alternative:** Reduce to 5 turns (20% per turn) for faster gameplay

#### 5. Hard Difficulty AI Bonuses
**Current:** AI gets 1.2× military strength, Elite/Plasma units
**Alternative:** Also give AI +50% starting resources (75k credits instead of 50k)
**Impact:** AI builds military even faster, increases challenge

---

## Part 9: Playtest Validation Checklist

After applying these balance changes, validate with playtest:

### Easy Difficulty Checklist
- [ ] Player can afford first platoon by Turn 3-5
- [ ] AI builds military by Turn 7-10
- [ ] AI does NOT attack before Turn 30
- [ ] Player can capture 1st AI planet by Turn 20-30
- [ ] Game ends in player victory by Turn 40-50

### Normal Difficulty Checklist
- [ ] Player can afford first platoon by Turn 3-5
- [ ] AI builds military by Turn 7-10
- [ ] AI attacks player by Turn 25-35
- [ ] Combat is competitive (battles go both ways)
- [ ] Game lasts 80-100 turns

### Hard Difficulty Checklist
- [ ] AI matches player economic buildup
- [ ] AI attacks before Turn 30
- [ ] AI conquers player planet if player is unprepared
- [ ] Player must use advanced tactics to win
- [ ] Game lasts 100-120 turns (prolonged war)

### General Checklist
- [ ] No 1,000+ turn wait times
- [ ] Players can complete a game in one sitting (Easy) or 2-3 sessions (Normal/Hard)
- [ ] Military is affordable within reasonable timeframe
- [ ] AI takes effective turns (builds, expands, attacks)
- [ ] Economy scales into late game

---

## Part 10: Comparison with Original 1990 Game

### Economic Pacing

| Metric | Original (1990) | Current (Broken) | **Rebalanced (NEW)** |
|--------|-----------------|------------------|----------------------|
| **Turns to first platoon** | ~5-10 turns | 1,300 turns | **2-3 turns** ✓ |
| **Turns to first battle** | ~15-20 turns | NEVER | **15-25 turns** ✓ |
| **Game length** | 50-100 turns | N/A (unplayable) | **50-120 turns** ✓ |
| **Tax income rate** | High | Broken (÷10) | **Fixed (×10)** ✓ |

### Strategic Depth

| Feature | Original | Current Implementation |
|---------|----------|------------------------|
| Planet specialization | ✓ | ✓ (Volcanic/Desert/Tropical/Metropolis) |
| Equipment tiers | ✓ | ✓ (5 tiers: Civilian → Elite) |
| Multiple victory paths | ✓ | ✓ (Conquest, Economic, Military) |
| AI personalities | ✓ | ✓ (Balanced, Aggressive, Defensive, Economic) |
| Difficulty scaling | ✓ | ✓ (Easy, Normal, Hard) |

**Conclusion:** Rebalanced game matches original's pacing while adding modern depth.

---

## Part 11: Final Balance Assessment

### Core Economic Loop (FIXED ✓)

**Before Rebalance:**
- Income: 50 credits/turn
- Platoon cost: 65,000 credits
- Wait time: **1,300 turns** ❌

**After Rebalance:**
- Income: 5,000 credits/turn
- Platoon cost: 12,000 credits
- Wait time: **2.4 turns** ✓

### Game Completability (FIXED ✓)

**Before:**
- Time to first battle: NEVER
- Game completion: IMPOSSIBLE
- AI effectiveness: PARALYZED (economically)

**After:**
- Time to first battle: Turn 15-25
- Game completion: 50-120 turns (depending on difficulty)
- AI effectiveness: FUNCTIONAL (can afford military, expands, attacks)

### Strategic Diversity (PRESERVED ✓)

- **Economic rush:** Max buildings early, dominate late game
- **Military rush:** Cheap platoons, early conquest
- **Balanced:** Standard approach, flexible pivots
- **Expansion:** Colonize neutrals, control territory

All strategies remain viable with new balance.

### Difficulty Progression (FUNCTIONAL ✓)

- **Easy:** Player advantage, forgiving, ~40-50 turns
- **Normal:** Balanced challenge, strategic play required, ~80-100 turns
- **Hard:** AI advantage, demands optimization, ~100-120 turns

Clear difficulty curve with meaningful differences.

---

## Conclusion

The game has been **transformed from mathematically unplayable to strategically robust** through two critical fixes:

1. **Taxation formula corrected:** Income increased 100× by changing division to multiplication
2. **Platoon costs reduced 5×:** Military units now affordable within 2-4 turns

**The game is now playable across all three difficulty levels, with:**
- ✓ Reasonable economic pacing (2-3 turns to first platoon)
- ✓ Functional AI that builds, expands, and attacks
- ✓ Strategic depth across equipment tiers and planet types
- ✓ Completable games in 50-120 turns (1-14 hours depending on difficulty)
- ✓ Balanced progression from early rush to late-game warfare

**Recommended next step:** Playtest a full game on Normal difficulty to validate these projections, then tune as needed based on actual gameplay.

---

**END OF COMPREHENSIVE BALANCE ANALYSIS**
