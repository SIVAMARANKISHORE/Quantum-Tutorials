import { useEmployees } from "../context/EmployeeContext";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteModal({ employee, onClose }) {
  const { deleteEmployee } = useEmployees();

  const handleDelete = async () => {
    const success = await deleteEmployee(employee.id);
    if (success) {
      onClose();
    } else {
      // Just close it if request completes
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 1010 }}
    >
      <div className="modal-content" style={{ maxWidth: "420px", textAlign: "center" }}>
        
        {/* Header */}
        <div className="modal-header" style={{ justifyContent: "center", position: "relative" }}>
          <h3 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--error-light)" }}>
            <AlertTriangle size={18} /> Delete Profile
          </h3>
          <button 
            className="close-btn" 
            onClick={onClose} 
            style={{ position: "absolute", right: "16px", top: "16px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Body */}
        <div className="modal-body" style={{ padding: "28px 24px" }}>
          <div 
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--error-soft)",
              color: "var(--error-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px"
            }}
          >
            <Trash2 size={22} />
          </div>

          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-main)" }}>
            Are you sure you want to remove <strong style={{ color: "var(--text-main)" }}>{employee.name}</strong> (ID: {employee.employeeId}) from the system?
          </p>
          <p style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "12px", background: "rgba(255,255,255,0.02)", padding: "8px", borderRadius: "6px", border: "1px dashed var(--border-light)" }}>
            ⚠️ This operation will purge this employee's records and cannot be undone.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ justifyContent: "center", gap: "12px" }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={handleDelete}
            style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Trash2 size={14} /> Yes, Delete
          </button>
        </div>

      </div>
    </div>
  );
}
