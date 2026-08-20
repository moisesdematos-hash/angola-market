-- ========================================================
-- ANGOLA MARKET — PostgreSQL Schema Migration Script
-- ========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- --------------------------------------------------------
-- 1. ENUMS & TYPES
-- --------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM (
    'customer',
    'seller',
    'delivery',
    'support',
    'moderator',
    'finance',
    'admin',
    'super_admin'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE seller_verification_status AS ENUM ('pending', 'under_review', 'verified', 'rejected', 'suspended');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'completed',
    'refunded',
    'disputed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('pending', 'escrow_locked', 'released', 'refunded', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status_enum AS ENUM ('unassigned', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- 2. USERS & AUTH PROFILES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  province TEXT DEFAULT 'Luanda',
  municipality TEXT DEFAULT 'Luanda',
  bairro TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name user_role_enum UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- --------------------------------------------------------
-- 3. SELLERS, STORES & SCORES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  nif TEXT UNIQUE,
  bank_name TEXT NOT NULL DEFAULT 'BAI',
  iban TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  verification_status seller_verification_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL UNIQUE REFERENCES public.sellers(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL DEFAULT 'Luanda',
  address_details TEXT,
  phone TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seller_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL UNIQUE REFERENCES public.sellers(id) ON DELETE CASCADE,
  score NUMERIC(5,2) DEFAULT 100.00, -- 0 to 100
  tier TEXT DEFAULT 'Excelente', -- Excelente, Muito bom, Bom, Atenção, Suspenso
  fulfillment_rate NUMERIC(5,2) DEFAULT 100.00,
  return_rate NUMERIC(5,2) DEFAULT 0.00,
  response_time_hours NUMERIC(5,2) DEFAULT 1.0,
  cancellation_rate NUMERIC(5,2) DEFAULT 0.00,
  total_orders INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seller_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- NIF, BI, Alvará
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 4. CATEGORIES, BRANDS & PRODUCTS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  commission_percentage NUMERIC(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  subcategory_id UUID REFERENCES public.subcategories(id),
  brand_id UUID REFERENCES public.brands(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  promotional_price NUMERIC(12,2),
  sku TEXT NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  min_stock_alert INT DEFAULT 3,
  province TEXT NOT NULL DEFAULT 'Luanda',
  weight_kg NUMERIC(6,2) DEFAULT 0.5,
  dimensions TEXT,
  rating_avg NUMERIC(3,2) DEFAULT 5.00,
  reviews_count INT DEFAULT 0,
  sales_count INT DEFAULT 0,
  is_sponsored BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "128GB Preto", "Tamanho L Azul"
  sku TEXT UNIQUE NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 5. ADDRESSES, CARTS & ORDERS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_session_id TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  province TEXT NOT NULL DEFAULT 'Luanda',
  municipality TEXT NOT NULL DEFAULT 'Luanda',
  bairro TEXT NOT NULL,
  landmark TEXT NOT NULL, -- Ex: "próximo de..."
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  guest_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id, variant_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_session_id TEXT,
  store_id UUID NOT NULL REFERENCES public.stores(id),
  address_id UUID NOT NULL REFERENCES public.addresses(id),
  subtotal NUMERIC(12,2) NOT NULL,
  shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT NOT NULL, -- mcx, bank_transfer, cod
  status order_status_enum DEFAULT 'pending',
  tracking_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  title TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_status_enum NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 6. PAYMENTS & ESCROW
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status payment_status_enum DEFAULT 'pending',
  mcx_reference TEXT,
  proof_of_payment_url TEXT,
  escrow_locked_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.sellers(id),
  amount NUMERIC(12,2) NOT NULL,
  iban TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processed, failed
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 7. LOGISTICS & DELIVERIES
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL, -- Moto, Carro, Carrinha
  vehicle_plate TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_online BOOLEAN DEFAULT FALSE,
  total_deliveries INT DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  delivery_partner_id UUID REFERENCES public.delivery_partners(id),
  status delivery_status_enum DEFAULT 'unassigned',
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  verification_pin TEXT NOT NULL,
  proof_signature_url TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 8. REVIEWS, DISPUTES & CHAT
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id),
  opened_by_user_id UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, under_review, resolved_refund, resolved_seller, closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID REFERENCES public.sellers(id),
  support_assigned_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 9. ADS, AFFILIATES & AI CONVERSATIONS
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  campaign_type TEXT NOT NULL, -- sponsored_product, featured_banner
  budget NUMERIC(12,2) NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id),
  referral_code TEXT UNIQUE NOT NULL,
  commission_earned NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ai_conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  recommended_product_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Public read access for active products, stores, categories
CREATE POLICY "Public products viewable by everyone" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Public stores viewable by everyone" ON public.stores FOR SELECT USING (is_active = true);

-- User Profiles self access
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Seller policies
CREATE POLICY "Sellers manage own products" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.stores s
    JOIN public.sellers sel ON sel.id = s.seller_id
    WHERE s.id = products.store_id AND sel.user_id = auth.uid()
  )
);

-- Order policies: customer & seller access
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Sellers view store orders" ON public.orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.stores s
    JOIN public.sellers sel ON sel.id = s.seller_id
    WHERE s.id = orders.store_id AND sel.user_id = auth.uid()
  )
);
