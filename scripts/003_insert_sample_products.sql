-- Insert sample products for testing
INSERT INTO public.products (name, description, price, original_price, category, subcategory, sizes, colors, images, stock_quantity, is_featured, is_todays_offer, discount_percentage) VALUES

-- Men's Products
('Premium Turkish Jacket', 'Elegant Turkish-style jacket made from high-quality fabric', 89.99, 119.99, 'men', 'jackets', ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Navy Blue", "hex": "#1e3a8a"}, {"name": "Charcoal", "hex": "#374151"}, {"name": "Brown", "hex": "#92400e"}]', ARRAY['/elegant-men-s-turkish-jacket.png', '/men-s-jacket-detail-view.png', '/men-s-jacket-back-view.png'], 25, true, true, 25),

('Classic Summer Shirt', 'Lightweight cotton shirt perfect for summer', 34.99, 44.99, 'men', 'summer-shirts', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "White", "hex": "#ffffff"}, {"name": "Light Blue", "hex": "#dbeafe"}, {"name": "Beige", "hex": "#f5f5dc"}]', ARRAY['/classic-summer-shirt.png'], 30, false, false, 0),

('Formal Winter Shirt', 'Warm and stylish winter shirt', 49.99, 0, 'men', 'winter-shirts', ARRAY['M', 'L', 'XL', 'XXL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Dark Gray", "hex": "#4b5563"}, {"name": "Burgundy", "hex": "#7c2d12"}]', ARRAY['/formal-winter-shirt.png'], 20, false, false, 0),

('Turkish Dress Pants', 'Tailored dress pants with Turkish craftsmanship', 59.99, 79.99, 'men', 'pants', ARRAY['30', '32', '34', '36', '38', '40'], '[{"name": "Black", "hex": "#000000"}, {"name": "Navy", "hex": "#1e3a8a"}, {"name": "Gray", "hex": "#6b7280"}]', ARRAY['/turkish-dress-pants.png'], 15, false, true, 25),

-- Women's Products
('Elegant Turkish Dress', 'Beautiful traditional-inspired dress', 79.99, 99.99, 'women', 'dress', ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name": "Emerald", "hex": "#059669"}, {"name": "Royal Blue", "hex": "#1d4ed8"}, {"name": "Burgundy", "hex": "#7c2d12"}]', ARRAY['/elegant-turkish-women-s-dress.png', '/women-s-dress-detail-view.png'], 18, true, false, 0),

('Modern Abaya', 'Contemporary abaya with elegant design', 94.99, 124.99, 'women', 'abaya', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Navy", "hex": "#1e3a8a"}, {"name": "Charcoal", "hex": "#374151"}]', ARRAY['/modern-abaya.png'], 12, false, true, 24),

('Women\'s Summer Blouse', 'Light and airy summer blouse', 39.99, 0, 'women', 'summer-shirts', ARRAY['XS', 'S', 'M', 'L'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "Lavender", "hex": "#a78bfa"}, {"name": "Mint", "hex": "#6ee7b7"}]', ARRAY['/women-summer-blouse.png'], 22, false, false, 0),

-- Boys' Products
('Boys Turkish Jacket', 'Stylish jacket for young gentlemen', 49.99, 64.99, 'boys', 'jackets', ARRAY['4', '6', '8', '10', '12', '14'], '[{"name": "Navy", "hex": "#1e3a8a"}, {"name": "Green", "hex": "#059669"}, {"name": "Gray", "hex": "#6b7280"}]', ARRAY['/boys-turkish-jacket.png'], 20, false, true, 23),

('Boys Summer Polo', 'Comfortable polo shirt for active boys', 24.99, 0, 'boys', 'summer-shirts', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Red", "hex": "#dc2626"}, {"name": "Blue", "hex": "#2563eb"}, {"name": "White", "hex": "#ffffff"}]', ARRAY['/boys-summer-polo.png'], 35, false, false, 0),

-- Girls' Products
('Girls Princess Dress', 'Beautiful dress fit for a princess', 44.99, 59.99, 'girls', 'dress', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "Purple", "hex": "#7c3aed"}, {"name": "Turquoise", "hex": "#06b6d4"}]', ARRAY['/girls-princess-dress.png'], 25, true, false, 0),

('Girls Summer Dress', 'Light and comfortable summer dress', 34.99, 44.99, 'girls', 'dress', ARRAY['4', '6', '8', '10'], '[{"name": "Yellow", "hex": "#eab308"}, {"name": "Coral", "hex": "#f97316"}, {"name": "Mint", "hex": "#6ee7b7"}]', ARRAY['/girls-summer-dress.png'], 28, false, true, 22);
