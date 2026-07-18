import { useState } from "react";
import { useEmployees } from "../context/EmployeeContext";
import EmployeeTable from "../components/EmployeeTable";
import { 
  Building2, 
  ChevronLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  CalendarDays, 
  DollarSign 
} from "lucide-react";

const DEPT_ICONS = {
  Engineering: "⚙️", Marketing: "📢", Sales: "💼",
  "Human Resources": "🤝", Finance: "💰", Design: "🎨",
  Operations: "🔧", Legal: "⚖️",
};

const DEPT_COLORS = [
  "#6366f1", "#FF6584", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#14b8a6", "#ef4444"
];

export default function Departments() {
  const { departmentData, employees } = useEmployees();
  const [selected, setSelected] = useState(null);

  const deptEmployees = selected
    ? employees.filter((e) => e.department === selected)
    : [];

  return (
    <div className="page-content">
      <div className="toolbar" style={{ alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800 }}>
            {selected ? `${selected} Division` : "Department Catalog"}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {selected 
              ? `${deptEmployees.length} members assigned to this division` 
              : `${departmentData.length} active divisions · ${employees.length} employees total`}
          </p>
        </div>
        {selected && (
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setSelected(null)}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <ChevronLeft size={14} /> Back to Catalog
          </button>
        )}
      </div>

      {!selected ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {departmentData.map((dept, i) => {
            const color = DEPT_COLORS[i % DEPT_COLORS.length];
            const inactiveCount = employees.filter(e => e.department === dept.name && e.status === "Inactive").length;
            const onLeaveCount = employees.filter(e => e.department === dept.name && e.status === "On Leave").length;

            return (
              <div
                key={dept.name}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelected(dept.name)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                  <div 
                    style={{ 
                      background: color + "18", 
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "12px", 
                      fontSize: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: color
                    }}
                  >
                    {DEPT_ICONS[dept.name] || "🏢"}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "15px" }}>{dept.name}</h3>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{dept.count} Members</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle size={12} style={{ color: "var(--success)" }} /> Active</span>
                    <strong style={{ color: "var(--success-light)" }}>{dept.active}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}><CalendarDays size={12} style={{ color: "var(--warning)" }} /> On Leave</span>
                    <strong style={{ color: "var(--warning-light)" }}>{onLeaveCount}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} style={{ color: "var(--error)" }} /> Inactive</span>
                    <strong style={{ color: "var(--error-light)" }}>{inactiveCount}</strong>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "10px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px" }}>
                    <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "2px" }}><DollarSign size={12} style={{ color: color }} /> Avg Salary</span>
                    <strong style={{ color: color }}>₹{dept.avgSalary.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                <div 
                  style={{ 
                    marginTop: "16px", 
                    fontSize: "12px", 
                    color: color, 
                    fontWeight: 700, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "4px",
                    borderTop: "1px solid var(--border-light)",
                    paddingTop: "10px"
                  }}
                >
                  View Team Members <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: "20px", padding: "18px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "10px",
                background: DEPT_COLORS[departmentData.findIndex(d => d.name === selected) % DEPT_COLORS.length] + "18",
                fontSize: "22px", display: "flex", alignItems: "center", justifyCenter: "center",
                color: DEPT_COLORS[departmentData.findIndex(d => d.name === selected) % DEPT_COLORS.length],
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {DEPT_ICONS[selected] || "🏢"}
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "16px" }}>{selected} Division List</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
                  Displaying {deptEmployees.length} employees currently assigned to this department.
                </p>
              </div>
            </div>
          </div>
          <EmployeeTable employees={deptEmployees} />
        </>
      )}
    </div>
  );
}
