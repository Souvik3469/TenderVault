import React from "react";
import {
  RiFileList3Line, RiTimeLine, RiPriceTag3Line,
} from "react-icons/ri";

const QuickStats = ({ tenders = [] }) => {
  const now = new Date();

  const openCount = tenders.filter((t) => t.status === "open").length;

  const closingCount = tenders.filter((t) => {
    if (!t.deadline || t.status !== "open") return false;
    const diff = (new Date(t.deadline) - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  const categoryCount = new Set(
    tenders.map((t) => t.category).filter(Boolean)
  ).size;

  const stats = [
    {
      icon: RiFileList3Line,
      label: "Open Tenders",
      value: openCount,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: RiTimeLine,
      label: "Closing This Week",
      value: closingCount,
      color: closingCount > 0 ? "text-amber-600" : "text-slate-400",
      bg: closingCount > 0 ? "bg-amber-50" : "bg-slate-50",
    },
    {
      icon: RiPriceTag3Line,
      label: "Active Categories",
      value: categoryCount,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="sidebar-widget">
      <div className="sidebar-widget-header">
        <RiFileList3Line className="w-3.5 h-3.5" />
        <span>Overview</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-base font-bold leading-none ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
