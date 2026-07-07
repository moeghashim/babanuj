import {
  getCollections,
  getPolicy,
  getProducts,
  POLICY_HANDLES,
} from "lib/shopify";
import { baseUrl } from "lib/utils";
import { BRANDS } from "lib/babanuj/data";
import { LEGACY_COLLECTION_REDIRECTS } from "lib/babanuj/redirects";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  // Only set when we have a real modification date (Shopify updatedAt).
  // Fabricated request-time lastmod values teach Google to ignore the field.
  lastModified?: string;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap: Route[] = ["", "/search", "/reviews"].map((route) => ({
    url: `${baseUrl}${route}`,
  }));

  const brandRoutes: Route[] = BRANDS.map((b) => ({
    url: `${baseUrl}/brand/${b.id}`,
  }));

  // Only list policies the shop has actually published — /policies/[policy]
  // 404s for the rest (e.g. no shipping policy is configured today).
  const policiesPromise = Promise.all(
    POLICY_HANDLES.map(async (handle) =>
      (await getPolicy(handle))
        ? { url: `${baseUrl}/policies/${handle}` }
        : null,
    ),
  ).then((routes) => routes.filter((route): route is Route => route !== null));

  const collectionsPromise = getCollections().then((collections) =>
    collections
      .filter(
        (collection) =>
          // The synthetic "All" collection points at /search, which is
          // already pinned in routesMap above.
          collection.path !== "/search" &&
          !(collection.handle in LEGACY_COLLECTION_REDIRECTS),
      )
      .map((collection) => ({
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

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, policiesPromise])
    ).flat();
  } catch (error) {
    // Soft-fail in environments without Shopify wired up.
    fetchedRoutes = [];
  }

  return [...routesMap, ...brandRoutes, ...fetchedRoutes];
}
