/**
 * Playwright Global Setup
 *
 * This runs once before all tests to set up authentication state.
 * It logs in as admin and saves the browser storage state for reuse.
 */

import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from root .env
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const STORAGE_STATE_PATH = path.resolve(__dirname, '.auth/admin.json');

async function setupGuestMode() {
  console.log('🎮 Setting up guest mode for tests...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the app
    await page.goto('http://localhost:8080');

    // Wait for the game to load
    await page.waitForFunction(
      () => {
        const game = (window as unknown as { game?: { isBooted?: boolean } }).game;
        return game && game.isBooted;
      },
      { timeout: 30000 }
    );

    // Wait for initialization
    await page.waitForTimeout(2000);

    // Enter guest mode
    await page.evaluate(() => {
      const getGuestModeService = (window as unknown as {
        getGuestModeService?: () => {
          enterGuestMode?: (username?: string) => void;
        };
      }).getGuestModeService;

      if (getGuestModeService) {
        const guestService = getGuestModeService();
        guestService.enterGuestMode?.('TestGuest');
      }
    });

    await page.waitForTimeout(1000);

    // Create auth directory if it doesn't exist
    const authDir = path.dirname(STORAGE_STATE_PATH);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // Save the storage state
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log('✅ Guest mode setup complete');
  } catch (error) {
    console.error('❌ Guest mode setup failed:', error);
  } finally {
    await browser.close();
  }
}

async function globalSetup(config: FullConfig) {
  const testAdminEmail = process.env.TEST_ADMIN_EMAIL;
  const testAdminPassword = process.env.TEST_ADMIN_PASSWORD;

  if (!testAdminEmail || !testAdminPassword) {
    console.log('⚠️  TEST_ADMIN_EMAIL or TEST_ADMIN_PASSWORD not set.');
    console.log('   Using guest mode for tests.');
    console.log('   To run admin tests with full auth:');
    console.log('   1. Copy .env.test.example to .env.test');
    console.log('   2. Create a test admin user in Supabase');
    console.log('   3. Set is_admin=true for that user in user_profiles table');
    console.log('   4. Add credentials to .env.test');

    // Set up guest mode instead
    await setupGuestMode();
    return;
  }

  console.log('🔐 Setting up admin authentication...');

  // Create auth directory if it doesn't exist
  const authDir = path.dirname(STORAGE_STATE_PATH);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let success = false;

  try {
    // Navigate to the app
    const baseURL = config.projects[0].use?.baseURL || 'http://localhost:8080';
    await page.goto(baseURL);

    // Wait for the game to load
    await page.waitForFunction(
      () => {
        const game = (window as unknown as { game?: { isBooted?: boolean } }).game;
        return game && game.isBooted;
      },
      { timeout: 30000 }
    );

    // Wait for auth scene or main menu
    await page.waitForTimeout(2000);

    // Check if we need to log in (AuthScene is active)
    const isAuthScene = await page.evaluate(() => {
      const game = (window as unknown as { game?: { scene?: { isActive?: (name: string) => boolean } } }).game;
      return game?.scene?.isActive?.('AuthScene') === true;
    });

    if (isAuthScene) {
      console.log('📝 Logging in as admin...');

      // The AuthScene has email and password input fields
      // We need to interact with Phaser's input system
      // Since Phaser renders to canvas, we'll inject credentials via the auth service

      await page.evaluate(async ({ email, password }) => {
        // Access the auth service through window.getAuthService
        const getAuthService = (window as unknown as {
          getAuthService?: () => {
            signIn?: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
          };
        }).getAuthService;

        if (!getAuthService) {
          throw new Error('getAuthService not found on window');
        }

        const authService = getAuthService();

        if (!authService || !authService.signIn) {
          throw new Error('AuthService not accessible');
        }

        const result = await authService.signIn(email, password);
        if (!result.success) {
          throw new Error(`Login failed: ${result.error}`);
        }
      }, { email: testAdminEmail, password: testAdminPassword });

      // Wait for navigation to complete
      await page.waitForTimeout(2000);

      console.log('✅ Admin login successful');
    } else {
      console.log('ℹ️  Already authenticated or auth not required');
    }

    // Save the storage state (includes localStorage with auth token)
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log(`💾 Auth state saved to ${STORAGE_STATE_PATH}`);
    success = true;

  } catch (error) {
    console.error('❌ Admin authentication setup failed:', error);
    console.log('   Falling back to guest mode...');
  } finally {
    await browser.close();
  }

  // If admin auth failed, set up guest mode instead
  if (!success) {
    await setupGuestMode();
  }
}

export default globalSetup;
