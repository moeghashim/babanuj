import { BabanujHomePage } from "components/babanuj/home-page";
import Footer from "components/layout/footer";

export const metadata = {
  description:
    "Babanuj imports and distributes premium Middle Eastern and Turkish food brands across the United States.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <BabanujHomePage />
      <Footer />
    </>
  );
}
