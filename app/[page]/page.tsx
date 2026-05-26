import type { Metadata } from "next";

import Prose from "components/prose";
import { openGraph, seoDescription } from "lib/babanuj/seo";
import { getPage } from "lib/shopify";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();
  const description = seoDescription(page.seo?.description, page.bodySummary);

  return {
    title: page.seo?.title || page.title,
    description,
    alternates: {
      canonical: `/${params.page}`,
    },
    openGraph: {
      ...openGraph({
        title: `${page.seo?.title || page.title} | Babanuj`,
        description,
        url: `/${params.page}`,
      }),
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ page: string }>;
}) {
  const params = await props.params;
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
      <Prose className="mb-8" html={page.body} />
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        ).format(new Date(page.updatedAt))}.`}
      </p>
    </>
  );
}
