import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice, getDiscount, renderStars } from "../data/products";

export default function ProductCard({ product, view = "grid" }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const discount = getDiscount(product.price, product.originalPrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart! 🛍️`);
  };

  if (view === "list") {
    return (
      <div className="product-row">
        <Link to={`/product/${product.id}`} className="row-img-link">
          <div className="row-img" style={{ background: `linear-gradient(135deg, ${product.color}22, ${product.color}55)` }}>
            <span className="product-emoji">{product.emoji}</span>
            {discount && <span className="product-discount">-{discount}%</span>}
          </div>
        </Link>
        <div className="row-info">
          <span className="product-category">{product.category}</span>
          <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
          <p className="row-desc">{product.desc.substring(0, 100)}…</p>
          <div className="product-rating">
            <span className="stars-text">{renderStars(product.rating)}</span>
            <span className="rating-value">{product.rating}</span>
            <span className="review-count">({product.reviews.toLocaleString()})</span>
          </div>
        </div>
        <div className="row-actions">
          <div className="product-price-row vertical">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="product-original">{formatPrice(product.originalPrice)}</span>}
          </div>
          <button className="btn-add-cart" onClick={handleAddToCart}>Add to Cart</button>
          <Link to={`/product/${product.id}`} className="btn-details">View Details</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-img-link">
        <div className="product-card-img" style={{ background: `linear-gradient(135deg, ${product.color}22, ${product.color}55)` }}>
          <span className="product-emoji">{product.emoji}</span>
          {product.badge && (
            <span className={`product-badge badge-${product.tags[0]}`}>{product.badge}</span>
          )}
          {discount && <span className="product-discount">-{discount}%</span>}
        </div>
      </Link>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-rating">
          <span className="stars-text">{renderStars(product.rating)}</span>
          <span className="rating-value">{product.rating}</span>
          <span className="review-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="product-original">{formatPrice(product.originalPrice)}</span>}
        </div>
        <button className="btn-add-cart" onClick={handleAddToCart}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
