import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "continent_admin";
export function adminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password ? createHmac("sha256", password).update("continent-links-admin-v1").digest("hex") : null;
}
export function safeEqual(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}
export function isAdmin(request: NextRequest): boolean {
  const token = adminToken();
  const supplied = request.cookies.get(ADMIN_COOKIE)?.value;
  return !!token && !!supplied && safeEqual(token, supplied);
}
