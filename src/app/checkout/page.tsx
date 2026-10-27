import Storefront from "@/components/storefront";
import { getProducts } from "@/lib/server-catalog";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const products = await getProducts();
  return <Storefront products={products} checkout />;
}
