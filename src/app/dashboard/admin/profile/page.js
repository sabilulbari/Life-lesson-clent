"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { updateProfile } from "@/actions/users";
import { ShieldCheck, Mail, Calendar, Sparkles, Save, FileEdit, Award } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const { data: session, update } = useSession();
  const [updating, setUpdating] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setPhoto(session.user.image || "");
    }
  }, [session]);

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
        toast.success("Admin profile updated successfully!");
        // Update Better Auth session locally
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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          Admin Profile Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review administrative credentials and update your public profile picture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-rose-400" title="Administrator">
            <ShieldCheck size={20} className="animate-pulse" />
          </div>

          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-700 mx-auto flex items-center justify-center text-white font-bold text-3xl border-2 border-rose-500/20 shadow-md">
            {photo ? (
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            ) : (
              name?.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h3 className="font-bold text-base text-slate-200">{name || "Administrator"}</h3>
            <span className="inline-flex items-center gap-1 mt-1 text-[9px] bg-rose-500/15 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/20">
              Moderator Role
            </span>
          </div>

          <div className="pt-4 border-t border-slate-800/40 text-left text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center space-x-2">
              <Mail size={12} className="text-rose-400" />
              <span className="truncate">{session.user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={12} className="text-rose-400" />
              <span>Joined {new Date(session.user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="md:col-span-2 p-5 rounded-2xl bg-slate-800/20 border border-slate-700/30 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileEdit size={13} /> Edit Moderator Persona
          </h3>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
              Admin Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
              Avatar Photo URL
            </label>
            <input
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-850 border border-slate-700/50 outline-none text-xs text-[var(--foreground)] focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              Administrative Email (ReadOnly)
            </label>
            <input
              type="text"
              disabled
              value={session.user.email}
              className="w-full px-3 py-2 rounded-xl bg-slate-800/20 border border-slate-800 text-xs text-slate-500 outline-none cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            {updating ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
            ) : (
              <>
                <Save size={12} />
                <span>Save Admin Profile</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
