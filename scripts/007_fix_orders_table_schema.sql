-- Drop existing orders table if it exists with wrong schema
DROP TABLE IF EXISTS orders;

-- Create orders table with correct schema
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_notes TEXT,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is for admin use)
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

-- Insert sample order for testing
INSERT INTO orders (
  customer_name,
  customer_phone,
  customer_address,
  customer_city,
  customer_notes,
  order_items,
  total_amount,
  status
) VALUES (
  'Ahmed Hassan',
  '+90 555 123 4567',
  'Sultanahmet Mahallesi, Divanyolu Caddesi No: 15/3',
  'Istanbul',
  'Please call before delivery',
  '[
    {
      "product_id": "sample-id-1",
      "product_name": "Classic Turkish Chinos",
      "product_price": 54.99,
      "size": "32",
      "color": "Khaki",
      "quantity": 1,
      "subtotal": 54.99
    }
  ]'::jsonb,
  54.99,
  'pending'
);
