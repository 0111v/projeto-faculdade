-- ⚠️ IMPORTANT: Storage policies cannot be managed via SQL queries
-- You will get an error: "must be owner of relation objects"
--
-- Instead, configure storage policies through the Supabase Dashboard UI:
-- 1. Go to Storage → product-images bucket → Policies tab
-- 2. Follow the instructions in: STORAGE_POLICIES_DASHBOARD.md
--
-- This file is kept for reference only.

/*
-- These policies need to be created in the Supabase Dashboard:

1. Public Read Access:
   - Operation: SELECT
   - Policy: bucket_id = 'product-images'

2. Admin Upload:
   - Operation: INSERT
   - Policy: bucket_id = 'product-images' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'

3. Admin Update:
   - Operation: UPDATE
   - Policy: bucket_id = 'product-images' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'

4. Admin Delete:
   - Operation: DELETE
   - Policy: bucket_id = 'product-images' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'

See STORAGE_POLICIES_DASHBOARD.md for detailed step-by-step instructions.
*/
