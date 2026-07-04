import { useMemo, useState } from 'react'

const products = [
  {
    id: 1,
    name: 'Aurora Wireless Headphones',
    category: 'Audio',
    price: 129,
    oldPrice: 169,
    rating: 4.8,
    stock: 'In stock',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    tag: 'Best Seller',
  },
  {
    id: 2,
    name: 'Nomad Smart Backpack',
    category: 'Travel',
    price: 94,
    oldPrice: 120,
    rating: 4.6,
    stock: 'In stock',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    tag: 'New',
  },
  {
    id: 3,
    name: 'Luma Desk Lamp',
    category: 'Home',
    price: 76,
    oldPrice: 89,
    rating: 4.7,
    stock: 'Only 4 left',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    tag: 'Popular',
  },
  {
    id: 4,
    name: 'Pulse Fitness Watch',
    category: 'Wearables',
    price: 149,
    oldPrice: 199,
    rating: 4.5,
    stock: 'In stock',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    tag: 'Deal',
  },
  {
    id: 5,
    name: 'Terra Ceramic Planter',
    category: 'Home',
    price: 38,
    oldPrice: 46,
    rating: 4.4,
    stock: 'In stock',
    image:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
    tag: 'Eco Pick',
  },
  {
    id: 6,
    name: 'Atlas Everyday Sneakers',
    category: 'Fashion',
    price: 112,
    oldPrice: 140,
    rating: 4.9,
    stock: 'Only 2 left',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    tag: 'Top Rated',
  },
]

const categories = ['All', ...new Set(products.map((product) => product.category))]

function ProductCatalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
        const matchesCategory = category === 'All' || product.category === category

        return matchesSearch && matchesCategory
      })
      .sort((first, second) => {
        if (sortBy === 'price-low') return first.price - second.price
        if (sortBy === 'price-high') return second.price - first.price
        if (sortBy === 'rating') return second.rating - first.rating
        return first.id - second.id
      })
  }, [category, query, sortBy])

  return (
    <>
      <main className="catalog-page">
        <section className="catalog-shell" aria-label="Product catalog">
          <div className="catalog-header">
            <div>
              <p className="eyebrow">Premium Storefront</p>
              <h1>Product Catalog</h1>
              <p className="intro">
                Discover curated essentials with fast filtering, clear pricing, and
                polished product cards.
              </p>
            </div>

            <div className="catalog-stats" aria-label="Catalog summary">
              <span>{products.length} Products</span>
              <strong>Up to 30% off</strong>
            </div>
          </div>

          <div className="toolbar" aria-label="Catalog controls">
            <label className="search-field">
              <span>Search products</span>
              <input
                type="search"
                placeholder="Search by name or category"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label className="select-field">
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="select-field">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </label>
          </div>

          <div className="category-tabs" aria-label="Product categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? 'active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.tag}</span>
                </div>

                <div className="product-content">
                  <div className="product-meta">
                    <span>{product.category}</span>
                    <strong>{product.rating.toFixed(1)} / 5</strong>
                  </div>

                  <h2>{product.name}</h2>

                  <div className="price-row">
                    <div>
                      <strong>${product.price}</strong>
                      <span>${product.oldPrice}</span>
                    </div>
                    <p>{product.stock}</p>
                  </div>

                  <button type="button" className="add-button">
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try another search term or choose a different category.</p>
            </div>
          )}
        </section>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #eef1f4;
          color: #19212b;
        }

        .catalog-page {
          min-height: 100vh;
          padding: 40px 20px;
          background:
            linear-gradient(135deg, rgba(22, 121, 117, 0.12), transparent 34%),
            linear-gradient(315deg, rgba(230, 126, 78, 0.14), transparent 30%),
            #eef1f4;
        }

        .catalog-shell {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .catalog-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: end;
          margin-bottom: 28px;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #167975;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h1,
        h2,
        p {
          margin-top: 0;
        }

        .catalog-header h1 {
          margin-bottom: 12px;
          font-size: clamp(2.2rem, 5vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: 0;
        }

        .intro {
          max-width: 620px;
          margin-bottom: 0;
          color: #5c6673;
          font-size: 1.04rem;
          line-height: 1.7;
        }

        .catalog-stats {
          min-width: 190px;
          padding: 18px;
          border: 1px solid rgba(25, 33, 43, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.76);
          box-shadow: 0 18px 45px rgba(25, 33, 43, 0.08);
        }

        .catalog-stats span,
        .catalog-stats strong {
          display: block;
        }

        .catalog-stats span {
          color: #6b7480;
          font-size: 0.86rem;
          margin-bottom: 6px;
        }

        .catalog-stats strong {
          font-size: 1.18rem;
        }

        .toolbar {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) minmax(170px, 220px) minmax(190px, 240px);
          gap: 14px;
          align-items: end;
          margin-bottom: 18px;
          padding: 16px;
          border: 1px solid rgba(25, 33, 43, 0.1);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: 0 20px 55px rgba(25, 33, 43, 0.08);
        }

        .search-field,
        .select-field {
          display: grid;
          gap: 8px;
          color: #53606d;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          border: 1px solid #d5dbe1;
          border-radius: 8px;
          background: #ffffff;
          color: #19212b;
          font: inherit;
          font-size: 0.95rem;
          outline: none;
          padding: 0 14px;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        input:focus,
        select:focus {
          border-color: #167975;
          box-shadow: 0 0 0 4px rgba(22, 121, 117, 0.14);
        }

        .category-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .category-tabs button {
          min-height: 40px;
          border: 1px solid rgba(25, 33, 43, 0.12);
          border-radius: 999px;
          background: #ffffff;
          color: #53606d;
          cursor: pointer;
          font: inherit;
          font-weight: 800;
          padding: 0 16px;
          transition: background 160ms ease, border-color 160ms ease, color 160ms ease;
        }

        .category-tabs button.active,
        .category-tabs button:hover {
          border-color: #167975;
          background: #167975;
          color: #ffffff;
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .product-card {
          overflow: hidden;
          border: 1px solid rgba(25, 33, 43, 0.1);
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 20px 55px rgba(25, 33, 43, 0.1);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 70px rgba(25, 33, 43, 0.14);
        }

        .product-image {
          position: relative;
          aspect-ratio: 4 / 3;
          background: #dfe5ea;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 240ms ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.04);
        }

        .product-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          border-radius: 999px;
          background: #ffffff;
          color: #19212b;
          font-size: 0.76rem;
          font-weight: 800;
          padding: 7px 11px;
          box-shadow: 0 10px 24px rgba(25, 33, 43, 0.14);
        }

        .product-content {
          padding: 18px;
        }

        .product-meta,
        .price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .product-meta {
          margin-bottom: 12px;
          color: #697482;
          font-size: 0.84rem;
          font-weight: 800;
        }

        .product-meta strong {
          color: #d97706;
        }

        .product-content h2 {
          min-height: 58px;
          margin-bottom: 16px;
          color: #19212b;
          font-size: 1.18rem;
          line-height: 1.32;
          letter-spacing: 0;
        }

        .price-row {
          margin-bottom: 18px;
        }

        .price-row strong {
          display: inline-block;
          margin-right: 8px;
          font-size: 1.4rem;
        }

        .price-row span {
          color: #8c96a3;
          text-decoration: line-through;
        }

        .price-row p {
          margin-bottom: 0;
          border-radius: 999px;
          background: #f0f7f5;
          color: #167975;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 7px 10px;
          white-space: nowrap;
        }

        .add-button {
          width: 100%;
          min-height: 46px;
          border: 0;
          border-radius: 8px;
          background: #19212b;
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          font-weight: 900;
          transition: background 160ms ease, transform 160ms ease;
        }

        .add-button:hover {
          background: #167975;
          transform: translateY(-1px);
        }

        .empty-state {
          padding: 42px 20px;
          border: 1px dashed #c7d0d8;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.72);
          text-align: center;
        }

        .empty-state h2 {
          margin-bottom: 8px;
        }

        .empty-state p {
          margin-bottom: 0;
          color: #687482;
        }

        @media (max-width: 900px) {
          .catalog-header,
          .toolbar {
            grid-template-columns: 1fr;
          }

          .catalog-stats {
            min-width: 0;
          }

          .catalog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .catalog-page {
            padding: 26px 14px;
          }

          .catalog-header h1 {
            font-size: 2.5rem;
          }

          .catalog-grid {
            grid-template-columns: 1fr;
          }

          .toolbar {
            padding: 12px;
          }

          .product-content h2 {
            min-height: auto;
          }
        }
      `}</style>
    </>
  )
}

export default ProductCatalog
