import { test, expect } from '@playwright/test';
import { waitForPhaserGame, waitForScene, getPhaserCanvas } from './helpers/phaser-helpers';

/**
 * Victory Screen E2E Tests
 * Tests the VictoryScene displays correctly and buttons work
 */
test.describe('Victory Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene', 10000);
  });

  test('VictoryScene can be started and displays victory message', async ({ page }) => {
    // Start VictoryScene directly for testing
    const sceneStarted = await page.evaluate(() => {
      const game = (window as any).game;
      if (!game?.scene) return false;

      // Create mock game state for victory display
      const mockGameState = {
        turnNumber: 25,
        planets: [
          { id: 1, owner: 1 }, // Player owns all
          { id: 2, owner: 1 },
        ],
        platoons: [],
        craft: [],
        player: {
          credits: 50000,
          minerals: 20000,
          fuel: 15000,
          food: 10000,
          energy: 8000,
        },
      };

      game.registry.set('gameState', mockGameState);
      game.scene.start('VictoryScene');
      return true;
    });

    expect(sceneStarted).toBe(true);

    // Wait for VictoryScene to be active
    await waitForScene(page, 'VictoryScene', 5000);

    // Verify scene is active
    const isVictoryActive = await page.evaluate(() => {
      const game = (window as any).game;
      return game?.scene?.isActive?.('VictoryScene') === true;
    });

    expect(isVictoryActive).toBe(true);

    // Take screenshot for visual verification
    await page.screenshot({ path: 'test-results/victory-screen.png' });
  });

  test('VictoryScene displays statistics section', async ({ page }) => {
    // Start VictoryScene with mock data
    await page.evaluate(() => {
      const game = (window as any).game;
      if (!game?.scene) return;

      const mockGameState = {
        turnNumber: 30,
        planets: [{ id: 1, owner: 1 }, { id: 2, owner: 1 }, { id: 3, owner: 1 }],
        platoons: [{ id: 1 }, { id: 2 }],
        craft: [{ id: 1 }, { id: 2 }, { id: 3 }],
        player: {
          credits: 100000,
          minerals: 50000,
          fuel: 30000,
          food: 25000,
          energy: 20000,
        },
      };

      game.registry.set('gameState', mockGameState);
      game.scene.start('VictoryScene');
    });

    await waitForScene(page, 'VictoryScene', 5000);

    // Verify text objects exist in the scene
    const hasStatistics = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('VictoryScene');
      if (!scene) return false;

      // Check for text objects containing key phrases
      const textObjects = scene.children?.list?.filter(
        (child: any) => child.type === 'Text'
      ) || [];

      // Look for "VICTORY" and "STATISTICS" text
      const hasVictoryText = textObjects.some(
        (t: any) => t.text?.includes('VICTORY')
      );
      const hasStatsText = textObjects.some(
        (t: any) => t.text?.includes('STATISTICS')
      );

      return hasVictoryText && hasStatsText;
    });

    expect(hasStatistics).toBe(true);
  });

  test('VictoryScene Continue button returns to MainMenuScene', async ({ page }) => {
    // Start VictoryScene
    await page.evaluate(() => {
      const game = (window as any).game;
      if (!game?.scene) return;

      game.registry.set('gameState', {
        turnNumber: 20,
        planets: [{ id: 1, owner: 1 }],
        platoons: [],
        craft: [],
        player: { credits: 10000, minerals: 5000, fuel: 3000, food: 2000, energy: 1000 },
      });

      game.scene.start('VictoryScene');
    });

    await waitForScene(page, 'VictoryScene', 5000);

    // Find and click the Continue button
    // The button is positioned at centerX - 100, height - 100
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // Calculate Continue button position (left of center, near bottom)
    const continueX = box.width / 2 - 100;
    const continueY = box.height - 100;

    await page.mouse.click(box.x + continueX, box.y + continueY);

    // Wait for MainMenuScene
    await waitForScene(page, 'MainMenuScene', 5000);

    // Verify we're back at main menu
    const isMainMenu = await page.evaluate(() => {
      const game = (window as any).game;
      return game?.scene?.isActive?.('MainMenuScene') === true;
    });

    expect(isMainMenu).toBe(true);
  });
});
