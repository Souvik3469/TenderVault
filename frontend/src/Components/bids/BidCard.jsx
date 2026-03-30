import React from "react";
import { GetMyDetailsQuery } from "../../api/user";
import { tenderdetailsquery } from "../../api/tender";
import Loading from "../utils/Loading";
import { useParams } from "react-router";
import StatusBadge from "../ui/StatusBadge";
import Avatar from "../ui/Avatar";
import {
  RiCheckLine, RiCloseLine, RiDeleteBinLine,
  RiTimeLine, RiMoneyDollarCircleLine,
} from "react-icons/ri";

const BidCard = ({ bid, toAccept, toReject, toDelete, loadingAccept, loadingReject, loadingDelete }) => {
  const { tenderId } = useParams();
  const { data: user, isLoading: userLoading } = GetMyDetailsQuery();
  const { data: tenderDetails, isLoading: tenderLoading } = tenderdetailsquery(tenderId);

  if (userLoading || tenderLoading) return <Loading />;
  if (!bid) return null;

  const isCompanyOwner = user?.id === tenderDetails?.companyId;
  const isVendorOwner  = user?.id === bid.vendorId;
  const tenderOpen     = tenderDetails?.status === "open";
  const bidPending     = bid.status === "pending";

  const vendorName = bid.vendor?.name ?? "Vendor";
  const dateStr = bid.createdAt
    ? new Date(bid.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <div className="card flex items-start justify-between gap-4 p-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Avatar name={vendorName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-slate-900 text-sm">{vendorName}</span>
            <StatusBadge status={bid.status} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <RiMoneyDollarCircleLine className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-800 text-sm">
                ₹ {Number(bid.amount).toLocaleString("en-IN")} L
              </span>
            </span>
            <span className="flex items-center gap-1">
              <RiTimeLine className="w-3.5 h-3.5" />
              {dateStr}
            </span>
          </div>

          {bid.message && (
            <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2 italic">
              "{bid.message}"
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isCompanyOwner && tenderOpen && bidPending && (
          <>
            <button
              onClick={toAccept}
              disabled={loadingAccept}
              className="btn-success btn-sm flex items-center gap-1"
              title="Accept bid"
            >
              {loadingAccept
                ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <RiCheckLine className="w-3.5 h-3.5" />}
              Accept
            </button>
            <button
              onClick={toReject}
              disabled={loadingReject}
              className="btn-danger btn-sm flex items-center gap-1"
              title="Reject bid"
            >
              {loadingReject
                ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <RiCloseLine className="w-3.5 h-3.5" />}
              Reject
            </button>
          </>
        )}

        {isVendorOwner && bidPending && (
          <button
            onClick={toDelete}
            disabled={loadingDelete}
            className="btn-secondary btn-sm flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
            title="Withdraw bid"
          >
            {loadingDelete
              ? <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
              : <RiDeleteBinLine className="w-3.5 h-3.5" />}
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
};

export default BidCard;
