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

/**
 * Wait for the game to reach Action Phase (when player can interact)
 */
export async function waitForActionPhase(page: Page, timeout = 30000): Promise<void> {
  await page.waitForFunction(
    () => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              gameState?: {
                currentPhase?: string;
              };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      // TurnPhase is a string enum: 'Income' | 'Action' | 'Combat' | 'End'
      return scene?.gameState?.currentPhase === 'Action';
    },
    { timeout }
  );
}

/**
 * Get player planet screen position and click on it
 */
export async function clickPlayerPlanet(page: Page): Promise<{ x: number; y: number } | null> {
  // Get player planet position from game state
  const planetScreenPos = await page.evaluate(() => {
    const game = (window as unknown as {
      game?: {
        scene?: {
          getScene?: (name: string) => {
            galaxy?: {
              planets?: Array<{
                id: number;
                owner: string;
                position: { x: number; z: number };
              }>;
            };
            cameras?: { main?: { scrollX: number; scrollY: number } };
          } | null;
        };
      };
    }).game;
    const scene = game?.scene?.getScene?.('GalaxyMapScene');
    const planets = scene?.galaxy?.planets;
    if (!planets || planets.length === 0) return null;

    // Find player planet (owner = 'Player' or check by faction)
    const playerPlanet = planets.find((p) => p.owner === 'Player') || planets[0];
    if (!playerPlanet) return null;

    const scrollX = scene?.cameras?.main?.scrollX || 0;
    const scrollY = scene?.cameras?.main?.scrollY || 0;

    return {
      x: playerPlanet.position.x - scrollX,
      y: playerPlanet.position.z - scrollY,
    };
  });

  if (planetScreenPos) {
    await clickCanvasAt(page, planetScreenPos.x, planetScreenPos.y);
    return planetScreenPos;
  }
  return null;
}

/**
 * Wait for PlanetInfoPanel to be visible
 */
export async function waitForPlanetInfoPanel(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              planetInfoPanel?: { getIsVisible?: () => boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return scene?.planetInfoPanel?.getIsVisible?.() === true;
    },
    { timeout }
  );
}

/**
 * Click on Commission button in PlanetInfoPanel
 */
export async function clickCommissionButton(page: Page): Promise<void> {
  // Trigger the commission click callback programmatically
  await page.evaluate(() => {
    const game = (window as unknown as {
      game?: {
        scene?: {
          getScene?: (name: string) => {
            planetInfoPanel?: {
              planet?: unknown;
              onCommissionClick?: (planet: unknown) => void;
            };
          } | null;
        };
      };
    }).game;
    const scene = game?.scene?.getScene?.('GalaxyMapScene');
    const panel = scene?.planetInfoPanel;
    if (panel?.planet && panel?.onCommissionClick) {
      panel.onCommissionClick(panel.planet);
    }
  });
}

/**
 * Wait for PlatoonCommissionPanel to be visible
 */
export async function waitForPlatoonCommissionPanel(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              platoonCommissionPanel?: { getIsVisible?: () => boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return scene?.platoonCommissionPanel?.getIsVisible?.() === true;
    },
    { timeout }
  );
}

/**
 * Click on Navigate button in PlanetInfoPanel
 */
export async function clickNavigateButton(page: Page): Promise<void> {
  // Trigger the navigate click callback programmatically
  await page.evaluate(() => {
    const game = (window as unknown as {
      game?: {
        scene?: {
          getScene?: (name: string) => {
            planetInfoPanel?: {
              planet?: unknown;
              onNavigateClick?: (planet: unknown) => void;
            };
          } | null;
        };
      };
    }).game;
    const scene = game?.scene?.getScene?.('GalaxyMapScene');
    const panel = scene?.planetInfoPanel;
    if (panel?.planet && panel?.onNavigateClick) {
      panel.onNavigateClick(panel.planet);
    }
  });
}

/**
 * Wait for SpacecraftNavigationPanel to be visible
 */
export async function waitForSpacecraftNavigationPanel(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      const game = (window as unknown as {
        game?: {
          scene?: {
            getScene?: (name: string) => {
              spacecraftNavigationPanel?: { getIsVisible?: () => boolean };
            } | null;
          };
        };
      }).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return scene?.spacecraftNavigationPanel?.getIsVisible?.() === true;
    },
    { timeout }
  );
}
