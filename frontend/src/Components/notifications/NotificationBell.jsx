import React, { useState, useRef, useEffect } from "react";
import {
  RiBellLine,
  RiBellFill,
  RiCheckDoubleLine,
  RiBriefcaseLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiStarLine,
  RiLockLine,
  RiQuestionLine,
  RiChat1Line,
} from "react-icons/ri";
import {
  useUnreadCount,
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "../../api/notification";

const TYPE_ICON = {
  bid_received:      <RiBriefcaseLine className="w-4 h-4 text-blue-500" />,
  bid_accepted:      <RiCheckboxCircleLine className="w-4 h-4 text-green-500" />,
  bid_rejected:      <RiCloseCircleLine className="w-4 h-4 text-red-500" />,
  tender_reviewed:   <RiStarLine className="w-4 h-4 text-amber-500" />,
  tender_closed:     <RiLockLine className="w-4 h-4 text-sky-500" />,
  tender_cancelled:  <RiCloseCircleLine className="w-4 h-4 text-red-400" />,
  question_asked:    <RiQuestionLine className="w-4 h-4 text-violet-500" />,
  question_answered: <RiChat1Line className="w-4 h-4 text-teal-500" />,
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: count = 0 } = useUnreadCount();
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/8 transition"
      >
        {count > 0 ? (
          <RiBellFill className="w-5 h-5 text-blue-400" />
        ) : (
          <RiBellLine className="w-5 h-5" />
        )}
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">
              Notifications
              {count > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-400">
                  {count} unread
                </span>
              )}
            </h3>
            {count > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <RiCheckDoubleLine className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
            {isLoading ? (
              <p className="text-sm text-slate-400 text-center py-10">
                Loading…
              </p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10">
                <RiBellLine className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read) markRead(n.id);
                  }}
                  className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors
                    ${!n.read ? "bg-blue-50/40" : ""}`}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {TYPE_ICON[n.type] ?? (
                      <RiBellLine className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        !n.read
                          ? "text-slate-800 font-medium"
                          : "text-slate-600"
                      }`}
                    >
                      {n.body}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {/* Unread dot */}
                  {!n.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
