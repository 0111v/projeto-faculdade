-- Create orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total_price numeric(10, 2) not null check (total_price >= 0),
  status text not null default 'completed' check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamp with time zone default now() not null
);

-- Create order_items table
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price_at_time numeric(10, 2) not null check (price_at_time >= 0),
  created_at timestamp with time zone default now() not null
);

-- Create indexes for better query performance
create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists order_items_order_id_idx on order_items(order_id);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS Policies for orders table
-- Users can only view their own orders
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Users can create their own orders
create policy "Users can create their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- RLS Policies for order_items table
-- Users can view order items for their own orders
create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Users can create order items for their own orders
create policy "Users can create order items for their own orders"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Comments
comment on table orders is 'Stores customer orders';
comment on table order_items is 'Stores items within each order with price snapshot';
comment on column orders.customer_name is 'Customer full name';
comment on column orders.customer_phone is 'Customer phone number';
comment on column orders.customer_address is 'Customer delivery address';
comment on column order_items.price_at_time is 'Product price at the time of order (snapshot)';
