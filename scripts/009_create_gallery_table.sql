-- Create gallery table for admin-controlled image carousel
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  title_ar VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery table
CREATE POLICY "Allow public read access" ON gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Allow all operations" ON gallery FOR ALL USING (true);

-- Insert sample gallery items
INSERT INTO gallery (title, title_ar, image_url, display_order) VALUES
('WHO ARE WE', 'من نحن', '/turkish-fashion-boutique.png', 1),
('OUR LOCATION', 'موقعنا', '/turkish-fashion-store-location.png', 2),
('OUR STORY', 'قصتنا', '/turkish-fashion-heritage.png', 3),
('QUALITY PROMISE', 'وعد الجودة', '/turkish-fashion-quality.png', 4);
