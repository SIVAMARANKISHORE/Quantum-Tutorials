import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { motion } from "framer-motion";
import { 
  Clock, 
  Calendar, 
  PlaneTakeoff, 
  Megaphone, 
  ArrowRight, 
  CheckCircle,
  HelpCircle,
  FileCheck,
  UserCheck
} from "lucide-react";

export default function Home() {
  const { currentUser } = useAuth();
  const { clockInEmployee, clockOutEmployee, announcements, allLeaves } = useEmployees();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Keep digital clock updating
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = time.toISOString().split("T")[0];

  // Retrieve today's attendance record
  const todayRecord = (currentUser?.attendance || []).find(r => r.date === todayStr);
  const isClockedIn = todayRecord && !todayRecord.clockOut;

  // Live session timer logic
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  useEffect(() => {
    let timerId;
    if (isClockedIn && todayRecord?.clockIn) {
      const updateTimer = () => {
        const start = new Date(todayRecord.clockIn).getTime();
        const diff = Math.max(0, new Date().getTime() - start);
        
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        
        setElapsedTime(
          `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      };
      
      updateTimer();
      timerId = setInterval(updateTimer, 1000);
    } else {
      setElapsedTime("00:00:00");
    }
    return () => clearInterval(timerId);
  }, [isClockedIn, todayRecord]);

  // Leave calculations
  const approvedLeaves = (currentUser?.leaves || [])
    .filter(l => l.status === "Approved")
    .reduce((sum, l) => {
      const start = new Date(l.startDate);
      const end = new Date(l.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return sum + diffDays;
    }, 0);

  const totalLeavesAllocated = 24;
  const remainingLeaves = Math.max(0, totalLeavesAllocated - approvedLeaves);

  // Profile completion calculator
  const calculateProfileCompletion = () => {
    if (!currentUser) return 0;
    const fields = ['name', 'email', 'phone', 'location', 'gender', 'department', 'jobTitle', 'joinDate'];
    const completed = fields.filter(f => currentUser[f] && currentUser[f] !== "-").length;
    return Math.round((completed / fields.length) * 100);
  };
  const profileCompletion = calculateProfileCompletion();

  // Weekly attendance logs (last 5 work days Mon-Fri)
  const getWeeklyAttendance = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const currentDay = new Date().getDay(); // 0 is Sun, 1 is Mon
    
    return days.map((dayName, idx) => {
      // Index in array corresponds to Mon-Fri (1 to 5)
      const dayOffset = idx + 1 - (currentDay === 0 ? 7 : currentDay);
      const targetDate = new Date();
      targetDate.setDate(time.getDate() + dayOffset);
      const dateString = targetDate.toISOString().split("T")[0];
      
      const record = (currentUser?.attendance || []).find(r => r.date === dateString);
      
      let status = "pending"; // present, absent, pending
      if (record) {
        status = "present";
      } else if (idx + 1 < currentDay) {
        status = "absent";
      }
      return { name: dayName, status };
    });
  };
  const weeklyAttendance = getWeeklyAttendance();

  // Holidays
  const holidays = [
    { title: "Independence Day", date: "15 Aug 2026", daysLeft: 30 },
    { title: "Gandhi Jayanti", date: "02 Oct 2026", daysLeft: 78 },
    { title: "Diwali festival", date: "08 Nov 2026", daysLeft: 115 },
    { title: "Christmas Day", date: "25 Dec 2026", daysLeft: 162 },
  ];

  return (
    <div className="page-content">
      {/* Welcome Banner */}
      <div 
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(59,130,246,0.03) 100%)",
          padding: "24px 32px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-light)"
        }}
      >
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>
            Welcome back, <span className="text-gradient">{currentUser?.name?.split(" ")[0]}</span> 👋
          </h2>
          <p style={{ marginTop: "4px", fontSize: "14px" }}>
            Hope you have a productive day today.
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "20px", fontWeight: 800 }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {time.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
        
        {/* Left Column: Clock & Personal Metrics */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Large Clock In / Out Card */}
          <div 
            className="card" 
            style={{ 
              background: isClockedIn ? "rgba(16, 185, 129, 0.05)" : "var(--bg-card)",
              border: isClockedIn ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--border-light)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span 
                  className="badge" 
                  style={{ 
                    background: isClockedIn ? "var(--success-soft)" : "rgba(255,255,255,0.04)", 
                    color: isClockedIn ? "var(--success-light)" : "var(--text-muted)",
                    marginBottom: "12px"
                  }}
                >
                  {isClockedIn ? "● Live Shift Active" : "Shift Inactive"}
                </span>
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>
                  {isClockedIn ? "Session Timer" : "Daily Attendance"}
                </h3>
              </div>
              <div 
                style={{ 
                  width: "42px", 
                  height: "42px", 
                  borderRadius: "10px", 
                  background: isClockedIn ? "var(--success-soft)" : "var(--primary-soft)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: isClockedIn ? "var(--success-light)" : "var(--primary-light)"
                }}
              >
                <Clock size={20} />
              </div>
            </div>

            {/* Time counter */}
            <div style={{ margin: "24px 0" }}>
              <div 
                style={{ 
                  fontSize: "36px", 
                  fontWeight: 800, 
                  fontFamily: "monospace", 
                  letterSpacing: "1px",
                  color: isClockedIn ? "var(--success-light)" : "var(--text-main)"
                }}
              >
                {isClockedIn ? elapsedTime : "00:00:00"}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                {isClockedIn 
                  ? `Clocked in at ${new Date(todayRecord?.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : todayRecord && todayRecord.clockOut
                    ? `Completed today: ${new Date(todayRecord.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(todayRecord.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : "You are not clocked in today."
                }
              </p>
            </div>

            {/* Action buttons */}
            <div>
              {!todayRecord ? (
                <button 
                  className="btn btn-primary" 
                  style={{ width: "100%", height: "46px" }}
                  onClick={() => clockInEmployee(currentUser.id)}
                >
                  ⏰ Clock In Now
                </button>
              ) : isClockedIn ? (
                <button 
                  className="btn" 
                  style={{ 
                    width: "100%", 
                    height: "46px", 
                    background: "linear-gradient(135deg, var(--error), #dc2626)", 
                    color: "white",
                    boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)"
                  }} 
                  onClick={() => clockOutEmployee(currentUser.id)}
                >
                  🚪 Clock Out Shift
                </button>
              ) : (
                <button 
                  className="btn btn-ghost" 
                  style={{ width: "100%", height: "46px", border: "1px solid var(--border-light)" }}
                  disabled
                >
                  ✓ Completed for Today
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}>Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <button 
                onClick={() => navigate("/employee/leave")}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary-light)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-light)"}
              >
                <PlaneTakeoff size={20} className="text-gradient" />
                <span style={{ fontSize: "11px", fontWeight: 600 }}>Apply Leave</span>
              </button>

              <button 
                onClick={() => navigate("/employee/profile")}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary-light)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-light)"}
              >
                <UserCheck size={20} style={{ color: "var(--success)" }} />
                <span style={{ fontSize: "11px", fontWeight: 600 }}>My Profile</span>
              </button>

              <button 
                onClick={() => navigate("/employee/payroll")}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-main)",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary-light)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-light)"}
              >
                <FileCheck size={20} style={{ color: "var(--info)" }} />
                <span style={{ fontSize: "11px", fontWeight: 600 }}>View Salary</span>
              </button>
            </div>
          </div>

          {/* Weekly Attendance Overview */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}>Weekly Attendance</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {weeklyAttendance.map(day => (
                <div key={day.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{day.name}</span>
                  <div 
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: 
                        day.status === "present" 
                          ? "var(--success-soft)" 
                          : day.status === "absent" 
                            ? "var(--error-soft)" 
                            : "rgba(255,255,255,0.02)",
                      border: 
                        day.status === "present"
                          ? "1px solid var(--success)"
                          : day.status === "absent"
                            ? "1px solid var(--error)"
                            : "1px solid var(--border-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: day.status === "present" ? "var(--success-light)" : day.status === "absent" ? "var(--error-light)" : "var(--text-dimmed)",
                      fontSize: "12px",
                      fontWeight: 700
                    }}
                  >
                    {day.status === "present" ? "✓" : day.status === "absent" ? "✗" : "?"}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Summaries, Announcements, and Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Profile Completion Indicator */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}>Profile Health Check</h3>
            <div className="completion-container">
              <div 
                className="completion-circle" 
                style={{ "--percentage": profileCompletion } }
              >
                {profileCompletion}%
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700 }}>Completion Health</h4>
                <p style={{ fontSize: "12px", marginTop: "4px" }}>
                  {profileCompletion === 100 
                    ? "Your corporate record is complete. Excellent!" 
                    : "Fill in all profile attributes in Settings/Profile to reach 100% completion."}
                </p>
                {profileCompletion < 100 && (
                  <button 
                    onClick={() => navigate("/employee/profile")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary-light)",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "6px"
                    }}
                  >
                    Finish Profile <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Leave Balance Summary */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "16px" }}>Leave Entitlement</h3>
            <div style={{ display: "flex", gap: "16px", textAlign: "center" }}>
              <div style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "20px", fontWeight: 800 }}>{totalLeavesAllocated}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Yearly Limit</div>
              </div>
              <div style={{ flex: 1, padding: "12px", background: "var(--primary-soft)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--primary-light)" }}>{approvedLeaves}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Approved</div>
              </div>
              <div style={{ flex: 1, padding: "12px", background: "var(--success-soft)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--success-light)" }}>{remainingLeaves}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Remaining</div>
              </div>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: "12px" }}>
              <h3 className="card-title"><Megaphone size={16} /> Latest Broadcasts</h3>
              <button 
                onClick={() => navigate("/employee/announcements")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "var(--primary-light)", 
                  fontSize: "12px", 
                  fontWeight: 600, 
                  cursor: "pointer" 
                }}
              >
                View all
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {announcements.length === 0 ? (
                <p style={{ fontSize: "12px", color: "var(--text-dimmed)", padding: "8px 0" }}>No corporate broadcasts posted.</p>
              ) : (
                announcements.slice(0, 2).map(ann => (
                  <div 
                    key={ann.id} 
                    style={{ 
                      padding: "12px", 
                      background: "rgba(255,255,255,0.01)", 
                      border: "1px solid var(--border-light)", 
                      borderRadius: "var(--radius-md)" 
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700 }}>{ann.title}</span>
                      <span 
                        className="badge" 
                        style={{ 
                          fontSize: "8px", 
                          padding: "2px 6px",
                          background: ann.priority === 'High' ? 'var(--error-soft)' : 'rgba(255,255,255,0.04)',
                          color: ann.priority === 'High' ? 'var(--error-light)' : 'var(--text-dimmed)'
                        }}
                      >
                        {ann.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: "11.5px", marginTop: "6px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {ann.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Holidays */}
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: "12px" }}><Calendar size={16} /> Calendar Holidays</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {holidays.map((h, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    fontSize: "12.5px",
                    paddingBottom: idx !== holidays.length - 1 ? "8px" : "0",
                    borderBottom: idx !== holidays.length - 1 ? "1px solid var(--border-light)" : "none"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{h.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{h.date}</div>
                  </div>
                  <span 
                    style={{ 
                      fontSize: "10px", 
                      color: "var(--primary-light)", 
                      background: "var(--primary-soft)", 
                      padding: "2px 8px", 
                      borderRadius: "6px",
                      fontWeight: 600
                    }}
                  >
                    in {h.daysLeft} days
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
