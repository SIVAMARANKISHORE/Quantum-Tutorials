import { useState, useEffect } from "react";
import { useEmployees } from "../context/EmployeeContext";
import { DEPARTMENTS, ROLES, STATUS_OPTIONS } from "../data/employeeData";

const EMPTY = {
  name: "", email: "", phone: "", department: "Engineering",
  role: "", status: "Active", salary: "", joinDate: "", location: "", gender: "Male",
};

export default function EmployeeModal({ employee, onClose }) {
  const { addEmployee, updateEmployee } = useEmployees();
  const isEdit = Boolean(employee);

  const [form, setForm] = useState(isEdit ? { ...employee } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  // keep roles in sync with department
  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({ ...f, role: ROLES[f.department]?.[0] || "" }));
    }
  }, [form.department]);

  function validate() {
    const e = {};
    if (!form.name.trim())   e.name  = "Name is required";
    if (!form.email.trim())  e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim())  e.phone = "Phone is required";
    if (!form.salary)        e.salary = "Salary is required";
    if (!form.joinDate)      e.joinDate = "Join date is required";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { ...form, salary: parseInt(form.salary) };
    if (isEdit) updateEmployee(employee.id, payload);
    else        addEmployee(payload);
    onClose();
  }

  const roles = ROLES[form.department] || [];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? "✏️ Edit Employee" : "➕ Add Employee"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group full">
              <label className="form-label">Full Name *</label>
              <input className={`form-input${errors.name ? " error" : ""}`}
                name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Arjun Sharma" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-input${errors.email ? " error" : ""}`}
                name="email" value={form.email} onChange={handleChange}
                placeholder="arjun@corp.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className={`form-input${errors.phone ? " error" : ""}`}
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 98765 43210" />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select className="form-select" name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Salary (₹/yr) *</label>
              <input className={`form-input${errors.salary ? " error" : ""}`}
                name="salary" type="number" value={form.salary} onChange={handleChange}
                placeholder="75000" min="10000" />
              {errors.salary && <span className="form-error">{errors.salary}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Join Date *</label>
              <input className={`form-input${errors.joinDate ? " error" : ""}`}
                name="joinDate" type="date" value={form.joinDate} onChange={handleChange} />
              {errors.joinDate && <span className="form-error">{errors.joinDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input className={`form-input${errors.location ? " error" : ""}`}
                name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Bangalore" />
              {errors.location && <span className="form-error">{errors.location}</span>}
            </div>

          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "💾 Save Changes" : "➕ Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
