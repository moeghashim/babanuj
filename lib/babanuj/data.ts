// Babanuj static data — ported from the design's lib.jsx.
// This is the source of truth used by both the (mock) Shopify data layer
// and the Market UI components.

export type BabanujBrand = {
  id: string;
  name: string;
  sub: string;
  /** Best-known region. Empty when not publicly verifiable. */
  origin: string;
  /** Founding year, or 0 when not publicly verifiable. */
  est: number;
  tag: string;
  blurb: string;
  long: string;
  note: string;
  accent: string;
  color2: string;
  img: string;
  products: string[];
  /** Curated "house" shown in the image-heavy homepage grid + cross-sell.
   *  Secondary houses (mapped from real Shopify vendors but without full
   *  editorial content) are not featured, so they don't crowd those grids. */
  featured?: boolean;
};

export type BabanujProduct = {
  id: string;
  /** Real Shopify ProductVariant GID for the default variant. Set by the
   *  adapter from live data; falls back to a synthetic ID for seed data. */
  variantId: string;
  availableForSale?: boolean;
  options?: BabanujProductOption[];
  variants?: BabanujProductVariant[];
  images?: string[];
  handle: string;
  name: string;
  brand: string;
  /** Curated brand slug resolved from the Shopify vendor, or null when the
   *  vendor isn't one of the curated houses. Lets consumers resolve the brand
   *  by id instead of fuzzy-matching the display name. */
  brandId?: string | null;
  /** Plain-text product description from Shopify (snippets/fallbacks). */
  description?: string;
  /** Rich product description HTML from Shopify, rendered on the PDP. */
  descriptionHtml?: string;
  price: number;
  weight: string;
  tag: string;
  hue: string;
  dark?: string;
  img: string;
};

export type BabanujProductOption = {
  id?: string;
  name: string;
  values: string[];
};

export type BabanujProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  image?: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: number;
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

// Brand metadata. The `vendor` field is the exact Shopify vendor string;
// the `id` is the URL slug used in /brand/[id] routes.
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
    img: "https://babanuj.myshopify.com/cdn/shop/files/Untitled_design_-_2024-12-19T141151.774.png?v=1734606721&width=1600",
    products: ["Turkish Delight", "Baklava", "Pistachio Bites"],
    featured: true,
  },
  {
    id: "babanuj",
    name: "Babanuj",
    sub: "House",
    origin: "Houston, TX",
    est: 2023,
    tag: "House Specialties",
    blurb:
      "Our own house line — gift boxes, holiday assortments, and signature blends curated by the Babanuj team.",
    long: "Our in-house brand. Limited drops, holiday boxes, and the things we make ourselves — supplementing the heritage houses with seasonal moments and one-off collaborations.",
    note: "House Line",
    accent: "#1f2a1c",
    color2: "#caa55a",
    img: "https://babanuj.myshopify.com/cdn/shop/files/High_Res-76_1.jpg?v=1734937605&width=1600",
    products: ["Gift Boxes", "Seasonal Drops", "Holiday Collections"],
    featured: true,
  },
  {
    id: "leen",
    name: "Leen",
    sub: "Dates",
    origin: "Gulf",
    est: 2020,
    tag: "Premium Gulf Dates & Confections",
    blurb: "Stuffed dates, chocolate-dipped dates, and Gulf-style confections.",
    long: "Leen is built around the date — Medjool, Khudri, and Sukkari from family groves in the Gulf, hand-stuffed with pistachio, almond, and chocolate. Every order is packed within forty-eight hours of leaving the kitchen.",
    note: "Hand-stuffed",
    accent: "#5e3a1e",
    color2: "#d6a06e",
    img: "https://babanuj.myshopify.com/cdn/shop/files/Untitled_design_-_2024-12-19T140953.250.png?v=1734606623&width=1600",
    products: ["Stuffed Dates", "Chocolate Dates", "Premium Date Gift Boxes"],
    featured: true,
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
    img: "https://babanuj.myshopify.com/cdn/shop/files/Untitled_design_-_2024-12-19T141008.277.png?v=1734606627&width=1600",
    products: ["Dubai Chocolate Bar", "Pistachio Praline", "Kataifi Crunch"],
    featured: true,
  },
  {
    id: "bal-coffee",
    name: "Bal Coffee",
    sub: "Coffee",
    origin: "",
    est: 0,
    tag: "Roasted Date-Seed Coffee",
    blurb:
      "Caffeine-free, acid-free coffee alternatives brewed from roasted date seeds.",
    long: "Bal Coffee makes a caffeine-free, acid-free coffee alternative from roasted date seeds — upcycling a part of the fruit that's usually thrown away. It brews, looks, and tastes like coffee, without the caffeine or the acidity.",
    note: "Caffeine-free",
    accent: "#3a2618",
    color2: "#caa55a",
    img: "https://cdn.shopify.com/s/files/1/0673/0216/2690/files/BALCoffee_sEasternBrew.jpg?v=1757874557",
    products: ["Eastern Brew", "DateSpresso", "GrounDate"],
  },
  {
    id: "milaf",
    name: "Milaf",
    sub: "Cola",
    origin: "Saudi Arabia",
    est: 2024,
    tag: "Date-Based Cola",
    blurb:
      "The world's first cola made from real dates — no added sugar, no sweeteners.",
    long: "Milaf Cola is the world's first cola made entirely from date extract, created by the Al Madinah Heritage Company in Saudi Arabia. Brewed from Ajwa and Sukkari dates with no added sugar or sweeteners.",
    note: "No added sugar",
    accent: "#2a1712",
    color2: "#caa55a",
    img: "https://cdn.shopify.com/s/files/1/0673/0216/2690/files/41gllxLXI7L._SX679.jpg?v=1757873500",
    products: ["Date Cola"],
  },
  {
    id: "val",
    name: "VAL",
    sub: "Dates",
    origin: "Saudi Arabia",
    est: 0,
    tag: "Stuffed Date Snacks",
    blurb:
      "Premium soft dates stuffed with tahini and rolled in sesame — 100% natural.",
    long: "VAL makes bite-sized snacks from premium Saudi dates — soft dates filled with a velvety tahini center and rolled in roasted sesame or coconut. Made from 100% natural ingredients with no added sugar.",
    note: "100% natural",
    accent: "#5e3a1e",
    color2: "#d6a06e",
    img: "https://cdn.shopify.com/s/files/1/0673/0216/2690/files/VAl_Date_Balls_Stuffed_With_Tahini_500g_Main.jpg?v=1771438021",
    products: ["Date Balls with Tahini"],
  },
  {
    id: "reeq-alnahel",
    name: "Reeq Alnahel",
    sub: "Honey",
    origin: "Saudi Arabia",
    est: 0,
    tag: "Wild Saudi Honey",
    blurb:
      "Natural wild honey and bee-product blends from apiaries across Saudi Arabia.",
    long: "Reeq Alnahel is a Saudi honey house producing natural wild honey from its own apiaries inside and beyond the Kingdom. Its blends combine pure honey with bee products and natural botanicals.",
    note: "Wild-harvested",
    accent: "#6e4f1a",
    color2: "#e6c05a",
    img: "https://cdn.shopify.com/s/files/1/0673/0216/2690/files/a083ea8d-0474-4999-93bd-2e1e9fad37e5_18b66674-228b-4936-9546-e17ea91db7a7.jpg?v=1757873470",
    products: ["Kings Food Honey"],
  },
];

// Map Shopify vendor strings → our brand IDs. Shopify vendor names sometimes
// have a "Sweets" suffix or other variants; this normalizes to brand slugs.
export const VENDOR_TO_BRAND_ID: Record<string, string> = {
  "Zaitoune Sweets": "zaitoune",
  Zaitoune: "zaitoune",
  Babanuj: "babanuj",
  Leen: "leen",
  Crush: "crush",
  "Bal Coffee": "bal-coffee",
  Milaf: "milaf",
  VAL: "val",
  "Reeq Alnahel": "reeq-alnahel",
};

export function brandIdFromVendor(vendor: string | undefined): string | null {
  if (!vendor) return null;
  return VENDOR_TO_BRAND_ID[vendor] ?? null;
}

// Reverse lookup: brand ID → canonical vendor name in Shopify (for filtering).
export function vendorFromBrandId(id: string): string | undefined {
  if (id === "zaitoune") return "Zaitoune Sweets";
  if (id === "babanuj") return "Babanuj";
  if (id === "leen") return "Leen";
  if (id === "crush") return "Crush";
  if (id === "bal-coffee") return "Bal Coffee";
  if (id === "milaf") return "Milaf";
  if (id === "val") return "VAL";
  if (id === "reeq-alnahel") return "Reeq Alnahel";
  return undefined;
}

export const PRODUCTS: BabanujProduct[] = [
  {
    id: "p1",
    variantId: "p1",
    handle: "pistachio-baklava",
    name: "Pistachio Baklava",
    brand: "Zaitoune",
    price: 24.99,
    weight: "450g · 12 pieces",
    tag: "Bestseller",
    hue: "#bfa86a",
    dark: "#5a4419",
    img: "https://babanuj.myshopify.com/cdn/shop/files/N44qvd7J2Vf4KH4dNuRkHYzBEXHg9H3RqUSHFsiLr3Y.jpg?v=1735902548&width=900",
  },
  {
    id: "p2",
    variantId: "p2",
    handle: "turkish-delight-assortment",
    name: "Turkish Delight Assortment",
    brand: "Zaitoune",
    price: 14.99,
    weight: "300g · 24 pieces",
    tag: "Gift-ready",
    hue: "#e8b0a8",
    dark: "#7a3a32",
    img: "https://babanuj.myshopify.com/cdn/shop/files/Ju91QtTdb6vUdoSoGkL6_XyFgHhYLkUUqxpaxaRxP34.jpg?v=1735902907&width=900",
  },
  {
    id: "p3",
    variantId: "p3",
    handle: "maamoul-date-cookies",
    name: "Maamoul Date Cookies",
    brand: "Bab Sharqi",
    price: 16.99,
    weight: "480g · 24 pieces",
    tag: "Traditional",
    hue: "#d6a06e",
    dark: "#5e3a1e",
    img: "https://babanuj.myshopify.com/cdn/shop/files/Y13PYNTWFfRVUo1ErzfFpz1q3qW_BaFxbLkYgbKd7gw.jpg?v=1770130398&width=900",
  },
  {
    id: "p4",
    variantId: "p4",
    handle: "crush-dubai-chocolate",
    name: "Crush Dubai Chocolate",
    brand: "Crush",
    price: 18.99,
    weight: "100g · single bar",
    tag: "Viral",
    hue: "#7a4a2e",
    dark: "#2a1108",
    img: "https://babanuj.myshopify.com/cdn/shop/files/Untitled_design_-_2024-12-19T141008.277.png?v=1734606627&width=900",
  },
];

export const EXTRA_PRODUCTS: BabanujProduct[] = [
  {
    id: "e1",
    variantId: "e1",
    handle: "petit-four-mix",
    name: "Petit Four Mix",
    brand: "Zaitoune",
    price: 18.1,
    weight: "350g · assorted",
    tag: "Gift",
    hue: "#caa55a",
    img: "https://babanuj.myshopify.com/cdn/shop/files/468flJLbTP9P8MaUg1KKymoSQVxEZs2GFuMa9jDSwc8.png?v=1735902803&width=900",
  },
  {
    id: "e2",
    variantId: "e2",
    handle: "mini-baklava",
    name: "Mini Baklava",
    brand: "Zaitoune",
    price: 8.9,
    weight: "100g · 4 pieces",
    tag: "New",
    hue: "#bfa86a",
    img: "https://babanuj.myshopify.com/cdn/shop/files/lqPRzbozRobisL3m3-W3Q_01aLLgqlyuCdmKqnum2T8.jpg?v=1735902490&width=900",
  },
  {
    id: "e3",
    variantId: "e3",
    handle: "turkish-delight-premium",
    name: "Turkish Delight Premium",
    brand: "Zaitoune",
    price: 34.4,
    weight: "650g · gift box",
    tag: "Holiday",
    hue: "#e8b0a8",
    img: "https://babanuj.myshopify.com/cdn/shop/files/Delight_Mix_Turkish_Delight_Middle_East_Sweets_Ramadan_Eid_1.png?v=1770635003&width=900",
  },
  {
    id: "e4",
    variantId: "e4",
    handle: "barazek-sesame-cookies",
    name: "Barazek Sesame Cookies",
    brand: "Zaitoune",
    price: 10.8,
    weight: "500g",
    tag: "Crunchy",
    hue: "#d6a06e",
    img: "https://babanuj.myshopify.com/cdn/shop/files/m3PuiO4qPWImISmy5MEzHhVRKf4g7vusaP0jgU7-IQA.jpg?v=1735902825&width=900",
  },
  {
    id: "e5",
    variantId: "e5",
    handle: "maamoul-large-tray",
    name: "Maamoul 500g Tray",
    brand: "Bab Sharqi",
    price: 21.6,
    weight: "500g · large tray",
    tag: "Family",
    hue: "#d6a06e",
    img: "https://babanuj.myshopify.com/cdn/shop/files/0Z9b3b5xRQF5uMtIBKpF7KAPPGBG_PecIknkCJKrarM.jpg?v=1735902667&width=900",
  },
  {
    id: "e6",
    variantId: "e6",
    handle: "mixed-cookies-250",
    name: "Mixed Cookies 250g",
    brand: "Zaitoune",
    price: 10.8,
    weight: "250g · assorted",
    tag: "Tea-time",
    hue: "#caa55a",
    img: "https://babanuj.myshopify.com/cdn/shop/files/pK79w940R8wMA2qNcRLksmBLv1AYgiFTF4OYfWHQ1rY.jpg?v=1735902730&width=900",
  },
];

export const ALL_PRODUCTS: BabanujProduct[] = [...PRODUCTS, ...EXTRA_PRODUCTS];

export const HERO_IMG =
  "https://babanuj.myshopify.com/cdn/shop/files/High_Res-76_1.jpg?v=1734937605&width=1600";

// Categories map 1:1 to Shopify auto-collections created by the user.
// IDs match Shopify collection handles. Hue is the fallback background
// color when a product image is loading or missing.
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
    id: "cookies",
    name: "Cookies & Maamoul",
    hue: "#d6a06e",
    blurb: "Maamoul, Barazek, Petit Four. Tea-time classics worked by hand.",
    filter: (p) => /maamoul|cookie|barazek|ghraybeh|petit|ka'ak/i.test(p.name),
  },
  {
    id: "turkish-delight",
    name: "Turkish Delight",
    hue: "#e8b0a8",
    blurb: "Pillowy lokum dusted in powdered sugar. Rose, pistachio, mastic.",
    filter: (p) => /turkish delight|lokum/i.test(p.name),
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
    id: "gift-boxes",
    name: "Gift Boxes",
    hue: "#3a5c3a",
    blurb:
      "Pre-made and build-your-own. Wrapped, ribboned, sent. Hosts, teams, holidays.",
    filter: (p) => /assortment|box|premium|gift/i.test(p.name),
  },
  {
    id: "dates",
    name: "Dates",
    hue: "#5e3a1e",
    blurb:
      "Stuffed, chocolate-dipped, and tray gift boxes. Medjool, Khudri, Sukkari from Gulf groves.",
    filter: (p) => /date|leen/i.test(p.name),
  },
  {
    id: "coffee",
    name: "Coffee",
    hue: "#3a2618",
    blurb:
      "Arabic coffee blends, ceremonial pours, and morning roasts from the Gulf.",
    filter: (p) => /coffee|qahwa/i.test(p.name),
  },
  {
    id: "honey",
    name: "Honey",
    hue: "#caa55a",
    blurb:
      "Raw and infused honeys from the region — drizzle, spoon, or pair with our cheeses and breads.",
    filter: (p) => /honey/i.test(p.name),
  },
  {
    id: "bread",
    name: "Bread",
    hue: "#c39666",
    blurb:
      "Pita, pocket bread, zaatar, and cheese-filled flatbreads — Phoenicia's authentic Middle Eastern bakery.",
    filter: (p) => /bread|pita|zaatar|akawi|phoenicia/i.test(p.name),
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
  babanuj: {
    founder: "The Babanuj team",
    region: "Houston, Texas",
    yearLabel: "Founded 2023",
    signature: "House Gift Boxes",
    quote: `"We started Babanuj to put heirloom sweets in the hands of people who grew up with them — and the people about to discover them."`,
    quoteBy: "The Babanuj team",
    longStory: [
      "Babanuj is the umbrella house. We curate the heritage brands you see in the pantry — Zaitoune, Leen, Crush, and others — and we also make our own things: gift assortments, holiday boxes, and seasonal blends you won't find anywhere else.",
      "Every Babanuj-branded product is assembled in Houston, from components sourced through our partner houses. The work is done in-house so we can move quickly on holidays, Eid, and pop-up collaborations.",
      "Our goal is simple: never compromise on the originals, and use Babanuj's house line to fill the gaps the heritage houses don't.",
    ],
    facts: [
      { k: "Founded", v: "2023" },
      { k: "Region", v: "Houston, TX" },
      { k: "Role", v: "House line + curator" },
      { k: "Signature", v: "Gift Boxes" },
      { k: "Lines", v: "23 products" },
      { k: "Assembly", v: "Houston, TX" },
    ],
    timeline: [
      { year: "2023", t: "Babanuj launches as a curated import house." },
      { year: "2024", t: "First in-house gift boxes ship for Ramadan + Eid." },
      { year: "2025", t: "Holiday line expanded to 23 SKUs." },
      {
        year: "2026",
        t: "Wholesale program opens to U.S. specialty retailers.",
      },
    ],
  },
  leen: {
    founder: "Leen family",
    region: "Gulf",
    yearLabel: "Family-run",
    signature: "Stuffed Dates",
    quote: `"A date is a small thing. Done right, it carries a whole season of sun, water, and patience."`,
    quoteBy: "Leen family",
    longStory: [
      "Leen is a Gulf-based confectionary built around the date — Medjool, Khudri, Sukkari — grown on family-owned groves and hand-finished with pistachios, almonds, and single-origin chocolate.",
      "Every variety is selected by hand. Stuffing happens the same week the dates leave the grove. Babanuj is Leen's exclusive U.S. distributor, which means every order ships from our Houston warehouse within 48 hours of arrival.",
      "Stuffed dates, chocolate-coated dates, and tray gift boxes anchor the line. Each piece is a small bite, and the trays are designed to share.",
    ],
    facts: [
      { k: "Founded", v: "2020" },
      { k: "Region", v: "Gulf" },
      { k: "Maker", v: "Leen family" },
      { k: "Signature", v: "Stuffed Dates" },
      { k: "Lines", v: "13 products" },
      { k: "Variety", v: "Medjool · Khudri · Sukkari" },
    ],
    timeline: [
      { year: "2020", t: "Leen launches with hand-stuffed Medjool dates." },
      { year: "2022", t: "Chocolate-coated line introduced." },
      { year: "2024", t: "First Leen shipment lands in Houston." },
      { year: "2026", t: "Premium gift-box line expands to 13 SKUs." },
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

export function findProductByHandle(
  handle: string,
): BabanujProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.handle === handle);
}

export function findProductById(id: string): BabanujProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function findBrand(id: string): BabanujBrand | undefined {
  return BRANDS.find((b) => b.id === id);
}

/**
 * Resolve the brand object for a product. Prefers the curated brand id set by
 * the Shopify adapter, then a display-name match, and finally synthesizes a
 * minimal brand from the real Shopify vendor string. The synthetic fallback
 * carries no invented origin/story, so an unmapped vendor is never mislabeled
 * as one of the curated houses (previously it defaulted to the first brand).
 */
export function resolveProductBrand(
  p: Pick<BabanujProduct, "brand" | "brandId">,
): BabanujBrand {
  const byId = p.brandId ? BRANDS.find((b) => b.id === p.brandId) : undefined;
  if (byId) return byId;
  const byName = BRANDS.find((b) => b.name === p.brand);
  if (byName) return byName;
  return {
    id: "",
    name: p.brand || "Babanuj",
    sub: "",
    origin: "",
    est: 0,
    tag: "",
    blurb: "",
    long: "",
    note: "",
    accent: "#3a5c3a",
    color2: "#caa55a",
    img: "",
    products: [],
  };
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

/**
 * Shopify Storefront search query string for a category, used as a
 * fallback when the matching Shopify collection isn't created (yet) or
 * is empty. Mirrors the conditions the user is told to set on their
 * Smart collection.
 *
 * Returns `null` for the "all" pseudo-category — caller should fetch
 * the unfiltered product list instead.
 */
export function categoryShopifyQuery(id: string): string | null {
  switch (id) {
    case "baklava":
      return "tag:Baklava";
    case "cookies":
      return `tag:Cookies OR tag:"Ka'ak & Maamoul" OR tag:"Ghraybeh & Barazek"`;
    case "turkish-delight":
      return `tag:"Turkish Delight"`;
    case "chocolate":
      return `product_type:Chocolate OR tag:Chocolate`;
    case "gift-boxes":
      return `tag:"Gift Boxes"`;
    case "dates":
      return `product_type:dates`;
    case "coffee":
      return `product_type:Coffee`;
    case "honey":
      return `tag:Honey OR product_type:Honey`;
    case "bread":
      return `tag:Bread OR product_type:Bread`;
    case "all":
    default:
      return null;
  }
}
