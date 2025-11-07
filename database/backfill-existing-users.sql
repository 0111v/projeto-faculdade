-- Backfill profiles for existing users who were created before the profiles table existed

-- This finds all users in auth.users who don't have a profile yet
-- and creates a profile for them with the default 'customer' role

insert into profiles (id, email, role, created_at)
select
  au.id,
  au.email,
  'customer' as role,
  au.created_at
from auth.users au
where au.id not in (select id from profiles)
and au.email is not null;

-- Verify the backfill worked
select
  count(*) as total_users,
  (select count(*) from profiles) as total_profiles
from auth.users;

-- Show all users and their roles
select
  au.id,
  au.email,
  au.created_at as user_created_at,
  p.role,
  p.created_at as profile_created_at
from auth.users au
left join profiles p on au.id = p.id
order by au.created_at desc;
