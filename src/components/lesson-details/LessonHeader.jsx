import { Sparkles } from "lucide-react";

export default function LessonHeader({ lesson, isPremium }) {
  return (
    <div className="space-y-6">
      {/* Category / Emotional tone */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">{lesson.category}</span>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-semibold border border-slate-700/50">{lesson.emotionalTone}</span>
          <span
            className={`px-2.5 py-1 rounded-lg font-bold text-xs uppercase ${
              isPremium ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {lesson.accessLevel}
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-display">{lesson.title}</h1>

      {/* Featured Image */}
      {lesson.lessonImage && (
        <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800/50 bg-slate-900 flex items-center justify-center">
          <img src={lesson.lessonImage} alt={lesson.title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
