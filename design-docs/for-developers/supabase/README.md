# Supabase Database Migrations

This folder contains SQL migration files for setting up the Overlord game database on Supabase.

## Quick Start

### Option 1: Manual Setup (Recommended for first-time setup)

1. **Create a Supabase project** at https://app.supabase.com
2. **Go to SQL Editor** in the Supabase dashboard
3. **Run migrations in order**:
   - Copy and paste each migration file
   - Execute them in numerical order:
     1. `20250101000000_initial_schema.sql`
     2. `20250101000001_storage_setup.sql`
     3. `20250101000002_auth_trigger.sql`

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations to Supabase
supabase db push
```

## Database Schema Overview

### Tables

#### `user_profiles`
- **Purpose**: Store user preferences and settings
- **Key fields**: `username`, `ui_scale`, `audio_enabled`, `music_volume`, `sfx_volume`
- **Relationship**: One-to-one with `auth.users`

#### `saves`
- **Purpose**: Store campaign save games
- **Key fields**: `slot_name`, `data` (compressed JSON), `turn_number`, `playtime`
- **Compression**: Game state stored as GZip compressed BYTEA
- **Unique constraint**: One save per user per slot name

#### `scenario_completions`
- **Purpose**: Track Flash Conflict scenario performance
- **Key fields**: `scenario_id`, `best_time_seconds`, `stars_earned`, `completed`
- **Features**: Supports leaderboards via `get_scenario_leaderboard()` function

### Storage Buckets

- **`save-thumbnails`**: Save game screenshots (private)
- **`user-avatars`**: User profile pictures (public)
- **`scenario-packs`**: Custom scenario mods (public, future feature)

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- ✅ Users can only view/edit their own data
- ✅ Leaderboards allow reading all scenario completions
- ✅ Auth checks use `auth.uid()` for security

## Helper Functions

### `create_user_profile(user_id, username)`
Manually create a user profile (auto-triggered on signup).

### `get_scenario_leaderboard(scenario_id, limit)`
Fetch top players for a scenario ordered by best time.

**Example usage:**
```sql
SELECT * FROM get_scenario_leaderboard('solar_system_blitz', 10);
```

## Environment Variables

After setting up Supabase, add these to your Vercel project:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in Supabase Dashboard → Settings → API

## Testing the Schema

Run these test queries in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Test leaderboard function
SELECT * FROM get_scenario_leaderboard('test_scenario', 10);
```

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| `20250101000000` | 2025-01-01 | Initial schema (user_profiles, saves, scenario_completions) |
| `20250101000001` | 2025-01-01 | Storage buckets (thumbnails, avatars, scenario packs) |
| `20250101000002` | 2025-01-01 | Auth trigger (auto-create user profiles) |

## Data Size Estimates

### Save Files
- **Uncompressed JSON**: ~50-100 KB per save
- **GZip compressed**: ~10-20 KB per save
- **10,000 saves**: ~200 MB (well within free tier)

### Thumbnails (if using storage instead of base64)
- **PNG screenshot**: ~100 KB per save
- **10,000 saves**: ~1 GB

### Free Tier Limits
- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month

## Security Best Practices

✅ **Row Level Security (RLS)**: Enabled on all tables
✅ **Anon key**: Safe to expose in frontend (RLS enforced)
🔒 **Service role key**: NEVER expose in frontend code
🔒 **Database password**: Keep secret, only for backend/migrations

## Troubleshooting

### Error: "new row violates row-level security policy"
- Ensure user is authenticated (`auth.uid()` returns a value)
- Check RLS policies match the operation (SELECT/INSERT/UPDATE/DELETE)

### Error: "duplicate key value violates unique constraint"
- User profile already exists: Check `user_profiles` table
- Username taken: Choose a different username
- Save slot conflict: Use a different `slot_name`

### Storage upload fails
- Check bucket exists: `SELECT * FROM storage.buckets;`
- Verify RLS policies on `storage.objects`
- Ensure file path format: `{user_id}/{filename}`

## Next Steps

After running migrations:

1. **Test authentication**: Create a test user in Supabase Dashboard
2. **Test RLS**: Try querying tables while authenticated
3. **Integrate with game**: Install `@supabase/supabase-js` in frontend
4. **Deploy to Vercel**: See `DEPLOYMENT_PLAN.md`
