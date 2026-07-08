import { useEmployees } from "../context/EmployeeContext";
import EmployeeTable from "../components/EmployeeTable";

export default function FilteredList({ status }) {
  const { employees } = useEmployees();

  const META = {
    "Active":   { icon: "✅", color: "#43D9AD", label: "Active Employees" },
    "Inactive": { icon: "⛔", color: "#FC5C65", label: "Inactive Employees" },
    "On Leave": { icon: "🏖️", color: "#F7B731", label: "Employees on Leave" },
  };

  const meta = META[status];
  const filtered = employees.filter((e) => e.status === status);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {meta.icon} <span style={{ color: meta.color }}>{meta.label}</span>
          </h1>
          <p className="page-subtitle">
            {filtered.length} employee{filtered.length !== 1 ? "s" : ""} with status "{status}"
          </p>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <span className="empty-icon">{meta.icon}</span>
            <span className="empty-text">No {status.toLowerCase()} employees</span>
            <span className="empty-sub">All employees have a different status.</span>
          </div>
        </div>
      ) : (
        <EmployeeTable employees={filtered} />
      )}
    </div>
  );
}
