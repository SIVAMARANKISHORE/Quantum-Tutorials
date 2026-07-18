import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, User, ShieldAlert, KeyRound, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("employee"); // "employee" or "admin"
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please enter all required credentials.");
      return;
    }
    setError("");
    setLoading(true);
    
    // Simulate slight delay for realistic feel
    await new Promise(r => setTimeout(r, 600));

    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      if (result.role !== loginMode) {
        setError(`Access denied. You are trying to log in as ${loginMode === 'admin' ? 'Admin' : 'Employee'}, but your account role is ${result.role}.`);
        return;
      }
      
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/employee/home"); // Go to new employee home!
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
        background: "#050609"
      }}
    >
      {/* Visual background glows */}
      <div 
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(50px)"
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
          filter: "blur(50px)"
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "36px",
          boxShadow: "var(--shadow-lg)",
          background: "rgba(13, 16, 27, 0.6)",
          border: "1px solid var(--border-medium)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              boxShadow: "var(--shadow-glow)",
              color: "#fff",
              marginBottom: "16px"
            }}
          >
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 800 }}>AETHER HR</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Next-Generation Workforce Portal
          </p>
        </div>

        {/* Dual Role Toggle Tabs */}
        <div 
          className="login-tabs"
          style={{ 
            display: "flex", 
            background: "rgba(255,255,255,0.03)", 
            padding: "4px", 
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
            marginBottom: "24px"
          }}
        >
          <button
            id="employee-tab"
            className="tab-btn"
            data-role="employee"
            onClick={() => { setLoginMode("employee"); setError(""); }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: loginMode === "employee" ? "var(--bg-card)" : "transparent",
              color: loginMode === "employee" ? "var(--text-main)" : "var(--text-muted)",
              border: loginMode === "employee" ? "1px solid var(--border-light)" : "none",
              borderRadius: "10px",
              padding: "10px 0",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <User size={14} />
            Employee
          </button>
          <button
            id="admin-tab"
            className="tab-btn"
            data-role="admin"
            onClick={() => { setLoginMode("admin"); setError(""); }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: loginMode === "admin" ? "var(--bg-card)" : "transparent",
              color: loginMode === "admin" ? "var(--text-main)" : "var(--text-muted)",
              border: loginMode === "admin" ? "1px solid var(--border-light)" : "none",
              borderRadius: "10px",
              padding: "10px 0",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <ShieldAlert size={14} />
            Admin Portal
          </button>
        </div>

        {/* Dynamic error display */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "var(--error-soft)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "var(--error-light)",
                fontSize: "12px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                marginBottom: "20px",
                lineHeight: "1.4"
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              {loginMode === "admin" ? "Corporate Email" : "Employee ID"}
            </label>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                className="form-input"
                placeholder={loginMode === "admin" ? "e.g. admin@corp.com" : "e.g. EMP001"} 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ paddingLeft: "16px" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-input"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "44px" }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ marginTop: "10px", width: "100%", height: "44px" }} 
            disabled={loading}
          >
            {loading ? "Establishing session..." : `Sign In`}
          </button>
        </form>

        {/* Credentials guide box */}
        <div 
          style={{
            marginTop: "24px",
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px dashed var(--border-light)",
            padding: "12px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: "11px",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
            <KeyRound size={12} className="text-gradient" />
            <span>Sandbox Credentials</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span>Admin Portal:</span>
            <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>admin / admin</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
            <span>Employee:</span>
            <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>EMP001 / password123</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
