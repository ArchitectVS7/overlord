-- ============================================================================
-- Initial Database Schema for Overlord Strategy Game
-- ============================================================================
-- This migration creates the core tables for user profiles, game saves,
-- and scenario completions with Row Level Security (RLS) enabled.
-- ============================================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: user_profiles
-- ============================================================================
-- Stores user preferences and settings
-- One-to-one relationship with auth.users
-- ============================================================================

CREATE TABLE public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,

  -- UI Settings
  ui_scale REAL DEFAULT 1.0 CHECK (ui_scale >= 0.5 AND ui_scale <= 2.0),
  high_contrast_mode BOOLEAN DEFAULT false,

  -- Audio Settings
  audio_enabled BOOLEAN DEFAULT true,
  music_volume REAL DEFAULT 0.7 CHECK (music_volume >= 0.0 AND music_volume <= 1.0),
  sfx_volume REAL DEFAULT 0.8 CHECK (sfx_volume >= 0.0 AND sfx_volume <= 1.0),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for username lookups
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);

-- ============================================================================
-- Table: saves
-- ============================================================================
-- Stores campaign save games with compressed game state
-- Multiple saves per user (quicksave, autosave, manual slots)
-- ============================================================================

CREATE TABLE public.saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Save metadata
  slot_name TEXT NOT NULL, -- 'autosave', 'quicksave', 'slot1', 'slot2', etc.
  save_name TEXT, -- Optional player-defined name
  campaign_name TEXT,

  -- Game state data
  data BYTEA NOT NULL, -- GZip compressed JSON of SaveData
  checksum TEXT, -- SHA256 hash for integrity validation

  -- Save statistics
  turn_number INTEGER NOT NULL,
  playtime INTEGER NOT NULL, -- Total playtime in seconds
  version TEXT NOT NULL, -- Game version (e.g., "0.1.0")

  -- Victory status
  victory_status TEXT DEFAULT 'None' CHECK (victory_status IN ('None', 'Victory', 'Defeat')),

  -- Thumbnails (optional, base64 encoded PNG)
  thumbnail TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure unique slot names per user
  UNIQUE(user_id, slot_name)
);

-- Indexes for efficient queries
CREATE INDEX idx_saves_user_id ON public.saves(user_id);
CREATE INDEX idx_saves_updated_at ON public.saves(updated_at DESC);
CREATE INDEX idx_saves_user_slot ON public.saves(user_id, slot_name);

-- ============================================================================
-- Table: scenario_completions
-- ============================================================================
-- Tracks Flash Conflict scenario completions and best times
-- Used for leaderboards and achievement tracking
-- ============================================================================

CREATE TABLE public.scenario_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Scenario identification
  scenario_id TEXT NOT NULL, -- e.g., "solar_system_blitz", "metropolis_madness"
  scenario_pack_id TEXT, -- Optional: which pack this scenario belongs to

  -- Completion status
  completed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,

  -- Performance tracking
  best_time_seconds INTEGER, -- Best completion time
  last_completion_time_seconds INTEGER, -- Most recent completion time
  stars_earned INTEGER DEFAULT 0 CHECK (stars_earned >= 0 AND stars_earned <= 3),

  -- Timestamps
  first_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Ensure one record per user per scenario
  UNIQUE(user_id, scenario_id)
);

-- Indexes for leaderboards and user queries
CREATE INDEX idx_scenario_completions_user_id ON public.scenario_completions(user_id);
CREATE INDEX idx_scenario_completions_scenario_id ON public.scenario_completions(scenario_id);
CREATE INDEX idx_scenario_completions_best_time ON public.scenario_completions(scenario_id, best_time_seconds ASC) WHERE completed = true;
CREATE INDEX idx_scenario_completions_stars ON public.scenario_completions(user_id, stars_earned DESC);

-- ============================================================================
-- Updated_at Trigger Function
-- ============================================================================
-- Automatically updates the updated_at timestamp on row modifications
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saves_updated_at
  BEFORE UPDATE ON public.saves
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
-- Users can only access their own data
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_completions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies: user_profiles
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.user_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies: saves
-- ============================================================================

-- Users can view their own saves
CREATE POLICY "Users can view own saves"
  ON public.saves
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saves
CREATE POLICY "Users can insert own saves"
  ON public.saves
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saves
CREATE POLICY "Users can update own saves"
  ON public.saves
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saves
CREATE POLICY "Users can delete own saves"
  ON public.saves
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies: scenario_completions
-- ============================================================================

-- Users can view their own completions
CREATE POLICY "Users can view own completions"
  ON public.scenario_completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view leaderboards (all completions for a scenario)
CREATE POLICY "Users can view leaderboards"
  ON public.scenario_completions
  FOR SELECT
  USING (true); -- Allow reading all records for leaderboards

-- Users can insert their own completions
CREATE POLICY "Users can insert own completions"
  ON public.scenario_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own completions
CREATE POLICY "Users can update own completions"
  ON public.scenario_completions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own completions
CREATE POLICY "Users can delete own completions"
  ON public.scenario_completions
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to create user profile on signup (call from application or trigger)
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_username TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username)
  VALUES (p_user_id, p_username)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get leaderboard for a scenario
CREATE OR REPLACE FUNCTION public.get_scenario_leaderboard(
  p_scenario_id TEXT,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  username TEXT,
  best_time_seconds INTEGER,
  stars_earned INTEGER,
  completed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.username,
    sc.best_time_seconds,
    sc.stars_earned,
    sc.completed_at
  FROM public.scenario_completions sc
  JOIN public.user_profiles up ON sc.user_id = up.user_id
  WHERE sc.scenario_id = p_scenario_id
    AND sc.completed = true
  ORDER BY sc.best_time_seconds ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Initial Data / Seed (Optional)
-- ============================================================================

-- No seed data needed for now - tables start empty

-- ============================================================================
-- Migration Complete
-- ============================================================================

COMMENT ON TABLE public.user_profiles IS 'User preferences and settings';
COMMENT ON TABLE public.saves IS 'Campaign save games with compressed game state';
COMMENT ON TABLE public.scenario_completions IS 'Flash Conflict scenario completion tracking';
