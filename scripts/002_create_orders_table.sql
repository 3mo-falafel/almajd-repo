-- Create orders table for customer orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  order_items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- Enable RLS - orders are private to customers or admin-accessible
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Replace Supabase auth-based policies with permissive ones (adjust later for real auth)
DROP POLICY IF EXISTS "orders_select_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_update_authenticated" ON public.orders;

CREATE POLICY "orders_select_all"
  ON public.orders FOR SELECT
  USING (true);
>>>>>>> 0f826d0 (Remove Supabase, add UUID validation, improve delete endpoint, update RLS scripts)

-- Allow anyone to insert orders (for guest checkout)
CREATE POLICY "orders_insert_all"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "orders_update_all"
  ON public.orders FOR UPDATE
  USING (true);
CREATE POLICY "orders_update_all"
  ON public.orders FOR UPDATE
  USING (true);
