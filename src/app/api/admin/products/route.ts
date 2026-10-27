import { NextRequest } from "next/server";
import { db } from "@/db";
import { productOverrides } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { catalog } from "@/lib/catalog";

export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return Response.json({ error: "Please sign in as the store owner." }, { status: 401 });
  try {
    const body = await request.json() as { productId?: unknown; name?: unknown; price?: unknown; image?: unknown };
    if (typeof body.productId !== "string" || !catalog.some((product) => product.id === body.productId) || typeof body.name !== "string" || body.name.trim().length < 3 || body.name.length > 180 || typeof body.price !== "number" || !Number.isInteger(body.price) || body.price < 100 || body.price > 5_000_000 || typeof body.image !== "string" || body.image.length > 1000 || !/^(https?:\/\/|\/images\/)/i.test(body.image)) {
      return Response.json({ error: "Enter a valid name, price and image URL." }, { status: 400 });
    }
    const values = { productId: body.productId, name: body.name.trim(), price: body.price, image: body.image.trim(), updatedAt: new Date() };
    await db.insert(productOverrides).values(values).onConflictDoUpdate({ target: productOverrides.productId, set: values });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not save this product." }, { status: 500 });
  }
}
