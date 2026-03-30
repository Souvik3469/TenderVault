import React from "react";
import { Link } from "react-router-dom";
import {
  RiBuilding2Line, RiPriceTag3Line, RiTimeLine,
  RiArrowRightLine, RiPencilLine, RiDeleteBinLine, RiSendPlaneLine,
} from "react-icons/ri";
import StatusBadge from "../ui/StatusBadge";
import StarRating from "../utils/StarRating";
import { usePublishTender } from "../../api/tender";
import { toast } from "react-toastify";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80";

const formatBudget = (val) => {
  if (!val && val !== 0) return "—";
  return `₹ ${Number(val).toLocaleString("en-IN")} L`;
};

const formatDeadline = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Expired", urgent: true };
  if (diff <= 3) return { label: `${diff}d left`, urgent: true };
  return { label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), urgent: false };
};

const TenderCard = ({ tender, user, toDelete, loadingDelete }) => {
  if (!tender) return null;

  const { mutate: publish, isLoading: publishing } = usePublishTender();

  const isOwner = tender.companyId === user?.id && user?.role === "company";
  const isEditable = isOwner && !["awarded", "cancelled"].includes(tender.status);

  const handlePublish = () => {
    publish(tender.id, {
      onSuccess: () => toast.success("Tender published! Vendors can now bid.", { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" }),
      onError: (err) => toast.error(err?.response?.data?.message ?? "Failed to publish", { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" }),
    });
  };
  const deadline = formatDeadline(tender.deadline);
  const companyName = tender.company?.name ?? tender.companyName ?? "—";
  const budget = tender.budget ?? tender.cost;

  return (
    <div className="card-hover flex flex-col overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={tender.imageUrl || FALLBACK_IMG}
          alt={tender.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={tender.status} />
        </div>

        {/* Deadline chip */}
        {deadline && (
          <div className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            ${deadline.urgent ? "bg-red-500 text-white" : "bg-white/90 text-slate-700"}`}>
            <RiTimeLine className="w-3 h-3" />
            {deadline.label}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-1 line-clamp-2">
          {tender.title}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
          {tender.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <RiBuilding2Line className="w-3.5 h-3.5 text-slate-400" />
            {companyName}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <RiPriceTag3Line className="w-3.5 h-3.5 text-slate-400" />
            {tender.category}
          </span>
          <span className="text-sm font-bold text-blue-600 ml-auto">
            {formatBudget(budget)}
          </span>
        </div>

        {/* Star rating for admin */}
        {user?.role === "admin" && (
          <div className="mb-3 pt-3 border-t border-slate-100">
            <StarRating tenderId={tender.id} rating={tender.rating ?? 0} />
          </div>
        )}

        {/* Existing star display (non-admin) */}
        {user?.role !== "admin" && tender.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={`text-base ${i <= tender.rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
            ))}
            <span className="text-xs text-slate-400 ml-1">({tender.rating}/5)</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-slate-100">
          {/* Publish banner for draft tenders owned by this user */}
          {isOwner && tender.status === "draft" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="btn-success btn-sm w-full flex items-center justify-center gap-1.5"
            >
              {publishing
                ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <RiSendPlaneLine className="w-3.5 h-3.5" />}
              {publishing ? "Publishing…" : "Publish Tender"}
            </button>
          )}

          <div className="flex items-center gap-2">
            <Link to={`/tender/${tender.id}`} className="btn-primary btn-sm flex items-center gap-1.5 flex-1 justify-center">
              View Details <RiArrowRightLine className="w-3.5 h-3.5" />
            </Link>

            {isEditable && (
              <>
                <Link to={`/updatetender/${tender.id}`}
                  className="btn-secondary btn-sm p-2" title="Edit">
                  <RiPencilLine className="w-4 h-4" />
                </Link>
                <button
                  onClick={toDelete}
                  disabled={loadingDelete}
                  className="btn-danger btn-sm p-2" title="Delete"
                >
                  {loadingDelete
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <RiDeleteBinLine className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderCard;
