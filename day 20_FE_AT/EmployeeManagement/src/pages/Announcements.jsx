import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmployees } from "../context/EmployeeContext";
import { 
  Megaphone, 
  Pin, 
  Trash2, 
  Plus, 
  Paperclip, 
  Check, 
  Eye, 
  AlertCircle,
  FileText,
  BookmarkCheck
} from "lucide-react";

export default function Announcements() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const { 
    announcements, 
    addAnnouncement, 
    deleteAnnouncement, 
    employees 
  } = useEmployees();

  // Retrieve departments for targeting dropdown
  const departmentsList = ["All", ...new Set(employees.map(e => e.department))];

  // Forms state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [targetDept, setTargetDept] = useState("All");
  const [pinned, setPinned] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState("");

  // Search/Filters state for feed
  const [filterDept, setFilterDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Read status tracking
  const [readAnnouncements, setReadAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(`ems_read_ann_${currentUser?.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`ems_read_ann_${currentUser.id}`, JSON.stringify(readAnnouncements));
    }
  }, [readAnnouncements, currentUser]);

  const handleMarkRead = (id, event) => {
    event.stopPropagation();
    if (readAnnouncements.includes(id)) {
      setReadAnnouncements(readAnnouncements.filter(item => item !== id));
    } else {
      setReadAnnouncements([...readAnnouncements, id]);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = announcements.map(ann => ann.id);
    setReadAnnouncements(allIds);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      title,
      content,
      priority,
      pinned,
      departments: [targetDept]
    };

    // Include virtual file attachment details if present
    if (attachedFileName) {
      payload.attachment = {
        name: attachedFileName,
        size: "1.4 MB"
      };
    }

    const success = await addAnnouncement(payload);
    if (success) {
      setTitle("");
      setContent("");
      setPriority("Normal");
      setTargetDept("All");
      setPinned(false);
      setAttachedFileName("");
    }
  };

  // Filter announcements visible to user
  const visibleAnnouncements = announcements.filter(ann => {
    // 1. Role checks
    if (!isAdmin) {
      // Employees only see announcements targeting "All" or their own department
      const targets = ann.departments || ["All"];
      const matchesDept = targets.includes("All") || targets.includes(currentUser?.department);
      if (!matchesDept) return false;
    } else {
      // Admin filter from dropdown selector
      if (filterDept !== "All") {
        const targets = ann.departments || ["All"];
        if (!targets.includes(filterDept)) return false;
      }
    }

    // 2. Search query check
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = ann.title.toLowerCase().includes(query);
      const matchContent = ann.content.toLowerCase().includes(query);
      return matchTitle || matchContent;
    }

    return true;
  });

  // Sort: Pinned items on top, then newest first
  const sortedAnnouncements = [...visibleAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
  });

  // Simple state for expanded announcements detail view
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="page-content">
      <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1.1fr 1.9fr" : "1fr", gap: "28px" }}>
        
        {/* Left Column: Admin Publish form */}
        {isAdmin && (
          <div>
            <div className="card" style={{ sticky: "top", top: "96px" }}>
              <h3 className="card-title" style={{ marginBottom: "20px" }}><Megaphone size={18} /> Publish Notice</h3>
              
              <form onSubmit={handlePublish} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Notice Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Q3 Corporate Guidelines Update"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Scope / Target Department</label>
                  <select 
                    className="form-input"
                    value={targetDept}
                    onChange={e => setTargetDept(e.target.value)}
                  >
                    {departmentsList.map(dept => (
                      <option key={dept} value={dept}>{dept === 'All' ? 'All Employees' : `${dept} Department`}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Priority Level</label>
                    <select 
                      className="form-input"
                      value={priority}
                      onChange={e => setPriority(e.target.value)}
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, justifyContent: "center" }}>
                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", height: "100%", marginTop: "16px" }}>
                      <input 
                        type="checkbox"
                        checked={pinned}
                        onChange={e => setPinned(e.target.checked)}
                        style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                      />
                      <span style={{ fontSize: "12.5px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}><Pin size={12} /> Pin Notice</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Message Details</label>
                  <textarea 
                    className="form-input" 
                    placeholder="Write detailed announcements details here..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    style={{ minHeight: "120px" }}
                    required
                  />
                </div>

                {/* Virtual File Attachment */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Virtual Attachments (Mock)</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. policy_guide.pdf (Optional)"
                      value={attachedFileName}
                      onChange={e => setAttachedFileName(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ padding: "10px" }}
                      onClick={() => setAttachedFileName("Q3_financial_plan.pdf")}
                      title="Attach mock document"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ height: "42px", marginTop: "8px" }}>
                  <Plus size={16} /> Broadcast Circular
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Right Column: Published Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Filter Bar */}
          <div className="card" style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "220px" }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search notices title or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: "8px 14px", fontSize: "12.5px" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isAdmin && (
                  <select 
                    className="form-input"
                    value={filterDept}
                    onChange={e => setFilterDept(e.target.value)}
                    style={{ padding: "8px 14px", width: "160px", fontSize: "12.5px" }}
                  >
                    <option value="All">All Scopes</option>
                    {departmentsList.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                )}

                {!isAdmin && announcements.length > 0 && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleMarkAllRead}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <BookmarkCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feed List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {sortedAnnouncements.length === 0 ? (
              <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
                <Megaphone size={36} style={{ color: "var(--text-dimmed)", marginBottom: "12px", opacity: 0.5 }} />
                <h4 style={{ fontSize: "14px", color: "var(--text-muted)" }}>No circular announcements found</h4>
                <p style={{ fontSize: "12px", color: "var(--text-dimmed)", marginTop: "4px" }}>
                  {searchQuery ? "Try altering search terms." : "Announcements will appear here when published."}
                </p>
              </div>
            ) : (
              sortedAnnouncements.map(ann => {
                const isUnread = !isAdmin && !readAnnouncements.includes(ann.id);
                const isExpanded = expandedId === ann.id;
                
                return (
                  <div 
                    key={ann.id} 
                    className="card"
                    style={{
                      borderLeft: ann.pinned 
                        ? "4px solid var(--primary)" 
                        : ann.priority === "High" 
                          ? "4px solid var(--error)" 
                          : "1px solid var(--border-light)",
                      padding: "20px",
                      cursor: "pointer"
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          
                          {/* Unread indicator dot */}
                          {isUnread && (
                            <span 
                              style={{ 
                                width: "8px", 
                                height: "8px", 
                                borderRadius: "50%", 
                                background: "var(--primary-light)",
                                display: "inline-block",
                                boxShadow: "0 0 6px var(--primary-light)"
                              }} 
                            />
                          )}

                          <h4 style={{ fontSize: "15px", fontWeight: 700, color: isUnread ? "var(--text-main)" : "var(--text-main)" }}>
                            {ann.title}
                          </h4>

                          {/* Pinned Label */}
                          {ann.pinned && (
                            <span style={{ color: "var(--primary-light)", display: "flex", alignItems: "center", gap: "2px" }} title="Pinned Announcement">
                              <Pin size={12} fill="var(--primary-light)" />
                            </span>
                          )}

                          {/* Priority tag */}
                          <span 
                            className="badge" 
                            style={{
                              fontSize: "8.5px",
                              padding: "2px 6px",
                              background: 
                                ann.priority === "High" 
                                  ? "var(--error-soft)" 
                                  : ann.priority === "Low" 
                                    ? "var(--success-soft)" 
                                    : "rgba(255,255,255,0.03)",
                              color: 
                                ann.priority === "High" 
                                  ? "var(--error-light)" 
                                  : ann.priority === "Low" 
                                    ? "var(--success-light)" 
                                    : "var(--text-muted)"
                            }}
                          >
                            {ann.priority} Priority
                          </span>

                          {/* Target Scope tag */}
                          <span 
                            className="badge" 
                            style={{ 
                              fontSize: "8.5px", 
                              padding: "2px 6px", 
                              background: "rgba(99,102,241,0.06)", 
                              color: "var(--primary-light)" 
                            }}
                          >
                            Scope: {ann.departments?.join(", ") || "All"}
                          </span>
                        </div>

                        <div style={{ fontSize: "11px", color: "var(--text-dimmed)", marginTop: "6px" }}>
                          Published on {new Date(ann.publishedDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>

                      {/* Admin delete actions */}
                      <div style={{ display: "flex", gap: "6px" }} onClick={e => e.stopPropagation()}>
                        {!isAdmin && (
                          <button 
                            className="btn btn-ghost btn-sm"
                            style={{ padding: "6px" }}
                            onClick={(e) => handleMarkRead(ann.id, e)}
                            title={isUnread ? "Mark as Read" : "Mark as Unread"}
                          >
                            <BookmarkCheck size={14} style={{ color: isUnread ? "var(--text-muted)" : "var(--primary-light)" }} />
                          </button>
                        )}
                        {isAdmin && (
                          <button 
                            className="btn btn-ghost btn-sm"
                            style={{ padding: "6px", color: "var(--error-light)" }}
                            onClick={() => deleteAnnouncement(ann.id)}
                            title="Delete announcement"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Announcement Content */}
                    <div 
                      style={{ 
                        marginTop: "12px", 
                        fontSize: "13px", 
                        color: "var(--text-muted)",
                        lineHeight: "1.6",
                        display: isExpanded ? "block" : "-webkit-box",
                        WebkitLineClamp: isExpanded ? "none" : 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {ann.content}
                    </div>

                    {/* Expand/Collapse prompt */}
                    <div 
                      style={{ 
                        fontSize: "11.5px", 
                        color: "var(--primary-light)", 
                        marginTop: "8px", 
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      {isExpanded ? "Show less" : "Read full notice"}
                    </div>

                    {/* Render attachment details if present */}
                    {ann.attachment && (
                      <div 
                        style={{
                          marginTop: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 14px",
                          background: "rgba(255,255,255,0.015)",
                          border: "1px dashed var(--border-light)",
                          borderRadius: "var(--radius-md)",
                          width: "fit-content"
                        }}
                        onClick={e => { e.stopPropagation(); alert(`Downloading file: ${ann.attachment.name}`); }}
                      >
                        <FileText size={16} className="text-gradient" />
                        <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-main)" }}>{ann.attachment.name}</span>
                        <span style={{ fontSize: "10px", color: "var(--text-dimmed)" }}>({ann.attachment.size})</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
