import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { loginUser } from "../../api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { RiMailLine, RiLockLine, RiArrowRightLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../ui/Spinner";
import login1 from "../../assets/login2.jpg";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const showToast = (msg, type = "error") =>
    toast[type](msg, { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await loginUser(formData);
      // BE response: { success, message, data: { accessToken, user } }
      const token = response.data?.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        showToast("Welcome back!", "success");
        navigate("/");
      } else {
        showToast("Unexpected response from server");
      }
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={login1} alt="bg" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-blue-700/60" />
        <div className="relative z-10 flex flex-col justify-center p-14 text-white">
          <Link to="/" className="mb-10 inline-block">
            <span className="font-mont font-bold text-3xl">
              <span className="text-blue-300">Tender</span>Vault
            </span>
          </Link>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Streamline your<br />procurement process
          </h2>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs">
            Manage tenders, bids, and contracts — all in one secure, transparent platform.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            {["Post and manage tenders", "Receive competitive bids", "Award contracts with full audit trail"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center">
                  <RiArrowRightLine className="w-3 h-3 text-blue-300" />
                </div>
                <span className="text-blue-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden inline-block mb-8">
            <span className="font-mont font-bold text-2xl">
              <span className="text-blue-600">Tender</span>
              <span className="text-slate-900">Vault</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
          <p className="text-slate-500 text-sm mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

            {/* Password */}
            <div className="form-group">
              <label className="label">Password</label>
              <div className="relative">
                <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`input pl-10 pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register("password", { required: "Password is required" })}
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
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <RiArrowRightLine className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
