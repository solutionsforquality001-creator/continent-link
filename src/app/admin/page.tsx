import AdminPanel from "@/components/admin-panel";
import { getProducts } from "@/lib/server-catalog";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return <AdminPanel products={await getProducts()} configured={Boolean(process.env.ADMIN_PASSWORD)} />;
}
