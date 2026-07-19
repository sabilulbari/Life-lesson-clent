import { ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const LessionCard = ({ lesson, session }) => {
    
  const isPremium = lesson.accessLevel === "premium";
  const userPlan = session?.user?.plan || "free";
  const isLocked = isPremium && userPlan !== "premium" && session?.user?.role !== "admin" && session?.user?.id !== lesson.creatorId;
  return (
    <div className="glass rounded-2xl border border-(--card-border) p-5 flex flex-col justify-between h-75 hover:shadow-lg transition-all relative overflow-hidden group">
      {/* Blurred lock overlay if user is not premium */}
      {isLocked && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-4 text-center">
          <ShieldAlert size={36} className="text-indigo-400 mb-2 animate-bounce" />
          <h3 className="font-bold text-white text-base">Premium Lesson</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-50 mb-4">Upgrade to Premium to unlock this personal wisdom.</p>
          <Link href="/pricing" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors">
            Upgrade to View
          </Link>
        </div>
      )}

      {/* Card Body */}
      <div className="space-y-3">
        {/* Category & Badge */}
        <div className="flex items-center justify-between text-xs">
          {/* <span className="font-semibold text-indigo-400 uppercase tracking-wide">{lesson.category}</span> */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} /> {lesson.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
              isPremium ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {lesson.accessLevel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg leading-snug line-clamp-2 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">{lesson.title}</h3>

        {/* Short Preview */}
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{lesson.description}</p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
        {/* Creator Info */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
            {lesson.creatorPhoto ? <img src={lesson.creatorPhoto} alt={lesson.creatorName} className="w-full h-full object-cover" /> : lesson.creatorName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 truncate max-w-25">{lesson.creatorName}</div>
            <div className="text-[10px] text-slate-500">{new Date(lesson.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Details button */}
        <Link
          href={`/public-lessons/${lesson._id}`}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-500 border border-slate-700/50 hover:border-indigo-400 font-semibold text-xs text-slate-200 hover:text-white transition-all duration-300 flex items-center space-x-1"
        >
          <span>Details</span>
          <ArrowRight size={10} />
        </Link>
      </div>
    </div>
  );
};

export default LessionCard;
