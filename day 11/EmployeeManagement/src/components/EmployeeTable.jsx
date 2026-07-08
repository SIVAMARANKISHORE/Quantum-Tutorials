import { useState } from "react";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import EmployeeModal from "./EmployeeModal";
import DeleteModal from "./DeleteModal";

const PAGE_SIZE = 8;

export default function EmployeeTable({ employees, title }) {
  const [search, setSearch]       = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage]           = useState(1);
  const [editEmp, setEditEmp]     = useState(null);
  const [deleteEmp, setDeleteEmp] = useState(null);
  const [sortKey, setSortKey]     = useState("name");
  const [sortAsc, setSortAsc]     = useState(true);

  const departments = ["All", ...new Set(employees.map((e) => e.department))];
  const statuses    = ["All", "Active", "Inactive", "On Leave"];

  function toggleSort(key) {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  const filtered = employees
    .filter((e) => {
      const q = search.toLowerCase();
      return (
        (e.name.toLowerCase().includes(q) ||
         e.email.toLowerCase().includes(q) ||
         e.role.toLowerCase().includes(q) ||
         e.location.toLowerCase().includes(q)) &&
        (deptFilter === "All" || e.department === deptFilter) &&
        (statusFilter === "All" || e.status === statusFilter)
      );
    })
    .sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") va = va.toLowerCase(), vb = vb.toLowerCase();
      return sortAsc ? (va < vb ? -1 : va > vb ? 1 : 0)
                     : (va > vb ? -1 : va < vb ? 1 : 0);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageStart  = (page - 1) * PAGE_SIZE + 1;
  const pageEnd    = Math.min(page * PAGE_SIZE, filtered.length);

  function SortArrow({ col }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4, color: "var(--accent-light)" }}>{sortAsc ? "↑" : "↓"}</span>;
  }

  return (
    <>
      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by name, email, role, location…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="filter-select" value={deptFilter}
          onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}>
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(search || deptFilter !== "All" || statusFilter !== "All") && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setDeptFilter("All"); setStatusFilter("All"); setPage(1); }}>
            ✕ Clear
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table className="emp-table">
          <thead>
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("name")}>
                Employee <SortArrow col="name" />
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("department")}>
                Department <SortArrow col="department" />
              </th>
              <th>Role</th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("status")}>
                Status <SortArrow col="status" />
              </th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("salary")}>
                Salary <SortArrow col="salary" />
              </th>
              <th>Location</th>
              <th style={{ cursor: "pointer" }} onClick={() => toggleSort("joinDate")}>
                Joined <SortArrow col="joinDate" />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty-state">
                    <span className="empty-icon">🔍</span>
                    <span className="empty-text">No employees found</span>
                    <span className="empty-sub">Try adjusting your search or filter.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-cell">
                      <Avatar employee={emp} />
                      <div>
                        <div className="emp-name">{emp.name}</div>
                        <div className="emp-email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-dept">{emp.department}</span>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{emp.role}</td>
                  <td><StatusBadge status={emp.status} /></td>
                  <td style={{ fontWeight: 600, color: "var(--green)" }}>
                    ₹{emp.salary.toLocaleString("en-IN")}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    📍 {emp.location}
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                    {new Date(emp.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-ghost btn-icon btn-sm" title="Edit"
                        onClick={() => setEditEmp(emp)}>✏️</button>
                      <button className="btn btn-danger btn-icon btn-sm" title="Delete"
                        onClick={() => setDeleteEmp(emp)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="pagination">
            <span className="page-info">
              Showing <strong>{pageStart}–{pageEnd}</strong> of <strong>{filtered.length}</strong> employees
            </span>
            <div className="page-btns">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <button key={p} className={`page-btn${p === page ? " active" : ""}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {editEmp   && <EmployeeModal employee={editEmp}   onClose={() => setEditEmp(null)} />}
      {deleteEmp && <DeleteModal   employee={deleteEmp} onClose={() => setDeleteEmp(null)} />}
    </>
  );
}
