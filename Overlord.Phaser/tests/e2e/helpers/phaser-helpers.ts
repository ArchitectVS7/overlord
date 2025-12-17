import { Page } from '@playwright/test';

/**
 * Helper utilities for testing Phaser games with Playwright
 */

/**
 * Wait for the Phaser game to be fully loaded
 */
export async function waitForPhaserGame(page: Page, timeout = 30000): Promise<void> {
  await page.waitForFunction(
    () => {
      const game = (window as unknown as { game?: { isBooted?: boolean } }).game;
      return game && game.isBooted;
    },
    { timeout }
  );
}

/**
 * Wait for a specific Phaser scene to be active
 */
export async function waitForScene(page: Page, sceneName: string, timeout = 10000): Promise<void> {
  await page.waitForFunction(
    (name) => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.(name);
    },
    sceneName,
    { timeout }
  );
}

/**
 * Get the Phaser canvas element
 */
export async function getPhaserCanvas(page: Page): Promise<ReturnType<Page['locator']>> {
  return page.locator('canvas');
}

/**
 * Simulate a keyboard shortcut in the game
 */
export async function pressGameShortcut(
  page: Page,
  key: string,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
): Promise<void> {
  const canvas = await getPhaserCanvas(page);
  await canvas.click(); // Focus the canvas first

  const keys: string[] = [];
  if (modifiers.ctrl) keys.push('Control');
  if (modifiers.shift) keys.push('Shift');
  if (modifiers.alt) keys.push('Alt');
  keys.push(key);

  await page.keyboard.press(keys.join('+'));
}

/**
 * Click at a specific position on the Phaser canvas
 */
export async function clickCanvasAt(page: Page, x: number, y: number): Promise<void> {
  const canvas = await getPhaserCanvas(page);
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');

  await page.mouse.click(box.x + x, box.y + y);
}

/**
 * Drag from one position to another on the canvas
 */
export async function dragOnCanvas(
  page: Page,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): Promise<void> {
  const canvas = await getPhaserCanvas(page);
  const box = await canvas.boundingBox();
  if (!box) throw new Error('Canvas not found');

  await page.mouse.move(box.x + fromX, box.y + fromY);
  await page.mouse.down();
  await page.mouse.move(box.x + toX, box.y + toY, { steps: 10 });
  await page.mouse.up();
}

/**
 * Check if the admin edit mode indicator is visible
 */
export async function isEditModeIndicatorVisible(page: Page): Promise<boolean> {
  // The indicator is rendered on the Phaser canvas, so we need to check via game state
  return await page.evaluate(() => {
    const game = (window as unknown as { game?: { scene?: { getScene?: (name: string) => { adminEditIndicator?: { visible?: boolean } } | null } } }).game;
    const scene = game?.scene?.getScene?.('GalaxyMapScene');
    return scene?.adminEditIndicator?.visible === true;
  });
}

/**
 * Get the number of pending changes in admin edit mode
 */
export async function getPendingChangesCount(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const game = (window as unknown as { game?: { scene?: { getScene?: (name: string) => { adminUIEditor?: { getPendingChangesCount?: () => number } } | null } } }).game;
    const scene = game?.scene?.getScene?.('GalaxyMapScene');
    return scene?.adminUIEditor?.getPendingChangesCount?.() ?? 0;
  });
}

/**
 * Check if admin edit mode is active
 */
export async function isEditModeActive(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const game = (window as unknown as { game?: { scene?: { getScene?: (name: string) => { adminUIEditor?: { isEditModeActive?: () => boolean } } | null } } }).game;
    const scene = game?.scene?.getScene?.('GalaxyMapScene');
    return scene?.adminUIEditor?.isEditModeActive?.() === true;
  });
}
