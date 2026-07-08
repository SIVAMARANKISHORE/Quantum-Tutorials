import { Link } from "react-router-dom";
import { useState } from "react";
import { PRODUCTS, CATEGORIES, TESTIMONIALS, getFeatured, formatPrice, renderStars } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const featured = getFeatured(8);

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast("Subscribed! Welcome to MaariShop. 🎉");
    setEmail("");
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="grid-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" /> New Collection 2026
          </div>
          <h1 className="hero-title">
            Discover<br />
            <span className="gradient-text">Premium</span><br />
            Products
          </h1>
          <p className="hero-subtitle">
            Curated luxury goods crafted for the discerning modern lifestyle. Quality meets innovation.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">
              Shop Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link to="/catalog?filter=featured" className="btn-ghost">View Featured</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><span className="stat-num">2.4K+</span><span className="stat-label">Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">98%</span><span className="stat-label">Satisfaction</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">150+</span><span className="stat-label">Brands</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="float-card card-1">
              <div className="card-img" style={{ background: "linear-gradient(135deg,#6C63FF33,#6C63FF66)", fontSize: "3rem" }}>🎧</div>
              <div className="card-info"><span className="card-name">Pro Earbuds X</span><span className="card-price">$299</span></div>
            </div>
            <div className="float-card card-2">
              <div className="card-img" style={{ background: "linear-gradient(135deg,#C9A96E33,#C9A96E66)", fontSize: "3rem" }}>🧥</div>
              <div className="card-info"><span className="card-name">Silk Blazer</span><span className="card-price">$189</span></div>
            </div>
            <div className="float-card card-3">
              <div className="card-img" style={{ background: "linear-gradient(135deg,#F4A26133,#F4A26166)", fontSize: "3rem" }}>💡</div>
              <div className="card-info"><span className="card-name">Arc Lamp</span><span className="card-price">$349</span></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Browse by Category</span>
            <h2 className="section-title">Shop Your <span className="gradient-text">Style</span></h2>
            <p className="section-sub">From cutting-edge electronics to timeless fashion — find everything you love.</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.key} to={`/catalog?category=${cat.key}`} className={`category-card cat-${cat.key}`}>
                <div className="cat-icon" style={{ color: cat.color }}>{cat.icon}</div>
                <div className="cat-content">
                  <h3 className="cat-title">{cat.label}</h3>
                  <p className="cat-desc">{cat.count.toLocaleString()} Products</p>
                </div>
                <div className="cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Hand-picked for You</span>
            <h2 className="section-title">Featured <span className="gradient-text">Products</span></h2>
          </div>
          <div className="featured-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="section-footer">
            <Link to="/catalog" className="btn-primary">
              View All Products
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────── */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-card">
            <div className="promo-orb p-orb-1" />
            <div className="promo-orb p-orb-2" />
            <div className="promo-content">
              <span className="promo-tag">Limited Time Offer</span>
              <h2 className="promo-title">Up to <span className="gradient-text">40% Off</span><br />Summer Sale</h2>
              <p className="promo-desc">Don't miss our biggest sale of the year. Premium products at unbeatable prices.</p>
              <Link to="/catalog?filter=sale" className="btn-primary">Grab the Deal</Link>
            </div>
            <div className="promo-visual">
              <div className="promo-circle">
                <span className="promo-percent">40%</span>
                <span className="promo-off">OFF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What Our Customers Say</span>
            <h2 className="section-title">Loved by <span className="gradient-text">Thousands</span></h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(t => (
              <div key={t.id} className={`testimonial-card${t.featured ? " featured-testimonial" : ""}`}>
                <div className="stars">{renderStars(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className={`author-avatar av-${t.id}`}>{t.avatar}</div>
                  <div>
                    <span className="author-name">{t.name}</span>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <div className="nl-icon">✉️</div>
            <h2 className="nl-title">Stay in the <span className="gradient-text">Loop</span></h2>
            <p className="nl-desc">Get exclusive deals, new arrivals, and curated picks delivered to your inbox.</p>
            <form className="nl-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                className="nl-input"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
            <p className="nl-note">No spam. Unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </section>
    </>
  );
}
