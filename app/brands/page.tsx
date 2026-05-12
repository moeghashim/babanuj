import { BrandLogoBadge } from "components/babanuj/brand-logo";
import Footer from "components/layout/footer";
import { brands } from "lib/babanuj/data";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Brands",
  description:
    "Explore Babanuj's curated portfolio of imported Middle Eastern and Turkish food brands.",
};

export default function BrandsPage() {
  return (
    <>
      <main className="bg-[#f7f5ef]">
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:py-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
            Brand Portfolio
          </p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Imported brands selected for taste, quality, and retail demand.
          </h1>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {brands.map((brand) => (
              <Link
                href={`/brands/${brand.handle}`}
                key={brand.handle}
                className="group overflow-hidden rounded-lg border border-[#ddd6c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={brand.heroImage}
                    alt={`${brand.name} products`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <BrandLogoBadge
                    src={brand.logoImage}
                    alt={`${brand.name} logo`}
                    className="absolute bottom-5 left-5"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#856d4a]">
                    {brand.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">{brand.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#4d4b44]">
                    {brand.longDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
