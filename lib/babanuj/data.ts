// Babanuj static data — ported from the design's lib.jsx.
// This is the source of truth used by both the (mock) Shopify data layer
// and the Market UI components.

export type BabanujBrand = {
  id: string;
  name: string;
  sub: string;
  origin: string;
  est: number;
  tag: string;
  blurb: string;
  long: string;
  note: string;
  accent: string;
  color2: string;
  img: string;
  products: string[];
};

export type BabanujProduct = {
  id: string;
  handle: string;
  name: string;
  brand: string;
  price: number;
  weight: string;
  tag: string;
  hue: string;
  dark?: string;
  img: string;
};

export type BabanujCategory = {
  id: string;
  name: string;
  hue: string;
  blurb: string;
  filter: (p: BabanujProduct) => boolean;
};

export type BabanujCatalogRow = {
  brand: string;
  line: string;
  formats: string;
  channels: string[];
};

export const BRANDS: BabanujBrand[] = [
  {
    id: "zaitoune",
    name: "Zaitoune",
    sub: "Sweets",
    origin: "Türkiye",
    est: 1991,
    tag: "Turkish & Middle Eastern Sweets",
    blurb:
      "Heritage recipes crafted with premium ingredients for an authentic taste experience.",
    long: "Three generations of Anatolian sweetmakers, working from stone-floored ateliers in Gaziantep. Every tray of baklava is rolled, layered and baked the same day it leaves the kitchen.",
    note: "Premium Quality",
    accent: "#3a5c3a",
    color2: "#caa55a",
    img: "https://babanuj.com/cdn/shop/files/Untitled_design_-_2024-12-19T141151.774.png?v=1734606721&width=1600",
    products: ["Turkish Delight", "Baklava", "Pistachio Bites"],
  },
  {
    id: "babsharqi",
    name: "Bab Sharqi",
    sub: "Sweets",
    origin: "Syria",
    est: 1993,
    tag: "Authentic Syrian Desserts",
    blurb:
      "Traditional Syrian desserts made with generations of passion and craftsmanship.",
    long: "Founded behind the eastern gate of old Damascus. Bab Sharqi is built on family recipes, semolina worked by hand, and the patience of long simmering syrups.",
    note: "Traditional Recipes",
    accent: "#2a3760",
    color2: "#caa55a",
    img: "https://babanuj.com/cdn/shop/files/Untitled_design_-_2024-12-19T140953.250.png?v=1734606623&width=1600",
    products: ["Petit Four", "Maamoul", "Barazek", "Mixed Cookies"],
  },
  {
    id: "crush",
    name: "Crush",
    sub: "Chocolate",
    origin: "UAE",
    est: 2023,
    tag: "Famous Dubai Chocolate",
    blurb:
      "The viral Dubai chocolate experience — rich, indulgent, unforgettable.",
    long: "Born in Dubai. A new icon: kataifi pastry, pistachio cream, layered into single-origin chocolate. Each bar finished by hand and stamped with the Crush seal.",
    note: "Modern Indulgence",
    accent: "#3a1f14",
    color2: "#e6a85a",
    img: "https://babanuj.com/cdn/shop/files/Untitled_design_-_2024-12-19T141008.277.png?v=1734606627&width=1600",
    products: ["Dubai Chocolate Bar", "Pistachio Praline", "Kataifi Crunch"],
  },
];

export const PRODUCTS: BabanujProduct[] = [
  {
    id: "p1",
    handle: "pistachio-baklava",
    name: "Pistachio Baklava",
    brand: "Zaitoune",
    price: 24.99,
    weight: "450g · 12 pieces",
    tag: "Bestseller",
    hue: "#bfa86a",
    dark: "#5a4419",
    img: "https://babanuj.com/cdn/shop/files/N44qvd7J2Vf4KH4dNuRkHYzBEXHg9H3RqUSHFsiLr3Y.jpg?v=1735902548&width=900",
  },
  {
    id: "p2",
    handle: "turkish-delight-assortment",
    name: "Turkish Delight Assortment",
    brand: "Zaitoune",
    price: 14.99,
    weight: "300g · 24 pieces",
    tag: "Gift-ready",
    hue: "#e8b0a8",
    dark: "#7a3a32",
    img: "https://babanuj.com/cdn/shop/files/Ju91QtTdb6vUdoSoGkL6_XyFgHhYLkUUqxpaxaRxP34.jpg?v=1735902907&width=900",
  },
  {
    id: "p3",
    handle: "maamoul-date-cookies",
    name: "Maamoul Date Cookies",
    brand: "Bab Sharqi",
    price: 16.99,
    weight: "480g · 24 pieces",
    tag: "Traditional",
    hue: "#d6a06e",
    dark: "#5e3a1e",
    img: "https://babanuj.com/cdn/shop/files/Y13PYNTWFfRVUo1ErzfFpz1q3qW_BaFxbLkYgbKd7gw.jpg?v=1770130398&width=900",
  },
  {
    id: "p4",
    handle: "crush-dubai-chocolate",
    name: "Crush Dubai Chocolate",
    brand: "Crush",
    price: 18.99,
    weight: "100g · single bar",
    tag: "Viral",
    hue: "#7a4a2e",
    dark: "#2a1108",
    img: "https://babanuj.com/cdn/shop/files/Untitled_design_-_2024-12-19T141008.277.png?v=1734606627&width=900",
  },
];

export const EXTRA_PRODUCTS: BabanujProduct[] = [
  {
    id: "e1",
    handle: "petit-four-mix",
    name: "Petit Four Mix",
    brand: "Zaitoune",
    price: 18.1,
    weight: "350g · assorted",
    tag: "Gift",
    hue: "#caa55a",
    img: "https://babanuj.com/cdn/shop/files/468flJLbTP9P8MaUg1KKymoSQVxEZs2GFuMa9jDSwc8.png?v=1735902803&width=900",
  },
  {
    id: "e2",
    handle: "mini-baklava",
    name: "Mini Baklava",
    brand: "Zaitoune",
    price: 8.9,
    weight: "100g · 4 pieces",
    tag: "New",
    hue: "#bfa86a",
    img: "https://babanuj.com/cdn/shop/files/lqPRzbozRobisL3m3-W3Q_01aLLgqlyuCdmKqnum2T8.jpg?v=1735902490&width=900",
  },
  {
    id: "e3",
    handle: "turkish-delight-premium",
    name: "Turkish Delight Premium",
    brand: "Zaitoune",
    price: 34.4,
    weight: "650g · gift box",
    tag: "Holiday",
    hue: "#e8b0a8",
    img: "https://babanuj.com/cdn/shop/files/Delight_Mix_Turkish_Delight_Middle_East_Sweets_Ramadan_Eid_1.png?v=1770635003&width=900",
  },
  {
    id: "e4",
    handle: "barazek-sesame-cookies",
    name: "Barazek Sesame Cookies",
    brand: "Zaitoune",
    price: 10.8,
    weight: "500g",
    tag: "Crunchy",
    hue: "#d6a06e",
    img: "https://babanuj.com/cdn/shop/files/m3PuiO4qPWImISmy5MEzHhVRKf4g7vusaP0jgU7-IQA.jpg?v=1735902825&width=900",
  },
  {
    id: "e5",
    handle: "maamoul-large-tray",
    name: "Maamoul 500g Tray",
    brand: "Bab Sharqi",
    price: 21.6,
    weight: "500g · large tray",
    tag: "Family",
    hue: "#d6a06e",
    img: "https://babanuj.com/cdn/shop/files/0Z9b3b5xRQF5uMtIBKpF7KAPPGBG_PecIknkCJKrarM.jpg?v=1735902667&width=900",
  },
  {
    id: "e6",
    handle: "mixed-cookies-250",
    name: "Mixed Cookies 250g",
    brand: "Zaitoune",
    price: 10.8,
    weight: "250g · assorted",
    tag: "Tea-time",
    hue: "#caa55a",
    img: "https://babanuj.com/cdn/shop/files/pK79w940R8wMA2qNcRLksmBLv1AYgiFTF4OYfWHQ1rY.jpg?v=1735902730&width=900",
  },
];

export const ALL_PRODUCTS: BabanujProduct[] = [...PRODUCTS, ...EXTRA_PRODUCTS];

export const HERO_IMG =
  "https://babanuj.com/cdn/shop/files/High_Res-76_1.jpg?v=1734937605&width=2400";

export const CATEGORIES: BabanujCategory[] = [
  {
    id: "all",
    name: "All Sweets",
    hue: "#caa55a",
    blurb: "Every brand, every line — the full Babanuj pantry, curated.",
    filter: () => true,
  },
  {
    id: "baklava",
    name: "Baklava",
    hue: "#bfa86a",
    blurb:
      "Hand-layered phyllo, pistachio, syrup. From Antep to Damascus, the oldest art in our pantry.",
    filter: (p) => /baklava/i.test(p.name),
  },
  {
    id: "chocolate",
    name: "Chocolate",
    hue: "#7a4a2e",
    blurb:
      "Single-origin chocolate, kataifi pastry, pistachio cream. The viral Dubai bar and its cousins.",
    filter: (p) => /chocolate|crush/i.test(p.name),
  },
  {
    id: "cookies",
    name: "Cookies",
    hue: "#d6a06e",
    blurb: "Maamoul, Barazek, Petit Four. Tea-time classics worked by hand.",
    filter: (p) => /maamoul|cookie|barazek|petit/i.test(p.name),
  },
  {
    id: "turkish-delight",
    name: "Turkish Delight",
    hue: "#e8b0a8",
    blurb:
      "Pillowy lokum dusted in powdered sugar. Rose, pistachio, mastic.",
    filter: (p) => /turkish delight|lokum/i.test(p.name),
  },
  {
    id: "gift-boxes",
    name: "Gift Boxes",
    hue: "#3a5c3a",
    blurb: "Pre-made and build-your-own. Wrapped, ribboned, sent.",
    filter: (p) => /assortment|box|premium/i.test(p.name),
  },
  {
    id: "pantry",
    name: "Pantry",
    hue: "#b4441f",
    blurb: "Everything else — the staples we ship by the case.",
    filter: () => true,
  },
];

export const CATALOG: BabanujCatalogRow[] = [
  {
    brand: "Zaitoune",
    line: "Turkish Delight",
    formats: "12 × 200g · 12 × 400g · 6 × 1kg",
    channels: ["Grocery", "Specialty", "Gift", "Online"],
  },
  {
    brand: "Zaitoune",
    line: "Baklava",
    formats: "16 pcs · 32 pcs · 1kg Tray",
    channels: ["Grocery", "Specialty", "Foodservice"],
  },
  {
    brand: "Bab Sharqi",
    line: "Petit Four",
    formats: "12 pcs Box · 18 pcs Box",
    channels: ["Grocery", "Specialty", "Gift"],
  },
  {
    brand: "Bab Sharqi",
    line: "Maamoul",
    formats: "12 pcs · 24 pcs · 480g",
    channels: ["Grocery", "Specialty", "Gift"],
  },
  {
    brand: "Bab Sharqi",
    line: "Barazek",
    formats: "12 pcs · 24 pcs · 500g",
    channels: ["Grocery", "Specialty", "Gift"],
  },
  {
    brand: "Bab Sharqi",
    line: "Mixed Cookies",
    formats: "500g · 1kg · 2kg",
    channels: ["Grocery", "Wholesale", "Foodservice"],
  },
  {
    brand: "Crush",
    line: "Dubai Chocolate",
    formats: "6 × 100g · 12 × 100g",
    channels: ["Grocery", "Specialty", "Online"],
  },
];

export type BabanujBrandDetail = {
  founder: string;
  region: string;
  yearLabel: string;
  signature: string;
  quote: string;
  quoteBy: string;
  longStory: string[];
  facts: { k: string; v: string }[];
  timeline: { year: string; t: string }[];
};

export const BRAND_DETAILS: Record<string, BabanujBrandDetail> = {
  zaitoune: {
    founder: "Mehmet & Ayşe Demir",
    region: "Gaziantep, Türkiye",
    yearLabel: "Three generations",
    signature: "Pistachio Baklava",
    quote: `"Our grandfather's recipe is on the wall. We've never written it down — we hand it from one pair of fingers to the next."`,
    quoteBy: "Ayşe Demir, head baker",
    longStory: [
      "Zaitoune began in 1991 in a stone-floored kitchen in Gaziantep, six blocks from the pistachio market. The Demir family had been baking sweets out of that same room since 1953 — Zaitoune is just the name they finally gave it.",
      "Everything is rolled by hand on a marble slab. The phyllo is so thin you can read a newspaper through it. The pistachios are bought from the same farm cooperative their grandfather worked with, in Şanlıurfa.",
      `Every tray of baklava is rolled, layered and baked the same morning it leaves the kitchen. By the time it reaches our Houston warehouse, it's typically less than 96 hours from the oven.`,
    ],
    facts: [
      { k: "Founded", v: "1991" },
      { k: "Region", v: "Gaziantep, Türkiye" },
      { k: "Maker", v: "Demir family · 3rd gen" },
      { k: "Signature", v: "Pistachio Baklava" },
      { k: "Lines", v: "14 products" },
      { k: "Annual output", v: "~28,000 kg" },
    ],
    timeline: [
      {
        year: "1953",
        t: "Grandfather Hasan starts selling baklava from a market stall in Gaziantep.",
      },
      {
        year: "1991",
        t: "The shop takes the name Zaitoune. First catalog printed.",
      },
      {
        year: "2009",
        t: "Ayşe & Mehmet take over from their father, modernize the kitchen.",
      },
      { year: "2022", t: "Babanuj signs as exclusive U.S. distributor." },
      {
        year: "2026",
        t: "In-stock across 600+ U.S. retailers; 4.9★ on 2,400 reviews.",
      },
    ],
  },
  babsharqi: {
    founder: "The Haddad family",
    region: "Damascus, Syria",
    yearLabel: "Family-run · 3 generations",
    signature: "Maamoul Date Cookies",
    quote: `"In Damascus we say: 'food is memory you can hold.' Bab Sharqi is the gate where we let those memories out into the world."`,
    quoteBy: "Karim Haddad, founder",
    longStory: [
      `Bab Sharqi takes its name from the eastern gate of old Damascus, founded behind that gate in 1993 by Karim Haddad and his two daughters. The bakery is built around recipes Karim's mother brought from Aleppo in 1948.`,
      `The semolina is worked by hand, not mixed. The date paste is made every morning. The maamoul molds — wooden stamps carved with geometric patterns — are over fifty years old.`,
      `After the war years, Bab Sharqi rebuilt a small kitchen and a quieter business — making fewer trays, but each one closer to the original than ever.`,
    ],
    facts: [
      { k: "Founded", v: "1993" },
      { k: "Region", v: "Damascus, Syria" },
      { k: "Maker", v: "Haddad family" },
      { k: "Signature", v: "Maamoul" },
      { k: "Lines", v: "11 products" },
      { k: "Method", v: "All hand-rolled" },
    ],
    timeline: [
      {
        year: "1948",
        t: `Recipes carried from Aleppo to Damascus by Karim's mother.`,
      },
      {
        year: "1993",
        t: "Bab Sharqi opens behind the eastern gate of old Damascus.",
      },
      {
        year: "2011",
        t: "Production paused; family preserves the recipe books.",
      },
      {
        year: "2019",
        t: "Kitchen rebuilt in a quieter neighborhood; daughters lead production.",
      },
      { year: "2024", t: "First Bab Sharqi shipment lands in Houston." },
    ],
  },
  crush: {
    founder: "Omar Al-Hashimi",
    region: "Dubai, UAE",
    yearLabel: "Modern · 3 years young",
    signature: "Dubai Chocolate Bar",
    quote: `"I'd lived in Dubai my whole life and never seen people queue for chocolate. Then we put it on TikTok and the line went around the block."`,
    quoteBy: "Omar Al-Hashimi, founder",
    longStory: [
      "Crush is the youngest house in our pantry. Founded in 2023 by Omar Al-Hashimi, the brand built itself around a single idea — kataifi pastry and pistachio cream, layered into single-origin chocolate, finished by hand.",
      "The bar went viral on TikTok in 2024 and has been chasing demand ever since. Crush keeps the recipe tight, the run limited, and the price honest. Every bar is stamped with the Crush seal before it leaves the kitchen.",
      "In two years, Crush has shipped chocolate to 38 countries. Babanuj is its exclusive U.S. partner.",
    ],
    facts: [
      { k: "Founded", v: "2023" },
      { k: "Region", v: "Dubai, UAE" },
      { k: "Maker", v: "Omar Al-Hashimi" },
      { k: "Signature", v: "Dubai Chocolate Bar" },
      { k: "Lines", v: "7 products" },
      { k: "Output", v: "Limited · 1,200 bars/wk" },
    ],
    timeline: [
      {
        year: "2021",
        t: "Omar tests the recipe out of a rented commercial kitchen.",
      },
      {
        year: "2023",
        t: "Crush launches with one product: the Dubai Chocolate Bar.",
      },
      {
        year: "2024",
        t: "TikTok virality. Production triples in 4 months.",
      },
      {
        year: "2025",
        t: "New flavors added; international shipping begins.",
      },
      {
        year: "2026",
        t: "Crush lands in 600+ U.S. retailers via Babanuj.",
      },
    ],
  },
};

export const fmtPrice = (n: number) => "$" + n.toFixed(2);

export function findProductByHandle(handle: string): BabanujProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.handle === handle);
}

export function findProductById(id: string): BabanujProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function findBrand(id: string): BabanujBrand | undefined {
  return BRANDS.find((b) => b.id === id);
}

export function findCategory(id: string): BabanujCategory {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0]!;
}

export function categoryFor(p: BabanujProduct): BabanujCategory {
  return (
    CATEGORIES.find(
      (c) => c.id !== "all" && c.id !== "pantry" && c.filter(p),
    ) ?? CATEGORIES[0]!
  );
}
