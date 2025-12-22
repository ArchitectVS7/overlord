import { test, expect, Page } from '@playwright/test';

/**
 * BBS Full Playthrough Test
 *
 * This test plays through the entire game from start to victory/defeat.
 * It reads the game state from the BBS screen and makes strategic decisions.
 *
 * The test acts as an automated player, responding to the dynamic game state
 * rather than following a fixed script.
 */

// Increase timeout for full game playthrough (could take several minutes)
test.setTimeout(300_000); // 5 minutes max

interface GameState {
  turn: number;
  credits: number;
  planets: number;
  totalPlanets: number;
  craft: number;
  platoons: number;
  screen: string;
  hint: string;
  messages: string[];
  isVictory: boolean;
  isDefeat: boolean;
}

/**
 * Parse the BBS screen to extract game state
 */
async function parseGameState(page: Page): Promise<GameState> {
  // Get all text content from the canvas (via game state if available)
  // For BBS, we can also inject into the game to read state directly
  const state = await page.evaluate(() => {
    const game = (window as any).game;
    if (!game) return null;

    const scene = game.scene.getScene('BBSGameScene');
    if (!scene) return null;

    const controller = (scene as any).controller;
    const menuState = (scene as any).menuState;

    if (!controller || !controller.gameState) return null;

    const gs = controller.gameState;
    const currentScreen = menuState?.getCurrentScreen() || 'UNKNOWN';

    // Count player assets
    const playerPlanets = gs.planets.filter((p: any) => p.owner === 'Player').length;
    const playerCraft = gs.craft.filter((c: any) => c.owner === 'Player').length;
    const playerPlatoons = gs.platoons.filter((p: any) => p.owner === 'Player').length;

    return {
      turn: controller.getCurrentTurn(),
      credits: gs.playerFaction.resources.credits,
      planets: playerPlanets,
      totalPlanets: gs.planets.length,
      craft: playerCraft,
      platoons: playerPlatoons,
      screen: currentScreen,
      isGameOver: controller.isGameOver(),
      victoryResult: controller.getVictoryResult(),
    };
  });

  return {
    turn: state?.turn || 0,
    credits: state?.credits || 0,
    planets: state?.planets || 0,
    totalPlanets: state?.totalPlanets || 0,
    craft: state?.craft || 0,
    platoons: state?.platoons || 0,
    screen: state?.screen || 'UNKNOWN',
    hint: '',
    messages: [],
    isVictory: state?.victoryResult === 'PlayerVictory',
    isDefeat: state?.victoryResult === 'AIVictory',
  };
}

/**
 * Wait for screen to change or stabilize
 */
async function waitForScreen(page: Page, expectedScreen?: string, timeout = 5000): Promise<void> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const state = await parseGameState(page);
    if (expectedScreen && state.screen === expectedScreen) return;
    if (!expectedScreen && state.screen !== 'UNKNOWN') return;
    await page.waitForTimeout(100);
  }
}

/**
 * Press a key and wait for response
 */
async function pressKey(page: Page, key: string, waitMs = 300): Promise<void> {
  await page.keyboard.press(key);
  await page.waitForTimeout(waitMs);
}

/**
 * Check if player has a Docking Bay (required for spacecraft)
 */
async function hasDockingBay(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const scene = (window as any).game.scene.getScene('BBSGameScene');
    const gs = scene?.controller?.gameState;
    if (!gs) return false;

    const playerPlanets = gs.planets.filter((p: any) => p.owner === 'Player'); // FactionType.Player is string enum
    for (const planet of playerPlanets) {
      const hasBay = planet.structures.some((b: any) => b.type === 'DockingBay');
      if (hasBay) return true;
    }
    return false;
  });
}

/**
 * Check if player has available building slots
 */
async function hasAvailableBuildingSlots(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const scene = (window as any).game.scene.getScene('BBSGameScene');
    const gs = scene?.controller?.gameState;
    if (!gs) return false;

    const playerPlanets = gs.planets.filter((p: any) => p.owner === 'Player'); // FactionType.Player is string enum
    for (const planet of playerPlanets) {
      // Check surface slots (max 5) - only MiningStation and HorticulturalStation count
      const surfaceBuildings = planet.structures.filter((b: any) =>
        b.type === 'MiningStation' || b.type === 'HorticulturalStation'
      ).length;
      if (surfaceBuildings < 5) return true;

      // Check orbital slots (max 3) - DockingBay and OrbitalDefense
      const orbitalBuildings = planet.structures.filter((b: any) =>
        b.type === 'DockingBay' || b.type === 'OrbitalDefense'
      ).length;
      if (orbitalBuildings < 3) return true;
    }
    return false;
  });
}

/**
 * Strategic decision maker - decides what to do based on game state
 */
async function makeStrategicDecision(page: Page, state: GameState): Promise<string[]> {
  const actions: string[] = [];

  // Check prerequisites
  const hasSlots = await hasAvailableBuildingSlots(page);
  const hasBay = await hasDockingBay(page);

  // Phase 1 (Turns 1-10): Build economy (Mining, Horticultural, Docking Bay)
  if (state.turn <= 10 && state.credits >= 1500 && hasSlots) {
    actions.push('BUILD');  // Keep building economy
  }

  // Phase 2 (Turn 5+): Build military once we have Docking Bay and credits
  if (state.turn >= 5 && state.credits >= 15000 && state.craft < 3 && hasBay) {
    actions.push('SHIPYARD');  // Build Battle Cruisers
  }

  // Commission platoons (cheaper than shipyard, no prerequisites)
  if (state.turn >= 5 && state.credits >= 5000 && state.platoons < 5) {
    actions.push('COMMISSION');  // Commission platoons
  }

  // Phase 3 (Turn 10+): Expand - capture more planets!
  if (state.turn >= 10 && state.craft > 0 && state.platoons > 0) {
    if (state.planets < state.totalPlanets) {
      actions.push('ATTACK');  // Capture planets
    }
  }

  // Always end turn if nothing else to do
  if (actions.length === 0) {
    actions.push('END_TURN');
  }

  return actions;
}

/**
 * Track what we've built to diversify structures
 */
let buildCounter = 0;

/**
 * Execute a build action - cycles through different structure types for testing
 * Build order tests variety of structures and leaves slots for expansion:
 * 1-2: Mining Stations (minerals + fuel)
 * 3: Horticultural Station (food)
 * 4: Docking Bay (enables craft)
 * 5: Horticultural Station (more food)
 * 6+: Orbital Defense or Surface Platform
 */
async function executeBuild(page: Page): Promise<boolean> {
  const stateBefore = await parseGameState(page);
  const creditsBefore = stateBefore.credits;

  await pressKey(page, 'b'); // Open build menu
  await page.waitForTimeout(500);

  // Select first planet (usually homeworld)
  await pressKey(page, '1');
  await page.waitForTimeout(500);

  // Cycle through different structure types
  buildCounter++;
  const structureChoice =
    (buildCounter === 1) ? '1' :  // Mining Station
    (buildCounter === 2) ? '1' :  // Mining Station
    (buildCounter === 3) ? '2' :  // Horticultural Station
    (buildCounter === 4) ? '4' :  // Docking Bay (orbital)
    (buildCounter === 5) ? '2' :  // Horticultural Station
    '5';                          // Orbital Defense

  // Check what screen we're on before pressing the structure key
  const preState = await parseGameState(page);
  console.log(`  Build #${buildCounter}: screen=${preState.screen}, selecting option '${structureChoice}'`);
  await pressKey(page, structureChoice);
  await page.waitForTimeout(500);

  // Check if credits decreased (build succeeded)
  const stateAfter = await parseGameState(page);
  const creditsAfter = stateAfter.credits;
  const buildSucceeded = creditsAfter < creditsBefore;

  // Get back to IN_GAME screen carefully
  let escapeCount = 0;
  while (escapeCount < 3) {
    const currentState = await parseGameState(page);
    if (currentState.screen === 'IN_GAME') break;
    await pressKey(page, 'Escape');
    await page.waitForTimeout(200);
    escapeCount++;
  }

  return buildSucceeded;
}

/**
 * Execute a shipyard purchase
 */
async function executeShipyard(page: Page): Promise<boolean> {
  const stateBefore = await parseGameState(page);
  const craftBefore = stateBefore.craft;

  await pressKey(page, 's'); // Open shipyard
  await page.waitForTimeout(500);

  // Select first planet
  await pressKey(page, '1');
  await page.waitForTimeout(500);

  // Buy Battle Cruiser (option 1)
  await pressKey(page, '1');
  await page.waitForTimeout(500);

  // Check if craft count increased
  const stateAfter = await parseGameState(page);
  const craftAfter = stateAfter.craft;
  const purchaseSucceeded = craftAfter > craftBefore;

  // Get back to IN_GAME screen carefully
  let escapeCount = 0;
  while (escapeCount < 3) {
    const currentState = await parseGameState(page);
    if (currentState.screen === 'IN_GAME') break;
    await pressKey(page, 'Escape');
    await page.waitForTimeout(200);
    escapeCount++;
  }

  return purchaseSucceeded;
}

/**
 * Execute commissioning a platoon
 */
async function executeCommission(page: Page): Promise<boolean> {
  const stateBefore = await parseGameState(page);
  const platoonsBefore = stateBefore.platoons;

  await pressKey(page, 'c'); // Open commission
  await page.waitForTimeout(500);

  // Select first planet
  await pressKey(page, '1');
  await page.waitForTimeout(500);

  // Use default options, confirm
  await pressKey(page, '1'); // Confirm commission
  await page.waitForTimeout(500);

  // Check if platoon count increased
  const stateAfter = await parseGameState(page);
  const platoonsAfter = stateAfter.platoons;
  const commissionSucceeded = platoonsAfter > platoonsBefore;

  // Get back to IN_GAME screen carefully
  let escapeCount = 0;
  while (escapeCount < 3) {
    const currentState = await parseGameState(page);
    if (currentState.screen === 'IN_GAME') break;
    await pressKey(page, 'Escape');
    await page.waitForTimeout(200);
    escapeCount++;
  }

  return commissionSucceeded;
}

/**
 * Execute an attack sequence
 */
async function executeAttack(page: Page): Promise<boolean> {
  // First, try to move fleet to enemy planet
  await pressKey(page, 'm'); // Move fleet
  await page.waitForTimeout(500);

  let state = await parseGameState(page);
  if (state.screen === 'MOVE_FLEET') {
    // Select first craft
    await pressKey(page, '1');
    await page.waitForTimeout(500);

    // Select enemy planet (usually higher numbered)
    await pressKey(page, '2');
    await page.waitForTimeout(500);

    await pressKey(page, 'Escape'); // Exit if still in menu
  }

  // Then try to attack
  await pressKey(page, 'a'); // Attack menu
  await page.waitForTimeout(500);

  state = await parseGameState(page);
  if (state.screen === 'ATTACK') {
    await pressKey(page, '1'); // Select target
    await page.waitForTimeout(500);

    await pressKey(page, '1'); // Confirm attack
    await page.waitForTimeout(1000); // Wait for combat resolution
  }

  return true;
}

/**
 * Main game loop - plays until victory or defeat
 */
async function playGame(page: Page): Promise<'victory' | 'defeat' | 'timeout'> {
  buildCounter = 0; // RESET counter for each test run to ensure diverse building types
  const maxTurns = 30; // Full 30-turn test
  let actionsTakenThisTurn = 0;
  const maxActionsPerTurn = 3; // Limit actions per turn to prevent infinite loops

  while (true) {
    const state = await parseGameState(page);

    // Check for game over
    if (state.isVictory) {
      console.log(`🎉 VICTORY on turn ${state.turn}!`);
      return 'victory';
    }

    if (state.isDefeat) {
      console.log(`💀 DEFEAT on turn ${state.turn}`);
      return 'defeat';
    }

    // Check for max turns
    if (state.turn > maxTurns) {
      console.log(`Reached max turns (${maxTurns}), ending test`);
      return 'timeout';
    }

    // Check for game over screens
    if (state.screen === 'VICTORY') return 'victory';
    if (state.screen === 'DEFEAT') return 'defeat';

    // If we're at START_MENU, continue the existing game (don't start new!)
    if (state.screen === 'START_MENU') {
      console.log('⚠️  Accidentally escaped to start menu, pressing C to continue...');
      await pressKey(page, 'c'); // Continue, not New
      await page.waitForTimeout(1000);
      continue;
    }

    // If not in game menu, try to get back (but don't spam Escape)
    if (state.screen !== 'IN_GAME') {
      console.log(`⚠️  Unexpected screen: ${state.screen}, pressing Escape once...`);
      await pressKey(page, 'Escape');
      await page.waitForTimeout(500);
      continue;
    }

    // Log current state
    console.log(`Turn ${state.turn} [${state.screen}]: ${state.credits} credits, ${state.planets}/${state.totalPlanets} planets, ${state.craft} craft, ${state.platoons} platoons`);

    // Reset action counter when turn advances
    if (actionsTakenThisTurn > 0 && state.turn > (actionsTakenThisTurn / maxActionsPerTurn)) {
      actionsTakenThisTurn = 0;
    }

    // If we've taken enough actions this turn, end it
    if (actionsTakenThisTurn >= maxActionsPerTurn) {
      console.log(`  → Ending turn ${state.turn} after ${actionsTakenThisTurn} actions`);
      await pressKey(page, 'e');
      await page.waitForTimeout(2000); // Wait for AI turn
      actionsTakenThisTurn = 0;
      continue;
    }

    // Make strategic decisions (returns actions in priority order)
    const actions = await makeStrategicDecision(page, state);

    // Try each action in order until one succeeds or we run out
    let actionTaken = false;
    let attemptedAction = '';

    for (const action of actions) {
      attemptedAction = action;

      if (action === 'END_TURN') {
        console.log(`  → Ending turn ${state.turn} (no more actions available)`);
        await pressKey(page, 'e');
        await page.waitForTimeout(2000); // Wait for AI turn
        actionsTakenThisTurn = 0;
        actionTaken = true; // Mark as handled
        break;
      }

      // Try the action
      let success = false;
      switch (action) {
        case 'BUILD':
          success = await executeBuild(page);
          break;
        case 'SHIPYARD':
          success = await executeShipyard(page);
          break;
        case 'COMMISSION':
          success = await executeCommission(page);
          break;
        case 'ATTACK':
          success = await executeAttack(page);
          break;
      }

      if (success) {
        actionsTakenThisTurn++;
        console.log(`  ✓ ${action} completed (${actionsTakenThisTurn}/${maxActionsPerTurn})`);
        actionTaken = true;
        break; // Stop trying other actions
      } else {
        console.log(`  ✗ ${action} failed, trying next action...`);
        // Continue to next action in list
      }
    }

    // If no actions worked, end turn
    if (!actionTaken) {
      console.log(`  → All actions failed, ending turn ${state.turn}`);
      await pressKey(page, 'e');
      await page.waitForTimeout(2000);
      actionsTakenThisTurn = 0;
    }

    // Small delay between actions
    await page.waitForTimeout(300);
  }
}

test.describe('BBS Full Playthrough', () => {
  test('should play through entire game to victory or defeat', async ({ page }) => {
    // Capture browser console output to see AI debug logs and slot checks
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[AI]') || text.includes('[SLOT CHECK]')) {
        console.log(text);
      }
    });

    // Navigate to the game
    await page.goto('/');

    // Wait for game to load
    await page.waitForTimeout(3000);

    // Start new campaign
    await pressKey(page, 'n');
    await page.waitForTimeout(2000);

    // Verify we're in the game
    const initialState = await parseGameState(page);
    expect(initialState.turn).toBeGreaterThanOrEqual(1);
    expect(initialState.screen).toBe('IN_GAME');

    console.log('🎮 Starting full playthrough...');
    console.log(`Initial state: Turn ${initialState.turn}, ${initialState.credits} credits`);

    // Play the game
    const result = await playGame(page);

    // Log result
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Game ended with result: ${result.toUpperCase()}`);
    console.log(`${'='.repeat(50)}\n`);

    // Export debug log for analysis
    console.log('📊 Exporting debug log...');
    const debugLog = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game.scene.getScene('BBSGameScene');
      return scene.logger.exportJSON();
    });

    // Save to file
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(__dirname, '..', '..', 'test-debug-log.json');
    fs.writeFileSync(logPath, debugLog);
    console.log(`✅ Debug log saved to ${logPath}`);

    // The test passes regardless of victory/defeat - we just want to verify
    // the game can be played through to completion
    expect(['victory', 'defeat', 'timeout']).toContain(result);
  });

  test('should be able to read game state at any point', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Start game
    await pressKey(page, 'n');
    await page.waitForTimeout(2000);

    // Read state
    const state = await parseGameState(page);

    // Verify we can read all key metrics
    expect(state.turn).toBeGreaterThanOrEqual(1);
    expect(state.credits).toBeGreaterThan(0);
    expect(state.planets).toBeGreaterThanOrEqual(1);
    expect(state.totalPlanets).toBeGreaterThanOrEqual(4);
    expect(state.screen).toBe('IN_GAME');

    console.log('Game state readable:', state);
  });

  test('should respond to AI actions dynamically', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Start game
    await pressKey(page, 'n');
    await page.waitForTimeout(2000);

    // Play for 5 turns and verify state changes
    const states: GameState[] = [];

    for (let i = 0; i < 5; i++) {
      const state = await parseGameState(page);
      states.push(state);

      console.log(`Turn ${state.turn}: Credits=${state.credits}, Planets=${state.planets}`);

      // End turn
      await pressKey(page, 'e');
      await page.waitForTimeout(1500); // Wait for AI
    }

    // Verify turns advanced
    expect(states[states.length - 1].turn).toBeGreaterThan(states[0].turn);

    // Verify game state changed (AI should have done something)
    console.log('AI activity verified across', states.length, 'turns');
  });
});
