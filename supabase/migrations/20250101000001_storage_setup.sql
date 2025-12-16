-- ============================================================================
-- Storage Buckets for File Uploads (Optional)
-- ============================================================================
-- This migration creates storage buckets for user-uploaded content
-- such as custom scenario packs or save file thumbnails (if not using base64)
-- ============================================================================

-- ============================================================================
-- Storage Bucket: save-thumbnails
-- ============================================================================
-- Stores save game thumbnail images (alternative to base64 in DB)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('save-thumbnails', 'save-thumbnails', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for save-thumbnails bucket
CREATE POLICY "Users can upload own thumbnails"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'save-thumbnails' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own thumbnails"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'save-thumbnails' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own thumbnails"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'save-thumbnails' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Storage Bucket: user-avatars
-- ============================================================================
-- Stores user profile avatars (optional future feature)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for user-avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'user-avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Storage Bucket: scenario-packs (Future Feature)
-- ============================================================================
-- For user-created scenario packs (mod support)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('scenario-packs', 'scenario-packs', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for scenario-packs bucket
CREATE POLICY "Anyone can view scenario packs"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'scenario-packs');

CREATE POLICY "Authenticated users can upload scenario packs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'scenario-packs' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own scenario packs"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'scenario-packs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own scenario packs"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'scenario-packs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Storage Complete
-- ============================================================================

COMMENT ON SCHEMA storage IS 'Supabase Storage schema for file uploads';
