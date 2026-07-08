import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const METHODS = [
  { icon: "📧", label: "Email Us",   value: "hello@maarishop.com",    note: "We reply within 24 hours" },
  { icon: "📞", label: "Call Us",    value: "+1 (800) 555-MAARI",     note: "Mon–Fri, 9am–6pm EST" },
  { icon: "💬", label: "Live Chat",  value: "Available on site",     note: "Instant support, 24/7" },
  { icon: "📍", label: "Visit Us",   value: "128 Maari Avenue, NYC",  note: "Mon–Sat, 10am–8pm" },
];

export default function Contact() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent! We'll get back to you soon. 💌");
  };

  return (
    <>
      {/* Hero */}
      <section className="page-hero contact-hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="grid-overlay" />
        </div>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Contact</span>
          </div>
          <h1 className="hero-title page-hero-title">Get In <span className="gradient-text">Touch</span></h1>
          <p className="hero-subtitle">We'd love to hear from you. Our team is always here to help.</p>
        </div>
      </section>

      {/* Contact Body */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-layout">
            {/* Info */}
            <div className="contact-info">
              <h2 className="contact-info-title">Let's Talk</h2>
              <p className="contact-info-desc">Have a question about your order, a product, or anything else? We're happy to help!</p>
              <div className="contact-methods">
                {METHODS.map(m => (
                  <div key={m.label} className="contact-method">
                    <div className="method-icon">{m.icon}</div>
                    <div className="method-details">
                      <span className="method-label">{m.label}</span>
                      <span className="method-value">{m.value}</span>
                      <span className="method-note">{m.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrapper">
              {submitted ? (
                <div className="form-success">
                  <div className="success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: "1.5rem" }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <h3 className="form-title">Send a Message</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input type="text" name="firstName" className="form-input" placeholder="John" value={form.firstName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input type="text" name="lastName" className="form-input" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" className="form-input" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select name="subject" className="form-input" value={form.subject} onChange={handleChange}>
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="return">Return Request</option>
                      <option value="product">Product Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-input form-textarea" placeholder="Tell us how we can help you…" value={form.message} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn-primary form-submit">
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
