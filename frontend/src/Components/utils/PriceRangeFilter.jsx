import React from "react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const PriceRangeFilter = ({ priceRanges = [], selectedPriceRanges = [], onPriceRangeChange }) => (
  <div className="sidebar-widget w-full">
    <div className="sidebar-widget-header flex items-center gap-2">
      <RiMoneyDollarCircleLine className="w-4 h-4" />
      Budget Range
      {selectedPriceRanges.length > 0 && (
        <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {selectedPriceRanges.length}
        </span>
      )}
    </div>
    <ul className="py-2">
      {priceRanges.map((range) => {
        const checked = selectedPriceRanges.includes(range.id);
        return (
          <li key={range.id}>
            <label className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
              ${checked ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onPriceRangeChange(range.id)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">{range.label}</span>
            </label>
          </li>
        );
      })}
    </ul>
  </div>
);

export default PriceRangeFilter;
