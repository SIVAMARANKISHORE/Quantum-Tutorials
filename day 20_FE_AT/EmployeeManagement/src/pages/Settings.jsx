import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Bell, Shield, Lock, Eye, Monitor } from "lucide-react";

export default function Settings() {
  const { currentUser } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [notifyClock, setNotifyClock] = useState(true);
  const [notifyLeaves, setNotifyLeaves] = useState(true);
  const [notifyAnnounce, setNotifyAnnounce] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <div className="page-content">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
        {/* Left column - Navigation info */}
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px" }}>Workspace Settings</h2>
          <p style={{ fontSize: "13.5px", lineHeight: "1.6" }}>
            Configure your Aether Workspace parameters, adjust notification feeds, and view credential attributes.
          </p>
          <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
              <Monitor size={18} className="text-gradient" />
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700 }}>Workspace UI</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Active: Slate-Dark</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
              <Shield size={18} style={{ color: "var(--success)" }} />
              <div>
                <div style={{ fontSize: "12.5px", fontWeight: 700 }}>Security Compliance</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Level: Standard Enterprise</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Main form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Section: Interface preferences */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "20px" }}><Monitor size={16} /> Theme & Layout</h3>
            
            <div className="form-group">
              <label className="form-label">Active Workspace Theme</label>
              <div style={{ display: "flex", gap: "12px" }}>
                {["dark", "slate-light", "system"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: theme === t ? "var(--primary-soft)" : "rgba(255,255,255,0.02)",
                      border: theme === t ? "1.5px solid var(--primary)" : "1px solid var(--border-light)",
                      color: theme === t ? "var(--primary-light)" : "var(--text-muted)",
                      fontWeight: 700,
                      fontSize: "12px",
                      borderRadius: "var(--radius-md)",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {t} Theme
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Timezone Display</label>
              <select className="form-input" defaultValue="in">
                <option value="in">India Standard Time (IST) - GMT +5:30</option>
                <option value="utc">Coordinated Universal Time (UTC)</option>
                <option value="est">Eastern Standard Time (EST) - GMT -5:00</option>
              </select>
            </div>
          </div>

          {/* Section: Notifications settings */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "20px" }}><Bell size={16} /> Notifications Feed</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700 }}>Attendance Shift Reminders</div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>Alert when shift active exceeds 8 hours.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyClock}
                  onChange={e => setNotifyClock(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} 
                />
              </div>

              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "14px" }}>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700 }}>Leave Request Status Alerts</div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>Receive alerts when leave is approved/rejected.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyLeaves}
                  onChange={e => setNotifyLeaves(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} 
                />
              </div>

              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "14px" }}>
                <div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700 }}>New Broadcast Notifications</div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>Display badge overlay for pinned announcements.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyAnnounce}
                  onChange={e => setNotifyAnnounce(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }} 
                />
              </div>
            </div>
          </div>

          {/* Section: Session details */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}><Lock size={16} /> Security Credentials</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Corporate ID:</span>
                <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{currentUser?.employeeId || "EMP000"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-light)" }}>
                <span style={{ color: "var(--text-muted)" }}>Email Account:</span>
                <span style={{ fontWeight: 700 }}>{currentUser?.email || "admin@corp.com"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Portal Role:</span>
                <span style={{ fontWeight: 700, textTransform: "capitalize", color: "var(--primary-light)" }}>{currentUser?.role || "employee"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
