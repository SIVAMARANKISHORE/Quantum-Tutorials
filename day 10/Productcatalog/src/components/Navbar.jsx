import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { PRODUCTS, formatPrice } from "../data/products";

export default function Navbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }
    setResults(PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q)).slice(0, 6));
  }, [query]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setSearchOpen(false); setQuery(""); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = () => { setSearchOpen(false); setQuery(""); setResults([]); };
  const handleResultClick = (id) => { closeSearch(); navigate(`/product/${id}`); };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Catalog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">✦</span> Expo Shop
          </Link>

          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} end={l.to === "/"}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="btn-search" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
            <Link to="/cart" className="btn-cart" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            <button className={`btn-menu${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `mobile-link${isActive ? " active" : ""}`}
              end={l.to === "/"} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay active" onClick={e => e.target === e.currentTarget && closeSearch()}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search products…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            <button className="search-close" onClick={closeSearch}>✕</button>
          </div>
          <div className="search-suggestions" style={{ display: results.length > 0 || query ? "block" : "none" }}>
            {results.length === 0 && query
              ? <p className="search-empty">No products found.</p>
              : results.map(p => (
                <button key={p.id} className="search-result" onClick={() => handleResultClick(p.id)}>
                  <span className="search-result-emoji">{p.emoji}</span>
                  <div className="search-result-info">
                    <span className="search-result-name">{p.name}</span>
                    <span className="search-result-cat">{p.category}</span>
                  </div>
                  <span className="search-result-price">{formatPrice(p.price)}</span>
                </button>
              ))
            }
          </div>
        </div>
      )}
    </>
  );
}
