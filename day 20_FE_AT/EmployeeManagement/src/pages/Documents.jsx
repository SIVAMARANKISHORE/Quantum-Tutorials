import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { 
  FileText, 
  Download, 
  Upload, 
  FolderIcon, 
  Trash2, 
  Plus, 
  Search, 
  Check,
  X,
  FileSpreadsheet,
  FileCode
} from "lucide-react";

const DEFAULT_DOCUMENTS = [
  {
    id: "doc-1",
    name: "2026_Corporate_Leave_Policy.pdf",
    category: "HR Policies",
    type: "PDF",
    size: "1.2 MB",
    uploadedDate: "2026-01-10",
    description: "Rules regarding leave entitlement, calendar holidays, and carry forward guidelines."
  },
  {
    id: "doc-2",
    name: "Medical_Benefits_Summary_Chart.xlsx",
    category: "Benefits & Health",
    type: "XLSX",
    size: "450 KB",
    uploadedDate: "2026-02-14",
    description: "Detailed medical claims coverage matrix, insurance levels, and partner hospitals."
  },
  {
    id: "doc-3",
    name: "Aether_Security_Passkey_Guide.pdf",
    category: "Technical Guidelines",
    type: "PDF",
    size: "820 KB",
    uploadedDate: "2026-03-01",
    description: "Walkthrough of password guidelines, keycard locks, and corporate SSO setup."
  }
];

export default function Documents() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [documents, setDocuments] = useLocalStorage("ems_documents", []);

  // Initialize default files on mount if list is blank
  useEffect(() => {
    if (documents.length === 0) {
      setDocuments(DEFAULT_DOCUMENTS);
    }
  }, [documents, setDocuments]);

  // Form uploading state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("HR Policies");
  const [fileType, setFileType] = useState("PDF");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("1.0 MB");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleUpload = (e) => {
    e.preventDefault();
    if (!name) return;

    // Append extension based on type
    const fullFileName = name.toLowerCase().endsWith(`.${fileType.toLowerCase()}`)
      ? name 
      : `${name}.${fileType.toLowerCase()}`;

    const newDoc = {
      id: Date.now().toString(),
      name: fullFileName,
      category,
      type: fileType,
      size,
      uploadedDate: new Date().toISOString().split("T")[0],
      description
    };

    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    setName("");
    setDescription("");
    setSize("1.0 MB");
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const categories = ["All", "HR Policies", "Benefits & Health", "Technical Guidelines"];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getFileIcon = (type) => {
    if (type === "XLSX" || type === "CSV") return <FileSpreadsheet size={22} style={{ color: "var(--success-light)" }} />;
    if (type === "ZIP" || type === "EXE") return <FileCode size={22} style={{ color: "var(--warning-light)" }} />;
    return <FileText size={22} className="text-gradient" />;
  };

  return (
    <div className="page-content">
      {/* Search and Filters panel */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          
          <div className="search-panel" style={{ flex: 2, minWidth: "260px" }}>
            <Search size={16} className="text-muted" />
            <input 
              placeholder="Search documents by filename or keywords..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select 
              className="form-input"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{ padding: "8px 12px", fontSize: "12.5px", width: "160px" }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Folders' : cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toolbar header */}
      <div className="toolbar" style={{ alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800 }}>
            {isAdmin ? "Initiative Files Registry" : "Company Files Library"}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Browse policies, manuals, benefits, and technical guidance references.
          </p>
        </div>
        {isAdmin && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowUploadModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Upload size={16} /> Upload Document
          </button>
        )}
      </div>

      {/* Documents directory list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filteredDocs.length === 0 ? (
          <div className="card" style={{ padding: "48px", textAlign: "center" }}>
            <div className="empty-state">
              <span className="empty-icon"><FolderIcon size={40} style={{ color: "var(--text-dimmed)" }} /></span>
              <span className="empty-text">No documents found matching these parameters.</span>
            </div>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <div 
              key={doc.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 20px"
              }}
            >
              {/* File Type icon */}
              <div 
                style={{ 
                  width: "44px", 
                  height: "44px", 
                  borderRadius: "10px", 
                  background: "rgba(255,255,255,0.02)", 
                  border: "1px solid var(--border-light)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}
              >
                {getFileIcon(doc.type)}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 700 }}>{doc.name}</h4>
                  <span 
                    className="badge" 
                    style={{ 
                      fontSize: "8.5px", 
                      padding: "2px 6px", 
                      background: "rgba(255,255,255,0.03)", 
                      color: "var(--text-muted)" 
                    }}
                  >
                    {doc.category}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-dimmed)" }}>
                    {doc.size} · Uploaded {doc.uploadedDate}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {doc.description}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => alert(`Downloading file: ${doc.name}`)}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Download size={12} /> Download
                </button>
                {isAdmin && (
                  <button 
                    className="btn btn-ghost btn-sm"
                    style={{ padding: "6px", color: "var(--error-light)" }}
                    onClick={() => handleDelete(doc.id)}
                    title="Remove File"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* ── MOCK UPLOAD MODAL ── */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" style={{ maxWidth: "480px" }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Upload Reference File</h3>
              <button className="close-btn" onClick={() => setShowUploadModal(false)}>×</button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">File Base Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. corporate_policy_guide"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category folder</label>
                    <select 
                      className="form-input"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option value="HR Policies">HR Policies</option>
                      <option value="Benefits & Health">Benefits & Health</option>
                      <option value="Technical Guidelines">Technical Guidelines</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Extension Type</label>
                    <select 
                      className="form-input"
                      value={fileType}
                      onChange={e => setFileType(e.target.value)}
                    >
                      <option>PDF</option>
                      <option>XLSX</option>
                      <option>DOCX</option>
                      <option>ZIP</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">File Mock Size</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="e.g. 1.2 MB"
                      value={size}
                      onChange={e => setSize(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, justifyContent: "center" }}>
                    {/* Visual upload indicator */}
                    <div style={{ fontSize: "11px", color: "var(--success-light)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", marginTop: "24px" }}>
                      <Check size={14} /> Ready to compile
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Brief Description</label>
                  <textarea 
                    className="form-input"
                    placeholder="Provide a summary of what this file represents..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{ minHeight: "80px" }}
                  />
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Compile Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
