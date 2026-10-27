import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const productOverrides = pgTable("product_overrides", {
  productId: text("product_id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  notes: text("notes"),
  subtotal: integer("subtotal").notNull(),
  status: text("status").notNull().default("New"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  quality: text("quality").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
});
