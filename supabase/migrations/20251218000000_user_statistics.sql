-- ============================================================================
-- User Statistics Table
-- Story 10-7: User Statistics Tracking
-- ============================================================================
-- Tracks lifetime gameplay statistics for users including:
-- - Campaign counts (started, won, lost)
-- - Total playtime
-- - Combat and conquest statistics
-- - Flash Conflict completion statistics
-- ============================================================================

-- ============================================================================
-- Table: user_statistics
-- ============================================================================
-- Stores lifetime gameplay statistics per user
-- One-to-one relationship with auth.users
-- ============================================================================

CREATE TABLE public.user_statistics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Campaign Statistics
  campaigns_started INTEGER DEFAULT 0 CHECK (campaigns_started >= 0),
  campaigns_won INTEGER DEFAULT 0 CHECK (campaigns_won >= 0),
  campaigns_lost INTEGER DEFAULT 0 CHECK (campaigns_lost >= 0),

  -- Time Statistics
  total_playtime_seconds INTEGER DEFAULT 0 CHECK (total_playtime_seconds >= 0),

  -- Combat Statistics
  planets_conquered INTEGER DEFAULT 0 CHECK (planets_conquered >= 0),
  planets_lost INTEGER DEFAULT 0 CHECK (planets_lost >= 0),
  battles_won INTEGER DEFAULT 0 CHECK (battles_won >= 0),
  battles_lost INTEGER DEFAULT 0 CHECK (battles_lost >= 0),

  -- Flash Conflict Statistics
  flash_conflicts_completed INTEGER DEFAULT 0 CHECK (flash_conflicts_completed >= 0),
  flash_conflicts_three_star INTEGER DEFAULT 0 CHECK (flash_conflicts_three_star >= 0),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment for documentation
COMMENT ON TABLE public.user_statistics IS 'Stores lifetime gameplay statistics for users';

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own statistics
CREATE POLICY "Users can view own statistics"
  ON public.user_statistics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own statistics"
  ON public.user_statistics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own statistics"
  ON public.user_statistics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- Trigger: Auto-create statistics row when user is created
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_statistics (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create statistics when a new user is created
-- Note: This hooks into the existing auth.users table via a trigger
CREATE TRIGGER on_auth_user_created_statistics
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_statistics();

-- ============================================================================
-- Trigger: Auto-update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_user_statistics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_statistics_timestamp
  BEFORE UPDATE ON public.user_statistics
  FOR EACH ROW EXECUTE FUNCTION public.update_user_statistics_updated_at();

-- ============================================================================
-- Backfill: Create statistics rows for existing users
-- ============================================================================

INSERT INTO public.user_statistics (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
