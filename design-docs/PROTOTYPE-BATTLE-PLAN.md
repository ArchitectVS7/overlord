# 🎮 OVERLORD PROTOTYPE - BATTLE PLAN

**Goal:** Playable core gameplay loop in ~4 hours
**Status:** IN PROGRESS
**Started:** December 8, 2025

---

## 🎯 THE 7-STEP PLAN

### Step 1: Set Up BMAD Development Tracking (5 min) ✅ DONE
- [x] Run `/bmad:bmm:workflows:sprint-planning`
- [x] Verify `sprint-status.yaml` created
- [x] Test `/bmad:bmm:workflows:workflow-status` command

**Output:** Sprint tracking system active ✅
**Location:** `design-docs/v1.0/implementation/sprint-status.yaml`

---

### Step 2: Create Minimal Prototype Epic (10 min) ✅ DONE
- [x] Define 7 core stories for prototype
- [x] Document in sprint-status.yaml or separate epic file
- [x] Validate stories match AFS specs

**Stories:**
1. Galaxy Setup - Generate 4-6 planets, assign ownership
2. Turn System - End Turn button, phase progression
3. Resource Display - Show Credits/Minerals/Fuel/Food (text UI)
4. Buy Screen - Purchase Battle Cruiser and Platoon (basic menu)
5. Navigation - Click planet, click destination, ship moves (instant)
6. Combat - Auto-resolve combat, text result
7. Victory - Detect win condition, show "You Won!" message

---

### Step 3: Implement Story 1 - Galaxy Setup (30 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Galaxy Setup
- [ ] Implements: AFS-011, AFS-012
- [ ] Build Overlord.Core DLL
- [ ] Copy DLL to Unity Plugins folder (all 5 DLLs)
- [ ] Create Unity GalaxyManager MonoBehaviour
- [ ] Test: Press Play, see 4-6 planets in scene

**Acceptance Criteria:**
- 4-6 spheres visible in Unity scene
- Player home planet (Starbase) clearly marked
- Enemy home planet (Hitotsu) clearly marked
- 2-4 neutral planets

---

### Step 4: Implement Story 2 - Turn System (20 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Turn System
- [ ] Implements: AFS-002
- [ ] Create "End Turn" button in Unity UI
- [ ] Hook button to TurnSystem.EndTurn()
- [ ] Display current turn number
- [ ] Test: Click button, turn increments

**Acceptance Criteria:**
- Turn counter displays (starts at Turn 1)
- End Turn button clickable
- Turn increments on click
- Console shows phase transitions

---

### Step 5: Implement Story 3 - Resource Display (15 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Resource Display
- [ ] Implements: AFS-021
- [ ] Create TextMeshPro UI for resources
- [ ] Hook to ResourceSystem events
- [ ] Test: Resources update each turn

**Acceptance Criteria:**
- Display shows: Credits, Minerals, Fuel, Food, Energy
- Starting values: 195,000 Credits, 500 Minerals, 500 Fuel, 500 Food, 500 Energy
- Resources increment each turn (based on buildings)

---

### Step 6: Implement Story 4 - Buy Screen (30 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Buy Screen
- [ ] Implements: AFS-032 (Craft), AFS-033 (Platoon)
- [ ] Create simple Buy menu UI
- [ ] Add "Buy Battle Cruiser" button (150,000 Credits, 5 turns)
- [ ] Add "Buy Platoon" button (equipment selection)
- [ ] Test: Click buy, resources deducted, entity created

**Acceptance Criteria:**
- Buy button opens menu
- Can purchase Battle Cruiser (deducts 150,000 Credits)
- Can purchase Platoon (choose equipment)
- Purchase disabled if insufficient resources
- Purchased items appear in game state

---

### Step 7: Implement Story 5 - Navigation (30 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Navigation
- [ ] Implements: AFS-014
- [ ] Click planet to select it
- [ ] Click destination planet to move ship
- [ ] Ship teleports instantly (no animation for prototype)
- [ ] Test: Ship moves from Starbase to Planet A

**Acceptance Criteria:**
- Can select planet (highlight)
- Can select ship at planet
- Click destination → ship moves (instant teleport)
- Fuel deducted from source planet
- Ship appears at destination planet

---

### Step 8: Implement Story 6 - Combat (30 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Combat
- [ ] Implements: AFS-041
- [ ] Auto-resolve combat when ship arrives at enemy planet
- [ ] Display text result: "Battle at Vulcan! You won! Enemy destroyed."
- [ ] Update planet ownership on victory
- [ ] Test: Move ship to enemy planet, combat resolves

**Acceptance Criteria:**
- Combat triggers when Battle Cruiser arrives at enemy planet
- Strength calculated (platoons × equipment × training)
- Winner determined correctly
- Text message shows result
- Planet ownership changes on victory
- Defeated platoons removed

---

### Step 9: Implement Story 7 - Victory Condition (15 min)
- [ ] Run `/bmad:bmm:workflows:dev-story` for Victory
- [ ] Check victory condition each turn end
- [ ] Display "VICTORY!" popup when all enemy planets captured
- [ ] Test: Capture all planets, see victory screen

**Acceptance Criteria:**
- Victory check runs after combat phase
- Detects when player owns all 6 planets
- Shows "VICTORY!" UI panel
- Game stops (no more End Turn clicks)

---

### Step 10: Build & Playtest (10 min build + 1 hour play)
- [ ] Final build of Overlord.Core
- [ ] Copy all 5 DLLs to Unity
- [ ] Test Unity scene loads without errors
- [ ] Press Play in Unity
- [ ] Play full game loop (2-3 complete games)

**Playtesting Goals:**
- Complete 1 game start-to-finish (Starbase → Victory)
- Note: What feels fun? What's confusing?
- Document feedback in `prototype-feedback.md`

---

### Step 11: Document Feedback (during playtesting)
- [ ] Create `design-docs/prototype-feedback.md`
- [ ] Note what feels good
- [ ] Note what's broken/confusing
- [ ] Note what's missing that feels critical
- [ ] Rate: Is core loop fun? (1-10)

**Questions to Answer:**
1. Is resource balance good? (too easy/hard to get rich?)
2. Is combat outcome clear? (who won, why?)
3. Do turns feel right pace?
4. Is ship movement satisfying?
5. Is victory condition satisfying?
6. What would make this 10× better?

---

### Step 12: Party Mode Review (30 min)
- [ ] Run `/bmad:core:workflows:party-mode`
- [ ] Invite: Game Designer, UX Designer, Dev, QA, PM
- [ ] Topic: "Prototype feedback review - Alpha roadmap"
- [ ] Input: prototype-feedback.md + observations
- [ ] Output: Prioritized Alpha/Beta feature lists

**Deliverable:** Alpha implementation plan with priorities

---

## 🚨 TROUBLESHOOTING

### If Unity won't compile:
```bash
# Rebuild Core
cd Overlord.Core
dotnet build Overlord.Core/Overlord.Core.csproj --configuration Release

# Copy ALL 5 DLLs (not just Core!)
# See: Overlord.Unity/UNITY-DLL-DEPENDENCIES.md
```

### If syntax errors in Unity scripts:
```bash
/bmad:bmm:workflows:correct-course
# Analyzes error, proposes fix
```

### If stuck on a story:
```bash
/bmad:bmm:workflows:workflow-status
# Asks "what should I do now?"
```

### If design needs review:
```bash
/bmad:core:workflows:party-mode
# Bring in expert panel
```

---

## 📊 PROGRESS TRACKER

**Completed Stories:** 0 / 7
**Setup Complete:** ✅ Sprint tracking active
**Time Elapsed:** ~15 min (setup)
**Prototype Playable:** ❌ Not yet

**Last Updated:** December 8, 2025 (14:30)

---

## 🎯 SUCCESS CRITERIA

**Prototype is "done" when:**
- ✅ Can start new game (4-6 planets generated)
- ✅ Can see resources (text display)
- ✅ Can buy Battle Cruiser (menu works)
- ✅ Can buy Platoon (equipment selection works)
- ✅ Can move ship (click planet → click destination)
- ✅ Combat auto-resolves (text result shown)
- ✅ Victory detected (all enemy planets captured)
- ✅ Full loop playable (start → win in ~30-50 turns)

**Then we gather feedback and plan Alpha!** 🚀
