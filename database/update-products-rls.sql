-- Update products table RLS policies to be admin-only for write operations

-- Drop existing policies
drop policy if exists "Anyone can view products" on products;
drop policy if exists "Authenticated users can create products" on products;
drop policy if exists "Authenticated users can update products" on products;
drop policy if exists "Authenticated users can delete products" on products;

-- Public read access (anyone can view products)
create policy "Anyone can view products"
  on products for select
  to anon, authenticated
  using (true);

-- Admin-only write access
create policy "Only admins can create products"
  on products for insert
  to authenticated
  with check (is_admin());

create policy "Only admins can update products"
  on products for update
  to authenticated
  using (is_admin())
  with check (is_admin());

create policy "Only admins can delete products"
  on products for delete
  to authenticated
  using (is_admin());

-- Comments
comment on policy "Only admins can create products" on products is 'Restricts product creation to admin users only';
comment on policy "Only admins can update products" on products is 'Restricts product updates to admin users only';
comment on policy "Only admins can delete products" on products is 'Restricts product deletion to admin users only';
