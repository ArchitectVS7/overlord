-- ============================================================================
-- Migration: Add Admin Role to User Profiles
-- ============================================================================
-- Adds is_admin column to user_profiles table for admin user identification.
-- Admin users can modify UI panel positions that become global defaults.
-- ============================================================================

-- Add is_admin column with default false
ALTER TABLE public.user_profiles
ADD COLUMN is_admin BOOLEAN DEFAULT false NOT NULL;

-- Create index for admin lookups (sparse index - only where true)
CREATE INDEX idx_user_profiles_is_admin
  ON public.user_profiles(is_admin)
  WHERE is_admin = true;

-- Add comment for documentation
COMMENT ON COLUMN public.user_profiles.is_admin IS 'Admin users can modify global UI panel positions';

-- ============================================================================
-- Note: To set a user as admin, run in Supabase SQL Editor:
-- UPDATE public.user_profiles SET is_admin = true WHERE username = 'your_username';
-- ============================================================================
