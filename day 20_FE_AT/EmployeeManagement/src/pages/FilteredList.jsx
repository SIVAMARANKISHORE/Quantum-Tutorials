import { useEmployees } from "../context/EmployeeContext";
import EmployeeTable from "../components/EmployeeTable";
import { CheckCircle2, UserX, CalendarDays } from "lucide-react";

export default function FilteredList({ status }) {
  const { employees } = useEmployees();

  const META = {
    "Active":   { icon: CheckCircle2, color: "var(--success-light)", label: "Active Staff members" },
    "Inactive": { icon: UserX, color: "var(--error-light)", label: "Inactive Profiles register" },
    "On Leave": { icon: CalendarDays, color: "var(--warning-light)", label: "Staff members on Leave" },
  };

  const meta = META[status] || { icon: CheckCircle2, color: "var(--primary-light)", label: "Staff list" };
  const Icon = meta.icon;
  const filtered = employees.filter((e) => e.status === status);

  return (
    <div className="page-content">
      <div className="toolbar" style={{ alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "22px", fontWeight: 800 }}>
            <span style={{ color: meta.color, display: "flex", alignItems: "center" }}><Icon size={24} /></span>
            <span>{meta.label}</span>
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {filtered.length} employee{filtered.length !== 1 ? "s" : ""} registered under "{status}"
          </p>
        </div>
      </div>
      
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div className="empty-state">
            <span className="empty-icon"><Icon size={40} style={{ color: "var(--text-dimmed)" }} /></span>
            <span className="empty-text">No {status.toLowerCase()} employees found</span>
            <p style={{ fontSize: "12px", color: "var(--text-dimmed)", marginTop: "4px" }}>
              All employee accounts currently reside in other states.
            </p>
          </div>
        </div>
      ) : (
        <EmployeeTable employees={filtered} />
      )}
    </div>
  );
}
