"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="glass max-w-md w-full rounded-3xl border border-[var(--card-border)] p-8 text-center space-y-6 relative overflow-hidden shadow-2xl">
        
        {/* Glow / Background Design Accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg">
            <ShieldAlert size={40} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 p-1.5 rounded-full text-indigo-400">
            <Lock size={14} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-block">
            401 - Access Denied
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Oops! You don&apos;t have the required permissions to view this page. Please log in with an authorized account or return to safety.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Home Page</span>
          </Link>
        </div>

      </div>
    </div>
  );
}