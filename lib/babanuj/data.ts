export type Brand = {
  handle: string;
  name: string;
  logoText: string;
  origin: string;
  established: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  heroImage: string;
  attributes: string[];
  wholesaleLines: string[];
};

export type RetailProduct = {
  name: string;
  brand: string;
  price: string;
  image: string;
  href: string;
};

export type WholesaleCatalogRow = {
  brandHandle: string;
  brand: string;
  logoText: string;
  productLine: string;
  packSizes: string;
  channel: string;
};

export type ValueProp = {
  title: string;
  description: string;
  icon: "globe" | "shield" | "truck" | "handshake";
};

export type ProcessStep = {
  title: string;
  description: string;
  icon: "clipboard" | "box" | "handshake";
};

export const navItems = [
  { title: "Brands", path: "/brands" },
  { title: "Wholesale Catalog", path: "/wholesale-catalog" },
  { title: "Shop Retail", path: "/search" },
  { title: "For Businesses", path: "/for-businesses" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

export const brands: Brand[] = [
  {
    handle: "zaitoune-sweets",
    name: "Zaitoune Sweets",
    logoText: "ZAITOUNE",
    origin: "Turkiye",
    established: "1991",
    category: "Turkish & Middle Eastern Sweets",
    description:
      "Heritage recipes crafted with premium ingredients for an authentic taste experience.",
    longDescription:
      "Zaitoune Sweets brings classic Turkish and Middle Eastern desserts to modern retail shelves with elegant packaging, dependable wholesale formats, and a flavor profile built around pistachio, honey, and delicate pastry.",
    image: "/babanuj/zaitoune-card.svg",
    heroImage: "/babanuj/zaitoune-hero.svg",
    attributes: ["Premium Quality", "Retail Ready", "Giftable"],
    wholesaleLines: ["Turkish Delight", "Baklava"],
  },
  {
    handle: "al-hudayf",
    name: "Al Hudayf Premium Dates",
    logoText: "AL HUDAYF",
    origin: "Syria",
    established: "1993",
    category: "Authentic Syrian Desserts",
    description:
      "Traditional Syrian desserts made with generations of passion and craftsmanship.",
    longDescription:
      "Al Hudayf focuses on regional classics with formats that work across grocery, specialty, gift, and foodservice channels, from date maamoul to crisp sesame cookies.",
    image: "/babanuj/hudayf-card.svg",
    heroImage: "/babanuj/hudayf-hero.svg",
    attributes: [
      "Traditional Recipes",
      "Foodservice Options",
      "Specialty Grocery",
    ],
    wholesaleLines: ["Date Maamoul", "Barazek", "Mixed Cookies"],
  },
  {
    handle: "crush-chocolate",
    name: "Crush Chocolate",
    logoText: "CRUSH",
    origin: "UAE",
    established: "2023",
    category: "Famous Dubai Chocolate",
    description:
      "The viral Dubai chocolate experience: rich, indulgent, and unforgettable.",
    longDescription:
      "Crush Chocolate delivers the pistachio-knafeh chocolate format customers ask for by name, with retail-ready packaging and wholesale case packs for specialty, gift, online, and grocery channels.",
    image: "/babanuj/crush-card.svg",
    heroImage: "/babanuj/crush-hero.svg",
    attributes: ["Modern Indulgence", "High Demand", "Retail Ready"],
    wholesaleLines: ["Dubai Chocolate"],
  },
];

export const valueProps: ValueProp[] = [
  {
    title: "Curated Imported Brands",
    description:
      "We handpick exceptional brands with proven quality and market appeal.",
    icon: "globe",
  },
  {
    title: "Retail & Wholesale Supply",
    description:
      "Flexible solutions for retailers, distributors, and foodservice.",
    icon: "shield",
  },
  {
    title: "U.S. Fulfillment",
    description:
      "Inventory in the U.S. for faster delivery and reliable service.",
    icon: "truck",
  },
  {
    title: "Business-Friendly Sourcing",
    description:
      "Competitive terms, dedicated support, and long-term partnerships.",
    icon: "handshake",
  },
];

export const wholesaleCatalog: WholesaleCatalogRow[] = [
  {
    brandHandle: "zaitoune-sweets",
    brand: "Zaitoune Sweets",
    logoText: "ZAITOUNE",
    productLine: "Turkish Delight",
    packSizes: "12 x 300g, 12 x 400g, 6 x 1kg",
    channel: "Grocery, Specialty, Gift, Online",
  },
  {
    brandHandle: "zaitoune-sweets",
    brand: "Zaitoune Sweets",
    logoText: "ZAITOUNE",
    productLine: "Baklava",
    packSizes: "16 pcs, 32 pcs, 1kg Tray",
    channel: "Grocery, Specialty, Foodservice",
  },
  {
    brandHandle: "al-hudayf",
    brand: "Al Hudayf Premium Dates",
    logoText: "AL HUDAYF",
    productLine: "Date Maamoul",
    packSizes: "16 pcs, 24 pcs, 480g",
    channel: "Grocery, Specialty, Gift",
  },
  {
    brandHandle: "al-hudayf",
    brand: "Al Hudayf Premium Dates",
    logoText: "AL HUDAYF",
    productLine: "Barazek",
    packSizes: "12 pcs, 24 pcs, 500g",
    channel: "Grocery, Specialty, Foodservice",
  },
  {
    brandHandle: "al-hudayf",
    brand: "Al Hudayf Premium Dates",
    logoText: "AL HUDAYF",
    productLine: "Mixed Cookies",
    packSizes: "500g, 1kg, 2kg",
    channel: "Grocery, Wholesale, Foodservice",
  },
  {
    brandHandle: "crush-chocolate",
    brand: "Crush Chocolate",
    logoText: "CRUSH",
    productLine: "Dubai Chocolate",
    packSizes: "6 x 140g, 12 x 190g",
    channel: "Grocery, Specialty, Online",
  },
];

export const retailProducts: RetailProduct[] = [
  {
    name: "Pistachio Baklava",
    brand: "Zaitoune Sweets",
    price: "$34.99",
    image: "/babanuj/product-baklava.svg",
    href: "/search?q=baklava",
  },
  {
    name: "Turkish Delight Assortment",
    brand: "Zaitoune Sweets",
    price: "$24.99",
    image: "/babanuj/product-delight.svg",
    href: "/search?q=turkish%20delight",
  },
  {
    name: "Maamoul Date Cookies",
    brand: "Al Hudayf",
    price: "$16.99",
    image: "/babanuj/product-maamoul.svg",
    href: "/search?q=maamoul",
  },
  {
    name: "Crush Dubai Chocolate",
    brand: "Crush Chocolate",
    price: "$18.99",
    image: "/babanuj/product-chocolate.svg",
    href: "/search?q=dubai%20chocolate",
  },
];

export const processSteps: ProcessStep[] = [
  {
    title: "Discover Brands",
    description: "Explore our curated portfolio of in-demand brands.",
    icon: "clipboard",
  },
  {
    title: "Request Catalog / Quote",
    description: "Get detailed product info, pricing, and availability.",
    icon: "box",
  },
  {
    title: "Order & Fulfill",
    description: "We handle the logistics. You grow your business.",
    icon: "handshake",
  },
];

export function getBrand(handle: string) {
  return brands.find((brand) => brand.handle === handle);
}
