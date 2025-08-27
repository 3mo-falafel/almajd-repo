-- Insert comprehensive sample fashion products for all categories and subcategories
INSERT INTO public.products (name, description, price, original_price, category, subcategory, sizes, colors, images, stock_quantity, is_featured, is_todays_offer, discount_percentage) VALUES

-- MEN'S COLLECTION

-- Men's Pants
('Classic Turkish Chinos', 'Premium cotton chinos with Turkish tailoring', 54.99, 69.99, 'men', 'pants', ARRAY['30', '32', '34', '36', '38', '40'], '[{"name": "Khaki", "hex": "#c3b091"}, {"name": "Navy", "hex": "#1e3a8a"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/men-chinos.png'], 25, false, true, 22),

('Formal Dress Trousers', 'Elegant dress pants for formal occasions', 79.99, 99.99, 'men', 'pants', ARRAY['30', '32', '34', '36', '38', '40', '42'], '[{"name": "Charcoal", "hex": "#374151"}, {"name": "Navy", "hex": "#1e3a8a"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/men-dress-pants.png'], 18, false, false, 0),

-- Men's Summer Shirts
('Linen Summer Shirt', 'Breathable linen shirt perfect for hot weather', 42.99, 0, 'men', 'summer-shirts', ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "White", "hex": "#ffffff"}, {"name": "Light Blue", "hex": "#dbeafe"}, {"name": "Cream", "hex": "#fffdd0"}]', ARRAY['/men-linen-shirt.png'], 30, true, false, 0),

('Cotton Polo Shirt', 'Classic polo shirt in premium cotton', 36.99, 44.99, 'men', 'summer-shirts', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Navy", "hex": "#1e3a8a"}, {"name": "White", "hex": "#ffffff"}, {"name": "Gray", "hex": "#6b7280"}]', ARRAY['/men-polo-shirt.png'], 35, false, true, 18),

-- Men's Winter Shirts
('Flannel Winter Shirt', 'Warm flannel shirt for cold weather', 52.99, 0, 'men', 'winter-shirts', ARRAY['M', 'L', 'XL', 'XXL'], '[{"name": "Red Plaid", "hex": "#dc2626"}, {"name": "Green Plaid", "hex": "#059669"}, {"name": "Blue Plaid", "hex": "#2563eb"}]', ARRAY['/men-flannel-shirt.png'], 22, false, false, 0),

('Thermal Long Sleeve', 'Insulated thermal shirt for extra warmth', 38.99, 48.99, 'men', 'winter-shirts', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Gray", "hex": "#6b7280"}, {"name": "Navy", "hex": "#1e3a8a"}]', ARRAY['/men-thermal-shirt.png'], 28, false, true, 20),

-- Men's Jackets
('Leather Bomber Jacket', 'Genuine leather bomber with Turkish craftsmanship', 149.99, 199.99, 'men', 'jackets', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Brown", "hex": "#92400e"}]', ARRAY['/men-leather-jacket.png'], 12, true, true, 25),

('Denim Jacket', 'Classic denim jacket with modern fit', 68.99, 0, 'men', 'jackets', ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name": "Blue Denim", "hex": "#4f46e5"}, {"name": "Black Denim", "hex": "#1f2937"}]', ARRAY['/men-denim-jacket.png'], 20, false, false, 0),

-- Men's Boots
('Turkish Leather Boots', 'Handcrafted leather boots from Turkey', 124.99, 159.99, 'men', 'boots', ARRAY['40', '41', '42', '43', '44', '45'], '[{"name": "Brown", "hex": "#92400e"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/men-leather-boots.png'], 15, true, false, 0),

-- Men's Underwear
('Cotton Boxer Briefs', 'Comfortable cotton boxer briefs pack', 24.99, 0, 'men', 'underwear', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Gray", "hex": "#6b7280"}, {"name": "White", "hex": "#ffffff"}]', ARRAY['/men-boxer-briefs.png'], 50, false, false, 0),

-- Men's Hats
('Turkish Wool Beanie', 'Warm wool beanie for winter', 18.99, 24.99, 'men', 'hats', ARRAY['One Size'], '[{"name": "Black", "hex": "#000000"}, {"name": "Gray", "hex": "#6b7280"}, {"name": "Navy", "hex": "#1e3a8a"}]', ARRAY['/men-wool-beanie.png'], 40, false, true, 24),

-- Men's Slippers
('Leather House Slippers', 'Comfortable leather slippers for home', 32.99, 0, 'men', 'slippers', ARRAY['40', '41', '42', '43', '44'], '[{"name": "Brown", "hex": "#92400e"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/men-leather-slippers.png'], 25, false, false, 0),

-- WOMEN'S COLLECTION

-- Women's Dress
('Silk Evening Dress', 'Elegant silk dress for special occasions', 129.99, 169.99, 'women', 'dress', ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name": "Burgundy", "hex": "#7c2d12"}, {"name": "Navy", "hex": "#1e3a8a"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/women-silk-dress.png'], 15, true, true, 24),

('Casual Summer Dress', 'Light and comfortable dress for everyday wear', 48.99, 0, 'women', 'dress', ARRAY['XS', 'S', 'M', 'L'], '[{"name": "Floral Print", "hex": "#ec4899"}, {"name": "Solid Blue", "hex": "#2563eb"}, {"name": "White", "hex": "#ffffff"}]', ARRAY['/women-summer-dress.png'], 32, false, false, 0),

-- Women's Abaya
('Traditional Black Abaya', 'Classic black abaya with elegant design', 89.99, 119.99, 'women', 'abaya', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}]', ARRAY['/women-black-abaya.png'], 20, false, true, 25),

('Embroidered Abaya', 'Beautiful abaya with traditional embroidery', 134.99, 0, 'women', 'abaya', ARRAY['S', 'M', 'L', 'XL'], '[{"name": "Navy", "hex": "#1e3a8a"}, {"name": "Charcoal", "hex": "#374151"}]', ARRAY['/women-embroidered-abaya.png'], 12, true, false, 0),

-- Women's Pants
('High-Waist Trousers', 'Stylish high-waist trousers for modern women', 64.99, 79.99, 'women', 'pants', ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name": "Black", "hex": "#000000"}, {"name": "Beige", "hex": "#f5f5dc"}, {"name": "Navy", "hex": "#1e3a8a"}]', ARRAY['/women-high-waist-pants.png'], 28, false, true, 19),

-- Women's Summer Shirts
('Silk Blouse', 'Luxurious silk blouse for elegant look', 72.99, 0, 'women', 'summer-shirts', ARRAY['XS', 'S', 'M', 'L'], '[{"name": "Cream", "hex": "#fffdd0"}, {"name": "Pink", "hex": "#ec4899"}, {"name": "White", "hex": "#ffffff"}]', ARRAY['/women-silk-blouse.png'], 24, true, false, 0),

-- Women's Winter Shirts
('Cashmere Sweater', 'Soft cashmere sweater for winter warmth', 98.99, 129.99, 'women', 'winter-shirts', ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name": "Cream", "hex": "#fffdd0"}, {"name": "Gray", "hex": "#6b7280"}, {"name": "Burgundy", "hex": "#7c2d12"}]', ARRAY['/women-cashmere-sweater.png'], 18, true, true, 24),

-- Women's Jackets
('Wool Coat', 'Elegant wool coat for cold weather', 159.99, 199.99, 'women', 'jackets', ARRAY['XS', 'S', 'M', 'L'], '[{"name": "Camel", "hex": "#c3b091"}, {"name": "Black", "hex": "#000000"}, {"name": "Navy", "hex": "#1e3a8a"}]', ARRAY['/women-wool-coat.png'], 14, true, false, 0),

-- Women's Boots
('Ankle Boots', 'Stylish ankle boots with heel', 89.99, 109.99, 'women', 'boots', ARRAY['36', '37', '38', '39', '40'], '[{"name": "Black", "hex": "#000000"}, {"name": "Brown", "hex": "#92400e"}]', ARRAY['/women-ankle-boots.png'], 22, false, true, 18),

-- Women's Slippers
('Velvet Slippers', 'Luxurious velvet slippers for comfort', 28.99, 0, 'women', 'slippers', ARRAY['36', '37', '38', '39', '40'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "Purple", "hex": "#7c3aed"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/women-velvet-slippers.png'], 35, false, false, 0),

-- BOYS' COLLECTION

-- Boys' Pants
('School Uniform Pants', 'Durable pants for school wear', 29.99, 39.99, 'boys', 'pants', ARRAY['4', '6', '8', '10', '12', '14'], '[{"name": "Navy", "hex": "#1e3a8a"}, {"name": "Black", "hex": "#000000"}, {"name": "Gray", "hex": "#6b7280"}]', ARRAY['/boys-school-pants.png'], 40, false, true, 25),

-- Boys' Summer Shirts
('Graphic T-Shirt', 'Fun graphic t-shirt for active boys', 19.99, 0, 'boys', 'summer-shirts', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Blue", "hex": "#2563eb"}, {"name": "Red", "hex": "#dc2626"}, {"name": "Green", "hex": "#059669"}]', ARRAY['/boys-graphic-tshirt.png'], 45, false, false, 0),

-- Boys' Winter Shirts
('Hoodie Sweatshirt', 'Warm hoodie for cold days', 34.99, 44.99, 'boys', 'winter-shirts', ARRAY['6', '8', '10', '12', '14'], '[{"name": "Gray", "hex": "#6b7280"}, {"name": "Navy", "hex": "#1e3a8a"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/boys-hoodie.png'], 30, false, true, 22),

-- Boys' Jackets
('Puffer Jacket', 'Warm puffer jacket for winter', 54.99, 69.99, 'boys', 'jackets', ARRAY['6', '8', '10', '12', '14'], '[{"name": "Blue", "hex": "#2563eb"}, {"name": "Black", "hex": "#000000"}, {"name": "Red", "hex": "#dc2626"}]', ARRAY['/boys-puffer-jacket.png'], 25, false, true, 20),

-- Boys' Boots
('Sneaker Boots', 'Comfortable sneaker-style boots', 42.99, 0, 'boys', 'boots', ARRAY['28', '30', '32', '34', '36'], '[{"name": "Black", "hex": "#000000"}, {"name": "White", "hex": "#ffffff"}, {"name": "Blue", "hex": "#2563eb"}]', ARRAY['/boys-sneaker-boots.png'], 35, false, false, 0),

-- Boys' Underwear
('Cotton Briefs Pack', 'Comfortable cotton briefs for boys', 16.99, 0, 'boys', 'underwear', ARRAY['4', '6', '8', '10', '12'], '[{"name": "White", "hex": "#ffffff"}, {"name": "Blue", "hex": "#2563eb"}, {"name": "Gray", "hex": "#6b7280"}]', ARRAY['/boys-cotton-briefs.png'], 50, false, false, 0),

-- Boys' Hats
('Baseball Cap', 'Classic baseball cap for boys', 14.99, 19.99, 'boys', 'hats', ARRAY['One Size'], '[{"name": "Blue", "hex": "#2563eb"}, {"name": "Red", "hex": "#dc2626"}, {"name": "Black", "hex": "#000000"}]', ARRAY['/boys-baseball-cap.png'], 40, false, true, 25),

-- Boys' Slippers
('Cartoon Slippers', 'Fun cartoon character slippers', 22.99, 0, 'boys', 'slippers', ARRAY['28', '30', '32', '34'], '[{"name": "Blue", "hex": "#2563eb"}, {"name": "Red", "hex": "#dc2626"}, {"name": "Green", "hex": "#059669"}]', ARRAY['/boys-cartoon-slippers.png'], 30, false, false, 0),

-- GIRLS' COLLECTION

-- Girls' Dress
('Party Dress', 'Beautiful dress for special occasions', 52.99, 69.99, 'girls', 'dress', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "Purple", "hex": "#7c3aed"}, {"name": "White", "hex": "#ffffff"}]', ARRAY['/girls-party-dress.png'], 25, true, true, 24),

('Casual Play Dress', 'Comfortable dress for everyday play', 28.99, 0, 'girls', 'dress', ARRAY['4', '6', '8', '10'], '[{"name": "Yellow", "hex": "#eab308"}, {"name": "Pink", "hex": "#ec4899"}, {"name": "Blue", "hex": "#2563eb"}]', ARRAY['/girls-play-dress.png'], 35, false, false, 0),

-- Girls' Pants
('Leggings', 'Stretchy leggings for active girls', 18.99, 24.99, 'girls', 'pants', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Black", "hex": "#000000"}, {"name": "Pink", "hex": "#ec4899"}, {"name": "Purple", "hex": "#7c3aed"}]', ARRAY['/girls-leggings.png'], 40, false, true, 20),

-- Girls' Summer Shirts
('Floral Tank Top', 'Pretty floral tank top for summer', 16.99, 0, 'girls', 'summer-shirts', ARRAY['4', '6', '8', '10'], '[{"name": "Pink Floral", "hex": "#ec4899"}, {"name": "Yellow Floral", "hex": "#eab308"}, {"name": "White Floral", "hex": "#ffffff"}]', ARRAY['/girls-floral-tank.png'], 38, false, false, 0),

-- Girls' Winter Shirts
('Unicorn Sweater', 'Magical unicorn-themed sweater', 32.99, 42.99, 'girls', 'winter-shirts', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "Purple", "hex": "#7c3aed"}, {"name": "White", "hex": "#ffffff"}]', ARRAY['/girls-unicorn-sweater.png'], 28, true, true, 23),

-- Girls' Jackets
('Denim Jacket', 'Stylish denim jacket for girls', 38.99, 48.99, 'girls', 'jackets', ARRAY['4', '6', '8', '10', '12'], '[{"name": "Light Blue", "hex": "#dbeafe"}, {"name": "Pink", "hex": "#ec4899"}]', ARRAY['/girls-denim-jacket.png'], 22, false, true, 20),

-- Girls' Boots
('Princess Boots', 'Sparkly boots fit for a princess', 36.99, 0, 'girls', 'boots', ARRAY['26', '28', '30', '32', '34'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "Purple", "hex": "#7c3aed"}, {"name": "Silver", "hex": "#9ca3af"}]', ARRAY['/girls-princess-boots.png'], 30, true, false, 0),

-- Girls' Slippers
('Bunny Slippers', 'Cute bunny-shaped slippers', 19.99, 0, 'girls', 'slippers', ARRAY['26', '28', '30', '32'], '[{"name": "Pink", "hex": "#ec4899"}, {"name": "White", "hex": "#ffffff"}, {"name": "Purple", "hex": "#7c3aed"}]', ARRAY['/girls-bunny-slippers.png'], 35, false, false, 0);
