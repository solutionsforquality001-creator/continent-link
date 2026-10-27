"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Layers3, LockKeyhole, LogOut, Package, Search, ShoppingBag } from "lucide-react";
import { formatPrice, type Product } from "@/lib/catalog";

type AdminOrder = { id: number; orderNumber: string; customerName: string; phone: string; address: string; city: string; subtotal: number; createdAt: string; items: { id: number; productName: string; quality: string; quantity: number; unitPrice: number }[] };

export default function AdminPanel({ products: initialProducts, configured }: { products: Product[]; configured: boolean }) {
  const [products, setProducts] = useState(initialProducts);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id || "");
  const [name, setName] = useState(initialProducts[0]?.name || "");
  const [price, setPrice] = useState(String(initialProducts[0]?.price || ""));
  const [image, setImage] = useState(initialProducts[0]?.image || "");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    if (!configured) return;
    fetch("/api/admin/orders").then(async (response) => {
      if (response.ok) { const data = await response.json() as { orders: AdminOrder[] }; setOrders(data.orders); setAuthenticated(true); }
    }).catch(() => {});
  }, [configured]);
  const matches = useMemo(() => products.filter((product) => `${product.name} ${product.brand} ${product.model}`.toLowerCase().includes(query.toLowerCase())).slice(0, 60), [products, query]);
  function choose(product: Product) { setSelectedId(product.id); setName(product.name); setPrice(String(product.price)); setImage(product.image); setMessage(""); setError(""); }
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not sign in.");
      setAuthenticated(true); setPassword("");
      const orderResponse = await fetch("/api/admin/orders");
      if (orderResponse.ok) setOrders(((await orderResponse.json()) as { orders: AdminOrder[] }).orders);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not sign in."); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: selectedId, name, price: Number(price), image }) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not save your changes.");
      setProducts((current) => current.map((product) => product.id === selectedId ? { ...product, name: name.trim(), price: Number(price), image: image.trim() } : product));
      setMessage("Product updated. Changes are now live in your store.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save your changes."); }
    finally { setSaving(false); }
  }
  async function logout() { await fetch("/api/admin/login", { method: "DELETE" }); setAuthenticated(false); setOrders([]); }

  return <div className="admin-page"><header className="admin-header"><Link href="/" className="brand-logo"><span className="logo-icon"><Layers3 size={23} /></span><span className="logo-words"><strong>CONTINENT<span>LINKS</span></strong><small>STORE OWNER</small></span></Link><Link className="admin-back" href="/"><ArrowLeft size={16} /> Back to store</Link></header>{!authenticated ? <main className="admin-login"><span className="admin-login-icon"><LockKeyhole size={28} /></span><div className="kicker centered-kicker"><span /> STORE OWNER</div><h1>Welcome back<span className="heading-dot">.</span></h1><p>Sign in to update your catalog and view orders.</p>{!configured && <div className="admin-notice"><strong>Owner access is not configured yet.</strong><br />Set <code>ADMIN_PASSWORD</code> in your server environment and restart the app to enable the editor.</div>}<form onSubmit={login}><label>Owner password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-orange" disabled={!configured}>Sign in <ArrowLeft className="rotate-arrow" size={17} /></button></form></main> : <main className="admin-content"><div className="admin-title"><div><div className="kicker"><span /> STORE MANAGEMENT</div><h1>Welcome, store owner<span className="heading-dot">.</span></h1><p>Manage your example listings and keep an eye on orders.</p></div><button className="admin-logout" onClick={logout}><LogOut size={16} /> Sign out</button></div><div className="admin-tabs"><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><Package size={17} /> Catalog editor</button><button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}><ShoppingBag size={17} /> Orders ({orders.length})</button></div>{tab === "products" ? <div className="admin-grid"><section className="admin-list"><div className="admin-list-head"><h2>Products <small>{products.length.toLocaleString()} listings</small></h2><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." /></label></div><div className="admin-results">{matches.map((product) => <button className={selectedId === product.id ? "active" : ""} key={product.id} onClick={() => choose(product)}><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.brand} · {formatPrice(product.price)}</small></span></button>)}{!matches.length && <p>No products found.</p>}</div><p className="admin-list-foot">Showing up to 60 results. Search to find a specific model.</p></section><section className="admin-edit"><div className="admin-edit-head"><div><h2>Edit product</h2><p>Change the name, base price or image URL.</p></div><img src={image} alt="Product preview" onError={(event) => { event.currentTarget.style.opacity = "0.2"; }} onLoad={(event) => { event.currentTarget.style.opacity = "1"; }} /></div><form onSubmit={save}><label>Product name<input required maxLength={180} value={name} onChange={(event) => setName(event.target.value)} /></label><label>Starting price (₦)<input required type="number" min="100" max="5000000" step="1" value={price} onChange={(event) => setPrice(event.target.value)} /></label><label>Image URL or local path<input required value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://... or /images/..." /><small>Use an https image URL or an image in the public/images folder.</small></label><div className="admin-notice">Quality prices are calculated from this starting price. Confirm product compatibility and availability with customers.</div>{message && <p className="form-success"><CheckCircle2 size={17} /> {message}</p>}{error && <p className="form-error">{error}</p>}<button className="button button-orange" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></form></section></div> : <section className="admin-orders"><h2>Recent orders</h2><p>Orders are also sent to you by customers through WhatsApp.</p>{orders.length ? orders.map((order) => <article key={order.id}><div className="admin-order-head"><div><strong>{order.orderNumber}</strong><small>{new Date(order.createdAt).toLocaleString("en-NG")}</small></div><b>{formatPrice(order.subtotal)}</b></div><p><strong>{order.customerName}</strong> · {order.phone}<br />{order.address}, {order.city}</p>{order.items.map((item) => <div className="admin-order-item" key={item.id}>{item.productName} · {item.quality} × {item.quantity}<strong>{formatPrice(item.unitPrice * item.quantity)}</strong></div>)}</article>) : <div className="empty-state"><ShoppingBag size={30} /><h3>No orders yet</h3><p>New orders will appear here after checkout.</p></div>}</section>}</main>}</div>;
}
