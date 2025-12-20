import { test, expect } from '@playwright/test';
import { waitForPhaserGame, clickCanvasAt } from './helpers/phaser-helpers';

/**
 * Debug test for planet info panel button interactions
 */
test.describe('Planet Info Panel Button Debug', () => {
  test('click Build button and check what happens', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Go to the game
    await page.goto('http://localhost:8080');
    await waitForPhaserGame(page);
    await page.waitForTimeout(2000);

    // Take screenshot of initial state
    await page.screenshot({ path: 'debug-step0-initial.png' });

    // Start a new campaign directly via game API
    console.log('Starting campaign directly via game API...');
    await page.evaluate(() => {
      const game = (window as any).game;
      // Stop any running scenes first to avoid overlap
      game.scene.getScenes(true).forEach((scene: any) => {
        if (scene.scene.key !== 'BootScene') {
          game.scene.stop(scene.scene.key);
        }
      });
      // Start CampaignConfigScene
      game.scene.start('CampaignConfigScene');
    });
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: 'debug-step1-config-scene.png' });

    // Now start the campaign from config scene
    await page.evaluate(() => {
      const game = (window as any).game;
      const configScene = game.scene.getScene('CampaignConfigScene');
      // Find and click the start button or directly start galaxy
      if (configScene?.startCampaign) {
        configScene.startCampaign();
      } else {
        // Fallback: directly start GalaxyMapScene
        game.scene.start('GalaxyMapScene');
      }
    });
    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'debug-step2-after-start.png' });

    // Check if we're on GalaxyMapScene
    const sceneInfo = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        hasScene: !!scene,
        gameState: scene?.gameState ? {
          currentPhase: scene.gameState.currentPhase,
          currentTurn: scene.gameState.currentTurn,
          planetCount: scene.gameState.planets?.length
        } : null
      };
    });
    console.log('Scene info:', sceneInfo);

    if (!sceneInfo.hasScene) {
      console.log('GalaxyMapScene not active, taking screenshot and stopping');
      await page.screenshot({ path: 'debug-no-galaxymap.png' });
      return;
    }

    // Wait for Action phase
    await page.waitForTimeout(1000);

    // Get the selected planet info and panel state
    const gameInfo = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      if (!scene) return null;

      return {
        selectedPlanetId: scene.selectedPlanetId,
        planetInfoPanel: {
          visible: scene.planetInfoPanel?.visible,
          x: scene.planetInfoPanel?.x,
          y: scene.planetInfoPanel?.y,
        },
        planets: scene.gameState?.planets?.map((p: any) => ({
          id: p.id,
          name: p.name,
          owner: p.owner,
          x: p.position?.x,
          z: p.position?.z
        }))
      };
    });
    console.log('Game info:', JSON.stringify(gameInfo, null, 2));

    // Find home planet
    const homePlanet = gameInfo?.planets?.find((p: any) => p.owner === 'Player');
    if (!homePlanet) {
      console.log('No player planet found!');
      return;
    }
    console.log('Home planet:', homePlanet);

    // Get screen coordinates by accounting for camera position
    const screenCoords = await page.evaluate((planetId: number) => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      if (!scene) return null;

      const camera = scene.cameras.main;
      const planet = scene.gameState.planets.find((p: any) => p.id === planetId);
      if (!planet) return null;

      // World to screen: screenX = worldX - camera.scrollX + camera.width/2
      // Actually Phaser: screenX = (worldX - scrollX) * zoom
      const screenX = (planet.position.x - camera.scrollX);
      const screenY = (planet.position.z - camera.scrollY);

      return {
        worldX: planet.position.x,
        worldZ: planet.position.z,
        cameraScrollX: camera.scrollX,
        cameraScrollY: camera.scrollY,
        cameraWidth: camera.width,
        cameraHeight: camera.height,
        screenX,
        screenY
      };
    }, homePlanet.id);
    console.log('Screen coords:', screenCoords);

    if (!screenCoords) {
      console.log('Could not calculate screen coordinates');
      return;
    }

    // Click on the home planet using screen coordinates
    console.log(`Clicking planet at screen (${screenCoords.screenX}, ${screenCoords.screenY})`);
    await clickCanvasAt(page, screenCoords.screenX, screenCoords.screenY);
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'debug-step3-after-planet-click.png' });

    // Check panel state
    const panelState = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      const panel = scene?.planetInfoPanel;
      if (!panel) return null;

      // Get content container and action buttons
      const contentContainer = panel.contentContainer;
      const actionButtons = panel.actionButtons || [];

      return {
        panelVisible: panel.visible,
        panelX: panel.x,
        panelY: panel.y,
        panelDepth: panel.depth,
        contentContainerX: contentContainer?.x,
        contentContainerY: contentContainer?.y,
        buttonCount: actionButtons.length,
        buttons: actionButtons.map((btn: any) => ({
          label: btn.getData?.('label'),
          disabled: btn.getData?.('disabled'),
          x: btn.x,
          y: btn.y,
          visible: btn.visible
        }))
      };
    });
    console.log('Panel state:', JSON.stringify(panelState, null, 2));

    if (!panelState?.panelVisible) {
      console.log('Panel not visible!');
      return;
    }

    // Calculate Build button position
    // Panel is at panelX, panelY
    // contentContainer is at panelX + contentContainerX, panelY + contentContainerY (offset by PADDING)
    // Buttons are inside contentContainer
    const buildButton = panelState.buttons?.find((b: any) => b.label === 'Build');
    if (!buildButton) {
      console.log('Build button not found!');
      return;
    }

    // Button position: panel.x + PADDING + button.x + buttonWidth/2
    // PADDING is 16 based on the code
    const PADDING = 16;
    const buttonWidth = 115;
    const buttonHeight = 36;
    const clickX = panelState.panelX + PADDING + buildButton.x + buttonWidth / 2;
    const clickY = panelState.panelY + PADDING + buildButton.y + buttonHeight / 2;

    console.log(`Build button local pos: (${buildButton.x}, ${buildButton.y})`);
    console.log(`Calculated click position: (${clickX}, ${clickY})`);

    // First, let's test if the close button works (it's at top-right of panel)
    const PANEL_WIDTH = 280;  // Same as in PlanetInfoPanel.ts
    const closeButtonX = panelState.panelX + PANEL_WIDTH - 25;
    const closeButtonY = panelState.panelY + 15;
    console.log(`Close button position: (${closeButtonX}, ${closeButtonY})`);

    // Try clicking close button to see if ANY panel interaction works
    const canvas = await page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas not found');

    // Check panel visibility before close button click
    const beforeClose = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return scene?.planetInfoPanel?.visible;
    });
    console.log('Panel visible before close click:', beforeClose);

    // Click close button
    await page.mouse.move(box.x + closeButtonX, box.y + closeButtonY);
    await page.waitForTimeout(100);
    await page.mouse.click(box.x + closeButtonX, box.y + closeButtonY);
    await page.waitForTimeout(300);

    // Check if panel closed
    const afterClose = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return scene?.planetInfoPanel?.visible;
    });
    console.log('Panel visible after close click:', afterClose);

    // Get information about the button zone's world transform
    const zoneInfo = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      const panel = scene?.planetInfoPanel;
      if (!panel) return { error: 'No panel' };

      // Find the Build button container
      const actionButtons = panel.actionButtons || [];
      const buildButton = actionButtons.find((btn: any) => btn.getData?.('label') === 'Build');
      if (!buildButton) return { error: 'No build button' };

      // Find the zone inside the button container
      const zone = buildButton.getAll().find((c: any) => c.type === 'Zone');
      if (!zone) return { error: 'No zone' };

      // Get zone's world position using transform matrix
      const worldMatrix = zone.getWorldTransformMatrix();
      const worldPos = worldMatrix.transformPoint(0, 0);

      // Get input hit area info
      const hitArea = zone.input?.hitArea;

      return {
        zoneLocalX: zone.x,
        zoneLocalY: zone.y,
        zoneWidth: zone.width,
        zoneHeight: zone.height,
        worldX: worldPos.x,
        worldY: worldPos.y,
        hitAreaX: hitArea?.x,
        hitAreaY: hitArea?.y,
        hitAreaWidth: hitArea?.width,
        hitAreaHeight: hitArea?.height,
        panelScrollFactorX: panel.scrollFactorX,
        panelScrollFactorY: panel.scrollFactorY,
        cameraScrollX: scene.cameras.main.scrollX,
        cameraScrollY: scene.cameras.main.scrollY,
      };
    });
    console.log('Zone world transform info:', JSON.stringify(zoneInfo, null, 2));

    // If close button worked, reopen panel and try Build button
    if (!afterClose) {
      console.log('Close button worked! Reopening panel...');
      await clickCanvasAt(page, screenCoords.screenX, screenCoords.screenY);
      await page.waitForTimeout(500);
    }

    // Now click Build button
    console.log('About to click Build button at canvas coordinates...');
    await page.mouse.move(box.x + clickX, box.y + clickY);
    await page.waitForTimeout(100);
    await page.mouse.click(box.x + clickX, box.y + clickY);
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({ path: 'debug-step4-after-build-click.png' });

    // Check results
    const afterClick = await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game?.scene?.getScene?.('GalaxyMapScene');
      return {
        planetInfoPanelVisible: scene?.planetInfoPanel?.visible,
        buildingMenuPanelVisible: scene?.buildingMenuPanel?.visible,
      };
    });
    console.log('After Build click:', afterClick);

    // If canvas click didn't work, try triggering via game API directly
    if (!afterClick.buildingMenuPanelVisible) {
      console.log('Canvas click did not trigger BuildingMenuPanel. Trying direct API call...');

      const directResult = await page.evaluate(() => {
        const game = (window as any).game;
        const scene = game?.scene?.getScene?.('GalaxyMapScene');
        const panel = scene?.planetInfoPanel;
        const planet = scene?.gameState?.planets?.[0];

        // Check if onBuildClick callback exists
        const hasCallback = !!panel?.onBuildClick;

        // Try to call onBuildClick directly
        if (panel?.onBuildClick && planet) {
          console.log('Calling onBuildClick directly...');
          panel.onBuildClick(planet);
        }

        return {
          hasOnBuildClick: hasCallback,
          buildingMenuPanelVisible: scene?.buildingMenuPanel?.visible,
          buildingMenuPanelExists: !!scene?.buildingMenuPanel,
        };
      });
      console.log('Direct API result:', directResult);

      await page.waitForTimeout(500);

      // Final check
      const finalState = await page.evaluate(() => {
        const game = (window as any).game;
        const scene = game?.scene?.getScene?.('GalaxyMapScene');
        return {
          buildingMenuPanelVisible: scene?.buildingMenuPanel?.visible,
        };
      });
      console.log('Final state after direct call:', finalState);
    }
  });
});
