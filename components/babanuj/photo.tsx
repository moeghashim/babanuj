import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt?: string;
  style?: CSSProperties;
  /** When true (the default), use next/image with fill positioning. The
   *  parent must be position:relative + sized. Set false to render a raw
   *  <img> (rare — only for cases where the wrapper can't be sized). */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  quality?: number;
  /** Fallback `<img src>` width for crawlers that ignore `srcset`. */
  fallbackWidth?: number;
};

export function Photo({
  src,
  alt = "",
  style,
  fill = true,
  sizes,
  priority,
  fetchPriority,
  quality,
  fallbackWidth,
}: Props) {
  const fallbackSrc = fallbackWidth
    ? `/_next/image?url=${encodeURIComponent(src)}&w=${fallbackWidth}&q=${
        quality ?? 75
      }`
    : undefined;

  if (!fill) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        fetchPriority={fetchPriority}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          ...style,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      overrideSrc={fallbackSrc}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 900px) 100vw, 50vw"}
      priority={priority}
      fetchPriority={fetchPriority}
      quality={quality}
      style={{
        objectFit: "cover",
        ...style,
      }}
    />
  );
}
