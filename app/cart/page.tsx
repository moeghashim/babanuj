import { CartView } from "components/babanuj/cart-view";
import { shopifyProductsToBabanuj } from "lib/babanuj/from-shopify";
import { getProducts } from "lib/shopify";

export const metadata = {
  title: "Your bag",
  description: "Review your bag and check out.",
};

export const experimental_ppr = true;

export default async function CartPage() {
  const raw = await getProducts({ sortKey: "BEST_SELLING" }).catch(() => []);
  const recommended = shopifyProductsToBabanuj(raw).slice(0, 4);

  return <CartView recommended={recommended} />;
}
