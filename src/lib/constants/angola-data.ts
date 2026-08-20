export interface ProvinceData {
  id: string;
  name: string;
  capital: string;
  municipalities: string[];
}

export const ANGOLA_PROVINCES: ProvinceData[] = [
  {
    id: "luanda",
    name: "Luanda",
    capital: "Luanda",
    municipalities: [
      "Luanda",
      "Belo Monte",
      "Belas",
      "Cazenga",
      "Cacuaco",
      "Icolo e Bengo",
      "Kilamba Kiaxi",
      "Quiçama",
      "Talatona",
      "Viana"
    ]
  },
  {
    id: "benguela",
    name: "Benguela",
    capital: "Benguela",
    municipalities: [
      "Benguela",
      "Baía Farta",
      "Balombo",
      "Bocoio",
      "Caimbambo",
      "Catumbela",
      "Chongoroi",
      "Cubal",
      "Ganda",
      "Lobito"
    ]
  },
  {
    id: "huambo",
    name: "Huambo",
    capital: "Huambo",
    municipalities: [
      "Huambo",
      "Bailundo",
      "Catchiungo",
      "Caála",
      "Ekunha",
      "Londuimbali",
      "Longonjo",
      "Mungo",
      "Tchicala Tcholohanga",
      "Tchindjenje",
      "Ukuma"
    ]
  },
  {
    id: "huila",
    name: "Huíla",
    capital: "Lubango",
    municipalities: [
      "Lubango",
      "Caconda",
      "Cacula",
      "Caluquembe",
      "Chiange",
      "Chibia",
      "Chicomba",
      "Chipindo",
      "Cuvango",
      "Humpata",
      "Jamba",
      "Quilengues",
      "Quipungo"
    ]
  },
  {
    id: "cabinda",
    name: "Cabinda",
    capital: "Cabinda",
    municipalities: ["Cabinda", "Belize", "Buco-Zau", "Cacongo"]
  },
  {
    id: "kwanza-sul",
    name: "Kwanza Sul",
    capital: "Sumbe",
    municipalities: [
      "Sumbe",
      "Amboim",
      "Cassongue",
      "Cala",
      "Condé",
      "Ebo",
      "Libolo",
      "Mussende",
      "Porto Amboim",
      "Quibala",
      "Seles"
    ]
  },
  {
    id: "namibe",
    name: "Namibe",
    capital: "Moçâmedes",
    municipalities: ["Moçâmedes", "Bibala", "Camucuio", "Virei", "Tômbwa"]
  },
  {
    id: "malanje",
    name: "Malanje",
    capital: "Malanje",
    municipalities: [
      "Malanje",
      "Cacuso",
      "Calandula",
      "Cambundi-Catembo",
      "Cangandala",
      "Cuaba Nzogo",
      "Cunda-Dia-Baze",
      "Luquembo",
      "Marimba",
      "Massango",
      "Mucari",
      "Quela",
      "Quirima"
    ]
  },
  {
    id: "kwanza-norte",
    name: "Kwanza Norte",
    capital: "Ndalatando",
    municipalities: [
      "Cazengo",
      "Ambaca",
      "Banga",
      "Bolongongo",
      "Cambambe",
      "Cazengo",
      "Golungo Alto",
      "Gonguembo",
      "Lucala",
      "Quiculungo",
      "Samba Caju"
    ]
  },
  {
    id: "zaire",
    name: "Zaire",
    capital: "M'banza Kongo",
    municipalities: ["M'banza Kongo", "Soyo", "N'zeto", "Cuimba", "Nóqui", "Tomboco"]
  },
  {
    id: "uige",
    name: "Uíge",
    capital: "Uíge",
    municipalities: [
      "Uíge",
      "Alto Cauale",
      "Ambuíla",
      "Bembe",
      "Buengas",
      "Bungo",
      "Damba",
      "Milunga",
      "Mucaba",
      "Negage",
      "Puri",
      "Quimbele",
      "Quitexe",
      "Sanza Pombo",
      "Songo",
      "Zombo"
    ]
  },
  {
    id: "lunda-sul",
    name: "Lunda Sul",
    capital: "Saurimo",
    municipalities: ["Saurimo", "Cacolo", "Dala", "Muconda"]
  },
  {
    id: "lunda-norte",
    name: "Lunda Norte",
    capital: "Dundo",
    municipalities: [
      "Chitato",
      "Cambulo",
      "Capenda-Camulemba",
      "Caungula",
      "Cuango",
      "Cuilo",
      "Lubalo",
      "Lucapa",
      "Xá-Muteba"
    ]
  },
  {
    id: "biu",
    name: "Bié",
    capital: "Cuito",
    municipalities: [
      "Cuito",
      "Andulo",
      "Camacupa",
      "Catabola",
      "Chinguar",
      "Chitembo",
      "Cuemba",
      "Cunhinga",
      "Nharea"
    ]
  },
  {
    id: "moxico",
    name: "Moxico",
    capital: "Luena",
    municipalities: [
      "Moxico",
      "Alto Zambeze",
      "Bundas",
      "Camanongue",
      "Cameia",
      "Lau",
      "Luacano",
      "Luau",
      "Luchazes"
    ]
  },
  {
    id: "cuanhama",
    name: "Cunene",
    capital: "Ondjiva",
    municipalities: ["Cuanhama", "Cahama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"]
  },
  {
    id: "cuando-cubango",
    name: "Cuando Cubango",
    capital: "Menongue",
    municipalities: [
      "Menongue",
      "Calai",
      "Cuangar",
      "Cuchi",
      "Cuito Cuanavale",
      "Dirico",
      "Mavinga",
      "Nancova",
      "Rivungo"
    ]
  },
  {
    id: "bengo",
    name: "Bengo",
    capital: "Caxito",
    municipalities: ["Dande", "Ambriz", "Bula Atumba", "Dande", "Nambuangongo", "Pango Aluquém"]
  }
];

export const ANGOLA_PHONE_PREFIX = "+244";

export const PAYMENT_METHODS = [
  {
    id: "mcx",
    name: "Multicaixa Express (MCX)",
    description: "Pagamento instantâneo via telemóvel ou número de referência Multicaixa.",
    icon: "Smartphone"
  },
  {
    id: "bank_transfer",
    name: "Transferência Bancária (IBAN)",
    description: "Transferência direta para a conta de retenção segura BAI/BFA/BCI.",
    icon: "Building2"
  },
  {
    id: "cod",
    name: "Pagamento na Entrega",
    description: "Pague em numerário ou TPA no momento da receção da sua encomenda.",
    icon: "Banknote"
  }
];
