import { useEmployees } from "../context/EmployeeContext";

const DEPT_ICONS = {
  Engineering: "⚙️", Marketing: "📢", Sales: "💼",
  "Human Resources": "🤝", Finance: "💰", Design: "🎨",
  Operations: "🔧", Legal: "⚖️",
};

const DEPT_COLORS = [
  "#6C63FF","#FF6584","#43D9AD","#F7B731","#4B7BEC","#8854D0","#0FB9B1","#FC5C65",
];

const ACTIVITIES = [
  { text: "Arjun Sharma updated his profile", time: "2 min ago",  color: "#6C63FF" },
  { text: "Nandini Desai joined Engineering",  time: "15 min ago", color: "#43D9AD" },
  { text: "Vikram Singh's leave approved",     time: "1 hr ago",   color: "#F7B731" },
  { text: "Meera Krishnan marked inactive",    time: "3 hrs ago",  color: "#FC5C65" },
  { text: "Payroll processed for June 2025",   time: "1 day ago",  color: "#4B7BEC" },
];

export default function Dashboard() {
  const { stats, departmentData, employees } = useEmployees();

  const maxCount = Math.max(...departmentData.map((d) => d.count), 1);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, <span className="glow">Admin</span> 👋</h1>
          <p className="page-subtitle">Here's what's happening with your team today.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ "--card-color": "#6C63FF" }}>
          <div className="stat-icon" style={{ background: "rgba(108,99,255,0.15)" }}>👥</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: "#6C63FF" }}>{stats.total}</div>
            <div className="stat-label">Total Employees</div>
            <div className="stat-change">↑ 3 this month</div>
          </div>
        </div>

        <div className="stat-card" style={{ "--card-color": "#43D9AD" }}>
          <div className="stat-icon" style={{ background: "rgba(67,217,173,0.15)" }}>✅</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: "#43D9AD" }}>{stats.active}</div>
            <div className="stat-label">Active Employees</div>
            <div className="stat-change">{Math.round((stats.active / stats.total) * 100)}% of workforce</div>
          </div>
        </div>

        <div className="stat-card" style={{ "--card-color": "#F7B731" }}>
          <div className="stat-icon" style={{ background: "rgba(247,183,49,0.15)" }}>🏖️</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: "#F7B731" }}>{stats.onLeave}</div>
            <div className="stat-label">On Leave</div>
            <div className="stat-change">Currently away</div>
          </div>
        </div>

        <div className="stat-card" style={{ "--card-color": "#FC5C65" }}>
          <div className="stat-icon" style={{ background: "rgba(252,92,101,0.15)" }}>⛔</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: "#FC5C65" }}>{stats.inactive}</div>
            <div className="stat-label">Inactive</div>
            <div className="stat-change">Needs review</div>
          </div>
        </div>

        <div className="stat-card" style={{ "--card-color": "#4B7BEC" }}>
          <div className="stat-icon" style={{ background: "rgba(75,123,236,0.15)" }}>🏢</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: "#4B7BEC" }}>{stats.departments}</div>
            <div className="stat-label">Departments</div>
            <div className="stat-change">Across all teams</div>
          </div>
        </div>

        <div className="stat-card" style={{ "--card-color": "#8854D0" }}>
          <div className="stat-icon" style={{ background: "rgba(136,84,208,0.15)" }}>💰</div>
          <div className="stat-info">
            <div className="stat-value" style={{ color: "#8854D0", fontSize: 20 }}>
              ₹{stats.avgSalary.toLocaleString("en-IN")}
            </div>
            <div className="stat-label">Avg. Salary / yr</div>
            <div className="stat-change">Across all roles</div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Department Breakdown */}
        <div className="card">
          <h3 className="section-title">🏢 Department Breakdown</h3>
          <div className="dept-list">
            {departmentData.map((dept, i) => (
              <div key={dept.name} className="dept-item">
                <div className="dept-icon" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] + "22" }}>
                  {DEPT_ICONS[dept.name] || "🏢"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="dept-name">{dept.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: DEPT_COLORS[i % DEPT_COLORS.length] }}>
                      {dept.count}
                    </span>
                  </div>
                  <div className="dept-bar-track">
                    <div className="dept-bar-fill"
                      style={{
                        width: `${(dept.count / maxCount) * 100}%`,
                        background: DEPT_COLORS[i % DEPT_COLORS.length],
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                    {dept.active} active · Avg ₹{dept.avgSalary.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 className="section-title">⚡ Recent Activity</h3>
            <div className="activity-list">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{ background: a.color }} />
                  <span className="activity-text">{a.text}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="section-title">📊 Quick Stats</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Male Employees",   val: employees.filter(e => e.gender === "Male").length,   color: "#4B7BEC" },
                { label: "Female Employees", val: employees.filter(e => e.gender === "Female").length, color: "#FF6584" },
                { label: "Senior (5+ yrs)",  val: employees.filter(e => new Date().getFullYear() - new Date(e.joinDate).getFullYear() >= 5).length, color: "#43D9AD" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.label}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--bg-hover)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(s.val / stats.total) * 100}%`, background: s.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color, minWidth: 24, textAlign: "right" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
