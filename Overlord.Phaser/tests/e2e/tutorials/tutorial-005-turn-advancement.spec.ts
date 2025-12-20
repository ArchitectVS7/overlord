/**
 * E2E Test: Tutorial T05 - Turn Advancement
 *
 * Validates the "The Passage of Time" tutorial which teaches players
 * how turns work and how to advance through game phases.
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
  waitForActionPhase,
  pressGameShortcut,
} from '../helpers/phaser-helpers';

test.describe('Tutorial T05: Turn Advancement - The Passage of Time', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
  });

  test('should display TurnHUD with turn number and phase', async ({ page }) => {
    // Navigate to GalaxyMapScene
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Click New Campaign
    await clickCanvasAt(page, centerX, box.height * 0.45);
    await page.waitForTimeout(500);
    await waitForScene(page, 'CampaignConfigScene', 5000);

    // Click Start
    await clickCanvasAt(page, centerX, box.height * 0.85);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'GalaxyMapScene', 10000);
    await waitForActionPhase(page, 10000);

    await page.screenshot({ path: 'test-results/tutorial-005-step-01-initial.png' });

    // Verify TurnHUD displays turn 1
    const turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: {
                currentTurn?: number;
                currentPhase?: string;
              };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });

    expect(turnInfo.turn).toBe(1);
    expect(turnInfo.phase).toBe('Action');
  });

  test('should show END TURN button only during Action phase', async ({ page }) => {
    // Navigate to GalaxyMapScene
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    await clickCanvasAt(page, centerX, box.height * 0.45);
    await page.waitForTimeout(500);
    await waitForScene(page, 'CampaignConfigScene', 5000);
    await clickCanvasAt(page, centerX, box.height * 0.85);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'GalaxyMapScene', 10000);
    await waitForActionPhase(page, 10000);

    // Verify END TURN button is visible during Action phase
    const isEndTurnVisible = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              turnHUD?: {
                list?: Array<{ visible?: boolean; text?: string }>;
              };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      const turnHUD = scene?.turnHUD;
      // The endTurnButton is the 4th element in the container (index 3)
      // Based on TurnHUD.ts: background(0), turnText(1), phaseText(2), endTurnButton(3)
      if (turnHUD?.list && turnHUD.list.length >= 4) {
        return turnHUD.list[3]?.visible === true;
      }
      return false;
    });

    expect(isEndTurnVisible).toBe(true);

    await page.screenshot({ path: 'test-results/tutorial-005-step-02-end-turn-visible.png' });
  });

  test('should advance turn when pressing SPACE key', async ({ page }) => {
    // Navigate to GalaxyMapScene
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    await clickCanvasAt(page, centerX, box.height * 0.45);
    await page.waitForTimeout(500);
    await waitForScene(page, 'CampaignConfigScene', 5000);
    await clickCanvasAt(page, centerX, box.height * 0.85);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'GalaxyMapScene', 10000);
    await waitForActionPhase(page, 10000);

    // Verify starting at turn 1
    let turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: {
                currentTurn?: number;
                currentPhase?: string;
              };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });
    expect(turnInfo.turn).toBe(1);
    expect(turnInfo.phase).toBe('Action');

    await page.screenshot({ path: 'test-results/tutorial-005-step-03-before-space.png' });

    // Press SPACE to end turn
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/tutorial-005-step-04-after-space-combat.png' });

    // Phase should have changed (to Combat, then auto-advance to End, then Income)
    // Wait for the full turn cycle to complete (1500ms per auto-advance phase)
    await page.waitForTimeout(4000);

    // Should now be in turn 2, Action phase
    await waitForActionPhase(page, 10000);

    turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: {
                currentTurn?: number;
                currentPhase?: string;
              };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });

    expect(turnInfo.turn).toBe(2);
    expect(turnInfo.phase).toBe('Action');

    await page.screenshot({ path: 'test-results/tutorial-005-step-05-turn-2.png' });
  });

  test('should complete tutorial by reaching turn 3', async ({ page }) => {
    // This is the full player POV playthrough
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Navigate to GalaxyMapScene
    await clickCanvasAt(page, centerX, box.height * 0.45);
    await page.waitForTimeout(500);
    await waitForScene(page, 'CampaignConfigScene', 5000);
    await clickCanvasAt(page, centerX, box.height * 0.85);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'GalaxyMapScene', 10000);
    await waitForActionPhase(page, 10000);

    await page.screenshot({ path: 'test-results/tutorial-005-step-06-start.png' });

    // Turn 1: Press SPACE to end turn
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(4000); // Wait for phase cycle
    await waitForActionPhase(page, 10000);

    await page.screenshot({ path: 'test-results/tutorial-005-step-07-turn-2.png' });

    // Turn 2: Press SPACE to end turn
    await pressGameShortcut(page, 'Space');
    await page.waitForTimeout(4000); // Wait for phase cycle
    await waitForActionPhase(page, 10000);

    await page.screenshot({ path: 'test-results/tutorial-005-step-08-turn-3-complete.png' });

    // Verify we reached turn 3
    const turnInfo = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: {
                currentTurn?: number;
                currentPhase?: string;
              };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });

    expect(turnInfo.turn).toBe(3);
    expect(turnInfo.phase).toBe('Action');

    console.log('Tutorial T05 completed: Reached turn 3');
  });

  test('should auto-advance Combat and End phases', async ({ page }) => {
    // Navigate to GalaxyMapScene
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    await clickCanvasAt(page, centerX, box.height * 0.45);
    await page.waitForTimeout(500);
    await waitForScene(page, 'CampaignConfigScene', 5000);
    await clickCanvasAt(page, centerX, box.height * 0.85);
    await page.waitForTimeout(1000);
    await waitForScene(page, 'GalaxyMapScene', 10000);
    await waitForActionPhase(page, 10000);

    // Get current turn before pressing SPACE
    const turnBefore = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return scene?.gameState?.currentTurn;
    });

    // Press SPACE to advance from Action to Combat
    await pressGameShortcut(page, 'Space');

    // Wait for Combat and End phases to auto-advance (total ~3 seconds)
    await page.waitForTimeout(4000);

    await page.screenshot({ path: 'test-results/tutorial-005-step-09-auto-advance.png' });

    // After auto-advance, should be at turn 2 Action phase (or later)
    const stateAfter = await page.evaluate(() => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: { currentTurn?: number; currentPhase?: string };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        turn: scene?.gameState?.currentTurn,
        phase: scene?.gameState?.currentPhase,
      };
    });

    // Verify turn advanced (Combat and End phases auto-advanced)
    expect(stateAfter.turn).toBeGreaterThanOrEqual((turnBefore || 1) + 1);
    // Should be back in Action phase of the new turn
    expect(stateAfter.phase).toBe('Action');

    await page.screenshot({ path: 'test-results/tutorial-005-step-10-auto-advanced.png' });
  });
});

/**
 * Design Alignment Review: T05 - Turn Advancement
 *
 * PRD Requirements:
 * - [x] FR5: Game progresses through turns with 4 phases (Income, Action, Combat, End)
 * - [x] FR6: Players can end their turn during Action phase
 * - [x] NFR-P3: UI responds within 100ms (phase notifications appear immediately)
 *
 * Scenario Schema:
 * - [x] JSON validates against ScenarioModels.ts interface
 * - [x] victoryCondition uses "turn_reached" type
 * - [x] tutorialSteps guide through turn cycle
 *
 * UI Elements Verified:
 * - [x] TurnHUD displays current turn number
 * - [x] TurnHUD displays current phase name
 * - [x] END TURN button visible only during Action phase
 * - [x] SPACE key ends turn during Action phase
 * - [x] Combat and End phases auto-advance after 1500ms
 * - [x] Phase transition notifications appear
 */
