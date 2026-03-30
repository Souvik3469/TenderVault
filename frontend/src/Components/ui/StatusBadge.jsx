import React from "react";

const STATUS_CONFIG = {
  // Tender statuses
  draft:     { label: "Draft",     cls: "badge-draft" },
  open:      { label: "Open",      cls: "badge-open" },
  closed:    { label: "Closed",    cls: "badge-closed" },
  awarded:   { label: "Awarded",   cls: "badge-awarded" },
  cancelled: { label: "Cancelled", cls: "badge-cancelled" },
  // Bid statuses
  pending:   { label: "Pending",   cls: "badge-pending" },
  accepted:  { label: "Accepted",  cls: "badge-accepted" },
  rejected:  { label: "Rejected",  cls: "badge-rejected" },
  withdrawn: { label: "Withdrawn", cls: "badge-withdrawn" },
};

const StatusBadge = ({ status, className = "" }) => {
  if (!status) return null;
  const key = status.toLowerCase();
  const config = STATUS_CONFIG[key] ?? { label: status, cls: "badge bg-slate-100 text-slate-600 border-slate-200" };
  return (
    <span className={`${config.cls} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
