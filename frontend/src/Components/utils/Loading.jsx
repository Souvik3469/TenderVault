import React from "react";
import Spinner from "../ui/Spinner";

/** Full-page centered spinner */
const Loading = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="xl" />
      <p className="text-sm text-slate-500 font-medium animate-pulse">Loading…</p>
    </div>
  </div>
);

export default Loading;
