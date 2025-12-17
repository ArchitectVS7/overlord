# Chapter 1: UAT Methodology for Closed Alpha

This chapter provides structured User Acceptance Testing (UAT) scripts for validating Overlord's core mechanics during closed alpha testing. Each script targets a specific game system with step-by-step procedures, expected outcomes, and clear pass/fail criteria.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Environment Setup](#test-environment-setup)
3. [Resource System Tests](#uat-resource-001-007)
4. [Combat System Tests](#uat-combat-001-004)
5. [AI Behavior Tests](#uat-ai-001-004)
6. [Save/Load System Tests](#uat-save-001-004)
7. [Test Summary Form](#test-summary-form)

---

## Testing Philosophy

These UAT scripts are designed to validate core game mechanics, not exhaust every possible scenario. Each test:

- **Explains WHY** each step matters, not just WHAT to do
- **Provides reproducible conditions** with specific starting states
- **Defines observable outcomes** with measurable pass/fail criteria
- **Includes space for bug documentation** when issues are discovered

Alpha testers should complete all tests in order, documenting any deviations from expected behavior. Even "minor" issues should be recorded—patterns often emerge from multiple small observations.

---

## Test Environment Setup

Before beginning any UAT test, ensure your environment meets these requirements:

### Browser Requirements
- **Primary:** Google Chrome 90+ (all tests validated here)
- **Secondary:** Mozilla Firefox 88+ (compatibility check)
- **Screen Resolution:** 1920×1080 minimum

### Account Setup
- **Test Account:** Use a dedicated test account (not your personal account)
- **Admin Flag:** Set `is_admin = false` for standard testing
- **Fresh State:** Clear local storage before each test session

### Starting a Test Session
1. Open the game in an incognito/private browser window
2. Sign in with your test account (or play as guest)
3. Verify no existing saves appear in the load menu
4. Note the date, time, and browser version in your test log

---

## UAT-RESOURCE-001: Base Income Calculation

### Purpose
Validate that the income system correctly calculates resource production from buildings, applying the correct base rates defined in the game's economy configuration.

### Preconditions
- Start a new campaign
- Difficulty: Normal
- AI Personality: Balanced
- Do not build any structures yet

### Test Steps

**Step 1: Document Starting Resources**

After the campaign begins, open the planet panel for your Starbase. Record the initial resource values:

| Resource | Starting Value | Source Code Reference |
|----------|----------------|----------------------|
| Credits | _____ | Expected: 10,000 |
| Minerals | _____ | Expected: 2,000 |
| Fuel | _____ | Expected: 1,000 |
| Food | _____ | Expected: 500 |
| Energy | _____ | Expected: 300 |

**Why this matters:** Starting resources establish the baseline for all income calculations. Incorrect starting values indicate a problem with GalaxyGenerator or scenario initialization.

**Step 2: Verify Zero Production Without Buildings**

Your Starbase begins with no production buildings. End the turn without taking any action.

Expected behavior:
- Income Phase should produce zero resources (no buildings = no production)
- Resources should remain at starting values
- No error messages or warnings

Record post-turn resources:

| Resource | Post-Turn 1 Value | Change |
|----------|-------------------|--------|
| Credits | _____ | _____ |
| Minerals | _____ | _____ |
| Fuel | _____ | _____ |
| Food | _____ | _____ |
| Energy | _____ | _____ |

**Pass Criteria:** All resources unchanged (±0).

**Step 3: Build One Mining Station**

On Turn 2, build a Mining Station on your Starbase.

- Cost: 8,000 credits, 2,000 minerals, 1,000 fuel
- Construction time: 3 turns

Record resources after initiating construction:

| Resource | Post-Purchase | Expected Deduction |
|----------|---------------|-------------------|
| Credits | _____ | -8,000 |
| Minerals | _____ | -2,000 |
| Fuel | _____ | -1,000 |

End the turn. The Mining Station should show "Under Construction: 2 turns remaining."

**Pass Criteria:** Correct cost deducted, construction timer visible.

**Step 4: Verify Production After Completion**

Continue ending turns until the Mining Station completes (Turn 5).

On Turn 5 income calculation:
- Mining Station becomes Active
- Should produce: 50 minerals + 30 fuel per turn (base rates)

Record Turn 5-6 income:

| Resource | Turn 5 | Turn 6 | Difference |
|----------|--------|--------|------------|
| Minerals | _____ | _____ | Expected: +50 |
| Fuel | _____ | _____ | Expected: +30 |

**Pass Criteria:** Mining Station produces exactly 50 minerals and 30 fuel per turn once active.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|
| | | | |

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-RESOURCE-002: Morale Income Penalty

### Purpose
Validate that low morale correctly reduces income production according to the penalty formula: Income × (morale / 100) when morale drops below 50%.

### Preconditions
- Continue from UAT-RESOURCE-001 or start fresh with a Mining Station
- Ensure you have at least one production building active

### Test Steps

**Step 1: Establish Baseline Production**

Record current production with healthy morale (should be 75%+ on a new game):

| Metric | Value |
|--------|-------|
| Current Morale | _____% |
| Minerals/turn | _____ |
| Fuel/turn | _____ |

**Step 2: Trigger Morale Reduction**

Morale reduction can be triggered by:
- Setting tax rate very high (if implemented)
- Allowing food to deplete
- Receiving bombardment (requires enemy interaction)

For this test, if available, set the tax rate to maximum or use a debug command to reduce morale to 40%.

Record new morale: _____%

**Step 3: Verify Income Reduction**

With morale at 40% (below the 50% threshold), end the turn.

Expected calculation:
- Base income: 50 minerals, 30 fuel
- Morale multiplier: 40 / 100 = 0.40
- Penalized income: 50 × 0.40 = 20 minerals, 30 × 0.40 = 12 fuel

| Resource | Pre-Penalty | Post-Penalty | Expected |
|----------|-------------|--------------|----------|
| Minerals/turn | _____ | _____ | ~20 |
| Fuel/turn | _____ | _____ | ~12 |

**Pass Criteria:** Income reduced proportionally to morale percentage.

**Step 4: Verify Warning Event**

When morale penalty triggers, the game should fire `onLowMoraleIncomePenalty` event.

Expected: Visual indicator or notification appears showing morale penalty is active.

**Pass Criteria:** Low morale warning visible when penalty applies.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-RESOURCE-003: Crew Allocation Priority

### Purpose
Validate that crew is allocated to buildings in the correct priority order (Food → Minerals/Fuel → Energy) when population is insufficient to staff all facilities.

### Preconditions
- Planet with multiple buildings of different types
- Population lower than total crew requirements

### Test Steps

**Step 1: Create Crew Shortage Scenario**

Build multiple buildings that exceed your population's crew capacity:
- Horticultural Station requires 10 crew
- Mining Station requires 15 crew
- Solar Satellite requires 5 crew (if implemented)

With starting population of 1,000 and structures requiring more total crew, some should become inactive.

**Step 2: Verify Priority Order**

Expected priority when crew is insufficient:
1. Horticultural Stations activate first (food production critical)
2. Mining Stations activate second
3. Solar Satellites activate last

Record building status:

| Building | Required Crew | Status | Expected |
|----------|---------------|--------|----------|
| Horticultural #1 | 10 | _____ | Active |
| Horticultural #2 | 10 | _____ | Active |
| Mining #1 | 15 | _____ | Active if crew available |
| Mining #2 | 15 | _____ | Inactive if crew short |

**Pass Criteria:** Buildings activate in priority order until crew exhausted.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-COMBAT-001: Basic Ground Combat Resolution

### Purpose
Validate that ground combat correctly calculates outcomes based on military strength, with casualties falling within expected ranges.

### Preconditions
- Player has at least one trained platoon (100% training)
- Platoon loaded onto Battle Cruiser
- Battle Cruiser in orbit at enemy planet with defenders

### Test Steps

**Step 1: Document Force Composition**

Before initiating invasion, record both sides' forces:

**Attacker (Player):**

| Platoon | Troops | Equipment | Weapon | Training | Est. Strength |
|---------|--------|-----------|--------|----------|---------------|
| #1 | _____ | _____ | _____ | _____% | _____ |
| #2 | _____ | _____ | _____ | _____% | _____ |

Total Attacker Strength: _____

**Defender (AI):**

| Platoon | Troops | Equipment | Weapon | Training | Est. Strength |
|---------|--------|-----------|--------|----------|---------------|
| #1 | _____ | _____ | _____ | _____% | _____ |

Total Defender Strength: _____

Strength Ratio (Attacker:Defender): _____:1

**Step 2: Execute Combat at 50% Aggression**

Initiate invasion with aggression slider set to 50% (neutral).

Record combat outcome:

| Metric | Value |
|--------|-------|
| Winner | Attacker / Defender |
| Attacker Casualties | _____ troops (_____%) |
| Defender Casualties | _____ troops (_____%) |
| Planet Captured? | Yes / No |

**Step 3: Verify Casualty Rates**

Expected casualty ranges (from CombatSystem):
- Winner: 10-30% of engaged troops
- Loser: 50-90% of engaged troops
- Base rate: 20%

Calculate actual rates:
- Attacker casualty %: (Casualties / Starting Troops) × 100 = _____%
- Defender casualty %: (Casualties / Starting Troops) × 100 = _____%

**Pass Criteria:**
- Winner casualties between 10-30%
- Loser casualties between 50-90%
- Correct side wins based on strength comparison

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-COMBAT-002: Aggression Modifier Effect

### Purpose
Validate that the aggression slider correctly modifies combat outcomes as documented (0.8x-1.2x strength modifier).

### Preconditions
- Ability to reload same combat scenario multiple times
- OR: Use dev tools to create controlled test conditions

### Test Steps

**Step 1: Test Low Aggression (0%)**

Execute combat with identical force compositions at 0% aggression.

Expected modifier: 0.8x attacker strength

| Metric | 0% Aggression Result |
|--------|----------------------|
| Effective Strength | Base × 0.80 = _____ |
| Combat Rounds | _____ (should be higher) |
| Attacker Casualties | _____ (should be lower) |

**Step 2: Test High Aggression (100%)**

Reload and execute combat at 100% aggression.

Expected modifier: 1.2x attacker strength

| Metric | 100% Aggression Result |
|--------|------------------------|
| Effective Strength | Base × 1.20 = _____ |
| Combat Rounds | _____ (should be lower) |
| Attacker Casualties | _____ (should be higher) |

**Step 3: Compare Results**

| Metric | 0% Aggression | 100% Aggression | Difference |
|--------|---------------|-----------------|------------|
| Rounds | _____ | _____ | _____ |
| Att. Casualties | _____ | _____ | _____ |
| Def. Casualties | _____ | _____ | _____ |

**Pass Criteria:**
- Higher aggression = fewer combat rounds
- Higher aggression = higher attacker casualties
- Strength modifier clearly affects outcome

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-COMBAT-003: Equipment and Weapon Modifiers

### Purpose
Validate that equipment and weapon levels correctly modify platoon military strength.

### Preconditions
- Ability to create platoons with different equipment configurations

### Test Steps

**Step 1: Create Test Platoons**

Commission two platoons with identical troop counts (100) but different equipment:

| Platoon | Troops | Equipment | Weapon | Expected Modifier |
|---------|--------|-----------|--------|-------------------|
| A | 100 | Civilian (0.5x) | Pistol (0.8x) | 0.40x |
| B | 100 | Elite (2.5x) | Plasma (1.6x) | 4.00x |

**Step 2: Calculate Expected Strength**

Formula: Troops × Equipment × Weapon × (Training / 100)

At 100% training:
- Platoon A: 100 × 0.5 × 0.8 × 1.0 = 40
- Platoon B: 100 × 2.5 × 1.6 × 1.0 = 400

**Step 3: Verify In-Game Strength**

| Platoon | Expected Strength | Actual Strength | Match? |
|---------|-------------------|-----------------|--------|
| A | 40 | _____ | Yes / No |
| B | 400 | _____ | Yes / No |

**Pass Criteria:** Displayed strength matches calculated strength (±1 for rounding).

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-AI-001: Aggressive Personality Behavior

### Purpose
Validate that the "Aggressive" AI personality (Commander Kratos) attacks early and prioritizes military over economy.

### Preconditions
- New campaign
- AI Personality: Aggressive
- Difficulty: Normal
- Player adopts passive strategy (end turn without action)

### Test Steps

**Step 1: Observe First 10 Turns**

Play passively (just end turn) and record AI actions observed:

| Turn | Observed AI Action | Expected Behavior |
|------|-------------------|-------------------|
| 1-3 | _____ | Military production begins |
| 4-6 | _____ | Battle Cruisers purchased |
| 7-10 | _____ | Attack fleet launched |

**Step 2: Record Attack Timing**

| Metric | Value |
|--------|-------|
| Turn AI first attacks | _____ |
| Target of attack | _____ |
| Force committed | _____ |

Expected: AI should attack by Turn 7-10 with whatever force available.

**Step 3: Verify Personality Quote**

When AI initiates attack, their personality quote should display.

Commander Kratos quote: "Strength through conquest! Your planets will fall."

Quote displayed? Yes / No

**Pass Criteria:**
- AI attacks within first 10 turns
- AI prioritizes military over economic buildings
- Personality quote displays correctly

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-AI-002: Defensive Personality Behavior

### Purpose
Validate that the "Defensive" AI personality (Overseer Aegis) prioritizes fortification over aggression.

### Preconditions
- New campaign
- AI Personality: Defensive
- Difficulty: Normal

### Test Steps

**Step 1: Observe AI Construction**

Record AI building activity over 15 turns:

| Structure Type | Count Built | Expected Priority |
|----------------|-------------|-------------------|
| Orbital Defense | _____ | High (defensive) |
| Mining Station | _____ | Medium |
| Horticultural | _____ | Medium |

**Step 2: Test Attack Reluctance**

Build moderate military force and position near AI territory.

AI response at various threat levels:

| Player Strength vs AI | AI Response | Expected |
|-----------------------|-------------|----------|
| 50% of AI strength | _____ | No attack |
| 100% of AI strength | _____ | No attack (defensive) |
| 200% of AI strength | _____ | Possible retreat |

**Step 3: Verify Personality Quote**

Overseer Aegis quote: "Patience is the strongest fortress. I can wait."

Quote displayed? Yes / No

**Pass Criteria:**
- AI builds defensive structures early
- AI rarely or never initiates attacks
- AI fortifies planets rather than expanding

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-AI-003: Difficulty Scaling

### Purpose
Validate that difficulty settings correctly modify AI behavior and strength bonuses.

### Preconditions
- Test same scenario on Easy, Normal, and Hard

### Test Steps

**Step 1: Compare AI Attack Thresholds**

On each difficulty, observe when AI initiates attacks:

| Difficulty | Strength Required | Attack Turn |
|------------|-------------------|-------------|
| Easy | 2.0x player (0.5 threshold) | _____ |
| Normal | 1.5x player (0.67 threshold) | _____ |
| Hard | 1.2x player (0.83 threshold) | _____ |

**Step 2: Verify Strength Modifier**

AI military strength should be modified by difficulty:

| Difficulty | Base Strength | Modifier | Effective |
|------------|---------------|----------|-----------|
| Easy | _____ | 0.8x | _____ |
| Normal | _____ | 1.0x | _____ |
| Hard | _____ | 1.2x | _____ |

**Pass Criteria:**
- Easy AI attacks late with overwhelming force
- Normal AI attacks with moderate advantage
- Hard AI attacks aggressively with smaller advantage

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-SAVE-001: Local Save/Load Integrity

### Purpose
Validate that game state saves correctly and loads without corruption.

### Preconditions
- Play until Turn 10 with varied game state
- Multiple buildings, platoons, and spacecraft

### Test Steps

**Step 1: Document Pre-Save State**

Before saving, record:

| Metric | Value |
|--------|-------|
| Turn Number | _____ |
| Planet Count (Owned) | _____ |
| Total Credits | _____ |
| Total Minerals | _____ |
| Platoon Count | _____ |
| Spacecraft Count | _____ |

**Step 2: Save Game**

Create save with name "UAT-Test-001"

Save successful? Yes / No
Error messages? _____

**Step 3: Close and Reload**

1. Close the browser completely
2. Reopen game
3. Load "UAT-Test-001"

**Step 4: Verify State Restoration**

| Metric | Pre-Save | Post-Load | Match? |
|--------|----------|-----------|--------|
| Turn Number | _____ | _____ | Yes/No |
| Planet Count | _____ | _____ | Yes/No |
| Total Credits | _____ | _____ | Yes/No |
| Total Minerals | _____ | _____ | Yes/No |
| Platoon Count | _____ | _____ | Yes/No |
| Spacecraft Count | _____ | _____ | Yes/No |

**Pass Criteria:** All values match exactly after reload.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-SAVE-002: Cloud Save Synchronization

### Purpose
Validate that saves sync correctly between local storage and cloud.

### Preconditions
- Signed in with authenticated account
- Network connectivity available

### Test Steps

**Step 1: Create Cloud Save**

1. Sign in to account
2. Create save "Cloud-Test-001"
3. Verify cloud indicator shows sync complete

Cloud sync status: _____

**Step 2: Verify Cross-Device Access**

1. Open game on different device/browser
2. Sign in with same account
3. Check save list for "Cloud-Test-001"

Save appears on second device? Yes / No

**Step 3: Load on Second Device**

Load the save on the second device.

State matches original? Yes / No

**Pass Criteria:** Save accessible and correct on multiple devices.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-SAVE-003: Offline Fallback

### Purpose
Validate that saving works offline with local storage fallback.

### Preconditions
- Disconnect network (airplane mode or disable adapter)

### Test Steps

**Step 1: Attempt Save While Offline**

With network disconnected:
1. Play to a new game state
2. Attempt to save "Offline-Test-001"

Save operation result: _____

**Step 2: Verify Local Storage**

Check browser local storage for save data.

Local save present? Yes / No

**Step 3: Reconnect and Sync**

1. Reconnect network
2. Open game
3. Observe sync behavior

Sync occurred? Yes / No
Errors? _____

**Pass Criteria:** Save succeeds offline, syncs when online.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## UAT-SAVE-004: Checksum Validation

### Purpose
Validate that corrupted saves are detected and handled gracefully.

### Preconditions
- Understanding of browser developer tools
- Existing save in local storage

### Test Steps

**Step 1: Corrupt Save Data**

Using browser developer tools:
1. Find save in local storage
2. Modify a few characters of the save data
3. Do not modify the checksum

**Step 2: Attempt to Load**

Try loading the corrupted save.

Expected behavior:
- Checksum validation fails
- Error message displays
- Game does not crash
- User can recover (start new or load different save)

Actual behavior: _____

**Pass Criteria:** Corrupted saves detected, graceful error handling.

### Bug Notes

| Issue # | Description | Severity | Screenshot |
|---------|-------------|----------|------------|

### Tester Sign-off
- Tester Name: _________________
- Date: _________________
- Result: Pass / Fail

---

## Test Summary Form

Complete this form after finishing all UAT tests:

### Test Results Overview

| Test ID | Test Name | Result | Issues Found |
|---------|-----------|--------|--------------|
| UAT-RESOURCE-001 | Base Income | Pass/Fail | |
| UAT-RESOURCE-002 | Morale Penalty | Pass/Fail | |
| UAT-RESOURCE-003 | Crew Allocation | Pass/Fail | |
| UAT-COMBAT-001 | Ground Combat | Pass/Fail | |
| UAT-COMBAT-002 | Aggression Modifier | Pass/Fail | |
| UAT-COMBAT-003 | Equipment Modifiers | Pass/Fail | |
| UAT-AI-001 | Aggressive AI | Pass/Fail | |
| UAT-AI-002 | Defensive AI | Pass/Fail | |
| UAT-AI-003 | Difficulty Scaling | Pass/Fail | |
| UAT-SAVE-001 | Local Save/Load | Pass/Fail | |
| UAT-SAVE-002 | Cloud Sync | Pass/Fail | |
| UAT-SAVE-003 | Offline Fallback | Pass/Fail | |
| UAT-SAVE-004 | Checksum Validation | Pass/Fail | |

### Summary Statistics

| Metric | Value |
|--------|-------|
| Total Tests | 13 |
| Tests Passed | _____ |
| Tests Failed | _____ |
| Critical Issues | _____ |
| Major Issues | _____ |
| Minor Issues | _____ |

### Alpha Release Readiness

Based on test results, is the build ready for closed alpha?

- [ ] Yes - All critical tests pass, no blockers
- [ ] No - Critical failures require fixing (list below)

Blocking issues:
1. _____
2. _____
3. _____

### Tester Information

| Field | Value |
|-------|-------|
| Tester Name | |
| Test Date | |
| Game Version/Commit | |
| Browser & Version | |
| Operating System | |
| Total Test Time | |

---

*Last updated: December 2024*
*Applies to: Overlord Closed Alpha UAT*
