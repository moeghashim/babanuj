import { WholesaleRequestForm } from "components/babanuj/wholesale-request-form";
import Footer from "components/layout/footer";

export const metadata = {
  title: "Contact",
  description:
    "Contact Babanuj Imports & Distribution for wholesale, retail, and brand partnership inquiries.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const product = typeof params?.product === "string" ? params.product : "";

  return (
    <>
      <main className="bg-[#f7f5ef]">
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
              Contact Us
            </p>
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Let’s talk about your next imported food program.
            </h1>
            <div className="mt-8 space-y-4 text-base font-medium leading-7 text-[#363630]">
              <p>10320 W Olympic Blvd, Suite 200</p>
              <p>Los Angeles, CA 90064</p>
              <p>
                <a href="tel:+13107727304">+1 (310) 772-7304</a>
              </p>
              <p>
                <a href="mailto:info@babanuj.com">info@babanuj.com</a>
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-[#d7d0c3] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Send a wholesale inquiry</h2>
            <p className="mt-2 text-sm leading-6 text-[#4d4b44]">
              Use this form for catalog requests, product inquiries, and
              partnership questions.
            </p>
            <div className="mt-6">
              <WholesaleRequestForm requestedProduct={product} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
