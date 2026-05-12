import {
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  brands,
  processSteps,
  retailProducts,
  valueProps,
  wholesaleCatalog,
} from "lib/babanuj/data";
import Image from "next/image";
import Link from "next/link";
import { BrandLogoBadge } from "./brand-logo";
import { BabanujIcon } from "./icons";

export function BabanujHomePage() {
  return (
    <div className="bg-[#f7f5ef] text-[#11120f]">
      <Hero />
      <FeaturedBrands />
      <WhyBabanuj />
      <WholesalePreview />
      <RetailPreview />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[720px] overflow-hidden border-b border-[#e1dbcf] bg-[#f4f1ea] md:min-h-[760px]">
      <Image
        src="/babanuj/shopify/hero.jpg"
        alt="Zaitoune Turkish delight and coffee setting"
        fill
        priority
        className="object-cover object-[62%_50%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#f7f5ef_0%,#f7f5ef_34%,rgba(247,245,239,0.88)_48%,rgba(247,245,239,0.5)_62%,rgba(247,245,239,0.12)_78%,rgba(247,245,239,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,245,239,0.72)_0%,rgba(247,245,239,0.1)_34%,rgba(247,245,239,0.34)_100%)] md:bg-none" />
      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-5 py-12 md:min-h-[760px] md:px-8 lg:py-20">
        <div className="min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-none">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#294621]">
            Global flavors. Local partners.
          </p>
          <h1 className="mt-5 max-w-[calc(100vw-2.5rem)] text-[2.35rem] font-black leading-[1.02] tracking-tight text-[#10110f] sm:max-w-xl sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Imported Brands,</span>
            <span className="block">Ready for Retail</span>
            <span className="block">and Wholesale</span>
          </h1>
          <p className="mt-6 max-w-[calc(100vw-2.5rem)] text-base font-medium leading-7 text-[#30312b] sm:max-w-xl md:text-lg">
            Babanuj imports and distributes premium food brands from the Middle
            East and Turkiye across the United States, delivering exceptional
            products and collections to both consumers and business partners.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/brands"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#294621] px-6 text-sm font-bold text-white transition hover:bg-[#203719]"
            >
              Browse Brands
            </Link>
            <Link
              href="/wholesale-catalog"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#a9a291] bg-[#fffdf8] px-6 text-sm font-bold text-[#1d2419] transition hover:border-[#294621]"
            >
              Request Wholesale Catalog
              <ClipboardDocumentListIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-5 text-sm font-semibold text-[#25251f] sm:grid-cols-3">
            <TrustItem icon="globe" title="Curated International Brands" />
            <TrustItem icon="shield" title="Quality You Can Trust" />
            <TrustItem icon="truck" title="Reliable Supply Across the U.S." />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  title,
}: {
  icon: "globe" | "shield" | "truck";
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <BabanujIcon name={icon} className="h-9 w-9 flex-none" />
      <span className="leading-snug">{title}</span>
    </div>
  );
}

function FeaturedBrands() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:py-16">
      <div className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
          Featured Brands
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
          Exceptional Brands. Timeless Taste.
        </h2>
      </div>
      <div className="mt-9 grid gap-7 md:grid-cols-3">
        {brands.map((brand) => (
          <Link
            href={`/brands/${brand.handle}`}
            key={brand.handle}
            className="group overflow-hidden rounded-lg border border-[#ddd6c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-56 overflow-hidden bg-[#ece6dc]">
              <Image
                src={brand.image}
                alt={`${brand.name} products`}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
              <BrandLogoBadge
                src={brand.logoImage}
                alt={`${brand.name} logo`}
                className="absolute -bottom-10 left-6"
              />
            </div>
            <div className="px-6 pb-6 pt-14">
              <p className="inline-flex rounded bg-[#f1ebde] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#6f5b37]">
                {brand.category}
              </p>
              <p className="mt-4 min-h-16 text-sm font-medium leading-6 text-[#3d3b35]">
                {brand.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#34352f]">
                <span>Est. {brand.established}</span>
                <span>{brand.origin}</span>
                <span>{brand.attributes[0]}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhyBabanuj() {
  return (
    <section className="border-y border-[#e1dbcf] bg-[#f0eee8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.8fr_1.4fr] md:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#294621]">
            Why Babanuj
          </p>
          <h2 className="mt-3 max-w-sm text-3xl font-black leading-tight tracking-tight">
            More Than a Distributor. Your Growth Partner.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((item) => (
            <div
              key={item.title}
              className="border-[#d7d1c5] bg-[#f8f6f0] p-6 text-center sm:border-l"
            >
              <BabanujIcon name={item.icon} className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-sm font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4d4b44]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WholesalePreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#294621]">
            For Businesses
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Wholesale Catalog Preview
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-[#4a4a42]">
            Explore our brand portfolio and product lines available for
            wholesale.
          </p>
        </div>
        <Link
          href="/wholesale-catalog"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#a9a291] bg-white px-5 text-sm font-bold text-[#1d2419] transition hover:border-[#294621]"
        >
          View Full Catalog
          <ClipboardDocumentListIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-[#d7d0c3] bg-white">
        <div className="hidden grid-cols-[1fr_1.5fr_1.55fr_1.5fr_0.7fr] bg-[#294621] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white md:grid">
          <span>Brand</span>
          <span>Product Line</span>
          <span>Format / Pack Sizes</span>
          <span>Channel</span>
          <span>Inquire</span>
        </div>
        {wholesaleCatalog.map((row) => (
          <div
            key={`${row.brand}-${row.productLine}`}
            className="grid gap-3 border-t border-[#e5ded1] px-4 py-4 text-sm md:grid-cols-[1fr_1.5fr_1.55fr_1.5fr_0.7fr] md:items-center md:gap-4 md:py-3"
          >
            <Link
              href={`/brands/${row.brandHandle}`}
              className="font-black uppercase tracking-[0.1em] text-[#1d1d1a]"
            >
              {row.logoText}
            </Link>
            <span className="font-semibold">{row.productLine}</span>
            <span className="text-[#4c4b45]">{row.packSizes}</span>
            <span className="text-[#4c4b45]">{row.channel}</span>
            <Link
              href={`/contact?product=${encodeURIComponent(row.productLine)}`}
              className="inline-flex h-8 w-max items-center rounded-md border border-[#a9a291] px-3 text-xs font-bold text-[#294621] hover:border-[#294621]"
            >
              Inquire
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-[#d7d0c3] bg-[#fbfaf6] p-5">
        <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-[#294621]">
          Wholesale Made Simple
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#294621] text-white">
                <BabanujIcon name={step.icon} className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black">{index + 1}</span>
                  <h3 className="text-sm font-black">{step.title}</h3>
                </div>
                <p className="mt-1 text-sm leading-5 text-[#4c4b45]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RetailPreview() {
  return (
    <section className="border-t border-[#e1dbcf] bg-[#f0eee8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[0.55fr_1.45fr] md:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#294621]">
            Shop as a Consumer
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Indulge in Iconic Flavors
          </h2>
          <p className="mt-3 text-sm font-medium leading-6 text-[#4a4a42]">
            Premium sweets and chocolates, delivered right to your door.
          </p>
          <Link
            href="/shop-retail"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#294621] px-5 text-sm font-bold text-white transition hover:bg-[#203719]"
          >
            Shop Retail
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {retailProducts.map((product) => (
            <Link key={product.name} href={product.href} className="group">
              <div className="relative aspect-[1.45] overflow-hidden rounded-md bg-white shadow-sm">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 18vw, 50vw"
                />
              </div>
              <h3 className="mt-3 text-center text-sm font-black">
                {product.name}
              </h3>
              <p className="mt-1 text-center text-sm font-bold text-[#11120f]">
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
