-- Create profiles table for user roles
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies for profiles
-- Users can view their own profile
create policy "Users can view their own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

-- Users can update their own profile (but not the role)
create policy "Users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from profiles where id = auth.uid()));

-- Create index for faster role lookups
create index if not exists profiles_role_idx on profiles(role);

-- Helper function to check if current user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$ language sql security definer;

-- Function to auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Comments
comment on table profiles is 'User profiles with role-based access control';
comment on column profiles.role is 'User role: customer (default) or admin';
comment on function is_admin() is 'Helper function to check if current user has admin role';
