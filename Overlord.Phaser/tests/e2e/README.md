# E2E Testing with Playwright

This directory contains end-to-end tests using Playwright for browser-based testing of the Overlord game.

## Quick Start

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with visible browser
npm run test:e2e:headed

# Run with interactive UI
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Setting Up Test Admin Account

Admin UI tests require an authenticated admin user. Follow these steps:

### 1. Create Test User in Supabase

Option A: **Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** > **Create New User**
4. Enter:
   - Email: `test-admin@yourproject.com`
   - Password: (secure password)
   - Check "Auto Confirm User"

Option B: **Using SQL Editor**
```sql
-- This creates a user via the auth schema
-- Note: Usually better to use dashboard or signup flow
```

### 2. Set Admin Flag in Database

Run this SQL in Supabase SQL Editor:

```sql
-- Find your test user's ID first
SELECT id, email FROM auth.users WHERE email = 'test-admin@yourproject.com';

-- Then update their profile to be admin
UPDATE public.user_profiles
SET is_admin = true
WHERE user_id = 'YOUR_USER_ID_HERE';

-- Verify it worked
SELECT user_id, username, is_admin FROM public.user_profiles WHERE is_admin = true;
```

### 3. Configure Test Environment

Add test credentials to your root `.env` file (at `Overlord/.env`):

```env
# Existing Supabase config...
SUPABASE_URL=your-url
SUPABASE_ANON_KEY=your-key

# Add test admin credentials
TEST_ADMIN_EMAIL=test-admin@yourproject.com
TEST_ADMIN_PASSWORD=your-secure-password
```

### 4. Run Admin Tests

```bash
npm run test:e2e
```

If credentials are configured correctly, you'll see:
```
🔐 Setting up admin authentication...
📝 Logging in as admin...
✅ Admin login successful
💾 Auth state saved to tests/e2e/.auth/admin.json
```

## Test Structure

```
tests/e2e/
├── README.md              # This file
├── global-setup.ts        # Authenticates admin before tests
├── fixtures/
│   └── auth.fixture.ts    # Authentication fixtures
├── helpers/
│   └── phaser-helpers.ts  # Phaser game interaction utilities
├── game-loading.spec.ts   # Basic game loading tests
└── admin-ui-editor.spec.ts # Admin UI editing tests
```

## Writing Tests

### Basic Test (No Auth)

```typescript
import { test, expect } from '@playwright/test';
import { waitForPhaserGame } from './helpers/phaser-helpers';

test('should load game', async ({ page }) => {
  await page.goto('/');
  await waitForPhaserGame(page);
  // ... assertions
});
```

### Admin Test (With Auth)

```typescript
import { adminTest, hasAdminAuth } from './fixtures/auth.fixture';

// Only run if admin auth is configured
const describeAdmin = hasAdminAuth() ? test.describe : test.describe.skip;

describeAdmin('Admin Feature', () => {
  adminTest('should do admin thing', async ({ adminPage }) => {
    // adminPage is already authenticated as admin
    await adminPage.goto('/');
    // ... test admin features
  });
});
```

## Phaser Helper Functions

```typescript
import {
  waitForPhaserGame,     // Wait for game to boot
  waitForScene,          // Wait for specific scene
  pressGameShortcut,     // Press keyboard shortcut (e.g., Ctrl+Shift+E)
  clickCanvasAt,         // Click at canvas coordinates
  dragOnCanvas,          // Drag from one point to another
  isEditModeActive,      // Check if admin edit mode is on
  getPendingChangesCount // Get unsaved changes count
} from './helpers/phaser-helpers';
```

## Troubleshooting

### Tests Skip with "Admin authentication state not found"

- Ensure `.env.test` exists with valid credentials
- Run `npm run test:e2e` once to generate auth state
- Check Supabase dashboard to verify user exists and is admin

### "AuthService not accessible" Error

The game may need to expose the auth service globally for testing. Add to `main.ts`:

```typescript
// For E2E testing - expose auth service
if (process.env.NODE_ENV !== 'production') {
  (window as any).authService = getAuthService();
}
```

### Tests Timeout Waiting for Scene

- Increase timeout in test: `{ timeout: 60000 }`
- Check if game is loading correctly in headed mode
- Verify dev server is running

### Screenshots Not Saving

- Create `test-results/` directory
- Check write permissions
- Screenshots are saved on failure by default

## CI/CD Integration

For GitHub Actions:

```yaml
- name: Run E2E tests
  run: npm run test:e2e
  env:
    TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}
```
