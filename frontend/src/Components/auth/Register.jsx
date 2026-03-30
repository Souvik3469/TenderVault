import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { registerUser } from "../../api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  RiUser3Line, RiMailLine, RiLockLine,
  RiBriefcaseLine, RiArrowRightLine,
} from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../ui/Spinner";
import register1 from "../../assets/register1.jpg";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: "", email: "", password: "", role: "" },
  });

  const showToast = (msg, type = "error") =>
    toast[type](msg, { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await registerUser(formData);
      showToast("Account created! Please sign in.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={register1} alt="bg" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-violet-700/60" />
        <div className="relative z-10 flex flex-col justify-center p-14 text-white">
          <Link to="/" className="mb-10 inline-block">
            <span className="font-mont font-bold text-3xl">
              <span className="text-blue-300">Tender</span>Vault
            </span>
          </Link>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join the platform<br />built for B2B procurement
          </h2>
          <p className="text-slate-200 text-base leading-relaxed max-w-xs">
            Whether you post tenders or submit bids, TenderVault gives you the tools to work faster and smarter.
          </p>

          <div className="mt-12 grid gap-4">
            {[
              { role: "Company", desc: "Post tenders, manage bids, award contracts" },
              { role: "Vendor",  desc: "Browse open tenders and submit competitive bids" },
            ].map(({ role, desc }) => (
              <div key={role} className="bg-white/8 rounded-xl border border-white/10 p-4">
                <p className="text-white font-semibold text-sm mb-0.5">{role}</p>
                <p className="text-slate-300 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden inline-block mb-8">
            <span className="font-mont font-bold text-2xl">
              <span className="text-blue-600">Tender</span>
              <span className="text-slate-900">Vault</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Create account</h1>
          <p className="text-slate-500 text-sm mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Name */}
            <div className="form-group">
              <label className="label">Full name</label>
              <div className="relative">
                <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  placeholder="Your full name"
                  className={`input pl-10 ${errors.name ? "input-error" : ""}`}
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="label">Email address</label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className={`input pl-10 ${errors.email ? "input-error" : ""}`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="label">I am a…</label>
              <div className="relative">
                <RiBriefcaseLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className={`input pl-10 appearance-none ${errors.role ? "input-error" : ""}`}
                  {...register("role", { required: "Select a role" })}
                >
                  <option value="">Select your role…</option>
                  <option value="company">Company — post tenders</option>
                  <option value="vendor">Vendor — submit bids</option>
                </select>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className={`input pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <AiFillEye size={18} /> : <AiFillEyeInvisible size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-lg w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Spinner size="sm" className="text-white" /> : null}
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <RiArrowRightLine className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
