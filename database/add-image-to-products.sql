-- Add image_url column to products table
alter table products
add column image_url text;

-- Optional: Add a comment to document the column
comment on column products.image_url is 'URL to the product image stored in Supabase Storage';
