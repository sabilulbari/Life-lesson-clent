"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { updateProfile } from "@/actions/users";
import { getAuthorLessons } from "@/actions/lessons";
import { User, Award, Mail, Calendar, Eye, Bookmark, Sparkles, BookOpen, Save, FileEdit } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { data: session, update } = useSession();
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhoto(session.user.image || "");
      loadUserLessons();
    }
  }, [session]);

  const loadUserLessons = async () => {
    if (!session?.user?.id) return;
    setLoadingLessons(true);
    try {
      const data = await getAuthorLessons(session.user.id);
      setLessons(data || []);
    } catch (err) {
      console.error("Failed to load user lessons:", err);
    } finally {
      setLoadingLessons(false);
    }
  };

  // Submit profile updates
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setUpdating(true);
    try {
      const res = await updateProfile({ name, image: photo });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
        // Update Better Auth local session
        await update({
          name: name,
          image: photo
        });
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (!session) return null;

  const isPremium = session.user.plan === "premium";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          My Profile Dashboard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your stats, update your public persona, and inspect your published reflections.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Edit Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Details */}
          <div className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 text-center space-y-4 relative overflow-hidden">
            {isPremium && (
              <div className="absolute top-3 right-3 text-indigo-400" title="Premium member">
                <Award size={20} className="animate-pulse" />
              </div>
            )}
            
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-700 mx-auto flex items-center justify-center text-white font-bold text-3xl border-2 border-indigo-500/20 shadow-md">
              {photo ? (
                <img src={photo} alt={name} className="w-full h-full object-cover" />
              ) : (
                name?.charAt(0).toUpperCase()
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-200">{name || "Anonymous User"}</h3>
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                {isPremium ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/25 text-indigo-400 font-bold px-2 py-0.5 rounded-full">
                    <Sparkles size={8} /> Premium ⭐
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                    Free Plan
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/40 text-left text-xs text-slate-400 space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={13} className="text-indigo-400" />
                <span className="truncate">{session.user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={13} className="text-indigo-400" />
                <span>Joined {new Date(session.user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdate} className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileEdit size={13} /> Update Details
            </h3>

            {/* Display Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500"
              />
            </div>

            {/* Locked Email display */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                Email Address (ReadOnly)
              </label>
              <input
                type="text"
                disabled
                value={session.user.email}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/20 border border-slate-800 text-xs text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={updating}
              className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
            >
              {updating ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <Save size={12} />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Public Lessons Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen size={16} className="text-indigo-400" /> My Public Lessons ({lessons.length})
          </h3>

          {loadingLessons ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/10 border border-slate-700/20 rounded-2xl p-6 text-slate-400 text-xs">
              No public lessons published by you. Adjust visibility in your library to share with the community.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((item) => (
                <div
                  key={item._id}
                  className="p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 flex flex-col justify-between h-[200px]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-indigo-400 uppercase">{item.category}</span>
                      <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-200 line-clamp-2">{item.title}</h4>
                    <p className="text-slate-400 text-[11px] line-clamp-3">{item.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">{item.likesCount} Likes / {item.favoritesCount} Saved</span>
                    <a
                      href={`/lessons/${item._id}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-500 text-slate-300 hover:text-white transition-colors"
                    >
                      Read
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
