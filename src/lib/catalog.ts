export type Category = "Screen" | "Touch Pad";
export type Quality = "Standard" | "High quality" | "Premium";
export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: Category;
  price: number;
  image: string;
  badge?: string;
  featured?: boolean;
};
export type CartItem = { productId: string; quality: Quality; quantity: number };

export const qualities: { name: Quality; description: string; multiplier: number }[] = [
  { name: "Standard", description: "A dependable everyday option", multiplier: 1 },
  { name: "High quality", description: "An upgraded finish and feel", multiplier: 1.25 },
  { name: "Premium", description: "Our highest-grade option", multiplier: 1.5 },
];
export const qualityPrice = (price: number, quality: Quality) =>
  Math.round((price * (qualities.find((item) => item.name === quality)?.multiplier ?? 1)) / 100) * 100;
export const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;
export const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const featured: Product[] = [
  { id: "featured-jk-13-pro", name: "JK Soft OLED Screen for iPhone 13 Pro", brand: "Apple", model: "iPhone 13 Pro", category: "Screen", price: 92100, image: "/images/product-iphone.jpg", badge: "FEATURED", featured: true },
  { id: "featured-samsung-a54", name: "Samsung Galaxy A54 Display Screen", brand: "Samsung", model: "Galaxy A54", category: "Screen", price: 32500, image: "/images/product-samsung.jpg", badge: "TOP PICK", featured: true },
  { id: "featured-infinix-hot-12", name: "Infinix Hot 12 LCD Screen Assembly", brand: "Infinix", model: "Hot 12", category: "Screen", price: 18500, image: "/images/product-android.jpg", badge: "GREAT VALUE", featured: true },
  { id: "featured-tecno-camon-20", name: "TECNO Camon 20 Touch Pad Digitizer", brand: "Tecno", model: "Camon 20", category: "Touch Pad", price: 10500, image: "/images/product-touch.jpg", badge: "TOP PICK", featured: true },
];

// Starting listings and prices are examples, ready for the store owner to edit.
const jkEntries: [string, string, number][] = [
  ["Soft OLED LCD", "iPhone 12 Pro Max", 80000], ["Soft OLED LCD", "iPhone XS Max", 62500],
  ["Soft OLED LCD", "iPhone 17 Pro Max", 117900], ["Soft OLED LCD", "iPhone 16 Pro Max", 93100],
  ["Soft OLED LCD", "iPhone 14 Pro Max", 71600], ["Soft OLED LCD", "iPhone 13 Pro Max", 72900],
  ["Soft OLED LCD", "iPhone 15 Pro Max", 71600], ["Hard OLED", "iPhone 16 Plus", 62500],
  ["Hard OLED", "iPhone 16", 64200], ["Hard OLED", "iPhone 15 Plus", 62500],
  ["Hard OLED", "iPhone 15", 64200], ["Incell LCD", "iPhone 16 Pro Max", 53400],
  ["Incell LCD", "iPhone 16 Pro", 52200], ["Hard OLED", "iPhone 14 Pro Max", 61300],
  ["Hard OLED", "iPhone 15 Pro Max", 61300], ["Hard OLED", "iPhone 15 Pro", 64200],
  ["Soft OLED LCD", "iPhone 14 Pro", 64200], ["Incell LCD", "iPhone 16e", 36800],
  ["Incell LCD", "iPhone 16 Plus", 43900], ["Incell LCD", "iPhone 16", 43100],
  ["Incell LCD", "iPhone 15 Pro Max", 45200], ["Incell LCD", "iPhone 15 Plus", 40400],
  ["Incell LCD", "iPhone 14 Pro Max", 45200], ["Soft OLED", "iPhone 13", 75600],
  ["Soft OLED", "iPhone 14", 75600], ["Soft OLED", "iPhone 12 / 12 Pro", 71200],
  ["Soft OLED LCD", "iPhone 11 Pro Max", 66600], ["Incell LCD", "iPhone 13 Pro Max", 41700],
  ["Incell TFT LCD", "iPhone 12 mini", 46400], ["Incell LCD", "iPhone 15 Pro", 39600],
  ["Incell LCD", "iPhone 14 Pro", 39600], ["Incell LCD", "iPhone 15", 39200],
  ["Incell LCD", "iPhone 12 Pro Max", 41700], ["Incell LCD", "iPhone X", 31800],
  ["Incell LCD", "iPhone XS Max", 33100], ["Incell LCD", "iPhone 13", 41900],
  ["Incell LCD", "iPhone 14 Plus", 67400], ["Incell LCD", "iPhone 14", 62100],
  ["Incell LCD", "iPhone 11", 31600], ["Incell LCD", "iPhone XR", 31800], ["Incell LCD", "iPhone XS", 31800],
];
const jkProducts: Product[] = jkEntries.map(([kind, model, price], index) => ({
  id: `jk-${slug(kind)}-${slug(model)}-${index}`, name: `JK ${kind} Screen for ${model}`,
  brand: "Apple", model, category: "Screen", price, image: index % 3 === 0 ? "/images/product-iphone-alt.jpg" : index % 3 === 1 ? "/images/product-iphone.jpg" : "/images/product-samsung.jpg", badge: "JK DISPLAY",
}));

const models: Record<string, string[]> = {
  Apple: ["iPhone 4", "iPhone 4s", "iPhone 5", "iPhone 5c", "iPhone 5s", "iPhone SE", "iPhone SE 2020", "iPhone SE 2022", "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus", "iPhone 7", "iPhone 7 Plus", "iPhone 8", "iPhone 8 Plus", "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16e", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "iPhone Air"],
  Samsung: ["Galaxy A2 Core", "Galaxy A01", "Galaxy A02", "Galaxy A03", "Galaxy A04", "Galaxy A05", "Galaxy A06", "Galaxy A10", "Galaxy A10s", "Galaxy A11", "Galaxy A12", "Galaxy A13", "Galaxy A14", "Galaxy A15", "Galaxy A16", "Galaxy A17", "Galaxy A20", "Galaxy A20s", "Galaxy A21s", "Galaxy A22", "Galaxy A23", "Galaxy A24", "Galaxy A25", "Galaxy A26", "Galaxy A30", "Galaxy A30s", "Galaxy A31", "Galaxy A32", "Galaxy A33", "Galaxy A34", "Galaxy A35", "Galaxy A36", "Galaxy A50", "Galaxy A50s", "Galaxy A51", "Galaxy A52", "Galaxy A53", "Galaxy A54", "Galaxy A55", "Galaxy A56", "Galaxy A70", "Galaxy A71", "Galaxy A72", "Galaxy A73", "Galaxy M11", "Galaxy M12", "Galaxy M21", "Galaxy M31", "Galaxy M32", "Galaxy M51", "Galaxy J2", "Galaxy J4", "Galaxy J5", "Galaxy J6", "Galaxy J7", "Galaxy J7 Pro J730", "Galaxy S7", "Galaxy S8", "Galaxy S8 Plus", "Galaxy S9", "Galaxy S9 Plus", "Galaxy S10", "Galaxy S10e", "Galaxy S10 Plus", "Galaxy S20", "Galaxy S20 FE", "Galaxy S20 Plus", "Galaxy S20 Ultra", "Galaxy S21", "Galaxy S21 FE", "Galaxy S21 Plus", "Galaxy S21 Ultra", "Galaxy S22", "Galaxy S22 Plus", "Galaxy S22 Ultra", "Galaxy S23", "Galaxy S23 FE", "Galaxy S23 Plus", "Galaxy S23 Ultra", "Galaxy S24", "Galaxy S24 FE", "Galaxy S24 Plus", "Galaxy S24 Ultra", "Galaxy S25", "Galaxy S25 Plus", "Galaxy S25 Ultra", "Galaxy Note 8", "Galaxy Note 9", "Galaxy Note 10", "Galaxy Note 10 Plus", "Galaxy Note 20", "Galaxy Note 20 Ultra", "Galaxy Z Fold 3", "Galaxy Z Fold 4", "Galaxy Z Fold 5", "Galaxy Z Flip 3", "Galaxy Z Flip 4", "Galaxy Z Flip 5"],
  Infinix: ["Hot 5", "Hot 6", "Hot 6 Pro", "Hot 7", "Hot 7 Pro", "Hot 8", "Hot 9", "Hot 9 Play", "Hot 10", "Hot 10 Play", "Hot 10i", "Hot 11", "Hot 11 Play", "Hot 11S", "Hot 12", "Hot 12 Play", "Hot 12 Pro", "Hot 20", "Hot 20i", "Hot 30", "Hot 30i", "Hot 40", "Hot 40i", "Hot 40 Pro", "Hot 50", "Hot 50i", "Hot 50 Pro", "Smart 2", "Smart 3", "Smart 4", "Smart 5", "Smart 6", "Smart 6 Plus", "Smart 7", "Smart 8", "Smart 9", "Smart 10", "Note 5", "Note 6", "Note 7", "Note 8", "Note 10", "Note 10 Pro", "Note 11", "Note 11 Pro", "Note 12", "Note 12 Pro", "Note 30", "Note 30 Pro", "Note 40", "Note 40 Pro", "Note 50", "Note 50 Pro", "Zero 5", "Zero 6", "Zero 8", "Zero X", "Zero X Pro", "Zero 20", "Zero 30", "Zero 40"],
  Tecno: ["Camon 11", "Camon 12", "Camon 12 Air", "Camon 12 Pro", "Camon 15", "Camon 15 Air", "Camon 16", "Camon 17", "Camon 18", "Camon 19", "Camon 20", "Camon 20 Pro", "Camon 20 Premier", "Camon 30", "Camon 30 Pro", "Camon 40", "Camon 40 Pro", "Spark 4", "Spark 5", "Spark 6", "Spark 7", "Spark 8", "Spark 8C", "Spark 9", "Spark 10", "Spark 10 Pro", "Spark 20", "Spark 20 Pro", "Spark 20C", "Spark 30", "Spark 30C", "Spark Go 2023", "Spark Go 2024", "Spark Go 2025", "Pop 2", "Pop 3", "Pop 4", "Pop 5", "Pop 6", "Pop 6 Pro", "Pop 7", "Pop 8", "Pop 9", "Pova", "Pova 2", "Pova 3", "Pova 4", "Pova 5", "Pova 6", "Pova 7", "Phantom 6", "Phantom 8", "Phantom X", "Phantom X2", "Phantom V Fold", "Phantom V Flip"],
  itel: ["A15", "A16", "A21", "A23", "A23S", "A33", "A36", "A41", "A44", "A44 Air", "A44 Power", "A45", "A55", "A56", "A56 Pro", "A58", "A60", "A60s", "A70", "A80", "P15", "P32", "P33", "P36", "P38", "P40", "P55", "P65", "S15", "S16", "S17", "S18", "S23", "S24", "S25", "Vision 1", "Vision 2", "Vision 3", "Vision 3 Plus", "RS4"],
  Xiaomi: ["Redmi 4X", "Redmi 5", "Redmi 5A", "Redmi 5 Plus", "Redmi 6", "Redmi 6 Pro", "Redmi 7", "Redmi 8", "Redmi 8A", "Redmi 9", "Redmi 9A", "Redmi 9C", "Redmi 9T", "Redmi 10", "Redmi 10A", "Redmi 10C", "Redmi 12", "Redmi 12C", "Redmi 13", "Redmi 13C", "Redmi 14C", "Redmi Note 5", "Redmi Note 5A", "Redmi Note 5 Pro", "Redmi Note 7", "Redmi Note 7 Pro", "Redmi Note 8", "Redmi Note 8 Pro", "Redmi Note 8T", "Redmi Note 9", "Redmi Note 9S", "Redmi Note 9 Pro", "Redmi Note 9 Pro Max", "Redmi Note 10", "Redmi Note 10 Pro", "Redmi Note 11", "Redmi Note 11 Pro", "Redmi Note 12", "Redmi Note 12 Pro", "Redmi Note 13", "Redmi Note 13 Pro", "Redmi Note 14", "Redmi Note 14 Pro", "Mi A1", "Mi A2", "Mi A2 Lite", "Mi A3", "Mi 8 Lite", "Mi 9 Lite", "Mi 9T", "Mi 9T Pro", "Mi 10T", "Mi 10T Pro", "Mi Note 10", "Mi Note 10 Lite", "Mi Note 10 Pro", "Poco M3", "Poco M4", "Poco M5", "Poco X3", "Poco X5", "Poco X6"],
  Oppo: ["A3s", "A5", "A5s", "A12", "A15", "A16", "A17", "A18", "A31", "A33", "A37", "A53", "A54", "A55", "A57", "A58", "A74", "A77", "A78", "A92", "A93", "F11", "F11 Pro", "F19", "Reno 5", "Reno 6", "Reno 7", "Reno 8", "Reno 10", "Reno 11"],
  Vivo: ["Y11", "Y12", "Y15", "Y16", "Y17", "Y19", "Y20", "Y21", "Y22", "Y27", "Y33s", "Y35", "Y36", "Y91", "V15", "V20", "V21", "V23", "V25", "V27", "V29", "V30"],
  Huawei: ["Y5", "Y6", "Y7", "Y7 Prime", "Y9 2019", "Y9 Prime", "Y9s", "P20", "P20 Pro", "P30", "P30 Lite", "P30 Pro", "P40", "P40 Lite", "Nova 3i", "Nova 5T", "Nova 7i", "Mate 20", "Mate 20 Pro"],
  Nokia: ["1", "2", "2.1", "2.3", "3", "3.1", "3.2", "5", "5.1", "6", "6.1", "7 Plus", "8", "C1", "C2", "C10", "C20", "C21", "C30", "G10", "G20", "G21"],
  Motorola: ["Moto E6", "Moto E7", "Moto E13", "Moto G7", "Moto G8", "Moto G9", "Moto G10", "Moto G20", "Moto G30", "Moto G Power", "Moto G50", "Moto G Stylus", "Edge 20", "Edge 30", "Edge 40"],
  Realme: ["C11", "C12", "C15", "C20", "C21", "C25", "C30", "C33", "C35", "C53", "C55", "C67", "Note 50", "7", "8", "9", "10", "11", "12"],
  Google: ["Pixel 3", "Pixel 3a", "Pixel 4", "Pixel 4a", "Pixel 5", "Pixel 6", "Pixel 6 Pro", "Pixel 7", "Pixel 7 Pro", "Pixel 8", "Pixel 8 Pro", "Pixel 9", "Pixel 9 Pro"],
  OnePlus: ["6", "6T", "7", "7 Pro", "8", "8 Pro", "9", "9 Pro", "10 Pro", "11", "12", "Nord", "Nord 2", "Nord N10"],
  Gionee: ["M5", "M6", "M7", "S10", "S11", "F100", "F103", "F205", "P5", "P7", "P8", "P12"],
  Umidigi: ["A3", "A5 Pro", "A7", "A7 Pro", "A9", "A11", "A13", "Bison", "F1", "F2"],
  Honor: ["8X", "9X", "10", "20", "50", "70", "X6", "X7", "X8", "X9"],
};

const generatedProducts: Product[] = Object.entries(models).flatMap(([brand, brandModels], brandIndex) =>
  brandModels.flatMap((model, index) => (["Screen", "Touch Pad"] as Category[]).map((category) => {
    const isScreen = category === "Screen";
    const price = isScreen
      ? (brand === "Apple" ? 21000 : brand === "Samsung" ? 18500 : 12500) + ((index * 1700 + brandIndex * 500) % 26500)
      : 4500 + ((index * 700 + brandIndex * 300) % 9500);
    const image = !isScreen ? "/images/product-touch.jpg" : brand === "Apple" ? "/images/product-iphone.jpg" : brand === "Samsung" ? "/images/product-samsung.jpg" : "/images/product-android.jpg";
    const prefix = ["Apple", "Samsung", "Infinix", "Tecno", "itel", "Xiaomi"].includes(brand) && (model.startsWith("iPhone") || model.startsWith("Galaxy") || model.startsWith("Redmi") || model.startsWith("Mi ") || model.startsWith("Poco")) ? "" : `${brand} `;
    return { id: `model-${slug(brand)}-${slug(model)}-${isScreen ? "screen" : "touch"}`, name: `${prefix}${model} ${isScreen ? "LCD Display Screen" : "Touch Pad Digitizer"}`, brand, model, category, price, image };
  }))
);

export const catalog: Product[] = [...featured, ...jkProducts, ...generatedProducts];
export const brands = ["Apple", "Samsung", "Infinix", "Tecno", "itel", "Xiaomi", "Oppo", "Vivo", "Huawei", "Nokia", "Motorola", "Realme", "Google", "OnePlus", "Gionee", "Umidigi", "Honor"];
