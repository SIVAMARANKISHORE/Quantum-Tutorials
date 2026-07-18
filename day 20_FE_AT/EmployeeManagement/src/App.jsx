import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import { EmployeeProvider } from "./context/EmployeeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import FilteredList from "./pages/FilteredList";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Projects from "./pages/Projects";
import Payroll from "./pages/Payroll";
import Documents from "./pages/Documents";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import { Home as HomeIcon, Clock, CalendarDays, Megaphone, User } from "lucide-react";

function MainLayout() {
  const { currentUser } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const role = currentUser?.role || 'employee';
  
  return (
    <div className="app-layout">
      {/*Collapsible sidebar*/}
      <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
      
      <div className={`main-area ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <Topbar />
        
        <Routes>
          <Route path="/" element={<Navigate to={role === 'admin' ? '/admin/dashboard' : '/employee/home'} replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['admin']}><Employees /></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><Departments /></ProtectedRoute>} />
          <Route path="/admin/active" element={<ProtectedRoute allowedRoles={['admin']}><FilteredList status="Active" /></ProtectedRoute>} />
          <Route path="/admin/on-leave" element={<ProtectedRoute allowedRoles={['admin']}><FilteredList status="On Leave" /></ProtectedRoute>} />
          <Route path="/admin/inactive" element={<ProtectedRoute allowedRoles={['admin']}><FilteredList status="Inactive" /></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={['admin']}><Attendance /></ProtectedRoute>} />
          <Route path="/admin/leave" element={<ProtectedRoute allowedRoles={['admin']}><Leave /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['admin']}><Projects /></ProtectedRoute>} />
          <Route path="/admin/payroll" element={<ProtectedRoute allowedRoles={['admin']}><Payroll /></ProtectedRoute>} />
          <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={['admin']}><Documents /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><Announcements /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><div className="page-content"><h2 style={{ fontSize: "20px" }}>Analytics Reports</h2><p style={{ marginTop: "8px" }}>Interactive visual workforce analytics reporting module is currently in standby.</p></div></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

          {/* Employee Routes */}
          <Route path="/employee/home" element={<ProtectedRoute allowedRoles={['employee']}><Home /></ProtectedRoute>} />
          <Route path="/employee/attendance" element={<ProtectedRoute allowedRoles={['employee']}><Attendance /></ProtectedRoute>} />
          <Route path="/employee/leave" element={<ProtectedRoute allowedRoles={['employee']}><Leave /></ProtectedRoute>} />
          <Route path="/employee/announcements" element={<ProtectedRoute allowedRoles={['employee']}><Announcements /></ProtectedRoute>} />
          <Route path="/employee/projects" element={<ProtectedRoute allowedRoles={['employee']}><Projects /></ProtectedRoute>} />
          <Route path="/employee/payroll" element={<ProtectedRoute allowedRoles={['employee']}><Payroll /></ProtectedRoute>} />
          <Route path="/employee/documents" element={<ProtectedRoute allowedRoles={['employee']}><Documents /></ProtectedRoute>} />
          <Route path="/employee/profile" element={<ProtectedRoute allowedRoles={['employee']}><Profile /></ProtectedRoute>} />
          <Route path="/employee/settings" element={<ProtectedRoute allowedRoles={['employee']}><Settings /></ProtectedRoute>} />
        </Routes>
      </div>

      {/* Employee Mobile Navigation Bottom Bar fallback */}
      {role === 'employee' && (
        <div className="mobile-bottom-nav">
          <NavLink to="/employee/home" className={({ isActive }) => "mobile-nav-item" + (isActive ? " active" : "")}>
            <span className="mobile-nav-icon"><HomeIcon size={20} /></span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/employee/attendance" className={({ isActive }) => "mobile-nav-item" + (isActive ? " active" : "")}>
            <span className="mobile-nav-icon"><Clock size={20} /></span>
            <span>Clock</span>
          </NavLink>
          <NavLink to="/employee/leave" className={({ isActive }) => "mobile-nav-item" + (isActive ? " active" : "")}>
            <span className="mobile-nav-icon"><CalendarDays size={20} /></span>
            <span>Leaves</span>
          </NavLink>
          <NavLink to="/employee/announcements" className={({ isActive }) => "mobile-nav-item" + (isActive ? " active" : "")}>
            <span className="mobile-nav-icon"><Megaphone size={20} /></span>
            <span>Notices</span>
          </NavLink>
          <NavLink to="/employee/profile" className={({ isActive }) => "mobile-nav-item" + (isActive ? " active" : "")}>
            <span className="mobile-nav-icon"><User size={20} /></span>
            <span>Profile</span>
          </NavLink>
        </div>
      )}
      
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </EmployeeProvider>
    </BrowserRouter>
  );
}
