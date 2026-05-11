import Footer from "components/layout/footer";

export const metadata = {
  title: "About",
  description:
    "Learn about Babanuj Imports & Distribution and its curated food brand portfolio.",
};

export default function AboutPage() {
  return (
    <>
      <main className="bg-[#f7f5ef]">
        <section className="mx-auto max-w-5xl px-5 py-12 md:px-8 lg:py-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#294621]">
            About Babanuj
          </p>
          <h1 className="mt-3 text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Importing iconic regional flavors for the U.S. market.
          </h1>
          <div className="mt-8 grid gap-6 text-lg font-medium leading-8 text-[#363630] md:grid-cols-2">
            <p>
              Babanuj Imports & Distribution brings premium Middle Eastern and
              Turkish food brands to retailers, distributors, foodservice
              operators, and consumers across the United States.
            </p>
            <p>
              Our role is to curate brands with strong product quality,
              presentation, and demand, then make them easier for partners to
              source through reliable U.S.-based support.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Curated", "Brands selected for flavor, packaging, and appeal."],
              ["Reliable", "U.S.-focused fulfillment and partner support."],
              [
                "Flexible",
                "Retail, wholesale, specialty, and foodservice paths.",
              ],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-lg border border-[#d7d0c3] bg-white p-6"
              >
                <h2 className="text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#4d4b44]">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
