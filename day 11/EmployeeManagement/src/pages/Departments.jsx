import { useState } from "react";
import { useEmployees } from "../context/EmployeeContext";
import EmployeeTable from "../components/EmployeeTable";

const DEPT_ICONS = {
  Engineering: "⚙️", Marketing: "📢", Sales: "💼",
  "Human Resources": "🤝", Finance: "💰", Design: "🎨",
  Operations: "🔧", Legal: "⚖️",
};

const DEPT_COLORS = [
  "#6C63FF","#FF6584","#43D9AD","#F7B731","#4B7BEC","#8854D0","#0FB9B1","#FC5C65",
];

export default function Departments() {
  const { departmentData, employees } = useEmployees();
  const [selected, setSelected] = useState(null);

  const deptEmployees = selected
    ? employees.filter((e) => e.department === selected)
    : [];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{departmentData.length} departments · {employees.length} total employees</p>
        </div>
        {selected && (
          <button className="btn btn-ghost" onClick={() => setSelected(null)}>
            ← Back to All Departments
          </button>
        )}
      </div>

      {!selected ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {departmentData.map((dept, i) => {
            const color = DEPT_COLORS[i % DEPT_COLORS.length];
            return (
              <div
                key={dept.name}
                className="card"
                style={{ cursor: "pointer", "--card-color": color }}
                onClick={() => setSelected(dept.name)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div className="dept-icon" style={{ background: color + "22", width: 48, height: 48, borderRadius: 10, fontSize: 22 }}>
                    {DEPT_ICONS[dept.name] || "🏢"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{dept.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{dept.count} employees</div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Active",    val: dept.active,                   color: "#43D9AD" },
                    { label: "On Leave",  val: dept.count - dept.active - (employees.filter(e => e.department === dept.name && e.status === "Inactive").length), color: "#F7B731" },
                    { label: "Inactive",  val: employees.filter(e => e.department === dept.name && e.status === "Inactive").length, color: "#FC5C65" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Avg Salary</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>₹{dept.avgSalary.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, fontSize: 12, color: color, fontWeight: 600 }}>
                  View {dept.name} team →
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: DEPT_COLORS[departmentData.findIndex(d => d.name === selected) % DEPT_COLORS.length] + "22",
                fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {DEPT_ICONS[selected] || "🏢"}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{selected}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  {deptEmployees.length} employees · {deptEmployees.filter(e => e.status === "Active").length} active
                </div>
              </div>
            </div>
          </div>
          <EmployeeTable employees={deptEmployees} />
        </>
      )}
    </div>
  );
}
