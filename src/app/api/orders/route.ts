import { randomUUID } from "node:crypto";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatPrice, qualities, qualityPrice, type CartItem } from "@/lib/catalog";
import { getProducts } from "@/lib/server-catalog";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { customerName?: unknown; phone?: unknown; email?: unknown; address?: unknown; city?: unknown; notes?: unknown; items?: unknown };
    const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
    const customerName = clean(body.customerName, 120);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160);
    const address = clean(body.address, 300);
    const city = clean(body.city, 120);
    const notes = clean(body.notes, 500);
    if (customerName.length < 2 || !/^[+\d\s()\-]{7,40}$/.test(phone) || address.length < 5 || city.length < 2 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return Response.json({ error: "Please enter your name, a valid phone number, delivery address and city." }, { status: 400 });
    }
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 100) {
      return Response.json({ error: "Your cart is empty or contains too many items." }, { status: 400 });
    }
    const products = await getProducts();
    const indexed = new Map(products.map((product) => [product.id, product]));
    const requested = body.items as CartItem[];
    const resolved = requested.map((item) => {
      if (!item || typeof item.productId !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || !qualities.some((quality) => quality.name === item.quality)) return null;
      const product = indexed.get(item.productId);
      if (!product) return null;
      return { product, quality: item.quality, quantity: item.quantity, unitPrice: qualityPrice(product.price, item.quality) };
    });
    if (resolved.some((item) => !item)) return Response.json({ error: "A cart item is invalid. Please review your selections." }, { status: 400 });
    const valid = resolved.filter((item): item is NonNullable<typeof item> => item !== null);
    const subtotal = valid.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (!Number.isSafeInteger(subtotal) || subtotal > 2_000_000_000) return Response.json({ error: "Order total is too large." }, { status: 400 });
    const orderNumber = `CL-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
    await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values({ orderNumber, customerName, phone, email: email || null, address, city, notes: notes || null, subtotal }).returning({ id: orders.id });
      await tx.insert(orderItems).values(valid.map((item) => ({ orderId: order.id, productId: item.product.id, productName: item.product.name, quality: item.quality, quantity: item.quantity, unitPrice: item.unitPrice })));
    });
    const message = [
      `Hello Continent Links! I'd like to confirm order ${orderNumber}.`, "",
      ...valid.map((item) => `• ${item.product.name} — ${item.quality} × ${item.quantity}: ${formatPrice(item.unitPrice * item.quantity)}`),
      "", `Subtotal: ${formatPrice(subtotal)}`, `Name: ${customerName}`, `Phone: ${phone}`,
      `Delivery: ${address}, ${city}`, ...(notes ? [`Notes: ${notes}`] : []), "", "Please confirm availability and delivery. Thank you!",
    ].join("\n");
    return Response.json({ orderNumber, subtotal, whatsappUrl: `https://wa.me/2348134514983?text=${encodeURIComponent(message)}` });
  } catch (error) {
    console.error("Order error:", error);
    return Response.json({ error: "We couldn't place your order. Please try again or contact us on WhatsApp." }, { status: 500 });
  }
}
