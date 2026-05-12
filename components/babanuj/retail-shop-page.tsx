import {
  ArrowTopRightOnSquareIcon,
  GiftIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { brands, retailProducts } from "lib/babanuj/data";
import type { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

type RetailShopPageProps = {
  products: Product[];
  selectedBrand?: string;
  selectedCategory?: string;
};

const retailCategories = [
  {
    title: "Baklava",
    image: "/babanuj/shopify/baklava-250.jpg",
  },
  {
    title: "Turkish Delight",
    image: "/babanuj/shopify/turkish-delight-250.jpg",
  },
  {
    title: "Maamoul & Cookies",
    image: "/babanuj/shopify/mamoul-250.jpg",
  },
  {
    title: "Dubai Chocolate",
    image: "/babanuj/shopify/crush-chocolate.jpg",
  },
];

const retailBenefits = [
  {
    title: "Gift-ready sweets",
    description: "Elegant imported formats for hosting, gifting, and sharing.",
    icon: GiftIcon,
  },
  {
    title: "Curated by Babanuj",
    description: "A focused edit of Middle Eastern and Turkish favorites.",
    icon: MagnifyingGlassIcon,
  },
  {
    title: "U.S. fulfillment",
    description: "Retail orders use the same dependable supply network.",
    icon: TruckIcon,
  },
];

export function RetailShopPage({
  products,
  selectedBrand = "",
  selectedCategory = "",
}: RetailShopPageProps) {
  const filteredProducts = filterShopifyProducts(
    products,
    selectedBrand,
    selectedCategory,
  );
  const filteredLocalProducts = filterLocalProducts(
    selectedBrand,
    selectedCategory,
  );
  const hasShopifyProducts = products.length > 0;
  const visibleProducts = hasShopifyProducts ? filteredProducts : [];
  const visibleLocalProducts = hasShopifyProducts ? [] : filteredLocalProducts;
  const hasVisibleProducts = hasShopifyProducts
    ? visibleProducts.length > 0
    : visibleLocalProducts.length > 0;
  const productHeading = selectedBrand
    ? `${selectedBrand} retail favorites`
    : selectedCategory
      ? `${selectedCategory} selections`
      : "Premium sweets and chocolates for every table.";

  return (
    <div className="bg-[#f7f5ef] text-[#11120f]">
      <RetailHero />
      <RetailCategories />
      <section
        id="retail-products"
        className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:py-16"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
              Shop Retail
            </p>
            <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
              {productHeading}
            </h2>
          </div>
          <Link
            href="/search"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#a9a291] bg-white px-5 text-sm font-bold text-[#1d2419] transition hover:border-[#294621]"
          >
            Search All Products
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </div>
        {hasShopifyProducts && hasVisibleProducts ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.slice(0, 8).map((product) => (
              <ShopifyProductCard key={product.handle} product={product} />
            ))}
          </div>
        ) : null}
        {!hasShopifyProducts && hasVisibleProducts ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleLocalProducts.map((product) => (
              <LocalProductCard key={product.name} product={product} />
            ))}
          </div>
        ) : null}
        {!hasVisibleProducts ? <RetailEmptyState /> : null}
      </section>
      <RetailBrands />
      <RetailBenefits />
      <WholesaleBand />
    </div>
  );
}

function RetailEmptyState() {
  return (
    <div className="mt-8 rounded-lg border border-[#ddd6c8] bg-white p-8 text-center">
      <h3 className="text-2xl font-black">No matching retail products</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#4d4b44]">
        Try the full retail selection or send us a note for a specific flavor,
        format, or brand request.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/shop-retail#retail-products"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#294621] px-5 text-sm font-bold text-white"
        >
          View All Retail
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-md border border-[#a9a291] bg-white px-5 text-sm font-bold text-[#1d2419]"
        >
          Contact Babanuj
        </Link>
      </div>
    </div>
  );
}

function RetailHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#e1dbcf] bg-[#f4f1ea]">
      <Image
        src="/babanuj/shopify/turkish-delight-250.jpg"
        alt="Turkish delight and coffee served in a retail setting"
        fill
        priority
        className="object-cover object-[58%_50%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#f7f5ef_0%,#f7f5ef_38%,rgba(247,245,239,0.9)_52%,rgba(247,245,239,0.42)_72%,rgba(247,245,239,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,245,239,0.72)_0%,rgba(247,245,239,0.1)_42%,rgba(247,245,239,0.4)_100%)] md:bg-none" />
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-12 md:px-8 lg:py-20">
        <div className="max-w-[22rem] sm:max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#294621]">
            Retail Shop
          </p>
          <h1 className="mt-5 text-[2.45rem] font-black leading-[1.02] tracking-tight text-[#10110f] sm:text-5xl md:text-6xl">
            <span className="block">Imported sweets,</span>
            <span className="block">ready to enjoy</span>
            <span className="block">at home.</span>
          </h1>
          <p className="mt-6 max-w-[22rem] text-base font-medium leading-7 text-[#30312b] sm:max-w-xl md:text-lg">
            Explore Babanuj's curated retail selection of Turkish delight,
            baklava, maamoul, cookies, and Dubai chocolate from our imported
            brand portfolio.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#retail-products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#294621] px-6 text-sm font-bold text-white transition hover:bg-[#203719]"
            >
              <ShoppingBagIcon className="h-4 w-4" />
              Browse Products
            </Link>
            <Link
              href="/wholesale-catalog"
              className="inline-flex h-12 items-center justify-center rounded-md border border-[#a9a291] bg-[#fffdf8] px-6 text-sm font-bold text-[#1d2419] transition hover:border-[#294621]"
            >
              Buying for a business?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RetailCategories() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="grid gap-4 md:grid-cols-4">
        {retailCategories.map((category) => (
          <Link
            key={category.title}
            href={`/shop-retail?category=${encodeURIComponent(category.title)}`}
            className="group relative min-h-44 overflow-hidden rounded-lg border border-[#ddd6c8] bg-white shadow-sm"
          >
            <Image
              src={category.image}
              alt={`${category.title} products`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/0" />
            <h2 className="absolute bottom-4 left-4 right-4 text-lg font-black text-white">
              {category.title}
            </h2>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ShopifyProductCard({ product }: { product: Product }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group overflow-hidden rounded-lg border border-[#ddd6c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[1.18] overflow-hidden bg-[#ece6dc]">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5b37]">
          Babanuj Retail
        </p>
        <h3 className="mt-2 min-h-12 text-lg font-black leading-tight">
          {product.title}
        </h3>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-base font-black">
            {formatMoney(price.amount, price.currencyCode)}
          </p>
          <span className="text-xs font-black text-[#294621]">View</span>
        </div>
      </div>
    </Link>
  );
}

function LocalProductCard({
  product,
}: {
  product: (typeof retailProducts)[number];
}) {
  return (
    <Link
      href={product.href}
      className="group overflow-hidden rounded-lg border border-[#ddd6c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[1.18] overflow-hidden bg-[#ece6dc]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5b37]">
          {product.brand}
        </p>
        <h3 className="mt-2 min-h-12 text-lg font-black leading-tight">
          {product.name}
        </h3>
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-base font-black">{product.price}</p>
          <span className="text-xs font-black text-[#294621]">View</span>
        </div>
      </div>
    </Link>
  );
}

function RetailBrands() {
  return (
    <section className="border-y border-[#e1dbcf] bg-[#f0eee8]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
              Shop By Brand
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Find the flavor profile your table needs.
            </h2>
          </div>
          <Link
            href="/brands"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#a9a291] bg-white px-5 text-sm font-bold text-[#1d2419] transition hover:border-[#294621]"
          >
            View Brand Portfolio
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.handle}
              href={`/shop-retail?brand=${encodeURIComponent(brand.name)}`}
              className="rounded-lg border border-[#ddd6c8] bg-[#fbfaf6] p-6 transition hover:border-[#294621]"
            >
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6f5b37]">
                {brand.origin}
              </p>
              <h3 className="mt-2 text-2xl font-black">{brand.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4d4b44]">
                {brand.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function RetailBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {retailBenefits.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-lg border border-[#ddd6c8] bg-white p-6"
            >
              <Icon className="h-9 w-9 text-[#294621]" />
              <h2 className="mt-4 text-lg font-black">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#4d4b44]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WholesaleBand() {
  return (
    <section className="bg-[#294621] px-5 py-12 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d8d4c9]">
            For Retailers And Distributors
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight">
            Need cases, pallets, or a curated wholesale program?
          </h2>
        </div>
        <Link
          href="/wholesale-catalog"
          className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-black text-[#294621]"
        >
          Request Wholesale Catalog
        </Link>
      </div>
    </section>
  );
}

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function filterLocalProducts(selectedBrand: string, selectedCategory: string) {
  return retailProducts.filter((product) => {
    const brandMatches = selectedBrand
      ? product.brand.toLowerCase() === selectedBrand.toLowerCase()
      : true;
    const categoryMatches = selectedCategory
      ? textMatches(product.name, selectedCategory)
      : true;

    return brandMatches && categoryMatches;
  });
}

function filterShopifyProducts(
  products: Product[],
  selectedBrand: string,
  selectedCategory: string,
) {
  return products.filter((product) => {
    const searchable = [
      product.title,
      product.description,
      ...(product.tags || []),
    ].join(" ");
    const brandMatches = selectedBrand
      ? textMatches(searchable, selectedBrand)
      : true;
    const categoryMatches = selectedCategory
      ? textMatches(searchable, selectedCategory)
      : true;

    return brandMatches && categoryMatches;
  });
}

function textMatches(value: string, query: string) {
  const terms = query
    .toLowerCase()
    .split(/[\s&]+/)
    .filter(Boolean);
  const normalizedValue = value.toLowerCase();

  return terms.some((term) => normalizedValue.includes(term));
}
