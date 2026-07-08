import { useState } from "react";
import { useEmployees } from "../context/EmployeeContext";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeModal from "../components/EmployeeModal";

export default function Employees() {
  const { employees } = useEmployees();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Employees</h1>
          <p className="page-subtitle">{employees.length} employees in your organization</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          ➕ Add Employee
        </button>
      </div>

      <EmployeeTable employees={employees} />

      {showAdd && <EmployeeModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
