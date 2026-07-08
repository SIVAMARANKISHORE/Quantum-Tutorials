import { Link } from "react-router-dom";

const TEAM = [
  { id: 1, name: "Alex Johnson",  role: "CEO & Founder",    initials: "AJ", bio: "Visionary leader with 15 years in luxury retail and e-commerce innovation." },
  { id: 2, name: "Sophia Chen",   role: "Head of Curation", initials: "SC", bio: "Former fashion editor turned product expert. Eye for the extraordinary." },
  { id: 3, name: "Marcus Rivera", role: "Chief Technology",  initials: "MR", bio: "Tech architect building seamless experiences that delight customers." },
  { id: 4, name: "Priya Williams", role: "Customer Success", initials: "PW", bio: "Champion for our community. Ensures every customer feels valued." },
];

const VALUES = [
  { icon: "🎯", title: "Quality First",    desc: "Every product is rigorously tested and verified before it reaches you." },
  { icon: "🌿", title: "Sustainable",      desc: "Eco-conscious choices and partnerships for a better tomorrow." },
  { icon: "💎", title: "Premium Value",    desc: "Luxury at fair, transparent pricing — always." },
  { icon: "🤝", title: "Customer Trust",   desc: "Your satisfaction is at the heart of everything we do." },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero about-hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="grid-overlay" />
        </div>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>About</span>
          </div>
          <h1 className="hero-title page-hero-title">Our <span className="gradient-text">Story</span></h1>
          <p className="hero-subtitle">Passion for quality. Commitment to excellence. A love for the premium.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-layout">
            <div className="mission-content">
              <span className="section-tag">Our Mission</span>
              <h2 className="section-title">We Believe in <span className="gradient-text">Better</span></h2>
              <p className="mission-text">
                MaariShop was founded in 2020 with a simple belief: everyone deserves access to premium quality products.
                We carefully curate every item in our catalog, ensuring it meets our exacting standards for design, durability, and value.
              </p>
              <p className="mission-text">
                Our team of product experts scours the globe for the finest goods, from cutting-edge electronics to timeless fashion pieces.
                We partner with brands that share our commitment to sustainability and ethical manufacturing.
              </p>
              <div className="mission-values">
                {VALUES.map(v => (
                  <div key={v.title} className="value-item">
                    <span className="value-icon">{v.icon}</span>
                    <div>
                      <h4>{v.title}</h4>
                      <p>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mission-visual">
              <div className="about-stats-card">
                {[
                  { num: "2.4K+", label: "Products Curated" },
                  { num: "150+",  label: "Global Brands" },
                  { num: "98%",   label: "Customer Satisfaction" },
                  { num: "50+",   label: "Countries Served" },
                ].map(s => (
                  <div key={s.label} className="about-stat">
                    <span className="about-stat-num">{s.num}</span>
                    <span className="about-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The People</span>
            <h2 className="section-title">Meet Our <span className="gradient-text">Team</span></h2>
            <p className="section-sub">Passionate individuals dedicated to bringing you the best</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <div key={m.id} className="team-card">
                <div className={`team-avatar ta-${i + 1}`}>{m.initials}</div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-role">{m.role}</p>
                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="promo-card">
            <div className="promo-orb p-orb-1" />
            <div className="promo-orb p-orb-2" />
            <div className="promo-content" style={{ textAlign: "center", margin: "0 auto" }}>
              <span className="promo-tag">Ready to Shop?</span>
              <h2 className="promo-title">Explore Our <span className="gradient-text">Collection</span></h2>
              <p className="promo-desc">Thousands of premium products waiting to be discovered.</p>
              <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
