import { BrandLogoBadge } from "components/babanuj/brand-logo";
import Footer from "components/layout/footer";
import { getBrand, wholesaleCatalog } from "lib/babanuj/data";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const brand = getBrand(handle);

  if (!brand) return notFound();

  return {
    title: brand.name,
    description: brand.description,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const brand = getBrand(handle);

  if (!brand) return notFound();

  const rows = wholesaleCatalog.filter((row) => row.brandHandle === handle);

  return (
    <>
      <main className="bg-[#f7f5ef]">
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-8 lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
              {brand.origin} · Est. {brand.established}
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight md:text-6xl">
              {brand.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-[#363630]">
              {brand.longDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {brand.attributes.map((attribute) => (
                <span
                  key={attribute}
                  className="rounded bg-[#ece5d7] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#6f5b37]"
                >
                  {attribute}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?product=${encodeURIComponent(brand.name)}`}
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#294621] px-6 text-sm font-bold text-white"
              >
                Request Wholesale Info
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(brand.name)}`}
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#a9a291] bg-white px-6 text-sm font-bold text-[#1d2419]"
              >
                Shop Retail
              </Link>
            </div>
          </div>
          <div className="relative min-h-[380px] overflow-hidden rounded-lg border border-[#ded7ca]">
            <Image
              src={brand.heroImage}
              alt={`${brand.name} hero`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
            <BrandLogoBadge
              src={brand.logoImage}
              alt={`${brand.name} logo`}
              className="absolute bottom-6 left-6"
            />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
          <h2 className="text-2xl font-black">Wholesale Lines</h2>
          <div className="mt-5 overflow-hidden rounded-lg border border-[#d7d0c3] bg-white">
            {rows.map((row) => (
              <div
                key={row.productLine}
                className="grid gap-3 border-t border-[#e5ded1] px-4 py-4 text-sm first:border-t-0 md:grid-cols-[1.2fr_1.4fr_1.4fr_0.6fr] md:items-center"
              >
                <span className="font-black">{row.productLine}</span>
                <span>{row.packSizes}</span>
                <span>{row.channel}</span>
                <Link
                  href={`/contact?product=${encodeURIComponent(row.productLine)}`}
                  className="inline-flex h-8 w-max items-center rounded-md border border-[#a9a291] px-3 text-xs font-bold text-[#294621]"
                >
                  Inquire
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
