# Quick Start: Deploy to Vercel + Supabase

## 🚀 Vercel Deployment (5 minutes)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy from Repository Root
```bash
cd /home/user/overlord
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** overlord-game (or your choice)
- **Directory?** `./` (repository root)
- **Override settings?** No

### Step 4: Set Environment Variables

After deployment, add these in Vercel dashboard or CLI:

```bash
vercel env add VITE_SUPABASE_URL production
# Paste: https://your-project.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste: your-anon-key-from-supabase
```

### Step 5: Deploy to Production
```bash
vercel --prod
```

**Done!** Your game is live at `https://your-project.vercel.app`

---

## 🗄️ Supabase Setup (10 minutes)

### Step 1: Create Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: overlord-game
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
4. Wait 2 minutes for project creation

### Step 2: Run SQL Migrations

1. **Open SQL Editor** in Supabase dashboard (left sidebar)
2. **Click "New Query"**
3. **Run migrations in order**:

**Migration 1: Initial Schema**
- Open `supabase/migrations/20250101000000_initial_schema.sql`
- Copy entire contents
- Paste into SQL Editor
- Click "Run" (or press Ctrl+Enter)
- ✅ Should see "Success. No rows returned"

**Migration 2: Storage Setup**
- Open `supabase/migrations/20250101000001_storage_setup.sql`
- Copy and run
- ✅ Check: Go to Storage → Should see 3 buckets

**Migration 3: Auth Trigger**
- Open `supabase/migrations/20250101000002_auth_trigger.sql`
- Copy and run
- ✅ Check: Function appears in Database → Functions

### Step 3: Get API Credentials

1. Go to **Settings** → **API** in Supabase dashboard
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (long token)

### Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Customize email templates in **Email Templates**

### Step 5: Test the Setup

Run this test query in SQL Editor:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected output: scenario_completions, saves, user_profiles
```

**Done!** Your database is ready.

---

## 🔗 Connect Vercel to Supabase

### Update Vercel Environment Variables

```bash
# Set Supabase URL
vercel env add VITE_SUPABASE_URL production
# Paste: https://xxxxx.supabase.co

# Set Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY production
# Paste: eyJhbGc... (from Supabase Settings > API)
```

### Redeploy with Environment Variables

```bash
vercel --prod
```

**Done!** Your app can now connect to Supabase (once you integrate the client library).

---

## 📋 What's Next?

The infrastructure is ready, but you still need to integrate Supabase into your game code. See `DEPLOYMENT_PLAN.md` for Phase 2-4 tasks:

### Phase 2: Code Integration (Development needed)
- [ ] Install `@supabase/supabase-js`: `npm install @supabase/supabase-js`
- [ ] Create `src/services/SupabaseClient.ts`
- [ ] Create `src/services/AuthService.ts`
- [ ] Create `src/services/SaveService.ts`
- [ ] Replace localStorage calls with Supabase calls

### Phase 3: UI Updates
- [ ] Add login/register screen
- [ ] Update save/load UI
- [ ] Add user profile settings

### Phase 4: Testing
- [ ] Test save/load with real users
- [ ] Verify RLS policies work
- [ ] Test on different devices

---

## ✅ Current Status Check

Run these commands to verify everything is set up:

### Vercel Status
```bash
vercel ls
# Should show your deployed project
```

### Supabase Status
```sql
-- Run in Supabase SQL Editor
SELECT
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as table_count,
  (SELECT COUNT(*) FROM storage.buckets) as bucket_count,
  (SELECT COUNT(*) FROM pg_trigger WHERE tgname = 'on_auth_user_created') as trigger_count;

-- Expected: table_count = 3, bucket_count = 3, trigger_count = 1
```

---

## 🆘 Troubleshooting

### Vercel build fails
- Check `Overlord.Phaser/package.json` has all dependencies
- Verify Node version >= 18.0.0
- Check build logs in Vercel dashboard

### Supabase migration errors
- Run migrations in order (000, 001, 002)
- Check for syntax errors
- Verify you have project permissions

### Environment variables not working
- Wait 2-3 minutes after adding vars
- Redeploy: `vercel --prod`
- Check vars exist: `vercel env ls`

---

## 📊 Monitoring

### Vercel Analytics
- Go to your project in Vercel dashboard
- Click "Analytics" tab
- View traffic, performance, errors

### Supabase Dashboard
- **Database** → Table Editor: View data
- **Authentication** → Users: See registered users
- **Storage** → Browse files
- **Logs** → API logs and errors

---

## 💰 Cost Estimates

Both services are FREE for this project size:

**Vercel Hobby Plan** (Free)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited requests
- ✅ Automatic HTTPS
- ✅ Global CDN

**Supabase Free Tier** (Free)
- ✅ 500 MB database
- ✅ 1 GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

---

## 🎮 You're Ready!

Your game infrastructure is now deployed:
- ✅ Static site on Vercel Edge Network
- ✅ Database on Supabase PostgreSQL
- ✅ Authentication ready
- ✅ Storage buckets configured

Next step: Integrate Supabase client library into the game code.
