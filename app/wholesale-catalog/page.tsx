import { WholesaleRequestForm } from "components/babanuj/wholesale-request-form";
import Footer from "components/layout/footer";
import { wholesaleCatalog } from "lib/babanuj/data";
import Link from "next/link";

export const metadata = {
  title: "Wholesale Catalog",
  description:
    "Preview Babanuj wholesale product lines and request wholesale catalog access.",
};

export default function WholesaleCatalogPage() {
  return (
    <>
      <main className="bg-[#f7f5ef]">
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
                For Businesses
              </p>
              <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                Wholesale catalog built for retailers, distributors, and
                foodservice partners.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#363630]">
                Review our current product lines, then request detailed pricing,
                availability, and case-pack guidance from the Babanuj team.
              </p>
            </div>
            <div className="rounded-lg border border-[#d7d0c3] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Request the full catalog</h2>
              <p className="mt-2 text-sm leading-6 text-[#4d4b44]">
                Share your business details and we will follow up with the right
                wholesale information.
              </p>
              <div className="mt-6">
                <WholesaleRequestForm />
              </div>
            </div>
          </div>
          <div className="mt-10 overflow-hidden rounded-lg border border-[#d7d0c3] bg-white">
            <div className="hidden grid-cols-[1fr_1.4fr_1.5fr_1.5fr_0.7fr] bg-[#294621] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white md:grid">
              <span>Brand</span>
              <span>Product Line</span>
              <span>Format / Pack Sizes</span>
              <span>Channel</span>
              <span>Inquire</span>
            </div>
            {wholesaleCatalog.map((row) => (
              <div
                key={`${row.brand}-${row.productLine}`}
                className="grid gap-3 border-t border-[#e5ded1] px-4 py-4 text-sm md:grid-cols-[1fr_1.4fr_1.5fr_1.5fr_0.7fr] md:items-center"
              >
                <Link
                  href={`/brands/${row.brandHandle}`}
                  className="font-black uppercase tracking-[0.1em]"
                >
                  {row.logoText}
                </Link>
                <span className="font-semibold">{row.productLine}</span>
                <span className="text-[#4c4b45]">{row.packSizes}</span>
                <span className="text-[#4c4b45]">{row.channel}</span>
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
