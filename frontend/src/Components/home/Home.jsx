import React, { useState } from "react";
import {
  getallcategoryquery,
  getalltenderquery,
  searchTendersQuery,
  useAwardedTendersQuery,
} from "../../api/tender";
import Navbar from "../Navbar";
import Loading from "../utils/Loading";
import TenderCard from "../tender/TenderCard";
import CategoryFilter from "../utils/CategoryFilter";
import PriceRangeFilter from "../utils/PriceRangeFilter";
import { GetMyDetailsQuery } from "../../api/user";
import ClosingSoon from "../utils/ClosingSoon";
import QuickStats from "../utils/QuickStats";
import { useDebounce } from "../../hooks/useDebounce";
import {
  RiFileList3Line, RiCheckboxCircleLine, RiFilterLine,
  RiCloseLine, RiSearchLine,
} from "react-icons/ri";

const PRICE_RANGES = [
  { id: 1, label: "Under ₹1L",     minPrice: 0,    maxPrice: 1 },
  { id: 2, label: "₹1L – ₹5L",    minPrice: 1,    maxPrice: 5 },
  { id: 3, label: "₹5L – ₹20L",   minPrice: 5,    maxPrice: 20 },
  { id: 4, label: "₹20L – ₹50L",  minPrice: 20,   maxPrice: 50 },
  { id: 5, label: "Over ₹50L",     minPrice: 50,   maxPrice: Infinity },
];

const TAB_OPEN    = "open";
const TAB_AWARDED = "awarded";

const EmptyTenders = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <RiFileList3Line className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-slate-700 font-semibold mb-1">No tenders found</h3>
    <p className="text-slate-400 text-sm">Try adjusting your filters or search term.</p>
  </div>
);

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [activeTab, setActiveTab] = useState(TAB_OPEN);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 800);

  const { data: categories = [], isLoading: catLoading } = getallcategoryquery();
  const { data: openTenders = [],    isLoading: tenderLoading } = getalltenderquery();
  const { data: awardedTenders = [], isLoading: awardedLoading } = useAwardedTendersQuery();
  const { data: searchResults }  = searchTendersQuery(debouncedSearch);
  const { data: user, isLoading: userLoading } = GetMyDetailsQuery();

  const handleCategoryChange = (idx) => {
    const name = categories[idx]?.toLowerCase();
    if (!name) return;
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };
  const handlePriceChange = (id) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
  };

  if (catLoading || tenderLoading || awardedLoading || userLoading) {
    return (
      <div className="page-container">
        <Navbar user={null} />
        <Loading />
      </div>
    );
  }

  const applyFilters = (list) =>
    (list ?? []).filter((tender) => {
      const cat = tender.category?.toLowerCase();
      const isCat = !selectedCategories.length || selectedCategories.includes(cat);
      const budget = tender.budget ?? tender.cost ?? 0;
      const isPrice = !selectedPriceRanges.length || selectedPriceRanges.some((id) => {
        const r = PRICE_RANGES.find((p) => p.id === id);
        return r && budget >= r.minPrice && budget <= r.maxPrice;
      });
      return isCat && isPrice;
    });

  const tendersByTab = activeTab === TAB_AWARDED ? awardedTenders : openTenders;
  const base = debouncedSearch && searchResults ? searchResults : tendersByTab;
  const filteredTenders = applyFilters(base);
  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0;

  const Filters = () => (
    <div className="flex flex-col gap-3">
      <CategoryFilter
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />
      <PriceRangeFilter
        priceRanges={PRICE_RANGES}
        selectedPriceRanges={selectedPriceRanges}
        onPriceRangeChange={handlePriceChange}
      />
      {hasActiveFilters && (
        <button onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium px-4 py-2">
          <RiCloseLine className="w-4 h-4" /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        handleSearch={() => {}}
        user={user}
      />

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* ── Left Sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                <RiFilterLine className="w-4 h-4" /> Filters
              </h2>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium">
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <Filters />
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {/* Tab bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 flex items-center gap-1 h-12">
            <button
              onClick={() => setActiveTab(TAB_OPEN)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === TAB_OPEN
                  ? "text-blue-700 bg-blue-50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
            >
              <RiFileList3Line className="w-4 h-4" />
              Open Tenders
            </button>
            <button
              onClick={() => setActiveTab(TAB_AWARDED)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === TAB_AWARDED
                  ? "text-violet-700 bg-violet-50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
            >
              <RiCheckboxCircleLine className="w-4 h-4" />
              Awarded
            </button>

            {/* Mobile filter trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="ml-auto lg:hidden btn-secondary btn-sm flex items-center gap-1.5"
            >
              <RiFilterLine className="w-3.5 h-3.5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedCategories.length + selectedPriceRanges.length}
                </span>
              )}
            </button>
          </div>

          {/* Search hint when active */}
          {debouncedSearch && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 flex items-center gap-2">
              <RiSearchLine className="w-4 h-4" />
              Showing results for "<strong>{debouncedSearch}</strong>"
              {searchResults && (
                <span className="text-blue-500">— {searchResults.length} found</span>
              )}
            </div>
          )}

          {/* Tender grid */}
          <div className="p-6">
            {filteredTenders.length === 0 ? (
              <EmptyTenders />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} user={user} />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ── Right Sidebar ─────────────────────────────────────── */}
        <aside className="hidden xl:flex flex-col w-56 flex-shrink-0 bg-white border-l border-slate-200 overflow-y-auto p-3 gap-3">
          <QuickStats tenders={openTenders} />
          <ClosingSoon tenders={openTenders} />
        </aside>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-800">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <Filters />
              <button onClick={() => setSidebarOpen(false)} className="btn-primary btn-md mt-2">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
