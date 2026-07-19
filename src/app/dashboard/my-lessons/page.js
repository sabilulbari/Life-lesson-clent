"use client";

import { useEffect, useState } from "react";
import { getMyLessons, deleteLesson, updateLesson } from "@/actions/lessons";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Eye, Edit2, Trash2, Globe, Lock, Unlock, HelpCircle, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function MyLessons() {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Delete Confirmation state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isPremiumUser = session?.user?.plan === "premium";

  const loadLessons = async () => {
    setLoading(true);
    try {
      const data = await getMyLessons();
      setLessons(data || []);
    } catch (err) {
      toast.error("Failed to load your lessons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // Handle visibility toggle directly in table
  const handleToggleVisibility = async (lesson) => {
    const newVisibility = lesson.visibility === "Public" ? "Private" : "Public";
    try {
      const res = await updateLesson(lesson._id, { visibility: newVisibility });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Lesson set to ${newVisibility}`);
        setLessons(lessons.map((l) => (l._id === lesson._id ? { ...l, visibility: newVisibility } : l)));
      }
    } catch (err) {
      toast.error("Failed to change visibility");
    }
  };

  // Handle access level toggle directly in table
  const handleToggleAccess = async (lesson) => {
    if (!isPremiumUser) {
      toast.error("Upgrade to Premium to change lesson access levels.");
      return;
    }
    const newAccess = lesson.accessLevel === "Premium" ? "Free" : "Premium";
    try {
      const res = await updateLesson(lesson._id, { accessLevel: newAccess });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Access level changed to ${newAccess}`);
        setLessons(lessons.map((l) => (l._id === lesson._id ? { ...l, accessLevel: newAccess } : l)));
      }
    } catch (err) {
      toast.error("Failed to change access level");
    }
  };

  // Handle Delete Confirmation
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await deleteLesson(deleteId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Lesson deleted successfully");
        setLessons(lessons.filter((l) => l._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      toast.error("Failed to delete lesson");
    } finally {
      setDeleting(false);
    }
  };

  // Prefill Edit modal
  const openEditModal = (lesson) => {
    setEditData({ ...lesson });
    setEditModalOpen(true);
  };

  // Submit Edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editData.title || !editData.description) {
      toast.error("Title and description are required.");
      return;
    }

    setUpdating(true);
    try {
      const res = await updateLesson(editData._id, {
        title: editData.title,
        category: editData.category,
        emotionalTone: editData.emotionalTone,
        image: editData.image,
        visibility: editData.visibility,
        accessLevel: isPremiumUser ? editData.accessLevel : "Free",
        description: editData.description,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Lesson updated successfully!");
        setLessons(lessons.map((l) => (l._id === editData._id ? res.lesson : l)));
        setEditModalOpen(false);
        setEditData(null);
      }
    } catch (err) {
      toast.error("Failed to update lesson.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          My Lessons Library
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your entries, toggle privacy settings, and inspect readers engagement.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full mb-3" />
          <span className="text-xs text-slate-400">Loading your library...</span>
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/10 border border-slate-700/20 rounded-2xl p-6">
          <Globe size={36} className="mx-auto text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">No lessons created yet.</p>
          <Link
            href="/dashboard/add-lesson"
            className="inline-block mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Create Your First Lesson
          </Link>
        </div>
      ) : (
        /* Tabular Layout */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2 text-center">Visibility</th>
                <th className="py-3 px-2 text-center">Access</th>
                <th className="py-3 px-2 text-center">Likes / Saves</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-slate-300">
              {lessons.map((lesson) => (
                <tr key={lesson._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3 px-2 max-w-[200px] truncate font-bold text-slate-200">
                    {lesson.title}
                  </td>
                  <td className="py-3 px-2">{lesson.category}</td>
                  
                  {/* Visibility Toggler */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleToggleVisibility(lesson)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-semibold ${
                        lesson.visibility === "Public"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700/50"
                      }`}
                    >
                      <Globe size={11} />
                      <span>{lesson.visibility}</span>
                    </button>
                  </td>

                  {/* Access Level Toggler */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleToggleAccess(lesson)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-semibold ${
                        lesson.accessLevel === "Premium"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700/50"
                      }`}
                    >
                      {lesson.accessLevel === "Premium" ? <Lock size={11} /> : <Unlock size={11} />}
                      <span>{lesson.accessLevel}</span>
                    </button>
                  </td>

                  {/* Stats */}
                  <td className="py-3 px-2 text-center font-bold">
                    {lesson.likesCount} ❤️ / {lesson.favoritesCount} 🔖
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="p-1.5 rounded bg-slate-850 hover:bg-indigo-500/10 border border-slate-700/30 text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Read Lesson Details"
                      >
                        <Eye size={12} />
                      </Link>
                      
                      <button
                        onClick={() => openEditModal(lesson)}
                        className="p-1.5 rounded bg-slate-850 hover:bg-amber-500/10 border border-slate-700/30 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit2 size={12} />
                      </button>

                      <button
                        onClick={() => setDeleteId(lesson._id)}
                        className="p-1.5 rounded bg-slate-850 hover:bg-rose-500/10 border border-slate-700/30 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Permanently"
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

      {/* Edit Lesson Modal */}
      {editModalOpen && editData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/40">
              <h3 className="text-lg font-bold font-display text-slate-200">Update Life Lesson</h3>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditData(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500"
                />
              </div>

              {/* Category & Tone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Emotional Tone
                  </label>
                  <select
                    value={editData.emotionalTone}
                    onChange={(e) => setEditData({ ...editData, emotionalTone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500 cursor-pointer"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image & Visibility & Access */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editData.image}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    Visibility
                  </label>
                  <select
                    value={editData.visibility}
                    onChange={(e) => setEditData({ ...editData, visibility: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    Access Level
                    {!isPremiumUser && <HelpCircle size={10} className="text-slate-500" />}
                  </label>
                  <select
                    value={editData.accessLevel}
                    onChange={(e) => setEditData({ ...editData, accessLevel: e.target.value })}
                    disabled={!isPremiumUser}
                    className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="Free">Free</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Story / Insight Content *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500 font-sans"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditData(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-xs flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
                >
                  {updating ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <>
                      <Save size={12} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <Trash2 size={36} className="text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">Delete Permanently?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this life lesson? This action is irreversible.
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
                  <span>Delete Lesson</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
