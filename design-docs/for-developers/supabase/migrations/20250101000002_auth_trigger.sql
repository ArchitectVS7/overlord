-- ============================================================================
-- Authentication Trigger
-- ============================================================================
-- Automatically creates a user_profile when a new user signs up
-- ============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile with default username from email
  INSERT INTO public.user_profiles (user_id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1) -- Use email prefix as default username
    )
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- Auth Trigger Complete
-- ============================================================================

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile on signup';
