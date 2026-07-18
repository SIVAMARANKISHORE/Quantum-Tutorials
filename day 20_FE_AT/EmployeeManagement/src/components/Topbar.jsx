import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { Bell, LogOut, Megaphone, Calendar } from "lucide-react";

const PAGE_META = {
  "/admin/dashboard":           { title: "Command Center",   subtitle: "Real-time enterprise metrics & operations" },
  "/admin/employees":           { title: "Employee Directory",subtitle: "Manage profiles, roles, and status" },
  "/admin/departments":         { title: "Departments Catalog", subtitle: "Department breakdown and resource allocation" },
  "/admin/active":              { title: "Active Force",      subtitle: "Currently available staff members" },
  "/admin/on-leave":            { title: "Leave Tracker",    subtitle: "Staff members currently on approved leave" },
  "/admin/inactive":            { title: "Off-boarded Force",  subtitle: "Inactive profiles requiring archiving" },
  "/admin/attendance":          { title: "Attendance Logs",   subtitle: "System logs and clock in-out records" },
  "/admin/leave":               { title: "Leave Control Center", subtitle: "Review and process pending leave requests" },
  "/admin/projects":            { title: "Projects Monitor",  subtitle: "Company active deliverables and assignments" },
  "/admin/payroll":             { title: "Payroll Manager",   subtitle: "Compensation registers and summaries" },
  "/admin/documents":           { title: "Documents Registry", subtitle: "Archived letters and employee contracts" },
  "/admin/announcements":       { title: "Announcement Desk", subtitle: "Broadcast notifications and pinned circulars" },
  "/admin/reports":             { title: "Analytics & Reports",subtitle: "Workforce distribution and trends" },
  "/admin/settings":            { title: "System Preferences", subtitle: "Admin portal parameters and sync settings" },
  
  "/employee/home":             { title: "Welcome Home",      subtitle: "Workspace dashboard for today" },
  "/employee/attendance":       { title: "Attendance Dashboard", subtitle: "Clock in-out records and shifts" },
  "/employee/leave":            { title: "Leave Workspace",    subtitle: "Apply for leaves and view history" },
  "/employee/projects":         { title: "My Projects",       subtitle: "Assigned duties and tasks" },
  "/employee/payroll":          { title: "Payslips & Income",  subtitle: "View compensation details and forms" },
  "/employee/documents":        { title: "Shared Knowledge",  subtitle: "View company guidelines and forms" },
  "/employee/profile":          { title: "Personal Profile",  subtitle: "Manage personal details and checklist" },
  "/employee/announcements":    { title: "Notice Feed",       subtitle: "Broadcasts and alerts feed" },
  "/employee/settings":         { title: "Workspace Preferences", subtitle: "Theme selector and settings" },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { announcements } = useEmployees();
  const [showNotifications, setShowNotifications] = useState(false);
  const popoverRef = useRef(null);

  const meta = PAGE_META[pathname] || { title: "Aether Portal", subtitle: "Enterprise Employee Management" };
  const dateStr = new Date().toLocaleDateString("en-IN", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  // Track read announcements in LocalStorage to show unread badges
  const [readAnnouncements, setReadAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(`ems_read_ann_${currentUser?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`ems_read_ann_${currentUser.id}`, JSON.stringify(readAnnouncements));
    }
  }, [readAnnouncements, currentUser]);

  // Click outside to close notification drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadAnnouncements = announcements.filter(
    ann => !readAnnouncements.includes(ann.id)
  );

  const handleMarkAllRead = () => {
    const allIds = announcements.map(ann => ann.id);
    setReadAnnouncements(allIds);
  };

  const handleNotificationClick = (id) => {
    if (!readAnnouncements.includes(id)) {
      setReadAnnouncements([...readAnnouncements, id]);
    }
    setShowNotifications(false);
    navigate(currentUser?.role === 'admin' ? '/admin/announcements' : '/employee/announcements');
  };

  return (
    <header className="topbar">
      {/* Title / Breadcrumbs */}
      <div className="topbar-left">
        <h1 className="topbar-title">{meta.title}</h1>
        <div className="topbar-subtitle">{meta.subtitle}</div>
      </div>

      {/* Profile & Notifications Actions */}
      <div className="topbar-right">
        {/* Date Display */}
        <div className="topbar-meta" style={{ marginRight: "12px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={13} /> {dateStr}
          </span>
        </div>

        {/* Notifications Icon with Popover */}
        <div style={{ position: "relative" }} ref={popoverRef}>
          <button 
            className="topbar-noti-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Announcements Feed"
          >
            <Bell size={18} />
            {unreadAnnouncements.length > 0 && <span className="noti-dot"></span>}
          </button>

          {showNotifications && (
            <div 
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                width: "320px",
                background: "var(--bg-popover)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 200,
                overflow: "hidden",
                padding: "8px 0"
              }}
            >
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px 8px",
                  borderBottom: "1px solid var(--border-light)"
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "13px" }}>Notices & Alerts</span>
                {unreadAnnouncements.length > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "var(--primary-light)", 
                      fontSize: "11px", 
                      fontWeight: 600, 
                      cursor: "pointer" 
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                {announcements.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-dimmed)", fontSize: "12px" }}>
                    <Megaphone size={24} style={{ marginBottom: "8px", opacity: 0.5 }} />
                    <p>No announcements yet</p>
                  </div>
                ) : (
                  announcements.slice(0, 4).map(ann => {
                    const isUnread = !readAnnouncements.includes(ann.id);
                    return (
                      <div 
                        key={ann.id} 
                        onClick={() => handleNotificationClick(ann.id)}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--border-light)",
                          cursor: "pointer",
                          background: isUnread ? "rgba(99,102,241,0.04)" : "transparent",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = isUnread ? "rgba(99,102,241,0.04)" : "transparent"}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span 
                            style={{ 
                              fontWeight: isUnread ? 700 : 500, 
                              fontSize: "12.5px", 
                              color: isUnread ? "var(--text-main)" : "var(--text-muted)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "180px"
                            }}
                          >
                            {ann.title}
                          </span>
                          <span 
                            style={{ 
                              fontSize: "9px", 
                              padding: "2px 6px", 
                              borderRadius: "4px",
                              fontWeight: 700,
                              background: ann.priority === 'High' ? 'var(--error-soft)' : 'rgba(255,255,255,0.04)',
                              color: ann.priority === 'High' ? 'var(--error-light)' : 'var(--text-dimmed)'
                            }}
                          >
                            {ann.priority}
                          </span>
                        </div>
                        <p 
                          style={{ 
                            fontSize: "11px", 
                            color: "var(--text-dimmed)", 
                            marginTop: "4px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {ann.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ padding: "8px 16px 2px", borderTop: "1px solid var(--border-light)", textAlign: "center" }}>
                <Link 
                  to={currentUser?.role === 'admin' ? '/admin/announcements' : '/employee/announcements'} 
                  onClick={() => setShowNotifications(false)}
                  style={{ 
                    fontSize: "11.5px", 
                    color: "var(--primary-light)", 
                    textDecoration: "none",
                    fontWeight: 600
                  }}
                >
                  View all announcements
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "10px", borderLeft: "1px solid var(--border-light)" }}>
          <div className="topbar-avatar-wrap">
            {currentUser?.avatar || "AD"}
          </div>
          <div className="topbar-meta">
            <span className="topbar-username">{currentUser?.name || "System Administrator"}</span>
            <span className="topbar-userrole">{currentUser?.role === 'admin' ? 'Administrator' : (currentUser?.jobTitle || 'Employee')}</span>
          </div>
        </div>

        {/* Logout Quick Trigger */}
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={() => { logout(); navigate("/login"); }}
          title="Sign Out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
