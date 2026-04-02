import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
  RiAddCircleLine,
  RiHomeLine,
  RiUser3Line,
  RiLogoutBoxLine,
  RiDashboardLine,
} from "react-icons/ri";
import NotificationBell from "./notifications/NotificationBell";

const Navbar = ({ searchTerm = "", onSearchChange, handleSearch, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && handleSearch) handleSearch();
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-white/5 shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-mont font-bold text-xl tracking-tight">
              <span className="text-blue-400">Tender</span>
              <span className="text-white">Vault</span>
            </span>
          </Link>

          {/* Search — desktop */}
          {onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md relative ml-6">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tenders…"
                className="w-full bg-white/10 border border-white/10 text-white text-sm rounded-lg
                           pl-9 pr-4 py-1.5 placeholder-slate-400 caret-white
                           focus:outline-none focus:bg-white/15 focus:border-blue-500 transition"
              />
            </div>
          )}

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-auto">
            <Link to="/home" className="nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition">
              <RiHomeLine className="w-4 h-4" /> Home
            </Link>

            {user?.role === "company" && (
              <Link to="/createtender" className="nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition">
                <RiAddCircleLine className="w-4 h-4" /> Post Tender
              </Link>
            )}

            {user?.role === "admin" && (
              <Link to="/admin" className="nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition">
                <RiDashboardLine className="w-4 h-4" /> Dashboard
              </Link>
            )}

            {/* User greeting + role chip */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/6 ml-1">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-white text-xs font-semibold truncate max-w-[100px]">
                    {user.name?.length > 16 ? user.name.substring(0, 16) + "…" : user.name}
                  </span>
                  <span className="text-slate-400 text-[10px] capitalize">{user.role}</span>
                </div>
              </div>
            )}

            <NotificationBell />

            <Link to="/myprofile" title="Profile"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/8 transition">
              <RiUser3Line className="w-5 h-5" />
            </Link>

            <button onClick={handleLogout} title="Logout"
              className="p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/8 transition">
              <RiLogoutBoxLine className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto p-2 text-slate-300 hover:text-white"
          >
            {menuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenuLine className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile search */}
        {onSearchChange && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tenders…"
                className="w-full bg-white/10 border border-white/10 text-white text-sm rounded-lg
                           pl-9 pr-4 py-2 placeholder-slate-400 caret-white
                           focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-navy-900 px-4 py-4 flex flex-col gap-2 animate-fade-in">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/6 mb-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{user.name}</p>
                <p className="text-slate-400 text-xs capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <Link to="/home" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/8 text-sm font-medium">
            <RiHomeLine className="w-4 h-4" /> Home
          </Link>
          {user?.role === "company" && (
            <Link to="/createtender" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/8 text-sm font-medium">
              <RiAddCircleLine className="w-4 h-4" /> Post Tender
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/8 text-sm font-medium">
              <RiDashboardLine className="w-4 h-4" /> Admin Dashboard
            </Link>
          )}
          <Link to="/myprofile" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-white/8 text-sm font-medium">
            <RiUser3Line className="w-4 h-4" /> My Profile
          </Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-white/8 text-sm font-medium w-full text-left mt-1"
          >
            <RiLogoutBoxLine className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
