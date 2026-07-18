import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { 
  Calendar, 
  PlaneTakeoff, 
  Check, 
  X, 
  Clock, 
  CalendarCheck, 
  AlertCircle, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function Leave() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const { 
    employees, 
    allLeaves, 
    submitLeaveRequest, 
    processLeaveRequest 
  } = useEmployees();

  // Employee Form State
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    const payload = {
      type: leaveType,
      startDate,
      endDate,
      reason
    };

    const success = await submitLeaveRequest(currentUser.id, payload);
    if (success) {
      setShowForm(false);
      setLeaveType("Annual Leave");
      setStartDate("");
      setEndDate("");
      setReason("");
    }
  };

  // ── Helper: calculate days count of leave request ──
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // ── Employee Specific data ──
  const myRequests = currentUser?.leaves || [];
  const myApprovedLeavesCount = myRequests
    .filter(l => l.status === "Approved")
    .reduce((sum, l) => sum + calculateDays(l.startDate, l.endDate), 0);
  
  const totalLeaves = 24;
  const myRemainingLeaves = Math.max(0, totalLeaves - myApprovedLeavesCount);
  const myPendingLeavesCount = myRequests.filter(l => l.status === "Pending").length;

  // ── Admin Specific data ──
  const pendingRequests = allLeaves.filter(lv => lv.status === "Pending");
  const processedRequests = allLeaves.filter(lv => lv.status !== "Pending");

  return (
    <div className="page-content">
      {/* ── MODULE 1: Employee Workspace (Leave Desk) ── */}
      {!isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "28px" }}>
          
          {/* Left panel: Leave stats & Apply form toggle */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Stats summary */}
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: "16px" }}>Leave Balance</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.015)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 600 }}>Yearly Quota</span>
                  <span style={{ fontWeight: 800 }}>{totalLeaves} Days</span>
                </div>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", padding: "10px 14px", background: "var(--success-soft)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ color: "var(--success-light)", fontSize: "13px", fontWeight: 600 }}>Approved / Taken</span>
                  <span style={{ fontWeight: 800, color: "var(--success-light)" }}>{myApprovedLeavesCount} Days</span>
                </div>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", padding: "10px 14px", background: "var(--primary-soft)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ color: "var(--primary-light)", fontSize: "13px", fontWeight: 600 }}>Pending Review</span>
                  <span style={{ fontWeight: 800, color: "var(--primary-light)" }}>{myPendingLeavesCount} Requests</span>
                </div>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)" }}>
                  <span style={{ color: "var(--text-main)", fontSize: "13px", fontWeight: 600 }}>Available Balance</span>
                  <span style={{ fontWeight: 800, color: "var(--primary-light)" }}>{myRemainingLeaves} Days</span>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: "100%", height: "42px", marginTop: "16px" }}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel Request" : "➕ Apply for Leave"}
              </button>
            </div>

            {/* Application Form */}
            {showForm && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: "16px" }}><PlaneTakeoff size={18} /> New Request</h3>
                
                <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Leave Type</label>
                    <select 
                      className="form-input" 
                      value={leaveType}
                      onChange={e => setLeaveType(e.target.value)}
                    >
                      <option>Annual Leave</option>
                      <option>Sick Leave</option>
                      <option>Unpaid Leave</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">End Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Reason / Cover Details</label>
                    <textarea 
                      className="form-input" 
                      placeholder="Specify the reason for leave..."
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      style={{ minHeight: "80px" }}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ height: "42px", marginTop: "8px" }}>
                    Submit Request
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right panel: Timeline history */}
          <div>
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: "20px" }}><Clock size={18} /> Request History Timeline</h3>
              
              <div className="timeline">
                {myRequests.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">🏖️</span>
                    <span className="empty-text">No leave requests logged yet. Use the Apply button to submit leaves.</span>
                  </div>
                ) : (
                  myRequests.map(req => {
                    const days = calculateDays(req.startDate, req.endDate);
                    return (
                      <div 
                        key={req.id} 
                        className={`timeline-item ${req.status === "Pending" ? "active" : ""}`}
                      >
                        <div className="timeline-dot" />
                        <span className="timeline-time">Requested on {req.requestDate}</span>
                        <div className="timeline-content">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                            <div>
                              <div className="timeline-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {req.type}
                                <span 
                                  className="badge" 
                                  style={{
                                    fontSize: "8.5px",
                                    padding: "2px 6px",
                                    background: 
                                      req.status === "Approved" 
                                        ? "var(--success-soft)" 
                                        : req.status === "Rejected" 
                                          ? "var(--error-soft)" 
                                          : "var(--warning-soft)",
                                    color: 
                                      req.status === "Approved" 
                                        ? "var(--success-light)" 
                                        : req.status === "Rejected" 
                                          ? "var(--error-light)" 
                                          : "var(--warning-light)"
                                  }}
                                >
                                  {req.status}
                                </span>
                              </div>
                              <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px" }}>
                                {req.startDate} to {req.endDate} ({days} {days === 1 ? "day" : "days"})
                              </div>
                            </div>
                          </div>
                          <div className="timeline-desc" style={{ marginTop: "8px" }}>
                            <strong>Reason:</strong> {req.reason}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODULE 2: Admin Control Center (Leave Management) ── */}
      {isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Quick Stats Header */}
          <div className="stats-grid">
            <div className="card stat-card" style={{ "--card-color": "var(--warning)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--warning-soft)", color: "var(--warning-light)" }}>
                <Clock size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{pendingRequests.length}</div>
                <div className="stat-label">Pending Reviews</div>
                <div className="stat-change">Requires approval decision</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--success)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--success-soft)", color: "var(--success-light)" }}>
                <CalendarCheck size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">
                  {employees.filter(e => e.status === "On Leave").length}
                </div>
                <div className="stat-label">Staff Away Today</div>
                <div className="stat-change">Excused from duty today</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--primary)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--primary-soft)", color: "var(--primary-light)" }}>
                <TrendingUp size={22} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{processedRequests.length}</div>
                <div className="stat-label font-bold">Processed Leaves</div>
                <div className="stat-change">Archived leaves requests logs</div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Pending reviews vs History */}
          <div style={{ display: "grid", gridTemplateColumns: pendingRequests.length > 0 ? "1fr 1fr" : "1fr", gap: "24px" }}>
            
            {/* Pending queue */}
            {pendingRequests.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800 }}>⚠️ Reviews Action Queue ({pendingRequests.length})</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {pendingRequests.map(req => {
                    const days = calculateDays(req.startDate, req.endDate);
                    return (
                      <div key={req.id} className="card" style={{ padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <h4 style={{ fontSize: "14px", fontWeight: 700 }}>{req.name}</h4>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              ID: {req.employeeId} · Dept: {req.department}
                            </div>
                          </div>
                          <span className="badge badge-leave" style={{ fontSize: "9px" }}>{req.type}</span>
                        </div>

                        <div style={{ margin: "14px 0", background: "rgba(255,255,255,0.015)", border: "1px solid var(--border-light)", padding: "12px", borderRadius: "8px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Duration:</span>
                            <span style={{ fontWeight: 600 }}>{req.startDate} to {req.endDate} ({days} days)</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "10px", borderTop: "1px solid var(--border-light)", paddingTop: "8px" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "11.5px" }}>Reason:</span>
                            <p style={{ fontSize: "12px", color: "var(--text-main)", lineHeight: "1.4" }}>{req.reason}</p>
                          </div>
                        </div>

                        {/* Approve/Reject Actions */}
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button 
                            className="btn btn-success btn-sm" 
                            style={{ flex: 1 }}
                            onClick={() => processLeaveRequest(req.employeeDbId, req.id, "Approved")}
                          >
                            <Check size={14} /> Approve Request
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            style={{ flex: 1 }}
                            onClick={() => processLeaveRequest(req.employeeDbId, req.id, "Rejected")}
                          >
                            <X size={14} /> Reject Request
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Historical logs table */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800 }}>Processed Leaves Directory</h3>
              
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave details</th>
                      <th>Dates</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRequests.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <div className="empty-state">
                            <span className="empty-icon">📁</span>
                            <span className="empty-text">No processed leave requests found.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      processedRequests.map(req => {
                        const days = calculateDays(req.startDate, req.endDate);
                        return (
                          <tr key={req.id}>
                            <td>
                              <div style={{ fontWeight: 700 }}>{req.name}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                {req.employeeId} · {req.department}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{req.type}</div>
                              <p style={{ fontSize: "11px", color: "var(--text-dimmed)", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px", whiteSpace: "nowrap" }}>
                                {req.reason}
                              </p>
                            </td>
                            <td>
                              <div style={{ fontSize: "12.5px" }}>{req.startDate} to {req.endDate}</div>
                              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{days} days total</div>
                            </td>
                            <td>
                              <span 
                                className="badge" 
                                style={{
                                  fontSize: "9px",
                                  background: req.status === "Approved" ? "var(--success-soft)" : "var(--error-soft)",
                                  color: req.status === "Approved" ? "var(--success-light)" : "var(--error-light)"
                                }}
                              >
                                {req.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
