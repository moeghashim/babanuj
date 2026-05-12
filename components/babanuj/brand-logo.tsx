import clsx from "clsx";
import Image from "next/image";

export function BabanujLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          "flex items-center justify-center rounded-full border-2 border-[#1f2f1d] bg-[#fbfaf6] font-serif font-bold text-[#1f2f1d]",
          compact ? "h-9 w-9 text-xl" : "h-12 w-12 text-2xl",
        )}
      >
        B
      </div>
      <div
        className={clsx(
          "relative h-10",
          compact ? "hidden w-44 sm:block" : "w-56",
        )}
      >
        <Image
          src="/babanuj/shopify/logo.png"
          alt="Babanuj"
          fill
          className="object-contain object-left"
          sizes={compact ? "176px" : "224px"}
          priority
        />
      </div>
    </div>
  );
}

export function BrandMark({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex h-20 w-36 flex-col items-center justify-center rounded-md border border-[#e0d8c9] bg-[#fffdfa] text-center shadow-sm",
        className,
      )}
    >
      <div className="font-serif text-2xl leading-none text-[#856d4a]">✺</div>
      <div className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-[#1d1d1a]">
        {text}
      </div>
    </div>
  );
}

export function BrandLogoBadge({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative h-20 w-36 rounded-md border border-[#e0d8c9] bg-[#fffdfa] p-3 shadow-sm",
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-contain p-3" />
    </div>
  );
}
