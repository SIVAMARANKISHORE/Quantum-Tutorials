import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";

const ITEMS_PER_PAGE = 9;

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter state
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [tag, setTag] = useState(searchParams.get("filter") || "all");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  // Sync URL params on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    const filter = searchParams.get("filter");
    if (cat) setCategory(cat);
    if (filter) setTag(filter);
  }, []);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== "all") list = list.filter(p => p.category === category);
    if (tag !== "all") list = list.filter(p => p.tags.includes(tag));
    list = list.filter(p => p.price <= maxPrice && p.rating >= minRating);
    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating":     list.sort((a, b) => b.rating - a.rating); break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "newest":     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: break;
    }
    return list;
  }, [category, tag, maxPrice, minRating, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setCategory("all"); setTag("all"); setMaxPrice(1000);
    setMinRating(0); setSort("default"); setPage(1);
    setSearchParams({});
  };

  const handleCategory = (val) => { setCategory(val); setPage(1); };
  const handleTag = (val) => { setTag(val); setPage(1); };

  const categories = ["all", "electronics", "fashion", "home", "sports", "beauty", "books"];
  const tags = ["all", "new", "sale", "featured", "bestseller"];
  const ratings = [{ label: "Any Rating", val: 0 }, { label: "★★★★★ 4.5+", val: 4.5 }, { label: "★★★★ 4.0+", val: 4 }, { label: "★★★ 3.0+", val: 3 }];

  const Sidebar = () => (
    <aside className={`filter-sidebar${mobileFilterOpen ? " mobile-open" : ""}`}>
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <button className="filter-reset" onClick={resetFilters}>Reset All</button>
      </div>

      {/* Category */}
      <div className="filter-group">
        <h4 className="filter-group-title">Category</h4>
        <div className="filter-options">
          {categories.map(cat => (
            <label key={cat} className="filter-option">
              <input type="radio" name="category" checked={category === cat} onChange={() => handleCategory(cat)} />
              <span>{cat === "all" ? "All Categories" : cat === "home" ? "Home & Living" : cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="filter-group">
        <h4 className="filter-group-title">Price Range</h4>
        <div className="filter-options">
          <div className="price-display">
            <span>$0</span> — <span>${maxPrice}</span>
          </div>
          <input type="range" className="price-slider" min="0" max="1000" step="10"
            value={maxPrice} onChange={e => { setMaxPrice(+e.target.value); setPage(1); }} />
        </div>
      </div>

      {/* Rating */}
      <div className="filter-group">
        <h4 className="filter-group-title">Min Rating</h4>
        <div className="filter-options">
          {ratings.map(r => (
            <label key={r.val} className="filter-option">
              <input type="radio" name="rating" checked={minRating === r.val} onChange={() => { setMinRating(r.val); setPage(1); }} />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="filter-group">
        <h4 className="filter-group-title">Tags</h4>
        <div className="filter-options tag-options">
          {tags.map(t => (
            <button key={t} className={`tag-btn${tag === t ? " active" : ""}`} onClick={() => handleTag(t)}>
              {t === "all" ? "All" : t === "new" ? "New" : t === "sale" ? "On Sale" : t === "featured" ? "Featured" : "Bestseller"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hero */}
      <section className="catalog-hero">
        <div className="catalog-hero-bg">
          <div className="hero-orb orb-1" style={{ top: -50, left: -80 }} />
          <div className="hero-orb orb-2" style={{ top: 20, right: -60 }} />
        </div>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Catalog</span>
          </div>
          <h1 className="catalog-page-title">All <span className="gradient-text">Products</span></h1>
          <p className="catalog-subtitle">Discover our curated collection of premium products</p>
        </div>
      </section>

      {/* Body */}
      <section className="catalog-section">
        <div className="container">
          <div className="catalog-layout">
            <Sidebar />

            <div className="products-area">
              {/* Toolbar */}
              <div className="catalog-toolbar">
                <div className="toolbar-left">
                  <span className="product-count">
                    Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="toolbar-right">
                  <div className="sort-wrapper">
                    <label className="sort-label">Sort:</label>
                    <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                      <option value="default">Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                      <option value="name">Name A–Z</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                  <div className="view-toggle">
                    <button className={`view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} aria-label="Grid">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                    </button>
                    <button className={`view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} aria-label="List">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="3"/><rect x="3" y="10.5" width="18" height="3"/><rect x="3" y="17" width="18" height="3"/></svg>
                    </button>
                  </div>
                  <button className="filter-mobile-btn" onClick={() => setMobileFilterOpen(o => !o)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>
                    Filters
                  </button>
                </div>
              </div>

              {/* Products */}
              {paged.length === 0 ? (
                <div className="no-products">
                  <span className="no-products-icon">🔍</span>
                  <h3>No products found</h3>
                  <p>Try adjusting your filters</p>
                  <button className="btn-primary" onClick={resetFilters}>Reset Filters</button>
                </div>
              ) : (
                <div className={view === "grid" ? "products-grid" : "products-list"}>
                  {paged.map(p => <ProductCard key={p.id} product={p} view={view} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      className={`page-btn${page === n ? " active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile overlay */}
      {mobileFilterOpen && (
        <div className="filter-overlay" onClick={() => setMobileFilterOpen(false)} />
      )}
    </>
  );
}
