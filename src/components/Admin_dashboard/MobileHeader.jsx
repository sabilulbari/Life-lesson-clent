"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function MobileHeader({ session, sidebarOpen, setSidebarOpen }) {
  const isAdmin = session?.user?.role === "admin";
  const isPremium = session?.user?.plan === "premium";

  return (
    <div className="md:hidden flex items-center justify-between glass p-4 rounded-2xl border border-[var(--card-border)] mb-4">
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
          {session?.user?.image ? (
            <Image src={session.user.image} height={32} width={32} alt="User" className="w-full h-full object-cover" />
          ) : (
            session?.user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="text-xs font-bold truncate max-w-[150px]">{session?.user?.name}</div>
          <div className="text-[9px] text-slate-500">{isAdmin ? "Administrator" : isPremium ? "Premium User" : "Free Member"}</div>
        </div>
      </div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </div>
  );
}
