import { useEmployees } from "../context/EmployeeContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  Users, 
  UserCheck, 
  CalendarDays, 
  AlertTriangle, 
  Building2, 
  Banknote,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Check,
  X
} from "lucide-react";

const DEPT_ICONS = {
  Engineering: "⚙️", Marketing: "📢", Sales: "💼",
  "Human Resources": "🤝", Finance: "💰", Design: "🎨",
  Operations: "🔧", Legal: "⚖️",
};

const DEPT_COLORS = [
  "#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444"
];

export default function Dashboard() {
  const { 
    stats, 
    departmentData, 
    employees, 
    allAttendance, 
    allLeaves, 
    processLeaveRequest,
    announcements
  } = useEmployees();
  const navigate = useNavigate();

  const maxCount = Math.max(...departmentData.map((d) => d.count), 1);

  // Filter pending leaves for quick action (limit to 3)
  const pendingLeaves = allLeaves.filter(lv => lv.status === "Pending").slice(0, 3);

  // Dynamic Recent Activity: gather the last 4 clock-in and leave application actions
  const getRecentActivities = () => {
    const activities = [];
    
    // Gather clock-ins
    allAttendance.slice(0, 10).forEach(att => {
      activities.push({
        type: "attendance",
        text: `${att.name} clocked in at ${new Date(att.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        time: att.date,
        rawTime: new Date(att.clockIn).getTime(),
        color: "var(--success)"
      });
    });

    // Gather leaves
    allLeaves.slice(0, 10).forEach(lv => {
      activities.push({
        type: "leave",
        text: `${lv.name} applied for ${lv.type} (${lv.status})`,
        time: lv.requestDate,
        rawTime: new Date(lv.requestDate).getTime(),
        color: lv.status === "Pending" ? "var(--warning)" : "var(--primary-light)"
      });
    });

    // Sort by newest
    return activities
      .sort((a, b) => b.rawTime - a.rawTime)
      .slice(0, 5);
  };
  const recentActivities = getRecentActivities();

  // Gender demographics data for SVG Pie/Donut Chart
  const maleCount = employees.filter(e => e.gender === "Male").length;
  const femaleCount = employees.filter(e => e.gender === "Female").length;
  const otherCount = employees.filter(e => e.gender !== "Male" && e.gender !== "Female").length;
  const genderTotal = maleCount + femaleCount + otherCount || 1;

  const malePercent = Math.round((maleCount / genderTotal) * 100);
  const femalePercent = Math.round((femaleCount / genderTotal) * 100);
  const otherPercent = Math.round((otherCount / genderTotal) * 100);

  // SVG Donut calculation variables
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Stroke Dashoffsets
  const maleDash = circumference - (malePercent / 100) * circumference;
  const femaleDash = circumference - (femalePercent / 100) * circumference;
  const otherDash = circumference - (otherPercent / 100) * circumference;

  return (
    <div className="page-content">
      {/* Overview stats */}
      <div className="stats-grid">
        <div className="card stat-card" style={{ "--card-color": "#6366f1" }}>
          <div className="stat-icon-wrap" style={{ background: "rgba(99,102,241,0.12)", color: "var(--primary-light)" }}>
            <Users size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Strength</div>
            <div className="stat-change">Active workforce registered</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "#10b981" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--success-soft)", color: "var(--success-light)" }}>
            <UserCheck size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active Presence</div>
            <div className="stat-change">{stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total force</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "#f59e0b" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--warning-soft)", color: "var(--warning-light)" }}>
            <CalendarDays size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.onLeave}</div>
            <div className="stat-label">Out of Office</div>
            <div className="stat-change">Currently on approved leave</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "#ef4444" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--error-soft)", color: "var(--error-light)" }}>
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-label">Inactive Profiles</div>
            <div className="stat-change">Offboarded profiles archive</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "#3b82f6" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--info-soft)", color: "var(--info-light)" }}>
            <Building2 size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.departments}</div>
            <div className="stat-label">Departments</div>
            <div className="stat-change">Corporate divisions</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "#8b5cf6" }}>
          <div className="stat-icon-wrap" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>
            <Banknote size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value" style={{ fontSize: "19px" }}>
              ₹{stats.avgSalary.toLocaleString("en-IN")}
            </div>
            <div className="stat-label">Avg. Salary / yr</div>
            <div className="stat-change">Overall staff average</div>
          </div>
        </div>
      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-grid">
        
        {/* Left Column: Department stats & Leave Requests */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Department breakdown */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><Building2 size={16} /> Department Workforces</h3>
              <Link to="/admin/departments" style={{ fontSize: "12px", color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                Manage divisions
              </Link>
            </div>

            <div className="dept-grid" style={{ gridTemplateColumns: "1fr", gap: "16px", marginTop: "10px" }}>
              {departmentData.slice(0, 4).map((dept, i) => (
                <div key={dept.name} className="dept-item" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div 
                    style={{ 
                      width: "36px", 
                      height: "36px", 
                      borderRadius: "10px", 
                      background: DEPT_COLORS[i % DEPT_COLORS.length] + "20", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "16px" 
                    }}
                  >
                    {DEPT_ICONS[dept.name] || "🏢"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700 }}>{dept.name}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: DEPT_COLORS[i % DEPT_COLORS.length] }}>
                        {dept.count} Members
                      </span>
                    </div>

                    <div className="dept-bar-track" style={{ height: "5px" }}>
                      <div 
                        className="dept-bar-fill" 
                        style={{ 
                          width: `${(dept.count / maxCount) * 100}%`,
                          background: DEPT_COLORS[i % DEPT_COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Review Leave Board */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><CalendarDays size={16} /> Leaves Review Board</h3>
              <Link to="/admin/leave" style={{ fontSize: "12px", color: "var(--primary-light)", textDecoration: "none", fontWeight: 600 }}>
                View all reviews
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
              {pendingLeaves.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "var(--text-dimmed)" }}>
                  <Sparkles size={28} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                  <p style={{ fontSize: "12.5px" }}>Leaves approval queue is clear!</p>
                </div>
              ) : (
                pendingLeaves.map(req => (
                  <div 
                    key={req.id} 
                    style={{ 
                      padding: "12px 16px", 
                      background: "rgba(255,255,255,0.01)", 
                      border: "1px solid var(--border-light)", 
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px" }}>{req.name}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {req.type} · {req.startDate} to {req.endDate}
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button 
                        className="btn btn-success btn-sm"
                        style={{ padding: "6px" }}
                        onClick={() => processLeaveRequest(req.employeeDbId, req.id, "Approved")}
                        title="Approve leave"
                      >
                        <Check size={14} />
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ padding: "6px" }}
                        onClick={() => processLeaveRequest(req.employeeDbId, req.id, "Rejected")}
                        title="Reject leave"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Demographics Donut Chart & Activity Logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Gender Demographics SVG Donut Chart */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "20px" }}><TrendingUp size={16} /> Staff Demographics</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              {/* Donut Chart drawing */}
              <div style={{ position: "relative", width: "120px", height: "120px" }}>
                <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                  {/* Underlay Track */}
                  <circle cx="60" cy="60" r="50" fill="transparent" stroke="var(--border-light)" strokeWidth="12" />
                  
                  {/* Male Stroke */}
                  <circle 
                    cx="60" cy="60" r="50" 
                    fill="transparent" 
                    stroke="var(--primary-light)" 
                    strokeWidth="12" 
                    strokeDasharray={circumference}
                    strokeDashoffset={maleDash}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s" }}
                  />
                  
                  {/* Female Stroke (overlayed with offset, but simplified we use stacked HTML labels or basic strokes) */}
                  <circle 
                    cx="60" cy="60" r="50" 
                    fill="transparent" 
                    stroke="#ec4899" 
                    strokeWidth="12" 
                    strokeDasharray={circumference}
                    strokeDashoffset={femaleDash}
                    strokeLinecap="round"
                    style={{ 
                      transform: `rotate(${(malePercent / 100) * 360}deg)`,
                      transformOrigin: "60px 60px",
                      transition: "stroke-dashoffset 0.8s" 
                    }}
                  />
                </svg>
                {/* Centered count */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>{employees.length}</div>
                  <span style={{ fontSize: "9px", color: "var(--text-muted)", textTransform: "uppercase" }}>Total</span>
                </div>
              </div>

              {/* Chart labels */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--primary-light)" }} />
                  <span style={{ color: "var(--text-muted)" }}>Male:</span>
                  <strong style={{ marginLeft: "auto" }}>{malePercent}%</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ec4899" }} />
                  <span style={{ color: "var(--text-muted)" }}>Female:</span>
                  <strong style={{ marginLeft: "auto" }}>{femalePercent}%</strong>
                </div>
                {otherPercent > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--border-light)" }} />
                    <span style={{ color: "var(--text-muted)" }}>Other:</span>
                    <strong style={{ marginLeft: "auto" }}>{otherPercent}%</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Recent activity */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}><Clock size={16} /> Operations Stream</h3>
            
            <div className="activity-feed">
              {recentActivities.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-dimmed)", fontSize: "12px" }}>
                  No activities registered today.
                </div>
              ) : (
                recentActivities.map((act, i) => (
                  <div key={i} className="activity-feed-item">
                    <div className="activity-feed-marker" style={{ background: act.color }} />
                    <div className="activity-feed-content">
                      <div className="activity-feed-text" style={{ fontSize: "12.5px" }}>{act.text}</div>
                      <div className="activity-feed-time">{act.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
