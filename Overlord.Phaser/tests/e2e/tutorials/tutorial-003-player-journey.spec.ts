/**
 * E2E Test: Tutorial T03 - Complete Player Journey
 *
 * This test validates the COMPLETE player experience from main menu to tutorial completion.
 * It tests every UI element that a player would click through.
 *
 * Player Journey:
 * 1. Main Menu -> Click "TUTORIALS"
 * 2. Tutorials Scene -> Click "First Command" tutorial
 * 3. Tutorial Detail Panel -> Click "Start Scenario"
 * 4. Scenario Game Scene -> Click "Continue" on objectives popup
 * 5. Game World -> Follow tutorial steps to complete
 *
 * This test will FAIL if any required UI element is missing or not clickable.
 * Each failure documents a specific UI gap that needs to be fixed.
 */

import { test, expect } from '@playwright/test';
import {
  waitForPhaserGame,
  waitForScene,
  clickCanvasAt,
  getPhaserCanvas,
} from '../helpers/phaser-helpers';

// Helper to find button by text in Phaser scene
async function findButtonPosition(page: any, buttonText: string): Promise<{ x: number; y: number } | null> {
  return await page.evaluate((text: string) => {
    const game = (window as any).game;
    if (!game || !game.scene) return null;

    // Search all active scenes for text objects
    const scenes = game.scene.getScenes(true);
    for (const scene of scenes) {
      const textObjects = scene.children?.list?.filter(
        (obj: any) => obj.type === 'Text' && obj.text?.includes(text)
      ) || [];

      for (const textObj of textObjects) {
        if (textObj.visible) {
          // Get world position accounting for scroll
          const camera = scene.cameras?.main;
          const scrollX = camera?.scrollX ?? 0;
          const scrollY = camera?.scrollY ?? 0;
          return {
            x: textObj.x - scrollX,
            y: textObj.y - scrollY,
          };
        }
      }
    }
    return null;
  }, buttonText);
}

// Helper to check if a UI panel is visible
async function isPanelVisible(page: any, panelName: string): Promise<boolean> {
  return await page.evaluate((name: string) => {
    const game = (window as any).game;
    if (!game || !game.scene) return false;

    const scenes = game.scene.getScenes(true);
    for (const scene of scenes) {
      // Check for panel by common property names
      const panel = (scene as any)[name] ||
                    (scene as any)[name.charAt(0).toLowerCase() + name.slice(1)];
      if (panel && typeof panel.isVisible === 'function') {
        return panel.isVisible();
      }
      if (panel && panel.visible !== undefined) {
        return panel.visible;
      }
    }
    return false;
  }, panelName);
}

test.describe('Tutorial T03: Complete Player Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
    await waitForScene(page, 'MainMenuScene');
  });

  test('Step 1: TUTORIALS button exists and is clickable on main menu', async ({ page }) => {
    // Screenshot: Main menu
    await page.screenshot({ path: 'test-results/journey-01-main-menu.png' });

    // Find TUTORIALS button
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // TUTORIALS is at centerX, buttonY + buttonSpacing * 2 (third button)
    const centerX = box.width / 2;
    const tutorialsY = box.height * 0.45 + 70 * 2;

    // Click TUTORIALS
    await clickCanvasAt(page, centerX, tutorialsY);
    await page.waitForTimeout(500);

    // Verify TutorialsScene loaded
    await waitForScene(page, 'TutorialsScene', 5000);

    await page.screenshot({ path: 'test-results/journey-02-tutorials-scene.png' });

    const isTutorials = await page.evaluate(() => {
      const game = (window as any).game;
      return game?.scene?.isActive?.('TutorialsScene') === true;
    });
    expect(isTutorials).toBe(true);
  });

  test('Step 2: Tutorial list shows "First Command" and it is clickable', async ({ page }) => {
    // Navigate to TutorialsScene
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);

    // Wait for scenario list to load
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/journey-03-tutorial-list.png' });

    // Check that scenario list panel is visible
    const hasScenarios = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('TutorialsScene');
      const listPanel = (scene as any)?.listPanel;
      if (!listPanel) return { visible: false, count: 0 };

      return {
        visible: listPanel.visible,
        count: listPanel.getScenarioCards?.()?.length ?? 0,
      };
    });

    expect(hasScenarios.visible).toBe(true);
    expect(hasScenarios.count).toBeGreaterThan(0);

    // Find and click "First Command" tutorial (first card in list)
    // Cards are positioned in a list, first card should be near top of panel
    // Panel is centered, cards start at ~y=50 within panel
    const panelX = centerX; // Panel is centered
    const firstCardY = box.height / 2 - 150; // Approximate position of first card

    await clickCanvasAt(page, panelX, firstCardY);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/journey-04-tutorial-selected.png' });

    // Verify detail panel is now showing
    const detailVisible = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('TutorialsScene');
      const detailPanel = (scene as any)?.detailPanel;
      return detailPanel?.visible === true;
    });

    expect(detailVisible).toBe(true);
  });

  test('Step 3: "Start Scenario" button is clickable and launches ScenarioGameScene', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Navigate to Tutorials
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(1000);

    // Click first tutorial card
    const firstCardY = box.height / 2 - 150;
    await clickCanvasAt(page, centerX, firstCardY);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/journey-05-detail-panel.png' });

    // Click "Start Scenario" button (left button at bottom of detail panel)
    // Detail panel is 500x600 centered, buttons are at bottom
    const startButtonX = centerX - 100; // Left of center (two buttons side by side)
    const startButtonY = box.height / 2 + 250; // Near bottom of panel

    await clickCanvasAt(page, startButtonX, startButtonY);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/journey-06-scenario-game.png' });

    // Verify ScenarioGameScene is now active
    const isScenarioGame = await page.evaluate(() => {
      const game = (window as any).game;
      return game?.scene?.isActive?.('ScenarioGameScene') === true;
    });

    expect(isScenarioGame).toBe(true);
  });

  test('Step 4: Objectives panel shows and "Continue" button works', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Quick navigation to ScenarioGameScene
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(1000);
    await clickCanvasAt(page, centerX, box.height / 2 - 150);
    await page.waitForTimeout(500);
    await clickCanvasAt(page, centerX - 100, box.height / 2 + 250);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/journey-07-objectives.png' });

    // Check objectives panel is visible
    const objectivesVisible = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      const panel = (scene as any)?.objectivesPanel;
      return panel?.visible === true || panel?.isVisible?.() === true;
    });

    expect(objectivesVisible).toBe(true);

    // Get victory condition text (should NOT say "unknown")
    const objectivesContent = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      const panel = (scene as any)?.objectivesPanel;

      // Try to get text from panel
      if (panel?.container?.list) {
        const textObjects = panel.container.list.filter((obj: any) => obj.type === 'Text');
        return textObjects.map((t: any) => t.text).join(' | ');
      }
      return 'Could not read objectives';
    });

    console.log('Objectives content:', objectivesContent);

    // Should not contain "unknown" after our VictoryConditionSystem fix
    expect(objectivesContent.toLowerCase()).not.toContain('unknown');

    // Click Continue button (should be at bottom center of objectives panel)
    const continueY = box.height / 2 + 150; // Below panel center
    await clickCanvasAt(page, centerX, continueY);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/journey-08-game-started.png' });

    // Objectives panel should now be hidden
    const objectivesHidden = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      const panel = (scene as any)?.objectivesPanel;
      return panel?.visible === false || panel?.isVisible?.() === false;
    });

    expect(objectivesHidden).toBe(true);
  });

  test('Step 5: Tutorial step panel shows tutorial text', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Navigate to ScenarioGameScene and dismiss objectives
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(1000);
    await clickCanvasAt(page, centerX, box.height / 2 - 150);
    await page.waitForTimeout(500);
    await clickCanvasAt(page, centerX - 100, box.height / 2 + 250);
    await page.waitForTimeout(1500);
    await clickCanvasAt(page, centerX, box.height / 2 + 150); // Dismiss objectives
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/journey-09-tutorial-panel.png' });

    // Check tutorial step panel is visible
    const tutorialPanelState = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');
      const panel = (scene as any)?.tutorialStepPanel;

      if (!panel) {
        return { exists: false, visible: false, text: '' };
      }

      // Try to get the instruction text
      const instructionText = panel.instructionText?.text ?? '';
      const stepText = panel.stepText?.text ?? '';

      return {
        exists: true,
        visible: panel.visible === true || panel.isVisible?.() === true,
        text: instructionText,
        stepCounter: stepText,
      };
    });

    console.log('Tutorial panel state:', tutorialPanelState);

    expect(tutorialPanelState.exists).toBe(true);
    expect(tutorialPanelState.visible).toBe(true);
    expect(tutorialPanelState.text.length).toBeGreaterThan(0);
  });

  test('Step 6: Game world has clickable planets', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Navigate to ScenarioGameScene and dismiss objectives
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(1000);
    await clickCanvasAt(page, centerX, box.height / 2 - 150);
    await page.waitForTimeout(500);
    await clickCanvasAt(page, centerX - 100, box.height / 2 + 250);
    await page.waitForTimeout(1500);
    await clickCanvasAt(page, centerX, box.height / 2 + 150);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'test-results/journey-10-game-world.png' });

    // Check if there are any interactive planet objects in the scene
    const planetInfo = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');

      if (!scene) return { hasPlanets: false, planetCount: 0, interactiveCount: 0 };

      // Look for planet-like objects (circles, sprites named planet, etc.)
      let planetCount = 0;
      let interactiveCount = 0;

      const children = scene.children?.list || [];
      for (const child of children) {
        const name = child.name?.toLowerCase() || '';
        const type = child.type?.toLowerCase() || '';

        // Check if it looks like a planet
        if (name.includes('planet') || type === 'arc' || type === 'circle') {
          planetCount++;
          if (child.input?.enabled) {
            interactiveCount++;
          }
        }
      }

      // Also check for galaxy property
      const galaxy = (scene as any).galaxy;
      const galaxyPlanets = galaxy?.planets?.length ?? 0;

      return {
        hasPlanets: planetCount > 0 || galaxyPlanets > 0,
        planetCount: Math.max(planetCount, galaxyPlanets),
        interactiveCount,
      };
    });

    console.log('Planet info:', planetInfo);

    // CRITICAL: This test will fail if there are no planets rendered
    // This documents a major UI gap that needs to be fixed
    expect(planetInfo.hasPlanets).toBe(true);
    expect(planetInfo.planetCount).toBeGreaterThan(0);
  });

  test('Step 7: Clicking planet opens Planet Info Panel', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Navigate to ScenarioGameScene and dismiss objectives
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(1000);
    await clickCanvasAt(page, centerX, box.height / 2 - 150);
    await page.waitForTimeout(500);
    await clickCanvasAt(page, centerX - 100, box.height / 2 + 250);
    await page.waitForTimeout(1500);
    await clickCanvasAt(page, centerX, box.height / 2 + 150);
    await page.waitForTimeout(500);

    // Get planet position from game state
    const planetPos = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');

      // Check for gameState with planets
      const gameState = (scene as any)?.gameState;
      if (gameState?.planets?.[0]) {
        const planet = gameState.planets[0];
        return {
          x: planet.position?.x ?? box.width / 2,
          y: planet.position?.z ?? box.height / 2,
          found: true,
        };
      }

      // Fallback: return center of screen
      return { x: 512, y: 384, found: false };
    });

    console.log('Planet position:', planetPos);

    if (planetPos.found) {
      // Click on the planet
      await clickCanvasAt(page, planetPos.x, planetPos.y);
      await page.waitForTimeout(500);

      await page.screenshot({ path: 'test-results/journey-11-planet-clicked.png' });

      // Check if Planet Info Panel opened
      const panelOpened = await page.evaluate(() => {
        const game = (window as any).game;
        const scene = game?.scene?.getScene?.('ScenarioGameScene');
        const panel = (scene as any)?.planetInfoPanel;
        return panel?.visible === true || panel?.isVisible?.() === true;
      });

      expect(panelOpened).toBe(true);
    } else {
      // No planets found - this test documents the missing feature
      console.log('WARNING: No planets found in ScenarioGameScene - game world not rendered');
      expect(planetPos.found).toBe(true); // This will fail, documenting the issue
    }
  });

  test('Complete journey summary - list all missing UI elements', async ({ page }) => {
    const canvas = await getPhaserCanvas(page);
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    const centerX = box.width / 2;

    // Navigate to ScenarioGameScene
    await clickCanvasAt(page, centerX, box.height * 0.45 + 70 * 2);
    await page.waitForTimeout(500);
    await waitForScene(page, 'TutorialsScene', 5000);
    await page.waitForTimeout(1000);
    await clickCanvasAt(page, centerX, box.height / 2 - 150);
    await page.waitForTimeout(500);
    await clickCanvasAt(page, centerX - 100, box.height / 2 + 250);
    await page.waitForTimeout(1500);
    await clickCanvasAt(page, centerX, box.height / 2 + 150);
    await page.waitForTimeout(500);

    // Audit all expected UI elements
    const uiAudit = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('ScenarioGameScene');

      if (!scene) {
        return { sceneExists: false, elements: {} };
      }

      return {
        sceneExists: true,
        elements: {
          // Game state
          gameState: !!(scene as any).gameState,
          planets: (scene as any).gameState?.planets?.length ?? 0,
          craft: (scene as any).gameState?.craft?.length ?? 0,

          // Panels
          objectivesPanel: !!(scene as any).objectivesPanel,
          tutorialStepPanel: !!(scene as any).tutorialStepPanel,
          tutorialHighlight: !!(scene as any).tutorialHighlight,
          planetInfoPanel: !!(scene as any).planetInfoPanel,
          resultsPanel: !!(scene as any).resultsPanel,

          // Game rendering
          galaxy: !!(scene as any).galaxy,
          planetSprites: (scene as any).planetSprites?.length ?? 0,
          craftSprites: (scene as any).craftSprites?.length ?? 0,

          // Interactive elements
          hasInteractiveChildren: scene.children?.list?.some((c: any) => c.input?.enabled) ?? false,
        },
      };
    });

    console.log('=== UI AUDIT RESULTS ===');
    console.log(JSON.stringify(uiAudit, null, 2));

    // Document what's missing
    const missing: string[] = [];

    if (!uiAudit.elements.gameState) missing.push('GameState not initialized');
    if (uiAudit.elements.planets === 0) missing.push('No planets in game state');
    if (!uiAudit.elements.galaxy) missing.push('Galaxy not rendered');
    if (uiAudit.elements.planetSprites === 0) missing.push('No planet sprites rendered');
    if (!uiAudit.elements.planetInfoPanel) missing.push('PlanetInfoPanel not created');
    if (!uiAudit.elements.hasInteractiveChildren) missing.push('No interactive game elements');

    if (missing.length > 0) {
      console.log('=== MISSING UI ELEMENTS ===');
      for (const item of missing) {
        console.log(`- ${item}`);
      }
    }

    await page.screenshot({ path: 'test-results/journey-final-audit.png' });

    // The test passes but logs what's missing
    // This serves as documentation for what needs to be implemented
    expect(uiAudit.sceneExists).toBe(true);
  });
});
