export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  promotional_price?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  stock_quantity: number;
  province: string;
  municipality: string;
  rating_avg: number;
  reviews_count: number;
  sales_count: number;
  is_sponsored?: boolean;
  is_verified_seller?: boolean;
  seller: {
    id: string;
    store_name: string;
    store_slug: string;
    logo_url?: string;
    verified: boolean;
    score: number;
    score_tier: string;
  };
  variants?: {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
  }[];
  attributes?: Record<string, string>;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string;
  banner_url: string;
  province: string;
  municipality: string;
  phone: string;
  verified: boolean;
  score: number;
  score_tier: string;
  total_sales: number;
  joined_date: string;
}

export const MOCK_STORES: Store[] = [
  {
    id: "store-1",
    slug: "luanda-tech-center",
    name: "Luanda Tech Center",
    description: "Vendedor oficial de smartphones, portáteis e eletrónicos premium em Luanda.",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    province: "Luanda",
    municipality: "Talatona",
    phone: "+244 923 456 789",
    verified: true,
    score: 98,
    score_tier: "Excelente",
    total_sales: 1420,
    joined_date: "2024-01-15"
  },
  {
    id: "store-2",
    slug: "benguela-electro-loja",
    name: "Benguela Electro",
    description: "Grandes e pequenos eletrodomésticos com entrega rápida para todo o litoral angolano.",
    logo_url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=150&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80",
    province: "Benguela",
    municipality: "Lobito",
    phone: "+244 912 888 999",
    verified: true,
    score: 95,
    score_tier: "Muito bom",
    total_sales: 840,
    joined_date: "2024-03-10"
  },
  {
    id: "store-3",
    slug: "huambo-boutique-moda",
    name: "Kwanza Style Boutique",
    description: "Moda contemporânea angolana, calçado de qualidade e acessórios de luxo.",
    logo_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80",
    banner_url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80",
    province: "Huambo",
    municipality: "Huambo",
    phone: "+244 934 111 222",
    verified: true,
    score: 92,
    score_tier: "Muito bom",
    total_sales: 512,
    joined_date: "2024-05-20"
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "iphone-15-pro-max-256gb-titânio-natural",
    title: "iPhone 15 Pro Max 256GB - Titânio Natural (Selado)",
    description: "Smartphone Apple iPhone 15 Pro Max de 256GB com acabamento em Titânio Natural. Ecrã Super Retina XDR de 6,7 polegadas com ProMotion, chip A17 Pro ultra rápido, câmara principal de 48MP com zoom ótico de 5x. Garantia oficial de 1 ano.",
    price: 1350000,
    promotional_price: 1250000,
    category: "Telemóveis",
    subcategory: "Smartphones",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1695048133021-08f32a58d6e3?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 8,
    province: "Luanda",
    municipality: "Talatona",
    rating_avg: 4.9,
    reviews_count: 42,
    sales_count: 128,
    is_sponsored: true,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    },
    variants: [
      { id: "v1", name: "256GB Titânio Natural", sku: "IP15PM-256-NAT", price: 1250000, stock: 5 },
      { id: "v2", name: "512GB Titânio Preto", sku: "IP15PM-512-BLK", price: 1480000, stock: 3 }
    ]
  },
  {
    id: "prod-2",
    slug: "samsung-galaxy-s24-ultra-512gb",
    title: "Samsung Galaxy S24 Ultra 5G 512GB Titanium Gray",
    description: "Smartphone Samsung Galaxy S24 Ultra com Galaxy AI integrada, ecrã Dynamic AMOLED 2X de 6.8 polegadas, S Pen incluída, câmara revolucionária de 200MP e processador Snapdragon 8 Gen 3.",
    price: 1190000,
    promotional_price: 1100000,
    category: "Telemóveis",
    subcategory: "Smartphones",
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 12,
    province: "Luanda",
    municipality: "Kilamba Kiaxi",
    rating_avg: 4.8,
    reviews_count: 31,
    sales_count: 94,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    }
  },
  {
    id: "prod-3",
    slug: "macbook-air-m3-15-polegadas-16gb-512gb",
    title: "MacBook Air M3 15\" (16GB RAM / 512GB SSD) - Meia-Noite",
    description: "Portátil Apple MacBook Air de 15 polegadas com chip M3 de nova geração, 16GB de memória unificada e 512GB de armazenamento SSD super rápido. Design ultra fino e leve com bateria até 18 horas.",
    price: 1680000,
    category: "Computadores",
    subcategory: "Computadores Portáteis",
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 4,
    province: "Luanda",
    municipality: "Viana",
    rating_avg: 5.0,
    reviews_count: 18,
    sales_count: 36,
    is_sponsored: true,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    }
  },
  {
    id: "prod-4",
    slug: "frigorifico-lg-side-by-side-inverter-508l",
    title: "Frigorífico LG Side by Side Inverter 508L Inox",
    description: "Frigorífico americano LG Side-by-Side com tecnologia Smart Inverter Compressor, dispensador de água e gelo na porta, sistema Multi Air Flow e acabamento resistente a dedadas.",
    price: 950000,
    promotional_price: 890000,
    category: "Eletrodomésticos",
    subcategory: "Grandes Eletrodomésticos",
    brand: "LG",
    images: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 6,
    province: "Benguela",
    municipality: "Lobito",
    rating_avg: 4.7,
    reviews_count: 14,
    sales_count: 29,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-2",
      store_name: "Benguela Electro",
      store_slug: "benguela-electro-loja",
      verified: true,
      score: 95,
      score_tier: "Muito bom"
    }
  },
  {
    id: "prod-5",
    slug: "sapatilhas-nike-air-force-1-07-brancas",
    title: "Sapatilhas Nike Air Force 1 '07 All White (Original)",
    description: "O clássico do basquetebol e streetwear. Sapatilhas Nike Air Force 1 originais em pele genuína branca com amortecimento Air selado no calcanhar. Conforto e durabilidade incomparáveis.",
    price: 98000,
    promotional_price: 85000,
    category: "Calçado",
    subcategory: "Sapatilhas & Desporto",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 24,
    province: "Huambo",
    municipality: "Huambo",
    rating_avg: 4.9,
    reviews_count: 65,
    sales_count: 210,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: true,
      score: 92,
      score_tier: "Muito bom"
    }
  },
  {
    id: "prod-6",
    slug: "gerador-a-gasolina-65kva-silencioso-digital",
    title: "Gerador a Gasolina 6.5 KVA Silencioso Monofásico",
    description: "Gerador elétrico ideal para residências e comércio em Angola. Potência de 6.5 KVA com arranque elétrico, depósito de 25L, proteção contra sobrecarga e baixíssimo ruído.",
    price: 450000,
    promotional_price: 410000,
    category: "Ferramentas",
    subcategory: "Geradores & Energia",
    brand: "Outros",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 10,
    province: "Luanda",
    municipality: "Cacuaco",
    rating_avg: 4.8,
    reviews_count: 23,
    sales_count: 57,
    is_sponsored: true,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    }
  }
];

export function formatKwanza(amount: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 0
  }).format(amount).replace('AOA', 'Kz');
}
