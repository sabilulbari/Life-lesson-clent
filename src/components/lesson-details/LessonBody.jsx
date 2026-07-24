import Link from "next/link";
import { Lock, Heart, Bookmark, FileDown, Flag } from "lucide-react";

export default function LessonBody({ lesson, isLocked, liked, handleLike, favorited, handleFavorite, handleExportPDF, setReportModalOpen, handleShare }) {

  return (
    <div className="relative">
      {isLocked ? (
        <div className="relative">
          <div className="premium-blur text-slate-400 leading-relaxed text-sm space-y-4">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero...</p>
            <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta...</p>
          </div>
          {/* Premium Lock Banner overlay */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 border border-slate-800">
            <Lock size={44} className="text-indigo-400 mb-3 animate-pulse" />
            <h3 className="text-xl font-bold text-white mb-2">Premium Wisdom Lock</h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-5">
              This is a Premium life lesson. To read this story and gain its growth insights, upgrade your account to Premium.
            </p>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-sm text-white shadow-lg shadow-indigo-500/25 transition-all"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-sans">{lesson.description}</div>
      )}

      {/* Interaction Row */}
      {!isLocked && (
        <div className="pt-6 mt-6 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                liked ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-slate-800/40 border-slate-700/50 hover:text-rose-400"
              }`}
            >
              <Heart size={14} className={liked ? "fill-rose-400" : ""} />
              <span>{liked ? "Liked" : "Like"}</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                favorited ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" : "bg-slate-800/40 border-slate-700/50 hover:text-cyan-400"
              }`}
            >
              <Bookmark size={14} className={favorited ? "fill-cyan-400" : ""} />
              <span>{favorited ? "Saved" : "Save Favorite"}</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:text-indigo-400 text-xs font-semibold transition-all cursor-pointer"
            >
              <FileDown size={14} />
              <span>Export PDF</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 rounded-xl bg-slate-800/40 hover:bg-rose-500/10 border border-slate-700/50 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
              title="Report Lesson"
            >
              <Flag size={14} />
            </button>

            <div className="flex space-x-1 bg-slate-800/40 border border-slate-700/50 rounded-xl p-1">
              <button onClick={() => handleShare("facebook")} className="p-1 hover:text-indigo-400 transition-colors cursor-pointer" title="Share to Facebook">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              <button onClick={() => handleShare("x")} className="p-1 hover:text-indigo-400 transition-colors cursor-pointer" title="Share to X">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button onClick={() => handleShare("linkedin")} className="p-1 hover:text-indigo-400 transition-colors cursor-pointer" title="Share to LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
