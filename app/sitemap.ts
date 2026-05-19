import { getCollections, getProducts } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { BRANDS } from "lib/babanuj/data";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap: Route[] = ["", "/privacy-policy"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt,
    })),
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt,
    })),
  );

  const brandRoutes: Route[] = BRANDS.map((b) => ({
    url: `${baseUrl}/brand/${b.id}`,
    lastModified: new Date().toISOString(),
  }));

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise])
    ).flat();
  } catch (error) {
    // Soft-fail in environments without Shopify wired up.
    fetchedRoutes = [];
  }

  return [...routesMap, ...brandRoutes, ...fetchedRoutes];
}
