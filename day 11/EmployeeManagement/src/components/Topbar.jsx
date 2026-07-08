import { useLocation } from "react-router-dom";

const PAGE_META = {
  "/":           { title: "Dashboard",   subtitle: "Overview of your workforce" },
  "/employees":  { title: "Employees",   subtitle: "Manage all employees" },
  "/departments":{ title: "Departments", subtitle: "Browse by department" },
  "/active":     { title: "Active",      subtitle: "Currently active employees" },
  "/on-leave":   { title: "On Leave",    subtitle: "Employees on leave" },
  "/inactive":   { title: "Inactive",    subtitle: "Inactive employees" },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: "Employee Manager", subtitle: "" };
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{meta.title}</div>
        <div className="topbar-subtitle">{dateStr}</div>
      </div>
      <div className="topbar-right">
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{meta.subtitle}</span>
        <div className="topbar-avatar" title="Admin">AD</div>
      </div>
    </header>
  );
}
