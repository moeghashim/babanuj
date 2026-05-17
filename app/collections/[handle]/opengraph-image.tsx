import OpengraphImage from "components/opengraph-image";
import { getCollection } from "lib/shopify";

export default async function Image({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  const title = collection?.seo?.title || collection?.title || "Babanuj";

  return await OpengraphImage({ title });
}
