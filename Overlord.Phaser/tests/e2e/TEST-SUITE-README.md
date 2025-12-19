# Overlord E2E Test Suite

## 🎯 Purpose

This comprehensive E2E test suite validates the entire Overlord game from a new user's perspective, testing:

1. **UI Discovery** - Maps all scenes, interactive elements, and navigation paths
2. **Complete Game Flow** - Validates full turn cycle and game mechanics
3. **Visual Validation** - Screenshots and visual regression testing

## 🚀 Quick Start

### Run All Discovery Tests (Recommended First)

```bash
# Discover the complete UI structure
npm run test:e2e ui-discovery.spec.ts -- --headed

# This will:
# - Map all scenes
# - Find all interactive elements
# - Document text labels and buttons
# - Create screenshots of every scene
```

### Run Complete Game Flow Tests

```bash
# Test full gameplay cycle
npm run test:e2e complete-game-flow.spec.ts -- --headed

# This will:
# - Test game boot
# - Navigate menus
# - Test keyboard shortcuts
# - Validate game state access
```

### Run All Tests

```bash
npm run test:e2e
```

## 📋 Test Files

### `ui-discovery.spec.ts`
**Purpose:** Systematically explore and document the entire UI

**What it does:**
- Maps all available scenes
- Finds all text objects and interactive elements
- Discovers clickable regions through grid search
- Attempts navigation to all scenes
- Creates comprehensive screenshots

**Expected Output:**
- Detailed console logs of UI structure
- Screenshots: `test-results/01-initial-state.png`, etc.
- JSON map of interactive elements

**Run it first to understand the UI structure!**

### `complete-game-flow.spec.ts`
**Purpose:** Validate end-to-end game functionality

**What it does:**
- Tests game boot sequence
- Validates main menu functionality
- Tests keyboard shortcuts
- Inspects game state and services
- Documents all available scenes

**Expected Output:**
- Test pass/fail for each game function
- Screenshots at each step
- Console logs of test progression

### `game-loading.spec.ts` (Existing)
**Purpose:** Basic sanity checks

**What it does:**
- Verifies game loads
- Checks Phaser canvas renders
- Validates main menu scene

## 📸 Screenshots

All screenshots are saved to `test-results/` directory:

```
test-results/
├── 01-main-menu.png
├── 02-menu-buttons.png
├── 03-flash-conflicts.png
├── 04-campaign-config.png
├── scene-galaxymapscene.png
├── scene-victoryscene.png
└── ... (and more)
```

## 🔍 Interpreting Test Output

### Discovery Test Output

```
🔍 EXPLORING: MainMenuScene
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Text Objects Found:
  "NEW CAMPAIGN" at (400, 200) [INTERACTIVE]
  "FLASH CONFLICTS" at (400, 250) [INTERACTIVE]
  "HOW TO PLAY" at (400, 300)

🖱️  Interactive Objects:
[
  {
    "type": "Text",
    "x": 400,
    "y": 200,
    "text": "NEW CAMPAIGN",
    "interactive": true
  }
]
```

This tells you:
- What text labels exist
- Where they're positioned
- Which ones are clickable

### Game Flow Test Output

```
📍 Testing: Game boot sequence
✅ Main menu loaded successfully

📍 Testing: Flash Conflicts navigation
🔎 Searching for: "FLASH CONFLICTS"
✅ Found "FLASH CONFLICTS" at position (400, 250)
✅ Clicked "FLASH CONFLICTS"
📍 Current scenes: ["FlashConflictsScene"]
```

This shows:
- Which tests pass/fail
- What actions were taken
- Scene transitions

## 🐛 Common Issues

### "Canvas not found"
**Cause:** Game hasn't loaded yet
**Solution:** Increase timeout or check dev server is running

### "Scene not active"
**Cause:** Scene requires specific game state
**Solution:** Some scenes only activate during gameplay (GalaxyMapScene, VictoryScene, etc.)

### "Could not find object with text"
**Cause:** Text doesn't match exactly or object isn't visible
**Solution:** Check screenshots to see actual text labels

## 🎨 Creating New Tests

### Basic Template

```typescript
import { test, expect } from '@playwright/test';
import { waitForPhaserGame, waitForScene } from './helpers/phaser-helpers';
import { clickByText, screenshot } from './helpers/game-helpers';

test('My test', async ({ page }) => {
  await page.goto('/');
  await waitForPhaserGame(page);
  await waitForScene(page, 'MainMenuScene');
  
  // Your test logic here
  await clickByText(page, 'MainMenuScene', 'NEW CAMPAIGN');
  
  await screenshot(page, 'my-test-result');
});
```

## 🎯 Next Steps

After running discovery tests, you'll have:

1. **Complete UI Map** - Know exactly what exists and where
2. **Screenshots** - Visual documentation of every screen
3. **Navigation Paths** - How to get from A to B programmatically

Use this information to:
- Create detailed turn cycle tests
- Build comprehensive onboarding tests
- Validate all game mechanics
- Create visual regression baselines

## 📊 Test Coverage Goals

- [ ] Main Menu navigation (all buttons)
- [ ] Flash Conflicts (tutorial) complete flow
- [ ] Campaign configuration and start
- [ ] Full turn cycle (Income → Action → Combat → End)
- [ ] Planet selection and management
- [ ] Building construction
- [ ] Spacecraft creation and movement
- [ ] Platoon commissioning
- [ ] Combat resolution
- [ ] Victory/Defeat conditions
- [ ] Keyboard shortcuts
- [ ] All UI panels and interactions

## 🤝 Contributing

When adding new tests:

1. Follow existing naming patterns
2. Use helper functions from `game-helpers.ts`
3. Add descriptive console.log statements
4. Take screenshots at key moments
5. Update this README with new test files

## 📞 Troubleshooting

**Tests won't run:**
```bash
# Make sure dev server is running
npm run start

# In another terminal
npm run test:e2e
```

**Need to see what's happening:**
```bash
# Run in headed mode (visible browser)
npm run test:e2e -- --headed

# Run in debug mode (step through)
npm run test:e2e -- --debug
```

**Want HTML report:**
```bash
# After tests run
npx playwright show-report
```

---

**Remember:** These tests serve dual purposes:
1. **Validate the code works** (automated QA)
2. **Document how to play** (living manual)

Every test you write should be readable as a "how to play" guide!
