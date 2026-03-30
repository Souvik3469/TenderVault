import React from "react";
import { RiAlertLine } from "react-icons/ri";

/**
 * Confirmation dialog — backward-compatible: exported both as default AND as `Confirmation`.
 * Props: message, onConfirm, onCancel, confirmButtonClass
 */
const Confirmation = ({ message, onConfirm, onCancel, confirmButtonClass = "" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm p-6 animate-slide-up">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
          <RiAlertLine className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Confirm Action</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onCancel} className="flex-1 btn-secondary btn-md">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 btn btn-md ${confirmButtonClass || "btn-danger"}`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default Confirmation;
