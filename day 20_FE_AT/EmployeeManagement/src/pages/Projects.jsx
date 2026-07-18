import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEmployees } from "../context/EmployeeContext";
import { 
  FolderGit, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  Trash2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    name: "Phoenix Cloud Migration",
    description: "Migrating core database instances to hybrid GCP cloud architecture.",
    status: "Active",
    deadline: "2026-09-30",
    progress: 45,
    assignees: [
      { id: "EMP001", name: "Arjun Sharma", avatar: "AS" },
      { id: "EMP002", name: "Priya Nair", avatar: "PN" }
    ]
  },
  {
    id: "proj-2",
    name: "Aether UI Refactor",
    description: "Overhauling frontend design system to modern glassmorphic dashboard guidelines.",
    status: "Active",
    deadline: "2026-08-15",
    progress: 75,
    assignees: [
      { id: "EMP001", name: "Arjun Sharma", avatar: "AS" },
      { id: "EMP003", name: "Rohan Mehta", avatar: "RM" }
    ]
  },
  {
    id: "proj-3",
    name: "Enterprise SSO Integration",
    description: "Implementing SAML and OAuth authentication flows for corporate access.",
    status: "Completed",
    deadline: "2026-06-01",
    progress: 100,
    assignees: [
      { id: "EMP002", name: "Priya Nair", avatar: "PN" }
    ]
  }
];

export default function Projects() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const { employees } = useEmployees();
  
  const [projects, setProjects] = useLocalStorage("ems_projects", []);

  // Initialize default projects on mount if list is empty
  useEffect(() => {
    if (projects.length === 0) {
      setProjects(DEFAULT_PROJECTS);
    }
  }, [projects, setProjects]);
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(10);
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !deadline) return;

    // Map selected IDs to assignee objects
    const mappedAssignees = employees
      .filter(emp => selectedAssignees.includes(emp.employeeId))
      .map(emp => ({ id: emp.employeeId, name: emp.name, avatar: emp.avatar }));

    const newProject = {
      id: Date.now().toString(),
      name,
      description,
      status: "Active",
      deadline,
      progress: parseInt(progress) || 10,
      assignees: mappedAssignees.length > 0 ? mappedAssignees : [{ id: currentUser.employeeId, name: currentUser.name, avatar: currentUser.avatar }]
    };

    setProjects([newProject, ...projects]);
    setShowForm(false);
    setName("");
    setDescription("");
    setDeadline("");
    setProgress(10);
    setSelectedAssignees([]);
  };

  const handleStatus = (id, newStatus) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          status: newStatus, 
          progress: newStatus === "Completed" ? 100 : p.progress 
        };
      }
      return p;
    }));
  };

  const handleProgressChange = (id, newProgress) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, progress: parseInt(newProgress) || 0 } : p
    ));
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const toggleAssignee = (empId) => {
    if (selectedAssignees.includes(empId)) {
      setSelectedAssignees(selectedAssignees.filter(id => id !== empId));
    } else {
      setSelectedAssignees([...selectedAssignees, empId]);
    }
  };

  // For simulation: employees see projects assigned to them OR all active projects
  const displayProjects = isAdmin 
    ? projects 
    : projects.filter(p => p.status !== "Archived");

  // Summary Metrics
  const activeCount = projects.filter(p => p.status === "Active").length;
  const completedCount = projects.filter(p => p.status === "Completed").length;

  return (
    <div className="page-content">
      {/* Metrics Row */}
      <div className="stats-grid" style={{ marginBottom: "24px" }}>
        <div className="card stat-card" style={{ "--card-color": "var(--primary)" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--primary-soft)", color: "var(--primary-light)" }}>
            <FolderGit size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Total Projects</div>
            <div className="stat-change">Overall initiatives logged</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "var(--info)" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--info-soft)", color: "var(--info-light)" }}>
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{activeCount}</div>
            <div className="stat-label">Active Initiatives</div>
            <div className="stat-change">Currently in progress</div>
          </div>
        </div>

        <div className="card stat-card" style={{ "--card-color": "var(--success)" }}>
          <div className="stat-icon-wrap" style={{ background: "var(--success-soft)", color: "var(--success-light)" }}>
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Deliverables Met</div>
            <div className="stat-change">Completed tasks catalog</div>
          </div>
        </div>
      </div>

      {/* Toolbar header */}
      <div className="toolbar" style={{ alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800 }}>
            {isAdmin ? "Corporate Initiatives" : "My Project Board"}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Track task allocations, milestones, and deliverable targets.
          </p>
        </div>
        {isAdmin && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {/* Creation form */}
      {showForm && isAdmin && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <h3 className="card-title" style={{ marginBottom: "16px" }}>Create Project</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Project Name</label>
                <input 
                  required 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Phoenix Cloud Migration"
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Deadline Date</label>
                <input 
                  required 
                  type="date" 
                  className="form-input" 
                  value={deadline} 
                  onChange={e => setDeadline(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Scope Description</label>
                <textarea 
                  required 
                  className="form-input" 
                  placeholder="Summarize initiative goals..."
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  style={{ minHeight: "80px" }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Initial Progress (%)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  min="0" 
                  max="100"
                  value={progress} 
                  onChange={e => setProgress(e.target.value)} 
                />
              </div>
            </div>

            {/* Select assignees checklist */}
            <div className="form-group">
              <label className="form-label">Assign Team Members</label>
              <div 
                style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "8px", 
                  maxHeight: "100px", 
                  overflowY: "auto",
                  background: "rgba(255,255,255,0.01)",
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)"
                }}
              >
                {employees.map(emp => (
                  <button
                    type="button"
                    key={emp.employeeId}
                    onClick={() => toggleAssignee(emp.employeeId)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "11px",
                      fontWeight: 600,
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: selectedAssignees.includes(emp.employeeId) ? "1px solid var(--primary-light)" : "1px solid var(--border-light)",
                      background: selectedAssignees.includes(emp.employeeId) ? "var(--primary-soft)" : "transparent",
                      color: selectedAssignees.includes(emp.employeeId) ? "var(--primary-light)" : "var(--text-muted)"
                    }}
                  >
                    {emp.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Create Project</button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Board Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {displayProjects.length === 0 ? (
          <div className="card" style={{ gridColumn: "1/-1", padding: "48px", textAlign: "center" }}>
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <span className="empty-text">No active corporate projects on board.</span>
            </div>
          </div>
        ) : (
          displayProjects.map(proj => (
            <div key={proj.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Header */}
              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700 }}>{proj.name}</h3>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                    <Calendar size={12} /> Deadline: {proj.deadline}
                  </span>
                </div>
                
                <span 
                  className="badge" 
                  style={{
                    fontSize: "8.5px",
                    background: proj.status === 'Completed' ? 'var(--success-soft)' : proj.status === 'Archived' ? 'rgba(255,255,255,0.03)' : 'var(--primary-soft)',
                    color: proj.status === 'Completed' ? 'var(--success-light)' : proj.status === 'Archived' ? 'var(--text-dimmed)' : 'var(--primary-light)'
                  }}
                >
                  {proj.status}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5", flex: 1 }}>
                {proj.description}
              </p>

              {/* Progress bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  <span>Task Completion progress</span>
                  <strong>{proj.progress}%</strong>
                </div>
                <div className="dept-bar-track" style={{ height: "5px" }}>
                  <div 
                    className="dept-bar-fill" 
                    style={{ 
                      width: `${proj.progress}%`,
                      background: proj.status === 'Completed' ? 'var(--success)' : 'var(--primary)'
                    }}
                  />
                </div>
              </div>

              {/* Assignees visual bubbles */}
              <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "12px", marginTop: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Users size={12} className="text-muted" style={{ marginRight: "4px" }} />
                  <div style={{ display: "flex", marginLeft: "-4px" }}>
                    {(proj.assignees || []).map((ass, i) => (
                      <div 
                        key={ass.id || i}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "var(--primary-soft)",
                          color: "var(--primary-light)",
                          border: "1.5px solid var(--bg-app)",
                          fontSize: "8.5px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: i > 0 ? "-6px" : "0",
                          zIndex: 10 - i
                        }}
                        title={ass.name}
                      >
                        {ass.avatar || (ass.name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit settings for Admin */}
                {isAdmin && (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <select 
                      className="form-input" 
                      style={{ padding: "4px 8px", fontSize: "10.5px", width: "95px" }}
                      value={proj.status} 
                      onChange={(e) => handleStatus(proj.id, e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>

                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={proj.progress}
                      onChange={e => handleProgressChange(proj.id, e.target.value)}
                      style={{ width: "60px", accentColor: "var(--primary)", height: "4px" }}
                      title="Adjust completion rate"
                    />

                    <button 
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px", color: "var(--error-light)" }}
                      onClick={() => handleDelete(proj.id)}
                      title="Remove Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
