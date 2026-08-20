-- ========================================================
-- ANGOLA MARKET — Database Seed Data Script
-- ========================================================

-- Insert Categories
INSERT INTO public.categories (id, slug, name, description, icon, commission_percentage) VALUES
('c1000000-0000-0000-0000-000000000001', 'tecnologia', 'Tecnologia', 'Eletrónicos, gadgets, som e fotografia', 'Cpu', 10.00),
('c1000000-0000-0000-0000-000000000002', 'telemoveis', 'Telemóveis', 'Smartphones, capas, carregadores e acessórios', 'Smartphone', 8.00),
('c1000000-0000-0000-0000-000000000003', 'computadores', 'Computadores', 'Portáteis, desktops, monitores e periféricos', 'Laptop', 10.00),
('c1000000-0000-0000-0000-000000000004', 'casa', 'Casa', 'Mobiliário, decoração, iluminação e utensílios', 'Home', 12.00),
('c1000000-0000-0000-0000-000000000005', 'eletrodomesticos', 'Eletrodomésticos', 'Frigoríficos, máquinas de lavar, ar condicionado', 'Tv', 10.00),
('c1000000-0000-0000-0000-000000000006', 'moda', 'Moda', 'Roupas masculinas, femininas, acessórios e bijuteria', 'Shirt', 15.00),
('c1000000-0000-0000-0000-000000000007', 'calcado', 'Calçado', 'Sapatilhas, sapatos formais, sandálias e botas', 'Footprints', 15.00),
('c1000000-0000-0000-0000-000000000008', 'beleza', 'Beleza & Cuidados', 'Perfumes, maquilhagem, cosmética e cuidados capilares', 'Sparkles', 12.00)
ON CONFLICT (slug) DO NOTHING;

-- Insert Brands
INSERT INTO public.brands (id, name) VALUES
('b1000000-0000-0000-0000-000000000001', 'Apple'),
('b1000000-0000-0000-0000-000000000002', 'Samsung'),
('b1000000-0000-0000-0000-000000000003', 'HP'),
('b1000000-0000-0000-0000-000000000004', 'Dell'),
('b1000000-0000-0000-0000-000000000005', 'Xiaomi'),
('b1000000-0000-0000-0000-000000000006', 'Nike'),
('b1000000-0000-0000-0000-000000000007', 'LG')
ON CONFLICT (name) DO NOTHING;
