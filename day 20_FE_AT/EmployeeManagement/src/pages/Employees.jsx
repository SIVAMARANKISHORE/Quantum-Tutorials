import { useState } from "react";
import { useEmployees } from "../context/EmployeeContext";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeModal from "../components/EmployeeModal";
import { UserPlus, Users } from "lucide-react";

export default function Employees() {
  const { employees } = useEmployees();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page-content">
      <div className="toolbar" style={{ alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800 }}>Employee Directory</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {employees.length} corporate profiles registered
          </p>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAdd(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <UserPlus size={16} /> Register Employee
        </button>
      </div>

      <EmployeeTable employees={employees} />

      {showAdd && <EmployeeModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
