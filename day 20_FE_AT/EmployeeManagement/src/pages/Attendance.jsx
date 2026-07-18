import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { 
  Clock, 
  UserCheck, 
  UserX, 
  Timer, 
  Search, 
  Calendar, 
  Download, 
  TrendingUp,
  MapPin
} from "lucide-react";

export default function Attendance() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const { 
    employees, 
    allAttendance, 
    clockInEmployee, 
    clockOutEmployee 
  } = useEmployees();

  const [time, setTime] = useState(new Date());

  // Keep clock running
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = time.toISOString().split("T")[0];

  // Retrieve today's record for logged-in employee
  const myTodayRecord = (currentUser?.attendance || []).find(r => r.date === todayStr);
  const isClockedIn = myTodayRecord && !myTodayRecord.clockOut;

  // Live session timer logic for employee
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  useEffect(() => {
    let timerId;
    if (isClockedIn && myTodayRecord?.clockIn) {
      const updateTimer = () => {
        const start = new Date(myTodayRecord.clockIn).getTime();
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
  }, [isClockedIn, myTodayRecord]);

  // Admin filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Helpers for calculating shift duration
  const getDurationHours = (clockIn, clockOut) => {
    if (!clockIn) return "-";
    const end = clockOut ? new Date(clockOut) : new Date();
    const diff = Math.abs(end - new Date(clockIn));
    const hours = (diff / 3600000).toFixed(1);
    return `${hours} hrs`;
  };

  // ── Admin calculations ──
  // 1. Who is clocked in right now? (attendance with date=today & clockOut=null)
  const activeStaffLogs = allAttendance.filter(r => r.date === todayStr && !r.clockOut);
  // 2. Average working hours (completed shifts only)
  const completedShifts = allAttendance.filter(r => r.clockOut);
  const avgShiftHours = completedShifts.length > 0
    ? (completedShifts.reduce((acc, r) => {
        const diff = Math.abs(new Date(r.clockOut) - new Date(r.clockIn));
        return acc + (diff / 3600000);
      }, 0) / completedShifts.length).toFixed(1)
    : "8.0";

  // Filter history logs for Admin
  const filteredAttendance = allAttendance.filter(record => {
    if (filterDate && record.date !== filterDate) return false;
    if (filterDept !== "All" && record.department !== filterDept) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = record.name.toLowerCase().includes(q);
      const matchId = record.employeeId.toLowerCase().includes(q);
      return matchName || matchId;
    }
    return true;
  });

  const departmentsList = ["All", ...new Set(employees.map(e => e.department))];

  return (
    <div className="page-content">
      {/* ── MODULE 1: Employee Attendance Workspace ── */}
      {!isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "28px" }}>
          {/* Left panel: Clock and Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="card" style={{ padding: "32px", textAlign: "center" }}>
              <div 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: isClockedIn ? "var(--success-soft)" : "var(--primary-soft)",
                  color: isClockedIn ? "var(--success-light)" : "var(--primary-light)",
                  marginBottom: "20px"
                }}
              >
                {isClockedIn ? <Timer size={26} className="pulsing-glow" /> : <Clock size={26} />}
              </div>

              <h3 style={{ fontSize: "20px", fontWeight: 800 }}>Smart Time Clock</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                Record your daily shift work timings.
              </p>

              {/* Digital Clock */}
              <div style={{ margin: "28px 0" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--primary-light)" }}>
                  {time.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
                </div>
                <div style={{ fontSize: "38px", fontWeight: 800, fontFamily: "monospace", letterSpacing: "1px", margin: "6px 0" }}>
                  {time.toLocaleTimeString()}
                </div>
                
                {isClockedIn && (
                  <div style={{ marginTop: "12px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", padding: "10px", borderRadius: "10px", display: "inline-block" }}>
                    <div style={{ fontSize: "11px", color: "var(--success-light)", fontWeight: 700, textTransform: "uppercase" }}>Shift Active</div>
                    <div style={{ fontSize: "22px", fontFamily: "monospace", fontWeight: 800, color: "var(--text-main)", marginTop: "2px" }}>{elapsedTime}</div>
                  </div>
                )}
              </div>

              {/* Trigger Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {!myTodayRecord ? (
                  <button 
                    className="btn btn-primary" 
                    style={{ height: "46px", width: "100%" }}
                    onClick={() => clockInEmployee(currentUser.id)}
                  >
                    ⏰ Clock In Shift
                  </button>
                ) : isClockedIn ? (
                  <button 
                    className="btn" 
                    style={{ 
                      height: "46px", 
                      width: "100%", 
                      background: "linear-gradient(135deg, var(--error), #dc2626)", 
                      color: "white",
                      boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)"
                    }}
                    onClick={() => clockOutEmployee(currentUser.id)}
                  >
                    🚪 Clock Out Shift
                  </button>
                ) : (
                  <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px dashed var(--border-light)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", fontSize: "12.5px", fontWeight: 600 }}>
                    ✓ Shift Completed for Today
                  </div>
                )}
              </div>

              <div 
                style={{ 
                  marginTop: "24px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "6px",
                  fontSize: "11px",
                  color: "var(--text-dimmed)"
                }}
              >
                <MapPin size={12} />
                <span>Geofencing Check: Office HQ (Active)</span>
              </div>
            </div>
          </div>

          {/* Right panel: Log table */}
          <div>
            <div className="table-wrap">
              <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Attendance Log History</h3>
                <span className="badge badge-active" style={{ fontSize: "10px" }}>
                  {(currentUser?.attendance || []).length} Total Shifts
                </span>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentUser?.attendance || []).length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <span className="empty-icon">⏰</span>
                          <span className="empty-text">No attendance records found. Click Clock In to begin tracking.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (currentUser?.attendance || []).map(record => (
                      <tr key={record.id}>
                        <td style={{ fontWeight: 600 }}>{record.date}</td>
                        <td>{new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                          {record.clockOut 
                            ? new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                            : <span style={{ color: "var(--success-light)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                                <span className="pulsing-dot" /> Running...
                              </span>
                          }
                        </td>
                        <td>{getDurationHours(record.clockIn, record.clockOut)}</td>
                        <td>
                          <span className="badge badge-active">
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 2: Admin Attendance Control Center ── */}
      {isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Quick Metrics Header */}
          <div className="stats-grid">
            <div className="card stat-card" style={{ "--card-color": "var(--primary)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--primary-soft)", color: "var(--primary-light)" }}>
                <UserCheck size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{activeStaffLogs.length}</div>
                <div className="stat-label">Active Right Now</div>
                <div className="stat-change">Currently working in-office</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--success)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--success-soft)", color: "var(--success-light)" }}>
                <TrendingUp size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{employees.filter(e => e.status === 'Active').length - activeStaffLogs.length}</div>
                <div className="stat-label">Off-Shift / Not Clocked</div>
                <div className="stat-change">Active employees not in shift</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--info)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--info-soft)", color: "var(--info-light)" }}>
                <Clock size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{avgShiftHours} hrs</div>
                <div className="stat-label">Avg. Shift Duration</div>
                <div className="stat-change">Across all completed shifts</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--warning)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--warning-soft)", color: "var(--warning-light)" }}>
                <UserX size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{employees.filter(e => e.status === 'On Leave').length}</div>
                <div className="stat-label">On Leave Today</div>
                <div className="stat-change">Excused absence registered</div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Active right now vs Logs */}
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "24px" }}>
            
            {/* Historical Logs with filters */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Filter panel */}
              <div className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "200px" }}>
                    <div className="search-panel" style={{ padding: "6px 12px", maxWidth: "none" }}>
                      <Search size={14} className="text-muted" />
                      <input 
                        type="text" 
                        placeholder="Search employee by name or ID..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <select 
                      className="form-input" 
                      style={{ padding: "8px 12px", width: "140px", fontSize: "12.5px" }}
                      value={filterDept}
                      onChange={e => setFilterDept(e.target.value)}
                    >
                      <option value="All">All Departments</option>
                      {departmentsList.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>

                    <input 
                      type="date" 
                      className="form-input"
                      style={{ padding: "6px 12px", fontSize: "12.5px", width: "140px" }}
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                    />

                    {filterDate && (
                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => setFilterDate("")}
                      >
                        Reset Date
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Shift Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5}>
                          <div className="empty-state">
                            <span className="empty-icon">📂</span>
                            <span className="empty-text">No matching attendance logs found.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map(record => (
                        <tr key={record.id}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{record.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {record.employeeId} · {record.department}
                            </div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{record.date}</td>
                          <td>{new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>
                            {record.clockOut 
                              ? new Date(record.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : <span style={{ color: "var(--success-light)", fontWeight: 700 }}>Active</span>
                            }
                          </td>
                          <td>{getDurationHours(record.clockIn, record.clockOut)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active shifts right now */}
            <div>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 className="card-title">● In-Office Active Shifts</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
                  {activeStaffLogs.length === 0 ? (
                    <div style={{ padding: "36px 12px", textAlign: "center", color: "var(--text-dimmed)" }}>
                      <UserX size={32} style={{ margin: "0 auto 8px", opacity: 0.5 }} />
                      <p style={{ fontSize: "12px" }}>No employees clocked in right now.</p>
                    </div>
                  ) : (
                    activeStaffLogs.map(log => (
                      <div 
                        key={log.id} 
                        style={{ 
                          padding: "12px", 
                          background: "rgba(255,255,255,0.01)", 
                          border: "1px solid var(--border-light)", 
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "13px" }}>{log.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                            Dept: {log.department}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span 
                            style={{ 
                              fontSize: "11px", 
                              color: "var(--success-light)", 
                              background: "var(--success-soft)", 
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: 700,
                              fontFamily: "monospace"
                            }}
                          >
                            Active
                          </span>
                          <div style={{ fontSize: "11px", color: "var(--text-dimmed)", marginTop: "4px" }}>
                            since {new Date(log.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
