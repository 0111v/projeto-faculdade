-- Manual SQL to set a user as admin
-- Replace 'your-email@example.com' with your actual email address

-- Option 1: Set admin by email
update profiles
set role = 'admin'
where email = 'your-email@example.com';

-- Option 2: Set admin by user ID
-- update profiles
-- set role = 'admin'
-- where id = 'your-user-id-here';

-- Verify the change
select id, email, role, created_at
from profiles
where role = 'admin';
