import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getRelated, formatPrice, getDiscount, renderStars } from "../data/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");

  const product = getProductById(id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQty(1);
  }, [id]);

  if (!product) {
    return (
      <div className="not-found">
        <div className="container" style={{ textAlign: "center", padding: "8rem 1rem" }}>
          <span style={{ fontSize: "5rem" }}>🔍</span>
          <h2 style={{ marginTop: "1rem" }}>Product Not Found</h2>
          <p style={{ marginBottom: "2rem", color: "var(--text-muted)" }}>This product doesn't exist or has been removed.</p>
          <Link to="/catalog" className="btn-primary">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  const discount = getDiscount(product.price, product.originalPrice);
  const related = getRelated(product, 4);

  const handleAddToCart = () => {
    addItem(product, qty);
    showToast(`${product.name} × ${qty} added to cart! 🛍️`);
  };

  const reviews = [
    { name: "Alex M.", rating: 5, date: "June 2026", text: "Absolutely amazing product! Exceeded all expectations. Build quality is superb." },
    { name: "Sarah K.", rating: 5, date: "May 2026", text: "Fast delivery and exactly as described. Very happy with this purchase." },
    { name: "James T.", rating: 4, date: "May 2026", text: "Great product overall. Minor packaging issue but the item itself is perfect." },
  ];

  return (
    <>
      <section className="product-detail-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span>
            <Link to="/catalog">Catalog</Link> <span>/</span>
            <Link to={`/catalog?category=${product.category}`}>{product.category}</Link> <span>/</span>
            <span>{product.name}</span>
          </div>

          <div className="product-detail-layout">
            {/* Image Panel */}
            <div className="detail-img-panel">
              <div className="detail-img-main" style={{ background: `linear-gradient(135deg, ${product.color}22, ${product.color}55)` }}>
                <span className="detail-emoji">{product.emoji}</span>
                {product.badge && <span className={`product-badge badge-${product.tags[0]}`}>{product.badge}</span>}
                {discount && <span className="product-discount">-{discount}%</span>}
              </div>
              <div className="detail-img-thumbs">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`detail-thumb${i === 0 ? " active" : ""}`}
                    style={{ background: `linear-gradient(135deg, ${product.color}${i === 0 ? "44" : "22"}, ${product.color}${i === 0 ? "66" : "33"})` }}>
                    <span style={{ fontSize: "1.4rem" }}>{product.emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Panel */}
            <div className="detail-info-panel">
              <span className="product-category">{product.category}</span>
              <h1 className="detail-title">{product.name}</h1>

              <div className="detail-rating-row">
                <span className="stars-text">{renderStars(product.rating)}</span>
                <span className="rating-value">{product.rating}</span>
                <span className="review-count">({product.reviews.toLocaleString()} reviews)</span>
                <span className={`stock-badge ${product.stock < 20 ? "low-stock" : "in-stock"}`}>
                  {product.stock < 20 ? `Only ${product.stock} left!` : "In Stock"}
                </span>
              </div>

              <div className="detail-price-row">
                <span className="detail-price">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="detail-original">{formatPrice(product.originalPrice)}</span>
                    <span className="detail-savings">Save {discount}%</span>
                  </>
                )}
              </div>

              <p className="detail-desc">{product.desc}</p>

              {/* Specs */}
              <div className="detail-specs">
                <h4 className="specs-title">Key Features</h4>
                <ul className="specs-list">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="spec-item">
                      <span className="spec-check">✓</span> {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity + Cart */}
              <div className="detail-actions">
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn-primary btn-add-large" onClick={handleAddToCart}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Add to Cart — {formatPrice(product.price * qty)}
                </button>
              </div>

              {/* Trust badges */}
              <div className="trust-badges">
                <div className="trust-badge"><span>🚚</span> Free Shipping over $100</div>
                <div className="trust-badge"><span>🔄</span> 30-Day Returns</div>
                <div className="trust-badge"><span>🔒</span> Secure Checkout</div>
                <div className="trust-badge"><span>⭐</span> Quality Guarantee</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="product-tabs">
            <div className="tabs-header">
              {["desc", "specs", "reviews"].map(tab => (
                <button key={tab} className={`tab-btn${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab === "desc" ? "Description" : tab === "specs" ? "Specifications" : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {activeTab === "desc" && (
                <div className="tab-panel">
                  <p>{product.desc}</p>
                  <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
                    At MaariShop, we believe every product in our catalog deserves a premium experience. This item has been hand-selected by our curation team and verified to meet our quality standards.
                  </p>
                </div>
              )}
              {activeTab === "specs" && (
                <div className="tab-panel">
                  <table className="specs-table">
                    <tbody>
                      {product.specs.map((spec, i) => {
                        const [key, ...val] = spec.split(": ");
                        return (
                          <tr key={i}>
                            <td className="spec-key">{val.length ? key : `Feature ${i + 1}`}</td>
                            <td className="spec-val">{val.length ? val.join(": ") : spec}</td>
                          </tr>
                        );
                      })}
                      <tr><td className="spec-key">Category</td><td className="spec-val">{product.category}</td></tr>
                      <tr><td className="spec-key">In Stock</td><td className="spec-val">{product.stock} units</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="tab-panel">
                  <div className="reviews-summary">
                    <div className="reviews-score">
                      <span className="big-score">{product.rating}</span>
                      <div className="stars-text" style={{ fontSize: "1.5rem" }}>{renderStars(product.rating)}</div>
                      <span className="reviews-total">{product.reviews.toLocaleString()} reviews</span>
                    </div>
                  </div>
                  <div className="reviews-list">
                    {reviews.map((rev, i) => (
                      <div key={i} className="review-item">
                        <div className="review-header">
                          <div className="review-avatar">{rev.name[0]}{rev.name.split(" ")[1]?.[0]}</div>
                          <div>
                            <span className="review-name">{rev.name}</span>
                            <span className="review-date">{rev.date}</span>
                          </div>
                          <span className="review-stars">{renderStars(rev.rating)}</span>
                        </div>
                        <p className="review-text">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">You May Also <span className="gradient-text">Like</span></h2>
            </div>
            <div className="featured-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
