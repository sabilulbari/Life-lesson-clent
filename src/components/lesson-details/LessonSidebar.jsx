import Link from "next/link";
import { Calendar, Clock, Globe, Heart, Bookmark, Eye } from "lucide-react";
import { MdEditCalendar } from "react-icons/md";

export default function LessonSidebar({ lesson, readingTime, likesCount, favCount, viewsCount }) {
  return (
    <div className="space-y-6">
      {/* Metadata Block */}
      <div className="glass rounded-3xl border border-(--card-border) p-6 space-y-4">
        <h3 className="font-bold text-lg font-display pb-2 border-b border-slate-800/40">Metadata</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} /> Created
            </span>
            <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MdEditCalendar size={13} /> Updated at
            </span>
            <span>{new Date(lesson.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock size={13} /> Reading Time
            </span>
            <span>{readingTime} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe size={13} /> Visibility
            </span>
            <span>{lesson.visibility}</span>
          </div>
        </div>
      </div>

      {/* Engagement Statistics */}
      <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4">
        <h3 className="font-bold text-lg font-display pb-2 border-b border-slate-800/40">Engagement</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3">
            <Heart size={16} className="text-rose-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-slate-200">{likesCount}</div>
            <div className="text-[9px] text-slate-500 uppercase">Likes</div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3">
            <Bookmark size={16} className="text-cyan-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-slate-200">{favCount}</div>
            <div className="text-[9px] text-slate-500 uppercase">Saved</div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-3">
            <Eye size={16} className="text-indigo-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-slate-200">{viewsCount}</div>
            <div className="text-[9px] text-slate-500 uppercase">Views</div>
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div className="glass rounded-3xl border border-[var(--card-border)] p-6 space-y-4 text-center">
        <h3 className="font-bold text-lg font-display pb-2 border-b border-slate-800/40 text-left">About Author</h3>
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 mx-auto flex items-center justify-center text-white font-bold text-xl border-2 border-indigo-500/30 shadow-md">
            {lesson.creatorPhoto ? <img src={lesson.creatorPhoto} alt={lesson.creatorName} className="w-full h-full object-cover" /> : lesson.creatorName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-200">{lesson.creatorName}</h4>
            <p className="text-[10px] text-slate-400">Wise Contributor</p>
          </div>
          <Link
            href={`/public-lessons?search=${encodeURIComponent(lesson.creatorName)}`}
            className="block w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700/50 hover:text-white transition-colors"
          >
            View all lessons by author
          </Link>
        </div>
      </div>
    </div>
  );
}
