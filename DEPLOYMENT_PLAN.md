# Vercel + Supabase Deployment Plan

## Overview
Deploy the Overlord Phaser 3 strategy game to Vercel as a static site with Supabase backend for user authentication and data persistence.

---

## 1. Framework Options for Vercel

### Recommended: **Static Site (Webpack Output)**

**Why this approach:**
- Your app is already configured with Webpack and produces static assets in `/dist`
- No server-side rendering needed for Phaser games
- Maximum performance with Vercel's Edge Network CDN
- Simple deployment with zero configuration changes

**Vercel Configuration:**

Create `vercel.json` in project root:

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

**Alternative (if you want to add API routes later):**

If you need serverless API endpoints in the future, you can migrate to:
- **Next.js** - Add `/api` routes for custom backend logic
- **Vite** - Modern build tool (faster than Webpack)

But for now, **pure static deployment is recommended**.

---

## 2. Supabase Setup

### Database Schema (PostgreSQL)

See `supabase/migrations/` folder for SQL migration files.

### Authentication Setup

1. **Enable Email Authentication** in Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email templates (welcome, password reset)

2. **Row Level Security (RLS)**:
   - All tables have RLS enabled
   - Users can only access their own data
   - Policies defined in migration files

### Environment Variables

Add these to Vercel project settings:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 3. Implementation Tasks

### Phase 1: Infrastructure Setup ✅ (You're doing this now)
- [ ] Create Supabase project
- [ ] Run SQL migrations
- [ ] Deploy to Vercel
- [ ] Configure environment variables

### Phase 2: Supabase Integration (Development work needed)
- [ ] Install Supabase client library: `npm install @supabase/supabase-js`
- [ ] Create `src/services/SupabaseClient.ts` - Singleton client
- [ ] Create `src/services/AuthService.ts` - Login/register/logout
- [ ] Create `src/services/SaveService.ts` - Replace localStorage with Supabase
- [ ] Create `src/services/ScenarioCompletionService.ts` - Replace localStorage
- [ ] Create `src/services/UserProfileService.ts` - User settings persistence

### Phase 3: UI Integration
- [ ] Add login/register screens (Phaser scenes or HTML overlay)
- [ ] Update save/load UI to show cloud saves
- [ ] Add user profile settings screen
- [ ] Add scenario leaderboards

### Phase 4: Migration & Testing
- [ ] Migrate existing localStorage saves to Supabase (one-time migration tool)
- [ ] Test save/load with compression
- [ ] Test RLS policies
- [ ] Test offline handling (localStorage fallback)
- [ ] Performance testing with large save files

---

## 4. Data Flow Architecture

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
│  │  Services Layer (New)                               │   │
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

## 5. Deployment Checklist

### Vercel Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from repository root)
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### Supabase Setup
```bash
# Install Supabase CLI (optional, for local development)
npm install -g supabase

# Initialize Supabase project (optional)
supabase init

# Link to remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

**Or manually in Supabase Dashboard:**
1. Go to SQL Editor
2. Copy/paste migration SQL
3. Run each migration in order

---

## 6. Cost Estimates

### Vercel
- **Hobby Plan**: FREE
  - 100 GB bandwidth/month
  - Unlimited requests
  - Perfect for a game with moderate traffic

### Supabase
- **Free Tier**:
  - 500 MB database
  - 1 GB file storage
  - 2 GB bandwidth
  - 50,000 monthly active users
  - Should handle thousands of players

---

## 7. Next Steps (After Deployment)

1. **Monitor performance**:
   - Vercel Analytics
   - Supabase Dashboard (query performance, storage usage)

2. **Optimize save file size**:
   - Current: JSON serialization (~50-100 KB per save)
   - With gzip compression: ~10-20 KB per save
   - Add compression in Phase 2

3. **Add features**:
   - Leaderboards for scenario completion times
   - User profiles with avatars
   - Cloud save sync across devices
   - Multiplayer (future consideration with Supabase Realtime)

---

## 8. Rollback Plan

If deployment has issues:

1. **Vercel**: Instant rollback to previous deployment via dashboard
2. **Supabase**: Database snapshots available (Pro plan) or manual backups
3. **Fallback**: Keep localStorage as backup if Supabase is unavailable

---

## 9. Security Considerations

✅ **Row Level Security (RLS)**: Enabled on all tables
✅ **HTTPS only**: Enforced by Vercel and Supabase
✅ **Anon key**: Safe to expose (RLS prevents unauthorized access)
✅ **Input validation**: Already handled by TypeScript types
✅ **Checksum validation**: Prevent save file tampering (optional)

🔒 **DO NOT expose**:
- Supabase service role key (never use in frontend)
- Database connection strings
- Any API keys with write permissions

---

## Summary

**Vercel framework choice**: Static site (no framework needed)
**Build command**: `cd Overlord.Phaser && npm run build`
**Output directory**: `Overlord.Phaser/dist`

**Supabase migrations**: See `supabase/migrations/` folder

You can deploy to Vercel immediately with the current codebase. The Supabase integration will require development work (Phase 2-4), but the infrastructure can be set up now.
