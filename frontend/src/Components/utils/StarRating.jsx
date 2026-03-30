import React, { useState, useEffect } from "react";
import { useReviewTender } from "../../api/tender";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

const StarRating = ({ tenderId, rating = 0 }) => {
  const [selectedRating, setSelectedRating] = useState(rating);
  const [hovered, setHovered] = useState(0);

  // Sync when the parent refetches and passes a new rating
  useEffect(() => {
    setSelectedRating(rating);
  }, [rating]);

  const { mutate: review, isLoading: loading } = useReviewTender();

  const showToast = (msg, type = "error") =>
    toast[type](msg, { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" });

  const handleSubmit = () => {
    if (!selectedRating) return;
    review(
      { tenderId, payload: { rating: selectedRating } },
      {
        onSuccess: () => showToast("Tender reviewed successfully!", "success"),
        onError: () => showToast("Failed to submit review"),
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelectedRating(star)}
            className={`text-2xl transition-colors focus:outline-none ${
              star <= (hovered || selectedRating)
                ? "text-amber-400"
                : "text-slate-200"
            }`}
          >
            ★
          </button>
        ))}
      </div>
      {selectedRating > 0 && (
        <p className="text-xs text-slate-500">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][selectedRating]}
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={loading || !selectedRating}
        className="btn-primary btn-sm flex items-center gap-1.5"
      >
        {loading ? <Spinner size="sm" className="text-white" /> : null}
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
};

export default StarRating;
