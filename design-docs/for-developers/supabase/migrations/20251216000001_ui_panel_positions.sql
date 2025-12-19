-- ============================================================================
-- Migration: UI Panel Positions Table
-- ============================================================================
-- Stores global UI panel position overrides set by admin users.
-- These positions become defaults for all users.
-- ============================================================================

-- Create ui_panel_positions table
CREATE TABLE public.ui_panel_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Panel identification
  scene_name TEXT NOT NULL,           -- e.g., 'GalaxyMapScene'
  panel_id TEXT NOT NULL,             -- e.g., 'ResourceHUD'

  -- Position data
  x REAL NOT NULL,
  y REAL NOT NULL,

  -- Store original/default positions for reset functionality
  default_x REAL,
  default_y REAL,

  -- Audit trail
  modified_by UUID REFERENCES auth.users(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure unique panel per scene
  UNIQUE(scene_name, panel_id)
);

-- Index for scene lookups (main query pattern)
CREATE INDEX idx_ui_panel_positions_scene ON public.ui_panel_positions(scene_name);

-- Apply updated_at trigger (reuses existing function)
CREATE TRIGGER update_ui_panel_positions_updated_at
  BEFORE UPDATE ON public.ui_panel_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE public.ui_panel_positions ENABLE ROW LEVEL SECURITY;

-- All users can read positions (they're global defaults)
CREATE POLICY "Anyone can read panel positions"
  ON public.ui_panel_positions
  FOR SELECT
  USING (true);

-- Only admins can insert new positions
CREATE POLICY "Admins can insert panel positions"
  ON public.ui_panel_positions
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE is_admin = true
    )
  );

-- Only admins can update positions
CREATE POLICY "Admins can update panel positions"
  ON public.ui_panel_positions
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE is_admin = true
    )
  );

-- Only admins can delete positions (reset to defaults)
CREATE POLICY "Admins can delete panel positions"
  ON public.ui_panel_positions
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE is_admin = true
    )
  );

-- ============================================================================
-- Documentation
-- ============================================================================

COMMENT ON TABLE public.ui_panel_positions IS 'Global UI panel position overrides set by admin users';
COMMENT ON COLUMN public.ui_panel_positions.scene_name IS 'Phaser scene name (e.g., GalaxyMapScene)';
COMMENT ON COLUMN public.ui_panel_positions.panel_id IS 'Panel class name (e.g., ResourceHUD)';
COMMENT ON COLUMN public.ui_panel_positions.default_x IS 'Original hardcoded X position for reset';
COMMENT ON COLUMN public.ui_panel_positions.default_y IS 'Original hardcoded Y position for reset';
