import type { CSSProperties, ImgHTMLAttributes } from "react";

type Props = {
  src: string;
  alt?: string;
  style?: CSSProperties;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "style">;

export function Photo({ src, alt = "", style, ...rest }: Props) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        ...style,
      }}
      {...rest}
    />
  );
}
