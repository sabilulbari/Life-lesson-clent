"use client";

import { useEffect, useState } from "react";
import { getAdminLessons, deleteLesson, toggleFeatureLesson, reviewLesson } from "@/actions/lessons";
import Link from "next/link";
import { Globe, Lock, Unlock, Eye, Star, CheckSquare, Trash2, SlidersHorizontal, BookOpen, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];

export default function ManageLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [isReviewed, setIsReviewed] = useState("");

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const data = await getAdminLessons({
        category,
        visibility,
        isReviewed
      });
      setLessons(data || []);
    } catch (err) {
      toast.error("Failed to load platform lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, [category, visibility, isReviewed]);

  // Toggle Featured status
  const handleToggleFeatured = async (lessonId) => {
    try {
      const res = await toggleFeatureLesson(lessonId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.featured ? "Lesson added to Homepage Featured list!" : "Lesson removed from Featured list");
        setLessons(lessons.map((l) => (l._id === lessonId ? { ...l, featured: res.featured } : l)));
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Mark as reviewed
  const handleMarkReviewed = async (lessonId) => {
    try {
      const res = await reviewLesson(lessonId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Content marked as reviewed.");
        setLessons(lessons.map((l) => (l._id === lessonId ? { ...l, isReviewed: true } : l)));
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // Delete lesson
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteLesson(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Lesson moderated and deleted permanently.");
        setLessons(lessons.filter((l) => l._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      toast.error("Failed to delete lesson");
    } finally {
      setDeleting(false);
    }
  };

  // Stats
  const publicCount = lessons.filter((l) => l.visibility === "Public").length;
  const privateCount = lessons.filter((l) => l.visibility === "Private").length;
  const flaggedCount = lessons.filter((l) => l.isReviewed === false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          Moderation Panel
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Moderate lessons, mark content as reviewed, and select lessons to feature on the homepage.
        </p>
      </div>

      {/* Moderation Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Public Lessons</div>
          <div className="text-xl font-bold text-slate-200 mt-0.5">{publicCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Private Lessons</div>
          <div className="text-xl font-bold text-slate-200 mt-0.5">{privateCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/10 border border-slate-700/20 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unreviewed Content</div>
          <div className="text-xl font-bold text-amber-400 mt-0.5">{flaggedCount}</div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/50 text-slate-200 cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Visibility:</span>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/50 text-slate-200 cursor-pointer"
          >
            <option value="">All Visibility</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Reviewed:</span>
          <select
            value={isReviewed}
            onChange={(e) => setIsReviewed(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/50 text-slate-200 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="true">Reviewed</option>
            <option value="false">Unreviewed</option>
          </select>
        </div>

        {(category || visibility || isReviewed) && (
          <button
            onClick={() => {
              setCategory("");
              setVisibility("");
              setIsReviewed("");
            }}
            className="text-rose-400 font-semibold underline ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full mb-3" />
          <span className="text-xs text-slate-400">Loading platform database...</span>
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-sm text-slate-400 py-10 text-center">No platform lessons match the filters.</p>
      ) : (
        /* Lessons Moderation Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Author</th>
                <th className="py-3 px-2 text-center">Access</th>
                <th className="py-3 px-2 text-center">Featured</th>
                <th className="py-3 px-2 text-center">Reviewed</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-slate-300">
              {lessons.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3 px-2 max-w-[200px] truncate font-bold text-slate-200">
                    {item.title}
                  </td>
                  <td className="py-3 px-2">{item.category}</td>
                  <td className="py-3 px-2 font-medium">{item.creatorName}</td>
                  
                  {/* Access */}
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                      item.accessLevel === "Premium" ? "bg-indigo-500/15 text-indigo-400" : "bg-emerald-500/15 text-emerald-400"
                    }`}>
                      {item.accessLevel}
                    </span>
                  </td>

                  {/* Featured */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleToggleFeatured(item._id)}
                      className={`p-1 rounded-lg border transition-colors ${
                        item.featured
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-slate-800 border-slate-700/50 text-slate-500 hover:text-amber-400"
                      }`}
                      title={item.featured ? "Remove Featured" : "Make Featured"}
                    >
                      <Star size={12} className={item.featured ? "fill-amber-400" : ""} />
                    </button>
                  </td>

                  {/* Reviewed */}
                  <td className="py-3 px-2 text-center">
                    {item.isReviewed ? (
                      <span className="text-emerald-400 font-bold">Yes</span>
                    ) : (
                      <button
                        onClick={() => handleMarkReviewed(item._id)}
                        className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-emerald-500/20 text-amber-400 hover:text-emerald-400 border border-amber-500/25 hover:border-emerald-500/30 transition-colors font-semibold"
                      >
                        Verify
                      </button>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <a
                        href={`/lessons/${item._id}`}
                        className="p-1.5 rounded bg-slate-850 hover:bg-indigo-500/15 border border-slate-700/30 text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Inspect Lesson"
                      >
                        <Eye size={12} />
                      </a>

                      <button
                        onClick={() => setDeleteId(item._id)}
                        className="p-1.5 rounded bg-slate-850 hover:bg-rose-500/15 border border-slate-700/30 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Content"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Content Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <AlertTriangle size={36} className="text-rose-500 mx-auto animate-pulse" />
            <h3 className="text-base font-bold text-slate-200">Delete Inappropriate Lesson?</h3>
            <p className="text-xs text-slate-400">
              Are you sure? This will permanently delete this lesson from the entire platform.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-850 text-xs font-semibold text-slate-300 hover:bg-slate-750 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center"
              >
                {deleting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                ) : (
                  <span>Moderate & Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
