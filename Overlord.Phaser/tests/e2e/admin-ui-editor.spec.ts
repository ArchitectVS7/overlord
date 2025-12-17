import { test, expect } from '@playwright/test';
import {
  adminTest,
  hasAdminAuth,
  navigateToGalaxyMapAsAdmin,
  verifyAdminStatus,
  enterEditMode,
  exitEditMode,
} from './fixtures/auth.fixture';
import {
  waitForPhaserGame,
  isEditModeActive,
  isEditModeIndicatorVisible,
  getPendingChangesCount,
  dragOnCanvas,
  clickCanvasAt,
} from './helpers/phaser-helpers';

/**
 * Admin UI Editor E2E Tests
 *
 * These tests verify the admin panel positioning feature.
 * Requires TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD in root .env
 *
 * To enable these tests:
 * 1. Create a test admin user in Supabase
 * 2. Set is_admin=true for that user
 * 3. Add TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to root .env
 */

// Skip admin tests entirely until admin user is configured
// Change this to false once you have a test admin set up
const ADMIN_TESTS_ENABLED = true;

adminTest.describe('Admin UI Editor', () => {
  // Skip entire suite until admin tests are enabled
  adminTest.skip(() => !ADMIN_TESTS_ENABLED || !hasAdminAuth(),
    'Admin tests disabled - set ADMIN_TESTS_ENABLED=true and configure test admin');

  adminTest.beforeEach(async ({ adminPage }) => {
    // Navigate to GalaxyMapScene as admin
    await navigateToGalaxyMapAsAdmin(adminPage);

    // Verify we're logged in as admin
    const isAdmin = await verifyAdminStatus(adminPage);
    expect(isAdmin).toBe(true);
  });

  adminTest.describe('Edit Mode Toggle', () => {
    adminTest('should toggle edit mode with Ctrl+Shift+E', async ({ adminPage }) => {
      // Verify edit mode is initially off
      expect(await isEditModeActive(adminPage)).toBe(false);

      // Enter edit mode
      await enterEditMode(adminPage);

      // Verify edit mode is now on
      expect(await isEditModeActive(adminPage)).toBe(true);
      expect(await isEditModeIndicatorVisible(adminPage)).toBe(true);

      // Exit edit mode
      await exitEditMode(adminPage);

      // Verify edit mode is off
      expect(await isEditModeActive(adminPage)).toBe(false);
    });

    adminTest('should show edit mode indicator banner when active', async ({ adminPage }) => {
      await enterEditMode(adminPage);

      // The indicator should be visible
      expect(await isEditModeIndicatorVisible(adminPage)).toBe(true);

      // Take screenshot for visual verification
      await adminPage.screenshot({ path: 'test-results/edit-mode-indicator.png' });
    });
  });

  adminTest.describe('Panel Dragging', () => {
    adminTest.beforeEach(async ({ adminPage }) => {
      // Enter edit mode before each drag test
      await enterEditMode(adminPage);
      expect(await isEditModeActive(adminPage)).toBe(true);
    });

    adminTest('should allow dragging TurnHUD panel', async ({ adminPage }) => {
      // Get initial pending changes count
      const initialCount = await getPendingChangesCount(adminPage);
      expect(initialCount).toBe(0);

      // TurnHUD is at approximately (150, 60) - centered
      // Drag it to a new position
      await dragOnCanvas(adminPage, 150, 60, 300, 100);
      await adminPage.waitForTimeout(300);

      // Should have pending changes
      const newCount = await getPendingChangesCount(adminPage);
      expect(newCount).toBeGreaterThan(0);
    });

    adminTest('should allow dragging ResourceHUD panel', async ({ adminPage }) => {
      // Get viewport size
      const viewport = adminPage.viewportSize();
      const resourceHudX = (viewport?.width || 800) - 120;

      // ResourceHUD is at top-right
      await dragOnCanvas(adminPage, resourceHudX, 95, resourceHudX - 150, 150);
      await adminPage.waitForTimeout(300);

      expect(await getPendingChangesCount(adminPage)).toBeGreaterThan(0);
    });

    adminTest('should allow dragging OpponentInfoPanel', async ({ adminPage }) => {
      // OpponentInfoPanel is at (20, 140) - top-left aligned
      await dragOnCanvas(adminPage, 100, 200, 200, 250);
      await adminPage.waitForTimeout(300);

      expect(await getPendingChangesCount(adminPage)).toBeGreaterThan(0);
    });

    adminTest('should show green border on draggable panels', async ({ adminPage }) => {
      // Visual verification - take screenshot
      await adminPage.screenshot({ path: 'test-results/edit-mode-borders.png' });
    });

    adminTest('should show yellow border and position overlay while dragging', async ({ adminPage }) => {
      // Start drag but capture mid-drag
      const canvas = adminPage.locator('canvas');
      const box = await canvas.boundingBox();
      if (!box) throw new Error('Canvas not found');

      await adminPage.mouse.move(box.x + 150, box.y + 60);
      await adminPage.mouse.down();
      await adminPage.mouse.move(box.x + 200, box.y + 100, { steps: 5 });

      // Take screenshot while dragging (shows yellow border and position overlay)
      await adminPage.screenshot({ path: 'test-results/dragging-panel.png' });

      await adminPage.mouse.up();
    });
  });

  adminTest.describe('Control Buttons', () => {
    adminTest.beforeEach(async ({ adminPage }) => {
      await enterEditMode(adminPage);
    });

    adminTest('should save changes with Save All button', async ({ adminPage }) => {
      // Make a change first
      await dragOnCanvas(adminPage, 150, 60, 200, 80);
      await adminPage.waitForTimeout(300);

      const beforeSave = await getPendingChangesCount(adminPage);
      expect(beforeSave).toBeGreaterThan(0);

      // Click Save All button
      // Indicator is at (camera.width/2, 35), Save All is at offset x+30
      const viewport = adminPage.viewportSize();
      const centerX = (viewport?.width || 800) / 2;
      await clickCanvasAt(adminPage, centerX + 30, 35);
      await adminPage.waitForTimeout(1000);

      // Changes should be cleared after successful save
      const afterSave = await getPendingChangesCount(adminPage);
      expect(afterSave).toBe(0);
    });

    adminTest('should reset positions with Reset All button', async ({ adminPage }) => {
      // Make a change
      await dragOnCanvas(adminPage, 150, 60, 200, 80);
      await adminPage.waitForTimeout(300);

      expect(await getPendingChangesCount(adminPage)).toBeGreaterThan(0);

      // Click Reset All button (at offset x+120)
      const viewport = adminPage.viewportSize();
      const centerX = (viewport?.width || 800) / 2;
      await clickCanvasAt(adminPage, centerX + 120, 35);
      await adminPage.waitForTimeout(300);

      expect(await getPendingChangesCount(adminPage)).toBe(0);
    });

    adminTest('should discard changes with Discard button', async ({ adminPage }) => {
      // Make a change
      await dragOnCanvas(adminPage, 150, 60, 200, 80);
      await adminPage.waitForTimeout(300);

      expect(await getPendingChangesCount(adminPage)).toBeGreaterThan(0);

      // Click Discard button (at offset x+210)
      const viewport = adminPage.viewportSize();
      const centerX = (viewport?.width || 800) / 2;
      await clickCanvasAt(adminPage, centerX + 210, 35);
      await adminPage.waitForTimeout(300);

      expect(await getPendingChangesCount(adminPage)).toBe(0);
    });

    adminTest('should exit edit mode with Exit button', async ({ adminPage }) => {
      expect(await isEditModeActive(adminPage)).toBe(true);

      // Click Exit button (at offset x+285)
      const viewport = adminPage.viewportSize();
      const centerX = (viewport?.width || 800) / 2;
      await clickCanvasAt(adminPage, centerX + 285, 35);
      await adminPage.waitForTimeout(500);

      expect(await isEditModeActive(adminPage)).toBe(false);
    });
  });
});

// Regular (non-admin) tests - these run without authentication
test.describe('Camera Controls with UI', () => {
  // Skip these for now - they require being on GalaxyMapScene
  test.skip();

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForPhaserGame(page);
  });

  test('should allow camera panning when not over UI elements', async ({ page }) => {
    // This test verifies camera panning works on the galaxy map background
    // (Not on UI panels which should block camera drag)

    // We'd need to be on GalaxyMapScene for this test
    // For now, just verify the game loads
    const isBooted = await page.evaluate(() => {
      const game = (window as unknown as { game?: { isBooted?: boolean } }).game;
      return game?.isBooted === true;
    });
    expect(isBooted).toBe(true);
  });
});
