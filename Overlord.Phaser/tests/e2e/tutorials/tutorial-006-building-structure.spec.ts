/**
 * E2E Test: Tutorial T06 - Building a Structure (Foundation of Empire)
 *
 * Tests the complete player journey through the building tutorial:
 * 1. Navigate to Tutorials menu from Main Menu
 * 2. Select "Foundation of Empire" tutorial from the list
 * 3. Click Start Scenario
 * 4. Click on planet to open Planet Info Panel
 * 5. Click Build button to open Build Menu
 * 6. Click Mining Station to start construction
 * 7. Verify victory condition triggers
 *
 * Note: T06 has a prerequisite (T03). The test sets localStorage to mark T03 as complete.
 *
 * All interactions are done via actual UI clicks, not programmatic callbacks.
 *
 * @see design-docs/tutorials/TUTORIAL-ELEMENTS-LIST.md
 * @see design-docs/tutorials/TUTORIAL-METHODOLOGY.md
 */

import { test, expect } from '@playwright/test';
import {
  waitForPhaserGame,
  waitForScene,
  clickCanvasAt,
  getPhaserCanvas,
} from '../helpers/phaser-helpers';

// Screen coordinates for 1024x768 canvas
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

// Main Menu button positions
const MAIN_MENU = {
  CENTER_X: CANVAS_WIDTH / 2, // 512
  TUTORIALS_Y: CANVAS_HEIGHT * 0.45 + 70 * 2, // 485.6
};

// ScenarioListPanel positions (600x500 panel, centered)
const SCENARIO_LIST = {
  // Third card center Y (T06 is third after T03, T05)
  // Each card: height=80, spacing=10
  THIRD_CARD_Y: (CANVAS_HEIGHT - 500) / 2 + 20 + 50 + 40 + 80 + 10 + 80 + 10, // ~424
};

// ScenarioDetailPanel positions (500x520 panel, centered)
const SCENARIO_DETAIL = {
  START_BUTTON_X: (CANVAS_WIDTH - 500) / 2 + 500 / 2 - 180 - 10 + 90, // ~352
  START_BUTTON_Y: (CANVAS_HEIGHT - 520) / 2 + 520 - 20 - 40 - 20 + 20, // ~584
};

// ScenarioGameScene positions
const GAME_SCENE = {
  // Player planet is centered at (512, 384) in ScenarioInitializer
  PLANET_X: 512,
  PLANET_Y: 384,
};

// PlanetInfoPanel positions (280x500 panel, right side)
const PLANET_INFO = {
  PANEL_WIDTH: 280,
  PANEL_X: CANVAS_WIDTH - 280 - 20, // 724
  PANEL_Y: (CANVAS_HEIGHT - 500) / 2, // 134
  PADDING: 16,
  // Build button: first button in actions section at Y = 365
  BUILD_BUTTON_X: CANVAS_WIDTH - 280 - 20 + 16 + 57.5, // ~797.5
  BUILD_BUTTON_Y: (CANVAS_HEIGHT - 500) / 2 + 16 + 365 + 18, // ~533
};

// BuildingMenuPanel positions (400x450 panel, centered)
const BUILD_MENU = {
  PANEL_X: CANVAS_WIDTH / 2, // 512
  PANEL_Y: CANVAS_HEIGHT / 2, // 384
  BUTTON_START_Y: CANVAS_HEIGHT / 2 - 140, // 244
  BUTTON_HEIGHT: 70,
  BUTTON_SPACING: 10,
  // Mining Station is first (index 0)
  MINING_STATION_Y: CANVAS_HEIGHT / 2 - 140, // 244
  // Horticultural Station (index 1)
  HORT_STATION_Y: CANVAS_HEIGHT / 2 - 140 + 80, // 324
  // Surface Platform (index 4) - cheapest option
  SURFACE_PLATFORM_Y: CANVAS_HEIGHT / 2 - 140 + 4 * 80, // 564
};

// Helper to mark prerequisite tutorials as complete
async function markTutorialComplete(page: any, tutorialId: string): Promise<void> {
  await page.evaluate((id: string) => {
    const storageKey = 'overlord_scenario_completions';
    let completions: Record<string, unknown> = {};
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        completions = JSON.parse(existing);
      }
    } catch (e) {
      // Ignore parse errors
    }
    completions[id] = {
      scenarioId: id,
      completed: true,
      bestTimeSeconds: 60,
      starRating: 3,
      attempts: 1,
      completedAt: Date.now(),
    };
    localStorage.setItem(storageKey, JSON.stringify(completions));
  }, tutorialId);
}

// Wait for Action phase in ScenarioGameScene
async function waitForScenarioActionPhase(page: any, timeout = 30000): Promise<void> {
  await page.waitForFunction(
    () => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentPhase?: string };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return scene?.gameState?.currentPhase === 'Action';
    },
    { timeout }
  );
}

test.describe('Tutorial T06: Building a Structure - Foundation of Empire (Click Journey)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);

    // Mark prerequisite (T03) as complete
    await markTutorialComplete(page, 'tutorial-003-planet-selection');

    await waitForScene(page, 'MainMenuScene');
    await page.waitForTimeout(500);
  });

  test('complete full tutorial journey via UI clicks', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // ========== STEP 1: Click TUTORIALS button in main menu ==========
    console.log('Step 1: Navigating to Tutorials');
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'TutorialsScene', 5000);

    await page.screenshot({ path: 'test-results/t06-journey-01-tutorials-scene.png' });

    // ========== STEP 2: Click third tutorial card (Foundation of Empire / T06) ==========
    // T03 is first, T05 is second, T06 is third
    console.log(`Step 2: Clicking third tutorial card at (${MAIN_MENU.CENTER_X}, ${SCENARIO_LIST.THIRD_CARD_Y})`);
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.THIRD_CARD_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t06-journey-02-detail-panel.png' });

    // Verify detail panel is visible
    const isDetailVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              detailPanel?: { visible?: boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('TutorialsScene');
      return scene?.detailPanel?.visible === true;
    });
    expect(isDetailVisible).toBe(true);

    // ========== STEP 3: Click Start Scenario button ==========
    console.log('Step 3: Clicking Start Scenario');
    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await page.waitForTimeout(2000);

    // Verify ScenarioGameScene is active
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.screenshot({ path: 'test-results/t06-journey-03-game-scene.png' });

    // ========== STEP 4: Dismiss objectives panel ==========
    await page.waitForTimeout(1500);
    console.log('Step 4: Dismissing objectives panel');
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await page.waitForTimeout(1500);

    // Wait for Action phase
    await waitForScenarioActionPhase(page, 10000);
    await page.screenshot({ path: 'test-results/t06-journey-04-action-phase.png' });

    // ========== STEP 5: Click on the player planet ==========
    console.log(`Step 5: Clicking planet at (${GAME_SCENE.PLANET_X}, ${GAME_SCENE.PLANET_Y})`);
    await clickCanvasAt(page, GAME_SCENE.PLANET_X, GAME_SCENE.PLANET_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t06-journey-05-planet-clicked.png' });

    // Verify planet info panel opened
    const isPlanetPanelVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              planetInfoPanel?: { visible?: boolean; isVisible?: boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return scene?.planetInfoPanel?.visible === true || scene?.planetInfoPanel?.isVisible === true;
    });
    expect(isPlanetPanelVisible).toBe(true);

    // ========== STEP 6: Click Build button ==========
    console.log(`Step 6: Clicking Build button at (${PLANET_INFO.BUILD_BUTTON_X}, ${PLANET_INFO.BUILD_BUTTON_Y})`);
    await clickCanvasAt(page, PLANET_INFO.BUILD_BUTTON_X, PLANET_INFO.BUILD_BUTTON_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t06-journey-06-build-menu.png' });

    // Verify build menu is visible
    const isBuildMenuVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              buildingMenuPanel?: { visible?: boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return scene?.buildingMenuPanel?.visible === true;
    });
    expect(isBuildMenuVisible).toBe(true);

    // ========== STEP 7: Click Mining Station button ==========
    console.log(`Step 7: Clicking Mining Station at (${BUILD_MENU.PANEL_X}, ${BUILD_MENU.MINING_STATION_Y})`);
    await clickCanvasAt(page, BUILD_MENU.PANEL_X, BUILD_MENU.MINING_STATION_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t06-journey-07-construction-started.png' });

    // ========== STEP 8: Verify victory condition triggered ==========
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/t06-journey-08-victory.png' });

    const isVictoryAchieved = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              victoryConditionSystem?: { isVictoryAchieved?: () => boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return scene?.victoryConditionSystem?.isVictoryAchieved?.() === true;
    });
    expect(isVictoryAchieved).toBe(true);

    console.log('Tutorial T06 completed successfully via UI clicks!');
  });

  test('clicking Build button opens BuildingMenuPanel', async ({ page }) => {
    // Navigate to T06 and start scenario
    await markTutorialComplete(page, 'tutorial-003-planet-selection');

    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.THIRD_CARD_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.waitForTimeout(1500);

    // Dismiss objectives
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await waitForScenarioActionPhase(page, 10000);
    await page.waitForTimeout(500);

    // Click planet
    await clickCanvasAt(page, GAME_SCENE.PLANET_X, GAME_SCENE.PLANET_Y);
    await page.waitForTimeout(500);

    // Verify planet info panel is open
    let isPanelVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              planetInfoPanel?: { visible?: boolean };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.planetInfoPanel?.visible === true;
    });
    expect(isPanelVisible).toBe(true);

    // Click Build button
    await clickCanvasAt(page, PLANET_INFO.BUILD_BUTTON_X, PLANET_INFO.BUILD_BUTTON_Y);
    await page.waitForTimeout(500);

    // Verify build menu is visible
    const isBuildMenuVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              buildingMenuPanel?: { visible?: boolean };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.buildingMenuPanel?.visible === true;
    });
    expect(isBuildMenuVisible).toBe(true);

    await page.screenshot({ path: 'test-results/t06-build-menu-opened.png' });
  });

  test('clicking building option starts construction', async ({ page }) => {
    // Navigate to T06 and open build menu
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.THIRD_CARD_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.waitForTimeout(1500);

    // Dismiss objectives
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await waitForScenarioActionPhase(page, 10000);
    await page.waitForTimeout(500);

    // Get initial credits
    const creditsBefore = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { playerFaction?: { resources?: { credits: number } } };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.gameState?.playerFaction?.resources?.credits;
    });

    // Click planet -> Build -> Mining Station
    await clickCanvasAt(page, GAME_SCENE.PLANET_X, GAME_SCENE.PLANET_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, PLANET_INFO.BUILD_BUTTON_X, PLANET_INFO.BUILD_BUTTON_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, BUILD_MENU.PANEL_X, BUILD_MENU.MINING_STATION_Y);
    await page.waitForTimeout(500);

    // Get credits after (Mining Station costs 8000 credits)
    const creditsAfter = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { playerFaction?: { resources?: { credits: number } } };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.gameState?.playerFaction?.resources?.credits;
    });

    // Resources should have been deducted
    expect(creditsAfter).toBeLessThan(creditsBefore || 0);
    console.log(`Credits before: ${creditsBefore}, after: ${creditsAfter}`);

    await page.screenshot({ path: 'test-results/t06-construction-started.png' });
  });

  test('building menu closes after selecting a building', async ({ page }) => {
    // Navigate to T06 and open build menu
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.THIRD_CARD_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.waitForTimeout(1500);

    // Dismiss objectives
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await waitForScenarioActionPhase(page, 10000);
    await page.waitForTimeout(500);

    // Open build menu
    await clickCanvasAt(page, GAME_SCENE.PLANET_X, GAME_SCENE.PLANET_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, PLANET_INFO.BUILD_BUTTON_X, PLANET_INFO.BUILD_BUTTON_Y);
    await page.waitForTimeout(500);

    // Verify menu is open
    let isBuildMenuVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              buildingMenuPanel?: { visible?: boolean };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.buildingMenuPanel?.visible === true;
    });
    expect(isBuildMenuVisible).toBe(true);

    // Click a building
    await clickCanvasAt(page, BUILD_MENU.PANEL_X, BUILD_MENU.MINING_STATION_Y);
    await page.waitForTimeout(500);

    // Menu should be closed after selection
    isBuildMenuVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              buildingMenuPanel?: { visible?: boolean };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.buildingMenuPanel?.visible === true;
    });
    expect(isBuildMenuVisible).toBe(false);

    await page.screenshot({ path: 'test-results/t06-menu-closed-after-selection.png' });
  });
});

/**
 * Click Coordinates Reference (1024x768 canvas):
 *
 * Main Menu:
 * - TUTORIALS button: (512, 485.6)
 *
 * TutorialsScene - ScenarioListPanel (600x500 centered):
 * - First card center (T03): (512, 244)
 * - Second card center (T05): (512, 334)
 * - Third card center (T06): (512, 424)
 *
 * ScenarioDetailPanel (500x520 centered):
 * - Start button center: (~352, ~584)
 *
 * ScenarioGameScene:
 * - Player planet (centered): (512, 384)
 *
 * PlanetInfoPanel (280x500, right edge):
 * - Build button center: (~797.5, ~533)
 *
 * BuildingMenuPanel (400x450, centered):
 * - Mining Station button: (512, 244)
 * - Horticultural Station: (512, 324)
 * - Docking Bay: (512, 404)
 * - Orbital Defense: (512, 484)
 * - Surface Platform: (512, 564)
 *
 * Design Alignment Review: T06 - Building a Structure
 *
 * PRD Requirements:
 * - [x] FR12: Players can construct buildings on owned planets
 * - [x] FR13: Players can view building construction progress
 * - [x] Story 4-2: Building Menu shows available buildings
 *
 * Scenario Schema:
 * - [x] JSON validates against ScenarioModels.ts interface
 * - [x] victoryCondition uses "build_structure" type with target: MiningStation
 *
 * UI Elements Verified:
 * - [x] TUTORIALS button navigates to TutorialsScene
 * - [x] Tutorial cards are clickable
 * - [x] Start Scenario button launches ScenarioGameScene
 * - [x] Planet is clickable and opens PlanetInfoPanel
 * - [x] Build button opens BuildingMenuPanel
 * - [x] Building buttons start construction
 * - [x] Resources are deducted on construction start
 * - [x] Menu closes after building selection
 * - [x] Victory triggers when building is started
 */
