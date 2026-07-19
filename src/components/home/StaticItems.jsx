import { Award, BookOpen, Compass, Zap } from "lucide-react";
import React from "react";

const StaticItems = () => {
  return (
    <div>
      <section className="space-y-8 py-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Why Preserving Wisdom Matters</h2>
          <p className="text-sm text-slate-400">Capturing your insights creates a compass for your future self and inspires others.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass glass-hover p-6 rounded-2xl border border-(--card-border) text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-indigo-500/5">
              <BookOpen size={22} />
            </div>
            <h3 className="font-semibold text-lg">Retain Wisdom</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We experience life daily but forget crucial realizations. Documenting wisdom preserves lessons forever.</p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl border border-(--card-border) text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-cyan-500/5">
              <Compass size={22} />
            </div>
            <h3 className="font-semibold text-lg">Mindful Reflection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Writing forces mindful introspection, clarifying mistakes and turning challenges into positive growth.</p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl border border-(--card-border) text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-emerald-500/5">
              <Award size={22} />
            </div>
            <h3 className="font-semibold text-lg">Inspire Growth</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Share public reflections to light paths for others who may be facing the exact same trials.</p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl border border-(--card-border) text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-rose-500/5">
              <Zap size={22} />
            </div>
            <h3 className="font-semibold text-lg">Premium Library</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Access curated mental models and lessons from developers, entrepreneurs, and global contributors.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StaticItems;
