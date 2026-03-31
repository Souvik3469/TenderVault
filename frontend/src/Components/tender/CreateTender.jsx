import React, { useState } from "react";
import { createTender, uploadTenderImage } from "../../api/tender";
import Navbar from "../Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../utils/Loading";
import { GetMyDetailsQuery } from "../../api/user";
import Spinner from "../ui/Spinner";
import {
  RiFileList3Line, RiPriceTag3Line, RiTimeLine,
  RiImageLine, RiMoneyDollarCircleLine, RiUploadCloud2Line, RiLinkM,
} from "react-icons/ri";

const FormField = ({ label, icon: Icon, error, children }) => (
  <div className="form-group">
    <label className="label flex items-center gap-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />} {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const CATEGORIES = [
  "Electrical Works", "Civil Construction", "Road Infrastructure",
  "Solar Energy", "IT & Software", "Hospitality", "Healthcare", "Water Supply", "Other",
];

const CreateTender = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = GetMyDetailsQuery();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState("url"); // "url" | "upload"
  const [form, setForm] = useState({
    title: "", description: "", budget: "", category: "", deadline: "", imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  const showToast = (msg, type = "error") =>
    toast[type](msg, { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" });

  if (userLoading) return <Loading />;

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.budget || isNaN(Number(form.budget)) || Number(form.budget) <= 0)
      e.budget = "Enter a valid budget amount";
    if (!form.category) e.category = "Select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadTenderImage(file);
      setForm((f) => ({ ...f, imageUrl: url }));
      showToast("Image uploaded!", "success");
    } catch {
      showToast("Image upload failed. Try a URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await createTender({
        title: form.title,
        description: form.description,
        cost: Number(form.budget),
        category: form.category,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        imageUrl: form.imageUrl || undefined,
      });
      showToast("Tender created as draft! You can publish it from your profile.", "success");
      navigate("/myprofile");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Failed to create tender");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <RiFileList3Line className="w-6 h-6 text-blue-600" /> Post a New Tender
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tenders are created as <span className="font-medium text-amber-600">Draft</span> and
            must be published before vendors can bid.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5">
          <FormField label="Tender Title" icon={RiFileList3Line} error={errors.title}>
            <input
              className={`input ${errors.title ? "input-error" : ""}`}
              placeholder="e.g. Construction of Storm Drain Network — Phase 2"
              value={form.title}
              onChange={handleChange("title")}
            />
          </FormField>

          <FormField label="Description" icon={null} error={errors.description}>
            <textarea
              rows={4}
              className={`input resize-none ${errors.description ? "input-error" : ""}`}
              placeholder="Scope of work, requirements, deliverables…"
              value={form.description}
              onChange={handleChange("description")}
            />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Budget (₹ Lakhs)" icon={RiMoneyDollarCircleLine} error={errors.budget}>
              <input
                type="number"
                min="0"
                step="0.01"
                className={`input ${errors.budget ? "input-error" : ""}`}
                placeholder="e.g. 24.5"
                value={form.budget}
                onChange={handleChange("budget")}
              />
            </FormField>

            <FormField label="Category" icon={RiPriceTag3Line} error={errors.category}>
              <select
                className={`input appearance-none ${errors.category ? "input-error" : ""}`}
                value={form.category}
                onChange={handleChange("category")}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Bid Deadline (optional)" icon={RiTimeLine}>
            <input
              type="datetime-local"
              className="input"
              value={form.deadline}
              onChange={handleChange("deadline")}
            />
          </FormField>

          <div className="form-group">
            <label className="label flex items-center gap-1.5">
              <RiImageLine className="w-3.5 h-3.5 text-slate-400" /> Cover Image (optional)
            </label>
            <div className="flex gap-1 mb-2">
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                  imageMode === "url"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                }`}
              >
                <RiLinkM className="w-3.5 h-3.5" /> Paste URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border font-medium transition-colors ${
                  imageMode === "upload"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                }`}
              >
                <RiUploadCloud2Line className="w-3.5 h-3.5" /> Upload File
              </button>
            </div>

            {imageMode === "url" ? (
              <input
                type="url"
                className="input"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange("imageUrl")}
              />
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg p-5 cursor-pointer hover:border-blue-400 transition-colors bg-slate-50">
                {uploading ? (
                  <><Spinner size="sm" /> <span className="text-sm text-slate-500">Uploading…</span></>
                ) : (
                  <>
                    <RiUploadCloud2Line className="w-7 h-7 text-slate-400" />
                    <span className="text-sm text-slate-500">Click to select an image</span>
                    <span className="text-xs text-slate-400">JPG, PNG, WebP — max 5 MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {form.imageUrl && (
            <div className="rounded-lg overflow-hidden h-32 border border-slate-200">
              <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary btn-lg flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary btn-lg flex-1 flex items-center justify-center gap-2">
              {loading ? <Spinner size="sm" className="text-white" /> : null}
              {loading ? "Creating…" : "Create Tender"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTender;
