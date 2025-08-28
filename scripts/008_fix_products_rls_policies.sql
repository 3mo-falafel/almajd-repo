-- Fix RLS policies for products table to allow admin operations
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "products_insert_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_update_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_delete_authenticated" ON public.products;

-- Create new policies that allow admin operations without Supabase authentication
-- Allow all inserts (admin can add products)
CREATE POLICY "products_insert_all"
  ON public.products FOR INSERT
  WITH CHECK (true);

-- Allow all updates (admin can modify products)
CREATE POLICY "products_update_all"
  ON public.products FOR UPDATE
  USING (true);

-- Allow all deletes (admin can remove products)
CREATE POLICY "products_delete_all"
  ON public.products FOR DELETE
  USING (true);

-- Keep the existing select policy (everyone can read products)
-- CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);
-- This policy already exists and works fine
