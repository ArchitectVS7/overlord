import { test, expect } from '@playwright/test';
import { waitForPhaserGame, waitForScene } from './helpers/phaser-helpers';
import { 
  getGameState,
  getAllScenes,
  getTextObjects,
  getInteractiveObjects,
  logSceneObjects,
  screenshot,
  clickByText,
  waitForSceneTransition
} from './helpers/game-helpers';

/**
 * UI DISCOVERY TEST
 * 
 * This test systematically explores the game to discover:
 * - All available scenes
 * - All interactive elements in each scene
 * - Text labels and buttons
 * - Navigation paths
 * 
 * Outputs:
 * - Detailed console logs of UI structure
 * - Screenshots of each scene
 * - JSON map of navigation
 */

test.describe('UI Discovery - Map Complete Game Interface', () => {
  
  test.setTimeout(300000); // 5 minutes for thorough exploration

  test('DISCOVERY 1: Map all scenes and their objects', async ({ page }) => {
    console.log('\n🔍 STARTING COMPREHENSIVE UI DISCOVERY');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    await page.goto('/');
    await waitForPhaserGame(page);
    
    // Get global game state
    const gameState = await getGameState(page);
    console.log('🎮 Game State:');
    console.log(JSON.stringify(gameState, null, 2));
    
    // Get all scenes
    const allScenes = await getAllScenes(page);
    console.log('\n📋 Available Scenes:');
    allScenes.forEach(scene => {
      console.log(`  ${scene.isActive ? '●' : '○'} ${scene.key} (${scene.children} children)`);
    });
    
    await screenshot(page, '01-initial-state');
    
    console.log('\n═══════════════════════════════════════════════════════════════\n');
  });

  test('DISCOVERY 2: Explore MainMenuScene', async ({ page }) => {
    console.log('\n🔍 EXPLORING: MainMenuScene');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
    
    // Get all text objects
    const textObjects = await getTextObjects(page, 'MainMenuScene');
    console.log('📝 Text Objects Found:');
    textObjects.forEach(obj => {
      console.log(`  "${obj.text}" at (${obj.x}, ${obj.y}) ${obj.interactive ? '[INTERACTIVE]' : ''}`);
    });
    
    // Get all interactive objects
    const interactive = await getInteractiveObjects(page, 'MainMenuScene');
    console.log('\n🖱️  Interactive Objects:');
    console.log(JSON.stringify(interactive, null, 2));
    
    // Full scene dump
    await logSceneObjects(page, 'MainMenuScene');
    
    await screenshot(page, '02-main-menu-annotated');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  test('DISCOVERY 3: Navigate to Flash Conflicts', async ({ page }) => {
    console.log('\n🔍 NAVIGATION TEST: Main Menu → Flash Conflicts');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
    
    // Try to find and click "Flash Conflicts" or "Tutorial" text
    const searchTerms = ['FLASH CONFLICTS', 'TUTORIAL', 'Flash Conflicts', 'Tutorial'];
    
    let found = false;
    for (const term of searchTerms) {
      console.log(`🔎 Searching for: "${term}"`);
      const clicked = await clickByText(page, 'MainMenuScene', term);
      
      if (clicked) {
        found = true;
        await page.waitForTimeout(1000);
        
        const currentScenes = await page.evaluate(() => {
          const game = (window as any).game;
          return game?.scene?.getScenes(true)?.map((s: any) => s.scene.key) || [];
        });
        
        console.log(`✅ Clicked "${term}"`);
        console.log(`📍 Current scenes:`, currentScenes);
        
        await screenshot(page, '03-after-flash-conflicts-click');
        break;
      }
    }
    
    if (!found) {
      console.log('⚠️  Could not find Flash Conflicts button by text');
      console.log('📋 Attempting grid-based click search...\n');
      
      // Try systematic grid search
      await discoverClickableRegions(page);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  test('DISCOVERY 4: Navigate to New Campaign', async ({ page }) => {
    console.log('\n🔍 NAVIGATION TEST: Main Menu → New Campaign');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
    
    const searchTerms = ['NEW CAMPAIGN', 'Campaign', 'NEW GAME', 'Play'];
    
    for (const term of searchTerms) {
      console.log(`🔎 Searching for: "${term}"`);
      const clicked = await clickByText(page, 'MainMenuScene', term);
      
      if (clicked) {
        await page.waitForTimeout(1000);
        
        const currentScenes = await page.evaluate(() => {
          const game = (window as any).game;
          return game?.scene?.getScenes(true)?.map((s: any) => s.scene.key) || [];
        });
        
        console.log(`✅ Clicked "${term}"`);
        console.log(`📍 Current scenes:`, currentScenes);
        
        await screenshot(page, '04-campaign-config');
        
        // If we're in CampaignConfigScene, explore it
        if (currentScenes.includes('CampaignConfigScene')) {
          console.log('\n📊 Exploring Campaign Config Scene...');
          await logSceneObjects(page, 'CampaignConfigScene');
        }
        
        break;
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  test('DISCOVERY 5: Explore all reachable scenes', async ({ page }) => {
    console.log('\n🔍 COMPREHENSIVE SCENE EXPLORATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await page.goto('/');
    await waitForPhaserGame(page);
    
    const allScenes = await getAllScenes(page);
    const scenesToExplore = allScenes.map(s => s.key);
    
    console.log(`📋 Found ${scenesToExplore.length} scenes to explore:\n`);
    
    for (const sceneName of scenesToExplore) {
      console.log(`\n🔍 Attempting to reach: ${sceneName}`);
      console.log('─'.repeat(60));
      
      try {
        // Try to activate the scene programmatically for exploration
        await page.evaluate((name) => {
          const game = (window as any).game;
          if (!game.scene.isActive(name) && game.scene.keys[name]) {
            // Try to start the scene if it exists
            // Note: This may not work for all scenes (some require specific game state)
            try {
              game.scene.start(name);
            } catch (e) {
              console.log(`Could not start ${name}:`, e);
            }
          }
        }, sceneName);
        
        await page.waitForTimeout(1000);
        
        const isActive = await page.evaluate((name) => {
          return (window as any).game?.scene?.isActive(name);
        }, sceneName);
        
        if (isActive) {
          console.log(`✅ ${sceneName} is active, exploring...`);
          await logSceneObjects(page, sceneName);
          await screenshot(page, `scene-${sceneName.toLowerCase()}`);
        } else {
          console.log(`⚠️  ${sceneName} could not be activated (may require game state)`);
        }
        
      } catch (error) {
        console.log(`❌ Error exploring ${sceneName}:`, error);
      }
      
      // Reset to main menu for next iteration
      await page.goto('/');
      await waitForPhaserGame(page);
      await page.waitForTimeout(500);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
});

/**
 * Helper: Discover clickable regions through systematic grid search
 */
async function discoverClickableRegions(page: any) {
  const canvas = await page.locator('canvas');
  const box = await canvas.boundingBox();
  
  if (!box) return;
  
  console.log('🎯 Starting grid-based click discovery...\n');
  
  // Create a 5x5 grid
  const gridSize = 5;
  const clickMap: Array<{x: number, y: number, sceneChange: boolean, newScenes: string[]}> = [];
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = (box.width / (gridSize + 1)) * (col + 1);
      const y = (box.height / (gridSize + 1)) * (row + 1);
      
      // Get current scenes before click
      const beforeScenes = await page.evaluate(() => {
        return (window as any).game?.scene?.getScenes(true)?.map((s: any) => s.scene.key) || [];
      });
      
      // Click
      await page.mouse.click(box.x + x, box.y + y);
      await page.waitForTimeout(300);
      
      // Get scenes after click
      const afterScenes = await page.evaluate(() => {
        return (window as any).game?.scene?.getScenes(true)?.map((s: any) => s.scene.key) || [];
      });
      
      const sceneChanged = JSON.stringify(beforeScenes) !== JSON.stringify(afterScenes);
      
      clickMap.push({
        x: Math.round(x),
        y: Math.round(y),
        sceneChange: sceneChanged,
        newScenes: afterScenes
      });
      
      if (sceneChanged) {
        console.log(`✅ CLICKABLE REGION FOUND at (${Math.round(x)}, ${Math.round(y)})`);
        console.log(`   Scene changed: ${beforeScenes} → ${afterScenes}\n`);
        
        // Take screenshot of new state
        await page.screenshot({ 
          path: `test-results/grid-discovery-${row}-${col}.png` 
        });
        
        // Return to main menu
        await page.goto('/');
        await page.waitForTimeout(1000);
      }
    }
  }
  
  console.log('\n📊 Click Map Summary:');
  console.log(JSON.stringify(clickMap.filter(c => c.sceneChange), null, 2));
}
