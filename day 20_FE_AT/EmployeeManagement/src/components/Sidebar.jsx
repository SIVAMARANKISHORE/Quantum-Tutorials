import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";
import { useAuth } from "../context/AuthContext";
import { 
  Home, 
  Users, 
  Building2, 
  Clock, 
  CalendarDays, 
  FolderGit, 
  Banknote, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Megaphone, 
  User, 
  Settings, 
  ChevronLeft, 
  LogOut,
  Search,
  LayoutDashboard
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { stats } = useEmployees();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const role = currentUser?.role || 'employee';

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenuGroups = [
    {
      label: "Main",
      items: [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/employees", label: "Employees", icon: Users, badge: stats.total },
        { to: "/admin/departments", label: "Departments", icon: Building2 },
      ]
    },
    {
      label: "Operations",
      items: [
        { to: "/admin/attendance", label: "Attendance", icon: Clock },
        { to: "/admin/leave", label: "Leaves", icon: CalendarDays, badge: stats.pendingLeaves > 0 ? `${stats.pendingLeaves} pending` : null },
        { to: "/admin/projects", label: "Projects", icon: FolderGit },
        { to: "/admin/payroll", label: "Payroll", icon: Banknote },
        { to: "/admin/documents", label: "Documents", icon: FileText },
      ]
    },
    {
      label: "Filters",
      items: [
        { to: "/admin/active", label: "Active", icon: CheckCircle2, badge: stats.active },
        { to: "/admin/on-leave", label: "On Leave", icon: CalendarDays, badge: stats.onLeave },
        { to: "/admin/inactive", label: "Inactive", icon: AlertTriangle, badge: stats.inactive },
      ]
    },
    {
      label: "System",
      items: [
        { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
        { to: "/admin/reports", label: "Reports", icon: Sparkles },
        { to: "/admin/settings", label: "Settings", icon: Settings },
      ]
    }
  ];

  const employeeMenuGroups = [
    {
      label: "Workspace",
      items: [
        { to: "/employee/home", label: "Home", icon: Home },
        { to: "/employee/attendance", label: "Attendance", icon: Clock },
        { to: "/employee/leave", label: "Leave Requests", icon: CalendarDays },
        { to: "/employee/announcements", label: "Announcements", icon: Megaphone },
        { to: "/employee/projects", label: "My Projects", icon: FolderGit },
        { to: "/employee/payroll", label: "Payslips", icon: Banknote },
        { to: "/employee/documents", label: "Company Docs", icon: FileText },
      ]
    },
    {
      label: "Account",
      items: [
        { to: "/employee/profile", label: "Profile", icon: User },
        { to: "/employee/settings", label: "Settings", icon: Settings },
      ]
    }
  ];

  const activeGroups = role === 'admin' ? adminMenuGroups : employeeMenuGroups;

  // Filter menu items by search query if set
  const filteredGroups = activeGroups.map(group => {
    const items = group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, items };
  }).filter(group => group.items.length > 0);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon-wrap">
          <span>Ω</span>
        </div>
        <div className="logo-info">
          <span className="logo-title">Aether HR</span>
          <span className="logo-subtitle">{role === 'admin' ? 'Admin Portal' : 'Workspace'}</span>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button 
        className="sidebar-toggle" 
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <ChevronLeft size={14} style={{ transform: collapsed ? "rotate(180deg)" : "none" }} />
      </button>

      {/* Sidebar Search - Hidden when collapsed */}
      {!collapsed && (
        <div className="sidebar-search-container">
          <div className="sidebar-search-box">
            <Search size={14} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search navigation..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        {filteredGroups.map(group => (
          <div key={group.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span className="nav-label">{group.label}</span>
            {group.items.map(item => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon"><Icon size={18} /></span>
                  <span className="nav-link-text">{item.label}</span>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User profile section at the bottom */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {currentUser?.avatar || "AD"}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{currentUser?.name || "System User"}</span>
          <span className="sidebar-user-role">{role}</span>
        </div>
        {!collapsed && (
          <button 
            className="btn btn-ghost btn-sm" 
            style={{ marginLeft: "auto", padding: "4px" }}
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
