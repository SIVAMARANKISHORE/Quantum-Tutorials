import { useState } from "react";
import { 
  Edit3, 
  Trash2, 
  Search, 
  Building2, 
  DollarSign, 
  MapPin, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Shield,
  ArrowUpDown
} from "lucide-react";
import EmployeeModal from "./EmployeeModal";
import DeleteModal from "./DeleteModal";

const PAGE_SIZE = 8;

export default function EmployeeTable({ employees }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editEmp, setEditEmp] = useState(null);
  const [deleteEmp, setDeleteEmp] = useState(null);
  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const departments = ["All", ...new Set(employees.map((e) => e.department))];
  const statuses = ["All", "Active", "Inactive", "On Leave"];

  function toggleSort(key) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const filtered = employees
    .filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = 
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.jobTitle || "").toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q) ||
        (e.employeeId || "").toLowerCase().includes(q);
      const matchDept = deptFilter === "All" || e.department === deptFilter;
      const matchStatus = statusFilter === "All" || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      let va = a[sortKey] || "", vb = b[sortKey] || "";
      if (typeof va === "string") {
        va = va.toLowerCase();
        vb = vb.toLowerCase();
      }
      return sortAsc 
        ? (va < vb ? -1 : va > vb ? 1 : 0)
        : (va > vb ? -1 : va < vb ? 1 : 0);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <>
      {/* Search and Filters panel */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          
          <div className="search-panel" style={{ flex: 2, minWidth: "260px" }}>
            <Search size={16} className="text-muted" />
            <input
              placeholder="Search by name, email, credentials, location..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "220px", justifyContent: "flex-end" }}>
            <select 
              className="form-input" 
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
              style={{ padding: "8px 12px", fontSize: "12.5px" }}
            >
              <option value="All">All Departments</option>
              {departments.filter(d => d !== "All").map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select 
              className="form-input" 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              style={{ padding: "8px 12px", fontSize: "12.5px" }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>

            {(search || deptFilter !== "All" || statusFilter !== "All") && (
              <button 
                className="btn btn-ghost btn-sm" 
                onClick={() => { setSearch(""); setDeptFilter("All"); setStatusFilter("All"); setPage(1); }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Directory view */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("name")}>
                Employee <ArrowUpDown size={12} style={{ marginLeft: "4px" }} />
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("department")}>
                Department <ArrowUpDown size={12} style={{ marginLeft: "4px" }} />
              </th>
              <th>Job Title / Role</th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("status")}>
                Status <ArrowUpDown size={12} style={{ marginLeft: "4px" }} />
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("salary")}>
                Salary <ArrowUpDown size={12} style={{ marginLeft: "4px" }} />
              </th>
              <th>Location</th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("joinDate")}>
                Joined <ArrowUpDown size={12} style={{ marginLeft: "4px" }} />
              </th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <span className="empty-text">No employees matching these criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div 
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--border-light)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: 700
                        }}
                      >
                        {emp.avatar || "EE"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                          {emp.name}
                          {emp.role === "admin" && (
                            <ShieldAlert size={12} style={{ color: "var(--primary-light)" }} title="Admin Role" />
                          )}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {emp.employeeId} · {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        fontSize: "11px", 
                        padding: "2px 8px", 
                        borderRadius: "4px", 
                        background: "rgba(99,102,241,0.06)", 
                        color: "var(--primary-light)",
                        fontWeight: 600
                      }}
                    >
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {emp.jobTitle}
                  </td>
                  <td>
                    <span 
                      className={`badge ${
                        emp.status === "Active" 
                          ? "badge-active" 
                          : emp.status === "On Leave" 
                            ? "badge-leave" 
                            : "badge-inactive"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{emp.salary ? emp.salary.toLocaleString("en-IN") : 0}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {emp.location || "-"}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {emp.joinDate}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => setEditEmp(emp)}
                        title="Edit employee record"
                        style={{ padding: "6px" }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm" 
                        onClick={() => setDeleteEmp(emp)}
                        title="Delete employee profile"
                        style={{ padding: "6px", color: "var(--error-light)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "16px 20px", 
              borderTop: "1px solid var(--border-light)" 
            }}
          >
            <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Showing <strong>{pageStart}–{pageEnd}</strong> of <strong>{filtered.length}</strong> employees
            </span>
            <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <button 
                className="btn btn-secondary btn-sm" 
                disabled={page === 1} 
                onClick={() => setPage(1)}
                style={{ padding: "4px 8px" }}
              >
                «
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                style={{ padding: "4px 8px" }}
              >
                ‹
              </button>
              
              <span style={{ fontSize: "12.5px", margin: "0 8px", color: "var(--text-main)" }}>
                Page <strong>{page}</strong> of {totalPages}
              </span>

              <button 
                className="btn btn-secondary btn-sm" 
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)}
                style={{ padding: "4px 8px" }}
              >
                ›
              </button>
              <button 
                className="btn btn-secondary btn-sm" 
                disabled={page === totalPages} 
                onClick={() => setPage(totalPages)}
                style={{ padding: "4px 8px" }}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {editEmp && <EmployeeModal employee={editEmp} onClose={() => setEditEmp(null)} />}
      {deleteEmp && <DeleteModal employee={deleteEmp} onClose={() => setDeleteEmp(null)} />}
    </>
  );
}
