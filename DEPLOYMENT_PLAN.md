# Overlord Deployment Guide

## 📍 Current Status

✅ **Vercel Deployment**: LIVE and operational
⏳ **Supabase Integration**: Infrastructure ready, code integration pending

**Live URL**: Check your Vercel dashboard for deployment URL
**Next Step**: Set up Supabase backend (follow sections below)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Supabase Setup (Next Steps)](#supabase-setup-next-steps)
3. [Environment Variables Configuration](#environment-variables-configuration)
4. [Code Integration Phases](#code-integration-phases)
5. [Vercel Configuration Reference](#vercel-configuration-reference)
6. [Security & Best Practices](#security--best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Cost Estimates](#cost-estimates)

---

## Architecture Overview

### Deployment Stack
- **Frontend Hosting**: Vercel (static site, Edge Network CDN)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build Tool**: Webpack (outputs to `Overlord.Phaser/dist`)
- **Framework**: Phaser 3 + TypeScript (no SSR needed)

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Static Assets (index.html, bundle.js, scenarios)     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Browser (Phaser Game)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Core Game Logic (SaveSystem, GameState)            │   │
│  │         │                                            │   │
│  │         ▼                                            │   │
│  │  Services Layer (TO BE IMPLEMENTED)                 │   │
│  │  ├─ SupabaseClient.ts                               │   │
│  │  ├─ AuthService.ts                                  │   │
│  │  ├─ SaveService.ts                                  │   │
│  │  └─ ScenarioCompletionService.ts                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ (HTTPS API calls)
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database                                   │ │
│  │  ├─ auth.users (built-in)                             │ │
│  │  ├─ public.user_profiles                              │ │
│  │  ├─ public.saves                                      │ │
│  │  └─ public.scenario_completions                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Row Level Security (RLS)                              │ │
│  │  └─ Users can only access their own data              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Supabase Setup (Next Steps)

### Prerequisites
- Vercel deployment is live ✅
- You have Supabase account (create at https://app.supabase.com)

### Step 1: Create Supabase Project (5 minutes)

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Click "New Project"**
3. **Fill in project details**:
   - **Name**: `overlord-game` (or your preferred name)
   - **Database Password**: Generate strong password (save it securely!)
   - **Region**: Choose closest to your users (e.g., US East, Europe West)
4. **Wait 2-3 minutes** for project provisioning

### Step 2: Run Database Migrations (10 minutes)

You'll run 3 SQL migration files to set up tables, storage, and auth triggers.

#### Migration 1: Initial Schema

1. **Open SQL Editor** in Supabase dashboard (left sidebar)
2. **Click "New Query"**
3. **Open migration file**: `supabase/migrations/20250101000000_initial_schema.sql`
4. **Copy entire contents** and paste into SQL Editor
5. **Click "Run"** (or press `Ctrl+Enter`)
6. **Verify success**: Should see "Success. No rows returned"

This creates the 3 main tables:
- `user_profiles` - User settings and metadata
- `saves` - Compressed game save files
- `scenario_completions` - Player achievement tracking

#### Migration 2: Storage Setup

1. **New Query** in SQL Editor
2. **Open migration file**: `supabase/migrations/20250101000001_storage_setup.sql`
3. **Copy and run**
4. **Verify**: Go to **Storage** (left sidebar) → Should see 3 buckets:
   - `save-thumbnails` - Save game thumbnail images
   - `user-avatars` - User profile pictures
   - `scenario-packs` - User-created scenario content

#### Migration 3: Auth Trigger

1. **New Query** in SQL Editor
2. **Open migration file**: `supabase/migrations/20250101000002_auth_trigger.sql`
3. **Copy and run**
4. **Verify**: Go to **Database** → **Functions** → Should see `handle_new_user()`

This function automatically creates a `user_profiles` row when users sign up.

### Step 3: Enable Authentication (2 minutes)

1. **Go to Authentication** → **Providers** (left sidebar)
2. **Enable Email provider** (toggle switch)
3. **(Optional)** Customize email templates:
   - Go to **Authentication** → **Email Templates**
   - Edit confirmation email, password reset, etc.

### Step 4: Get API Credentials (1 minute)

1. **Go to Settings** → **API** (left sidebar)
2. **Copy these values** (you'll need them next):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long JWT token)

⚠️ **IMPORTANT**:
- ✅ `anon public` key is SAFE to expose in frontend (protected by RLS)
- ❌ NEVER expose `service_role` key in frontend code

### Step 5: Verify Database Setup (2 minutes)

Run this test query in SQL Editor to confirm everything is set up:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected output: scenario_completions, saves, user_profiles
```

Then verify comprehensive setup:

```sql
SELECT
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
  (SELECT COUNT(*) FROM storage.buckets) as bucket_count,
  (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') as trigger_count;

-- Expected: table_count = 3, bucket_count = 3, trigger_count = 1
```

✅ **Supabase setup complete!** Database is ready for integration.

---

## Environment Variables Configuration

### Add Supabase Credentials to Vercel

Now that you have Supabase credentials, add them to your Vercel deployment.

#### Option A: Via Vercel CLI (Recommended)

```bash
# Set Supabase URL
vercel env add SUPABASE_URL production
# When prompted, paste: https://xxxxx.supabase.co

# Set Supabase Anon Key
vercel env add SUPABASE_ANON_KEY production
# When prompted, paste: eyJhbGc... (from Supabase Settings > API)
```

#### Option B: Via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add two variables:
   - **Key**: `SUPABASE_URL` | **Value**: `https://xxxxx.supabase.co`
   - **Key**: `SUPABASE_ANON_KEY` | **Value**: `eyJhbGc...`

### Redeploy with New Variables

```bash
# Trigger new deployment with environment variables
vercel --prod
```

⏱️ **Wait 2-3 minutes** for deployment to complete.

🎉 **Infrastructure setup complete!** Your game can now connect to Supabase (once code integration is done).

---

## Code Integration Phases

The infrastructure is ready, but you still need to integrate Supabase into your game code.

### Phase 1: Infrastructure Setup ✅ COMPLETE

- ✅ Vercel deployment live
- ✅ Supabase project created (if you followed steps above)
- ✅ Database migrations run
- ✅ Environment variables configured

### Phase 2: Supabase Client Integration (Development Needed)

**Install dependencies:**
```bash
cd Overlord.Phaser
npm install @supabase/supabase-js
```

**Create service files:**

1. **`src/services/SupabaseClient.ts`** - Singleton client
   ```typescript
   import { createClient } from '@supabase/supabase-js';

   const supabaseUrl = process.env.SUPABASE_URL!;
   const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```

2. **`src/services/AuthService.ts`** - Login/register/logout
   - Methods: `signUp()`, `signIn()`, `signOut()`, `getCurrentUser()`
   - Integration: Replace localStorage auth with Supabase auth

3. **`src/services/SaveService.ts`** - Cloud save/load
   - Methods: `saveGame()`, `loadGame()`, `listSaves()`, `deleteSave()`
   - Integration: Replace `localStorage.setItem('save_game')` with Supabase queries

4. **`src/services/ScenarioCompletionService.ts`** - Achievement tracking
   - Methods: `recordCompletion()`, `getCompletions()`, `getLeaderboard()`
   - Integration: Track scenario stats in Supabase instead of localStorage

5. **`src/services/UserProfileService.ts`** - User settings
   - Methods: `updateProfile()`, `getProfile()`, `uploadAvatar()`
   - Integration: Persist user preferences to cloud

### Phase 3: UI Integration (Development Needed)

- [ ] Add login/register screens (Phaser scenes or HTML overlay)
- [ ] Update save/load UI to show cloud saves instead of localStorage
- [ ] Add user profile settings screen
- [ ] Add scenario leaderboards (top scores, fastest completions)
- [ ] Add "Sync to Cloud" button for existing saves

### Phase 4: Migration & Testing (Development Needed)

- [ ] Create one-time migration tool for existing localStorage saves
- [ ] Test save/load with compression (verify file size limits)
- [ ] Test Row Level Security (RLS) policies (users can't access other users' data)
- [ ] Test offline handling (localStorage fallback when Supabase unavailable)
- [ ] Performance testing with large save files (>1 MB compressed)
- [ ] Cross-device testing (desktop, mobile, different browsers)

**Estimated Development Time**: 2-3 weeks for full integration

---

## Vercel Configuration Reference

Your current `vercel.json` configuration:

```json
{
  "version": 2,
  "buildCommand": "cd Overlord.Phaser && npm run build",
  "outputDirectory": "Overlord.Phaser/dist",
  "framework": null,
  "installCommand": "cd Overlord.Phaser && npm install",
  "devCommand": "cd Overlord.Phaser && npm start",
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### Why Static Site Deployment?

- ✅ Your app is already configured with Webpack (outputs to `/dist`)
- ✅ No server-side rendering needed for Phaser games
- ✅ Maximum performance with Vercel's Edge Network CDN
- ✅ Zero configuration changes required
- ✅ Instant rollback capability via Vercel dashboard

### Future: Adding API Routes (Optional)

If you need serverless backend logic in the future, you can migrate to:
- **Next.js**: Add `/api` routes for custom logic (rate limiting, webhooks, etc.)
- **Vite**: Modern build tool (faster than Webpack)

But for now, pure static deployment is optimal.

---

## Security & Best Practices

### Row Level Security (RLS)

All tables have RLS enabled to prevent unauthorized access:

```sql
-- Example RLS policy (from migrations)
CREATE POLICY "Users can only access their own saves"
ON saves FOR ALL
USING (auth.uid() = user_id);
```

**What this means**:
- Users can ONLY read/write their own data
- Even with the `anon` key exposed in frontend, Supabase enforces RLS
- Attempts to access other users' data return empty results

### Security Checklist

✅ **Row Level Security (RLS)**: Enabled on all tables
✅ **HTTPS only**: Enforced by Vercel and Supabase
✅ **Anon key**: Safe to expose (RLS prevents unauthorized access)
✅ **Input validation**: Already handled by TypeScript types
✅ **Checksum validation**: Prevent save file tampering (optional enhancement)

### What NEVER to Expose

🔒 **DO NOT expose in frontend code**:
- Supabase `service_role` key (has admin permissions)
- Database connection strings (direct PostgreSQL access)
- Any API keys with write permissions to third-party services

### Save File Security (Future Enhancement)

```typescript
// Add checksum validation to SaveSystem
import { createHash } from 'crypto';

function validateSaveChecksum(saveData: SaveData, checksum: string): boolean {
  const computed = createHash('sha256').update(JSON.stringify(saveData)).digest('hex');
  return computed === checksum;
}
```

This prevents players from manually editing save files to cheat.

---

## Troubleshooting

### Vercel Issues

#### Build Fails
**Symptoms**: Deployment fails during build step

**Solutions**:
1. Check `Overlord.Phaser/package.json` has all dependencies
2. Verify Node version >= 18.0.0 in Vercel project settings
3. Check build logs in Vercel dashboard for specific errors
4. Test build locally: `cd Overlord.Phaser && npm run build`

#### Environment Variables Not Working
**Symptoms**: Game can't connect to Supabase, `undefined` errors

**Solutions**:
1. Wait 2-3 minutes after adding variables (Vercel needs to propagate)
2. Redeploy after adding vars: `vercel --prod`
3. Verify vars exist: `vercel env ls`
4. Check variable names match exactly: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (not `VITE_*` - this is Webpack, not Vite)

#### Deployment URL Not Working
**Symptoms**: Site shows 404 or blank page

**Solutions**:
1. Check `outputDirectory` in `vercel.json` is correct (`Overlord.Phaser/dist`)
2. Verify `dist/index.html` exists after build
3. Check browser console for JavaScript errors
4. Ensure build command completed successfully

### Supabase Issues

#### Migration Errors
**Symptoms**: SQL error when running migrations

**Solutions**:
1. Run migrations in order (000 → 001 → 002)
2. Check for SQL syntax errors (copy/paste issues)
3. Verify you have project owner/admin permissions
4. Drop tables and re-run if tables already exist: `DROP TABLE saves CASCADE;`

**Common Error**: `ERROR: 42501: must be owner of schema storage`
- **Cause**: Migration tried to add comment to storage schema (requires owner permissions)
- **Solution**: The fixed migration file no longer includes this problematic line. Copy the latest version from `supabase/migrations/20250101000001_storage_setup.sql` and run again.

#### RLS Policy Errors
**Symptoms**: Can't insert/update data, "permission denied" errors

**Solutions**:
1. Verify user is authenticated: `supabase.auth.getUser()`
2. Check RLS policies exist: SQL Editor → View table policies
3. Test with RLS disabled temporarily (for debugging only):
   ```sql
   ALTER TABLE saves DISABLE ROW LEVEL SECURITY;
   ```
4. Re-enable after testing: `ALTER TABLE saves ENABLE ROW LEVEL SECURITY;`

#### Connection Errors
**Symptoms**: "Failed to fetch" or timeout errors

**Solutions**:
1. Verify `SUPABASE_URL` is correct format: `https://xxxxx.supabase.co`
2. Check Supabase project is active (not paused due to inactivity)
3. Verify network allows connections (corporate firewalls may block)
4. Check browser console for CORS errors

---

## Cost Estimates

### Vercel - FREE Tier

**Hobby Plan** (current):
- ✅ **100 GB bandwidth/month**
- ✅ **Unlimited requests**
- ✅ **Automatic HTTPS**
- ✅ **Edge Network CDN**
- ✅ **Instant rollbacks**
- ✅ **Perfect for moderate traffic games**

**When to upgrade** (Pro $20/month):
- > 100 GB bandwidth/month
- Need team collaboration features
- Advanced analytics

### Supabase - FREE Tier

**Free Plan** (recommended for launch):
- ✅ **500 MB database storage**
- ✅ **1 GB file storage** (avatars, screenshots)
- ✅ **2 GB bandwidth/month**
- ✅ **50,000 monthly active users**
- ✅ **Unlimited API requests**
- ✅ **Should handle thousands of players**

**Database storage estimate**:
- Each save file: ~20-50 KB (compressed)
- 10,000 saves: ~200-500 MB (within free tier)

**When to upgrade** (Pro $25/month):
- > 500 MB database storage
- > 2 GB bandwidth/month
- Need daily backups (free tier = weekly)
- Need advanced metrics

**Total Monthly Cost**: **$0** for launch (both free tiers)

---

## Next Steps After Integration

### 1. Monitor Performance

**Vercel Analytics**:
- Go to Vercel project → Analytics
- Track page load times, bandwidth usage
- Monitor Core Web Vitals (LCP, FID, CLS)

**Supabase Dashboard**:
- Monitor query performance (slow queries)
- Track storage usage (database + file storage)
- View authentication metrics (sign-ups, active users)

### 2. Optimize Save File Size

**Current**: JSON serialization (~50-100 KB per save)
**With gzip compression**: ~10-20 KB per save
**With binary serialization**: ~5-10 KB per save

Implement compression in Phase 2:
```typescript
import pako from 'pako';

function compressSave(saveData: SaveData): Uint8Array {
  const json = JSON.stringify(saveData);
  return pako.gzip(json);
}
```

### 3. Add Future Features

Once basic integration is complete:
- 📊 **Leaderboards**: Top scores, fastest scenario completions
- 👤 **User Profiles**: Avatars, bio, achievements
- 🔄 **Cloud Sync**: Automatic save sync across devices
- 🎮 **Multiplayer**: Use Supabase Realtime for turn-based multiplayer
- 📈 **Analytics**: Track player behavior, popular strategies
- 🏆 **Achievements**: Steam-like achievement system

---

## Rollback Plan

If deployment has critical issues:

### Vercel Rollback
1. Go to Vercel project dashboard
2. Click **Deployments** tab
3. Find previous working deployment
4. Click **⋮** → **Promote to Production**
5. **Instant rollback** (< 30 seconds)

### Supabase Rollback
**Database changes**:
- Pro plan: Daily snapshots available
- Free plan: Manual backups before migrations
- Run reverse migration SQL to undo changes

**Fallback Strategy**:
Keep localStorage as backup storage:
```typescript
async function saveGame(data: SaveData) {
  try {
    await supabase.from('saves').insert(data); // Try cloud first
  } catch (error) {
    localStorage.setItem('save_game', JSON.stringify(data)); // Fallback to local
  }
}
```

---

## Quick Reference Commands

### Vercel

```bash
# Check deployment status
vercel ls

# View environment variables
vercel env ls

# Add environment variable
vercel env add VITE_SUPABASE_URL production

# Deploy to production
vercel --prod

# View logs
vercel logs
```

### Supabase (Optional CLI)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to remote project
supabase link --project-ref your-project-ref

# Pull remote schema
supabase db pull

# Push migrations
supabase db push

# Reset local database
supabase db reset
```

### Verification

```bash
# Test local build
cd Overlord.Phaser
npm run build
# Should create dist/ directory

# Test Webpack dev server
npm start
# Should open http://localhost:8080

# Run test suite
npm test
# Should show 835 passing tests
```

---

## Summary Checklist

### Infrastructure Setup (DO THIS FIRST)
- [x] Vercel deployed and live ✅
- [ ] Supabase project created
- [ ] Database migrations run (3 files)
- [ ] Email authentication enabled
- [ ] Environment variables added to Vercel
- [ ] Redeploy with new environment variables

### Code Integration (DEVELOPMENT WORK)
- [ ] Install `@supabase/supabase-js`
- [ ] Create `SupabaseClient.ts`
- [ ] Create `AuthService.ts`
- [ ] Create `SaveService.ts`
- [ ] Create `ScenarioCompletionService.ts`
- [ ] Create `UserProfileService.ts`
- [ ] Update UI for login/register
- [ ] Update save/load UI
- [ ] Add user profile settings
- [ ] Test RLS policies
- [ ] Test offline fallback
- [ ] Performance testing

### Post-Launch (OPTIONAL)
- [ ] Set up monitoring alerts
- [ ] Optimize save file compression
- [ ] Add leaderboards
- [ ] Add achievements
- [ ] Consider multiplayer features

---

**Current Status**: Vercel deployment complete, ready for Supabase integration
**Next Action**: Follow "Supabase Setup (Next Steps)" section above
**Estimated Time**: 20 minutes for infrastructure, 2-3 weeks for code integration
