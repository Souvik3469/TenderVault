import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink, Element } from "react-scroll";
import { useTranslation } from "react-i18next";
import { GetMyDetailsQuery } from "../api/user";
import {
  RiMenuLine, RiCloseLine, RiArrowRightLine,
  RiShieldCheckLine, RiTimeLine, RiGroupLine,
  RiBarChartLine, RiCheckboxCircleLine, RiBriefcaseLine,
} from "react-icons/ri";
import featured from "../img/featured1.jpg";
import electric from "../img/electric.jpg";
import solar from "../img/solar.jpg";
import hotel from "../img/hotel.jpg";
import road from "../img/road.jpg";
import img1 from "../img/water.jpg";
import img2 from "../img/cloud.png";
import img3 from "../img/hotel.jpg";
import img4 from "../img/solar.jpg";

// ─── Sub-components ──────────────────────────────────────────────────────────

const LandingNav = ({ user, menuOpen, setMenuOpen, changeLanguage }) => (
  <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center h-16">
        <Link to="/" className="flex-shrink-0 mr-8">
          <span className="font-mont font-bold text-2xl tracking-tight">
            <span className="text-blue-400">Tender</span>
            <span className="text-white">Vault</span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {user && (
            <Link to="/home"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition">
              Dashboard
            </Link>
          )}
          {["aboutus", "explore", "stories"].map((id) => (
            <ScrollLink key={id} to={id} smooth duration={500}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition cursor-pointer capitalize">
              {id === "aboutus" ? "About" : id}
            </ScrollLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-white/8 border border-white/10 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="en">EN</option>
            <option value="hi">हि</option>
            <option value="be">বা</option>
            <option value="gj">ગુ</option>
            <option value="pu">ਪੰ</option>
          </select>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-sm">Hi, {user.name?.split(" ")[0]}</span>
              <Link to="/home"
                className="btn-primary btn-sm flex items-center gap-1.5">
                Dashboard <RiArrowRightLine className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-300 text-sm font-medium hover:text-white transition px-3 py-1.5">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="sm:hidden ml-auto p-2 text-slate-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenuLine className="w-6 h-6" />}
        </button>
      </div>
    </div>

    {menuOpen && (
      <div className="sm:hidden border-t border-white/5 bg-navy-900 px-4 py-4 flex flex-col gap-2 animate-fade-in">
        {user && <Link to="/home" onClick={() => setMenuOpen(false)} className="text-slate-200 text-sm font-medium py-2">Dashboard</Link>}
        {["aboutus", "explore", "stories"].map((id) => (
          <ScrollLink key={id} to={id} smooth duration={500} onClick={() => setMenuOpen(false)}
            className="text-slate-200 text-sm font-medium py-2 cursor-pointer capitalize">
            {id === "aboutus" ? "About" : id}
          </ScrollLink>
        ))}
        <div className="pt-2 border-t border-white/5 flex flex-col gap-2 mt-1">
          {user ? (
            <Link to="/home" className="btn-primary btn-md text-center">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary btn-md text-center">Sign In</Link>
              <Link to="/register" className="btn-primary btn-md text-center">Get Started</Link>
            </>
          )}
        </div>
      </div>
    )}
  </header>
);

const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</div>
    <div className="text-blue-200 text-sm">{label}</div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow">
    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const CategoryCard = ({ img, label, count }) => (
  <div className="group relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer">
    <div className="aspect-[4/3] overflow-hidden">
      <img src={img} alt={label}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <p className="text-white font-semibold text-base">{label}</p>
      {count && <p className="text-slate-300 text-xs mt-0.5">{count} active tenders</p>}
    </div>
  </div>
);

const TestimonialCard = ({ img, name, role, quote, large }) => (
  <div className={`bg-slate-50 rounded-xl overflow-hidden border border-slate-100 ${large ? "flex flex-col" : "flex gap-4 p-5"}`}>
    {large ? (
      <>
        <div className="h-48 overflow-hidden">
          <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-5">
          <p className="text-slate-600 text-sm italic mb-3 leading-relaxed">"{quote}"</p>
          <p className="font-semibold text-slate-900 text-sm">{name}</p>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </>
    ) : (
      <>
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-slate-600 text-sm italic mb-2 leading-relaxed">"{quote}"</p>
          <p className="font-semibold text-slate-900 text-xs">{name}</p>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: user } = GetMyDetailsQuery();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="min-h-screen bg-white">
      <LandingNav user={user} menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        changeLanguage={changeLanguage} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={featured} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-xs font-semibold tracking-wide uppercase">
                B2B Tender Management Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6 font-mont">
              Streamline Your <span className="text-blue-400">Tender</span> Process
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Post tenders, receive competitive bids, and award contracts — all in one
              transparent platform built for modern procurement teams.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                <Link to="/home" className="btn-primary btn-xl flex items-center gap-2">
                  Go to Dashboard <RiArrowRightLine className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary btn-xl flex items-center gap-2">
                    Start Free <RiArrowRightLine className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="btn btn-xl border border-white/20 text-white hover:bg-white/10">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-700/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <StatItem value="2,400+" label="Tenders Posted" />
              <StatItem value="8,100+" label="Bids Submitted" />
              <StatItem value="1,200+" label="Companies" />
              <StatItem value="98%" label="Satisfaction Rate" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────────────────── */}
      <Element name="aboutus">
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-blue-600 text-sm font-semibold tracking-wide uppercase">
                  {t("a1")}
                </span>
                <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-5 leading-tight">
                  {t("a2")}
                </h2>
                <p className="text-slate-600 leading-relaxed text-base mb-8">
                  {t("a3")}
                </p>
                <div className="grid gap-4">
                  <FeatureCard icon={RiShieldCheckLine} title="Transparent & Auditable"
                    desc="Every bid, review, and award is logged with full history for compliance." />
                  <FeatureCard icon={RiTimeLine} title="Deadline Enforcement"
                    desc="Automated deadline controls prevent late submissions and disputes." />
                  <FeatureCard icon={RiBarChartLine} title="Bid Analytics"
                    desc="Compare proposals side-by-side with price statistics and vendor ratings." />
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img src={featured} alt="platform" className="w-full h-auto object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <RiCheckboxCircleLine className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Bid Accepted</p>
                      <p className="text-xs text-slate-500">Solar Farm Project — ₹ 24L</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Element>

      {/* ── EXPLORE CATEGORIES ───────────────────────────────────────────────── */}
      <Element name="explore">
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-sm font-semibold tracking-wide uppercase">
                {t("a4")}
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2">
                {t("a5")}
              </h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                From infrastructure to technology — find or post tenders across every sector.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryCard img={electric} label={t("a6")} count="142" />
              <CategoryCard img={solar} label={t("a7")} count="89" />
              <CategoryCard img={hotel} label={t("a8")} count="63" />
              <CategoryCard img={road} label={t("a9")} count="211" />
            </div>
            <div className="text-center mt-10">
              <Link to={user ? "/home" : "/register"}
                className="btn-secondary btn-lg inline-flex items-center gap-2">
                Browse All Tenders <RiArrowRightLine className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </Element>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-sm font-semibold tracking-wide uppercase">Simple Process</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">How TenderVault Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", icon: RiBriefcaseLine, title: "Post a Tender", desc: "Companies create detailed tender listings with deadlines, budgets, and requirements." },
              { step: "02", icon: RiGroupLine, title: "Receive Bids", desc: "Qualified vendors submit competitive proposals. Review all bids in one place." },
              { step: "03", icon: RiCheckboxCircleLine, title: "Award & Contract", desc: "Select the winning bid with full audit trail and notify all participants automatically." },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-5">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[11px] font-bold text-blue-400 tracking-widest">
                  STEP {step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <Element name="stories">
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-blue-600 text-sm font-semibold tracking-wide uppercase">
                {t("a11")}
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mt-2">
                {t("a12")}
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <TestimonialCard large img={img1}
                name={t("a13")}
                role="Government Body"
                quote={t("a14")} />
              <div className="flex flex-col gap-6">
                {[
                  { img: img2, name: t("a15"), role: "IT Services",   quote: t("a16") },
                  { img: img3, name: t("a17"), role: "Hotel Chain",    quote: t("a18") },
                  { img: img4, name: t("a19"), role: "Solar Energy",   quote: t("a20") },
                ].map((item, i) => (
                  <TestimonialCard key={i} {...item} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Element>

      {/* ── CTA STRIP ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to modernize your procurement?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join thousands of companies and vendors already using TenderVault.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary btn-xl flex items-center gap-2">
              Create Free Account <RiArrowRightLine className="w-5 h-5" />
            </Link>
            <ScrollLink to="aboutus" smooth duration={500}
              className="btn btn-xl border border-white/20 text-white hover:bg-white/10 cursor-pointer">
              Learn More
            </ScrollLink>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mont font-bold text-xl">
              <span className="text-blue-400">Tender</span>
              <span className="text-white">Vault</span>
            </span>
            <p className="text-sm">© {new Date().getFullYear()} TenderVault — All Rights Reserved.</p>
            <div className="flex gap-5 text-sm">
              {user && <Link to="/home" className="hover:text-white transition">Dashboard</Link>}
              <ScrollLink to="aboutus" smooth duration={500} className="hover:text-white transition cursor-pointer">About</ScrollLink>
              <ScrollLink to="explore" smooth duration={500} className="hover:text-white transition cursor-pointer">Explore</ScrollLink>
              <ScrollLink to="stories" smooth duration={500} className="hover:text-white transition cursor-pointer">Stories</ScrollLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
