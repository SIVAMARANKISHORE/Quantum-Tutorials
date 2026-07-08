import { useEmployees } from "../context/EmployeeContext";

export default function DeleteModal({ employee, onClose }) {
  const { deleteEmployee } = useEmployees();

  function handleDelete() {
    deleteEmployee(employee.id);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal">
        <span className="confirm-icon">🗑️</span>
        <h2 className="confirm-title">Delete Employee?</h2>
        <p className="confirm-msg">
          Are you sure you want to remove <strong style={{ color: "var(--text-primary)" }}>{employee.name}</strong> from the system?
          <br />This action <strong style={{ color: "var(--red)" }}>cannot be undone</strong>.
        </p>
        <div className="confirm-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
