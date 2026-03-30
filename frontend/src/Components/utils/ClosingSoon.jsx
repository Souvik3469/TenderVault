import React from "react";
import { Link } from "react-router-dom";
import { RiTimeLine } from "react-icons/ri";

const ClosingSoon = ({ tenders = [] }) => {
  const now = new Date();

  const soon = tenders
    .filter((t) => {
      if (!t.deadline || t.status !== "open") return false;
      const diff = (new Date(t.deadline) - now) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  if (soon.length === 0) return null;

  return (
    <div className="sidebar-widget">
      <div className="sidebar-widget-header">
        <RiTimeLine className="w-3.5 h-3.5 text-red-500" />
        <span>Closing Soon</span>
        <span className="ml-auto text-slate-400 font-normal normal-case tracking-normal">
          {soon.length}
        </span>
      </div>

      <div className="py-1">
        {soon.map((t) => {
          const diff = Math.ceil((new Date(t.deadline) - now) / (1000 * 60 * 60 * 24));
          const urgent = diff <= 2;
          return (
            <Link
              key={t.id}
              to={`/tender/${t.id}`}
              className="flex items-start gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors group"
            >
              <span
                className={`flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${
                  urgent ? "bg-red-500" : "bg-amber-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 group-hover:text-blue-600 truncate transition-colors">
                  {t.title}
                </p>
                <p className={`text-xs mt-0.5 font-medium ${urgent ? "text-red-500" : "text-amber-500"}`}>
                  {diff === 0 ? "Closes today" : `${diff}d left`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ClosingSoon;
