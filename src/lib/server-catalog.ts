import { db } from "@/db";
import { productOverrides } from "@/db/schema";
import { catalog, type Product } from "@/lib/catalog";

export async function getProducts(): Promise<Product[]> {
  const overrides = await db.select().from(productOverrides);
  const byId = new Map(overrides.map((item) => [item.productId, item]));
  return catalog.map((product) => {
    const edit = byId.get(product.id);
    return edit ? { ...product, name: edit.name, price: edit.price, image: edit.image } : product;
  });
}
