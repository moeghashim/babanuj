import Link from "next/link";

import { BabanujLogo } from "components/babanuj/brand-logo";
import { navItems } from "lib/babanuj/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#171a17] text-sm text-[#d8d4c9]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.25fr_0.8fr_0.9fr_1fr_0.9fr] md:px-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex rounded bg-[#f7f5ef] p-3">
            <BabanujLogo compact />
          </Link>
          <p className="mt-5 leading-6">
            Bringing the finest Middle Eastern & Turkish food brands to the U.S.
          </p>
          <div className="mt-5 flex gap-3 text-xs font-black">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#52594c]">
              in
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#52594c]">
              ig
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#52594c]">
              f
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#52594c]">
              @
            </span>
          </div>
          <p className="mt-5 text-xs text-[#a9a69c]">
            © {currentYear} Babanuj Imports & Distribution. All rights
            reserved.
          </p>
        </div>
        <FooterColumn title="Navigation">
          {navItems.map((item) => (
            <Link key={item.title} href={item.path}>
              {item.title}
            </Link>
          ))}
        </FooterColumn>
        <FooterColumn title="For Businesses">
          <Link href="/wholesale-catalog">Request Wholesale Catalog</Link>
          <Link href="/for-businesses">Become a Partner</Link>
          <Link href="/contact">Payment & Order Tracking</Link>
          <Link href="/contact">Terms & Conditions</Link>
        </FooterColumn>
        <FooterColumn title="Contact Us">
          <span>10320 W Olympic Blvd, Suite 200</span>
          <span>Los Angeles, CA 90064</span>
          <a href="tel:+13107727304">+1 (310) 772-7304</a>
          <a href="mailto:info@babanuj.com">info@babanuj.com</a>
        </FooterColumn>
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white">
            Ready to partner with Babanuj?
          </h3>
          <Link
            href="/wholesale-catalog"
            className="mt-5 inline-flex min-h-14 items-center justify-center rounded-md bg-[#294621] px-6 text-center text-sm font-bold text-white"
          >
            Request Wholesale Catalog
          </Link>
          <div className="mt-8 flex gap-4 text-xs text-[#a9a69c]">
            <Link href="/contact">Privacy Policy</Link>
            <Link href="/contact">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-white">
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-2 leading-6 text-[#d8d4c9]">
        {children}
      </div>
    </div>
  );
}
