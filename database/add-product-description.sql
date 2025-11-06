-- Add description field to products table
alter table products
add column if not exists description text;

-- Add a comment to describe the column
comment on column products.description is 'Detailed description of the product';
