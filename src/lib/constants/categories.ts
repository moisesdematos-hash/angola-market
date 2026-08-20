export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  subcategories: {
    id: string;
    slug: string;
    name: string;
  }[];
}

export const MARKETPLACE_CATEGORIES: Category[] = [
  {
    id: "tecnologia",
    slug: "tecnologia",
    name: "Tecnologia",
    description: "Eletrónicos, gadgets, som e fotografia",
    icon: "Cpu",
    subcategories: [
      { id: "gadgets", slug: "gadgets", name: "Gadgets & Acessórios" },
      { id: "audio", slug: "audio", name: "Áudio & Colunas" },
      { id: "cameras", slug: "cameras", name: "Fotografia & Câmeras" },
      { id: "tv", slug: "tv-video", name: "TV & Vídeo" }
    ]
  },
  {
    id: "telemoveis",
    slug: "telemoveis",
    name: "Telemóveis",
    description: "Smartphones, capas, carregadores e acessórios",
    icon: "Smartphone",
    subcategories: [
      { id: "smartphones", slug: "smartphones", name: "Smartphones" },
      { id: "capas-acessorios", slug: "capas-acessorios", name: "Capas & Películas" },
      { id: "carregadores", slug: "carregadores", name: "Carregadores & Powerbanks" },
      { id: "relogios-inteligentes", slug: "relogios-inteligentes", name: "Smartwatches" }
    ]
  },
  {
    id: "computadores",
    slug: "computadores",
    name: "Computadores",
    description: "Portáteis, desktops, monitores e periféricos",
    icon: "Laptop",
    subcategories: [
      { id: "portateis", slug: "portateis", name: "Computadores Portáteis" },
      { id: "desktops", slug: "desktops", name: "Computadores de Secretária" },
      { id: "monitores", slug: "monitores", name: "Monitores" },
      { id: "componentes", slug: "componentes", name: "Componentes & Periféricos" }
    ]
  },
  {
    id: "casa",
    slug: "casa",
    name: "Casa",
    description: "Mobiliário, decoração, iluminação e utensílios",
    icon: "Home",
    subcategories: [
      { id: "moveis", slug: "moveis", name: "Mobiliário" },
      { id: "decoracao", slug: "decoracao", name: "Decoração & Iluminação" },
      { id: "cozinha", slug: "utensilios-cozinha", name: "Utensílios de Cozinha" },
      { id: "cama-banho", slug: "cama-banho", name: "Cama, Mesa & Banho" }
    ]
  },
  {
    id: "eletrodomesticos",
    slug: "eletrodomesticos",
    name: "Eletrodomésticos",
    description: "Frigoríficos, máquinas de lavar, ar condicionado e pequenos domésticos",
    icon: "Tv",
    subcategories: [
      { id: "grandes-eletro", slug: "grandes-eletrodomesticos", name: "Grandes Eletrodomésticos" },
      { id: "climatizacao", slug: "climatizacao", name: "Ar Condicionado & Ventilação" },
      { id: "pequenos-eletro", slug: "pequenos-eletrodomesticos", name: "Pequenos Domésticos" }
    ]
  },
  {
    id: "moda",
    slug: "moda",
    name: "Moda",
    description: "Roupas masculinas, femininas, acessórios e bijuteria",
    icon: "Shirt",
    subcategories: [
      { id: "moda-homem", slug: "moda-homem", name: "Roupa Homem" },
      { id: "moda-mulher", slug: "moda-mulher", name: "Roupa Mulher" },
      { id: "acessorios-moda", slug: "acessorios-moda", name: "Bolsas & Acessórios" }
    ]
  },
  {
    id: "calcado",
    slug: "calcado",
    name: "Calçado",
    description: "Sapatilhas, sapatos formais, sandálias e botas",
    icon: "Footprints",
    subcategories: [
      { id: "sapatilhas", slug: "sapatilhas", name: "Sapatilhas & Desporto" },
      { id: "sapatos-formais", slug: "sapatos-formais", name: "Sapatos Formais" },
      { id: "sandalias", slug: "sandalias", name: "Sandálias & Chinelos" }
    ]
  },
  {
    id: "beleza",
    slug: "beleza",
    name: "Beleza & Cuidados",
    description: "Perfumes, maquilhagem, cosmética e cuidados capilares",
    icon: "Sparkles",
    subcategories: [
      { id: "perfumes", slug: "perfumes", name: "Perfumes & Fragrâncias" },
      { id: "maquilhagem", slug: "maquilhagem", name: "Maquilhagem" },
      { id: "cabelos", slug: "cuidados-capilares", name: "Cuidados Capilares" }
    ]
  },
  {
    id: "automovel",
    slug: "automovel",
    name: "Automóvel",
    description: "Acessórios automóvel, GPS e equipamentos",
    icon: "Car",
    subcategories: [
      { id: "acessorios-auto", slug: "acessorios-auto", name: "Acessórios Interior/Exterior" },
      { id: "som-auto", slug: "som-auto", name: "Som & Eletrónica Auto" }
    ]
  },
  {
    id: "pecas",
    slug: "pecas",
    name: "Peças Auto & Moto",
    description: "Peças sobressalentes, travões, óleos e filtros",
    icon: "Wrench",
    subcategories: [
      { id: "motor-travoes", slug: "motor-travoes", name: "Componentes de Motor & Travões" },
      { id: "pneus-jantes", slug: "pneus-jantes", name: "Pneus & Jantes" },
      { id: "lubrificantes", slug: "lubrificantes-fluidos", name: "Óleos & Lubrificantes" }
    ]
  },
  {
    id: "criancas",
    slug: "criancas",
    name: "Crianças & Bebés",
    description: "Brinquedos, roupa infantil, carrinhos e fraldas",
    icon: "Baby",
    subcategories: [
      { id: "brinquedos", slug: "brinquedos", name: "Brinquedos & Jogos" },
      { id: "roupa-infantil", slug: "roupa-infantil", name: "Roupa Infantil" },
      { id: "artigos-bebe", slug: "artigos-bebe", name: "Puericultura & Bebés" }
    ]
  },
  {
    id: "desporto",
    slug: "desporto",
    name: "Desporto & Lazer",
    description: "Equipamento fitness, suplementos e artigos de campismo",
    icon: "Dumbbell",
    subcategories: [
      { id: "fitness", slug: "fitness-musculacao", name: "Fitness & Musculação" },
      { id: "suplementos", slug: "suplementos-alimentares", name: "Suplementos Nutricionais" },
      { id: "desportos-coletivos", slug: "desportos-coletivos", name: "Futebol & Desportos" }
    ]
  },
  {
    id: "ferramentas",
    slug: "ferramentas",
    name: "Ferramentas & Bricolage",
    description: "Ferramentas elétricas, manuais, pintura e geradores",
    icon: "Hammer",
    subcategories: [
      { id: "ferramentas-eletricas", slug: "ferramentas-eletricas", name: "Ferramentas Elétricas" },
      { id: "geradores", slug: "geradores-energia", name: "Geradores & Energia" },
      { id: "ferramentas-manuais", slug: "ferramentas-manuais", name: "Ferramentas Manuais" }
    ]
  },
  {
    id: "alimentacao",
    slug: "alimentacao",
    name: "Alimentação & Bebidas",
    description: "Produtos alimentares, bebidas locais e gourmet",
    icon: "Utensils",
    subcategories: [
      { id: "bebidas", slug: "bebidas", name: "Bebidas & Vinhos" },
      { id: "gourmet", slug: "produtos-gourmet", name: "Produtos Nacionais & Gourmet" }
    ]
  },
  {
    id: "servicos",
    slug: "servicos",
    name: "Serviços",
    description: "Assistência técnica, canalização, montagem e fretes",
    icon: "Briefcase",
    subcategories: [
      { id: "assistencia-tecnica", slug: "assistencia-tecnica", name: "Reparações & Eletrónica" },
      { id: "transportes-fretes", slug: "transportes-fretes", name: "Transportes & Logística" }
    ]
  },
  {
    id: "outros",
    slug: "outros",
    name: "Outros Produtos",
    description: "Diversos artigos, colecionáveis e utilidades",
    icon: "Grid",
    subcategories: [
      { id: "diversos", slug: "diversos", name: "Variedades & Diversos" }
    ]
  }
];
