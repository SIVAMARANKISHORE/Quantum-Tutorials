import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../data/products";

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total, count } = useCart();
  const { showToast } = useToast();

  const handleRemove = (id, name) => {
    removeItem(id);
    showToast(`${name} removed from cart.`, "error");
  };

  const handleCheckout = () => {
    clearCart();
    showToast("Order placed successfully! Thank you for shopping. 🎉");
  };

  const shipping = total >= 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <section className="cart-section">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Cart</span>
          </div>
          <h1 className="page-title">Shopping <span className="gradient-text">Cart</span></h1>
          <div className="empty-cart">
            <span className="empty-cart-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Let's change that!</p>
            <Link to="/catalog" className="btn-primary">
              Start Shopping
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-section">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>/</span> <span>Cart</span>
        </div>
        <h1 className="page-title">Shopping <span className="gradient-text">Cart</span></h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items-header">
              <span>{count} item{count !== 1 ? "s" : ""} in your cart</span>
              <button className="clear-cart-btn" onClick={() => { clearCart(); showToast("Cart cleared."); }}>
                Clear All
              </button>
            </div>

            {items.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img" style={{ background: `linear-gradient(135deg, ${item.color}22, ${item.color}55)` }}>
                  <span style={{ fontSize: "2.2rem" }}>{item.emoji}</span>
                </div>
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <span className="cart-item-price">{formatPrice(item.price)} each</span>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-control small">
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span className="qty-value">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <span className="cart-item-subtotal">{formatPrice(item.price * item.qty)}</span>
                  <button className="cart-remove-btn" onClick={() => handleRemove(item.id, item.name)} aria-label="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="continue-shopping">
              <Link to="/catalog" className="btn-ghost">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({count} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? "free-shipping" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <div className="free-shipping-note">
                  Add {formatPrice(100 - total)} more for free shipping!
                </div>
              )}
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="promo-code">
              <input type="text" className="promo-input" placeholder="Promo code" />
              <button className="promo-apply-btn">Apply</button>
            </div>

            <button className="btn-primary btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            {/* Trust */}
            <div className="checkout-trust">
              <span>🔒 Secure Checkout</span>
              <span>🚚 Fast Delivery</span>
              <span>🔄 Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
