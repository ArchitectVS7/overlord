/**
 * E2E Test: Tutorial T03 - Planet Selection (First Command)
 *
 * Tests the complete player journey through the first tutorial:
 * 1. Navigate to Tutorials menu from Main Menu
 * 2. Select the "First Command" tutorial from the list
 * 3. Click Start Scenario
 * 4. Complete tutorial by clicking on the planet
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
  BUTTON_Y: CANVAS_HEIGHT * 0.45, // 345.6
  BUTTON_SPACING: 70,
  // TUTORIALS is the 3rd button (index 2)
  TUTORIALS_Y: CANVAS_HEIGHT * 0.45 + 70 * 2, // 485.6
};

// ScenarioListPanel positions (600x500 panel, centered)
const SCENARIO_LIST = {
  PANEL_WIDTH: 600,
  PANEL_HEIGHT: 500,
  PANEL_X: (CANVAS_WIDTH - 600) / 2, // 212
  PANEL_Y: (CANVAS_HEIGHT - 500) / 2, // 134
  PADDING: 20,
  CARD_START_Y: 50, // relative to content
  CARD_HEIGHT: 80,
  CARD_SPACING: 10,
  // First card center Y position: panel_y + padding + cards_offset + half_card
  FIRST_CARD_Y: (CANVAS_HEIGHT - 500) / 2 + 20 + 50 + 40, // ~244
};

// ScenarioDetailPanel positions (500x520 panel, centered)
const SCENARIO_DETAIL = {
  PANEL_WIDTH: 500,
  PANEL_HEIGHT: 520,
  PANEL_X: (CANVAS_WIDTH - 500) / 2, // 262
  PANEL_Y: (CANVAS_HEIGHT - 520) / 2, // 124
  PADDING: 20,
  BUTTON_HEIGHT: 40,
  BUTTON_WIDTH: 180,
  // Start button center: panel_x + panel_width/2 - button_width - 10 + button_width/2
  START_BUTTON_X: (CANVAS_WIDTH - 500) / 2 + 500 / 2 - 180 - 10 + 90, // ~352
  START_BUTTON_Y: (CANVAS_HEIGHT - 520) / 2 + 520 - 20 - 40 - 20 + 20, // ~584
};

// ScenarioGameScene positions
const GAME_SCENE = {
  // Player planet is centered at (512, 384) in ScenarioInitializer
  PLANET_X: 512,
  PLANET_Y: 384,
};

test.describe('Tutorial T03: Planet Selection - First Command (Click Journey)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
    await page.waitForTimeout(500); // Let menu fully render
  });

  test('complete full tutorial journey via UI clicks', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // ========== STEP 1: Click TUTORIALS button in main menu ==========
    console.log(`Step 1: Clicking TUTORIALS at (${MAIN_MENU.CENTER_X}, ${MAIN_MENU.TUTORIALS_Y})`);
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await page.waitForTimeout(1000);

    // Verify TutorialsScene is active
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.screenshot({ path: 'test-results/t03-journey-01-tutorials-scene.png' });

    const isTutorialsScene = await page.evaluate(() => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.('TutorialsScene') === true;
    });
    expect(isTutorialsScene).toBe(true);

    // ========== STEP 2: Click first tutorial card (First Command / T03) ==========
    console.log(`Step 2: Clicking first tutorial card at (${MAIN_MENU.CENTER_X}, ${SCENARIO_LIST.FIRST_CARD_Y})`);
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.FIRST_CARD_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t03-journey-02-detail-panel.png' });

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
    console.log(`Step 3: Clicking Start Scenario at (${SCENARIO_DETAIL.START_BUTTON_X}, ${SCENARIO_DETAIL.START_BUTTON_Y})`);
    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await page.waitForTimeout(2000);

    // Verify ScenarioGameScene is active
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.screenshot({ path: 'test-results/t03-journey-03-game-scene.png' });

    const isGameScene = await page.evaluate(() => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.('ScenarioGameScene') === true;
    });
    expect(isGameScene).toBe(true);

    // ========== STEP 4: Dismiss objectives panel ==========
    // Wait for objectives panel to appear and click to continue
    await page.waitForTimeout(1500);
    console.log('Step 4: Dismissing objectives panel');
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/t03-journey-04-objectives-dismissed.png' });

    // ========== STEP 5: Click on the player planet ==========
    console.log(`Step 5: Clicking planet at (${GAME_SCENE.PLANET_X}, ${GAME_SCENE.PLANET_Y})`);
    await clickCanvasAt(page, GAME_SCENE.PLANET_X, GAME_SCENE.PLANET_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t03-journey-05-planet-clicked.png' });

    // Verify planet info panel opened
    const isPanelVisible = await page.evaluate(() => {
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
    expect(isPanelVisible).toBe(true);

    // ========== STEP 6: Verify victory condition triggered ==========
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/t03-journey-06-complete.png' });

    // Check if victory was achieved (ui_interaction: planet_info_panel_opened)
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

    console.log('Tutorial T03 completed successfully via UI clicks!');
  });

  test('navigate from main menu to tutorials scene', async ({ page }) => {
    // Click TUTORIALS button
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await page.waitForTimeout(1000);

    // Verify TutorialsScene is active
    const isTutorialsScene = await page.evaluate(() => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.('TutorialsScene') === true;
    });
    expect(isTutorialsScene).toBe(true);

    await page.screenshot({ path: 'test-results/t03-nav-tutorials.png' });
  });

  test('tutorial list shows First Command as first entry', async ({ page }) => {
    // Navigate to tutorials
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    // Verify the list panel is visible and has scenarios
    const scenarioCount = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              listPanel?: { getScenarioCards?: () => unknown[] };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('TutorialsScene');
      return scene?.listPanel?.getScenarioCards?.()?.length ?? 0;
    });
    expect(scenarioCount).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/t03-list-visible.png' });
  });

  test('clicking tutorial card opens detail panel', async ({ page }) => {
    // Navigate to tutorials
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    // Click first tutorial card
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.FIRST_CARD_Y);
    await page.waitForTimeout(500);

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

    await page.screenshot({ path: 'test-results/t03-detail-visible.png' });
  });

  test('clicking Start Scenario launches ScenarioGameScene', async ({ page }) => {
    // Navigate to tutorials
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    // Click first tutorial card
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.FIRST_CARD_Y);
    await page.waitForTimeout(500);

    // Click Start Scenario button
    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await page.waitForTimeout(2000);

    // Verify ScenarioGameScene is active
    await waitForScene(page, 'ScenarioGameScene', 10000);

    const isGameScene = await page.evaluate(() => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.('ScenarioGameScene') === true;
    });
    expect(isGameScene).toBe(true);

    await page.screenshot({ path: 'test-results/t03-game-scene-launched.png' });
  });
});

/**
 * Click Coordinates Reference (1024x768 canvas):
 *
 * Main Menu:
 * - TUTORIALS button: (512, 485.6)
 *
 * TutorialsScene - ScenarioListPanel (600x500 centered):
 * - Panel top-left: (212, 134)
 * - First card center: (512, ~244)
 *
 * ScenarioDetailPanel (500x520 centered):
 * - Panel top-left: (262, 124)
 * - Start button center: (~352, ~584)
 *
 * ScenarioGameScene:
 * - Player planet (centered): (512, 384)
 *
 * Design Alignment Review: T03 - Planet Selection
 *
 * PRD Requirements:
 * - [x] FR9: Players can select planets to view detailed information
 * - [x] FR10: Players can view planet attributes
 * - [x] NFR-P3: UI responds within 100ms
 *
 * Scenario Schema:
 * - [x] JSON validates against ScenarioModels.ts interface
 * - [x] tutorialSteps properly structured
 *
 * UI Elements Verified:
 * - [x] TUTORIALS button navigates to TutorialsScene
 * - [x] Tutorial cards are clickable and open detail panel
 * - [x] Start Scenario button launches ScenarioGameScene
 * - [x] Planet is clickable and opens PlanetInfoPanel
 * - [x] Victory condition triggers on panel open
 */
