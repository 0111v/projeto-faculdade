-- Create cart_items table
create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,

  -- Ensure each user can only have one entry per product
  unique(user_id, product_id)
);

-- Indexes for better performance
create index if not exists cart_items_user_id_idx on cart_items(user_id);
create index if not exists cart_items_product_id_idx on cart_items(product_id);

-- Function to automatically update updated_at
create or replace function update_cart_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at
create trigger update_cart_items_updated_at
  before update on cart_items
  for each row
  execute function update_cart_items_updated_at();

-- RLS Policies
alter table cart_items enable row level security;

-- Users can only view their own cart items
create policy "Users can view their own cart items"
  on cart_items for select
  using (auth.uid() = user_id);

-- Users can only insert items into their own cart
create policy "Users can insert their own cart items"
  on cart_items for insert
  with check (auth.uid() = user_id);

-- Users can only update their own cart items
create policy "Users can update their own cart items"
  on cart_items for update
  using (auth.uid() = user_id);

-- Users can only delete their own cart items
create policy "Users can delete their own cart items"
  on cart_items for delete
  using (auth.uid() = user_id);
