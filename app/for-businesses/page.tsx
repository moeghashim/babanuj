import { BabanujIcon } from "components/babanuj/icons";
import { WholesaleRequestForm } from "components/babanuj/wholesale-request-form";
import Footer from "components/layout/footer";
import { processSteps, valueProps } from "lib/babanuj/data";

export const metadata = {
  title: "For Businesses",
  description:
    "Wholesale, distribution, and retail partnership information for Babanuj imported brands.",
};

export default function ForBusinessesPage() {
  return (
    <>
      <main className="bg-[#f7f5ef]">
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
              Retail & Wholesale Supply
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight md:text-6xl">
              A U.S. partner for premium imported food brands.
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-[#363630]">
              Babanuj supports retailers, distributors, specialty shops, online
              sellers, and foodservice operators with curated products and
              dependable fulfillment.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {valueProps.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-[#d7d0c3] bg-white p-5"
                >
                  <BabanujIcon name={item.icon} />
                  <h2 className="mt-3 text-base font-black">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#4d4b44]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#d7d0c3] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Start a wholesale request</h2>
            <p className="mt-2 text-sm leading-6 text-[#4d4b44]">
              Tell us about your business and the product lines you want to
              source.
            </p>
            <div className="mt-6">
              <WholesaleRequestForm />
            </div>
          </div>
        </section>
        <section className="border-t border-[#e1dbcf] bg-[#f0eee8]">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-[#294621]">
              Wholesale Made Simple
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-lg border border-[#d7d0c3] bg-[#fbfaf6] p-6"
                >
                  <span className="text-3xl font-black">{index + 1}</span>
                  <BabanujIcon name={step.icon} className="mt-4" />
                  <h2 className="mt-4 text-lg font-black">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#4d4b44]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
