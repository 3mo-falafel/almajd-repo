-- Create products table for the clothing store
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT NOT NULL CHECK (category IN ('men', 'women', 'boys', 'girls')),
  subcategory TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_todays_offer BOOLEAN DEFAULT false,
  discount_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_todays_offer ON public.products(is_todays_offer);

-- Enable RLS (Row Level Security) - products are public readable but admin-only writable
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products
CREATE POLICY "products_select_all"
  ON public.products FOR SELECT
  USING (true);

-- Generic self-hosted policies (adjust USING / WITH CHECK for real auth later)
DROP POLICY IF EXISTS "products_insert_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_update_authenticated" ON public.products;
DROP POLICY IF EXISTS "products_delete_authenticated" ON public.products;

CREATE POLICY "products_insert_all"
  ON public.products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "products_update_all"
  ON public.products FOR UPDATE
  USING (true);

CREATE POLICY "products_delete_all"
  ON public.products FOR DELETE
  USING (true);
