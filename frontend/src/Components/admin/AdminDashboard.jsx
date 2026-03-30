import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminStats, useAdminTenders } from "../../api/admin";
import StatusBadge from "../ui/StatusBadge";
import Loading from "../utils/Loading";
import {
  RiUserLine,
  RiBuildingLine,
  RiBriefcaseLine,
  RiFileList3Line,
  RiCheckboxCircleLine,
  RiDraftLine,
  RiLockLine,
  RiCloseCircleLine,
  RiArrowRightLine,
  RiStarFill,
} from "react-icons/ri";

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value ?? "—"}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const TenderStatusFilter = ({ value, onChange }) => {
  const options = [
    { label: "All", value: "" },
    { label: "Open", value: "open" },
    { label: "Draft", value: "draft" },
    { label: "Closed", value: "closed" },
    { label: "Awarded", value: "awarded" },
    { label: "Cancelled", value: "cancelled" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${value === o.value
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: paginatedTenders, isLoading: tendersLoading } = useAdminTenders(
    statusFilter ? { status: statusFilter } : undefined
  );

  const tenders = paginatedTenders?.tenders ?? [];

  if (statsLoading) return <Loading />;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Platform-wide overview and tender management</p>
      </div>

      {/* Stats grid */}
      {stats && (
        <>
          {/* User stats */}
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Users
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={RiUserLine}
                label="Total Users"
                value={stats.users.total}
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <StatCard
                icon={RiBriefcaseLine}
                label="Vendors"
                value={stats.users.vendors}
                color="text-violet-600"
                bg="bg-violet-50"
              />
              <StatCard
                icon={RiBuildingLine}
                label="Companies"
                value={stats.users.companies}
                color="text-teal-600"
                bg="bg-teal-50"
              />
            </div>
          </section>

          {/* Tender stats */}
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Tenders
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Total",     value: stats.tenders.total,     icon: RiFileList3Line,       color: "text-slate-600",  bg: "bg-slate-100" },
                { label: "Open",      value: stats.tenders.open,      icon: RiFileList3Line,       color: "text-green-600",  bg: "bg-green-50" },
                { label: "Draft",     value: stats.tenders.draft,     icon: RiDraftLine,           color: "text-amber-600",  bg: "bg-amber-50" },
                { label: "Closed",    value: stats.tenders.closed,    icon: RiLockLine,            color: "text-sky-600",    bg: "bg-sky-50" },
                { label: "Awarded",   value: stats.tenders.awarded,   icon: RiCheckboxCircleLine,  color: "text-violet-600", bg: "bg-violet-50" },
                { label: "Cancelled", value: stats.tenders.cancelled, icon: RiCloseCircleLine,     color: "text-red-500",    bg: "bg-red-50" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-1">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-1`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className={`text-xl font-bold leading-none ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bids stat */}
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Bids
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={RiBriefcaseLine}
                label="Total Bids"
                value={stats.bids.total}
                color="text-indigo-600"
                bg="bg-indigo-50"
              />
            </div>
          </section>
        </>
      )}

      {/* Tender list */}
      <section>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            All Tenders
            {paginatedTenders && (
              <span className="ml-2 font-normal normal-case text-slate-400">
                ({paginatedTenders.total} total)
              </span>
            )}
          </h2>
          <TenderStatusFilter value={statusFilter} onChange={setStatusFilter} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {tendersLoading ? (
            <div className="flex items-center justify-center py-16">
              <span className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : tenders.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">No tenders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tender</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Bids</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Rating</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tenders.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 truncate max-w-[220px]">
                          {t.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">
                          {t.category}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-slate-600 truncate max-w-[140px]">
                          {t.owner?.name ?? t.companyName ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-600">
                        {t._count?.bids ?? 0}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {t.rating ? (
                          <span className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                            <RiStarFill className="w-3.5 h-3.5" />
                            {t.rating}/5
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">Unrated</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/tender/${t.id}`}
                          className="btn-secondary btn-sm flex items-center gap-1 whitespace-nowrap"
                        >
                          View <RiArrowRightLine className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
