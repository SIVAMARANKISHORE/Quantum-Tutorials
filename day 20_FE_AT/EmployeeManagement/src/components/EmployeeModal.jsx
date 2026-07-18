import { useState, useEffect } from "react";
import { useEmployees } from "../context/EmployeeContext";
import { DEPARTMENTS, ROLES, STATUS_OPTIONS } from "../data/employeeData";
import { Save, X, Plus } from "lucide-react";

const EMPTY = {
  name: "", 
  email: "", 
  phone: "", 
  department: "Engineering",
  jobTitle: "", 
  role: "employee", // system access role: admin or employee
  status: "Active", 
  salary: "", 
  joinDate: "", 
  location: "", 
  gender: "Male",
  password: "password123"
};

export default function EmployeeModal({ employee, onClose }) {
  const { addEmployee, updateEmployee } = useEmployees();
  const isEdit = Boolean(employee);

  const [form, setForm] = useState(isEdit ? { ...employee } : { ...EMPTY });
  const [errors, setErrors] = useState({});

  // Keep job titles synced with department choice
  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({ ...f, jobTitle: ROLES[f.department]?.[0] || "" }));
    }
  }, [form.department, isEdit]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) {
      e.email = "Email account is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Please specify a valid email format";
    }
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.salary) e.salary = "Salary package is required";
    if (!form.joinDate) e.joinDate = "Join date is required";
    if (!form.location.trim()) e.location = "Office location base is required";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { 
      setErrors(errs); 
      return; 
    }
    
    const payload = { 
      ...form, 
      salary: parseInt(form.salary) 
    };

    let result;
    if (isEdit) {
      result = await updateEmployee(employee.id, payload);
    } else {
      result = await addEmployee(payload);
    }

    if (result && result.success) {
      onClose();
    }
  };

  const jobTitlesList = ROLES[form.department] || [];

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ zIndex: 1000 }}
    >
      <div className="modal-content" style={{ maxWidth: "600px" }}>
        
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {isEdit ? "Edit Employee Profile" : "Add New Employee"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div className="form-group">
              <label className="form-label">Legal Full Name *</label>
              <input 
                className="form-input"
                name="name" 
                value={form.name} 
                onChange={handleChange}
                placeholder="e.g. Arjun Sharma" 
                required
              />
              {errors.name && <span style={{ color: "var(--error-light)", fontSize: "11px" }}>{errors.name}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Email Account *</label>
                <input 
                  type="email"
                  className="form-input"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange}
                  placeholder="e.g. arjun@company.com" 
                  required
                />
                {errors.email && <span style={{ color: "var(--error-light)", fontSize: "11px" }}>{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input 
                  className="form-input"
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  placeholder="+91 98765 43210" 
                  required
                />
                {errors.phone && <span style={{ color: "var(--error-light)", fontSize: "11px" }}>{errors.phone}</span>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Department Division</label>
                <select 
                  className="form-input" 
                  name="department" 
                  value={form.department} 
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Job Title Designation</label>
                <select 
                  className="form-input" 
                  name="jobTitle" 
                  value={form.jobTitle} 
                  onChange={handleChange}
                >
                  {jobTitlesList.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">HQ Office Location *</label>
                <input 
                  className="form-input"
                  name="location" 
                  value={form.location} 
                  onChange={handleChange}
                  placeholder="e.g. Bangalore" 
                  required
                />
                {errors.location && <span style={{ color: "var(--error-light)", fontSize: "11px" }}>{errors.location}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Gender Identity</label>
                <select 
                  className="form-input" 
                  name="gender" 
                  value={form.gender} 
                  onChange={handleChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Join Date *</label>
                <input 
                  type="date"
                  className="form-input"
                  name="joinDate" 
                  value={form.joinDate} 
                  onChange={handleChange} 
                  required
                />
                {errors.joinDate && <span style={{ color: "var(--error-light)", fontSize: "11px" }}>{errors.joinDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Salary (₹/yr) *</label>
                <input 
                  type="number"
                  className="form-input"
                  name="salary" 
                  value={form.salary} 
                  onChange={handleChange}
                  placeholder="e.g. 750000" 
                  min="10000" 
                  required
                />
                {errors.salary && <span style={{ color: "var(--error-light)", fontSize: "11px" }}>{errors.salary}</span>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Profile Status</label>
                <select 
                  className="form-input" 
                  name="status" 
                  value={form.status} 
                  onChange={handleChange}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">System Access Role *</label>
                <select 
                  className="form-input" 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange}
                >
                  <option value="employee">Employee (Limited Access)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Access Password</label>
              <input 
                type="text"
                className="form-input" 
                name="password"
                value={form.password} 
                onChange={handleChange}
                placeholder="password123" 
              />
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              {isEdit ? <Save size={16} /> : <Plus size={16} />}
              {isEdit ? "Save Changes" : "Create Profile"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
