import React from "react";
import {
  RiBuilding2Line, RiPriceTag3Line, RiTimeLine,
  RiHashtag, RiCalendarLine, RiSendPlaneLine,
} from "react-icons/ri";
import StatusBadge from "../ui/StatusBadge";
import { usePublishTender } from "../../api/tender";
import { GetMyDetailsQuery } from "../../api/user";
import { toast } from "react-toastify";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80";

const formatBudget = (val) => {
  if (!val && val !== 0) return "—";
  return `₹ ${Number(val).toLocaleString("en-IN")} Lakhs`;
};

const MetaItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  </div>
);

const TenderDetailsCard = ({ tenderDetails }) => {
  if (!tenderDetails) return null;

  const { data: user } = GetMyDetailsQuery();
  const { mutate: publish, isLoading: publishing } = usePublishTender();

  const isOwner = tenderDetails.companyId === user?.id && user?.role === "company";

  const handlePublish = () => {
    publish(tenderDetails.id, {
      onSuccess: () => toast.success("Tender published! Vendors can now bid.", { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" }),
      onError: (err) => toast.error(err?.response?.data?.message ?? "Failed to publish", { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" }),
    });
  };

  const budget = tenderDetails.budget ?? tenderDetails.cost;
  const companyName = tenderDetails.company?.name ?? tenderDetails.companyName ?? "—";
  const deadline = tenderDetails.deadline
    ? new Date(tenderDetails.deadline).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
      {/* Cover image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={tenderDetails.imageUrl || FALLBACK_IMG}
          alt={tenderDetails.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={tenderDetails.status} />
            {tenderDetails.rating > 0 && (
              <span className="badge bg-amber-50 text-amber-700 border-amber-200">
                ★ {tenderDetails.rating}/5
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">{tenderDetails.title}</h1>
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {tenderDetails.description}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetaItem icon={RiBuilding2Line} label="Posted By"   value={companyName} />
          <MetaItem icon={RiPriceTag3Line} label="Category"    value={tenderDetails.category} />
          <MetaItem icon={RiHashtag}       label="Tender ID"   value={tenderDetails.id?.slice(-8).toUpperCase()} />
          <MetaItem icon={RiTimeLine}      label="Budget"      value={formatBudget(budget)} />
          {deadline && <MetaItem icon={RiCalendarLine} label="Deadline" value={deadline} />}
        </div>

        {isOwner && tenderDetails.status === "draft" && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">This tender is in Draft</p>
                <p className="text-xs text-amber-600 mt-0.5">Publish it to make it visible to vendors and open for bidding.</p>
              </div>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="btn-success btn-sm flex items-center gap-1.5 flex-shrink-0"
              >
                {publishing
                  ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <RiSendPlaneLine className="w-3.5 h-3.5" />}
                {publishing ? "Publishing…" : "Publish Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderDetailsCard;
