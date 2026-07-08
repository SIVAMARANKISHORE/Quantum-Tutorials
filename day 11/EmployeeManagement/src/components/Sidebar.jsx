import { NavLink, useLocation } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";

const DEPT_ICONS = {
  Engineering: "⚙️", Marketing: "📢", Sales: "💼",
  "Human Resources": "🤝", Finance: "💰", Design: "🎨",
  Operations: "🔧", Legal: "⚖️",
};

export default function Sidebar() {
  const { stats } = useEmployees();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">👥</div>
        <div>
          <div className="logo-text">EmpManager</div>
          <div className="logo-sub">v1.0 Pro</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Main</span>

        <NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employees" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          <span className="nav-icon">👤</span>
          <span>Employees</span>
          <span className="nav-badge">{stats.total}</span>
        </NavLink>

        <NavLink to="/departments" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          <span className="nav-icon">🏢</span>
          <span>Departments</span>
          <span className="nav-badge">{stats.departments}</span>
        </NavLink>

        <span className="nav-label">Status</span>

        <NavLink to="/active" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          <span className="nav-icon">✅</span>
          <span>Active</span>
          <span className="nav-badge">{stats.active}</span>
        </NavLink>

        <NavLink to="/on-leave" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          <span className="nav-icon">🏖️</span>
          <span>On Leave</span>
          <span className="nav-badge">{stats.onLeave}</span>
        </NavLink>

        <NavLink to="/inactive" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          <span className="nav-icon">⛔</span>
          <span>Inactive</span>
          <span className="nav-badge">{stats.inactive}</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">© 2025 EmpManager</div>
    </aside>
  );
}
