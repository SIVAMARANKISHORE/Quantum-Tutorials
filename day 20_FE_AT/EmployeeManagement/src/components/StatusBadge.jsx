export default function StatusBadge({ status }) {
  const map = {
    "Active":   { cls: "badge-active",   dot: true },
    "Inactive": { cls: "badge-inactive", dot: true },
    "On Leave": { cls: "badge-leave",    dot: true },
  };
  const cfg = map[status] || { cls: "", dot: false };
  return (
    <span className={`badge ${cfg.cls}${cfg.dot ? " badge-dot" : ""}`}>
      {status}
    </span>
  );
}
