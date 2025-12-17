# Database Connection Test Guide

## What Was Added

I've implemented a simple database connection test that runs automatically when the game starts:

1. **Supabase Client** (`Overlord.Phaser/src/services/SupabaseClient.ts`)
   - Singleton client instance
   - Environment variable validation
   - Database connection test function

2. **BootScene Integration** (`Overlord.Phaser/src/scenes/BootScene.ts`)
   - Automatically checks environment variables on startup
   - Tests database connection
   - Logs results to browser console

## How to Test

### Local Testing (Without Supabase)

```bash
cd Overlord.Phaser
npm start
```

**Expected Console Output:**
```
================================================================================
OVERLORD - Database Connection Test
================================================================================
❌ Missing environment variables: [ 'SUPABASE_URL', 'SUPABASE_ANON_KEY' ]
   Supabase features will not work until these are configured.
   See DEPLOYMENT_PLAN.md for setup instructions.
================================================================================
```

### Local Testing (With Supabase - Optional)

1. **Create `.env` file** in `Overlord.Phaser/` directory:
   ```bash
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Install dotenv-webpack** (needed for local .env support):
   ```bash
   cd Overlord.Phaser
   npm install --save-dev dotenv-webpack
   ```

3. **Update webpack.config.js** - Add at the top:
   ```javascript
   const Dotenv = require('dotenv-webpack');
   ```

   Then add to plugins array:
   ```javascript
   new Dotenv()
   ```

4. **Restart dev server**:
   ```bash
   npm start
   ```

**Expected Console Output (if connection succeeds):**
```
================================================================================
OVERLORD - Database Connection Test
================================================================================
✅ Environment variables configured
🔄 Testing database connection...
✅ Successfully connected to Supabase database!
   Database is ready for use!
================================================================================
```

### Testing on Vercel (Production)

After deploying with correct environment variables:

1. **Go to your deployed Vercel URL**
2. **Open browser DevTools** (F12)
3. **Go to Console tab**
4. **Refresh the page**

**Expected Console Output (if variables are correct):**
```
================================================================================
OVERLORD - Database Connection Test
================================================================================
✅ Environment variables configured
🔄 Testing database connection...
✅ Successfully connected to Supabase database!
   Database is ready for use!
================================================================================
```

**If variables are missing or incorrect:**
```
================================================================================
OVERLORD - Database Connection Test
================================================================================
❌ Missing environment variables: [ 'SUPABASE_URL', 'SUPABASE_ANON_KEY' ]
   Supabase features will not work until these are configured.
   See DEPLOYMENT_PLAN.md for setup instructions.
================================================================================
```

**If variables exist but connection fails:**
```
================================================================================
OVERLORD - Database Connection Test
================================================================================
✅ Environment variables configured
🔄 Testing database connection...
❌ Database query failed: [error message here]
   Error details: [detailed error object]
   Game will continue with local storage only.
================================================================================
```

## What the Test Does

1. **Environment Variable Check**:
   - Verifies `SUPABASE_URL` exists
   - Verifies `SUPABASE_ANON_KEY` exists
   - Reports which variables are missing (if any)

2. **Database Connection Test**:
   - Creates Supabase client instance
   - Queries `user_profiles` table (should be empty initially)
   - Reports success or detailed error

3. **Graceful Degradation**:
   - Game still loads even if Supabase is not configured
   - Error messages guide you to setup documentation
   - Local storage continues to work

## Troubleshooting

### "Missing environment variables" on Vercel

**Problem**: Console shows missing variables even after adding them to Vercel.

**Solution**:
1. Verify variable names are EXACTLY: `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Check they're set for **Production** environment
3. Trigger a new deployment: `vercel --prod`
4. Wait 2-3 minutes for deployment to complete
5. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### "Database query failed: relation user_profiles does not exist"

**Problem**: Database connection works but table doesn't exist.

**Solution**:
1. Go to Supabase Dashboard → SQL Editor
2. Run Migration 1: `supabase/migrations/20250101000000_initial_schema.sql`
3. Verify tables exist: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`

### "Failed to fetch" or CORS errors

**Problem**: Can't connect to Supabase at all.

**Solution**:
1. Verify `SUPABASE_URL` format is: `https://xxxxx.supabase.co` (no trailing slash)
2. Check your Supabase project is active (not paused)
3. Verify you're using the correct project URL from Supabase Dashboard → Settings → API
4. Check browser console for specific CORS error details

### Environment variables work locally but not on Vercel

**Problem**: Local .env file works, but Vercel deployment doesn't.

**Solution**:
1. Local uses `dotenv-webpack` to load `.env` file
2. Vercel uses environment variables from project settings
3. These are separate configurations - both must be set independently
4. Verify Vercel variables: `vercel env ls`

## Next Steps

Once the connection test passes:

1. **User Authentication** - Implement login/register screens
2. **Cloud Saves** - Replace localStorage with Supabase
3. **Leaderboards** - Track scenario completions
4. **User Profiles** - Persistent settings across devices

See `DEPLOYMENT_PLAN.md` for full implementation roadmap (Phase 2-4).

## Files Modified

- `Overlord.Phaser/package.json` - Added `@supabase/supabase-js` dependency
- `Overlord.Phaser/src/services/SupabaseClient.ts` - **NEW** - Supabase client singleton
- `Overlord.Phaser/src/scenes/BootScene.ts` - Added connection test on startup
- `Overlord.Phaser/tsconfig.json` - Added `@services/*` path alias
- `Overlord.Phaser/webpack.config.js` - Added `@services` alias + environment variable support
- `Overlord.Phaser/.env.example` - **NEW** - Template for local environment variables
