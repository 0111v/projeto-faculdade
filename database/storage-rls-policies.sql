-- Políticas RLS para Supabase Storage (product-images bucket)
-- Execute este SQL no Supabase SQL Editor para permitir uploads

-- 1. Permitir que usuários AUTENTICADOS façam upload de imagens
create policy "Authenticated users can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

-- 2. Permitir que TODOS vejam as imagens (público)
create policy "Anyone can view product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

-- 3. Permitir que usuários AUTENTICADOS atualizem imagens
create policy "Authenticated users can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images');

-- 4. Permitir que usuários AUTENTICADOS deletem imagens
create policy "Authenticated users can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');
