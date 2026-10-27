import { desc, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) return Response.json({ error: "Please sign in as the store owner." }, { status: 401 });
  const recent = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);
  const items = recent.length ? await db.select().from(orderItems).where(inArray(orderItems.orderId, recent.map((order) => order.id))) : [];
  return Response.json({ orders: recent.map((order) => ({ ...order, items: items.filter((item) => item.orderId === order.id) })) });
}
