import React from "react";
import { RiPriceTag3Line } from "react-icons/ri";

const CategoryFilter = ({ categories = [], selectedCategories = [], onCategoryChange }) => (
  <div className="sidebar-widget w-full">
    <div className="sidebar-widget-header flex items-center gap-2">
      <RiPriceTag3Line className="w-4 h-4" />
      Categories
      {selectedCategories.length > 0 && (
        <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {selectedCategories.length}
        </span>
      )}
    </div>
    <ul className="py-2 max-h-52 overflow-y-auto scrollbar-hide">
      {categories.map((category, idx) => {
        const lc = category.toLowerCase();
        const checked = selectedCategories.includes(lc);
        return (
          <li key={idx}>
            <label className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
              ${checked ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onCategoryChange(idx)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium truncate">{category}</span>
            </label>
          </li>
        );
      })}
    </ul>
  </div>
);

export default CategoryFilter;
