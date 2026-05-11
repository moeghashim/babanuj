import clsx from "clsx";

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
      <div className={clsx("leading-none", compact && "hidden sm:block")}>
        <div
          className={clsx(
            "font-serif font-bold tracking-[0.08em] text-[#151515]",
            compact ? "text-lg" : "text-2xl",
          )}
        >
          BABANUJ
        </div>
        <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#4e4e45]">
          Imports & Distribution
        </div>
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
