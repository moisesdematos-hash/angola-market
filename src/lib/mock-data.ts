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
  condition?: 'novo' | 'usado' | 'reciclado';
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
    },
    condition: "novo"
  },
  {
    id: "prod-7",
    slug: "gerador-de-energia-35kva-usado",
    title: "Gerador a Gasolina 3.5 KVA - Usado (Bom Estado)",
    description: "Gerador elétrico portátil com potência de 3.5 KVA. Ideal para pequenos comércios ou backup residencial. Totalmente revisionado pela nossa equipa de técnicos.",
    price: 180000,
    promotional_price: 165000,
    category: "Ferramentas",
    subcategory: "Geradores & Energia",
    brand: "Outros",
    images: [
      "https://images.unsplash.com/photo-1597484211625-2431d87ed70f?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 2,
    province: "Benguela",
    municipality: "Benguela",
    rating_avg: 4.2,
    reviews_count: 5,
    sales_count: 14,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-2",
      store_name: "Benguela Electro",
      store_slug: "benguela-electro-loja",
      verified: true,
      score: 95,
      score_tier: "Muito bom"
    },
    condition: "usado"
  },
  {
    id: "prod-8",
    slug: "mesa-cafe-paletes-recicladas-ecologica",
    title: "Mesa de Café Ecológica de Paletes Recicladas",
    description: "Mesa de centro rústica feita à mão em Luanda a partir de paletes de madeira recicladas e tratadas contra pragas. Acabamento em verniz ecológico. Apoie a sustentabilidade local!",
    price: 45000,
    category: "Casa",
    subcategory: "Mobiliário",
    brand: "Artesanal",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 4,
    province: "Luanda",
    municipality: "Cazenga",
    rating_avg: 4.7,
    reviews_count: 8,
    sales_count: 22,
    is_sponsored: false,
    is_verified_seller: false,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: false,
      score: 85,
      score_tier: "Bom"
    },
    condition: "reciclado"
  },
  {
    id: "prod-9",
    slug: "hp-elitebook-840-g5-recondicionado",
    title: "HP EliteBook 840 G5 Intel i5 8GB/256GB - Recondicionado (Usado)",
    description: "Computador portátil profissional recondicionado de Grau A. Ecrã Full HD de 14 polegadas, processador Intel Core i5 de 8ª Geração, 8GB de RAM e 256GB SSD. Perfeito para trabalho e estudantes.",
    price: 260000,
    category: "Computadores",
    subcategory: "Computadores Portáteis",
    brand: "HP",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 5,
    province: "Luanda",
    municipality: "Talatona",
    rating_avg: 4.5,
    reviews_count: 12,
    sales_count: 31,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    },
    condition: "usado"
  },
  {
    id: "prod-10",
    slug: "vaso-ecologico-reciclado-de-pneus",
    title: "Vaso Ecológico Decorativo de Pneus Reciclados",
    description: "Vaso para jardim feito artesanalmente a partir de pneus de automóveis reutilizados e pintado à mão com tinta acrílica resistente às intempéries. Ideal para exterior.",
    price: 15000,
    category: "Casa",
    subcategory: "Decoração",
    brand: "Artesanal",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 15,
    province: "Huambo",
    municipality: "Huambo",
    rating_avg: 4.6,
    reviews_count: 4,
    sales_count: 18,
    is_sponsored: false,
    is_verified_seller: false,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: false,
      score: 85,
      score_tier: "Bom"
    },
    condition: "reciclado"
  },
  {
    id: "prod-11",
    slug: "coluna-bluetooth-jbl-charge-5",
    title: "Coluna de Som Bluetooth JBL Charge 5 (Original)",
    description: "Coluna de som portátil e impermeável com som Pro original da JBL, driver de longo alcance otimizado, tweeter separado e radiadores de graves duplos da JBL. Até 20 horas de reprodução.",
    price: 125000,
    category: "Tecnologia",
    subcategory: "Áudio & Colunas",
    brand: "JBL",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 15,
    province: "Luanda",
    municipality: "Talatona",
    rating_avg: 4.8,
    reviews_count: 14,
    sales_count: 55,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    },
    condition: "novo"
  },
  {
    id: "prod-12",
    slug: "camisa-polo-oficial-angola-algodao",
    title: "Camisa Polo Oficial Angola 100% Algodão",
    description: "Camisa polo premium com bordado de alta qualidade representando Angola. Tecido piquê de puro algodão super respirável e confortável.",
    price: 25000,
    category: "Moda",
    subcategory: "Roupa Homem",
    brand: "Estilo Luanda",
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 40,
    province: "Luanda",
    municipality: "Maianga",
    rating_avg: 4.6,
    reviews_count: 22,
    sales_count: 110,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: true,
      score: 92,
      score_tier: "Muito bom"
    },
    condition: "novo"
  },
  {
    id: "prod-13",
    slug: "perfume-bleu-de-chanel-masculino-100ml",
    title: "Perfume Bleu de Chanel Eau de Parfum Masculino 100ml",
    description: "Perfume aromático amadeirado icónico para homens modernos. Uma fragrância atemporal e sofisticada com notas de citrinos frescos, cedro e sândalo de alta fixação.",
    price: 185000,
    category: "Beleza & Cuidados",
    subcategory: "Perfumes & Fragrâncias",
    brand: "Chanel",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 8,
    province: "Luanda",
    municipality: "Ingombota",
    rating_avg: 4.9,
    reviews_count: 18,
    sales_count: 45,
    is_sponsored: true,
    is_verified_seller: true,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: true,
      score: 92,
      score_tier: "Muito bom"
    },
    condition: "novo"
  },
  {
    id: "prod-14",
    slug: "gps-rastreador-veiculos-automovel",
    title: "GPS Rastreador Inteligente para Veículos Automóveis",
    description: "Rastreador GPS de alta precisão em tempo real para viaturas e frotas. Alertas de ignição, velocidade e perímetro pelo telemóvel em Luanda.",
    price: 65000,
    category: "Automóvel",
    subcategory: "Som & Eletrónica Auto",
    brand: "TrackerPro",
    images: [
      "https://images.unsplash.com/photo-1524522173746-f628baad3644?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 25,
    province: "Luanda",
    municipality: "Cazenga",
    rating_avg: 4.5,
    reviews_count: 9,
    sales_count: 28,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    },
    condition: "novo"
  },
  {
    id: "prod-15",
    slug: "jogo-pastilhas-travao-hilux",
    title: "Jogo de Pastilhas de Travão Toyota Hilux (Original)",
    description: "Pastilhas de travão dianteiras genuínas de alta durabilidade e segurança para modelos Toyota Hilux. Fabricadas para a máxima eficiência de travagem em estradas mistas.",
    price: 48000,
    category: "Peças Auto & Moto",
    subcategory: "Componentes de Motor & Travões",
    brand: "Toyota",
    images: [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 12,
    province: "Benguela",
    municipality: "Lobito",
    rating_avg: 4.7,
    reviews_count: 14,
    sales_count: 67,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-2",
      store_name: "Benguela Electro",
      store_slug: "benguela-electro-loja",
      verified: true,
      score: 95,
      score_tier: "Muito bom"
    },
    condition: "novo"
  },
  {
    id: "prod-16",
    slug: "carrinho-bebe-reclinavel-amortecedores",
    title: "Carrinho de Bebé Reclinável com Amortecedores",
    description: "Carrinho de passeio ultra seguro e acolchoado com travão centralizado, capota extensível com proteção UV e suspensão nas quatro rodas para o máximo conforto do bebé.",
    price: 155000,
    category: "Crianças & Bebés",
    subcategory: "Puericultura & Bebés",
    brand: "BabySoft",
    images: [
      "https://images.unsplash.com/photo-1591085686350-798c0f9faf7c?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 5,
    province: "Huambo",
    municipality: "Huambo",
    rating_avg: 4.8,
    reviews_count: 16,
    sales_count: 24,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: true,
      score: 92,
      score_tier: "Muito bom"
    },
    condition: "novo"
  },
  {
    id: "prod-17",
    slug: "tapete-yoga-antiderrapante-6mm",
    title: "Tapete de Yoga Antiderrapante Ecológico 6mm",
    description: "Tapete de exercício fabricado em TPE ecológico, livre de toxinas e totalmente antiderrapante. Com espessura de 6mm para excelente amortecimento das articulações.",
    price: 18000,
    category: "Desporto & Lazer",
    subcategory: "Fitness & Musculação",
    brand: "FitPro",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 30,
    province: "Luanda",
    municipality: "Talatona",
    rating_avg: 4.7,
    reviews_count: 19,
    sales_count: 82,
    is_sponsored: false,
    is_verified_seller: true,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: true,
      score: 98,
      score_tier: "Excelente"
    },
    condition: "novo"
  },
  {
    id: "prod-18",
    slug: "cafe-ginga-grao-1kg",
    title: "Café de Angola Ginga em Grão 1Kg (Robusta Premium)",
    description: "Café genuíno de Angola, produzido nas terras férteis do Kwanza Sul. Grãos robusta de torra média selecionados à mão para um sabor forte, encorpado e aroma marcante.",
    price: 8500,
    category: "Alimentação & Bebidas",
    subcategory: "Produtos Nacionais & Gourmet",
    brand: "Ginga",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 100,
    province: "Luanda",
    municipality: "Viana",
    rating_avg: 4.9,
    reviews_count: 54,
    sales_count: 420,
    is_sponsored: true,
    is_verified_seller: true,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: true,
      score: 92,
      score_tier: "Muito bom"
    },
    condition: "novo"
  },
  {
    id: "prod-19",
    slug: "servico-fretes-mudancas-luanda",
    title: "Serviço de Fretes, Transportes e Mudanças Luanda",
    description: "Serviço profissional de fretes e mudanças residenciais ou comerciais com carrinhas fechadas e ajudantes qualificados. Atendemos todas as províncias a partir de Luanda.",
    price: 35000,
    category: "Serviços",
    subcategory: "Transportes & Logística",
    brand: "Logística Nacional",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 1,
    province: "Luanda",
    municipality: "Talatona",
    rating_avg: 4.6,
    reviews_count: 8,
    sales_count: 15,
    is_sponsored: false,
    is_verified_seller: false,
    seller: {
      id: "store-1",
      store_name: "Luanda Tech Center",
      store_slug: "luanda-tech-center",
      verified: false,
      score: 90,
      score_tier: "Muito bom"
    },
    condition: "novo"
  },
  {
    id: "prod-20",
    slug: "moedas-antigas-colecao-angola",
    title: "Lote de Moedas Antigas de Angola de Colecionismo",
    description: "Conjunto raro de moedas metálicas históricas de Angola colonial e primeiros anos da república. Peças autênticas e conservadas para colecionadores e entusiastas.",
    price: 55000,
    category: "Outros Produtos",
    subcategory: "Diversos",
    brand: "Colecionismo",
    images: [
      "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&auto=format&fit=crop&q=80"
    ],
    stock_quantity: 3,
    province: "Huambo",
    municipality: "Huambo",
    rating_avg: 4.4,
    reviews_count: 3,
    sales_count: 7,
    is_sponsored: false,
    is_verified_seller: false,
    seller: {
      id: "store-3",
      store_name: "Kwanza Style Boutique",
      store_slug: "huambo-boutique-moda",
      verified: false,
      score: 85,
      score_tier: "Bom"
    },
    condition: "usado"
  }
];

export function formatKwanza(amount: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 0
  }).format(amount).replace('AOA', 'Kz');
}
