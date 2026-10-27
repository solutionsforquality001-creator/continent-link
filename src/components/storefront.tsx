"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, Check, CheckCircle2, ChevronDown,
  ChevronRight, CircleHelp, Grid2X2, Headphones, Heart, Layers3, Menu, MessageCircle,
  Minus, PackageCheck, Phone, Plus, Search, ShieldCheck, ShoppingBag, Smartphone,
  Sparkles, Trash2, Truck, X,
} from "lucide-react";
import { brands, formatPrice, qualities, qualityPrice, type CartItem, type Product, type Quality } from "@/lib/catalog";

const WHATSAPP = "https://wa.me/2348134514983";
const featuredBrands = [
  { name: "Apple", label: "iPhone", mark: "apple", className: "apple" },
  { name: "Samsung", label: "Galaxy", mark: "S", className: "samsung" },
  { name: "Infinix", label: "Infinix phones", mark: "in", className: "infinix" },
  { name: "Tecno", label: "TECNO phones", mark: "T", className: "tecno" },
  { name: "itel", label: "itel phones", mark: "it", className: "itel" },
  { name: "Xiaomi", label: "Redmi & Mi", mark: "mi", className: "xiaomi" },
];

type CatalogFilter = { brand?: string; category?: string; favorites?: boolean; search?: string };
type OrderResult = { orderNumber: string; subtotal: number; whatsappUrl: string };

export default function Storefront({ products, checkout = false }: { products: Product[]; checkout?: boolean }) {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All brands");
  const [category, setCategory] = useState("All parts");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [showCount, setShowCount] = useState(8);
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<Quality | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customerName: "", phone: "", email: "", address: "", city: "", notes: "" });

  useEffect(() => {
    try {
      const savedCart: unknown = JSON.parse(localStorage.getItem("continent-cart") || "[]");
      const savedFavorites: unknown = JSON.parse(localStorage.getItem("continent-favorites") || "[]");
      const ids = new Set(products.map((product) => product.id));
      if (Array.isArray(savedCart)) setCart(savedCart.filter((item): item is CartItem => !!item && typeof item.productId === "string" && ids.has(item.productId) && qualities.some((quality) => quality.name === item.quality) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99));
      if (Array.isArray(savedFavorites)) setFavorites(savedFavorites.filter((id): id is string => typeof id === "string" && ids.has(id)));
    } catch { /* Start with an empty cart if browser storage is unavailable. */ }
    if (!checkout) {
      const params = new URLSearchParams(window.location.search);
      const requestedBrand = params.get("brand");
      const requestedCategory = params.get("category");
      if (requestedBrand && brands.includes(requestedBrand)) setBrand(requestedBrand);
      if (requestedCategory && ["Screen", "Touch Pad"].includes(requestedCategory)) setCategory(requestedCategory);
      if (params.get("favorites") === "1") setFavoritesOnly(true);
      if (params.get("q")) setSearch(params.get("q") || "");
    }
    setReady(true);
  }, [checkout, products]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("continent-cart", JSON.stringify(cart));
      localStorage.setItem("continent-favorites", JSON.stringify(favorites));
    } catch { /* The store remains usable for the current session. */ }
  }, [cart, favorites, ready]);

  useEffect(() => {
    if (!cartOpen && !selected && !menuOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setSelected(null); setCartOpen(false); setMenuOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, selected, menuOpen]);

  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const cartDetails = cart.flatMap((item) => {
    const product = productMap.get(item.productId);
    return product ? [{ ...item, product, unitPrice: qualityPrice(product.price, item.quality) }] : [];
  });
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartDetails.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = products.filter((product) =>
      (!query || `${product.name} ${product.brand} ${product.model} ${product.category}`.toLowerCase().includes(query)) &&
      (brand === "All brands" || product.brand === brand) &&
      (category === "All parts" || product.category === category) &&
      (!favoritesOnly || favorites.includes(product.id))
    );
    if (sort === "low") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, brand, category, favoritesOnly, favorites, sort]);

  function goCatalog(filter: CatalogFilter = {}) {
    setMenuOpen(false);
    if (checkout) {
      const params = new URLSearchParams();
      if (filter.brand) params.set("brand", filter.brand);
      if (filter.category) params.set("category", filter.category);
      if (filter.favorites) params.set("favorites", "1");
      if (filter.search) params.set("q", filter.search);
      window.location.href = `/${params.toString() ? `?${params}` : ""}#catalog`;
      return;
    }
    setBrand(filter.brand || "All brands");
    setCategory(filter.category || "All parts");
    setFavoritesOnly(!!filter.favorites);
    setSearch(filter.search || "");
    setShowCount(8);
    window.setTimeout(() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  }
  function openProduct(product: Product) { setSelected(product); setSelectedQuality(null); setQuantity(1); }
  function toggleFavorite(id: string) { setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function addToCart() {
    if (!selected || !selectedQuality) return;
    setCart((current) => {
      const exists = current.some((item) => item.productId === selected.id && item.quality === selectedQuality);
      return exists ? current.map((item) => item.productId === selected.id && item.quality === selectedQuality ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item) : [...current, { productId: selected.id, quality: selectedQuality, quantity }];
    });
    setSelected(null);
    setCartOpen(true);
  }
  function changeQuantity(item: CartItem, amount: number) {
    setCart((current) => current.map((entry) => entry.productId === item.productId && entry.quality === item.quality ? { ...entry, quantity: Math.max(1, Math.min(99, entry.quantity + amount)) } : entry));
  }
  function removeItem(item: CartItem) { setCart((current) => current.filter((entry) => !(entry.productId === item.productId && entry.quality === item.quality))); }
  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length || submitting) return;
    setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items: cart }) });
      const result = await response.json() as OrderResult & { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to place your order.");
      setOrderResult(result);
      setCart([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="site-shell">
      <div className="top-strip"><div className="container top-inner"><span><Sparkles size={13} /> YOUR TRUSTED PHONE PARTS PARTNER</span><div><span>Need help finding a part?</span><a href="tel:+2348134514983"><Phone size={13} /> 0813 451 4983</a><a href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={13} /> Chat with us</a></div></div></div>
      <header className="main-header">
        <div className="container header-inner">
          <Link href="/" className="brand-logo" aria-label="Continent Links home"><span className="logo-icon"><Layers3 size={25} strokeWidth={2.3} /></span><span className="logo-words"><strong>CONTINENT<span>LINKS</span></strong><small>PHONE PARTS & ACCESSORIES</small></span></Link>
          <form className="search-box" onSubmit={(event) => { event.preventDefault(); goCatalog({ search }); }}><Search size={19} /><input aria-label="Search products" value={search} onChange={(event) => { setSearch(event.target.value); setShowCount(8); }} placeholder="Search by phone model, brand or part..." /><button type="submit" aria-label="Search"><ArrowRight size={19} /></button></form>
          <div className="header-actions">
            <button className="header-action saved-action" onClick={() => goCatalog({ favorites: true })} aria-label={`Saved items, ${favorites.length}`}><span className="action-icon"><Heart size={22} />{favorites.length > 0 && <i>{favorites.length}</i>}</span><span><small>YOUR</small><strong>Wishlist</strong></span></button>
            <button className="header-action" onClick={() => setCartOpen(true)} aria-label={`Shopping cart, ${cartCount} items`}><span className="action-icon"><ShoppingBag size={22} /><i>{cartCount}</i></span><span><small>YOUR CART</small><strong>{formatPrice(subtotal)}</strong></span></button>
            <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        <nav className={`nav-bar ${menuOpen ? "nav-open" : ""}`}><div className="container nav-inner">
          <button className="all-products" onClick={() => goCatalog()}><Grid2X2 size={17} /> Shop all products <ChevronDown size={15} /></button>
          <button onClick={() => goCatalog({ category: "Screen" })}>Phone Screens</button>
          <button onClick={() => goCatalog({ category: "Touch Pad" })}>Touch Pads</button>
          <button onClick={() => goCatalog()}>Shop by Brand</button>
          <a href={checkout ? "/#about" : "#about"}>About Us</a>
          <a href={checkout ? "/#contact" : "#contact"}>Contact</a>
          <span className="nav-promise"><Truck size={16} /> Delivering across Nigeria <ArrowRight size={15} /></span>
        </div></nav>
      </header>

      {!checkout ? <main>
        <section className="hero"><div className="hero-photo" /><div className="container hero-inner"><div className="hero-copy"><div className="hero-eyebrow"><span /> WELCOME TO CONTINENT LINKS</div><h1>Better screens.<br /><em>Brighter</em> possibilities.</h1><p>From cracked to crystal clear. Find the right phone screens and touch pads for every repair, all in one place.</p><div className="hero-buttons"><button className="button button-orange" onClick={() => goCatalog()}>Explore our catalog <ArrowRight size={18} /></button><a className="hero-chat" href={WHATSAPP} target="_blank" rel="noreferrer"><span><MessageCircle size={18} /></span><span><small>NEED A HAND?</small><strong>Chat with an expert</strong></span></a></div><div className="hero-footnote"><span className="hero-dots"><i /><i /><i /></span> GREAT PARTS. BETTER REPAIRS.</div></div><div className="hero-float"><span className="float-icon"><BadgeCheck size={22} /></span><div><strong>Made for a better fix.</strong><small>Quality parts, countless possibilities.</small></div></div></div><div className="hero-index"><span>01</span><i /><span>03</span></div></section>
        <section className="benefits"><div className="container benefit-grid"><div className="benefit"><span><ShieldCheck /></span><div><strong>Quality you can trust</strong><small>Parts for every kind of repair</small></div></div><div className="benefit"><span><Truck /></span><div><strong>Nationwide delivery</strong><small>Bringing parts closer to you</small></div></div><div className="benefit"><span><Smartphone /></span><div><strong>All your favorite brands</strong><small>Find the perfect fit for your phone</small></div></div><div className="benefit"><span><Headphones /></span><div><strong>Here to help</strong><small>Friendly support on WhatsApp</small></div></div></div></section>
        <section className="brand-section container" id="brands"><div className="section-heading brand-heading"><div><div className="kicker"><span /> FIND YOUR PERFECT FIT</div><h2>Shop by brand<span className="heading-dot">.</span></h2><p>Find the right part for the phone you love.</p></div><button className="text-link" onClick={() => goCatalog()}>View all brands <ArrowRight size={17} /></button></div><div className="brand-grid">{featuredBrands.map((item) => <button className="brand-card" key={item.name} onClick={() => goCatalog({ brand: item.name })}><span className={`brand-mark ${item.className}`}>{item.mark === "apple" ? <Smartphone size={23} /> : item.mark}</span><span className="brand-card-label"><strong>{item.name === "Apple" ? "iPhone" : item.name}</strong><small>{item.label}</small></span><ArrowUpRight className="brand-arrow" size={16} /></button>)}</div></section>
        <section className="catalog-section" id="catalog"><div className="container"><div className="section-heading catalog-heading"><div><div className="kicker"><span /> THE RIGHT PARTS, RIGHT HERE</div><h2>{favoritesOnly ? "Your saved parts" : "Explore our catalog"}<span className="heading-dot">.</span></h2><p>{favoritesOnly ? "All the parts you’ve saved for later." : "Good as new starts with the right screen."}</p></div><div className="catalog-filter-pills"><button className={category === "All parts" ? "active" : ""} onClick={() => { setCategory("All parts"); setShowCount(8); }}>All parts</button><button className={category === "Screen" ? "active" : ""} onClick={() => { setCategory("Screen"); setShowCount(8); }}>Phone screens</button><button className={category === "Touch Pad" ? "active" : ""} onClick={() => { setCategory("Touch Pad"); setShowCount(8); }}>Touch pads</button></div></div>
          <div className="catalog-toolbar"><div><strong>{filtered.length.toLocaleString()} parts</strong><span>{brand !== "All brands" ? ` for ${brand}` : " to explore"}{search ? ` matching “${search}”` : ""}</span>{favoritesOnly && <button className="clear-filter" onClick={() => setFavoritesOnly(false)}>Clear saved filter <X size={13} /></button>}</div><div className="toolbar-selects"><label><span>Brand:</span><select aria-label="Filter by brand" value={brand} onChange={(event) => { setBrand(event.target.value); setShowCount(8); }}><option>All brands</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Sort:</span><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div></div>
          {filtered.length ? <><div className="product-grid">{filtered.slice(0, showCount).map((product) => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={() => toggleFavorite(product.id)} onOpen={() => openProduct(product)} />)}</div>{showCount < filtered.length && <div className="load-more"><button className="button button-outline" onClick={() => setShowCount((count) => count + 12)}>Discover more parts <ArrowDown size={17} /></button><small>Showing {Math.min(showCount, filtered.length)} of {filtered.length.toLocaleString()} products</small></div>}</> : <div className="empty-state"><Search size={30} /><h3>{favoritesOnly ? "Nothing saved just yet" : "We couldn't find that part"}</h3><p>{favoritesOnly ? "Tap the heart on a product to keep it here for later." : "Try another model or brand, or ask us for help finding it."}</p><button className="button button-dark" onClick={() => goCatalog()}>Browse all parts <ArrowRight size={16} /></button></div>}
          <p className="sample-note"><CircleHelp size={15} /> Images and prices are examples. Please confirm availability and final pricing with our team.</p>
        </div></section>
        <section className="help-banner container" id="about"><div className="help-banner-copy"><div className="kicker light-kicker"><span /> WE’VE GOT YOU COVERED</div><h2>The little parts that<br />make a <em>big difference.</em></h2><p>Whether you’re a repair professional or fixing a favorite phone, Continent Links is here to help you find the right fit.</p><a href={WHATSAPP} className="button button-orange" target="_blank" rel="noreferrer">Talk to our team <ArrowRight size={17} /></a></div><div className="help-banner-art"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><span><Smartphone size={62} strokeWidth={1.2} /></span><div><BadgeCheck size={21} /> PARTS FOR EVERY REPAIR</div></div></section>
      </main> : <main className="checkout-main container">
        {orderResult ? <div className="order-success"><span className="success-icon"><CheckCircle2 size={42} /></span><div className="kicker centered-kicker"><span /> ORDER RECEIVED</div><h1>Thank you for your order<span className="heading-dot">.</span></h1><p>Your order <strong>{orderResult.orderNumber}</strong> has been saved. Send it to our team on WhatsApp so we can confirm availability, delivery and payment.</p><a className="button button-orange" href={orderResult.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Send order on WhatsApp <ArrowRight size={17} /></a><Link className="text-link" href="/">Continue shopping <ArrowRight size={16} /></Link></div> : <><div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={14} /><span>Checkout</span></div><div className="checkout-title"><div className="kicker"><span /> ALMOST THERE</div><h1>Let’s get your parts to you<span className="heading-dot">.</span></h1><p>Review your selections, then tell us where to send them.</p></div>{!ready ? <div className="empty-state">Loading your cart…</div> : cartDetails.length === 0 ? <div className="empty-state checkout-empty"><ShoppingBag size={36} /><h3>Your cart is empty</h3><p>Choose your parts and quality before continuing to checkout.</p><Link className="button button-dark" href="/#catalog">Explore the catalog <ArrowRight size={16} /></Link></div> : <form className="checkout-layout" onSubmit={submitOrder}><div className="checkout-form"><div className="checkout-block"><div className="block-heading"><span>01</span><div><h2>Contact details</h2><p>So we can get in touch about your order.</p></div></div><div className="form-grid"><label>Full name <b>*</b><input required minLength={2} value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Your full name" /></label><label>Phone number <b>*</b><input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="0800 000 0000" /></label><label className="wide">Email address <span>(optional)</span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label></div></div><div className="checkout-block"><div className="block-heading"><span>02</span><div><h2>Delivery details</h2><p>Where should we send your parts?</p></div></div><div className="form-grid"><label className="wide">Delivery address <b>*</b><input required minLength={5} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Street address" /></label><label className="wide">City / State <b>*</b><input required minLength={2} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="e.g. Ikeja, Lagos" /></label><label className="wide">Order notes <span>(optional)</span><textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Anything else we should know?" rows={3} /></label></div></div></div><aside className="order-summary"><div className="summary-head"><h2>Your order</h2><button type="button" onClick={() => setCartOpen(true)}>Edit cart</button></div><div className="summary-items">{cartDetails.map((item) => <div className="summary-item" key={`${item.productId}-${item.quality}`}><div className="summary-image"><img src={item.product.image} alt="" /><span>{item.quantity}</span></div><div><strong>{item.product.name}</strong><small>Quality: {item.quality}</small></div><b>{formatPrice(item.unitPrice * item.quantity)}</b></div>)}</div><div className="summary-line"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="summary-line"><span>Delivery</span><span>To be confirmed</span></div><div className="summary-total"><span>Estimated total</span><strong>{formatPrice(subtotal)}</strong></div><p className="summary-disclaimer">Availability, final pricing and delivery will be confirmed with our team. No payment is collected here.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-orange order-button" type="submit" disabled={submitting}>{submitting ? "Placing order…" : "Place order"}<ArrowRight size={18} /></button><div className="secure-note"><ShieldCheck size={15} /> Your details are used to process this order.</div></aside></form>}</>}
      </main>}

      <footer className="footer" id="contact"><div className="container"><div className="footer-top"><div className="footer-about"><Link href="/" className="brand-logo footer-logo"><span className="logo-icon"><Layers3 size={25} /></span><span className="logo-words"><strong>CONTINENT<span>LINKS</span></strong><small>PHONE PARTS & ACCESSORIES</small></span></Link><p>The right parts for a brighter screen. Your destination for phone screens and touch pads in Nigeria.</p><a className="footer-chat" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Let’s chat on WhatsApp <ArrowUpRight size={15} /></a></div><div><h3>SHOP</h3><button onClick={() => goCatalog()}>All products</button><button onClick={() => goCatalog({ category: "Screen" })}>Phone screens</button><button onClick={() => goCatalog({ category: "Touch Pad" })}>Touch pads</button><button onClick={() => goCatalog({ favorites: true })}>My wishlist</button></div><div><h3>EXPLORE</h3><button onClick={() => goCatalog({ brand: "Apple" })}>iPhone</button><button onClick={() => goCatalog({ brand: "Samsung" })}>Samsung</button><button onClick={() => goCatalog({ brand: "Infinix" })}>Infinix</button><button onClick={() => goCatalog({ brand: "Tecno" })}>TECNO</button></div><div><h3>GET IN TOUCH</h3><p>We’re here to help you find the right part.</p><a href="tel:+2348134514983"><Phone size={15} /> 0813 451 4983</a><a href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={15} /> +234 813 451 4983</a><span>Nigeria</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Continent Links. All rights reserved.</span><span>Made for better repairs. <Link href="/admin">Store owner</Link></span></div></div></footer>
      <a className="whatsapp-float" href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={23} /><span>Need help? <strong>Chat with us</strong></span></a>

      {selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="product-modal" role="dialog" aria-modal="true" aria-label={`Choose options for ${selected.name}`} onMouseDown={(event) => event.stopPropagation()}><button className="close-button modal-close" onClick={() => setSelected(null)} aria-label="Close"><X size={21} /></button><div className="modal-image"><img src={selected.image} alt={selected.name} /><span className="modal-image-label"><ShieldCheck size={16} /> FIND YOUR PERFECT FIT</span></div><div className="modal-content"><div className="product-eyebrow">{selected.brand} <span>·</span> {selected.category}</div><h2>{selected.name}</h2><p className="modal-model">Compatible model: <strong>{selected.model}</strong></p><div className="modal-price">{formatPrice(selectedQuality ? qualityPrice(selected.price, selectedQuality) : selected.price)} <small>{selectedQuality ? "" : "starting price"}</small></div><p className="modal-intro">Choose the quality and quantity you need. Our team will confirm the right fit and availability with you.</p><div className="option-heading">Select quality <span>Required</span></div><div className="quality-options">{qualities.map((quality) => <button key={quality.name} className={selectedQuality === quality.name ? "selected" : ""} onClick={() => setSelectedQuality(quality.name)}><span className="option-radio">{selectedQuality === quality.name && <Check size={12} />}</span><span><strong>{quality.name}</strong><small>{quality.description}</small></span><b>{formatPrice(qualityPrice(selected.price, quality.name))}</b></button>)}</div><div className="modal-bottom"><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(99, quantity + 1))} aria-label="Increase quantity"><Plus size={15} /></button></div><button className="button button-orange add-cart" onClick={addToCart} disabled={!selectedQuality}><ShoppingBag size={18} /> Add to cart <ArrowRight size={16} /></button></div><small className="modal-note"><ShieldCheck size={14} /> Sample pricing; confirm before purchase.</small></div></div></div>}
      {cartOpen && <div className="drawer-backdrop" onMouseDown={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" onMouseDown={(event) => event.stopPropagation()}><div className="drawer-head"><div><div className="kicker"><span /> YOUR SELECTION</div><h2>Shopping cart <small>({cartCount})</small></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={22} /></button></div>{cartDetails.length ? <><div className="drawer-items">{cartDetails.map((item) => <div className="drawer-item" key={`${item.productId}-${item.quality}`}><div className="drawer-image"><img src={item.product.image} alt="" /></div><div className="drawer-item-info"><strong>{item.product.name}</strong><small>Quality: {item.quality}</small><b>{formatPrice(item.unitPrice)}</b><div className="drawer-item-bottom"><div className="quantity-control small-quantity"><button onClick={() => changeQuantity(item, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item, 1)} aria-label="Increase quantity"><Plus size={13} /></button></div><button className="remove-item" onClick={() => removeItem(item)} aria-label={`Remove ${item.product.name}`}><Trash2 size={16} /> Remove</button></div></div></div>)}</div><div className="drawer-footer"><div className="drawer-subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Delivery and availability are confirmed after checkout.</p><Link className="button button-orange checkout-button" href="/checkout" onClick={() => setCartOpen(false)}>Continue to checkout <ArrowRight size={18} /></Link><button className="continue-shopping" onClick={() => { setCartOpen(false); if (checkout) goCatalog(); }}>Continue shopping</button></div></> : <div className="drawer-empty"><span><ShoppingBag size={32} /></span><h3>Your cart is looking a little empty.</h3><p>Find your part, choose its quality and add it here.</p><button className="button button-dark" onClick={() => { setCartOpen(false); goCatalog(); }}>Explore the catalog <ArrowRight size={16} /></button></div>}</aside></div>}
    </div>
  );
}

function ProductCard({ product, favorite, onFavorite, onOpen }: { product: Product; favorite: boolean; onFavorite: () => void; onOpen: () => void }) {
  return <article className="product-card"><div className="product-image"><button className="product-image-button" onClick={onOpen} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" /></button>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button ${favorite ? "is-favorite" : ""}`} onClick={onFavorite} aria-label={favorite ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}><Heart size={19} fill={favorite ? "currentColor" : "none"} /></button><button className="quick-add" onClick={onOpen} aria-label={`Choose options for ${product.name}`}><Plus size={19} /></button></div><div className="product-info"><div className="product-eyebrow">{product.brand} <span>·</span> {product.category}</div><h3><button onClick={onOpen}>{product.name}</button></h3><p><CheckCircle2 size={14} /> Quality options available</p><div className="product-bottom"><div><small>FROM</small><strong>{formatPrice(product.price)}</strong></div><button onClick={onOpen}>Choose options <ArrowRight size={15} /></button></div></div></article>;
}
