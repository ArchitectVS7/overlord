/**
 * Authentication Fixtures for E2E Tests
 *
 * Provides authenticated page contexts for testing admin features.
 */

import { test as base, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const ADMIN_STORAGE_STATE = path.resolve(__dirname, '../.auth/admin.json');

// Check if admin auth state exists
export function hasAdminAuth(): boolean {
  return fs.existsSync(ADMIN_STORAGE_STATE);
}

// Extended test with admin authentication
export const adminTest = base.extend<{
  adminPage: Page;
  adminContext: BrowserContext;
}>({
  // Create a context with admin authentication
  adminContext: async ({ browser }, use) => {
    if (!hasAdminAuth()) {
      throw new Error(
        'Admin authentication state not found. ' +
        'Run global setup first or configure TEST_ADMIN_EMAIL/PASSWORD in .env.test'
      );
    }

    const context = await browser.newContext({
      storageState: ADMIN_STORAGE_STATE,
    });
    await use(context);
    await context.close();
  },

  // Create a page with admin authentication
  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage();
    await use(page);
    await page.close();
  },
});

/**
 * Helper to navigate to GalaxyMapScene as admin
 */
export async function navigateToGalaxyMapAsAdmin(page: Page): Promise<void> {
  await page.goto('/');

  // Wait for Phaser to boot
  await page.waitForFunction(
    () => {
      const game = (window as unknown as { game?: { isBooted?: boolean } }).game;
      return game && game.isBooted;
    },
    { timeout: 30000 }
  );

  // Check current scene
  const currentScene = await page.evaluate(() => {
    const game = (window as unknown as {
      game?: {
        scene?: {
          scenes?: Array<{ sys?: { settings?: { key?: string; active?: boolean } } }>;
        };
      };
    }).game;
    const activeScene = game?.scene?.scenes?.find(s => s.sys?.settings?.active);
    return activeScene?.sys?.settings?.key || 'unknown';
  });

  console.log(`Current scene: ${currentScene}`);

  if (currentScene === 'MainMenuScene') {
    // Need to start a new game to get to GalaxyMapScene
    // Click "New Game" button or equivalent
    await startNewGame(page);
  } else if (currentScene === 'AuthScene') {
    throw new Error('Not authenticated - auth state may be invalid');
  }

  // Wait for GalaxyMapScene to be active
  await page.waitForFunction(
    () => {
      const game = (window as unknown as {
        game?: { scene?: { isActive?: (name: string) => boolean } };
      }).game;
      return game?.scene?.isActive?.('GalaxyMapScene') === true;
    },
    { timeout: 30000 }
  );
}

/**
 * Start a new game from MainMenuScene
 */
async function startNewGame(page: Page): Promise<void> {
  // The main menu likely has buttons rendered on canvas
  // We need to find and click the "New Game" button

  // Option 1: Click at known button position (fragile but works)
  // Option 2: Use keyboard navigation
  // Option 3: Programmatically start the game via evaluate

  // Using programmatic approach for reliability
  await page.evaluate(() => {
    const game = (window as unknown as {
      game?: {
        scene?: {
          start?: (key: string, data?: object) => void;
          stop?: (key: string) => void;
        };
      };
    }).game;

    if (game?.scene) {
      // Stop current scene and start GalaxyMapScene
      game.scene.stop?.('MainMenuScene');
      game.scene.start?.('GalaxyMapScene');
    }
  });

  // Wait for scene transition
  await page.waitForTimeout(1000);
}

/**
 * Verify admin status in the game
 */
export async function verifyAdminStatus(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const game = (window as unknown as {
      game?: {
        registry?: {
          get?: (key: string) => { isAdmin?: () => boolean } | undefined;
        };
      };
    }).game;

    const adminService = game?.registry?.get?.('adminModeService');
    return adminService?.isAdmin?.() === true;
  });
}

/**
 * Enter edit mode via keyboard shortcut
 */
export async function enterEditMode(page: Page): Promise<void> {
  // Hide webpack dev server overlay if present (it blocks clicks)
  await page.evaluate(() => {
    const overlay = document.getElementById('webpack-dev-server-client-overlay');
    if (overlay) overlay.style.display = 'none';
  });

  const canvas = page.locator('canvas');
  await canvas.click({ force: true }); // Focus canvas

  // Press Ctrl+Shift+E
  await page.keyboard.press('Control+Shift+KeyE');
  await page.waitForTimeout(500);
}

/**
 * Exit edit mode via keyboard shortcut
 */
export async function exitEditMode(page: Page): Promise<void> {
  const canvas = page.locator('canvas');
  await canvas.click();

  await page.keyboard.press('Control+Shift+KeyE');
  await page.waitForTimeout(500);
}
