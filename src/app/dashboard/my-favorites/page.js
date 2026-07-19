"use client";

import { useEffect, useState } from "react";
import { getMyFavorites, favoriteLesson } from "@/actions/lessons";
import Link from "next/navigation";
import { Eye, BookmarkMinus, Folder, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

export default function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getMyFavorites();
      setFavorites(data || []);
      setFiltered(data || []);
    } catch (err) {
      toast.error("Failed to load saved favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Filter local data
  useEffect(() => {
    let result = [...favorites];
    if (category) {
      result = result.filter((f) => f.category === category);
    }
    if (tone) {
      result = result.filter((f) => f.emotionalTone === tone);
    }
    setFiltered(result);
  }, [category, tone, favorites]);

  // Remove from favorites handler
  const handleRemoveFavorite = async (lessonId) => {
    try {
      const res = await favoriteLesson(lessonId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Removed from favorites");
        setFavorites(favorites.filter((f) => f._id !== lessonId));
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-slate-200">
          Saved Favorites
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          A dedicated bookshelf of insights and personal wisdom you've collected from other creators.
        </p>
      </div>

      {/* Local Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Folder size={12} /> Category:
          </span>
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
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={12} /> Tone:
          </span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/50 text-slate-200 cursor-pointer"
          >
            <option value="">All Tones</option>
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {(category || tone) && (
          <button
            onClick={() => {
              setCategory("");
              setTone("");
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
          <span className="text-xs text-slate-400">Opening bookshelf...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/10 border border-slate-700/20 rounded-2xl p-6">
          <BookmarkMinus size={36} className="mx-auto text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">No favorited lessons match your selection.</p>
        </div>
      ) : (
        /* Table of favorites */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/40 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Lesson Title</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Emotional Tone</th>
                <th className="py-3 px-2">Author</th>
                <th className="py-3 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/20 text-slate-300">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3 px-2 max-w-[200px] truncate font-bold text-slate-200">
                    {item.title}
                  </td>
                  <td className="py-3 px-2">{item.category}</td>
                  <td className="py-3 px-2">{item.emotionalTone}</td>
                  <td className="py-3 px-2 font-medium">{item.creatorName}</td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <a
                        href={`/lessons/${item._id}`}
                        className="p-1.5 rounded bg-slate-800 hover:bg-indigo-500/15 border border-slate-700/30 text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Read Details"
                      >
                        <Eye size={12} />
                      </a>

                      <button
                        onClick={() => handleRemoveFavorite(item._id)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/15 border border-slate-700/30 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove Bookmark"
                      >
                        <BookmarkMinus size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
