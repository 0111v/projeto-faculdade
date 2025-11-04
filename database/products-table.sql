-- Create products table (ecommerce: owner posts, customers view)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  quantity integer not null default 0 check (quantity >= 0)
);

-- Enable Row Level Security
alter table products enable row level security;

-- RLS Policies: Public read, authenticated write
-- Everyone can view products (including non-authenticated users for browsing)
create policy "Anyone can view products"
  on products for select
  to authenticated, anon
  using (true);

-- Only authenticated users can manage products (you'll add admin check later)
create policy "Authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update products"
  on products for update
  to authenticated
  using (true);

create policy "Authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);

-- Note: For now, any authenticated user can manage products.
-- Later you can add a 'profiles' table with a 'role' column and update these policies
-- to check: (select role from profiles where id = auth.uid()) = 'admin'
