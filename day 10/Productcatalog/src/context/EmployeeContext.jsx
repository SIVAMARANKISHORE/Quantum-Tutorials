import { createContext, useContext, useState, useCallback } from "react";
import { initialEmployees } from "../data/employeeData";

const EmployeeContext = createContext();

export function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const addEmployee = useCallback((employee) => {
    setEmployees((prev) => {
      const newId = Math.max(...prev.map((e) => e.id), 0) + 1;
      const initials = employee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      return [...prev, { ...employee, id: newId, avatar: initials }];
    });
    showNotification("Employee added successfully!");
  }, [showNotification]);

  const updateEmployee = useCallback((id, updated) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const initials = updated.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return { ...emp, ...updated, avatar: initials };
        }
        return emp;
      })
    );
    showNotification("Employee updated successfully!");
  }, [showNotification]);

  const deleteEmployee = useCallback((id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    showNotification("Employee deleted.", "error");
  }, [showNotification]);

  const getEmployee = useCallback((id) => employees.find((e) => e.id === parseInt(id)), [employees]);

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "Active").length,
    inactive: employees.filter((e) => e.status === "Inactive").length,
    onLeave: employees.filter((e) => e.status === "On Leave").length,
    departments: [...new Set(employees.map((e) => e.department))].length,
    avgSalary: Math.round(employees.reduce((acc, e) => acc + e.salary, 0) / employees.length),
  };

  const departmentData = [...new Set(employees.map((e) => e.department))].map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept);
    return {
      name: dept,
      count: deptEmployees.length,
      active: deptEmployees.filter((e) => e.status === "Active").length,
      avgSalary: Math.round(deptEmployees.reduce((acc, e) => acc + e.salary, 0) / deptEmployees.length),
    };
  });

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee, getEmployee, stats, departmentData, notification }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployees() {
  return useContext(EmployeeContext);
}
