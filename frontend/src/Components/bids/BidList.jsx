import React, { useState } from "react";
import {
  getallbidsquery,
  createbid,
  acceptBid,
  rejectBid,
  deletebid,
} from "../../api/bid";
import { GetMyDetailsQuery } from "../../api/user";
import { tenderdetailsquery } from "../../api/tender";
import { useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";
import BidCard from "./BidCard";
import Confirmation from "../utils/ConfirmationModal";
import {
  RiMoneyDollarCircleLine, RiSortAsc, RiSortDesc,
  RiAddLine, RiFileList3Line,
} from "react-icons/ri";
import Spinner from "../ui/Spinner";

const BidList = () => {
  const { tenderId } = useParams();
  const [selectedBid, setSelectedBid] = useState(null);
  const [confirmType, setConfirmType] = useState(null);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [loadingAdd, setLoadingAdd]     = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { data: user, isLoading: userLoading }   = GetMyDetailsQuery();
  const { data: tenderDetails, isLoading: tdLoading, refetch: refetchTender } = tenderdetailsquery(tenderId);
  const { data: bids = [], isLoading: bidsLoading, refetch: refetchBids } = getallbidsquery(tenderId);

  const showToast = (msg, type = "error") =>
    toast[type](msg, { position: "top-center", autoClose: 3500, hideProgressBar: true, theme: "light" });

  if (userLoading || tdLoading || bidsLoading) return <Loading />;

  const minBudget = tenderDetails?.budget ?? tenderDetails?.cost ?? 0;
  const tenderOpen = tenderDetails?.status === "open";

  const handleBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid bid amount");
      return;
    }
    // no minimum enforcement on client — backend validates
    try {
      setLoadingAdd(true);
      // New API: createbid(tenderId, { amount, message })
      await createbid(tenderId, { amount, message: bidMessage || undefined });
      refetchBids();
      showToast("Bid submitted successfully!", "success");
      setIsBidding(false);
      setBidAmount("");
      setBidMessage("");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Failed to submit bid");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleConfirm = async () => {
    try {
      switch (confirmType) {
        case "accept":
          setLoadingAccept(true);
          await acceptBid(selectedBid.id);
          refetchBids();
          refetchTender();
          showToast("Bid accepted — tender awarded!", "success");
          break;
        case "reject":
          setLoadingReject(true);
          await rejectBid(selectedBid.id);
          refetchBids();
          showToast("Bid rejected", "success");
          break;
        case "delete":
          setLoadingDelete(true);
          await deletebid(selectedBid.id);
          refetchBids();
          showToast("Bid withdrawn", "success");
          break;
      }
    } catch {
      showToast("Action failed, please try again");
    } finally {
      setLoadingAccept(false);
      setLoadingReject(false);
      setLoadingDelete(false);
      setSelectedBid(null);
      setConfirmType(null);
    }
  };

  const sortedBids = [...bids];
  if (sortBy === "asc")  sortedBids.sort((a, b) => a.amount - b.amount);
  if (sortBy === "desc") sortedBids.sort((a, b) => b.amount - a.amount);

  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <RiFileList3Line className="w-5 h-5 text-blue-600" />
          Bids
          <span className="text-sm font-normal text-slate-500">({bids.length})</span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy(sortBy === "asc" ? null : "asc")}
            className={`btn-sm btn ${sortBy === "asc" ? "btn-primary" : "btn-secondary"} flex items-center gap-1`}
          >
            <RiSortAsc className="w-3.5 h-3.5" /> Low–High
          </button>
          <button
            onClick={() => setSortBy(sortBy === "desc" ? null : "desc")}
            className={`btn-sm btn ${sortBy === "desc" ? "btn-primary" : "btn-secondary"} flex items-center gap-1`}
          >
            <RiSortDesc className="w-3.5 h-3.5" /> High–Low
          </button>
        </div>
      </div>

      {/* Place bid — vendors only, on open tenders */}
      {user?.role === "vendor" && tenderOpen && (
        <div className="card p-4 mb-4">
          {isBidding ? (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-slate-800">Submit Your Bid</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Amount (e.g. ${minBudget})`}
                    className="input pl-9"
                  />
                </div>
              </div>
              <textarea
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Cover note / proposal summary (optional)"
                rows={2}
                className="input resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleBid}
                  disabled={loadingAdd || !bidAmount}
                  className="btn-primary btn-md flex items-center gap-2"
                >
                  {loadingAdd ? <Spinner size="sm" /> : null}
                  {loadingAdd ? "Submitting…" : "Submit Bid"}
                </button>
                <button onClick={() => { setIsBidding(false); setBidAmount(""); setBidMessage(""); }}
                  className="btn-secondary btn-md">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsBidding(true)}
              className="btn-primary btn-md flex items-center gap-2 w-full justify-center"
            >
              <RiAddLine className="w-4 h-4" /> Place a Bid
            </button>
          )}
        </div>
      )}

      {/* Bid list */}
      {sortedBids.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No bids placed yet.
          {user?.role === "vendor" && tenderOpen && " Be the first to bid!"}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedBids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              toAccept={() => { setSelectedBid(bid); setConfirmType("accept"); }}
              toReject={() => { setSelectedBid(bid); setConfirmType("reject"); }}
              toDelete={() => { setSelectedBid(bid); setConfirmType("delete"); }}
              loadingAccept={loadingAccept}
              loadingReject={loadingReject}
              loadingDelete={loadingDelete}
            />
          ))}
        </div>
      )}

      {/* Confirmation modal */}
      {selectedBid && (
        <Confirmation
          message={
            confirmType === "accept" ? "Accept this bid? The tender will be marked as awarded and all other bids will be rejected." :
            confirmType === "reject" ? "Reject this bid?" :
            "Withdraw your bid? This cannot be undone."
          }
          onConfirm={handleConfirm}
          onCancel={() => { setSelectedBid(null); setConfirmType(null); }}
          confirmButtonClass={
            confirmType === "accept" ? "btn-success" : "btn-danger"
          }
        />
      )}
    </div>
  );
};

export default BidList;
