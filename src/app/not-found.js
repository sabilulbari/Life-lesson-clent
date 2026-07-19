import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 text-center space-y-5">
      <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-4xl font-black border border-indigo-500/25 animate-pulse">
        <Compass size={40} />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-100">
          404 - Path Lost
        </h1>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          The life lessons path you are trying to browse does not exist or has been deleted by moderators.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-semibold text-xs text-white shadow-lg shadow-indigo-500/25 transition-all inline-block active:scale-95"
        >
          Return to Safe Path
        </Link>
      </div>
    </div>
  );
}
