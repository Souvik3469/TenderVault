import React, { useState } from "react";
import {
  getallcategoryquery,
  getalltenderquery,
} from "../../api/tender";
import Navbar from "../Navbar";
import Loading from "../utils/Loading";
import TenderCard from "../tender/TenderCard";
import CategoryFilter from "../utils/CategoryFilter";
import PriceRangeFilter from "../utils/PriceRangeFilter";
import { GetMyDetailsQuery, GetUserQuery } from "../../api/user";
import { useParams } from "react-router-dom";
import Avatar from "../ui/Avatar";
import {
  RiFileList3Line, RiCheckboxCircleLine, RiSearchLine,
  RiMailLine, RiBriefcaseLine,
} from "react-icons/ri";

const PRICE_RANGES = [
  { id: 1, label: "Under ₹10L",   minPrice: 0,    maxPrice: 10 },
  { id: 2, label: "₹10L – ₹50L",  minPrice: 10,   maxPrice: 50 },
  { id: 3, label: "₹50L – ₹1Cr",  minPrice: 50,   maxPrice: 100 },
  { id: 4, label: "₹1Cr – ₹5Cr",  minPrice: 100,  maxPrice: 500 },
  { id: 5, label: "Above ₹5Cr",   minPrice: 500,  maxPrice: Infinity },
];

const UserProfile = () => {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("open");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories } = getallcategoryquery();
  const { data: tenders = [], isLoading: tendersLoading } = getalltenderquery();
  const { data: profileUser, isLoading: profileLoading } = GetUserQuery(userId);
  const { data: currentUser } = GetMyDetailsQuery();

  if (tendersLoading || profileLoading) return <Loading />;

  const handleCategoryChange = (categoryId) => {
    const name = (categories?.[categoryId] ?? "").toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handlePriceRangeChange = (id) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const userTenders = tenders.filter(
    (t) => t.companyId === userId || t.company?.id === userId
  );

  const filtered = userTenders.filter((t) => {
    const searchMatch = !searchTerm ||
      t.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = activeTab === "awarded"
      ? t.status === "awarded"
      : t.status !== "awarded" && t.status !== "cancelled";

    const catMatch = !selectedCategories.length ||
      selectedCategories.includes((t.category ?? "").toLowerCase());

    const budget = t.budget ?? t.cost ?? 0;
    const priceMatch = !selectedPriceRanges.length ||
      selectedPriceRanges.some((id) => {
        const r = PRICE_RANGES.find((p) => p.id === id);
        return r && budget >= r.minPrice && budget <= r.maxPrice;
      });

    return searchMatch && statusMatch && catMatch && priceMatch;
  });

  const openCount    = userTenders.filter((t) => !["awarded", "cancelled"].includes(t.status)).length;
  const awardedCount = userTenders.filter((t) => t.status === "awarded").length;

  return (
    <div className="page-container">
      <Navbar user={currentUser} searchTerm={searchTerm} onSearchChange={setSearchTerm} handleSearch={() => {}} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto p-4 gap-4">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <PriceRangeFilter
            priceRanges={PRICE_RANGES}
            selectedPriceRanges={selectedPriceRanges}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {/* Profile header */}
          <div className="bg-white border-b border-slate-200 px-6 py-6">
            <div className="flex items-center gap-4">
              <Avatar src={profileUser?.profileImage} name={profileUser?.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-slate-900">{profileUser?.name}</h1>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <RiMailLine className="w-3.5 h-3.5" /> {profileUser?.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-500 capitalize">
                    <RiBriefcaseLine className="w-3.5 h-3.5" /> {profileUser?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-5 pt-5 border-t border-slate-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">{userTenders.length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Total Tenders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{openCount}</p>
                <p className="text-xs text-slate-500 mt-0.5">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-600">{awardedCount}</p>
                <p className="text-xs text-slate-500 mt-0.5">Awarded</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-5 bg-slate-100 rounded-xl p-1 w-fit">
              <button
                onClick={() => setActiveTab("open")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "open"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <RiFileList3Line className="w-4 h-4" /> Active Tenders
                {openCount > 0 && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5">
                    {openCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("awarded")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "awarded"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <RiCheckboxCircleLine className="w-4 h-4" /> Awarded
                {awardedCount > 0 && (
                  <span className="ml-1 text-xs bg-violet-100 text-violet-700 rounded-full px-1.5 py-0.5">
                    {awardedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tender grid */}
          <div className="p-6">
            {searchTerm && (
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                <RiSearchLine className="w-4 h-4" />
                Results for <span className="font-medium text-slate-700">"{searchTerm}"</span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <RiFileList3Line className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-medium">No tenders found</p>
                <p className="text-sm mt-1">
                  {activeTab === "awarded" ? "No awarded tenders." : "No active tenders."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((tender) => (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    user={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
