import { Page } from '@playwright/test';

/**
 * Advanced Phaser Game Interaction Helpers
 * 
 * These helpers provide deep introspection and interaction with Phaser game objects,
 * allowing tests to discover UI elements, interact with game state, and validate behaviors.
 */

export interface GameState {
  isBooted: boolean;
  isPaused: boolean;
  scenes: string[];
  activeScenes: string[];
  config: {
    width: number;
    height: number;
    type: string;
  };
}

export interface SceneInfo {
  key: string;
  isActive: boolean;
  isVisible: boolean;
  children?: number;
}

export interface GameObjectInfo {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  interactive?: boolean;
  text?: string;
}

/**
 * Get comprehensive game state
 */
export async function getGameState(page: Page): Promise<GameState> {
  return await page.evaluate(() => {
    const game = (window as any).game;
    
    return {
      isBooted: game?.isBooted || false,
      isPaused: game?.isPaused || false,
      scenes: game?.scene?.keys ? Object.keys(game.scene.keys) : [],
      activeScenes: game?.scene?.getScenes(true)?.map((s: any) => s.scene.key) || [],
      config: {
        width: game?.config?.width || 0,
        height: game?.config?.height || 0,
        type: game?.config?.type || 'unknown'
      }
    };
  });
}

/**
 * Get detailed information about all scenes
 */
export async function getAllScenes(page: Page): Promise<SceneInfo[]> {
  return await page.evaluate(() => {
    const game = (window as any).game;
    const scenes = game?.scene?.keys || {};
    
    return Object.keys(scenes).map(key => {
      const scene = game.scene.getScene(key);
      return {
        key,
        isActive: game.scene.isActive(key),
        isVisible: game.scene.isVisible(key),
        children: scene?.children?.list?.length || 0
      };
    });
  });
}

/**
 * Get all interactive game objects in a scene
 */
export async function getInteractiveObjects(page: Page, sceneName: string): Promise<GameObjectInfo[]> {
  return await page.evaluate((name) => {
    const game = (window as any).game;
    const scene = game?.scene?.getScene(name);
    
    if (!scene) return [];
    
    const children = scene.children?.list || [];
    
    return children
      .filter((child: any) => child.visible && (child.input || child.interactive))
      .map((obj: any) => ({
        type: obj.type || 'unknown',
        x: obj.x || 0,
        y: obj.y || 0,
        width: obj.width || obj.displayWidth || 0,
        height: obj.height || obj.displayHeight || 0,
        visible: obj.visible || false,
        interactive: obj.input?.enabled || false,
        text: obj.text || obj.textContent || undefined
      }));
  }, sceneName);
}

/**
 * Get all text objects in a scene (useful for finding menu options)
 */
export async function getTextObjects(page: Page, sceneName: string): Promise<Array<{text: string, x: number, y: number}>> {
  return await page.evaluate((name) => {
    const game = (window as any).game;
    const scene = game?.scene?.getScene(name);
    
    if (!scene) return [];
    
    const children = scene.children?.list || [];
    
    return children
      .filter((child: any) => child.type === 'Text' && child.visible)
      .map((obj: any) => ({
        text: obj.text || '',
        x: obj.x || 0,
        y: obj.y || 0,
        interactive: obj.input?.enabled || false
      }));
  }, sceneName);
}

/**
 * Find a game object by text content
 */
export async function findObjectByText(
  page: Page, 
  sceneName: string, 
  searchText: string
): Promise<{x: number, y: number} | null> {
  return await page.evaluate((args) => {
    const game = (window as any).game;
    const scene = game?.scene?.getScene(args.sceneName);
    
    if (!scene) return null;
    
    const children = scene.children?.list || [];
    const found = children.find((child: any) => {
      const text = child.text || child.textContent || '';
      return text.toLowerCase().includes(args.searchText.toLowerCase());
    });
    
    if (found) {
      return { x: found.x, y: found.y };
    }
    
    return null;
  }, { sceneName, searchText });
}

/**
 * Click a game object by its text content
 */
export async function clickByText(page: Page, sceneName: string, text: string): Promise<boolean> {
  const position = await findObjectByText(page, sceneName, text);
  
  if (!position) {
    console.log(`❌ Could not find object with text: "${text}"`);
    return false;
  }
  
  console.log(`✅ Found "${text}" at position (${position.x}, ${position.y})`);
  
  const canvas = await page.locator('canvas');
  const box = await canvas.boundingBox();
  
  if (!box) {
    throw new Error('Canvas not found');
  }
  
  await page.mouse.click(box.x + position.x, box.y + position.y);
  await page.waitForTimeout(500);
  
  return true;
}

/**
 * Wait for a specific scene and log transition
 */
export async function waitForSceneTransition(
  page: Page, 
  fromScene: string, 
  toScene: string, 
  timeout = 10000
): Promise<void> {
  console.log(`⏳ Waiting for scene transition: ${fromScene} → ${toScene}`);
  
  await page.waitForFunction(
    (args) => {
      const game = (window as any).game;
      return game?.scene?.isActive?.(args.toScene);
    },
    { toScene },
    { timeout }
  );
  
  console.log(`✅ Transitioned to ${toScene}`);
}

/**
 * Log all visible game objects in a scene (debugging)
 */
export async function logSceneObjects(page: Page, sceneName: string): Promise<void> {
  const objects = await page.evaluate((name) => {
    const game = (window as any).game;
    const scene = game?.scene?.getScene(name);
    
    if (!scene) {
      return { error: `Scene "${name}" not found` };
    }
    
    const children = scene.children?.list || [];
    
    return {
      total: children.length,
      visible: children.filter((c: any) => c.visible).length,
      interactive: children.filter((c: any) => c.input?.enabled).length,
      types: children.reduce((acc: any, child: any) => {
        const type = child.type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
      objects: children
        .filter((c: any) => c.visible)
        .map((obj: any) => ({
          type: obj.type,
          text: obj.text || obj.textContent,
          x: obj.x,
          y: obj.y,
          interactive: obj.input?.enabled
        }))
    };
  }, sceneName);
  
  console.log(`\n📊 Scene: ${sceneName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(JSON.stringify(objects, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Get the current game engine state (if exposed)
 */
export async function getGameEngineState(page: Page): Promise<any> {
  return await page.evaluate(() => {
    const gameEngine = (window as any).gameEngine;
    
    if (!gameEngine) {
      return { error: 'GameEngine not exposed on window' };
    }
    
    // Try to access common game state
    return {
      available: true,
      currentPhase: gameEngine.currentPhase || 'unknown',
      turnNumber: gameEngine.turnNumber || 0,
      // Add more state as needed based on actual GameEngine implementation
    };
  });
}

/**
 * Simulate pressing Space/Enter to advance turn
 */
export async function advanceTurn(page: Page): Promise<void> {
  console.log('⏭️  Advancing turn (pressing Space)...');
  const canvas = await page.locator('canvas');
  await canvas.click(); // Focus
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000); // Wait for turn processing
  console.log('✅ Turn advanced');
}

/**
 * Take a labeled screenshot
 */
export async function screenshot(page: Page, label: string): Promise<void> {
  const filename = `test-results/${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`📸 Screenshot saved: ${filename}`);
}
