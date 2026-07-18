import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { 
  Banknote, 
  FileCheck, 
  Download, 
  Eye, 
  Coins, 
  Building2, 
  Printer, 
  Calendar,
  Sparkles,
  TrendingUp,
  Percent
} from "lucide-react";

export default function Payroll() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const { employees } = useEmployees();

  // Selected payslip for detailed modal view
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // ── Employee Logic: Generate Payslips Dynamically based on Salary ──
  const getEmployeePayslips = (user) => {
    if (!user || user.role === "admin") return [];
    
    const salary = user.salary || 600000; // Annual Salary base (default 6 Lakhs)
    const monthlyGross = Math.round(salary / 12);
    
    // Earnings breakdown
    const basic = Math.round(monthlyGross * 0.50);
    const hra = Math.round(monthlyGross * 0.25);
    const conveyance = Math.round(monthlyGross * 0.10);
    const special = Math.round(monthlyGross * 0.15);
    
    // Deductions
    const pf = 1800; // Fixed PF contribution
    const professionalTax = 200; // Fixed Professional Tax
    const tds = Math.round(monthlyGross * 0.10); // Standard TDS (10%)
    const totalDeductions = pf + professionalTax + tds;
    
    const netSalary = monthlyGross - totalDeductions;

    // Last 3 months payslips
    return [
      { id: "pay-1", month: "June 2026", gross: monthlyGross, net: netSalary, basic, hra, conveyance, special, pf, pt: professionalTax, tds, deductions: totalDeductions },
      { id: "pay-2", month: "May 2026", gross: monthlyGross, net: netSalary, basic, hra, conveyance, special, pf, pt: professionalTax, tds, deductions: totalDeductions },
      { id: "pay-3", month: "April 2026", gross: monthlyGross, net: netSalary, basic, hra, conveyance, special, pf, pt: professionalTax, tds, deductions: totalDeductions }
    ];
  };

  const myPayslips = getEmployeePayslips(currentUser);

  // ── Admin Logic: Manage Overall Payroll Register ──
  // Calculate total monthly organization payout
  const totalOrgSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const monthlyOrgPayout = Math.round(totalOrgSalary / 12);

  // Average monthly payout
  const avgMonthlySalary = employees.length > 0 
    ? Math.round(monthlyOrgPayout / employees.length) 
    : 0;

  const handlePrint = (payslip) => {
    window.print();
  };

  return (
    <div className="page-content">
      {/* ── MODULE 1: Employee Workspace (Payslips Board) ── */}
      {!isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Entitlement Banner */}
          <div className="card" style={{ padding: "28px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--success-soft)", color: "var(--success-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Coins size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 800 }}>Salary Compensation Plan</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                Annual Compensation: <strong>₹{(currentUser?.salary || 0).toLocaleString("en-IN")}</strong> · Bank Account: ************4091
              </p>
            </div>
          </div>

          {/* Payslips Table */}
          <div className="table-wrap">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-light)", display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Generated Payslips Feed</h3>
              <span className="badge badge-active" style={{ fontSize: "10px" }}>Active Salary Record</span>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Salary Cycle Month</th>
                  <th>Monthly Gross Pay</th>
                  <th>Total Deductions</th>
                  <th>Net Take-Home Pay</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPayslips.map(ps => (
                  <tr key={ps.id}>
                    <td style={{ fontWeight: 700 }}>{ps.month}</td>
                    <td>₹{ps.gross.toLocaleString("en-IN")}</td>
                    <td style={{ color: "var(--error-light)" }}>₹{ps.deductions.toLocaleString("en-IN")}</td>
                    <td style={{ fontWeight: 800, color: "var(--success-light)" }}>
                      ₹{ps.net.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedPayslip(ps)}
                          style={{ display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <Eye size={12} /> View Breakdown
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => alert(`Downloading payslip for ${ps.month}`)}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODULE 2: Admin Control Center (Payroll Summary) ── */}
      {isAdmin && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Quick Stats Header */}
          <div className="stats-grid">
            <div className="card stat-card" style={{ "--card-color": "var(--primary)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--primary-soft)", color: "var(--primary-light)" }}>
                <Banknote size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">₹{monthlyOrgPayout.toLocaleString("en-IN")}</div>
                <div className="stat-label">Total Monthly Payout</div>
                <div className="stat-change">Sum of all base contracts / month</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--info)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--info-soft)", color: "var(--info-light)" }}>
                <TrendingUp size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">₹{avgMonthlySalary.toLocaleString("en-IN")}</div>
                <div className="stat-label">Avg. Monthly Compensation</div>
                <div className="stat-change">Average staff payout rate</div>
              </div>
            </div>

            <div className="card stat-card" style={{ "--card-color": "var(--success)" }}>
              <div className="stat-icon-wrap" style={{ background: "var(--success-soft)", color: "var(--success-light)" }}>
                <Percent size={20} />
              </div>
              <div className="stat-info">
                <div className="stat-value">100%</div>
                <div className="stat-label">Payroll Compliance</div>
                <div className="stat-change">All payouts compiled & validated</div>
              </div>
            </div>
          </div>

          {/* Org-wide Payroll Register */}
          <div className="table-wrap">
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-light)", display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Corporate Salary Register</h3>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => alert("Simulating overall payroll compliance run. Bank notification broadcasts sent!")}
              >
                <Sparkles size={13} /> Compile Compliance Run
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee Profile</th>
                  <th>HQ Base</th>
                  <th>Annual package</th>
                  <th>Monthly Gross</th>
                  <th>Approx Take-home</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const monthlyGross = Math.round((emp.salary || 0) / 12);
                  const net = Math.round(monthlyGross - 2000 - (monthlyGross * 0.10)); // Est Net
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{emp.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {emp.employeeId} · {emp.jobTitle}
                        </div>
                      </td>
                      <td>{emp.location || "-"}</td>
                      <td>₹{(emp.salary || 0).toLocaleString("en-IN")}</td>
                      <td>₹{monthlyGross.toLocaleString("en-IN")}</td>
                      <td style={{ fontWeight: 700, color: "var(--success-light)" }}>
                        ₹{net.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DETAILED SALARY MODAL BREAKDOWN ── */}
      {selectedPayslip && (
        <div className="modal-overlay" onClick={() => setSelectedPayslip(null)}>
          <div className="modal-content" style={{ maxWidth: "540px" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detailed Salary Statement</h3>
              <button className="close-btn" onClick={() => setSelectedPayslip(null)}>×</button>
            </div>

            <div className="modal-body" style={{ color: "var(--text-main)", fontSize: "12.5px" }}>
              {/* Slip header details */}
              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", borderBottom: "1px dashed var(--border-medium)", paddingBottom: "14px", marginBottom: "16px" }}>
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 800 }}>AETHER SYSTEMS LTD.</h4>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Enterprise HQ, Tech Hub Base</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "var(--primary-light)" }}>Cycle: {selectedPayslip.month}</div>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Reference Code: PAY-{selectedPayslip.id.toUpperCase()}</span>
                </div>
              </div>

              {/* Employee metadata */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: "20px", background: "rgba(255,255,255,0.01)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Employee Name:</span>
                  <div style={{ fontWeight: 700, marginTop: "2px" }}>{currentUser.name}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Employee ID:</span>
                  <div style={{ fontWeight: 700, marginTop: "2px" }}>{currentUser.employeeId}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Job Title / Dept:</span>
                  <div style={{ fontWeight: 700, marginTop: "2px" }}>{currentUser.jobTitle} · {currentUser.department}</div>
                </div>
                <div>
                  <span style={{ color: "var(--text-muted)" }}>Bank register account:</span>
                  <div style={{ fontWeight: 700, marginTop: "2px" }}>SBI ************4091</div>
                </div>
              </div>

              {/* Earnings & Deductions Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
                {/* Earnings */}
                <div>
                  <h5 style={{ fontWeight: 800, borderBottom: "1.5px solid var(--primary)", paddingBottom: "4px", marginBottom: "10px", color: "var(--primary-light)", textTransform: "uppercase", fontSize: "10px" }}>Earnings</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>Basic Pay:</span><strong>₹{selectedPayslip.basic.toLocaleString()}</strong></div>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>HRA:</span><strong>₹{selectedPayslip.hra.toLocaleString()}</strong></div>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>Conveyance:</span><strong>₹{selectedPayslip.conveyance.toLocaleString()}</strong></div>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>Special:</span><strong>₹{selectedPayslip.special.toLocaleString()}</strong></div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h5 style={{ fontWeight: 800, borderBottom: "1.5px solid var(--error)", paddingBottom: "4px", marginBottom: "10px", color: "var(--error-light)", textTransform: "uppercase", fontSize: "10px" }}>Deductions</h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>Provident Fund:</span><strong>₹{selectedPayslip.pf.toLocaleString()}</strong></div>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>Professional Tax:</span><strong>₹{selectedPayslip.pt.toLocaleString()}</strong></div>
                    <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between" }}><span>TDS (Income Tax):</span><strong>₹{selectedPayslip.tds.toLocaleString()}</strong></div>
                  </div>
                </div>
              </div>

              {/* Totals Summary */}
              <div style={{ borderTop: "1px dashed var(--border-medium)", paddingTop: "14px", marginTop: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", color: "var(--text-muted)" }}>
                  <span>Gross Monthly Earnings:</span>
                  <strong>₹{selectedPayslip.gross.toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", color: "var(--error-light)" }}>
                  <span>Total Deductions:</span>
                  <strong>- ₹{selectedPayslip.deductions.toLocaleString("en-IN")}</strong>
                </div>
                <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", fontSize: "14px", fontWeight: 800, color: "var(--success-light)", background: "var(--success-soft)", padding: "10px", borderRadius: "6px", marginTop: "4px" }}>
                  <span>Net Take-home salary:</span>
                  <strong>₹{selectedPayslip.net.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ background: "rgba(255, 255, 255, 0.01)" }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => setSelectedPayslip(null)}
              >
                Close Statement
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-sm"
                onClick={() => handlePrint(selectedPayslip)}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Printer size={13} /> Print Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
