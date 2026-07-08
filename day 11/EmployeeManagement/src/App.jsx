import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EmployeeProvider } from "./context/EmployeeContext";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import FilteredList from "./pages/FilteredList";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <Routes>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/employees"   element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/active"      element={<FilteredList status="Active" />} />
          <Route path="/on-leave"    element={<FilteredList status="On Leave" />} />
          <Route path="/inactive"    element={<FilteredList status="Inactive" />} />
        </Routes>
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <EmployeeProvider>
        <Layout />
      </EmployeeProvider>
    </BrowserRouter>
  );
}
