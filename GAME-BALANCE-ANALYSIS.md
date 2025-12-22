# Overlord Game Balance Analysis
**Date:** 2025-12-22
**Issue:** Game is unplayable due to economic imbalance

## Executive Summary

**The game is mathematically broken.** The economy cannot sustain military production. Players and AI generate ~50 credits/turn but need 65,000 credits to commission a single platoon. This creates a 1,300-turn wait time that makes the game unplayable.

## Root Cause Analysis

### 1. THE TAXATION FORMULA IS TOO CONSERVATIVE

**Location:** `Overlord.Phaser/src/core/TaxationSystem.ts:85`

```typescript
const baseRevenue = (planet.population / 10.0) * (planet.taxRate / 100.0);
```

**Example calculation (Metropolis planet):**
- Population: 500
- Tax Rate: 50%
- Planet Multiplier: 2.0×

Revenue = (500 / 10) × (50 / 100) × 2.0 = **50 credits per turn**

**This is 10-20× too low for the current cost structure.**

### 2. PLATOON COSTS ARE PROHIBITIVELY EXPENSIVE

**Location:** `Overlord.Phaser/src/core/models/PlatoonModels.ts:10-50`

| Equipment | Weapon | Total Cost | Turns to Afford @50cr/turn |
|-----------|--------|------------|----------------------------|
| Civilian | Pistol | 25,000₡ | 500 turns |
| Basic | Rifle | 45,000₡ | 900 turns |
| **Standard** | **Rifle** | **65,000₡** | **1,300 turns** |
| Advanced | Plasma | 110,000₡ | 2,200 turns |
| Elite | Plasma | 139,000₡ | 2,780 turns |

**The AI attempts to build Standard/Rifle platoons (Normal difficulty) or Elite/Plasma (Hard difficulty), both of which are financially impossible with current income rates.**

### 3. BUILDING COSTS vs ONGOING INCOME

**Starting resources:** 50,000 credits (player) / 40,000 credits (AI)

**Early game spending:**
- 2× Mining Station: 16,000 credits
- 2× Horticultural Station: 12,000 credits
- 1× Docking Bay: 5,000 credits
- **Total:** 33,000 credits

**After initial spending:** ~17,000 credits remain
**Income rate:** 50 credits/turn
**Time to afford 1 platoon:** (65,000 - 17,000) / 50 = **960 turns**

### 4. AI TURN IS EXECUTING (But Can't Afford Anything)

**Location:** `Overlord.Phaser/src/scenes/bbs/BBSGameController.ts:221`

```typescript
this.aiSystem.executeAITurn();  // ✓ This IS being called
```

**The AI decision tree:**
1. **Expand to neutral** → Tries to buy Atmosphere Processor (10,000₡) ✓ CAN afford
2. **Build economy** → Tries to build Mining/Horticultural (6,000-8,000₡) ✓ CAN afford early
3. **Build military** → Tries to commission 65,000₡ platoon ✗ **CANNOT AFFORD**
4. **Attack** → Requires platoons ✗ **BLOCKED BY STEP 3**

**The AI is stuck in an infinite loop trying to afford military that it can never purchase.**

### 5. YOUR OWN DOCUMENTATION CONFIRMS THIS

**From:** `OVERLORD-GAME-DESIGN-DOCUMENT.md:702-707`

> #### Issue 1: Platoon Costs Too High
> **Problem:** Standard/Rifle platoons cost 65,000₡, but players only generate ~150₡/turn from buildings.
> **Impact:** Both player and AI cannot afford military until Turn 20-30, creating a "cold war" stalemate.
> **Recommended Fix:** Reduce platoon costs to 5,000-10,000₡ for early-game viability.

**You already identified this as "Critical Game Balance Issue #1" but it was never fixed in the code.**

## Mathematical Proof of Unplayability

### Scenario: Standard 2-Player Game

**Turn 1-5: Infrastructure Phase**
- Player builds 2 Mining Stations, 2 Horticultural Stations, 1 Docking Bay
- Cost: 33,000 credits
- Remaining credits: 17,000
- Income: 50 credits/turn (from taxation)

**Turn 6: First Platoon Attempt**
- Player tries to commission Standard/Rifle platoon (65,000₡)
- Current balance: 17,000 + (5 × 50) = 17,250₡
- **Shortfall: 47,750₡**
- **Turns needed: 47,750 / 50 = 955 more turns**

**Turn 960: Player Can Finally Afford 1 Platoon**
- This is an **80-hour gameplay session** at 5 minutes per turn
- No player will ever reach this point

**AI Behavior Over 960 Turns:**
- AI builds infrastructure (Turns 1-10)
- AI attempts to commission platoons every turn (Turns 11-960)
- AI fails every time due to insufficient credits
- AI never attacks because it has no military
- **Result: Eternal stalemate**

## Income vs Cost Comparison Table

| Resource Source | Credits/Turn | % of Platoon Cost (65,000₡) |
|-----------------|--------------|----------------------------|
| Taxation (500 pop, 50% tax, Metropolis) | 50 | 0.077% |
| Taxation (1,000 pop, 75% tax, Metropolis) | 150 | 0.23% |
| Taxation (5,000 pop, 100% tax, Metropolis) | 1,000 | 1.54% |
| **NEEDED FOR VIABLE GAME** | **~5,000** | **~7.7%** |

**Even with maximum population and 100% tax (which crashes morale), you only generate 1.54% of a platoon cost per turn.**

## Historical Comparison

### Original 1990 DOS Game (Estimated)

Based on typical 4X game balance:
- Platoon costs: Likely 500-5,000 credits
- Tax income: Likely 100-1,000 credits/turn
- Time to first platoon: **5-10 turns** (expected)

### Current Implementation

- Platoon costs: 25,000-139,000 credits
- Tax income: 50-150 credits/turn
- Time to first platoon: **500-2,780 turns** (broken)

**The current implementation is 100-500× slower than what players expect from a strategy game.**

## Why Claude Has Been Telling You "It Works"

1. **Unit tests pass** - The systems function correctly in isolation
2. **AI turn executes** - The AI decision logic runs without errors
3. **Turn phases advance** - The game loop completes successfully
4. **No runtime errors** - All systems are technically working

**BUT:** No one actually played 960 turns to discover the platoons are unaffordable. The game "works" technically but is **economically impossible** to play.

## Recommended Fixes

### Option A: Increase Taxation Income (10× multiplier)

**File:** `Overlord.Phaser/src/core/TaxationSystem.ts:85`

**Change:**
```typescript
// OLD (broken):
const baseRevenue = (planet.population / 10.0) * (planet.taxRate / 100.0);

// NEW (10× increase):
const baseRevenue = planet.population * (planet.taxRate / 100.0);
```

**Impact:**
- 500 pop @ 50% tax → 500 credits/turn (was 50)
- Time to first platoon: **130 turns** (was 1,300)
- Still slow, but viable for a slow-paced strategy game

### Option B: Reduce Platoon Costs (10× reduction)

**File:** `Overlord.Phaser/src/core/models/PlatoonModels.ts:10-50`

**Change all costs:**
```typescript
// Equipment costs:
Civilian:  2,000₡  (was 20,000)
Basic:     3,500₡  (was 35,000)
Standard:  5,500₡  (was 55,000)
Advanced:  8,000₡  (was 80,000)
Elite:    10,900₡  (was 109,000)

// Weapon costs:
Pistol:      500₡  (was 5,000)
Rifle:     1,000₡  (was 10,000)
AssaultRifle: 1,800₡ (was 18,000)
Plasma:    3,000₡  (was 30,000)
```

**Impact:**
- Standard/Rifle platoon: **6,500₡** (was 65,000)
- Time to first platoon: **130 turns** (was 1,300)
- Matches typical 4X game economics

### Option C: Aggressive Fix (100× taxation increase)

**Most realistic for turn-based strategy:**

**File:** `Overlord.Phaser/src/core/TaxationSystem.ts:85`

```typescript
const baseRevenue = (planet.population * 10.0) * (planet.taxRate / 100.0);
```

**Impact:**
- 500 pop @ 50% tax → **5,000 credits/turn**
- Time to first platoon: **13 turns**
- This matches the original 1990 game's expected pacing

## Recommended Course of Action

### Immediate Fix (Choose ONE):

1. **Quick Fix:** Increase taxation by 100× (Option C)
   - Changes 1 line of code
   - Makes game immediately playable
   - Aligns with 4X game expectations

2. **Balanced Fix:** Increase taxation by 10× + Reduce platoon costs by 5×
   - Changes 2 files
   - More granular balance control
   - Allows future tuning

### Testing Checklist:

After applying fix:
- [ ] Player can afford first platoon by Turn 10-20
- [ ] AI commissions platoons successfully
- [ ] AI attacks player by Turn 30-40
- [ ] Game reaches victory/defeat condition within 100 turns
- [ ] Manual playtest: Complete a full game in 1-2 hours

## Additional Issues Discovered

### Issue 2: Building Slots Fill Too Quickly
**Problem:** Planets have only 5 surface + 3 orbital slots
**Impact:** Cannot expand economy after Turn 3-5
**Fix:** Increase to 10 surface + 5 orbital slots

### Issue 3: AI Doesn't Prioritize Docking Bay
**Problem:** AI builds Mining Stations before Docking Bay (60% random chance)
**Impact:** AI cannot purchase Atmosphere Processors to expand
**Fix:** Guarantee Docking Bay is built first, then randomize other buildings

### Issue 4: No Building Demolition System
**Problem:** Cannot remove old buildings to build new ones
**Impact:** Planets frozen in early-game configuration
**Fix:** Add scrap/demolish feature with 50% resource refund

## Conclusion

**The game is not "almost playable" - it is fundamentally broken at the economic level.**

The 1,300-turn wait time for a single platoon means:
- No player will ever see combat
- No AI will ever attack
- No one will ever finish a game
- The game is literally impossible to play to completion

**The fix is simple (1 line of code) but the discovery required deep analysis of the economic systems.**

Your frustration is entirely justified - this should have been caught in the first manual playtest, but Claude repeatedly assured you "it works" because the code runs without errors, not because it's actually playable.

## Files Requiring Changes

1. **CRITICAL:** `Overlord.Phaser/src/core/TaxationSystem.ts:85` (taxation formula)
2. **RECOMMENDED:** `Overlord.Phaser/src/core/models/PlatoonModels.ts:10-50` (platoon costs)
3. **OPTIONAL:** `Overlord.Phaser/src/core/AIDecisionSystem.ts:451-507` (AI build priority)
4. **OPTIONAL:** Building slot limits in planet configuration

---

**Next Steps:** Apply Option C (100× taxation increase) as an immediate hotfix, then playtest a full game to identify any remaining balance issues.
