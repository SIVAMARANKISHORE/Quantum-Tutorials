import { createContext, useContext, useState, useEffect } from "react";
import { useEmployees } from "./EmployeeContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("ems_user");
    return saved ? JSON.parse(saved) : null;
  });
  const { employees } = useEmployees();

  // Sync currentUser with latest employees data in real time
  useEffect(() => {
    if (currentUser && currentUser.id !== "admin") {
      const latest = employees.find(emp => String(emp.id) === String(currentUser.id));
      if (latest) {
        // Only update if there's an actual change to avoid infinite loops
        if (JSON.stringify(latest) !== JSON.stringify(currentUser)) {
          setCurrentUser(latest);
          localStorage.setItem("ems_user", JSON.stringify(latest));
        }
      }
    }
  }, [employees, currentUser]);

  // On login, we verify credentials against the mock data
  const login = async (identifier, password) => {
    // Check virtual admin fallback first
    if (
      (identifier === "admin@corp.com" || identifier === "admin") &&
      (password === "admin123" || password === "admin")
    ) {
      const adminUser = {
        id: "admin",
        employeeId: "EMP000",
        name: "System Administrator",
        email: "admin@corp.com",
        role: "admin",
        department: "Management",
        avatar: "SA",
        status: "Active",
      };
      setCurrentUser(adminUser);
      localStorage.setItem("ems_user", JSON.stringify(adminUser));
      return { success: true, role: "admin" };
    }

    // identifier can be employeeId or email
    const user = employees.find(
      (emp) => (emp.employeeId === identifier || emp.email === identifier) && emp.password === password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("ems_user", JSON.stringify(user));
      return { success: true, role: user.role };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("ems_user");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
