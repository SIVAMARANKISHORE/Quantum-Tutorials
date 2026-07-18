import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  Edit3,
  Lock,
  HeartHandshake
} from "lucide-react";

export default function Profile() {
  const { currentUser } = useAuth();
  const { updateEmployee } = useEmployees();

  // Modal controls
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Edit Form Fields
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [gender, setGender] = useState(currentUser?.gender || "Male");
  const [password, setPassword] = useState(currentUser?.password || "");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and Email are required fields.");
      return;
    }
    setError("");
    setSaving(true);

    const payload = {
      name,
      email,
      phone,
      location,
      gender,
      password
    };

    // If it's a virtual admin user, we mock success because we can't save admin metadata on /Employee API since they aren't on the API
    if (currentUser.id === "admin") {
      alert("Virtual Administrator profile settings updated locally!");
      setSaving(false);
      setShowEditModal(false);
      return;
    }

    const result = await updateEmployee(currentUser.id, payload);
    setSaving(false);
    if (result.success) {
      setShowEditModal(false);
    } else {
      setError(result.error || "Failed to update profile.");
    }
  };

  // Checklist of profile completion
  const checkList = [
    { label: "Account Email Address", check: !!currentUser?.email && currentUser?.email !== "No Email" },
    { label: "Phone Number Registered", check: !!currentUser?.phone && currentUser?.phone !== "-" },
    { label: "Office Base Location", check: !!currentUser?.location && currentUser?.location !== "Unknown Location" },
    { label: "Gender Information", check: !!currentUser?.gender },
    { label: "Custom Login Password", check: !!currentUser?.password && currentUser?.password !== "password123" }
  ];

  const completedCount = checkList.filter(item => item.check).length;
  const completionPercentage = Math.round((completedCount / checkList.length) * 100);

  return (
    <div className="page-content">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "32px" }}>
        
        {/* Left panel: Avatar card & Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Avatar card */}
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <div 
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                color: "#fff",
                fontSize: "28px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "var(--shadow-glow)",
                border: "2.5px solid rgba(255,255,255,0.08)"
              }}
            >
              {currentUser?.avatar || "AD"}
            </div>
            
            <h3 style={{ fontSize: "20px", fontWeight: 800 }}>{currentUser?.name}</h3>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "4px" }}>
              {currentUser?.jobTitle} · {currentUser?.department}
            </p>

            <span 
              className="badge" 
              style={{ 
                marginTop: "12px", 
                background: "var(--success-soft)", 
                color: "var(--success-light)" 
              }}
            >
              ● {currentUser?.status || "Active"}
            </span>

            {/* Trigger Edit Button */}
            <button 
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", height: "40px", marginTop: "24px", display: "flex", alignItems: "center", gap: "6px" }}
              onClick={() => {
                setName(currentUser?.name || "");
                setEmail(currentUser?.email || "");
                setPhone(currentUser?.phone || "");
                setLocation(currentUser?.location || "");
                setGender(currentUser?.gender || "Male");
                setPassword(currentUser?.password || "");
                setShowEditModal(true);
              }}
            >
              <Edit3 size={14} /> Update Credentials
            </button>
          </div>

          {/* Checklist */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}><Sparkles size={16} /> Profile Health Check</h3>
            
            {/* Completion indicator */}
            <div className="completion-container" style={{ marginBottom: "20px", borderBottom: "1px solid var(--border-light)", paddingBottom: "16px" }}>
              <div className="completion-circle" style={{ "--percentage": completionPercentage }}>
                {completionPercentage}%
              </div>
              <div>
                <h4 style={{ fontSize: "13.5px", fontWeight: 700 }}>Completion Health</h4>
                <p style={{ fontSize: "11.5px", marginTop: "2px" }}>
                  {completionPercentage === 100 
                    ? "Profile is complete. Looking healthy!" 
                    : "Complete all fields to verify identity records."}
                </p>
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {checkList.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifySelf: "stretch", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <span style={{ color: item.check ? "var(--text-main)" : "var(--text-muted)" }}>{item.label}</span>
                  <span 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      width: "18px", 
                      height: "18px", 
                      borderRadius: "50%",
                      background: item.check ? "var(--success-soft)" : "rgba(255,255,255,0.02)",
                      border: item.check ? "1px solid var(--success)" : "1px solid var(--border-light)",
                      color: item.check ? "var(--success-light)" : "var(--text-dimmed)",
                      fontSize: "9px"
                    }}
                  >
                    {item.check ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right panel: Details fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Card: Personal info */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "20px" }}><User size={16} /> Personal Details</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Legal Name</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px" }}>{currentUser?.name}</div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Email Address</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Mail size={13} className="text-gradient" /> {currentUser?.email}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Phone Number</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={13} style={{ color: "var(--info-light)" }} /> {currentUser?.phone || "-"}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>HQ Base Location</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={13} style={{ color: "var(--error-light)" }} /> {currentUser?.location || "Unknown Location"}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Gender Identity</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px" }}>{currentUser?.gender || "Male"}</div>
              </div>
            </div>
          </div>

          {/* Card: Professional/Work info */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "20px" }}><Shield size={16} /> Professional Parameters</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Corporate ID</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", fontFamily: "monospace" }}>{currentUser?.employeeId}</div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Department Division</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px" }}>{currentUser?.department}</div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Job Title Role</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px" }}>{currentUser?.jobTitle}</div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Corporate Portal Permission</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", textTransform: "capitalize" }}>{currentUser?.role || "employee"}</div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Date of Joining</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar size={13} style={{ color: "var(--primary-light)" }} /> {currentUser?.joinDate}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "11.5px", color: "var(--text-muted)", fontWeight: 600 }}>Salary Grade (Annual)</label>
                <div style={{ fontSize: "13.5px", fontWeight: 700, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <DollarSign size={13} style={{ color: "var(--success)" }} /> 
                  ₹{(currentUser?.salary || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── UPDATE PROFILE MODAL ── */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "520px" }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Personal Details</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {error && (
                  <div style={{ background: "var(--error-soft)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "var(--error-light)", fontSize: "12px", padding: "10px 14px", borderRadius: "var(--radius-sm)" }}>
                    {error}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Account</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Location Base</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Gender</label>
                    <select 
                      className="form-input" 
                      value={gender} 
                      onChange={e => setGender(e.target.value)}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Custom Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Set custom login password"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                  />
                  <small style={{ fontSize: "10px", color: "var(--text-dimmed)", marginTop: "4px" }}>
                    Leave blank to preserve password123 default credentials.
                  </small>
                </div>

              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Syncing API..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
