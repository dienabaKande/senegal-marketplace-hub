-- Fix RLS policies recursion issue
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a safer admin policy without recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM public.profiles 
    WHERE role = 'admin' AND user_id = auth.uid()
  ) 
  OR auth.uid() = user_id
);

-- Fix default role to be 'user' instead of admin
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Hommes', 'hommes', 'Vêtements et accessoires pour hommes', '/placeholder.svg'),
('Femmes', 'femmes', 'Vêtements et accessoires pour femmes', '/placeholder.svg'),
('Enfants', 'enfants', 'Vêtements et accessoires pour enfants', '/placeholder.svg'),
('Tissus', 'tissus', 'Tissus traditionnels sénégalais', '/placeholder.svg'),
('Artisanat', 'artisanat', 'Artisanat local et traditionnel', '/placeholder.svg'),
('Bijoux', 'bijoux', 'Bijoux et accessoires', '/placeholder.svg')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products for testing
INSERT INTO public.products (name, description, price, stock, category_id, image_url, featured, status) VALUES
('Boubou Grand Boubou Homme', 'Boubou traditionnel sénégalais en bazin riche, parfait pour les cérémonies', 45000, 15, (SELECT id FROM categories WHERE slug = 'hommes'), '/placeholder.svg', true, 'active'),
('Kaftan Femme Élégant', 'Kaftan brodé à la main avec motifs traditionnels', 35000, 20, (SELECT id FROM categories WHERE slug = 'femmes'), '/placeholder.svg', true, 'active'),
('Ensemble Enfant Traditionnel', 'Tenue traditionnelle complète pour enfant', 18000, 25, (SELECT id FROM categories WHERE slug = 'enfants'), '/placeholder.svg', false, 'active'),
('Tissu Wax Premium', 'Tissu wax de haute qualité, 6 yards', 12000, 50, (SELECT id FROM categories WHERE slug = 'tissus'), '/placeholder.svg', true, 'active'),
('Masque Sénégalais Sculpté', 'Masque artisanal sculpté à la main', 25000, 8, (SELECT id FROM categories WHERE slug = 'artisanat'), '/placeholder.svg', false, 'active'),
('Collier Perles Traditionnelles', 'Collier en perles traditionnelles sénégalaises', 8500, 30, (SELECT id FROM categories WHERE slug = 'bijoux'), '/placeholder.svg', false, 'active'),
('Chemise Homme Bazin', 'Chemise en bazin avec broderies', 28000, 12, (SELECT id FROM categories WHERE slug = 'hommes'), '/placeholder.svg', false, 'active'),
('Robe Femme Wax', 'Belle robe en tissu wax coloré', 22000, 18, (SELECT id FROM categories WHERE slug = 'femmes'), '/placeholder.svg', true, 'active'),
('Pantalon Enfant Coloré', 'Pantalon confortable pour enfant en tissu local', 12000, 22, (SELECT id FROM categories WHERE slug = 'enfants'), '/placeholder.svg', false, 'active'),
('Sac Artisanal Cuir', 'Sac en cuir travaillé à la main', 32000, 6, (SELECT id FROM categories WHERE slug = 'artisanat'), '/placeholder.svg', false, 'active');