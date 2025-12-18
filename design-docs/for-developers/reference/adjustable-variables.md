# Chapter 8: Adjustable Variables Reference

This chapter documents all tunable gameplay parameters in Overlord. Each variable includes its location in the source code, default value, impact analysis, and recommended adjustment ranges for different play experiences. Understanding these parameters is essential for balance testing and scenario design.

## Table of Contents

1. [Economy Variables](#1-economy-variables)
2. [Combat Variables](#2-combat-variables)
3. [Military Unit Variables](#3-military-unit-variables)
4. [Spacecraft Variables](#4-spacecraft-variables)
5. [Building Variables](#5-building-variables)
6. [AI Behavior Variables](#6-ai-behavior-variables)
7. [Entity Limits](#7-entity-limits)
8. [Recommended Configurations](#8-recommended-configurations)

---

## 1. Economy Variables

The economy system determines resource generation rates, morale effects, and crew allocation. These variables directly impact the game's pacing and strategic depth.

### 1.1 Resource Production Rates

**Location:** `src/core/IncomeSystem.ts` (lines 43-46)

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `BaseFoodProduction` | 100 | number | Food generated per Horticultural Station per turn |
| `BaseMineralProduction` | 50 | number | Minerals generated per Mining Station per turn |
| `BaseFuelProduction` | 30 | number | Fuel generated per Mining Station per turn |
| `BaseEnergyProduction` | 80 | number | Energy generated per Solar Satellite per turn |

**Impact Analysis:**

Food production at 100/turn means a single Horticultural Station can sustain approximately 1,000 population indefinitely, assuming no combat losses or expansion. Reducing this value to 75 or below creates food scarcity that forces players to prioritize agricultural infrastructure early in the game.

Mineral production determines how quickly players can expand their military and infrastructure. At 50/turn, constructing a Battle Cruiser (10,000 minerals) requires approximately 200 turns of single-station production. Increasing mineral rates to 75-100 accelerates the mid-game military buildup phase.

Fuel production is intentionally the lowest rate because fuel represents a strategic constraint on fleet mobility. At 30/turn, players must carefully plan expedition routes and cannot sustain continuous fleet operations without multiple Mining Stations.

Energy production from Solar Satellites (80/turn) is designed to be economically attractive but requires the upfront investment of a spacecraft rather than a ground-based structure.

**Recommended Ranges:**

| Play Style | Food | Minerals | Fuel | Energy |
|------------|------|----------|------|--------|
| Tutorial/Easy | 150 | 75 | 45 | 100 |
| Normal | 100 | 50 | 30 | 80 |
| Hard/Scarcity | 75 | 40 | 20 | 60 |

### 1.2 Crew Requirements

**Location:** `src/core/IncomeSystem.ts` (lines 48-51)

| Variable | Default | Description |
|----------|---------|-------------|
| `HorticulturalCrewRequired` | 10 | Population required to operate one Horticultural Station |
| `MiningCrewRequired` | 15 | Population required to operate one Mining Station |
| `SolarSatelliteCrewRequired` | 5 | Population required to operate one Solar Satellite |

**Impact Analysis:**

Crew requirements create a population management meta-game. With 10 crew per Horticultural Station, a starting population of 1,000 can staff up to 100 agricultural facilities if no other buildings or military units are present. In practice, players must balance population allocation between:

- Production buildings (food, minerals, fuel)
- Spacecraft crews (50 for Battle Cruisers, 30 for Cargo Cruisers)
- Military platoons (1-200 troops drafted from population)

Increasing crew requirements (e.g., 20 per Mining Station) creates population bottlenecks that slow expansion and force difficult choices between economic and military development.

The crew allocation priority system (Food → Minerals/Fuel → Energy) means players never need to worry about manual crew assignment, but they should understand that building too many structures on an underpopulated planet will result in inactive facilities.

**Recommended Ranges:**

| Complexity | Horticultural | Mining | Solar Satellite |
|------------|---------------|--------|-----------------|
| Simplified | 5 | 10 | 3 |
| Normal | 10 | 15 | 5 |
| Complex | 15 | 25 | 10 |

### 1.3 Morale System

**Location:** `src/core/IncomeSystem.ts` (line 40)

| Variable | Default | Description |
|----------|---------|-------------|
| `MoralePenaltyThreshold` | 50 | Morale percentage below which income penalties apply |

**Impact Analysis:**

The morale penalty threshold of 50% creates a cliff effect: planets with morale above 50% produce at full capacity, while planets below 50% suffer linear income reduction. At 25% morale, a planet produces only 25% of its normal output.

This threshold determines how punishing planetary unrest becomes. Setting the threshold higher (e.g., 70%) makes morale management a constant concern, as even minor dips trigger penalties. Setting it lower (e.g., 30%) makes morale a crisis-only concern that players can largely ignore during normal play.

**Morale Penalty Formula:**
```
If morale < MoralePenaltyThreshold:
  Income = BaseIncome × (morale / 100)
```

Events that affect morale:
- Invasion capture: -30% morale (instant)
- Bombardment: -20% morale (per turn under bombardment)
- Low food supply: Gradual morale decay

**Recommended Ranges:**

| Difficulty | Threshold | Effect |
|------------|-----------|--------|
| Forgiving | 30% | Morale rarely impacts production |
| Normal | 50% | Balanced morale management |
| Punishing | 70% | Constant morale pressure |

---

## 2. Combat Variables

Combat variables determine casualty rates, aggression effects, and battle resolution mechanics.

### 2.1 Casualty Rates

**Location:** `src/core/CombatSystem.ts` (lines 217-228)

| Variable | Default | Description |
|----------|---------|-------------|
| Base Casualty Rate | 20% | Baseline troop losses per combat round |
| Winner Casualty Range | 10-30% | Casualty percentage for victorious force |
| Loser Casualty Range | 50-90% | Casualty percentage for defeated force |

**Impact Analysis:**

The 20% base casualty rate means combat is relatively costly for both sides. Even a decisive victory typically costs the winner 10-30% of engaged forces, making pyrrhic victories a real concern.

For the defeated side, losses of 50-90% represent near-total destruction of the force. This encourages players to avoid unfavorable engagements rather than fighting losing battles for attrition purposes.

**Casualty Calculation Formula:**
```typescript
baseCasualtyRate = 0.2;  // 20%
strengthRatio = enemyStrength / ownStrength;
aggressionMod = 1.0 + ((aggressionPercent - 50) / 100) * 0.5;  // 0.75 to 1.25

if (isWinner) {
  casualtyRate = clamp(baseCasualtyRate * strengthRatio * aggressionMod, 0.10, 0.30);
} else {
  casualtyRate = clamp(baseCasualtyRate * strengthRatio * aggressionMod * 2, 0.50, 0.90);
}
```

**Recommended Ranges:**

| Combat Style | Base Rate | Winner Range | Loser Range |
|--------------|-----------|--------------|-------------|
| Decisive | 30% | 5-20% | 70-95% |
| Normal | 20% | 10-30% | 50-90% |
| Attritional | 15% | 15-40% | 40-70% |

### 2.2 Aggression Modifier

**Location:** `src/core/CombatSystem.ts` (line 110)

| Variable | Formula | Range |
|----------|---------|-------|
| Aggression Modifier | `0.8 + (aggressionPercent / 100) * 0.4` | 0.8x to 1.2x |

**Impact Analysis:**

The aggression slider (0-100%) allows players to choose their combat posture. At 0% aggression, forces fight cautiously (0.8x strength multiplier) but take fewer casualties. At 100% aggression, forces fight at maximum effectiveness (1.2x strength multiplier) but suffer correspondingly higher losses.

This creates tactical decisions: overwhelming force should use high aggression to end battles quickly, while evenly matched forces might use low aggression to preserve troops for future engagements.

**Aggression Effects Table:**

| Aggression | Strength Modifier | Casualty Modifier |
|------------|-------------------|-------------------|
| 0% | 0.80x | 0.75x |
| 25% | 0.90x | 0.875x |
| 50% | 1.00x | 1.00x |
| 75% | 1.10x | 1.125x |
| 100% | 1.20x | 1.25x |

**Recommended Ranges:**

Adjusting the aggression formula affects how meaningful the slider becomes:
- Narrow range (0.9-1.1x): Aggression is a minor tactical choice
- Normal range (0.8-1.2x): Aggression meaningfully affects outcomes
- Wide range (0.6-1.4x): Aggression dominates tactical decisions

---

## 3. Military Unit Variables

These variables govern platoon training, equipment effectiveness, and military strength calculations.

### 3.1 Training System

**Location:** `src/core/PlatoonSystem.ts` (lines 34-36)

| Variable | Default | Description |
|----------|---------|-------------|
| `TrainingTurns` | 10 | Total turns required to fully train a platoon |
| `TrainingPerTurn` | 10 | Percentage points gained per turn of training |
| `StarbasePlanetID` | 0 | Only this planet can train platoons |

**Impact Analysis:**

The 10-turn training duration creates a significant lead time for military buildup. Players must plan platoon commissioning well in advance of anticipated conflicts. Untrained platoons (0% training) have zero combat effectiveness, making them useless until training completes.

The restriction that only Starbase (planet 0) can train troops creates strategic vulnerability: losing Starbase cripples military production capability.

**Military Strength Formula:**
```typescript
strength = troops × equipmentMod × weaponMod × (trainingLevel / 100)
```

At 0% training: strength = 0 (useless in combat)
At 50% training: strength = 50% of fully trained
At 100% training: full combat effectiveness

**Recommended Ranges:**

| Pace | Training Turns | Per Turn | Effect |
|------|----------------|----------|--------|
| Fast | 5 | 20 | Rapid military response possible |
| Normal | 10 | 10 | Balanced planning required |
| Slow | 20 | 5 | Major commitment to train troops |

### 3.2 Troop Limits

**Location:** `src/core/PlatoonSystem.ts` (lines 39-40)

| Variable | Default | Description |
|----------|---------|-------------|
| `MinTroops` | 1 | Minimum troops per platoon |
| `MaxTroops` | 200 | Maximum troops per platoon |

**Impact Analysis:**

The 200-troop maximum per platoon means large armies require multiple platoons. Combined with the 24-platoon global limit, the maximum army size is 4,800 troops. This cap prevents runaway military buildups in long games.

Smaller platoons (1-50 troops) are economical for garrison duty, while larger platoons (150-200 troops) maximize per-unit combat effectiveness.

### 3.3 Equipment Levels and Costs

**Location:** `src/core/models/PlatoonModels.ts` (lines 10-24, 60-74)

| Equipment Level | Cost (Credits) | Combat Modifier |
|-----------------|----------------|-----------------|
| Civilian | 20,000 | 0.5x |
| Basic | 35,000 | 1.0x |
| Standard | 55,000 | 1.5x |
| Advanced | 80,000 | 2.0x |
| Elite | 109,000 | 2.5x |

**Impact Analysis:**

Equipment cost scales non-linearly with combat effectiveness. Elite equipment costs 5.45x more than Civilian but provides 5x the combat modifier. This makes Elite equipment slightly less cost-efficient but significantly more space-efficient (fewer platoons needed for equivalent strength).

**Cost Efficiency Analysis:**

| Level | Cost | Modifier | Cost per Modifier Point |
|-------|------|----------|-------------------------|
| Civilian | 20,000 | 0.5x | 40,000 |
| Basic | 35,000 | 1.0x | 35,000 |
| Standard | 55,000 | 1.5x | 36,667 |
| Advanced | 80,000 | 2.0x | 40,000 |
| Elite | 109,000 | 2.5x | 43,600 |

Basic equipment is the most cost-efficient choice for large armies, while Elite equipment is optimal when platoon count is the limiting factor.

### 3.4 Weapon Levels and Costs

**Location:** `src/core/models/PlatoonModels.ts` (lines 30-42, 80-92)

| Weapon Level | Cost (Credits) | Combat Modifier |
|--------------|----------------|-----------------|
| Pistol | 5,000 | 0.8x |
| Rifle | 10,000 | 1.0x |
| Assault Rifle | 18,000 | 1.3x |
| Plasma | 30,000 | 1.6x |

**Impact Analysis:**

Weapons provide a multiplicative bonus that stacks with equipment. A platoon with Elite equipment (2.5x) and Plasma weapons (1.6x) has a combined 4.0x strength multiplier versus a Civilian/Pistol platoon at 0.4x—a 10:1 strength advantage.

Total platoon cost varies dramatically:

| Configuration | Equipment | Weapon | Total Cost |
|---------------|-----------|--------|------------|
| Minimum | Civilian | Pistol | 25,000 |
| Budget | Basic | Rifle | 45,000 |
| Standard | Standard | Rifle | 65,000 |
| Premium | Advanced | Assault Rifle | 98,000 |
| Maximum | Elite | Plasma | 139,000 |

---

## 4. Spacecraft Variables

These variables define spacecraft costs, capabilities, and operational parameters.

### 4.1 Spacecraft Costs

**Location:** `src/core/models/CraftModels.ts` (lines 11-58)

| Craft Type | Credits | Minerals | Fuel | Total Value |
|------------|---------|----------|------|-------------|
| Battle Cruiser | 50,000 | 10,000 | 5,000 | ~65,000 |
| Cargo Cruiser | 30,000 | 5,000 | 3,000 | ~38,000 |
| Solar Satellite | 15,000 | 3,000 | 1,000 | ~19,000 |
| Atmosphere Processor | 10,000 | 5,000 | 2,000 | ~17,000 |

**Impact Analysis:**

Battle Cruisers are the most expensive craft, reflecting their military importance. The 50,000-credit cost means players typically cannot afford fleet expansion until mid-game when economic infrastructure is established.

Cargo Cruisers at 30,000 credits provide essential resource transport but represent a significant investment that doesn't directly contribute to military strength.

Solar Satellites at 15,000 credits pay for themselves in approximately 188 turns (at 80 energy/turn). This makes them a long-term investment rather than a quick economic boost.

Atmosphere Processors at 10,000 credits are consumed during terraforming, making them one-time investments for planetary expansion.

### 4.2 Crew Requirements

**Location:** `src/core/models/CraftModels.ts` (lines 83-86)

| Craft Type | Crew Required |
|------------|---------------|
| Battle Cruiser | 50 |
| Cargo Cruiser | 30 |
| Solar Satellite | 5 |
| Atmosphere Processor | 20 |

**Impact Analysis:**

Crew requirements create population pressure from spacecraft production. A fleet of 10 Battle Cruisers requires 500 crew, which is half of a starting planet's population. This prevents players from building massive fleets without corresponding population infrastructure.

### 4.3 Spacecraft Specifications

**Location:** `src/core/models/CraftModels.ts` (lines 121-151)

| Craft Type | Speed | Fuel Rate | Capacity |
|------------|-------|-----------|----------|
| Battle Cruiser | 50 | 1:10 | 4 platoons |
| Cargo Cruiser | 30 | 1:5 | 1,000/resource |
| Solar Satellite | 0 | 0 | 80 energy/turn |
| Atmosphere Processor | 30 | 1:5 | 10-turn terraform |

**Impact Analysis:**

Speed determines how quickly craft can traverse the galaxy map. Battle Cruisers at speed 50 can respond to threats quickly, while Cargo Cruisers at speed 30 take longer to complete trade routes.

Fuel consumption rate (distance per fuel unit) affects operational range. Battle Cruisers are efficient (10 distance per fuel) while Cargo Cruisers are inefficient (5 distance per fuel), reflecting their bulkier design.

Platoon capacity of 4 per Battle Cruiser means invasions typically require multiple cruisers for large-scale ground operations.

---

## 5. Building Variables

Building costs and construction times determine the pace of planetary development.

### 5.1 Building Costs

**Location:** `src/core/models/BuildingModels.ts` (lines 21-58)

| Building Type | Credits | Minerals | Fuel |
|---------------|---------|----------|------|
| Docking Bay | 5,000 | 1,000 | 500 |
| Surface Platform | 2,000 | 500 | 0 |
| Mining Station | 8,000 | 2,000 | 1,000 |
| Horticultural Station | 6,000 | 1,500 | 800 |
| Orbital Defense | 12,000 | 3,000 | 2,000 |

**Impact Analysis:**

Mining Stations at 8,000 credits are the most expensive production building, reflecting their economic importance. At 50 minerals/turn output, a Mining Station pays back its mineral cost in 40 turns, making it a mid-term investment.

Horticultural Stations at 6,000 credits are cheaper than Mining Stations but equally important for sustaining population growth and maintaining morale.

Orbital Defense at 12,000 credits is the most expensive structure. Each platform provides a 20% defensive bonus (maximum 2 platforms = 40% total), making them cost-effective for protecting high-value planets.

### 5.2 Construction Times

**Location:** `src/core/models/BuildingModels.ts` (lines 65-79)

| Building Type | Turns to Complete |
|---------------|-------------------|
| Docking Bay | 2 |
| Surface Platform | 1 |
| Mining Station | 3 |
| Horticultural Station | 2 |
| Orbital Defense | 3 |

**Impact Analysis:**

Construction times create planning requirements. Mining Stations taking 3 turns means players must anticipate resource needs several turns in advance.

Surface Platforms completing in 1 turn allow rapid expansion of planetary capacity when needed.

### 5.3 Scrapping Refund

**Location:** `src/core/BuildingSystem.ts` (lines 137-143)

| Variable | Value | Description |
|----------|-------|-------------|
| Scrap Refund Rate | 50% | Percentage of original cost returned when scrapping |

**Impact Analysis:**

The 50% scrap refund makes building destruction costly but not completely wasteful. Players can recoup some investment from obsolete or captured buildings, but demolishing structures should be a last resort.

---

## 6. AI Behavior Variables

AI behavior variables determine opponent personality, difficulty scaling, and decision-making thresholds.

### 6.1 AI Personalities

**Location:** `src/core/models/AIModels.ts` (lines 29-68)

| Personality | Name | Aggression | Economic | Defense |
|-------------|------|------------|----------|---------|
| Aggressive | Commander Kratos | +0.5 | -0.3 | 0.0 |
| Defensive | Overseer Aegis | -0.5 | 0.0 | +0.4 |
| Economic | Magistrate Midas | -0.3 | +0.5 | 0.0 |
| Balanced | General Nexus | 0.0 | 0.0 | 0.0 |

**Impact Analysis:**

Personality modifiers shift the AI's decision thresholds and priorities:

- **Aggressive (+0.5 aggression)**: Commander Kratos attacks at lower strength advantages and prioritizes military over economy. Expect early aggression and frequent raids.

- **Defensive (-0.5 aggression, +0.4 defense)**: Overseer Aegis rarely initiates attacks and focuses on fortifying existing planets. Requires overwhelming force to defeat.

- **Economic (-0.3 aggression, +0.5 economic)**: Magistrate Midas builds extensive infrastructure before military expansion. Vulnerable early but dangerous if left unchecked.

- **Balanced (all 0.0)**: General Nexus adapts to player actions without strong preferences. Most unpredictable opponent.

### 6.2 Difficulty Modifiers

**Location:** `src/core/AIDecisionSystem.ts` (lines 287-296, 322-333)

| Difficulty | Military Modifier | Attack Threshold |
|------------|-------------------|------------------|
| Easy | -20% (0.8x) | 0.50 (needs 2x player strength) |
| Normal | 0% (1.0x) | 0.67 (needs 1.5x player strength) |
| Hard | +20% (1.2x) | 0.83 (needs 1.2x player strength) |

**Impact Analysis:**

Difficulty modifiers affect AI military strength assessment, not actual unit stats. On Hard difficulty, the AI believes its forces are 20% stronger than they actually are, making it attack more aggressively.

Attack thresholds determine when the AI initiates offensive operations. At Easy (0.50), the AI waits until it has overwhelming force. At Hard (0.83), the AI attacks with much smaller advantages.

**Attack Decision Formula:**
```typescript
threatLevel = playerMilitaryStrength / aiMilitaryStrength;
adjustedThreshold = baseThreshold + personalityAggressionModifier;
canAttack = threatLevel < adjustedThreshold;
```

Example: On Normal difficulty with Aggressive personality:
- Base threshold: 0.67
- Aggression modifier: +0.5
- Adjusted threshold: 1.17
- AI attacks if player is up to 17% stronger

---

## 7. Entity Limits

Global limits prevent runaway entity counts and ensure game stability.

### 7.1 Fleet and Army Limits

**Location:** `src/core/EntitySystem.ts` (referenced by CraftSystem and PlatoonSystem)

| Entity Type | Maximum Count |
|-------------|---------------|
| Spacecraft | 32 |
| Platoons | 24 |

**Impact Analysis:**

The 32-spacecraft limit means both player and AI share from the same pool (16 each if evenly split, but unequal distribution is possible). This creates an implicit fleet arms race.

The 24-platoon limit caps maximum army size at 4,800 troops (24 × 200). Combined with training time requirements, this prevents overwhelming force buildup.

### 7.2 Building Capacity

**Location:** `src/core/models/PlanetEntity.ts` (capacity methods)

| Capacity Type | Default Limit |
|---------------|---------------|
| Docking Bays | 3 per planet |
| Surface Structures | Unlimited |
| Orbital Defense Platforms | 2 per planet |

**Impact Analysis:**

The 3-docking-bay limit constrains fleet concentration at any single planet. Maximum orbital capacity requires strategic distribution of spacecraft across multiple planets.

Orbital Defense Platforms are limited to 2 (40% maximum defensive bonus), preventing planets from becoming completely impregnable fortresses.

---

## 8. Recommended Configurations

This section provides tested variable combinations for different play experiences.

### 8.1 Tutorial Mode (Highly Forgiving)

For new players learning game mechanics:

| Category | Adjustments |
|----------|-------------|
| Production | +50% all resource rates |
| Combat | Winner casualties: 5-15%, Loser: 40-60% |
| Training | 5 turns (2x speed) |
| AI Difficulty | Easy with -30% additional penalty |

**Effect:** Players can make mistakes without severe consequences. Economic pressure is minimal, and combat is decisive without being punishing.

### 8.2 Standard Mode (Balanced)

For experienced players seeking fair challenge:

| Category | Values |
|----------|--------|
| Production | Default values |
| Combat | Default casualty rates |
| Training | Default 10 turns |
| AI Difficulty | Normal with Balanced personality |

**Effect:** All systems function as designed. Victory requires competent play across all game systems.

### 8.3 Hard Mode (Challenging)

For veteran players seeking difficulty:

| Category | Adjustments |
|----------|-------------|
| Production | -25% all resource rates |
| Combat | Winner casualties: 15-35%, Loser: 60-95% |
| Training | 15 turns |
| AI Difficulty | Hard with Aggressive personality |

**Effect:** Every decision matters. Resource scarcity, costly combat, and aggressive AI create constant pressure.

### 8.4 Scenario Design Reference

When designing Flash Conflict scenarios, use these guidelines:

| Scenario Type | Economy | Combat | AI |
|---------------|---------|--------|-----|
| Economic Tutorial | +100% resources | Disabled | None |
| Combat Tutorial | Fixed resources | Default | Passive |
| Strategic Challenge | -25% resources | Default | Hard/Aggressive |
| Survival Mode | -50% resources | +50% casualties | Hard/Defensive |

---

## Variable Location Quick Reference

For rapid lookup during development:

| System | Primary File | Model File |
|--------|--------------|------------|
| Income | `src/core/IncomeSystem.ts` | — |
| Combat | `src/core/CombatSystem.ts` | `src/core/models/CombatModels.ts` |
| Platoons | `src/core/PlatoonSystem.ts` | `src/core/models/PlatoonModels.ts` |
| Spacecraft | `src/core/CraftSystem.ts` | `src/core/models/CraftModels.ts` |
| Buildings | `src/core/BuildingSystem.ts` | `src/core/models/BuildingModels.ts` |
| AI | `src/core/AIDecisionSystem.ts` | `src/core/models/AIModels.ts` |
| Entities | `src/core/EntitySystem.ts` | — |

---

*Last updated: December 2024*
*Applies to: Overlord MVP v0.1.0*
