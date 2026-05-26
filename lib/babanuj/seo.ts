import type { Metadata } from "next";

const SITE_NAME = "Babanuj";

const DEFAULT_DESCRIPTION =
  "Shop Middle Eastern sweets online: baklava, maamoul, Turkish delight, Dubai chocolate, dates, honey, coffee, and gift boxes shipped fresh from Houston.";

const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Babanuj Middle Eastern sweets",
};

const MAX_DESCRIPTION_LENGTH = 145;

export function seoTitle(title: string, maxLength = 58) {
  return clampSeoText(cleanText(title), maxLength);
}

export function seoDescription(description?: string, fallback?: string) {
  const cleaned = cleanText(description);
  const fallbackText = cleanText(fallback) || DEFAULT_DESCRIPTION;

  if (!cleaned) {
    return clampSeoText(fallbackText, MAX_DESCRIPTION_LENGTH);
  }

  if (cleaned.length < 110) {
    const expanded =
      fallbackText !== cleaned
        ? `${cleaned} ${fallbackText}`
        : `${cleaned} ${DEFAULT_DESCRIPTION}`;

    return clampSeoText(expanded, MAX_DESCRIPTION_LENGTH);
  }

  return clampSeoText(cleaned, MAX_DESCRIPTION_LENGTH);
}

export function openGraph({
  title,
  description,
  url,
  image,
}: {
  title: string;
  description: string;
  url: string;
  image?: {
    url?: string;
    width?: number;
    height?: number;
    alt?: string | null;
  } | null;
}): NonNullable<Metadata["openGraph"]> {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: image?.url || DEFAULT_OG_IMAGE.url,
        width: image?.width || DEFAULT_OG_IMAGE.width,
        height: image?.height || DEFAULT_OG_IMAGE.height,
        alt: image?.alt || title || DEFAULT_OG_IMAGE.alt,
      },
    ],
  };
}

function cleanText(value?: string | null) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function clampSeoText(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const sliced = value.slice(0, maxLength - 3);
  const lastSpace = sliced.lastIndexOf(" ");
  const trimmed = (lastSpace > 70 ? sliced.slice(0, lastSpace) : sliced).trim();

  return `${trimmed.replace(/[.,;:!?-]+$/g, "")}...`;
}
