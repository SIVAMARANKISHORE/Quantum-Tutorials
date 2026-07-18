import { useMemo, useState } from 'react'
import './App.css'

const starterProducts = [
  {
    id: 1,
    name: 'Aurora Wireless Headphones',
    sku: 'AUD-1048',
    category: 'Audio',
    price: 129,
    stock: 42,
    supplier: 'Northline Supply',
    rating: 4.8,
    status: 'Ready',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Nomad Smart Backpack',
    sku: 'TRV-2210',
    category: 'Travel',
    price: 94,
    stock: 18,
    supplier: 'Atlas Goods',
    rating: 4.6,
    status: 'Ready',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Luma Desk Lamp',
    sku: 'HOM-7732',
    category: 'Home',
    price: 76,
    stock: 7,
    supplier: 'Brightworks',
    rating: 4.7,
    status: 'Review',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Pulse Fitness Watch',
    sku: 'WBL-5401',
    category: 'Wearables',
    price: 149,
    stock: 24,
    supplier: 'Meridian Tech',
    rating: 4.5,
    status: 'Ready',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  },
]

const sampleExtractText = `Orbit Travel Mug | SKU: KIT-9012 | Category: Kitchen | Price: $32 | Stock: 64 | Supplier: Urban Forge
Canvas Weekender Bag, SKU FSH-3188, category Fashion, price 118, stock 11, supplier Studio Vale
Glass Plant Mister - HOM-4560 - Home - $26 - 35 units - Greenhouse Co`

const productImages = [
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
]

function titleCase(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function findValue(text, label) {
  const expression = new RegExp(`${label}\\s*[:=-]?\\s*([^|,;\\n-]+)`, 'i')
  return text.match(expression)?.[1]?.trim()
}

function extractProducts(rawText, existingCount) {
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = line
        .split(/\s+\|\s+|\s+-\s+|,/)
        .map((part) => part.trim())
        .filter(Boolean)

      const sku = line.match(/\b[A-Z]{3}-\d{4}\b/)?.[0] ?? `EXT-${existingCount + index + 1}`
      const price = Number((line.match(/\$?\b\d+(?:\.\d{1,2})?\b/)?.[0] ?? '0').replace('$', ''))
      const stockMatch = line.match(/stock\s*[:=-]?\s*(\d+)|(\d+)\s*units?/i)
      const stock = Number(stockMatch?.[1] ?? stockMatch?.[2] ?? 0)
      const category = findValue(line, 'category') ?? parts[2] ?? 'Unsorted'
      const supplier = findValue(line, 'supplier') ?? parts[5] ?? 'Imported Source'
      const name = parts[0]
        .replace(/\bsku\s*[:=-]?\s*[A-Z]{3}-\d{4}\b/i, '')
        .trim()

      return {
        id: Date.now() + index,
        name: titleCase(name || `Extracted Product ${index + 1}`),
        sku,
        category: titleCase(category.replace(/\$/g, '')),
        price,
        stock,
        supplier: titleCase(supplier),
        rating: 4.2 + (index % 5) / 10,
        status: price && stock ? 'Imported' : 'Review',
        image: productImages[index % productImages.length],
      }
    })
}

function App() {
  const [products, setProducts] = useState(starterProducts)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [extractText, setExtractText] = useState(sampleExtractText)
  const [selectedProduct, setSelectedProduct] = useState(starterProducts[0])

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products
      .filter((product) => {
        const matchesSearch = [product.name, product.sku, product.category, product.supplier]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
        const matchesCategory = category === 'All' || product.category === category

        return matchesSearch && matchesCategory
      })
      .sort((first, second) => {
        if (sortBy === 'price-low') return first.price - second.price
        if (sortBy === 'price-high') return second.price - first.price
        if (sortBy === 'stock') return second.stock - first.stock
        return first.id - second.id
      })
  }, [category, products, query, sortBy])

  const summary = useMemo(() => {
    const inventoryValue = products.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    )
    const reviewItems = products.filter((product) => product.status === 'Review').length

    return {
      totalProducts: products.length,
      inventoryValue,
      reviewItems,
      suppliers: new Set(products.map((product) => product.supplier)).size,
    }
  }, [products])

  function handleExtract() {
    const extracted = extractProducts(extractText, products.length)
    if (!extracted.length) return

    setProducts((currentProducts) => [...extracted, ...currentProducts])
    setSelectedProduct(extracted[0])
    setQuery('')
    setCategory('All')
  }

  function handleStatusChange(productId, status) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, status } : product,
      ),
    )
    setSelectedProduct((product) =>
      product?.id === productId ? { ...product, status } : product,
    )
  }

  return (
    <main className="catalog-app">
      <aside className="extract-panel" aria-label="Product extraction panel">
        <div className="brand">
          <span>PC</span>
          <div>
            <strong>Catalog Extract</strong>
            <small>Product intake studio</small>
          </div>
        </div>

        <label className="extract-box">
          <span>Paste supplier list</span>
          <textarea
            value={extractText}
            onChange={(event) => setExtractText(event.target.value)}
            rows="10"
          />
        </label>

        <button className="primary-button" type="button" onClick={handleExtract}>
          Extract Products
        </button>

        <div className="format-note">
          <strong>Accepted fields</strong>
          <p>Name, SKU, category, price, stock, and supplier can be separated by pipes, commas, or dashes.</p>
        </div>

        {selectedProduct && (
          <section className="review-card" aria-label="Selected product review">
            <span className="section-label">Quick Review</span>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <h2>{selectedProduct.name}</h2>
            <dl>
              <div>
                <dt>SKU</dt>
                <dd>{selectedProduct.sku}</dd>
              </div>
              <div>
                <dt>Supplier</dt>
                <dd>{selectedProduct.supplier}</dd>
              </div>
              <div>
                <dt>Stock</dt>
                <dd>{selectedProduct.stock} units</dd>
              </div>
            </dl>
          </section>
        )}
      </aside>

      <section className="workspace" aria-label="Product catalog workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Product Operations</p>
            <h1>Product Catalog</h1>
          </div>
          <div className="operator-chip">
            <span>Extraction status</span>
            <strong>{summary.reviewItems ? `${summary.reviewItems} to review` : 'Clean'}</strong>
          </div>
        </header>

        <section className="metrics" aria-label="Catalog metrics">
          <article>
            <span>Products</span>
            <strong>{summary.totalProducts}</strong>
          </article>
          <article>
            <span>Inventory Value</span>
            <strong>${summary.inventoryValue.toLocaleString()}</strong>
          </article>
          <article>
            <span>Suppliers</span>
            <strong>{summary.suppliers}</strong>
          </article>
          <article>
            <span>Needs Review</span>
            <strong>{summary.reviewItems}</strong>
          </article>
        </section>

        <section className="control-bar" aria-label="Catalog controls">
          <label>
            <span>Search</span>
            <input
              type="search"
              placeholder="Name, SKU, category, supplier"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
              <option value="stock">Most stock</option>
            </select>
          </label>
        </section>

        <div className="category-tabs" aria-label="Category filters">
          {categories.map((item) => (
            <button
              className={category === item ? 'active' : ''}
              key={item}
              type="button"
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="catalog-layout">
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article
                className={selectedProduct?.id === product.id ? 'product-card active' : 'product-card'}
                key={product.id}
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.image} alt={product.name} />
                <div className="product-body">
                  <div className="product-meta">
                    <span>{product.category}</span>
                    <strong>{product.rating.toFixed(1)}</strong>
                  </div>
                  <h2>{product.name}</h2>
                  <p>{product.sku} • {product.supplier}</p>
                  <div className="price-row">
                    <strong>${product.price}</strong>
                    <span>{product.stock} units</span>
                  </div>
                  <div className="status-actions">
                    {['Ready', 'Review', 'Imported'].map((status) => (
                      <button
                        className={product.status === status ? 'selected' : ''}
                        key={status}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleStatusChange(product.id, status)
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="table-panel" aria-label="Extracted product table">
            <div className="panel-heading">
              <span className="section-label">Extraction Table</span>
              <strong>{filteredProducts.length} shown</strong>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>
                        <span className={`status-pill ${product.status.toLowerCase()}`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        </section>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try another search, category, or extract a new supplier list.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
