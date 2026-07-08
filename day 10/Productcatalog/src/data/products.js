// ============================================================
// MaariShop — Product Data Store
// ============================================================

export const PRODUCTS = [
  // ── ELECTRONICS ─────────────────────────────────────────
  { id: 1, name: "ProSound X3 Wireless Earbuds", category: "electronics", price: 299, originalPrice: 349, rating: 4.8, reviews: 1204, tags: ["featured", "bestseller"], badge: "Bestseller", emoji: "🎧", color: "#6C63FF", desc: "Premium noise-cancelling earbuds with 36-hour battery, spatial audio, and IPX5 water resistance. Crystal clear calls and immersive sound.", specs: ["36hr Battery", "ANC Technology", "IPX5 Waterproof", "Bluetooth 5.3", "Wireless Charging Case"], stock: 50, isNew: false, isSale: true },
  { id: 2, name: "UltraView 4K Smart Monitor", category: "electronics", price: 749, originalPrice: 899, rating: 4.7, reviews: 856, tags: ["sale", "featured"], badge: "Sale", emoji: "🖥️", color: "#00D4AA", desc: "27-inch 4K IPS display with 144Hz refresh rate, HDR600, and USB-C one-cable solution. Perfect for professionals and gamers alike.", specs: ["27\" 4K IPS", "144Hz Refresh", "HDR600", "USB-C Power", "G-Sync Compatible"], stock: 22, isNew: false, isSale: true },
  { id: 3, name: "SwiftCharge Pro Magnetic Pad", category: "electronics", price: 79, originalPrice: null, rating: 4.5, reviews: 2103, tags: ["new", "bestseller"], badge: "New", emoji: "⚡", color: "#FF6B6B", desc: "15W MagSafe-compatible wireless charger with dual-device charging. Ultra-slim design with LED indicator.", specs: ["15W Fast Charge", "MagSafe Compatible", "Dual Device", "LED Indicator", "Universal Qi"], stock: 150, isNew: true, isSale: false },
  { id: 4, name: "AeroKey Slim Mechanical Keyboard", category: "electronics", price: 189, originalPrice: 220, rating: 4.9, reviews: 642, tags: ["featured", "sale"], badge: "Top Rated", emoji: "⌨️", color: "#845EC2", desc: "Ultra-slim 75% layout mechanical keyboard with custom red switches, per-key RGB and aluminum chassis.", specs: ["Red Switches", "Per-Key RGB", "Aluminum Body", "Wireless/Wired", "75% Layout"], stock: 35, isNew: false, isSale: true },
  { id: 5, name: "NovaFlow Smart Speaker", category: "electronics", price: 129, originalPrice: null, rating: 4.6, reviews: 945, tags: ["new"], badge: "New", emoji: "🔊", color: "#FFB347", desc: "360° room-filling audio with built-in AI assistant, multi-room sync, and premium woven fabric design.", specs: ["360° Audio", "AI Assistant", "Multi-Room", "Wi-Fi + Bluetooth", "Touch Controls"], stock: 80, isNew: true, isSale: false },
  { id: 6, name: "LensPro X Action Camera", category: "electronics", price: 399, originalPrice: 449, rating: 4.7, reviews: 378, tags: ["sale"], badge: "Sale", emoji: "📸", color: "#4ECDC4", desc: "8K action camera with HorizonLock stabilization, 60m waterproofing, and 4-hour battery. Capture every adventure.", specs: ["8K Video", "HorizonLock", "60m Waterproof", "4hr Battery", "Voice Control"], stock: 18, isNew: false, isSale: true },
  { id: 7, name: "HoverDrive Pro Drone", category: "electronics", price: 599, originalPrice: 699, rating: 4.6, reviews: 312, tags: ["sale", "featured"], badge: "Sale", emoji: "🚁", color: "#F72585", desc: "Professional 4K drone with 40-min flight time, obstacle avoidance, and AI tracking. Fold-and-go portability.", specs: ["4K 60fps", "40min Flight", "AI Tracking", "5km Range", "Foldable Design"], stock: 20, isNew: false, isSale: true },
  { id: 8, name: "VisionX AR Glasses", category: "electronics", price: 899, originalPrice: null, rating: 4.4, reviews: 156, tags: ["new", "featured"], badge: "New", emoji: "🥽", color: "#4361EE", desc: "Next-gen augmented reality glasses with 3-hour battery, spatial computing, and transparent OLED display.", specs: ["OLED Display", "3hr Battery", "60g Lightweight", "Spatial Audio", "Prescription Ready"], stock: 8, isNew: true, isSale: false },

  // ── FASHION ─────────────────────────────────────────────
  { id: 9, name: "Meridian Silk Blazer", category: "fashion", price: 189, originalPrice: 249, rating: 4.6, reviews: 423, tags: ["featured", "sale"], badge: "Sale", emoji: "🧥", color: "#C9A96E", desc: "Luxurious 100% mulberry silk blazer with impeccable tailoring. Elevate any occasion from boardroom to evening.", specs: ["100% Mulberry Silk", "Fully Lined", "Two Chest Pockets", "Custom Buttons", "Dry Clean Only"], stock: 30, isNew: false, isSale: true },
  { id: 10, name: "Apex Leather Sneakers", category: "fashion", price: 149, originalPrice: null, rating: 4.8, reviews: 1567, tags: ["bestseller", "new"], badge: "Bestseller", emoji: "👟", color: "#FF9671", desc: "Hand-stitched full-grain leather sneakers with memory foam insoles and sustainable rubber outsoles.", specs: ["Full-Grain Leather", "Memory Foam Insole", "Sustainable Outsole", "Hand-Stitched", "Unisex Sizing"], stock: 65, isNew: true, isSale: false },
  { id: 11, name: "Cashmere Oversized Sweater", category: "fashion", price: 225, originalPrice: 280, rating: 4.7, reviews: 289, tags: ["featured", "sale"], badge: "Sale", emoji: "🧶", color: "#B5838D", desc: "Ultra-soft Grade-A Mongolian cashmere in a relaxed silhouette. Available in 8 seasonal colors.", specs: ["Grade-A Cashmere", "8 Color Options", "Relaxed Fit", "Ribbed Cuffs", "Hand Wash"], stock: 45, isNew: false, isSale: true },
  { id: 12, name: "Structured Tote Bag", category: "fashion", price: 175, originalPrice: null, rating: 4.5, reviews: 634, tags: ["new", "featured"], badge: "New", emoji: "👜", color: "#6B4226", desc: "Vegan leather tote with laptop compartment, magnetic closure, and gold-tone hardware. Style meets function.", specs: ["Vegan Leather", "Laptop Compartment", "Magnetic Closure", "Gold Hardware", "Water Resistant"], stock: 55, isNew: true, isSale: false },
  { id: 13, name: "Performance Running Shorts", category: "fashion", price: 59, originalPrice: 75, rating: 4.4, reviews: 812, tags: ["sale", "bestseller"], badge: "Sale", emoji: "🩳", color: "#00B4D8", desc: "4-way stretch moisture-wicking shorts with built-in liner, reflective details, and zippered pocket.", specs: ["4-Way Stretch", "Built-in Liner", "Reflective Trim", "Zip Pocket", "Anti-Odor"], stock: 90, isNew: false, isSale: true },
  { id: 14, name: "Aviator Sunglasses Premium", category: "fashion", price: 195, originalPrice: null, rating: 4.9, reviews: 445, tags: ["featured", "new"], badge: "New", emoji: "🕶️", color: "#D4A843", desc: "Polarized titanium frame aviators with gradient lenses. UV400 protection and scratch-resistant coating.", specs: ["Titanium Frame", "Polarized Lenses", "UV400 Protection", "Scratch-Resistant", "Case Included"], stock: 28, isNew: true, isSale: false },

  // ── HOME & LIVING ────────────────────────────────────────
  { id: 15, name: "Arc Floor Lamp Statement", category: "home", price: 349, originalPrice: 399, rating: 4.8, reviews: 267, tags: ["featured", "sale"], badge: "Sale", emoji: "💡", color: "#F4A261", desc: "Sculptural arc floor lamp with brass-finished arm and Italian marble base. Dimmable LED with warm white glow.", specs: ["Dimmable LED", "Marble Base", "Brass Finish", "180cm Height", "E27 Socket"], stock: 15, isNew: false, isSale: true },
  { id: 16, name: "Artisan Ceramic Mug Set", category: "home", price: 68, originalPrice: null, rating: 4.7, reviews: 1892, tags: ["bestseller", "new"], badge: "Bestseller", emoji: "☕", color: "#8B7355", desc: "Set of 4 hand-thrown ceramic mugs in a nature-inspired glaze palette. Dishwasher and microwave safe.", specs: ["Set of 4", "Hand-Thrown", "400ml Capacity", "Dishwasher Safe", "Lead-Free Glaze"], stock: 120, isNew: true, isSale: false },
  { id: 17, name: "Linen Duvet Cover King", category: "home", price: 195, originalPrice: 245, rating: 4.6, reviews: 534, tags: ["sale"], badge: "Sale", emoji: "🛏️", color: "#A8DADC", desc: "100% French linen duvet cover with button closure. Naturally temperature-regulating and gets softer with every wash.", specs: ["100% French Linen", "Button Closure", "King Size", "10 Colors", "OEKO-TEX Certified"], stock: 40, isNew: false, isSale: true },
  { id: 18, name: "Modular Bookshelf Oak", category: "home", price: 420, originalPrice: null, rating: 4.5, reviews: 189, tags: ["new", "featured"], badge: "New", emoji: "📚", color: "#8B6914", desc: "Solid oak modular shelving system. Mix and match units for infinite configurations. Scandinavian design.", specs: ["Solid Oak", "Modular Design", "3 Units Included", "Load 30kg/shelf", "Easy Assembly"], stock: 12, isNew: true, isSale: false },

  // ── SPORTS ──────────────────────────────────────────────
  { id: 19, name: "TrailBlazer Running Shoes", category: "sports", price: 159, originalPrice: 189, rating: 4.8, reviews: 2341, tags: ["featured", "bestseller", "sale"], badge: "Bestseller", emoji: "🏃", color: "#48CAE4", desc: "Carbon fiber plate running shoes with responsive foam stack. Race-ready performance for every distance.", specs: ["Carbon Fiber Plate", "Responsive Foam", "Breathable Upper", "6mm Drop", "Race-Day Ready"], stock: 75, isNew: false, isSale: true },
  { id: 20, name: "Smart Fitness Tracker Pro", category: "sports", price: 229, originalPrice: null, rating: 4.6, reviews: 1123, tags: ["new", "featured"], badge: "New", emoji: "⌚", color: "#06D6A0", desc: "Advanced fitness tracker with ECG, SpO2, GPS, 7-day battery and personalized AI coaching insights.", specs: ["Built-in GPS", "ECG + SpO2", "7-Day Battery", "AI Coaching", "50m Waterproof"], stock: 60, isNew: true, isSale: false },
  { id: 21, name: "Pro Yoga Mat Premium", category: "sports", price: 89, originalPrice: 110, rating: 4.7, reviews: 678, tags: ["sale"], badge: "Sale", emoji: "🧘", color: "#E040FB", desc: "6mm natural rubber yoga mat with alignment lines, carrying strap and non-slip surface. Eco-certified.", specs: ["Natural Rubber", "6mm Thickness", "Alignment Lines", "Non-Slip", "Eco-Certified"], stock: 85, isNew: false, isSale: true },
  { id: 22, name: "Adjustable Dumbbell Set", category: "sports", price: 349, originalPrice: null, rating: 4.9, reviews: 445, tags: ["new", "featured", "bestseller"], badge: "New", emoji: "🏋️", color: "#FF6B6B", desc: "Quick-adjust 5–52.5lb dumbbell set. Replace 15 sets of weights. Ideal for home gym enthusiasts.", specs: ["5–52.5 lbs", "Quick-Adjust", "Replaces 15 Sets", "Compact Design", "2-Year Warranty"], stock: 30, isNew: true, isSale: false },

  // ── BEAUTY ──────────────────────────────────────────────
  { id: 23, name: "Serum Glow Vitamin C+", category: "beauty", price: 68, originalPrice: 85, rating: 4.8, reviews: 3245, tags: ["featured", "bestseller", "sale"], badge: "Bestseller", emoji: "✨", color: "#FFD166", desc: "20% Vitamin C + Ferulic Acid + Hyaluronic Acid brightening serum. Visibly reduces dark spots in 4 weeks.", specs: ["20% Vitamin C", "Ferulic Acid", "Hyaluronic Acid", "30ml", "Dermatologist Tested"], stock: 200, isNew: false, isSale: true },
  { id: 24, name: "Pro Gua Sha Rose Quartz", category: "beauty", price: 49, originalPrice: null, rating: 4.5, reviews: 876, tags: ["new"], badge: "New", emoji: "💆", color: "#FFB3C6", desc: "100% authentic rose quartz gua sha tool for facial sculpting and lymphatic drainage. Cooling and calming.", specs: ["Rose Quartz", "Dual Edge", "Includes Pouch", "Hand-Polished", "Ethically Sourced"], stock: 150, isNew: true, isSale: false },
  { id: 25, name: "Luxe Perfume Noir 50ml", category: "beauty", price: 145, originalPrice: 170, rating: 4.9, reviews: 512, tags: ["featured", "sale"], badge: "Sale", emoji: "🌸", color: "#9B2C7C", desc: "An intoxicating blend of oud, amber, and black rose. Long-lasting Eau de Parfum that captivates all senses.", specs: ["50ml EDP", "12hr Longevity", "Top: Rose, Oud", "Mid: Amber, Musk", "Made in France"], stock: 35, isNew: false, isSale: true },

  // ── BOOKS ───────────────────────────────────────────────
  { id: 26, name: "Atomic Habits — Hardcover", category: "books", price: 28, originalPrice: 35, rating: 4.9, reviews: 48750, tags: ["featured", "bestseller", "sale"], badge: "Bestseller", emoji: "📖", color: "#52B788", desc: "The definitive guide to building good habits and breaking bad ones. By James Clear. A life-changing read.", specs: ["Hardcover", "320 Pages", "English", "ISBN: 978-0-7352-1928-9", "Foil Cover"], stock: 500, isNew: false, isSale: true },
  { id: 27, name: "The Design of Everyday Things", category: "books", price: 22, originalPrice: null, rating: 4.8, reviews: 12300, tags: ["featured"], badge: "Classic", emoji: "🎨", color: "#FF8500", desc: "Don Norman's timeless classic on design principles and human-centered design thinking. Essential reading.", specs: ["Paperback", "368 Pages", "English", "Revised Edition", "MIT Press"], stock: 300, isNew: false, isSale: false },
  { id: 28, name: "Clean Code Dev Edition", category: "books", price: 42, originalPrice: 55, rating: 4.7, reviews: 8924, tags: ["sale", "bestseller"], badge: "Sale", emoji: "💻", color: "#0096C7", desc: "Robert C. Martin's guide to writing clean, maintainable code. Comes with annotated examples and exercises.", specs: ["Hardcover", "464 Pages", "English", "Annotated Edition", "Prentice Hall"], stock: 120, isNew: false, isSale: true },
];

export const CATEGORIES = [
  { key: "electronics", label: "Electronics", icon: "⚡", count: 240, color: "#6C63FF" },
  { key: "fashion",     label: "Fashion",     icon: "👗", count: 580, color: "#FF9671" },
  { key: "home",        label: "Home & Living",icon: "🏡", count: 390, color: "#F4A261" },
  { key: "sports",      label: "Sports",      icon: "⚽", count: 175, color: "#06D6A0" },
  { key: "beauty",      label: "Beauty",      icon: "💄", count: 320, color: "#FFB3C6" },
  { key: "books",       label: "Books",       icon: "📚", count: 1200, color: "#52B788" },
];

export const TESTIMONIALS = [
  { id: 1, name: "Sarah Anderson", role: "Verified Buyer", avatar: "SA", text: "Absolutely incredible quality. The products exceeded all my expectations. Will definitely shop again!", rating: 5 },
  { id: 2, name: "Marcus Kim",     role: "Premium Member", avatar: "MK", text: "The customer service is top-notch and delivery was lightning fast. My go-to shop for premium goods.", rating: 5, featured: true },
  { id: 3, name: "Lisa Patel",     role: "Verified Buyer", avatar: "LP", text: "I love the curation here. Every product feels handpicked with such care. Stunning packaging too!", rating: 5 },
];

export function getProductById(id) { return PRODUCTS.find(p => p.id === +id); }
export function getFeatured(limit = 8) { return PRODUCTS.filter(p => p.tags.includes("featured")).slice(0, limit); }
export function getRelated(product, limit = 4) { return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit); }
export function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return "★";
    if (i === Math.floor(rating) && rating % 1 >= 0.5) return "½";
    return "☆";
  }).join("");
}
export function formatPrice(price) { return `$${Number(price).toFixed(2)}`; }
export function getDiscount(price, originalPrice) {
  if (!originalPrice) return null;
  return Math.round((1 - price / originalPrice) * 100);
}
