"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { HelpCircle, PlusCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { createLesson } from "@/lib/action/lession";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function AddLesson() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Personal Growth",
    emotionalTone: "Motivational",
    image: "",
    accessLevel: "Free",
    visibility: "Public",
    description: ""
  });

  const isPremiumUser = session?.user?.plan === "premium";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "form data ")
    if (!formData.title || !formData.description) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);
    try {
      // Force Free if user is not premium
      const submitData = {
        ...formData,
        accessLevel: isPremiumUser ? formData.accessLevel : "Free"
      };

      const res = await createLesson(submitData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Life lesson posted successfully!");
        router.push("/dashboard/my-lessons");
        router.refresh();
      }
    } catch (err) {
      toast.error("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">Share Your Realization</h1>
        <p className="text-xs text-slate-400 mt-1">Document your personal growth or milestones and help inspire the community.</p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Lesson Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Failure is the Best Teacher in Software Engineering"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-[var(--foreground)] transition-all"
          />
        </div>

        {/* Category & Emotional Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 outline-none text-sm text-[var(--foreground)] focus:border-indigo-500 transition-all cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Emotional Tone *</label>
            <select
              name="emotionalTone"
              value={formData.emotionalTone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 outline-none text-sm text-[var(--foreground)] focus:border-indigo-500 transition-all cursor-pointer"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL & Access Level & Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Image (Optional) */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Featured Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-[var(--foreground)] transition-all"
            />
          </div>

          {/* Access Level (Premium toggle restricted) */}
          <div className="sm:col-span-1 relative">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide flex items-center gap-1">
              Access Level
              {!isPremiumUser && (
                <HelpCircle size={12} className="text-slate-500 cursor-help" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} />
              )}
            </label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              disabled={!isPremiumUser}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 outline-none text-sm text-[var(--foreground)] focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="Free">Free (Public View)</option>
              <option value="Premium">Premium (Only Paid Users)</option>
            </select>

            {/* Tooltip Overlay */}
            {showTooltip && !isPremiumUser && (
              <div className="absolute z-40 top-full mt-1.5 left-0 right-0 p-2.5 rounded-xl glass border border-indigo-500/30 text-[10px] text-indigo-400 font-semibold leading-relaxed shadow-lg">
                Upgrade to Premium to create paid lessons.
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 outline-none text-sm text-[var(--foreground)] focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="Public">Public (Browse feed)</option>
              <option value="Private">Private (Dashboard only)</option>
            </select>
          </div>
        </div>

        {/* Description / Stories */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Full Description / Story / Insight *</label>
          <textarea
            name="description"
            required
            rows={8}
            value={formData.description}
            onChange={handleChange}
            placeholder="Share the full context, the challenge faced, the breakthrough moment, and the lessons learned..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-[var(--foreground)] transition-all font-sans"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Post Life Lesson</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
