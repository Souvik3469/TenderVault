import React from "react";
import { GetVendorQuery } from "../../api/user";
import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { RiUserStarLine } from "react-icons/ri";

const Rightdownbar = () => {
  const { data: vendors, isLoading, isError } = GetVendorQuery();

  return (
    <div className="sidebar-widget w-full">
      <div className="sidebar-widget-header">
        <RiUserStarLine className="w-4 h-4" />
        <span>Vendors</span>
      </div>
      <div className="p-2">
        {isLoading && (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        )}
        {isError && (
          <p className="text-xs text-slate-400 text-center py-3">Failed to load.</p>
        )}
        {!isLoading && !isError && vendors?.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-3">No vendors yet.</p>
        )}
        {vendors?.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Avatar
              src={vendor.profileImage}
              name={vendor.name}
              size="sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {vendor.name}
              </p>
              <p className="text-xs text-slate-400">Vendor</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rightdownbar;
