import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Prose from "components/prose";
import { getPolicy } from "lib/shopify";

export async function generateMetadata(props: {
  params: Promise<{ policy: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const policy = await getPolicy(params.policy);

  if (!policy) return notFound();

  return {
    title: policy.title,
    openGraph: {
      type: "article",
    },
  };
}

export default async function PolicyPage(props: {
  params: Promise<{ policy: string }>;
}) {
  const params = await props.params;
  const policy = await getPolicy(params.policy);

  if (!policy) return notFound();

  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">{policy.title}</h1>
      <Prose className="mb-8" html={policy.body} />
    </>
  );
}
