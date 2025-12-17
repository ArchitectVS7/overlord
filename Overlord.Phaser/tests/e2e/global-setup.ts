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

async function globalSetup(config: FullConfig) {
  const testAdminEmail = process.env.TEST_ADMIN_EMAIL;
  const testAdminPassword = process.env.TEST_ADMIN_PASSWORD;

  if (!testAdminEmail || !testAdminPassword) {
    console.log('⚠️  TEST_ADMIN_EMAIL or TEST_ADMIN_PASSWORD not set.');
    console.log('   Admin tests will be skipped.');
    console.log('   To run admin tests:');
    console.log('   1. Copy .env.test.example to .env.test');
    console.log('   2. Create a test admin user in Supabase');
    console.log('   3. Set is_admin=true for that user in user_profiles table');
    console.log('   4. Add credentials to .env.test');
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
        // Access the auth service through the game registry or global
        const game = (window as unknown as { game?: unknown }).game as {
          registry?: {
            get?: (key: string) => unknown;
          };
        };

        // Try to get auth service from registry
        let authService = game?.registry?.get?.('authService') as {
          signIn?: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
        };

        // If not in registry, try to import it (may not work depending on bundling)
        if (!authService) {
          // Fallback: Access through window if exposed
          authService = (window as unknown as { authService?: typeof authService }).authService;
        }

        if (authService && authService.signIn) {
          const result = await authService.signIn(email, password);
          if (!result.success) {
            throw new Error(`Login failed: ${result.error}`);
          }
        } else {
          throw new Error('AuthService not accessible');
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

  } catch (error) {
    console.error('❌ Admin authentication setup failed:', error);
    // Don't fail the entire test run, just log the error
    // Tests that require auth will be skipped
  } finally {
    await browser.close();
  }
}

export default globalSetup;
