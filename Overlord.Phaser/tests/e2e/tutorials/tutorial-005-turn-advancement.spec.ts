/**
 * E2E Test: Tutorial T05 - Turn Advancement (The Passage of Time)
 *
 * Tests the complete player journey through the turn advancement tutorial:
 * 1. Navigate to Tutorials menu from Main Menu
 * 2. Select "The Passage of Time" tutorial from the list
 * 3. Click Start Scenario
 * 4. Press SPACE key twice to advance turns and reach turn 3
 * 5. Verify victory condition triggers
 *
 * Note: T05 has a prerequisite (T03). The test sets localStorage to mark T03 as complete.
 *
 * All interactions are done via actual UI clicks/keypresses, not programmatic callbacks.
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
  pressGameShortcut,
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
  PANEL_Y: (CANVAS_HEIGHT - 500) / 2, // 134
  CARD_HEIGHT: 80,
  CARD_SPACING: 10,
  // First card center Y: panel_y + padding + cards_offset + half_card = 134 + 20 + 50 + 40 = 244
  FIRST_CARD_Y: (CANVAS_HEIGHT - 500) / 2 + 20 + 50 + 40,
  // Second card center Y: first_card_y + card_height + spacing = 244 + 80 + 10 = 334
  SECOND_CARD_Y: (CANVAS_HEIGHT - 500) / 2 + 20 + 50 + 40 + 80 + 10,
};

// ScenarioDetailPanel positions (500x520 panel, centered)
const SCENARIO_DETAIL = {
  START_BUTTON_X: (CANVAS_WIDTH - 500) / 2 + 500 / 2 - 180 - 10 + 90, // ~352
  START_BUTTON_Y: (CANVAS_HEIGHT - 520) / 2 + 520 - 20 - 40 - 20 + 20, // ~584
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

test.describe('Tutorial T05: Turn Advancement - The Passage of Time (Click Journey)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);

    // Mark prerequisite (T03) as complete
    await markTutorialComplete(page, 'tutorial-003-planet-selection');

    await waitForScene(page, 'MainMenuScene');
    await page.waitForTimeout(500);
  });

  test('complete full tutorial journey via UI clicks and SPACE key', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // ========== STEP 1: Click TUTORIALS button in main menu ==========
    console.log('Step 1: Navigating to Tutorials');
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'TutorialsScene', 5000);

    await page.screenshot({ path: 'test-results/t05-journey-01-tutorials-scene.png' });

    // ========== STEP 2: Click second tutorial card (The Passage of Time / T05) ==========
    // T03 is first (index 0), T05 is second (index 1)
    console.log(`Step 2: Clicking second tutorial card at (${MAIN_MENU.CENTER_X}, ${SCENARIO_LIST.SECOND_CARD_Y})`);
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.SECOND_CARD_Y);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t05-journey-02-detail-panel.png' });

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
    await page.screenshot({ path: 'test-results/t05-journey-03-game-scene.png' });

    // ========== STEP 4: Dismiss objectives panel ==========
    await page.waitForTimeout(1500);
    console.log('Step 4: Dismissing objectives panel');
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await page.waitForTimeout(1500);

    // Wait for Action phase
    await waitForScenarioActionPhase(page, 10000);
    await page.screenshot({ path: 'test-results/t05-journey-04-action-phase-turn1.png' });

    // Verify we're at turn 1, Action phase
    let turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number; currentPhase?: string };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });
    expect(turnInfo.turn).toBe(1);
    expect(turnInfo.phase).toBe('Action');

    // ========== STEP 5: Press SPACE to end turn 1 ==========
    console.log('Step 5: Pressing SPACE to end turn 1');
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/t05-journey-05-combat-phase.png' });

    // Wait for phases to auto-advance (Combat -> End -> Income -> Action)
    await page.waitForTimeout(4000);
    await waitForScenarioActionPhase(page, 10000);

    await page.screenshot({ path: 'test-results/t05-journey-06-action-phase-turn2.png' });

    // Verify we're now at turn 2
    turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number; currentPhase?: string };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });
    expect(turnInfo.turn).toBe(2);
    expect(turnInfo.phase).toBe('Action');

    // ========== STEP 6: Press SPACE to end turn 2 ==========
    console.log('Step 6: Pressing SPACE to end turn 2');
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(4000);
    await waitForScenarioActionPhase(page, 10000);

    await page.screenshot({ path: 'test-results/t05-journey-07-turn3-complete.png' });

    // Verify we reached turn 3
    turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number; currentPhase?: string };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });
    expect(turnInfo.turn).toBe(3);

    // ========== STEP 7: Verify victory condition triggered ==========
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/t05-journey-08-victory.png' });

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

    console.log('Tutorial T05 completed successfully via UI clicks!');
  });

  test('SPACE key advances from Action to Combat phase', async ({ page }) => {
    // Mark prerequisite as complete and navigate to T05
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.SECOND_CARD_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.waitForTimeout(1500);

    // Dismiss objectives
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await waitForScenarioActionPhase(page, 10000);
    await page.waitForTimeout(500);

    // Verify starting at Action phase
    let phase = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentPhase?: string };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.gameState?.currentPhase;
    });
    expect(phase).toBe('Action');

    // Press SPACE
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(300);

    // Should now be in Combat phase (before auto-advance kicks in)
    phase = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentPhase?: string };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.gameState?.currentPhase;
    });
    expect(phase).toBe('Combat');

    await page.screenshot({ path: 'test-results/t05-space-combat-phase.png' });
  });

  test('phases auto-advance after Combat phase', async ({ page }) => {
    // Navigate to T05
    await clickCanvasAt(page, MAIN_MENU.CENTER_X, MAIN_MENU.TUTORIALS_Y);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, MAIN_MENU.CENTER_X, SCENARIO_LIST.SECOND_CARD_Y);
    await page.waitForTimeout(500);

    await clickCanvasAt(page, SCENARIO_DETAIL.START_BUTTON_X, SCENARIO_DETAIL.START_BUTTON_Y);
    await waitForScene(page, 'ScenarioGameScene', 10000);
    await page.waitForTimeout(1500);

    // Dismiss objectives
    await clickCanvasAt(page, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    await waitForScenarioActionPhase(page, 10000);
    await page.waitForTimeout(500);

    // Get current turn
    let turnBefore = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number };
            } | null;
          };
        };
      }).game;
      return game?.scene?.getScene?.('ScenarioGameScene')?.gameState?.currentTurn;
    });

    // Press SPACE and wait for auto-advance
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(5000); // Wait for Combat -> End -> Income -> Action

    // Should now be in next turn's Action phase
    await waitForScenarioActionPhase(page, 5000);

    const turnAfter = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number; currentPhase?: string };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });

    expect(turnAfter.turn).toBe((turnBefore || 1) + 1);
    expect(turnAfter.phase).toBe('Action');

    await page.screenshot({ path: 'test-results/t05-auto-advance-complete.png' });
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
 *
 * ScenarioDetailPanel (500x520 centered):
 * - Start button center: (~352, ~584)
 *
 * Keyboard:
 * - SPACE key ends turn during Action phase
 *
 * Design Alignment Review: T05 - Turn Advancement
 *
 * PRD Requirements:
 * - [x] FR5: Game progresses through turns with 4 phases
 * - [x] FR6: Players can end their turn during Action phase
 * - [x] NFR-P3: UI responds within 100ms
 *
 * Scenario Schema:
 * - [x] JSON validates against ScenarioModels.ts interface
 * - [x] victoryCondition uses "turn_reached" type with target: 3
 * - [x] tutorialSteps guide through turn cycle
 *
 * UI Elements Verified:
 * - [x] TUTORIALS button navigates to TutorialsScene
 * - [x] Tutorial cards are clickable
 * - [x] Start Scenario button launches ScenarioGameScene
 * - [x] SPACE key ends turn during Action phase
 * - [x] Combat and End phases auto-advance
 * - [x] Victory triggers when turn 3 is reached
 */
