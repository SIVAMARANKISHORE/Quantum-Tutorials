import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">✦</span> MaariShop
            </Link>
            <p className="footer-tagline">Curating premium experiences, one product at a time.</p>
            <div className="social-links">
              <a href="#" className="social-btn" aria-label="Twitter">𝕏</a>
              <a href="#" className="social-btn" aria-label="Instagram">📷</a>
              <a href="#" className="social-btn" aria-label="Facebook">f</a>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/catalog">All Products</Link></li>
              <li><Link to="/catalog?filter=new">New Arrivals</Link></li>
              <li><Link to="/catalog?filter=sale">Sale</Link></li>
              <li><Link to="/catalog?filter=featured">Featured</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 MaariShop. All rights reserved.</p>
          <p>Made with ❤️ for premium shoppers</p>
        </div>
      </div>
    </footer>
  );
}
