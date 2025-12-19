# 🎮 Overlord E2E Testing: Execution Plan

## 📅 Created: December 18, 2024
## 🎯 Goal: Validate complete game flow and create living documentation

---

## 📋 What Has Been Created

### ✅ Test Files Created

1. **`ui-discovery.spec.ts`** (NEW)
   - Comprehensive UI exploration
   - Maps all scenes and interactive elements
   - Grid-based click discovery
   - ~300 second timeout for thorough exploration

2. **`complete-game-flow.spec.ts`** (NEW)
   - End-to-end game flow validation
   - Keyboard shortcut testing
   - Game state inspection
   - ~180 second timeout

3. **`game-helpers.ts`** (NEW)
   - Advanced Phaser interaction utilities
   - 15+ helper functions for game interaction
   - Text-based object finding
   - Scene transition management

4. **`run-e2e-tests.js`** (NEW)
   - Custom test runner script
   - Enhanced logging
   - Screenshot organization

5. **`TEST-SUITE-README.md`** (NEW)
   - Complete documentation
   - Usage guide
   - Troubleshooting

### ✅ Existing Files
- `game-loading.spec.ts` - Basic sanity tests
- `phaser-helpers.ts` - Core Phaser utilities
- `playwright.config.ts` - Test configuration

---

## 🚀 Execution Steps

### **PHASE 1: Discovery (Run This First!)**

#### Step 1: Start the dev server
```bash
cd C:\dev\GIT\Overlord\Overlord.Phaser
npm run start
```
Wait for: `Server running at http://localhost:8080`

#### Step 2: Run UI Discovery (in a new terminal)
```bash
cd C:\dev\GIT\Overlord\Overlord.Phaser
npm run test:e2e ui-discovery.spec.ts -- --headed
```

**What to watch for:**
- Browser opens and navigates to game
- Console shows detailed object discovery
- Screenshots saved to `test-results/`
- Test finds all menu buttons and text

**Expected Duration:** 3-5 minutes

**Expected Output:**
```
🔍 STARTING COMPREHENSIVE UI DISCOVERY
═══════════════════════════════════════════════════════════════

🎮 Game State:
{
  "isBooted": true,
  "scenes": ["MainMenuScene", "GalaxyMapScene", ...],
  ...
}

📋 Available Scenes:
  ● MainMenuScene (5 children)
  ○ GalaxyMapScene (0 children)
  ...

📝 Text Objects Found:
  "NEW CAMPAIGN" at (400, 200) [INTERACTIVE]
  "FLASH CONFLICTS" at (400, 250) [INTERACTIVE]
  ...
```

#### Step 3: Review Discovery Results

Check `test-results/` folder for:
- `01-initial-state.png` - Main menu
- `02-main-menu-annotated.png` - Detailed view
- `03-after-flash-conflicts-click.png` - Navigation result
- `scene-*.png` - Each scene explored

Review console output to find:
- Exact button positions
- Interactive element coordinates
- Text labels and their locations

---

### **PHASE 2: Complete Flow Testing**

#### Step 4: Run Complete Game Flow
```bash
npm run test:e2e complete-game-flow.spec.ts -- --headed
```

**What this tests:**
- Game boot sequence
- Main menu functionality
- Keyboard shortcuts (Space, Enter, Escape, H)
- Scene enumeration
- Game state access

**Expected Issues to Find:**
- Missing button interactions
- Scene transition problems
- Keyboard shortcuts not working
- UI elements not properly exposed

---

### **PHASE 3: Analysis and Iteration**

#### Step 5: Analyze Test Results

Open Playwright HTML report:
```bash
npx playwright show-report
```

**Key Questions:**
1. ✅ Did all tests pass?
2. ❌ Which tests failed?
3. 🔍 What UI elements were NOT found?
4. 📸 Do screenshots show expected UI?

#### Step 6: Document Findings

Create a findings document:

```markdown
# Test Run Findings - [Date]

## ✅ What Works
- Game boots successfully
- Main menu renders
- [Add what passed]

## ❌ Issues Found
- [ ] Button X not clickable
- [ ] Scene Y doesn't transition
- [ ] Keyboard shortcut Z doesn't work

## 🔧 Required Fixes
1. Fix button click handlers
2. Expose game state for testing
3. Add missing keyboard listeners

## 📝 Next Tests to Write
- [ ] Full turn cycle
- [ ] Planet management
- [ ] Combat resolution
```

---

## 🎯 What You Should See (Ideal Scenario)

### If Everything Works:

```
✅ 1.1 - Game boots and displays Main Menu
   Main menu loaded successfully

✅ 1.2 - Main Menu buttons are functional
   Menu scene active with interactive elements

✅ 2.1 - Navigate to Flash Conflicts
   Found "FLASH CONFLICTS" at position (400, 250)
   Clicked "FLASH CONFLICTS"
   Current scenes: ["FlashConflictsScene"]

✅ 2.3 - Test keyboard shortcuts
   Keyboard shortcuts tested
   
✅ All tests passed! (6/6)
```

### If There Are Issues (Expected on First Run):

```
✅ 1.1 - Game boots and displays Main Menu
   Main menu loaded successfully

❌ 1.2 - Main Menu buttons are functional
   Error: Interactive elements not found

⚠️  2.1 - Navigate to Flash Conflicts
   Could not find object with text: "FLASH CONFLICTS"
   Attempting grid-based click search...
   
   CLICKABLE REGION FOUND at (405, 256)
   Scene changed: ["MainMenuScene"] → ["FlashConflictsScene"]
   
✅ 2.3 - Test keyboard shortcuts
   Keyboard shortcuts tested

❌ 2 tests failed, 4 passed
```

**This is GOOD!** It tells us:
- Buttons exist but aren't exposed to tests properly
- We found the clickable region through grid search
- We know exact coordinates to use

---

## 🔧 Debugging Failed Tests

### Issue: "Could not find object with text"

**Cause:** Text object not visible or different text than expected

**Solution:**
1. Check screenshot to see actual text
2. Update search term in test
3. Check if object is hidden/behind other objects

### Issue: "Canvas not found"

**Cause:** Game hasn't loaded yet

**Solution:**
1. Increase timeout in test
2. Add `await page.waitForTimeout(2000)` before interaction
3. Check dev server is running

### Issue: "Scene not active"

**Cause:** Scene requires game state we haven't reached

**Solution:**
1. Navigate through proper flow (Main Menu → Config → Game)
2. Check if scene is started conditionally
3. Use programmatic scene.start() for exploration

---

## 📊 Next Steps After Phase 1-3

### Create Turn Cycle Test

Once you know the UI structure, create:

**`turn-cycle.spec.ts`**
```typescript
test('Complete turn cycle', async ({ page }) => {
  // 1. Load game
  await page.goto('/');
  await waitForPhaserGame(page);
  
  // 2. Start campaign
  await clickByText(page, 'MainMenuScene', 'NEW CAMPAIGN');
  await clickByText(page, 'CampaignConfigScene', 'START');
  
  // 3. Wait for galaxy map
  await waitForScene(page, 'GalaxyMapScene');
  
  // 4. Select a planet
  await clickPlanetByName(page, 'Alpha');
  
  // 5. Build a structure
  await clickByText(page, 'GalaxyMapScene', 'BUILD');
  await clickByText(page, 'BuildPanel', 'Mining Station');
  
  // 6. Advance turn
  await advanceTurn(page);
  
  // 7. Verify income phase
  // ... and so on
});
```

---

## 🎮 Manual Playthrough (Phase 2 of Original Plan)

After automated tests work, you will:

1. **Play the game yourself** while I watch (via screenshots/screen share)
2. **Validate logic** - Does the game actually work as designed?
3. **Learn the system** - First-hand experience with full game flow
4. **Document edge cases** - Find issues automation missed

This creates the **complete feedback loop:**
```
Automated Tests → Find UI bugs → Fix them →
Manual Play → Validate logic → Find gameplay bugs → Fix them →
Update Tests → Repeat
```

---

## 📝 Deliverables Checklist

### Phase 1: Programmatic Testing (Current)
- [x] Create UI discovery tests
- [x] Create game flow tests  
- [x] Create helper utilities
- [x] Create documentation
- [ ] **RUN TESTS AND ANALYZE RESULTS** ← YOU ARE HERE
- [ ] Fix discovered issues
- [ ] Create turn cycle tests
- [ ] Create full gameplay tests

### Phase 2: Manual Playthrough (Next)
- [ ] Play Flash Conflicts tutorial
- [ ] Play full campaign
- [ ] Document every UI interaction
- [ ] Validate game logic
- [ ] Create procedural manual

### Phase 3: Complete Documentation
- [ ] Screenshot-annotated manual
- [ ] Click-by-click guide
- [ ] Video walkthrough (optional)
- [ ] Alpha tester guide v2

---

## ✅ Action Items for VS7

### Right Now:
1. Open terminal in `C:\dev\GIT\Overlord\Overlord.Phaser`
2. Run `npm run start` (keep this running)
3. Open new terminal
4. Run `npm run test:e2e ui-discovery.spec.ts -- --headed`
5. Watch the browser and console output
6. Review screenshots in `test-results/`

### After First Test Run:
7. Share results with me:
   - Did tests pass/fail?
   - What did console output show?
   - What do screenshots look like?
8. We'll analyze together and iterate

### Goal:
By end of this session:
- ✅ Know exact UI structure
- ✅ Have working discovery tests
- ✅ Understand what needs fixing
- ✅ Have roadmap for turn cycle tests

---

## 🚨 Important Notes

**These tests are discovering your UI, not validating it yet!**

The first run will likely show:
- ❌ Some tests fail (expected!)
- ⚠️  Some elements not found (expected!)
- ✅ Some tests pass (game loads, scenes exist)

**This is the GOAL of Phase 1:**
- Find what works
- Find what doesn't
- Map the entire UI
- Create a baseline

Then we iterate to make everything green! ✅

---

**Ready to run? Start with Step 1 above!** 🚀
