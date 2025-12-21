import { test, expect } from '@playwright/test';
import { waitForPhaserGame, getPhaserCanvas, waitForScene } from './helpers/phaser-helpers';

test.describe('Game Loading', () => {
  test('should load the game page', async ({ page }) => {
    await page.goto('/');

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Overlord/i);
  });

  test('should render the Phaser canvas', async ({ page }) => {
    await page.goto('/');

    const canvas = await getPhaserCanvas(page);
    await expect(canvas).toBeVisible();
  });

  test('should boot the Phaser game', async ({ page }) => {
    await page.goto('/');

    // Wait for the game to be fully loaded
    await waitForPhaserGame(page);

    // Verify game is booted
    const isBooted = await page.evaluate(() => {
      const game = (window as unknown as { game?: { isBooted?: boolean } }).game;
      return game?.isBooted === true;
    });

    expect(isBooted).toBe(true);
  });

  test('should show the main menu scene initially', async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);

    // Wait for MainMenuScene to be active
    await waitForScene(page, 'MainMenuScene', 10000);

    // Check if MainMenuScene is active
    const isMainMenuActive = await page.evaluate(() => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.('MainMenuScene') === true;
    });

    expect(isMainMenuActive).toBe(true);
  });
});
