import React from "react";
import { GetCompanyQuery } from "../../api/user";
import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import Spinner from "../ui/Spinner";
import { RiBuilding2Line, RiArrowRightLine } from "react-icons/ri";

const Rightupbar = () => {
  const { data: companies, isLoading, isError } = GetCompanyQuery();

  return (
    <div className="sidebar-widget">
      <div className="sidebar-widget-header">
        <RiBuilding2Line className="w-3.5 h-3.5" />
        <span>Companies</span>
        {companies?.length > 0 && (
          <span className="ml-auto text-slate-400 font-normal normal-case tracking-normal">
            {companies.length}
          </span>
        )}
      </div>

      <div className="py-1">
        {isLoading && (
          <div className="flex justify-center py-5">
            <Spinner size="sm" />
          </div>
        )}
        {isError && (
          <p className="text-xs text-slate-400 text-center py-4">Failed to load.</p>
        )}
        {!isLoading && !isError && companies?.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">No companies yet.</p>
        )}

        {companies?.slice(0, 6).map((company) => (
          <Link
            key={company.id}
            to={`/profile/${company.id}`}
            className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 transition-colors group"
          >
            <Avatar src={company.profileImage} name={company.name} size="xs" />
            <p className="text-sm text-slate-700 truncate group-hover:text-blue-600 transition-colors">
              {company.name}
            </p>
          </Link>
        ))}

        {companies?.length > 6 && (
          <div className="px-3 py-2 border-t border-slate-100 mt-1">
            <span className="text-xs text-slate-400">
              +{companies.length - 6} more companies
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rightupbar;
