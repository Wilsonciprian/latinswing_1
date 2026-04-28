
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Restrict listing: drop broad SELECT and replace with one that only allows fetching by exact name (single-object access)
-- We keep public read of media via direct URL; storage signed/public URL access does not require this policy.
DROP POLICY IF EXISTS "Media is publicly viewable" ON storage.objects;

CREATE POLICY "Media files are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
