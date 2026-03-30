import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { updateTender, tenderdetailsquery } from "../../api/tender";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetMyDetailsQuery } from "../../api/user";
import Loading from "../utils/Loading";
import Spinner from "../ui/Spinner";
import {
  RiFileList3Line, RiPriceTag3Line, RiTimeLine,
  RiImageLine, RiMoneyDollarCircleLine,
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

const UpdateTender = () => {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const { data: tenderDetails, isLoading, isError } = tenderdetailsquery(tenderId);
  const { data: user, isLoading: userLoading } = GetMyDetailsQuery();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", budget: "", category: "", deadline: "", imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isLoading && !isError && tenderDetails) {
      const deadline = tenderDetails.deadline
        ? new Date(tenderDetails.deadline).toISOString().slice(0, 16)
        : "";
      setForm({
        title: tenderDetails.title ?? "",
        description: tenderDetails.description ?? "",
        budget: String(tenderDetails.budget ?? tenderDetails.cost ?? ""),
        category: tenderDetails.category ?? "",
        deadline,
        imageUrl: tenderDetails.imageUrl ?? "",
      });
    }
  }, [tenderDetails, isLoading, isError]);

  const showToast = (msg, type = "error") =>
    toast[type](msg, { position: "top-center", autoClose: 4000, hideProgressBar: true, theme: "light" });

  if (isLoading || userLoading) return <Loading />;
  if (isError) return (
    <div className="page-container flex items-center justify-center h-screen text-slate-500">
      Failed to load tender details.
    </div>
  );

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
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await updateTender(tenderId, {
        title: form.title,
        description: form.description,
        cost: Number(form.budget),
        category: form.category,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : undefined,
        imageUrl: form.imageUrl || undefined,
      });
      showToast("Tender updated successfully!", "success");
      navigate("/myprofile");
    } catch (err) {
      showToast(err?.response?.data?.message ?? "Failed to update tender");
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
            <RiFileList3Line className="w-6 h-6 text-blue-600" /> Edit Tender
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Update tender details. Changes will be reflected immediately.
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

          <div className="grid sm:grid-cols-2 gap-5">
            <FormField label="Bid Deadline (optional)" icon={RiTimeLine}>
              <input
                type="datetime-local"
                className="input"
                value={form.deadline}
                onChange={handleChange("deadline")}
              />
            </FormField>

            <FormField label="Cover Image URL (optional)" icon={RiImageLine}>
              <input
                type="url"
                className="input"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange("imageUrl")}
              />
            </FormField>
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
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTender;
