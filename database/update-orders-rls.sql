-- Add RLS policies to allow admins to view all orders

-- Allow admins to view all orders
create policy "Admins can view all orders"
  on orders for select
  to authenticated
  using (is_admin());

-- Allow admins to view all order items
create policy "Admins can view all order items"
  on order_items for select
  to authenticated
  using (is_admin());

-- Verification queries
-- Check all policies on orders table
select schemaname, tablename, policyname, permissive, roles, cmd, qual
from pg_policies
where tablename = 'orders'
order by policyname;

-- Check all policies on order_items table
select schemaname, tablename, policyname, permissive, roles, cmd, qual
from pg_policies
where tablename = 'order_items'
order by policyname;
